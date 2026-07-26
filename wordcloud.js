(function () {
  "use strict";

  // Reusable class word cloud. Drop this onto any page:
  //   <div class="wordcloud" data-topic="binary"
  //        data-prompt="In one word, ..." data-placeholder="e.g. phone"></div>
  // and include this script (after app.js). It wires itself up.
  //
  // One word per student PER TOPIC: the row is keyed on (student_code, topic)
  // and upserted, so re-submitting replaces a student's word instead of adding
  // another. Shared via Supabase, with a localStorage fallback when offline.
  // Words are tied to the student code so a teacher can moderate them in the DB.

  var BANNED = ["fuck", "shit", "bitch", "cunt", "dick", "sex", "porn", "nigger", "fag"];

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function sanitizeWord(raw, allowSpaces) {
    var w = (raw || "").toLowerCase();
    // Tagged clouds accept short multi-word answers ("hard drive").
    w = allowSpaces
      ? w.replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim()
      : w.replace(/[^a-z0-9]/g, "");
    if (!w) return null;
    var max = allowSpaces ? 20 : 16;
    if (w.length > max) w = w.slice(0, max).trim();
    if (BANNED.some(function (b) { return w.indexOf(b) !== -1; })) return "__banned__";
    return w;
  }

  // Colours for tagged clouds (data-tags): one fixed colour per tag, so the
  // cloud doubles as a sorting exercise you can read at a glance.
  var TAG_COLORS = {
    input: "#1f9d55",
    output: "#ff7a59",
    storage: "#1C4587",
    processing: "#7c5cff"
  };

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function loadWords(topic) {
    if (window.ITBasics.isOnline()) {
      return window.ITBasics.client()
        .from("wordcloud").select("word").eq("topic", topic)
        .then(function (res) {
          if (res.error) return { error: res.error };
          return { words: (res.data || []).map(function (r) { return r.word; }) };
        });
    }
    var obj = {};
    try { obj = JSON.parse(localStorage.getItem("itbasics-wordcloud-" + topic) || "{}"); } catch (e) {}
    return Promise.resolve({ words: Object.keys(obj).map(function (k) { return obj[k]; }) });
  }

  function saveWord(topic, student, word) {
    if (window.ITBasics.isOnline()) {
      return window.ITBasics.client()
        .from("wordcloud").upsert(
          { student_code: student.code, topic: topic, word: word, updated_at: new Date().toISOString() },
          { onConflict: "student_code,topic" }
        )
        .then(function (res) { return { error: res.error }; });
    }
    var key = "itbasics-wordcloud-" + topic, obj = {};
    try { obj = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
    obj[student.code] = word;
    localStorage.setItem(key, JSON.stringify(obj));
    return Promise.resolve({ error: null });
  }

  function renderCloud(cloudEl, words, tagged) {
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
    // If a word is actually a colour - a hex code like ff0000, or a CSS colour
    // name like teal - paint the word that colour instead of a palette colour.
    var probe = document.createElement("span");
    function colourOf(word) {
      if (/^[0-9a-f]{3}$/.test(word) || /^[0-9a-f]{6}$/.test(word)) return "#" + word;
      if (word === "transparent") return null;
      probe.style.color = "";
      probe.style.color = word;
      return probe.style.color ? word : null;
    }
    entries.forEach(function (e, i) {
      var word = e.word;
      var tag = null;
      if (tagged) {
        // Tagged entries are stored as "word|tag"; the tag picks the colour.
        var parts = e.word.split("|");
        word = parts[0];
        tag = parts[1] || null;
      }
      var span = document.createElement("span");
      span.className = "wc-word";
      span.style.fontSize = (1 + (max > 1 ? (e.n - 1) / (max - 1) : 0) * 1.7).toFixed(2) + "rem";
      if (tagged) {
        span.style.color = TAG_COLORS[tag] || palette[i % palette.length];
        var bits = [];
        if (tag) bits.push(cap(tag));
        if (e.n > 1) bits.push(e.n + " students said this");
        if (bits.length) span.title = bits.join(" · ");
      } else {
        var col = colourOf(word);
        if (col) {
          span.classList.add("wc-color");
          span.style.color = col;
          span.style.setProperty("--wc-c", col);
        } else {
          span.style.color = palette[i % palette.length];
        }
        if (e.n > 1) span.title = e.n + " students said this";
      }
      span.textContent = word;
      cloudEl.appendChild(span);
    });
  }

  function initOne(root) {
    var topic = root.dataset.topic;
    if (!topic) return;
    var prompt = root.dataset.prompt || "In one word, what comes to mind?";
    var placeholder = root.dataset.placeholder || "your word";
    // data-tags="input,output,storage" makes a TAGGED cloud: a dropdown joins
    // the word box, entries save as "word|tag", and the tag picks the colour.
    var tags = (root.dataset.tags || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
    var tagged = tags.length > 0;

    var selectHtml = tagged
      ? '<select class="wordcloud-tag" aria-label="What kind of part is it?">' +
          tags.map(function (t) {
            return '<option value="' + escapeHtml(t) + '">' + escapeHtml(cap(t)) + "</option>";
          }).join("") +
        "</select>"
      : "";
    var legendHtml = tagged
      ? '<p class="wordcloud-legend">' +
          tags.map(function (t) {
            return '<span class="wc-legend-item"><span class="wc-legend-dot" style="background:' +
              (TAG_COLORS[t] || "#888") + '"></span>' + escapeHtml(cap(t)) + "</span>";
          }).join("") +
        "</p>"
      : "";

    root.innerHTML =
      '<p class="wordcloud-prompt">' + escapeHtml(prompt) + '</p>' +
      '<form class="wordcloud-form" autocomplete="off">' +
        '<input type="text" maxlength="' + (tagged ? 20 : 16) + '" placeholder="' + escapeHtml(placeholder) + '" aria-label="Your word" />' +
        selectHtml +
        '<button type="submit" class="btn btn-primary">Add my word</button>' +
        '<span class="wordcloud-msg" role="status"></span>' +
      '</form>' +
      legendHtml +
      '<div class="wordcloud-cloud" aria-live="polite"><p class="wordcloud-empty">Loading…</p></div>';

    var form = root.querySelector(".wordcloud-form");
    var input = root.querySelector("input");
    var tagSel = root.querySelector(".wordcloud-tag");
    var msg = root.querySelector(".wordcloud-msg");
    var cloud = root.querySelector(".wordcloud-cloud");
    var student = window.ITBasics.getSession();

    function refresh() {
      loadWords(topic).then(function (res) {
        if (res.error) {
          cloud.innerHTML = '<p class="wordcloud-empty">The class word cloud needs the database. Ask your teacher to run the setup SQL.</p>';
          return;
        }
        renderCloud(cloud, res.words, tagged);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "";
      msg.className = "wordcloud-msg";
      var word = sanitizeWord(input.value, tagged);
      if (!word) { msg.textContent = "Type a word (letters or numbers)."; msg.classList.add("error"); return; }
      if (word === "__banned__") { msg.textContent = "Let's keep it school-appropriate."; msg.classList.add("error"); return; }
      if (!student) { msg.textContent = "Sign in first to add a word."; msg.classList.add("error"); return; }
      var tag = tagged && tagSel ? tagSel.value : null;
      var stored = tagged ? word + "|" + tag : word;
      saveWord(topic, student, stored).then(function (res) {
        if (res.error) {
          msg.textContent = "Couldn't save your word. " + (res.error.message || "");
          msg.classList.add("error");
          return;
        }
        input.value = "";
        msg.textContent = "Added “" + word + (tag ? " (" + tag + ")" : "") + "”! You can change it any time.";
        refresh();
      });
    });

    refresh();
  }

  function boot() {
    if (!window.ITBasics) return;
    document.querySelectorAll(".wordcloud[data-topic]").forEach(initOne);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
