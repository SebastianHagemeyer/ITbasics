/*
 * Assignments hub: one card per assignment with the student's submission
 * status. Add new assignments to the ASSIGNMENTS list (and give them a page
 * under /assignments/<key>/).
 */
(function () {
  "use strict";

  var ASSIGNMENTS = [
    {
      key: "petprogram",
      title: "Task 1 · My First Program: The Pet Project",
      href: "/assignments/pet-program/",
      emoji: "\u{1F436}\u{1F422}",
      desc: "Build your first real Python program, step by step. Choose your path: " +
            "a Pet Age Calculator for the number crunchers, or a drawing Pet Turtle for the artists.",
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

  // Submission rows for this student: Supabase when online, with the
  // page's local fallback copy as a backup source.
  async function loadSubmissions(student) {
    var byKey = {};
    if (window.ITBasics.isOnline()) {
      var sb = window.ITBasics.client();
      var res = await sb.from("assignment_submissions")
        .select("assignment, track, submitted_at, updated_at")
        .eq("student_code", student.code);
      if (!res.error && res.data) {
        res.data.forEach(function (r) { byKey[r.assignment] = r; });
      }
    }
    ASSIGNMENTS.forEach(function (a) {
      if (byKey[a.key]) return;
      var raw = localStorage.getItem("itbasics-" + a.key + "-" + student.code + "-submission");
      if (!raw) return;
      try { byKey[a.key] = JSON.parse(raw); } catch (e) { /* ignore */ }
    });
    return byKey;
  }

  function card(a, sub) {
    var status, cls;
    if (sub) {
      var when = sub.updated_at || sub.submitted_at;
      var date = when ? new Date(when).toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : "";
      status = "&#10003; Submitted" +
        (sub.track ? " &middot; " + escapeHtml(TRACK_NAMES[sub.track] || sub.track) : "") +
        (date ? " &middot; " + escapeHtml(date) : "");
      cls = "done";
    } else {
      status = "Not submitted yet";
      cls = "todo";
    }
    return (
      '<a class="assignment-card ' + cls + '" href="' + a.href + '">' +
        '<span class="assignment-emoji" aria-hidden="true">' + a.emoji + '</span>' +
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
