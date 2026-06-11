(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Device sorter: tap a device chip, then tap a bin (Input / Output /
  // Storage) to drop it there. "Check" marks each chip right or wrong.
  // ------------------------------------------------------------------
  function initSorter() {
    var sorter = document.querySelector(".ds-sorter");
    if (!sorter) return;
    var tray = sorter.querySelector(".ds-tray");
    var result = sorter.querySelector(".ds-result");
    var selected = null;

    function pick(chip) {
      if (selected) selected.classList.remove("selected");
      if (selected === chip) { selected = null; return; }
      selected = chip;
      chip.classList.add("selected");
    }

    function place(container) {
      if (!selected) return;
      container.appendChild(selected);
      selected.classList.remove("selected", "correct", "wrong");
      selected = null;
    }

    sorter.querySelectorAll(".ds-chip").forEach(function (chip) {
      chip.addEventListener("click", function (e) { e.stopPropagation(); pick(chip); });
    });
    sorter.querySelectorAll(".ds-bin").forEach(function (bin) {
      bin.addEventListener("click", function () { place(bin.querySelector(".ds-drop")); });
    });
    tray.addEventListener("click", function () { place(tray); });

    sorter.querySelector(".ds-check").addEventListener("click", function () {
      var chips = sorter.querySelectorAll(".ds-chip");
      var correct = 0, sorted = 0, totalC = chips.length;
      chips.forEach(function (chip) {
        chip.classList.remove("correct", "wrong");
        var bin = chip.closest(".ds-bin");
        if (!bin) return;
        sorted++;
        if (bin.dataset.cat === chip.dataset.cat) { chip.classList.add("correct"); correct++; }
        else chip.classList.add("wrong");
      });
      result.className = "ds-result" + (correct === totalC ? " all" : "");
      result.textContent = correct + " / " + totalC + " sorted correctly" +
        (sorted < totalC ? " (" + (totalC - sorted) + " still in the tray)" : "");
    });

    sorter.querySelector(".ds-reset").addEventListener("click", function () {
      sorter.querySelectorAll(".ds-chip").forEach(function (chip) {
        chip.classList.remove("correct", "wrong", "selected");
        tray.appendChild(chip);
      });
      selected = null;
      result.textContent = "";
      result.className = "ds-result";
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
    initSorter();
    initChecks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
