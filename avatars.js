/* avatars.js
 *
 * Twelve pick-your-own icons, so a student is a face on the leaderboard
 * rather than a row of text. They are inline SVG in one file rather than
 * twelve image requests, and they draw from a coloured disc plus a flat
 * white glyph so they still read at 24px in a table cell.
 *
 * The choice is stored in quiz_progress under the name "avatar", which
 * means no new table, no migration, and the leaderboard can read everyone's
 * in one query. Anyone with no choice saved falls back to their initial, so
 * this never has to be set for the site to work.
 *
 * Adding a thirteenth: append to LIST. Nothing counts them.
 */
(function () {
  "use strict";

  // Each glyph is drawn inside a 40x40 box, on a disc of its own colour.
  function icon(id, label, colour, glyph) {
    return { id: id, label: label, colour: colour, glyph: glyph };
  }

  var LIST = [
    icon("knight", "Chess knight", "#6b5cff",
      '<path d="M14 29h13v2.6H14zM17 27c-.3-3.4 1-5.6 3.2-7.4l-2.2-.5-1.6 1.9-2.1-1.5 2.6-3.3c1-1.3 2.3-2 3.9-2.2V12l2.3 1.1c2.9 1.4 4.5 4 4.6 7.4L27.8 27z" fill="#fff"/>' +
      '<circle cx="18.4" cy="17.7" r=".9" fill="#6b5cff"/>'),

    icon("football", "Football", "#20c997",
      '<circle cx="20" cy="20" r="9.4" fill="#fff"/>' +
      '<path d="m20 13.4 3.9 2.8-1.5 4.6h-4.8l-1.5-4.6z" fill="#12324a"/>' +
      '<path d="M20 10.6v2.8M13.6 17.3l2.6.9M26.4 17.3l-2.6.9M16.2 25.5l1.4-2.7M23.8 25.5l-1.4-2.7" stroke="#12324a" stroke-width="1.5" stroke-linecap="round"/>'),

    icon("basketball", "Basketball", "#ff7a59",
      '<circle cx="20" cy="20" r="9.4" fill="none" stroke="#fff" stroke-width="2.2"/>' +
      '<path d="M20 10.6v18.8M10.6 20h18.8" stroke="#fff" stroke-width="1.8"/>' +
      '<path d="M13.6 13.6c3.6 3.6 3.6 9.2 0 12.8M26.4 13.6c-3.6 3.6-3.6 9.2 0 12.8" stroke="#fff" stroke-width="1.8" fill="none"/>'),

    icon("cat", "Cat", "#ffbe0b",
      '<path d="M12.5 15.5 11 10l5 3.2a11 11 0 0 1 8 0L29 10l-1.5 5.5A9.2 9.2 0 0 1 29 20c0 4.7-4 8.2-9 8.2s-9-3.5-9-8.2a9.2 9.2 0 0 1 1.5-4.5z" fill="#fff"/>' +
      '<circle cx="16.8" cy="19.4" r="1.3" fill="#3a2c00"/><circle cx="23.2" cy="19.4" r="1.3" fill="#3a2c00"/>' +
      '<path d="m20 22.2.9 1.3h-1.8z" fill="#3a2c00"/>' +
      '<path d="M13.6 22.6h3.6M26.4 22.6h-3.6" stroke="#3a2c00" stroke-width="1.1" stroke-linecap="round"/>'),

    icon("dog", "Dog", "#a9714b",
      '<path d="M13 12c-2.4 0-3.6 2.3-3.6 5.2 0 2 .6 3.6 1.6 4.6C11 26.4 15 29 20 29s9-2.6 9-7.2c1-1 1.6-2.6 1.6-4.6C30.6 14.3 29.4 12 27 12c-1.6 0-2.9 1.1-3.6 2.8a12 12 0 0 0-6.8 0C15.9 13.1 14.6 12 13 12z" fill="#fff"/>' +
      '<circle cx="16.9" cy="20.4" r="1.3" fill="#3d2513"/><circle cx="23.1" cy="20.4" r="1.3" fill="#3d2513"/>' +
      '<ellipse cx="20" cy="23.6" rx="1.7" ry="1.3" fill="#3d2513"/>' +
      '<path d="M20 25v1.6" stroke="#3d2513" stroke-width="1.1" stroke-linecap="round"/>'),

    icon("fox", "Fox", "#ff8c42",
      '<path d="m10.5 11 4.6 3.3a10.6 10.6 0 0 1 9.8 0L29.5 11l-.7 6.3c.5 1 .8 2.1.8 3.3 0 4.6-4.3 8.4-9.6 8.4s-9.6-3.8-9.6-8.4c0-1.2.3-2.3.8-3.3z" fill="#fff"/>' +
      '<path d="M20 29c-3.4 0-6.4-1.6-8.1-4h16.2c-1.7 2.4-4.7 4-8.1 4z" fill="#ffd9c0"/>' +
      '<circle cx="16.6" cy="19.6" r="1.3" fill="#4a2000"/><circle cx="23.4" cy="19.6" r="1.3" fill="#4a2000"/>' +
      '<path d="m20 22.4 1 1.4h-2z" fill="#4a2000"/>'),

    icon("penguin", "Penguin", "#4a6fa5",
      '<ellipse cx="20" cy="20.4" rx="8.2" ry="9.4" fill="#12233a"/>' +
      '<ellipse cx="20" cy="22.4" rx="5" ry="7" fill="#fff"/>' +
      '<circle cx="17.6" cy="17.2" r="1.2" fill="#fff"/><circle cx="22.4" cy="17.2" r="1.2" fill="#fff"/>' +
      '<circle cx="17.7" cy="17.4" r=".6" fill="#12233a"/><circle cx="22.3" cy="17.4" r=".6" fill="#12233a"/>' +
      '<path d="m20 19.2 2 1.6-2 1.6-2-1.6z" fill="#ffb703"/>' +
      '<path d="M16.6 29.4c.7-.9 2-1.4 3.4-1.4s2.7.5 3.4 1.4" stroke="#ffb703" stroke-width="1.8" stroke-linecap="round" fill="none"/>'),

    icon("rocket", "Rocket", "#e94f64",
      '<path d="M20 9c3.4 2.7 5.2 6.6 5.2 11.2v3.4h-10.4v-3.4C14.8 15.6 16.6 11.7 20 9z" fill="#fff"/>' +
      '<circle cx="20" cy="17" r="2.2" fill="#e94f64"/>' +
      '<path d="M14.8 20.6 11.4 24l3.4.8zM25.2 20.6l3.4 3.4-3.4.8z" fill="#fff"/>' +
      '<path d="M17.6 25.4h4.8l-2.4 5.2z" fill="#ffd166"/>'),

    icon("gamepad", "Game controller", "#7c5cff",
      '<path d="M13.6 14.4h12.8c3 0 5.2 2.6 5.2 6.2s-1.8 5.8-4.4 5.8c-1.6 0-2.4-.7-3.4-1.6h-7.6c-1 .9-1.8 1.6-3.4 1.6-2.6 0-4.4-2.2-4.4-5.8s2.2-6.2 5.2-6.2z" fill="#fff"/>' +
      '<path d="M15.6 18.4v3.6M13.8 20.2h3.6" stroke="#7c5cff" stroke-width="1.7" stroke-linecap="round"/>' +
      '<circle cx="24.4" cy="19.2" r="1.2" fill="#7c5cff"/><circle cx="26.6" cy="21.4" r="1.2" fill="#7c5cff"/>'),

    icon("guitar", "Guitar", "#d64545",
      '<path d="M27.8 10.8a2 2 0 0 1 2.8 2.8l-4.4 4.4c.7 2 .3 4.2-1.3 5.8l-2.2 2.2a6.6 6.6 0 0 1-9.3 0 6.6 6.6 0 0 1 0-9.3l2.2-2.2c1.6-1.6 3.8-2 5.8-1.3z" fill="#fff"/>' +
      '<circle cx="18.6" cy="21.4" r="2.6" fill="#d64545"/>' +
      '<path d="m24.6 13.2 2.2 2.2" stroke="#d64545" stroke-width="1.4" stroke-linecap="round"/>'),

    icon("skate", "Skateboard", "#1f9d55",
      '<path d="M10.4 18.6c0-1.2 1-2 2.4-2h14.4c1.4 0 2.4.8 2.4 2s-1 2-2.4 2H12.8c-1.4 0-2.4-.8-2.4-2z" fill="#fff"/>' +
      '<path d="M15.4 20.8v1.4M24.6 20.8v1.4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="15.4" cy="24" r="2.2" fill="#fff"/><circle cx="24.6" cy="24" r="2.2" fill="#fff"/>' +
      '<circle cx="15.4" cy="24" r=".8" fill="#1f9d55"/><circle cx="24.6" cy="24" r=".8" fill="#1f9d55"/>'),

    icon("palette", "Art palette", "#e26bb0",
      '<path d="M20 10.4c5.6 0 9.8 3.6 9.8 8.2 0 3-2.2 4.6-4.4 4.6h-2.2c-1.2 0-2 .8-2 1.8 0 .5.2.9.5 1.3.3.4.5.8.5 1.3 0 1-.9 1.8-2.2 1.8-5.6 0-9.8-4.2-9.8-9.6s4.2-9.4 9.8-9.4z" fill="#fff"/>' +
      '<circle cx="16.2" cy="16.4" r="1.5" fill="#e94f64"/>' +
      '<circle cx="21.4" cy="14.8" r="1.5" fill="#ffbe0b"/>' +
      '<circle cx="25.4" cy="18.2" r="1.5" fill="#20c997"/>' +
      '<circle cx="15.4" cy="22" r="1.5" fill="#4a6fa5"/>')
  ];

  var BY_ID = {};
  LIST.forEach(function (a) { BY_ID[a.id] = a; });

  /* One <svg>, ready to drop anywhere. size is the pixel box; the glyphs are
     drawn for 40 and scale cleanly from there. */
  function svg(id, size) {
    var a = BY_ID[id];
    if (!a) return "";
    var px = size || 32;
    return '<svg class="avatar-svg" viewBox="0 0 40 40" width="' + px + '" height="' + px +
      '" role="img" aria-label="' + a.label + '">' +
      '<circle cx="20" cy="20" r="20" fill="' + a.colour + '"/>' + a.glyph + "</svg>";
  }

  function has(id) { return Boolean(BY_ID[id]); }

  // ---- saving and loading ------------------------------------------------
  // quiz_progress under the name "avatar". No new table, and because the
  // anon role can already read that table the leaderboard can fetch the
  // whole class in one go.
  var KEY = "avatar";

  async function mine() {
    if (!window.ITBasics || !window.ITBasics.getSession()) return null;
    try {
      var saved = await window.ITBasics.loadProgress(KEY);
      return saved && has(saved.id) ? saved.id : null;
    } catch (e) { return null; }
  }

  async function choose(id) {
    if (!has(id) || !window.ITBasics) return false;
    try { await window.ITBasics.saveProgress(KEY, { id: id }); } catch (e) { return false; }
    var s = window.ITBasics.getSession();
    if (s) { try { localStorage.setItem("itbasics-avatar-" + s.code, id); } catch (e) {} }
    window.dispatchEvent(new CustomEvent("itbasics:avatar", { detail: { id: id } }));
    return true;
  }

  // What the page can paint before the network answers.
  function cached(code) {
    try {
      var id = localStorage.getItem("itbasics-avatar-" + code);
      return has(id) ? id : null;
    } catch (e) { return null; }
  }

  /* Everyone's choice in one request, for the leaderboard. Returns a plain
     object of code -> avatar id. */
  async function forEveryone() {
    var out = {};
    if (!window.ITBasics || !window.ITBasics.isOnline()) return out;
    var res = await window.ITBasics.client()
      .from("quiz_progress")
      .select("student_code, answers")
      .eq("quiz_name", KEY);
    if (res.error || !res.data) return out;
    res.data.forEach(function (r) {
      var id = r.answers && r.answers.id;
      if (has(id)) out[r.student_code] = id;
    });
    return out;
  }

  window.ITAvatars = {
    LIST: LIST,
    svg: svg,
    has: has,
    mine: mine,
    choose: choose,
    cached: cached,
    forEveryone: forEveryone
  };
})();
