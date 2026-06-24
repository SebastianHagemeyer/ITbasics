/* code-maximise.js
 *
 * Reusable "maximise / pop-out" control for the code shells (.sandbox-shell)
 * used on the Live Coding page, the Sandbox, and the embedded module tasks
 * (e.g. /topics/decisions/). It adds a Maximise button to each shell's editor
 * bar that expands the shell into a full-screen focus overlay so learners get
 * real room to type — editor and terminal side by side, plus any pass/fail
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
  }

  function toggle(shell) {
    if (shell.classList.contains("is-maximised")) close();
    else open(shell);
  }

  function setup(shell) {
    if (shell.dataset.maximiseReady) return; // idempotent if the script loads twice
    var actions = shell.querySelector(".sandbox-editor .sandbox-bar-actions");
    if (!actions) return; // no editor bar to attach to — skip
    shell.dataset.maximiseReady = "1";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost code-maximise";
    paint(btn, false);
    btn.addEventListener("click", function () { toggle(shell); });
    actions.insertBefore(btn, actions.firstChild);

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
