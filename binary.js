(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ------------------------------------------------------------------
  // Binary <-> decimal machine: eight clickable bit switches that stay
  // in sync with a 0-255 number box, both ways.
  // ------------------------------------------------------------------
  var PLACES = [128, 64, 32, 16, 8, 4, 2, 1];

  function initConverter() {
    var bitsWrap = document.getElementById("bitconv-bits");
    if (!bitsWrap) return;
    var sumEl = document.getElementById("bitconv-sum");
    var decEl = document.getElementById("bitconv-decimal");
    var input = document.getElementById("bitconv-input");
    var clearBtn = document.getElementById("bitconv-clear");
    var bits = [];

    PLACES.forEach(function (place) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "bit";
      b.setAttribute("aria-pressed", "false");
      b.dataset.value = place;
      b.innerHTML = '<span class="bit-place">' + place + '</span><span class="bit-digit">0</span>';
      b.addEventListener("click", function () {
        setBit(b, b.getAttribute("aria-pressed") !== "true");
        update();
      });
      bitsWrap.appendChild(b);
      bits.push(b);
    });

    function setBit(b, on) {
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("on", on);
      b.querySelector(".bit-digit").textContent = on ? "1" : "0";
    }

    function update() {
      var on = bits.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; });
      var total = on.reduce(function (s, b) { return s + Number(b.dataset.value); }, 0);
      decEl.textContent = total;
      sumEl.textContent = on.length ? on.map(function (b) { return b.dataset.value; }).join(" + ") : "0";
      // Don't fight the user's cursor while they're typing in the box.
      if (document.activeElement !== input) input.value = total;
    }

    function setFromDecimal(n) {
      n = Math.max(0, Math.min(255, Math.floor(n || 0)));
      bits.forEach(function (b) {
        var v = Number(b.dataset.value);
        setBit(b, (n & v) === v);
      });
      update();
    }

    input.addEventListener("input", function () {
      var n = parseInt(input.value, 10);
      if (!isNaN(n)) setFromDecimal(n);
    });
    clearBtn.addEventListener("click", function () {
      setFromDecimal(0);
      input.value = 0;
    });

    update();
  }

  // ------------------------------------------------------------------
  // Knowledge checks: Khan-style multiple choice with instant feedback.
  // Formative only (nothing is stored) - they're for self-checking.
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // "Text is binary too": each letter -> its ASCII number -> 8-bit binary.
  // ------------------------------------------------------------------
  function initSecret() {
    var input = document.getElementById("secret-input");
    if (!input) return;
    var out = document.getElementById("secret-out");
    function render() {
      var text = (input.value || "").slice(0, 10);
      out.innerHTML = "";
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        var cell = document.createElement("div");
        cell.className = "secret-cell";
        cell.innerHTML =
          '<span class="secret-char">' + escapeHtml(text[i] === " " ? "␣" : text[i]) + '</span>' +
          '<span class="secret-code">' + code + '</span>' +
          '<span class="secret-bin">' + code.toString(2).padStart(8, "0") + '</span>';
        out.appendChild(cell);
      }
    }
    input.addEventListener("input", render);
    render();
  }

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    initConverter();
    initChecks();
    initSecret();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
