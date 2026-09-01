/*
 * Assignments hub: one card per assignment with the student's submission
 * status. Add new assignments to the ASSIGNMENTS list (and give them a page
 * under /assignments/<key>/).
 */
(function () {
  "use strict";

  // Custom SVG pet icons (same art as the track picker on the task page).
  var ICON_DOG =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<path d="M20 15 C9 16 6 30 12 39 C15 31 19 25 26 21 Z" fill="#8a5a2b"/>' +
      '<path d="M44 15 C55 16 58 30 52 39 C49 31 45 25 38 21 Z" fill="#8a5a2b"/>' +
      '<circle cx="32" cy="33" r="20" fill="#d99a5b"/>' +
      '<circle cx="40" cy="28" r="6.5" fill="#8a5a2b" opacity="0.85"/>' +
      '<circle cx="24" cy="28" r="2.6" fill="#1a202c"/>' +
      '<circle cx="40" cy="28" r="2.6" fill="#1a202c"/>' +
      '<circle cx="24.9" cy="27.1" r="0.9" fill="#ffffff"/>' +
      '<circle cx="40.9" cy="27.1" r="0.9" fill="#ffffff"/>' +
      '<ellipse cx="32" cy="42.5" rx="11" ry="8.5" fill="#f3d4ae"/>' +
      '<ellipse cx="32" cy="39.5" rx="3.6" ry="2.8" fill="#3b2a1d"/>' +
      '<path d="M32 42 v3.2 M32 45.2 c-2 3 -5.2 3 -6.8 0.8 M32 45.2 c2 3 5.2 3 6.8 0.8" ' +
            'stroke="#3b2a1d" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M29.4 47.5 c0 4.4 5.2 4.4 5.2 0 v-1.6 h-5.2 Z" fill="#f27d93"/>' +
    '</svg>';
  var ICON_TURTLE =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<path d="M14 32 L5 27.5 L7.5 32 L5 36.5 Z" fill="#2f855a"/>' +
      '<ellipse cx="23" cy="16.5" rx="7" ry="4.5" transform="rotate(-35 23 16.5)" fill="#38a169"/>' +
      '<ellipse cx="41" cy="16.5" rx="7" ry="4.5" transform="rotate(35 41 16.5)" fill="#38a169"/>' +
      '<ellipse cx="23" cy="47.5" rx="7" ry="4.5" transform="rotate(35 23 47.5)" fill="#38a169"/>' +
      '<ellipse cx="41" cy="47.5" rx="7" ry="4.5" transform="rotate(-35 41 47.5)" fill="#38a169"/>' +
      '<circle cx="52" cy="32" r="7.5" fill="#48bb78"/>' +
      '<circle cx="55" cy="29.3" r="1.4" fill="#1a202c"/>' +
      '<circle cx="55" cy="34.7" r="1.4" fill="#1a202c"/>' +
      '<ellipse cx="30" cy="32" rx="18" ry="15" fill="#2e9e63" stroke="#1f7a4a" stroke-width="2"/>' +
      '<polygon points="30,24 37,28 37,36 30,40 23,36 23,28" fill="#3db878" stroke="#1f7a4a" stroke-width="1.5"/>' +
      '<path d="M30 24 L30 18 M37 28 L43.5 24.5 M37 36 L43.5 39.5 M30 40 L30 46 M23 36 L16.5 39.5 M23 28 L16.5 24.5" ' +
            'stroke="#1f7a4a" stroke-width="1.5" fill="none"/>' +
    '</svg>';

  var ICON_PIXEL =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect x="8"  y="8"  width="12" height="12" rx="2" fill="#FF4136"/>' +
      '<rect x="22" y="8"  width="12" height="12" rx="2" fill="#FFDC00"/>' +
      '<rect x="36" y="8"  width="12" height="12" rx="2" fill="#2ECC40"/>' +
      '<rect x="8"  y="22" width="12" height="12" rx="2" fill="#0074D9"/>' +
      '<rect x="22" y="22" width="12" height="12" rx="2" fill="#B10DC9"/>' +
      '<rect x="36" y="22" width="12" height="12" rx="2" fill="#FF851B"/>' +
      '<rect x="8"  y="36" width="12" height="12" rx="2" fill="#39CCCC"/>' +
      '<rect x="22" y="36" width="12" height="12" rx="2" fill="#F012BE"/>' +
      '<rect x="36" y="36" width="12" height="12" rx="2" fill="#1C4587"/>' +
    '</svg>';

  // A symmetric gamepad: darker base behind, lighter body on top, with a white
  // D-pad on the left and four coloured buttons on the right.
  var GAMEPAD_BODY =
    'M24 24 H40 C48 24 53 29 54.5 37 L56 45 C56.8 50 53 53.5 48.5 52 ' +
    'C45 51 42.5 48.5 41 46 L39.5 43.5 H24.5 L23 46 C21.5 48.5 19 51 15.5 52 ' +
    'C11 53.5 7.2 50 8 45 L9.5 37 C11 29 16 24 24 24 Z';
  var ICON_GAMEPAD =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<path d="' + GAMEPAD_BODY + '" transform="translate(0 2.4)" fill="#5a3fd6"/>' +
      '<path d="' + GAMEPAD_BODY + '" fill="#7c5cff"/>' +
      '<rect x="16.8" y="32" width="4.4" height="12" rx="2.2" fill="#eef0ff"/>' +
      '<rect x="13" y="35.8" width="12" height="4.4" rx="2.2" fill="#eef0ff"/>' +
      '<circle cx="45" cy="33" r="3" fill="#ff5d6c"/>' +
      '<circle cx="50" cy="38" r="3" fill="#ffd35e"/>' +
      '<circle cx="45" cy="43" r="3" fill="#4fd18b"/>' +
      '<circle cx="40" cy="38" r="3" fill="#4db5ff"/>' +
    '</svg>';

  var ICON_GUESS =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<rect x="8" y="8" width="48" height="48" rx="12" fill="#1f9d55"/>' +
      '<text x="32" y="46" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" ' +
            'font-size="40" font-weight="bold" fill="#ffffff">?</text>' +
    '</svg>';

  var ASSIGNMENTS = [
    {
      key: "petprogram",
      title: "Task 1 · My First Program: The Pet Project",
      href: "/assignments/pet-program/",
      icon: ICON_DOG + ICON_TURTLE,
      desc: "Build your first real Python program, step by step: a Pet Age Calculator that asks for " +
            "a pet's age and works out how old it is in pet years, then keeps serving customers until " +
            "someone quits.",
      marks: 11
    },
    {
      key: "numberguess",
      title: "Task 2 · The Number Guesser",
      href: "/assignments/number-guess/",
      icon: ICON_GUESS,
      desc: "The computer hides a number from 1 to 10 and the player keeps guessing until they " +
            "get it right. No starter code: you write the whole thing yourself, then a robot " +
            "playtests it.",
      marks: 6
    },
    {
      key: "pixelart",
      title: "Task 3 · Pixel Painter: Pictures Are Data",
      href: "/assignments/pixel-painter/",
      icon: ICON_PIXEL,
      desc: "Every image is secretly a grid of numbers. Store your own drawing as pure data, " +
            "build a colour palette with hex codes, and write the loop that paints it.",
      marks: 11
    },
    {
      key: "gamemaker",
      title: "Task 4 · Make Your Own Game",
      href: "/assignments/game-maker/",
      icon: ICON_GAMEPAD,
      desc: "Build your own game on the Hallam engine, from a template or from scratch, " +
            "then publish it to your class Game Gallery for everyone to play.",
      open: true,
      // Matches data-xp-min on the task page and the gallery. Kept here as
      // well so the card says so before anyone clicks through to find out.
      minLevel: 3
    }
  ];

  var TRACK_NAMES = { calc: "Pet Age Calculator", turtle: "Pet Turtle" };

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // One assignment_progress row per student per assignment now holds
  // everything: the live state plus submitted_at (the "ready to grade" flag).
  // A row with submitted_at set = submitted; a row without = started.
  async function loadSubmissions(student) {
    var byKey = {};
    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      var res = await sb.from("assignment_progress")
        .select("*")
        .eq("student_code", student.code);
      if (!res.error && res.data) {
        res.data.forEach(function (r) { byKey[r.assignment] = r; });
      }
    }
    return byKey;
  }

  function card(a, sub) {
    var status, cls;
    if (sub && sub.submitted_at) {
      var date = new Date(sub.submitted_at);
      var track = sub.state && sub.state.track;
      status = "&#10003; Submitted" +
        (track ? " &middot; " + escapeHtml(TRACK_NAMES[track] || track) : "") +
        (isNaN(date) ? "" : " &middot; " + escapeHtml(date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })));
      cls = "done";
    } else if (sub) {
      status = "In progress";
      cls = "todo";
    } else {
      status = "Not started yet";
      cls = "todo";
    }
    return (
      '<a class="assignment-card ' + cls + '" href="' + a.href + '">' +
        '<span class="assignment-icon" aria-hidden="true">' + a.icon + '</span>' +
        '<span class="assignment-body">' +
          '<span class="assignment-title">' + escapeHtml(a.title) + '</span>' +
          '<span class="assignment-desc">' + escapeHtml(a.desc) + '</span>' +
        '</span>' +
        '<span class="assignment-side">' +
          '<span class="assignment-status ' + cls + '">' + status + '</span>' +
          '<span class="assignment-marks">' + a.marks + ' marks</span>' +
        '</span>' +
      '</a>'
    );
  }

  // Open tasks (like "Make your own game") are not graded through
  // assignment_progress; their status just reflects whether the student has
  // published anything to the gallery.
  function openCard(a, count) {
    var done = count > 0;
    var status = done
      ? "&#10003; Published " + count + (count === 1 ? " game" : " games")
      : "Build &amp; publish";
    var cls = done ? "done" : "todo";
    return (
      '<a class="assignment-card ' + cls + '" href="' + a.href + '">' +
        '<span class="assignment-icon" aria-hidden="true">' + a.icon + '</span>' +
        '<span class="assignment-body">' +
          '<span class="assignment-title">' + escapeHtml(a.title) + '</span>' +
          '<span class="assignment-desc">' + escapeHtml(a.desc) + '</span>' +
        '</span>' +
        '<span class="assignment-side">' +
          '<span class="assignment-status ' + cls + '">' + status + '</span>' +
          '<span class="assignment-marks">Open task</span>' +
        '</span>' +
      '</a>'
    );
  }

  // A task that has not opened up yet. Shown rather than hidden: knowing
  // there is a game to build at Level 3 is most of the reason to get there.
  var PADLOCK =
    '<svg class="xp-lock-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor"/>' +
      '<path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" ' +
            'stroke-width="2.2" stroke-linecap="round"/>' +
    "</svg>";

  function lockedCard(a) {
    return (
      '<div class="assignment-card locked">' +
        '<span class="assignment-icon" aria-hidden="true">' + a.icon + "</span>" +
        '<span class="assignment-body">' +
          '<span class="assignment-title">' + escapeHtml(a.title) + "</span>" +
          '<span class="assignment-desc">' + escapeHtml(a.desc) + "</span>" +
        "</span>" +
        '<span class="assignment-side">' +
          '<span class="assignment-status locked">' + PADLOCK +
            "Level " + a.minLevel + "</span>" +
          '<span class="assignment-marks">Open task</span>' +
        "</span>" +
      "</div>"
    );
  }

  // Null until xp.js has a figure. Treated as "not yet", so a gated card is
  // never briefly clickable on a slow connection. Staff skip the gate, same as
  // they do on the task page itself.
  function levelNow() {
    var me = window.ITBasics && window.ITBasics.getSession();
    var codes = window.TEACHER_CODES;
    if (me && Array.isArray(codes) && codes.indexOf(me.code) !== -1) return Infinity;
    var s = window.ITXP && window.ITXP.current();
    return s ? s.level : 0;
  }

  async function boot() {
    var student = window.ITBasics && window.ITBasics.getSession();
    if (!student) { location.replace("/"); return; }

    var subs = await loadSubmissions(student);
    var myGames = [];
    if (window.ITBasics.myGames) {
      try { myGames = await window.ITBasics.myGames(); } catch (e) { myGames = []; }
    }
    var level = levelNow();
    el("assignments-list").innerHTML = ASSIGNMENTS.map(function (a) {
      if (a.minLevel && level < a.minLevel) return lockedCard(a);
      return a.open ? openCard(a, myGames.length) : card(a, subs[a.key]);
    }).join("");
    el("assignments-status").textContent = "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // xp.js paints from a cache first and a fetch second, so the level can go up
  // a moment after the cards are drawn. Redraw when it does, but only if a
  // gate actually changed sides.
  var drawnAt = -1;
  window.addEventListener("itbasics:xp", function () {
    var level = levelNow();
    var moved = ASSIGNMENTS.some(function (a) {
      return a.minLevel && (drawnAt < a.minLevel) !== (level < a.minLevel);
    });
    drawnAt = level;
    if (moved) boot();
  });

  window.addEventListener("itbasics:auth", function (e) {
    if (!e.detail || !e.detail.student) { location.replace("/"); return; }
    boot();
  });
})();
