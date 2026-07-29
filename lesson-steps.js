/* lesson-steps.js
 *
 * Progressive reveal for module lesson pages. Only the section you are up to
 * is open; everything below is collapsed to a greyed heading with a small
 * "keep going" line, so the page stops being a wall of text.
 *
 * How a section is cleared:
 *   a check for understanding   answer it correctly
 *   the quick check / test      submit it
 *   anything else               press Continue
 *
 * Progress is saved per student per module in quiz_progress under the name
 * "unlocked-<module>", so it follows them between devices and survives a
 * reload. A copy is kept in localStorage purely so the first paint after a
 * reload is already right, instead of collapsing and then springing open when
 * the network answers. Sections already cleared stay open for reference.
 *
 * Safety: this fails OPEN. No session, unknown module, storage error or a
 * missing dependency all leave the page exactly as it was, fully readable.
 * Locking content is never allowed to be the failure mode. Staff are never
 * gated at all.
 */
(function () {
  "use strict";

  // Reference sections nobody should have to unlock to look something up.
  var NEVER_GATE = { glossary: 1, reference: 1, wrap: 1 };

  function moduleKey() {
    var m = location.pathname.match(/^\/topics\/([a-z0-9-]+)\/$/);
    return m ? m[1] : null;
  }

  function isStaff(session) {
    var codes = window.TEACHER_CODES;
    return Array.isArray(codes) && codes.indexOf(session.code) !== -1;
  }

  function init() {
    var key = moduleKey();
    var article = document.querySelector("article.lesson");
    if (!key || !article || !window.ITBasics) return;
    var session = window.ITBasics.getSession();
    if (!session || isStaff(session)) return;

    var sections = Array.prototype.slice.call(article.querySelectorAll(":scope > section[id]"))
      .filter(function (s) {
        return !NEVER_GATE[s.id] && s.dataset.gate !== "off" && s.querySelector("h2");
      });
    if (sections.length < 3) return;   // too short to be worth gating

    var STORE = "unlocked-" + key;
    var MIRROR = "itbasics-unlocked-" + session.code + "-" + key;
    var cleared = {};      // section id -> true
    var steps = [];
    var booted = false;    // true once the student is driving, not the restore

    // ---- how a section gets cleared ------------------------------------
    function gateOf(sec) {
      if (sec.querySelector(".kcheck")) return "kcheck";
      if (sec.querySelector(".module-test")) return "test";
      return "continue";
    }

    function kchecksPassed(sec) {
      var all = sec.querySelectorAll(".kcheck");
      if (!all.length) return false;
      return Array.prototype.every.call(all, function (kc) {
        return kc.querySelector(".kcheck-feedback.correct");
      });
    }

    function testSubmitted(sec) {
      var r = sec.querySelector(".mtest-result");
      return Boolean(r && !r.hidden);
    }

    function save() {
      try { localStorage.setItem(MIRROR, JSON.stringify(cleared)); } catch (e) {}
      try { window.ITBasics.saveProgress(STORE, cleared); } catch (e) {}
    }

    function absorb(saved) {
      if (!saved || typeof saved !== "object") return;
      Object.keys(saved).forEach(function (id) { if (saved[id]) cleared[id] = true; });
    }

    function clear(id) {
      if (cleared[id]) return;
      cleared[id] = true;
      save();
      paint();
      if (!booted) return;   // restoring saved progress, do not hijack the scroll
      var next = steps.find(function (st) { return !cleared[st.sec.id]; });
      if (next) next.sec.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // ---- build ---------------------------------------------------------
    sections.forEach(function (sec, i) {
      var h2 = sec.querySelector("h2");
      var body = document.createElement("div");
      body.className = "ls-body";
      var node = h2.nextSibling;
      while (node) {
        var nxt = node.nextSibling;
        body.appendChild(node);
        node = nxt;
      }
      sec.appendChild(body);

      var note = document.createElement("p");
      note.className = "ls-locked-note";
      note.textContent = "Finish the part above to open this.";
      sec.appendChild(note);

      var gate = gateOf(sec);
      var btn = null;
      if (gate === "continue" && i < sections.length - 1) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-primary ls-continue";
        btn.textContent = "Continue";
        btn.addEventListener("click", function () { clear(sec.id); });
        body.appendChild(btn);
      }
      steps.push({ sec: sec, h2: h2, body: body, note: note, gate: gate, btn: btn });
    });

    function paint() {
      var reached = true;    // everything up to the first uncleared stays open
      var noted = false;     // the "keep going" line, once, on the next one up
      steps.forEach(function (st) {
        var open = reached;
        var done = Boolean(cleared[st.sec.id]);
        if (!done) reached = false;
        st.sec.classList.toggle("ls-locked", !open);
        st.sec.classList.toggle("ls-done", done);
        st.body.hidden = !open;
        st.note.hidden = open || noted;
        if (!open) noted = true;
        // Once a part is behind them the Continue button has nothing left to
        // do, so it goes rather than sitting there looking clickable.
        if (st.btn) st.btn.hidden = done;
        // Locked sections are greyed out in the contents list too.
        var link = document.querySelector('.lesson-toc a[href="#' + st.sec.id + '"]');
        if (link) link.classList.toggle("ls-link-locked", !open);
      });
    }

    // Watch for the gates that clear themselves: a correct check, or a
    // submitted quick check. Both are plain DOM changes, so one delegated
    // listener plus a short recheck covers them.
    function recheck() {
      steps.forEach(function (st) {
        if (cleared[st.sec.id]) return;
        if (st.gate === "kcheck" && kchecksPassed(st.sec)) clear(st.sec.id);
        if (st.gate === "test" && testSubmitted(st.sec)) clear(st.sec.id);
      });
    }
    document.addEventListener("click", function () { setTimeout(recheck, 60); }, true);
    window.addEventListener("itbasics:attempt", function () { setTimeout(recheck, 60); });

    // ---- restore saved progress ----------------------------------------
    // The local mirror paints immediately; the saved copy catches them up if
    // they got further on another machine.
    try { absorb(JSON.parse(localStorage.getItem(MIRROR))); } catch (e) {}
    paint();
    Promise.resolve(window.ITBasics.loadProgress(STORE)).then(function (saved) {
      absorb(saved);
      paint();
      recheck();
      booted = true;
    }).catch(function () { booted = true; });
  }

  function boot() {
    try { init(); } catch (e) { /* fail open: leave the page readable */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
