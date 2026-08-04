/* spoterror.js
 *
 * "Spot the error": a five round minigame for the Errors module. Each round
 * shows a short Python program with exactly ONE deliberate mistake, and the
 * student clicks the line they think is wrong.
 *
 * Syntax highlighting is deliberately OFF here. Colour is a crutch: a real
 * editor would paint the broken quote red and hand them the answer, so the
 * code is plain monospace text and they have to read it like Python does.
 *
 * Hard mode (a checkbox, remembered between visits) adds a second stage:
 * after spotting the line you have to TYPE it correctly before the point is
 * awarded. Each round's `fix` pattern is forgiving about spacing and quote
 * style but strict about the actual repair, and about indentation where the
 * indentation IS the fix.
 *
 * The final score records as quiz_name "errors" (out of 5) via
 * ITBasics.saveAttempt, so it feeds the progress page and teacher export
 * exactly like the other module tests. Hard mode keeps the same denominator:
 * it is a harder route to the same 5, not a different scale.
 */
(function () {
  "use strict";

  var ROUNDS = [
    {
      kind: "A missing colon",
      code: [
        'name = input("What is your name? ")',
        '',
        'if name == "Ada"',
        '    print("Hello, Ada!")',
        'else:',
        '    print("Hello, stranger!")'
      ],
      bad: 2,
      fix: /^if\s+name\s*==\s*(["'])Ada\1\s*:\s*$/,
      fixHint: 'if name == "Ada":',
      why: 'Every line that opens a block (if, else, for, while, def) ends with a colon. ' +
           'This if has none, so Python reaches the end of the line still waiting for it. ' +
           'Notice the else: below got its colon right.'
    },
    {
      kind: "A name that does not match",
      // The rest of the program uses high_score on purpose. Without that, a
      // name mismatch has two equally good repairs (rename the line, or rename
      // where it was made) and only one of them can be typed here, which marks
      // a student wrong for a perfectly sound idea.
      code: [
        'high_score = 100',
        'player_score = int(input("Your score? "))',
        '',
        'if player_score > highscore:',
        '    print("New record! The old one was", high_score)'
      ],
      bad: 3,
      fix: /^if\s+player_score\s*>\s*high_score\s*:\s*$/,
      fixHint: 'if player_score > high_score:',
      why: 'The variable was made as high_score, with an underscore, but this line asks ' +
           'for highscore without one. To Python those are two completely different names, ' +
           'so it says: NameError: name \'highscore\' is not defined. You could fix a mismatch ' +
           'from either end, but not here: the last line uses high_score too, so renaming the ' +
           'top line would just break that one instead. The broken line is the one to repair.'
    },
    {
      kind: "Missing indentation",
      code: [
        'pets = ["cat", "dog", "fish"]',
        '',
        'for pet in pets:',
        'print(pet)',
        '',
        'print("That is all of them.")'
      ],
      bad: 3,
      // Leading whitespace is the whole point of this one, so it is required.
      fix: /^[ \t]+print\s*\(\s*pet\s*\)\s*$/,
      fixHint: '    print(pet)',
      why: 'The for line ends with a colon, so Python expects the next line to be indented ' +
           'to show what belongs inside the loop. This one starts at the far left, so ' +
           'Python complains: IndentationError: expected an indented block.'
    },
    {
      kind: "One equals instead of two",
      code: [
        'age = int(input("How old are you? "))',
        '',
        'if age = 13:',
        '    print("Happy 13th birthday!")',
        'else:',
        '    print("Not 13 yet.")'
      ],
      bad: 2,
      fix: /^if\s+age\s*==\s*13\s*:\s*$/,
      fixHint: 'if age == 13:',
      why: 'One equals STORES a value, two equals ASKS a question. Inside an if you are ' +
           'asking, so it needs age == 13. With a single = Python thinks you are trying ' +
           'to store something in the middle of a question.'
    },
    {
      kind: "A bracket left open",
      code: [
        'total = 0',
        'total = total + int(input("First number? ")',
        'total = total + int(input("Second number? "))',
        'print("Total:", total)'
      ],
      bad: 1,
      fix: /^total\s*=\s*total\s*\+\s*int\s*\(\s*input\s*\(\s*(["']).*?\1\s*\)\s*\)\s*$/,
      fixHint: 'total = total + int(input("First number? "))',
      why: 'Count them: this line opens three brackets and closes only two. Python reads on ' +
           'looking for the missing one, so it cannot tell where the line was meant to end. ' +
           'Modern Python is kind and reports "\'(\' was never closed", pointing back here.'
    }
  ];

  function el(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function init(root) {
    var stage   = root.querySelector(".se-stage");
    var progEl  = root.querySelector(".se-progress");
    var scoreEl = root.querySelector(".se-score");
    var kindEl  = root.querySelector(".se-kind");
    var msgEl   = root.querySelector(".se-msg");
    var nextBtn = root.querySelector(".se-next");
    var bestEl  = root.querySelector(".se-best");

    var hardIn  = root.querySelector(".se-hard");
    var hardWrap = root.querySelector(".se-hard-wrap");
    var fixWrap = root.querySelector(".se-fix");
    var fixIn   = root.querySelector(".se-fix-input");
    var fixBtn  = root.querySelector(".se-fix-go");

    var round = 0;
    var score = 0;
    var locked = false;
    var log = {};

    var HARD_KEY = "itbasics-spoterror-hard";
    if (hardIn) {
      try { hardIn.checked = localStorage.getItem(HARD_KEY) === "1"; } catch (e) {}
      hardIn.addEventListener("change", function () {
        try { localStorage.setItem(HARD_KEY, hardIn.checked ? "1" : "0"); } catch (e) {}
      });
    }
    function hardMode() { return Boolean(hardIn && hardIn.checked); }

    /* You pick the difficulty before you start, not partway through. It is
       only changeable on program 1 and only until the first guess, so nobody
       can spot four the easy way, switch on hard mode for the last one, and
       call the 5 out of 5 the same thing. Playing again unlocks it. */
    function lockHard() {
      if (!hardIn) return;
      var open = round === 0 && !locked;
      hardIn.disabled = !open;
      if (hardWrap) hardWrap.classList.toggle("is-locked", !open);
    }

    function showBest() {
      if (!window.ITBasics || !window.ITBasics.getScores) return;
      Promise.resolve(window.ITBasics.getScores("errors")).then(function (s) {
        if (s && s.best) {
          bestEl.textContent = "Your best: " + s.best.score + " / " + s.best.total;
          bestEl.hidden = false;
        }
      });
    }

    function paintRound() {
      var r = ROUNDS[round];
      locked = false;
      stage.hidden = false;
      if (hardWrap) hardWrap.hidden = false;
      progEl.textContent = "Program " + (round + 1) + " of " + ROUNDS.length;
      scoreEl.textContent = "Spotted: " + score + " / " + ROUNDS.length;
      kindEl.hidden = true;
      kindEl.textContent = "";
      msgEl.hidden = true;
      msgEl.textContent = "";
      msgEl.className = "se-msg";
      nextBtn.hidden = true;
      if (fixWrap) fixWrap.hidden = true;

      var html = "";
      r.code.forEach(function (line, i) {
        html += '<button type="button" class="se-line" data-line="' + i + '">' +
          '<span class="se-num">' + (i + 1) + "</span>" +
          '<span class="se-text">' + (line === "" ? "&nbsp;" : escapeHtml(line)) + "</span>" +
          "</button>";
      });
      stage.innerHTML = html;
      stage.querySelectorAll(".se-line").forEach(function (b) {
        b.addEventListener("click", function () { guess(Number(b.dataset.line), b); });
      });
      lockHard();
    }

    function guess(line, btn) {
      if (locked) return;
      locked = true;
      lockHard();
      var r = ROUNDS[round];
      var right = line === r.bad;
      var hard = hardMode() && Boolean(r.fix);
      // In hard mode the point is not awarded yet: they still have to type
      // the repair. A wrong click loses the round either way.
      if (right && !hard) score++;
      log["p" + (round + 1)] = { picked: line + 1, answer: r.bad + 1, right: right, hard: hard };

      // Always reveal the real culprit, whether they got it or not.
      var lines = stage.querySelectorAll(".se-line");
      lines.forEach(function (b) { b.disabled = true; });
      lines[r.bad].classList.add("is-answer");
      if (!right) btn.classList.add("is-wrong");

      kindEl.hidden = false;
      kindEl.textContent = "Line " + (r.bad + 1) + ": " + r.kind;
      msgEl.hidden = false;
      msgEl.className = "se-msg " + (right ? "ok" : "err");
      msgEl.textContent = (right ? "Spotted it. " : "Not that one. ") + r.why;
      scoreEl.textContent = "Spotted: " + score + " / " + ROUNDS.length;

      if (right && hard) {
        // Stage two: retype the line properly to earn the point.
        msgEl.textContent = "Spotted it. Now fix it: retype line " + (r.bad + 1) + " correctly.";
        fixWrap.hidden = false;
        fixIn.value = r.code[r.bad];
        fixIn.disabled = false;
        fixBtn.disabled = false;
        fixIn.focus();
        fixIn.setSelectionRange(fixIn.value.length, fixIn.value.length);
        return;
      }
      showNext();
    }

    function showNext() {
      nextBtn.hidden = false;
      nextBtn.textContent = round === ROUNDS.length - 1 ? "See my score" : "Next program";
    }

    function submitFix() {
      var r = ROUNDS[round];
      if (!r.fix || fixIn.disabled) return;
      var typed = String(fixIn.value).replace(/\s+$/, "");
      var ok = r.fix.test(typed);
      if (ok) score++;
      var entry = log["p" + (round + 1)];
      if (entry) { entry.typed = typed; entry.fixed = ok; }
      fixIn.disabled = true;
      fixBtn.disabled = true;
      msgEl.className = "se-msg " + (ok ? "ok" : "err");
      msgEl.textContent = ok
        ? "Fixed. " + r.why
        : "Not quite. The line should read: " + r.fixHint + "  |  " + r.why;
      scoreEl.textContent = "Spotted: " + score + " / " + ROUNDS.length;
      showNext();
    }

    // Indent by four, the way the editors do. Round 3 is repaired BY indenting,
    // so reaching for Tab is the natural move and it should not throw them out
    // of the box. Shift+Tab takes an indent back off. Enter submits and Escape
    // steps out, so this never becomes a keyboard trap.
    var INDENT = "    ";
    function retab(e) {
      var v = fixIn.value;
      var a = fixIn.selectionStart;
      var b = fixIn.selectionEnd;
      if (e.shiftKey) {
        var lead = v.length - v.replace(/^[ \t]+/, "").length;
        if (!lead) return;
        var cut = Math.min(lead, INDENT.length);
        fixIn.value = v.slice(cut);
        var back = function (n) { return Math.max(0, n - cut); };
        fixIn.setSelectionRange(back(a), back(b));
        return;
      }
      fixIn.value = v.slice(0, a) + INDENT + v.slice(b);
      fixIn.setSelectionRange(a + INDENT.length, a + INDENT.length);
    }

    if (fixBtn) fixBtn.addEventListener("click", submitFix);
    if (fixIn) fixIn.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); submitFix(); return; }
      if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (fixIn.disabled) return;
        e.preventDefault();
        retab(e);
        return;
      }
      if (e.key === "Escape") { fixIn.blur(); }
    });

    function finish() {
      // An emptied stage is just a black bar with nothing in it, so it goes
      // entirely. The finished screen is the score and Play again.
      stage.innerHTML = "";
      stage.hidden = true;
      if (hardWrap) hardWrap.hidden = true;
      kindEl.hidden = true;
      if (fixWrap) fixWrap.hidden = true;
      progEl.textContent = "Done!";
      var msg = score === ROUNDS.length ? "Perfect. You read code like Python does."
              : score >= 3 ? "Good spotting. Run it again to catch the rest."
              : "Syntax takes practice. Read the explanations, then try again.";
      msgEl.hidden = false;
      msgEl.className = "se-msg " + (score >= 3 ? "ok" : "err");
      msgEl.innerHTML = "<strong>You spotted " + score + " out of " + ROUNDS.length +
        ".</strong> " + msg;
      nextBtn.hidden = false;
      nextBtn.textContent = "Play again";
      if (window.ITBasics && window.ITBasics.saveAttempt) {
        Promise.resolve(window.ITBasics.saveAttempt("errors", score, ROUNDS.length, log))
          .then(showBest);
      }
    }

    nextBtn.addEventListener("click", function () {
      // A hidden button must not act. Double-clicking, or holding Enter while
      // it has focus, fires the handler again before the browser has taken
      // the hidden button away, which used to skip whole programs unanswered.
      if (nextBtn.hidden) return;
      if (round === ROUNDS.length - 1 && nextBtn.textContent === "See my score") {
        finish();
        return;
      }
      if (nextBtn.textContent === "Play again") {
        round = 0; score = 0; log = {};
        paintRound();
        return;
      }
      round++;
      paintRound();
    });

    paintRound();
    showBest();
  }

  function boot() {
    if (!window.ITBasics) return;
    document.querySelectorAll(".spot-error").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
