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
  function applyOne(detail) {
    if (!detail || !window.ITBasics) return false;
    var student = window.ITBasics.getSession();
    if (!student || cachedFor !== student.code || !cachedAttempts) return false;

    cachedAttempts.push({
      quiz_name: detail.quizName,
      score: detail.score,
      total: detail.total,
      answers: detail.answers || {}
    });
    var state = fromAttempts(cachedAttempts);
    try {
      localStorage.setItem(cacheKey(student), JSON.stringify({ at: Date.now(), state: state }));
    } catch (e) {}
    paintBadge(state);
    var host = document.getElementById("xp-panel");
    if (host && !host.hidden) renderPanel(host, state);
    return true;
  }

  function cached(student) {
    try {
      var raw = JSON.parse(localStorage.getItem(cacheKey(student)));
      return raw && raw.state ? raw.state : null;
    } catch (e) { return null; }
  }

  // ---- the badge in the header -------------------------------------------

  // Titles span two levels, so the next level is often the SAME title.
  // Naming it anyway reads as "56 XP to Scripter" while you are already a
  // Scripter, so the name is only mentioned when it actually changes.
  function nextLabel(state) {
    if (!state.next) return "max level";
    var same = state.next.name === state.name;
    return state.toNext + " XP to Level " + state.next.level +
           (same ? "" : ", " + state.next.name);
  }

  function paintBadge(state) {
    var host = document.querySelector(".auth-bar .auth-user");
    if (!host) return;
    var tag = host.querySelector(".auth-level");
    if (!tag) {
      tag = document.createElement("span");
      tag.className = "auth-level";
      var name = host.querySelector(".auth-name");
      if (name && name.nextSibling) host.insertBefore(tag, name.nextSibling);
      else host.appendChild(tag);
    }
    tag.textContent = "Lv " + state.level;
    tag.title = state.name + " . " + state.xp + " XP . " + nextLabel(state);
  }

  async function refresh() {
    if (!window.ITBasics) return;
    var student = window.ITBasics.getSession();
    if (!student) return;
    var was = cached(student);
    if (was) paintBadge(was);          // instant, from last time
    try { paintBadge(await load(student)); } catch (e) {}
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
    refresh: boot
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("itbasics:auth", function () {
    cachedAttempts = null; cachedFor = null; boot();
  });
  // Score it here if we can; only go back to the database if we cannot.
  window.addEventListener("itbasics:attempt", function (e) {
    if (!applyOne(e && e.detail)) boot();
  });
})();
