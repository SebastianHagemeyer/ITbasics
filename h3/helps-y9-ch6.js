/* H3 help panels for Year 9 Chapter 6. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 6A to 6I. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // Factor tree picture (copied from the Year 8 1D panels). A node is a string (a prime, circled) or [label, left, right].
  const tree = (t, label) => {
    const W = 44, H = 52, R = 15, P = 22;
    const leaves = n => Array.isArray(n) ? leaves(n[1]) + leaves(n[2]) : 1;
    const depth = n => Array.isArray(n) ? 1 + Math.max(depth(n[1]), depth(n[2])) : 0;
    const w = leaves(t) * W, h = depth(t) * H + P * 2;
    let lines = '', marks = '';
    const txt = (x, y, s) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" fill="currentColor" style="font:700 15px var(--f-mono)">${s}</text>`;
    const place = (n, x0, y) => {
      if (!Array.isArray(n)) {
        const x = x0 + W / 2;
        marks += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" style="stroke:var(--h3-green);stroke-width:2"/>` + txt(x, y, n);
        return x;
      }
      const lw = leaves(n[1]) * W;
      const a = place(n[1], x0, y + H), b = place(n[2], x0 + lw, y + H);
      const x = (a + b) / 2;
      const end = (c) => Array.isArray(c) ? 11 : R + 2;
      lines += `<line x1="${x}" y1="${y + 11}" x2="${a}" y2="${y + H - end(n[1])}"/><line x1="${x}" y1="${y + 11}" x2="${b}" y2="${y + H - end(n[2])}"/>`;
      marks += txt(x, y, n[0]);
      return x;
    };
    place(t, 0, P);
    return `<div class="qfig hp-fig" style="color:var(--ink)"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="max-width:100%;height:auto" role="img" aria-label="${label}">
      <g stroke="currentColor" stroke-opacity=".55" stroke-width="1.5">${lines}</g>${marks}</svg></div>`;
  };

  // A small two or three column table: first row is the heading.
  const table = (rows) => `
      <div class="hp-table" role="table">
        ${rows.map((r, i) => `<div class="hp-tr${i ? '' : ' hp-th'}" role="row">${r.map(c => `<span role="${i ? 'cell' : 'columnheader'}">${c}</span>`).join('')}</div>`).join('\n        ')}
      </div>`;

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 9 6A Index notation
    // =====================================================================
    // y9-6A Q1: expanded form
    'y9-6a-expand': `
      <p class="hp-tag">Worked example: write <b>(5t)³</b> and <b>4x³y²</b> in expanded form.</p>
      ${steps(
        `<p><strong>A bracket to a power: write the whole bracket out that many times.</strong> Everything inside gets repeated, the number too.</p>
         ${sum('(5t)³ = 5t × 5t × 5t = 5 × t × 5 × t × 5 × t')}`,
        `<p><strong>No bracket: the power belongs only to the letter it touches.</strong> The 4 appears once.</p>
         ${sum('4x³y² = 4 × x × x × x × y × y')}
         ${ans('5×t×5×t×5×t, 4×x×x×x×y×y')}`
      )}
      ${tip('Put × (or *) between every single factor, letters too: x×y×x×y, not xy×xy. A minus sign stays on the number: −7a²b is -7×a×a×b.')}`,

    // y9-6A Q2, Q12, Q13: evaluating powers of negatives and fractions
    'y9-6a-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>(−8)³</b> and <b>(−8/9)²</b>.</p>
      ${steps(
        `<p><strong>Write it out and multiply.</strong> Each pair of negatives makes a positive, so an odd number of them leaves a negative.</p>
         ${sum('(−8)³ = (−8) × (−8) × (−8)<br>= 64 × (−8) = −512')}`,
        `<p><strong>A fraction to a power: write it out too, then multiply the tops and multiply the bottoms.</strong> Two negatives, so the answer is positive.</p>
         ${sum('(−8/9)² = (−8/9) × (−8/9)<br>= 64/81')}
         ${ans('-512, 64/81')}
         <p>So a fraction to a power is the top to that power over the bottom to that power.</p>`,
        `<p><strong>Watch where the minus sign sits.</strong> The power only acts on what is right next to it, or inside its bracket.</p>
         ${table([['Write', 'Means', 'Value'], ['(−8)²', '(−8) × (−8)', '64'], ['−8²', '−(8 × 8)', '−64'], ['−(−8)²', '−(64)', '−64'], ['−(−8)³', '−(−512)', '512']])}`
      )}
      ${tip('Even power of a negative: positive. Odd power: negative. Type a fraction answer with /, like 64/81, and a negative with the minus key, like -512.')}`,

    // y9-6A Q3, Q4, Q5: writing in index form
    'y9-6a-index-form': `
      <p class="hp-tag">Worked example: write <b>7 × 7 × 7 × x × x × y</b>, <b>3/5 × 3/5 × 3/5 × 3/5</b> and <b>7a × 2b × 7a × 2b</b> in index form.</p>
      ${steps(
        `<p><strong>Count how many times each factor appears.</strong> That count is the index.</p>
         ${sum('7 × 7 × 7 × x × x × y = 7³x²y')}`,
        `<p><strong>A repeated fraction goes in a bracket, then the power.</strong></p>
         ${sum('3/5 × 3/5 × 3/5 × 3/5 = (3/5)⁴')}`,
        `<p><strong>Mixed terms: split them up first</strong>, then count each number and letter.</p>
         ${sum('7a × 2b × 7a × 2b<br>= 2 × 2 × 7 × 7 × a × a × b × b<br>= 2² × 7² × a² × b²')}
         ${ans('7^3x^2y, (3/5)^4, 2^2×7^2×a^2×b^2')}`
      )}
      ${tip('Keep each number as its own power: do not multiply 2² × 7² out. Fractions need brackets and no spaces: (3/5)^4, and two different fractions sit side by side, like (2/3)^2(1/5)^3.')}`,

    // y9-6A Q6: prime factors in index form
    'y9-6a-primes': `
      <p class="hp-tag">Worked example: write <b>540</b> as a product of prime factors in index form.</p>
      ${steps(
        `<p><strong>Split it into any two factors, and keep splitting</strong> until every branch ends in a prime (circled).</p>
         ${tree(['540', ['10', '2', '5'], ['54', ['6', '2', '3'], ['9', '3', '3']]], 'Factor tree: 540 splits into 10 and 54; 10 into 2 and 5; 54 into 6 and 9; 6 into 2 and 3; 9 into 3 and 3')}`,
        `<p><strong>Collect the primes, smallest first.</strong></p>
         ${sum('540 = 2 × 2 × 3 × 3 × 3 × 5')}`,
        `<p><strong>Use powers for repeated primes.</strong></p>
         ${sum('540 = 2² × 3³ × 5')}
         ${ans('2^2×3^3×5')}`
      )}
      ${tip('Type powers with ^ and join the primes with × or *, like 2^2×3^3×5. A prime that appears once needs no power.')}`,

    // y9-6A Q7: substituting into powers
    'y9-6a-sub': `
      <p class="hp-tag">Worked example: if <b>x = −5</b> and <b>y = 2</b>, evaluate <b>(xy)³</b>, <b>(y/x)²</b> and <b>x²y</b>.</p>
      ${steps(
        `<p><strong>Work out the bracket first, then the power.</strong></p>
         ${sum('(xy)³ = (−5 × 2)³ = (−10)³ = −1000')}`,
        `<p><strong>A fraction in a bracket: simplify it, write it out, then multiply tops and bottoms.</strong></p>
         ${sum('(y/x)² = (2/(−5))² = (−2/5)²<br>= (−2/5) × (−2/5) = 4/25')}`,
        `<p><strong>No bracket: only the x is squared.</strong> Put the negative number in brackets so the square takes the sign too.</p>
         ${sum('x²y = (−5)² × 2 = 25 × 2 = 50')}
         ${ans('-1000, 4/25, 50')}`
      )}
      ${tip('Always replace a negative letter with a bracketed number: x² is (−5)² = 25, not −25. Type fraction answers like 4/25.')}`,

    // y9-6A Q8: missing base or index
    'y9-6a-missing': `
      <p class="hp-tag">Worked example: find the missing number in <b>11<sup>□</sup> = 1331</b>, <b>□³ = −1000</b> and <b>□³ = 1/1331</b>.</p>
      ${steps(
        `<p><strong>Missing index: keep multiplying by the base</strong> until you reach the number, and count the steps.</p>
         ${chips(['11¹ = 11'], ['11² = 121'], ['11³ = 1331', 'add'])}
         <p>So the index is 3.</p>`,
        `<p><strong>Missing base: which number, used that many times, gives it?</strong> An odd power of a negative is negative.</p>
         ${sum('(−10) × (−10) × (−10) = −1000, so □ = −10')}`,
        `<p><strong>A fraction: find the top and bottom separately.</strong> 1³ = 1 and 11³ = 1331.</p>
         ${sum('□ = 1/11')}
         ${ans('3, -10, 1/11')}`
      )}
      ${tip('Type just the missing number. A negative base needs the minus sign, like -10, and a fraction is typed like 1/11.')}`,

    // y9-6A Q9, Q10, Q11: doubling and repeated percentage change
    'y9-6a-growth': `
      <p class="hp-tag">Worked example: a colony of <b>5</b> cells doubles every <b>15 minutes</b>. How many cells after <b>1 hour 45 minutes</b>?</p>
      ${steps(
        `<p><strong>Count the doublings.</strong> Change everything to minutes first.</p>
         ${sum('105 ÷ 15 = 7 doublings')}`,
        `<p><strong>Multiply the start by 2 once for every doubling.</strong></p>
         ${sum('5 × 2⁷ = 5 × 128 = 640')}
         ${ans('640')}`,
        `<p><strong>Losing a percentage works the same way.</strong> A 20 kg block that loses 10% each hour keeps 90%, so multiply by 0.9 every hour. When is it at least 6 kg lighter (14 kg or less)?</p>
         ${fig({ kind: 'table', rows: [['Hour', '0', '1', '2', '3', '4'], ['Mass (kg)', '20', '18', '16.2', '14.58', '13.122']] })}
         <p>It first drops to 14 kg or below after <b>4</b> hours.</p>`
      )}
      ${tip('A table of time and amount makes these easy to check. "At least" questions want the first whole number of steps that gets there.')}`,

    // y9-6A Q14: decimals to a power as fractions
    'y9-6a-decimal': `
      <p class="hp-tag">Worked example: evaluate <b>(0.45)²</b> as a fraction in simplest form.</p>
      ${steps(
        `<p><strong>Write the decimal as a fraction and simplify it first.</strong></p>
         ${sum('0.45 = 45/100 = 9/20')}`,
        `<p><strong>Write it out and multiply.</strong> Multiply the tops, then multiply the bottoms.</p>
         ${sum('(9/20)² = 9/20 × 9/20 = 81/400')}
         ${ans('81/400')}`
      )}
      ${tip('Simplifying before you square keeps the numbers small, and the answer comes out in simplest form. Type it like 81/400.')}`,

    // y9-6A Q15: LCM and HCF from prime factors
    'y9-6a-lcm-hcf': `
      <p class="hp-tag">Worked example: find the LCM and HCF of <b>36</b> and <b>54</b>.</p>
      ${steps(
        `<p><strong>Write both in prime factor form.</strong></p>
         ${sum('36 = 2² × 3²<br>54 = 2 × 3³')}`,
        `<p><strong>HCF: only the primes in both, each with its smallest power.</strong></p>
         ${sum('HCF = 2 × 3² = 18')}`,
        `<p><strong>LCM: every prime that appears, each with its highest power.</strong></p>
         ${sum('LCM = 2² × 3³ = 108')}
         ${ans('108, 18')}`
      )}
      ${tip('Type the LCM first, then the HCF, with a comma between them. Check: the LCM must divide by both numbers, and the HCF must go into both.')}`,

    // =====================================================================
    // Year 9 6B Index laws for multiplication and division
    // =====================================================================
    // y9-6B Q1, Q2: multiplying and dividing powers of numbers
    'y9-6b-numbers': `
      <p class="hp-tag">Worked example: simplify <b>11² × 11⁹</b>, <b>6¹⁰ ÷ 6⁴</b> and <b>(−2)⁹ ÷ (−2)⁶</b>.</p>
      ${steps(
        `<p><strong>Multiplying the same base: keep the base, add the indices.</strong></p>
         ${sum('11² × 11⁹ = 11¹¹')}`,
        `<p><strong>Dividing the same base: keep the base, subtract the indices.</strong></p>
         ${sum('6¹⁰ ÷ 6⁴ = 6⁶')}`,
        `<p><strong>A negative base works the same way.</strong> Keep it in its bracket.</p>
         ${sum('(−2)⁹ ÷ (−2)⁶ = (−2)³')}
         ${ans('11^11, 6^6, (-2)^3')}`
      )}
      <p><strong>No index showing?</strong> 13 is 13¹, so 13 × 13⁴ = 13⁵.</p>
      ${tip('Never multiply the bases: 11² × 11⁹ is 11¹¹, not 121¹¹. Type powers with ^, and keep a negative base in brackets, like (-2)^3.')}`,

    // y9-6B Q3: multiplying terms with letters
    'y9-6b-mult-letters': `
      <p class="hp-tag">Worked example: simplify <b>5x⁶y⁴ × 3x⁸y⁹</b>.</p>
      ${steps(
        `<p><strong>Multiply the numbers in front.</strong></p>
         ${sum('5 × 3 = 15')}`,
        `<p><strong>Add the indices of each letter separately.</strong></p>
         ${sum('x⁶ × x⁸ = x¹⁴ &nbsp; y⁴ × y⁹ = y¹³')}
         ${ans('15x^14y^13')}`
      )}
      <p><strong>A letter on its own has index 1:</strong> p × p⁹ = p¹ × p⁹ = p¹⁰.</p>
      ${tip('Numbers multiply, indices add. Type each letter with its power, in order: 15x^14y^13.')}`,

    // y9-6B Q4: dividing terms with letters
    'y9-6b-divide': `
      <p class="hp-tag">Worked example: simplify <b>24x⁹ / (6x²)</b> and <b>9y¹⁰ / (12y⁴)</b>.</p>
      ${steps(
        `<p><strong>Divide the numbers, subtract the indices.</strong></p>
         ${sum('24 ÷ 6 = 4 &nbsp; x⁹ ÷ x² = x⁷<br>so 24x⁹ / (6x²) = 4x⁷')}`,
        `<p><strong>If the numbers do not divide exactly, simplify them like a fraction.</strong> 9/12 = 3/4.</p>
         ${sum('y¹⁰ ÷ y⁴ = y⁶<br>so 9y¹⁰ / (12y⁴) = 3y⁶/4')}
         ${ans('4x^7, 3y^6/4')}`
      )}
      <p><strong>Index 1 or 0:</strong> y⁵ ÷ y⁴ = y¹, written just y. And y⁴ ÷ y⁴ = y⁰ = 1, so that letter disappears.</p>
      ${tip('A fraction left over stays as a fraction: type 3y^6/4. A minus sign in front stays in front: −8y⁹/(2y) = -4y^8.')}`,

    // y9-6B Q5, Q6, Q13: several index laws in one expression
    'y9-6b-mixed': `
      <p class="hp-tag">Worked example: simplify <b>x⁷ × x⁴ ÷ x⁹</b> and <b>6x⁴/(5y²) × 10y⁸/(3x³)</b>.</p>
      ${steps(
        `<p><strong>One base: work from left to right</strong>, adding for × and subtracting for ÷.</p>
         ${sum('x⁷ × x⁴ ÷ x⁹ = x¹¹ ÷ x⁹ = x²')}`,
        `<p><strong>Fractions: multiply the tops and multiply the bottoms.</strong></p>
         ${sum('(6 × 10)x⁴y⁸ / ((5 × 3)x³y²) = 60x⁴y⁸ / (15x³y²)')}`,
        `<p><strong>Then simplify the numbers and each letter.</strong></p>
         ${sum('60 ÷ 15 = 4 &nbsp; x⁴ ÷ x³ = x &nbsp; y⁸ ÷ y² = y⁶')}
         ${ans('x^2, 4xy^6')}`
      )}
      <p><strong>Dividing by a fraction?</strong> Flip it and multiply: ÷ 3x/y² is the same as × y²/(3x).</p>
      ${tip('If a letter has a bigger index on the bottom, it stays on the bottom: type it like a^4/b^3, with a bracket when the bottom has more than one factor, like 2a/(3b^2).')}`,

    // y9-6B Q7: missing numbers
    'y9-6b-missing': `
      <p class="hp-tag">Worked example: find the missing number in <b>5³ × 5<sup>□</sup> = 5¹¹</b>, <b>x<sup>□</sup> ÷ x⁴ = x⁶</b> and <b>15x⁹ ÷ (□x²) = 5x⁷</b>.</p>
      ${steps(
        `<p><strong>Multiplying adds the indices, so ask what adds on.</strong></p>
         ${sum('3 + □ = 11, so □ = 8')}`,
        `<p><strong>Dividing subtracts the indices.</strong></p>
         ${sum('□ − 4 = 6, so □ = 10')}`,
        `<p><strong>For the number in front, think about the numbers alone.</strong> The letters already work (9 − 2 = 7).</p>
         ${sum('15 ÷ □ = 5, so □ = 3')}
         ${ans('8, 10, 3')}`
      )}
      ${tip('Check by putting your number back in. Type only the missing number.')}`,

    // y9-6B Q8: evaluating without a calculator
    'y9-6b-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>7¹⁵ ÷ 7¹³</b> and <b>3 × 20⁵¹ ÷ 20⁴⁹</b> without a calculator.</p>
      ${steps(
        `<p><strong>Use the index law first</strong>, so the power becomes small.</p>
         ${sum('7¹⁵ ÷ 7¹³ = 7² = 49')}`,
        `<p><strong>A number in front just comes along for the ride.</strong></p>
         ${sum('3 × 20⁵¹ ÷ 20⁴⁹ = 3 × 20² = 3 × 400 = 1200')}
         ${ans('49, 1200')}`
      )}
      ${tip('Simplify the indices first and only work out the number at the end. An index of 1 means the base itself: 9¹ = 9.')}`,

    // y9-6B Q9: counting pairs of indices
    'y9-6b-count': `
      <p class="hp-tag">Worked example: if m and n are positive whole numbers, how many pairs make <b>a<sup>m</sup> × a<sup>n</sup> = a⁷</b> true?</p>
      ${steps(
        `<p><strong>Turn it into a sum.</strong> Multiplying adds the indices, so m + n = 7.</p>`,
        `<p><strong>List the pairs in order</strong>, so you do not miss any.</p>
         ${chips(['1, 6'], ['2, 5'], ['3, 4'], ['4, 3'], ['5, 2'], ['6, 1'])}
         ${ans('6')}`
      )}
      ${tip('m and n must both be at least 1, so 0 and 7 is not allowed. Count 1, 6 and 6, 1 as two different pairs.')}`,

    // y9-6B Q10: fixing mistakes
    'y9-6b-mistakes': `
      <p class="hp-tag">Worked example: each of these is wrong. Find the right answer.</p>
      ${table([['Wrong working', 'Mistake', 'Correct'], ['x⁶ × x = x⁶', 'x is x¹, so add 1', 'x⁷'], ['3y⁹ × 5y² = 8y¹¹', 'numbers multiply, not add', '15y¹¹'], ['10a⁸ ÷ 5a² = 2a⁴', 'subtract indices, do not divide them', '2a⁶'], ['m⁹ ÷ m² × m⁵ = m⁹ ÷ m⁷ = m²', 'go left to right', 'm¹²']])}
      ${steps(
        `<p><strong>Redo the working one law at a time.</strong> For the last one: m⁹ ÷ m² = m⁷, then m⁷ × m⁵ = m¹².</p>
         ${ans('x^7, 15y^11, 2a^6, m^12')}`
      )}
      ${tip('Numbers in front follow normal arithmetic. Only the indices use the add and subtract rules. If a number does not divide, leave a fraction like a^4/2.')}`,

    // y9-6B Q11: substituting expressions
    'y9-6b-sub': `
      <p class="hp-tag">Worked example: if <b>x = 4k²</b> and <b>y = 2k⁷</b>, simplify <b>3x</b>, <b>xy</b> and <b>x/y</b>.</p>
      ${steps(
        `<p><strong>Replace each letter with its expression, in brackets.</strong></p>
         ${sum('3x = 3 × 4k² = 12k²')}`,
        `<p><strong>Multiply: numbers multiply, indices add.</strong></p>
         ${sum('xy = 4k² × 2k⁷ = 8k⁹')}`,
        `<p><strong>Divide: numbers divide, indices subtract.</strong> The k⁷ on the bottom beats the k² on top, so k⁵ stays on the bottom.</p>
         ${sum('x/y = 4k² / (2k⁷) = 2/k⁵')}
         ${ans('12k^2, 8k^9, 2/k^5')}`
      )}
      ${tip('Type a letter left on the bottom after a slash, like 2/k^5. A minus sign in front of the expression stays in front: −5y = −10k⁷.')}`,

    // y9-6B Q12: indices that are letters
    'y9-6b-letters': `
      <p class="hp-tag">Worked example: simplify <b>6<sup>2a</sup> × 6<sup>3a</sup></b>, <b>p<sup>5a</sup> ÷ p<sup>a − 2</sup></b> and <b>x<sup>m</sup>y³ × x²y<sup>n</sup></b>.</p>
      ${steps(
        `<p><strong>The laws still work: add for ×, subtract for ÷.</strong></p>
         ${sum('2a + 3a = 5a, so 6<sup>2a</sup> × 6<sup>3a</sup> = 6<sup>5a</sup>')}`,
        `<p><strong>Subtract the whole index, in a bracket.</strong> Taking away −2 adds 2.</p>
         ${sum('5a − (a − 2) = 4a + 2, so the answer is p<sup>4a + 2</sup>')}`,
        `<p><strong>Different letters: deal with each base separately.</strong></p>
         ${sum('x<sup>m + 2</sup>y<sup>n + 3</sup>')}
         ${ans('5a, p^(4a+2), x^(m+2)y^(n+3)')}`
      )}
      ${tip('When the question asks for just the index, type only that, like 5a. Otherwise put an index that is an expression in brackets: p^(4a+2).')}`,

    // =====================================================================
    // Year 9 6C Index laws for power of a power and the zero index
    // =====================================================================
    // y9-6C Q1, Q11: power of a power
    'y9-6c-power': `
      <p class="hp-tag">Worked example: simplify <b>(x⁶)⁷</b>, <b>−4(y⁹)²</b> and <b>((p⁹)²)⁴</b>.</p>
      ${steps(
        `<p><strong>Power of a power: multiply the indices.</strong> (x⁶)⁷ is seven lots of x⁶ multiplied, so 6 × 7.</p>
         ${sum('(x⁶)⁷ = x⁴²')}`,
        `<p><strong>A number outside the bracket is not powered.</strong></p>
         ${sum('−4(y⁹)² = −4y¹⁸')}`,
        `<p><strong>Several brackets: work from the inside out.</strong></p>
         ${sum('((p⁹)²)⁴ = (p¹⁸)⁴ = p⁷²')}
         ${ans('x^42, -4y^18, p^72')}`
      )}
      <p><strong>Letters as indices:</strong> (x<sup>4a</sup>)<sup>3b</sup> = x<sup>12ab</sup>, typed x^(12ab).</p>
      ${tip('Multiplying the same base: add the indices. A power of a power: multiply them. Keep a negative base in its bracket, like (-2)^12.')}`,

    // y9-6C Q2, Q3: the zero index
    'y9-6c-zero': `
      <p class="hp-tag">Worked example: evaluate <b>9⁰ + 3x⁰ − (4y)⁰</b>.</p>
      ${steps(
        `<p><strong>Anything (except 0) to the power 0 is 1.</strong> That is because 9²/9² = 1, and the index law gives 9²⁻² = 9⁰.</p>
         ${sum('9⁰ = 1')}`,
        `<p><strong>Check what the 0 belongs to.</strong> In 3x⁰ only the x is powered. A bracket puts everything inside to the power 0.</p>
         ${sum('3x⁰ = 3 × 1 = 3 &nbsp; (4y)⁰ = 1')}`,
        `<p><strong>Put it together.</strong></p>
         ${sum('1 + 3 − 1 = 3')}
         ${ans('3')}`
      )}
      <p><strong>More:</strong> −(11⁰) = −1, (−2/7)⁰ = 1, and 7w⁰ = 7 but (7w)⁰ = 1.</p>
      ${tip('A minus sign outside the bracket stays: −(11⁰) is −1. Type just the number.')}`,

    // y9-6C Q4, Q5: combining power of a power with × and ÷
    'y9-6c-combine': `
      <p class="hp-tag">Worked example: simplify <b>x⁵ × (x⁷)⁴</b> and <b>(y⁹)⁵ ÷ (y⁸)⁴</b>.</p>
      ${steps(
        `<p><strong>Do the brackets first: multiply those indices.</strong></p>
         ${sum('(x⁷)⁴ = x²⁸ &nbsp; (y⁹)⁵ = y⁴⁵ &nbsp; (y⁸)⁴ = y³²')}`,
        `<p><strong>Then multiply (add the indices) or divide (subtract them).</strong></p>
         ${sum('x⁵ × x²⁸ = x³³<br>y⁴⁵ ÷ y³² = y¹³')}
         ${ans('x^33, y^13')}`
      )}
      <p><strong>Numbers too:</strong> 2 × (2⁹)³ = 2¹ × 2²⁷ = 2²⁸. If everything cancels to an index of 0, the answer is 1.</p>
      ${tip('Brackets first, then × and ÷. A bracket with index 0 inside, like (r⁰)⁵, is just 1.')}`,

    // y9-6C Q6, Q12: fractions with numbers and powers
    'y9-6c-fractions': `
      <p class="hp-tag">Worked example: simplify <b>8a⁵ × 3a⁶ / (6a¹⁴)</b> and <b>12(m⁷)⁴ / (8(m⁹)³)</b>.</p>
      ${steps(
        `<p><strong>Tidy the top and bottom first:</strong> brackets, then multiply.</p>
         ${sum('8a⁵ × 3a⁶ = 24a¹¹ &nbsp; 12(m⁷)⁴ = 12m²⁸ &nbsp; 8(m⁹)³ = 8m²⁷')}`,
        `<p><strong>Simplify the numbers, then subtract the indices.</strong> A bigger index on the bottom leaves the letter on the bottom.</p>
         ${sum('24a¹¹ / (6a¹⁴) = 4/a³<br>12m²⁸ / (8m²⁷) = 3m/2')}
         ${ans('4/a^3, 3m/2')}`
      )}
      <p><strong>Dividing by a fraction?</strong> Flip the second fraction and multiply, then simplify as above.</p>
      ${tip('Type a letter left on the bottom after a slash, like 4/a^3, and a number left on the bottom the same way, like 3m/2.')}`,

    // y9-6C Q7: a growth rule with a power
    'y9-6c-rule': `
      <p class="hp-tag">Worked example: a population is <b>N = 25 × 3<sup>t</sup></b>, where t is the number of years after the start of 2020.</p>
      ${steps(
        `<p><strong>Substitute t and do the power first.</strong></p>
         ${sum('t = 2: N = 25 × 3² = 25 × 9 = 225')}`,
        `<p><strong>A year, not t? Subtract the starting year.</strong> The start of 2025 is t = 5. At t = 0, N = 25 × 1 = 25 (the start).</p>
         ${sum('t = 5: N = 25 × 243 = 6075')}`,
        `<p><strong>"When does it first pass 10 000?"</strong> Keep trying values of t.</p>
         ${sum('t = 5: 6075 (not yet)<br>t = 6: 25 × 729 = 18 225 ✓')}
         ${ans('225, 6075, 6 years')}`
      )}
      ${tip('3⁰ = 1, so at t = 0 the rule just gives the starting number.')}`,

    // y9-6C Q8: counting ways for a power of a power
    'y9-6c-count': `
      <p class="hp-tag">Worked example: if m and n are positive whole numbers, in how many ways can <b>(a<sup>m</sup>)<sup>n</sup> = a²⁷</b>?</p>
      ${steps(
        `<p><strong>Power of a power multiplies the indices,</strong> so m × n = 27.</p>`,
        `<p><strong>List the factor pairs of 27, both ways round.</strong></p>
         ${chips(['1 × 27'], ['3 × 9'], ['9 × 3'], ['27 × 1'])}
         ${ans('4')}`
      )}
      ${tip('Every factor of the index gives exactly one way, so you can also just count the factors.')}`,

    // y9-6C Q9: evaluating without a calculator
    'y9-6c-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>(5³)³ ÷ 5⁷</b> and <b>2((−3)³)² ÷ (−3)⁵</b>.</p>
      ${steps(
        `<p><strong>Simplify with the index laws first.</strong></p>
         ${sum('(5³)³ ÷ 5⁷ = 5⁹ ÷ 5⁷ = 5² = 25')}`,
        `<p><strong>Negative base: keep the bracket.</strong> An odd power stays negative.</p>
         ${sum('2 × (−3)⁶ ÷ (−3)⁵ = 2 × (−3)¹ = −6')}
         ${ans('25, -6')}`
      )}
      <p><strong>Powers of −1:</strong> ((−1)³)³ = (−1)⁹ = −1, since the index is odd. If every letter cancels, the answer is 1.</p>
      ${tip('Work out a number only at the very end, when the index is small.')}`,

    // y9-6C Q10: fixing mistakes
    'y9-6c-mistakes': `
      <p class="hp-tag">Worked example: each of these is wrong. Find the right answer.</p>
      ${table([['Wrong working', 'Mistake', 'Correct'], ['(y⁴)⁷ = y¹¹', 'power of a power: multiply', 'y²⁸'], ['3(x⁵)⁵ = 243x²⁵', 'the 3 is outside the bracket', '3x²⁵'], ['(4t)⁰ = 4', 'the whole bracket is powered', '1']])}
      ${steps(
        `<p><strong>Ask what each power belongs to.</strong> It acts on everything in its own bracket and nothing outside.</p>
         ${ans('y^28, 3x^25, 1')}`
      )}
      ${tip('Type powers with ^, like 3x^25.')}`,

    // y9-6C Q13: changing the base
    'y9-6c-base': `
      <p class="hp-tag">Worked example: write <b>9⁹</b> and <b>32⁷</b> using the smallest possible base.</p>
      ${steps(
        `<p><strong>Write the base as a power of a smaller number.</strong></p>
         ${sum('9 = 3² &nbsp; 32 = 2⁵')}`,
        `<p><strong>Use power of a power: multiply the indices.</strong></p>
         ${sum('9⁹ = (3²)⁹ = 3¹⁸<br>32⁷ = (2⁵)⁷ = 2³⁵')}
         ${ans('3^18, 2^35')}`
      )}
      ${tip('Go right down to a prime where you can: 64 is 2⁶, not 4³ or 8². A base like 10 cannot go smaller.')}`,

    // =====================================================================
    // Year 9 6D Index laws for brackets and fractions
    // =====================================================================
    // y9-6D Q1: expanding a bracket to a power
    'y9-6d-brackets': `
      <p class="hp-tag">Worked example: expand <b>(−4a⁷b)³</b>.</p>
      ${steps(
        `<p><strong>Every factor in the bracket gets the power,</strong> the number and its sign too.</p>
         ${sum('(−4)³ × (a⁷)³ × b³')}`,
        `<p><strong>Work out the number and multiply the indices.</strong> Three negatives make a negative.</p>
         ${sum('(−4)³ = −64 &nbsp; (a⁷)³ = a²¹<br>so (−4a⁷b)³ = −64a²¹b³')}
         ${ans('-64a^21b^3')}`
      )}
      <p><strong>A minus outside is not powered:</strong> (−6m)² = 36m², but −(6m)² = −36m².</p>
      ${tip('Type it number first, then each letter with its power: -64a^21b^3. Anything to the power 0 is 1, however long the bracket.')}`,

    // y9-6D Q2: simplifying with brackets and other factors
    'y9-6d-simplify': `
      <p class="hp-tag">Worked example: simplify <b>2a(7ab³)²</b> and <b>(10xy²)³ / x</b>.</p>
      ${steps(
        `<p><strong>Expand the bracket first.</strong></p>
         ${sum('(7ab³)² = 49a²b⁶ &nbsp; (10xy²)³ = 1000x³y⁶')}`,
        `<p><strong>Then multiply or divide what is left:</strong> numbers multiply, indices add or subtract.</p>
         ${sum('2a × 49a²b⁶ = 98a³b⁶<br>1000x³y⁶ / x = 1000x²y⁶')}
         ${ans('98a^3b^6, 1000x^2y^6')}`
      )}
      ${tip('Watch for a power like 3² inside the bracket: work it out (9) before you power the bracket. A minus inside the bracket and a minus outside are handled separately.')}`,

    // y9-6D Q3: a fraction to a power
    'y9-6d-fractions': `
      <p class="hp-tag">Worked example: expand <b>(7a³ / (10b²))²</b>.</p>
      ${steps(
        `<p><strong>Power the top and power the bottom.</strong></p>
         ${sum('(7a³)² / (10b²)²')}`,
        `<p><strong>Expand each bracket:</strong> every factor gets the power.</p>
         ${sum('49a⁶ / (100b⁴)')}
         ${ans('49a^6/(100b^4)')}`
      )}
      <p><strong>A negative top:</strong> an even power makes the answer positive, an odd power keeps it negative.</p>
      ${tip('If the bottom has more than one factor, put it in brackets when you type: 49a^6/(100b^4). A minus sign goes at the very front.')}`,

    // y9-6D Q4: multiplying and dividing fractions with powers
    'y9-6d-frac-mult': `
      <p class="hp-tag">Worked example: simplify <b>(x²/y)³ × (y⁴/x)²</b>.</p>
      ${steps(
        `<p><strong>Expand each bracket.</strong></p>
         ${sum('(x²/y)³ = x⁶/y³ &nbsp; (y⁴/x)² = y⁸/x²')}`,
        `<p><strong>Multiply tops and bottoms, then subtract indices of each letter.</strong></p>
         ${sum('x⁶y⁸ / (x²y³) = x⁴y⁵')}
         ${ans('x^4y^5')}`
      )}
      <p><strong>Dividing?</strong> Expand both, then flip the second fraction and multiply.</p>
      ${tip('If every letter ends up on top, type it with no slash, like x^4y^5. Otherwise type the bottom after /, in brackets if it has more than one factor.')}`,

    // y9-6D Q5: a rule with a fraction in a bracket
    'y9-6d-rule': `
      <p class="hp-tag">Worked example: the rule is <b>N = (t/2)⁴</b>.</p>
      ${steps(
        `<p><strong>Substitute, simplify inside the bracket, then power.</strong></p>
         ${sum('t = 10: N = (10/2)⁴ = 5⁴ = 625')}`,
        `<p><strong>Without brackets: power the top and the bottom.</strong></p>
         ${sum('N = t⁴/2⁴ = t⁴/16')}`,
        `<p><strong>Working backwards:</strong> which number to the power 4 gives 256? 4⁴ = 256, so t/2 = 4.</p>
         ${sum('t = 8')}
         ${ans('625, t^4/16, 8')}`
      )}
      ${tip('When asked for the rule without brackets, type only the right-hand side, like t^4/16.')}`,

    // y9-6D Q6: finding the value of a
    'y9-6d-find': `
      <p class="hp-tag">Worked example: find a (a &gt; 0) when <b>(5a)² = 400</b> and when <b>(a/7)² = 25/49</b>.</p>
      ${steps(
        `<p><strong>Undo the power first.</strong> Which positive number squares to 400? 20.</p>
         ${sum('5a = 20, so a = 4')}`,
        `<p><strong>For a fraction, undo the power on the top and bottom.</strong></p>
         ${sum('a/7 = 5/7, so a = 5')}
         ${ans('4, 5')}`
      )}
      ${tip('Undo a cube with a cube root and a square with a square root. Check by putting your answer back in.')}`,

    // y9-6D Q7: true or false with negative signs
    'y9-6d-signs': `
      <p class="hp-tag">Worked example: true or false? <b>(−5x)⁴ = −(5x)⁴</b> and <b>(−7/y)³ = −(7/y)³</b>.</p>
      ${steps(
        `<p><strong>Even power: the negative inside disappears.</strong></p>
         ${sum('(−5x)⁴ = 625x⁴ but −(5x)⁴ = −625x⁴')}
         <p>Different, so the first is <b>false</b>.</p>`,
        `<p><strong>Odd power: the negative inside stays.</strong></p>
         ${sum('(−7/y)³ = −343/y³ = −(7/y)³')}
         <p>The same, so the second is <b>true</b>.</p>
         ${ans('False, True')}`
      )}
      ${tip('Only the index matters: even makes the inside sign positive, odd keeps it. A minus outside the bracket is never powered.')}`,

    // y9-6D Q8: evaluating a quotient of powers
    'y9-6d-ratio': `
      <p class="hp-tag">Worked example: evaluate <b>14⁴/7⁴</b> and <b>5³/15³</b> without a calculator.</p>
      ${steps(
        `<p><strong>Same power on top and bottom: put the fraction in one bracket.</strong></p>
         ${sum('14⁴/7⁴ = (14/7)⁴ = 2⁴ = 16')}`,
        `<p><strong>Simplify inside the bracket before you power it.</strong></p>
         ${sum('5³/15³ = (5/15)³ = (1/3)³ = 1/27')}
         ${ans('16, 1/27')}`
      )}
      ${tip('This only works when the indices match. Type a fraction answer like 1/27.')}`,

    // y9-6D Q9: testing whether a statement is always true
    'y9-6d-test': `
      <p class="hp-tag">Worked example: is <b>(a + b)² = a² + b²</b> true? Test <b>a = 2, b = 6</b>.</p>
      ${steps(
        `<p><strong>Work out each side separately.</strong></p>
         ${sum('(2 + 6)² = 8² = 64<br>2² + 6² = 4 + 36 = 40')}`,
        `<p><strong>One example that fails is enough to say no.</strong> 64 ≠ 40, so it is not true for all values. Subtraction fails too: a = 6, b = 2 gives (6 − 2)² = 16 but 6² − 2² = 32.</p>
         ${ans('64, 40, No')}`,
        `<p><strong>Statements with signs:</strong> an even power removes a minus inside the bracket, an odd power keeps it, and a minus outside the bracket always stays.</p>
         ${sum('(−2)⁴ = 16 &nbsp; −(2⁴) = −16 &nbsp; (−2)³ = −(2³)')}`
      )}
      ${tip('The index laws work for multiplying and dividing inside a bracket, never for adding or subtracting. Type two values with a comma between them.')}`,

    // =====================================================================
    // Year 9 6E Negative indices
    // =====================================================================
    // y9-6E Q1: writing with positive indices
    'y9-6e-negative': `
      <p class="hp-tag">Worked example: write <b>6⁻²</b>, <b>7y⁻³</b>, <b>4x⁻²y³</b> and <b>5⁻¹x²y⁻³</b> with positive indices.</p>
      ${steps(
        `<p><strong>A negative index means one over the positive power.</strong> Like y²/y⁵ = y⁻³, which is 1/y³.</p>
         ${sum('6⁻² = 1/6² = 1/36')}`,
        `<p><strong>Only the part with the negative index moves to the bottom.</strong> The 7 has no negative index, so it stays on top.</p>
         ${sum('7y⁻³ = 7/y³ &nbsp; 4x⁻²y³ = 4y³/x²')}`,
        `<p><strong>Several negatives: they all go to the bottom together.</strong></p>
         ${sum('5⁻¹x²y⁻³ = x²/(5y³)')}
         ${ans('1/36, 7/y^3, 4y^3/x^2, x^2/(5y^3)')}`
      )}
      ${tip('Type the bottom in brackets when it has more than one factor: x^2/(5y^3). For a number, give its value as a fraction, like 1/36.')}`,

    // y9-6E Q2, Q3, Q4: negative indices on the bottom
    'y9-6e-bottom': `
      <p class="hp-tag">Worked example: write <b>7/x⁻³</b>, <b>2a⁻²/(5b⁻³c)</b> and <b>x⁻²/y⁻⁵</b> with positive indices.</p>
      ${steps(
        `<p><strong>A negative index on the bottom moves to the top</strong> and becomes positive. 1/x⁻³ is x³.</p>
         ${sum('7/x⁻³ = 7x³')}`,
        `<p><strong>Move only the parts with negative indices,</strong> each to the other side of the line.</p>
         ${sum('2a⁻²/(5b⁻³c) = 2b³/(5a²c)')}`,
        `<p><strong>Both negative? They swap places.</strong></p>
         ${sum('x⁻²/y⁻⁵ = y⁵/x²')}
         ${ans('7x^3, 2b^3/(5a^2c), y^5/x^2')}`
      )}
      <p><strong>With numbers:</strong> 5⁻²/2⁻¹ = 2/5² = 2/25.</p>
      ${tip('Numbers with no negative index (like the 2 and the 5 above) stay where they are. Type the bottom in brackets: 2b^3/(5a^2c).')}`,

    // y9-6E Q5, Q6: evaluating with negative indices
    'y9-6e-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>(−4)⁻³</b>, <b>12 × 6⁻²</b> and <b>7⁶ × 7⁻⁸</b>.</p>
      ${steps(
        `<p><strong>Write it with a positive index, then work it out.</strong> The bracket keeps the sign.</p>
         ${sum('(−4)⁻³ = 1/(−4)³ = 1/(−64) = −1/64')}`,
        `<p><strong>A number in front is not powered.</strong></p>
         ${sum('12 × 6⁻² = 12/36 = 1/3')}`,
        `<p><strong>Index laws first, then evaluate.</strong></p>
         ${sum('7⁶ × 7⁻⁸ = 7⁻² = 1/49')}
         ${ans('-1/64, 1/3, 1/49')}`
      )}
      <p><strong>A fraction to a negative power flips:</strong> (3/4)⁻² = (4/3)² = 16/9. <strong>Units:</strong> 2⁻⁸ kg = 1000/256 g = 3.90625 g, which is 3.91 g to two decimal places.</p>
      ${tip('Careful: −4⁻² means −(4⁻²) = −1/16, but (−4)⁻² = 1/16. Type the answer as a whole number or fraction, like -1/64.')}`,

    // y9-6E Q7, Q10: solving for an index
    'y9-6e-solve': `
      <p class="hp-tag">Worked example: solve <b>2<sup>x</sup> = 1/32</b>, <b>(0.1)<sup>x</sup> = 100</b>, <b>5<sup>x − 1</sup> = 625</b> and <b>8<sup>x</sup> = 4</b>.</p>
      ${steps(
        `<p><strong>Write both sides as powers of the same base,</strong> then match the indices.</p>
         ${sum('1/32 = 1/2⁵ = 2⁻⁵, so x = −5')}`,
        `<p><strong>A decimal base: write it as a negative power.</strong></p>
         ${sum('0.1 = 10⁻¹ and 100 = 10², so −x = 2, x = −2')}`,
        `<p><strong>The index can be an expression: set it equal and solve.</strong></p>
         ${sum('625 = 5⁴, so x − 1 = 4, x = 5<br>8 = 2³ and 4 = 2², so 3x = 2, x = 2/3')}
         ${ans('-5, -2, 5, 2/3')}`
      )}
      ${tip('Type just the value of x. A fraction answer is typed like 2/3, and a negative like -5.')}`,

    // y9-6E Q8: fixing mistakes
    'y9-6e-mistakes': `
      <p class="hp-tag">Worked example: each of these is wrong. Find the right answer.</p>
      ${table([['Wrong working', 'Mistake', 'Correct'], ['5x⁻³ = 1/(5x³)', 'only the x has the negative index', '5/x³'], ['6/y² = y⁻²/6', 'the 6 has no index to change', '6y⁻²'], ['2/(3x)⁻² = 2x²/9', 'the whole bracket moves up', '18x²']])}
      ${steps(
        `<p><strong>Ask which part the negative index belongs to.</strong> For the last one: 2/(3x)⁻² = 2 × (3x)² = 2 × 9x² = 18x².</p>
         ${ans('5/x^3, 6y^-2, 18x^2')}`
      )}
      ${tip('If the answer should keep a negative index, type it with ^-, like 6y^-2.')}`,

    // y9-6E Q9: a fraction to the power −1 (and other negative powers)
    'y9-6e-reciprocal': `
      <p class="hp-tag">Worked example: simplify <b>(5/8)⁻¹</b> and <b>(2/3)⁻³</b>.</p>
      ${steps(
        `<p><strong>Power −1 means one over it.</strong> Dividing by a fraction is multiplying by its flip.</p>
         ${sum('(5/8)⁻¹ = 1/(5/8) = 1 ÷ 5/8 = 1 × 8/5 = 8/5')}`,
        `<p><strong>Other negative powers: flip first, then power.</strong></p>
         ${sum('(2/3)⁻³ = (3/2)³ = 27/8')}
         ${ans('8/5, 27/8')}`
      )}
      <p><strong>So a power of −1 turns a fraction upside down</strong> (its reciprocal). With letters: (x/7)⁻¹ = 7/x.</p>
      ${tip('Type fractions like 8/5. When two fractions are asked for, put a comma between them.')}`,

    // =====================================================================
    // Year 9 6F Scientific notation
    // =====================================================================
    // y9-6F Q1, Q2, Q3, Q6: writing in scientific notation
    'y9-6f-to-sci': `
      <p class="hp-tag">Worked example: write <b>3 080 000</b> and <b>0.000 405</b> in scientific notation.</p>
      ${steps(
        `<p><strong>Put the point after the first non-zero digit.</strong> That gives a number from 1 up to (not including) 10.</p>
         ${sum('3.08 &nbsp; 4.05')}`,
        `<p><strong>Count how many places the point moved.</strong> Big numbers give a positive power, small numbers (less than 1) a negative one.</p>
         ${sum('3 080 000 = 3.08 × 10⁶ (6 places left)<br>0.000 405 = 4.05 × 10⁻⁴ (4 places right)')}
         ${ans('3.08 x 10^6, 4.05 x 10^-4')}`
      )}
      <p><strong>Words first:</strong> 29 hundreds = 2900 = 2.9 × 10³. A negative number keeps its sign: −290 000 = −2.9 × 10⁵.</p>
      ${tip('Type scientific notation like 3.08 x 10^6 or 4.05 x 10^-4. Drop zeros at the end of the decimal: 3.08, not 3.0800.')}`,

    // y9-6F Q4, Q5, Q7: back to decimal form
    'y9-6f-to-decimal': `
      <p class="hp-tag">Worked example: write <b>7.05 × 10⁵</b> and <b>9.3 × 10⁻⁴</b> as basic numerals.</p>
      ${steps(
        `<p><strong>Positive power: move the point right</strong> that many places, filling gaps with zeros.</p>
         ${sum('7.05 × 10⁵ = 705 000')}`,
        `<p><strong>Negative power: move the point left.</strong></p>
         ${sum('9.3 × 10⁻⁴ = 0.000 93')}
         ${ans('705000, 0.00093')}`
      )}
      ${tip('Check the size: a positive power gives a big number, a negative power gives a number less than 1. Type the number without spaces.')}`,

    // y9-6F Q8: unit prefixes
    'y9-6f-units': `
      <p class="hp-tag">Worked example: write <b>45 milliseconds</b> in seconds and <b>0.52 micrograms</b> in grams, in scientific notation.</p>
      ${steps(
        `<p><strong>Replace the prefix with its power of 10.</strong></p>
         ${table([['Prefix', 'Power'], ['tera, giga, mega', '10¹², 10⁹, 10⁶'], ['milli, micro, nano, pico', '10⁻³, 10⁻⁶, 10⁻⁹, 10⁻¹²']])}
         ${sum('45 ms = 45 × 10⁻³ s &nbsp; 0.52 µg = 0.52 × 10⁻⁶ g')}`,
        `<p><strong>Fix the front number so it is between 1 and 10,</strong> adjusting the power to match.</p>
         ${sum('45 × 10⁻³ = 4.5 × 10⁻²<br>0.52 × 10⁻⁶ = 5.2 × 10⁻⁷')}
         ${ans('4.5 x 10^-2, 5.2 x 10^-7')}`
      )}
      ${tip('Make the front number smaller and the power goes up; make it bigger and the power goes down. 3.6 gigabytes = 3.6 x 10^9 bytes.')}`,

    // y9-6F Q9, Q10, Q11: adding and subtracting
    'y9-6f-add': `
      <p class="hp-tag">Worked example: find <b>$4.8 billion + $350 million</b>, and <b>6.2 × 10⁻³ − 8.5 × 10⁻⁴</b>.</p>
      ${steps(
        `<p><strong>Write both with the same power of 10.</strong> A billion is 10⁹ and 350 million is 0.35 × 10⁹.</p>
         ${sum('4.8 × 10⁹ + 0.35 × 10⁹ = 5.15 × 10⁹')}`,
        `<p><strong>Same idea for small numbers.</strong></p>
         ${sum('6.2 × 10⁻³ − 0.85 × 10⁻³ = 5.35 × 10⁻³')}
         ${ans('5.15 x 10^9, 5.35 x 10^-3')}`
      )}
      ${tip('You cannot add the front numbers until the powers match. Or write both as basic numerals, subtract, and convert back.')}`,

    // y9-6F Q12: fixing a number that is not in scientific notation
    'y9-6f-adjust': `
      <p class="hp-tag">Worked example: write <b>83 × 10⁵</b>, <b>0.29 × 10⁴</b> and <b>450 × 10⁻⁵</b> in scientific notation.</p>
      ${steps(
        `<p><strong>Front number too big: divide it by 10 and add 1 to the power</strong> for each place.</p>
         ${sum('83 × 10⁵ = 8.3 × 10¹ × 10⁵ = 8.3 × 10⁶<br>450 × 10⁻⁵ = 4.5 × 10² × 10⁻⁵ = 4.5 × 10⁻³')}`,
        `<p><strong>Front number too small: multiply by 10 and take 1 from the power</strong> for each place.</p>
         ${sum('0.29 × 10⁴ = 2.9 × 10⁻¹ × 10⁴ = 2.9 × 10³')}
         ${ans('8.3 x 10^6, 2.9 x 10^3, 4.5 x 10^-3')}`
      )}
      ${tip('The value never changes, only how it is written. A number already between 1 and 10 can be written with 10^0, like 6 x 10^0.')}`,

    // y9-6F Q13: a power of a number in scientific notation
    'y9-6f-powers': `
      <p class="hp-tag">Worked example: simplify <b>(3 × 10⁴)²</b> and <b>(5 × 10⁻³)⁻²</b>.</p>
      ${steps(
        `<p><strong>Both parts get the power.</strong> Multiply the indices of the 10.</p>
         ${sum('(3 × 10⁴)² = 3² × 10⁸ = 9 × 10⁸')}`,
        `<p><strong>A negative power works the same way.</strong></p>
         ${sum('(5 × 10⁻³)⁻² = 5⁻² × 10⁶ = 1/25 × 10⁶<br>= 0.04 × 10⁶ = 4 × 10⁴')}
         ${ans('9 x 10^8, 4 x 10^4')}`
      )}
      ${tip('If the front number comes out bigger than 10 or less than 1, fix it at the end and adjust the power.')}`,

    // y9-6F Q14, Q15, Q16: multiplying and dividing
    'y9-6f-multiply': `
      <p class="hp-tag">Worked example: simplify <b>(7 × 10⁵) × (4 × 10³)</b> and <b>(9.6 × 10⁸) ÷ (3 × 10²)</b>.</p>
      ${steps(
        `<p><strong>Multiply the front numbers, add the powers of 10.</strong> Then fix the front number.</p>
         ${sum('7 × 4 = 28 &nbsp; 10⁵ × 10³ = 10⁸<br>28 × 10⁸ = 2.8 × 10⁹')}`,
        `<p><strong>Divide the front numbers, subtract the powers.</strong></p>
         ${sum('9.6 ÷ 3 = 3.2 &nbsp; 10⁸ ÷ 10² = 10⁶<br>= 3.2 × 10⁶')}
         ${ans('2.8 x 10^9, 3.2 x 10^6')}`
      )}
      <p><strong>Time = distance ÷ speed:</strong> sound at 3.4 × 10² m/s takes (1.7 × 10⁴) ÷ (3.4 × 10²) = 0.5 × 10² = 50 seconds to travel 1.7 × 10⁴ m. To change km to cm, multiply by 10⁵.</p>
      ${tip('Type answers like 2.8 x 10^9. When the question asks for an ordinary number (seconds, centimetres), type it without the power of 10.')}`,

    // =====================================================================
    // Year 9 6G Scientific notation using significant figures
    // =====================================================================
    // y9-6G Q1, Q2: counting significant figures
    'y9-6g-count': `
      <p class="hp-tag">Worked example: how many significant figures are in <b>20 409</b>, <b>0.000 708</b> and <b>9.02 × 10⁻⁶</b>?</p>
      ${steps(
        `<p><strong>Start counting at the first non-zero digit.</strong> Zeros in between other digits count.</p>
         ${sum('20 409 → 2, 0, 4, 0, 9 → 5')}`,
        `<p><strong>Zeros at the front of a decimal only hold places,</strong> so they do not count.</p>
         ${sum('0.000 708 → 7, 0, 8 → 3')}`,
        `<p><strong>Scientific notation: count the digits in the front number only.</strong></p>
         ${sum('9.02 × 10⁻⁶ → 9, 0, 2 → 3')}
         ${ans('5, 3, 3')}`
      )}
      ${tip('Zeros at the end of a whole number, like 4600, are usually just place holders, so 4600 has 2 significant figures.')}`,

    // y9-6G Q3, Q4, Q13: rounding to significant figures
    'y9-6g-round': `
      <p class="hp-tag">Worked example: write <b>628 470</b> with 3 significant figures and <b>0.007 095 1</b> with 2, in scientific notation.</p>
      ${steps(
        `<p><strong>Write it in scientific notation first.</strong></p>
         ${sum('628 470 = 6.2847 × 10⁵ &nbsp; 0.007 095 1 = 7.0951 × 10⁻³')}`,
        `<p><strong>Keep the right number of digits and look at the next one.</strong> 5 or more rounds up.</p>
         ${sum('6.28|47 → 6.28 × 10⁵<br>7.0|951 → 7.1 × 10⁻³')}
         ${ans('6.28 x 10^5, 7.1 x 10^-3')}`
      )}
      <p><strong>Rounding can roll over:</strong> 3.996 × 10⁴ to 3 significant figures is 4.00 × 10⁴.</p>
      ${tip('Keep zeros that are significant figures: 4.00 x 10^4 shows three of them. Type answers like 6.28 x 10^5.')}`,

    // y9-6G Q5, Q6, Q7, Q8, Q9: calculator work with significant figures
    'y9-6g-calc': `
      <p class="hp-tag">Worked example: evaluate <b>(2.5 × 10⁶ − 4.1 × 10⁴) / (6 × 10⁻³)</b> to 5 significant figures.</p>
      ${steps(
        `<p><strong>Put brackets around the whole top and the whole bottom</strong> on the calculator. Use the ×10ˣ (or EXP) key for each power of 10.</p>
         ${sum('(2.5×10⁶ − 4.1×10⁴) ÷ (6×10⁻³)')}`,
        `<p><strong>Read the full display, then round.</strong></p>
         ${sum('= 409 833 333.3...<br>= 4.098 333... × 10⁸ → 4.0983 × 10⁸')}
         ${ans('4.0983 x 10^8')}`
      )}
      <p><strong>Story questions:</strong> write each number in scientific notation, do the calculation in one go, and change units (m to km means ÷ 1000) before you round. A root works the same way: √(7.2 × 10⁵) = 848.528... = 8.4853 × 10² to 5 significant figures.</p>
      ${tip('Only round at the end. Rounding halfway through can change the last figure. Type it like 4.0983 x 10^8.')}`,

    // y9-6G Q10: ordering numbers
    'y9-6g-order': `
      <p class="hp-tag">Worked example: order from largest to smallest: A 4.1 × 10³, B 39 × 10², C 0.405 × 10⁴, D 4120.</p>
      ${steps(
        `<p><strong>Rewrite every number in proper scientific notation.</strong></p>
         ${sum('A 4.1 × 10³ &nbsp; B 3.9 × 10³ &nbsp; C 4.05 × 10³ &nbsp; D 4.12 × 10³')}`,
        `<p><strong>Compare the powers first, then the front numbers.</strong> Here all the powers match, so compare 4.12, 4.1, 4.05, 3.9.</p>
         ${ans('D, A, C, B')}`
      )}
      ${tip('A bigger power of 10 always wins, whatever the front number. Type the letters in order with commas.')}`,

    // y9-6G Q11, Q12: calculator displays
    'y9-6g-display': `
      <p class="hp-tag">Worked example: what numbers do the displays <b>4.6E7</b> and <b>2.05E−4</b> show?</p>
      ${steps(
        `<p><strong>E (or EXP) means "× 10 to the power".</strong></p>
         ${sum('4.6E7 = 4.6 × 10⁷ = 46 000 000<br>2.05E−4 = 2.05 × 10⁻⁴ = 0.000 205')}
         ${ans('46000000, 0.000205')}`,
        `<p><strong>Some screens show a small raised number instead,</strong> like 5.1⁰⁸. It still means 5.1 × 10⁸, not 5.1 to the power 8.</p>`
      )}
      ${tip('When you copy a display into your working, write the × 10 in: 5.1 x 10^8.')}`,

    // y9-6G Q14: two growing populations
    'y9-6g-growth': `
      <p class="hp-tag">Worked example: type A has <b>2.4 × 10⁹</b> cells and doubles every 6 hours. Type B has <b>7 × 10⁶</b> cells and triples every 12 hours. How many cells in total after 1 day?</p>
      ${steps(
        `<p><strong>Count the doublings and triplings in 24 hours.</strong></p>
         ${sum('A: 24 ÷ 6 = 4 doublings &nbsp; B: 24 ÷ 12 = 2 triplings')}`,
        `<p><strong>Multiply each start number.</strong></p>
         ${sum('A: 2.4 × 10⁹ × 2⁴ = 3.84 × 10¹⁰<br>B: 7 × 10⁶ × 3² = 6.3 × 10⁷')}`,
        `<p><strong>Add with matching powers, then round.</strong></p>
         ${sum('3.84 × 10¹⁰ + 0.0063 × 10¹⁰ = 3.8463 × 10¹⁰')}
         ${ans('3.85 x 10^10')}`
      )}
      ${tip('Adding a much smaller number can make almost no difference after rounding. Use the calculator power key for big counts like 2^40.')}`,

    // =====================================================================
    // Year 9 6H Fractional indices and surds
    // =====================================================================
    // y9-6H Q1, Q2: roots and fractional indices
    'y9-6h-roots': `
      <p class="hp-tag">Worked example: write <b>10<sup>1/2</sup></b> and <b>7<sup>1/3</sup></b> with a root sign, and <b>√19</b> and <b>⁶√5</b> in index form.</p>
      ${steps(
        `<p><strong>A power of 1/n means the nth root.</strong></p>
         ${sum('10<sup>1/2</sup> = √10 &nbsp; 7<sup>1/3</sup> = ∛7 (the cube root of 7)')}`,
        `<p><strong>Going the other way, the root number goes on the bottom of the fraction.</strong> A plain √ is a square root, so n = 2.</p>
         ${sum('√19 = 19<sup>1/2</sup> &nbsp; ⁶√5 = 5<sup>1/6</sup>')}
         ${ans('sqrt10, the cube root of 7, 1/2, 1/6')}`
      )}
      ${tip('Type a square root like sqrt10 or √10. When only the index is asked for, type the fraction, like 1/6.')}`,

    // y9-6H Q3, Q12: evaluating fractional indices
    'y9-6h-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>144<sup>1/2</sup></b>, <b>32<sup>1/5</sup></b> and <b>(144/169)<sup>1/2</sup></b>.</p>
      ${steps(
        `<p><strong>Turn the power into a root.</strong> Ask which number multiplies by itself that many times.</p>
         ${sum('144<sup>1/2</sup> = √144 = 12 &nbsp; (12 × 12 = 144)<br>32<sup>1/5</sup> = ⁵√32 = 2 &nbsp; (2 × 2 × 2 × 2 × 2 = 32)')}`,
        `<p><strong>A fraction: take the root of the top and the bottom.</strong></p>
         ${sum('(144/169)<sup>1/2</sup> = √144/√169 = 12/13')}
         ${ans('12, 2, 12/13')}`
      )}
      ${tip('It helps to know the squares up to 15² and the cubes up to 10³. Type fraction answers like 12/13.')}`,

    // y9-6H Q6, Q13: negative fractional indices
    'y9-6h-negative': `
      <p class="hp-tag">Worked example: evaluate <b>1000<sup>−1/3</sup></b> and <b>(1/32)<sup>−1/5</sup></b>.</p>
      ${steps(
        `<p><strong>The minus sign means one over.</strong> Deal with it first.</p>
         ${sum('1000<sup>−1/3</sup> = 1/1000<sup>1/3</sup>')}`,
        `<p><strong>Then the fraction means a root.</strong></p>
         ${sum('= 1/∛1000 = 1/10')}`,
        `<p><strong>A fraction to a negative power: same steps.</strong> One over, then the root, then tidy up one over a fraction.</p>
         ${sum('(1/32)<sup>−1/5</sup> = 1/(1/32)<sup>1/5</sup><br>= 1/(1/2) = 2')}
         ${ans('1/10, 2')}
         <p>One over a fraction just flips it, so once you are confident you can flip first: (1/32)<sup>−1/5</sup> = 32<sup>1/5</sup> = 2.</p>`
      )}
      ${tip('Rewrite the minus as one over first, then take the root. Type answers like 1/10.')}`,

    // y9-6H Q4, Q5, Q9: index laws with fractional indices
    'y9-6h-laws': `
      <p class="hp-tag">Worked example: simplify <b>x<sup>2/3</sup> × x<sup>1/2</sup></b>, <b>y<sup>5/6</sup> ÷ y<sup>1/3</sup></b> and <b>(z<sup>4/5</sup>)<sup>1/2</sup></b>.</p>
      ${steps(
        `<p><strong>Multiplying: add the indices.</strong> Use a common denominator.</p>
         ${sum('2/3 + 1/2 = 4/6 + 3/6 = 7/6, so x<sup>7/6</sup>')}`,
        `<p><strong>Dividing: subtract the indices.</strong></p>
         ${sum('5/6 − 1/3 = 5/6 − 2/6 = 3/6 = 1/2, so y<sup>1/2</sup>')}`,
        `<p><strong>Power of a power: multiply the indices.</strong></p>
         ${sum('4/5 × 1/2 = 4/10 = 2/5, so z<sup>2/5</sup>')}
         ${ans('x^(7/6), y^(1/2), z^(2/5)')}`
      )}
      <p><strong>Opposite indices cancel:</strong> w<sup>2/7</sup> × w<sup>−2/7</sup> = w⁰ = 1. An index that simplifies to 1 is just the letter.</p>
      ${tip('Type a fractional index in brackets: x^(7/6). Without them, x^7/6 means x⁷ divided by 6.')}`,

    // y9-6H Q7: Pythagoras with a surd answer
    'y9-6h-pythag': `
      <p class="hp-tag">Worked example: find the hypotenuse c as a surd.</p>
      ${fig({ kind: 'diagram', unit: 36, alt: 'Right-angled triangle with shorter sides 13 cm and 13 cm and hypotenuse c', items: [
        { poly: [[0, 0], [3, 0], [0, 3]], fill: true }, { angle: [0, 0, 0, 90], right: true },
        { label: '13', at: [1.5, -0.4] }, { label: '13', at: [-0.55, 1.5] }, { label: 'c', at: [1.8, 1.8] }] })}
      ${steps(
        `<p><strong>Use c² = a² + b².</strong></p>
         ${sum('c² = 13² + 13² = 169 + 169 = 338')}`,
        `<p><strong>Take the square root.</strong> 338 is not a square number, so leave the answer as a surd.</p>
         ${sum('c = √338')}
         ${ans('sqrt338')}`
      )}
      ${tip('Do not round: a surd is exact. In 6I you will learn to simplify surds like this one, and a simplified surd is marked right too. Type a surd like sqrt338 or √338.')}`,

    // y9-6H Q8: powers like 2/3
    'y9-6h-power-frac': `
      <p class="hp-tag">Worked example: evaluate <b>1000<sup>2/3</sup></b> and <b>32<sup>4/5</sup></b>.</p>
      ${steps(
        `<p><strong>The bottom of the fraction is the root. Do it first,</strong> so the numbers stay small.</p>
         ${sum('∛1000 = 10 &nbsp; ⁵√32 = 2')}`,
        `<p><strong>The top of the fraction is the power.</strong></p>
         ${sum('1000<sup>2/3</sup> = 10² = 100<br>32<sup>4/5</sup> = 2⁴ = 16')}
         ${ans('100, 16')}`
      )}
      ${tip('Root first, then power. Doing the power first gives the same answer, but with huge numbers.')}`,

    // y9-6H Q10: typing fractional indices on a calculator
    'y9-6h-calculator': `
      <p class="hp-tag">Worked example: why does typing <b>1000^1/3</b> give 333.33... instead of 10?</p>
      ${steps(
        `<p><strong>The calculator does powers before division.</strong> So it works out 1000¹, then divides by 3.</p>
         ${sum('1000^1/3 = 1000 ÷ 3 = 333.33...')}`,
        `<p><strong>Put the fraction in brackets</strong> so the whole fraction is the index.</p>
         ${sum('1000^(1/3) = ∛1000 = 10')}
         ${ans('brackets around the index')}`
      )}
      ${tip('Any index that is a fraction or a calculation needs brackets, on a calculator and when you type answers here.')}`,

    // y9-6H Q11: roots and powers undoing each other
    'y9-6h-undo': `
      <p class="hp-tag">Worked example: evaluate <b>√(17²)</b> and <b>(√13)²</b>, and simplify <b>⁴√(y⁴)</b> for y ≥ 0.</p>
      ${steps(
        `<p><strong>A square and a square root undo each other.</strong></p>
         ${sum('√(17²) = √289 = 17 &nbsp; (√13)² = √13 × √13 = 13')}`,
        `<p><strong>The same works for any root and the matching power.</strong> In index form, (y⁴)<sup>1/4</sup> = y¹.</p>
         ${sum('⁴√(y⁴) = y')}
         ${ans('17, 13, y')}`
      )}
      ${tip('This only works when the root and the power match, like a cube root with a cube. Type a letter answer as just the letter.')}`,

    // =====================================================================
    // Year 9 6I Simple operations with surds
    // =====================================================================
    // y9-6I Q1: collecting like surds
    'y9-6i-collect': `
      <p class="hp-tag">Worked example: simplify <b>5√6 − 2√6 + √3</b>.</p>
      ${steps(
        `<p><strong>Like surds have the same number under the root.</strong> Treat √6 like a letter: 5√6 − 2√6 is like 5x − 2x.</p>
         ${sum('5√6 − 2√6 = 3√6')}`,
        `<p><strong>Different surds cannot be combined.</strong> √3 stays as it is.</p>
         ${sum('3√6 + √3')}
         ${ans('3sqrt6+sqrt3')}`
      )}
      <p><strong>A surd on its own counts as 1 of it:</strong> √5 + 4√5 = 5√5, and 2√5 − 6√5 = −4√5.</p>
      ${tip('Type surds like 3sqrt6+sqrt3 (or 3√6+√3), in any order. Do not write a 1 in front: type sqrt3, not 1sqrt3.')}`,

    // y9-6I Q2: multiplying and dividing surds
    'y9-6i-multiply': `
      <p class="hp-tag">Worked example: simplify <b>√3 × √13</b>, <b>√32 × √2</b>, <b>√65 ÷ √5</b> and <b>√19 × √19</b>.</p>
      ${steps(
        `<p><strong>Multiply the numbers under the roots.</strong> √a × √b = √(ab).</p>
         ${sum('√3 × √13 = √39 &nbsp; √32 × √2 = √64 = 8')}`,
        `<p><strong>Dividing works the same way.</strong> √a ÷ √b = √(a ÷ b).</p>
         ${sum('√65 ÷ √5 = √13')}`,
        `<p><strong>A surd times itself is the number inside.</strong></p>
         ${sum('√19 × √19 = 19')}
         ${ans('sqrt39, 8, sqrt13, 19')}`
      )}
      ${tip('Always check whether the answer is a perfect square: √64 should be written as 8. Type surds like sqrt39.')}`,

    // y9-6I Q3: surds with whole numbers and surd fractions
    'y9-6i-frac': `
      <p class="hp-tag">Worked example: simplify <b>3 + 2√5 − 1</b> and <b>√6/2 + √6/5</b>.</p>
      ${steps(
        `<p><strong>Whole numbers combine with whole numbers, surds with like surds.</strong></p>
         ${sum('3 − 1 + 2√5 = 2 + 2√5')}`,
        `<p><strong>Surd fractions: use a common denominator,</strong> just like 1/2 + 1/5.</p>
         ${sum('√6/2 + √6/5 = 5√6/10 + 2√6/10')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('= 7√6/10')}
         ${ans('2+2sqrt5, 7sqrt6/10')}`
      )}
      ${tip('Type a surd fraction like 7sqrt6/10 (or 7√6/10). A whole surd is a fraction over 1: √6 = 10√6/10.')}`,

    // y9-6I Q4: multiplying and dividing surds with numbers in front
    'y9-6i-coeff': `
      <p class="hp-tag">Worked example: simplify <b>6√7 × 7√11</b>, <b>21√39 ÷ 7√3</b> and <b>3√30 ÷ 12√6</b>.</p>
      ${steps(
        `<p><strong>Multiply the outside numbers, then the surds.</strong></p>
         ${sum('6 × 7 = 42 &nbsp; √7 × √11 = √77<br>so 42√77')}`,
        `<p><strong>Dividing: outside numbers divide, surds divide.</strong></p>
         ${sum('21 ÷ 7 = 3 &nbsp; √39 ÷ √3 = √13<br>so 3√13')}`,
        `<p><strong>If the outside numbers do not divide, leave a fraction.</strong></p>
         ${sum('3/12 = 1/4 &nbsp; √30 ÷ √6 = √5<br>so √5/4')}
         ${ans('42sqrt77, 3sqrt13, sqrt5/4')}`
      )}
      ${tip('Type a surd over a number like sqrt5/4. Keep outside numbers and inside numbers apart: they never mix.')}`,

    // y9-6I Q5: expanding a bracket with surds
    'y9-6i-expand': `
      <p class="hp-tag">Worked example: expand and simplify <b>2√5(√13 + 4)</b> and <b>√17(2√17 − √3)</b>.</p>
      ${steps(
        `<p><strong>Multiply the outside term by each term in the bracket.</strong></p>
         ${sum('2√5 × √13 = 2√65 &nbsp; 2√5 × 4 = 8√5<br>so 2√65 + 8√5')}`,
        `<p><strong>A surd times itself becomes a whole number.</strong></p>
         ${sum('√17 × 2√17 = 2 × 17 = 34 &nbsp; √17 × √3 = √51<br>so 34 − √51')}
         ${ans('2sqrt65+8sqrt5, 34-sqrt51')}`
      )}
      ${tip('Keep the sign of each term in the bracket. Type the answer like 34-sqrt51, in any order.')}`,

    // y9-6I Q6: simplifying a surd
    'y9-6i-simplify': `
      <p class="hp-tag">Worked example: simplify <b>√72</b>.</p>
      ${steps(
        `<p><strong>Find the biggest square number that divides into 72.</strong> Squares: 4, 9, 16, 25, 36, 49, ...</p>
         ${chips(['72 ÷ 4 = 18'], ['72 ÷ 9 = 8'], ['72 ÷ 36 = 2', 'add'])}`,
        `<p><strong>Split the root and take the square root of the square.</strong></p>
         ${sum('√72 = √36 × √2 = 6√2')}
         ${ans('6sqrt2')}`
      )}
      <p><strong>Not the biggest square?</strong> √72 = √4 × √18 = 2√18 is not finished, because 18 still has the square factor 9. Keep going: 2 × 3√2 = 6√2.</p>
      ${tip('Simplest form means no square factor is left under the root. Type it like 6sqrt2.')}`,

    // y9-6I Q7: simplifying, then collecting
    'y9-6i-like': `
      <p class="hp-tag">Worked example: simplify <b>√32 + 3√2</b> and <b>2√75 − 4√3</b>.</p>
      ${steps(
        `<p><strong>Simplify each surd first</strong> so the numbers under the roots match.</p>
         ${sum('√32 = √16 × √2 = 4√2<br>2√75 = 2 × √25 × √3 = 2 × 5√3 = 10√3')}`,
        `<p><strong>Now collect like surds.</strong></p>
         ${sum('4√2 + 3√2 = 7√2<br>10√3 − 4√3 = 6√3')}
         ${ans('7sqrt2, 6sqrt3')}`
      )}
      ${tip('Surds that look different often match once simplified. Simplify the bigger number under the root.')}`,

    // y9-6I Q8: expanding two brackets with surds
    'y9-6i-binomial': `
      <p class="hp-tag">Worked example: expand <b>(√5 + 3)(√13 − 1)</b>, <b>(5 + √13)(5 − √13)</b> and <b>(√6 + 3)²</b>.</p>
      ${steps(
        `<p><strong>Multiply every term in the first bracket by every term in the second.</strong></p>
         ${sum('√5 × √13 − √5 × 1 + 3 × √13 − 3 × 1<br>= √65 − √5 + 3√13 − 3')}`,
        `<p><strong>Same terms with + and −: the middle terms cancel.</strong></p>
         ${sum('25 − 5√13 + 5√13 − 13 = 12')}`,
        `<p><strong>A square is two equal brackets.</strong></p>
         ${sum('(√6 + 3)(√6 + 3) = 6 + 3√6 + 3√6 + 9 = 15 + 6√6')}
         ${ans('sqrt65-sqrt5+3sqrt13-3, 12, 15+6sqrt6')}`
      )}
      ${tip('Collect the whole numbers into one term and like surds into one term. Type it like 15+6sqrt6.')}`,
  });
})();
