/* H3 green notes: the rule of 3s.
 *
 * A sub-chapter (one set, e.g. 1A) is DONE when every question in it is
 * correct. Retries are unlimited, so 100% is always reachable.
 *
 * One note for every 3 sub-chapters done, from ANY chapters (and any year),
 * in any order, plus one bonus note for each chapter finished completely.
 * So 1A, 3C and 7B together earn a note, and finishing a 9 sub-chapter
 * chapter on its own earns 3 + 1 = 4.
 *
 * Earned notes are always worked out from the saved results, never stored,
 * so the student page and the teacher page cannot disagree. The teacher page
 * stores only how many have been ISSUED (handed out in Compass).
 *
 * Exposes window.H3Notes (and module.exports, for checking it in node).
 */
(function (root) {
  "use strict";

  var PER_NOTE = 3;

  function setDone(set, res) {
    var r = res || {};
    return set.questions.length > 0 &&
      set.questions.every(function (q) { return r[q.id] && r[q.id].ok; });
  }

  // Sets grouped by their "chapter" field, in bank order.
  function chapters(sets) {
    var out = [];
    sets.forEach(function (s) {
      var name = s.chapter || "Homework";
      var year = s.year || 7;      // sets without a year are Year 7 (bank.js)
      var ch = out.find(function (c) { return c.name === name && c.year === year; });
      if (!ch) {
        var m = name.match(/^Chapter\s+(\d+)/i);
        var num = m ? m[1] : String(out.length + 1);
        // Year 7 keeps the plain ids ("1".."10") so old links and saved work still
        // line up; other years get their own ("y8-1") so the two never clash.
        ch = { name: name, year: year, num: num, id: year === 7 ? num : "y" + year + "-" + num, sets: [] };
        out.push(ch);
      }
      ch.sets.push(s);
    });
    // Order: year, then chapter number, whatever order the sets were loaded in.
    // Sets within a chapter keep their bank order.
    out.sort(function (a, b) { return (a.year - b.year) || ((parseInt(a.num, 10) || 999) - (parseInt(b.num, 10) || 999)); });
    return out;
  }

  // One chapter's tally: { done, total, full }. A full chapter earns the bonus.
  function chapterNotes(ch, results) {
    var r = results || {};
    var done = ch.sets.filter(function (s) { return setDone(s, r[s.id]); }).length;
    var total = ch.sets.length;
    return { done: done, total: total, full: total > 0 && done === total };
  }

  // Whole bank: { done, earned, bonuses, toNext, chapters: [{ name, id, sets, ...chapterNotes }] }.
  // done counts finished sub-chapters across every chapter; toNext is how many
  // more (from anywhere) until the next note of 3 (1 to 3).
  function summary(sets, results) {
    var list = chapters(sets).map(function (ch) {
      var n = chapterNotes(ch, results);
      return Object.assign({}, ch, n);
    });
    var done = list.reduce(function (a, c) { return a + c.done; }, 0);
    var bonuses = list.filter(function (c) { return c.full; }).length;
    return {
      done: done,
      bonuses: bonuses,
      earned: Math.floor(done / PER_NOTE) + bonuses,
      toNext: PER_NOTE - (done % PER_NOTE),
      chapters: list
    };
  }

  var api = { PER_NOTE: PER_NOTE, setDone: setDone, chapters: chapters,
              chapterNotes: chapterNotes, summary: summary };
  root.H3Notes = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : this);
