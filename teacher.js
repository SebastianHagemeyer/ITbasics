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
    { key: "decisions",   label: "Making Decisions (module)", group: "Modules & quizzes", quizzes: ["decisions", "decisions-task"], compute: computeDecisions },
    { key: "loops",       label: "Loops (module)",            group: "Modules & quizzes", quizzes: ["loops", "loops-for-task", "loops-while-task"], compute: computeLoops },
    { key: "programming", label: "Programming quiz",          group: "Modules & quizzes", quizzes: ["programming"], compute: testCompute("programming") },
    { key: "html",        label: "HTML quiz",                 group: "Modules & quizzes", quizzes: ["html"],        compute: testCompute("html") },
    { key: "python",      label: "Python quiz",               group: "Modules & quizzes", quizzes: ["python"],      compute: testCompute("python") },
    { key: "binary",      label: "Binary & Data test",        group: "Modules & quizzes", quizzes: ["binary"],      compute: testCompute("binary") },
    { key: "codes",       label: "Codes & Colour test",       group: "Modules & quizzes", quizzes: ["codes"],       compute: testCompute("codes") },
    { key: "systems",     label: "Digital Systems test",      group: "Modules & quizzes", quizzes: ["systems"],     compute: testCompute("systems") },
    { key: "networks",    label: "Networks & Safety test",    group: "Modules & quizzes", quizzes: ["networks"],    compute: testCompute("networks") },
    { key: "os",          label: "Computer Skills test",      group: "Modules & quizzes", quizzes: ["os"],          compute: testCompute("os") }
  ];

  // Built once we know the challenge catalog; combined list the dropdown uses.
  var ALL_TASKS = MODULE_TASKS.slice();

  function buildTasks() {
    ALL_TASKS = MODULE_TASKS.slice();
    var catalog = window.ITBASICS_CHALLENGE_CATALOG || [];
    if (!catalog.length) return;
    var ids = catalog.map(function (c) { return c.id; });
    // Overall: how many of the live-coding challenges each student has cracked.
    ALL_TASKS.push({
      key: "livecoding-all",
      label: "Live Coding — all challenges (" + ids.length + ")",
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

  // Loops blends the quick check (quiz_name "loops", 50%) with two coding tasks
  // (loops-for-task and loops-while-task, 25% each) — 100% only when all three.
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

  // ---- Data -----------------------------------------------------------------
  function sb() { return window.ITBasics.client(); }

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
      var data = await loadClassData(cls, task);
      render(cls, task, data);
    } catch (e) {
      el("teacher-status").textContent = "Couldn't load: " + (e.message || e);
    }
  }

  async function startTool() {
    if (!window.ITBasics || !window.ITBasics.isOnline()) {
      el("teacher-status").textContent =
        "This page needs the Supabase database (it is offline right now).";
      return;
    }
    buildTasks();
    var taskSel = el("teacher-task");
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

    try {
      var classes = await loadClasses();
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
    refresh();
  }

  function unlock() {
    el("teacher-gate").hidden = true;
    el("teacher-tool").hidden = false;
    startTool();
  }

  function boot() {
    var pass = window.TEACHER_PASSCODE || "hallam-staff";
    if (sessionStorage.getItem(GATE_KEY) === "1") { unlock(); return; }

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
