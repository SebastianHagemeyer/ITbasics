/* snippet-run.js
 *
 * Makes the read-only code snippets in a lesson runnable: it adds a Run button
 * (and, for input() snippets, an editable input box) under each
 * <pre class="code"> and runs the snippet through the shared Pyodide grader
 * that challenges.js exposes as window.ITCode.run. The code stays uneditable;
 * this only runs it and shows the output.
 *
 *   - Opt a snippet OUT with  data-norun  (e.g. a deliberately broken example).
 *   - Mark an input() snippet with  data-inputs='["a","b"]' : its value(s) become
 *     the starting text of an editable input box, so the reader can try their own
 *     (comma-separated for more than one). Works in every browser.
 *
 * Reusable: drop the <script> on any lesson page that also loads challenges.js.
 * Pyodide is lazy: nothing loads until the reader actually presses Run.
 */
(function () {
  "use strict";

  var ICON =
    '<svg class="snippet-run-icon" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
    '<path d="M4 3.2v9.6a.6.6 0 0 0 .92.5l7.5-4.8a.6.6 0 0 0 0-1l-7.5-4.8A.6.6 0 0 0 4 3.2z" fill="currentColor"/></svg>';

  // textContent strips the syntax-highlight <span>s and decodes entities
  // (&lt; -> <, &amp; -> &), leaving real, runnable Python. Trim trailing space.
  function codeOf(pre) { return pre.textContent.replace(/\s+$/, ""); }

  function defaultsOf(pre) {
    var raw = pre.getAttribute("data-inputs");
    if (!raw) return null; // no input(), no input box
    try { var v = JSON.parse(raw); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }

  function build(pre) {
    if (pre.dataset.runReady) return; // idempotent
    pre.dataset.runReady = "1";

    // Optional colour map: { "exact message": "green" } paints matching text in
    // the output. Kept in the markup so the lesson code stays plain Python.
    var colourMap = null;
    var rawColour = pre.getAttribute("data-colour");
    if (rawColour) { try { colourMap = JSON.parse(rawColour); } catch (e) { colourMap = null; } }

    var bar = document.createElement("div");
    bar.className = "snippet-bar";

    // Live "Set x = …" controls: each .snippet-set token in the code is editable.
    // Changing it rewrites the value shown in the code above, so Run uses it.
    var sets = pre.querySelectorAll(".snippet-set");
    for (var si = 0; si < sets.length; si++) {
      (function (span) {
        var def = span.textContent.trim();
        var wrap = document.createElement("label");
        wrap.className = "snippet-set-wrap";
        var lab = document.createElement("span");
        lab.className = "snippet-set-label";
        lab.appendChild(document.createTextNode("Set "));
        var nm = document.createElement("code");
        nm.textContent = span.getAttribute("data-label") || "value";
        lab.appendChild(nm);
        lab.appendChild(document.createTextNode(" ="));
        var inp = document.createElement("input");
        inp.type = (def !== "" && !isNaN(Number(def))) ? "number" : "text";
        inp.className = "snippet-input snippet-set-input";
        inp.value = def;
        inp.spellcheck = false;
        inp.autocomplete = "off";
        inp.addEventListener("input", function () { span.textContent = inp.value; });
        inp.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); go(); }
        });
        wrap.appendChild(lab);
        wrap.appendChild(inp);
        bar.appendChild(wrap);
      })(sets[si]);
    }

    // Editable input box for input() snippets, seeded with the example value(s).
    var field = null;
    var defaults = defaultsOf(pre);
    if (defaults) {
      var wrap = document.createElement("label");
      wrap.className = "snippet-input-wrap";
      var lab = document.createElement("span");
      lab.className = "snippet-input-label";
      lab.textContent = "Input";
      field = document.createElement("input");
      field.type = "text";
      field.className = "snippet-input";
      field.value = defaults.join(", ");
      field.spellcheck = false;
      field.autocomplete = "off";
      if (defaults.length > 1) field.title = "Separate multiple inputs with commas";
      wrap.appendChild(lab);
      wrap.appendChild(field);
      bar.appendChild(wrap);
    }

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
    function escHtml(s) {
      return String(s).replace(/[&<>]/g, function (c) {
        return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
      });
    }
    function colourise(text) {
      var html = escHtml(text);
      Object.keys(colourMap).forEach(function (msg) {
        var safe = escHtml(msg);
        if (safe) html = html.split(safe).join('<span class="out-' + colourMap[msg] + '">' + safe + "</span>");
      });
      return html;
    }
    function show(text, kind) {
      out.hidden = false;
      out.className = "snippet-output" + (kind ? " is-" + kind : "");
      if (colourMap && kind !== "error" && kind !== "loading") {
        out.innerHTML = colourise(text);
      } else {
        out.textContent = text;
      }
    }
    function readInputs() {
      if (!field) return [];
      return field.value.split(",").map(function (s) { return s.trim(); })
        .filter(function (s) { return s.length; });
    }

    async function go() {
      if (busy) return;
      if (!window.ITCode || !window.ITCode.run) {
        show("Python isn’t available on this page yet. Try again in a moment.", "error");
        return;
      }
      busy = true;
      label("Running…", true);
      show("Loading Python… (first run only, ~10 seconds)", "loading");
      try {
        var res = await window.ITCode.run(codeOf(pre), readInputs());
        var body = res && (res.display != null ? res.display : res.output);
        if (res && res.error && /EOFError/.test(res.error)) {
          // Ran out of scripted input: the program asked more times than typed.
          show((body ? body + "\n" : "") +
            "⚠ The program asked for more input than you typed. Add another value" +
            (field ? " (comma-separated)." : "."), "error");
        } else if (res && res.error && !body) {
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
    }

    btn.addEventListener("click", go);
    if (field) {
      field.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); go(); }
      });
    }
  }

  function init() {
    var pres = document.querySelectorAll("pre.code:not([data-norun])");
    for (var i = 0; i < pres.length; i++) build(pres[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
