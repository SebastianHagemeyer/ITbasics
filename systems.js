(function () {
  "use strict";

  // Simple flat line icons, one per device (keyed by the chip's label).
  var A = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  function svg(p) { return "<svg " + A + ">" + p + "</svg>"; }
  var ICONS = {
    "keyboard": svg('<rect x="2.5" y="7" width="19" height="11" rx="2"/><path d="M5.5 11h1.5M9.5 11h1.5M13.5 11h1.5M17.5 11h1M5.5 14.5h1.5M17.5 14.5h1M9 14.5h6"/>'),
    "monitor": svg('<rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M9 20.5h6M12 16.5v4"/>'),
    "usb stick": svg('<rect x="8.5" y="7" width="7" height="13" rx="1.5"/><rect x="10" y="3.5" width="4" height="3.5" rx="0.6"/><path d="M12 10.5v3"/>'),
    "mouse": svg('<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 3.5v6"/>'),
    "speakers": svg('<rect x="6" y="2.5" width="12" height="19" rx="2"/><circle cx="12" cy="14" r="3.3"/><circle cx="12" cy="6.5" r="1"/>'),
    "hard drive": svg('<rect x="3" y="6" width="18" height="12" rx="1.5"/><circle cx="10.5" cy="12" r="3.7"/><circle cx="10.5" cy="12" r="0.7"/><circle cx="17.3" cy="15.3" r="0.7"/>'),
    "microphone": svg('<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6"/>'),
    "printer": svg('<path d="M7 8.5V4h10v4.5"/><rect x="4" y="8.5" width="16" height="7" rx="1.5"/><path d="M7 15.5v4h10v-4"/><path d="M16.5 11.5h.5"/>'),
    "sd card": svg('<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5H7.5A.5.5 0 0 1 7 20V4a.5.5 0 0 1 .5-.5z"/><path d="M9.5 3.8v2.5M11.5 3.8v2.5M13.5 3.8v2.5"/>'),
    "webcam": svg('<circle cx="12" cy="10" r="6"/><circle cx="12" cy="10" r="2.2"/><path d="M12 16v2.5M8 18.5h8"/>'),
    "headphones": svg('<path d="M5 13.5v-1.5a7 7 0 0 1 14 0v1.5"/><rect x="3.5" y="13" width="3.5" height="6.5" rx="1.5"/><rect x="17" y="13" width="3.5" height="6.5" rx="1.5"/>'),
    "ssd": svg('<rect x="3" y="6" width="18" height="12" rx="1.5"/><rect x="8" y="9" width="8.5" height="6" rx="1"/><path d="M5.5 9.5h1.5M5.5 12h1.5M5.5 14.5h1.5"/>')
  };

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
      var label = chip.textContent.trim();
      chip.innerHTML = (ICONS[label.toLowerCase()] || "") + '<span class="ds-chip-label">' + label + "</span>";
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
