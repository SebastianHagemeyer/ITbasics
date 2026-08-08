/* pseudocode.js
 *
 * The Pseudocode & Flowcharts module (/topics/pseudocode/). Four pieces:
 *
 *   initChecks()   the usual formative knowledge checks (.kcheck), same shape
 *                  as the other modules
 *   initShapeGame  "which shape holds this line?", so a keyword and a symbol
 *                  are learned as one thing rather than two topics
 *   initLineup()   put the scrambled lines of a program in order; the
 *                  indentation is drawn for them so the shape of an IF sinks in
 *   initWriter()   the graded exam task: type pseudocode into a box and have it
 *                  marked out of 3 the way the exam marks it
 *
 * The writer is the graded half of the module (quiz_name "pseudocode-task");
 * the quick check above it is the other half. A full-marks attempt saves an
 * answers.challenge id, which is the same signal challenges.js writes for a
 * passed coding task, so the progress page, the teacher export, the card ticks
 * and XP all count it without any of them needing to know about this file.
 *
 * Marking is generous about wording and strict about structure, which is how
 * the marking scheme reads: the keywords do not have to match exactly, but the
 * INPUT, the test and both branches have to be there.
 */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Fisher-Yates, with a guard so a "shuffle" is never the answer already.
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    var same = a.every(function (v, i) { return v === arr[i]; });
    return same && a.length > 1 ? shuffled(arr) : a;
  }

  // ---- Knowledge checks ----------------------------------------------------

  function initChecks() {
    $all(".kcheck").forEach(function (kc) {
      var answer = kc.dataset.answer;
      var feedback = $(".kcheck-feedback", kc);
      var explain = $(".kcheck-explain", kc);
      var solved = false;
      $all(".kcheck-opt", kc).forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (solved) return;
          if (opt.dataset.key === answer) {
            solved = true;
            opt.classList.add("correct");
            feedback.textContent = "Correct!";
            feedback.className = "kcheck-feedback correct";
            feedback.hidden = false;
            if (explain) explain.hidden = false;
            $all(".kcheck-opt", kc).forEach(function (o) { o.disabled = true; });
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

  // ---- The four shapes -----------------------------------------------------

  // One drawing per shape, reused by the reference cards on the page and by the
  // game below, so the two can never end up showing different symbols.
  var SHAPE_SVG = {
    terminator: '<rect x="8" y="10" width="124" height="44" rx="22" />',
    io: '<polygon points="30,10 132,10 110,54 8,54" />',
    process: '<rect x="8" y="10" width="124" height="44" rx="4" />',
    decision: '<polygon points="70,8 132,32 70,56 8,32" />'
  };

  var SHAPE_NAMES = {
    terminator: "Terminator",
    io: "Input / Output",
    process: "Process",
    decision: "Decision"
  };

  function shapeSvg(key, label) {
    return '<svg class="shape-svg" viewBox="0 0 140 64" role="img" aria-label="' +
      (label || SHAPE_NAMES[key] || key) + ' symbol">' + (SHAPE_SVG[key] || "") + "</svg>";
  }

  // Fill in the reference cards on the page: <span class="shape-art" data-shape="io">
  function paintShapeArt() {
    $all(".shape-art[data-shape]").forEach(function (span) {
      span.innerHTML = shapeSvg(span.dataset.shape);
    });
  }

  var SHAPE_ROUNDS = [
    { line: 'BEGIN', answer: "terminator",
      why: "BEGIN and END are where the program starts and stops, so they go in the rounded terminator." },
    { line: 'OUTPUT "How old are you?"', answer: "io",
      why: "OUTPUT puts something on the screen. Anything going in or out uses the leaning parallelogram." },
    { line: 'INPUT age', answer: "io",
      why: "INPUT takes something from the keyboard. Same shape as OUTPUT: it is data moving in or out." },
    { line: 'SET total = price * 2', answer: "process",
      why: "Working something out and storing it is a process, so it goes in a plain rectangle." },
    { line: 'IF age >= 18 THEN', answer: "decision",
      why: "An IF asks a question with two ways out, Yes and No. That is always the diamond." },
    { line: 'END', answer: "terminator",
      why: "END stops the program, so it is a terminator, exactly like BEGIN." }
  ];

  function initShapeGame() {
    var root = document.getElementById("shapegame");
    if (!root) return;

    var round = 0, score = 0, locked = false;

    var prog = el("p", "sg-prog");
    var line = el("pre", "code sg-line");
    var grid = el("div", "sg-grid");
    var why = el("p", "sg-why");
    why.hidden = true;
    var next = el("button", "btn btn-primary sg-next", "Next");
    next.type = "button";
    next.hidden = true;

    root.appendChild(prog);
    root.appendChild(line);
    root.appendChild(grid);
    root.appendChild(why);
    root.appendChild(next);

    function paint() {
      var r = SHAPE_ROUNDS[round];
      locked = false;
      prog.textContent = "Line " + (round + 1) + " of " + SHAPE_ROUNDS.length +
        "  ·  score " + score;
      line.textContent = r.line;
      why.hidden = true;
      next.hidden = true;
      grid.innerHTML = "";
      Object.keys(SHAPE_NAMES).forEach(function (key) {
        var btn = el("button", "sg-opt");
        btn.type = "button";
        btn.innerHTML = shapeSvg(key) + '<span class="sg-opt-name">' + SHAPE_NAMES[key] + "</span>";
        btn.addEventListener("click", function () {
          if (locked) return;
          if (key === r.answer) {
            locked = true;
            score++;
            btn.classList.add("right");
            why.textContent = r.why;
            why.className = "sg-why ok";
            why.hidden = false;
            $all(".sg-opt", grid).forEach(function (b) { b.disabled = true; });
            next.hidden = false;
            next.textContent = round === SHAPE_ROUNDS.length - 1 ? "See my score" : "Next line";
          } else {
            btn.classList.add("wrongpick");
            btn.disabled = true;
            why.textContent = "Not that one. Read the line again: is it starting, stopping, moving data, working something out, or asking a question?";
            why.className = "sg-why err";
            why.hidden = false;
          }
        });
        grid.appendChild(btn);
      });
    }

    function finish() {
      prog.textContent = "Done!";
      line.hidden = true;
      grid.innerHTML = "";
      why.className = "sg-why " + (score >= 5 ? "ok" : "err");
      why.textContent = score === SHAPE_ROUNDS.length
        ? "All six. You can read a flowchart and pseudocode as the same thing."
        : "You got " + score + " out of " + SHAPE_ROUNDS.length +
          ". Look back at the four shapes above, then run it again.";
      why.hidden = false;
      next.hidden = false;
      next.textContent = "Play again";
    }

    next.addEventListener("click", function () {
      if (next.textContent === "Play again") {
        round = 0; score = 0; line.hidden = false; paint(); return;
      }
      if (round === SHAPE_ROUNDS.length - 1) { finish(); return; }
      round++;
      paint();
    });

    paint();
  }

  // ---- Put the lines in order ---------------------------------------------

  // The target program, in order. `i` is how far the line is indented, which is
  // drawn for them as soon as a line is placed: seeing the IF body step in is
  // half the point of the exercise.
  var LINEUP = [
    { t: "BEGIN", i: 0 },
    { t: 'OUTPUT "How hot is it today?"', i: 1 },
    { t: "INPUT temp", i: 1 },
    { t: "IF temp >= 30 THEN", i: 1 },
    { t: 'OUTPUT "Hot day"', i: 2 },
    { t: "ELSE", i: 1 },
    { t: 'OUTPUT "Not too bad"', i: 2 },
    { t: "ENDIF", i: 1 },
    { t: "END", i: 0 }
  ];

  /* Colour a pseudocode line the same way the <pre> blocks on this page are
     coloured, so a line looks the same whether it is in the pool, in the
     answer, or being typed into the writer.
     Strings are split out and the code between them is coloured separately.
     Doing it with one pass of sequential regex replaces over the whole line
     does not work: the operator pass rewrites the = inside the class="..."
     that the keyword pass has just inserted, and the markup comes apart.
     Within a code segment the order still matters, so each pass only ever
     inserts characters that no later pass looks for: operators first (their
     markup holds no keywords and no digits), then keywords, then numbers. */
  var LINEUP_KEYWORDS = /\b(BEGIN|END|ENDIF|IF|THEN|ELSE|OUTPUT|INPUT|SET|WHILE|ENDWHILE|FOR|ENDFOR|REPEAT|UNTIL)\b/g;

  function colourCode(seg) {
    var s = escapeHtml(seg);
    s = s.replace(/(&gt;=|&lt;=|&gt;|&lt;|=|\+|\*|\/)/g, '<span class="c-op">$1</span>');
    s = s.replace(LINEUP_KEYWORDS, '<span class="c-keyword">$1</span>');
    return s.replace(/\b(\d+)\b/g, '<span class="c-num">$1</span>');
  }

  function colourLine(text) {
    var src = String(text == null ? "" : text);
    // No newline inside a string, so an unclosed quote colours its own line
    // and stops, rather than swallowing everything down to the next quote.
    var re = /"[^"\n]*"/g;
    var out = "", last = 0, m;
    while ((m = re.exec(src)) !== null) {
      out += colourCode(src.slice(last, m.index));
      out += '<span class="c-string">' + escapeHtml(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + colourCode(src.slice(last));
  }

  function initLineup() {
    var root = document.getElementById("lineup");
    if (!root) return;

    var placed = [];            // indexes into LINEUP, in the order chosen
    var poolWrap = el("div", "lineup-pool");
    var answer = el("div", "lineup-answer");
    var actions = el("div", "lineup-actions");
    var check = el("button", "btn btn-primary", "Check my order");
    check.type = "button";
    var reset = el("button", "btn btn-ghost", "Start again");
    reset.type = "button";
    var msg = el("p", "lineup-msg");
    msg.hidden = true;

    actions.appendChild(check);
    actions.appendChild(reset);
    root.appendChild(poolWrap);
    root.appendChild(answer);
    root.appendChild(actions);
    root.appendChild(msg);

    var order = shuffled(LINEUP.map(function (_, i) { return i; }));

    function paint() {
      poolWrap.innerHTML = "";
      order.forEach(function (idx) {
        if (placed.indexOf(idx) !== -1) return;
        var b = el("button", "lineup-chip");
        b.type = "button";
        b.innerHTML = colourLine(LINEUP[idx].t);
        b.addEventListener("click", function () { placed.push(idx); paint(); });
        poolWrap.appendChild(b);
      });
      if (!poolWrap.children.length) {
        poolWrap.appendChild(el("p", "lineup-empty", "That is every line. Press Check my order."));
      }

      answer.innerHTML = "";
      if (!placed.length) {
        answer.appendChild(el("p", "lineup-empty", "Your program will build up here."));
      }
      placed.forEach(function (idx, pos) {
        var b = el("button", "lineup-line");
        b.type = "button";
        b.innerHTML = colourLine(LINEUP[idx].t);
        b.style.paddingLeft = (14 + LINEUP[idx].i * 26) + "px";
        b.title = "Take this line back out";
        b.addEventListener("click", function () {
          placed.splice(pos, 1);
          msg.hidden = true;
          paint();
        });
        answer.appendChild(b);
      });
    }

    check.addEventListener("click", function () {
      if (placed.length < LINEUP.length) {
        msg.className = "lineup-msg err";
        msg.textContent = "Not finished yet: " + (LINEUP.length - placed.length) + " line(s) still to place.";
        msg.hidden = false;
        return;
      }
      var firstWrong = -1;
      placed.forEach(function (idx, pos) {
        var node = answer.children[pos];
        if (!node) return;
        var ok = idx === pos;
        node.classList.toggle("ok", ok);
        node.classList.toggle("bad", !ok);
        if (!ok && firstWrong === -1) firstWrong = pos;
      });
      if (firstWrong === -1) {
        msg.className = "lineup-msg ok";
        msg.textContent = "Perfect. Notice the shape: ask, read, test, one branch, ELSE, the other branch, then ENDIF closes it.";
      } else {
        msg.className = "lineup-msg err";
        msg.textContent = "Close. Line " + (firstWrong + 1) + " is the first one out of place. " +
          "Ask yourself what has to have happened before that line can make sense.";
      }
      msg.hidden = false;
    });

    reset.addEventListener("click", function () {
      placed = [];
      order = shuffled(LINEUP.map(function (_, i) { return i; }));
      msg.hidden = true;
      paint();
    });

    paint();
  }

  // ---- The graded exam task ------------------------------------------------

  var TASK = {
    quiz: "pseudocode-task",
    challenge: "pseudocode-password",
    total: 3,
    // What the student is asked to write, in machine-checkable pieces.
    value: "HALLAM",
    yes: "WELCOME",
    no: "DENIED",
    model:
      "BEGIN\n" +
      '    OUTPUT "What is the password?"\n' +
      "    INPUT password\n" +
      '    IF password = "hallam" THEN\n' +
      '        OUTPUT "Welcome in"\n' +
      "    ELSE\n" +
      '        OUTPUT "Access denied"\n' +
      "    ENDIF\n" +
      "END"
  };

  // Words that are pseudocode furniture rather than the student's own names.
  var KEYWORDS = {
    BEGIN: 1, START: 1, END: 1, STOP: 1, FINISH: 1,
    INPUT: 1, READ: 1, GET: 1, ENTER: 1, ASK: 1, FOR: 1, FROM: 1, USER: 1, THE: 1,
    OUTPUT: 1, PRINT: 1, DISPLAY: 1, WRITE: 1, SHOW: 1, SAY: 1,
    IF: 1, THEN: 1, ELSE: 1, ENDIF: 1, END_IF: 1,
    SET: 1, TO: 1, IS: 1, EQUAL: 1, EQUALS: 1, AND: 1, OR: 1, NOT: 1, DO: 1, AS: 1
  };

  var RE_INPUT = /\b(INPUT|READ|GET|ENTER)\b/;
  var RE_OUTPUT = /\b(OUTPUT|PRINT|DISPLAY|WRITE|SHOW|SAY)\b/;

  function stripStrings(line) { return line.replace(/"[^"]*"|'[^']*'/g, " "); }

  function flat(line) {
    return String(line || "").replace(/["'`]/g, "").replace(/\s+/g, " ").trim().toUpperCase();
  }

  // The names the student invented on this line: words that are not keywords.
  function idents(line) {
    return (stripStrings(line).match(/[A-Za-z_][A-Za-z0-9_]*/g) || [])
      .filter(function (w) { return !KEYWORDS[w.toUpperCase()]; })
      .map(function (w) { return w.toUpperCase(); });
  }

  // "is equal to" in any of the forms a student might reach for. A lone = counts,
  // but the = inside >= or <= must not, or every comparison would look like one.
  function hasEquality(f) {
    if (/\b(EQUALS|EQUAL TO|SAME AS|MATCHES)\b/.test(f)) return true;
    if (/==/.test(f)) return true;
    return /(^|[^<>!=])=(?!=)/.test(f);
  }

  /*
   * Mark a student's answer out of 3, using the exam's own scheme:
   *   1  an INPUT that stores what the user types in a variable
   *   2  an IF that tests that variable against the password
   *   3  both OUTPUT branches, the right message on each side
   * Returns { score, marks: [{ got, label, note }], tips: [string] }.
   * `tips` are style notes that carry no marks, so a student who has the three
   * marks still hears about a missing ENDIF.
   */
  function mark(text) {
    var raw = String(text || "").split(/\r?\n/);
    var rows = [];
    raw.forEach(function (line) {
      if (!line.trim()) return;
      /* Two readings of every line, because they answer different questions.
       *
       *   flat  keeps what is inside the quotes, so the password and the two
       *         messages can be found
       *   code  throws the quoted text away, so only real keywords are found
       *
       * Keyword hunting has to use `code`. A perfectly ordinary prompt,
       * OUTPUT "Enter the password", contains ENTER, and ENTER is one of the
       * words accepted for INPUT. Searching the quoted text for keywords made
       * that line look like the INPUT line, so the marker went looking for a
       * variable in it, found none, and took a mark off an answer that had
       * earned it. "Get ready" and "Read this" did the same thing.
       */
      rows.push({ raw: line, flat: flat(line), code: flat(stripStrings(line)) });
    });

    var marks = [];
    var tips = [];

    // --- Mark 1: INPUT into a variable ---
    var inIdx = -1;
    for (var i = 0; i < rows.length; i++) {
      if (RE_INPUT.test(rows[i].code)) { inIdx = i; break; }
    }
    var varName = null;
    if (inIdx !== -1) {
      var names = idents(rows[inIdx].raw);
      if (names.length) varName = names[0];
    }
    if (inIdx === -1) {
      marks.push({ got: false, label: "INPUT stored in a variable",
        note: "There is no INPUT line. The program has to read the password from the user before it can test it." });
    } else if (!varName) {
      marks.push({ got: false, label: "INPUT stored in a variable",
        note: "You have an INPUT, but it does not say where the answer is kept. Give it a name, for example INPUT password." });
    } else {
      marks.push({ got: true, label: "INPUT stored in a variable",
        note: "You read the password and kept it in " + varName.toLowerCase() + "." });
    }

    // --- Mark 2: the IF tests that variable against the password ---
    var ifIdx = -1;
    for (var j = 0; j < rows.length; j++) {
      if (/(^|\s)IF(\s|$)/.test(rows[j].code)) { ifIdx = j; break; }
    }
    if (ifIdx === -1) {
      marks.push({ got: false, label: "IF that tests the password",
        note: "There is no IF line, so the program cannot make a decision." });
    } else {
      var ifFlat = rows[ifIdx].flat;      // the password is inside the quotes
      var ifCode = rows[ifIdx].code;      // = and the variable name are not
      var hasValue = ifFlat.indexOf(TASK.value) !== -1;
      var hasVar = !varName || ifCode.indexOf(varName) !== -1;
      var eq = hasEquality(ifCode);
      if (hasValue && hasVar && eq) {
        marks.push({ got: true, label: "IF that tests the password",
          note: "Your IF asks the right question." });
      } else if (!hasValue) {
        marks.push({ got: false, label: "IF that tests the password",
          note: 'Your IF does not mention the password itself. It has to compare against "hallam".' });
      } else if (!hasVar) {
        marks.push({ got: false, label: "IF that tests the password",
          note: "Your IF does not use " + varName.toLowerCase() + ", the variable you read the answer into. Test that, not something else." });
      } else {
        marks.push({ got: false, label: "IF that tests the password",
          note: 'This one is about "is it equal to". Write it as = or EQUALS, for example IF ' +
            (varName ? varName.toLowerCase() : "password") + ' = "hallam" THEN.' });
      }
    }

    // --- Mark 3: both branches, right message on each side ---
    var elseIdx = -1;
    for (var k = 0; k < rows.length; k++) {
      if (/^ELSE\b/.test(rows[k].code)) { elseIdx = k; break; }
    }
    function outputAt(from, to, needle) {
      for (var n = Math.max(0, from); n < (to === -1 ? rows.length : to); n++) {
        // OUTPUT is a keyword, so read `code`; the message lives in the
        // quoted text, so read `flat`.
        if (RE_OUTPUT.test(rows[n].code) && rows[n].flat.indexOf(needle) !== -1) return n;
      }
      return -1;
    }
    var yesIn = ifIdx === -1 ? -1 : outputAt(ifIdx + 1, elseIdx, TASK.yes);
    var noAfter = elseIdx === -1 ? -1 : outputAt(elseIdx + 1, -1, TASK.no);
    var yesAnywhere = outputAt(0, -1, TASK.yes);
    var noAnywhere = outputAt(0, -1, TASK.no);

    if (yesIn !== -1 && noAfter !== -1) {
      marks.push({ got: true, label: "Both messages, on the right branch",
        note: "Welcome in on the IF side, Access denied on the ELSE side." });
    } else if (elseIdx === -1) {
      marks.push({ got: false, label: "Both messages, on the right branch",
        note: "There is no ELSE. Without it, a wrong password gets no answer at all." });
    } else if (yesAnywhere === -1 || noAnywhere === -1) {
      marks.push({ got: false, label: "Both messages, on the right branch",
        note: 'One of the two messages is missing. You need OUTPUT "Welcome in" and OUTPUT "Access denied".' });
    } else {
      marks.push({ got: false, label: "Both messages, on the right branch",
        note: "Both messages are there but on the wrong sides. Welcome in belongs after the IF, Access denied after the ELSE." });
    }

    /* --- Style tips: no marks, but they are what the marker notices next ---
     *
     * Named one by one rather than lumped together. "Wrap it in BEGIN and END"
     * is no help to someone who wrote BEGIN and forgot END: they read it,
     * see their BEGIN, and move on. Say which word is missing.
     *
     * Checked per line rather than across the whole answer, because ENDIF
     * contains END. Searching the blob for END finds the D in ENDIF and
     * reports a closed program that never closed.
     */
    function hasLine(re) {
      return rows.some(function (r) { return re.test(r.code); });
    }
    var hasBegin = hasLine(/^(BEGIN|START)\b/);
    var hasEndIf = hasLine(/^END ?IF\b/);
    var hasEnd = rows.some(function (r) {
      return /^END\b/.test(r.code) && !/^END ?IF\b/.test(r.code);
    });

    if (ifIdx !== -1 && !/\bTHEN\b/.test(rows[ifIdx].code)) {
      tips.push("Your IF line is missing THEN. The exam writes the whole thing as IF ... THEN.");
    }
    if (ifIdx !== -1 && !hasEndIf) {
      tips.push("You are missing ENDIF. You opened an IF, so close it with ENDIF on its own line: pseudocode says out loud where the IF stops.");
    }
    if (!hasBegin && !hasEnd) {
      tips.push("You are missing BEGIN and END. Wrap the whole thing in them so it is obvious where the program starts and finishes.");
    } else if (!hasEnd) {
      tips.push("You are missing END. You opened with BEGIN, so finish with END on its own line.");
    } else if (!hasBegin) {
      tips.push("You are missing BEGIN. You finished with END, so open with BEGIN on its own line.");
    }
    if (inIdx !== -1 && !rows.slice(0, inIdx).some(function (r) { return RE_OUTPUT.test(r.code); })) {
      tips.push("Ask the question before you read the answer: an OUTPUT prompt above your INPUT.");
    }
    if (!raw.some(function (l) { return /^\s+\S/.test(l); })) {
      tips.push("Indent the lines inside BEGIN and inside the IF. It costs nothing and it makes the shape readable.");
    }
    if (rows.length && !/[A-Z]/.test(String(text))) {
      tips.push("Write the keywords in CAPITALS: BEGIN, INPUT, IF, ELSE, ENDIF, END.");
    }

    var score = marks.filter(function (m) { return m.got; }).length;
    return { score: score, marks: marks, tips: tips };
  }

  function initWriter() {
    var box = document.getElementById("pseudo-writer");
    if (!box) return;
    var ta = $(".pw-input", box);
    var checkBtn = $(".pw-check", box);
    var clearBtn = $(".pw-clear", box);
    var out = $(".pw-result", box);
    var modelWrap = $(".pw-model", box);
    if (!ta || !checkBtn || !out) return;

    var DRAFT = "itbasics-pseudo-draft";
    try {
      var saved = localStorage.getItem(DRAFT);
      if (saved && !ta.value) ta.value = saved;
    } catch (e) { /* private browsing: the box still works, it just forgets */ }
    ta.addEventListener("input", function () {
      try { localStorage.setItem(DRAFT, ta.value); } catch (e) {}
    });

    // Tab indents rather than jumping out of the box: indentation is the point.
    ta.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      var s = ta.selectionStart, t = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(t);
      ta.selectionStart = ta.selectionEnd = s + 4;
      // Setting .value in script fires no input event, so the colour layer
      // has to be told by hand or it keeps showing the pre-Tab text.
      paintHl();
    });

    function best() {
      if (!window.ITBasics || !window.ITBasics.getScores) return;
      Promise.resolve(window.ITBasics.getScores(TASK.quiz)).then(function (s) {
        var line = $(".pw-best", box);
        if (!line || !s || !s.best) return;
        line.textContent = "Your best so far: " + s.best.score + " / " + TASK.total;
        line.hidden = false;
      });
    }

    checkBtn.addEventListener("click", function () {
      var text = ta.value;
      if (!text.trim()) {
        out.hidden = false;
        out.className = "pw-result low";
        out.innerHTML = "<p><strong>Nothing to mark yet.</strong> Write your pseudocode in the box, then press Check.</p>";
        return;
      }
      var res = mark(text);

      var html = '<p class="pw-score ' +
        (res.score === TASK.total ? "full" : res.score ? "part" : "none") + '"><strong>' +
        res.score + " / " + TASK.total + "</strong> " +
        (res.score === TASK.total ? "Full marks. That is exactly what the marker wants to see."
          : res.score ? "Nearly. Fix the crosses and check again."
          : "Not yet. Read the notes below, then have another go.") + "</p><ul class='pw-marks'>";
      res.marks.forEach(function (m) {
        html += '<li class="' + (m.got ? "got" : "lost") + '"><span class="pw-tick" aria-hidden="true">' +
          (m.got ? "✓" : "✗") + "</span><strong>" + m.label + "</strong> " + m.note + "</li>";
      });
      html += "</ul>";
      if (res.tips.length) {
        html += '<p class="pw-tips-head">No marks in it, but the marker will notice:</p><ul class="pw-tips">';
        // The marker is decorative: the heading above already says these are
        // notes rather than lost marks, so it is hidden from screen readers.
        res.tips.forEach(function (t) {
          html += '<li><span class="pw-tip-mark" aria-hidden="true">!</span>' + t + "</li>";
        });
        html += "</ul>";
      }
      out.className = "pw-result " + (res.score === TASK.total ? "full" : res.score ? "part" : "low");
      out.innerHTML = html;
      out.hidden = false;

      if (modelWrap) modelWrap.hidden = false;

      if (window.ITBasics && window.ITBasics.saveAttempt && window.ITBasics.getSession()) {
        // The challenge id only rides along at full marks, because that is the
        // signal every other page reads as "this task is done".
        var log = { text: text.slice(0, 2000), marks: res.marks.map(function (m) { return m.got ? 1 : 0; }) };
        if (res.score === TASK.total) log.challenge = TASK.challenge;
        Promise.resolve(window.ITBasics.saveAttempt(TASK.quiz, res.score, TASK.total, log)).then(best);
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        ta.value = "";
        try { localStorage.removeItem(DRAFT); } catch (e) {}
        out.hidden = true;
        paintHl();
        ta.focus();
      });
    }

    /* Colour what they type. A textarea cannot hold coloured text, so a <pre>
       sits behind it with the same metrics and the textarea's own text is made
       transparent, leaving just the caret. The two only stay lined up while
       the font, size, line height, padding and wrapping match exactly, which
       is why those live in one CSS block covering both.
       The trailing newline matters: a <pre> drops a final line break, so
       without it the last line drifts out of step once the box scrolls. */
    var hl = $(".pw-hl", box);
    function paintHl() {
      if (!hl) return;
      hl.innerHTML = colourLine(ta.value) + "\n";
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
    }
    if (hl) {
      ta.addEventListener("input", paintHl);
      ta.addEventListener("scroll", function () {
        hl.scrollTop = ta.scrollTop;
        hl.scrollLeft = ta.scrollLeft;
      });
      paintHl();
    }

    var pre = modelWrap && $("pre", modelWrap);
    if (pre) pre.textContent = TASK.model;

    best();
  }

  /* ---- "the same program, both ways", one step at a time -----------------
   *
   * The point of the section is that a shape and a line are the same thing,
   * so the two sides move together: each step lights the shape and the line
   * it becomes, side by side. Reading a finished flowchart next to finished
   * pseudocode makes that a claim; walking them together makes it visible.
   *
   * Steps that have not been reached are ghosted rather than removed, so
   * nothing shifts as it fills in and you can see how much is left. Steps
   * already passed stay fully visible: the whole point is the growing pair.
   *
   * The markup is complete and readable on its own; the ghosting only comes
   * on once this attaches. If the script never runs, the section is exactly
   * what it was before.
   */
  var FW_SAYS = [
    "",
    "Every flowchart starts with BEGIN in a rounded box.",
    "A parallelogram is output. This is the question being printed.",
    "Same shape for input. The answer is stored in a variable called age.",
    "The diamond is the question, and it is the only shape with two ways out. In pseudocode that is IF ... THEN.",
    "Follow Yes. That branch is the line under THEN.",
    "Follow No. That branch is ELSE, and the line under it.",
    "The two arrows join back up. That join is exactly where ENDIF goes.",
    "END closes the program, in a rounded box like BEGIN."
  ];

  function initFlowWalk() {
    var root = document.getElementById("flowwalk");
    if (!root) return;
    var parts = $all("[data-fw]", root);
    if (!parts.length) return;

    var last = parts.reduce(function (n, el) {
      return Math.max(n, parseInt(el.getAttribute("data-fw"), 10) || 0);
    }, 0);
    var stepEl = $("#fw-step", root);
    var sayEl = $("#fw-say", root);
    var backBtn = $(".fw-back", root);
    var nextBtn = $(".fw-next", root);
    var allBtn = $(".fw-all", root);
    var at = 1;

    function paint() {
      parts.forEach(function (el) {
        var n = parseInt(el.getAttribute("data-fw"), 10);
        el.classList.toggle("fw-shown", n <= at);
        el.classList.toggle("fw-now", n === at);
      });
      var done = at >= last;
      stepEl.textContent = "Step " + at + " of " + last;
      if (sayEl) sayEl.textContent = FW_SAYS[at] || "";
      backBtn.disabled = at <= 1;
      nextBtn.textContent = done ? "Start again" : "Next step";
      allBtn.hidden = done;
    }

    nextBtn.addEventListener("click", function () {
      at = at >= last ? 1 : at + 1;
      paint();
    });
    backBtn.addEventListener("click", function () {
      if (at > 1) { at -= 1; paint(); }
    });
    allBtn.addEventListener("click", function () { at = last; paint(); });

    root.classList.add("fw-on");
    paint();
  }

  /* ---- Section 4, one step at a time --------------------------------------
   *
   * Five worked steps, each a paragraph and the program so far. Shown all at
   * once it is a wall of nearly identical code blocks and the eye skips to
   * the last one, which is the only one that does not teach anything.
   *
   * Done here rather than in the markup so the page still reads as five plain
   * steps with the script off, and so adding a sixth step later needs no JS
   * change: it groups whatever "Step N." paragraphs it finds.
   */
  function initIfSteps() {
    var sec = document.getElementById("writing");
    if (!sec) return;

    var steps = [];
    $all("p", sec).forEach(function (para) {
      var strong = para.querySelector("strong");
      if (!strong || !/^Step\s*\d/.test(strong.textContent)) return;
      var pre = para.nextElementSibling;
      if (!pre || pre.tagName !== "PRE") return;
      var box = document.createElement("div");
      box.className = "ifstep";
      para.parentNode.insertBefore(box, para);
      box.appendChild(para);
      box.appendChild(pre);
      steps.push(box);
    });
    if (steps.length < 2) return;

    var bar = document.createElement("div");
    bar.className = "ifstep-bar";
    var count = el("p", "ifstep-count");
    var next = el("button", "btn btn-primary", "Next step");
    next.type = "button";
    var all = el("button", "btn btn-ghost", "Show all");
    all.type = "button";
    bar.appendChild(count);
    bar.appendChild(next);
    bar.appendChild(all);
    steps[steps.length - 1].parentNode.insertBefore(bar, steps[steps.length - 1].nextSibling);

    /* Everything between the last step and the next callout is the wrap-up:
       "That is the finished answer" and the summary of the skeleton. Left
       showing at step 1 it claims the walkthrough is over before it has
       started, so it waits for the last step like the steps themselves. */
    var after = [];
    var node = bar.nextElementSibling;
    while (node && !node.classList.contains("callout") && !node.classList.contains("kcheck")) {
      after.push(node);
      node = node.nextElementSibling;
    }

    var at = 1;
    function paint() {
      steps.forEach(function (box, i) { box.hidden = i + 1 > at; });
      var finished = at >= steps.length;
      after.forEach(function (n) { n.hidden = !finished; });
      count.textContent = "Step " + at + " of " + steps.length;
      bar.hidden = finished;
    }
    next.addEventListener("click", function () {
      at = Math.min(at + 1, steps.length);
      paint();
      // Land on the step just revealed rather than leaving it below the fold.
      steps[at - 1].scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    all.addEventListener("click", function () { at = steps.length; paint(); });
    paint();
  }

  /* ---- Blur a worked example until they ask for it ------------------------
   *
   * Section 5 shows the same IF in three languages. Read straight through,
   * the eye takes all three at once and the comparison does no work. Blurring
   * the second and third buys a couple of seconds of "how would Java say
   * this?", which is the whole question the section is asking.
   *
   * Each one reveals on its own: guessing Java tells you nothing about
   * Python, so one button for both would throw half the exercise away.
   *
   * The text stays in the DOM, blurred rather than removed, so it is still
   * there for a screen reader and for anyone who searches the page. This is a
   * nudge to think first, not a lock.
   */
  function initReveals() {
    $all("[data-reveal]").forEach(function (col) {
      var pre = col.querySelector("pre");
      if (!pre) return;
      var wrap = document.createElement("div");
      wrap.className = "reveal";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = el("button", "reveal-btn");
      btn.type = "button";
      btn.innerHTML = '<span class="reveal-pill">Reveal ' +
        escapeHtml(col.getAttribute("data-reveal")) + "</span>";
      wrap.appendChild(btn);

      btn.addEventListener("click", function () {
        wrap.classList.add("shown");
        // Focus moves to the code so a keyboard user is not left on a button
        // that has just vanished from under them.
        pre.setAttribute("tabindex", "-1");
        pre.focus();
      });
    });
  }

  // ---- boot ----------------------------------------------------------------

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    paintShapeArt();
    initChecks();
    initShapeGame();
    initFlowWalk();
    initIfSteps();
    initReveals();
    initLineup();
    initWriter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
