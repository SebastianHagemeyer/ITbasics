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
    // leaderboard_view aggregates server-side: one row per student, ~58 rows total.
    // Querying quiz_attempts directly hits the 1000-row REST cap once Freeplay accumulates.
    const { data, error } = await sb.from("leaderboard_view").select("*");
    if (error) {
      status.textContent = "Couldn't load scores. " + (error.message || "");
      return [];
    }
    return (data || []).map(function (r) {
      return {
        code: r.code,
        first_name: r.first_name,
        last_name: r.last_name,
        class: r.class,
        scores: {
          programming: r.programming,
          html: r.html,
          python: r.python,
          mixed: r.mixed
        },
        freeplay: r.freeplay || 0,
        total: (r.programming || 0) + (r.html || 0) + (r.python || 0) +
               (r.mixed || 0) + (r.freeplay || 0)
      };
    });
  }

  function render() {
    const body = document.getElementById("leaderboard-body");
    const status = document.getElementById("leaderboard-status");
    body.innerHTML = "";

    // Mr H: untouchable, always on top, regardless of class filter or data state.
    body.appendChild(buildTeacherRow());

    if (!cachedRows) { status.textContent = "Loading…"; return; }

    let rows = cachedRows;
    // Teacher accounts never appear in the regular rankings - Mr H lives in
    // his own pinned row above.
    rows = rows.filter(function (r) { return r.class !== "TEACHER"; });
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

  function buildTeacherRow() {
    const session = window.ITBasics && window.ITBasics.getSession();
    const isMe = !!(session && session.class === "TEACHER");
    const tr = document.createElement("tr");
    tr.className = "teacher" + (isMe ? " me" : "");
    const tag = isMe ? ' <span class="you-tag">you</span>' : '';
    tr.innerHTML =
      '<td class="col-rank"><span class="rank-pill teacher-rank">0</span></td>' +
      '<td class="col-name">Mr H' + tag + '</td>' +
      '<td class="col-class">TEACHER</td>' +
      '<td class="col-score">∞</td>' +
      '<td class="col-score">∞</td>' +
      '<td class="col-score">∞</td>' +
      '<td class="col-score">∞</td>' +
      '<td class="col-score">∞</td>' +
      '<td class="col-total"><strong>∞</strong></td>';
    return tr;
  }

  function scoreCell(v) {
    if (v == null) return '<td class="col-score muted">-</td>';
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
