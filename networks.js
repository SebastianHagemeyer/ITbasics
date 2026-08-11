(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Hub vs switch, drawn rather than described.
  //
  // The old version lit up some boxes and put a paragraph underneath, which
  // asked the student to imagine the part that matters. Here the device in the
  // middle is actually on screen, and the data is a green ball you can watch
  // leave A, reach the device, and come out the other side: once to everybody
  // for a hub, once to D for a switch.
  //
  // The third button exists because this section is called "Hubs, switches and
  // collisions" and a collision was the one idea with nothing to look at. Two
  // balls set off together, meet in the middle, and go red.
  //
  // The SVG is aria-hidden and the paragraph under it is the live region: the
  // explanation is the thing worth reading out, not the geometry.
  // ------------------------------------------------------------------
  // y sits just above the box tops (168) so an arriving ball reads as landing
  // on the computer rather than embedded in its border.
  var NET_PC = {
    A: { x: 50, y: 160 },
    B: { x: 158, y: 160 },
    C: { x: 266, y: 160 },
    D: { x: 374, y: 160 }
  };
  var NET_HUB = { x: 220, y: 70 };
  var SVG_NS = "http://www.w3.org/2000/svg";

  function initNetDemo() {
    var net = document.querySelector(".netdemo");
    if (!net) return;
    var svg = net.querySelector(".netdemo-svg");
    var layer = net.querySelector(".nd-packets");
    var msg = net.querySelector(".netdemo-msg");
    var deviceName = net.querySelector(".nd-device-name");
    var deviceSub = net.querySelector(".nd-device-sub");
    var deviceBox = net.querySelector(".nd-device");
    var pcs = {};
    net.querySelectorAll(".nd-pc").forEach(function (g) { pcs[g.dataset.pc] = g; });
    if (!svg || !layer || !msg) return;

    var running = null;             // cancels whatever is mid-flight
    var still = false;
    try {
      still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) { /* animate, then */ }

    function reset() {
      if (running) { cancelAnimationFrame(running); running = null; }
      layer.textContent = "";
      Object.keys(pcs).forEach(function (k) {
        pcs[k].classList.remove("is-sending", "is-target", "is-ignoring", "is-hit");
        var note = pcs[k].querySelector(".nd-pc-note");
        if (note) note.textContent = "";
      });
      deviceBox.classList.remove("is-busy", "is-clash");
    }

    function setDevice(name, sub, cls) {
      deviceName.textContent = name;
      deviceSub.textContent = sub;
      deviceBox.setAttribute("class", "nd-device" + (cls ? " " + cls : ""));
    }

    function ball(cls) {
      var c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("r", "8");
      c.setAttribute("class", "nd-packet" + (cls ? " " + cls : ""));
      layer.appendChild(c);
      return c;
    }

    function place(c, p) {
      c.setAttribute("cx", p.x);
      c.setAttribute("cy", p.y);
    }

    // Move a set of balls along their own from/to pairs together, then call
    // done. One rAF loop drives all of them so they cannot drift apart.
    function fly(trips, ms, done) {
      trips.forEach(function (t) { place(t.ball, t.from); });
      if (still) {
        trips.forEach(function (t) { place(t.ball, t.to); });
        done();
        return;
      }
      var t0 = null;
      function step(now) {
        if (t0 === null) t0 = now;
        var k = Math.min(1, (now - t0) / ms);
        // Ease out, so the ball arrives like it is being received rather than
        // slamming into the box.
        var e = 1 - Math.pow(1 - k, 2);
        trips.forEach(function (t) {
          place(t.ball, {
            x: t.from.x + (t.to.x - t.from.x) * e,
            y: t.from.y + (t.to.y - t.from.y) * e
          });
        });
        if (k < 1) { running = requestAnimationFrame(step); }
        else { running = null; done(); }
      }
      running = requestAnimationFrame(step);
    }

    function note(k, text) {
      var n = pcs[k].querySelector(".nd-pc-note");
      if (n) n.textContent = text;
    }

    function send(mode) {
      reset();
      pcs.A.classList.add("is-sending");

      if (mode === "collide") {
        setDevice("HUB", "one wire, one at a time", "is-busy");
        pcs.C.classList.add("is-sending");
        msg.className = "netdemo-msg";
        msg.textContent = "A and C both start sending…";
        var a = ball(), c = ball();
        // Stop them just short of the hub: the point is that they meet.
        var meetA = { x: NET_HUB.x - 14, y: NET_HUB.y + 12 };
        var meetC = { x: NET_HUB.x + 14, y: NET_HUB.y + 12 };
        fly([
          { ball: a, from: NET_PC.A, to: meetA },
          { ball: c, from: NET_PC.C, to: meetC }
        ], 700, function () {
          a.setAttribute("class", "nd-packet is-clash");
          c.setAttribute("class", "nd-packet is-clash");
          deviceBox.classList.add("is-clash");
          pcs.A.classList.add("is-hit");
          pcs.C.classList.add("is-hit");
          note("A", "resend");
          note("C", "resend");
          msg.className = "netdemo-msg warn";
          msg.textContent = "Collision. A hub has one shared line, so two messages at once " +
            "wreck each other and both computers have to send again. That is the " +
            "problem switches were invented to fix.";
        });
        return;
      }

      var isHub = mode === "hub";
      setDevice(isHub ? "HUB" : "SWITCH",
                isHub ? "copies to everyone" : "sends it to D only",
                "is-busy");
      msg.className = "netdemo-msg";
      msg.textContent = "A sends the data to the " + (isHub ? "hub" : "switch") + "…";

      var up = ball();
      fly([{ ball: up, from: NET_PC.A, to: NET_HUB }], 650, function () {
        layer.removeChild(up);
        var outs = isHub ? ["B", "C", "D"] : ["D"];
        var trips = outs.map(function (k) {
          return { ball: ball(k === "D" ? "" : "is-wasted"), from: NET_HUB, to: NET_PC[k], key: k };
        });
        fly(trips, 650, function () {
          trips.forEach(function (t) {
            if (t.key === "D") {
              pcs.D.classList.add("is-target");
              note("D", "for me!");
            } else {
              pcs[t.key].classList.add("is-ignoring");
              note(t.key, "not for me");
            }
          });
          if (isHub) {
            msg.className = "netdemo-msg warn";
            msg.textContent = "A hub copies the data to EVERY computer, so B and C both have to " +
              "stop and check “is this for me?” before throwing it away. Wasteful, " +
              "and with everyone sharing one line, collisions are easy.";
          } else {
            msg.className = "netdemo-msg ok";
            msg.textContent = "A switch remembers which computer is on which port, so the data " +
              "goes straight to D and nobody else is bothered. No wasted copies, " +
              "far fewer collisions.";
          }
        });
      });
    }

    net.querySelector(".netdemo-hub").addEventListener("click", function () { send("hub"); });
    net.querySelector(".netdemo-switch").addEventListener("click", function () { send("switch"); });
    var clash = net.querySelector(".netdemo-collide");
    if (clash) clash.addEventListener("click", function () { send("collide"); });
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
