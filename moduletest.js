(function () {
  "use strict";

  // Reusable graded module test. Markup on a module page:
  //   <div class="module-test" data-test="binary">
  //     <div class="mtest-q" data-answer="c">
  //       <p class="mtest-prompt">Question?</p>
  //       <div class="mtest-opts">
  //         <button type="button" class="mtest-opt" data-key="a">..</button> ...
  //       </div>
  //     </div>
  //     ... more .mtest-q ...
  //   </div>
  // The submit button, result line and best-score note are added by JS.
  // Each submit records ITBasics.saveAttempt(testName, score, total, answers);
  // the best score is read back with ITBasics.getScores(testName) and feeds the
  // "My Modules" list on the progress page (quiz_name === the data-test value).

  function pct(score, total) { return total ? Math.round((score / total) * 100) : 0; }

  function initOne(root) {
    var testName = root.dataset.test;
    if (!testName) return;
    var questions = Array.prototype.slice.call(root.querySelectorAll(".mtest-q"));
    var total = questions.length;
    if (!total) return;

    questions.forEach(function (q) {
      q.querySelectorAll(".mtest-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          q.querySelectorAll(".mtest-opt").forEach(function (o) {
            o.classList.remove("selected", "is-correct", "is-wrong");
          });
          opt.classList.add("selected");
          q.dataset.selected = opt.dataset.key;
        });
      });
    });

    var footer = document.createElement("div");
    footer.className = "mtest-footer";
    var submit = document.createElement("button");
    submit.type = "button";
    submit.className = "btn btn-primary mtest-submit";
    submit.textContent = "Check my answers";
    var result = document.createElement("div");
    result.className = "mtest-result";
    result.hidden = true;
    var best = document.createElement("p");
    best.className = "mtest-best";
    best.hidden = true;
    footer.appendChild(submit);
    footer.appendChild(result);
    footer.appendChild(best);
    root.appendChild(footer);

    function showBest() {
      if (!window.ITBasics || !window.ITBasics.getScores) return;
      Promise.resolve(window.ITBasics.getScores(testName)).then(function (s) {
        if (s && s.best) {
          best.textContent = "Your best: " + s.best.score + " / " + s.best.total +
            " (" + pct(s.best.score, s.best.total) + "%)";
          best.hidden = false;
        }
      });
    }

    submit.addEventListener("click", function () {
      var score = 0, answered = 0, log = {};
      questions.forEach(function (q, i) {
        var sel = q.dataset.selected || null;
        var correct = q.dataset.answer;
        if (sel) answered++;
        log["q" + (i + 1)] = sel;
        q.querySelectorAll(".mtest-opt").forEach(function (o) {
          o.classList.remove("is-correct", "is-wrong");
          if (o.dataset.key === correct) o.classList.add("is-correct");
          else if (o.dataset.key === sel) o.classList.add("is-wrong");
        });
        if (sel === correct) score++;
      });
      var p = pct(score, total);
      result.hidden = false;
      result.className = "mtest-result " + (p === 100 ? "perfect" : p >= 60 ? "pass" : "low");
      result.innerHTML = "<strong>" + score + " / " + total + "</strong> (" + p + "%) &middot; " +
        (p === 100 ? "Perfect!" : p >= 60 ? "Nice work." : "Keep practising.") +
        (answered < total ? ' <span class="mtest-warn">You left ' + (total - answered) + " unanswered.</span>" : "");
      if (window.ITBasics && window.ITBasics.saveAttempt) {
        Promise.resolve(window.ITBasics.saveAttempt(testName, score, total, log)).then(showBest);
      }
    });

    showBest();
  }

  function boot() {
    if (!window.ITBasics) return;
    document.querySelectorAll(".module-test[data-test]").forEach(initOne);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
