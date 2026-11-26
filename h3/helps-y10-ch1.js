/* H3 help panels for Year 10 Chapter 1. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 1A to 1L. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  const q = (v) => Math.round(v * 1000) / 1000;
  const mn = (s) => String(s).replace(/-/g, '−');

  // Number line with a ray or a segment, drawn the same way as the question figures.
  // a or b = null means the line runs off that end with an arrow. Closed = filled circle (included).
  const nl = (min, max, a, aClosed, b, bClosed, alt) => {
    const items = [{ seg: [min - 0.6, 0, max + 0.6, 0], thin: true }];
    for (let v = min; v <= max; v++) items.push({ seg: [v, -0.14, v, 0.14], thin: true }, { label: mn(v), at: [v, -0.62] });
    items.push({ label: 'x', at: [max + 1, 0.05] });
    const x0 = a == null ? min - 0.5 : a, x1 = b == null ? max + 0.5 : b, o = 0.0361;
    const main = { seg: [x0, 0, x1, 0] };
    if (a == null) main.arrow = 'start'; else if (b == null) main.arrow = 'end';
    items.push({ seg: [x0, -o, x1, -o] }, main, { seg: [x0, o, x1, o] });
    const dot = (v, closed) => closed ? [0.1806, 0.15, 0.1194, 0.0889, 0.0583, 0.0278].map(r => ({ circle: [v, 0, r] })) : [{ circle: [v, 0, 0.1806], fill: true }];
    if (a != null) items.push(...dot(a, aClosed));
    if (b != null) items.push(...dot(b, bClosed));
    return fig({ kind: 'diagram', unit: 36, items, alt: alt || 'A number line' });
  };

  // The part of y = mx + c (or the vertical line x = v) inside the box xr by yr, as a segment.
  const segIn = (l, xr, yr) => {
    const [x0, x1] = xr, [y0, y1] = yr;
    if (l.v != null) return [l.v, y0, l.v, y1];
    let xa = x0, xb = x1;
    if (l.m !== 0) {
      const xs = [(y0 - l.c) / l.m, (y1 - l.c) / l.m].sort((u, w) => u - w);
      xa = Math.max(x0, xs[0]); xb = Math.min(x1, xs[1]);
    }
    return [q(xa), q(l.m * xa + l.c), q(xb), q(l.m * xb + l.c)];
  };
  const axes = (xr, yr) => [{ seg: [xr[0], 0, xr[1] + 0.5, 0], thin: true, arrow: 'end' }, { seg: [0, yr[0], 0, yr[1] + 0.5], thin: true, arrow: 'end' },
    { label: 'x', at: [xr[1] + 0.9, 0] }, { label: 'y', at: [0, yr[1] + 0.95] }, { label: 'O', at: [-0.25, -0.5], anchor: 'end' }];
  // Straight lines on small axes. ls: [{ m, c } or { v }, with label, at, dash]; pts: [[x, y, name, pos]].
  const graph = (xr, yr, ls, pts, alt, unit = 24) => {
    const items = axes(xr, yr);
    for (const l of ls) {
      items.push(Object.assign({ seg: segIn(l, xr, yr) }, l.dash ? { dash: true } : {}));
      if (l.label) items.push({ label: l.label, at: l.at, anchor: l.anchor || 'start' });
    }
    for (const [x, y, name, pos] of pts || []) items.push({ point: [x, y], name: name == null ? mn('(' + x + ', ' + y + ')') : name, pos: pos || 'ne' });
    return fig({ kind: 'diagram', unit, items, alt });
  };
  // A shaded region: the box cut down by half-planes [a, b, c] meaning ax + by ≤ c, hatched like the question figures.
  const clipHalf = (poly, a, b, c) => {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const P = poly[i], Q = poly[(i + 1) % poly.length];
      const fp = a * P[0] + b * P[1] - c, fq = a * Q[0] + b * Q[1] - c;
      if (fp <= 0) out.push(P);
      if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
    }
    return out;
  };
  const region = (xr, yr, halves, ls, pts, alt, unit = 24) => {
    const [x0, x1] = xr, [y0, y1] = yr;
    let poly = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    for (const h of halves) poly = clipHalf(poly, ...h);
    const items = [];
    for (let k = Math.ceil((x0 - y1) / 0.45) * 0.45; k <= x1 - y0; k += 0.45) {
      const P = [];
      for (let i = 0; i < poly.length; i++) {
        const A = poly[i], B = poly[(i + 1) % poly.length], fa = A[0] - A[1] - k, fb = B[0] - B[1] - k;
        if (fa === 0) P.push(A);
        if (fa * fb < 0) { const t = fa / (fa - fb); P.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); }
      }
      if (P.length >= 2) { P.sort((u, w) => u[0] - w[0]); const a = P[0], b = P[P.length - 1]; if (b[0] - a[0] > 0.05) items.push({ seg: [q(a[0]), q(a[1]), q(b[0]), q(b[1])], thin: true }); }
    }
    items.push(...axes(xr, yr));
    for (const l of ls) {
      items.push(Object.assign({ seg: segIn(l, xr, yr) }, l.dash ? { dash: true } : {}));
      if (l.label) items.push({ label: l.label, at: l.at, anchor: l.anchor || 'start' });
    }
    for (const [x, y, name, pos] of pts || []) items.push({ point: [x, y], name: name == null ? mn('(' + x + ', ' + y + ')') : name, pos: pos || 'ne' });
    return fig({ kind: 'diagram', unit, items, alt });
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 1A Review of algebra
    // =====================================================================
    // y10-1A Q1: collecting like terms
    // method: Example 1, 1A (collecting like terms)
    'y10-1a-like': `
      <p class="hp-tag">Worked example: simplify (a) <b>4m + 9m</b> (b) <b>5x²y − 8yx²</b> (c) <b>4ab + 3a²b − ab + 2ba²</b></p>
      ${steps(
        `<p><strong>Find the like terms.</strong> They have exactly the same letters with the same powers. The order of the letters does not matter: yx² is the same as x²y, and ba² is the same as a²b. But ab and a²b are not like terms.</p>`,
        `<p><strong>Keep the letters and add or subtract the numbers in front.</strong> The + or − sign belongs to the term straight after it.</p>
         ${sum('(a) 4m + 9m = 13m<br>(b) 5x²y − 8x²y = −3x²y<br>(c) 4ab − ab + 3a²b + 2a²b = 3ab + 5a²b')}
         ${ans('13m, −3x^2y, 3ab+5a^2b')}`
      )}
      ${tip('A term with no number in front has a 1: ab means 1ab, so 4ab − ab = 3ab. Type powers with ^, like 5a^2b. Terms that are not alike stay as they are.')}`,

    // y10-1A Q2: multiplying and dividing terms
    // method: Example 2, 1A (multiplying and dividing expressions)
    'y10-1a-multiply': `
      <p class="hp-tag">Worked example: simplify (a) <b>4c × 9d</b> (b) <b>−5pq × 2p</b> (c) <b>−6xy/(15y)</b></p>
      ${steps(
        `<p><strong>Multiplying: multiply the numbers, then write the letters together.</strong> Remove the × sign.</p>
         ${sum('(a) 4c × 9d = 36cd')}`,
        `<p><strong>The same letter twice makes a square.</strong> p × p = p².</p>
         ${sum('(b) −5pq × 2p = −10p²q')}`,
        `<p><strong>Dividing: cancel the highest common factor of the numbers, and cancel any letter that is on the top and the bottom.</strong> The HCF of 6 and 15 is 3, and the y cancels.</p>
         ${sum('(c) −6xy/(15y) = −2x/5')}
         ${ans('36cd, −10p^2q, −2x/5')}`
      )}
      ${tip('Watch the signs: a negative times a negative is positive, so −3a × (−4b) = 12ab. Type a fraction answer with /, like -2x/5.')}`,

    // y10-1A Q3, Q4: expanding brackets
    // method: Example 3, 1A (expanding brackets)
    'y10-1a-expand': `
      <p class="hp-tag">Worked example: expand (a) <b>7(x + 5)</b> (b) <b>−3y(2y − 5x)</b> (c) <b>2(x + 5) − 3(4x − 1)</b></p>
      ${steps(
        `<p><strong>Multiply the term outside by every term inside.</strong></p>
         ${sum('(a) 7(x + 5) = 7 × x + 7 × 5 = 7x + 35')}`,
        `<p><strong>Take the sign with the term outside.</strong> −3y × 2y = −6y², and −3y × (−5x) = +15xy.</p>
         ${sum('(b) −3y(2y − 5x) = −6y² + 15xy')}`,
        `<p><strong>Two brackets: expand each one, then collect like terms.</strong></p>
         ${sum(`(c) 2(x + 5) − 3(4x − 1) = 2x + 10 − 12x + 3<br>= ${now('−10x + 13')}`)}
         ${ans('7x+35, 15xy-6y^2, 13-10x')}`
      )}
      <p><strong>Powers:</strong> a × a² = a³, so −2a(a² − 3a + 1) = −2a³ + 6a² − 2a.</p>
      ${tip('The minus in front of the second bracket multiplies both terms: −3 × (−1) = +3. Type y² as y^2; the terms can go in any order.')}`,

    // y10-1A Q5: factorising with the highest common factor
    // method: Example 4, 1A (factorising simple algebraic expressions)
    'y10-1a-factorise': `
      <p class="hp-tag">Worked example: factorise (a) <b>9x − 36</b> (b) <b>4x² + 20x</b> (c) <b>10a²b − 4ab</b> (d) <b>−6m² − 9m</b></p>
      ${steps(
        `<p><strong>Find the HCF of all the terms</strong>: the biggest number and the most letters that go into every term.</p>
         ${sum('(a) HCF 9 &nbsp; (b) HCF 4x &nbsp; (c) HCF 2ab &nbsp; (d) HCF −3m')}`,
        `<p><strong>Write the HCF outside a bracket. Inside, write what is left of each term</strong> after dividing it by the HCF.</p>
         ${sum('(a) 9(x − 4) &nbsp; (b) 4x(x + 5)<br>(c) 2ab(5a − 2) &nbsp; (d) −3m(2m + 3)')}`,
        `<p><strong>Check by expanding.</strong> 4x(x + 5) = 4x² + 20x ✓</p>
         ${ans('9(x-4), 4x(x+5), 2ab(5a-2), -3m(2m+3)')}`
      )}
      <p><strong>When a term is the whole HCF</strong>, a 1 is left behind: xy² + xy = xy(y + 1).</p>
      ${tip('If the first term is negative, take out a negative HCF, and every sign inside the bracket flips. Type it as -3m(2m+3).')}`,

    // y10-1A Q6, Q9: substituting values (including negatives)
    // method: Example 5, 1A (evaluating expressions)
    'y10-1a-substitute': `
      <p class="hp-tag">Worked example: evaluate when <b>a = −4</b>, <b>b = 3</b> and <b>c = −5</b>: (a) <b>a² − 2bc</b> (b) <b>(b − a)/7</b> (c) <b>√(a² + b²)</b></p>
      ${steps(
        `<p><strong>Replace each letter with its value in brackets.</strong> Brackets keep the negative signs safe.</p>
         ${sum('(a) (−4)² − 2(3)(−5) = 16 − (−30) = 16 + 30 = 46')}`,
        `<p><strong>Follow the order of operations.</strong> Work out the top of a fraction or the inside of a root first.</p>
         ${sum('(b) (3 − (−4))/7 = 7/7 = 1<br>(c) √((−4)² + 3²) = √(16 + 9) = √25 = 5')}
         ${ans('46, 1, 5')}`
      )}
      <p><strong>Negatives and powers.</strong> With a = −4: a² = (−4)² = 16, but −a² = −(16) = −16, and a³ = (−4)³ = −64. An even power of a negative is positive; an odd power stays negative.</p>
      ${tip('Subtracting a negative is adding: 16 − (−30) = 46. Type a negative answer with a minus sign, like -16.')}`,

    // y10-1A Q7, Q8: perimeter and area with expressions
    // method: Example 3, 1A (expand and simplify) and Key ideas, 1A (collecting like terms)
    'y10-1a-shapes': `
      <p class="hp-tag">Worked example: all the angles are right angles. Find the perimeter P and the area A.</p>
      ${fig({ kind: 'diagram', unit: 30, items: [
        { poly: [[0, 0], [6, 0], [6, 2], [3, 2], [3, 5], [0, 5]], fill: true },
        { label: 'x + 1', at: [3, -0.5] }, { label: 'x', at: [-0.4, 2.5], anchor: 'end' }, { label: '3', at: [1.5, 5.45] }, { label: '2', at: [6.4, 1], anchor: 'start' }
      ], alt: 'An L-shape: the bottom is x + 1, the left side is x, the top is 3 and the short right side is 2' })}
      ${steps(
        `<p><strong>Find the missing sides.</strong> The pieces going one way add up to the side opposite them.</p>
         ${sum('across the step: (x + 1) − 3 = x − 2<br>up the step: x − 2 = x − 2')}`,
        `<p><strong>Perimeter: add all six sides and collect like terms.</strong></p>
         ${sum('P = (x + 1) + 2 + (x − 2) + (x − 2) + 3 + x = 4x + 2')}`,
        `<p><strong>Area: split into rectangles, expand each, then add.</strong></p>
         ${sum('bottom: 2(x + 1) = 2x + 2<br>top: 3(x − 2) = 3x − 6<br>A = 2x + 2 + 3x − 6 = 5x − 4')}
         ${ans('P = 4x+2, A = 5x-4')}`
      )}
      <p><strong>A rectangle with sides x + 3 and 2x</strong> has area 2x(x + 3) = 2x² + 6x.</p>
      ${tip('Check with a number: x = 5 makes the sides 6, 2, 3, 3, 3 and 5, which add to 22, and 4(5) + 2 = 22 ✓. Type x² as x^2.')}`,

    // y10-1A Q10, Q11: is it always true?
    // method: Key ideas, 1A (associative, commutative, identity and inverse properties)
    'y10-1a-laws': `
      <p class="hp-tag">Worked example: is each statement true for all values of p, q and r? (a) <b>p(q + r) = pq + pr</b> (b) <b>p + q × r = (p + q) × r</b></p>
      ${steps(
        `<p><strong>Is it a law you know?</strong> (a) is the distributive law, so it is true for all values.</p>`,
        `<p><strong>If not, try some numbers.</strong> One example that fails is enough to show it is not always true. Try p = 1, q = 2, r = 3 in (b):</p>
         ${sum('left: 1 + 2 × 3 = 1 + 6 = 7<br>right: (1 + 2) × 3 = 3 × 3 = 9')}
         <p>7 is not 9, so (b) is not always true.</p>
         ${ans('(a) True for all values (b) Not always true')}`
      )}
      ${chips(['ab = ba, a + b = b + a', 'add'], ['(ab)c = a(bc), (a + b) + c = a + (b + c)', 'add'], ['a − b ≠ b − a, a/b ≠ b/a', 'take'])}
      <p><strong>Words can be ambiguous.</strong> "The product of p and q plus 2" could mean pq + 2 or p(q + 2). Brackets show which one is meant.</p>
      ${tip('Swapping the order is fine for + and ×, but not for − and ÷. Regrouping with brackets is fine for + and ×, but not for − and ÷.')}`,

    // y10-1A Q12: perimeter and area with circle parts
    // method: no worked example in the book (circle parts: arc = fraction of 2πr, area = fraction of πr²)
    'y10-1a-pi': `
      <p class="hp-tag">Worked example: a semicircle sits on top of a rectangle <b>2x</b> wide and <b>x + 3</b> tall. Find P and A, leaving π in the answer.</p>
      ${fig({ kind: 'diagram', unit: 34, items: [
        { poly: [[0, 4.5], [0, 0], [3, 0], [3, 4.5]], open: true }, { arc: [1.5, 4.5, 1.5, 0, 180] }, { seg: [0, 4.5, 3, 4.5], dash: true, thin: true },
        { angle: [0, 0, 0, 90], right: true }, { angle: [3, 0, 90, 180], right: true },
        { label: '2x', at: [1.5, -0.5] }, { label: 'x + 3', at: [3.35, 2.25], anchor: 'start' }
      ], alt: 'A rectangle 2x wide and x + 3 tall with a semicircle on top' })}
      ${steps(
        `<p><strong>The semicircle has diameter 2x, so its radius is x.</strong> Its curved edge is half of a circle's circumference.</p>
         ${sum('arc = ½ × 2πr = ½ × 2π × x = πx')}`,
        `<p><strong>Perimeter: only the outside edges.</strong> The dashed line is inside the shape, so leave it out.</p>
         ${sum('P = 2x + (x + 3) + (x + 3) + πx = 4x + 6 + πx')}`,
        `<p><strong>Area: rectangle plus half a circle.</strong></p>
         ${sum('A = 2x(x + 3) + ½πx² = 2x² + 6x + πx²/2')}
         ${ans('4x + 6 + pi*x and 2x^2 + 6x + pi*x^2/2')}`
      )}
      ${tip('A quarter circle has arc 2πr ÷ 4 = πr/2 and area πr²/4. Type π as pi, like pi*x/2, and do not change π into a decimal.')}`,

    // =====================================================================
    // Year 10 1B Solving linear equations
    // =====================================================================
    // y10-1B Q1: two-step equations
    // method: Example 6a, 1B (solving linear equations)
    'y10-1b-solve': `
      <p class="hp-tag">Worked example: solve (a) <b>6x + 13 = 1</b> (b) <b>8 − 3x = 23</b> and check by substituting.</p>
      ${steps(
        `<p><strong>Do the same thing to both sides.</strong> First remove the number added or taken away, then divide by the number in front of x.</p>
         ${sum('(a) 6x + 13 = 1<br>6x = −12 &nbsp;&nbsp;(− 13 from both sides)<br>x = −2 &nbsp;&nbsp;(÷ 6)')}`,
        `<p><strong>Keep the sign with the x term.</strong> In (b) the x term is −3x, so divide by −3.</p>
         ${sum('(b) 8 − 3x = 23<br>−3x = 15 &nbsp;&nbsp;(− 8)<br>x = −5 &nbsp;&nbsp;(÷ (−3))')}`,
        `<p><strong>Check in the original equation.</strong></p>
         ${sum('(a) 6(−2) + 13 = 1 ✓ &nbsp; (b) 8 − 3(−5) = 8 + 15 = 23 ✓')}
         ${ans('-2 and -5')}`
      )}
      ${tip('If the answer is not a whole number, leave it as a fraction: 6x − 1 = 3 gives 6x = 4, so x = 2/3. Type it as 2/3.')}`,

    // y10-1B Q2: brackets and x on both sides
    // method: Example 6b, 1B (expand, gather like terms, then solve)
    'y10-1b-brackets': `
      <p class="hp-tag">Worked example: solve (a) <b>5(2x − 3) = 7x</b> (b) <b>2(4x + 1) − 3(x − 2) = 23</b> (c) <b>3(x + 4) = 5(x − 2)</b></p>
      ${steps(
        `<p><strong>Expand the brackets.</strong></p>
         ${sum('(a) 10x − 15 = 7x<br>(b) 8x + 2 − 3x + 6 = 23, so 5x + 8 = 23<br>(c) 3x + 12 = 5x − 10')}`,
        `<p><strong>Gather the x terms on one side</strong> by taking the smaller x term from both sides.</p>
         ${sum('(a) 3x − 15 = 0<br>(c) 12 = 2x − 10')}`,
        `<p><strong>Finish like a two-step equation.</strong></p>
         ${sum('(a) 3x = 15, x = 5<br>(b) 5x = 15, x = 3<br>(c) 22 = 2x, x = 11')}
         ${ans('5, 3, 11')}`
      )}
      ${tip('Careful with a minus in front of a bracket: −3(x − 2) = −3x + 6. Check by substituting: 3(11 + 4) = 45 and 5(11 − 2) = 45 ✓.')}`,

    // y10-1B Q3: equations with fractions
    // method: Example 7a and 7b, 1B (solving equations involving fractions)
    'y10-1b-fraction': `
      <p class="hp-tag">Worked example: solve (a) <b>(x − 5)/3 = 4</b> (b) <b>9 − x/4 = 6</b> (c) <b>2x/5 + 1 = 9</b></p>
      ${steps(
        `<p><strong>All of the top divided by 3?</strong> Multiply both sides by 3 first.</p>
         ${sum('(a) x − 5 = 12 &nbsp;&nbsp;(× 3)<br>x = 17')}`,
        `<p><strong>Only x divided?</strong> Move the other number first. In (b) the minus sign stays with x/4, so multiply by −4.</p>
         ${sum('(b) −x/4 = −3 &nbsp;&nbsp;(− 9)<br>x = 12 &nbsp;&nbsp;(× (−4))')}`,
        `<p><strong>Then undo the fraction.</strong></p>
         ${sum('(c) 2x/5 = 8 &nbsp;&nbsp;(− 1)<br>2x = 40 &nbsp;&nbsp;(× 5)<br>x = 20')}
         ${ans('17, 12, 20')}`
      )}
      ${tip('Check (b): 9 − 12/4 = 9 − 3 = 6 ✓. A fraction bar works like a bracket round the top.')}`,

    // y10-1B Q4: fractions with x on both sides or extra terms
    // method: Example 7c, 1B (multiply by the denominator, include brackets, then gather like terms)
    'y10-1b-fraction-both': `
      <p class="hp-tag">Worked example: solve (a) <b>(7 − x)/2 = x + 5</b> (b) <b>(x + 1)/4 − 3 = 2</b> (c) <b>3 − (4 − x)/2 = 7</b></p>
      ${steps(
        `<p><strong>Multiply both sides by the bottom, putting brackets round the other side.</strong></p>
         ${sum('(a) 7 − x = 2(x + 5)<br>7 − x = 2x + 10<br>7 = 3x + 10 &nbsp;&nbsp;(+ x)<br>−3 = 3x, so x = −1')}`,
        `<p><strong>A number outside the fraction?</strong> Move it first, so the fraction is on its own.</p>
         ${sum('(b) (x + 1)/4 = 5 &nbsp;&nbsp;(+ 3)<br>x + 1 = 20, so x = 19')}`,
        `<p><strong>A minus in front of the fraction</strong> stays with it. Multiply by −2.</p>
         ${sum('(c) −(4 − x)/2 = 4 &nbsp;&nbsp;(− 3)<br>4 − x = −8 &nbsp;&nbsp;(× (−2))<br>−x = −12, so x = 12')}
         ${ans('-1, 19, 12')}`
      )}
      ${tip('Always check: in (a), (7 − (−1))/2 = 4 and −1 + 5 = 4 ✓.')}`,

    // y10-1B Q5, Q9, Q10: writing an equation from words
    // method: Example 6, 1B (write the equation, then solve with the same steps)
    'y10-1b-words': `
      <p class="hp-tag">Worked example: write an equation and solve it. (a) When 3 times x is subtracted from 20, the result is 29. (b) 8 less than x, when tripled, is 15. (c) Two consecutive whole numbers add to 63.</p>
      ${steps(
        `<p><strong>Turn the words into symbols, in order.</strong> "Subtracted from 20" means 20 − ... and "8 less than x" means x − 8.</p>
         ${sum('(a) 20 − 3x = 29<br>(b) 3(x − 8) = 15<br>(c) x + (x + 1) = 63')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('(a) −3x = 9, x = −3<br>(b) 3x − 24 = 15, 3x = 39, x = 13<br>(c) 2x + 1 = 63, 2x = 62, x = 31')}`,
        `<p><strong>Answer the question.</strong> In (c) the numbers are x and x + 1.</p>
         ${ans('-3, 13, and 31, 32')}`
      )}
      ${tip('A square with side s has perimeter 4s. Consecutive numbers are x and x + 1. Type a list with commas, like 31, 32.')}`,

    // y10-1B Q6: combining fractions, then solving
    // method: Example 8, 1B (solving equations by combining simple algebraic fractions)
    'y10-1b-combine': `
      <p class="hp-tag">Worked example: (a) simplify <b>x/4 + x/6</b> (b) hence solve <b>x/4 + x/6 = 10</b></p>
      ${steps(
        `<p><strong>Write both fractions over the lowest common denominator (LCD).</strong> The LCD of 4 and 6 is 12.</p>
         ${sum('x/4 + x/6 = 3x/12 + 2x/12')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('= 5x/12')}`,
        `<p><strong>Solve using the single fraction.</strong></p>
         ${sum('5x/12 = 10<br>5x = 120 &nbsp;&nbsp;(× 12)<br>x = 24 &nbsp;&nbsp;(÷ 5)')}
         ${ans('5x/12 and 24')}`
      )}
      <p><strong>Subtracting works the same way:</strong> 3x/5 − x/2 = 6x/10 − 5x/10 = x/10.</p>
      ${tip('Type the simplified fraction like 5x/12. If x is not a whole number, a fraction like 40/7 is fine.')}`,

    // y10-1B Q7, Q8: formulas and charges
    // method: Example 6, 1B (substitute, then solve the linear equation)
    'y10-1b-context': `
      <p class="hp-tag">Worked example: (a) <b>P = 2(l + w)</b>. Find w when P = 34 and l = 11. (b) A plumber charges <b>$70</b> to come out plus <b>$38</b> per hour.</p>
      ${steps(
        `<p><strong>Substitute the values you know, then solve for the one you do not.</strong></p>
         ${sum('(a) 34 = 2(11 + w)<br>34 = 22 + 2w<br>12 = 2w, so w = 6')}`,
        `<p><strong>Write a rule for the charge.</strong> Cost = 70 + 38h.</p>
         ${sum('4 hours: 70 + 38 × 4 = 70 + 152 = 222')}`,
        `<p><strong>Know the cost? Make an equation.</strong> A bill of $412:</p>
         ${sum('70 + 38h = 412<br>38h = 342<br>h = 9')}
         ${ans('6; $222; 9 hours')}`
      )}
      ${tip('Read the units: 3 days of 7 hours is 21 hours. If h comes out as 9.3, the nearest half hour is 9.5. Leave off the $ sign when you type.')}`,

    // y10-1B Q11, Q12: rates (filling and travelling)
    // method: Example 6, 1B (write an equation for the situation, then solve)
    'y10-1b-rate': `
      <p class="hp-tag">Worked example: (a) A bath holds <b>20 L</b> and the taps add <b>3 L every 5 seconds</b>. (b) Leo runs twice as fast as he walks. He walks <b>3 km in 45 minutes</b>, then runs for <b>30 minutes</b>.</p>
      ${steps(
        `<p><strong>Turn the rate into "per one".</strong> 3 L every 5 s is 3 ÷ 5 = 0.6 L per second, so V = 20 + 0.6t.</p>
         ${sum('after 2 min (120 s): V = 20 + 0.6 × 120 = 20 + 72 = 92 L')}`,
        `<p><strong>Make an equation for "how long".</strong> To reach 80 L:</p>
         ${sum('20 + 0.6t = 80<br>0.6t = 60, so t = 100 s')}`,
        `<p><strong>Speeds: let w be the walking speed in km per minute.</strong></p>
         ${sum('45w = 3, so w = 1/15<br>running speed = 2/15 km per min<br>distance run = 2/15 × 30 = 4 km')}
         ${ans('92 L, 100 s, 4 km')}`
      )}
      ${tip('Keep the units matching: change minutes into seconds (or seconds into minutes) before you put them in the equation.')}`,

    // y10-1B Q13: expand first or divide first
    // method: Example 6b, 1B (expanding brackets) and Key ideas, 1B (inverse operations)
    'y10-1b-methods': `
      <p class="hp-tag">Worked example: solve <b>4(x + 2) = 28</b> in two ways.</p>
      ${steps(
        `<p><strong>Expand first.</strong></p>
         ${sum('4x + 8 = 28<br>4x = 20<br>x = 5')}`,
        `<p><strong>Divide both sides by 4 first.</strong> 28 divides by 4 exactly, so this is quicker.</p>
         ${sum('x + 2 = 7<br>x = 5')}
         ${ans('5')}`
      )}
      ${tip('Both ways give the same answer. Dividing first is neat when the number on the other side divides exactly; otherwise expand.')}`,

    // y10-1B Q14: equations with letters (families of equations)
    // method: Key ideas, 1B (do the same operation to both sides), worked like Example 6
    'y10-1b-literal': `
      <p class="hp-tag">Worked example: solve for x. (a) <b>px + 4 = q</b> (b) <b>3x − 2b = 4b</b> (c) <b>(px + 3)/2 = p</b></p>
      ${steps(
        `<p><strong>Treat the other letters like numbers.</strong> Use the same steps as always.</p>
         ${sum('(a) px = q − 4 &nbsp;&nbsp;(− 4)<br>x = (q − 4)/p &nbsp;&nbsp;(÷ p)')}`,
        `<p><strong>Collect like terms when you can.</strong></p>
         ${sum('(b) 3x = 6b &nbsp;&nbsp;(+ 2b)<br>x = 2b')}`,
        `<p><strong>Fractions: multiply by the bottom first.</strong></p>
         ${sum('(c) px + 3 = 2p<br>px = 2p − 3<br>x = (2p − 3)/p')}
         ${ans('(q-4)/p, 2b, (2p-3)/p')}`
      )}
      ${tip('Put brackets round a top with more than one term: (q-4)/p, not q-4/p.')}`,

    // y10-1B Q15, Q16: changing the subject (factorising and fractions)
    // method: Key ideas, 1B (same operation to both sides, multiply by the denominator), with factorising from 1A
    'y10-1b-subject': `
      <p class="hp-tag">Worked example: (a) make a the subject of <b>a + ac = 5</b> (b) make a the subject of <b>1/a + c = d</b> (c) solve <b>x/2 + x/3 = k</b> for x.</p>
      ${steps(
        `<p><strong>The letter you want appears twice?</strong> Factorise it out, then divide by the bracket.</p>
         ${sum('(a) a(1 + c) = 5<br>a = 5/(1 + c)')}`,
        `<p><strong>The letter is on the bottom?</strong> Get the fraction on its own, then flip both sides.</p>
         ${sum('(b) 1/a = d − c<br>a = 1/(d − c)')}`,
        `<p><strong>Several fractions?</strong> Combine them over the LCD first.</p>
         ${sum('(c) 3x/6 + 2x/6 = k<br>5x/6 = k<br>5x = 6k, so x = 6k/5')}
         ${ans('5/(1+c), 1/(d-c), 6k/5')}`
      )}
      ${tip('Letters on the bottom: the LCD of 1/p and 1/q is pq. Use brackets for a sum on the bottom: 5/(1+c).')}`,

    // =====================================================================
    // Year 10 1C Linear inequalities
    // =====================================================================
    // y10-1C Q1: reading a number line
    // method: Example 9, 1C (writing inequalities from number lines)
    'y10-1c-numberline': `
      <p class="hp-tag">Worked example: write each number line as an inequality.</p>
      ${nl(-1, 5, null, false, 3, false, 'Open circle at 3 with an arrow to the left')}
      ${nl(-3, 3, -1, true, 2, false, 'Closed circle at −1, open circle at 2, joined')}
      ${steps(
        `<p><strong>Look at each circle.</strong> An open circle means the number is not included (&lt; or &gt;). A closed circle means it is included (≤ or ≥).</p>`,
        `<p><strong>One end with an arrow:</strong> the first line has an open circle at 3 and goes left, to smaller numbers.</p>
         ${sum('x &lt; 3')}`,
        `<p><strong>Two ends:</strong> x lies between them. −1 is included, 2 is not.</p>
         ${sum('−1 ≤ x &lt; 2')}
         ${ans('x &lt; 3 and −1 &lt;= x &lt; 2')}`
      )}
      ${tip('Type ≤ as <= and ≥ as >=, with the smaller number on the left: -1 <= x < 2.')}`,

    // y10-1C Q2: solving inequalities (positive numbers in front of x)
    // method: Example 10a, 1C (solving linear inequalities)
    'y10-1c-solve': `
      <p class="hp-tag">Worked example: solve (a) <b>4x − 3 ≥ 9</b> (b) <b>(2x − 1)/3 &gt; 3</b> (c) <b>3(x − 4) ≤ 5</b></p>
      ${steps(
        `<p><strong>Solve it like an equation.</strong> Adding, subtracting, and multiplying or dividing by a positive number leave the sign as it is.</p>
         ${sum('(a) 4x ≥ 12, so x ≥ 3')}
         ${nl(0, 6, 3, true, null, false, 'Closed circle at 3 with an arrow to the right')}`,
        `<p><strong>Fractions: multiply by the bottom first.</strong></p>
         ${sum('(b) 2x − 1 &gt; 9<br>2x &gt; 10, so x &gt; 5')}`,
        `<p><strong>Brackets: expand first.</strong></p>
         ${sum('(c) 3x − 12 ≤ 5<br>3x ≤ 17, so x ≤ 17/3')}
         ${ans('x >= 3, x > 5, x <= 17/3')}`
      )}
      ${tip('A fraction is fine in the answer, like x <= 17/3. Keep x on the left when you type it.')}`,

    // y10-1C Q3: multiplying or dividing by a negative
    // method: Example 10b, 1C (multiply by a negative and reverse the inequality symbol)
    'y10-1c-negative': `
      <p class="hp-tag">Worked example: solve (a) <b>5 − 3x ≥ 14</b> (b) <b>2 − x/5 &lt; 4</b> (c) <b>(1 − 2x)/3 ≥ 3</b></p>
      ${steps(
        `<p><strong>Get the x term on its own.</strong></p>
         ${sum('(a) −3x ≥ 9 &nbsp;&nbsp;(− 5)<br>(b) −x/5 &lt; 2 &nbsp;&nbsp;(− 2)<br>(c) 1 − 2x ≥ 9 &nbsp;&nbsp;(× 3), so −2x ≥ 8')}`,
        `<p><strong>Dividing or multiplying by a negative number reverses the symbol.</strong></p>
         ${sum('(a) x ≤ −3 &nbsp;&nbsp;(÷ (−3))<br>(b) x &gt; −10 &nbsp;&nbsp;(× (−5))<br>(c) x ≤ −4 &nbsp;&nbsp;(÷ (−2))')}
         ${ans('x <= -3, x > -10, x <= -4')}`,
        `<p><strong>Check with a number.</strong> In (a), x = −4 should work: 5 − 3(−4) = 17, and 17 ≥ 14 ✓.</p>`
      )}
      ${tip('Only multiplying or dividing by a negative flips the sign. Adding or subtracting never does.')}`,

    // y10-1C Q4: x on both sides
    // method: Example 10c, 1C (gather the x terms, and reverse the symbol if the sides are switched)
    'y10-1c-both': `
      <p class="hp-tag">Worked example: solve (a) <b>2x + 1 ≤ 6x − 11</b> (b) <b>3(x − 1) &gt; 2(x + 4)</b></p>
      ${steps(
        `<p><strong>Subtract the smaller x term from both sides.</strong> Expand any brackets first.</p>
         ${sum('(a) 1 ≤ 4x − 11 &nbsp;&nbsp;(− 2x)<br>(b) 3x − 3 &gt; 2x + 8, so x − 3 &gt; 8 &nbsp;&nbsp;(− 2x)')}`,
        `<p><strong>Finish solving.</strong></p>
         ${sum('(a) 12 ≤ 4x, so 3 ≤ x<br>(b) x &gt; 11')}`,
        `<p><strong>Make x the subject.</strong> Switching the two sides reverses the symbol: 3 ≤ x is the same as x ≥ 3.</p>
         ${ans('x >= 3, x > 11')}`
      )}
      ${tip('Taking away the smaller x term keeps the x term positive, so you avoid dividing by a negative.')}`,

    // y10-1C Q5, Q6: inequalities from words
    // method: Example 10, 1C (write the inequality, then solve it)
    'y10-1c-words': `
      <p class="hp-tag">Worked example: (a) 7 less than twice a number x is at most 15. (b) Two consecutive even numbers, the smaller being x, add to less than 50. (c) A taxi costs <b>$3.50</b> plus <b>$2</b> per km.</p>
      ${steps(
        `<p><strong>Write the inequality.</strong> "At most" and "no more than" mean ≤. "At least" means ≥.</p>
         ${sum('(a) 2x − 7 ≤ 15, so 2x ≤ 22, x ≤ 11<br>(b) x + (x + 2) &lt; 50, so 2x &lt; 48, x &lt; 24')}`,
        `<p><strong>A cost for trips shorter than 5 km:</strong> the cost is below the cost of exactly 5 km.</p>
         ${sum('(c) C &lt; 3.5 + 2 × 5, so C &lt; 13.5')}`,
        `<p><strong>How far for less than $19.50?</strong></p>
         ${sum('3.5 + 2d &lt; 19.5<br>2d &lt; 16, so d &lt; 8')}
         ${ans('x <= 11, x < 24, C < 13.5, d < 8')}`
      )}
      ${tip('Change cents into dollars first: 40 cents is 0.4. Consecutive even (or odd) numbers go up by 2: x and x + 2.')}`,

    // y10-1C Q7: fractions with a common denominator
    // method: Example 8, 1B (combine using the LCD), then Example 10, 1C
    'y10-1c-lcd': `
      <p class="hp-tag">Worked example: solve (a) <b>x/3 − x/4 &gt; 2</b> (b) <b>x/2 − 3x/4 &lt; 1</b></p>
      ${steps(
        `<p><strong>Combine the fractions using the LCD.</strong></p>
         ${sum('(a) 4x/12 − 3x/12 = x/12<br>(b) 2x/4 − 3x/4 = −x/4')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('(a) x/12 &gt; 2, so x &gt; 24 &nbsp;&nbsp;(× 12)')}`,
        `<p><strong>If the x term is negative, multiplying by a negative reverses the symbol.</strong></p>
         ${sum('(b) −x/4 &lt; 1, so x &gt; −4 &nbsp;&nbsp;(× (−4))')}
         ${ans('x > 24, x > -4')}`
      )}
      ${tip('If the combined top comes out as 0x, there is nothing left to divide by: check the working again.')}`,

    // y10-1C Q8: counting whole numbers
    // method: Key ideas, 1C (reading an inequality and its end points)
    'y10-1c-count': `
      <p class="hp-tag">Worked example: how many whole numbers satisfy (a) <b>2 ≤ x &lt; 6</b> (b) <b>x ≥ 10</b>?</p>
      ${steps(
        `<p><strong>List them, checking each end.</strong> 2 is included (≤) and 6 is not (&lt;).</p>
         ${sum('(a) 2, 3, 4, 5')}`,
        `<p><strong>No upper end?</strong> Then the list never stops.</p>
         ${sum('(b) 10, 11, 12, 13, ...')}
         ${ans('(a) 4 (b) Infinitely many')}`
      )}
      ${tip('An open circle end is left out of the count; a closed circle end is counted.')}`,

    // y10-1C Q9: inequalities with a letter
    // method: Example 10b, 1C, with Key ideas, 1C (reverse the symbol when multiplying or dividing by a negative)
    'y10-1c-literal': `
      <p class="hp-tag">Worked example: solve for x. (a) <b>5x + 2 ≤ b − 1</b> (b) <b>(4 − x)/b &lt; 3</b> when b &gt; 0 (c) the same when b &lt; 0</p>
      ${steps(
        `<p><strong>Work as usual, treating b like a number.</strong></p>
         ${sum('(a) 5x ≤ b − 3, so x ≤ (b − 3)/5')}`,
        `<p><strong>b positive: multiplying by b keeps the symbol.</strong></p>
         ${sum('(b) 4 − x &lt; 3b<br>−x &lt; 3b − 4<br>x &gt; 4 − 3b &nbsp;&nbsp;(× (−1), reverse)')}`,
        `<p><strong>b negative: multiplying by b reverses the symbol.</strong></p>
         ${sum('(c) 4 − x &gt; 3b<br>−x &gt; 3b − 4<br>x &lt; 4 − 3b &nbsp;&nbsp;(× (−1), reverse again)')}
         ${ans('x ≤ (b − 3)/5, x &gt; 4 − 3b, x &lt; 4 − 3b')}`
      )}
      ${tip('Ask "is the thing I am multiplying by negative?" every time. A letter can be negative, so the question tells you which it is.')}`,

    // y10-1C Q10: two inequalities together
    // method: Key ideas, 1C (a &lt; x ≤ b on a number line)
    'y10-1c-combine': `
      <p class="hp-tag">Worked example: write the numbers that satisfy both (a) <b>x ≥ −1</b> and <b>x &lt; 5</b> (b) <b>x ≥ 2</b> and <b>x ≤ 2</b></p>
      ${steps(
        `<p><strong>Picture both on one number line</strong> and keep the overlap.</p>
         ${nl(-2, 6, -1, true, 5, false, 'Closed circle at −1, open circle at 5, joined')}
         ${sum('(a) −1 ≤ x &lt; 5')}`,
        `<p><strong>Only one number in both?</strong> x has to be at least 2 and at most 2.</p>
         ${sum('(b) x = 2')}
         ${ans('-1 <= x < 5 and x = 2')}`
      )}
      ${tip('Write the smaller number on the left and keep each end symbol from its own inequality.')}`,

    // y10-1C Q11, Q12: double inequalities
    // method: Key ideas, 1C (same rules as equations, done to all three parts; reverse when multiplying by a negative)
    'y10-1c-double': `
      <p class="hp-tag">Worked example: solve (a) <b>−1 &lt; 2x + 3 ≤ 9</b> (b) <b>1 ≤ 4 − x &lt; 7</b></p>
      ${steps(
        `<p><strong>Do the same thing to all three parts.</strong></p>
         ${sum('(a) −4 &lt; 2x ≤ 6 &nbsp;&nbsp;(− 3)<br>−2 &lt; x ≤ 3 &nbsp;&nbsp;(÷ 2)')}`,
        `<p><strong>Negative x: multiplying by −1 reverses both symbols.</strong></p>
         ${sum('(b) −3 ≤ −x &lt; 3 &nbsp;&nbsp;(− 4)<br>3 ≥ x &gt; −3 &nbsp;&nbsp;(× (−1))')}`,
        `<p><strong>Rewrite with the smaller number first.</strong> 3 ≥ x &gt; −3 is the same as −3 &lt; x ≤ 3.</p>
         ${ans('-2 < x <= 3 and -3 < x <= 3')}`
      )}
      ${tip('A fraction in the middle? Multiply all three parts by its bottom first. Type the answer like -2 < x <= 3.')}`,

    // =====================================================================
    // Year 10 1D Linear equations involving more complex algebraic fractions
    // =====================================================================
    // y10-1D Q1: adding algebraic fractions
    // method: Example 11a, 1D (adding algebraic fractions)
    'y10-1d-add': `
      <p class="hp-tag">Worked example: simplify <b>(x + 1)/4 + (x − 3)/3</b></p>
      ${steps(
        `<p><strong>Find the LCD.</strong> The LCD of 4 and 3 is 12. Rewrite each fraction over 12, with brackets round each top.</p>
         ${sum('= 3(x + 1)/12 + 4(x − 3)/12')}`,
        `<p><strong>Write it as one fraction.</strong></p>
         ${sum('= (3(x + 1) + 4(x − 3))/12')}`,
        `<p><strong>Expand the tops and collect like terms.</strong></p>
         ${sum('= (3x + 3 + 4x − 12)/12<br>= (7x − 9)/12')}
         ${ans('(7x-9)/12')}`
      )}
      ${tip('The brackets matter: 4(x − 3) is 4x − 12, not 4x − 3. Type one fraction with brackets round the top, like (7x-9)/12.')}`,

    // y10-1D Q2, Q8: subtracting algebraic fractions
    // method: Example 11b, 1D (subtracting algebraic fractions)
    'y10-1d-subtract': `
      <p class="hp-tag">Worked example: simplify <b>(2x + 1)/3 − (x − 2)/5</b></p>
      ${steps(
        `<p><strong>Rewrite over the LCD, 15.</strong></p>
         ${sum('= 5(2x + 1)/15 − 3(x − 2)/15<br>= (5(2x + 1) − 3(x − 2))/15')}`,
        `<p><strong>Expand. The minus multiplies the whole second bracket.</strong></p>
         ${sum(`= (10x + 5 ${now('− 3x + 6')})/15`)}`,
        `<p><strong>Collect like terms.</strong></p>
         ${sum('= (7x + 11)/15')}
         ${ans('(7x+11)/15')}`
      )}
      <p><strong>The common slip:</strong> writing −3(x − 2) as −3x − 6. The second sign changes too: −3 × (−2) = +6. Spot it in someone else's working by expanding again yourself.</p>
      ${tip('Keep brackets round the second top until you expand. A negative top is fine, like (-4x-7)/15.')}`,

    // y10-1D Q3: a fraction equal to a fraction
    // method: Example 12a, 1D (multiply both sides by the LCD, then expand)
    'y10-1d-equal': `
      <p class="hp-tag">Worked example: solve <b>(2x + 1)/3 = (x + 4)/2</b></p>
      ${steps(
        `<p><strong>Multiply both sides by the LCD of 3 and 2, which is 6</strong>, and cancel.</p>
         ${sum('2(2x + 1) = 3(x + 4)')}`,
        `<p><strong>Expand, then gather the x terms.</strong></p>
         ${sum('4x + 2 = 3x + 12<br>x + 2 = 12 &nbsp;&nbsp;(− 3x)<br>x = 10')}`,
        `<p><strong>Check.</strong> (2(10) + 1)/3 = 21/3 = 7 and (10 + 4)/2 = 7 ✓</p>
         ${ans('10')}`
      )}
      ${tip('This is the same as cross multiplying. If a top has a bracket already, like 3(x + 1)/4, keep it: 2 × 3(x + 1) = 6(x + 1).')}`,

    // y10-1D Q4, Q6: two fractions and a number (equations and inequalities)
    // method: Example 12b, 1D (combine using the LCD, then solve)
    'y10-1d-solve': `
      <p class="hp-tag">Worked example: solve <b>(x + 1)/2 − (x − 3)/5 = 3</b></p>
      ${steps(
        `<p><strong>Write the left side as one fraction using the LCD, 10.</strong></p>
         ${sum('5(x + 1)/10 − 2(x − 3)/10 = 3<br>(5x + 5 − 2x + 6)/10 = 3')}`,
        `<p><strong>Simplify the top, then multiply both sides by 10.</strong></p>
         ${sum('(3x + 11)/10 = 3<br>3x + 11 = 30')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('3x = 19, so x = 19/3')}
         ${ans('19/3')}`
      )}
      <p><strong>An inequality works the same way.</strong> With &gt; 3 instead of = 3, every step is identical (10 is positive, so the symbol stays) and the answer is x &gt; 19/3.</p>
      ${tip('Watch the minus before the second fraction: −2(x − 3) = −2x + 6. Type a fraction answer like 19/3.')}`,

    // y10-1D Q7: three terms
    // method: Example 12b, 1D (express as a single fraction using the LCD)
    'y10-1d-three': `
      <p class="hp-tag">Worked example: solve <b>(x − 1)/2 + x/3 − x/6 = 1</b></p>
      ${steps(
        `<p><strong>Find one LCD for every fraction.</strong> 2, 3 and 6 all go into 6.</p>
         ${sum('3(x − 1)/6 + 2x/6 − x/6 = 1')}`,
        `<p><strong>Combine the tops.</strong></p>
         ${sum('(3x − 3 + 2x − x)/6 = 1<br>(4x − 3)/6 = 1')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('4x − 3 = 6<br>4x = 9, so x = 9/4')}
         ${ans('9/4')}`
      )}
      <p><strong>A fraction in front of a bracket</strong> is a fraction too: (1/3)(x + 2) means (x + 2)/3. A plain number like 3/4 also goes over the LCD.</p>
      ${tip('Fractions on both sides? Multiply every term on both sides by the LCD instead. Either way gives the same answer.')}`,

    // y10-1D Q5: a story with time = distance ÷ speed
    // method: Example 12b, 1D (combine fractions using the LCD, then solve)
    'y10-1d-story': `
      <p class="hp-tag">Worked example: Sam walks x km at <b>4 km/h</b>, then cycles <b>6 km further</b> than he walked at <b>12 km/h</b>. Altogether it takes <b>3 hours</b>. How far did he walk and cycle?</p>
      ${steps(
        `<p><strong>Write each time as distance ÷ speed, and add them.</strong></p>
         ${sum('x/4 + (x + 6)/12 = 3')}`,
        `<p><strong>Use the LCD, 12.</strong></p>
         ${sum('3x/12 + (x + 6)/12 = 3<br>(4x + 6)/12 = 3<br>4x + 6 = 36')}`,
        `<p><strong>Solve and answer the question.</strong></p>
         ${sum('4x = 30, so x = 7.5<br>cycled: 7.5 + 6 = 13.5 km')}
         ${ans('7.5 km and 13.5 km')}`
      )}
      ${tip('Check the times: 7.5 ÷ 4 = 1.875 h and 13.5 ÷ 12 = 1.125 h, which add to 3 h ✓.')}`,

    // y10-1D Q9: bottoms that are opposites
    // method: the fact given in the question, x − 1 = −(1 − x), then add with a common denominator (Key ideas, 1D)
    'y10-1d-swap': `
      <p class="hp-tag">Worked example: simplify (a) <b>3/(x − 1) + 2/(1 − x)</b> (b) <b>2x/(x − 7) + 5/(7 − x)</b></p>
      ${steps(
        `<p><strong>Spot the opposite.</strong> 1 − x = −(x − 1), so a fraction over 1 − x is minus the same fraction over x − 1.</p>
         ${sum('2/(1 − x) = −2/(x − 1)')}`,
        `<p><strong>Now the bottoms match, so combine the tops.</strong></p>
         ${sum('(a) 3/(x − 1) − 2/(x − 1) = 1/(x − 1)')}`,
        `<p><strong>Same idea again.</strong></p>
         ${sum('(b) 2x/(x − 7) − 5/(x − 7) = (2x − 5)/(x − 7)')}
         ${ans('1/(x-1) and (2x-5)/(x-7)')}`
      )}
      ${tip('You can turn either fraction round. (2x − 5)/(x − 7) and (5 − 2x)/(7 − x) are the same answer.')}`,

    // y10-1D Q10, Q11: bottoms with x in them
    // method: Key ideas, 1D (LCD, then combine the numerators), using the LCD given in the question
    'y10-1d-binomial': `
      <p class="hp-tag">Worked example: simplify (a) <b>6/(x − 3) + 1/(x + 4)</b> (b) <b>5/(x + 2) − 2/(2x − 1)</b></p>
      ${steps(
        `<p><strong>The LCD is the two bottoms multiplied.</strong> Multiply each top by the other bottom.</p>
         ${sum('(a) (6(x + 4) + 1(x − 3))/((x − 3)(x + 4))')}`,
        `<p><strong>Expand the top and collect like terms.</strong> Leave the bottom factorised.</p>
         ${sum('(a) = (6x + 24 + x − 3)/((x − 3)(x + 4)) = (7x + 21)/((x − 3)(x + 4))<br>(b) = (5(2x − 1) − 2(x + 2))/((x + 2)(2x − 1))<br>&nbsp;&nbsp;&nbsp;&nbsp;= (8x − 9)/((x + 2)(2x − 1))')}
         ${ans('(7x+21)/((x-3)(x+4)) and (8x-9)/((x+2)(2x-1))')}`,
        `<p><strong>Finding a missing number?</strong> If a/(x + 1) + 2/(x − 3) = (5x − 7)/((x + 1)(x − 3)), the tops must match:</p>
         ${sum('a(x − 3) + 2(x + 1) = 5x − 7<br>x terms: a + 2 = 5, so a = 3<br>check: −3(3) + 2 = −7 ✓')}`
      )}
      ${tip('Type the bottom with brackets round each factor and round the whole bottom: (8x-9)/((x+2)(2x-1)).')}`,

    // =====================================================================
    // Year 10 1E Graphing straight lines
    // =====================================================================
    // y10-1E Q1: is the point on the line?
    // method: Example 13, 1E (deciding if a point is on a line)
    'y10-1e-onpoint': `
      <p class="hp-tag">Worked example: is the point <b>(−1, 5)</b> on the line (a) <b>y = −2x + 3</b> (b) <b>3x + y = 4</b>?</p>
      ${steps(
        `<p><strong>Substitute x = −1 (and y = 5) into the equation.</strong></p>
         ${sum('(a) −2(−1) + 3 = 2 + 3 = 5')}
         <p>That gives y = 5, so the point is on the line.</p>`,
        `<p><strong>For ax + by = d, work out the left side.</strong></p>
         ${sum('(b) 3(−1) + 5 = −3 + 5 = 2')}
         <p>2 is not 4, so the point is not on this line.</p>
         ${ans('(a) Yes (b) No')}`
      )}
      ${tip('Put negative values in brackets so the signs come out right: −2 × (−1) = +2.')}`,

    // y10-1E Q2, Q3, Q10: gradient and y-intercept
    // method: Example 14, 1E (gradient-intercept form y = mx + c)
    'y10-1e-mc': `
      <p class="hp-tag">Worked example: find the gradient and y-intercept of (a) <b>y = −3x + 4</b> (b) <b>4x + 2y = 6</b></p>
      ${graph([-1, 3], [-2, 4], [{ m: -2, c: 3, label: 'y = −2x + 3', at: [1.6, 2.6] }], [[0, 3, '(0, 3)', 'e'], [1, 1, '(1, 1)', 'e']], 'The line y = −2x + 3 through (0, 3) and (1, 1)', 34)}
      ${steps(
        `<p><strong>In y = mx + c, m is the gradient and c is the y-intercept.</strong></p>
         ${sum('(a) m = −3, c = 4')}`,
        `<p><strong>Not in that form? Make y the subject first.</strong></p>
         ${sum('(b) 2y = −4x + 6 &nbsp;&nbsp;(− 4x)<br>y = −2x + 3 &nbsp;&nbsp;(÷ 2)<br>m = −2, c = 3')}`,
        `<p><strong>Read the graph.</strong> From (0, 3), go 1 right and 2 down to (1, 1): a fall of 2 for each 1 across.</p>
         ${ans('-3, 4 and -2, 3')}`
      )}
      <p><strong>Watch out:</strong> divide every term. y = (4x − 6)/2 = 2x − 3, so m = 2, not 4. And x − 2y = 6 gives y = x/2 − 3, so m = 1/2.</p>
      ${tip('Type the gradient, then the y-intercept, with a comma: -2, 3. Fractions are fine, like 3/4, -1.')}`,

    // y10-1E Q4: x- and y-intercepts
    // method: Example 15, 1E (sketching using the x- and y-intercepts)
    'y10-1e-intercepts': `
      <p class="hp-tag">Worked example: find the x- and y-intercepts of (a) <b>y = 2x − 10</b> (b) <b>3x + 5y = 15</b></p>
      ${graph([-1, 6], [-1, 4], [{ m: -0.6, c: 3, label: '3x + 5y = 15', at: [3.3, 2.1] }], [[5, 0, '(5, 0)', 'sw'], [0, 3, '(0, 3)', 'ne']], 'The line 3x + 5y = 15 crossing the axes at (5, 0) and (0, 3)', 32)}
      ${steps(
        `<p><strong>y-intercept: put x = 0.</strong></p>
         ${sum('(a) y = 2(0) − 10 = −10<br>(b) 3(0) + 5y = 15, 5y = 15, y = 3')}`,
        `<p><strong>x-intercept: put y = 0 and solve.</strong></p>
         ${sum('(a) 0 = 2x − 10, 2x = 10, x = 5<br>(b) 3x + 5(0) = 15, 3x = 15, x = 5')}`,
        `<p><strong>Join the two intercepts</strong> to sketch the line.</p>
         ${ans('5, -10 and 5, 3')}`
      )}
      ${tip('Type the x-intercept first, then the y-intercept, separated by a comma. A fraction like 9/2 is fine.')}`,

    // y10-1E Q5: lines with one intercept
    // method: Example 16, 1E (sketching lines with one intercept)
    'y10-1e-special': `
      <p class="hp-tag">Worked example: what kind of line is (a) <b>y = −1</b> (b) <b>x = 2</b> (c) <b>y = −x/3</b>?</p>
      ${graph([-3, 4], [-2, 3], [{ m: 0, c: -1, label: 'y = −1', at: [-2.9, -1.5] }, { v: 2, label: 'x = 2', at: [2.15, 2.6] }, { m: -1 / 3, c: 0, label: 'y = −x/3', at: [-2.9, 1.3] }], [], 'The lines y = −1 (horizontal), x = 2 (vertical) and y = −x/3 (through the origin)', 32)}
      ${steps(
        `<p><strong>y = a number:</strong> every point has the same y, so the line is horizontal.</p>`,
        `<p><strong>x = a number:</strong> every point has the same x, so the line is vertical.</p>`,
        `<p><strong>y = mx with no constant:</strong> it passes through (0, 0), so it is a sloping line through the origin.</p>
         ${ans('(a) Horizontal (b) Vertical (c) Sloping line through the origin')}`
      )}
      ${tip('Rearrange first if you need to: 2y − 8 = 0 gives y = 4 (horizontal), and x + y = 0 gives y = −x (through the origin).')}`,

    // y10-1E Q6, Q7, Q8, Q9: linear rules in real life
    // method: Example 14, 1E (m is the rate of change, c is the starting value) with Key ideas, 1E
    'y10-1e-rule': `
      <p class="hp-tag">Worked example: a gym charges a <b>$25</b> joining fee plus <b>$15</b> per week. $C is the cost for w weeks.</p>
      ${steps(
        `<p><strong>Write the rule.</strong> The amount per week is the gradient, and the fixed fee is the constant.</p>
         ${sum('C = 15w + 25')}`,
        `<p><strong>Know w? Substitute.</strong> 8 weeks:</p>
         ${sum('C = 15 × 8 + 25 = 145')}
         <p>For 0 ≤ w ≤ 10, the right-hand end of the graph is at w = 10: C = 175, the point (10, 175).</p>`,
        `<p><strong>Know C? Solve.</strong> Paid $220:</p>
         ${sum('15w + 25 = 220<br>15w = 195, so w = 13')}
         ${ans('C = 15w + 25, 145, 13')}`
      )}
      <p><strong>Going down?</strong> A 200 L drum leaking 4 L an hour has V = 200 − 4t. It is empty when 200 − 4t = 0, at t = 50 hours. <strong>Cost per km:</strong> $1080 for 24 000 km is 1080 ÷ 24 000 = $0.045 per km, so C = 0.045k. In D = 60t + 10, the gradient 60 is the speed in km/h and the 10 is where it started.</p>
      ${tip('Type the rule with the letters in the question, like C = 15w + 25.')}`,

    // y10-1E Q11, Q12: gradient and intercepts with letters
    // method: Example 14b and Example 15, 1E (make y the subject; put x = 0 or y = 0)
    'y10-1e-letters': `
      <p class="hp-tag">Worked example: (a) find the gradient and y-intercept of <b>py = 3x − 7</b> and <b>qx + y = r</b> (b) find the intercepts of <b>2x + qy = r</b></p>
      ${steps(
        `<p><strong>Make y the subject, dividing every term.</strong></p>
         ${sum('py = 3x − 7 → y = (3/p)x − 7/p<br>gradient 3/p, y-intercept −7/p')}`,
        `<p><strong>Move the x term across.</strong></p>
         ${sum('qx + y = r → y = −qx + r<br>gradient −q, y-intercept r')}`,
        `<p><strong>Intercepts: put y = 0, then x = 0.</strong></p>
         ${sum('y = 0: 2x = r, x = r/2, so (r/2, 0)<br>x = 0: qy = r, y = r/q, so (0, r/q)')}
         ${ans('3/p, -7/p; -q, r; (r/2, 0), (0, r/q)')}`
      )}
      ${tip('Type fractions with /, like -7/p, and points with brackets, like (r/2, 0).')}`,

    // y10-1E Q13: area enclosed by lines
    // method: no worked example in the book (sketch the lines, find the corners, use the area of a triangle or rectangle)
    'y10-1e-area': `
      <p class="hp-tag">Worked example: find the area enclosed by <b>y = −2x + 8</b>, <b>x = 0</b> and <b>y = 2</b>.</p>
      ${region([-1, 5], [-1, 9], [[2, 1, 8], [-1, 0, 0], [0, -1, -2]], [{ m: -2, c: 8, label: 'y = −2x + 8', at: [1.6, 5.6] }, { m: 0, c: 2, label: 'y = 2', at: [4.0, 1.45] }], [[0, 8, '(0, 8)', 'e'], [0, 2, '(0, 2)', 'nw'], [3, 2, '(3, 2)', 'ne']], 'A triangle with corners (0, 8), (0, 2) and (3, 2)', 26)}
      ${steps(
        `<p><strong>Sketch the lines and find the corners</strong>, where each pair of lines meets.</p>
         ${sum('x = 0 and y = −2x + 8: (0, 8)<br>x = 0 and y = 2: (0, 2)<br>y = 2 and y = −2x + 8: 2 = −2x + 8, x = 3, so (3, 2)')}`,
        `<p><strong>Use a side along an axis or grid line as the base.</strong> Along x = 0 the base is 8 − 2 = 6, and the height across to (3, 2) is 3.</p>`,
        `<p><strong>Area of a triangle.</strong></p>
         ${sum('A = ½ × 6 × 3 = 9')}
         ${ans('9')}`
      )}
      ${tip('Four lines, two vertical and two horizontal, make a rectangle: x = −1, x = 4, y = 1 and y = −2 give 5 × 3 = 15.')}`,

    // =====================================================================
    // Year 10 1F Finding the equation of a line
    // =====================================================================
    // y10-1F Q1, Q8: the gradient between two points
    // method: Example 17, 1F (finding the gradient of a line joining two points)
    'y10-1f-gradient': `
      <p class="hp-tag">Worked example: find the gradient of the line joining <b>(−1, 7)</b> and <b>(3, −5)</b>.</p>
      ${steps(
        `<p><strong>Label the points.</strong> (x₁, y₁) = (−1, 7) and (x₂, y₂) = (3, −5).</p>`,
        `<p><strong>Use m = (y₂ − y₁)/(x₂ − x₁).</strong></p>
         ${sum('m = (−5 − 7)/(3 − (−1)) = −12/4 = −3')}
         ${ans('-3')}`,
        `<p><strong>The order does not matter.</strong> Swap the points and both signs change, so the answer is the same:</p>
         ${sum('m = (7 − (−5))/(−1 − 3) = 12/(−4) = −3')}`
      )}
      <p><strong>Special cases:</strong> (2, 5) and (6, 5) give 0/4 = 0, a horizontal line. (4, 1) and (4, 7) give 6/0, which cannot be worked out, so the gradient is undefined (a vertical line).</p>
      ${tip('Subtracting a negative is adding: 3 − (−1) = 4. Type a fraction like 3/2, or type undefined for a vertical line.')}`,

    // y10-1F Q2: the y-intercept and one other point
    // method: Example 18, 1F (finding the equation given the y-intercept and a point)
    'y10-1f-yint': `
      <p class="hp-tag">Worked example: a line has y-intercept <b>(0, −1)</b> and passes through <b>(3, 5)</b>. Find its equation.</p>
      ${fig({ kind: 'plane', x: [-1, 4], y: [-2, 6], path: [[-0.5, -2], [3.5, 6]], points: { '(0, −1)': [0, -1], '(3, 5)': [3, 5] }, alt: 'A line through (0, −1) and (3, 5)' })}
      ${steps(
        `<p><strong>Find the gradient</strong> with the formula, or rise over run on the graph.</p>
         ${sum('m = (5 − (−1))/(3 − 0) = 6/3 = 2')}`,
        `<p><strong>The y-intercept gives c straight away.</strong> c = −1.</p>`,
        `<p><strong>Write y = mx + c.</strong></p>
         ${sum('y = 2x − 1')}
         ${ans('y = 2x - 1')}`
      )}
      <p><strong>A fraction gradient:</strong> (0, 1) and (3, −1) give m = −2/3, so y = −2x/3 + 1. A flat line through (0, 4) is y = 4.</p>
      ${tip('Type the equation like y = 2x - 1 or y = -2x/3 + 1.')}`,

    // y10-1F Q3, Q4, Q9: two points (from a graph or a table)
    // method: Example 19, 1F (Method 1: substitute a point to find c; Method 2: y − y₁ = m(x − x₁))
    'y10-1f-twopoints': `
      <p class="hp-tag">Worked example: find the equation of the line through <b>(2, −1)</b> and <b>(6, 7)</b>.</p>
      ${steps(
        `<p><strong>Find the gradient.</strong></p>
         ${sum('m = (7 − (−1))/(6 − 2) = 8/4 = 2')}`,
        `<p><strong>Method 1: substitute a point into y = 2x + c to find c.</strong> Use (2, −1).</p>
         ${sum('−1 = 2(2) + c<br>−1 = 4 + c, so c = −5<br>y = 2x − 5')}`,
        `<p><strong>Method 2: use y − y₁ = m(x − x₁)</strong> with (x₁, y₁) = (2, −1), then make y the subject.</p>
         ${sum('y − (−1) = 2(x − 2)<br>y + 1 = 2x − 4<br>y = 2x − 5')}
         ${ans('y = 2x - 5')}`
      )}
      ${fig({ kind: 'table', rows: [['x', '1', '4'], ['y', '9', '0']] })}
      <p><strong>From a table:</strong> each column is a point, here (1, 9) and (4, 0). m = (0 − 9)/(4 − 1) = −9/3 = −3, then 9 = −3(1) + c gives c = 12, so y = −3x + 12.</p>
      ${tip('Either point gives the same line. Check by putting the other point in: 2(6) − 5 = 7 ✓.')}`,

    // y10-1F Q5, Q6, Q7: finding a rule from two facts
    // method: Example 19, 1F (gradient from two points, then substitute to find c)
    'y10-1f-context': `
      <p class="hp-tag">Worked example: a <b>3 km</b> taxi ride costs <b>$14</b> and an <b>8 km</b> ride costs <b>$29</b>. The cost is a fixed fee plus a rate per km.</p>
      ${steps(
        `<p><strong>Each fact is a point (d, C):</strong> (3, 14) and (8, 29). The gradient is the rate per km.</p>
         ${sum('m = (29 − 14)/(8 − 3) = 15/5 = 3')}`,
        `<p><strong>Substitute a point to find c</strong>, the fixed fee.</p>
         ${sum('14 = 3(3) + c, so c = 5<br>C = 3d + 5')}`,
        `<p><strong>Use the rule.</strong> When is the cost $50?</p>
         ${sum('3d + 5 = 50, 3d = 45, d = 15')}
         ${ans('C = 3d + 5; $3 per km; $5 fee; 15 km')}`
      )}
      <p><strong>Starting from empty?</strong> Then c = 0. A tank with 12 L after 3 minutes has V = (12/3)t = 4t. The value at t = 0 (the start) is always c.</p>
      ${tip('Use the letters from the question: C and t, or A and t. Type the rule like C = 3d + 5.')}`,

    // y10-1F Q10: gradients that hit a target
    // method: Example 18, 1F (the y-intercept and one point give the line)
    'y10-1f-archer': `
      <p class="hp-tag">Worked example: a laser is <b>1.2 m</b> above the ground and <b>20 m</b> from a wall. A poster on the wall has its bottom <b>1.6 m</b> and its top <b>2.4 m</b> above the ground. (0, 0) is the ground below the laser.</p>
      ${fig({ kind: 'diagram', unit: 22, items: [
        { seg: [-1, 0, 13, 0], arrow: 'end' }, { label: 'x', at: [13.4, 0] }, { seg: [0, 0, 0, 5], arrow: 'end', dash: true, thin: true }, { label: 'y', at: [0, 5.4] },
        { point: [0, 1.6], name: 'laser', pos: 'w' }, { seg: [12, 0, 12, 2.13], thin: true }, { seg: [12, 2.13, 12, 3.2] },
        { seg: [0, 1.6, 12, 2.13], dash: true }, { seg: [0, 1.6, 12, 3.2], dash: true }, { label: 'poster', at: [12.3, 2.7], anchor: 'start' },
        { dim: [0, 0, 12, 0], label: '20 m', off: -0.9 }
      ], alt: 'A laser 1.2 m high, 20 m from a wall with a poster from 1.6 m to 2.4 m high' })}
      ${steps(
        `<p><strong>The y-intercept is the starting height</strong>, (0, 1.2). The bottom and top of the poster are the points (20, 1.6) and (20, 2.4).</p>`,
        `<p><strong>Find each gradient.</strong></p>
         ${sum('bottom: m = (1.6 − 1.2)/20 = 0.4/20 = 0.02<br>top: m = (2.4 − 1.2)/20 = 1.2/20 = 0.06')}`,
        `<p><strong>Write the lines, then the range.</strong> Any gradient from the bottom one to the top one hits the poster.</p>
         ${sum('y = 0.02x + 1.2 and y = 0.06x + 1.2<br>0.02 ≤ m ≤ 0.06')}
         ${ans('0.02 <= m <= 0.06')}`
      )}
      ${tip('Find the top height by adding: bottom height + size of the target. Type the range like 0.1 <= m <= 0.2.')}`,

    // =====================================================================
    // Year 10 1G Length and midpoint of a line segment
    // =====================================================================
    // y10-1G Q1: the distance between two points
    // method: Example 20, 1G (finding the distance between two points)
    'y10-1g-distance': `
      <p class="hp-tag">Worked example: find the exact distance between <b>(1, −2)</b> and <b>(4, 4)</b>.</p>
      ${fig({ kind: 'plane', x: [0, 5], y: [-3, 5], path: [[1, -2], [4, -2], [4, 4], [1, -2]], points: { '(1, −2)': [1, -2], '(4, 4)': [4, 4] }, alt: 'The segment from (1, −2) to (4, 4) as the hypotenuse of a right-angled triangle 3 across and 6 up' })}
      ${steps(
        `<p><strong>Use d = √((x₂ − x₁)² + (y₂ − y₁)²).</strong> It is Pythagoras: 3 across and 6 up.</p>
         ${sum('d = √((4 − 1)² + (4 − (−2))²) = √(3² + 6²)')}`,
        `<p><strong>Square and add.</strong></p>
         ${sum('d = √(9 + 36) = √45')}`,
        `<p><strong>Write the surd in simplest form.</strong> Take out the biggest square factor: 45 = 9 × 5.</p>
         ${sum('√45 = √9 × √5 = 3√5')}
         ${ans('3sqrt5')}`
      )}
      <p><strong>Sometimes it comes out whole:</strong> (−3, 5) and (2, −7) give √(5² + (−12)²) = √(25 + 144) = √169 = 13.</p>
      ${tip('The marker wants simplest surd form: type 3sqrt5, not sqrt45. A negative difference is fine, because squaring makes it positive.')}`,

    // y10-1G Q2: the midpoint
    // method: Example 21, 1G (finding the midpoint of a line segment)
    'y10-1g-midpoint': `
      <p class="hp-tag">Worked example: find the midpoint of the segment joining <b>(−5, 2)</b> and <b>(3, 7)</b>.</p>
      ${steps(
        `<p><strong>Average the x-coordinates.</strong></p>
         ${sum('(−5 + 3)/2 = −2/2 = −1')}`,
        `<p><strong>Average the y-coordinates.</strong></p>
         ${sum('(2 + 7)/2 = 9/2')}`,
        `<p><strong>Write the point.</strong></p>
         ${ans('(-1, 9/2)')}`
      )}
      ${tip('Leave halves as fractions or decimals: (-1, 9/2) or (-1, 4.5). Add first, then halve.')}`,

    // y10-1G Q3: which point is closest?
    // method: Example 20, 1G (distance between two points, for each point)
    'y10-1g-closest': `
      <p class="hp-tag">Worked example: which of P(4, 1), Q(−1, −3) and R(−1, 4) is closest to <b>(1, 2)</b>?</p>
      ${fig({ kind: 'plane', x: [-2, 5], y: [-4, 5], points: { '(1, 2)': [1, 2], 'P': [4, 1], 'Q': [-1, -3], 'R': [-1, 4] }, alt: 'The point (1, 2) and the points P(4, 1), Q(−1, −3) and R(−1, 4)' })}
      ${steps(
        `<p><strong>Find each distance from (1, 2).</strong></p>
         ${sum('P: √(3² + (−1)²) = √(9 + 1) = √10 ≈ 3.16<br>Q: √((−2)² + (−5)²) = √(4 + 25) = √29 ≈ 5.39<br>R: √((−2)² + 2²) = √(4 + 4) = √8 ≈ 2.83')}`,
        `<p><strong>The smallest distance wins.</strong></p>
         ${ans('R')}`
      )}
      ${tip('Your eyes can be fooled on a grid. Work out every distance before you choose.')}`,

    // y10-1G Q4: a missing coordinate from the midpoint
    // method: Key ideas, 1G (midpoint rule), then solve each equation as in 1B
    'y10-1g-findab': `
      <p class="hp-tag">Worked example: the midpoint of <b>(a, 6)</b> and <b>(7, b)</b> is <b>(2, −1)</b>. Find a and b.</p>
      ${steps(
        `<p><strong>Write the midpoint rule for each coordinate.</strong></p>
         ${sum('(a + 7)/2 = 2 &nbsp;&nbsp; and &nbsp;&nbsp; (6 + b)/2 = −1')}`,
        `<p><strong>Solve each equation.</strong></p>
         ${sum('a + 7 = 4, so a = −3<br>6 + b = −2, so b = −8')}
         ${ans('-3, -8')}`
      )}
      ${tip('Check: (−3 + 7)/2 = 2 ✓ and (6 + (−8))/2 = −1 ✓. Type a, then b, with a comma.')}`,

    // y10-1G Q5, Q8: a missing coordinate from a distance
    // method: Example 22, 1G (using a given distance to find coordinates)
    'y10-1g-finda': `
      <p class="hp-tag">Worked example: find the values of a if the distance between <b>(1, a)</b> and <b>(4, 2)</b> is <b>√10</b>.</p>
      ${steps(
        `<p><strong>Put everything into the distance rule.</strong></p>
         ${sum('√((4 − 1)² + (2 − a)²) = √10<br>√(9 + (2 − a)²) = √10')}`,
        `<p><strong>Square both sides, then subtract.</strong></p>
         ${sum('9 + (2 − a)² = 10<br>(2 − a)² = 1')}`,
        `<p><strong>Square root: there are two answers.</strong> If something squared is 1, it is 1 or −1.</p>
         ${sum('2 − a = 1, so a = 1<br>2 − a = −1, so a = 3')}
         ${ans('1, 3')}`
      )}
      ${tip('A whole-number distance like 5 squares to 25. Give both values, separated by a comma.')}`,

    // y10-1G Q6: perimeter on a scaled map, and the midpoint triangle
    // method: Example 20 and Example 21, 1G (distance and midpoint)
    'y10-1g-perimeter': `
      <p class="hp-tag">Worked example: a paddock has corners at <b>(−2, 1)</b>, <b>(2, 4)</b> and <b>(2, −2)</b>. One unit on the map is <b>100 m</b>.</p>
      ${fig({ kind: 'plane', x: [-3, 3], y: [-3, 5], path: [[-2, 1], [2, 4], [2, -2]], closed: true, points: { '': [-2, 1], ' ': [2, 4], '  ': [2, -2] }, alt: 'A triangle with corners (−2, 1), (2, 4) and (2, −2)' })}
      ${steps(
        `<p><strong>Find each side with the distance rule.</strong></p>
         ${sum('(−2, 1) to (2, 4): √(4² + 3²) = √25 = 5<br>(2, 4) to (2, −2): 6<br>(2, −2) to (−2, 1): √(4² + 3²) = 5')}`,
        `<p><strong>Add, then use the scale.</strong></p>
         ${sum('5 + 6 + 5 = 16 units = 1600 m')}`,
        `<p><strong>Fences joining the midpoints:</strong> find the midpoints (0, 2.5), (2, 1) and (0, −0.5), then the sides between them.</p>
         ${sum('√(2² + 1.5²) = √6.25 = 2.5, &nbsp;2.5, &nbsp;3<br>2.5 + 2.5 + 3 = 8 units = 800 m')}
         ${ans('1600 m and 800 m')}`
      )}
      ${tip('Keep the unrounded square roots until the end, then round the total to the nearest metre.')}`,

    // y10-1G Q7: does the order of the points matter?
    // method: Example 20 and Example 21, 1G (either point can be the first)
    'y10-1g-order': `
      <p class="hp-tag">Worked example: find the midpoint and the length of the segment from <b>(−1, 3)</b> to <b>(5, −5)</b>, both ways round.</p>
      ${steps(
        `<p><strong>Midpoint both ways.</strong> Adding gives the same total in either order.</p>
         ${sum('((−1 + 5)/2, (3 + (−5))/2) = (2, −1)<br>((5 + (−1))/2, (−5 + 3)/2) = (2, −1)')}`,
        `<p><strong>Length both ways.</strong> The differences just change sign, and squaring removes the sign.</p>
         ${sum('√((5 − (−1))² + (−5 − 3)²) = √(36 + 64) = √100 = 10<br>√((−1 − 5)² + (3 − (−5))²) = √(36 + 64) = 10')}
         ${ans('(2, -1) and 10 either way')}`
      )}
      ${tip('Pick whichever point makes the arithmetic easier: the answers do not change.')}`,

    // y10-1G Q9: dividing a segment in a ratio
    // method: no worked example in the book (split the change across and up into equal parts)
    'y10-1g-ratio': `
      <p class="hp-tag">Worked example: find the point that divides the segment from <b>(−2, 0)</b> to <b>(6, 4)</b> in the ratio (a) <b>1 : 3</b> (b) <b>3 : 1</b>.</p>
      ${fig({ kind: 'plane', x: [-3, 7], y: [-1, 5], path: [[-2, 0], [6, 4]], points: { '(−2, 0)': [-2, 0], '(0, 1)': [0, 1], '(2, 2)': [2, 2], '(4, 3)': [4, 3], '(6, 4)': [6, 4] }, alt: 'The segment from (−2, 0) to (6, 4) cut into four equal parts' })}
      ${steps(
        `<p><strong>Add the ratio parts</strong>: 1 + 3 = 4 equal parts. Find the change across and up for one part.</p>
         ${sum('across: 6 − (−2) = 8, so 8 ÷ 4 = 2 per part<br>up: 4 − 0 = 4, so 4 ÷ 4 = 1 per part')}`,
        `<p><strong>1 : 3 means 1 part from the start.</strong></p>
         ${sum('(a) (−2 + 2, 0 + 1) = (0, 1)')}`,
        `<p><strong>3 : 1 means 3 parts from the start.</strong></p>
         ${sum('(b) (−2 + 3 × 2, 0 + 3 × 1) = (4, 3)')}
         ${ans('(0, 1) and (4, 3)')}`
      )}
      ${tip('1 : 1 is the midpoint, (2, 2) here. Always start from the first point (the left one) and count the first number of parts.')}`,

    // y10-1G Q10: the distance to a point on a line
    // method: Example 20, 1G (distance rule), then substitute the line's equation for y
    'y10-1g-fence': `
      <p class="hp-tag">Worked example: you are at <b>(0, 5)</b> and a road follows <b>y = x − 1</b>. One unit is <b>100 m</b>. (x, y) is a point on the road.</p>
      ${graph([-1, 6], [-2, 6], [{ m: 1, c: -1, label: 'road y = x − 1', at: [4.4, 2.4] }], [[0, 5, 'you (0, 5)', 'e'], [3, 2, '(x, y)', 'nw']], 'You at (0, 5) and the road y = x − 1', 28)}
      ${steps(
        `<p><strong>Write the distance rule with (x, y).</strong></p>
         ${sum('d = √((x − 0)² + (y − 5)²)')}`,
        `<p><strong>Replace y with x − 1, then expand and simplify.</strong></p>
         ${sum('d = √(x² + (x − 1 − 5)²) = √(x² + (x − 6)²)<br>= √(x² + x² − 12x + 36) = √(2x² − 12x + 36)')}`,
        `<p><strong>Try some x values.</strong></p>
         ${sum('x = 2: √(8 − 24 + 36) = √20 = 4.472, so 447 m<br>x = 3: √(18 − 36 + 36) = √18 = 4.243, so 424 m<br>x = 4: √(32 − 48 + 36) = √20, so 447 m')}
         ${ans('closest at x = 3, the point (3, 2)')}`
      )}
      ${tip('Type square roots with brackets, like sqrt(2x^2-12x+36). Multiply map units by 100 to get metres, then round.')}`,

    // =====================================================================
    // Year 10 1H Parallel and perpendicular lines
    // =====================================================================
    // y10-1H Q1: parallel, perpendicular or neither?
    // method: Example 23, 1H (deciding if lines are parallel or perpendicular)
    'y10-1h-test': `
      <p class="hp-tag">Worked example: are these pairs parallel, perpendicular or neither? (a) <b>y = −4x + 1</b> and <b>y = x/4 − 3</b> (b) <b>3x + y = 2</b> and <b>x − 3y = 6</b> (c) <b>y = 3x</b> and <b>y = −3x + 1</b></p>
      ${steps(
        `<p><strong>Write each line as y = mx + c</strong> and read off the gradients.</p>
         ${sum('(a) m = −4 and m = 1/4<br>(b) y = −3x + 2, so m = −3; &nbsp;−3y = −x + 6, y = x/3 − 2, so m = 1/3<br>(c) m = 3 and m = −3')}`,
        `<p><strong>Same gradient: parallel. Gradients multiply to −1: perpendicular.</strong></p>
         ${sum('(a) −4 × 1/4 = −1<br>(b) −3 × 1/3 = −1<br>(c) 3 × (−3) = −9')}`,
        `<p><strong>Decide.</strong></p>
         ${ans('(a) Perpendicular (b) Perpendicular (c) Neither')}`
      )}
      ${chips(['m₁ = m₂: parallel', 'add'], ['m₁ × m₂ = −1: perpendicular', 'add'], ['anything else: neither', 'take'])}
      ${tip('Opposite signs alone are not enough (3 and −3 is neither). Perpendicular gradients are negative reciprocals: flip the fraction and change the sign.')}`,

    // y10-1H Q2, Q5: a parallel line through a point
    // method: Example 24a, 1H (finding the equation of a parallel line)
    'y10-1h-parallel': `
      <p class="hp-tag">Worked example: find the equation of the line that is (a) parallel to <b>y = 4x − 1</b> through <b>(2, 3)</b> (b) parallel to <b>3x + 2y = 6</b> through <b>(2, 1)</b></p>
      ${steps(
        `<p><strong>A parallel line has the same gradient.</strong></p>
         ${sum('(a) m = 4, so y = 4x + c')}`,
        `<p><strong>Substitute the point to find c.</strong></p>
         ${sum('3 = 4(2) + c<br>3 = 8 + c, so c = −5<br>y = 4x − 5')}`,
        `<p><strong>Given line not in y = mx + c form? Rearrange it first.</strong></p>
         ${sum('(b) 2y = −3x + 6, y = −3x/2 + 3, so m = −3/2<br>1 = −3/2 × 2 + c = −3 + c, so c = 4<br>y = −3x/2 + 4')}
         ${ans('y = 4x - 5 and y = -3x/2 + 4')}`
      )}
      ${tip('Type a fraction gradient like y = -3x/2 + 4. A fraction for c is fine too, like y = 2x/3 + 5/3.')}`,

    // y10-1H Q3, Q6: a perpendicular line through a point
    // method: Example 24b, 1H (finding the equation of a perpendicular line)
    'y10-1h-perp': `
      <p class="hp-tag">Worked example: find the equation of the line that is (a) perpendicular to <b>y = 2x + 3</b> through <b>(4, 1)</b> (b) perpendicular to <b>y = 2x/3 − 1</b> through <b>(2, −1)</b></p>
      ${graph([-1, 7], [-1, 6], [{ m: 2, c: 3, label: 'y = 2x + 3', at: [1.4, 5.4] }, { m: -0.5, c: 3, label: 'y = −x/2 + 3', at: [5.0, 2.3] }], [[4, 1, '(4, 1)', 'ne']], 'The line y = 2x + 3 and the perpendicular line y = −x/2 + 3 through (4, 1)', 28)}
      ${steps(
        `<p><strong>The perpendicular gradient is the negative reciprocal.</strong></p>
         ${sum('(a) m = −1/2 &nbsp;&nbsp; (b) m = −1 ÷ 2/3 = −3/2')}`,
        `<p><strong>Substitute the point into y = mx + c to find c.</strong></p>
         ${sum('(a) 1 = −1/2 × 4 + c = −2 + c, so c = 3<br>(b) −1 = −3/2 × 2 + c = −3 + c, so c = 2')}`,
        `<p><strong>Write the equation.</strong></p>
         ${ans('y = -x/2 + 3 and y = -3x/2 + 2')}`
      )}
      ${tip('Rearrange the given line into y = mx + c first if you need to. Check: 2 × (−1/2) = −1 ✓.')}`,

    // y10-1H Q7, Q13: two steps (perpendicular bisector, axis crossing)
    // method: Example 21, 1G (midpoint) and Example 24b, 1H (perpendicular line)
    'y10-1h-twostep': `
      <p class="hp-tag">Worked example: find the perpendicular bisector of the segment from <b>(0, 1)</b> to <b>(4, 9)</b>, and where it cuts the x-axis.</p>
      ${steps(
        `<p><strong>A bisector goes through the midpoint.</strong> Find it, and the segment's gradient.</p>
         ${sum('midpoint: ((0 + 4)/2, (1 + 9)/2) = (2, 5)<br>gradient: (9 − 1)/(4 − 0) = 8/4 = 2')}`,
        `<p><strong>Perpendicular gradient, then c.</strong></p>
         ${sum('m = −1/2<br>5 = −1/2 × 2 + c = −1 + c, so c = 6<br>y = −x/2 + 6')}`,
        `<p><strong>On the x-axis, y = 0.</strong></p>
         ${sum('0 = −x/2 + 6, so x = 12')}
         ${ans('y = -x/2 + 6, (12, 0)')}`
      )}
      <p><strong>Meeting a line at a given x?</strong> Put that x into the first line to get the meeting point, then use it to find c for the perpendicular line.</p>
      ${tip('Type the crossing as a point, like (12, 0). A fraction is fine, like (9/4, 0).')}`,

    // y10-1H Q4: vertical and horizontal lines
    // method: Key ideas, 1F (horizontal lines y = c, vertical lines x = k)
    'y10-1h-vh': `
      <p class="hp-tag">Worked example: find the line that is (a) parallel to <b>x = 1</b> through <b>(−3, 5)</b> (b) perpendicular to <b>x = 6</b> through <b>(2, −7)</b></p>
      ${steps(
        `<p><strong>x = a number is vertical.</strong> A parallel line is vertical too, so every point has the same x as the given point.</p>
         ${sum('(a) x = −3')}`,
        `<p><strong>Perpendicular to a vertical line means horizontal</strong>, so every point has the same y.</p>
         ${sum('(b) y = −7')}
         ${ans('x = -3 and y = -7')}`
      )}
      ${chips(['parallel to x = k: x = (the point\'s x)'], ['perpendicular to x = k: y = (the point\'s y)'], ['perpendicular to y = c: x = (the point\'s x)'])}
      ${tip('Fractions and decimals are fine: through (4, 3.5) parallel to y = −1 is y = 3.5.')}`,

    // y10-1H Q8, Q9, Q10: gradients with letters
    // method: Key ideas, 1H (parallel: same gradient; perpendicular: m₁ × m₂ = −1) and Example 24, 1H
    'y10-1h-letters': `
      <p class="hp-tag">Worked example: (a) the gradient of a line perpendicular to <b>2x + ky = 3</b> (b) find a if <b>y = (a/4)x + c</b> is perpendicular to <b>y = 2x − 1</b> (c) the line parallel to <b>y = 2x + c</b> through <b>(p, q)</b></p>
      ${steps(
        `<p><strong>Make y the subject, then take the negative reciprocal.</strong></p>
         ${sum('(a) ky = −2x + 3, so m = −2/k<br>perpendicular: −1 ÷ (−2/k) = k/2')}`,
        `<p><strong>Use m₁ × m₂ = −1 as an equation.</strong></p>
         ${sum('(b) (a/4) × 2 = −1<br>a/4 = −1/2, so a = −2')}`,
        `<p><strong>Substitute the point, with letters.</strong></p>
         ${sum('(c) y = 2x + d<br>q = 2p + d, so d = q − 2p<br>y = 2x − 2p + q')}
         ${ans('k/2, -2, y = 2x - 2p + q')}`
      )}
      ${tip('Type letter answers with / and brackets where needed, like k/2 or y = 2x - 2p + q.')}`,

    // y10-1H Q11, Q12: shapes on the plane
    // method: Example 17, 1F (gradients), Example 23, 1H (perpendicular test) and Example 20, 1G (lengths)
    'y10-1h-shape': `
      <p class="hp-tag">Worked example: triangle PQR has <b>P(0, 2)</b>, <b>Q(3, 8)</b> and <b>R(7, 6)</b>. What type of triangle is it, and what is its exact perimeter?</p>
      ${fig({ kind: 'plane', x: [-1, 8], y: [-1, 9], path: [[0, 2], [3, 8], [7, 6]], closed: true, points: { 'P': [0, 2], 'Q': [3, 8], 'R': [7, 6] }, alt: 'Triangle PQR with P(0, 2), Q(3, 8) and R(7, 6)' })}
      ${steps(
        `<p><strong>Find the gradient of each side.</strong></p>
         ${sum('PQ: (8 − 2)/(3 − 0) = 6/3 = 2<br>QR: (6 − 8)/(7 − 3) = −2/4 = −1/2<br>PR: (6 − 2)/(7 − 0) = 4/7')}`,
        `<p><strong>Test the pairs.</strong> 2 × (−1/2) = −1, so PQ and QR are perpendicular: a right angle at Q.</p>`,
        `<p><strong>Perimeter: find each length and simplify the surds.</strong></p>
         ${sum('PQ = √(3² + 6²) = √45 = 3√5<br>QR = √(4² + 2²) = √20 = 2√5<br>PR = √(7² + 4²) = √65<br>P = 3√5 + 2√5 + √65 = 5√5 + √65')}
         ${ans('Right-angled; 5sqrt5 + sqrt65')}`
      )}
      ${tip('Four sides: opposite sides with equal gradients are parallel. If the sides next to each other are also perpendicular, it is a rectangle. Collect like surds: 3√5 + 2√5 = 5√5.')}`,

    // =====================================================================
    // Year 10 1I Simultaneous equations using substitution
    // =====================================================================
    // y10-1I Q1: one equation has y (or x) as the subject
    // method: Example 25, 1I (solving simultaneous equations using substitution)
    'y10-1i-sub': `
      <p class="hp-tag">Worked example: solve (a) <b>3x + y = 11</b> [1] and <b>y = x − 1</b> [2] (b) <b>x = 2y + 1</b> [1] and <b>4y − x = 5</b> [2]</p>
      ${steps(
        `<p><strong>Label the equations and substitute the one with a letter as the subject into the other.</strong> Use brackets.</p>
         ${sum('(a) 3x + (x − 1) = 11<br>4x − 1 = 11, 4x = 12, x = 3')}`,
        `<p><strong>Substitute back to find the other letter.</strong></p>
         ${sum('y = 3 − 1 = 2')}`,
        `<p><strong>Same again when x is the subject.</strong> The brackets matter: −(2y + 1) = −2y − 1.</p>
         ${sum('(b) 4y − (2y + 1) = 5<br>2y − 1 = 5, 2y = 6, y = 3<br>x = 2(3) + 1 = 7')}
         ${ans('(3, 2) and (7, 3)')}`
      )}
      ${tip('Type the solution as a point, x first: (3, 2). Check in the other equation: 3(3) + 2 = 11 ✓.')}`,

    // y10-1I Q2: both equations with the same subject
    // method: Example 26, 1I (both equations in the form y = mx + c)
    'y10-1i-equal': `
      <p class="hp-tag">Worked example: solve (a) <b>y = 2x + 5</b> and <b>y = −x − 1</b> (b) <b>y = 3x − 1</b> and <b>y = (x + 13)/2</b></p>
      ${graph([-4, 2], [-3, 6], [{ m: 2, c: 5, label: 'y = 2x + 5', at: [0.35, 4.4] }, { m: -1, c: -1, label: 'y = −x − 1', at: [-3.8, 3.4] }], [[-2, 1, '(−2, 1)', 'e']], 'The lines y = 2x + 5 and y = −x − 1 crossing at (−2, 1)', 28)}
      ${steps(
        `<p><strong>Both equal y, so set them equal to each other.</strong></p>
         ${sum('(a) 2x + 5 = −x − 1<br>3x = −6, x = −2<br>y = 2(−2) + 5 = 1')}`,
        `<p><strong>A fraction? Multiply both sides by its bottom.</strong></p>
         ${sum('(b) 3x − 1 = (x + 13)/2<br>6x − 2 = x + 13<br>5x = 15, x = 3, y = 3(3) − 1 = 8')}
         ${ans('(-2, 1) and (3, 8)')}`
      )}
      ${tip('The answer is where the two graphs cross. Check y in the second equation as well: −(−2) − 1 = 1 ✓.')}`,

    // y10-1I Q3, Q5: comparing two linear rules
    // method: Example 26, 1I (two rules in the form y = mx + c, set equal)
    'y10-1i-rates': `
      <p class="hp-tag">Worked example: Plan A pays <b>$30</b> per hour. Plan B pays <b>$80</b> plus <b>$20</b> per hour. When do they pay the same?</p>
      ${steps(
        `<p><strong>Write a rule for each.</strong></p>
         ${sum('A: E = 30t &nbsp;&nbsp; B: E = 20t + 80')}`,
        `<p><strong>Set them equal and solve.</strong></p>
         ${sum('30t = 20t + 80<br>10t = 80, t = 8<br>E = 30 × 8 = 240')}`,
        `<p><strong>Answer the question.</strong> After 8 hours both pay $240.</p>
         ${ans('(8, 240)')}`
      )}
      <p><strong>Values going down?</strong> A car worth $36 000 losing $3000 a year has V = 36 000 − 3000t. Another worth $26 000 losing $1000 a year has V = 26 000 − 1000t. Equal: 36 000 − 3000t = 26 000 − 1000t gives 10 000 = 2000t, t = 5 and V = 21 000.</p>
      ${tip('Type rules with the question\'s letters, like E = 20t + 80, and a point as (t, E).')}`,

    // y10-1I Q4, Q6: word problems with two unknowns
    // method: Example 25, 1I (substitute one equation into the other)
    'y10-1i-story': `
      <p class="hp-tag">Worked example: (a) a mother and daughter's ages add to <b>46</b>. The mother is 6 more than 4 times the daughter's age. (b) A field has perimeter <b>800 m</b> and its length is <b>100 m</b> more than its width.</p>
      ${steps(
        `<p><strong>One letter per unknown, one equation per fact.</strong></p>
         ${sum('(a) m + d = 46, m = 4d + 6<br>(b) 2l + 2w = 800, l = w + 100')}`,
        `<p><strong>Substitute and solve.</strong></p>
         ${sum('(a) (4d + 6) + d = 46, 5d = 40, d = 8, m = 38<br>(b) 2(w + 100) + 2w = 800, 4w + 200 = 800, w = 150, l = 250')}`,
        `<p><strong>Answer what was asked.</strong></p>
         ${sum('(a) difference: 38 − 8 = 30<br>(b) area: 250 × 150 = 37 500 m²')}
         ${ans('30 and 37500')}`
      )}
      ${tip('The question might not ask for the unknowns themselves: here it wanted a difference and an area. Type big numbers without spaces.')}`,

    // y10-1I Q7, Q8: parallel lines and no solution
    // method: Key ideas, 1I (parallel lines: 0 points of intersection; otherwise one solution)
    'y10-1i-parallel': `
      <p class="hp-tag">Worked example: (a) do <b>y = 2x + 1</b> and <b>4x − 2y = 6</b> have a solution? (b) for what k do <b>y = kx − 2</b> and <b>6x − 2y = 5</b> have no solution?</p>
      ${steps(
        `<p><strong>Write both lines as y = mx + c.</strong></p>
         ${sum('(a) −2y = −4x + 6, so y = 2x − 3')}`,
        `<p><strong>Same gradient, different intercept: parallel lines never meet.</strong> y = 2x + 1 and y = 2x − 3 both have gradient 2, so there is no solution.</p>`,
        `<p><strong>For no solution, make the gradients equal.</strong></p>
         ${sum('(b) −2y = −6x + 5, y = 3x − 5/2<br>gradient 3, so k = 3')}
         ${ans('(a) No solution (b) 3')}`
      )}
      ${tip('Different gradients always cross once: y = 3x + 1 and y = −3x + 4 have one solution.')}`,

    // y10-1I Q9, Q10: solving with letters
    // method: Example 25, 1I (substitution), with factorising from 1A
    'y10-1i-literal': `
      <p class="hp-tag">Worked example: solve for x and y. (a) <b>x + y = 2k</b> and <b>y = 4x</b> (b) <b>px − y = q</b> and <b>y = 2x</b></p>
      ${steps(
        `<p><strong>Substitute as usual.</strong></p>
         ${sum('(a) x + 4x = 2k<br>5x = 2k, x = 2k/5<br>y = 4 × 2k/5 = 8k/5')}`,
        `<p><strong>x appears twice? Factorise it out.</strong></p>
         ${sum('(b) px − 2x = q<br>x(p − 2) = q, x = q/(p − 2)')}`,
        `<p><strong>Then find y.</strong></p>
         ${sum('y = 2x = 2q/(p − 2)')}
         ${ans('(2k/5, 8k/5) and (q/(p-2), 2q/(p-2))')}`
      )}
      ${tip('Use brackets for a sum or difference on the bottom: q/(p-2), not q/p-2.')}`,

    // =====================================================================
    // Year 10 1J Simultaneous equations using elimination
    // =====================================================================
    // y10-1J Q1: a matching pair of terms
    // method: Example 27, 1J (elimination with a matching pair of terms)
    'y10-1j-match': `
      <p class="hp-tag">Worked example: solve (a) <b>x + y = 9</b> [1] and <b>2x − y = 3</b> [2] (b) <b>5x + 2y = 21</b> [1] and <b>x + 2y = 9</b> [2]</p>
      ${steps(
        `<p><strong>Opposite signs (+y and −y): add the equations.</strong></p>
         ${sum('(a) [1] + [2]: 3x = 12, x = 4<br>4 + y = 9, y = 5')}`,
        `<p><strong>Same signs (+2y and +2y): subtract.</strong></p>
         ${sum('(b) [1] − [2]: 4x = 12, x = 3<br>3 + 2y = 9, 2y = 6, y = 3')}`,
        `<p><strong>Check in the equation you did not use.</strong> (a) 2(4) − 5 = 3 ✓</p>
         ${ans('(4, 5) and (3, 3)')}`
      )}
      ${tip('Add every term on both sides. When you subtract, a negative term flips: −3y − (−4y) = y.')}`,

    // y10-1J Q2, Q3, Q7: multiply first to make a matching pair
    // method: Example 28, 1J (multiply one or both equations, then eliminate)
    'y10-1j-multiply': `
      <p class="hp-tag">Worked example: solve (a) <b>x − y = 5</b> [1] and <b>2x + 5y = 3</b> [2] (b) <b>5x + 3y = 4</b> [1] and <b>3x − 2y = −9</b> [2]</p>
      ${steps(
        `<p><strong>Multiply one equation so a pair of terms matches.</strong> [1] × 2 gives 2x, like [2].</p>
         ${sum('(a) [1] × 2: 2x − 2y = 10 [3]<br>[2] − [3]: 7y = −7, y = −1<br>x − (−1) = 5, x = 4')}`,
        `<p><strong>Sometimes both need multiplying.</strong> Make 6y and −6y.</p>
         ${sum('(b) [1] × 2: 10x + 6y = 8<br>[2] × 3: 9x − 6y = −27<br>add: 19x = −19, x = −1')}`,
        `<p><strong>Substitute to find y.</strong></p>
         ${sum('5(−1) + 3y = 4, 3y = 9, y = 3')}
         ${ans('(4, -1) and (-1, 3)')}`
      )}
      <p><strong>Add or subtract?</strong> Adding 4x − 2y and −x − 2y keeps the y terms (−4y). The y terms have the same sign, so you must subtract to remove them.</p>
      ${tip('Add when the matching terms have opposite signs; subtract when they have the same sign.')}`,

    // y10-1J Q4, Q5, Q6: word problems
    // method: Example 27 and Example 28, 1J (elimination)
    'y10-1j-words': `
      <p class="hp-tag">Worked example: (a) two numbers add to <b>1000</b> and differ by <b>64</b>. (b) 3 burgers and 2 chips cost <b>$26.50</b>; 1 burger and 1 chips cost <b>$10</b>.</p>
      ${steps(
        `<p><strong>Sum and difference: add.</strong></p>
         ${sum('(a) x + y = 1000, x − y = 64<br>2x = 1064, x = 532, y = 468')}`,
        `<p><strong>Define the letters and write the equations.</strong></p>
         ${sum('(b) 3b + 2c = 26.5 [1]<br>b + c = 10 [2]')}`,
        `<p><strong>Multiply to match, then subtract.</strong></p>
         ${sum('[2] × 2: 2b + 2c = 20 [3]<br>[1] − [3]: b = 6.5, so c = 3.5')}
         ${ans('532, 468; burger $6.50, chips $3.50')}`
      )}
      ${tip('Answer the exact question: if it asks for the drink, give the drink. Type money without the $, like 3.50.')}`,

    // y10-1J Q8, Q9: letters, and no solution
    // method: Example 27, 1J (add or subtract the equations)
    'y10-1j-literal': `
      <p class="hp-tag">Worked example: (a) solve <b>px + y = 5</b> [1] and <b>px − y = 1</b> [2] for x and y (b) why do <b>2x + 3y = 4</b> and <b>2x + 3y = 9</b> have no solution?</p>
      ${steps(
        `<p><strong>Add to remove y.</strong></p>
         ${sum('(a) [1] + [2]: 2px = 6, x = 3/p')}`,
        `<p><strong>Subtract to remove px.</strong></p>
         ${sum('[1] − [2]: 2y = 4, y = 2')}
         ${ans('(3/p, 2)')}`,
        `<p><strong>Subtracting removes everything on the left.</strong></p>
         ${sum('(b) 0 = −5')}
         <p>That is never true. The lines have the same gradient but different intercepts, so they are parallel and never meet.</p>`
      )}
      ${tip('Type letter answers as a point, like (3/p, 2).')}`,

    // y10-1J Q10: partial fractions
    // method: Example 28, 1J (elimination), on the equations from equating coefficients (method shown in the question)
    'y10-1j-partial': `
      <p class="hp-tag">Worked example: find a and b if <b>(5x − 4)/((x − 2)(x + 1)) = a/(x − 2) + b/(x + 1)</b>.</p>
      ${steps(
        `<p><strong>Combine the right side over the same bottom and match the tops.</strong></p>
         ${sum('a(x + 1) + b(x − 2) = 5x − 4<br>ax + a + bx − 2b = 5x − 4')}`,
        `<p><strong>Match the x terms and the numbers.</strong></p>
         ${sum('x terms: a + b = 5 [1]<br>numbers: a − 2b = −4 [2]')}`,
        `<p><strong>Solve by elimination.</strong></p>
         ${sum('[1] − [2]: 3b = 9, b = 3<br>a + 3 = 5, a = 2')}
         ${ans('2, 3')}`
      )}
      ${tip('Check by expanding: 2(x + 1) + 3(x − 2) = 5x − 4 ✓. Type a, then b, with a comma.')}`,

    // =====================================================================
    // Year 10 1K Further applications of simultaneous equations
    // =====================================================================
    // y10-1K Q1, Q2: a sum and a difference
    // method: Example 29, 1K (setting up and solving simultaneous equations)
    'y10-1k-sumdiff': `
      <p class="hp-tag">Worked example: the ages of Kai and his younger brother Leo add to <b>26</b> and differ by <b>4</b>.</p>
      ${steps(
        `<p><strong>Define the letters.</strong> Let k be Kai's age and l be Leo's age.</p>
         ${sum('k + l = 26 [1]<br>k − l = 4 [2]')}`,
        `<p><strong>Add to remove l.</strong></p>
         ${sum('2k = 30, k = 15<br>15 + l = 26, l = 11')}`,
        `<p><strong>Answer in words.</strong> Kai is 15 and Leo is 11.</p>
         ${ans('15 and 11')}`
      )}
      <p><strong>"7 years older" and a total of 45:</strong> a = b + 7 and a + b = 45. Substituting gives 2b + 7 = 45, so b = 19 and a = 26.</p>
      ${tip('Check both facts: 15 + 11 = 26 ✓ and 15 − 11 = 4 ✓.')}`,

    // y10-1K Q3, Q5, Q8: two purchases
    // method: Example 30, 1K (multiply to match, then eliminate)
    'y10-1k-purchases': `
      <p class="hp-tag">Worked example: 4 pens and 3 rulers cost <b>$7.90</b>. 2 pens and 5 rulers cost <b>$7.10</b>. Find the cost of each.</p>
      ${steps(
        `<p><strong>Let $p be a pen and $r a ruler.</strong></p>
         ${sum('4p + 3r = 7.90 [1]<br>2p + 5r = 7.10 [2]')}`,
        `<p><strong>Multiply to match the p terms, then subtract.</strong></p>
         ${sum('[2] × 2: 4p + 10r = 14.20 [3]<br>[3] − [1]: 7r = 6.30, r = 0.90')}`,
        `<p><strong>Substitute to find p.</strong></p>
         ${sum('4p + 2.70 = 7.90, 4p = 5.20, p = 1.30')}
         ${ans('pen $1.30, ruler $0.90')}`
      )}
      <p><strong>"Costs $2 more than":</strong> a pie costs $2 more than a drink, and 3 pies and 2 drinks cost $21. p = d + 2, so 3(d + 2) + 2d = 21, 5d = 15, d = 3 and p = 5. <strong>Asked for a mix?</strong> 2 pens and 1 ruler cost 2(1.30) + 0.90 = $3.50.</p>
      ${tip('Type money as a decimal without the $, like 0.90.')}`,

    // y10-1K Q4, Q6, Q7: counting and totals (tickets, legs, coins)
    // method: Example 30, 1K (two equations, then elimination)
    'y10-1k-count': `
      <p class="hp-tag">Worked example: a farm has ducks and sheep: <b>60</b> heads and <b>170</b> legs. How many of each?</p>
      ${steps(
        `<p><strong>One equation counts the things, the other counts their total.</strong> A duck has 2 legs and a sheep has 4.</p>
         ${sum('d + s = 60 [1]<br>2d + 4s = 170 [2]')}`,
        `<p><strong>Multiply to match, then subtract.</strong></p>
         ${sum('[1] × 2: 2d + 2s = 120 [3]<br>[2] − [3]: 2s = 50, s = 25<br>d = 60 − 25 = 35')}`,
        `<p><strong>Answer in words.</strong> 35 ducks and 25 sheep.</p>
         ${ans('35 ducks, 25 sheep')}`
      )}
      <p><strong>Tickets work the same way:</strong> 800 people at $5 a child and $12 an adult, taking $6100: c + a = 800 and 5c + 12a = 6100. Multiply the first by 5 and subtract: 7a = 2100, so a = 300 and c = 500.</p>
      ${tip('Coins: one equation for the number of coins and one for their value. Write 10c as 0.1 if the total is in dollars.')}`,

    // y10-1K Q9: ages in the past and the future
    // method: Example 29, 1K (define the unknowns, write two equations, solve)
    'y10-1k-ages': `
      <p class="hp-tag">Worked example: three years ago a mother was <b>5 times</b> as old as her son. In five years she will be <b>3 times</b> as old. How old is she now?</p>
      ${steps(
        `<p><strong>Let m and s be their ages now.</strong> Take 3 from both ages for the past and add 5 to both for the future.</p>
         ${sum('m − 3 = 5(s − 3), so m = 5s − 12<br>m + 5 = 3(s + 5), so m = 3s + 10')}`,
        `<p><strong>Both equal m, so set them equal.</strong></p>
         ${sum('5s − 12 = 3s + 10<br>2s = 22, s = 11<br>m = 3(11) + 10 = 43')}`,
        `<p><strong>Check:</strong> 3 years ago, 40 = 5 × 8 ✓. In 5 years, 48 = 3 × 16 ✓.</p>
         ${ans('43')}`
      )}
      ${tip('Change both ages by the same number of years. Use brackets: 5(s − 3), not 5s − 3.')}`,

    // y10-1K Q10, Q11, Q12: speed, distance and time
    // method: Key ideas, 1K (define the unknowns, write equations, solve) with d = s × t
    'y10-1k-motion': `
      <p class="hp-tag">Worked example: (a) Ava rides at <b>10 km/h</b>. Half an hour later Ben follows at <b>15 km/h</b>. (b) Two walkers <b>3 km</b> apart walk towards each other at <b>4 km/h</b> and <b>5 km/h</b>.</p>
      ${steps(
        `<p><strong>Catching up: both travel the same distance.</strong> Let t be Ava's time in hours; Ben rides for t − 0.5.</p>
         ${sum('10t = 15(t − 0.5)<br>10t = 15t − 7.5, 5t = 7.5, t = 1.5<br>Ben rides 1.5 − 0.5 = 1 hour')}`,
        `<p><strong>Towards each other: the distances add to the gap.</strong></p>
         ${sum('4t + 5t = 3, 9t = 3, t = 1/3 h = 20 min')}`,
        `<p><strong>With a current:</strong> a swimmer at 5 m/s in still water, current 2 m/s, goes 7 m/s downstream and 3 m/s back. The trip takes 10 min = 600 s:</p>
         ${sum('d/7 + d/3 = 600<br>3d + 7d = 12 600, d = 1260 m')}
         ${ans('1 hour, 20 min, 1260 m')}`
      )}
      ${tip('Answer in the unit asked: 1/3 of an hour is 20 minutes. Keep metres with seconds and km with hours.')}`,

    // y10-1K Q13, Q14: mixtures and concentration
    // method: Example 30, 1K (two equations, then elimination)
    'y10-1k-mixture': `
      <p class="hp-tag">Worked example: a jug holds <b>25%</b> juice. Pure (100%) juice is added to make <b>3 L</b> of <b>40%</b> juice. How much pure juice was added?</p>
      ${steps(
        `<p><strong>Let x litres of pure juice and y litres of 25% juice.</strong> One equation for volume, one for the amount of juice.</p>
         ${sum('x + y = 3 [1]<br>x + 0.25y = 0.4 × 3 = 1.2 [2]')}`,
        `<p><strong>Subtract to remove x.</strong></p>
         ${sum('[1] − [2]: 0.75y = 1.8, y = 2.4')}`,
        `<p><strong>Find x.</strong></p>
         ${sum('x = 3 − 2.4 = 0.6')}
         ${ans('0.6 L')}`
      )}
      ${tip('Amount of juice = strength × volume, with the strength as a decimal (40% = 0.4). Pure juice counts as 1 × its volume.')}`,

    // =====================================================================
    // Year 10 1L Regions on the Cartesian plane
    // =====================================================================
    // y10-1L Q1, Q4: which side is shaded, and solid or dashed?
    // method: Key ideas, 1L (y ≥ mx + c: solid, above ... y &lt; mx + c: dashed, below)
    'y10-1l-describe': `
      <p class="hp-tag">Worked example: describe the region (a) <b>y ≤ −x + 4</b> (b) <b>y &gt; 2x + 1</b> (c) <b>x ≥ 3</b> (d) <b>2x + 3y &lt; 6</b></p>
      ${region([-2, 6], [-2, 6], [[1, 1, 4]], [{ m: -1, c: 4, label: 'y = −x + 4', at: [3.3, 1.6] }], [], 'The line y = −x + 4 drawn solid with the region below it shaded', 24)}
      ${steps(
        `<p><strong>With y as the subject:</strong> ≥ or &gt; shades above the line, ≤ or &lt; shades below. ≤ or ≥ includes the line (solid); &lt; or &gt; does not (dashed).</p>
         ${sum('(a) below, solid (the picture)<br>(b) above, dashed<br>(c) x ≥ 3: right of the vertical line, solid')}`,
        `<p><strong>Make y the subject first.</strong></p>
         ${sum('(d) 3y &lt; −2x + 6<br>y &lt; −2x/3 + 2: below, dashed')}`,
        `<p><strong>Dividing by a negative reverses the symbol.</strong></p>
         ${sum('6x − 2y ≥ 4<br>−2y ≥ −6x + 4<br>y ≤ 3x − 2: below, solid')}
         ${ans('(a) below, solid (b) above, dashed (c) right, solid (d) below, dashed')}`
      )}
      ${tip('A dashed line means the points on the line are not in the region.')}`,

    // y10-1L Q2, Q3: is a point in the region?
    // method: Example 31b, 1L (test a point)
    'y10-1l-test': `
      <p class="hp-tag">Worked example: are <b>(0, 0)</b>, <b>(4, 1)</b> and <b>(3, −1)</b> in the region <b>2x − 3y &lt; 6</b>?</p>
      ${steps(
        `<p><strong>Substitute the point into the inequality.</strong></p>
         ${sum('(0, 0): 2(0) − 3(0) = 0, and 0 &lt; 6 (true)<br>(4, 1): 2(4) − 3(1) = 5, and 5 &lt; 6 (true)<br>(3, −1): 2(3) − 3(−1) = 9, and 9 &lt; 6 (false)')}`,
        `<p><strong>True means the point is in the region.</strong></p>
         ${ans('Yes, Yes, No')}`
      )}
      <p><strong>A point on the line itself?</strong> (3, 0) gives 6 &lt; 6, which is false, so it is not in the region (the line is dashed). With ≤ it would be in.</p>
      ${tip('Testing (0, 0) is the quickest way to decide which side to shade, as long as the line does not go through (0, 0).')}`,

    // y10-1L Q5, Q8: the inequality for a shaded region
    // method: Example 19, 1F (equation of a line from two points) with Key ideas, 1L (above or below, solid or dashed)
    'y10-1l-match': `
      <p class="hp-tag">Worked example: which inequality gives this shaded region?</p>
      ${region([-2, 4], [-3, 5], [[-2, 1, -1]], [{ m: 2, c: -1, label: '', at: [0, 0] }], [[0, -1, '(0, −1)', 'e'], [2, 3, '(2, 3)', 'w']], 'A solid line through (0, −1) and (2, 3) with the region below it shaded', 26)}
      ${steps(
        `<p><strong>Find the equation of the boundary line.</strong></p>
         ${sum('m = (3 − (−1))/(2 − 0) = 4/2 = 2, c = −1<br>y = 2x − 1')}`,
        `<p><strong>Below the line: y ≤ or y &lt;. Solid line: included.</strong></p>
         ${ans('y ≤ 2x − 1')}`,
        `<p><strong>Check with a point in the shading</strong>, like (2, 0): 0 ≤ 2(2) − 1 = 3 ✓.</p>`
      )}
      ${tip('Several boundaries? Do each line separately, then pick the option where every inequality matches its side and its solid or dashed line.')}`,

    // y10-1L Q6: where the boundary lines meet
    // method: Example 32, 1L (finding the intersecting region and the point of intersection)
    'y10-1l-intersect': `
      <p class="hp-tag">Worked example: <b>2x + y ≤ 7</b> and <b>x − y &gt; −1</b> are graphed together. Find where the boundary lines meet.</p>
      ${region([-2, 5], [-2, 7], [[2, 1, 7], [-1, 1, 1]], [{ m: -2, c: 7, label: '2x + y = 7', at: [3.1, 1.7] }, { m: 1, c: 1, dash: true, label: 'x − y = −1', at: [4.1, 4.4] }], [[2, 3, '(2, 3)', 'e']], 'The solid line 2x + y = 7 and the dashed line x − y = −1 meeting at (2, 3), with the region between them shaded', 24)}
      ${steps(
        `<p><strong>Change each inequality into an equation</strong>: the boundary lines.</p>
         ${sum('2x + y = 7 [1]<br>x − y = −1 [2]')}`,
        `<p><strong>Solve them simultaneously.</strong> Add to remove y.</p>
         ${sum('[1] + [2]: 3x = 6, x = 2<br>2(2) + y = 7, y = 3')}
         ${ans('(2, 3)')}`
      )}
      ${tip('Use elimination or substitution, whichever suits. Type the point like (2, 3); fractions are fine, like (5/2, -1).')}`,

    // y10-1L Q7, Q10: the area of a region
    // method: no worked example in the book (sketch, find the corners, use ½ × base × height or split the shape)
    'y10-1l-area': `
      <p class="hp-tag">Worked example: find the area of the region <b>x ≥ 0</b>, <b>y ≥ 0</b>, <b>3x + 2y ≤ 12</b>.</p>
      ${region([-1, 6], [-1, 7], [[-1, 0, 0], [0, -1, 0], [3, 2, 12]], [{ m: -1.5, c: 6, label: '3x + 2y = 12', at: [2.5, 3] }], [[4, 0, '(4, 0)', 'ne'], [0, 6, '(0, 6)', 'e']], 'A triangle with corners (0, 0), (4, 0) and (0, 6)', 24)}
      ${steps(
        `<p><strong>Find the corners.</strong> The line meets the axes at its intercepts.</p>
         ${sum('y = 0: 3x = 12, x = 4, so (4, 0)<br>x = 0: 2y = 12, y = 6, so (0, 6)')}`,
        `<p><strong>Area of the triangle.</strong></p>
         ${sum('A = ½ × 4 × 6 = 12')}
         ${ans('12')}`
      )}
      <p><strong>Corners not on the axes?</strong> Solve pairs of boundary lines simultaneously to find them. For x ≥ 0, y ≤ 4, y ≥ x the corners are (0, 0), (0, 4) and (4, 4), so A = ½ × 4 × 4 = 8. A four-sided region can be split into two triangles.</p>
      ${tip('Draw the sketch first: it shows which side is the base and which length is the height. A fraction answer is fine.')}`,
  });
})();
