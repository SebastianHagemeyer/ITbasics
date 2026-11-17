(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Year 9 Launch survey (/launch/).
  //
  // A separate little app that shares only the stylesheet and the Supabase
  // project with the IT site. It has its own roster (launch_roster), its own
  // answers table (launch_responses) and its own saved session, so signing in
  // here never signs anyone in to the IT site or the other way round.
  //
  // The browser never touches those tables directly. Everything goes through
  // the security definer functions in supabase-launch.sql, which is why the
  // overview needs a staff code and a student can only see their own answers.
  //
  // One sign-in box for everyone: a student code opens the survey, a staff
  // code opens the overview.
  // ---------------------------------------------------------------------------

  var SESSION_KEY = "launch-session";

  // The survey. Change the questions here; answers are stored as JSON keyed
  // by id, so adding or rewording a question needs no database change.
  // showIf hides a question unless an earlier answer matches.
  // other names the option that opens a short "which one?" box.
  // short is the column heading on the overview.
  // img is the cartoon shown beside the question (launch/img/).
  // type "text" is a written answer instead of buttons; optional ones can be
  // left blank, and minWords only applies once they start writing.
  var QUESTIONS = [
    { id: "academy", short: "Academy", img: "q1-academy.svg",
      text: "Do you want to join the Sports Academy in Year 10?",
      options: ["Yes", "No"] },
    { id: "sport", short: "Sport", img: "q2-sports.svg",
      text: "What is your favourite sport?",
      options: ["Rugby League", "Basketball", "Netball", "AFL", "Soccer", "Other"],
      other: "Other" },
    { id: "pro", short: "Go pro", img: "q3-pro.svg",
      text: "Do you want to play sport professionally?",
      options: ["Yes", "No"] },
    { id: "train", short: "Train daily", img: "q4-train-daily.svg",
      text: "If yes, would you be willing to train every day, i.e. before school or after school?",
      options: ["Yes", "No"],
      showIf: { id: "pro", value: "Yes" } },
    { id: "gymbefore", short: "Done gym", img: "q5-gym.svg",
      text: "Have you ever done gym or weights before?",
      options: ["Yes", "No"] },
    { id: "gymhard", short: "Gym hard", img: "q6-train-hard.svg",
      text: "Would you be willing to train hard in the gym if it was put on?",
      options: ["Yes", "No"] },
    { id: "goals", short: "Goals", img: "q7-goals.svg",
      type: "text", optional: true, minWords: 10, maxLength: 600,
      text: "What do you want to get out of Year 9 Launch sport?",
      hint: "If you answer, use 10 words or more." }
  ];

  var IMG_DIR = "/launch/img/";

  function isText(q) { return q.type === "text"; }

  function wordCount(s) {
    return String(s || "").trim().split(/\s+/).filter(Boolean).length;
  }

  var db = null;
  var me = null;          // the signed-in row from launch_signin
  var staffRows = [];     // overview data
  var pendingImport = []; // parsed rows waiting for "Add these students"

  function el(id) { return document.getElementById(id); }

  function show(id, on) { el(id).hidden = !on; }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function msg(id, text, isError) {
    var m = el(id);
    m.textContent = text || "";
    m.classList.toggle("error", !!isError);
  }

  function saveSession(code) {
    try {
      if (code) localStorage.setItem(SESSION_KEY, code);
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* private browsing: they just sign in again next time */ }
  }

  function loadSession() {
    try { return localStorage.getItem(SESSION_KEY) || ""; } catch (e) { return ""; }
  }

  function niceError(err) {
    var text = (err && (err.message || err.details)) || "";
    if (/Failed to fetch|NetworkError|network/i.test(text)) {
      return "Couldn't reach the database. Check your connection and try again.";
    }
    return text || "Something went wrong. Try again.";
  }

  function when(ts) {
    if (!ts) return "";
    var d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " " +
      d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function fullName(r) {
    return ((r.first_name || "") + " " + (r.last_name || "")).trim() || r.code;
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  function setView(view) {
    show("launch-signin", view === "signin");
    show("launch-survey", view === "survey");
    show("launch-done", view === "done");
    show("launch-staff", view === "staff");
    show("launch-who", view !== "signin");

    if (view === "staff") {
      el("launch-eyebrow").textContent = "Staff overview";
      el("launch-title").textContent = "Year 9 Launch: sport survey";
      el("launch-lead").textContent = "Live results from the Launch students. Filter by homegroup, see who still needs to answer, and download everything as CSV.";
    } else {
      el("launch-eyebrow").textContent = "Year 9 Launch";
      el("launch-title").textContent = "Sport survey";
      el("launch-lead").textContent = view === "signin"
        ? "Six quick questions about sport in Year 10, plus one optional one. Sign in with your student code to start."
        : "Six quick questions about sport in Year 10, plus one optional one at the end.";
    }
    if (me) el("launch-who-name").textContent = fullName(me);
  }

  function enterAs(row) {
    me = row;
    saveSession(row.code);
    if (row.role === "staff") {
      setView("staff");
      loadOverview();
    } else if (row.answers && row.updated_at) {
      showDone();
    } else {
      renderSurvey(row.answers || {});
      setView("survey");
    }
  }

  function signOut() {
    me = null;
    staffRows = [];
    saveSession("");
    el("launch-code").value = "";
    msg("launch-signin-msg", "");
    setView("signin");
    el("launch-code").focus();
  }

  // ---------------------------------------------------------------------------
  // Sign in
  // ---------------------------------------------------------------------------

  function signIn(code, quiet) {
    code = String(code || "").trim().toUpperCase();
    if (!code) {
      msg("launch-signin-msg", "Type your code first.", true);
      return Promise.resolve();
    }
    el("launch-signin-go").disabled = true;
    if (!quiet) msg("launch-signin-msg", "Checking...");
    return db.rpc("launch_signin", { p_code: code }).then(function (res) {
      el("launch-signin-go").disabled = false;
      if (res.error) throw res.error;
      var row = res.data && res.data[0];
      if (!row) {
        saveSession("");
        setView("signin");
        if (!quiet) msg("launch-signin-msg", "That code isn't on the Launch list. Check it, or ask your teacher.", true);
        return;
      }
      msg("launch-signin-msg", "");
      enterAs(row);
    }).catch(function (err) {
      el("launch-signin-go").disabled = false;
      setView("signin");
      msg("launch-signin-msg", niceError(err), true);
    });
  }

  // ---------------------------------------------------------------------------
  // Student survey
  // ---------------------------------------------------------------------------

  function renderSurvey(answers) {
    var html = QUESTIONS.map(function (q, i) {
      var input;
      if (isText(q)) {
        input = '<p class="launch-hint" id="q-' + q.id + '-hint">' + escapeHtml(q.hint || "") + '</p>' +
          '<textarea class="auth-input launch-text" id="q-' + q.id + '" rows="4" maxlength="' + (q.maxLength || 600) + '" ' +
          'aria-describedby="q-' + q.id + '-hint q-' + q.id + '-count" ' +
          'placeholder="Write your answer here...">' + escapeHtml(answers[q.id] || "") + '</textarea>' +
          '<p class="launch-count" id="q-' + q.id + '-count" aria-live="polite"></p>';
      } else {
        var opts = q.options.map(function (o) {
          var checked = answers[q.id] === o ? " checked" : "";
          return '<label class="launch-opt"><input type="radio" name="q-' + q.id + '" value="' +
            escapeHtml(o) + '"' + checked + ' /><span>' + escapeHtml(o) + '</span></label>';
        }).join("");
        input = '<div class="launch-opts">' + opts + '</div>';
        if (q.other) {
          input += '<input type="text" class="auth-input launch-other" id="q-' + q.id + '-other" maxlength="40" ' +
            'placeholder="Which sport?" value="' + escapeHtml(answers[q.id + "_other"] || "") + '" hidden />';
        }
      }
      var img = q.img
        ? '<img class="launch-qimg" src="' + IMG_DIR + q.img + '" alt="" width="600" height="400" loading="lazy" />'
        : "";
      return '<fieldset class="launch-card launch-q' + (isText(q) ? " launch-q-text" : "") + '" id="fs-' + q.id + '">' +
        '<legend><span class="launch-qnum">' + (i + 1) + '</span><span>' + escapeHtml(q.text) +
        (q.optional ? ' <em class="launch-optional">(optional)</em>' : "") + '</span></legend>' +
        '<div class="launch-q-body"><div class="launch-q-input">' + input + '</div>' + img + '</div>' +
        '</fieldset>';
    }).join("");
    el("launch-questions").innerHTML = html;
    msg("launch-submit-msg", "");
    refreshSurvey();
  }

  // Live word count under a written answer, so they can see when they have
  // reached the minimum.
  function refreshCount(q) {
    var box = el("q-" + q.id);
    var out = el("q-" + q.id + "-count");
    if (!box || !out) return;
    var n = wordCount(box.value);
    var need = q.minWords || 0;
    out.textContent = n === 0
      ? (q.optional ? "" : "0 words")
      : n + (n === 1 ? " word" : " words") + (need && n < need ? " (" + (need - n) + " more to go)" : need ? ", nice." : "");
    out.classList.toggle("is-short", !!(need && n > 0 && n < need));
  }

  function currentAnswer(id) {
    var picked = document.querySelector('input[name="q-' + id + '"]:checked');
    return picked ? picked.value : "";
  }

  // Show or hide conditional questions and the "Other" box to match the
  // answers so far, and keep the numbering continuous.
  function refreshSurvey() {
    var n = 0;
    QUESTIONS.forEach(function (q) {
      var visible = !q.showIf || currentAnswer(q.showIf.id) === q.showIf.value;
      var fs = el("fs-" + q.id);
      fs.hidden = !visible;
      if (visible) {
        n += 1;
        fs.querySelector(".launch-qnum").textContent = n;
      }
      if (q.other) {
        el("q-" + q.id + "-other").hidden = !(visible && currentAnswer(q.id) === q.other);
      }
      if (isText(q)) refreshCount(q);
    });
  }

  // missing: questions that need an answer. short: written answers that were
  // started but have not reached their minimum word count.
  function collectAnswers() {
    var answers = {};
    var missing = [];
    var short = [];
    QUESTIONS.forEach(function (q) {
      if (el("fs-" + q.id).hidden) return;
      if (isText(q)) {
        var text = el("q-" + q.id).value.trim().replace(/\s+/g, " ");
        if (!text) { if (!q.optional) missing.push(q); return; }
        if (q.minWords && wordCount(text) < q.minWords) { short.push(q); return; }
        answers[q.id] = text.slice(0, q.maxLength || 600);
        return;
      }
      var a = currentAnswer(q.id);
      if (!a) { missing.push(q); return; }
      answers[q.id] = a;
      if (q.other && a === q.other) {
        var typed = el("q-" + q.id + "-other").value.trim();
        if (typed) answers[q.id + "_other"] = typed;
      }
    });
    return { answers: answers, missing: missing, short: short };
  }

  function submitSurvey(e) {
    e.preventDefault();
    var got = collectAnswers();
    document.querySelectorAll(".launch-q.is-missing").forEach(function (fs) {
      fs.classList.remove("is-missing");
    });
    var flagged = got.missing.concat(got.short);
    if (flagged.length) {
      flagged.forEach(function (q) { el("fs-" + q.id).classList.add("is-missing"); });
      el("fs-" + flagged[0].id).scrollIntoView({ behavior: "smooth", block: "center" });
      var parts = [];
      if (got.missing.length) {
        parts.push(got.missing.length === 1
          ? "One question still needs an answer."
          : got.missing.length + " questions still need an answer.");
      }
      got.short.forEach(function (q) {
        parts.push("Your last answer needs " + q.minWords + " words or more, or leave it blank.");
      });
      msg("launch-submit-msg", parts.join(" "), true);
      return;
    }
    el("launch-submit").disabled = true;
    msg("launch-submit-msg", "Saving...");
    db.rpc("launch_submit", { p_code: me.code, p_answers: got.answers }).then(function (res) {
      el("launch-submit").disabled = false;
      if (res.error) throw res.error;
      me.answers = got.answers;
      me.updated_at = res.data;
      showDone();
    }).catch(function (err) {
      el("launch-submit").disabled = false;
      msg("launch-submit-msg", niceError(err), true);
    });
  }

  function showDone() {
    el("launch-done-when").textContent = "Your answers were saved " + when(me.updated_at) +
      ". You can change them any time by signing in again.";
    setView("done");
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------------------
  // Staff overview
  // ---------------------------------------------------------------------------

  function loadOverview() {
    msg("launch-staff-msg", "Loading...");
    return db.rpc("launch_overview", { p_staff: me.code }).then(function (res) {
      if (res.error) throw res.error;
      staffRows = res.data || [];
      msg("launch-staff-msg", "");
      fillHomegroups();
      renderStaff();
    }).catch(function (err) {
      msg("launch-staff-msg", niceError(err), true);
    });
  }

  function fillHomegroups() {
    var sel = el("launch-hg");
    var keep = sel.value;
    var groups = {};
    staffRows.forEach(function (r) { groups[r.homegroup || "(none)"] = true; });
    var names = Object.keys(groups).sort();
    sel.innerHTML = '<option value="">All homegroups</option>' + names.map(function (g) {
      return '<option value="' + escapeHtml(g) + '">' + escapeHtml(g) + '</option>';
    }).join("");
    if (keep && groups[keep]) sel.value = keep;
  }

  function inGroup(r) {
    var g = el("launch-hg").value;
    return !g || (r.homegroup || "(none)") === g;
  }

  function answered(r) { return !!(r.answers && r.updated_at); }

  function filteredRows() {
    var show = el("launch-show").value;
    return staffRows.filter(function (r) {
      if (!inGroup(r)) return false;
      if (show === "answered") return answered(r);
      if (show === "missing") return !answered(r);
      if (show === "academy") return answered(r) && r.answers.academy === "Yes";
      return true;
    });
  }

  function answerText(r, q) {
    if (!answered(r)) return "";
    var a = r.answers[q.id] || "";
    if (q.other && a === q.other && r.answers[q.id + "_other"]) {
      a = q.other + ": " + r.answers[q.id + "_other"];
    }
    return a;
  }

  function renderStaff() {
    var group = staffRows.filter(inGroup);
    var done = group.filter(answered);
    var academy = done.filter(function (r) { return r.answers.academy === "Yes"; });

    el("launch-stats").innerHTML = [
      ["On the list", group.length],
      ["Answered", done.length],
      ["Still to answer", group.length - done.length],
      ["Want the Academy", academy.length]
    ].map(function (s) {
      return '<div class="launch-stat"><span class="launch-stat-num">' + s[1] +
        '</span><span class="launch-stat-label">' + s[0] + '</span></div>';
    }).join("");

    renderSummary(done);
    renderTable(filteredRows());
  }

  function renderSummary(done) {
    var g = el("launch-hg").value;
    el("launch-summary-sub").textContent = done.length
      ? "From the " + done.length + " student" + (done.length === 1 ? "" : "s") + " who have answered" +
        (g ? " in " + g : "") + "."
      : "Nobody has answered yet" + (g ? " in " + g : "") + ".";
    el("launch-summary").innerHTML = done.length ? QUESTIONS.map(function (q) {
      var asked = done.filter(function (r) { return r.answers[q.id]; });
      if (isText(q)) {
        var items = asked.map(function (r) {
          return '<li><strong>' + escapeHtml(fullName(r)) + '</strong>' +
            (r.homegroup ? ' <span class="launch-hg-tag">' + escapeHtml(r.homegroup) + '</span>' : "") +
            '<span class="launch-said">' + escapeHtml(r.answers[q.id]) + '</span></li>';
        }).join("");
        return '<div class="launch-card launch-sum launch-sum-text">' +
          '<h3>' + escapeHtml(q.text) + '</h3>' +
          '<p class="launch-note">' + asked.length + ' of ' + done.length + ' wrote an answer' +
          (q.optional ? ' (optional question)' : '') + '.</p>' +
          (items ? '<ul class="launch-said-list">' + items + '</ul>' : "") + '</div>';
      }
      var bars = q.options.map(function (o) {
        var n = asked.filter(function (r) { return r.answers[q.id] === o; }).length;
        var pct = asked.length ? Math.round((n / asked.length) * 100) : 0;
        return '<div class="launch-bar-row">' +
          '<span class="launch-bar-label">' + escapeHtml(o) + '</span>' +
          '<span class="launch-bar"><span class="launch-bar-fill" style="width:' + pct + '%"></span></span>' +
          '<span class="launch-bar-num">' + n + ' <small>(' + pct + '%)</small></span>' +
          '</div>';
      }).join("");
      var extra = "";
      if (q.other) {
        var typed = asked.map(function (r) { return r.answers[q.id + "_other"]; }).filter(Boolean);
        if (typed.length) extra = '<p class="launch-other-list">Other: ' + escapeHtml(typed.join(", ")) + '</p>';
      }
      var note = q.showIf ? '<p class="launch-note">Only asked if they answered ' + escapeHtml(q.showIf.value) +
        ' to "' + escapeHtml(byId(q.showIf.id).short) + '" (' + asked.length + ' answered).</p>' : "";
      return '<div class="launch-card launch-sum">' +
        '<h3>' + escapeHtml(q.text) + '</h3>' + bars + extra + note + '</div>';
    }).join("") : "";
  }

  function byId(id) {
    for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].id === id) return QUESTIONS[i];
    return { short: id };
  }

  function renderTable(rows) {
    el("launch-head").innerHTML = "<tr><th>Name</th><th>Homegroup</th><th>Code</th>" +
      QUESTIONS.map(function (q) { return '<th title="' + escapeHtml(q.text) + '">' + escapeHtml(q.short) + "</th>"; }).join("") +
      "<th>Answered</th><th></th></tr>";
    if (!rows.length) {
      el("launch-body").innerHTML = '<tr><td colspan="' + (QUESTIONS.length + 5) + '" class="launch-empty">' +
        (staffRows.length ? "Nobody matches this filter." : "No students on the list yet. Add them from the class list below.") +
        "</td></tr>";
      return;
    }
    el("launch-body").innerHTML = rows.map(function (r) {
      var cells = QUESTIONS.map(function (q) {
        var a = answerText(r, q);
        if (isText(q)) {
          var cut = a.length > 48 ? a.slice(0, 46).replace(/\s+\S*$/, "") + "..." : a;
          return '<td class="launch-text-cell" title="' + escapeHtml(a) + '">' + escapeHtml(cut) + "</td>";
        }
        var cls = a === "Yes" ? ' class="launch-yes"' : a === "No" ? ' class="launch-no"' : "";
        return "<td" + cls + ">" + escapeHtml(a || (answered(r) ? "-" : "")) + "</td>";
      }).join("");
      return '<tr class="' + (answered(r) ? "" : "launch-row-missing") + '">' +
        "<td>" + escapeHtml(fullName(r)) + "</td>" +
        "<td>" + escapeHtml(r.homegroup) + "</td>" +
        "<td><code>" + escapeHtml(r.code) + "</code></td>" + cells +
        "<td>" + (answered(r) ? escapeHtml(when(r.updated_at)) : "Not yet") + "</td>" +
        '<td><button type="button" class="launch-remove" data-code="' + escapeHtml(r.code) +
        '" title="Take off the Launch list" aria-label="Remove ' + escapeHtml(fullName(r)) + '">&times;</button></td>' +
        "</tr>";
    }).join("");
  }

  function removeStudent(code) {
    var r = staffRows.filter(function (x) { return x.code === code; })[0];
    if (!r) return;
    var warn = "Take " + fullName(r) + " (" + code + ") off the Launch list?" +
      (answered(r) ? "\n\nTheir survey answers will be deleted too." : "");
    if (!window.confirm(warn)) return;
    db.rpc("launch_remove_student", { p_staff: me.code, p_code: code }).then(function (res) {
      if (res.error) throw res.error;
      return loadOverview();
    }).catch(function (err) {
      msg("launch-staff-msg", niceError(err), true);
    });
  }

  function csvCell(v) {
    v = String(v == null ? "" : v);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }

  function downloadCsv() {
    var rows = filteredRows();
    var head = ["Code", "First name", "Surname", "Homegroup"]
      .concat(QUESTIONS.map(function (q) { return q.text; }))
      .concat(["Answered at"]);
    var lines = [head.map(csvCell).join(",")].concat(rows.map(function (r) {
      return [r.code, r.first_name, r.last_name, r.homegroup]
        .concat(QUESTIONS.map(function (q) { return answerText(r, q); }))
        .concat([r.updated_at ? new Date(r.updated_at).toISOString() : ""])
        .map(csvCell).join(",");
    }));
    var blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    var g = el("launch-hg").value;
    a.href = URL.createObjectURL(blob);
    a.download = "year9-launch-survey" + (g ? "-" + g.replace(/[^A-Za-z0-9]+/g, "") : "") + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  // ---------------------------------------------------------------------------
  // Staff: add students from a pasted class list
  // ---------------------------------------------------------------------------

  // Which header words mean which field. Matched against a lowercased header
  // cell with spaces and punctuation stripped.
  var HEADER_WORDS = {
    code: ["code", "studentcode", "id", "studentid", "username", "student", "studentnumber", "idnumber"],
    first_name: ["first", "firstname", "givenname", "given", "preferredname", "preferred", "firstnames"],
    last_name: ["last", "lastname", "surname", "familyname", "family"],
    homegroup: ["homegroup", "hg", "form", "formgroup", "rollclass", "roll", "class", "group", "house"],
    name: ["name", "fullname", "studentname"]
  };

  function headerField(cell) {
    var key = String(cell).toLowerCase().replace(/[^a-z]/g, "");
    for (var field in HEADER_WORDS) {
      if (HEADER_WORDS[field].indexOf(key) !== -1) return field;
    }
    return "";
  }

  function looksLikeCode(v) { return /^[A-Za-z]{2,4}\d{2,5}$/.test(String(v).trim()); }

  function splitLine(line) {
    // Excel pastes tab-separated; fall back to commas for a CSV.
    if (line.indexOf("\t") !== -1) return line.split("\t");
    return line.split(",");
  }

  function parseClassList(text) {
    var lines = text.split(/\r?\n/).map(function (l) { return l.replace(/\s+$/, ""); })
      .filter(function (l) { return l.trim(); });
    if (!lines.length) return { rows: [], skipped: [] };
    var grid = lines.map(function (l) { return splitLine(l).map(function (c) { return c.trim(); }); });

    // A header row is a first row with no code in it and at least one cell we
    // recognise. Otherwise assume Code, First name, Surname, Homegroup.
    var map = null;
    var first = grid[0];
    if (!first.some(looksLikeCode)) {
      var guess = {};
      first.forEach(function (c, i) {
        var f = headerField(c);
        if (f && guess[f] === undefined) guess[f] = i;
      });
      if (Object.keys(guess).length) { map = guess; grid = grid.slice(1); }
    }
    if (!map) map = { code: 0, first_name: 1, last_name: 2, homegroup: 3 };

    var rows = [];
    var skipped = [];
    var seen = {};
    grid.forEach(function (cells, i) {
      var code = map.code !== undefined ? cells[map.code] : "";
      // No code column header we recognised: use whichever cell looks like one.
      if (!looksLikeCode(code || "")) {
        var hit = cells.filter(looksLikeCode)[0];
        if (hit) code = hit;
      }
      code = String(code || "").trim().toUpperCase();
      var firstName = map.first_name !== undefined ? cells[map.first_name] || "" : "";
      var lastName = map.last_name !== undefined ? cells[map.last_name] || "" : "";
      if (!firstName && !lastName && map.name !== undefined) {
        var full = cells[map.name] || "";
        if (full.indexOf(",") !== -1) {        // "Surname, First"
          lastName = full.split(",")[0].trim();
          firstName = full.split(",").slice(1).join(",").trim();
        } else {                                // "First Surname"
          var parts = full.trim().split(/\s+/);
          lastName = parts.length > 1 ? parts.pop() : "";
          firstName = parts.join(" ");
        }
      }
      var homegroup = map.homegroup !== undefined ? cells[map.homegroup] || "" : "";
      if (!/^[A-Z0-9]{3,20}$/.test(code)) {
        skipped.push(lines[i + (lines.length - grid.length)]);
        return;
      }
      if (seen[code]) return;
      seen[code] = true;
      rows.push({ code: code, first_name: firstName, last_name: lastName, homegroup: homegroup.toUpperCase() });
    });
    return { rows: rows, skipped: skipped };
  }

  function previewImport() {
    var parsed = parseClassList(el("launch-paste").value);
    pendingImport = parsed.rows;
    el("launch-import").disabled = !pendingImport.length;
    var existing = {};
    staffRows.forEach(function (r) { existing[r.code] = true; });
    var fresh = pendingImport.filter(function (r) { return !existing[r.code]; }).length;

    if (!pendingImport.length) {
      msg("launch-add-msg", "Couldn't find any student codes in that. Check the columns.", true);
      el("launch-add-preview").innerHTML = "";
      return;
    }
    msg("launch-add-msg", pendingImport.length + " students found: " + fresh + " new, " +
      (pendingImport.length - fresh) + " already on the list." +
      (parsed.skipped.length ? " " + parsed.skipped.length + " line(s) skipped (no code)." : ""));
    el("launch-add-preview").innerHTML = '<div class="table-wrap"><table class="data-table launch-table">' +
      "<thead><tr><th>Code</th><th>First name</th><th>Surname</th><th>Homegroup</th><th></th></tr></thead><tbody>" +
      pendingImport.slice(0, 400).map(function (r) {
        return "<tr><td><code>" + escapeHtml(r.code) + "</code></td><td>" + escapeHtml(r.first_name) +
          "</td><td>" + escapeHtml(r.last_name) + "</td><td>" + escapeHtml(r.homegroup) + "</td><td>" +
          (existing[r.code] ? "update" : "new") + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      (parsed.skipped.length ? '<p class="launch-note">Skipped: ' + escapeHtml(parsed.skipped.slice(0, 5).join(" | ")) +
        (parsed.skipped.length > 5 ? " ..." : "") + "</p>" : "");
  }

  function runImport() {
    if (!pendingImport.length) return;
    el("launch-import").disabled = true;
    msg("launch-add-msg", "Adding...");
    db.rpc("launch_add_students", { p_staff: me.code, p_rows: pendingImport }).then(function (res) {
      if (res.error) throw res.error;
      var n = res.data || 0;
      pendingImport = [];
      el("launch-paste").value = "";
      el("launch-add-preview").innerHTML = "";
      msg("launch-add-msg", n + " student" + (n === 1 ? "" : "s") + " added or updated.");
      return loadOverview();
    }).catch(function (err) {
      el("launch-import").disabled = false;
      msg("launch-add-msg", niceError(err), true);
    });
  }

  // ---------------------------------------------------------------------------
  // Start up
  // ---------------------------------------------------------------------------

  function init() {
    var url = window.SUPABASE_URL;
    var key = window.SUPABASE_ANON_KEY;
    if (!window.supabase || !url || !key || /YOUR_|PASTE/i.test(url)) {
      show("launch-offline", true);
      setView("signin");
      el("launch-signin-go").disabled = true;
      return;
    }
    db = window.supabase.createClient(url, key, {
      // This page keeps its own tiny session (just the code). Stop the client
      // from creating or reading a Supabase auth session in this browser.
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });

    el("launch-signin").addEventListener("submit", function (e) {
      e.preventDefault();
      signIn(el("launch-code").value);
    });
    el("launch-survey").addEventListener("submit", submitSurvey);
    el("launch-questions").addEventListener("change", function (e) {
      refreshSurvey();
      var fs = e.target.closest(".launch-q");
      if (fs) fs.classList.remove("is-missing");
    });
    el("launch-questions").addEventListener("input", function (e) {
      if (!e.target.matches("textarea.launch-text")) return;
      var q = byId(e.target.id.replace(/^q-/, ""));
      refreshCount(q);
      var fs = e.target.closest(".launch-q");
      if (fs && !(q.minWords && wordCount(e.target.value) > 0 && wordCount(e.target.value) < q.minWords)) {
        fs.classList.remove("is-missing");
      }
    });
    el("launch-edit").addEventListener("click", function () {
      renderSurvey(me.answers || {});
      setView("survey");
    });
    el("launch-signout").addEventListener("click", signOut);
    el("launch-done-signout").addEventListener("click", signOut);

    el("launch-hg").addEventListener("change", renderStaff);
    el("launch-show").addEventListener("change", renderStaff);
    el("launch-refresh").addEventListener("click", loadOverview);
    el("launch-csv").addEventListener("click", downloadCsv);
    el("launch-body").addEventListener("click", function (e) {
      var b = e.target.closest(".launch-remove");
      if (b) removeStudent(b.getAttribute("data-code"));
    });
    el("launch-preview").addEventListener("click", previewImport);
    el("launch-import").addEventListener("click", runImport);
    el("launch-paste").addEventListener("input", function () {
      pendingImport = [];
      el("launch-import").disabled = true;
    });

    var saved = loadSession();
    if (saved) {
      signIn(saved, true);
    } else {
      setView("signin");
      el("launch-code").focus();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
