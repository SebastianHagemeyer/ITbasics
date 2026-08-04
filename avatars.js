/* avatars.js
 *
 * A student's icon on the leaderboard: pick a shape, pick your house.
 *
 *   12 shapes  x  4 houses  =  48 combinations
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

    { id: "fox", label: "Fox", draw: function (ink, disc) {
      return '<path d="m10.4 10.2 5 4.2a10.9 10.9 0 0 1 9.2 0l5-4.2-.9 7.2c.5 1.1.8 2.3.8 3.6 0 4.5-4.2 8-9.5 8s-9.5-3.5-9.5-8c0-1.3.3-2.5.8-3.6z" fill="' + ink + '"/>' +
             '<path d="M20 29.2c-2.9 0-5.5-1.1-7.2-2.9h14.4c-1.7 1.8-4.3 2.9-7.2 2.9z" fill="' + disc + '"/>' +
             '<circle cx="16.4" cy="19.4" r="1.6" fill="' + disc + '"/>' +
             '<circle cx="23.6" cy="19.4" r="1.6" fill="' + disc + '"/>';
    }},

    /* The pentagon and its five spokes are the whole reason a football reads
       as a football. Drawn from real geometry, not by eye: a regular pentagon
       at the centre with a spoke running out from each vertex to the rim. */
    { id: "football", label: "Football", draw: function (ink, disc) {
      return '<circle cx="20" cy="20" r="9.4" fill="none" stroke="' + ink + '" stroke-width="2.2"/>' +
             '<path d="M20 15.7 24.1 18.7 22.5 23.5 17.5 23.5 15.9 18.7z" fill="' + ink + '"/>' +
             '<path d="M20 15.7V10.6M24.1 18.7 28.9 17.1M22.5 23.5 25.5 27.6M17.5 23.5 14.5 27.6M15.9 18.7 11.1 17.1" stroke="' + ink + '" stroke-width="2" stroke-linecap="round"/>';
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

    { id: "music", label: "Music note", draw: function (ink, disc) {
      return '<ellipse cx="15.4" cy="26.2" rx="3.8" ry="3" transform="rotate(-20 15.4 26.2)" fill="' + ink + '"/>' +
             '<ellipse cx="25.9" cy="24" rx="3.8" ry="3" transform="rotate(-20 25.9 24)" fill="' + ink + '"/>' +
             '<path d="M17.4 25.8V12.8h2.2v13zM27.9 23.6V10.6h2.2v13z" fill="' + ink + '"/>' +
             '<path d="M17.4 12.8 30.1 10.6v3.8L17.4 16.6z" fill="' + ink + '"/>';
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

  window.ITAvatars = {
    SHAPES: SHAPES,
    HOUSES: HOUSES,
    DEFAULT_HOUSE: DEFAULT_HOUSE,
    svg: svg,
    letterSvg: letterSvg,
    render: render,
    valid: valid,
    usable: usable,
    mine: mine,
    choose: choose,
    cached: cached,
    forEveryone: forEveryone
  };
})();
