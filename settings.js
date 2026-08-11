/* settings.js
 *
 * The Settings block at the bottom of My Journey: pick your icon and your
 * house colour, and decide how loud the XP rewards are.
 *
 * Two decisions worth knowing about.
 *
 * There is no Save button. Tapping a colour or an icon saves it there and
 * then. A save button is one more thing to explain and one more way to lose
 * a choice by wandering off the page, and there is nothing here worth
 * confirming: every option is one tap to undo.
 *
 * The icons are drawn in the colour you have currently got selected, not in
 * grey. You are choosing the actual thing that will sit next to your name,
 * so it should look like the actual thing while you choose it. Locked ones
 * are dimmed rather than hidden, for the same reason: you cannot want an
 * icon you have never seen.
 */
(function () {
  "use strict";

  var PANEL_ID = "settings-panel";

  var FX_OPTIONS = [
    { id: "full",  label: "Full",  note: "Flying XP and a level up card" },
    { id: "quiet", label: "Quiet", note: "The number goes up, nothing else moves" },
    { id: "off",   label: "Off",   note: "Nothing on screen. XP still counts" }
  ];

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // What we are editing. Starts from whatever is cached so the panel can draw
  // before the network answers, then gets corrected once it does.
  var pick = { shape: null, house: null };
  var student = null;
  var savedTimer = 0;
  var touched = false;   // has the student changed anything on this page yet
  var myLevel = 1;

  /* Staff have no XP of their own worth speaking of, so gating them out of
     three icons would be the lock working backwards. Same rule xp.js uses for
     its own content gate. */
  function isStaff() {
    var codes = window.TEACHER_CODES;
    return Boolean(student && Array.isArray(codes) && codes.indexOf(student.code) !== -1);
  }

  function locked(shapeId) {
    if (isStaff()) return false;
    return myLevel < A().requiredLevel(shapeId);
  }

  /* xp.js has usually worked the level out already, from its cache, before
     this panel is built. If it has not, ask it once. Missing xp.js entirely
     means no level information, and in that case nothing is locked: a student
     should never be shut out of an icon by a script that failed to load. */
  async function loadLevel() {
    if (!window.ITXP) { myLevel = 99; return; }
    var now = window.ITXP.current();
    if (now && typeof now.level === "number") { myLevel = now.level; return; }
    try {
      var state = await window.ITXP.load(student);
      if (state && typeof state.level === "number") myLevel = state.level;
    } catch (e) { /* leave it at 1 */ }
  }

  function A() { return window.ITAvatars; }

  function houseName(id) {
    var found = A().HOUSES.filter(function (h) { return h.id === id; })[0];
    return found ? found.name : "";
  }

  function previewSvg(size) {
    return A().render(pick, student && (student.first_name || student.code), size);
  }

  function paintPreview() {
    var box = document.getElementById("avatar-preview");
    if (box) box.innerHTML = previewSvg(76);
    var sub = document.getElementById("avatar-preview-sub");
    if (sub) {
      sub.textContent = pick.shape
        ? houseName(pick.house)
        : "No icon picked yet, so your initial shows instead.";
    }
  }

  // Every icon redraws in the currently selected colour, and the selected one
  // gets the ring. Cheap enough to just rebuild the lot on any change.
  function paintShapes() {
    var grid = document.getElementById("avatar-shapes");
    if (!grid) return;
    grid.innerHTML = A().SHAPES.map(function (s) {
      var on = s.id === pick.shape;
      var shut = locked(s.id);
      var need = A().requiredLevel(s.id);
      // Locked ones are still drawn in full colour, just dimmed. Showing a
      // grey blank would hide the thing they are working towards, which is
      // the entire point of locking it.
      return '<button type="button" class="avatar-choice' + (on ? " on" : "") +
        (shut ? " locked" : "") + '" role="radio" ' +
        'aria-checked="' + (on ? "true" : "false") + '" ' +
        (shut ? 'aria-disabled="true" ' : "") +
        'data-shape="' + s.id + '" title="' +
        escapeHtml(shut ? s.label + ", unlocks at Level " + need : s.label) + '">' +
        A().svg(s.id, pick.house, 44) +
        (shut ? '<span class="avatar-lock">Lv ' + need + "</span>" : "") +
        '<span class="avatar-choice-label">' + escapeHtml(s.label) + "</span></button>";
    }).join("");
  }

  function paintHouses() {
    var row = document.getElementById("avatar-houses");
    if (!row) return;
    row.innerHTML = A().HOUSES.map(function (h) {
      var on = h.id === pick.house;
      return '<button type="button" class="house-choice' + (on ? " on" : "") + '" ' +
        'role="radio" aria-checked="' + (on ? "true" : "false") + '" data-house="' + h.id + '">' +
        '<span class="house-dot" style="background:' + h.colour + '"></span>' +
        escapeHtml(h.name) + "</button>";
    }).join("");
  }

  // Doubles as the "locked" nudge, so it carries a tone: a level requirement
  // is information, not a success, and should not read as a green tick.
  function flashSaved(msg, tone) {
    var tag = document.getElementById("avatar-saved");
    if (!tag) return;
    tag.textContent = msg || "Saved";
    tag.className = "settings-saved" + (tone === "info" ? " info" : "");
    tag.hidden = false;
    void tag.offsetWidth;
    tag.classList.add("show");
    window.clearTimeout(savedTimer);
    savedTimer = window.setTimeout(function () { tag.hidden = true; }, 2600);
  }

  async function commitPick() {
    touched = true;
    paintPreview();
    paintShapes();
    paintHouses();
    var ok = await A().choose(pick.shape, pick.house);
    flashSaved(ok ? "Saved" : "Saved on this device only");
  }

  function paintFx() {
    var row = document.getElementById("fx-choices");
    if (!row || !window.ITXPFX) return;
    var now = window.ITXPFX.mode();
    row.innerHTML = FX_OPTIONS.map(function (o) {
      var on = o.id === now;
      return '<button type="button" class="fx-choice' + (on ? " on" : "") + '" ' +
        'role="radio" aria-checked="' + (on ? "true" : "false") + '" data-fx="' + o.id + '">' +
        '<strong>' + escapeHtml(o.label) + "</strong>" +
        '<span>' + escapeHtml(o.note) + "</span></button>";
    }).join("");
  }

  // Line numbers in the code editors. The key is the contract with
  // line-numbers.js, which does the drawing on the ten pages that have an
  // editor; it is not loaded here, so this writes the key directly.
  var LINE_KEY = "itbasics-linenums";
  var LINE_OPTIONS = [
    { id: "off", label: "Off", note: "Just the code" },
    { id: "on", label: "On", note: "Numbered down the side" },
  ];

  function lineMode() {
    try {
      return localStorage.getItem(LINE_KEY) === "on" ? "on" : "off";
    } catch (e) {
      return "off";
    }
  }

  function setLineMode(m) {
    try {
      localStorage.setItem(LINE_KEY, m === "on" ? "on" : "off");
    } catch (e) { /* nothing to do */ }
    // If an editor happens to be on this page, update it now rather than on
    // the next load. My Journey has none today, but that is not a guarantee.
    if (window.ITLineNums && window.ITLineNums.setMode) window.ITLineNums.setMode(m);
  }

  function paintLines() {
    var row = document.getElementById("lines-choices");
    if (!row) return;
    var now = lineMode();
    row.innerHTML = LINE_OPTIONS.map(function (o) {
      var on = o.id === now;
      return '<button type="button" class="fx-choice' + (on ? " on" : "") + '" ' +
        'role="radio" aria-checked="' + (on ? "true" : "false") + '" data-lines="' + o.id + '">' +
        "<strong>" + escapeHtml(o.label) + "</strong>" +
        "<span>" + escapeHtml(o.note) + "</span></button>";
    }).join("");
  }

  // "Match my device" is a real answer and has to stay reachable, which is why
  // this is a three-way choice and not a switch.
  var THEME_OPTIONS = [
    { id: "system", label: "Match my device", note: "Follows your settings" },
    { id: "light", label: "Light", note: "Always the pale one" },
    { id: "dark", label: "Dark", note: "Always the dark one" },
  ];

  function paintTheme() {
    var row = document.getElementById("theme-choices");
    if (!row || !window.ITTheme) return;
    var now = window.ITTheme.mode();
    row.innerHTML = THEME_OPTIONS.map(function (o) {
      var on = o.id === now;
      return '<button type="button" class="fx-choice' + (on ? " on" : "") + '" ' +
        'role="radio" aria-checked="' + (on ? "true" : "false") + '" data-theme-set="' + o.id + '">' +
        "<strong>" + escapeHtml(o.label) + "</strong>" +
        "<span>" + escapeHtml(o.note) + "</span></button>";
    }).join("");
  }

  function markup() {
    return (
      '<section class="settings-card">' +
        "<h3>My icon</h3>" +
        '<p class="settings-hint">This is what sits next to your name on the leaderboard. ' +
          "Tap anything to change it, it saves straight away.</p>" +
        '<div class="avatar-preview">' +
          '<div class="avatar-preview-pic" id="avatar-preview"></div>' +
          '<div class="avatar-preview-text">' +
            '<strong id="avatar-preview-name"></strong>' +
            '<span id="avatar-preview-sub"></span>' +
          "</div>" +
          '<span class="settings-saved" id="avatar-saved" hidden>Saved</span>' +
        "</div>" +
        '<p class="settings-label">House colour</p>' +
        '<div class="house-row" id="avatar-houses" role="radiogroup" aria-label="House colour"></div>' +
        '<p class="settings-label">Icon</p>' +
        '<p class="settings-sub">Three of these unlock as you level up.</p>' +
        '<div class="avatar-grid" id="avatar-shapes" role="radiogroup" aria-label="Icon"></div>' +
      "</section>" +
      '<section class="settings-card">' +
        "<h3>XP notifications</h3>" +
        '<p class="settings-hint">How much the screen celebrates when you earn XP. ' +
          "This only changes what you see; your XP is counted the same either way.</p>" +
        '<div class="fx-row" id="fx-choices" role="radiogroup" aria-label="XP notifications"></div>' +
        '<p class="settings-note">Saved on this device. If you sign in on another computer, set it there too.</p>' +
      "</section>" +
      '<section class="settings-card">' +
        "<h3>Light or dark</h3>" +
        '<p class="settings-hint">Dark is easier on the eyes in a dim room. ' +
          '"Match my device" follows whatever your computer or phone is already set to, ' +
          "including when it changes by itself in the evening.</p>" +
        '<div class="fx-row" id="theme-choices" role="radiogroup" aria-label="Light or dark"></div>' +
        '<p class="settings-note">Saved on this device. If you sign in on another computer, set it there too.</p>' +
      "</section>" +
      '<section class="settings-card">' +
        "<h3>Line numbers</h3>" +
        '<p class="settings-hint">Numbers down the side of the code editors, in the Sandbox, ' +
          "Live Coding, the assignments and the lessons. Handy when someone says " +
          '"look at line 7", and easy to switch off if they get in the way.</p>' +
        '<div class="fx-row" id="lines-choices" role="radiogroup" aria-label="Line numbers"></div>' +
        '<p class="settings-note">Saved on this device. If you sign in on another computer, set it there too.</p>' +
      "</section>"
    );
  }

  function wire(panel) {
    panel.addEventListener("click", function (e) {
      var shape = e.target.closest("[data-shape]");
      if (shape) {
        var id = shape.getAttribute("data-shape");
        if (locked(id)) {
          flashSaved("Reach Level " + A().requiredLevel(id) + " to unlock this one", "info");
          return;
        }
        // Tapping the icon you already have turns it back off, which is the
        // only way back to the plain initial once you have chosen one.
        pick.shape = pick.shape === id ? null : id;
        commitPick();
        return;
      }
      var house = e.target.closest("[data-house]");
      if (house) {
        pick.house = house.getAttribute("data-house");
        commitPick();
        return;
      }
      var fx = e.target.closest("[data-fx]");
      if (fx && window.ITXPFX) {
        window.ITXPFX.setMode(fx.getAttribute("data-fx"));
        paintFx();
        flashSaved("Saved");
        return;
      }
      var theme = e.target.closest("[data-theme-set]");
      if (theme && window.ITTheme) {
        window.ITTheme.setMode(theme.getAttribute("data-theme-set"));
        paintTheme();
        flashSaved("Saved");
        return;
      }
      var lines = e.target.closest("[data-lines]");
      if (lines) {
        setLineMode(lines.getAttribute("data-lines"));
        paintLines();
        flashSaved("Saved");
      }
    });
  }

  async function boot() {
    var panel = document.getElementById(PANEL_ID);
    if (!panel || !window.ITBasics || !window.ITAvatars) return;
    student = window.ITBasics.getSession();
    if (!student) return;

    var known = A().cached(student.code);
    pick = {
      shape: known ? known.shape : null,
      house: (known && known.house) || A().DEFAULT_HOUSE
    };

    await loadLevel();
    panel.innerHTML = markup();
    var nameEl = document.getElementById("avatar-preview-name");
    if (nameEl) {
      nameEl.textContent = (student.first_name || student.code) +
        (student.class_name ? " · " + student.class_name : "");
    }
    paintPreview();
    paintHouses();
    paintShapes();
    paintFx();
    paintTheme();
    paintLines();
    wire(panel);

    // Then let the database correct us, in case they picked on another
    // computer. If they have already tapped something while this was in
    // flight, their tap wins: a slow reply must never undo a live choice.
    var saved = await A().mine();
    if (!saved || touched) return;
    if (saved.shape === pick.shape && saved.house === pick.house) return;
    pick = { shape: saved.shape || null, house: saved.house };
    paintPreview();
    paintHouses();
    paintShapes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  /* Earning XP with this page open can cross a threshold, so the grid
     re-checks rather than staying locked until a reload. */
  window.addEventListener("itbasics:attempt", function () {
    if (!document.getElementById("avatar-shapes") || !window.ITXP) return;
    var now = window.ITXP.current();
    if (!now || typeof now.level !== "number" || now.level === myLevel) return;
    myLevel = now.level;
    paintShapes();
  });
})();
