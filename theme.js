/* The dark/light switch in the header.
 *
 * The theme itself is already decided by the inline script in
 * partials/head-top.html, which runs before the page paints. This file only
 * handles the button: keeping its label honest, writing the choice down, and
 * following the system setting for anyone who has never pressed it.
 */
(function () {
  "use strict";

  var KEY = "itbasics-theme";
  var root = document.documentElement;

  function isDark() {
    return root.dataset.theme === "dark";
  }

  function apply(dark) {
    if (dark) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    paint();
  }

  function paint() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var dark = isDark();
    // The button says what pressing it will do, not what the page currently is.
    var next = dark ? "Light" : "Dark";
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute("aria-label", "Switch to " + next.toLowerCase() + " mode");
    btn.title = "Switch to " + next.toLowerCase() + " mode";
    var label = btn.querySelector(".theme-toggle-label");
    if (label) label.textContent = next;
  }

  function boot() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    paint();

    btn.addEventListener("click", function () {
      var dark = !isDark();
      apply(dark);
      try {
        localStorage.setItem(KEY, dark ? "dark" : "light");
      } catch (e) {
        /* Nothing to do: the theme still applies for this page. */
      }
      // Other tabs of the site should not sit on the old theme.
      try {
        window.dispatchEvent(new CustomEvent("itbasics:theme", {
          detail: { dark: dark }
        }));
      } catch (e) {}
    });
  }

  // Someone who has never chosen keeps following their machine, including when
  // it flips at sunset.
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSystem = function (e) {
      var saved = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch (err) {}
      if (!saved) apply(e.matches);
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  } catch (e) {}

  // A choice made in one tab should reach the others.
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && e.newValue) apply(e.newValue === "dark");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
