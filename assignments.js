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

  var ASSIGNMENTS = [
    {
      key: "petprogram",
      title: "Task 1 · My First Program: The Pet Project",
      href: "/assignments/pet-program/",
      icon: ICON_DOG + ICON_TURTLE,
      desc: "Build your first real Python program, step by step. Choose your path: " +
            "a Pet Age Calculator for the number crunchers, or a drawing Pet Turtle for the artists.",
      marks: 11
    },
    {
      key: "pixelart",
      title: "Task 2 · Pixel Painter: Pictures Are Data",
      href: "/assignments/pixel-painter/",
      icon: ICON_PIXEL,
      desc: "Every image is secretly a grid of numbers. Store your own drawing as pure data, " +
            "build a colour palette with hex codes, and write the loop that paints it.",
      marks: 11
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
        .select("assignment, state, submitted_at, updated_at")
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

  async function boot() {
    var student = window.ITBasics && window.ITBasics.getSession();
    if (!student) { location.replace("/"); return; }

    var subs = await loadSubmissions(student);
    el("assignments-list").innerHTML = ASSIGNMENTS.map(function (a) {
      return card(a, subs[a.key]);
    }).join("");
    el("assignments-status").textContent = "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  window.addEventListener("itbasics:auth", function (e) {
    if (!e.detail || !e.detail.student) { location.replace("/"); return; }
    boot();
  });
})();
