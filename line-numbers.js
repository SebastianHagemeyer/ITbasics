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
 * Numbering is a measurement, not a count. The stylesheet says white-space:
 * pre, but that only holds for the plain fallback editor: when CodeJar loads
 * it sets pre-wrap inline, which beats the stylesheet, and a long line then
 * takes several rows. So rowsPerLine asks the element what it actually does
 * and measures the wrapped rows with a Range when it needs to.
 *
 * Keep the stylesheet's white-space: pre. It is not dead: it is the only thing
 * preserving Python indentation when CodeJar fails to load, which is exactly
 * what happens on a network that blocks the CDN.
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

  var editors = [];           // { code, gutter, inner }

  // How many visual rows each logical line occupies.
  //
  // The old version assumed one line was one row, on the strength of
  // white-space: pre in the stylesheet. That is true only while the plain
  // fallback editor is in use. When CodeJar loads it sets white-space:
  // pre-wrap inline, which beats the stylesheet, and a long line then takes
  // several rows while the gutter still spends one number on it, so every
  // number below the wrap points at the wrong line.
  //
  // So ask the element what it actually does, and when it wraps, measure.
  // Deliberately NOT scrollHeight: .sandbox-code has a min-height, so
  // scrollHeight is floored and reports rows that are not there.
  function rowsPerLine(code) {
    var text = code.textContent || "";
    var lines = text.split("\n");
    if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
    if (!lines.length) lines = [""];

    var ws = "";
    try { ws = window.getComputedStyle(code).whiteSpace; } catch (err) {}
    var wraps = ws === "pre-wrap" || ws === "pre-line" || ws === "normal" || ws === "break-spaces";
    if (!wraps) return lines.map(function () { return 1; });

    // Character offsets have to be mapped onto real DOM positions, because
    // once Prism has run the code is not one text node but a few hundred.
    var nodes = [];
    var acc = 0;
    try {
      var walk = document.createTreeWalker(code, NodeFilter.SHOW_TEXT, null);
      var t;
      while ((t = walk.nextNode())) {
        nodes.push({ node: t, start: acc, len: t.nodeValue.length });
        acc += t.nodeValue.length;
      }
    } catch (err) { /* fall through to one row each */ }
    if (!nodes.length) return lines.map(function () { return 1; });

    function locate(offset) {
      for (var i = 0; i < nodes.length; i++) {
        if (offset <= nodes[i].start + nodes[i].len) {
          return { node: nodes[i].node, offset: offset - nodes[i].start };
        }
      }
      var last = nodes[nodes.length - 1];
      return { node: last.node, offset: last.len };
    }

    var range = document.createRange();
    var out = [];
    var pos = 0;
    for (var i = 0; i < lines.length; i++) {
      var len = lines[i].length;
      var rows = 1;
      if (len > 0) {
        try {
          var a = locate(pos);
          var b = locate(pos + len);
          range.setStart(a.node, a.offset);
          range.setEnd(b.node, b.offset);
          // One client rect per fragment, so count distinct tops rather than
          // rects: a wrapped line split across several spans still has one top
          // per visual row.
          var rects = range.getClientRects();
          var tops = [];
          for (var r = 0; r < rects.length; r++) {
            if (rects[r].height < 1) continue;
            var top = rects[r].top;
            var seen = false;
            for (var k = 0; k < tops.length; k++) {
              if (Math.abs(tops[k] - top) < 2) { seen = true; break; }
            }
            if (!seen) tops.push(top);
          }
          if (tops.length) rows = tops.length;
        } catch (err) { /* leave it at one */ }
      }
      out.push(rows);
      pos += len + 1;     // the newline itself
    }
    return out;
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
    if (!e.gutter || !e.inner) return;
    placeGutter(e);

    var rows = rowsPerLine(e.code);
    var labels = [];
    for (var i = 0; i < rows.length; i++) {
      labels.push(String(i + 1));
      // A line that wrapped gets blank rows under its number, so the next
      // number stays opposite the line it belongs to.
      for (var j = 1; j < rows[i]; j++) labels.push("");
    }
    e.inner.textContent = labels.join("\n");

    // Scroll the CONTENTS, not the box. Transforming the gutter itself slid
    // the whole thing out of its slot: up over the toolbar at the top, and
    // clipped at the bottom so the lowest numbers vanished entirely.
    e.inner.style.transform = "translateY(" + -e.code.scrollTop + "px)";
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
    var inner = document.createElement("div");
    inner.className = "sandbox-gutter-inner";
    gutter.appendChild(inner);
    host.insertBefore(gutter, code);

    var e = { code: code, gutter: gutter, inner: inner };
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
