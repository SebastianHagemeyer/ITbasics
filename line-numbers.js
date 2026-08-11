/* Line numbers down the side of a code editor, off by default, remembered.
 *
 * Ten pages share the .sandbox-code editor: the Sandbox, Live Coding, the
 * three assignments and five lesson pages. This file only draws them. The
 * switch lives in Settings on My Journey, next to the theme and the XP
 * notifications, so all the "how the site looks" choices are in one place
 * rather than scattered into whichever toolbar happens to be nearby.
 *
 * Settings writes the same localStorage key directly; it cannot call in here
 * because this script is not loaded on My Journey. The key is the contract
 * between them, which is why its name is spelled out in both files.
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

  var editors = [];           // { code, gutter }

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

  function apply(e, on) {
    e.code.classList.toggle("has-linenums", on);
    if (e.gutter) e.gutter.hidden = !on;
    if (on) paintGutter(e);
  }

  function applyAll(on) {
    editors.forEach(function (e) { apply(e, on); });
  }

  function setup(shell) {
    var code = shell.querySelector(".sandbox-code");
    if (!code || code._lineNums) return;
    code._lineNums = true;

    var host = code.parentNode;
    if (!host) return;
    host.classList.add("has-gutter-host");

    var gutter = document.createElement("div");
    gutter.className = "sandbox-gutter";
    gutter.setAttribute("aria-hidden", "true");
    host.insertBefore(gutter, code);

    var e = { code: code, gutter: gutter };
    editors.push(e);

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

  window.ITLineNums = {
    refresh: recount,
    GUTTER_W: GUTTER_W,
    mode: function () { return wanted() ? "on" : "off"; },
    setMode: function (m) {
      var on = m === "on";
      remember(on);
      applyAll(on);
    }
  };
})();
