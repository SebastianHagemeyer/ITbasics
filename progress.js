(function () {
  "use strict";

  // The four scored quizzes, in course order. Keys match the quiz_name that
  // quiz.js passes to saveAttempt(name, correct, total, ...).
  var QUIZZES = [
    { key: "programming", label: "Programming quiz", note: "Module 1" },
    { key: "html",        label: "HTML quiz",        note: "Module 2" },
    { key: "python",      label: "Python quiz",      note: "Module 3" },
    { key: "mixed",       label: "Mixed review",     note: "A bit of everything" }
  ];

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Every attempt row for the signed-in student. Online: one query scoped to
  // this student (small result set, nowhere near the REST row cap). Offline:
  // rebuild rows from the localStorage buckets app.js writes per quiz.
  async function loadAttempts(student) {
    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      var res = await sb.from("quiz_attempts")
        .select("quiz_name, score, total, answers")
        .eq("student_code", student.code);
      if (res.error) return { error: res.error.message, rows: [] };
      return { rows: res.data || [] };
    }
    var names = ["programming", "html", "python", "mixed", "freeplay", "livecoding"];
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

  // Roll the raw rows up into per-quiz bests plus Freeplay and Live Coding totals.
  function summarise(rows) {
    var quizzes = {};
    QUIZZES.forEach(function (q) {
      var mine = rows.filter(function (r) { return r.quiz_name === q.key; });
      if (!mine.length) { quizzes[q.key] = { attempted: false }; return; }
      var best = mine.reduce(function (m, r) { return r.score > m.score ? r : m; }, mine[0]);
      var total = mine.reduce(function (t, r) { return Math.max(t, r.total || 0); }, 0);
      quizzes[q.key] = { attempted: true, best: best.score, total: total, attempts: mine.length };
    });

    var freeplay = rows
      .filter(function (r) { return r.quiz_name === "freeplay"; })
      .reduce(function (s, r) { return s + (r.score || 0); }, 0);

    // Live Coding: one row per pass, answers.challenge holds the challenge id.
    // Count distinct ids so re-passing the same challenge doesn't inflate it.
    var seen = {};
    rows.filter(function (r) { return r.quiz_name === "livecoding"; }).forEach(function (r) {
      var id = r.answers && r.answers.challenge;
      if (id != null) seen[id] = true;
    });

    return { quizzes: quizzes, freeplay: freeplay, livecoding: Object.keys(seen).length };
  }

  function quizCard(q, data) {
    var pct = data.attempted && data.total ? Math.round((data.best / data.total) * 100) : 0;
    var state, right;
    if (!data.attempted) {
      state = "todo";
      right = '<span class="progress-quiz-state">Not yet</span>';
    } else {
      var perfect = data.total > 0 && data.best === data.total;
      state = perfect ? "perfect" : "done";
      right =
        '<span class="progress-quiz-score">' + data.best + '/' + data.total + '</span>' +
        '<span class="progress-quiz-state ' + state + '">' + (perfect ? "Perfect!" : "Done") + '</span>';
    }
    var note = q.note + (data.attempted && data.attempts > 1 ? " · " + data.attempts + " tries" : "");
    return (
      '<div class="progress-quiz ' + state + '">' +
        '<div class="progress-quiz-top">' +
          '<span class="progress-quiz-label">' + escapeHtml(q.label) + '</span>' +
          '<span class="progress-quiz-right">' + right + '</span>' +
        '</div>' +
        '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' +
        '<p class="progress-quiz-note">' + escapeHtml(note) + '</p>' +
      '</div>'
    );
  }

  function render(student, summary) {
    el("progress-greeting").textContent = "Hey " + (student.first_name || student.code) + "!";

    el("progress-quizzes").innerHTML =
      QUIZZES.map(function (q) { return quizCard(q, summary.quizzes[q.key]); }).join("");

    el("progress-livecoding").textContent = summary.livecoding;
    el("progress-freeplay").textContent = summary.freeplay;

    var done = QUIZZES.filter(function (q) { return summary.quizzes[q.key].attempted; }).length;
    el("progress-done-count").textContent = done;
    el("progress-total-count").textContent = QUIZZES.length;

    var msg;
    if (done === 0) {
      msg = "You haven't tried a quiz yet. Pick one and give it a go!";
    } else if (done === QUIZZES.length) {
      msg = "All " + QUIZZES.length + " quizzes done. Legend! Go chase those perfect scores.";
    } else {
      msg = done + " of " + QUIZZES.length + " quizzes complete. Keep going!";
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
