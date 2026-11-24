/* H3 help panels for Year 9 Chapter 8. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 8A to 8K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // Area model for two brackets: top labels, side labels, then the four boxes.
  const grid = (top, side, cells) => fig({ kind: 'rect', cols: top.map(t => [t, t.length > 2 ? 3 : 2]), rows: side.map(s => [s, s.length > 2 ? 3 : 2]), cells });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 9 8A Expanding binomial products
    // =====================================================================
    // y9-8A Q1: expanding (x + a)(x + b)
    'y9-8a-expand': `
      <p class="hp-tag">Worked example: expand <b>(x − 8)(x + 3)</b></p>
      ${grid(['x', '+3'], ['x', '−8'], [['x²', '3x'], ['−8x', '−24']])}
      ${steps(
        `<p><strong>Every term in the first bracket multiplies every term in the second.</strong> The area model keeps track: one bracket along the top, one down the side.</p>
         ${sum('x × x = x², &nbsp; x × 3 = 3x<br>−8 × x = −8x, &nbsp; −8 × 3 = −24')}`,
        `<p><strong>Add the four boxes and collect the like terms.</strong> The two x terms go together.</p>
         ${sum(`x² + ${now('3x − 8x')} − 24 = x² − 5x − 24`)}
         ${ans('x^2-5x-24')}`
      )}
      <p><strong>Shortcut for (x + a)(x + b):</strong> the middle number is a + b and the last number is a × b. Here −8 + 3 = −5 and −8 × 3 = −24.</p>
      ${tip('Type x² as x^2, with the terms in any order. Keep the sign with each number: it is −8 × 3, not 8 × 3.')}`,

    // y9-8A Q2: expanding (ax + b)(cx + d)
    'y9-8a-coeff': `
      <p class="hp-tag">Worked example: expand <b>(4x + 3)(2x − 5)</b></p>
      ${grid(['2x', '−5'], ['4x', '+3'], [['8x²', '−20x'], ['6x', '−15']])}
      ${steps(
        `<p><strong>Multiply each pair of terms.</strong> Numbers multiply with numbers, letters with letters.</p>
         ${sum('4x × 2x = 8x², &nbsp; 4x × (−5) = −20x<br>3 × 2x = 6x, &nbsp; 3 × (−5) = −15')}`,
        `<p><strong>Collect the x terms.</strong></p>
         ${sum(`8x² ${now('− 20x + 6x')} − 15 = 8x² − 14x − 15`)}
         ${ans('8x^2-14x-15')}`,
        `<p><strong>Check with x = 1.</strong> Both forms must give the same number.</p>
         ${sum('(4 + 3)(2 − 5) = 7 × (−3) = −21<br>8 − 14 − 15 = −21 ✓')}`
      )}
      ${tip('The middle term is the one people get wrong. Find both "inside" products and add them, watching the signs. Type 8x^2-14x-15.')}`,

    // y9-8A Q3: binomial products with two letters
    'y9-8a-letters': `
      <p class="hp-tag">Worked example: expand <b>(3a + 2b)(a − 4b)</b></p>
      ${steps(
        `<p><strong>Multiply each term in the first bracket by each term in the second.</strong></p>
         ${sum('3a × a = 3a², &nbsp; 3a × (−4b) = −12ab<br>2b × a = 2ab, &nbsp; 2b × (−4b) = −8b²')}`,
        `<p><strong>Collect like terms.</strong> ab and ba are the same term, so −12ab and 2ab combine.</p>
         ${sum('3a² − 12ab + 2ab − 8b² = 3a² − 10ab − 8b²')}
         ${ans('3a^2-10ab-8b^2')}`
      )}
      <p><strong>No like terms?</strong> Then all four stay: (m − n)(p + q) = mp + mq − np − nq.</p>
      ${tip('Write the letters in each term in alphabetical order (ab, not ba) so like terms are easy to spot. Type a² as a^2.')}`,

    // y9-8A Q4, Q5, Q6: area problems with brackets
    'y9-8a-area': `
      <p class="hp-tag">Worked example: a 10 m by 7 m patio is made bigger. Both the length and the width go up by x m.</p>
      ${grid(['x', '+10'], ['x', '+7'], [['x²', '10x'], ['7x', '70']])}
      ${steps(
        `<p><strong>Write each new side as a bracket.</strong> New length x + 10, new width x + 7.</p>
         ${sum('Area = (x + 10)(x + 7)')}`,
        `<p><strong>Expand.</strong></p>
         ${sum('x² + 7x + 10x + 70 = x² + 17x + 70')}
         ${ans('x^2+17x+70')}`,
        `<p><strong>Substitute when a value is given.</strong> If x = 4, the area is 16 + 68 + 70 = 154 m², an increase of 154 − 70 = 84 m² on the old patio.</p>`
      )}
      <p><strong>A border inside the edge?</strong> A frame x cm wide and 2x cm long with a 3 cm border: the picture loses 3 cm at each end of every side, so it is (x − 6) by (2x − 6), and its area is 2x² − 18x + 36.</p>
      ${tip('Draw the shape and label every length before you write a bracket. A border on both sides takes away twice its width.')}`,

    // y9-8A Q7, Q8: missing numbers in an expansion
    'y9-8a-missing': `
      <p class="hp-tag">Worked example: fill the gaps. <b>(x + 5)(x + □) = x² + 9x + □</b></p>
      ${steps(
        `<p><strong>The middle term comes from adding.</strong> 5 + □ = 9, so the first gap is 4.</p>`,
        `<p><strong>The last term comes from multiplying.</strong> 5 × 4 = 20.</p>
         ${ans('4, 20')}`,
        `<p><strong>Finding both numbers:</strong> for (x + a)(x + b) = x² − 2x − 15, you need two numbers that multiply to −15 and add to −2.</p>
         ${sum('−5 × 3 = −15 ✓ &nbsp; −5 + 3 = −2 ✓')}
         ${ans('-5, 3')}`
      )}
      <p><strong>A number in front of x?</strong> (□ + 4)(3x − 1) = 6x² + □ − 4. The first gap times 3x makes 6x², so it is 2x. The middle term is 2x × (−1) + 4 × 3x = −2x + 12x = 10x.</p>
      ${tip('Type the answers in the order the gaps appear, separated by commas, like 2x, 10x.')}`,

    // y9-8A Q9, Q10: a bracket with three terms, and three brackets
    'y9-8a-cubic': `
      <p class="hp-tag">Worked example: expand <b>(x − 2)(x² + 3x − 1)</b></p>
      ${steps(
        `<p><strong>Multiply the whole second bracket by x.</strong></p>
         ${sum('x³ + 3x² − x')}`,
        `<p><strong>Multiply the whole second bracket by −2.</strong></p>
         ${sum('−2x² − 6x + 2')}`,
        `<p><strong>Line up like terms and add.</strong></p>
         ${sum('x³ + (3x² − 2x²) + (−x − 6x) + 2 = x³ + x² − 7x + 2')}
         ${ans('x^3+x^2-7x+2')}`
      )}
      <p><strong>Three brackets?</strong> Expand two of them first, then multiply by the third: (x + 3)(x − 1) = x² + 2x − 3, then (x² + 2x − 3)(x + 2) = x³ + 4x² + x − 6.</p>
      ${tip('2 terms times 3 terms gives 6 products before collecting. Count them so none go missing. Type x³ as x^3.')}`,

    // =====================================================================
    // Year 9 8B Perfect squares and difference of two squares
    // =====================================================================
    // y9-8B Q1, Q2, Q3: perfect squares
    'y9-8b-square': `
      <p class="hp-tag">Worked example: expand <b>(x + 14)²</b>, then <b>(4x − 3y)²</b></p>
      ${grid(['x', '+14'], ['x', '+14'], [['x²', '14x'], ['14x', '196']])}
      ${steps(
        `<p><strong>A square is a bracket times itself.</strong> (x + 14)² = (x + 14)(x + 14). The two middle boxes are the same.</p>
         ${sum('x² + 14x + 14x + 196 = x² + 28x + 196')}
         ${ans('x^2+28x+196')}`,
        `<p><strong>Use the pattern: first squared, twice first × second, second squared.</strong></p>
         ${sum('(a − b)² = a² − 2ab + b²<br>(4x)² = 16x², &nbsp; 2 × 4x × 3y = 24xy, &nbsp; (3y)² = 9y²')}
         ${ans('16x^2-24xy+9y^2')}`,
        `<p><strong>Number first?</strong> (5 − 6x)² = 25 − 60x + 36x². The order of the terms does not matter.</p>`
      )}
      ${tip('(x + 14)² is not x² + 196. The middle term is always there. Type 16x^2-24xy+9y^2.')}`,

    // y9-8B Q4, Q5: difference of two squares
    'y9-8b-dops': `
      <p class="hp-tag">Worked example: expand <b>(x + 15)(x − 15)</b>, then <b>(7x − 5y)(7x + 5y)</b></p>
      ${steps(
        `<p><strong>Expand as usual.</strong> The two middle terms are opposites, so they cancel.</p>
         ${sum(`x² ${now('− 15x + 15x')} − 225 = x² − 225`)}
         ${ans('x^2-225')}`,
        `<p><strong>Use the shortcut: (a + b)(a − b) = a² − b².</strong> Square the first term, take away the square of the second.</p>
         ${sum('(7x)² − (5y)² = 49x² − 25y²')}
         ${ans('49x^2-25y^2')}`,
        `<p><strong>Number first works the same way:</strong> (1 − 5x)(1 + 5x) = 1 − 25x².</p>`
      )}
      ${tip('Same two terms, one bracket with + and one with −: the answer has just two terms, and the second one is subtracted.')}`,

    // y9-8B Q6, Q7, Q8, Q9, Q10: areas and stories
    'y9-8b-area': `
      <p class="hp-tag">Worked example: a square sheet of card has side x cm. A 3 cm square is cut from each corner and the sides are folded up to make an open box.</p>
      ${steps(
        `<p><strong>Find the side of the base.</strong> 3 cm comes off at each end of every side.</p>
         ${sum('base side = x − 6')}`,
        `<p><strong>Square it and expand.</strong></p>
         ${sum('(x − 6)² = x² − 12x + 36')}
         ${ans('x^2-12x+36')}`,
        `<p><strong>Substitute.</strong> If x = 20, the base is 14 × 14 = 196 cm², and the box (3 cm high) holds 196 × 3 = 588 cm³.</p>`
      )}
      <p><strong>Longer one way, shorter the other?</strong> A square of side x made 1 unit longer and 1 unit shorter has area (x + 1)(x − 1) = x² − 1. That is always 1 less than the square.</p>
      ${tip('An area with a piece missing is outside area − inside area. Use brackets when you subtract an expanded expression.')}`,

    // y9-8B Q11: expanding and simplifying combinations
    'y9-8b-mixed': `
      <p class="hp-tag">Worked example: expand and simplify <b>(x + 5)² − (x + 1)(x − 1)</b></p>
      ${steps(
        `<p><strong>Expand each part on its own.</strong></p>
         ${sum('(x + 5)² = x² + 10x + 25<br>(x + 1)(x − 1) = x² − 1')}`,
        `<p><strong>Keep the second part in brackets, then remove them.</strong> The minus sign changes every sign inside.</p>
         ${sum('x² + 10x + 25 − (x² − 1)<br>= x² + 10x + 25 − x² + 1')}`,
        `<p><strong>Collect like terms.</strong> The x² terms cancel.</p>
         ${sum('10x + 26')}
         ${ans('10x+26')}`
      )}
      ${tip('A minus in front of an expansion is the most common trap: −(x² − 1) is −x² + 1. If the x² terms cancel, the answer is fine with no x² in it.')}`,

    // =====================================================================
    // Year 9 8C Factorising algebraic expressions
    // =====================================================================
    // y9-8C Q1, Q2: highest common factor of two terms
    'y9-8c-hcf': `
      <p class="hp-tag">Worked example: find the HCF of <b>12m²n</b> and <b>18mn</b>.</p>
      ${steps(
        `<p><strong>HCF of the numbers.</strong> The biggest number that goes into 12 and 18 is 6.</p>`,
        `<p><strong>Letters that are in both terms, with the smaller power.</strong> m² and m share one m. Both have n.</p>
         ${sum('12m²n = 6mn × 2m<br>18mn = 6mn × 3')}
         ${ans('6mn')}`
      )}
      <p><strong>Nothing shared?</strong> 8 and 5q have no common number above 1 and no common letter, so their HCF is 1.</p>
      ${tip('Type the HCF as a single term with the number first, like 6mn.')}`,

    // y9-8C Q3, Q11: factorising by taking out the HCF
    'y9-8c-factorise': `
      <p class="hp-tag">Worked example: factorise <b>21y² − 35y</b>, then <b>8a²b + 12ab − 4ab²</b></p>
      ${steps(
        `<p><strong>Find the HCF of all the terms.</strong> 7 goes into 21 and 35, and both terms have a y.</p>
         ${sum('HCF = 7y')}`,
        `<p><strong>Divide each term by the HCF.</strong> The results go inside the bracket.</p>
         ${sum('21y² ÷ 7y = 3y, &nbsp; 35y ÷ 7y = 5')}
         ${ans('7y(3y-5)')}`,
        `<p><strong>Three terms work the same way.</strong> Here the HCF is 4ab.</p>
         ${sum('8a²b ÷ 4ab = 2a, &nbsp; 12ab ÷ 4ab = 3, &nbsp; 4ab² ÷ 4ab = b')}
         ${ans('4ab(2a+3-b)')}`
      )}
      ${tip('Factorise fully: 7(3y² − 5y) is not finished, because y is still common. Expand your answer to check it. Type 7y(3y-5).')}`,

    // y9-8C Q4, Q12: taking out a negative factor
    'y9-8c-negative': `
      <p class="hp-tag">Worked example: factorise <b>−12x − 20</b> by taking out a negative HCF.</p>
      ${steps(
        `<p><strong>Take out −4.</strong> Divide each term by −4: a negative divided by a negative is positive.</p>
         ${sum('−12x ÷ (−4) = 3x, &nbsp; −20 ÷ (−4) = 5')}
         ${ans('-4(3x+5)')}`,
        `<p><strong>One expression, two ways.</strong> For −8x + 20, either sign of HCF works, and the bracket changes to match.</p>
         ${sum('−8x + 20 = −4(2x − 5)<br>−8x + 20 = 4(5 − 2x)')}`
      )}
      ${tip('Taking out a negative flips every sign in the bracket. Check by expanding: −4 × (−5) = +20 ✓.')}`,

    // y9-8C Q5, Q13: a bracket as the common factor
    'y9-8c-bracket': `
      <p class="hp-tag">Worked example: factorise <b>8(x − 1) + x(x − 1)</b></p>
      ${steps(
        `<p><strong>The whole bracket (x − 1) is in both terms.</strong> Take it out like any other common factor.</p>
         ${sum('(x − 1) × 8 + (x − 1) × x')}`,
        `<p><strong>What is left goes in the second bracket.</strong></p>
         ${sum('(x − 1)(8 + x)')}
         ${ans('(x-1)(x+8)')}`,
        `<p><strong>Brackets that are opposites?</strong> Use 7 − x = −(x − 7) to make them match.</p>
         ${sum('x(x − 7) + 5(7 − x)<br>= x(x − 7) − 5(x − 7)<br>= (x − 7)(x − 5)')}`
      )}
      ${tip('Type two brackets side by side with no × sign, like (x-1)(x+8). The order of the brackets does not matter.')}`,

    // y9-8C Q6: mixed factorising
    'y9-8c-mixed': `
      <p class="hp-tag">Worked example: factorise <b>9p² + 15p</b> and <b>a(a − 4) + 6(a − 4)</b></p>
      ${steps(
        `<p><strong>Look for the common factor first.</strong> In 9p² + 15p it is 3p.</p>
         ${sum('9p² + 15p = 3p(3p + 5)')}
         ${ans('3p(3p+5)')}`,
        `<p><strong>If a bracket repeats, take the bracket out.</strong></p>
         ${sum('a(a − 4) + 6(a − 4) = (a − 4)(a + 6)')}
         ${ans('(a-4)(a+6)')}`,
        `<p><strong>A squared bracket counts too.</strong> (a − 1)² is (a − 1)(a − 1), so (a − 1)² + 4(a − 1) = (a − 1)(a − 1 + 4) = (a − 1)(a + 3).</p>`
      )}
      ${tip('With three terms like x²y − 5xy + xy², check every term for each letter. Here each has xy, so xy goes outside.')}`,

    // y9-8C Q7, Q8: perimeters and areas in factorised form
    'y9-8c-perimeter': `
      <p class="hp-tag">Worked example: write the perimeter of this rectangle in factorised form.</p>
      ${fig({ kind: 'rect', cols: [['3x − 1', 3]], rows: [['x + 7', 2]] })}
      ${steps(
        `<p><strong>Add all four sides.</strong> Two of each.</p>
         ${sum('2(x + 7) + 2(3x − 1) = 2x + 14 + 6x − 2 = 8x + 12')}`,
        `<p><strong>Factorise.</strong> 4 goes into 8 and 12.</p>
         ${ans('4(2x+3)')}`
      )}
      <p><strong>Area to side:</strong> a rectangle with area 5x² − 10x and length x − 2. Factorise the area: 5x² − 10x = 5x(x − 2). The length is one factor, so the width is the other: 5x.</p>
      ${tip('Area = length × width, so factorising the area splits it into the two sides.')}`,

    // y9-8C Q9: a height formula
    'y9-8c-ball': `
      <p class="hp-tag">Worked example: a stone's height in metres is <b>8t − t²</b> after t seconds.</p>
      ${steps(
        `<p><strong>Factorise.</strong> Both terms have t.</p>
         ${sum('8t − t² = t(8 − t)')}
         ${ans('t(8-t)')}`,
        `<p><strong>Substitute into either form.</strong> At t = 2:</p>
         ${sum('2 × (8 − 2) = 2 × 6 = 12 m')}`,
        `<p><strong>Back to height 0?</strong> A product is 0 when one factor is 0: t = 0 (the start) or 8 − t = 0, so t = 8 seconds.</p>`
      )}
      ${tip('The factorised form makes the zeros easy to read: just ask what makes each bracket 0.')}`,

    // y9-8C Q10: factorising to do arithmetic
    'y9-8c-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>15 × 8 − 15 × 3</b> without a calculator.</p>
      ${steps(
        `<p><strong>Take out the common factor.</strong> 15 is in both products.</p>
         ${sum('15 × 8 − 15 × 3 = 15(8 − 3)')}`,
        `<p><strong>Work out the bracket, then multiply.</strong></p>
         ${sum('15 × 5 = 75')}
         ${ans('75')}`,
        `<p><strong>A negative common factor:</strong> −5 × 9 − 5 × 1 = −5(9 + 1) = −5 × 10 = −50.</p>`
      )}
      ${tip('The trick works best when the bracket comes out to a round number like 10.')}`,

    // =====================================================================
    // Year 9 8D Factorising the difference of two squares
    // =====================================================================
    // y9-8D Q1, Q2, Q7: a² − b² = (a − b)(a + b)
    'y9-8d-dops': `
      <p class="hp-tag">Worked example: factorise <b>16x² − 49y²</b></p>
      ${steps(
        `<p><strong>Write each term as a square.</strong></p>
         ${sum('16x² = (4x)², &nbsp; 49y² = (7y)²')}`,
        `<p><strong>Use a² − b² = (a − b)(a + b).</strong></p>
         ${sum('(4x)² − (7y)² = (4x − 7y)(4x + 7y)')}
         ${ans('(4x-7y)(4x+7y)')}`,
        `<p><strong>Number first, or the minus first?</strong> 169 − y² = (13 − y)(13 + y). For −25 + 4a², swap the terms: 4a² − 25 = (2a − 5)(2a + 5).</p>`
      )}
      ${tip('It only works for two squares with a minus between them. Check by expanding: the middle terms cancel. Type (4x-7y)(4x+7y).')}`,

    // y9-8D Q3, Q8: common factor first
    'y9-8d-hcf': `
      <p class="hp-tag">Worked example: factorise <b>2x² − 98</b></p>
      ${steps(
        `<p><strong>Take out the common factor first.</strong> 98 is not a square, but 98 ÷ 2 = 49 is.</p>
         ${sum('2x² − 98 = 2(x² − 49)')}`,
        `<p><strong>Factorise the difference of squares in the bracket.</strong></p>
         ${sum('2(x − 7)(x + 7)')}
         ${ans('2(x-7)(x+7)')}`,
        `<p><strong>With two letters:</strong> 12 − 3a²b² = 3(4 − a²b²) = 3(2 − ab)(2 + ab).</p>`
      )}
      ${tip('If you skip step 1, a bracket can still have a common factor in it, like (4x + 2), and the answer is not fully factorised. Type 2(x-7)(x+7).')}`,

    // y9-8D Q4, Q9: a bracket squared
    'y9-8d-brackets': `
      <p class="hp-tag">Worked example: factorise <b>(x + 6)² − 16</b>, then <b>25 − (x − 1)²</b></p>
      ${steps(
        `<p><strong>Treat the bracket as one term.</strong> a is (x + 6) and b is 4.</p>
         ${sum('(x + 6 − 4)(x + 6 + 4)')}`,
        `<p><strong>Tidy each bracket.</strong></p>
         ${sum('(x + 2)(x + 10)')}
         ${ans('(x+2)(x+10)')}`,
        `<p><strong>Bracket second: put it in whole.</strong> The minus applies to every term inside.</p>
         ${sum('(5 − (x − 1))(5 + (x − 1))<br>= (5 − x + 1)(5 + x − 1)<br>= (6 − x)(x + 4)')}
         ${ans('(6-x)(x+4)')}`
      )}
      ${tip('Write the inner brackets in full before you remove them. Forgetting that −(x − 1) is −x + 1 is the usual slip.')}`,

    // y9-8D Q5, Q6: difference of squares in a story
    'y9-8d-context': `
      <p class="hp-tag">Worked example: a stone dropped from a cliff is <b>196 − 4t²</b> metres above the water after t seconds.</p>
      ${steps(
        `<p><strong>Common factor, then difference of squares.</strong></p>
         ${sum('196 − 4t² = 4(49 − t²) = 4(7 − t)(7 + t)')}
         ${ans('4(7-t)(t+7)')}`,
        `<p><strong>Substitute into either form.</strong> At t = 2: 4 × 5 × 9 = 180 m. At the start, t = 0, so the height is 196 m.</p>`,
        `<p><strong>When is the height 0?</strong> When 7 − t = 0, so after 7 seconds.</p>`
      )}
      <p><strong>A frame:</strong> a square frame with outside side 50 cm holds a square picture of side x cm. The frame's area is 50² − x² = (50 − x)(50 + x). If x = 30, that is 20 × 80 = 1600 cm².</p>
      ${tip('Times can only be positive, so ignore the bracket that would give a negative time.')}`,

    // y9-8D Q10: fractions and fourth powers
    'y9-8d-fractions': `
      <p class="hp-tag">Worked example: factorise <b>x² − 1/16</b>, <b>a²/25 − b²/4</b> and <b>a⁴ − 16b⁴</b></p>
      ${steps(
        `<p><strong>Fractions can be squares too.</strong> 1/16 = (1/4)², and a²/25 = (a/5)².</p>
         ${sum('x² − 1/16 = (x − 1/4)(x + 1/4)<br>a²/25 − b²/4 = (a/5 − b/2)(a/5 + b/2)')}`,
        `<p><strong>A fourth power is a square of a square.</strong> a⁴ = (a²)² and 16b⁴ = (4b²)².</p>
         ${sum('a⁴ − 16b⁴ = (a² − 4b²)(a² + 4b²)')}`,
        `<p><strong>Keep going if a bracket factorises again.</strong> a² − 4b² does; a² + 4b² does not.</p>
         ${sum('(a − 2b)(a + 2b)(a² + 4b²)')}
         ${ans('(a-2b)(a+2b)(a^2+4b^2)')}`
      )}
      ${tip('Type fractions inside brackets as they are, like (x - 1/4)(x + 1/4). A number fraction in front goes in its own bracket: (1/3)(x - 1)(x + 1). Type a⁴ as a^4.')}`,

    // =====================================================================
    // Year 9 8E Factorising by grouping in pairs
    // =====================================================================
    // y9-8E Q1, Q3: grouping in pairs
    'y9-8e-pairs': `
      <p class="hp-tag">Worked example: factorise <b>x² + 4x + 7x + 28</b></p>
      ${steps(
        `<p><strong>Split into two pairs and factorise each pair.</strong></p>
         ${sum('x² + 4x = x(x + 4)<br>7x + 28 = 7(x + 4)')}`,
        `<p><strong>The brackets match, so take the bracket out.</strong></p>
         ${sum('x(x + 4) + 7(x + 4) = (x + 4)(x + 7)')}
         ${ans('(x+4)(x+7)')}`,
        `<p><strong>A pair with no obvious factor? Use 1 or −1.</strong></p>
         ${sum('ab + a − b − 1 = a(b + 1) − 1(b + 1) = (b + 1)(a − 1)')}`
      )}
      <p><strong>Letters work the same way:</strong> x² + 2x − bx − 2b = x(x + 2) − b(x + 2) = (x + 2)(x − b).</p>
      ${tip('If the two brackets do not match, try taking out the opposite sign from the second pair. Type (x+4)(x+7).')}`,

    // y9-8E Q2, Q9: pairs whose common factor includes a letter
    'y9-8e-letters': `
      <p class="hp-tag">Worked example: factorise <b>4pr + 6ps − 10qr − 15qs</b></p>
      ${steps(
        `<p><strong>First pair:</strong> 2p is common. <strong>Second pair:</strong> take out −5q so the bracket matches.</p>
         ${sum('4pr + 6ps = 2p(2r + 3s)<br>−10qr − 15qs = −5q(2r + 3s)')}`,
        `<p><strong>Take out the common bracket.</strong></p>
         ${sum('2p(2r + 3s) − 5q(2r + 3s) = (2r + 3s)(2p − 5q)')}
         ${ans('(2r+3s)(2p-5q)')}`,
        `<p><strong>More than two groups?</strong> Same idea, as long as every group gives the same bracket.</p>
         ${sum('m(y − 1) + 3(y − 1) − ny + n<br>= m(y − 1) + 3(y − 1) − n(y − 1)<br>= (y − 1)(m + 3 − n)')}`
      )}
      ${tip('Check by expanding your answer: you should get back all four terms.')}`,

    // y9-8E Q4, Q7: rearranging before grouping
    'y9-8e-rearrange': `
      <p class="hp-tag">Worked example: factorise <b>3xy − 10 + 6x − 5y</b></p>
      ${steps(
        `<p><strong>Reorder so each pair shares a factor.</strong> 3xy and 6x share 3x; −5y and −10 share −5.</p>
         ${sum('3xy + 6x − 5y − 10')}`,
        `<p><strong>Factorise each pair, then the bracket.</strong></p>
         ${sum('3x(y + 2) − 5(y + 2) = (y + 2)(3x − 5)')}
         ${ans('(y+2)(3x-5)')}`,
        `<p><strong>The other pairing gives the same answer.</strong></p>
         ${sum('3xy − 5y + 6x − 10 = y(3x − 5) + 2(3x − 5) = (3x − 5)(y + 2)')}`
      )}
      ${tip('Each term keeps its own sign when you move it. Pair up terms that share a letter or a number.')}`,

    // y9-8E Q5: expanding to undo a factorisation
    'y9-8e-expand': `
      <p class="hp-tag">Worked example: write the expanded expression that factorises to <b>(x + 4)(y − 3)</b></p>
      ${steps(
        `<p><strong>Multiply every term by every term.</strong></p>
         ${sum('x × y = xy, &nbsp; x × (−3) = −3x<br>4 × y = 4y, &nbsp; 4 × (−3) = −12')}`,
        `<p><strong>No like terms, so all four stay.</strong></p>
         ${sum('xy − 3x + 4y − 12')}
         ${ans('xy-3x+4y-12')}`
      )}
      <p><strong>More letters:</strong> (2a − b)(c + 5d) = 2ac + 10ad − bc − 5bd.</p>
      ${tip('Write letters in alphabetical order inside each term. The terms can be typed in any order.')}`,

    // y9-8E Q6: splitting the middle term
    'y9-8e-split': `
      <p class="hp-tag">Worked example: factorise <b>x² − 3x − 28</b> by grouping.</p>
      ${steps(
        `<p><strong>Find two numbers that multiply to −28 and add to −3.</strong></p>
         ${sum('−7 × 4 = −28 ✓ &nbsp; −7 + 4 = −3 ✓')}`,
        `<p><strong>Split −3x into 4x − 7x.</strong></p>
         ${sum('x² + 4x − 7x − 28')}`,
        `<p><strong>Group in pairs.</strong></p>
         ${sum('x(x + 4) − 7(x + 4) = (x + 4)(x − 7)')}
         ${ans('(x+4)(x-7)')}`
      )}
      ${tip('Either order of the two middle terms works. Type a product of brackets, like (x+4)(x-7).')}`,

    // =====================================================================
    // Year 9 8F Factorising monic quadratic trinomials
    // =====================================================================
    // y9-8F Q1, Q3: last term positive
    'y9-8f-plus': `
      <p class="hp-tag">Worked example: factorise <b>x² + 11x + 28</b>, then <b>x² − 14x + 33</b></p>
      ${grid(['x', '+7'], ['x', '+4'], [['x²', '7x'], ['4x', '28']])}
      ${steps(
        `<p><strong>Find two numbers that multiply to the last term and add to the middle number.</strong> Pairs for 28: 1 and 28, 2 and 14, 4 and 7. Only 4 + 7 = 11.</p>
         ${ans('(x+4)(x+7)')}`,
        `<p><strong>Last term positive but middle negative? Both numbers are negative.</strong> Pairs for 33: 1 and 33, 3 and 11.</p>
         ${sum('−3 × (−11) = 33 ✓ &nbsp; −3 + (−11) = −14 ✓')}
         ${ans('(x-3)(x-11)')}`
      )}
      ${chips(['+ last, + middle: both +', 'add'], ['+ last, − middle: both −', 'take'])}
      ${tip('Expand to check: (x − 3)(x − 11) = x² − 11x − 3x + 33 ✓. Type a product of brackets, like (x-3)(x-11).')}`,

    // y9-8F Q2, Q4: last term negative
    'y9-8f-minus': `
      <p class="hp-tag">Worked example: factorise <b>x² + 2x − 48</b></p>
      ${steps(
        `<p><strong>The last term is negative, so the two numbers have different signs.</strong> List pairs for 48 and look for a difference of 2.</p>
         ${fig({ kind: 'table', rows: [['Pair', '1, 48', '2, 24', '3, 16', '4, 12', '6, 8'], ['Difference', '47', '22', '13', '8', '2 ✓']] })}`,
        `<p><strong>Give the bigger number the sign of the middle term.</strong> The middle is +2x, so +8 and −6.</p>
         ${sum('8 × (−6) = −48 ✓ &nbsp; 8 + (−6) = 2 ✓')}
         ${ans('(x+8)(x-6)')}`,
        `<p><strong>Middle term negative?</strong> x² − 6x − 40: pairs for 40 with difference 6 are 4 and 10, so −10 and +4, giving (x − 10)(x + 4).</p>`
      )}
      ${tip('Type the brackets in either order: (x-6)(x+8) is fine too.')}`,

    // y9-8F Q5: common factor first
    'y9-8f-common': `
      <p class="hp-tag">Worked example: factorise <b>2x² + 18x − 44</b></p>
      ${steps(
        `<p><strong>Take out the common factor.</strong> 2 goes into every term.</p>
         ${sum('2(x² + 9x − 22)')}`,
        `<p><strong>Factorise the trinomial in the bracket.</strong> Multiply to −22 and add to 9: 11 and −2.</p>
         ${sum('x² + 9x − 22 = (x + 11)(x − 2)')}`,
        `<p><strong>Keep the 2 in front.</strong></p>
         ${ans('2(x+11)(x-2)')}`
      )}
      ${tip('Always look for a common factor first: it makes the numbers smaller. Type 2(x+11)(x-2).')}`,

    // y9-8F Q6: every possible middle term
    'y9-8f-missing': `
      <p class="hp-tag">Worked example: find every missing term in <b>x² + □ + 26</b>, then in <b>x² − □ − 26</b></p>
      ${steps(
        `<p><strong>List the factor pairs of the last number.</strong></p>
         ${sum('26 = 1 × 26 = 2 × 13')}`,
        `<p><strong>Last term +26, middle +□: both numbers positive, so add each pair.</strong></p>
         ${sum('1 + 26 = 27, &nbsp; 2 + 13 = 15')}
         ${ans('27x, 15x')}`,
        `<p><strong>Last term −26, middle −□: different signs, the bigger one negative.</strong></p>
         ${sum('−26 + 1 = −25, &nbsp; −13 + 2 = −11')}
         ${ans('25x, 11x')}`
      )}
      ${tip('Type every term with commas, like 27x, 15x. A middle term of 1x is typed x.')}`,

    // y9-8F Q7: a trinomial in a story
    'y9-8f-context': `
      <p class="hp-tag">Worked example: a garden is x m wide and 3 m longer than it is wide. A 40 m² pond is dug in it. The rest is lawn.</p>
      ${steps(
        `<p><strong>Total area, then take away the pond.</strong></p>
         ${sum('x(x + 3) − 40 = x² + 3x − 40')}`,
        `<p><strong>Factorise.</strong> Multiply to −40 and add to 3: 8 and −5.</p>
         ${sum('(x + 8)(x − 5)')}
         ${ans('(x+8)(x-5)')}`,
        `<p><strong>Substitute.</strong> If x = 10, the lawn is 18 × 5 = 90 m².</p>`
      )}
      ${tip('"Expanded form" means no brackets. "Factorised form" means a product of brackets. Give the one asked for.')}`,

    // y9-8F Q8: perfect squares
    'y9-8f-square': `
      <p class="hp-tag">Worked example: factorise <b>x² + 18x + 81</b>, then <b>2x² − 28x + 98</b></p>
      ${steps(
        `<p><strong>Two numbers that multiply to 81 and add to 18:</strong> 9 and 9. The two brackets are the same.</p>
         ${sum('(x + 9)(x + 9) = (x + 9)²')}
         ${ans('(x+9)^2')}`,
        `<p><strong>Common factor first.</strong></p>
         ${sum('2x² − 28x + 98 = 2(x² − 14x + 49)')}`,
        `<p><strong>−7 and −7</strong> multiply to 49 and add to −14.</p>
         ${ans('2(x-7)^2')}`
      )}
      ${tip('Spot a perfect square: the last term is a square number and the middle number is twice its square root. Type (x+9)^2.')}`,

    // y9-8F Q9: can it be factorised?
    'y9-8f-can': `
      <p class="hp-tag">Worked example: can <b>x² + 4x − 7</b> and <b>x² − x − 56</b> be factorised using integers?</p>
      ${steps(
        `<p><strong>List every integer pair that multiplies to the last term.</strong> For −7: 1 and −7, or −1 and 7. Their sums are −6 and 6. Neither is 4.</p>
         ${ans('Cannot be factorised')}`,
        `<p><strong>Second one.</strong> For −56, try pairs until the sum is −1: 7 and −8 work.</p>
         ${sum('7 × (−8) = −56 ✓ &nbsp; 7 + (−8) = −1 ✓')}
         ${ans('Can be factorised')}`
      )}
      ${tip('Check every pair, both ways round with the signs. Only say "cannot" once the list is complete.')}`,

    // y9-8F Q10: completing the square
    'y9-8f-complete': `
      <p class="hp-tag">Worked example: write <b>x² + 10x + 4</b> in the form <b>(x + b)² + c</b></p>
      ${steps(
        `<p><strong>Halve the middle number and square it.</strong> Half of 10 is 5, and 5² = 25.</p>`,
        `<p><strong>Add it and take it away</strong>, so the value does not change.</p>
         ${sum('x² + 10x + 25 − 25 + 4')}`,
        `<p><strong>The first three terms make a perfect square.</strong></p>
         ${sum('(x + 5)² − 21')}
         ${ans('5, -21')}`
      )}
      ${tip('b is half the middle number, sign included, so x² − 12x + ... gives b = −6. Type b and c in order with a comma: 5, -21.')}`,

    // =====================================================================
    // Year 9 8G Factorising trinomials of the form ax² + bx + c
    // =====================================================================
    // y9-8G Q1, Q4, Q8: splitting the middle term
    'y9-8g-ac': `
      <p class="hp-tag">Worked example: factorise <b>6x² + 11x + 4</b></p>
      ${steps(
        `<p><strong>Multiply the first and last numbers.</strong> 6 × 4 = 24. Find two numbers that multiply to 24 and add to 11.</p>
         ${sum('3 × 8 = 24 ✓ &nbsp; 3 + 8 = 11 ✓')}`,
        `<p><strong>Split the middle term using them.</strong></p>
         ${sum('6x² + 3x + 8x + 4')}`,
        `<p><strong>Group in pairs and take out the bracket.</strong></p>
         ${sum('3x(2x + 1) + 4(2x + 1) = (2x + 1)(3x + 4)')}
         ${ans('(2x+1)(3x+4)')}`
      )}
      <p><strong>Cross check:</strong> in (2x + 1)(3x + 4) the outside product is 2x × 4 = 8x and the inside is 1 × 3x = 3x. They add to the middle term, 11x ✓.</p>
      ${tip('With big numbers, list the factor pairs of the product in order so you do not miss one. Type (2x+1)(3x+4).')}`,

    // y9-8G Q2: negative terms
    'y9-8g-signs': `
      <p class="hp-tag">Worked example: factorise <b>4x² − 4x − 15</b></p>
      ${steps(
        `<p><strong>Multiply the first and last numbers.</strong> 4 × (−15) = −60. Find two numbers that multiply to −60 and add to −4.</p>
         ${sum('−10 × 6 = −60 ✓ &nbsp; −10 + 6 = −4 ✓')}`,
        `<p><strong>Split and group.</strong> Take out +3 from the second pair so the brackets match.</p>
         ${sum('4x² − 10x + 6x − 15<br>= 2x(2x − 5) + 3(2x − 5)')}`,
        `<p><strong>Take out the bracket.</strong></p>
         ${ans('(2x-5)(2x+3)')}`
      )}
      <p><strong>Last term positive, middle negative?</strong> Both numbers are negative. 3x² − 14x + 8: 3 × 8 = 24, and −2 + (−12) = −14, so 3x² − 2x − 12x + 8 = x(3x − 2) − 4(3x − 2) = (3x − 2)(x − 4).</p>
      ${tip('A negative product means one number is positive and one is negative. Expand your answer to check the signs.')}`,

    // y9-8G Q3: common factor first
    'y9-8g-common': `
      <p class="hp-tag">Worked example: factorise <b>12x² + 6x − 18</b></p>
      ${steps(
        `<p><strong>Take out the common factor.</strong></p>
         ${sum('6(2x² + x − 3)')}`,
        `<p><strong>Factorise the bracket.</strong> 2 × (−3) = −6, and 3 + (−2) = 1.</p>
         ${sum('2x² + 3x − 2x − 3 = x(2x + 3) − 1(2x + 3) = (2x + 3)(x − 1)')}`,
        `<p><strong>Keep the 6 in front.</strong></p>
         ${ans('6(x-1)(2x+3)')}`
      )}
      ${tip('If you skip the common factor, one of your brackets will still have one inside it, and the answer is not fully factorised.')}`,

    // y9-8G Q5: negative x² term
    'y9-8g-negative': `
      <p class="hp-tag">Worked example: factorise <b>−3x² + 2x + 8</b></p>
      ${steps(
        `<p><strong>Take out −1 first.</strong> Every sign in the bracket flips.</p>
         ${sum('−(3x² − 2x − 8)')}`,
        `<p><strong>Factorise the bracket.</strong> 3 × (−8) = −24, and −6 + 4 = −2.</p>
         ${sum('3x² − 6x + 4x − 8 = 3x(x − 2) + 4(x − 2) = (x − 2)(3x + 4)')}`,
        `<p><strong>Put the minus back in front.</strong></p>
         ${ans('-(x-2)(3x+4)')}`
      )}
      ${tip('If the terms are jumbled, like 8 + 2x − 3x², write them in order (x², then x, then the number) first. Type the minus in front: -(x-2)(3x+4).')}`,

    // y9-8G Q6: does the order of the split matter?
    'y9-8g-order': `
      <p class="hp-tag">Worked example: factorise <b>3x² + 10x − 8</b> two ways.</p>
      ${steps(
        `<p><strong>Find the split.</strong> 3 × (−8) = −24. Two numbers that multiply to −24 and add to 10: 12 and −2.</p>`,
        `<p><strong>Way A: 12x first.</strong></p>
         ${sum('3x² + 12x − 2x − 8 = 3x(x + 4) − 2(x + 4) = (x + 4)(3x − 2)')}`,
        `<p><strong>Way B: −2x first.</strong></p>
         ${sum('3x² − 2x + 12x − 8 = x(3x − 2) + 4(3x − 2) = (3x − 2)(x + 4)')}
         ${ans('(x+4)(3x-2)')}`
      )}
      ${tip('Both orders give the same brackets, so pick whichever pairs look easier. Doing it the other way is a good check.')}`,

    // =====================================================================
    // Year 9 8H Simplifying algebraic fractions: multiplication and division
    // =====================================================================
    // y9-8H Q1, Q8: cancelling common factors
    'y9-8h-cancel': `
      <p class="hp-tag">Worked example: simplify <b>12(x − 2)(x + 7) / (8(x + 7))</b></p>
      ${steps(
        `<p><strong>Cancel any bracket that is a factor of the whole top and the whole bottom.</strong> (x + 7) is on both.</p>
         ${sum('12(x − 2) / 8')}`,
        `<p><strong>Cancel the numbers.</strong> 12/8 = 3/2.</p>
         ${ans('3(x-2)/2')}`,
        `<p><strong>A squared bracket</strong> is two copies of the bracket, so one copy cancels: 10(x + 9)² / (4(x + 9)) = 10(x + 9)/4 = 5(x + 9)/2.</p>`
      )}
      ${tip('Type one fraction, with brackets round a top or bottom that has more than one part, like 3(x-2)/2 or 5/(2(x+1)).')}`,

    // y9-8H Q2, Q3, Q4: factorise, then cancel
    'y9-8h-factorise': `
      <p class="hp-tag">Worked example: simplify (a) <b>(4x − 12)/(6x − 18)</b> (b) <b>(x² − 144)/(x + 12)</b> (c) <b>(x² + 3x − 28)/(x − 4)</b></p>
      ${steps(
        `<p><strong>Common factor.</strong> Factorise the top and the bottom, then cancel the matching bracket.</p>
         ${sum('(a) 4(x − 3) / (6(x − 3)) = 4/6 = 2/3')}`,
        `<p><strong>Difference of two squares.</strong></p>
         ${sum('(b) (x − 12)(x + 12) / (x + 12) = x − 12')}`,
        `<p><strong>Trinomial.</strong> Multiply to −28, add to 3: 7 and −4.</p>
         ${sum('(c) (x + 7)(x − 4) / (x − 4) = x + 7')}
         ${ans('2/3, x-12, x+7')}`
      )}
      ${tip('Never cancel single terms: in (x + 12)/12 the 12s do not cancel. Only whole factors cancel.')}`,

    // y9-8H Q5, Q6: multiplying and dividing
    'y9-8h-times': `
      <p class="hp-tag">Worked example: simplify <b>(x + 2)/(4(x − 1)) × 6(x − 1)/(x + 3)</b></p>
      ${steps(
        `<p><strong>Cancel any factor on a top with the same factor on a bottom.</strong> (x − 1) cancels, and 6/4 = 3/2.</p>`,
        `<p><strong>Multiply what is left: tops together, bottoms together.</strong></p>
         ${ans('3(x+2)/(2(x+3))')}`,
        `<p><strong>Dividing: flip the second fraction and multiply.</strong></p>
         ${sum('5x/(x − 2) ÷ 10x/(x + 1)<br>= 5x/(x − 2) × (x + 1)/(10x)<br>= (x + 1)/(2(x − 2))')}`
      )}
      ${tip('Type the bottom in brackets when it has more than one part: 3(x+2)/(2(x+3)).')}`,

    // y9-8H Q7, Q10: factorise everything, then cancel
    'y9-8h-mixed': `
      <p class="hp-tag">Worked example: simplify <b>(x² + 9x + 14)/(x² − 4x − 21) × (x − 7)/(x + 7)</b></p>
      ${steps(
        `<p><strong>Factorise every top and bottom first.</strong></p>
         ${sum('x² + 9x + 14 = (x + 2)(x + 7)<br>x² − 4x − 21 = (x − 7)(x + 3)')}`,
        `<p><strong>Cancel matching brackets.</strong> (x + 7) and (x − 7) each appear on a top and a bottom.</p>
         ${sum('(x + 2)(x + 7)/((x − 7)(x + 3)) × (x − 7)/(x + 7)')}`,
        `<p><strong>Write what is left.</strong></p>
         ${ans('(x+2)/(x+3)')}`
      )}
      <p><strong>Opposite brackets?</strong> Use 6 − 2x = −2(x − 3): (x² − 2x − 3)/(6 − 2x) = (x − 3)(x + 1)/(−2(x − 3)) = −(x + 1)/2.</p>
      ${tip('For ÷, flip the second fraction before cancelling. Cancel only after everything is factorised.')}`,

    // y9-8H Q9: brackets that are opposites
    'y9-8h-negative': `
      <p class="hp-tag">Worked example: simplify <b>(8 − 2x)/(3x − 12)</b></p>
      ${steps(
        `<p><strong>Factorise both.</strong> Take out −2 on top, so its bracket matches the bottom.</p>
         ${sum('8 − 2x = −2(x − 4)<br>3x − 12 = 3(x − 4)')}`,
        `<p><strong>Cancel the bracket.</strong></p>
         ${sum('−2(x − 4)/(3(x − 4)) = −2/3')}
         ${ans('-2/3')}`
      )}
      <p><strong>A whole number answer:</strong> (10 − 5x)/(x − 2) = −5(x − 2)/(x − 2) = −5.</p>
      ${tip('a − b and b − a are opposites: b − a = −(a − b). Their quotient is −1. Type a negative fraction like -2/3.')}`,

    // =====================================================================
    // Year 9 8I Simplifying algebraic fractions: addition and subtraction
    // =====================================================================
    // y9-8I Q1: one-term tops
    'y9-8i-simple': `
      <p class="hp-tag">Worked example: simplify <b>2x/7 + x/3</b></p>
      ${steps(
        `<p><strong>Find the lowest common denominator.</strong> 7 and 3 share no factor, so the LCD is 21.</p>`,
        `<p><strong>Rewrite each fraction over 21.</strong></p>
         ${sum('2x/7 = 6x/21, &nbsp; x/3 = 7x/21')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('6x/21 + 7x/21 = 13x/21')}
         ${ans('13x/21')}`
      )}
      <p><strong>Subtracting:</strong> 4m/7 − m/2 = 8m/14 − 7m/14 = m/14.</p>
      ${tip('Type one fraction like 13x/21. A negative answer goes in front: -5x/12.')}`,

    // y9-8I Q6: a missing fraction
    'y9-8i-missing': `
      <p class="hp-tag">Worked example: find the missing fraction. <b>2x/7 + □ = 3x/4</b></p>
      ${steps(
        `<p><strong>Undo the adding: subtract.</strong></p>
         ${sum('□ = 3x/4 − 2x/7')}`,
        `<p><strong>Use the LCD, 28.</strong></p>
         ${sum('21x/28 − 8x/28 = 13x/28')}
         ${ans('13x/28')}`,
        `<p><strong>Check:</strong> 8x/28 + 13x/28 = 21x/28 = 3x/4 ✓.</p>`
      )}
      ${tip('If the box is being subtracted (3x/4 − □), the missing fraction is the first minus the answer. Give it in simplest form.')}`,

    // y9-8I Q2, Q8, Q9: tops with two terms
    'y9-8i-binomial': `
      <p class="hp-tag">Worked example: simplify <b>(x + 5)/2 + (x − 3)/7</b></p>
      ${steps(
        `<p><strong>LCD = 14.</strong> Multiply each whole top, so keep the brackets.</p>
         ${sum('7(x + 5)/14 + 2(x − 3)/14')}`,
        `<p><strong>Expand the brackets on top.</strong></p>
         ${sum('(7x + 35 + 2x − 6)/14')}`,
        `<p><strong>Collect like terms.</strong></p>
         ${sum('(9x + 29)/14')}
         ${ans('(9x+29)/14')}`
      )}
      ${tip('Type the top in brackets: (9x+29)/14. Any common denominator works, but if it is not the lowest you must simplify at the end.')}`,

    // y9-8I Q3, Q4, Q5: x in the denominator
    'y9-8i-xbottom': `
      <p class="hp-tag">Worked example: simplify (a) <b>3/(5x) + 1/(2x)</b> (b) <b>7/x − 2/x²</b> (c) <b>2/x + x/7</b></p>
      ${steps(
        `<p><strong>LCD of 5x and 2x is 10x.</strong></p>
         ${sum('(a) 6/(10x) + 5/(10x) = 11/(10x)')}`,
        `<p><strong>LCD of x and x² is x².</strong> Multiply 7/x by x/x.</p>
         ${sum('(b) 7x/x² − 2/x² = (7x − 2)/x²')}`,
        `<p><strong>LCD of x and 7 is 7x.</strong></p>
         ${sum('(c) 14/(7x) + x²/(7x) = (x² + 14)/(7x)')}
         ${ans('11/(10x), (7x-2)/x^2, (x^2+14)/(7x)')}`
      )}
      ${tip('Type the bottom in brackets when it is more than one symbol: 11/(10x). Without them, 11/10x means 11/10 times x.')}`,

    // y9-8I Q7: time from distance and speed
    'y9-8i-story': `
      <p class="hp-tag">Worked example: Mia rides x km to a lake at 20 km/h and rides back at 30 km/h.</p>
      ${steps(
        `<p><strong>Time = distance ÷ speed, for each part.</strong></p>
         ${sum('there: x/20, &nbsp; back: x/30')}`,
        `<p><strong>Add with the LCD, 60.</strong></p>
         ${sum('3x/60 + 2x/60 = 5x/60 = x/12')}
         ${ans('x/12')}`,
        `<p><strong>Substitute.</strong> If x = 36, the trip takes 36/12 = 3 hours.</p>`
      )}
      ${tip('If a speed is a fraction, dividing by it means multiplying by its flip: x ÷ 3/2 = 2x/3.')}`,

    // y9-8I Q10: three fractions
    'y9-8i-three': `
      <p class="hp-tag">Worked example: simplify <b>3x/4 + x/6 − x/9</b></p>
      ${steps(
        `<p><strong>Find one denominator all three go into.</strong> 4, 6 and 9 all go into 36.</p>`,
        `<p><strong>Rewrite each fraction.</strong></p>
         ${sum('27x/36 + 6x/36 − 4x/36')}`,
        `<p><strong>Combine the tops.</strong></p>
         ${sum('29x/36')}
         ${ans('29x/36')}`
      )}
      <p><strong>With x on the bottom:</strong> 2/x − 1/(3x) + 5/(6x) = 12/(6x) − 2/(6x) + 5/(6x) = 15/(6x) = 5/(2x).</p>
      ${tip('Simplify at the end if the top and bottom share a factor, as 15/(6x) does.')}`,

    // =====================================================================
    // Year 9 8J Further simplification of algebraic fractions
    // =====================================================================
    // y9-8J Q1, Q2, Q7: subtracting fractions with two-term tops
    'y9-8j-subtract': `
      <p class="hp-tag">Worked example: simplify <b>(x + 6)/4 − (x − 1)/6</b></p>
      ${steps(
        `<p><strong>LCD = 12.</strong> Keep each top in brackets.</p>
         ${sum('3(x + 6)/12 − 2(x − 1)/12')}`,
        `<p><strong>Expand. The minus multiplies the whole second bracket.</strong></p>
         ${sum(`(3x + 18 ${now('− 2x + 2')})/12`)}`,
        `<p><strong>Collect like terms.</strong></p>
         ${ans('(x+20)/12')}`
      )}
      ${tip('−2(x − 1) is −2x + 2, not −2x − 2. This is the most common error with subtraction. Type (x+20)/12.')}`,

    // y9-8J Q3: binomial denominators
    'y9-8j-binbottom': `
      <p class="hp-tag">Worked example: simplify <b>3/(x + 7) + 2/(x − 6)</b></p>
      ${steps(
        `<p><strong>The LCD is the product of the two bottoms.</strong></p>
         ${sum('3(x − 6)/((x + 7)(x − 6)) + 2(x + 7)/((x + 7)(x − 6))')}`,
        `<p><strong>Expand and collect the top.</strong> Leave the bottom factorised.</p>
         ${sum('3x − 18 + 2x + 14 = 5x − 4')}`,
        `<p><strong>Write one fraction.</strong></p>
         ${ans('(5x-4)/((x+7)(x-6))')}`
      )}
      ${tip('Type the top in brackets and the whole bottom in brackets too: (5x-4)/((x+7)(x-6)).')}`,

    // y9-8J Q4: a repeated factor
    'y9-8j-repeated': `
      <p class="hp-tag">Worked example: simplify <b>2/(x + 6)² + 5/(x + 6)</b></p>
      ${steps(
        `<p><strong>The LCD is (x + 6)², not (x + 6)³.</strong> (x + 6)² already contains (x + 6).</p>`,
        `<p><strong>Only the second fraction needs changing.</strong> Multiply its top and bottom by (x + 6).</p>
         ${sum('2/(x + 6)² + 5(x + 6)/(x + 6)²')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('(2 + 5x + 30)/(x + 6)² = (5x + 32)/(x + 6)²')}
         ${ans('(5x+32)/(x+6)^2')}`
      )}
      ${tip('Type a squared bracket on the bottom as (x+6)^2.')}`,

    // y9-8J Q5: letters on top and bottom
    'y9-8j-mixed': `
      <p class="hp-tag">Worked example: simplify <b>2x/(x + 3) + x/(x − 1)</b></p>
      ${steps(
        `<p><strong>LCD = (x + 3)(x − 1).</strong> Multiply each top by the other bottom.</p>
         ${sum('(2x(x − 1) + x(x + 3)) / ((x + 3)(x − 1))')}`,
        `<p><strong>Expand and collect the top.</strong></p>
         ${sum('2x² − 2x + x² + 3x = 3x² + x')}
         ${ans('(3x^2+x)/((x+3)(x-1))')}`,
        `<p><strong>A number and an x bottom:</strong> (x + 1)/(2x) + 3/4 has LCD 4x: (2(x + 1) + 3x)/(4x) = (5x + 2)/(4x).</p>`
      )}
      ${tip('Type x² as x^2 and keep the bottom factorised.')}`,

    // y9-8J Q6: denominators that share a factor
    'y9-8j-shared': `
      <p class="hp-tag">Worked example: simplify <b>4/((x + 1)(x + 4)) − 1/((x + 4)(x − 2))</b></p>
      ${steps(
        `<p><strong>Use each factor once.</strong> (x + 4) is in both, so the LCD is (x + 1)(x + 4)(x − 2).</p>`,
        `<p><strong>Multiply each top by the factor it is missing.</strong></p>
         ${sum('4(x − 2) − 1(x + 1) = 4x − 8 − x − 1 = 3x − 9')}`,
        `<p><strong>Write one fraction.</strong></p>
         ${ans('(3x-9)/((x+1)(x+4)(x-2))')}`
      )}
      ${tip('Multiplying the two bottoms together would give (x + 4) twice. It still works, but you would have to cancel at the end.')}`,

    // y9-8J Q8: opposite denominators
    'y9-8j-swap': `
      <p class="hp-tag">Worked example: simplify <b>6/(x − 9) − 4/(9 − x)</b></p>
      ${steps(
        `<p><strong>Write the second bottom the other way round.</strong> 9 − x = −(x − 9).</p>
         ${sum('4/(9 − x) = −4/(x − 9)')}`,
        `<p><strong>Now the bottoms match.</strong> Taking away a negative is adding.</p>
         ${sum('6/(x − 9) + 4/(x − 9) = 10/(x − 9)')}
         ${ans('10/(x-9)')}`
      )}
      ${tip('Swapping the order of a bottom flips the sign of the fraction. Do it to one fraction only.')}`,

    // y9-8J Q9: factorise the denominators first
    'y9-8j-factor': `
      <p class="hp-tag">Worked example: simplify <b>2/(x² − 25) + 1/(x + 5)</b></p>
      ${steps(
        `<p><strong>Factorise any bottom you can.</strong></p>
         ${sum('x² − 25 = (x − 5)(x + 5)')}`,
        `<p><strong>The LCD is (x − 5)(x + 5).</strong> The second fraction is missing (x − 5).</p>
         ${sum('2/((x − 5)(x + 5)) + (x − 5)/((x − 5)(x + 5))')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('(2 + x − 5) = x − 3')}
         ${ans('(x-3)/((x-5)(x+5))')}`
      )}
      ${tip('Factorising first often shows the bottoms share a bracket, which keeps the LCD small. Type each factor in its own brackets.')}`,

    // =====================================================================
    // Year 9 8K Equations with algebraic fractions
    // =====================================================================
    // y9-8K Q1: one-term fractions
    'y9-8k-simple': `
      <p class="hp-tag">Worked example: solve <b>x/4 + x/6 = 15</b></p>
      ${steps(
        `<p><strong>Multiply every term by the LCD, 12.</strong> The fractions disappear.</p>
         ${sum('12 × x/4 + 12 × x/6 = 12 × 15<br>3x + 2x = 180')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('5x = 180, so x = 36')}
         ${ans('36')}`,
        `<p><strong>Check:</strong> 36/4 + 36/6 = 9 + 6 = 15 ✓.</p>`
      )}
      ${tip('Multiply the right-hand side too. Forgetting it is the easiest mistake to make.')}`,

    // y9-8K Q2, Q10, Q11: two-term tops
    'y9-8k-binomial': `
      <p class="hp-tag">Worked example: solve <b>(x + 1)/2 + (x − 4)/5 = 6</b></p>
      ${steps(
        `<p><strong>Multiply every term by 10.</strong> Keep each top in brackets.</p>
         ${sum('5(x + 1) + 2(x − 4) = 60')}`,
        `<p><strong>Expand and collect.</strong></p>
         ${sum('5x + 5 + 2x − 8 = 60<br>7x − 3 = 60')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('7x = 63, so x = 9')}
         ${ans('9')}`
      )}
      <p><strong>Subtracting?</strong> (x + 2)/3 − (x − 1)/2 = 1. Times 6: 2(x + 2) − 3(x − 1) = 6, so 2x + 4 − 3x + 3 = 6, and x = 1. Note −3 × (−1) = +3.</p>
      ${tip('Every term gets multiplied, including whole terms with no fraction. If the answer is a fraction, type it like 29/5.')}`,

    // y9-8K Q3, Q5: one fraction equals another
    'y9-8k-cross': `
      <p class="hp-tag">Worked example: solve <b>(x + 5)/4 = (x − 1)/2</b></p>
      ${steps(
        `<p><strong>Cross-multiply:</strong> each top times the other bottom.</p>
         ${sum('2(x + 5) = 4(x − 1)')}`,
        `<p><strong>Expand and solve.</strong></p>
         ${sum('2x + 10 = 4x − 4<br>14 = 2x, so x = 7')}
         ${ans('7')}`,
        `<p><strong>Letters on the bottom work the same way.</strong></p>
         ${sum('2/(x + 4) = 5/(x − 2)<br>2(x − 2) = 5(x + 4)<br>2x − 4 = 5x + 20, so x = −8')}`
      )}
      ${tip('Cross-multiplying only works when there is exactly one fraction on each side. Type a negative answer like -8.')}`,

    // y9-8K Q4: x in the denominator
    'y9-8k-xbottom': `
      <p class="hp-tag">Worked example: solve <b>4/x − 1/(3x) = 2</b></p>
      ${steps(
        `<p><strong>Multiply every term by the LCD, 3x.</strong></p>
         ${sum('3x × 4/x − 3x × 1/(3x) = 3x × 2<br>12 − 1 = 6x')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('11 = 6x, so x = 11/6')}
         ${ans('11/6')}`
      )}
      ${tip('Type a fraction answer as top/bottom, like 11/6. Check it in the original equation if you can.')}`,

    // y9-8K Q6, Q7, Q9: writing an equation from words
    'y9-8k-words': `
      <p class="hp-tag">Worked example: half of a number plus a third of the same number is 20.</p>
      ${steps(
        `<p><strong>Write the equation.</strong></p>
         ${sum('x/2 + x/3 = 20')}`,
        `<p><strong>Multiply by 6 and solve.</strong></p>
         ${sum('3x + 2x = 120, so x = 24')}
         ${ans('x/2+x/3=20, 24')}`,
        `<p><strong>Reciprocals:</strong> one number is twice another and the sum of their reciprocals is 3/8. With x the smaller, 1/x + 1/(2x) = 3/8. Times 8x: 8 + 4 = 3x, so x = 4 and the numbers are 4 and 8.</p>`
      )}
      ${tip('The reciprocal of x is 1/x. "A quarter of twice the number" is 2x/4. Type an equation with the = sign in it.')}`,

    // y9-8K Q8: choosing a method
    'y9-8k-mixed': `
      <p class="hp-tag">Worked example: solve <b>3/(x − 1) − 1/(x + 4) = 7/((x − 1)(x + 4))</b></p>
      ${steps(
        `<p><strong>Multiply every term by the LCD, (x − 1)(x + 4).</strong></p>
         ${sum('3(x + 4) − (x − 1) = 7')}`,
        `<p><strong>Expand and solve.</strong></p>
         ${sum('3x + 12 − x + 1 = 7<br>2x + 13 = 7, so x = −3')}
         ${ans('-3')}`,
        `<p><strong>One fraction equal to a number:</strong> (3x − 2)/(x + 1) = 4. Multiply by (x + 1): 3x − 2 = 4x + 4, so x = −6.</p>`
      )}
      ${tip('Check your answer does not make any bottom equal 0. Here x = −3 gives −4 and 1, which is fine.')}`,

    // y9-8K Q12: decimal equations
    'y9-8k-decimal': `
      <p class="hp-tag">Worked example: solve <b>0.8x − 2.5 = 1.5</b></p>
      ${steps(
        `<p><strong>Multiply every term by 10</strong> to clear the decimals.</p>
         ${sum('8x − 25 = 15')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('8x = 40, so x = 5')}
         ${ans('5')}`,
        `<p><strong>Two decimal places? Multiply by 100.</strong> 1.75x + 0.5 = 4 becomes 175x + 50 = 400, so 175x = 350 and x = 2.</p>`
      )}
      ${tip('Multiply by enough to clear the longest decimal. If the answer is not a whole number, type it as a fraction like 18/7.')}`,

    // y9-8K Q13: making x the subject
    'y9-8k-literal': `
      <p class="hp-tag">Worked example: solve <b>(ax + 2)/x = b</b> for x.</p>
      ${steps(
        `<p><strong>Clear the fraction.</strong> Multiply both sides by x.</p>
         ${sum('ax + 2 = bx')}`,
        `<p><strong>Get every x term on one side, then factorise.</strong></p>
         ${sum('2 = bx − ax = x(b − a)')}`,
        `<p><strong>Divide by the bracket.</strong></p>
         ${ans('x=2/(b-a)')}`
      )}
      <p><strong>Two fractions:</strong> x/p + x/q = 1. Times pq: qx + px = pq, so x(p + q) = pq and x = pq/(p + q).</p>
      ${tip('When x appears in two terms, factorising is the step that gets it on its own. Type x= then the answer, with brackets round a bottom of two terms.')}`
  });
})();
