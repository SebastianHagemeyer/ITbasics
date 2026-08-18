(function () {
  "use strict";

  // The course modules, in order. Each key is the quiz_name of that module's
  // test: programming/html/python come from the /quizzes/ page; binary and
  // codes come from the inline module tests (moduletest.js). The % is the
  // student's best score on that test.
  var MODULES = [
    { key: "programming", label: "Programming",    href: "/topics/programming/" },
    { key: "html",        label: "HTML",           href: "/topics/html/" },
    { key: "python",      label: "Python",         href: "/topics/python/" },
    { key: "pseudocode",  label: "Pseudocode",     href: "/topics/pseudocode/" },
    { key: "variables",   label: "Variables",      href: "/topics/variables/" },
    { key: "strings",     label: "Strings",        href: "/topics/strings/" },
    { key: "errors",      label: "Spot the Error", href: "/topics/errors/" },
    { key: "decisions",   label: "Making Decisions", href: "/topics/decisions/" },
    { key: "loops",       label: "Loops",          href: "/topics/loops/" },
    { key: "os",          label: "Computer Skills", href: "/topics/os/" },
    { key: "systems",     label: "Digital Systems", href: "/topics/systems/" },
    { key: "binary",      label: "Binary & Data",  href: "/topics/binary/" },
    { key: "codes",       label: "Codes & Colour", href: "/topics/codes/" },
    { key: "networks",    label: "Networks & Safety", href: "/topics/networks/" },
    { key: "ideas",       label: "Game Ideas & Design", href: "/topics/ideas/" }
  ];

  // The three retired lessons. They live behind the Legacy shelf on the
  // modules page, so they should not headline a student's progress either.
  // A score from one still shows if they actually sat it, just not a row of
  // "Not tried" for lessons nobody is being asked to do.
  var LEGACY = { programming: 1, html: 1, python: 1 };
  var CURRENT = MODULES.filter(function (m) { return !LEGACY[m.key]; });

  // Assignments shown on the progress page. Keys match the `assignment`
  // column in assignment_progress (and assignments.js).
  var ASSIGNMENTS = [
    { key: "petprogram", label: "Task 1: My First Program", href: "/assignments/pet-program/" },
    { key: "pixelart",   label: "Task 2: Pixel Painter",    href: "/assignments/pixel-painter/" }
  ];
  var TRACK_NAMES = { calc: "Pet Age Calculator", turtle: "Pet Turtle" };

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Teacher accounts get a shortcut to the export tool (/teacher/) right on their
  // own profile, so it does not have to be reached by typing the URL. Reuses the
  // same staff list as the /teacher/ passphrase skip (window.TEACHER_CODES in
  // supabase-config.js) so the two never drift apart.
  function isTeacher(student) {
    var codes = window.TEACHER_CODES || [];
    return Boolean(student && codes.indexOf(student.code) !== -1);
  }

  // Insert (or remove) the teacher-only link at the top of the progress page.
  function renderTeacherLink(student) {
    var existing = el("progress-teacher");
    if (!isTeacher(student)) { if (existing) existing.remove(); return; }
    if (existing) return;
    var content = el("progress-content");
    if (!content) return;
    var box = document.createElement("div");
    box.id = "progress-teacher";
    box.innerHTML =
      '<h2 class="section-title">Teacher</h2>' +
      '<div class="progress-cta">' +
        '<a href="/teacher/" class="btn btn-primary">Open the export tool</a>' +
      '</div>';
    content.insertBefore(box, content.firstChild);
  }

  // Every attempt row for the signed-in student. Online: one query scoped to
  // this student. Offline: rebuild rows from the localStorage buckets app.js
  // (and the module tests) write per quiz_name.
  async function loadAttempts(student) {
    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      var res = await sb.from("quiz_attempts")
        .select("quiz_name, score, total, answers")
        .eq("student_code", student.code);
      if (res.error) return { error: res.error.message, rows: [] };
      return { rows: res.data || [] };
    }
    var names = ["programming", "html", "python", "pseudocode", "pseudocode-task", "variables", "variables-task", "strings", "strings-task", "errors", "decisions", "decisions-task", "loops", "loops-for-task", "loops-while-task", "binary", "codes", "codes-task", "systems", "networks", "os", "ideas", "freeplay", "livecoding"];
    var rows = [];
    names.forEach(function (name) {
      var raw = localStorage.getItem("itbasics-attempts-" + student.code + "-" + name);
      if (!raw) return;
      var arr;
      try { arr = JSON.parse(raw); } catch (e) { arr = []; }
      arr.forEach(function (a) {
        rows.push({ quiz_name: name, score: a.score, total: a.total, answers: a.answers });
      });
    });
    return { rows: rows };
  }

  // Best score per module, plus Freeplay and Live Coding totals.
  // written holds the saved written answers for the two modules that blend
  // them in: { systems: <answers-systems>, ideas: <answers-ideas> }, either of
  // which may be null if they have not written anything yet.
  function summarise(rows, written) {
    written = written || {};
    var modules = {};
    MODULES.forEach(function (m) {
      var mine = rows.filter(function (r) { return r.quiz_name === m.key; });
      if (!mine.length) { modules[m.key] = { attempted: false }; return; }
      var best = mine.reduce(function (a, r) { return r.score > a.score ? r : a; }, mine[0]);
      var total = mine.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
      modules[m.key] = { attempted: true, best: best.score, total: total, attempts: mine.length };
    });

    // Pseudocode, Variables and Strings blend two halves the same way as Making
    // Decisions: the quick check (50%) and the task (50%). For Pseudocode the
    // task is the written exam answer rather than a coding challenge, but it
    // records the same "challenge" signal, so the sum is identical.
    ["pseudocode", "variables", "strings"].forEach(function (key) {
      var testRows = rows.filter(function (r) { return r.quiz_name === key; });
      var taskDone = rows.some(function (r) {
        return r.quiz_name === key + "-task" && r.answers && r.answers.challenge;
      });
      var tBest = 0, tTotal = 0, tPct = 0;
      if (testRows.length) {
        var tb = testRows.reduce(function (a, r) { return r.score > a.score ? r : a; }, testRows[0]);
        tTotal = testRows.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
        tBest = tb.score;
        tPct = tTotal ? Math.round((tBest / tTotal) * 100) : 0;
      }
      var attempted = testRows.length > 0 || taskDone;
      modules[key] = {
        attempted: attempted,
        pct: Math.round(0.5 * tPct + 0.5 * (taskDone ? 100 : 0)),
        note: attempted
          ? ("Test " + (testRows.length ? tBest + "/" + tTotal : "not yet") +
             " · Task " + (taskDone ? "done" : "not yet"))
          : "Take the quick check and the coding task"
      };
    });

    // Making Decisions blends two halves: the quick test (quiz_name "decisions",
    // worth 50%) and the coding task (quiz_name "decisions-task", worth 50%).
    // Half marks if you do one, 100% only when both are done.
    var decTestRows = rows.filter(function (r) { return r.quiz_name === "decisions"; });
    var decTaskDone = rows.some(function (r) {
      return r.quiz_name === "decisions-task" && r.answers && r.answers.challenge;
    });
    var testBest = 0, testTotal = 0, testPct = 0;
    if (decTestRows.length) {
      var db = decTestRows.reduce(function (a, r) { return r.score > a.score ? r : a; }, decTestRows[0]);
      testTotal = decTestRows.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
      testBest = db.score;
      testPct = testTotal ? Math.round((testBest / testTotal) * 100) : 0;
    }
    var attemptedDec = decTestRows.length > 0 || decTaskDone;
    modules.decisions = {
      attempted: attemptedDec,
      pct: Math.round(0.5 * testPct + 0.5 * (decTaskDone ? 100 : 0)),
      note: attemptedDec
        ? ("Test " + testBest + "/" + (testTotal || 6) + " · Task " + (decTaskDone ? "done" : "not yet"))
        : "Take the quick check and the coding task"
    };

    // Codes & Colour blends two halves the same way: the module test (50%)
    // and the Hello World colour task (quiz_name "codes-task", 50%).
    var cdTestRows = rows.filter(function (r) { return r.quiz_name === "codes"; });
    var cdTaskDone = rows.some(function (r) {
      return r.quiz_name === "codes-task" && r.answers && r.answers.challenge;
    });
    var cdBest = 0, cdTotal = 0, cdPct = 0;
    if (cdTestRows.length) {
      var cb = cdTestRows.reduce(function (a, r) { return r.score > a.score ? r : a; }, cdTestRows[0]);
      cdTotal = cdTestRows.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
      cdBest = cb.score;
      cdPct = cdTotal ? Math.round((cdBest / cdTotal) * 100) : 0;
    }
    var attemptedCd = cdTestRows.length > 0 || cdTaskDone;
    modules.codes = {
      attempted: attemptedCd,
      pct: Math.round(0.5 * cdPct + 0.5 * (cdTaskDone ? 100 : 0)),
      note: attemptedCd
        ? ("Test " + cdBest + "/" + (cdTotal || 10) + " · Task " + (cdTaskDone ? "done" : "not yet"))
        : "Take the module test and the coding task"
    };

    // Loops blends three parts: the quick check (quiz_name "loops", 50%) and two
    // coding tasks (loops-for-task and loops-while-task, worth 25% each).
    var loopTestRows = rows.filter(function (r) { return r.quiz_name === "loops"; });
    var loopForDone = rows.some(function (r) {
      return r.quiz_name === "loops-for-task" && r.answers && r.answers.challenge;
    });
    var loopWhileDone = rows.some(function (r) {
      return r.quiz_name === "loops-while-task" && r.answers && r.answers.challenge;
    });
    var loopTestBest = 0, loopTestTotal = 0, loopTestPct = 0;
    if (loopTestRows.length) {
      var lb = loopTestRows.reduce(function (a, r) { return r.score > a.score ? r : a; }, loopTestRows[0]);
      loopTestTotal = loopTestRows.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
      loopTestBest = lb.score;
      loopTestPct = loopTestTotal ? Math.round((loopTestBest / loopTestTotal) * 100) : 0;
    }
    var loopTasksDone = (loopForDone ? 1 : 0) + (loopWhileDone ? 1 : 0);
    var attemptedLoops = loopTestRows.length > 0 || loopTasksDone > 0;
    modules.loops = {
      attempted: attemptedLoops,
      pct: Math.round(0.5 * loopTestPct + 25 * loopTasksDone),
      note: attemptedLoops
        ? ("Test " + loopTestBest + "/" + (loopTestTotal || 5) + " · Tasks " + loopTasksDone + "/2")
        : "Take the quick check and the two coding tasks"
    };

    // Two modules blend the test (60%) with the written answers on their
    // lesson page (40%): Digital Systems explains WHY, Game Ideas & Design
    // writes the design doc. Same sum, so it is one function.
    function blendWritten(key, answers, wanted, testOutOf, todo) {
      var testRows = rows.filter(function (r) { return r.quiz_name === key; });
      var best = 0, outOf = 0, testPct = 0;
      if (testRows.length) {
        var top = testRows.reduce(function (a, r) { return r.score > a.score ? r : a; }, testRows[0]);
        outOf = testRows.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
        best = top.score;
        testPct = outOf ? Math.round((best / outOf) * 100) : 0;
      }
      var count = 0;
      if (answers) {
        count = Object.keys(answers).filter(function (k) {
          return String(answers[k] || "").trim().length >= 15;
        }).length;
      }
      var attempted = testRows.length > 0 || count > 0;
      modules[key] = {
        attempted: attempted,
        pct: Math.round(0.6 * testPct + 40 * Math.min(1, count / wanted)),
        note: attempted
          ? ("Test " + best + "/" + (outOf || testOutOf) + " · Answers " + count + "/" + wanted)
          : todo
      };
    }

    blendWritten("systems", written.systems, 3, 10,
      "Take the test and write the three answers on the lesson page");
    blendWritten("ideas", written.ideas, 4, 5,
      "Take the test and fill in the design doc on the lesson page");

    var freeplay = rows
      .filter(function (r) { return r.quiz_name === "freeplay"; })
      .reduce(function (s, r) { return s + (r.score || 0); }, 0);

    var seen = {};
    rows.filter(function (r) { return r.quiz_name === "livecoding"; }).forEach(function (r) {
      var id = r.answers && r.answers.challenge;
      if (id != null) seen[id] = true;
    });

    return { modules: modules, freeplay: freeplay, livecoding: Object.keys(seen).length };
  }

  function moduleCard(m, data) {
    // Most modules derive % from best/total; some (Making Decisions) supply a
    // pre-blended pct and a custom note.
    var pct = data.pct != null
      ? data.pct
      : (data.attempted && data.total ? Math.round((data.best / data.total) * 100) : 0);
    var state, right, note;
    if (!data.attempted) {
      state = "todo";
      right = '<span class="progress-quiz-state">Not tried</span>';
      note = data.note || "No test taken yet";
    } else {
      var perfect = pct === 100;
      state = perfect ? "perfect" : "done";
      right =
        '<span class="progress-quiz-score">' + pct + '%</span>' +
        '<span class="progress-quiz-state ' + state + '">' + (perfect ? "Perfect!" : "Done") + '</span>';
      note = data.note != null
        ? data.note
        : "Best " + data.best + "/" + data.total + (data.attempts > 1 ? " · " + data.attempts + " tries" : "");
    }
    return (
      '<a class="progress-quiz ' + state + '" href="' + m.href + '">' +
        '<div class="progress-quiz-top">' +
          '<span class="progress-quiz-label">' + escapeHtml(m.label) + '</span>' +
          '<span class="progress-quiz-right">' + right + '</span>' +
        '</div>' +
        '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' +
        '<p class="progress-quiz-note">' + escapeHtml(note) + '</p>' +
      '</a>'
    );
  }

  // One assignment_progress row per assignment holds the state plus the
  // submitted_at flag: submitted_at set = handed in, row with no flag = in
  // progress, no row = not started.
  async function loadSubmissions(student) {
    var byKey = {};
    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      var res = await sb.from("assignment_progress")
        .select("*")
        .eq("student_code", student.code);
      if (!res.error && res.data) {
        res.data.forEach(function (r) { byKey[r.assignment] = r; });
      }
    }
    return byKey;
  }

  function assignmentCard(a, sub) {
    var state, right, note, pct;
    var submitted = sub && sub.submitted_at;
    if (submitted) {
      state = "perfect";
      right = '<span class="progress-quiz-state perfect">Submitted</span>';
      var track = sub.state && sub.state.track;
      var date = new Date(sub.submitted_at);
      note = (TRACK_NAMES[track] || "Submitted") + (isNaN(date) ? "" : " · handed in " + date.toLocaleDateString("en-AU", { day: "numeric", month: "short" }));
      pct = 100;
    } else if (sub) {
      state = "partial";
      right = '<span class="progress-quiz-state">In progress</span>';
      note = "Started but not handed in yet. Tap to keep going.";
      pct = 50;
    } else {
      state = "todo";
      right = '<span class="progress-quiz-state">Not started</span>';
      note = "Nothing here yet. Tap to start.";
      pct = 0;
    }
    return (
      '<a class="progress-quiz ' + state + '" href="' + a.href + '">' +
        '<div class="progress-quiz-top">' +
          '<span class="progress-quiz-label">' + escapeHtml(a.label) + '</span>' +
          '<span class="progress-quiz-right">' + right + '</span>' +
        '</div>' +
        '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' +
        '<p class="progress-quiz-note">' + escapeHtml(note) + '</p>' +
      '</a>'
    );
  }

  function render(student, summary) {
    el("progress-greeting").textContent = "Hey " + (student.first_name || student.code) + "!";

    // Anything they have actually sat comes first, retired lessons included:
    // a score they earned is still theirs. Everything untouched drops into a
    // shut drawer, so the page reads as what you have done rather than a wall
    // of "Not tried".
    var tried = MODULES.filter(function (m) { return summary.modules[m.key].attempted; });
    var todo  = CURRENT.filter(function (m) { return !summary.modules[m.key].attempted; });

    var html = tried.map(function (m) { return moduleCard(m, summary.modules[m.key]); }).join("");
    if (todo.length) {
      html +=
        '<details class="progress-todo">' +
          '<summary>' +
            '<svg class="progress-todo-chev" viewBox="0 0 12 8" aria-hidden="true">' +
              '<path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" ' +
                    'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            (tried.length ? "Not started yet" : "Modules to try") +
            '<span class="progress-todo-count">' + todo.length + '</span>' +
          '</summary>' +
          '<div class="progress-todo-body">' +
            todo.map(function (m) { return moduleCard(m, summary.modules[m.key]); }).join("") +
          '</div>' +
        '</details>';
    }
    el("progress-quizzes").innerHTML = html;

    el("progress-livecoding").textContent = summary.livecoding;
    el("progress-freeplay").textContent = summary.freeplay;

    // Counted against the modules actually set, so the retired three cannot
    // make the total unreachable.
    var done = CURRENT.filter(function (m) { return summary.modules[m.key].attempted; }).length;
    el("progress-done-count").textContent = done;
    el("progress-total-count").textContent = CURRENT.length;
    var mCount = el("progress-done-count").parentNode;
    if (mCount) mCount.classList.toggle("is-done", done === CURRENT.length && done > 0);

    var msg;
    if (done === 0 && tried.length) {
      // Everything they have sat is a retired lesson, so "nothing taken yet"
      // would be calling their own score above a lie.
      msg = "Nothing from this term's modules yet. Open one and try its test at the bottom!";
    } else if (done === 0) {
      msg = "You haven't taken a module test yet. Open a module and try its test at the bottom!";
    } else if (done === CURRENT.length) {
      msg = "All " + CURRENT.length + " module tests done. Legend! Now chase those 100%s.";
    } else {
      msg = done + " of " + CURRENT.length + " module tests done. Keep going!";
    }
    el("progress-summary").textContent = msg;
  }

  async function boot() {
    var student = window.ITBasics && window.ITBasics.getSession();
    if (!student) { location.replace("/"); return; }

    var status = el("progress-status");
    var result = await loadAttempts(student);
    if (result.error) {
      status.textContent = "Couldn't load your progress. " + result.error;
      return;
    }
    var written = {};
    try { written.systems = await window.ITBasics.loadProgress("answers-systems"); } catch (e) { /* fine */ }
    try { written.ideas = await window.ITBasics.loadProgress("answers-ideas"); } catch (e) { /* fine */ }
    render(student, summarise(result.rows, written));

    var subs = await loadSubmissions(student);
    var assignBox = el("progress-assignments");
    if (assignBox) {
      // Same rule as the modules: what they have touched comes first, the
      // rest folds away. A row of "Not started" is not progress.
      var started = ASSIGNMENTS.filter(function (a) { return subs[a.key]; });
      var untouched = ASSIGNMENTS.filter(function (a) { return !subs[a.key]; });
      var out = started.map(function (a) { return assignmentCard(a, subs[a.key]); }).join("");
      if (untouched.length) {
        out +=
          '<details class="progress-todo">' +
            '<summary>' +
              '<svg class="progress-todo-chev" viewBox="0 0 12 8" aria-hidden="true">' +
                '<path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" ' +
                      'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              (started.length ? "Not started yet" : "Assignments to try") +
              '<span class="progress-todo-count">' + untouched.length + '</span>' +
            '</summary>' +
            '<div class="progress-todo-body">' +
              untouched.map(function (a) { return assignmentCard(a, null); }).join("") +
            '</div>' +
          '</details>';
      }
      assignBox.innerHTML = out;

      var aCount = el("assign-count");
      var aSum = el("assign-summary");
      if (aCount) {
        aCount.textContent = started.length + "/" + ASSIGNMENTS.length;
        aCount.classList.toggle("is-done",
          started.length === ASSIGNMENTS.length && started.length > 0);
      }
      if (aSum) {
        aSum.textContent = started.length === 0
          ? "Nothing started yet. Pick one and have a go!"
          : started.length === ASSIGNMENTS.length
            ? "Every assignment started. Nice."
            : started.length + " of " + ASSIGNMENTS.length + " started.";
      }
    }
    status.textContent = "";
    el("progress-content").hidden = false;
    renderTeacherLink(student);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Sign-out from the auth bar drops you back to the login screen.
  window.addEventListener("itbasics:auth", function (e) {
    if (!e.detail || !e.detail.student) { location.replace("/"); return; }
    boot();
  });
})();
