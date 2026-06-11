(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Shortcut trainer: the page names an action, you PRESS the real keys,
  // and it checks the combo (accepts Ctrl or, on a Mac, Cmd). Only the
  // safe Ctrl shortcuts are captured here; Alt+Tab / Alt+F4 / the Win key
  // are OS-level and are taught in the table instead.
  // ------------------------------------------------------------------
  function initShortcuts() {
    var trainer = document.querySelector(".sc-trainer");
    if (!trainer) return;
    var challenges = [
      { label: "Copy", key: "c" },
      { label: "Paste", key: "v" },
      { label: "Cut", key: "x" },
      { label: "Undo", key: "z" },
      { label: "Select all", key: "a" },
      { label: "Save", key: "s" },
      { label: "Find", key: "f" }
    ];
    var promptEl = trainer.querySelector(".sc-prompt");
    var statusEl = trainer.querySelector(".sc-status");
    var startBtn = trainer.querySelector(".sc-start");
    var i = 0, correct = 0, active = false, waiting = false;

    function show() {
      if (i >= challenges.length) {
        promptEl.textContent = "Done!";
        statusEl.textContent = "You got " + correct + " / " + challenges.length + ".";
        statusEl.className = "sc-status";
        active = false;
        startBtn.textContent = "Try again";
        startBtn.disabled = false;
        return;
      }
      promptEl.innerHTML = "Press the shortcut for <strong>" + challenges[i].label + "</strong>";
      statusEl.textContent = "Waiting for your keypress…";
      statusEl.className = "sc-status";
    }
    function describe(e) {
      var p = [];
      if (e.ctrlKey) p.push("Ctrl");
      if (e.metaKey) p.push("Cmd");
      if (e.altKey) p.push("Alt");
      if (e.shiftKey) p.push("Shift");
      p.push((e.key || "").toUpperCase());
      return p.join("+");
    }

    document.addEventListener("keydown", function (e) {
      if (!active || waiting) return;
      if (["Control", "Shift", "Alt", "Meta", "CapsLock", "Tab"].indexOf(e.key) !== -1) return;
      e.preventDefault();
      var want = challenges[i].key;
      var ok = (e.ctrlKey || e.metaKey) && !e.altKey && (e.key || "").toLowerCase() === want;
      if (ok) {
        correct++;
        statusEl.textContent = "Correct! (" + describe(e) + ")";
        statusEl.className = "sc-status ok";
      } else {
        statusEl.textContent = "You pressed " + describe(e) + ". The answer was Ctrl+" + want.toUpperCase() + ".";
        statusEl.className = "sc-status no";
      }
      waiting = true;
      i++;
      setTimeout(function () { waiting = false; show(); }, 850);
    });

    startBtn.addEventListener("click", function () {
      i = 0; correct = 0; active = true;
      startBtn.disabled = true;
      startBtn.textContent = "Try again";
      show();
    });
  }

  // ------------------------------------------------------------------
  // Mini file explorer: a path bar (breadcrumbs), single-click to select
  // (blue), double-click a folder to go in, and a right-click menu with
  // New / Rename / Delete. Challenge: get three folders deep and drop a
  // secret.txt in the deepest one.
  // ------------------------------------------------------------------
  function initExplorer() {
    var fx = document.querySelector(".fx");
    if (!fx) return;
    var pathEl = fx.querySelector(".fx-path");
    var bodyEl = fx.querySelector(".fx-body");
    var menu = fx.querySelector(".fx-menu");
    var challengeEl = document.querySelector(".fx-challenge");

    var root = { type: "folder", name: "C:", children: [] };
    var stack = [root];
    var selected = null, editing = null, nFolder = 0, nFile = 0;

    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
    function current() { return stack[stack.length - 1]; }
    function closeMenu() { menu.hidden = true; }

    function renderPath() {
      pathEl.innerHTML = "";
      stack.forEach(function (node, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "fx-crumb";
        b.textContent = node.name;
        b.addEventListener("click", function () {
          stack = stack.slice(0, i + 1); selected = null; editing = null; closeMenu(); render();
        });
        pathEl.appendChild(b);
        var sep = document.createElement("span");
        sep.className = "fx-sep";
        sep.textContent = "\\";
        pathEl.appendChild(sep);
      });
    }

    function makeIcon(node) {
      var el = document.createElement("div");
      el.className = "fx-icon" + (node === selected ? " selected" : "");
      var glyph = '<span class="fx-glyph">' + (node.type === "folder" ? "📁" : "📄") + "</span>";
      if (node === editing) {
        el.innerHTML = glyph;
        var inp = document.createElement("input");
        inp.className = "fx-rename";
        inp.value = node.name;
        var commit = function () {
          if (editing !== node) return;
          if (inp.value.trim()) node.name = inp.value.trim();
          editing = null; render();
        };
        inp.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter") { ev.preventDefault(); commit(); }
          else if (ev.key === "Escape") { editing = null; render(); }
        });
        inp.addEventListener("blur", commit);
        inp.addEventListener("click", function (ev) { ev.stopPropagation(); });
        el.appendChild(inp);
        setTimeout(function () { inp.focus(); inp.select(); }, 0);
        return el;
      }
      el.innerHTML = glyph + '<span class="fx-name">' + esc(node.name) + "</span>";
      el.addEventListener("click", function (ev) { ev.stopPropagation(); selected = node; closeMenu(); renderBody(); });
      el.addEventListener("dblclick", function (ev) {
        ev.stopPropagation();
        if (node.type === "folder") { stack.push(node); selected = null; closeMenu(); render(); }
      });
      el.addEventListener("contextmenu", function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        selected = node; renderBody(); openMenu(ev, node);
      });
      return el;
    }

    function renderBody() {
      bodyEl.innerHTML = "";
      var items = current().children;
      if (!items.length) {
        bodyEl.innerHTML = '<p class="fx-empty">This folder is empty. Right-click to make something.</p>';
        return;
      }
      items.forEach(function (node) { bodyEl.appendChild(makeIcon(node)); });
    }

    function render() { renderPath(); renderBody(); checkChallenge(); }

    function openMenu(e, node) {
      var rect = fx.getBoundingClientRect();
      var html = "";
      if (node) {
        if (node.type === "folder") html += '<button type="button" class="fx-item" data-act="open">Open</button>';
        html += '<button type="button" class="fx-item" data-act="rename">Rename</button>';
        html += '<button type="button" class="fx-item" data-act="delete">Delete</button>';
      } else {
        html += '<button type="button" class="fx-item" data-act="newfolder">New folder</button>';
        html += '<button type="button" class="fx-item" data-act="newfile">New text document</button>';
      }
      menu.innerHTML = html;
      menu.style.left = Math.max(0, Math.min(e.clientX - rect.left, rect.width - 180)) + "px";
      menu.style.top = Math.max(0, Math.min(e.clientY - rect.top, rect.height - 120)) + "px";
      menu.hidden = false;
      menu.querySelectorAll(".fx-item").forEach(function (item) {
        item.addEventListener("click", function (ev) { ev.stopPropagation(); doAction(item.dataset.act, node); closeMenu(); });
      });
    }

    function doAction(act, node) {
      if (act === "open" && node) { stack.push(node); selected = null; render(); }
      else if (act === "rename" && node) { editing = node; renderBody(); }
      else if (act === "delete" && node) {
        var arr = current().children, i = arr.indexOf(node);
        if (i >= 0) arr.splice(i, 1);
        if (selected === node) selected = null;
        render();
      } else if (act === "newfolder") {
        nFolder++;
        current().children.push({ type: "folder", name: nFolder === 1 ? "New folder" : "New folder (" + nFolder + ")", children: [] });
        render();
      } else if (act === "newfile") {
        nFile++;
        current().children.push({ type: "file", name: nFile === 1 ? "New Text Document.txt" : "New Text Document (" + nFile + ").txt" });
        render();
      }
    }

    function checkChallenge() {
      var found = false;
      (function walk(folder, depth) {
        folder.children.forEach(function (c) {
          if (c.type === "file" && c.name.toLowerCase() === "secret.txt" && depth >= 4) found = true;
          else if (c.type === "folder") walk(c, depth + 1);
        });
      })(root, 1);
      challengeEl.className = "fx-challenge" + (found ? " done" : "");
      challengeEl.textContent = found
        ? "🎉 Challenge complete! Three folders deep and secret.txt saved inside. That is real file-explorer skill."
        : "Challenge: make three folders inside each other (right-click → New folder, double-click to open), then create a file in the deepest one and rename it to secret.txt.";
    }

    bodyEl.addEventListener("click", function () { selected = null; closeMenu(); renderBody(); });
    bodyEl.addEventListener("contextmenu", function (e) { e.preventDefault(); selected = null; renderBody(); openMenu(e, null); });
    document.addEventListener("click", function (e) { if (!e.target.closest(".fx-menu")) closeMenu(); });

    render();
  }

  // Knowledge checks (formative), shared shape with the other modules.
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

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    initShortcuts();
    initExplorer();
    initChecks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
