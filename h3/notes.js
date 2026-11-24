/* H3 green notes: the rule of 3s.
 *
 * A sub-chapter (one set, e.g. 1A) is DONE when every question in it is
 * correct. Retries are unlimited, so 100% is always reachable.
 *
 * Per chapter:
 *   one note for every 3 sub-chapters done, in any order, plus
 *   one bonus note for finishing every sub-chapter in the chapter.
 * Chapter 1 has 9 sub-chapters, so finishing it earns 3 + 1 = 4 notes.
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

  // One chapter's tally: { done, total, earned, bonus, toNext }.
  // toNext is how many more sub-chapters until the next note (0 when the
  // chapter is finished and every note is earned).
  function chapterNotes(ch, results) {
    var r = results || {};
    var done = ch.sets.filter(function (s) { return setDone(s, r[s.id]); }).length;
    var total = ch.sets.length;
    var full = total > 0 && done === total;
    var earned = Math.floor(done / PER_NOTE) + (full ? 1 : 0);
    var toNext;
    if (full) toNext = 0;
    else {
      var toTriple = PER_NOTE - (done % PER_NOTE);
      // The bonus may arrive before the next triple, e.g. 8 of 9 done.
      toNext = Math.min(toTriple, total - done);
    }
    return { done: done, total: total, earned: earned, full: full, toNext: toNext };
  }

  // Whole bank: { earned, chapters: [{ name, id, sets, ...chapterNotes }] }.
  function summary(sets, results) {
    var list = chapters(sets).map(function (ch) {
      var n = chapterNotes(ch, results);
      return Object.assign({}, ch, n);
    });
    return {
      earned: list.reduce(function (a, c) { return a + c.earned; }, 0),
      chapters: list
    };
  }

  var api = { PER_NOTE: PER_NOTE, setDone: setDone, chapters: chapters,
              chapterNotes: chapterNotes, summary: summary };
  root.H3Notes = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : this);
