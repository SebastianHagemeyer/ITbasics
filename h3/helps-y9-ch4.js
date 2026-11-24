/* H3 help panels for Year 9 Chapter 4. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 4A to 4K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers for this chapter (same as the Year 8 linear chapter) ----
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
  // A number plane drawn as a diagram, so it can carry several lines, dashed lines and labels.
  const pl = (X, Y, items, alt = 'A number plane') => {
    const g = [], step = (X[1] - X[0] > 12 || Y[1] - Y[0] > 12) ? 2 : 1;
    for (let x = X[0]; x <= X[1]; x++) g.push({ seg: [x, Y[0], x, Y[1]], thin: true });
    for (let y = Y[0]; y <= Y[1]; y++) g.push({ seg: [X[0], y, X[1], y], thin: true });
    g.push({ seg: [X[0], 0, X[1] + 0.6, 0], arrow: 'end' }, { seg: [0, Y[0], 0, Y[1] + 0.6], arrow: 'end' },
      { label: 'x', at: [X[1] + 0.95, 0] }, { label: 'y', at: [0, Y[1] + 0.95] }, { label: 'O', at: [-0.25, -0.5], anchor: 'end' });
    for (let x = X[0]; x <= X[1]; x += step) if (x) g.push({ label: String(x), at: [x, -0.5] });
    for (let y = Y[0]; y <= Y[1]; y += step) if (y) g.push({ label: String(y), at: [-0.2, y - 0.05], anchor: 'end' });
    return fig({ kind: 'diagram', unit: 30, items: g.concat(items), alt });
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 4A Introduction to linear relationships
    // =====================================================================
    // Y9 4A Q1: table of values from a rule
    'y9-4a-table': `
      <p class="hp-tag">Worked example: complete the table for <b>y = 3x + 1</b>.</p>
      ${fig({ kind: 'table', rows: [['x', '−3', '−2', '−1', '0', '1', '2', '3'], ['y', '?', '?', '?', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Put each x into the rule.</strong> Put a negative x in brackets so the signs stay right.</p>
         ${sum(`x = −3: ${now('3 × (−3)')} + 1 = −9 + 1 = −8<br>x = −2: 3 × (−2) + 1 = −6 + 1 = −5`)}`,
        `<p><strong>Use the pattern to finish the row.</strong> Each step right adds 3 (the number in front of x).</p>
         ${ans('-8, -5, -2, 1, 4, 7, 10')}`,
        `<p><strong>Plot the points.</strong> They lie on a straight line, so the relationship is linear.</p>
         ${fig({ kind: 'plane', x: [-3, 3], y: [-8, 10], path: [[-3, -8], [3, 10]], points: { '': [-3, -8], ' ': [-2, -5], '  ': [-1, -2], '   ': [0, 1], '    ': [1, 4], '     ': [2, 7], '      ': [3, 10] } })}`
      )}
      ${tip('Type the seven y-values in order, left to right, with commas. If one value breaks the steady step, check it again.')}`,

    // Y9 4A Q2: intercepts from a table or a graph
    'y9-4a-intercepts': `
      <p class="hp-tag">Worked example: write down the x- and y-intercepts.</p>
      ${fig({ kind: 'table', rows: [['x', '−1', '0', '1', '2', '3', '4'], ['y', '−8', '−6', '−4', '−2', '0', '2']] })}
      ${steps(
        `<p><strong>The x-intercept is where y = 0.</strong> Find 0 in the y row: it sits under x = 3.</p>`,
        `<p><strong>The y-intercept is where x = 0.</strong> Find 0 in the x row: above it, y = −6.</p>
         ${ans('3, -6')}`,
        `<p><strong>From a graph:</strong> read where the line crosses each axis. This line crosses the x-axis at −2 and the y-axis at −3.</p>
         ${fig({ kind: 'plane', x: [-4, 2], y: [-5, 3], path: [[-4, 3], [1.333, -5]], points: { '(−2, 0)': [-2, 0], '(0, −3)': [0, -3] } })}
         ${ans('-2, -3')}`
      )}
      ${tip('Type the x-intercept first, then the y-intercept, as two numbers with a comma. Each intercept is a single number here, not a point.')}`,

    // Y9 4A Q3, Q4: is the point on the line?
    'y9-4a-onpoint': `
      <p class="hp-tag">Worked example: is the point <b>(3, −1)</b> on the line <b>y = 2x − 7</b>? On <b>y = −x + 1</b>?</p>
      ${steps(
        `<p><strong>Put the point's x into the rule.</strong> For y = 2x − 7:</p>
         ${sum('2 × 3 − 7 = 6 − 7 = −1')}
         <p>The rule gives −1 and the point's y is −1. It is on the line ✓.</p>`,
        `<p><strong>Do the same for y = −x + 1.</strong></p>
         ${sum('−3 + 1 = −2')}
         <p>The rule gives −2, but the point's y is −1. It is not on the line ✗.</p>`,
        `<p><strong>Fractions and negatives work the same way.</strong> On y = ⅓x − 2: ⅓ × 3 − 2 = 1 − 2 = −1 ✓. For a negative x like the point (−4, 3) on y = −x − 1, use brackets: −(−4) − 1 = 4 − 1 = 3 ✓.</p>`
      )}
      ${tip('Only a match in y means the point is on the line. Check every rule on its own: some are, some are not.')}`,

    // Y9 4A Q5, Q10: find the rule from a table
    'y9-4a-rule': `
      <p class="hp-tag">Worked example: find the rule for this table.</p>
      ${fig({ kind: 'table', rows: [['x', '−1', '0', '1', '2', '3'], ['y', '−7', '−2', '3', '8', '13']] })}
      ${steps(
        `<p><strong>How much does y change when x goes up 1?</strong> −7 to −2 is up 5. That is m, the number in front of x.</p>`,
        `<p><strong>What is y when x = 0?</strong> It is −2. That is c, the number on its own. Check x = 3: 5 × 3 − 2 = 13 ✓.</p>
         ${ans('y=5x-2')}`,
        `<p><strong>x goes up in 2s and has no 0?</strong></p>
         ${fig({ kind: 'table', rows: [['x', '2', '4', '6', '8'], ['y', '1', '4', '7', '10']] })}
         <p>y goes up 3 for every 2 across, so m = 3/2. Step back from x = 2 to x = 0 (one jump of 2): 1 − 3 = −2, so c = −2. Check x = 8: 3/2 × 8 − 2 = 12 − 2 = 10 ✓.</p>
         ${ans('y=3x/2-2')}`
      )}
      ${tip('m = change in y ÷ change in x. Type a fraction gradient as 3x/2 or 3/2x, so y=3x/2-2.')}`,

    // Y9 4A Q6: match rules to graphs
    'y9-4a-match': `
      <p class="hp-tag">Worked example: match <b>y = 3x − 2</b>, <b>y = −x + 3</b> and <b>x − y = −1</b> to the graphs A, B and C.</p>
      ${pl([-3, 3], [-4, 5], [ln(-1, 3, [-3, 3], [-4, 5]), ln(1, 1, [-3, 3], [-4, 5]), ln(3, -2, [-3, 3], [-4, 5]),
        { label: 'A', at: [-1.9, 4.7] }, { label: 'B', at: [3.3, 4] }, { label: 'C', at: [1.75, 4.7] }])}
      ${steps(
        `<p><strong>Get every rule into the form y = mx + c.</strong> x − y = −1 becomes y = x + 1.</p>`,
        `<p><strong>The sign of m says uphill or downhill.</strong> y = −x + 3 is the only one going down: that is A.</p>`,
        `<p><strong>c says where it crosses the y-axis.</strong> y = x + 1 crosses at 1 (above O): B. y = 3x − 2 crosses at −2 (below O) and is steeper: C.</p>
         ${ans('A: y = −x + 3, B: x − y = −1, C: y = 3x − 2')}`
      )}
      ${tip('Check one point if two graphs look alike: y = 3x − 2 goes through (1, 1), and so does line C.')}`,

    // Y9 4A Q7: are two rules equivalent?
    'y9-4a-equiv': `
      <p class="hp-tag">Worked example: is <b>y = 6 − 3x</b> the same line as <b>y = −3x + 6</b>? As <b>y = 3x − 6</b>?</p>
      ${steps(
        `<p><strong>Each sign belongs to the term after it.</strong> y = 6 − 3x has the terms +6 and −3x.</p>`,
        `<p><strong>Terms can swap places if they keep their signs.</strong> y = −3x + 6 has the same two terms.</p>
         ${ans('Equivalent')}`,
        `<p><strong>y = 3x − 6 has +3x and −6.</strong> Both signs have flipped, so it is a different line. Test x = 1: 6 − 3 = 3, but 3 − 6 = −3.</p>
         ${ans('Not equivalent')}`
      )}
      ${tip('Compare the coefficient of x and the constant, sign and all. Both must match for the rules to be equivalent.')}`,

    // Y9 4A Q8: x-intercept as a fraction, using the gradient
    'y9-4a-xint': `
      <p class="hp-tag">Worked example: a line passes through <b>(0, −7)</b>, <b>(1, −4)</b> and <b>(2, −1)</b>. Find its x-intercept.</p>
      ${fig({ kind: 'plane', x: [-1, 3], y: [-8, 3], path: [[-0.333, -8], [3, 2]], points: { '(0, −7)': [0, -7], '(1, −4)': [1, -4], '(2, −1)': [2, -1] } })}
      ${steps(
        `<p><strong>Find the gradient.</strong> Each step of 1 across, y goes up 3. So the line rises 3 for every 1 across.</p>`,
        `<p><strong>How far across to rise from −7 up to 0?</strong> It needs to rise 7. At 3 per unit, that takes</p>
         ${sum('7 ÷ 3 = 7/3 across')}`,
        `<p><strong>Start at x = 0 and move 7/3 across.</strong></p>
         ${ans('7/3')}`
      )}
      ${tip('Check: 7/3 is between 2 and 3, and the line does cross the x-axis between x = 2 and x = 3. Type the fraction with /, like 7/3.')}`,

    // Y9 4A Q9: is the equation true for every x?
    'y9-4a-identity': `
      <p class="hp-tag">Worked example: true or false for every x? <b>(6x + 9)/3 = 2x + 9</b> and <b>½(x − 4) = ½x − 2</b></p>
      ${steps(
        `<p><strong>Dividing: divide every term on top.</strong></p>
         ${sum('(6x + 9)/3 = 6x/3 + 9/3 = 2x + 3')}
         <p>That is 2x + 3, not 2x + 9.</p>
         ${ans('False')}`,
        `<p><strong>Multiplying a bracket: multiply every term inside.</strong></p>
         ${sum('½ × x − ½ × 4 = ½x − 2')}
         ${ans('True')}`,
        `<p><strong>Quick test with a number.</strong> x = 0 in the first one: (0 + 9)/3 = 3, but 2 × 0 + 9 = 9. Different, so it is false.</p>`
      )}
      ${tip('One number that fails proves "false". To prove "true", simplify one side until it matches the other.')}`,

    // =====================================================================
    // 4B Graphing straight lines using intercepts
    // =====================================================================
    // Y9 4B Q1, Q3, Q8: intercepts of ax + by = d
    'y9-4b-general': `
      <p class="hp-tag">Worked example: find the x- and y-intercepts of <b>5x + 2y = 20</b>, then sketch it.</p>
      ${steps(
        `<p><strong>x-intercept: put y = 0.</strong> The y term disappears.</p>
         ${sum('5x = 20 → x = 4')}`,
        `<p><strong>y-intercept: put x = 0.</strong> The x term disappears.</p>
         ${sum('2y = 20 → y = 10')}
         ${ans('4, 10')}`,
        `<p><strong>Plot (4, 0) and (0, 10) and join them.</strong></p>
         ${fig({ kind: 'plane', x: [-1, 5], y: [-1, 11], path: [[-0.4, 11], [4.4, -1]], points: { '(4, 0)': [4, 0], '(0, 10)': [0, 10] } })}`
      )}
      <p><strong>A constant on the left?</strong> For x − 2y + 6 = 0: y = 0 gives x + 6 = 0, so x = −6. x = 0 gives −2y + 6 = 0, so y = 3. <strong>Nothing on the right?</strong> 3x + 5y = 0 is true at x = 0, y = 0: the line goes through the origin, so you need a second point to sketch it.</p>
      ${tip('Type the x-intercept first, then the y-intercept: 4, 10. Keep the sign with its term when you solve.')}`,

    // Y9 4B Q2: intercepts of y = mx + c
    'y9-4b-rule': `
      <p class="hp-tag">Worked example: find the intercepts of <b>y = −4x + 8</b>.</p>
      ${fig({ kind: 'plane', x: [-1, 3], y: [-1, 9], path: [[-0.25, 9], [2.25, -1]], points: { '(2, 0)': [2, 0], '(0, 8)': [0, 8] } })}
      ${steps(
        `<p><strong>y-intercept: put x = 0.</strong> It is always c, the number on its own.</p>
         ${sum('y = −4 × 0 + 8 = 8')}`,
        `<p><strong>x-intercept: put y = 0 and solve.</strong></p>
         ${sum('0 = −4x + 8 → 4x = 8 → x = 2')}`,
        `<p><strong>Write them in order.</strong></p>
         ${ans('2, 8')}`
      )}
      ${tip('Check the x-intercept by putting it back in: −4 × 2 + 8 = 0 ✓.')}`,

    // Y9 4B Q4, Q5: intercepts in a story
    'y9-4b-context': `
      <p class="hp-tag">Worked example: a phone's battery is at <b>B = 80 − 5t</b> per cent after t hours. (a) What is it at the start? (b) When is it flat?</p>
      ${fig({ kind: 'linegraph', xs: ['0', '4', '8', '12', '16'], ys: [80, 60, 40, 20, 0], ymin: 0, ymax: 80, step: 20, xlabel: 'Time (hours)', ylabel: 'Battery (%)' })}
      ${steps(
        `<p><strong>"At the start" means t = 0.</strong> That is the vertical intercept.</p>
         ${sum('B = 80 − 5 × 0 = 80')}
         ${ans('80')}`,
        `<p><strong>"Flat" means B = 0.</strong> That is the horizontal intercept.</p>
         ${sum('0 = 80 − 5t → 5t = 80 → t = 16')}
         ${ans('16')}`
      )}
      ${tip('"Reaches the ground", "empty" and "back at the dock" all mean the amount is 0. Type just the number; the unit is shown after the box.')}`,

    // Y9 4B Q6: intercepts that are fractions
    'y9-4b-fraction': `
      <p class="hp-tag">Worked example: find the intercepts of <b>3x − 4y = 5</b> and of <b>4y = 3 − 2x</b>.</p>
      ${steps(
        `<p><strong>3x − 4y = 5.</strong> y = 0 gives 3x = 5. x = 0 gives −4y = 5.</p>
         ${sum('x = 5/3 &nbsp; y = 5/(−4) = −5/4')}
         ${ans('5/3, -5/4')}`,
        `<p><strong>4y = 3 − 2x.</strong> y = 0 gives 0 = 3 − 2x, so 2x = 3. x = 0 gives 4y = 3.</p>
         ${sum('x = 3/2 &nbsp; y = 3/4')}
         ${ans('3/2, 3/4')}`
      )}
      ${tip('Leave answers as fractions in simplest form, with the minus sign in front: -5/4, not 5/-4.')}`,

    // Y9 4B Q7: equations with fractions
    'y9-4b-fracform': `
      <p class="hp-tag">Worked example: find the intercepts of <b>x/2 + y/5 = 1</b> and of <b>y = (8 − x)/4</b>.</p>
      ${steps(
        `<p><strong>x/2 + y/5 = 1.</strong> y = 0 leaves x/2 = 1, so x = 2. x = 0 leaves y/5 = 1, so y = 5.</p>
         ${ans('2, 5')}`,
        `<p><strong>y = (8 − x)/4.</strong> y = 0 means the top is 0: 8 − x = 0, so x = 8. x = 0 gives y = 8/4 = 2.</p>
         ${ans('8, 2')}`,
        `<p><strong>Fractions on both sides?</strong> Multiply both sides by a number that clears every bottom first, then find the intercepts as usual.</p>`
      )}
      ${tip('A fraction equals 0 only when its top is 0. That makes the x-intercept quick to find.')}`,

    // Y9 4B Q9: rule from the two intercepts
    'y9-4b-fromint': `
      <p class="hp-tag">Worked example: write the rule, in the form ax + by = d, for the line with intercepts <b>(0, 4)</b> and <b>(4, 0)</b>.</p>
      ${fig({ kind: 'plane', x: [-1, 5], y: [-1, 5], path: [[-1, 5], [5, -1]], points: { '(0, 4)': [0, 4], '(4, 0)': [4, 0] } })}
      ${steps(
        `<p><strong>Gradient: from (0, 4) to (4, 0) is a fall of 4 for a run of 4.</strong></p>
         ${sum('m = −4/4 = −1, and c = 4, so y = −x + 4')}`,
        `<p><strong>Move the x term across.</strong> Add x to both sides.</p>
         ${ans('x+y=4')}`,
        `<p><strong>Another one:</strong> (0, −4) and (4, 0) rise 4 for a run of 4, so m = 1 and y = x − 4. Taking y across gives x − y = 4.</p>`
      )}
      ${tip('Check by putting both intercepts in: 0 + 4 = 4 ✓ and 4 + 0 = 4 ✓. Letters like p work the same way as numbers.')}`,

    // Y9 4B Q10: intercepts with letters
    'y9-4b-letters': `
      <p class="hp-tag">Worked example: find the intercepts of <b>px + 2qy = r</b> and of <b>y = p(x − q)</b>.</p>
      ${steps(
        `<p><strong>Treat the letters like numbers.</strong> For px + 2qy = r, y = 0 gives px = r. Divide by p.</p>
         ${sum('x = r/p')}`,
        `<p><strong>x = 0 gives 2qy = r.</strong> Divide by everything in front of y.</p>
         ${sum('y = r/(2q)')}
         ${ans('r/p, r/(2q)')}`,
        `<p><strong>y = p(x − q).</strong> y = 0 when the bracket is 0, so x = q. x = 0 gives y = p(−q) = −pq.</p>
         ${ans('q, -pq')}`
      )}
      ${tip('Put a bottom with two letters in brackets: r/(2q). Without them, r/2q could be read as r/2 × q.')}`,

    // =====================================================================
    // 4C Lines with one intercept
    // =====================================================================
    // Y9 4C Q1: where a horizontal or vertical line crosses an axis
    'y9-4c-hv': `
      <p class="hp-tag">Worked example: where do <b>x = −3.5</b> and <b>y = 4.5</b> cross an axis?</p>
      ${pl([-5, 2], [-1, 6], [{ seg: [-3.5, -1, -3.5, 6] }, { seg: [-5, 4.5, 2, 4.5] }, { point: [-3.5, 0], name: '(−3.5, 0)', pos: 'nw' }, { point: [0, 4.5], name: '(0, 4.5)', pos: 'se' }])}
      ${steps(
        `<p><strong>x = a number is a vertical line.</strong> Every point on it has x = −3.5, so it crosses the x-axis (where y = 0) at (−3.5, 0).</p>
         ${ans('(-3.5,0)')}`,
        `<p><strong>y = a number is a horizontal line.</strong> It crosses the y-axis (where x = 0) at (0, 4.5).</p>
         ${ans('(0,4.5)')}`
      )}
      ${tip('A vertical line never meets the y-axis (unless it is x = 0), and a horizontal line never meets the x-axis. Type the point in brackets, like (0,4.5).')}`,

    // Y9 4C Q2: second point on a line through the origin
    'y9-4c-origin': `
      <p class="hp-tag">Worked example: <b>y = 9x</b> and <b>y = −3/5 x</b> pass through the origin. Find the point on each where x = 1.</p>
      ${steps(
        `<p><strong>Put x = 1 into the rule.</strong></p>
         ${sum('y = 9 × 1 = 9')}
         ${ans('(1,9)')}`,
        `<p><strong>A fraction gradient works the same way.</strong></p>
         ${sum('y = −3/5 × 1 = −3/5')}
         ${ans('(1,-3/5)')}`,
        `<p><strong>Join the origin to the second point</strong> to sketch the line. y = −3/5 x also passes through (5, −3), which is easier to plot.</p>
         ${fig({ kind: 'plane', x: [-1, 7], y: [-4, 1], path: [[-1, 0.6], [6.667, -4]], points: { '(5, −3)': [5, -3] } })}`
      )}
      ${tip('At x = 1 the y-value is just the gradient. Type fractions with /, like (1,-3/5).')}`,

    // Y9 4C Q3: vertical, horizontal or through the origin?
    'y9-4c-classify': `
      <p class="hp-tag">Worked example: describe the graphs of <b>x = 6</b>, <b>y = −7</b>, <b>y = 9x</b> and <b>y = −0.2x</b>.</p>
      ${steps(
        `<p><strong>Only x, equal to a number:</strong> every point has the same x, so the line is vertical. x = 6 is a vertical line.</p>`,
        `<p><strong>Only y, equal to a number:</strong> the same height everywhere, so the line is horizontal. y = −7 is a horizontal line.</p>`,
        `<p><strong>y = a number × x, with nothing added:</strong> x = 0 gives y = 0, so it is a sloping line through the origin. That is true for y = 9x and y = −0.2x.</p>
         ${ans('Vertical, horizontal, through the origin, through the origin')}`
      )}
      ${tip('Decimals and fractions make no difference: x = 1.5 is still vertical, and y = −0.2x still passes through O.')}`,

    // Y9 4C Q4, Q5, Q6: equation of a horizontal or vertical line
    'y9-4c-equation': `
      <p class="hp-tag">Worked example: find the equation of the line that is (a) parallel to the x-axis through <b>(−3, 4)</b>, (b) parallel to the y-axis through <b>(1.5, −2)</b>.</p>
      ${pl([-4, 3], [-3, 5], [{ seg: [-4, 4, 3, 4] }, { seg: [1.5, -3, 1.5, 5] }, { point: [-3, 4], name: '(−3, 4)', pos: 'nw' }, { point: [1.5, -2], name: '(1.5, −2)', pos: 'e' }])}
      ${steps(
        `<p><strong>Parallel to the x-axis means horizontal.</strong> Every point has the same y as the given point.</p>
         ${ans('y=4')}`,
        `<p><strong>Parallel to the y-axis means vertical.</strong> Every point has the same x.</p>
         ${ans('x=1.5')}`,
        `<p><strong>In a story, the axis is the starting level.</strong> If sea level is the x-axis, a gull gliding 25 m above it flies along y = 25, and a submarine cruising 40 m below it travels along y = −40.</p>`
      )}
      ${tip('Read a graph the same way: a horizontal line through −1.5 on the y-axis is y = −1.5. Type equations like y=4 or x=1.5.')}`,

    // Y9 4C Q7: where two lines meet
    'y9-4c-meet': `
      <p class="hp-tag">Worked example: find where each pair meets: <b>x = −7 and y = 8</b>; <b>y = −3x and x = 1.5</b>; <b>y = 7x and y = 63</b>.</p>
      ${steps(
        `<p><strong>A vertical and a horizontal line</strong> meet at the point with that x and that y.</p>
         ${ans('(-7,8)')}`,
        `<p><strong>One rule gives x: put it into the other.</strong> x = 1.5 in y = −3x:</p>
         ${sum('y = −3 × 1.5 = −4.5')}
         ${pl([-2, 3], [-6, 4], [ln(-3, 0, [-2, 3], [-6, 4]), { seg: [1.5, -6, 1.5, 4] }, { point: [1.5, -4.5], name: '(1.5, −4.5)', pos: 'e' }, { label: 'y = −3x', at: [-1.4, 2], anchor: 'end' }, { label: 'x = 1.5', at: [1.7, 2.5], anchor: 'start' }])}
         ${ans('(1.5,-4.5)')}`,
        `<p><strong>One rule gives y: solve for x.</strong></p>
         ${sum('7x = 63 → x = 9')}
         ${ans('(9,63)')}`
      )}
      ${tip('Check the point in both equations. Type it with x first: (9,63).')}`,

    // Y9 4C Q8, Q9: rectangles made by four lines
    'y9-4c-area': `
      <p class="hp-tag">Worked example: find the area of the rectangle made by <b>x = −1, x = 4, y = 1, y = 5</b>.</p>
      ${steps(
        `<p><strong>Width: from x = −1 to x = 4. Height: from y = 1 to y = 5.</strong></p>
         ${sum('4 − (−1) = 5 &nbsp; 5 − 1 = 4')}`,
        `<p><strong>Area = width × height.</strong></p>
         ${sum('5 × 4 = 20')}
         ${ans('20')}`,
        `<p><strong>Working backwards.</strong> x = −1, x = 4 and y = 1 are three sides, and the area is 20. The height is 20 ÷ 5 = 4, so the fourth side is 4 above or 4 below y = 1.</p>
         ${pl([-2, 5], [-4, 6], [{ seg: [-1, 1, 4, 1] }, { seg: [-1, -4, -1, 6] }, { seg: [4, -4, 4, 6] }, { seg: [-1, 5, 4, 5], dash: true }, { seg: [-1, -3, 4, -3], dash: true }, { label: 'y = 5', at: [4.2, 5], anchor: 'start' }, { label: 'y = −3', at: [4.2, -3], anchor: 'start' }, { label: 'y = 1', at: [4.2, 1], anchor: 'start' }])}
         ${ans('y=5, y=-3')}`
      )}
      <p><strong>Perimeter instead?</strong> Perimeter 26 means 2 × (5 + height) = 26, so 5 + height = 13 and the height is 8: y = 9 or y = −7.</p>
      ${tip('Take the smaller value from the larger for each side, even with negatives. There are two answers: type both with a comma.')}`,

    // Y9 4C Q15: area of a triangle made by three lines
    'y9-4c-triangle': `
      <p class="hp-tag">Worked example: the lines <b>x = 3</b>, <b>y = −3</b> and <b>y = mx</b> make a triangle of area <b>18</b>. Find m, given m &gt; 0.</p>
      ${steps(
        `<p><strong>Try a value of m and find the corners.</strong> Try m = 2: y = 2x meets x = 3 at (3, 6) and meets y = −3 at (−1.5, −3). The right angle is at (3, −3).</p>
         ${sum('legs: 6 − (−3) = 9 and 3 − (−1.5) = 4.5<br>area = ½ × 9 × 4.5 = 20.25, too big')}`,
        `<p><strong>Try a smaller m.</strong> m = 1: the corners are (3, 3), (−3, −3) and (3, −3).</p>
         ${sum('legs: 6 and 6 &nbsp; area = ½ × 6 × 6 = 18 ✓')}
         ${pl([-4, 4], [-4, 4], [{ poly: [[3, 3], [-3, -3], [3, -3]], fill: true }, ln(1, 0, [-4, 4], [-4, 4]), { seg: [3, -4, 3, 4] }, { seg: [-4, -3, 4, -3] }, { label: 'y = x', at: [-3.4, -2.2], anchor: 'end' }])}`,
        `<p><strong>Answer.</strong></p>
         ${ans('1')}`
      )}
      ${tip('A sketch shows which corner has the right angle. Its two legs run along the vertical and horizontal lines.')}`,

    // Y9 4C Q10, Q11, Q13, Q14: y = mx through a given point
    'y9-4c-mx': `
      <p class="hp-tag">Worked example: find the equation of the line through the origin and <b>(5, −2)</b>.</p>
      ${fig({ kind: 'plane', x: [-1, 6], y: [-3, 1], path: [[-1, 0.4], [6, -2.4]], points: { O: [0, 0], '(5, −2)': [5, -2] } })}
      ${steps(
        `<p><strong>From O, the rise is the y-value and the run is the x-value.</strong></p>
         ${sum('m = rise ÷ run = −2/5')}`,
        `<p><strong>Through the origin, c = 0, so y = mx.</strong></p>
         ${ans('y=-2x/5')}`,
        `<p><strong>Three lines meeting.</strong> x = 5 and y = −2 meet at (5, −2), so the line through O that meets them there is this same line. With letters, through (2a, 6a): m = 6a ÷ 2a = 3, so y = 3x.</p>`
      )}
      ${tip('Type a fraction gradient as -2x/5 or -2/5x. Check: −2/5 × 5 = −2 ✓.')}`,

    // Y9 4C Q12: make y or x the subject
    'y9-4c-subject': `
      <p class="hp-tag">Worked example: make y or x the subject, then describe the line: <b>y − 7 = 0</b> and <b>5y + 2x = 0</b>.</p>
      ${steps(
        `<p><strong>y − 7 = 0.</strong> Add 7 to both sides: y = 7. That is a horizontal line crossing the y-axis at (0, 7).</p>
         ${ans('(0,7)')}`,
        `<p><strong>5y + 2x = 0.</strong> Take 2x from both sides, then divide by 5.</p>
         ${sum('5y = −2x → y = −2x/5')}`,
        `<p><strong>No number on its own, so it passes through O.</strong> Put x = 1 to get a second point.</p>
         ${sum('y = −2/5 × 1 = −2/5')}
         ${ans('(1,-2/5)')}`
      )}
      ${tip('Decimals and fractions are fine in a point: x + 0.6 = 0 gives x = −0.6, typed (-0.6,0).')}`,

    // =====================================================================
    // 4D Gradient
    // =====================================================================
    // Y9 4D Q1, Q3: gradient from a graph
    'y9-4d-graph': `
      <p class="hp-tag">Worked example: find the gradient of the line through <b>(−1, −3)</b> and <b>(1, 2)</b>.</p>
      ${pl([-2, 3], [-4, 3], [ln(2.5, -0.5, [-2, 3], [-4, 3]), { seg: [-1, -3, 1, -3], dash: true }, { seg: [1, -3, 1, 2], dash: true },
        { label: 'run 2', at: [0.3, -3.55] }, { label: 'rise 5', at: [1.15, -1.6], anchor: 'start' }, { point: [-1, -3], name: '(−1, −3)', pos: 'nw' }, { point: [1, 2], name: '(1, 2)', pos: 'e' }])}
      ${steps(
        `<p><strong>Pick two points on grid corners</strong> and go from left to right.</p>`,
        `<p><strong>Run = across, rise = up.</strong> The run is 2 and the rise is 5.</p>`,
        `<p><strong>Gradient = rise ÷ run.</strong></p>
         ${ans('5/2')}`
      )}
      <p><strong>Going down?</strong> From (−2, 3) to (1, −1), the run is 3 and the line falls 4, so the gradient is −4/3. A horizontal line has gradient 0. A vertical line's gradient is undefined, because its run is 0.</p>
      ${tip('Go left to right so the run is positive; the sign comes from the rise. Type fractions with /, like -4/3, in simplest form.')}`,

    // Y9 4D Q2, Q9: gradient between two points
    'y9-4d-points': `
      <p class="hp-tag">Worked example: find the gradient of the line joining <b>(−4, 3)</b> and <b>(2, −1)</b>.</p>
      ${steps(
        `<p><strong>Use m = (y₂ − y₁)/(x₂ − x₁).</strong> Call (−4, 3) the first point and (2, −1) the second.</p>
         ${sum('rise: y₂ − y₁ = −1 − 3 = −4<br>run: x₂ − x₁ = 2 − (−4) = 6')}`,
        `<p><strong>Divide and simplify.</strong></p>
         ${sum('m = −4/6 = −2/3')}
         ${ans('-2/3')}`,
        `<p><strong>The order does not matter, as long as it is the same on top and bottom.</strong> Starting from the other point: (3 − (−1))/(−4 − 2) = 4/(−6) = −2/3 ✓.</p>`
      )}
      ${tip('Subtracting a negative adds: 2 − (−4) = 6. Simplify the fraction before you type it.')}`,

    // Y9 4D Q4, Q6: gradient of a real slope
    'y9-4d-slope': `
      <p class="hp-tag">Worked example: a road falls <b>24 m</b> for every <b>400 m</b> horizontally. Find its gradient.</p>
      ${steps(
        `<p><strong>Gradient = rise ÷ run.</strong> Falling means the rise is negative.</p>
         ${sum('−24/400')}`,
        `<p><strong>Simplify.</strong> Divide top and bottom by 8.</p>
         ${sum('−24/400 = −3/50')}
         ${ans('-3/50')}`,
        `<p><strong>Working backwards.</strong> A path has gradient 0.05. How far across to rise 8 m? Rise = gradient × run, so</p>
         ${sum('run = 8 ÷ 0.05 = 160')}
         ${ans('160')}`
      )}
      ${tip('Climbs and rises are positive; falls and descents are negative. Check the units match before you divide.')}`,

    // Y9 4D Q8: which line is steeper?
    'y9-4d-steeper': `
      <p class="hp-tag">Worked example: which is steeper, a line with gradient <b>2/3</b> or one with gradient <b>5/7</b>?</p>
      ${steps(
        `<p><strong>Steeper means a bigger gradient</strong> (for positive gradients).</p>`,
        `<p><strong>Turn both into decimals, or give them a common bottom.</strong></p>
         ${sum('2/3 = 0.666... &nbsp; 5/7 = 0.714...<br>or: 2/3 = 14/21 &nbsp; 5/7 = 15/21')}`,
        `<p><strong>The bigger one wins.</strong></p>
         ${ans('The line with gradient 5/7')}`
      )}
      ${tip('A bigger top does not always mean bigger: compare the whole fractions, not just one part.')}`,

    // Y9 4D Q5: missing coordinate from the gradient
    'y9-4d-missing': `
      <p class="hp-tag">Worked example: the gradient of the line joining <b>(1, 2)</b> and <b>(3, ?)</b> is <b>4</b>. Find the missing number.</p>
      ${steps(
        `<p><strong>Find the run.</strong> From x = 1 to x = 3 is a run of 2.</p>`,
        `<p><strong>Rise = gradient × run.</strong></p>
         ${sum('rise = 4 × 2 = 8, so y = 2 + 8 = 10')}
         ${ans('10')}`,
        `<p><strong>Missing x instead?</strong> (?, 5) and (4, −1) with gradient −2. The rise from the first point to the second is −1 − 5 = −6, so the run is −6 ÷ (−2) = 3. The first x is 4 − 3 = 1.</p>
         ${sum('check: (−1 − 5)/(4 − 1) = −6/3 = −2 ✓')}`
      )}
      ${tip('Always check by working out the gradient with your answer filled in.')}`,

    // Y9 4D Q7: missing intercept from the gradient
    'y9-4d-intercept': `
      <p class="hp-tag">Worked example: a line has gradient <b>5</b> and x-intercept <b>1</b>. Find its y-intercept. Then: gradient <b>2/3</b>, y-intercept <b>−4</b>. Find the x-intercept.</p>
      ${steps(
        `<p><strong>Start at the intercept you know.</strong> The first line goes through (1, 0). Moving to x = 0 is a run of −1 (one step left).</p>
         ${sum('change in y = 5 × (−1) = −5')}
         ${ans('-5')}`,
        `<p><strong>Second line: start at (0, −4).</strong> To reach y = 0 it must rise 4. Rise 2 for every 3 across means</p>
         ${sum('run = 4 ÷ 2/3 = 4 × 3/2 = 6')}
         ${ans('6')}`,
        `<p><strong>Sketch to check.</strong></p>
         ${fig({ kind: 'plane', x: [-1, 7], y: [-5, 1], path: [[-1, -4.667], [7, 0.667]], points: { '(0, −4)': [0, -4], '(6, 0)': [6, 0] } })}`
      )}
      ${tip('A positive gradient with a negative y-intercept gives a positive x-intercept. Fractions or decimals are fine.')}`,

    // Y9 4D Q10: stepping along with a fraction gradient
    'y9-4d-steps': `
      <p class="hp-tag">Worked example: a line has gradient <b>2/5</b> (it rises 2 for every 5 across) and y-intercept <b>(0, −2)</b>. Find y at x = 10, and the x-intercept.</p>
      ${fig({ kind: 'plane', x: [-1, 11], y: [-3, 3], path: [[-1, -2.4], [11, 2.4]], points: { '(0, −2)': [0, -2], '(5, 0)': [5, 0], '(10, 2)': [10, 2] } })}
      ${steps(
        `<p><strong>x = 10 is two jumps of 5 across,</strong> so the line rises 2 twice.</p>
         ${sum('y = −2 + 2 + 2 = 2')}
         ${ans('2')}`,
        `<p><strong>x-intercept: rise from −2 to 0.</strong> One rise of 2 needs one run of 5.</p>
         ${ans('(5,0)')}`,
        `<p><strong>A different gradient, same start.</strong> With gradient 4/3, rising 2 takes a run of 2 ÷ 4/3 = 2 × 3/4 = 3/2, so the x-intercept is (3/2, 0).</p>`
      )}
      ${tip('A falling line (negative gradient) goes down as you step right. Type points like (5,0) or (3/2,0).')}`,

    // =====================================================================
    // 4E Gradient and direct proportion
    // =====================================================================
    // Y9 4E Q1, Q2, Q3, Q11, Q12: rate, gradient and rule
    'y9-4e-rule': `
      <p class="hp-tag">Worked example: a printer prints <b>280 pages</b> in <b>8 minutes</b> at a steady rate.</p>
      ${steps(
        `<p><strong>Rate = amount ÷ time.</strong> This is also the gradient of the graph of pages against time.</p>
         ${sum('280 ÷ 8 = 35 pages per minute')}`,
        `<p><strong>Direct proportion: amount = rate × time.</strong> The graph is a straight line through the origin.</p>
         ${ans('P=35t')}`,
        `<p><strong>Use the rule both ways.</strong></p>
         ${sum('after 6 minutes: 35 × 6 = 210 pages<br>70 pages: 35t = 70 → t = 2 minutes')}`
      )}
      <p><strong>Not about time?</strong> A rectangle 4 cm wide with length L has area A = 4L: the area grows 4 cm² for each cm of length. For a trip that lasts exactly 5 hours, speed = distance ÷ 5, so s = d/5.</p>
      ${tip('Use the letters the question gives, like P=35t or C=1.6n. Type just the number in the other answers; the unit is shown after the box.')}`,

    // Y9 4E Q4: speed from a distance-time graph
    'y9-4e-graph': `
      <p class="hp-tag">Worked example: find the speed shown by this graph.</p>
      ${fig({ kind: 'linegraph', xs: ['0', '2', '4', '6', '8'], ys: [0, 5, 10, 15, 20], ymin: 0, ymax: 20, step: 5, xlabel: 'Time (minutes)', ylabel: 'Distance (cm)' })}
      ${steps(
        `<p><strong>Pick a point where the line crosses grid lines clearly.</strong> At 8 minutes the distance is 20 cm.</p>`,
        `<p><strong>Speed = gradient = rise ÷ run.</strong> The line starts at the origin, so</p>
         ${sum('20 ÷ 8 = 2.5')}`,
        `<p><strong>The units come from the axes:</strong> cm per minute.</p>
         ${ans('2.5')}`
      )}
      ${tip('Read the scale on each axis carefully: one grid square may stand for 5 or 10 units, not 1.')}`,

    // Y9 4E Q5: a rate given per 100
    'y9-4e-economy': `
      <p class="hp-tag">Worked example: a car uses <b>6.5 L per 100 km</b>. How much fuel for <b>180 km</b>? How far on <b>52 L</b>?</p>
      ${steps(
        `<p><strong>Count the hundreds.</strong> 180 km is 1.8 lots of 100 km.</p>
         ${sum('6.5 × 1.8 = 11.7 L')}
         ${ans('11.7')}`,
        `<p><strong>Backwards: how many lots of 6.5 L fit in 52 L?</strong></p>
         ${sum('52 ÷ 6.5 = 8 lots, and 8 × 100 = 800 km')}
         ${ans('800')}`
      )}
      ${tip('Write the rate as a fraction, 6.5/100 litres per km, if you prefer: multiply by the distance to get litres.')}`,

    // Y9 4E Q6, Q7: compare speeds in different units
    'y9-4e-compare': `
      <p class="hp-tag">Worked example: who is fastest? Ana runs <b>200 m in 40 s</b>. Ben cycles <b>1.6 km in 5 minutes</b>. Cal skates <b>15 km in 1 hour</b>.</p>
      ${steps(
        `<p><strong>Change everything to the same units</strong>, say metres and seconds.</p>
         ${sum('Ben: 1600 m in 300 s &nbsp; Cal: 15 000 m in 3600 s')}`,
        `<p><strong>Speed = distance ÷ time for each.</strong></p>
         ${sum('Ana: 200 ÷ 40 = 5 m/s<br>Ben: 1600 ÷ 300 = 5.33 m/s<br>Cal: 15 000 ÷ 3600 = 4.17 m/s')}`,
        `<p><strong>Biggest speed is fastest; smallest is slowest.</strong></p>
         ${ans('Ben')}`
      )}
      ${tip('1 km = 1000 m, 1 minute = 60 s and 1 hour = 3600 s. Compare speeds only once they share units.')}`,

    // Y9 4E Q8: when two amounts are equal
    'y9-4e-meet': `
      <p class="hp-tag">Worked example: fund A starts at $0 and grows by <b>$110 per month</b>. Fund B starts at <b>$5400</b> and falls by <b>$1080 per year</b>. When are they equal?</p>
      ${steps(
        `<p><strong>Use the same time unit for both.</strong> $1080 per year is 1080 ÷ 12 = $90 per month.</p>
         ${sum('A = 110t &nbsp; B = 5400 − 90t (t in months)')}`,
        `<p><strong>Equal amounts: make the rules equal.</strong></p>
         ${sum('110t = 5400 − 90t → 200t = 5400 → t = 27')}
         ${ans('27')}`,
        `<p><strong>Check.</strong> A: 110 × 27 = 2970. B: 5400 − 90 × 27 = 2970 ✓.</p>`
      )}
      ${tip('On a graph, the answer is where the two lines cross. Give the answer in the unit the question asks for.')}`,

    // Y9 4E Q9, Q10: direct proportion and exact answers with pi
    'y9-4e-proportion': `
      <p class="hp-tag">Worked example: the curved edge of a semicircle has length <b>L = πr</b>.</p>
      ${steps(
        `<p><strong>Exact values keep π as a letter.</strong></p>
         ${sum('r = 0: L = 0 &nbsp; r = 7: L = 7π')}
         ${ans('7pi')}`,
        `<p><strong>Direct proportion: a straight line through the origin.</strong> L = πr has that shape, and its gradient is the number in front of r.</p>
         ${ans('pi')}`,
        `<p><strong>Not proportional?</strong> The area of a square, A = s², gives 1, 4, 9, 16, ... for s = 1, 2, 3, 4. The jumps grow, so the graph is a curve, not a straight line. A is not directly proportional to s.</p>`
      )}
      ${tip('Type π as pi, like 7pi. Direct proportion needs both: a straight line, and it must pass through (0, 0).')}`,

    // Y9 4E Q13: two hoses working together
    'y9-4e-work': `
      <p class="hp-tag">Worked example: hose A fills a bucket in <b>2 minutes</b> and hose B fills it in <b>3 minutes</b>. How long do both together take?</p>
      ${steps(
        `<p><strong>Think rate: how much of the bucket each fills in 1 minute.</strong></p>
         ${sum('A: 1/2 of a bucket &nbsp; B: 1/3 of a bucket')}`,
        `<p><strong>Together, add the rates.</strong></p>
         ${sum('1/2 + 1/3 = 3/6 + 2/6 = 5/6 of a bucket per minute')}`,
        `<p><strong>Time for 1 whole bucket = 1 ÷ rate.</strong></p>
         ${sum('1 ÷ 5/6 = 6/5 = 1.2 minutes')}
         ${ans('1.2')}`
      )}
      ${tip('Together must be faster than the quicker hose alone: 1.2 is less than 2 ✓. Decimals or fractions are fine.')}`,

    // Y9 4E Q14: swimming with and against a current
    'y9-4e-river': `
      <p class="hp-tag">Worked example: a river flows at <b>2 km/h</b>. Jo swims at <b>6 km/h</b> in still water, downstream a distance d, then back. The trip takes <b>1.5 hours</b>. Find d.</p>
      ${steps(
        `<p><strong>The current helps one way and fights the other.</strong></p>
         ${sum('downstream: 6 + 2 = 8 km/h &nbsp; upstream: 6 − 2 = 4 km/h')}`,
        `<p><strong>Time = distance ÷ speed. Add the two times.</strong></p>
         ${sum('d/8 + d/4 = 1.5 → d/8 + 2d/8 = 1.5 → 3d/8 = 1.5')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('3d = 12 → d = 4')}
         ${ans('4')}`
      )}
      ${tip('Change minutes into hours first (90 minutes = 1.5 hours), because the speeds are in km per hour. Check: 4/8 + 4/4 = 1.5 ✓.')}`,

    // =====================================================================
    // 4F Gradient-intercept form
    // =====================================================================
    // Y9 4F Q1, Q3, Q9: reading m and c
    'y9-4f-mc': `
      <p class="hp-tag">Worked example: state the gradient and the y-intercept of <b>y = 3x − 4</b>, <b>y = 2/7 x + 1</b> and <b>y = −0.6x</b>.</p>
      ${chips(['y = mx + c'], ['m: the number in front of x', 'add'], ['c: the number on its own', 'take'])}
      ${steps(
        `<p><strong>y = 3x − 4.</strong> The sign belongs to the number after it, so c = −4.</p>
         ${ans('3 and (0,-4)')}`,
        `<p><strong>y = 2/7 x + 1.</strong> The whole fraction in front of x is m. <strong>y = −0.6x</strong> has nothing added, so c = 0; as a fraction, −0.6 = −3/5.</p>
         ${ans('2/7 and (0,1); -3/5 and (0,0)')}`,
        `<p><strong>To sketch y = 3x − 4:</strong> plot (0, −4), then go 1 right and 3 up.</p>
         ${fig({ kind: 'plane', x: [-1, 3], y: [-5, 3], path: [[-0.333, -5], [2.333, 3]], points: { '(0, −4)': [0, -4], '(1, −1)': [1, -1] } })}`
      )}
      <p><strong>Gradient 0?</strong> y = 0x + 7 is just y = 7, a horizontal line through (0, 7).</p>
      ${tip('Type the y-intercept as a point, like (0,-4). A gradient can be typed as a fraction, like -3/5.')}`,

    // Y9 4F Q2, Q4, Q6, Q10: rearranging into y = mx + c (and back)
    'y9-4f-rearrange': `
      <p class="hp-tag">Worked example: write <b>3x + 4y = 8</b> in the form y = mx + c, then state the gradient and the y-intercept.</p>
      ${steps(
        `<p><strong>Get the y term on its own.</strong> Take 3x from both sides.</p>
         ${sum('4y = −3x + 8')}`,
        `<p><strong>Divide every term by 4.</strong></p>
         ${sum('y = −3x/4 + 8/4 = −3/4 x + 2')}
         ${ans('-3/4 and (0,2)')}`,
        `<p><strong>The other way: y = 2x − 5 into ax + by = d.</strong> Take y from both sides and add 5: 5 = 2x − y, so 2x − y = 5.</p>
         ${ans('2x-y')}`
      )}
      <p><strong>"= 0" at the end?</strong> 5x − 2y + 4 = 0 gives 2y = 5x + 4, so y = 5/2 x + 2. <strong>Letters?</strong> 2x + ky = 6 gives ky = −2x + 6, so y = −2x/k + 6/k.</p>
      ${tip('Divide every term, not just the first. When a box asks for only one side of the equation, type only that side, like 2x-y.')}`,

    // Y9 4F Q5: match equations to graphs
    'y9-4f-match': `
      <p class="hp-tag">Worked example: match <b>y = 3</b>, <b>x = 1</b>, <b>y = −2x + 2</b> and <b>y = −2x − 2</b> to the lines A to D.</p>
      ${pl([-3, 3], [-4, 4], [{ seg: [-3, 3, 3, 3] }, { seg: [1, -4, 1, 4] }, ln(-2, 2, [-3, 3], [-4, 4]), ln(-2, -2, [-3, 3], [-4, 4]),
        { label: 'A', at: [2.6, 3.35] }, { label: 'B', at: [1.25, -3.6], anchor: 'start' }, { label: 'C', at: [-1.1, 3.6], anchor: 'end' }, { label: 'D', at: [-2.7, 1.5] }])}
      ${steps(
        `<p><strong>Horizontal and vertical lines first.</strong> y = 3 is horizontal: A. x = 1 is vertical: B.</p>`,
        `<p><strong>Same gradient? Then the lines are parallel, and c tells them apart.</strong> Both remaining lines have m = −2.</p>`,
        `<p><strong>y = −2x + 2 crosses the y-axis at 2: C.</strong> y = −2x − 2 crosses at −2: D.</p>
         ${ans('A, B, C, D')}`
      )}
      ${tip('Check the sign of m (uphill or downhill) and the sign of c (above or below O) before you choose.')}`,

    // Y9 4F Q7, Q8: rules written in other forms
    'y9-4f-forms': `
      <p class="hp-tag">Worked example: which have gradient 2 and y-intercept (0, 5)? <b>A: y = 2(x + 5)</b>, <b>B: y = (4x + 10)/2</b>, <b>C: 3y = 6x + 5</b>, <b>D: y = 2(x + 2.5)</b></p>
      ${steps(
        `<p><strong>Rewrite each one as y = mx + c.</strong> Expand brackets; divide every term.</p>
         ${sum('A: y = 2x + 10<br>B: y = 2x + 5<br>C: y = 2x + 5/3<br>D: y = 2x + 5')}`,
        `<p><strong>Now read m and c.</strong> All four have m = 2, but only B and D have c = 5.</p>
         ${ans('B, D')}`,
        `<p><strong>The trap:</strong> in A, the 5 inside the bracket is not c. Expanding shows c = 2 × 5 = 10.</p>`
      )}
      ${tip('Always expand a bracket before reading off c. Type letters with commas, like B, D.')}`,

    // Y9 4F Q11: rule from two points, stepping to x = 0
    'y9-4f-twopoints': `
      <p class="hp-tag">Worked example: find the rule of the line through <b>(−3, 5)</b> and <b>(3, 1)</b>.</p>
      ${fig({ kind: 'plane', x: [-4, 4], y: [-1, 6], path: [[-4.5, 6], [4, 0.333]], points: { '(−3, 5)': [-3, 5], '(3, 1)': [3, 1], '(0, 3)': [0, 3] } })}
      ${steps(
        `<p><strong>Gradient.</strong> From (−3, 5) to (3, 1): run 6, rise −4.</p>
         ${sum('m = −4/6 = −2/3')}`,
        `<p><strong>Step from (−3, 5) to x = 0.</strong> That is a run of 3, so the rise is 3 × (−2/3) = −2. The y-intercept is (0, 5 − 2) = (0, 3).</p>`,
        `<p><strong>Write the rule and check the other point.</strong> −2/3 × 3 + 3 = 1 ✓.</p>
         ${ans('y=-2/3x+3')}`
      )}
      ${tip('Type a fraction gradient like -2/3x or -2x/3, and a fraction constant with /, like +3/4.')}`,

    // =====================================================================
    // 4G Finding the equation of a line
    // =====================================================================
    // Y9 4G Q1, Q3: equation from a graph
    'y9-4g-graph': `
      <p class="hp-tag">Worked example: find the equation of the line through <b>(0, −1)</b> and <b>(3, 4)</b>.</p>
      ${pl([-2, 4], [-3, 5], [ln(5 / 3, -1, [-2, 4], [-3, 5]), { seg: [0, -1, 3, -1], dash: true }, { seg: [3, -1, 3, 4], dash: true },
        { label: 'run 3', at: [1.9, -1.55] }, { label: 'rise 5', at: [3.2, 1.5], anchor: 'start' }, { point: [0, -1] }, { label: '(0, −1)', at: [-0.35, -1.75], anchor: 'end' }, { point: [3, 4], name: '(3, 4)', pos: 'w' }])}
      ${steps(
        `<p><strong>c is where the line crosses the y-axis.</strong> Here c = −1.</p>`,
        `<p><strong>m = rise ÷ run</strong> between the two marked points: rise 5, run 3, so m = 5/3.</p>`,
        `<p><strong>Put them into y = mx + c.</strong></p>
         ${ans('y=5/3x-1')}`
      )}
      <p><strong>Marked intercepts?</strong> A line through (2, 0) and (0, −6) rises 6 in a run of 2, so m = 3 and the equation is y = 3x − 6.</p>
      ${tip('A line sloping down has a negative m. Type a fraction gradient like 5/3x or 5x/3.')}`,

    // Y9 4G Q2, Q9, Q10: gradient and one point
    'y9-4g-point': `
      <p class="hp-tag">Worked example: find the equation of the line with gradient <b>6</b> through <b>(−1, 2)</b>.</p>
      ${steps(
        `<p><strong>Start with y = 6x + c.</strong> Put in the point: x = −1 and y = 2.</p>
         ${sum('2 = 6 × (−1) + c → 2 = −6 + c → c = 8')}`,
        `<p><strong>Write the equation.</strong></p>
         ${ans('y=6x+8')}`,
        `<p><strong>Any point on the line gives the same c.</strong> (1, 14) is also on it: 14 = 6 + c, so c = 8 again.</p>`
      )}
      <p><strong>Missing m instead?</strong> y = mx + 4 passes through (3, −2): −2 = 3m + 4, so 3m = −6 and m = −2.</p>
      ${tip('Substitute, then solve for the one unknown letter. Type the equation starting with y =, like y=6x+8.')}`,

    // Y9 4G Q4, Q11, Q12: equation through two points
    'y9-4g-twopoints': `
      <p class="hp-tag">Worked example: find the equation of the line through <b>(−3, −1)</b> and <b>(1, 7)</b>.</p>
      ${steps(
        `<p><strong>Gradient first.</strong></p>
         ${sum('m = (7 − (−1))/(1 − (−3)) = 8/4 = 2')}`,
        `<p><strong>Put one point into y = 2x + c.</strong> Use (1, 7).</p>
         ${sum('7 = 2 × 1 + c → c = 5')}
         ${ans('y=2x+5')}`,
        `<p><strong>Or use y − y₁ = m(x − x₁)</strong> with (−3, −1):</p>
         ${sum('y + 1 = 2(x + 3) → y = 2x + 6 − 1 = 2x + 5')}`
      )}
      <p><strong>Letters?</strong> Through the origin and (3k, k): m = k ÷ 3k = 1/3, so y = x/3.</p>
      ${tip('Check with the point you did not use: 2 × (−3) + 5 = −1 ✓. Type fractions like -3/2x+4.')}`,

    // Y9 4G Q5, Q6: intercepts of a line you have to find first
    'y9-4g-intercepts': `
      <p class="hp-tag">Worked example: a line passes through <b>(−1, −3)</b> and <b>(3, 3)</b>. Find its intercepts.</p>
      ${steps(
        `<p><strong>Find the equation.</strong></p>
         ${sum('m = (3 − (−3))/(3 − (−1)) = 6/4 = 3/2<br>3 = 3/2 × 3 + c → c = 3 − 9/2 = −3/2')}`,
        `<p><strong>y-intercept: c.</strong> x-intercept: put y = 0.</p>
         ${sum('0 = 3/2 x − 3/2 → 3/2 x = 3/2 → x = 1')}
         ${ans('(1,0) and (0,-3/2)')}`,
        `<p><strong>Given m and c already?</strong> Gradient −3 and y-intercept (0, 4): 0 = −3x + 4, so x = 4/3 and the x-intercept is (4/3, 0).</p>`
      )}
      ${tip('Type points like (1,0). Fractions or decimals are fine: (0,-3/2) or (0,-1.5).')}`,

    // Y9 4G Q7, Q8: equations from a story
    'y9-4g-context': `
      <p class="hp-tag">Worked example: a candle burns at a steady rate. After <b>3 hours</b> it is <b>24 cm</b> tall, and after <b>7 hours</b> it is <b>12 cm</b>. Find a rule for its height h after t hours.</p>
      ${steps(
        `<p><strong>The facts are two points: (3, 24) and (7, 12).</strong></p>
         ${sum('m = (12 − 24)/(7 − 3) = −12/4 = −3')}`,
        `<p><strong>Find c with one point.</strong></p>
         ${sum('24 = −3 × 3 + c → c = 33')}
         ${ans('h=-3t+33')}`,
        `<p><strong>c is the start.</strong> At t = 0 the candle was 33 cm tall. The gradient −3 means it loses 3 cm each hour.</p>`
      )}
      <p><strong>A path from a starting height.</strong> A ball starts 2 m above the origin and rises 7 m for every 3 m across: y = 7/3 x + 2.</p>
      ${tip('Start the rule with the letter asked for, like h=-3t+33.')}`,

    // =====================================================================
    // 4H Midpoint and length of a line segment
    // =====================================================================
    // Y9 4H Q1, Q7: midpoint
    'y9-4h-midpoint': `
      <p class="hp-tag">Worked example: find the midpoint M of the segment joining <b>(−3, 5)</b> and <b>(4, −2)</b>.</p>
      ${fig({ kind: 'plane', x: [-4, 5], y: [-3, 6], path: [[-3, 5], [4, -2]], points: { '(−3, 5)': [-3, 5], '(4, −2)': [4, -2], M: [0.5, 1.5] } })}
      ${steps(
        `<p><strong>Average the x-values.</strong></p>
         ${sum('(−3 + 4)/2 = 1/2 = 0.5')}`,
        `<p><strong>Average the y-values.</strong></p>
         ${sum('(5 + (−2))/2 = 3/2 = 1.5')}`,
        `<p><strong>Put them together.</strong></p>
         ${ans('(0.5,1.5)')}`
      )}
      <p><strong>The rule:</strong> M = ((x₁ + x₂)/2, (y₁ + y₂)/2). With letters, keep the brackets: (p + r)/2.</p>
      ${tip('Type decimals like (0.5,1.5). A formula with letters needs brackets on top: (p+r)/2.')}`,

    // Y9 4H Q3, Q4: other end from the midpoint
    'y9-4h-endpoint': `
      <p class="hp-tag">Worked example: a circle has centre <b>(2, −1)</b>. One end of a diameter is <b>(5, 3)</b>. Find the other end.</p>
      ${pl([-2, 6], [-6, 4], [{ seg: [5, 3, -1, -5] }, { point: [5, 3], name: '(5, 3)', pos: 'e' }, { point: [2, -1], name: 'centre (2, −1)', pos: 'se' }, { point: [-1, -5], name: '?', pos: 'w' }])}
      ${steps(
        `<p><strong>The centre is the midpoint of the diameter.</strong> Find the trip from the known end to the centre.</p>
         ${sum('x: 5 → 2 is −3 &nbsp; y: 3 → −1 is −4')}`,
        `<p><strong>Make the same trip again from the centre.</strong></p>
         ${sum('x: 2 − 3 = −1 &nbsp; y: −1 − 4 = −5')}
         ${ans('(-1,-5)')}`,
        `<p><strong>Check: the midpoint of (5, 3) and (−1, −5)</strong> is ((5 − 1)/2, (3 − 5)/2) = (2, −1) ✓.</p>`
      )}
      ${tip('A shortcut: other end = 2 × midpoint − known end, done for x and y separately.')}`,

    // Y9 4H Q2, Q5, Q8: length of a segment
    'y9-4h-length': `
      <p class="hp-tag">Worked example: find the length of the segment from <b>(−2, −1)</b> to <b>(3, 2)</b>, to 2 decimal places.</p>
      ${pl([-3, 4], [-3, 3], [{ seg: [-2, -1, 3, 2] }, { seg: [-2, -1, 3, -1], dash: true }, { seg: [3, -1, 3, 2], dash: true },
        { label: '5', at: [1.5, -1.6] }, { label: '3', at: [3.25, 0.5], anchor: 'start' }, { point: [-2, -1], name: '(−2, −1)', pos: 'sw' }, { point: [3, 2], name: '(3, 2)', pos: 'nw' }])}
      ${steps(
        `<p><strong>Make a right-angled triangle.</strong></p>
         ${sum('across: 3 − (−2) = 5 &nbsp; up: 2 − (−1) = 3')}`,
        `<p><strong>Pythagoras: length² = across² + up².</strong></p>
         ${sum('5² + 3² = 25 + 9 = 34 → √34 = 5.830... ≈ 5.83')}
         ${ans('5.83')}`,
        `<p><strong>Exact answer?</strong> From (1, −3) to (5, 5): 4² + 8² = 16 + 64 = 80. Take out the square factor:</p>
         ${sum('√80 = √16 × √5 = 4√5')}
         ${ans('4sqrt5')}`
      )}
      <p><strong>The rule:</strong> d = √((x₂ − x₁)² + (y₂ − y₁)²). For a <strong>perimeter</strong>, find every side this way and add them, rounding only at the end.</p>
      ${tip('Type a surd as 4sqrt5 or 4√5, in simplest form. If nothing comes out, like √34, type sqrt34. A rule with letters needs brackets: sqrt((x-1)^2+(y-2)^2).')}`,

    // Y9 4H Q6: whole-number points at a set distance
    'y9-4h-lattice': `
      <p class="hp-tag">Worked example: how many points with whole-number coordinates are exactly <b>5 units</b> from <b>(1, 1)</b>?</p>
      ${steps(
        `<p><strong>across² + up² must be 5² = 25.</strong> Find whole numbers that work.</p>
         ${sum('25 = 5² + 0² &nbsp; and &nbsp; 25 = 3² + 4²')}`,
        `<p><strong>Use every direction.</strong> 5 and 0: straight right, left, up or down gives 4 points. 3 and 4: across 3 and up 4 in any of 4 diagonal directions, then across 4 and up 3 the same way, gives 8 points.</p>
         ${sum('4 + 8 = 12')}
         ${ans('12')}`,
        `<p><strong>Name one.</strong> 3 right and 4 up from (1, 1) is (4, 5). Check: 3² + 4² = 25 ✓.</p>`
      )}
      ${tip('Each pair of different numbers gives 8 points (signs and order can swap). A pair with a 0 gives only 4.')}`,

    // Y9 4H Q9: dividing a segment in a ratio
    'y9-4h-ratio': `
      <p class="hp-tag">Worked example: find the point P that divides the segment from <b>A(−2, 5)</b> to <b>B(6, −3)</b> in the ratio <b>1 : 3</b>.</p>
      ${fig({ kind: 'plane', x: [-3, 7], y: [-4, 6], path: [[-2, 5], [6, -3]], points: { A: [-2, 5], B: [6, -3], P: [0, 3] } })}
      ${steps(
        `<p><strong>1 : 3 has 4 parts, so P is 1/4 of the way from A to B.</strong></p>`,
        `<p><strong>Find the whole trip, then 1/4 of it.</strong></p>
         ${sum('across: 6 − (−2) = 8, and 1/4 × 8 = 2<br>down: −3 − 5 = −8, and 1/4 × (−8) = −2')}`,
        `<p><strong>Add these to A.</strong></p>
         ${sum('(−2 + 2, 5 − 2) = (0, 3)')}
         ${ans('(0,3)')}`
      )}
      ${tip('Ratio 3 : 1 is 3/4 of the way: (−2 + 6, 5 − 6) = (4, −1). The fraction is first part ÷ total parts.')}`,

    // =====================================================================
    // 4I Parallel and perpendicular lines
    // =====================================================================
    // Y9 4I Q1: parallel line through a point on the y-axis
    'y9-4i-parallel': `
      <p class="hp-tag">Worked example: find the line parallel to <b>y = 2x − 3</b> that passes through <b>(0, 1)</b>.</p>
      ${pl([-2, 3], [-4, 5], [ln(2, -3, [-2, 3], [-4, 5]), ln(2, 1, [-2, 3], [-4, 5], { dash: true }), { point: [0, 1], name: '(0, 1)', pos: 'se' }, { label: 'y = 2x − 3', at: [3.1, 2.6], anchor: 'start' }])}
      ${steps(
        `<p><strong>Parallel lines have the same gradient.</strong> m = 2.</p>`,
        `<p><strong>(0, 1) is on the y-axis, so c = 1.</strong></p>
         ${ans('y=2x+1')}`,
        `<p><strong>Fractions are no different.</strong> Parallel to y = −3/5 x + 2 through (0, −1/2): y = −3/5 x − 1/2.</p>`
      )}
      ${tip('Type fraction gradients like -3/5x, and a fraction constant with /, like -1/2.')}`,

    // Y9 4I Q2: perpendicular line through a point on the y-axis
    'y9-4i-perp': `
      <p class="hp-tag">Worked example: find the line perpendicular to <b>y = 3x + 2</b> that passes through <b>(0, −1)</b>.</p>
      ${pl([-3, 3], [-3, 4], [ln(3, 2, [-3, 3], [-3, 4]), ln(-1 / 3, -1, [-3, 3], [-3, 4], { dash: true }), { point: [0, -1], name: '(0, −1)', pos: 'se' }, { label: 'y = 3x + 2', at: [0.8, 3.7], anchor: 'start' }])}
      ${steps(
        `<p><strong>Perpendicular gradients multiply to −1.</strong> Flip the gradient and change its sign.</p>
         ${sum('3 = 3/1 → flip: 1/3 → change sign: −1/3<br>check: 3 × (−1/3) = −1 ✓')}`,
        `<p><strong>(0, −1) gives c = −1.</strong></p>
         ${ans('y=-1/3x-1')}`,
        `<p><strong>A fraction to start with?</strong> Perpendicular to gradient −2/5 is 5/2.</p>`
      )}
      ${tip('Perpendicular to a positive gradient is always negative, and the other way round. Type it like -1/3x-1.')}`,

    // Y9 4I Q3: horizontal and vertical lines
    'y9-4i-hv': `
      <p class="hp-tag">Worked example: find the line (a) parallel to <b>y = −6</b> through <b>(2, 5)</b>, (b) perpendicular to <b>y = 4</b> through <b>(−2, 6)</b>.</p>
      ${steps(
        `<p><strong>y = −6 is horizontal.</strong> A parallel line is horizontal too, at the point's height.</p>
         ${ans('y=5')}`,
        `<p><strong>y = 4 is horizontal, so a perpendicular line is vertical,</strong> through the point's x-value.</p>
         ${ans('x=-2')}`,
        `<p><strong>Starting from a vertical line</strong> like x = 1: parallel lines are vertical (x = a number) and perpendicular lines are horizontal (y = a number).</p>`
      )}
      ${chips(['parallel to horizontal: y = ...'], ['perpendicular to horizontal: x = ...'], ['parallel to vertical: x = ...'], ['perpendicular to vertical: y = ...'])}
      ${tip('Type the equation like y=5 or x=-2.')}`,

    // Y9 4I Q4: parallel or perpendicular through any point
    'y9-4i-point': `
      <p class="hp-tag">Worked example: find the line (a) parallel to <b>y = −3x + 4</b> through <b>(2, 1)</b>, (b) perpendicular to <b>y = 2/3 x − 1</b> through <b>(2, 4)</b>.</p>
      ${steps(
        `<p><strong>(a) Same gradient, m = −3.</strong> Substitute the point to find c.</p>
         ${sum('1 = −3 × 2 + c → 1 = −6 + c → c = 7')}
         ${ans('y=-3x+7')}`,
        `<p><strong>(b) Flip and change sign: m = −3/2.</strong></p>
         ${sum('4 = −3/2 × 2 + c → 4 = −3 + c → c = 7')}
         ${ans('y=-3/2x+7')}`,
        `<p><strong>Check each answer with its point.</strong> −3 × 2 + 7 = 1 ✓ and −3/2 × 2 + 7 = 4 ✓.</p>`
      )}
      ${tip('Find m first, then substitute the point for c. Type the equation like y=-3/2x+7.')}`,

    // Y9 4I Q5, Q6: equations of the sides of a shape
    'y9-4i-sides': `
      <p class="hp-tag">Worked example: a triangle has vertices <b>(−1, 1)</b>, <b>(3, 1)</b> and <b>(1, 5)</b>. Find the equation of each side.</p>
      ${pl([-2, 4], [-1, 6], [{ poly: [[-1, 1], [3, 1], [1, 5]] }, { point: [-1, 1], name: '(−1, 1)', pos: 'sw' }, { point: [3, 1], name: '(3, 1)', pos: 'se' }, { point: [1, 5], name: '(1, 5)', pos: 'ne' }])}
      ${steps(
        `<p><strong>Left side, (−1, 1) to (1, 5).</strong> m = 4/2 = 2, then 1 = 2 × (−1) + c gives c = 3.</p>
         ${ans('y=2x+3')}`,
        `<p><strong>Right side, (1, 5) to (3, 1).</strong> m = −4/2 = −2, then 1 = −2 × 3 + c gives c = 7.</p>
         ${ans('y=-2x+7')}`,
        `<p><strong>Bottom side:</strong> both points have y = 1, so it is horizontal.</p>
         ${ans('y=1')}`
      )}
      <p><strong>A parallelogram.</strong> Sides lie on y = 0, y = 2 and y = 2x, and the bottom side is 5 long. The fourth side is parallel to y = 2x and starts at (5, 0): 0 = 2 × 5 + c, so it is y = 2x − 10.</p>
      ${tip('Opposite sides of a parallelogram are parallel, so they share a gradient.')}`,

    // Y9 4I Q7, Q8: parallel and perpendicular gradients
    'y9-4i-gradients': `
      <p class="hp-tag">Worked example: find the perpendicular gradient to <b>m₁ = 2/7</b> and to <b>m₁ = −4</b>. Then find the parallel and perpendicular gradients for <b>2x − 4y = 3</b>.</p>
      ${steps(
        `<p><strong>Use m₂ = −1/m₁: flip the fraction and change the sign.</strong></p>
         ${sum('2/7 → −7/2 &nbsp; check: 2/7 × (−7/2) = −1 ✓<br>−4 = −4/1 → 1/4')}
         ${ans('-7/2 and 1/4')}`,
        `<p><strong>Not in y = mx + c form? Rearrange first.</strong></p>
         ${sum('2x − 4y = 3 → 4y = 2x − 3 → y = 1/2 x − 3/4')}`,
        `<p><strong>Parallel: same m. Perpendicular: flip and change sign.</strong></p>
         ${ans('1/2 and -2')}`
      )}
      ${tip('Check by multiplying: perpendicular gradients always multiply to −1. Type fractions like -7/2.')}`,

    // Y9 4I Q9: perpendicular bisector
    'y9-4i-bisector': `
      <p class="hp-tag">Worked example: find the perpendicular bisector of the segment from <b>A(−1, 3)</b> to <b>B(5, −1)</b>.</p>
      ${pl([-2, 6], [-2, 5], [{ seg: [-1, 3, 5, -1] }, ln(1.5, -2, [-2, 6], [-2, 5], { dash: true }), { point: [-1, 3], name: 'A', pos: 'nw' }, { point: [5, -1], name: 'B', pos: 'se' }, { point: [2, 1], name: 'M(2, 1)', pos: 'w' }])}
      ${steps(
        `<p><strong>Midpoint of AB.</strong></p>
         ${sum('((−1 + 5)/2, (3 + (−1))/2) = (2, 1)')}`,
        `<p><strong>Gradient of AB, then the perpendicular gradient.</strong></p>
         ${sum('m = (−1 − 3)/(5 − (−1)) = −4/6 = −2/3 → perpendicular: 3/2')}`,
        `<p><strong>Line with m = 3/2 through (2, 1).</strong></p>
         ${sum('1 = 3/2 × 2 + c → 1 = 3 + c → c = −2')}
         ${ans('y=3/2x-2')}`
      )}
      ${tip('Check: the bisector must pass through the midpoint, 3/2 × 2 − 2 = 1 ✓.')}`,

    // =====================================================================
    // 4J Linear modelling
    // =====================================================================
    // Y9 4J Q1, Q2, Q3, Q4: a fixed fee plus a rate
    'y9-4j-fee': `
      <p class="hp-tag">Worked example: a plumber charges an <b>$80</b> call-out fee plus <b>$55 per hour</b>.</p>
      ${steps(
        `<p><strong>Rule: rate × amount + fixed fee.</strong> For n hours:</p>
         ${ans('C=55n+80')}`,
        `<p><strong>Use it forwards and backwards.</strong></p>
         ${sum('3 hours: 55 × 3 + 80 = 165 + 80 = 245<br>a bill of $410: 55n + 80 = 410 → 55n = 330 → n = 6')}`,
        `<p><strong>The graph is a straight line.</strong> It meets the C axis at (0, 80), the fixed fee. Its gradient is 55, the cost per hour. For 0 ≤ n ≤ 8 it ends at</p>
         ${sum('n = 8: 55 × 8 + 80 = 520, so (8, 520)')}`
      )}
      ${tip('Start the rule with the letter asked for, like C=55n+80. Type points as (n, C), like (8,520). Type money without the $ sign.')}`,

    // Y9 4J Q5, Q6, Q7: filling and emptying a tank
    'y9-4j-tank': `
      <p class="hp-tag">Worked example: a tank holds <b>960 L</b> and water is used at <b>16 L per minute</b>.</p>
      ${steps(
        `<p><strong>Start − rate × time.</strong> The gradient −16 is the amount used each minute.</p>
         ${ans('V=-16t+960')}`,
        `<p><strong>Match the time units to the rate.</strong> 0.75 hours is 45 minutes.</p>
         ${sum('after 45 min: 960 − 16 × 45 = 960 − 720 = 240 L<br>empty: 960 ÷ 16 = 60 min, so the line meets the t axis at (60, 0)<br>until 400 L are left: it uses 560 L, and 560 ÷ 16 = 35 min')}`,
        `<p><strong>Filling instead?</strong> A pump adds 2 L every 10 seconds. That is 6 lots per minute, so 12 L per minute. Starting with 5 L: F = 12t + 5.</p>`
      )}
      ${tip('For "how long until ...", work out how much has to change, then divide by the rate. Half empty means half the full amount has gone.')}`,

    // Y9 4J Q8, Q9: what the numbers in a rule mean
    'y9-4j-meaning': `
      <p class="hp-tag">Worked example: a lift's height is <b>h = 96 − 4t</b> metres after t seconds.</p>
      ${steps(
        `<p><strong>The number on its own is the start.</strong> At t = 0, h = 96 m.</p>`,
        `<p><strong>The number with t is the rate.</strong> It is −4, so the height <b>decreases</b> by 4 m each second. Said the other way, it <b>increases</b> at −4 m per second.</p>`,
        `<p><strong>Ground level is h = 0.</strong></p>
         ${sum('96 − 4t = 0 → 4t = 96 → t = 24')}
         ${ans('96, 4, -4, 24')}`
      )}
      <p><strong>Change one number.</strong> h = 96 + 4t would mean rising 4 m per second. A car with d = 25 + 60t that actually travels at 70 km/h has the new rule d = 70t + 25.</p>
      ${tip('Only the number with t changes when the speed changes. The starting value stays the same.')}`,

    // Y9 4J Q10, Q11: cost, profit and break even
    'y9-4j-profit': `
      <p class="hp-tag">Worked example: a cake stall costs <b>$45</b> to set up, and each cupcake costs <b>$0.50</b> to make and sells for <b>$2</b>.</p>
      ${steps(
        `<p><strong>Cost and profit rules for n cupcakes.</strong> Profit = money in − cost.</p>
         ${sum('C = 0.5n + 45<br>P = 2n − (0.5n + 45) = 1.5n − 45')}`,
        `<p><strong>Break even means P = 0.</strong></p>
         ${sum('1.5n − 45 = 0 → 1.5n = 45 → n = 30')}
         ${ans('30')}`,
        `<p><strong>Other targets.</strong></p>
         ${sum('profit $36: 1.5n − 45 = 36 → 1.5n = 81 → n = 54<br>profit per cupcake $1: (1.5n − 45)/n = 1 → 1.5n − 45 = n → 0.5n = 45 → n = 90')}`
      )}
      ${tip('Work in dollars: 50 cents is 0.5. A rule with a fraction needs brackets, like T=(1.5n-45)/n.')}`,

    // =====================================================================
    // 4K Graphical solutions to simultaneous equations
    // =====================================================================
    // Y9 4K Q1: is the point where the lines meet?
    'y9-4k-check': `
      <p class="hp-tag">Worked example: is <b>(2, 3)</b> the intersection of <b>y = 4x − 5</b> and <b>x + y = 5</b>? Is <b>(1, −1)</b>?</p>
      ${steps(
        `<p><strong>The point must be on both lines.</strong> Test (2, 3) in each.</p>
         ${sum('4 × 2 − 5 = 3 ✓ &nbsp; 2 + 3 = 5 ✓')}
         ${ans('Yes')}`,
        `<p><strong>Test (1, −1).</strong></p>
         ${sum('4 × 1 − 5 = −1 ✓ &nbsp; 1 + (−1) = 0, not 5 ✗')}
         <p>It is on the first line only.</p>
         ${ans('No')}`
      )}
      ${tip('Passing one test is not enough: the intersection point satisfies both equations.')}`,

    // Y9 4K Q2: solve by graphing
    'y9-4k-graph': `
      <p class="hp-tag">Worked example: solve <b>y = 2x − 3</b> and <b>x + y = 6</b> graphically.</p>
      ${steps(
        `<p><strong>Make a table for each line.</strong> x + y = 6 is y = 6 − x.</p>
         ${fig({ kind: 'table', rows: [['x', '0', '1', '2', '3', '4'], ['y = 2x − 3', '−3', '−1', '1', '3', '5'], ['y = 6 − x', '6', '5', '4', '3', '2']] })}`,
        `<p><strong>Draw both lines and read where they cross.</strong></p>
         ${pl([-1, 6], [-4, 7], [ln(2, -3, [-1, 6], [-4, 7]), ln(-1, 6, [-1, 6], [-4, 7]), { point: [3, 3], name: '(3, 3)', pos: 'e' }, { label: 'y = 2x − 3', at: [4.7, 6.6], anchor: 'end' }, { label: 'x + y = 6', at: [0.5, 6.4], anchor: 'start' }])}
         ${ans('(3,3)')}`,
        `<p><strong>Check in both.</strong> 2 × 3 − 3 = 3 ✓ and 3 + 3 = 6 ✓.</p>`
      )}
      <p><strong>A horizontal or vertical line?</strong> y = −1 and y = 3x + 5 cross where 3x + 5 = −1, so 3x = −6 and x = −2: the point (−2, −1).</p>
      ${tip('Type the crossing point in brackets, like (3,3).')}`,

    // Y9 4K Q3, Q4: break-even point
    'y9-4k-breakeven': `
      <p class="hp-tag">Worked example: costs are <b>C = 4n + 1500</b> and revenue is <b>R = 9n</b>. Where do the graphs cross?</p>
      ${fig({ kind: 'table', rows: [['n', '0', '150', '300', '450'], ['C', '1500', '2100', '2700', '3300'], ['R', '0', '1350', '2700', '4050']] })}
      ${steps(
        `<p><strong>The lines cross where C = R.</strong></p>
         ${sum('9n = 4n + 1500 → 5n = 1500 → n = 300')}`,
        `<p><strong>Find the dollar value at that n.</strong></p>
         ${sum('R = 9 × 300 = 2700')}
         ${ans('(300,2700)')}`,
        `<p><strong>What it means.</strong> Below 300 the costs are higher (a loss). Above 300 the revenue is higher (a profit).</p>`
      )}
      ${tip('Type the point as (n, dollars), like (300,2700). If only n is asked for, type just the number.')}`,

    // Y9 4K Q5: two things heading towards each other
    'y9-4k-closing': `
      <p class="hp-tag">Worked example: two trains are <b>360 km</b> apart and heading towards each other at <b>70 km/h</b> and <b>50 km/h</b>. When do they meet?</p>
      ${steps(
        `<p><strong>Write a rule for each train's distance from the first train's start.</strong></p>
         ${sum('first: d = 70t &nbsp; second: d = 360 − 50t')}`,
        `<p><strong>They meet when the distances are equal</strong> (where the graphs cross).</p>
         ${sum('70t = 360 − 50t → 120t = 360 → t = 3')}
         ${ans('3')}`,
        `<p><strong>Quick way:</strong> the gap closes by 70 + 50 = 120 km every hour, and 360 ÷ 120 = 3 hours.</p>`
      )}
      ${tip('Check: 70 × 3 = 210 and 50 × 3 = 150, and 210 + 150 = 360 ✓.')}`,

    // Y9 4K Q6, Q7: parallel lines and families of lines
    'y9-4k-families': `
      <p class="hp-tag">Worked example: do <b>y = 3x + 1</b> and <b>y = 3x − 4</b> meet? Where do <b>y = 4x + 2</b>, <b>y = −3x + 2</b> and <b>y = 6x + 2</b> all meet?</p>
      ${pl([-3, 3], [-5, 5], [ln(3, 1, [-3, 3], [-5, 5]), ln(3, -4, [-3, 3], [-5, 5]), { point: [0, 1], name: '(0, 1)', pos: 'se' }, { point: [0, -4], name: '(0, −4)', pos: 'se' }])}
      ${steps(
        `<p><strong>Same gradient, different c: the lines are parallel.</strong> They never meet, so there is no solution.</p>
         ${ans('none')}`,
        `<p><strong>Different gradients, same c.</strong> Every line crosses the y-axis at 2, so they all pass through (0, 2).</p>
         ${ans('(0,2)')}`,
        `<p><strong>Same c of 0?</strong> Lines like y = 5x and y = −4x all meet at the origin.</p>`
      )}
      ${tip('If the lines never meet, type none.')}`,

    // Y9 4K Q8: find c or m from where the lines cross
    'y9-4k-unknown': `
      <p class="hp-tag">Worked example: <b>y = 2x + 1</b> and <b>y = 5x + c</b> cross where x = 3. Find c.</p>
      ${steps(
        `<p><strong>Use the line you know fully to find the crossing point.</strong></p>
         ${sum('y = 2 × 3 + 1 = 7, so the point is (3, 7)')}`,
        `<p><strong>That point is on the other line too.</strong></p>
         ${sum('7 = 5 × 3 + c → 7 = 15 + c → c = −8')}
         ${ans('-8')}`,
        `<p><strong>Missing m instead?</strong> y = mx + 4 and y = −2x + 1 cross where x = −3. The second line gives y = 6 + 1 = 7, so 7 = −3m + 4, −3m = 3 and m = −1.</p>`
      )}
      ${tip('Watch the signs when x is negative: −2 × (−3) = +6.')}`,

    // Y9 4K Q9, Q10: area of a triangle made by three lines
    'y9-4k-area': `
      <p class="hp-tag">Worked example: find the area enclosed by <b>y = 0</b>, <b>y = x + 1</b> and <b>y = −x + 5</b>.</p>
      ${pl([-2, 6], [-1, 5], [{ poly: [[-1, 0], [5, 0], [2, 3]], fill: true }, ln(1, 1, [-2, 6], [-1, 5]), ln(-1, 5, [-2, 6], [-1, 5]),
        { point: [-1, 0], name: 'A', pos: 'nw' }, { point: [5, 0], name: 'B', pos: 'ne' }, { point: [2, 3], name: 'C(2, 3)', pos: 'e' }])}
      ${steps(
        `<p><strong>Find the corners.</strong> On y = 0: x + 1 = 0 gives A(−1, 0); −x + 5 = 0 gives B(5, 0). The sloping lines cross at C:</p>
         ${sum('x + 1 = −x + 5 → 2x = 4 → x = 2, y = 3')}`,
        `<p><strong>Base along y = 0, height up to C.</strong></p>
         ${sum('base: 5 − (−1) = 6 &nbsp; height: 3')}`,
        `<p><strong>A = ½bh.</strong></p>
         ${sum('½ × 6 × 3 = 9')}
         ${ans('9')}`
      )}
      ${tip('If the base line is not y = 0, say y = 1, measure the height from that line, not from the x-axis.')}`
  });
})();
