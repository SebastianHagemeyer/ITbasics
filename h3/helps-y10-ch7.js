/* H3 help panels for Year 10 Chapter 7. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 7A to 7J. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers for this chapter (same as the Year 9 Chapter 10 ones) ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  // Points along y = f(x) for x in X, kept inside the y-window Y (edge crossings added).
  const ppath = (f, X, Y, step = 0.05) => {
    const out = [], inside = (y) => y >= Y[0] - 1e-9 && y <= Y[1] + 1e-9;
    const edge = (xa, ya, xb, yb) => { const lim = (ya > Y[1] || yb > Y[1]) ? Y[1] : Y[0]; const x = xa + (lim - ya) * (xb - xa) / (yb - ya); return [r3(x), r3(lim)]; };
    let px = null, py = null;
    for (let x = X[0]; x <= X[1] + 1e-9; x += step) {
      const y = f(x);
      if (px !== null && inside(y) !== inside(py)) out.push(edge(px, py, x, y));
      if (inside(y)) out.push([r3(x), r3(y)]);
      px = x; py = y;
    }
    return out;
  };
  // A parabola on a gridded number plane.
  const pplane = (f, X, Y, points = {}, alt = 'A parabola on a number plane') =>
    fig({ kind: 'plane', x: X, y: Y, path: ppath(f, X, Y), points, alt });
  // A sketch: plain axes, the curve at its own scale (sx across, sy up), key points labelled.
  const sketch = (f, X, Y, pts, alt, o = {}) => {
    const sx = o.sx || 1, sy = o.sy || 1;
    const xa = Math.min(X[0] * sx, -0.6) - 0.4, xb = Math.max(X[1] * sx, 0.6) + 0.6;
    const ya = Math.min(Y[0] * sy, -0.6) - 0.3, yb = Math.max(Y[1] * sy, 0.6) + 0.5;
    const items = [
      { seg: [xa, 0, xb, 0], arrow: 'end', thin: true }, { seg: [0, ya, 0, yb], arrow: 'end', thin: true },
      { label: o.xl || 'x', at: [xb + 0.45, 0] }, { label: o.yl || 'y', at: [0, yb + 0.5] }, { label: 'O', at: [-0.4, -0.5] },
      { poly: ppath(f, X, Y).map(([x, y]) => [r3(x * sx), r3(y * sy)]), open: true }
    ];
    if (o.axis !== undefined) items.push({ seg: [r3(o.axis * sx), ya, r3(o.axis * sx), yb], dash: true, thin: true });
    if (o.line) { const [m, c] = o.line; items.push({ poly: ppath(x => m * x + c, X, Y).map(([x, y]) => [r3(x * sx), r3(y * sy)]), open: true }); }
    for (const [x, y, name, pos] of pts) items.push({ point: [r3(x * sx), r3(y * sy)], name, pos: pos || 'ne' });
    return fig({ kind: 'diagram', unit: 26, items: items.concat(o.extra || []), alt });
  };
  // A gridded number plane drawn as a diagram, so it can carry several curves and extra marks.
  const pl = (X, Y, curves, extra = [], alt = 'Curves on a number plane') => {
    const g = [], step = (X[1] - X[0] > 12 || Y[1] - Y[0] > 12) ? 2 : 1;
    for (let x = X[0]; x <= X[1]; x++) g.push({ seg: [x, Y[0], x, Y[1]], thin: true });
    for (let y = Y[0]; y <= Y[1]; y++) g.push({ seg: [X[0], y, X[1], y], thin: true });
    g.push({ seg: [X[0], 0, X[1] + 0.6, 0], arrow: 'end' }, { seg: [0, Y[0], 0, Y[1] + 0.6], arrow: 'end' },
      { label: 'x', at: [X[1] + 0.95, 0] }, { label: 'y', at: [0, Y[1] + 0.95] }, { label: 'O', at: [-0.25, -0.5], anchor: 'end' });
    for (let x = X[0]; x <= X[1]; x += step) if (x) g.push({ label: String(x), at: [x, -0.5] });
    for (let y = Y[0]; y <= Y[1]; y += step) if (y) g.push({ label: String(y), at: [-0.2, y - 0.05], anchor: 'end' });
    for (const [f, faint] of curves) {
      const p = ppath(f, X, Y, 0.1);
      if (faint) for (let i = 0; i + 1 < p.length; i += 2) g.push({ seg: [p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]], thin: true, dash: true });
      else g.push({ poly: p, open: true });
    }
    return fig({ kind: 'diagram', unit: 30, items: g.concat(extra), alt });
  };
  // A small t-axis graph (no numbers): pts are the line, marks are labelled points.
  const tgraph = (pts, marks, xl, yl, alt) => fig({ kind: 'diagram', unit: 44, items: [
    { seg: [0, 0, 4.4, 0], arrow: 'end' }, { seg: [0, 0, 0, 2.7], arrow: 'end' },
    { label: xl, at: [4.55, 0], anchor: 'start' }, { label: yl, at: [0, 2.95] },
    { poly: pts.map(([x, y]) => [r3(x), r3(y)]), open: true }
  ].concat(marks.map(([x, y, name, pos]) => ({ point: [x, y], name, pos: pos || 'n' }))), alt });
  const run = (f, a, b, n = 20) => Array.from({ length: n + 1 }, (_, i) => { const t = a + (b - a) * i / n; return [t, f(t)]; });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 7A Exploring parabolas
    // =====================================================================
    // y10-7A Q1: key features read from a graph
    // method: Example 1, 7A (identifying key features of parabolas)
    'y10-7a-features': `
      <p class="hp-tag">Worked example: find the key features of this parabola.</p>
      ${pplane(x => x * x - 2 * x - 8, [-3, 5], [-10, 3], { '(1, −9)': [1, -9] }, 'An upright parabola crossing the x-axis at −2 and 4, the y-axis at −8, with lowest point (1, −9)')}
      ${steps(
        `<p><strong>Turning point.</strong> The graph opens upwards, so its lowest point, (1, −9), is a <b>minimum</b>. An upside-down graph has a highest point, a maximum.</p>
         ${ans('(1, -9), minimum')}`,
        `<p><strong>Axis of symmetry.</strong> It is the vertical line through the x-coordinate of the turning point.</p>
         ${ans('x = 1')}`,
        `<p><strong>Intercepts.</strong> x-intercepts lie on the x-axis (y = 0); the y-intercept lies on the y-axis (x = 0).</p>
         ${sum('x-intercepts: x = −2 and x = 4<br>y-intercept: (0, −8)')}
         ${ans('-2, 4 and (0, -8)')}`
      )}
      <p><strong>Touching the axis?</strong> If the turning point sits on the x-axis, it is the only x-intercept. If the graph never reaches the x-axis, there are none.</p>
      ${tip('Type points as (1, -9), the axis as x = 1, and the x-intercepts as just the x-values with a comma, like -2, 4. Type none if there are no x-intercepts.')}`,

    // y10-7A Q2, Q9: y = ax², the effect of a
    // method: Example 2a, 7A (transforming parabolas: dilation)
    'y10-7a-dilate': `
      <p class="hp-tag">Worked example: compare <b>y = 2x²</b> and <b>y = −(1/4)x²</b> with y = x².</p>
      ${pl([-3, 3], [-3, 6], [[x => x * x, true], [x => 2 * x * x], [x => -0.25 * x * x]], [{ point: [1, 2], name: '(1, 2)', pos: 'e' }, { point: [1, -0.25], name: '(1, −1/4)', pos: 'se' }], 'y = x² dashed, a narrower upright parabola through (1, 2) and a wider upside-down parabola through (1, −1/4)')}
      ${steps(
        `<p><strong>Sign of a: maximum or minimum?</strong> a = 2 is positive, so the graph is upright with a minimum. a = −1/4 is negative, so it is turned upside down (reflected in the x-axis) and has a maximum.</p>`,
        `<p><strong>Substitute x = 1.</strong></p>
         ${sum('y = 2 × 1² = 2<br>y = −(1/4) × 1² = −1/4')}`,
        `<p><strong>Wider or narrower?</strong> Ignore the sign and compare the size of a with 1. Bigger than 1 (like 2) means narrower; between 0 and 1 (like 1/4) means wider.</p>
         ${ans('2x²: minimum, 2, narrower; -(1/4)x²: maximum, -1/4, wider')}`
      )}
      ${tip('The y-value at x = 1 is always just a. Type fractions like -1/4.')}`,

    // y10-7A Q3, Q4, Q10, Q11: y = (x − h)² and y = x² + k
    // method: Example 2b, 2c, 7A (transforming parabolas: translations)
    'y10-7a-shift': `
      <p class="hp-tag">Worked example: find the features of <b>y = (x − 5)²</b> and of <b>y = x² − 4</b>.</p>
      ${steps(
        `<p><strong>y = (x − 5)² is y = x² moved 5 units right.</strong> The turning point moves with it, so it is (5, 0), on the x-axis. That point is also the only x-intercept.</p>
         ${sum('turning point (5, 0), axis x = 5, x-intercept (5, 0)')}`,
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = (0 − 5)² = (−5)² = 25')}
         ${ans('(0, 25)')}`,
        `<p><strong>y = x² − 4 is y = x² moved 4 units down.</strong> The turning point is (0, −4), which is also the y-intercept. At x = 1:</p>
         ${sum('y = 1² − 4 = −3')}
         ${ans('(0, -4), (0, -4), -3')}`
      )}
      <p><strong>Watch the sign inside the bracket:</strong> (x − 5)² moves right, (x + 6)² moves <b>left</b> 6. Outside the bracket, + k moves up and − k moves down.</p>
      ${tip('Type points as (5, 0) and the axis of symmetry as x = 5.')}`,

    // y10-7A Q5, Q6, Q7: axis, turning point and y-intercept from a rule
    // method: Example 2, 7A (reading the turning point from the transformation; y-intercept where x = 0)
    'y10-7a-read-rule': `
      <p class="hp-tag">Worked example: find the axis of symmetry, turning point and y-intercept of <b>y = −(x − 6)²</b> and <b>y = −x² + 7</b>.</p>
      ${steps(
        `<p><strong>y = −(x − 6)²:</strong> the minus sign flips the graph; the bracket moves it 6 right. The turning point is (6, 0) and the axis goes through it.</p>
         ${sum('turning point (6, 0), axis x = 6')}`,
        `<p><strong>y-intercept: put x = 0 into the rule.</strong> Square first, then apply the minus.</p>
         ${sum('y = −(0 − 6)² = −36')}
         ${ans('(0, -36)')}`,
        `<p><strong>y = −x² + 7:</strong> flipped, then moved 7 up. No bracket, so it has not moved sideways: the axis is the y-axis, x = 0.</p>
         ${sum('turning point (0, 7), axis x = 0, y-intercept (0, 7)')}`
      )}
      ${tip('When there is no bracket, the axis of symmetry is x = 0 and the turning point is also the y-intercept.')}`,

    // y10-7A Q8: matching rules to graphs
    // method: Example 2, 7A (effect of each change in the rule on the graph)
    'y10-7a-match': `
      <p class="hp-tag">Worked example: which features would the graph of <b>y = −(x + 2)²</b> have?</p>
      ${pl([-5, 2], [-5, 4], [[x => x * x, true], [x => -(x + 2) * (x + 2)]], [{ point: [-2, 0], name: '(−2, 0)', pos: 'n' }], 'y = x² dashed, and an upside-down parabola with its highest point at (−2, 0)')}
      ${steps(
        `<p><strong>Sign in front:</strong> negative, so it opens downwards.</p>`,
        `<p><strong>Where is the turning point?</strong> (x + 2) moves it 2 left, with no up or down shift: (−2, 0), on the x-axis.</p>`,
        `<p><strong>Width:</strong> the number in front is −1, the same size as for y = x², so it is the same width.</p>
         ${ans('opens down, turning point (-2, 0), same width')}`
      )}
      ${chips(['a > 1: narrower'], ['0 < a < 1: wider'], ['(x − h)²: right h', 'add'], ['(x + h)²: left h', 'take'], ['+ k: up'], ['− k: down'])}
      ${tip('Check three things for every rule: which way it opens, where the turning point is, and how wide it is. Then find the one graph that fits all three.')}`,

    // y10-7A Q12: how many x-intercepts
    // method: Example 1 and 2, 7A (position of the turning point compared with the x-axis)
    'y10-7a-count': `
      <p class="hp-tag">Worked example: how many x-intercepts do <b>y = x² − 16</b>, <b>y = (x + 7)²</b> and <b>y = x² + 7</b> have?</p>
      ${steps(
        `<p><strong>y = x² − 16:</strong> upright with turning point (0, −16), below the x-axis. It has to cross the axis on both sides.</p>
         ${ans('two')}`,
        `<p><strong>y = (x + 7)²:</strong> turning point (−7, 0), right on the x-axis. It just touches.</p>
         ${ans('one')}`,
        `<p><strong>y = x² + 7:</strong> upright with turning point (0, 7), above the x-axis. It never comes down to it.</p>
         ${ans('none')}`
      )}
      ${tip('For an upright parabola: turning point below the x-axis means two, on it means one, above it means none.')}`,

    // y10-7A Q13: rule from the turning point and one more point
    // method: Example 5, 7B (finding a rule from a simple graph); 7A has no worked example for this
    'y10-7a-rule': `
      <p class="hp-tag">Worked example: find the rule for the parabola with turning point <b>(0, −2)</b> that passes through <b>(1, 1)</b>.</p>
      ${steps(
        `<p><strong>Put the turning point into y = a(x − h)² + k.</strong> h = 0 and k = −2.</p>
         ${sum('y = ax² − 2')}`,
        `<p><strong>Substitute the other point to find a.</strong> When x = 1, y = 1.</p>
         ${sum('1 = a(1)² − 2<br>a = 3')}
         ${ans('y = 3x^2 - 2')}`,
        `<p><strong>Turning point on the x-axis?</strong> For turning point (4, 0) and y-intercept (0, 8): y = a(x − 4)², and 8 = a(0 − 4)² = 16a, so a = 1/2.</p>
         ${ans('y = (1/2)(x - 4)^2')}`
      )}
      ${tip('Type powers with ^, like y = 3x^2 - 2. If a works out as 1, leave it out: y = (x - 4)^2.')}`,

    // =====================================================================
    // Year 10 7B Sketching parabolas using transformations
    // =====================================================================
    // y10-7B Q1: y = ax², maximum or minimum, and the point where x = 1
    // method: Example 3a, 7B (sketching y = ax²; substitute x = 1 for a second point)
    'y10-7b-dilate': `
      <p class="hp-tag">Worked example: for <b>y = 7x²</b> and <b>y = −(1/5)x²</b>, is the turning point a maximum or a minimum, and what point has x = 1?</p>
      ${steps(
        `<p><strong>Look at the sign of a.</strong> 7 is positive: upright, minimum. −1/5 is negative: inverted, maximum. Both turning points are at (0, 0).</p>`,
        `<p><strong>Substitute x = 1 to label a second point.</strong></p>
         ${sum('y = 7 × 1² = 7 &nbsp; → (1, 7)<br>y = −(1/5) × 1² = −1/5 &nbsp; → (1, −1/5)')}
         ${ans('minimum, (1, 7); maximum, (1, -1/5)')}`
      )}
      ${tip('Type the point as (1, -1/5). Fractions are fine inside the brackets.')}`,

    // y10-7B Q2: simple shifts, turning point and y-intercept
    // method: Example 3b, 3c, 7B (sketching with transformations)
    'y10-7b-simple': `
      <p class="hp-tag">Worked example: find the turning point and y-intercept of <b>y = −x² + 6</b> and <b>y = (x − 3)²</b>.</p>
      ${steps(
        `<p><strong>y = −x² + 6</strong> is inverted and moved 6 up from y = −x². The turning point is (0, 6), and when x = 0, y = 6 too.</p>
         ${ans('(0, 6) and (0, 6)')}`,
        `<p><strong>y = (x − 3)²</strong> is upright and moved 3 right, so the turning point is (3, 0).</p>`,
        `<p><strong>Substitute x = 0 for the y-intercept.</strong></p>
         ${sum('y = (0 − 3)² = (−3)² = 9')}
         ${ans('(3, 0) and (0, 9)')}`
      )}
      ${tip('A minus in front, like −(x + 1)², makes the y-intercept negative: square the bracket first, then apply the minus.')}`,

    // y10-7B Q3, Q4, Q8, Q10, Q11: turning point form y = a(x − h)² + k
    // method: Example 4, 7B (using turning point form)
    'y10-7b-tp-form': `
      <p class="hp-tag">Worked example: find the turning point and y-intercept of <b>y = (x + 6)² − 10</b>.</p>
      ${sketch(x => (x + 6) * (x + 6) - 10, [-11, 0.6], [-10, 30], [[-6, -10, '(−6, −10)', 'se'], [0, 26, '(0, 26)', 'e']], 'A sketch of an upright parabola with turning point (−6, −10) and y-intercept 26', { sx: 0.45, sy: 0.12 })}
      ${steps(
        `<p><strong>Read h and k from y = a(x − h)² + k.</strong> (x + 6) is (x − (−6)), so h = −6 and k = −10.</p>
         ${sum('turning point (−6, −10)')}`,
        `<p><strong>Substitute x = 0 for the y-intercept.</strong></p>
         ${sum('y = (0 + 6)² − 10 = 36 − 10 = 26')}
         ${ans('(-6, -10) and (0, 26)')}`,
        `<p><strong>A number in front does not move the turning point.</strong> y = (1/3)(x − 6)² − 5 has turning point (6, −5). It does change the y-intercept:</p>
         ${sum('y = (1/3)(0 − 6)² − 5 = 12 − 5 = 7')}`
      )}
      <p><strong>Inverted:</strong> y = −(x − 6)² + 7 has turning point (6, 7) and y-intercept −36 + 7 = −29. <strong>Number first:</strong> y = 6 − x² is y = −x² + 6, turning point (0, 6).</p>
      ${tip('The sign inside the bracket flips: (x + 6) gives h = −6. The k outside keeps its sign.')}`,

    // y10-7B Q5: the rule of a graph
    // method: Example 5, 7B (finding a rule from a simple graph)
    'y10-7b-rule-graph': `
      <p class="hp-tag">Worked example: find the rule of the parabola with turning point <b>(0, 2)</b> passing through <b>(1, −1)</b>.</p>
      ${sketch(x => -3 * x * x + 2, [-1.3, 1.3], [-3, 2], [[0, 2, '2', 'ne'], [1, -1, '(1, −1)', 'e']], 'An upside-down parabola with turning point (0, 2) passing through (1, −1)', { sx: 1.3, sy: 0.9 })}
      ${steps(
        `<p><strong>Turning point (0, 2) gives h = 0, k = 2.</strong></p>
         ${sum('y = ax² + 2')}`,
        `<p><strong>Use the other point.</strong> When x = 1, y = −1.</p>
         ${sum('−1 = a(1)² + 2<br>a = −3')}
         ${ans('y = -3x^2 + 2')}`,
        `<p><strong>Turning point on the x-axis?</strong> Turning point (6, 0) and y-intercept 18: y = a(x − 6)², so 18 = 36a and a = 1/2.</p>
         ${ans('y = (1/2)(x - 6)^2')}`
      )}
      ${tip('If the labelled point is (1, something), that something is a + k, so a is just the gap from k. Type y = -3x^2 + 2.')}`,

    // y10-7B Q6, Q9: rules and transformations in words
    // method: Key ideas, 7B (h moves left or right, k moves up or down, a negative reflects)
    'y10-7b-describe': `
      <p class="hp-tag">Worked example: write the rule when y = x² is translated <b>2 units left and 5 units down</b>.</p>
      ${steps(
        `<p><strong>Left or right goes inside the bracket, with the opposite sign.</strong> 2 left gives (x + 2)².</p>`,
        `<p><strong>Up or down goes on the end.</strong> 5 down gives − 5.</p>
         ${ans('y = (x + 2)^2 - 5')}`,
        `<p><strong>Backwards: describe y = −(x − 6)² + 1.</strong></p>
         ${flow(['−(...)', 'reflected in the x-axis'], ['(x − 6)²', '6 units right'], ['+ 1', '1 unit up'])}`
      )}
      ${tip('A reflection in the x-axis puts a minus in front of the whole squared part: −x², −(x − 1)².')}`,

    // y10-7B Q7: a fountain or ball path in turning point form
    // method: Example 4, 7B (turning point and y-intercept from turning point form), then substitute
    'y10-7b-context': `
      <p class="hp-tag">Worked example: a ball follows <b>h = −(x − 3)² + 9</b>, where h m is its height and x m the distance across.</p>
      ${steps(
        `<p><strong>Turning point.</strong> a = −1 is negative, so it is a maximum, at (3, 9). The greatest height is the k value, 9 m.</p>
         ${ans('maximum, (3, 9), 9')}`,
        `<p><strong>y-intercept: x = 0.</strong></p>
         ${sum('h = −(0 − 3)² + 9 = −9 + 9 = 0')}
         <p>So (0, 0): the ball starts at ground level.</p>`,
        `<p><strong>Height at other distances: substitute.</strong></p>
         ${sum('x = 2: h = −(2 − 3)² + 9 = 8<br>x = 6: h = −(6 − 3)² + 9 = 0')}`
      )}
      ${tip('Points the same distance either side of the turning point have the same height. That is a quick check.')}`,

    // =====================================================================
    // Year 10 7C Sketching parabolas using factorisation
    // =====================================================================
    // y10-7C Q1: y = x² + bx
    // method: Example 6a, 7C (x-intercepts by factorising, turning point by symmetry)
    'y10-7c-common': `
      <p class="hp-tag">Worked example: find the x-intercepts and the turning point of <b>y = x² − 8x</b>.</p>
      ${steps(
        `<p><strong>x-intercepts: y = 0.</strong> Take out the common factor x and use the Null Factor Law.</p>
         ${sum('0 = x(x − 8)<br>x = 0 or x − 8 = 0, so x = 0, x = 8')}`,
        `<p><strong>The turning point is halfway between the x-intercepts.</strong></p>
         ${sum('x = (0 + 8) ÷ 2 = 4')}`,
        `<p><strong>Substitute x = 4 into the rule.</strong></p>
         ${sum('y = 4² − 8(4) = 16 − 32 = −16')}
         ${ans('0, 8 and (4, -16)')}`
      )}
      <p><strong>Odd number in front of x?</strong> y = x² − 13x crosses at 0 and 13, so x = 13/2, and y = 169/4 − 169/2 = −169/4. Keep the fractions.</p>
      ${tip('Type the intercepts as 0, 8 and the turning point as (4, -16). Fractions are fine, like (13/2, -169/4).')}`,

    // y10-7C Q2, Q3: y = x² + bx + c
    // method: Example 6b, 7C (factorise, Null Factor Law, symmetry)
    'y10-7c-trinomial': `
      <p class="hp-tag">Worked example: factorise to find the x-intercepts and turning point of <b>y = x² − 12x + 20</b>.</p>
      ${sketch(x => x * x - 12 * x + 20, [-0.6, 12.6], [-16, 22], [[0, 20, '(0, 20)', 'e'], [2, 0, '2', 'nw'], [10, 0, '10', 'ne'], [6, -16, '(6, −16)', 'se']], 'A sketch of an upright parabola with y-intercept 20, x-intercepts 2 and 10, and turning point (6, −16)', { sx: 0.45, sy: 0.15, axis: 6 })}
      ${steps(
        `<p><strong>y = 0, factorise, Null Factor Law.</strong> −2 and −10 multiply to 20 and add to −12.</p>
         ${sum('0 = (x − 2)(x − 10)<br>x = 2 or x = 10')}`,
        `<p><strong>Halfway between them.</strong></p>
         ${sum('x = (2 + 10) ÷ 2 = 6')}`,
        `<p><strong>Substitute x = 6.</strong> The coefficient of x² is positive, so it is a minimum.</p>
         ${sum('y = 6² − 12(6) + 20 = 36 − 72 + 20 = −16')}
         ${ans('2, 10 and (6, -16)')}`
      )}
      ${tip('Check: the turning point x must sit exactly in the middle of the two intercepts. Type 2, 10 and (6, -16).')}`,

    // y10-7C Q4: perfect squares
    // method: Example 7, 7C (sketching a perfect square)
    'y10-7c-square': `
      <p class="hp-tag">Worked example: find the turning point and y-intercept of <b>y = x² − 8x + 16</b>.</p>
      ${steps(
        `<p><strong>y-intercept: x = 0.</strong> y = 16, so (0, 16).</p>`,
        `<p><strong>x-intercepts: y = 0 and factorise.</strong> It is a perfect square.</p>
         ${sum('0 = (x − 4)(x − 4) = (x − 4)²<br>x − 4 = 0, so x = 4')}`,
        `<p><strong>Only one x-intercept, so it is the turning point.</strong></p>
         ${ans('(4, 0) and (0, 16)')}`
      )}
      ${tip('A perfect square always has its turning point on the x-axis, so the y-coordinate of the turning point is 0.')}`,

    // y10-7C Q5, Q8: difference of two squares, including surds
    // method: Key ideas and Example 6, 7C (factorise, Null Factor Law, symmetry)
    'y10-7c-dops': `
      <p class="hp-tag">Worked example: find the x-intercepts and turning point of <b>y = x² − 49</b>, then of <b>y = 2x² − 26</b>.</p>
      ${steps(
        `<p><strong>Difference of two squares.</strong></p>
         ${sum('0 = (x − 7)(x + 7)<br>x = 7 or x = −7')}`,
        `<p><strong>Halfway between −7 and 7 is 0.</strong> Substitute x = 0: y = −49.</p>
         ${ans('-7, 7 and (0, -49)')}`,
        `<p><strong>Not a perfect square number?</strong> Take out the common factor, then use surds.</p>
         ${sum('0 = 2(x² − 13) = 2(x − √13)(x + √13)<br>x = √13 or x = −√13')}
         <p>The turning point is again at x = 0: (0, −26).</p>
         ${ans('-√13, √13 and (0, -26)')}`
      )}
      ${tip('Type surds as sqrt13 or √13, with a comma between, like -sqrt13, sqrt13.')}`,

    // y10-7C Q6: a common factor first
    // method: Example 6 and Example 8, 7C (factorise, symmetry, substitute into the factorised rule)
    'y10-7c-common-factor': `
      <p class="hp-tag">Worked example: find the turning point of <b>y = 4x² + 8x − 12</b>.</p>
      ${steps(
        `<p><strong>Take out the common factor, then factorise the bracket.</strong></p>
         ${sum('y = 4(x² + 2x − 3) = 4(x + 3)(x − 1)')}`,
        `<p><strong>x-intercepts and the middle.</strong> x = −3 and x = 1, so the turning point is at x = (−3 + 1) ÷ 2 = −1.</p>`,
        `<p><strong>Substitute x = −1 into the factorised rule.</strong> Keep the 4.</p>
         ${sum('y = 4(−1 + 3)(−1 − 1) = 4 × 2 × (−2) = −16')}
         ${ans('(-1, -16)')}`
      )}
      <p><strong>Bracket will not factorise?</strong> Use symmetry another way: y = x² − 4x + 7 gives 7 at x = 0 and at x = 4, so the axis is halfway, x = 2, and y = 4 − 8 + 7 = 3.</p>
      ${tip('The common factor stretches the graph but does not move the x-intercepts, so the turning point x stays the same. Do not forget it when you find y.')}`,

    // y10-7C Q7: rule y = (x + a)(x + b) from a graph
    // method: Example 8, 7C (finding a turning point from a graph)
    'y10-7c-graph': `
      <p class="hp-tag">Worked example: this graph has a rule of the form y = (x + a)(x + b). Find the rule and the turning point.</p>
      ${sketch(x => (x + 1) * (x - 5), [-1.8, 5.8], [-9, 8], [[-1, 0, '−1', 'nw'], [5, 0, '5', 'ne']], 'An upright parabola crossing the x-axis at −1 and 5', { sx: 0.6, sy: 0.25 })}
      ${steps(
        `<p><strong>Each x-intercept gives a factor.</strong> x = −1 comes from (x + 1) and x = 5 from (x − 5).</p>
         ${ans('y = (x + 1)(x - 5)')}`,
        `<p><strong>Average the intercepts.</strong></p>
         ${sum('x = (−1 + 5) ÷ 2 = 2')}`,
        `<p><strong>Substitute x = 2.</strong></p>
         ${sum('y = (2 + 1)(2 − 5) = 3 × (−3) = −9')}
         ${ans('(2, -9)')}`
      )}
      ${tip('The sign in each bracket is the opposite of the intercept. Type the rule like y = (x + 1)(x - 5).')}`,

    // y10-7C Q10, Q15: finding the number in front, a
    // method: no worked example in 7C; Example 8 for the factors, then substitute a known point
    'y10-7c-find-a': `
      <p class="hp-tag">Worked example: the graph of <b>y = a(x − 1)(x + 5)</b> passes through <b>(2, 14)</b>. Find a and the turning point.</p>
      ${steps(
        `<p><strong>Substitute the point.</strong> x = 2, y = 14.</p>
         ${sum('14 = a(2 − 1)(2 + 5) = 7a<br>a = 2')}`,
        `<p><strong>Turning point halfway between the intercepts 1 and −5.</strong></p>
         ${sum('x = (1 + (−5)) ÷ 2 = −2<br>y = 2(−2 − 1)(−2 + 5) = 2 × (−3) × 3 = −18')}
         ${ans('2 and (-2, -18)')}`,
        `<p><strong>From a graph:</strong> intercepts 1 and 4 with y-intercept 8. Write y = a(x − 1)(x − 4), then put in (0, 8): 8 = a(−1)(−4) = 4a, so a = 2.</p>
         ${ans('y = 2(x - 1)(x - 4)')}`
      )}
      ${tip('An upside-down graph needs a negative a. An intercept at 0 gives a factor of x on its own, like y = 3x(x - 2).')}`,

    // y10-7C Q9, Q13: inverted parabolas
    // method: Example 6, 7C (factorise, symmetry, substitute); negative x² gives a maximum
    'y10-7c-inverted': `
      <p class="hp-tag">Worked example: find the x-intercepts and turning point of <b>y = 25 − x²</b>, then of <b>y = −x² + 8x − 12</b>.</p>
      ${steps(
        `<p><strong>25 − x² is a difference of two squares.</strong></p>
         ${sum('0 = (5 − x)(5 + x), so x = 5 or x = −5')}
         <p>The middle is x = 0, so the turning point is (0, 25). The x² term is negative, so it is a maximum.</p>
         ${ans('-5, 5 and (0, 25)')}`,
        `<p><strong>Take out −1 first so the bracket is easy to factorise.</strong></p>
         ${sum('0 = −(x² − 8x + 12) = −(x − 2)(x − 6)<br>x = 2 or x = 6')}`,
        `<p><strong>Middle and substitute.</strong></p>
         ${sum('x = (2 + 6) ÷ 2 = 4<br>y = −4² + 8(4) − 12 = −16 + 32 − 12 = 4')}
         ${ans('2, 6 and (4, 4)')}`
      )}
      <p><strong>Same intercepts, opposite sign:</strong> y = x² − 8x + 12 crosses at 2 and 6 too, but its turning point is (4, −4), the mirror image.</p>
      ${tip('In −4², square first: −4² = −16. Type the turning point as (4, 4).')}`,

    // y10-7C Q14: rules with a letter
    // method: Example 6, 7C (factorise, symmetry), done with a letter instead of a number
    'y10-7c-general': `
      <p class="hp-tag">Worked example: for <b>y = (x − p)(x + p)</b>, give the y-intercept, x-intercepts and turning point in terms of p.</p>
      ${steps(
        `<p><strong>y-intercept: x = 0.</strong></p>
         ${sum('y = (0 − p)(0 + p) = −p², so (0, −p²)')}`,
        `<p><strong>x-intercepts: Null Factor Law.</strong> x = p or x = −p.</p>`,
        `<p><strong>Halfway between p and −p is 0</strong>, so the turning point is (0, −p²).</p>
         ${ans('(0, -p^2); p, -p; (0, -p^2)')}`
      )}
      ${tip('Treat the letter like a number: factorise, halve the gap, substitute. Type p² as p^2 and halves as b/2.')}`,

    // =====================================================================
    // Year 10 7D Sketching parabolas by completing the square
    // =====================================================================
    // y10-7D Q1, Q2, Q5: turning point and y-intercept
    // method: Example 9a, 9b, 7D (key features from turning point form)
    'y10-7d-tp': `
      <p class="hp-tag">Worked example: for <b>y = (1/2)(x − 8)² − 5</b>, find the turning point, whether it is a maximum or minimum, and the y-intercept.</p>
      ${steps(
        `<p><strong>Turning point (h, k).</strong> h = 8 and k = −5. a = 1/2 is positive, so it is a minimum.</p>
         ${ans('minimum, (8, -5)')}`,
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = (1/2)(0 − 8)² − 5 = 32 − 5 = 27')}
         ${ans('(0, 27)')}`,
        `<p><strong>Negative a:</strong> y = −(x − 8)² + 50 has a maximum at (8, 50), and y-intercept −64 + 50 = −14.</p>`
      )}
      <p><strong>Already expanded?</strong> For y = x² − 9x + 14, putting x = 0 leaves just the constant: (0, 14).</p>
      ${tip('Square the bracket before multiplying by a, and before applying a minus sign. Type (0, 27).')}`,

    // y10-7D Q3, Q11: x-intercepts from turning point form
    // method: Example 9c, 7D (substitute y = 0, rearrange, square root both sides with ±)
    'y10-7d-xint-tp': `
      <p class="hp-tag">Worked example: find the x-intercepts of <b>y = 2(x + 8)² − 72</b>.</p>
      ${steps(
        `<p><strong>Substitute y = 0 and get the bracket on its own.</strong> Divide both sides by 2, then add 36.</p>
         ${sum('0 = 2(x + 8)² − 72<br>0 = (x + 8)² − 36<br>(x + 8)² = 36')}`,
        `<p><strong>Square root both sides, remembering ±.</strong></p>
         ${sum('x + 8 = ±6<br>x = −8 + 6 or x = −8 − 6<br>x = −2 or x = −14')}
         ${ans('-14, -2')}`,
        `<p><strong>Other endings.</strong></p>
         ${sum('(x − 8)² = 3 → x = 8 ± √3 &nbsp; (two, exact)<br>(x − 8)² = 0 → x = 8 &nbsp; (one)<br>(x − 8)² = −2 → no solution &nbsp; (none)')}`
      )}
      ${tip('A square can never be negative, so if the bracket squared has to equal a negative number there are no x-intercepts. Type none. Surds: 8 - sqrt3, 8 + sqrt3.')}`,

    // y10-7D Q4, Q6, Q7, Q8: completing the square
    // method: Example 10, 7D (sketching by completing the square)
    'y10-7d-complete': `
      <p class="hp-tag">Worked example: complete the square for <b>y = x² + 12x + 31</b>, then find the turning point and x-intercepts.</p>
      ${sketch(x => x * x + 12 * x + 31, [-10, 0.6], [-5, 31], [[-6, -5, '(−6, −5)', 'se'], [0, 31, '(0, 31)', 'e']], 'A sketch of an upright parabola with turning point (−6, −5) and y-intercept 31', { sx: 0.45, sy: 0.12 })}
      ${steps(
        `<p><strong>Add and subtract (half the x coefficient)².</strong> Half of 12 is 6, and 6² = 36.</p>
         ${sum(`y = x² + 12x + ${now('36 − 36')} + 31<br>= (x + 6)² − 5`)}
         <p>Turning point (−6, −5), a minimum. y-intercept (0, 31).</p>`,
        `<p><strong>x-intercepts: y = 0 in the turning point form.</strong></p>
         ${sum('(x + 6)² = 5<br>x + 6 = ±√5<br>x = −6 ± √5')}
         ${ans('-6 - √5, -6 + √5')}`,
        `<p><strong>Odd x coefficient: keep fractions.</strong> y = x² − 7x + 8:</p>
         ${sum('= (x − 7/2)² − 49/4 + 32/4 = (x − 7/2)² − 17/4<br>turning point (7/2, −17/4), x = (7 ± √17)/2')}`
      )}
      <p><strong>How many x-intercepts?</strong> After completing the square, look at the number on the end: y = x² − 2x + 6 = (x − 1)² + 5 has +5, so the lowest point is above the axis and there are none. A negative number on the end gives two; 0 gives one.</p>
      ${tip('Type surds like -6 - sqrt5, -6 + sqrt5 and fractions like (7 + sqrt17)/2. Type none if there are no x-intercepts.')}`,

    // y10-7D Q9, Q12: taking out a factor first
    // method: Exercise 7D Q12 worked example (take out the coefficient of x², then complete the square)
    'y10-7d-factor-a': `
      <p class="hp-tag">Worked example: find the x-intercepts of <b>y = 2x² + 12x − 14</b>, then the turning point of <b>y = 2x² + 12x + 5</b>.</p>
      ${steps(
        `<p><strong>Take out the 2 and complete the square inside.</strong></p>
         ${sum('0 = 2(x² + 6x − 7)<br>0 = 2((x + 3)² − 9 − 7) = 2((x + 3)² − 16)')}`,
        `<p><strong>Solve.</strong> Divide by 2, then square root.</p>
         ${sum('(x + 3)² = 16<br>x + 3 = ±4, so x = 1 or x = −7')}
         ${ans('-7, 1')}`,
        `<p><strong>Turning point when the constant does not divide evenly:</strong> use a fraction inside, then multiply back out.</p>
         ${sum('y = 2(x² + 6x + 5/2)<br>= 2((x + 3)² − 9 + 5/2) = 2((x + 3)² − 13/2)<br>= 2(x + 3)² − 13')}
         ${ans('(-3, -13)')}`
      )}
      ${tip('Multiply the number on the end by the factor you took out when you expand back: 2 × (−13/2) = −13.')}`,

    // y10-7D Q10: taking out −1
    // method: Exercise 7D Q10 worked example (take out a factor of −1, then complete the square)
    'y10-7d-neg': `
      <p class="hp-tag">Worked example: find the turning point and x-intercepts of <b>y = −x² + 10x − 18</b>.</p>
      ${steps(
        `<p><strong>Take out −1.</strong> Every sign inside the bracket flips.</p>
         ${sum('y = −(x² − 10x + 18)')}`,
        `<p><strong>Complete the square inside, then remove the outer brackets.</strong></p>
         ${sum('= −((x − 5)² − 25 + 18) = −((x − 5)² − 7)<br>= −(x − 5)² + 7')}
         ${ans('(5, 7), a maximum')}`,
        `<p><strong>x-intercepts: y = 0.</strong></p>
         ${sum('(x − 5)² = 7<br>x = 5 ± √7')}
         ${ans('5 - √7, 5 + √7')}`
      )}
      ${tip('An inverted graph whose maximum is below the x-axis has no x-intercepts. Type none.')}`,

    // y10-7D Q14: rule from the turning point and other points
    // method: Example 5, 7B (substitute a known point into turning point form)
    'y10-7d-rule': `
      <p class="hp-tag">Worked example: turning point <b>(1, −2)</b>, passing through <b>(3, 6)</b>.</p>
      ${steps(
        `<p><strong>Write turning point form with h and k.</strong></p>
         ${sum('y = a(x − 1)² − 2')}`,
        `<p><strong>Substitute the point and solve for a.</strong></p>
         ${sum('6 = a(3 − 1)² − 2<br>8 = 4a, so a = 2')}
         ${ans('y = 2(x - 1)^2 - 2')}`,
        `<p><strong>Only the axis given?</strong> Axis x = 1 through (0, 3) and (3, 9): y = a(x − 1)² + k. Each point gives an equation; take one from the other.</p>
         ${sum('3 = a + k<br>9 = 4a + k<br>6 = 3a, so a = 2 and k = 1')}
         ${ans('y = 2(x - 1)^2 + 1')}`
      )}
      ${tip('Type fractions in front with brackets, like y = (1/2)(x + 2)^2 + 1.')}`,

    // =====================================================================
    // Year 10 7E The quadratic formula and the discriminant
    // =====================================================================
    // y10-7E Q1, Q6: number of x-intercepts (and turning point)
    // method: Example 11, 7E (using the discriminant and x = −b/(2a))
    'y10-7e-disc': `
      <p class="hp-tag">Worked example: for <b>y = 2x² − 3x + 4</b>, find the number of x-intercepts and the turning point.</p>
      ${steps(
        `<p><strong>Discriminant Δ = b² − 4ac</strong> with a = 2, b = −3, c = 4.</p>
         ${sum('Δ = (−3)² − 4(2)(4) = 9 − 32 = −23')}
         <p>Δ &lt; 0, so there are no x-intercepts.</p>
         ${ans('0')}`,
        `<p><strong>Turning point x = −b/(2a).</strong></p>
         ${sum('x = −(−3)/(2 × 2) = 3/4')}`,
        `<p><strong>Substitute to get y.</strong></p>
         ${sum('y = 2(3/4)² − 3(3/4) + 4 = 9/8 − 18/8 + 32/8 = 23/8')}
         ${ans('(3/4, 23/8)')}`
      )}
      ${chips(['Δ > 0: two', 'add'], ['Δ = 0: one'], ['Δ < 0: none', 'take'])}
      ${tip('A missing term is a 0: y = 3x² − 2 has b = 0, so Δ = 0 − 4(3)(−2) = 24, two intercepts. Bracket negative numbers when you square them.')}`,

    // y10-7E Q2, Q3: y-intercept and turning point
    // method: Example 11b, 11c, 7E (y-intercept at x = 0; turning point from x = −b/(2a))
    'y10-7e-tp': `
      <p class="hp-tag">Worked example: find the y-intercept and turning point of <b>y = 5x² + 20x + 7</b>.</p>
      ${steps(
        `<p><strong>y-intercept: x = 0 leaves c.</strong> (0, 7).</p>`,
        `<p><strong>x = −b/(2a)</strong> with a = 5, b = 20.</p>
         ${sum('x = −20/(2 × 5) = −2')}`,
        `<p><strong>Substitute x = −2.</strong></p>
         ${sum('y = 5(−2)² + 20(−2) + 7 = 20 − 40 + 7 = −13')}
         ${ans('(0, 7) and (-2, -13)')}`
      )}
      <p><strong>Negative a, fraction answer:</strong> y = −x² + 7x − 2 gives x = −7/(2 × (−1)) = 7/2 and y = −49/4 + 49/2 − 2 = 41/4.</p>
      ${tip('Watch the double negative: −b when b is negative is positive. Fractions are fine, like (7/2, 41/4).')}`,

    // y10-7E Q4, Q5: x-intercepts with the quadratic formula
    // method: Example 12, 7E (sketching graphs using the quadratic formula)
    'y10-7e-formula': `
      <p class="hp-tag">Worked example: find the turning point and x-intercepts of <b>y = 2x² − 6x − 3</b>.</p>
      ${sketch(x => 2 * x * x - 6 * x - 3, [-1, 4], [-7.5, 5], [[-0.44, 0, '−0.44', 'nw'], [3.44, 0, '3.44', 'ne'], [1.5, -7.5, '(3/2, −15/2)', 'se']], 'A sketch of an upright parabola crossing the x-axis at about −0.44 and 3.44, with turning point (3/2, −15/2)', { sx: 0.9, sy: 0.3 })}
      ${steps(
        `<p><strong>Quadratic formula</strong> with a = 2, b = −6, c = −3.</p>
         ${sum('x = (6 ± √((−6)² − 4(2)(−3))) / (2 × 2) = (6 ± √60) / 4')}`,
        `<p><strong>Exact: simplify the surd and cancel.</strong> √60 = 2√15.</p>
         ${sum('x = (6 ± 2√15)/4 = (3 ± √15)/2')}
         <p><strong>Rounded:</strong> x ≈ 3.44 or x ≈ −0.44.</p>
         ${ans('(3 - √15)/2, (3 + √15)/2')}`,
        `<p><strong>Turning point.</strong></p>
         ${sum('x = 6/4 = 3/2<br>y = 2(3/2)² − 6(3/2) − 3 = 9/2 − 9 − 3 = −15/2')}
         ${ans('(3/2, -15/2)')}`
      )}
      ${tip('Type exact answers as (3 - sqrt15)/2, (3 + sqrt15)/2. Type rounded ones to two decimal places, like -0.44, 3.44.')}`,

    // y10-7E Q7: rule from a graph
    // method: no worked example in 7E; turning point form (7B Example 5) then expand
    'y10-7e-rule': `
      <p class="hp-tag">Worked example: a parabola has turning point <b>(−1, −3)</b> and x-intercepts <b>−1 ± √3</b>. Find its rule as y = ax² + bx + c.</p>
      ${steps(
        `<p><strong>Start from turning point form.</strong></p>
         ${sum('y = a(x + 1)² − 3')}`,
        `<p><strong>Use an x-intercept to find a.</strong> At x = −1 + √3, (x + 1)² = (√3)² = 3 and y = 0.</p>
         ${sum('0 = 3a − 3, so a = 1')}`,
        `<p><strong>Expand.</strong></p>
         ${sum('y = (x + 1)² − 3 = x² + 2x + 1 − 3 = x² + 2x − 2')}
         ${ans('y = x^2 + 2x - 2')}`
      )}
      ${tip('Check with the y-intercept: x = 0 gives −2, and the graph should cross there. Type y = x^2 + 2x - 2.')}`,

    // y10-7E Q11: the turning point in letters
    // method: Key ideas, 7E (substitute x = −b/(2a) into the rule), done with letters
    'y10-7e-general': `
      <p class="hp-tag">Worked example with numbers: substitute x = −b/(2a) into <b>y = 3x² + 18x + 5</b> to find the y-coordinate of the turning point.</p>
      ${steps(
        `<p><strong>Find x = −b/(2a).</strong> Here a = 3 and b = 18.</p>
         ${sum('x = −18/(2 × 3) = −3')}`,
        `<p><strong>Substitute, with brackets.</strong></p>
         ${sum('y = 3(−3)² + 18(−3) + 5')}`,
        `<p><strong>Simplify each term, then add.</strong> Squaring removes the minus.</p>
         ${sum('y = 27 − 54 + 5 = −22')}`
      )}
      ${tip('Do exactly the same steps with letters: put −b/(2a) in brackets everywhere x appears, square it first, then simplify each term and use a common denominator. Type a bottom with two letters in brackets, like (2a).')}`,

    // =====================================================================
    // Year 10 7F Applications of parabolas
    // =====================================================================
    // y10-7F Q1, Q2, Q6: rules given in turning point form
    // method: Example 13, 7F (applying parabolas given the rule)
    'y10-7f-tp-rule': `
      <p class="hp-tag">Worked example: a stone's path is <b>h = −(1/5)(d − 10)² + 20</b>, where h m is its height and d m the distance across.</p>
      ${steps(
        `<p><strong>Turning point (h, k) = (10, 20).</strong> a is negative, so it is a maximum: the greatest height is 20 m.</p>
         ${ans('(10, 20), 20')}`,
        `<p><strong>d-intercepts: h = 0.</strong> Subtract 20, then multiply both sides by −5.</p>
         ${sum('0 = −(1/5)(d − 10)² + 20<br>100 = (d − 10)²<br>d − 10 = ±10, so d = 0 or d = 20')}
         ${ans('0, 20')}`,
        `<p><strong>Span or width</strong> is the gap between the intercepts: 20 − 0 = 20 m.</p>`
      )}
      <p><strong>Upright, like a bowl:</strong> d = (1/4)x² − 9 has turning point (0, −9), so the bowl is 9 cm deep. Setting d = 0 gives x² = 36, x = ±6, so it is 12 cm wide.</p>
      ${tip('A depth or height is a distance, so give it as a positive number, even when the turning point has a negative y.')}`,

    // y10-7F Q7, Q8, Q9, Q12: rules in expanded form
    // method: Example 13, 7F, with x-intercepts by factorising (Example 6, 7C)
    'y10-7f-expanded': `
      <p class="hp-tag">Worked example: a diving bird's height is <b>h = t² − 6t + 5</b> metres after t seconds.</p>
      ${steps(
        `<p><strong>When is it at sea level? h = 0.</strong></p>
         ${sum('0 = (t − 1)(t − 5), so t = 1 (enters) and t = 5 (comes out)')}`,
        `<p><strong>Deepest point: halfway, then substitute.</strong></p>
         ${sum('t = (1 + 5) ÷ 2 = 3<br>h = 9 − 18 + 5 = −4, so 4 m deep at (3, −4)')}`,
        `<p><strong>At a given height, set the rule equal to it.</strong> 3 m below sea level is h = −3.</p>
         ${sum('t² − 6t + 5 = −3<br>t² − 6t + 8 = 0<br>(t − 2)(t − 4) = 0, so t = 2 or t = 4')}`
      )}
      <p><strong>No t term?</strong> h = 60 − 5t² hits the water when 5t² = 60, t² = 12, t = √12 = 2√3 (time is positive). <strong>Will not factorise?</strong> Complete the square: t² − 4t + 7 = (t − 2)² + 3, so the lowest height is 3, which is above 0.</p>
      ${tip('Time cannot be negative, so keep only the positive square root. Type exact times like 2sqrt3.')}`,

    // y10-7F Q3, Q4, Q5, Q10: forming the rule yourself
    // method: Example 14, 7F (applying parabolas by formulating a rule)
    'y10-7f-formulate': `
      <p class="hp-tag">Worked example: a 44 cm wire is bent into a rectangle of width x cm. Find the largest area.</p>
      ${sketch(x => x * (22 - x), [0, 22], [0, 121], [[22, 0, '22', 'ne'], [11, 121, '(11, 121)', 'n']], 'A sketch of an upside-down parabola from 0 to 22, highest at (11, 121)', { sx: 0.25, sy: 0.025, axis: 11, xl: 'x', yl: 'A' })}
      ${steps(
        `<p><strong>Use the perimeter for the length.</strong></p>
         ${sum('2 × length + 2x = 44, so length = 22 − x')}`,
        `<p><strong>Area = length × width, and the sensible values.</strong> Both sides must be positive.</p>
         ${sum('A = x(22 − x), &nbsp; 0 &lt; x &lt; 22')}`,
        `<p><strong>The maximum is halfway between the intercepts 0 and 22.</strong></p>
         ${sum('x = 11, &nbsp; A = 11(22 − 11) = 121')}
         ${ans('121 cm², with width 11 and length 11')}`
      )}
      <p><strong>Fence on three sides only?</strong> With 80 m and a wall as the fourth side: length = 80 − 2x, A = x(80 − 2x), intercepts 0 and 40, so x = 20 and A = 20 × 40 = 800. <strong>Two numbers adding to 30:</strong> product P = x(30 − x), largest at x = 15, P = 225.</p>
      ${tip('Type the rules with the letter given, like A = x(22 - x). For "which values make sense", both lengths must be more than 0.')}`,

    // y10-7F Q11: a frame around a picture
    // method: Example 14, 7F (form the area rule), then solve by factorising (Example 6, 7C)
    'y10-7f-frame': `
      <p class="hp-tag">Worked example: a framed picture is 20 cm by 16 cm in total, with a frame x cm wide all round.</p>
      ${steps(
        `<p><strong>The frame comes off both ends of each side.</strong></p>
         ${sum('A = (20 − 2x)(16 − 2x)')}`,
        `<p><strong>Largest x:</strong> the shorter side reaches 0 when 16 − 2x = 0, so x must stay below 8.</p>`,
        `<p><strong>Picture area 140 cm²: set up and solve.</strong></p>
         ${sum('(20 − 2x)(16 − 2x) = 140<br>320 − 72x + 4x² = 140<br>4x² − 72x + 180 = 0<br>x² − 18x + 45 = 0<br>(x − 3)(x − 15) = 0')}
         <p>x = 15 is too big (it is not below 8), so the frame is 3 cm wide.</p>
         ${ans('3')}`
      )}
      ${tip('Type the rule with A =, like A = (20 - 2x)(16 - 2x). Always check each solution still makes sense.')}`,

    // y10-7F Q13: a curve and a horizontal line
    // method: Example 13, 7F (turning point), with solving by the quadratic formula (Example 12, 7E)
    'y10-7f-line': `
      <p class="hp-tag">Worked example: a path follows <b>y = (1/5)x(x − 30)</b>, and a road runs along <b>y = c</b>.</p>
      ${steps(
        `<p><strong>Turning point: halfway between the intercepts 0 and 30.</strong></p>
         ${sum('x = 15, &nbsp; y = (1/5)(15)(−15) = −45, so (15, −45)')}`,
        `<p><strong>How many crossings?</strong> The road meets the path twice above the turning point (c &gt; −45), once at c = −45, never below it.</p>`,
        `<p><strong>Where? Set the rule equal to c.</strong> For c = −20, multiply by 5 and rearrange.</p>
         ${sum('x² − 30x = −100<br>x² − 30x + 100 = 0<br>x = (30 ± √500)/2 = 15 ± 5√5')}
         <p>So x ≈ 3.8 and x ≈ 26.2.</p>
         ${ans('3.8, 26.2')}`
      )}
      ${tip('Round only at the end, to the decimal places asked for. Type both values with a comma.')}`,

    // y10-7F Q14: a lob over a player
    // method: no worked example in 7F; rule from the x-intercepts (Example 8, 7C), then the turning point
    'y10-7f-lob': `
      <p class="hp-tag">Worked example: a ball hit from ground level lands 20 m away. A player 4 m in front of the landing spot can reach anything under 3 m. What is the lowest maximum height that gets past?</p>
      ${steps(
        `<p><strong>Put the start at x = 0, so the intercepts are 0 and 20.</strong></p>
         ${sum('h = a x(x − 20)')}`,
        `<p><strong>The player is at x = 16. Make the ball exactly 3 m high there.</strong></p>
         ${sum('3 = a(16)(16 − 20) = −64a, so a = −3/64')}`,
        `<p><strong>The highest point is halfway, at x = 10.</strong></p>
         ${sum('h = −(3/64)(10)(10 − 20) = 300/64 = 4.6875')}
         ${ans('4.69')}`
      )}
      ${tip('Draw it: ground along the x-axis, start at 0, landing at the far intercept. "In front of" the landing spot means between the start and the landing spot.')}`,

    // =====================================================================
    // Year 10 7G Intersection of lines and parabolas
    // =====================================================================
    // y10-7G Q1, Q9: a parabola and a horizontal line
    // method: Example 15, 7G (parabola and a horizontal line)
    'y10-7g-horizontal': `
      <p class="hp-tag">Worked example: find where <b>y = x² − 4x</b> meets <b>y = 12</b>.</p>
      ${steps(
        `<p><strong>Substitute y = 12 and rearrange to = 0.</strong></p>
         ${sum('x² − 4x = 12<br>x² − 4x − 12 = 0')}`,
        `<p><strong>Factorise and use the Null Factor Law.</strong> Every point is on y = 12.</p>
         ${sum('(x − 6)(x + 2) = 0, so x = 6 or x = −2')}
         ${ans('(-2, 12) and (6, 12)')}`,
        `<p><strong>No solutions?</strong> y = x² + 6x + 12 and y = 1 give x² + 6x + 11 = 0, and b² − 4ac = 36 − 44 = −8 is negative, so they do not meet.</p>
         ${ans('none')}`
      )}
      <p><strong>Which lines y = c meet it?</strong> y = x² − 4x + 1 has turning point x = 2, y = 4 − 8 + 1 = −3. Lines above −3 cut it twice, y = −3 touches once, lines below miss it.</p>
      ${tip('Type each point as (-2, 12). Type none if there are no points of intersection.')}`,

    // y10-7G Q2, Q3, Q7: a line and a parabola by substitution
    // method: Example 16, 7G (solving simultaneous equations involving a line and a parabola)
    'y10-7g-sub': `
      <p class="hp-tag">Worked example: solve <b>y = x² − 2x − 5</b> and <b>y = x + 5</b> simultaneously.</p>
      ${pl([-3, 6], [-6, 11], [[x => x * x - 2 * x - 5], [x => x + 5]], [{ point: [-2, 3], name: '(−2, 3)', pos: 'w' }, { point: [5, 10], name: '(5, 10)', pos: 'e' }], 'A parabola and a straight line crossing at (−2, 3) and (5, 10)')}
      ${steps(
        `<p><strong>Substitute one into the other and rearrange to = 0.</strong></p>
         ${sum('x² − 2x − 5 = x + 5<br>x² − 3x − 10 = 0')}`,
        `<p><strong>Factorise and solve.</strong></p>
         ${sum('(x − 5)(x + 2) = 0, so x = 5 or x = −2')}`,
        `<p><strong>Find each y from the simpler equation, y = x + 5.</strong></p>
         ${sum('x = −2: y = 3 &nbsp; &nbsp; x = 5: y = 10')}
         ${ans('(-2, 3) and (5, 10)')}`
      )}
      <p><strong>Line not in y = form?</strong> For y = x² − 3 and x + y = 3, replace y with x² − 3 in brackets: x + (x² − 3) = 3, so x² + x − 6 = 0, (x + 3)(x − 2) = 0, giving (−3, 6) and (2, 1).</p>
      ${tip('Gather terms on the side that keeps x² positive. Give the point with the smaller x first if asked. Fractions are fine inside a point, like (-3/4, 9/8).')}`,

    // y10-7G Q4: using the quadratic formula
    // method: Example 17, 7G (solving simultaneous equations with the quadratic formula)
    'y10-7g-formula': `
      <p class="hp-tag">Worked example: solve <b>y = x² + 5x − 2</b> and <b>y = 2x + 1</b>.</p>
      ${steps(
        `<p><strong>Substitute and rearrange.</strong></p>
         ${sum('x² + 5x − 2 = 2x + 1<br>x² + 3x − 3 = 0')}`,
        `<p><strong>It will not factorise, so use the formula</strong> with a = 1, b = 3, c = −3.</p>
         ${sum('x = (−3 ± √(9 + 12))/2 = (−3 ± √21)/2')}`,
        `<p><strong>Substitute the exact x into the line.</strong></p>
         ${sum('y = 2x + 1 = −3 ± √21 + 1 = −2 ± √21')}
         <p>To one decimal place: (0.8, 2.6) and (−3.8, −6.6).</p>
         ${ans('((-3 + √21)/2, -2 + √21)')}`
      )}
      ${tip('Keep exact values until the very end, then round. Type surd points like ((-3 + sqrt21)/2, -2 + sqrt21). A negative number under the root means none.')}`,

    // y10-7G Q5, Q10, Q11, Q12: how many solutions, using the discriminant
    // method: Example 18, 7G (determining the number of solutions)
    'y10-7g-count': `
      <p class="hp-tag">Worked example: how many times does <b>y = x² + 3</b> meet <b>y = 2x + 2</b>? And <b>y = 2x² + x</b> meet <b>y = 3x − 2</b>?</p>
      ${steps(
        `<p><strong>Start as if solving, then use b² − 4ac.</strong></p>
         ${sum('x² + 3 = 2x + 2 → x² − 2x + 1 = 0<br>b² − 4ac = (−2)² − 4(1)(1) = 0 → one (the line is a tangent)')}`,
        `<p><strong>Second pair.</strong></p>
         ${sum('2x² + x = 3x − 2 → 2x² − 2x + 2 = 0<br>b² − 4ac = 4 − 16 = −12 &lt; 0 → none')}
         ${ans('1 and 0')}`,
        `<p><strong>With a letter.</strong> y = x² and y = 5x + k give x² − 5x − k = 0, so Δ = 25 + 4k. Two points when 25 + 4k &gt; 0, one when it equals 0 (k = −25/4), none when it is negative.</p>
         <p><strong>Tangent y = mx</strong> to y = x² + 1: x² − mx + 1 = 0, Δ = m² − 4 = 0, so m = 2 or m = −2.</p>`
      )}
      ${tip('Type inequalities like k > -25/4 or k >= 0. Type a list of values with a comma, like -2, 2.')}`,

    // y10-7G Q6, Q8: problems with a line and a parabola
    // method: Example 11c, 7E (turning point) and Example 16, 7G (points of intersection)
    'y10-7g-context': `
      <p class="hp-tag">Worked example: a ball follows <b>y = −0.2x² + 2x + 1</b> in a hall with a 5.8 m ceiling.</p>
      ${steps(
        `<p><strong>Greatest height: the turning point.</strong></p>
         ${sum('x = −2/(2 × (−0.2)) = 5<br>y = −0.2(25) + 10 + 1 = 6')}
         <p>6 m is more than 5.8 m, so the ball would hit the ceiling.</p>
         ${ans('6, yes')}`,
        `<p><strong>Length of a crossing.</strong> A lake edge y = 5 − x² and a road y = x + 3 meet where</p>
         ${sum('5 − x² = x + 3 → x² + x − 2 = 0 → (x + 2)(x − 1) = 0<br>points (−2, 1) and (1, 4)')}`,
        `<p><strong>Distance between the points, then scale.</strong></p>
         ${sum('√((1 − (−2))² + (4 − 1)²) = √18 ≈ 4.243 units<br>1 unit = 20 m, so about 85 m')}`
      )}
      ${tip('Heights can be fractions or decimals. Round the length only at the end, to the accuracy asked for.')}`,

    // =====================================================================
    // Year 10 7H Rates of change
    // =====================================================================
    // y10-7H Q1, Q2, Q3, Q9: filling containers
    // method: Example 19, 7H (graphing height vs time)
    'y10-7h-containers': `
      <p class="hp-tag">Worked example: water pours at a constant rate into a container with a funnel-shaped bottom and straight sides above it. Sketch h against t.</p>
      ${fig({ kind: 'diagram', unit: 34, items: [{ poly: [[-1, 4], [-1, 2], [-0.15, 0], [0.15, 0], [1, 2], [1, 4]], open: true }], alt: 'A container that narrows to a point at the bottom, with straight vertical sides above' })}
      ${tgraph(run(t => 2 * Math.cbrt(t), 0, 1).concat(run(t => 2 + (2 / 3) * (t - 1), 1, 4, 3)), [], 't', 'h', 'A height-time graph: a curve rising fast then flattening, joining a straight line')}
      ${steps(
        `<p><strong>Narrow part fills fast.</strong> At the bottom there is little room, so the height rises quickly: a steep start.</p>`,
        `<p><strong>Widening part: the gradient keeps decreasing.</strong> Each bit higher up holds more water, so the curve gets flatter.</p>`,
        `<p><strong>Straight sides: constant rate.</strong> The width stops changing, so the graph becomes a straight line.</p>
         ${ans('a curve getting less steep, then a straight line')}`
      )}
      ${tip('Wider means slower, narrower means faster. Straight sides give straight graph pieces; sloping sides give curves.')}`,

    // y10-7H Q4, Q5: reading a distance-time graph
    // method: Example 20, 7H (working with distance-time graphs)
    'y10-7h-dt': `
      <p class="hp-tag">Worked example: describe the speed on each part of this journey.</p>
      ${tgraph(run(t => 0.5 * t * t, 0, 1).concat(run(t => 0.5 + (t - 1), 1, 2, 2)).concat(run(t => 1.5 + (t - 2) - 0.5 * (t - 2) * (t - 2), 2, 3)).concat([[4, 2]]),
        [[0, 0, 'P', 'nw'], [1, 0.5, 'Q', 'nw'], [2, 1.5, 'R', 'nw'], [3, 2, 'S', 'n'], [4, 2, 'T', 'n']], 't (hours)', 'd (km)', 'A distance-time graph: curving up from P to Q, straight from Q to R, flattening from R to S, flat from S to T')}
      ${steps(
        `<p><strong>Flat: speed zero.</strong> S to T, the distance does not change.</p>`,
        `<p><strong>Straight and sloping: constant speed.</strong> Q to R.</p>`,
        `<p><strong>Curves: is it getting steeper or flatter?</strong> P to Q gets steeper, so speed is increasing. R to S gets flatter, so speed is decreasing.</p>
         ${ans('zero S to T; constant Q to R; increasing P to Q; decreasing R to S')}`
      )}
      ${tip('Speed is the steepness. To compare two points, ask which one has the steeper graph there.')}`,

    // y10-7H Q6, Q7, Q8, Q11, Q12: describing rates of change in words
    // method: Key ideas, 7H (journeys A to D: increasing or decreasing at an increasing or decreasing rate)
    'y10-7h-describe': `
      <p class="hp-tag">Worked example: a cup of hot tea cools quickly at first, then more and more slowly. Describe its temperature-time graph.</p>
      ${steps(
        `<p><strong>Is the quantity going up, down or staying the same?</strong> Temperature goes down: the graph slopes down and the gradient is <b>negative</b>.</p>`,
        `<p><strong>Straight or curved?</strong> The rate changes, so it is curved: a <b>varying</b> gradient.</p>`,
        `<p><strong>Steeper or flatter as time goes on?</strong> Flatter, so it is <b>decreasing at a decreasing rate</b>.</p>
         ${ans('negative varying gradient, decreasing at a decreasing rate')}`
      )}
      ${fig({ kind: 'table', rows: [['Graph', 'Gradient', 'Speed (distance graphs)'], ['flat', 'zero', 'stationary'], ['straight, sloping', 'constant', 'constant speed'], ['curve getting steeper', 'varying', 'speeding up, accelerating'], ['curve getting flatter', 'varying', 'slowing down, decelerating']] })}
      ${tip('Distance from home going down still means moving: the speed comes from the steepness, not the direction. A graph that goes back in time, or is vertical, is not possible.')}`,

    // =====================================================================
    // Year 10 7I Average and instantaneous rates of change
    // =====================================================================
    // y10-7I Q1, Q2, Q3, Q4, Q8, Q9, Q11, Q13: average rate of change
    // method: Example 21, 7I (finding an average rate of change)
    'y10-7i-average': `
      <p class="hp-tag">Worked example: for <b>y = x² − 5</b>, find the average rate of change as x goes from 2 to 5.</p>
      ${steps(
        `<p><strong>Find both points by substituting.</strong></p>
         ${sum('x = 2: y = 4 − 5 = −1<br>x = 5: y = 25 − 5 = 20')}`,
        `<p><strong>Gradient = (y₂ − y₁)/(x₂ − x₁).</strong></p>
         ${sum('(20 − (−1))/(5 − 2) = 21/3 = 7')}
         ${ans('7')}`,
        `<p><strong>Closer points:</strong> from x = 3 to 3.1, y goes from 4 to 4.61, so the rate is 0.61/0.1 = 6.1. The closer the two x-values, the better it estimates the rate at x = 3.</p>`
      )}
      <p><strong>Average speed</strong> is total distance ÷ total time: 150 km in 3 hours is 50 km/h.</p>
      ${tip('Bracket negatives when you subtract them. A negative answer means y is going down on average.')}`,

    // y10-7I Q5, Q6, Q7, Q10, Q12: gradients of segments to estimate a tangent
    // method: Example 22, 7I (approximating an instantaneous rate of change)
    'y10-7i-segments': `
      <p class="hp-tag">Worked example: estimate the instantaneous rate of change at B on y = x² + 1.</p>
      ${pl([0, 3], [0, 10], [[x => x * x + 1]], [{ seg: [0, 0, 3, 6], dash: true, thin: true }, { point: [0, 1], name: 'A(0, 1)', pos: 'e' }, { point: [1, 2], name: 'B(1, 2)', pos: 'nw' }, { point: [2, 5], name: 'C(2, 5)', pos: 'nw' }, { point: [3, 10], name: 'D(3, 10)', pos: 'w' }], 'A curve through A(0, 1), B(1, 2), C(2, 5), D(3, 10), with a dashed tangent at B')}
      ${steps(
        `<p><strong>Gradient of each segment: rise over run.</strong></p>
         ${sum('BC = (5 − 2)/(2 − 1) = 3<br>BD = (10 − 2)/(3 − 1) = 4')}`,
        `<p><strong>Pick the segment closer to the tangent.</strong> C is nearer to B than D is, so BC is the better estimate.</p>
         ${ans('BC')}`,
        `<p><strong>One point each side is often better still.</strong> AC = (5 − 1)/(2 − 0) = 2, which matches the dashed tangent.</p>`
      )}
      ${tip('Read coordinates off carefully, including the scale on each axis. A segment going down has a negative gradient.')}`,

    // y10-7I Q14, Q15: estimating with points either side
    // method: Exercise 7I Q14 and Q15 worked example (average rate between x = a − h and x = a + h)
    'y10-7i-instant': `
      <p class="hp-tag">Worked example: estimate the instantaneous rate of change of <b>y = 2ˣ</b> at <b>x = 3</b>, using x = 2.9 and x = 3.1.</p>
      ${steps(
        `<p><strong>Find y at the two points either side.</strong></p>
         ${sum('x = 2.9: y = 2^2.9 ≈ 7.4643<br>x = 3.1: y = 2^3.1 ≈ 8.5742')}`,
        `<p><strong>Average rate between them.</strong></p>
         ${sum('(8.5742 − 7.4643)/(3.1 − 2.9) ≈ 5.55')}
         ${ans('5.55')}`,
        `<p><strong>For a quadratic this is exact.</strong> y = x² + 2x at x = 1, with h = 1: y(0) = 0 and y(2) = 8, so (8 − 0)/(2 − 0) = 4. Any h gives 4.</p>`
      )}
      ${tip('Keep plenty of decimals until the last step, then round to two decimal places.')}`,

    // =====================================================================
    // Year 10 7J Direct variation and inverse variation
    // =====================================================================
    // y10-7J Q1, Q3, Q5: direct variation
    // method: Example 23, 7J (finding and using a direct variation rule)
    'y10-7j-direct': `
      <p class="hp-tag">Worked example: a is directly proportional to b, and a = 56 when b = 8.</p>
      ${steps(
        `<p><strong>Write a = kb and substitute to find k.</strong></p>
         ${sum('56 = k × 8<br>k = 7, so a = 7b')}
         ${ans('a = 7b')}`,
        `<p><strong>Find a when b = 5: substitute.</strong></p>
         ${sum('a = 7 × 5 = 35')}`,
        `<p><strong>Find b when a = 21: substitute and solve.</strong></p>
         ${sum('21 = 7b, so b = 3')}
         <p>If it does not divide evenly, leave a fraction: a = 10 gives b = 10/7.</p>`
      )}
      <p><strong>In context:</strong> a cyclist at a steady 24 km/h has d = 24t. In 3.5 hours: d = 84 km. For 60 km: 60 = 24t, t = 2.5 hours.</p>
      ${tip('Type the rule like a = 7b. k is the number you multiply by, the rate.')}`,

    // y10-7J Q2, Q4, Q6: inverse variation
    // method: Example 24, 7J (finding and using an inverse proportion rule)
    'y10-7j-inverse': `
      <p class="hp-tag">Worked example: x and y are inversely proportional, and y = 3 when x = 14.</p>
      ${steps(
        `<p><strong>k = xy.</strong></p>
         ${sum('k = 14 × 3 = 42, so y = 42/x')}
         ${ans('42 and y = 42/x')}`,
        `<p><strong>y when x = 7.</strong></p>
         ${sum('y = 42/7 = 6')}`,
        `<p><strong>x when y = 28.</strong> Multiply both sides by x, then divide.</p>
         ${sum('28 = 42/x<br>28x = 42, so x = 3/2')}`
      )}
      <p><strong>Sharing a fixed cost:</strong> a $360 boat shared by n people costs c = 360/n each. With 9 people, $40 each. The boat holds 12 at most, so the least each can pay is 360/12 = $30.</p>
      ${tip('Type the rule as y = 42/x. Money to the nearest cent, like 12.50.')}`,

    // y10-7J Q7, Q8: direct or inverse, and writing the equation
    // method: Key ideas, 7J (y = kx when both go up together; y = k/x when one goes up as the other goes down)
    'y10-7j-which': `
      <p class="hp-tag">Worked example: decide direct or inverse, then write an equation.</p>
      ${steps(
        `<p><strong>Ask: if one doubles, what happens to the other?</strong></p>
         ${chips(['doubles too: direct, y = kx', 'add'], ['halves: inverse, y = k/x', 'take'])}`,
        `<p><strong>Tickets at $15 each:</strong> twice as many tickets cost twice as much, so direct.</p>
         ${sum('C = 15n')}`,
        `<p><strong>A $600 prize shared by n people:</strong> twice as many people get half each, so inverse.</p>
         ${sum('s = 600/n')}
         ${ans('direct, C = 15n; inverse, s = 600/n')}`
      )}
      ${tip('A fixed total being shared or split (a cost, a job, a distance) usually means inverse. Type the equation with the letters given, like s = 600/n.')}`,

    // y10-7J Q9: partial variation
    // method: Exercise 7J Q9 (partial variation: a fixed part plus a part that varies directly)
    'y10-7j-partial': `
      <p class="hp-tag">Worked example: a taxi charges a $4 flag fall plus $2.50 per km.</p>
      ${steps(
        `<p><strong>Fixed part plus the varying part.</strong></p>
         ${sum('C = 4 + 2.5d')}
         ${ans('C = 4 + 2.5d')}`,
        `<p><strong>Cost of 12 km.</strong></p>
         ${sum('C = 4 + 2.5 × 12 = 4 + 30 = 34')}`,
        `<p><strong>How far for $39?</strong> Take off the fixed part, then divide.</p>
         ${sum('39 = 4 + 2.5d<br>35 = 2.5d, so d = 14')}`
      )}
      ${tip('Write cents as dollars: 80 cents is 0.8. Type the rule like C = 4 + 2.5d.')}`,

    // y10-7J Q10, Q11: joint and combined variation
    // method: Exercise 7J Q10 and Q11 (joint variation y = kxz; combined variation y = kx/z)
    'y10-7j-joint': `
      <p class="hp-tag">Worked example: the time t hours to paint a wall varies directly with its area A m² and inversely with the number of painters n.</p>
      ${steps(
        `<p><strong>Directly goes on top, inversely goes underneath.</strong></p>
         ${sum('t = kA/n')}`,
        `<p><strong>Find k:</strong> 2 painters take 3 hours for 60 m².</p>
         ${sum('3 = k × 60/2 = 30k, so k = 1/10')}`,
        `<p><strong>Use it.</strong> 5 painters, 200 m²: t = 200/(10 × 5) = 4 hours. Painters for 150 m² in 5 hours: 5 = 150/(10n), so n = 3.</p>
         ${ans('t = kA/n, k = 1/10')}`
      )}
      <p><strong>Joint variation:</strong> the area of a triangle, A = (1/2)bh, varies jointly with b and h. The constant is 1/2. A gets bigger as b gets bigger, and smaller as h gets smaller.</p>
      ${tip('Type the rule using k, like t = k*A/n. Type the constant as a fraction, like 1/10.')}`
  });
})();
