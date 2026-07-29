/* module-badges.js
 *
 * Completion ticks on the Modules page. Each module card gets a small badge
 * in its top right corner:
 *
 *   green tick   the module is finished (100%)
 *   amber tick   started but not finished
 *   nothing      not touched yet, so the card stays clean
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else { render(); }
  window.addEventListener("itbasics:auth", render);
})();
