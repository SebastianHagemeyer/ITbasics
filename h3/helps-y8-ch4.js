/* H3 help panels for Year 8 Chapter 4. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 4A to 4M. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  // ---- drawing helpers for this chapter (every measurement is the panel's own, drawn roughly to scale) ----
  const D = (items, alt, unit) => fig(Object.assign({ kind: 'diagram', items, alt }, unit ? { unit } : {}));
  const q = (v) => Math.round(v * 1000) / 1000;
  const pt = (cx, cy, r, a) => [q(cx + r * Math.cos(a * Math.PI / 180)), q(cy + r * Math.sin(a * Math.PI / 180))];
  const arcPts = (cx, cy, r, a1, a2) => {
    const n = Math.max(6, Math.ceil(Math.abs(a2 - a1) / 5));
    return Array.from({ length: n + 1 }, (_, i) => pt(cx, cy, r, a1 + (a2 - a1) * i / n));
  };
  // points on an ellipse (for the ends of a cylinder drawn in 3D)
  const ellPts = (cx, cy, rx, ry, a1, a2) => {
    const n = Math.max(6, Math.ceil(Math.abs(a2 - a1) / 6));
    return Array.from({ length: n + 1 }, (_, i) => {
      const a = (a1 + (a2 - a1) * i / n) * Math.PI / 180;
      return [q(cx + rx * Math.cos(a)), q(cy + ry * Math.sin(a))];
    });
  };
  // A rectangular prism in a simple oblique view: front face l by h, going back w.
  const box = (l, h, w, [ll, hl, wl]) => {
    const dx = q(w * 0.45), dy = q(w * 0.32);
    return [
      { poly: [[l, 0], [l, h], [l + dx, h + dy], [l + dx, dy]], fill: true },
      { poly: [[0, h], [l, h], [l + dx, h + dy], [dx, h + dy]], fill: true },
      { poly: [[0, 0], [l, 0], [l, h], [0, h]], fill: true },
      { dim: [0, 0, l, 0], label: ll, off: -0.5 },
      { dim: [l, 0, l + dx, dy], label: wl, off: -0.5 },
      { dim: [l + dx, dy, l + dx, h + dy], label: hl, off: -0.5 }
    ];
  };
  // A triangular prism lying on a rectangle: right-angled triangle (base b, height h) at the front.
  const wedge = (b, h, len, [bl, hl, ll]) => {
    const dx = q(len * 0.45), dy = q(len * 0.32);
    return [
      { poly: [[b, 0], [0, h], [dx, h + dy], [b + dx, dy]], fill: true },
      { poly: [[0, 0], [b, 0], [0, h]], fill: true },
      { seg: [dx, dy, b + dx, dy], dash: true },
      { seg: [0, 0, dx, dy], dash: true },
      { seg: [dx, h + dy, dx, dy], dash: true },
      { angle: [0, 0, 0, 90], right: true },
      { dim: [0, 0, b, 0], label: bl, off: -0.5 },
      { dim: [0, h, 0, 0], label: hl, off: -0.5 },
      { dim: [b, 0, b + dx, dy], label: ll, off: -0.5 }
    ];
  };
  // A cylinder standing up: radius r, height h, with the radius drawn on the top face.
  const cyl = (r, h, rl, hl) => {
    const ry = q(r * 0.32);
    return [
      { poly: [...ellPts(0, 0, r, ry, 180, 360), ...ellPts(0, h, r, ry, 0, 180)], fill: true },
      { poly: ellPts(0, h, r, ry, 0, 360), fill: true },
      { seg: [0, h, r, h] }, { point: [0, h] },
      { label: rl, at: [r / 2, h + ry + 0.3] },
      { dim: [r, 0, r, h], label: hl, off: -0.5 }
    ];
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Y8 4A Length and perimeter
    // =====================================================================
    // Y8 4A Q1, Q2: converting lengths
    'y8-4a-convert': `
      ${flow(['start', 'km'], ['× 1000', 'm'], ['× 100', 'cm'], ['× 10', 'mm'])}
      <p>Going right (to a smaller unit) you <b>multiply</b>. Going left (to a bigger unit) you <b>divide</b>.</p>
      <p class="hp-tag">Worked example: convert <b>2.6 km</b> to cm, and <b>38 500 mm</b> to m.</p>
      ${steps(
        `<p><strong>km to cm is two steps right</strong>, so multiply at each step.</p>
         ${sum('2.6 km × 1000 = 2600 m<br>2600 m × 100 = 260 000 cm')}`,
        `<p><strong>mm to m is two steps left</strong>, so divide at each step.</p>
         ${sum('38 500 mm ÷ 10 = 3850 cm<br>3850 cm ÷ 100 = 38.5 m')}
         ${ans('260000 and 38.5')}`
      )}
      ${tip('Check the size: a smaller unit always gives a bigger number. Type big answers with no spaces, like 260000, and keep the zeros in tiny ones, like 0.04.')}`,

    // Y8 4A Q3: perimeter by adding the sides
    'y8-4a-perimeter': `
      <p class="hp-tag">Worked example: find the perimeter of this parallelogram.</p>
      ${D([
        { poly: [[0, 0], [5.5, 0], [6.7, 3], [1.2, 3]], fill: true },
        { tick: [0, 0, 5.5, 0], n: 1 }, { tick: [1.2, 3, 6.7, 3], n: 1 },
        { tick: [0, 0, 1.2, 3], n: 2 }, { tick: [5.5, 0, 6.7, 3], n: 2 },
        { dim: [0, 0, 5.5, 0], label: '5.5 cm', off: -0.5 }, { label: '3.2 cm', at: [0.3, 1.8], anchor: 'end' }
      ], 'A parallelogram with sides 5.5 cm and 3.2 cm. Opposite sides have matching marks.', 40)}
      ${steps(
        `<p><strong>Perimeter is the distance all the way round.</strong> Matching marks mean matching lengths, so there are two sides of 5.5 cm and two of 3.2 cm.</p>`,
        `<p><strong>Add every side, not just the ones with numbers.</strong></p>
         ${sum('5.5 + 3.2 + 5.5 + 3.2 = 17.4 cm')}
         ${ans('17.4')}`
      )}
      ${tip('A regular shape has all sides equal, so multiply: a regular hexagon with sides of 2.5 m has P = 6 × 2.5 = 15 m.')}`,

    // Y8 4A Q8: perimeter with sides in different units and missing sides
    'y8-4a-mixed': `
      <p class="hp-tag">Worked example: find the perimeter in centimetres. All corners are right angles.</p>
      ${D([
        { poly: [[0, 0], [15, 0], [15, 6], [9, 6], [9, 13], [0, 13]], fill: true },
        { dim: [0, 0, 15, 0], label: '15 cm', off: -0.5 }, { dim: [15, 0, 15, 6], label: '60 mm', off: -0.5 },
        { dim: [9, 13, 0, 13], label: '90 mm', off: -0.5 }, { dim: [0, 13, 0, 0], label: '0.13 m', off: -0.5 },
        { label: '?', at: [12, 6.8] }, { label: '?', at: [9.6, 9.5], anchor: 'start' }
      ], 'An L shape: bottom 15 cm, right side 60 mm, top 90 mm, left side 0.13 m. Two sides are unknown.', 15)}
      ${steps(
        `<p><strong>Change every length to cm first.</strong></p>
         ${sum('0.13 m = 13 cm<br>90 mm = 9 cm<br>60 mm = 6 cm')}`,
        `<p><strong>Find the missing sides from the sides opposite them.</strong></p>
         ${sum('across: 15 − 9 = 6<br>up: 13 − 6 = 7')}`,
        `<p><strong>Add all six sides</strong>, going round in order.</p>
         ${sum('15 + 6 + 6 + 7 + 9 + 13 = 56')}
         ${ans('56')}`
      )}
      ${tip('Shortcut for L and staircase shapes: the perimeter is the same as the rectangle around them, here 2 × (15 + 13) = 56. A notch cut into one side is different: it adds its two depths.')}`,

    // Y8 4A Q4, Q6, Q11: a missing side from the perimeter
    'y8-4a-find-x': `
      <p class="hp-tag">Worked example: this kite has perimeter <b>P = 25 m</b>. Find x.</p>
      ${D([
        { poly: [[0, 0], [3.6, 7.144], [0, 9.844], [-3.6, 7.144]], fill: true },
        { tick: [0, 0, 3.6, 7.144], n: 1 }, { tick: [0, 0, -3.6, 7.144], n: 1 },
        { tick: [3.6, 7.144, 0, 9.844], n: 2 }, { tick: [-3.6, 7.144, 0, 9.844], n: 2 },
        { label: 'x m', at: [2.3, 3.2], anchor: 'start' }, { label: '4.5 m', at: [2.5, 9.3], anchor: 'start' }
      ], 'A kite with two long sides marked x m and two short sides of 4.5 m.', 24)}
      ${steps(
        `<p><strong>Take away the sides you know.</strong> There are two sides of 4.5 m.</p>
         ${sum('25 − 4.5 − 4.5 = 16')}`,
        `<p><strong>Share what is left between the equal sides.</strong> There are two sides of x.</p>
         ${sum('16 ÷ 2 = 8')}
         ${ans('8')}`
      )}
      <p><strong>Rectangles:</strong> length + width is half the perimeter. If P = 22 m and the length is 6.5 m, the width is 11 − 6.5 = 4.5 m.</p>
      ${tip('Check by adding all the sides: 8 + 8 + 4.5 + 4.5 = 25. ✓ In a shape with only right angles, mark the sides that are equal to x before you start.')}`,

    // Y8 4A Q5: choosing a sensible unit
    'y8-4a-units': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Unit</span><span role="columnheader">Good for</span></div>
        <div class="hp-tr" role="row"><span role="cell">millimetres (mm)</span><span role="cell">tiny lengths: a seed, the thickness of a phone</span></div>
        <div class="hp-tr" role="row"><span role="cell">centimetres (cm)</span><span role="cell">things you can hold: a book, a pencil</span></div>
        <div class="hp-tr" role="row"><span role="cell">metres (m)</span><span role="cell">rooms, buildings, pools, animals</span></div>
        <div class="hp-tr" role="row"><span role="cell">kilometres (km)</span><span role="cell">trips and journeys</span></div>
      </div>
      <p class="hp-tag">Worked example: which unit suits the <b>length of a bus</b>?</p>
      ${steps(
        `<p><strong>Picture it.</strong> A bus is about as long as 12 big steps.</p>`,
        `<p><strong>Pick the unit that gives a sensible, easy number.</strong> About 12 m. In mm it would be 12 000, and in km a tiny decimal.</p>
         ${ans('metres (m)')}`
      )}
      ${tip('If the number would be huge, choose a bigger unit. If it would be a tiny decimal, choose a smaller one.')}`,

    // Y8 4A Q7, Q10: fencing costs and frames
    'y8-4a-fence': `
      <p class="hp-tag">Worked example: a paddock is <b>42 m</b> long and <b>27 m</b> wide. Fencing costs <b>$12 per metre</b>. Find the cost of fencing all the way round.</p>
      ${steps(
        `<p><strong>Find the perimeter.</strong> Two lengths and two widths.</p>
         ${sum('2 × 42 + 2 × 27 = 84 + 54 = 138 m')}`,
        `<p><strong>Multiply by the cost of one metre.</strong></p>
         ${sum('138 × 12 = 1656')}
         ${ans('1656')}`
      )}
      <p><strong>Frames:</strong> a frame adds its width to <b>both</b> ends of each side. A 50 cm by 30 cm photo in a 4 cm frame is 58 cm by 38 cm outside, so the outside perimeter is 2 × 58 + 2 × 38 = 192 cm.</p>
      ${tip('Type money with no $ sign. Draw a quick sketch of the frame and label the outside lengths before adding.')}`,

    // Y8 4A Q9: speed and time with lengths
    'y8-4a-rate': `
      <p class="hp-tag">Worked example: a walker covers <b>80 m</b> every <b>20 seconds</b>. How many minutes does it take to walk <b>2.4 km</b>?</p>
      ${steps(
        `<p><strong>Make the units match.</strong> The speed uses metres, so change km to m.</p>
         ${sum('2.4 km = 2400 m')}`,
        `<p><strong>How many lots of 80 m are in 2400 m?</strong> Each lot takes 20 seconds.</p>
         ${sum('2400 ÷ 80 = 30 lots<br>30 × 20 = 600 seconds')}`,
        `<p><strong>Change seconds to minutes.</strong></p>
         ${sum('600 ÷ 60 = 10')}
         ${ans('10')}`
      )}
      ${tip('Read which unit the answer needs: seconds, minutes or hours. Divide by 60 to go from seconds to minutes.')}`,

    // Y8 4A Q12: the smallest and largest true length
    'y8-4a-bounds': `
      <p class="hp-tag">Worked example: a plank is <b>238 cm</b> long, to the nearest centimetre. What are the smallest and largest possible true lengths?</p>
      ${steps(
        `<p><strong>"To the nearest cm" means it could be up to half a centimetre out</strong>, either way.</p>
         ${sum('half of 1 cm = 0.5 cm')}`,
        `<p><strong>Take 0.5 away for the smallest, and add 0.5 for the largest.</strong></p>
         ${sum('238 − 0.5 = 237.5<br>238 + 0.5 = 238.5')}
         ${ans('237.5, 238.5')}`
      )}
      ${tip('Type the smallest first, then a comma, then the largest. For a length to the nearest 10 cm, go 5 cm either way.')}`,

    // Y8 4A Q13: how accuracy changes a perimeter
    'y8-4a-accuracy': `
      <p class="hp-tag">Worked example: a desk is estimated at <b>1 m</b> by <b>2 m</b>, measured as <b>96 cm</b> by <b>185 cm</b>, then as <b>962 mm</b> by <b>1853 mm</b>. Find each perimeter in metres.</p>
      ${steps(
        `<p><strong>Change everything to metres.</strong></p>
         ${sum('96 cm = 0.96 m, 185 cm = 1.85 m<br>962 mm = 0.962 m, 1853 mm = 1.853 m')}`,
        `<p><strong>Use P = 2 × (length + width) for each.</strong></p>
         ${sum('2 × (1 + 2) = 6<br>2 × (0.96 + 1.85) = 5.62<br>2 × (0.962 + 1.853) = 5.63')}
         ${ans('6, 5.62, 5.63')}`,
        `<p><strong>Difference in mm:</strong> largest take smallest, then × 1000.</p>
         ${sum('6 − 5.62 = 0.38 m = 380 mm')}`
      )}
      ${tip('The smaller the unit you measure to, the more accurate the answer. Type the three answers in order with commas between.')}`,

    // Y8 4A Q14: a rule for the perimeter
    'y8-4a-rule': `
      <p class="hp-tag">Worked example: write a rule for the perimeter <b>P</b> of this shape.</p>
      ${D([
        { poly: [[0, 0], [4, 0], [4, 2.5], [2, 4.2], [0, 2.5]], fill: true },
        { tick: [0, 0, 0, 2.5], n: 1 }, { tick: [4, 0, 4, 2.5], n: 1 },
        { tick: [0, 2.5, 2, 4.2], n: 2 }, { tick: [4, 2.5, 2, 4.2], n: 2 },
        { label: 'm', at: [2, -0.45] }, { label: 'n', at: [-0.35, 1.25], anchor: 'end' }, { label: 'k', at: [0.75, 3.75], anchor: 'end' }
      ], 'A house shape: base m, two equal walls n, two equal roof sides k.', 36)}
      ${steps(
        `<p><strong>Go round the shape and write every side.</strong> Matching marks get the same letter.</p>
         ${sum('m + n + k + k + n')}`,
        `<p><strong>Collect the same letters.</strong></p>
         ${sum('P = m + 2n + 2k')}
         ${ans('P = m + 2n + 2k')}`
      )}
      ${tip('Type it as P = m + 2n + 2k, with the number in front of the letter and no × signs. A side with no letter on it may still match one that has a letter.')}`,

    // Y8 4A Q15: a rule for x from the perimeter
    'y8-4a-rearrange': `
      <p class="hp-tag">Worked example: this isosceles triangle has base <b>7</b> and two equal sides <b>x</b>. Write a rule for x in terms of P.</p>
      ${D([
        { poly: [[0, 0], [3.5, 0], [1.75, 4.5]], fill: true },
        { tick: [0, 0, 1.75, 4.5], n: 1 }, { tick: [3.5, 0, 1.75, 4.5], n: 1 },
        { label: '7', at: [1.75, -0.45] }, { label: 'x', at: [0.95, 3.2], anchor: 'end' }, { label: 'x', at: [2.55, 3.2], anchor: 'start' }
      ], 'An isosceles triangle with base 7 and two equal sides x.', 34)}
      ${steps(
        `<p><strong>Write the perimeter rule first.</strong></p>
         ${sum('P = x + x + 7 = 2x + 7')}`,
        `<p><strong>Undo it in reverse order.</strong> Take away 7, then divide by 2.</p>
         ${sum('P − 7 = 2x<br>x = (P − 7)/2')}
         ${ans('x = (P - 7)/2')}`
      )}
      ${tip('If only x is round the shape, just divide: a regular pentagon with side x has x = P/5. Brackets go round the whole top when you divide it.')}`,

    // Y8 4A Q16: shrinking squares
    'y8-4a-halving': `
      <p class="hp-tag">Worked example: each new square has side <b>one-third</b> of the one before. How many squares are needed so the smallest perimeter is less than <b>1/20</b> of the largest?</p>
      ${steps(
        `<p><strong>The perimeter shrinks by the same amount as the side.</strong> Each perimeter is 1/3 of the one before.</p>`,
        `<p><strong>List each square's perimeter as a fraction of the first.</strong></p>
         ${sum('1st: 1 &nbsp; 2nd: 1/3 &nbsp; 3rd: 1/9 &nbsp; 4th: 1/27')}`,
        `<p><strong>Stop at the first one below 1/20.</strong> 1/9 is still bigger, but 1/27 is smaller.</p>
         ${ans('4')}`
      )}
      ${tip('Count the first square too. "At least 100 times bigger" works the same way: list 1, 3, 9, 27, 81, 243 and count the squares until you pass it.')}`,

    // =====================================================================
    // Y8 4B Circumference of circles
    // =====================================================================
    // Y8 4B Q1, Q2, Q5: circumference with the π key
    'y8-4b-circ': `
      <p class="hp-tag">Worked example: find the circumference of each circle, correct to 2 decimal places.</p>
      ${fig(
        { kind: 'diagram', unit: 26, items: [{ circle: [0, 0, 2.6], fill: true }, { seg: [0, 0, 2.6, 0] }, { point: [0, 0] }, { label: '3.5 cm', at: [1.3, 0.55] }], alt: 'A circle with radius 3.5 cm' },
        { kind: 'diagram', unit: 26, items: [{ circle: [0, 0, 2.6], fill: true }, { seg: [-2.6, 0, 2.6, 0] }, { point: [0, 0] }, { label: '13 m', at: [0, 0.55] }], alt: 'A circle with diameter 13 m' }
      )}
      ${steps(
        `<p><strong>Radius given (centre to edge):</strong> use C = 2πr.</p>
         ${sum('C = 2 × π × 3.5 = 21.991...')}`,
        `<p><strong>Diameter given (right across):</strong> use C = πd.</p>
         ${sum('C = π × 13 = 40.840...')}`,
        `<p><strong>Round to 2 decimal places:</strong> look at the third decimal digit.</p>
         ${ans('21.99 and 40.84')}`
      )}
      ${tip('Use the π key, not 3.14, unless the question gives a value. Write the unit with your answer on paper, but type only the number.')}`,

    // Y8 4B Q3: using π = 3.14 or 22/7
    'y8-4b-approx': `
      <p class="hp-tag">Worked example: (a) a circle has diameter <b>16 m</b>; use π = 3.14. (b) A circle has radius <b>21 cm</b>; use π = 22/7.</p>
      ${steps(
        `<p><strong>Put the given value in place of π.</strong></p>
         ${sum('(a) C = πd = 3.14 × 16 = 50.24')}`,
        `<p><strong>22/7 works nicely when the length divides by 7.</strong></p>
         ${sum('(b) C = 2 × 22/7 × 21<br>21 ÷ 7 = 3, so C = 2 × 22 × 3 = 132')}
         ${ans('50.24 and 132')}`
      )}
      ${tip('Check whether the picture shows the radius or the diameter before choosing 2πr or πd.')}`,

    // Y8 4B Q4: diameter or radius from the circumference
    'y8-4b-backwards': `
      <p class="hp-tag">Worked example: a circle has circumference <b>46 m</b>. Find its diameter and its radius, correct to 1 decimal place.</p>
      ${steps(
        `<p><strong>C = πd, so divide by π</strong> to undo the times.</p>
         ${sum('d = 46 ÷ π = 14.642...')}`,
        `<p><strong>C = 2πr, so divide by 2π.</strong> (Or halve the full diameter.)</p>
         ${sum('r = 46 ÷ (2 × π) = 7.321...')}
         ${ans('14.6 and 7.3')}`
      )}
      ${tip('On a calculator, put brackets round 2 × π, or press ÷ 2 ÷ π. Round only at the very end.')}`,

    // Y8 4B Q6: laps of a circular track
    'y8-4b-laps': `
      <p class="hp-tag">Worked example: a runner does <b>5 laps</b> a day, <b>3 days</b> a week, round a circular track of radius <b>40 m</b>. How far is that each week, to the nearest metre?</p>
      ${steps(
        `<p><strong>One lap is one circumference.</strong></p>
         ${sum('C = 2 × π × 40 = 251.327... m')}`,
        `<p><strong>Count the laps in a week.</strong></p>
         ${sum('5 × 3 = 15 laps')}`,
        `<p><strong>Multiply, then round.</strong></p>
         ${sum('251.327... × 15 = 3769.9... m')}
         ${ans('3770')}`
      )}
      ${tip('Keep the full calculator number until the end. Rounding the lap to 251 first would give 3765, which is wrong.')}`,

    // Y8 4B Q7: perimeter of a semicircle
    'y8-4b-semi': `
      <p class="hp-tag">Worked example: find the perimeter of this semicircle, correct to 2 decimal places.</p>
      ${D([
        { poly: arcPts(0, 0, 3, 0, 180), fill: true },
        { dim: [-3, 0, 3, 0], label: '13 cm', off: -0.5 }
      ], 'A semicircle with a straight edge (diameter) of 13 cm.', 34)}
      ${steps(
        `<p><strong>The curved edge is half a circle.</strong></p>
         ${sum('½ × π × 13 = 20.420...')}`,
        `<p><strong>Add the straight edge</strong>, which is the diameter.</p>
         ${sum('20.420... + 13 = 33.420...')}
         ${ans('33.42')}`
      )}
      ${tip('The usual slip is leaving out the straight edge. If the picture shows the radius, double it to get the straight edge.')}`,

    // Y8 4B Q8: perimeter of quadrants and sectors
    'y8-4b-sector': `
      <p class="hp-tag">Worked example: find the perimeter of this sector, correct to 2 decimal places.</p>
      ${D([
        { poly: [[0, 0], ...arcPts(0, 0, 3, 0, 135)], fill: true },
        { angle: [0, 0, 0, 135], label: '135°', r: 0.7 }, { label: '4.5 cm', at: [1.5, -0.4] }
      ], 'A sector with radius 4.5 cm and angle 135 degrees.', 40)}
      ${steps(
        `<p><strong>The arc is a fraction of the whole circumference.</strong> A full turn is 360°.</p>
         ${sum('135/360 × 2 × π × 4.5 = 10.602...')}`,
        `<p><strong>Add the two straight edges.</strong> Both are radii.</p>
         ${sum('10.602... + 4.5 + 4.5 = 19.602...')}
         ${ans('19.60')}`
      )}
      ${tip('A quadrant is 1/4 of a circle and three-quarters is 3/4. Both still have two straight radii to add on.')}`,

    // Y8 4B Q9: perimeter of shapes made with semicircles
    'y8-4b-composite': `
      <p class="hp-tag">Worked example: find the perimeter of this running track, correct to 2 decimal places. The ends are semicircles.</p>
      ${D([
        { poly: [[0, 0], [9, 0], ...arcPts(9, 2, 2, -90, 90).slice(1, -1), [9, 4], [0, 4], ...arcPts(0, 2, 2, 90, 270).slice(1, -1)], fill: true },
        { seg: [0, 0, 0, 4], dash: true }, { seg: [9, 0, 9, 4], dash: true },
        { dim: [0, 0, 9, 0], label: '9 m', off: -0.5 }, { label: '4 m', at: [8.7, 2], anchor: 'end' }
      ], 'A track: two straight sides of 9 m and a semicircle of diameter 4 m on each end.', 30)}
      ${steps(
        `<p><strong>Trace round the outside.</strong> The dashed lines are inside the shape, so they do not count.</p>
         ${sum('straight sides: 9 + 9 = 18')}`,
        `<p><strong>Two semicircles of the same size make one full circle.</strong></p>
         ${sum('π × 4 = 12.566...')}`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('18 + 12.566... = 30.566...')}
         ${ans('30.57')}`
      )}
      ${tip('Count the curves carefully and check which length is each curve\'s diameter. Small semicircles along a line add up to the same as one big one.')}`,

    // Y8 4B Q10: spotting a wrong measurement
    'y8-4b-check': `
      <p class="hp-tag">Worked example: which student probably made a mistake?</p>
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Student</span><span role="columnheader">r</span><span role="columnheader">C</span></div>
        <div class="hp-tr" role="row"><span role="cell">Sam</span><span role="cell">7 cm</span><span role="cell">44.0 cm</span></div>
        <div class="hp-tr" role="row"><span role="cell">Mia</span><span role="cell">8 m</span><span role="cell">25.1 m</span></div>
      </div>
      ${steps(
        `<p><strong>Work out C = 2πr from each radius.</strong></p>
         ${sum('Sam: 2 × π × 7 = 43.98 ✓<br>Mia: 2 × π × 8 = 50.27 ✗')}`,
        `<p><strong>Pick the ones that do not match.</strong> Mia's 25.1 is about π × 8: she forgot to double.</p>
         ${ans('Mia')}`
      )}
      ${tip('Quick check: C is a bit more than 6 times the radius. Type more than one name with commas between.')}`,

    // Y8 4B Q11: comparing approximations of π
    'y8-4b-compare': `
      <p class="hp-tag">Worked example: put <b>3.142</b>, <b>355/113</b> and <b>π</b> in ascending order.</p>
      ${steps(
        `<p><strong>Write each as a decimal with plenty of places.</strong></p>
         ${sum('3.142 = 3.1420000<br>355 ÷ 113 = 3.1415929...<br>π = 3.1415926...')}`,
        `<p><strong>Compare digit by digit</strong> from the left, smallest first.</p>
         ${ans('π, 355/113, 3.142')}`
      )}
      <p><strong>Which way is the error?</strong> 3.142 is bigger than π, so using it makes every circumference come out a little too big: π × 20 = 62.8318..., but 3.142 × 20 = 62.84.</p>
      ${tip('A value of π that is too small gives an answer that is too small, and one that is too big gives an answer that is too big.')}`,

    // Y8 4B Q13, Q14: exact answers in terms of π
    'y8-4b-exact': `
      <p class="hp-tag">Worked example: find the exact (a) circumference of a circle with radius <b>8 m</b>, (b) perimeter of a semicircle with diameter <b>18 cm</b>.</p>
      ${steps(
        `<p><strong>"Exact" means leave π as π.</strong> Do not press the π key.</p>
         ${sum('(a) C = 2 × π × 8 = 16π')}`,
        `<p><strong>Plain numbers and π parts stay side by side.</strong> They cannot be added into one number.</p>
         ${sum('(b) curve: ½ × π × 18 = 9π<br>straight edge: 18<br>perimeter = 18 + 9π')}
         ${ans('16pi and 18+9pi')}`
      )}
      ${tip('Type π as pi, with the number in front: 16pi. Collect like parts: 4 + 3π + 6 + π = 10 + 4π.')}`,

    // Y8 4B Q15: rearranging a circle rule
    'y8-4b-rearrange': `
      <p class="hp-tag">Worked example: the curved edge of a semicircle is <b>L = πr</b>. Write a rule for r, then find r when L = <b>30 cm</b>, correct to 2 decimal places.</p>
      ${steps(
        `<p><strong>r is being multiplied by π.</strong> Undo it by dividing both sides by π.</p>
         ${sum('L = πr<br>r = L/π')}`,
        `<p><strong>Substitute and use the π key.</strong></p>
         ${sum('r = 30 ÷ π = 9.549...')}
         ${ans('r = L/pi, then 9.55')}`
      )}
      ${tip('Type π as pi. If you divide by more than one thing, put the bottom in brackets, like L/(3pi).')}`,

    // =====================================================================
    // Y8 4C Area
    // =====================================================================
    // Y8 4C Q1, Q2: converting area units
    'y8-4c-convert': `
      ${flow(['start', 'km²'], ['× 1 000 000', 'm²'], ['× 10 000', 'cm²'], ['× 100', 'mm²'])}
      <p>Why 10 000? 1 m = 100 cm, so a 1 m square is 100 × 100 = 10 000 cm². Each step is the length step <b>squared</b>. Also, <b>1 hectare (ha) = 10 000 m²</b>.</p>
      <p class="hp-tag">Worked example: convert <b>2.5 m²</b> to cm², <b>8400 mm²</b> to cm², and <b>3.6 ha</b> to m².</p>
      ${steps(
        `<p><strong>To a smaller unit, multiply.</strong></p>
         ${sum('2.5 × 10 000 = 25 000 cm²')}`,
        `<p><strong>To a bigger unit, divide.</strong></p>
         ${sum('8400 ÷ 100 = 84 cm²')}`,
        `<p><strong>Hectares to m²: multiply by 10 000.</strong></p>
         ${sum('3.6 × 10 000 = 36 000 m²')}
         ${ans('25000, 84 and 36000')}`
      )}
      ${tip('m² to ha is ÷ 10 000. Type big answers with no spaces.')}`,

    // Y8 4C Q5: choosing a unit of area
    'y8-4c-units': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Unit</span><span role="columnheader">Good for</span></div>
        <div class="hp-tr" role="row"><span role="cell">mm²</span><span role="cell">tiny things: a grain of sand, a computer chip</span></div>
        <div class="hp-tr" role="row"><span role="cell">cm²</span><span role="cell">things you hold: a phone screen, a card</span></div>
        <div class="hp-tr" role="row"><span role="cell">m²</span><span role="cell">rooms, walls, courts, gardens</span></div>
        <div class="hp-tr" role="row"><span role="cell">ha and km²</span><span role="cell">farms, suburbs, forests, countries</span></div>
      </div>
      <p class="hp-tag">Worked example: which unit suits the area of a <b>playing card</b>?</p>
      ${steps(
        `<p><strong>Picture it.</strong> It fits in your hand: about 6 cm by 9 cm.</p>`,
        `<p><strong>Pick the unit that gives a sensible number.</strong> About 54 cm².</p>
         ${ans('square centimetres (cm²)')}`
      )}
      ${tip('If you could stand on it, think m². If you would need a car to cross it, think km².')}`,

    // Y8 4C Q3: area of the basic shapes
    'y8-4c-shapes': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Shape</span><span role="columnheader">Area</span></div>
        <div class="hp-tr" role="row"><span role="cell">square</span><span role="cell">A = l²</span></div>
        <div class="hp-tr" role="row"><span role="cell">rectangle</span><span role="cell">A = l × w</span></div>
        <div class="hp-tr" role="row"><span role="cell">parallelogram</span><span role="cell">A = b × h</span></div>
        <div class="hp-tr" role="row"><span role="cell">triangle</span><span role="cell">A = ½ × b × h</span></div>
      </div>
      <p class="hp-tag">Worked example: find the area of each shape.</p>
      ${fig(
        { kind: 'diagram', unit: 22, alt: 'A parallelogram with base 9 cm and dashed height 3.5 cm', items: [
          { poly: [[0, 0], [9, 0], [11, 3.5], [2, 3.5]], fill: true }, { seg: [2, 3.5, 2, 0], dash: true }, { angle: [2, 0, 0, 90], right: true },
          { dim: [0, 0, 9, 0], label: '9 cm', off: -0.5 }, { label: '3.5 cm', at: [2.2, 1.75], anchor: 'start' }] },
        { kind: 'diagram', unit: 22, alt: 'A triangle with base 7 m and dashed height 6 m', items: [
          { poly: [[0, 0], [7, 0], [2.5, 6]], fill: true }, { seg: [2.5, 6, 2.5, 0], dash: true }, { angle: [2.5, 0, 0, 90], right: true },
          { dim: [0, 0, 7, 0], label: '7 m', off: -0.5 }, { label: '6 m', at: [2.7, 3], anchor: 'start' }] }
      )}
      ${steps(
        `<p><strong>Use the perpendicular height</strong>: the dashed line at right angles to the base, not a slanted side.</p>`,
        `<p><strong>Parallelogram: base × height.</strong></p>
         ${sum('9 × 3.5 = 31.5 cm²')}`,
        `<p><strong>Triangle: half of base × height.</strong></p>
         ${sum('½ × 7 × 6 = 21 m²')}
         ${ans('31.5 and 21')}`
      )}
      ${tip('Matching marks mean equal sides, so a square only needs one length. Answers are in square units: cm², m², km².')}`,

    // Y8 4C Q4, Q6: composite shapes
    'y8-4c-composite': `
      <p class="hp-tag">Worked example: find the area of this shape.</p>
      ${D([
        { poly: [[0, 0], [11, 0], [11, 9], [5.5, 12], [0, 9]], fill: true },
        { seg: [0, 9, 11, 9], dash: true }, { seg: [5.5, 12, 5.5, 9], dash: true },
        { dim: [0, 0, 11, 0], label: '11 m', off: -0.5 }, { dim: [11, 0, 11, 9], label: '9 m', off: -0.5 },
        { label: '3 m', at: [5.7, 10.4], anchor: 'start' }
      ], 'A rectangle 11 m by 9 m with a triangle of height 3 m on top.', 18)}
      ${steps(
        `<p><strong>Split it into shapes you know.</strong> A rectangle and a triangle.</p>`,
        `<p><strong>Find each area.</strong></p>
         ${sum('rectangle: 11 × 9 = 99<br>triangle: ½ × 11 × 3 = 16.5')}`,
        `<p><strong>Add them.</strong></p>
         ${sum('99 + 16.5 = 115.5 m²')}
         ${ans('115.5')}`
      )}
      <p><strong>Taking away:</strong> a 14 m by 10 m lawn has a 1.5 m path inside its edge. The middle is 11 m by 7 m, so the path is 14 × 10 − 11 × 7 = 140 − 77 = 63 m².</p>
      ${tip('For a frame or path, the inside is shorter by the width at <b>both</b> ends. A trapezium splits into a rectangle and triangles.')}`,

    // Y8 4C Q7, Q8: squares, side length and perimeter
    'y8-4c-square': `
      <p class="hp-tag">Worked example: (a) a square has area <b>2.89 m²</b>. Find its side. (b) A square has perimeter <b>44 cm</b>. Find its area.</p>
      ${steps(
        `<p><strong>(a) Area = side × side, so undo it with a square root.</strong></p>
         ${sum('√2.89 = 1.7 m')}`,
        `<p><strong>(b) Four equal sides share the perimeter.</strong></p>
         ${sum('44 ÷ 4 = 11 cm')}`,
        `<p><strong>Then square the side.</strong></p>
         ${sum('11 × 11 = 121 cm²')}
         ${ans('1.7 and 121')}`
      )}
      ${tip('Going from area to perimeter: square root first to get the side, then × 4.')}`,

    // Y8 4C Q10, Q15: a missing length from the area, and rules
    'y8-4c-missing': `
      <p class="hp-tag">Worked example: a triangle has area <b>30 m²</b> and base <b>12 m</b>. Find its height.</p>
      ${steps(
        `<p><strong>A triangle is half a rectangle</strong>, so base × height is double the area.</p>
         ${sum('2 × 30 = 60')}`,
        `<p><strong>Divide by the base.</strong></p>
         ${sum('60 ÷ 12 = 5')}
         ${ans('5')}`
      )}
      <p><strong>As a rule:</strong> a parallelogram has A = bh. To get b on its own, divide both sides by h, so b = A/h.</p>
      ${tip('Check: ½ × 12 × 5 = 30. ✓ Type a rule starting with the letter, like b = A/h. Type a square root as sqrt( ), like sqrt(k).')}`,

    // Y8 4C Q11: paint and cost
    'y8-4c-paint': `
      <p class="hp-tag">Worked example: a fence is <b>9 m</b> long and <b>1.8 m</b> high and needs <b>two coats</b>. One litre covers <b>10 m²</b>, costs <b>$18</b>, and is sold in whole litres. Find the cost.</p>
      ${steps(
        `<p><strong>Area, then double it for two coats.</strong></p>
         ${sum('9 × 1.8 = 16.2 m²<br>16.2 × 2 = 32.4 m²')}`,
        `<p><strong>Litres needed.</strong> Round <b>up</b>, because 3 litres would not be enough.</p>
         ${sum('32.4 ÷ 10 = 3.24 → 4 L')}`,
        `<p><strong>Cost.</strong></p>
         ${sum('4 × 18 = 72')}
         ${ans('72')}`
      )}
      ${tip('Paint, tiles and rolls of turf are bought whole, so always round up. Type money with no $ sign.')}`,

    // Y8 4C Q13: area with letters
    'y8-4c-algebra': `
      <p class="hp-tag">Worked example: write an expression for the area of (a) a rectangle <b>4m</b> by <b>m</b>, (b) a <b>3y</b> by <b>2y</b> rectangle with a <b>y</b> by <b>y</b> square cut out.</p>
      ${steps(
        `<p><strong>Multiply the numbers, then the letters.</strong> m × m is m².</p>
         ${sum('(a) 4m × m = 4m²')}`,
        `<p><strong>Big shape take away the hole.</strong> Like terms can be combined.</p>
         ${sum('(b) 3y × 2y − y × y = 6y² − y² = 5y²')}
         ${ans('4m^2 and 5y^2')}`
      )}
      ${tip('Type a squared letter with ^, like 4m^2. Two different letters multiply side by side: 2a × 3b = 6ab.')}`,

    // Y8 4C Q14: how accuracy changes an area
    'y8-4c-accuracy': `
      <p class="hp-tag">Worked example: a square table is measured as <b>1 m</b>, then <b>97 cm</b>, then <b>968 mm</b> wide. Find each area in m².</p>
      ${steps(
        `<p><strong>Change each width to metres.</strong></p>
         ${sum('97 cm = 0.97 m<br>968 mm = 0.968 m')}`,
        `<p><strong>Square each one.</strong> Keep every decimal place.</p>
         ${sum('1 × 1 = 1<br>0.97 × 0.97 = 0.9409<br>0.968 × 0.968 = 0.937024')}
         ${ans('1, 0.9409, 0.937024')}`,
        `<p><strong>Difference in mm²:</strong> 1 m² = 1000 × 1000 = 1 000 000 mm².</p>
         ${sum('1 − 0.937024 = 0.062976 m²<br>0.062976 × 1 000 000 = 62 976 mm²')}`
      )}
      ${tip('Type the areas in the order asked, with commas between, and do not round them.')}`,

    // Y8 4C Q16: imperial area units
    'y8-4c-imperial': `
      <p class="hp-tag">Worked example: <b>1 yard = 0.9144 m</b>. (a) How many m² are in <b>50 square yards</b> (2 decimal places)? (b) How many square yards are in <b>1 hectare</b> (nearest whole)?</p>
      ${steps(
        `<p><strong>Square the length fact</strong> to get the area fact.</p>
         ${sum('1 square yard = 0.9144 × 0.9144 = 0.83612736 m²')}`,
        `<p><strong>(a) Multiply</strong> to go from square yards to m².</p>
         ${sum('50 × 0.83612736 = 41.806... → 41.81 m²')}`,
        `<p><strong>(b) Divide</strong> to go the other way. 1 ha = 10 000 m².</p>
         ${sum('10 000 ÷ 0.83612736 = 11 959.9... → 11 960')}
         ${ans('41.81 and 11960')}`
      )}
      ${tip('Chain the facts one step at a time and keep the full calculator number until the last step. For a percentage, divide the part by the whole and × 100.')}`,

    // =====================================================================
    // Y8 4D Area of special quadrilaterals
    // =====================================================================
    // Y8 4D Q1, Q4, Q6: rhombus and kite from the diagonals
    'y8-4d-diagonals': `
      <p class="hp-tag">Worked example: find the area of this kite.</p>
      ${D([
        { poly: [[0, 0], [2.5, 6], [0, 9], [-2.5, 6]], fill: true },
        { seg: [-2.5, 0, 2.5, 0], thin: true }, { seg: [2.5, 0, 2.5, 9], thin: true }, { seg: [2.5, 9, -2.5, 9], thin: true }, { seg: [-2.5, 9, -2.5, 0], thin: true },
        { seg: [0, 0, 0, 9], dash: true }, { seg: [-2.5, 6, 2.5, 6], dash: true },
        { label: '9 cm', at: [0.2, 4.4], anchor: 'start' }, { label: '5 cm', at: [-1.3, 6.4] }
      ], 'A kite with diagonals 9 cm and 5 cm, inside a 9 by 5 rectangle.', 26)}
      ${steps(
        `<p><strong>The kite fills exactly half of the rectangle around it.</strong> The rectangle is diagonal × diagonal.</p>`,
        `<p><strong>Use A = ½ × x × y</strong>, where x and y are the diagonals.</p>
         ${sum('½ × 9 × 5 = 22.5 cm²')}
         ${ans('22.5')}`
      )}
      ${tip('A rhombus works the same way. If the answer must be in m², change cm to m first (50 cm = 0.5 m). For a cost, multiply the area by the price per m².')}`,

    // Y8 4D Q3, Q9: area of a trapezium
    'y8-4d-trapezium': `
      <p class="hp-tag">Worked example: find the area of this trapezium.</p>
      ${D([
        { poly: [[0, 0], [13, 0], [7, 5], [0, 5]], fill: true },
        { angle: [0, 0, 0, 90], right: true }, { angle: [0, 5, 270, 360], right: true },
        { par: [0, 0, 13, 0], n: 1 }, { par: [0, 5, 7, 5], n: 1 },
        { dim: [0, 0, 13, 0], label: '13 m', off: -0.5 }, { dim: [7, 5, 0, 5], label: '7 m', off: -0.5 },
        { dim: [0, 5, 0, 0], label: '5 m', off: -0.5 }
      ], 'A right-angled trapezium with parallel sides 7 m and 13 m, 5 m apart.', 22)}
      ${steps(
        `<p><strong>Find the two parallel sides (a and b) and the height h</strong> between them.</p>`,
        `<p><strong>Use A = ½ × (a + b) × h.</strong> Add the parallel sides first.</p>
         ${sum('½ × (7 + 13) × 5 = ½ × 20 × 5 = 50 m²')}
         ${ans('50')}`
      )}
      ${tip('The height meets both parallel sides at right angles. A slanted side is never the height. One pair of parallel sides is what makes a shape a trapezium.')}`,

    // Y8 4D Q2: deciding which shape and which rule
    'y8-4d-which': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Shape</span><span role="columnheader">How to spot it</span><span role="columnheader">Area</span></div>
        <div class="hp-tr" role="row"><span role="cell">rhombus</span><span role="cell">4 equal sides</span><span role="cell">½xy (diagonals)</span></div>
        <div class="hp-tr" role="row"><span role="cell">kite</span><span role="cell">2 pairs of equal sides next to each other</span><span role="cell">½xy (diagonals)</span></div>
        <div class="hp-tr" role="row"><span role="cell">trapezium</span><span role="cell">1 pair of parallel sides</span><span role="cell">½(a + b)h</span></div>
      </div>
      <p class="hp-tag">Worked example: find the area of this shape.</p>
      ${D([
        { poly: [[0, 0], [8.5, 0], [6.25, 3], [1.75, 3]], fill: true },
        { par: [0, 0, 8.5, 0], n: 1 }, { par: [1.75, 3, 6.25, 3], n: 1 },
        { seg: [1.75, 3, 1.75, 0], dash: true }, { angle: [1.75, 0, 0, 90], right: true },
        { dim: [0, 0, 8.5, 0], label: '8.5 m', off: -0.5 }, { dim: [6.25, 3, 1.75, 3], label: '4.5 m', off: -0.5 },
        { label: '3 m', at: [1.95, 1.5], anchor: 'start' }
      ], 'A trapezium with parallel sides 4.5 m and 8.5 m and a dashed height of 3 m.', 30)}
      ${steps(
        `<p><strong>Name the shape.</strong> The arrows show one pair of parallel sides, so it is a trapezium.</p>`,
        `<p><strong>Use its rule.</strong></p>
         ${sum('½ × (4.5 + 8.5) × 3 = ½ × 13 × 3 = 19.5 m²')}
         ${ans('19.5')}`
      )}
      ${tip('If the picture shows dashed diagonals crossing, it is a rhombus or kite: use half of diagonal × diagonal.')}`,

    // Y8 4D Q5: composite shapes with special quadrilaterals
    'y8-4d-composite': `
      <p class="hp-tag">Worked example: a trapezium sits on top of a rectangle. Find the total area.</p>
      ${D([
        { poly: [[0, 0], [9, 0], [9, 4], [0, 4]], fill: true },
        { poly: [[0, 4], [9, 4], [7, 6], [2, 6]], fill: true },
        { dim: [0, 0, 9, 0], label: '9 cm', off: -0.5 }, { dim: [9, 0, 9, 4], label: '4 cm', off: -0.5 },
        { dim: [7, 6, 2, 6], label: '5 cm', off: -0.5 }, { dim: [9, 4, 9, 6], label: '2 cm', off: -0.5 }
      ], 'A 9 cm by 4 cm rectangle with a trapezium on top: parallel sides 9 cm and 5 cm, height 2 cm.', 26)}
      ${steps(
        `<p><strong>Rectangle.</strong></p>
         ${sum('9 × 4 = 36')}`,
        `<p><strong>Trapezium.</strong> Its parallel sides are 9 and 5, and it is 2 high.</p>
         ${sum('½ × (9 + 5) × 2 = 14')}`,
        `<p><strong>Add.</strong></p>
         ${sum('36 + 14 = 50 cm²')}
         ${ans('50')}`
      )}
      ${tip('Look for a shared edge: it is a side of both shapes, so it often gives you a length you need.')}`,

    // Y8 4D Q7: working backwards from a trapezium's area
    'y8-4d-reverse': `
      <p class="hp-tag">Worked example: a trapezium's parallel sides are <b>6 cm</b> apart, and one is <b>three times</b> the other. Its area is <b>48 cm²</b>. How long are the parallel sides?</p>
      ${steps(
        `<p><strong>Call the short side s.</strong> The long side is 3s, so together they make 4s.</p>
         ${sum('A = ½ × (s + 3s) × 6 = ½ × 4s × 6 = 12s')}`,
        `<p><strong>Solve 12s = 48.</strong></p>
         ${sum('s = 48 ÷ 12 = 4, so the long side is 3 × 4 = 12')}
         ${ans('4, 12')}`
      )}
      ${tip('Check by working forwards: ½ × (4 + 12) × 6 = 48. ✓ Type both lengths with a comma between.')}`,

    // Y8 4D Q8: rectangles inside and around a trapezium
    'y8-4d-rectangles': `
      <p class="hp-tag">Worked example: a trapezium has parallel sides <b>7 cm</b> and <b>11 cm</b>, <b>3 cm</b> apart. Compare it with the rectangles inside and around it.</p>
      ${D([
        { poly: [[0, 0], [11, 0], [11, 3], [0, 3]] },
        { poly: [[0, 0], [11, 0], [9, 3], [2, 3]], fill: true },
        { seg: [2, 3, 2, 0], dash: true }, { seg: [9, 3, 9, 0], dash: true },
        { dim: [0, 0, 11, 0], label: '11 cm', off: -0.5 }, { label: '7 cm', at: [5.5, 3.4] }, { label: '3 cm', at: [11.3, 1.5], anchor: 'start' }
      ], 'A trapezium inside an 11 by 3 rectangle, with a dashed 7 by 3 rectangle inside it.', 28)}
      ${steps(
        `<p><strong>Largest rectangle inside</strong> uses the short side. <strong>Smallest rectangle around</strong> uses the long side.</p>
         ${sum('inside: 7 × 3 = 21<br>around: 11 × 3 = 33')}`,
        `<p><strong>Average the two, and find the trapezium's area.</strong></p>
         ${sum('(21 + 33) ÷ 2 = 27<br>½ × (7 + 11) × 3 = 27')}
         ${ans('21, 33, then compare with 27')}`
      )}
      ${tip('This is why the trapezium rule works: ½(a + b) is the average of the two parallel sides.')}`,

    // Y8 4D Q10, Q12: area expressions with letters
    'y8-4d-algebra': `
      <p class="hp-tag">Worked example: write the area of (a) a rhombus with diagonals <b>4a</b> and <b>a</b>, (b) a kite with diagonals <b>6p</b> and <b>q</b>.</p>
      ${steps(
        `<p><strong>Use A = ½xy and multiply numbers, then letters.</strong></p>
         ${sum('(a) ½ × 4a × a = 2a²')}`,
        `<p><strong>Half of 6 is 3.</strong></p>
         ${sum('(b) ½ × 6p × q = 3pq')}
         ${ans('2a^2 and 3pq')}`
      )}
      <p><strong>Expanding:</strong> ½(m − n)k = ½mk − ½nk. Multiply each term inside the bracket by what is outside.</p>
      ${tip('Type squares with ^, like 2a^2. Type a half as /2 at the end: ½mk is mk/2, and ½(m + n)k is (m+n)k/2.')}`,

    // Y8 4D Q11: a rhombus with a side and a height
    'y8-4d-height': `
      <p class="hp-tag">Worked example: a rhombus has sides of <b>7 cm</b> and a perpendicular height of <b>5.5 cm</b>. Find its area.</p>
      ${D([
        { poly: [[0, 0], [7, 0], [11.33, 5.5], [4.33, 5.5]], fill: true },
        { seg: [4.33, 5.5, 4.33, 0], dash: true }, { angle: [4.33, 0, 0, 90], right: true },
        { dim: [0, 0, 7, 0], label: '7 cm', off: -0.5 }, { label: '5.5 cm', at: [4.55, 2.75], anchor: 'start' }
      ], 'A rhombus with base 7 cm and a dashed perpendicular height of 5.5 cm.', 26)}
      ${steps(
        `<p><strong>No diagonals are given</strong>, so A = ½xy cannot be used.</p>`,
        `<p><strong>A rhombus is a parallelogram</strong>, so use base × height.</p>
         ${sum('7 × 5.5 = 38.5 cm²')}
         ${ans('38.5')}`
      )}
      ${tip('Pick the rule that matches the lengths you have: diagonals → ½xy, side and height → b × h.')}`,

    // =====================================================================
    // Y8 4E Area of circles
    // =====================================================================
    // Y8 4E Q1, Q2, Q6: area of a circle with the π key
    'y8-4e-area': `
      <p class="hp-tag">Worked example: find the area of each circle, correct to 2 decimal places.</p>
      ${fig(
        { kind: 'diagram', unit: 26, items: [{ circle: [0, 0, 2.6], fill: true }, { seg: [0, 0, 2.6, 0] }, { point: [0, 0] }, { label: '4.5 m', at: [1.3, 0.55] }], alt: 'A circle with radius 4.5 m' },
        { kind: 'diagram', unit: 26, items: [{ circle: [0, 0, 2.6], fill: true }, { seg: [-2.6, 0, 2.6, 0] }, { point: [0, 0] }, { label: '11 cm', at: [0, 0.55] }], alt: 'A circle with diameter 11 cm' }
      )}
      ${steps(
        `<p><strong>Use A = πr².</strong> Square the radius first, then × π.</p>
         ${sum('A = π × 4.5² = π × 20.25 = 63.617...')}`,
        `<p><strong>Diameter given? Halve it first.</strong> 11 ÷ 2 = 5.5.</p>
         ${sum('A = π × 5.5² = π × 30.25 = 95.033...')}`,
        `<p><strong>Round to 2 decimal places.</strong> Area is in square units.</p>
         ${ans('63.62 and 95.03')}`
      )}
      ${tip('Never square the diameter: that gives an answer 4 times too big. "Nearest whole number" means no decimal places.')}`,

    // Y8 4E Q3: area with π = 22/7 or 3.14
    'y8-4e-approx': `
      <p class="hp-tag">Worked example: find the area of (a) a circle of radius <b>14 cm</b> using π = 22/7, (b) a circle of radius <b>10 m</b> using π = 3.14.</p>
      ${steps(
        `<p><strong>With 22/7, cancel the 7 first.</strong> 14 ÷ 7 = 2.</p>
         ${sum('(a) 22/7 × 14 × 14 = 22 × 2 × 14 = 616')}`,
        `<p><strong>With 3.14, square the radius, then multiply.</strong></p>
         ${sum('(b) 3.14 × 10² = 3.14 × 100 = 314')}
         ${ans('616 and 314')}`
      )}
      ${tip('Check whether the picture shows the radius or the diameter. If it is a diameter, halve it before you square.')}`,

    // Y8 4E Q4: quadrants and semicircles
    'y8-4e-parts': `
      <p class="hp-tag">Worked example: find the area of each shape, correct to 2 decimal places.</p>
      ${fig(
        { kind: 'diagram', unit: 26, alt: 'A quadrant with radius 9.5 cm', items: [
          { poly: [[0, 0], ...arcPts(0, 0, 3, 0, 90)], fill: true }, { angle: [0, 0, 0, 90], right: true }, { dim: [0, 0, 3, 0], label: '9.5 cm', off: -0.5 }] },
        { kind: 'diagram', unit: 26, alt: 'A semicircle with diameter 26 m', items: [
          { poly: arcPts(0, 0, 3, 0, 180), fill: true }, { dim: [-3, 0, 3, 0], label: '26 m', off: -0.5 }] }
      )}
      ${steps(
        `<p><strong>A quadrant is a quarter of a circle.</strong></p>
         ${sum('¼ × π × 9.5² = 70.882...')}`,
        `<p><strong>A semicircle is half.</strong> The straight edge is the diameter, so r = 26 ÷ 2 = 13.</p>
         ${sum('½ × π × 13² = 265.464...')}
         ${ans('70.88 and 265.46')}`
      )}
      ${tip('Find the radius first every time. The straight edge of a quadrant is a radius; the straight edge of a semicircle is a diameter.')}`,

    // Y8 4E Q5, Q16: the radius from the area
    'y8-4e-reverse': `
      <p class="hp-tag">Worked example: a circle has area <b>30 cm²</b>. Find its radius and its diameter, correct to 2 decimal places.</p>
      ${steps(
        `<p><strong>Undo A = πr² in reverse.</strong> Divide by π, then take the square root.</p>
         ${sum('r² = 30 ÷ π = 9.549...<br>r = √9.549... = 3.090...')}`,
        `<p><strong>The diameter is double the radius.</strong> Double the full number, not the rounded one.</p>
         ${sum('d = 2 × 3.090... = 6.180...')}
         ${ans('3.09 and 6.18')}`
      )}
      ${tip('On a calculator: √(30 ÷ π). When typing a rule, put brackets round the whole fraction inside the root, like sqrt(V/pi).')}`,

    // Y8 4E Q7, Q8: comparing with 1 m² or 1 km²
    'y8-4e-units': `
      <p class="hp-tag">Worked example: a round rug has radius <b>55 cm</b>. Is its area more than <b>1 m²</b>? By how much does it differ, to the nearest cm²?</p>
      ${steps(
        `<p><strong>Find the area in cm².</strong></p>
         ${sum('π × 55² = 9503.3... cm²')}`,
        `<p><strong>Change 1 m² into cm² so the units match.</strong></p>
         ${sum('1 m² = 100 × 100 = 10 000 cm²')}`,
        `<p><strong>Compare, then subtract.</strong> 9503.3 is less than 10 000.</p>
         ${sum('10 000 − 9503.3... = 496.7...')}
         ${ans('No, it is less, by 497')}`
      )}
      ${tip('For a diameter in km, halve it to get the radius in km, and the area comes out in km². Then compare with 1 km² directly.')}`,

    // Y8 4E Q9, Q10: comparing circle areas
    'y8-4e-compare': `
      <p class="hp-tag">Worked example: which is biggest: a circle of radius <b>2 m</b>, a semicircle of radius <b>3.5 m</b> or a quadrant of radius <b>8.5 m</b>?</p>
      ${steps(
        `<p><strong>Find each area</strong>, taking the right fraction of πr².</p>
         ${sum('circle: π × 2² = 12.57<br>semicircle: ½ × π × 3.5² = 19.24<br>quadrant: ¼ × π × 8.5² = 56.75')}`,
        `<p><strong>Compare the numbers.</strong></p>
         ${ans('the quadrant')}`
      )}
      <p><strong>A difference:</strong> mats of radius 30 cm and 31 cm differ by π × 31² − π × 30² = 3019.07 − 2827.43 = 191.64 cm² (2 decimal places).</p>
      ${tip('For a difference, find both areas with full calculator numbers, subtract, then round once at the end.')}`,

    // Y8 4E Q11: a shape with a circular hole
    'y8-4e-hole': `
      <p class="hp-tag">Worked example: a <b>10 cm</b> square tile has a round hole of diameter <b>4 cm</b>. What area is left, to the nearest whole number?</p>
      ${D([
        { poly: [[0, 0], [10, 0], [10, 10], [0, 10]], fill: true },
        { circle: [5, 5, 2] }, { seg: [3, 5, 7, 5] },
        { dim: [0, 0, 10, 0], label: '10 cm', off: -0.5 }, { label: '4 cm', at: [5, 5.5] }
      ], 'A 10 cm square with a circular hole of diameter 4 cm in the middle.', 18)}
      ${steps(
        `<p><strong>Area of the square.</strong></p>
         ${sum('10 × 10 = 100 cm²')}`,
        `<p><strong>Area of the hole.</strong> r = 4 ÷ 2 = 2.</p>
         ${sum('π × 2² = 12.566...')}`,
        `<p><strong>Take the hole away, then round.</strong></p>
         ${sum('100 − 12.566... = 87.43...')}
         ${ans('87')}`
      )}
      ${tip('Whole shape take away the hole. Round only the final answer.')}`,

    // Y8 4E Q12: squares inside and around a circle
    'y8-4e-bounds': `
      <p class="hp-tag">Worked example: a circle has radius <b>8 cm</b>. Find the area of the square around it and the square inside it.</p>
      ${D([
        { poly: [[-8, -8], [8, -8], [8, 8], [-8, 8]] },
        { circle: [0, 0, 8], fill: true },
        { poly: [[8, 0], [0, 8], [-8, 0], [0, -8]] },
        { seg: [-8, 0, 8, 0], dash: true }, { seg: [0, -8, 0, 8], dash: true },
        { label: '8', at: [4, 0.8] }
      ], 'A circle of radius 8 inside a square, with a smaller square inside the circle whose diagonals are the dashed diameters.', 12)}
      ${steps(
        `<p><strong>Outer square:</strong> its side is the diameter, 16.</p>
         ${sum('16 × 16 = 256 cm²')}`,
        `<p><strong>Inner square:</strong> the dashed diagonals cut it into 4 right-angled triangles, each with two sides of 8.</p>
         ${sum('4 × ½ × 8 × 8 = 128 cm²')}`,
        `<p><strong>The circle sits between them.</strong></p>
         ${sum('π × 8² = 201.06 cm²')}
         ${ans('256 and 128')}`
      )}
      ${tip('To compare with the average of two areas, add them and halve, then compare that with πr². With letters, (2r) × (2r) = 4r².')}`,

    // Y8 4E Q13: what happens when the radius is scaled
    'y8-4e-scale': `
      <p class="hp-tag">Worked example: a circle of radius <b>2 cm</b> has its radius multiplied by <b>5</b>. What happens to its area? Use π = 3.14.</p>
      ${steps(
        `<p><strong>Find both areas.</strong></p>
         ${sum('r = 2: 3.14 × 2² = 12.56<br>r = 10: 3.14 × 10² = 314')}`,
        `<p><strong>Divide to see how many times bigger.</strong></p>
         ${sum('314 ÷ 12.56 = 25 = 5 × 5')}
         ${ans('25')}`
      )}
      ${tip('The area grows by the scale factor squared, because the radius is used twice in r × r. Type a square with ^, like k^2.')}`,

    // Y8 4E Q14, Q15: exact areas in terms of π
    'y8-4e-exact': `
      <p class="hp-tag">Worked example: find the exact area of (a) a circle with radius <b>13 m</b>, (b) a quadrant with radius <b>16 cm</b>, (c) a circle with diameter <b>18 mm</b>.</p>
      ${steps(
        `<p><strong>Leave π as π.</strong> Square the radius and write it in front.</p>
         ${sum('(a) π × 13² = 169π')}`,
        `<p><strong>Take the fraction of the number.</strong></p>
         ${sum('(b) ¼ × π × 16² = ¼ × 256π = 64π')}`,
        `<p><strong>Diameter? Halve it first.</strong> r = 9.</p>
         ${sum('(c) π × 9² = 81π')}
         ${ans('169pi, 64pi and 81pi')}`
      )}
      ${tip('Type π as pi with the number in front: 169pi. Substituting a rule for r into A = πr² works the same way: if r = 3k, A = π × (3k)² = 9πk².')}`,

    // =====================================================================
    // Y8 4F Area of sectors and composite shapes
    // =====================================================================
    // Y8 4F Q1, Q2, Q5, Q6: area of a sector
    'y8-4f-sector': `
      <p class="hp-tag">Worked example: find the area of this sector, correct to 2 decimal places.</p>
      ${D([
        { poly: [[0, 0], ...arcPts(0, 0, 3.2, 0, 100)], fill: true },
        { angle: [0, 0, 0, 100], label: '100°', r: 0.7 }, { label: '7.5 cm', at: [1.6, -0.4] }
      ], 'A sector with radius 7.5 cm and angle 100 degrees.', 40)}
      ${steps(
        `<p><strong>What fraction of a whole circle is it?</strong> A full turn is 360°.</p>
         ${sum('100/360')}`,
        `<p><strong>Take that fraction of πr².</strong></p>
         ${sum('100/360 × π × 7.5² = 49.087...')}
         ${ans('49.09')}`
      )}
      ${tip('A quadrant is 90/360 = 1/4 of a circle. To compare two sectors, find both areas and subtract.')}`,

    // Y8 4F Q3: the angle marked is outside the sector
    'y8-4f-outside': `
      <p class="hp-tag">Worked example: the marked angle is <b>outside</b> the sector. Find the sector's area, correct to 2 decimal places.</p>
      ${D([
        { poly: [[0, 0], ...arcPts(0, 0, 3, 80, 360)], fill: true },
        { angle: [0, 0, 0, 80], label: '80°', r: 0.7 }, { label: '5.5 cm', at: [1.5, -0.4] }
      ], 'A circle of radius 5.5 cm with an 80 degree slice missing; the sector is the rest.', 34)}
      ${steps(
        `<p><strong>Find the angle inside the sector.</strong> The angles round the centre add to 360°.</p>
         ${sum('360 − 80 = 280°')}`,
        `<p><strong>Take that fraction of πr².</strong></p>
         ${sum('280/360 × π × 5.5² = 73.914...')}
         ${ans('73.91')}`
      )}
      ${tip('Look carefully at which part is shaded. A big sector (more than half a circle) needs an angle bigger than 180°.')}`,

    // Y8 4F Q4: composite shapes with circle parts
    'y8-4f-composite': `
      <p class="hp-tag">Worked example: a rectangle has a semicircle on one end. Find the area, correct to 2 decimal places.</p>
      ${D([
        { poly: [[0, 0], [8, 0], ...arcPts(8, 2.5, 2.5, -90, 90).slice(1, -1), [8, 5], [0, 5]], fill: true },
        { seg: [8, 0, 8, 5], dash: true },
        { dim: [0, 0, 8, 0], label: '8 cm', off: -0.5 }, { dim: [0, 5, 0, 0], label: '5 cm', off: -0.5 }
      ], 'A rectangle 8 cm by 5 cm with a semicircle of diameter 5 cm on the right end.', 28)}
      ${steps(
        `<p><strong>Rectangle.</strong></p>
         ${sum('8 × 5 = 40')}`,
        `<p><strong>Semicircle.</strong> Its diameter is the 5 cm end, so r = 2.5.</p>
         ${sum('½ × π × 2.5² = 9.817...')}`,
        `<p><strong>Add.</strong></p>
         ${sum('40 + 9.817... = 49.817...')}
         ${ans('49.82')}`
      )}
      ${tip('A hole or a cut-out corner is subtracted instead. A ring is the big circle take away the small circle.')}`,

    // Y8 4F Q7: an arch between two semicircles
    'y8-4f-ring': `
      <p class="hp-tag">Worked example: an arch is the region between a semicircle of radius <b>10 m</b> and one of radius <b>7 m</b>. Find its area, to the nearest whole m².</p>
      ${D([
        { poly: [...arcPts(0, 0, 5, 0, 180), ...arcPts(0, 0, 3.5, 180, 0)], fill: true },
        { dim: [0, 0, 5, 0], label: '10 m', off: -0.5 }, { label: '7 m', at: [-1.75, 0.4] }, { seg: [0, 0, -3.5, 0], dash: true }
      ], 'An arch: the space between two semicircles with radii 10 m and 7 m.', 30)}
      ${steps(
        `<p><strong>Big semicircle take away small semicircle.</strong></p>
         ${sum('½ × π × 10² − ½ × π × 7²')}`,
        `<p><strong>Work it out.</strong></p>
         ${sum('157.079... − 76.969... = 80.110...')}
         ${ans('80')}`
      )}
      ${tip('Check whether the lengths shown are radii or diameters. If they are in different units, change them first.')}`,

    // Y8 4F Q8, Q11: what percentage is shaded
    'y8-4f-percent': `
      <p class="hp-tag">Worked example: a circle of radius <b>2.5 cm</b> is drawn inside a <b>6 cm</b> by <b>9 cm</b> rectangle. What percentage of the rectangle is the circle? (1 decimal place)</p>
      ${D([
        { poly: [[0, 0], [9, 0], [9, 6], [0, 6]] }, { circle: [4.5, 3, 2.5], fill: true },
        { dim: [0, 0, 9, 0], label: '9 cm', off: -0.5 }, { dim: [9, 0, 9, 6], label: '6 cm', off: -0.5 },
        { seg: [4.5, 3, 7, 3] }, { label: '2.5 cm', at: [5.75, 3.4] }
      ], 'A circle of radius 2.5 cm inside a 6 cm by 9 cm rectangle.', 24)}
      ${steps(
        `<p><strong>Find the shaded area and the whole area.</strong></p>
         ${sum('circle: π × 2.5² = 19.634...<br>rectangle: 9 × 6 = 54')}`,
        `<p><strong>Percentage = part ÷ whole × 100.</strong></p>
         ${sum('19.634... ÷ 54 × 100 = 36.36...%')}
         ${ans('36.4')}`
      )}
      ${tip('If the shaded part is what is left outside a curve, subtract first. Type only the number, not the % sign.')}`,

    // Y8 4F Q9: an area squeezed between two others
    'y8-4f-reason': `
      <p class="hp-tag">Worked example: a semicircle of radius <b>7 cm</b> fits inside a <b>14 cm</b> by <b>7 cm</b> rectangle, and a triangle with base 14 cm and height 7 cm fits inside the semicircle. How close is the semicircle to the average of the other two? (1 decimal place)</p>
      ${D([
        { poly: [[-7, 0], [7, 0], [7, 7], [-7, 7]] },
        { poly: arcPts(0, 0, 7, 0, 180), fill: true },
        { poly: [[-7, 0], [7, 0], [0, 7]] },
        { dim: [-7, 0, 7, 0], label: '14 cm', off: -0.5 }, { dim: [7, 0, 7, 7], label: '7 cm', off: -0.5 }
      ], 'A semicircle of radius 7 between a 14 by 7 rectangle around it and a triangle inside it.', 22)}
      ${steps(
        `<p><strong>Areas of the rectangle and the triangle.</strong></p>
         ${sum('14 × 7 = 98<br>½ × 14 × 7 = 49')}`,
        `<p><strong>Their average, and the semicircle.</strong></p>
         ${sum('(98 + 49) ÷ 2 = 73.5<br>½ × π × 7² = 76.969...')}`,
        `<p><strong>The gap between them.</strong></p>
         ${sum('76.969... − 73.5 = 3.469...')}
         ${ans('3.5')}`
      )}
      ${tip('The curved area always sits between the shape inside it and the shape around it.')}`,

    // Y8 4F Q10: exact areas in terms of π
    'y8-4f-exact': `
      <p class="hp-tag">Worked example: find the exact area of (a) a <b>160°</b> sector of radius <b>9 m</b>, (b) a ring with radii <b>7 cm</b> and <b>4 cm</b>.</p>
      ${steps(
        `<p><strong>Simplify the fraction first.</strong> 160/360 = 4/9.</p>
         ${sum('(a) 4/9 × π × 9² = 4/9 × 81π = 36π')}`,
        `<p><strong>Big circle take away small circle.</strong></p>
         ${sum('(b) π × 7² − π × 4² = 49π − 16π = 33π')}
         ${ans('36pi and 33pi')}`
      )}
      <p><strong>Plain numbers stay separate:</strong> a square of side 8 with a quadrant of radius 8 removed leaves 64 − ¼ × 64π = 64 − 16π.</p>
      ${tip('Type π as pi: 36pi. A plain number and a π part are typed side by side, like 64-16pi.')}`,

    // Y8 4F Q12: the sprinkler problem
    'y8-4f-sprinkler': `
      <p class="hp-tag">Worked example: a sprinkler at O waters a semicircle of radius <b>5 m</b>. The lawn's edge is <b>4 m</b> from O, and the circle crosses it at B, <b>3 m</b> above C. Angle AOB is about <b>36.87°</b>. Find the area outside the lawn (region ABC) and the percentage wasted.</p>
      ${D([
        { poly: arcPts(0, 0, 5, 0, 180), fill: true },
        { seg: [-4, 0, -4, 5.5], dash: true },
        { seg: [0, 0, -4, 3] }, { seg: [-5, 0, 5, 0] },
        { angle: [0, 0, 143.13, 180], label: '36.87°', r: 1.7 }, { angle: [-4, 0, 0, 90], right: true },
        { point: [0, 0], name: 'O', pos: 's' }, { point: [-5, 0], name: 'A', pos: 'sw' },
        { point: [-4, 3], name: 'B', pos: 'nw' }, { point: [-4, 0], name: 'C', pos: 's' },
        { label: '3 m', at: [-3.7, 1.5], anchor: 'start' }, { label: 'lawn', at: [1.5, 5.7] }
      ], 'A semicircle of radius 5 centred at O. A dashed edge 4 m left of O meets the curve at B, 3 m above C. A is the left end of the diameter.', 30)}
      ${steps(
        `<p><strong>Area of sector OAB.</strong></p>
         ${sum('36.87/360 × π × 5² = 8.04...')}`,
        `<p><strong>Take away triangle OCB</strong> (right angle at C), which is on the lawn.</p>
         ${sum('½ × 4 × 3 = 6<br>8.04... − 6 = 2.04 m²')}`,
        `<p><strong>Percentage of the whole semicircle.</strong></p>
         ${sum('½ × π × 5² = 39.27...<br>2.04... ÷ 39.27... × 100 = 5.2%')}
         ${ans('2.04 and 5.2')}`
      )}
      ${tip('Draw the triangle in before you start: region = sector − triangle. Keep full calculator numbers for the percentage.')}`,

    // =====================================================================
    // Y8 4G Surface area of prisms
    // =====================================================================
    // Y8 4G Q1, Q5, Q6: surface area of a rectangular prism
    'y8-4g-rect': `
      <p class="hp-tag">Worked example: find the surface area of this box.</p>
      ${D(box(8, 2, 5, ['8 cm', '2 cm', '5 cm']), 'A rectangular prism 8 cm long, 5 cm deep and 2 cm high.', 30)}
      ${steps(
        `<p><strong>A box has 6 faces in 3 matching pairs.</strong> Find one of each pair.</p>
         ${sum('top: 8 × 5 = 40<br>front: 8 × 2 = 16<br>side: 5 × 2 = 10')}`,
        `<p><strong>Add them and double</strong>, for the opposite faces.</p>
         ${sum('2 × (40 + 16 + 10) = 132 cm²')}
         ${ans('132')}`
      )}
      ${tip('No lid? Leave out one top face. To change cm² to m², divide by 10 000. A cube has 6 equal square faces.')}`,

    // Y8 4G Q2, Q3, Q7: surface area of any right prism
    'y8-4g-tri': `
      <p class="hp-tag">Worked example: find the surface area of this triangular prism.</p>
      ${D([...wedge(6, 4.5, 4, ['12 m', '9 m', '4 m']), { label: '15 m', at: [3.4, 2.7], anchor: 'start' }], 'A triangular prism. The triangle has sides 9 m, 12 m and 15 m with a right angle, and the prism is 4 m long.', 34)}
      ${steps(
        `<p><strong>The two triangle ends.</strong></p>
         ${sum('2 × ½ × 12 × 9 = 108')}`,
        `<p><strong>The three rectangles</strong>, one for each side of the triangle, all 4 m long.</p>
         ${sum('12 × 4 + 9 × 4 + 15 × 4 = 48 + 36 + 60 = 144')}`,
        `<p><strong>Add.</strong></p>
         ${sum('108 + 144 = 252 m²')}
         ${ans('252')}`
      )}
      ${tip('For any prism: SA = 2 × area of the end + perimeter of the end × length. Here that is 108 + 36 × 4. It works for L shapes and trapeziums too.')}`,

    // Y8 4G Q4: a prism with parallelogram ends
    'y8-4g-ends': `
      <p class="hp-tag">Worked example: a prism <b>10 cm</b> long has parallelogram ends with base <b>6 cm</b>, slanted side <b>4 cm</b> and height <b>3 cm</b>. Find its surface area.</p>
      ${D([
        { poly: [[6, 0], [8.646, 3], [11.646, 5], [9, 2]], fill: true },
        { poly: [[2.646, 3], [8.646, 3], [11.646, 5], [5.646, 5]], fill: true },
        { poly: [[0, 0], [6, 0], [8.646, 3], [2.646, 3]], fill: true },
        { seg: [2.646, 3, 2.646, 0], dash: true },
        { dim: [0, 0, 6, 0], label: '6 cm', off: -0.5 }, { dim: [6, 0, 9, 2], label: '10 cm', off: -0.5 },
        { label: '4 cm', at: [1, 1.8], anchor: 'end' }, { label: '3 cm', at: [2.85, 1.5], anchor: 'start' }
      ], 'A prism with parallelogram ends: base 6 cm, slanted side 4 cm, height 3 cm, length 10 cm.', 28)}
      ${steps(
        `<p><strong>Two ends:</strong> A = bh for a parallelogram.</p>
         ${sum('2 × 6 × 3 = 36')}`,
        `<p><strong>Four rectangles:</strong> two use the 6 cm edge and two use the slanted 4 cm edge. The height is not an edge.</p>
         ${sum('2 × 6 × 10 + 2 × 4 × 10 = 120 + 80 = 200')}`,
        `<p><strong>Add.</strong></p>
         ${sum('36 + 200 = 236 cm²')}
         ${ans('236')}`
      )}
      ${tip('The dashed height is only for the area of the ends. The side faces are made from the real edges you would touch.')}`,

    // Y8 4G Q8: cost of covering a solid
    'y8-4g-cost': `
      <p class="hp-tag">Worked example: a box <b>1.5 m</b> by <b>1 m</b> by <b>0.8 m</b> is covered in fabric that costs <b>$9 per m²</b>. Find the cost.</p>
      ${steps(
        `<p><strong>Surface area: three pairs of faces.</strong></p>
         ${sum('2 × (1.5 × 1 + 1.5 × 0.8 + 1 × 0.8)<br>= 2 × (1.5 + 1.2 + 0.8) = 7 m²')}`,
        `<p><strong>Multiply by the price of one m².</strong></p>
         ${sum('7 × 9 = 63')}
         ${ans('63')}`
      )}
      ${tip('List every face first (floor, walls, roof, ends) so none is missed. Type money with no $ sign, and give cents to 2 decimal places, like 41.70.')}`,

    // Y8 4G Q9: a rule for surface area
    'y8-4g-rule': `
      <p class="hp-tag">Worked example: a box is <b>3x</b> long, <b>x</b> wide and <b>x</b> high. Write a rule for its surface area A.</p>
      ${steps(
        `<p><strong>Find one face of each pair.</strong></p>
         ${sum('top: 3x × x = 3x²<br>front: 3x × x = 3x²<br>end: x × x = x²')}`,
        `<p><strong>Double, then collect like terms.</strong></p>
         ${sum('A = 2 × (3x² + 3x² + x²) = 2 × 7x² = 14x²')}
         ${ans('A = 14x^2')}`
      )}
      ${tip('Type squares with ^, like 14x^2. Different letters cannot be collected: 2lw + 2lh stays as it is.')}`,

    // Y8 4G Q11: scaling the side lengths
    'y8-4g-scale': `
      <p class="hp-tag">Worked example: a <b>1 by 2 by 3 cm</b> box has every length multiplied by <b>5</b>. What happens to its surface area?</p>
      ${steps(
        `<p><strong>Find both surface areas.</strong></p>
         ${sum('2 × (1 × 2 + 1 × 3 + 2 × 3) = 22<br>5 by 10 by 15: 2 × (50 + 75 + 150) = 550')}`,
        `<p><strong>Divide.</strong></p>
         ${sum('550 ÷ 22 = 25 = 5 × 5')}
         ${ans('25')}`
      )}
      ${tip('Every face gets 5 times longer and 5 times wider, so area is multiplied by the scale factor squared. Type a square as n^2.')}`,

    // Y8 4G Q12: an open box made of thick wood
    'y8-4g-thick': `
      <p class="hp-tag">Worked example: an open cube box has outside side <b>20 cm</b> and wood <b>1 cm</b> thick. Find the total surface area, inside and out.</p>
      ${steps(
        `<p><strong>Outside:</strong> 5 faces (no lid).</p>
         ${sum('5 × 20 × 20 = 2000')}`,
        `<p><strong>Inside:</strong> the floor is 20 − 2 = 18 wide. The walls are 18 wide and 20 − 1 = 19 deep.</p>
         ${sum('floor: 18 × 18 = 324<br>walls: 4 × 18 × 19 = 1368')}`,
        `<p><strong>Top edges:</strong> the outer square take away the inner square. Then add everything.</p>
         ${sum('20 × 20 − 18 × 18 = 76<br>2000 + 324 + 1368 + 76 = 3768 cm²')}
         ${ans('3768')}`
      )}
      ${tip('Inside widths lose two thicknesses (one each side), but the inside depth loses only one, because there is no lid.')}`,

    // =====================================================================
    // Y8 4H Volume and capacity
    // =====================================================================
    // Y8 4H Q1, Q2, Q13: volume of a rectangular prism
    'y8-4h-volume': `
      <p class="hp-tag">Worked example: find the volume of this rectangular prism.</p>
      ${D(box(6.5, 3, 4, ['6.5 cm', '3 cm', '4 cm']), 'A rectangular prism 6.5 cm long, 4 cm deep and 3 cm high.', 32)}
      ${steps(
        `<p><strong>Find the area of the base.</strong> That is how many 1 cm cubes fit in one layer.</p>
         ${sum('6.5 × 4 = 26 cm²')}`,
        `<p><strong>Multiply by the height</strong> (the number of layers).</p>
         ${sum('26 × 3 = 78 cm³')}
         ${ans('78')}`
      )}
      ${tip('V = l × w × h, in any order. A cube has all edges equal: a 6 cm cube is 6 × 6 × 6 = 216 cm³. Volume is in cubic units.')}`,

    // Y8 4H Q3: converting capacity units
    'y8-4h-convert': `
      ${flow(['start', 'ML'], ['× 1000', 'kL'], ['× 1000', 'L'], ['× 1000', 'mL'])}
      ${chips(['1 mL = 1 cm³'], ['1 L = 1000 cm³'], ['1 m³ = 1000 L'])}
      <p class="hp-tag">Worked example: convert <b>2.5 kL</b> to L, <b>4800 mL</b> to L, and <b>650 cm³</b> to L.</p>
      ${steps(
        `<p><strong>To a smaller unit, multiply by 1000.</strong></p>
         ${sum('2.5 × 1000 = 2500 L')}`,
        `<p><strong>To a bigger unit, divide by 1000.</strong></p>
         ${sum('4800 ÷ 1000 = 4.8 L')}`,
        `<p><strong>cm³ and mL are the same size.</strong></p>
         ${sum('650 cm³ = 650 mL = 0.65 L')}
         ${ans('2500, 4.8 and 0.65')}`
      )}
      ${tip('Every step on the capacity ladder is 1000. Check: a smaller unit gives a bigger number.')}`,

    // Y8 4H Q4, Q8: capacity of a container
    'y8-4h-capacity': `
      <p class="hp-tag">Worked example: find the capacity in litres of (a) a tank <b>50 cm</b> by <b>40 cm</b> by <b>35 cm</b>, (b) a pool <b>4 m</b> by <b>2.5 m</b> by <b>1.2 m</b>.</p>
      ${steps(
        `<p><strong>Find the volume first.</strong></p>
         ${sum('(a) 50 × 40 × 35 = 70 000 cm³<br>(b) 4 × 2.5 × 1.2 = 12 m³')}`,
        `<p><strong>Change to litres.</strong> 1000 cm³ = 1 L and 1 m³ = 1000 L.</p>
         ${sum('(a) 70 000 ÷ 1000 = 70 L<br>(b) 12 × 1000 = 12 000 L')}
         ${ans('70 and 12000')}`
      )}
      ${tip('Water: 1 L has a mass of 1 kg, so the full tank in (a) holds 70 kg of water. Type big answers with no spaces.')}`,

    // Y8 4H Q5, Q7, Q11: big volume units
    'y8-4h-bigunits': `
      <p class="hp-tag">Worked example: a dam holds <b>3200 m³</b>. Write this in litres, kilolitres and megalitres.</p>
      ${steps(
        `<p><strong>1 m³ = 1000 L = 1 kL.</strong></p>
         ${sum('3200 × 1000 = 3 200 000 L<br>3200 m³ = 3200 kL')}`,
        `<p><strong>1 ML = 1000 kL</strong>, so divide by 1000.</p>
         ${sum('3200 ÷ 1000 = 3.2 ML')}
         ${ans('3200000, 3200 and 3.2')}`
      )}
      <p><strong>m³ into cm³:</strong> change each side to cm first. A cube with 0.5 m sides is 50 cm each way: 50 × 50 × 50 = 125 000 cm³.</p>
      ${tip('For a leak or a pump: time = total amount ÷ amount per day, in the same units.')}`,

    // Y8 4H Q6: filling at a rate
    'y8-4h-rate': `
      <p class="hp-tag">Worked example: a tank <b>1.2 m</b> long, <b>50 cm</b> wide and <b>40 cm</b> high is filled at <b>4 L every 15 seconds</b>. How many minutes does it take?</p>
      ${steps(
        `<p><strong>Use one unit, cm, then find the capacity.</strong></p>
         ${sum('120 × 50 × 40 = 240 000 cm³ = 240 L')}`,
        `<p><strong>How many lots of 4 L?</strong> Each lot takes 15 seconds.</p>
         ${sum('240 ÷ 4 = 60 lots<br>60 × 15 = 900 seconds')}`,
        `<p><strong>Change to minutes.</strong></p>
         ${sum('900 ÷ 60 = 15')}
         ${ans('15')}`
      )}
      ${tip('Mixed units (m and cm) are the trap here. Change them all to cm, then 1000 cm³ = 1 L.')}`,

    // Y8 4H Q9, Q12: counting whole-number prisms and cubes
    'y8-4h-count': `
      <p class="hp-tag">Worked example: how many different rectangular prisms with whole-number sides have a volume of <b>30</b> cubic units?</p>
      ${steps(
        `<p><strong>List the sets of three numbers that multiply to 30.</strong> Keep them in order, smallest first, so you do not count one twice.</p>
         ${sum('1 × 1 × 30<br>1 × 2 × 15<br>1 × 3 × 10<br>1 × 5 × 6<br>2 × 3 × 5')}`,
        `<p><strong>Count them.</strong></p>
         ${ans('5')}`
      )}
      <p><strong>Cubes:</strong> cube-shaped containers with whole-cm sides holding less than 800 mL: 9 × 9 × 9 = 729 is under 800 but 10 × 10 × 10 = 1000 is over, so sides 1 to 9 work: 9 containers.</p>
      ${tip('A prime number only has one prism: 1 × 1 × the number.')}`,

    // Y8 4H Q14: half a prism, and triangular prisms
    'y8-4h-half': `
      <p class="hp-tag">Worked example: a prism <b>11 cm</b> long, <b>4 cm</b> high and <b>3 cm</b> deep is cut in half along a diagonal of its ends. Find the volume of one half.</p>
      ${D([
        ...wedge(11, 4, 3, ['11 cm', '4 cm', '3 cm']),
        { seg: [11, 0, 11, 4], dash: true }, { seg: [0, 4, 11, 4], dash: true },
        { seg: [11, 4, 12.35, 4.96], dash: true }, { seg: [1.35, 4.96, 12.35, 4.96], dash: true }, { seg: [12.35, 4.96, 12.35, 0.96], dash: true }
      ], 'A triangular half of a rectangular prism 11 cm by 4 cm by 3 cm; dashed lines show the removed half.', 30)}
      ${steps(
        `<p><strong>Volume of the whole box.</strong></p>
         ${sum('11 × 4 × 3 = 132 cm³')}`,
        `<p><strong>The cut makes two identical halves.</strong></p>
         ${sum('132 ÷ 2 = 66 cm³')}
         ${ans('66')}`
      )}
      ${tip('Any triangular prism: ½ × base × height of the triangle × length. For a trapezium end, split it into a rectangle and a triangle. A piece cut off is subtracted.')}`,

    // =====================================================================
    // Y8 4I Volume of prisms and cylinders
    // =====================================================================
    // Y8 4I Q1, Q2: V = Ah when the end area is given
    'y8-4i-ah': `
      <p class="hp-tag">Worked example: the end of this prism has area <b>15 m²</b> and the prism is <b>8 m</b> long. Find its volume.</p>
      ${D([
        { poly: [[4, 0], [4, 2.5], [6.2, 4.1], [6.2, 1.6]], fill: true },
        { poly: [[4, 2.5], [2, 4.2], [4.2, 5.8], [6.2, 4.1]], fill: true },
        { poly: [[0, 0], [4, 0], [4, 2.5], [2, 4.2], [0, 2.5]], fill: true },
        { label: 'A = 15 m²', at: [2, 1.5] }, { dim: [4, 0, 6.2, 1.6], label: '8 m', off: -0.5 }
      ], 'A prism with a house-shaped end of area 15 square metres and a length of 8 m.', 34)}
      ${steps(
        `<p><strong>A prism is the same shape all the way through.</strong> Its volume is the end area × the length (the "height" of the prism).</p>`,
        `<p><strong>Use V = A × h.</strong></p>
         ${sum('V = 15 × 8 = 120 m³')}
         ${ans('120')}`
      )}
      ${tip('h is the distance between the two matching ends, even when the prism lies on its side. Area is in square units, volume in cubic units.')}`,

    // Y8 4I Q3, Q9: prisms with triangle or trapezium ends
    'y8-4i-prism': `
      <p class="hp-tag">Worked example: find the volume of this prism with trapezium ends.</p>
      ${D([
        { poly: [[10, 0], [8, 3], [11.15, 5.24], [13.15, 2.24]], fill: true },
        { poly: [[2, 3], [8, 3], [11.15, 5.24], [5.15, 5.24]], fill: true },
        { poly: [[0, 0], [10, 0], [8, 3], [2, 3]], fill: true },
        { seg: [2, 3, 2, 0], dash: true },
        { dim: [0, 0, 10, 0], label: '10 cm', off: -0.5 }, { label: '6 cm', at: [5, 2.5] },
        { label: '3 cm', at: [2.2, 1.5], anchor: 'start' }, { dim: [10, 0, 13.15, 2.24], label: '7 cm', off: -0.5 }
      ], 'A prism 7 cm long whose trapezium ends have parallel sides 6 cm and 10 cm and height 3 cm.', 26)}
      ${steps(
        `<p><strong>Area of the end.</strong> A trapezium: ½ × (a + b) × h.</p>
         ${sum('A = ½ × (6 + 10) × 3 = 24 cm²')}`,
        `<p><strong>Multiply by the length of the prism.</strong></p>
         ${sum('V = 24 × 7 = 168 cm³')}
         ${ans('168')}`
      )}
      ${tip('Triangle end: A = ½bh. For a capacity in litres, 1 m³ = 1000 L. Time to fill = capacity ÷ litres per hour.')}`,

    // Y8 4I Q4: volume of a cylinder
    'y8-4i-cylinder': `
      <p class="hp-tag">Worked example: find the volume of this cylinder, correct to 2 decimal places.</p>
      ${D(cyl(2.25, 5, '4.5 cm', '10 cm'), 'A cylinder with radius 4.5 cm and height 10 cm.', 30)}
      ${steps(
        `<p><strong>The end is a circle</strong>, so its area is πr².</p>
         ${sum('A = π × 4.5² = 63.617...')}`,
        `<p><strong>V = πr²h:</strong> multiply by the height.</p>
         ${sum('V = 63.617... × 10 = 636.172...')}
         ${ans('636.17')}`
      )}
      ${tip('If the picture shows the diameter (a line right across), halve it first. Do it in one go on a calculator: π × 4.5² × 10.')}`,

    // Y8 4I Q5, Q6, Q7, Q8: cylinder problems in litres
    'y8-4i-tanks': `
      <p class="hp-tag">Worked example: a cylindrical bucket has radius <b>15 cm</b> and height <b>30 cm</b>. How many full <b>750 mL</b> bottles can it fill?</p>
      ${steps(
        `<p><strong>Volume in cm³.</strong></p>
         ${sum('π × 15² × 30 = 21 205.75... cm³')}`,
        `<p><strong>cm³ and mL are the same</strong>, so this is 21 205.75 mL. Divide by one bottle.</p>
         ${sum('21 205.75... ÷ 750 = 28.27...')}`,
        `<p><strong>Only completely full bottles count</strong>, so round down.</p>
         ${ans('28')}`
      )}
      ${tip('Air space = volume of the container − volume of what is inside. To compare two tanks in litres, find both in m³, subtract, then × 1000.')}`,

    // Y8 4I Q10: exact volumes in terms of π
    'y8-4i-exact': `
      <p class="hp-tag">Worked example: find the exact volume of a cylinder with (a) radius <b>9 m</b> and height <b>2 m</b>, (b) diameter <b>16 cm</b> and height <b>3 cm</b>.</p>
      ${steps(
        `<p><strong>Leave π as π.</strong> Multiply the plain numbers together.</p>
         ${sum('(a) π × 9² × 2 = π × 81 × 2 = 162π')}`,
        `<p><strong>Diameter? Halve it first.</strong> r = 8.</p>
         ${sum('(b) π × 8² × 3 = π × 64 × 3 = 192π')}
         ${ans('162pi and 192pi')}`
      )}
      ${tip('Type π as pi with the number in front, like 162pi. No × sign is needed.')}`,

    // Y8 4I Q11, Q12: height from the volume, and equal volumes
    'y8-4i-height': `
      <p class="hp-tag">Worked example: a cylinder has volume <b>400 cm³</b> and radius <b>5.5 cm</b>. Find its height, correct to 2 decimal places.</p>
      ${steps(
        `<p><strong>Write V = πr²h with what you know.</strong></p>
         ${sum('400 = π × 5.5² × h = 95.033... × h')}`,
        `<p><strong>Divide by the number in front of h.</strong></p>
         ${sum('h = 400 ÷ 95.033... = 4.209...')}
         ${ans('4.21')}`
      )}
      <p><strong>With letters:</strong> a 3k by k by k box and a cylinder of radius k and height h have equal volumes. So 3k³ = πk²h. Divide both sides by πk²: h = 3k/π.</p>
      ${tip('Type it as h = 3k/pi. On a calculator, put brackets round the bottom: 400 ÷ (π × 5.5²).')}`,

    // Y8 4I Q13: composite solids
    'y8-4i-composite': `
      <p class="hp-tag">Worked example: a box <b>9 cm</b> long, <b>7 cm</b> wide and <b>5 cm</b> high has half a cylinder on top, as long as the box and as wide. Find the volume, correct to 2 decimal places.</p>
      ${D([
        { poly: [[3.5, 0], [3.5, 2.5], [5.525, 3.94], [5.525, 1.44]], fill: true },
        { poly: [...arcPts(1.75, 2.5, 1.75, 0, 125.4), ...arcPts(3.775, 3.94, 1.75, 125.4, 0)], fill: true },
        { poly: [[0, 0], [3.5, 0], [3.5, 2.5], ...arcPts(1.75, 2.5, 1.75, 0, 180).slice(1, -1), [0, 2.5]], fill: true },
        { seg: [0, 2.5, 3.5, 2.5], dash: true },
        { dim: [0, 0, 3.5, 0], label: '7 cm', off: -0.5 }, { dim: [3.5, 0, 5.525, 1.44], label: '9 cm', off: -0.5 },
        { dim: [0, 2.5, 0, 0], label: '5 cm', off: -0.5 }
      ], 'A box 7 cm wide, 5 cm high and 9 cm long with a half-cylinder of diameter 7 cm lying along its top.', 40)}
      ${steps(
        `<p><strong>The box.</strong></p>
         ${sum('9 × 7 × 5 = 315')}`,
        `<p><strong>Half a cylinder:</strong> its diameter is 7, so r = 3.5, and it is 9 long.</p>
         ${sum('½ × π × 3.5² × 9 = 173.180...')}`,
        `<p><strong>Add.</strong></p>
         ${sum('315 + 173.180... = 488.180...')}
         ${ans('488.18')}`
      )}
      ${tip('A pipe is the outer cylinder take away the inner one. A quarter cylinder is ¼ × πr²h.')}`,

    // =====================================================================
    // Y8 4J Units of time and time zones
    // =====================================================================
    // Y8 4J Q1, Q2, Q18, Q19: converting units of time
    'y8-4j-convert': `
      ${flow(['start', 'weeks'], ['× 7', 'days'], ['× 24', 'hours'], ['× 60', 'min'], ['× 60', 's'])}
      <p>Smaller than a second: 1 s = 1000 milliseconds = 1 000 000 microseconds = 1 000 000 000 nanoseconds.</p>
      <p class="hp-tag">Worked example: convert <b>6 days</b> to minutes, and <b>14 400 s</b> to hours.</p>
      ${steps(
        `<p><strong>Going right, multiply at each step.</strong></p>
         ${sum('6 × 24 = 144 hours<br>144 × 60 = 8640 minutes')}`,
        `<p><strong>Going left, divide at each step.</strong></p>
         ${sum('14 400 ÷ 60 = 240 minutes<br>240 ÷ 60 = 4 hours')}
         ${ans('8640 and 4')}`
      )}
      ${tip('One number for a whole trip: days to minutes is 24 × 60 = 1440. To go back, divide by it. A decimal answer, like 1000 days = 142.86 weeks, is rounded as asked.')}`,

    // Y8 4J Q3: times before and after
    'y8-4j-clock': `
      <p class="hp-tag">Worked example: what time is (a) <b>3¾ hours after 9:50 a.m.</b>, (b) <b>4¼ hours before 1:10 p.m.</b>?</p>
      ${steps(
        `<p><strong>Change the fraction of an hour to minutes.</strong></p>
         ${sum('¾ hour = 45 min, ¼ hour = 15 min')}`,
        `<p><strong>(a) Add the hours, then the minutes.</strong></p>
         ${sum('9:50 a.m. + 3 h = 12:50 p.m.<br>12:50 p.m. + 45 min = 1:35 p.m.')}`,
        `<p><strong>(b) Take away the hours, then the minutes.</strong></p>
         ${sum('1:10 p.m. − 4 h = 9:10 a.m.<br>9:10 a.m. − 15 min = 8:55 a.m.')}
         ${ans('1:35 pm and 8:55 am')}`
      )}
      ${tip('Type a time like 1:35 pm. Crossing 12 o\'clock swaps a.m. and p.m.')}`,

    // Y8 4J Q4, Q5: 24-hour time and rounding
    'y8-4j-24h': `
      <p class="hp-tag">Worked example: write <b>7:25 p.m.</b> in 24-hour time, and <b>0310</b> and <b>1456</b> as a.m./p.m. times.</p>
      ${steps(
        `<p><strong>p.m. times (after midday): add 12 to the hour.</strong></p>
         ${sum('7 + 12 = 19, so 7:25 p.m. = 1925')}`,
        `<p><strong>Back again:</strong> under 12 is a.m.; 13 or more, take away 12 and it is p.m.</p>
         ${sum('0310 = 3:10 am<br>1456: 14 − 12 = 2, so 2:56 pm')}
         ${ans('1925, 3:10 am, 2:56 pm')}`
      )}
      <p><strong>Rounding to the nearest hour:</strong> 30 minutes or more rounds up. 2:38 p.m. → 3:00 pm, and 0714 → 0700.</p>
      ${tip('24-hour time always has 4 digits and no colon: 0310, not 310. Midnight is 0000.')}`,

    // Y8 4J Q6, Q12: how long between two times
    'y8-4j-diff': `
      <p class="hp-tag">Worked example: how long is it from <b>7:38 a.m.</b> to <b>2:15 p.m.</b>?</p>
      ${steps(
        `<p><strong>Jump to the next whole hour.</strong></p>
         ${sum('7:38 → 8:00 is 22 min')}`,
        `<p><strong>Jump whole hours, then the last minutes.</strong></p>
         ${sum('8:00 a.m. → 2:00 p.m. is 6 h<br>2:00 → 2:15 is 15 min')}`,
        `<p><strong>Add the pieces.</strong></p>
         ${sum('6 h + 22 min + 15 min = 6 h 37 min')}
         ${ans('6, 37')}`
      )}
      <p><strong>Overnight:</strong> 11:25 p.m. to 6:10 a.m. is 35 min to midnight, then 6 h 10 min, so 6 h 45 min.</p>
      ${tip('Type the hours, then the minutes, with a comma between: 6, 37. A number line with jumps drawn on it helps.')}`,

    // Y8 4J Q7, Q8, Q9, Q13: time zones
    'y8-4j-zones': `
      <p class="hp-tag">Worked example: when it is <b>4 p.m.</b> in Japan (UTC +9), what time is it in Greece (UTC +2)?</p>
      ${steps(
        `<p><strong>Find the difference between the zones.</strong></p>
         ${sum('9 − 2 = 7 hours')}`,
        `<p><strong>Decide which way.</strong> Greece has the smaller number, so it is behind: take away.</p>
         ${sum('4 p.m. − 7 h = 9 a.m.')}
         ${ans('9:00 am')}`
      )}
      <p><strong>Halves and minus signs:</strong> Thailand (+7) and India (+5.5) differ by 7 − 5.5 = 1.5 hours. A zone of −3 and one of +8 differ by 8 − (−3) = 11 hours.</p>
      ${tip('Going through UTC is safe too: Japan 4 p.m. is UTC 7 a.m. (take 9), and Greece is UTC + 2, so 9 a.m. For a time window, test both the earliest and the latest times.')}`,

    // Y8 4J Q15, Q16, Q17: flights and events across time zones
    'y8-4j-travel': `
      <p class="hp-tag">Worked example: a <b>13-hour</b> flight leaves Perth (UTC +8) at <b>10:30 p.m. on 5 May</b> for Dubai (UTC +4). What is the local time and date when it lands?</p>
      ${steps(
        `<p><strong>Add the flight time in the starting city's time.</strong></p>
         ${sum('10:30 p.m. 5 May + 13 h = 11:30 a.m. 6 May (Perth time)')}`,
        `<p><strong>Change to the arrival city's time.</strong> Dubai is 8 − 4 = 4 hours behind Perth.</p>
         ${sum('11:30 a.m. − 4 h = 7:30 a.m. 6 May')}
         ${ans('7:30 am on 6 May')}`
      )}
      ${tip('Do the clock first, then the zone change, and watch for midnight: passing it moves the date on by one day.')}`,

    // Y8 4J Q10, Q11: adding and subtracting times
    'y8-4j-add': `
      <p class="hp-tag">Worked example: add <b>4 min 38 s</b>, <b>5 min 49 s</b> and <b>2 min 15 s</b>.</p>
      ${steps(
        `<p><strong>Add the seconds and the minutes separately.</strong></p>
         ${sum('seconds: 38 + 49 + 15 = 102<br>minutes: 4 + 5 + 2 = 11')}`,
        `<p><strong>Every 60 seconds makes a minute.</strong></p>
         ${sum('102 s = 1 min 42 s<br>11 min + 1 min 42 s = 12 min 42 s')}
         ${ans('12, 42')}`
      )}
      <p><strong>Big gaps:</strong> 210 million years ago and 66 million years ago are 210 − 66 = 144 million years apart. Type just 144 if the answer is in millions.</p>
      ${tip('Type the minutes, then the seconds, with a comma between. Never treat 102 seconds as 1.02 minutes: there are 60 seconds in a minute, not 100.')}`,

    // Y8 4J Q14: pay per day, hour, minute and second
    'y8-4j-pay': `
      <p class="hp-tag">Worked example: a worker earns <b>$165 600</b> a year, working <b>46 weeks</b>, <b>5 days</b> a week, <b>8 hours</b> a day. Find the pay per day, hour, minute and second.</p>
      ${steps(
        `<p><strong>Days worked in a year, then pay per day.</strong></p>
         ${sum('46 × 5 = 230 days<br>165 600 ÷ 230 = $720 per day')}`,
        `<p><strong>Keep dividing down the ladder.</strong></p>
         ${sum('720 ÷ 8 = $90 per hour<br>90 ÷ 60 = $1.50 per minute')}`,
        `<p><strong>Per second, in cents:</strong> $1 = 100 cents.</p>
         ${sum('1.50 ÷ 60 = $0.025 = 2.5 cents')}
         ${ans('720, 90, 1.5, 2.5')}`
      )}
      ${tip('Type money with no $ sign. When the answer is in cents, multiply dollars by 100.')}`,

    // Y8 4J Q20: what day of the week
    'y8-4j-day': `
      <p class="hp-tag">Worked example: a birthday is on a <b>Monday</b> this year. The next four years have <b>365</b>, <b>365</b>, <b>366</b> and <b>365</b> days. What day is it on in 4 years' time?</p>
      ${steps(
        `<p><strong>365 days is 52 weeks and 1 day</strong>, so the day moves on by 1. A 366-day year moves it on by 2.</p>
         ${sum('365 = 52 × 7 + 1')}`,
        `<p><strong>Add up the moves.</strong></p>
         ${sum('1 + 1 + 2 + 1 = 5 days on')}`,
        `<p><strong>Count on from Monday.</strong> Tue, Wed, Thu, Fri, Sat.</p>
         ${ans('Saturday')}`
      )}
      ${tip('Whole weeks never change the day. Only the leftover days count.')}`,

    // =====================================================================
    // Y8 4K Introducing Pythagoras' theorem
    // =====================================================================
    // Y8 4K Q1, Q2, Q6, Q7: Pythagorean triples
    'y8-4k-triple': `
      <p class="hp-tag">Worked example: are (a) <b>33, 56, 65</b> and (b) <b>19, 21, 28</b> Pythagorean triples?</p>
      ${steps(
        `<p><strong>Square the two smaller numbers and add.</strong></p>
         ${sum('(a) 33² + 56² = 1089 + 3136 = 4225<br>(b) 19² + 21² = 361 + 441 = 802')}`,
        `<p><strong>Square the biggest number and compare.</strong></p>
         ${sum('(a) 65² = 4225 ✓ equal<br>(b) 28² = 784 ✗ not equal')}
         ${ans('(a) Yes (b) No')}`
      )}
      <p><strong>Finding c:</strong> for (36, 77, c), 36² + 77² = 1296 + 5929 = 7225, and √7225 = 85, so c = 85.</p>
      ${tip('A triple must be whole numbers with a² + b² = c² exactly. Multiplying a triple by any whole number gives another one, which helps when you count them.')}`,

    // Y8 4K Q3: the sum of the squares of the shorter sides
    'y8-4k-squares': `
      <p class="hp-tag">Worked example: check that a² + b² = c² for this right-angled triangle.</p>
      ${D([
        { poly: [[0, 0], [4.8, 0], [0, 1.4]], fill: true }, { angle: [0, 0, 0, 90], right: true },
        { label: '48', at: [2.4, -0.4] }, { label: '14', at: [-0.3, 0.7], anchor: 'end' }, { label: '50', at: [2.6, 1.0], anchor: 'start' }
      ], 'A right-angled triangle with shorter sides 14 and 48 and longest side 50.', 50)}
      ${steps(
        `<p><strong>The two shorter sides make the right angle.</strong> Square them and add.</p>
         ${sum('14² + 48² = 196 + 2304 = 2500')}`,
        `<p><strong>Square the hypotenuse</strong> (the longest side, opposite the right angle).</p>
         ${sum('50² = 2500 ✓')}
         ${ans('2500')}`
      )}
      ${tip('Decimals work the same way: 1.2² + 3.5² = 1.44 + 12.25 = 13.69, which is 3.7².')}`,

    // Y8 4K Q4, Q8: right-angled, acute or obtuse
    'y8-4k-classify': `
      <p class="hp-tag">Worked example: classify triangles with sides (a) <b>14, 18, 23</b> and (b) <b>14, 18, 22</b>.</p>
      ${steps(
        `<p><strong>Add the squares of the two shorter sides.</strong></p>
         ${sum('14² + 18² = 196 + 324 = 520')}`,
        `<p><strong>Compare with the square of the longest side.</strong></p>
         ${sum('(a) 23² = 529, bigger than 520<br>(b) 22² = 484, smaller than 520')}`,
        `<p><strong>Bigger means obtuse, smaller means acute, equal means right-angled.</strong></p>
         ${ans('(a) Obtuse (b) Acute')}`
      )}
      <p><strong>Largest whole longest side for an acute triangle</strong> with shorter sides 5 and 7: c² must be less than 25 + 49 = 74. 8² = 64 works but 9² = 81 does not, so c = 8 and the perimeter is 5 + 7 + 8 = 20.</p>
      ${tip('Picture it: a long third side pushes the angle opposite it open, making it obtuse.')}`,

    // Y8 4K Q5, Q10, Q11: writing and rearranging Pythagoras with letters
    'y8-4k-equation': `
      <p class="hp-tag">Worked example: a ladder of length <b>L</b> reaches <b>u</b> up a wall, with its foot <b>f</b> from the wall. Write Pythagoras' theorem.</p>
      ${D([
        { poly: [[0, 0], [2, 0], [0, 5]], fill: true }, { angle: [0, 0, 0, 90], right: true },
        { label: 'f', at: [1, -0.45] }, { label: 'u', at: [-0.3, 2.5], anchor: 'end' }, { label: 'L', at: [1.25, 2.7], anchor: 'start' }
      ], 'A right-angled triangle: wall u, ground f, ladder L as the hypotenuse.', 30)}
      ${steps(
        `<p><strong>Find the hypotenuse</strong>: the side opposite the right angle. Here it is the ladder, L.</p>`,
        `<p><strong>Hypotenuse squared = the other two squared, added.</strong></p>
         ${sum('L² = u² + f²')}
         ${ans('L^2 = u^2 + f^2')}`
      )}
      <p><strong>Rearranging:</strong> if r² + s² = t², then t² − s² = r², and t = √(r² + s²). <strong>Simplifying:</strong> legs u and 2u give c² = u² + (2u)² = u² + 4u² = 5u².</p>
      ${tip('Type squares with ^ and roots as sqrt( ), like t = sqrt(r^2+s^2). Any correct arrangement of the equation is fine.')}`,

    // Y8 4K Q12: proving Pythagoras' theorem
    'y8-4k-proof': `
      <p class="hp-tag">Worked example (with numbers): four right-angled triangles with shorter sides <b>2</b> and <b>5</b> sit inside a <b>7 by 7</b> square, leaving a tilted square in the middle.</p>
      ${D([
        { poly: [[0, 0], [7, 0], [7, 7], [0, 7]], fill: true },
        { poly: [[2, 0], [7, 2], [5, 7], [0, 5]] },
        { label: '2', at: [1, -0.45] }, { label: '5', at: [4.5, -0.45] }, { label: '5', at: [-0.3, 2.5], anchor: 'end' }, { label: '2', at: [-0.3, 6], anchor: 'end' },
        { label: 'c', at: [3.5, 3.5] }
      ], 'A 7 by 7 square with a tilted square inside; the four corner triangles each have shorter sides 2 and 5.', 26)}
      ${steps(
        `<p><strong>Area of the big square and the four triangles.</strong></p>
         ${sum('7 × 7 = 49<br>4 × ½ × 2 × 5 = 20')}`,
        `<p><strong>The tilted square is what is left.</strong></p>
         ${sum('c² = 49 − 20 = 29')}`,
        `<p><strong>Compare with a² + b².</strong></p>
         ${sum('2² + 5² = 4 + 25 = 29 ✓')}
         ${ans('c² = a² + b²')}`
      )}
      ${tip('With letters, use the same steps. Expanding a squared bracket: (x + 3)² = x² + 3x + 3x + 9 = x² + 6x + 9. Type products like 6x and squares like x^2.')}`,

    // =====================================================================
    // Y8 4L Using Pythagoras' theorem
    // =====================================================================
    // Y8 4L Q1, Q2, Q3: finding the hypotenuse
    'y8-4l-hyp': `
      <p class="hp-tag">Worked example: find the hypotenuse c of each right-angled triangle.</p>
      ${fig(
        { kind: 'diagram', unit: 40, alt: 'A right-angled triangle with shorter sides 33 and 56', items: [
          { poly: [[0, 0], [5.6, 0], [0, 3.3]], fill: true }, { angle: [0, 0, 0, 90], right: true },
          { label: '56', at: [2.8, -0.45] }, { label: '33', at: [-0.25, 1.65], anchor: 'end' }, { label: 'c', at: [3, 1.85], anchor: 'start' }] },
        { kind: 'diagram', unit: 40, alt: 'A right-angled triangle with shorter sides 14 and 19', items: [
          { poly: [[0, 0], [5.7, 0], [0, 4.2]], fill: true }, { angle: [0, 0, 0, 90], right: true },
          { label: '19', at: [2.85, -0.45] }, { label: '14', at: [-0.25, 2.1], anchor: 'end' }, { label: 'c', at: [3.05, 2.35], anchor: 'start' }] }
      )}
      ${steps(
        `<p><strong>c² = a² + b².</strong> Square the two shorter sides and add.</p>
         ${sum('33² + 56² = 1089 + 3136 = 4225<br>14² + 19² = 196 + 361 = 557')}`,
        `<p><strong>Square root to get c.</strong></p>
         ${sum('c = √4225 = 65<br>c = √557 = 23.600...')}
         ${ans('65 and 23.60')}`
      )}
      ${tip('The hypotenuse is always the longest side, so check your c is bigger than both other sides. Do not forget the square root at the end.')}`,

    // Y8 4L Q4, Q5: diagonals of rectangles in real life
    'y8-4l-problems': `
      <p class="hp-tag">Worked example: a TV screen is <b>1.2 m</b> wide and <b>70 cm</b> high. Find the length of its diagonal in metres, to the nearest centimetre.</p>
      ${D([
        { poly: [[0, 0], [6, 0], [6, 3.5], [0, 3.5]], fill: true }, { seg: [0, 0, 6, 3.5], dash: true },
        { dim: [0, 0, 6, 0], label: '1.2 m', off: -0.5 }, { dim: [6, 0, 6, 3.5], label: '70 cm', off: -0.5 }
      ], 'A rectangle 1.2 m wide and 70 cm high with a dashed diagonal.', 34)}
      ${steps(
        `<p><strong>Make the units match.</strong></p>
         ${sum('70 cm = 0.7 m')}`,
        `<p><strong>The diagonal is the hypotenuse.</strong></p>
         ${sum('c² = 1.2² + 0.7² = 1.44 + 0.49 = 1.93<br>c = √1.93 = 1.3892...')}`,
        `<p><strong>"Nearest centimetre" in metres means 2 decimal places.</strong></p>
         ${ans('1.39')}`
      )}
      ${tip('A diagonal cuts a rectangle into two right-angled triangles, with the length and width as the shorter sides.')}`,

    // Y8 4L Q6, Q7: two-step problems
    'y8-4l-twostep': `
      <p class="hp-tag">Worked example: a <b>14 cm</b> straw leans across a cup <b>9 cm</b> tall and <b>4 cm</b> wide. How much sticks out of the top?</p>
      ${D([
        { poly: [[0, 0], [4, 0], [4, 9], [0, 9]], fill: true }, { seg: [4, 0, -1.686, 12.793] },
        { angle: [4, 0, 90, 180], right: true },
        { dim: [0, 0, 4, 0], label: '4 cm', off: -0.5 }, { dim: [4, 0, 4, 9], label: '9 cm', off: -0.5 }
      ], 'A cup 4 cm wide and 9 cm tall with a straw from the bottom corner across to the opposite top edge and beyond.', 16)}
      ${steps(
        `<p><strong>The straw inside the cup is the hypotenuse.</strong></p>
         ${sum('c² = 9² + 4² = 81 + 16 = 97<br>c = √97 = 9.848... cm')}`,
        `<p><strong>Take that from the whole straw.</strong></p>
         ${sum('14 − 9.848... = 4.151... cm')}
         ${ans('4.15')}`
      )}
      ${tip('For a path in pieces, find each straight piece first (one may need Pythagoras), then add them.')}`,

    // Y8 4L Q8: finding the error
    'y8-4l-errors': `
      <p class="hp-tag">Worked example: each line of working has a mistake. Find c correctly.</p>
      ${steps(
        `<p><strong>"c² = 4² + 6², so c = 4 + 6 = 10."</strong> You must square first, not just add the sides.</p>
         ${sum('c² = 16 + 36 = 52, c = √52 = 7.21')}`,
        `<p><strong>"c² = 9² + 12² = 21²."</strong> You cannot add the numbers before squaring.</p>
         ${sum('c² = 81 + 144 = 225, c = √225 = 15')}`,
        `<p><strong>"c² = 3² + 8² = 9 + 64 = 73 = √73."</strong> 73 is c², not c, so the = sign is wrong.</p>
         ${sum('c² = 73, so c = √73 = 8.54')}
         ${ans('7.21, 15, 8.54')}`
      )}
      ${tip('Write c² = ... on one line and c = √... on the next. Round only at the end.')}`,

    // Y8 4L Q9: isosceles triangles and kites
    'y8-4l-isosceles': `
      <p class="hp-tag">Worked example: an isosceles triangle has base <b>18</b> and height <b>12</b>. Find the equal sides and the perimeter.</p>
      ${D([
        { poly: [[0, 0], [9, 0], [4.5, 6]], fill: true }, { seg: [4.5, 6, 4.5, 0], dash: true }, { angle: [4.5, 0, 0, 90], right: true },
        { dim: [0, 0, 9, 0], label: '18', off: -0.5 }, { label: '12', at: [4.7, 2.5], anchor: 'start' },
        { label: 'c', at: [1.8, 3.3], anchor: 'end' }, { label: 'c', at: [7.2, 3.3], anchor: 'start' }
      ], 'An isosceles triangle with base 18, height 12, and two equal sides c.', 30)}
      ${steps(
        `<p><strong>The height cuts it into two right-angled triangles.</strong> Each has half the base.</p>
         ${sum('18 ÷ 2 = 9')}`,
        `<p><strong>Pythagoras in one half.</strong></p>
         ${sum('c² = 9² + 12² = 81 + 144 = 225<br>c = 15')}`,
        `<p><strong>Perimeter.</strong></p>
         ${sum('15 + 15 + 18 = 48')}
         ${ans('15 and 48')}`
      )}
      ${tip('A kite\'s diagonals cross at right angles, cutting it into four right-angled triangles. Find each different side with Pythagoras.')}`,

    // Y8 4L Q10: showing a triangle is not right-angled
    'y8-4l-notright': `
      <p class="hp-tag">Worked example: show that a triangle with sides <b>7, 8</b> and <b>12</b> is not right-angled.</p>
      ${steps(
        `<p><strong>Square the longest side.</strong></p>
         ${sum('c² = 12² = 144')}`,
        `<p><strong>Square the other two and add.</strong></p>
         ${sum('a² + b² = 7² + 8² = 49 + 64 = 113')}`,
        `<p><strong>144 is not 113</strong>, so it is not right-angled.</p>
         ${ans('144, 113')}`
      )}
      ${tip('Type c² first, then a² + b², with a comma between.')}`,

    // Y8 4L Q12: perimeters that need Pythagoras
    'y8-4l-perimeter': `
      <p class="hp-tag">Worked example: find the perimeter of this trapezium, correct to 2 decimal places.</p>
      ${D([
        { poly: [[0, 0], [9, 0], [4, 2], [0, 2]], fill: true }, { seg: [4, 2, 4, 0], dash: true },
        { angle: [0, 0, 0, 90], right: true },
        { dim: [0, 0, 9, 0], label: '9 m', off: -0.5 }, { dim: [4, 2, 0, 2], label: '4 m', off: -0.5 }, { dim: [0, 2, 0, 0], label: '2 m', off: -0.5 },
        { label: '?', at: [6.8, 1.4], anchor: 'start' }
      ], 'A right-angled trapezium: bottom 9 m, top 4 m, height 2 m, and a slanted side to find.', 34)}
      ${steps(
        `<p><strong>Make a right-angled triangle</strong> with the dashed line. Its bottom is 9 − 4 = 5 and its height is 2.</p>`,
        `<p><strong>Pythagoras for the slanted side.</strong></p>
         ${sum('c² = 5² + 2² = 25 + 4 = 29<br>c = √29 = 5.385...')}`,
        `<p><strong>Add all four sides.</strong></p>
         ${sum('9 + 2 + 4 + 5.385... = 20.385...')}
         ${ans('20.39')}`
      )}
      ${tip('Curved edges too: a quadrant of radius 4 has arc ¼ × 2 × π × 4 = 6.283 and a straight chord across of √(4² + 4²) = 5.657.')}`,

    // =====================================================================
    // Y8 4M Calculating the length of a shorter side
    // =====================================================================
    // Y8 4M Q1, Q2, Q3: finding a shorter side
    'y8-4m-short': `
      <p class="hp-tag">Worked example: find the unknown side in each right-angled triangle.</p>
      ${fig(
        { kind: 'diagram', unit: 40, alt: 'A right-angled triangle with hypotenuse 89, one shorter side 39 and the other a', items: [
          { poly: [[0, 0], [8, 0], [0, 3.9]], fill: true }, { angle: [0, 0, 0, 90], right: true },
          { label: 'a', at: [4, -0.45] }, { label: '39', at: [-0.25, 1.95], anchor: 'end' }, { label: '89', at: [4.2, 2.2], anchor: 'start' }] },
        { kind: 'diagram', unit: 14, alt: 'A right-angled triangle with hypotenuse 14, one shorter side 5 and the other x', items: [
          { poly: [[0, 0], [13.08, 0], [0, 5]], fill: true }, { angle: [0, 0, 0, 90], right: true },
          { label: 'x', at: [6.5, -1.3] }, { label: '5', at: [-0.8, 2.5], anchor: 'end' }, { label: '14', at: [7, 3.3], anchor: 'start' }] }
      )}
      ${steps(
        `<p><strong>Hypotenuse squared, take away the side you know squared.</strong></p>
         ${sum('a² = 89² − 39² = 7921 − 1521 = 6400<br>x² = 14² − 5² = 196 − 25 = 171')}`,
        `<p><strong>Square root.</strong></p>
         ${sum('a = √6400 = 80<br>x = √171 = 13.076...')}
         ${ans('80 and 13.08')}`
      )}
      ${tip('For a shorter side you <b>subtract</b>; for the hypotenuse you add. Check: a shorter side must come out smaller than the hypotenuse.')}`,

    // Y8 4M Q4, Q5, Q6, Q8: shorter-side problems
    'y8-4m-problems': `
      <p class="hp-tag">Worked example: a <b>6.5 m</b> ladder leans against a wall with its foot <b>2.5 m</b> from the wall. How high up the wall does it reach?</p>
      ${D([
        { poly: [[0, 0], [2.5, 0], [0, 6]], fill: true }, { angle: [0, 0, 0, 90], right: true },
        { label: '2.5 m', at: [1.25, -0.45] }, { label: '?', at: [-0.3, 3], anchor: 'end' }, { label: '6.5 m', at: [1.45, 3.2], anchor: 'start' }
      ], 'A right-angled triangle: ladder 6.5 m (hypotenuse), ground 2.5 m, wall height unknown.', 30)}
      ${steps(
        `<p><strong>The ladder is the hypotenuse</strong> (opposite the right angle). The wall is a shorter side.</p>`,
        `<p><strong>Subtract the squares, then square root.</strong></p>
         ${sum('h² = 6.5² − 2.5² = 42.25 − 6.25 = 36<br>h = √36 = 6')}
         ${ans('6')}`
      )}
      ${tip('A diameter opposite a right angle in a circle is a hypotenuse. A straw across a can goes from the bottom edge to the top edge, so the diameter is one shorter side.')}`,

    // Y8 4M Q7: two triangles sharing a side
    'y8-4m-twostep': `
      <p class="hp-tag">Worked example: find AB, correct to 2 decimal places.</p>
      ${D([
        { poly: [[-4.5, 0], [3.5, 0], [0, 6]], fill: true }, { seg: [0, 6, 0, 0], dash: true }, { angle: [0, 0, 0, 90], right: true },
        { point: [0, 6], name: 'A', pos: 'n' }, { point: [3.5, 0], name: 'B', pos: 'se' }, { point: [0, 0], name: 'C', pos: 's' }, { point: [-4.5, 0], name: 'D', pos: 'sw' },
        { label: '4.5', at: [-2.25, -0.55] }, { label: '3.5', at: [1.75, -0.55] }, { label: '7.5', at: [-2.6, 3.3], anchor: 'end' }
      ], 'Two right-angled triangles share the side AC. AD = 7.5, DC = 4.5 and CB = 3.5.', 34)}
      ${steps(
        `<p><strong>Left triangle:</strong> find the shared side AC (a shorter side).</p>
         ${sum('AC² = 7.5² − 4.5² = 56.25 − 20.25 = 36<br>AC = 6')}`,
        `<p><strong>Right triangle:</strong> AB is the hypotenuse.</p>
         ${sum('AB² = 6² + 3.5² = 36 + 12.25 = 48.25<br>AB = √48.25 = 6.946...')}
         ${ans('6.95')}`
      )}
      ${tip('Find the shared side first: it belongs to both triangles. Keep it exact (or unrounded) for the second step.')}`,

    // Y8 4M Q9: finding the error
    'y8-4m-errors': `
      <p class="hp-tag">Worked example: each second line has a mistake. Find a correctly.</p>
      ${steps(
        `<p><strong>"a² + 16 = 41, so a² = 57."</strong> To undo + 16, subtract.</p>
         ${sum('a² = 41 − 16 = 25, a = 5')}`,
        `<p><strong>"a² = 64, so a = 32."</strong> Undo a square with a square root, not by halving.</p>
         ${sum('a = √64 = 8')}`,
        `<p><strong>"a² + 49 = 130, so a + 7 = ..."</strong> You cannot square root each part separately.</p>
         ${sum('a² = 130 − 49 = 81, a = 9')}
         ${ans('5, 8, 9')}`
      )}
      ${tip('Get a² on its own first, then square root the whole number.')}`,

    // Y8 4M Q10: isosceles triangles
    'y8-4m-isosceles': `
      <p class="hp-tag">Worked example: an isosceles triangle has equal sides of <b>8.5</b> and a height of <b>7.5</b>. Find its base and its perimeter.</p>
      ${D([
        { poly: [[0, 0], [8, 0], [4, 7.5]], fill: true }, { seg: [4, 7.5, 4, 0], dash: true }, { angle: [4, 0, 0, 90], right: true },
        { label: 'base', at: [4, -0.8] }, { label: '7.5', at: [4.3, 3.2], anchor: 'start' },
        { label: '8.5', at: [1.6, 4.1], anchor: 'end' }, { label: '8.5', at: [6.4, 4.1], anchor: 'start' }
      ], 'An isosceles triangle with equal sides 8.5 and height 7.5; the base is unknown.', 26)}
      ${steps(
        `<p><strong>The height splits it into two right-angled triangles.</strong> In each one, 8.5 is the hypotenuse.</p>
         ${sum('(half the base)² = 8.5² − 7.5² = 72.25 − 56.25 = 16<br>half the base = 4')}`,
        `<p><strong>Double for the whole base, then add the sides.</strong></p>
         ${sum('base = 2 × 4 = 8<br>perimeter = 8.5 + 8.5 + 8 = 25')}
         ${ans('8 and 25')}`
      )}
      ${tip('Remember to double: Pythagoras only gives you half the base.')}`,

    // Y8 4M Q11: exact answers as surds
    'y8-4m-surd': `
      <p class="hp-tag">Worked example: give the exact unknown side as √n: (a) hypotenuse <b>7</b>, one side <b>4</b>; (b) shorter sides <b>2</b> and <b>5</b>.</p>
      ${steps(
        `<p><strong>(a) Shorter side: subtract the squares.</strong></p>
         ${sum('7² − 4² = 49 − 16 = 33, so the side is √33')}`,
        `<p><strong>(b) Hypotenuse: add the squares.</strong></p>
         ${sum('2² + 5² = 4 + 25 = 29, so the side is √29')}
         ${ans('33 and 29')}`
      )}
      ${tip('"Exact" means do not press the √ key. Type just n, the number under the square root.')}`,

    // Y8 4M Q12: isosceles right-angled triangles
    'y8-4m-isoright': `
      <p class="hp-tag">Worked example: an isosceles right-angled triangle has hypotenuse <b>10</b>. Find the two equal sides x, to 2 decimal places.</p>
      ${D([
        { poly: [[0, 0], [5, 0], [0, 5]], fill: true }, { angle: [0, 0, 0, 90], right: true },
        { tick: [0, 0, 5, 0], n: 1 }, { tick: [0, 0, 0, 5], n: 1 },
        { label: 'x', at: [1.4, -0.5] }, { label: 'x', at: [-0.35, 1.4], anchor: 'end' }, { label: '10', at: [2.8, 2.8], anchor: 'start' }
      ], 'An isosceles right-angled triangle with equal sides x and hypotenuse 10.', 30)}
      ${steps(
        `<p><strong>Both shorter sides are x.</strong></p>
         ${sum('x² + x² = 10²<br>2x² = 100')}`,
        `<p><strong>Halve, then square root.</strong></p>
         ${sum('x² = 50<br>x = √50 = 7.071...')}
         ${ans('7.07')}`
      )}
      ${tip('If x is the hypotenuse instead, add: a triangle with two sides of 5 has x² = 5² + 5² = 50.')}`,

    // Y8 4M Q13: families of Pythagorean triples
    'y8-4m-family': `
      <p class="hp-tag">Worked example: find the triple in the <b>(5, 12, 13)</b> family whose smallest number is <b>35</b>.</p>
      ${steps(
        `<p><strong>What was 5 multiplied by?</strong></p>
         ${sum('35 ÷ 5 = 7')}`,
        `<p><strong>Multiply every number by 7.</strong></p>
         ${sum('5 × 7 = 35, 12 × 7 = 84, 13 × 7 = 91')}
         ${ans('35, 84, 91')}`
      )}
      <p><strong>Same family or not?</strong> (10, 24, 26) is 2 × (5, 12, 13). It is not in the (3, 4, 5) family, because 10 ÷ 3 is not a whole number.</p>
      ${tip('Type the three numbers smallest first, with commas between. To test a family, divide each number by the matching number in the basic triple: all three answers must be the same whole number.')}`
  });
})();
