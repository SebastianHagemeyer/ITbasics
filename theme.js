/* Light and dark.
 *
 * The theme itself is already decided by the inline script in
 * partials/head-top.html, which runs before the page paints so nobody sees a
 * white flash on the way to a dark page. This file is the part that can wait:
 * changing the choice, remembering it, and following the machine for anyone
 * who has never expressed a preference.
 *
 * Three states, not two. "Match my device" is a real answer, and a plain
 * on/off switch cannot get back to it once pressed.
 */
(function () {
  "use strict";

  var KEY = "itbasics-theme";
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function systemPrefersDark() {
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      return false;
    }
  }

  function paint(dark) {
    if (dark) root.dataset.theme = "dark";
    else delete root.dataset.theme;
  }

  // "light" | "dark" | "system"
  function mode() {
    return stored() || "system";
  }

  function setMode(next) {
    try {
      if (next === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch (e) {
      /* Private browsing. The theme still applies for this page. */
    }
    apply();
    try {
      window.dispatchEvent(new CustomEvent("itbasics:theme", {
        detail: { mode: mode(), dark: root.dataset.theme === "dark" }
      }));
    } catch (e) {}
  }

  function apply() {
    var saved = stored();
    paint(saved ? saved === "dark" : systemPrefersDark());
  }

  // Someone who has never chosen keeps following their machine, including when
  // it flips at sunset.
  try {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSystem = function () { if (!stored()) apply(); };
    if (mq.addEventListener) mq.addEventListener("change", onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  } catch (e) {}

  // A choice made in one tab should reach the others.
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) apply();
  });

  window.ITTheme = { mode: mode, setMode: setMode, apply: apply };
})();
