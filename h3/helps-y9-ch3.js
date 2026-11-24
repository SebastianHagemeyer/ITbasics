/* H3 help panels for Year 9 Chapter 3. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 3A to 3J. */
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
  // Points round an ellipse, for the circular ends of cones and cylinders.
  const ell = (cx, cy, rx, ry, a1, a2) => {
    const n = Math.max(6, Math.ceil(Math.abs(a2 - a1) / 8));
    return Array.from({ length: n + 1 }, (_, i) => { const a = (a1 + (a2 - a1) * i / n) * Math.PI / 180; return [r3(cx + rx * Math.cos(a)), r3(cy + ry * Math.sin(a))]; });
  };
  // Compass arms N, E, S, W from the origin, plus any extra items.
  const compass = (len, extra, alt, unit = 34) => D([
    { seg: [0, 0, 0, len], arrow: 'end' }, { label: 'N', at: [0, len + 0.4] },
    { seg: [0, 0, len, 0], arrow: 'end' }, { label: 'E', at: [len + 0.35, -0.12] },
    { seg: [0, 0, 0, -len], arrow: 'end' }, { label: 'S', at: [0, -len - 0.4] },
    { seg: [0, 0, -len, 0], arrow: 'end' }, { label: 'W', at: [-len - 0.35, -0.12] },
    { point: [0, 0] }, ...extra], alt, unit);
  const bdir = (b, r) => [r3(r * sn(b)), r3(r * cs(b))];   // the point r along a true bearing b

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 9 3A Pythagoras' theorem
    // =====================================================================
    // y9-3A Q1, Q2: finding the hypotenuse
    'y9-3a-hyp': `
      <p class="hp-tag">Worked example: find the hypotenuse c in each triangle. Round to two decimal places where needed.</p>
      ${fig(
        triSpec({ A: [0, 0], B: [4.5, 0], C: [0, 6] }, 'A', { AB: '27', AC: '36', BC: 'c' }, {}, 'A right-angled triangle with shorter sides 27 and 36 and hypotenuse c', 30),
        triSpec({ A: [0, 0], B: [5.2, 0], C: [0, 3.4] }, 'A', { AB: '5.2', AC: '3.4', BC: 'c' }, {}, 'A right-angled triangle with shorter sides 5.2 and 3.4 and hypotenuse c', 30)
      )}
      ${steps(
        `<p><strong>Find the hypotenuse.</strong> It is the longest side, opposite the right angle. Here it is c in both triangles.</p>`,
        `<p><strong>Square the two shorter sides and add.</strong> That gives c².</p>
         ${sum('c² = 27² + 36² = 729 + 1296 = 2025<br>c² = 5.2² + 3.4² = 27.04 + 11.56 = 38.6')}`,
        `<p><strong>Square root, then round.</strong></p>
         ${sum('c = √2025 = 45<br>c = √38.6 = 6.2128... ≈ 6.21')}
         ${ans('45 and 6.21')}`
      )}
      ${tip('Check that c is longer than both other sides. Round only at the very end, and type exactly two decimal places when asked, like 7.40.')}`,

    // y9-3A Q3: the hypotenuse as an exact value (a surd)
    'y9-3a-surd': `
      <p class="hp-tag">Worked example: find the hypotenuse c as an exact value.</p>
      ${tri({ A: [0, 0], B: [6.3, 0], C: [0, 2.8] }, 'A', { AB: '9', AC: '4', BC: 'c' }, {}, 'A right-angled triangle with shorter sides 9 and 4 and hypotenuse c', 30)}
      ${steps(
        `<p><strong>Use c² = a² + b² as usual.</strong></p>
         ${sum('c² = 4² + 9² = 16 + 81 = 97')}`,
        `<p><strong>Stop before you press √.</strong> 97 is not a square number, so the exact answer stays as a square root (a surd).</p>
         ${sum('c = √97')}
         ${ans('√97')}`
      )}
      <p><strong>Why exact?</strong> √97 = 9.8488578... and the digits go on forever. Any decimal you write down is rounded, so it is not exact.</p>
      ${tip('Type a surd as √97 or sqrt97. Do not round it, and do not type a decimal.')}`,

    // y9-3A Q4: change the units first
    'y9-3a-units': `
      <p class="hp-tag">Worked example: the shorter sides are <b>2.5 cm</b> and <b>18 mm</b>. Find the hypotenuse in mm, to two decimal places.</p>
      ${tri({ A: [0, 0], B: [5, 0], C: [0, 3.6] }, 'A', { AB: '2.5 cm', AC: '18 mm', BC: 'c' }, {}, 'A right-angled triangle with shorter sides 2.5 cm and 18 mm', 32)}
      ${steps(
        `<p><strong>Change both lengths into the unit the answer needs.</strong> 1 cm = 10 mm.</p>
         ${sum('2.5 cm = 2.5 × 10 = 25 mm')}`,
        `<p><strong>Pythagoras, now that the units match.</strong></p>
         ${sum('c² = 25² + 18² = 625 + 324 = 949')}`,
        `<p><strong>Square root and round.</strong></p>
         ${sum('c = √949 = 30.805... ≈ 30.81 mm')}
         ${ans('30.81')}`
      )}
      ${chips(['1 cm = 10 mm'], ['1 m = 100 cm'], ['1 km = 1000 m'])}
      ${tip('Convert first, then square. Read the question for the unit of the answer: it may not be either unit in the picture.')}`,

    // y9-3A Q5: hypotenuse, then perimeter
    'y9-3a-perimeter': `
      <p class="hp-tag">Worked example: the shorter sides are <b>4 m</b> and <b>2.5 m</b>. Find the perimeter, to two decimal places.</p>
      ${tri({ A: [0, 0], B: [4, 0], C: [0, 2.5] }, 'A', { AB: '4 m', AC: '2.5 m', BC: 'c' }, {}, 'A right-angled triangle with shorter sides 4 m and 2.5 m', 40)}
      ${steps(
        `<p><strong>Find the missing side first.</strong></p>
         ${sum('c² = 4² + 2.5² = 16 + 6.25 = 22.25<br>c = √22.25 = 4.7169...')}`,
        `<p><strong>Add all three sides.</strong> Use the unrounded value of c.</p>
         ${sum('P = 4 + 2.5 + 4.7169... = 11.2169...')}
         ${ans('11.22')}`
      )}
      <p><strong>Only one length shown?</strong> Tick marks on the two shorter sides mean they are equal, so use that length twice. Equal shorter sides of 3.5 cm give c² = 3.5² + 3.5² = 24.5.</p>
      ${tip('Keep the units the same for all three sides before you add. Round the perimeter, not c.')}`,

    // y9-3A Q6, Q8, Q9, Q10, Q12: hypotenuse problems in real life
    'y9-3a-problems': `
      <p class="hp-tag">Worked example: a rectangular gate is <b>3.6 m</b> wide and <b>1.5 m</b> high. A brace runs from one corner to the opposite corner. How long is the brace?</p>
      ${D([
        { poly: [[0, 0], [3.6, 0], [3.6, 1.5], [0, 1.5]], fill: true }, { seg: [0, 0, 3.6, 1.5] },
        { angle: [3.6, 0, 90, 180], right: true, r: 0.3 },
        { dim: [0, 0, 3.6, 0], label: '3.6 m', off: -0.45 }, { dim: [3.6, 0, 3.6, 1.5], label: '1.5 m', off: -0.45 }, { label: 'brace', at: [1.5, 0.95], anchor: 'end' }
      ], 'A rectangle 3.6 m wide and 1.5 m high with a diagonal brace', 60)}
      ${steps(
        `<p><strong>Find the right-angled triangle.</strong> The brace is the hypotenuse; the width and the height are the shorter sides.</p>`,
        `<p><strong>Pythagoras.</strong></p>
         ${sum('c² = 3.6² + 1.5² = 12.96 + 2.25 = 15.21<br>c = √15.21 = 3.9')}
         ${ans('3.9')}`,
        `<p><strong>Answer what was asked</strong>, rounded as the question says.</p>`
      )}
      <p><strong>Spot the hidden right angle.</strong> A wall meets the ground at 90°. Something's height above the ground and its distance across make a right angle. The longest rod in a cylinder runs from the edge of the bottom to the opposite edge of the top, so its shorter sides are the diameter and the height.</p>
      ${tip('Draw a quick sketch and mark the right angle before you start. The side opposite it is always c.')}`,

    // y9-3A Q7, Q11, Q16: two or more triangles in one shape
    'y9-3a-twostep': `
      <p class="hp-tag">Worked example: find the perimeter of triangle PQR. The dashed height is <b>24 cm</b> and it splits the base into <b>18 cm</b> and <b>32 cm</b>.</p>
      ${D([
        { poly: [[0, 0], [12.5, 0], [4.5, 6]], fill: true }, { seg: [4.5, 6, 4.5, 0], dash: true }, { angle: [4.5, 0, 0, 90], right: true, r: 0.6 },
        { point: [0, 0], name: 'P', pos: 'sw' }, { point: [12.5, 0], name: 'R', pos: 'se' }, { point: [4.5, 6], name: 'Q', pos: 'n' },
        { label: '24 cm', at: [4.75, 2.6], anchor: 'start' }, { label: '18 cm', at: [2.25, -0.7] }, { label: '32 cm', at: [8.5, -0.7] }
      ], 'Triangle PQR with a dashed height of 24 cm from Q splitting the base into 18 cm and 32 cm', 26)}
      ${steps(
        `<p><strong>Split the shape into right-angled triangles.</strong> Both of them use the dashed height.</p>`,
        `<p><strong>Find each sloping side.</strong></p>
         ${sum('PQ² = 18² + 24² = 324 + 576 = 900, so PQ = 30<br>QR² = 32² + 24² = 1024 + 576 = 1600, so QR = 40')}`,
        `<p><strong>Add the outside edges only.</strong></p>
         ${sum('base = 18 + 32 = 50<br>P = 30 + 40 + 50 = 120')}
         ${ans('120')}`
      )}
      <p><strong>A chain of triangles.</strong> When a side you found is also a side of the next triangle, use it straight away in the next Pythagoras. Cutting an isosceles right-angled triangle down the middle gives two smaller isosceles right-angled triangles.</p>
      ${tip('The dashed height is inside the shape, so it is not part of the perimeter. Fractions are fine as answers: type 15/2 or 7.5.')}`,

    // y9-3A Q13, Q15: right-angled, acute or obtuse?
    'y9-3a-test': `
      <p class="hp-tag">Worked example: do triangles with sides (a) <b>2.4, 3.2, 4</b> and (b) <b>7, 9, 13</b> have a right angle? If not, is it acute or obtuse?</p>
      ${steps(
        `<p><strong>Square the longest side.</strong> That is c².</p>
         ${sum('(a) 4² = 16 &nbsp; (b) 13² = 169')}`,
        `<p><strong>Square the two shorter sides and add.</strong></p>
         ${sum('(a) 2.4² + 3.2² = 5.76 + 10.24 = 16<br>(b) 7² + 9² = 49 + 81 = 130')}`,
        `<p><strong>Compare.</strong> (a) They are equal, so there is a right angle. (b) 169 is bigger than 130, so the triangle is obtuse.</p>
         ${ans('(a) Yes (b) No, obtuse')}`
      )}
      ${chips(['a² + b² = c²: right angle', 'add'], ['a² + b² > c²: acute'], ['a² + b² < c²: obtuse', 'take'])}
      <p>With 7, 9 and a longest side of 11 instead: 11² = 121, which is less than 130, so that triangle is acute.</p>
      ${tip('Always use the longest side as c. A picture that looks right-angled is not proof: check with the numbers.')}`,

    // y9-3A Q14: the triangle inequality
    'y9-3a-inequality': `
      <p class="hp-tag">Worked example: can a triangle have sides (a) <b>5, 8, 12</b> or (b) <b>2, 7, 10</b>?</p>
      ${D([
        { seg: [0, 0, 10, 0] }, { seg: [0, 0, 1, 1.732] }, { seg: [10, 0, 6.5, 6.062] },
        { label: '10', at: [5, -0.6] }, { label: '2', at: [0.2, 1.2], anchor: 'end' }, { label: '7', at: [8.6, 3.3], anchor: 'start' }
      ], 'Sides 2 and 7 standing on a base of 10 cannot reach each other', 22)}
      ${steps(
        `<p><strong>Add the two shorter sides.</strong></p>
         ${sum('(a) 5 + 8 = 13 &nbsp; (b) 2 + 7 = 9')}`,
        `<p><strong>Compare with the longest side.</strong> The two shorter sides must add to more than it.</p>
         ${sum('(a) 13 > 12 ✓ &nbsp; (b) 9 < 10 ✗')}
         ${ans('(a) Possible (b) Not possible')}`
      )}
      <p>The picture shows (b): however you tilt the sides of 2 and 7, they cannot meet across a gap of 10.</p>
      ${tip('If the two shorter sides add to exactly the longest side, they lie flat along it, so that is not a triangle either.')}`,

    // y9-3A Q17, Q18: roofs and kites with a right angle at the top
    'y9-3a-roof': `
      <p class="hp-tag">Worked example: a tent has two <b>2.5 m</b> sloping sides that meet at a right angle, on top of <b>1.2 m</b> walls. Find its width and its total height h, to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [3.536, 0], [3.536, 1.2], [0, 1.2]], fill: true }, { poly: [[0, 1.2], [1.768, 2.968], [3.536, 1.2]], fill: true },
        { angle: [1.768, 2.968, 225, 315], right: true, r: 0.3 }, { seg: [1.768, 2.968, 1.768, 1.2], dash: true },
        { label: '2.5 m', at: [0.7, 2.25], anchor: 'end' }, { dim: [0, 1.2, 0, 0], label: '1.2 m', off: -0.45 },
        { dim: [0, 0, 3.536, 0], label: 'width', off: -0.45 }, { dim: [3.536, 0, 3.536, 2.968], label: 'h', off: -0.6 }
      ], 'A tent: walls 1.2 m high and a roof of two 2.5 m sides meeting at a right angle', 56)}
      ${steps(
        `<p><strong>The roof is an isosceles right-angled triangle.</strong> Its hypotenuse is the width of the tent.</p>
         ${sum('w² = 2.5² + 2.5² = 6.25 + 6.25 = 12.5<br>w = √12.5 = 3.5355... ≈ 3.54 m')}`,
        `<p><strong>Find the height of the roof.</strong> The dashed line splits the roof into two right-angled triangles, each with hypotenuse 2.5 and base half the width.</p>
         ${sum('half the width = 3.5355... ÷ 2 = 1.7677...<br>r² = 2.5² − 1.7677...² = 6.25 − 3.125 = 3.125<br>r = 1.7677...')}`,
        `<p><strong>Add the wall.</strong></p>
         ${sum('h = 1.2 + 1.7677... = 2.9677... ≈ 2.97 m')}
         ${ans('3.54 and 2.97')}`
      )}
      <p><strong>A kite works the same way.</strong> With a right angle at the top, the short diagonal is the hypotenuse of the top triangle. The long diagonal has two pieces: the top piece (like step 2) and the bottom piece, found with Pythagoras using the long rods.</p>
      ${tip('In an isosceles right-angled triangle, the height down from the right angle is exactly half the hypotenuse. Change cm to m (or m to cm) before mixing lengths.')}`,

    // =====================================================================
    // Year 9 3B Finding the length of the shorter sides
    // =====================================================================
    // y9-3B Q1, Q2: finding a shorter side
    'y9-3b-short': `
      <p class="hp-tag">Worked example: find the unknown side in each right-angled triangle. Round to two decimal places where needed.</p>
      ${fig(
        triSpec({ A: [0, 0], B: [0.65, 0], C: [0, 4.2] }, 'A', { AB: '13', AC: 'a', BC: '85' }, {}, 'A right-angled triangle with hypotenuse 85, one shorter side 13 and the other a', 50),
        triSpec({ A: [0, 0], B: [3.94, 0], C: [0, 1.6] }, 'A', { AB: 'b', AC: '3.2', BC: '8.5' }, {}, 'A right-angled triangle with hypotenuse 8.5, one shorter side 3.2 and the other b', 34)
      )}
      ${steps(
        `<p><strong>Find the hypotenuse first.</strong> It is opposite the right angle. This time you know it.</p>`,
        `<p><strong>Hypotenuse squared, take away the other side squared.</strong></p>
         ${sum('a² = 85² − 13² = 7225 − 169 = 7056<br>b² = 8.5² − 3.2² = 72.25 − 10.24 = 62.01')}`,
        `<p><strong>Square root.</strong></p>
         ${sum('a = √7056 = 84<br>b = √62.01 = 7.8746... ≈ 7.87')}
         ${ans('84 and 7.87')}`
      )}
      ${tip('For a shorter side you subtract; for the hypotenuse you add. Check: a shorter side must come out smaller than the hypotenuse.')}`,

    // y9-3B Q3: change the units first
    'y9-3b-units': `
      <p class="hp-tag">Worked example: the hypotenuse is <b>1.3 m</b> and one shorter side is <b>52 cm</b>. Find the other side x in cm, to two decimal places.</p>
      ${tri({ A: [0, 0], B: [4.07, 0], C: [0, 1.5] }, 'A', { AB: 'x', AC: '52 cm', BC: '1.3 m' }, {}, 'A right-angled triangle with hypotenuse 1.3 m and one shorter side 52 cm', 40)}
      ${steps(
        `<p><strong>Change into the unit the answer needs.</strong> 1 m = 100 cm.</p>
         ${sum('1.3 m = 1.3 × 100 = 130 cm')}`,
        `<p><strong>Subtract the squares.</strong></p>
         ${sum('x² = 130² − 52² = 16900 − 2704 = 14196')}`,
        `<p><strong>Square root and round.</strong></p>
         ${sum('x = √14196 = 119.146... ≈ 119.15 cm')}
         ${ans('119.15')}`
      )}
      ${chips(['1 cm = 10 mm'], ['1 m = 100 cm'], ['1 km = 1000 m'])}
      ${tip('Read the question for the unit of the answer. Change both lengths into it before you square anything.')}`,

    // y9-3B Q4, Q10, Q11: exact answers with letters
    'y9-3b-exact': `
      <p class="hp-tag">Worked example: find x exactly. (a) Both shorter sides are x and the hypotenuse is <b>9</b>. (b) The shorter sides are x and 3x and the hypotenuse is <b>5</b>.</p>
      ${fig(
        triSpec({ A: [0, 0], B: [3.2, 0], C: [0, 3.2] }, 'A', { AB: 'x', AC: 'x', BC: '9' }, {}, 'An isosceles right-angled triangle with equal sides x and hypotenuse 9', 34, [{ tick: [0, 0, 3.2, 0], n: 1 }, { tick: [0, 0, 0, 3.2], n: 1 }]),
        triSpec({ A: [0, 0], B: [4.5, 0], C: [0, 1.5] }, 'A', { AB: '3x', AC: 'x', BC: '5' }, {}, 'A right-angled triangle with shorter sides x and 3x and hypotenuse 5', 34)
      )}
      ${steps(
        `<p><strong>Write Pythagoras with the letters.</strong> Remember (3x)² = 3x × 3x = 9x².</p>
         ${sum('(a) x² + x² = 9²<br>(b) x² + (3x)² = 5²')}`,
        `<p><strong>Collect the x² terms.</strong></p>
         ${sum('(a) 2x² = 81 &nbsp; (b) 10x² = 25')}`,
        `<p><strong>Divide, then square root.</strong> Leave the root as it is.</p>
         ${sum('(a) x² = 40.5, so x = √40.5<br>(b) x² = 2.5, so x = √2.5')}
         ${ans('√40.5 and √2.5')}`
      )}
      <p><strong>Sides in a ratio?</strong> A ratio of 1 to 3 means the sides are x and 3x, just like (b). The two sides are √2.5 and 3√2.5.</p>
      ${tip('Type exact answers with sqrt and brackets, like sqrt(40.5) or 3sqrt(2.5). Do not round. Two answers go with a comma between.')}`,

    // y9-3B Q5, Q6, Q8, Q9: shorter-side problems in real life
    'y9-3b-problems': `
      <p class="hp-tag">Worked example: a <b>3.4 m</b> ladder leans against a wall and reaches <b>3.1 m</b> up it. How far is the foot of the ladder from the wall, to one decimal place?</p>
      ${tri({ A: [0, 0], B: [1.4, 0], C: [0, 3.1] }, 'A', { AB: '?', AC: '3.1 m', BC: '3.4 m' }, {}, 'A ladder 3.4 m long reaching 3.1 m up a wall', 40)}
      ${steps(
        `<p><strong>The ladder is the hypotenuse</strong> (opposite the right angle). The wall and the ground are the shorter sides.</p>`,
        `<p><strong>Subtract the squares, then square root.</strong></p>
         ${sum('d² = 3.4² − 3.1² = 11.56 − 9.61 = 1.95<br>d = √1.95 = 1.3964...')}`,
        `<p><strong>Round as asked.</strong></p>
         ${ans('1.4')}`
      )}
      <p><strong>Other hidden hypotenuses:</strong> a cable from the top of a tower to the ground, a TV's screen size (the diagonal), and a bar from the bottom of one post to the top of the next.</p>
      ${tip('Label the side you want. If it is not opposite the right angle, subtract.')}`,

    // y9-3B Q7, Q12, Q13: shapes made of right-angled triangles
    'y9-3b-twostep': `
      <p class="hp-tag">Worked example: a trapezium has parallel sides <b>21</b> and <b>11</b> and equal sloping sides of <b>9</b>. Find its height x exactly.</p>
      ${D([
        { poly: [[0, 0], [8.4, 0], [6.4, 2.993], [2, 2.993]], fill: true }, { seg: [2, 2.993, 2, 0], dash: true }, { angle: [2, 0, 0, 90], right: true, r: 0.4 },
        { label: '21', at: [4.2, -0.6] }, { label: '11', at: [4.2, 3.4] }, { label: '9', at: [0.75, 1.6], anchor: 'end' }, { label: '9', at: [7.65, 1.6], anchor: 'start' },
        { label: 'x', at: [2.2, 1.5], anchor: 'start' }
      ], 'A trapezium with parallel sides 21 and 11, sloping sides 9 and a dashed height x', 34)}
      ${steps(
        `<p><strong>Make a right-angled triangle with the dashed height.</strong> The bottom is 10 longer than the top, shared equally between the two ends.</p>
         ${sum('(21 − 11) ÷ 2 = 5')}`,
        `<p><strong>Pythagoras with hypotenuse 9.</strong></p>
         ${sum('x² = 9² − 5² = 81 − 25 = 56<br>x = √56')}
         ${ans('√56')}`,
        `<p><strong>Two triangles joined together?</strong> Find the shared side first and keep it as a square. Shorter sides 2 and 5 give c² = 4 + 25 = 29. If c is a shorter side of the next triangle, with the other shorter side 4, then x² = 29 + 16 = 45, so x = √45.</p>`
      )}
      ${tip('Keep c² as a whole number (like 29) between steps, and do not round in the middle. A chain of triangles can be worked forwards or backwards one triangle at a time.')}`,

    // =====================================================================
    // Year 9 3C Using Pythagoras' theorem to solve two-dimensional problems
    // =====================================================================
    // y9-3C Q1, Q2, Q3, Q4: two different heights
    'y9-3c-heights': `
      <p class="hp-tag">Worked example: two posts <b>2.1 m</b> apart are <b>1.5 m</b> and <b>4.3 m</b> tall. A wire joins their tops. How long is the wire?</p>
      ${D([
        { seg: [-0.6, 0, 2.7, 0] }, { seg: [0, 0, 0, 1.5] }, { seg: [2.1, 0, 2.1, 4.3] }, { poly: [[0, 1.5], [2.1, 1.5], [2.1, 4.3]], fill: true },
        { seg: [0, 1.5, 2.1, 1.5], dash: true }, { angle: [2.1, 1.5, 90, 180], right: true, r: 0.25 },
        { label: '1.5 m', at: [-0.15, 0.75], anchor: 'end' }, { dim: [2.1, 0, 2.1, 4.3], label: '4.3 m', off: -0.5 }, { label: '2.1 m', at: [1.05, -0.45] },
        { label: 'wire', at: [0.85, 3.2], anchor: 'end' }
      ], 'Two posts 1.5 m and 4.3 m tall, 2.1 m apart, joined by a wire', 50)}
      ${steps(
        `<p><strong>Draw a line straight across from the top of the shorter post.</strong> It makes a right-angled triangle on top.</p>
         ${sum('height difference = 4.3 − 1.5 = 2.8 m')}`,
        `<p><strong>The wire is the hypotenuse.</strong> The gap between the posts is the other shorter side.</p>
         ${sum('w² = 2.8² + 2.1² = 7.84 + 4.41 = 12.25<br>w = √12.25 = 3.5')}
         ${ans('3.5')}`
      )}
      <p><strong>Working backwards?</strong> If you know the wire and the gap, subtract the squares to find the height difference, then take it from the taller height. <strong>Eaves:</strong> if a roof line sticks out past both walls, add those extra lengths to the slope you found.</p>
      ${tip('The triangle sits above the shorter height, not on the ground. Only the difference in heights goes into Pythagoras.')}`,

    // y9-3C Q5: straight-line distance across a shape
    'y9-3c-ab': `
      <p class="hp-tag">Worked example: all the corners are right angles. Find the straight-line distance AB, to one decimal place.</p>
      ${D([
        { poly: [[0, 0], [0, 3.9], [4.8, 3.9], [4.8, 2.7], [2.2, 2.7], [2.2, 0]], fill: true },
        { seg: [0, 0, 4.8, 2.7], dash: true }, { seg: [0, 0, 4.8, 0], dash: true }, { seg: [4.8, 0, 4.8, 2.7], dash: true }, { angle: [4.8, 0, 90, 180], right: true, r: 0.3 },
        { point: [0, 0], name: 'A', pos: 'sw' }, { point: [4.8, 2.7], name: 'B', pos: 'e' },
        { label: '3.9 m', at: [-0.15, 1.95], anchor: 'end' }, { label: '4.8 m', at: [2.4, 4.25] }, { label: '1.2 m', at: [4.95, 3.3], anchor: 'start' }
      ], 'An L-shaped figure 4.8 m across the top and 3.9 m tall on the left, with a 1.2 m step on the right; A is the bottom left corner and B is the inside corner on the right', 40)}
      ${steps(
        `<p><strong>Make AB the hypotenuse.</strong> Go straight across from A, then straight up to B (the dashed lines).</p>`,
        `<p><strong>Work out the across and up distances</strong> from the lengths you know.</p>
         ${sum('across = 4.8 m (the same as the top)<br>up = 3.9 − 1.2 = 2.7 m')}`,
        `<p><strong>Pythagoras.</strong></p>
         ${sum('AB² = 4.8² + 2.7² = 23.04 + 7.29 = 30.33<br>AB = √30.33 = 5.507... ≈ 5.5')}
         ${ans('5.5')}`
      )}
      ${tip('In a shape with all right angles, the pieces going one way add up to the total on the opposite side. Sometimes you add pieces, sometimes you subtract.')}`,

    // y9-3C Q6, Q8: cables and beams that share a side
    'y9-3c-cables': `
      <p class="hp-tag">Worked example: a <b>36 m</b> pole has a <b>26 m</b> cable fixed <b>24 m</b> up it. A second cable, fixed <b>6 m</b> below the top, meets the ground at the same point. How long is the second cable?</p>
      ${D([
        { seg: [-0.5, 0, 3.4, 0] }, { seg: [0, 0, 0, 9], dash: false }, { seg: [0, 6, 2.5, 0] }, { seg: [0, 7.5, 2.5, 0] }, { angle: [0, 0, 0, 90], right: true, r: 0.3 },
        { dim: [0, 0, 0, 6], label: '24 m', off: 0.5 }, { dim: [0, 7.5, 0, 9], label: '6 m', off: 0.5 },
        { label: '26 m', at: [1.2, 2.1], anchor: 'end' }, { label: '?', at: [1.4, 4.4], anchor: 'start' }, { label: 'g', at: [1.25, -0.45] }
      ], 'A 36 m pole with a 26 m cable fixed 24 m up and a second cable fixed 6 m below the top, both meeting the ground at the same point', 30)}
      ${steps(
        `<p><strong>Lower cable: find the distance g along the ground.</strong> It is a shorter side.</p>
         ${sum('g² = 26² − 24² = 676 − 576 = 100<br>g = 10 m')}`,
        `<p><strong>Upper cable: it is fixed 36 − 6 = 30 m up</strong> and reaches the same point on the ground.</p>
         ${sum('u² = 30² + 10² = 900 + 100 = 1000<br>u = √1000 = 31.62...')}
         ${ans('31.62')}`,
        `<p><strong>Several cables?</strong> Multiply each length by how many there are, then add.</p>`
      )}
      <p><strong>Beams meeting above the middle of a bridge:</strong> the upright side is the difference in heights, and the flat side is half the span, so double it at the end.</p>
      ${tip('Look for the side two triangles share. Find it in the triangle where you know two sides, then use it in the other.')}`,

    // y9-3C Q7, Q9: right angles in circles
    'y9-3c-circle': `
      <p class="hp-tag">Worked example: a circle has radius <b>4.5 cm</b> and AB is a diameter. C is on the circle and AC = <b>3.5 cm</b>. Find BC, to one decimal place.</p>
      ${D([
        { circle: [0, 0, 4.5] }, { poly: [[-4.5, 0], [4.5, 0], [-3.139, 3.225]], fill: true }, { point: [0, 0], name: 'O', pos: 's' },
        { angle: [-3.139, 3.225, -112.9, -22.9], right: true, r: 0.45 },
        { point: [-4.5, 0], name: 'A', pos: 'w' }, { point: [4.5, 0], name: 'B', pos: 'e' }, { point: [-3.139, 3.225], name: 'C', pos: 'n' },
        { label: '3.5 cm', at: [-4.45, 2.0], anchor: 'end' }, { label: '', at: [-6.2, 2] }
      ], 'A circle with diameter AB and a point C on the circle; AC is 3.5 cm', 26)}
      ${steps(
        `<p><strong>An angle in a semicircle is a right angle.</strong> So ACB is a right-angled triangle, and the diameter AB is its hypotenuse.</p>
         ${sum('AB = 2 × 4.5 = 9 cm')}`,
        `<p><strong>BC is a shorter side, so subtract.</strong></p>
         ${sum('BC² = 9² − 3.5² = 81 − 12.25 = 68.75<br>BC = √68.75 = 8.291... ≈ 8.3')}
         ${ans('8.3')}`
      )}
      <p><strong>A circle in a corner.</strong> A circle of radius 5 touching two sides of a square has its centre 5 across and 5 up from the corner. So the corner is √(5² + 5²) = √50 = 7.07 from the centre, along the diagonal.</p>
      ${tip('Build a long diagonal in pieces: corner to centre, then radius, radius, then centre to the far corner.')}`,

    // y9-3C Q10, Q11, Q12: isosceles right-angled triangles (45° angles)
    'y9-3c-isosceles': `
      <p class="hp-tag">Worked example: an isosceles right-angled triangle has hypotenuse <b>11</b>. Find the equal sides x exactly.</p>
      ${tri({ A: [0, 0], B: [3.9, 0], C: [0, 3.9] }, 'A', { AB: 'x', AC: 'x', BC: '11' }, {}, 'An isosceles right-angled triangle with equal sides x and hypotenuse 11', 32, [{ tick: [0, 0, 3.9, 0], n: 1 }, { tick: [0, 0, 0, 3.9], n: 1 }])}
      ${steps(
        `<p><strong>Both shorter sides are x.</strong></p>
         ${sum('x² + x² = 11²<br>2x² = 121')}`,
        `<p><strong>Halve, then square root.</strong></p>
         ${sum('x² = 60.5<br>x = √60.5 = 7.778...')}
         ${ans('√60.5')}`,
        `<p><strong>Use it in a story.</strong> Walking 2.6 km south-east means heading exactly between south and east (45°), so the walk is the hypotenuse of one of these triangles:</p>
         ${sum('east = south = √(2.6² ÷ 2) = √3.38 = 1.838... km')}`
      )}
      ${tip('A 45° angle in a right-angled triangle means the two shorter sides are equal. The diagonal of a square makes two of these triangles: a square of side 13 has diagonal √(13² + 13²) = √338 = 18.38.')}`,

    // =====================================================================
    // Year 9 3D Using Pythagoras' theorem to solve three-dimensional problems
    // =====================================================================
    // y9-3D Q1, Q2, Q10: corner to opposite corner of a rectangular prism
    'y9-3d-prism': `
      <p class="hp-tag">Worked example: a box is <b>8 cm</b> long, <b>5 cm</b> wide and <b>4 cm</b> high. Find the distance d from one corner to the opposite corner, to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [10.25, 1.6], [10.25, 5.6]], fill: true },
        { seg: [0, 0, 8, 0] }, { seg: [8, 0, 8, 4] }, { seg: [8, 4, 0, 4] }, { seg: [0, 4, 0, 0] },
        { seg: [0, 4, 2.25, 5.6] }, { seg: [8, 4, 10.25, 5.6] }, { seg: [2.25, 5.6, 10.25, 5.6] }, { seg: [8, 0, 10.25, 1.6] }, { seg: [10.25, 1.6, 10.25, 5.6] },
        { seg: [0, 0, 2.25, 1.6], dash: true }, { seg: [2.25, 1.6, 10.25, 1.6], dash: true }, { seg: [2.25, 1.6, 2.25, 5.6], dash: true },
        { seg: [0, 0, 10.25, 1.6], dash: true }, { seg: [0, 0, 10.25, 5.6] }, { angle: [10.25, 1.6, 90, 188.9], right: true, r: 0.5 },
        { label: '8 cm', at: [4, -0.6] }, { label: '5 cm', at: [9.45, 0.45], anchor: 'start' }, { label: '4 cm', at: [10.5, 3.6], anchor: 'start' }, { label: 'd', at: [5.6, 3.5] }
      ], 'A box 8 cm by 5 cm by 4 cm with the base diagonal dashed and the corner-to-corner diagonal d', 26)}
      ${steps(
        `<p><strong>Find the diagonal across the base first.</strong></p>
         ${sum('b² = 8² + 5² = 64 + 25 = 89')}`,
        `<p><strong>The base diagonal and the height meet at a right angle</strong> (the shaded triangle), and d is its hypotenuse.</p>
         ${sum('d² = 89 + 4² = 89 + 16 = 105<br>d = √105 = 10.246... ≈ 10.25')}
         ${ans('10.25')}`
      )}
      <p><strong>Do not round in the middle.</strong> Rounding b = √89 to 9.43 first gives d = √(9.43² + 16) = √104.9249 = 10.243... ≈ 10.24, which is a little out.</p>
      ${tip('If the base diagonal is given, go straight to d² = base diagonal² + height². Keep b² (here 89) exact between the two steps.')}`,

    // y9-3D Q3, Q8: cones and bowls
    'y9-3d-cone': `
      <p class="hp-tag">Worked example: a cone is <b>5.5 cm</b> high with a base radius of <b>2 cm</b>. Find its slant height s, to one decimal place.</p>
      ${D([
        { poly: ell(0, 0, 2, 0.6, 0, 360), open: true }, { seg: [-2, 0, 0, 5.5] }, { seg: [2, 0, 0, 5.5] },
        { seg: [0, 0, 0, 5.5], dash: true }, { seg: [0, 0, 2, 0], dash: true }, { angle: [0, 0, 0, 90], right: true, r: 0.3 },
        { dim: [-2.6, 0, -2.6, 5.5], label: '5.5 cm', off: 0 }, { label: '2 cm', at: [1, -0.95] }, { label: 's', at: [1.2, 2.9], anchor: 'start' }
      ], 'A cone of height 5.5 cm and base radius 2 cm, with slant height s', 34)}
      ${steps(
        `<p><strong>Find the right-angled triangle inside.</strong> The height, a radius and the slant height make it, and the slant height is the hypotenuse.</p>`,
        `<p><strong>Pythagoras.</strong></p>
         ${sum('s² = 5.5² + 2² = 30.25 + 4 = 34.25<br>s = √34.25 = 5.852... ≈ 5.9')}
         ${ans('5.9')}`
      )}
      <p><strong>Given the diameter?</strong> Halve it first. <strong>A bowl (half a sphere):</strong> the bowl's radius is a hypotenuse. In a bowl of radius 10 cm with a water surface of radius 6 cm, the centre is √(10² − 6²) = √64 = 8 cm above the water, so the water is 10 − 8 = 2 cm deep.</p>
      ${tip('Every line from the centre of a sphere to its surface is a radius. Use that to spot which side is the hypotenuse.')}`,

    // y9-3D Q4, Q7: the longest rod in a cylinder
    'y9-3d-cylinder': `
      <p class="hp-tag">Worked example: find the longest rod that fits inside a cylinder with diameter <b>9 cm</b> and height <b>15 cm</b>, to the nearest millimetre.</p>
      ${D([
        { poly: [...ell(0, 0, 1.8, 0.5, 180, 360), ...ell(0, 3, 1.8, 0.5, 0, 180)], fill: true }, { poly: ell(0, 3, 1.8, 0.5, 0, 360), open: true },
        { poly: ell(0, 0, 1.8, 0.5, 0, 180), open: true }, { seg: [-1.8, 0, 1.8, 3] }, { seg: [-1.8, 3, 1.8, 3], dash: true },
        { label: '9 cm', at: [0, 3.75] }, { dim: [1.8, 0, 1.8, 3], label: '15 cm', off: -0.5 }, { label: 'rod', at: [-0.2, 1.75], anchor: 'end' }
      ], 'A cylinder with diameter 9 cm and height 15 cm and a rod from the bottom edge to the opposite top edge', 40)}
      ${steps(
        `<p><strong>The longest rod goes from the edge of the bottom to the opposite edge of the top.</strong> It is the hypotenuse; the diameter and the height are the shorter sides.</p>`,
        `<p><strong>Pythagoras.</strong></p>
         ${sum('r² = 9² + 15² = 81 + 225 = 306<br>r = √306 = 17.492... cm')}`,
        `<p><strong>Round.</strong> 1 cm = 10 mm, so the nearest millimetre is one decimal place in cm.</p>
         ${ans('17.5')}`
      )}
      <p><strong>Not called a cylinder?</strong> A circle of land with a depth you can dig to is a cylinder too: use its diameter and depth.</p>
      ${tip('Given the radius? Double it first: the rod crosses the whole width.')}`,

    // y9-3D Q5, Q6, Q9: cubes and exact diagonals
    'y9-3d-cube': `
      <p class="hp-tag">Worked example: a cube has sides of <b>5 cm</b>. Find AC exactly, in simplest surd form, then AD to one decimal place.</p>
      ${D([
        { poly: [[0, 0], [5.8, 1.3], [5.8, 5.3]], fill: true },
        { seg: [0, 0, 4, 0] }, { seg: [4, 0, 4, 4] }, { seg: [4, 4, 0, 4] }, { seg: [0, 4, 0, 0] }, { seg: [0, 4, 1.8, 5.3] }, { seg: [4, 4, 5.8, 5.3] },
        { seg: [1.8, 5.3, 5.8, 5.3] }, { seg: [4, 0, 5.8, 1.3] }, { seg: [5.8, 1.3, 5.8, 5.3] },
        { seg: [0, 0, 1.8, 1.3], dash: true }, { seg: [1.8, 1.3, 5.8, 1.3], dash: true }, { seg: [1.8, 1.3, 1.8, 5.3], dash: true },
        { seg: [0, 0, 5.8, 1.3] }, { seg: [0, 0, 5.8, 5.3] }, { angle: [5.8, 1.3, 90, 192.6], right: true, r: 0.45 },
        { point: [0, 0], name: 'A', pos: 'sw' }, { point: [4, 0], name: 'B', pos: 's' }, { point: [5.8, 1.3], name: 'C', pos: 'e' }, { point: [5.8, 5.3], name: 'D', pos: 'ne' },
        { label: '5 cm', at: [2, -0.6] }
      ], 'A cube with sides 5 cm. AC is the diagonal of the bottom face and AD goes to the opposite top corner', 30)}
      ${steps(
        `<p><strong>AC is the diagonal of the bottom face.</strong></p>
         ${sum('AC² = 5² + 5² = 25 + 25 = 50<br>AC = √50 = √25 × √2 = 5√2')}`,
        `<p><strong>Triangle ACD has its right angle at C.</strong> Use AC² straight away, without rounding.</p>
         ${sum('AD² = 50 + 5² = 75<br>AD = √75 = 8.660... ≈ 8.7')}
         ${ans('5√2 and 8.7')}`
      )}
      <p><strong>Simplest surd form:</strong> find the biggest square number that divides the number under the root. 50 = 25 × 2, so √50 = 5√2. In the same way, √75 = √25 × √3 = 5√3.</p>
      ${tip('Type a simplified surd like 5sqrt2 or 5√2. If a cube sits inside a sphere with all eight corners touching it, the corner-to-corner diagonal is a diameter of the sphere.')}`,

    // y9-3D Q11: the height of a square-based pyramid
    'y9-3d-pyramid': `
      <p class="hp-tag">Worked example: a square-based pyramid has base edges of <b>8 cm</b> and sloping edges of <b>9 cm</b>. Find the base diagonal exactly, then the height h.</p>
      ${D([
        { poly: [[0, 0], [2.8, 0.6], [2.8, 5]], fill: true },
        { seg: [0, 0, 4, 0] }, { seg: [4, 0, 5.6, 1.2] }, { seg: [5.6, 1.2, 1.6, 1.2], dash: true }, { seg: [1.6, 1.2, 0, 0], dash: true },
        { seg: [0, 0, 2.8, 5] }, { seg: [4, 0, 2.8, 5] }, { seg: [5.6, 1.2, 2.8, 5] }, { seg: [1.6, 1.2, 2.8, 5], dash: true },
        { seg: [0, 0, 5.6, 1.2], dash: true }, { seg: [2.8, 0.6, 2.8, 5], dash: true }, { point: [2.8, 0.6] },
        { label: '8 cm', at: [2, -0.55] }, { label: '9 cm', at: [1.15, 2.7], anchor: 'end' }, { label: 'h', at: [3, 2.9], anchor: 'start' }
      ], 'A square-based pyramid with base edges 8 cm, sloping edges 9 cm and a dashed height h from the centre of the base', 40)}
      ${steps(
        `<p><strong>Base diagonal.</strong></p>
         ${sum('d² = 8² + 8² = 128<br>d = √128 = √64 × √2 = 8√2')}`,
        `<p><strong>The height stands at the centre of the base</strong>, so use half the diagonal.</p>
         ${sum('half = 4√2, and (4√2)² = 16 × 2 = 32')}`,
        `<p><strong>The sloping edge is the hypotenuse.</strong></p>
         ${sum('h² = 9² − 32 = 81 − 32 = 49<br>h = 7')}
         ${ans('8√2 and 7')}`
      )}
      <p><strong>Given the slant height of a face instead?</strong> It runs from the top to the middle of a base edge, so it pairs with half the base edge. Base edges 10 and slant height 13 give h² = 13² − 5² = 169 − 25 = 144, so h = 12.</p>
      ${tip('A sloping edge goes with half the diagonal; a slant height goes with half an edge. Type surds like 8sqrt2.')}`,

    // y9-3D Q12: the shortest path over the faces of a box
    'y9-3d-spider': `
      <p class="hp-tag">Worked example: an ant walks from one top corner of a box to the opposite bottom corner. The box is <b>5 m</b> long, <b>3 m</b> wide and <b>2 m</b> high. Find the shortest path.</p>
      ${D([
        { poly: [[0, 0], [5, 0], [5, 3], [0, 3]], fill: true }, { poly: [[0, 3], [5, 3], [5, 5], [0, 5]], fill: true }, { seg: [0, 0, 5, 5], dash: true },
        { point: [0, 0], name: 'end', pos: 'sw' }, { point: [5, 5], name: 'start', pos: 'ne' },
        { label: '5 m', at: [2.5, -0.55] }, { label: '3 m', at: [5.2, 1.5], anchor: 'start' }, { label: '2 m', at: [5.2, 4], anchor: 'start' }
      ], 'Two faces of the box unfolded flat into a 5 by 5 rectangle with a straight path across it', 34)}
      ${steps(
        `<p><strong>Through a corner:</strong> two straight pieces, each an edge or a face diagonal. For example, down the 2 m edge, then across the 5 by 3 floor:</p>
         ${sum('2 + √(5² + 3²) = 2 + √34 = 7.830...')}`,
        `<p><strong>Unfold two faces so they lie flat</strong> (the picture). The path becomes one straight line, the hypotenuse of a triangle with sides 5 and 3 + 2.</p>
         ${sum('√(5² + (3 + 2)²) = √50 = 7.071...')}`,
        `<p><strong>Try the other pairs of faces</strong> and keep the smallest.</p>
         ${sum('√((5 + 3)² + 2²) = √68 = 8.246...<br>√((5 + 2)² + 3²) = √58 = 7.615...')}
         ${ans('7.07')}`
      )}
      ${tip('List every route before you work them out, so you do not miss one. Round only the final answers.')}`,

    // =====================================================================
    // Year 9 3E Trigonometric ratios
    // =====================================================================
    // y9-3E Q1: which ratio can you write?
    'y9-3e-which': `
      <p class="hp-tag">Worked example: write a trigonometric ratio for θ using the two sides given.</p>
      ${tri({ A: [0, 0], C: [5.5, 0], B: [5.5, 2] }, 'C', { AC: '11 (A)', BC: '4 (O)', AB: 'H' }, { A: 'θ' }, 'A right-angled triangle: the side opposite θ is 4, the side next to θ is 11', 34)}
      ${steps(
        `<p><strong>Name the sides from θ.</strong> The hypotenuse (H) is opposite the right angle. The opposite side (O) is across from θ. The adjacent side (A) is next to θ, and is not the hypotenuse.</p>
         ${chips(['SOH: sin θ = O/H'], ['CAH: cos θ = A/H'], ['TOA: tan θ = O/A'])}`,
        `<p><strong>Pick the ratio that uses the two sides you have.</strong> Here they are O = 4 and A = 11, so use TOA.</p>
         ${sum('tan θ = O/A = 4/11')}
         ${ans('tan θ = 4/11')}`,
        `<p><strong>Letters work the same way.</strong> If A = 3a and H = 5b:</p>
         ${sum('cos θ = A/H = 3a/(5b)')}`
      )}
      ${tip('Simplify where you can: O = 6 and H = 14 gives sin θ = 6/14 = 3/7. With letters on the bottom, use a bracket: 3a/(5b).')}`,

    // y9-3E Q2, Q3, Q4, Q5, Q6: writing sin, cos and tan as fractions
    'y9-3e-ratios': `
      <p class="hp-tag">Worked example: write sin θ, cos θ and tan θ for this triangle.</p>
      ${tri({ A: [0, 0], C: [5.25, 0], B: [5.25, 1.8] }, 'C', { AC: '35', BC: '12', AB: '37' }, { A: 'θ' }, 'A right-angled triangle with sides 12, 35 and 37; θ is opposite the 12', 34)}
      ${steps(
        `<p><strong>Label the sides from θ.</strong></p>
         ${sum('H = 37 (opposite the right angle)<br>O = 12 (across from θ)<br>A = 35 (next to θ)')}`,
        `<p><strong>Write each ratio.</strong></p>
         ${sum('sin θ = O/H = 12/37<br>cos θ = A/H = 35/37<br>tan θ = O/A = 12/35')}
         ${ans('12/37, 35/37, 12/35')}`,
        `<p><strong>From the other acute angle, O and A swap.</strong> Call it α: sin α = 35/37 (the same as cos θ) and tan α = 35/12.</p>`
      )}
      <p><strong>Similar triangles give the same ratios.</strong> A triangle twice as big has sides 24, 70 and 74, and its sin θ = 24/74, which simplifies to 12/37 again.</p>
      ${tip('Type fractions with /, like 12/37. If the question says simplest form, divide the top and bottom by their highest common factor.')}`,

    // y9-3E Q7, Q8, Q12: find the third side, then the ratios
    'y9-3e-third': `
      <p class="hp-tag">Worked example: the shorter sides are <b>11</b> (opposite θ) and <b>60</b>. Find the hypotenuse, then sin θ, cos θ and tan θ.</p>
      ${tri({ A: [0, 0], C: [6, 0], B: [6, 1.1] }, 'C', { AC: '60', BC: '11', AB: '?' }, { A: 'θ' }, 'A right-angled triangle with shorter sides 11 and 60; θ is opposite the 11', 40)}
      ${steps(
        `<p><strong>Find the missing side with Pythagoras.</strong></p>
         ${sum('H² = 11² + 60² = 121 + 3600 = 3721<br>H = √3721 = 61')}`,
        `<p><strong>Now write the ratios.</strong></p>
         ${sum('sin θ = 11/61, cos θ = 60/61, tan θ = 11/60')}
         ${ans('61, 11/61, 60/61, 11/60')}`,
        `<p><strong>Only one ratio given?</strong> Draw a triangle to match it. sin θ = 3/7 means O = 3 and H = 7:</p>
         ${sum('A² = 7² − 3² = 49 − 9 = 40, so A = √40<br>cos θ = √40/7, tan θ = 3/√40')}`
      )}
      ${tip('Type surds with sqrt, like sqrt40/7 or 3/sqrt40. A fraction answer is fine unsimplified unless the question asks for simplest form.')}`,

    // y9-3E Q9: exact values from a special triangle
    'y9-3e-exact': `
      <p class="hp-tag">Worked example: a right-angled triangle has two 45° angles. Write the exact values of sin 45°, cos 45° and tan 45°.</p>
      ${tri({ A: [0, 0], C: [3.6, 0], B: [3.6, 3.6] }, 'C', { AC: '1', BC: '1', AB: '√2' }, { A: '45°' }, 'An isosceles right-angled triangle with shorter sides 1 and hypotenuse √2', 34)}
      ${steps(
        `<p><strong>Find the sides.</strong> Two equal angles make the shorter sides equal; call them 1.</p>
         ${sum('H² = 1² + 1² = 2, so H = √2')}`,
        `<p><strong>Write each ratio from the 45° angle.</strong></p>
         ${sum('sin 45° = O/H = 1/√2<br>cos 45° = A/H = 1/√2<br>tan 45° = O/A = 1/1 = 1')}
         ${ans('1/sqrt2, 1/sqrt2, 1')}`,
        `<p><strong>Any other special triangle:</strong> first decide which side is opposite each angle. The shortest side is always opposite the smallest angle.</p>`
      )}
      ${tip('Type exact values with sqrt, like 1/sqrt2 or sqrt3/2. Do not turn them into decimals.')}`,

    // y9-3E Q10: approximate ratios from measured sides
    'y9-3e-measured': `
      <p class="hp-tag">Worked example: the sides of this triangle were measured to the nearest millimetre. Find cos 40°, sin 40° and tan 40°, to two decimal places.</p>
      ${tri({ A: [0, 0], C: [4.6, 0], B: [4.6, 3.9] }, 'C', { AC: '46 mm', BC: '39 mm', AB: '60 mm' }, { A: '40°' }, 'A right-angled triangle with a 40° angle and measured sides 46 mm, 39 mm and 60 mm', 40)}
      ${steps(
        `<p><strong>Label the sides from 40°.</strong> H = 60, O = 39, A = 46.</p>`,
        `<p><strong>Divide, then round to two decimal places.</strong></p>
         ${sum('cos 40° ≈ 46/60 = 0.766... ≈ 0.77<br>sin 40° ≈ 39/60 = 0.65<br>tan 40° ≈ 39/46 = 0.847... ≈ 0.85')}
         ${ans('0.77, 0.65, 0.85')}`,
        `<p><strong>The other acute angle is 90° − 40° = 50°.</strong> From there, O and A swap:</p>
         ${sum('sin 50° ≈ 46/60 ≈ 0.77, tan 50° ≈ 46/39 ≈ 1.18')}`
      )}
      ${tip('Check with a calculator in degree mode: cos 40° = 0.766..., so the measurements were good.')}`,

    // y9-3E Q11: which ratios are possible?
    'y9-3e-possible': `
      <p class="hp-tag">Worked example: can θ be an acute angle of a right-angled triangle if (a) <b>sin θ = 0.95</b> (b) <b>cos θ = 1.3</b> (c) <b>tan θ = 12</b>?</p>
      ${steps(
        `<p><strong>sin and cos are a side divided by the hypotenuse.</strong> The hypotenuse is the longest side, so the top is smaller than the bottom and the fraction is less than 1.</p>
         ${sum('(a) 0.95 < 1 ✓ &nbsp; (b) 1.3 > 1 ✗')}`,
        `<p><strong>tan is opposite ÷ adjacent.</strong> Either of those can be the longer one, so tan can be any positive number. O = 12 and A = 1 works.</p>
         ${sum('(c) ✓')}
         ${ans('(a) Yes (b) No (c) Yes')}`
      )}
      ${tip('Picture the triangle: if the side on top of the fraction would have to be at least as long as the hypotenuse, it cannot be drawn.')}`,

    // =====================================================================
    // Year 9 3F Finding unknown side lengths
    // =====================================================================
    // y9-3F Q1: trig values on a calculator
    'y9-3f-calc': `
      <p class="hp-tag">Worked example: use a calculator to find <b>cos 42°</b> and <b>tan 61.5°</b>, correct to two decimal places.</p>
      ${steps(
        `<p><strong>Check the calculator is in degree mode</strong> (a small D or DEG on the screen).</p>
         ${sum('A quick test: sin 90 should give 1')}`,
        `<p><strong>Press the ratio, then type the angle.</strong> Round at the end.</p>
         ${sum('cos 42 = 0.7431... ≈ 0.74<br>tan 61.5 = 1.8417... ≈ 1.84')}
         ${ans('0.74 and 1.84')}`
      )}
      ${tip('The wrong mode gives strange answers: in radians, cos 42 = −0.399..., which cannot belong to an angle in a triangle.')}`,

    // y9-3F Q2: solving when x is on top
    'y9-3f-solve': `
      <p class="hp-tag">Worked example: solve (a) <b>cos 54° = x/11</b> (b) <b>x/7.5 = sin 63.3°</b>, correct to two decimal places.</p>
      ${steps(
        `<p><strong>x is on top, divided by a number.</strong> Undo the division: multiply both sides by that number.</p>
         ${sum('(a) x = 11 × cos 54°<br>(b) x = 7.5 × sin 63.3°')}`,
        `<p><strong>Type it in one go, then round.</strong></p>
         ${sum('(a) x = 6.4656... ≈ 6.47<br>(b) x = 6.7002... ≈ 6.70')}
         ${ans('6.47 and 6.70')}`
      )}
      ${tip('The side the x is written on does not matter: x/7.5 = sin 63.3° is the same equation as sin 63.3° = x/7.5. Type 6.70, not 6.7, when two decimal places are asked.')}`,

    // y9-3F Q3, Q4, Q5, Q6, Q8: finding a side in a right-angled triangle (x on top)
    'y9-3f-triangle': `
      <p class="hp-tag">Worked example: find x, correct to two decimal places.</p>
      ${tri(rtA(40, 6), 'C', { AB: '12', BC: 'x' }, { A: '40°' }, 'A right-angled triangle with a 40° angle, hypotenuse 12 and x opposite the angle', 40)}
      ${steps(
        `<p><strong>Label the sides from the angle.</strong> 12 is H (opposite the right angle) and x is O (across from 40°). O and H means SOH.</p>`,
        `<p><strong>Write the equation and multiply.</strong></p>
         ${sum('sin 40° = x/12<br>x = 12 × sin 40° = 7.7134... ≈ 7.71')}
         ${ans('7.71')}`,
        `<p><strong>Check with the other angle.</strong> It is 90° − 40° = 50°, and from there x is the adjacent side:</p>
         ${sum('cos 50° = x/12, so x = 12 × cos 50° = 7.7134... ✓')}`
      )}
      <p><strong>O and A?</strong> Use tan. With the adjacent side 8.5 and the angle 56°, the opposite side is 8.5 × tan 56° = 12.601... ≈ 12.60.</p>
      ${tip('In a story, draw the triangle first and mark the angle, the side you know and the side you want. An angle "with the vertical" sits at the top of the triangle, not the bottom.')}`,

    // y9-3F Q7: lengths built from two right-angled triangles
    'y9-3f-composite': `
      <p class="hp-tag">Worked example: the dashed line is perpendicular to AB. Find AB, correct to two decimal places.</p>
      ${D([
        { poly: [[0, 0], [7.49, 0], [2.571, 3.064]], fill: true }, { seg: [2.571, 3.064, 2.571, 0], dash: true }, { angle: [2.571, 0, 0, 90], right: true, r: 0.3 },
        { angle: [0, 0, 0, 50], label: '50°', r: 0.6 }, { angle: [7.49, 0, 148, 180], label: '32°', r: 0.9 },
        { point: [0, 0], name: 'A', pos: 'sw' }, { point: [7.49, 0], name: 'B', pos: 'se' }, { point: [2.571, 3.064], name: 'P', pos: 'n' },
        { label: '8 m', at: [1.05, 1.75], anchor: 'end' }, { label: '11.6 m', at: [5.2, 1.85], anchor: 'start' }
      ], 'Triangle APB with a dashed perpendicular from P to AB; AP is 8 m at 50°, BP is 11.6 m at 32°', 46)}
      ${steps(
        `<p><strong>The dashed line splits AB into two pieces.</strong> Each piece is the adjacent side of a right-angled triangle, with the slanted side as H. Call the foot of the dashed line F.</p>`,
        `<p><strong>Use cos in each triangle.</strong></p>
         ${sum('AF = 8 × cos 50° = 5.142...<br>FB = 11.6 × cos 32° = 9.837...')}`,
        `<p><strong>Add the unrounded pieces.</strong></p>
         ${sum('AB = 5.142... + 9.837... = 14.979... ≈ 14.98')}
         ${ans('14.98')}`
      )}
      <p><strong>Regular polygons split the same way.</strong> In a regular hexagon with sides 4 cm, the long diagonal is the middle side plus a piece at each end: 4 + 2 × (4 × cos 60°) = 4 + 4 = 8 cm.</p>
      ${tip('Mark every right angle and every angle you know on the diagram before choosing a ratio.')}`,

    // y9-3F Q9: complementary angles
    'y9-3f-complement': `
      <p class="hp-tag">Worked example: find the complement of 36°, then compare sin 36° and cos 54°, to four decimal places.</p>
      ${tri(rtA(36, 6), 'C', {}, { A: '36°', B: '54°' }, 'A right-angled triangle with angles 36° and 54°', 34)}
      ${steps(
        `<p><strong>Complementary angles add to 90°.</strong></p>
         ${sum('90° − 36° = 54°')}`,
        `<p><strong>Evaluate both.</strong></p>
         ${sum('sin 36° = 0.5878 &nbsp; cos 54° = 0.5878')}
         ${ans('54, and they are equal')}`,
        `<p><strong>Why?</strong> In the triangle, the side opposite 36° is the side adjacent to 54°. So sin 36° = O/H = cos 54°. That means sin 18° = cos ☐ has ☐ = 90 − 18 = 72.</p>`
      )}
      ${tip('Type a pair with a comma, like 0.5878, 0.5878. Four decimal places means four digits after the point, even when the last one is 0.')}`,

    // y9-3F Q10: exact values from surd sides
    'y9-3f-exact': `
      <p class="hp-tag">Worked example: a right-angled triangle has shorter sides <b>2</b> and <b>6</b>. Find the hypotenuse exactly, then the exact value of sin θ, where θ is opposite the side of length 2.</p>
      ${tri({ A: [0, 0], C: [6, 0], B: [6, 2] }, 'C', { AC: '6', BC: '2', AB: '?' }, { A: 'θ' }, 'A right-angled triangle with shorter sides 6 and 2; θ is opposite the 2', 34)}
      ${steps(
        `<p><strong>Pythagoras, then simplify the surd.</strong></p>
         ${sum('H² = 2² + 6² = 4 + 36 = 40<br>H = √40 = √4 × √10 = 2√10')}`,
        `<p><strong>Write the ratio using the exact sides.</strong> Cancel what you can.</p>
         ${sum('sin θ = O/H = 2/(2√10) = 1/√10')}`,
        `<p><strong>To clear the surd from the bottom</strong>, multiply the top and bottom by √10.</p>
         ${sum('1/√10 = √10/10')}
         ${ans('√10/10')}`
      )}
      <p>Do exactly the same with the 45° and the 30° to 60° triangles in the questions: find the missing side as a surd, then write each ratio and simplify.</p>
      ${tip('1/√10 and √10/10 are the same number. Type them as 1/sqrt10 or sqrt10/10.')}`,

    // =====================================================================
    // Year 9 3G Solving for the denominator
    // =====================================================================
    // y9-3G Q1: solving when x is on the bottom
    'y9-3g-solve': `
      <p class="hp-tag">Worked example: solve (a) <b>tan 49° = 5/x</b> (b) <b>9.6/x = cos 22°</b>, correct to two decimal places.</p>
      ${steps(
        `<p><strong>x is on the bottom.</strong> Multiply both sides by x to bring it up.</p>
         ${sum('(a) x × tan 49° = 5')}`,
        `<p><strong>Then divide by the trig value.</strong></p>
         ${sum('(a) x = 5 ÷ tan 49° = 4.3464... ≈ 4.35')}`,
        `<p><strong>So x and the trig value just swap places.</strong></p>
         ${sum('(b) x = 9.6 ÷ cos 22° = 10.353... ≈ 10.35')}
         ${ans('4.35 and 10.35')}`
      )}
      ${tip('Sense check: sin and cos are less than 1, so dividing by them makes the answer bigger than the number on top.')}`,

    // y9-3G Q2, Q4, Q5: finding a side when x ends up on the bottom
    'y9-3g-triangle': `
      <p class="hp-tag">Worked example: find x, correct to two decimal places.</p>
      ${tri(rtA(64, 5), 'C', { AB: 'x', BC: '9.5' }, { A: '64°' }, 'A right-angled triangle with a 64° angle, 9.5 opposite it and hypotenuse x', 40)}
      ${steps(
        `<p><strong>Label the sides from the angle.</strong> 9.5 is O and x is H, so use SOH.</p>`,
        `<p><strong>Write the equation.</strong> This time x is on the bottom.</p>
         ${sum('sin 64° = 9.5/x')}`,
        `<p><strong>Swap x and sin 64°.</strong></p>
         ${sum('x = 9.5 ÷ sin 64° = 10.569... ≈ 10.57')}
         ${ans('10.57')}`
      )}
      <p><strong>Top or bottom?</strong> If the side you want is on top of the ratio, multiply. If it is on the bottom, divide. In stories, a string, a ramp or a glide path is usually the hypotenuse, and the height is opposite the angle at the ground.</p>
      ${tip('Check: the hypotenuse must come out the longest side. 10.57 is longer than 9.5 ✓.')}`,

    // y9-3G Q3, Q6: two unknown sides, and perimeters
    'y9-3g-both': `
      <p class="hp-tag">Worked example: find x and y, correct to one decimal place, then the perimeter.</p>
      ${tri(rtA(48, 5.4), 'C', { AC: '7.2', AB: 'x', BC: 'y' }, { A: '48°' }, 'A right-angled triangle with a 48° angle, adjacent side 7.2, hypotenuse x and opposite side y', 40)}
      ${steps(
        `<p><strong>x is H and 7.2 is A:</strong> CAH, with x on the bottom.</p>
         ${sum('cos 48° = 7.2/x, so x = 7.2 ÷ cos 48° = 10.760... ≈ 10.8')}`,
        `<p><strong>y is O and 7.2 is A:</strong> TOA, with y on top.</p>
         ${sum('tan 48° = y/7.2, so y = 7.2 × tan 48° = 7.996... ≈ 8.0')}
         ${ans('x = 10.8, y = 8.0')}`,
        `<p><strong>Perimeter:</strong> add all three sides, using the unrounded values.</p>
         ${sum('7.2 + 10.760... + 7.996... = 25.956... ≈ 26.0')}`
      )}
      ${tip('Work each unknown from the side you were given, so a rounding slip cannot carry over. Type one decimal place even if it is 0, like 8.0.')}`,

    // y9-3G Q7: rounding part-way through
    'y9-3g-rounding': `
      <p class="hp-tag">Worked example: find <b>x = 9 ÷ cos 62°</b> two ways, each to two decimal places: (A) round cos 62° to two decimal places first, (B) no rounding until the end. How far apart are they?</p>
      ${steps(
        `<p><strong>Method A.</strong></p>
         ${sum('cos 62° ≈ 0.47<br>x = 9 ÷ 0.47 = 19.148... ≈ 19.15')}`,
        `<p><strong>Method B</strong>, all in one go on the calculator.</p>
         ${sum('x = 9 ÷ cos 62° = 19.170... ≈ 19.17')}`,
        `<p><strong>Find the difference.</strong></p>
         ${sum('19.17 − 19.15 = 0.02')}
         ${ans('0.02')}`
      )}
      ${tip('Rounding part-way through throws digits away, and dividing can make that small error bigger. Keep the full value on the calculator until the end.')}`,

    // y9-3G Q8: sin divided by cos
    'y9-3g-identity': `
      <p class="hp-tag">Worked example: find the other two sides to three decimal places. Then compare sin 35° ÷ cos 35° with tan 35°.</p>
      ${tri(rtA(35, 5.2), 'C', { BC: '3 cm', AC: 'a', AB: 'h' }, { A: '35°' }, 'A right-angled triangle with a 35° angle and 3 cm opposite it', 40)}
      ${steps(
        `<p><strong>Both unknown sides have x on the bottom.</strong></p>
         ${sum('tan 35° = 3/a, so a = 3 ÷ tan 35° = 4.284<br>sin 35° = 3/h, so h = 3 ÷ sin 35° = 5.230')}`,
        `<p><strong>Compare.</strong></p>
         ${sum('sin 35° ≈ 0.57, cos 35° ≈ 0.82<br>0.57 ÷ 0.82 = 0.695... ≈ 0.70<br>tan 35° = 0.700... ≈ 0.70 ✓')}
         ${ans('0.70')}`,
        `<p><strong>Why?</strong> With the sides above, sin 35° ÷ cos 35° = (3/5.230) ÷ (4.284/5.230). The 5.230s cancel, leaving 3/4.284, which is O/A.</p>`
      )}
      ${tip('Dividing two fractions with the same bottom: the bottoms cancel. Type a fraction of letters with /, like a/c.')}`,

    // =====================================================================
    // Year 9 3H Finding unknown angles
    // =====================================================================
    // y9-3H Q1, Q2, Q10: inverse trig on the calculator
    'y9-3h-inverse': `
      <p class="hp-tag">Worked example: find θ. (a) <b>cos θ = 0.8090</b>, to the nearest degree (b) <b>tan θ = 5/8</b>, to two decimal places.</p>
      ${steps(
        `<p><strong>To go from a ratio back to an angle, use the inverse key.</strong> Shift then cos gives cos⁻¹.</p>
         ${sum('(a) θ = cos⁻¹(0.8090) = 36.001... ≈ 36°')}`,
        `<p><strong>For a fraction, use brackets</strong> so the whole fraction goes in.</p>
         ${sum('(b) θ = tan⁻¹(5 ÷ 8) = 32.005... ≈ 32.01°')}
         ${ans('36 and 32.01')}`,
        `<p><strong>Check by going forwards.</strong> cos 36° = 0.8090 ✓.</p>`
      )}
      ${tip('Degree mode. Type just the number of degrees, like 32.01. sin and cos are never more than 1, so sin⁻¹(1.2) gives an error.')}`,

    // y9-3H Q3, Q4, Q5, Q6, Q7, Q9: finding an angle in a right-angled triangle
    'y9-3h-triangle': `
      <p class="hp-tag">Worked example: find θ to the nearest degree.</p>
      ${tri(rtA(39.17, 5.7), 'C', { BC: '12', AB: '19' }, { A: 'θ' }, 'A right-angled triangle with 12 opposite θ and hypotenuse 19', 40)}
      ${steps(
        `<p><strong>Label the two sides you know from θ.</strong> 12 is O and 19 is H, so use sin.</p>`,
        `<p><strong>Write the ratio, then use sin⁻¹.</strong></p>
         ${sum('sin θ = 12/19<br>θ = sin⁻¹(12 ÷ 19) = 39.165... ≈ 39°')}
         ${ans('39')}`,
        `<p><strong>The third angle.</strong> The angles add to 180° and one is 90°, so the other two add to 90°.</p>
         ${sum('90° − 39.165...° = 50.834...° ≈ 51°')}`
      )}
      <p><strong>A slope that "rises 3 in 10"</strong> has O = 3 and A = 10, so its angle is tan⁻¹(3 ÷ 10) = 16.69...° ≈ 17°.</p>
      ${tip('Choose the ratio from the two sides you know. For all three angles, type them with commas, like 39, 51, 90.')}`,

    // y9-3H Q8, Q11: angles in other shapes
    'y9-3h-composite': `
      <p class="hp-tag">Worked example: an isosceles triangle has equal sides of <b>9</b> and a base of <b>10</b>. Find the base angle θ, to one decimal place.</p>
      ${D([
        { poly: [[0, 0], [5, 0], [2.5, 3.742]], fill: true }, { seg: [2.5, 3.742, 2.5, 0], dash: true }, { angle: [2.5, 0, 0, 90], right: true, r: 0.3 },
        { tick: [0, 0, 2.5, 3.742], n: 1 }, { tick: [5, 0, 2.5, 3.742], n: 1 },
        { angle: [5, 0, 123.75, 180], label: 'θ', r: 0.6 },
        { label: '9', at: [0.95, 2.05], anchor: 'end' }, { label: '9', at: [4.05, 2.05], anchor: 'start' }, { label: '10', at: [2.5, -0.5] }
      ], 'An isosceles triangle with equal sides 9 and base 10, split by a dashed height', 44)}
      ${steps(
        `<p><strong>Make a right-angled triangle.</strong> The height of an isosceles triangle cuts the base in half.</p>
         ${sum('10 ÷ 2 = 5')}`,
        `<p><strong>In that triangle, 5 is A and 9 is H.</strong></p>
         ${sum('cos θ = 5/9<br>θ = cos⁻¹(5 ÷ 9) = 56.251... ≈ 56.3°')}
         ${ans('56.3')}`,
        `<p><strong>Then use angle facts.</strong> An angle on a straight line with θ is 180° − θ. Two right-angled triangles that share a side each give an angle, and you can add or subtract them.</p>`
      )}
      ${tip('Look for the right angle first. If the shape has none, draw a height or a perpendicular. Parallel lines give equal alternate angles.')}`,

    // y9-3H Q12: viewing angles
    'y9-3h-viewing': `
      <p class="hp-tag">Worked example: a sign <b>0.9 m</b> tall has its bottom at eye level. From <b>3 m</b> away, what is the viewing angle θ, to the nearest degree?</p>
      ${D([
        { poly: [[0, 0], [3, 0], [3, 0.9]], fill: true }, { seg: [3, 0, 3, 0.9] }, { seg: [3.06, 0, 3.06, 0.9] }, { angle: [3, 0, 90, 180], right: true, r: 0.15 },
        { angle: [0, 0, 0, 16.7], label: 'θ', r: 0.75 }, { point: [0, 0] },
        { label: '3 m', at: [1.5, -0.3] }, { label: '0.9 m', at: [3.2, 0.45], anchor: 'start' }, { label: 'sign', at: [3.2, 0.95], anchor: 'start' }
      ], 'A sign 0.9 m tall seen from 3 m away, with its bottom at eye level', 80)}
      ${steps(
        `<p><strong>The sign is O and the distance is A</strong>, so use tan.</p>
         ${sum('tan θ = 0.9/3 = 0.3<br>θ = tan⁻¹(0.3) = 16.69... ≈ 17°')}`,
        `<p><strong>Going the other way:</strong> for a viewing angle of 10°, the distance is on the bottom.</p>
         ${sum('tan 10° = 0.9/x<br>x = 0.9 ÷ tan 10° = 5.104... ≈ 5.10 m')}
         ${ans('17 and 5.10')}`
      )}
      ${tip('Try a few distances: the closer you stand, the bigger the angle. It is the same triangle each time; only the distance changes.')}`,

    // =====================================================================
    // Year 9 3I Applying trigonometry
    // =====================================================================
    // y9-3I Q1, Q2, Q3, Q14: angles of elevation
    'y9-3i-elevation': `
      <p class="hp-tag">Worked example: from <b>40 m</b> away, the angle of elevation of the top of a tree is <b>33°</b>. How tall is the tree, to the nearest metre?</p>
      ${D([
        { seg: [-0.5, 0, 5, 0] }, { poly: [[0, 0], [4, 0], [4, 2.598]], fill: true }, { seg: [0, 0, 4, 2.598], dash: true },
        { angle: [4, 0, 90, 180], right: true, r: 0.25 }, { angle: [0, 0, 0, 33], label: '33°', r: 0.75 }, { point: [0, 0] },
        { label: '40 m', at: [2, -0.4] }, { label: 'h', at: [4.2, 1.3], anchor: 'start' }, { label: 'line of sight', at: [1.6, 1.75], anchor: 'end' }
      ], 'A tree of height h seen from 40 m away at an angle of elevation of 33°', 50)}
      ${steps(
        `<p><strong>The angle of elevation is measured up from the horizontal.</strong> The height is O and the ground distance is A, so use tan.</p>`,
        `<p><strong>Height on top: multiply.</strong></p>
         ${sum('tan 33° = h/40<br>h = 40 × tan 33° = 25.976... ≈ 26 m')}
         ${ans('26')}`,
        `<p><strong>Distance unknown instead?</strong> It goes on the bottom. A 60 m tower at an elevation of 27°:</p>
         ${sum('d = 60 ÷ tan 27° = 117.75... ≈ 118 m')}`
      )}
      <p><strong>Eyes above the ground?</strong> The triangle starts at eye level. Find the height above your eyes, then add your eye height: with eyes 1.5 m up, the tree is 25.976... + 1.5 = 27.48 m tall.</p>
      ${tip('Draw the horizontal line first, then the angle. Elevation: you look up. Depression: you look down.')}`,

    // y9-3I Q4, Q5, Q6, Q7: angles of depression
    'y9-3i-depression': `
      <p class="hp-tag">Worked example: from the top of a <b>36 m</b> cliff, the angle of depression of a boat is <b>24°</b>. How far is the boat from the foot of the cliff, to the nearest metre?</p>
      ${D([
        { poly: [[0, 0], [8.08, 0], [0, 3.6]], fill: true }, { seg: [0, 3.6, 8.08, 3.6], dash: true },
        { angle: [0, 0, 0, 90], right: true, r: 0.3 }, { angle: [0, 3.6, 336, 360], label: '24°', r: 1.6 }, { angle: [8.08, 0, 156, 180], label: '24°', r: 1.6 },
        { point: [8.08, 0], name: 'boat', pos: 'e' },
        { label: '36 m', at: [-0.2, 1.8], anchor: 'end' }, { label: 'd', at: [4, -0.45] }
      ], 'A cliff 36 m high with the angle of depression 24° at the top and the equal angle 24° at the boat', 34)}
      ${steps(
        `<p><strong>The angle of depression is measured down from the horizontal.</strong> The dashed horizontal and the sea are parallel, so the angle at the boat is also 24° (alternate angles).</p>`,
        `<p><strong>At the boat, 36 is O and d is A.</strong></p>
         ${sum('tan 24° = 36/d<br>d = 36 ÷ tan 24° = 80.85... ≈ 81 m')}
         ${ans('81')}`,
        `<p><strong>Finding the angle instead?</strong> A boat 150 m out from the same cliff:</p>
         ${sum('θ = tan⁻¹(36 ÷ 150) = 13.49...° ≈ 13°')}`
      )}
      ${tip('Move the angle of depression down into the triangle, at the bottom. The angle between the line of sight and the cliff is the other acute angle, not this one.')}`,

    // y9-3I Q8, Q11, Q12, Q13: roofs, poles and swings
    'y9-3i-roof': `
      <p class="hp-tag">Worked example: a roof is pitched at <b>25°</b>. The house is <b>7200 mm</b> wide and the eaves stick out <b>400 mm</b> on each side. How long is one sloping edge, from the ridge to the end of the eave?</p>
      ${D([
        { poly: [[0, 0], [7.2, 0], [7.2, 2.5], [0, 2.5]], fill: true }, { poly: [[-0.4, 2.313], [3.6, 4.179], [7.6, 2.313]], fill: true },
        { seg: [3.6, 4.179, 3.6, 2.313], dash: true }, { seg: [-0.4, 2.313, 3.6, 2.313], dash: true }, { angle: [3.6, 2.313, 90, 180], right: true, r: 0.25 },
        { angle: [-0.4, 2.313, 0, 25], label: '25°', r: 1.1 },
        { dim: [0, 0, 7.2, 0], label: '7200 mm', off: -0.5 }, { label: '400 mm', at: [-0.55, 2.05], anchor: 'end' }, { label: '400 mm', at: [7.75, 2.05], anchor: 'start' }, { label: '', at: [-2.3, 2] }, { label: '', at: [9.5, 2] }
      ], 'A house 7200 mm wide with a 25° roof and 400 mm eaves on each side', 32)}
      ${steps(
        `<p><strong>Make a right-angled triangle under one side of the roof</strong>: from the ridge straight down to eave level, then across to the end of the eave.</p>
         ${sum('across = 7200 ÷ 2 + 400 = 3600 + 400 = 4000 mm')}`,
        `<p><strong>The sloping edge is H and the across distance is A.</strong></p>
         ${sum('cos 25° = 4000/s<br>s = 4000 ÷ cos 25° = 4413.5... ≈ 4414 mm')}
         ${ans('4414')}`,
        `<p><strong>Walls (or poles) of different heights?</strong> The difference in heights is O and the gap is A. Walls of 2.4 m and 3.1 m, 4 m apart, give a pitch of tan⁻¹(0.7 ÷ 4) = 9.92...° ≈ 10°.</p>`
      )}
      <p><strong>A swing:</strong> a 2.5 m chain pulled back 30° from the vertical reaches 2.5 × cos 30° = 2.165 m below the top bar, so the seat has risen 2.5 − 2.165 = 0.335 m.</p>
      ${tip('Convert mixed units first. Only the difference in heights goes into the triangle, never the full heights.')}`,

    // y9-3I Q9, Q10, Q16, Q17, Q18: climbing planes, roads and speeds
    'y9-3i-climb': `
      <p class="hp-tag">Worked example: a plane takes off and climbs at <b>9°</b> to the horizontal. It flies <b>6 km</b> along its flight path. How high is it, to the nearest metre?</p>
      ${D([
        { seg: [-0.5, 0, 6.6, 0] }, { poly: [[0, 0], [5.926, 0], [5.926, 0.939]], fill: true }, { seg: [5.926, 0.939, 5.926, 0], dash: true },
        { angle: [5.926, 0, 90, 180], right: true, r: 0.2 }, { angle: [0, 0, 0, 9], label: '9°', r: 1.6 },
        { label: '6 km', at: [2.9, 0.75] }, { label: 'h', at: [6.1, 0.47], anchor: 'start' }
      ], 'A flight path 6 km long climbing at 9° with height h', 50)}
      ${steps(
        `<p><strong>The flight path is H and the height is O</strong>, so use sin.</p>
         ${sum('h = 6 × sin 9° = 0.93860... km')}`,
        `<p><strong>Change units as asked.</strong> 1 km = 1000 m.</p>
         ${sum('0.93860... × 1000 = 938.60... ≈ 939 m')}
         ${ans('939')}`,
        `<p><strong>A gradient of "1 in 5"</strong> means up 1 for every 5 across, so O = 1 and A = 5:</p>
         ${sum('θ = tan⁻¹(1 ÷ 5) = 11.30...° ≈ 11°')}`
      )}
      <p><strong>Speed and time:</strong> distance = speed × time, with the time in hours. 180 km/h for 20 minutes is 180 × 20/60 = 60 km. <strong>Overhead, then later at an angle:</strong> a plane 900 m up, seen at an elevation of 50°, is 900 ÷ tan 50° = 755.2 m away horizontally. <strong>Clearing a peak:</strong> work out the height gained over the horizontal distance, add the starting height, and compare.</p>
      ${tip('Along the path is H; along the ground is A. Decide which one you are given before choosing sin, cos or tan.')}`,

    // y9-3I Q15: rules with letters
    'y9-3i-rules': `
      <p class="hp-tag">Worked example: a right-angled triangle has hypotenuse <b>k</b> and an angle <b>θ</b>. Write expressions for the other two sides and for the area.</p>
      ${tri(rtA(36, 5), 'C', { AB: 'k', BC: 'O', AC: 'A' }, { A: 'θ' }, 'A right-angled triangle with hypotenuse k and angle θ', 40)}
      ${steps(
        `<p><strong>Use the ratios with k on the bottom</strong>, then multiply by k.</p>
         ${sum('sin θ = O/k, so O = k sin θ<br>cos θ = A/k, so A = k cos θ')}`,
        `<p><strong>Area = ½ × base × height.</strong> The two shorter sides are the base and height.</p>
         ${sum('area = ½ × k cos θ × k sin θ = k² sin θ cos θ / 2')}
         ${ans('k² sin θ cos θ / 2')}`,
        `<p><strong>Check with numbers.</strong> k = 10 and θ = 30° give 100 × 0.5 × 0.8660... ÷ 2 = 21.65..., and the sides 8.660... and 5 give ½ × 8.660... × 5 = 21.65... ✓.</p>`
      )}
      ${tip('Write the trig ratio straight after the letter it multiplies: k sin θ means k × sin θ.')}`,

    // =====================================================================
    // Year 9 3J Bearings
    // =====================================================================
    // y9-3J Q1, Q11: reading true bearings and bearings back
    'y9-3j-read': `
      <p class="hp-tag">Worked example: write the true bearing of A from O, and of O from A.</p>
      ${compass(2.4, [
        { seg: [0, 0, ...bdir(320, 2)] }, { point: bdir(320, 2), name: 'A', pos: 'nw' }, { label: 'O', at: [0.3, -0.35], anchor: 'start' },
        { angle: [0, 0, 90, 130], label: '40°', r: 0.7 }
      ], 'A compass at O; A is 40° to the west of north')}
      ${steps(
        `<p><strong>True bearings start at north and turn clockwise.</strong> A is 40° to the west of north, so it is 40° short of a full turn.</p>
         ${sum('360° − 40° = 320°')}
         ${ans('320°T')}`,
        `<p><strong>The bearing back (O from A) points the opposite way.</strong> Add or subtract 180°.</p>
         ${sum('320° − 180° = 140°')}`,
        `<p><strong>Another one.</strong> A point 20° west of south is 180° + 20° = 200°T, and the bearing back is 200° − 180° = 020°T.</p>`
      )}
      ${chips(['N = 000°'], ['E = 090°'], ['S = 180°'], ['W = 270°'])}
      ${tip('Type a bearing with three digits, like 020 or 020°T. Going back: under 180°, add 180°; 180° or more, subtract 180°.')}`,

    // y9-3J Q2 to Q8, Q13, Q14: how far east, west, north or south
    'y9-3j-trig': `
      <p class="hp-tag">Worked example: a boat sails <b>9 km</b> on a true bearing of <b>058°</b>. How far east and how far north of its start is it, to two decimal places?</p>
      ${compass(2.6, [
        { poly: [[0, 0], [0, 1.272], [2.035, 1.272]], fill: true }, { seg: [0, 0, 2.035, 1.272] },
        { seg: [0, 1.272, 2.035, 1.272], dash: true }, { angle: [0, 1.272, 270, 360], right: true, r: 0.2 },
        { point: [2.035, 1.272], name: 'B', pos: 'ne' }, { angle: [0, 0, 32, 90], label: '58°', r: 0.5 },
        { label: '9 km', at: [1.15, 0.45], anchor: 'start' }, { label: 'east', at: [1.0, 1.5] }
      ], 'The boat B is 9 km from the start on a bearing of 058°, with a right-angled triangle drawn north then east', 48)}
      ${steps(
        `<p><strong>Draw a right-angled triangle from the start</strong>: north, then east. The angle at the start is the bearing, 58°, measured from north.</p>`,
        `<p><strong>East is O (across from 58°) and north is A.</strong></p>
         ${sum('east = 9 × sin 58° = 7.632... ≈ 7.63 km<br>north = 9 × cos 58° = 4.769... ≈ 4.77 km')}
         ${ans('7.63 and 4.77')}`,
        `<p><strong>Bearings past 90°:</strong> use the angle to the nearest north or south line. On 140°, the angle from south is 180° − 140° = 40°, so 12 km on 140° is 12 × sin 40° = 7.71 km east and 12 × cos 40° = 9.19 km south.</p>`
      )}
      <p><strong>Two legs?</strong> Find the east (and north) parts of each leg and add them. For a straight-line distance at the end, use Pythagoras on the totals.</p>
      ${tip('Sketch a compass at every starting point. sin goes with the side across from the angle, cos with the side next to it.')}`,

    // y9-3J Q9, Q10: turning bearings into angles in a triangle
    'y9-3j-triangle': `
      <p class="hp-tag">Worked example: Sam walks <b>5 km</b> due north, then on a true bearing of <b>125°</b> until he is due east of his start. How far from his start is he, to one decimal place?</p>
      ${D([
        { poly: [[0, 0], [0, 5], [7.14, 0]], fill: true }, { angle: [0, 0, 0, 90], right: true, r: 0.45 },
        { seg: [0, 5, 0, 6.5], arrow: 'end' }, { label: 'N', at: [0, 6.9] }, { angle: [0, 5, 270, 325], label: '55°', r: 0.9 },
        { point: [0, 0], name: 'start', pos: 'sw' }, { point: [0, 5], name: 'turn', pos: 'w' }, { point: [7.14, 0], name: 'end', pos: 'se' },
        { label: '5 km', at: [-0.2, 2.5], anchor: 'end' }, { label: 'd', at: [3.57, -0.6] }
      ], 'Sam walks 5 km north to the turn, then south-east to a point due east of the start', 30)}
      ${steps(
        `<p><strong>Turn the bearing into an angle in the triangle.</strong> At the turn, the path heads 125° from north, so it makes 180° − 125° = 55° with the line back south.</p>`,
        `<p><strong>5 km is A (next to the 55°) and d is O.</strong></p>
         ${sum('tan 55° = d/5<br>d = 5 × tan 55° = 7.140... ≈ 7.1 km')}
         ${ans('7.1')}`,
        `<p><strong>Check the sketch.</strong> 55° is more than 45°, so d should be a bit longer than 5 ✓.</p>`
      )}
      ${tip('Use north-south lines and "angles on a straight line add to 180°" to move each bearing inside the triangle. Read whether the answer is wanted in km or m.')}`,

    // y9-3J Q12: bearings round a triangle
    'y9-3j-angles': `
      <p class="hp-tag">Worked example: the bearing of Q from P is <b>120°</b>. R is due south of P and ∠PQR = <b>65°</b>. Find the bearing of P from Q, then of R from Q, then of Q from R.</p>
      ${D([
        { poly: [[0, 0], [3.464, -2], [0, -4.426]], fill: true }, { seg: [0, 0, 0, 1.2], arrow: 'end' }, { label: 'N', at: [0, 1.55] },
        { seg: [3.464, -2, 3.464, -0.8], arrow: 'end', thin: true }, { label: 'N', at: [3.464, -0.45] },
        { angle: [0, 0, 330, 90], label: '120°', r: 0.5 }, { angle: [3.464, -2, 150, 215], label: '65°', r: 0.6 },
        { point: [0, 0], name: 'P', pos: 'w' }, { point: [3.464, -2], name: 'Q', pos: 'e' }, { point: [0, -4.426], name: 'R', pos: 'sw' }
      ], 'P with Q on a bearing of 120°, R due south of P, and angle PQR of 65°', 40)}
      ${steps(
        `<p><strong>P from Q is the bearing back.</strong></p>
         ${sum('120° + 180° = 300°')}`,
        `<p><strong>Standing at Q and facing P (300°), R is 65° further anticlockwise</strong>, so subtract.</p>
         ${sum('300° − 65° = 235°')}`,
        `<p><strong>Q from R is the bearing back again.</strong></p>
         ${sum('235° − 180° = 055°')}
         ${ans('300°, 235°, 055°')}`
      )}
      ${tip('Draw a small north line at every point you stand at. Clockwise from your current direction: add. Anticlockwise: subtract.')}`
  });
})();
