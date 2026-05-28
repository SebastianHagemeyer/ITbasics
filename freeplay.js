(function () {
  "use strict";

  const all = window.SCENARIOS || [];
  let pool = [];
  let current = null;
  let answered = 0;
  let correct = 0;
  let streak = 0;
  let bestStreak = 0;
  let topicFilter = "all";
  let locked = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function refillPool() {
    const filtered = topicFilter === "all"
      ? all.slice()
      : all.filter(function (s) { return s.topic === topicFilter; });
    pool = shuffle(filtered);
  }

  function nextQuestion() {
    if (!pool.length) refillPool();
    if (!pool.length) {
      current = null;
      render();
      return;
    }
    current = pool.pop();
    locked = false;
    render();
  }

  function topicLabel(t) {
    return { python: "Python", html: "HTML", logic: "Logic", concept: "Concept" }[t] || t;
  }

  function render() {
    const card    = document.getElementById("fp-card");
    const topic   = document.getElementById("fp-topic");
    const diff    = document.getElementById("fp-diff");
    const idEl    = document.getElementById("fp-id");
    const prompt  = document.getElementById("fp-prompt");
    const codeEl  = document.getElementById("fp-code");
    const optsEl  = document.getElementById("fp-options");
    const fbEl    = document.getElementById("fp-feedback");
    const nextBtn = document.getElementById("fp-next");

    if (!current) {
      prompt.textContent = "No scenarios in this category yet.";
      codeEl.hidden = true;
      optsEl.innerHTML = "";
      fbEl.hidden = true;
      nextBtn.hidden = true;
      return;
    }

    card.classList.remove("answered", "answered-correct", "answered-wrong");
    topic.textContent = topicLabel(current.topic);
    topic.dataset.topic = current.topic;
    diff.textContent = current.difficulty;
    diff.dataset.diff = current.difficulty;
    idEl.textContent = "#" + current.id;

    prompt.textContent = current.prompt;

    if (current.code) {
      const inner = document.getElementById("fp-code-inner");
      inner.textContent = current.code;
      inner.className = "language-" + (current.topic === "html" ? "markup" : "python");
      if (window.Prism && Prism.highlightElement) Prism.highlightElement(inner);
      codeEl.hidden = false;
    } else {
      const inner = document.getElementById("fp-code-inner");
      inner.textContent = "";
      inner.removeAttribute("class");
      codeEl.hidden = true;
    }

    optsEl.innerHTML = "";
    current.options.forEach(function (opt, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fp-option";
      btn.dataset.index = String(i);

      const letter = document.createElement("span");
      letter.className = "fp-option-letter";
      letter.textContent = String.fromCharCode(65 + i); // A, B, C, D

      const text = document.createElement("span");
      text.className = "fp-option-text";
      text.textContent = opt;

      btn.appendChild(letter);
      btn.appendChild(text);
      btn.addEventListener("click", function () { pick(i); });
      optsEl.appendChild(btn);
    });

    fbEl.hidden = true;
    fbEl.textContent = "";
    nextBtn.hidden = true;
  }

  function pick(index) {
    if (locked || !current) return;
    locked = true;

    const card    = document.getElementById("fp-card");
    const optsEl  = document.getElementById("fp-options");
    const fbEl    = document.getElementById("fp-feedback");
    const nextBtn = document.getElementById("fp-next");

    const buttons = optsEl.querySelectorAll(".fp-option");
    const isRight = index === current.answer;

    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (i === current.answer) b.classList.add("is-correct");
      if (i === index && !isRight) b.classList.add("is-wrong");
      if (i === index) b.classList.add("is-chosen");
    });

    answered += 1;
    if (isRight) {
      correct += 1;
      streak += 1;
      if (streak > bestStreak) bestStreak = streak;
      card.classList.add("answered", "answered-correct");
      fbEl.className = "fp-feedback correct";
      fbEl.innerHTML =
        "<strong>Correct! </strong>" + escapeHtml(current.explain);
    } else {
      streak = 0;
      card.classList.add("answered", "answered-wrong");
      fbEl.className = "fp-feedback wrong";
      fbEl.innerHTML =
        "<strong>Not quite. </strong>The correct answer was <em>" +
        escapeHtml(current.options[current.answer]) + "</em>. " +
        escapeHtml(current.explain);
    }
    fbEl.hidden = false;
    nextBtn.hidden = false;
    nextBtn.focus();

    if (window.ITBasics && window.ITBasics.getSession()) {
      window.ITBasics.saveAttempt("freeplay", isRight ? 1 : 0, 1, {
        id: current.id, topic: current.topic, difficulty: current.difficulty
      });
    }

    updateStats();
  }

  function skip() {
    if (locked) return;
    streak = 0;
    updateStats();
    nextQuestion();
  }

  function updateStats() {
    document.getElementById("fp-score").textContent =
      "Score: " + correct + " / " + answered;
    const streakEl = document.getElementById("fp-streak");
    streakEl.textContent = "Streak: " + streak;
    streakEl.classList.toggle("hot", streak >= 3);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function bindFilter() {
    const tabs = document.querySelectorAll(".fp-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        topicFilter = tab.dataset.filter;
        refillPool();
        nextQuestion();
      });
    });
  }

  function bindActions() {
    document.getElementById("fp-skip").addEventListener("click", skip);
    document.getElementById("fp-next").addEventListener("click", nextQuestion);

    // Keyboard: 1-4 picks an option, Enter/Space advances on the Next button.
    document.addEventListener("keydown", function (e) {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      const k = e.key;
      if (!locked && /^[1-4]$/.test(k)) {
        e.preventDefault();
        pick(parseInt(k, 10) - 1);
      } else if (locked && (k === "Enter" || k === " ")) {
        const next = document.getElementById("fp-next");
        if (next && !next.hidden) { e.preventDefault(); nextQuestion(); }
      } else if (k === "s" || k === "S") {
        e.preventDefault();
        if (!locked) skip();
      }
    });
  }

  function boot() {
    if (!all.length) {
      document.getElementById("fp-prompt").textContent =
        "Scenarios failed to load. Try refreshing.";
      return;
    }
    refillPool();
    bindFilter();
    bindActions();
    nextQuestion();
    updateStats();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
