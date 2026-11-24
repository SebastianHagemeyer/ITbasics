/* H3 help panels for Year 8 Chapter 9. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 9A to 9J. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers for this chapter ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  // The line y = mx + c clipped to the box X = [x0, x1], Y = [y0, y1], as a diagram seg.
  const clip = (m, c, X, Y) => {
    let xa = X[0], xb = X[1];
    if (m !== 0) {
      const p = (Y[0] - c) / m, q = (Y[1] - c) / m;
      xa = Math.max(X[0], Math.min(p, q)); xb = Math.min(X[1], Math.max(p, q));
    }
    return [r3(xa), r3(m * xa + c), r3(xb), r3(m * xb + c)];
  };
  const ln = (m, c, X, Y, o = {}) => Object.assign({ seg: clip(m, c, X, Y) }, o);
  // Hatching at 45 degrees inside a convex polygon, the way the question figures shade a region.
  const hatch = (poly, gap = 0.5) => {
    const out = [], xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
    const kMin = Math.min(...ys) - Math.max(...xs), kMax = Math.max(...ys) - Math.min(...xs);
    for (let k = Math.ceil(kMin / gap) * gap; k <= kMax + 1e-9; k += gap) {
      const hits = [];
      poly.forEach((p, i) => {
        const q = poly[(i + 1) % poly.length], den = (q[1] - p[1]) - (q[0] - p[0]);
        if (Math.abs(den) < 1e-12) return;
        const s = (p[0] + k - p[1]) / den;
        if (s >= -1e-9 && s <= 1 + 1e-9) hits.push(p[0] + s * (q[0] - p[0]));
      });
      if (hits.length >= 2) {
        const a = Math.min(...hits), b = Math.max(...hits);
        if (b - a > 0.05) out.push({ seg: [r3(a), r3(a + k), r3(b), r3(b + k)], thin: true });
      }
    }
    return out;
  };
  // A number plane drawn as a diagram, so it can carry several lines, dashed lines and shading.
  // `under` (hatching) is drawn first, then the grid and axes, then `items` on top.
  const pl = (X, Y, items, under = [], alt = 'A number plane') => {
    const g = [...under], step = (X[1] - X[0] > 12 || Y[1] - Y[0] > 12) ? 2 : 1;
    for (let x = X[0]; x <= X[1]; x++) g.push({ seg: [x, Y[0], x, Y[1]], thin: true });
    for (let y = Y[0]; y <= Y[1]; y++) g.push({ seg: [X[0], y, X[1], y], thin: true });
    g.push({ seg: [X[0], 0, X[1] + 0.6, 0], arrow: 'end' }, { seg: [0, Y[0], 0, Y[1] + 0.6], arrow: 'end' },
      { label: 'x', at: [X[1] + 0.95, 0] }, { label: 'y', at: [0, Y[1] + 0.95] }, { label: 'O', at: [-0.25, -0.5], anchor: 'end' });
    for (let x = X[0]; x <= X[1]; x += step) if (x) g.push({ label: String(x), at: [x, -0.5] });
    for (let y = Y[0]; y <= Y[1]; y += step) if (y) g.push({ label: String(y), at: [-0.2, y - 0.05], anchor: 'end' });
    return fig({ kind: 'diagram', unit: 30, items: g.concat(items), alt });
  };
  // Plain axes with no grid or numbers, for sketches.
  const axes = (items, alt = 'A sketch graph') => fig({ kind: 'diagram', unit: 26, alt, items: [
    { seg: [-4, 0, 4, 0], arrow: 'both' }, { seg: [0, -4, 0, 4], arrow: 'both' },
    { label: 'x', at: [4.4, 0] }, { label: 'y', at: [0, 4.45] }, { label: 'O', at: [-0.3, -0.6], anchor: 'end' }, ...items] });
  // Points of y = a(x - h)^2 + k from x0 to x1, for drawing a parabola.
  const curve = (a, h, k, x0, x1) => { const p = []; for (let x = x0; x <= x1 + 1e-9; x += 0.25) p.push([r3(x), r3(a * (x - h) * (x - h) + k)]); return p; };
  // Matchstick ladder two squares high and n columns wide (5n + 2 sticks).
  const ladder = (n) => {
    const s = [];
    for (let i = 0; i <= n; i++) s.push([i, 0, i, 1], [i, 1, i, 2]);
    for (let i = 0; i < n; i++) s.push([i, 0, i + 1, 0], [i, 1, i + 1, 1], [i, 2, i + 1, 2]);
    return s;
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 9A The Cartesian plane
    // =====================================================================
    // Y8 9A Q1, Q2: reading and finding coordinates
    'y8-9a-read': `
      <p class="hp-tag">Worked example: write the coordinates of P, Q, R and S.</p>
      ${fig({ kind: 'plane', x: [-4, 4], y: [-4, 4], points: { P: [3, -2], Q: [-1, 3], R: [0, 2], S: [-2.5, -3] } })}
      ${steps(
        `<p><strong>Start at the origin O and go across first.</strong> Right is positive, left is negative. P is 3 to the right, so x = 3.</p>`,
        `<p><strong>Then go up or down.</strong> Up is positive, down is negative. P is 2 down, so y = −2. Write x first, then y, in brackets.</p>
         ${sum('P = (3, −2)')}
         ${ans('(3,-2)')}`,
        `<p><strong>Watch the special ones.</strong> R is on the y-axis, so it is 0 across: R = (0, 2). S sits halfway between grid lines: S = (−2.5, −3). Q is 1 left and 3 up: Q = (−1, 3).</p>`
      )}
      <p><strong>Going the other way?</strong> To find the point at (−1, 3), go 1 left, then 3 up. You land on Q.</p>
      ${tip('Type coordinates in brackets with a comma, like (3,-2). Across comes before up: (3, −2) and (−2, 3) are different points.')}`,

    // Y8 9A Q3, Q5: plot the points and name the shape or picture
    'y8-9a-plot': `
      <p class="hp-tag">Worked example: plot <b>A(−3, −2), B(3, −2), C(1, 2), D(−1, 2)</b>, join them in order and back to A. What shape is it?</p>
      ${fig({ kind: 'plane', x: [-4, 4], y: [-3, 3], points: { A: [-3, -2], B: [3, -2], C: [1, 2], D: [-1, 2] }, path: [[-3, -2], [3, -2], [1, 2], [-1, 2]], closed: true })}
      ${steps(
        `<p><strong>Plot every point first</strong>: across, then up. Join them in the order given, then back to the start.</p>`,
        `<p><strong>Look at the sides.</strong> AB and DC are both horizontal, so they are parallel. AB is 6 long but DC is only 2, and AD and BC lean towards each other, so they are not parallel.</p>`,
        `<p><strong>Match the shape to its facts.</strong> Exactly one pair of parallel sides makes a trapezium.</p>
         ${ans('Trapezium')}`
      )}
      ${chips(['Rectangle: 4 right angles'], ['Parallelogram: 2 pairs of parallel sides'], ['Kite: 2 pairs of equal sides next to each other'], ['Trapezium: 1 pair of parallel sides'])}
      ${tip('For a picture, plot all the points before you guess. A quick sketch on grid paper makes it obvious.')}`,

    // Y8 9A Q4: which point is not in line?
    'y8-9a-inline': `
      <p class="hp-tag">Worked example: one of <b>A(0, 6), B(1, 4), C(2, 3), D(3, 0), E(4, −2)</b> is not in line with the others. Which one?</p>
      ${steps(
        `<p><strong>Put the points in a table, in order of x.</strong> Here x goes up by 1 each time.</p>
         ${fig({ kind: 'table', rows: [['x', '0', '1', '2', '3', '4'], ['y', '6', '4', '3', '0', '−2'], ['in line', '6', '4', '2', '0', '−2']] })}`,
        `<p><strong>Find the step most of the points share.</strong> 6 to 4 is down 2, and 0 to −2 is down 2. Going down 2 each time gives the bottom row.</p>`,
        `<p><strong>Spot the one that breaks the pattern.</strong> C should be (2, 2) but it is (2, 3).</p>
         ${ans('C')}`
      )}
      ${tip('If the x-values jump by different amounts, compare fairly: a jump of 2 across should give twice the change in y that a jump of 1 does.')}`,

    // Y8 9A Q6: midpoint of a segment
    'y8-9a-midpoint': `
      <p class="hp-tag">Worked example: find the midpoint of the segment joining <b>(1, −2)</b> and <b>(6, 3)</b>.</p>
      ${fig({ kind: 'plane', x: [-1, 7], y: [-3, 4], path: [[1, -2], [6, 3]], points: { '(1, −2)': [1, -2], '(6, 3)': [6, 3], M: [3.5, 0.5] } })}
      ${steps(
        `<p><strong>The midpoint is halfway across.</strong> Average the x-values: add them and halve.</p>
         ${sum('x: (1 + 6) ÷ 2 = 7 ÷ 2 = 3.5')}`,
        `<p><strong>And halfway up.</strong> Average the y-values the same way.</p>
         ${sum('y: (−2 + 3) ÷ 2 = 1 ÷ 2 = 0.5')}`,
        `<p><strong>Put them together.</strong></p>
         ${ans('(3.5,0.5)')}`
      )}
      ${tip('Type halves as decimals, like (3.5,0.5). Check on a sketch that M really looks halfway.')}`,

    // Y8 9A Q7: whole-number points on a segment
    'y8-9a-lattice': `
      <p class="hp-tag">Worked example: how many points with whole-number coordinates lie on the segment from <b>(−1, 4)</b> to <b>(5, 1)</b>?</p>
      ${fig({ kind: 'plane', x: [-2, 6], y: [-1, 5], path: [[-1, 4], [5, 1]], points: { '(−1, 4)': [-1, 4], '(1, 3)': [1, 3], '(3, 2)': [3, 2], '(5, 1)': [5, 1] } })}
      ${steps(
        `<p><strong>Find how far across and how far down.</strong></p>
         ${sum('across: 5 − (−1) = 6 &nbsp; down: 4 − 1 = 3')}`,
        `<p><strong>Split the trip into equal whole steps.</strong> The biggest number that divides 6 and 3 is 3, so make 3 steps of 2 across and 1 down.</p>`,
        `<p><strong>List the points, counting both ends.</strong> (−1, 4), (1, 3), (3, 2), (5, 1).</p>
         ${ans('4')}`
      )}
      <p><strong>Straight up or across?</strong> From (3, −2) to (3, 3), every whole y-value from −2 to 3 works: −2, −1, 0, 1, 2, 3. That is 6 points.</p>
      ${tip('Always count the two end points. Plotting the segment and marking each grid corner it passes through is a good check.')}`,

    // Y8 9A Q8, Q9: quadrants and sets of points
    'y8-9a-quadrants': `
      ${fig({ kind: 'diagram', unit: 30, alt: 'The four quadrants', items: [
        { seg: [-4, 0, 4, 0], arrow: 'both' }, { seg: [0, -3, 0, 3], arrow: 'both' }, { label: 'x', at: [4.4, 0] }, { label: 'y', at: [0, 3.45] },
        { label: 'Quadrant 1', at: [2, 1.8] }, { label: '(+, +)', at: [2, 1] }, { label: 'Quadrant 2', at: [-2, 1.8] }, { label: '(−, +)', at: [-2, 1] },
        { label: 'Quadrant 3', at: [-2, -1.2] }, { label: '(−, −)', at: [-2, -2] }, { label: 'Quadrant 4', at: [2, -1.2] }, { label: '(+, −)', at: [2, -2] }] })}
      <p class="hp-tag">Worked example: the point (a, b) has <b>a &lt; 0 and b &gt; 0</b>. Which quadrant is it in? Which quadrants have <b>b &lt; 0</b>?</p>
      ${steps(
        `<p><strong>a is the x-coordinate.</strong> a &lt; 0 means left of the y-axis: quadrants 2 and 3.</p>`,
        `<p><strong>b is the y-coordinate.</strong> b &gt; 0 means above the x-axis: quadrants 1 and 2. Only quadrant 2 is in both lists.</p>
         ${ans('2')}`,
        `<p><strong>Only one condition?</strong> b &lt; 0 is the whole bottom half, whatever a is: quadrants 3 and 4.</p>
         ${ans('3, 4')}`
      )}
      <p><strong>A set of points.</strong> The points (x, 2), where x can be anything, all have height 2. Together they make a horizontal line through 2 on the y-axis.</p>
      ${tip('The quadrants are numbered anticlockwise, starting top right. Type two quadrants with a comma: 3, 4.')}`,

    // Y8 9A Q10: distance along a horizontal or vertical line
    'y8-9a-distance': `
      <p class="hp-tag">Worked example: find the distance from <b>(−4, −2)</b> to <b>(5, −2)</b>, and from <b>(3, 4)</b> to <b>(3, −1)</b>.</p>
      ${pl([-5, 6], [-3, 5], [{ seg: [-4, -2, 5, -2] }, { seg: [3, 4, 3, -1] },
        { point: [-4, -2], name: '(−4, −2)', pos: 'sw' }, { point: [5, -2], name: '(5, −2)', pos: 'se' }, { point: [3, 4], name: '(3, 4)', pos: 'e' }, { point: [3, -1], name: '(3, −1)', pos: 'e' }])}
      ${steps(
        `<p><strong>Same y-value: the segment is horizontal.</strong> The distance is the difference in the x-values.</p>
         ${sum('5 − (−4) = 9')}
         ${ans('9')}`,
        `<p><strong>Same x-value: the segment is vertical.</strong> Use the difference in the y-values.</p>
         ${sum('4 − (−1) = 5')}
         ${ans('5')}`
      )}
      ${tip('When the points are on opposite sides of an axis, add their distances from it: 4 + 5 = 9. A distance is never negative.')}`,

    // Y8 9A Q11: distance with Pythagoras
    'y8-9a-pythag': `
      <p class="hp-tag">Worked example: find the distance from <b>(−2, 1)</b> to <b>(2, 3)</b>, to 2 decimal places.</p>
      ${pl([-3, 3], [-1, 4], [{ seg: [-2, 1, 2, 3] }, { seg: [-2, 1, 2, 1], dash: true }, { seg: [2, 1, 2, 3], dash: true },
        { label: '4', at: [-1, 0.55] }, { label: '2', at: [2.3, 2], anchor: 'start' },
        { point: [-2, 1], name: '(−2, 1)', pos: 'nw' }, { point: [2, 3], name: '(2, 3)', pos: 'n' }])}
      ${steps(
        `<p><strong>Make a right-angled triangle</strong> by going across, then up.</p>
         ${sum('across: 2 − (−2) = 4 &nbsp; up: 3 − 1 = 2')}`,
        `<p><strong>Use Pythagoras.</strong> The distance is the longest side, c.</p>
         ${sum('c² = 4² + 2² = 16 + 4 = 20')}`,
        `<p><strong>Square root, then round.</strong></p>
         ${sum('c = √20 = 4.472... ≈ 4.47')}
         ${ans('4.47')}`
      )}
      ${tip('Squaring removes any minus signs, so the order you subtract in does not matter. Round only at the end. A whole-number answer is typed as it is.')}`,

    // =====================================================================
    // 9B Using rules, tables and graphs
    // =====================================================================
    // Y8 9B Q1, Q2, Q5, Q9: table of values from a rule
    'y8-9b-table': `
      <p class="hp-tag">Worked example: complete the table for <b>y = 3x − 4</b>, then plot the points.</p>
      ${fig({ kind: 'table', rows: [['x', '−2', '−1', '0', '1', '2'], ['y', '?', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Put each x into the rule.</strong> Put a negative x in brackets.</p>
         ${sum(`${now('3 × (−2)')} − 4 = −6 − 4 = −10<br>3 × (−1) − 4 = −3 − 4 = −7`)}`,
        `<p><strong>Keep going along the row.</strong></p>
         ${sum('x = 0: 0 − 4 = −4 &nbsp; x = 1: 3 − 4 = −1 &nbsp; x = 2: 6 − 4 = 2')}
         ${ans('-10, -7, -4, -1, 2')}`,
        `<p><strong>Plot the points (x, y) and join them.</strong> They make a straight line. Two points are enough to draw it; x = 0 and x = 1 are the easiest.</p>
         ${fig({ kind: 'plane', x: [-3, 3], y: [-11, 3], path: [[-2.333, -11], [2.333, 3]], points: { '': [-2, -10], ' ': [-1, -7], '  ': [0, -4], '   ': [1, -1], '    ': [2, 2] } })}`
      )}
      <p><strong>A fraction in the rule?</strong> For y = ½x + 3, x = 7 gives 3.5 + 3 = 6.5. Type halves as decimals.</p>
      ${tip('The y-values of a straight line change by the same amount each step (here up 3). If one breaks the pattern, check it again.')}`,

    // Y8 9B Q3: horizontal and vertical lines from a table
    'y8-9b-hv': `
      <p class="hp-tag">Worked example: each table gives a straight line. Write its rule.</p>
      ${fig({ kind: 'table', rows: [['x', '−2', '−1', '0', '1', '2'], ['y', '6', '6', '6', '6', '6']] }, { kind: 'table', rows: [['x', '−2', '−2', '−2', '−2', '−2'], ['y', '−2', '−1', '0', '1', '2']] })}
      ${steps(
        `<p><strong>Look for the value that never changes.</strong></p>`,
        `<p><strong>First table: y is always 6.</strong> Every point is at height 6, so the line is horizontal.</p>
         ${ans('y=6')}`,
        `<p><strong>Second table: x is always −2.</strong> Every point is 2 to the left, so the line is vertical.</p>
         ${ans('x=-2')}`
      )}
      ${pl([-4, 3], [-1, 7], [{ seg: [-4, 6, 3, 6] }, { seg: [-2, -1, -2, 7] }, { label: 'y = 6', at: [2, 6.45] }, { label: 'x = −2', at: [-2.2, 3.5], anchor: 'end' }])}
      ${tip('Horizontal lines are "y = a number" and vertical lines are "x = a number". Type them like y=6.')}`,

    // Y8 9B Q4: is the point on the graph?
    'y8-9b-onpoint': `
      <p class="hp-tag">Worked example: rule <b>y = 5x − 2</b>. Which of <b>(2, 8)</b> and <b>(−1, −3)</b> lie on its graph?</p>
      ${steps(
        `<p><strong>Put the point's x into the rule.</strong> For (2, 8):</p>
         ${sum('5 × 2 − 2 = 10 − 2 = 8')}
         <p>The rule gives 8 and the point's y is 8. It is on the graph ✓.</p>`,
        `<p><strong>Do the same for (−1, −3).</strong></p>
         ${sum('5 × (−1) − 2 = −5 − 2 = −7')}
         <p>The rule gives −7, but the point's y is −3. It is not on the graph ✗.</p>
         ${ans('Only (2, 8)')}`
      )}
      <p><strong>Rule written backwards?</strong> y = 6 − 5x means "6, take away 5 lots of x". At x = 1 that is 6 − 5 = 1.</p>
      ${tip('Check both points every time: the answer could be one, both or neither.')}`,

    // Y8 9B Q6, Q13: where the graph cuts the axes
    'y8-9b-intercepts': `
      <p class="hp-tag">Worked example: where does the graph of <b>y = 2x + 8</b> cut each axis?</p>
      ${fig({ kind: 'plane', x: [-5, 2], y: [-1, 9], path: [[-4.5, -1], [0.5, 9]], points: { '(−4, 0)': [-4, 0], '(0, 8)': [0, 8] } })}
      ${steps(
        `<p><strong>The y-axis is where x = 0.</strong></p>
         ${sum('y = 2 × 0 + 8 = 8, so the point is (0, 8)')}`,
        `<p><strong>The x-axis is where y = 0.</strong> Solve the equation.</p>
         ${sum('0 = 2x + 8 → 2x = −8 → x = −4, so the point is (−4, 0)')}
         ${ans('(-4,0) and (0,8)')}`,
        `<p><strong>Rule not starting with y =?</strong> Substitute the same way. For 5y + 2x = 10: x = 0 gives 5y = 10, so y = 2; y = 0 gives 2x = 10, so x = 5.</p>`
      )}
      ${tip('Read what the question wants. A point is typed in brackets, like (-4,0). "Both intercepts" as two numbers means x-intercept first, then y-intercept: -4, 8. Type halves as decimals, like 2.5.')}`,

    // Y8 9B Q7: where two lines meet
    'y8-9b-meet': `
      <p class="hp-tag">Worked example: at what point do <b>y = x + 1</b> and <b>y = 7 − x</b> meet?</p>
      ${steps(
        `<p><strong>Make a table for both rules with the same x-values.</strong></p>
         ${fig({ kind: 'table', rows: [['x', '0', '1', '2', '3', '4'], ['x + 1', '1', '2', '3', '4', '5'], ['7 − x', '7', '6', '5', '4', '3']] })}`,
        `<p><strong>Find the column where the y-values match.</strong> At x = 3, both rules give 4.</p>
         ${ans('(3,4)')}`,
        `<p><strong>Check on a graph.</strong> The lines cross at (3, 4).</p>
         ${pl([-1, 6], [-1, 7], [ln(1, 1, [-1, 6], [-1, 7]), ln(-1, 7, [-1, 6], [-1, 7]), { point: [3, 4], name: '(3, 4)', pos: 'n' }, { label: 'y = x + 1', at: [5.2, 6.6], anchor: 'end' }, { label: 'y = 7 − x', at: [5.9, 1.5], anchor: 'start' }])}`
      )}
      ${tip('If no column matches, look for where the gap between the rows changes sign: the lines cross between those two x-values.')}`,

    // Y8 9B Q8, Q10: gaps and mistakes in a table
    'y8-9b-gaps': `
      <p class="hp-tag">Worked example: a straight line's table has gaps. Fill them in.</p>
      ${fig({ kind: 'table', rows: [['x', '−2', '−1', '0', '1', '2', '3'], ['y', '?', '−1', '3', '?', '11', '?']] })}
      ${steps(
        `<p><strong>Find the step.</strong> From x = −1 to x = 0, y goes from −1 to 3: up 4. Check: two more steps give 3 + 4 + 4 = 11 ✓.</p>`,
        `<p><strong>Step along to fill each gap.</strong> Go back 4 from −1, and forward 4 from 3 and from 11.</p>
         ${ans('-5, 7, 15')}`,
        `<p><strong>Far-away values: write the rule.</strong> Up 4 each step and 3 at x = 0 gives y = 4x + 3.</p>
         ${sum('x = −8: 4 × (−8) + 3 = −32 + 3 = −29<br>(5, 20)? 4 × 5 + 3 = 23, not 20, so no')}`
      )}
      <p><strong>Hunting for a mistake?</strong> One value that breaks the steady step is the wrong one. Replace it with the value the step predicts.</p>
      ${tip('Type the missing values from left to right with commas.')}`,

    // Y8 9B Q12: does the line go up or down?
    'y8-9b-direction': `
      <p class="hp-tag">Worked example: as x increases, does the graph go up or down? <b>y = 4x − 1</b> and <b>y = 8 − 3x</b></p>
      ${pl([-1, 4], [-4, 8], [ln(4, -1, [-1, 4], [-4, 8]), ln(-3, 8, [-1, 4], [-4, 8]), { label: 'y = 4x − 1', at: [2.4, 7.6], anchor: 'start' }, { label: 'y = 8 − 3x', at: [3.6, -3.4], anchor: 'start' }])}
      ${steps(
        `<p><strong>Find the coefficient of x, with its sign.</strong> In y = 4x − 1 it is +4. Each step right adds 4, so the line goes <b>up</b>.</p>`,
        `<p><strong>The sign in front of the x term belongs to it.</strong> In y = 8 − 3x the coefficient is −3. Each step right takes 3 away, so the line goes <b>down</b>.</p>
         ${ans('up, down')}`
      )}
      ${tip('Only the number in front of x decides up or down. The number on its own just moves the whole line up or down the page.')}`,

    // =====================================================================
    // 9C Finding the rule using a table of values
    // =====================================================================
    // Y8 9C Q1, Q2, Q3, Q5: rule from a table or list of points
    'y8-9c-table': `
      <p class="hp-tag">Worked example: find the rule for this table.</p>
      ${fig({ kind: 'table', rows: [['x', '−2', '−1', '0', '1', '2'], ['y', '−13', '−7', '−1', '5', '11']] })}
      ${steps(
        `<p><strong>How much does y change each time x goes up 1?</strong> −13 to −7 is up 6. That is the coefficient of x.</p>`,
        `<p><strong>What is y when x = 0?</strong> −1. That is the number on its own.</p>`,
        `<p><strong>Write the rule and check one column.</strong> x = 2: 6 × 2 − 1 = 11 ✓.</p>
         ${ans('y=6x-1')}`
      )}
      <p><strong>No x = 0 in the table?</strong> For x = 1, 2, 3, 4 and y = 6, 4, 2, 0, the step is −2. Step back from x = 1 to x = 0: 6 + 2 = 8. The rule is y = −2x + 8. A list of points like (1, 6), (2, 4), ... works the same way.</p>
      ${tip('Type the rule starting with y =, like y=-2x+8.')}`,

    // Y8 9C Q4: rule from a graph
    'y8-9c-graph': `
      <p class="hp-tag">Worked example: find the rule for this graph.</p>
      ${fig({ kind: 'plane', x: [-2, 2], y: [-6, 4], path: [[-2, 4], [1.333, -6]], points: { '(−1, 1)': [-1, 1], '(0, −2)': [0, -2], '(1, −5)': [1, -5] } })}
      ${steps(
        `<p><strong>Read points where the line crosses grid corners</strong> and put them in a table.</p>
         ${fig({ kind: 'table', rows: [['x', '−1', '0', '1'], ['y', '1', '−2', '−5']] })}`,
        `<p><strong>Find the step and the starting value.</strong> y goes down 3 each time, so the coefficient is −3. At x = 0, y = −2.</p>`,
        `<p><strong>Write the rule.</strong></p>
         ${ans('y=-3x-2')}`
      )}
      ${tip('A line going down from left to right always has a negative coefficient of x.')}`,

    // Y8 9C Q6, Q10: rule for a matchstick pattern
    'y8-9c-sticks': `
      <p class="hp-tag">Worked example: x = number of columns, y = number of matchsticks. Write the rule.</p>
      ${fig({ kind: 'sticks', unit: 26, stages: [ladder(1), ladder(2), ladder(3)], labels: ['1 column', '2 columns', '3 columns'] })}
      ${steps(
        `<p><strong>Count and make a table.</strong></p>
         ${fig({ kind: 'table', rows: [['x', '1', '2', '3'], ['y', '7', '12', '17']] })}`,
        `<p><strong>How many does each new column add?</strong> 5 each time: 2 upright sticks and 3 flat ones. So the rule starts y = 5x.</p>`,
        `<p><strong>Find the extra.</strong> 5 × 1 = 5, but there are 7, so add 2 (the left edge of the first column).</p>
         ${sum('y = 5x + 2 &nbsp; check: 5 × 3 + 2 = 17 ✓')}
         ${ans('y=5x+2')}`
      )}
      ${tip('The number added each time is the coefficient of x. The constant is the first count take away that number.')}`,

    // Y8 9C Q7, Q8: rule from two points
    'y8-9c-twopoints': `
      <p class="hp-tag">Worked example: a straight line passes through <b>(0, −2)</b> and <b>(3, 10)</b>. Find its rule.</p>
      ${steps(
        `<p><strong>Find the change per 1 across.</strong> From x = 0 to x = 3, y goes from −2 to 10: up 12 in 3 steps.</p>
         ${sum('12 ÷ 3 = 4 per step')}
         ${fig({ kind: 'table', rows: [['x', '0', '1', '2', '3'], ['y', '−2', '2', '6', '10']] })}`,
        `<p><strong>Read the value at x = 0.</strong> It is −2.</p>
         ${ans('y=4x-2')}`,
        `<p><strong>Neither point at x = 0?</strong> For (−2, 1) and (2, 9): up 8 in 4 steps, so 8 ÷ 4 = 2 per step. Go back from (2, 9) two steps: 9 − 4 = 5. The rule is y = 2x + 5.</p>`
      )}
      ${tip('To fill gaps in a table, start at a known value and add the step each time.')}`,

    // Y8 9C Q9: the same rule written another way
    'y8-9c-rewrite': `
      <p class="hp-tag">Worked example: which rule is the same as <b>y = −3x + 10</b>?</p>
      ${chips(['y = 3x − 10'], ['y = 10 − 3x'], ['y = 3 − 10x'])}
      ${steps(
        `<p><strong>Each sign belongs to the term after it.</strong> The terms are −3x and +10.</p>`,
        `<p><strong>Terms can swap places if they keep their signs.</strong> Put +10 first.</p>
         ${ans('y = 10 − 3x')}`,
        `<p><strong>Check with a number</strong>, say x = 1: −3 + 10 = 7 and 10 − 3 = 7 ✓.</p>`
      )}
      ${tip('y = 10 − 3x is not the same as y = 3x − 10. Try x = 1 in that one: you get −7.')}`,

    // Y8 9C Q11, Q14: x-values that do not go up by 1
    'y8-9c-steps': `
      <p class="hp-tag">Worked example: find the rule.</p>
      ${fig({ kind: 'table', rows: [['x', '0', '3', '6', '9'], ['y', '−1', '11', '23', '35']] })}
      ${steps(
        `<p><strong>Divide the y-step by the x-step.</strong> x goes up 3 while y goes up 12.</p>
         ${sum('12 ÷ 3 = 4 for each 1 across')}`,
        `<p><strong>Read y at x = 0.</strong> It is −1.</p>
         ${ans('y=4x-1')}`,
        `<p><strong>Far from x = 0?</strong> Through (10, 3) and (14, 13): y goes up 10 in 4 steps, so 10 ÷ 4 = 2.5 per step. In between: 5.5, 8, 10.5. Going back 10 steps to x = 0 takes away 25: 3 − 25 = −22.</p>
         ${sum('y = 2.5x − 22, typed y=5x/2-22')}`
      )}
      ${tip('A decimal coefficient can be typed as a decimal or a fraction: 2.5x or 5x/2.')}`,

    // Y8 9C Q12, Q13: rules with letters
    'y8-9c-letters': `
      <p class="hp-tag">Worked example: a straight line passes through <b>(0, 5)</b> and <b>(1, k)</b>. Write its rule.</p>
      ${steps(
        `<p><strong>Change in y for one step across.</strong> x goes from 0 to 1 (one step), and y goes from 5 to k. The change is k − 5, so that is the coefficient of x.</p>`,
        `<p><strong>The value at x = 0 is 5.</strong></p>
         ${sum('y = (k − 5)x + 5')}
         ${ans('y=(k-5)x+5')}`,
        `<p><strong>Check with a number.</strong> If k = 8, the rule is y = 3x + 5, which does go through (0, 5) and (1, 8) ✓.</p>`
      )}
      ${tip('Keep the whole coefficient in brackets: (k-5)x. Without them, k-5x means something different.')}`,

    // =====================================================================
    // 9D Using graphs to solve linear equations
    // =====================================================================
    // Y8 9D Q1, Q2: solve an equation from a graph
    'y8-9d-solve': `
      <p class="hp-tag">Worked example: use the graph of <b>y = 2x + 1</b> to solve <b>2x + 1 = 7</b> and <b>2x + 1 = −4</b>.</p>
      ${pl([-4, 4], [-5, 8], [ln(2, 1, [-4, 4], [-5, 8]),
        { seg: [0, 7, 3, 7], dash: true }, { seg: [3, 7, 3, 0], dash: true, arrow: 'end' },
        { seg: [0, -4, -2.5, -4], dash: true }, { seg: [-2.5, -4, -2.5, 0], dash: true, arrow: 'end' },
        { point: [3, 7], name: '(3, 7)', pos: 'e' }, { point: [-2.5, -4], name: '(−2.5, −4)', pos: 'w' }])}
      ${steps(
        `<p><strong>2x + 1 = 7 means "where is y = 7?"</strong> Start at 7 on the y-axis and go across to the line.</p>`,
        `<p><strong>Go straight down to the x-axis and read x.</strong></p>
         ${sum('x = 3 &nbsp; check: 2 × 3 + 1 = 7 ✓')}
         ${ans('3')}`,
        `<p><strong>Same again for −4.</strong> Across from −4, then up to the x-axis. It lands halfway between −3 and −2.</p>
         ${ans('-2.5')}`
      )}
      ${tip('Check by putting your x back into the rule. Halfway between grid lines is .5, so type -2.5.')}`,

    // Y8 9D Q3, Q7: reading a distance-time graph
    'y8-9d-readgraph': `
      <p class="hp-tag">Worked example: this graph shows a cyclist's ride.</p>
      ${fig({ kind: 'linegraph', xs: ['0', '1', '2', '3', '4', '5'], ys: [0, 15, 30, 30, 45, 60], ymin: 0, ymax: 60, step: 10, xlabel: 'Time (hours)', ylabel: 'Distance (km)' })}
      ${steps(
        `<p><strong>"How far after 1.5 hours?"</strong> Find 1.5 on the time axis (halfway between 1 and 2), go up to the line, then across. It is halfway between 15 and 30.</p>
         ${ans('22.5')}`,
        `<p><strong>"How long to travel 60 km?"</strong> Work the other way: find 60 on the distance axis, go across to the line, then down.</p>
         ${ans('5')}`,
        `<p><strong>A flat part means no distance is added.</strong> From 2 to 3 hours the cyclist stopped for a rest.</p>`
      )}
      ${tip('Type just the number. The unit (km or hours) is already printed after the answer box.')}`,

    // Y8 9D Q4, Q8, Q11: point of intersection
    'y8-9d-intersect': `
      <p class="hp-tag">Worked example: where do <b>y = 2x − 4</b> and <b>y = 5 − x</b> intersect?</p>
      ${steps(
        `<p><strong>Make a table for each rule with the same x-values.</strong></p>
         ${fig({ kind: 'table', rows: [['x', '0', '1', '2', '3', '4'], ['y = 2x − 4', '−4', '−2', '0', '2', '4'], ['y = 5 − x', '5', '4', '3', '2', '1']] })}`,
        `<p><strong>Graph both and find where they cross.</strong> The y-values match at x = 3.</p>
         ${pl([-1, 5], [-5, 6], [ln(2, -4, [-1, 5], [-5, 6]), ln(-1, 5, [-1, 5], [-5, 6]), { point: [3, 2], name: '(3, 2)', pos: 'e' }, { label: 'y = 2x − 4', at: [4.6, 5.6], anchor: 'end' }, { label: 'y = 5 − x', at: [1.2, 4.6], anchor: 'start' }])}
         ${ans('(3,2)')}`,
        `<p><strong>The crossing point solves 2x − 4 = 5 − x.</strong> Its x-value, 3, is the solution. A point like (1, ?) on y = 5 − x is found by substituting: 5 − 1 = 4, so (1, 4).</p>`
      )}
      ${tip('Type points as (3,2). Check both rules: 2 × 3 − 4 = 2 and 5 − 3 = 2.')}`,

    // Y8 9D Q5, Q6: graphing software and rounding
    'y8-9d-software': `
      <p class="hp-tag">Worked example: use graphing software to solve <b>1.6x − 2.3 = 3</b>, and to find where <b>y = 0.5x + 1.2</b> meets <b>y = 2.1x − 3</b>.</p>
      ${steps(
        `<p><strong>Graph y = 1.6x − 2.3 and the flat line y = 3.</strong> Click their crossing point. The software shows x = 3.3125.</p>
         ${sum('3.3125 ≈ 3.31 (2 decimal places)')}
         ${ans('3.31')}`,
        `<p><strong>For two lines, graph both and click the intersection.</strong> The software shows (2.625, 2.5125).</p>
         ${sum('(2.625, 2.5125) ≈ (2.63, 2.51)')}
         ${ans('(2.63,2.51)')}`
      )}
      ${tip('Round each coordinate to 2 decimal places only at the end. A value like 2.2 can be typed as it is.')}`,

    // Y8 9D Q9, Q10: two rules from a story
    'y8-9d-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Sam has <span class="hp-hl">$20</span> and saves <span class="hp-hl">$6</span> a week. Kim has <span class="hp-hl">$5</span> and saves <span class="hp-hl">$9</span> a week. A is the amount saved after w weeks.</p>
      ${fig({ kind: 'table', rows: [['w', '0', '1', '2', '3', '4', '5', '6'], ['Sam', '20', '26', '32', '38', '44', '50', '56'], ['Kim', '5', '14', '23', '32', '41', '50', '59']] })}
      ${steps(
        `<p><strong>Rule: starting amount + rate × weeks.</strong></p>
         ${sum('Sam: A = 20 + 6w &nbsp; Kim: A = 5 + 9w')}`,
        `<p><strong>An equation from one point.</strong> Sam has 38 after 3 weeks, so 20 + 6w = 38 has the solution w = 3.</p>
         ${ans('20+6w=38')}`,
        `<p><strong>True for both rules?</strong> Find where the rows match: w = 5, A = 50. This solves 20 + 6w = 5 + 9w.</p>
         ${ans('(5,50)')}`
      )}
      ${tip('Type the whole equation, like 20+6w=38, not just w=3. The point is written (time, amount), in the order the question gives.')}`,

    // Y8 9D Q12, Q13: equations from points, and parallel lines
    'y8-9d-pointeq': `
      <p class="hp-tag">Worked example: the point <b>(2.4, 5.2)</b> lies on <b>y = 3x − 2</b>. Write the equation in x that has the solution x = 2.4.</p>
      ${steps(
        `<p><strong>The point says: when x = 2.4, y = 5.2.</strong> Replace y in the rule with 5.2.</p>
         ${sum('3x − 2 = 5.2')}
         ${ans('3x-2=5.2')}`,
        `<p><strong>Check it.</strong></p>
         ${sum('3 × 2.4 − 2 = 7.2 − 2 = 5.2 ✓')}`,
        `<p><strong>Parallel lines never meet.</strong> y = 2x + 5 and y = 2x − 1 have the same gradient, so there is no crossing point, and 2x + 5 = 2x − 1 has no solution.</p>`
      )}
      ${tip('Type the whole equation with the rule on the left, like 3x-2=5.2.')}`,

    // Y8 9D Q14: solving with the graph of y = x squared
    'y8-9d-parabola': `
      <p class="hp-tag">Worked example: use the graph of <b>y = x²</b> to solve <b>x² = 4</b>, then <b>x² = 5</b> and <b>x² = x + 2</b>.</p>
      ${pl([-3, 3], [-1, 9], [{ poly: curve(1, 0, 0, -3, 3), open: true }, { seg: [-3, 4, 3, 4], dash: true },
        { point: [-2, 4], name: '(−2, 4)', pos: 'nw' }, { point: [2, 4], name: '(2, 4)', pos: 'ne' }, { label: 'y = x²', at: [2.4, 8.4], anchor: 'end' }])}
      ${steps(
        `<p><strong>Go across from 4 on the y-axis.</strong> You hit the curve twice, at x = −2 and x = 2.</p>
         ${ans('2, -2')}`,
        `<p><strong>Not on a grid line?</strong> Use software: across from 5 hits the curve at x ≈ 2.24 and x ≈ −2.24.</p>`,
        `<p><strong>Two graphs.</strong> Draw y = x² and y = x + 2. They cross at x = −1 and x = 2. Check: (−1)² = 1 and −1 + 2 = 1 ✓.</p>`
      )}
      <p><strong>Below the x-axis?</strong> y = x² is never negative, so x² = −1 has no solutions.</p>
      ${tip('There are usually two answers, one positive and one negative. Type both, separated by a comma.')}`,

    // =====================================================================
    // 9E Using graphs to solve linear inequalities
    // =====================================================================
    // Y8 9E Q1, Q2, Q12: horizontal and vertical lines
    'y8-9e-lines': `
      <p class="hp-tag">Worked example: write the rule for each line, and where it crosses an axis.</p>
      ${pl([-4, 4], [-3, 5], [{ seg: [-4, 4, 4, 4] }, { seg: [-1, -3, -1, 5] }, { point: [0, 4], name: '(0, 4)', pos: 'ne' }, { point: [-1, 0], name: '(−1, 0)', pos: 'nw' },
        { label: 'A', at: [3.6, 4.4] }, { label: 'B', at: [-1.3, -2.6], anchor: 'end' }])}
      ${steps(
        `<p><strong>Line A is horizontal.</strong> Every point on it has y = 4. It crosses the y-axis at (0, 4).</p>
         ${ans('y=4')}`,
        `<p><strong>Line B is vertical.</strong> Every point on it has x = −1. It crosses the x-axis at (−1, 0).</p>
         ${ans('x=-1')}`,
        `<p><strong>The axes are lines too.</strong> Ask which coordinate is always 0 along each one.</p>`
      )}
      ${tip('A horizontal line has a "y =" rule even though it runs across. Type rules like y=4 and points like (-1,0).')}`,

    // Y8 9E Q3, Q4, Q8, Q10: boundary lines and shading
    'y8-9e-boundary': `
      <p class="hp-tag">Worked example: sketch the region <b>x ≤ 2</b>.</p>
      ${pl([-4, 4], [-4, 4], [{ seg: [2, -4, 2, 4] }, { point: [2, 0], name: '(2, 0)', pos: 'ne' }], hatch([[-4, -4], [2, -4], [2, 4], [-4, 4]]))}
      ${steps(
        `<p><strong>Draw the boundary line</strong> x = 2, a vertical line.</p>`,
        `<p><strong>Solid or dashed?</strong> ≤ and ≥ include the line, so draw it solid. &lt; and &gt; leave it out, so draw it dashed.</p>`,
        `<p><strong>Which side?</strong> x-values less than 2 are to the left, so shade the left.</p>
         ${ans('Solid line, shade to the left')}`
      )}
      ${chips(['y &gt; or y ≥: above'], ['y &lt; or y ≤: below'], ['x &gt; or x ≥: right'], ['x &lt; or x ≤: left'])}
      <p><strong>Reading a region:</strong> shading to the right of a dashed x = −1 is x &gt; −1. <strong>Testing a point:</strong> is (4, 1) in x ≤ 2? 4 ≤ 2 is false, so no.</p>
      ${tip('Type ≥ as >= and ≤ as <=, like x<=2.')}`,

    // Y8 9E Q5, Q6, Q13: solving with a line that slopes up
    'y8-9e-solve-up': `
      <p class="hp-tag">Worked example: use the graph of <b>y = 2x − 2</b> to solve <b>2x − 2 = 2</b>, then <b>2x − 2 ≥ 2</b>.</p>
      ${pl([-3, 4], [-6, 6], [ln(2, -2, [-3, 4], [-6, 6]), { seg: [-3, 2, 4, 2], dash: true }, { seg: [2, 2, 2, 0], dash: true, arrow: 'end' }, { point: [2, 2], name: '(2, 2)', pos: 'nw' }, { label: 'y = 2', at: [3.9, 2.4], anchor: 'end' }])}
      ${steps(
        `<p><strong>Equation first.</strong> Across from 2 on the y-axis to the line, then down: x = 2.</p>
         ${ans('2')}`,
        `<p><strong>Inequality: where is the line at or above height 2?</strong> The line slopes up, so it is above y = 2 to the right of x = 2.</p>
         ${ans('x>=2')}`,
        `<p><strong>Compared with 0?</strong> Use the x-axis. The line crosses it at x = 1 and is above it to the right, so 2x − 2 ≥ 0 gives x ≥ 1.</p>`
      )}
      ${tip('When the line slopes up, the sign stays the same way round: ≥ gives >=, > gives >.')}`,

    // Y8 9E Q7, Q9: solving with a line that slopes down
    'y8-9e-solve-down': `
      <p class="hp-tag">Worked example: use the graph of <b>y = −x + 4</b> to solve <b>−x + 4 &gt; 1</b>, then <b>−x + 4 = 6</b>.</p>
      ${pl([-3, 6], [-3, 7], [ln(-1, 4, [-3, 6], [-3, 7]), { seg: [-3, 1, 6, 1], dash: true }, { seg: [3, 1, 3, 0], dash: true, arrow: 'end' }, { point: [3, 1], name: '(3, 1)', pos: 'ne' }, { label: 'y = 1', at: [5.9, 1.4], anchor: 'end' }])}
      ${steps(
        `<p><strong>Find where the line is exactly at 1.</strong> Across from 1, then down: x = 3.</p>`,
        `<p><strong>Where is the line above 1?</strong> It slopes down, so it is higher to the <b>left</b> of x = 3. The line itself is not included, because the sign is &gt;.</p>
         ${ans('x<3')}`,
        `<p><strong>The equation −x + 4 = 6.</strong> Across from 6 meets the line above x = −2.</p>
         ${ans('-2')}`
      )}
      ${tip('When the line slopes down, the x-answer points the other way: "above" turns into x <, and "below" turns into x >.')}`,

    // Y8 9E Q11, Q14: rectangles made by lines
    'y8-9e-rect': `
      <p class="hp-tag">Worked example: the lines <b>x = −3, x = 2, y = 1, y = 4</b> enclose a rectangle. Find its area and the four inequalities that describe it.</p>
      ${pl([-4, 3], [-1, 5], [{ seg: [-3, 1, 2, 1] }, { seg: [2, 1, 2, 4] }, { seg: [2, 4, -3, 4] }, { seg: [-3, 4, -3, 1] }], hatch([[-3, 1], [2, 1], [2, 4], [-3, 4]]))}
      ${steps(
        `<p><strong>Width: from x = −3 to x = 2.</strong> Height: from y = 1 to y = 4.</p>
         ${sum('2 − (−3) = 5 &nbsp; 4 − 1 = 3')}`,
        `<p><strong>Area = width × height.</strong></p>
         ${sum('5 × 3 = 15')}
         ${ans('15')}`,
        `<p><strong>Inequalities: x between −3 and 2, y between 1 and 4.</strong></p>
         ${ans('x ≥ -3, x ≤ 2, y ≥ 1, y ≤ 4')}`
      )}
      ${tip('Take the smaller value from the larger to get each side, even when one of them is negative.')}`,

    // Y8 9E Q15: half planes with a sloping boundary
    'y8-9e-halfplane': `
      <p class="hp-tag">Worked example: sketch the region <b>y &lt; 2x</b>.</p>
      ${pl([-4, 4], [-4, 4], [ln(2, 0, [-4, 4], [-4, 4], { dash: true }), { point: [2, 0], name: '(2, 0)', pos: 'se' }, { label: 'y = 2x', at: [2.2, 3.6], anchor: 'start' }], hatch([[-2, -4], [4, -4], [4, 4], [2, 4]]))}
      ${steps(
        `<p><strong>Boundary line y = 2x.</strong> The sign is &lt;, so draw it dashed.</p>`,
        `<p><strong>Test a point that is not on the line</strong>, say (2, 0).</p>
         ${sum('Is 0 &lt; 2 × 2? &nbsp; 0 &lt; 4 ✓')}`,
        `<p><strong>Shade the side with the test point.</strong> (2, 0) is below the line.</p>
         ${ans('Dashed line, shade below it')}`
      )}
      ${tip('With y on its own on the left: y > or y ≥ shades above the line, y < or y ≤ shades below. Do not test a point on the line, such as (0, 0) here.')}`,

    // =====================================================================
    // 9F The x- and y-intercepts
    // =====================================================================
    // Y8 9F Q1, Q2, Q3, Q5, Q7, Q8, Q14: intercepts from a rule
    'y8-9f-intercepts': `
      <p class="hp-tag">Worked example: find the x- and y-intercepts of <b>y = 4x − 4</b>.</p>
      ${fig({ kind: 'plane', x: [-2, 3], y: [-5, 4], path: [[-0.25, -5], [2, 4]], points: { '(1, 0)': [1, 0], '(0, −4)': [0, -4] } })}
      ${steps(
        `<p><strong>y-intercept: put x = 0.</strong></p>
         ${sum('y = 4 × 0 − 4 = −4, so (0, −4)')}`,
        `<p><strong>x-intercept: put y = 0 and solve.</strong></p>
         ${sum('0 = 4x − 4 → 4x = 4 → x = 1, so (1, 0)')}
         ${ans('(1,0) and (0,-4)')}`,
        `<p><strong>A fraction answer.</strong> For y = −4x + 6: 0 = −4x + 6, so 4x = 6 and x = 6/4 = 3/2. The y-intercept is (0, 6).</p>
         ${ans('(3/2,0)')}`
      )}
      ${tip('The y-intercept is always the number on its own, so rules with the same constant share a y-intercept. Type fractions with /, like (3/2,0).')}`,

    // Y8 9F Q4: reading intercepts off a graph
    'y8-9f-readgraph': `
      <p class="hp-tag">Worked example: read off where this line crosses each axis.</p>
      ${fig({ kind: 'plane', x: [-5, 2], y: [-2, 4], path: [[-4.5, -1], [1.5, 3]], points: { A: [-3, 0], B: [0, 2] } })}
      ${steps(
        `<p><strong>x-intercept: where the line crosses the horizontal axis.</strong> At A, x = −3 and y is 0.</p>
         ${ans('(-3,0)')}`,
        `<p><strong>y-intercept: where it crosses the vertical axis.</strong> At B, x is 0 and y = 2.</p>
         ${ans('(0,2)')}`
      )}
      ${tip('An x-intercept always looks like (number, 0) and a y-intercept like (0, number). Do not swap them.')}`,

    // Y8 9F Q6: area of the triangle made with the axes
    'y8-9f-area': `
      <p class="hp-tag">Worked example: find the area of the triangle enclosed by the axes and <b>y = 3x − 15</b>.</p>
      ${axes([{ poly: [[0, 0], [2.6, 0], [0, -3.4]], fill: true }, { seg: [-0.4, -3.9, 3.2, 0.8] }, { point: [2.6, 0], name: '(5, 0)', pos: 'se' }, { point: [0, -3.4], name: '(0, −15)', pos: 'w' }, { label: '5', at: [1.3, 0.35] }, { label: '15', at: [0.25, -1.7], anchor: 'start' }], 'A sketch of a triangle made by a line and the axes')}
      ${steps(
        `<p><strong>Find both intercepts.</strong></p>
         ${sum('x = 0: y = −15 → (0, −15)<br>y = 0: 3x = 15 → x = 5 → (5, 0)')}`,
        `<p><strong>The triangle has a right angle at O.</strong> Its base is 5 and its height is 15 (lengths are never negative).</p>`,
        `<p><strong>Area = ½ × base × height.</strong></p>
         ${sum('½ × 5 × 15 = 37.5')}
         ${ans('37.5')}`
      )}
      ${tip('A half answer can be typed as a decimal or a fraction: 37.5 or 75/2.')}`,

    // Y8 9F Q9: intercepts from two points
    'y8-9f-twopoints': `
      <p class="hp-tag">Worked example: a straight line passes through <b>(5, 3)</b> and <b>(7, 9)</b>. Find its intercepts.</p>
      ${steps(
        `<p><strong>Find the step.</strong> From x = 5 to x = 7 is 2 across, and y goes from 3 to 9, up 6. So y goes up 3 for each 1 across.</p>`,
        `<p><strong>Step back one at a time to x = 0</strong>, taking 3 off y each time.</p>
         ${fig({ kind: 'table', rows: [['x', '7', '6', '5', '4', '3', '2', '1', '0'], ['y', '9', '6', '3', '0', '−3', '−6', '−9', '−12']] })}`,
        `<p><strong>Read the intercepts.</strong> y = 0 at x = 4, and at x = 0, y = −12.</p>
         ${ans('(4,0) and (0,-12)')}`
      )}
      ${tip('The table also gives the rule: up 3 each step and −12 at x = 0, so y = 3x − 12. Check: 3 × 7 − 12 = 9 ✓.')}`,

    // Y8 9F Q10, Q11: intercepts in a story
    'y8-9f-context': `
      <p class="hp-tag">Worked example: a candle's height is <b>h = −2t + 30</b> cm after t hours. (a) How tall is it at the start? (b) When does it burn out?</p>
      ${fig({ kind: 'linegraph', xs: ['0', '5', '10', '15'], ys: [30, 20, 10, 0], ymin: 0, ymax: 30, step: 5, xlabel: 'Time (hours)', ylabel: 'Height (cm)' })}
      ${steps(
        `<p><strong>"At the start" means t = 0.</strong> That gives the vertical intercept.</p>
         ${sum('h = −2 × 0 + 30 = 30')}
         ${ans('30')}`,
        `<p><strong>"Burns out" means h = 0.</strong> That gives the horizontal intercept.</p>
         ${sum('0 = −2t + 30 → 2t = 30 → t = 15')}
         ${ans('15')}`
      )}
      ${tip('"Empty", "runs out" or "reaches the ground" all mean the amount is 0. Type just the number; the unit is shown after the box.')}`,

    // Y8 9F Q12, Q13: lines with a missing or shared intercept
    'y8-9f-special': `
      <p class="hp-tag">Worked example: find the intercepts of <b>y = −2</b> and of <b>y = −3x</b>.</p>
      ${pl([-3, 3], [-4, 4], [{ seg: [-3, -2, 3, -2] }, ln(-3, 0, [-3, 3], [-4, 4]), { label: 'y = −2', at: [2.9, -1.6], anchor: 'end' }, { label: 'y = −3x', at: [-1.2, 3.6], anchor: 'end' }])}
      ${steps(
        `<p><strong>y = −2 is horizontal.</strong> It runs alongside the x-axis and never meets it, so it has no x-intercept. Its y-intercept is (0, −2).</p>`,
        `<p><strong>y = −3x has no constant.</strong> x = 0 gives y = 0, and y = 0 gives x = 0. Both intercepts are the origin.</p>
         ${ans('(0,0)')}`
      )}
      ${tip('Any rule of the form y = (number) × x, with nothing added, passes through (0, 0). In the same way, a vertical line like x = 3 has no y-intercept.')}`,

    // Y8 9F Q16: x-intercept of a rule like ax + by = c
    'y8-9f-general': `
      <p class="hp-tag">Worked example: find the x-intercept of <b>2x + 7y = 14</b>, and of <b>2y − 5x = 3</b>.</p>
      ${steps(
        `<p><strong>The x-intercept has y = 0, so the y term disappears.</strong></p>
         ${sum('2x + 7 × 0 = 14 → 2x = 14 → x = 7')}
         ${ans('(7,0)')}`,
        `<p><strong>Keep the sign with the x term.</strong></p>
         ${sum('2 × 0 − 5x = 3 → −5x = 3 → x = −3/5')}
         ${ans('(-3/5,0)')}`
      )}
      ${tip('A negative times x equal to a positive number gives a negative x. Type fractions with /, like (-3/5,0).')}`,

    // =====================================================================
    // 9G Gradient
    // =====================================================================
    // Y8 9G Q1, Q2, Q10: the sign of a gradient
    'y8-9g-sign': `
      ${axes([{ seg: [-3.5, -2.5, 3, 3.2], arrow: 'both' }, { label: 'positive', at: [3.2, 3.6], anchor: 'start' },
        { seg: [-3.5, 3.4, 2.5, -3.6], arrow: 'both' }, { label: 'negative', at: [2.7, -3.9], anchor: 'start' },
        { seg: [-3.6, -3.2, 3.6, -3.2], arrow: 'both' }, { label: 'zero', at: [3.4, -2.7] },
        { seg: [-2.4, -3.8, -2.4, 3.8], arrow: 'both' }, { label: 'undefined', at: [-2.6, 4.1], anchor: 'end' }], 'Lines with positive, negative, zero and undefined gradients')}
      <p class="hp-tag">How to decide:</p>
      ${steps(
        `<p><strong>Read the line from left to right, like a word.</strong> Uphill is a <b>positive</b> gradient. Downhill is <b>negative</b>.</p>`,
        `<p><strong>Flat (horizontal): zero.</strong> It never rises, so rise ÷ run is 0.</p>`,
        `<p><strong>Straight up (vertical): undefined.</strong> The run is 0, and you cannot divide by 0.</p>
         ${ans('positive, negative, zero, undefined')}`
      )}
      <p><strong>Rules like y = kx:</strong> y = 4x goes uphill and y = −2x goes downhill. The number in front of x is the gradient, and its sign tells you the direction.</p>
      ${tip('Always read from left to right. A line that looks steep downhill still has a negative gradient.')}`,

    // Y8 9G Q3, Q4, Q7: gradient from a graph with rise over run
    'y8-9g-riserun': `
      <p class="hp-tag">Worked example: find the gradient of the line through <b>(−1, −2)</b> and <b>(2, 3)</b>.</p>
      ${pl([-2, 3], [-3, 4], [ln(5 / 3, -1 / 3, [-2, 3], [-3, 4]), { seg: [-1, -2, 2, -2], dash: true }, { seg: [2, -2, 2, 3], dash: true },
        { label: 'run 3', at: [0.5, -2.55] }, { label: 'rise 5', at: [2.2, 0.5], anchor: 'start' },
        { point: [-1, -2], name: '(−1, −2)', pos: 'nw' }, { point: [2, 3], name: '(2, 3)', pos: 'w' }])}
      ${steps(
        `<p><strong>Pick two points on grid corners.</strong> Go from the left point to the right point.</p>`,
        `<p><strong>Run = across, rise = up.</strong> Here the run is 3 and the rise is 5.</p>`,
        `<p><strong>Gradient = rise ÷ run.</strong></p>
         ${sum('5/3')}
         ${ans('5/3')}`
      )}
      <p><strong>Going down?</strong> From (−2, 3) to (3, 1), the run is 5 and the line falls 2, so the rise is −2 and the gradient is −2/5.</p>
      ${tip('Go left to right so the run is always positive; the sign comes from the rise. Type fractions with /, like -2/5, and simplify: 6/3 is 2.')}`,

    // Y8 9G Q5, Q6: which slope is steeper?
    'y8-9g-compare': `
      <p class="hp-tag">Worked example: path A rises <b>12 m for every 5 m</b> across. Path B rises <b>17 m for every 7 m</b> across. Which is steeper?</p>
      ${steps(
        `<p><strong>Gradient of A = rise ÷ run.</strong></p>
         ${sum('12 ÷ 5 = 2.4')}`,
        `<p><strong>Gradient of B.</strong></p>
         ${sum('17 ÷ 7 = 2.428... ≈ 2.43')}`,
        `<p><strong>The bigger gradient is steeper.</strong></p>
         ${ans('Path B')}`
      )}
      ${tip('For a slope that falls, compare the sizes of the gradients: falling 3 m for every 1 m across is steeper than falling 2 m.')}`,

    // Y8 9G Q8, Q13: gradient from two points
    'y8-9g-points': `
      <p class="hp-tag">Worked example: find the gradient of the line joining <b>(−2, 5)</b> and <b>(4, −4)</b>.</p>
      ${steps(
        `<p><strong>Rise = difference in the y-values.</strong> Second take first.</p>
         ${sum('−4 − 5 = −9')}`,
        `<p><strong>Run = difference in the x-values, in the same order.</strong></p>
         ${sum('4 − (−2) = 6')}`,
        `<p><strong>Divide and simplify.</strong></p>
         ${sum('−9/6 = −3/2')}
         ${ans('-3/2')}`
      )}
      <p><strong>Fractions in the coordinates?</strong> For (1/2, 3) and (5/2, −1): rise = −1 − 3 = −4, run = 5/2 − 1/2 = 2, so the gradient is −2.</p>
      ${tip('Subtract in the same order on the top and the bottom. Simplify the fraction before you type it.')}`,

    // Y8 9G Q9, Q11, Q12: lines from the origin with a given gradient
    'y8-9g-origin': `
      <p class="hp-tag">Worked example: a line with gradient <b>5/2</b> joins (0, 0) to (a, b). Find b when a = 4, and a when b = −15. Then write rules for b and for a.</p>
      ${fig({ kind: 'plane', x: [-1, 5], y: [-1, 11], path: [[0, 0], [4, 10]], points: { '(4, 10)': [4, 10] } })}
      ${steps(
        `<p><strong>From the origin, rise = b and run = a.</strong> So b ÷ a = 5/2, which means b = 5/2 × a.</p>`,
        `<p><strong>Use it both ways.</strong></p>
         ${sum('a = 4: b = 5/2 × 4 = 10<br>b = −15: a = −15 × 2/5 = −6')}`,
        `<p><strong>Write the rules.</strong> Multiply by the gradient to get b; divide by it (multiply by 2/5) to get a.</p>
         ${ans('b=5a/2 and a=2b/5')}`
      )}
      ${tip('Start the rule with the letter asked for, like b=5a/2. Check a point: 10 ÷ 4 = 5/2 ✓.')}`,

    // =====================================================================
    // 9H Gradient-intercept form
    // =====================================================================
    // Y8 9H Q1, Q2: reading m and c
    'y8-9h-mc': `
      <p class="hp-tag">Worked example: state the gradient m and the y-intercept c of <b>y = 6x − 1</b>, <b>y = −2/5 x + 4</b> and <b>y = 8 − x</b>.</p>
      ${chips(['y = mx + c'], ['m: the number in front of x', 'add'], ['c: the number on its own', 'take'])}
      ${steps(
        `<p><strong>y = 6x − 1.</strong> The sign belongs to the number after it.</p>
         ${ans('m = 6, c = -1')}`,
        `<p><strong>y = −2/5 x + 4.</strong> The fraction in front of x is m.</p>
         ${ans('m = -2/5, c = 4')}`,
        `<p><strong>y = 8 − x.</strong> Reorder it first: y = −x + 8. A bare −x means −1 × x.</p>
         ${ans('m = -1, c = 8')}`
      )}
      ${tip('Type each value in its own box, with fractions written with /, like -2/5.')}`,

    // Y8 9H Q3, Q4, Q5: rule from a graph
    'y8-9h-graph': `
      <p class="hp-tag">Worked example: find the rule for this graph.</p>
      ${fig({ kind: 'plane', x: [-2, 2], y: [-4, 5], path: [[-0.75, -4], [1.5, 5]], points: { '(0, −1)': [0, -1], '(1, 3)': [1, 3] } })}
      ${steps(
        `<p><strong>c is where the line crosses the y-axis.</strong> Here c = −1.</p>`,
        `<p><strong>m is rise ÷ run.</strong> From (0, −1) to (1, 3): rise 4, run 1, so m = 4.</p>`,
        `<p><strong>Put them into y = mx + c.</strong></p>
         ${ans('y=4x-1')}`
      )}
      <p><strong>A fraction gradient.</strong> A line through (0, 1) and (3, −1) has c = 1 and m = −2/3. Its rule is y = −2x/3 + 1.</p>
      ${tip('Start with y =. Type a fraction gradient as 2x/3 or 2/3x, so y=-2x/3+1.')}`,

    // Y8 9H Q6, Q7: steepness and sketches without numbers
    'y8-9h-steep': `
      <p class="hp-tag">Worked example: order <b>A: y = 4x − 3</b>, <b>B: y = x + 6</b>, <b>C: y = 6x + 2</b> from steepest to least steep.</p>
      ${steps(
        `<p><strong>Steepness depends only on m.</strong> A has m = 4, B has m = 1, C has m = 6.</p>
         ${ans('C, A, B')}`,
        `<p><strong>A sketch with no numbers.</strong> For y = −2x + 1, m is negative so the line goes down, and c is positive so it crosses the y-axis above O.</p>
         ${axes([{ seg: [-2, 3.8, 1.6, -3.4], arrow: 'both' }, { point: [0, 1.4], name: 'c > 0', pos: 'e' }], 'A sketch of a line sloping down that crosses the y-axis above the origin')}`
      )}
      ${tip('c moves the line up or down but never changes how steep it is. For a sketch, check the sign of m (up or down) and the sign of c (above or below O).')}`,

    // Y8 9H Q8, Q9, Q10, Q11: rule from two points
    'y8-9h-points': `
      <p class="hp-tag">Worked example: find the rule of the line through <b>(−1, 6)</b> and <b>(3, −2)</b>.</p>
      ${steps(
        `<p><strong>Find m = rise ÷ run.</strong></p>
         ${sum('rise: −2 − 6 = −8 &nbsp; run: 3 − (−1) = 4 &nbsp; m = −8/4 = −2')}`,
        `<p><strong>Find c: put one point into y = −2x + c.</strong> Use (−1, 6).</p>
         ${sum('6 = −2 × (−1) + c → 6 = 2 + c → c = 4')}`,
        `<p><strong>Write the rule and check the other point.</strong> −2 × 3 + 4 = −2 ✓.</p>
         ${ans('y=-2x+4')}`
      )}
      <p><strong>Parallel lines have the same m.</strong> Parallel to y = 5x + 2 and through (0, −3) gives y = 5x − 3. <strong>Same y-values?</strong> Through (0, 5) and (4, 5), m = 0, so the rule is just y = 5.</p>
      ${tip('If one point is on the y-axis, like (0, 7), its y-value is c straight away.')}`,

    // Y8 9H Q12: rules with pronumerals
    'y8-9h-letters': `
      <p class="hp-tag">Worked example: write the rule for (a) the line through O and <b>(2t, t)</b>, (b) the line through <b>(0, a)</b> and <b>(b, 2a)</b>.</p>
      ${steps(
        `<p><strong>Treat the letters like numbers: m = rise ÷ run.</strong></p>
         ${sum('(a) m = t ÷ 2t = 1/2 (the t cancels)')}`,
        `<p><strong>(a) goes through O, so c = 0.</strong></p>
         ${ans('y=x/2')}`,
        `<p><strong>(b) rise = 2a − a = a, run = b − 0 = b, so m = a/b.</strong> It crosses the y-axis at (0, a), so c = a.</p>
         ${ans('y=ax/b+a')}`
      )}
      ${tip('Cancel any letter that is on the top and the bottom. Type letters next to each other for multiplying, like ax/b.')}`,

    // Y8 9H Q13: rearranging into y = mx + c
    'y8-9h-rearrange': `
      <p class="hp-tag">Worked example: write <b>4y − 6x = 8</b> in the form y = mx + c, then state m and c.</p>
      ${steps(
        `<p><strong>Get the y term on its own.</strong> Add 6x to both sides.</p>
         ${sum('4y = 6x + 8')}`,
        `<p><strong>Divide every term by 4.</strong></p>
         ${sum('y = 6x/4 + 8/4 = 3x/2 + 2')}`,
        `<p><strong>Read off m and c.</strong></p>
         ${ans('m = 3/2, c = 2')}`
      )}
      ${tip('Divide every term, not just the first one. A term changes sign when it moves to the other side of the =.')}`,

    // Y8 9H Q14: using c and m to find a point
    'y8-9h-sketch': `
      <p class="hp-tag">Worked example: find the point on (a) <b>y = −2x + 4</b> at x = 1, (b) <b>y = 3/4 x − 2</b> at x = 4.</p>
      ${pl([-1, 5], [-3, 3], [ln(0.75, -2, [-1, 5], [-3, 3]), { seg: [0, -2, 4, -2], dash: true }, { seg: [4, -2, 4, 1], dash: true },
        { label: '4 right', at: [2, -2.6] }, { label: '3 up', at: [4.2, -1.2], anchor: 'start' }, { point: [0, -2] }, { point: [4, 1], name: '(4, 1)', pos: 'nw' }])}
      ${steps(
        `<p><strong>(a) Start at c on the y-axis</strong>: (0, 4). A gradient of −2 means 1 right, 2 down.</p>
         ${ans('(1,2)')}`,
        `<p><strong>(b) Start at (0, −2).</strong> A gradient of 3/4 means 4 right, 3 up.</p>
         ${ans('(4,1)')}`,
        `<p><strong>Check by substituting.</strong> 3/4 × 4 − 2 = 3 − 2 = 1 ✓.</p>`
      )}
      ${tip('With a fraction gradient, step across by the bottom number and up by the top number. Type points like (4,1).')}`,

    // =====================================================================
    // 9I Applications of straight line graphs
    // =====================================================================
    // Y8 9I Q1, Q2: constant speed
    'y8-9i-speed': `
      <p class="hp-tag">Worked example: a cyclist rides at a constant <b>12 km per hour</b> for 4 hours.</p>
      ${fig({ kind: 'table', rows: [['t (hours)', '0', '1', '2', '3', '4'], ['d (km)', '0', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Each hour adds 12 km.</strong></p>
         ${ans('12, 24, 36, 48')}`,
        `<p><strong>Distance = speed × time.</strong></p>
         ${ans('d=12t')}`,
        `<p><strong>Use the rule both ways.</strong></p>
         ${sum('after 1.5 hours: 12 × 1.5 = 18 km<br>to reach 30 km: 12t = 30 → t = 30 ÷ 12 = 2.5 hours')}`
      )}
      ${tip('Start the rule with the letter asked for, like d=12t. Type just the number in the other answers; the unit is shown after the box.')}`,

    // Y8 9I Q6, Q7: hours and minutes, days and hours
    'y8-9i-units': `
      <p class="hp-tag">Worked example: a swimmer covers a <b>5 km</b> course at <b>2 km per hour</b>. Write a rule, then find the time to finish in hours and minutes.</p>
      ${steps(
        `<p><strong>Rule: distance = speed × time.</strong></p>
         ${sum('d = 2t')}`,
        `<p><strong>Time for the whole course.</strong></p>
         ${sum('2t = 5 → t = 5 ÷ 2 = 2.5 hours')}`,
        `<p><strong>Turn the decimal part into minutes</strong> by multiplying by 60.</p>
         ${sum('0.5 × 60 = 30 minutes, so 2 hours 30 minutes')}
         ${ans('2, 30')}`
      )}
      <p><strong>Days and hours.</strong> A plant grows 4 cm a day from nothing. To reach 10 cm takes 10 ÷ 4 = 2.5 days, and 0.5 × 24 = 12 hours, so 2 days 12 hours.</p>
      ${tip('Multiply the part of an hour by 60 for minutes, and the part of a day by 24 for hours. Type the two numbers with a comma, like 2, 30.')}`,

    // Y8 9I Q3, Q4, Q5: an amount going down at a steady rate
    'y8-9i-drain': `
      <p class="hp-tag">Worked example: a tank holds <b>50 L</b> and drains at <b>5 L per minute</b>.</p>
      ${fig({ kind: 'table', rows: [['t (min)', '0', '1', '2', '3', '4', '5'], ['V (L)', '50', '?', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Take 5 off for each minute.</strong></p>
         ${ans('45, 40, 35, 30, 25')}`,
        `<p><strong>Rule: start − rate × time.</strong></p>
         ${ans('V=50-5t')}`,
        `<p><strong>Use the rule.</strong></p>
         ${sum('after 2.5 min: 50 − 5 × 2.5 = 50 − 12.5 = 37.5 L<br>down to 20 L: it loses 30 L, and 30 ÷ 5 = 6 minutes<br>empty: 50 ÷ 5 = 10 minutes')}`
      )}
      ${tip('For "how long until it reaches ...", work out how much it has lost, then divide by the rate.')}`,

    // Y8 9I Q8, Q9: what the numbers in a rule mean
    'y8-9i-meaning': `
      <p class="hp-tag">Worked example: a lift's height above the ground is <b>h = 40 − 5t</b> metres after t seconds.</p>
      ${steps(
        `<p><strong>The number on its own is the starting value.</strong> At t = 0, h = 40, so it starts 40 m up.</p>`,
        `<p><strong>The number with t is the change each second.</strong> It is −5, so the lift goes <b>down</b> 5 m every second. A + sign would mean going up.</p>`,
        `<p><strong>Use it.</strong></p>
         ${sum('after 3 s: 40 − 5 × 3 = 40 − 15 = 25 m<br>ground: 40 − 5t = 0 → 5t = 40 → t = 8 s')}
         ${ans('40, down, 25, 8')}`
      )}
      <p><strong>A new start, same speed?</strong> Starting at 60 m instead: h = 60 − 5t.</p>
      ${tip('In "start ± rate × time", only the rate decides whether the amount goes up or down.')}`,

    // Y8 9I Q10: a fixed fee plus a rate
    'y8-9i-cost': `
      <p class="hp-tag">Worked example: a parking meter charges <b>50 cents</b> plus <b>2.5 cents per minute</b>. Write a rule for the cost (a) c cents, (b) D dollars, for t minutes.</p>
      ${steps(
        `<p><strong>Rate × time, plus the fixed fee.</strong></p>
         ${ans('c=2.5t+50')}`,
        `<p><strong>Cents to dollars: divide every term by 100.</strong> 2.5 cents is $0.025 and 50 cents is $0.5.</p>
         ${ans('D=0.025t+0.5')}`,
        `<p><strong>Check with a real time.</strong> 10 minutes: 2.5 × 10 + 50 = 75 cents, and 0.025 × 10 + 0.5 = 0.75 dollars ✓.</p>`
      )}
      ${tip('Start with the letter asked for, c or D. Dividing by 100 moves every decimal point two places left.')}`,

    // Y8 9I Q11: two things moving at once
    'y8-9i-two': `
      <p class="hp-tag">Worked example: lift A starts at the ground and rises <b>4 m per second</b>. At the same moment lift B is at <b>50 m</b> and comes down <b>2 m per second</b>.</p>
      ${fig({ kind: 'table', rows: [['t (s)', '0', '2', '4', '6', '8'], ['A (m)', '0', '8', '16', '24', '32'], ['B (m)', '50', '46', '42', '38', '34']] })}
      ${steps(
        `<p><strong>Write a rule for each.</strong></p>
         ${sum('A: h = 4t &nbsp; B: h = 50 − 2t')}`,
        `<p><strong>Same height: make the rules equal.</strong></p>
         ${sum('4t = 50 − 2t → 6t = 50 → t = 50/6 = 25/3 = 8 1/3')}
         ${ans('8 1/3')}`,
        `<p><strong>Other questions use one rule.</strong> B reaches the ground when 50 − 2t = 0, so t = 25 s. A is at 30 m when 4t = 30, so t = 7.5 s.</p>`
      )}
      ${tip('For an exact answer, type a fraction or a mixed numeral, like 25/3 or 8 1/3, not a rounded decimal.')}`,

    // =====================================================================
    // 9J Non-linear graphs
    // =====================================================================
    // Y8 9J Q1, Q2: table of values for a curve
    'y8-9j-table': `
      <p class="hp-tag">Worked example: complete the table for <b>y = x² − 2</b>, then plot it.</p>
      ${fig({ kind: 'table', rows: [['x', '−3', '−2', '−1', '0', '1', '2', '3'], ['y', '?', '?', '?', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Square first, then take 2.</strong> A negative number squared is positive.</p>
         ${sum(`x = −3: ${now('(−3)²')} = 9, then 9 − 2 = 7`)}`,
        `<p><strong>Work along the row.</strong> The values mirror each side of x = 0.</p>
         ${ans('7, 2, -1, -2, -1, 2, 7')}`,
        `<p><strong>Plot and join with a smooth curve.</strong> It is a U shape, called a parabola. Its lowest point is (0, −2).</p>
         ${fig({ kind: 'plane', x: [-3, 3], y: [-3, 7], path: curve(1, 0, -2, -3, 3), points: { '(0, −2)': [0, -2] } })}`
      )}
      <p><strong>Brackets in the rule?</strong> y = x(4 − x) at x = 1 is 1 × 3 = 3: work out the bracket first.</p>
      ${tip('Type the missing values from left to right, with commas. Use the mirror pattern to check your work.')}`,

    // Y8 9J Q3: a curve from real data
    'y8-9j-data': `
      <p class="hp-tag">Worked example: the price of a punnet of strawberries over 6 months.</p>
      ${fig({ kind: 'table', rows: [['Month', '0', '1', '2', '3', '4', '5', '6'], ['Price ($)', '4.20', '3.70', '3.40', '3.30', '3.40', '3.70', '4.20']] })}
      ${steps(
        `<p><strong>Plot the points and join them with a smooth curve.</strong> It falls, then rises: a U shape.</p>
         ${fig({ kind: 'linegraph', xs: ['0', '1', '2', '3', '4', '5', '6'], ys: [4.2, 3.7, 3.4, 3.3, 3.4, 3.7, 4.2], ymin: 3, ymax: 4.5, step: 0.5, xlabel: 'Month', ylabel: 'Price ($)' })}`,
        `<p><strong>A rise or fall is a difference.</strong> The fall in the first month:</p>
         ${sum('4.20 − 3.70 = 0.50')}
         ${ans('0.5')}`,
        `<p><strong>Predicting:</strong> the rises are growing (0.10, then 0.30, then 0.50), so month 7 will be a bigger rise again, above $4.20.</p>`
      )}
      ${tip('Type just the number, like 0.5. Subtract the earlier value from the later one to see a rise, or the later from the earlier for a fall.')}`,

    // Y8 9J Q4, Q9: biggest area for a fixed perimeter
    'y8-9j-maxarea': `
      <p class="hp-tag">Worked example: a rectangle is made from <b>20 cm</b> of string. Which width gives the biggest area?</p>
      ${steps(
        `<p><strong>Half the string makes one width and one length.</strong> Width + length = 10, so length = 10 − width.</p>`,
        `<p><strong>Area = width × length.</strong> Fill in a table.</p>
         ${fig({ kind: 'table', rows: [['Width (cm)', '0', '2', '4', '5', '6', '8', '10'], ['Length (cm)', '10', '8', '6', '5', '4', '2', '0'], ['Area (cm²)', '0', '16', '24', '25', '24', '16', '0']] })}`,
        `<p><strong>The area rises, then falls.</strong> Plotted, it is an upside-down U. The top is in the middle.</p>
         ${ans('width 5, area 25')}`
      )}
      <p><strong>Two numbers with a fixed sum?</strong> Their product is biggest when they are equal: 5 + 5 = 10 gives 5 × 5 = 25.</p>
      ${tip('The rectangle with the biggest area for a fixed perimeter is a square.')}`,

    // Y8 9J Q5: perimeter for a fixed area
    'y8-9j-perimeter': `
      <p class="hp-tag">Worked example: a rectangle has an area of <b>12 cm²</b>. Which width gives the smallest perimeter?</p>
      ${steps(
        `<p><strong>Length = area ÷ width.</strong></p>`,
        `<p><strong>Perimeter = 2 × (width + length).</strong></p>
         ${fig({ kind: 'table', rows: [['Width (cm)', '1', '2', '3', '4', '6', '12'], ['Length (cm)', '12', '6', '4', '3', '2', '1'], ['Perimeter (cm)', '26', '16', '14', '14', '16', '26']] })}`,
        `<p><strong>Read the smallest perimeter.</strong> It is 14 cm, for a width of 3 or 4 cm, the shapes closest to a square.</p>
         ${ans('14')}`
      )}
      <p><strong>Linear or not?</strong> The perimeters do not change by the same amount each time, so the graph is a curve: non-linear.</p>
      ${tip('Type each row from left to right, with commas.')}`,

    // Y8 9J Q6: smallest and largest y-values
    'y8-9j-minmax': `
      <p class="hp-tag">Worked example: find the smallest and largest values of y on <b>y = x² − 4</b> for x from −3 to 3.</p>
      ${steps(
        `<p><strong>x² is smallest when x = 0.</strong> Then y = 0 − 4 = −4.</p>`,
        `<p><strong>x² is largest at the ends, x = 3 or x = −3.</strong> Both give 9.</p>
         ${sum('y = 9 − 4 = 5')}
         ${ans('-4, 5')}`,
        `<p><strong>Minus x²?</strong> For y = 10 − x², it flips: the largest is at x = 0 (10), and the smallest at the ends (10 − 9 = 1).</p>`
      )}
      ${tip('Type the smallest value first, then the largest, like -4, 5.')}`,

    // Y8 9J Q8: linear or non-linear?
    'y8-9j-linear': `
      <p class="hp-tag">Worked example: which give straight lines? <b>y = 2x − 3</b>, <b>y = x² + 2</b>, <b>y = 5/x</b>, <b>y = x/3 − 2</b></p>
      ${steps(
        `<p><strong>Linear: x appears only on its own</strong>, multiplied or divided by a number. y = 2x − 3 and y = x/3 − 2 are linear (x/3 is just 1/3 × x).</p>`,
        `<p><strong>Non-linear: x is squared, multiplied by itself (like x(x + 1)), or on the bottom of a fraction.</strong> y = x² + 2 and y = 5/x are non-linear.</p>`,
        `<p><strong>Not sure? Try a few points.</strong> For y = 5/x: x = 1, 2, 5 gives y = 5, 2.5, 1. The steps are not equal, so it is a curve.</p>
         ${ans('Linear: y = 2x − 3, y = x/3 − 2')}`
      )}
      ${tip('x divided by a number (x/5) is linear. A number divided by x (5/x) is not.')}`,

    // Y8 9J Q10: families of parabolas
    'y8-9j-family': `
      <p class="hp-tag">Worked example: compare <b>y = x²</b> with <b>y = 3x²</b>, <b>y = −x²</b>, <b>y = x² + 5</b> and <b>y = (x + 2)²</b>.</p>
      ${pl([-5, 3], [-1, 9], [{ poly: curve(1, 0, 0, -3, 3), open: true }, { poly: curve(3, 0, 0, -1.5, 1.5), open: true }, { poly: curve(1, -2, 0, -5, 1), open: true },
        { label: 'y = x²', at: [3.1, 8.3], anchor: 'start' }, { label: 'y = 3x²', at: [1.9, 9.3], anchor: 'start' }, { label: 'y = (x + 2)²', at: [-5, 9.4], anchor: 'start' }])}
      ${steps(
        `<p><strong>A bigger number in front of x² makes y grow faster</strong>, so y = 3x² is narrower. A minus sign in front, as in y = −x², flips the U upside down.</p>`,
        `<p><strong>Adding a number moves the curve up.</strong> y = x² + 5 is 5 higher, so its lowest point is (0, 5).</p>`,
        `<p><strong>A number inside the bracket moves it sideways.</strong> (x + 2)² is 0 when x = −2, so the lowest point is (−2, 0).</p>
         ${ans('(0,5) and (-2,0)')}`
      )}
      ${tip('To find the lowest point, ask which x makes the squared part equal 0. Type points like (-2,0).')}`
  });
})();
