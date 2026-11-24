/* H3 help panels for Year 8 Chapter 5. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 5A to 5K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 5A The language of algebra
    // =====================================================================
    // Y8 5A Q1, Q2, Q3, Q4: terms, coefficients and constants
    'y8-5a-terms': `
      <p class="hp-tag">Worked example: look at <b>6x − y + 4xy − 9 + 2x²</b></p>
      ${steps(
        `<p><strong>Split it at every + and − sign.</strong> The sign in front of a term belongs to it.</p>
         ${chips(['6x'], ['−y'], ['4xy'], ['−9'], ['2x²'])}
         <p>To list them, type them with commas and keep the minus signs: 6x, -y, 4xy, -9, 2x^2</p>`,
        `<p><strong>A coefficient is the number in front of a letter, sign included.</strong> The coefficient of x is 6. The terms 4xy and 2x² are different terms, so they do not count. The coefficient of y is −1, because −y means −1 × y.</p>`,
        `<p><strong>A letter that is not there has coefficient 0.</strong> There is no z term, so the coefficient of z is 0. The constant (the term with no letter) is −9.</p>
         ${ans('x: 6, y: -1, z: 0')}`
      )}
      ${tip('Type a squared letter with ^, so x² is x^2. When a question asks for several coefficients, type them in the order asked, separated by commas.')}`,

    // Y8 5A Q5, Q6, Q14: turning words into algebra
    'y8-5a-words': `
      ${chips(['sum, more than, added → +'], ['difference, less than → −'], ['product, times → ×'], ['quotient, divided by → ÷'])}
      <p class="hp-tag">Worked example: write (a) <b>7 less than the product of 3 and w</b>, (b) <b>the quotient of x and 5y</b>, (c) <b>a fifth of r is taken from 8</b>.</p>
      ${steps(
        `<p><strong>Build it in the order the words give it.</strong> The product of 3 and w is 3w. Then 7 less than that:</p>
         ${sum('(a) 3w − 7')}`,
        `<p><strong>Quotient means divide.</strong> The first thing named goes on top.</p>
         ${sum('(b) x ÷ 5y = x/(5y)')}
         <p>Type x/(5y). The bracket keeps all of 5y on the bottom; x/5y would mean x/5 × y.</p>`,
        `<p><strong>"Taken from 8" means 8 comes first.</strong> A fifth of r is r/5.</p>
         ${sum('(c) 8 − r/5')}
         ${ans('3w-7, x/(5y), 8-r/5')}`
      )}
      <p><strong>Brackets change the meaning.</strong> 3(w + 5) means "add 5 to w, then triple the result". 3w + 5 means "triple w, then add 5".</p>
      ${tip('"The square of w" and "w multiplied by itself" are both w², typed w^2.')}`,

    // Y8 5A Q7, Q8, Q9, Q10, Q11: expressions from a story
    'y8-5a-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A hire scooter costs <span class="hp-hl">50 cents</span> to unlock, then <span class="hp-hl">20 cents</span> per minute. Write the cost of a ride of t minutes (a) in cents, (b) in dollars. (c) Write the cost in dollars of a ride of t hours.</p>
      ${steps(
        `<p><strong>A fee is paid once. A rate is paid for every minute.</strong></p>
         ${sum('(a) 50 + 20t')}`,
        `<p><strong>Cents to dollars: divide every term by 100.</strong> 50 cents is $0.50 and 20 cents is $0.20.</p>
         ${sum('(b) 0.5 + 0.2t')}`,
        `<p><strong>Hours: work out the cost of one hour.</strong> An hour is 60 minutes, so one hour costs 60 lots of $0.20, which is $12.</p>
         ${sum('(c) 0.5 + 12t')}
         ${ans('50+20t, 0.5+0.2t, 0.5+12t')}`
      )}
      <p><strong>A price change for each item?</strong> If a $p ticket drops by $6, one ticket costs p − 6, so 5 tickets cost 5(p − 6). The brackets show the whole new price is multiplied.</p>
      ${tip('Check with a real number. A 10-minute ride: 50 + 200 = 250 cents, which is $2.50. A fortnight is 2 weeks.')}`,

    // Y8 5A Q12, Q13: always, could or never
    'y8-5a-truefalse': `
      <p class="hp-tag">Worked example: p is a positive number. True or false? (a) <b>p/2 is always smaller than p</b> (b) <b>p − 1 is always positive</b></p>
      ${steps(
        `<p><strong>Try a whole number and a small decimal.</strong></p>
         ${sum('(a) p = 6: 6/2 = 3, smaller than 6<br>&nbsp;&nbsp;&nbsp;&nbsp;p = 0.5: 0.5/2 = 0.25, smaller than 0.5')}
         <p>Half of any positive number is smaller, so (a) is <b>true</b>.</p>`,
        `<p><strong>One example that fails is enough for "false".</strong></p>
         ${sum('(b) p = 0.5: 0.5 − 1 = −0.5, not positive')}
         ${ans('True, False')}`,
        `<p><strong>Negative numbers work the same way.</strong> If n is negative, can n² be negative? Try n = −3: (−3)² = 9. A negative times a negative is always positive, so n² can never be negative.</p>`
      )}
      ${tip('"Always" or "must" needs every value to work. "Could" needs just one. Always test a number between 0 and 1 as well as a whole number.')}`,

    // Y8 5A Q15: coefficients that follow a pattern
    'y8-5a-pattern': `
      <p class="hp-tag">Worked example: an expression starts <b>5a + 8b + 11c + 14d + 17e + ...</b></p>
      ${steps(
        `<p><strong>Number the letters</strong>: a = 1, b = 2, c = 3, and so on up to z = 26. The coefficients go up by 3 each time, so each one is 3 × (place) + 2.</p>
         ${fig({ kind: 'table', rows: [['Place', '1', '2', '3', '4'], ['Coefficient', '5', '8', '11', '14']] })}`,
        `<p><strong>Use the rule.</strong> j is letter 10: 3 × 10 + 2 = 32. Which letter has coefficient 50? Work backwards: 50 − 2 = 48, 48 ÷ 3 = 16, and letter 16 is p.</p>
         ${ans('j: 32, letter p')}`,
        `<p><strong>Doubling coefficients?</strong> For 5a + 10b + 20c + 40d, the sum is 75. Shortcut: 1 + 2 + 4 + 8 = 15, one less than the next double (16), and 5 × 15 = 75.</p>`
      )}
      ${tip('Look at the gaps between coefficients. Equal gaps mean "times the gap, plus or minus something". Gaps that grow by 2 each time point to square numbers.')}`,

    // =====================================================================
    // 5B Substitution and equivalence
    // =====================================================================
    // Y8 5B Q1, Q2, Q3, Q4: substituting values
    'y8-5b-sub': `
      <p class="hp-tag">Worked example: if <b>k = −6</b>, evaluate <b>4k + 10</b> and <b>7 − k</b>. Then evaluate <b>2ab − b</b> when <b>a = 4</b> and <b>b = 7</b>.</p>
      ${steps(
        `<p><strong>Put the × sign back, and put a negative number in brackets.</strong></p>
         ${sum(`4k + 10 = ${now('4 × (−6)')} + 10 = −24 + 10 = −14`)}`,
        `<p><strong>Taking away a negative is the same as adding.</strong></p>
         ${sum('7 − k = 7 − (−6) = 7 + 6 = 13')}`,
        `<p><strong>Two letters: swap each one for its own number.</strong> 2ab means 2 × a × b.</p>
         ${sum(`${now('2 × 4 × 7')} − 7 = 56 − 7 = 49`)}
         ${ans('-14, 13, 49')}`
      )}
      ${tip('Never write the digits side by side. With k = −6, 4k is −24, not 4−6. Type a negative answer with a minus sign, like -14.')}`,

    // Y8 5B Q5, Q8: harder substitution with negatives, fractions and squares
    'y8-5b-negatives': `
      <p class="hp-tag">Worked example: if <b>a = −3</b> and <b>b = 4</b>, evaluate <b>12/a + b²</b>, <b>2ab − 7b</b> and <b>(a − 2)²</b>.</p>
      ${steps(
        `<p><strong>Fractions and powers first, then add.</strong></p>
         ${sum('12 ÷ (−3) + 4² = −4 + 16 = 12')}`,
        `<p><strong>Do each term separately, watching the signs.</strong></p>
         ${sum('2 × (−3) × 4 = −24 and 7 × 4 = 28<br>−24 − 28 = −52')}`,
        `<p><strong>Brackets first, then square.</strong></p>
         ${sum('(−3 − 2)² = (−5)² = 25')}
         ${ans('12, -52, 25')}`
      )}
      ${tip('A negative squared is positive: (−5)² = 25. On a calculator, type the brackets, because −5² gives −25.')}`,

    // Y8 5B Q6, Q7, Q9: equivalent expressions
    'y8-5b-equiv': `
      <p class="hp-tag">Worked example: two of these are equivalent. Which is the odd one out? <b>5(w − 2)</b>, <b>5w − 2</b>, <b>−10 + 5w</b></p>
      ${steps(
        `<p><strong>Write each one in its simplest form.</strong> Expand any brackets.</p>
         ${sum('5(w − 2) = 5w − 10')}`,
        `<p><strong>Reorder the terms.</strong> Terms can swap places as long as each keeps its own sign.</p>
         ${sum('−10 + 5w = 5w − 10')}`,
        `<p><strong>Check with a number</strong>, say w = 3.</p>
         ${sum('5(3 − 2) = 5, &nbsp; 5 × 3 − 2 = 13, &nbsp; −10 + 15 = 5')}
         ${ans('5w - 2')}`
      )}
      ${tip('Equivalent means equal for every value of the letters. Watch the signs when you swap: 8 − h is −h + 8, not h − 8.')}`,

    // Y8 5B Q13, Q14, Q15, Q16: testing whether two expressions are equivalent
    'y8-5b-test': `
      <p class="hp-tag">Worked example: are <b>(a + 2)²</b> and <b>a² + 4</b> equivalent?</p>
      ${steps(
        `<p><strong>Try a = 0.</strong></p>
         ${sum('(0 + 2)² = 4 &nbsp; and &nbsp; 0² + 4 = 4')}
         <p>Equal, but one value is not enough to prove they are equivalent.</p>`,
        `<p><strong>Try another value, a = 1.</strong></p>
         ${sum('(1 + 2)² = 9 &nbsp; and &nbsp; 1² + 4 = 5')}
         <p>Different. One value that fails proves they are <b>not</b> equivalent. They are equal only when a = 0.</p>
         ${ans('Not equivalent')}`
      )}
      <p><strong>Never equal?</strong> x + 1 and x + 4 always differ by 3, whatever x is. <strong>Order of dividing matters too:</strong> 24 ÷ (6 ÷ 2) = 8 but (24 ÷ 6) ÷ 2 = 2.</p>
      ${tip('Test several kinds of numbers: 0, 1, a bigger whole number and a negative. If every test matches, they are probably equivalent.')}`,

    // Y8 5B Q10: when is the result negative?
    'y8-5b-inequality': `
      <p class="hp-tag">Worked example: a number is substituted for x in <b>20 − 4x</b> and the result is negative. Describe x.</p>
      ${steps(
        `<p><strong>Find the value that gives exactly 0.</strong></p>
         ${sum('20 − 4x = 0 when 4x = 20, so x = 5')}`,
        `<p><strong>Test a number on each side of 5.</strong></p>
         ${sum('x = 6: 20 − 24 = −4 (negative ✓)<br>x = 4: 20 − 16 = 4 (positive ✗)')}`,
        `<p><strong>Write the inequality.</strong> x has to be bigger than 5.</p>
         ${ans('x>5')}`
      )}
      ${tip('Type > for "greater than" and < for "less than", like x>5. The arrow end points at the smaller side.')}`,

    // Y8 5B Q11, Q18: completing a table of values
    'y8-5b-table': `
      <p class="hp-tag">Worked example: complete the table.</p>
      ${fig({ kind: 'table', rows: [['Column', '1', '2', '3'], ['x', '2', '?', '−1'], ['2x + 5', '?', '17', '?'], ['10 − x', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Where x is known, substitute.</strong></p>
         ${sum('Column 1: 2 × 2 + 5 = 9, 10 − 2 = 8<br>Column 3: 2 × (−1) + 5 = 3, 10 − (−1) = 11')}`,
        `<p><strong>Where x is missing, work backwards.</strong> 2x + 5 = 17: take off 5 to get 12, then halve: x = 6. Then 10 − 6 = 4.</p>`,
        `<p><strong>Type each column's missing values from top to bottom.</strong></p>
         ${ans('Column 1: 9, 8 &nbsp; Column 2: 6, 4 &nbsp; Column 3: 3, 11')}`
      )}
      <p><strong>Two letters?</strong> If a + b = 13 and a − b = 5, add the two: 2a = 18, so a = 9, and then b = 13 − 9 = 4.</p>
      ${tip('Check a backwards answer by putting it back in: 2 × 6 + 5 = 17 ✓.')}`,

    // Y8 5B Q12: integer values that fit
    'y8-5b-integers': `
      <p class="hp-tag">Worked example: a and b are integers (positive, negative or zero).</p>
      ${steps(
        `<p><strong>ab = 10.</strong> a must be a factor of 10. Negatives count too, because a negative times a negative is positive.</p>
         ${sum('a = −10, −5, −2, −1, 1, 2, 5, 10')}`,
        `<p><strong>a + b = 10.</strong> Pick any a and set b = 10 − a: 11 and −1, 12 and −2, and so on forever. There are infinitely many pairs.</p>`,
        `<p><strong>ab = a + b + 1.</strong> Try values of a one at a time and solve for b. Keep only whole-number answers.</p>
         ${sum('a = 2: 2b = b + 3, so b = 3 ✓<br>a = 3: 3b = b + 4, so b = 2 ✓<br>a = 4: 4b = b + 5, so b = 5/3 ✗')}
         <p>Do the same with a = 1, 0, −1, −2, ... Here the full list is a = −1, 0, 2, 3.</p>
         ${ans('-1, 0, 2, 3')}`
      )}
      ${tip('Type a list of values separated by commas, smallest first. Remember to test zero and the negatives.')}`,

    // =====================================================================
    // 5C Adding and subtracting terms
    // =====================================================================
    // Y8 5C Q1, Q2, Q3: like terms or not
    'y8-5c-like': `
      <p class="hp-tag">Worked example: are <b>7xy²</b> and <b>2y²x</b> like terms? Are <b>4x²y</b> and <b>4xy²</b>?</p>
      ${steps(
        `<p><strong>Ignore the numbers. Count each letter.</strong> 7xy² is x × y × y. 2y²x is y × y × x. Same letters, same powers.</p>
         ${ans('Like terms')}`,
        `<p><strong>Now the second pair.</strong> 4x²y is x × x × y, but 4xy² is x × y × y. The powers are on different letters.</p>
         ${ans('Not like terms')}`
      )}
      ${chips(['5ab and −3ba: like', 'add'], ['6p and 6p²: not like', 'take'], ['2mn and 2m: not like', 'take'])}
      ${tip('Like terms need exactly the same letters with the same powers. The order of the letters and the number in front do not matter.')}`,

    // Y8 5C Q4, Q5, Q6, Q13: collecting like terms
    'y8-5c-collect': `
      <p class="hp-tag">Worked example: simplify <b>7a − 2ab + 3 − 9a + 5ba − 8</b></p>
      ${steps(
        `<p><strong>Group the like terms.</strong> Each term takes the sign in front of it.</p>
         ${chips(['7a', 'add'], ['−9a', 'add'], ['−2ab'], ['5ba'], ['3', 'take'], ['−8', 'take'])}`,
        `<p><strong>Combine each group.</strong> ab and ba are the same.</p>
         ${sum('a terms: 7a − 9a = −2a<br>ab terms: −2ab + 5ab = 3ab<br>numbers: 3 − 8 = −5')}`,
        `<p><strong>Write the groups together.</strong></p>
         ${ans('-2a+3ab-5')}`
      )}
      ${tip('Powers work the same way: 6x²y + 2yx² = 8x²y, typed 8x^2y. A term like 1ab is written ab, and the order of the terms does not matter.')}`,

    // Y8 5C Q14: checking with numbers
    'y8-5c-check': `
      <p class="hp-tag">Worked example: is <b>3a + 4b</b> equivalent to <b>7ab</b>?</p>
      ${steps(
        `<p><strong>Substitute a = 3 and b = 5 into both.</strong></p>
         ${sum('3a + 4b = 9 + 20 = 29<br>7ab = 7 × 3 × 5 = 105')}`,
        `<p><strong>Different answers</strong>, so they are not equivalent. 3a and 4b are unlike terms, so they cannot be added into one term.</p>
         ${ans('Not equivalent')}`
      )}
      <p><strong>Could they ever be equal?</strong> Yes, for some values. With a = 0 and b = 0 both are 0. But 3a + 4a always equals 7a, because those are like terms.</p>
      ${tip('"Equal for some values" is not the same as "equivalent". Equivalent means equal for every value.')}`,

    // Y8 5C Q7, Q8: perimeters and totals
    'y8-5c-perimeter': `
      <p class="hp-tag">Worked example: write the perimeter of this rectangle in simplest form.</p>
      ${fig({ kind: 'rect', cols: [['5x', 2]], rows: [['2x', 1]] })}
      ${steps(
        `<p><strong>Add all four sides.</strong> A rectangle has two of each.</p>
         ${sum('5x + 2x + 5x + 2x')}`,
        `<p><strong>Collect the like terms.</strong></p>
         ${ans('14x')}`
      )}
      <p><strong>Totals in a story.</strong> Pens cost $p. Ana buys k pens, Ben buys twice as many as Ana (2k) and Cal buys 4 times as many as Ben (8k). Altogether that is k + 2k + 8k = 11k pens, costing 11k × p = 11kp dollars.</p>
      ${tip('In a shape with only right angles, the short sides on one side add up to the long side opposite. Find any missing side before you add.')}`,

    // Y8 5C Q9, Q11, Q15: missing numbers
    'y8-5c-missing': `
      <p class="hp-tag">Worked example: <b>9a + 2b − □a + □b = 4a + 10b</b>. Find the missing numbers.</p>
      ${steps(
        `<p><strong>Match the a terms.</strong> 9 take away something leaves 4.</p>
         ${sum('9 − □ = 4, so □ = 5')}`,
        `<p><strong>Match the b terms.</strong></p>
         ${sum('2 + □ = 10, so □ = 8')}
         ${ans('5, 8')}`
      )}
      <p><strong>How many ways?</strong> For □x + □y + □x = 6x + 2y with positive whole numbers, the y box must be 2 and the two x boxes add to 6: (1 and 5), (2 and 4), (3 and 3), (4 and 2), (5 and 1). That is 5 ways.</p>
      ${tip('Subtracting is adding a negative: 8w − 3w is 8w + (−3w). To make a term vanish, add its opposite: 6pq + (−6)qp = 0.')}`,

    // Y8 5C Q10, Q16: addition grid puzzles
    'y8-5c-grid': `
      <p class="hp-tag">Worked example: each row adds to the box on its right and each column adds to the box below it.</p>
      ${sum('3a + A = 8a<br>B + 2b = C<br>3a + B = 7a<br>A + 2b = D')}
      ${steps(
        `<p><strong>Start with a line that has only one unknown.</strong> Row 1: what adds to 3a to make 8a?</p>
         ${sum('A = 8a − 3a = 5a')}`,
        `<p><strong>Use column 1 the same way.</strong></p>
         ${sum('B = 7a − 3a = 4a')}`,
        `<p><strong>Now the other lines have one unknown each.</strong></p>
         ${sum('C = 4a + 2b &nbsp; D = 5a + 2b')}
         ${ans('A = 5a, B = 4a, C = 4a+2b, D = 5a+2b')}`
      )}
      ${tip('Check the corner: the row totals and the column totals must add to the same thing. Here 8a + C = 7a + D = 12a + 2b ✓.')}`,

    // Y8 5C Q12: a long alternating sum
    'y8-5c-pattern': `
      <p class="hp-tag">Worked example: simplify <b>3k − 6k + 9k − 12k + ... + 57k − 60k</b></p>
      ${steps(
        `<p><strong>Pair the terms up.</strong> Each pair is the same.</p>
         ${sum('(3k − 6k) + (9k − 12k) + ... = −3k + (−3k) + ...')}`,
        `<p><strong>Count the pairs.</strong> The coefficients go 3, 6, 9, ... 60, which is 60 ÷ 3 = 20 terms, so 10 pairs.</p>`,
        `<p><strong>Multiply.</strong></p>
         ${sum('10 × (−3k) = −30k')}
         ${ans('-30k')}`
      )}
      ${tip('Write out the first few and the last few terms so you can see the pattern, then count carefully.')}`,

    // =====================================================================
    // 5D Multiplying and dividing terms
    // =====================================================================
    // Y8 5D Q1, Q2, Q3, Q11: multiplying terms
    'y8-5d-multiply': `
      <p class="hp-tag">Worked example: simplify <b>7xy² × 8x</b> and <b>−5a × 9ab</b></p>
      ${steps(
        `<p><strong>Multiply the numbers.</strong></p>
         ${sum('7 × 8 = 56')}`,
        `<p><strong>Multiply the letters. Count how many of each.</strong> x × x = x², and y² stays as it is.</p>
         ${sum('7xy² × 8x = 56x²y²')}`,
        `<p><strong>Watch the signs.</strong> Negative × positive is negative. a × a = a², and b comes along.</p>
         ${sum('−5a × 9ab = −45a²b')}
         ${ans('56x^2y^2, -45a^2b')}`
      )}
      ${tip('Type powers with ^ and letters in alphabetical order: 56x^2y^2. A negative times a negative is positive. With whole-number letters, 56x²y² is always a multiple of 56.')}`,

    // Y8 5D Q4, Q12, Q13: dividing terms
    'y8-5d-divide': `
      <p class="hp-tag">Worked example: simplify <b>20a²b / (−35ab²)</b></p>
      ${steps(
        `<p><strong>Numbers: divide top and bottom by their HCF.</strong> The HCF of 20 and 35 is 5. One negative makes the answer negative.</p>
         ${sum('20/(−35) = −4/7')}`,
        `<p><strong>Letters: cancel what is on the top and the bottom.</strong> a²/a leaves a on top. b/b² leaves b on the bottom.</p>
         ${sum('a²b/(ab²) = a/b')}`,
        `<p><strong>Put it together.</strong></p>
         ${ans('-4a/(7b)')}`
      )}
      <p><strong>Dividing undoes multiplying.</strong> 30m⁵n/(6m²) = 5m³n, because 6m² × 5m³n = 30m⁵n.</p>
      ${tip('Type the bottom in brackets when it has more than one part: -4a/(7b). Careful: 5x/2 is the same as 5/2 × x, but 5/(2x) has the x on the bottom, so it is different.')}`,

    // Y8 5D Q5, Q7: missing terms
    'y8-5d-missing': `
      <p class="hp-tag">Worked example: fill in the box. (a) <b>9x × □ = 63xy²</b> (b) <b>□ ÷ 6m = 4n</b> (c) <b>32ab ÷ □ = −4b</b></p>
      ${steps(
        `<p><strong>Multiplying: what is missing?</strong> 9 × 7 = 63. The x is already there, y² is not.</p>
         ${sum('(a) □ = 7y²')}`,
        `<p><strong>Dividing to get an answer: multiply back.</strong></p>
         ${sum('(b) □ = 6m × 4n = 24mn')}`,
        `<p><strong>Dividing by the box: divide instead.</strong> 32 ÷ (−4) = −8, and the a must cancel.</p>
         ${sum('(c) □ = 32ab ÷ (−4b) = −8a')}
         ${ans('7y^2, 24mn, -8a')}`
      )}
      ${tip('Check by putting your answer in the box: 9x × 7y² = 63xy² ✓.')}`,

    // Y8 5D Q6, Q8, Q9, Q10: area and volume
    'y8-5d-area': `
      <p class="hp-tag">Worked example: find the area of this rectangle.</p>
      ${fig({ kind: 'rect', cols: [['9w', 2]], rows: [['2v', 1]] })}
      ${steps(
        `<p><strong>Area = length × width.</strong></p>
         ${sum('9w × 2v = 18vw')}
         ${ans('18vw')}`,
        `<p><strong>An L-shape? Split it into rectangles</strong>, find each area, then add. Parts 6a by 5b and a by 2b:</p>
         ${sum('30ab + 2ab = 32ab')}`
      )}
      <p><strong>Volume:</strong> a box with height h, width 2h and length 5h has volume 5h × 2h × h = 10h³. <strong>Area ÷ perimeter:</strong> for a 2k by 2k square, 4k² ÷ 8k = k/2.</p>
      ${tip('Look for sides with the same marks: they are equal. Work out any missing side from the sides you know before multiplying.')}`,

    // Y8 5D Q14: multiply, collect, then divide
    'y8-5d-mixed': `
      <p class="hp-tag">Worked example: simplify <b>(5x × 4xy − 6x²y) / (10xy + 4yx)</b></p>
      ${steps(
        `<p><strong>Top: multiply first, then collect like terms.</strong></p>
         ${sum('20x²y − 6x²y = 14x²y')}`,
        `<p><strong>Bottom: collect like terms.</strong> xy and yx match.</p>
         ${sum('10xy + 4yx = 14xy')}`,
        `<p><strong>Divide and cancel.</strong></p>
         ${sum('14x²y / (14xy) = x')}
         ${ans('x')}`
      )}
      ${tip('Treat the top and the bottom as if they were in brackets. Finish each one before you cancel anything.')}`,

    // =====================================================================
    // 5E Adding and subtracting algebraic fractions
    // =====================================================================
    // Y8 5E Q1, Q2, Q3: lowest common denominator and equivalent fractions
    'y8-5e-lcd': `
      <p class="hp-tag">Worked example: find the LCD of <b>x/12</b> and <b>y/16</b>. Then fill the gap: <b>7y/8 = ?/40</b></p>
      ${steps(
        `<p><strong>List multiples of the bigger denominator.</strong></p>
         ${sum('16, 32, 48, ...')}`,
        `<p><strong>Stop at the first one the other denominator goes into.</strong> 12 does not go into 16 or 32, but 48 ÷ 12 = 4.</p>
         ${ans('48')}`,
        `<p><strong>Equivalent fraction: do the same to the top as the bottom.</strong> 8 became 40, so it was multiplied by 5. Multiply the top by 5 too.</p>
         ${sum('7y × 5 = 35y')}
         ${ans('35y')}`
      )}
      ${tip('If one denominator goes into the other, the bigger one is the LCD. If they share no factor, multiply them together.')}`,

    // Y8 5E Q4, Q5, Q11: adding and subtracting algebraic fractions
    'y8-5e-add': `
      <p class="hp-tag">Worked example: simplify <b>3x/8 + x/6</b></p>
      ${steps(
        `<p><strong>Find the LCD.</strong> Multiples of 8: 8, 16, 24. 6 goes into 24.</p>`,
        `<p><strong>Rewrite each fraction over 24.</strong></p>
         ${sum('3x/8 = 9x/24 &nbsp; and &nbsp; x/6 = 4x/24')}`,
        `<p><strong>Add the tops. The bottom stays the same.</strong></p>
         ${sum('9x/24 + 4x/24 = 13x/24')}
         ${ans('13x/24')}`
      )}
      <p><strong>Subtracting</strong> works the same way: y/6 − 4y/9 = 3y/18 − 8y/18 = −5y/18, typed -5y/18. <strong>Simplify at the end:</strong> 7c/10 + c/10 = 8c/10 = 4c/5.</p>
      ${tip('Never add the denominators. Make them the same first, then add or subtract the numerators only.')}`,

    // Y8 5E Q6: whole terms, different letters and numbers
    'y8-5e-mixed': `
      <p class="hp-tag">Worked example: write each as a single fraction. (a) <b>4y + 2y/7</b> (b) <b>a/3 − 2b/5</b> (c) <b>3 + y/2</b></p>
      ${steps(
        `<p><strong>A whole term is a fraction over 1.</strong> Turn it into sevenths.</p>
         ${sum('(a) 4y = 28y/7, so 28y/7 + 2y/7 = 30y/7')}`,
        `<p><strong>Different letters cannot combine</strong>, so they stay as two terms on top.</p>
         ${sum('(b) 5a/15 − 6b/15 = (5a − 6b)/15')}`,
        `<p><strong>A number works the same way.</strong></p>
         ${sum('(c) 3 = 6/2, so the answer is (6 + y)/2')}
         ${ans('30y/7, (5a-6b)/15, (6+y)/2')}`
      )}
      ${tip('When the top has two terms, type it in brackets: (5a-6b)/15. Without them, 5a-6b/15 means only the 6b is divided.')}`,

    // Y8 5E Q7, Q8, Q9, Q10: fractions in a story
    'y8-5e-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Sam earns <span class="hp-hl">$m</span>. He spends <span class="hp-hl">1/3</span> of it on clothes and <span class="hp-hl">1/5</span> of it on games. Write a single fraction for what he spends.</p>
      ${steps(
        `<p><strong>"A third of m" is m/3.</strong></p>
         ${sum('clothes: m/3 &nbsp; games: m/5')}`,
        `<p><strong>Add them over the LCD, 15.</strong></p>
         ${sum('5m/15 + 3m/15 = 8m/15')}
         ${ans('8m/15')}`,
        `<p><strong>Check with a number.</strong> If m = 60: 20 + 12 = 32, and 8 × 60 ÷ 15 = 32 ✓.</p>`
      )}
      <p><strong>Share, then spend.</strong> $s shared by 4 people, then one spends $10 of their share: s/4 − 10 = s/4 − 40/4 = (s − 40)/4.</p>
      ${tip('m/3 + m/5 is not 2m/8. Substituting a number is a quick way to test whether two expressions are equivalent.')}`,

    // Y8 5E Q12: three fractions at once
    'y8-5e-three': `
      <p class="hp-tag">Worked example: simplify <b>y/2 + y/3 − y/9</b></p>
      ${steps(
        `<p><strong>Find one denominator that all three go into.</strong> 2, 3 and 9 all go into 18.</p>`,
        `<p><strong>Rewrite each fraction.</strong></p>
         ${sum('9y/18 + 6y/18 − 2y/18')}`,
        `<p><strong>Combine the tops.</strong></p>
         ${sum('(9y + 6y − 2y)/18 = 13y/18')}
         ${ans('13y/18')}`
      )}
      <p><strong>A number on the end?</strong> w/4 + w/12 + 5 = 3w/12 + w/12 + 5 = w/3 + 5 = (w + 15)/3.</p>
      ${tip('Simplify the fraction part first if you can, then bring in the whole number. Type a top with two terms in brackets.')}`,

    // =====================================================================
    // 5F Multiplying and dividing algebraic fractions
    // =====================================================================
    // Y8 5F Q1, Q2, Q3, Q5: multiplying algebraic fractions
    'y8-5f-multiply': `
      <p class="hp-tag">Worked example: simplify <b>7m/12 × 8n/21</b></p>
      ${steps(
        `<p><strong>Cancel first.</strong> Any top can cancel with any bottom.</p>
         ${sum('7 and 21: both divide by 7 → 1 and 3<br>8 and 12: both divide by 4 → 2 and 3')}`,
        `<p><strong>Multiply the tops, then the bottoms.</strong></p>
         ${sum('(1m × 2n)/(3 × 3) = 2mn/9')}
         ${ans('2mn/9')}`
      )}
      <p><strong>A whole number is a fraction over 1.</strong> 6 × 5y/8 = 30y/8 = 15y/4. Dividing by a whole number is multiplying by 1 over it: 3y/5 ÷ 2 = 3y/10.</p>
      ${tip('If a letter ends up on the bottom, type the bottom in brackets, like 3/(4x). Cancelling before you multiply keeps the numbers small.')}`,

    // Y8 5F Q4, Q9, Q11: dividing algebraic fractions
    'y8-5f-divide': `
      <p class="hp-tag">Worked example: simplify <b>4a/9 ÷ 6b/15</b></p>
      ${steps(
        `<p><strong>Keep the first fraction, change ÷ to ×, flip the second.</strong></p>
         ${sum('4a/9 × 15/(6b)')}`,
        `<p><strong>Cancel.</strong></p>
         ${sum('4 and 6: divide by 2 → 2 and 3<br>15 and 9: divide by 3 → 5 and 3')}`,
        `<p><strong>Multiply across.</strong></p>
         ${sum('(2a × 5)/(3 × 3b) = 10a/(9b)')}
         ${ans('10a/(9b)')}`
      )}
      <p><strong>Whole numbers and single letters.</strong> 2 ÷ y/7 = 2 × 7/y = 14/y. Dividing 1 by a fraction just flips it: 1 ÷ 3/k = k/3.</p>
      ${tip('Only flip the fraction after the ÷ sign. Type the bottom in brackets: 10a/(9b).')}`,

    // Y8 5F Q6, Q7, Q8, Q12: fractions of amounts and areas
    'y8-5f-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A garden bed is <span class="hp-hl">x</span> m wide and <span class="hp-hl">y</span> m long. A herb patch takes <span class="hp-hl">3/4</span> of the width and <span class="hp-hl">2/5</span> of the length. Find its area, and what fraction of the bed it covers.</p>
      ${steps(
        `<p><strong>"Of" means multiply.</strong></p>
         ${sum('width 3x/4 &nbsp; length 2y/5')}`,
        `<p><strong>Area = width × length.</strong> Cancel the 2 into the 4.</p>
         ${sum('3x/4 × 2y/5 = 6xy/20 = 3xy/10')}`,
        `<p><strong>Fraction of the bed: patch ÷ whole bed.</strong></p>
         ${sum('3xy/10 ÷ xy = 3/10')}
         ${ans('3xy/10, 3/10')}`
      )}
      <p><strong>Changing words into fractions:</strong> increased by 50% is × 3/2, divided by 1 1/4 is ÷ 5/4, and 0.8 is 4/5. If each side of a square with side s is multiplied by 3/4, the area is (3s/4)² = 9s²/16.</p>
      ${tip('Scaling both sides of a square scales the area by the square of the number: sides × 1/2 gives area × 1/4.')}`,

    // Y8 5F Q10: all four operations on two fractions
    'y8-5f-four': `
      <p class="hp-tag">Worked example: use <b>x/3</b> and <b>x/5</b>.</p>
      ${steps(
        `<p><strong>Add and subtract: make the denominators match</strong> (15).</p>
         ${sum('5x/15 + 3x/15 = 8x/15<br>5x/15 − 3x/15 = 2x/15')}`,
        `<p><strong>Multiply: tops times tops, bottoms times bottoms.</strong></p>
         ${sum('x/3 × x/5 = x²/15')}`,
        `<p><strong>Divide: flip the second, then multiply.</strong> The x's cancel.</p>
         ${sum('x/3 × 5/x = 5/3')}
         ${ans('8x/15, 2x/15, x^2/15, 5/3')}`
      )}
      ${tip('An answer with no letter left in it has the same value whatever the letter is.')}`,

    // =====================================================================
    // 5G Expanding brackets
    // =====================================================================
    // Y8 5G Q1, Q2, Q3, Q6: the distributive law
    'y8-5g-expand': `
      <p class="hp-tag">Worked example: expand <b>8(6x − 9)</b>, then <b>−5(7 − 9b)</b>.</p>
      ${steps(
        `<p><strong>Multiply the outside by every term inside.</strong></p>
         ${sum(`${now('8')} × 6x = 48x &nbsp; and &nbsp; ${now('8')} × (−9) = −72`)}
         ${ans('48x-72')}`,
        `<p><strong>A negative outside flips every sign inside.</strong></p>
         ${sum('−5 × 7 = −35 &nbsp; and &nbsp; −5 × (−9b) = +45b')}
         ${ans('-35+45b')}`,
        `<p><strong>A letter outside works the same way.</strong></p>
         ${sum('6h(9 − k) = 54h − 6hk')}`
      )}
      <p><strong>Three terms inside?</strong> Multiply all three: −6(x + 9y − 8) = −6x − 54y + 48.</p>
      ${tip('Type letters in alphabetical order inside each term, like -6hk. A negative times a negative is positive.')}`,

    // Y8 5G Q4, Q5, Q11: expand, then collect like terms
    'y8-5g-collect': `
      <p class="hp-tag">Worked example: simplify <b>5(5a + 7) + 9(6 − a)</b></p>
      ${steps(
        `<p><strong>Expand each bracket.</strong></p>
         ${sum('5(5a + 7) = 25a + 35<br>9(6 − a) = 54 − 9a')}`,
        `<p><strong>Collect the a terms and the numbers.</strong></p>
         ${sum('25a − 9a = 16a<br>35 + 54 = 89')}
         ${ans('16a+89')}`
      )}
      <p><strong>Showing two expressions are equivalent:</strong> expand and simplify both. p(8 + q) + 5pq = 8p + pq + 5pq = 8p + 6pq. If the other one also simplifies to 8p + 6pq, they are equivalent.</p>
      ${tip('Watch for a minus in front of a bracket: −2(x − 3) gives −2x + 6, not −2x − 6.')}`,

    // Y8 5G Q7, Q8, Q9, Q14: from words to brackets
    'y8-5g-words': `
      <p class="hp-tag">Worked example: a number <b>t</b> has <b>9</b> subtracted from it and the result is multiplied by <b>6</b>.</p>
      ${steps(
        `<p><strong>Write the steps in order.</strong> "The result" goes in brackets.</p>
         ${sum('t − 9 → 6(t − 9)')}`,
        `<p><strong>Expand.</strong></p>
         ${sum('6t − 54')}
         ${ans('6t-54')}`
      )}
      <p><strong>Number tricks.</strong> Start with n, add 7, multiply by 5, take away 35: 5(n + 7) − 35 = 5n + 35 − 35 = 5n. The whole trick just multiplies by 5. In the same way, "divide x by 3, add 6, then triple" is 3(x/3 + 6) = x + 18.</p>
      ${tip('Groups of things: if each of p players gets 5 caps costing $9 each, the caps cost 9 × 5p = 45p dollars.')}`,

    // Y8 5G Q10: putting brackets back in
    'y8-5g-reverse': `
      <p class="hp-tag">Worked example: write <b>45p + 72q</b> with brackets.</p>
      ${steps(
        `<p><strong>Find the biggest number that goes into both.</strong> 9 goes into 45 and 72.</p>`,
        `<p><strong>Divide each term by it.</strong></p>
         ${sum('45p ÷ 9 = 5p &nbsp; 72q ÷ 9 = 8q')}
         ${ans('9(5p+8q)')}`,
        `<p><strong>Check by expanding:</strong> 9 × 5p = 45p ✓ and 9 × 8q = 72q ✓. A letter can go outside too: 22xy + 33xz = 11x(2y + 3z).</p>`
      )}
      ${tip('To find which one does NOT expand to an answer, expand every option and compare.')}`,

    // Y8 5G Q12: two brackets with the area model
    'y8-5g-two': `
      <p class="hp-tag">Worked example: expand <b>(y + 1)(y + 7)</b></p>
      ${fig({ kind: 'rect', cols: [['y', 3], ['+7', 2]], rows: [['y', 3], ['+1', 1]], cells: [['y²', '7y'], ['y', '7']] })}
      ${steps(
        `<p><strong>Put one bracket along the top and one down the side.</strong> Multiply to fill each box.</p>
         ${sum('y × y = y², y × 7 = 7y, 1 × y = y, 1 × 7 = 7')}`,
        `<p><strong>Add the four boxes and collect like terms.</strong></p>
         ${sum('y² + 7y + y + 7 = y² + 8y + 7')}
         ${ans('y^2+8y+7')}`
      )}
      ${tip('Every term in the first bracket multiplies every term in the second, so there are always four boxes.')}`,

    // Y8 5G Q13: the distributive law for mental arithmetic
    'y8-5g-mental': `
      <p class="hp-tag">Worked example: work out <b>6 × 409</b> in your head.</p>
      ${steps(
        `<p><strong>Split the awkward number.</strong></p>
         ${sum('6 × 409 = 6 × (400 + 9)')}`,
        `<p><strong>Multiply each part, then add.</strong></p>
         ${sum('2400 + 54 = 2454')}
         ${ans('2454')}`
      )}
      <p><strong>Other tricks.</strong> × 11: 34 × 11 = 340 + 34 = 374. Just below a ten: 52 × 9 = 520 − 52 = 468. Either side of a square: 21 × 19 = (20 + 1)(20 − 1) = 400 − 1 = 399. Ending in 5: 35² = 100 × 3 × 4 + 25 = 1225.</p>
      ${tip('Choose a split that makes one part a round number.')}`,

    // Y8 5G Q15: adding fractions with brackets on top
    'y8-5g-fractions': `
      <p class="hp-tag">Worked example: simplify <b>(x − 3)/4 + x/6</b></p>
      ${steps(
        `<p><strong>Write both over the LCD, 12.</strong> Multiply the whole top, so keep the bracket.</p>
         ${sum('3(x − 3)/12 + 2x/12')}`,
        `<p><strong>Expand the bracket and collect.</strong></p>
         ${sum('(3x − 9 + 2x)/12 = (5x − 9)/12')}
         ${ans('(5x-9)/12')}`
      )}
      ${tip('Type the top in brackets: (5x-9)/12. Forgetting the bracket in step 1 is the most common mistake: the 3 multiplies the −3 too.')}`,

    // =====================================================================
    // 5H Factorising expressions
    // =====================================================================
    // Y8 5H Q1, Q2: highest common factor
    'y8-5h-hcf': `
      <p class="hp-tag">Worked example: find the HCF of <b>16</b> and <b>28</b>, then of <b>20xy</b> and <b>−35y²</b>.</p>
      ${steps(
        `<p><strong>Numbers: list the factors and pick the biggest shared one.</strong></p>
         ${sum('16: 1, 2, 4, 8, 16<br>28: 1, 2, 4, 7, 14, 28')}
         ${ans('4')}`,
        `<p><strong>Terms: HCF of the numbers, then the letters both share.</strong> The HCF of 20 and 35 is 5. Both terms have a y; only the first has x.</p>
         ${sum('20xy = 5y × 4x<br>−35y² = 5y × (−7y)')}
         ${ans('5y')}`
      )}
      ${tip('Give the HCF as a positive term. If a letter is squared in one term but not the other, take it just once.')}`,

    // Y8 5H Q3, Q4: factorising
    'y8-5h-factorise': `
      <p class="hp-tag">Worked example: factorise <b>32pq − 24q</b></p>
      ${steps(
        `<p><strong>Find the HCF.</strong> 8 goes into 32 and 24, and both terms have q.</p>
         ${sum('HCF = 8q')}`,
        `<p><strong>Divide each term by the HCF.</strong> That is what goes inside the bracket.</p>
         ${sum('32pq ÷ 8q = 4p &nbsp; 24q ÷ 8q = 3')}
         ${ans('8q(4p-3)')}`,
        `<p><strong>Check by expanding.</strong></p>
         ${sum('8q × 4p − 8q × 3 = 32pq − 24q ✓')}`
      )}
      ${tip('Factorise fully. 4(8pq − 6q) is not finished, because 8pq and 6q still share 2q. Type the answer with the HCF in front: 8q(4p-3).')}`,

    // Y8 5H Q5, Q6: rectangles with an area expression
    'y8-5h-rect': `
      <p class="hp-tag">Worked example: a rectangle has area <b>20x + 15</b> and one side <b>5</b>. Find the other side and the perimeter.</p>
      ${fig({ kind: 'rect', cols: [['?', 3]], rows: [['5', 1]] })}
      ${steps(
        `<p><strong>Take out the side you know as a factor.</strong></p>
         ${sum('20x + 15 = 5(4x + 3)')}
         <p>So the other side is 4x + 3.</p>`,
        `<p><strong>Perimeter: two of each side.</strong></p>
         ${sum('2 × 5 + 2(4x + 3) = 10 + 8x + 6 = 8x + 16')}
         ${ans('4x+3, 8x+16')}`
      )}
      <p><strong>Know the long side instead?</strong> If the area is 10c + 15 and one side is 2c + 3, then 10c + 15 = 5(2c + 3), so the other side is 5.</p>
      ${tip('Area = side × side, so dividing the area by one side gives the other. Factorising does exactly that.')}`,

    // Y8 5H Q7: factorising in a story
    'y8-5h-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A choir stands in <span class="hp-hl">6</span> rows of <span class="hp-hl">n</span> singers. Then <span class="hp-hl">30</span> more singers join.</p>
      ${steps(
        `<p><strong>Total singers.</strong></p>
         ${sum('6n + 30')}`,
        `<p><strong>Factorise.</strong> 6 goes into both.</p>
         ${sum('6n + 30 = 6(n + 5)')}
         <p>So in 6 equal rows there are n + 5 in each row.</p>`,
        `<p><strong>Other numbers of rows:</strong> divide the total by the number of rows.</p>
         ${sum('3 rows: 2n + 10 &nbsp; 2 rows: 3n + 15')}
         ${ans('6n+30, 6(n+5), n+5')}`
      )}
      ${tip('Dividing 6n + 30 by 3 means dividing both terms by 3.')}`,

    // Y8 5H Q8: a common bracket
    'y8-5h-bracket': `
      <p class="hp-tag">Worked example: expand and simplify <b>2(k + 5) + 9(k + 5)</b>, then factorise the answer.</p>
      ${steps(
        `<p><strong>Expand and collect.</strong></p>
         ${sum('2k + 10 + 9k + 45 = 11k + 55')}`,
        `<p><strong>Factorise.</strong> 11 goes into both terms.</p>
         ${sum('11k + 55 = 11(k + 5)')}
         ${ans('11k+55, 11(k+5)')}`
      )}
      ${tip('Shortcut: 2 lots of (k + 5) plus 9 lots of (k + 5) is 11 lots of (k + 5).')}`,

    // Y8 5H Q9: factorising with the area model
    'y8-5h-grid': `
      <p class="hp-tag">Worked example: use the diagram to factorise <b>xy + 3x + 2y + 6</b></p>
      ${fig({ kind: 'rect', cols: [['y', 3], ['+3', 1]], rows: [['x', 3], ['+2', 1]], cells: [['xy', '3x'], ['2y', '6']] })}
      ${steps(
        `<p><strong>Read the sides of the big rectangle.</strong> Along the top: y + 3. Down the side: x + 2.</p>`,
        `<p><strong>Area = side × side.</strong></p>
         ${ans('(x+2)(y+3)')}`,
        `<p><strong>Check:</strong> x × y = xy, x × 3 = 3x, 2 × y = 2y, 2 × 3 = 6 ✓.</p>`
      )}
      ${tip('Type both brackets next to each other with no × sign: (x+2)(y+3).')}`,

    // Y8 5H Q11: simplifying fractions by factorising
    'y8-5h-fraction': `
      <p class="hp-tag">Worked example: simplify <b>(6x + 18)/(5x + 15)</b></p>
      ${steps(
        `<p><strong>Factorise the top and the bottom.</strong></p>
         ${sum('6x + 18 = 6(x + 3)<br>5x + 15 = 5(x + 3)')}`,
        `<p><strong>Cancel the bracket that is on both.</strong></p>
         ${sum('6(x + 3)/(5(x + 3)) = 6/5')}
         ${ans('6/5')}`
      )}
      <p><strong>A letter in the factor:</strong> (8a + 4ab)/(12a) = 4a(2 + b)/(12a) = (2 + b)/3.</p>
      ${tip('You can only cancel a factor of the whole top and the whole bottom, never a single term. Type a top with two terms in brackets: (2+b)/3.')}`,

    // =====================================================================
    // 5I Applying algebra
    // =====================================================================
    // Y8 5I Q1, Q2: cost of items
    'y8-5i-cost': `
      <p class="hp-tag">Worked example: pies cost <b>$7</b> each. Find the cost of (a) 8 pies, (b) n pies, (c) n pies when n = 12.</p>
      ${steps(
        `<p><strong>Cost = number × price.</strong></p>
         ${sum('(a) 8 × 7 = 56')}`,
        `<p><strong>Use a letter for the number.</strong></p>
         ${sum('(b) 7n')}`,
        `<p><strong>Substitute.</strong></p>
         ${sum('(c) 7 × 12 = 84')}
         ${ans('56, 7n, 84')}`
      )}
      ${tip('Type the number before the letter, with no × sign: 7n.')}`,

    // Y8 5I Q3, Q5, Q11: expressions for shapes
    'y8-5i-shape': `
      <p class="hp-tag">Worked example: write the area of the whole rectangle, then find it when x = 4.</p>
      ${fig({ kind: 'rect', cols: [['x', 3], ['6', 1]], rows: [['3', 1]] })}
      ${steps(
        `<p><strong>Whole length × width.</strong> The whole length is x + 6.</p>
         ${sum('3(x + 6)')}`,
        `<p><strong>Substitute x = 4.</strong></p>
         ${sum('3 × (4 + 6) = 3 × 10 = 30')}
         ${ans('3(x+6), 30')}`
      )}
      <p><strong>Perimeters:</strong> a regular pentagon with side t has perimeter 5t. Doubling each side gives 10t. Adding 3 to each side gives 5(t + 3).</p>
      ${tip('A length can never be negative. If substituting makes a side like a − 4 negative, those values do not make a real shape.')}`,

    // Y8 5I Q4, Q6, Q7, Q8, Q12: a fee plus an hourly rate
    'y8-5i-fee': `
      <p class="hp-tag">Worked example: a tutor charges a <b>$40</b> booking fee plus <b>$55</b> per hour.</p>
      ${steps(
        `<p><strong>The fee is paid once; the rate is paid for every hour.</strong></p>
         ${sum('cost = 40 + 55h')}`,
        `<p><strong>Substitute.</strong> For 3 hours:</p>
         ${sum(`40 + ${now('55 × 3')} = 40 + 165 = 205`)}`,
        `<p><strong>Work backwards for a budget.</strong> With $150: take off the fee, then divide by the rate.</p>
         ${sum('150 − 40 = 110, 110 ÷ 55 = 2 hours')}
         ${ans('40+55h, $205, 2 hours')}`
      )}
      <p><strong>Given with brackets?</strong> Expand it first: 10(7 + 6h) = 70 + 60h, so the fee is $70 and the rate is $60 an hour. <strong>With letters:</strong> fee $F and rate $R, so 30 minutes costs F + R/2 and t hours costs F + Rt.</p>
      ${tip('The number on its own is the fee. The number in front of h is the hourly rate.')}`,

    // Y8 5I Q9, Q13: comparing deals
    'y8-5i-deals': `
      <p class="hp-tag">Worked example: Deal A: $5 entry plus $6 a ride. Deal B: $21 entry plus $3 a ride. Deal C: $40, all rides free.</p>
      ${steps(
        `<p><strong>Write an expression for each deal.</strong></p>
         ${sum('A: 5 + 6n &nbsp; B: 21 + 3n &nbsp; C: 40')}`,
        `<p><strong>Make a table around where they cross.</strong></p>
         ${fig({ kind: 'table', rows: [['Rides', '5', '6', '7'], ['A ($)', '35', '41', '47'], ['B ($)', '36', '39', '42'], ['C ($)', '40', '40', '40']] })}`,
        `<p><strong>Read off the cheapest.</strong> A is best up to 5 rides, B is best for 6 rides, and C is best for more than 6.</p>
         ${ans('A: up to 5, B: 6, C: more than 6')}`
      )}
      ${tip('Check the rows either side of each change-over. When two deals cost the same, read the question carefully to see which one it wants.')}`,

    // Y8 5I Q10: different methods, same answer
    'y8-5i-methods': `
      <p class="hp-tag">Worked example: parking costs <b>$4</b> plus <b>$2</b> an hour. Ana adds 2 to the hours and doubles it. Ben doubles the hours and adds 4. Cy multiplies the hours by 4, adds 8 and halves the result.</p>
      ${steps(
        `<p><strong>Write each method as an expression.</strong></p>
         ${sum('Ana: 2(h + 2) &nbsp; Ben: 2h + 4 &nbsp; Cy: (4h + 8)/2')}`,
        `<p><strong>Expand or simplify to compare.</strong></p>
         ${sum('2(h + 2) = 2h + 4<br>(4h + 8)/2 = 2h + 4')}
         ${ans('All equal 2h + 4')}`
      )}
      <p><strong>Missing step?</strong> If someone multiplies the hours by 10 and adds 20, that is 5 times too much (10h + 20 = 5(2h + 4)), so they should divide by 5.</p>
      ${tip('Type a fraction with a two-term top using brackets: (4h+8)/2.')}`,

    // =====================================================================
    // 5J Index laws for multiplication and division
    // =====================================================================
    // Y8 5J Q1, Q2, Q3, Q10: multiplying powers
    'y8-5j-multiply': `
      <p class="hp-tag">Worked example: simplify <b>9⁴ × 9⁷</b> and <b>x⁶ × x × x⁸</b></p>
      ${steps(
        `<p><strong>Same base: keep the base, add the indices.</strong></p>
         ${sum('9⁴ × 9⁷ = 9¹¹')}`,
        `<p><strong>A letter on its own has index 1.</strong></p>
         ${sum('x⁶ × x¹ × x⁸ = x¹⁵')}
         ${ans('9^11, x^15')}`
      )}
      <p><strong>Why it works:</strong> 9⁴ × 9⁷ is four 9s times seven 9s, which is eleven 9s multiplied together.</p>
      ${tip('Do not multiply the bases: 9⁴ × 9⁷ is 9¹¹, not 81¹¹. Type powers with ^, like 9^11.')}`,

    // Y8 5J Q4: numbers and several letters
    'y8-5j-coeff': `
      <p class="hp-tag">Worked example: simplify <b>4x²y⁵ × 9x⁶y</b></p>
      ${steps(
        `<p><strong>Multiply the numbers.</strong></p>
         ${sum('4 × 9 = 36')}`,
        `<p><strong>Add the indices of each letter separately.</strong></p>
         ${sum('x² × x⁶ = x⁸ &nbsp; y⁵ × y¹ = y⁶')}
         ${ans('36x^8y^6')}`
      )}
      <p><strong>With a negative:</strong> −2m⁶n × 7m² = −14m⁸n. The n has nothing to join, so it stays as it is.</p>
      ${tip('Multiply the numbers, but add the indices. Type each letter with its power in order: 36x^8y^6.')}`,

    // Y8 5J Q5, Q6, Q12: dividing powers
    'y8-5j-divide': `
      <p class="hp-tag">Worked example: simplify <b>8⁹ ÷ 8²</b> and <b>20a⁸b⁵ / (15a³b)</b></p>
      ${steps(
        `<p><strong>Same base: keep the base, subtract the indices.</strong></p>
         ${sum('8⁹ ÷ 8² = 8⁷')}`,
        `<p><strong>Numbers: simplify like a fraction.</strong> 20/15 = 4/3.</p>`,
        `<p><strong>Letters: subtract each index.</strong></p>
         ${sum('a⁸ ÷ a³ = a⁵ &nbsp; b⁵ ÷ b¹ = b⁴')}
         ${ans('8^7, 4a^5b^4/3')}`
      )}
      <p><strong>Same power on top and bottom?</strong> 9³/9³ = 1, and the index law gives 9⁰. So 9⁰ = 1.</p>
      ${tip('Divide the numbers, but subtract the indices. If the number part does not divide exactly, leave it as a fraction: 4a^5b^4/3.')}`,

    // Y8 5J Q7, Q8, Q13: index laws instead of a calculator
    'y8-5j-big': `
      <p class="hp-tag">Worked example: work out <b>7⁶⁰² ÷ 7⁶⁰⁰</b> without a calculator.</p>
      ${steps(
        `<p><strong>Use the index law.</strong></p>
         ${sum('7⁶⁰² ÷ 7⁶⁰⁰ = 7²')}`,
        `<p><strong>Now the number is small enough to work out.</strong></p>
         ${sum('7² = 49')}
         ${ans('49')}`
      )}
      <p><strong>Mixed:</strong> (2³⁰⁰ × 2⁷⁰⁶) ÷ 2¹⁰⁰⁰ = 2⁶ = 64. <strong>Missing number:</strong> 5³ = 125 and 5⁷ = 78 125, so 125 × ? = 78 125 means ? = 5⁴ = 625. <strong>Unknown indices:</strong> if 2ᵃ/2ᵇ = 64 = 2⁶, then a − b = 6, so 10ᵃ/10ᵇ = 10⁶ = 1 000 000.</p>
      ${tip('Simplify the indices first, and only work out the number at the end.')}`,

    // Y8 5J Q9: a powers puzzle
    'y8-5j-puzzle': `
      <p class="hp-tag">Worked example: find every way to write <b>64</b> as aᵇ, where a and b are whole numbers bigger than 1.</p>
      ${steps(
        `<p><strong>Work through the powers in order</strong>, so you do not miss any.</p>
         ${fig({ kind: 'table', rows: [['Power b', '2', '3', '4', '5', '6'], ['a', '8', '4', 'none', 'none', '2']] })}`,
        `<p><strong>Check each one.</strong> 8 × 8 = 64, 4 × 4 × 4 = 64, and 2 multiplied by itself 6 times is 64. Nothing works for b = 4 or 5, and from b = 7 on, even 2ᵇ is too big.</p>
         ${ans('8², 4³, 2⁶')}`
      )}
      ${tip('For a puzzle such as aᵇ = bᵃ, make a table: keep a fixed, try b = a + 1, a + 2, ... and work out both sides each time. Type the two numbers in order with a comma.')}`,

    // Y8 5J Q11: powers of negative numbers
    'y8-5j-negative': `
      <p class="hp-tag">Worked example: evaluate <b>(−10)²</b>, <b>(−10)³</b>, <b>(−10)⁴</b> and <b>(−10)⁵</b>.</p>
      ${steps(
        `<p><strong>Write out the multiplication.</strong> Each pair of negatives makes a positive.</p>
         ${sum('(−10)² = −10 × (−10) = 100<br>(−10)³ = 100 × (−10) = −1000<br>(−10)⁴ = −1000 × (−10) = 10 000<br>(−10)⁵ = 10 000 × (−10) = −100 000')}
         ${ans('100, -1000, 10000, -100000')}`,
        `<p><strong>Spot the pattern.</strong> Even powers are positive, odd powers are negative. So if 2¹⁰ = 1024, then (−2)¹⁰ = 1024 as well.</p>`
      )}
      ${tip('The bracket matters: (−10)⁴ = 10 000, but −10⁴ means −(10⁴) = −10 000.')}`,

    // Y8 5J Q14: powers of 10 and scientific notation
    'y8-5j-sci': `
      <p class="hp-tag">Worked example: write <b>500 000</b> and <b>0.06</b> in scientific notation.</p>
      ${steps(
        `<p><strong>Big numbers: count how many places the point moves left</strong> to sit after the first digit.</p>
         ${sum('500 000 = 5 × 10⁵ (5 places)')}`,
        `<p><strong>Small numbers: the point moves right, so the power is negative.</strong></p>
         ${sum('0.06 = 6 × 10⁻² (2 places)')}
         ${ans('5, -2')}`,
        `<p><strong>Going back:</strong> 7 × 10³ = 7000, and 3 × 10⁻⁴ = 0.0003.</p>`
      )}
      <p><strong>Changing units:</strong> 1.2 × 10³ seconds is 1200 seconds, and 1200 ÷ 60 = 20 minutes.</p>
      ${tip('When the box asks for the power, type just the number, with a minus sign if it is negative, like -2.')}`,

    // =====================================================================
    // 5K The zero index and power of a power
    // =====================================================================
    // Y8 5K Q1, Q2, Q10: the zero index
    'y8-5k-zero': `
      <p class="hp-tag">Worked example: simplify <b>3⁰ + 12⁰</b>, <b>8x⁰</b>, <b>(4y²)⁰</b> and <b>2a³b⁰</b>.</p>
      ${steps(
        `<p><strong>Anything (except 0) to the power 0 is 1.</strong> 5²/5² = 1, and the index law gives 5²⁻² = 5⁰.</p>
         ${sum('3⁰ + 12⁰ = 1 + 1 = 2')}`,
        `<p><strong>Check what the 0 belongs to.</strong> In 8x⁰ only the x has the power, so it is 8 × 1. A bracket puts the whole thing to the power 0.</p>
         ${sum('8x⁰ = 8 &nbsp; (4y²)⁰ = 1')}`,
        `<p><strong>Other letters stay.</strong></p>
         ${sum('2a³b⁰ = 2a³ × 1 = 2a³')}
         ${ans('2, 8, 1, 2a^3')}`
      )}
      ${tip('0⁰ does not work this way: 0²/0² would mean dividing by zero.')}`,

    // Y8 5K Q3, Q4, Q11: power of a power
    'y8-5k-power': `
      <p class="hp-tag">Worked example: simplify <b>(x⁹)²</b> and <b>(9y⁶)²</b></p>
      ${steps(
        `<p><strong>Power of a power: multiply the indices.</strong> (x⁹)² is x⁹ × x⁹, so it is 9 + 9 = 18.</p>
         ${sum('(x⁹)² = x¹⁸')}`,
        `<p><strong>Everything in the bracket gets the power, the number too.</strong></p>
         ${sum('(9y⁶)² = 9² × y¹² = 81y¹²')}
         ${ans('x^18, 81y^12')}`
      )}
      <p><strong>Big numbers can stay as powers:</strong> (13a²)⁹ = 13⁹a¹⁸, typed 13^9a^18. <strong>Changing the base:</strong> 25 = 5², so (25³)⁷ = ((5²)³)⁷ = 5⁴².</p>
      ${tip('Multiplying the same base: add the indices. A power of a power: multiply them.')}`,

    // Y8 5K Q5, Q6, Q7, Q13, Q14: using all the index laws together
    'y8-5k-combine': `
      <p class="hp-tag">Worked example: simplify <b>(y⁷)² × (3y⁶)⁴</b> and <b>(10x⁹)² / (x⁷)²</b></p>
      ${steps(
        `<p><strong>Do the powers of brackets first.</strong></p>
         ${sum('(y⁷)² = y¹⁴ &nbsp; (3y⁶)⁴ = 3⁴y²⁴ = 81y²⁴')}`,
        `<p><strong>Then multiply: numbers multiply, indices add.</strong></p>
         ${sum('y¹⁴ × 81y²⁴ = 81y³⁸')}`,
        `<p><strong>Dividing: indices subtract.</strong></p>
         ${sum('100x¹⁸ / x¹⁴ = 100x⁴')}
         ${ans('81y^38, 100x^4')}`
      )}
      <p><strong>Missing index:</strong> (7^□)² = 7¹⁸ means □ × 2 = 18, so □ = 9. <strong>Three powers:</strong> ((x⁷)²)³ = x⁴². To put powers of 2 in order, compare the indices: 2⁴⁰ &lt; (2³)¹⁴ = 2⁴² &lt; (2⁵)⁹ = 2⁴⁵.</p>
      ${tip('If everything cancels to x⁰, the answer is 1. Different bases like 4 and 8? Write both as powers of 2 first.')}`,

    // Y8 5K Q8: zeros in powers of 10
    'y8-5k-tens': `
      <p class="hp-tag">Worked example: how many zeros are in <b>10⁵</b> and in <b>(10³ × 10⁶)²</b>?</p>
      ${steps(
        `<p><strong>10 to a power is 1 followed by that many zeros.</strong></p>
         ${sum('10⁵ = 100 000 → 5 zeros')}`,
        `<p><strong>Simplify to one power of 10 first.</strong></p>
         ${sum('(10³ × 10⁶)² = (10⁹)² = 10¹⁸')}
         ${ans('5, 18')}`
      )}
      ${tip('The index of 10 tells you the number of zeros, so you never need to write the number out.')}`,

    // Y8 5K Q9: multiplying powers versus a power of a power
    'y8-5k-compare': `
      <p class="hp-tag">Worked example: compare <b>x² × x⁷</b> with <b>(x²)⁷</b>.</p>
      ${steps(
        `<p><strong>Simplify each one.</strong></p>
         ${sum('x² × x⁷ = x⁹ (add) &nbsp; (x²)⁷ = x¹⁴ (multiply)')}`,
        `<p><strong>Test a value.</strong> x = 2 gives 2⁹ = 512 and 2¹⁴ = 16 384. Different, so they are not equivalent.</p>
         ${ans('x^9, x^14, not equivalent')}`,
        `<p><strong>When are they equal?</strong> Try the special values 0, 1 and −1. (−1)⁹ = −1 but (−1)¹⁴ = 1, so −1 does not work here.</p>`
      )}
      ${tip('0 and 1 to any positive power stay the same, so they are worth testing first.')}`,

    // Y8 5K Q12: a power of 0.5
    'y8-5k-half': `
      <p class="hp-tag">Worked example: use the index laws to find <b>64^0.5</b>.</p>
      ${steps(
        `<p><strong>Square it using the power of a power law.</strong></p>
         ${sum('(64^0.5)² = 64^(0.5 × 2) = 64¹ = 64')}`,
        `<p><strong>So 64^0.5 is the positive number that squares to 64.</strong></p>
         ${sum('8² = 64')}
         ${ans('8')}`
      )}
      ${tip('A power of 0.5 is the same as a square root: 81^0.5 = √81 = 9.')}`,
  });
})();
