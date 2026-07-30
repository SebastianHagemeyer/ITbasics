(function () {
  "use strict";

  let cachedRows = null;
  let currentClass = "7A";
  // The quiz board is retired from display (its tab is gone, so "quiz" is
  // never selected), but quiz scores are still stored and fetched untouched.
  let currentMode = "xp";         // "xp" | "livecoding" | "freeplay"
  let todayOnly = false;    // "Today" toggle: count only scores made today
  let todayRows = null;     // aggregated today-only scores (lazy, refreshed live)
  let todayTimer = null;    // auto-refresh interval while Today is active

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
        livecoding: r.livecoding || 0,
        xp: r.xp || 0
      };
    });
  }

  // Whichever dataset is on screen: the live "Today" aggregate or the all-time view.
  function activeRows() { return todayOnly ? todayRows : cachedRows; }

  // "Today" board: aggregate just today's attempts (the teacher's local day)
  // client-side, reusing names/class from the all-time rows. The time filter
  // keeps the row count small, but we page through anyway so a busy day can't
  // silently truncate at PostgREST's 1000-row cap.
  async function loadTodayRows() {
    if (!window.ITBasics || !window.ITBasics.isOnline()) return [];
    const sb = window.ITBasics.client();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startISO = start.toISOString();

    const nameMap = {};
    (cachedRows || []).forEach(function (r) {
      nameMap[r.code] = { first_name: r.first_name, last_name: r.last_name, class: r.class };
    });

    const agg = {};
    const PAGE = 1000;
    let from = 0;
    while (true) {
      const res = await sb.from("quiz_attempts")
        .select("student_code, quiz_name, score, answers")
        .gte("attempted_at", startISO)
        .order("id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (res.error) break;
      const data = res.data || [];
      data.forEach(function (a) {
        const m = agg[a.student_code] || (agg[a.student_code] = { scores: {}, freeplay: 0, ch: {}, raw: [] });
        m.raw.push({ quiz_name: a.quiz_name, score: a.score, total: a.total, answers: a.answers });
        if (a.quiz_name === "freeplay") {
          m.freeplay += (a.score || 0);
        } else if (a.quiz_name === "livecoding") {
          const ch = a.answers && a.answers.challenge;
          if (ch) m.ch[ch] = true;
        } else if (a.quiz_name === "programming" || a.quiz_name === "html" ||
                   a.quiz_name === "python" || a.quiz_name === "mixed") {
          m.scores[a.quiz_name] = Math.max(m.scores[a.quiz_name] || 0, a.score || 0);
        }
      });
      if (data.length < PAGE) break;
      from += PAGE;
    }

    return Object.keys(agg).map(function (code) {
      const info = nameMap[code] || { first_name: "Unknown", last_name: "", class: "?" };
      const m = agg[code];
      return {
        code: code,
        first_name: info.first_name,
        last_name: info.last_name,
        class: info.class,
        scores: {
          programming: m.scores.programming,
          html: m.scores.html,
          python: m.scores.python,
          mixed: m.scores.mixed
        },
        freeplay: m.freeplay,
        livecoding: Object.keys(m.ch).length,
        xp: window.ITXP ? window.ITXP.fromAttempts(m.raw).xp : 0
      };
    });
  }

  // The ranking metric depends on the mode. Quiz total covers only the four
  // structured quizzes - Freeplay has its own board now.
  function quizTotal(r) {
    return (r.scores.programming || 0) + (r.scores.html || 0) + (r.scores.python || 0) +
           (r.scores.mixed || 0);
  }
  function metricFor(r) {
    if (currentMode === "xp")         return r.xp         || 0;
    if (currentMode === "livecoding") return r.livecoding || 0;
    if (currentMode === "freeplay")   return r.freeplay   || 0;
    return quizTotal(r);
  }

  function render() {
    const head = document.getElementById("leaderboard-head");
    const body = document.getElementById("leaderboard-body");
    const status = document.getElementById("leaderboard-status");
    head.innerHTML = headerRow();
    body.innerHTML = "";

    // Mr H: untouchable, always on top, regardless of class filter or data state.
    body.appendChild(buildTeacherRow());

    const source = activeRows();
    if (!source) { status.textContent = todayOnly ? "Loading today's scores…" : "Loading…"; appendGremlinRows(body); return; }

    let rows = source;
    // Teacher accounts never appear in the regular rankings - Mr H lives in
    // his own pinned row above. The TEST class (gremlin test account) is
    // hidden too, so testing never pollutes the standings.
    rows = rows.filter(function (r) { return r.class !== "TEACHER" && r.class !== "TEST"; });
    if (currentClass !== "ALL") rows = rows.filter(function (r) { return r.class === currentClass; });

    // Only show students who have something on this board; sort by the
    // mode's metric desc, then by name.
    rows = rows.filter(function (r) { return metricFor(r) > 0; });
    rows.sort(function (a, b) {
      const diff = metricFor(b) - metricFor(a);
      if (diff !== 0) return diff;
      return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name);
    });

    if (!rows.length) { status.textContent = emptyMessage(); appendGremlinRows(body); return; }
    status.textContent = todayOnly ? "Today only · updates live" : "";

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

    appendGremlinRows(body);
  }

  // The TEST class (gremlin test account) is shown but never ranked: it sits
  // in its own row at the bottom with its real scores and no rank number, so
  // it can't bump or affect the real standings.
  function appendGremlinRows(body) {
    const source = activeRows();
    if (!source) return;
    const session = window.ITBasics && window.ITBasics.getSession();
    const myCode = session ? session.code : null;
    source.filter(function (r) { return r.class === "TEST"; }).forEach(function (r) {
      const tr = document.createElement("tr");
      tr.className = "gremlin" + (r.code === myCode ? " me" : "");
      const name = escapeHtml(r.first_name) + " " + escapeHtml(r.last_name) +
        ' <span class="ghost-tag">test</span>';
      tr.innerHTML =
        '<td class="col-rank"><span class="rank-pill gremlin-rank" title="Test account - not ranked">-</span></td>' +
        '<td class="col-name">' + name + '</td>' +
        '<td class="col-class">' + escapeHtml(r.class) + '</td>' +
        bodyCells(r);
      body.appendChild(tr);
    });
  }

  function headerRow() {
    let cols;
    if (currentMode === "xp") {
      cols = '<th class="col-level">Level</th><th class="col-total">XP</th>';
    } else if (currentMode === "livecoding") {
      cols = '<th class="col-total">Challenges done</th>';
    } else if (currentMode === "freeplay") {
      cols = '<th class="col-total">Freeplay correct</th>';
    } else {
      cols = '<th>Programming</th><th>HTML</th><th>Python</th><th>Mixed</th>' +
             '<th class="col-total">Total</th>';
    }
    return '<tr><th class="col-rank">#</th><th>Student</th><th class="col-class">Class</th>' + cols + '</tr>';
  }

  function bodyCells(r) {
    if (currentMode === "xp") {
      return '<td class="col-level">' + levelPill(r.xp || 0) + '</td>' +
             '<td class="col-total"><strong>' + (r.xp || 0) + '</strong></td>';
    }
    if (currentMode === "livecoding") {
      return '<td class="col-total"><strong>' + (r.livecoding || 0) + '</strong></td>';
    }
    if (currentMode === "freeplay") {
      return '<td class="col-total"><strong>' + (r.freeplay || 0) + '</strong></td>';
    }
    return scoreCell(r.scores.programming) +
           scoreCell(r.scores.html) +
           scoreCell(r.scores.python) +
           scoreCell(r.scores.mixed) +
           '<td class="col-total"><strong>' + quizTotal(r) + '</strong></td>';
  }

  // The level badge beside a score. Names and thresholds come from xp.js, so
  // the leaderboard can never disagree with the progress page.
  function levelPill(xp) {
    if (!window.ITXP) return "";
    const s = window.ITXP.levelFor(xp);
    return '<span class="lb-level" title="' + escapeHtml(s.name) + '">' +
             '<span class="lb-level-num">' + s.level + '</span>' +
             '<span class="lb-level-name">' + escapeHtml(s.name) + '</span>' +
           '</span>';
  }

  function buildTeacherRow() {
    const session = window.ITBasics && window.ITBasics.getSession();
    const isMe = !!(session && session.class === "TEACHER");
    const tr = document.createElement("tr");
    tr.className = "teacher" + (isMe ? " me" : "");
    const tag = isMe ? ' <span class="you-tag">you</span>' : '';
    let mid;
    if (currentMode === "xp") {
      mid = '<td class="col-level"><span class="lb-level"><span class="lb-level-num">&infin;</span>' +
            '<span class="lb-level-name">Mastermind</span></span></td>' +
            '<td class="col-total"><strong>∞</strong></td>';
    } else if (currentMode === "livecoding" || currentMode === "freeplay") {
      mid = '<td class="col-total"><strong>∞</strong></td>';
    } else {
      mid = '<td class="col-score">∞</td><td class="col-score">∞</td><td class="col-score">∞</td>' +
            '<td class="col-score">∞</td>' +
            '<td class="col-total"><strong>∞</strong></td>';
    }
    tr.innerHTML =
      '<td class="col-rank"><span class="rank-pill teacher-rank">0</span></td>' +
      '<td class="col-name">Mr H' + tag + '</td>' +
      '<td class="col-class">TEACHER</td>' + mid;
    return tr;
  }

  function emptyMessage() {
    const what = currentMode === "xp"         ? "earned any XP"
               : currentMode === "livecoding" ? "cracked a challenge"
               : currentMode === "freeplay"   ? "tried Freeplay"
               :                                "tried a quiz";
    const when = todayOnly ? " today" : "";
    return currentClass === "ALL"
      ? "No one has " + what + when + " yet. Be the first!"
      : "No one in " + currentClass + " has " + what + when + " yet. You could be first!";
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
    const more = document.querySelector('[data-tabs="class"] .lb-more');
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        currentClass = t.dataset.class;
        render();
      });
    });

    // Only your own class is on show. The other six fold away behind the
    // arrow, because a row of tabs for classes you are not in is just noise.
    function fold(mine) {
      if (!more) return;
      tabs.forEach(function (t) {
        t.classList.toggle("lb-tucked", t.dataset.class !== mine);
      });
      more.hidden = false;
    }
    if (more) {
      more.hidden = true;   // fold() reveals it once we know their class
      more.addEventListener("click", function () {
        const open = more.getAttribute("aria-expanded") === "true";
        more.setAttribute("aria-expanded", open ? "false" : "true");
        document.querySelector('[data-tabs="class"]').classList.toggle("lb-open", !open);
        more.querySelector(".lb-more-text").textContent = open ? "Other classes" : "Hide";
      });
    }

    // Default tab to the signed-in student's class.
    const s = window.ITBasics && window.ITBasics.getSession();
    if (s && s.class) {
      const match = Array.prototype.find.call(tabs, function (t) { return t.dataset.class === s.class; });
      if (match) {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        match.classList.add("active");
        currentClass = s.class;
        fold(s.class);
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

  function startTodayRefresh() {
    stopTodayRefresh();
    // Live board: refresh today's scores every 20s so a class challenge updates
    // on screen without anyone reloading the page.
    todayTimer = window.setInterval(async function () {
      if (!todayOnly) { stopTodayRefresh(); return; }
      todayRows = await loadTodayRows();
      render();
    }, 20000);
  }
  function stopTodayRefresh() {
    if (todayTimer) { window.clearInterval(todayTimer); todayTimer = null; }
  }

  function setupPeriodTabs() {
    const tabs = document.querySelectorAll('[data-tabs="period"] .quiz-tab');
    tabs.forEach(function (t) {
      t.addEventListener("click", async function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        todayOnly = t.dataset.period === "today";
        if (todayOnly) {
          document.getElementById("leaderboard-status").textContent = "Loading today's scores…";
          todayRows = await loadTodayRows();
          render();
          startTodayRefresh();
        } else {
          stopTodayRefresh();
          render();
        }
      });
    });
  }

  async function boot() {
    setupModeTabs();
    setupClassTabs();
    setupPeriodTabs();
    cachedRows = await loadRows();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Reload when the user signs in/out (mostly relevant if they sign out from the leaderboard).
  window.addEventListener("itbasics:auth", async function () {
    cachedRows = await loadRows();
    if (todayOnly) todayRows = await loadTodayRows();
    render();
  });
})();
