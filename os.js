(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Shortcut trainer: the page names an action, you PRESS the real keys,
  // and it checks the combo (accepts Ctrl or, on a Mac, Cmd). Only the
  // safe Ctrl shortcuts are captured here; Alt+Tab / Alt+F4 / the Win key
  // are OS-level and are taught in the table instead.
  // ------------------------------------------------------------------
  function initShortcuts() {
    var trainer = document.querySelector(".sc-trainer");
    if (!trainer) return;
    var challenges = [
      { label: "Copy", key: "c" },
      { label: "Paste", key: "v" },
      { label: "Cut", key: "x" },
      { label: "Undo", key: "z" },
      { label: "Select all", key: "a" },
      { label: "Save", key: "s" },
      { label: "Find", key: "f" }
    ];
    var promptEl = trainer.querySelector(".sc-prompt");
    var statusEl = trainer.querySelector(".sc-status");
    var startBtn = trainer.querySelector(".sc-start");
    var i = 0, correct = 0, active = false, waiting = false;

    function show() {
      if (i >= challenges.length) {
        promptEl.textContent = "Done!";
        statusEl.textContent = "You got " + correct + " / " + challenges.length + ".";
        statusEl.className = "sc-status";
        active = false;
        startBtn.textContent = "Try again";
        startBtn.hidden = false;
        return;
      }
      promptEl.innerHTML = "Press the shortcut for <strong>" + challenges[i].label + "</strong>";
      statusEl.textContent = "Waiting for your keypress…";
      statusEl.className = "sc-status";
    }
    function describe(e) {
      var p = [];
      if (e.ctrlKey) p.push("Ctrl");
      if (e.metaKey) p.push("Cmd");
      if (e.altKey) p.push("Alt");
      if (e.shiftKey) p.push("Shift");
      p.push((e.key || "").toUpperCase());
      return p.join("+");
    }

    document.addEventListener("keydown", function (e) {
      if (!active || waiting) return;
      if (["Control", "Shift", "Alt", "Meta", "CapsLock", "Tab"].indexOf(e.key) !== -1) return;
      e.preventDefault();
      var want = challenges[i].key;
      var ok = (e.ctrlKey || e.metaKey) && !e.altKey && (e.key || "").toLowerCase() === want;
      if (ok) {
        correct++;
        statusEl.textContent = "Correct! (" + describe(e) + ")";
        statusEl.className = "sc-status ok";
      } else {
        statusEl.textContent = "You pressed " + describe(e) + ". The answer was Ctrl+" + want.toUpperCase() + ".";
        statusEl.className = "sc-status no";
      }
      waiting = true;
      i++;
      setTimeout(function () { waiting = false; show(); }, 850);
    });

    startBtn.addEventListener("click", function () {
      i = 0; correct = 0; active = true; startBtn.hidden = true; show();
    });
  }

  // ------------------------------------------------------------------
  // Right-click simulator: right-click the pretend desktop to get a menu,
  // then make a New folder / text document.
  // ------------------------------------------------------------------
  function initRightClick() {
    var desk = document.querySelector(".rc-desk");
    if (!desk) return;
    var menu = desk.querySelector(".rc-menu");
    var hint = desk.querySelector(".rc-hint");

    desk.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      var rect = desk.getBoundingClientRect();
      var x = Math.max(0, Math.min(e.clientX - rect.left, rect.width - 180));
      var y = Math.max(0, Math.min(e.clientY - rect.top, rect.height - 120));
      menu.style.left = x + "px";
      menu.style.top = y + "px";
      menu.hidden = false;
    });
    desk.addEventListener("click", function (e) {
      if (!e.target.closest(".rc-menu")) menu.hidden = true;
    });
    menu.querySelectorAll(".rc-item[data-action]").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        var a = item.dataset.action;
        if (a === "folder" || a === "file") {
          var icon = document.createElement("div");
          icon.className = "rc-icon";
          icon.innerHTML =
            '<span class="rc-glyph">' + (a === "folder" ? "📁" : "📄") + "</span>" +
            '<span class="rc-name">' + (a === "folder" ? "New folder" : "New Text Document.txt") + "</span>";
          desk.insertBefore(icon, menu);
          if (hint) hint.hidden = true;
        }
        menu.hidden = true;
      });
    });
  }

  // Knowledge checks (formative), shared shape with the other modules.
  function initChecks() {
    document.querySelectorAll(".kcheck").forEach(function (kc) {
      var answer = kc.dataset.answer;
      var feedback = kc.querySelector(".kcheck-feedback");
      var explain = kc.querySelector(".kcheck-explain");
      var solved = false;
      kc.querySelectorAll(".kcheck-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (solved) return;
          if (opt.dataset.key === answer) {
            solved = true;
            opt.classList.add("correct");
            feedback.textContent = "Correct!";
            feedback.className = "kcheck-feedback correct";
            feedback.hidden = false;
            if (explain) explain.hidden = false;
            kc.querySelectorAll(".kcheck-opt").forEach(function (o) { o.disabled = true; });
          } else {
            opt.classList.add("wrong");
            opt.disabled = true;
            feedback.textContent = "Not quite, try again.";
            feedback.className = "kcheck-feedback wrong";
            feedback.hidden = false;
          }
        });
      });
    });
  }

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    initShortcuts();
    initRightClick();
    initChecks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
