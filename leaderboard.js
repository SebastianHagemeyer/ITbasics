(function () {
  "use strict";

  const QUIZZES = ["programming", "html", "python", "mixed"];

  let cachedRows = null;
  let currentClass = "7A";

  async function loadRows() {
    const status = document.getElementById("leaderboard-status");
    if (!window.ITBasics || !window.ITBasics.isOnline()) {
      status.textContent = "Leaderboard needs the Supabase database. Ask your teacher to set it up.";
      return [];
    }
    const sb = window.ITBasics.client();
    const [{ data: students, error: e1 }, { data: attempts, error: e2 }] = await Promise.all([
      sb.from("students").select("code,first_name,last_name,class,year_level"),
      sb.from("quiz_attempts").select("student_code,quiz_name,score,total")
    ]);
    if (e1 || e2) {
      status.textContent = "Couldn’t load scores. " + ((e1 || e2).message || "");
      return [];
    }

    // Best score per (student, quiz) for the fixed quizzes;
    // freeplay is summed (every correct answer adds 1 forever).
    const best = {};
    const freeplay = {};
    (attempts || []).forEach(function (a) {
      if (a.quiz_name === "freeplay") {
        freeplay[a.student_code] = (freeplay[a.student_code] || 0) + (a.score || 0);
      } else {
        const key = a.student_code + "|" + a.quiz_name;
        if (!best[key] || a.score > best[key].score) best[key] = a;
      }
    });

    return (students || []).map(function (s) {
      const row = {
        code: s.code,
        first_name: s.first_name,
        last_name: s.last_name,
        class: s.class,
        scores: {},
        freeplay: freeplay[s.code] || 0,
        total: 0
      };
      QUIZZES.forEach(function (q) {
        const b = best[s.code + "|" + q];
        row.scores[q] = b ? b.score : null;
        if (b) row.total += b.score;
      });
      row.total += row.freeplay;
      return row;
    });
  }

  function render() {
    const body = document.getElementById("leaderboard-body");
    const status = document.getElementById("leaderboard-status");
    body.innerHTML = "";

    if (!cachedRows) { status.textContent = "Loading…"; return; }

    let rows = cachedRows;
    if (currentClass !== "ALL") rows = rows.filter(function (r) { return r.class === currentClass; });

    // Only show students with at least one attempt; sort by total desc, then by name.
    rows = rows.filter(function (r) { return r.total > 0; });
    rows.sort(function (a, b) {
      if (b.total !== a.total) return b.total - a.total;
      return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name);
    });

    if (!rows.length) {
      status.textContent = currentClass === "ALL"
        ? "No attempts yet. Be the first!"
        : "No one in " + currentClass + " has tried a quiz yet. You could be first!";
      return;
    }
    status.textContent = "";

    const session = window.ITBasics && window.ITBasics.getSession();
    const myCode = session ? session.code : null;

    rows.forEach(function (r, i) {
      const tr = document.createElement("tr");
      const rank = i + 1;
      if (r.code === myCode) tr.className = "me";

      const lastInitial = (r.last_name || "").slice(0, 1).toUpperCase();
      const name = r.code === myCode
        ? escapeHtml(r.first_name) + " " + escapeHtml(r.last_name) + ' <span class="you-tag">you</span>'
        : escapeHtml(r.first_name) + " " + escapeHtml(lastInitial) + ".";

      const rankClass = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
      tr.innerHTML =
        '<td class="col-rank"><span class="rank-pill ' + rankClass + '">' + rank + '</span></td>' +
        '<td class="col-name">' + name + '</td>' +
        '<td class="col-class">' + escapeHtml(r.class) + '</td>' +
        scoreCell(r.scores.programming) +
        scoreCell(r.scores.html) +
        scoreCell(r.scores.python) +
        scoreCell(r.scores.mixed) +
        scoreCell(r.freeplay || null) +
        '<td class="col-total"><strong>' + r.total + '</strong></td>';
      body.appendChild(tr);
    });
  }

  function scoreCell(v) {
    if (v == null) return '<td class="col-score muted">—</td>';
    return '<td class="col-score">' + v + '</td>';
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setupTabs() {
    const tabs = document.querySelectorAll('[data-tabs="class"] .quiz-tab');
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        currentClass = t.dataset.class;
        render();
      });
    });

    // Default tab to the signed-in student's class.
    const s = window.ITBasics && window.ITBasics.getSession();
    if (s && s.class) {
      const match = Array.prototype.find.call(tabs, function (t) { return t.dataset.class === s.class; });
      if (match) {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        match.classList.add("active");
        currentClass = s.class;
      }
    }
  }

  async function boot() {
    setupTabs();
    cachedRows = await loadRows();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Reload when the user signs in/out (mostly relevant if they sign out from the leaderboard).
  window.addEventListener("itbasics:auth", async function () {
    cachedRows = await loadRows();
    render();
  });
})();
