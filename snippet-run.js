/* snippet-run.js
 *
 * Makes the read-only code snippets in a lesson runnable: it adds a Run button
 * and an output panel under each <pre class="code"> and runs the snippet through
 * the shared Pyodide grader that challenges.js exposes as window.ITCode.run.
 * The code stays uneditable — this only shows what it does.
 *
 *   - Opt a snippet OUT with  data-norun  (e.g. a deliberately broken example).
 *   - Give input() snippets scripted answers with  data-inputs='["a","b"]'  so
 *     Run "just works" without the reader having to type.
 *
 * Reusable: drop the <script> on any lesson page that also loads challenges.js.
 * Pyodide is lazy — nothing loads until the reader actually presses Run.
 */
(function () {
  "use strict";

  var ICON =
    '<svg class="snippet-run-icon" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
    '<path d="M4 3.2v9.6a.6.6 0 0 0 .92.5l7.5-4.8a.6.6 0 0 0 0-1l-7.5-4.8A.6.6 0 0 0 4 3.2z" fill="currentColor"/></svg>';

  // textContent strips the syntax-highlight <span>s and decodes entities
  // (&lt; -> <, &amp; -> &), leaving real, runnable Python. Trim trailing space.
  function codeOf(pre) { return pre.textContent.replace(/\s+$/, ""); }

  function inputsOf(pre) {
    var raw = pre.getAttribute("data-inputs");
    if (!raw) return [];
    try { var v = JSON.parse(raw); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }

  function build(pre) {
    if (pre.dataset.runReady) return; // idempotent
    pre.dataset.runReady = "1";

    var bar = document.createElement("div");
    bar.className = "snippet-bar";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary snippet-run";
    btn.innerHTML = ICON + '<span class="snippet-run-label">Run</span>';
    bar.appendChild(btn);

    var out = document.createElement("div");
    out.className = "snippet-output";
    out.hidden = true;

    // Insert the bar and the output panel as siblings right after the code block.
    pre.parentNode.insertBefore(bar, pre.nextSibling);
    pre.parentNode.insertBefore(out, bar.nextSibling);

    var busy = false;

    function label(text, running) {
      var l = btn.querySelector(".snippet-run-label");
      if (l) l.textContent = text;
      btn.classList.toggle("is-busy", !!running);
      btn.disabled = !!running;
    }
    function show(text, kind) {
      out.hidden = false;
      out.className = "snippet-output" + (kind ? " is-" + kind : "");
      out.textContent = text;
    }

    btn.addEventListener("click", async function () {
      if (busy) return;
      if (!window.ITCode || !window.ITCode.run) {
        show("Python isn’t available on this page yet — try again in a moment.", "error");
        return;
      }
      busy = true;
      label("Running…", true);
      show("Loading Python… (first run only, ~10 seconds)", "loading");
      try {
        var res = await window.ITCode.run(codeOf(pre), inputsOf(pre));
        var body = res && (res.display != null ? res.display : res.output);
        if (res && res.error && !body) {
          show(res.error, "error");
        } else {
          var text = body || "";
          if (res && res.error) text += (text && text.slice(-1) !== "\n" ? "\n" : "") + res.error;
          show(text === "" ? "(this snippet printed nothing)" : text, res && res.error ? "error" : null);
        }
      } catch (e) {
        show((e && e.message) ? e.message : String(e), "error");
      } finally {
        label("Run again", false);
        busy = false;
      }
    });
  }

  function init() {
    var pres = document.querySelectorAll("pre.code:not([data-norun])");
    for (var i = 0; i < pres.length; i++) build(pres[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
