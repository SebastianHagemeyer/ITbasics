/* H3 help panels for Year 9 Chapter 10. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 10A to 10H. */
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
  // A parabola on a gridded number plane (the same kind of figure the questions use).
  const pplane = (f, X, Y, points = {}, alt = 'A parabola on a number plane') =>
    fig({ kind: 'plane', x: X, y: Y, path: ppath(f, X, Y), points, alt });
  // A sketch: axes with no grid, the curve drawn with its own scale (sx across, sy up), key points labelled.
  // pts: [[x, y, name, pos], ...] in the graph's own numbers. axis: draw the axis of symmetry at x = axis.
  const sketch = (f, X, Y, pts, alt, o = {}) => {
    const sx = o.sx || 1, sy = o.sy || 1;
    const xa = Math.min(X[0] * sx, -0.6) - 0.4, xb = Math.max(X[1] * sx, 0.6) + 0.6;
    const ya = Math.min(Y[0] * sy, -0.6) - 0.3, yb = Math.max(Y[1] * sy, 0.6) + 0.5;
    const items = [
      { seg: [xa, 0, xb, 0], arrow: 'end', thin: true }, { seg: [0, ya, 0, yb], arrow: 'end', thin: true },
      { label: 'x', at: [xb + 0.45, 0] }, { label: 'y', at: [0, yb + 0.5] }, { label: 'O', at: [-0.4, -0.5] },
      { poly: ppath(f, X, Y).map(([x, y]) => [r3(x * sx), r3(y * sy)]), open: true }
    ];
    if (o.axis !== undefined) items.push({ seg: [r3(o.axis * sx), ya, r3(o.axis * sx), yb], dash: true, thin: true });
    if (o.line !== undefined) items.push({ seg: [xa, r3(o.line * sy), xb, r3(o.line * sy)], dash: true, thin: true });
    for (const [x, y, name, pos] of pts) items.push({ point: [r3(x * sx), r3(y * sy)], name, pos: pos || 'ne' });
    return fig({ kind: 'diagram', unit: 26, items: items.concat(o.extra || []), alt });
  };
  // A number plane drawn as a diagram, so it can carry several curves at once.
  // curves: [[f, thin?], ...]; a thin curve is drawn faint, as a reference.
  const pl = (X, Y, curves, extra = [], alt = 'Parabolas on a number plane') => {
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

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 10A Quadratic equations
    // =====================================================================
    // Y9 10A Q1: writing an equation in standard form
    'y9-10a-standard': `
      <p>A quadratic in <b>standard form</b> looks like <b>ax² + bx + c = 0</b>: everything on one side, in order of power, and 0 on the other side.</p>
      <p class="hp-tag">Worked example: write <b>3(x² − 2x) = x + 4</b> in standard form and give a, b and c.</p>
      ${steps(
        `<p><strong>Expand any brackets.</strong></p>
         ${sum('3(x² − 2x) = x + 4<br>3x² − 6x = x + 4')}`,
        `<p><strong>Move every term to the side with the x² term</strong>, so the other side is 0. Subtract x and subtract 4 from both sides.</p>
         ${sum('3x² − 6x − x − 4 = 0<br>3x² − 7x − 4 = 0')}`,
        `<p><strong>Read off the numbers, signs included.</strong> a goes with x², b with x, and c is the number on its own.</p>
         ${sum('a = 3, &nbsp; b = −7, &nbsp; c = −4')}
         ${ans('3, -7, -4')}`
      )}
      <p><strong>Is the x² term negative?</strong> Move everything to the other side instead, so a ends up positive: 2x = 9 − x² becomes x² + 2x − 9 = 0, giving 1, 2, −9.</p>
      ${tip('Use 0 for a missing term: 3x² − 8 = 0 has b = 0. Type the three numbers in order with commas, like 3, -7, -4.')}`,

    // Y9 10A Q2, Q3, Q4: substituting to check a solution
    'y9-10a-check': `
      <p class="hp-tag">Worked example: is <b>x = 4</b> a solution of <b>x² − 2x − 8 = 0</b>? What about <b>x = −3</b>?</p>
      ${steps(
        `<p><strong>Substitute x = 4 into the left-hand side.</strong> Do the powers first, then multiply, then add and subtract.</p>
         ${sum('4² − 2 × 4 − 8 = 16 − 8 − 8 = 0')}
         <p>The left side equals the right side (0), so x = 4 <b>is</b> a solution.</p>`,
        `<p><strong>Now x = −3. Put it in brackets</strong> so the signs stay right.</p>
         ${sum('(−3)² − 2 × (−3) − 8 = 9 + 6 − 8 = 7')}
         <p>7 is not 0, so x = −3 is <b>not</b> a solution.</p>
         ${ans('x = 4 is a solution; x = -3 is not')}`,
        `<p><strong>A quadratic can have two solutions.</strong> Try x = −2 as well: 4 + 4 − 8 = 0, so x = −2 also works. Both 4 and −2 make the equation true.</p>`
      )}
      ${tip('Always bracket a negative before squaring it: (−3)² = 9, but −3² would be read as −9.')}`,

    // Y9 10A Q5: the Null Factor Law
    'y9-10a-nfl': `
      <p><strong>The Null Factor Law:</strong> if two things multiply to give 0, then at least one of them must be 0.</p>
      <p class="hp-tag">Worked example: solve <b>(x − 10)(x + 9) = 0</b>, then <b>x(x + 7) = 0</b>.</p>
      ${steps(
        `<p><strong>Spot the factors.</strong> Here they are (x − 10) and (x + 9). Their product is 0, so one of them is 0.</p>`,
        `<p><strong>Set each factor equal to 0 and solve.</strong></p>
         ${sum('x − 10 = 0 &nbsp; so &nbsp; x = 10<br>x + 9 = 0 &nbsp; so &nbsp; x = −9')}
         ${ans('x = 10 or x = -9')}`,
        `<p><strong>A lone x is a factor too.</strong> In x(x + 7) = 0 the two factors are x and (x + 7).</p>
         ${sum('x = 0 &nbsp; or &nbsp; x + 7 = 0, so x = −7')}
         ${ans('x = 0 or x = -7')}`
      )}
      ${tip('A number stuck to the x, like 5x, is still only 0 when x = 0. Type both answers as x = 10 or x = -9 (or just 10, -9). Fractions are fine, like 3/4.')}`,

    // Y9 10A Q6: factors like (3x + 5)
    'y9-10a-nfl-linear': `
      <p class="hp-tag">Worked example: solve <b>(3x + 5)(2x − 7) = 0</b>.</p>
      ${steps(
        `<p><strong>One of the brackets must be 0.</strong> Solve the first one like a two-step equation: undo the +5, then divide by 3.</p>
         ${sum('3x + 5 = 0<br>3x = −5<br>x = −5/3')}`,
        `<p><strong>Now the second bracket.</strong> Undo the −7, then divide by 2.</p>
         ${sum('2x − 7 = 0<br>2x = 7<br>x = 7/2')}`,
        `<p><strong>Write both solutions.</strong></p>
         ${ans('x = -5/3 or x = 7/2')}`
      )}
      ${tip('Leave the answers as fractions, like -5/3 and 7/2. Check one: 3 × (−5/3) + 5 = −5 + 5 = 0.')}`,

    // Y9 10A Q7: products described in words
    'y9-10a-words': `
      <p class="hp-tag">Worked example: find x if the product of <b>a number 7 more than x</b> and <b>a number 1 less than four times x</b> is zero.</p>
      ${steps(
        `<p><strong>Turn each phrase into a bracket.</strong></p>
         ${flow(['7 more than x', 'x + 7'], ['four times x', '4x'], ['1 less than that', '4x − 1'])}`,
        `<p><strong>"Product is zero" means multiply them and set it to 0.</strong></p>
         ${sum('(x + 7)(4x − 1) = 0')}`,
        `<p><strong>Use the Null Factor Law on each bracket.</strong></p>
         ${sum('x + 7 = 0, so x = −7<br>4x − 1 = 0, so 4x = 1, so x = 1/4')}
         ${ans('x = -7 or x = 1/4')}`
      )}
      ${tip('"Less than" flips the order: 1 less than 4x is 4x − 1, not 1 − 4x. "The product of x and ..." makes x one of the factors on its own.')}`,

    // Y9 10A Q8: clearing brackets and fractions first
    'y9-10a-tidy': `
      <p class="hp-tag">Worked example: write (a) <b>5/x + 4 = x</b> and (b) <b>x/4 = x² − 5/4</b> in standard form, with whole numbers and a &gt; 0.</p>
      ${steps(
        `<p><strong>(a) x is on the bottom, so multiply every term by x.</strong> Then move everything to the side with x².</p>
         ${sum('5 + 4x = x²<br>0 = x² − 4x − 5')}
         ${ans('1, -4, -5')}`,
        `<p><strong>(b) The bottom number is 4, so multiply every term by 4.</strong></p>
         ${sum('x = 4x² − 5<br>0 = 4x² − x − 5')}
         ${ans('4, -1, -5')}`,
        `<p><strong>Check for a common factor.</strong> If all three numbers share one, divide it out: 6x² + 4x − 10 = 0 becomes 3x² + 2x − 5 = 0.</p>`
      )}
      ${tip('Multiply every term, including the ones with no fraction. Type a, b and c in order with commas.')}`,

    // Y9 10A Q9: trial and error
    'y9-10a-trial': `
      <p class="hp-tag">Worked example: <b>x² + x − 12 = 0</b> has two whole-number solutions between −5 and 5. Find them.</p>
      ${steps(
        `<p><strong>Substitute each whole number</strong> and work out the left-hand side. A table keeps it tidy.</p>
         ${fig({ kind: 'table', rows: [['x', '−5', '−4', '−3', '−2', '−1', '0', '1', '2', '3', '4', '5'], ['x² + x − 12', '8', '0', '−6', '−10', '−12', '−12', '−10', '−6', '0', '8', '18']] })}`,
        `<p><strong>Look for the zeros.</strong> The left side is 0 when x = −4 and when x = 3.</p>
         ${ans('x = -4 or x = 3')}`,
        `<p><strong>A shortcut for next time.</strong> The two solutions multiply to give the number term: −4 × 3 = −12. So try factors of that number first.</p>`
      )}
      ${tip('If there is no number term, like x² − 7x = 0, then x = 0 is always one of the solutions.')}`,

    // Y9 10A Q10, Q11, Q14: one solution, a number in front, more than two factors
    'y9-10a-special': `
      <p class="hp-tag">Worked example: solve (a) <b>(x + 10)² = 0</b>, (b) <b>5(x − 8)(x + 11) = 0</b>, (c) <b>(x + 12)(x − 13)(2x + 7) = 0</b>.</p>
      ${steps(
        `<p><strong>(a) A square is two equal brackets:</strong> (x + 10)(x + 10) = 0. Both give the same answer, so there is only <b>one</b> solution.</p>
         ${sum('x + 10 = 0, so x = −10')}
         ${ans('x = -10')}`,
        `<p><strong>(b) A number in front can never be 0</strong>, so divide both sides by 5. The solutions do not change.</p>
         ${sum('(x − 8)(x + 11) = 0<br>x = 8 or x = −11')}
         ${ans('x = 8 or x = -11')}`,
        `<p><strong>(c) Three factors give three solutions.</strong> Set each one to 0.</p>
         ${sum('x = −12, &nbsp; x = 13, &nbsp; 2x + 7 = 0 so x = −7/2')}
         ${ans('x = -12 or x = -7/2 or x = 13')}`
      )}
      ${tip('If there is only one solution, type just that one. When asked how many different solutions, count each value once.')}`,

    // Y9 10A Q12: an equation with no solution
    'y9-10a-never': `
      <p class="hp-tag">Worked example: does <b>(x + 1)² + 2 = 0</b> have a solution?</p>
      ${steps(
        `<p><strong>Try a few values of x.</strong> Work out the bracket, square it, then add 2.</p>
         ${sum('x = −1: (−1 + 1)² + 2 = 0 + 2 = 2<br>x = 2: (2 + 1)² + 2 = 9 + 2 = 11<br>x = −4: (−4 + 1)² + 2 = 9 + 2 = 11')}`,
        `<p><strong>Think about the square.</strong> A squared number is never negative, so (x + 1)² is at least 0. Adding 2 means the left side is always at least 2.</p>`,
        `<p><strong>It can never equal 0</strong>, so the equation has no solution.</p>
         ${ans('No solution')}`
      )}
      ${tip('The smallest value comes when the bracket is 0. Order matters: bracket first, then square, then add.')}`,

    // Y9 10A Q13: naming polynomials
    'y9-10a-names': `
      ${chips(['constant: no x'], ['linear: x'], ['quadratic: x²'], ['cubic: x³'], ['quartic: x⁴'], ['quintic: x⁵'])}
      <p class="hp-tag">Worked example: name (a) <b>x³ + 6 = 2x⁴ − x</b> and (b) <b>9 − 2x = x²</b>.</p>
      ${steps(
        `<p><strong>Look at every term, on both sides,</strong> and find the highest power of x.</p>`,
        `<p><strong>(a)</strong> The powers are 3, 4 and 1. The highest is 4, so it is quartic.</p>
         ${ans('Quartic')}`,
        `<p><strong>(b)</strong> The powers are 1 and 2. The highest is 2, so it is quadratic.</p>
         ${ans('Quadratic')}`
      )}
      ${tip('The order of the terms does not matter, and neither does which side they are on. Only the biggest power counts.')}`,

    // =====================================================================
    // 10B Solving ax² + bx = 0 and x² = d
    // =====================================================================
    // Y9 10B Q1, Q2, Q3, Q10: take out the common factor
    'y9-10b-common': `
      <p class="hp-tag">Worked example: solve <b>4x² − 48x = 0</b>, then <b>2x² = 9x</b>.</p>
      ${steps(
        `<p><strong>Take out the highest common factor.</strong> 4 and 48 share 4, and both terms have an x, so the HCF is 4x.</p>
         ${sum('4x² − 48x = 0<br>4x(x − 12) = 0')}`,
        `<p><strong>Use the Null Factor Law.</strong></p>
         ${sum('4x = 0, so x = 0<br>x − 12 = 0, so x = 12')}
         ${ans('x = 0 or x = 12')}`,
        `<p><strong>Not equal to 0 yet? Rearrange first.</strong> Subtract 9x from both sides.</p>
         ${sum('2x² − 9x = 0<br>x(2x − 9) = 0<br>x = 0 or x = 9/2')}
         ${ans('x = 0 or x = 9/2')}`
      )}
      <p><strong>Never divide both sides by x.</strong> You would lose the solution x = 0. With letters it works the same way: x² + kx = 0 gives x(x + k) = 0, so x = 0 or x = −k.</p>
      ${tip('This type always has x = 0 as one answer. Fractions are fine, like 9/2.')}`,

    // Y9 10B Q4, Q5, Q9: x² = d
    'y9-10b-square': `
      <p class="hp-tag">Worked example: solve <b>x² = 144</b>, then <b>2x² − 12 = 0</b>.</p>
      ${steps(
        `<p><strong>Square root both sides, and remember the negative.</strong> 12² = 144 and (−12)² = 144 too.</p>
         ${sum('x² = 144<br>x = 12 or x = −12')}
         ${ans('x = 12 or x = -12')}`,
        `<p><strong>Get x² on its own first.</strong> Add 12, then divide by 2. 6 is not a square number, so leave the root exact.</p>
         ${sum('2x² = 12<br>x² = 6<br>x = √6 or x = −√6')}
         ${ans('x = sqrt6 or x = -sqrt6')}`,
        `<p><strong>Watch for a negative.</strong> x² + 4 = 0 gives x² = −4. No number squared is negative, so there is no solution.</p>`
      )}
      ${tip('Type the two signs separately, not ±: x = sqrt6 or x = -sqrt6 (√6 works too).')}`,

    // Y9 10B Q6: rearrange first
    'y9-10b-rearrange': `
      <p class="hp-tag">Worked example: solve (a) <b>2x² + 5x = 4x² − 13x</b> and (b) <b>3x² − 30 = x²</b>.</p>
      ${steps(
        `<p><strong>(a) Move everything to the side where x² stays positive.</strong> Here that is the right, so subtract 2x² and 5x from both sides.</p>
         ${sum('0 = 2x² − 18x<br>0 = 2x(x − 9)')}
         ${ans('x = 0 or x = 9')}`,
        `<p><strong>(b) No x term, so get x² alone.</strong> Subtract x² and add 30.</p>
         ${sum('2x² = 30<br>x² = 15<br>x = √15 or x = −√15')}
         ${ans('x = sqrt15 or x = -sqrt15')}`,
        `<p><strong>Minus signs on both sides?</strong> −x² = −169 is the same as x² = 169 (multiply both sides by −1), so x = 13 or x = −13.</p>`
      )}
      ${tip('After rearranging, decide: is there an x term (take out the common factor) or not (square root)?')}`,

    // Y9 10B Q7: writing an equation from words
    'y9-10b-words': `
      <p class="hp-tag">Worked example: find the possible numbers. (a) <b>The square of a number is 8 times the number.</b> (b) <b>The difference between the square of a number and 196 is zero.</b></p>
      ${steps(
        `<p><strong>Call the number x and write the equation.</strong> "The square of a number" is x².</p>
         ${sum('(a) x² = 8x &nbsp; &nbsp; (b) x² − 196 = 0')}`,
        `<p><strong>(a) Rearrange and factorise.</strong></p>
         ${sum('x² − 8x = 0<br>x(x − 8) = 0')}
         ${ans('0, 8')}`,
        `<p><strong>(b) Get x² alone and square root.</strong></p>
         ${sum('x² = 196<br>x = 14 or x = −14')}
         ${ans('14, -14')}`
      )}
      ${tip('Type all the possible numbers with commas, like 0, 8.')}`,

    // Y9 10B Q8: clear fractions and brackets first
    'y9-10b-fractions': `
      <p class="hp-tag">Worked example: solve (a) <b>x/6 = 24/x</b> and (b) <b>x(x + 1) = 2x² − 13x</b>.</p>
      ${steps(
        `<p><strong>(a) Clear both fractions by multiplying both sides by 6x.</strong></p>
         ${sum('x × x = 24 × 6<br>x² = 144<br>x = 12 or x = −12')}
         ${ans('x = 12 or x = -12')}`,
        `<p><strong>(b) Expand the bracket, then move everything to one side.</strong></p>
         ${sum('x² + x = 2x² − 13x<br>0 = x² − 14x<br>0 = x(x − 14)')}
         ${ans('x = 0 or x = 14')}`,
        `<p><strong>Check any answer that makes a bottom zero.</strong> In (a), x = 0 would mean dividing by 0, so 0 could never be a solution there.</p>`
      )}
      ${tip('Multiply every term by the bottom (x, or x²) to clear it, then solve as usual.')}`,

    // Y9 10B Q11: x² equal to a fraction
    'y9-10b-frac-square': `
      <p class="hp-tag">Worked example: solve <b>25x² = 9</b>.</p>
      ${steps(
        `<p><strong>Divide to get x² on its own.</strong></p>
         ${sum('x² = 9/25')}`,
        `<p><strong>Square root the top and the bottom separately.</strong> √9 = 3 and √25 = 5.</p>
         ${sum('x = 3/5 or x = −3/5')}
         ${ans('x = 3/5 or x = -3/5')}`,
        `<p><strong>Starts with a number minus a square?</strong> 144 − 25x² = 0 becomes 25x² = 144, so x² = 144/25 and x = 12/5 or x = −12/5.</p>`
      )}
      ${tip('Type fractions with /, like 3/5 and -3/5.')}`,

    // Y9 10B Q12: (x + p)² = d
    'y9-10b-shifted': `
      <p class="hp-tag">Worked example: solve <b>(x + 2)² = 169</b>, then <b>(2x + 3)² − 1 = 0</b>.</p>
      ${steps(
        `<p><strong>Square root both sides.</strong> The bracket can be the positive or the negative root.</p>
         ${sum('x + 2 = 13 &nbsp; or &nbsp; x + 2 = −13')}`,
        `<p><strong>Solve each one.</strong></p>
         ${sum('x = 11 &nbsp; or &nbsp; x = −15')}
         ${ans('x = 11 or x = -15')}`,
        `<p><strong>Get the square alone first.</strong> (2x + 3)² = 1, so 2x + 3 = 1 or 2x + 3 = −1. That gives 2x = −2 or 2x = −4.</p>
         ${ans('x = -1 or x = -2')}`
      )}
      ${tip('Do not expand the bracket. Square rooting is much quicker, as long as you keep both signs.')}`,

    // =====================================================================
    // 10C Solving x² + bx + c = 0
    // =====================================================================
    // Y9 10C Q1, Q2, Q3, Q10: factorise, then use the Null Factor Law
    'y9-10c-factorise': `
      <p class="hp-tag">Worked example: solve <b>x² + 3x − 18 = 0</b>.</p>
      ${steps(
        `<p><strong>Find two numbers that multiply to −18 and add to 3.</strong> List the factor pairs of −18.</p>
         ${chips(['1 and −18'], ['−1 and 18'], ['2 and −9'], ['−2 and 9'], ['3 and −6'], ['−3 and 6: adds to 3', 'add'])}`,
        `<p><strong>Use them in the brackets.</strong></p>
         ${sum('(x − 3)(x + 6) = 0')}`,
        `<p><strong>Use the Null Factor Law.</strong></p>
         ${sum('x − 3 = 0 or x + 6 = 0')}
         ${ans('x = 3 or x = -6')}`
      )}
      <p><strong>A perfect square?</strong> x² − 20x + 100 = (x − 10)², because −10 × −10 = 100 and −10 + −10 = −20. Both brackets give x = 10, so it has just one solution.</p>
      ${tip('If the number term is positive, both numbers have the same sign as the x term. If it is negative, the signs are different. For one solution, type just that one.')}`,

    // Y9 10C Q4, Q8: rearrange to standard form first
    'y9-10c-rearrange': `
      <p class="hp-tag">Worked example: solve (a) <b>x² = 2x + 24</b> and (b) <b>x + 2 = 35/x</b>.</p>
      ${steps(
        `<p><strong>(a) Get 0 on one side, with x² positive.</strong> Subtract 2x and 24.</p>
         ${sum('x² − 2x − 24 = 0<br>(x − 6)(x + 4) = 0')}
         ${ans('x = 6 or x = -4')}`,
        `<p><strong>(b) Clear the fraction first:</strong> multiply every term by x.</p>
         ${sum('x² + 2x = 35<br>x² + 2x − 35 = 0')}`,
        `<p><strong>Factorise and solve.</strong> 7 and −5 multiply to −35 and add to 2.</p>
         ${sum('(x + 7)(x − 5) = 0')}
         ${ans('x = -7 or x = 5')}`
      )}
      ${tip('The Null Factor Law only works when one side is 0, so always rearrange before you factorise.')}`,

    // Y9 10C Q5: take out a common factor first
    'y9-10c-hcf': `
      <p class="hp-tag">Worked example: solve <b>2x² − 2x − 24 = 0</b>.</p>
      ${steps(
        `<p><strong>Every term shares a factor of 2.</strong> Take it out.</p>
         ${sum('2(x² − x − 12) = 0')}`,
        `<p><strong>Divide both sides by 2.</strong> This does not change the solutions, and the numbers get smaller.</p>
         ${sum('x² − x − 12 = 0')}`,
        `<p><strong>Factorise and solve.</strong> −4 and 3 multiply to −12 and add to −1.</p>
         ${sum('(x − 4)(x + 3) = 0')}
         ${ans('x = 4 or x = -3')}`
      )}
      ${tip('Rearrange to standard form before looking for the common factor if the terms are on both sides.')}`,

    // Y9 10C Q6: a quadratic in a real situation
    'y9-10c-context': `
      <p class="hp-tag">Worked example: the temperature in a cool room, t hours after 9 a.m., is <b>t² − 8t + 12</b> °C. When is it 0 °C?</p>
      ${steps(
        `<p><strong>Set the rule equal to 0.</strong></p>
         ${sum('t² − 8t + 12 = 0')}`,
        `<p><strong>Factorise and solve.</strong> −2 and −6 multiply to 12 and add to −8.</p>
         ${sum('(t − 2)(t − 6) = 0<br>t = 2 or t = 6')}
         ${ans('2, 6')}`,
        `<p><strong>Turn hours into times.</strong> 2 hours after 9 a.m. is 11 a.m., and 6 hours after is 3 p.m.</p>
         ${ans('3 pm')}`
      )}
      ${tip('Read the question carefully: "how many hours" wants the t values; "what time" wants a clock time, typed like 3 pm or 15:00.')}`,

    // Y9 10C Q7, Q11: build the equation from its solutions
    'y9-10c-build': `
      <p class="hp-tag">Worked example: write an equation x² + bx + c = 0 with solutions <b>x = 3 and x = −5</b>.</p>
      ${steps(
        `<p><strong>Each solution gives a bracket, with the sign flipped.</strong> x = 3 comes from (x − 3); x = −5 comes from (x + 5).</p>
         ${sum('(x − 3)(x + 5) = 0')}`,
        `<p><strong>Expand.</strong></p>
         ${sum('x² + 5x − 3x − 15 = 0<br>x² + 2x − 15 = 0')}
         ${ans('2, -15')}`,
        `<p><strong>Only one solution?</strong> Use the same bracket twice. x = 4 only gives (x − 4)² = 0, which expands to x² − 8x + 16 = 0.</p>`
      )}
      <p><strong>With letters:</strong> solutions x = m and x = −n come from (x − m)(x + n) = 0.</p>
      ${tip('Type b and c in order with a comma, like 2, -15.')}`,

    // Y9 10C Q9: make one side zero before factorising
    'y9-10c-jess': `
      <p class="hp-tag">Worked example: solve <b>x² − 2x − 3 = 5</b>.</p>
      ${steps(
        `<p><strong>Do not factorise yet.</strong> If (x − 3)(x + 1) = 5, the brackets could be 1 and 5, or 2 and 2.5, or many other pairs. Only 0 forces one bracket to be 0.</p>`,
        `<p><strong>Make one side 0.</strong> Subtract 5 from both sides, then factorise.</p>
         ${sum('x² − 2x − 8 = 0<br>(x − 4)(x + 2) = 0')}
         ${ans('x = 4 or x = -2')}`,
        `<p><strong>Check in the original.</strong> x = 4: 16 − 8 − 3 = 5 ✓.</p>`
      )}
      ${tip('Always check one answer in the original equation, not the rearranged one.')}`,

    // Y9 10C Q12: non-monic quadratics
    'y9-10c-nonmonic': `
      <p class="hp-tag">Worked example: solve <b>2x² + 7x + 3 = 0</b>.</p>
      ${steps(
        `<p><strong>Multiply a × c.</strong> 2 × 3 = 6. Find two numbers that multiply to 6 and add to 7: they are 6 and 1.</p>`,
        `<p><strong>Split the middle term, then factorise in pairs.</strong></p>
         ${sum('2x² + 6x + x + 3 = 0<br>2x(x + 3) + 1(x + 3) = 0<br>(2x + 1)(x + 3) = 0')}`,
        `<p><strong>Use the Null Factor Law.</strong></p>
         ${sum('2x + 1 = 0, so x = −1/2<br>x + 3 = 0, so x = −3')}
         ${ans('x = -1/2 or x = -3')}`
      )}
      <p><strong>Terms on both sides?</strong> Rearrange first: 3x² = 8x + 3 becomes 3x² − 8x − 3 = 0.</p>
      ${tip('Check by expanding: (2x + 1)(x + 3) = 2x² + 6x + x + 3 ✓. Fractions are fine, like -1/2.')}`,

    // =====================================================================
    // 10D Using quadratic equations to solve problems
    // =====================================================================
    // Y9 10D Q1, Q2, Q6, Q11: rectangle problems
    'y9-10d-rect': `
      <p class="hp-tag">Worked example: a rectangle's length is <b>5 cm more</b> than its width, and its area is <b>84 cm²</b>. Find the width and length.</p>
      ${fig({ kind: 'diagram', unit: 26, alt: 'A rectangle with width x cm and length x + 5 cm', items: [
        { poly: [[0, 0], [6, 0], [6, 3.5], [0, 3.5]], fill: true },
        { dim: [0, 0, 6, 0], label: '(x + 5) cm', off: -0.5 }, { dim: [0, 3.5, 0, 0], label: 'x cm', off: -0.5 }] })}
      ${steps(
        `<p><strong>Let the width be x.</strong> Then the length is x + 5, and length × width is the area.</p>
         ${sum('x(x + 5) = 84')}`,
        `<p><strong>Expand, rearrange and factorise.</strong> 12 and −7 multiply to −84 and add to 5.</p>
         ${sum('x² + 5x − 84 = 0<br>(x + 12)(x − 7) = 0<br>x = −12 or x = 7')}`,
        `<p><strong>A length cannot be negative</strong>, so reject −12. The width is 7 cm and the length is 7 + 5 = 12 cm. Check: 7 × 12 = 84 ✓.</p>
         ${ans('width 7, length 12')}`
      )}
      ${tip('If the length is 4 less than the width, use x and x − 4. Answer exactly what is asked: the width or the length.')}`,

    // Y9 10D Q3, Q4, Q5, Q12: a number times a related number
    'y9-10d-product': `
      <p class="hp-tag">Worked example: the product of a number and <b>1 more</b> than the same number is <b>42</b>. Find the possible numbers.</p>
      ${steps(
        `<p><strong>Call the number x.</strong> "1 more than the number" is x + 1.</p>
         ${sum('x(x + 1) = 42')}`,
        `<p><strong>Expand, make one side 0, and factorise.</strong> 7 and −6 multiply to −42 and add to 1.</p>
         ${sum('x² + x − 42 = 0<br>(x + 7)(x − 6) = 0')}`,
        `<p><strong>Both answers work</strong>, since a number can be negative. Check: 6 × 7 = 42 and −7 × (−6) = 42 ✓.</p>
         ${ans('6, -7')}`
      )}
      ${tip('Keep both answers unless the question says the number must be positive, like a length or a count.')}`,

    // Y9 10D Q7, Q8, Q9, Q15, Q16: area expressions
    'y9-10d-area': `
      <p class="hp-tag">Worked example: a square of side <b>10 m</b> has a square of side <b>x m</b> cut from one corner. The area left is <b>75 m²</b>. Find x.</p>
      ${fig({ kind: 'diagram', unit: 24, alt: 'A 10 m square with an x m square cut from its top right corner', items: [
        { poly: [[0, 0], [6, 0], [6, 3.8], [3.8, 3.8], [3.8, 6], [0, 6]], fill: true },
        { poly: [[3.8, 3.8], [6, 3.8], [6, 6], [3.8, 6]] },
        { dim: [0, 0, 6, 0], label: '10 m', off: -0.5 }, { dim: [6, 3.8, 6, 6], label: 'x m', off: -0.5 }] })}
      ${steps(
        `<p><strong>Write the area as an expression.</strong> Big square take away small square.</p>
         ${sum('10² − x² = 100 − x²')}`,
        `<p><strong>Set it equal to the area and solve.</strong></p>
         ${sum('100 − x² = 75<br>x² = 25<br>x = 5 (a length is positive)')}
         ${ans('5')}`,
        `<p><strong>A border adds x on both sides.</strong> A 20 cm square photo with a border of width x has side 20 + 2x. If the total area is 576 cm², then (20 + 2x)² = 576, so 20 + 2x = 24 and x = 2.</p>`
      )}
      ${tip('Label every length on the diagram in terms of x before you write the area. Type x squared as x^2.')}`,

    // Y9 10D Q10: Pythagoras with an unknown
    'y9-10d-pythag': `
      <p class="hp-tag">Worked example: a right-angled triangle has shorter sides <b>x</b> and <b>x + 2</b> and hypotenuse <b>10</b>. Find x.</p>
      ${fig({ kind: 'diagram', unit: 28, alt: 'A right-angled triangle with shorter sides x and x + 2 and hypotenuse 10', items: [
        { poly: [[0, 0], [4.8, 0], [0, 3.6]], fill: true }, { angle: [0, 0, 0, 90], right: true },
        { label: 'x + 2', at: [2.4, -0.45] }, { label: 'x', at: [-0.3, 1.8], anchor: 'end' }, { label: '10', at: [2.7, 2.2], anchor: 'start' }] })}
      ${steps(
        `<p><strong>Write Pythagoras' theorem.</strong> The hypotenuse goes on its own side.</p>
         ${sum('x² + (x + 2)² = 10²<br>x² + x² + 4x + 4 = 100')}`,
        `<p><strong>Make one side 0, then divide by 2.</strong></p>
         ${sum('2x² + 4x − 96 = 0<br>x² + 2x − 48 = 0<br>(x + 8)(x − 6) = 0')}`,
        `<p><strong>Reject the negative.</strong> x = 6, so the sides are 6, 8 and 10. Check: 36 + 64 = 100 ✓.</p>
         ${ans('6')}`
      )}
      ${tip('Expand (x + 2)² as (x + 2)(x + 2) = x² + 4x + 4. It is not x² + 4.')}`,

    // Y9 10D Q13, Q14: using a formula
    'y9-10d-formula': `
      <p class="hp-tag">Worked example: when <b>n</b> people all shake hands once, there are <b>n(n − 1)/2</b> handshakes. How many for 12 people? How many people make 36 handshakes?</p>
      ${steps(
        `<p><strong>Substitute to find the value.</strong></p>
         ${sum('12 × 11 ÷ 2 = 66')}
         ${ans('66')}`,
        `<p><strong>To go backwards, write an equation and clear the fraction.</strong> Multiply both sides by 2.</p>
         ${sum('n(n − 1)/2 = 36<br>n(n − 1) = 72<br>n² − n − 72 = 0')}`,
        `<p><strong>Factorise and keep the answer that makes sense.</strong> −9 and 8 multiply to −72 and add to −1.</p>
         ${sum('(n − 9)(n + 8) = 0, so n = 9 (not −8)')}
         ${ans('9')}`
      )}
      ${tip('n counts people or sides, so it must be a positive whole number. Reject the other solution.')}`,

    // =====================================================================
    // 10E The parabola
    // =====================================================================
    // Y9 10E Q1: features of a parabola from its graph
    'y9-10e-features': `
      <p class="hp-tag">Worked example: state the features of this parabola.</p>
      ${pplane(x => x * x + 6 * x + 5, [-6, 1], [-5, 6], { '(−3, −4)': [-3, -4] }, 'An upright parabola with turning point (−3, −4), crossing the x-axis at −5 and −1 and the y-axis at 5')}
      ${steps(
        `<p><strong>Which way does it open?</strong> It opens upwards, like a U, so the turning point is a <b>minimum</b>. An upside-down U has a maximum.</p>`,
        `<p><strong>The turning point is the lowest point:</strong> (−3, −4). The axis of symmetry is the vertical line through it.</p>
         ${ans('turning point (-3, -4); axis x = -3')}`,
        `<p><strong>Intercepts.</strong> It crosses the x-axis at x = −5 and x = −1, and the y-axis at (0, 5).</p>
         ${ans('-5, -1 and (0, 5)')}`
      )}
      ${tip('Type the axis as an equation, like x = -3. Points go in brackets, like (0, 5). For the x-intercepts type just the x-values, like -5, -1.')}`,

    // Y9 10E Q2, Q3, Q4, Q5, Q12: table of values and features
    'y9-10e-table': `
      <p class="hp-tag">Worked example: complete a table for <b>y = x² − 4x − 5</b> from x = −2 to 6, and find its features.</p>
      ${steps(
        `<p><strong>Substitute each x.</strong> Put negatives in brackets.</p>
         ${sum(`x = −2: ${now('(−2)² − 4 × (−2)')} − 5 = 4 + 8 − 5 = 7<br>x = 1: 1 − 4 − 5 = −8`)}`,
        `<p><strong>Fill the whole row.</strong> The values go down, turn, and come back up in a mirror pattern.</p>
         ${fig({ kind: 'table', rows: [['x', '−2', '−1', '0', '1', '2', '3', '4', '5', '6'], ['y', '7', '0', '−5', '−8', '−9', '−8', '−5', '0', '7']] })}
         ${ans('7, 0, -5, -8, -9, -8, -5, 0, 7')}`,
        `<p><strong>Read the features.</strong> The middle of the mirror pattern is the turning point (2, −9), a minimum, so the axis is x = 2. The y-intercept is (0, −5) and y = 0 at x = −1 and x = 5.</p>`
      )}
      <p><strong>A minus in front of x²?</strong> Square first, then make it negative. For y = −x² + 3x at x = −2: −(−2)² + 3 × (−2) = −4 − 6 = −10.</p>
      ${tip('If the two middle y-values are equal, the axis is halfway between their x-values, like x = 2.5. Substitute that x to get the turning point.')}`,

    // Y9 10E Q13, Q14: solving and counting solutions from a table or graph
    'y9-10e-solve-table': `
      <p class="hp-tag">Worked example: use the table for <b>y = x² − 6x</b> to solve 0 = x² − 6x and −8 = x² − 6x. How many solutions does −9 = x² − 6x have?</p>
      ${fig({ kind: 'table', rows: [['x', '0', '1', '2', '3', '4', '5', '6'], ['y', '0', '−5', '−8', '−9', '−8', '−5', '0']] })}
      ${steps(
        `<p><strong>Find the y-value in the table and read the x-values above it.</strong> y = 0 at x = 0 and x = 6.</p>
         ${ans('x = 0 or x = 6')}`,
        `<p><strong>Same again for −8.</strong> y = −8 at x = 2 and x = 4.</p>
         ${ans('x = 2 or x = 4')}`,
        `<p><strong>−9 is the turning point.</strong> It appears only once, so there is just 1 solution. A value below −9, like −10, never appears: 0 solutions.</p>
         ${ans('1')}`
      )}
      ${tip('Picture a horizontal line at that y-value: crossing the parabola twice gives 2 solutions, touching the turning point gives 1, missing it gives 0.')}`,

    // Y9 10E Q11: is it possible?
    'y9-10e-possible': `
      <p class="hp-tag">Worked example: is it possible to draw a parabola (a) with its turning point on the y-axis? (b) that crosses the y-axis twice?</p>
      ${sketch(x => x * x + 2, [-2, 2], [0, 6], [[0, 2, '(0, 2)', 'se']], 'An upright parabola with its turning point on the y-axis', { sx: 1, sy: 0.6 })}
      ${steps(
        `<p><strong>(a) Try to sketch one.</strong> y = x² + 2 has its turning point at (0, 2), right on the y-axis. One example is enough.</p>
         ${ans('Yes')}`,
        `<p><strong>(b) Think about what the rule does.</strong> Each x-value gives exactly one y-value, and the y-axis is where x = 0. So there is exactly one point there.</p>
         ${ans('No')}`
      )}
      ${tip('If you can draw one example, the answer is yes. For a no, give a reason that works for every parabola.')}`,

    // Y9 10E Q6, Q7: reading a height graph
    'y9-10e-context': `
      <p class="hp-tag">Worked example: this graph shows the height h m of a ball, t seconds after it is thrown from a balcony.</p>
      ${fig({ kind: 'diagram', unit: 26, alt: 'A height graph: starts at 20 m, rises to 36 m at 4 seconds and reaches the ground at 10 seconds', items: [
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => ({ seg: [t * 0.7, 0, t * 0.7, 6.3], thin: true })),
        ...[1, 2, 3, 4, 5, 6].map(k => ({ seg: [0, k, 7, k], thin: true })),
        { seg: [0, 0, 7.5, 0], arrow: 'end' }, { seg: [0, 0, 0, 6.8], arrow: 'end' },
        { label: 't', at: [7.85, 0] }, { label: 'h', at: [0, 7.2] }, { label: 'O', at: [-0.3, -0.5] },
        ...[2, 4, 6, 8, 10].map(t => ({ label: String(t), at: [t * 0.7, -0.5] })),
        ...[1, 2, 3, 4, 5, 6].map(k => ({ label: String(k * 6), at: [-0.2, k - 0.05], anchor: 'end' })),
        { poly: ppath(t => -t * t + 8 * t + 20, [0, 10], [0, 36], 0.1).map(([t, h]) => [r3(t * 0.7), r3(h / 6)]), open: true },
        { point: [0, r3(20 / 6)], name: '(0, 20)', pos: 'e' }, { point: [2.8, 6], name: '(4, 36)', pos: 'n' }, { point: [7, 0], name: '(10, 0)', pos: 'ne' }] })}
      ${steps(
        `<p><strong>The starting height is where the curve meets the vertical axis</strong> (t = 0): 20 m.</p>`,
        `<p><strong>The highest point is the turning point,</strong> (4, 36). The ball is highest at 4 seconds, and that height is 36 m.</p>`,
        `<p><strong>It hits the ground when h = 0:</strong> at t = 10. It goes up for 4 s and comes down for 10 − 4 = 6 s, which is 2 s longer.</p>
         ${ans('lands at 10 s; 2 s longer coming down')}`
      )}
      ${tip('For "at what times is it at height 32 m?", go across from 32 on the h-axis: you hit the curve twice, going up and coming down. Type both times, like 2, 6.')}`,

    // Y9 10E Q8, Q9: using symmetry
    'y9-10e-symmetry': `
      <p class="hp-tag">Worked example: a parabola crosses the x-axis at <b>(−6, 0)</b> and <b>(2, 0)</b>, and its turning point has y-coordinate <b>−16</b>. Find its axis of symmetry and turning point.</p>
      ${sketch(x => x * x + 4 * x - 12, [-6.6, 2.6], [-16, 4], [[-6, 0, '−6', 'nw'], [2, 0, '2', 'ne'], [-2, -16, '(−2, −16)', 'e']], 'An upright parabola crossing the x-axis at −6 and 2, with a dashed axis of symmetry at x = −2', { sx: 0.6, sy: 0.3, axis: -2 })}
      ${steps(
        `<p><strong>The axis of symmetry is halfway between the x-intercepts.</strong> Average them.</p>
         ${sum('(−6 + 2) ÷ 2 = −4 ÷ 2 = −2')}
         ${ans('x = -2')}`,
        `<p><strong>The turning point sits on the axis.</strong> Its x is −2 and we were told its y is −16.</p>
         ${ans('(-2, -16)')}`,
        `<p><strong>Going the other way.</strong> A turning point at (1, 3) and an x-intercept at (−2, 0): −2 is 3 left of the axis x = 1, so the other intercept is 3 right of it, at (4, 0).</p>`
      )}
      ${tip('Type the axis like x = -2 and points like (4, 0).')}`,

    // Y9 10E Q10: finding the rule of a graph
    'y9-10e-rule': `
      <p class="hp-tag">Worked example: find the rule for this parabola.</p>
      ${pplane(x => x * x - 4 * x + 3, [-1, 5], [-2, 6], { '(0, 3)': [0, 3], '(1, 0)': [1, 0], '(2, −1)': [2, -1] }, 'An upright parabola crossing the x-axis at 1 and 3, with y-intercept 3 and turning point (2, −1)')}
      ${steps(
        `<p><strong>Read the key points and start a guess.</strong> It opens upward, so start from y = x² (a ∩ shape would need −x²). It cuts the y-axis at 3, and at x = 0 only the number on the end is left, so the rule ends in + 3.</p>`,
        `<p><strong>Trial and error: test each guess at the turning point (2, −1).</strong></p>
         ${sum('Try y = x² + 3: &nbsp; &nbsp; &nbsp; x = 2 gives 4 + 3 = 7, not −1 ✗<br>Try y = x² − 2x + 3: x = 2 gives 4 − 4 + 3 = 3, not −1 ✗<br>Try y = x² − 4x + 3: x = 2 gives 4 − 8 + 3 = −1 ✓')}`,
        `<p><strong>Check by substituting another known point.</strong> The graph crosses the x-axis at (1, 0). At x = 1: 1 − 4 + 3 = 0 ✓.</p>
         ${ans('y = x^2 - 4x + 3')}`
      )}
      <p><strong>Turning point on the y-axis?</strong> Then the rule is just y = x² + c or y = −x² + c. A ∪ with its lowest point at (0, −2) is y = x² − 2.</p>
      ${tip('Type the rule like y = x^2 - 4x + 3. A graph that opens downward needs a minus in front of x². Always test a guess at two points from the graph before you type it.')}`,

    // =====================================================================
    // 10F Sketching y = ax² with dilations and reflections
    // =====================================================================
    // Y9 10F Q1, Q2, Q3: tables for y = ax², wider or narrower
    'y9-10f-table': `
      <p class="hp-tag">Worked example: complete tables for <b>y = 2x²</b> and <b>y = −½x²</b> from x = −2 to 2, and compare them with y = x².</p>
      ${steps(
        `<p><strong>Square first, then multiply by the number in front.</strong></p>
         ${sum('y = 2x²: &nbsp; x = −2 gives 2 × (−2)² = 2 × 4 = 8<br>y = −½x²: x = −2 gives −½ × (−2)² = −½ × 4 = −2')}`,
        `<p><strong>Fill the tables.</strong></p>
         ${fig({ kind: 'table', rows: [['x', '−2', '−1', '0', '1', '2'], ['y = x²', '4', '1', '0', '1', '4'], ['y = 2x²', '8', '2', '0', '2', '8'], ['y = −½x²', '−2', '−1/2', '0', '−1/2', '−2']] })}
         ${ans('8, 2, 0, 2, 8 and -2, -1/2, 0, -1/2, -2')}`,
        `<p><strong>Compare the graphs.</strong> y = 2x² climbs twice as fast, so it is <b>narrower</b>. The ½ makes the other one <b>wider</b>, and the minus flips it upside down. All three turn at (0, 0). In the picture, the faint dashed curve is y = x².</p>
         ${pl([-3, 3], [-3, 8], [[x => x * x, true], [x => 2 * x * x], [x => -0.5 * x * x]], [],
           'y = 2x² is narrower than the faint y = x², and y = −½x² is wider and upside down')}`
      )}
      ${tip('Ignoring the sign, a bigger number in front gives a narrower graph. Type fractions with /, like -1/2.')}`,

    // Y9 10F Q4: ordering by width and direction
    'y9-10f-order': `
      <p class="hp-tag">Worked example: from <b>P: y = 6x², Q: y = −2x², R: y = 0.7x², S: y = −0.25x², T: y = −9x², U: y = x²/5</b>, pick the narrowest upright graph and the widest inverted graph.</p>
      ${steps(
        `<p><strong>Sort by sign.</strong> A positive number in front opens up (upright); a negative one opens down (inverted).</p>
         ${chips(['upright: P, R, U', 'add'], ['inverted: Q, S, T', 'take'])}`,
        `<p><strong>Narrowest upright: the biggest number.</strong> U is x²/5 = 0.2x², so compare 6, 0.7 and 0.2.</p>
         ${ans('P: y = 6x²')}`,
        `<p><strong>Widest inverted: the number closest to 0,</strong> ignoring the sign. Compare 2, 0.25 and 9.</p>
         ${ans('S: y = -0.25x²')}`
      )}
      ${tip('Width only depends on the size of the number; the sign only decides up or down.')}`,

    // Y9 10F Q5, Q10, Q11: finding a from a point
    'y9-10f-findA': `
      <p class="hp-tag">Worked example: this parabola has a rule of the form <b>y = ax²</b>. Find the rule.</p>
      ${pplane(x => 1.5 * x * x, [-3, 3], [-1, 7], { '(2, 6)': [2, 6] }, 'An upright parabola through the origin and the point (2, 6)')}
      ${steps(
        `<p><strong>Pick a point on the graph with whole numbers,</strong> other than (0, 0). Here (2, 6).</p>`,
        `<p><strong>Substitute it into y = ax² and solve for a.</strong></p>
         ${sum('6 = a × 2²<br>6 = 4a<br>a = 6/4 = 3/2')}
         ${ans('y = 3/2x^2')}`,
        `<p><strong>Check with another point.</strong> At x = −2: 3/2 × 4 = 6, and the graph does pass through (−2, 6) ✓.</p>`
      )}
      <p><strong>Big numbers work the same way.</strong> Through (200, 50): 50 = a × 40 000, so a = 1/800. To match graphs to rules, test each rule with the same point.</p>
      ${tip('Type the rule like y = 3/2x^2. A point with x = 1 is the easiest: there, y is the value of a.')}`,

    // Y9 10F Q6, Q7, Q8, Q9: reflections and dilations
    'y9-10f-transform': `
      <p class="hp-tag">Worked example: (a) describe how <b>y = x²</b> becomes <b>y = −(2/3)x²</b>. (b) <b>y = 2x²</b> is reflected in the x-axis, then dilated by a factor of 5 from the x-axis. Find the new rule.</p>
      ${steps(
        `<p><strong>(a) Read the number in front of x².</strong> The minus sign is a reflection in the x-axis. The size, 2/3, is a dilation by a factor of 2/3 from the x-axis.</p>`,
        `<p><strong>(b) Apply the changes to a.</strong> A reflection in the x-axis changes the sign; a dilation by 5 multiplies by 5.</p>
         ${sum('y = 2x² → y = −2x² → y = −10x²')}
         ${ans('y = -10x^2')}`,
        `<p><strong>Not sure? Follow one point.</strong> (1, 2) is on y = 2x². Reflect: (1, −2). Dilate by 5: (1, −10). So the new rule has a = −10 ✓.</p>`
      )}
      ${tip('Following a point is a good way to test what any transformation does. Type rules like y = -10x^2 or y = 2/3x^2.')}`,

    // =====================================================================
    // 10G Sketching translations of y = x²
    // =====================================================================
    // Y9 10G Q1, Q2, Q4, Q7, Q9: turning point and y-intercept from turning point form
    'y9-10g-tp': `
      <p>In <b>turning point form</b>, y = (x − h)² + k has its turning point at <b>(h, k)</b>.</p>
      <p class="hp-tag">Worked example: find the turning point and y-intercept of <b>y = (x + 6)² − 4</b>.</p>
      ${sketch(x => (x + 6) * (x + 6) - 4, [-10, 0.3], [-4, 34], [[-6, -4, '(−6, −4)', 'se'], [0, 32, '(0, 32)', 'e']], 'A sketch of an upright parabola with turning point (−6, −4) and y-intercept 32', { sx: 0.5, sy: 0.15 })}
      ${steps(
        `<p><strong>Match the bracket to (x − h).</strong> x + 6 is x − (−6), so h = −6. The number added on is k = −4.</p>
         ${ans('(-6, -4)')}`,
        `<p><strong>For the y-intercept, substitute x = 0.</strong></p>
         ${sum('(0 + 6)² − 4 = 36 − 4 = 32')}
         ${ans('(0, 32)')}`,
        `<p><strong>Minus in front?</strong> y = −(x − 7)² + 3 has its turning point at (7, 3), but it is a maximum. Square first, then make it negative: −(0 − 7)² + 3 = −49 + 3 = −46.</p>`
      )}
      <p><strong>Where does it cross the x-axis?</strong> Set y = 0: (x + 6)² = 4, so x + 6 = 2 or −2, giving x = −4 or x = −8.</p>
      ${tip('The sign inside the bracket flips: (x + 6) gives h = −6. Type points like (-6, -4).')}`,

    // Y9 10G Q8: rewriting into a(x − h)² + k form
    'y9-10g-reorder': `
      <p class="hp-tag">Worked example: write <b>y = 7 − (x − 1)²</b> in the form y = a(x − h)² + k and give a, h and k.</p>
      ${steps(
        `<p><strong>Swap the order of the two terms.</strong> The minus belongs to the bracket, so it moves with it.</p>
         ${sum('y = 7 − (x − 1)²<br>y = −(x − 1)² + 7')}`,
        `<p><strong>Read off the values.</strong> A minus in front means a = −1. The bracket gives h = 1, and k = 7.</p>
         ${ans('-1, 1, 7')}`,
        `<p><strong>The turning point is (h, k).</strong></p>
         ${ans('(1, 7)')}`
      )}
      <p><strong>No bracket?</strong> y = 6 + x² is y = 1(x − 0)² + 6, so a = 1, h = 0, k = 6.</p>
      ${tip('Type a, h and k in order with commas, like -1, 1, 7. Nothing in front of the bracket means a = 1.')}`,

    // Y9 10G Q3, Q5, Q6, Q10: from the graph to the rule
    'y9-10g-graph-rule': `
      <p class="hp-tag">Worked example: write the rule for this parabola in turning point form.</p>
      ${pplane(x => (x - 4) * (x - 4) + 1, [-1, 7], [-1, 8], { '(4, 1)': [4, 1] }, 'An upright parabola with turning point (4, 1)')}
      ${steps(
        `<p><strong>Which way does it open?</strong> Upward, so there is no minus in front.</p>`,
        `<p><strong>Read the turning point:</strong> (4, 1). So y = x² has moved 4 right and 1 up: h = 4 and k = 1.</p>
         ${sum('y = (x − 4)² + 1')}
         ${ans('y = (x-4)^2+1')}`,
        `<p><strong>Check with another point on the graph.</strong> At x = 2: (2 − 4)² + 1 = 4 + 1 = 5, and the graph passes through (2, 5) ✓.</p>`
      )}
      <p><strong>Same graph or not?</strong> Test a few x-values in both rules. y = (x − 6)² and y = x² − 12x + 36 both give 36 at x = 0 and 0 at x = 6. Expanding the bracket proves they match.</p>
      ${tip('Moving right means minus inside the bracket: 4 right gives (x − 4)². Moving left gives a plus.')}`,

    // Y9 10G Q11, Q12: y = x² + c through a point
    'y9-10g-find-c': `
      <p class="hp-tag">Worked example: find the rule (a) <b>y = x² + c</b> through (4, 10), (b) <b>y = −x² + c</b> through (−4, 2).</p>
      ${steps(
        `<p><strong>Substitute the point's x and y into the rule.</strong></p>
         ${sum('(a) 10 = 4² + c<br>10 = 16 + c')}`,
        `<p><strong>Solve for c and write the rule.</strong></p>
         ${sum('c = −6')}
         ${ans('y = x^2 - 6')}`,
        `<p><strong>(b) Square first, then apply the minus:</strong> −(−4)² = −16.</p>
         ${sum('2 = −16 + c<br>c = 18')}
         ${ans('y = -x^2 + 18')}`
      )}
      ${tip('A negative x squared is positive, so −x² at x = −4 is −16, not 16. Type rules like y = x^2 - 6.')}`,

    // Y9 10G Q13: y = (x − h)² through a point
    'y9-10g-find-h': `
      <p class="hp-tag">Worked example: a parabola <b>y = (x − h)²</b> passes through <b>(1, 36)</b>. Find both possible rules.</p>
      ${steps(
        `<p><strong>Substitute the point.</strong></p>
         ${sum('36 = (1 − h)²')}`,
        `<p><strong>Square root both sides, keeping both signs.</strong></p>
         ${sum('1 − h = 6 &nbsp; or &nbsp; 1 − h = −6<br>h = −5 &nbsp; or &nbsp; h = 7')}`,
        `<p><strong>Write both rules and check.</strong> (1 + 5)² = 36 ✓ and (1 − 7)² = 36 ✓.</p>
         ${ans('y = (x+5)^2 or y = (x-7)^2')}`
      )}
      ${tip('There are two rules because the point can be on either side of the turning point. Type them with "or" between.')}`,

    // Y9 10G Q14: rule from the turning point and y-intercept
    'y9-10g-tp-yint': `
      <p class="hp-tag">Worked example: a parabola has turning point <b>(6, 30)</b> and y-intercept <b>(0, −6)</b>. Its rule is y = (x − h)² + k or y = −(x − h)² + k. Find it.</p>
      ${steps(
        `<p><strong>The turning point gives h and k.</strong> h = 6, k = 30. Now decide if there is a minus in front.</p>`,
        `<p><strong>Test x = 0 in the upright rule.</strong></p>
         ${sum('(0 − 6)² + 30 = 36 + 30 = 66 ✗ (we need −6)')}`,
        `<p><strong>Test the inverted rule.</strong></p>
         ${sum('−(0 − 6)² + 30 = −36 + 30 = −6 ✓')}
         ${ans('y = -(x-6)^2+30')}`
      )}
      ${tip('Quick check: the y-intercept is below the turning point, so the graph comes down from it and must be inverted.')}`,

    // =====================================================================
    // 10H Sketching parabolas using intercept form
    // =====================================================================
    // Y9 10H Q1, Q9: intercepts from factorised form
    'y9-10h-intercepts': `
      <p class="hp-tag">Worked example: find the x-intercepts and y-intercept of <b>y = 3(x − 1)(x + 7)</b>.</p>
      ${steps(
        `<p><strong>x-intercepts: set y = 0.</strong> The 3 cannot be 0, so one of the brackets is.</p>
         ${sum('x − 1 = 0 or x + 7 = 0<br>x = 1 or x = −7')}
         ${ans('-7, 1')}`,
        `<p><strong>y-intercept: set x = 0.</strong></p>
         ${sum('3 × (0 − 1) × (0 + 7) = 3 × (−1) × 7 = −21')}
         ${ans('(0, -21)')}`,
        `<p><strong>Other shapes of bracket.</strong> y = x(x − 9) crosses at 0 and 9, and its y-intercept is (0, 0). A bracket like (5 − x) is 0 when x = 5.</p>`
      )}
      ${tip('The sign flips: (x + 7) gives x = −7. Type x-values like -7, 1 and the y-intercept as a point, like (0, -21).')}`,

    // Y9 10H Q2: y = x² + bx, factorise and sketch
    'y9-10h-common': `
      <p class="hp-tag">Worked example: for <b>y = x² + 10x</b>, factorise, then find the x-intercepts, axis of symmetry and turning point.</p>
      ${sketch(x => x * x + 10 * x, [-10.6, 0.6], [-25, 6], [[-10, 0, '−10', 'nw'], [0, 0, '', 'ne'], [-5, -25, '(−5, −25)', 'e']], 'A sketch of y = x² + 10x crossing at −10 and 0, with turning point (−5, −25)', { sx: 0.45, sy: 0.18, axis: -5 })}
      ${steps(
        `<p><strong>Take out the common factor x.</strong></p>
         ${sum('y = x(x + 10)')}
         ${ans('x(x+10)')}`,
        `<p><strong>x-intercepts:</strong> x = 0 or x + 10 = 0, so 0 and −10. The axis is halfway between them.</p>
         ${sum('(−10 + 0) ÷ 2 = −5, so x = −5')}`,
        `<p><strong>Substitute the axis value to get the turning point.</strong></p>
         ${sum('(−5)² + 10 × (−5) = 25 − 50 = −25')}
         ${ans('(-5, -25)')}`
      )}
      ${tip('A minus in front, like y = −x² + 10x = −x(x − 10), flips the graph so the turning point is a maximum. Halves are fine, like x = 0.5.')}`,

    // Y9 10H Q3, Q4: sketching from y = x² + bx + c
    'y9-10h-sketch': `
      <p class="hp-tag">Worked example: find the key features of <b>y = x² − 10x + 16</b>.</p>
      ${sketch(x => x * x - 10 * x + 16, [-0.5, 10.5], [-9, 21], [[0, 16, '(0, 16)', 'e'], [2, 0, '2', 'nw'], [8, 0, '8', 'ne'], [5, -9, '(5, −9)', 'se']], 'A sketch of y = x² − 10x + 16 with y-intercept 16, x-intercepts 2 and 8, and turning point (5, −9)', { sx: 0.6, sy: 0.25, axis: 5 })}
      ${steps(
        `<p><strong>y-intercept:</strong> put x = 0, which leaves the number term: (0, 16). <strong>Then factorise</strong>: −2 and −8 multiply to 16 and add to −10.</p>
         ${sum('y = (x − 2)(x − 8), so the x-intercepts are 2 and 8')}`,
        `<p><strong>Axis of symmetry:</strong> halfway between the x-intercepts.</p>
         ${sum('(2 + 8) ÷ 2 = 5, so x = 5')}`,
        `<p><strong>Turning point:</strong> substitute x = 5.</p>
         ${sum('5² − 10 × 5 + 16 = 25 − 50 + 16 = −9')}
         ${ans('(5, -9)')}`
      )}
      <p><strong>No x term?</strong> y = 49 − x² crosses at 7 and −7, and its turning point is also its y-intercept, (0, 49).</p>
      ${tip('Type the axis as x = 5 and points as (5, -9). A perfect square like (x + 5)² touches the x-axis once: type just one x-value.')}`,

    // Y9 10H Q5: using symmetry to find a missing number
    'y9-10h-symmetry': `
      <p class="hp-tag">Worked example: (a) a parabola crosses the x-axis at <b>−2</b> and <b>7</b>. What is the x-coordinate of its turning point? (b) Another has its turning point at x = <b>−1</b> and crosses at <b>3</b>. Where else does it cross?</p>
      ${sketch(x => -(x + 1) * (x + 1) + 16, [-5.6, 3.6], [-3, 16], [[3, 0, '3', 'ne'], [-5, 0, '?', 'nw'], [-1, 16, 'x = −1', 'nw']], 'A sketch of an inverted parabola with turning point at x = −1, crossing the x-axis at 3 and at an unknown point', { sx: 0.6, sy: 0.25, axis: -1 })}
      ${steps(
        `<p><strong>(a) The turning point is halfway between the x-intercepts.</strong></p>
         ${sum('(−2 + 7) ÷ 2 = 5 ÷ 2 = 2.5')}
         ${ans('2.5')}`,
        `<p><strong>(b) Count the gap from the known intercept to the axis.</strong> From 3 to −1 is 4 units left.</p>`,
        `<p><strong>Go the same distance on the other side.</strong></p>
         ${sum('−1 − 4 = −5')}
         ${ans('-5')}`
      )}
      ${tip('A parabola is a mirror image either side of its axis, so matching points are the same distance from it.')}`,

    // Y9 10H Q6, Q7: flight paths
    'y9-10h-flight': `
      <p class="hp-tag">Worked example: a stone's path is <b>y = 0.5x(60 − x)</b>, where y is its height and x is the distance across, in metres. How far does it travel, and how high does it go?</p>
      ${sketch(x => 0.5 * x * (60 - x), [0, 60], [0, 450], [[60, 0, '60', 'ne'], [30, 450, '(30, 450)', 'n']], 'A sketch of an arch from 0 to 60 across, highest at (30, 450)', { sx: 0.11, sy: 0.011, axis: 30 })}
      ${steps(
        `<p><strong>It lands when y = 0.</strong> x = 0 (the start) or 60 − x = 0, so x = 60.</p>
         ${ans('60')}`,
        `<p><strong>The highest point is halfway across,</strong> at x = 30.</p>`,
        `<p><strong>Substitute x = 30.</strong></p>
         ${sum('0.5 × 30 × (60 − 30) = 0.5 × 30 × 30 = 450')}
         ${ans('450')}`
      )}
      ${tip('If the rule is not factorised, like y = 50x − x², take out x first: y = x(50 − x).')}`,

    // Y9 10H Q10: both forms of the same quadratic
    'y9-10h-two-forms': `
      <p class="hp-tag">Worked example: write <b>y = x² − 8x + 7</b> in the form y = (x − h)² + k.</p>
      ${steps(
        `<p><strong>Find the x-intercepts by factorising.</strong></p>
         ${sum('y = (x − 1)(x − 7), so x = 1 or x = 7')}`,
        `<p><strong>The turning point is halfway, at x = 4.</strong> Substitute to get its y-value.</p>
         ${sum('4² − 8 × 4 + 7 = 16 − 32 + 7 = −9')}`,
        `<p><strong>The turning point (4, −9) gives h and k.</strong></p>
         ${sum('y = (x − 4)² − 9')}
         ${ans('h = 4, k = -9')}`
      )}
      ${tip('Check by expanding: (x − 4)² − 9 = x² − 8x + 16 − 9 = x² − 8x + 7 ✓. Type h and k as numbers, like 4 and -9.')}`,

    // Y9 10H Q11: intercept form with a number in front
    'y9-10h-find-a': `
      <p class="hp-tag">Worked example: a parabola has x-intercepts <b>−3</b> and <b>2</b>, and y-intercept <b>12</b>. Find its rule in the form y = a(x − p)(x − q).</p>
      ${sketch(x => -2 * (x + 3) * (x - 2), [-3.6, 2.6], [-6, 12.5], [[-3, 0, '−3', 'nw'], [2, 0, '2', 'ne'], [0, 12, '12', 'ne']], 'A sketch of an inverted parabola crossing the x-axis at −3 and 2, and the y-axis at 12', { sx: 0.8, sy: 0.35 })}
      ${steps(
        `<p><strong>The x-intercepts give the brackets</strong> (signs flip).</p>
         ${sum('y = a(x + 3)(x − 2)')}`,
        `<p><strong>Substitute the y-intercept (0, 12) to find a.</strong></p>
         ${sum('12 = a(0 + 3)(0 − 2)<br>12 = −6a<br>a = −2')}`,
        `<p><strong>Write the rule.</strong> a is negative, so the graph opens downward, which matches the sketch.</p>
         ${ans('y = -2(x+3)(x-2)')}`
      )}
      ${tip('Type the rule like y = -2(x+3)(x-2). A fraction for a is fine, like y = -1/2(x+1)(x-5).')}`
  });
})();
