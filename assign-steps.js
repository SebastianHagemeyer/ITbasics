/*
 * Progressive steps for assignment pages: collapses every .assign-step into
 * an accordion to cut cognitive load. The current step is open; steps ahead
 * are locked (collapsed, dimmed, not openable) until the step above has all
 * its self-checks ticked and reflection boxes answered; completed steps
 * auto-collapse with a tick and stay clickable for reference. Sections with
 * no checks or reflections (extensions, rubric) are never locked, just
 * collapsed by default. The submit section is left alone entirely.
 *
 * Load after the page's own assignment script. Purely presentational: it
 * moves each section's content into a wrapper div but never alters the
 * checkboxes/textareas themselves, so saving and syncing work unchanged.
 */
(function () {
  "use strict";

  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var steps = [];
  var timer = null;

  function init() {
    $all(".assign-step").forEach(function (sec) {
      if (sec.classList.contains("assign-submit")) return;
      var h2 = sec.querySelector("h2");
      if (!h2 || h2.parentNode !== sec) return;

      var body = document.createElement("div");
      body.className = "step-body";
      var node = h2.nextSibling;
      while (node) {
        var next = node.nextSibling;
        body.appendChild(node);
        node = next;
      }
      sec.appendChild(body);

      var badge = document.createElement("span");
      badge.className = "step-status";
      h2.appendChild(badge);
      h2.classList.add("step-toggle");
      h2.setAttribute("role", "button");
      h2.setAttribute("tabindex", "0");

      var st = { sec: sec, h2: h2, body: body, badge: badge, userOpen: null, locked: false, wasComplete: null };
      h2.addEventListener("click", function () { onToggle(st); });
      h2.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(st); }
      });
      steps.push(st);
    });
    if (!steps.length) return;
    attachCounters();

    // Anything the student does can change completion; recompute on a short
    // debounce. The timers catch programmatic state (saved ticks restored
    // after the async cloud hydration, and track switches).
    document.addEventListener("change", schedule, true);
    document.addEventListener("input", schedule, true);
    document.addEventListener("click", schedule, true);
    setTimeout(function () { update(); }, 600);
    setTimeout(function () { update(); }, 2000);
    update();
  }

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(update, 200);
  }

  // Live character targets under every reflection box, so students can see
  // exactly how much the 15-character bar still needs.
  function attachCounters() {
    $all(".reflect").forEach(function (ta) {
      if (ta._countEl) return;
      var c = document.createElement("span");
      c.className = "reflect-count";
      ta.parentNode.insertBefore(c, ta.nextSibling);
      ta._countEl = c;
      ta._updCount = function () {
        var n = ta.value.trim().length;
        if (!n) {
          c.textContent = "write at least 15 characters";
          c.className = "reflect-count";
        } else if (n < 15) {
          c.textContent = "keep going: " + n + "/15 characters";
          c.className = "reflect-count";
        } else {
          c.textContent = "✓ that's enough (more is welcome)";
          c.className = "reflect-count ok";
        }
      };
      ta.addEventListener("input", ta._updCount);
      ta._updCount();
    });
  }

  function onToggle(st) {
    if (st.locked) return;
    var isOpen = !st.body.hidden;
    st.userOpen = !isOpen;
    update();
  }

  function requirements(st) {
    var checks = $all(".self-check", st.body);
    var reflects = $all(".reflect", st.body);
    if (!checks.length && !reflects.length) return null;
    return { checks: checks, reflects: reflects };
  }

  function isComplete(st) {
    var req = requirements(st);
    if (!req) return false;
    // A reflection only counts once it's a real sentence (same 15-character
    // bar the teacher export uses), so a single keystroke can't finish a step.
    return req.checks.every(function (c) { return c.checked; }) &&
           req.reflects.every(function (t) { return t.value.trim().length >= 15; });
  }

  function isVisible(st) { return st.sec.offsetParent !== null; }

  function update() {
    timer = null;
    // Counters also refresh here so answers restored from the cloud show
    // their state without a keypress.
    $all(".reflect").forEach(function (ta) { if (ta._updCount) ta._updCount(); });
    var visible = steps.filter(isVisible);
    if (!visible.length) return;

    // The current step is the first visible one with unmet requirements.
    var current = null;
    visible.forEach(function (st) {
      st._req = requirements(st);
      st._complete = st._req ? isComplete(st) : false;
      if (!current && st._req && !st._complete) current = st;
    });

    var passedCurrent = false;
    visible.forEach(function (st) {
      if (st === current) passedCurrent = true;

      // A step that just got finished stays open (nothing ever collapses
      // under the student's cursor); it keeps its ✓ badge and they can hide
      // it themselves. The next step unlocks and opens below.
      if (st._req && st.wasComplete === false && st._complete) {
        st.userOpen = true;
        var i = visible.indexOf(st);
        if (visible[i + 1]) visible[i + 1].userOpen = null;
      }
      st.wasComplete = st._req ? st._complete : null;

      var locked = Boolean(st._req && current && passedCurrent && st !== current && !st._complete);
      st.locked = locked;

      var open;
      if (locked) {
        open = false;
        st.userOpen = null;
      } else if (st.userOpen !== null) {
        open = st.userOpen;
      } else {
        open = st === current;
      }

      st.body.hidden = !open;
      st.sec.classList.toggle("step-locked", locked);
      st.sec.classList.toggle("step-done", Boolean(st._complete));
      st.sec.classList.toggle("step-open", open);
      st.h2.setAttribute("aria-expanded", open ? "true" : "false");
      st.badge.textContent = st._complete ? "✓ done" : locked ? "locked" : open ? "hide" : "show";
      st.h2.title = locked ? "Finish the part above to unlock this one" : "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
