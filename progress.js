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
    { key: "decisions",   label: "Making Decisions", href: "/topics/decisions/" },
    { key: "loops",       label: "Loops",          href: "/topics/loops/" },
    { key: "binary",      label: "Binary & Data",  href: "/topics/binary/" },
    { key: "codes",       label: "Codes & Colour", href: "/topics/codes/" },
    { key: "systems",     label: "Digital Systems", href: "/topics/systems/" },
    { key: "networks",    label: "Networks & Safety", href: "/topics/networks/" },
    { key: "os",          label: "Computer Skills", href: "/topics/os/" }
  ];

  // Assignments shown on the progress page. Keys match the `assignment`
  // column in assignment_submissions (and assignments.js).
  var ASSIGNMENTS = [
    { key: "petprogram", label: "Task 1: My First Program", href: "/assignments/pet-program/" }
  ];
  var TRACK_NAMES = { calc: "Pet Age Calculator", turtle: "Pet Turtle" };

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Teacher accounts get a shortcut to the export tool (/teacher/) right on their
  // own profile, so it does not have to be reached by typing the URL. Add more
  // staff codes here if other teachers need the same shortcut.
  var TEACHER_CODES = ["MRH0001"];
  function isTeacher(student) {
    return !!student && TEACHER_CODES.indexOf(String(student.code || "").toUpperCase()) !== -1;
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
    var names = ["programming", "html", "python", "decisions", "decisions-task", "loops", "loops-for-task", "loops-while-task", "binary", "codes", "systems", "networks", "os", "freeplay", "livecoding"];
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
  function summarise(rows) {
    var modules = {};
    MODULES.forEach(function (m) {
      var mine = rows.filter(function (r) { return r.quiz_name === m.key; });
      if (!mine.length) { modules[m.key] = { attempted: false }; return; }
      var best = mine.reduce(function (a, r) { return r.score > a.score ? r : a; }, mine[0]);
      var total = mine.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
      modules[m.key] = { attempted: true, best: best.score, total: total, attempts: mine.length };
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

  // Submission per assignment: Supabase when online, else the local
  // fallback copy the assignment page keeps.
  async function loadSubmissions(student) {
    var byKey = {};
    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      var res = await sb.from("assignment_submissions")
        .select("assignment, track, submitted_at, updated_at")
        .eq("student_code", student.code);
      if (!res.error && res.data) {
        res.data.forEach(function (r) { byKey[r.assignment] = r; });
      }
    }
    ASSIGNMENTS.forEach(function (a) {
      if (byKey[a.key]) return;
      var raw = localStorage.getItem("itbasics-" + a.key + "-" + student.code + "-submission");
      if (!raw) return;
      try { byKey[a.key] = JSON.parse(raw); } catch (e) { /* ignore */ }
    });
    return byKey;
  }

  function assignmentCard(a, sub) {
    var state, right, note;
    if (!sub) {
      state = "todo";
      right = '<span class="progress-quiz-state">Not submitted</span>';
      note = "Nothing handed in yet. Tap to start.";
    } else {
      state = "perfect";
      right = '<span class="progress-quiz-state perfect">Submitted</span>';
      var when = sub.updated_at || sub.submitted_at;
      var date = when ? new Date(when).toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : "";
      note = (TRACK_NAMES[sub.track] || "Submitted") + (date ? " · handed in " + date : "");
    }
    return (
      '<a class="progress-quiz ' + state + '" href="' + a.href + '">' +
        '<div class="progress-quiz-top">' +
          '<span class="progress-quiz-label">' + escapeHtml(a.label) + '</span>' +
          '<span class="progress-quiz-right">' + right + '</span>' +
        '</div>' +
        '<div class="progress-bar"><span style="width:' + (sub ? 100 : 0) + '%"></span></div>' +
        '<p class="progress-quiz-note">' + escapeHtml(note) + '</p>' +
      '</a>'
    );
  }

  function render(student, summary) {
    el("progress-greeting").textContent = "Hey " + (student.first_name || student.code) + "!";

    el("progress-quizzes").innerHTML =
      MODULES.map(function (m) { return moduleCard(m, summary.modules[m.key]); }).join("");

    el("progress-livecoding").textContent = summary.livecoding;
    el("progress-freeplay").textContent = summary.freeplay;

    var done = MODULES.filter(function (m) { return summary.modules[m.key].attempted; }).length;
    el("progress-done-count").textContent = done;
    el("progress-total-count").textContent = MODULES.length;

    var msg;
    if (done === 0) {
      msg = "You haven't taken a module test yet. Open a module and try its test at the bottom!";
    } else if (done === MODULES.length) {
      msg = "All " + MODULES.length + " module tests done. Legend! Now chase those 100%s.";
    } else {
      msg = done + " of " + MODULES.length + " module tests done. Keep going!";
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
    render(student, summarise(result.rows));

    var subs = await loadSubmissions(student);
    var assignBox = el("progress-assignments");
    if (assignBox) {
      assignBox.innerHTML = ASSIGNMENTS.map(function (a) {
        return assignmentCard(a, subs[a.key]);
      }).join("");
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
