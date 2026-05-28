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
      },
      {
        q: "What is a function in code?",
        options: [
          "A reusable block of code that does a specific job",
          "A single number used in maths",
          "Another word for a website",
          "A type of error"
        ],
        answer: 0,
        explain: "Functions group code under a name so we can call (run) it whenever we need."
      },
      {
        q: "Which of these is a SYNTAX error?",
        options: [
          "Forgetting to close a bracket",
          "Choosing a slow algorithm",
          "Using the wrong icon",
          "Saving the file to the wrong folder"
        ],
        answer: 0,
        explain: "Syntax errors break the rules of the language \u2014 the computer can\u2019t even start running the code."
      },
      {
        q: "Pseudocode is\u2026",
        options: [
          "Real, working code in a special language",
          "A way to plan code in plain language before writing it",
          "A type of secret password",
          "The first language Python was written in"
        ],
        answer: 1,
        explain: "Pseudocode means \u2018fake code\u2019 \u2014 we use it to plan, not to run."
      },
      {
        q: "Which symbol checks if two values are EQUAL in most languages?",
        options: [
          "=",
          "==",
          "!=",
          "<>"
        ],
        answer: 1,
        explain: "= assigns a value, == compares them. Mixing them up is a very common bug."
      },
      {
        q: "A boolean value can only be\u2026",
        options: [
          "A whole number",
          "True or False",
          "A list of words",
          "Either a 1 or a letter"
        ],
        answer: 1,
        explain: "Booleans are yes/no values. Computers use them for every decision."
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
      },
      {
        q: "What kind of content goes inside the &lt;head&gt; tag?",
        options: [
          "Everything the user sees on the page",
          "Info ABOUT the page (title, links to CSS, etc.)",
          "Just the main heading",
          "A picture of the website owner"
        ],
        answer: 1,
        explain: "&lt;head&gt; holds meta-info; &lt;body&gt; holds what\u2019s shown on screen."
      },
      {
        q: "Which tag creates a NUMBERED list?",
        options: [
          "&lt;ul&gt;",
          "&lt;list&gt;",
          "&lt;ol&gt;",
          "&lt;nl&gt;"
        ],
        answer: 2,
        explain: "&lt;ol&gt; = ordered list (numbered). &lt;ul&gt; = unordered (bullets)."
      },
      {
        q: "What does &lt;br&gt; do?",
        options: [
          "Makes text bold",
          "Adds a line break",
          "Builds a border",
          "Breaks the page"
        ],
        answer: 1,
        explain: "&lt;br&gt; forces a new line without starting a new paragraph."
      },
      {
        q: "What is a CSS class used for?",
        options: [
          "Naming a group of elements that should share the same style",
          "Picking the only element with that ID",
          "Replacing JavaScript",
          "Adding sound effects"
        ],
        answer: 0,
        explain: "Multiple elements can share a class; an id should be unique to one element."
      },
      {
        q: "Which tag means \u2018this text is important\u2019 (with strong styling)?",
        options: [
          "&lt;big&gt;",
          "&lt;b&gt;",
          "&lt;strong&gt;",
          "&lt;loud&gt;"
        ],
        answer: 2,
        explain: "&lt;strong&gt; tells the browser AND screen readers that the text matters."
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
      },
      {
        q: "How do you write a one-line comment in Python?",
        options: [
          "// like this",
          "/* like this */",
          "# like this",
          "&lt;!-- like this --&gt;"
        ],
        answer: 2,
        explain: "Python uses # for single-line comments."
      },
      {
        q: "What does   len('hello')   return?",
        options: [
          "4",
          "5",
          "6",
          "An error"
        ],
        answer: 1,
        explain: "len() counts the characters, h, e, l, l, o = 5."
      },
      {
        q: "Which of these creates a LIST in Python?",
        options: [
          "(1, 2, 3)",
          "{1, 2, 3}",
          "[1, 2, 3]",
          "&lt;1, 2, 3&gt;"
        ],
        answer: 2,
        explain: "Square brackets make a list. Round brackets make a tuple, curly braces a set."
      },
      {
        q: "Which operator gives the REMAINDER of a division?",
        options: [
          "/",
          "//",
          "%",
          "**"
        ],
        answer: 2,
        explain: "% is the modulo operator. 13 % 5 = 3."
      },
      {
        q: "What does   True and False   evaluate to?",
        options: [
          "True",
          "False",
          "Both",
          "An error"
        ],
        answer: 1,
        explain: "‘and’ is only True when BOTH sides are True."
      }
    ],
    mixed: [
      {
        q: "Which of these is NOT a programming concept?",
        options: ["Variable", "Loop", "Paragraph", "Function"],
        answer: 2,
        explain: "Paragraphs belong to HTML. Variables, loops and functions are programming."
      },
      {
        q: "What does an algorithm describe?",
        options: [
          "A piece of hardware",
          "A series of steps to solve a problem",
          "A type of computer mouse",
          "The shape of a website"
        ],
        answer: 1,
        explain: "Algorithms are step-by-step plans. Computers follow them exactly."
      },
      {
        q: "Where does the &lt;title&gt; tag belong?",
        options: [
          "Inside &lt;head&gt;",
          "At the top of &lt;body&gt;",
          "Inside &lt;footer&gt;",
          "Anywhere on the page"
        ],
        answer: 0,
        explain: "&lt;title&gt; goes in &lt;head&gt;. It shows up in the browser tab."
      },
      {
        q: "What does this Python code print?   print('ha' * 3)",
        options: ["ha 3", "hahaha", "ha ha ha", "An error"],
        answer: 1,
        explain: "Multiplying a string by 3 repeats it three times: hahaha."
      },
      {
        q: "Which Python data type holds ONLY True or False?",
        options: ["int", "str", "list", "bool"],
        answer: 3,
        explain: "bool is short for boolean, true or false."
      },
      {
        q: "Which HTML element creates a clickable link?",
        options: [
          "&lt;link&gt;",
          "&lt;href&gt;",
          "&lt;a&gt;",
          "&lt;click&gt;"
        ],
        answer: 2,
        explain: "&lt;a&gt; is the anchor tag. Use href to set the destination."
      },
      {
        q: "What is   13 % 5   in Python?",
        options: ["2", "2.6", "3", "8"],
        answer: 2,
        explain: "% gives the remainder. 13 ÷ 5 = 2 with 3 left over."
      },
      {
        q: "What is a ‘bug’ in software?",
        options: [
          "An insect inside the computer",
          "A mistake or error in the code",
          "A type of virus",
          "A feature nobody likes"
        ],
        answer: 1,
        explain: "Any mistake that makes code misbehave is called a bug."
      },
      {
        q: "Which HTML tag is for the BIGGEST heading?",
        options: [
          "&lt;head&gt;",
          "&lt;h1&gt;",
          "&lt;h6&gt;",
          "&lt;heading&gt;"
        ],
        answer: 1,
        explain: "&lt;h1&gt; is the biggest, &lt;h6&gt; is the smallest."
      },
      {
        q: "Which loop runs WHILE a condition is True?",
        options: ["for loop", "while loop", "if loop", "spin loop"],
        answer: 1,
        explain: "while loops keep going as long as their condition stays True."
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
        input.addEventListener("change", function () { persistAnswers(name); });

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
      persistAnswers(name);
    });

    restoreAnswers(name);
    refreshScoreBadge(name);
  }

  function readAnswers(name) {
    const form = document.querySelector('.quiz-form[data-quiz="' + name + '"]');
    const out = {};
    quizzes[name].forEach(function (_item, qIndex) {
      const picked = form.querySelector('input[name="' + name + "-q" + qIndex + '"]:checked');
      if (picked) out[qIndex] = parseInt(picked.value, 10);
    });
    return out;
  }

  function applyAnswers(name, answers) {
    if (!answers) return;
    const form = document.querySelector('.quiz-form[data-quiz="' + name + '"]');
    Object.keys(answers).forEach(function (qIndex) {
      const input = form.querySelector(
        'input[name="' + name + "-q" + qIndex + '"][value="' + answers[qIndex] + '"]'
      );
      if (input) input.checked = true;
    });
  }

  function persistAnswers(name) {
    if (!window.ITBasics || !window.ITBasics.getSession()) return;
    window.ITBasics.saveProgress(name, readAnswers(name));
  }

  async function restoreAnswers(name) {
    if (!window.ITBasics || !window.ITBasics.getSession()) return;
    const saved = await window.ITBasics.loadProgress(name);
    applyAnswers(name, saved);
  }

  async function refreshScoreBadge(name) {
    const section = document.getElementById(name);
    if (!section) return;
    let badge = section.querySelector(".quiz-scores");
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "quiz-scores";
      const form = section.querySelector(".quiz-form");
      section.insertBefore(badge, form);
    }
    badge.innerHTML = "";

    if (!window.ITBasics || !window.ITBasics.getSession()) {
      badge.className = "quiz-scores hint";
      badge.textContent = "Sign in with your student code (top right) to save your progress.";
      return;
    }
    badge.className = "quiz-scores";
    const s = await window.ITBasics.getScores(name);
    if (!s) {
      badge.textContent = "No attempts yet,give it a go!";
      return;
    }
    badge.innerHTML =
      '<span class="score-pill">Last: <strong>' + s.last.score + " / " + s.last.total + '</strong></span>' +
      '<span class="score-pill best">Best: <strong>' + s.best.score + " / " + s.best.total + '</strong></span>' +
      '<span class="score-meta">' + s.attempts + ' attempt' + (s.attempts === 1 ? '' : 's') + '</span>';
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

    if (window.ITBasics && window.ITBasics.getSession()) {
      window.ITBasics.saveAttempt(name, correct, total, readAnswers(name))
        .then(function () { refreshScoreBadge(name); });
    }
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
    ["programming", "html", "python", "mixed"].forEach(buildQuiz);
    setupTabs();
  });

  window.addEventListener("itbasics:auth", function () {
    ["programming", "html", "python", "mixed"].forEach(function (name) {
      const form = document.querySelector('.quiz-form[data-quiz="' + name + '"]');
      if (!form) return;
      form.reset();
      restoreAnswers(name);
      refreshScoreBadge(name);
    });
  });
})();
