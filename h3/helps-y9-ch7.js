/* H3 help panels for Year 9 Chapter 7. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 7A to 7H. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---------- diagram helpers (angles are worked out with trig, so pictures are drawn to scale) ----------
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const rad = (a) => a * Math.PI / 180;
  const P = (deg, len, o = [0, 0]) => [r3(o[0] + len * Math.cos(rad(deg))), r3(o[1] + len * Math.sin(rad(deg)))];
  const add = (p, q) => [r3(p[0] + q[0]), r3(p[1] + q[1])];
  const mid = (p, q) => [r3((p[0] + q[0]) / 2), r3((p[1] + q[1]) / 2)];
  const lerp = (p, q, t) => [r3(p[0] + (q[0] - p[0]) * t), r3(p[1] + (q[1] - p[1]) * t)];
  const dir = (v, p) => r3(((Math.atan2(p[1] - v[1], p[0] - v[0]) * 180 / Math.PI) + 360) % 360);
  const S = (a, b, x) => Object.assign({ seg: [a[0], a[1], b[0], b[1]] }, x || {});
  const A = (v, a1, a2, label, r) => ({ angle: [v[0], v[1], r3(a1), r3(a2)], label: label || '', r: r || 0.6 });
  const AV = (v, p, q, label, r) => A(v, dir(v, p), dir(v, q), label, r);   // from ray v-p, anticlockwise to ray v-q
  // The angle at V inside the corner P V Q (always the side under 180°).
  const ang = (V, p, q, label, r) => {
    let a1 = dir(V, p), a2 = dir(V, q);
    if (((a2 - a1) % 360 + 360) % 360 > 180) [a1, a2] = [a2, a1];
    return A(V, a1, a2, label, r);
  };
  const RT = (v, a1, a2, r) => ({ angle: [v[0], v[1], a1, a2], right: true, r: r || 0.45 });
  const rt = (V, p, q, r) => Object.assign(ang(V, p, q, '', r || 0.45), { right: true });
  const N = (p, name, pos) => ({ point: p, name, pos: pos || 'ne' });
  const T = (p, label, anchor) => Object.assign({ label, at: p }, anchor ? { anchor } : {});
  const tk = (p, q, n) => ({ tick: [p[0], p[1], q[0], q[1]], n: n || 1 });
  const pm = (p, q, n) => ({ par: [p[0], p[1], q[0], q[1]], n: n || 1 });
  const dm = (p, q, label, off) => ({ dim: [p[0], p[1], q[0], q[1]], label, off: off == null ? 0.5 : off });
  const D = (items, unit, caption) => fig(Object.assign({ kind: 'diagram', unit: unit || 36, items }, caption ? { caption } : {}));
  const reg = (n, r, a0, o = [0, 0]) => Array.from({ length: n }, (_, k) => P(a0 + 360 * k / n, r, o));
  // Apex of a triangle on base b0-b1 (along the x-axis) with base angles p at b0 and q at b1.
  const apex = (b0, b1, p, q) => { const c = b1[0] - b0[0], s = c * Math.sin(rad(q)) / Math.sin(rad(180 - p - q)); return P(p, s, b0); };
  // A polygon with these interior angles (anticlockwise from V0), the first n-2 side lengths given; the last two close it.
  const polyA = (angles, lens) => {
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
  // Interior angle at corner i of an anticlockwise polygon (works for reflex corners too).
  const corner = (pts, i, label, r) => AV(pts[i], pts[(i + 1) % pts.length], pts[(i + pts.length - 1) % pts.length], label, r);
  // A polygon with vertex names pushed away from the middle and side labels outside each side.
  // sides[i] labels the side from pts[i] to pts[i + 1].
  const POSN = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
  const named = (pts, names, sides, o = {}) => {
    const n = pts.length, cx = pts.reduce((a, p) => a + p[0], 0) / n, cy = pts.reduce((a, p) => a + p[1], 0) / n;
    const it = [{ poly: pts, fill: !!o.fill }];
    pts.forEach((p, i) => {
      if (!names || !names[i]) return;
      const k = ((Math.round(Math.atan2(p[1] - cy, p[0] - cx) / (Math.PI / 4)) % 8) + 8) % 8;
      it.push({ point: p, name: names[i], pos: POSN[k] });
    });
    (sides || []).forEach((s, i) => {
      if (!s) return;
      const p = pts[i], q = pts[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      let nx = -(q[1] - p[1]), ny = q[0] - p[0];
      const L = Math.hypot(nx, ny); nx /= L; ny /= L;
      if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      const off = o.off || 0.4;
      it.push({ label: s, at: [r3(mx + nx * off), r3(my + ny * off - 0.08)], anchor: nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle' });
    });
    return it;
  };
  // Square grid from (x0, y0) to (x1, y1) with numbered axes.
  const G = (x0, x1, y0, y1, items, unit) => {
    const it = [];
    for (let x = x0; x <= x1; x++) it.push({ seg: [x, y0, x, y1], thin: true });
    for (let y = y0; y <= y1; y++) it.push({ seg: [x0, y, x1, y], thin: true });
    it.push(S([0, 0], [x1 + 0.6, 0], { arrow: 'end' }), S([0, 0], [0, y1 + 0.6], { arrow: 'end' }), T([x1 + 0.95, -0.1], 'x'), T([0, y1 + 0.95], 'y'), T([-0.35, -0.45], 'O'));
    for (let x = Math.max(1, x0); x <= x1; x++) it.push(T([x, -0.45], String(x)));
    for (let y = Math.max(1, y0); y <= y1; y++) it.push(T([-0.4, y - 0.08], String(y)));
    return fig({ kind: 'diagram', unit: unit || 30, items: it.concat(items) });
  };
  // A clock face of radius 2 with hands given as directions in degrees (anticlockwise from 3 o'clock).
  const clock = (extra) => D([{ circle: [0, 0, 2] }, ...Array.from({ length: 12 }, (_, k) => S(P(90 - 30 * k, 1.78), P(90 - 30 * k, 2))),
    T(P(90, 1.5), '12'), T(P(0, 1.5), '3'), T(P(270, 1.5), '6'), T(P(180, 1.5), '9'), ...extra], 42);
  // A bend B between two parallel lines: the top arm makes angle a with the top line, the bottom arm angle b with the bottom line.
  const bendFig = (a, b, mk) => {
    const O = [0, 0], tA = P(a, 2 / Math.sin(rad(a))), tC = P(360 - b, 2 / Math.sin(rad(b)));
    return D([S([-1.2, 2], add(tA, [1.4, 0])), S([-1.2, -2], add(tC, [1.4, 0])), pm(add(tA, [0.8, 0]), add(tA, [1.1, 0])), pm(add(tC, [0.8, 0]), add(tC, [1.1, 0])),
      S(O, [3.4, 0], { dash: true }), S(O, tA), S(O, tC), ...mk(tA, tC), A(O, 360 - b, a, '', 0.5),
      N(O, 'B', 'w'), N(tA, 'A', 'ne'), N(tC, 'C', 'se')], 34);
  };

  // ---------- fixed shapes used below ----------
  // 7A
  const tA1 = [0, 0], tA2 = [5, 0], tA3 = apex(tA1, tA2, 33, 49);
  const isoTop = [1.5, r3(1.5 * Math.tan(rad(74)))];
  const exA = [0, 0], exB = [5, 0], exC = apex(exA, exB, 59, 37);
  const tanA = [3, r3(-3 * Math.tan(rad(42)))];
  // 7B
  const tI1 = [1, 0], tI2 = [r3(1 + 2 / Math.tan(rad(61))), 2];
  const fI1 = [1, 0], fI2 = [r3(1 + 2 / Math.tan(rad(73))), 2];
  const mT = [0, 3], mL = P(227, 3 / Math.sin(rad(47)), mT), mR = P(302, 3 / Math.sin(rad(58)), mT);
  const prA = [0, 0], prC = [5, 0], prB = apex(prA, prC, 61, 70), prRay = add(prB, [2.6, 0]);
  // 7C
  const quad1 = polyA([83, 96, 112, 69], [3.2, 2.6]);
  const kT = [0, 0], kL = [-1.439, -1.389], kB = [0, -3.444], kR = [1.439, -1.389];
  const p11 = polyA([160, 140, 150, 145, 148, 142, 150, 144, 146, 147, 148], [1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2]);
  const dart = polyA([34, 238, 41, 47], [3.4, 1.6]);
  const pent2 = [[0, 0], [4, 0], [2.4, 1], [2, 3.2], [1.6, 1]];
  // 7D
  const cf1 = [0, 0], cf2 = [4.6, 0], cf3 = apex(cf1, cf2, 47, 71);
  const cg1 = [10.6, 0], cg2 = [6, 0], cg3 = [r3(10.6 - cf3[0]), cf3[1]];
  const wQ = [0, 0], wP = [3.5, 0], wR = P(52, 5.5), wZ = [11, 0], wY = [7.5, 0], wX = P(128, 5.5, [11, 0]);
  const ssA = [0, 0], ssB = [3.5, 0], ssC1 = P(40, 1.591), ssC2 = P(40, 3.771);
  // 7E
  const eC = [0, 0], eA = P(150, 2), eE = P(330, 2), eB = P(210, 1.337), eD = P(30, 1.337);
  const iA = [2, r3(2 / Math.tan(rad(23)))], iB = [0, 0], iC = [4, 0], iD = [2, 0];
  // 7G
  const hgA = P(140, 2), hgB = [r3(hgA[0] + 1.4), hgA[1]], hgD = [r3(-1.6 * hgB[0]), r3(-1.6 * hgB[1])], hgE = [r3(-1.6 * hgA[0]), r3(-1.6 * hgA[1])];
  const ptB = [0, 0], ptC = [5, 0], ptA = [1.5, 3.6], ptD = lerp(ptA, ptB, 5 / 7), ptE = lerp(ptA, ptC, 5 / 7);
  const agP = [0, 0], agQ = [4, 0], agR = [6, 0], agS = apex(agP, agQ, 37, 52);
  // 7H
  const shP = [0, 0], shT = P(40, 2.88), shS = P(40, 1.8), shR = [3.6, 0], shQ = [1.44, 0];
  const alA = [0, 0], alB = [3, 0], alD = [0, 2.25], alC = [1.08, 1.44];
  const qA = [1.5, 3.6], qB = [0, 0], qC = [5, 0], qD = lerp(qA, qB, 0.6), qE = lerp(qA, qC, 0.6);
  // An hourglass: AB and DE parallel, AE and BD crossing at C.
  const hourglass = (labels, extra) => D([S(hgA, hgE), S(hgB, hgD), S(hgA, hgB), S(hgD, hgE), pm(hgA, hgB), pm(hgD, hgE),
    N(hgA, labels[0], 'nw'), N(hgB, labels[1], 'ne'), N([0, 0], labels[2], 'e'), N(hgD, labels[3], 'sw'), N(hgE, labels[4], 'se'), ...(extra || [])], 44);

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 9 7A Angles and triangles
    // =====================================================================
    // y9-7A Q1, Q2: complementary, supplementary and revolution
    'y9-7a-pairs': `
      ${chips(['complementary: add to 90°'], ['supplementary: add to 180°'], ['a revolution: 360°'])}
      ${D([S([-2.4, 0], [2.4, 0]), S([0, 0], P(74, 2.2)), A([0, 0], 0, 74, '74°', 0.7), A([0, 0], 74, 180, 'a°', 0.6)], 34)}
      ${D([S([0, 0], P(20, 2.2)), S([0, 0], P(138, 2.2)), A([0, 0], 20, 138, '118°', 0.6), A([0, 0], 138, 380, 'b°', 0.4)], 34)}
      <p class="hp-tag">Worked examples: find the supplementary and complementary angles to 74°, then find b.</p>
      ${steps(
        `<p><strong>Supplementary angles add to 180°.</strong> Take 74 from 180. The top picture shows it: a and 74° make a straight line.</p>
         ${sum('a = 180 − 74 = 106')}
         ${ans('106')}`,
        `<p><strong>Complementary angles add to 90°.</strong> Take 74 from 90.</p>
         ${sum('90 − 74 = 16')}
         ${ans('16')}`,
        `<p><strong>All the way round a point is 360°.</strong> In the bottom picture, b is the reflex angle: the rest of the turn.</p>
         ${sum('b = 360 − 118 = 242')}
         ${ans('242')}`
      )}
      ${tip('Where two straight lines cross, opposite angles are equal and angles next to each other add to 180°. Type just the number, with no ° sign.')}`,

    // y9-7A Q3: angle sum, then naming the triangle
    'y9-7a-triangle': `
      ${D([{ poly: [tA1, tA2, tA3] }, A(tA1, 0, 33, '33°', 0.9), A(tA2, 131, 180, '49°', 0.8), ang(tA3, tA1, tA2, 'a°', 0.5)], 40)}
      <p class="hp-tag">Worked example: find <b>a</b>, then name the triangle by its angles and by its sides.</p>
      ${steps(
        `<p><strong>The angles in a triangle add to 180°.</strong></p>
         ${sum('a + 33 + 49 = 180<br>a = 180 − 33 − 49 = 98')}
         ${ans('98')}`,
        `<p><strong>Name it by its biggest angle.</strong> All under 90°: acute-angled. One exactly 90°: right-angled. One over 90°: obtuse-angled. Here 98° is over 90°.</p>
         ${ans('Obtuse-angled')}`,
        `<p><strong>Name it by its sides</strong> (look for tick marks). Three equal: equilateral, every angle 60°. Two equal: isosceles, with two equal angles. None equal: scalene. Here all three angles are different, so no two sides match.</p>
         ${ans('Scalene')}`
      )}
      ${tip('In an isosceles triangle, the two angles at the ends of the third side are equal. With two angles of 37°: 180 − 37 − 37 = 106 at the top.')}`,

    // y9-7A Q4, Q6: triangles with exterior angles, isosceles and equilateral marks
    'y9-7a-mixed': `
      ${D([{ poly: [[0, 0], [3, 0], isoTop] }, S([0, 0], [-1.8, 0]), tk([0, 0], isoTop), tk([3, 0], isoTop), A([0, 0], 74, 180, '106°', 0.6), ang(isoTop, [0, 0], [3, 0], 'a°', 1.0)], 30)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>Find the inside angle next to 106°.</strong> They sit on a straight line.</p>
         ${sum('180 − 106 = 74')}`,
        `<p><strong>The tick marks make it isosceles,</strong> so the two base angles are equal: the other one is 74° too.</p>`,
        `<p><strong>Use the angle sum.</strong></p>
         ${sum('a = 180 − 74 − 74 = 32')}
         ${ans('32')}`
      )}
      ${tip('Write each angle on the diagram as you find it. Look for straight lines (180°), tick marks (isosceles), three ticks (equilateral, 60° each) and square corners (90°).')}`,

    // y9-7A Q5: how far the minute hand turns
    'y9-7a-minute': `
      ${clock([S([0, 0], P(210, 1.7), { arrow: 'end' }), A([0, 0], 210, 90, '240°', 0.6)])}
      <p class="hp-tag">Worked example: how many degrees does the minute hand turn through in (i) 40 minutes, (ii) 1 hour 10 minutes?</p>
      ${steps(
        `<p><strong>The minute hand goes once round, 360°, every 60 minutes.</strong></p>
         ${sum('360 ÷ 60 = 6° each minute')}`,
        `<p><strong>(i) Multiply by the minutes.</strong></p>
         ${sum('40 × 6 = 240')}
         ${ans('240')}`,
        `<p><strong>(ii) Change to minutes first:</strong> 1 hour 10 minutes is 70 minutes. More than one full turn is fine.</p>
         ${sum('70 × 6 = 420')}
         ${ans('420')}`
      )}
      ${tip('A fraction of an hour turns the same fraction of 360°: 1/6 of an hour is 1/6 × 360 = 60°. Type just the number.')}`,

    // y9-7A Q7: angle between the hands of a clock
    'y9-7a-clock': `
      ${clock([S([0, 0], P(112, 1.1), { arrow: 'end' }), S([0, 0], P(354, 1.7), { arrow: 'end' }), A([0, 0], 354, 112, '118°', 0.55)])}
      <p class="hp-tag">Worked example: find the angle between the hands at <b>11:16</b>.</p>
      ${steps(
        `<p><strong>Minute hand:</strong> 6° each minute, measured clockwise from the 12.</p>
         ${sum('16 × 6 = 96°')}`,
        `<p><strong>Hour hand:</strong> 30° for each hour, plus 0.5° for every minute past the hour.</p>
         ${sum('11 × 30 + 16 × 0.5 = 330 + 8 = 338°')}`,
        `<p><strong>Find the gap.</strong> If it is more than 180°, go the other way round.</p>
         ${sum('338 − 96 = 242<br>360 − 242 = 118')}
         ${ans('118')}`
      )}
      ${tip('Do not forget the hour hand creeps forward as the minutes pass. An odd number of minutes can give a .5 answer, typed like 97.5.')}`,

    // y9-7A Q8, Q9: tangents and radii
    'y9-7a-circle': `
      ${D([{ circle: [0, 0, 3] }, S([3, 3.6], [3, -3.6]), S([0, 0], [3, 0]), S([0, 0], tanA), RT([3, 0], 180, 270), A(tanA, 90, dir(tanA, [0, 0]), '48°', 0.8),
        A([0, 0], 0, dir([0, 0], tanA), 'x°', 0.5), N([0, 0], ''), T(P(339, 0.8), 'O'), N([3, 0], 'B', 'ne'), N(tanA, 'A', 'e')], 36)}
      <p class="hp-tag">Worked example: AB is a tangent and O is the centre. ∠OAB = 48°. Find the reflex angle <b>x</b>.</p>
      ${steps(
        `<p><strong>A tangent meets the radius at 90°,</strong> so ∠OBA = 90°.</p>`,
        `<p><strong>Use the angle sum of △OAB.</strong></p>
         ${sum('∠AOB = 180 − 90 − 48 = 42')}`,
        `<p><strong>x is the rest of the full turn at O.</strong></p>
         ${sum('x = 360 − 42 = 318')}
         ${ans('318')}`
      )}
      <p><strong>Two radii make an isosceles triangle.</strong> If the angle between them at O is 114°, each of the other two angles is (180 − 114) ÷ 2 = 33°.</p>
      ${tip('Radii of the same circle are always equal, so look for an isosceles triangle wherever two radii meet at O.')}`,

    // y9-7A Q10: the exterior angle of a triangle
    'y9-7a-exterior': `
      ${D([{ poly: [exA, exB, exC] }, S(exB, [7, 0], { dash: true }), A(exA, 0, 59, '59°', 0.9), ang(exC, exA, exB, '84°', 0.5), A(exB, 0, 143, 'x°', 0.5)], 36)}
      <p class="hp-tag">Worked example: find the exterior angle <b>x</b>.</p>
      ${steps(
        `<p><strong>Find the third inside angle</strong> with the angle sum.</p>
         ${sum('180 − 59 − 84 = 37')}`,
        `<p><strong>x and that angle sit on a straight line.</strong></p>
         ${sum('x = 180 − 37 = 143')}
         ${ans('143')}`,
        `<p><strong>Notice the shortcut:</strong> 59 + 84 = 143. An exterior angle always equals the two inside angles that are not next to it, added together.</p>`
      )}
      ${tip('With pronumerals instead of numbers, the same shortcut gives an expression. Type it with letters and +, like p+q, with no degree signs.')}`,

    // y9-7A Q12: writing and solving an equation
    'y9-7a-equation': `
      ${D([S([-2.6, 0], [2.6, 0]), S([0, 0], P(77, 2.4)), A([0, 0], 0, 77, '', 0.7), A([0, 0], 77, 180, '', 0.6), T([1.55, 0.55], '(3x + 14)°', 'start'), T([-1.3, 1.05], '(5x − 2)°', 'end')], 40)}
      <p class="hp-tag">Worked example: write an equation and solve it to find <b>x</b>.</p>
      ${steps(
        `<p><strong>Spot the angle fact.</strong> The two angles sit on a straight line, so they add to 180°.</p>
         ${sum('(3x + 14) + (5x − 2) = 180')}`,
        `<p><strong>Collect like terms and solve.</strong></p>
         ${sum('8x + 12 = 180<br>8x = 168<br>x = 21')}
         ${ans('21')}`,
        `<p><strong>Check by putting x back in.</strong> 3 × 21 + 14 = 77 and 5 × 21 − 2 = 103, and 77 + 103 = 180 ✓.</p>`
      )}
      <p><strong>Isosceles triangles:</strong> the two base angles share one expression. With x° at the top and (x + 15)° at each base: x + 2(x + 15) = 180, so 3x + 30 = 180 and x = 50.</p>
      ${tip('Use 90 for a right angle, 180 for a straight line or a triangle, and 360 for a full turn. Type just the value of x.')}`,

    // =====================================================================
    // Year 9 7B Parallel lines
    // =====================================================================
    // y9-7B Q1: are the lines parallel?
    'y9-7b-test': `
      ${D([S([-0.4, 0], [3.8, 0]), S([-0.4, 2], [3.8, 2]), S(P(241, 0.9, tI1), P(61, 0.9, tI2)), A(tI1, 0, 61, '61°', 0.6), A(tI2, 241, 360, '119°', 0.5)], 36)}
      <p class="hp-tag">Worked example: are these two lines parallel? Give the reason.</p>
      ${steps(
        `<p><strong>Name the pair.</strong> Both angles are between the two lines, on the same side of the transversal (a C shape): co-interior.</p>`,
        `<p><strong>Test the rule.</strong> Co-interior angles add to 180° exactly when the lines are parallel.</p>
         ${sum('61 + 119 = 180 ✓')}
         ${ans('Yes, the co-interior angles add to 180°')}`,
        `<p><strong>For corresponding (F) or alternate (Z) angles, test whether they are equal.</strong> Alternate angles of 83° and 84° are not equal, so those lines are not parallel.</p>
         ${ans('No, the lines are not parallel')}`
      )}
      ${tip('Choose the reason that names the pair you actually used. Even 1° out means not parallel, however parallel the lines look.')}`,

    // y9-7B Q2: one step with parallel lines
    'y9-7b-find': `
      ${D([S([-0.4, 0], [3.8, 0]), S([-0.4, 2], [3.8, 2]), pm([3.2, 0], [3.5, 0]), pm([3.2, 2], [3.5, 2]), S(P(253, 0.9, fI1), P(73, 0.9, fI2)),
        A(fI1, 0, 73, '73°', 0.6), A(fI2, 180, 253, 'a°', 0.5), A(fI2, 253, 360, 'b°', 0.45)], 36)}
      <p class="hp-tag">Worked example: the arrows show parallel lines. Find <b>a</b> and <b>b</b>.</p>
      ${steps(
        `<p><strong>a and 73° are between the lines, on opposite sides</strong> of the transversal (a Z shape). Alternate angles are equal.</p>
         ${ans('a = 73')}`,
        `<p><strong>b and 73° are between the lines, on the same side</strong> (a C shape). Co-interior angles add to 180°.</p>
         ${sum('b = 180 − 73 = 107')}
         ${ans('b = 107')}`
      )}
      ${tip('Corresponding (F) and alternate (Z) angles are equal; co-interior (C) angles add to 180°. Check: a and b make a straight line, and 73 + 107 = 180.')}`,

    // y9-7B Q3, Q5, Q9: several steps with parallel lines
    'y9-7b-multi': `
      ${D([S([-3.2, 3], [3.4, 3]), S([-3.2, 0], [3.4, 0]), pm([2.6, 3], [2.9, 3]), pm([2.6, 0], [2.9, 0]), S(mT, mL), S(mT, mR),
        A(mL, 0, 47, '47°', 0.8), A(mR, 122, 180, '58°', 0.8), A(mT, 227, 302, 'a°', 0.6)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>Move the bottom angles up with alternate angles (Z shapes).</strong> The 47° angle matches the angle at the top between the left line and the top line. Same for 58° on the right.</p>`,
        `<p><strong>At the top, three angles now sit on a straight line:</strong> 47°, a and 58°.</p>
         ${sum('a = 180 − 47 − 58 = 75')}
         ${ans('75')}`
      )}
      <p><strong>Zigzags and crossings:</strong> draw an extra parallel line through each bend, then work one angle at a time. Where two lines cross, vertically opposite angles are equal.</p>
      ${tip('Write each angle on the diagram as you find it and say its reason: alternate, corresponding, co-interior, straight line or angle sum.')}`,

    // y9-7B Q4: an angle at a bend between parallel lines
    'y9-7b-bend': `
      ${bendFig(38, 49, (tA, tC) => [A(tA, 180, 218, '38°', 0.7), A(tC, 131, 180, '49°', 0.7)])}
      <p class="hp-tag">Worked example: the arrows show parallel lines. Find <b>∠ABC</b>.</p>
      ${steps(
        `<p><strong>Draw a third line through B, parallel to the other two</strong> (dashed). It splits ∠ABC into a top part and a bottom part.</p>`,
        `<p><strong>Each part makes a Z with a given angle,</strong> so they are alternate angles: the top part is 38° and the bottom part is 49°.</p>`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('∠ABC = 38 + 49 = 87')}
         ${ans('87')}`
      )}
      ${tip('If a given angle is obtuse (on the outside), its part at B is co-interior with it: for 127°, the part is 180 − 127 = 53.')}`,

    // y9-7B Q6: an expression for an angle
    'y9-7b-expr': `
      ${bendFig(40, 55, (tA, tC) => [A(tA, 180, 220, 'a°', 0.7), A(tC, 0, 125, 'b°', 0.5)])}
      <p class="hp-tag">Worked example: write an expression for <b>∠ABC</b> using a and b.</p>
      ${steps(
        `<p><strong>Draw the dashed parallel line through B</strong> to split ∠ABC in two.</p>`,
        `<p><strong>Top part:</strong> a Z with a, so it equals a (alternate). <strong>Bottom part:</strong> it makes a C with b, so the two add to 180 (co-interior). The bottom part is 180 − b.</p>`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('∠ABC = a + 180 − b')}
         ${ans('a + 180 − b')}`
      )}
      ${tip('Type only the expression, with - for minus and no degree signs: a+180-b. Test it with numbers that fit the picture: a = 40 and b = 125 give 40 + 180 − 125 = 95.')}`,

    // y9-7B Q7, Q8: giving reasons with parallel lines
    'y9-7b-proof': `
      ${D([{ poly: [prA, prC, prB] }, S(prB, prRay, { arrow: 'end' }), pm(mid(prA, prC), add(mid(prA, prC), [0.3, 0])), pm(add(prB, [1.1, 0]), add(prB, [1.4, 0])),
        A(prA, 0, 61, 'a°', 0.7), ang(prB, prA, prC, 'b°', 0.5), ang(prB, prRay, prC, 'c°', 0.8), ang(prC, prA, prB, '', 0.5),
        N(prA, 'A', 'sw'), N(prB, 'B', 'n'), N(prC, 'C', 'se')], 38)}
      <p class="hp-tag">Worked example: the ray from B is parallel to AC. If a = 61 and b = 49, find c and give the reason.</p>
      ${steps(
        `<p><strong>Find ∠ACB</strong> with the angle sum of the triangle.</p>
         ${sum('∠ACB = 180 − 61 − 49 = 70')}`,
        `<p><strong>c and ∠ACB make a Z</strong> across the line BC, between the parallel lines. So they are alternate angles and equal.</p>
         ${ans('70')}`,
        `<p><strong>Choose the matching reason.</strong></p>
         ${ans('Alternate angles in parallel lines are equal')}`
      )}
      ${tip('It works backwards too: if a pair of alternate angles are equal, the lines must be parallel. An F shape means corresponding angles; a C shape means co-interior.')}`,

    // =====================================================================
    // Year 9 7C Quadrilaterals and other polygons
    // =====================================================================
    // y9-7C Q1: angle sum of a quadrilateral
    'y9-7c-quad': `
      ${D([{ poly: quad1 }, corner(quad1, 0, '83°', 0.6), corner(quad1, 1, '96°', 0.6), corner(quad1, 2, '112°', 0.5), corner(quad1, 3, 'a°', 0.6)], 36)}
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${steps(
        `<p><strong>The four angles of a quadrilateral add to 360°.</strong> A diagonal splits it into two triangles, and 2 × 180 = 360.</p>`,
        `<p><strong>Take the known angles from 360.</strong></p>
         ${sum('a = 360 − 83 − 96 − 112 = 69')}
         ${ans('69')}`,
        `<p><strong>A shape with a dent (non-convex) works the same way.</strong> If the three known angles are 37°, 41° and 33°, the reflex angle in the dent is 360 − 37 − 41 − 33 = 249°.</p>`
      )}
      ${tip('A square corner mark is 90°, so count it as a known angle. Check by adding all four: 83 + 96 + 112 + 69 = 360.')}`,

    // y9-7C Q2: special quadrilaterals
    'y9-7c-special': `
      ${D([{ poly: [kT, kL, kB, kR] }, tk(kT, kL), tk(kT, kR), tk(kL, kB, 2), tk(kR, kB, 2),
        ang(kT, kL, kR, '92°', 0.5), ang(kB, kL, kR, '70°', 0.8), ang(kL, kT, kB, 'a°', 0.4), ang(kR, kT, kB, 'a°', 0.4)], 46)}
      <p class="hp-tag">Worked example: this is a kite. Find <b>a</b>.</p>
      ${steps(
        `<p><strong>A kite has one pair of equal angles:</strong> the two corners where a short side meets a long side. Both are a.</p>`,
        `<p><strong>The angles add to 360°.</strong></p>
         ${sum('2a + 92 + 70 = 360<br>2a = 198<br>a = 99')}
         ${ans('99')}`
      )}
      <p><strong>Shapes with parallel sides:</strong> co-interior angles between parallel sides add to 180°. In a trapezium with a 67° angle, the angle next to it across the parallel sides is 180 − 67 = 113°. A parallelogram or rhombus also has its opposite angles equal.</p>
      ${tip('Read the marks first: ticks show equal sides, arrows show parallel sides. Then use the shape\'s facts with the 360° angle sum.')}`,

    // y9-7C Q3: angle sum of a polygon, and regular polygons
    'y9-7c-polygon': `
      ${D([{ poly: p11 }, corner(p11, 0, 'a°', 0.45)], 40, 'The other ten angles add to 1460°')}
      <p class="hp-tag">Worked examples: (i) an 11-sided polygon has ten angles that add to 1460°. Find the last angle, <b>a</b>. (ii) Find each interior angle of a regular 12-sided polygon.</p>
      ${steps(
        `<p><strong>(i) Angle sum S = (n − 2) × 180°,</strong> where n is the number of sides. Here n = 11.</p>
         ${sum('S = (11 − 2) × 180 = 1620')}`,
        `<p><strong>Take the known angles from the sum.</strong></p>
         ${sum('a = 1620 − 1460 = 160')}
         ${ans('160')}`,
        `<p><strong>(ii) Regular means every angle is the same,</strong> so share the sum equally.</p>
         ${sum('S = (12 − 2) × 180 = 1800<br>1800 ÷ 12 = 150')}
         ${ans('150')}`
      )}
      ${D([{ poly: reg(12, 1.8, 90) }, S([0, 0], reg(12, 1.8, 90)[0], { thin: true }), S([0, 0], reg(12, 1.8, 90)[1], { thin: true }), A([0, 0], 90, 120, '30°', 0.6), N([0, 0], '', 's')], 32)}
      <p><strong>Other angles in that regular 12-sided polygon:</strong> each exterior angle is 180 − 150 = 30°, the reflex angle outside a corner is 360 − 150 = 210°, and the angle at the centre is 360 ÷ 12 = 30°.</p>
      ${tip('Count the sides carefully first. A reflex angle inside the polygon counts just like any other angle.')}`,

    // y9-7C Q4: properties of special quadrilaterals
    'y9-7c-props': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Shape</span><span role="columnheader">Sides</span><span role="columnheader">Angles</span><span role="columnheader">Diagonals</span></div>
        <div class="hp-tr" role="row"><span role="cell">square</span><span role="cell">4 equal, 2 pairs parallel</span><span role="cell">all 90°</span><span role="cell">equal, bisect, at 90°</span></div>
        <div class="hp-tr" role="row"><span role="cell">rectangle</span><span role="cell">opposite equal and parallel</span><span role="cell">all 90°</span><span role="cell">equal, bisect</span></div>
        <div class="hp-tr" role="row"><span role="cell">rhombus</span><span role="cell">4 equal, 2 pairs parallel</span><span role="cell">opposite equal</span><span role="cell">bisect at 90°</span></div>
        <div class="hp-tr" role="row"><span role="cell">parallelogram</span><span role="cell">opposite equal and parallel</span><span role="cell">opposite equal</span><span role="cell">bisect</span></div>
        <div class="hp-tr" role="row"><span role="cell">kite</span><span role="cell">2 pairs of equal sides, side by side</span><span role="cell">one pair equal</span><span role="cell">cross at 90°</span></div>
        <div class="hp-tr" role="row"><span role="cell">trapezium</span><span role="cell">1 pair parallel</span><span role="cell">co-interior pairs add to 180°</span><span role="cell">no special facts</span></div>
      </div>
      <p class="hp-tag">Worked example: which special quadrilaterals have both pairs of opposite sides parallel?</p>
      ${steps(
        `<p><strong>Go down the list one shape at a time.</strong> Ask: does every one of these shapes have the property?</p>`,
        `<p><strong>Square, rectangle, rhombus and parallelogram:</strong> yes, each has two pairs of parallel sides. <strong>Kite:</strong> no. <strong>Trapezium:</strong> only one pair.</p>
         ${ans('square, rectangle, rhombus, parallelogram')}`
      )}
      ${tip('A square is also a rectangle, a rhombus and a parallelogram, so it has every property they have. Check every shape, not just the obvious one.')}`,

    // y9-7C Q5: number of sides from the angle sum
    'y9-7c-sides': `
      ${flow(['angle sum', '2880°'], ['÷ 180', '16 triangles'], ['+ 2', '18 sides'])}
      <p class="hp-tag">Worked example: a polygon has an angle sum of 2880°. How many sides does it have?</p>
      ${steps(
        `<p><strong>Undo the rule S = (n − 2) × 180.</strong> Divide by 180 to find how many triangles it splits into.</p>
         ${sum('2880 ÷ 180 = 16')}`,
        `<p><strong>There are always 2 more sides than triangles.</strong></p>
         ${sum('16 + 2 = 18')}
         ${ans('18')}`,
        `<p><strong>Check.</strong></p>
         ${sum('(18 − 2) × 180 = 2880 ✓')}`
      )}
      ${tip('The number of sides must be a whole number. If the division does not come out whole, recheck your working.')}`,

    // y9-7C Q6: mixed polygon diagrams, reflex angles
    'y9-7c-mixed': `
      ${D([{ poly: dart }, corner(dart, 0, '34°', 1.0), corner(dart, 1, 'x°', 0.4), corner(dart, 2, '41°', 0.9), corner(dart, 3, '47°', 0.7)], 40)}
      <p class="hp-tag">Worked example: find the reflex angle <b>x</b>.</p>
      ${steps(
        `<p><strong>It is still a quadrilateral,</strong> so its four angles add to 360°, reflex angle included.</p>`,
        `<p><strong>Take the known angles from 360.</strong></p>
         ${sum('x = 360 − 34 − 41 − 47 = 238')}
         ${ans('238')}`,
        `<p><strong>Asked for the angle outside the dent instead?</strong> It goes the rest of the way round the point: 360 − 238 = 122°.</p>`
      )}
      ${tip('In a mixed diagram, find the shape first (ticks for isosceles or kites, arrows for parallel sides), then use straight lines (180°) and full turns (360°). Write each angle on the diagram as you go.')}`,

    // y9-7C Q8, Q10: rules for regular polygons, and the exterior angle sum
    'y9-7c-rules': `
      <p class="hp-tag">Worked example: a regular polygon has 24 sides. Find its angle sum, each interior angle and each exterior angle.</p>
      ${steps(
        `<p><strong>Angle sum:</strong> take 2 from the number of sides, then multiply by 180.</p>
         ${sum('S = (24 − 2) × 180 = 22 × 180 = 3960')}`,
        `<p><strong>Each interior angle:</strong> share the sum between the 24 equal angles.</p>
         ${sum('I = 3960 ÷ 24 = 165')}`,
        `<p><strong>Each exterior angle:</strong> walking round the outside turns you 360° in total, shared between 24 corners.</p>
         ${sum('E = 360 ÷ 24 = 15')}
         <p>Check: 165 + 15 = 180 ✓.</p>`
      )}
      <p><strong>A rule in n:</strong> do the very same steps with n in place of 24. Use brackets for "take 2 first" and / for divide.</p>
      <p><strong>Using the exterior angles:</strong> for an 11-sided polygon, the 11 corners give 11 × 180 − S = 360, so 1980 − S = 360 and S = 1620°.</p>
      ${tip('Test any rule with a shape you know. A square (n = 4) must give an angle sum of 360, interior angles of 90 and exterior angles of 90.')}`,

    // y9-7C Q9: the most reflex angles a polygon can have
    'y9-7c-reflex': `
      ${D([{ poly: pent2 }, corner(pent2, 2, '', 0.35), corner(pent2, 4, '', 0.35)], 44, 'A pentagon with 2 reflex angles')}
      <p class="hp-tag">Worked example: what is the greatest number of reflex interior angles an 11-sided polygon can have?</p>
      ${steps(
        `<p><strong>Find the angle sum.</strong></p>
         ${sum('(11 − 2) × 180 = 1620')}`,
        `<p><strong>Each reflex angle is more than 180°,</strong> and every other angle is more than 0°. So the reflex angles alone add to less than 1620°, and the number of them is less than:</p>
         ${sum('1620 ÷ 180 = 9')}`,
        `<p><strong>So at most 8</strong> can be reflex, and an 11-sided polygon with 8 dents can be drawn.</p>
         ${ans('8')}`
      )}
      ${tip('Do the same working with n sides to write a rule. Sketch a shape to check it really can be drawn.')}`,

    // =====================================================================
    // Year 9 7D Congruent triangles
    // =====================================================================
    // y9-7D Q1: choosing SSS, SAS, AAS or RHS
    'y9-7d-tests': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Test</span><span role="columnheader">You need</span><span role="columnheader">Look for</span></div>
        <div class="hp-tr" role="row"><span role="cell">SSS</span><span role="cell">3 pairs of equal sides</span><span role="cell">3 sides marked</span></div>
        <div class="hp-tr" role="row"><span role="cell">SAS</span><span role="cell">2 sides and the angle between them</span><span role="cell">angle where the sides meet</span></div>
        <div class="hp-tr" role="row"><span role="cell">AAS</span><span role="cell">2 angles and a matching side</span><span role="cell">2 angles marked</span></div>
        <div class="hp-tr" role="row"><span role="cell">RHS</span><span role="cell">right angle, hypotenuse, 1 other side</span><span role="cell">90° mark</span></div>
      </div>
      ${D([{ poly: [[0, 0], [3, 0], [0.9, 1.8]] }, tk([0, 0], [3, 0]), tk([0, 0], [0.9, 1.8], 2), A([0, 0], 0, 63.4, '', 0.5),
        { poly: [[7, 1.8], [4, 1.8], [6.1, 0]] }, tk([7, 1.8], [4, 1.8]), tk([7, 1.8], [6.1, 0], 2), A([7, 1.8], 180, 243.4, '', 0.5)], 40)}
      <p class="hp-tag">Worked example: which test shows these two triangles are congruent?</p>
      ${steps(
        `<p><strong>List the marks.</strong> One pair of sides with one dash, one pair with two dashes, and one pair of equal angles.</p>`,
        `<p><strong>Where is the angle?</strong> In each triangle it sits exactly where the one-dash side and the two-dash side meet, so it is between them.</p>
         ${ans('SAS')}`,
        `<p><strong>If the angle had been at another corner,</strong> two sides and that angle would not prove anything. Two marked angles point to AAS; a right angle with the longest side points to RHS.</p>`
      )}
      ${tip('Count what is marked first: three sides is SSS, two angles is AAS, a 90° with the hypotenuse is RHS. Two sides and an angle is SAS only if the angle is between them.')}`,

    // y9-7D Q2: unknowns in congruent triangles
    'y9-7d-find': `
      ${D([{ poly: [cf1, cf2, cf3] }, T([2.3, -0.45], '9.2 cm'), A(cf1, 0, 47, '47°', 0.8), A(cf2, 109, 180, '71°', 0.7),
        { poly: [cg1, cg2, cg3] }, T([8.3, -0.45], 'x cm'), A(cg1, 133, 180, '47°', 0.8), A(cg2, 0, 71, '71°', 0.7), ang(cg3, cg1, cg2, 'a°', 0.5)], 40)}
      <p class="hp-tag">Worked example: the two triangles are congruent. Find <b>x</b> and <b>a</b>.</p>
      ${steps(
        `<p><strong>Match the parts using the angles.</strong> In both triangles the bottom side runs between the 47° and 71° angles. So x cm matches 9.2 cm.</p>
         ${ans('x = 9.2')}`,
        `<p><strong>a is the third angle,</strong> opposite that side. Matching angles are equal, and the angles of a triangle add to 180°.</p>
         ${sum('a = 180 − 47 − 71 = 62')}
         ${ans('a = 62')}`
      )}
      ${tip('Sides with the same tick marks are equal, so a marked side can be copied straight across. Type just the number, like 9.2, not 9.2 cm.')}`,

    // y9-7D Q3, Q4: congruence statements, and picking the congruent pair
    'y9-7d-which': `
      ${D([...named([wQ, wP, wR], ['Q', 'P', 'R'], ['7', null, '11']), A(wQ, 0, 52, '52°', 0.7),
        ...named([wZ, wY, wX], ['Z', 'Y', 'X'], ['7', null, '11']), A(wZ, 128, 180, '52°', 0.7)], 36)}
      <p class="hp-tag">Worked example: write a congruence statement for these triangles, and name the test.</p>
      ${steps(
        `<p><strong>Match the angle.</strong> In both triangles the 52° angle is between the 7 and 11 sides, so Q matches Z. That is SAS.</p>`,
        `<p><strong>Match the other corners.</strong> P is at the far end of the 7 side, and so is Y. R is at the far end of the 11 side, and so is X.</p>`,
        `<p><strong>Write the letters in matching order:</strong> first with first, second with second, third with third.</p>
         ${ans('△PQR ≡ △YZX (SAS)')}`
      )}
      <p><strong>Picking the congruent pair from several triangles:</strong> a triangle with sides 7 and 11 but its 52° angle at the end of the 11 side is not congruent to these, because the angle is in a different place.</p>
      ${tip('△QRP ≡ △ZXY says the same thing, as long as matching letters stay in the same positions. Check each option letter by letter.')}`,

    // y9-7D Q5: congruence, then Pythagoras
    'y9-7d-pythag': `
      ${D([...named([[0, 0], [3.5, 0], [0, 1.2]], ['B', 'C', 'A'], [null, null, '12']), RT([0, 0], 0, 90, 0.3),
        ...named([[11.5, 0], [8, 0], [11.5, 1.2]], ['L', 'M', 'K'], ['35']), RT([11.5, 0], 90, 180, 0.3)], 34)}
      <p class="hp-tag">Worked example: △ABC ≡ △KLM. Find the length AC.</p>
      ${steps(
        `<p><strong>Use the statement to match sides.</strong> B matches L and C matches M, so BC matches LM.</p>
         ${sum('BC = LM = 35')}`,
        `<p><strong>AC is the hypotenuse of △ABC.</strong> Square, add, square root.</p>
         ${sum('AC² = 12² + 35² = 144 + 1225 = 1369<br>AC = √1369 = 37')}
         ${ans('37')}`
      )}
      ${tip('Letters in the same positions of a congruence statement are equal parts. For a shorter side: square, take away, square root.')}`,

    // y9-7D Q7, Q8, Q9: hidden equal parts
    'y9-7d-hidden': `
      ${D([{ poly: [[0, 3], [-1.5, 1.2], [0, -1.5], [1.5, 1.2]] }, S([0, 3], [0, -1.5]), tk([0, 3], [-1.5, 1.2]), tk([0, 3], [1.5, 1.2]), tk([-1.5, 1.2], [0, -1.5], 2), tk([1.5, 1.2], [0, -1.5], 2),
        N([0, 3], 'A', 'n'), N([-1.5, 1.2], 'B', 'w'), N([0, -1.5], 'C', 's'), N([1.5, 1.2], 'D', 'e')], 40)}
      <p class="hp-tag">Worked example: in kite ABCD, AB = AD and CB = CD. Which test shows △ABC ≡ △ADC, and what does it tell you about ∠ABC and ∠ADC?</p>
      ${steps(
        `<p><strong>Write down what is marked.</strong> AB = AD (one dash) and CB = CD (two dashes). That is two pairs of sides.</p>`,
        `<p><strong>Look for a fact that is not marked.</strong> The diagonal AC is a side of both triangles: a common side. Three pairs of sides:</p>
         ${ans('SSS')}`,
        `<p><strong>Matching angles of congruent triangles are equal.</strong> ∠ABC and ∠ADC sit opposite the common side AC.</p>
         ${ans('∠ABC = ∠ADC')}`
      )}
      ${chips(['A shared side is a free pair of equal sides', 'add'], ['Crossing lines: vertically opposite angles', 'add'], ['Parallel arrows: alternate angles', 'add'])}
      ${tip('Type a shared side as its two letters, like AC (CA is fine too). Two equal angles that make a straight line are 90° each.')}`,

    // y9-7D Q6, Q10: information that is not a congruence test
    'y9-7d-not': `
      ${D([S(ssA, ssB), S(ssA, P(40, 4.6)), { poly: Array.from({ length: 15 }, (_, i) => P(95 + 5 * i, 2.5, ssB)), open: true }, S(ssB, ssC1), S(ssB, ssC2, { dash: true }), A(ssA, 0, 40, '40°', 0.9),
        T([1.75, -0.45], '7 cm'), N(ssA, 'A', 'sw'), N(ssB, 'B', 'se'), N(ssC1, 'C₁', 'nw'), N(ssC2, 'C₂', 'nw')], 48)}
      <p class="hp-tag">Worked example: is AB = 7 cm, ∠A = 40° and BC = 5 cm enough to fix one triangle?</p>
      ${steps(
        `<p><strong>Draw what you know.</strong> AB is 7 cm and a ray leaves A at 40°. C must be on that ray.</p>`,
        `<p><strong>C is also 5 cm from B,</strong> so it is on the arc of radius 5 cm around B. The arc cuts the ray twice, at C₁ and C₂.</p>`,
        `<p><strong>Two different triangles fit the same facts,</strong> so angle, side, side (with the angle not between the sides) does not prove congruence.</p>
         ${ans('No')}`
      )}
      <p><strong>Three equal angles are not enough either.</strong> Triangles with angles 50°, 60° and 70° can be small or large: one is an enlargement of the other.</p>
      ${tip('Only SSS, SAS, AAS and RHS prove congruence. To test other facts, try to draw two different triangles that both fit them.')}`,

    // =====================================================================
    // Year 9 7E Using congruence in proof
    // =====================================================================
    // y9-7E Q1: the test, and the common side or reason
    'y9-7e-common': `
      ${D([{ poly: [[0, 0], [4, 0], [5.2, 2.4], [1.2, 2.4]] }, S([0, 0], [5.2, 2.4]), pm([1.8, 0], [2.2, 0]), pm([3, 2.4], [3.4, 2.4]), tk([0, 0], [4, 0], 2), tk([1.2, 2.4], [5.2, 2.4], 2),
        ang([0, 0], [4, 0], [5.2, 2.4], '', 0.8), ang([5.2, 2.4], [1.2, 2.4], [0, 0], '', 0.8),
        N([0, 0], 'A', 'sw'), N([4, 0], 'B', 'se'), N([5.2, 2.4], 'C', 'ne'), N([1.2, 2.4], 'D', 'nw')], 42)}
      <p class="hp-tag">Worked example: AB ∥ DC and AB = DC. Prove △ABC ≡ △CDA: name the test, the common side, and the reason the marked angles are equal.</p>
      ${steps(
        `<p><strong>Common side:</strong> the diagonal AC belongs to both triangles.</p>
         ${ans('AC')}`,
        `<p><strong>Reason for the angles:</strong> ∠BAC and ∠DCA make a Z across AC, between the parallel sides.</p>
         ${ans('Alternate angles on parallel lines are equal')}`,
        `<p><strong>Choose the test.</strong> AB = CD, then the angle, then AC = CA: two sides with the angle between them.</p>
         ${ans('SAS')}`
      )}
      ${tip('Type a common side as two letters, like AC. Other hidden facts: vertically opposite angles where two lines cross, and radii of the same circle.')}`,

    // y9-7E Q2, Q3, Q4: congruent triangles, then parallel lines
    'y9-7e-parallel': `
      ${D([S(eA, eE), S(eB, eD), S(eA, eB), S(eD, eE), tk(eA, eC), tk(eC, eE), tk(eB, eC, 2), tk(eC, eD, 2), ang(eA, eB, eC, '41°', 0.7), ang(eE, eD, eC, '?', 0.7),
        N(eA, 'A', 'nw'), N(eB, 'B', 'sw'), N(eC, 'C', 'n'), N(eD, 'D', 'ne'), N(eE, 'E', 'se')], 46)}
      <p class="hp-tag">Worked example: AE and BD are straight lines crossing at C. Given ∠CAB = 41°, find ∠CED and show AB ∥ DE.</p>
      ${steps(
        `<p><strong>Prove the triangles congruent.</strong> AC = EC and BC = DC are marked, and ∠ACB = ∠ECD because they are vertically opposite. The angle is between the sides: △ABC ≡ △EDC (SAS).</p>`,
        `<p><strong>Matching angles are equal.</strong> ∠CED matches ∠CAB.</p>
         ${ans('41')}`,
        `<p><strong>∠BAE and ∠DEA make a Z</strong> across AE, and they are equal. Equal alternate angles mean the lines are parallel.</p>
         ${ans('∠BAE and ∠DEA are equal alternate angles')}`
      )}
      ${tip('To prove two lines parallel, find a pair of equal alternate (or corresponding) angles. Congruent triangles are a good way to get them.')}`,

    // y9-7E Q5, Q9: congruence in circles
    'y9-7e-circle': `
      ${D([{ circle: [0, 0, 2.55] }, S([-2.25, -1.2], [2.25, -1.2]), S([0, 0], [-2.25, -1.2], { dash: true }), S([0, 0], [2.25, -1.2], { dash: true }), S([0, 0], [0, -2.55]),
        tk([-2.25, -1.2], [0, -1.2]), tk([0, -1.2], [2.25, -1.2]), RT([0, -1.2], 0, 90, 0.3),
        N([0, 0], 'O', 'n'), N([-2.25, -1.2], 'A', 'w'), N([2.25, -1.2], 'B', 'e'), N([0, -1.2], 'M', 'se'), N([0, -2.55], 'N', 's')], 44)}
      <p class="hp-tag">Worked example: O is the centre and M is the midpoint of the chord AB. The radius is 17 cm and AB is 30 cm. Find OM and MN.</p>
      ${steps(
        `<p><strong>Prove a right angle.</strong> OA = OB (radii of the same circle), AM = BM (midpoint) and OM is common, so △OAM ≡ △OBM (SSS). Then ∠OMA = ∠OMB, and together they make 180°, so each is 90°.</p>`,
        `<p><strong>Pythagoras in △OAM.</strong> AM is half the chord: 30 ÷ 2 = 15.</p>
         ${sum('OM = √(17² − 15²) = √(289 − 225) = √64 = 8')}
         ${ans('8')}`,
        `<p><strong>ON is a radius too,</strong> so MN is what is left of it.</p>
         ${sum('MN = 17 − 8 = 9')}
         ${ans('9')}`
      )}
      ${tip('Two radii make an isosceles triangle. If ∠OAB = 66°, then ∠OBA = 66° and ∠AOB = 180 − 66 − 66 = 48°.')}`,

    // y9-7E Q6, Q7, Q13: proofs in isosceles and equilateral triangles
    'y9-7e-iso': `
      ${D([{ poly: [iB, iC, iA] }, S(iA, iD), tk(iA, iB), tk(iA, iC), A(iA, 247, 270, '', 1.0), A(iA, 270, 293, '', 1.15),
        N(iA, 'A', 'n'), N(iB, 'B', 'sw'), N(iC, 'C', 'se'), N(iD, 'D', 's')], 34)}
      <p class="hp-tag">Worked example: AB = AC and AD cuts ∠BAC into two equal angles. Prove △ABD ≡ △ACD, then use it: ∠BAC = 46° and BD = 5.3 cm.</p>
      ${steps(
        `<p><strong>Prove it.</strong> AB = AC, ∠BAD = ∠CAD, and AD is common. The angle is between the sides: SAS.</p>`,
        `<p><strong>Use matching parts.</strong> ∠ADB = ∠ADC, and together they make a straight angle, so each is 90°. Also BD = CD, so D is the midpoint of BC.</p>
         ${sum('BC = 2 × 5.3 = 10.6')}
         ${ans('10.6')}`,
        `<p><strong>The base angles are equal too</strong> (∠B matches ∠C). Share what is left after the top angle.</p>
         ${sum('∠ABC = (180 − 46) ÷ 2 = 67')}
         ${ans('67')}`
      )}
      ${tip('The same proof works from every corner of an equilateral triangle, which shows all three of its angles are equal.')}`,

    // y9-7E Q8, Q10: parallelograms and their diagonals
    'y9-7e-para': `
      ${D([{ poly: [[0, 0], [4, 0], [5.2, 2.4], [1.2, 2.4]] }, S([0, 0], [5.2, 2.4]), S([4, 0], [1.2, 2.4]), pm([1.8, 0], [2.2, 0]), pm([3, 2.4], [3.4, 2.4]), pm([0.5, 1], [0.7, 1.4], 2), pm([4.5, 1], [4.7, 1.4], 2),
        ang([0, 0], [4, 0], [2.6, 1.2], '', 0.9), ang([5.2, 2.4], [1.2, 2.4], [2.6, 1.2], '', 0.9),
        N([0, 0], 'A', 'sw'), N([4, 0], 'B', 'se'), N([5.2, 2.4], 'C', 'ne'), N([1.2, 2.4], 'D', 'nw'), N([2.6, 1.2], 'E', 's')], 44)}
      <p class="hp-tag">Worked example: ABCD is a parallelogram with diagonals crossing at E. Prove △ABE ≡ △CDE. Then, if AC = 15.8 cm and BE = 4.3 cm, find AE and BD.</p>
      ${steps(
        `<p><strong>Prove it.</strong> ∠BAE = ∠DCE and ∠ABE = ∠CDE (alternate angles, AB ∥ DC). AB = CD (opposite sides of a parallelogram). Two angles and a matching side: AAS.</p>`,
        `<p><strong>So the diagonals cut each other in half:</strong> AE = CE and BE = DE.</p>
         ${sum('AE = 15.8 ÷ 2 = 7.9')}
         ${ans('7.9')}`,
        `<p><strong>BD is twice BE.</strong></p>
         ${sum('BD = 2 × 4.3 = 8.6')}
         ${ans('8.6')}`
      )}
      ${tip('The diagonal of a parallelogram splits it into two congruent triangles, so opposite sides are equal: if AB = 9.5 cm, then CD = 9.5 cm.')}`,

    // y9-7E Q11, Q12: diagonals of rectangles and rhombuses
    'y9-7e-diag': `
      ${D([{ poly: [[-3.75, 0], [0, -2], [3.75, 0], [0, 2]] }, S([-3.75, 0], [3.75, 0]), S([0, -2], [0, 2]), tk([-3.75, 0], [0, -2]), tk([0, -2], [3.75, 0]), tk([3.75, 0], [0, 2]), tk([0, 2], [-3.75, 0]),
        RT([0, 0], 0, 90, 0.3), N([-3.75, 0], 'A', 'w'), N([0, -2], 'B', 's'), N([3.75, 0], 'C', 'e'), N([0, 2], 'D', 'n'), N([0, 0], 'E', 'nw')], 40)}
      <p class="hp-tag">Worked example: rhombus ABCD has sides of 17 cm and diagonal BD = 16 cm. Find the diagonal AC.</p>
      ${steps(
        `<p><strong>Use the proved facts:</strong> congruent triangles show that the diagonals of a rhombus cut each other in half at 90°. So BE = 16 ÷ 2 = 8 and ∠AEB = 90°.</p>`,
        `<p><strong>Pythagoras in △ABE,</strong> with hypotenuse AB = 17.</p>
         ${sum('AE = √(17² − 8²) = √(289 − 64) = √225 = 15')}`,
        `<p><strong>AC is twice AE.</strong></p>
         ${sum('AC = 2 × 15 = 30')}
         ${ans('30')}`
      )}
      <p><strong>Rectangles:</strong> △ABC ≡ △BAD (SAS, with the right angles between), so the diagonals are equal. A frame 2.1 m wide and 2 m high has diagonals of √(2.1² + 2²) = √(4.41 + 4) = √8.41 = 2.9 m.</p>
      ${tip('Name the right-angled triangle you are using, so you know which sides go into Pythagoras\' theorem. Round only at the very end.')}`,

    // =====================================================================
    // Year 9 7F Enlargement and similar figures
    // =====================================================================
    // y9-7F Q1, Q2: enlarging from a centre on a grid
    'y9-7f-centre': `
      ${G(0, 8, 0, 7, [S([1, 2], [7, 4], { dash: true }), S([1, 2], [5, 6], { dash: true }),
        N([1, 2], 'O', 'nw'), N([4, 3], 'P', 'n'), N([7, 4], 'P′', 'ne'), N([5, 6], 'Q', 'ne'), N([3, 4], 'Q′', 'nw')], 30)}
      <p class="hp-tag">Worked example: enlarge P(4, 3) by scale factor 2, using O(1, 2) as the centre of enlargement.</p>
      ${steps(
        `<p><strong>Walk from the centre O to P.</strong></p>
         ${sum('right 3, up 1')}`,
        `<p><strong>Multiply the walk by the scale factor.</strong></p>
         ${sum('right 3 × 2 = 6, up 1 × 2 = 2')}`,
        `<p><strong>Start at O again and do the new walk.</strong></p>
         ${sum('(1 + 6, 2 + 2)')}
         ${ans('(7, 4)')}`
      )}
      <p><strong>Scale factor ½:</strong> for Q(5, 6), the walk from O is right 4, up 4. Halve it to right 2, up 2, so Q′ is (3, 4). Side lengths of the image are multiplied by the scale factor too.</p>
      ${tip('Always walk from the centre of enlargement, not from the origin. Type a point in brackets with a comma: (7, 4).')}`,

    // y9-7F Q3: scale factor and missing sides of similar figures
    'y9-7f-sf': `
      ${D([...named([[0, 0], [2.25, 0], [1.514, 1.307]], null, ['4.5', '3', 'y']), ...named([[3.5, 0], [7.55, 0], [6.225, 2.352]], null, ['8.1', 'x', '7.2'])], 48)}
      <p class="hp-tag">Worked example: the triangles are similar, with matching sides in the same positions. Find the scale factor, x and y.</p>
      ${steps(
        `<p><strong>Scale factor = a right side ÷ its matching left side,</strong> using a pair you know both of. 8.1 matches 4.5.</p>
         ${sum('8.1 ÷ 4.5 = 1.8')}
         ${ans('1.8')}`,
        `<p><strong>Left to right: multiply.</strong> x matches 3.</p>
         ${sum('x = 3 × 1.8 = 5.4')}`,
        `<p><strong>Right to left: divide.</strong> 7.2 matches y.</p>
         ${sum('y = 7.2 ÷ 1.8 = 4')}
         ${ans('x = 5.4, y = 4')}`
      )}
      ${tip('If the right figure is the smaller one, the scale factor comes out less than 1, like 0.6. Angles stay the same in an enlargement.')}`,

    // y9-7F Q4: finding the scale factor and centre from a picture
    'y9-7f-findcentre': `
      ${G(0, 6, 0, 6, [{ poly: [[2, 2], [3, 2], [2, 3]], fill: true }, { poly: [[4, 3], [6, 3], [4, 5]] },
        S([0, 1], [6, 3], { dash: true }), S([0, 1], [4, 5], { dash: true }), S([0, 1], [4, 3], { dash: true }), N([0, 1], '', 'e')], 34)}
      <p class="hp-tag">Worked example: the shaded triangle is enlarged to the unshaded one. Find the scale factor and the centre of enlargement.</p>
      ${steps(
        `<p><strong>Scale factor = image side ÷ matching original side.</strong> The bottom side of the image is 2 units long, and the bottom side of the shaded triangle is 1 unit.</p>
         ${sum('2 ÷ 1 = 2')}
         ${ans('2')}`,
        `<p><strong>Join each corner of the image to the matching corner of the shaded triangle, and keep going</strong> (dashed lines). The lines all meet at one point.</p>`,
        `<p><strong>Read the point where they meet.</strong></p>
         ${ans('(0, 1)')}`
      )}
      ${tip('If the image is smaller, the scale factor is less than 1, like 0.5. Check: the image is 2 times as far from the centre as the original, point by point.')}`,

    // y9-7F Q5: shadows on a wall
    'y9-7f-shadow': `
      ${D([S([-0.3, 0], [5.6, 0]), S([2, 0], [2, 1.8]), S([5, 0], [5, 5]), S([0, 0], [5, 4.5], { dash: true }), N([0, 0], 'Light', 'sw'), N([2, 1.8], '', 'n'),
        T([2.15, 0.9], '1.8 m', 'start'), T([1, -0.45], '2 m'), dm([0, 0], [5, 0], '5 m', -1.1), T([5.2, 2.25], 'shadow', 'start'), T([5.2, 5.2], 'wall', 'start')], 40)}
      <p class="hp-tag">Worked example: a person 1.8 m tall stands 2 m from a light on the floor. How tall is their shadow on a wall 5 m from the light?</p>
      ${steps(
        `<p><strong>Spot the similar triangles.</strong> Both have the angle at the light and a right angle at the floor, so they are similar.</p>`,
        `<p><strong>Scale factor from the distances to the light.</strong></p>
         ${sum('5 ÷ 2 = 2.5')}`,
        `<p><strong>Scale up the height.</strong></p>
         ${sum('1.8 × 2.5 = 4.5')}
         ${ans('4.5')}`
      )}
      <p><strong>Going backwards:</strong> a shadow of 6.3 m gives a scale factor of 6.3 ÷ 1.8 = 3.5. The wall is 2 × 3.5 = 7 m from the light, which is 7 − 2 = 5 m from the person.</p>
      ${tip('Measure both distances from the light, the corner the triangles share. If a distance is given from the person, add on their distance from the light first.')}`,

    // y9-7F Q6, Q10: scales on photos and maps
    'y9-7f-scale': `
      <p class="hp-tag">Worked example: a truck is 16.5 m long. In a photo it is 6 cm long and 1.3 cm high. Find (i) how many metres each centimetre shows, (ii) the truck's real height, to one decimal place.</p>
      ${steps(
        `<p><strong>(i) Share the real length between the centimetres.</strong></p>
         ${sum('16.5 ÷ 6 = 2.75 m per cm')}
         ${ans('2.75')}`,
        `<p><strong>(ii) Every centimetre of the photo shows 2.75 m,</strong> so multiply the photo height.</p>
         ${sum('1.3 × 2.75 = 3.575')}`,
        `<p><strong>Round to one decimal place.</strong> The next digit is 7, so round up.</p>
         ${ans('3.6')}`
      )}
      <p><strong>Map ratios:</strong> on a 1 : 25 000 map, 4 cm shows 4 × 25 000 = 100 000 cm, which is 1000 m or 1 km. Going the other way, 3.5 km is 350 000 cm, and 350 000 ÷ 25 000 = 14 cm on the map.</p>
      ${tip('1 m = 100 cm and 1 km = 100 000 cm. Change units before you compare, and type just the number.')}`,

    // y9-7F Q7, Q8, Q9: facts about scale factors and similar shapes
    'y9-7f-facts': `
      ${chips(['scale factor more than 1: bigger', 'add'], ['between 0 and 1: smaller', 'take'], ['exactly 1: congruent'])}
      <p class="hp-tag">Worked examples: (i) what scale factor undoes an enlargement by 4? (ii) by 0.8? (iii) Are any two regular hexagons similar? Any two rhombuses?</p>
      ${steps(
        `<p><strong>To undo multiplying, divide:</strong> the reverse scale factor is 1 ÷ (the first one).</p>
         ${sum('(i) 1 ÷ 4 = 0.25<br>(ii) 1 ÷ 0.8 = 1.25')}
         ${ans('0.25, 1.25')}`,
        `<p><strong>(iii) Can the shape change its angles or proportions and keep its name?</strong> A regular hexagon always has six equal sides and 120° angles, so any one is an enlargement of any other.</p>
         ${ans('Always similar')}`,
        `<p><strong>A rhombus can be squashed:</strong> one with 90° angles and one with 50° and 130° angles are both rhombuses, but their angles differ.</p>
         ${ans('Not necessarily similar')}`
      )}
      ${tip('Type a reverse scale factor written with a letter as a fraction with /, like 1/m. One counterexample is enough to show "not necessarily".')}`,

    // y9-7F Q11: a repeated enlargement pattern
    'y9-7f-pattern': `
      ${D([{ poly: [[0, 0], [2, 0], [1, 1.732]], fill: true }, T([1, -0.5], 'Figure 1'),
        { poly: [[3, 0], [4, 0], [3.5, 0.866]], fill: true }, { poly: [[4, 0], [5, 0], [4.5, 0.866]], fill: true }, { poly: [[3.5, 0.866], [4.5, 0.866], [4, 1.732]], fill: true }, { poly: [[3, 0], [5, 0], [4, 1.732]] }, T([4, -0.5], 'Figure 2')], 60)}
      <p class="hp-tag">Worked example: Figure 1 is a shaded triangle with sides of 80 cm. Each new figure shrinks every shaded triangle by a factor of ½ and keeps 3 copies. Find the smallest side in Figure 5, and the fraction shaded in Figures 3 and 5.</p>
      ${steps(
        `<p><strong>Sides halve each time.</strong> Figure 5 is 4 halvings after Figure 1.</p>
         ${sum('80 → 40 → 20 → 10 → 5')}
         ${ans('5')}`,
        `<p><strong>Shaded fraction:</strong> each step keeps 3 of the 4 smaller triangles, so the shaded part is multiplied by 3/4 each time.</p>
         ${sum('Figure 3: (3/4)² = 9/16<br>Figure 5: (3/4)⁴ = 81/256')}
         ${ans('9/16, 81/256')}`,
        `<p><strong>Carrying on forever?</strong> Think about what happens to (3/4) × (3/4) × (3/4) × ... as you multiply more and more times.</p>`
      )}
      ${tip('Figure n has had n − 1 steps. Type a fraction with /, like 81/256, or as a decimal.')}`,

    // =====================================================================
    // Year 9 7G Similar triangles
    // =====================================================================
    // y9-7G Q1, Q13: tests for similar triangles
    'y9-7g-tests': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Test</span><span role="columnheader">You need</span><span role="columnheader">Look for</span></div>
        <div class="hp-tr" role="row"><span role="cell">AAA</span><span role="cell">angles equal (two pairs is enough)</span><span role="cell">angles only</span></div>
        <div class="hp-tr" role="row"><span role="cell">SSS</span><span role="cell">3 pairs of sides, same ratio</span><span role="cell">3 sides</span></div>
        <div class="hp-tr" role="row"><span role="cell">SAS</span><span role="cell">2 pairs of sides, same ratio, equal angle between</span><span role="cell">angle where the sides meet</span></div>
        <div class="hp-tr" role="row"><span role="cell">RHS</span><span role="cell">right angle, hypotenuses and one side, same ratio</span><span role="cell">90°</span></div>
      </div>
      ${D([...named([[0, 0], [2, 0], P(52, 3.25)], null, ['4', null, '6.5']), A([0, 0], 0, 52, '52°', 0.6),
        ...named([[3.5, 0], [9.5, 0], P(52, 9.75, [3.5, 0])], null, ['12', null, '19.5']), A([3.5, 0], 0, 52, '52°', 0.9)], 28)}
      <p class="hp-tag">Worked example: which test proves these triangles are similar?</p>
      ${steps(
        `<p><strong>What is marked?</strong> Two sides in each triangle and one angle.</p>`,
        `<p><strong>Check the ratio of matching sides,</strong> big ÷ small.</p>
         ${sum('12 ÷ 4 = 3<br>19.5 ÷ 6.5 = 3')}`,
        `<p><strong>Same ratio, and the 52° angle is between the two sides</strong> in both triangles.</p>
         ${ans('SAS')}`
      )}
      ${tip('Similar tests are like the congruence tests, but sides only need the same ratio. AAA plays the part of AAS: matching angles fix the shape, but not the size.')}`,

    // y9-7G Q2, Q10: similarity statements in matching order
    'y9-7g-statement': `
      ${D([...named([[0, 0], [3.6, 0], apex([0, 0], [3.6, 0], 72, 41)], ['D', 'E', 'F']), A([0, 0], 0, 72, '72°', 0.5), A([3.6, 0], 139, 180, '41°', 0.8),
        ...named([[5, 2.8], [10.04, 2.8], apex([5, 0], [10.04, 0], 41, 67).map((v, i) => i ? r3(2.8 - v) : v)], ['L', 'M', 'N']), A([5, 2.8], 319, 360, '41°', 0.8), A([10.04, 2.8], 180, 247, '67°', 0.6)], 36)}
      <p class="hp-tag">Worked example: complete the statement △DEF ||| △___.</p>
      ${steps(
        `<p><strong>Find any missing angles.</strong> In △LMN:</p>
         ${sum('∠N = 180 − 41 − 67 = 72')}
         <p>So both triangles have angles 72°, 41° and 67° (the third angle of △DEF, at F, is 67°).</p>`,
        `<p><strong>Match each letter by its angle.</strong></p>
         ${sum('D (72°) → N<br>E (41°) → L<br>F (67°) → M')}`,
        `<p><strong>Write the partners in the same order as DEF.</strong></p>
         ${ans('NLM')}`
      )}
      ${tip('Type just the three letters in order, like NLM. The order matters: the first letter must match D, the second E and the third F.')}`,

    // y9-7G Q3, Q4, Q5, Q6: finding a side with similar triangles
    'y9-7g-find': `
      ${hourglass(['A', 'B', 'C', 'D', 'E'], [T(add(mid(hgA, [0, 0]), [-0.25, -0.25]), '5', 'end'), T(add(mid(hgA, hgB), [0, 0.35]), '3.5'), T(add(mid(hgE, [0, 0]), [0.25, 0.2]), '8', 'start'), T(add(mid(hgD, hgE), [0, -0.45]), 'x')])}
      <p class="hp-tag">Worked example: AB ∥ DE. Find <b>x</b>.</p>
      ${steps(
        `<p><strong>Show the triangles are similar.</strong> The angles at C are vertically opposite, and ∠BAC = ∠DEC (alternate angles). AAA. So A matches E, B matches D and C matches C.</p>`,
        `<p><strong>Scale factor from a matching pair you know.</strong> CE matches CA.</p>
         ${sum('8 ÷ 5 = 1.6')}`,
        `<p><strong>x = DE, which matches AB.</strong> Small to big: multiply.</p>
         ${sum('x = 3.5 × 1.6 = 5.6')}
         ${ans('5.6')}`
      )}
      ${tip('Separate pairs and right-angled triangles work the same way: scale factor from one matching pair, multiply small to big, divide big to small. Type decimals like 5.6.')}`,

    // y9-7G Q7, Q8: when x is only part of a side
    'y9-7g-part': `
      ${D([{ poly: [ptA, ptB, ptC] }, S(ptD, ptE), pm(mid(ptD, ptE), add(mid(ptD, ptE), [0.3, 0])), pm(mid(ptB, ptC), add(mid(ptB, ptC), [0.3, 0])),
        T(add(mid(ptA, ptD), [-0.3, 0]), '5', 'end'), T(add(mid(ptD, ptB), [-0.3, 0]), '2', 'end'), T(add(mid(ptA, ptE), [0.3, 0.1]), '8', 'start'), T(add(mid(ptE, ptC), [0.3, 0.1]), 'x', 'start'),
        N(ptA, 'A', 'n'), N(ptB, 'B', 'sw'), N(ptC, 'C', 'se'), N(ptD, 'D', 'w'), N(ptE, 'E', 'e')], 46)}
      <p class="hp-tag">Worked example: DE ∥ BC, AD = 5, DB = 2 and AE = 8. Find x, the length EC.</p>
      ${steps(
        `<p><strong>Use whole sides.</strong> △ADE and △ABC share ∠A and have corresponding angles, so they are similar (AAA). The whole of AB is:</p>
         ${sum('5 + 2 = 7')}`,
        `<p><strong>Scale factor, then the whole side AC.</strong></p>
         ${sum('7 ÷ 5 = 1.4<br>AC = 8 × 1.4 = 11.2')}`,
        `<p><strong>x is the part of AC beyond E.</strong></p>
         ${sum('x = 11.2 − 8 = 3.2')}
         ${ans('3.2')}`
      )}
      ${tip('Sketch the two triangles separately, with whole side lengths on each. Only then take away to find the part.')}`,

    // y9-7G Q9: which triangle is not similar?
    'y9-7g-odd': `
      ${D([{ poly: [[0, 0], [2.4, 0], apex([0, 0], [2.4, 0], 38, 83)] }, A([0, 0], 0, 38, '38°', 0.6), A([2.4, 0], 97, 180, '83°', 0.4), T([1.2, -0.5], '1'),
        { poly: [[3.4, 0], [5.4, 0], apex([3.4, 0], [5.4, 0], 59, 83)] }, A([3.4, 0], 0, 59, '59°', 0.45), A([5.4, 0], 97, 180, '83°', 0.4), T([4.4, -0.5], '2'),
        { poly: [[6.4, 0], [9, 0], apex([6.4, 0], [9, 0], 38, 61)] }, A([6.4, 0], 0, 38, '38°', 0.6), A([9, 0], 119, 180, '61°', 0.45), T([7.7, -0.5], '3')], 40)}
      <p class="hp-tag">Worked example: two of these triangles are similar. Which one is not similar to the other two?</p>
      ${steps(
        `<p><strong>Find the third angle of each.</strong></p>
         ${sum('1: 180 − 38 − 83 = 59<br>2: 180 − 59 − 83 = 38<br>3: 180 − 38 − 61 = 81')}`,
        `<p><strong>Compare the sets of angles.</strong> Triangles 1 and 2 both have 38°, 59° and 83°. Triangle 3 has 38°, 61° and 81°.</p>
         ${ans('Triangle 3')}`
      )}
      ${tip('With sides instead of angles, divide matching sides (shortest with shortest). The odd one out has a ratio that does not match the others.')}`,

    // y9-7G Q11, Q12: work out angles first, then decide
    'y9-7g-angles': `
      ${D([S(agP, agR), S(agP, agS), S(agQ, agS), A(agP, 0, 37, '37°', 0.9), A(agQ, 0, dir(agQ, agS), '128°', 0.5), N(agP, 'P', 'sw'), N(agQ, 'Q', 's'), N(agR, 'R', 'se'), N(agS, 'S', 'n')], 40)}
      <p class="hp-tag">Worked example: P, Q and R lie on a straight line. △XYZ has angles of 37° and 91°. Are △PQS and △XYZ similar?</p>
      ${steps(
        `<p><strong>Angles on a straight line add to 180°.</strong></p>
         ${sum('∠PQS = 180 − 128 = 52')}`,
        `<p><strong>Angle sum of △PQS.</strong></p>
         ${sum('∠PSQ = 180 − 37 − 52 = 91')}`,
        `<p><strong>Compare.</strong> △PQS has 37°, 52° and 91°. △XYZ has 37° and 91°, so its third angle is 52° too.</p>
         ${ans('Yes, similar (AAA)')}`
      )}
      ${tip('Where two lines cross between parallel lines, the angles at the crossing are vertically opposite and the others are alternate, so the two triangles are similar (AAA).')}`,

    // y9-7G Q14: area and volume scale factors
    'y9-7g-scale': `
      <p class="hp-tag">Worked example: a prism has a right-angled triangle cross-section with shorter sides 3 cm and 4 cm, and length 5 cm. Every length is multiplied by 6. Compare the areas and volumes.</p>
      ${steps(
        `<p><strong>Original.</strong></p>
         ${sum('area = ½ × 3 × 4 = 6 cm²<br>volume = 6 × 5 = 30 cm³')}`,
        `<p><strong>Image:</strong> sides 18 cm and 24 cm, length 30 cm.</p>
         ${sum('area = ½ × 18 × 24 = 216 cm²<br>volume = 216 × 30 = 6480 cm³')}`,
        `<p><strong>Scale factors.</strong></p>
         ${sum('area: 216 ÷ 6 = 36 = 6²<br>volume: 6480 ÷ 30 = 216 = 6³')}
         ${ans('36, 216')}`
      )}
      ${tip('An area grows in two directions, so its scale factor is the length scale factor squared; a volume grows in three, so cubed. Type powers with ^, like k^2.')}`,

    // =====================================================================
    // Year 9 7H Proving and applying similar triangles
    // =====================================================================
    // y9-7H Q1: statement and reason
    'y9-7h-reason': `
      ${hourglass(['A', 'B', 'C', 'D', 'E'], [ang(hgA, hgB, [0, 0], '', 0.5), ang(hgE, hgD, [0, 0], '', 0.5)])}
      <p class="hp-tag">Worked example: AB ∥ DE. Complete △ABC ||| △___ and give the reason.</p>
      ${steps(
        `<p><strong>At C,</strong> ∠ACB and ∠ECD are vertically opposite, so they are equal.</p>`,
        `<p><strong>Across the parallel lines,</strong> ∠BAC = ∠DEC and ∠ABC = ∠EDC (alternate angles, Z shapes). So A matches E and B matches D.</p>
         ${ans('EDC')}`,
        `<p><strong>Give the reason.</strong></p>
         ${ans('AAA: alternate angles are equal, and vertically opposite angles are equal')}`
      )}
      <p><strong>A small triangle inside a larger one</strong> (a line parallel to one side): the triangles share a common angle, and the parallel line gives corresponding angles.</p>
      ${tip('Type just the three letters, in the order that matches ABC: EDC.')}`,

    // y9-7H Q2: SAS similarity with a shared angle
    'y9-7h-sas': `
      ${D([{ poly: [[0, 0], [5, 0], [2.867, 2.008]] }, S([0.875, 0], [1.024, 0.717]), T([0.44, -0.4], '3.5'), T([0.42, 0.62], '5', 'end'),
        dm([0, 0], [5, 0], '20', -1.0), dm([0, 0], [2.867, 2.008], '14', 0.6),
        N([0, 0], 'P', 'w'), N([5, 0], 'T', 'e'), N([2.867, 2.008], 'S', 'n'), N([0.875, 0], 'Q', 's'), N([1.024, 0.717], 'R', 'n')], 70)}
      <p class="hp-tag">Worked example: PQ = 3.5, PR = 5, PS = 14 and PT = 20. Complete △PQR ||| △___, find the scale factor and name the test.</p>
      ${steps(
        `<p><strong>The triangles share ∠P.</strong> Now pair the sides next to it, short with short and long with long. PQ = 3.5 pairs with PS = 14, and PR = 5 pairs with PT = 20.</p>
         ${sum('14 ÷ 3.5 = 4<br>20 ÷ 5 = 4')}`,
        `<p><strong>The ratios match,</strong> and the angle is between the sides: SAS, scale factor 4.</p>
         ${ans('4, SAS')}`,
        `<p><strong>Match the letters.</strong> P → P, Q → S (the short sides) and R → T (the long sides). Notice Q lies on PT but matches S: the small triangle is flipped.</p>
         ${ans('PST')}`
      )}
      ${tip('Do not match by position on the picture. Match by length: shortest side next to the shared angle with shortest, longest with longest.')}`,

    // y9-7H Q3, Q4, Q5: shadows and heights
    'y9-7h-shadow': `
      ${D([S([-0.3, 0], [2, 0]), S([0, 0], [0, 3.4]), S([1.28, 0], [1.28, 0.68]), S([0, 3.4], [1.6, 0], { dash: true }), RT([0, 0], 0, 90, 0.3),
        T([1.18, 0.4], '1.7 m', 'end'), T([0.64, -0.45], '3.2 m'), T([1.44, -0.45], '0.8 m'), T([-0.15, 1.7], '? m', 'end'), T([0, 3.75], 'lamp')], 80)}
      <p class="hp-tag">Worked example: a person 1.7 m tall stands 3.2 m from a lamp post. Their shadow is 0.8 m long, and its tip lines up with their head and the top of the lamp. How tall is the lamp post?</p>
      ${steps(
        `<p><strong>Similar triangles:</strong> both have a right angle at the ground and share the angle at the tip of the shadow (AAA). The big triangle's base is the whole distance to the tip.</p>
         ${sum('3.2 + 0.8 = 4')}`,
        `<p><strong>Scale factor, big base ÷ small base.</strong></p>
         ${sum('4 ÷ 0.8 = 5')}`,
        `<p><strong>Scale up the height.</strong></p>
         ${sum('1.7 × 5 = 8.5')}
         ${ans('8.5')}`
      )}
      ${tip('In sunshine, a stick and a tree both stand at 90° to the ground and the sun hits them at the same angle, so their triangles are similar too (AAA).')}`,

    // y9-7H Q6, Q7: measuring a distance you cannot cross
    'y9-7h-river': `
      ${D([S([-0.4, 0], [4.6, 0]), S([-0.4, 2], [4.6, 2]), S([0, 2], [4.2, -0.8], { dash: true }), S([0, 0], [0, 2], { dash: true }), S([4.2, 0], [4.2, -0.8], { dash: true }),
        RT([0, 0], 0, 90, 0.25), RT([4.2, 0], 180, 270, 0.25), N([0, 2], 'tree', 'n'), N([0, 0], ''), N([3, 0], ''), N([4.2, 0], ''), N([4.2, -0.8], ''),
        dm([0, 0], [3, 0], '30 m', -0.3), T([3.6, 0.2], '12 m'), T([4.35, -0.4], '8 m', 'start'), T([-0.3, 1], 'w', 'end')], 60)}
      <p class="hp-tag">Worked example: pegs are set out on one bank, lined up with a tree on the far bank, as shown. Find the width of the river, w.</p>
      ${steps(
        `<p><strong>Similar triangles:</strong> each has a right angle, and the angles where the dashed line crosses the bank are vertically opposite (AAA). The 30 m side matches the 12 m side, and w matches 8 m.</p>`,
        `<p><strong>Scale factor, big ÷ small.</strong></p>
         ${sum('30 ÷ 12 = 2.5')}`,
        `<p><strong>Scale up.</strong></p>
         ${sum('w = 8 × 2.5 = 20')}
         ${ans('20')}`
      )}
      ${tip('Match sides by their place next to the right angle: the side along the bank pairs with the other side along the bank. Type just the number of metres.')}`,

    // y9-7H Q8, Q9: overlapping triangles that share an angle
    'y9-7h-shared': `
      ${D([S(shP, shR), S(shP, shT), S(shR, shT), S(shQ, shS), ang(shQ, shP, shS, '', 0.4), ang(shT, shP, shR, '', 0.6),
        T([0.72, -0.4], '4'), T([2.52, -0.4], '6'), T(add(mid(shP, shS), [-0.2, 0.2]), '5', 'end'),
        N(shP, 'P', 'w'), N(shQ, 'Q', 's'), N(shR, 'R', 'se'), N(shS, 'S', 'nw'), N(shT, 'T', 'n')], 60)}
      <p class="hp-tag">Worked example: the marked angles are equal, so △PQS ||| △PTR. PQ = 4, QR = 6 and PS = 5. Find ST.</p>
      ${steps(
        `<p><strong>Match the letters:</strong> P → P, Q → T and S → R, from the statement. So PS matches PR, and PQ matches PT. Use whole sides: PR = 4 + 6 = 10.</p>`,
        `<p><strong>Scale factor, small to big.</strong></p>
         ${sum('PR ÷ PS = 10 ÷ 5 = 2<br>PT = 4 × 2 = 8')}`,
        `<p><strong>ST is the part of PT beyond S.</strong></p>
         ${sum('ST = 8 − 5 = 3')}
         ${ans('3')}`
      )}
      ${tip('If the scale factor is not a whole number, keep it as a fraction. With PS = 7 instead, the scale factor is 10/7 and PT = 4 × 10/7 = 40/7. Type fractions like 40/7.')}`,

    // y9-7H Q10: a right-angled triangle split by its altitude
    'y9-7h-altitude': `
      ${D([{ poly: [alA, alB, alD] }, S(alA, alC), RT(alA, 0, 90, 0.3), rt(alC, alA, alB, 0.25), T([-0.15, 1.12], '15', 'end'), T([0.62, 1.95], '9', 'start'),
        N(alA, 'A', 'sw'), N(alB, 'B', 'se'), N(alC, 'C', 'ne'), N(alD, 'D', 'nw')], 70)}
      <p class="hp-tag">Worked example: △ABD has a right angle at A, and AC ⟂ BD. AD = 15 and DC = 9. Find AC, BD and AB.</p>
      ${steps(
        `<p><strong>AC first, with Pythagoras in △ACD</strong> (right angle at C).</p>
         ${sum('AC = √(15² − 9²) = √(225 − 81) = √144 = 12')}`,
        `<p><strong>△ABD ||| △CAD:</strong> each has a right angle and they share ∠D (AAA). Match: BD (hypotenuse) ↔ AD (hypotenuse), and AD ↔ CD (the sides next to ∠D).</p>
         ${sum('BD ÷ 15 = 15 ÷ 9<br>BD = 15 × 15 ÷ 9 = 25')}`,
        `<p><strong>AB with Pythagoras in △ABD.</strong></p>
         ${sum('AB = √(25² − 15²) = √400 = 20')}
         ${ans('AC = 12, BD = 25, AB = 20')}`
      )}
      ${tip('The altitude makes three similar triangles: the big one and the two pieces. Each piece shares one angle with the big triangle. Type decimals like 6.25.')}`,

    // y9-7H Q11: one length as a multiple of another
    'y9-7h-k': `
      ${D([{ poly: [qA, qB, qC] }, S(qD, qE), pm(mid(qD, qE), add(mid(qD, qE), [0.3, 0])), pm(mid(qB, qC), add(mid(qB, qC), [0.3, 0])),
        T(add(mid(qA, qD), [-0.3, 0]), '6', 'end'), T(add(mid(qD, qB), [-0.3, 0]), '4', 'end'),
        N(qA, 'A', 'n'), N(qB, 'B', 'sw'), N(qC, 'C', 'se'), N(qD, 'D', 'w'), N(qE, 'E', 'e')], 46)}
      <p class="hp-tag">Worked example: DE ∥ BC, AD = 6 and DB = 4. Find k when (i) AB = k × AD, (ii) DE = k × BC.</p>
      ${steps(
        `<p><strong>Whole side first.</strong></p>
         ${sum('AB = 6 + 4 = 10')}`,
        `<p><strong>(i) k = AB ÷ AD.</strong></p>
         ${sum('k = 10 ÷ 6 = 5/3')}
         ${ans('5/3')}`,
        `<p><strong>(ii) DE and BC are matching sides</strong> of similar triangles ADE and ABC, so they are in the same ratio as AD and AB.</p>
         ${sum('k = DE ÷ BC = 6 ÷ 10 = 0.6')}
         ${ans('0.6')}`
      )}
      ${tip('k = (the first length) ÷ (the second length). A fraction like 5/3 is fine when the decimal does not stop.')}`
  });
})();
