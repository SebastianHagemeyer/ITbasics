/* code-maximise.js
 *
 * Reusable "maximise / pop-out" control for the code shells (.sandbox-shell)
 * used on the Live Coding page, the Sandbox, and the embedded module tasks
 * (e.g. /topics/decisions/). It adds a Maximise button to each shell's editor
 * bar that expands the shell into a full-screen focus overlay so learners get
 * real room to type: editor and terminal side by side, plus any pass/fail
 * results panel pulled in so feedback stays visible.
 *
 * Purely additive: it scans for .sandbox-shell on load and wires itself up.
 * Nothing else depends on it, and it touches no other script's state. The
 * editor element is never moved in the DOM (only an ancestor class is
 * toggled), so the CodeJar editor keeps its contents, highlighting and focus.
 */
(function () {
  "use strict";

  var SVG_OPEN =
    '<svg class="code-maximise-icon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"' +
    ' fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"/></svg>';
  var SVG_CLOSE =
    '<svg class="code-maximise-icon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"' +
    ' fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M2 6h4V2M14 6h-4V2M2 10h4v4M14 10h-4v4"/></svg>';

  // Only one shell can be maximised at a time.
  var openShell = null;

  function paint(btn, on) {
    btn.innerHTML =
      (on ? SVG_CLOSE : SVG_OPEN) +
      '<span class="code-maximise-label">' + (on ? "Minimise" : "Maximise") + "</span>";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.title = on ? "Exit full screen (Esc)" : "Maximise the editor for more room";
  }

  function open(shell) {
    if (openShell && openShell !== shell) close();

    // Pull an associated results panel into the overlay (if the host page has
    // one as a sibling) so Check feedback shows up while maximised.
    var results = shell.parentNode && shell.parentNode.querySelector(".challenge-results");
    if (results) {
      shell._results = results;
      shell._resultsHome = { parent: results.parentNode, next: results.nextSibling };
      shell.appendChild(results);
    }

    shell.classList.add("is-maximised");
    document.body.classList.add("has-maximised-code");
    openShell = shell;

    var btn = shell.querySelector(".code-maximise");
    if (btn) paint(btn, true);

    var code = shell.querySelector(".sandbox-code");
    if (code) { try { code.focus(); } catch (e) {} }
    if (shell._refreshOverflow) shell._refreshOverflow();
  }

  function close() {
    var shell = openShell;
    if (!shell) return;

    // Put a pulled-in results panel back where it came from.
    if (shell._results && shell._resultsHome) {
      var home = shell._resultsHome;
      if (home.parent) {
        if (home.next && home.next.parentNode === home.parent) {
          home.parent.insertBefore(shell._results, home.next);
        } else {
          home.parent.appendChild(shell._results);
        }
      }
      shell._results = null;
      shell._resultsHome = null;
    }

    shell.classList.remove("is-maximised");
    document.body.classList.remove("has-maximised-code");
    openShell = null;

    var btn = shell.querySelector(".code-maximise");
    if (btn) { paint(btn, false); try { btn.focus(); } catch (e) {} }
    // Back in the small box, so the "more code" hint may be needed again.
    if (shell._refreshOverflow) setTimeout(shell._refreshOverflow, 0);
  }

  function toggle(shell) {
    if (shell.classList.contains("is-maximised")) close();
    else open(shell);
  }

  /* Bottom expansion, borrowed from PyWebLib.
   *
   * The editor is a fixed-height box with the code scrolling inside it, so a
   * program longer than the box just gets cut off at a hard edge. Nothing
   * tells a student the rest of their program is down there, and plenty of
   * them never think to scroll a panel that does not look scrollable.
   *
   * So: fade the last stretch out when there is more below, and float a pill
   * over it that opens the editor full screen. The fade lifts once they reach
   * the end, because at that point it is only hiding the last line.
   */
  var CHEV =
    '<svg viewBox="0 0 12 8" width="11" height="8" aria-hidden="true" fill="none"' +
    ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M1 1l5 5 5-5"/></svg>';

  function setupOverflow(shell, editor) {
    var code = editor.querySelector(".sandbox-code");
    if (!code) return;
    /* Why the code box is capped (see styles.css .sandbox-code max-height).
     *
     * The editor is flex: 1 in a stretch grid with no maximum, so a long
     * program does not scroll inside its box: it makes the box taller and
     * shoves the output panel off the bottom of the screen. Capping it means
     * long code scrolls in place, which is what makes a fade and an expand
     * pill meaningful in the first place.
     *
     * The cap is a viewport fraction in CSS rather than the height of the
     * output column, which would be circular: the columns stretch to match
     * each other, so measuring the output while the editor is uncapped just
     * measures the editor again.
     */
    var fade = document.createElement("div");
    fade.className = "code-fade";
    editor.appendChild(fade);

    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "code-more";
    pill.innerHTML = "<span>More code</span>" + CHEV;
    pill.title = "Open the editor full screen";
    pill.addEventListener("click", function () { open(shell); });
    editor.appendChild(pill);

    function refresh() {
      // Maximised already shows everything, so there is nothing to hint at.
      if (shell.classList.contains("is-maximised")) {
        editor.classList.remove("can-expand");
        return;
      }
      var over = code.scrollHeight > code.clientHeight + 4;
      editor.classList.toggle("can-expand", over);
      var atEnd = code.scrollTop + code.clientHeight >= code.scrollHeight - 6;
      editor.classList.toggle("scrolled-end", atEnd);
    }

    code.addEventListener("scroll", refresh);
    code.addEventListener("input", refresh);
    code.addEventListener("keyup", refresh);
    window.addEventListener("resize", refresh);
    if (window.ResizeObserver) {
      try { new ResizeObserver(refresh).observe(editor); } catch (e) {}
    }
    // The editor is filled in by another script, so check again once it has.
    requestAnimationFrame(refresh);
    setTimeout(refresh, 400);
    shell._refreshOverflow = refresh;
  }

  function setup(shell) {
    if (shell.dataset.maximiseReady) return; // idempotent if the script loads twice
    var actions = shell.querySelector(".sandbox-editor .sandbox-bar-actions");
    if (!actions) return; // no editor bar to attach to, skip
    shell.dataset.maximiseReady = "1";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost code-maximise";
    paint(btn, false);
    btn.addEventListener("click", function () { toggle(shell); });
    actions.insertBefore(btn, actions.firstChild);

    var editor = shell.querySelector(".sandbox-editor");
    if (editor) setupOverflow(shell, editor);

    // Click the dimmed area around the panels to exit.
    shell.addEventListener("click", function (e) {
      if (e.target === shell && shell.classList.contains("is-maximised")) close();
    });
  }

  function init() {
    var shells = document.querySelectorAll(".sandbox-shell");
    for (var i = 0; i < shells.length; i++) setup(shells[i]);
  }

  document.addEventListener("keydown", function (e) {
    if (openShell && (e.key === "Escape" || e.key === "Esc")) {
      e.preventDefault();
      close();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
