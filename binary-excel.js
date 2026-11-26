/* binary-excel.js: drives /topics/binary-excel/ (Pre-VET bridge module).
 *
 * The Step Up mind-reading card trick, rebuilt three ways:
 *   1. the trick itself (five cards, the site reads your mind),
 *   2. the teacher's spreadsheet version (binaryExcel super.xlsx), live, with
 *      a cell-reference hunt,
 *   3. the graded task: write the G5 formula yourself. It is checked against
 *      all 32 on/off patterns, so typing the answer in as a number can't pass.
 * Plus the 8-card level up, the number questions and the knowledge checks.
 *
 * Needs xlsheet.js (window.XLSheet) loaded first.
 */
(function () {
  "use strict";

  var TASK_NAME = "binary-excel-task";
  var CARDS5 = [16, 8, 4, 2, 1];
  var CARDS8 = [128, 64, 32, 16, 8, 4, 2, 1];
  var COLS = ["B", "C", "D", "E", "F", "G", "H", "I"];

  function $(id) { return document.getElementById(id); }

  // The cards row 1 / "was it on" row 2 layout, as in the original workbook.
  function sheetData(values, withFormula) {
    var d = { A1: "First number on the card", A2: "Was it on" };
    values.forEach(function (v, i) { d[COLS[i] + "1"] = v; d[COLS[i] + "2"] = 0; });
    var total = XLSheet.colName(values.length + 2);
    d[total + "4"] = "TOTAL";
    if (withFormula) {
      d[total + "5"] = "=" + values.map(function (v, i) { return "(" + COLS[i] + "1*" + COLS[i] + "2)"; }).join("+");
    }
    return d;
  }
  function toggleRefs(n) { return COLS.slice(0, n).map(function (c) { return c + "2"; }); }

  function workingLine(values, bits) {
    var on = values.filter(function (v, i) { return bits[i]; });
    if (!on.length) return "No cards are on, so the total is 0.";
    var sum = on.reduce(function (s, v) { return s + v; }, 0);
    return on.length === 1 ? "Only the " + on[0] + " card is on, so the total is " + sum + "."
                           : "Cards on: " + on.join(" + ") + " = " + sum;
  }

  // ---- 1. the card trick -------------------------------------------------
  var trickBits = [0, 0, 0, 0, 0];
  var mainSheet = null;

  function initTrick() {
    var host = $("bx-trick");
    if (!host) return;
    var grid = host.querySelector(".bx-cards");
    var result = host.querySelector(".bx-trick-result");
    var how = host.querySelector(".bx-trick-how");
    var revealed = false;

    CARDS5.forEach(function (v, i) {
      var card = document.createElement("div");
      card.className = "bx-card";
      var h = document.createElement("p");
      h.className = "bx-card-title";
      h.textContent = "Card " + (i + 1);
      var nums = document.createElement("div");
      nums.className = "bx-card-nums";
      for (var n = 1; n <= 31; n++) {
        if (!(n & v)) continue;
        var s = document.createElement("span");
        s.textContent = n;
        if (n === v) s.className = "bx-first";
        nums.appendChild(s);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bx-card-btn";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = "My number is on this card";
      btn.addEventListener("click", function () {
        trickBits[i] = trickBits[i] ? 0 : 1;
        btn.setAttribute("aria-pressed", trickBits[i] ? "true" : "false");
        card.classList.toggle("is-on", Boolean(trickBits[i]));
        btn.textContent = trickBits[i] ? "Yes, it's on here" : "My number is on this card";
        if (revealed) reveal();
      });
      card.appendChild(h); card.appendChild(nums); card.appendChild(btn);
      grid.appendChild(card);
    });

    function reveal() {
      var total = CARDS5.reduce(function (s, v, i) { return s + v * trickBits[i]; }, 0);
      revealed = true;
      result.hidden = false;
      if (!total) {
        result.textContent = "You said it isn't on any card. Every number from 1 to 31 is on at least one, so have another look.";
        how.hidden = true;
        return;
      }
      result.innerHTML = "Your number is <strong>" + total + "</strong>.";
      host.classList.add("bx-revealed");
      how.hidden = false;
      how.querySelector(".bx-trick-working").textContent = workingLine(CARDS5, trickBits);
      if (mainSheet) {
        CARDS5.forEach(function (v, i) { mainSheet.set(COLS[i] + "2", trickBits[i]); });
        updateReadout();
        var note = $("bx-sheet-loaded");
        if (note) note.hidden = false;
      }
    }

    host.querySelector(".bx-trick-go").addEventListener("click", reveal);
    host.querySelector(".bx-trick-reset").addEventListener("click", function () {
      trickBits = [0, 0, 0, 0, 0];
      revealed = false;
      host.classList.remove("bx-revealed");
      host.querySelectorAll(".bx-card").forEach(function (c) { c.classList.remove("is-on"); });
      host.querySelectorAll(".bx-card-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
        b.textContent = "My number is on this card";
      });
      result.hidden = true;
      how.hidden = true;
    });
  }

  // ---- 3. the spreadsheet version + cell hunt ----------------------------
  function updateReadout() {
    var out = $("bx-sheet-readout");
    if (!out || !mainSheet) return;
    var bits = CARDS5.map(function (v, i) { return mainSheet.value(COLS[i] + "2") === 1 ? 1 : 0; });
    out.textContent = workingLine(CARDS5, bits);
  }

  var HUNT = [
    { ref: "D1", ask: "Click the cell that holds the number 4." },
    { ref: "G4", ask: "Click the cell with the word TOTAL in it." },
    { ref: "B2", ask: "Click the cell that says whether the 16 card was on." },
    { ref: "G5", ask: "Click the cell that holds the formula. Watch the formula bar when you find it." },
    { ref: "A2", ask: "Last one: click cell A2." }
  ];

  function initSheet() {
    var host = $("bx-sheet");
    if (!host) return;
    mainSheet = XLSheet.create(host, {
      cols: 7, rows: 5,
      data: sheetData(CARDS5, true),
      widths: { A: "12.5rem" },
      toggles: toggleRefs(5),
      select: "G5",
      label: "The card trick as a spreadsheet",
      onChange: updateReadout,
      onSelect: onHuntSelect
    });
    updateReadout();

    var hunt = $("bx-hunt");
    var step = -1;
    var ask = hunt.querySelector(".bx-hunt-ask");
    var fb = hunt.querySelector(".bx-hunt-fb");
    var start = hunt.querySelector(".bx-hunt-start");

    function showStep() {
      ask.textContent = (step + 1) + " of " + HUNT.length + ": " + HUNT[step].ask;
    }
    start.addEventListener("click", function () {
      step = 0;
      mainSheet.hunt(true);
      start.hidden = true;
      fb.textContent = "";
      fb.className = "bx-hunt-fb";
      showStep();
      host.querySelector(".xl-grid").focus();
    });

    // Only a click (or Enter/Space) counts as an answer, so a keyboard user
    // arrowing across the grid isn't told "try again" on every cell.
    function onHuntSelect(ref, activated) {
      if (step < 0 || !activated) return;
      var want = HUNT[step].ref;
      var v = XLSheet.show(mainSheet.value(ref));
      if (ref === want) {
        step++;
        if (step >= HUNT.length) {
          step = -1;
          mainSheet.hunt(false);
          ask.textContent = "Hunt complete. You can name any cell by its column letter and row number.";
          fb.textContent = "All " + HUNT.length + " found.";
          fb.className = "bx-hunt-fb ok";
          start.hidden = false;
          start.textContent = "Hunt again";
          return;
        }
        fb.textContent = "Yes, that's " + ref + ".";
        fb.className = "bx-hunt-fb ok";
        showStep();
      } else {
        fb.textContent = "That's " + ref + (v ? ", which shows " + v : ", which is empty") + ". Try again.";
        fb.className = "bx-hunt-fb no";
      }
    }
  }

  // ---- formula checking (task + level up) --------------------------------
  // Runs the student's formula against every on/off pattern of the cards.
  function checkFormula(formula, values, target) {
    var f = String(formula || "").trim();
    var n = values.length;
    var toggles = toggleRefs(n);
    if (!f) return { ok: false, msg: "Click " + target + ", type your formula into the formula bar, then press Enter." };
    if (/\d\s*[x×]\s*(\$?[a-z]|\d|\()/i.test(f)) {
      return { ok: false, msg: "Excel's times sign is * (Shift + 8), not x. Swap each x for a *." };
    }
    if (f[0] !== "=") {
      return { ok: false, msg: /^-?\d+(\.\d+)?$/.test(f)
        ? "That's a number typed in, not a formula. It would never change when a card is flipped. Start with = and use cell references."
        : "Excel would treat that as plain text. Every formula starts with an equals sign: =" };
    }
    var used = XLSheet.refsIn(f);
    var base = sheetData(values, false);

    var lastGot = null;
    for (var mask = 0; mask < (1 << n); mask++) {
      var cells = Object.assign({}, base);
      var bits = [];
      for (var i = 0; i < n; i++) {
        bits[i] = (mask >> (n - 1 - i)) & 1;
        cells[COLS[i] + "2"] = bits[i];
      }
      var got = XLSheet.evaluate(f, function (ref) { return ref === target ? "" : cells[ref]; });
      if (XLSheet.isErr(got)) {
        return { ok: false, msg: "Excel would show " + got.xl + ". " + got.why };
      }
      if (used.indexOf(target) !== -1) {
        return { ok: false, msg: "Your formula uses " + target + ", the cell it lives in. That's a circular reference. Point at the cards' cells instead." };
      }
      var want = values.reduce(function (s, v, k) { return s + v * bits[k]; }, 0);
      lastGot = got;
      if (got !== want) {
        var allOn = values.reduce(function (s, v) { return s + v; }, 0);
        var onCount = bits.reduce(function (s, b) { return s + b; }, 0);
        var hint;
        if (!toggles.some(function (r) { return used.indexOf(r) !== -1; })) {
          hint = "Your formula never looks at row 2, so flipping a card can't change the answer. Each card's 1 or 0 needs to be in there.";
        } else if (got === allOn) {
          hint = "That adds up every card, even the ones that are off. Multiply each card by its 1 or 0 so the off cards turn into 0.";
        } else if (got === onCount) {
          hint = "That counts how many cards are on, not which ones. Multiply each 1 or 0 by its card's number.";
        } else {
          var onList = values.filter(function (v, k) { return bits[k]; });
          hint = "Test it: with " + (onList.length ? "only the " + onList.join(", ") + " card" + (onList.length > 1 ? "s" : "") + " on" : "every card off") +
            ", the total should be " + want + ", but your formula gives " + XLSheet.show(got) + ". Check every card is in there exactly once.";
        }
        return { ok: false, msg: hint };
      }
    }
    var tip = "";
    if (/SUMPRODUCT/i.test(f)) {
      tip = " You found the pro shortcut: SUMPRODUCT multiplies the two rows pair by pair and adds the lot.";
    } else if (!values.some(function (v, i) { return used.indexOf(COLS[i] + "1") !== -1; })) {
      tip = " One upgrade: you typed the card numbers in. If you use " + COLS[0] + "1 instead of " + values[0] + ", the formula still works when someone changes the cards.";
    }
    return { ok: true, msg: "It works for all " + (1 << n) + " ways the cards can be on or off." + tip };
  }

  function initTask() {
    var host = $("bx-task-sheet");
    if (!host) return;
    var fb = $("bx-task-fb");
    var saved = false;
    var sheet = XLSheet.create(host, {
      cols: 7, rows: 5,
      data: Object.assign(sheetData(CARDS5, false), { B2: 1, D2: 1, F2: 1 }),
      widths: { A: "12.5rem" },
      toggles: toggleRefs(5),
      editable: ["G5"],
      select: "G5",
      label: "Write the formula in G5",
      onChange: function (ref) { if (ref === "G5") check(); }
    });

    function check() {
      var res = checkFormula(sheet.get("G5"), CARDS5, "G5");
      fb.hidden = false;
      fb.className = "bx-fb " + (res.ok ? "ok" : "no");
      fb.textContent = (res.ok ? "Nailed it. " : "Not yet. ") + res.msg + (res.ok ? " Flip some cards and watch G5 keep up." : "");
      if (res.ok && !saved && window.ITBasics && window.ITBasics.saveAttempt) {
        saved = true;
        window.ITBasics.saveAttempt(TASK_NAME, 1, 1, { challenge: TASK_NAME, formula: String(sheet.get("G5")) });
      }
    }
    $("bx-task-check").addEventListener("click", function () { check(); });
  }

  function initEight() {
    var host = $("bx-eight-sheet");
    if (!host) return;
    var fb = $("bx-eight-fb");
    var sheet = XLSheet.create(host, {
      cols: 10, rows: 5,
      data: sheetData(CARDS8, false),
      widths: { A: "12.5rem" },
      toggles: toggleRefs(8),
      editable: ["J5"],
      select: "J5",
      label: "Eight cards: write the formula in J5",
      onChange: function (ref) { if (ref === "J5") check(); }
    });
    function check() {
      var res = checkFormula(sheet.get("J5"), CARDS8, "J5");
      fb.hidden = false;
      fb.className = "bx-fb " + (res.ok ? "ok" : "no");
      fb.textContent = (res.ok ? "Levelled up. " : "Not yet. ") + res.msg;
    }
    $("bx-eight-check").addEventListener("click", check);
  }

  // ---- typed number questions ---------------------------------------------
  function initNumberQs() {
    document.querySelectorAll(".bx-num").forEach(function (q) {
      var input = q.querySelector("input");
      var btn = q.querySelector("button");
      var fb = q.querySelector(".bx-num-fb");
      var explain = q.querySelector(".bx-num-explain");
      var hints = {};
      try { hints = JSON.parse(q.dataset.hints || "{}"); } catch (e) { hints = {}; }
      function go() {
        var v = input.value.trim();
        if (!v) return;
        if (v === q.dataset.answer) {
          fb.textContent = "Correct!";
          fb.className = "bx-num-fb ok";
          if (explain) explain.hidden = false;
          input.readOnly = true;
          btn.disabled = true;
        } else {
          fb.textContent = hints[v] || "Not quite, try again.";
          fb.className = "bx-num-fb no";
        }
      }
      btn.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } });
    });
  }

  // ---- knowledge checks (same shape as the other modules) ------------------
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
    if (!window.XLSheet) return;
    initSheet();
    initTrick();
    initTask();
    initEight();
    initNumberQs();
    initChecks();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
