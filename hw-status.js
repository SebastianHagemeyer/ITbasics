/*
 * Shared homework machinery: what can be assigned, where it links, and how
 * to decide a student's status on each item from their existing rows.
 * Used by homework.js (the student's home page panel) and teacher.js (the
 * per-class status view). No DOM in here.
 *
 * A homework item is { type, key }:
 *   type "module"     - key is the module (e.g. "loops")
 *   type "assignment" - key matches assignment_progress.assignment
 *   type "challenge"  - key is a Live Coding challenge id (e.g. "greeter")
 *
 * Status is one of "done", "started", "todo".
 */
(function () {
  "use strict";

  // How each module reaches 100%: mirrors progress.js / teacher.js.
  var MODULE_RULES = {
    programming: { label: "Programming",      test: "programming" },
    html:        { label: "HTML",             test: "html" },
    python:      { label: "Python",           test: "python" },
    variables:   { label: "Variables",        test: "variables", tasks: ["variables-task"], weights: [0.5, 0.5] },
    strings:     { label: "Strings",          test: "strings", tasks: ["strings-task"], weights: [0.5, 0.5] },
    errors:      { label: "Spot the Error",   test: "errors" },
    decisions:   { label: "Making Decisions", test: "decisions", tasks: ["decisions-task"], weights: [0.5, 0.5] },
    loops:       { label: "Loops",            test: "loops", tasks: ["loops-for-task", "loops-while-task"], weights: [0.5, 0.25, 0.25] },
    binary:      { label: "Binary & Data",    test: "binary" },
    codes:       { label: "Codes & Colour",   test: "codes", tasks: ["codes-task"], weights: [0.5, 0.5] },
    systems:     { label: "Digital Systems",  test: "systems", answers: { name: "answers-systems", total: 3 } },
    networks:    { label: "Networks & Safety", test: "networks" },
    os:          { label: "Computer Skills",  test: "os" }
  };

  var ASSIGNMENT_INFO = {
    petprogram: { label: "The Pet Project (assignment)", href: "/assignments/pet-program/" },
    pixelart:   { label: "Pixel Painter (assignment)",   href: "/assignments/pixel-painter/" }
  };

  function moduleHref(key) { return "/topics/" + key + "/"; }

  function itemLabel(item) {
    var base;
    if (item.label) {
      base = item.label;
    } else if (item.type === "module") {
      var r = MODULE_RULES[item.key];
      base = r ? r.label : item.key;
    } else if (item.type === "assignment") {
      var a = ASSIGNMENT_INFO[item.key];
      base = a ? a.label.replace(/\s*\(.*\)$/, "") : item.key;
    } else {
      base = item.key;
    }
    var suffix = item.type === "module" ? " (module)"
      : item.type === "assignment" ? " (assignment)"
      : " (coding challenge)";
    return base + suffix;
  }

  function itemHref(item) {
    if (item.type === "module") return moduleHref(item.key);
    if (item.type === "assignment") {
      var a = ASSIGNMENT_INFO[item.key];
      return a ? a.href : "/assignments/";
    }
    return "/challenges/#" + encodeURIComponent(item.key);
  }

  // Every quiz_name that must be fetched from quiz_attempts to judge these
  // items. Keeping the fetch narrow matters: freeplay rows would otherwise
  // blow past PostgREST's row cap for a whole class.
  function neededQuizNames(items) {
    var set = {};
    (items || []).forEach(function (item) {
      if (item.type === "module") {
        var r = MODULE_RULES[item.key];
        if (!r) return;
        set[r.test] = true;
        (r.tasks || []).forEach(function (t) { set[t] = true; });
      } else if (item.type === "challenge") {
        set.livecoding = true;
      }
    });
    return Object.keys(set);
  }

  function neededAnswerNames(items) {
    var names = [];
    (items || []).forEach(function (item) {
      if (item.type !== "module") return;
      var r = MODULE_RULES[item.key];
      if (r && r.answers) names.push(r.answers.name);
    });
    return names;
  }

  // data per student:
  //   attempts     - quiz_attempts rows [{quiz_name, score, total, answers}]
  //   assignments  - { assignmentKey: { submitted: bool } } from assignment_progress
  //   answers      - { "answers-systems": {q: text} }
  function itemStatus(item, data) {
    data = data || {};
    var attempts = data.attempts || [];

    if (item.type === "assignment") {
      var a = (data.assignments || {})[item.key];
      if (!a) return "todo";        // no progress row = never opened it
      return a.submitted ? "done" : "started";
    }

    if (item.type === "challenge") {
      var passed = attempts.some(function (r) {
        return r.answers && r.answers.challenge === item.key;
      });
      return passed ? "done" : "todo";
    }

    // Module: same blend as the progress page.
    var r = MODULE_RULES[item.key];
    if (!r) return "todo";
    var testRows = attempts.filter(function (a) { return a.quiz_name === r.test; });
    var testPct = 0;
    if (testRows.length) {
      var best = testRows.reduce(function (m, a) { return (a.score || 0) > (m.score || 0) ? a : m; }, testRows[0]);
      var total = testRows.reduce(function (t, a) { return Math.max(t, a.total || 0); }, 0);
      testPct = total ? (best.score / total) * 100 : 0;
    }
    var anySignal = testRows.length > 0;
    var pct;
    if (r.answers) {
      var ans = (data.answers || {})[r.answers.name] || {};
      var written = Object.keys(ans).filter(function (k) {
        return String(ans[k] || "").trim().length >= 15;
      }).length;
      if (written > 0) anySignal = true;
      pct = 0.6 * testPct + 40 * Math.min(1, written / r.answers.total);
    } else if (r.tasks) {
      var doneTasks = 0;
      r.tasks.forEach(function (t) {
        var hit = attempts.some(function (a) {
          return a.quiz_name === t && a.answers && a.answers.challenge;
        });
        if (hit) { doneTasks++; anySignal = true; }
      });
      pct = r.weights[0] * testPct;
      for (var i = 0; i < r.tasks.length; i++) {
        var hit2 = attempts.some(function (a) {
          return a.quiz_name === r.tasks[i] && a.answers && a.answers.challenge;
        });
        pct += r.weights[i + 1] * (hit2 ? 100 : 0);
      }
    } else {
      pct = testPct;
    }
    if (Math.round(pct) >= 100) return "done";
    return anySignal ? "started" : "todo";
  }

  window.HWStatus = {
    MODULE_RULES: MODULE_RULES,
    ASSIGNMENT_INFO: ASSIGNMENT_INFO,
    itemLabel: itemLabel,
    itemHref: itemHref,
    itemStatus: itemStatus,
    neededQuizNames: neededQuizNames,
    neededAnswerNames: neededAnswerNames
  };
})();
