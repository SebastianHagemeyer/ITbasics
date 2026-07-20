/*
 * Short written answers on lesson pages: the "articulate your brain" boxes.
 * Drop onto any page (include this script after app.js):
 *
 *   <div class="brainbox" data-module="systems" data-q="io-touch"
 *        data-prompt="A touchscreen is BOTH input and output. Explain why."
 *        data-placeholder="It's an input because..."></div>
 *
 * All boxes on a page that share data-module save into ONE quiz_progress row
 * (quiz_name "answers-<module>", answers = { q-key: text }) via the existing
 * ITBasics.saveProgress / loadProgress helpers, so they get the same Supabase
 * + localStorage fallback behaviour as quiz progress, and the teacher export
 * can read and display them. Saves are debounced while the student types.
 */
(function () {
  "use strict";

  var SAVE_DELAY_MS = 1500;

  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function boot() {
    if (!window.ITBasics) return;
    var boxes = $all(".brainbox[data-module][data-q]");
    if (!boxes.length) return;

    // Group boxes by module: one saved record per module.
    var byModule = {};
    boxes.forEach(function (box) {
      (byModule[box.dataset.module] = byModule[box.dataset.module] || []).push(box);
    });

    Object.keys(byModule).forEach(function (module) {
      initModule(module, byModule[module]);
    });
  }

  function initModule(module, boxes) {
    var quizName = "answers-" + module;
    var timer = null;

    boxes.forEach(function (box) {
      var prompt = box.dataset.prompt || "Explain your thinking:";
      var placeholder = box.dataset.placeholder || "A sentence or two...";

      var label = document.createElement("p");
      label.className = "brainbox-prompt";
      label.innerHTML = "<strong>Your turn to explain:</strong> ";
      label.appendChild(document.createTextNode(prompt));

      var ta = document.createElement("textarea");
      ta.className = "brainbox-input";
      ta.rows = 2;
      ta.placeholder = placeholder;
      ta.setAttribute("aria-label", prompt);

      var status = document.createElement("span");
      status.className = "brainbox-status";
      status.setAttribute("role", "status");

      box.appendChild(label);
      box.appendChild(ta);
      box.appendChild(status);
      box._ta = ta;
      box._status = status;

      ta.addEventListener("input", function () {
        var n = ta.value.trim().length;
        status.textContent = (n && n < 15) ? "keep going: " + n + "/15 characters" : "…";
        status.className = "brainbox-status";
        if (timer) clearTimeout(timer);
        timer = setTimeout(save, SAVE_DELAY_MS);
      });
      // Leaving the box saves straight away, so quick answers aren't lost.
      ta.addEventListener("blur", function () {
        if (timer) { clearTimeout(timer); timer = null; save(); }
      });
    });

    function collect() {
      var answers = {};
      boxes.forEach(function (box) {
        var v = box._ta.value.trim();
        if (v) answers[box.dataset.q] = v;
      });
      return answers;
    }

    async function save() {
      timer = null;
      if (!window.ITBasics.getSession()) {
        boxes.forEach(function (box) { box._status.textContent = "Sign in to save"; });
        return;
      }
      try {
        await window.ITBasics.saveProgress(quizName, collect());
        boxes.forEach(function (box) {
          var n = box._ta.value.trim().length;
          if (!n) { box._status.textContent = ""; return; }
          if (n < 15) {
            box._status.textContent = "saved, but a bit short to count: " + n + "/15 characters";
            box._status.className = "brainbox-status";
          } else {
            box._status.textContent = "Saved ✓";
            box._status.className = "brainbox-status ok";
          }
        });
      } catch (e) {
        boxes.forEach(function (box) { box._status.textContent = "Couldn't save, will retry"; });
      }
    }

    // Restore anything they wrote before, on any computer.
    (async function hydrate() {
      if (!window.ITBasics.getSession()) return;
      try {
        var saved = await window.ITBasics.loadProgress(quizName);
        if (!saved) return;
        boxes.forEach(function (box) {
          if (saved[box.dataset.q] && !box._ta.value) {
            box._ta.value = saved[box.dataset.q];
            box._status.textContent = "Saved ✓";
            box._status.className = "brainbox-status ok";
          }
        });
      } catch (e) { /* offline: boxes still work, saves go to localStorage */ }
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
