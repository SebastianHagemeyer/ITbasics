/* H3 help panels for Year 10 Chapter 6. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 6A to 6K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- drawing helpers for this chapter (every measurement is the panel's own, drawn roughly to scale) ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const cs = (deg) => Math.cos(deg * Math.PI / 180), sn = (deg) => Math.sin(deg * Math.PI / 180);
  const D = (items, alt, unit) => fig(Object.assign({ kind: 'diagram', items, alt }, unit ? { unit } : {}));
  // A triangle as a diagram spec. P = { A: [x, y], B: [...], C: [...] }; right = the corner with the right angle ('' for none);
  // sides = { AB: '12' } puts each label just outside its side; angles = { A: 'θ' } draws an arc with the label inside.
  const triSpec = (P, right, sides, angles, alt, unit = 34, extra = [], names = false) => {
    const K = Object.keys(P), G = [0, 1].map(i => K.reduce((s, k) => s + P[k][i], 0) / 3);
    const dir = (a, b) => Math.atan2(P[b][1] - P[a][1], P[b][0] - P[a][0]) * 180 / Math.PI;
    const arms = (v) => {
      const [b, c] = K.filter(k => k !== v); let a1 = dir(v, b), a2 = dir(v, c);
      if (((a2 - a1) % 360 + 360) % 360 > 180) [a1, a2] = [a2, a1];
      return [r3(a1), r3(a2)];
    };
    const it = [{ poly: K.map(k => P[k].map(r3)), fill: true }];
    if (right) it.push({ angle: [...P[right].map(r3), ...arms(right)], right: true, r: r3(18 / unit) });
    for (const [v, lab] of Object.entries(angles || {})) {
      const [a1, a2] = arms(v), sweep = ((a2 - a1) % 360 + 360) % 360;
      it.push({ angle: [...P[v].map(r3), a1, a2], label: lab, r: r3((sweep < 40 ? 36 : 22) / unit) });
    }
    for (const [s, lab] of Object.entries(sides || {})) {
      const a = P[s[0]], b = P[s[1]], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      let nx = a[1] - b[1], ny = b[0] - a[0]; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
      if (nx * (m[0] - G[0]) + ny * (m[1] - G[1]) < 0) { nx = -nx; ny = -ny; }
      const off = (ny < -0.5 ? 16 : Math.abs(nx) > 0.15 ? 9 : 11) / unit;
      it.push({ label: lab, at: [r3(m[0] + nx * off), r3(m[1] + ny * off)], anchor: nx > 0.15 ? 'start' : nx < -0.15 ? 'end' : 'middle' });
    }
    if (names) for (const k of K) {
      const dx = P[k][0] - G[0], dy = P[k][1] - G[1];
      const pos = (dy > 0.4 * Math.abs(dx) ? 'n' : dy < -0.4 * Math.abs(dx) ? 's' : '') + (dx > 0.4 * Math.abs(dy) ? 'e' : dx < -0.4 * Math.abs(dy) ? 'w' : '');
      it.push({ point: P[k].map(r3), name: k, pos: pos || 'n' });
    }
    return { kind: 'diagram', unit, alt, items: it.concat(extra) };
  };
  const tri = (...a) => fig(triSpec(...a));
  // A right-angled triangle with the angle at A on the left, the right angle at C (bottom right), hypotenuse drawn h units long.
  const rtA = (deg, h) => ({ A: [0, 0], C: [h * cs(deg), 0], B: [h * cs(deg), h * sn(deg)] });
  // Any triangle on a base AB of drawn length L, with angle a at A and angle b at B (C on top).
  const triAB = (L, a, b) => { const k = L * sn(b) / sn(a + b); return { A: [0, 0], B: [L, 0], C: [k * cs(a), k * sn(a)] }; };
  // A triangle with two drawn sides p (along the base) and q from corner C, with angle g between them.
  const triSAS = (p, q, g) => ({ C: [0, 0], B: [p, 0], A: [q * cs(g), q * sn(g)] });
  // Compass arms N, E, S, W from the origin, plus any extra items.
  const compass = (len, extra, alt, unit = 34) => D([
    { seg: [0, 0, 0, len], arrow: 'end' }, { label: 'N', at: [0, len + 0.4] },
    { seg: [0, 0, len, 0], arrow: 'end' }, { label: 'E', at: [len + 0.35, -0.12] },
    { seg: [0, 0, 0, -len], arrow: 'end' }, { label: 'S', at: [0, -len - 0.4] },
    { seg: [0, 0, -len, 0], arrow: 'end' }, { label: 'W', at: [-len - 0.35, -0.12] },
    { point: [0, 0] }, ...extra], alt, unit);
  const bdir = (b, r) => [r3(r * sn(b)), r3(r * cs(b))];   // the point r along a true bearing b
  // A unit circle (drawn radius 2) with axes, the point at angle a, its drop line and any extra items.
  const unit = (a, extra, alt) => D([
    { circle: [0, 0, 2] }, { seg: [-2.6, 0, 2.6, 0], arrow: 'end' }, { seg: [0, -2.6, 0, 2.6], arrow: 'end' },
    { label: 'x', at: [2.85, -0.1] }, { label: 'y', at: [0, 2.9] },
    { seg: [0, 0, r3(2 * cs(a)), r3(2 * sn(a))] }, { seg: [r3(2 * cs(a)), r3(2 * sn(a)), r3(2 * cs(a)), 0], dash: true },
    { point: [r3(2 * cs(a)), r3(2 * sn(a))], name: 'P', pos: sn(a) >= 0 ? (cs(a) >= 0 ? 'ne' : 'nw') : (cs(a) >= 0 ? 'se' : 'sw') },
    { label: '1', at: [2.15, -0.35] }, { label: '−1', at: [-2.25, -0.35] }, ...extra], alt, 36);
  // A sine or cosine graph for 0° to 360°, 30° per grid square across and 0.2 per square up, plus extra items.
  const wave = (fn, extra, alt) => {
    const pts = []; for (let k = 0; k <= 72; k++) { const a = k * 5; pts.push([r3(a / 30), r3(5 * fn(a))]); }
    const grid = [];
    for (let i = 1; i <= 12; i++) grid.push({ seg: [i, -5, i, 5], thin: true, dash: true });
    for (let j = -5; j <= 5; j++) if (j) grid.push({ seg: [0, j, 12, j], thin: true, dash: true });
    const labs = [3, 6, 9, 12].map(i => ({ label: (i * 30) + '°', at: [i, -5.7] }))
      .concat([-1, -0.6, -0.2, 0.2, 0.6, 1].map(v => ({ label: String(v), at: [-0.3, v * 5], anchor: 'end' })));
    return D([...grid, { seg: [0, 0, 12.8, 0], arrow: 'end' }, { seg: [0, -5.5, 0, 6.2], arrow: 'end' }, { poly: pts, open: true }, ...labs, ...extra], alt, 30);
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 6A Trigonometric ratios
    // =====================================================================
    // y10-6A Q1: the unknown side is on top of the ratio
    // method: Example 1, 6A (solving for an unknown in the numerator)
    'y10-6a-top': `
      <p class="hp-tag">Worked example: find x, correct to two decimal places.</p>
      ${tri(rtA(41, 5), 'C', { AB: '13 cm', AC: 'x cm' }, { A: '41°' }, 'A right-angled triangle with a 41° angle, hypotenuse 13 cm and adjacent side x cm', 40)}
      ${steps(
        `<p><strong>Label the sides from the angle and choose a ratio.</strong> 13 is the hypotenuse (H) and x is next to 41°, the adjacent (A). A and H go together in cos θ = A/H.</p>`,
        `<p><strong>Write the ratio with the numbers in it.</strong></p>
         ${sum('cos 41° = x/13')}`,
        `<p><strong>Multiply both sides by 13, then use a calculator.</strong></p>
         ${sum('x = 13 × cos 41° = 9.8112... ≈ 9.81')}
         ${ans('9.81')}`
      )}
      <p><strong>Opposite and adjacent?</strong> Use tan θ = O/A. With 6 next to a 57° angle and x opposite it: tan 57° = x/6, so x = 6 × tan 57° = 9.24.</p>
      ${chips(['sin θ = O/H'], ['cos θ = A/H'], ['tan θ = O/A'])}
      ${tip('SOHCAHTOA. Check your calculator is in degree mode, and type exactly two decimal places, like 9.80.')}`,

    // y10-6A Q2: the unknown side is underneath the ratio
    // method: Example 2, 6A (solving for an unknown in the denominator)
    'y10-6a-bottom': `
      <p class="hp-tag">Worked example: find x, correct to two decimal places.</p>
      ${tri(rtA(29, 5.6), 'C', { BC: '7 m', AB: 'x m' }, { A: '29°' }, 'A right-angled triangle with a 29° angle, 7 m opposite it and hypotenuse x m', 40)}
      ${steps(
        `<p><strong>Choose the ratio.</strong> 7 is opposite 29° and x is the hypotenuse, so use sin θ = O/H. The adjacent side is not marked.</p>
         ${sum('sin 29° = 7/x')}`,
        `<p><strong>Multiply both sides by x</strong> to get it off the bottom.</p>
         ${sum('x × sin 29° = 7')}`,
        `<p><strong>Divide both sides by sin 29°</strong>, then use a calculator.</p>
         ${sum('x = 7/sin 29° = 14.4386... ≈ 14.44')}
         ${ans('14.44')}`
      )}
      ${tip('If x is on the bottom, you will divide. Sense check: dividing by sin or cos (less than 1) makes the answer bigger, and the hypotenuse must be the longest side.')}`,

    // y10-6A Q3: two unknown sides in one triangle
    // method: Examples 1 and 2, 6A (numerator and denominator, one ratio each)
    'y10-6a-both': `
      <p class="hp-tag">Worked example: find x and y, correct to two decimal places.</p>
      ${tri(rtA(36, 5.4), 'C', { BC: '5 cm', AB: 'x cm', AC: 'y cm' }, { A: '36°' }, 'A right-angled triangle with a 36° angle, 5 cm opposite it, hypotenuse x cm and adjacent side y cm', 40)}
      ${steps(
        `<p><strong>x is H and 5 is O:</strong> use sin, with x on the bottom.</p>
         ${sum('sin 36° = 5/x<br>x × sin 36° = 5<br>x = 5/sin 36° = 8.5065... ≈ 8.51')}`,
        `<p><strong>y is A and 5 is O:</strong> use tan, with y on the bottom.</p>
         ${sum('tan 36° = 5/y<br>y × tan 36° = 5<br>y = 5/tan 36° = 6.8819... ≈ 6.88')}
         ${ans('8.51, 6.88')}`
      )}
      ${tip('Work each unknown from the side you were given, not from your rounded first answer. Type them in the order asked, with a comma: 8.51, 6.88.')}`,

    // y10-6A Q4, Q5, Q6, Q7, Q8: right-angled triangles in stories
    // method: Examples 1 and 2, 6A (choose a ratio, then solve)
    'y10-6a-problems': `
      <p class="hp-tag">Worked example: a skateboard ramp is <b>6.5 m</b> long and slopes at <b>14°</b> to the ground. How high does it rise, and how far does it run along the ground? Give both to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [6.307, 0], [6.307, 1.572]], fill: true }, { angle: [6.307, 0, 90, 180], right: true, r: 0.25 },
        { angle: [0, 0, 0, 14], label: '14°', r: 1.6 }, { label: '6.5 m', at: [2.9, 1.1], anchor: 'end' },
        { label: 'h', at: [6.5, 0.8], anchor: 'start' }, { label: 'd', at: [3.15, -0.45] }
      ], 'A ramp 6.5 m long sloping at 14°, with height h and run d', 50)}
      ${steps(
        `<p><strong>Draw the triangle and label it.</strong> The ramp is the hypotenuse. The height is opposite 14°; the run is adjacent.</p>`,
        `<p><strong>Height: O and H, so sin.</strong></p>
         ${sum('sin 14° = h/6.5<br>h = 6.5 × sin 14° = 1.5724... ≈ 1.57 m')}`,
        `<p><strong>Run: A and H, so cos.</strong> Use the 6.5 you were given.</p>
         ${sum('cos 14° = d/6.5<br>d = 6.5 × cos 14° = 6.3069... ≈ 6.31 m')}
         ${ans('1.57, 6.31')}`
      )}
      <p><strong>Watch which angle you are given.</strong> An angle with a vertical wall sits at the top of the triangle, so the wall is the adjacent side for it. A diagonal of a rectangle is the hypotenuse of the triangle made with two of the sides. In any right-angled triangle the hypotenuse is the longest edge.</p>
      ${tip('Round only at the end, to what the question asks: nearest metre means no decimals, nearest millimetre in cm means one decimal place.')}`,

    // y10-6A Q9, Q11: two triangles, find a shared side first
    // method: "Using calculators in trigonometry" box, 6A (find h with one ratio, keep it unrounded, use it in the second)
    'y10-6a-twostep': `
      <p class="hp-tag">Worked example: find x, correct to one decimal place.</p>
      ${D([
        { poly: [[0, 0], [4, 0], [13.774, 0], [4, 4.767]], fill: true }, { seg: [4, 0, 4, 4.767], dash: true },
        { angle: [4, 0, 0, 90], right: true, r: 0.5 }, { angle: [0, 0, 0, 50], label: '50°', r: 1.1 }, { angle: [13.774, 0, 154, 180], label: '26°', r: 2.4 },
        { label: '4', at: [2, -0.6] }, { label: 'x', at: [8.9, -0.6] }, { label: 'h', at: [4.3, 2.4], anchor: 'start' }
      ], 'Two right-angled triangles sharing a height h: the left one has a 50° angle and base 4, the right one has a 26° angle and base x', 24)}
      ${steps(
        `<p><strong>Find the shared side first, from the triangle with enough information.</strong> In the left triangle h is O and 4 is A.</p>
         ${sum('tan 50° = h/4<br>h = 4 × tan 50° = 4.7670...')}`,
        `<p><strong>Keep h unrounded and use it in the other triangle.</strong> There h is O and x is A, with x on the bottom.</p>
         ${sum('tan 26° = h/x<br>x = h/tan 26° = 4.7670.../tan 26° = 9.7738... ≈ 9.8')}
         ${ans('9.8')}`
      )}
      ${tip('Store the first answer in your calculator (or use Ans) so no rounding error creeps in. A dashed line at right angles is the clue that it is a shared side.')}`,

    // y10-6A Q10: rounding too early
    // method: "Using calculators in trigonometry" box, 6A (do not round until the end)
    'y10-6a-rounding': `
      <p class="hp-tag">Worked example: find x = 25/tan 57°, correct to two decimal places, two ways.</p>
      ${steps(
        `<p><strong>Rounding tan 57° first:</strong></p>
         ${sum('tan 57° ≈ 1.54<br>x = 25 ÷ 1.54 = 16.2337... ≈ 16.23')}`,
        `<p><strong>Keeping the full value</strong>, all in one go on the calculator:</p>
         ${sum('x = 25 ÷ tan 57° = 16.2351... ≈ 16.24')}
         ${ans('16.24')}`
      )}
      <p><strong>The second one is right.</strong> tan 57° is really 1.53986..., so rounding it to 1.54 changed the number you divided by, and the last digit came out wrong.</p>
      ${tip('Only round the final answer. If a question asks what went wrong, look for a value rounded part-way through.')}`,

    // y10-6A Q12: sides as c sin θ and c cos θ, tan θ = sin θ / cos θ
    // method: Key ideas, 6A (sin θ = O/H, cos θ = A/H, tan θ = O/A)
    'y10-6a-identity': `
      <p class="hp-tag">Worked example: a right-angled triangle has hypotenuse k, angle θ, opposite side p and adjacent side q.</p>
      ${tri(rtA(32, 5), 'C', { AB: 'k', BC: 'p', AC: 'q' }, { A: 'θ' }, 'A right-angled triangle with hypotenuse k, angle θ, opposite p and adjacent q', 40)}
      ${steps(
        `<p><strong>Write each side using the hypotenuse.</strong> Multiply both sides by k.</p>
         ${sum('sin θ = p/k, so p = k sin θ<br>cos θ = q/k, so q = k cos θ')}`,
        `<p><strong>Put these into tan θ = p/q.</strong> The k cancels.</p>
         ${sum('tan θ = (k sin θ)/(k cos θ) = sin θ/cos θ')}`,
        `<p><strong>Use it with numbers.</strong> If sin θ = 0.352 and cos θ = 0.936:</p>
         ${sum('tan θ = 0.352/0.936 = 352/936 = 44/117')}
         ${ans('44/117')}`
      )}
      <p><strong>Pythagoras version:</strong> p² + q² = k² gives (sin θ)² + (cos θ)² = 1. So if sin θ = 0.352, (cos θ)² = 1 − 0.123904 = 0.876096 and cos θ = 0.936.</p>
      ${tip('Type a fraction in simplest form, like 44/117. For an acute angle, sin θ and cos θ are both positive.')}`,

    // =====================================================================
    // Year 10 6B Finding unknown angles
    // =====================================================================
    // y10-6B Q1: finding an angle from two sides
    // method: Example 3, 6B (choose the ratio, then use the inverse function)
    'y10-6b-angle': `
      <p class="hp-tag">Worked example: find θ in each triangle, correct to two decimal places.</p>
      ${fig(
        triSpec(rtA(33.75, 4.6), 'C', { BC: '5', AB: '9' }, { A: 'θ' }, 'A right-angled triangle with 5 opposite θ and hypotenuse 9', 34),
        triSpec(rtA(39.56, 4.6), 'C', { BC: '3.8', AC: '4.6' }, { A: 'θ' }, 'A right-angled triangle with 3.8 opposite θ and 4.6 adjacent to θ', 34)
      )}
      ${steps(
        `<p><strong>Name the two sides you know, from θ.</strong> First triangle: O = 5, H = 9, so sin. Second: O = 3.8, A = 4.6, so tan.</p>`,
        `<p><strong>Write the ratio, then use the inverse function</strong> (shift, then sin, cos or tan).</p>
         ${sum('sin θ = 5/9, θ = sin⁻¹(5/9) = 33.7489... ≈ 33.75°<br>tan θ = 3.8/4.6, θ = tan⁻¹(3.8/4.6) = 39.5596... ≈ 39.56°')}
         ${ans('33.75 and 39.56')}`
      )}
      ${tip('Put the whole fraction inside the brackets. Degree mode. If the answer is a whole number, type it without decimals, like 30.')}`,

    // y10-6B Q2, Q3, Q9: both acute angles
    // method: Example 3, 6B (inverse function for one angle), then the angle sum for the other
    'y10-6b-both': `
      <p class="hp-tag">Worked example: a right-angled triangle has hypotenuse <b>10</b> and side <b>6.5</b> next to θ. Find θ and the other acute angle α, correct to one decimal place.</p>
      ${tri(rtA(49.46, 5), 'C', { AB: '10', AC: '6.5' }, { A: 'θ', B: 'α' }, 'A right-angled triangle with hypotenuse 10, 6.5 adjacent to θ, and α the third angle', 40)}
      ${steps(
        `<p><strong>A and H, so cos.</strong></p>
         ${sum('cos θ = 6.5/10<br>θ = cos⁻¹(0.65) = 49.4583...° ≈ 49.5°')}`,
        `<p><strong>The other acute angle:</strong> the angles add to 180° and one is 90°, so the two acute angles add to 90°.</p>
         ${sum('α = 90° − 49.4583...° = 40.5416...° ≈ 40.5°')}
         ${ans('49.5, 40.5')}`
      )}
      <p><strong>Is it a special triangle?</strong> If the sides are a Pythagorean triple or include a surd, the method is the same: pick any two sides you know from θ.</p>
      ${tip('Give the angles in the order asked, with a comma, like 49.5, 40.5. They must add to 90.')}`,

    // y10-6B Q4, Q5, Q6: finding an angle in a story
    // method: Example 4, 6B (labelled diagram, choose the ratio, inverse function)
    'y10-6b-problems': `
      <p class="hp-tag">Worked example: a wheelchair ramp rises <b>0.9 m</b> over a horizontal distance of <b>7.5 m</b>. Find the angle it makes with the ground, correct to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [7.5, 0], [7.5, 0.9]], fill: true }, { angle: [7.5, 0, 90, 180], right: true, r: 0.25 },
        { angle: [0, 0, 0, 6.84], label: 'θ', r: 2.2 }, { label: '7.5 m', at: [3.75, -0.45] }, { label: '0.9 m', at: [7.7, 0.45], anchor: 'start' }
      ], 'A ramp rising 0.9 m over 7.5 m horizontally, angle θ at the bottom', 50)}
      ${steps(
        `<p><strong>Start with a labelled diagram.</strong> The rise is opposite θ and the horizontal distance is adjacent, so use tan.</p>`,
        `<p><strong>Use inverse tan.</strong></p>
         ${sum('tan θ = 0.9/7.5<br>θ = tan⁻¹(0.9/7.5) = 6.8427...° ≈ 6.84°')}
         ${ans('6.84')}`
      )}
      <p><strong>Which sides?</strong> A ladder or a sloping roof is the hypotenuse. For an A-frame, use one half: the sloping side is H and the height in the middle is O, so use sin. For a diagonal cut on a rectangle, the diagonal is H and an edge is A.</p>
      ${tip('Answer the angle the question asks for: "with the ground" is at the bottom of the triangle, "with the wall" is at the top.')}`,

    // y10-6B Q7, Q8: angles in other shapes
    // method: Example 3, 6B (right-angled triangle inside the shape, inverse function)
    'y10-6b-composite': `
      <p class="hp-tag">Worked example: an isosceles triangle has two equal sides of <b>8 cm</b> and a base of <b>11 cm</b>. Find a base angle θ, correct to one decimal place.</p>
      ${D([
        { poly: [[0, 0], [11, 0], [5.5, 5.809]], fill: true }, { seg: [5.5, 0, 5.5, 5.809], dash: true }, { angle: [5.5, 0, 0, 90], right: true, r: 0.5 },
        { angle: [0, 0, 0, 46.57], label: 'θ', r: 1.3 }, { tick: [0, 0, 5.5, 5.809] }, { tick: [11, 0, 5.5, 5.809] },
        { label: '8 cm', at: [2.3, 3.3], anchor: 'end' }, { label: '5.5', at: [2.75, -0.6] }, { label: '5.5', at: [8.25, -0.6] }
      ], 'An isosceles triangle with equal sides 8 cm and base 11 cm, split by its height into two right-angled triangles', 26)}
      ${steps(
        `<p><strong>Split it into two right-angled triangles</strong> with the height. The height cuts the base in half: 11 ÷ 2 = 5.5.</p>`,
        `<p><strong>In one half, 5.5 is A and 8 is H.</strong></p>
         ${sum('cos θ = 5.5/8<br>θ = cos⁻¹(5.5/8) = 46.5674...° ≈ 46.6°')}
         ${ans('46.6')}`
      )}
      <p><strong>An angle made of two pieces?</strong> If OC = 6 is shared by two right-angled triangles with CA = 5 and CB = 2, find each angle at O and subtract: tan⁻¹(5/6) − tan⁻¹(2/6) = 39.8055...° − 18.4349...° = 21.4° (to 1 d.p.).</p>
      ${tip('Use angle facts to finish: angles on a straight line add to 180°, and parallel lines give alternate angles.')}`,

    // y10-6B Q10, Q11: exact ratios from a triangle, special triangles
    // method: Key ideas, 6B, with Pythagoras (find the third side, then write each ratio from the sides)
    'y10-6b-special': `
      <p class="hp-tag">Worked example: a right-angled triangle has shorter sides <b>2</b> (opposite θ) and <b>4</b> (adjacent). Find the exact ratios.</p>
      ${tri(rtA(26.57, 5), 'C', { BC: '2', AC: '4', AB: 'c' }, { A: 'θ' }, 'A right-angled triangle with 2 opposite θ, 4 adjacent and hypotenuse c', 40)}
      ${steps(
        `<p><strong>Pythagoras for the third side</strong>, left as a surd in simplest form.</p>
         ${sum('c² = 2² + 4² = 4 + 16 = 20<br>c = √20 = √4 × √5 = 2√5')}`,
        `<p><strong>Write each ratio from the sides.</strong> Cancel and tidy the surds.</p>
         ${sum('sin θ = 2/(2√5) = 1/√5 = √5/5<br>tan θ = 2/4 = 1/2')}`,
        `<p><strong>Use an exact ratio to find a length.</strong> A triangle with the same θ and hypotenuse 15 has opposite side 15 × √5/5 = 3√5.</p>
         ${ans('3√5')}`
      )}
      <p><strong>Special triangles.</strong> Half of an equilateral triangle with side 2 has sides 1, √3 and 2, with angles 30°, 60° and 90°. A right-angled isosceles triangle with shorter sides 1 has hypotenuse √2 and two 45° angles. Read exact values for 30°, 45° and 60° from these in the same way.</p>
      ${tip('Type surds with √ or sqrt, like 3√5 or 3sqrt5, and fractions with /, like √5/5.')}`,

    // =====================================================================
    // Year 10 6C Applications in two dimensions
    // =====================================================================
    // y10-6C Q1, Q2, Q8: angle of elevation
    // method: Example 5, 6C (angle of elevation, tan, solve for x)
    'y10-6c-elevation': `
      <p class="hp-tag">Worked example: a hot-air balloon hovers at an altitude of <b>380 m</b>. The angle of elevation from a paddock to the balloon is <b>22°</b>. Find the horizontal distance from the paddock to the balloon, to the nearest centimetre.</p>
      ${D([
        { seg: [-0.5, 0, 10.4, 0] }, { poly: [[0, 0], [9.405, 0], [9.405, 3.8]], fill: true }, { angle: [9.405, 0, 90, 180], right: true, r: 0.3 },
        { angle: [0, 0, 0, 22], label: '22°', r: 1.6 }, { label: '380 m', at: [9.6, 1.9], anchor: 'start' }, { label: 'x m', at: [4.7, -0.5] }, { point: [9.405, 3.8], name: 'balloon', pos: 'n' }
      ], 'A balloon 380 m up, seen at an angle of elevation of 22°, horizontal distance x', 30)}
      ${steps(
        `<p><strong>Elevation is measured up from the horizontal.</strong> The altitude is O and the horizontal distance is A, so use tan.</p>`,
        `<p><strong>Solve for x</strong>, which is on the bottom.</p>
         ${sum('tan 22° = 380/x<br>x × tan 22° = 380<br>x = 380/tan 22° = 940.5330...')}`,
        `<p><strong>Nearest centimetre = two decimal places of a metre.</strong> Answer in words.</p>
         ${ans('940.53')}`
      )}
      <p><strong>Direct distance</strong> (along the line of sight) is the hypotenuse, so use sin. <strong>Two objects at the same angle?</strong> Find each height with height = direct distance × sin θ, then subtract.</p>
      ${tip('Change km to m before you mix units. "To the nearest centimetre" on a metre answer means two decimal places.')}`,

    // y10-6C Q3, Q4, Q5, Q10: angle of depression and differences in height
    // method: Example 6, 6C (alternate angles, height difference, tan)
    'y10-6c-depression': `
      <p class="hp-tag">Worked example: two towers stand <b>63 m</b> apart. They are <b>112 m</b> and <b>150 m</b> tall. Find the angle of depression from the top of the taller tower to the top of the shorter one, correct to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [0.8, 0], [0.8, 7.5], [0, 7.5]], fill: true }, { poly: [[4, 0], [4.8, 0], [4.8, 5.6], [4, 5.6]], fill: true },
        { seg: [0.8, 7.5, 4, 7.5], dash: true }, { seg: [0.8, 7.5, 4, 5.6] }, { seg: [4, 5.6, 4, 7.5], dash: true },
        { angle: [0.8, 7.5, 329.3, 360], label: 'θ', r: 1.3 }, { label: '150 m', at: [-0.2, 3.7], anchor: 'end' }, { label: '112 m', at: [5, 2.8], anchor: 'start' },
        { label: '63 m', at: [2.4, 7.85] }, { label: '38 m', at: [4.2, 6.55], anchor: 'start' }
      ], 'Two towers 63 m apart, 150 m and 112 m tall, with the angle of depression θ from the top of the taller one', 30)}
      ${steps(
        `<p><strong>Find the height difference.</strong> Only this goes into the triangle.</p>
         ${sum('150 − 112 = 38 m')}`,
        `<p><strong>Draw the right-angled triangle on its own.</strong> The depression angle is below the horizontal; by alternate angles it also sits inside the triangle. 38 is O and 63 is A, so use tan.</p>
         ${sum('tan θ = 38/63<br>θ = tan⁻¹(38/63) = 31.0973...° ≈ 31.10°')}
         ${ans('31.10')}`
      )}
      <p><strong>Distance from the base of a tower?</strong> With a known depression angle and height, the distance is on the bottom: d = height/tan θ. The same idea finds the horizontal distance between two posts from the difference in their heights and an angle of elevation.</p>
      ${tip('The angle of depression from A to B equals the angle of elevation from B to A. Round as asked, like the nearest degree.')}`,

    // y10-6C Q9, Q13: two angles from one spot
    // method: Examples 5 and 6, 6C (one tan calculation per triangle, then compare)
    'y10-6c-twoangles': `
      <p class="hp-tag">Worked example: a plane flies level at <b>600 m</b>, straight towards a lighthouse. The angle of depression to the lighthouse is <b>4°</b>, and <b>90 seconds</b> later it is <b>10°</b>. Find the speed in km/h, to one decimal place.</p>
      ${steps(
        `<p><strong>One right-angled triangle for each moment.</strong> 600 m is O, the horizontal distance is A.</p>
         ${sum('first: d₁ = 600/tan 4° = 8580.399... m<br>later: d₂ = 600/tan 10° = 3402.769... m')}`,
        `<p><strong>The distance flown is the difference.</strong></p>
         ${sum('8580.399... − 3402.769... = 5177.630... m = 5.177630... km')}`,
        `<p><strong>Speed = distance ÷ time</strong>, with time in hours: 90 s = 1.5 min = 0.025 h.</p>
         ${sum('5.177630... ÷ 0.025 = 207.105... ≈ 207.1 km/h')}
         ${ans('207.1')}`
      )}
      <p><strong>Two angles of elevation from two depths?</strong> Each depth gives its own triangle with the same horizontal distance: θ = tan⁻¹(depth/horizontal). Find both angles, then subtract.</p>
      ${tip('Keep every distance unrounded until the last step, and change the units at the end.')}`,

    // y10-6C Q6, Q7, Q11, Q12, Q14: right-angled triangles inside shapes
    // method: Key ideas, 6C (draw the right-angled triangle, use a ratio, answer in words)
    'y10-6c-shapes': `
      <p class="hp-tag">Worked example: two rafters, each <b>5.6 m</b> long, meet at the top of a roof at an angle of <b>110°</b>. Find the height of the roof and its span, to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [9.175, 0], [4.587, 3.212]], fill: true }, { seg: [4.587, 0, 4.587, 3.212], dash: true }, { angle: [4.587, 0, 0, 90], right: true, r: 0.4 },
        { angle: [4.587, 3.212, 215, 270], label: '55°', r: 0.9 }, { label: '5.6 m', at: [1.9, 1.95], anchor: 'end' }, { label: 'h', at: [4.8, 1.5], anchor: 'start' }, { label: 'half span', at: [2.3, -0.5] }
      ], 'A roof with rafters of 5.6 m meeting at 110°, split by the height into two right-angled triangles with 55° at the top', 40)}
      ${steps(
        `<p><strong>Find a right-angled triangle.</strong> The height splits the roof in half, so the top angle in each half is 110° ÷ 2 = 55°.</p>`,
        `<p><strong>Use the rafter as the hypotenuse.</strong> The height is next to 55°, the half span is opposite it.</p>
         ${sum('h = 5.6 × cos 55° = 3.2120... ≈ 3.21 m<br>half span = 5.6 × sin 55° = 4.5872... m')}`,
        `<p><strong>Answer the question.</strong> The span is two halves.</p>
         ${sum('span = 2 × 4.5872... = 9.1745... ≈ 9.17 m')}
         ${ans('3.21, 9.17')}`
      )}
      <p><strong>Regular polygons:</strong> use the interior angle you are given, then cut off a right-angled triangle with a dashed line. <strong>Heights in pieces:</strong> add or take away the known heights first so only one unknown side is in the triangle.</p>
      ${tip('Draw the right-angled triangle on its own with its numbers before you choose sin, cos or tan.')}`,

    // =====================================================================
    // Year 10 6D Directions and bearings
    // =====================================================================
    // y10-6D Q1, Q2: reading true bearings, and the bearing back
    // method: Example 7, 6D (add or subtract from 090°, 180°, 270°, 360°; opposite directions differ by 180°)
    'y10-6d-read': `
      <p class="hp-tag">Worked example: give the true bearing of P and of Q from O, then of O from each.</p>
      ${compass(2.4, [
        { seg: [0, 0, ...bdir(115, 2)] }, { point: bdir(115, 2), name: 'P', pos: 'se' }, { angle: [0, 0, 335, 360], label: '25°', r: 0.9 },
        { seg: [0, 0, ...bdir(320, 2)] }, { point: bdir(320, 2), name: 'Q', pos: 'nw' }, { angle: [0, 0, 90, 130], label: '40°', r: 0.9 },
        { label: 'O', at: [-0.3, -0.35], anchor: 'end' }
      ], 'A compass at O; P is 25° south of east and Q is 40° west of north')}
      ${steps(
        `<p><strong>True bearings are measured clockwise from north.</strong> Start from the nearest compass direction.</p>
         ${sum('P: east is 090°, then 25° more: 90° + 25° = 115°T<br>Q: 40° short of a full turn: 360° − 40° = 320°T')}`,
        `<p><strong>The bearing back is the opposite direction:</strong> it differs by 180°.</p>
         ${sum('O from P: 115° + 180° = 295°T<br>O from Q: 320° − 180° = 140°T')}
         ${ans('115, 320, 295, 140')}`
      )}
      ${chips(['N = 000°'], ['E = 090°'], ['S = 180°'], ['W = 270°'])}
      ${tip('Type a bearing as a number of degrees, like 075 or 75. Under 180°: add 180° to go back. 180° or more: subtract 180°.')}`,

    // y10-6D Q3, Q5, Q6, Q8, Q9, Q10, Q14, Q15, Q16: how far north, south, east or west
    // method: Example 8, 6D (compass at each turn, right-angled triangle, sin and cos from the given length)
    'y10-6d-trig': `
      <p class="hp-tag">Worked example: a ship sails due south for <b>6 km</b>, then on a true bearing of <b>140°</b> for <b>9 km</b>. How far east and how far south of its start is it, to two decimal places?</p>
      ${D([
        { seg: [0, 0, 0, 1.3], arrow: 'end' }, { label: 'N', at: [0, 1.7] }, { point: [0, 0], name: 'start', pos: 'w' },
        { seg: [0, 0, 0, -6] }, { seg: [0, -6, 7, -6], dash: true }, { label: 'E', at: [7.4, -6.1] },
        { poly: [[0, -6], [5.785, -6], [5.785, -12.894]], fill: true }, { angle: [5.785, -6, 180, 270], right: true, r: 0.4 },
        { angle: [0, -6, 310, 360], label: '50°', r: 1.3 }, { point: [5.785, -12.894], name: 'end', pos: 'se' },
        { label: '6 km', at: [-0.3, -3], anchor: 'end' }, { label: '9 km', at: [2.5, -9.8], anchor: 'end' },
        { label: 'x', at: [2.9, -5.5] }, { label: 'y', at: [6.0, -9.4], anchor: 'start' }
      ], 'South 6 km to a turn, then 9 km on a bearing of 140°, which is 50° below east', 20)}
      ${steps(
        `<p><strong>Draw a compass at the turn.</strong> 140° is 50° past east (140° − 90° = 50°), so the 9 km leg makes 50° with the east line. The 9 km is the hypotenuse.</p>`,
        `<p><strong>East: x is next to 50°, so cos.</strong></p>
         ${sum('cos 50° = x/9<br>x = 9 × cos 50° = 5.7850... ≈ 5.79 km')}`,
        `<p><strong>South: y is opposite 50°, so sin.</strong> Use the 9 you were given, then add the first 6 km south.</p>
         ${sum('y = 9 × sin 50° = 6.8943...<br>south = 6 + 6.8943... = 12.8943... ≈ 12.89 km')}
         ${ans('5.79, 12.89')}`
      )}
      <p><strong>Other set-ups:</strong> use the angle between the leg and the nearest north-south or east-west line. Two points seen on bearings from a straight road: find each one's east (or south) distance separately, then subtract.</p>
      ${tip('Answer in the unit asked: km × 1000 = m. Add or subtract the legs that point the same way.')}`,

    // y10-6D Q4, Q7, Q11: finding a bearing from distances
    // method: Example 8, 6D for the triangle, with the inverse tan of 6B; turn the angle into a bearing as in Example 7
    'y10-6d-findbearing': `
      <p class="hp-tag">Worked example: a drone flies <b>13 km</b> south and ends up <b>4 km</b> east of its base. Find the bearing of the drone from the base and of the base from the drone, to the nearest degree.</p>
      ${D([
        { seg: [0, 0, 0, 1.6], arrow: 'end' }, { label: 'N', at: [0, 2] }, { point: [0, 0], name: 'base', pos: 'w' },
        { poly: [[0, 0], [0, -13], [4, -13]], fill: true }, { angle: [0, -13, 0, 90], right: true, r: 0.6 },
        { angle: [0, 0, 270, 287.1], label: 'θ', r: 2.4 }, { point: [4, -13], name: 'drone', pos: 'e' },
        { label: '13 km', at: [-0.3, -6.5], anchor: 'end' }, { label: '4 km', at: [2, -13.7] }
      ], 'The base, a point 13 km south, and the drone 4 km east of that point', 16)}
      ${steps(
        `<p><strong>Find the angle at the base</strong>, measured from south. 4 is O and 13 is A.</p>
         ${sum('tan θ = 4/13<br>θ = tan⁻¹(4/13) = 17.1027...°')}`,
        `<p><strong>Turn it into a bearing.</strong> The drone is 17.1° east of south, so it is 17.1° short of 180°.</p>
         ${sum('180° − 17.1027...° = 162.897...° ≈ 163°T')}`,
        `<p><strong>The bearing back differs by 180°.</strong></p>
         ${sum('163° + 180° = 343°T')}
         ${ans('163, 343')}`
      )}
      <p><strong>On a grid with north up:</strong> from O to (−2, −5) go 2 left and 5 down. The angle from south is tan⁻¹(2/5) = 21.80...°, and the point is west of south, so the bearing is 180° + 21.80...° = 201.8°T.</p>
      ${tip('Sketch the compass first so you know which quadrant the bearing is in, then add to or subtract from 000°, 090°, 180°, 270° or 360°.')}`,

    // y10-6D Q12, Q13: two legs, then the overall bearing and distance
    // method: Example 8, 6D for each leg, then inverse tan (6B) and Pythagoras on the totals
    'y10-6d-twoleg': `
      <p class="hp-tag">Worked example: a hiker walks <b>5 km</b> on a bearing of <b>040°</b>, then <b>3 km</b> on a bearing of <b>110°</b>. Find the bearing and distance of the finish from the start, to one decimal place.</p>
      ${steps(
        `<p><strong>Split each leg into north and east parts.</strong> Leg 1 makes 40° with north. Leg 2 is 110° − 90° = 20° below east, so it goes east and south.</p>
         ${sum('leg 1: north = 5 cos 40° = 3.8302..., east = 5 sin 40° = 3.2139...<br>leg 2: east = 3 cos 20° = 2.8190..., south = 3 sin 20° = 1.0260...')}`,
        `<p><strong>Total each direction.</strong> South takes away from north.</p>
         ${sum('north = 3.8302... − 1.0260... = 2.8041...<br>east = 3.2139... + 2.8190... = 6.0330...')}`,
        `<p><strong>Bearing from north with inverse tan, distance with Pythagoras.</strong></p>
         ${sum('θ = tan⁻¹(6.0330.../2.8041...) = 65.07...° ≈ 65.1°T<br>d = √(2.8041...² + 6.0330...²) = 6.6528... ≈ 6.7 km')}
         ${ans('65.1, 6.7')}`
      )}
      ${tip('Make a little table of north and east for each leg, with south and west as negatives. Keep full values until the last line.')}`,

    // =====================================================================
    // Year 10 6E Applications in three dimensions (10A)
    // =====================================================================
    // y10-6E Q1, Q2, Q3, Q8, Q9, Q10: two triangles sharing a vertical side
    // method: Example 9, 6E (find the height in one triangle, use it unrounded in the other)
    'y10-6e-two': `
      <p class="hp-tag">Worked example: a flagpole is held by two wires from its top. The wire to A is <b>28 m</b> long at <b>52°</b> to the ground. Point B is <b>15 m</b> from the base. Find the height to three decimal places, and the angle of the wire to B to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [-1.724, -1.2], [0, 2.206]], fill: true }, { poly: [[0, 0], [1.5, -0.3], [0, 2.206]], fill: true }, { seg: [0, 0, 0, 2.206] },
        { point: [-1.724, -1.2], name: 'A', pos: 'sw' }, { point: [1.5, -0.3], name: 'B', pos: 'se' },
        { label: '28 m', at: [-1.1, 0.7], anchor: 'end' }, { label: '15 m', at: [0.8, -0.5] }, { label: 'h', at: [0.15, 1.2], anchor: 'start' }
      ], 'A vertical pole with wires to A and B on the ground', 60)}
      ${steps(
        `<p><strong>Draw the triangle with the wire to A.</strong> h is opposite 52° and 28 is the hypotenuse, so use sin.</p>
         ${sum('sin 52° = h/28<br>h = 28 × sin 52° = 22.0643... ≈ 22.064 m')}`,
        `<p><strong>Draw the second triangle with the unrounded height.</strong> h is O and 15 is A, so use tan.</p>
         ${sum('tan θ = 22.0643.../15<br>θ = tan⁻¹(22.0643.../15) = 55.7909...° ≈ 55.79°')}
         ${ans('22.064, 55.79')}`
      )}
      <p><strong>Using a rounded height instead</strong> can change the last digit, which is why the full value is used. <strong>Several views of one height?</strong> The bigger the angle of elevation, the closer you are.</p>
      ${tip('Every 3D problem here is a set of flat right-angled triangles. Draw each one separately with its numbers.')}`,

    // y10-6E Q4, Q11: rectangular prisms and cubes
    // method: Key ideas, 6E with Example 9's two-triangle approach (base triangle first, then the triangle standing up)
    'y10-6e-prism': `
      <p class="hp-tag">Worked example: a box is <b>10 cm</b> long, <b>6 cm</b> wide and <b>3 cm</b> high. Find the angle a base diagonal makes with the long edge, the diagonal's length, and the angle the space diagonal makes with the base, all to two decimal places.</p>
      ${steps(
        `<p><strong>Triangle on the base:</strong> 10 along, 6 across, the diagonal as the hypotenuse.</p>
         ${sum('tan α = 6/10, α = tan⁻¹(0.6) = 30.9637...° ≈ 30.96°')}`,
        `<p><strong>Use that angle for the diagonal.</strong> 10 is adjacent to α.</p>
         ${sum('cos α = 10/d, d = 10/cos 30.9637...° = 11.6619... ≈ 11.66 cm')}`,
        `<p><strong>Triangle standing up</strong> on the diagonal: 3 cm high, d along the base.</p>
         ${sum('tan β = 3/11.6619..., β = 14.4264...° ≈ 14.43°')}
         ${ans('30.96, 11.66, 14.43')}`
      )}
      ${tip('Name the triangle from the letters (like ABF) and find its right angle before you start. Keep earlier answers unrounded.')}`,

    // y10-6E Q5, Q6, Q7: ramps, pyramids and tents
    // method: Key ideas and Example 9, 6E (visualise each right-angled triangle, use a ratio, relate back)
    'y10-6e-solid': `
      <p class="hp-tag">Worked example: a square-based pyramid is <b>18 m</b> high and its triangular faces make <b>55°</b> with the base. Find the perimeter of the base, to one decimal place.</p>
      ${steps(
        `<p><strong>Find the right-angled triangle.</strong> It runs from the top, straight down to the centre of the base, then out to the middle of one edge. The 55° is at the edge; the 18 m height is opposite it.</p>`,
        `<p><strong>The bottom of this triangle is half a side.</strong></p>
         ${sum('tan 55° = 18/x<br>x = 18/tan 55° = 12.6037... m')}`,
        `<p><strong>Relate it back to the pyramid.</strong> A side is 2x, and there are four sides.</p>
         ${sum('perimeter = 8 × 12.6037... = 100.829... ≈ 100.8 m')}
         ${ans('100.8')}`
      )}
      <p><strong>Two ropes at right angles on the ground:</strong> a 2 m pole with ropes at 50° and 40° has pegs 2/tan 50° = 1.678 m and 2/tan 40° = 2.384 m from the base. The pegs and the base make a right-angled triangle on the ground, so the angle at the first peg is tan⁻¹(2.384/1.678) = 54.85° and the pegs are √(1.678² + 2.384²) = 2.92 m apart.</p>
      ${tip('A ramp has a sloping triangle and a flat one. Find the side they share first.')}`,

    // y10-6E Q12, Q13: points at different heights in space
    // method: Key ideas, 6E (one right-angled triangle per pair of points; vertical rise = length × sin of elevation)
    'y10-6e-space': `
      <p class="hp-tag">Worked example: PQ = <b>9</b> with angle of elevation <b>20°</b> from P to Q, QR = <b>5</b> with elevation <b>31°</b> from Q to R, and PR = <b>11</b>. Find the angle of elevation from P to R, to two decimal places.</p>
      ${steps(
        `<p><strong>Each pair of points makes a right-angled triangle</strong> with a vertical side. The length between the points is the hypotenuse.</p>
         ${sum('rise P to Q = 9 × sin 20° = 3.0781...<br>rise Q to R = 5 × sin 31° = 2.5751...')}`,
        `<p><strong>Add the rises</strong> for the height of R above P.</p>
         ${sum('3.0781... + 2.5751... = 5.6533...')}`,
        `<p><strong>Use the triangle P to R.</strong> 5.6533... is O and 11 is H.</p>
         ${sum('sin θ = 5.6533.../11, θ = 30.9268...° ≈ 30.93°')}
         ${ans('30.93')}`
      )}
      ${tip('If one point is lower, its rise is a fall: subtract instead of adding. Draw a side view with the heights marked.')}`,

    // =====================================================================
    // Year 10 6F The sine rule (10A)
    // =====================================================================
    // y10-6F Q1, Q3, Q5: finding a side with the sine rule
    // method: Example 10, 6F (a/sin A = b/sin B, multiply both sides)
    'y10-6f-side': `
      <p class="hp-tag">Worked example: find x, correct to one decimal place.</p>
      ${tri(triAB(5, 47, 58), '', { BC: '9 cm', AC: 'x cm' }, { A: '47°', B: '58°' }, 'A triangle with angles 47° and 58°; 9 cm is opposite 47° and x cm is opposite 58°', 40)}
      ${steps(
        `<p><strong>Pair each side with the angle opposite it.</strong> 9 is opposite 47°, x is opposite 58°. A side and its opposite angle, plus one more, means the sine rule.</p>
         ${sum('x/sin 58° = 9/sin 47°')}`,
        `<p><strong>Multiply both sides by sin 58°.</strong></p>
         ${sum('x = 9/sin 47° × sin 58° = 10.4360... ≈ 10.4')}
         ${ans('10.4')}`
      )}
      <p><strong>Missing the opposite angle?</strong> Find it first: the angles add to 180°. With angles 47° and 58°, the third is 180° − 47° − 58° = 75°.</p>
      ${tip('Put the unknown on top of the left-hand fraction so it only needs one multiply. Check: the biggest angle is opposite the longest side.')}`,

    // y10-6F Q2, Q4: finding an acute angle with the sine rule
    // method: Example 11a, 6F (cross multiply, make sin θ the subject, sin⁻¹)
    'y10-6f-acute': `
      <p class="hp-tag">Worked example: find the acute angle θ, correct to one decimal place.</p>
      ${tri(triAB(5, 53.96, 76), '', { BC: '10 cm', AC: '12 cm' }, { A: 'θ', B: '76°' }, 'A triangle with 12 cm opposite a 76° angle and 10 cm opposite θ', 40)}
      ${steps(
        `<p><strong>Write the sine rule</strong> with each side over the sine of its opposite angle.</p>
         ${sum('12/sin 76° = 10/sin θ')}`,
        `<p><strong>Cross multiply and make sin θ the subject.</strong></p>
         ${sum('12 × sin θ = 10 × sin 76°<br>sin θ = (10 × sin 76°)/12 = 0.8085...')}`,
        `<p><strong>Use sin⁻¹.</strong></p>
         ${sum('θ = sin⁻¹(0.8085...) = 53.9574...° ≈ 54.0°')}
         ${ans('54.0')}`
      )}
      ${tip('You can also start from sin θ/10 = sin 76°/12, which gets sin θ on its own in one step. Type 54.0 with its decimal place.')}`,

    // y10-6F Q8, Q10, Q11: the obtuse answer and the ambiguous case
    // method: Example 11b, 6F (sin⁻¹ gives the acute angle; the obtuse one is 180° minus it)
    'y10-6f-obtuse': `
      <p class="hp-tag">Worked example: find θ, correct to one decimal place, given that θ is obtuse.</p>
      ${tri(triAB(5, 35, 113.4), '', { BC: '5 m', AC: '8 m' }, { A: '35°', B: 'θ' }, 'A triangle with 5 m opposite a 35° angle and 8 m opposite the obtuse angle θ', 40)}
      ${steps(
        `<p><strong>Sine rule, then make sin θ the subject.</strong></p>
         ${sum('5/sin 35° = 8/sin θ<br>sin θ = (8 × sin 35°)/5 = 0.9177...')}`,
        `<p><strong>sin⁻¹ only gives the acute angle.</strong> Supplementary angles have the same sine, so there is a second answer.</p>
         ${sum('θ = 66.5953...° or 180° − 66.5953...° = 113.4046...°')}`,
        `<p><strong>Choose the one that fits.</strong> θ is obtuse here.</p>
         ${ans('113.4')}`
      )}
      <p><strong>Both can work.</strong> If you are not told, keep both: give them with a comma, like 66.6, 113.4. <strong>Only one works</strong> when the obtuse value plus the angle you already have makes 180° or more, because then there is no room for a third angle.</p>
      ${tip('Always check the angle sum: the three angles must add to exactly 180°.')}`,

    // y10-6F Q9: when the sine rule gives sin θ greater than 1
    // method: Key ideas, 6F (−1 ≤ sin θ ≤ 1, from 6B) with the steps of Example 11
    'y10-6f-impossible': `
      <p class="hp-tag">Worked example: a triangle has a <b>50°</b> angle opposite a side of <b>4</b>, and a side of <b>7</b> opposite θ. Find θ.</p>
      ${steps(
        `<p><strong>Use the sine rule as usual.</strong></p>
         ${sum('4/sin 50° = 7/sin θ<br>sin θ = (7 × sin 50°)/4 = 1.3405...')}`,
        `<p><strong>Stop and think.</strong> In a triangle the sine of an angle is never more than 1. The calculator gives an error for sin⁻¹(1.3405...).</p>
         ${ans('No such triangle exists')}`
      )}
      <p><strong>Why?</strong> The side of 4 is too short to reach across and close the triangle at that angle.</p>
      ${tip('If sin θ comes out greater than 1, recheck your working once. If it is still over 1, the triangle cannot be drawn.')}`,

    // y10-6F Q6, Q7: bearings turned into angles, then the sine rule
    // method: Example 10, 6F, with true bearings from 6D (find the angles in the triangle first)
    'y10-6f-bearings': `
      <p class="hp-tag">Worked example: a boat sails north from P for <b>30 km</b> to Q, then on a bearing of <b>120°</b> to R. The bearing from R back to P is <b>255°</b>. Find PR and QR, to one decimal place.</p>
      ${steps(
        `<p><strong>Turn the bearings into angles inside the triangle.</strong> Draw a north line at each point.</p>
         ${sum('at Q: 180° − 120° = 60°<br>at P: bearing of R from P = 255° − 180° = 075°, so 75°<br>at R: 180° − 60° − 75° = 45°')}`,
        `<p><strong>Sine rule for PR</strong>, which is opposite the 60° at Q. 30 is opposite the 45° at R.</p>
         ${sum('PR/sin 60° = 30/sin 45°, so PR = 30/sin 45° × sin 60° = 36.742... ≈ 36.7 km')}`,
        `<p><strong>Sine rule for QR</strong>, opposite the 75° at P.</p>
         ${sum('QR = 30/sin 45° × sin 75° = 40.980... ≈ 41.0 km')}
         ${ans('36.7, 41.0')}`
      )}
      ${tip('For "how much further", add the two legs flown and subtract the direct distance.')}`,

    // =====================================================================
    // Year 10 6G The cosine rule (10A)
    // =====================================================================
    // y10-6G Q1, Q3, Q7: the third side from two sides and the angle between
    // method: Example 12, 6G (c² = a² + b² − 2ab cos C, then square root)
    'y10-6g-side': `
      <p class="hp-tag">Worked example: find x, correct to two decimal places.</p>
      ${tri(triSAS(5.3, 3.3, 64), '', { CB: '8 cm', CA: '5 cm', AB: 'x cm' }, { C: '64°' }, 'A triangle with sides 8 cm and 5 cm and a 64° angle between them; x is the third side', 40)}
      ${steps(
        `<p><strong>Two sides and the angle between them: use the cosine rule.</strong> Let a = 5, b = 8 and C = 64°, so c = x.</p>
         ${sum('c² = a² + b² − 2ab cos C<br>x² = 5² + 8² − 2(5)(8) cos 64°')}`,
        `<p><strong>Simplify.</strong></p>
         ${sum('x² = 89 − 80 cos 64° = 53.9303...')}`,
        `<p><strong>Square root, then round.</strong></p>
         ${sum('x = √53.9303... = 7.3437... ≈ 7.34')}
         ${ans('7.34')}`
      )}
      ${tip('Do 2ab cos C as one piece and subtract it from a² + b². A common slip is (89 − 80) × cos 64°. The given angle must be between the two given sides.')}`,

    // y10-6G Q2, Q4, Q9, Q10: an angle from three sides
    // method: Example 13, 6G (substitute, rearrange for cos θ, then cos⁻¹)
    'y10-6g-angle': `
      <p class="hp-tag">Worked example: a triangle has sides <b>7</b>, <b>9</b> and <b>11</b>. Find the angle θ opposite the side of 11, to two decimal places.</p>
      ${tri(triSAS(4.2, 5.4, 85.9), '', { CB: '7', CA: '9', AB: '11' }, { C: 'θ' }, 'A triangle with sides 7, 9 and 11; θ is opposite the side of 11', 40)}
      ${steps(
        `<p><strong>θ goes with the side opposite it.</strong> So c = 11, and a = 7, b = 9.</p>
         ${sum('11² = 7² + 9² − 2(7)(9) cos θ<br>121 = 130 − 126 cos θ')}`,
        `<p><strong>Rearrange for cos θ.</strong></p>
         ${sum('126 cos θ = 130 − 121 = 9<br>cos θ = 9/126')}`,
        `<p><strong>Use cos⁻¹.</strong></p>
         ${sum('θ = cos⁻¹(9/126) = 85.9039...° ≈ 85.90°')}
         ${ans('85.90')}`
      )}
      <p><strong>Rearranged form:</strong> cos C = (a² + b² − c²)/(2ab) gives the same thing in one line. Sides 4, 6, 9: cos C = (16 + 36 − 81)/48 = −29/48, so C = 127.17°. <strong>A negative cosine means an obtuse angle</strong>, so the triangle is obtuse.</p>
      ${tip('For all three angles, use the cosine rule for one or two, then the angle sum. Type them in the order asked, with commas.')}`,

    // y10-6G Q5, Q6: the cosine rule with bearings
    // method: Example 12, 6G, with true bearings from 6D (find the angle between the legs first)
    'y10-6g-bearings': `
      <p class="hp-tag">Worked example: a truck drives due east for <b>90 km</b>, then on a bearing of <b>230°</b> for <b>70 km</b>, then straight back to the start. Find the total distance, to the nearest kilometre.</p>
      ${steps(
        `<p><strong>Find the angle between the two legs.</strong> At the turn, the way back west is 270°. The truck turns to 230°, so the angle inside the triangle is 270° − 230° = 40°.</p>`,
        `<p><strong>Cosine rule for the last leg.</strong></p>
         ${sum('x² = 90² + 70² − 2(90)(70) cos 40°<br>= 13000 − 12600 cos 40° = 3347.840...<br>x = 57.860... km')}`,
        `<p><strong>Add all three legs.</strong></p>
         ${sum('90 + 70 + 57.860... = 217.860... ≈ 218 km')}
         ${ans('218')}`
      )}
      <p><strong>Three distances known, bearing wanted?</strong> Use the cosine rule to find the angle at a point, then add it to or subtract it from the bearing of a known side, as in 6D.</p>
      ${tip('Draw a north line at every corner. Interior angles come from the difference between two bearings, or 180° minus it.')}`,

    // y10-6G Q8: sine rule or cosine rule?
    // method: Key ideas, 6F and 6G (what each rule needs)
    'y10-6g-which': `
      <p class="hp-tag">Worked example: which rule finds x?</p>
      ${steps(
        `<p><strong>Do you know a side and the angle opposite it?</strong> Then the sine rule works. Example: angles 40° and 75°, with 6 opposite 40° and x opposite 75°.</p>
         ${ans('Sine rule')}`,
        `<p><strong>Two sides and the angle between them, or all three sides?</strong> No side is paired with its opposite angle, so use the cosine rule. Example: sides 5 and 9 with 120° between them, x opposite 120°.</p>
         ${ans('Cosine rule')}`
      )}
      ${chips(['side + its opposite angle + one more: sine rule', 'add'], ['two sides + angle between, or three sides: cosine rule', 'take'])}
      ${tip('Two angles are given? Find the third with the angle sum: you then have a matching pair, so use the sine rule.')}`,

    // y10-6G Q11: proving the cosine rule
    // method: Enrichment set-up, 6G (Pythagoras in the two right-angled triangles, then eliminate h)
    'y10-6g-proof': `
      <p class="hp-tag">Worked example: follow the proof with numbers. In triangle ABC, the foot P of the height from B is on CA. Let CP = 3, BP = 4 and CA = 10.</p>
      ${steps(
        `<p><strong>The other piece of CA</strong> is the whole minus the first piece.</p>
         ${sum('AP = 10 − 3 = 7')}`,
        `<p><strong>Pythagoras in each right-angled triangle.</strong></p>
         ${sum('triangle CBP: CB² = 3² + 4² = 25, so CB = 5<br>triangle APB: AB² = 7² + 4² = 65')}`,
        `<p><strong>Check the cosine rule pattern.</strong> With a = 5, b = 10 and CP = 3:</p>
         ${sum('a² + b² − 2 × b × CP = 25 + 100 − 60 = 65 ✓<br>cos C = CP/CB = 3/5')}`
      )}
      <p><strong>With letters:</strong> do the same steps, expand the bracket (b − x)², and replace x² + h² with a² so h disappears. Then swap x for a cos C.</p>
      ${tip('Type squares with ^, like a^2, and products with *, like 2*b*x.')}`,

    // =====================================================================
    // Year 10 6H Area of a triangle (10A)
    // =====================================================================
    // y10-6H Q1, Q2, Q9: area from two sides and the included angle
    // method: Example 14, 6H (Area = ½ab sin C)
    'y10-6h-area': `
      <p class="hp-tag">Worked example: find the area of each triangle, correct to one decimal place.</p>
      ${tri(triSAS(5.5, 4, 52), '', { CB: '11 cm', CA: '8 cm' }, { C: '52°' }, 'A triangle with sides 8 cm and 11 cm and a 52° angle between them', 36)}
      ${steps(
        `<p><strong>Check the angle is between the two sides</strong> (the included angle).</p>`,
        `<p><strong>Substitute into Area = ½ab sin C.</strong></p>
         ${sum('Area = ½ × 8 × 11 × sin 52° = 34.6724... ≈ 34.7 cm²')}
         ${ans('34.7')}`,
        `<p><strong>Obtuse angles work the same way.</strong> Sides 5 and 7.5 with 128° between them:</p>
         ${sum('Area = ½ × 5 × 7.5 × sin 128° = 14.7752... ≈ 14.8')}`
      )}
      <p><strong>Same sides, supplementary angles:</strong> sin θ = sin(180° − θ), so the areas are equal. For example sin 52° = sin 128°.</p>
      ${tip('Type just the number, or with units like cm^2. A triangle named ΔPQR: the angle ∠P sits between sides PQ and PR.')}`,

    // y10-6H Q3, Q10: a side or an angle from the area
    // method: Example 15, 6H (substitute everything, then solve)
    'y10-6h-side': `
      <p class="hp-tag">Worked example: the area is <b>42 cm²</b>. Find x, correct to one decimal place.</p>
      ${tri(triSAS(4.5, 5.1, 66), '', { CB: '9 cm', CA: 'x cm' }, { C: '66°' }, 'A triangle with sides 9 cm and x cm and a 66° angle between them', 36)}
      ${steps(
        `<p><strong>Substitute everything you know</strong>, with b = x.</p>
         ${sum('42 = ½ × 9 × x × sin 66°')}`,
        `<p><strong>Solve for x.</strong> Multiply both sides by 2, then divide by 9 sin 66°.</p>
         ${sum('84 = 9x sin 66°<br>x = 84/(9 × sin 66°) = 10.2166... ≈ 10.2')}
         ${ans('10.2')}`,
        `<p><strong>Angle unknown instead?</strong> Area 30 with sides 10 and 8: 30 = ½ × 10 × 8 × sin θ, so sin θ = 60/80 = 0.75. Then θ = 48.6° or 180° − 48.6° = 131.4°.</p>`
      )}
      ${tip('Two possible angles: one acute, one obtuse. Give both with a comma if asked, like 48.6, 131.4.')}`,

    // y10-6H Q4, Q7, Q8, Q11: parallelograms, quadrilaterals and polygons
    // method: Example 14, 6H (split the shape into triangles, use ½ab sin C in each)
    'y10-6h-shapes': `
      <p class="hp-tag">Worked example: a parallelogram has sides <b>9 cm</b> and <b>5 cm</b> with an angle of <b>70°</b> between them. Find its area, to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [9, 0], [10.71, 4.698], [1.71, 4.698]], fill: true }, { seg: [9, 0, 1.71, 4.698], dash: true },
        { angle: [0, 0, 0, 70], label: '70°', r: 1 }, { label: '9 cm', at: [4.5, -0.6] }, { label: '5 cm', at: [0.5, 2.5], anchor: 'end' }
      ], 'A parallelogram with sides 9 cm and 5 cm and a 70° angle, split into two equal triangles by a diagonal', 26)}
      ${steps(
        `<p><strong>A diagonal splits it into two identical triangles.</strong> Each has sides 9 and 5 with 70° between them.</p>`,
        `<p><strong>Two lots of ½ab sin C.</strong></p>
         ${sum('Area = 2 × ½ × 9 × 5 × sin 70° = 9 × 5 × sin 70° = 42.2861... ≈ 42.29 cm²')}
         ${ans('42.29')}`
      )}
      <p><strong>Other quadrilaterals:</strong> draw a diagonal, find the area of each triangle (use Pythagoras or the cosine rule for a missing length or angle), then add. <strong>Regular polygons:</strong> cut into triangles from one corner or from the centre; the angle sum is (n − 2) × 180°. <strong>Rules with letters:</strong> put the letters into ½ab sin C the same way.</p>
      ${tip('Label the sides and the included angle of every triangle before you work out its area. Keep areas unrounded until you add.')}`,

    // y10-6H Q5, Q6: sine rule or cosine rule first, then the area
    // method: Example 14, 6H, after Example 10 (6F) or Example 13 (6G)
    'y10-6h-tworule': `
      <p class="hp-tag">Worked example: find each area, correct to two decimal places.</p>
      ${steps(
        `<p><strong>(a) One side and two angles.</strong> A side of 10 lies between angles of 50° and 60°. The third angle is 180° − 50° − 60° = 70°, opposite the 10. Use the sine rule for the side opposite 60°:</p>
         ${sum('b = 10/sin 70° × sin 60° = 9.2160...<br>Area = ½ × 10 × 9.2160... × sin 50° = 35.2995... ≈ 35.30')}`,
        `<p><strong>(b) Three sides: 5, 6 and 7.</strong> Use the cosine rule for an angle, here the one between 5 and 6:</p>
         ${sum('cos C = (25 + 36 − 49)/60 = 0.2, so C = 78.4630...°<br>Area = ½ × 5 × 6 × sin 78.4630...° = 14.6969... ≈ 14.70')}
         ${ans('35.30, 14.70')}`
      )}
      ${tip('For the area, pick an angle that sits between two sides you know. Keep the side or angle you found unrounded.')}`,

    // =====================================================================
    // Year 10 6I The unit circle (10A)
    // =====================================================================
    // y10-6I Q1, Q2: supplementary angles
    // method: Example 16, 6I (sin θ = sin(180° − θ), cos θ = −cos(180° − θ), tan θ = −tan(180° − θ))
    'y10-6i-supp': `
      <p class="hp-tag">Worked example: complete each statement with an obtuse angle: <b>sin 57° = sin □</b>, <b>cos 23° = −cos □</b>, <b>tan 62° = −tan □</b>.</p>
      ${unit(123, [{ seg: [0, 0, 1.089, 1.677], thin: true, dash: true }, { angle: [0, 0, 0, 57], label: '57°', r: 0.6 }, { angle: [0, 0, 123, 180], label: '57°', r: 0.6 }], 'A unit circle with angles of 57° and 123°, mirror images across the y-axis')}
      ${steps(
        `<p><strong>Use the supplement:</strong> 180° minus the angle. The point for 123° is the mirror image of the point for 57°: same height, opposite x.</p>
         ${sum('180° − 57° = 123°, &nbsp; 180° − 23° = 157°, &nbsp; 180° − 62° = 118°')}
         ${ans('123, 157, 118')}`,
        `<p><strong>The other way round works the same.</strong> sin 101° = sin(180° − 101°) = sin 79°, and −cos 134° = cos(180° − 134°) = cos 46°.</p>`
      )}
      ${tip('sin keeps its sign in quadrant 2, while cos and tan change sign. That is why the minus appears for cos and tan.')}`,

    // y10-6I Q3, Q6, Q9, Q10, Q11: quadrants and signs
    // method: Example 17, 6I (find the quadrant, then ASTC)
    'y10-6i-quadrant': `
      <p class="hp-tag">Worked example: find the quadrant and the signs of sin, cos and tan for <b>θ = 285°</b>, <b>θ = 196°</b> and <b>θ = −250°</b>.</p>
      ${D([
        { seg: [-2.4, 0, 2.4, 0], arrow: 'end' }, { seg: [0, -2.4, 0, 2.4], arrow: 'end' },
        { label: '2: Sin +', at: [-1.2, 1.2] }, { label: '1: All +', at: [1.2, 1.2] }, { label: '3: Tan +', at: [-1.2, -1.2] }, { label: '4: Cos +', at: [1.2, -1.2] },
        { label: '0°', at: [2.6, 0.2], anchor: 'start' }, { label: '90°', at: [0, 2.7] }, { label: '180°', at: [-2.6, 0.2], anchor: 'end' }, { label: '270°', at: [0, -2.8] }
      ], 'The four quadrants: All positive in 1, Sin in 2, Tan in 3, Cos in 4', 40)}
      ${steps(
        `<p><strong>Place the angle.</strong> Measure anticlockwise from the positive x-axis. Negative angles go clockwise.</p>
         ${sum('285° is between 270° and 360°: quadrant 4<br>196° is between 180° and 270°: quadrant 3<br>−250°: 250° clockwise passes −90° and −180°, ending in quadrant 2')}`,
        `<p><strong>Use ASTC</strong> (All, Sin, Tan, Cos are positive in quadrants 1, 2, 3, 4).</p>
         ${sum('285°: sin −, cos +, tan −<br>196°: sin −, cos −, tan +<br>−250°: sin +, cos −, tan −')}`
      )}
      <p><strong>Why?</strong> P = (cos θ, sin θ), so cos is the x-coordinate and sin is the y-coordinate, and tan θ = sin θ/cos θ. Two negatives divide to a positive. Where cos θ = 0, tan θ is undefined because you cannot divide by zero.</p>
      ${tip('Type the quadrant as just its number, like 4.')}`,

    // y10-6I Q4, Q5, Q7: reference angles
    // method: Example 18, 6I (reference angle 180° − θ, θ − 180° or 360° − θ; sign from the quadrant)
    'y10-6i-reference': `
      <p class="hp-tag">Worked example: write <b>cos 154°</b>, <b>sin 313°</b> and <b>tan 249°</b> using their reference angles.</p>
      ${unit(154, [{ angle: [0, 0, 154, 180], label: '26°', r: 0.7 }, { angle: [0, 0, 0, 154], label: '154°', r: 0.4 }], 'A unit circle with the point P at 154°, 26° above the negative x-axis')}
      ${steps(
        `<p><strong>Find the reference angle</strong>, the acute angle to the x-axis.</p>
         ${sum('154° (quadrant 2): 180° − 154° = 26°<br>313° (quadrant 4): 360° − 313° = 47°<br>249° (quadrant 3): 249° − 180° = 69°')}`,
        `<p><strong>Choose the sign from the quadrant</strong> (ASTC).</p>
         ${sum('cos 154° = −cos 26°<br>sin 313° = −sin 47°<br>tan 249° = tan 69°')}
         ${ans('-cos 26, -sin 47, tan 69')}`
      )}
      <p><strong>Negative angles:</strong> −148° is 148° clockwise, in quadrant 3, so its reference angle is 180° − 148° = 32°.</p>
      ${tip('Type it like -sin 20 or cos 40 (the degree sign is optional). The reference angle is always between 0° and 90°.')}`,

    // y10-6I Q8: a second angle with the same value
    // method: Examples 16 to 18, 6I (same reference angle, a quadrant with the same sign)
    'y10-6i-second': `
      <p class="hp-tag">Worked example: find a second angle between 0° and 360° with the same value: <b>sin 226°</b>, <b>cos 77°</b>, <b>tan 74°</b>.</p>
      ${steps(
        `<p><strong>Find the reference angle and the sign.</strong></p>
         ${sum('sin 226°: 226° − 180° = 46°, negative (quadrant 3)<br>cos 77°: 77°, positive (quadrant 1)<br>tan 74°: 74°, positive (quadrant 1)')}`,
        `<p><strong>Find the other quadrant with the same sign</strong> and use the same reference angle there.</p>
         ${sum('sin is also negative in quadrant 4: 360° − 46° = 314°<br>cos is also positive in quadrant 4: 360° − 77° = 283°<br>tan is also positive in quadrant 3: 180° + 74° = 254°')}
         ${ans('314, 283, 254')}`
      )}
      ${chips(['quadrant 2: 180° − ref'], ['quadrant 3: 180° + ref'], ['quadrant 4: 360° − ref'])}
      ${tip('Check with a calculator: sin 226° and sin 314° should give the same number.')}`,

    // y10-6I Q12: comparing values with the unit circle
    // method: Key ideas, 6I (cos θ is the x-coordinate, sin θ the y-coordinate, signs by quadrant, multiples of 90°)
    'y10-6i-compare': `
      <p class="hp-tag">Worked example: true or false? (a) <b>sin 25° &lt; cos 25°</b> (b) <b>sin 110° &gt; tan 110°</b> (c) <b>sin 90° = cos 0°</b></p>
      ${unit(25, [{ angle: [0, 0, 0, 25], label: '25°', r: 0.7 }], 'A unit circle with the point P at 25°, low and far to the right')}
      ${steps(
        `<p><strong>(a) Compare the coordinates of P.</strong> At 25° the point is low (sin is its height) and far right (cos is its across distance), so sin is smaller. Below 45°, sin θ &lt; cos θ.</p>
         ${ans('True')}`,
        `<p><strong>(b) Use the signs.</strong> 110° is in quadrant 2, where sin is positive and tan is negative. A positive number is bigger than a negative one.</p>
         ${ans('True')}`,
        `<p><strong>(c) Multiples of 90°.</strong> At 90° the point is (0, 1) and at 0° it is (1, 0). So sin 90° = 1 and cos 0° = 1.</p>
         ${ans('True')}`
      )}
      ${tip('Draw a quick unit circle and mark the points. If the signs differ, the positive one is bigger.')}`,

    // y10-6I Q13, Q14: complementary angles and identities
    // method: Key ideas, 6A and 6I (sides of a right-angled triangle; the other acute angle is 90° − θ)
    'y10-6i-complement': `
      <p class="hp-tag">Worked example: compare <b>sin 34°</b> and <b>cos 56°</b>, then find θ if <b>sin 18° = cos θ</b>.</p>
      ${steps(
        `<p><strong>Evaluate.</strong> 34° and 56° add to 90°.</p>
         ${sum('sin 34° = 0.5591... ≈ 0.56<br>cos 56° = 0.5591... ≈ 0.56')}`,
        `<p><strong>Why they match:</strong> in a right-angled triangle, the side opposite one acute angle is adjacent to the other. So sin θ = cos(90° − θ).</p>
         ${sum('sin 18° = cos(90° − 18°) = cos 72°, so θ = 72')}
         ${ans('72')}`,
        `<p><strong>Using a fraction:</strong> if cos(90° − θ) = 20/29, then sin θ = 20/29. A triangle with O = 20 and H = 29 has A = √(29² − 20²) = 21, so tan θ = 20/21.</p>`
      )}
      <p><strong>Another identity:</strong> (sin 52°)² + (cos 52°)² = 1. It holds for every angle, because sin and cos are the sides of a right-angled triangle with hypotenuse 1.</p>
      ${tip('Type two decimal places when asked, like 0.56, and fractions with /, like 20/21.')}`,

    // =====================================================================
    // Year 10 6J Graphs of trigonometric functions (10A)
    // =====================================================================
    // y10-6J Q1, Q2: reading values off the graphs
    // method: Example 19, 6J (read up to the curve and across, or across to the curve and down)
    'y10-6j-read': `
      <p class="hp-tag">Worked example: use the graph of cos θ to estimate <b>cos 170°</b>, and the two angles where <b>cos θ = −0.7</b>.</p>
      ${wave(cs, [
        { seg: [5.667, 0, 5.667, -4.924], dash: true }, { seg: [5.667, -4.924, 0, -4.924], dash: true }, { point: [5.667, -4.924] },
        { seg: [0, -3.5, 7.519, -3.5], dash: true }, { seg: [4.481, -3.5, 4.481, 0], dash: true }, { seg: [7.519, -3.5, 7.519, 0], dash: true },
        { point: [4.481, -3.5] }, { point: [7.519, -3.5] }
      ], 'The graph of cos θ from 0° to 360°, with reading lines at 170° and at cos θ = −0.7')}
      ${steps(
        `<p><strong>Value at an angle:</strong> go up or down from 170° to the curve, then across to the vertical axis. Each grid line across is 30° and each one up is 0.2.</p>
         ${sum('cos 170° ≈ −0.98')}`,
        `<p><strong>Angles for a value:</strong> go across from −0.7 until you hit the curve. It crosses twice. Go down from each point.</p>
         ${sum('cos θ = −0.7: θ ≈ 134° or 226°')}
         ${ans('-0.98; 134, 226')}`
      )}
      <p><strong>The sine graph works the same.</strong> sin 230° ≈ −0.77, and sin θ = 0.7 at θ ≈ 44° and 136°.</p>
      ${tip('An estimate to one decimal place is fine for a value. Type the two angles with a comma, like 134, 226.')}`,

    // y10-6J Q3: comparing values with the graphs
    // method: Example 20, 6J (mark both angles on the graph and compare heights)
    'y10-6j-compare': `
      <p class="hp-tag">Worked example: true or false? (a) <b>sin 70° &lt; sin 165°</b> (b) <b>cos 230° &gt; cos 170°</b></p>
      ${wave(sn, [{ point: [2.333, 4.698] }, { point: [5.5, 1.294] }], 'The graph of sin θ with points marked at 70° and 165°')}
      ${steps(
        `<p><strong>Mark both angles on the graph</strong> and see which point is higher. On the sine graph, 70° is near the top and 165° is much lower.</p>
         ${sum('sin 70° ≈ 0.94, &nbsp; sin 165° ≈ 0.26')}
         ${ans('False')}`,
        `<p><strong>On the cosine graph</strong>, 230° is below the axis, but 170° is almost at the bottom.</p>
         ${sum('cos 230° ≈ −0.64, &nbsp; cos 170° ≈ −0.98')}
         ${ans('True')}`
      )}
      ${tip('Higher on the graph means larger. Equal heights mean the values are equal, which happens at mirror-image angles.')}`,

    // y10-6J Q4, Q5, Q6: the other angle with the same value
    // method: Key ideas, 6J (symmetry of the graphs, reference angles)
    'y10-6j-second': `
      <p class="hp-tag">Worked example: find the other angle with the same value: <b>sin 47°</b>, <b>sin 260°</b>, <b>cos 112°</b> (between 0° and 360°).</p>
      ${steps(
        `<p><strong>Sine graph:</strong> it is symmetric about 90° and about 270°. Find the reference angle, then use the other quadrant with the same sign.</p>
         ${sum('sin 47°: 180° − 47° = 133°<br>sin 260°: reference 80°, negative, so 360° − 80° = 280°')}`,
        `<p><strong>Cosine graph:</strong> it is symmetric about 180°, so the partner is 360° minus the angle.</p>
         ${sum('cos 112°: 360° − 112° = 248°')}
         ${ans('133, 280, 248')}`,
        `<p><strong>Between −180° and 180°:</strong> cos is symmetric about 0°, so cos 50° = cos(−50°). For sin, use 180° − θ: sin 50° = sin 130°, and sin(−25°) = sin(−180° + 25°) = sin(−155°).</p>`
      )}
      ${tip('Check with a calculator that both angles give the same value.')}`,

    // y10-6J Q8: solving with a calculator
    // method: Key ideas, 6J (one answer from the inverse function, the other by symmetry)
    'y10-6j-calc': `
      <p class="hp-tag">Worked example: solve for 0° ≤ θ ≤ 360°, to one decimal place: (a) <b>sin θ = 0.3</b> (b) <b>cos θ = −0.45</b></p>
      ${steps(
        `<p><strong>(a) Use sin⁻¹ for the first answer,</strong> then the symmetry of the sine graph about 90°.</p>
         ${sum('θ = sin⁻¹(0.3) = 17.4576...° ≈ 17.5°<br>180° − 17.4576...° = 162.5423...° ≈ 162.5°')}`,
        `<p><strong>(b) cos⁻¹ already gives the quadrant 2 answer</strong> for a negative value. The cosine graph is symmetric about 180°.</p>
         ${sum('θ = cos⁻¹(−0.45) = 116.7436...° ≈ 116.7°<br>360° − 116.7436...° = 243.2563...° ≈ 243.3°')}
         ${ans('17.5, 162.5; 116.7, 243.3')}`
      )}
      <p><strong>Negative sine?</strong> sin⁻¹ gives a negative angle. Use the reference angle instead (drop the minus), then 180° + ref and 360° − ref.</p>
      ${tip('Give both angles with a comma, smallest first, like 17.5, 162.5. Sketch the graph to check you have the right quadrants.')}`,

    // y10-6J Q7, Q9: the range of values, negative angles
    // method: Key ideas, 6I and 6J (−1 ≤ sin θ, cos θ ≤ 1; negative angles; period 360°)
    'y10-6j-range': `
      <p class="hp-tag">Worked example: (a) how many solutions does <b>sin θ = 1.5</b> have? (b) find <b>cos(−60°)</b>. (c) how often does sin θ reach 1 for −360° ≤ θ ≤ 360°?</p>
      ${steps(
        `<p><strong>(a) Sine and cosine always lie between −1 and 1.</strong> The graph never reaches 1.5.</p>
         ${ans('0')}`,
        `<p><strong>(b) The cosine graph is symmetric about 0°</strong>, so cos(−θ) = cos θ.</p>
         ${sum('cos(−60°) = cos 60° = 1/2')}
         ${ans('1/2')}`,
        `<p><strong>(c) The graph repeats every 360°.</strong> sin θ = 1 at 90°; going back one lap gives 90° − 360° = −270°. Adding a lap gives 450°, which is outside the interval.</p>
         ${ans('2')}`
      )}
      ${tip('For sine, sin(−θ) = −sin θ: the graph is turned upside down on the left of 0°. Type exact values like 1/2 or -1/2.')}`,

    // y10-6J Q10: amplitude, period and shifts
    // method: no worked example (Key ideas, 6J: amplitude and period)
    'y10-6j-transform': `
      <p class="hp-tag">Worked example: describe <b>y = 5 cos x</b>, <b>y = sin(2x)</b>, <b>y = cos x + 1.5</b> and <b>y = sin(x − 60°)</b>.</p>
      ${steps(
        `<p><strong>A number in front stretches it up and down.</strong> The amplitude of y = 5 cos x is 5. A minus in front flips it: y = −sin x is 1 at x = 270°.</p>`,
        `<p><strong>A number times x squashes it sideways.</strong> One cycle of sin(2x) takes 360° ÷ 2 = 180°, so the period is 180°.</p>`,
        `<p><strong>Adding a number moves it up.</strong> y = cos x + 1.5 has maximum 1 + 1.5 = 2.5 and minimum −1 + 1.5 = 0.5. <strong>Subtracting inside the bracket moves it right:</strong> sin x peaks at 90°, so sin(x − 60°) peaks at 90° + 60° = 150°.</p>
         ${ans('5; 180; 2.5 and 0.5; 150')}`
      )}
      ${tip('Period = 360° ÷ (number times x). A fraction like 1/2 times x makes the period longer. Check with graphing software.')}`,

    // =====================================================================
    // Year 10 6K Exact values and solving trigonometric equations (10A)
    // =====================================================================
    // y10-6K Q1, Q2, Q3: exact values
    // method: Example 21, 6K (special triangles; reference angle and sign from the quadrant)
    'y10-6k-exact': `
      <p class="hp-tag">Worked example: find the exact value of (a) <b>cos 30°</b> (b) <b>sin 120°</b> (c) <b>tan 330°</b>.</p>
      ${tri({ A: [0, 0], C: [3.464, 0], B: [3.464, 2] }, 'C', { AB: '2', BC: '1', AC: '√3' }, { A: '30°', B: '60°' }, 'Half an equilateral triangle: sides 1, √3 and 2 with angles 30°, 60° and 90°', 44)}
      ${steps(
        `<p><strong>(a) Read it off the special triangle.</strong> Next to 30° is √3, and the hypotenuse is 2.</p>
         ${sum('cos 30° = A/H = √3/2')}`,
        `<p><strong>(b) Another quadrant:</strong> 120° is in quadrant 2, where sin is positive. The reference angle is 180° − 120° = 60°.</p>
         ${sum('sin 120° = sin 60° = √3/2')}`,
        `<p><strong>(c)</strong> 330° is in quadrant 4, where tan is negative. The reference angle is 360° − 330° = 30°.</p>
         ${sum('tan 330° = −tan 30° = −1/√3 = −√3/3')}
         ${ans('√3/2, √3/2, -√3/3')}`
      )}
      <p><strong>Multiples of 90°:</strong> read the point on the unit circle. At 180° it is (−1, 0), so cos 180° = −1 and tan 180° = 0 ÷ (−1) = 0.</p>
      ${tip('Type square roots with √ or sqrt, like √3/2 or -sqrt3/3. If a value does not exist, type undefined.')}`,

    // y10-6K Q4, Q7, Q9: solving equations with exact values
    // method: Example 22, 6K (reference angle from the table, then symmetry into the right quadrants)
    'y10-6k-solve': `
      <p class="hp-tag">Worked example: solve <b>sin θ = −√3/2</b> for 0° ≤ θ ≤ 360°.</p>
      ${steps(
        `<p><strong>Find the reference angle</strong> from the table, ignoring the minus.</p>
         ${sum('sin 60° = √3/2, so the reference angle is 60°')}`,
        `<p><strong>Which quadrants?</strong> sin is negative in quadrants 3 and 4.</p>
         ${sum('quadrant 3: 180° + 60° = 240°<br>quadrant 4: 360° − 60° = 300°')}
         ${ans('240, 300')}`,
        `<p><strong>A positive value</strong> uses quadrant 1 (the reference angle itself) and the other quadrant where that function is positive: 2 for sin, 4 for cos, 3 for tan.</p>`
      )}
      <p><strong>A bigger interval:</strong> the graphs repeat every 360°, so add 360° to each answer from the first lap. For example cos θ = −1 gives 180° in the first lap, and 180° + 360° = 540° in the second.</p>
      ${tip('Give every solution, separated by commas, smallest first. 1/√2 is the same as √2/2.')}`,

    // y10-6K Q5, Q6, Q8: exact values in right-angled triangles
    // method: Key ideas, 6K (exact values from the special triangles; Pythagoras for exact ratios)
    'y10-6k-triangle': `
      <p class="hp-tag">Worked example: find x exactly, with no calculator.</p>
      ${tri(rtA(60, 4.8), 'C', { AB: '14', BC: 'x' }, { A: '60°' }, 'A right-angled triangle with a 60° angle, hypotenuse 14 and x opposite the 60°', 36)}
      ${steps(
        `<p><strong>Choose the ratio and use the exact value.</strong> x is O and 14 is H.</p>
         ${sum('sin 60° = x/14<br>x = 14 × √3/2 = 7√3')}
         ${ans('7√3')}`,
        `<p><strong>Unknown on the bottom:</strong> 10 next to a 30° angle, x the hypotenuse.</p>
         ${sum('cos 30° = 10/x<br>x = 10 ÷ √3/2 = 20/√3 = 20√3/3')}`,
        `<p><strong>Finding an angle:</strong> 7 opposite θ and 7√3 adjacent.</p>
         ${sum('tan θ = 7/(7√3) = 1/√3, so θ = 30°')}`
      )}
      <p><strong>Not a special triangle?</strong> Use Pythagoras for the third side, then write the ratios as fractions. Shorter sides 9 and 40 give hypotenuse √(81 + 1600) = 41, so sin θ = 9/41, cos θ = 40/41 and tan θ = 9/40.</p>
      ${tip('Type surds like 7√3 or 7sqrt3, and fractions like 9/41. Rationalise: 20/√3 is written 20√3/3.')}`,

    // y10-6K Q10, Q11: make the trig function the subject first
    // method: Example 22, 6K, after solving for sin x like a linear equation (same operation on both sides)
    'y10-6k-subject': `
      <p class="hp-tag">Worked example: solve <b>2 sin x + √3 = 0</b> for 0° ≤ x ≤ 360°.</p>
      ${steps(
        `<p><strong>Make sin x the subject.</strong> Subtract √3 from both sides, then divide both sides by 2.</p>
         ${sum('2 sin x = −√3<br>sin x = −√3/2')}`,
        `<p><strong>Solve as usual.</strong> Reference angle 60°, sin negative in quadrants 3 and 4.</p>
         ${sum('x = 180° + 60° = 240°, &nbsp; x = 360° − 60° = 300°')}
         ${ans('240, 300')}`,
        `<p><strong>Negative angles:</strong> subtract 360° from each answer in the first lap. For 4 cos x + 4 = 0 on −360° ≤ x ≤ 360°: cos x = −1, so x = 180°, and 180° − 360° = −180°.</p>
         ${ans('-180, 180')}`
      )}
      ${tip('List every solution in the interval, smallest first, with commas. Check each one by putting it back into the equation.')}`
  });
})();
