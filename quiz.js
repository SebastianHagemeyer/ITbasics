(function () {
  "use strict";

  const quizzes = {
    programming: [
      {
        q: "What is an algorithm?",
        options: [
          "A type of computer virus",
          "A step-by-step plan to solve a problem",
          "A programming language",
          "A fast internet connection"
        ],
        answer: 1,
        explain: "An algorithm is just a clear set of steps in the right order \u2014 like a recipe."
      },
      {
        q: "Which of these best describes a variable?",
        options: [
          "A named box that stores information",
          "A bug in the code",
          "A piece of hardware",
          "The name of a website"
        ],
        answer: 0,
        explain: "Variables have a label (name) and hold a value you can change later."
      },
      {
        q: "What does an if statement do?",
        options: [
          "Repeats code many times",
          "Creates a new file",
          "Makes a decision based on a condition",
          "Prints text to the screen"
        ],
        answer: 2,
        explain: "If statements check a condition and choose what to do next."
      },
      {
        q: "Which of these is a loop?",
        options: [
          "A block of code that repeats",
          "A way to store text",
          "A type of error message",
          "A keyboard shortcut"
        ],
        answer: 0,
        explain: "Loops let us repeat actions without copy-pasting code."
      },
      {
        q: "What is debugging?",
        options: [
          "Writing brand-new code",
          "Finding and fixing mistakes in code",
          "Deleting a whole project",
          "Turning the computer off and on"
        ],
        answer: 1,
        explain: "Every programmer debugs \u2014 it\u2019s a normal, important skill."
      }
    ],
    html: [
      {
        q: "What does HTML stand for?",
        options: [
          "How To Make Links",
          "HyperText Markup Language",
          "Hot Tea &amp; Milk Latte",
          "Home Tools Mark-up Language"
        ],
        answer: 1,
        explain: "HTML = HyperText Markup Language."
      },
      {
        q: "Which tag creates the biggest heading?",
        options: [
          "&lt;h6&gt;",
          "&lt;head&gt;",
          "&lt;h1&gt;",
          "&lt;big&gt;"
        ],
        answer: 2,
        explain: "Headings go from &lt;h1&gt; (biggest) down to &lt;h6&gt; (smallest)."
      },
      {
        q: "Which tag is used for a paragraph?",
        options: [
          "&lt;para&gt;",
          "&lt;p&gt;",
          "&lt;text&gt;",
          "&lt;pg&gt;"
        ],
        answer: 1,
        explain: "&lt;p&gt; wraps a paragraph of text."
      },
      {
        q: "How do you create a link to another website?",
        options: [
          "&lt;link url=\"...\"&gt;",
          "&lt;a href=\"...\"&gt;text&lt;/a&gt;",
          "&lt;goto&gt;...&lt;/goto&gt;",
          "&lt;url&gt;...&lt;/url&gt;"
        ],
        answer: 1,
        explain: "&lt;a&gt; is the anchor tag, and href tells it where to go."
      },
      {
        q: "Why should images always have an alt attribute?",
        options: [
          "It makes the image load faster",
          "It is required by the browser to show the image",
          "It describes the image for screen readers and if the image fails to load",
          "It controls the image\u2019s size"
        ],
        answer: 2,
        explain: "alt text makes the web accessible for everyone."
      }
    ],
    python: [
      {
        q: "Which function prints to the screen?",
        options: [
          "say()",
          "print()",
          "show()",
          "output()"
        ],
        answer: 1,
        explain: "print(...) displays text or values."
      },
      {
        q: "What does input() return?",
        options: [
          "An integer",
          "A decimal",
          "A string (text)",
          "A list"
        ],
        answer: 2,
        explain: "input() always gives back text \u2014 convert with int() to do maths."
      },
      {
        q: "How many times does this loop run?  for i in range(4):",
        options: [
          "3 times",
          "4 times",
          "5 times",
          "It never stops"
        ],
        answer: 1,
        explain: "range(4) gives 0, 1, 2, 3 \u2014 that\u2019s 4 steps."
      },
      {
        q: "What will   print(5 // 2)   show?",
        options: [
          "2.5",
          "2",
          "3",
          "1"
        ],
        answer: 1,
        explain: "// is whole-number division, so 5 // 2 = 2."
      },
      {
        q: "Why does Python care about indentation?",
        options: [
          "It makes the code run faster",
          "It shows which lines belong inside an if, loop or function",
          "It is only for looking tidy",
          "It stops other people reading the code"
        ],
        answer: 1,
        explain: "Indentation is how Python knows which block code belongs to."
      }
    ]
  };

  function buildQuiz(name) {
    const form = document.querySelector('.quiz-form[data-quiz="' + name + '"]');
    if (!form) return;
    const questions = quizzes[name];
    form.innerHTML = "";

    questions.forEach(function (item, qIndex) {
      const field = document.createElement("fieldset");
      field.className = "quiz-q";

      const legend = document.createElement("legend");
      legend.innerHTML = "<span class=\"q-num\">Q" + (qIndex + 1) + ".</span> " + item.q;
      field.appendChild(legend);

      item.options.forEach(function (opt, oIndex) {
        const id = name + "-q" + qIndex + "-o" + oIndex;
        const label = document.createElement("label");
        label.className = "quiz-option";
        label.setAttribute("for", id);

        const input = document.createElement("input");
        input.type = "radio";
        input.name = name + "-q" + qIndex;
        input.value = String(oIndex);
        input.id = id;

        const span = document.createElement("span");
        span.innerHTML = opt;

        label.appendChild(input);
        label.appendChild(span);
        field.appendChild(label);
      });

      const feedback = document.createElement("p");
      feedback.className = "quiz-feedback";
      feedback.dataset.feedback = String(qIndex);
      field.appendChild(feedback);

      form.appendChild(field);
    });

    const actions = document.createElement("div");
    actions.className = "quiz-actions";
    actions.innerHTML =
      '<button type="submit" class="btn btn-primary">Check answers</button>' +
      '<button type="button" class="btn btn-ghost" data-reset="' + name + '">Reset</button>';
    form.appendChild(actions);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      scoreQuiz(name);
    });

    form.querySelector('[data-reset="' + name + '"]').addEventListener("click", function () {
      form.reset();
      form.querySelectorAll(".quiz-feedback").forEach(function (el) {
        el.textContent = "";
        el.className = "quiz-feedback";
      });
      form.querySelectorAll(".quiz-option").forEach(function (el) {
        el.classList.remove("correct", "incorrect");
      });
      const result = document.querySelector('[data-result="' + name + '"]');
      result.hidden = true;
      result.innerHTML = "";
    });
  }

  function scoreQuiz(name) {
    const form = document.querySelector('.quiz-form[data-quiz="' + name + '"]');
    const questions = quizzes[name];
    let correct = 0;

    questions.forEach(function (item, qIndex) {
      const picked = form.querySelector('input[name="' + name + "-q" + qIndex + '"]:checked');
      const feedback = form.querySelector('[data-feedback="' + qIndex + '"]');
      const options = form.querySelectorAll('input[name="' + name + "-q" + qIndex + '"]');

      options.forEach(function (opt) {
        opt.parentElement.classList.remove("correct", "incorrect");
      });

      if (!picked) {
        feedback.textContent = "No answer chosen. The correct answer was: " + stripTags(item.options[item.answer]);
        feedback.className = "quiz-feedback incorrect";
        options[item.answer].parentElement.classList.add("correct");
        return;
      }

      const chosen = parseInt(picked.value, 10);
      picked.parentElement.classList.add(chosen === item.answer ? "correct" : "incorrect");

      if (chosen === item.answer) {
        correct++;
        feedback.textContent = "Correct! " + item.explain;
        feedback.className = "quiz-feedback correct";
      } else {
        options[item.answer].parentElement.classList.add("correct");
        feedback.textContent = "Not quite. " + item.explain;
        feedback.className = "quiz-feedback incorrect";
      }
    });

    const result = document.querySelector('[data-result="' + name + '"]');
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    let message;
    if (pct === 100) message = "Perfect score! You have nailed this module.";
    else if (pct >= 80) message = "Great work! You clearly understand this.";
    else if (pct >= 60) message = "Solid effort. Review the missed questions and try again.";
    else message = "Keep going \u2014 reread the lesson, then retake the quiz.";

    result.hidden = false;
    result.innerHTML =
      '<h3>Your score: ' + correct + " / " + total + " (" + pct + "%)</h3>" +
      '<p>' + message + '</p>';
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function stripTags(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function setupTabs() {
    const tabs = document.querySelectorAll(".quiz-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const name = tab.dataset.tab;
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        document.querySelectorAll(".quiz").forEach(function (q) {
          q.hidden = q.id !== name;
        });
        history.replaceState(null, "", "#" + name);
      });
    });

    const hash = (location.hash || "").replace("#", "");
    if (hash && document.getElementById(hash)) {
      const target = document.querySelector('.quiz-tab[data-tab="' + hash + '"]');
      if (target) target.click();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    ["programming", "html", "python"].forEach(buildQuiz);
    setupTabs();
  });
})();
