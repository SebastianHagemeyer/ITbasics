/* H3 "How do I work this out?" panels for Chapter 7.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 7A to 7L. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  // Diagram helpers. Every line direction is worked out with trig, so each angle is drawn to scale.
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const rad = (a) => a * Math.PI / 180;
  const P = (deg, len, o = [0, 0]) => [r3(o[0] + len * Math.cos(rad(deg))), r3(o[1] + len * Math.sin(rad(deg)))];
  const S = (a, b, x) => Object.assign({ seg: [a[0], a[1], b[0], b[1]] }, x || {});
  const A = (v, a1, a2, label, r) => ({ angle: [v[0], v[1], r3(a1), r3(a2)], label: label || '', r: r || 0.6 });
  const RT = (v, a1, a2) => ({ angle: [v[0], v[1], a1, a2], right: true });
  const N = (p, name, pos) => ({ point: p, name, pos: pos || 'ne' });
  const T = (p, label) => ({ label, at: p });
  const D = (items, unit) => fig({ kind: 'diagram', unit: unit || 36, items });
  // Unlabelled dots on a plane: each needs its own key, so the keys are invisible zero-width spaces.
  const dots = (vals) => Object.fromEntries(vals.map((v, i) => ['​'.repeat(i + 1), v]));
  const tbl = (head, ...rows) => `<div class="hp-table" role="table"><div class="hp-tr hp-th" role="row">${head.map(h => `<span role="columnheader">${h}</span>`).join('')}</div>${rows.map(r => `<div class="hp-tr" role="row">${r.map(c => `<span role="cell">${c}</span>`).join('')}</div>`).join('')}</div>`;
  // Unit cubes in an isometric view (i to the front right, j to the front left, k up), drawn back to front.
  const iso = (i, j, k) => [r3(0.866 * (i - j)), r3(-0.5 * (i + j) + k)];
  const cubes = (list) => list.slice().sort((p, q) => (p[0] + p[1] + p[2]) - (q[0] + q[1] + q[2])).flatMap(([i, j, k]) => [
    { poly: [iso(i, j, k + 1), iso(i + 1, j, k + 1), iso(i + 1, j + 1, k + 1), iso(i, j + 1, k + 1)], fill: true },
    { poly: [iso(i + 1, j, k), iso(i + 1, j + 1, k), iso(i + 1, j + 1, k + 1), iso(i + 1, j, k + 1)], fill: true },
    { poly: [iso(i, j + 1, k), iso(i + 1, j + 1, k), iso(i + 1, j + 1, k + 1), iso(i, j + 1, k + 1)], fill: true }]);
  // Regular polygon: n corners on a circle of radius r, first corner at angle a0.
  const reg = (n, r, a0, o = [0, 0]) => Array.from({ length: n }, (_, k) => P(a0 + 360 * k / n, r, o));
  // Apex of a triangle on base b0-b1 with base angles p (at b0) and q (at b1), base along the x-axis.
  const apex = (b0, b1, p, q) => { const c = b1[0] - b0[0], s = c * Math.sin(rad(q)) / Math.sin(rad(180 - p - q)); return P(p, s, b0); };

  // 7D: a triangle between parallel lines (a pair of Z shapes)
  const dV = [0, 0], dL = [r3(3 / Math.tan(rad(137))), 3], dR = [r3(3 / Math.tan(rad(69))), 3];
  // 7D: a bend between parallel lines
  const bE = [3, 1.6], bD = P(154, 1.4 / Math.sin(rad(154)), bE), bF = P(233, -1.6 / Math.sin(rad(233)), bE);
  // 7G: triangle with an exterior angle, and a triangle between parallel lines
  const gA = [0, 0], gB = [5, 0], gC = apex(gA, gB, 46, 51);
  const gT = [0, 3], gTA = P(242, 3 / Math.sin(rad(62)), gT), gTB = P(331, 3 / Math.sin(rad(29)), gT);
  const sA = [0, 0], sB = [5, 0], sC = apex(sA, sB, 47, 61);
  // 7C: trapezium with base angles 71° and 76°
  const zTL = P(71, 2.5), zTR = [r3(5 + (zTL[1] / Math.sin(rad(104))) * Math.cos(rad(104))), zTL[1]];
  // 7F: rhombus with a 57° angle
  const rB = [3, 0], rC = P(57, 3, rB), rD = P(57, 3);
  // 7L: net of a pentagonal prism (five 1 by 1.6 rectangles and two regular pentagons)
  const pent = (start, sgn) => { const pts = [start]; let p = start; for (let k = 0; k < 4; k++) { p = P(sgn * 72 * k, 1, p); pts.push(p); } return pts; };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 7A Points, lines, intervals and angles
    // =====================================================================
    // 7A Q1, Q2, Q3: naming segments, lines, rays, points and angles
    '7a-name': `
      <p class="hp-tag">Worked example: name the angle marked with the arc.</p>
      ${D([S([0, 0], P(15, 2.6)), S([0, 0], P(55, 2.6)), S([0, 0], P(100, 2.6)), A([0, 0], 15, 100, '', 0.75),
        N([0, 0], 'E', 'sw'), N(P(15, 2.6), 'D', 'e'), N(P(55, 2.6), 'A', 'ne'), N(P(100, 2.6), 'T', 'n')])}
      ${steps(
        `<p><strong>Find the vertex.</strong> It is the corner point where the arms meet, here E. The vertex always goes in the middle.</p>`,
        `<p><strong>Follow the two arms the arc touches</strong> out to a point on each: D and T. Skip the arm inside the arc (EA), because the arc stretches past it.</p>
         ${sum('D, then E, then T')}
         ${ans('∠DET')}`,
        `<p><strong>Type the three letters</strong> with the vertex in the middle: DET. Reading it backwards, TED, names the same angle.</p>`
      )}
      ${chips(['point D: a dot'], ['segment DE: two ends, no arrows'], ['ray DE: starts at D, arrow past E'], ['line DE: arrows both ends'], ['plane: a flat surface that never ends'])}
      ${tip('For a ray, type the starting point first. To name an object, type its kind then its letters, like ray DE.')}`,

    // 7A Q4, Q5: types of angle
    '7a-types': `
      ${chips(['acute: less than 90°'], ['right: exactly 90°'], ['obtuse: between 90° and 180°'], ['straight: exactly 180°'], ['reflex: between 180° and 360°'], ['revolution: 360°'])}
      <p class="hp-tag">Worked example: what type is a <b>196°</b> angle? What type is the angle marked below?</p>
      ${D([S([0, 0], [2.4, 0]), S([0, 0], P(130, 2.4)), A([0, 0], 130, 360, '', 0.6), N([0, 0], '', 'n')])}
      ${steps(
        `<p><strong>Compare with 180°.</strong> 196 is bigger than 180 but less than 360.</p>
         ${ans('Reflex')}`,
        `<p><strong>For a drawing, look at where the arc goes.</strong> Here the arc goes the long way round, outside the narrow gap. That is more than a straight line, so it is reflex too.</p>`,
        `<p><strong>For a narrow arc,</strong> hold the corner of a page against it. Smaller than the corner is acute, bigger is obtuse.</p>`
      )}
      ${tip('Check the boundaries carefully: 90° is right, not acute, and 180° is straight, not obtuse.')}`,

    // 7A Q6: estimating an angle drawn to scale
    '7a-estimate': `
      <p class="hp-tag">Worked example: a ladder leans against a wall. Choose the closest size: 30°, 70°, 105° or 165°.</p>
      ${D([S([0, 0], [3.6, 0]), S([2.826, 0], [2.826, 3.3]), S([1.8, 0], P(70, 3, [1.8, 0])), S([1.8, 0], P(45, 2, [1.8, 0]), { dash: true }), A([1.8, 0], 0, 70, '?', 0.6), T([2.4, -0.45], 'ground'), T([3.5, 1.8], 'wall')])}
      ${steps(
        `<p><strong>Smaller or bigger than a right angle?</strong> The ladder leans in, so the angle is smaller than 90°. That rules out 105° and 165°.</p>`,
        `<p><strong>Compare with 45°, half a right angle</strong> (the dashed line). The ladder is steeper than that, so the angle is more than 45°.</p>
         ${ans('70°')}`
      )}
      ${tip('Useful benchmarks: 90° is a square corner, 45° is half of it, 180° is a straight line.')}`,

    // 7A Q7, Q8, Q13: collinear points and concurrent lines
    '7a-points': `
      ${fig({ kind: 'diagram', unit: 36, items: [S([-0.6, -0.3], [3.6, 1.8], { dash: true }), N([0, 0], 'D', 'nw'), N([1.5, 0.75], 'E', 'nw'), N([3, 1.5], 'F', 'nw'), N([2.2, -0.5], 'G', 'se')] },
        { kind: 'diagram', unit: 36, items: [S(P(200, 1.8), P(20, 1.8)), S(P(255, 1.8), P(75, 1.8)), S(P(320, 1.8), P(140, 1.8)), N([0, 0], '', 'n')] })}
      ${steps(
        `<p><strong>Collinear means on one straight line.</strong> Lay a ruler through two of the points and see which other point it hits. On the left, D, E and F line up. G does not.</p>
         ${ans('D, E, F')}`,
        `<p><strong>Concurrent means all the lines pass through one point.</strong> On the right, all three lines cross at the same dot, so they are concurrent. If they make a little triangle in the middle, they are not.</p>`,
        `<p><strong>Reasoning questions:</strong> only one straight line goes through two points. So if D, E, F are collinear and E, F, G are collinear, both groups lie on line EF, and all four points are on one line.</p>`
      )}
      ${tip('Type list answers with commas, like D, E, F. When unsure in a reasoning question, draw a few dots and try it.')}`,

    // 7A Q9: counting the angles inside a shape
    '7a-count': `
      <p class="hp-tag">Worked example: count every angle inside this shape.</p>
      ${D([{ poly: [[0, 0], [3.2, 0], [3.6, 2.2], [0.5, 2.6]] }, S([0, 0], [3.6, 2.2]),
        A([0, 0], 0, 31.4, '', 0.55), A([0, 0], 31.4, 79.1, '', 0.75), A([0, 0], 0, 79.1, '', 1.0)])}
      ${steps(
        `<p><strong>Corners that are not split</strong> give one angle each. Two corners here: 2 angles.</p>`,
        `<p><strong>A corner split by a segment</strong> gives each part plus the whole corner: 2 parts + 1 whole = 3 angles. Two corners are split here.</p>
         ${sum('3 + 3 = 6')}`,
        `<p><strong>Add them all.</strong></p>
         ${sum('2 + 6 = 8')}
         ${ans('8')}`
      )}
      ${tip('If a corner is cut into more parts, also count every pair of neighbouring parts joined together, and so on up to the whole corner.')}`,

    // 7A Q10, Q11, Q12: angles on a clock face
    '7a-clock': `
      <p class="hp-tag">Worked example: find the angle between the hands at <b>10:30</b>.</p>
      ${D([{ circle: [0, 0, 2] }, ...Array.from({ length: 12 }, (_, k) => S(P(90 - 30 * k, 1.8), P(90 - 30 * k, 2))),
        T([0, 1.5], '12'), T([1.5, 0], '3'), T([0, -1.5], '6'), T([-1.5, 0], '9'),
        S([0, 0], P(135, 1.1), { arrow: 'end' }), S([0, 0], P(270, 1.6), { arrow: 'end' }), A([0, 0], 135, 270, '?', 0.5)], 40)}
      ${steps(
        `<p><strong>Minute hand:</strong> a full turn of 360° takes 60 minutes, so it moves 6° each minute. At 30 minutes it points at the 6.</p>
         ${sum('30 × 6 = 180° round from the 12')}`,
        `<p><strong>Hour hand:</strong> it moves 30° for each hour, plus half a degree each minute, so at 10:30 it is halfway between the 10 and the 11.</p>
         ${sum('10 × 30 + 30 × 0.5 = 300 + 15 = 315° round from the 12')}`,
        `<p><strong>Take the smaller from the larger.</strong></p>
         ${sum('315 − 180 = 135')}
         ${ans('135')}`
      )}
      ${tip('If your difference is more than 180°, take it away from 360° to get the smaller angle. Each gap between two numbers on a clock is 30°.')}`,

    // 7A Q14, Q15: reflex angles and turning more than a full turn
    '7a-turn': `
      <p class="hp-tag">Worked example: an arrow points straight up and turns <b>290°</b> clockwise. Find the angle between where it ends and where it started.</p>
      ${D([S([0, 0], P(90, 2), { arrow: 'end', dash: true }), S([0, 0], P(160, 2), { arrow: 'end' }), A([0, 0], 160, 90, '', 1.3), A([0, 0], 90, 160, '?', 0.55), T([0.2, 2.35], 'start')])}
      ${steps(
        `<p><strong>Take off full turns first.</strong> 290 is less than 360, so there is nothing to take off. (For 820°, take off 360 twice: 820 − 720 = 100.)</p>`,
        `<p><strong>If it is more than 180°, take it from 360°.</strong> The arrow went most of the way round, so the gap back to the start is the small angle.</p>
         ${sum('360 − 290 = 70')}
         ${ans('70')}`,
        `<p><strong>Reflex partner of an angle:</strong> the two angles at one point make a full turn. If the acute ∠DEF is 37°, the reflex ∠DEF is 360 − 37 = 323°.</p>`
      )}
      ${tip('A turn of 360° puts the arrow back where it started, so only what is left after full turns matters.')}`,

    // 7A Q16: counting segments between points on a line
    '7a-segments': `
      <p class="hp-tag">Worked example: how many segments join pairs of <b>8</b> points on a line?</p>
      ${D([S([0, 0], [7, 0]), ...Array.from({ length: 8 }, (_, k) => N([k, 0], '', 'n'))], 36)}
      ${steps(
        `<p><strong>Count from each point to the points after it</strong>, so no segment is counted twice. The first point joins 7 others, the next joins 6 new ones, and so on.</p>
         ${sum('7 + 6 + 5 + 4 + 3 + 2 + 1 = 28')}`,
        `<p><strong>Check another way.</strong> Each of the 8 points joins to 7 others, but that counts every segment twice (DE and ED).</p>
         ${sum('8 × 7 = 56, then 56 ÷ 2 = 28')}
         ${ans('28')}`
      )}
      ${tip('For a rule with n, work out a few small cases, describe your steps in words, then write the same steps with n. Type a rule with brackets and /, for example 3(n+1)/2.')}`,

    // =====================================================================
    // 7B Adjacent and vertically opposite angles
    // =====================================================================
    // 7B Q1, Q2: angles in a right angle or on a straight line
    '7b-adjacent': `
      ${fig({ kind: 'diagram', unit: 36, items: [S([0, 0], [2.6, 0]), S([0, 0], [0, 2.6]), S([0, 0], P(37, 2.6)), RT([0, 0], 0, 90), A([0, 0], 0, 37, '37°', 1.1), A([0, 0], 37, 90, 'a°', 1.1)] },
        { kind: 'diagram', unit: 36, items: [S([-2.6, 0], [2.6, 0]), S([0, 0], P(21, 2.4)), S([0, 0], P(111, 2.4)), A([0, 0], 0, 21, '21°', 1.1), RT([0, 0], 21, 111), A([0, 0], 111, 180, 'a°', 0.8)] })}
      <p class="hp-tag">Worked examples: find <b>a</b> in each diagram.</p>
      ${steps(
        `<p><strong>Spot what the parts make together.</strong> On the left they fill a right angle, 90°. On the right they sit on a straight line, 180°.</p>`,
        `<p><strong>Left:</strong> take the known part from 90.</p>
         ${sum('a = 90 − 37 = 53')}
         ${ans('53')}`,
        `<p><strong>Right:</strong> take every known part from 180. The square mark is 90°.</p>
         ${sum('a = 180 − 90 − 21 = 69')}
         ${ans('69')}`
      )}
      ${tip('Check by adding: the parts must come back to 90 or 180 exactly.')}`,

    // 7B Q3: vertically opposite angles and angles around a point
    '7b-around': `
      ${fig({ kind: 'diagram', unit: 36, items: [S([-2.4, 0], [2.4, 0]), S(P(307, 2.4), P(127, 2.4)), A([0, 0], 0, 127, '127°', 0.6), A([0, 0], 180, 307, 'a°', 0.6)] },
        { kind: 'diagram', unit: 36, items: [S([0, 0], [2.4, 0]), S([0, 0], [0, 2.4]), S([0, 0], P(257, 2.4)), RT([0, 0], 0, 90), A([0, 0], 90, 257, '167°', 0.6), A([0, 0], 257, 360, 'a°', 0.8)] })}
      <p class="hp-tag">Worked examples: find <b>a</b> in each diagram.</p>
      ${steps(
        `<p><strong>Left: two straight lines cross.</strong> The angles opposite each other at the cross (vertically opposite) are equal.</p>
         ${ans('127')}`,
        `<p><strong>Right: the angles go all the way round a point,</strong> so they add to 360°.</p>
         ${sum('a = 360 − 90 − 167 = 103')}
         ${ans('103')}`
      )}
      ${tip('An arc that goes round the outside is a reflex angle. Find it by taking the other angles from 360.')}`,

    // 7B Q4, Q10: complementary and supplementary
    '7b-pairs': `
      ${chips(['complementary: add to 90°'], ['supplementary: add to 180°'])}
      <p class="hp-tag">Worked example: are these pairs complementary, supplementary or neither?</p>
      ${steps(
        `<p><strong>Add the two angles.</strong></p>
         ${sum('39 + 51 = 90<br>97 + 83 = 180<br>58 + 37 = 95')}`,
        `<p><strong>Match the total.</strong> 90 means complementary, 180 means supplementary, anything else is neither.</p>
         ${ans('complementary, supplementary, neither')}`
      )}
      ${tip('To remember: C comes before S in the alphabet, and 90 comes before 180. For "is it possible" questions, think about the biggest and smallest sizes each kind of angle can be.')}`,

    // 7B Q5: writing a perpendicular statement
    '7b-perp': `
      <p class="hp-tag">Worked example: write a statement for these perpendicular segments.</p>
      ${D([S(P(230, 1.9), P(50, 1.9)), S(P(320, 1.9), P(140, 1.9)), RT([0, 0], 50, 140),
        N(P(230, 1.9), 'E', 'sw'), N(P(50, 1.9), 'F', 'ne'), N(P(140, 1.9), 'G', 'nw'), N(P(320, 1.9), 'H', 'se')])}
      ${steps(
        `<p><strong>Check for the square mark.</strong> It shows the segments meet at 90°, so they are perpendicular.</p>`,
        `<p><strong>Name each segment by its two end letters</strong> and put the ⊥ sign between them. It means "is perpendicular to".</p>
         ${ans('EF ⊥ GH')}`
      )}
      ${tip('No ⊥ key? Type the word perp instead: EF perp GH.')}`,

    // 7B Q6, Q7: several angles, and checking whether sizes are possible
    '7b-multi': `
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${D([S([-2.6, 0], [2.6, 0]), S([0, 0], P(58, 2.4)), S([0, 0], P(137, 2.4)), A([0, 0], 0, 58, '58°', 0.8), A([0, 0], 58, 137, 'a°', 0.8), A([0, 0], 137, 180, '43°', 1.1)])}
      ${steps(
        `<p><strong>All three angles sit on one straight line,</strong> so together they make 180°.</p>`,
        `<p><strong>Take both known angles from 180.</strong></p>
         ${sum('a = 180 − 58 − 43 = 79')}
         ${ans('79')}`,
        `<p><strong>Is a diagram possible?</strong> Test the rule it must follow. Angles of 133° and 49° marked on a straight line: 133 + 49 = 182, not 180, so that is <b>not possible</b>.</p>`
      )}
      ${tip('The rules to test: a right angle makes 90, a straight line 180, all the way round 360, and vertically opposite angles are equal.')}`,

    // 7B Q8: angles written with a letter
    '7b-algebra': `
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${D([S([-2.6, 0], [2.6, 0]), S([0, 0], P(107, 2.4)), A([0, 0], 0, 107, '', 1.3), T(P(28, 2.4), '(a + 34)°'), A([0, 0], 107, 180, 'a°', 0.8)])}
      ${steps(
        `<p><strong>Write the rule.</strong> The two angles sit on a straight line.</p>
         ${sum('a + 34 + a = 180')}`,
        `<p><strong>Collect the a's.</strong> a + a is 2a.</p>
         ${sum('2a + 34 = 180<br>2a = 180 − 34 = 146')}`,
        `<p><strong>Divide by 2.</strong></p>
         ${sum('a = 146 ÷ 2 = 73')}
         ${ans('73')}`
      )}
      ${tip('6a means 6 lots of a, so a and 6a together make 7a. Check by putting your answer back in: 73 + 34 + 73 = 180.')}`,

    // 7B Q9: sharing a full turn in parts
    '7b-share': `
      <p class="hp-tag">Worked example: Mo, Liz and Kai share a round cake. Liz gets 3 times as much as Mo, and Kai gets 4 times as much as Liz. Find the angle of Mo's slice.</p>
      ${fig({ kind: 'sector', parts: [['Mo', 1], ['Liz', 3], ['Kai', 12]] })}
      ${steps(
        `<p><strong>Give the smallest share 1 part</strong> and build the others from it.</p>
         ${sum('Mo 1 part, Liz 3 parts, Kai 4 × 3 = 12 parts')}`,
        `<p><strong>Add the parts.</strong> They share the full turn of 360°.</p>
         ${sum('1 + 3 + 12 = 16 parts')}`,
        `<p><strong>Find one part.</strong></p>
         ${sum('360 ÷ 16 = 22.5')}
         ${ans('22.5')}`
      )}
      ${tip('Check: 22.5 × 16 = 360. Two people who get the same amount each get the same number of parts.')}`,

    // 7B Q11, Q12: writing a rule, and how few angles you need
    '7b-rule': `
      <p class="hp-tag">Worked example: write a rule connecting a, b, c and d.</p>
      ${D([S([0, 0], P(10, 2.2)), S([0, 0], P(95, 2.2)), S([0, 0], P(170, 2.2)), S([0, 0], P(260, 2.2)),
        A([0, 0], 10, 95, 'a°', 0.8), A([0, 0], 95, 170, 'b°', 0.8), A([0, 0], 170, 260, 'c°', 0.8), A([0, 0], 260, 370, 'd°', 0.8)])}
      ${steps(
        `<p><strong>Decide what the angles fill.</strong> Here they go all the way round a point: 360°.</p>`,
        `<p><strong>Write the letters added together, equal to that total.</strong></p>
         ${ans('a+b+c+d=360')}`,
        `<p><strong>How few angles do you need?</strong> For two lines crossing, measure one angle. Its opposite partner is equal, and its neighbours are 180 minus it. So 1 angle is enough.</p>`
      )}
      ${tip('Look for a square mark: if the right angle is one of the parts, the letters make the rest, so take 90 from the total.')}`,

    // 7B Q13: turning round a regular polygon
    '7b-turn': `
      <p class="hp-tag">Worked example: you walk once round a regular 16-sided shape. Find the outside angle you turn at each corner, and the inside angle.</p>
      ${steps(
        `<p><strong>Walking once round, you turn a full turn in total:</strong> 360°. In a regular shape every turn is the same.</p>
         ${sum('360 ÷ 16 = 22.5')}`,
        `<p><strong>The outside and inside angle at a corner make a straight line,</strong> so they add to 180°.</p>
         ${sum('180 − 22.5 = 157.5')}
         ${ans('outside 22.5, inside 157.5')}`
      )}
      ${tip('More sides means smaller turns, so the inside angles get closer and closer to 180°.')}`,

    // =====================================================================
    // 7C Transversal and parallel lines
    // =====================================================================
    // 7C Q1, Q2, Q3: naming corresponding, alternate, co-interior and vertically opposite angles
    '7c-name': `
      <p class="hp-tag">Worked example: start from <b>∠FEB</b> (the arc). Name the angle that is corresponding, alternate, co-interior and vertically opposite to it.</p>
      ${D([S([-2.4, 2], [2.8, 2], { arrow: 'both' }), S([-2.4, 0], [2.8, 0], { arrow: 'both' }), { par: [1.5, 2, 1.8, 2] }, { par: [1.5, 0, 1.8, 0] },
        S(P(255, 1.5), P(75, 3.2), { arrow: 'both' }), A([0.536, 2], 255, 360, '', 0.5),
        N([-2, 2], 'A', 'n'), N([2.4, 2], 'B', 'n'), N([-2, 0], 'C', 's'), N([2.4, 0], 'D', 's'),
        N([0.536, 2], 'E', 'nw'), N([0, 0], 'F', 'se'), N(P(75, 2.9), 'G', 'e'), N(P(255, 1.25), 'H', 'w')])}
      ${steps(
        `<p><strong>Corresponding: same position at the other crossing</strong> (an F shape). ∠FEB is below the top line, right of the transversal. The same spot at F is ∠HFD.</p>`,
        `<p><strong>Alternate: between the lines, on opposite sides</strong> (a Z shape): ∠CFE. <strong>Co-interior: between the lines, same side</strong> (a C shape): ∠EFD.</p>`,
        `<p><strong>Vertically opposite: across the same crossing point</strong> (an X): ∠AEG.</p>
         ${ans('∠HFD, ∠CFE, ∠EFD, ∠AEG')}`
      )}
      ${tip('Type an angle as three letters with the vertex in the middle, like HFD. Either order works: DFH is the same angle.')}`,

    // 7C Q4, Q5: finding angles with parallel lines
    '7c-find': `
      <p class="hp-tag">Worked example: find <b>a</b>, <b>b</b> and <b>c</b>.</p>
      ${D([S([-2.6, 2], [2.8, 2], { arrow: 'both' }), S([-2.6, 0], [2.8, 0], { arrow: 'both' }), { par: [1.6, 2, 1.9, 2] }, { par: [1.6, 0, 1.9, 0] },
        S(P(254, 1.2), P(74, 3.3), { arrow: 'both' }), A(P(74, 2 / Math.sin(rad(74))), 0, 74, '74°', 0.6),
        A([0, 0], 0, 74, 'a°', 0.6), A([0, 0], 74, 180, 'b°', 0.6), A([0, 0], 180, 254, 'c°', 0.6)])}
      ${steps(
        `<p><strong>a and 74° are in the same position at each crossing:</strong> corresponding angles are equal.</p>
         ${sum('a = 74')}`,
        `<p><strong>a and b make a straight line,</strong> so they add to 180.</p>
         ${sum('b = 180 − 74 = 106')}`,
        `<p><strong>c is vertically opposite a</strong>, so it is equal to a.</p>
         ${sum('c = 74')}
         ${ans('74, 106, 74')}`
      )}
      ${tip('Equal pairs: corresponding (F), alternate (Z), vertically opposite (X). Co-interior angles (C) are not equal: they add to 180°. Type several answers in order with commas.')}`,

    // 7C Q6: are the lines parallel?
    '7c-test': `
      <p class="hp-tag">Worked example: are the two lines parallel?</p>
      ${D([S([-2.4, 2.2], [2.6, 2.2], { arrow: 'both' }), S(P(178, 2.6), P(358, 2.6), { arrow: 'both' }), S(P(263, 1), P(83, 3.4), { arrow: 'both' }),
        A([0.27, 2.2], 263, 360, '97°', 0.6), A([0, 0], 358, 83, '85°', 0.6)])}
      ${steps(
        `<p><strong>Name the pair.</strong> Both angles are between the lines, on the same side: co-interior.</p>`,
        `<p><strong>Test the rule.</strong> If the lines were parallel, co-interior angles would add to exactly 180°.</p>
         ${sum('97 + 85 = 182')}
         <p>182 is not 180, so the lines are not parallel, even though they look close.</p>
         ${ans('No')}`
      )}
      ${tip('Parallel tests: corresponding angles equal, alternate angles equal, or co-interior angles adding to 180°. Never trust how it looks.')}`,

    // 7C Q7, Q8, Q10, Q11, Q12: parallel lines inside shapes
    '7c-steps': `
      <p class="hp-tag">Worked example: this trapezium has one pair of parallel sides. Find <b>a</b> and <b>b</b>.</p>
      ${D([{ poly: [[0, 0], [5, 0], zTR, zTL] }, { par: [2.3, 0, 2.7, 0] }, { par: [2.4, zTL[1], 2.8, zTL[1]] },
        A([0, 0], 0, 71, '71°', 0.6), A(zTL, 251, 360, 'a°', 0.5), A(zTR, 180, 284, 'b°', 0.5), A([5, 0], 104, 180, '76°', 0.6)])}
      ${steps(
        `<p><strong>Find a pair of parallel lines and a line that crosses both.</strong> The left side crosses the two parallel sides, so 71° and a are co-interior (a C shape).</p>
         ${sum('a = 180 − 71 = 109')}`,
        `<p><strong>Same on the right side:</strong> 76° and b are co-interior.</p>
         ${sum('b = 180 − 76 = 104')}
         ${ans('109, 104')}`
      )}
      ${tip('Two triangles meeting between parallel lines (a bow tie) make a Z: the angles at the two ends of the Z are alternate, so they are equal. Turn the page if it helps you see the F, Z or C.')}`,

    // 7C Q9: counting angles where a transversal crosses parallel lines
    '7c-count': `
      <p class="hp-tag">Worked example: a transversal crosses <b>3</b> parallel lines at right angles. How many angles are formed, and how many different sizes?</p>
      ${D([S([-2, 0], [2, 0], { arrow: 'both' }), S([-2, 1], [2, 1], { arrow: 'both' }), S([-2, 2], [2, 2], { arrow: 'both' }), S([0, -0.8], [0, 2.8], { arrow: 'both' }),
        RT([0, 0], 0, 90), RT([0, 1], 0, 90), RT([0, 2], 0, 90)])}
      ${steps(
        `<p><strong>Each crossing makes 4 angles.</strong></p>
         ${sum('3 crossings × 4 = 12 angles')}`,
        `<p><strong>Sort them by size.</strong> Here every angle is a right angle, so there is just 1 size.</p>
         ${ans('12 angles, 1 size')}`
      )}
      ${tip('When the transversal is slanted, some angles are acute and some obtuse. Use corresponding and vertically opposite angles to see which ones match.')}`,

    // 7C Q14, Q15: angle sums from parallel lines
    '7c-proof': `
      ${fig({ kind: 'diagram', unit: 36, items: [S([-1, 2], [3.2, 2], { arrow: 'both' }), S([-1, 0], [3.2, 0], { arrow: 'both' }), { par: [2.4, 2, 2.7, 2] }, { par: [2.4, 0, 2.7, 0] },
        S([0.4, 2], [2.2, 0]), A([0.4, 2], 312, 360, 'p°', 0.6), A([2.2, 0], 132, 180, 'p°', 0.6)] },
        { kind: 'diagram', unit: 36, items: [{ poly: reg(5, 1.6, 90) }, S(reg(5, 1.6, 90)[0], reg(5, 1.6, 90)[2]), S(reg(5, 1.6, 90)[0], reg(5, 1.6, 90)[3])] })}
      <p class="hp-tag">Worked example: use triangles to find the angle sum of a pentagon.</p>
      ${steps(
        `<p><strong>Know the Z.</strong> Between parallel lines, the two angles in the corners of a Z are alternate angles, so they are equal (left picture). This lets you move an angle from one place to another.</p>`,
        `<p><strong>Split the shape into triangles</strong> by drawing diagonals from one corner, without crossing. A pentagon makes 3 triangles.</p>`,
        `<p><strong>Each triangle's angles add to 180°.</strong></p>
         ${sum('3 × 180 = 540')}
         ${ans('540')}`
      )}
      ${tip('Angles that sit together on a straight line add to 180°. Spot them first, then look for equal angles to swap in.')}`,

    // =====================================================================
    // 7D Solving compound problems with parallel lines
    // =====================================================================
    // 7D Q1, Q2, Q3, Q4: two or more steps
    '7d-steps': `
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${D([S([-4.6, 3], [2.6, 3], { arrow: 'both' }), S([-4.6, 0], [2.6, 0], { arrow: 'both' }), { par: [-4, 3, -3.7, 3] }, { par: [-4, 0, -3.7, 0] },
        S(dV, dL), S(dV, dR), A(dL, 317, 360, '43°', 0.7), A(dR, 180, 249, '69°', 0.6), A(dV, 69, 137, 'a°', 0.6)])}
      ${steps(
        `<p><strong>Move the 43° down.</strong> The left slanted line makes a Z with the parallel lines, so the angle at the bottom, on the left of the slanted line, is also 43° (alternate).</p>`,
        `<p><strong>Move the 69° down</strong> the same way, using the Z on the right: the bottom angle on the right is 69°.</p>`,
        `<p><strong>Now three angles sit on the bottom straight line.</strong></p>
         ${sum('a = 180 − 43 − 69 = 68')}
         ${ans('68')}`
      )}
      ${tip('Write the reason with each step (alternate, straight line, and so on). If the given angle is reflex, take it from 360° first.')}`,

    // 7D Q5, Q6, Q10: the angle at a bend between parallel lines
    '7d-bend': `
      <p class="hp-tag">Worked example: find the size of <b>∠DEF</b>.</p>
      ${D([S([-0.6, 3], [4.6, 3], { arrow: 'both' }), S([-0.6, 0], [4.6, 0], { arrow: 'both' }), { par: [3.7, 3, 4, 3] }, { par: [3.7, 0, 4, 0] },
        S([0.6, 1.6], [4.6, 1.6], { dash: true }), S(bD, bE), S(bE, bF),
        A(bD, 334, 360, '26°', 0.8), A(bF, 0, 53, '53°', 0.6), A(bE, 154, 180, '', 0.7), A(bE, 180, 233, '', 0.55),
        N(bD, 'D', 'n'), N(bE, 'E', 'e'), N(bF, 'F', 's')])}
      ${steps(
        `<p><strong>Draw an extra line through the bend</strong>, parallel to the others (dashed). It cuts ∠DEF into two parts.</p>`,
        `<p><strong>Each part makes a Z with a parallel line,</strong> so each part is an alternate angle: the top part is 26° and the bottom part is 53°.</p>`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('26 + 53 = 79')}
         ${ans('79')}`
      )}
      ${tip('If a part makes a C shape instead of a Z, it is co-interior: take the given angle from 180 first. If the angle at the bend is reflex, take your answer from 360.')}`,

    // 7D Q7: how few angles you need to be told
    '7d-count': `
      <p class="hp-tag">Worked example: two pairs of parallel lines cross. How few angles must you be told to work out every angle at the crossings?</p>
      ${D([S([-0.6, 0], [4.6, 0], { arrow: 'both' }), S([-0.6, 1.6], [4.6, 1.6], { arrow: 'both' }), { par: [3.8, 0, 4.1, 0] }, { par: [3.8, 1.6, 4.1, 1.6] },
        S(P(240, 0.6, [0.6, 0]), P(60, 2.6, [0.6, 0]), { arrow: 'both' }), S(P(240, 0.6, [2.6, 0]), P(60, 2.6, [2.6, 0]), { arrow: 'both' }),
        { par: [1.15, 0.95, 1.3, 1.21], n: 2 }, { par: [3.15, 0.95, 3.3, 1.21], n: 2 }])}
      ${steps(
        `<p><strong>Suppose you know one angle</strong> at one crossing. Its vertically opposite angle is equal, and its neighbours are 180 minus it. That is all four at that crossing.</p>`,
        `<p><strong>Corresponding angles copy those four</strong> to every other crossing, because each pair of lines is parallel.</p>
         ${ans('1')}`
      )}
      ${tip('Lines that are not parallel break the copying. Then you need an extra angle for each new direction.')}`,

    // 7D Q8, Q9: angles written with x or a
    '7d-algebra': `
      <p class="hp-tag">Worked example: find <b>x</b>.</p>
      ${D([S([-2.4, 2], [2.8, 2], { arrow: 'both' }), S([-2.4, 0], [2.8, 0], { arrow: 'both' }), { par: [1.8, 2, 2.1, 2] }, { par: [1.8, 0, 2.1, 0] },
        S(P(256, 0.9), P(76, 3), { arrow: 'both' }), A([0, 0], 0, 76, '76°', 0.6), A(P(76, 2 / Math.sin(rad(76))), 180, 256, '(4x)°', 0.6)])}
      ${steps(
        `<p><strong>Name the pair.</strong> The two angles make a Z, so they are alternate and equal.</p>
         ${sum('4x = 76')}`,
        `<p><strong>Undo the times 4.</strong></p>
         ${sum('x = 76 ÷ 4 = 19')}
         ${ans('19')}`,
        `<p><strong>If the pair is co-interior, add to 180 instead.</strong> For x° and (2x)° as co-interior angles: x + 2x = 3x = 180, so x = 60.</p>`
      )}
      ${tip('Check by putting x back in: 4 × 19 = 76. A bracket like (x + 26)° means 26 more than x.')}`,

    // =====================================================================
    // 7E Classifying and constructing triangles
    // =====================================================================
    // 7E Q1, Q5, Q6, Q7: sides
    '7e-sides': `
      ${chips(['scalene: no equal sides'], ['isosceles: two equal sides'], ['equilateral: three equal sides'])}
      <p class="hp-tag">Worked example: a triangle has sides <b>10 cm</b>, <b>8 cm</b> and <b>10 cm</b>.</p>
      ${D([{ poly: [[0, 0], [8, 0], [4, 9.165]] }, { tick: [0, 0, 4, 9.165] }, { tick: [8, 0, 4, 9.165] }, { dim: [0, 0, 8, 0], label: '8 cm', off: -0.8 },
        { label: '10 cm', at: [1.6, 5], anchor: 'end' }, { label: '10 cm', at: [6.4, 5], anchor: 'start' }], 18)}
      ${steps(
        `<p><strong>Look for equal sides</strong> (the same length, or the same tick marks). Two sides are 10 cm.</p>
         ${ans('Isosceles')}`,
        `<p><strong>Equal sides give equal angles.</strong> The two angles at the ends of the 8 cm base (the base angles) are the same size. If one is 52°, so is the other.</p>`
      )}
      ${tip('In an equilateral triangle all three sides match, so all three angles match too, and they share the 180° of the triangle.')}`,

    // 7E Q2, Q3: angles
    '7e-angles': `
      ${chips(['acute: all angles less than 90°'], ['right: one angle is 90°'], ['obtuse: one angle is more than 90°'])}
      <p class="hp-tag">Worked example: classify this triangle by its sides and by its angles.</p>
      ${D([{ poly: [[0, 0], [5, 0], [2.5, 1.443]] }, { tick: [0, 0, 2.5, 1.443] }, { tick: [5, 0, 2.5, 1.443] }])}
      ${steps(
        `<p><strong>Sides:</strong> two sides have the same tick mark, so they are equal.</p>
         ${sum('by its sides: isosceles')}`,
        `<p><strong>Angles: check the biggest angle.</strong> The top angle is wider than the corner of a page, so it is more than 90°.</p>
         ${sum('by its angles: obtuse')}
         ${ans('Isosceles, Obtuse')}`
      )}
      ${tip('A triangle names itself after its largest angle. If that one is less than 90°, all three are, and it is acute.')}`,

    // 7E Q9, Q11, Q12, Q14: is it possible?
    '7e-possible': `
      <p class="hp-tag">Worked example: can a triangle have <b>two obtuse angles</b>?</p>
      ${steps(
        `<p><strong>Use a fact that every triangle must follow.</strong> The three angles add to 180°.</p>`,
        `<p><strong>Try the smallest obtuse angles you can.</strong> Each is more than 90°.</p>
         ${sum('91 + 91 = 182, already more than 180')}
         <p>There is nothing left for the third angle, so it cannot be done.</p>
         ${ans('No')}`
      )}
      ${tip('To show "yes", sketch one. To show "no", find the rule it breaks: the angle sum is 180°, equal sides give equal angles, and the longest side is opposite the largest angle.')}`,

    // 7E Q13: can the three sides make a triangle?
    '7e-inequality': `
      <p class="hp-tag">Worked example: can a triangle be drawn with sides <b>8 cm</b>, <b>10 cm</b> and <b>20 cm</b>?</p>
      ${D([S([0, 0], [20, 0]), S([0, 0.9], [8, 0.9]), S([10, 0.9], [20, 0.9]), T([10, -1], '20 cm'), T([4, 1.9], '8 cm'), T([15, 1.9], '10 cm'), T([9, 2.6], 'gap')], 18)}
      ${steps(
        `<p><strong>Add the two shorter sides.</strong></p>
         ${sum('8 + 10 = 18')}`,
        `<p><strong>Compare with the longest side.</strong> 18 is less than 20. Even laid flat, the two short sides cannot reach each other, so they cannot meet at a corner.</p>
         ${ans('No')}`
      )}
      ${tip('The two shorter sides must add to MORE than the longest side. With 8, 10 and 15: 18 is more than 15, so that triangle works.')}`,

    // =====================================================================
    // 7F Classifying quadrilaterals and other polygons
    // =====================================================================
    // 7F Q1, Q2, Q3, Q4, Q7: naming polygons, convex or not, regular or not
    '7f-polygon': `
      ${chips(['3 triangle'], ['4 quadrilateral'], ['5 pentagon'], ['6 hexagon'], ['7 heptagon'], ['8 octagon'], ['9 nonagon'], ['10 decagon'], ['11 undecagon'], ['12 dodecagon'])}
      <p class="hp-tag">Worked example: name this polygon. Is it convex? Is it regular?</p>
      ${D([{ poly: [[0, 0.8], [2.4, 0.8], [2.4, 0], [4, 1.4], [2.4, 2.8], [2.4, 2], [0, 2], [0.6, 1.4]] }, A([2.4, 0.8], 270, 180, '', 0.35), A([0.6, 1.4], 225, 135, '', 0.35)])}
      ${steps(
        `<p><strong>Count the sides.</strong> Go round the edge, touching each corner once: 8 sides, so it is an octagon.</p>`,
        `<p><strong>Convex or non-convex?</strong> Look for a dent: an inside angle bigger than 180° (marked). It has two, so it is non-convex.</p>`,
        `<p><strong>Regular?</strong> Only if all sides AND all angles are equal. These are not.</p>
         ${ans('octagon, non-convex, irregular')}`
      )}
      ${tip('A polygon is a flat, closed shape with only straight sides. Anything curved, open or solid is not a polygon. Type a list of letters with commas, like A, C.')}`,

    // 7F Q5, Q6, Q13, Q14: special quadrilaterals
    '7f-quads': `
      ${chips(['parallelogram: 2 pairs of parallel sides'], ['rectangle: a parallelogram with right angles'], ['rhombus: a parallelogram with 4 equal sides'], ['square: right angles and 4 equal sides'], ['trapezium: 1 pair of parallel sides'], ['kite: 2 pairs of equal sides next to each other'])}
      <p class="hp-tag">Worked example: name this quadrilateral.</p>
      ${D([{ poly: [[0, 0], [5, 0], [3.8, 2], [1.2, 2]] }, { par: [2.3, 0, 2.7, 0] }, { par: [2.3, 2, 2.7, 2] }, { tick: [0, 0, 1.2, 2] }, { tick: [5, 0, 3.8, 2] }])}
      ${steps(
        `<p><strong>Read the arrows.</strong> Only the top and bottom have arrows, so there is exactly one pair of parallel sides: a trapezium.</p>`,
        `<p><strong>Read the tick marks.</strong> The two slanted sides are equal. A trapezium with equal slanted sides is an isosceles trapezium.</p>
         ${ans('isosceles trapezium')}`
      )}
      ${tip('For "which shapes have this property", test the property on each shape in turn. Sketch it and check: sides, parallel pairs, angles, then diagonals.')}`,

    // 7F Q8: missing sides and angles in quadrilaterals
    '7f-find': `
      <p class="hp-tag">Worked example: this rhombus has a side of <b>6 cm</b>. Find <b>a</b>, <b>b</b> and <b>c</b>.</p>
      ${D([{ poly: [[0, 0], rB, rC, rD] }, { tick: [0, 0, 3, 0] }, { tick: [3, 0, ...rC] }, { tick: [...rC, ...rD] }, { tick: [...rD, 0, 0] },
        A([0, 0], 0, 57, '57°', 0.6), A(rC, 180, 237, 'a°', 0.6), A(rB, 57, 180, 'b°', 0.45), { dim: [0, 0, 3, 0], label: '6 cm', off: -0.6 }, T([r3(rD[0] + 1.5), r3(rD[1] + 0.45)], 'c cm')])}
      ${steps(
        `<p><strong>Sides:</strong> all four sides of a rhombus are equal.</p>
         ${sum('c = 6')}`,
        `<p><strong>Opposite angles</strong> of a rhombus (and any parallelogram) are equal.</p>
         ${sum('a = 57')}`,
        `<p><strong>Angles next to each other</strong> are co-interior between parallel sides, so they add to 180.</p>
         ${sum('b = 180 − 57 = 123')}
         ${ans('a = 57, b = 123, c = 6')}`
      )}
      ${tip('Rectangles: opposite sides equal and every angle 90°. Kites: the one pair of equal angles sits between the unequal sides.')}`,

    // 7F Q10: diagonals
    '7f-diagonals': `
      <p class="hp-tag">Worked example: how many diagonals does a convex pentagon have? How many can you draw without any crossing?</p>
      ${D([{ poly: reg(5, 1.8, 90) }, ...[[0, 2], [0, 3], [1, 3], [1, 4], [2, 4]].map(([i, j]) => S(reg(5, 1.8, 90)[i], reg(5, 1.8, 90)[j], { dash: true }))])}
      ${steps(
        `<p><strong>From one corner,</strong> you cannot join to itself or to its 2 neighbours (those are sides).</p>
         ${sum('5 − 3 = 2 diagonals from each corner')}`,
        `<p><strong>Count from every corner, then halve,</strong> because each diagonal has two ends and was counted twice.</p>
         ${sum('5 × 2 = 10, then 10 ÷ 2 = 5')}
         ${ans('5')}`,
        `<p><strong>No crossing:</strong> draw them all from one corner, like a fan. That gives 2.</p>`
      )}
      ${tip('Draw it and count carefully. A list or a table for 4, 5, 6 sides helps you spot the pattern.')}`,

    // 7F Q12: true or false about polygons
    '7f-true': `
      <p class="hp-tag">Worked example: true or false? <b>Every rhombus is a regular polygon.</b></p>
      ${steps(
        `<p><strong>Know the definition.</strong> Regular means all sides equal AND all angles equal.</p>`,
        `<p><strong>Hunt for one example that breaks it.</strong> A squashed rhombus has equal sides, but two angles are sharp and two are wide. One such example is enough.</p>
         ${ans('False')}`
      )}
      ${tip('"Every" or "always" needs it to work every time; one counterexample makes it false. Convex means no inside angle is more than 180°.')}`,

    // =====================================================================
    // 7G Angle sum of a triangle
    // =====================================================================
    // 7G Q1, Q2: angle sum of 180°
    '7g-sum': `
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${D([{ poly: [sA, sB, sC] }, A(sA, 0, 47, '47°', 0.7), A(sB, 119, 180, '61°', 0.7), A(sC, 227, 299, 'a°', 0.6)])}
      ${steps(
        `<p><strong>The three angles in a triangle add to 180°.</strong></p>
         ${sum('a + 47 + 61 = 180')}`,
        `<p><strong>Take the two known angles from 180.</strong></p>
         ${sum('a = 180 − 47 − 61 = 72')}
         ${ans('72')}`
      )}
      ${tip('A square mark in a corner is 90°: count it as one of the known angles.')}`,

    // 7G Q3, Q4: isosceles triangles
    '7g-iso': `
      <p class="hp-tag">Worked example: find <b>a</b> in this isosceles triangle.</p>
      ${D([{ poly: [[0, 0], [3, 0], [1.5, 5.231]] }, { tick: [0, 0, 1.5, 5.231] }, { tick: [3, 0, 1.5, 5.231] },
        A([1.5, 5.231], 254, 286, '32°', 1.1), A([0, 0], 0, 74, 'a°', 0.5), A([3, 0], 106, 180, 'a°', 0.5)], 30)}
      ${steps(
        `<p><strong>The angles at the ends of the unmarked side are equal</strong> (base angles). Take the top angle from 180 to find what they share.</p>
         ${sum('180 − 32 = 148')}`,
        `<p><strong>Halve it.</strong></p>
         ${sum('a = 148 ÷ 2 = 74')}
         ${ans('74')}`,
        `<p><strong>Given a base angle instead?</strong> Double it and take from 180. With base angles of 39°: 180 − 39 − 39 = 102 at the top.</p>`
      )}
      ${tip('The equal angles face the equal sides. Look at the tick marks to see which two angles match.')}`,

    // 7G Q5, Q12: exterior angles
    '7g-exterior': `
      <p class="hp-tag">Worked example: find the exterior angle <b>x</b>.</p>
      ${D([{ poly: [gA, gB, gC] }, S(gB, [7, 0], { dash: true }), A(gA, 0, 46, '46°', 0.8), A(gC, 226, 309, '83°', 0.5), A(gB, 0, 129, 'x°', 0.5)])}
      ${steps(
        `<p><strong>Find the inside angle next to x.</strong> The angles of the triangle add to 180.</p>
         ${sum('180 − 46 − 83 = 51')}`,
        `<p><strong>x and the inside angle sit on a straight line,</strong> so they add to 180.</p>
         ${sum('x = 180 − 51 = 129')}
         ${ans('129')}`
      )}
      ${tip('An exterior angle is outside the triangle, between one side and the next side made longer (the dashed line).')}`,

    // 7G Q6, Q7, Q8, Q13: triangles with parallel lines and other angles
    '7g-mixed': `
      <p class="hp-tag">Worked example: find <b>a</b>.</p>
      ${D([S([-3.2, 3], [6.4, 3], { arrow: 'both' }), S([-3.2, 0], [6.4, 0], { arrow: 'both' }), { par: [5, 3, 5.3, 3] }, { par: [5, 0, 5.3, 0] },
        S(gT, gTA), S(gT, gTB), A(gT, 180, 242, '62°', 0.7), A(gT, 242, 331, 'a°', 0.6), A(gTB, 151, 180, '29°', 1.0)])}
      ${steps(
        `<p><strong>Use the parallel lines first.</strong> The 62° angle and the triangle's bottom-left angle make a Z, so they are alternate: the bottom-left angle is 62°.</p>`,
        `<p><strong>Now use the angle sum.</strong> The triangle has 62°, 29° and a.</p>
         ${sum('a = 180 − 62 − 29 = 89')}
         ${ans('89')}`
      )}
      ${tip('Look for Z (alternate), F (corresponding) and C (co-interior) shapes, and for angles on a straight line. With letters, add them up: a and 2a make 3a.')}`,

    // 7G Q9, Q10, Q11: angle sum of a polygon
    '7g-polygon': `
      <p class="hp-tag">Worked example: find the angle sum of a hexagon.</p>
      ${D([{ poly: reg(6, 1.8, 90) }, ...[2, 3, 4].map(j => S(reg(6, 1.8, 90)[0], reg(6, 1.8, 90)[j], { dash: true }))])}
      ${steps(
        `<p><strong>Pick one corner and draw every diagonal from it.</strong> The hexagon splits into 4 triangles.</p>`,
        `<p><strong>Each triangle's angles add to 180°,</strong> and together they make up exactly the hexagon's angles.</p>
         ${sum('4 × 180 = 720')}
         ${ans('720')}`
      )}
      ${tip('Compare the number of triangles with the number of sides for a few shapes. The pattern gives you the rule. Type multiplication of a bracket like 90(n+4).')}`,

    // =====================================================================
    // 7H Symmetry
    // =====================================================================
    // 7H Q1, Q2, Q5, Q9: lines of symmetry and order of rotational symmetry
    '7h-count': `
      <p class="hp-tag">Worked example: give the number of lines of symmetry and the order of rotational symmetry of a regular octagon.</p>
      ${D([{ poly: reg(8, 2, 22.5) }, ...[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map(a => S(P(a, 2.4), P(a + 180, 2.4), { dash: true }))])}
      ${steps(
        `<p><strong>Lines of symmetry:</strong> a fold line where the two halves match exactly. Here there are lines through opposite corners (4) and through the middles of opposite sides (4).</p>
         ${sum('4 + 4 = 8 lines')}`,
        `<p><strong>Rotational symmetry:</strong> turn the shape and count how many times it fits exactly on itself in one full turn. It fits after every eighth of a turn.</p>
         ${sum('order 8')}
         ${ans('8, 8')}`
      )}
      ${tip('Type lines first, then the order, with a comma. A shape that only fits back after a full turn has order 1 (that means no rotational symmetry).')}`,

    // 7H Q3, Q4, Q6, Q10, Q11: symmetry of letters, triangles and quadrilaterals
    '7h-shapes': `
      <p class="hp-tag">Worked example: which of the letters <b>A, D, S, I</b> have rotational symmetry of order 2?</p>
      ${tbl(['Letter', 'Lines of symmetry', 'Order of rotation'], ['A', '1 (up and down)', '1'], ['D', '1 (across)', '1'], ['S', '0', '2'], ['I', '2', '2'])}
      ${steps(
        `<p><strong>Test each letter on its own.</strong> Imagine folding it for lines, and turning it upside down (a half turn) for order 2.</p>`,
        `<p><strong>S and I look the same after a half turn.</strong> A and D do not.</p>
         ${ans('I, S')}`,
        `<p><strong>Is a diagonal a line of symmetry?</strong> Fold along it. In a square, the halves match exactly, so yes.</p>`
      )}
      ${tip('Sketch the shape and try each fold. Tracing paper helps for turning. Type letters with commas.')}`,

    // 7H Q7: completing a shape by reflection
    '7h-complete': `
      <p class="hp-tag">Worked example: complete the shape by reflecting it in the dashed line. How many sides will it have?</p>
      ${D([S([0, -0.5], [0, 4.1], { dash: true }), { poly: [[0, 0], [1.5, 0], [2.2, 1], [2.2, 2], [1.2, 3], [0, 3.6]], open: true },
        { poly: [[0, 0], [-1.5, 0], [-2.2, 1], [-2.2, 2], [-1.2, 3], [0, 3.6]], open: true }])}
      ${steps(
        `<p><strong>Reflect each corner</strong> straight across the mirror line, the same distance on the other side, and join them up.</p>`,
        `<p><strong>Count carefully where the shape meets the mirror.</strong> The bottom side meets it at a right angle, so it and its reflection make one straight side. The top sides meet at a point, so they stay two sides.</p>`,
        `<p><strong>Add up.</strong> 1 bottom side, plus the other 4 sides on each half.</p>
         ${sum('1 + 4 + 4 = 9')}
         ${ans('9')}`
      )}
      ${tip('Two sides only join into one if they line up in a straight line across the mirror.')}`,

    // 7H Q8: is it possible?
    '7h-possible': `
      <p class="hp-tag">Worked example: is it possible to draw a triangle with exactly <b>2</b> lines of symmetry? A hexagon with exactly 2?</p>
      ${steps(
        `<p><strong>Think through every kind.</strong> A scalene triangle has 0 lines, an isosceles has 1 and an equilateral has 3. None has exactly 2.</p>
         ${ans('Triangle: No')}`,
        `<p><strong>To show "yes", sketch one.</strong> Stretch a regular hexagon sideways: it keeps the up-down and across lines only.</p>
         ${ans('Hexagon: Yes')}`
      )}
      ${tip('Try simple sketches first: letters, flags, stretched or squashed regular shapes, and pinwheels.')}`,

    // 7H Q12: planes of symmetry of solids
    '7h-planes': `
      <p class="hp-tag">Worked example: how many planes of symmetry does a rectangular prism have, if none of its faces is a square?</p>
      ${D([{ poly: [[0, 0], [4, 0], [4, 2], [0, 2]] }, { poly: [[0, 2], [4, 2], [5.2, 2.8], [1.2, 2.8]] }, { poly: [[4, 0], [5.2, 0.8], [5.2, 2.8], [4, 2]] },
        S([2, 0], [2, 2], { dash: true }), S([2, 2], [3.2, 2.8], { dash: true }), S([2, 0], [3.2, 0.8], { dash: true }), S([3.2, 0.8], [3.2, 2.8], { dash: true })])}
      ${steps(
        `<p><strong>A plane of symmetry slices the solid into two mirror halves.</strong> Slicing straight down the middle of the length works (dashed).</p>`,
        `<p><strong>Try each direction.</strong> The middle of the length, the middle of the height and the middle of the depth each work: 3. Slicing corner to corner does not, because the faces are not squares.</p>
         ${ans('3')}`
      )}
      ${tip('Square faces, round ends and regular shapes add extra slices: check the diagonals and every direction that matches.')}`,

    // =====================================================================
    // 7I Reflection and rotation
    // =====================================================================
    // 7I Q1, Q2, Q7, Q12: reflecting in an axis
    '7i-reflect': `
      <p class="hp-tag">Worked example: reflect <b>P(−3, 5)</b> in the y-axis, then (separately) in the x-axis.</p>
      ${fig({ kind: 'plane', x: [-4, 4], y: [-6, 6], points: { P: [-3, 5], "P'": [3, 5], "P''": [-3, -5] } })}
      ${steps(
        `<p><strong>In the y-axis</strong> (the up and down line): P is 3 squares to the left of the mirror. Go straight across, at right angles to the mirror, and the same 3 squares past it. The height does not change.</p>
         ${ans('(3, 5)')}`,
        `<p><strong>In the x-axis</strong> (the across line): P is 5 squares above the mirror. Go straight down through it, at right angles, and the same 5 squares past it.</p>
         ${ans('(-3, -5)')}`
      )}
      ${tip('Notice the pattern: reflecting in the y-axis changes the sign of x, and reflecting in the x-axis changes the sign of y. For two reflections in a row, use the first image as the start of the second. Type a point as (x, y), using the minus key.')}`,

    // 7I Q3, Q5: rotating about the origin
    '7i-rotate': `
      <p class="hp-tag">Worked example: rotate <b>R(5, 1)</b> about (0, 0).</p>
      ${fig({ kind: 'plane', x: [-2, 6], y: [-1, 6], points: { R: [5, 1], "R'": [-1, 5] }, path: [[5, 1], [0, 0], [-1, 5]] })}
      ${steps(
        `<p><strong>Join the centre to the point.</strong> This arm goes from (0, 0) to R: 5 right and 1 up.</p>`,
        `<p><strong>Swing the arm 90° anticlockwise around the centre</strong> on a circular arc, keeping its length the same (a pair of compasses or tracing paper helps). After a quarter turn anticlockwise, right has become up and up has become left, so the arm now goes 5 up and 1 left.</p>
         ${ans('(-1, 5)')}`,
        `<p><strong>90° clockwise:</strong> swing the arm the other way: right becomes down, up becomes right, giving (1, −5). <strong>180°:</strong> a half turn points the arm the opposite way, giving (−5, −1).</p>`
      )}
      ${tip('A 270° rotation is three quarter turns, one after another. A full 360° turn lands back on the start. Check that the new arm is the same length as the old one.')}`,

    // 7I Q4, Q8: rotating about another point
    '7i-centre': `
      <p class="hp-tag">Worked example: rotate <b>K(5, 1)</b> by 90° anticlockwise about <b>C(4, −1)</b>.</p>
      ${fig({ kind: 'plane', x: [0, 7], y: [-4, 3], points: { C: [4, -1], K: [5, 1], "K'": [2, 0] }, path: [[5, 1], [4, -1], [2, 0]] })}
      ${steps(
        `<p><strong>Join the centre C to K.</strong> This arm goes 1 right and 2 up.</p>`,
        `<p><strong>Swing the arm 90° anticlockwise around C</strong> on a circular arc, keeping its length the same (use a pair of compasses or tracing paper). Right becomes up and up becomes left, so the arm now goes 1 up and 2 left.</p>`,
        `<p><strong>Draw the new arm from C,</strong> not from (0, 0).</p>
         ${sum('(4 − 2, −1 + 1) = (2, 0)')}
         ${ans('(2, 0)')}`
      )}
      ${tip('Clockwise instead: 1 right, 2 up becomes 1 down, 2 right, giving (6, −2). For 180°, reverse both: 1 left, 2 down, giving (3, −3).')}`,

    // 7I Q6: reflecting in a diagonal mirror line
    '7i-mirror45': `
      <p class="hp-tag">Worked example: reflect <b>G(6, 2)</b> in the green diagonal mirror line.</p>
      ${fig({ kind: 'plane', x: [0, 6], y: [0, 6], points: { G: [6, 2], "G'": [2, 6] }, path: [[0, 0], [6, 6]] })}
      ${steps(
        `<p><strong>Move diagonally towards the mirror,</strong> one square left and one up at a time, so you cross it at right angles. From (6, 2): (5, 3), then (4, 4) is on the mirror. That took 2 steps.</p>`,
        `<p><strong>Keep going the same number of steps</strong> past the mirror: (3, 5), then (2, 6).</p>
         ${ans('(2, 6)')}`
      )}
      ${tip('For a mirror going up to the right through (0, 0), the x and y swap places. For a mirror sloping the other way, count diagonal steps the same way.')}`,

    // 7I Q9: which rotation is shown?
    '7i-which': `
      <p class="hp-tag">Worked example: the shaded shape is rotated about C to give the other shape. Which rotation is it?</p>
      ${D([{ poly: [[1, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2]], fill: true }, { poly: [[0, -1], [0, -3], [1, -3], [1, -2], [2, -2], [2, -1]] },
        S([0, 0], [3, 0], { dash: true }), S([0, 0], [0, -3], { dash: true }), N([0, 0], 'C', 'nw')])}
      ${steps(
        `<p><strong>Pick one corner of the shaded shape</strong> and find where it went. Here, use the corner furthest to the right.</p>`,
        `<p><strong>Join each to C</strong> (dashed). The line turned a quarter turn, so 90°. A half turn would be 180°.</p>`,
        `<p><strong>Which way?</strong> From pointing right to pointing down is the way clock hands go.</p>
         ${ans('90° clockwise')}`
      )}
      ${tip('A 180° turn needs no direction: clockwise and anticlockwise land in the same place.')}`,

    // 7I Q11: matching rotations
    '7i-same': `
      <p class="hp-tag">Worked example: fill the gaps. <b>130° clockwise</b> is the same as ___ anticlockwise. <b>500° anticlockwise</b> is the same as ___ anticlockwise.</p>
      ${steps(
        `<p><strong>Going the other way,</strong> you make up the rest of a full turn.</p>
         ${sum('360 − 130 = 230')}
         ${ans('230')}`,
        `<p><strong>More than a full turn?</strong> Take off 360, because a full turn changes nothing.</p>
         ${sum('500 − 360 = 140')}
         ${ans('140')}`
      )}
      ${tip('Picture a clock hand: the two ways round to the same spot always add to 360°.')}`,

    // =====================================================================
    // 7J Translation
    // =====================================================================
    // 7J Q1, Q2, Q3: translating a point
    '7j-move': `
      <p class="hp-tag">Worked example: translate <b>M(−2, 3)</b> 5 units right and 4 units down.</p>
      ${fig({ kind: 'plane', x: [-3, 4], y: [-2, 4], points: { M: [-2, 3], "M'": [3, -1] }, path: [[-2, 3], [3, 3], [3, -1]] })}
      ${steps(
        `<p><strong>Right and left change x.</strong> Right adds, left takes away.</p>
         ${sum('x: −2 + 5 = 3')}`,
        `<p><strong>Up and down change y.</strong> Up adds, down takes away.</p>
         ${sum('y: 3 − 4 = −1')}
         ${ans('(3, -1)')}`
      )}
      ${tip('Type the point with brackets and a comma, x first: (3, -1). Count along the grid to check.')}`,

    // 7J Q4, Q5, Q9: describing a translation, undoing it and joining two
    '7j-describe': `
      <p class="hp-tag">Worked example: describe the translation from <b>P(−5, 2)</b> to <b>P'(1, −6)</b>.</p>
      ${steps(
        `<p><strong>Compare the x values on a number line.</strong> Count from −5 to 1: 5 steps to reach 0, then 1 more. x got bigger, so the point moved right.</p>
         ${sum('−5 → 0 → 1: 5 + 1 = 6, so 6 units right')}`,
        `<p><strong>Compare the y values the same way.</strong> Count from 2 down to −6: 2 steps to reach 0, then 6 more. y got smaller, so the point moved down.</p>
         ${sum('2 → 0 → −6: 2 + 6 = 8, so 8 units down')}
         ${ans('6 units right and 8 units down')}`,
        `<p><strong>To undo it, reverse both:</strong> 6 left and 8 up. <strong>To join two translations,</strong> combine each direction: 4 left and 1 up, then 7 right and 5 down, gives 3 right and 4 down.</p>`
      )}
      ${tip('x getting bigger means right, smaller means left. y getting bigger means up, smaller means down. When the signs are different, count through 0.')}`,

    // 7J Q6: counting paths on a dot grid
    '7j-paths': `
      <p class="hp-tag">Worked example: moving 1 unit at a time along the dots, never visiting a dot twice, how many paths go from A to B on a grid of 2 rows of 3 dots?</p>
      ${D([...[0, 1, 2].flatMap(x => [0, 1].map(y => N([x, y], '', 'n'))), S([0, 0], [1, 0]), S([1, 0], [1, 1]), S([1, 1], [2, 1]), N([0, 0], 'A', 'sw'), N([2, 1], 'B', 'ne')], 50)}
      ${steps(
        `<p><strong>Use letters for moves</strong>: R right, L left, U up, D down. The path drawn is R, U, R.</p>`,
        `<p><strong>List the paths in an order</strong>, sorted by the first move. Starting with R: R R U and R U R. Starting with U: U R R, and U R D R U (dropping back down).</p>
         ${sum('2 + 2 = 4')}
         ${ans('4')}`
      )}
      ${tip('Paths may go left or down too, as long as no dot is visited twice. A careful list in order means none are missed or counted twice.')}`,

    // 7J Q7: counting reachable points
    '7j-count': `
      <p class="hp-tag">Worked example: starting at (0, 0), moving left, right, up or down in whole units, with at most <b>2</b> units in total, how many points can you reach (not counting the start)?</p>
      ${fig({ kind: 'plane', x: [-3, 3], y: [-3, 3], points: dots([[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2], [1, 1], [1, -1], [-1, 1], [-1, -1]]) })}
      ${steps(
        `<p><strong>Exactly 1 unit away:</strong> one step in any of 4 directions: 4 points.</p>`,
        `<p><strong>Exactly 2 units away:</strong> 2 steps the same way (4 points), or 1 across and 1 up or down (4 corner points): 8 points.</p>`,
        `<p><strong>Add them.</strong></p>
         ${sum('4 + 8 = 12')}
         ${ans('12')}`
      )}
      ${tip('Sort the points by how many units away they are, and look for a pattern before you count the next group.')}`,

    // 7J Q10: several transformations in a row
    '7j-combo': `
      <p class="hp-tag">Worked example: start at <b>(3, −4)</b>. Reflect in the x-axis, then rotate 90° clockwise about (0, 0), then translate 2 units left and 5 units up.</p>
      ${flow(['Start', '(3, −4)'], ['Reflect in x-axis', '(3, 4)'], ['Rotate 90° clockwise', '(4, −3)'], ['2 left, 5 up', '(2, 2)'])}
      ${steps(
        `<p><strong>Reflect in the x-axis:</strong> y changes sign. (3, −4) becomes (3, 4).</p>`,
        `<p><strong>Rotate 90° clockwise:</strong> the trip 3 right, 4 up becomes 3 down, 4 right. That is (4, −3).</p>`,
        `<p><strong>Translate:</strong> x − 2 and y + 5.</p>
         ${sum('(4 − 2, −3 + 5) = (2, 2)')}
         ${ans('(2, 2)')}`
      )}
      ${tip('Do one step at a time, always starting from the last image. Writing each point down stops slips.')}`,

    // =====================================================================
    // 7K Drawing solids
    // =====================================================================
    // 7K Q1, Q2, Q3, Q8: naming solids and counting faces, edges and vertices
    '7k-solid': `
      <p class="hp-tag">Worked example: name this solid, and count its faces, vertices and edges.</p>
      ${(() => { const b = [270, 342, 54, 126, 198].map(t => [r3(2 * Math.cos(rad(t))), r3(0.6 * Math.sin(rad(t)))]), top = [0, 2.6];
        return D([S(b[4], b[0]), S(b[0], b[1]), S(b[1], b[2], { dash: true }), S(b[2], b[3], { dash: true }), S(b[3], b[4], { dash: true }),
          S(top, b[0]), S(top, b[1]), S(top, b[4]), S(top, b[2], { dash: true }), S(top, b[3], { dash: true })]); })()}
      ${steps(
        `<p><strong>Name it.</strong> A flat base with triangles meeting at a point is a pyramid. It is named after its base, a pentagon.</p>
         ${sum('pentagonal pyramid')}`,
        `<p><strong>Faces and vertices:</strong> the base plus 5 triangles; the 5 base corners plus the top point.</p>
         ${sum('faces 1 + 5 = 6, vertices 5 + 1 = 6')}`,
        `<p><strong>Edges:</strong> 5 round the base and 5 going up to the top.</p>
         ${sum('5 + 5 = 10')}
         ${ans('6 faces, 6 vertices, 10 edges')}`
      )}
      ${tip('A prism has two identical ends joined by rectangles, and is named after its end. Dashed lines are hidden edges: count them too.')}`,

    // 7K Q4: counting cubes in a drawing
    '7k-cubes': `
      <p class="hp-tag">Worked example: how many cubes are in this solid? No cubes are hidden.</p>
      ${D(cubes([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]]), 40)}
      ${steps(
        `<p><strong>Count layer by layer.</strong> The bottom layer is an L shape of 3 cubes.</p>`,
        `<p><strong>Now the layer above:</strong> 1 cube sits on the corner cube.</p>
         ${sum('3 + 1 = 4')}
         ${ans('4')}`
      )}
      ${tip('Each cube shows a top face unless another cube sits on it. Count the tops of each column and how tall each column is.')}`,

    // 7K Q5, Q11: views of a solid
    '7k-views': `
      <p class="hp-tag">Worked example: a cylinder stands on one end. What are its top view and side view?</p>
      ${steps(
        `<p><strong>Top view:</strong> imagine looking straight down from above. You see the round end.</p>
         ${sum('top view: a circle')}`,
        `<p><strong>Side view:</strong> imagine your eye level with the middle, looking straight at it. The straight sides and flat ends show as a rectangle.</p>
         ${ans('top: a circle, side: a rectangle')}`,
        `<p><strong>Solids made of cubes:</strong> each view shows one square for every column you can see from that side, however deep it goes. Count the squares in each view.</p>`
      )}
      ${tip('A point at the top (like a cone or pyramid tip) shows as a dot in the middle of the top view.')}`,

    // 7K Q6, Q7: stacks that match a top view
    '7k-stacks': `
      <p class="hp-tag">Worked example: this top view is a stack of <b>5</b> cubes. Every square has at least one cube. How many different stacks could it be?</p>
      ${D([{ poly: [[0, 0], [1, 0], [1, 1], [0, 1]] }, { poly: [[1, 0], [2, 0], [2, 1], [1, 1]] }], 40)}
      ${steps(
        `<p><strong>Put one cube on each square first.</strong></p>
         ${sum('5 − 2 = 3 cubes left to share out')}`,
        `<p><strong>List every way to share the 3 extra cubes</strong> between the two columns, in order.</p>
         ${chips(['4 and 1'], ['3 and 2'], ['2 and 3'], ['1 and 4'])}
         ${ans('4')}`
      )}
      ${tip('With 3 or more squares, fix how many go on the first square, list the ways for the rest, then move on.')}`,

    // 7K Q9, Q10: the same solid turned around
    '7k-same': `
      <p class="hp-tag">Worked example: how do you tell if two cube drawings show the same solid, turned around?</p>
      ${steps(
        `<p><strong>Count the cubes in each.</strong> Different counts means different solids.</p>`,
        `<p><strong>Find something special,</strong> like a tower, the longest row or an arm sticking out, and find it in the other drawing.</p>`,
        `<p><strong>Check where everything else sits next to it.</strong> If the parts sit the same way round each other, it is the same solid. If one is a mirror image, it is not.</p>`
      )}
      ${tip('Build it with real cubes if you can, then turn it in your hands and compare.')}`,

    // =====================================================================
    // 7L Nets of solids
    // =====================================================================
    // 7L Q1, Q2, Q3: which solid a net makes
    '7l-nets': `
      <p class="hp-tag">Worked example: which solid does this net make?</p>
      ${D([...[0, 1, 2, 3, 4].map(k => ({ poly: [[k, 0], [k + 1, 0], [k + 1, 1.6], [k, 1.6]] })), { poly: pent([2, 1.6], 1) }, { poly: pent([2, 0], -1) }], 34)}
      ${steps(
        `<p><strong>Count the faces and their shapes.</strong> 2 pentagons and 5 rectangles: 7 faces.</p>`,
        `<p><strong>Two identical ends joined by rectangles</strong> make a prism, named after its ends.</p>
         ${ans('pentagonal prism')}`,
        `<p><strong>Choosing a net to match sizes?</strong> Fold it in your head: edges that meet must be the same length, and no two faces can land on top of each other.</p>`
      )}
      ${tip('One base with triangles round it folds into a pyramid. Count how many faces will meet at each corner once it is folded.')}`,

    // 7L Q4, Q5, Q6: the Platonic solids
    '7l-platonic': `
      ${chips(['tetrahedron: 4 triangles'], ['cube: 6 squares'], ['octahedron: 8 triangles'], ['dodecahedron: 12 pentagons'], ['icosahedron: 20 triangles'])}
      <p class="hp-tag">Worked example: count the edges and vertices of a triangular prism without a picture, and how many faces meet at each vertex.</p>
      ${steps(
        `<p><strong>Count all the face corners.</strong> 2 triangles and 3 rectangles.</p>
         ${sum('2 × 3 + 3 × 4 = 6 + 12 = 18 face corners')}`,
        `<p><strong>Edges:</strong> each edge is shared by 2 faces, so halve the number of face sides (also 18).</p>
         ${sum('18 ÷ 2 = 9 edges')}`,
        `<p><strong>Vertices:</strong> look at one corner: 1 triangle and 2 rectangles meet there, so 3 faces. Each vertex uses 3 face corners.</p>
         ${sum('18 ÷ 3 = 6 vertices')}
         ${ans('9 edges, 6 vertices, 3 faces at each')}`
      )}
      ${tip('The names count the faces: tetra 4, hexa 6, octa 8, dodeca 12, icosa 20. To name a net, count its faces and their shape.')}`,

    // 7L Q7, Q10: curved surfaces
    '7l-curved': `
      <p class="hp-tag">Worked example: a paper cup has a round base and a sloping side, and no lid. What shapes make its net?</p>
      ${steps(
        `<p><strong>Flat faces stay as they are.</strong> The base is a circle.</p>`,
        `<p><strong>Unroll the curved side.</strong> Imagine cutting straight down the side and flattening it. The top rim is longer than the bottom rim, so it opens out into a curved strip, part of a ring.</p>
         ${ans('a circle and a curved strip')}`
      )}
      ${tip('Test a curved surface by imagining wrapping it in a flat sheet of paper. If the paper fits with no creases, folds or tears, it can be a piece of a net.')}`,

    // 7L Q8: counting different nets
    '7l-count': `
      <p class="hp-tag">Worked example: how many different shapes can you make from 4 squares joined edge to edge? Turned or flipped copies count as the same.</p>
      ${D([[0, 0], [1, 0], [2, 0], [3, 0]].map(([x, y]) => ({ poly: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] }))
        .concat([[5, 0], [6, 0], [5, 1], [6, 1]].map(([x, y]) => ({ poly: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] })))
        .concat([[8, 0], [9, 0], [10, 0], [9, 1]].map(([x, y]) => ({ poly: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] })))
        .concat([[12, 0], [13, 0], [14, 0], [14, 1]].map(([x, y]) => ({ poly: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] })))
        .concat([[16, 0], [17, 0], [17, 1], [18, 1]].map(([x, y]) => ({ poly: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] }))), 24)}
      ${steps(
        `<p><strong>Work in an order.</strong> All 4 in a row. Then 3 in a row with 1 added: at the middle or at an end. Then 2 rows of 2: lined up (a square) or shifted (a zigzag).</p>`,
        `<p><strong>Cross out repeats.</strong> Turn and flip each new shape in your head; if it matches one you already have, it does not count.</p>
         ${ans('5')}`
      )}
      ${tip('For nets, also check each shape folds up with no faces overlapping. Sketch on squared paper and cut out the tricky ones.')}`,

    // 7L Q9: gluing two solids together
    '7l-glued': `
      <p class="hp-tag">Worked example: two identical cubes are glued face to face. How many faces and vertices does the new solid have?</p>
      ${D(cubes([[0, 0, 0], [1, 0, 0]]), 40)}
      ${steps(
        `<p><strong>Add the faces, then take away the glued faces</strong>, which are now hidden inside.</p>
         ${sum('6 + 6 = 12, then 12 − 2 = 10')}`,
        `<p><strong>Check for faces that line up flat.</strong> Each side face of one cube lines up with a side face of the other, making one long rectangle. 4 pairs join up.</p>
         ${sum('10 − 4 = 6 faces')}`,
        `<p><strong>Vertices:</strong> the 4 corners where the cubes meet now sit in the middle of straight edges, so they are not corners any more. Only the 8 outer corners are left.</p>
         ${ans('6 faces, 8 vertices')}`
      )}
      ${tip('Faces that meet at an angle stay separate. Only faces that lie in the same flat surface join into one.')}`,

    // 7L Q11: cubes inside and outside a big cube
    '7l-cubes': `
      <p class="hp-tag">Worked example: a box 3 cm by 4 cm by 5 cm is built from 1 cm cubes. How many cubes are completely inside, and how many touch the outside?</p>
      ${steps(
        `<p><strong>Total cubes:</strong> multiply the three lengths.</p>
         ${sum('3 × 4 × 5 = 60')}`,
        `<p><strong>Inside cubes:</strong> peel off one layer all round. That takes 1 cube off both ends of every length, so take 2 from each.</p>
         ${sum('1 × 2 × 3 = 6 inside')}`,
        `<p><strong>Outside cubes:</strong> everything else.</p>
         ${sum('60 − 6 = 54')}
         ${ans('6 inside, 54 outside')}`
      )}
      ${tip('In a rule, type powers with ^ and use brackets: (n+1)^2 means (n + 1) × (n + 1).')}`
  });
})();
