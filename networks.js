(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Hub vs switch: A wants to reach D. A hub copies to everyone (collision
  // risk); a switch sends only to D.
  // ------------------------------------------------------------------
  function initNetDemo() {
    var net = document.querySelector(".netdemo");
    if (!net) return;
    var pcs = net.querySelectorAll(".netpc");
    var msg = net.querySelector(".netdemo-msg");
    function clear() { pcs.forEach(function (p) { p.classList.remove("lit", "target"); }); }

    net.querySelector(".netdemo-hub").addEventListener("click", function () {
      clear();
      pcs.forEach(function (p) { p.classList.add("lit"); });
      msg.className = "netdemo-msg warn";
      msg.textContent = "A hub copies the data to EVERY computer, so they all have to check “is this for me?”. If two computers send at the same time the signals collide and must be resent. Wasteful and slow.";
    });

    net.querySelector(".netdemo-switch").addEventListener("click", function () {
      clear();
      var t = net.querySelector(".netpc[data-target]");
      if (t) t.classList.add("lit", "target");
      msg.className = "netdemo-msg ok";
      msg.textContent = "A switch is smart: it learns where each computer is and sends the data ONLY to D. No wasted copies, and far fewer collisions.";
    });
  }

  // ------------------------------------------------------------------
  // Phishing spotter: safe or scam, with the red flags revealed.
  // ------------------------------------------------------------------
  function initPhish() {
    document.querySelectorAll(".phish-card").forEach(function (card) {
      var answer = card.dataset.answer;
      var explain = card.querySelector(".phish-explain");
      var done = false;
      card.querySelectorAll(".phish-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (done) return;
          done = true;
          opt.classList.add(opt.dataset.key === answer ? "right" : "wrongpick");
          card.classList.add(answer === "scam" ? "is-scam" : "is-safe");
          if (explain) explain.hidden = false;
          card.querySelectorAll(".phish-opt").forEach(function (o) { o.disabled = true; });
        });
      });
    });
  }

  // Knowledge checks (formative), shared shape with the other modules.
  function initChecks() {
    document.querySelectorAll(".kcheck").forEach(function (kc) {
      var answer = kc.dataset.answer;
      var feedback = kc.querySelector(".kcheck-feedback");
      var explain = kc.querySelector(".kcheck-explain");
      var solved = false;
      kc.querySelectorAll(".kcheck-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (solved) return;
          if (opt.dataset.key === answer) {
            solved = true;
            opt.classList.add("correct");
            feedback.textContent = "Correct!";
            feedback.className = "kcheck-feedback correct";
            feedback.hidden = false;
            if (explain) explain.hidden = false;
            kc.querySelectorAll(".kcheck-opt").forEach(function (o) { o.disabled = true; });
          } else {
            opt.classList.add("wrong");
            opt.disabled = true;
            feedback.textContent = "Not quite, try again.";
            feedback.className = "kcheck-feedback wrong";
            feedback.hidden = false;
          }
        });
      });
    });
  }

  function boot() {
    if (!window.ITBasics || !window.ITBasics.getSession()) { location.replace("/"); return; }
    initNetDemo();
    initPhish();
    initChecks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
