/* xp-fx.js
 *
 * The reward animations for XP, ported from the choices made in
 * xp-demo.html. That page is the argument; this is the implementation.
 *
 *   coding task   50   fly to badge
 *   module test   25   fly to badge
 *   freeplay       1   classic pop
 *   spot the error 2   classic pop
 *   crossing a level    full screen card
 *
 * Two rules carried over from the sandbox. How hard the screen flashes is a
 * function of the PAYOUT, not of the feel, or a 1 XP freeplay answer
 * out-glows a 50 XP challenge and the screen shouts loudest about the
 * cheapest thing on the site. And the number is the actual reward:
 * everything here is decoration pointing at it, which is why the caller
 * hands us a commit function and we choose when to run it.
 *
 * Nothing here decides how much XP anything is worth. xp.js works that out
 * and calls award() with the difference it already computed.
 */
(function () {
  "use strict";

  function reduced() {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) { return false; }
  }

  function centreOf(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function badgeEl() { return document.querySelector(".auth-level"); }

  function badgePoint() {
    var b = badgeEl();
    if (b) return centreOf(b);
    return { x: window.innerWidth - 120, y: 40 };
  }

  /* Where the XP was earned. The live site has no single answer, so ask the
     page what it is showing: the quiz result, the challenge feedback, the
     freeplay card. Falls back to the middle of the screen. */
  var SOURCES = {
    task:     [".challenge-results", ".sandbox-shell", "#challenge-code"],
    quiz:     [".mtest-result", ".module-test"],
    freeplay: ["#fp-feedback", "#fp-card"]
  };

  function originFor(kind) {
    var list = SOURCES[kind] || [];
    for (var i = 0; i < list.length; i++) {
      var el = document.querySelector(list[i]);
      if (el && el.offsetParent !== null) return centreOf(el);
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  // ---- the parts everything is built from -------------------------------

  function glowLayer() {
    var g = document.getElementById("xp-glow");
    if (!g) {
      g = document.createElement("div");
      g.id = "xp-glow";
      document.body.appendChild(g);
    }
    return g;
  }

  function screenGlow(kind) {
    if (reduced()) return;
    var g = glowLayer();
    g.className = "";
    void g.offsetWidth;                 // restart the animation
    g.className = kind;
  }

  function chip(pt, text, style) {
    var el = document.createElement("div");
    el.className = "xp-pop " + (style || "");
    el.textContent = text;
    el.style.left = pt.x + "px";
    el.style.top = pt.y + "px";
    document.body.appendChild(el);
    el.addEventListener("animationend", function () { el.remove(); });
    return el;
  }

  function badgeHit(cls) {
    var b = badgeEl();
    if (!b) return;
    b.classList.remove("thump", "nudge");
    void b.offsetWidth;
    b.classList.add(cls);
  }

  /* The arc into the badge. Web Animations rather than CSS, because how far
     away the badge is only becomes known when it fires. */
  function flyToBadge(from, amount, then) {
    if (reduced() || !document.body.animate) { if (then) then(); return; }
    var b = badgePoint();
    var el = chip(from, "+" + amount + " XP", "");
    var dx = b.x - from.x, dy = b.y - from.y;
    var anim = el.animate([
      { transform: "translate(-50%,-50%) scale(.5)", opacity: 0 },
      { transform: "translate(-50%,-50%) translate(0,-40px) scale(1.15)", opacity: 1, offset: 0.22 },
      { transform: "translate(-50%,-50%) translate(0,-46px) scale(1)", opacity: 1, offset: 0.48 },
      { transform: "translate(-50%,-50%) translate(" + dx * 0.5 + "px," + (dy * 0.5 - 70) + "px) scale(.9)",
        opacity: 1, offset: 0.74 },
      { transform: "translate(-50%,-50%) translate(" + dx + "px," + dy + "px) scale(.35)", opacity: 0 }
    ], { duration: 1150, easing: "cubic-bezier(.35,.05,.2,1)", fill: "forwards" });
    anim.onfinish = function () { el.remove(); if (then) then(); };
  }

  // Flash strength follows the payout, never the feel.
  function glowFor(amount) { return amount >= 25 ? "on" : "soft"; }

  var FEELS = {
    pop: function (at, amount, commit) {
      screenGlow(glowFor(amount));
      chip(at, "+" + amount + " XP", "rise");
      badgeHit("thump");
      window.setTimeout(commit, 120);
    },
    fly: function (at, amount, commit) {
      screenGlow(glowFor(amount));
      flyToBadge(at, amount, function () { badgeHit("thump"); commit(); });
    },
    quiet: function (at, amount, commit) {
      chip(at, "+" + amount, "tick");
      badgeHit("nudge");
      commit();
    }
  };

  var PICKED = { task: "fly", quiz: "fly", freeplay: "pop" };

  function levelUp(state) {
    // Only ever one on screen. Clearing several levels in one go (finishing a
    // big task can do it) otherwise stacks cards on top of each other, and
    // the one you end up reading is the oldest and lowest.
    var open = document.querySelectorAll(".levelup");
    for (var i = 0; i < open.length; i++) open[i].remove();

    var card = document.createElement("div");
    card.className = "levelup";
    card.innerHTML =
      '<div class="lu-card">' +
        '<p class="lu-eyebrow">Level up</p>' +
        '<div class="lu-ring">' + state.level + "</div>" +
        '<h2 class="lu-title">' + state.name + "</h2>" +
        '<p class="lu-sub">' + state.xp + " XP total</p>" +
        (state.newTitle ? '<span class="lu-new">New title unlocked</span>' : "") +
      "</div>";
    document.body.appendChild(card);
    // The card and its children all animate, so wait for the outer one only.
    card.addEventListener("animationend", function (e) {
      if (e.target === card) card.remove();
    });
    // Belt and braces: if the animation never fires (a background tab will
    // do it), the card must still not sit there forever.
    window.setTimeout(function () { if (card.parentNode) card.remove(); }, 6000);
  }

  /* kind      "task" | "quiz" | "freeplay"
   * amount    the XP actually gained, worked out by xp.js
   * commit    updates the badge and panel; we choose the moment
   * levelled  the new state when a level was crossed, otherwise null
   */
  function award(kind, amount, commit, levelled) {
    var run = FEELS[PICKED[kind]] || FEELS.pop;
    if (reduced()) run = FEELS.quiet;
    try {
      run(originFor(kind), amount, commit);
    } catch (e) {
      commit();                        // a broken effect must never cost XP
    }
    if (levelled) {
      window.setTimeout(function () { levelUp(levelled); }, kind === "freeplay" ? 700 : 1400);
    }
  }

  window.ITXPFX = { award: award, levelUp: levelUp };
})();
