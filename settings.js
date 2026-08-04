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
 * The twelve icons are drawn in the colour you have currently got selected,
 * not in grey. You are choosing the actual thing that will sit next to your
 * name, so it should look like the actual thing while you choose it.
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
      return '<button type="button" class="avatar-choice' + (on ? " on" : "") + '" ' +
        'role="radio" aria-checked="' + (on ? "true" : "false") + '" ' +
        'data-shape="' + s.id + '" title="' + escapeHtml(s.label) + '">' +
        A().svg(s.id, pick.house, 44) +
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

  function flashSaved(msg) {
    var tag = document.getElementById("avatar-saved");
    if (!tag) return;
    tag.textContent = msg || "Saved";
    tag.hidden = false;
    tag.classList.remove("show");
    void tag.offsetWidth;
    tag.classList.add("show");
    window.clearTimeout(savedTimer);
    savedTimer = window.setTimeout(function () { tag.hidden = true; }, 1800);
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
        '<div class="avatar-grid" id="avatar-shapes" role="radiogroup" aria-label="Icon"></div>' +
      "</section>" +
      '<section class="settings-card">' +
        "<h3>XP notifications</h3>" +
        '<p class="settings-hint">How much the screen celebrates when you earn XP. ' +
          "This only changes what you see; your XP is counted the same either way.</p>" +
        '<div class="fx-row" id="fx-choices" role="radiogroup" aria-label="XP notifications"></div>' +
        '<p class="settings-note">Saved on this device. If you sign in on another computer, set it there too.</p>' +
      "</section>"
    );
  }

  function wire(panel) {
    panel.addEventListener("click", function (e) {
      var shape = e.target.closest("[data-shape]");
      if (shape) {
        // Tapping the icon you already have turns it back off, which is the
        // only way back to the plain initial once you have chosen one.
        var id = shape.getAttribute("data-shape");
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
})();
