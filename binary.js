(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ------------------------------------------------------------------
  // Binary <-> decimal machine: eight clickable bit switches that stay
  // in sync with a 0-255 number box, both ways.
  // ------------------------------------------------------------------
  var PLACES = [128, 64, 32, 16, 8, 4, 2, 1];

  function initConverter() {
    var bitsWrap = document.getElementById("bitconv-bits");
    if (!bitsWrap) return;
    var sumEl = document.getElementById("bitconv-sum");
    var decEl = document.getElementById("bitconv-decimal");
    var input = document.getElementById("bitconv-input");
    var clearBtn = document.getElementById("bitconv-clear");
    var bits = [];

    PLACES.forEach(function (place) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "bit";
      b.setAttribute("aria-pressed", "false");
      b.dataset.value = place;
      b.innerHTML = '<span class="bit-place">' + place + '</span><span class="bit-digit">0</span>';
      b.addEventListener("click", function () {
        setBit(b, b.getAttribute("aria-pressed") !== "true");
        update();
      });
      bitsWrap.appendChild(b);
      bits.push(b);
    });

    function setBit(b, on) {
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("on", on);
      b.querySelector(".bit-digit").textContent = on ? "1" : "0";
    }

    function update() {
      var on = bits.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; });
      var total = on.reduce(function (s, b) { return s + Number(b.dataset.value); }, 0);
      decEl.textContent = total;
      sumEl.textContent = on.length ? on.map(function (b) { return b.dataset.value; }).join(" + ") : "0";
      // Don't fight the user's cursor while they're typing in the box.
      if (document.activeElement !== input) input.value = total;
    }

    function setFromDecimal(n) {
      n = Math.max(0, Math.min(255, Math.floor(n || 0)));
      bits.forEach(function (b) {
        var v = Number(b.dataset.value);
        setBit(b, (n & v) === v);
      });
      update();
    }

    input.addEventListener("input", function () {
      var n = parseInt(input.value, 10);
      if (!isNaN(n)) setFromDecimal(n);
    });
    clearBtn.addEventListener("click", function () {
      setFromDecimal(0);
      input.value = 0;
    });

    update();
  }

  // ------------------------------------------------------------------
  // Knowledge checks: Khan-style multiple choice with instant feedback.
  // Formative only (nothing is stored) - they're for self-checking.
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

  // ------------------------------------------------------------------
  // "Text is binary too": each letter -> its ASCII number -> 8-bit binary.
  // ------------------------------------------------------------------
  function initSecret() {
    var input = document.getElementById("secret-input");
    if (!input) return;
    var out = document.getElementById("secret-out");
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
          '<span class="secret-bin">' + code.toString(2).padStart(8, "0") + '</span>';
        out.appendChild(cell);
      }
    }
    input.addEventListener("input", render);
    render();
  }

  // ------------------------------------------------------------------
  // Class word cloud: one word per student per topic, shared via Supabase
  // (falls back to this browser's localStorage when offline). Words are
  // tied to the student code, so a teacher can moderate them in the DB.
  // ------------------------------------------------------------------
  var WC_TOPIC = "binary";
  var BANNED = ["fuck", "shit", "bitch", "cunt", "dick", "sex", "porn", "nigger", "fag"];

  function sanitizeWord(raw) {
    var w = (raw || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!w) return null;
    if (w.length > 16) w = w.slice(0, 16);
    if (BANNED.some(function (b) { return w.indexOf(b) !== -1; })) return "__banned__";
    return w;
  }

  function loadWords() {
    if (window.ITBasics.isOnline()) {
      return window.ITBasics.client()
        .from("wordcloud").select("word").eq("topic", WC_TOPIC)
        .then(function (res) {
          if (res.error) return { error: res.error };
          return { words: (res.data || []).map(function (r) { return r.word; }) };
        });
    }
    var obj = {};
    try { obj = JSON.parse(localStorage.getItem("itbasics-wordcloud-" + WC_TOPIC) || "{}"); } catch (e) {}
    return Promise.resolve({ words: Object.keys(obj).map(function (k) { return obj[k]; }) });
  }

  function saveWord(student, word) {
    if (window.ITBasics.isOnline()) {
      return window.ITBasics.client()
        .from("wordcloud").upsert(
          { student_code: student.code, topic: WC_TOPIC, word: word, updated_at: new Date().toISOString() },
          { onConflict: "student_code,topic" }
        )
        .then(function (res) { return { error: res.error }; });
    }
    var key = "itbasics-wordcloud-" + WC_TOPIC, obj = {};
    try { obj = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
    obj[student.code] = word;
    localStorage.setItem(key, JSON.stringify(obj));
    return Promise.resolve({ error: null });
  }

  function renderCloud(cloudEl, words) {
    var counts = {};
    words.forEach(function (w) { counts[w] = (counts[w] || 0) + 1; });
    var entries = Object.keys(counts)
      .map(function (w) { return { word: w, n: counts[w] }; })
      .sort(function (a, b) { return b.n - a.n; });
    cloudEl.innerHTML = "";
    if (!entries.length) {
      cloudEl.innerHTML = '<p class="wordcloud-empty">No words yet. Be the first to add one!</p>';
      return;
    }
    var max = entries[0].n;
    var palette = ["#1C4587", "#7c5cff", "#2ec4b6", "#ff7a59", "#1f9d55", "#9900FF"];
    entries.forEach(function (e, i) {
      var span = document.createElement("span");
      span.className = "wc-word";
      var size = 1 + (max > 1 ? (e.n - 1) / (max - 1) : 0) * 1.7;
      span.style.fontSize = size.toFixed(2) + "rem";
      span.style.color = palette[i % palette.length];
      span.textContent = e.word;
      if (e.n > 1) span.title = e.n + " students said this";
      cloudEl.appendChild(span);
    });
  }

  function initWordCloud() {
    var form = document.getElementById("wordcloud-form");
    if (!form) return;
    var input = document.getElementById("wordcloud-input");
    var msg = document.getElementById("wordcloud-msg");
    var cloud = document.getElementById("wordcloud-cloud");
    var student = window.ITBasics.getSession();

    function refresh() {
      loadWords().then(function (res) {
        if (res.error) {
          cloud.innerHTML = '<p class="wordcloud-empty">The class word cloud needs the database. Ask your teacher to run the setup SQL.</p>';
          return;
        }
        renderCloud(cloud, res.words);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "";
      msg.className = "wordcloud-msg";
      var word = sanitizeWord(input.value);
      if (!word) { msg.textContent = "Type one word (letters or numbers)."; msg.classList.add("error"); return; }
      if (word === "__banned__") { msg.textContent = "Let's keep it school-appropriate."; msg.classList.add("error"); return; }
      if (!student) { msg.textContent = "Sign in first to add a word."; msg.classList.add("error"); return; }
      saveWord(student, word).then(function (res) {
        if (res.error) {
          msg.textContent = "Couldn't save your word. " + (res.error.message || "");
          msg.classList.add("error");
          return;
        }
        input.value = "";
        msg.textContent = "Added “" + word + "”! You can change it any time.";
        refresh();
      });
    });

    refresh();
  }

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    initConverter();
    initChecks();
    initSecret();
    initWordCloud();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
