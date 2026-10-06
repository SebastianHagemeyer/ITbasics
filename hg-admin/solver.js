/* Home Group Builder: the solver.
 *
 * Takes students, staff preferences and a number of groups, and looks for an
 * assignment that keeps "works well with" pairs together, keeps "keep apart"
 * pairs separated, and spreads gender, old home groups and tags evenly.
 *
 * How: fill the groups at random to balanced sizes (locked students stay
 * where they are), then simulated annealing over swaps of two students in
 * different groups. A swap never changes group sizes, so sizes stay balanced
 * for free. Each swap is scored by its change alone (only two groups and two
 * students' pairs are touched), so a few hundred thousand tries take well
 * under a second for a year group.
 *
 * Lower score is better. Zero would mean every pair is happy and every group
 * is a perfect miniature of the whole year group.
 */
(function () {
  "use strict";

  // How much one broken pair costs, before the priority slider multiplies it.
  // Balance terms are squared deviations, so one student off is cost ~1.
  var PAIR_COST = 6;

  var DEFAULT_WEIGHTS = { together: 2, apart: 3, gender: 2, mix: 1, tags: 2 };

  // A custom gender mix is a deliberate choice, so it outranks a single
  // works-well pairing instead of tying with it.
  var TARGET_BOOST = 3;

  // Turns the app's rows into flat arrays the hot loop can index cheaply.
  function prepare(input) {
    var students = input.students;
    var G = input.groupCount;
    var w = Object.assign({}, DEFAULT_WEIGHTS, input.weights || {});
    var n = students.length;
    var idx = {};
    students.forEach(function (s, i) { idx[s.id] = i; });

    // Features: one per gender value, old home group and tag. Each student
    // carries a list of feature numbers; each feature has a weight.
    var featId = {};
    var featWeight = [];
    var featName = [];
    function feat(key, weight) {
      if (!(key in featId)) {
        featId[key] = featWeight.length;
        featWeight.push(weight);
        featName.push(key);
      }
      return featId[key];
    }
    var feats = students.map(function (s) {
      var f = [];
      if (s.gender) f.push(feat("g:" + s.gender, w.gender));
      if (s.current_group) f.push(feat("h:" + s.current_group, w.mix));
      (s.tags || []).forEach(function (t) {
        var k = t && feat("t:" + t, w.tags);
        if (t && f.indexOf(k) === -1) f.push(k);
      });
      return f;
    });
    var F = featWeight.length;
    var total = new Array(F).fill(0);
    feats.forEach(function (f) { f.forEach(function (k) { total[k]++; }); });
    var share = total.map(function (c) { return n ? c / n : 0; });

    var adj = students.map(function () { return []; });
    var pairs = [];
    (input.prefs || []).forEach(function (p) {
      var a = idx[p.a], b = idx[p.b];
      if (a === undefined || b === undefined || a === b) return;
      var cost = PAIR_COST * (p.kind === "apart" ? w.apart : w.together);
      var together = p.kind !== "apart";
      adj[a].push({ o: b, together: together, cost: cost });
      adj[b].push({ o: a, together: together, cost: cost });
      pairs.push({ a: a, b: b, together: together, pref: p });
    });

    var locked = students.map(function (s) {
      var g = input.locked && input.locked[s.id];
      return g !== undefined && g !== null && g >= 0 && g < G ? g : -1;
    });

    return { students: students, n: n, G: G, idx: idx, feats: feats, F: F,
      featWeight: featWeight, featName: featName, share: share, adj: adj,
      pairs: pairs, locked: locked,
      gshare: groupShares(G, n, share, featId, input.genderTargets),
      gweight: groupWeights(G, featWeight, featId, input.genderTargets) };
  }

  // Per group, per feature weight: the feature's own, boosted for the gender
  // features of any group that has a custom target.
  function groupWeights(G, featWeight, featId, targets) {
    var gw = [];
    for (var g = 0; g < G; g++) {
      var row = featWeight.slice();
      if (targets && isFinite(targets[g])) {
        ["g:F", "g:M"].forEach(function (key) {
          if (featId[key] !== undefined) row[featId[key]] *= TARGET_BOOST;
        });
      }
      gw.push(row);
    }
    return gw;
  }

  /* What share of each group every feature should make up. Normally every
   * group mirrors the whole year. A gender target ({ groupIndex: percent
   * girls }) overrides that for its group, counted among the M and F
   * students only, and the untargeted groups split whatever girls and boys
   * are left between them, so they are not punished for absorbing the rest. */
  function groupShares(G, n, share, featId, targets) {
    var gs = [];
    for (var g = 0; g < G; g++) gs.push(share.slice());
    var kF = featId["g:F"], kM = featId["g:M"];
    var set = Object.keys(targets || {}).map(Number).filter(function (g) {
      return g >= 0 && g < G && isFinite(targets[g]);
    });
    if (!set.length || kF === undefined || kM === undefined) return gs;

    var binary = share[kF] + share[kM];       // everyone else keeps the year's share
    var size = n / G;                         // swaps keep sizes balanced
    var girlsLeft = share[kF] * n;
    set.forEach(function (g) {
      var t = Math.min(100, Math.max(0, targets[g])) / 100;
      gs[g][kF] = t * binary;
      gs[g][kM] = (1 - t) * binary;
      girlsLeft -= gs[g][kF] * size;
    });
    var rest = G - set.length;
    if (rest > 0) {
      var f = Math.min(binary, Math.max(0, girlsLeft / (rest * size)));
      for (var g2 = 0; g2 < G; g2++) {
        if (set.indexOf(g2) !== -1) continue;
        gs[g2][kF] = f;
        gs[g2][kM] = binary - f;
      }
    }
    return gs;
  }

  function counts(P, grp) {
    var c = [];
    var size = new Array(P.G).fill(0);
    for (var g = 0; g < P.G; g++) c.push(new Array(P.F).fill(0));
    for (var i = 0; i < P.n; i++) {
      var g2 = grp[i];
      if (g2 < 0) continue;
      size[g2]++;
      P.feats[i].forEach(function (k) { c[g2][k]++; });
    }
    return { c: c, size: size };
  }

  function fullScore(P, grp) {
    var cs = counts(P, grp);
    var s = 0;
    for (var g = 0; g < P.G; g++) {
      for (var k = 0; k < P.F; k++) {
        var d = cs.c[g][k] - cs.size[g] * P.gshare[g][k];
        s += P.gweight[g][k] * d * d;
      }
    }
    for (var i = 0; i < P.n; i++) {
      P.adj[i].forEach(function (e) {
        if (e.o < i) return;
        var same = grp[i] === grp[e.o] && grp[i] >= 0;
        if (e.together !== same) s += e.cost;
      });
    }
    return s;
  }

  function shuffle(a, rnd) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Balanced sizes, locked students first, everyone else at random.
  function initial(P, rnd) {
    var grp = new Array(P.n).fill(-1);
    var size = new Array(P.G).fill(0);
    var free = [];
    for (var i = 0; i < P.n; i++) {
      if (P.locked[i] >= 0) { grp[i] = P.locked[i]; size[P.locked[i]]++; }
      else free.push(i);
    }
    shuffle(free, rnd);
    free.forEach(function (i) {
      var best = -1;
      for (var g = 0; g < P.G; g++) {
        if (best < 0 || size[g] < size[best] || (size[g] === size[best] && rnd() < 0.5)) best = g;
      }
      grp[i] = best;
      size[best]++;
    });
    return grp;
  }

  // Change in the balance terms when feature k moves by dc in group g.
  function featDelta(P, cnt, size, g, k, dc) {
    var e = size[g] * P.gshare[g][k];
    var before = cnt[g][k] - e;
    var after = before + dc;
    return P.gweight[g][k] * (after * after - before * before);
  }

  function swapDelta(P, st, grp, i, j) {
    var gi = grp[i], gj = grp[j];
    var d = 0;
    var fi = P.feats[i], fj = P.feats[j];
    // Features only i has leave gi and arrive in gj; features only j has do
    // the opposite. Shared features cancel out.
    var x, k;
    for (x = 0; x < fi.length; x++) {
      k = fi[x];
      if (fj.indexOf(k) !== -1) continue;
      d += featDelta(P, st.c, st.size, gi, k, -1) + featDelta(P, st.c, st.size, gj, k, +1);
    }
    for (x = 0; x < fj.length; x++) {
      k = fj[x];
      if (fi.indexOf(k) !== -1) continue;
      d += featDelta(P, st.c, st.size, gj, k, -1) + featDelta(P, st.c, st.size, gi, k, +1);
    }
    d += pairDelta(P, grp, i, gi, gj, j) + pairDelta(P, grp, j, gj, gi, i);
    return d;
  }

  // Student s moves from group from to group to; skip is the student it swaps
  // with (their own pair cannot change: different groups before and after).
  function pairDelta(P, grp, s, from, to, skip) {
    var d = 0, a = P.adj[s];
    for (var x = 0; x < a.length; x++) {
      var e = a[x];
      if (e.o === skip) continue;
      var g = grp[e.o];
      var before = g === from, after = g === to;
      if (before === after) continue;
      var badBefore = e.together ? !before : before;
      var badAfter = e.together ? !after : after;
      if (badBefore !== badAfter) d += badAfter ? e.cost : -e.cost;
    }
    return d;
  }

  function applySwap(P, st, grp, i, j) {
    var gi = grp[i], gj = grp[j];
    P.feats[i].forEach(function (k) { st.c[gi][k]--; st.c[gj][k]++; });
    P.feats[j].forEach(function (k) { st.c[gj][k]--; st.c[gi][k]++; });
    grp[i] = gj; grp[j] = gi;
  }

  function anneal(P, rnd, iters) {
    var grp = initial(P, rnd);
    var st = counts(P, grp);
    var free = [];
    for (var i = 0; i < P.n; i++) if (P.locked[i] < 0) free.push(i);
    var score = fullScore(P, grp);
    var best = grp.slice(), bestScore = score;
    if (free.length < 2) return { grp: best, score: bestScore };

    var T0 = 4, T1 = 0.02;
    for (var it = 0; it < iters; it++) {
      var T = T0 * Math.pow(T1 / T0, it / iters);
      var a = free[Math.floor(rnd() * free.length)];
      var b = free[Math.floor(rnd() * free.length)];
      if (grp[a] === grp[b]) continue;
      var d = swapDelta(P, st, grp, a, b);
      if (d <= 0 || rnd() < Math.exp(-d / T)) {
        applySwap(P, st, grp, a, b);
        score += d;
        if (score < bestScore - 1e-9) { bestScore = score; best = grp.slice(); }
      }
    }
    return { grp: best, score: fullScore(P, best) };
  }

  /* solve({ students, prefs, groupCount, locked, weights }, { restarts, iters })
   * students: [{ id, gender, current_group, tags }]
   * prefs:    [{ a: studentId, b: studentId, kind: "together" | "apart" }]
   * locked:   { studentId: groupIndex }
   * Returns { assignment: { studentId: groupIndex }, score }. */
  function solve(input, opts) {
    opts = opts || {};
    var P = prepare(input);
    if (!P.n || P.G < 1) return { assignment: {}, score: 0 };
    var rnd = opts.random || Math.random;
    var restarts = opts.restarts || 4;
    var iters = opts.iters || Math.max(60000, P.n * 600);
    var best = null;
    for (var r = 0; r < restarts; r++) {
      var res = anneal(P, rnd, iters);
      if (!best || res.score < best.score) best = res;
    }
    var assignment = {};
    P.students.forEach(function (s, i) { assignment[s.id] = best.grp[i]; });
    return { assignment: assignment, score: Math.round(best.score * 10) / 10 };
  }

  /* report(input, assignment): what a person needs to judge a set of groups.
   * Students without a group (new imports) are left out of the stats. */
  function report(input, assignment) {
    var P = prepare(input);
    var grp = P.students.map(function (s) {
      var g = assignment[s.id];
      return g === undefined || g === null || g < 0 || g >= P.G ? -1 : g;
    });
    var groups = [];
    for (var g = 0; g < P.G; g++) {
      groups.push({ size: 0, gender: {}, from: {}, tags: {} });
    }
    P.students.forEach(function (s, i) {
      var g = grp[i];
      if (g < 0) return;
      var G2 = groups[g];
      G2.size++;
      if (s.gender) G2.gender[s.gender] = (G2.gender[s.gender] || 0) + 1;
      if (s.current_group) G2.from[s.current_group] = (G2.from[s.current_group] || 0) + 1;
      (s.tags || []).forEach(function (t) { G2.tags[t] = (G2.tags[t] || 0) + 1; });
    });

    var together = { met: 0, total: 0, broken: [] };
    var apart = { met: 0, total: 0, broken: [] };
    var flagged = {};
    P.pairs.forEach(function (p) {
      var ga = grp[p.a], gb = grp[p.b];
      if (ga < 0 || gb < 0) return;
      var same = ga === gb;
      var bucket = p.together ? together : apart;
      bucket.total++;
      if (p.together === same) bucket.met++;
      else {
        bucket.broken.push(p.pref);
        flagged[P.students[p.a].id] = true;
        flagged[P.students[p.b].id] = true;
      }
    });
    var unplaced = grp.filter(function (g) { return g < 0; }).length;
    return { groups: groups, together: together, apart: apart, flagged: flagged,
      unplaced: unplaced, score: Math.round(fullScore(P, grp.map(function (g) { return g; })) * 10) / 10 };
  }

  window.HGSolver = { solve: solve, report: report, DEFAULT_WEIGHTS: DEFAULT_WEIGHTS };
})();
