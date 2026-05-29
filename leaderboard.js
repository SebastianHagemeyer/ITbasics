(function () {
  "use strict";

  let cachedRows = null;
  let currentClass = "7A";
  let currentMode = "quiz"; // "quiz" | "livecoding"

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
        livecoding: r.livecoding || 0
      };
    });
  }

  // The ranking metric depends on the mode.
  function quizTotal(r) {
    return (r.scores.programming || 0) + (r.scores.html || 0) + (r.scores.python || 0) +
           (r.scores.mixed || 0) + (r.freeplay || 0);
  }
  function metricFor(r) {
    return currentMode === "livecoding" ? (r.livecoding || 0) : quizTotal(r);
  }

  function render() {
    const head = document.getElementById("leaderboard-head");
    const body = document.getElementById("leaderboard-body");
    const status = document.getElementById("leaderboard-status");
    head.innerHTML = headerRow();
    body.innerHTML = "";

    // Mr H: untouchable, always on top, regardless of class filter or data state.
    body.appendChild(buildTeacherRow());

    if (!cachedRows) { status.textContent = "Loading…"; return; }

    let rows = cachedRows;
    // Teacher accounts never appear in the regular rankings - Mr H lives in
    // his own pinned row above.
    rows = rows.filter(function (r) { return r.class !== "TEACHER"; });
    if (currentClass !== "ALL") rows = rows.filter(function (r) { return r.class === currentClass; });

    // Only show students who have something on this board; sort by the
    // mode's metric desc, then by name.
    rows = rows.filter(function (r) { return metricFor(r) > 0; });
    rows.sort(function (a, b) {
      const diff = metricFor(b) - metricFor(a);
      if (diff !== 0) return diff;
      return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name);
    });

    if (!rows.length) { status.textContent = emptyMessage(); return; }
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
        bodyCells(r);
      body.appendChild(tr);
    });
  }

  function headerRow() {
    let cols;
    if (currentMode === "livecoding") {
      cols = '<th class="col-total">Challenges done</th>';
    } else {
      cols = '<th>Programming</th><th>HTML</th><th>Python</th><th>Mixed</th><th>Freeplay</th>' +
             '<th class="col-total">Total</th>';
    }
    return '<tr><th class="col-rank">#</th><th>Student</th><th class="col-class">Class</th>' + cols + '</tr>';
  }

  function bodyCells(r) {
    if (currentMode === "livecoding") {
      return '<td class="col-total"><strong>' + (r.livecoding || 0) + '</strong></td>';
    }
    return scoreCell(r.scores.programming) +
           scoreCell(r.scores.html) +
           scoreCell(r.scores.python) +
           scoreCell(r.scores.mixed) +
           scoreCell(r.freeplay || null) +
           '<td class="col-total"><strong>' + quizTotal(r) + '</strong></td>';
  }

  function buildTeacherRow() {
    const session = window.ITBasics && window.ITBasics.getSession();
    const isMe = !!(session && session.class === "TEACHER");
    const tr = document.createElement("tr");
    tr.className = "teacher" + (isMe ? " me" : "");
    const tag = isMe ? ' <span class="you-tag">you</span>' : '';
    let mid;
    if (currentMode === "livecoding") {
      mid = '<td class="col-total"><strong>∞</strong></td>';
    } else {
      mid = '<td class="col-score">∞</td><td class="col-score">∞</td><td class="col-score">∞</td>' +
            '<td class="col-score">∞</td><td class="col-score">∞</td>' +
            '<td class="col-total"><strong>∞</strong></td>';
    }
    tr.innerHTML =
      '<td class="col-rank"><span class="rank-pill teacher-rank">0</span></td>' +
      '<td class="col-name">Mr H' + tag + '</td>' +
      '<td class="col-class">TEACHER</td>' + mid;
    return tr;
  }

  function emptyMessage() {
    const what = currentMode === "livecoding" ? "cracked a challenge" : "tried a quiz";
    return currentClass === "ALL"
      ? "No one has " + what + " yet. Be the first!"
      : "No one in " + currentClass + " has " + what + " yet. You could be first!";
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

  function setupClassTabs() {
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

  function setupModeTabs() {
    const tabs = document.querySelectorAll('[data-tabs="mode"] .quiz-tab');
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        currentMode = t.dataset.mode;
        render();
      });
    });
  }

  async function boot() {
    setupModeTabs();
    setupClassTabs();
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
