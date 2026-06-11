(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ------------------------------------------------------------------
  // ASCII: each character -> its number -> hex (binary is in the Binary module).
  // ------------------------------------------------------------------
  function initAscii() {
    var input = document.getElementById("ascii-input");
    if (!input) return;
    var out = document.getElementById("ascii-out");
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
          '<span class="secret-bin">0x' + code.toString(16).toUpperCase().padStart(2, "0") + '</span>';
        out.appendChild(cell);
      }
    }
    input.addEventListener("input", render);
    render();
  }

  // ------------------------------------------------------------------
  // One byte, three ways: decimal, hex (two digits) and binary stay in sync.
  // ------------------------------------------------------------------
  function initByte() {
    var input = document.getElementById("byte-input");
    if (!input) return;
    var decEl = document.getElementById("byte-dec");
    var hexEl = document.getElementById("byte-hex");
    var binEl = document.getElementById("byte-bin");
    function render() {
      var n = parseInt(input.value, 10);
      if (isNaN(n)) n = 0;
      n = Math.max(0, Math.min(255, n));
      decEl.textContent = n;
      hexEl.textContent = "0x" + n.toString(16).toUpperCase().padStart(2, "0");
      binEl.textContent = n.toString(2).padStart(8, "0");
    }
    input.addEventListener("input", render);
    render();
  }

  // ------------------------------------------------------------------
  // RGB mixer: three channels (0-255) -> a colour, written as a hex code.
  // ------------------------------------------------------------------
  function initRgb() {
    var r = document.getElementById("rgb-r");
    if (!r) return;
    var g = document.getElementById("rgb-g");
    var b = document.getElementById("rgb-b");
    var swatch = document.getElementById("rgb-swatch");
    var hexEl = document.getElementById("rgb-hex");
    var rgbEl = document.getElementById("rgb-rgb");
    function h2(n) { return Number(n).toString(16).toUpperCase().padStart(2, "0"); }
    function render() {
      var rv = +r.value, gv = +g.value, bv = +b.value;
      document.getElementById("rgb-rv").textContent = rv;
      document.getElementById("rgb-gv").textContent = gv;
      document.getElementById("rgb-bv").textContent = bv;
      var hex = "#" + h2(rv) + h2(gv) + h2(bv);
      swatch.style.background = hex;
      hexEl.textContent = hex;
      rgbEl.textContent = "rgb(" + rv + ", " + gv + ", " + bv + ")";
    }
    [r, g, b].forEach(function (s) { s.addEventListener("input", render); });
    render();
  }

  // ------------------------------------------------------------------
  // Knowledge checks: Khan-style multiple choice, instant feedback (formative).
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

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    initAscii();
    initByte();
    initRgb();
    initChecks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
