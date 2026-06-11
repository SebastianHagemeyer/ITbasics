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
    { key: "binary",      label: "Binary & Data",  href: "/topics/binary/" },
    { key: "codes",       label: "Codes & Colour", href: "/topics/codes/" },
    { key: "systems",     label: "Digital Systems", href: "/topics/systems/" }
  ];

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
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
    var names = ["programming", "html", "python", "binary", "codes", "systems", "freeplay", "livecoding"];
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
    var pct = data.attempted && data.total ? Math.round((data.best / data.total) * 100) : 0;
    var state, right, note;
    if (!data.attempted) {
      state = "todo";
      right = '<span class="progress-quiz-state">Not tried</span>';
      note = "No test taken yet";
    } else {
      var perfect = pct === 100;
      state = perfect ? "perfect" : "done";
      right =
        '<span class="progress-quiz-score">' + pct + '%</span>' +
        '<span class="progress-quiz-state ' + state + '">' + (perfect ? "Perfect!" : "Done") + '</span>';
      note = "Best " + data.best + "/" + data.total + (data.attempts > 1 ? " · " + data.attempts + " tries" : "");
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
    status.textContent = "";
    el("progress-content").hidden = false;
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
