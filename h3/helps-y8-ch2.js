/* H3 help panels for Year 8 Chapter 2. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 2A to 2G. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---------- diagram helpers (every angle is worked out with trig, so it is drawn to scale) ----------
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const rad = (a) => a * Math.PI / 180;
  const P = (deg, len, o = [0, 0]) => [r3(o[0] + len * Math.cos(rad(deg))), r3(o[1] + len * Math.sin(rad(deg)))];
  const add = (p, q) => [r3(p[0] + q[0]), r3(p[1] + q[1])];
  const mid = (p, q) => [r3((p[0] + q[0]) / 2), r3((p[1] + q[1]) / 2)];
  const dir = (v, p) => r3(((Math.atan2(p[1] - v[1], p[0] - v[0]) * 180 / Math.PI) + 360) % 360);
  const S = (a, b, x) => Object.assign({ seg: [a[0], a[1], b[0], b[1]] }, x || {});
  const A = (v, a1, a2, label, r) => ({ angle: [v[0], v[1], r3(a1), r3(a2)], label: label || '', r: r || 0.6 });
  const AV = (v, p, q, label, r) => A(v, dir(v, p), dir(v, q), label, r);   // from ray v-p, anticlockwise to ray v-q
  const RT = (v, a1, a2) => ({ angle: [v[0], v[1], a1, a2], right: true });
  const N = (p, name, pos) => ({ point: p, name, pos: pos || 'ne' });
  const T = (p, label, anchor) => Object.assign({ label, at: p }, anchor ? { anchor } : {});
  const tk = (p, q, n) => ({ tick: [p[0], p[1], q[0], q[1]], n: n || 1 });
  const pm = (p, q, n) => ({ par: [p[0], p[1], q[0], q[1]], n: n || 1 });
  const D = (items, unit, caption) => fig(Object.assign({ kind: 'diagram', unit: unit || 36, items }, caption ? { caption } : {}));
  const reg = (n, r, a0, o = [0, 0]) => Array.from({ length: n }, (_, k) => P(a0 + 360 * k / n, r, o));
  // Apex of a triangle on base b0-b1 (along the x-axis) with base angles p at b0 and q at b1.
  const apex = (b0, b1, p, q) => { const c = b1[0] - b0[0], s = c * Math.sin(rad(q)) / Math.sin(rad(180 - p - q)); return P(p, s, b0); };
  // A polygon with these interior angles (anticlockwise from V0), the first n-2 side lengths given; the last two close it.
  const shape = (angles, lens) => {
    const n = angles.length, h = [0];
    for (let i = 1; i < n; i++) h.push(h[i - 1] + 180 - angles[i]);
    let sx = 0, sy = 0;
    for (let i = 0; i < n - 2; i++) { sx += lens[i] * Math.cos(rad(h[i])); sy += lens[i] * Math.sin(rad(h[i])); }
    const u = [Math.cos(rad(h[n - 2])), Math.sin(rad(h[n - 2]))], w = [Math.cos(rad(h[n - 1])), Math.sin(rad(h[n - 1]))];
    const det = u[0] * w[1] - u[1] * w[0], L1 = (-sx * w[1] + sy * w[0]) / det;
    const L = lens.slice(0, n - 2).concat([L1]);
    const pts = [[0, 0]];
    for (let i = 0; i < n - 1; i++) pts.push(P(h[i], L[i], pts[i]));
    return pts;
  };
  // Interior angle at corner i of an anticlockwise polygon.
  const corner = (pts, i, label, r) => AV(pts[i], pts[(i + 1) % pts.length], pts[(i + pts.length - 1) % pts.length], label, r);

  // ---------- solids: 3D points [x, depth, up], drawn in an oblique view; hidden edges dashed ----------
  const VIEW = [0.45, 0.35];
  const pr = ([x, y, z]) => [r3(x + VIEW[0] * y), r3(z + VIEW[1] * y)];
  const solid = (V, faces) => {
    const c = [0, 1, 2].map(k => V.reduce((s, p) => s + p[k], 0) / V.length);
    const vis = faces.map(f => {
      const n = [0, 0, 0];
      f.forEach((i, k) => { const p = V[i], q = V[f[(k + 1) % f.length]];
        n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); });
      const fc = [0, 1, 2].map(k => f.reduce((s, i) => s + V[i][k], 0) / f.length);
      const out = (fc[0] - c[0]) * n[0] + (fc[1] - c[1]) * n[1] + (fc[2] - c[2]) * n[2] > 0 ? 1 : -1;
      return out * (n[0] * VIEW[0] - n[1] + n[2] * VIEW[1]) > 1e-9;
    });
    const edges = new Map();
    faces.forEach((f, fi) => f.forEach((i, k) => {
      const j = f[(k + 1) % f.length], key = Math.min(i, j) + '-' + Math.max(i, j);
      edges.set(key, (edges.get(key) || false) || vis[fi]);
    }));
    const P2 = V.map(pr), items = [];
    for (const [key, seen] of edges) { const [i, j] = key.split('-').map(Number); items.push(S(P2[i], P2[j], seen ? {} : { dash: true })); }
    return items;
  };
  // Prism with an n-sided end facing you, and a pyramid with an n-sided base on the ground.
  const prism = (n, r, len) => {
    const end = reg(n, r, -90 + 180 / n), V = end.map(([x, z]) => [x, 0, z]).concat(end.map(([x, z]) => [x, len, z]));
    const faces = [end.map((_, i) => i), end.map((_, i) => n + i)].concat(end.map((_, i) => [i, (i + 1) % n, n + (i + 1) % n, n + i]));
    return solid(V, faces);
  };
  const pyramid = (n, r, h, a0) => {
    const V = Array.from({ length: n }, (_, k) => [r3(r * Math.cos(rad(a0 + 360 * k / n))), r3(r * Math.sin(rad(a0 + 360 * k / n))), 0]).concat([[0, 0, h]]);
    const faces = [V.slice(0, n).map((_, i) => i)].concat(Array.from({ length: n }, (_, i) => [i, (i + 1) % n, n]));
    return solid(V, faces);
  };

  // ---------- 3D grids (2G): x comes towards you (down-left), y goes right, z goes up ----------
  const g3 = (x, y, z) => [r3(-0.45 * x + y), r3(-0.55 * x + z)];
  const axes3 = (lx, ly, lz) => [S([0, 0], g3(4.9, 0, 0), { arrow: 'end' }), S([0, 0], g3(0, 4.9, 0), { arrow: 'end' }), S([0, 0], g3(0, 0, 4.9), { arrow: 'end' }),
    T(add(g3(5.25, 0, 0), [0, -0.1]), lx || 'x'), T(add(g3(0, 5.2, 0), [0, -0.5]), ly || 'y', 'end'), T(add(g3(0, 0, 5.2), [0.15, 0]), lz || 'z', 'start')];
  const floor3 = () => {
    const it = [];
    for (let k = 0; k <= 4; k++) { it.push(S(g3(k, 0, 0), g3(k, 4, 0), { dash: true, thin: true })); it.push(S(g3(0, k, 0), g3(4, k, 0), { dash: true, thin: true })); }
    'ABCD'.split('').forEach((c, i) => it.push(T(add(g3(i + 0.5, 0, 0), [-0.65, 0]), c)));
    'abcd'.split('').forEach((c, j) => it.push(T(add(g3(0, j + 0.5, 0), [0.16, 0.34]), c)));
    [1, 2, 3, 4].forEach(k => it.push(T([-0.3, k - 0.5], String(k))));
    return it;
  };
  // One cube in grid cell (i, j, k), counted from 0, with a label on its front face and dashed guides to the floor.
  const cube3 = (i, j, k, label) => {
    const f = (x, y, z) => g3(x, y, z);
    const it = [];
    if (k > 0) {
      it.push(S(f(i + 1, j, 0), f(i + 1, j + 1, 0), { dash: true }), S(f(i, j, 0), f(i + 1, j, 0), { dash: true }), S(f(i, j + 1, 0), f(i + 1, j + 1, 0), { dash: true }), S(f(i, j, 0), f(i, j + 1, 0), { dash: true }));
      it.push(S(f(i + 1, j, 0), f(i + 1, j, k), { dash: true }), S(f(i + 1, j + 1, 0), f(i + 1, j + 1, k), { dash: true }), S(f(i, j + 1, 0), f(i, j + 1, k), { dash: true }));
    }
    it.push({ poly: [f(i, j, k + 1), f(i + 1, j, k + 1), f(i + 1, j + 1, k + 1), f(i, j + 1, k + 1)], fill: true });
    it.push({ poly: [f(i, j + 1, k), f(i + 1, j + 1, k), f(i + 1, j + 1, k + 1), f(i, j + 1, k + 1)], fill: true });
    it.push({ poly: [f(i + 1, j, k), f(i + 1, j + 1, k), f(i + 1, j + 1, k + 1), f(i + 1, j, k + 1)], fill: true });
    if (label) it.push(T(add(f(i + 1, j + 0.5, k + 0.5), [0, -0.12]), label));
    return it;
  };
  const ticks3 = () => {
    const it = [T([-0.3, 0.25], '0')];
    for (let k = 1; k <= 4; k++) it.push(T(add(g3(k, 0, 0), [-0.35, 0]), String(k)), T(add(g3(0, k, 0), [0, 0.3]), String(k)), T([-0.3, k], String(k)));
    return it;
  };

  // ---------- fixed shapes used below ----------
  // 2B: a transversal at 60 degrees crossing two parallel lines
  const tI1 = [1, 0], tI2 = [r3(1 + 2 / Math.tan(rad(60))), 2];
  const tBase = [S([-0.4, 0], [3.8, 0]), S([-0.4, 2], [3.8, 2]), pm([3.2, 0], [3.5, 0]), pm([3.2, 2], [3.5, 2]), S(P(240, 1, tI1), P(60, 1, tI2))];
  // 2B: lines that look parallel but are 1 degree out
  const npI1 = [1, 0], npI2 = P(68, 2 / Math.sin(rad(68)), [1, 0]);
  // 2B: a transversal at 79 degrees
  const fI1 = [1, 0], fI2 = P(79, 2 / Math.sin(rad(79)), [1, 0]);
  // 2B: a triangle hanging between parallel lines
  const mT = [0, 3], mL = P(233, 3 / Math.sin(rad(53)), mT), mR = P(299, 3 / Math.sin(rad(61)), mT);
  // 2B: a bend at O between parallel lines
  const bO = [0, 0], bA = P(36, 2 / Math.sin(rad(36))), bB = P(312, 2 / Math.sin(rad(48)));
  const bend = (top, bottom) => D([S([-1.2, 2], add(bA, [1.4, 0])), S([-1.2, -2], add(bB, [1.4, 0])), pm(add(bA, [0.8, 0]), add(bA, [1.1, 0])), pm(add(bB, [0.8, 0]), add(bB, [1.1, 0])),
    S(bO, [3.4, 0], { dash: true }), S(bO, bA), S(bO, bB), top, bottom, A(bO, 312, 36, '', 0.5),
    N(bO, 'O', 'w'), N(bA, 'A', 'ne'), N(bB, 'B', 'se')], 34);
  // 2C
  const sA = [0, 0], sB = [5, 0], sC = apex(sA, sB, 61, 74);
  const eA = [0, 0], eB = [5, 0], eC = apex(eA, eB, 45, 57);
  const kh = apex([0, 0], [1, 0], 57, 76)[1], kL = [0, 0], kR = [r3(3 / kh), 0], kT = apex(kL, kR, 57, 76);
  const cA = P(219, 2.5), cB = P(321, 2.5);
  const qL = [-3, 0], qR = [3, 0], qP = P(46, 3);
  const pA = [0, 0], pB = [4, 0], pC = apex(pA, pB, 50, 60), pD = [6, 0], pE = add(pB, P(50, 2.2));
  // 2D
  const quad1 = shape([95, 78, 117, 70], [3.2, 2.6]);
  const quadX = shape([120, 60, 150, 30], [3.2, 2.8]);
  const gB = [4, 0], gD = P(78, 2.6), gC = add(gB, gD);
  const hB = [3, 0], hD = P(52, 3), hC = add(hB, hD);
  // 2E
  const pent5 = shape([110, 95, 118, 104, 113], [2.4, 2.2, 2.3]);
  const rp = reg(5, 1.6, -54);
  const p11 = reg(11, 1.8, 90);
  // A pentagon split into 3 numbered triangles by diagonals from its top corner
  const splitPent = (() => { const v = reg(5, 1.7, 90), c = (a, b, e, s) => T([r3((a[0] + b[0] + e[0]) / 3), r3((a[1] + b[1] + e[1]) / 3 - 0.1)], s);
    return D([{ poly: v }, S(v[0], v[2], { dash: true }), S(v[0], v[3], { dash: true }), c(v[0], v[1], v[2], '1'), c(v[0], v[2], v[3], '2'), c(v[0], v[3], v[4], '3')], 36); })();

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 8 2A Reviewing angles
    // =====================================================================
    // y8-2A Q1, Q2, Q9: right angles, straight lines, revolutions and vertically opposite angles
    'y8-2a-facts': `
      ${chips(['right angle: 90°'], ['straight line: 180°'], ['all the way round: 360°'], ['vertically opposite: equal'])}
      ${D([S([-2.4, 0], [2.4, 0]), S([0, 0], P(71, 2.2)), A([0, 0], 0, 71, '71°', 0.7), A([0, 0], 71, 180, 'a°', 0.6)], 34)}
      ${D([S(P(180, 2.2), P(0, 2.2)), S(P(243, 2.2), P(63, 2.2)), A([0, 0], 0, 63, '63°', 0.6), A([0, 0], 180, 243, 'a°', 0.6), A([0, 0], 63, 180, 'b°', 0.5)], 34)}
      <p class="hp-tag">Worked examples: find the pronumerals in each diagram.</p>
      ${steps(
        `<p><strong>Top: the angles sit on a straight line,</strong> so they add to 180°.</p>
         ${sum('a + 71 = 180<br>a = 180 − 71 = 109')}
         ${ans('109')}`,
        `<p><strong>Bottom: two straight lines cross.</strong> a is vertically opposite 63°, so a = 63. Then b sits on a straight line with 63°.</p>
         ${sum('b = 180 − 63 = 117')}
         ${ans('63, 117')}`,
        `<p><strong>Spotting a mistake?</strong> Add the angles that should make 90, 180 or 360. Angles of 52° and 124° marked on a straight line give 52 + 124 = 176, not 180, so that diagram is wrong.</p>`
      )}
      ${tip('With two or more letters, type the values in alphabetical order, separated by commas: 63, 117. A reflex angle (more than 180°) is usually 360 minus the rest.')}`,

    // y8-2A Q3: naming vertically opposite, complementary and supplementary angles
    'y8-2a-naming': `
      ${D([S(P(180, 2.3), P(0, 2.3)), S(P(130, 2.3), P(310, 2.3)), S([0, 0], P(40, 2.3)), RT([0, 0], 40, 130),
        N(P(180, 2.3), 'A', 'w'), N(P(130, 2.3), 'B', 'nw'), N(P(40, 2.3), 'C', 'ne'), N(P(0, 2.3), 'D', 'e'), N(P(310, 2.3), 'E', 'se'), N([0, 0], 'O', 's')], 38)}
      <p class="hp-tag">Worked example: name an angle that is (i) vertically opposite to ∠AOB, (ii) supplementary to ∠AOB.</p>
      ${steps(
        `<p><strong>Read the name.</strong> ∠AOB has its corner (vertex) at O, with arms going out to A and B.</p>`,
        `<p><strong>Vertically opposite:</strong> AD and BE are straight lines crossing at O. Across the cross from ∠AOB is the angle between the other ends, OD and OE.</p>
         ${ans('∠DOE')}`,
        `<p><strong>Supplementary means the two angles add to 180°.</strong> A, O and D make a straight line, so ∠AOB and ∠BOD sit together on it.</p>
         ${ans('∠BOD')}`
      )}
      <p><strong>Complementary</strong> means the two angles add to 90°. Look for the square corner mark: the angles that fill it, or match its parts, are complementary.</p>
      ${tip('Type three letters with the vertex in the middle, like DOE. ∠DOE and ∠EOD are the same angle.')}`,

    // y8-2A Q4, Q5: compass bearings
    'y8-2a-compass': `
      ${D([...['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].flatMap((c, k) => [S([0, 0], P(90 - 45 * k, 2), { thin: true }), T(P(90 - 45 * k, 2.45), c)]),
        S([0, 0], P(-22.5, 2.2), { arrow: 'end' }), T(P(-22.5, 2.7), 'ESE'), A([0, 0], -22.5, 90, '112.5°', 0.8)], 40)}
      <p class="hp-tag">Worked example: what is the bearing of east-south-east (ESE), halfway between E and SE?</p>
      ${steps(
        `<p><strong>Bearings start at north (0°) and turn clockwise.</strong> The eight compass points are evenly spaced, half a right angle apart: 45°.</p>`,
        `<p><strong>Count the steps clockwise from N.</strong> N to NE, NE to E, then half a step more to ESE: 2½ steps.</p>
         ${sum('2.5 × 45 = 112.5')}
         ${ans('112.5')}`,
        `<p><strong>Going the other way?</strong> Divide the bearing by 45 to count steps from N. A bearing of 157.5°: 157.5 ÷ 45 = 3.5 steps, halfway between SE (3 steps) and S (4 steps). That is SSE.</p>`
      )}
      ${tip('Type a bearing as a number with no ° sign. Type a direction as words with a hyphen, like north-east, or as letters, like NE.')}`,

    // y8-2A Q6: sharing a circle in unequal parts
    'y8-2a-share': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A round pizza is cut into sectors for <span class="hp-hl">10</span> friends, with none left over. Sam gets <span class="hp-hl">6 times</span> as much as each of the others, who share the rest equally. What is the <span class="hp-kw">angle</span> at the centre for Sam's piece?</p>
      ${fig({ kind: 'sector', parts: [['Sam: 6 parts', 6], ['the other 9 friends: 1 part each', 9]] })}
      ${steps(
        `<p><strong>Give each of the others 1 part.</strong> Sam gets 6 parts.</p>
         ${sum('6 + 9 = 15 parts')}`,
        `<p><strong>The parts share the full turn, 360°.</strong> Find one part.</p>
         ${sum('360 ÷ 15 = 24°')}`,
        `<p><strong>Sam has 6 parts.</strong></p>
         ${sum('6 × 24 = 144')}
         ${ans('144')}`
      )}
      ${tip('If everyone gets the same, just divide 360 by the number of people: for 10 people, 360 ÷ 10 = 36°. Check: 144 + 9 × 24 = 360.')}`,

    // y8-2A Q7, Q11, Q12: angles written with a pronumeral
    'y8-2a-algebra': `
      ${D([S([0, 0], [3.4, 0]), S([0, 0], [0, 3.4]), S([0, 0], P(33, 3.4)), RT([0, 0], 0, 90), A([0, 0], 0, 33, '', 1.0), A([0, 0], 33, 90, '', 0.8), T(P(15, 2.6), '(a + 9)°'), T(P(62, 2.3), '(2a + 9)°')], 40)}
      <p class="hp-tag">Worked example: find <b>a</b>, then the size of the larger angle.</p>
      ${steps(
        `<p><strong>Write the rule.</strong> The two parts fill a right angle.</p>
         ${sum('(2a + 9) + (a + 9) = 90')}`,
        `<p><strong>Collect like terms and solve.</strong></p>
         ${sum('3a + 18 = 90<br>3a = 72<br>a = 24')}
         ${ans('24')}`,
        `<p><strong>Asked for an angle?</strong> Put a back into its expression.</p>
         ${sum('2a + 9 = 2 × 24 + 9 = 57')}
         ${ans('57')}`
      )}
      <p><strong>Vertically opposite expressions are equal</strong>, so set them equal instead: 4a − 9 = 2a + 21 gives 2a = 30, so a = 15.</p>
      ${tip('Angles marked with the same letter are the same size. Check your answer: 57 + 33 = 90.')}`,

    // y8-2A Q10: writing an equation for a diagram
    'y8-2a-equation': `
      ${D([S([-2.6, 0], [2.6, 0]), S([0, 0], P(61, 2.4)), S([0, 0], P(121, 2.4)), A([0, 0], 0, 61, '61°', 0.9), A([0, 0], 61, 121, '(2b)°', 0.9), A([0, 0], 121, 180, 'a°', 0.7)], 38)}
      <p class="hp-tag">Worked example: write an equation linking <b>a</b> and <b>b</b>.</p>
      ${steps(
        `<p><strong>Spot the angle fact.</strong> All three angles sit on a straight line, so they add to 180°.</p>
         ${sum('a + 2b + 61 = 180')}`,
        `<p><strong>Tidy it up.</strong> Take 61 from both sides so only the letters are on the left.</p>
         ${sum('a + 2b = 119')}
         ${ans('a + 2b = 119')}`
      )}
      ${tip('Type it with an = sign: a+2b=119. Keep 2b together, since it means 2 × b. For angles around a point, use 360; for a right angle, use 90.')}`,

    // y8-2A Q8: angle between the hands of a clock
    'y8-2a-clock': `
      ${D([{ circle: [0, 0, 2] }, ...Array.from({ length: 12 }, (_, k) => S(P(90 - 30 * k, 1.78), P(90 - 30 * k, 2))),
        T(P(90, 1.5), '12'), T(P(0, 1.5), '3'), T(P(270, 1.5), '6'), T(P(180, 1.5), '9'),
        S([0, 0], P(138, 1.7), { arrow: 'end' }), S([0, 0], P(34, 1.1), { arrow: 'end' }), A([0, 0], 34, 138, '104°', 0.55)], 44)}
      <p class="hp-tag">Worked example: find the smaller angle between the hands at <b>1:52</b>.</p>
      ${steps(
        `<p><strong>Minute hand.</strong> It goes 360° in 60 minutes, so 6° each minute. Measure from the 12.</p>
         ${sum('52 × 6 = 312°')}`,
        `<p><strong>Hour hand.</strong> It moves 30° each hour, plus half a degree for every minute past the hour.</p>
         ${sum('1 × 30 + 52 × 0.5 = 30 + 26 = 56°')}`,
        `<p><strong>Find the gap.</strong> If it is more than 180°, the smaller angle is the other way round.</p>
         ${sum('312 − 56 = 256<br>360 − 256 = 104')}
         ${ans('104')}`
      )}
      ${tip('Do not forget the hour hand creeps forward as the minutes pass. An odd number of minutes gives a .5 answer, typed like 97.5.')}`,

    // =====================================================================
    // Year 8 2B Transversal lines and parallel lines
    // =====================================================================
    // y8-2B Q1, Q4: corresponding, alternate or co-interior
    'y8-2b-name': `
      ${D([...tBase, A(tI1, 0, 60, '', 0.5), A(tI2, 0, 60, '', 0.5)], 30, 'Corresponding (F): equal')}
      ${D([...tBase, A(tI1, 60, 180, '', 0.5), A(tI2, 240, 360, '', 0.5)], 30, 'Alternate (Z): equal')}
      ${D([...tBase, A(tI1, 0, 60, '', 0.5), A(tI2, 240, 360, '', 0.5)], 30, 'Co-interior (C): add to 180°')}
      <p class="hp-tag">Worked example: how do you name a pair of marked angles?</p>
      ${steps(
        `<p><strong>Find the transversal</strong>, the line that crosses the other two. Each marked angle sits at one of its crossings.</p>`,
        `<p><strong>Match the shape.</strong> Same position at each crossing (an F): <b>corresponding</b>. Both between the lines, on opposite sides of the transversal (a Z): <b>alternate</b>. Both between the lines, on the same side (a C): <b>co-interior</b>.</p>`,
        `<p><strong>Then use the arrows.</strong> If the lines are parallel, corresponding and alternate angles are equal, and co-interior angles add to 180° (supplementary).</p>
         ${ans('F corresponding, Z alternate, C co-interior')}`
      )}
      ${tip('The F, Z or C can be flipped, turned or stretched. The names come from position, so they work even when the lines are not parallel.')}`,

    // y8-2B Q5: are the lines parallel?
    'y8-2b-parallel': `
      ${D([S([-0.4, 0], [3.8, 0]), S(P(181, 1.8, npI2), P(1, 2.2, npI2)), S(P(248, 0.9, npI1), P(68, 0.9, npI2)), A(npI1, 0, 68, '68°', 0.6), A(npI2, 248, 361, '113°', 0.5)], 36)}
      <p class="hp-tag">Worked example: are the two lines cut by the transversal parallel?</p>
      ${steps(
        `<p><strong>Name the pair.</strong> Both angles are between the lines, on the same side: co-interior.</p>`,
        `<p><strong>Test the rule.</strong> Co-interior angles add to 180° only if the lines are parallel.</p>
         ${sum('68 + 113 = 181')}`,
        `<p><strong>181 is not 180,</strong> so the lines are not parallel, even though they look it.</p>
         ${ans('No')}`
      )}
      ${tip('For corresponding or alternate angles, the test is whether the two angles are equal. Even 1° out means not parallel.')}`,

    // y8-2B Q2, Q3: finding angles with parallel lines
    'y8-2b-find': `
      ${D([S([-0.4, 0], [3.8, 0]), S([-0.4, 2], [3.8, 2]), pm([3.2, 0], [3.5, 0]), pm([3.2, 2], [3.5, 2]), S(P(259, 0.9, fI1), P(79, 0.9, fI2)),
        A(fI1, 0, 79, '79°', 0.6), A(fI2, 0, 79, 'a°', 0.6), A(fI2, 79, 180, 'b°', 0.5)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b> and <b>b</b>, giving a reason for each.</p>
      ${steps(
        `<p><strong>a and 79° are in the same position at each crossing</strong> (an F shape), and the lines are parallel. Corresponding angles are equal.</p>
         ${ans('a = 79')}`,
        `<p><strong>b and a sit together on a straight line,</strong> so they add to 180°.</p>
         ${sum('b = 180 − 79 = 101')}
         ${ans('79, 101')}`
      )}
      ${tip('Type the values in alphabetical order, separated by commas: 79, 101. Say the reason in your head each time: corresponding, alternate, co-interior, vertically opposite or straight line.')}`,

    // y8-2B Q6, Q9: two or more steps with parallel lines
    'y8-2b-multi': `
      ${D([S([-3.2, 3], [3.2, 3]), S([-3.2, 0], [3.2, 0]), pm([2.4, 3], [2.7, 3]), pm([2.4, 0], [2.7, 0]), S(mT, mL), S(mT, mR),
        A(mL, 0, 53, '53°', 0.8), A(mR, 119, 180, '61°', 0.8), A(mT, 233, 299, 'a°', 0.6)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>Move the bottom angles up with alternate angles (Z shapes).</strong> The 53° angle matches the angle at the top between the left line and the top line. Same for 61° on the right.</p>`,
        `<p><strong>At the top, three angles now sit on a straight line:</strong> 53°, a and 61°.</p>
         ${sum('a = 180 − 53 − 61 = 66')}
         ${ans('66')}`
      )}
      ${tip('Write down each angle you find on the diagram as you go. If a is a reflex angle, find the angle inside it first, then take that from 360.')}`,

    // y8-2B Q7: an angle at a bend between parallel lines
    'y8-2b-bend': `
      ${bend(A(bA, 180, 216, '36°', 0.7), A(bB, 132, 180, '48°', 0.7))}
      <p class="hp-tag">Worked example: find <b>∠AOB</b>.</p>
      ${steps(
        `<p><strong>Draw a line through O parallel to the other two</strong> (dashed). It splits ∠AOB into a top part and a bottom part.</p>`,
        `<p><strong>Each part makes a Z with a given angle,</strong> so they are alternate angles: the top part is 36° and the bottom part is 48°.</p>`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('∠AOB = 36 + 48 = 84')}
         ${ans('84')}`
      )}
      ${tip('If a given angle is on the outside (obtuse), its part at O is co-interior with it: for 131°, the part is 180 − 131 = 49.')}`,

    // y8-2B Q8: a rule for the angle at a bend
    'y8-2b-rule': `
      ${bend(A(bA, 180, 216, 'a°', 0.7), A(bB, 0, 132, 'b°', 0.5))}
      <p class="hp-tag">Worked example: write a rule for <b>∠AOB</b> using a and b.</p>
      ${steps(
        `<p><strong>Draw the dashed parallel line through O</strong> to split ∠AOB in two.</p>`,
        `<p><strong>Top part:</strong> a Z with a, so it is a (alternate). <strong>Bottom part:</strong> it makes a C with b, so the two add to 180 (co-interior). The bottom part is 180 − b.</p>`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('∠AOB = a + 180 − b')}
         ${ans('a + 180 − b')}`
      )}
      ${tip('Type only the expression, with - for minus: a + 180 - b. Test it with numbers: a = 36 and b = 132 give 36 + 180 − 132 = 84.')}`,

    // =====================================================================
    // Year 8 2C Triangles
    // =====================================================================
    // y8-2C Q1, Q2: angle sum of a triangle
    'y8-2c-sum': `
      ${D([{ poly: [sA, sB, sC] }, A(sA, 0, 61, '61°', 0.7), A(sB, 106, 180, '74°', 0.7), AV(sC, sA, sB, 'a°', 0.6)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>The three angles in a triangle add to 180°.</strong></p>
         ${sum('a + 61 + 74 = 180')}`,
        `<p><strong>Take the two known angles from 180.</strong></p>
         ${sum('a = 180 − 61 − 74 = 45')}
         ${ans('45')}`
      )}
      ${tip('A square mark in a corner is 90°, so count it as one of the known angles.')}`,

    // y8-2C Q3, Q4: isosceles triangles
    'y8-2c-iso': `
      ${D([{ poly: [[0, 0], [3, 0], [1.5, 4.121]] }, tk([0, 0], [1.5, 4.121]), tk([3, 0], [1.5, 4.121]),
        A([1.5, 4.121], 250, 290, '40°', 1.0), A([0, 0], 0, 70, 'a°', 0.5), A([3, 0], 110, 180, 'a°', 0.5)], 30)}
      <p class="hp-tag">Worked example: find <b>a</b> in this isosceles triangle.</p>
      ${steps(
        `<p><strong>The two angles at the ends of the third side are equal</strong> (base angles). Take the top angle from 180 to see what they share.</p>
         ${sum('180 − 40 = 140')}`,
        `<p><strong>Halve it.</strong></p>
         ${sum('a = 140 ÷ 2 = 70')}
         ${ans('70')}`,
        `<p><strong>Given a base angle instead?</strong> The other base angle matches it. With base angles of 29°: 180 − 29 − 29 = 122 at the top.</p>`
      )}
      ${tip('The equal angles sit opposite the equal sides, the ones with tick marks. Check: 40 + 70 + 70 = 180.')}`,

    // y8-2C Q5: exterior angles
    'y8-2c-exterior': `
      ${D([{ poly: [eA, eB, eC] }, S(eB, [7, 0], { dash: true }), A(eA, 0, 45, '45°', 0.9), AV(eC, eA, eB, '78°', 0.5), A(eB, 0, 123, 'x°', 0.5)], 36)}
      <p class="hp-tag">Worked example: find the exterior angle <b>x</b>.</p>
      ${steps(
        `<p><strong>Find the inside angle next to x</strong> with the angle sum.</p>
         ${sum('180 − 45 − 78 = 57')}`,
        `<p><strong>x and that inside angle sit on a straight line.</strong></p>
         ${sum('x = 180 − 57 = 123')}
         ${ans('123')}`,
        `<p><strong>Shortcut:</strong> an exterior angle equals the two inside angles that are not next to it, added: 45 + 78 = 123. Working backwards, an exterior angle of 129° with one far inside angle of 46° leaves 129 − 46 = 83 for the other.</p>`
      )}
      ${tip('The exterior angle is outside the triangle, between one side and the next side made longer (the dashed line).')}`,

    // y8-2C Q6: is the triangle possible?
    'y8-2c-possible': `
      ${D([{ poly: [[0, 0], [4, 0], [2, 1.678]] }, tk([0, 0], [2, 1.678]), tk([4, 0], [2, 1.678]),
        A([0, 0], 0, 40, '40°', 0.9), A([4, 0], 140, 180, '40°', 0.9), A([2, 1.678], 220, 320, '100°', 0.45)], 40)}
      <p><strong>By angles:</strong> acute (all angles under 90°), right (one angle is 90°), obtuse (one angle over 90°).<br><strong>By sides:</strong> equilateral (all sides equal, all angles 60°), isosceles (two sides and two angles equal), scalene (all different).</p>
      <p class="hp-tag">Worked examples: can a triangle be (i) obtuse and isosceles, (ii) have two right angles?</p>
      ${steps(
        `<p><strong>Try real angles that add to 180°.</strong> For (i), 100°, 40° and 40° add to 180, one angle is obtuse and two are equal.</p>
         ${ans('Possible')}`,
        `<p><strong>For (ii), two right angles already use up</strong> 90 + 90 = 180, leaving 0° for the third angle. No triangle can do that.</p>
         ${ans('Not possible')}`
      )}
      ${tip('Sketch it. If every attempt breaks one of the rules above, it is not possible.')}`,

    // y8-2C Q7, Q8: triangles with parallel lines and other angle facts
    'y8-2c-mixed': `
      ${D([S([-1.6, 3], add(kR, [1.2, 3])), S([-1.6, 0], add(kR, [1.2, 0])), pm(add(kR, [0.5, 3]), add(kR, [0.8, 3])), pm(add(kR, [0.5, 0]), add(kR, [0.8, 0])),
        { poly: [kL, kR, kT] }, A(kT, 180, 237, '57°', 0.7), A(kR, 104, 180, '76°', 0.7), AV(kT, kL, kR, 'a°', 0.5)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>Use the parallel lines first.</strong> The 57° angle and the triangle's bottom-left angle make a Z, so they are alternate: the bottom-left angle is 57°.</p>`,
        `<p><strong>Now use the angle sum</strong> of the triangle.</p>
         ${sum('a = 180 − 57 − 76 = 47')}
         ${ans('47')}`
      )}
      ${tip('Look for Z, F and C shapes, straight lines, tick marks (isosceles) and three equal sides (equilateral, 60° each). A reflex angle is 360 minus the angle inside it.')}`,

    // y8-2C Q9: a triangle made from two radii
    'y8-2c-radii': `
      ${D([{ circle: [0, 0, 2.5] }, { poly: [[0, 0], cA, cB] }, tk([0, 0], cA), tk([0, 0], cB), A(cA, 0, 39, '39°', 0.8), AV([0, 0], cA, cB, '?', 0.45),
        N([0, 0], 'O', 'n'), N(cA, 'A', 'sw'), N(cB, 'B', 'se')], 40)}
      <p class="hp-tag">Worked example: O is the centre and ∠OAB = 39°. Find ∠AOB.</p>
      ${steps(
        `<p><strong>OA and OB are both radii, so they are equal.</strong> Triangle AOB is isosceles.</p>`,
        `<p><strong>The equal angles are at the ends of the chord AB</strong>, opposite the equal sides: ∠OBA = ∠OAB = 39°.</p>`,
        `<p><strong>Use the angle sum.</strong></p>
         ${sum('∠AOB = 180 − 39 − 39 = 102')}
         ${ans('102')}`
      )}
      ${tip('Given the angle at O instead? Take it from 180 and halve what is left to get each angle at the chord.')}`,

    // y8-2C Q14: isosceles triangles on a diameter
    'y8-2c-diameter': `
      ${D([{ circle: [0, 0, 3] }, S(qL, qR), S(qL, qP), S(qP, qR), S(qP, [0, 0]), N([0, 0], '', 's'), tk([0, 0], qL), tk([0, 0], qR), tk([0, 0], qP),
        A(qL, 0, 23, '23°', 1.3), AV(qP, qL, [0, 0], 'a°', 1.0), AV(qP, [0, 0], qR, 'c°', 0.6), A([0, 0], 0, 46, 'b°', 0.6)], 44)}
      <p class="hp-tag">Worked example: the straight line is a diameter and the dot is the centre. Find <b>a</b>, <b>b</b> and <b>c</b>.</p>
      ${steps(
        `<p><strong>Left triangle:</strong> two of its sides are radii, so it is isosceles. Its equal angles are 23° and a.</p>
         ${sum('a = 23')}`,
        `<p><strong>b is an exterior angle of the left triangle,</strong> so it equals the two far inside angles added.</p>
         ${sum('b = 23 + 23 = 46')}`,
        `<p><strong>Right triangle:</strong> also isosceles (two radii). Take b from 180 and halve.</p>
         ${sum('c = (180 − 46) ÷ 2 = 67')}
         ${ans('23, 46, 67')}`
      )}
      ${tip('Type the values in the order asked (a, b, c), separated by commas. With x instead of a number, do the same steps in x: write each answer as an expression, like 3x or 100 - x.')}`,

    // y8-2C Q10, Q13: proving angle facts with parallel lines
    'y8-2c-proof': `
      ${D([{ poly: [pA, pB, pC] }, S(pB, pD), S(pB, pE), pm(pA, pC), pm(pB, pE),
        A(pA, 0, 50, 'a°', 0.7), AV(pC, pA, pB, 'c°', 0.5), A(pB, 120, 180, 'b°', 0.45), A(pB, 50, 120, 'c°', 0.65), A(pB, 0, 50, 'a°', 0.9),
        N(pA, 'A', 'sw'), N(pB, 'B', 's'), N(pC, 'C', 'n'), N(pD, 'D', 'e'), N(pE, 'E', 'ne')], 38)}
      <p class="hp-tag">Worked example: prove that the exterior angle ∠CBD equals a + c.</p>
      ${steps(
        `<p><strong>Draw a helper line.</strong> BE goes through B, parallel to AC (see the arrows).</p>`,
        `<p><strong>∠EBD = a,</strong> because it makes an F with ∠CAB: corresponding angles in parallel lines are equal.</p>`,
        `<p><strong>∠CBE = c,</strong> because it makes a Z with ∠ACB: alternate angles in parallel lines are equal. So the exterior angle is made of the two parts.</p>
         ${ans('∠CBD = a + c')}`
      )}
      ${tip('In a proof, every step needs a reason: corresponding, alternate, co-interior, vertically opposite, or angles on a straight line.')}`,

    // =====================================================================
    // Year 8 2D Quadrilaterals
    // =====================================================================
    // y8-2D Q1, Q2: angle sum of a quadrilateral
    'y8-2d-sum': `
      ${D([{ poly: quad1 }, corner(quad1, 0, '95°', 0.6), corner(quad1, 1, '78°', 0.6), corner(quad1, 2, '117°', 0.5), corner(quad1, 3, 'a°', 0.6)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>The four angles of a quadrilateral add to 360°.</strong> A diagonal splits it into two triangles, and 2 lots of 180 is 360.</p>`,
        `<p><strong>Take the known angles from 360.</strong></p>
         ${sum('a = 360 − 95 − 78 − 117 = 70')}
         ${ans('70')}`,
        `<p><strong>A dent (non-convex) works the same way.</strong> Use the reflex angle inside the dent. With 215°, 36° and 48°: 360 − 215 − 36 − 48 = 61.</p>`
      )}
      ${tip('Check by adding all four: 95 + 78 + 117 + 70 = 360.')}`,

    // y8-2D Q3, Q4: properties of special quadrilaterals
    'y8-2d-special': `
      ${D([{ poly: [[0, 0], gB, gC, gD] }, pm([1.9, 0], [2.1, 0]), pm(add(gD, [1.9, 0]), add(gD, [2.1, 0])), pm(mid([0, 0], gD), add(mid([0, 0], gD), P(78, 0.01)), 2), pm(mid(gB, gC), add(mid(gB, gC), P(78, 0.01)), 2),
        T([2, -0.4], '7 cm'), T(add(mid(gD, gC), [0, 0.4]), 'x cm'), A([0, 0], 0, 78, '78°', 0.6), A(gB, 78, 180, 'a°', 0.5), A(gC, 180, 258, 'b°', 0.6)], 40)}
      <p class="hp-tag">Worked example: this is a parallelogram. Find <b>a</b>, <b>b</b> and <b>x</b>.</p>
      ${steps(
        `<p><strong>Opposite sides of a parallelogram are equal.</strong></p>
         ${sum('x = 7')}`,
        `<p><strong>Opposite angles are equal.</strong> b is opposite the 78° angle.</p>
         ${sum('b = 78')}`,
        `<p><strong>Angles next to each other are co-interior</strong> between parallel sides, so they add to 180°.</p>
         ${sum('a = 180 − 78 = 102')}
         ${ans('102, 78, 7')}`
      )}
      <p><strong>Other shapes:</strong> a rectangle has four 90° angles; a rhombus has four equal sides and opposite angles equal; a kite has two pairs of equal sides next to each other and one pair of equal angles; a trapezium has one pair of parallel sides.</p>
      ${tip('Type the values in alphabetical order, separated by commas: 102, 78, 7. Lengths go in as plain numbers, with no cm.')}`,

    // y8-2D Q5: shapes with parallel lines and other angle facts
    'y8-2d-mixed': `
      ${D([{ poly: [[0, 0], hB, hC, hD] }, S([0, 0], hC), tk([0, 0], hB), tk(hB, hC), tk(hC, hD), tk(hD, [0, 0]), A([0, 0], 0, 26, '26°', 1.2), A(hB, 52, 180, 'a°', 0.5)], 40)}
      <p class="hp-tag">Worked example: this is a rhombus with one diagonal drawn. Find <b>a</b>.</p>
      ${steps(
        `<p><strong>A rhombus's diagonal cuts each corner angle in half.</strong> So the whole bottom-left angle is double 26°.</p>
         ${sum('2 × 26 = 52')}`,
        `<p><strong>Opposite sides of a rhombus are parallel,</strong> so the bottom-left angle and a are co-interior: they add to 180°.</p>
         ${sum('a = 180 − 52 = 128')}
         ${ans('128')}`
      )}
      ${tip('Find the shape first (tick marks, arrows, square corners), then use its facts along with any parallel lines and straight lines.')}`,

    // y8-2D Q6: angles that are multiples of x
    'y8-2d-algebra': `
      ${D([{ poly: quadX }, corner(quadX, 0, '(4x)°', 0.5), corner(quadX, 1, '(2x)°', 0.7), corner(quadX, 2, '(5x)°', 0.45), corner(quadX, 3, 'x°', 1.0)], 36)}
      <p class="hp-tag">Worked example: find <b>x</b>.</p>
      ${steps(
        `<p><strong>The angles of a quadrilateral add to 360°.</strong> Add the four expressions.</p>
         ${sum('x + 2x + 4x + 5x = 12x')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('12x = 360<br>x = 360 ÷ 12 = 30')}
         ${ans('30')}`
      )}
      ${tip('If some angles are numbers, take them from 360 first. Check by putting x back in: 30 + 60 + 120 + 150 = 360.')}`,

    // y8-2D Q7, Q8, Q9: reasoning with the properties of quadrilaterals
    'y8-2d-props': `
      ${D([{ poly: [[0, 3], [-1.4, 1.6], [0, -1], [1.4, 1.6]] }, S([0, 3], [0, -1], { dash: true }), S([-1.4, 1.6], [1.4, 1.6], { dash: true }), RT([0, 1.6], 0, 90),
        tk([0, 3], [-1.4, 1.6]), tk([0, 3], [1.4, 1.6]), tk([-1.4, 1.6], [0, -1], 2), tk([1.4, 1.6], [0, -1], 2)], 36, 'A kite and its diagonals')}
      <p class="hp-tag">Worked examples: (i) Is a square a type of rectangle? (ii) Is a kite a type of rhombus?</p>
      ${steps(
        `<p><strong>List what the second shape needs.</strong> A rectangle needs four right angles and opposite sides equal and parallel. A rhombus needs four equal sides.</p>`,
        `<p><strong>(i) Does every square have all of a rectangle's properties?</strong> Yes: four right angles, and its opposite sides are equal and parallel.</p>
         ${ans('True')}`,
        `<p><strong>(ii) Does every kite have four equal sides?</strong> No: most kites have two short sides and two long ones (see the different tick marks). One missing property is enough.</p>
         ${ans('False')}`
      )}
      ${tip('Diagonals: in a kite they cross at right angles, but only one is cut in half. For "is it possible" questions, add up the angles you would need and compare with 360.')}`,

    // y8-2D Q10: proving angle facts by splitting into triangles
    'y8-2d-proof': `
      ${splitPent}
      <p class="hp-tag">Worked example: show that the angles of a pentagon add to 540°.</p>
      ${steps(
        `<p><strong>Split the shape into triangles</strong> with diagonals from one corner. A pentagon makes 3 triangles.</p>`,
        `<p><strong>The triangles' angles fit together</strong> to make exactly the pentagon's angles, with nothing left over.</p>`,
        `<p><strong>Each triangle adds to 180°.</strong></p>
         ${sum('3 × 180 = 540')}
         ${ans('540')}`
      )}
      <p><strong>Writing an angle in letters:</strong> in a triangle with angles p, q and r, the exterior angle next to r sits on a straight line with it, so it is 180 − r. Since p + q + r = 180, that is the same as p + q.</p>
      ${tip('A reflex angle marked outside a corner is 360 minus the angle inside. Type an expression with letters only, like p+q.')}`,

    // =====================================================================
    // Year 8 2E Polygons
    // =====================================================================
    // y8-2E Q1, Q2: angle sum of a polygon
    'y8-2e-sum': `
      ${splitPent}
      <p class="hp-tag">Worked example: find the angle sum of a 15-sided polygon.</p>
      ${steps(
        `<p><strong>See the pattern on a small shape.</strong> Diagonals from one corner split a pentagon (5 sides) into 3 triangles. There are always 2 fewer triangles than sides.</p>
         ${sum('3 × 180 = 540')}`,
        `<p><strong>So the rule is:</strong></p>
         ${sum('angle sum = (n − 2) × 180')}`,
        `<p><strong>Use it with n = 15.</strong></p>
         ${sum('(15 − 2) × 180 = 13 × 180 = 2340')}
         ${ans('2340')}`
      )}
      ${tip('n is the number of sides. Type the answer as a plain number with no ° sign.')}`,

    // y8-2E Q3: a missing angle in a polygon
    'y8-2e-find': `
      ${D([{ poly: pent5 }, corner(pent5, 0, '110°', 0.5), corner(pent5, 1, '95°', 0.5), corner(pent5, 2, '118°', 0.5), corner(pent5, 3, '104°', 0.5), corner(pent5, 4, 'a°', 0.5)], 46)}
      <p class="hp-tag">Worked example: find <b>a</b> in this pentagon.</p>
      ${steps(
        `<p><strong>Find the angle sum.</strong> A pentagon has 5 sides.</p>
         ${sum('(5 − 2) × 180 = 540')}`,
        `<p><strong>Take every known angle from it.</strong></p>
         ${sum('a = 540 − 110 − 95 − 118 − 104 = 113')}
         ${ans('113')}`
      )}
      ${tip('Count the sides carefully first. A reflex angle inside a dent counts just like any other angle. Check: all five add back to 540.')}`,

    // y8-2E Q4, Q7, Q9: interior angle of a regular polygon
    'y8-2e-regular': `
      ${D([{ poly: p11 }, AV(p11[0], p11[1], p11[10], '?', 0.5)], 36)}
      <p class="hp-tag">Worked example: find the size of an interior angle of a regular 11-sided polygon, to one decimal place.</p>
      ${steps(
        `<p><strong>Angle sum first.</strong></p>
         ${sum('(11 − 2) × 180 = 9 × 180 = 1620')}`,
        `<p><strong>Regular means every angle is the same,</strong> so share the sum between the 11 angles.</p>
         ${sum('1620 ÷ 11 = 147.27...')}`,
        `<p><strong>Round at the end.</strong> The next digit is 7, so round up.</p>
         ${ans('147.3')}`
      )}
      ${tip('To type a rule, use / for divide and brackets where needed, like (n+1)/3. Picture what happens to the shape and its angles as n gets bigger and bigger.')}`,

    // y8-2E Q5, Q10: the number of sides from the angles
    'y8-2e-reverse': `
      <p class="hp-tag">Worked examples: (i) a polygon has an angle sum of 2700°. (ii) A regular polygon has interior angles of 168°. How many sides does each have?</p>
      ${steps(
        `<p><strong>(i) Undo the rule</strong> angle sum = (n − 2) × 180. Divide by 180 to get the number of triangles, then add 2.</p>
         ${sum('2700 ÷ 180 = 15<br>15 + 2 = 17')}
         ${ans('17')}`,
        `<p><strong>(ii) Try a number of sides</strong> and use the rule from Example 9: interior angle = (n − 2) × 180 ÷ n.</p>
         ${sum('n = 12: 10 × 180 ÷ 12 = 150° (too small)<br>n = 40: 38 × 180 ÷ 40 = 171° (too big)')}`,
        `<p><strong>Adjust and try again.</strong> More sides give bigger angles, so the answer is between 12 and 40.</p>
         ${sum('n = 30: 28 × 180 ÷ 30 = 168° ✓')}
         ${ans('30')}`
      )}
      ${tip('Check each answer with the rule. (i): (17 − 2) × 180 = 2700 ✓. (ii): (30 − 2) × 180 = 5040, and 5040 ÷ 30 = 168 ✓. Sides come in whole numbers, so if a division does not come out whole, recheck your working.')}`,

    // y8-2E Q6, Q11: polygon diagrams with extended sides, regular shapes and parallel sides
    'y8-2e-diagram': `
      ${D([{ poly: rp }, S(rp[0], add(rp[0], [1.6, 0]), { dash: true }), A(rp[0], 0, dir(rp[0], rp[1]), 'x°', 0.5)], 40)}
      <p class="hp-tag">Worked example: this is a regular pentagon with one side extended. Find <b>x</b>.</p>
      ${steps(
        `<p><strong>Find one interior angle.</strong> The angle sum is 540°, shared between 5 equal angles.</p>
         ${sum('540 ÷ 5 = 108')}`,
        `<p><strong>x sits on a straight line with that interior angle.</strong></p>
         ${sum('x = 180 − 108 = 72')}
         ${ans('72')}`,
        `<p><strong>A reflex angle outside a corner</strong> goes the rest of the way round: 360 − 108 = 252.</p>`
      )}
      ${tip('Arrows mark parallel sides, and co-interior angles between them add to 180°. For a polygon with letters, write the angle sum as an equation and solve it.')}`,

    // y8-2E Q8: angle sum from a point in the middle
    'y8-2e-centre': `
      ${D([{ poly: reg(12, 2, 90) }, ...reg(12, 2, 90).map(p => S([0, 0], p, { thin: true })), N([0, 0], '', 's')], 32)}
      <p class="hp-tag">Worked example: use a point in the middle to find the angle sum of a 12-sided polygon.</p>
      ${steps(
        `<p><strong>Join the middle point to every corner.</strong> That makes one triangle for each side: 12 triangles.</p>`,
        `<p><strong>Add up all the triangles' angles.</strong></p>
         ${sum('12 × 180 = 2160')}`,
        `<p><strong>The angles around the middle point are not angles of the polygon.</strong> They make a full turn, so take 360 off.</p>
         ${sum('2160 − 360 = 1800')}
         ${ans('1800')}`
      )}
      ${tip('From one corner you get 2 fewer triangles than sides. From a middle point you get one per side, then you take away the 360° in the middle. Both ways give the same answer.')}`,

    // =====================================================================
    // Year 8 2F Three-dimensional solids and Euler's formula
    // =====================================================================
    // y8-2F Q1, Q2, Q3, Q12: naming solids by faces, and as prisms or pyramids
    'y8-2f-faces': `
      ${chips(['tetra 4'], ['penta 5'], ['hexa 6'], ['hepta 7'], ['octa 8'], ['nona 9'], ['deca 10'], ['undeca 11'], ['dodeca 12'])}
      ${D(pyramid(12, 1.8, 2.8, 15), 40)}
      <p class="hp-tag">Worked example: name this solid as a pyramid or prism, and by its number of faces.</p>
      ${steps(
        `<p><strong>Prism or pyramid?</strong> Triangles meet at a point above one base, so it is a pyramid. It is named after its base, which has 12 sides (a dodecagon).</p>
         ${ans('dodecagonal pyramid')}`,
        `<p><strong>Count every face</strong>, including hidden ones (dashed edges show the back).</p>
         ${sum('12 triangles + 1 base = 13 faces')}`,
        `<p><strong>Use the prefix and add "hedron".</strong> 13 is 3 + 10, which is trideca.</p>
         ${ans('tridecahedron')}`
      )}
      ${tip('Going the other way, read the prefix: an icosahedron (icosa = 20) has 20 faces. Type names in lower case, like tridecahedron or dodecagonal pyramid.')}`,

    // y8-2F Q4, Q5: naming prisms and pyramids
    'y8-2f-prism': `
      ${D(prism(8, 1.2, 3), 40, 'Solid 1')}
      ${D(pyramid(7, 1.7, 2.6, 10), 40, 'Solid 2')}
      <p class="hp-tag">Worked example: name each solid.</p>
      ${steps(
        `<p><strong>Prism or pyramid?</strong> A prism has two identical ends joined by rectangles. A pyramid has one base and triangles meeting at a point.</p>`,
        `<p><strong>Solid 1</strong> has two matching ends joined by rectangles: a prism. Each end has 8 sides, an octagon.</p>
         ${ans('octagonal prism')}`,
        `<p><strong>Solid 2</strong> has triangles meeting at a point: a pyramid. Its base has 7 sides, a heptagon.</p>
         ${ans('heptagonal pyramid')}`
      )}
      ${tip('Turn the shape\'s name into a describing word: octagon becomes octagonal, heptagon becomes heptagonal. Type it in lower case with a space before prism or pyramid.')}`,

    // y8-2F Q6, Q11, Q14, Q15: counting faces, vertices and edges
    'y8-2f-count': `
      ${D(prism(8, 1.2, 3), 40)}
      <p class="hp-tag">Worked example: find F, V and E for an octagonal prism.</p>
      ${steps(
        `<p><strong>Faces (F):</strong> the 2 ends, plus one rectangle for each side of the octagon.</p>
         ${sum('F = 2 + 8 = 10')}`,
        `<p><strong>Vertices (V):</strong> 8 corners on each end.</p>
         ${sum('V = 2 × 8 = 16')}`,
        `<p><strong>Edges (E):</strong> 8 around each end, plus 8 joining the ends.</p>
         ${sum('E = 8 + 8 + 8 = 24')}
         ${ans('10, 16, 24')}`
      )}
      ${tip('Type the numbers in the order asked, separated by commas: 10, 16, 24. Count hidden (dashed) edges too. For a pyramid, count the base, the triangles, the top point and the edges going up to it.')}`,

    // y8-2F Q7, Q8, Q13: using and rearranging Euler's formula
    'y8-2f-euler': `
      ${sum('E = F + V − 2')}
      <p class="hp-tag">Worked examples: (i) F = 11 and V = 18. Find E. (ii) F = 12 and E = 30. Find V.</p>
      ${steps(
        `<p><strong>(i) E is on its own already,</strong> so substitute and work it out.</p>
         ${sum('E = 11 + 18 − 2 = 27')}
         ${ans('27')}`,
        `<p><strong>(ii) Substitute what you know, then solve</strong> like any equation.</p>
         ${sum('30 = 12 + V − 2<br>30 = V + 10<br>V = 20')}
         ${ans('20')}`,
        `<p><strong>Rearranging a rule</strong> is solving with letters: do the same to both sides. To make n the subject of T = m + n − 5, take m from both sides and add 5: n = T − m + 5.</p>`
      )}
      ${tip('For a rearranged rule, type only the part after the = sign, with capital letters, like T-m+5. Check it with numbers from a real solid.')}`,

    // y8-2F Q9, Q15: true or false statements about solids
    'y8-2f-true': `
      ${D(pyramid(7, 1.7, 2.6, 10), 40)}
      <p class="hp-tag">Worked examples: true or false? (i) A cylinder is a prism. (ii) Every pyramid has the same number of faces as vertices.</p>
      ${steps(
        `<p><strong>"True" means true every time.</strong> One example that breaks it (a counterexample) makes it false.</p>`,
        `<p><strong>(i)</strong> A prism's ends are polygons joined by flat rectangles. A cylinder's ends are circles and its side is curved, so it is not a prism.</p>
         ${ans('False')}`,
        `<p><strong>(ii) Think about any pyramid,</strong> with a base of n sides. Faces: the base plus n triangles, n + 1. Vertices: n base corners plus the top point, n + 1. They always match.</p>
         ${ans('True')}`
      )}
      ${tip('Sketch a few different solids before deciding. To show "true", give a reason that works for every case, not just one example.')}`,

    // y8-2F Q10: making a solid with one straight cut
    'y8-2f-cut': `
      ${(() => { const h = 2.6, r = 1.4, k = 1 - 1.1 / h, c = [[r, r], [-r, r], [-r, -r], [r, -r]].map(([x, y]) => pr([r3(x * k), r3(y * k), 1.1]));
        return D([...pyramid(4, r * Math.SQRT2, h, 45), S(c[0], c[1], { dash: true }), S(c[1], c[2], { dash: true }), S(c[2], c[3], { dash: true }), S(c[3], c[0], { dash: true })], 40); })()}
      <p class="hp-tag">Worked examples: can one straight cut through the first solid make the second? (i) square pyramid (square pyramid) (ii) sphere (cube)</p>
      ${steps(
        `<p><strong>A straight cut makes one new flat face</strong> on each piece. The rest of each piece keeps the faces it had.</p>`,
        `<p><strong>(i)</strong> Cut parallel to the base, near the top (dashed). The top piece has a square base and 4 triangles meeting at a point: a smaller square pyramid.</p>
         ${ans('Yes, it is possible')}`,
        `<p><strong>(ii)</strong> Each piece of a sphere gets one flat face, but the rest is still curved. A cube has no curved faces.</p>
         ${ans('No, it is not possible')}`
      )}
      ${tip('Picture where the cut goes, then count the faces of the new piece. Cutting a corner off a solid adds a face.')}`,

    // y8-2F Q16: convex or non-convex
    'y8-2f-convex': `
      ${D(prism(3, 1.3, 2.2), 36, 'Convex')}
      ${(() => { const U = [[0, 0], [3, 0], [3, 2], [2.2, 2], [2.2, 0.8], [0.8, 0.8], [0.8, 2], [0, 2]], L = 2.2;
        const f = (i) => U[i], b = (p) => pr([p[0], L, p[1]]), a = (p) => pr([p[0], 0, p[1]]), side = (i, j) => ({ poly: [a(f(i)), a(f(j)), b(f(j)), b(f(i))], fill: true });
        return D([side(4, 5), side(5, 6), side(6, 7), side(2, 3), side(1, 2), { poly: U.map(a), fill: true }, S(a([0.4, 2]), a([2.6, 2]), { dash: true }), N(a([0.4, 2]), ''), N(a([2.6, 2]), '')], 36, 'Non-convex'); })()}
      <p class="hp-tag">Worked example: is each solid convex or non-convex?</p>
      ${steps(
        `<p><strong>Imagine joining two points on the solid with a straight line.</strong> Convex means the line stays inside the solid every time, wherever you pick the points.</p>`,
        `<p><strong>The triangular prism has no dents.</strong> Any two points join up without leaving the solid.</p>
         ${ans('Convex')}`,
        `<p><strong>The U-shaped solid has a gap.</strong> The dashed line joins the tops of the two arms, and it passes through empty space.</p>
         ${ans('Non-convex')}`
      )}
      ${tip('Look for a dent, notch or step. One line that leaves the solid is enough to make it non-convex.')}`,

    // =====================================================================
    // Year 8 2G Three-dimensional coordinate systems
    // =====================================================================
    // y8-2G Q1, Q2, Q3: cubes in a lettered 3D grid
    'y8-2g-cubes': `
      ${D([...floor3(), ...axes3(), ...cube3(1, 2, 2, 'K')], 34)}
      <p class="hp-tag">Worked example: give the coordinates of cube K.</p>
      ${steps(
        `<p><strong>x letter first:</strong> follow the cube down to the floor (dashed), then read the capital letter along the x axis, which comes towards you.</p>
         ${sum('x: B')}`,
        `<p><strong>y letter next:</strong> read the small letter along the y axis, which goes to the right.</p>
         ${sum('y: c')}`,
        `<p><strong>Level last:</strong> count up the z axis. K sits on the third layer.</p>
         ${sum('z: 3')}
         ${ans('(B, c, 3)')}`
      )}
      ${tip('Type the letters and number in order, in brackets: (B,c,3). To find the floor square under a stack, use only the two letters and ignore the level.')}`,

    // y8-2G Q4, Q5, Q6: reading points on a 3D graph
    'y8-2g-points': `
      ${D([...axes3(), ...ticks3(), S([0, 0], g3(1, 0, 0), { dash: true }), S(g3(1, 0, 0), g3(1, 4, 0), { dash: true }), S(g3(1, 4, 0), g3(1, 4, 3), { dash: true }),
        N(g3(1, 0, 0), 'A', 's'), N(g3(1, 4, 0), 'B', 'se'), N(g3(1, 4, 3), 'P', 'e')], 34)}
      <p class="hp-tag">Worked example: write down the coordinates of P.</p>
      ${steps(
        `<p><strong>Follow the dashed path from O.</strong> First along the x axis, which comes towards you: 1 unit to A.</p>`,
        `<p><strong>Then across, parallel to the y axis:</strong> 4 units to B. Then <strong>straight up</strong>, parallel to the z axis: 3 units to P.</p>`,
        `<p><strong>Write them in the order x, y, z.</strong></p>
         ${ans('(1, 4, 3)')}`
      )}
      ${tip('Type coordinates in brackets with commas, like (1, 4, 3). A point on the floor has z = 0, and a point on an axis has two zeros. B here is (1, 4, 0).')}`,

    // y8-2G Q10: volume of the box from the origin to a point
    'y8-2g-volume': `
      ${D([...axes3(), S(g3(5, 0, 0), g3(5, 4, 0), { dash: true }), S(g3(0, 4, 0), g3(5, 4, 0), { dash: true }),
        S(g3(0, 0, 2), g3(5, 0, 2), { dash: true }), S(g3(0, 0, 2), g3(0, 4, 2), { dash: true }), S(g3(5, 0, 2), g3(5, 4, 2), { dash: true }), S(g3(0, 4, 2), g3(5, 4, 2), { dash: true }),
        S(g3(5, 0, 0), g3(5, 0, 2), { dash: true }), S(g3(5, 4, 0), g3(5, 4, 2), { dash: true }), S(g3(0, 4, 0), g3(0, 4, 2), { dash: true }), N(g3(5, 4, 2), ''), T(add(g3(5, 4, 2), [-0.25, -0.5]), 'P(5, 4, 2)', 'end')], 30)}
      <p class="hp-tag">Worked example: O and P(5, 4, 2) are opposite corners of a rectangular prism. Find its volume.</p>
      ${steps(
        `<p><strong>Read the box's measurements from P.</strong> It goes 5 along x, 4 along y and 2 up.</p>`,
        `<p><strong>Volume of a rectangular prism</strong> is length × width × height.</p>
         ${sum('5 × 4 × 2 = 40')}
         ${ans('40')}`
      )}
      ${tip('Type just the number, with no units. Multiply in any order.')}`,

    // y8-2G Q7, Q8: moving through a lettered grid
    'y8-2g-moves': `
      ${D([...floor3(), ...axes3('x (East)', 'y (North)', 'z (Up)'), ...cube3(0, 0, 0, 'S'), ...cube3(2, 3, 3, 'T')], 34)}
      <p class="hp-tag">Worked example: a cube at S(A, a, 1) can only move East, North or Up. How many spaces does it move to reach T(C, d, 4)?</p>
      ${steps(
        `<p><strong>Count each direction on its own.</strong></p>
         ${sum('East (x): A to C is 2<br>North (y): a to d is 3<br>Up (z): 1 to 4 is 3')}`,
        `<p><strong>Add them.</strong></p>
         ${sum('2 + 3 + 3 = 8')}
         ${ans('8')}`,
        `<p><strong>Moving the other way:</strong> from (C, d, 1), go 1 space West, 2 spaces South and up 2 levels. West goes back a capital letter (C to B), South goes back two small letters (d to b), and up 2 makes level 3.</p>
         ${ans('(B, b, 3)')}`
      )}
      ${tip('Type a position as (B,b,3): capital letter, small letter, level. East, North and Up go forward; West, South and down go back.')}`,

    // y8-2G Q9: shortest distance moving only along the axes
    'y8-2g-distance': `
      <p class="hp-tag">Worked example: a drone can only fly along the x, y and z directions. Find the shortest distance from (4, −2, 10) to (9, 6, 3).</p>
      ${flow(['x', '4 → 9'], ['y', '−2 → 6'], ['z', '10 → 3'])}
      ${steps(
        `<p><strong>Find the distance in each direction</strong>: the bigger number take away the smaller.</p>
         ${sum('x: 9 − 4 = 5<br>y: 6 − (−2) = 6 + 2 = 8<br>z: 10 − 3 = 7')}`,
        `<p><strong>The drone must cover all three,</strong> so add them.</p>
         ${sum('5 + 8 + 7 = 20')}
         ${ans('20')}`
      )}
      ${tip('Distances are never negative, even when a coordinate goes down. Taking away a negative is the same as adding: 6 − (−2) = 8.')}`,

    // y8-2G Q11: reading a contour map
    'y8-2g-contour': `
      ${D([{ circle: [3, 3, 2.8] }, T([3, 5.5], '100'), { circle: [3.6, 3, 2.1] }, T([3.6, 4.8], '150'), { circle: [4.1, 3, 1.4] }, T([4.1, 4.1], '200'), { circle: [4.5, 3, 0.7] }, T([4.5, 3.3], '250'),
        N([2.1, 3], 'X', 's')], 34)}
      <p class="hp-tag">Worked example: about how high is point X, and is the land getting higher or lower as you walk from X to the middle?</p>
      ${steps(
        `<p><strong>Read the heights on the rings</strong> (in metres). Every point on a ring is at that height.</p>`,
        `<p><strong>X is between the 150 ring and the 200 ring,</strong> about halfway.</p>
         ${ans('about 175 m')}`,
        `<p><strong>Walking to the middle, the numbers go up</strong> (200, then 250), so the land rises. The rings are far apart on the left, so it is a gentle climb, and bunched up on the right, where it is steep.</p>`
      )}
      ${tip('Rings going up towards the middle make a hill, with the top in the centre. Rings going down towards the middle make a dip. Close rings mean steep; far apart means gentle.')}`
  });
})();
