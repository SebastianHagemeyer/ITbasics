/* xp.js
 *
 * XP and levels.
 *
 * There is no xp table and no migration. Every scoring event this site cares
 * about is ALREADY in quiz_attempts, so XP is a pure function of history that
 * students have been building for months. The day this ships they sign in and
 * find they are already Level 4, instead of being told their whole term
 * counted for nothing.
 *
 * What earns XP:
 *
 *   coding task     50   any challenge passed, counted once per challenge
 *   module quiz     25   full marks only, best attempt, once per quiz
 *   freeplay         1   first correct answer per scenario
 *   spot the error   2   same, but the errors scenarios are worth double
 *
 * Two rules keep it honest. Everything is counted ONCE, keyed on the thing
 * that was done, so resitting a quiz twenty times earns 25 XP and not 500.
 * And freeplay pays per scenario, not per answer, so nobody can grind the
 * same easy question to Mastermind without opening a module.
 *
 * Load after app.js and hw-status.js. Paints from a local cache immediately
 * and refreshes in the background, so the badge never blocks a page.
 */
(function () {
  "use strict";

  var RATES = { task: 50, quiz: 25, freeplay: 1, freeplayErrors: 2 };

  // Twenty levels, eleven titles. Initiate and Mastermind stand alone at the
  // ends; every title in between covers two levels, so there is a number to
  // climb most weeks and a name to earn every other time.
  //
  // The curve is deliberately longer than the site. Everything currently on
  // here is worth about 1845 XP, which is Level 11, Builder: a student who
  // finishes every module, every challenge and the whole freeplay bank has
  // done well and is nowhere near the end. That leaves Engineer upwards as
  // headroom for content that does not exist yet, so the ladder does not
  // plateau the moment someone completes the site.
  //
  // Gaps follow (level - 1) ^ 1.5, so the early rungs stay close together
  // and the top ones stretch out. Level 2 is one coding task away; Level 20
  // would need roughly 2750 XP more than the site currently offers.
  var LEVELS = [
    { level: 1,  name: "Initiate",    xp: 0 },
    { level: 2,  name: "Tinkerer",    xp: 55 },
    { level: 3,  name: "Tinkerer",    xp: 155 },
    { level: 4,  name: "Scripter",    xp: 290 },
    { level: 5,  name: "Scripter",    xp: 445 },
    { level: 6,  name: "Coder",       xp: 620 },
    { level: 7,  name: "Coder",       xp: 815 },
    { level: 8,  name: "Debugger",    xp: 1030 },
    { level: 9,  name: "Debugger",    xp: 1255 },
    { level: 10, name: "Builder",     xp: 1500 },
    { level: 11, name: "Builder",     xp: 1755 },
    { level: 12, name: "Engineer",    xp: 2025 },
    { level: 13, name: "Engineer",    xp: 2305 },
    { level: 14, name: "Architect",   xp: 2600 },
    { level: 15, name: "Architect",   xp: 2905 },
    { level: 16, name: "Wizard",      xp: 3225 },
    { level: 17, name: "Wizard",      xp: 3550 },
    { level: 18, name: "Grandmaster", xp: 3890 },
    { level: 19, name: "Grandmaster", xp: 4240 },
    { level: 20, name: "Mastermind",  xp: 4600 }
  ];

  function levelFor(xp) {
    var at = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].xp) at = LEVELS[i];
    }
    var next = LEVELS[at.level] || null;   // LEVELS is 0-indexed, level is 1-based
    return {
      level: at.level,
      name: at.name,
      xp: xp,
      floor: at.xp,
      next: next,
      toNext: next ? next.xp - xp : 0,
      // How far through the current level, for the progress bar.
      pct: next ? Math.round(((xp - at.xp) / (next.xp - at.xp)) * 100) : 100
    };
  }

  // Which quiz_names are module quizzes. Taken from HWStatus so the two can
  // never drift: if a module is added there, its quiz is worth XP here.
  function quizNames() {
    var out = [];
    var rules = (window.HWStatus && window.HWStatus.MODULE_RULES) || {};
    Object.keys(rules).forEach(function (k) {
      if (rules[k].test) out.push(rules[k].test);
    });
    return out;
  }

  /* Turn raw quiz_attempts rows into XP. Pure, so it is easy to reason about
     and easy to test: same rows in, same number out. */
  function fromAttempts(rows) {
    rows = rows || [];
    var quizzes = quizNames();
    var isQuiz = {};
    quizzes.forEach(function (n) { isQuiz[n] = true; });

    var tasksDone = {};       // challenge id -> true
    var quizBest = {};        // quiz_name -> { score, total }
    var scenarios = {};       // scenario id -> xp value

    rows.forEach(function (r) {
      var a = r.answers || {};

      // A coding task. challenges.js only saves one of these on a pass.
      if (a.challenge) { tasksDone[a.challenge] = true; return; }

      // A freeplay answer. Only correct ones count, and only the first time
      // that scenario is answered correctly.
      if (r.quiz_name === "freeplay") {
        if (!(r.score > 0) || !a.id) return;
        scenarios[a.id] = a.topic === "errors" ? RATES.freeplayErrors : RATES.freeplay;
        return;
      }

      // A module quiz. Keep the best attempt only.
      if (isQuiz[r.quiz_name]) {
        var best = quizBest[r.quiz_name];
        if (!best || (r.score || 0) > best.score) {
          quizBest[r.quiz_name] = { score: r.score || 0, total: r.total || 0 };
        }
      }
    });

    var taskCount = Object.keys(tasksDone).length;
    var quizCount = 0;
    Object.keys(quizBest).forEach(function (n) {
      var b = quizBest[n];
      if (b.total > 0 && b.score === b.total) quizCount++;
    });
    var freeplayXP = 0, freeplayCount = 0;
    Object.keys(scenarios).forEach(function (id) {
      freeplayXP += scenarios[id];
      freeplayCount++;
    });

    var breakdown = {
      tasks:    { count: taskCount, xp: taskCount * RATES.task },
      quizzes:  { count: quizCount, xp: quizCount * RATES.quiz },
      freeplay: { count: freeplayCount, xp: freeplayXP }
    };
    var total = breakdown.tasks.xp + breakdown.quizzes.xp + breakdown.freeplay.xp;
    var state = levelFor(total);
    state.breakdown = breakdown;
    return state;
  }

  async function fetchAttempts(student) {
    if (window.ITBasics.isOnline()) {
      var res = await window.ITBasics.client()
        .from("quiz_attempts")
        .select("quiz_name, score, total, answers")
        .eq("student_code", student.code);
      if (res.error) throw res.error;
      return res.data || [];
    }
    // Offline: app.js keeps one bucket per quiz name.
    var rows = [];
    var prefix = "itbasics-attempts-" + student.code + "-";
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf(prefix) !== 0) continue;
      var name = k.slice(prefix.length);
      var arr;
      try { arr = JSON.parse(localStorage.getItem(k)); } catch (e) { continue; }
      if (!Array.isArray(arr)) continue;
      arr.forEach(function (a) {
        rows.push({ quiz_name: name, score: a.score, total: a.total, answers: a.answers });
      });
    }
    return rows;
  }

  function cacheKey(student) { return "itbasics-xp-" + student.code; }

  // The attempts behind whatever is currently on screen. Keeping them lets a
  // new attempt be folded in without asking the database again: fromAttempts
  // is pure and works on a plain array, so the recompute is a loop over rows
  // already in memory.
  var cachedFor = null;      // student code these belong to
  var cachedAttempts = null;

  async function load(student) {
    var fetched = await fetchAttempts(student);
    cachedFor = student.code;
    cachedAttempts = fetched;
    var state = fromAttempts(fetched);
    try {
      localStorage.setItem(cacheKey(student), JSON.stringify({ at: Date.now(), state: state }));
    } catch (e) {}
    return state;
  }

  /* One new attempt, scored without a round trip.
   *
   * Freeplay saves an attempt per question, so re-reading the student's whole
   * history on every event meant a lesson of sixty questions pulled their
   * entire record back sixty times. The event now carries enough to score the
   * attempt here instead. Falls back to a real load if we have no rows yet,
   * so it can never invent a number.
   */
  // Which of the three things this attempt was. Same test fromAttempts uses,
  // so the animation can never disagree with the scoring about what happened.
  function kindOf(detail) {
    var a = detail.answers || {};
    if (a.challenge) return "task";
    if (detail.quizName === "freeplay") return "freeplay";
    return "quiz";
  }

  function applyOne(detail) {
    if (!detail || !window.ITBasics) return false;
    var student = window.ITBasics.getSession();
    if (!student || cachedFor !== student.code || !cachedAttempts) return false;

    var before = fromAttempts(cachedAttempts);
    cachedAttempts.push({
      quiz_name: detail.quizName,
      score: detail.score,
      total: detail.total,
      answers: detail.answers || {}
    });
    var state = fromAttempts(cachedAttempts);

    // Painting is the reward, so it is handed to the effect to run at the
    // right moment: the badge should tick over as the chip lands on it, not
    // a second before it sets off.
    function commit() {
      try {
        localStorage.setItem(cacheKey(student), JSON.stringify({ at: Date.now(), state: state }));
      } catch (e) {}
      announce(state);
      var host = document.getElementById("xp-panel");
      if (host && !host.hidden) renderPanel(host, state);
    }

    var gained = state.xp - before.xp;
    if (gained > 0 && window.ITXPFX) {
      var levelled = null;
      if (state.level > before.level) {
        levelled = state;
        // Only call it a new title when the name actually changed: titles
        // span two levels, so half of all level ups keep the same one.
        state.newTitle = state.name !== before.name;
      }
      window.ITXPFX.award(kindOf(detail), gained, commit, levelled);
    } else {
      // Nothing earned (a repeat scenario, a quiz short of full marks), so
      // no animation. The state still needs writing: the attempt happened.
      commit();
    }
    return true;
  }

  function cached(student) {
    try {
      var raw = JSON.parse(localStorage.getItem(cacheKey(student)));
      return raw && raw.state ? raw.state : null;
    } catch (e) { return null; }
  }

  // ---- the badge in the header -------------------------------------------

  var shownXP = null;    // the number currently on the chip
  var ticking = null;    // the count up frame in flight, if any

  function reducedMotion() {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) { return false; }
  }

  // Titles span two levels, so the next level is often the SAME title.
  // Naming it anyway reads as "56 XP to Scripter" while you are already a
  // Scripter, so the name is only mentioned when it actually changes.
  function nextLabel(state) {
    if (!state.next) return "max level";
    var same = state.next.name === state.name;
    return state.toNext + " XP to Level " + state.next.level +
           (same ? "" : ", " + state.next.name);
  }

  /* The header chip, built here rather than in app.js so a page that never
     loads xp.js still renders a perfectly good name pill:

       [ S ]  Sebastian H          [ Lv 4 ]  [ 7A ]
              ====------  620 XP

     The parts are made once and then only ever have their text and width
     rewritten, because the count up rewrites them sixty times a second. */
  function badgeParts() {
    var host = document.querySelector(".auth-bar .auth-user");
    if (!host) return null;
    var id = host.querySelector(".auth-id") || host;
    var tag = host.querySelector(".auth-level");
    if (!tag) {
      tag = document.createElement("span");
      tag.className = "auth-level";
      if (id !== host && id.nextSibling) host.insertBefore(tag, id.nextSibling);
      else host.appendChild(tag);
    }
    var wrap = host.querySelector(".auth-xp");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = "auth-xp";
      wrap.innerHTML = '<span class="auth-xp-bar"><i></i></span>' +
                       '<span class="auth-xp-num"></span>';
      // Take the wrap flash off once it has played, so the class is not left
      // sitting on the bar for the rest of the page's life.
      wrap.querySelector(".auth-xp-bar").addEventListener("animationend", function (e) {
        e.target.classList.remove("wrapped");
      });
      id.appendChild(wrap);
    }
    var bar = wrap.querySelector(".auth-xp-bar");
    return {
      tag: tag,
      wrap: wrap,
      bar: bar,
      fill: bar.querySelector("i"),
      num: wrap.querySelector(".auth-xp-num")
    };
  }

  // Everything on the chip is a function of one number, which is what lets the
  // count up drive it: feed it the XP mid-tick and the level and the bar
  // follow along, so the bar fills, wraps at a level and carries on climbing.
  function drawBadge(xp, title) {
    var p = badgeParts();
    if (!p) return;
    var at = levelFor(xp);
    p.tag.textContent = "Lv " + at.level;
    p.num.textContent = xp + " XP";
    p.fill.style.width = (at.next ? Math.max(3, at.pct) : 100) + "%";
    p.wrap.title = title || (at.name + " . " + xp + " XP . " + nextLabel(at));
    return p;
  }

  function paintBadge(state) {
    var to = state.xp;
    var title = state.name + " . " + to + " XP . " + nextLabel(state);
    // First paint of the page, or nothing actually moved: just draw it.
    if (shownXP === null || shownXP === to || reducedMotion()) {
      shownXP = to;
      drawBadge(to, title);
      return;
    }
    countTo(shownXP, to, title);
    shownXP = to;
  }

  /* Roll the number from one value to the other. Longer for a bigger jump,
     but capped: 50 XP off a coding task should feel like a haul and 1 XP off a
     freeplay answer should be over before you look up, and neither should
     still be going when the next thing is finished. */
  function countTo(from, to, title) {
    if (ticking) { window.cancelAnimationFrame(ticking); ticking = null; }
    var first = drawBadge(from, title);
    if (!first || !window.requestAnimationFrame) { drawBadge(to, title); return; }
    var span = to - from;
    var ms = Math.min(1500, 400 + Math.abs(span) * 16);
    var was = levelFor(from).level;
    var start = null;
    first.num.classList.add("counting");

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / ms);
      // Ease out, so it sprints away and settles on the number.
      var eased = 1 - Math.pow(1 - t, 3);
      var at = Math.round(from + span * eased);
      // Redrawing through badgeParts each frame costs a handful of lookups and
      // means an auth bar rebuilt mid-count is picked straight back up.
      var p = drawBadge(at, title);
      if (!p) { ticking = null; return; }
      var lvl = levelFor(at).level;
      if (lvl !== was) {
        was = lvl;
        p.bar.classList.remove("wrapped");
        void p.bar.offsetWidth;                  // restart the flash
        p.bar.classList.add("wrapped");
      }
      if (t < 1) { ticking = window.requestAnimationFrame(frame); return; }
      ticking = null;
      p = drawBadge(to, title);
      if (p) p.num.classList.remove("counting");
    }
    ticking = window.requestAnimationFrame(frame);
  }

  async function refresh() {
    if (!window.ITBasics) return;
    var student = window.ITBasics.getSession();
    if (!student) return;
    var was = cached(student);
    if (was) announce(was);            // instant, from last time
    try { announce(await load(student)); } catch (e) {}
  }

  // Everything that reacts to a new XP figure goes through here, so a page
  // script can listen for the event instead of polling for the number.
  var latest = null;
  function announce(state) {
    latest = state;
    paintBadge(state);
    applyGate(state.xp);
    try {
      window.dispatchEvent(new CustomEvent("itbasics:xp", { detail: state }));
    } catch (e) {}
  }

  // ---- level gates --------------------------------------------------------

  /* Parts of the site open up as you climb. A page declares its own gate on
     the body tag:

       <body data-xp-min="3" data-xp-what="The Game Gallery">

     and everything inside <main> is swapped for a card saying how far off the
     student is. The first decision is made from the cached level the moment
     this script is read, which is why xp.js sits at the end of the body: a
     locked page must never flash its contents on the way to being locked.
     Until a level is known the page shows neither, so nobody at Level 9 gets
     told they are locked out for half a second.

     This is a signpost, not a security control. What actually matters is
     guarded by the row level security policies in supabase-schema.sql. */
  function gateMin() {
    var n = parseInt((document.body && document.body.getAttribute("data-xp-min")) || "", 10);
    return n > 1 ? n : 0;
  }

  function levelRow(level) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].level === level) return LEVELS[i];
    }
    return LEVELS[LEVELS.length - 1];
  }

  var PADLOCK =
    '<svg class="xp-lock-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor"/>' +
      '<path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" ' +
            'stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="12" cy="15.5" r="1.7" fill="#fff"/>' +
      '<rect x="11.2" y="15.5" width="1.6" height="3.4" rx=".8" fill="#fff"/>' +
    '</svg>';

  function lockCard(min, xp) {
    var need = levelRow(min);
    var at = levelFor(xp);
    var what = (document.body.getAttribute("data-xp-what") || "This page");
    var togo = Math.max(0, need.xp - xp);
    var pct = need.xp > 0 ? Math.min(100, Math.round((xp / need.xp) * 100)) : 100;
    return (
      '<div class="container section">' +
        '<div class="xp-lock">' +
          PADLOCK +
          "<h1>" + what + " unlocks at Level " + min + "</h1>" +
          '<p class="lead">You are Level ' + at.level + ", " + at.name + ", on " +
            xp + " XP. That is " + togo + " XP to go.</p>" +
          '<div class="xp-bar"><span style="width:' + Math.max(2, pct) + '%"></span></div>' +
          '<p class="xp-lock-how">XP comes from coding tasks (50 each), full marks ' +
            "on a module test (25 each) and Freeplay questions. Keep going and this " +
            "opens itself: no one has to let you in.</p>" +
          '<p class="xp-lock-go">' +
            '<a class="btn btn-primary" href="/modules/">Open the modules</a> ' +
            '<a class="btn btn-ghost" href="/progress/">See your progress</a>' +
          "</p>" +
        "</div>" +
      "</div>"
    );
  }

  var gateCard = null;      // the lock card, while it is up
  var gateWaiters = [];     // page scripts holding off until it opens
  var gateOpen = false;

  /* Run whatever builds the page, once the student is known to be allowed it.
     Page scripts on a gated page boot through this instead of on their own, so
     a locked student never has the gallery fetched or the editor wired up. */
  function onUnlocked(fn) {
    if (!gateMin() || gateOpen) { fn(); return; }
    gateWaiters.push(fn);
  }

  // Staff are never gated. A teacher moderating the gallery has no XP of their
  // own, and locking them out of the page they take games down from would be
  // the gate working exactly backwards.
  function isStaff() {
    var s = window.ITBasics && window.ITBasics.getSession();
    var codes = window.TEACHER_CODES;
    return Boolean(s && Array.isArray(codes) && codes.indexOf(s.code) !== -1);
  }

  function applyGate(xp) {
    var min = gateMin();
    if (!min) return;
    var main = document.querySelector("main");
    if (!main) return;
    if (isStaff() || levelFor(xp).level >= min) {
      document.body.setAttribute("data-xp-gate", "open");
      if (gateCard) { gateCard.remove(); gateCard = null; }
      if (!gateOpen) {
        gateOpen = true;
        var q = gateWaiters;
        gateWaiters = [];
        q.forEach(function (fn) { try { fn(); } catch (e) {} });
      }
      return;
    }
    document.body.setAttribute("data-xp-gate", "locked");
    if (!gateCard) {
      gateCard = document.createElement("section");
      gateCard.className = "xp-gate";
      main.appendChild(gateCard);
    }
    gateCard.innerHTML = lockCard(min, xp);
  }

  // The first pass, before anything has been fetched. No cache means no level,
  // and no level means we say nothing rather than guess at zero.
  function gateFromCache() {
    if (!gateMin()) return;
    var student = window.ITBasics && window.ITBasics.getSession();
    var was = student && cached(student);
    if (was || isStaff()) applyGate(was ? was.xp : 0);
    else document.body.setAttribute("data-xp-gate", "checking");
  }

  // ---- the panel on the progress page -------------------------------------

  function renderPanel(host, state) {
    var b = state.breakdown;
    var bar = state.next
      ? '<div class="xp-bar"><span style="width:' + Math.max(2, state.pct) + '%"></span></div>' +
        '<p class="xp-next">' + nextLabel(state) + "</p>"
      : '<p class="xp-next">Top level reached. Nothing left to climb.</p>';
    host.innerHTML =
      '<div class="xp-head">' +
        '<span class="xp-ring">' + state.level + "</span>" +
        '<div><h3>' + state.name + "</h3>" +
          "<p>" + state.xp + " XP</p></div>" +
      "</div>" +
      bar +
      '<ul class="xp-rows">' +
        "<li><span>Coding tasks</span><span>" + b.tasks.count + " x 50</span><strong>" + b.tasks.xp + "</strong></li>" +
        "<li><span>Quizzes at full marks</span><span>" + b.quizzes.count + " x 25</span><strong>" + b.quizzes.xp + "</strong></li>" +
        "<li><span>Freeplay scenarios</span><span>" + b.freeplay.count + " answered</span><strong>" + b.freeplay.xp + "</strong></li>" +
      "</ul>";
  }

  async function paintPanel() {
    var host = document.getElementById("xp-panel");
    if (!host || !window.ITBasics) return;
    var student = window.ITBasics.getSession();
    if (!student) { host.hidden = true; return; }
    host.hidden = false;
    var was = cached(student);
    if (was) renderPanel(host, was);
    try { renderPanel(host, await load(student)); } catch (e) {}
  }

  function boot() { refresh(); paintPanel(); }

  window.ITXP = {
    RATES: RATES,
    LEVELS: LEVELS,
    levelFor: levelFor,
    fromAttempts: fromAttempts,
    load: load,
    refresh: boot,
    // The last figure worked out, for anything that has to draw before the
    // fresh one lands. Null until the first cache read or fetch.
    current: function () { return latest; },
    onUnlocked: onUnlocked
  };

  gateFromCache();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("itbasics:auth", function () {
    // A different student is a different number. Draw theirs, do not roll the
    // old one up or down to it.
    cachedAttempts = null; cachedFor = null; shownXP = null; latest = null;
    // A gate the last student was through says nothing about this one.
    gateOpen = false;
    gateFromCache();
    boot();
  });
  // Score it here if we can; only go back to the database if we cannot.
  window.addEventListener("itbasics:attempt", function (e) {
    if (!applyOne(e && e.detail)) boot();
  });
})();
