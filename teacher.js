(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Teacher task export. Pick a class + a task, see who has completed it and
  // their %, then copy/download as CSV for record sheets / Questionmark.
  //
  // "Completed" means 100%. The % lets you award partial marks (e.g. a student
  // who did the Making Decisions quick check but not the coding task is at 50%).
  // ---------------------------------------------------------------------------

  var GATE_KEY = "itbasics-teacher-ok";

  // Each task says which quiz_names to pull and how to turn a student's rows
  // into { pct, completed, detail }. Module/quiz tasks are fixed; Live Coding
  // tasks are built at load time from the challenge catalog (see buildTasks).
  var MODULE_TASKS = [
    { key: "variables",   label: "Variables (module)",        group: "Modules & quizzes", quizzes: ["variables", "variables-task"], compute: computeTestPlusTask("variables") },
    { key: "strings",     label: "Strings (module)",          group: "Modules & quizzes", quizzes: ["strings", "strings-task"], compute: computeTestPlusTask("strings") },
    { key: "decisions",   label: "Making Decisions (module)", group: "Modules & quizzes", quizzes: ["decisions", "decisions-task"], compute: computeDecisions },
    { key: "loops",       label: "Loops (module)",            group: "Modules & quizzes", quizzes: ["loops", "loops-for-task", "loops-while-task"], compute: computeLoops },
    { key: "programming", label: "Programming quiz",          group: "Modules & quizzes", quizzes: ["programming"], compute: testCompute("programming") },
    { key: "html",        label: "HTML quiz",                 group: "Modules & quizzes", quizzes: ["html"],        compute: testCompute("html") },
    { key: "python",      label: "Python quiz",               group: "Modules & quizzes", quizzes: ["python"],      compute: testCompute("python") },
    { key: "binary",      label: "Binary & Data test",        group: "Modules & quizzes", quizzes: ["binary"],      compute: testCompute("binary") },
    { key: "codes",       label: "Codes & Colour (module)",   group: "Modules & quizzes", quizzes: ["codes", "codes-task"], compute: computeCodes },
    { key: "systems",     label: "Digital Systems (module)",  group: "Modules & quizzes", quizzes: ["systems"],
      answersModule: "systems", answersTotal: 3, compute: computeWithAnswers("systems", "systems", 3) },
    { key: "networks",    label: "Networks & Safety test",    group: "Modules & quizzes", quizzes: ["networks"],    compute: testCompute("networks") },
    { key: "os",          label: "Computer Skills test",      group: "Modules & quizzes", quizzes: ["os"],          compute: testCompute("os") }
  ];

  // Assignment drafts: reads assignment_progress (live autosaved state:
  // code, self-check ticks, reflection answers, note) plus
  // assignment_submissions, so you can see who has actually started.
  // checksTotal/reflectsTotal are the per-student expected counts used for
  // the progress %; for the Pet Project they are per-track (both tracks 13/4).
  // The Pet Project has two tracks; a student can do either (or switch), so it
  // gets a dropdown entry per track. track/prefix filter the checks, reflections
  // and code to that track (calc keys start "c", turtle keys start "t").
  var ASSIGNMENT_TASKS = [
    { key: "assign:petprogram:calc", label: "Pet Project (Task 1) - Calculator track", group: "Assignments",
      kind: "assignment", assignment: "petprogram", track: "calc", prefix: "c", checksTotal: 14, reflectsTotal: 5 },
    { key: "assign:petprogram:turtle", label: "Pet Project (Task 1) - Turtle track", group: "Assignments",
      kind: "assignment", assignment: "petprogram", track: "turtle", prefix: "t", checksTotal: 13, reflectsTotal: 5 },
    { key: "assign:pixelart", label: "Pixel Painter (Task 2): draft progress", group: "Assignments",
      kind: "assignment", assignment: "pixelart", checksTotal: 17, reflectsTotal: 5 }
  ];
  ASSIGNMENT_TASKS.forEach(function (t) { t.compute = computeAssignment(t); });

  // Friendly labels for the reflection boxes, so answers read like a marking
  // sheet instead of raw keys. Keys match data-reflect on the task pages and
  // data-q on lesson brainboxes.
  var REFLECT_LABELS = {
    "device-why":     "Pick a device: which bin, and why?",
    "storage-why":    "Why does a computer need storage?",
    "ram-vs-storage": "RAM vs storage: what does each do?",
    "c-pet":      "Which pet, and how many pet years per human year?",
    "c-err":      "Error message from typing letters, and why",
    "c-surprise": "What did -3 give, and why is that a problem? Hardcoded or variable?",
    "c-caps":     "Why doesn't QUIT in capitals work?",
    "c-break":    "What does continue do? What slips through try/except?",
    "t-pet":      "Which commands walk and turn? How to draw an L?",
    "t-err":      "Error message from typing letters, and why",
    "t-fifty":    "What happened with 50 sides? Why?",
    "t-caps":     "Why doesn't QUIT in capitals work?",
    "t-break":    "No crashes now, but: -100? 0? Is the 2.5 message fair?",
    "px-end":     "What happened when you deleted end=\"\"?",
    "px-loops":   "What do the outer and inner loops each do?",
    "px-pixels":  "How many pixels does your picture have?",
    "px-palette": "Why does 1 letter per pixel need few colours?",
    "px-photo":   "How big is a phone photo, and why?"
  };

  // Homework rows fetched from the homework table; each becomes a Task
  // dropdown entry showing per-student status on every item.
  var HOMEWORK_ROWS = [];

  // Built once we know the challenge catalog; combined list the dropdown uses.
  var ALL_TASKS = MODULE_TASKS.slice();

  function buildTasks() {
    ALL_TASKS = MODULE_TASKS.slice().concat(ASSIGNMENT_TASKS);
    HOMEWORK_ROWS.forEach(function (hw) {
      ALL_TASKS.push({
        key: "hw:" + hw.id,
        label: hw.title + " (" + hw.class + ")",
        group: "Homework",
        kind: "homework",
        hw: hw,
        compute: computeHomework(hw)
      });
    });
    var catalog = window.ITBASICS_CHALLENGE_CATALOG || [];
    if (!catalog.length) return;
    var ids = catalog.map(function (c) { return c.id; });
    // Overall: how many of the live-coding challenges each student has cracked.
    ALL_TASKS.push({
      key: "livecoding-all",
      label: "Live Coding: all challenges (" + ids.length + ")",
      group: "Live Coding",
      quizzes: ["livecoding"],
      compute: computeLivecodingAll(ids)
    });
    // One task per individual challenge.
    catalog.forEach(function (c) {
      ALL_TASKS.push({
        key: "lc:" + c.id,
        label: "Live Coding: " + c.title,
        group: "Live Coding",
        quizzes: ["livecoding"],
        compute: computeChallenge(c.id)
      });
    });
  }

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- Completion maths -----------------------------------------------------
  function bestTest(rows, quiz) {
    var mine = rows.filter(function (r) { return r.quiz_name === quiz; });
    if (!mine.length) return null;
    var best = mine.reduce(function (a, r) { return (r.score || 0) > (a.score || 0) ? r : a; }, mine[0]);
    var total = mine.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
    return { score: best.score || 0, total: total };
  }

  function testCompute(quiz) {
    return function (rows) {
      var b = bestTest(rows, quiz);
      if (!b) return { pct: 0, completed: false, detail: "no attempt" };
      var pct = b.total ? Math.round((b.score / b.total) * 100) : 0;
      return { pct: pct, completed: pct === 100, detail: "best " + b.score + "/" + b.total };
    };
  }

  // Generic module marker for the quick-check + coding-task modules
  // (Variables, Strings): test 50%, task 50%, same shape as Making Decisions.
  function computeTestPlusTask(key) {
    return function (rows) {
      var b = bestTest(rows, key);
      var testPct = b && b.total ? Math.round((b.score / b.total) * 100) : 0;
      var taskDone = rows.some(function (r) {
        return r.quiz_name === key + "-task" && r.answers && r.answers.challenge;
      });
      var pct = Math.round(0.5 * testPct + 0.5 * (taskDone ? 100 : 0));
      var testStr = b ? (b.score + "/" + b.total) : "0/6";
      return {
        pct: pct,
        completed: pct === 100,
        detail: "Test " + testStr + " · Task " + (taskDone ? "done" : "not yet")
      };
    };
  }

  function computeDecisions(rows) {
    var b = bestTest(rows, "decisions");
    var testPct = b && b.total ? Math.round((b.score / b.total) * 100) : 0;
    var taskDone = rows.some(function (r) {
      return r.quiz_name === "decisions-task" && r.answers && r.answers.challenge;
    });
    var pct = Math.round(0.5 * testPct + 0.5 * (taskDone ? 100 : 0));
    var testStr = b ? (b.score + "/" + b.total) : "0/6";
    return {
      pct: pct,
      completed: pct === 100,
      detail: "Test " + testStr + " · Task " + (taskDone ? "done" : "not yet")
    };
  }

  // Modules with written "explain WHY" boxes blend the test (60%) with the
  // short answers (40%, scaled by how many of the module's questions have a
  // real answer: 15+ characters). The answers ride along in the rows as a
  // pseudo-row with quiz_name "answers-<module>" (see loadClassData).
  function computeWithAnswers(quiz, module, totalQs) {
    return function (rows) {
      var b = bestTest(rows, quiz);
      var testPct = b && b.total ? Math.round((b.score / b.total) * 100) : 0;
      var ansRow = rows.filter(function (r) { return r.quiz_name === "answers-" + module; })[0];
      var written = 0;
      if (ansRow && ansRow.answers) {
        written = Object.keys(ansRow.answers).filter(function (k) {
          return String(ansRow.answers[k] || "").trim().length >= 15;
        }).length;
      }
      var pct = Math.round(0.6 * testPct + 40 * Math.min(1, written / totalQs));
      var testStr = b ? (b.score + "/" + b.total) : "no attempt";
      return {
        pct: pct,
        completed: pct === 100,
        detail: "Test " + testStr + " · Answers " + written + "/" + totalQs
      };
    };
  }

  // Codes & Colour blends the module test (50%) with the Hello World colour
  // task (50%), same shape as Making Decisions.
  function computeCodes(rows) {
    var b = bestTest(rows, "codes");
    var testPct = b && b.total ? Math.round((b.score / b.total) * 100) : 0;
    var taskDone = rows.some(function (r) {
      return r.quiz_name === "codes-task" && r.answers && r.answers.challenge;
    });
    var pct = Math.round(0.5 * testPct + 0.5 * (taskDone ? 100 : 0));
    var testStr = b ? (b.score + "/" + b.total) : "no attempt";
    return {
      pct: pct,
      completed: pct === 100,
      detail: "Test " + testStr + " · Task " + (taskDone ? "done" : "not yet")
    };
  }

  // Loops blends the quick check (quiz_name "loops", 50%) with two coding tasks
  // (loops-for-task and loops-while-task, 25% each), 100% only when all three.
  function computeLoops(rows) {
    var b = bestTest(rows, "loops");
    var testPct = b && b.total ? Math.round((b.score / b.total) * 100) : 0;
    var forDone = rows.some(function (r) {
      return r.quiz_name === "loops-for-task" && r.answers && r.answers.challenge;
    });
    var whileDone = rows.some(function (r) {
      return r.quiz_name === "loops-while-task" && r.answers && r.answers.challenge;
    });
    var tasksDone = (forDone ? 1 : 0) + (whileDone ? 1 : 0);
    var pct = Math.round(0.5 * testPct + 25 * tasksDone);
    var testStr = b ? (b.score + "/" + b.total) : "0/5";
    return {
      pct: pct,
      completed: pct === 100,
      detail: "Test " + testStr + " · Tasks " + tasksDone + "/2"
    };
  }

  // Distinct live-coding challenge ids this student has passed (clamped to the
  // known catalog so stray/old ids can't push the count past the total).
  function doneChallengeSet(rows, allowedIds) {
    var allow = allowedIds ? {} : null;
    if (allowedIds) allowedIds.forEach(function (id) { allow[id] = true; });
    var set = {};
    rows.forEach(function (r) {
      if (r.quiz_name !== "livecoding") return;
      var id = r.answers && r.answers.challenge;
      if (id && (!allow || allow[id])) set[id] = true;
    });
    return set;
  }

  function computeLivecodingAll(ids) {
    return function (rows) {
      var n = Object.keys(doneChallengeSet(rows, ids)).length;
      var total = ids.length;
      var pct = total ? Math.round((n / total) * 100) : 0;
      return { pct: pct, completed: total > 0 && n >= total, detail: n + " / " + total + " challenges" };
    };
  }

  function computeChallenge(id) {
    return function (rows) {
      var done = rows.some(function (r) {
        return r.quiz_name === "livecoding" && r.answers && r.answers.challenge === id;
      });
      return { pct: done ? 100 : 0, completed: done, detail: done ? "done" : "not yet" };
    };
  }

  // "Completed" = the student marked it ready (submitted_at is set). The %
  // is draft progress so you can see who has started: ticks are worth half,
  // written answers 30%, real code the rest. Detail shows the raw counts.
  function computeAssignment(task) {
    // When the task is track-specific (Pet Project), only count that track's
    // keys: calc keys start "c", turtle keys start "t".
    function ofTrack(key) { return !task.prefix || key.charAt(0) === task.prefix; }
    return function (bundle) {
      bundle = bundle || {};
      var p = bundle.progress;
      var submitted = Boolean(p && p.submitted_at);
      var state = (p && p.state) || {};
      var codeObj = state.code || {};
      var codeChars = 0;
      if (task.track) {
        codeChars = String(codeObj[task.track] || "").trim().length;
      } else {
        Object.keys(codeObj).forEach(function (k) {
          codeChars = Math.max(codeChars, String(codeObj[k] || "").trim().length);
        });
      }
      var ticks = Object.keys(state.checks || {}).filter(ofTrack).length;
      var answers = Object.keys(state.reflects || {}).filter(function (k) {
        return ofTrack(k) && String(state.reflects[k] || "").trim();
      }).length;
      var hasNote = Boolean(String(state.note || "").trim());
      // The untouched starter code is well under 200 chars; real work isn't.
      var hasCode = codeChars >= 200;

      var subWhen = submitted ? new Date(p.submitted_at) : null;
      var actWhen = (p && p.updated_at) ? new Date(p.updated_at) : null;
      function short(d) { return (d && !isNaN(d)) ? d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : ""; }

      var pct = submitted ? 100 : Math.round(
        50 * Math.min(1, ticks / task.checksTotal) +
        30 * Math.min(1, answers / task.reflectsTotal) +
        (hasCode ? 20 : 0)
      );

      var bits = [];
      bits.push(hasCode ? "code " + codeChars + " chars" : "no real code yet");
      bits.push("ticks " + ticks);
      bits.push("answers " + answers);
      if (hasNote) bits.push("note ✓");
      if (submitted) bits.push("submitted " + short(subWhen));
      else if (p) bits.push("last active " + short(actWhen));
      else bits.push("not started");
      return { pct: pct, completed: submitted, detail: bits.join(" · ") };
    };
  }

  // Homework: "Completed" means every item done; the % is items done, and
  // the detail lists each item's status (✓ done, ~ started, ✗ not started).
  function computeHomework(hw) {
    return function (bundle) {
      bundle = bundle || {};
      var items = hw.items || [];
      var done = 0, started = 0;
      var bits = items.map(function (item) {
        var status = window.HWStatus.itemStatus(item, bundle);
        if (status === "done") done++;
        if (status === "started") started++;
        var mark = status === "done" ? "✓" : status === "started" ? "~" : "✗";
        var short = window.HWStatus.itemLabel(item).replace(/\s*\(.*\)$/, "");
        return short + " " + mark;
      });
      return {
        pct: items.length ? Math.round((done / items.length) * 100) : 0,
        completed: items.length > 0 && done === items.length,
        detail: bits.join(" · ") + (started ? "" : "")
      };
    };
  }

  // ---- Data -----------------------------------------------------------------
  function sb() { return window.ITBasics.client(); }

  async function loadHomeworkRows() {
    var res = await sb().from("homework")
      .select("id, class, title, items, due_date, created_at")
      .order("created_at", { ascending: false });
    HOMEWORK_ROWS = (!res.error && res.data) ? res.data : [];
  }

  // Per-student bundles for a homework task: only the quiz names the items
  // actually need (freeplay noise would blow the row cap otherwise).
  async function loadHomeworkData(cls, task) {
    var hw = task.hw;
    var sres = await sb().from("students")
      .select("code, first_name, last_name, class")
      .eq("class", cls)
      .order("last_name", { ascending: true });
    if (sres.error) throw new Error(sres.error.message);
    var students = sres.data || [];
    if (!students.length) return { students: [], byStudent: {} };
    var codes = students.map(function (s) { return s.code; });

    var byStudent = {};
    function bundle(code) {
      return (byStudent[code] = byStudent[code] || { attempts: [], assignments: {}, answers: {} });
    }

    var quizNames = window.HWStatus.neededQuizNames(hw.items);
    if (quizNames.length) {
      var ares = await sb().from("quiz_attempts")
        .select("student_code, quiz_name, score, total, answers")
        .in("student_code", codes)
        .in("quiz_name", quizNames);
      if (ares.error) throw new Error(ares.error.message);
      (ares.data || []).forEach(function (r) { bundle(r.student_code).attempts.push(r); });
    }

    if ((hw.items || []).some(function (i) { return i.type === "assignment"; })) {
      var prog = await sb().from("assignment_progress")
        .select("*").in("student_code", codes);
      if (!prog.error) (prog.data || []).forEach(function (r) {
        bundle(r.student_code).assignments[r.assignment] = { submitted: Boolean(r.submitted_at) };
      });
    }

    var answerNames = window.HWStatus.neededAnswerNames(hw.items);
    for (var i = 0; i < answerNames.length; i++) {
      var qres = await sb().from("quiz_progress")
        .select("student_code, answers").in("student_code", codes).eq("quiz_name", answerNames[i]);
      if (!qres.error) {
        (qres.data || []).forEach(function (r) {
          bundle(r.student_code).answers[answerNames[i]] = r.answers || {};
        });
      }
    }
    return { students: students, byStudent: byStudent };
  }

  async function loadClasses() {
    var res = await sb().from("students").select("class");
    if (res.error) throw new Error(res.error.message);
    var seen = {};
    (res.data || []).forEach(function (r) { if (r.class) seen[r.class] = true; });
    return Object.keys(seen).sort();
  }

  async function loadClassData(cls, task) {
    var sres = await sb().from("students")
      .select("code, first_name, last_name, class")
      .eq("class", cls)
      .order("last_name", { ascending: true });
    if (sres.error) throw new Error(sres.error.message);
    var students = sres.data || [];
    if (!students.length) return { students: [], byStudent: {} };

    var codes = students.map(function (s) { return s.code; });
    var ares = await sb().from("quiz_attempts")
      .select("student_code, quiz_name, score, total, answers")
      .in("student_code", codes)
      .in("quiz_name", task.quizzes);
    if (ares.error) throw new Error(ares.error.message);

    var byStudent = {};
    (ares.data || []).forEach(function (r) {
      (byStudent[r.student_code] = byStudent[r.student_code] || []).push(r);
    });

    // Modules with written-answer boxes: pull each student's saved answers
    // (quiz_progress row "answers-<module>") in as a pseudo-row so the
    // compute and the click-to-expand drawer can see them.
    if (task.answersModule) {
      var qres = await sb().from("quiz_progress")
        .select("student_code, answers, updated_at")
        .in("student_code", codes)
        .eq("quiz_name", "answers-" + task.answersModule);
      if (!qres.error) {
        (qres.data || []).forEach(function (r) {
          (byStudent[r.student_code] = byStudent[r.student_code] || []).push({
            quiz_name: "answers-" + task.answersModule,
            answers: r.answers
          });
        });
      }
    }
    return { students: students, byStudent: byStudent };
  }

  // Assignment tasks read the single assignment_progress row per student:
  // the live state (code, checks, reflections, note) plus submitted_at, the
  // flag the student sets when they mark it ready to grade.
  async function loadAssignmentData(cls, task) {
    var sres = await sb().from("students")
      .select("code, first_name, last_name, class")
      .eq("class", cls)
      .order("last_name", { ascending: true });
    if (sres.error) throw new Error(sres.error.message);
    var students = sres.data || [];
    if (!students.length) return { students: [], byStudent: {} };

    var codes = students.map(function (s) { return s.code; });
    var byStudent = {};

    // select("*") so a database that hasn't had the submitted_at column added
    // yet still returns the rows (submitted_at just comes back undefined)
    // instead of erroring and blanking the whole view.
    var pres = await sb().from("assignment_progress")
      .select("*")
      .in("student_code", codes)
      .eq("assignment", task.assignment);
    if (!pres.error) {
      (pres.data || []).forEach(function (r) {
        (byStudent[r.student_code] = byStudent[r.student_code] || {}).progress = r;
      });
    }

    return { students: students, byStudent: byStudent };
  }

  // ---- Rendering ------------------------------------------------------------
  var lastRows = []; // for CSV export
  var lastTask = null;
  var lastClass = null;

  function render(cls, task, data) {
    var head = el("teacher-head");
    var body = el("teacher-body");
    head.innerHTML =
      '<tr><th>#</th><th>Student</th><th>Code</th><th>Completed</th>' +
      '<th>% completed</th><th>Detail</th></tr>';
    body.innerHTML = "";

    var rows = data.students.map(function (s) {
      var r = task.compute(data.byStudent[s.code] || []);
      return {
        code: s.code,
        first_name: s.first_name,
        last_name: s.last_name,
        class: s.class,
        completed: r.completed,
        pct: r.pct,
        detail: r.detail
      };
    });
    lastRows = rows;
    lastTask = task;
    lastClass = cls;

    rows.forEach(function (r, i) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="col-rank">' + (i + 1) + '</td>' +
        '<td>' + escapeHtml(r.first_name) + ' ' + escapeHtml(r.last_name) + '</td>' +
        '<td><code>' + escapeHtml(r.code) + '</code></td>' +
        '<td class="' + (r.completed ? 'teacher-yes' : 'teacher-no') + '">' +
          (r.completed ? 'Yes' : 'No') + '</td>' +
        '<td><strong>' + r.pct + '%</strong></td>' +
        '<td class="teacher-detail">' + escapeHtml(r.detail) + '</td>';
      body.appendChild(tr);
      // Assignment views and answer-bearing modules: click a student to see
      // what they actually wrote.
      if (task.kind === "assignment") {
        tr.classList.add("t-expandable");
        tr.title = "Click to see their answers and code";
        tr.addEventListener("click", function () {
          toggleAnswers(tr, data.byStudent[r.code] || {}, task.track);
        });
      } else if (task.answersModule) {
        tr.classList.add("t-expandable");
        tr.title = "Click to read their written answers";
        tr.addEventListener("click", function () {
          var rows2 = data.byStudent[r.code] || [];
          var ansRow = rows2.filter ? rows2.filter(function (x) {
            return x.quiz_name === "answers-" + task.answersModule;
          })[0] : null;
          toggleAnswers(tr, { progress: { state: { reflects: (ansRow && ansRow.answers) || {} } } });
        });
      }
    });

    var doneCount = rows.filter(function (r) { return r.completed; }).length;
    var avg = rows.length
      ? Math.round(rows.reduce(function (t, r) { return t + r.pct; }, 0) / rows.length)
      : 0;
    var summary = el("teacher-summary");
    summary.hidden = false;
    summary.innerHTML =
      '<strong>' + escapeHtml(task.label) + '</strong> &middot; ' + escapeHtml(cls) + ': ' +
      doneCount + ' of ' + rows.length + ' completed &middot; class average ' + avg + '%';

    el("teacher-status").textContent = "";
  }

  // Expandable per-student drawer for assignment views: reflection answers,
  // note, and the code (draft from progress, or the submitted version).
  function toggleAnswers(tr, bundle, track) {
    var next = tr.nextElementSibling;
    if (next && next.classList.contains("t-answers-row")) { next.remove(); return; }
    // Only one drawer open at a time keeps the table readable.
    var open = tr.parentNode.querySelector(".t-answers-row");
    if (open) open.remove();

    var prog = bundle.progress || null;
    var state = (prog && prog.state) || {};
    var submittedAt = prog && prog.submitted_at;
    var prefix = track ? track.charAt(0) : null; // "c" or "t"
    var inTrack = function (k) { return !prefix || k.charAt(0) === prefix; };
    var html = "";

    if (submittedAt) {
      var d = new Date(submittedAt);
      html += "<p class='t-submitted'>&#10003; Marked ready to grade" +
        (isNaN(d) ? "" : " on " + escapeHtml(d.toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }))) +
        "</p>";
    }

    var reflects = state.reflects || {};
    var rkeys = Object.keys(reflects).filter(function (k) { return inTrack(k) && String(reflects[k] || "").trim(); });
    if (rkeys.length) {
      html += "<h4>Written answers</h4><dl>";
      rkeys.forEach(function (k) {
        html += "<dt>" + escapeHtml(REFLECT_LABELS[k] || k) + "</dt>" +
                "<dd>" + escapeHtml(reflects[k]) + "</dd>";
      });
      html += "</dl>";
    } else {
      html += "<h4>Written answers</h4><p class='t-none'>Nothing written for this track yet.</p>";
    }

    if (String(state.note || "").trim()) {
      html += "<h4>Note</h4><p>" + escapeHtml(state.note) + "</p>";
    }

    // The code lives in state.code: one entry for pixelart (main), two for the
    // Pet Project (calc / turtle). For a track-specific view show that track;
    // otherwise show whichever has the most in it.
    var codes = state.code || {};
    var chosen = track && String(codes[track] || "").trim() ? track : null;
    if (!chosen && !track) {
      var codeKeys = Object.keys(codes).filter(function (k) { return String(codes[k] || "").trim(); });
      if (codeKeys.length) {
        chosen = codeKeys.reduce(function (best, k) {
          return String(codes[k]).length > String(codes[best] || "").length ? k : best;
        }, codeKeys[0]);
      }
    }
    if (chosen) {
      var trackName = ({ calc: "Pet Age Calculator", turtle: "Pet Turtle" })[chosen];
      var codeLabel = "Code" + (trackName ? " (" + escapeHtml(trackName) + ")" : "");
      html += "<h4>" + codeLabel + "</h4><pre>" + escapeHtml(codes[chosen]) + "</pre>";
    } else if (track) {
      html += "<h4>Code</h4><p class='t-none'>No code on this track yet.</p>";
    }

    var drawer = document.createElement("tr");
    drawer.className = "t-answers-row";
    drawer.innerHTML = '<td colspan="6"><div class="t-answers">' + html + "</div></td>";
    tr.parentNode.insertBefore(drawer, tr.nextSibling);
  }

  // ---- CSV ------------------------------------------------------------------
  function csvCell(v) {
    var s = String(v == null ? "" : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function buildCsv() {
    var header = ["Code", "First name", "Last name", "Class", "Task", "Completed", "Percent"];
    var lines = [header.map(csvCell).join(",")];
    lastRows.forEach(function (r) {
      lines.push([
        r.code, r.first_name, r.last_name, r.class,
        lastTask ? lastTask.label : "",
        r.completed ? "Yes" : "No",
        r.pct
      ].map(csvCell).join(","));
    });
    return lines.join("\n");
  }

  function downloadCsv() {
    if (!lastRows.length) return;
    var blob = new Blob([buildCsv()], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var name = (lastClass || "class") + "-" + (lastTask ? lastTask.key : "task") + ".csv";
    a.href = url;
    a.download = name.replace(/[^a-z0-9.-]+/gi, "_");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  async function copyCsv() {
    if (!lastRows.length) return;
    var text = buildCsv();
    try {
      await navigator.clipboard.writeText(text);
      flash(el("teacher-copy"), "Copied!");
    } catch (e) {
      // Fallback: select-and-prompt
      window.prompt("Copy the CSV below:", text);
    }
  }

  function flash(btn, msg) {
    var old = btn.textContent;
    btn.textContent = msg;
    setTimeout(function () { btn.textContent = old; }, 1400);
  }

  // ---- Wiring ---------------------------------------------------------------
  async function refresh() {
    var cls = el("teacher-class").value;
    var taskKey = el("teacher-task").value;
    var task = ALL_TASKS.filter(function (t) { return t.key === taskKey; })[0];
    if (!cls || !task) return;
    el("teacher-status").textContent = "Loading…";
    el("teacher-summary").hidden = true;
    try {
      var data;
      if (task.kind === "homework") {
        // A homework set belongs to one class; follow it so the table always
        // shows the class it was actually set for ('ALL' uses the picker).
        if (task.hw.class !== "ALL" && task.hw.class !== cls) {
          cls = task.hw.class;
          el("teacher-class").value = cls;
        }
        data = await loadHomeworkData(cls, task);
      } else if (task.kind === "assignment") {
        data = await loadAssignmentData(cls, task);
      } else {
        data = await loadClassData(cls, task);
      }
      render(cls, task, data);
    } catch (e) {
      el("teacher-status").textContent = "Couldn't load: " + (e.message || e);
    }
  }

  function fillTaskSelect() {
    var taskSel = el("teacher-task");
    var previous = taskSel.value;
    var groups = [];
    var byGroup = {};
    ALL_TASKS.forEach(function (t) {
      var g = t.group || "Other";
      if (!byGroup[g]) { byGroup[g] = []; groups.push(g); }
      byGroup[g].push(t);
    });
    taskSel.innerHTML = groups.map(function (g) {
      return '<optgroup label="' + escapeHtml(g) + '">' +
        byGroup[g].map(function (t) {
          return '<option value="' + escapeHtml(t.key) + '">' + escapeHtml(t.label) + '</option>';
        }).join("") +
        '</optgroup>';
    }).join("");
    if (previous && ALL_TASKS.some(function (t) { return t.key === previous; })) {
      taskSel.value = previous;
    }
  }

  async function startTool() {
    if (!window.ITBasics || !window.ITBasics.isOnline()) {
      el("teacher-status").textContent =
        "This page needs the Supabase database (it is offline right now).";
      return;
    }
    try { await loadHomeworkRows(); } catch (e) { /* table may not exist yet */ }
    buildTasks();
    fillTaskSelect();

    var classes;
    try {
      classes = await loadClasses();
      var classSel = el("teacher-class");
      classSel.innerHTML = classes.map(function (c) {
        return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
      }).join("");
    } catch (e) {
      el("teacher-status").textContent = "Couldn't load classes: " + (e.message || e);
      return;
    }

    el("teacher-class").addEventListener("change", refresh);
    el("teacher-task").addEventListener("change", refresh);
    el("teacher-copy").addEventListener("click", copyCsv);
    el("teacher-download").addEventListener("click", downloadCsv);
    initHomeworkBuilder(classes);
    refresh();
  }

  // ---- Homework builder -------------------------------------------------------

  function hwCatalog() {
    var groups = [];
    var HS = window.HWStatus;
    groups.push({
      label: "Modules",
      items: Object.keys(HS.MODULE_RULES).map(function (k) {
        return { type: "module", key: k, label: HS.MODULE_RULES[k].label };
      })
    });
    groups.push({
      label: "Assignments",
      items: Object.keys(HS.ASSIGNMENT_INFO).map(function (k) {
        return { type: "assignment", key: k, label: HS.ASSIGNMENT_INFO[k].label.replace(/\s*\(.*\)$/, "") };
      })
    });
    var catalog = window.ITBASICS_CHALLENGE_CATALOG || [];
    if (catalog.length) {
      groups.push({
        label: "Coding challenges",
        items: catalog.map(function (c) {
          return { type: "challenge", key: c.id, label: c.title };
        })
      });
    }
    return groups;
  }

  function initHomeworkBuilder(classes) {
    var box = el("hw-builder");
    if (!box || !window.HWStatus) return;

    el("hw-class").innerHTML =
      classes.map(function (c) {
        return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
      }).join("") + '<option value="ALL">ALL classes</option>';

    el("hw-items").innerHTML = hwCatalog().map(function (g) {
      return '<fieldset class="hw-group"><legend>' + escapeHtml(g.label) + '</legend>' +
        g.items.map(function (it) {
          return '<label class="hw-pick"><input type="checkbox" ' +
            'data-type="' + escapeHtml(it.type) + '" data-key="' + escapeHtml(it.key) + '" ' +
            'data-label="' + escapeHtml(it.label) + '" /> ' + escapeHtml(it.label) + '</label>';
        }).join("") +
      '</fieldset>';
    }).join("");

    el("hw-create").addEventListener("click", createHomework);
    renderExistingHomework();
  }

  async function createHomework() {
    var msg = el("hw-msg");
    msg.textContent = "";
    msg.className = "auth-msg";
    var title = el("hw-title").value.trim();
    var items = [];
    el("hw-items").querySelectorAll("input:checked").forEach(function (cb) {
      // The label is stored with the item so pages that don't load the
      // challenge catalog (like the student home page) still show nice names.
      items.push({ type: cb.dataset.type, key: cb.dataset.key, label: cb.dataset.label });
    });
    if (!items.length) { msg.textContent = "Tick at least one item."; msg.classList.add("error"); return; }
    if (!title) {
      title = "Homework: " + new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    }

    var row = {
      class: el("hw-class").value,
      title: title,
      items: items,
      due_date: el("hw-due").value || null
    };
    var res = await sb().from("homework").insert(row);
    if (res.error) {
      var m = String(res.error.message || "");
      msg.textContent = /does not exist|schema cache/i.test(m)
        ? "The homework table isn't set up yet: run the homework block from supabase-schema.sql."
        : "Couldn't save: " + m;
      msg.classList.add("error");
      return;
    }
    msg.textContent = "Set! Students in " + row.class + " will see it when they sign in.";
    el("hw-title").value = "";
    el("hw-items").querySelectorAll("input:checked").forEach(function (cb) { cb.checked = false; });
    await loadHomeworkRows();
    buildTasks();
    fillTaskSelect();
    renderExistingHomework();
  }

  function renderExistingHomework() {
    var host = el("hw-existing");
    if (!host) return;
    if (!HOMEWORK_ROWS.length) { host.innerHTML = ""; return; }
    host.innerHTML = "<h3>Current homework</h3>" + HOMEWORK_ROWS.map(function (hw) {
      var names = (hw.items || []).map(function (it) {
        return window.HWStatus.itemLabel(it).replace(/\s*\(.*\)$/, "");
      }).join(", ");
      return '<div class="hw-row" data-id="' + hw.id + '">' +
        '<span><strong>' + escapeHtml(hw.title) + '</strong> · ' + escapeHtml(hw.class) +
          (hw.due_date ? ' · due ' + escapeHtml(hw.due_date) : '') +
          '<span class="hw-row-items">' + escapeHtml(names) + '</span></span>' +
        '<button type="button" class="btn btn-ghost hw-delete">Remove</button>' +
      '</div>';
    }).join("");
    host.querySelectorAll(".hw-delete").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var rowEl = btn.closest(".hw-row");
        var id = parseInt(rowEl.dataset.id, 10);
        var hw = HOMEWORK_ROWS.filter(function (h) { return h.id === id; })[0];
        if (!window.confirm('Remove homework "' + (hw ? hw.title : id) + '"? Students will no longer see it.')) return;
        await sb().from("homework").delete().eq("id", id);
        await loadHomeworkRows();
        buildTasks();
        fillTaskSelect();
        renderExistingHomework();
      });
    });
  }

  function unlock() {
    el("teacher-gate").hidden = true;
    el("teacher-tool").hidden = false;
    startTool();
  }

  // Signed in with a staff code (see TEACHER_CODES in supabase-config.js)?
  // Then the passphrase gate is skipped entirely.
  function isStaff() {
    var codes = window.TEACHER_CODES || [];
    var s = window.ITBasics && window.ITBasics.getSession();
    return Boolean(s && codes.indexOf(s.code) !== -1);
  }

  function boot() {
    var pass = window.TEACHER_PASSCODE || "hallam-staff";
    if (sessionStorage.getItem(GATE_KEY) === "1" || isStaff()) { unlock(); return; }

    var form = el("teacher-gate-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = el("teacher-pass").value;
      var msg = el("teacher-gate-msg");
      if (val === pass) {
        sessionStorage.setItem(GATE_KEY, "1");
        unlock();
      } else {
        msg.textContent = "Wrong passphrase.";
        msg.classList.add("error");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
