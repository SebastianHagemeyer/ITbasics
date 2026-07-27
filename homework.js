/*
 * "Your homework" panel on the signed-in home page. Fetches the homework
 * rows for the student's class (plus 'ALL'), works out their status on each
 * item from their own attempts/submissions/progress, and renders a checklist
 * with links. Shows nothing at all when no homework is set or offline.
 */
(function () {
  "use strict";

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  async function loadStudentData(sb, student, items) {
    var data = { attempts: [], assignments: {}, answers: {} };
    var quizNames = window.HWStatus.neededQuizNames(items);
    if (quizNames.length) {
      var ares = await sb.from("quiz_attempts")
        .select("quiz_name, score, total, answers")
        .eq("student_code", student.code)
        .in("quiz_name", quizNames);
      if (!ares.error) data.attempts = ares.data || [];
    }
    var hasAssignments = items.some(function (i) { return i.type === "assignment"; });
    if (hasAssignments) {
      var pres = await sb.from("assignment_progress")
        .select("*").eq("student_code", student.code);
      if (!pres.error) (pres.data || []).forEach(function (r) {
        data.assignments[r.assignment] = { submitted: Boolean(r.submitted_at) };
      });
    }
    var answerNames = window.HWStatus.neededAnswerNames(items);
    for (var i = 0; i < answerNames.length; i++) {
      var qres = await sb.from("quiz_progress")
        .select("answers").eq("student_code", student.code).eq("quiz_name", answerNames[i]).maybeSingle();
      if (!qres.error && qres.data) data.answers[answerNames[i]] = qres.data.answers || {};
    }
    return data;
  }

  function dueLabel(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T23:59:59");
    if (isNaN(d)) return "";
    var days = Math.ceil((d - new Date()) / 86400000);
    var when = d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    if (days < 0) return "was due " + when;
    if (days === 0) return "due TODAY";
    if (days === 1) return "due tomorrow";
    return "due " + when;
  }

  var STATUS = {
    done:    { cls: "done",    text: "Done ✓" },
    started: { cls: "started", text: "Started" },
    todo:    { cls: "todo",    text: "Not started" }
  };

  // Signing in happens without a page load, so every early return has to
  // leave the panel hidden and empty: otherwise a signed-out (or signed-in
  // as someone else) view would linger until a refresh.
  function clearPanel(host) {
    if (!host) return;
    host.innerHTML = "";
    host.hidden = true;
  }

  async function boot(run) {
    var host = el("homework-panel");
    if (!host || !window.ITBasics || !window.HWStatus) return;
    var student = window.ITBasics.getSession();
    if (!student || !window.ITBasics.isOnline()) { clearPanel(host); return; }
    var sb = window.ITBasics.client();

    var res = await sb.from("homework")
      .select("id, class, title, items, due_date")
      .in("class", [student.class || "", "ALL"])
      .order("created_at", { ascending: false });
    if (res.error || !res.data || !res.data.length) { clearPanel(host); return; }

    // Status is computed once from the union of all items across sets.
    var allItems = [];
    res.data.forEach(function (hw) { allItems = allItems.concat(hw.items || []); });
    var data;
    try { data = await loadStudentData(sb, student, allItems); }
    catch (e) { clearPanel(host); return; }

    var html = "";
    res.data.forEach(function (hw) {
      var items = hw.items || [];
      var doneCount = 0;
      var rows = items.map(function (item) {
        var status = window.HWStatus.itemStatus(item, data);
        if (status === "done") doneCount++;
        var s = STATUS[status];
        return '<li class="hw-item">' +
          '<a href="' + escapeHtml(window.HWStatus.itemHref(item)) + '">' +
            escapeHtml(window.HWStatus.itemLabel(item)) + '</a>' +
          '<span class="hw-chip ' + s.cls + '">' + s.text + '</span>' +
        '</li>';
      }).join("");
      var due = dueLabel(hw.due_date);
      var allDone = doneCount === items.length && items.length > 0;
      html +=
        '<div class="hw-set' + (allDone ? " all-done" : "") + '">' +
          '<div class="hw-set-head">' +
            '<strong>' + escapeHtml(hw.title) + '</strong>' +
            '<span class="hw-set-meta">' + doneCount + '/' + items.length + ' done' +
              (due ? ' · <span class="hw-due' + (due.indexOf("was due") === 0 || due === "due TODAY" ? " urgent" : "") + '">' + escapeHtml(due) + '</span>' : '') +
            '</span>' +
          '</div>' +
          '<ul class="hw-list">' + rows + '</ul>' +
        '</div>';
    });

    if (run !== latestRun) return;   // a newer sign-in overtook this one
    host.innerHTML = '<h2>Your homework</h2>' + html;
    host.hidden = false;
  }

  // Every boot gets a ticket; only the newest one is allowed to paint, so a
  // slow fetch from a previous session can never overwrite a newer render.
  var latestRun = 0;
  function refresh() {
    latestRun = latestRun + 1;
    var run = latestRun;
    return boot(run);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else { refresh(); }

  // Signing in and out happens without a page load, so re-render on the
  // auth event: homework appears immediately instead of after a refresh.
  window.addEventListener("itbasics:auth", refresh);
})();
