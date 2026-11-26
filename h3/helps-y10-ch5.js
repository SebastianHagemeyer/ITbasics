/* H3 help panels for Year 10 Chapter 5. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 5A to 5J. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // Area model for two brackets: top labels, side labels, then the four boxes.
  const grid = (top, side, cells) => fig({ kind: 'rect', cols: top.map(t => [t, t.length > 2 ? 3 : 2]), rows: side.map(s => [s, s.length > 2 ? 3 : 2]), cells });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 5A Expanding expressions
    // =====================================================================
    // y10-5A Q1, Q2: one term times a bracket
    // method: Example 1, 5A (distributive law, then collect like terms)
    'y10-5a-distribute': `
      <p class="hp-tag">Worked example: expand (a) <b>−4(x − 3)</b> (b) <b>5x(3 − x)</b> (c) <b>2x(x + 4) − x(3 − x)</b></p>
      ${steps(
        `<p><strong>Multiply the term outside by every term inside.</strong> Keep the sign with each term.</p>
         ${sum('(a) −4 × x = −4x, &nbsp; −4 × (−3) = +12, &nbsp; so −4x + 12<br>(b) 5x × 3 = 15x, &nbsp; 5x × (−x) = −5x², &nbsp; so 15x − 5x²')}`,
        `<p><strong>Two brackets: expand each one first, then collect like terms.</strong> Here −x × (−x) = +x².</p>
         ${sum(`2x² + 8x − 3x + x²<br>= ${now('3x² + 5x')}`)}
         ${ans('3x^2+5x')}`,
        `<p><strong>A fraction in front works the same way:</strong> (2/5)(15x − 4) = 6x − 8/5.</p>`
      )}
      ${tip('A negative in front changes the sign of every term in the bracket. Type x² as x^2 and fractions like 6x - 8/5.')}`,

    // y10-5A Q3: binomial products (x + a)(x + b)
    // method: Example 2a, 5A ((a + b)(c + d) = ac + ad + bc + bd)
    'y10-5a-binomial': `
      <p class="hp-tag">Worked example: expand <b>(x + 7)(x − 4)</b></p>
      ${grid(['x', '−4'], ['x', '+7'], [['x²', '−4x'], ['7x', '−28']])}
      ${steps(
        `<p><strong>Multiply each term in the first bracket by each term in the second.</strong></p>
         ${sum('x × x = x², &nbsp; x × (−4) = −4x<br>7 × x = 7x, &nbsp; 7 × (−4) = −28')}`,
        `<p><strong>Add the four parts and collect the x terms.</strong></p>
         ${sum(`x² − 4x + 7x − 28 = x² ${now('+ 3x')} − 28`)}
         ${ans('x^2+3x-28')}`,
        `<p><strong>Both negative?</strong> (x − 8)(x − 3) = x² − 3x − 8x + 24 = x² − 11x + 24. A negative times a negative is positive.</p>`
      )}
      ${tip('Four multiplications every time. Type the answer like x^2+3x-28.')}`,

    // y10-5A Q4: perfect squares and difference of two squares
    // method: Example 2b, 2c, 5A
    'y10-5a-squares': `
      <p class="hp-tag">Worked example: expand <b>(x − 3)²</b>, then <b>(4x + 1)(4x − 1)</b></p>
      ${steps(
        `<p><strong>A square is a bracket times itself.</strong></p>
         ${sum('(x − 3)² = (x − 3)(x − 3)<br>= x² − 3x − 3x + 9 = x² − 6x + 9')}
         <p>Or use (a − b)² = a² − 2ab + b² with a = x and b = 3: x² − 2(x)(3) + 3² = x² − 6x + 9.</p>
         ${ans('x^2-6x+9')}`,
        `<p><strong>Same terms, opposite signs: the middle terms cancel.</strong></p>
         ${sum(`(4x + 1)(4x − 1) = 16x² ${now('− 4x + 4x')} − 1 = 16x² − 1`)}
         <p>Or use (a + b)(a − b) = a² − b² with a = 4x and b = 1.</p>
         ${ans('16x^2-1')}`
      )}
      ${tip('(x − 3)² is not x² + 9: the middle term is always there. A difference of two squares like (x + 8)(x − 8) = x² − 64 has no middle term.')}`,

    // y10-5A Q5: binomial products with a number in front of x
    // method: Example 3a, 5A
    'y10-5a-nonmonic': `
      <p class="hp-tag">Worked example: expand <b>(4x − 3)(2x + 5)</b></p>
      ${grid(['2x', '+5'], ['4x', '−3'], [['8x²', '20x'], ['−6x', '−15']])}
      ${steps(
        `<p><strong>Multiply each pair.</strong> Numbers with numbers, letters with letters: 4x × 2x = 4 × 2 × x × x = 8x².</p>
         ${sum('4x × 2x = 8x², &nbsp; 4x × 5 = 20x<br>−3 × 2x = −6x, &nbsp; −3 × 5 = −15')}`,
        `<p><strong>Collect the x terms.</strong></p>
         ${sum(`8x² ${now('+ 20x − 6x')} − 15 = 8x² + 14x − 15`)}
         ${ans('8x^2+14x-15')}`,
        `<p><strong>Squares work the same way:</strong> (2x − 5)² = (2x − 5)(2x − 5) = 4x² − 10x − 10x + 25 = 4x² − 20x + 25.</p>`
      )}
      ${tip('Check with x = 1: (4 − 3)(2 + 5) = 7 and 8 + 14 − 15 = 7. If the two numbers differ, look for a sign slip.')}`,

    // y10-5A Q6: missing numbers in an expansion
    // method: Key ideas, 5A (expand the binomial product, then match terms); no worked example
    'y10-5a-missing': `
      <p class="hp-tag">Worked example: find the missing number. <b>(x + ?)(x + 5) = x² + 8x + 15</b></p>
      ${steps(
        `<p><strong>Expand with a box for the missing number.</strong></p>
         ${sum('(x + □)(x + 5) = x² + 5x + □x + 5 × □')}`,
        `<p><strong>Match the x terms.</strong> 5 + □ must make 8, so □ = 3.</p>`,
        `<p><strong>Check with the number term.</strong> 5 × 3 = 15 ✓</p>
         ${ans('3')}`
      )}
      <p><strong>With a minus:</strong> (x − ?)(x + 4) = x² − 3x − 28. The x terms are 4x − □x, so 4 − □ = −3 and □ = 7. Check: −7 × 4 = −28 ✓.</p>
      ${tip('Type just the missing number. The question already shows its sign, so type 7, not -7.')}`,

    // y10-5A Q7: a number times two brackets
    // method: Example 3b, 5A (expand the brackets, simplify, then multiply by the number)
    'y10-5a-three': `
      <p class="hp-tag">Worked example: expand <b>3(x − 4)(x + 1)</b></p>
      ${steps(
        `<p><strong>Expand the two brackets first.</strong></p>
         ${sum('3(x² + x − 4x − 4)')}`,
        `<p><strong>Simplify inside the bracket.</strong></p>
         ${sum('3(x² − 3x − 4)')}`,
        `<p><strong>Multiply every term by 3.</strong></p>
         ${sum('3x² − 9x − 12')}
         ${ans('3x^2-9x-12')}`
      )}
      <p><strong>A square with a negative in front:</strong> −3(x − 1)² = −3(x² − 2x + 1) = −3x² + 6x − 3. Expand the square before you multiply.</p>
      ${tip('Do not multiply the 3 into both brackets: it goes into one bracket only, or, more safely, into the answer at the end.')}`,

    // y10-5A Q8, Q11: expanding and simplifying combinations, and finding errors
    // method: Example 3c, 5A (expand each product, keep a bracket round the one being subtracted)
    'y10-5a-combine': `
      <p class="hp-tag">Worked example: expand and simplify <b>(x + 2)(x + 7) − (x − 2)(x − 4)</b></p>
      ${steps(
        `<p><strong>Expand each product on its own.</strong></p>
         ${sum('(x² + 7x + 2x + 14) − (x² − 4x − 2x + 8)<br>= (x² + 9x + 14) − (x² − 6x + 8)')}`,
        `<p><strong>Remove the brackets. The minus changes every sign in the second one.</strong></p>
         ${sum(`x² + 9x + 14 ${now('− x² + 6x − 8')}`)}`,
        `<p><strong>Collect like terms.</strong> The x² terms cancel.</p>
         ${sum('15x + 6')}
         ${ans('15x+6')}`
      )}
      <p><strong>A square and a number:</strong> (x + 5)² − 8 = x² + 10x + 25 − 8 = x² + 10x + 17. And 5 − (2x + 3)² = 5 − (4x² + 12x + 9) = −4x² − 12x − 4.</p>
      <p><strong>Finding an error:</strong> work it out yourself and compare. Someone wrote −3(x − 2) = −3x − 6, but −3 × (−2) = +6, so it should be −3x + 6.</p>
      ${tip('The usual mistakes: forgetting the middle term of a square, and not changing every sign after a minus.')}`,

    // y10-5A Q9: area of a picture inside a frame
    // method: Key ideas, 5A (distributive law); no worked example for frames
    'y10-5a-frame': `
      <p class="hp-tag">Worked example: a frame is <b>(x + 10) cm</b> long and <b>x cm</b> wide, with a border <b>1 cm</b> wide all the way round. Find the area of the picture.</p>
      ${fig({ kind: 'diagram', unit: 22, items: [{ poly: [[0, 0], [14, 0], [14, 7], [0, 7]] }, { poly: [[1, 1], [13, 1], [13, 6], [1, 6]], fill: true }, { label: 'picture', at: [7, 3.5] }, { dim: [13, 3.5, 14, 3.5], label: '1 cm', off: 0.5 }, { dim: [0, 0, 14, 0], label: '(x + 10) cm', off: -0.7 }, { dim: [14, 0, 14, 7], label: 'x cm', off: -0.8 }] })}
      ${steps(
        `<p><strong>Take the border off both ends of each side.</strong> That is 2 × 1 = 2 cm off every side.</p>
         ${sum('length: x + 10 − 2 = x + 8<br>width: x − 2')}`,
        `<p><strong>Area = length × width. Expand.</strong></p>
         ${sum('(x + 8)(x − 2) = x² − 2x + 8x − 16 = x² + 6x − 16')}
         ${ans('x^2+6x-16')}`
      )}
      ${tip('A square frame works the same way: a side of x with a border b gives a picture side of x − 2b. Draw the picture and label it before you expand.')}`,

    // y10-5A Q10: the distributive law for mental arithmetic
    // method: the question's own example (distributive law, Key ideas 5A); no worked example in the book
    'y10-5a-mental': `
      <p class="hp-tag">Worked example: work out <b>8 × 103</b> and <b>5 × 198</b> without a calculator.</p>
      ${steps(
        `<p><strong>Split the big number into an easy part and a small part.</strong></p>
         ${sum('8 × 103 = 8 × (100 + 3)')}`,
        `<p><strong>Multiply each part, then add.</strong></p>
         ${sum('8 × 100 + 8 × 3 = 800 + 24 = 824')}
         ${ans('824')}`,
        `<p><strong>Just under a round number? Subtract.</strong></p>
         ${sum('5 × 198 = 5 × (200 − 2) = 1000 − 10 = 990')}
         ${ans('990')}`
      )}
      ${tip('This is a(b + c) = ab + ac and a(b − c) = ab − ac with numbers. Pick the split that gives a round number, like 50 + 3 for 53.')}`,

    // y10-5A Q13: expanding three brackets
    // method: Example 3b, 5A order (expand two brackets first, then multiply by what is left); no cubic example
    'y10-5a-cubic': `
      <p class="hp-tag">Worked example: expand <b>(x + 2)(x + 3)(x − 1)</b></p>
      ${steps(
        `<p><strong>Expand two of the brackets first.</strong></p>
         ${sum('(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6')}`,
        `<p><strong>Multiply the whole result by the third bracket.</strong> First by x, then by −1.</p>
         ${sum('(x² + 5x + 6)(x − 1)<br>= x³ + 5x² + 6x − x² − 5x − 6')}`,
        `<p><strong>Collect like terms.</strong></p>
         ${sum('x³ + 4x² + x − 6')}
         ${ans('x^3+4x^2+x-6')}`
      )}
      ${tip('Three terms times two terms gives six products. Count them before collecting. Type x³ as x^3.')}`,

    // y10-5A Q14: an area found two ways
    // method: no book example; area of the whole minus the part, compared with adding the pieces
    'y10-5a-proof': `
      <p class="hp-tag">Worked example: a square of side <b>p</b> has a square of side <b>q</b> cut from one corner. Find the area left in two ways.</p>
      ${steps(
        `<p><strong>Way 1: outside area take away inside area.</strong></p>
         ${sum('p² − q²')}`,
        `<p><strong>Way 2: split what is left into pieces and add them.</strong> The L shape is a rectangle q by (p − q) and a rectangle p by (p − q).</p>
         ${sum('q(p − q) + p(p − q) = pq − q² + p² − pq = p² − q²')}`,
        `<p><strong>Both ways give the same expression</strong>, which is a good check.</p>
         ${ans('p^2-q^2')}`
      )}
      ${tip('For several identical shapes, find the area of one and multiply by how many there are. Expand any brackets and simplify before you type.')}`,

    // =====================================================================
    // Year 10 5B Factorising expressions
    // =====================================================================
    // y10-5B Q1: taking out common factors
    // method: Example 4a, 4b, 5B
    'y10-5b-common': `
      <p class="hp-tag">Worked example: factorise (a) <b>−5x − 15</b> (b) <b>12a² + 18a</b> (c) <b>6x²y − 9xy</b></p>
      ${steps(
        `<p><strong>Find the HCF of the terms, sign included.</strong> −5 goes into both −5x and −15.</p>
         ${sum('(a) −5x ÷ (−5) = x, &nbsp; −15 ÷ (−5) = 3, &nbsp; so −5(x + 3)')}`,
        `<p><strong>Include letters that are in every term.</strong> The HCF of 12a² and 18a is 6a.</p>
         ${sum('(b) 12a² ÷ 6a = 2a, &nbsp; 18a ÷ 6a = 3, &nbsp; so 6a(2a + 3)')}
         ${ans('6a(2a+3)')}`,
        `<p><strong>Two letters:</strong> both terms have 3, x and y, so take out 3xy.</p>
         ${sum('(c) 6x²y − 9xy = 3xy(2x − 3)')}`
      )}
      ${tip('Expand your answer to check it. Factorise fully: 3x(2xy − 3y) is not finished, because y is still common.')}`,

    // y10-5B Q2: a bracket as the common factor
    // method: Example 4c, 5B
    'y10-5b-binomial': `
      <p class="hp-tag">Worked example: factorise <b>5(x − 1) − y(x − 1)</b>, then <b>x(x + 8) − (x + 8)</b></p>
      ${steps(
        `<p><strong>The whole bracket (x − 1) is in both terms.</strong> Take it out like any common factor.</p>
         ${sum('5(x − 1) − y(x − 1) = (x − 1)(5 − y)')}
         ${ans('(x-1)(5-y)')}`,
        `<p><strong>A bracket on its own has a hidden 1 in front.</strong></p>
         ${sum('x(x + 8) − 1(x + 8) = (x + 8)(x − 1)')}
         ${ans('(x+8)(x-1)')}`
      )}
      ${tip('What is left over goes in the second bracket, signs included. Type the two brackets side by side, like (x+8)(x-1).')}`,

    // y10-5B Q3: difference of two squares
    // method: Example 5a, 5b, 5B
    'y10-5b-dops': `
      <p class="hp-tag">Worked example: factorise <b>x² − 81</b>, then <b>25a² − 4b²</b></p>
      ${steps(
        `<p><strong>Write each term as a square.</strong></p>
         ${sum('x² − 81 = (x)² − (9)²')}`,
        `<p><strong>Use a² − b² = (a + b)(a − b).</strong></p>
         ${sum('(x + 9)(x − 9)')}
         ${ans('(x+9)(x-9)')}`,
        `<p><strong>Numbers in front are squares too.</strong> 25a² = (5a)² and 4b² = (2b)².</p>
         ${sum('25a² − 4b² = (5a + 2b)(5a − 2b)')}`
      )}
      <p><strong>Number first?</strong> 49 − 9x² = (7)² − (3x)² = (7 + 3x)(7 − 3x).</p>
      ${tip('It only works for two squares with a minus between them. Type a product like (x+9)(x-9); the order of the brackets does not matter.')}`,

    // y10-5B Q4: common factor first, and a bracket squared
    // method: Example 5c, 5d, 5B
    'y10-5b-hcf-dops': `
      <p class="hp-tag">Worked example: factorise fully <b>3y² − 75</b>, then <b>(x + 1)² − 16</b></p>
      ${steps(
        `<p><strong>Take out the common factor first.</strong> 75 is not a square, but 75 ÷ 3 = 25 is.</p>
         ${sum('3y² − 75 = 3(y² − 25) = 3(y + 5)(y − 5)')}
         ${ans('3(y+5)(y-5)')}`,
        `<p><strong>Treat the bracket as a.</strong> Here a = x + 1 and b = 4.</p>
         ${sum('(x + 1)² − 4² = (x + 1 + 4)(x + 1 − 4)<br>= (x + 5)(x − 3)')}
         ${ans('(x+5)(x-3)')}`,
        `<p><strong>Both terms with x:</strong> (2x + 3)² − x² = (2x + 3 + x)(2x + 3 − x) = (3x + 3)(x + 3) = 3(x + 1)(x + 3).</p>`
      )}
      ${tip('Fully factorised means no bracket still has a common factor in it, so take 3 out of (3x + 3). Two letters work the same: 2a² − 32b² = 2(a + 4b)(a − 4b).')}`,

    // y10-5B Q5: difference of two squares with surds
    // method: Example 6, 5B
    'y10-5b-surds': `
      <p class="hp-tag">Worked example: factorise <b>x² − 19</b>, then <b>(x + 5)² − 2</b>, using surds.</p>
      ${steps(
        `<p><strong>Any positive number is a square of its square root.</strong> (√19)² = 19.</p>
         ${sum('x² − 19 = x² − (√19)²<br>= (x + √19)(x − √19)')}
         ${ans('(x+sqrt19)(x-sqrt19)')}`,
        `<p><strong>With a bracket:</strong> a = x + 5 and b = √2.</p>
         ${sum('(x + 5)² − (√2)² = (x + 5 + √2)(x + 5 − √2)')}
         ${ans('(x+5+sqrt2)(x+5-sqrt2)')}`
      )}
      ${tip('Type square roots with sqrt, like (x+5-sqrt2)(x+5+sqrt2). Keep the number from the bracket in both factors.')}`,

    // y10-5B Q6: factorising by grouping
    // method: Example 7, 5B
    'y10-5b-grouping': `
      <p class="hp-tag">Worked example: factorise <b>x² + 7x + ax + 7a</b> by grouping.</p>
      ${steps(
        `<p><strong>Factorise each pair of terms.</strong></p>
         ${sum('x² + 7x = x(x + 7)<br>ax + 7a = a(x + 7)')}`,
        `<p><strong>The brackets match, so take the bracket out.</strong></p>
         ${sum('x(x + 7) + a(x + 7) = (x + 7)(x + a)')}
         ${ans('(x+7)(x+a)')}`,
        `<p><strong>Second pair negative? Take out the negative.</strong></p>
         ${sum('x² − 5x − 2bx + 10b = x(x − 5) − 2b(x − 5)<br>= (x − 5)(x − 2b)')}`
      )}
      ${tip('If the two brackets do not match, try taking out the opposite sign from the second pair. Expand to check.')}`,

    // y10-5B Q7: rearrange, then group
    // method: Lesson starter and Example 7, 5B (rearrange the four terms, then group in pairs)
    'y10-5b-rearrange': `
      <p class="hp-tag">Worked example: factorise <b>xy − 12 + 3x − 4y</b></p>
      ${steps(
        `<p><strong>Reorder so each pair shares a factor.</strong> xy and 3x share x; −4y and −12 share −4.</p>
         ${sum('xy + 3x − 4y − 12')}`,
        `<p><strong>Factorise each pair.</strong></p>
         ${sum('x(y + 3) − 4(y + 3)')}`,
        `<p><strong>Take out the common bracket.</strong></p>
         ${sum('(y + 3)(x − 4)')}
         ${ans('(x-4)(y+3)')}`
      )}
      ${tip('Each term keeps its own sign when you move it. Pairing xy with −4y instead works too and gives the same answer.')}`,

    // y10-5B Q8: fractions, and a number in front of x² that is not a square
    // method: Example 6, 5B (write each term as a square, then a² − b²)
    'y10-5b-fractions': `
      <p class="hp-tag">Worked example: factorise <b>x² − 1/9</b>, then <b>3x² − 16</b></p>
      ${steps(
        `<p><strong>A fraction can be a square.</strong> 1/9 = (1/3)².</p>
         ${sum('x² − (1/3)² = (x − 1/3)(x + 1/3)')}
         ${ans('(x-1/3)(x+1/3)')}`,
        `<p><strong>3 is not a square number, but 3 = (√3)², so 3x² = (√3x)².</strong></p>
         ${sum('3x² − 16 = (√3x)² − 4²<br>= (√3x − 4)(√3x + 4)')}
         ${ans('(sqrt3x-4)(sqrt3x+4)')}`
      )}
      ${tip('If the minus comes first, like −16 + 3x², swap the terms to 3x² − 16 before you start. Type √3 times x as sqrt3x or √3x.')}`,

    // y10-5B Q9, Q10: simplifying the surds, and a common factor first
    // method: Example 6 and Example 5c, 5B
    'y10-5b-simplify-surds': `
      <p class="hp-tag">Worked example: factorise <b>x² − 45</b>, then <b>2x² − 16</b>, simplifying the surds.</p>
      ${steps(
        `<p><strong>Factorise with surds, then simplify.</strong> 45 = 9 × 5, so √45 = √9 × √5 = 3√5.</p>
         ${sum('x² − 45 = (x − √45)(x + √45)<br>= (x − 3√5)(x + 3√5)')}
         ${ans('(x-3sqrt5)(x+3sqrt5)')}`,
        `<p><strong>Common factor first.</strong> Then √8 = √4 × √2 = 2√2.</p>
         ${sum('2x² − 16 = 2(x² − 8)<br>= 2(x − 2√2)(x + 2√2)')}
         ${ans('2(x-2sqrt2)(x+2sqrt2)')}`,
        `<p><strong>With a bracket:</strong> 3(x + 5)² − 24 = 3((x + 5)² − 8) = 3(x + 5 − 2√2)(x + 5 + 2√2).</p>`
      )}
      ${tip('To simplify a surd, look for the biggest square factor: 4, 9, 16, 25, 36, 49. Type 3√5 as 3sqrt5.')}`,

    // y10-5B Q11: arithmetic with a difference of two squares
    // method: Example 5, 5B (a² − b² = (a + b)(a − b))
    'y10-5b-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>15² − 5²</b> and <b>41² − 39²</b> without a calculator.</p>
      ${steps(
        `<p><strong>Factorise as a difference of two squares.</strong></p>
         ${sum('15² − 5² = (15 + 5)(15 − 5)')}`,
        `<p><strong>Work out each bracket, then multiply.</strong></p>
         ${sum('20 × 10 = 200')}
         ${ans('200')}`,
        `<p><strong>Big numbers close together are where it really helps.</strong></p>
         ${sum('41² − 39² = (41 + 39)(41 − 39) = 80 × 2 = 160')}`
      )}
      ${tip('The brackets are the sum and the difference of the two numbers. That is much quicker than squaring both.')}`,

    // y10-5B Q12: a number minus a squared bracket
    // method: Example 5d, 5B (a² − b² with b a bracket), as in the question's example
    'y10-5b-bracket': `
      <p class="hp-tag">Worked example: factorise <b>9 − (x + 1)²</b>, then <b>25 − (x − 3)²</b></p>
      ${steps(
        `<p><strong>Here a = 3 and b = (x + 1).</strong> Put the bracket in whole.</p>
         ${sum('(3 − (x + 1))(3 + (x + 1))')}`,
        `<p><strong>Remove the inner brackets carefully.</strong> The minus applies to both x and 1.</p>
         ${sum('(3 − x − 1)(3 + x + 1) = (2 − x)(x + 4)')}
         ${ans('(2-x)(x+4)')}`,
        `<p><strong>A minus inside:</strong> −(x − 3) is −x + 3.</p>
         ${sum('(5 − (x − 3))(5 + (x − 3)) = (5 − x + 3)(5 + x − 3) = (8 − x)(x + 2)')}`
      )}
      ${tip('Write the inner brackets in full before removing them. Type a product like (2-x)(x+4).')}`,

    // y10-5B Q13: when is a squared bracket equal to the sum of squares?
    // method: Example 2b, 5A (expand the perfect square), then compare the two sides; no worked example
    'y10-5b-zero': `
      <p class="hp-tag">Worked example: for what value of x is <b>(x + 4)² = x² + 40</b>?</p>
      ${steps(
        `<p><strong>Expand the perfect square.</strong></p>
         ${sum('x² + 8x + 16 = x² + 40')}`,
        `<p><strong>Take x² off both sides.</strong></p>
         ${sum('8x + 16 = 40')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('8x = 24, &nbsp; x = 3')}
         ${ans('3')}`
      )}
      ${tip('Expand first, then compare the two sides term by term: whatever is the same on both sides can be taken away, and what is left is a simple equation.')}`,

    // y10-5B Q15: one squared bracket minus another
    // method: Example 5d, 5B (a² − b² with a and b both brackets)
    'y10-5b-two-squares': `
      <p class="hp-tag">Worked example: factorise <b>(x + 5)² − (x + 2)²</b> without expanding.</p>
      ${steps(
        `<p><strong>a = x + 5 and b = x + 2.</strong> Use a² − b² = (a + b)(a − b).</p>
         ${sum('(x + 5 + x + 2)(x + 5 − (x + 2))')}`,
        `<p><strong>Simplify each bracket.</strong> The minus changes both signs in x + 2.</p>
         ${sum('(2x + 7)(x + 5 − x − 2) = (2x + 7) × 3')}
         ${ans('3(2x+7)')}`,
        `<p><strong>Two letters:</strong> (2a + b)² − (a − b)² = (2a + b + a − b)(2a + b − a + b) = 3a(a + 2b).</p>`
      )}
      ${tip('If the second bracket cancels completely, the answer is a single term. Write any number factor in front, like 3(2x+7).')}`,

    // y10-5B Q16: grouping the squared terms as a difference of two squares
    // method: no book example; Key ideas 5B (difference of two squares, then a common bracket)
    'y10-5b-group-squares': `
      <p class="hp-tag">Worked example: factorise <b>x² − y² + 5x + 5y</b></p>
      ${steps(
        `<p><strong>Put the squared terms together and factorise them.</strong></p>
         ${sum('x² − y² = (x + y)(x − y)')}`,
        `<p><strong>Factorise the other pair.</strong></p>
         ${sum('5x + 5y = 5(x + y)')}`,
        `<p><strong>Take out the common bracket (x + y).</strong></p>
         ${sum('(x + y)(x − y) + 5(x + y) = (x + y)(x − y + 5)')}
         ${ans('(x+y)(x-y+5)')}`
      )}
      ${tip('The terms may be mixed up, like x² + 5y − y² + 5x. Reorder first: squares together, the other two together.')}`,

    // =====================================================================
    // Year 10 5C Multiplying and dividing algebraic fractions
    // =====================================================================
    // y10-5C Q1: cancelling single terms
    // method: Example 8a, 5C
    'y10-5c-cancel': `
      <p class="hp-tag">Worked example: simplify <b>21m²n / (7mn)</b>, then <b>−10pq / (25p²q)</b></p>
      ${steps(
        `<p><strong>Cancel the numbers, then each letter.</strong> 21 ÷ 7 = 3; m² ÷ m = m; n ÷ n = 1.</p>
         ${sum('21 × m × m × n / (7 × m × n) = 3m')}
         ${ans('3m')}`,
        `<p><strong>Letters left on the bottom stay on the bottom.</strong> 10 and 25 share 5, and p and q cancel once.</p>
         ${sum('−10pq / (25p²q) = −2 / (5p)')}
         ${ans('-2/(5p)')}`
      )}
      ${tip('Type one fraction with brackets round a bottom of more than one symbol: -2/(5p). Without them, -2/5p means -2/5 times p.')}`,

    // y10-5C Q2: factorise the top, then cancel
    // method: Example 8b, 5C
    'y10-5c-factor-cancel': `
      <p class="hp-tag">Worked example: simplify <b>(6x + 21)/3</b> and <b>(10 − 15y)/(−5)</b></p>
      ${steps(
        `<p><strong>Factorise the top, then cancel the common factor.</strong></p>
         ${sum('(6x + 21)/3 = 3(2x + 7)/3 = 2x + 7')}
         ${ans('2x+7')}`,
        `<p><strong>Dividing by a negative?</strong> Take the negative out of the top.</p>
         ${sum('(10 − 15y)/(−5) = −5(3y − 2)/(−5) = 3y − 2')}
         ${ans('3y-2')}`,
        `<p><strong>Letters as well:</strong> (6a + 9a²)/(12a) = 3a(2 + 3a)/(12a) = (2 + 3a)/4.</p>`
      )}
      ${tip('Never cancel part of a sum: in (6x + 21)/3 you cannot just cancel the 21 with the 3. Factorise first, then cancel whole factors.')}`,

    // y10-5C Q3, Q5: multiplying algebraic fractions
    // method: Example 9a, 5C (cancel common factors, then multiply tops and bottoms)
    'y10-5c-multiply': `
      <p class="hp-tag">Worked example: simplify <b>4x/(x + 1) × (x + 1)/10</b></p>
      ${steps(
        `<p><strong>Cancel any factor on a top with the same factor on a bottom.</strong> (x + 1) cancels, and 4 and 10 share 2.</p>
         ${sum('4x/(x + 1) × (x + 1)/10 = 2x/5')}
         ${ans('2x/5')}`,
        `<p><strong>Nothing cancels with a bracket? Just multiply.</strong></p>
         ${sum('(x − 6)/9 × 3/x = (x − 6)/(3x)')}`,
        `<p><strong>Area of a rectangle:</strong> length × width. A rectangle (x + 1)/6 m long and 9 m wide has area (x + 1)/6 × 9 = 3(x + 1)/2 m².</p>`
      )}
      ${tip('Cancel first and the numbers stay small. Type the answer as one fraction, with brackets round a top or bottom that has more than one term.')}`,

    // y10-5C Q4: dividing algebraic fractions
    // method: Example 9b, 5C (multiply by the reciprocal, factorise, cancel)
    'y10-5c-divide': `
      <p class="hp-tag">Worked example: simplify <b>(3x − 6)/5 ÷ (x − 2)/10</b></p>
      ${steps(
        `<p><strong>Multiply by the reciprocal of the second fraction.</strong></p>
         ${sum('(3x − 6)/5 × 10/(x − 2)')}`,
        `<p><strong>Factorise, then cancel.</strong> (x − 2) cancels, and 10 ÷ 5 = 2.</p>
         ${sum('3(x − 2)/5 × 10/(x − 2) = 3 × 2 = 6')}
         ${ans('6')}`,
        `<p><strong>Factorise the flipped one too:</strong> 2/(x + 4) ÷ 6/(3x + 12) = 2/(x + 4) × 3(x + 4)/6 = 6/6 = 1.</p>`
      )}
      ${tip('Only the fraction after the ÷ sign is flipped. Give a number answer in simplest form, like 8/7.')}`,

    // y10-5C Q6: factorise everything first
    // method: Example 9c, 5C
    'y10-5c-factorise': `
      <p class="hp-tag">Worked example: simplify <b>(x² − 49)/(2x − 14)</b>, then <b>(x² − 1)/x × 5x/(4x + 4)</b></p>
      ${steps(
        `<p><strong>Factorise the top and the bottom.</strong> x² − 49 is a difference of two squares.</p>
         ${sum('(x + 7)(x − 7) / (2(x − 7)) = (x + 7)/2')}
         ${ans('(x+7)/2')}`,
        `<p><strong>Factorise every part before cancelling.</strong></p>
         ${sum('(x + 1)(x − 1)/x × 5x/(4(x + 1))')}`,
        `<p><strong>Cancel (x + 1) and x, then multiply what is left.</strong></p>
         ${sum('5(x − 1)/4')}
         ${ans('5(x-1)/4')}`
      )}
      ${tip('For ÷, flip the second fraction first, then factorise and cancel. Only whole factors cancel.')}`,

    // y10-5C Q7: three fractions in a row
    // method: Example 9, 5C (flip after each ÷, cancel, then multiply)
    'y10-5c-three': `
      <p class="hp-tag">Worked example: simplify <b>x/3 × 6x/5 × 10/(4x)</b></p>
      ${steps(
        `<p><strong>Cancel across all three fractions.</strong> 6 with 3 leaves 2; 10 with 5 leaves 2.</p>
         ${sum('x/1 × 2x/1 × 2/(4x)')}`,
        `<p><strong>Multiply and simplify.</strong></p>
         ${sum('4x²/(4x) = x')}
         ${ans('x')}`,
        `<p><strong>With ÷ signs, flip every fraction that follows a ÷.</strong></p>
         ${sum('(2x + 6)/x ÷ (x + 3)/5 ÷ 1/2<br>= 2(x + 3)/x × 5/(x + 3) × 2/1 = 20/x')}`
      )}
      ${tip('Work left to right: change each ÷ into × the reciprocal before you cancel anything.')}`,

    // y10-5C Q8: a missing fraction
    // method: Key ideas, 5C (multiply by the reciprocal to undo ×); no worked example
    'y10-5c-missing': `
      <p class="hp-tag">Worked example: find the missing fraction. <b>(x + 3)/5 × □ = 2</b></p>
      ${steps(
        `<p><strong>Undo the ×: divide both sides by (x + 3)/5.</strong></p>
         ${sum('□ = 2 ÷ (x + 3)/5')}`,
        `<p><strong>Multiply by the reciprocal.</strong></p>
         ${sum('□ = 2 × 5/(x + 3) = 10/(x + 3)')}
         ${ans('10/(x+3)')}`,
        `<p><strong>Undo a ÷ by multiplying.</strong> □ ÷ x/4 = 3(x − 1)/x, so □ = 3(x − 1)/x × x/4 = 3(x − 1)/4.</p>`
      )}
      ${tip('Check by putting your fraction in the box: (x + 3)/5 × 10/(x + 3) = 10/5 = 2 ✓.')}`,

    // y10-5C Q9: squared brackets
    // method: Key ideas, 5C (a squared bracket is two copies of the bracket, then cancel common factors)
    'y10-5c-squared': `
      <p class="hp-tag">Worked example: simplify <b>4(x − 1)²/(2(x − 1))</b>, then <b>(2x + 8)²/(x + 4)</b></p>
      ${steps(
        `<p><strong>Write the square as two brackets.</strong> One copy cancels.</p>
         ${sum('4(x − 1)(x − 1)/(2(x − 1)) = 2(x − 1)')}
         ${ans('2(x-1)')}`,
        `<p><strong>Factorise inside the square first.</strong> 2x + 8 = 2(x + 4), and squaring squares the 2 as well.</p>
         ${sum('(2(x + 4))² = 4(x + 4)²<br>4(x + 4)²/(x + 4) = 4(x + 4)')}
         ${ans('4(x+4)')}`,
        `<p><strong>Square on the bottom:</strong> 7(x − 2)/(x − 2)² = 7/(x − 2).</p>`
      )}
      ${tip('(2x + 8)² is 4(x + 4)², not 2(x + 4)². Type a bracket on the bottom in brackets: 7/(x-2).')}`,

    // y10-5C Q11, Q12: brackets that are opposites
    // method: the question stems (1 − x = −(x − 1), and (a − b)² = (b − a)²); no worked example in the book
    'y10-5c-opposite': `
      <p class="hp-tag">Worked example: simplify <b>(3 − a)/2 × 8/(a − 3)</b></p>
      ${steps(
        `<p><strong>Turn the opposite bracket round.</strong> 3 − a = −(a − 3).</p>
         ${sum('−(a − 3)/2 × 8/(a − 3)')}`,
        `<p><strong>Cancel (a − 3), then multiply.</strong></p>
         ${sum('−8/2 = −4')}
         ${ans('-4')}`,
        `<p><strong>A squared bracket turns round with no sign change</strong>, because (6 − x)² = (x − 6)².</p>
         ${sum('(4x − 24)/(6 − x)² = 4(x − 6)/(x − 6)² = 4/(x − 6)')}`
      )}
      ${tip('a − b and b − a are opposites, so their quotient is −1. A square hides the sign, so (6 − x)² and (x − 6)² are equal.')}`,

    // =====================================================================
    // Year 10 5D Factorising monic quadratic trinomials
    // =====================================================================
    // y10-5D Q1: x² + bx + c
    // method: Example 10a, 10b, 5D
    'y10-5d-monic': `
      <p class="hp-tag">Worked example: factorise <b>x² + 10x + 16</b>, then <b>x² − 3x − 28</b></p>
      ${grid(['x', '+8'], ['x', '+2'], [['x²', '8x'], ['2x', '16']])}
      ${steps(
        `<p><strong>Find two numbers that multiply to the last term and add to the middle number.</strong> Pairs for 16: 1 and 16, 2 and 8, 4 and 4. Only 2 + 8 = 10.</p>
         ${ans('(x+2)(x+8)')}`,
        `<p><strong>Last term negative: one number is positive, one negative.</strong></p>
         ${sum('−7 × 4 = −28 ✓ &nbsp; −7 + 4 = −3 ✓')}
         ${ans('(x-7)(x+4)')}`,
        `<p><strong>Last term positive, middle negative: both numbers negative.</strong> x² − 11x + 24: −3 × (−8) = 24 and −3 + (−8) = −11, so (x − 3)(x − 8).</p>`
      )}
      ${tip('Check by expanding: (x − 7)(x + 4) = x² + 4x − 7x − 28 ✓. Type a product of brackets, like (x-7)(x+4).')}`,

    // y10-5D Q2: common factor first
    // method: Example 10c, 5D
    'y10-5d-common': `
      <p class="hp-tag">Worked example: factorise <b>2x² − 2x − 24</b></p>
      ${steps(
        `<p><strong>Take out the common factor first.</strong></p>
         ${sum('2(x² − x − 12)')}`,
        `<p><strong>Factorise the bracket.</strong> Multiply to −12 and add to −1: −4 and 3.</p>
         ${sum('−4 × 3 = −12 ✓ &nbsp; −4 + 3 = −1 ✓')}`,
        `<p><strong>Keep the 2 in front.</strong></p>
         ${ans('2(x-4)(x+3)')}`
      )}
      <p><strong>Negative x² term:</strong> take out the negative number, so the bracket starts with +x². −4x² − 4x + 24 = −4(x² + x − 6) = −4(x + 3)(x − 2).</p>
      ${tip('Taking out a negative flips every sign in the bracket. Type the number in front, like -4(x+3)(x-2).')}`,

    // y10-5D Q3: perfect squares
    // method: Example 10d, 5D
    'y10-5d-square': `
      <p class="hp-tag">Worked example: factorise <b>x² − 24x + 144</b>, then <b>5x² + 30x + 45</b></p>
      ${steps(
        `<p><strong>Two numbers that multiply to 144 and add to −24:</strong> −12 and −12.</p>
         ${sum('(x − 12)(x − 12) = (x − 12)²')}
         ${ans('(x-12)^2')}`,
        `<p><strong>Common factor first.</strong></p>
         ${sum('5x² + 30x + 45 = 5(x² + 6x + 9)')}`,
        `<p><strong>3 and 3</strong> multiply to 9 and add to 6.</p>
         ${ans('5(x+3)^2')}`
      )}
      ${tip('Spot a perfect square: the last term is a square number and the middle number is twice its square root. Type it with ^2, like (x-12)^2.')}`,

    // y10-5D Q4, Q9: factorise, then cancel
    // method: Example 11a, 5D
    'y10-5d-cancel': `
      <p class="hp-tag">Worked example: simplify <b>(x² + x − 30)/(x + 6)</b> and <b>(x + 1)/(x² − 7x − 8)</b></p>
      ${steps(
        `<p><strong>Factorise the trinomial, then cancel the common bracket.</strong></p>
         ${sum('(x + 6)(x − 5)/(x + 6) = x − 5')}
         ${ans('x-5')}`,
        `<p><strong>If everything on top cancels, a 1 is left.</strong></p>
         ${sum('(x + 1)/((x − 8)(x + 1)) = 1/(x − 8)')}
         ${ans('1/(x-8)')}`,
        `<p><strong>A perfect square cancels with one of its own factors.</strong></p>
         ${sum('(x² + 10x + 25)/(x + 5) = (x + 5)²/(x + 5) = x + 5<br>(2x − 2)/(x² − 2x + 1) = 2(x − 1)/(x − 1)² = 2/(x − 1)')}`
      )}
      ${tip('Factorise the top and the bottom fully before you cancel anything. Type a bottom with more than one term in brackets: 1/(x-8).')}`,

    // y10-5D Q5, Q8: multiplying fractions with quadratics
    // method: Example 11b, 5D (factorise every top and bottom, cancel, multiply)
    'y10-5d-multiply': `
      <p class="hp-tag">Worked example: simplify <b>(x² − 49)/(x² + 4x − 21) × (x − 3)/(4x − 28)</b></p>
      ${steps(
        `<p><strong>Factorise every top and bottom.</strong></p>
         ${sum('x² − 49 = (x − 7)(x + 7)<br>x² + 4x − 21 = (x + 7)(x − 3)<br>4x − 28 = 4(x − 7)')}`,
        `<p><strong>Cancel matching brackets.</strong> (x + 7), (x − 3) and (x − 7) each appear on a top and a bottom.</p>
         ${sum('(x − 7)(x + 7)/((x + 7)(x − 3)) × (x − 3)/(4(x − 7))')}`,
        `<p><strong>Write what is left.</strong></p>
         ${ans('1/4')}`
      )}
      ${tip('A formula in another letter, like t, works exactly the same way. Type the final fraction with brackets where needed.')}`,

    // y10-5D Q6: fractions with surds
    // method: Example 11a, 5D, with the surd difference of two squares from Example 6, 5B
    'y10-5d-surd': `
      <p class="hp-tag">Worked example: simplify <b>(x² − 5)/(x + √5)</b>, then <b>(√2x − 3)/(2x² − 9)</b></p>
      ${steps(
        `<p><strong>Factorise the difference of two squares with surds.</strong></p>
         ${sum('(x + √5)(x − √5)/(x + √5) = x − √5')}
         ${ans('x-sqrt5')}`,
        `<p><strong>2x² = (√2x)², so the bottom factorises too.</strong></p>
         ${sum('(√2x − 3)/((√2x − 3)(√2x + 3)) = 1/(√2x + 3)')}
         ${ans('1/(sqrt2x+3)')}`,
        `<p><strong>With a bracket:</strong> ((x − 1)² − 6)/(x − 1 + √6) = (x − 1 + √6)(x − 1 − √6)/(x − 1 + √6) = x − 1 − √6.</p>`
      )}
      ${tip('Type square roots with sqrt, like x - sqrt5 or 1/(sqrt2x + 3).')}`,

    // y10-5D Q7, Q11: dividing fractions with quadratics
    // method: Example 11, 5D, with multiplying by the reciprocal (Example 9b, 5C)
    'y10-5d-divide': `
      <p class="hp-tag">Worked example: simplify <b>(x² + 11x + 28)/(x² − 81) ÷ (x + 4)/(3x − 27)</b></p>
      ${steps(
        `<p><strong>Flip the second fraction and multiply.</strong></p>
         ${sum('(x² + 11x + 28)/(x² − 81) × (3x − 27)/(x + 4)')}`,
        `<p><strong>Factorise everything.</strong></p>
         ${sum('(x + 4)(x + 7)/((x − 9)(x + 9)) × 3(x − 9)/(x + 4)')}`,
        `<p><strong>Cancel and write what is left.</strong></p>
         ${ans('3(x+7)/(x+9)')}`
      )}
      <p><strong>Two letters:</strong> the same patterns work. (p² − q²)/(p² + pq) = (p − q)(p + q)/(p(p + q)) = (p − q)/p. Also p² + 2pq + q² = (p + q)² and p² − 2pq + q² = (p − q)².</p>
      ${tip('Flip only after the ÷ sign, then factorise and cancel. A bracket squared over the same bracket squared cancels to 1.')}`,

    // y10-5D Q12: adding and subtracting with factorised denominators
    // method: no 5D example; lowest common denominator, as for algebraic fractions in Year 9
    'y10-5d-addsub': `
      <p class="hp-tag">Worked example: write <b>2/(x − 1) + x/(x² + 2x − 3)</b> as a single fraction.</p>
      ${steps(
        `<p><strong>Factorise the denominators.</strong></p>
         ${sum('x² + 2x − 3 = (x + 3)(x − 1)')}`,
        `<p><strong>The LCD is (x − 1)(x + 3).</strong> Only the first fraction needs changing.</p>
         ${sum('2(x + 3)/((x − 1)(x + 3)) + x/((x − 1)(x + 3))')}`,
        `<p><strong>Add the tops and simplify.</strong></p>
         ${sum('(2x + 6 + x)/((x − 1)(x + 3)) = 3(x + 2)/((x − 1)(x + 3))')}
         ${ans('3(x+2)/((x-1)(x+3))')}`
      )}
      ${tip('When subtracting, put the second top in brackets so the minus reaches every term. Type the whole bottom in brackets: 3(x+2)/((x-1)(x+3)).')}`,

    // =====================================================================
    // Year 10 5E Factorising non-monic quadratic trinomials (10A)
    // =====================================================================
    // y10-5E Q1, Q2, Q3: ax² + bx + c by grouping
    // method: Example 12a, 12b, 5E
    'y10-5e-ac': `
      <p class="hp-tag">Worked example: factorise <b>6x² + 13x + 5</b></p>
      ${steps(
        `<p><strong>Multiply a × c.</strong> 6 × 5 = 30. Find two numbers that multiply to 30 and add to 13.</p>
         ${sum('3 × 10 = 30 ✓ &nbsp; 3 + 10 = 13 ✓')}`,
        `<p><strong>Split the middle term using them.</strong></p>
         ${sum('6x² + 3x + 10x + 5')}`,
        `<p><strong>Group in pairs and take out the bracket.</strong></p>
         ${sum('3x(2x + 1) + 5(2x + 1) = (2x + 1)(3x + 5)')}
         ${ans('(2x+1)(3x+5)')}`
      )}
      <p><strong>A negative term:</strong> 6x² + x − 15 has a × c = −90. 10 × (−9) = −90 and 10 + (−9) = 1, so 6x² + 10x − 9x − 15 = 2x(3x + 5) − 3(3x + 5) = (3x + 5)(2x − 3).</p>
      ${tip('With big products, list the factor pairs in order so none is missed. Expand your answer to check. Type (2x+1)(3x+5).')}`,

    // y10-5E Q4: common factor first
    // method: Example 10c, 5D (common factor first), then Example 12, 5E
    'y10-5e-common': `
      <p class="hp-tag">Worked example: factorise <b>4x² − 2x − 6</b></p>
      ${steps(
        `<p><strong>Take out the common factor.</strong></p>
         ${sum('2(2x² − x − 3)')}`,
        `<p><strong>Factorise the bracket by grouping.</strong> a × c = 2 × (−3) = −6, and −3 + 2 = −1.</p>
         ${sum('2x² − 3x + 2x − 3 = x(2x − 3) + 1(2x − 3) = (2x − 3)(x + 1)')}`,
        `<p><strong>Keep the 2 in front.</strong></p>
         ${ans('2(2x-3)(x+1)')}`
      )}
      <p><strong>Negative x² term:</strong> −6x² − 9x + 6 = −3(2x² + 3x − 2) = −3(x + 2)(2x − 1).</p>
      ${tip('If you skip the common factor, a bracket still has a factor inside it and the answer is not fully factorised.')}`,

    // y10-5E Q5: a factorised height model
    // method: Example 12, 5E (factorise), then substitute; part d uses the fact that a product is 0 only when a factor is 0
    'y10-5e-context': `
      <p class="hp-tag">Worked example: a cable's height above a pond is <b>h = 2x² − 7x + 3</b> metres, x metres from one bank.</p>
      ${steps(
        `<p><strong>Factorise.</strong> a × c = 6: −1 × (−6) = 6 and −1 + (−6) = −7.</p>
         ${sum('2x² − x − 6x + 3 = x(2x − 1) − 3(2x − 1) = (2x − 1)(x − 3)')}
         ${ans('(2x-1)(x-3)')}`,
        `<p><strong>Substitute.</strong> At x = 2:</p>
         ${sum('(4 − 1)(2 − 3) = 3 × (−1) = −3')}
         <p>A negative height means the cable is 3 m below the water surface there.</p>`,
        `<p><strong>At the water surface, h = 0.</strong> A product is 0 only when one factor is 0.</p>
         ${sum('2x − 1 = 0 or x − 3 = 0<br>x = 1/2 or x = 3')}
         ${ans('1/2, 3')}`
      )}
      ${tip('Substitute into either form as a check: 2(4) − 7(2) + 3 = −3 ✓. Type two answers separated by a comma.')}`,

    // y10-5E Q6, Q7: fractions with non-monic quadratics
    // method: Example 13, 5E (factorise all quadratics, cancel)
    'y10-5e-fraction': `
      <p class="hp-tag">Worked example: simplify <b>(6x² + 7x − 3)/(2x + 3)</b></p>
      ${steps(
        `<p><strong>Factorise the top.</strong> a × c = −18: 9 × (−2) = −18 and 9 + (−2) = 7.</p>
         ${sum('6x² + 9x − 2x − 3 = 3x(2x + 3) − 1(2x + 3) = (2x + 3)(3x − 1)')}`,
        `<p><strong>Cancel the common bracket.</strong></p>
         ${sum('(2x + 3)(3x − 1)/(2x + 3) = 3x − 1')}
         ${ans('3x-1')}`,
        `<p><strong>Several fractions:</strong> factorise every part with whatever method fits, then cancel.</p>
         ${sum('(4x² − 1)/(2x² + 5x + 2) × (x + 2)/(6x − 3)<br>= (2x − 1)(2x + 1)/((2x + 1)(x + 2)) × (x + 2)/(3(2x − 1)) = 1/3')}`
      )}
      ${tip('Check each part for a common factor, a difference of two squares, or a trinomial. For ÷, flip the second fraction first.')}`,

    // y10-5E Q8: a negative x² term, factorised into the form (p − qx)(rx + s)
    // method: the question's own example form; take out −1, factorise by Example 12, 5E, then turn one bracket round
    'y10-5e-negative': `
      <p class="hp-tag">Worked example: factorise <b>−8x² + 2x + 3</b></p>
      ${steps(
        `<p><strong>Take out −1.</strong> Every sign in the bracket flips.</p>
         ${sum('−(8x² − 2x − 3)')}`,
        `<p><strong>Factorise the bracket.</strong> a × c = −24: −6 × 4 = −24 and −6 + 4 = −2.</p>
         ${sum('8x² − 6x + 4x − 3 = 2x(4x − 3) + 1(4x − 3) = (4x − 3)(2x + 1)')}`,
        `<p><strong>Put the minus into one bracket.</strong> −(4x − 3) = 3 − 4x.</p>
         ${sum('−(4x − 3)(2x + 1) = (3 − 4x)(2x + 1)')}
         ${ans('(3-4x)(2x+1)')}`
      )}
      ${tip('Expand to check: (3 − 4x)(2x + 1) = 6x + 3 − 8x² − 4x = −8x² + 2x + 3 ✓.')}`,

    // y10-5E Q10: adding and subtracting with factorised denominators
    // method: no 5E example; lowest common denominator, as for algebraic fractions in Year 9
    'y10-5e-addsub': `
      <p class="hp-tag">Worked example: write <b>1/(2x + 1) + x/(4x² − 1)</b> as a single fraction.</p>
      ${steps(
        `<p><strong>Factorise the denominators.</strong></p>
         ${sum('4x² − 1 = (2x − 1)(2x + 1)')}`,
        `<p><strong>Use the LCD (2x − 1)(2x + 1).</strong> Multiply the first top and bottom by (2x − 1).</p>
         ${sum('(2x − 1)/((2x − 1)(2x + 1)) + x/((2x − 1)(2x + 1))')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('(3x − 1)/((2x − 1)(2x + 1))')}
         ${ans('(3x-1)/((2x-1)(2x+1))')}`
      )}
      ${tip('The LCD uses each different bracket once. Leave the bottom factorised and put the whole bottom in brackets when you type it.')}`,

    // =====================================================================
    // Year 10 5F Factorising by completing the square
    // =====================================================================
    // y10-5F Q1: what to add to complete the square
    // method: Example 14, 5F
    'y10-5f-add': `
      <p class="hp-tag">Worked example: what must be added to <b>x² + 18x</b>, and to <b>x² − 9x</b>, to complete the square?</p>
      ${steps(
        `<p><strong>For x² + bx, add (b/2)².</strong> Here b = 18.</p>
         ${sum('(18/2)² = 9² = 81<br>x² + 18x + 81 = (x + 9)²')}
         ${ans('(x+9)^2')}`,
        `<p><strong>An odd b gives a fraction.</strong> Here b = −9.</p>
         ${sum('(−9/2)² = 81/4<br>x² − 9x + 81/4 = (x − 9/2)²')}
         ${ans('(x-9/2)^2')}`
      )}
      ${tip('The number in the bracket is half of b, sign included. Type the perfect square like (x-9/2)^2.')}`,

    // y10-5F Q2, Q3: factorising by completing the square
    // method: Example 15a, 15b, 5F
    'y10-5f-factorise': `
      <p class="hp-tag">Worked example: factorise <b>x² − 14x + 46</b> by completing the square.</p>
      ${steps(
        `<p><strong>Add (b/2)² to complete the square, and take it away to balance.</strong> (−14/2)² = 49.</p>
         ${sum('(x² − 14x + 49) − 49 + 46')}`,
        `<p><strong>Factorise the perfect square and simplify.</strong></p>
         ${sum('(x − 7)² − 3')}`,
        `<p><strong>Write 3 as (√3)² and use a² − b² = (a + b)(a − b).</strong></p>
         ${sum('(x − 7)² − (√3)² = (x − 7 − √3)(x − 7 + √3)')}
         ${ans('(x-7-sqrt3)(x-7+sqrt3)')}`
      )}
      <p><strong>Not possible:</strong> x² − 14x + 52 = (x − 7)² − 49 + 52 = (x − 7)² + 3. That is a sum, not a difference of two squares, so it cannot be factorised. <strong>Simplify the surd</strong> if you can: x² − 14x + 31 = (x − 7)² − 18 = (x − 7 − 3√2)(x − 7 + 3√2).</p>
      ${tip('Type square roots with sqrt. If you end with + a number after the square, type not possible.')}`,

    // y10-5F Q4: half of an odd number
    // method: Example 16a, 5F
    'y10-5f-fraction': `
      <p class="hp-tag">Worked example: factorise <b>x² + 11x + 4</b> by completing the square.</p>
      ${steps(
        `<p><strong>Add and subtract (11/2)², leaving it as a fraction.</strong></p>
         ${sum('(x² + 11x + 121/4) − 121/4 + 4<br>= (x + 11/2)² − 121/4 + 16/4')}`,
        `<p><strong>Combine the numbers over 4.</strong></p>
         ${sum('(x + 11/2)² − 105/4')}`,
        `<p><strong>√(105/4) = √105/2.</strong> Use the difference of two squares.</p>
         ${sum('(x + 11/2 − √105/2)(x + 11/2 + √105/2)')}
         ${ans('(x+11/2-sqrt105/2)(x+11/2+sqrt105/2)')}`
      )}
      ${tip('Write every number as quarters before combining. Fractions are fine inside the brackets, typed like sqrt105/2.')}`,

    // y10-5F Q5: common factor first
    // method: Example 16b, 5F (take out the coefficient of x² first), then Example 15a
    'y10-5f-common': `
      <p class="hp-tag">Worked example: factorise <b>3x² + 60x + 90</b></p>
      ${steps(
        `<p><strong>Take out the common factor.</strong></p>
         ${sum('3(x² + 20x + 30)')}`,
        `<p><strong>Complete the square inside the bracket.</strong> (20/2)² = 100.</p>
         ${sum('3((x + 10)² − 100 + 30) = 3((x + 10)² − 70)')}`,
        `<p><strong>Difference of two squares with a surd.</strong></p>
         ${sum('3(x + 10 − √70)(x + 10 + √70)')}
         ${ans('3(x+10-sqrt70)(x+10+sqrt70)')}`
      )}
      ${tip('A negative x² term? Take out the negative number, so every sign in the bracket flips, then carry on the same way. Keep the number in front.')}`,

    // y10-5F Q6: common factor first, then fractions
    // method: Example 16b, 5F
    'y10-5f-common-frac': `
      <p class="hp-tag">Worked example: factorise <b>2x² − 26x + 8</b></p>
      ${steps(
        `<p><strong>Take out the common factor.</strong></p>
         ${sum('2(x² − 13x + 4)')}`,
        `<p><strong>Complete the square with fractions.</strong> (−13/2)² = 169/4, and 4 = 16/4.</p>
         ${sum('2((x − 13/2)² − 169/4 + 16/4) = 2((x − 13/2)² − 153/4)')}`,
        `<p><strong>Simplify the surd and factorise.</strong> √153 = √(9 × 17) = 3√17.</p>
         ${sum('2(x − 13/2 − 3√17/2)(x − 13/2 + 3√17/2)')}
         ${ans('2(x-13/2-3sqrt17/2)(x-13/2+3sqrt17/2)')}`
      )}
      ${tip('Look for a square factor in the top of the surd fraction, like 9 in 153. Keep the number you took out at the front.')}`,

    // y10-5F Q7: the x² coefficient does not divide the other terms
    // method: Example 16b, 5F
    'y10-5f-nonmonic': `
      <p class="hp-tag">Worked example: factorise <b>3x² + 4x − 1</b> by completing the square.</p>
      ${steps(
        `<p><strong>Take out the coefficient of x², even if fractions appear.</strong></p>
         ${sum('3(x² + (4/3)x − 1/3)')}`,
        `<p><strong>Complete the square.</strong> Half of 4/3 is 2/3, and (2/3)² = 4/9.</p>
         ${sum('3((x + 2/3)² − 4/9 − 3/9) = 3((x + 2/3)² − 7/9)')}`,
        `<p><strong>√(7/9) = √7/3.</strong></p>
         ${sum('3(x + 2/3 − √7/3)(x + 2/3 + √7/3)')}
         ${ans('3(x+2/3-sqrt7/3)(x+2/3+sqrt7/3)')}`
      )}
      ${tip('If the bracket ends up as a square plus a positive number, type not possible. Sometimes the surd cancels into whole numbers; simplify it if it does.')}`,

    // y10-5F Q8: completing the square on one that factorises anyway
    // method: Example 15a, 5F, then compared with Example 10, 5D
    'y10-5f-quick': `
      <p class="hp-tag">Worked example: factorise <b>x² − 14x + 40</b> by completing the square.</p>
      ${steps(
        `<p><strong>Complete the square.</strong></p>
         ${sum('(x − 7)² − 49 + 40 = (x − 7)² − 9')}`,
        `<p><strong>9 is a perfect square, so no surds appear.</strong></p>
         ${sum('(x − 7 − 3)(x − 7 + 3) = (x − 10)(x − 4)')}
         ${ans('(x-10)(x-4)')}`,
        `<p><strong>The quicker way:</strong> two numbers that multiply to 40 and add to −14: −10 and −4.</p>`
      )}
      ${tip('Try the multiply-and-add method first. Completing the square is for when no whole numbers work.')}`,

    // y10-5F Q9: can it be factorised?
    // method: Key ideas, 5F (only a difference of two squares factorises; a square plus a positive number does not)
    'y10-5f-can': `
      <p class="hp-tag">Worked example: which of these can be factorised using real numbers?</p>
      ${steps(
        `<p><strong>A minus between two squares: yes.</strong> Surds are allowed.</p>
         ${sum('x² − 32 = (x − 4√2)(x + 4√2)<br>(x − 9)² − 2 = (x − 9 − √2)(x − 9 + √2)')}
         ${ans('Can be factorised')}`,
        `<p><strong>A square plus a positive number: no.</strong> x² + 9 and (x + 1)² + 4 are never 0 or below, and they are not differences of squares.</p>
         ${ans('Cannot be factorised')}`,
        `<p><strong>Values of m:</strong> complete the square on x² − 14x + m.</p>
         ${sum('(x − 7)² − 49 + m')}
         <p>This is a difference of squares (or a perfect square) when 49 − m ≥ 0, so m ≤ 49.</p>
         ${ans('m<=49')}`
      )}
      ${tip('Type ≤ as <=, like m <= 49. When m equals the number, the expression is a perfect square, which still factorises.')}`,

    // y10-5F Q10: smallest and largest values
    // method: the question's own example (complete the square, then a square is never negative); no worked example
    'y10-5f-minmax': `
      <p class="hp-tag">Worked example: find the smallest value of <b>x² + 18x + 90</b>, and the largest value of <b>−x² + 14x − 45</b>.</p>
      ${steps(
        `<p><strong>Complete the square.</strong></p>
         ${sum('x² + 18x + 90 = (x + 9)² − 81 + 90 = (x + 9)² + 9')}`,
        `<p><strong>A square is never less than 0.</strong> (x + 9)² is 0 when x = −9, so the smallest value is 0 + 9.</p>
         ${ans('9')}`,
        `<p><strong>Negative x² term: take out −1 first.</strong></p>
         ${sum('−(x² − 14x + 45) = −((x − 7)² − 4) = −(x − 7)² + 4')}
         <p>−(x − 7)² is never more than 0, so the largest value is 4.</p>`
      )}
      ${tip('With a number in front of x², take it out first: the smallest value is that number times the smallest value of the bracket.')}`,

    // =====================================================================
    // Year 10 5G Solving quadratic equations using factorisation
    // =====================================================================
    // y10-5G Q1, Q2: common factor and difference of two squares
    // method: Example 17a, 17b, 17c, 5G
    'y10-5g-common': `
      <p class="hp-tag">Worked example: solve <b>x² + 8x = 0</b>, <b>x² − 17 = 0</b> and <b>2x² = 98</b></p>
      ${steps(
        `<p><strong>Factorise, then use the Null Factor Law:</strong> if p × q = 0, then p = 0 or q = 0.</p>
         ${sum('x(x + 8) = 0<br>x = 0 or x + 8 = 0, so x = 0 or x = −8')}
         ${ans('0, -8')}`,
        `<p><strong>Difference of two squares with surds.</strong></p>
         ${sum('(x + √17)(x − √17) = 0, so x = −√17 or x = √17')}
         ${ans('sqrt17, -sqrt17')}`,
        `<p><strong>Write in standard form first, then take out the common factor.</strong></p>
         ${sum('2x² − 98 = 0<br>2(x² − 49) = 0<br>2(x + 7)(x − 7) = 0, so x = −7 or x = 7')}`
      )}
      ${tip('Never divide both sides by x: you lose the solution x = 0. Move every term to one side instead. Type all solutions separated by commas.')}`,

    // y10-5G Q3: monic quadratics
    // method: Example 18a, 18b, 5G
    'y10-5g-monic': `
      <p class="hp-tag">Worked example: solve <b>x² + 2x − 24 = 0</b>, then <b>x² − 18x + 81 = 0</b></p>
      ${steps(
        `<p><strong>Factorise.</strong> Multiply to −24, add to 2: 6 and −4.</p>
         ${sum('(x + 6)(x − 4) = 0')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x + 6 = 0 or x − 4 = 0<br>x = −6 or x = 4')}
         ${ans('-6, 4')}`,
        `<p><strong>A perfect square gives one solution.</strong></p>
         ${sum('(x − 9)² = 0, so x − 9 = 0 and x = 9')}
         ${ans('9')}`
      )}
      ${tip('Check by substituting: (−6)² + 2(−6) − 24 = 36 − 12 − 24 = 0 ✓. If there is only one solution, type just that one.')}`,

    // y10-5G Q4: non-monic quadratics
    // method: Example 18c, 5G
    'y10-5g-nonmonic': `
      <p class="hp-tag">Worked example: solve <b>3x² + 10x − 8 = 0</b></p>
      ${steps(
        `<p><strong>Factorise by grouping.</strong> a × c = −24: 12 × (−2) = −24 and 12 + (−2) = 10.</p>
         ${sum('3x² + 12x − 2x − 8 = 0<br>3x(x + 4) − 2(x + 4) = 0<br>(x + 4)(3x − 2) = 0')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x + 4 = 0 or 3x − 2 = 0<br>x = −4 or 3x = 2, so x = 2/3')}
         ${ans('-4, 2/3')}`
      )}
      ${tip('Solve 3x − 2 = 0 in two steps: add 2, then divide by 3. Fractions are fine: type -4, 2/3.')}`,

    // y10-5G Q5: common factor first
    // method: Key ideas and Example 17c, 5G (take out the common factor first)
    'y10-5g-common-first': `
      <p class="hp-tag">Worked example: solve <b>4x² + 4x − 24 = 0</b></p>
      ${steps(
        `<p><strong>Take out the common factor.</strong></p>
         ${sum('4(x² + x − 6) = 0')}`,
        `<p><strong>Factorise the bracket.</strong> 4 can never be 0, so only the brackets give solutions.</p>
         ${sum('4(x + 3)(x − 2) = 0')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x = −3 or x = 2')}
         ${ans('-3, 2')}`
      )}
      ${tip('A negative common factor works the same: −2x² + 2x + 12 = 0 becomes −2(x − 3)(x + 2) = 0, so x = 3 or x = −2.')}`,

    // y10-5G Q6: write in standard form first
    // method: Example 19a, 5G
    'y10-5g-rearrange': `
      <p class="hp-tag">Worked example: solve <b>x² = 6(x + 12)</b></p>
      ${steps(
        `<p><strong>Expand, then move every term to one side.</strong></p>
         ${sum('x² = 6x + 72<br>x² − 6x − 72 = 0')}`,
        `<p><strong>Factorise.</strong> −12 × 6 = −72 and −12 + 6 = −6.</p>
         ${sum('(x − 12)(x + 6) = 0')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x = 12 or x = −6')}
         ${ans('12, -6')}`
      )}
      <p><strong>x on both sides:</strong> x(x − 4) = 2x + 7 becomes x² − 4x − 2x − 7 = 0, so x² − 6x − 7 = 0, (x − 7)(x + 1) = 0, and x = 7 or x = −1.</p>
      ${tip('Get 0 on one side with a positive x² term before you factorise.')}`,

    // y10-5G Q7: x in a denominator
    // method: Example 19b, 5G
    'y10-5g-xfraction': `
      <p class="hp-tag">Worked example: solve <b>(5x + 14)/x = x</b></p>
      ${steps(
        `<p><strong>Multiply both sides by x.</strong></p>
         ${sum('5x + 14 = x²')}`,
        `<p><strong>Write in standard form and factorise.</strong></p>
         ${sum('0 = x² − 5x − 14<br>0 = (x − 7)(x + 2)')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x = 7 or x = −2')}
         ${ans('7, -2')}`
      )}
      <p><strong>A bracket on the bottom:</strong> 12/(x − 1) = x. Multiply both sides by (x − 1): 12 = x² − x, so x² − x − 12 = 0, (x − 4)(x + 3) = 0, and x = 4 or x = −3.</p>
      ${tip('Check each answer in the original equation: (35 + 14)/7 = 7 ✓.')}`,

    // y10-5G Q12: fractions on both sides
    // method: Example 19b, 5G (multiply both sides to clear the fractions, then standard form)
    'y10-5g-fractions': `
      <p class="hp-tag">Worked example: solve <b>(x − 2)/4 = 2/x</b>, then <b>2/x + 3/(x + 1) = 2</b></p>
      ${steps(
        `<p><strong>Multiply both sides by both denominators.</strong> Here by 4x.</p>
         ${sum('x(x − 2) = 8<br>x² − 2x − 8 = 0<br>(x − 4)(x + 2) = 0, so x = 4 or x = −2')}
         ${ans('4, -2')}`,
        `<p><strong>Two fractions with x: multiply every term by x(x + 1).</strong></p>
         ${sum('2(x + 1) + 3x = 2x(x + 1)<br>5x + 2 = 2x² + 2x<br>2x² − 3x − 2 = 0')}`,
        `<p><strong>Factorise and solve.</strong></p>
         ${sum('(x − 2)(2x + 1) = 0, so x = 2 or x = −1/2')}
         ${ans('2, -1/2')}`
      )}
      ${tip('Multiply every term, including the one with no fraction. Check that no answer makes a denominator 0.')}`,

    // y10-5G Q8: decimals and fractions
    // method: no worked example; multiply both sides to clear decimals or fractions (as the question says), then Example 18, 5G
    'y10-5g-decimals': `
      <p class="hp-tag">Worked example: solve <b>0.2x² + 0.6x − 3.6 = 0</b></p>
      ${steps(
        `<p><strong>Multiply both sides by 10</strong> to clear the decimals.</p>
         ${sum('2x² + 6x − 36 = 0')}`,
        `<p><strong>Take out the common factor and factorise.</strong></p>
         ${sum('2(x² + 3x − 18) = 0<br>2(x + 6)(x − 3) = 0')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x = −6 or x = 3')}
         ${ans('-6, 3')}`
      )}
      <p><strong>Fractions:</strong> (1/4)x² + x − 8 = 0. Multiply by 4: x² + 4x − 32 = 0, so (x + 8)(x − 4) = 0 and x = −8 or x = 4.</p>
      ${tip('Multiply by enough to clear the smallest decimal: 100 for two decimal places. For fractions, multiply by the lowest common denominator.')}`,

    // y10-5G Q9, Q10, Q11: the Null Factor Law needs 0
    // method: Key ideas, 5G (Null Factor Law; 0, 1 or 2 solutions) and Example 18b
    'y10-5g-nfl': `
      <p class="hp-tag">Worked example: solve <b>4(x + 1)(x − 6) = 0</b>, then <b>x² + 2x − 3 = 12</b></p>
      ${steps(
        `<p><strong>A number in front cannot be 0</strong>, so it does not change the solutions.</p>
         ${sum('x + 1 = 0 or x − 6 = 0, so x = −1 or x = 6')}
         ${ans('-1, 6')}`,
        `<p><strong>The Null Factor Law only works when the product is 0.</strong> If a product is 12, the factors could be 3 and 4, or 2 and 6, or many others. So move the 12 first.</p>
         ${sum('x² + 2x − 15 = 0<br>(x + 5)(x − 3) = 0, so x = −5 or x = 3')}
         ${ans('-5, 3')}`,
        `<p><strong>How many solutions?</strong> Two different brackets give 2. A perfect square gives 1: x² − 2x + 1 = 0 is (x − 1)² = 0, so only x = 1.</p>`
      )}
      ${tip('Always get 0 on one side before factorising. Count different answers: a repeated bracket counts once.')}`,

    // =====================================================================
    // Year 10 5H Applications of quadratic equations
    // =====================================================================
    // y10-5H Q1, Q2: rectangle dimensions
    // method: Example 20, 5H
    'y10-5h-rect': `
      <p class="hp-tag">Worked example: a rectangle has area <b>40 m²</b> and its length is <b>3 m</b> more than its width. Find its dimensions.</p>
      ${fig({ kind: 'rect', cols: [['(x + 3) m', 3]], rows: [['x m', 1.6]], cells: [['40 m²']] })}
      ${steps(
        `<p><strong>Define a variable and write an equation.</strong> Let x m be the width, so the length is (x + 3) m.</p>
         ${sum('x(x + 3) = 40')}`,
        `<p><strong>Standard form, factorise, solve.</strong></p>
         ${sum('x² + 3x − 40 = 0<br>(x + 8)(x − 5) = 0<br>x = −8 or x = 5')}`,
        `<p><strong>Choose the answer that makes sense.</strong> A width cannot be negative, so x = 5.</p>
         ${sum('width 5 m, &nbsp; length 5 + 3 = 8 m')}
         ${ans('5')}`
      )}
      ${tip('Answer the question asked: if it wants the length, add the 3 on. Check: 5 × 8 = 40 ✓.')}`,

    // y10-5H Q3, Q4: triangle base and height
    // method: Example 20, 5H, with area = ½ × base × height (lesson starter)
    'y10-5h-triangle': `
      <p class="hp-tag">Worked example: a triangle has area <b>18 cm²</b> and its height is <b>5 cm</b> more than its base. Find the base and height.</p>
      ${steps(
        `<p><strong>Let x cm be the base.</strong> The height is (x + 5) cm.</p>
         ${sum('½ × x × (x + 5) = 18')}`,
        `<p><strong>Multiply both sides by 2, then standard form.</strong></p>
         ${sum('x(x + 5) = 36<br>x² + 5x − 36 = 0<br>(x + 9)(x − 4) = 0')}`,
        `<p><strong>x > 0, so x = 4.</strong></p>
         ${sum('base 4 cm, &nbsp; height 4 + 5 = 9 cm')}
         ${ans('4')}`
      )}
      ${tip('Height less than the base? Write it as x − 5 instead. Check: ½ × 4 × 9 = 18 ✓.')}`,

    // y10-5H Q5, Q6, Q10: number and age problems
    // method: Key ideas, 5H (define a variable, write an equation, solve, choose the solution that fits)
    'y10-5h-numbers': `
      <p class="hp-tag">Worked example: the product of two consecutive whole numbers is <b>72</b>. Find the numbers.</p>
      ${steps(
        `<p><strong>Let the numbers be x and x + 1.</strong></p>
         ${sum('x(x + 1) = 72<br>x² + x − 72 = 0<br>(x + 9)(x − 8) = 0')}`,
        `<p><strong>Both answers can work here.</strong> x = 8 gives 8 and 9; x = −9 gives −9 and −8.</p>
         ${ans('8, 9')}`,
        `<p><strong>Ages:</strong> a mum's age is the square of her daughter's age, x. In 15 years she will be twice her daughter's age.</p>
         ${sum('x² + 15 = 2(x + 15)<br>x² − 2x − 15 = 0<br>(x − 5)(x + 3) = 0, so x = 5')}
         <p>The daughter is 5 and the mum is 25. Check: in 15 years, 40 = 2 × 20 ✓.</p>`
      )}
      ${tip('Consecutive even numbers are x and x + 2. An age cannot be negative, so throw that answer away.')}`,

    // y10-5H Q7, Q9, Q11: frames, verandas and extensions
    // method: Key ideas and Example 20, 5H
    'y10-5h-shapes': `
      <p class="hp-tag">Worked example: a <b>20 cm</b> by <b>10 cm</b> photo has a frame <b>x cm</b> wide all the way round. The total area is <b>336 cm²</b>. Find x.</p>
      ${fig({ kind: 'diagram', unit: 13, items: [{ poly: [[0, 0], [24, 0], [24, 14], [0, 14]] }, { poly: [[2, 2], [22, 2], [22, 12], [2, 12]], fill: true }, { label: '20 cm by 10 cm', at: [12, 7] }, { dim: [22, 7, 24, 7], label: 'x cm', off: 0.8 }] })}
      ${steps(
        `<p><strong>The frame adds x at both ends of each side.</strong></p>
         ${sum('(20 + 2x)(10 + 2x) = 336')}`,
        `<p><strong>Expand and write in standard form.</strong></p>
         ${sum('200 + 40x + 20x + 4x² = 336<br>4x² + 60x − 136 = 0<br>x² + 15x − 34 = 0')}`,
        `<p><strong>Factorise and choose the positive answer.</strong></p>
         ${sum('(x + 17)(x − 2) = 0, so x = 2')}
         ${ans('2')}`
      )}
      ${tip('Divide by a common factor (here 4) before factorising. An L shape can be split into rectangles; a border area is the outside area minus the inside area.')}`,

    // y10-5H Q8: Pythagoras' theorem with x
    // method: Pythagoras' theorem (a² + b² = c²) written first, then Example 20, 5H
    'y10-5h-pythag': `
      <p class="hp-tag">Worked example: a right-angled triangle has shorter sides <b>x</b> and <b>x + 2</b> and hypotenuse <b>10</b>. Find x.</p>
      ${fig({ kind: 'diagram', unit: 40, items: [{ poly: [[0, 0], [3.4, 0], [0, 2.4]] }, { angle: [0, 0, 0, 90], right: true }, { label: 'x + 2', at: [1.7, -0.35] }, { label: 'x', at: [-0.4, 1.2] }, { label: '10', at: [2.05, 1.65] }] })}
      ${steps(
        `<p><strong>Write a² + b² = c².</strong></p>
         ${sum('x² + (x + 2)² = 10²')}`,
        `<p><strong>Expand and write in standard form.</strong></p>
         ${sum('x² + x² + 4x + 4 = 100<br>2x² + 4x − 96 = 0<br>x² + 2x − 48 = 0')}`,
        `<p><strong>Factorise and choose the positive answer.</strong></p>
         ${sum('(x + 8)(x − 6) = 0, so x = 6')}
         ${ans('6')}`
      )}
      ${tip('The hypotenuse is the longest side, opposite the right angle; it goes on its own. Check: 6² + 8² = 36 + 64 = 100 ✓.')}`,

    // y10-5H Q12: using a given formula
    // method: Key ideas, 5H (substitute, then solve the quadratic and choose the answer that fits)
    'y10-5h-formula': `
      <p class="hp-tag">Worked example: when n people all shake hands once, the number of handshakes is <b>h = ½n(n − 1)</b>.</p>
      ${steps(
        `<p><strong>Finding h: substitute.</strong> For 8 people:</p>
         ${sum('½ × 8 × 7 = 28')}`,
        `<p><strong>Finding n: write an equation.</strong> How many people make 66 handshakes?</p>
         ${sum('½n(n − 1) = 66<br>n² − n = 132<br>n² − n − 132 = 0')}`,
        `<p><strong>Factorise and choose the positive answer.</strong></p>
         ${sum('(n − 12)(n + 11) = 0, so n = 12')}
         ${ans('12')}`
      )}
      ${tip('Multiply both sides by 2 first to clear the ½. A count of people must be a positive whole number.')}`,

    // y10-5H Q13, Q14: height of a thrown object
    // method: Key ideas, 5H (substitute, write in standard form, solve, interpret)
    'y10-5h-height': `
      <p class="hp-tag">Worked example: a ball's height is <b>h = t(10 − t)</b> metres after t seconds.</p>
      ${steps(
        `<p><strong>Height at a time: substitute.</strong> At t = 1.5: 1.5 × 8.5 = 12.75 m.</p>`,
        `<p><strong>Time at a height: write in standard form and solve.</strong> When is h = 16?</p>
         ${sum('10t − t² = 16<br>t² − 10t + 16 = 0<br>(t − 2)(t − 8) = 0, so t = 2 or t = 8')}
         ${ans('2, 8')}
         <p>Two answers: the ball passes 16 m on the way up and again on the way down.</p>`,
        `<p><strong>One answer means the top.</strong> h = 25 gives t² − 10t + 25 = 0, so (t − 5)² = 0 and t = 5 only. 25 m is the greatest height, so the ball never reaches 30 m.</p>`
      )}
      <p><strong>A decimal in front:</strong> h = −0.01x(x − 80) and h = 7. Multiply both sides by −100: x(x − 80) = −700, so x² − 80x + 700 = 0, (x − 10)(x − 70) = 0, and x = 10 or x = 70.</p>
      ${tip('h = 0 gives the start and the landing. Type two answers separated by a comma; if there is only one, type just that one.')}`,

    // y10-5H Q15, Q16: perimeter and area together
    // method: Key ideas, 5H (define a variable, write an equation, solve)
    'y10-5h-perimeter': `
      <p class="hp-tag">Worked example: a rectangle has perimeter <b>34 m</b> and area <b>60 m²</b>. Find its length and width.</p>
      ${steps(
        `<p><strong>Use the perimeter to write one side in terms of the other.</strong> Length + width is half the perimeter.</p>
         ${sum('l + w = 17, so l = 17 − w')}`,
        `<p><strong>Use the area to write a quadratic.</strong></p>
         ${sum('w(17 − w) = 60<br>w² − 17w + 60 = 0')}`,
        `<p><strong>Factorise.</strong></p>
         ${sum('(w − 5)(w − 12) = 0, so w = 5 or w = 12')}
         <p>Both answers give the same rectangle: 5 m by 12 m.</p>
         ${ans('5, 12')}`
      )}
      ${tip('Check both facts: 2(5 + 12) = 34 ✓ and 5 × 12 = 60 ✓. Type the two dimensions separated by a comma.')}`,

    // =====================================================================
    // Year 10 5I Solving quadratic equations by completing the square
    // =====================================================================
    // y10-5I Q1, Q2: complete the square, then solve
    // method: Example 21a, 21b, 5I
    'y10-5i-cts': `
      <p class="hp-tag">Worked example: solve <b>x² + 12x + 26 = 0</b> by completing the square.</p>
      ${steps(
        `<p><strong>Complete the square.</strong> (12/2)² = 36.</p>
         ${sum('x² + 12x + 36 − 36 + 26 = 0<br>(x + 6)² − 10 = 0')}`,
        `<p><strong>Factorise as a difference of two squares.</strong></p>
         ${sum('(x + 6 − √10)(x + 6 + √10) = 0')}`,
        `<p><strong>Null Factor Law.</strong></p>
         ${sum('x = −6 + √10 or x = −6 − √10')}
         ${ans('-6 + sqrt10, -6 - sqrt10')}`
      )}
      <p><strong>Another way after step 1:</strong> (x + 6)² = 10, so x + 6 = ±√10. <strong>Simplify surds:</strong> x² − 14x + 21 = 0 gives (x − 7)² = 28, so x = 7 ± √28 = 7 ± 2√7.</p>
      ${tip('Students cannot type ±: give both answers separated by a comma, like 7 + 2sqrt7, 7 - 2sqrt7.')}`,

    // y10-5I Q3: odd b, so halves
    // method: Example 21c, 5I
    'y10-5i-half': `
      <p class="hp-tag">Worked example: solve <b>x² − 9x + 4 = 0</b> by completing the square.</p>
      ${steps(
        `<p><strong>Half of −9 is −9/2.</strong> Add and subtract (−9/2)² = 81/4.</p>
         ${sum('x² − 9x + 81/4 − 81/4 + 16/4 = 0<br>(x − 9/2)² − 65/4 = 0')}`,
        `<p><strong>Factorise.</strong> √(65/4) = √65/2.</p>
         ${sum('(x − 9/2 − √65/2)(x − 9/2 + √65/2) = 0')}`,
        `<p><strong>Solve and write over one denominator.</strong></p>
         ${sum('x = 9/2 + √65/2 = (9 + √65)/2<br>x = (9 − √65)/2')}
         ${ans('(9 + sqrt65)/2, (9 - sqrt65)/2')}`
      )}
      ${tip('Write the plain number as quarters (4 = 16/4) before combining. Type answers like (9 + sqrt65)/2.')}`,

    // y10-5I Q4: how many solutions?
    // method: Key ideas, 5I (a square plus a positive number has no solutions)
    'y10-5i-count': `
      <p class="hp-tag">Worked example: how many solutions does each equation have?</p>
      ${steps(
        `<p><strong>Get the form (something)² = number</strong>, completing the square if needed.</p>
         ${fig({ kind: 'table', rows: [['Equation', 'Rewritten', 'Solutions'], ['x² − 7 = 0', 'x² = 7', '2'], ['x² + 3 = 0', 'x² = −3', '0'], ['(x + 2)² + 5 = 0', '(x + 2)² = −5', '0'], ['x² − 18x + 81 = 0', '(x − 9)² = 0', '1'], ['x² − 14x + 55 = 0', '(x − 7)² = −6', '0']] })}`,
        `<p><strong>Read the number on the right.</strong> Positive: 2 solutions. Zero: 1 solution. Negative: 0 solutions, because no square is negative.</p>`
      )}
      ${tip('If it factorises easily, factorise instead: two different brackets mean 2 solutions. Type just the number of solutions.')}`,

    // y10-5I Q5: exact rectangle dimensions
    // method: Example 20, 5H (set up), then Example 21b, 5I (solve)
    'y10-5i-rect': `
      <p class="hp-tag">Worked example: a rectangle's length is <b>12 cm</b> more than its width, <b>x cm</b>, and its area is <b>8 cm²</b>. Find exact dimensions.</p>
      ${steps(
        `<p><strong>Write the equation in standard form.</strong></p>
         ${sum('x(x + 12) = 8<br>x² + 12x − 8 = 0')}`,
        `<p><strong>Complete the square.</strong></p>
         ${sum('(x + 6)² − 36 − 8 = 0<br>(x + 6)² = 44<br>x + 6 = ±2√11')}`,
        `<p><strong>Only the positive answer is a length.</strong></p>
         ${sum('width x = −6 + 2√11, &nbsp; length = x + 12 = 6 + 2√11')}
         ${ans('-6 + 2sqrt11')}`
      )}
      ${tip('−6 − 2√11 is negative, so reject it. Type an exact answer, like -6 + 2sqrt11.')}`,

    // y10-5I Q6: take out the coefficient of x² first
    // method: Example 16b, 5F (take out the coefficient of x²), then Example 21, 5I
    'y10-5i-coeff': `
      <p class="hp-tag">Worked example: solve <b>2x² − 28x + 94 = 0</b></p>
      ${steps(
        `<p><strong>Take out the coefficient of x².</strong> 2 cannot be 0, so the bracket must be 0.</p>
         ${sum('2(x² − 14x + 47) = 0<br>x² − 14x + 47 = 0')}`,
        `<p><strong>Complete the square.</strong></p>
         ${sum('(x − 7)² − 49 + 47 = 0<br>(x − 7)² = 2')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('x = 7 + √2 or x = 7 − √2')}
         ${ans('7 + sqrt2, 7 - sqrt2')}`
      )}
      <p><strong>No solutions:</strong> 2x² − 28x + 100 = 0 gives x² − 14x + 50 = 0, so (x − 7)² = −1. No square is negative.</p>
      ${tip('If the right side is negative, type no solutions. Fractions may appear after dividing; keep them as fractions.')}`,

    // y10-5I Q7: rearrange first
    // method: Key ideas, 5G (write in standard form), then Example 21, 5I
    'y10-5i-rearrange': `
      <p class="hp-tag">Worked example: solve <b>x² + 15x + 2 = 3x − 1</b></p>
      ${steps(
        `<p><strong>Move every term to the left.</strong></p>
         ${sum('x² + 12x + 3 = 0')}`,
        `<p><strong>Complete the square.</strong></p>
         ${sum('(x + 6)² − 36 + 3 = 0<br>(x + 6)² = 33')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('x = −6 + √33 or x = −6 − √33')}
         ${ans('-6 + sqrt33, -6 - sqrt33')}`
      )}
      <p><strong>A number on the right:</strong> x² − 14x = −44 becomes x² − 14x + 44 = 0, so (x − 7)² = 5 and x = 7 ± √5.</p>
      ${tip('Get 0 on one side first. If you end with a square equal to a negative number, type no solutions.')}`,

    // y10-5I Q8: a rocket height formula
    // method: Key ideas, 5I (substitute, write in standard form, complete the square)
    'y10-5i-rocket': `
      <p class="hp-tag">Worked example: a flare's height is <b>h = x(160 − x)/6400</b> km after travelling x km sideways.</p>
      ${steps(
        `<p><strong>Height at a distance: substitute.</strong> At x = 40:</p>
         ${sum('40 × 120/6400 = 4800/6400 = 3/4 km')}`,
        `<p><strong>Distance at a height: multiply out the fraction first.</strong> When is h = 0.5?</p>
         ${sum('x(160 − x) = 3200<br>x² − 160x + 3200 = 0')}`,
        `<p><strong>Complete the square.</strong></p>
         ${sum('(x − 80)² − 6400 + 3200 = 0<br>(x − 80)² = 3200<br>x = 80 ± √3200 = 80 ± 40√2')}
         ${ans('80 - 40sqrt2, 80 + 40sqrt2')}`
      )}
      ${tip('h = 0 gives the launch and the landing. One answer only means the highest point. √3200 = √1600 × √2 = 40√2.')}`,

    // y10-5I Q10, Q11: choosing a method, and an exact positive value
    // method: Key ideas, 5I (complete the square when integers cannot be found) and Example 18, 5G
    'y10-5i-choose': `
      <p class="hp-tag">Worked example: solve <b>x² + 3x − 28 = 0</b>, then find the positive solution of <b>a² − 3a − 1 = 0</b>.</p>
      ${steps(
        `<p><strong>Try to factorise first.</strong> 7 × (−4) = −28 and 7 + (−4) = 3, so it factorises. No need to complete the square.</p>
         ${sum('(x + 7)(x − 4) = 0, so x = −7 or x = 4')}`,
        `<p><strong>No whole numbers work? Complete the square.</strong></p>
         ${sum('(a − 3/2)² − 9/4 − 4/4 = 0<br>(a − 3/2)² = 13/4<br>a = 3/2 ± √13/2')}`,
        `<p><strong>Pick the positive one.</strong> √13 is about 3.6, so (3 − √13)/2 is negative.</p>
         ${ans('(3 + sqrt13)/2')}`
      )}
      ${tip('Factorising with the Null Factor Law is quickest when two whole numbers work. Type the exact answer, like (3 + sqrt13)/2.')}`,

    // y10-5I Q12: a border inside a rectangle
    // method: Key ideas, 5H and 5I (expressions for each side, an area equation, then solve)
    'y10-5i-border': `
      <p class="hp-tag">Worked example: a <b>20 m</b> by <b>32 m</b> hall has carpet <b>x m</b> wide round the edge, and a timber floor inside.</p>
      ${fig({ kind: 'diagram', unit: 9, items: [{ poly: [[0, 0], [32, 0], [32, 20], [0, 20]] }, { poly: [[4, 4], [28, 4], [28, 16], [4, 16]], fill: true }, { label: 'Timber', at: [16, 10] }, { dim: [0, 0, 32, 0], label: '32 m', off: -2.2 }, { dim: [32, 0, 32, 20], label: '20 m', off: -2.6 }, { dim: [28, 10, 32, 10], label: 'x m', off: 1.6 }] })}
      ${steps(
        `<p><strong>Each side of the timber loses x at both ends.</strong></p>
         ${sum('width 20 − 2x, &nbsp; length 32 − 2x<br>area (20 − 2x)(32 − 2x)')}`,
        `<p><strong>Timber area 288 m²: expand and solve.</strong></p>
         ${sum('640 − 40x − 64x + 4x² = 288<br>4x² − 104x + 352 = 0<br>x² − 26x + 88 = 0<br>(x − 4)(x − 22) = 0')}`,
        `<p><strong>Choose the answer that fits.</strong> x = 22 would make the width 20 − 44, which is negative.</p>
         ${ans('4')}`
      )}
      <p><strong>Not whole numbers?</strong> For 400 m²: x² − 26x + 60 = 0, so (x − 13)² = 109 and x = 13 − √109 (13 + √109 is too wide).</p>
      ${tip('Type each side as an expression, like 20-2x, and the area as a product of the two brackets.')}`,

    // =====================================================================
    // Year 10 5J Solving quadratic equations using the quadratic formula
    // =====================================================================
    // y10-5J Q1: the discriminant
    // method: Example 22, 5J
    'y10-5j-disc': `
      <p class="hp-tag">Worked example: use the discriminant to find how many solutions each equation has.</p>
      ${steps(
        `<p><strong>State a, b and c, then work out Δ = b² − 4ac.</strong></p>
         ${sum('x² + 4x − 7 = 0: &nbsp; a = 1, b = 4, c = −7<br>Δ = 4² − 4(1)(−7) = 16 + 28 = 44')}`,
        `<p><strong>Interpret.</strong> Δ > 0, so there are 2 solutions.</p>
         ${ans('2')}`,
        `<p><strong>Two more:</strong></p>
         ${sum('2x² − 3x + 5 = 0: &nbsp; Δ = (−3)² − 4(2)(5) = 9 − 40 = −31 < 0, so 0<br>−x² + 6x − 9 = 0: &nbsp; Δ = 6² − 4(−1)(−9) = 36 − 36 = 0, so 1')}`
      )}
      ${chips(['Δ > 0: 2 solutions', 'add'], ['Δ = 0: 1 solution'], ['Δ < 0: 0 solutions', 'take'])}
      ${tip('Put negatives in brackets when you substitute: (−3)² = 9, and −4(2)(5) = −40.')}`,

    // y10-5J Q2, Q3: the quadratic formula
    // method: Example 23a, 23b, 5J
    'y10-5j-formula': `
      <p class="hp-tag">Worked example: solve <b>x² + 7x + 2 = 0</b>, then <b>4x² + 2x − 1 = 0</b>, using the quadratic formula.</p>
      ${steps(
        `<p><strong>State a, b, c and substitute into x = (−b ± √(b² − 4ac))/(2a).</strong> a = 1, b = 7, c = 2.</p>
         ${sum('x = (−7 ± √(49 − 8))/2 = (−7 ± √41)/2')}
         ${ans('(-7 + sqrt41)/2, (-7 - sqrt41)/2')}`,
        `<p><strong>Simplify the surd, then cancel a common factor.</strong> a = 4, b = 2, c = −1.</p>
         ${sum('x = (−2 ± √(4 + 16))/8 = (−2 ± √20)/8<br>= (−2 ± 2√5)/8 = (−1 ± √5)/4')}`,
        `<p><strong>Negative a:</strong> −x² + 4x + 4 = 0 has a = −1, so 2a = −2.</p>
         ${sum('x = (−4 ± √(16 + 16))/(−2) = (−4 ± 4√2)/(−2) = 2 ∓ 2√2')}`
      )}
      ${tip('Divide every term on top by the common factor, not just one. Give both answers separated by a comma; if Δ = 0, type just the one.')}`,

    // y10-5J Q5: rearrange first
    // method: Key ideas, 5G (write in standard form), then Example 23, 5J
    'y10-5j-rearrange': `
      <p class="hp-tag">Worked example: solve <b>2x² = 8x + 1</b>, then <b>x + 4 = 1/x</b></p>
      ${steps(
        `<p><strong>Write in the form ax² + bx + c = 0.</strong></p>
         ${sum('2x² − 8x − 1 = 0: &nbsp; a = 2, b = −8, c = −1')}`,
        `<p><strong>Use the formula and simplify.</strong></p>
         ${sum('x = (8 ± √(64 + 8))/4 = (8 ± √72)/4<br>= (8 ± 6√2)/4 = (4 ± 3√2)/2')}
         ${ans('(4 + 3sqrt2)/2, (4 - 3sqrt2)/2')}`,
        `<p><strong>x on the bottom: multiply both sides by x first.</strong></p>
         ${sum('x² + 4x = 1, so x² + 4x − 1 = 0<br>x = (−4 ± √20)/2 = (−4 ± 2√5)/2 = −2 ± √5')}`
      )}
      ${tip('Watch the signs when moving terms: 2x² = 8x + 1 gives b = −8 and c = −1.')}`,

    // y10-5J Q4, Q7, Q8: problems with exact or rounded answers
    // method: Key ideas, 5H (set up an equation), then Example 23, 5J
    'y10-5j-area': `
      <p class="hp-tag">Worked example: a triangle's base is <b>6 cm</b> more than its height, <b>x cm</b>, and its area is <b>4 cm²</b>. Find the exact height.</p>
      ${steps(
        `<p><strong>Write an equation in standard form.</strong></p>
         ${sum('½ × x × (x + 6) = 4<br>x² + 6x − 8 = 0')}`,
        `<p><strong>Quadratic formula.</strong> a = 1, b = 6, c = −8.</p>
         ${sum('x = (−6 ± √(36 + 32))/2 = (−6 ± 2√17)/2 = −3 ± √17')}`,
        `<p><strong>Keep the positive answer.</strong></p>
         ${ans('-3 + sqrt17')}`
      )}
      <p><strong>Rounded answers:</strong> a 5 m by 3 m garden with a path x m wide round it has total area 25 m². (5 + 2x)(3 + 2x) = 25 gives 2x² + 8x − 5 = 0, so x = (−8 + √104)/4 ≈ 0.5495, which is 0.55 m to the nearest centimetre.</p>
      <p><strong>Numbers:</strong> two positive numbers differ by 1 and multiply to 3. x(x + 1) = 3 gives x = (−1 + √13)/2, and the other is (1 + √13)/2.</p>
      ${tip('Nearest centimetre means 2 decimal places in metres. Give exact answers with sqrt when the question asks for exact.')}`,

    // y10-5J Q6: Pythagoras' theorem with the formula
    // method: Pythagoras' theorem written first, then Example 23, 5J
    'y10-5j-pythag': `
      <p class="hp-tag">Worked example: a right-angled triangle has sides <b>x</b>, <b>x + 3</b> and hypotenuse <b>x + 4</b>. Find its exact perimeter.</p>
      ${steps(
        `<p><strong>Pythagoras' theorem, then expand.</strong></p>
         ${sum('x² + (x + 3)² = (x + 4)²<br>x² + x² + 6x + 9 = x² + 8x + 16<br>x² − 2x − 7 = 0')}`,
        `<p><strong>Quadratic formula, positive answer.</strong></p>
         ${sum('x = (2 ± √(4 + 28))/2 = (2 ± 4√2)/2 = 1 ± 2√2<br>x = 1 + 2√2')}`,
        `<p><strong>Add the three sides.</strong></p>
         ${sum('x + (x + 3) + (x + 4) = 3x + 7 = 3 + 6√2 + 7 = 10 + 6√2')}
         ${ans('10 + 6sqrt2')}`
      )}
      ${tip('1 − 2√2 is negative, so it cannot be a side. Collect the whole numbers and the surds separately.')}`,

    // y10-5J Q11, Q12: the discriminant with an unknown k
    // method: Example 22, 5J and Key ideas (Δ > 0, Δ = 0, Δ < 0)
    'y10-5j-k': `
      <p class="hp-tag">Worked example: for what values of k does <b>x² + 4x + k = 0</b> have 2, 1 or 0 solutions?</p>
      ${steps(
        `<p><strong>Write the discriminant in terms of k.</strong></p>
         ${sum('Δ = 4² − 4(1)(k) = 16 − 4k')}`,
        `<p><strong>One solution: Δ = 0.</strong></p>
         ${sum('16 − 4k = 0, so k = 4')}
         ${ans('4')}`,
        `<p><strong>Two solutions: Δ > 0. No solutions: Δ < 0.</strong></p>
         ${sum('16 − 4k > 0 gives k < 4<br>16 − 4k < 0 gives k > 4')}`
      )}
      <p><strong>k in the middle term:</strong> x² + kx + 25 = 0 has Δ = k² − 100. One solution when k² = 100, so k = 10 or k = −10. No solutions when −10 < k < 10.</p>
      ${tip('Type inequalities like k < 4. If Δ is something like k² + 8, it is always positive, so there are always 2 solutions.')}`
  });
})();
