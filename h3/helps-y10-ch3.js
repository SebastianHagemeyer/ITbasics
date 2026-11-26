/* H3 help panels for Year 10 Chapter 3. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 3A to 3L. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers for this chapter ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  // Many points along y = f(x) for x in X, kept inside the y-window Y (the crossing point is added at the edge).
  const ppath = (f, X, Y, step = 0.04) => {
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
  // A sketch with axes and no grid: several curves, each scaled by sx across and sy up.
  // pts: [[x, y, name, pos], ...] and labels: [[x, y, text, anchor], ...] in the graph's own numbers.
  const curves = (fs, X, Y, pts, labels, alt, o = {}) => {
    const sx = o.sx || 1, sy = o.sy || 1;
    const xa = Math.min(X[0] * sx, -0.6) - 0.4, xb = Math.max(X[1] * sx, 0.6) + 0.6;
    const ya = Math.min(Y[0] * sy, -0.6) - 0.3, yb = Math.max(Y[1] * sy, 0.6) + 0.5;
    const items = [
      { seg: [xa, 0, xb, 0], arrow: 'end', thin: true }, { seg: [0, ya, 0, yb], arrow: 'end', thin: true },
      { label: 'x', at: [xb + 0.45, 0] }, { label: 'y', at: [0, yb + 0.5] }, { label: 'O', at: [-0.4, -0.5] }
    ];
    for (const f of fs) items.push({ poly: ppath(f, X, Y).map(([x, y]) => [r3(x * sx), r3(y * sy)]), open: true });
    if (o.line !== undefined) items.push({ seg: [xa, r3(o.line * sy), xb, r3(o.line * sy)], dash: true, thin: true });
    for (const [x, y, name, pos] of pts) items.push({ point: [r3(x * sx), r3(y * sy)], name, pos: pos || 'ne' });
    for (const [x, y, text, anchor] of labels) items.push({ label: text, at: [r3(x * sx), r3(y * sy)], anchor: anchor || 'start' });
    return fig({ kind: 'diagram', unit: o.unit || 26, items, alt });
  };
  const fr = (a, b) => `<sup>${a}</sup>&frasl;<sub>${b}</sub>`;   // a small fraction, for fractional powers

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 3A Review of index laws
    // =====================================================================
    // method: Example 1a, b, 3A (index law for multiplication)
    // y10-3A Q1: multiplying powers
    'y10-3a-multiply': `
      <p class="hp-tag">Worked example: simplify (a) <b>b⁷ × b⁴</b> and (b) <b>6p²q × 5pq⁴</b>.</p>
      ${steps(
        `<p><strong>Same base: keep the base and add the indices.</strong></p>
         ${sum('(a) b⁷ × b⁴ = b<sup>7 + 4</sup> = b¹¹')}`,
        `<p><strong>Numbers in front: multiply them.</strong> Then add the indices for each letter. A letter on its own has index 1, so p = p¹.</p>
         ${sum(`(b) 6p²q × 5pq⁴<br>= ${now('6 × 5')} × p<sup>2 + 1</sup> × q<sup>1 + 4</sup><br>= 30p³q⁵`)}
         ${ans('30p^3q^5')}`
      )}
      <p><strong>A fraction in front?</strong> Multiply the fractions as normal: ¼k³ × k² = k⁵/4.</p>
      ${tip('Type powers with ^, like 30p^3q^5, and a fraction with /, like k^5/4. Only add indices of the same letter.')}`,

    // method: Example 1c, d, 3A (index law for division, written as a fraction)
    // y10-3A Q2: dividing powers
    'y10-3a-divide': `
      <p class="hp-tag">Worked example: simplify (a) <b>h¹⁰ ÷ h⁶</b> and (b) <b>6a⁵b⁴ ÷ (9a²b)</b>.</p>
      ${steps(
        `<p><strong>Same base: keep the base and subtract the indices.</strong></p>
         ${sum('(a) h¹⁰ ÷ h⁶ = h<sup>10 − 6</sup> = h⁴')}`,
        `<p><strong>Write the division as a fraction.</strong></p>
         ${sum('(b) 6a⁵b⁴ ÷ (9a²b) = 6a⁵b⁴ / (9a²b)')}`,
        `<p><strong>Cancel the numbers and subtract the indices for each letter.</strong> 6/9 cancels to 2/3.</p>
         ${sum('= 2a<sup>5 − 2</sup>b<sup>4 − 1</sup> / 3 = 2a³b³/3')}
         ${ans('2a^3b^3/3')}`
      )}
      ${tip('If a letter has the same index on the top and the bottom, it cancels completely (b³/b³ = b⁰ = 1). Type a fraction like 2a^3b^3/3, and keep a minus sign at the front: -x/4.')}`,

    // method: Example 2, 3A (power of a power, brackets and fractions)
    // y10-3A Q3, Q7: powers of brackets
    'y10-3a-brackets': `
      <p class="hp-tag">Worked example: simplify (a) <b>(m⁵)³</b>, (b) <b>(3k⁴)²</b> and (c) <b>(p² / (4q³))²</b>.</p>
      ${steps(
        `<p><strong>A power of a power: multiply the indices.</strong></p>
         ${sum('(a) (m⁵)³ = m<sup>5 × 3</sup> = m¹⁵')}`,
        `<p><strong>Brackets: the outside index goes onto every factor inside</strong>, numbers too. 3 is 3¹.</p>
         ${sum('(b) (3k⁴)² = 3² × k<sup>4 × 2</sup> = 9k⁸')}`,
        `<p><strong>A fraction: the index goes on the top and on every factor of the bottom.</strong></p>
         ${sum('(c) (p² / (4q³))² = p⁴ / (4²q⁶) = p⁴/(16q⁶)')}
         ${ans('p^4/(16q^6)')}`
      )}
      <p><strong>Brackets inside brackets?</strong> Multiply all the indices: ((y²)³)⁵ = y<sup>2 × 3 × 5</sup> = y³⁰.</p>
      ${tip('A number in front of the brackets is not raised to the power: 5(n²)³ = 5n⁶. Put brackets round a bottom with two parts: p^4/(16q^6).')}`,

    // method: Example 3, 3A (zero index rule)
    // y10-3A Q4: the zero index
    'y10-3a-zero': `
      <p class="hp-tag">Worked example: evaluate (a) <b>7m⁰</b> and (b) <b>3k⁰ + (5k)⁰</b>.</p>
      ${steps(
        `<p><strong>Anything (except 0) to the power 0 is 1.</strong> In 7m⁰ only the m has the power 0.</p>
         ${sum('(a) 7m⁰ = 7 × 1 = 7')}`,
        `<p><strong>Look at what the power sits on.</strong> In (5k)⁰ the whole bracket is to the power 0, so it is 1.</p>
         ${sum('(b) 3k⁰ + (5k)⁰ = 3 × 1 + 1 = 4')}
         ${ans('4')}`
      )}
      ${chips(['2xy⁰ = 2x × 1 = 2x'], ['(2xy)⁰ = 1', 'add'])}
      ${tip('Do the powers first, then the multiplying, then the adding or subtracting. The answer is a plain number when every letter has the power 0.')}`,

    // method: Example 4, 3A (combining index laws: brackets first, then multiply, then divide)
    // y10-3A Q5: using several index laws
    'y10-3a-combine': `
      <p class="hp-tag">Worked example: simplify (a) <b>4a³b² × 5ab³ ÷ (10a²b)</b> and (b) <b>2(p³q)² × 5pq³ / (4p⁵q²)</b>.</p>
      ${steps(
        `<p><strong>(a) Multiply first.</strong> Multiply the numbers and add the indices.</p>
         ${sum('4a³b² × 5ab³ = 20a⁴b⁵')}
         <p><strong>Then divide.</strong> Divide the numbers and subtract the indices.</p>
         ${sum('20a⁴b⁵ / (10a²b) = 2a²b⁴')}`,
        `<p><strong>(b) Remove the brackets first.</strong> Multiply the indices inside by 2. The 2 in front stays as it is.</p>
         ${sum('2(p³q)² = 2p⁶q²')}`,
        `<p><strong>Simplify the top, then the fraction.</strong></p>
         ${sum('2p⁶q² × 5pq³ = 10p⁷q⁵<br>10p⁷q⁵ / (4p⁵q²) = 5p²q³/2')}
         ${ans('5p^2q^3/2')}`
      )}
      ${tip('Order: brackets, then multiply, then divide. Cancel the numbers like a normal fraction: 10/4 = 5/2. Type 5p^2q^3/2.')}`,

    // method: no worked example in the book; plainest method: write the power out as repeated multiplication
    // y10-3A Q6, Q9: negative numbers and powers
    'y10-3a-negbase': `
      <p class="hp-tag">Worked example: evaluate <b>(−4)³</b>, <b>(−4)²</b> and <b>−4²</b>.</p>
      ${steps(
        `<p><strong>A bracket means the negative sign is part of the base.</strong> Write the multiplication out.</p>
         ${sum('(−4)³ = −4 × −4 × −4 = −64<br>(−4)² = −4 × −4 = 16')}`,
        `<p><strong>No bracket means only the 4 is squared.</strong> The minus sign is put on afterwards.</p>
         ${sum('−4² = −(4 × 4) = −16')}
         ${ans('-64, 16, -16')}`
      )}
      ${chips(['negative base, odd power: negative', 'take'], ['negative base, even power: positive', 'add'])}
      <p><strong>On a calculator</strong>, type the brackets: (−4)^2 gives 16, but −4^2 gives −16, because the calculator squares 4 first.</p>
      ${tip('−(4)³ is the same as −4³: the minus sign is outside, so it is −64.')}`,

    // method: Example 1c, 3A (subtract the indices) and Example 2a, 3A (power of a power to make the bases match)
    // y10-3A Q8: evaluating without a calculator
    'y10-3a-evaluate': `
      <p class="hp-tag">Worked example: evaluate without a calculator (a) <b>9⁷ / 9⁵</b> and (b) <b>25³ / 5⁴</b>.</p>
      ${steps(
        `<p><strong>Same base: subtract the indices, then work out the small power that is left.</strong></p>
         ${sum('(a) 9⁷ / 9⁵ = 9<sup>7 − 5</sup> = 9² = 81')}`,
        `<p><strong>Different bases: write one as a power of the other.</strong> 25 = 5², then use the power of a power law.</p>
         ${sum('(b) 25³ = (5²)³ = 5⁶')}`,
        `<p><strong>Now the bases match.</strong></p>
         ${sum('5⁶ / 5⁴ = 5² = 25')}
         ${ans('81 and 25')}`
      )}
      ${tip('Never work out 9⁷ in full. Cancel the powers first, so the numbers stay small. Useful facts: 4 = 2², 8 = 2³, 9 = 3², 27 = 3³.')}`,

    // method: no worked example in 3A; plainest method: list the powers of the base until the number appears
    // y10-3A Q10, Q12, Q13: finding an unknown index
    'y10-3a-find-index': `
      <p class="hp-tag">Worked example: find a when (a) <b>7<sup>a</sup> = 343</b>, (b) <b>2<sup>a − 1</sup> = 64</b> and (c) <b>(−4)<sup>a</sup> = −64</b>.</p>
      ${steps(
        `<p><strong>List the powers of the base until you reach the number.</strong></p>
         ${sum('(a) 7¹ = 7, 7² = 49, 7³ = 343, so a = 3')}`,
        `<p><strong>The whole index (a − 1) is the power you find.</strong> 2⁶ = 64, so the index must be 6.</p>
         ${sum('(b) a − 1 = 6, so a = 7')}`,
        `<p><strong>A negative base gives a negative answer only for an odd power.</strong> (−4)³ = −64, so a = 3.</p>
         ${ans('3, 7 and 3')}`
      )}
      <p><strong>An unknown base?</strong> If x⁴ = 16, then x = 2 works, and so does x = −2, because an even power makes a negative number positive. Give both, separated by a comma: 2, -2.</p>
      <p><strong>Every way to make a number:</strong> for xʸ = 64, the bases are 2 (2⁶), 4 (4³), 8 (8²) and 64 (64¹).</p>
      ${tip('Anything to the power 0 is 1, so if the index has to make 1, the index is 0.')}`,

    // method: Example 2a, 3A (power of a power, used to rebuild a power from one you know)
    // y10-3A Q11: using a value you are given
    'y10-3a-substitute': `
      <p class="hp-tag">Worked example: if <b>x³ = 4</b>, find x⁶, 2x⁹ and x⁶ − 3x³.</p>
      ${steps(
        `<p><strong>Write each power using x³.</strong> Multiply indices backwards: 6 = 3 × 2 and 9 = 3 × 3.</p>
         ${sum('x⁶ = (x³)²<br>x⁹ = (x³)³')}`,
        `<p><strong>Swap x³ for 4.</strong></p>
         ${sum('x⁶ = 4² = 16<br>2x⁹ = 2 × 4³ = 2 × 64 = 128<br>x⁶ − 3x³ = 16 − 3 × 4 = 4')}
         ${ans('16, 128, 4')}`
      )}
      ${tip('You never need x itself. Find the power you want as a power of the one you were given.')}`,

    // =====================================================================
    // Year 10 3B Negative indices
    // =====================================================================
    // method: Example 5, 3B (a⁻ⁿ = 1/aⁿ and 1/a⁻ⁿ = aⁿ)
    // y10-3B Q1, Q2, Q9: writing with positive indices
    'y10-3b-positive': `
      <p class="hp-tag">Worked example: write with positive indices (a) <b>k⁻⁵</b>, (b) <b>4a⁻²b³</b> and (c) <b>7 / m⁻²</b>.</p>
      ${steps(
        `<p><strong>A negative index means "one over".</strong></p>
         ${sum('(a) k⁻⁵ = 1/k⁵')}`,
        `<p><strong>Only the letter with the negative index moves to the bottom.</strong> The 4 and the b³ stay on top.</p>
         ${sum('(b) 4a⁻²b³ = 4/1 × 1/a² × b³/1 = 4b³/a²')}`,
        `<p><strong>A negative index on the bottom moves to the top.</strong></p>
         ${sum('(c) 7 / m⁻² = 7 × m² = 7m²')}
         ${ans('1/k^5, 4b^3/a^2, 7m^2')}`
      )}
      <p><strong>Fractions in front stay where they are:</strong> ⅖p⁻³q = 2q/(5p³).</p>
      ${tip('The negative index belongs only to the letter it sits on: 4a⁻² is 4/a², not 1/(4a²). Type 4b^3/a^2, and use brackets for a bottom with two parts: 2q/(5p^3).')}`,

    // method: Example 6a, 3B (add or subtract indices, then make the indices positive)
    // y10-3B Q3: multiplying and dividing with negative indices
    'y10-3b-laws': `
      <p class="hp-tag">Worked example: simplify, with positive indices, (a) <b>m³ × m⁻⁷</b> and (b) <b>6x²y³ / (9x⁵y)</b>.</p>
      ${steps(
        `<p><strong>Use the index laws as usual.</strong> Adding a negative index is subtracting.</p>
         ${sum('(a) m³ × m⁻⁷ = m<sup>3 + (−7)</sup> = m⁻⁴ = 1/m⁴')}`,
        `<p><strong>Dividing: subtract the indices, even if the answer is negative.</strong> Cancel 6/9 to 2/3.</p>
         ${sum('(b) 6x²y³ / (9x⁵y) = 2x<sup>2 − 5</sup>y<sup>3 − 1</sup> / 3 = 2x⁻³y² / 3')}`,
        `<p><strong>Make the indices positive.</strong> x⁻³ moves to the bottom.</p>
         ${sum('= 2y² / (3x³)')}
         ${ans('2y^2/(3x^3)')}`
      )}
      ${tip('Finish with no negative indices. A letter with a negative index ends up on the bottom of the fraction.')}`,

    // method: Example 6b, 3B (cancel the numbers, subtract indices including negatives)
    // y10-3B Q4: fractions with negative indices
    'y10-3b-fractions': `
      <p class="hp-tag">Worked example: simplify <b>6p⁻³q² / (10p²q⁻³)</b> with positive indices.</p>
      ${steps(
        `<p><strong>Cancel the numbers.</strong> 6/10 = 3/5.</p>`,
        `<p><strong>Subtract the indices for each letter: top minus bottom.</strong> Take care with the double negative.</p>
         ${sum('p: −3 − 2 = −5<br>q: 2 − (−3) = 2 + 3 = 5')}
         ${sum('= 3p⁻⁵q⁵ / 5')}`,
        `<p><strong>Make the indices positive.</strong></p>
         ${sum('= 3q⁵ / (5p⁵)')}
         ${ans('3q^5/(5p^5)')}`
      )}
      ${tip('Subtracting a negative index makes it bigger: 2 − (−3) = 5. Type the answer like 3q^5/(5p^5).')}`,

    // method: Example 7a, 3B (remove brackets first by multiplying indices)
    // y10-3B Q5: brackets with negative indices
    'y10-3b-brackets': `
      <p class="hp-tag">Worked example: write with positive indices (a) <b>(2k⁻³)⁴</b>, (b) <b>(7y⁻²)⁻²</b> and (c) <b>3(a⁻²)⁻³</b>.</p>
      ${steps(
        `<p><strong>Remove the brackets: the outside index multiplies every index inside.</strong></p>
         ${sum('(a) (2k⁻³)⁴ = 2⁴k⁻¹² = 16k⁻¹² = 16/k¹²')}`,
        `<p><strong>A negative outside index goes onto the number too.</strong> 7⁻² = 1/49, and −2 × −2 = 4.</p>
         ${sum('(b) (7y⁻²)⁻² = 7⁻²y⁴ = y⁴/49')}`,
        `<p><strong>A number in front of the brackets is not raised to the power.</strong></p>
         ${sum('(c) 3(a⁻²)⁻³ = 3a⁶')}
         ${ans('16/k^12, y^4/49, 3a^6')}`
      )}
      <p><strong>Something to simplify inside?</strong> Do it first: (x² / (2x⁵))³ = (1 / (2x³))³ = 1/(8x⁹).</p>
      ${tip('Negative times negative is positive: (y⁻²)⁻² = y⁴. Type 16/k^12.')}`,

    // method: Example 7, 3B (brackets first, then multiply or divide, then positive indices)
    // y10-3B Q6: longer expressions
    'y10-3b-complex': `
      <p class="hp-tag">Worked example: simplify <b>(a²b⁻¹)³ × (a⁻¹b²)⁻⁴</b> with positive indices.</p>
      ${steps(
        `<p><strong>Remove the brackets first.</strong> Multiply each index by the outside index.</p>
         ${sum('(a²b⁻¹)³ = a⁶b⁻³<br>(a⁻¹b²)⁻⁴ = a⁴b⁻⁸')}`,
        `<p><strong>Multiply: add the indices for each letter.</strong></p>
         ${sum('a⁶b⁻³ × a⁴b⁻⁸ = a<sup>6 + 4</sup>b<sup>−3 + (−8)</sup> = a¹⁰b⁻¹¹')}`,
        `<p><strong>Make the indices positive.</strong></p>
         ${sum('= a¹⁰/b¹¹')}
         ${ans('a^10/b^11')}`
      )}
      <p><strong>Dividing by a fraction?</strong> Remove the brackets in each part first, then multiply by the second fraction turned upside down, and finish with the index laws.</p>
      ${tip('Work one letter at a time and write down each index sum. Leave the positive-index step to the very end.')}`,

    // method: Key ideas, 3B (a⁻ᵐ = 1/aᵐ, 1/a⁻ᵐ = aᵐ, (a/b)⁻¹ = b/a), as in Building understanding Q4
    // y10-3B Q7, Q8, Q10: evaluating negative powers
    'y10-3b-evaluate': `
      <p class="hp-tag">Worked example: evaluate (a) <b>6⁻²</b>, (b) <b>7 × 2⁻⁴</b>, (c) <b>3 / 10⁻²</b> and (d) <b>(5/2)⁻²</b>.</p>
      ${steps(
        `<p><strong>Write with a positive index, then work it out.</strong></p>
         ${sum('(a) 6⁻² = 1/6² = 1/36<br>(b) 7 × 2⁻⁴ = 7 × 1/16 = 7/16')}`,
        `<p><strong>A negative power on the bottom moves to the top.</strong></p>
         ${sum('(c) 3 / 10⁻² = 3 × 10² = 300')}`,
        `<p><strong>A fraction to a negative power: turn it upside down</strong>, then use the positive power.</p>
         ${sum('(d) (5/2)⁻² = (2/5)² = 4/25')}
         ${ans('1/36, 7/16, 300, 4/25')}`
      )}
      <p><strong>As a decimal:</strong> 2⁻⁹ = 1/512 = 0.001953... ≈ 0.0020 to four decimal places. The power −1 just flips a fraction: (7/9)⁻¹ = 9/7.</p>
      ${tip('Give answers as fractions, like 7/16, unless the question asks for decimals.')}`,

    // method: Key ideas, 3B (a⁻¹ = 1/a and a⁻ᵐ = 1/aᵐ), then add fractions with a common denominator
    // y10-3B Q11: adding and subtracting negative powers
    'y10-3b-combine-fractions': `
      <p class="hp-tag">Worked example: evaluate (a) <b>2⁻¹ + 5⁻¹</b> and (b) <b>(3/4)⁻¹ − 2⁻²</b>.</p>
      ${steps(
        `<p><strong>Write each power as a fraction.</strong></p>
         ${sum('(a) 2⁻¹ = 1/2, 5⁻¹ = 1/5<br>(b) (3/4)⁻¹ = 4/3, 2⁻² = 1/4')}`,
        `<p><strong>Use a common denominator, then add or subtract.</strong></p>
         ${sum('(a) 1/2 + 1/5 = 5/10 + 2/10 = 7/10<br>(b) 4/3 − 1/4 = 16/12 − 3/12 = 13/12')}
         ${ans('7/10 and 13/12')}`
      )}
      ${tip('Anything to the power 0 is 1, so (2/7)⁰ = 1. Type the answer as one fraction, like 13/12.')}`,

    // method: no worked example in 3B; Key ideas (1/aᵐ = a⁻ᵐ) to write both sides as a power of the same number
    // y10-3B Q13: finding x with negative powers
    'y10-3b-find-x': `
      <p class="hp-tag">Worked example: find x when (a) <b>3ˣ = 1/27</b>, (b) <b>(2/5)ˣ = 25/4</b> and (c) <b>2<sup>x + 1</sup> = 1/16</b>.</p>
      ${steps(
        `<p><strong>Write the right side as a power of the same base, using a negative index.</strong></p>
         ${sum('(a) 1/27 = 1/3³ = 3⁻³, so x = −3')}`,
        `<p><strong>An upside-down fraction is the power −1.</strong> 25/4 = (5/2)², and 5/2 = (2/5)⁻¹.</p>
         ${sum('(b) 25/4 = (2/5)⁻², so x = −2')}`,
        `<p><strong>The whole index matches the power.</strong></p>
         ${sum('(c) 1/16 = 2⁻⁴, so x + 1 = −4 and x = −5')}
         ${ans('-3, -2, -5')}`
      )}
      ${tip('If 1/aˣ is on the left, it is a⁻ˣ, so the index you find is −x. A fraction answer like 2/3 is fine when the index has a number in front of x.')}`,

    // =====================================================================
    // Year 10 3C Scientific notation
    // =====================================================================
    // method: Example 8, 3C (move the decimal point right for a positive power, left for a negative one)
    // y10-3C Q1, Q2: scientific notation to a basic numeral
    'y10-3c-numeral': `
      <p class="hp-tag">Worked example: write as basic numerals (a) <b>7.302 × 10⁴</b> and (b) <b>5.9 × 10⁻⁴</b>.</p>
      ${steps(
        `<p><strong>A positive power: move the decimal point that many places to the right.</strong> Fill gaps with zeros.</p>
         ${sum('(a) 7.302 × 10⁴ = 73 020')}`,
        `<p><strong>A negative power: move the decimal point that many places to the left.</strong></p>
         ${sum('(b) 5.9 × 10⁻⁴ = 0.00059')}
         ${ans('73020 and 0.00059')}`
      )}
      <p><strong>A negative number?</strong> The sign stays at the front: −2.6 × 10³ = −2600.</p>
      ${tip('Check the size: 10⁴ makes a number in the tens of thousands, and 10⁻⁴ puts the first digit in the fourth place after the point. Type it without spaces.')}`,

    // method: Example 9, 3C (point after the first non-zero digit, round to the significant figures)
    // y10-3C Q3, Q4, Q5, Q7: writing in scientific notation
    'y10-3c-to-sci': `
      <p class="hp-tag">Worked example: write in scientific notation with three significant figures (a) <b>6 482 913</b> and (b) <b>0.00071958</b>.</p>
      ${steps(
        `<p><strong>Put the point after the first non-zero digit</strong> and count how far it moved.</p>
         ${sum('(a) 6.482913, moved 6 places left, so × 10⁶<br>(b) 7.1958, moved 4 places right, so × 10⁻⁴')}`,
        `<p><strong>Round to the number of significant figures asked for.</strong> Look at the next digit.</p>
         ${sum('(a) 6.48|2913: the next digit is 2, round down: 6.48<br>(b) 7.19|58: the next digit is 5, round up: 7.20')}
         ${ans('6.48 x 10^6 and 7.20 x 10^-4')}`
      )}
      <p><strong>Two significant figures</strong> works the same way: 0.0004361 = 4.4 × 10⁻⁴. Keep a zero that is a significant figure, like the 0 in 7.20.</p>
      ${tip('Type it like 6.48 x 10^6 or 7.20 x 10^-4. Big numbers get a positive power, numbers less than 1 a negative one.')}`,

    // method: Example 10, 3C (enter on a calculator, then write in scientific notation)
    // y10-3C Q6: calculations on a calculator
    'y10-3c-calc': `
      <p class="hp-tag">Worked example: evaluate <b>√(5.3 × 10⁵) ÷ (2.4 × 10⁻³)</b>, in scientific notation with three significant figures.</p>
      ${steps(
        `<p><strong>Enter it on the calculator</strong> using the ×10ˣ, EE or Exp key. Put brackets round each number in scientific notation.</p>
         ${sum('√(5.3 × 10⁵) ÷ (2.4 × 10⁻³) = 303 337.9...')}`,
        `<p><strong>Write the answer in scientific notation and round.</strong></p>
         ${sum('303 337.9... = 3.03 × 10⁵')}
         ${ans('3.03 x 10^5')}`
      )}
      ${tip('The square root must cover the whole number: type √( ... ) with brackets. If your calculator shows 3.033379E5, that means 3.033379 × 10⁵.')}`,

    // method: no worked example in 3C; plainest method: write the rule, rearrange, then use the calculator as in Example 10
    // y10-3C Q8, Q13: problems with a formula
    'y10-3c-problem': `
      <p class="hp-tag">Worked example: a spacecraft travels at <b>4 × 10⁴ km/h</b>. How long does it take to fly <b>3.6 × 10⁵ km</b>? How far does it go in <b>6 × 10³ hours</b>?</p>
      ${steps(
        `<p><strong>Write the rule.</strong> distance = speed × time.</p>`,
        `<p><strong>Finding a time: rearrange first.</strong> time = distance ÷ speed.</p>
         ${sum('time = 3.6 × 10⁵ ÷ (4 × 10⁴) = 9 hours')}`,
        `<p><strong>Finding a distance: substitute and multiply.</strong></p>
         ${sum('distance = 4 × 10⁴ × 6 × 10³ = 2.4 × 10⁸ km')}
         ${ans('9 and 2.4 x 10^8')}`
      )}
      <p><strong>Change the units at the end.</strong> A time in seconds ÷ 60 gives minutes. A formula with a square in it needs brackets round the whole number before you square it.</p>
      ${tip('Keep the full calculator value until the end, then round as the question asks.')}`,

    // method: no worked example in 3C; Key ideas (a × 10ᵐ with 1 ⩽ a < 10), adding indices with the 3A multiplication law
    // y10-3C Q9, Q10: fixing numbers that are not in scientific notation
    'y10-3c-adjust': `
      <p class="hp-tag">Worked example: write in scientific notation (a) <b>520 × 10⁴</b> and (b) <b>0.07 × 10⁻³</b>.</p>
      ${steps(
        `<p><strong>The front number must be from 1 up to (not including) 10.</strong> 520 and 0.07 are not, so write each in scientific notation.</p>
         ${sum('520 = 5.2 × 10²<br>0.07 = 7 × 10⁻²')}`,
        `<p><strong>Multiply the powers of 10: add the indices.</strong></p>
         ${sum('(a) 5.2 × 10² × 10⁴ = 5.2 × 10⁶<br>(b) 7 × 10⁻² × 10⁻³ = 7 × 10⁻⁵')}
         ${ans('5.2 x 10^6 and 7 x 10^-5')}`
      )}
      ${tip('Making the front number smaller makes the power bigger, and the other way round. Check: 520 × 10⁴ = 5 200 000 = 5.2 × 10⁶.')}`,

    // method: no worked example in 3C; index laws from 3A applied to the numbers and the powers of 10 separately
    // y10-3C Q11: index laws with scientific notation
    'y10-3c-index-laws': `
      <p class="hp-tag">Worked example: evaluate without a calculator (a) <b>(3 × 10⁴)²</b>, (b) <b>(6 × 10⁵) × (5 × 10⁻⁹)</b> and (c) <b>(1.2 × 10⁻²) ÷ (4 × 10³)</b>.</p>
      ${steps(
        `<p><strong>Brackets to a power: the power goes on both parts.</strong></p>
         ${sum('(a) (3 × 10⁴)² = 3² × 10⁸ = 9 × 10⁸')}`,
        `<p><strong>Multiply or divide the numbers, and add or subtract the indices.</strong></p>
         ${sum('(b) 30 × 10<sup>5 + (−9)</sup> = 30 × 10⁻⁴<br>(c) 0.3 × 10<sup>−2 − 3</sup> = 0.3 × 10⁻⁵')}`,
        `<p><strong>Fix the front number if it is not between 1 and 10.</strong></p>
         ${sum('(b) 30 × 10⁻⁴ = 3 × 10⁻³<br>(c) 0.3 × 10⁻⁵ = 3 × 10⁻⁶')}
         ${ans('9 x 10^8, 3 x 10^-3, 3 x 10^-6')}`
      )}
      ${tip('A power −1 means one over: (5 × 10²)⁻¹ = 5⁻¹ × 10⁻² = 0.2 × 10⁻² = 2 × 10⁻³.')}`,

    // =====================================================================
    // Year 10 3D Fractional indices
    // =====================================================================
    // method: Example 11, 3D (ⁿ√a = a^(1/n), then multiply indices)
    // y10-3D Q1, Q2: roots in index form
    'y10-3d-index-form': `
      <p class="hp-tag">Worked example: write in index form (a) <b>√23</b>, (b) <b>⁴√(7a³)</b>, (c) <b>6 ⁵√(x⁸)</b> and (d) <b>5√5</b>.</p>
      ${steps(
        `<p><strong>An n-th root is the power 1/n.</strong></p>
         ${sum(`(a) √23 = 23${fr(1, 2)}`)}`,
        `<p><strong>Root of a product: the power 1/n goes on every factor.</strong> Multiply the indices.</p>
         ${sum(`(b) ⁴√(7a³) = (7a³)${fr(1, 4)} = 7${fr(1, 4)}a${fr(3, 4)}<br>(c) 6 ⁵√(x⁸) = 6(x⁸)${fr(1, 5)} = 6x${fr(8, 5)}`)}`,
        `<p><strong>Same base outside and inside: add the indices.</strong> 5 = 5¹ and 1 + 1/2 = 3/2.</p>
         ${sum(`(d) 5√5 = 5¹ × 5${fr(1, 2)} = 5${fr(3, 2)}`)}
         ${ans('5^(3/2)')}`
      )}
      ${tip('Type the index in brackets: 23^(1/2), 7^(1/4)a^(3/4), 6x^(8/5). The number in front of a root is not inside it.')}`,

    // method: Example 12, 3D (a^(m/n) = ⁿ√(aᵐ))
    // y10-3D Q3: fractional indices in surd form
    'y10-3d-surd-form': `
      <p class="hp-tag">Worked example: write in surd form (a) <b>7${fr(1, 4)}</b> and (b) <b>3${fr(2, 5)}</b>.</p>
      ${steps(
        `<p><strong>The bottom of the fraction is the root.</strong></p>
         ${sum(`(a) 7${fr(1, 4)} = ⁴√7`)}`,
        `<p><strong>The top of the fraction is the power.</strong> Write 2/5 as 2 × 1/5.</p>
         ${sum(`(b) 3${fr(2, 5)} = (3²)${fr(1, 5)} = ⁵√(3²) = ⁵√9`)}
         ${ans('⁴√7 and ⁵√3²')}`
      )}
      ${chips(['bottom: which root'], ['top: which power'])}
      ${tip('⁵√3² and (⁵√3)² are the same number, so either way of writing it is right.')}`,

    // method: Example 13, 3D (positive index first, root first, then the power)
    // y10-3D Q4, Q5, Q8, Q9: evaluating fractional powers
    'y10-3d-evaluate': `
      <p class="hp-tag">Worked example: evaluate without a calculator (a) <b>144${fr(1, 2)}</b>, (b) <b>512${fr('−1', 3)}</b> and (c) <b>1000${fr(2, 3)}</b>.</p>
      ${steps(
        `<p><strong>The power 1/2 is a square root.</strong></p>
         ${sum(`(a) 144${fr(1, 2)} = √144 = 12`)}`,
        `<p><strong>A negative power: write it as one over first.</strong> 8³ = 512, so ∛512 = 8.</p>
         ${sum(`(b) 512${fr('−1', 3)} = 1 / 512${fr(1, 3)} = 1 / ∛512 = 1/8`)}`,
        `<p><strong>Take the root first, then the power.</strong> The numbers stay small.</p>
         ${sum(`(c) 1000${fr(2, 3)} = (∛1000)² = 10² = 100`)}
         ${ans('12, 1/8, 100')}`
      )}
      <p><strong>A fraction inside?</strong> Do the top and the bottom separately. <strong>Not a surd:</strong> a root that works out exactly, like ∛512 = 8, is a whole number, so it is not a surd.</p>
      ${tip('Root first, then power, is the easy way without a calculator. Give non-whole answers as fractions, like 1/8.')}`,

    // method: Example 11b, c, 3D (write the root as a fractional power, then use the index laws)
    // y10-3D Q6, Q7: index laws with fractional indices
    'y10-3d-laws': `
      <p class="hp-tag">Worked example: simplify (a) <b>p${fr(3, 4)} × p${fr(7, 4)}</b>, (b) <b>(k${fr(4, 3)})${fr(3, 8)}</b>, (c) <b>√(64y¹⁰)</b> and (d) <b>(1000a⁹b³)${fr(1, 3)}</b>.</p>
      ${steps(
        `<p><strong>The index laws work with fractions too.</strong> Add for multiplying, multiply for a power of a power.</p>
         ${sum(`(a) p${fr(3, 4)} × p${fr(7, 4)} = p${fr(10, 4)} = p${fr(5, 2)}<br>(b) (k${fr(4, 3)})${fr(3, 8)} = k${fr(12, 24)} = k${fr(1, 2)}`)}`,
        `<p><strong>A root: rewrite it as a power, then the power goes on every factor.</strong></p>
         ${sum(`(c) √(64y¹⁰) = (64y¹⁰)${fr(1, 2)} = 8y⁵`)}`,
        `<p><strong>Root the number, multiply each index.</strong></p>
         ${sum(`(d) 1000${fr(1, 3)}a<sup>9 × 1/3</sup>b<sup>3 × 1/3</sup> = 10a³b`)}
         ${ans('p^(5/2), k^(1/2), 8y^5, 10a^3b')}`
      )}
      ${tip('Simplify the fraction in the index: p^(10/4) is p^(5/2). Type fractional powers in brackets. Anything to the power 0 is 1.')}`,

    // method: no worked example in the book; the question's own fact (−3)³ = −27, so ∛(−27) = −3
    // y10-3D Q10: roots of negative numbers
    'y10-3d-negative-roots': `
      <p class="hp-tag">Worked example: evaluate <b>∛(−64)</b>, and decide if <b>⁴√(−16)</b> is a real number.</p>
      ${steps(
        `<p><strong>Find a number that gives −64 when cubed.</strong> A negative number cubed is negative.</p>
         ${sum('(−4)³ = −4 × −4 × −4 = −64, so ∛(−64) = −4')}`,
        `<p><strong>An even power is never negative.</strong> 2⁴ = 16 and (−2)⁴ = 16, so nothing gives −16.</p>
         ${ans('-4; not a real number')}`
      )}
      ${chips(['odd root of a negative: real', 'add'], ['even root of a negative: not real', 'take'])}
      ${tip('Check the root number: 3, 5, 7 (odd) are fine with negatives; 2, 4, 6 (even) are not.')}`,

    // =====================================================================
    // Year 10 3E Exponential equations
    // =====================================================================
    // method: Example 14a, b, 3E (write both sides with the same base, then equate powers)
    // y10-3E Q1, Q2, Q7: solving with the same base
    'y10-3e-same-base': `
      <p class="hp-tag">Worked example: solve (a) <b>4ˣ = 64</b>, (b) <b>2ˣ = 1/32</b> and (c) <b>3⁻ˣ = 1/27</b>.</p>
      ${steps(
        `<p><strong>Write the right side as a power of the same base.</strong> Then the powers must be equal.</p>
         ${sum('(a) 4ˣ = 4³, so x = 3')}`,
        `<p><strong>A fraction: write it with a negative index.</strong></p>
         ${sum('(b) 2ˣ = 1/2⁵ = 2⁻⁵, so x = −5')}`,
        `<p><strong>Equate powers, then solve for x.</strong></p>
         ${sum('(c) 3⁻ˣ = 3⁻³, so −x = −3 and x = 3')}
         ${ans('3, -5, 3')}`
      )}
      <p><strong>Base 1 never works:</strong> 1 to any power is 1, so 1ˣ = 5 has no solution.</p>
      ${tip('Learn the first few powers of 2, 3, 5 and 10 so you can spot them quickly. If aˣ = aʸ then x = y.')}`,

    // method: Example 14c, 3E (rewrite both numbers as powers of a smaller base, multiply indices, equate powers)
    // y10-3E Q3: different bases with a common base
    'y10-3e-power-base': `
      <p class="hp-tag">Worked example: solve (a) <b>32ˣ = 16</b> and (b) <b>4⁻ˣ = 32</b>.</p>
      ${steps(
        `<p><strong>Find a base that both numbers are powers of.</strong> Here it is 2: 32 = 2⁵, 16 = 2⁴, 4 = 2².</p>`,
        `<p><strong>Rewrite, remove the brackets by multiplying indices, then equate powers.</strong></p>
         ${sum('(a) (2⁵)ˣ = 2⁴, so 2<sup>5x</sup> = 2⁴<br>5x = 4, so x = 4/5')}`,
        `<p><strong>The same with a negative index.</strong></p>
         ${sum('(b) (2²)⁻ˣ = 2⁵, so 2<sup>−2x</sup> = 2⁵<br>−2x = 5, so x = −5/2')}
         ${ans('4/5 and -5/2')}`
      )}
      ${tip('The answer is often a fraction. Type it like 4/5 or -5/2.')}`,

    // method: Example 15, 3E (rewrite as the same base, remove brackets, equate powers, solve the linear equation)
    // y10-3E Q5: x on both sides
    'y10-3e-both-sides': `
      <p class="hp-tag">Worked example: solve (a) <b>2<sup>x + 4</sup> = 8ˣ</b> and (b) <b>9<sup>x + 1</sup> = 27<sup>x − 1</sup></b>.</p>
      ${steps(
        `<p><strong>Rewrite each base as a power of the same number.</strong> 8 = 2³; 9 = 3² and 27 = 3³.</p>
         ${sum('(a) 2<sup>x + 4</sup> = (2³)ˣ = 2<sup>3x</sup><br>(b) (3²)<sup>x + 1</sup> = (3³)<sup>x − 1</sup>')}`,
        `<p><strong>Remove the brackets: multiply the whole index.</strong></p>
         ${sum('(b) 3<sup>2x + 2</sup> = 3<sup>3x − 3</sup>')}`,
        `<p><strong>Equate the powers and solve.</strong></p>
         ${sum('(a) x + 4 = 3x, so 4 = 2x and x = 2<br>(b) 2x + 2 = 3x − 3, so x = 5')}
         ${ans('2 and 5')}`
      )}
      ${tip('Put brackets round the whole index when you multiply: 2(x + 1) = 2x + 2, not 2x + 1.')}`,

    // method: Example 15, 3E (same base, index laws to combine, equate powers)
    // y10-3E Q11: products and quotients of powers
    'y10-3e-combine': `
      <p class="hp-tag">Worked example: solve (a) <b>3ⁿ × 27ⁿ = 81</b> and (b) <b>4<sup>n + 1</sup> / 2ⁿ = 32</b>.</p>
      ${steps(
        `<p><strong>Write every number as a power of the same base.</strong></p>
         ${sum('(a) 3ⁿ × 3<sup>3n</sup> = 3⁴<br>(b) 2<sup>2n + 2</sup> / 2ⁿ = 2⁵')}`,
        `<p><strong>Use the index laws: add for ×, subtract for ÷.</strong></p>
         ${sum('(a) 3<sup>4n</sup> = 3⁴<br>(b) 2<sup>n + 2</sup> = 2⁵')}`,
        `<p><strong>Equate the powers.</strong></p>
         ${sum('(a) 4n = 4, so n = 1<br>(b) n + 2 = 5, so n = 3')}
         ${ans('1 and 3')}`
      )}
      <p><strong>Equal to 1?</strong> 1 = a⁰, so the index must be 0: 5<sup>3n − 6</sup> = 1 gives 3n − 6 = 0, so n = 2.</p>
      ${tip('A fraction on the right like 1/25 is 5⁻²: use a negative index.')}`,

    // method: Example 14c, 3E, with roots written as fractional powers (3D)
    // y10-3E Q8: equations with roots
    'y10-3e-roots': `
      <p class="hp-tag">Worked example: solve (a) <b>7ˣ = ⁵√49</b> and (b) <b>4ˣ = 1/√2</b>.</p>
      ${steps(
        `<p><strong>Write the root as a fractional power.</strong></p>
         ${sum(`(a) ⁵√49 = (7²)${fr(1, 5)} = 7${fr(2, 5)}, so x = 2/5`)}`,
        `<p><strong>One over a root is a negative fractional power.</strong> Then make the bases the same.</p>
         ${sum(`(b) 1/√2 = 2${fr('−1', 2)}<br>4ˣ = 2<sup>2x</sup>, so 2x = −1/2 and x = −1/4`)}
         ${ans('2/5 and -1/4')}`
      )}
      ${tip('√ is the power 1/2, ∛ is 1/3, ⁵√ is 1/5. Type fraction answers like -1/4.')}`,

    // method: Example 14b, 3E (write the decimal as a fraction, then as a negative power)
    // y10-3E Q9, Q10: decimals and powers
    'y10-3e-decimals': `
      <p class="hp-tag">Worked example: (a) write <b>2⁻⁶</b> as a decimal, (b) write <b>0.00032</b> as a power of a prime, then (c) solve <b>5ˣ = 0.00032</b>.</p>
      ${steps(
        `<p><strong>Power to decimal:</strong> make the index positive, then divide.</p>
         ${sum('(a) 2⁻⁶ = 1/2⁶ = 1/64 = 0.015625')}`,
        `<p><strong>Decimal to power:</strong> write it as a fraction and simplify.</p>
         ${sum('(b) 0.00032 = 32/100 000 = 1/3125 = 1/5⁵ = 5⁻⁵')}`,
        `<p><strong>Now the equation has the same base on both sides.</strong></p>
         ${sum('(c) 5ˣ = 5⁻⁵, so x = −5')}
         ${ans('0.015625, 5^-5, -5')}`
      )}
      ${tip('Type a negative power like 5^-5. A decimal base like 0.5 is 1/2 = 2⁻¹.')}`,

    // method: substitute into the rule (Key ideas, 3E), then solve with the same base as in Example 14a
    // y10-3E Q4, Q6: exponential rules in a story
    'y10-3e-model': `
      <p class="hp-tag">Worked example: a colony of cells follows <b>N = 4ᵗ</b>, with t in hours. Find N at the start and after 2 hours, then when N = 1024, and when N first passes 2000.</p>
      ${steps(
        `<p><strong>Substitute the time.</strong> The start is t = 0.</p>
         ${sum('t = 0: N = 4⁰ = 1<br>t = 2: N = 4² = 16')}`,
        `<p><strong>For a time, solve the equation.</strong></p>
         ${sum('4ᵗ = 1024 = 4⁵, so t = 5 hours')}`,
        `<p><strong>"First passes": try whole numbers.</strong></p>
         ${sum('4⁵ = 1024 (too small), 4⁶ = 4096 (bigger than 2000)')}
         ${ans('1, 16, 5, 6')}`
      )}
      <p><strong>Doubling over and over:</strong> 5 cents doubled 20 times is 5 × 2²⁰ = 5 242 880 cents = $52 428.80.</p>
      ${tip('Doubled n times means multiply by 2ⁿ. Watch the units: cents ÷ 100 gives dollars.')}`,

    // =====================================================================
    // Year 10 3F Exponential relations and their graphs
    // =====================================================================
    // method: Example 16, 3F (y-intercept (0, 1), substitute x = 1 for a second point)
    // y10-3F Q1, Q10, Q11, Q12: key points on y = aˣ
    'y10-3f-points': `
      <p class="hp-tag">Worked example: for <b>y = 2ˣ</b> and <b>y = 8ˣ</b>, find the y-intercept and the point where x = 1.</p>
      ${curves([x => Math.pow(2, x), x => Math.pow(8, x)], [-2.2, 1.2], [0, 9.2], [[0, 1, '(0, 1)', 'nw'], [1, 2, '(1, 2)', 'e'], [1, 8, '(1, 8)', 'e']], [[0.75, 8.6, 'y = 8ˣ', 'end'], [-2.1, 1.3, 'y = 2ˣ', 'start']], 'Graphs of y = 2 to the x and y = 8 to the x, both through (0, 1); y = 8 to the x is steeper and passes through (1, 8)', { sx: 2.2, sy: 0.5, unit: 30 })}
      ${steps(
        `<p><strong>The y-intercept: put x = 0.</strong> a⁰ = 1, so every graph y = aˣ cuts the y-axis at (0, 1).</p>`,
        `<p><strong>A second point: put x = 1.</strong> a¹ = a.</p>
         ${sum('y = 2¹ = 2, so (1, 2)<br>y = 8¹ = 8, so (1, 8)')}
         ${ans('(0, 1), (1, 2), (1, 8)')}`
      )}
      <p><strong>Is a point on the curve?</strong> Substitute its x: on y = 2ˣ, x = 3 gives y = 8, so (3, 6) is not on it. <strong>Asymptote:</strong> the curve gets closer and closer to the x-axis (y = 0) but never touches it, because aˣ is always positive. If a = 1, y = 1ˣ = 1 is a flat line.</p>
      ${tip('Type a point like (1, 8). The bigger the base, the steeper the graph to the right of the y-axis.')}`,

    // method: Example 17, 3F (y = −aˣ reflects in the x-axis, y = a⁻ˣ reflects in the y-axis)
    // y10-3F Q2, Q3, Q4: reflections
    'y10-3f-reflect': `
      <p class="hp-tag">Worked example: compare <b>y = 7ˣ</b>, <b>y = −7ˣ</b> and <b>y = 7⁻ˣ</b>.</p>
      ${curves([x => Math.pow(7, x), x => -Math.pow(7, x), x => Math.pow(7, -x)], [-1.25, 1.25], [-8, 8], [[0, 1, '', 'ne'], [0, -1, '', 'se'], [1, 7, '(1, 7)', 'e'], [1, -7, '(1, −7)', 'e'], [-1, 7, '(−1, 7)', 'w']], [[0.95, 3.5, 'y = 7ˣ', 'start'], [0.95, -3.5, 'y = −7ˣ', 'start'], [-0.95, 3.5, 'y = 7⁻ˣ', 'end']], 'Three graphs: y = 7 to the x rising through (1, 7); y = minus 7 to the x below the x-axis through (1, minus 7); y = 7 to the minus x falling through (minus 1, 7)', { sx: 2.8, sy: 0.45, unit: 30 })}
      ${steps(
        `<p><strong>y = −7ˣ means −1 × 7ˣ.</strong> Every y-value changes sign: a reflection in the x-axis.</p>
         ${sum('x = 1: y = −7¹ = −7, so (1, −7)<br>x = 0: y = −1, so (0, −1)')}`,
        `<p><strong>y = 7⁻ˣ swaps the sides of the y-axis:</strong> a reflection in the y-axis.</p>
         ${sum('x = 1: y = 7⁻¹ = 1/7, so (1, 1/7)<br>x = −1: y = 7¹ = 7')}
         ${ans('(1, -7) and (1, 1/7)')}`
      )}
      ${tip('In −7ˣ only the 7 is raised to the power; the minus comes after. Type a fraction point like (1, 1/7).')}`,

    // method: Example 18, 3F (read the intersection, or write the number as a power of the base)
    // y10-3F Q5: where a curve meets a horizontal line
    'y10-3f-intersect': `
      <p class="hp-tag">Worked example: find where <b>y = 4ˣ</b> meets <b>y = 64</b>.</p>
      ${curves([x => Math.pow(4, x)], [-1.5, 3.1], [0, 72], [[3, 64, '(3, 64)', 'e']], [[0.4, 69, 'y = 64', 'start']], 'The curve y = 4 to the x crossing the horizontal line y = 64 at (3, 64)', { sx: 1.5, sy: 0.07, line: 64, unit: 30 })}
      ${steps(
        `<p><strong>At the meeting point both rules give the same y.</strong></p>
         ${sum('4ˣ = 64')}`,
        `<p><strong>Write 64 as a power of 4.</strong></p>
         ${sum('4ˣ = 4³, so x = 3')}`,
        `<p><strong>Write the point.</strong> The y-value is the line's value.</p>
         ${ans('(3, 64)')}`
      )}
      <p><strong>Other kinds:</strong> y = −4ˣ and y = −16 give 4ˣ = 16, so (2, −16). y = 2⁻ˣ and y = 8 give 2⁻ˣ = 2³, so −x = 3 and the point is (−3, 8).</p>
      ${tip('Type the point with the x first: (3, 64).')}`,

    // method: substitute into the rule and solve with a common base, as in Example 18, 3F
    // y10-3F Q6, Q7: exponential models
    'y10-3f-model': `
      <p class="hp-tag">Worked example: a club has <b>P = 2ᵗ</b> hundred members after t years. Find the members at the start and after 4 years, and when it reaches 6400.</p>
      ${steps(
        `<p><strong>Substitute the time, then use the units.</strong> P is in hundreds.</p>
         ${sum('t = 0: P = 2⁰ = 1, so 100 members<br>t = 4: P = 2⁴ = 16, so 1600 members')}`,
        `<p><strong>For a time, change the number into the rule's units and solve.</strong> 6400 is P = 64.</p>
         ${sum('2ᵗ = 64 = 2⁶, so t = 6 years')}
         ${ans('100, 1600, 6')}`
      )}
      <p><strong>Making a rule:</strong> one cell that splits into 4 every hour gives N = 4ᵗ. It first passes 10 000 after 7 hours, since 4⁶ = 4096 and 4⁷ = 16 384.</p>
      ${tip('Read what P stands for. "In hundreds" means multiply by 100; "in thousands" means multiply by 1000.')}`,

    // method: trial and error table, as in the 3E Lesson starter (no worked example for this in 3F)
    // y10-3F Q8: trial and error
    'y10-3f-trial': `
      <p class="hp-tag">Worked example: use trial and error to solve <b>5ˣ = 40</b>, to three decimal places.</p>
      ${steps(
        `<p><strong>Start between two whole numbers.</strong> 5² = 25 and 5³ = 125, so x is between 2 and 3.</p>`,
        `<p><strong>Try values, getting closer each time.</strong></p>
         <div class="hp-table">
           <div class="hp-tr"><span class="hp-th">x</span><span class="hp-th">5ˣ</span><span class="hp-th">result</span></div>
           <div class="hp-tr"><span>2.3</span><span>40.52</span><span>too big</span></div>
           <div class="hp-tr"><span>2.29</span><span>39.87</span><span>too small</span></div>
           <div class="hp-tr"><span>2.292</span><span>39.998</span><span>too small</span></div>
           <div class="hp-tr"><span>2.293</span><span>40.063</span><span>too big</span></div>
           <div class="hp-tr"><span>2.2925</span><span>40.030</span><span>too big</span></div>
         </div>`,
        `<p><strong>Round.</strong> x is between 2.292 and 2.2925, so to three decimal places it is 2.292.</p>
         ${ans('2.292')}`
      )}
      ${tip('To decide the last digit, test the halfway value (here 2.2925). Use the xʸ or ^ key on the calculator.')}`,

    // method: Key ideas and Example 17, 3F (y-intercept, which side of the x-axis, rising or falling)
    // y10-3F Q9: matching rules to graphs
    'y10-3f-match': `
      <p class="hp-tag">Worked example: describe the graphs of <b>y = 2ˣ</b>, <b>y = −2⁻ˣ</b> and <b>y = −x + 1</b> so you can spot them.</p>
      ${steps(
        `<p><strong>Straight line or curve?</strong> No power of x means a straight line: y = −x + 1 is a line with gradient −1 through (0, 1).</p>`,
        `<p><strong>Above or below the x-axis?</strong> A minus sign in front puts the curve below the x-axis, through (0, −1).</p>`,
        `<p><strong>Rising or falling?</strong> y = 2ˣ rises to the right. A −x in the index reflects it in the y-axis, so y = 2⁻ˣ falls; y = −2⁻ˣ is that, flipped below the axis.</p>
         ${ans('line; curve below the axis; rising curve through (0, 1)')}`
      )}
      ${chips(['y = aˣ: above, rising'], ['y = a⁻ˣ: above, falling'], ['y = −aˣ: below'], ['y = −a⁻ˣ: below, mirror image'])}
      ${tip('Check one point to be sure. Put x = 1 into the rule and see which graph goes through that point.')}`,

    // method: Key ideas, 3B and 3F (a⁻ˣ = (a⁻¹)ˣ = (1/a)ˣ)
    // y10-3F Q13: a⁻ˣ and (1/a)ˣ
    'y10-3f-reciprocal': `
      <p class="hp-tag">Worked example: write <b>y = 7⁻ˣ</b> as y = aˣ with 0 &lt; a &lt; 1, and <b>y = (1/4)ˣ</b> as y = a⁻ˣ with a &gt; 1.</p>
      ${steps(
        `<p><strong>Split the index: −x = −1 × x.</strong> Then 7⁻¹ = 1/7.</p>
         ${sum('7⁻ˣ = (7⁻¹)ˣ = (1/7)ˣ, so a = 1/7')}`,
        `<p><strong>Go the other way.</strong> 1/4 = 4⁻¹.</p>
         ${sum('(1/4)ˣ = (4⁻¹)ˣ = 4⁻ˣ, so a = 4')}
         ${ans('1/7 and 4')}`
      )}
      ${tip('So y = 7⁻ˣ and y = (1/7)ˣ are the same graph. Type a fraction like 1/7.')}`,

    // =====================================================================
    // Year 10 3G Exponential growth and decay
    // =====================================================================
    // method: Example 19, 3G (define the variables, A = A₀(1 ± r/100)ⁿ)
    // y10-3G Q1, Q2: writing exponential rules
    'y10-3g-rule': `
      <p class="hp-tag">Worked example: write rules for (a) a sculpture worth <b>$25 000</b> growing by <b>7%</b> per year, (b) a fish population of <b>1200</b> falling by <b>15%</b> per year and (c) mould covering <b>5 cm²</b> that doubles every hour.</p>
      ${steps(
        `<p><strong>Define the variables.</strong> V = value in dollars, P = population, A = area in cm², after n years or t hours.</p>`,
        `<p><strong>Use A = A₀(1 ± r/100)ⁿ.</strong> Plus for growth, minus for decay.</p>
         ${sum('(a) V = 25 000(1 + 7/100)ⁿ = 25 000 × 1.07ⁿ<br>(b) P = 1200(1 − 15/100)ⁿ = 1200 × 0.85ⁿ')}`,
        `<p><strong>Doubling means multiply by 2 each time.</strong></p>
         ${sum('(c) A = 5 × 2ᵗ')}
         ${ans('V = 25000 × 1.07^n')}`
      )}
      ${tip('Type the rule as an equation, like V = 25000*1.07^n or P = 1200*0.85^n. Use the letters the question gives you.')}`,

    // method: Example 20, 3G (rule, substitute, trial and error to one decimal place)
    // y10-3G Q3, Q4, Q5, Q6, Q7, Q8, Q9: using a growth or decay rule
    'y10-3g-apply': `
      <p class="hp-tag">Worked example: a coin collection worth <b>$18 000</b> grows by <b>5%</b> per year. Find a rule, its value next year and in 4 years, and when it is worth $25 000.</p>
      ${steps(
        `<p><strong>Rule:</strong> V = 18 000 × 1.05ⁿ.</p>
         <p><strong>Substitute n.</strong></p>
         ${sum('n = 1: V = 18 000 × 1.05 = $18 900<br>n = 4: V = 18 000 × 1.05⁴ = $21 879.11')}`,
        `<p><strong>Trial and error for a time.</strong> Too low: make n bigger. Too high: make n smaller.</p>
         <div class="hp-table">
           <div class="hp-tr"><span class="hp-th">n</span><span>6</span><span>7</span><span>6.7</span><span>6.8</span><span>6.75</span></div>
           <div class="hp-tr"><span class="hp-th">V</span><span>24 122</span><span>25 328</span><span>24 960</span><span>25 082</span><span>25 021</span></div>
         </div>`,
        `<p><strong>Round.</strong> $25 000 is passed between 6.7 and 6.75, so to one decimal place it is 6.7 years.</p>
         ${ans('6.7')}`
      )}
      <p><strong>Decay works the same way</strong> with a base below 1, like 0.95 for 5% less each time. <strong>Change the time unit first:</strong> 45 seconds is 0.75 minutes and 3 days is 72 hours.</p>
      ${tip('Money is rounded to the cent (two decimal places). Keep the calculator value until the final answer.')}`,

    // method: Example 20, 3G (substitute, then trial and error for the time to reach half)
    // y10-3G Q12, Q13, Q14: half-life
    'y10-3g-halflife': `
      <p class="hp-tag">Worked example: <b>60 g</b> of a substance decays by <b>5%</b> per year. Find the mass after 10 years and the half-life.</p>
      ${steps(
        `<p><strong>Rule and substitute.</strong></p>
         ${sum('M = 60 × 0.95ᵗ<br>t = 10: M = 60 × 0.95¹⁰ = 35.92... ≈ 35.9 g')}`,
        `<p><strong>Half-life: when is the mass half of 60, so 30 g?</strong> Trial and error.</p>
         ${sum('t = 13: 30.80 (too big)<br>t = 14: 29.26 (too small)<br>t = 13.5: 30.02 (too big)<br>t = 13.6: 29.87 (too small)')}`,
        `<p><strong>Round.</strong> The half-life is about 13.5 years.</p>
         ${ans('35.9 and 13.5')}`
      )}
      <p><strong>A rate "every 10 years"?</strong> Then n counts 10-year blocks: after 50 years, n = 5. <strong>From a half-life to a rate:</strong> a half-life of 50 years means a⁵⁰ = 0.5, so a = 0.5${fr(1, 50)} = 0.98623..., a decay of 1 − 0.98623 = 0.01377, about 1.4% per year.</p>
      ${tip('The half-life does not depend on the starting amount: start with anything, and look for half of it.')}`,

    // method: the method given in the question (r/12 per month, 12 times as many periods); no worked example in 3G
    // y10-3G Q10, Q11: growth added monthly or weekly
    'y10-3g-monthly': `
      <p class="hp-tag">Worked example: <b>$5000</b> grows by <b>9%</b> p.a. for 3 years. Find the value if the increase is added annually and if it is added monthly.</p>
      ${steps(
        `<p><strong>Annually:</strong> 3 lots of 9%.</p>
         ${sum('A = 5000 × 1.09³ = 6475.145 ≈ $6475.15')}`,
        `<p><strong>Monthly:</strong> divide the rate by 12 and multiply the time by 12.</p>
         ${sum('9% ÷ 12 = 0.75% per month, 3 × 12 = 36 months<br>A = 5000(1 + 9/1200)³⁶ = 5000 × 1.0075³⁶ = $6543.23')}
         ${ans('6475.15 and 6543.23')}`,
        `<p><strong>Weekly:</strong> divide by 52 and use 52 times as many periods: A = 5000(1 + 9/5200)¹⁵⁶ = $6548.29.</p>`
      )}
      ${tip('Adding the increase more often gives a little more, because each increase also grows. Round to the cent at the end.')}`,

    // =====================================================================
    // Year 10 3H Compound interest
    // =====================================================================
    // method: Example 21, 3H (list P, n, r, substitute into A = P(1 + r/100)ⁿ)
    // y10-3H Q1, Q2: compounding annually
    'y10-3h-annual': `
      <p class="hp-tag">Worked example: find the amount after <b>4 years</b> if <b>$4500</b> is compounded annually at <b>3%</b>.</p>
      ${steps(
        `<p><strong>List the values.</strong></p>
         ${sum('P = 4500, n = 4, r = 3')}`,
        `<p><strong>Write the formula and substitute.</strong></p>
         ${sum('A = P(1 + r/100)ⁿ<br>= 4500(1 + 3/100)⁴ = 4500(1.03)⁴')}`,
        `<p><strong>Evaluate and round to the cent.</strong></p>
         ${sum('= 5064.789... ≈ $5064.79')}
         ${ans('5064.79')}`
      )}
      <p><strong>Check after 1 year:</strong> 4500 × 1.03 = $4635, which is $4500 plus 3% of $4500.</p>
      ${tip('Type just the number, to two decimal places, like 5064.79. A rate like 6.5% gives 1.065.')}`,

    // method: Example 22, 3H (n = years × periods per year, r = annual rate ÷ periods per year)
    // y10-3H Q3: periods and rate per period
    'y10-3h-periods': `
      <p class="hp-tag">Worked example: find n and r for (a) <b>6.4% p.a. over 5 years, paid quarterly</b>, (b) <b>3.9% p.a. over 2 years, paid fortnightly</b> and (c) <b>7% p.a. over 3 years, paid bi-annually</b>.</p>
      ${steps(
        `<p><strong>Number of periods: years × periods in one year.</strong></p>
         ${sum('(a) n = 5 × 4 = 20<br>(b) n = 2 × 26 = 52<br>(c) n = 3 × 2 = 6')}`,
        `<p><strong>Rate per period: the yearly rate ÷ periods in one year.</strong></p>
         ${sum('(a) r = 6.4 ÷ 4 = 1.6<br>(b) r = 3.9 ÷ 26 = 0.15<br>(c) r = 7 ÷ 2 = 3.5')}
         ${ans('20, 1.6')}`
      )}
      ${chips(['monthly: 12'], ['fortnightly: 26'], ['quarterly: 4'], ['bi-annually: 2'], ['weekly: 52'])}
      ${tip('Give n then r, separated by a comma, like 20, 1.6. Round r to three decimal places when it does not stop.')}`,

    // method: Example 23, 3H (n = months, r = rate ÷ 12, then A = P(1 + r/100)ⁿ)
    // y10-3H Q4, Q5, Q6: compounding monthly
    'y10-3h-monthly': `
      <p class="hp-tag">Worked example: <b>$2500</b> is invested at <b>7.2% p.a.</b>, compounded monthly, for <b>3 years</b>. Find the amount.</p>
      ${steps(
        `<p><strong>List the values, in months.</strong></p>
         ${sum('P = 2500<br>n = 3 × 12 = 36<br>r = 7.2 ÷ 12 = 0.6')}`,
        `<p><strong>Write the formula and substitute.</strong> 0.6 ÷ 100 = 0.006.</p>
         ${sum('A = 2500(1 + 0.006)³⁶ = 2500(1.006)³⁶')}`,
        `<p><strong>Evaluate and round to the cent.</strong></p>
         ${sum('= 3100.754... ≈ $3100.75')}
         ${ans('3100.75')}`
      )}
      <p><strong>Part years or months:</strong> 1¾ years = 21 months, so n = 21. After 5 months, n = 5.</p>
      ${tip('Divide the rate by 12 and multiply the years by 12. If unsure, type the whole thing: 2500 × (1 + 0.6/100)^36.')}`,

    // method: Example 23, 3H with Key ideas (interest = A − P), then compare
    // y10-3H Q7, Q9: interest and comparing options
    'y10-3h-interest': `
      <p class="hp-tag">Worked example: <b>$4000</b> is invested at <b>6%</b> for <b>3 years</b>. Find the interest if it is compounded annually, and if it is compounded monthly. Which is better?</p>
      ${steps(
        `<p><strong>Annually:</strong> n = 3, r = 6.</p>
         ${sum('A = 4000(1.06)³ = $4764.06<br>interest = 4764.06 − 4000 = $764.06')}`,
        `<p><strong>Monthly:</strong> n = 36, r = 0.5.</p>
         ${sum('A = 4000(1.005)³⁶ = $4786.72<br>interest = 4786.72 − 4000 = $786.72')}`,
        `<p><strong>Compare.</strong> Monthly gives $22.66 more interest.</p>
         ${ans('764.06 and 786.72')}`
      )}
      <p><strong>Weekly or daily:</strong> divide the rate by 52 or 365, and multiply the years by 52 or 365. <strong>Different rates?</strong> Work out the final amount for each option and pick the bigger one.</p>
      ${tip('Interest is the amount minus the principal. Round each amount to the cent first if the question says to use rounded answers.')}`,

    // method: Key ideas, 3H (A = P(1 + r/100)ⁿ read backwards), with the period counts from Example 22
    // y10-3H Q8: reading a compound interest expression
    'y10-3h-read': `
      <p class="hp-tag">Worked example: <b>3200(1.015)²⁴</b>, compounded quarterly. Find P, n, r, the annual rate R and the time t in years.</p>
      ${steps(
        `<p><strong>Match it with P(1 + r/100)ⁿ.</strong></p>
         ${sum('P = 3200, n = 24<br>1.015 = 1 + 1.5/100, so r = 1.5')}`,
        `<p><strong>Quarterly means 4 periods a year.</strong></p>
         ${sum('R = 1.5 × 4 = 6<br>t = 24 ÷ 4 = 6')}
         ${ans('3200, 24, 1.5, 6, 6')}`
      )}
      ${tip('Give them in the order asked, separated by commas. Monthly is 12 a year, fortnightly 26, daily 365.')}`,

    // method: Example 21, 3H (substitute), with trial and error as in Example 20c, 3G
    // y10-3H Q10: how long to double
    'y10-3h-double': `
      <p class="hp-tag">Worked example: <b>$60 000</b> is compounded annually at <b>8%</b>. After how many whole years has it at least doubled?</p>
      ${steps(
        `<p><strong>Doubled means reaching $120 000.</strong></p>
         ${sum('A = 60 000(1.08)ⁿ')}`,
        `<p><strong>Try whole numbers of years.</strong></p>
         ${sum('n = 8: $111 055.81<br>n = 9: $119 940.28 (just short)<br>n = 10: $129 535.50')}
         ${ans('10')}`
      )}
      <p><strong>Does the starting amount matter?</strong> No: doubling means 1.08ⁿ ⩾ 2, and that does not depend on P.</p>
      ${tip('"At least doubled" means the first year it is equal to or over double. Read just short values carefully.')}`,

    // =====================================================================
    // Year 10 3I Introducing logarithms
    // =====================================================================
    // method: Example 24, 3I (logₐ y = x is the same as aˣ = y)
    // y10-3I Q1, Q2: index form and log form
    'y10-3i-convert': `
      <p class="hp-tag">Worked example: write (a) <b>log₇ 49 = 2</b> in index form and (b) <b>2⁶ = 64</b> in logarithmic form.</p>
      ${flow(['log form', 'logₐ y = x'], ['index form', 'aˣ = y'])}
      ${steps(
        `<p><strong>The base of the log is the base of the power.</strong> The answer of the log is the index.</p>
         ${sum('(a) log₇ 49 = 2 means 7² = 49')}`,
        `<p><strong>Going back: the index becomes the answer of the log.</strong></p>
         ${sum('(b) 2⁶ = 64 means log₂ 64 = 6')}
         ${ans('7^2 = 49 and log_2 64 = 6')}`
      )}
      <p><strong>Negative indices work too:</strong> 5⁻³ = 1/125 means log₅ (1/125) = −3.</p>
      ${tip('Type log form like log_2 64 = 6 and index form like 7^2 = 49 (or 5^-3 = 1/125).')}`,

    // method: Example 25a, b, 3I (ask "the base to what power gives the number?")
    // y10-3I Q3, Q4, Q8, Q11: evaluating logarithms
    'y10-3i-evaluate': `
      <p class="hp-tag">Worked example: evaluate (a) <b>log₅ 125</b>, (b) <b>log₇ (1/49)</b>, (c) <b>log₁₀ 0.0000001</b> and (d) <b>log₈ 8</b>.</p>
      ${steps(
        `<p><strong>Ask: the base to what power gives the number?</strong></p>
         ${sum('(a) 5³ = 125, so log₅ 125 = 3')}`,
        `<p><strong>A fraction or a small decimal gives a negative power.</strong></p>
         ${sum('(b) 7⁻² = 1/7² = 1/49, so log₇ (1/49) = −2<br>(c) 10⁻⁷ = 0.0000001, so the answer is −7')}`,
        `<p><strong>Two facts to remember.</strong> a¹ = a and a⁰ = 1.</p>
         ${sum('(d) log₈ 8 = 1, and logₐ 1 = 0 for any base')}
         ${ans('3, -2, -7, 1')}`
      )}
      <p><strong>Several logs in one question?</strong> Work out each log first, then do the arithmetic: 2 × log₅ 125 + log₇ 49 = 2 × 3 + 2 = 8.</p>
      ${tip('A log can be negative (for numbers between 0 and 1) but you cannot take the log of 0 or a negative number.')}`,

    // method: Example 25c, 3I (log button, base 10)
    // y10-3I Q5: logs on a calculator
    'y10-3i-calculator': `
      <p class="hp-tag">Worked example: evaluate to three decimal places (a) <b>log₁₀ 3</b> and (b) <b>log₁₀ 0.04</b>.</p>
      ${steps(
        `<p><strong>Use the log button.</strong> On most calculators log means log base 10.</p>
         ${sum('(a) log₁₀ 3 = 0.47712... ≈ 0.477<br>(b) log₁₀ 0.04 = −1.39794... ≈ −1.398')}
         ${ans('0.477 and -1.398')}`,
        `<p><strong>Check it makes sense.</strong> 3 is between 1 and 10, so its log is between 0 and 1. 0.04 is between 0.01 and 0.1, so its log is between −2 and −1.</p>`
      )}
      ${tip('For a fraction, use brackets: log(1/8). Round to three decimal places only at the end.')}`,

    // method: Example 26, 3I (rewrite logₐ y = x as aˣ = y)
    // y10-3I Q6: solving log equations
    'y10-3i-solve': `
      <p class="hp-tag">Worked example: find x when (a) <b>log₇ 343 = x</b>, (b) <b>log₄ x = −2</b> and (c) <b>logₓ 49 = 2</b>.</p>
      ${steps(
        `<p><strong>Write each in index form.</strong></p>
         ${sum('(a) 7ˣ = 343<br>(b) 4⁻² = x<br>(c) x² = 49')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('(a) 7³ = 343, so x = 3<br>(b) x = 1/4² = 1/16<br>(c) x = 7 (a base must be positive)')}
         ${ans('3, 1/16, 7')}`
      )}
      ${tip('If x is the base, it must be positive and not 1. Give fraction answers like 1/16.')}`,

    // method: no single worked example; substitution as in Example 26, trial and error as in 3G, and log form from Example 24
    // y10-3I Q7: a population table and its logarithm
    'y10-3i-population': `
      <p class="hp-tag">Worked example: one cell divides into <b>7</b> every minute. Complete a table, write a rule, and find when the population reaches 5000.</p>
      ${fig({ kind: 'table', rows: [['Time (minutes)', '0', '1', '2', '3', '4'], ['Population', '1', '7', '49', '343', '2401']] })}
      ${steps(
        `<p><strong>Each minute multiply by 7.</strong> That gives the rule P = 7ᵗ.</p>
         ${sum('after 5 minutes: P = 7⁵ = 16 807')}`,
        `<p><strong>Trial and error for 5000.</strong></p>
         ${sum('7⁴ = 2401, 7⁵ = 16 807<br>7^4.3 = 4304, 7^4.4 = 5229')}
         <p>So t is about 4.4, which is 4 to the nearest minute.</p>`,
        `<p><strong>The exact answer as a log.</strong> 7ᵗ = 5000 means t = log₇ 5000.</p>
         ${ans('log_7 5000')}`
      )}
      ${tip('Type the rule like P = 7^t and the log like log_7 5000. Separate table values with commas.')}`,

    // method: evaluate each log as in Example 25, 3I (log button), then look for the pattern
    // y10-3I Q9: logs of a 10-fold pattern
    'y10-3i-log-table': `
      <p class="hp-tag">Worked example: a population starts at <b>5</b> and grows 10-fold every day. Find log₁₀ P for each day, to three decimal places.</p>
      <div class="hp-table">
        <div class="hp-tr"><span class="hp-th">d</span><span>0</span><span>1</span><span>2</span><span>3</span></div>
        <div class="hp-tr"><span class="hp-th">P</span><span>5</span><span>50</span><span>500</span><span>5000</span></div>
        <div class="hp-tr"><span class="hp-th">log₁₀ P</span><span>0.699</span><span>1.699</span><span>2.699</span><span>3.699</span></div>
      </div>
      ${steps(
        `<p><strong>Use the log button on each P.</strong> log₁₀ 5 = 0.69897... ≈ 0.699.</p>`,
        `<p><strong>Spot the pattern.</strong> log₁₀ P goes up by exactly 1 each day, so the points lie on a straight line.</p>
         ${sum('log₁₀ P = d + 0.699')}
         ${ans('log10 P = d + 0.699')}`
      )}
      ${tip('Multiplying by 10 each step adds 1 to the log each step. That is why an exponential pattern becomes a straight line.')}`,

    // method: the fact given in the question (each step of 1 is 10 times more powerful), with powers of 10
    // y10-3I Q10: the Richter scale
    'y10-3i-richter': `
      <p class="hp-tag">Worked example: how many times more powerful is a magnitude <b>9</b> earthquake than a magnitude <b>2</b>? A magnitude 9 quake is 10⁸ times more powerful than one of what magnitude?</p>
      ${steps(
        `<p><strong>Find the difference in magnitudes.</strong></p>
         ${sum('9 − 2 = 7')}`,
        `<p><strong>Each 1 is 10 times, so a difference of 7 is 10⁷.</strong></p>
         ${sum('10⁷ = 10 000 000 times')}`,
        `<p><strong>Backwards:</strong> 10⁸ is a difference of 8, so the smaller quake has magnitude 9 − 8 = 1.</p>
         ${ans('10000000 and 1')}`
      )}
      ${tip('Do not multiply the magnitudes or divide them. Subtract, then make a power of 10.')}`,

    // method: the fact given in the question (ⁿ√a = a^(1/n)), then evaluate the log as in Example 25
    // y10-3I Q12: logs of roots
    'y10-3i-roots': `
      <p class="hp-tag">Worked example: evaluate (a) <b>log₂ ⁵√64</b> and (b) <b>log₅ ⁴√125</b> without a calculator.</p>
      ${steps(
        `<p><strong>Write the number under the root as a power of the base.</strong></p>
         ${sum('64 = 2⁶, 125 = 5³')}`,
        `<p><strong>Write the root as a fractional power.</strong></p>
         ${sum(`(a) ⁵√64 = (2⁶)${fr(1, 5)} = 2${fr(6, 5)}<br>(b) ⁴√125 = (5³)${fr(1, 4)} = 5${fr(3, 4)}`)}`,
        `<p><strong>The log is that index.</strong></p>
         ${ans('6/5 and 3/4')}`
      )}
      ${tip('Type the answer as a fraction, like 6/5.')}`,

    // =====================================================================
    // Year 10 3J Logarithmic scales
    // =====================================================================
    // method: Example 27, 3J (difference of the scale values, then 10 to that power)
    // y10-3J Q1, Q2, Q3, Q6, Q8: reading a logarithmic chart
    'y10-3j-chart': `
      <p class="hp-tag">Worked example: this chart shows the Richter scale values of four earthquakes. How many times more powerful was quake P than quake S?</p>
      ${fig({ kind: 'columns', cats: ['P', 'Q', 'R', 'S'], values: [6, 2, 5, 4], step: 1, ymax: 7, ylabel: 'Richter scale', xlabel: 'Earthquake' })}
      ${steps(
        `<p><strong>Read the two bars and subtract.</strong> The scale shows the order of magnitude.</p>
         ${sum('6 − 4 = 2')}`,
        `<p><strong>The real change is 10 to that power.</strong></p>
         ${sum('10² = 100')}
         ${ans('100')}`
      )}
      <p><strong>The value itself:</strong> a bar at log₁₀ W = 12 means W = 10¹² = 1 000 000 000 000. <strong>Two magnitudes and one amount:</strong> lakes with magnitudes 8 and 6 differ by 10², so if the smaller holds 2500 ML, the bigger holds 2500 × 100 = 250 000 ML.</p>
      ${tip('Subtract the scale values, then raise 10 to the difference. Type 100, or a power like 10^2 where the question allows it.')}`,

    // method: Example 28, 3J (log₁₀ of each value, plot against time, straight line means exponential)
    // y10-3J Q4, Q5: making a logarithmic table
    'y10-3j-table': `
      <p class="hp-tag">Worked example: find log₁₀ P for this population, to one decimal place, and describe the graph of log₁₀ P against t.</p>
      ${fig({ kind: 'table', rows: [['t', '0', '1', '2', '3', '4'], ['P', '50', '150', '450', '1350', '4050'], ['log₁₀ P', '1.7', '2.2', '2.7', '3.1', '3.6']] })}
      ${steps(
        `<p><strong>Use the log button on each value.</strong></p>
         ${sum('log₁₀ 50 = 1.699 ≈ 1.7<br>log₁₀ 150 = 2.176 ≈ 2.2, and so on')}`,
        `<p><strong>Plot log₁₀ P against t.</strong> The points go up by about 0.5 each time: a straight line.</p>`,
        `<p><strong>A straight line on a log graph means the relationship is exponential.</strong> Here P is multiplied by 3 every step.</p>
         ${ans('1.7, 2.2, 2.7, 3.1, 3.6')}`
      )}
      ${tip('Separate the values with commas and round each one as the question asks.')}`,

    // method: Key ideas, 3J (order of magnitude); no worked example for decimal magnitudes, so 10 to that power on a calculator
    // y10-3J Q7: decimal magnitudes
    'y10-3j-decimal': `
      <p class="hp-tag">Worked example: country X has log₁₀ (income) = <b>4.6</b> and country Y has <b>4.3</b>. Find the difference in magnitude and each income, to the nearest ten thousand dollars.</p>
      ${steps(
        `<p><strong>Difference in magnitude: subtract.</strong></p>
         ${sum('4.6 − 4.3 = 0.3')}`,
        `<p><strong>The value is 10 to the magnitude.</strong> Use the calculator.</p>
         ${sum('10^4.6 = 39 810.7... ≈ $40 000<br>10^4.3 = 19 952.6... ≈ $20 000')}`,
        `<p><strong>Difference in dollars:</strong> use the full values, then round.</p>
         ${sum('39 810.7 − 19 952.6 = 19 858.1 ≈ $20 000 (nearest $1000)')}
         ${ans('0.3, 40000, 20000')}`
      )}
      ${tip('Use the 10ˣ key (often shift + log). Round only at the end.')}`,

    // method: Example 27, 3J (differences of log values give powers of 10) read from a straight-line graph
    // y10-3J Q9: a straight-line log graph over time
    'y10-3j-graph': `
      <p class="hp-tag">Worked example: this graph shows log₁₀ S for a machine's speed S. Find the difference in magnitude between 1990 and 2010, S in 2010, and predict log₁₀ S for 2030.</p>
      ${fig({ kind: 'linegraph', xs: ['1990', '2000', '2010', '2020'], ys: [1, 4, 7, 10], ymin: 0, ymax: 12, step: 1, xlabel: 'Year', ylabel: 'log₁₀ S' })}
      ${steps(
        `<p><strong>Read and subtract.</strong></p>
         ${sum('7 − 1 = 6')}`,
        `<p><strong>The value is 10 to the reading.</strong></p>
         ${sum('2010: log₁₀ S = 7, so S = 10⁷')}`,
        `<p><strong>Continue the straight line.</strong> It goes up 3 every 10 years.</p>
         ${sum('2030: 10 + 3 = 13')}
         ${ans('6, 10^7, 13')}`
      )}
      ${tip('A straight line on a log graph means S is multiplied by the same number (here 10³) every 10 years. Type a power of 10 like 10^7.')}`,

    // method: the fact given in the question (if log₁₀ a = b then a = 10ᵇ), with the line read like y = mx + c
    // y10-3J Q10, Q11: a rule from a log graph
    'y10-3j-rule': `
      <p class="hp-tag">Worked example: (a) <b>log₁₀ y = 2x + 1</b>. Find y when x = 0.5, and a rule for y. (b) The graph of log₃ P against t is a straight line through A(0, 1) and B(3, 7). Find a rule for P.</p>
      ${fig({ kind: 'plane', x: [0, 4], y: [0, 8], points: { A: [0, 1], B: [3, 7] }, path: [[0, 1], [3.5, 8]], alt: 'A straight line through A(0, 1) and B(3, 7)' })}
      ${steps(
        `<p><strong>(a) Work out the log, then undo it.</strong></p>
         ${sum('x = 0.5: log₁₀ y = 2 × 0.5 + 1 = 2, so y = 10² = 100<br>rule: y = 10<sup>2x + 1</sup>')}`,
        `<p><strong>(b) Find the straight line first.</strong> It starts at 1 and rises 6 over 3, a gradient of 2.</p>
         ${sum('log₃ P = 2t + 1')}`,
        `<p><strong>Undo the log with base 3.</strong></p>
         ${sum('P = 3<sup>2t + 1</sup>')}
         ${ans('y = 10^(2x+1) and P = 3^(2t+1)')}`
      )}
      ${tip('Use the base of the log as the base of the power. Type the whole index in brackets: P = 3^(2t+1).')}`,

    // method: the formula given in the question (pH = −log₁₀ H⁺), evaluated as in Example 25b, 3I
    // y10-3J Q12: pH
    'y10-3j-ph': `
      <p class="hp-tag">Worked example: pH = −log₁₀(H⁺). Find the pH when H⁺ = <b>0.0001</b>, find H⁺ when the pH is <b>11</b>, and compare pH 3 with pH 11.</p>
      ${steps(
        `<p><strong>Write the concentration as a power of 10.</strong></p>
         ${sum('0.0001 = 10⁻⁴, so log₁₀ 0.0001 = −4 and pH = 4')}`,
        `<p><strong>Backwards: pH 11 means log₁₀(H⁺) = −11.</strong></p>
         ${sum('H⁺ = 10⁻¹¹ = 0.00000000001')}`,
        `<p><strong>Comparing:</strong> 11 − 3 = 8, so pH 3 is 10⁸ = 100 000 000 times more acidic.</p>
         ${ans('4, 10^-11, 100000000')}`
      )}
      ${tip('A lower pH is more acidic. Type a tiny concentration as a power of 10, like 10^-11, or count the zeros carefully.')}`,

    // =====================================================================
    // Year 10 3K Laws of logarithms
    // =====================================================================
    // method: Example 29, 3K (add: multiply inside, subtract: divide inside, n logₐ x = logₐ xⁿ)
    // y10-3K Q1, Q2, Q3: the three laws
    'y10-3k-laws': `
      <p class="hp-tag">Worked example: write as a single logarithm (a) <b>logₐ 3 + logₐ 7</b>, (b) <b>logₐ 40 − logₐ 8</b>, (c) <b>2 logₐ 9</b> and (d) <b>log_b 7 − log_b 2</b>.</p>
      ${steps(
        `<p><strong>Adding logs (same base): multiply the numbers.</strong></p>
         ${sum('(a) logₐ 3 + logₐ 7 = logₐ (3 × 7) = logₐ 21')}`,
        `<p><strong>Subtracting logs: divide the numbers.</strong></p>
         ${sum('(b) logₐ 40 − logₐ 8 = logₐ (40/8) = logₐ 5<br>(d) log_b 7 − log_b 2 = log_b (7/2)')}`,
        `<p><strong>A number in front becomes a power.</strong></p>
         ${sum('(c) 2 logₐ 9 = logₐ 9² = logₐ 81')}
         ${ans('log_a 21')}`
      )}
      ${tip('Type a single log like log_a 21, and a fraction inside like log_b (7/2). logₐ 1 = 0, so adding logₐ 1 changes nothing.')}`,

    // method: Example 30a, b, c, 3K (logₐ 1 = 0, logₐ a = 1, write as a power of the base)
    // y10-3K Q4, Q5: evaluating with the log properties
    'y10-3k-evaluate': `
      <p class="hp-tag">Worked example: evaluate (a) <b>log₈ 1</b>, (b) <b>3 log₄ 4</b>, (c) <b>(log₂ 64) / 9</b> and (d) <b>log₇ (1/49)</b>.</p>
      ${steps(
        `<p><strong>Two facts:</strong> logₐ 1 = 0 (since a⁰ = 1) and logₐ a = 1 (since a¹ = a).</p>
         ${sum('(a) log₈ 1 = 0<br>(b) 3 log₄ 4 = 3 × 1 = 3')}`,
        `<p><strong>Work out the log, then the arithmetic.</strong></p>
         ${sum('(c) log₂ 64 = 6, and 6/9 = 2/3')}`,
        `<p><strong>One over: write it as a negative power of the base.</strong></p>
         ${sum('(d) log₇ (1/49) = log₇ 7⁻² = −2 × log₇ 7 = −2')}
         ${ans('0, 3, 2/3, -2')}`
      )}
      ${tip('logₐ (1/x) = −logₐ x, so log₇ (1/49) = −log₇ 49 = −2 as well. Give fractions like 2/3.')}`,

    // method: Example 30d, 3K (combine into one log, then evaluate)
    // y10-3K Q6: combining, then evaluating
    'y10-3k-combine': `
      <p class="hp-tag">Worked example: evaluate (a) <b>log₃ 45 − log₃ 5</b> and (b) <b>log₄ 8 + log₄ 2</b>.</p>
      ${steps(
        `<p><strong>Combine into one log first.</strong></p>
         ${sum('(a) log₃ (45/5) = log₃ 9<br>(b) log₄ (8 × 2) = log₄ 16')}`,
        `<p><strong>Now evaluate.</strong></p>
         ${sum('(a) 3² = 9, so log₃ 9 = 2<br>(b) 4² = 16, so log₄ 16 = 2')}
         ${ans('2 and 2')}`
      )}
      ${tip('Neither log₄ 8 nor log₄ 2 is a whole number, but together they are. Always combine first.')}`,

    // method: Example 29, 3K (power law first, then add or subtract)
    // y10-3K Q7: combining several laws
    'y10-3k-single': `
      <p class="hp-tag">Worked example: write as a single logarithm (a) <b>2 log₁₀ 6 − log₁₀ 3</b> and (b) <b>½ log₇ 25 + log₇ 3</b>.</p>
      ${steps(
        `<p><strong>Move each number in front up into a power.</strong> A power of ½ is a square root.</p>
         ${sum('(a) 2 log₁₀ 6 = log₁₀ 6² = log₁₀ 36<br>(b) ½ log₇ 25 = log₇ 25<sup>½</sup> = log₇ 5')}`,
        `<p><strong>Then add (multiply inside) or subtract (divide inside).</strong></p>
         ${sum('(a) log₁₀ 36 − log₁₀ 3 = log₁₀ (36/3) = log₁₀ 12<br>(b) log₇ 5 + log₇ 3 = log₇ 15')}
         ${ans('log_10 12 and log_7 15')}`
      )}
      ${tip('Do the powers first, always. A power of 1/3 is a cube root: ⅓ log₂ 27 = log₂ 3. Type log_7 15.')}`,

    // method: Example 30c, 3K (write as a power of the base, then the power law)
    // y10-3K Q8: logs of roots
    'y10-3k-roots': `
      <p class="hp-tag">Worked example: simplify (a) <b>log₇ ∛49</b> and (b) <b>log₃ ⁴√27</b>.</p>
      ${steps(
        `<p><strong>Write the number as a power of the base, and the root as a fractional power.</strong></p>
         ${sum(`(a) ∛49 = (7²)${fr(1, 3)} = 7${fr(2, 3)}<br>(b) ⁴√27 = (3³)${fr(1, 4)} = 3${fr(3, 4)}`)}`,
        `<p><strong>Use n logₐ a = n.</strong></p>
         ${sum('(a) log₇ 7<sup>2/3</sup> = 2/3 × log₇ 7 = 2/3<br>(b) log₃ 3<sup>3/4</sup> = 3/4')}
         ${ans('2/3 and 3/4')}`
      )}
      ${tip('Type the answer as a fraction, like 2/3.')}`,

    // =====================================================================
    // Year 10 3L Solving exponential equations using logarithms
    // =====================================================================
    // method: Example 31, 3L (divide first, then if aˣ = y, x = logₐ y)
    // y10-3L Q1, Q2: using the given base
    'y10-3l-given-base': `
      <p class="hp-tag">Worked example: solve using the given base (a) <b>5ˣ = 12</b>, (b) <b>6 × 1.3ˣ = 24</b> and (c) <b>7 × 2ˣ = 56</b>.</p>
      ${steps(
        `<p><strong>If aˣ = y, then x = logₐ y.</strong></p>
         ${sum('(a) x = log₅ 12')}`,
        `<p><strong>A number in front: divide both sides by it first.</strong></p>
         ${sum('(b) 1.3ˣ = 24 ÷ 6 = 4, so x = log₁.₃ 4<br>(c) 2ˣ = 56 ÷ 7 = 8, so x = 3')}`,
        `<p><strong>Exact when you can.</strong> 2³ = 8, so (c) is a whole number. 0.5ˣ = 0.125 gives x = 3 too.</p>
         ${ans('log_5 12, log_1.3 4, 3')}`
      )}
      ${tip('Type a log like log_5 12 or log_1.3 4. If the number is an exact power of the base, give the whole number instead.')}`,

    // method: Example 32, 3L (divide first, take log₁₀ of both sides, power law, divide by log₁₀ a)
    // y10-3L Q3, Q4: solving with base 10
    'y10-3l-base10': `
      <p class="hp-tag">Worked example: solve using base 10, to three decimal places, (a) <b>7ˣ = 30</b> and (b) <b>120 × 0.7ˣ = 30</b>.</p>
      ${steps(
        `<p><strong>Take log₁₀ of both sides, and bring the power down.</strong></p>
         ${sum('(a) log₁₀ 7ˣ = log₁₀ 30<br>x log₁₀ 7 = log₁₀ 30')}`,
        `<p><strong>Divide by log₁₀ 7.</strong></p>
         ${sum('x = log₁₀ 30 / log₁₀ 7 = 1.7478... ≈ 1.748')}`,
        `<p><strong>(b) Divide by 120 first, then the same steps.</strong></p>
         ${sum('0.7ˣ = 0.25<br>x log₁₀ 0.7 = log₁₀ 0.25<br>x = log₁₀ 0.25 / log₁₀ 0.7 = 3.8867... ≈ 3.887')}
         ${ans('1.748 and 3.887')}`
      )}
      ${tip('Type it in one go: log(30) ÷ log(7). If the answer is a whole number, like 2, just type 2.')}`,

    // method: Example 32b, 3L (divide by the starting amount, then logs)
    // y10-3L Q5, Q6, Q7, Q8, Q9: growth, decay and half-life with logs
    'y10-3l-problems': `
      <p class="hp-tag">Worked example: (a) <b>$8000</b> grows by <b>5%</b> p.a. When does it reach $12 000? (b) A mass decays by <b>3%</b> per year. Find its half-life.</p>
      ${steps(
        `<p><strong>Write the rule and divide by the starting amount.</strong></p>
         ${sum('(a) 8000 × 1.05ⁿ = 12 000, so 1.05ⁿ = 1.5')}`,
        `<p><strong>Solve with logs.</strong></p>
         ${sum('n = log₁₀ 1.5 / log₁₀ 1.05 = 8.3103... ≈ 8.31 years')}`,
        `<p><strong>Half-life: the mass halves, whatever it started at.</strong></p>
         ${sum('(b) 0.97ⁿ = 0.5<br>n = log₁₀ 0.5 / log₁₀ 0.97 = 22.76... ≈ 23 years')}
         ${ans('8.31 and 23')}`
      )}
      ${tip('Growth of r% uses 1 + r/100; decay uses 1 − r/100. Doubled means the right side is 2 after dividing. Round as the question asks.')}`,

    // method: Key ideas, 3L (x = log₁₀ y / log₁₀ a), the change of base formula given in the question
    // y10-3L Q10: change of base
    'y10-3l-change-base': `
      <p class="hp-tag">Worked example: (a) write <b>log₅ 20</b> with base 10, (b) change <b>log₅ 0.001</b> to base 10 and simplify, and (c) solve <b>5ˣ = 18</b>.</p>
      ${steps(
        `<p><strong>logₐ y = log y / log a</strong>, where log means log₁₀.</p>
         ${sum('(a) log₅ 20 = log 20 / log 5')}`,
        `<p><strong>Simplify any log of a power of 10.</strong> log 0.001 = −3.</p>
         ${sum('(b) log₅ 0.001 = log 0.001 / log 5 = −3 / log 5')}`,
        `<p><strong>Make x the subject, then change base.</strong></p>
         ${sum('(c) x = log₅ 18 = log 18 / log 5 = 1.7958... ≈ 1.796')}
         ${ans('log(20)/log(5), -3/log(5), 1.796')}`
      )}
      ${tip('Type log for log base 10, with brackets: log(20)/log(5). The number you take the log of goes on top.')}`
  });
})();
