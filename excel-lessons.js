/* excel-lessons.js: drives the three Pre-VET Excel modules.
 *
 *   /topics/excel-basics/    Excel 1: What is a spreadsheet?   (Step Up L3, v1)
 *   /topics/excel-format/    Excel 2: Make it readable         (Step Up L4, v2)
 *   /topics/excel-formulas/  Excel 3: Let Excel do the maths   (Step Up L5, v3)
 *
 * Every page builds the same Hallam Game Night Tournament leaderboard as the
 * Step Up slides (StepUp\deck\excel_data.json), so a student who was away can
 * catch up here and walk back into the lesson with the same file.
 *
 * Each page only runs the parts whose elements it has. Needs xlsheet.js.
 * Graded tasks save ITBasics.saveAttempt("<module>-task", 1, 1, {challenge})
 * once every check passes, the same signal the coding tasks use.
 */
(function () {
  "use strict";

  var X = window.XLSheet;
  var TITLE = "Hallam Game Night Tournament";
  var HEADERS = ["Player", "Round 1", "Round 2", "Round 3"];
  var TOTAL_HEADER = "Total score (3 rounds)";
  var PLAYERS = [
    ["PixelPanda", 420, 380, 510],
    ["LagWizard", 150, 290, 240],
    ["TurboToast", 610, 450, 530],
    ["CtrlAltDefeat", 330, 330, 470],
    ["ByteKnight", 505, 620, 415],
    ["SnackAttack", 275, 340, 190],
    ["GGGrandma", 580, 710, 640],
    ["NoodleNinja", 90, 240, 405]
  ];
  var COLS = ["A", "B", "C", "D", "E", "F"];

  function $(id) { return document.getElementById(id); }
  function norm(s) { return String(s == null ? "" : s).trim().replace(/\s+/g, " ").toLowerCase(); }
  function session() { return window.ITBasics && window.ITBasics.getSession && window.ITBasics.getSession(); }
  function store(name) { var s = session(); return s && s.code ? name + "-" + s.code : null; }

  // The leaderboard as sheet data: title, headings, then `count` players.
  function board(count, opts) {
    opts = opts || {};
    var d = { A1: TITLE };
    HEADERS.forEach(function (h, i) { d[COLS[i] + "3"] = h; });
    if (opts.totalHeader) d.E3 = TOTAL_HEADER;
    PLAYERS.slice(0, count).forEach(function (p, i) {
      p.forEach(function (v, j) { d[COLS[j] + (4 + i)] = v; });
    });
    return d;
  }
  function rowTotal(i) { return PLAYERS[i][1] + PLAYERS[i][2] + PLAYERS[i][3]; }

  // ---- shared pieces --------------------------------------------------------

  // A live checklist under a task: [{ label, ok, hint }] -> ticks + first hint.
  function checklist(el, items) {
    el.innerHTML = "";
    var firstBad = null;
    items.forEach(function (it) {
      var li = document.createElement("li");
      li.className = it.ok ? "ok" : "todo";
      var mark = document.createElement("span");
      mark.className = "xl-check-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = it.ok ? "✓" : "";
      li.appendChild(mark);
      li.appendChild(document.createTextNode(it.label));
      li.setAttribute("aria-label", (it.ok ? "Done: " : "Not yet: ") + it.label);
      el.appendChild(li);
      if (!it.ok && !firstBad) firstBad = it;
    });
    return firstBad;
  }

  // Task feedback line + one-off save when everything passes.
  function taskResult(fbEl, items, key, okMsg, state) {
    var bad = checklist(fbEl.listEl, items);
    var done = !bad;
    fbEl.msgEl.hidden = false;
    fbEl.msgEl.className = "bx-fb " + (done ? "ok" : "no");
    fbEl.msgEl.textContent = done ? okMsg : (bad.hint || "Keep going: " + bad.label);
    if (done && !state.saved && window.ITBasics && window.ITBasics.saveAttempt) {
      state.saved = true;
      window.ITBasics.saveAttempt(key, 1, 1, { challenge: key });
    }
    return done;
  }
  function taskEls(prefix) {
    return { listEl: $(prefix + "-checks"), msgEl: $(prefix + "-fb") };
  }

  // Does a formula keep giving the right answer when the scores change?
  // Swaps every score for random numbers a few times and re-evaluates.
  function robust(sheet, ref, expectFn, rowsUsed) {
    var raw = sheet.raw(ref);
    if (raw == null || String(raw).trim()[0] !== "=") return false;
    for (var t = 0; t < 4; t++) {
      var fake = {};
      for (var i = 0; i < rowsUsed; i++) {
        for (var j = 1; j <= 3; j++) fake[COLS[j] + (4 + i)] = t === 0 ? PLAYERS[i][j] : 50 + Math.floor(Math.random() * 900);
      }
      var get = function (r) { return Object.prototype.hasOwnProperty.call(fake, r) ? fake[r] : sheet.raw(r); };
      var got = X.evaluate(String(raw), get);
      var want = expectFn(function (r) { return fake[r]; });
      if (typeof got !== "number" || Math.abs(got - want) > 1e-6) return false;
    }
    return true;
  }
  function colVals(get, col, n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(get(col + (4 + i)));
    return out;
  }
  function sum(a) { return a.reduce(function (s, n) { return s + n; }, 0); }

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

  // Typed answers: <div class="bx-num" data-answer="b5|B5" data-hints='{...}'>
  // Several right answers can be separated by |. Compared ignoring case and spaces.
  function initTyped() {
    document.querySelectorAll(".bx-num:not(.xl-fname)").forEach(function (q) {
      var input = q.querySelector("input");
      var btn = q.querySelector("button");
      var fb = q.querySelector(".bx-num-fb");
      var explain = q.querySelector(".bx-num-explain");
      var answers = (q.dataset.answer || "").split("|").map(function (a) { return norm(a).replace(/\s/g, ""); });
      var hints = {};
      try { hints = JSON.parse(q.dataset.hints || "{}"); } catch (e) { hints = {}; }
      function go() {
        var v = norm(input.value).replace(/\s/g, "");
        if (!v) return;
        if (answers.indexOf(v) !== -1) {
          fb.textContent = "Correct!";
          fb.className = "bx-num-fb ok";
          if (explain) explain.hidden = false;
          input.readOnly = true;
          btn.disabled = true;
        } else {
          fb.textContent = hints[v] || hints[input.value.trim()] || "Not quite, try again.";
          fb.className = "bx-num-fb no";
        }
      }
      btn.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } });
    });
  }

  // File name checker: <div class="xl-fname" data-version="1">
  function initFileNames() {
    document.querySelectorAll(".xl-fname").forEach(function (box) {
      var input = box.querySelector("input");
      var btn = box.querySelector("button");
      var fb = box.querySelector(".bx-num-fb");
      var ver = box.dataset.version || "1";
      function go() {
        var v = input.value.trim().replace(/\.xlsx$/i, "");
        var msg = null;
        if (!v) return;
        if (/\s/.test(v)) msg = "No spaces in a file name. Join the words with underscores: _";
        else if (!/tournament/i.test(v)) msg = "Say WHAT it is: this file is your Tournament.";
        else if (!/_v\d+$/i.test(v)) msg = "Say WHICH version it is: end it with _v" + ver + ".";
        else if (!new RegExp("_v" + ver + "$", "i").test(v)) msg = "Right idea, wrong version. This one is version " + ver + ": _v" + ver + ".";
        else if (!/^[A-Za-z'\-]+_[A-Za-z'\-]+_Tournament_v\d+$/i.test(v)) msg = "Use the pattern Surname_Firstname_Tournament_v" + ver + ", with your own surname and first name.";
        else if (/^surname_firstname/i.test(v)) msg = "Put your real surname and first name in, not the words Surname and Firstname.";
        if (msg) { fb.textContent = msg; fb.className = "bx-num-fb no"; return; }
        fb.textContent = "That's a great file name: whose it is, what it is and which version. Your teacher can find it without opening it.";
        fb.className = "bx-num-fb ok";
      }
      btn.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } });
    });
  }

  // ---- Excel 1: What is a spreadsheet? ----------------------------------------

  function initAnatomy() {
    var host = $("xb-anatomy");
    if (!host) return;
    var sheet = X.create(host, {
      cols: 5, rows: 11, data: board(8), select: "A1", label: "The tournament leaderboard",
      onSelect: function (ref, activated) { if (activated) onClickCell(ref); }
    });

    // Name that cell: a cell lights up, they type its reference.
    var nameBox = $("xb-name");
    var ask = nameBox.querySelector(".xl-game-ask");
    var input = nameBox.querySelector("input");
    var fb = nameBox.querySelector(".bx-num-fb");
    var btn = nameBox.querySelector("button");
    var ROUNDS = 5, round = 0, target = null;
    function pick() {
      var c, r;
      do { c = 1 + Math.floor(Math.random() * 4); r = 3 + Math.floor(Math.random() * 9); }
      while (target && X.colName(c) + r === target);
      target = X.colName(c) + r;
      var m = {}; m[target] = "xl-target";
      sheet.setMarks(m);
      ask.textContent = "Round " + (round + 1) + " of " + ROUNDS + ": which cell is lit up in yellow?";
      input.value = "";
    }
    function go() {
      var v = input.value.trim().toUpperCase();
      if (!v || !target) return;
      if (v === target) {
        round++;
        if (round >= ROUNDS) {
          sheet.setMarks({});
          target = null;
          ask.textContent = "All " + ROUNDS + " named. Column letter first, then row number: you've got it.";
          fb.textContent = "Done!";
          fb.className = "bx-num-fb ok";
          btn.textContent = "Play again";
          round = 0;
          return;
        }
        fb.textContent = "Yes, " + v + ".";
        fb.className = "bx-num-fb ok";
        pick();
      } else {
        var flip = /^\d+[A-Z]+$/.test(v);
        fb.textContent = flip ? "Letter first, then number: " + v.replace(/^(\d+)([A-Z]+)$/, "$2$1") + " is how Excel writes it. Is that the one?"
                              : "Not quite. Find its column letter at the top, then its row number on the left.";
        fb.className = "bx-num-fb no";
      }
    }
    btn.addEventListener("click", function () {
      if (!target) { round = 0; fb.textContent = ""; btn.textContent = "Check"; pick(); input.focus(); return; }
      go();
    });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (target) go(); } });

    // Click hunt.
    var hunt = $("xb-hunt");
    var HUNT = [
      { ref: "C6", ask: "Click TurboToast's Round 2 score." },
      { ref: "A10", ask: "Click the cell with GGGrandma in it." },
      { ref: "D3", ask: "Click the heading of the Round 3 column." },
      { ref: "B11", ask: "Click cell B11." }
    ];
    var step = -1;
    var hAsk = hunt.querySelector(".bx-hunt-ask"), hFb = hunt.querySelector(".bx-hunt-fb"), hStart = hunt.querySelector(".bx-hunt-start");
    hStart.addEventListener("click", function () {
      step = 0;
      sheet.setMarks({}); target = null;
      hStart.hidden = true;
      hFb.textContent = ""; hFb.className = "bx-hunt-fb";
      hAsk.textContent = "1 of " + HUNT.length + ": " + HUNT[0].ask;
      sheet.focus();
    });
    function onClickCell(ref) {
      if (step < 0) return;
      if (ref === HUNT[step].ref) {
        step++;
        if (step >= HUNT.length) {
          step = -1;
          hAsk.textContent = "Hunt complete.";
          hFb.textContent = "All " + HUNT.length + " found.";
          hFb.className = "bx-hunt-fb ok";
          hStart.hidden = false; hStart.textContent = "Hunt again";
          return;
        }
        hFb.textContent = "Yes, that's " + ref + "."; hFb.className = "bx-hunt-fb ok";
        hAsk.textContent = (step + 1) + " of " + HUNT.length + ": " + HUNT[step].ask;
      } else {
        hFb.textContent = "That's " + ref + ". Try again."; hFb.className = "bx-hunt-fb no";
      }
    }
  }

  function initFakes() {
    var host = $("xb-fakes");
    if (!host) return;
    var FAKES = { C5: "29O", B6: "61O", D7: "'470" };
    var data = board(4);
    Object.keys(FAKES).forEach(function (r) { data[r] = FAKES[r]; });
    var editable = [];
    for (var i = 0; i < 4; i++) for (var j = 1; j <= 3; j++) editable.push(COLS[j] + (4 + i));
    var fb = $("xb-fakes-fb");
    var found = {};
    var sheet = X.create(host, {
      cols: 4, rows: 7, data: data, editable: editable, select: "B4", label: "Find the scores Excel reads as text",
      onSelect: function (ref, activated) {
        if (!activated || editable.indexOf(ref) === -1) return;
        var v = sheet.value(ref);
        if (typeof v === "string") {
          found[ref] = true;
          fb.hidden = false; fb.className = "bx-fb ok";
          fb.textContent = "Found one: " + ref + " is text, so it sits on the left. " +
            (String(sheet.raw(ref))[0] === "'" ? "It starts with an apostrophe, which tells Excel \"this is text\"." : "Look closely: that's a letter O, not a zero.") +
            " Retype it as a number (" + Object.keys(found).length + " of 3 found).";
        }
      },
      onUpdate: check
    });
    function check() {
      var allNum = true, allRight = true;
      editable.forEach(function (ref) {
        var p = X.splitRef(ref), want = PLAYERS[p.row - 4][p.col - 1], v = sheet.value(ref);
        if (typeof v !== "number") allNum = false;
        else if (v !== want) allRight = false;
      });
      if (allNum && allRight) {
        fb.hidden = false; fb.className = "bx-fb ok";
        fb.textContent = "Fixed. Every score is a real number now, so they all line up on the right and Excel can do maths with them.";
      } else if (allNum) {
        fb.hidden = false; fb.className = "bx-fb no";
        fb.textContent = "They're all numbers now, but one doesn't match the scores above. Check what you retyped.";
      }
    }
  }

  function initNarrow() {
    var host = $("xb-narrow");
    if (!host) return;
    var data = board(4);
    data.E3 = "Total";
    for (var i = 0; i < 4; i++) data["E" + (4 + i)] = rowTotal(i);
    var fb = $("xb-narrow-fb");
    var sheet = X.create(host, {
      cols: 5, rows: 7, data: data, narrow: { A: "3.6rem", E: "2.2rem" }, select: "A4", label: "Fix the narrow columns",
      onAutofit: function () {
        var left = ["A", "E"].filter(function (c) { return sheet.isNarrow(c); });
        fb.hidden = false;
        fb.className = "bx-fb " + (left.length ? "no" : "ok");
        fb.textContent = left.length ? "One fixed. Now column " + left[0] + "." : "Both columns fit. Every name reads in full and the totals show instead of #####.";
      }
    });
  }

  function initBuild() {
    var host = $("xb-task-sheet");
    if (!host) return;
    var state = { saved: false };
    var els = taskEls("xb-task");
    var N = 4;
    var sheet = X.create(host, {
      cols: 5, rows: 8, data: {}, editable: true, narrow: { A: "4.2rem" }, select: "A1",
      label: "Build the leaderboard", storeKey: store("excel-basics-task"), onUpdate: check
    });
    $("xb-task-reset").addEventListener("click", function () { sheet.reset(); });
    function check() {
      var items = [];
      items.push({ label: "The title is in A1", ok: norm(sheet.value("A1")) === norm(TITLE),
        hint: "A1 should say " + TITLE + "." });
      var empty2 = ["A2", "B2", "C2", "D2"].every(function (r) { return sheet.raw(r) == null; });
      items.push({ label: "Row 2 is left empty", ok: empty2, hint: "Leave row 2 empty: it gives the title some space." });
      var badHead = null;
      HEADERS.forEach(function (h, i) { if (!badHead && norm(sheet.value(COLS[i] + "3")) !== norm(h)) badHead = COLS[i] + "3 should say " + h + "."; });
      items.push({ label: "The four headings are in row 3", ok: !badHead, hint: badHead });
      var badName = null, badScore = null, textNum = null;
      for (var i = 0; i < N; i++) {
        var row = 4 + i;
        if (!badName && norm(sheet.value("A" + row)) !== norm(PLAYERS[i][0])) badName = "A" + row + " should say " + PLAYERS[i][0] + ".";
        for (var j = 1; j <= 3; j++) {
          var ref = COLS[j] + row, v = sheet.value(ref), want = PLAYERS[i][j];
          if (typeof v === "string" && norm(v) === String(want) && !textNum) textNum = ref;
          if (typeof v === "string" && v !== "" && !textNum && norm(v).replace(/o/g, "0") === String(want)) textNum = ref;
          if (!badScore && v !== want) badScore = ref + " should be " + want + ".";
        }
      }
      items.push({ label: "The first " + N + " players are in A4 to A" + (3 + N), ok: !badName, hint: badName });
      items.push({ label: "Their scores are in B4 to D" + (3 + N), ok: !badScore,
        hint: textNum ? textNum + " is sitting on the left, so Excel thinks it's text. Retype it as a number." : badScore });
      items.push({ label: "Column A is wide enough to read every name", ok: !sheet.isNarrow("A"),
        hint: "Some names are cut off. Double-click the line between the A and B column letters." });
      taskResult(els, items, "excel-basics-task",
        "Leaderboard v1 done. In real Excel you'd type all eight players, then save it as Surname_Firstname_Tournament_v1.", state);
    }
    check();
  }

  // ---- Excel 2: Make it readable ----------------------------------------------

  function formattedBoard() {
    return {
      merges: ["A1:E1"],
      format: { "A1": { b: 1, c: 1 }, "A3:E3": { b: 1, c: 1, w: 1, fill: "blue" }, "A3:E11": { bd: 1 } }
    };
  }

  function initCompare() {
    var plain = $("xf-plain"), pretty = $("xf-pretty");
    if (!plain || !pretty) return;
    var data = board(8, { totalHeader: true });
    X.create(plain, { cols: 5, rows: 11, data: data, narrow: { E: "5.5rem" }, label: "Plain leaderboard" });
    var f = formattedBoard();
    X.create(pretty, { cols: 5, rows: 11, data: data, narrow: { E: "5.5rem" }, merges: f.merges, format: f.format, label: "Formatted leaderboard" });
  }

  function practice(id, cfg, goals, doneMsg) {
    var host = $(id);
    if (!host) return;
    var listEl = $(id + "-checks"), fb = $(id + "-fb");
    var memory = {};
    var sheet = X.create(host, Object.assign({ ribbon: true, label: "Practice sheet", onUpdate: check }, cfg));
    function check() {
      var items = goals.map(function (g) {
        var ok = memory[g.key] || g.test(sheet, memory);
        if (ok && g.sticky) memory[g.key] = true;
        return { label: g.label, ok: ok, hint: g.hint };
      });
      var bad = checklist(listEl, items);
      if (!bad) { fb.hidden = false; fb.className = "bx-fb ok"; fb.textContent = doneMsg; }
      else fb.hidden = true;
    }
    check();
    return sheet;
  }
  function isMerged(sheet, name) {
    return sheet.merges().some(function (m) { return m.name === name; });
  }
  function allFmt(sheet, range, key) {
    var R = X.rectOf(range), ok = true;
    for (var r = R.r1; r <= R.r2; r++) for (var c = R.c1; c <= R.c2; c++) if (!sheet.fmt(X.colName(c) + r)[key]) ok = false;
    return ok;
  }

  function initFormatPractice() {
    var small = board(3, { totalHeader: true });
    practice("xf-merge", { cols: 5, rows: 6, data: small, select: "A1" }, [
      { key: "m1", sticky: true, label: "Merge & Center A1 to E1", test: function (s) { return isMerged(s, "A1:E1"); },
        hint: "Click A1, drag across to E1, then press Merge & Center." },
      { key: "s1", sticky: true, label: "Split it again", test: function (s, mem) { return mem.m1 && !isMerged(s, "A1:E1"); },
        hint: "With the merged title selected, press Merge & Center again." },
      { key: "m2", sticky: false, label: "Merge it back, ready for next time", test: function (s, mem) { return mem.s1 && isMerged(s, "A1:E1"); },
        hint: "Select A1 to E1 and merge it once more." }
    ], "Merge and split: done. Remember, only titles get merged, never the data in your table.");

    practice("xf-wrap", { cols: 5, rows: 6, data: small, narrow: { E: "5.5rem" }, select: "E3" }, [
      { key: "w", label: "Wrap the long heading in E3", test: function (s) { return Boolean(s.fmt("E3").w); },
        hint: "Click E3, then press Wrap Text." },
      { key: "n", label: "Keep column E narrow (don't widen it)", test: function (s) { return s.isNarrow("E"); },
        hint: "Wrap Text is the point here: undo the widening (Ctrl + Z) and wrap instead." }
    ], "Wrapped. The heading runs onto two lines and the column stays narrow, so the table still fits on the screen.");

    practice("xf-borders", { cols: 5, rows: 6, data: small, narrow: { E: "5.5rem" }, format: { "E3": { w: 1 } }, select: "A3" }, [
      { key: "b", label: "All Borders on A3 to E6", test: function (s) { return allFmt(s, "A3:E6", "bd"); },
        hint: "Drag from A3 to E6, then press All Borders." },
      { key: "f", label: "Shade the heading row A3 to E3", test: function (s) {
          var R = X.rectOf("A3:E3"), ok = true;
          for (var c = R.c1; c <= R.c2; c++) if (!s.fmt(X.colName(c) + "3").fill) ok = false;
          return ok;
        }, hint: "Select A3 to E3 and pick a light Fill colour." },
      { key: "bo", label: "Make the heading row bold", test: function (s) { return allFmt(s, "A3:E3", "b"); },
        hint: "With A3 to E3 selected, press B (or Ctrl + B)." }
    ], "Lines, shading and bold: the table now has edges and the headings stand out. One light colour is plenty.");
  }

  function initFormatTask() {
    var host = $("xf-task-sheet");
    if (!host) return;
    var state = { saved: false };
    var els = taskEls("xf-task");
    var start = board(8);
    var sheet = X.create(host, {
      cols: 5, rows: 11, data: start, editable: ["E3"], ribbon: true, narrow: { E: "5.5rem" }, select: "E3",
      label: "Format the leaderboard", storeKey: store("excel-format-task"), onUpdate: check
    });
    $("xf-task-reset").addEventListener("click", function () { sheet.reset(); });
    function check() {
      var items = [];
      items.push({ label: "E3 says " + TOTAL_HEADER, ok: norm(sheet.value("E3")) === norm(TOTAL_HEADER),
        hint: "Click E3 and type the heading: " + TOTAL_HEADER });
      items.push({ label: "The title is merged and centred across A1 to E1", ok: isMerged(sheet, "A1:E1") && Boolean(sheet.fmt("A1").c),
        hint: "Select A1 to E1 and press Merge & Center." });
      items.push({ label: "Row 3 headings are wrapped and centred", ok: allFmt(sheet, "A3:E3", "w") && allFmt(sheet, "A3:E3", "c"),
        hint: "Select A3 to E3, then press Wrap Text and Centre." });
      items.push({ label: "All Borders on A3 to E11", ok: allFmt(sheet, "A3:E11", "bd"),
        hint: "Drag from A3 down to E11, then press All Borders." });
      var shaded = true;
      for (var c = 1; c <= 5; c++) if (!sheet.fmt(X.colName(c) + "3").fill) shaded = false;
      items.push({ label: "The heading row is shaded and bold", ok: shaded && allFmt(sheet, "A3:E3", "b"),
        hint: "Select A3 to E3, pick a light Fill colour and press B." });
      var badMerge = sheet.merges().some(function (m) { return m.r2 >= 3; });
      var lost = norm(sheet.value("A1")) !== norm(TITLE) || PLAYERS.some(function (p, i) {
        return p.some(function (v, j) { return norm(sheet.value(COLS[j] + (4 + i))) !== norm(v); });
      });
      items.push({ label: "No merged cells inside the table, and no data lost", ok: !badMerge && !lost,
        hint: badMerge ? "Something inside the table is merged. Select it and press Merge & Center to split it." : "Some data has gone. Press Undo (Ctrl + Z) until it's back." });
      taskResult(els, items, "excel-format-task",
        "Leaderboard v2 done. In real Excel, this is the moment you Save As Surname_Firstname_Tournament_v2.", state);
    }
    check();
  }

  // ---- Excel 3: Let Excel do the maths ------------------------------------------

  function initPlay() {
    var host = $("xm-play");
    if (!host) return;
    var fb = $("xm-play-fb");
    var data = board(1, { totalHeader: true });
    var sheet = X.create(host, {
      cols: 5, rows: 4, data: data, editable: ["E4"], select: "E4", label: "Add up PixelPanda's rounds",
      onUpdate: function () {
        var v = sheet.raw("E4");
        if (v == null) { fb.hidden = true; return; }
        fb.hidden = false;
        if (String(v).trim()[0] !== "=") {
          fb.className = "bx-fb no";
          fb.textContent = /^\d+$/.test(String(v).trim()) ? "That's a typed number. It won't change if a score changes. Use a formula starting with =."
                                                          : "No = at the start, so Excel shows it as words. Start with =";
        } else if (robust(sheet, "E4", function (g) { return g("B4") + g("C4") + g("D4"); }, 1)) {
          fb.className = "bx-fb ok";
          fb.textContent = "1310. That formula adds whatever is in B4, C4 and D4, now and whenever they change.";
        } else {
          var got = sheet.value("E4");
          fb.className = "bx-fb no";
          fb.textContent = X.isErr(got) ? "Excel shows " + got.xl + ". " + got.why : "That gives " + X.show(got) + ". It needs B4, C4 and D4 added together.";
        }
      }
    });
  }

  function initRefs() {
    var host = $("xm-refs");
    if (!host) return;
    var data = board(1, { totalHeader: true });
    data.E3 = "With refs"; data.F3 = "Typed in";
    data.E4 = "=B4+C4+D4"; data.F4 = "=420+380+510";
    var sheet = X.create(host, { cols: 6, rows: 4, data: data, select: "C4", label: "Cell references versus typed numbers" });
    var btn = $("xm-refs-btn"), out = $("xm-refs-fb"), fixed = false;
    btn.addEventListener("click", function () {
      fixed = !fixed;
      sheet.set("C4", fixed ? 480 : 380);
      sheet.setMarks(fixed ? { C4: "xl-target", F4: "xl-stale" } : {});
      btn.textContent = fixed ? "Put it back to 380" : "Round 2 was marked wrong: change C4 to 480";
      out.hidden = !fixed;
      out.className = "bx-fb no";
      out.textContent = "E4 updated itself to 1410. F4 still says 1310, which is now wrong, and nothing warns you. Someone would have to notice and retype it.";
    });
  }

  function initFunctions() {
    var host = $("xm-func");
    if (!host) return;
    var listEl = $("xm-func-checks"), fb = $("xm-func-fb");
    var data = board(8);
    data.A13 = "Highest"; data.A14 = "Lowest"; data.A15 = "Average";
    var sheet = X.create(host, {
      cols: 4, rows: 15, data: data, editable: ["B13", "B14", "B15"], select: "B13", label: "MAX, MIN and AVERAGE",
      onUpdate: check
    });
    var JOBS = [
      { ref: "B13", fn: "MAX", label: "B13: the highest Round 1 score", f: function (a) { return Math.max.apply(null, a); } },
      { ref: "B14", fn: "MIN", label: "B14: the lowest Round 1 score", f: function (a) { return Math.min.apply(null, a); } },
      { ref: "B15", fn: "AVERAGE", label: "B15: the average Round 1 score", f: function (a) { return sum(a) / a.length; } }
    ];
    function check() {
      var items = JOBS.map(function (j) {
        var ok = robust(sheet, j.ref, function (g) { return j.f(colVals(g, "B", 8)); }, 8);
        var raw = String(sheet.raw(j.ref) || ""), v = sheet.value(j.ref), hint;
        if (!raw) hint = "Click " + j.ref + " and type a formula with " + j.fn + ".";
        else if (/AVG/i.test(raw) && !/AVERAGE/i.test(raw)) hint = "It's AVERAGE, not AVG. Excel shows #NAME? because it doesn't know the word AVG.";
        else if (raw.trim()[0] !== "=") hint = j.ref + " needs a formula starting with =, not a typed answer.";
        else if (X.isErr(v)) hint = j.ref + " shows " + v.xl + ". " + v.why;
        else hint = j.ref + " gives " + X.show(v) + ". Use =" + j.fn + "(B4:B11) so it looks at all eight Round 1 scores.";
        return { label: j.label, ok: ok, hint: hint };
      });
      var bad = checklist(listEl, items);
      fb.hidden = false;
      fb.className = "bx-fb " + (bad ? "no" : "ok");
      fb.textContent = bad ? bad.hint : "All three work. The highest is 610, the lowest 90 and the average 375.";
    }
    check();
  }

  function initFill() {
    var host = $("xm-fill");
    if (!host) return;
    var fb = $("xm-fill-fb");
    var data = board(8, { totalHeader: true });
    data.E4 = "=SUM(B4:D4)";
    var editable = []; for (var i = 4; i <= 11; i++) editable.push("E" + i);
    var sheet = X.create(host, {
      cols: 5, rows: 11, data: data, editable: editable, fill: true, narrow: {}, select: "E4",
      format: { "E3": { w: 1 } }, label: "Fill the total down", onUpdate: check
    });
    function check() {
      var done = 0;
      for (var i = 0; i < 8; i++) {
        var ref = "E" + (4 + i), row = 4 + i;
        if (robust(sheet, ref, function (g) { return g("B" + row) + g("C" + row) + g("D" + row); }, 8)) done++;
      }
      fb.hidden = done < 2;
      if (done === 8) {
        fb.className = "bx-fb ok";
        fb.textContent = "Filled. Click E7 and look at the formula bar: =SUM(B7:D7). Excel moved the references down for each row.";
      } else {
        fb.className = "bx-fb no";
        fb.textContent = done + " of 8 totals done. Keep dragging the little square down to E11.";
      }
    }
  }

  function initErrors() {
    var host = $("xm-errors");
    if (!host) return;
    var listEl = $("xm-errors-checks"), fb = $("xm-errors-fb");
    var data = board(8, { totalHeader: true });
    for (var i = 4; i <= 11; i++) data["E" + i] = "=SUM(B" + i + ":D" + i + ")";
    data.E5 = "SUM(B5:D5)";
    data.E6 = "=SUMM(B6:D6)";
    data.C7 = "33O";
    var editable = ["E5", "E6", "C7"];
    var sheet = X.create(host, {
      cols: 5, rows: 11, data: data, editable: editable, narrow: { E: "2.2rem" }, select: "E4",
      format: { "E3": { w: 1 } }, label: "Fix the four problems", onUpdate: check, onAutofit: check
    });
    function totalOk(row) {
      return robust(sheet, "E" + row, function (g) { return g("B" + row) + g("C" + row) + g("D" + row); }, 8);
    }
    function check() {
      var items = [
        { label: "Column E shows its numbers, not #####", ok: !sheet.isNarrow("E"),
          hint: "##### means the column is too narrow. Double-click the line to the right of the E column letter." },
        { label: "E5 calculates instead of showing words", ok: totalOk(5),
          hint: "E5 shows the formula as words because it's missing something at the start. Click E5 and add it." },
        { label: "E6 has no #NAME? error", ok: totalOk(6),
          hint: "#NAME? means Excel doesn't know a word in the formula. Check how SUM is spelt in E6." },
        { label: "CtrlAltDefeat's total is right (it should be 1130)", ok: typeof sheet.value("C7") === "number" && sheet.value("C7") === 330,
          hint: "There's no error message, but E7 is too low. One score in row 7 is sitting on the LEFT of its cell. SUM skips text, so retype it as a number." }
      ];
      var bad = checklist(listEl, items);
      fb.hidden = false;
      fb.className = "bx-fb " + (bad ? "no" : "ok");
      fb.textContent = bad ? bad.hint : "All four fixed. The sneaky one was the last: no error at all, just a wrong answer. That's why you check numbers sit on the right.";
    }
    check();
  }

  function initMathsTask() {
    var host = $("xm-task-sheet");
    if (!host) return;
    var state = { saved: false };
    var els = taskEls("xm-task");
    var data = board(8, { totalHeader: true });
    var editable = [];
    for (var i = 4; i <= 11; i++) editable.push("E" + i);
    ["A13", "A14", "A15"].forEach(function (r) { editable.push(r); });
    for (var c = 2; c <= 5; c++) for (var r = 13; r <= 15; r++) editable.push(X.colName(c) + r);
    editable.push("C6");
    var f = formattedBoard();
    var sheet = X.create(host, {
      cols: 5, rows: 15, data: data, editable: editable, fill: true, narrow: { E: "5.5rem" },
      merges: f.merges, format: f.format, select: "E4",
      label: "Finish the leaderboard", storeKey: store("excel-formulas-task"), onUpdate: check
    });
    $("xm-task-reset").addEventListener("click", function () { sheet.reset(); });

    function rowExpect(row) { return function (g) { return g("B" + row) + g("C" + row) + g("D" + row); }; }
    function colExpect(col, fn) {
      return function (g) {
        var vals = [];
        for (var i = 0; i < 8; i++) {
          var row = 4 + i;
          vals.push(col === "E" ? g("B" + row) + g("C" + row) + g("D" + row) : g(col + row));
        }
        return fn(vals);
      };
    }
    var FN = {
      MAX: function (a) { return Math.max.apply(null, a); },
      MIN: function (a) { return Math.min.apply(null, a); },
      AVERAGE: function (a) { return sum(a) / a.length; }
    };
    function check() {
      var items = [], hint;
      var badTotal = null;
      for (var i = 4; i <= 11; i++) {
        if (!robust(sheet, "E" + i, rowExpect(i), 8)) { badTotal = "E" + i; break; }
      }
      if (badTotal) {
        var raw = sheet.raw(badTotal);
        hint = raw == null ? "Put =SUM(B4:D4) in E4, then drag the fill handle down to E11."
          : String(raw).trim()[0] !== "=" ? badTotal + " has a typed number. Every answer has to come from a formula."
          : badTotal + " isn't adding up its own row. Check the formula in the formula bar.";
      }
      items.push({ label: "E4 to E11: a SUM for every player", ok: !badTotal, hint: hint });
      var labelsOk = norm(sheet.value("A13")) === "highest" && norm(sheet.value("A14")) === "lowest" && norm(sheet.value("A15")) === "average";
      items.push({ label: "Highest, Lowest and Average typed in A13 to A15", ok: labelsOk, hint: "Type Highest in A13, Lowest in A14 and Average in A15." });
      [["MAX", 13, "Highest"], ["MIN", 14, "Lowest"], ["AVERAGE", 15, "Average"]].forEach(function (job) {
        var bad = null;
        for (var c = 2; c <= 5; c++) {
          var col = X.colName(c);
          if (!robust(sheet, col + job[1], colExpect(col, FN[job[0]]), 8)) { bad = col + job[1]; break; }
        }
        var h = null;
        if (bad) {
          var rw = String(sheet.raw(bad) || "");
          h = !rw ? "Put =" + job[0] + "(B4:B11) in B" + job[1] + ", then drag the fill handle across to E" + job[1] + "."
            : /AVG/i.test(rw) && !/AVERAGE/i.test(rw) ? "It's AVERAGE, not AVG."
            : bad + " should be =" + job[0] + "(" + bad[0] + "4:" + bad[0] + "11).";
        }
        items.push({ label: job[2] + ": " + job[0] + " in B" + job[1] + " to E" + job[1], ok: !bad, hint: h });
      });
      taskResult(els, items, "excel-formulas-task",
        "Leaderboard v3 done: every answer comes from a formula. Now try the questions below, then fix TurboToast's score and watch everything update.", state);
    }
    check();
  }

  function boot() {
    if (!X) return;
    initChecks();
    initTyped();
    initFileNames();
    initAnatomy();
    initFakes();
    initNarrow();
    initBuild();
    initCompare();
    initFormatPractice();
    initFormatTask();
    initPlay();
    initRefs();
    initFunctions();
    initFill();
    initErrors();
    initMathsTask();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
