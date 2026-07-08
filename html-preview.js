/* html-preview.js
 *
 * Turns the read-only HTML snippets in a lesson (<pre class="code">) into a live
 * "try it" editor: the code becomes editable and a sandboxed <iframe> renders it,
 * updating as you type. It's the HTML counterpart to snippet-run.js. There's no
 * Python here, just the browser drawing your markup, so nothing extra has to load.
 *
 *   - Opt a snippet OUT with  data-nopreview  (e.g. a non-HTML example).
 *
 * The <iframe> uses  sandbox=""  (no scripts, no same-origin) so a pasted snippet
 * can never run code or reach the page around it, so it's safe for a classroom.
 *
 * Reusable: drop the <script> on any lesson page whose code snippets are HTML.
 */
(function () {
  "use strict";

  // textContent decodes the entities the lesson uses (&lt; -> <, &amp; -> &) and
  // strips the syntax-highlight <span>s, leaving real, renderable HTML.
  function codeOf(pre) { return pre.textContent.replace(/\s+$/, ""); }

  // A full document renders as-is; a fragment (just <h1>…</h1>) gets a small base
  // style so the preview reads cleanly on the page instead of raw Times New Roman.
  function documentFor(html) {
    if (/<!doctype/i.test(html) || /<html[\s>]/i.test(html)) return html;
    return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
      'margin:12px;color:#1a1c2a;line-height:1.5}' +
      'h1,h2,h3,h4{margin:.2em 0 .4em}img{max-width:100%}a{color:#4338ca}</style>' +
      '</head><body>' + html + '</body></html>';
  }

  function build(pre) {
    if (pre.dataset.previewReady) return; // idempotent
    pre.dataset.previewReady = "1";

    var original = codeOf(pre);
    var lines = original.split("\n").length;

    // Editable code area, styled (via the shared .code class) to look like the
    // dark snippet it replaces. Plain text, so the reader can change any tag.
    var editor = document.createElement("textarea");
    editor.className = "code html-edit";
    editor.value = original;
    editor.spellcheck = false;
    editor.autocomplete = "off";
    editor.setAttribute("aria-label", "Editable HTML: change it and watch the preview update");
    editor.rows = Math.min(22, Math.max(3, lines));

    // Tab inserts two spaces instead of leaving the box.
    editor.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      e.preventDefault();
      var s = editor.selectionStart, en = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + "  " + editor.value.slice(en);
      editor.selectionStart = editor.selectionEnd = s + 2;
      schedule();
    });

    var bar = document.createElement("div");
    bar.className = "snippet-bar html-preview-bar";
    var tag = document.createElement("span");
    tag.className = "html-preview-tag";
    tag.textContent = "Live preview: edit the code above";
    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn btn-ghost html-preview-reset";
    reset.textContent = "Reset";
    bar.appendChild(tag);
    bar.appendChild(reset);

    var prev = document.createElement("div");
    prev.className = "html-preview";
    var plabel = document.createElement("div");
    plabel.className = "preview-label";
    plabel.textContent = "Preview";
    var frame = document.createElement("iframe");
    frame.className = "html-preview-frame";
    frame.setAttribute("sandbox", ""); // no scripts, no same-origin: render only
    frame.setAttribute("title", "Rendered preview of the HTML above");
    // Roughly match the editor's height so short snippets don't get a huge frame.
    frame.style.height = Math.min(360, Math.max(110, lines * 22 + 30)) + "px";
    prev.appendChild(plabel);
    prev.appendChild(frame);

    // Swap the read-only <pre> for the editor, then add the bar + preview after it.
    pre.parentNode.replaceChild(editor, pre);
    editor.parentNode.insertBefore(bar, editor.nextSibling);
    editor.parentNode.insertBefore(prev, bar.nextSibling);

    function render() { frame.srcdoc = documentFor(editor.value); }
    var t = null;
    function schedule() { clearTimeout(t); t = setTimeout(render, 150); }

    editor.addEventListener("input", schedule);
    reset.addEventListener("click", function () { editor.value = original; render(); });
    render();
  }

  function init() {
    var pres = document.querySelectorAll("pre.code:not([data-nopreview])");
    for (var i = 0; i < pres.length; i++) build(pres[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
