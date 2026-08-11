/* Line numbers down the side of a code editor, off by default, remembered.
 *
 * Ten pages share the .sandbox-code editor: the Sandbox, Live Coding, the
 * three assignments and five lesson pages. This adds one button to each of
 * their toolbars, so the choice is made once and applies everywhere.
 *
 * The editor element is never moved in the DOM. code-maximise.js has the same
 * rule and says why: it is contenteditable, Prism re-highlights it in place,
 * and the page scripts hold references to it. So the gutter is a sibling laid
 * over the editor's left edge rather than a wrapper around it, and the editor
 * simply gains enough left padding to sit clear of it.
 *
 * Alignment is only possible because .sandbox-code is white-space: pre. One
 * logical line is one visual line, so numbering is a count, not a measurement.
 * If that ever becomes pre-wrap, this stops lining up and would need to
 * measure wrapped rows instead.
 */
(function () {
  "use strict";

  var KEY = "itbasics-linenums";
  var GUTTER_W = 44;          // keep in step with .sandbox-gutter in styles.css

  function wanted() {
    try {
      return localStorage.getItem(KEY) === "on";
    } catch (e) {
      return false;
    }
  }

  function remember(on) {
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch (e) {
      /* Private browsing. The choice still holds for this page. */
    }
  }

  var editors = [];           // { code, gutter, btn }

  function countLines(code) {
    // textContent rather than innerText: innerText collapses and re-inserts
    // newlines by rendered layout, which is a different number from the one
    // the student is looking at.
    var t = code.textContent || "";
    var n = t.split("\n").length;
    // A trailing newline makes an empty last line that is not worth numbering.
    if (n > 1 && t.charAt(t.length - 1) === "\n") n--;
    return Math.max(n, 1);
  }

  // The gutter is positioned against .sandbox-editor, which also contains the
  // toolbar, so "top: 0" would paint the numbers over the filename. Line it up
  // with the code area itself, and re-measure whenever that box can have moved.
  function placeGutter(e) {
    if (!e.gutter) return;
    e.gutter.style.top = e.code.offsetTop + "px";
    e.gutter.style.height = e.code.clientHeight + "px";
  }

  function paintGutter(e) {
    if (!e.gutter) return;
    placeGutter(e);
    var n = countLines(e.code);
    var out = [];
    for (var i = 1; i <= n; i++) out.push(i);
    e.gutter.textContent = out.join("\n");
    // The gutter does not scroll on its own; it rides the editor's scroll.
    e.gutter.style.transform = "translateY(" + -e.code.scrollTop + "px)";
  }

  function paintBtn(e, on) {
    if (!e.btn) return;
    e.btn.setAttribute("aria-pressed", on ? "true" : "false");
    e.btn.title = on ? "Hide line numbers" : "Show line numbers";
  }

  function apply(e, on) {
    e.code.classList.toggle("has-linenums", on);
    if (e.gutter) e.gutter.hidden = !on;
    paintBtn(e, on);
    if (on) paintGutter(e);
  }

  function applyAll(on) {
    editors.forEach(function (e) { apply(e, on); });
  }

  function setup(shell) {
    var code = shell.querySelector(".sandbox-code");
    var actions = shell.querySelector(".sandbox-editor .sandbox-bar-actions");
    if (!code || !actions || code._lineNums) return;
    code._lineNums = true;

    var host = code.parentNode;
    if (!host) return;
    host.classList.add("has-gutter-host");

    var gutter = document.createElement("div");
    gutter.className = "sandbox-gutter";
    gutter.setAttribute("aria-hidden", "true");
    host.insertBefore(gutter, code);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost code-linenums";
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML =
      '<svg class="code-linenums-icon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">' +
        '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
          '<path d="M2 3.5h1.4M2 8h1.4M2 12.5h1.4"/>' +
          '<path d="M6.5 3.5H14M6.5 8H14M6.5 12.5H11"/>' +
        "</g></svg>" +
      '<span class="code-linenums-label">Lines</span>';
    actions.insertBefore(btn, actions.firstChild);

    var e = { code: code, gutter: gutter, btn: btn };
    editors.push(e);

    btn.addEventListener("click", function () {
      var on = !code.classList.contains("has-linenums");
      remember(on);
      applyAll(on);           // one choice, every editor on the page
    });

    // Typing changes the count; scrolling changes which numbers are opposite
    // which lines. Both are cheap enough to do on the event.
    code.addEventListener("input", function () { if (!gutter.hidden) paintGutter(e); });
    code.addEventListener("scroll", function () { if (!gutter.hidden) paintGutter(e); });
    // Maximising, rotating a tablet or a toolbar wrapping all move the box.
    if (window.ResizeObserver) {
      try {
        new ResizeObserver(function () { if (!gutter.hidden) paintGutter(e); }).observe(code);
      } catch (err) { /* fall back to the resize listener below */ }
    }

    apply(e, wanted());
  }

  function init() {
    // The assignment pages call their wrapper .assign-shell, same as
    // code-maximise has to allow for.
    var shells = document.querySelectorAll(".sandbox-shell, .assign-shell");
    for (var i = 0; i < shells.length; i++) setup(shells[i]);
  }

  // Page scripts load an example into the editor after their own boot, so the
  // first count can be of an empty box. Recount once things have settled.
  function recount() {
    editors.forEach(function (e) { if (!e.gutter.hidden) paintGutter(e); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      window.setTimeout(recount, 400);
    });
  } else {
    init();
    window.setTimeout(recount, 400);
  }

  // Another tab changing the setting should not leave this one disagreeing.
  window.addEventListener("storage", function (ev) {
    if (ev.key === KEY) applyAll(wanted());
  });

  window.addEventListener("resize", recount);

  window.ITLineNums = { refresh: recount, GUTTER_W: GUTTER_W };
})();
