/* H3 help panels for Year 10 Chapter 10. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 10A to 10K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers for this chapter ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  // Many points along y = f(x) for x in X, kept inside the y-window Y. Where the curve leaves or
  // enters the window, the crossing point is added so the line runs right to the edge.
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
  // A sketch on plain axes (no grid), in the graph's own numbers, squashed by sx across and sy up.
  // curves: [[f, [x0, x1]]] (one entry per branch), circles: [[cx, cy, r]] (needs sx = sy),
  // polys: [[[x, y], ...]], dash: [[x1, y1, x2, y2]], pts: [[x, y, name, pos]], labels: [[text, x, y, anchor]].
  const skSpec = (o) => {
    const sx = o.sx || 1, sy = o.sy || 1, X = o.x, Y = o.y;
    const P = ([x, y]) => [r3(x * sx), r3(y * sy)];
    const xa = Math.min(X[0] * sx, -0.6) - 0.4, xb = Math.max(X[1] * sx, 0.6) + 0.6;
    const ya = Math.min(Y[0] * sy, -0.6) - 0.3, yb = Math.max(Y[1] * sy, 0.6) + 0.5;
    const items = [
      { seg: [xa, 0, xb, 0], arrow: 'end', thin: true }, { seg: [0, ya, 0, yb], arrow: 'end', thin: true },
      { label: 'x', at: [xb + 0.45, 0] }, { label: 'y', at: [0, yb + 0.5] }, { label: 'O', at: [-0.4, -0.5] }
    ];
    for (const [x1, y1, x2, y2] of o.dash || []) items.push({ seg: [...P([x1, y1]), ...P([x2, y2])], dash: true, thin: true });
    for (const [f, D] of o.curves || []) items.push({ poly: ppath(f, D || X, Y).map(P), open: true });
    for (const [cx, cy, r] of o.circles || []) items.push({ circle: [r3(cx * sx), r3(cy * sy), r3(r * sx)] });
    for (const p of o.polys || []) items.push({ poly: p.map(P), open: true });
    for (const [x, y, name, pos] of o.pts || []) items.push({ point: P([x, y]), name, pos: pos || 'ne' });
    for (const [t, x, y, anchor] of o.labels || []) items.push({ label: t, at: P([x, y]), anchor: anchor || 'middle' });
    return { kind: 'diagram', unit: o.unit || 26, items, alt: o.alt || 'A sketch graph' };
  };
  const sk = (...os) => fig(...os.map(skSpec));

  // Polynomial long division, one column per power of x, set out like the textbook.
  // top: the dividend's terms; q: quotient terms above their columns ('' for a gap);
  // rows: { c: [cells], rule: [from, to] (a line above those columns), note: 'what was multiplied' }.
  const ldiv = (dv, q, top, rows) => {
    const n = top.length;
    const cell = (c, st = '') => `<span style="text-align:right;padding:0 7px;white-space:nowrap;${st}">${c}</span>`;
    let h = `<div aria-hidden="true" style="display:grid;grid-template-columns:auto repeat(${n}, auto) auto;justify-content:start;font:700 16px/1.65 var(--f-mono);background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:8px 12px;width:max-content;max-width:100%;overflow-x:auto;margin:6px 0">`;
    h += '<span></span>' + q.map(c => cell(c, 'color:var(--h3-green)')).join('') + '<span></span>';
    h += `<span style="padding-right:8px;border-right:2px solid var(--ink);white-space:nowrap">${dv}</span>` + top.map(c => cell(c, 'border-top:2px solid var(--ink)')).join('') + '<span></span>';
    for (const r of rows) {
      h += '<span></span>' + r.c.map((c, i) => cell(c, r.rule && i >= r.rule[0] && i <= r.rule[1] ? 'border-top:1.5px solid var(--ink)' : '')).join('');
      h += `<span style="padding-left:10px;color:var(--muted);font:400 13px/1.9 var(--f-body, inherit);white-space:nowrap">${r.note || ''}</span>`;
    }
    return h + '</div>';
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 10A Functions and their notation
    // =====================================================================
    // y10-10A Q1, Q4: substituting into f(x)
    // method: Example 1, 10A (using function notation)
    'y10-10a-notation': `
      <p><b>f(x)</b> is just a name for y. <b>f(3)</b> means "put x = 3 into the rule".</p>
      <p class="hp-tag">Worked example: for <b>f(x) = x² + 4x − 2</b>, find f(0), f(−3), f(c) and f(c + 1).</p>
      ${steps(
        `<p><strong>Replace every x with the number, in brackets.</strong></p>
         ${sum('f(0) = (0)² + 4(0) − 2 = −2')}`,
        `<p><strong>Negative inputs need the brackets most.</strong> (−3)² is +9, not −9.</p>
         ${sum('f(−3) = (−3)² + 4(−3) − 2<br>= 9 − 12 − 2 = −5')}
         ${ans('-5')}`,
        `<p><strong>A letter or an expression goes in the same way.</strong> Then expand and collect like terms.</p>
         ${sum('f(c) = c² + 4c − 2<br>f(c + 1) = (c + 1)² + 4(c + 1) − 2<br>= c² + 2c + 1 + 4c + 4 − 2 = c² + 6c + 3')}
         ${ans('c^2+6c+3')}`
      )}
      <p><strong>A fraction input:</strong> f(1/2) = (1/2)² + 4(1/2) − 2 = 1/4 + 2 − 2 = 1/4. Type fractions with a slash.</p>
      ${tip('Type powers with ^, like c^2 + 6c + 3. Square the whole bracket: (c + 1)² has three terms, not two.')}`,

    // y10-10A Q2: is a relation a function?
    // method: Example 2a, 2b, 10A (recognising a function)
    'y10-10a-relation': `
      <p>A <b>function</b> gives exactly one y-value for each x-value.</p>
      <p class="hp-tag">Worked example: which of these are functions?</p>
      ${steps(
        `<p><strong>A list of points: look at the x-values only.</strong> In {(−2, 5), (0, 1), (3, 1), (4, −2)} the x-values −2, 0, 3, 4 each appear once.</p>
         ${ans('Function')}
         <p>Two points sharing a y-value (here y = 1) is fine.</p>`,
        `<p><strong>An x-value that repeats with a different y-value breaks it.</strong> In {(2, 7), (5, 0), (2, −1)}, x = 2 goes to both 7 and −1.</p>
         ${ans('Not a function')}`,
        `<p><strong>A rule: does each x give one y?</strong> y = x² − 6 is a parabola. Put in any x and you get one answer, so it is a function. Straight lines like y = 5x and exponentials like y = 4<sup>x</sup> work the same way.</p>`
      )}
      ${tip('Only a repeated x-value can stop a list of points being a function. Repeated y-values never do.')}`,

    // y10-10A Q3: the vertical line test
    // method: Example 2c, 10A (vertical line test on a graph)
    'y10-10a-vlt': `
      <p class="hp-tag">Worked example: use the vertical line test on graphs A and B.</p>
      ${sk(
        { x: [-2.5, 3], y: [-2.5, 3], curves: [[x => x * x / 2 - 2, [-2.5, 3]]], dash: [[1, -2.5, 1, 3]], pts: [[1, -1.5, '', 'se']], labels: [['A', -2.2, 2.6]], alt: 'Graph A: a parabola, cut once by a dashed vertical line' },
        { x: [-2.5, 3], y: [-2.5, 2.5], polys: [Array.from({ length: 41 }, (_, i) => { const y = -2 + i * 0.1; return [r3(2 - y * y), r3(y)]; })], dash: [[0, -2.5, 0, 2.5]], pts: [[0, 1.414, '', 'ne'], [0, -1.414, '', 'se']], labels: [['B', -2.2, 2.2]], alt: 'Graph B: a sideways parabola, cut twice by the dashed y-axis line' }
      )}
      ${steps(
        `<p><strong>Imagine a vertical line sliding from left to right across the graph.</strong></p>`,
        `<p><strong>Graph A:</strong> wherever the line sits, it cuts the curve once. Each x has one y.</p>
         ${ans('Function')}`,
        `<p><strong>Graph B:</strong> the line x = 0 cuts the curve twice, at about y = 1.4 and y = −1.4. One x-value has two y-values.</p>
         ${ans('Not a function')}`
      )}
      ${tip('You only need one vertical line that cuts twice to say "not a function". Check near the edges and any part that curls back.')}`,

    // y10-10A Q5, Q6: domain and range
    // method: Example 3, 10A (determining domain and range)
    'y10-10a-domain': `
      <p>The <b>domain</b> is the x-values you are allowed to put in. The <b>range</b> is the y-values that come out.</p>
      <p class="hp-tag">Worked example: the domain and range of <b>y = 2 − 5x</b>, <b>y = x² − 6</b> and <b>y = 1 − 3x²</b></p>
      ${steps(
        `<p><strong>A straight line (not horizontal).</strong> Any x can go in and every y-value comes out.</p>
         ${ans('All real x-values')} &nbsp; ${ans('All real y-values')}`,
        `<p><strong>y = x² − 6.</strong> Any x can be squared, so the domain is all real x. But x² is never negative, so the smallest y is 0 − 6.</p>
         ${sum('range: y ≥ −6')}
         ${ans('y>=-6')}`,
        `<p><strong>y = 1 − 3x².</strong> −3x² is never positive, so the biggest y is 1.</p>
         ${sum('range: y ≤ 1')}
         ${ans('y<=1')}`
      )}
      ${tip('Type ≥ as >= and ≤ as <=, like y >= -6. For a parabola, the range starts at the turning point.')}`,

    // y10-10A Q10: range of a quadratic from its turning point
    // method: no worked example in 10A; Key ideas (range) with the turning point formula from Chapter 7
    'y10-10a-range-tp': `
      <p class="hp-tag">Worked example: find the range of <b>y = x² − 4x + 1</b>, then of <b>y = 5 + 4x − 2x²</b>.</p>
      ${steps(
        `<p><strong>Find the x-value of the turning point</strong> with x = −b/(2a).</p>
         ${sum('y = x² − 4x + 1: a = 1, b = −4<br>x = −(−4)/(2 × 1) = 2')}`,
        `<p><strong>Substitute to get the y-value.</strong> This parabola opens up (a &gt; 0), so the turning point is the lowest point.</p>
         ${sum('y = 2² − 4(2) + 1 = 4 − 8 + 1 = −3')}
         ${ans('y>=-3')}`,
        `<p><strong>When a is negative the parabola opens down</strong>, so the turning point is the highest point.</p>
         ${sum('y = 5 + 4x − 2x²: a = −2, b = 4<br>x = −4/(2 × (−2)) = 1<br>y = 5 + 4 − 2 = 7, so y ≤ 7')}
         ${ans('y<=7')}`
      )}
      ${tip('Keep fractions exact: a turning point at y = −25/4 gives y >= -25/4. Completing the square gives the same turning point.')}`,

    // y10-10A Q7: two functions, combined and inside each other
    // method: Example 1, 10A (substitute into each rule); f(g(x)) and f(a) = g(a) have no worked example
    'y10-10a-two': `
      <p class="hp-tag">Worked example: <b>f(x) = 2x + 1</b> and <b>g(x) = 4 − x</b></p>
      ${steps(
        `<p><strong>Find each value on its own, then combine.</strong></p>
         ${sum('f(4) = 2(4) + 1 = 9, &nbsp; g(1) = 4 − 1 = 3<br>f(4) + g(1) = 9 + 3 = 12<br>f(−3) + 2g(0) = −5 + 2 × 4 = 3')}`,
        `<p><strong>f(g(3)) means: work out g(3) first, then put that answer into f.</strong> Inside brackets first.</p>
         ${sum(`g(3) = 4 − 3 = 1<br>f(g(3)) = ${now('f(1)')} = 2(1) + 1 = 3`)}
         ${ans('3')}`,
        `<p><strong>f(a) = g(a): set the two rules equal and solve.</strong></p>
         ${sum('2a + 1 = 4 − a<br>3a = 3, so a = 1')}
         <p>At x = 1 both rules give the same y, so that is where the two graphs <b>intersect</b>.</p>`
      )}
      ${tip('f(g(3)) and g(f(3)) are usually different, so read which function is on the inside.')}`,

    // y10-10A Q8, Q13: testing a property such as f(a) = f(-a)
    // method: Example 1c, 10A (replace x with a letter)
    'y10-10a-props': `
      <p class="hp-tag">Worked example: test some statements for <b>f(x) = 3x + 2</b> and <b>g(x) = x² − 5</b>.</p>
      ${steps(
        `<p><strong>Work out each side separately, replacing x with the letter.</strong> Is f(2a) = 2f(a)?</p>
         ${sum('f(2a) = 3(2a) + 2 = 6a + 2<br>2f(a) = 2(3a + 2) = 6a + 4')}
         <p>The sides are different, so the statement is <b>false</b>.</p>`,
        `<p><strong>Is g(a) = g(−a)?</strong></p>
         ${sum('g(a) = a² − 5<br>g(−a) = (−a)² − 5 = a² − 5')}
         <p>Always equal, so <b>true</b>. When g(a) = g(−a) the graph is <b>symmetric about the y-axis</b>.</p>`,
        `<p><strong>Is f(a) + f(b) = f(a + b)?</strong></p>
         ${sum('f(a) + f(b) = 3a + 2 + 3b + 2 = 3a + 3b + 4<br>f(a + b) = 3(a + b) + 2 = 3a + 3b + 2')}
         <p>Different, so <b>false</b>.</p>`
      )}
      <p><strong>A rule with x² underneath:</strong> for h(x) = x² + 4/x², h(−4) = 16 + 4/16 = 65/4. x = 0 can never be used, because 4/0 is undefined.</p>
      ${tip('If you are unsure, try numbers: a = 1 and b = 2. One case where the two sides differ is enough to say false.')}`,

    // y10-10A Q9: simplifying (f(x + h) - f(x))/h
    // method: no worked example in 10A; replace x with x + h as in Example 1c, then expand and simplify
    'y10-10a-diffq': `
      <p class="hp-tag">Worked example: for <b>f(x) = x² + 5x − 1</b>, simplify <b>(f(x + h) − f(x)) / h</b>.</p>
      ${steps(
        `<p><strong>Find f(x + h) by replacing every x with (x + h).</strong></p>
         ${sum('f(x + h) = (x + h)² + 5(x + h) − 1<br>= x² + 2xh + h² + 5x + 5h − 1')}`,
        `<p><strong>Subtract f(x).</strong> The x², 5x and −1 all cancel.</p>
         ${sum('f(x + h) − f(x) = 2xh + h² + 5h')}`,
        `<p><strong>Divide every term by h.</strong></p>
         ${sum('(2xh + h² + 5h) / h = 2x + h + 5')}
         ${ans('2x+h+5')}`
      )}
      ${tip('Put f(x) in brackets when you subtract it, so every sign changes. Every term left should contain h before you divide.')}`,

    // y10-10A Q11, Q12: x-values that are not allowed
    // method: no worked example in 10A; Key ideas (domain) with "no dividing by zero" and "no square root of a negative"
    'y10-10a-not-allowed': `
      <p class="hp-tag">Worked example: which x is not allowed in <b>f(x) = 6/(2x − 7)</b>? What is the domain of <b>y = √(x + 1)</b> and of <b>y = √(8 − x)</b>?</p>
      ${steps(
        `<p><strong>Division by zero is undefined.</strong> Set the bottom equal to 0 and solve. That x is the one not allowed.</p>
         ${sum('2x − 7 = 0<br>2x = 7, so x = 7/2')}
         ${ans('7/2')}`,
        `<p><strong>You cannot square root a negative.</strong> The inside must be 0 or more.</p>
         ${sum('x + 1 ≥ 0, so x ≥ −1')}
         ${ans('x>=-1')}`,
        `<p><strong>Watch the sign of x inside.</strong></p>
         ${sum('8 − x ≥ 0<br>8 ≥ x, so x ≤ 8')}
         ${ans('x<=8')}`
      )}
      ${tip('For a square root the answer is an inequality, like x >= -1. Check with a number: x = 9 gives √(−1) in the last one, so x ≤ 8 is right.')}`,

    // y10-10A Q14: hybrid functions
    // method: no worked example in 10A; choose the rule whose part of the domain contains x, then substitute
    'y10-10a-hybrid': `
      <p class="hp-tag">Worked example: f(x) = x + 2 for x ≥ 1, and f(x) = 5 − x for x &lt; 1.</p>
      ${sk({ x: [-2, 4], y: [0, 7], sx: 0.9, sy: 0.6, curves: [[x => x + 2, [1, 4]], [x => 5 - x, [-2, 0.999]]], pts: [[1, 3, '(1, 3)', 'e'], [1, 4, '(1, 4) not included', 'ne']], alt: 'A hybrid graph: two straight pieces that do not join at x = 1' })}
      ${steps(
        `<p><strong>For each input, pick the rule whose condition it fits</strong>, then substitute.</p>
         ${sum('f(4): 4 ≥ 1, so f(4) = 4 + 2 = 6<br>f(1): 1 ≥ 1, so f(1) = 1 + 2 = 3<br>f(−2): −2 &lt; 1, so f(−2) = 5 − (−2) = 7')}`,
        `<p><strong>Then combine.</strong></p>
         ${sum('f(4) − 2f(1) + 3f(−2) = 6 − 6 + 21 = 21')}
         ${ans('21')}`,
        `<p><strong>Continuous?</strong> At x = 1 the right piece starts at 3, but the left piece heads towards 5 − 1 = 4. There is a jump, so this function is <b>discontinuous</b>. Its range: the right piece gives y ≥ 3 and the left piece gives y &gt; 4, so all together y ≥ 3.</p>`
      )}
      ${tip('Read the boundary carefully: ≥ includes the end value and &lt; does not. A value like x = 1 belongs to exactly one rule.')}`,

    // =====================================================================
    // Year 10 10B Introducing polynomials
    // =====================================================================
    // y10-10B Q1, Q9: is it a polynomial, and its degree
    // method: Example 4, 10B (deciding if an expression is a polynomial, and its degree)
    'y10-10b-degree': `
      <p>A <b>polynomial</b> only has powers of x that are whole numbers: x⁰, x¹, x², x³, ... The <b>degree</b> is the highest power.</p>
      <p class="hp-tag">Worked example: are these polynomials? Give the degree of any that are.</p>
      ${steps(
        `<p><strong>6x³ − x + 2x⁵.</strong> The powers are 3, 1 and 5, all whole numbers. The highest is 5.</p>
         ${ans('5')}`,
        `<p><strong>5x² + 3/x − 1.</strong> Rewrite each term as a power of x: 3/x = 3x<sup>−1</sup>. A power of −1 is not allowed.</p>
         ${ans('no')}`,
        `<p><strong>x³ + √x.</strong> √x = x<sup>1/2</sup>. A fraction power is not allowed either.</p>
         ${ans('no')}`
      )}
      <p><strong>Counting terms:</strong> a degree 3 polynomial can have at most an x³, x², x and number term: 4 terms. It must keep its x³ term, but the others can be missing.</p>
      ${tip('Look out for x under a fraction line or a root sign: those are the terms that stop it being a polynomial. Type the degree as a number, or type no.')}`,

    // y10-10B Q2, Q3, Q4, Q6, Q8: evaluating P(k)
    // method: Example 5, 10B (evaluating polynomials)
    'y10-10b-evaluate': `
      <p class="hp-tag">Worked example: if <b>P(x) = x³ + 4x² − 2x − 1</b>, find P(10) and P(−4).</p>
      ${steps(
        `<p><strong>Substitute x = 10, with brackets, and work out each power first.</strong></p>
         ${sum('P(10) = (10)³ + 4(10)² − 2(10) − 1<br>= 1000 + 400 − 20 − 1 = 1379')}
         ${ans('1379')}`,
        `<p><strong>A negative input: watch the signs.</strong> (−4)³ = −64 and (−4)² = 16.</p>
         ${sum('P(−4) = (−4)³ + 4(−4)² − 2(−4) − 1<br>= −64 + 64 + 8 − 1 = 7')}
         ${ans('7')}`,
        `<p><strong>Already factorised? Substitute into each bracket and multiply.</strong> For P(x) = (x − 2)(x + 5)(x + 1):</p>
         ${sum('P(−4) = (−6)(1)(−3) = 18')}`
      )}
      <p><strong>In a story</strong>, the output means something. If P(x) is a height above a platform, a negative P(x) means below the platform.</p>
      ${tip('An odd power of a negative is negative, an even power is positive. Do the powers before multiplying by the number in front.')}`,

    // y10-10B Q5: combining values of two polynomials
    // method: Example 5, 10B (evaluate each polynomial, then combine)
    'y10-10b-combine': `
      <p class="hp-tag">Worked example: <b>P(x) = x³ + x</b> and <b>Q(x) = 3 − x</b>. Find P(2) + Q(−1) and (P(1))² − (Q(2))³.</p>
      ${steps(
        `<p><strong>Evaluate each part on its own.</strong></p>
         ${sum('P(2) = 8 + 2 = 10<br>Q(−1) = 3 − (−1) = 4')}`,
        `<p><strong>Then combine as the question says.</strong></p>
         ${sum('P(2) + Q(−1) = 10 + 4 = 14')}
         ${ans('14')}`,
        `<p><strong>Powers apply to the whole value.</strong></p>
         ${sum('P(1) = 1 + 1 = 2, &nbsp; Q(2) = 3 − 2 = 1<br>(P(1))² − (Q(2))³ = 2² − 1³ = 4 − 1 = 3')}
         ${ans('3')}`
      )}
      ${tip('Write each value down before combining. A minus in front of a negative value turns into a plus.')}`,

    // y10-10B Q7: coefficient of x squared in a fraction
    // method: Key ideas, 10B (coefficients); split the fraction term by term
    'y10-10b-coeff': `
      <p>The <b>coefficient</b> of x² is the number multiplying x².</p>
      <p class="hp-tag">Worked example: find the coefficient of x² in <b>P(x) = (5x³ − 2x² + 8)/3</b> and in <b>(x² − 4x³)/(−2)</b>.</p>
      ${steps(
        `<p><strong>Divide every term on top by the bottom.</strong></p>
         ${sum('(5x³ − 2x² + 8)/3 = (5/3)x³ − (2/3)x² + 8/3')}`,
        `<p><strong>Read off the number with x², sign included.</strong></p>
         ${ans('-2/3')}`,
        `<p><strong>A negative bottom flips every sign.</strong></p>
         ${sum('(x² − 4x³)/(−2) = −(1/2)x² + 2x³')}
         ${ans('-1/2')}`
      )}
      ${tip('Type the coefficient as a fraction in simplest form, like -2/3.')}`,

    // y10-10B Q10: evaluating at a fraction
    // method: Example 5, 10B (evaluating polynomials), with fractions
    'y10-10b-fractions': `
      <p class="hp-tag">Worked example: if <b>P(x) = x³ + 3x² − 2x</b>, find P(1/5) and P(−3/2) without a calculator.</p>
      ${steps(
        `<p><strong>Substitute and work out each power.</strong> Cube or square the top and the bottom.</p>
         ${sum('P(1/5) = (1/5)³ + 3(1/5)² − 2(1/5)<br>= 1/125 + 3/25 − 2/5')}`,
        `<p><strong>Use a common denominator.</strong> Here it is 125.</p>
         ${sum('= 1/125 + 15/125 − 50/125 = −34/125')}
         ${ans('-34/125')}`,
        `<p><strong>Negative fractions: odd power negative, even power positive.</strong></p>
         ${sum('P(−3/2) = −27/8 + 3(9/4) + 3<br>= −27/8 + 54/8 + 24/8 = 51/8')}
         ${ans('51/8')}`
      )}
      ${tip('Type the answer as one fraction, like -34/125. Adding two values? Find each one first, then add the fractions.')}`,

    // y10-10B Q11: P(k), P(2a), P(-a) and so on
    // method: Key ideas function notation, 10B, as in Example 1c, 10A (replace x with the expression)
    'y10-10b-algebra': `
      <p class="hp-tag">Worked example: if <b>P(x) = 2x³ + x² − 5x + 1</b>, find P(m) and P(−2a).</p>
      ${steps(
        `<p><strong>A single letter just replaces x.</strong></p>
         ${sum('P(m) = 2m³ + m² − 5m + 1')}`,
        `<p><strong>An expression goes in brackets.</strong> Power the whole bracket: (−2a)³ = −8a³ and (−2a)² = 4a².</p>
         ${sum('P(−2a) = 2(−2a)³ + (−2a)² − 5(−2a) + 1<br>= 2(−8a³) + 4a² + 10a + 1')}`,
        `<p><strong>Tidy up.</strong></p>
         ${sum('= −16a³ + 4a² + 10a + 1')}
         ${ans('-16a^3+4a^2+10a+1')}`
      )}
      <p><strong>Two letters?</strong> Each letter gets the power: (ab)³ = a³b³.</p>
      ${tip('Type powers with ^, like -16a^3 + 4a^2 + 10a + 1.')}`,

    // y10-10B Q12: finding an unknown coefficient
    // method: no worked example in 10B; substitute (Example 5) and solve the linear equation
    'y10-10b-find-b': `
      <p class="hp-tag">Worked example: <b>P(x) = x³ + 2x² + bx − 3</b> and P(2) = 5. Find b.</p>
      ${steps(
        `<p><strong>Substitute the x-value, leaving b as a letter.</strong></p>
         ${sum('P(2) = 8 + 8 + 2b − 3 = 13 + 2b')}`,
        `<p><strong>Set it equal to the given value and solve.</strong></p>
         ${sum('13 + 2b = 5<br>2b = −8, so b = −4')}
         ${ans('-4')}`,
        `<p><strong>Two unknowns need two facts.</strong> For P(x) = x³ + ax² + bx + 1 with P(1) = 4 and P(−1) = −4:</p>
         ${sum('1 + a + b + 1 = 4 → a + b = 2<br>−1 + a − b + 1 = −4 → a − b = −4<br>add: 2a = −2, so a = −1 and b = 3')}`
      )}
      ${tip('Check by putting your value back in: with b = −4, P(2) = 8 + 8 − 8 − 3 = 5 ✓.')}`,

    // =====================================================================
    // Year 10 10C Expanding and simplifying polynomials
    // =====================================================================
    // y10-10C Q1: a single term times a bracket
    // method: Example 6a, 10C (expanding using the index law)
    'y10-10c-monomial': `
      <p class="hp-tag">Worked example: expand <b>−4x²(x³ − 2x)</b> and <b>x⁴(3 − x²)</b>.</p>
      ${steps(
        `<p><strong>Multiply the outside term by each term inside.</strong> Multiply the numbers and add the powers: x² × x³ = x⁵.</p>
         ${sum('−4x² × x³ = −4x⁵<br>−4x² × (−2x) = +8x³')}
         ${ans('-4x^5+8x^3')}`,
        `<p><strong>Same again.</strong></p>
         ${sum('x⁴ × 3 = 3x⁴, &nbsp; x⁴ × (−x²) = −x⁶')}
         ${ans('-x^6+3x^4')}`
      )}
      ${tip('A negative outside changes the sign of every term inside. Type powers with ^; the order of the terms does not matter.')}`,

    // y10-10C Q2: a bracket times a bracket
    // method: Example 6b, 10C (each term of the first bracket times the second bracket)
    'y10-10c-two': `
      <p class="hp-tag">Worked example: expand <b>(x³ + 2)(x² − x + 4)</b>, then <b>(x² − 2x)(x² + 3x − 1)</b>.</p>
      ${steps(
        `<p><strong>Multiply each term in the first bracket by the whole second bracket.</strong></p>
         ${sum('x³(x² − x + 4) + 2(x² − x + 4)<br>= x⁵ − x⁴ + 4x³ + 2x² − 2x + 8')}
         <p>No two terms have the same power, so nothing collects.</p>
         ${ans('x^5-x^4+4x^3+2x^2-2x+8')}`,
        `<p><strong>When powers match, collect them.</strong></p>
         ${sum('x²(x² + 3x − 1) − 2x(x² + 3x − 1)<br>= x⁴ + 3x³ − x² − 2x³ − 6x² + 2x<br>= x⁴ + x³ − 7x² + 2x')}
         ${ans('x^4+x^3-7x^2+2x')}`
      )}
      ${tip('2 terms times 3 terms gives 6 products before collecting. Count them so none go missing.')}`,

    // y10-10C Q3, Q4, Q6: P(x) times Q(x), and squares
    // method: Example 7, 10C (expanding P(x) × Q(x) and (Q(x))²)
    'y10-10c-pq': `
      <p class="hp-tag">Worked example: <b>P(x) = x² − x + 4</b> and <b>Q(x) = x³ − 2x + 1</b>. Expand P(x) × Q(x) and (P(x))².</p>
      ${steps(
        `<p><strong>Write both polynomials in brackets.</strong> Each term of the first multiplies the whole second.</p>
         ${sum('(x² − x + 4)(x³ − 2x + 1)<br>= x⁵ − 2x³ + x² − x⁴ + 2x² − x + 4x³ − 8x + 4')}`,
        `<p><strong>Collect like terms, highest power first.</strong></p>
         ${sum('= x⁵ − x⁴ + 2x³ + 3x² − 9x + 4')}
         ${ans('x^5-x^4+2x^3+3x^2-9x+4')}`,
        `<p><strong>(P(x))² means P(x) × P(x).</strong> 3 terms times 3 terms gives 9 products.</p>
         ${sum('(x² − x + 4)(x² − x + 4)<br>= x⁴ − x³ + 4x² − x³ + x² − 4x + 4x² − 4x + 16<br>= x⁴ − 2x³ + 9x² − 8x + 16')}
         ${ans('x^4-2x^3+9x^2-8x+16')}`
      )}
      ${tip('Squaring is not just squaring each term: (x² − x + 4)² is not x⁴ + x² + 16. Check with x = 1: P(1) = 4, and 1 − 2 + 9 − 8 + 16 = 16 = 4² ✓.')}`,

    // y10-10C Q5, Q7: adding, subtracting and combining polynomials
    // method: Example 7, 10C, plus collecting like terms (Key ideas)
    'y10-10c-combine': `
      <p class="hp-tag">Worked example: <b>P(x) = x² + 3x − 1</b> and <b>Q(x) = 2x³ − x</b>. Simplify 2P(x) − Q(x).</p>
      ${steps(
        `<p><strong>Replace each name with its polynomial, in brackets.</strong></p>
         ${sum('2(x² + 3x − 1) − (2x³ − x)')}`,
        `<p><strong>Expand.</strong> The minus in front of the second bracket changes both of its signs.</p>
         ${sum('2x² + 6x − 2 − 2x³ + x')}`,
        `<p><strong>Collect like terms.</strong></p>
         ${sum('= −2x³ + 2x² + 7x − 2')}
         ${ans('-2x^3+2x^2+7x-2')}`
      )}
      <p><strong>A difference of two squares of brackets:</strong> expand each one fully, then subtract the second in brackets. (x² − 3)² − (x² + 1)² = x⁴ − 6x² + 9 − (x⁴ + 2x² + 1) = −8x² + 8.</p>
      ${tip('For 1 − P(x)Q(x), expand P(x)Q(x) first and keep it in brackets, then take it away from 1.')}`,

    // y10-10C Q8, Q9, Q10: the degree of a product or sum
    // method: Key ideas, 10C (multiply every term; the highest powers multiply to give the new degree)
    'y10-10c-degree': `
      <p class="hp-tag">Worked example: P(x) is quadratic (degree 2) and Q(x) is quartic (degree 4). What is the degree of P(x) × Q(x)?</p>
      ${steps(
        `<p><strong>Only the highest-power terms matter.</strong> When you expand, the biggest power comes from multiplying them.</p>
         ${sum('x² × x⁴ = x⁶')}
         ${ans('6')}`,
        `<p><strong>Adding or subtracting does not raise the power.</strong> If P(x) has degree 5 and Q(x) has degree 3, P(x) + Q(x) still has an x⁵ term, so degree 5.</p>`,
        `<p><strong>Powers of a polynomial multiply the degree.</strong> A degree 5 polynomial squared: x⁵ × x⁵ = x¹⁰, degree 10. A degree 3 polynomial cubed: degree 9.</p>`
      )}
      <p><strong>Order:</strong> P(x)Q(x) and Q(x)P(x) give the same expansion, because a × b = b × a for any numbers. Try x = 2 to see it.</p>
      ${tip('For letters, the same rules hold: degrees add when you multiply, and doubling or tripling comes from squaring or cubing.')}`,

    // y10-10C Q11: three brackets
    // method: Example 6b, 10C (expand two brackets, then multiply by the third)
    'y10-10c-three': `
      <p class="hp-tag">Worked example: expand <b>(x − 3)(x + 4)(2x − 1)</b>.</p>
      ${steps(
        `<p><strong>Expand any two brackets first.</strong></p>
         ${sum('(x − 3)(x + 4) = x² + 4x − 3x − 12 = x² + x − 12')}`,
        `<p><strong>Multiply that answer by the third bracket.</strong></p>
         ${sum('(x² + x − 12)(2x − 1)<br>= 2x³ − x² + 2x² − x − 24x + 12')}`,
        `<p><strong>Collect like terms.</strong></p>
         ${sum('= 2x³ + x² − 25x + 12')}
         ${ans('2x^3+x^2-25x+12')}`
      )}
      <p><strong>A single term in front?</strong> Leave it until last: x²(x + 1)(x − 5) = x²(x² − 4x − 5) = x⁴ − 4x³ − 5x².</p>
      ${tip('Check with x = 1: (−2)(5)(1) = −10, and 2 + 1 − 25 + 12 = −10 ✓.')}`,

    // =====================================================================
    // Year 10 10D Division of polynomials
    // =====================================================================
    // y10-10D Q1, Q2, Q3, Q4, Q5: long division by (x - a) or (x + a)
    // method: Example 8, 10D (dividing polynomials by long division)
    'y10-10d-divide': `
      <p class="hp-tag">Worked example: divide <b>P(x) = 2x³ − 5x² + 4x − 7</b> by <b>(x − 3)</b>.</p>
      ${ldiv('x − 3', ['', '2x²', '+ x', '+ 7'], ['2x³', '− 5x²', '+ 4x', '− 7'], [
        { c: ['2x³', '− 6x²', '', ''], note: '2x²(x − 3)' },
        { c: ['', 'x²', '+ 4x', ''], rule: [0, 1] },
        { c: ['', 'x²', '− 3x', ''], note: 'x(x − 3)' },
        { c: ['', '', '7x', '− 7'], rule: [1, 2] },
        { c: ['', '', '7x', '− 21'], note: '7(x − 3)' },
        { c: ['', '', '', '14'], rule: [2, 3] }
      ])}
      ${steps(
        `<p><strong>Divide x into the leading term.</strong> 2x³ ÷ x = 2x². Write it above, multiply it by (x − 3) and subtract.</p>
         ${sum('(2x³ − 5x²) − (2x³ − 6x²) = x²')}`,
        `<p><strong>Bring down the next term and repeat.</strong> x² ÷ x = x, then 7x ÷ x = 7. Each time: divide, multiply, subtract.</p>
         ${sum('(x² + 4x) − (x² − 3x) = 7x<br>(7x − 7) − (7x − 21) = 14')}`,
        `<p><strong>What is left is the remainder.</strong></p>
         ${sum('2x³ − 5x² + 4x − 7 = (x − 3)(2x² + x + 7) + 14')}
         ${ans('2x^2+x+7')} &nbsp; ${ans('14')}`
      )}
      ${tip('Subtracting a negative is the usual slip: −5x² − (−6x²) = +x². Type the quotient with ^, like 2x^2 + x + 7, and the remainder as a number.')}`,

    // y10-10D Q6, Q7: higher degree, and missing powers
    // method: Example 8, 10D (long division), with 0 terms for missing powers
    'y10-10d-missing': `
      <p class="hp-tag">Worked example: divide <b>x³ − 7x + 2</b> by <b>(x − 3)</b>.</p>
      ${ldiv('x − 3', ['', 'x²', '+ 3x', '+ 2'], ['x³', '+ 0x²', '− 7x', '+ 2'], [
        { c: ['x³', '− 3x²', '', ''], note: 'x²(x − 3)' },
        { c: ['', '3x²', '− 7x', ''], rule: [0, 1] },
        { c: ['', '3x²', '− 9x', ''], note: '3x(x − 3)' },
        { c: ['', '', '2x', '+ 2'], rule: [1, 2] },
        { c: ['', '', '2x', '− 6'], note: '2(x − 3)' },
        { c: ['', '', '', '8'], rule: [2, 3] }
      ])}
      ${steps(
        `<p><strong>Fill any missing power with a zero term.</strong> There is no x², so write + 0x². This keeps the columns lined up.</p>`,
        `<p><strong>Divide, multiply, subtract, bring down</strong>, exactly as before.</p>
         ${sum('x³ ÷ x = x², &nbsp; 3x² ÷ x = 3x, &nbsp; 2x ÷ x = 2')}`,
        `<p><strong>Write the result.</strong></p>
         ${sum('x³ − 7x + 2 = (x − 3)(x² + 3x + 2) + 8')}
         ${ans('x^2+3x+2')} &nbsp; ${ans('8')}`
      )}
      <p><strong>Degree 4 or 5?</strong> The method is the same, just with more rounds. The quotient starts one power lower: x⁴ ÷ x = x³.</p>
      ${tip('x⁴ − 3 has three missing powers: write it as x⁴ + 0x³ + 0x² + 0x − 3 before you start.')}`,

    // y10-10D Q8, Q9: a remainder of zero
    // method: Example 8, 10D (long division); a zero remainder means it divides exactly
    'y10-10d-zero': `
      <p>If the remainder is 0, the divisor goes into P(x) exactly.</p>
      <p class="hp-tag">Worked example: find the three values of k for which <b>P(x) = x³ − 7x − 6</b> divided by (x − k) leaves remainder 0.</p>
      ${steps(
        `<p><strong>Try a value of k that divides the constant term</strong> (here −6, so try ±1, ±2, ±3). Divide by (x + 1), which is k = −1:</p>
         ${ldiv('x + 1', ['', 'x²', '− x', '− 6'], ['x³', '+ 0x²', '− 7x', '− 6'], [
           { c: ['x³', '+ x²', '', ''] },
           { c: ['', '−x²', '− 7x', ''], rule: [0, 1] },
           { c: ['', '−x²', '− x', ''] },
           { c: ['', '', '−6x', '− 6'], rule: [1, 2] },
           { c: ['', '', '−6x', '− 6'] },
           { c: ['', '', '', '0'], rule: [2, 3] }
         ])}
         <p>Remainder 0, so k = −1 works.</p>`,
        `<p><strong>Factorise the quotient to find the rest.</strong></p>
         ${sum('x² − x − 6 = (x − 3)(x + 2)')}
         <p>So (x − 3) and (x + 2) also divide exactly: k = 3 and k = −2.</p>
         ${ans('-1, 3, -2')}`
      )}
      ${tip('To show a remainder is 0, set out the whole division: the last subtraction must give 0. Type the k values separated by commas.')}`,

    // y10-10D Q10, Q11: dividing by (2x - 1) and similar
    // method: Example 8, 10D (long division; divide by the leading term 2x each time)
    'y10-10d-linear2': `
      <p class="hp-tag">Worked example: find the remainder when <b>2x³ + 3x² − x + 4</b> is divided by <b>(2x − 1)</b>.</p>
      ${ldiv('2x − 1', ['', 'x²', '+ 2x', '+ 1/2'], ['2x³', '+ 3x²', '− x', '+ 4'], [
        { c: ['2x³', '− x²', '', ''], note: 'x²(2x − 1)' },
        { c: ['', '4x²', '− x', ''], rule: [0, 1] },
        { c: ['', '4x²', '− 2x', ''], note: '2x(2x − 1)' },
        { c: ['', '', 'x', '+ 4'], rule: [1, 2] },
        { c: ['', '', 'x', '− 1/2'], note: '½(2x − 1)' },
        { c: ['', '', '', '9/2'], rule: [2, 3] }
      ])}
      ${steps(
        `<p><strong>Divide by the leading term 2x each time.</strong></p>
         ${sum('2x³ ÷ 2x = x², &nbsp; 4x² ÷ 2x = 2x, &nbsp; x ÷ 2x = 1/2')}`,
        `<p><strong>Multiply and subtract as usual.</strong> The last round gives a fraction.</p>
         ${sum('(x + 4) − (x − 1/2) = 4 + 1/2 = 9/2')}
         ${ans('9/2')}`
      )}
      <p><strong>A negative leading term, like (−3x − 2)?</strong> Divide by −3x each time. The signs flip, but the steps do not change.</p>
      ${tip('Fractions in the quotient are fine. Type the remainder as a fraction, like 9/2.')}`,

    // y10-10D Q12: dividing by a quadratic
    // method: Example 8, 10D (long division); stop when the remainder's degree is below the divisor's (Key ideas)
    'y10-10d-quad': `
      <p class="hp-tag">Worked example: divide <b>x³ + 3x² − 2x + 5</b> by <b>(x² + 1)</b>.</p>
      ${ldiv('x² + 0x + 1', ['', '', 'x', '+ 3'], ['x³', '+ 3x²', '− 2x', '+ 5'], [
        { c: ['x³', '+ 0x²', '+ x', ''], note: 'x(x² + 1)' },
        { c: ['', '3x²', '− 3x', '+ 5'], rule: [0, 2] },
        { c: ['', '3x²', '+ 0x', '+ 3'], note: '3(x² + 1)' },
        { c: ['', '', '−3x', '+ 2'], rule: [1, 3] }
      ])}
      ${steps(
        `<p><strong>Divide the leading terms.</strong> x³ ÷ x² = x. Multiply x by the whole divisor and subtract.</p>`,
        `<p><strong>Repeat.</strong> 3x² ÷ x² = 3. Multiply and subtract.</p>`,
        `<p><strong>Stop when what is left has a lower degree than the divisor.</strong> −3x + 2 has degree 1, less than 2, so it is the remainder.</p>
         ${sum('x³ + 3x² − 2x + 5 = (x² + 1)(x + 3) + (−3x + 2)')}
         ${ans('x+3')} &nbsp; ${ans('-3x+2')}`
      )}
      ${tip('Write the divisor with a 0x term so the columns line up. The remainder can contain x here; type it like -3x + 2.')}`,

    // =====================================================================
    // Year 10 10E The remainder and factor theorems
    // =====================================================================
    // y10-10E Q1, Q2: the remainder theorem
    // method: Example 9, 10E (using the remainder theorem)
    'y10-10e-remainder': `
      <p><b>Remainder theorem:</b> when P(x) is divided by (x − a), the remainder is P(a). No long division needed.</p>
      <p class="hp-tag">Worked example: find the remainder when <b>P(x) = x³ + 2x² − 4x + 1</b> is divided by (x − 5), then by (x + 5).</p>
      ${steps(
        `<p><strong>For (x − 5), substitute x = 5.</strong></p>
         ${sum('P(5) = (5)³ + 2(5)² − 4(5) + 1<br>= 125 + 50 − 20 + 1 = 156')}
         ${ans('156')}`,
        `<p><strong>For (x + 5), substitute x = −5.</strong> The sign flips.</p>
         ${sum('P(−5) = (−5)³ + 2(−5)² − 4(−5) + 1<br>= −125 + 50 + 20 + 1 = −54')}
         ${ans('-54')}`
      )}
      ${flow(['divide by', 'x − 5'], ['substitute', 'x = 5'], ['remainder', 'P(5)'])}
      ${tip('The number you substitute makes the bracket zero: x + 5 = 0 when x = −5.')}`,

    // y10-10E Q3, Q4, Q5: the factor theorem
    // method: Example 10, 10E (finding a linear factor)
    'y10-10e-factor': `
      <p><b>Factor theorem:</b> if P(a) = 0, then (x − a) is a factor of P(x).</p>
      <p class="hp-tag">Worked example: is (x + 1) a factor of <b>P(x) = x³ − 3x² − 4x + 12</b>? Is (x − 2)?</p>
      ${steps(
        `<p><strong>(x + 1): find P(−1).</strong></p>
         ${sum('P(−1) = −1 − 3 + 4 + 12 = 12')}
         <p>The remainder is 12, not 0.</p>
         ${ans('Not a factor')}`,
        `<p><strong>(x − 2): find P(2).</strong></p>
         ${sum('P(2) = 8 − 12 − 8 + 12 = 0')}
         ${ans('Factor')}`,
        `<p><strong>Finding a factor yourself: trial and error.</strong> Try x-values that divide the constant term (12 here: ±1, ±2, ±3, ...) until one gives 0. P(2) = 0, so x − 2 is a factor.</p>`
      )}
      ${tip('If P(−4) = 0, the factor is x + 4, not x − 4. Type a factor like x - 2.')}`,

    // y10-10E Q6: all three linear factors
    // method: Example 10, 10E (factor theorem, repeated for each trial value)
    'y10-10e-all': `
      <p class="hp-tag">Worked example: find all three linear factors of <b>P(x) = x³ − 2x² − 11x + 12</b>.</p>
      ${steps(
        `<p><strong>List the trial values:</strong> the factors of 12, so ±1, ±2, ±3, ±4, ±6, ±12.</p>`,
        `<p><strong>Test them with the factor theorem until you find three zeros.</strong></p>
         ${sum('P(1) = 1 − 2 − 11 + 12 = 0 ✓<br>P(−1) = −1 − 2 + 11 + 12 = 20<br>P(2) = 8 − 8 − 22 + 12 = −10<br>P(−3) = −27 − 18 + 33 + 12 = 0 ✓<br>P(4) = 64 − 32 − 44 + 12 = 0 ✓')}`,
        `<p><strong>Write P(x) as the product.</strong></p>
         ${sum('P(x) = (x − 1)(x + 3)(x − 4)')}
         ${ans('(x-1)(x+3)(x-4)')}`
      )}
      ${tip('A cubic has at most three linear factors, so stop when you have three. Check: (−1) × 3 × (−4) = 12, the constant term ✓.')}`,

    // y10-10E Q7, Q8, Q9, Q10: finding k from a remainder
    // method: Example 11, 10E (applying the remainder theorem to find k)
    'y10-10e-find-k': `
      <p class="hp-tag">Worked example: find k so that <b>(x³ + 2x² − 3x + k) ÷ (x + 1)</b> has remainder 1.</p>
      ${steps(
        `<p><strong>The remainder is P(−1).</strong> Substitute, keeping k as a letter.</p>
         ${sum('P(−1) = (−1)³ + 2(−1)² − 3(−1) + k<br>= −1 + 2 + 3 + k = 4 + k')}`,
        `<p><strong>Set it equal to the remainder and solve.</strong></p>
         ${sum('4 + k = 1, so k = −3')}
         ${ans('-3')}`,
        `<p><strong>k can sit in front of an x.</strong> P(x) = x³ + kx² − 2x + 1 leaves remainder 13 when divided by (x − 2):</p>
         ${sum('P(2) = 8 + 4k − 4 + 1 = 4k + 5<br>4k + 5 = 13, so k = 2')}`
      )}
      <p><strong>"(x − a) is a factor"</strong> means the remainder is 0, so set P(a) = 0. For (x − 3) a factor of x³ − kx + 3: 27 − 3k + 3 = 0, so k = 10.</p>
      ${tip('Check by substituting your k back in: the remainder should come out exactly.')}`,

    // y10-10E Q11: two remainders, two unknowns
    // method: Example 11, 10E (remainder theorem for each fact), then simultaneous equations
    'y10-10e-sim': `
      <p class="hp-tag">Worked example: <b>P(x) = x³ + ax² + bx + 2</b>. The remainder is 4 when divided by (x − 1) and 10 when divided by (x + 1). Find a and b.</p>
      ${steps(
        `<p><strong>Turn each fact into an equation with the remainder theorem.</strong></p>
         ${sum('P(1) = 1 + a + b + 2 = 4 → a + b = 1<br>P(−1) = −1 + a − b + 2 = 10 → a − b = 9')}`,
        `<p><strong>Solve simultaneously.</strong> Adding gets rid of b.</p>
         ${sum('2a = 10, so a = 5<br>5 + b = 1, so b = −4')}
         ${ans('5')} &nbsp; ${ans('-4')}`
      )}
      ${tip('Check both facts: P(1) = 1 + 5 − 4 + 2 = 4 ✓ and P(−1) = −1 + 5 + 4 + 2 = 10 ✓.')}`,

    // =====================================================================
    // Year 10 10F Solving polynomial equations
    // =====================================================================
    // y10-10F Q1: the Null Factor Law with three brackets
    // method: Example 12, 10F (using the Null Factor Law)
    'y10-10f-nfl': `
      <p class="hp-tag">Worked example: solve <b>(x + 6)(3x − 2)(4x + 7) = 0</b>.</p>
      ${steps(
        `<p><strong>Null Factor Law:</strong> if a × b × c = 0, then one of them is 0. Set each bracket equal to 0.</p>
         ${sum('x + 6 = 0 &nbsp; or &nbsp; 3x − 2 = 0 &nbsp; or &nbsp; 4x + 7 = 0')}`,
        `<p><strong>Solve each small equation.</strong></p>
         ${sum('x = −6 &nbsp; or &nbsp; 3x = 2 &nbsp; or &nbsp; 4x = −7<br>x = −6 &nbsp; or &nbsp; x = 2/3 &nbsp; or &nbsp; x = −7/4')}
         ${ans('-6, 2/3, -7/4')}`
      )}
      ${tip('Type all the solutions separated by commas, in any order, with fractions like 2/3.')}`,

    // y10-10F Q2, Q4, Q5, Q10: factorise with the factor theorem, then solve
    // method: Example 13, 10F (factor theorem, long division, factorise the quotient, Null Factor Law)
    'y10-10f-solve': `
      <p class="hp-tag">Worked example: solve <b>x³ + 4x² + x − 6 = 0</b>.</p>
      ${steps(
        `<p><strong>Find a factor with the factor theorem.</strong> Start with P(1), then P(−1), then factors of the constant.</p>
         ${sum('P(1) = 1 + 4 + 1 − 6 = 0, so (x − 1) is a factor')}`,
        `<p><strong>Divide by that factor.</strong> The remainder must be 0.</p>
         ${ldiv('x − 1', ['', 'x²', '+ 5x', '+ 6'], ['x³', '+ 4x²', '+ x', '− 6'], [
           { c: ['x³', '− x²', '', ''] },
           { c: ['', '5x²', '+ x', ''], rule: [0, 1] },
           { c: ['', '5x²', '− 5x', ''] },
           { c: ['', '', '6x', '− 6'], rule: [1, 2] },
           { c: ['', '', '6x', '− 6'] },
           { c: ['', '', '', '0'], rule: [2, 3] }
         ])}`,
        `<p><strong>Factorise the quotient and use the Null Factor Law.</strong></p>
         ${sum('(x − 1)(x² + 5x + 6) = 0<br>(x − 1)(x + 2)(x + 3) = 0<br>x = 1, −2 or −3')}
         ${ans('1, -2, -3')}`
      )}
      <p><strong>Common factor first?</strong> 3x³ + 12x² + 3x − 18 = 3(x³ + 4x² + x − 6), then carry on as above. <strong>A quartic?</strong> Find one factor, divide to get a cubic, then repeat.</p>
      ${tip('List each different solution once, separated by commas. A repeated bracket like (x − 4)² gives just one solution.')}`,

    // y10-10F Q3: a linear factor times a quadratic that will not factorise
    // method: Null Factor Law (Example 12, 10F), then the quadratic formula from Chapter 7; no 10F example of this
    'y10-10f-formula': `
      <p class="hp-tag">Worked example: solve <b>(x + 1)(x² − 6x + 4) = 0</b>. Give exact answers.</p>
      ${steps(
        `<p><strong>Null Factor Law on the linear bracket.</strong></p>
         ${sum('x + 1 = 0, so x = −1')}`,
        `<p><strong>The quadratic does not factorise, so use the quadratic formula.</strong></p>
         ${sum('x = (6 ± √(36 − 16)) / 2 = (6 ± √20) / 2<br>= (6 ± 2√5) / 2 = 3 ± √5')}
         ${ans('-1, 3+sqrt(5), 3-sqrt(5)')}`,
        `<p><strong>Negative discriminant? No more solutions.</strong> In (x − 4)(x² + 2x + 6) = 0, b² − 4ac = 4 − 24 = −20, so the only solution is x = 4.</p>`
      )}
      ${tip('Type square roots with sqrt, like 3 + sqrt(5), and separate the solutions with commas.')}`,

    // y10-10F Q6, Q8, Q9: how many solutions?
    // method: no worked example in 10F; Key ideas (factorise and use the Null Factor Law), counting the solutions
    'y10-10f-count': `
      <p class="hp-tag">Worked example: how many solutions does <b>x³ + 3x = 0</b> have?</p>
      ${steps(
        `<p><strong>Factorise.</strong></p>
         ${sum('x(x² + 3) = 0')}`,
        `<p><strong>Solve each factor.</strong> x = 0 works. But x² + 3 = 0 needs x² = −3, and no real number squares to a negative.</p>
         ${ans('1')}`,
        `<p><strong>Most a polynomial can have:</strong> one solution per factor, so at most as many as its degree. A cubic has at most 3, but may have fewer.</p>`
      )}
      ${tip('For a quadratic bracket, check the discriminant b² − 4ac. Negative means that bracket gives no solutions.')}`,

    // y10-10F Q7: factorising with a common factor, no division needed
    // method: Key ideas, 10F (factorise, then the Null Factor Law)
    'y10-10f-common': `
      <p class="hp-tag">Worked example: solve <b>x³ − 5x² = 0</b> and <b>x³ + x² − 12x = 0</b>.</p>
      ${steps(
        `<p><strong>Take out the highest common factor.</strong></p>
         ${sum('x³ − 5x² = x²(x − 5) = 0<br>x² = 0 or x − 5 = 0, so x = 0 or 5')}
         ${ans('0, 5')}`,
        `<p><strong>Take out x, then factorise the quadratic that is left.</strong></p>
         ${sum('x(x² + x − 12) = 0<br>x(x + 4)(x − 3) = 0, so x = 0, −4 or 3')}
         ${ans('0, -4, 3')}`
      )}
      <p><strong>Bigger powers:</strong> 2x⁵ − 8x⁴ + 8x³ = 2x³(x² − 4x + 4) = 2x³(x − 2)², so x = 0 or 2.</p>
      ${tip('Never divide both sides by x: you lose the solution x = 0. Factorise it out instead.')}`,

    // =====================================================================
    // Year 10 10G Graphing cubic functions
    // =====================================================================
    // y10-10G Q1, Q3, Q9: solving ax³ = d and a(x + b)³ = d exactly
    // method: Example 14a, 14b, 10G (solving simple cubic equations)
    'y10-10g-cube-root': `
      <p class="hp-tag">Worked example: solve <b>x³ = 1331</b>, <b>−2x³ = 1458</b> and <b>2x³ − 3 = 19</b>.</p>
      ${steps(
        `<p><strong>Take the cube root of both sides.</strong></p>
         ${sum('x = ∛1331 = 11, &nbsp; since 11 × 11 × 11 = 1331')}
         ${ans('11')}`,
        `<p><strong>Get x³ on its own first</strong>, then cube root. A negative has a negative cube root.</p>
         ${sum('−2x³ = 1458<br>x³ = −729<br>x = ∛(−729) = −9')}
         ${ans('-9')}`,
        `<p><strong>Not a perfect cube? Leave it exact.</strong></p>
         ${sum('2x³ = 22<br>x³ = 11<br>x = ∛11')}
         ${ans('cbrt(11)')}`
      )}
      <p><strong>Fractions:</strong> cube root the top and the bottom. x³ = 1/729 gives x = 1/9.</p>
      <p><strong>A bracket cubed:</strong> cube root first, then solve. (x + 5)³ = 1331 gives x + 5 = 11, so x = 6.</p>
      ${tip('Type a cube root as cbrt, like cbrt(11) or -cbrt(4). A cubic like this has exactly one solution.')}`,

    // y10-10G Q2, Q8: solving and rounding to one decimal place
    // method: Example 14c, 10G (solve for x³ first, then the cube root with a calculator)
    'y10-10g-1dp': `
      <p class="hp-tag">Worked example: solve <b>5x³ − 4 = 96</b> and <b>7 − 2x³ = 87</b>, to one decimal place.</p>
      ${steps(
        `<p><strong>Undo the adding first, then the multiplying.</strong></p>
         ${sum('5x³ − 4 = 96<br>5x³ = 100<br>x³ = 20')}`,
        `<p><strong>Cube root on a calculator and round.</strong></p>
         ${sum('x = ∛20 = 2.714... ≈ 2.7')}
         ${ans('2.7')}`,
        `<p><strong>Negative x³? The answer is negative.</strong></p>
         ${sum('−2x³ = 80<br>x³ = −40<br>x = ∛(−40) = −3.419... ≈ −3.4')}
         ${ans('-3.4')}`
      )}
      <p><strong>In a story:</strong> a model h = 2t³ (h in mm). When is h = 50 cm? Change units first: 50 cm = 500 mm, so 2t³ = 500, t³ = 250, t ≈ 6.3.</p>
      ${tip('Check the units match before you solve. If the answer is whole, like 3, type just 3.')}`,

    // y10-10G Q4: finding y on y = ax³
    // method: Example 15, 10G (marking the point at a given x on y = ax³)
    'y10-10g-evaluate': `
      <p class="hp-tag">Worked example: find the y-coordinate where x = 1.5 on <b>y = 4x³</b> and on <b>y = −(2/3)x³</b>.</p>
      ${sk({ x: [-1.3, 1.3], y: [-4, 4], sy: 0.7, curves: [[x => 2 * x * x * x, [-1.3, 1.3]]], pts: [[1, 2, '(1, 2)', 'e']], alt: 'The cubic y = 2x³ with the point (1, 2) marked' })}
      ${steps(
        `<p><strong>Cube the x-value first, then multiply.</strong></p>
         ${sum('y = 4 × 1.5³ = 4 × 3.375 = 13.5')}
         ${ans('13.5')}`,
        `<p><strong>A fraction or a negative in front works the same way.</strong></p>
         ${sum('y = −(2/3) × 3.375 = −2.25')}
         ${ans('-2.25')}`
      )}
      <p>The picture shows y = 2x³: at x = 1, y = 2 × 1 = 2. The number in front stretches the curve (bigger means steeper) and a minus sign flips it upside down.</p>
      ${tip('Do the power before the multiplying: 4 × 1.5³ is 4 × 3.375, not 6³.')}`,

    // y10-10G Q7, Q10, Q12: volume problems with cubes, spheres and cylinders
    // method: Example 14, 10G (solve for the cubed term, then take the cube root)
    'y10-10g-volume': `
      <p class="hp-tag">Worked example: a cube has volume 1728 cm³. Find its surface area.</p>
      ${steps(
        `<p><strong>Volume = side³, so solve x³ = 1728.</strong></p>
         ${sum('x = ∛1728 = 12 cm')}`,
        `<p><strong>Use the side length.</strong> A cube has 6 square faces.</p>
         ${sum('SA = 6 × 12² = 6 × 144 = 864 cm²')}
         ${ans('864')}`,
        `<p><strong>Formulas with π: get r³ on its own, then cube root.</strong> A sphere with volume 900 m³:</p>
         ${sum('(4/3)πr³ = 900<br>r³ = 900 × 3 ÷ (4π) = 675/π<br>r = ∛(675/π) ≈ 5.99 m')}`
      )}
      <p><strong>Exact answers:</strong> πr³ = 729 gives r³ = 729/π, so r = 9/∛π. Type it as 9/cbrt(pi). <strong>Scaling:</strong> if r is multiplied by a number k, r³ (and so the volume) is multiplied by k³.</p>
      ${tip('Large numbers like 1.6 × 10^11 go into the calculator as they are; round only at the end.')}`,

    // y10-10G Q5: intercepts of y = ax³ + k
    // method: Example 16a, 16b, 10G (sketching cubics with a vertical translation)
    'y10-10g-intercepts': `
      <p class="hp-tag">Worked example: find the intercepts of <b>y = x³ − 729</b> and of <b>y = −2x³ + 14</b>.</p>
      ${sk({ x: [-4, 10.4], y: [-800, 400], sx: 0.4, sy: 0.005, curves: [[x => x * x * x - 729, [-4, 10.4]]], pts: [[0, -729, '(0, −729)', 'sw'], [9, 0, '(9, 0)', 'nw']], alt: 'The cubic y = x³ − 729 crossing the x-axis at 9' })}
      ${steps(
        `<p><strong>y-intercept: put x = 0.</strong> For y = ax³ + k this is (0, k), which is also the point of inflection.</p>
         ${sum('y = (0)³ − 729 = −729, so (0, −729)')}`,
        `<p><strong>x-intercept: put y = 0 and solve.</strong></p>
         ${sum('x³ − 729 = 0<br>x³ = 729<br>x = ∛729 = 9')}
         ${ans('(9,0)')}`,
        `<p><strong>Not a perfect cube? Keep it exact.</strong></p>
         ${sum('−2x³ + 14 = 0<br>2x³ = 14<br>x³ = 7, so x = ∛7')}
         ${ans('(cbrt(7),0)')}`
      )}
      ${tip('Type a point as (x, y), with cbrt for a cube root, like (cbrt(7), 0).')}`,

    // y10-10G Q6, Q14: point of inflection and y-intercept of y = a(x - h)³ + k
    // method: Example 16c, 10G (horizontal translation, y-intercept from x = 0), with Key ideas for h and k
    'y10-10g-poi': `
      <p>y = a(x − h)³ + k is y = ax³ moved <b>h right</b> and <b>k up</b>. Its point of inflection is <b>(h, k)</b>.</p>
      <p class="hp-tag">Worked example: <b>y = (x + 9)³</b>, then <b>y = −2(x − 9)³ + 1</b>.</p>
      ${steps(
        `<p><strong>Read h from the bracket, with the sign flipped.</strong> (x + 9) means h = −9. There is no k, so k = 0.</p>
         ${sum('point of inflection (−9, 0)')}
         ${ans('(-9,0)')}`,
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = (0 + 9)³ = 729, so (0, 729)')}`,
        `<p><strong>With a and k as well:</strong> y = −2(x − 9)³ + 1 has h = 9 and k = 1, so its point of inflection is (9, 1). It is a negative cubic.</p>
         ${sum('y = −2(0 − 9)³ + 1<br>= −2 × (−729) + 1 = 1459')}
         ${ans('(0,1459)')}`
      )}
      ${tip('Work out the bracket, then the power, then multiply by a, then add k. Type points like (9, 1).')}`,

    // y10-10G Q11: (-x)² compared with -x²
    // method: no worked example in 10G; test with a number, as in the cube root Key ideas
    'y10-10g-odd-even': `
      <p class="hp-tag">Worked example: compare (−x)² with −x², and (−x)³ with −x³, using x = 11.</p>
      ${steps(
        `<p><strong>(−x)² squares the negative number. −x² squares first, then makes it negative.</strong></p>
         ${sum('(−11)² = 121, &nbsp; −11² = −121')}
         <p>Different, so (−x)² = −x² is not true in general.</p>`,
        `<p><strong>Now the cubes.</strong> Three negatives multiplied give a negative.</p>
         ${sum('(−11)³ = −1331, &nbsp; −11³ = −1331')}
         <p>The same, and this works for every x.</p>`,
        `<p><strong>The pattern:</strong> an odd number of negative signs multiplied is negative, an even number is positive. So it depends on whether the power is odd or even.</p>`
      )}
      ${tip('One counterexample is enough to show a statement is false.')}`,

    // y10-10G Q13: finding the rule y = ax³ + k from a graph
    // method: no worked example in 10G; Key ideas (k is the vertical shift), then substitute a point to find a
    'y10-10g-rule': `
      <p class="hp-tag">Worked example: a graph y = ax³ + k passes through (0, 1) and (1, 4). Find the rule.</p>
      ${sk({ x: [-1.3, 1.3], y: [-4, 7], sy: 0.5, curves: [[x => 3 * x * x * x + 1, [-1.3, 1.3]]], pts: [[0, 1, '(0, 1)', 'nw'], [1, 4, '(1, 4)', 'e']], alt: 'A cubic through (0, 1) and (1, 4)' })}
      ${steps(
        `<p><strong>The y-intercept gives k.</strong> At x = 0, y = k, so k = 1.</p>`,
        `<p><strong>Substitute the other point to find a.</strong></p>
         ${sum('4 = a(1)³ + 1<br>a = 3')}
         ${ans('y=3x^3+1')}`,
        `<p><strong>Given an x-intercept instead?</strong> A graph through (0, 6) and (∛2, 0): k = 6, then</p>
         ${sum('0 = a(∛2)³ + 6<br>0 = 2a + 6, so a = −3<br>y = −3x³ + 6')}`
      )}
      ${tip('(∛2)³ is just 2. Type the rule as an equation, like y = 3x^3 + 1.')}`,

    // =====================================================================
    // Year 10 10H Graphs of polynomials
    // =====================================================================
    // y10-10H Q1, Q2, Q3, Q4, Q5, Q9: intercepts and shape of a factorised polynomial
    // method: Example 17, 10H (sketching cubic graphs from x- and y-intercepts)
    'y10-10h-intercepts': `
      <p class="hp-tag">Worked example: find the intercepts of <b>y = (x + 1)(x − 3)(x − 5)</b>, then of <b>y = −2x(x + 1)(x − 4)</b>.</p>
      ${sk({ x: [-1.6, 5.6], y: [-20, 22], sx: 0.75, sy: 0.12, curves: [[x => (x + 1) * (x - 3) * (x - 5), [-1.6, 5.6]]], pts: [[0, 15, '15', 'w'], [-1, 0, '−1', 'nw'], [3, 0, '3', 'sw'], [5, 0, '5', 'ne']], alt: 'A positive cubic crossing the x-axis at −1, 3 and 5, with y-intercept 15' })}
      ${steps(
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = (0 + 1)(0 − 3)(0 − 5) = (1)(−3)(−5) = 15')}
         ${ans('(0,15)')}`,
        `<p><strong>x-intercepts: set y = 0 and use the Null Factor Law.</strong></p>
         ${sum('x + 1 = 0 or x − 3 = 0 or x − 5 = 0<br>x = −1, 3 or 5')}
         ${ans('-1, 3, 5')}`,
        `<p><strong>Shape: look at the sign in front.</strong> Expanding gives +x³, so it is a <b>positive cubic</b>: it rises to the right. y = −2x(x + 1)(x − 4) starts with −2x³, so it is a <b>negative cubic</b>, falling to the right. Its x-intercepts are 0, −1 and 4, and its y-intercept is (0, 0).</p>`
      )}
      <p><strong>Four brackets (a quartic)?</strong> Same steps. y = (x + 2)(x + 1)(x − 1)(x − 3) has x-intercepts −2, −1, 1, 3 and y-intercept (2)(1)(−1)(−3) = 6.</p>
      ${tip('A bracket x on its own gives the intercept x = 0. Type x-intercepts separated by commas and the y-intercept as a point, like (0, 15).')}`,

    // y10-10H Q6: the rule of a cubic from its graph
    // method: no worked example in 10H; Example 17 reversed (intercepts give the factors, the y-intercept gives a)
    'y10-10h-rule': `
      <p class="hp-tag">Worked example: a cubic has x-intercepts −4, −1 and 2, and y-intercept 16. Find its rule.</p>
      ${sk({ x: [-4.5, 2.5], y: [-24, 22], sx: 0.8, sy: 0.1, curves: [[x => -2 * (x + 4) * (x + 1) * (x - 2), [-4.5, 2.5]]], pts: [[0, 16, '16', 'e'], [-4, 0, '−4', 'nw'], [-1, 0, '−1', 'sw'], [2, 0, '2', 'ne']], alt: 'A negative cubic through −4, −1 and 2 with y-intercept 16' })}
      ${steps(
        `<p><strong>Each x-intercept gives a bracket.</strong> x = −4 gives (x + 4), and so on. Put a in front.</p>
         ${sum('y = a(x + 4)(x + 1)(x − 2)')}`,
        `<p><strong>Use the y-intercept to find a.</strong> Substitute (0, 16).</p>
         ${sum('16 = a(4)(1)(−2) = −8a<br>a = −2')}`,
        `<p><strong>Write the rule.</strong> a is negative, which matches a graph that falls to the right.</p>
         ${ans('y=-2(x+4)(x+1)(x-2)')}`
      )}
      ${tip('No labelled y-intercept? Substitute any other labelled point instead. A fraction for a is fine: put it at the end, like y = (x + 1)(x - 2)(x - 6)/3.')}`,

    // y10-10H Q7: repeated factors and turning points on the axis
    // method: no worked example in 10H; Null Factor Law (Example 17) plus the stem's note on repeated factors
    'y10-10h-repeated': `
      <p class="hp-tag">Worked example: <b>y = (x − 1)²(x + 3)</b></p>
      ${sk({ x: [-3.6, 2.4], y: [-6, 12], sx: 0.9, sy: 0.3, curves: [[x => (x - 1) * (x - 1) * (x + 3), [-3.6, 2.4]]], pts: [[1, 0, '1', 'se'], [-3, 0, '−3', 'nw'], [0, 3, '3', 'ne']], alt: 'A cubic crossing at −3 and touching the x-axis at 1' })}
      ${steps(
        `<p><strong>x-intercepts with the Null Factor Law.</strong> (x − 1)² = 0 gives x = 1; x + 3 = 0 gives x = −3.</p>
         ${ans('1, -3')}`,
        `<p><strong>The squared bracket is where the graph touches the axis and turns.</strong> It does not cross there.</p>
         ${ans('1')}`,
        `<p><strong>y-intercept:</strong> y = (−1)²(3) = 3. Positive cubic, so it rises to the right.</p>`
      )}
      ${tip('List each x-intercept once, even though (x − 1) appears twice. The turning point is the x-value from the squared bracket.')}`,

    // y10-10H Q8: quartics y = (x - h)⁴ + k
    // method: Key ideas, 10H (the basic quartic y = x⁴), moved like the cubics in 10G
    'y10-10h-quartic': `
      <p class="hp-tag">Worked example: find the turning point and y-intercept of <b>y = (x − 3)⁴ − 5</b>.</p>
      ${sk({ x: [0.6, 5.4], y: [-6, 30], sx: 0.9, sy: 0.12, curves: [[x => Math.pow(x - 3, 4) - 5, [0.6, 5.4]]], pts: [[3, -5, '(3, −5)', 's']], alt: 'A quartic with its turning point at (3, −5)' })}
      ${steps(
        `<p><strong>y = x⁴ has its turning point at (0, 0).</strong> (x − 3) moves it 3 right and −5 moves it 5 down.</p>
         ${ans('(3,-5)')}`,
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = (0 − 3)⁴ − 5 = 81 − 5 = 76')}
         ${ans('(0,76)')}`
      )}
      <p><strong>No k?</strong> y = (x + 1)⁴ has turning point (−1, 0) and y-intercept 1⁴ = 1. <strong>No bracket?</strong> y = x⁴ + k has its turning point on the y-axis, so it is also the y-intercept.</p>
      ${tip('An even power is never negative, so (x − 3)⁴ is smallest (0) at x = 3. Type points like (3, -5).')}`,

    // y10-10H Q10: factorise with the factor theorem, then intercepts
    // method: Example 13, 10F (factor theorem and long division), then Example 17, 10H (intercepts)
    'y10-10h-factorise': `
      <p class="hp-tag">Worked example: <b>y = x³ − 3x² − 6x + 8</b>. Find the y-intercept, factorise, and find the x-intercepts.</p>
      ${steps(
        `<p><strong>y-intercept: x = 0 leaves the constant.</strong></p>
         ${ans('(0,8)')}`,
        `<p><strong>Find a factor, then divide.</strong> P(1) = 1 − 3 − 6 + 8 = 0, so (x − 1) is a factor.</p>
         ${ldiv('x − 1', ['', 'x²', '− 2x', '− 8'], ['x³', '− 3x²', '− 6x', '+ 8'], [
           { c: ['x³', '− x²', '', ''] },
           { c: ['', '−2x²', '− 6x', ''], rule: [0, 1] },
           { c: ['', '−2x²', '+ 2x', ''] },
           { c: ['', '', '−8x', '+ 8'], rule: [1, 2] },
           { c: ['', '', '−8x', '+ 8'] },
           { c: ['', '', '', '0'], rule: [2, 3] }
         ])}
         ${sum('y = (x − 1)(x² − 2x − 8) = (x − 1)(x + 2)(x − 4)')}
         ${ans('(x-1)(x+2)(x-4)')}`,
        `<p><strong>x-intercepts with the Null Factor Law.</strong></p>
         ${ans('-2, 1, 4')}`
      )}
      <p><strong>A quartic?</strong> Find one factor and divide to get a cubic, then find a factor of the cubic and divide again.</p>
      ${tip('Type the factorised form as brackets side by side, like (x - 1)(x + 2)(x - 4).')}`,

    // =====================================================================
    // Year 10 10I Graphs of circles
    // =====================================================================
    // y10-10I Q1, Q2, Q5: centre, radius, and points on x² + y² = r²
    // method: Example 18, 10I (sketching a circle; finding y for a given x and x for a given y)
    'y10-10i-sub': `
      <p class="hp-tag">Worked example: for <b>x² + y² = 17</b>, state the centre and radius, find y when x = 1, and find x when y = 1/2.</p>
      ${steps(
        `<p><strong>x² + y² = r² has centre (0, 0) and radius r.</strong></p>
         ${sum('r² = 17, so r = √17')}
         ${ans('(0,0)')} &nbsp; ${ans('sqrt17')}`,
        `<p><strong>Substitute x = 1 and solve for y.</strong> There are two answers, one positive and one negative.</p>
         ${sum('1² + y² = 17<br>y² = 16<br>y = ±4')}
         ${ans('4, -4')}`,
        `<p><strong>Fractions work the same way.</strong></p>
         ${sum('x² + 1/4 = 17<br>x² = 68/4 − 1/4 = 67/4<br>x = ±√67 / 2')}
         ${ans('sqrt67/2, -sqrt67/2')}`
      )}
      <p><strong>Only one answer?</strong> At the edge of the circle, like x = √17, y² = 0 and y = 0 is the only value.</p>
      ${tip('Type both values separated by a comma, using sqrt, like sqrt67/2, -sqrt67/2. If there is only one value, type just that one.')}`,

    // y10-10I Q3, Q4, Q6, Q7: radius from the equation, equation from the radius
    // method: Example 18b, 10I (r² is the number on the right of x² + y² = r²)
    'y10-10i-radius': `
      <p class="hp-tag">Worked example: the radius of <b>x² + y² = 81</b> and <b>x² + y² = 28</b>, and the equation of the circle with radius 0.5</p>
      ${sk({ x: [-3.3, 3.3], y: [-3.3, 3.3], sx: 0.8, sy: 0.8, circles: [[0, 0, 3]], pts: [[3, 0, 'r', 'se'], [-3, 0, '−r', 'sw'], [0, 3, 'r', 'ne'], [0, -3, '−r', 'se']], alt: 'A circle centred at the origin, cutting the axes at r and −r' })}
      ${steps(
        `<p><strong>The number on the right is r². Square root it.</strong></p>
         ${sum('r² = 81, so r = 9<br>r² = 28, so r = √28 = √4 × √7 = 2√7')}
         ${ans('2sqrt7')}`,
        `<p><strong>Going the other way, square the radius.</strong></p>
         ${sum('r = 0.5: r² = 0.25 → x² + y² = 0.25<br>r = √3: r² = 3 → x² + y² = 3')}
         ${ans('x^2+y^2=0.25')}`,
        `<p><strong>Not in the usual form? Rearrange first.</strong> Get x² + y² on one side.</p>
         ${sum('x² − 45 = −y²<br>x² + y² = 45, so r = √45 = 3√5')}`
      )}
      <p><strong>Intercepts:</strong> the circle cuts each axis at r and −r. For x² + y² = 28 that is 2√7 and −2√7 on both axes.</p>
      ${tip('Simplify surds: look for a square number factor, like 28 = 4 × 7. Type the equation like x^2 + y^2 = 100.')}`,

    // y10-10I Q8, Q9, Q10, Q11, Q15: where a line meets a circle
    // method: Example 19, 10I (intersecting circles and lines by substitution)
    'y10-10i-line': `
      <p class="hp-tag">Worked example: find where <b>x² + y² = 45</b> meets <b>y = 2x</b>.</p>
      ${sk({ x: [-7, 7], y: [-7, 7], sx: 0.38, sy: 0.38, circles: [[0, 0, Math.sqrt(45)]], curves: [[x => 2 * x, [-3.6, 3.6]]], pts: [[3, 6, '(3, 6)', 'e'], [-3, -6, '(−3, −6)', 'w']], alt: 'A circle and the line y = 2x meeting at (3, 6) and (−3, −6)' })}
      ${steps(
        `<p><strong>Substitute the line into the circle.</strong> Replace y with 2x.</p>
         ${sum('x² + (2x)² = 45<br>x² + 4x² = 45<br>5x² = 45')}`,
        `<p><strong>Solve for x.</strong></p>
         ${sum('x² = 9, so x = 3 or x = −3')}`,
        `<p><strong>Put each x back into the line to get y.</strong></p>
         ${sum('x = 3: y = 6 &nbsp; &nbsp; x = −3: y = −6')}
         ${ans('(3,6)')} &nbsp; ${ans('(-3,-6)')}`
      )}
      <p><strong>Chord length:</strong> find both points, then use Pythagoras. y = x − 1 meets x² + y² = 25 at (4, 3) and (−3, −4), so the chord is √(7² + 7²) = √98 = 7√2.</p>
      <p><strong>Do they meet at all?</strong> y = 5 and x² + y² = 16 give x² = 16 − 25 = −9: no solution, so they do not intersect.</p>
      ${tip('(2x)² is 4x², not 2x². Type points like (3, 6).')}`,

    // y10-10I Q12: when is a line a tangent?
    // method: no worked example in 10I; substitution (Example 19) and the discriminant from Chapter 7
    'y10-10i-tangent': `
      <p class="hp-tag">Worked example: for which m is <b>y = mx + 4</b> a tangent to <b>x² + y² = 4</b>?</p>
      ${steps(
        `<p><strong>Substitute the line into the circle and make a quadratic in x.</strong></p>
         ${sum('x² + (mx + 4)² = 4<br>x² + m²x² + 8mx + 16 = 4<br>(1 + m²)x² + 8mx + 12 = 0')}`,
        `<p><strong>A tangent touches once, so the discriminant is 0.</strong></p>
         ${sum('b² − 4ac = (8m)² − 4(1 + m²)(12)<br>= 64m² − 48 − 48m² = 16m² − 48')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('16m² − 48 = 0<br>m² = 3, so m = √3 or −√3')}
         ${ans('sqrt3, -sqrt3')}`
      )}
      <p><strong>Two places or none?</strong> The discriminant is positive (two points) when m &lt; −√3 or m &gt; √3, and negative (misses) when −√3 &lt; m &lt; √3.</p>
      ${tip('Steeper lines than the tangents cut the circle; flatter ones miss it. Type the two values separated by a comma.')}`,

    // y10-10I Q13: matching equations to graphs
    // method: Key ideas, 10I (x² + y² = r² is a circle of radius r), with lines and parabolas from earlier chapters
    'y10-10i-match': `
      <p class="hp-tag">Worked example: describe the graphs of <b>x² + y² = 32</b>, <b>y = 2x − 1</b>, <b>y = x² − 1</b> and <b>y = −x(x + 2)</b>.</p>
      ${steps(
        `<p><strong>Both x² and y², added: a circle.</strong> x² + y² = 32 is centred at (0, 0) with radius √32 = 4√2, about 5.7.</p>`,
        `<p><strong>No powers: a straight line.</strong> y = 2x − 1 has gradient 2 and y-intercept −1.</p>`,
        `<p><strong>Only x squared: a parabola.</strong> y = x² − 1 opens up with turning point (0, −1). y = −x(x + 2) opens down (minus in front) and cuts the x-axis at 0 and −2.</p>`
      )}
      ${chips(['circle: x² + y² = r²'], ['line: y = mx + c'], ['parabola: y = ax² + ...'])}
      ${tip('For each graph, check one feature: the radius, the y-intercept or the x-intercepts. One clear feature usually decides the match.')}`,

    // y10-10I Q14, Q16, Q17: half circles
    // method: Key ideas, 10I (making y or x the subject: y = ±√(r² − x²), x = ±√(r² − y²))
    'y10-10i-half': `
      <p class="hp-tag">Worked example: make y the subject of <b>x² + y² = 14</b>, and write rules for its half circles.</p>
      ${sk({ x: [-4.2, 4.2], y: [-0.5, 4.2], sx: 0.7, sy: 0.7, curves: [[x => Math.sqrt(Math.max(0, 14 - x * x)), [-3.7417, 3.7417]]], pts: [[-3.7417, 0, '−√14', 'sw'], [3.7417, 0, '√14', 'se'], [0, 3.7417, '√14', 'ne']], alt: 'The top half of a circle of radius √14' })}
      ${steps(
        `<p><strong>Rearrange.</strong> Two square roots are possible, positive and negative.</p>
         ${sum('y² = 14 − x²<br>y = ±√(14 − x²)')}`,
        `<p><strong>The + sign gives the top half</strong> (y is never negative). The − sign gives the bottom half.</p>
         ${ans('y=sqrt(14-x^2)')}`,
        `<p><strong>Make x the subject for the side halves.</strong> x = √(14 − y²) is the right half; x = −√(14 − y²) is the left half.</p>`
      )}
      <p><strong>From a picture:</strong> read the radius from where it cuts an axis, square it, and pick y = ± or x = ± from which half is drawn.</p>
      ${tip('Type the rule with sqrt and brackets, like y = sqrt(14 - x^2) or x = -sqrt(14 - y^2).')}`,

    // =====================================================================
    // Year 10 10J Hyperbolic functions and their graphs
    // =====================================================================
    // y10-10J Q1, Q2, Q3, Q4, Q5: points on y = a/x
    // method: Example 20, 10J (substituting x = 1 and x = -1), and Example 21a for a given y
    'y10-10j-points': `
      <p class="hp-tag">Worked example: for <b>y = 10/x</b>, find the points where x = 1, x = −1 and x = 4, and where y = −20.</p>
      ${sk({ x: [-5, 5], y: [-12, 12], sx: 0.5, sy: 0.2, curves: [[x => 10 / x, [0.75, 5]], [x => 10 / x, [-5, -0.75]]], pts: [[1, 10, '(1, 10)', 'e'], [-1, -10, '(−1, −10)', 'w']], alt: 'The hyperbola y = 10/x through (1, 10) and (−1, −10)' })}
      ${steps(
        `<p><strong>Given x: substitute.</strong></p>
         ${sum('x = 1: y = 10/1 = 10 &nbsp; → (1, 10)<br>x = −1: y = 10/(−1) = −10 &nbsp; → (−1, −10)<br>x = 4: y = 10/4 = 5/2 &nbsp; → (4, 5/2)')}`,
        `<p><strong>Given y: substitute and solve for x.</strong></p>
         ${sum('−20 = 10/x<br>−20x = 10<br>x = −1/2')}
         ${ans('(-1/2,-20)')}`,
        `<p><strong>Does a point lie on it?</strong> Substitute the x and see if you get the y. For (2, −5) on y = −10/x: −10/2 = −5 ✓, so yes.</p>`
      )}
      ${tip('Simplify fractions in the point: 10/4 is 5/2. Type points like (4, 5/2).')}`,

    // y10-10J Q6, Q7, Q9: where a line meets a hyperbola
    // method: Example 21, 10J (intersection points of a line and a hyperbola by substitution)
    'y10-10j-intersect': `
      <p class="hp-tag">Worked example: find where <b>y = 2/x</b> meets <b>y = 6</b>, and where it meets <b>y = 50x</b>.</p>
      ${steps(
        `<p><strong>A horizontal line: substitute y and solve.</strong></p>
         ${sum('6 = 2/x<br>6x = 2<br>x = 1/3')}
         ${ans('(1/3,6)')}`,
        `<p><strong>A line through the origin: set the rules equal and multiply both sides by x.</strong></p>
         ${sum('50x = 2/x<br>50x² = 2<br>x² = 1/25')}`,
        `<p><strong>Square root: two answers.</strong></p>
         ${sum('x = 1/5 or x = −1/5<br>points (1/5, 10) and (−1/5, −10)')}
         ${ans('1/5, -1/5')}`
      )}
      <p><strong>No meeting point?</strong> y = −3x and y = 2/x give −3x² = 2, so x² = −2/3. No real number squares to a negative, so they never meet.</p>
      ${tip('For a line through the origin the question wants the two x-values, separated by a comma. Use sqrt if x² is not a perfect square, like sqrt(3)/3.')}`,

    // y10-10J Q8, Q11: recognising graphs, and the effect of the number on top
    // method: Key ideas, 10J (y = a/x: a > 1 further out, 0 < a < 1 closer in, -a reflects)
    'y10-10j-match': `
      <p class="hp-tag">Worked example: describe the graphs of <b>y = 5/x</b>, <b>y = −5/x</b>, <b>y = 4<sup>x</sup></b> and <b>y = 1/(4x)</b>.</p>
      ${sk(
        { x: [-4, 4], y: [-6, 6], sx: 0.45, sy: 0.3, curves: [[x => 5 / x, [0.84, 4]], [x => 5 / x, [-4, -0.84]]], pts: [[1, 5, '(1, 5)', 'e']], alt: 'y = 5/x in the first and third quadrants' },
        { x: [-4, 4], y: [-6, 6], sx: 0.45, sy: 0.3, curves: [[x => -5 / x, [0.84, 4]], [x => -5 / x, [-4, -0.84]]], pts: [[1, -5, '(1, −5)', 'e']], alt: 'y = −5/x in the second and fourth quadrants' }
      )}
      ${steps(
        `<p><strong>y = a/x is a hyperbola</strong> with the axes as asymptotes. Substitute x = 1 to find the point (1, a). y = 5/x passes through (1, 5) and sits in the top right and bottom left.</p>`,
        `<p><strong>A minus sign reflects it</strong> into the other two quadrants: y = −5/x passes through (1, −5).</p>`,
        `<p><strong>Other families:</strong> y = 4<sup>x</sup> is an exponential, through (0, 1), with asymptote y = 0 on one side only. y = 1/(4x) is y = (1/4)/x: a = 1/4 is less than 1, so the curve sits <b>closer in</b> to the asymptotes than y = 1/x.</p>`
      )}
      ${tip('Hyperbolas never touch the axes. Exponentials cross the y-axis; circles and lines have no asymptotes at all.')}`,

    // y10-10J Q10: what happens near the asymptotes
    // method: Key ideas, 10J (asymptotes x = 0 and y = 0), with a table of values as in the lesson starter
    'y10-10j-asymptote': `
      <p class="hp-tag">Worked example: what happens to <b>y = 5/x</b> as x gets very large, and as x gets close to 0?</p>
      ${fig({ kind: 'table', rows: [['x', 1000, 0.001, -0.001, -1000], ['y = 5/x', 0.005, 5000, -5000, -0.005]] })}
      ${steps(
        `<p><strong>Big x (positive or negative):</strong> 5 divided by a huge number is tiny, so y gets closer and closer to <b>zero</b>.</p>`,
        `<p><strong>x close to 0 from the right</strong> (small positive): 5 ÷ 0.001 = 5000, so y heads to <b>infinity</b>.</p>`,
        `<p><strong>x close to 0 from the left</strong> (small negative): 5 ÷ (−0.001) = −5000, so y heads to <b>negative infinity</b>.</p>`
      )}
      ${tip('Try a value in the calculator if unsure. The sign of x (and of the number on top) decides positive or negative infinity.')}`,

    // y10-10J Q12: a hyperbola and a sloping line, with the quadratic formula
    // method: no worked example in 10J for this case; substitution (Example 21b), then the quadratic formula and discriminant
    'y10-10j-quadratic': `
      <p class="hp-tag">Worked example: find where <b>y = 1/x</b> meets <b>y = x − 1</b>.</p>
      ${steps(
        `<p><strong>Set the rules equal and multiply both sides by x.</strong></p>
         ${sum('1/x = x − 1<br>1 = x² − x<br>x² − x − 1 = 0')}`,
        `<p><strong>Use the quadratic formula</strong> with a = 1, b = −1, c = −1.</p>
         ${sum('x = (1 ± √(1 + 4)) / 2 = (1 ± √5) / 2')}
         ${ans('(1+sqrt(5))/2, (1-sqrt(5))/2')}`,
        `<p><strong>The discriminant tells you how many meeting points.</strong> For y = −4x + c: 1/x = −4x + c gives 4x² − cx + 1 = 0, with b² − 4ac = c² − 16.</p>
         ${sum('c² − 16 = 0 → c = 4 or c = −4 (meet once)<br>c = 2: 4 − 16 &lt; 0 (no meeting point)')}`
      )}
      ${tip('Negative discriminant: they do not meet. Zero: they touch once. Positive: two points. Type exact values with sqrt.')}`,

    // =====================================================================
    // Year 10 10K Further transformations of graphs
    // =====================================================================
    // y10-10K Q1, Q8: circles (x - h)² + (y - k)² = r²
    // method: Example 22a, 10K (centre, radius and intercepts of a translated circle)
    'y10-10k-circle': `
      <p class="hp-tag">Worked example: <b>(x − 2)² + (y + 1)² = 16</b>. Find the centre, radius and intercepts.</p>
      ${sk({ x: [-2.5, 6.5], y: [-5.5, 3.5], sx: 0.55, sy: 0.55, circles: [[2, -1, 4]], pts: [[2, -1, '(2, −1)', 'se']], alt: 'A circle with centre (2, −1) and radius 4' })}
      ${steps(
        `<p><strong>Centre (h, k), with the signs flipped from the brackets. Radius = √(right side).</strong></p>
         ${sum('centre (2, −1), &nbsp; r = √16 = 4')}
         ${ans('(2,-1)')} &nbsp; ${ans('4')}`,
        `<p><strong>y-intercepts: substitute x = 0.</strong></p>
         ${sum('(0 − 2)² + (y + 1)² = 16<br>4 + (y + 1)² = 16<br>(y + 1)² = 12<br>y = −1 ± √12 = −1 ± 2√3')}`,
        `<p><strong>x-intercepts: substitute y = 0.</strong></p>
         ${sum('(x − 2)² + 1 = 16<br>(x − 2)² = 15<br>x = 2 ± √15')}`
      )}
      <p><strong>Highest and lowest values:</strong> go r from the centre. x runs from 2 − 4 = −2 to 2 + 4 = 6, and y from −1 − 4 = −5 to −1 + 4 = 3.</p>
      ${tip('Type intercepts separated by a comma with sqrt, like 2 + sqrt(15), 2 - sqrt(15).')}`,

    // y10-10K Q2, Q4: translated exponentials
    // method: Example 22b, 10K (asymptote y = k, y-intercept from x = 0)
    'y10-10k-exp': `
      <p class="hp-tag">Worked example: find the asymptote and y-intercept of <b>y = 2<sup>x − 3</sup> + 2</b>, then of <b>y = −2<sup>x − 2</sup> + 1</b>.</p>
      ${sk({ x: [-3, 4.5], y: [0, 6], sx: 0.7, sy: 0.6, curves: [[x => Math.pow(2, x - 3) + 2, [-3, 4.5]]], dash: [[-3, 2, 4.5, 2]], pts: [[0, 2.125, '(0, 17/8)', 'nw']], labels: [['y = 2', 4.3, 1.55]], alt: 'An exponential curve above its asymptote y = 2' })}
      ${steps(
        `<p><strong>The number added on the end is the asymptote.</strong> y = 2<sup>x − h</sup> + k has asymptote y = k.</p>
         ${ans('y=2')}`,
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = 2<sup>−3</sup> + 2 = 1/8 + 2 = 17/8')}
         ${ans('(0,17/8)')}`,
        `<p><strong>A minus in front reflects the curve</strong> (it hangs below the asymptote). −2<sup>x</sup> means −(2<sup>x</sup>).</p>
         ${sum('asymptote y = 1<br>y = −2<sup>−2</sup> + 1 = −1/4 + 1 = 3/4')}`
      )}
      ${tip('A negative power is a fraction: 2^(−3) = 1/8. Type the asymptote as an equation, like y = 2.')}`,

    // y10-10K Q3, Q5: translated hyperbolas
    // method: Example 22c, 10K (asymptotes x = h and y = k, intercepts by substitution)
    'y10-10k-hyp': `
      <p class="hp-tag">Worked example: <b>y = 1/(x − 3) + 2</b>. Find the asymptotes and the intercepts.</p>
      ${sk({ x: [-1.5, 7.5], y: [-3, 7], sx: 0.6, sy: 0.5, curves: [[x => 1 / (x - 3) + 2, [3.2, 7.5]], [x => 1 / (x - 3) + 2, [-1.5, 2.8]]], dash: [[3, -3, 3, 7], [-1.5, 2, 7.5, 2]], pts: [[0, 5 / 3, '(0, 5/3)', 'nw'], [2.5, 0, '(5/2, 0)', 'se']], alt: 'A hyperbola with asymptotes x = 3 and y = 2' })}
      ${steps(
        `<p><strong>Asymptotes: x = h (from the bottom, sign flipped) and y = k (the number added).</strong></p>
         ${ans('x=3')} &nbsp; ${ans('y=2')}`,
        `<p><strong>y-intercept: substitute x = 0.</strong></p>
         ${sum('y = 1/(0 − 3) + 2 = −1/3 + 2 = 5/3')}
         ${ans('(0,5/3)')}`,
        `<p><strong>x-intercept: substitute y = 0 and solve.</strong></p>
         ${sum('0 = 1/(x − 3) + 2<br>−2 = 1/(x − 3)<br>x − 3 = −1/2, so x = 5/2')}
         ${ans('(5/2,0)')}`
      )}
      <p><strong>A number or minus on top?</strong> y = −2/(x + 3) + 1 has asymptotes x = −3 and y = 1. y-intercept: −2/3 + 1 = 1/3. x-intercept: 2/(x + 3) = 1, so x + 3 = 2 and x = −1.</p>
      ${tip('When the unknown is on the bottom, flip both sides: −2 = 1/(x − 3) becomes x − 3 = −1/2.')}`,

    // y10-10K Q6, Q9: finding the rule from a graph
    // method: Key ideas, 10K (asymptotes give h and k; centre and radius give the circle)
    'y10-10k-rule': `
      <p class="hp-tag">Worked example: a hyperbola has asymptotes x = −1 and y = 3, and passes through (0, 4). A circle has centre (3, 1) and passes through (4, −2).</p>
      ${steps(
        `<p><strong>Hyperbola: the asymptotes give h and k.</strong></p>
         ${sum('y = 1/(x − (−1)) + 3 = 1/(x + 1) + 3')}
         <p>Check with the labelled point: x = 0 gives 1/1 + 3 = 4 ✓.</p>
         ${ans('y=1/(x+1)+3')}`,
        `<p><strong>Circle: the centre gives h and k. Find r² with Pythagoras</strong> from the centre to the labelled point.</p>
         ${sum('r² = (4 − 3)² + (−2 − 1)² = 1 + 9 = 10')}`,
        `<p><strong>Write the equation.</strong></p>
         ${ans('(x-3)^2+(y-1)^2=10')}`
      )}
      <p><strong>Curve in the other two quadrants?</strong> Then it is reflected: y = −1/(x − h) + k.</p>
      ${tip('Type hyperbolas like y = 1/(x + 1) + 3 and circles like (x - 3)^2 + (y - 1)^2 = 10.')}`,

    // y10-10K Q7, Q10: intersections of translated graphs and lines
    // method: substitution, as in Example 19, 10I and Example 21, 10J
    'y10-10k-intersect': `
      <p class="hp-tag">Worked example: find the x-coordinates where <b>y = 1/(x − 2)</b> meets <b>y = x − 2</b>, and where <b>(x − 1)² + y² = 5</b> meets <b>y = x</b>.</p>
      ${steps(
        `<p><strong>Set the rules equal and clear the fraction.</strong></p>
         ${sum('1/(x − 2) = x − 2<br>(x − 2)² = 1<br>x − 2 = 1 or x − 2 = −1<br>x = 3 or x = 1')}
         ${ans('1, 3')}`,
        `<p><strong>Circle and line: substitute the line into the circle.</strong></p>
         ${sum('(x − 1)² + x² = 5<br>x² − 2x + 1 + x² = 5<br>2x² − 2x − 4 = 0<br>x² − x − 2 = 0')}`,
        `<p><strong>Factorise, or use the quadratic formula if it will not factorise.</strong></p>
         ${sum('(x − 2)(x + 1) = 0, so x = 2 or x = −1')}
         ${ans('2, -1')}`
      )}
      <p><strong>How many points?</strong> Think about the graphs. y = 2<sup>x</sup> + 1 stays above its asymptote y = 1, so it never meets y = 0: 0 points.</p>
      ${tip('Type exact x-values separated by commas, with sqrt if needed, like (5 + sqrt(13))/2, (5 - sqrt(13))/2.')}`,

    // y10-10K Q11, Q12: completing the square to find the centre and radius
    // method: no worked example in 10K; completing the square from Chapter 7, then Key ideas (standard form)
    'y10-10k-complete': `
      <p class="hp-tag">Worked example: find the centre and radius of <b>x² − 6x + y² + 2y + 1 = 0</b>.</p>
      ${steps(
        `<p><strong>Complete the square for x and for y.</strong> Halve the x coefficient, square it, add and take away.</p>
         ${sum('x² − 6x = (x − 3)² − 9<br>y² + 2y = (y + 1)² − 1')}`,
        `<p><strong>Put them back and move the numbers to the right.</strong></p>
         ${sum('(x − 3)² − 9 + (y + 1)² − 1 + 1 = 0<br>(x − 3)² + (y + 1)² = 9')}`,
        `<p><strong>Read off the centre and radius.</strong></p>
         ${ans('(3,-1)')} &nbsp; ${ans('3')}`
      )}
      <p><strong>Odd coefficient?</strong> x² + 3x = (x + 3/2)² − 9/4. Fractions are fine. <strong>Negative on the right?</strong> Two squares can never add to a negative number, so it is not a circle.</p>
      ${tip('Type exact radii, like 3, 2sqrt2 or sqrt13/2.')}`
  });
})();
