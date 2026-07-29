/* module-badges.js
 *
 * Completion ticks in two places.
 *
 * 1. The Modules page. Each module card gets a badge in its top right corner:
 *
 *   green tick   the module is finished (100%)
 *   amber tick   started but not finished
 *   nothing      not touched yet, so the card stays clean
 *
 * 2. A module lesson page. The graded parts (the quick check and the coding
 *    task) get a marker both in the "On this page" list and beside their own
 *    heading: an empty circle until that part is done, a green tick after.
 *    So a student can see at a glance which half is still outstanding.
 *
 * The "is it finished" rule is NOT reinvented here: it comes from
 * HWStatus.itemStatus, the same function the homework panel uses and the
 * same blend the progress page and teacher export apply. One rule, four
 * places, so they can never drift apart.
 *
 * Load after app.js and hw-status.js. Re-renders on itbasics:auth, since
 * signing in never reloads the page.
 */
(function () {
  "use strict";

  var LABELS = {
    done: "Finished",
    started: "Started, not finished yet"
  };

  function moduleKeyFrom(card) {
    var href = card.getAttribute("href") || "";
    var m = href.match(/^\/topics\/([a-z0-9-]+)\/$/);
    return m ? m[1] : null;
  }

  // Everything the status rules might need: quiz attempts, plus the written
  // answers some modules blend in (Digital Systems).
  async function loadData(student, keys) {
    var data = { attempts: [], assignments: {}, answers: {} };
    var items = keys.map(function (k) { return { type: "module", key: k }; });
    var quizNames = window.HWStatus.neededQuizNames(items);
    var answerNames = window.HWStatus.neededAnswerNames(items);

    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      if (quizNames.length) {
        var res = await sb.from("quiz_attempts")
          .select("quiz_name, score, total, answers")
          .eq("student_code", student.code)
          .in("quiz_name", quizNames);
        if (!res.error) data.attempts = res.data || [];
      }
      for (var i = 0; i < answerNames.length; i++) {
        var qres = await sb.from("quiz_progress")
          .select("answers")
          .eq("student_code", student.code)
          .eq("quiz_name", answerNames[i])
          .maybeSingle();
        if (!qres.error && qres.data) data.answers[answerNames[i]] = qres.data.answers || {};
      }
      return data;
    }

    // Offline: rebuild from the localStorage buckets app.js writes.
    quizNames.forEach(function (name) {
      var raw = localStorage.getItem("itbasics-attempts-" + student.code + "-" + name);
      if (!raw) return;
      var arr;
      try { arr = JSON.parse(raw); } catch (e) { return; }
      arr.forEach(function (a) {
        data.attempts.push({ quiz_name: name, score: a.score, total: a.total, answers: a.answers });
      });
    });
    answerNames.forEach(function (name) {
      var raw = localStorage.getItem("itbasics-" + student.code + "-" + name);
      if (!raw) return;
      try { data.answers[name] = JSON.parse(raw); } catch (e) {}
    });
    return data;
  }

  function badge(status) {
    var span = document.createElement("span");
    span.className = "card-badge " + status;
    span.title = LABELS[status] || "";
    span.setAttribute("aria-label", LABELS[status] || "");
    span.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="11"/>' +
        '<path d="M6.5 12.5 L10.5 16.5 L17.5 8" fill="none" stroke-width="2.6" ' +
              'stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";
    return span;
  }

  // ---- Lesson pages: a circle or tick beside each graded part -------------

  // Is the module's quick check at full marks? Partial scores keep the empty
  // circle, because the module only counts as done at 100%.
  function testDone(attempts, quiz) {
    var rows = attempts.filter(function (a) { return a.quiz_name === quiz; });
    if (!rows.length) return { done: false, note: "not tried yet" };
    var best = rows.reduce(function (m, a) { return (a.score || 0) > (m.score || 0) ? a : m; }, rows[0]);
    var total = rows.reduce(function (t, a) { return Math.max(t, a.total || 0); }, 0);
    var full = total > 0 && best.score === total;
    return { done: full, note: "best " + best.score + " / " + total +
      (full ? "" : ", full marks needed for the tick") };
  }

  function taskDone(attempts, names) {
    var done = names.filter(function (n) {
      return attempts.some(function (a) {
        return a.quiz_name === n && a.answers && a.answers.challenge;
      });
    }).length;
    return { done: done === names.length,
             note: names.length > 1 ? done + " of " + names.length + " passed"
                                    : (done ? "passed" : "not passed yet") };
  }

  function partMarker(state) {
    var span = document.createElement("span");
    span.className = "part-tick " + (state.done ? "done" : "todo");
    span.title = state.note || "";
    span.setAttribute("aria-label", state.done ? "Done" : "Not done yet");
    span.innerHTML = state.done
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/>' +
        '<path d="M6.5 12.5 L10.5 16.5 L17.5 8" fill="none" stroke-width="2.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" ' +
        'fill="none" stroke-width="2"/></svg>';
    return span;
  }

  // Which section on the page holds each graded part. The quick check lives at
  // #test (or #game on Spot the Error, which is one single graded activity),
  // and the coding task at #task or #tasks.
  function lessonParts(key) {
    var rules = window.HWStatus.MODULE_RULES[key];
    if (!rules) return [];
    var parts = [];
    var testSel = document.getElementById("test") ? "test"
                : document.getElementById("game") ? "game" : null;
    if (testSel) parts.push({ id: testSel, kind: "test", quiz: rules.test });
    var taskSel = document.getElementById("task") ? "task"
                : document.getElementById("tasks") ? "tasks" : null;
    if (taskSel && rules.tasks && rules.tasks.length) {
      parts.push({ id: taskSel, kind: "task", names: rules.tasks });
    }
    return parts;
  }

  async function renderLesson() {
    var mine = ++run;
    var m = location.pathname.match(/^\/topics\/([a-z0-9-]+)\/$/);
    if (!m || !window.ITBasics || !window.HWStatus) return;
    var key = m[1];
    if (!window.HWStatus.MODULE_RULES[key]) return;

    document.querySelectorAll(".part-tick").forEach(function (t) { t.remove(); });
    var student = window.ITBasics.getSession();
    if (!student) return;

    var parts = lessonParts(key);
    if (!parts.length) return;

    var data;
    try { data = await loadData(student, [key]); } catch (e) { return; }
    if (mine !== run) return;

    parts.forEach(function (p) {
      var state = p.kind === "test" ? testDone(data.attempts, p.quiz)
                                    : taskDone(data.attempts, p.names);
      // Beside the heading of the section itself. Scoped to a direct child so
      // it never lands on a heading inside the section (the challenge brief
      // renders its own h2 in there).
      var sec = document.getElementById(p.id);
      var h2 = sec && sec.querySelector(":scope > h2");
      if (h2) h2.appendChild(partMarker(state));
      // And in the "On this page" list.
      var link = document.querySelector('.lesson-toc a[href="#' + p.id + '"]');
      if (link) link.appendChild(partMarker(state));
    });
  }

  var run = 0;

  async function render() {
    var mine = ++run;
    var cards = Array.prototype.slice.call(document.querySelectorAll("a.card[href^='/topics/']"));
    if (!cards.length || !window.ITBasics || !window.HWStatus) return;

    // Always clear first: signing out must not leave the last student's ticks.
    cards.forEach(function (c) {
      var old = c.querySelector(".card-badge");
      if (old) old.remove();
    });

    var student = window.ITBasics.getSession();
    if (!student) return;

    var pairs = cards
      .map(function (c) { return { card: c, key: moduleKeyFrom(c) }; })
      .filter(function (p) { return p.key && window.HWStatus.MODULE_RULES[p.key]; });
    if (!pairs.length) return;

    var data;
    try { data = await loadData(student, pairs.map(function (p) { return p.key; })); }
    catch (e) { return; }
    if (mine !== run) return;   // a newer render overtook this one

    pairs.forEach(function (p) {
      var status = window.HWStatus.itemStatus({ type: "module", key: p.key }, data);
      if (status === "todo") return;      // untouched cards stay clean
      p.card.appendChild(badge(status));
    });
  }

  function boot() { render(); renderLesson(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
  window.addEventListener("itbasics:auth", boot);
  // Finishing the quick check or a coding task saves an attempt, so refresh
  // the markers straight away instead of making them reload the page.
  window.addEventListener("itbasics:attempt", boot);
})();
