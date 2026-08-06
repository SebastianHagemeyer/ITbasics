/* avatars.js
 *
 * A student's icon on the leaderboard: pick a shape, pick your house.
 *
 *   16 shapes  x  4 houses  =  64 combinations
 *
 * Thirteen are there from day one. Three are earned: gem at Level 3, robot
 * at Level 5, crown at Level 7.
 *
 * The shape is a single flat silhouette and the colour comes from the house,
 * which is what makes these survive being shrunk to 24px in a table cell.
 * Anything with interior detail turns to mush at that size, so detail is cut
 * out of the silhouette instead and the disc shows through it.
 *
 * White on yellow is unreadable, so each house carries its own ink colour
 * rather than assuming white everywhere.
 *
 * Stored in quiz_progress under the name "avatar" as { shape, house }: no new
 * table, no SQL to run, and the leaderboard can fetch the whole class in one
 * query. Nobody has to pick anything for the site to work.
 */
(function () {
  "use strict";

  var HOUSES = [
    { id: "marram",       name: "Marram",       colour: "#c62b2b", ink: "#ffffff" },
    { id: "dulaiwurrung", name: "Dulaiwurrung", colour: "#1d4e89", ink: "#ffffff" },
    { id: "walert",       name: "Walert",       colour: "#f2b705", ink: "#3d2b00" },
    { id: "bundaban",     name: "Bundaban",     colour: "#1f8f4e", ink: "#ffffff" }
  ];

  /* Each shape draws into a 40x40 box. `ink` is the silhouette colour and
     `disc` is the house colour behind it, used for cut-out detail so the
     eyes and seams are holes rather than a second colour. */
  var SHAPES = [
    { id: "cat", label: "Cat", draw: function (ink, disc) {
      return '<path d="M20 12.4c-1.5 0-3 .2-4.3.7L12 9.2l-.5 5.6A8.7 8.7 0 0 0 10.6 20c0 4.9 4.2 8.6 9.4 8.6s9.4-3.7 9.4-8.6a8.7 8.7 0 0 0-.9-5.2L28 9.2l-3.7 3.9c-1.3-.5-2.8-.7-4.3-.7z" fill="' + ink + '"/>' +
             '<circle cx="16.6" cy="19.6" r="1.6" fill="' + disc + '"/>' +
             '<circle cx="23.4" cy="19.6" r="1.6" fill="' + disc + '"/>' +
             '<path d="M20 22.6l1.6 2.2h-3.2z" fill="' + disc + '"/>';
    }},

    { id: "dog", label: "Dog", draw: function (ink, disc) {
      return '<path d="M13.4 11.4c-2 0-3.4 2-3.4 5.2 0 2.2.5 4 1.4 5.2.5 4 4.2 7 8.6 7s8.1-3 8.6-7c.9-1.2 1.4-3 1.4-5.2 0-3.2-1.4-5.2-3.4-5.2-1.5 0-2.8 1.1-3.6 2.9a11.6 11.6 0 0 0-6 0c-.8-1.8-2.1-2.9-3.6-2.9z" fill="' + ink + '"/>' +
             '<circle cx="16.7" cy="20.2" r="1.6" fill="' + disc + '"/>' +
             '<circle cx="23.3" cy="20.2" r="1.6" fill="' + disc + '"/>' +
             '<ellipse cx="20" cy="23.8" rx="2.2" ry="1.7" fill="' + disc + '"/>';
    }},

    /* A fox is a cat that narrows to a point. The whole read is the snout, so
       the head tapers to a tip rather than being cut off flat at the chin. */
    { id: "fox", label: "Fox", draw: function (ink, disc) {
      return '<path d="M10.3 9.8 16 14.3a11.4 11.4 0 0 1 8 0l5.7-4.5-.9 7.7c.6 1.2.9 2.5.9 3.8 0 2.6-1.8 4.7-4.4 6L20 31l-5.3-3.7c-2.6-1.3-4.4-3.4-4.4-6 0-1.3.3-2.6.9-3.8z" fill="' + ink + '"/>' +
             '<circle cx="16.3" cy="19.6" r="1.7" fill="' + disc + '"/>' +
             '<circle cx="23.7" cy="19.6" r="1.7" fill="' + disc + '"/>' +
             '<circle cx="20" cy="26.4" r="1.5" fill="' + disc + '"/>';
    }},

    /* A football is the hardest thing here, because its identity is a
       black-and-white contrast pattern and we only get two colours.
       Everything built radially, a rim with spokes running out to it, reads
       as a car wheel: the five-fold symmetry is the problem, not the line
       weight. What works is how a real ball actually looks: a solid ball with
       one pentagon near the middle and the neighbouring ones running off the
       edge, asymmetric, no spokes.
       The patches deliberately overshoot the ball, then an annulus of house
       colour trims them back to it. A clipPath would need an id, and an id
       repeated across the twelve icons on the picker collides.
       The last ring matters more than it looks. Without it the edge patches
       run into the surrounding house colour and the ball loses its outline,
       so it reads as a disc with bites out of it. Ringing the rim back in
       gives every edge patch a white border facing outward, and the ball
       gets its silhouette back. */
    { id: "football", label: "Football", draw: function (ink, disc) {
      return '<circle cx="20" cy="20" r="9.7" fill="' + ink + '"/>' +
             '<path d="M20 13.9 24.1 16.9 22.5 21.7 17.5 21.7 15.9 16.9z' +
                     'M15.2 24.5 14.8 28 11.4 28.7 9.6 25.7 12 23.1z' +
                     'M25.3 24.5 28.7 23.6 30.6 26.6 28.3 29.3 25.1 28z' +
                     'M28.7 16 26.6 13.8 28.1 11.1 31.1 11.6 31.5 14.6z' +
                     'M11.9 15.3 8.9 14.9 8.2 11.9 10.9 10.4 13.1 12.5z" fill="' + disc + '"/>' +
             '<circle cx="20" cy="20" r="14.85" fill="none" stroke="' + disc + '" stroke-width="10.3"/>' +
             '<circle cx="20" cy="20" r="9.28" fill="none" stroke="' + ink + '" stroke-width="0.85"/>';
    }},

    { id: "basketball", label: "Basketball", draw: function (ink, disc) {
      return '<circle cx="20" cy="20" r="9.6" fill="' + ink + '"/>' +
             '<path d="M20 10.4v19.2M10.4 20h19.2" stroke="' + disc + '" stroke-width="2"/>' +
             '<path d="M13.2 13.2a9.6 9.6 0 0 1 0 13.6M26.8 13.2a9.6 9.6 0 0 0 0 13.6" stroke="' + disc + '" stroke-width="2" fill="none"/>';
    }},

    { id: "planet", label: "Planet", draw: function (ink, disc) {
      return '<ellipse cx="20" cy="20.6" rx="13" ry="4.4" transform="rotate(-18 20 20.6)" fill="none" stroke="' + ink + '" stroke-width="2.4"/>' +
             '<circle cx="20" cy="19.2" r="7.1" fill="' + ink + '"/>' +
             '<circle cx="17.4" cy="17.2" r="1.7" fill="' + disc + '"/>' +
             '<circle cx="22.6" cy="21" r="1.2" fill="' + disc + '"/>';
    }},

    { id: "rocket", label: "Rocket", draw: function (ink, disc) {
      return '<path d="M20 8.6c3.6 3 5.6 7.2 5.6 12v4.2h-11.2v-4.2c0-4.8 2-9 5.6-12z" fill="' + ink + '"/>' +
             '<circle cx="20" cy="16.8" r="2.6" fill="' + disc + '"/>' +
             '<path d="m14.4 21.4-3.8 4 3.8 1zM25.6 21.4l3.8 4-3.8 1z" fill="' + ink + '"/>' +
             '<path d="M17.2 26.6h5.6L20 32.2z" fill="' + ink + '"/>';
    }},

    { id: "mushroom", label: "Mushroom", draw: function (ink, disc) {
      return '<path d="M9 21.6c0-6.3 4.9-11.2 11-11.2s11 4.9 11 11.2z" fill="' + ink + '"/>' +
             '<path d="M16.4 21.6h7.2v6.6c0 1.9-1.5 3.1-3.6 3.1s-3.6-1.2-3.6-3.1z" fill="' + ink + '"/>' +
             '<circle cx="15.2" cy="17.6" r="2.1" fill="' + disc + '"/>' +
             '<circle cx="24.4" cy="16.6" r="1.6" fill="' + disc + '"/>' +
             '<circle cx="20.4" cy="19.8" r="1.3" fill="' + disc + '"/>';
    }},

    { id: "gamepad", label: "Controller", draw: function (ink, disc) {
      return '<path d="M14 14.6h12c3.4 0 5.8 3 5.8 7s-2 6.4-4.8 6.4c-1.8 0-2.8-.9-3.8-2h-6.4c-1 1.1-2 2-3.8 2-2.8 0-4.8-2.4-4.8-6.4s2.4-7 5.8-7z" fill="' + ink + '"/>' +
             '<path d="M16 18.4v4M14 20.4h4" stroke="' + disc + '" stroke-width="2" stroke-linecap="round"/>' +
             '<circle cx="24.4" cy="19.4" r="1.5" fill="' + disc + '"/>' +
             '<circle cx="26.8" cy="21.8" r="1.5" fill="' + disc + '"/>';
    }},

    /* The beam reaches further right than the left note head does left, so the
       drawn shape spans 11.7 to 30.1 and sits 0.9 right of centre. Nudged back
       as a group rather than by editing eight coordinates. */
    { id: "music", label: "Music note", draw: function (ink, disc) {
      return '<g transform="translate(-0.9 0)">' +
             '<ellipse cx="15.4" cy="26.2" rx="3.8" ry="3" transform="rotate(-20 15.4 26.2)" fill="' + ink + '"/>' +
             '<ellipse cx="25.9" cy="24" rx="3.8" ry="3" transform="rotate(-20 25.9 24)" fill="' + ink + '"/>' +
             '<path d="M17.4 25.8V12.8h2.2v13zM27.9 23.6V10.6h2.2v13z" fill="' + ink + '"/>' +
             '<path d="M17.4 12.8 30.1 10.6v3.8L17.4 16.6z" fill="' + ink + '"/>' +
             "</g>";
    }},

    { id: "bolt", label: "Lightning bolt", draw: function (ink, disc) {
      return '<path d="M23.8 8.4 11.8 22.6h6.6L16 31.6l12-14.6h-6.8z" fill="' + ink + '"/>';
    }},

    { id: "palette", label: "Art palette", draw: function (ink, disc) {
      return '<path d="M20 9.8c6 0 10.4 3.9 10.4 8.8 0 3.2-2.4 4.9-4.7 4.9h-2.3c-1.2 0-2 .8-2 1.8 0 .5.2 1 .5 1.4.3.4.5.8.5 1.3 0 1.1-1 2-2.4 2-6 0-10.4-4.5-10.4-10.2S14 9.8 20 9.8z" fill="' + ink + '"/>' +
             '<circle cx="15.8" cy="16" r="1.7" fill="' + disc + '"/>' +
             '<circle cx="21.4" cy="14.2" r="1.7" fill="' + disc + '"/>' +
             '<circle cx="25.8" cy="18" r="1.7" fill="' + disc + '"/>' +
             '<circle cx="15" cy="21.8" r="1.7" fill="' + disc + '"/>';
    }},

    /* Three ink bands with the house colour showing between them, rather than
       one silhouette with detail drawn on. The gaps are what make it a stack
       instead of a blob, so they are the last thing to give up as it shrinks.
       Sesame seeds are cut out of the bun for the same reason. */
    { id: "burger", label: "Burger", draw: function (ink, disc) {
      return '<path d="M9 17.6c0-5 4.9-8.4 11-8.4s11 3.4 11 8.4z" fill="' + ink + '"/>' +
             '<ellipse cx="15.4" cy="14.2" rx="1.5" ry="1" fill="' + disc + '"/>' +
             '<ellipse cx="20" cy="12.7" rx="1.5" ry="1" fill="' + disc + '"/>' +
             '<ellipse cx="24.6" cy="14.2" rx="1.5" ry="1" fill="' + disc + '"/>' +
             '<path d="M10.2 19h19.6a1.8 1.8 0 0 1 0 3.6H10.2a1.8 1.8 0 0 1 0-3.6z" fill="' + ink + '"/>' +
             '<path d="M9 24h22v2.4c0 2.4-2.2 4.4-5 4.4H14c-2.8 0-5-2-5-4.4z" fill="' + ink + '"/>';
    }},

    /* The three below are earned, not given. `level` is the level you have to
       reach before the picker will let you choose one; everything above has no
       `level` and is available from the start.
       They are deliberately the three that read best of everything drawn for
       this, because a reward that turns to mush at 22px is not a reward. An
       astronaut helmet and a dragon were tried and dropped: the helmet read as
       a blob and the dragon read as a speech bubble. */

    { id: "gem", label: "Gem", level: 3, draw: function (ink, disc) {
      return '<path d="M13.4 12.6H26.6L30.6 18.6 20 30.6 9.4 18.6z" fill="' + ink + '"/>' +
             '<path d="M9.4 18.6H30.6M16.6 18.6 20 30.6M23.4 18.6 20 30.6" ' +
                   'stroke="' + disc + '" stroke-width="1.5" fill="none"/>';
    }},

    { id: "robot", label: "Robot", level: 5, draw: function (ink, disc) {
      return '<circle cx="20" cy="8.6" r="1.8" fill="' + ink + '"/>' +
             '<path d="M20 10.4v2.4" stroke="' + ink + '" stroke-width="1.8"/>' +
             '<rect x="10.2" y="12.8" width="19.6" height="17" rx="4.4" fill="' + ink + '"/>' +
             '<circle cx="16" cy="19.2" r="2.3" fill="' + disc + '"/>' +
             '<circle cx="24" cy="19.2" r="2.3" fill="' + disc + '"/>' +
             '<rect x="15" y="24" width="10" height="2.6" rx="1.3" fill="' + disc + '"/>';
    }},

    { id: "crown", label: "Crown", level: 7, draw: function (ink, disc) {
      return '<path d="M9.2 14.2 14.6 20.4 20 11.8 25.4 20.4 30.8 14.2 29 27.4H11z" fill="' + ink + '"/>' +
             '<path d="M11.4 23.6H28.6" stroke="' + disc + '" stroke-width="1.5"/>' +
             '<circle cx="15.6" cy="26" r="1" fill="' + disc + '"/>' +
             '<circle cx="20" cy="26" r="1" fill="' + disc + '"/>' +
             '<circle cx="24.4" cy="26" r="1" fill="' + disc + '"/>';
    }}
  ];

  var SHAPE_BY = {}, HOUSE_BY = {};
  SHAPES.forEach(function (s) { SHAPE_BY[s.id] = s; });
  HOUSES.forEach(function (h) { HOUSE_BY[h.id] = h; });

  var DEFAULT_HOUSE = "dulaiwurrung";

  function svg(shapeId, houseId, size) {
    var s = SHAPE_BY[shapeId];
    var h = HOUSE_BY[houseId] || HOUSE_BY[DEFAULT_HOUSE];
    if (!s) return "";
    var px = size || 32;
    return '<svg class="avatar-svg" viewBox="0 0 40 40" width="' + px + '" height="' + px +
      '" role="img" aria-label="' + s.label + ', ' + h.name + '">' +
      '<circle cx="20" cy="20" r="20" fill="' + h.colour + '"/>' +
      s.draw(h.ink, h.colour) + "</svg>";
  }

  function valid(shapeId, houseId) {
    return Boolean(SHAPE_BY[shapeId]) && Boolean(HOUSE_BY[houseId]);
  }

  /* The level a shape is locked behind, 1 for the ones everybody starts with.
     Only the picker consults this. A shape someone already wears keeps
     rendering whatever their level, because taking an icon back off a student
     because a threshold moved would be worse than letting them keep it. */
  function requiredLevel(shapeId) {
    var s = SHAPE_BY[shapeId];
    return (s && s.level) || 1;
  }

  /* A saved pick is allowed to be a house with no shape yet. Someone who taps
     their house colour and then wanders off should still keep that much. */
  function usable(pick) {
    if (!pick || !HOUSE_BY[pick.house]) return false;
    return !pick.shape || Boolean(SHAPE_BY[pick.shape]);
  }

  /* Before anyone picks a shape: their first initial on the house disc, so a
     class that has never opened the settings page still looks finished. */
  function letterSvg(name, houseId, size) {
    var h = HOUSE_BY[houseId] || HOUSE_BY[DEFAULT_HOUSE];
    var ch = String(name || "").trim().charAt(0).toUpperCase();
    if (!/^[A-Z0-9]$/.test(ch)) ch = "?";
    var px = size || 32;
    return '<svg class="avatar-svg" viewBox="0 0 40 40" width="' + px + '" height="' + px +
      '" role="img" aria-label="' + ch + '">' +
      '<circle cx="20" cy="20" r="20" fill="' + h.colour + '"/>' +
      '<text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="21" ' +
      'font-weight="700" font-family="system-ui, -apple-system, sans-serif" fill="' + h.ink + '">' +
      ch + '</text></svg>';
  }

  /* The one call a page should make: hand it whatever pick you have (or none)
     and the student's name, get back something to show either way. */
  function render(pick, name, size) {
    if (pick && valid(pick.shape, pick.house)) return svg(pick.shape, pick.house, size);
    return letterSvg(name, (pick && pick.house) || DEFAULT_HOUSE, size);
  }

  // ---- saving and loading ------------------------------------------------
  var KEY = "avatar";

  function localKey(code) { return "itbasics-avatar-" + code; }

  async function mine() {
    if (!window.ITBasics || !window.ITBasics.getSession()) return null;
    try {
      var saved = await window.ITBasics.loadProgress(KEY);
      if (usable(saved)) return saved;
    } catch (e) {}
    return null;
  }

  async function choose(shapeId, houseId) {
    if (!window.ITBasics || !HOUSE_BY[houseId]) return false;
    if (shapeId && !SHAPE_BY[shapeId]) return false;
    var pick = { shape: shapeId || null, house: houseId };
    try { await window.ITBasics.saveProgress(KEY, pick); } catch (e) { return false; }
    var s = window.ITBasics.getSession();
    if (s) { try { localStorage.setItem(localKey(s.code), JSON.stringify(pick)); } catch (e) {} }
    window.dispatchEvent(new CustomEvent("itbasics:avatar", { detail: pick }));
    return true;
  }

  // What a page can paint before the network answers.
  function cached(code) {
    try {
      var pick = JSON.parse(localStorage.getItem(localKey(code)));
      return usable(pick) ? pick : null;
    } catch (e) { return null; }
  }

  /* Everyone's choice in one request, for the leaderboard. */
  async function forEveryone() {
    var out = {};
    if (!window.ITBasics || !window.ITBasics.isOnline()) return out;
    var res = await window.ITBasics.client()
      .from("quiz_progress")
      .select("student_code, answers")
      .eq("quiz_name", KEY);
    if (res.error || !res.data) return out;
    res.data.forEach(function (r) {
      if (usable(r.answers)) out[r.student_code] = r.answers;
    });
    return out;
  }

  /* The header chip. app.js draws it with whatever is in localStorage, which
     is instant but can be stale or empty on a computer they have not used
     before. So once per page load we ask the database, and repaint only if it
     actually disagrees. Nothing here blocks the chip appearing. */
  function paintChip() {
    var slot = document.querySelector(".auth-avatar");
    if (!slot || !window.ITBasics) return;
    var s = window.ITBasics.getSession();
    if (!s) return;
    slot.innerHTML = render(cached(s.code), s.first_name || s.code, 26);
    slot.classList.add("has-avatar");
  }

  async function syncChip() {
    if (!window.ITBasics || !window.ITBasics.getSession()) return;
    var s = window.ITBasics.getSession();
    var here = cached(s.code);
    var there = await mine();
    if (!there) return;
    var same = here && here.shape === there.shape && here.house === there.house;
    if (same) return;
    try { localStorage.setItem(localKey(s.code), JSON.stringify(there)); } catch (e) {}
    paintChip();
  }

  function bootChip() {
    paintChip();
    syncChip();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootChip);
  } else { bootChip(); }

  // A new pick on the settings page repaints the chip without a reload.
  window.addEventListener("itbasics:avatar", paintChip);
  window.addEventListener("itbasics:auth", function () { window.setTimeout(bootChip, 0); });

  window.ITAvatars = {
    SHAPES: SHAPES,
    HOUSES: HOUSES,
    DEFAULT_HOUSE: DEFAULT_HOUSE,
    svg: svg,
    letterSvg: letterSvg,
    render: render,
    valid: valid,
    usable: usable,
    requiredLevel: requiredLevel,
    mine: mine,
    choose: choose,
    cached: cached,
    forEveryone: forEveryone
  };
})();
