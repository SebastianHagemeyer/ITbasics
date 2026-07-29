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
 * The final score records as quiz_name "errors" (out of 5) via
 * ITBasics.saveAttempt, so it feeds the progress page and teacher export
 * exactly like the other module tests.
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
      why: 'Every line that opens a block (if, else, for, while, def) ends with a colon. ' +
           'This if has none, so Python reaches the end of the line still waiting for it. ' +
           'Notice the else: below got its colon right.'
    },
    {
      kind: "A name that does not match",
      code: [
        'high_score = 100',
        'player_score = int(input("Your score? "))',
        '',
        'if player_score > highscore:',
        '    print("New record!")'
      ],
      bad: 3,
      why: 'The variable was made as high_score, with an underscore, but this line asks ' +
           'for highscore without one. To Python those are two completely different names, ' +
           'so it says: NameError: name \'highscore\' is not defined.'
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

    var round = 0;
    var score = 0;
    var locked = false;
    var log = {};

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
      progEl.textContent = "Program " + (round + 1) + " of " + ROUNDS.length;
      scoreEl.textContent = "Spotted: " + score + " / " + ROUNDS.length;
      kindEl.hidden = true;
      kindEl.textContent = "";
      msgEl.hidden = true;
      msgEl.textContent = "";
      msgEl.className = "se-msg";
      nextBtn.hidden = true;

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
    }

    function guess(line, btn) {
      if (locked) return;
      locked = true;
      var r = ROUNDS[round];
      var right = line === r.bad;
      if (right) score++;
      log["p" + (round + 1)] = { picked: line + 1, answer: r.bad + 1, right: right };

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
      nextBtn.hidden = false;
      nextBtn.textContent = round === ROUNDS.length - 1 ? "See my score" : "Next program";
    }

    function finish() {
      stage.innerHTML = "";
      kindEl.hidden = true;
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
