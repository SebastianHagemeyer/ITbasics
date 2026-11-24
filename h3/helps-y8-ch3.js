/* H3 help panels for Year 8 Chapter 3. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 3A to 3K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Y8 3A Equivalent fractions
    // =====================================================================
    // Y8 3A Q1 to Q4: missing numbers in equivalent fractions
    'y8-3a-equiv': `
      <p class="hp-tag">Worked example: <b>4/7 = ?/56</b></p>
      ${steps(
        `<p><strong>Look at the pair you know both of.</strong> Here it is the bottoms: what turns 7 into 56?</p>
         ${sum('7 × 8 = 56')}`,
        `<p><strong>Do the same to the other number.</strong> Whatever you do to the bottom, do to the top.</p>
         ${sum('4 × 8 = 32, so 4/7 = 32/56')}
         ${ans('32')}`
      )}
      <p><strong>Going down works the same way.</strong> For 30/42 = 5/?: the tops go 30 ÷ 6 = 5, so divide the bottom by 6 too. 42 ÷ 6 = 7. A whole number is a fraction over 1, so 5 = 5/1.</p>
      ${tip('In a chain like 2/9 = 6/? = 10/?, compare each fraction with the first one. 6 is 2 × 3, so its bottom is 9 × 3 = 27.')}`,

    // Y8 3A Q5, Q6, Q7: simplest form, with and without a calculator
    'y8-3a-simplify': `
      <p class="hp-tag">Worked example: write <b>32/56</b> in simplest form.</p>
      ${steps(
        `<p><strong>Find the highest common factor (HCF).</strong> Both 32 and 56 are in the 8 times table.</p>`,
        `<p><strong>Divide the top and the bottom by it.</strong></p>
         ${sum('32 ÷ 8 = 4<br>56 ÷ 8 = 7')}
         ${ans('4/7')}`,
        `<p><strong>Big numbers? Use the calculator's fraction key.</strong> Type 221/391 and press =. It shows 13/23, because both numbers divide by 17.</p>
         ${sum('221 ÷ 17 = 13<br>391 ÷ 17 = 23')}`
      )}
      <p>If the top is bigger, it stays an improper fraction: 36/20 = 9/5. To spot fractions that are <b>not</b> in simplest form, look for a shared factor: 21/35 shares 7, but 11/26 shares nothing.</p>
      ${tip('Check your answer: if the top and bottom still share a factor, divide again. Type fractions with a slash, like 4/7.')}`,

    // Y8 3A Q8: matching equivalent pairs
    'y8-3a-pairs': `
      <p class="hp-tag">Worked example: which of <b>6/21</b>, <b>9/21</b> and <b>12/35</b> is equivalent to <b>3/7</b>?</p>
      ${steps(
        `<p><strong>Simplify each one.</strong></p>
         ${sum('6/21 = 2/7 (divide by 3)<br>9/21 = 3/7 (divide by 3)<br>12/35 will not simplify')}`,
        `<p><strong>Pick the one that matches.</strong></p>
         ${ans('9/21')}`
      )}
      ${tip('You can also build up from the fraction you are given: 3/7 = 6/14 = 9/21 = 12/28. Any fraction in that list is a match.')}`,

    // Y8 3A Q9: comparing two fractions in a story
    'y8-3a-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A <span class="hp-hl">60</span>-day fundraiser aims to raise <span class="hp-hl">$900</span>. After <span class="hp-hl">45</span> days, <span class="hp-hl">$600</span> has been raised. Are they <span class="hp-kw">on target</span>?</p>
      ${steps(
        `<p><strong>Fraction of the time:</strong> part over whole, then simplify.</p>
         ${sum('45/60 = 3/4 (divide by 15)')}`,
        `<p><strong>Fraction of the goal:</strong></p>
         ${sum('600/900 = 2/3 (divide by 300)')}`,
        `<p><strong>Compare with a common denominator.</strong> 3/4 = 9/12 and 2/3 = 8/12. They have used more of the time than they have raised of the money, so they are behind.</p>
         ${ans('No')}`
      )}
      ${tip('On target means the money fraction is at least as big as the time fraction.')}`,

    // Y8 3A Q10, Q12: reasoning about simplifying and equivalent fractions
    'y8-3a-reason': `
      <p class="hp-tag">Worked example: can <b>5/13</b>, <b>15/22</b> and <b>15/21</b> be simplified?</p>
      ${steps(
        `<p><strong>5/13:</strong> 5 and 13 are both prime. Their only shared factor is 1, so it cannot be simplified.</p>`,
        `<p><strong>15/22 and 15/21:</strong> all four numbers are composite. Break them into primes.</p>
         ${sum('15 = 3 × 5, 22 = 2 × 11: nothing shared, no<br>15 = 3 × 5, 21 = 3 × 7: both have 3, so 15/21 = 5/7')}`,
        `<p><strong>Decide.</strong> Two composite numbers might share a factor, or might not.</p>
         ${ans('15/21 simplifies; 5/13 and 15/22 do not')}`
      )}
      ${tip('To build equivalent fractions, multiply the top and bottom by the same number: 2/7 = 4/14 = 6/21 = 8/28. Ask yourself whether you could ever run out of numbers to multiply by.')}`,

    // Y8 3A Q11: sharing slices with different amounts
    'y8-3a-pizza': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A cake is cut into equal slices for <span class="hp-hl">3</span> friends. Each friend gets an <span class="hp-kw">odd</span> number of slices, and no two friends get the <span class="hp-kw">same</span> amount. What is the smallest number of slices?</p>
      ${steps(
        `<p><strong>Give out the smallest amounts allowed.</strong> The three smallest different odd numbers are 1, 3 and 5.</p>
         ${sum('1 + 3 + 5 = 9')}
         ${ans('9')}`,
        `<p><strong>Test a bigger number by adding the extra to the biggest share.</strong> 11 slices: 1 + 3 + 7 = 11, so yes. 10 slices: three odd numbers always add to an odd number, so no.</p>`
      )}
      ${tip('Start from the smallest shares that follow the rules. If the cake has fewer slices than that total, it cannot be done.')}`,

    // Y8 3A Q13: missing terms in algebraic equivalent fractions
    'y8-3a-alg-equiv': `
      <p class="hp-tag">Worked example: <b>2x/5y = 8x/?</b></p>
      ${steps(
        `<p><strong>See what the top was multiplied by.</strong></p>
         ${sum('2x × 4 = 8x')}`,
        `<p><strong>Multiply the bottom by the same thing.</strong></p>
         ${sum('5y × 4 = 20y')}
         ${ans('20y')}`
      )}
      <p><strong>The multiplier can be a letter.</strong> For a/c = ?/3cd, the bottom c was multiplied by 3d, so the top is a × 3d = 3ad.</p>
      ${tip('Type letters next to each other with no × sign, numbers first: 3ad, not a3d.')}`,

    // Y8 3A Q14, Q15: simplifying algebraic fractions
    'y8-3a-alg-simplify': `
      <p class="hp-tag">Worked example: simplify <b>20ab/35b</b></p>
      ${steps(
        `<p><strong>Simplify the numbers.</strong> The HCF of 20 and 35 is 5.</p>
         ${sum('20 ÷ 5 = 4, 35 ÷ 5 = 7')}`,
        `<p><strong>Cancel any letter on both the top and the bottom.</strong> b ÷ b = 1, so the b goes. The a has no partner, so it stays.</p>
         ${ans('4a/7')}`
      )}
      <p><strong>If letters are left on the bottom</strong>, put the whole bottom in brackets when you type it: 9x/(12xy) = 3/(4y).</p>
      ${tip('Sometimes every letter cancels: 6t/11t = 6/11. And it works backwards too: 3/4 = 3w/4w.')}`,

    // =====================================================================
    // Y8 3B Operations with fractions
    // =====================================================================
    // Y8 3B Q1, Q2: adding and subtracting fractions
    'y8-3b-addsub': `
      <p class="hp-tag">Worked example: <b>3/8 + 5/6</b></p>
      ${steps(
        `<p><strong>Find a common denominator.</strong> The lowest number both 8 and 6 go into is 24.</p>`,
        `<p><strong>Rewrite each fraction over 24.</strong></p>
         ${sum('3/8 = 9/24<br>5/6 = 20/24')}`,
        `<p><strong>Add the tops. Keep the bottom.</strong> Then change to a mixed numeral.</p>
         ${sum('9/24 + 20/24 = 29/24 = 1 5/24')}
         ${ans('1 5/24')}`
      )}
      <p>If the bottoms already match, just add or take away the tops. Taking away works the same way: 7/10 − 1/4 = 14/20 − 5/20 = 9/20.</p>
      ${tip('Always simplify at the end. Type a mixed numeral with a space, like 1 5/24.')}`,

    // Y8 3B Q3: adding and subtracting mixed numerals
    'y8-3b-mixed-addsub': `
      <p class="hp-tag">Worked example: <b>6 1/5 − 2 2/3</b></p>
      ${steps(
        `<p><strong>Change both to improper fractions.</strong></p>
         ${sum('6 1/5 = 31/5<br>2 2/3 = 8/3')}`,
        `<p><strong>Use a common denominator of 15.</strong></p>
         ${sum('93/15 − 40/15 = 53/15')}`,
        `<p><strong>Change back to a mixed numeral.</strong></p>
         ${sum('53 ÷ 15 = 3 remainder 8')}
         ${ans('3 8/15')}`
      )}
      ${tip('For adding, you can do the wholes and the fractions separately: 2 1/6 + 4 3/4 = 6 + 2/12 + 9/12 = 6 11/12. Improper fractions are safer for taking away.')}`,

    // Y8 3B Q4, Q5: multiplying fractions and mixed numerals
    'y8-3b-multiply': `
      <p class="hp-tag">Worked example: <b>2 1/7 × 1 2/5</b></p>
      ${steps(
        `<p><strong>Change mixed numerals to improper fractions.</strong></p>
         ${sum('15/7 × 7/5')}`,
        `<p><strong>Cancel a top with a bottom.</strong> The 7s cancel. 15 and 5 both divide by 5.</p>
         ${sum('3/1 × 1/1')}`,
        `<p><strong>Multiply the tops and multiply the bottoms.</strong></p>
         ${ans('3')}`
      )}
      ${tip('No common denominator is needed to multiply. You can cancel first or simplify at the end: 4/9 × 3/8 = 12/72 = 1/6.')}`,

    // Y8 3B Q6, Q7, Q8: dividing fractions, and chains of × and ÷
    'y8-3b-divide': `
      <p class="hp-tag">Worked example: <b>3 1/3 ÷ 2 2/9</b></p>
      ${steps(
        `<p><strong>Change to improper fractions.</strong></p>
         ${sum('10/3 ÷ 20/9')}`,
        `<p><strong>Flip the second fraction and multiply.</strong></p>
         ${sum('10/3 × 9/20')}`,
        `<p><strong>Cancel, then multiply.</strong> 10 and 20 divide by 10; 9 and 3 divide by 3.</p>
         ${sum('1/1 × 3/2 = 3/2 = 1 1/2')}
         ${ans('1 1/2')}`
      )}
      ${tip('With three fractions, flip only a fraction straight after a ÷ sign, then multiply them all: 1/2 ÷ 3/4 × 5/6 = 1/2 × 4/3 × 5/6 = 20/36 = 5/9.')}`,

    // Y8 3B Q9, Q10, Q11: a fraction of an amount in a story
    'y8-3b-of': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A roll holds <span class="hp-hl">12 1/2</span> m of ribbon. <span class="hp-hl">3/5</span> of it is used. How much ribbon is <span class="hp-kw">left</span>?</p>
      ${steps(
        `<p><strong>Find the fraction left.</strong></p>
         ${sum('1 − 3/5 = 2/5')}`,
        `<p><strong>"Of" means multiply.</strong></p>
         ${sum('2/5 × 12 1/2 = 2/5 × 25/2')}`,
        `<p><strong>Cancel and multiply.</strong> The 2s cancel, and 25 ÷ 5 = 5.</p>
         ${ans('5')}`
      )}
      ${tip('A fraction of a fraction is also multiplying: 1/3 of 3/4 = 1/3 × 3/4 = 1/4. To add parts of the same whole, use a common denominator.')}`,

    // Y8 3B Q12, Q15: how many lots fit (dividing by a fraction)
    'y8-3b-howmany': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story"><span class="hp-hl">8</span> jugs each hold <span class="hp-hl">2 1/4</span> litres of water. A glass holds <span class="hp-hl">3/8</span> of a litre. <span class="hp-kw">How many</span> glasses can be filled?</p>
      ${steps(
        `<p><strong>Find the total amount.</strong></p>
         ${sum('8 × 2 1/4 = 8 × 9/4 = 18 litres')}`,
        `<p><strong>How many 3/8s fit into 18? Divide.</strong> Flip and multiply.</p>
         ${sum('18 ÷ 3/8 = 18 × 8/3 = 48')}
         ${ans('48')}`
      )}
      <p><strong>Lots of a fraction in 1 whole:</strong> 2/3 fits into 1 one and a half times, because 1 ÷ 2/3 = 3/2.</p>
      ${fig({ kind: 'bar', parts: 3, shaded: 2, alt: 'A bar in 3 equal parts with 2 shaded' })}
      ${tip('Half of a fraction means × 1/2: half of 4/7 is 2/7.')}`,

    // Y8 3B Q13, Q14: missing numbers in fraction sums
    'y8-3b-missing': `
      <p class="hp-tag">Worked example: <b>3/4 − ?/8 = 1/8</b></p>
      ${steps(
        `<p><strong>Make the bottoms match.</strong></p>
         ${sum('3/4 = 6/8, so 6/8 − ?/8 = 1/8')}`,
        `<p><strong>Now just look at the tops.</strong></p>
         ${sum('6 − ? = 1, so ? = 5')}
         ${ans('5')}`
      )}
      <p><strong>For ×, match the answer's bottom.</strong> In ?/9 × 3/4 = 5/12, the bottom will be 9 × 4 = 36, and 5/12 = 15/36. So ? × 3 = 15, which makes ? = 5.</p>
      ${tip('Always put your number back in and check. For ÷, undo it with ×: if ?/10 ÷ 1/2 = 3, then ?/10 = 3 × 1/2 = 15/10, so ? = 15.')}`,

    // Y8 3B Q16: adding a halving pattern
    'y8-3b-pattern': `
      <p class="hp-tag">Worked example: each fraction in <b>1/3, 1/6, 1/12, 1/24, ...</b> is half the one before. Add them up to 1/96.</p>
      ${steps(
        `<p><strong>Add the first few and watch the totals.</strong></p>
         ${sum('1/3 + 1/6 = 1/2 (1/6 short of 2/3)<br>1/2 + 1/12 = 7/12 (1/12 short of 2/3)<br>7/12 + 1/24 = 15/24 (1/24 short of 2/3)')}`,
        `<p><strong>Spot the pattern.</strong> The total is always short of 2/3 by the last fraction added.</p>`,
        `<p><strong>Use it.</strong></p>
         ${sum('2/3 − 1/96 = 64/96 − 1/96 = 63/96 = 21/32')}
         ${ans('21/32')}`
      )}
      ${tip('The totals creep up towards double the first fraction. Work out how far short of it the total is.')}`,

    // Y8 3B Q17: order of operations with fractions
    'y8-3b-order': `
      <p class="hp-tag">Worked example: <b>(1/2 − 1/5 + 1/10) ÷ 1/4 × 1/3</b></p>
      ${steps(
        `<p><strong>Brackets first.</strong> Use tenths.</p>
         ${sum('5/10 − 2/10 + 1/10 = 4/10 = 2/5')}`,
        `<p><strong>Then ÷ and × from left to right.</strong></p>
         ${sum('2/5 ÷ 1/4 = 2/5 × 4/1 = 8/5')}`,
        `<p><strong>Finish off.</strong></p>
         ${sum('8/5 × 1/3 = 8/15')}
         ${ans('8/15')}`
      )}
      ${tip('Inside the brackets, + and − also go from left to right.')}`,

    // =====================================================================
    // Y8 3C Operations with negative fractions
    // =====================================================================
    // Y8 3C Q1, Q2: adding and subtracting with the same denominator
    'y8-3c-same': `
      <p class="hp-tag">Worked example: <b>−9/10 + 3/10</b></p>
      ${fig({ kind: 'numberline', min: -1, max: 1, divisions: 10, points: { start: -0.9, end: -0.6 } })}
      ${steps(
        `<p><strong>The bottoms match, so work with the tops.</strong> Start at −9 and go up 3.</p>
         ${sum('−9 + 3 = −6, so the answer is −6/10')}`,
        `<p><strong>Simplify.</strong></p>
         ${sum('−6/10 = −3/5')}
         ${ans('-3/5')}`
      )}
      <p><strong>Taking away a negative is adding.</strong> 3/8 − (−1/8) = 3/8 + 1/8 = 4/8 = 1/2.</p>
      ${tip('Adding a negative is taking away: 5/9 + (−2/9) = 3/9. Type the minus sign with the - key, like -3/5.')}`,

    // Y8 3C Q3: adding and subtracting with different denominators
    'y8-3c-diff': `
      <p class="hp-tag">Worked example: <b>−1 1/2 − (−2 2/5)</b></p>
      ${steps(
        `<p><strong>Change − (−) into +.</strong></p>
         ${sum('−1 1/2 + 2 2/5')}`,
        `<p><strong>Use improper fractions over a common denominator.</strong></p>
         ${sum('−3/2 + 12/5 = −15/10 + 24/10')}`,
        `<p><strong>Work with the tops.</strong></p>
         ${sum('−15 + 24 = 9, so 9/10')}
         ${ans('9/10')}`
      )}
      ${tip('If the answer is improper, change it to a mixed numeral and keep the sign: −9/4 is typed as -2 1/4.')}`,

    // Y8 3C Q4, Q5: multiplying and dividing negative fractions
    'y8-3c-multdiv': `
      ${chips(['+ × + = +', 'add'], ['− × − = +', 'add'], ['+ × − = −', 'take'], ['− × + = −', 'take'])}
      <p class="hp-tag">Worked example: <b>−3/8 × (−4/9)</b></p>
      ${steps(
        `<p><strong>Decide the sign first.</strong> Two negatives make a positive.</p>`,
        `<p><strong>Cancel, then multiply.</strong> 3 and 9 divide by 3; 4 and 8 divide by 4.</p>
         ${sum('1/2 × 1/3 = 1/6')}
         ${ans('1/6')}`
      )}
      <p><strong>Dividing:</strong> change mixed numerals, then flip and multiply. −1 1/5 ÷ 3/10 = −6/5 × 10/3 = −60/15 = −4. One negative, so the answer is negative.</p>
      ${tip('Dividing by a whole number is multiplying by 1 over it: −4/7 ÷ 2 = −4/7 × 1/2 = −2/7. The signs work the same for ÷ as for ×.')}`,

    // Y8 3C Q6, Q10: ordering and comparing negative fractions
    'y8-3c-order': `
      <p class="hp-tag">Worked example: put <b>−1/2, 2/5, −2/3, −1 1/4, 1/6</b> in order, smallest first.</p>
      ${steps(
        `<p><strong>Change each one to a decimal.</strong></p>
         ${sum('−0.5, 0.4, −0.667, −1.25, 0.167')}`,
        `<p><strong>Negatives come first.</strong> The further a negative is from zero, the smaller it is, so −1.25 is the smallest.</p>`,
        `<p><strong>Write them in the original form</strong>, separated by commas.</p>
         ${ans('-1 1/4, -2/3, -1/2, 1/6, 2/5')}`
      )}
      ${tip('To compare two negatives, picture a number line. −1/3 is −0.333 and −2/5 is −0.4. −0.333 is closer to zero, so −1/3 > −2/5.')}`,

    // Y8 3C Q7, Q8, Q9: stories with negative fractions
    'y8-3c-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">On a mountain, the highest temperature one day was <span class="hp-hl">8 1/2</span>°C and the lowest was <span class="hp-hl">−3 1/3</span>°C. What was the <span class="hp-kw">range</span>?</p>
      ${steps(
        `<p><strong>Range means highest minus lowest.</strong> Taking away a negative is adding.</p>
         ${sum('8 1/2 − (−3 1/3) = 8 1/2 + 3 1/3')}`,
        `<p><strong>Add the wholes, then the fractions.</strong></p>
         ${sum('8 + 3 = 11<br>1/2 + 1/3 = 3/6 + 2/6 = 5/6')}
         ${ans('11 5/6')}`
      )}
      ${tip('For "how far from a goal", do amount minus goal. If the amount is under the goal, the answer is negative: 7 1/2 − 8 = −1/2.')}`,

    // Y8 3C Q11, Q12, Q13: is it positive or negative?
    'y8-3c-signs': `
      <p class="hp-tag">Worked example: is <b>−2/3 × (−4/5)² ÷ (−1/2)</b> positive or negative?</p>
      ${steps(
        `<p><strong>Deal with the square.</strong> (−4/5)² means (−4/5) × (−4/5), which is positive.</p>`,
        `<p><strong>Count the negatives that are left.</strong> There are two: −2/3 and −1/2.</p>`,
        `<p><strong>An even number of negatives gives a positive.</strong> An odd number gives a negative.</p>
         ${ans('Positive')}`
      )}
      ${tip('For letter questions, pick numbers that follow the rules, such as a = 5 and b = 4, and test. To show something is possible, one example is enough: 3/2 × 4/3 = 2 shows two fractions can multiply to a whole number.')}`,

    // Y8 3C Q14: the mean of fractions
    'y8-3c-mean': `
      <p class="hp-tag">Worked example: find the mean of <b>−1/2, 3/4, −1 1/4, 2</b></p>
      ${steps(
        `<p><strong>Add them all.</strong> Use quarters.</p>
         ${sum('−2/4 + 3/4 − 5/4 + 8/4 = 4/4 = 1')}`,
        `<p><strong>Divide by how many numbers there are.</strong> There are 4.</p>
         ${sum('1 ÷ 4 = 1/4')}
         ${ans('1/4')}`
      )}
      ${tip('Count the numbers carefully, including any 0. A 0 adds nothing to the total but still counts as a number.')}`,

    // =====================================================================
    // Y8 3D Understanding decimals
    // =====================================================================
    // Y8 3D Q1, Q2: comparing decimals
    'y8-3d-compare': `
      <p class="hp-tag">Worked example: <b>61.4827</b> or <b>61.4839</b>: which is bigger?</p>
      ${steps(
        `<p><strong>Line up the decimal points.</strong></p>
         ${sum('61.48' + now('2') + '7<br>61.48' + now('3') + '9')}`,
        `<p><strong>Compare from the left.</strong> 6, 1, 4 and 8 all match. The first different digit is in the thousandths: 2 and 3.</p>`,
        `<p><strong>The bigger digit wins.</strong> 2 is less than 3.</p>
         ${ans('61.4827 < 61.4839')}`
      )}
      ${tip('More digits does not mean bigger. 0.7 is bigger than 0.6999, because 7 tenths beats 6 tenths.')}`,

    // Y8 3D Q3, Q8, Q10: ordering decimals
    'y8-3d-order': `
      <p class="hp-tag">Worked example: put <b>5.319, 5.39, 5.093, 5.3, 5.391</b> in descending order.</p>
      ${steps(
        `<p><strong>Fill with zeros so they all have the same number of places.</strong></p>
         ${sum('5.319, 5.390, 5.093, 5.300, 5.391')}`,
        `<p><strong>Descending means largest first.</strong> Compare them like whole numbers: 391, 390, 319, 300, 093.</p>
         ${ans('5.391, 5.39, 5.319, 5.3, 5.093')}`
      )}
      ${tip('Ascending is smallest first. Type each number as it was given, without the extra zeros. In a story, order the numbers first, then write the names or letters in that order.')}`,

    // Y8 3D Q4: decimals to fractions
    'y8-3d-to-fraction': `
      <p class="hp-tag">Worked example: write <b>3.068</b> as a mixed numeral in simplest form.</p>
      ${steps(
        `<p><strong>Keep the whole number.</strong> The last digit, 8, is in the thousandths, so the decimal part is over 1000.</p>
         ${sum('3.068 = 3 68/1000')}`,
        `<p><strong>Simplify the fraction part.</strong> 68 and 1000 both divide by 4.</p>
         ${sum('68/1000 = 17/250')}
         ${ans('3 17/250')}`
      )}
      ${chart(['ones', '.', 'tenths', 'hundredths', 'thousandths'], ['3', '.', '0', '6', '8'], [4])}
      ${tip('Count the decimal places: 1 place is over 10, 2 places over 100, 3 places over 1000. With no whole number, there is no mixed numeral: 0.8 = 8/10 = 4/5.')}`,

    // Y8 3D Q5, Q6, Q7: fractions to decimals
    'y8-3d-to-decimal': `
      <p class="hp-tag">Worked example: write <b>21/250</b> as a decimal.</p>
      ${steps(
        `<p><strong>Make the bottom 10, 100 or 1000.</strong> 250 × 4 = 1000, so multiply the top by 4 too.</p>
         ${sum('21/250 = 84/1000')}`,
        `<p><strong>Read it as a decimal.</strong> 84 thousandths has 3 decimal places.</p>
         ${ans('0.084')}`
      )}
      <p>If the bottom is already 10, 100 or 1000, write it straight down: 307/1000 = 0.307. For a mixed numeral, keep the whole number: 7 21/250 = 7.084.</p>
      ${tip('If the bottom will not turn into 10, 100 or 1000, divide the top by the bottom. To order mixed numerals, change them all to decimals first.')}`,

    // Y8 3D Q9: comparing a fraction with a decimal
    'y8-3d-fd-compare': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Team A has won <span class="hp-hl">0.3</span> of its games. Team B has won <span class="hp-hl">5/16</span>. Who is ahead, and <span class="hp-kw">by how much</span>?</p>
      ${steps(
        `<p><strong>Change the fraction to a decimal.</strong></p>
         ${sum('5 ÷ 16 = 0.3125')}`,
        `<p><strong>Compare.</strong> 0.3125 is bigger than 0.3000, so Team B is ahead.</p>`,
        `<p><strong>Subtract to find the difference.</strong></p>
         ${sum('0.3125 − 0.3000 = 0.0125')}
         ${ans('0.0125')}`
      )}
      ${tip('Fill with zeros before you subtract so the decimal points line up.')}`,

    // Y8 3D Q11: the number midway between two decimals
    'y8-3d-midway': `
      <p class="hp-tag">Worked example: what decimal is midway between <b>6.153</b> and <b>6.154</b>?</p>
      ${steps(
        `<p><strong>Add a zero to each.</strong> Now there are ten steps between them.</p>
         ${sum('6.1530 and 6.1540')}`,
        `<p><strong>Take the one in the middle.</strong></p>
         ${ans('6.1535')}`
      )}
      <p><strong>As a fraction:</strong> midway between 0.462 and 0.463 is 0.4625. That is 4625/10000, which simplifies (divide by 125) to 37/80.</p>
      ${tip('Another way: add the two numbers and halve. It does not matter which number is written first.')}`,

    // Y8 3D Q12: magic square with fractions and decimals
    'y8-3d-magic': `
      <p class="hp-tag">Worked example: every row, column and diagonal has the same total. Find the total, X and Y.</p>
      ${fig({ kind: 'diagram', unit: 60, items: [
        { seg: [0, 0, 3, 0] }, { seg: [0, 0, 0, 3] }, { seg: [0, 1, 3, 1] }, { seg: [1, 0, 1, 3] },
        { seg: [0, 2, 3, 2] }, { seg: [2, 0, 2, 3] }, { seg: [0, 3, 3, 3] }, { seg: [3, 0, 3, 3] },
        { label: '5.6', at: [0.5, 2.5] }, { label: '7/10', at: [1.5, 2.5] }, { label: '4 1/5', at: [2.5, 2.5] },
        { label: '3 1/2', at: [1.5, 1.5] }, { label: 'X', at: [1.5, 0.5] }, { label: 'Y', at: [2.5, 0.5] }
      ] })}
      ${steps(
        `<p><strong>Use a full line to find the total.</strong> Change fractions to decimals first.</p>
         ${sum('5.6 + 0.7 + 4.2 = 10.5')}`,
        `<p><strong>Find a line with only one gap.</strong> The middle column:</p>
         ${sum('0.7 + 3.5 + X = 10.5, so X = 6.3')}`,
        `<p><strong>The diagonal from 5.6:</strong></p>
         ${sum('5.6 + 3.5 + Y = 10.5, so Y = 1.4')}
         ${ans('10.5, X = 6.3, Y = 1.4')}`
      )}
      ${tip('Each number you find opens up another line with only one gap. Keep going until the square is full.')}`,

    // Y8 3D Q13: reading an exchange rate table
    'y8-3d-exchange': `
      <p class="hp-tag">Worked example: made-up rates between the Australian dollar and the Japanese yen. Each number is how much of the row's currency you get for 1 of the column's currency.</p>
      ${fig({ kind: 'table', rows: [['', 'AUD', 'JPY'], ['AUD', '1', '0.01'], ['JPY', '100', '1']] })}
      ${steps(
        `<p><strong>How many yen does A$35 buy?</strong> Go to the row of the money you want (JPY) and the column of the money you have (AUD): 100.</p>
         ${sum('35 × 100 = ¥3500')}`,
        `<p><strong>How many Australian dollars buy ¥8000?</strong> AUD row, JPY column: 0.01.</p>
         ${sum('8000 × 0.01 = A$80')}
         ${ans('80')}`,
        `<p><strong>To compare, change both into one currency.</strong> Would you rather have ¥500 or A$4? ¥500 = 500 × 0.01 = A$5, so take the yen.</p>`
      )}
      ${tip('Change everything to Australian dollars before you add extra costs, like shipping, or compare prices.')}`,

    // =====================================================================
    // Y8 3E Operations with decimals
    // =====================================================================
    // Y8 3E Q1 to Q4, Q9, Q10: adding and subtracting decimals
    'y8-3e-addsub': `
      <p class="hp-tag">Worked example: <b>38.6 + 4.275 − 9.38</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '1', '', '', '', '', ''] },
        { cells: d(' 38.600') },
        { cells: d('+ 4.275') },
        { kind: 'res', cells: d(' 42.875') }
      ])}
      ${steps(
        `<p><strong>Line up the decimal points.</strong> Fill the gaps with zeros so every number has 3 places.</p>`,
        `<p><strong>Add from the right</strong>, carrying as normal. 8 + 4 = 12, so write 2 and carry 1.</p>
         ${sum('38.600 + 4.275 = 42.875')}`,
        `<p><strong>Then take away</strong>, working left to right.</p>
         ${sum('42.875 − 9.380 = 33.495')}
         ${ans('33.495')}`
      )}
      ${tip('Line up the points, not the right-hand ends. If a list also has × or ÷, count decimal places for ×, and make the divisor a whole number for ÷.')}`,

    // Y8 3E Q5: multiplying and dividing by 10, 100, 1000 and 10 000
    'y8-3e-powers10': `
      <p class="hp-tag">Worked example: <b>3.0841 × 1000</b> and <b>72.5 ÷ 10 000</b></p>
      ${steps(
        `<p><strong>Count the zeros.</strong> 1000 has 3 zeros. Multiplying makes the number bigger, so the digits move 3 places left (the point moves 3 places right).</p>
         ${sum('3.0841 × 1000 = 3084.1')}
         ${ans('3084.1')}`,
        `<p><strong>Dividing makes it smaller.</strong> 10 000 has 4 zeros, so the point moves 4 places left. Fill the empty places with zeros.</p>
         ${sum('72.5 ÷ 10 000 = 0.00725')}
         ${ans('0.00725')}`
      )}
      ${tip('Empty places to the right of the number need zeros too: 0.04 × 1000 = 40.')}`,

    // Y8 3E Q6, Q14: multiplying decimals
    'y8-3e-multiply': `
      <p class="hp-tag">Worked example: <b>2.73 × 0.6</b></p>
      ${steps(
        `<p><strong>Ignore the points and multiply.</strong></p>
         ${sum('273 × 6 = 1638')}`,
        `<p><strong>Count the decimal places in the question.</strong></p>
         ${sum('2.73 has 2, 0.6 has 1: 2 + 1 = 3 places')}`,
        `<p><strong>Give the answer that many places.</strong></p>
         ${ans('1.638')}`
      )}
      <p><strong>Using fractions:</strong> 0.9 × 0.2 = 9/10 × 2/10 = 18/100 = 0.18.</p>
      ${tip('Check with an estimate: 2.73 × 0.6 is about 3 × 0.6 = 1.8, so 1.638 is sensible.')}`,

    // Y8 3E Q7: dividing a decimal by a whole number
    'y8-3e-divide-whole': `
      <p class="hp-tag">Worked example: <b>49.56 ÷ 4</b></p>
      ${bus('4', ['4', '9', '.', '5', '6'], ['1', '2', '.', '3', '9'], ['', '', '', '1', '3'], '')}
      ${steps(
        `<p><strong>Use short division.</strong> 4 into 4 is 1. 4 into 9 is 2 remainder 1.</p>`,
        `<p><strong>Put the point straight above the point.</strong> Carry the 1: 4 into 15 is 3 remainder 3. Then 4 into 36 is 9.</p>
         ${ans('12.39')}`
      )}
      ${tip('If there is still a remainder at the end, add a zero and keep dividing: 7.3 ÷ 4 = 7.300 ÷ 4 = 1.825.')}`,

    // Y8 3E Q8: dividing by a decimal
    'y8-3e-divide-decimal': `
      <p class="hp-tag">Worked example: <b>2.856 ÷ 0.07</b></p>
      ${steps(
        `<p><strong>Make the number you divide by a whole number.</strong> Move both points 2 places right (multiply both by 100).</p>
         ${sum('2.856 ÷ 0.07 = 285.6 ÷ 7')}`,
        `<p><strong>Now use short division.</strong></p>
         ${bus('7', ['2', '8', '5', '.', '6'], ['', '4', '0', '.', '8'], ['', '2', '', '', '5'], '')}
         ${ans('40.8')}`
      )}
      ${tip('Move the point the same number of places in both numbers. That keeps the answer the same.')}`,

    // Y8 3E Q11, Q12, Q13: decimal stories with units
    'y8-3e-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A <span class="hp-hl">2.7</span> km path is edged with garden sleepers <span class="hp-hl">4.5</span> m long, laid end to end. <span class="hp-kw">How many</span> sleepers are there?</p>
      ${steps(
        `<p><strong>Use the same units.</strong></p>
         ${sum('2.7 km = 2700 m')}`,
        `<p><strong>Divide.</strong> Make the divisor whole first.</p>
         ${sum('2700 ÷ 4.5 = 27 000 ÷ 45 = 600')}
         ${ans('600')}`
      )}
      ${tip('If a cut wastes some length, take the waste away before you share: a 2.5 m pipe cut once by a 4 mm blade gives (2.5 − 0.004) ÷ 2 = 1.248 m per piece. Metres to kilometres is ÷ 1000.')}`,

    // Y8 3E Q16, Q17: estimating to choose an answer
    'y8-3e-estimate': `
      <p class="hp-tag">Worked example: which starting number, multiplied by <b>0.38</b>, gives an answer between <b>2</b> and <b>2.1</b>? 0.54, 5.4 or 54?</p>
      ${steps(
        `<p><strong>Estimate.</strong> 0.38 is about 0.4, and 2 ÷ 0.4 = 5. So the answer should be near 5.</p>`,
        `<p><strong>Check it.</strong></p>
         ${sum('5.4 × 0.38 = 2.052')}
         ${ans('5.4')}`
      )}
      ${tip('Multiplying by a number less than 1 makes a number smaller. Dividing by a number less than 1 makes it bigger.')}`,

    // =====================================================================
    // Y8 3F Terminating decimals, recurring decimals and rounding
    // =====================================================================
    // Y8 3F Q1, Q2: fractions to terminating decimals
    'y8-3f-terminating': `
      <p class="hp-tag">Worked example: write <b>9/40</b> as a decimal.</p>
      ${steps(
        `<p><strong>Make the bottom 10, 100 or 1000.</strong> 40 × 25 = 1000, so multiply the top by 25 too.</p>
         ${sum('9/40 = 225/1000')}`,
        `<p><strong>Read it as a decimal.</strong></p>
         ${ans('0.225')}`
      )}
      ${tip('If the bottom will not turn into 10, 100, 1000 or 10 000, use short division: put zeros after the point and divide until the remainder is 0.')}`,

    // Y8 3F Q3, Q7: recurring decimals, rounded
    'y8-3f-recurring': `
      <p class="hp-tag">Worked example: write <b>8/11</b> as a decimal correct to 4 decimal places.</p>
      ${bus('11', ['8', '.', '0', '0', '0', '0', '0'], ['0', '.', '7', '2', '7', '2', '7'], ['', '', '8', '3', '8', '3', '8'], 'r 3')}
      ${steps(
        `<p><strong>Divide, adding zeros.</strong> The remainders go 8, 3, 8, 3, ... so the digits 7 and 2 repeat forever.</p>
         ${sum('8/11 = 0.727272...')}`,
        `<p><strong>Round.</strong> Keep 4 places and look at the 5th digit. It is 7, which is 5 or more, so round up.</p>
         ${ans('0.7273')}`
      )}
      ${tip('Work out one more digit than you need. To 2 places, 8/11 = 0.73. For a mixed numeral keep the whole number: 4 2/9 = 4.2222.')}`,

    // Y8 3F Q4, Q5, Q6, Q9, Q14: rounding decimals
    'y8-3f-rounding': `
      <p class="hp-tag">Worked example: round <b>5.68472</b> to 2 decimal places.</p>
      ${line('5.68', '5.685', '5.69', '5.68472', 47)}
      ${steps(
        `<p><strong>Find the last digit you keep.</strong> 2 places ends at the 8.</p>
         ${sum('5.6' + now('8') + '472')}`,
        `<p><strong>Look at the next digit.</strong> It is 4. Less than 5, so the 8 stays.</p>
         ${ans('5.68')}`,
        `<p><strong>5 or more rounds up.</strong> To 3 places, the next digit after 4 is 7, so 5.68472 becomes 5.685.</p>`
      )}
      ${tip('Give exactly the places asked for, even if they are zeros: 3.996 to 2 places is 4.00. For the nearest whole number, look at the first digit after the point.')}`,

    // Y8 3F Q8: estimating by rounding to 1 decimal place
    'y8-3f-estimate': `
      <p class="hp-tag">Worked example: estimate <b>7.932 + 2.48 − 1.756</b> by rounding to one decimal place.</p>
      ${steps(
        `<p><strong>Round each number first.</strong></p>
         ${sum('7.932 → 7.9<br>2.48 → 2.5<br>1.756 → 1.8')}`,
        `<p><strong>Work out the easier sum.</strong></p>
         ${sum('7.9 + 2.5 − 1.8 = 8.6')}
         ${ans('8.6')}`
      )}
      ${tip('Round first, then calculate. For × and ÷ it is the same: 14.03 ÷ 1.98 becomes 14.0 ÷ 2.0 = 7.')}`,

    // Y8 3F Q10: race times and rounding
    'y8-3f-timing': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">In a <span class="hp-hl">50</span> m race, Jess swims <span class="hp-hl">24.47</span> s and Kira swims <span class="hp-hl">24.52</span> s.</p>
      ${steps(
        `<p><strong>Round both times, then subtract.</strong></p>
         ${sum('Nearest second: 24 and 25, difference 1<br>Nearest tenth: 24.5 and 24.5, difference 0<br>Actual: 24.52 − 24.47 = 0.05')}`,
        `<p><strong>Quickest time that still shows 24.47:</strong> the smallest number that rounds up to 24.47 is halfway between 24.46 and 24.47.</p>
         ${sum('24.465')}`,
        `<p><strong>How far behind was Kira when Jess finished?</strong> In 24.47 s Kira swims 50 × 24.47 ÷ 24.52 = 49.898 m.</p>
         ${sum('50 − 49.898 = 0.102 m, about 10 cm')}
         ${ans('10')}`
      )}
      ${tip('1 m = 100 cm. Round only at the very end.')}`,

    // Y8 3F Q11, Q12, Q13: patterns in recurring decimals
    'y8-3f-pattern': `
      <p class="hp-tag">Worked example: <b>1/27</b> as a decimal. What digit is in the 20th decimal place?</p>
      ${steps(
        `<p><strong>Divide until a remainder comes back.</strong></p>
         ${sum('10 ÷ 27 = 0 r 10<br>100 ÷ 27 = 3 r 19<br>190 ÷ 27 = 7 r 1, back to the start')}
         ${sum('1/27 = 0.037 037 037...')}`,
        `<p><strong>The repeating block is 037, 3 digits long.</strong> Divide the place number by the block length.</p>
         ${sum('20 ÷ 3 = 6 r 2')}`,
        `<p><strong>6 full blocks, then 2 more digits.</strong> The 2nd digit of the block is 3.</p>
         ${ans('3')}`
      )}
      ${tip('If the remainder is 0, the digit is the last one in the block. Some decimals, like π = 3.14159..., go on forever and never repeat.')}`,

    // Y8 3F Q15: will it terminate or recur?
    'y8-3f-type': `
      <p class="hp-tag">Worked example: does <b>1/20</b> or <b>1/24</b> give a terminating decimal?</p>
      ${steps(
        `<p><strong>Write each denominator in prime factor form.</strong></p>
         ${sum('20 = 2^2 × 5<br>24 = 2^3 × 3')}`,
        `<p><strong>Look at the primes.</strong> Only 2s and 5s means it terminates. Any other prime means it recurs.</p>`,
        `<p><strong>Check by dividing.</strong> 1/20 = 0.05 stops. 1/24 = 0.041666... goes on.</p>
         ${ans('1/20 terminates, 1/24 recurs')}`
      )}
      ${tip('Simplify the fraction first. Type prime factor form with ^ for powers, like 2^3×3.')}`,

    // =====================================================================
    // Y8 3G Converting fractions, decimals and percentages
    // =====================================================================
    // Y8 3G Q1, Q2: percentages to fractions
    'y8-3g-pct-to-frac': `
      <p class="hp-tag">Worked example: write <b>85%</b> as a fraction in simplest form.</p>
      ${steps(
        `<p><strong>Per cent means out of 100.</strong> Write it over 100, then simplify.</p>
         ${sum('85% = 85/100 = 17/20')}
         ${ans('17/20')}`,
        `<p><strong>Over 100%? Use a mixed numeral.</strong></p>
         ${sum('230% = 230/100 = 2 30/100 = 2 3/10')}`,
        `<p><strong>A fraction or decimal in the percentage?</strong> Multiply the top and bottom to clear it.</p>
         ${sum('33 1/3% = 33 1/3 / 100 = 100/300 = 1/3 (× 3)<br>12.4% = 12.4/100 = 124/1000 = 31/250 (× 10)')}`
      )}
      ${tip('Type a mixed numeral with a space, like 2 3/10.')}`,

    // Y8 3G Q3: percentages to decimals
    'y8-3g-pct-to-dec': `
      <p class="hp-tag">Worked example: write <b>57%</b>, <b>412%</b> and <b>6.3%</b> as decimals.</p>
      ${steps(
        `<p><strong>Divide by 100.</strong> The point moves 2 places left.</p>
         ${sum('57% = 0.57<br>412% = 4.12')}`,
        `<p><strong>Fill empty places with zeros.</strong></p>
         ${sum('6.3% = 0.063')}
         ${ans('0.063')}`
      )}
      ${tip('A percentage under 1% gives a very small decimal: 0.4% = 0.004.')}`,

    // Y8 3G Q4, Q5, Q6: fractions to percentages
    'y8-3g-frac-to-pct': `
      <p class="hp-tag">Worked example: write <b>13/25</b> as a percentage.</p>
      ${steps(
        `<p><strong>Make the bottom 100.</strong> 25 × 4 = 100.</p>
         ${sum('13/25 = 52/100 = 52%')}
         ${ans('52%')}`,
        `<p><strong>If that will not work, multiply by 100.</strong></p>
         ${sum('5/12 × 100 = 500/12 = 41 8/12 = 41 2/3%')}
         ${ans('41 2/3%')}`
      )}
      ${tip('For a mixed numeral, each whole is 100%: 2 3/20 = 200% + 15% = 215%. If a percentage does not stop, give it as a mixed numeral or to 2 places: 41.67%.')}`,

    // Y8 3G Q7, Q8: decimals to percentages, and comparing
    'y8-3g-dec-to-pct': `
      <p class="hp-tag">Worked example: write <b>0.38</b>, <b>3.405</b> and <b>0.0052</b> as percentages.</p>
      ${steps(
        `<p><strong>Multiply by 100.</strong> The point moves 2 places right.</p>
         ${sum('0.38 = 38%<br>3.405 = 340.5%<br>0.0052 = 0.52%')}
         ${ans('0.52%')}`
      )}
      <p><strong>To compare amounts in different forms</strong>, change them all to percentages: 0.7, 2/3 and 68% are 70%, 66 2/3% and 68%, so 0.7 is the largest.</p>
      ${tip('A decimal bigger than 1 gives a percentage bigger than 100%.')}`,

    // Y8 3G Q9, Q10, Q11: completing conversion tables
    'y8-3g-table': `
      <p class="hp-tag">Worked example: complete the table.</p>
      ${fig({ kind: 'table', rows: [['Fraction', '3/20', '?', '?'], ['Decimal', '?', '?', '0.555...'], ['Percentage', '?', '4%', '?']] })}
      ${steps(
        `<p><strong>Fraction given:</strong> make the bottom 100.</p>
         ${sum('3/20 = 15/100 = 0.15 = 15%')}`,
        `<p><strong>Percentage given:</strong> write it over 100 and simplify.</p>
         ${sum('4% = 4/100 = 1/25 = 0.04')}`,
        `<p><strong>One digit repeating:</strong> it is that digit over 9. Then multiply by 100.</p>
         ${sum('0.555... = 5/9<br>5/9 × 100 = 500/9 = 55 5/9%')}
         ${ans('5/9, 55 5/9%')}`
      )}
      ${tip('Type the two answers in the order the question asks, with a comma between them, like 0.15, 15%.')}`,

    // Y8 3G Q12: smallest and largest possible season percentage
    'y8-3g-season': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A soccer team has won <span class="hp-hl">6</span> of its <span class="hp-hl">10</span> games. It has <span class="hp-hl">15</span> games left to play.</p>
      ${steps(
        `<p><strong>Find the total for the season.</strong></p>
         ${sum('10 + 15 = 25 games')}`,
        `<p><strong>Smallest: it wins no more games.</strong></p>
         ${sum('6/25 = 24/100 = 24%')}`,
        `<p><strong>Largest: it wins every game left.</strong></p>
         ${sum('6 + 15 = 21, and 21/25 = 84/100 = 84%')}
         ${ans('24% and 84%')}`
      )}
      ${tip('Divide by the games for the whole season, not just the games played so far.')}`,

    // Y8 3G Q16: what part of a square is each piece?
    'y8-3g-tangram': `
      <p class="hp-tag">Worked example: what part of the whole square is triangle T?</p>
      ${fig({ kind: 'diagram', unit: 40, items: [
        { seg: [0, 0, 4, 0] }, { seg: [0, 1, 4, 1] }, { seg: [0, 2, 4, 2] }, { seg: [0, 3, 4, 3] }, { seg: [0, 4, 4, 4] },
        { seg: [0, 0, 0, 4] }, { seg: [1, 0, 1, 4] }, { seg: [2, 0, 2, 4] }, { seg: [3, 0, 3, 4] }, { seg: [4, 0, 4, 4] },
        { poly: [[0, 0], [3, 0], [0, 2]] }, { label: 'T', at: [0.9, 0.6] }
      ] })}
      ${steps(
        `<p><strong>Split the whole into small equal parts.</strong> The square is 4 by 4, so 16 small squares.</p>`,
        `<p><strong>Find the area of the piece.</strong> A triangle is half its base times its height.</p>
         ${sum('1/2 × 3 × 2 = 3 small squares')}`,
        `<p><strong>Write it as a fraction, then convert.</strong></p>
         ${sum('3/16 = 0.1875 = 18.75%')}
         ${ans('18.75%')}`
      )}
      ${tip('A cut from corner to corner splits a square or rectangle exactly in half. Use halves of halves to compare pieces.')}`,

    // =====================================================================
    // Y8 3H Finding a percentage and expressing as a percentage
    // =====================================================================
    // Y8 3H Q1 to Q5, Q12, Q13, Q14, Q18: one amount as a percentage of another
    'y8-3h-express': `
      <p class="hp-tag">Worked example: write <b>22 out of 40</b> as a percentage.</p>
      ${steps(
        `<p><strong>Write part over whole.</strong></p>
         ${sum('22/40')}`,
        `<p><strong>Multiply by 100.</strong></p>
         ${sum('22/40 × 100 = 2200/40 = 55%')}
         ${ans('55%')}`,
        `<p><strong>If it does not stop</strong>, give a mixed numeral or round to 2 places.</p>
         ${sum('7/15 × 100 = 700/15 = 46 2/3% (or 46.67%)')}`
      )}
      ${tip('The first amount can be bigger than the second: 39 as a percentage of 30 is 130%. If the question asks about the other part, find it first: missing 6 days out of 50 means attending 44, which is 88%.')}`,

    // Y8 3H Q6: percentages with different units
    'y8-3h-units': `
      <p class="hp-tag">Worked example: write <b>450 g</b> as a percentage of <b>1.8 kg</b>.</p>
      ${steps(
        `<p><strong>Change to the same units.</strong> Use the smaller unit.</p>
         ${sum('1.8 kg = 1800 g')}`,
        `<p><strong>Part over whole, times 100.</strong></p>
         ${sum('450/1800 × 100 = 25%')}
         ${ans('25%')}`
      )}
      <p>The answer can be over 100%: 2.8 m as a percentage of 70 cm is 280 cm out of 70 cm, which is 400%.</p>
      ${tip('Handy facts: $1 = 100 cents, 1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g.')}`,

    // Y8 3H Q7, Q8, Q9, Q16, Q17: finding a percentage of an amount
    'y8-3h-of': `
      <p class="hp-tag">Worked example: find <b>45% of 260</b>.</p>
      ${steps(
        `<p><strong>Find 10%.</strong> Divide by 10.</p>
         ${sum('10% of 260 = 26')}`,
        `<p><strong>Build the percentage you need.</strong></p>
         ${sum('40% = 4 × 26 = 104<br>5% = half of 26 = 13')}`,
        `<p><strong>Add the pieces.</strong></p>
         ${sum('104 + 13 = 117')}
         ${ans('117')}`
      )}
      <p><strong>With a calculator:</strong> 45 ÷ 100 × 260 = 117. Over 100% works the same way: 230% of 18 = 36 + 5.4 = 41.4. Watch the units: 8% of 3.5 kg in grams is 8% of 3500 g = 280 g.</p>
      ${tip('You can swap the numbers: 4% of 75 is the same as 75% of 4, which is 3.')}`,

    // Y8 3H Q10: fraction percentages like 12 1/2%
    'y8-3h-thirds': `
      <p class="hp-tag">Worked example: find <b>62 1/2% of 56</b>.</p>
      ${steps(
        `<p><strong>Change the percentage to a fraction.</strong></p>
         ${sum('62 1/2% = 0.625 = 625/1000 = 5/8')}`,
        `<p><strong>Find that fraction of the amount.</strong> Divide by the bottom, times by the top.</p>
         ${sum('56 ÷ 8 = 7<br>7 × 5 = 35')}
         ${ans('35')}`
      )}
      ${tip('Percentages with a fraction in them are often simple fractions in disguise: 87 1/2% = 0.875 = 7/8.')}`,

    // Y8 3H Q11: survey with "everyone else"
    'y8-3h-survey': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">In a survey, <span class="hp-hl">35%</span> chose pizza and <span class="hp-hl">48%</span> chose tacos. <span class="hp-kw">Everyone else</span> chose sushi. If <span class="hp-hl">800</span> people answered, how many chose sushi?</p>
      ${steps(
        `<p><strong>The whole is 100%.</strong> Find the percentage left over.</p>
         ${sum('100% − 35% − 48% = 17%')}`,
        `<p><strong>Find that percentage of the total.</strong></p>
         ${sum('17% of 800 = 0.17 × 800 = 136')}
         ${ans('136')}`
      )}
      ${tip('Check: 35% of 800 is 280 and 48% is 384. 280 + 384 + 136 = 800.')}`,

    // Y8 3H Q15: marks needed to beat a percentage
    'y8-3h-beat': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ben scored <span class="hp-hl">64%</span> on his last quiz. His next quiz is out of <span class="hp-hl">35</span>. What is the smallest score that <span class="hp-kw">beats</span> 64%?</p>
      ${steps(
        `<p><strong>Find 64% of the new total.</strong></p>
         ${sum('0.64 × 35 = 22.4')}`,
        `<p><strong>Marks are whole numbers, and he must score more than 22.4.</strong></p>
         ${ans('23')}`
      )}
      ${tip('Check: 23/35 is about 65.7%, which beats 64%. 22/35 is about 62.9%, which does not.')}`,

    // Y8 3H Q19: percentage increase in area
    'y8-3h-area': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A <span class="hp-hl">16</span> cm by <span class="hp-hl">25</span> cm rectangle has each side increased by <span class="hp-hl">15%</span>. What is the percentage increase in area?</p>
      ${steps(
        `<p><strong>Old area.</strong></p>
         ${sum('16 × 25 = 400 cm²')}`,
        `<p><strong>New sides and new area.</strong> Increasing by 15% means × 1.15.</p>
         ${sum('16 × 1.15 = 18.4<br>25 × 1.15 = 28.75<br>18.4 × 28.75 = 529 cm²')}`,
        `<p><strong>Increase as a percentage of the old area.</strong></p>
         ${sum('529 − 400 = 129<br>129/400 × 100 = 32.25%')}
         ${ans('32.25%')}`
      )}
      ${tip('Shortcut for any rectangle: 1.15 × 1.15 = 1.3225, a 32.25% increase. Going backwards, to double the area each side is × √2 = 1.4142, a 41.42% increase.')}`,

    // =====================================================================
    // Y8 3I Decreasing and increasing by a percentage
    // =====================================================================
    // Y8 3I Q1 to Q4, Q6, Q7: increasing and decreasing by a percentage
    'y8-3i-change': `
      <p class="hp-tag">Worked example: increase <b>$220</b> by <b>35%</b>.</p>
      ${steps(
        `<p><strong>Find the percentage of the amount.</strong></p>
         ${sum('10% = 22, so 30% = 66<br>5% = 11<br>35% = 66 + 11 = 77')}`,
        `<p><strong>Add it for an increase.</strong></p>
         ${sum('220 + 77 = 297')}
         ${ans('297')}`
      )}
      <p><strong>Decrease $85 by 30%:</strong> 30% of 85 is 25.50, so 85 − 25.50 = 59.50.</p>
      ${chips(['mark-up, increase, rise', 'add'], ['discount, reduce, depreciate', 'take'])}
      ${tip('Shortcut: increasing by 35% is × 1.35, decreasing by 30% is × 0.7. A mark-up in dollars is just added on. Type money without the $ sign, like 59.50.')}`,

    // Y8 3I Q5, Q8: adding GST and rounding money
    'y8-3i-gst': `
      <p class="hp-tag">Worked example: add <b>10% GST</b> to <b>$73</b>.</p>
      ${steps(
        `<p><strong>Find 10%.</strong> Divide by 10.</p>
         ${sum('10% of 73 = 7.30')}`,
        `<p><strong>Add it on.</strong></p>
         ${sum('73 + 7.30 = 80.30')}
         ${ans('80.30')}`,
        `<p><strong>Round to the nearest cent if needed.</strong> For $54.95, 10% is 5.495, and 54.95 + 5.495 = 60.445, which rounds to $60.45.</p>`
      )}
      <p><strong>Paying cash?</strong> Round the total to the nearest 5 cents.</p>
      ${chips(['ends in 1 or 2: round down to 0'], ['ends in 3 or 4: round up to 5'], ['ends in 6 or 7: round down to 5'], ['ends in 8 or 9: round up to 0'])}
      ${tip('Card payments are to the exact cent: $27.13 by card stays $27.13, but in cash it is $27.15.')}`,

    // Y8 3I Q9, Q10, Q13: sales and comparing deals
    'y8-3i-sale': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A <span class="hp-hl">$320</span> jacket is <span class="hp-hl">20%</span> off. Later the shop takes a <span class="hp-kw">further</span> <span class="hp-hl">15%</span> off the sale price. What does it cost now?</p>
      ${steps(
        `<p><strong>First discount.</strong> 20% off means you pay 80%.</p>
         ${sum('320 × 0.8 = 256')}`,
        `<p><strong>Second discount, on the new price.</strong> 15% off means you pay 85%.</p>
         ${sum('256 × 0.85 = 217.60')}
         ${ans('217.60')}`
      )}
      ${tip('This is not the same as 35% off, which gives $208. With the same discount on several items, add the prices first, then take the discount once. To compare deals, work out each final price.')}`,

    // Y8 3I Q11, Q12: percentage multipliers
    'y8-3i-multiplier': `
      <p class="hp-tag">Worked example: what decimal increases a value by <b>23%</b>? What decimal decreases it by <b>9%</b>?</p>
      ${steps(
        `<p><strong>Increase: add the percentage to 100%.</strong></p>
         ${sum('100% + 23% = 123% = 1.23')}`,
        `<p><strong>Decrease: take it away from 100%.</strong></p>
         ${sum('100% − 9% = 91% = 0.91')}
         ${ans('1.23 and 0.91')}`
      )}
      <p><strong>Up then down by the same percentage</strong> does not get you back. $400 up 10% is $440, then down 10% is $396. Since 1.1 × 0.9 = 0.99, that is a 1% decrease overall.</p>
      ${tip('Change a percentage to a decimal by dividing by 100: 91% = 0.91, and 6% = 0.06, not 0.6.')}`,

    // Y8 3I Q14: commission and wages
    'y8-3i-commission': `
      <p class="hp-tag">Worked example: find <b>3%</b> commission on sales of <b>$14 500</b>.</p>
      ${steps(
        `<p><strong>Commission is a percentage of the sales.</strong></p>
         ${sum('0.03 × 14 500 = 435')}
         ${ans('435')}`,
        `<p><strong>Wage plus commission:</strong> add the two parts. $21 per hour for 30 hours plus 5% of $2000 in sales:</p>
         ${sum('21 × 30 = 630<br>5% of 2000 = 100<br>630 + 100 = 730')}`,
        `<p><strong>When are two deals equal?</strong> Ana gets $20/h + 2%, Bo gets $17/h + 5%, both for 30 hours. Ana is $3 × 30 = $90 ahead on hours, so they are equal when the extra 3% of sales is $90.</p>
         ${sum('3% = 90, so 1% = 30 and sales = $3000<br>Wage: 600 + 60 = 660')}`
      )}
      ${tip('Check equal-wage answers by working out both wages: Bo gets 510 + 150 = 660 too.')}`,

    // =====================================================================
    // Y8 3J Calculating percentage change, profit and loss
    // =====================================================================
    // Y8 3J Q1 to Q4, Q6 to Q10, Q12: percentage change, profit and loss
    'y8-3j-change': `
      <p class="hp-tag">Worked example: a price goes from <b>$40</b> to <b>$58</b>. Find the percentage change.</p>
      ${steps(
        `<p><strong>Find the change.</strong></p>
         ${sum('58 − 40 = 18 (a profit)')}`,
        `<p><strong>Divide by the starting value, then × 100.</strong></p>
         ${sum('18/40 × 100 = 45%')}
         ${ans('45')}`
      )}
      <p><strong>A loss works the same way:</strong> $80 to $62 is a change of 18, and 18/80 × 100 = 22.5%. <strong>Rounding:</strong> $24 to $31 gives 7/24 × 100 = 29.166..., which is 29.17 to 2 places.</p>
      ${tip('Always divide by the value you started with. Type just the number, like 45.')}`,

    // Y8 3J Q5: percentage error
    'y8-3j-error': `
      <p class="hp-tag">Worked example: a bag is weighed at <b>47 g</b>, but it actually weighs <b>50 g</b>. Find the percentage error.</p>
      ${steps(
        `<p><strong>Find the error.</strong> It is the difference, always positive.</p>
         ${sum('50 − 47 = 3 g')}`,
        `<p><strong>Divide by the actual value, then × 100.</strong></p>
         ${sum('3/50 × 100 = 6%')}
         ${ans('6')}`
      )}
      <p>With decimals: a time is recorded as 9.6 s but was really 9.75 s. The error is 0.15, and 0.15/9.75 × 100 = 1.538..., which is 1.5 to one place.</p>
      ${tip('Divide by the actual value, not the measured one.')}`,

    // Y8 3J Q11, Q13: why the starting value matters
    'y8-3j-reason': `
      <p class="hp-tag">Worked example: a price goes from <b>$30</b> to <b>$60</b>, and another goes from <b>$60</b> to <b>$30</b>.</p>
      ${steps(
        `<p><strong>Going up:</strong></p>
         ${sum('30/30 × 100 = 100% profit')}`,
        `<p><strong>Going down:</strong></p>
         ${sum('30/60 × 100 = 50% loss')}`,
        `<p><strong>Same $30 change, different start.</strong> A percentage compares the change with the starting value, so a smaller start gives a bigger percentage.</p>
         ${ans('100% and 50%')}`
      )}
      ${tip('Over several steps, do not add the percentages. 10 to 30 is 200%, and 30 to 36 is 20%, but 10 to 36 overall is 26/10 × 100 = 260%.')}`,

    // Y8 3J Q14: growth year after year
    'y8-3j-growth': `
      <p class="hp-tag">Worked example: a town of <b>48 000</b> people grows by <b>2.5%</b> each year.</p>
      ${steps(
        `<p><strong>Growth in one year:</strong></p>
         ${sum('2.5% of 48 000 = 0.025 × 48 000 = 1200 more')}`,
        `<p><strong>Each year, multiply by 1.025.</strong></p>
         ${sum('After 2 years: 48 000 × 1.025 × 1.025 = 50 430')}`,
        `<p><strong>For many years, use the power key.</strong></p>
         ${sum('After 5 years: 48 000 × 1.025^5 = 54 307.59...')}
         ${ans('54308')}`
      )}
      ${tip('Finding the rate: one extra person every 2 minutes is 720 a day, so 720 × 365 = 262 800 a year. For 20 000 000 people that is 262 800 ÷ 20 000 000 × 100 = 1.314, about 1.3%. Type big numbers with no spaces.')}`,

    // =====================================================================
    // Y8 3K Solving percentage problems using the unitary method
    // =====================================================================
    // Y8 3K Q1, Q2, Q5, Q6, Q11, Q12: finding the full amount
    'y8-3k-full': `
      <p class="hp-tag">Worked example: <b>7%</b> of an amount is <b>$56</b>. What is the full amount?</p>
      ${flow(['7%', '$56'], ['÷ 7', '1% = $8'], ['× 100', '100% = $800'])}
      ${steps(
        `<p><strong>Find 1%.</strong> Divide by the percentage.</p>
         ${sum('56 ÷ 7 = 8')}`,
        `<p><strong>Find 100%.</strong> Multiply by 100.</p>
         ${sum('8 × 100 = 800')}
         ${ans('800')}`
      )}
      <p>It works for more than 100% too: if 120% of a mass is 54 kg, then 1% is 54 ÷ 120 = 0.45 kg, and 100% is 45 kg.</p>
      ${tip('With letters, do the same steps: if p% is $3, then 1% is 3/p and 100% is 300/p.')}`,

    // Y8 3K Q3, Q4, Q13: from one percentage to another
    'y8-3k-other': `
      <p class="hp-tag">Worked example: <b>15%</b> of a bill is <b>$27</b>. How much is <b>40%</b> of the bill?</p>
      ${flow(['15%', '$27'], ['÷ 15', '1% = $1.80'], ['× 40', '40% = $72'])}
      ${steps(
        `<p><strong>Find 1%.</strong></p>
         ${sum('27 ÷ 15 = 1.8')}`,
        `<p><strong>Multiply up to the percentage you want.</strong></p>
         ${sum('1.8 × 40 = 72')}
         ${ans('72')}`
      )}
      ${tip('You do not need the whole bill. Go straight from 1% to the percentage you want. With letters, follow exactly the same two steps.')}`,

    // Y8 3K Q7, Q8, Q14: finding the original price
    'y8-3k-original': `
      <p class="hp-tag">Worked example: a jacket is discounted by <b>35%</b>. The sale price is <b>$91</b>. What was the original price?</p>
      ${steps(
        `<p><strong>What percentage is left?</strong> After 35% off you pay 65%.</p>
         ${sum('100% − 35% = 65%, so 65% = $91')}`,
        `<p><strong>Find 1%.</strong></p>
         ${sum('91 ÷ 65 = 1.4')}`,
        `<p><strong>Find 100%.</strong></p>
         ${sum('1.4 × 100 = 140')}
         ${ans('140')}`
      )}
      ${tip('A price including 10% GST is 110% of the price before GST. If it costs $143 with GST: 1% = 143 ÷ 110 = 1.3, so the price before GST is $130.')}`,

    // Y8 3K Q9, Q10: "the rest" and working backwards
    'y8-3k-rest': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story"><span class="hp-hl">45%</span> of students walk to school and <span class="hp-hl">30%</span> catch the bus. <span class="hp-kw">The rest</span> come by car. If <span class="hp-hl">60</span> students come by car, how many students are there?</p>
      ${steps(
        `<p><strong>Find the percentage for the rest.</strong></p>
         ${sum('100% − 45% − 30% = 25%')}`,
        `<p><strong>25% is 60 students. Use the unitary method.</strong></p>
         ${sum('1% = 60 ÷ 25 = 2.4<br>100% = 2.4 × 100 = 240')}
         ${ans('240')}`
      )}
      ${tip('For two steps, work backwards. Spend 50%, then 20% of what is left, and $12 remains: $12 is 80% of the leftover, so the leftover is $15. $15 is 50% of the start, so the start was $30.')}`
  });
})();
