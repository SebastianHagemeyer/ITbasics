/* H3 help panels for Year 8 Chapter 7. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 7A to 7J. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // Number line with a ray or a segment, drawn the same way as the question figures.
  // a or b = null means the line runs off that end with an arrow. Closed = filled circle (included).
  const nl = (min, max, a, aClosed, b, bClosed, alt) => {
    const items = [{ seg: [min - 0.6, 0, max + 0.6, 0], thin: true }];
    for (let v = min; v <= max; v++) items.push({ seg: [v, -0.14, v, 0.14], thin: true }, { label: String(v).replace('-', '−'), at: [v, -0.62] });
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

  // Rectangle with an expression on each side.
  const rect = (top, bottom, left, right) => fig({ kind: 'diagram', unit: 36, alt: 'A rectangle with an expression on each side', items: [
    { poly: [[0, 0], [5, 0], [5, 2.6], [0, 2.6]] },
    { label: top, at: [2.5, 3.05] }, { label: bottom, at: [2.5, -0.5] },
    { label: left, at: [-0.9, 1.3] }, { label: right, at: [5.9, 1.3] }] });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 7A Reviewing equations
    // =====================================================================
    // Y8 7A Q1, Q2, Q3, Q4, Q5: true or false, and checking a solution
    'y8-7a-check': `
      <p class="hp-tag">Worked example: someone says <b>k = 7</b> solves <b>2k + 3 = 3k − 4</b>. Correct or incorrect?</p>
      ${steps(
        `<p><strong>Put 7 in place of k on the left side.</strong></p>
         ${sum(`${now('2 × 7')} + 3 = 14 + 3 = 17`)}`,
        `<p><strong>Now the right side, on its own.</strong></p>
         ${sum(`${now('3 × 7')} − 4 = 21 − 4 = 17`)}`,
        `<p><strong>Compare.</strong> Both sides are 17, so the equation is true when k = 7.</p>
         ${ans('Correct')}`
      )}
      <p><strong>No letters?</strong> Work out each side: 8 + 6 = 14 and 2 × 7 = 14, so 8 + 6 = 2 × 7 is true. <strong>A negative value?</strong> Use brackets: for y = −2, y(y − 3) is (−2) × (−5) = 10.</p>
      ${tip('Never work across the = sign. Find the value of each side separately. If the two sides differ, the equation is false and the proposed solution is incorrect.')}`,

    // Y8 7A Q6, Q8: finding the unknown number
    'y8-7a-solve': `
      <p class="hp-tag">Worked example: find a solution to <b>4m − 3 = 25</b>. Then find the number if <b>two-fifths of it is 18</b>.</p>
      ${steps(
        `<p><strong>Try a value of m.</strong> Put it in the left side and see how close you get to 25.</p>
         ${sum('m = 5: 4 × 5 − 3 = 17 &nbsp; too small<br>m = 8: 4 × 8 − 3 = 29 &nbsp; too big')}`,
        `<p><strong>Adjust and try again.</strong> The answer is between 5 and 8, so try 7. The left side is 25, the same as the right side, so m = 7 is a solution.</p>
         ${sum('m = 7: 4 × 7 − 3 = 28 − 3 = 25 ✓')}
         ${ans('7')}`,
        `<p><strong>Fractions of a number.</strong> Two-fifths is 18, so one-fifth is half of that, and the whole is five fifths.</p>
         ${sum('18 ÷ 2 = 9 &nbsp; 9 × 5 = 45')}
         ${ans('45')}`
      )}
      <p><strong>"Less than" or "more than"?</strong> If seven less than a number is −2, add the 7 back: −2 + 7 = 5.</p>
      ${tip('Type just the number, like 7, not m = 7. Type a negative answer with a minus sign, like -6.')}`,

    // Y8 7A Q7, Q9: writing an equation from words
    'y8-7a-write': `
      <p class="hp-tag">Worked example: write an equation for each. (a) <b>A number n is doubled, then 9 is taken away. The result is 31.</b> (b) <b>y plus a quarter of y is 15.</b> (c) <b>Notebooks cost $n and pens cost $p. Three notebooks and four pens cost $22.</b></p>
      ${steps(
        `<p><strong>Build the left side in the order the words give it.</strong> Doubled is 2n, then take away 9. "The result is" becomes =.</p>
         ${sum('(a) 2n − 9 = 31')}`,
        `<p><strong>A fraction of a letter is a division.</strong> A quarter of y is y/4.</p>
         ${sum('(b) y + y/4 = 15')}`,
        `<p><strong>Two things to buy: one term for each.</strong> Three notebooks cost 3n, four pens cost 4p.</p>
         ${sum('(c) 3n + 4p = 22')}
         ${ans('2n-9=31, y+y/4=15, 3n+4p=22')}`
      )}
      <p><strong>Price per kilogram?</strong> x kg of cherries at $3.20 per kg costing $16 gives 3.2x = 16, and the solution is x = 5.</p>
      ${tip('Type the whole equation, with the = sign: 2n-9=31. Write a decimal without the extra zero (3.2x, not 3.20x).')}`,

    // Y8 7A Q10: an age problem
    'y8-7a-age': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">In <span class="hp-hl">20</span> years' time, Tom's age will be <span class="hp-hl">five times</span> his age now. He is t years old.</p>
      ${steps(
        `<p><strong>Write both sides in terms of t.</strong> His age in 20 years is t + 20. Five times his age now is 5t.</p>
         ${sum('t + 20 = 5t')}`,
        `<p><strong>Find the solution by trying values.</strong> Work out each side for a few values of t. You want the two sides to match.</p>
         ${fig({ kind: 'table', rows: [['t', '3', '4', '5'], ['t + 20', '23', '24', '25'], ['5t', '15', '20', '25']] })}
         <p>At t = 5 both sides are 25 ✓, so t = 5 is the solution. Tom is 5.</p>`,
        `<p><strong>How long until he is seven times his age now?</strong> Seven times 5 is 35. He needs 35 − 5 more years.</p>
         ${ans('t+20=5t, 5, 30')}`
      )}
      ${tip('"In 20 years" means add 20. "Years ago" means subtract. Type the equation in full, like t+20=5t.')}`,

    // Y8 7A Q11, Q12, Q14: equations with two solutions
    'y8-7a-two': `
      <p class="hp-tag">Worked example: find both solutions of <b>t(10 − t) = 21</b>, and of <b>x² = 49</b>.</p>
      ${steps(
        `<p><strong>Try values in a table.</strong> Work out t × (10 − t) for each one.</p>
         ${fig({ kind: 'table', rows: [['t', '1', '2', '3', '4', '5', '6', '7'], ['t(10 − t)', '9', '16', '21', '24', '25', '24', '21']] })}
         <p>21 appears twice: t = 3 and t = 7.</p>
         ${ans('3, 7')}`,
        `<p><strong>Squares have a positive and a negative answer.</strong> 7 × 7 = 49 and (−7) × (−7) = 49.</p>
         ${ans('-7, 7')}`,
        `<p><strong>Try negatives in other equations too.</strong> For p(p + 2) = 15, p = 3 works (3 × 5) and so does p = −5, because (−5) × (−3) = 15.</p>`
      )}
      ${tip('Type both values separated by a comma, like -7, 7. A square is never negative, so an equation like x² = −25 has no solutions.')}`,

    // Y8 7A Q13: always, sometimes or never true
    'y8-7a-always': `
      ${chips(['Always: every value works', 'add'], ['Sometimes: only some values work'], ['Never: no value works', 'take'])}
      <p class="hp-tag">Worked example: classify <b>y + 7 = 7 + y</b>, <b>n + 2 = n + 9</b>, <b>6 − w = w</b> and <b>9 + k = 9</b>.</p>
      ${steps(
        `<p><strong>y + 7 = 7 + y.</strong> Adding works in either order, so it is true for every y: <b>always</b>.</p>`,
        `<p><strong>n + 2 = n + 9.</strong> Whatever n is, the right side is 7 bigger: <b>never</b>.</p>`,
        `<p><strong>6 − w = w</strong> only works for w = 3, and <strong>9 + k = 9</strong> only for k = 0: both <b>sometimes</b>.</p>
         ${ans('Always, Never, Sometimes, Sometimes')}`
      )}
      ${tip('Test two or three values, including 0. If some work and some do not, it is sometimes true.')}`,

    // Y8 7A Q16: two equations at once
    'y8-7a-pairs': `
      <p class="hp-tag">Worked example: find c and d if (a) <b>c + d = 13</b> and <b>cd = 40</b>, c bigger than d; (b) <b>c − d = 4</b> and <b>c + d = 18</b>.</p>
      ${steps(
        `<p><strong>(a) List the pairs that multiply to 40.</strong></p>
         ${chips(['1 and 40'], ['2 and 20'], ['4 and 10'], ['5 and 8', 'add'])}
         <p>Only 5 and 8 add to 13. c is the bigger one.</p>
         ${ans('8, 5')}`,
        `<p><strong>(b) List pairs that add to 18, then check the difference.</strong> Start in the middle and move the numbers apart one step at a time.</p>
         ${chips(['9 and 9: difference 0'], ['10 and 8: difference 2'], ['11 and 7: difference 4', 'add'])}
         <p>11 + 7 = 18 and 11 − 7 = 4, so both equations are true.</p>
         ${ans('11, 7')}`
      )}
      ${tip('Type c then d, separated by a comma. Check your pair in both equations before you type it.')}`,

    // =====================================================================
    // 7B Equivalent equations
    // =====================================================================
    // Y8 7B Q1, Q2: doing the same to both sides
    'y8-7b-apply': `
      <p class="hp-tag">Worked example: apply the operation to both sides. (a) <b>13 + 2x = 31 [− 13]</b> (b) <b>7m = 63 [÷ 7]</b> (c) <b>20 = 8 − k [− 8]</b></p>
      ${steps(
        `<p><strong>Do it to the left side and to the right side.</strong></p>
         ${sum('(a) 13 + 2x − 13 = 31 − 13<br>&nbsp;&nbsp;&nbsp;&nbsp;2x = 18')}`,
        `${sum('(b) 7m ÷ 7 = 63 ÷ 7<br>&nbsp;&nbsp;&nbsp;&nbsp;m = 9')}`,
        `<p><strong>Keep the minus sign that belongs to k.</strong></p>
         ${sum('(c) 20 − 8 = 8 − k − 8<br>&nbsp;&nbsp;&nbsp;&nbsp;12 = −k')}
         ${ans('18, 9, 12')}`
      )}
      ${tip('An equation is a balance. Whatever you do to one side, do to the other, and the new equation is equivalent (it has the same solution).')}`,

    // Y8 7B Q3, Q4, Q5: solving in two steps
    'y8-7b-solve': `
      <p class="hp-tag">Worked example: solve <b>9m − 4 = 50</b></p>
      ${steps(
        `<p><strong>Undo the − 4 first.</strong> Add 4 to both sides.</p>
         ${sum('9m − 4 + 4 = 50 + 4<br>9m = 54')}`,
        `<p><strong>Then undo the × 9.</strong> Divide both sides by 9.</p>
         ${flow(['Start', '9m − 4 = 50'], ['+ 4', '9m = 54'], ['÷ 9', 'm = 6'])}
         ${ans('6')}`,
        `<p><strong>Check.</strong> 9 × 6 − 4 = 54 − 4 = 50 ✓</p>`
      )}
      <p><strong>Letter on the right?</strong> Same moves: −31 = 4p + 5 → −36 = 4p → p = −9.</p>
      ${tip('Undo in reverse order: first the + or −, then the × or ÷. Type just the number, like -9.')}`,

    // Y8 7B Q6: a negative letter term
    'y8-7b-negative': `
      <p class="hp-tag">Worked example: solve <b>22 − 3n = 7</b> and <b>9 = 1 − 4y</b></p>
      ${steps(
        `<p><strong>Take 22 from both sides.</strong> The minus sign stays with the 3n.</p>
         ${sum('−3n = 7 − 22 = −15')}`,
        `<p><strong>Divide both sides by −3.</strong> A negative divided by a negative is positive.</p>
         ${sum('n = −15 ÷ (−3) = 5')}`,
        `<p><strong>Same idea with the letter on the right.</strong></p>
         ${sum('9 − 1 = −4y → 8 = −4y → y = −2')}
         <p>Check: 1 − 4 × (−2) = 1 + 8 = 9 ✓</p>
         ${ans('5, -2')}`
      )}
      ${tip('22 − 3n means 22 + (−3n), so you divide by −3, not by 3.')}`,

    // Y8 7B Q7: answers that are fractions
    'y8-7b-fraction': `
      <p class="hp-tag">Worked example: solve <b>4x + 3 = 6</b> and <b>1 − 2x = 10</b></p>
      ${steps(
        `<p><strong>Solve as usual.</strong></p>
         ${sum('4x = 3 → x = 3/4')}
         <p>4 does not go into 3 evenly, so leave the answer as a fraction.</p>`,
        `<p><strong>Watch the sign.</strong></p>
         ${sum('−2x = 9 → x = 9 ÷ (−2) = −9/2')}
         ${ans('3/4, -9/2')}`
      )}
      ${tip('Type a fraction with a slash and the minus sign in front: -9/2. Simplify it if you can: 6/4 is 3/2.')}`,

    // Y8 7B Q8, Q11: equations from words
    'y8-7b-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">(a) When <span class="hp-hl">k</span> is multiplied by 5 and 7 is subtracted, the result is 33. (b) Leo works 5 hours at <span class="hp-hl">$x</span> per hour, then 3 more hours at triple that rate. He earns $249.20.</p>
      ${steps(
        `<p><strong>(a) Write it, then solve.</strong></p>
         ${sum('5k − 7 = 33 → 5k = 40 → k = 8')}`,
        `<p><strong>(b) One term for each part of the pay.</strong> 5 hours at x is 5x. Triple the rate is 3x, for 3 hours: 9x.</p>
         ${sum('5x + 9x = 249.20<br>14x = 249.20')}`,
        `<p><strong>Divide by 14.</strong></p>
         ${sum('x = 249.20 ÷ 14 = 17.80')}
         ${ans('8, 17.80')}`
      )}
      ${tip('"y subtracted from 3" is 3 − y, but "3 subtracted from y" is y − 3. Type money with two decimal places, like 17.80.')}`,

    // Y8 7B Q9, Q14: more than two steps
    'y8-7b-brackets': `
      <p class="hp-tag">Worked example: solve <b>7 × (2x − 1) = 63</b> and <b>(5x + 3) ÷ 4 = 2</b></p>
      ${steps(
        `<p><strong>Undo what is outside the bracket first.</strong> Divide both sides by 7.</p>
         ${sum('2x − 1 = 9')}`,
        `<p><strong>Then solve the rest.</strong></p>
         ${sum('2x = 10 → x = 5')}`,
        `<p><strong>Second one: undo the ÷ 4 by multiplying.</strong></p>
         ${sum('5x + 3 = 8 → 5x = 5 → x = 1')}
         ${ans('5, 1')}`
      )}
      ${tip('The bracket was worked out first when the equation was built, so it is undone last.')}`,

    // Y8 7B Q10: sides of a rectangle
    'y8-7b-rect': `
      <p class="hp-tag">Worked example: this shape is a rectangle. Find x and y.</p>
      ${rect('2x + 9', '25', '4y', '10')}
      ${steps(
        `<p><strong>Opposite sides of a rectangle are equal.</strong> Top = bottom.</p>
         ${sum('2x + 9 = 25 → 2x = 16 → x = 8')}`,
        `<p><strong>Left = right.</strong></p>
         ${sum('4y = 10 → y = 10/4 = 5/2')}
         ${ans('8, 5/2')}`
      )}
      <p><strong>Only the perimeter given?</strong> Add all four sides and set the total equal to the perimeter.</p>
      ${tip('Type the values in the order asked, separated by a comma. Fractions like 5/2 are fine.')}`,

    // Y8 7B Q12, Q13: are two equations equivalent?
    'y8-7b-equivalent': `
      <p class="hp-tag">Worked example: are <b>5k − 4 = 26</b> and <b>2k + 7 = 19</b> equivalent?</p>
      ${steps(
        `<p><strong>Solve each one.</strong></p>
         ${sum('5k − 4 = 26 → 5k = 30 → k = 6<br>2k + 7 = 19 → 2k = 12 → k = 6')}`,
        `<p><strong>Same solution, so they are equivalent.</strong> You can also build one from the other, doing the same to both sides:</p>
         ${flow(['Start', 'k = 6'], ['× 2', '2k = 12'], ['+ 7', '2k + 7 = 19'])}
         ${ans('Yes')}`
      )}
      ${tip('Equivalent equations have exactly the same solution. If one gives k = 6 and the other gives k = 7, they are not equivalent.')}`,

    // Y8 7B Q15: dividing every term first
    'y8-7b-divide': `
      <p class="hp-tag">Worked example: solve <b>6x + 18 = 54</b> by first dividing every term by 6.</p>
      ${steps(
        `<p><strong>Divide every term, on both sides.</strong></p>
         ${sum('6x ÷ 6 + 18 ÷ 6 = 54 ÷ 6<br>x + 3 = 9')}`,
        `<p><strong>One step left.</strong></p>
         ${sum('x = 6')}
         ${ans('6')}`,
        `<p><strong>Not every number divides evenly?</strong> Decimals are fine: 2x + 3 = 13 becomes x + 1.5 = 6.5, so x = 5.</p>`
      )}
      ${tip('Every term must be divided, including the number on the other side.')}`,

    // =====================================================================
    // 7C Equations with fractions
    // =====================================================================
    // Y8 7C Q1, Q2, Q3: a letter over a number
    'y8-7c-simple': `
      <p class="hp-tag">Worked example: solve <b>a/5 = 7</b>, <b>3m/7 = 6</b> and <b>−2k/3 = 10</b></p>
      ${steps(
        `<p><strong>Multiply both sides by the bottom number.</strong></p>
         ${sum('a/5 = 7 → a = 7 × 5 = 35')}`,
        `<p><strong>Then divide by the number in front of the letter.</strong></p>
         ${sum('3m/7 = 6 → 3m = 42 → m = 14')}`,
        `<p><strong>A negative in front works the same way.</strong></p>
         ${sum('−2k/3 = 10 → −2k = 30 → k = −15')}
         ${ans('35, 14, -15')}`
      )}
      ${tip('Clear the fraction first by multiplying by the bottom number. Then it is an ordinary equation.')}`,

    // Y8 7C Q4, Q5, Q10, Q13: two steps with a fraction
    'y8-7c-twostep': `
      <p class="hp-tag">Worked example: solve (a) <b>(2x + 1)/3 = 11</b> and (b) <b>x/5 + 2 = 6</b></p>
      ${steps(
        `<p><strong>(a) The line is under the whole top.</strong> So multiply by 3 first.</p>
         ${sum('2x + 1 = 33 → 2x = 32 → x = 16')}`,
        `<p><strong>(b) Only x is over 5.</strong> So take away the 2 first, then multiply.</p>
         ${sum('x/5 = 4 → x = 20')}`,
        `<p><strong>Check both.</strong></p>
         ${sum('(32 + 1)/3 = 33/3 = 11 ✓<br>20/5 + 2 = 4 + 2 = 6 ✓')}
         ${ans('16, 20')}`
      )}
      ${tip('Look at what the fraction line covers before you start. If an answer does not come out whole, type it as a fraction, like 7/3.')}`,

    // Y8 7C Q6: fractions with negatives
    'y8-7c-negative': `
      <p class="hp-tag">Worked example: solve <b>(x − 4)/3 = −2</b>, <b>(2x + 4)/(−3) = 6</b> and <b>3 = (1 − 5s)/2</b></p>
      ${steps(
        `<p><strong>Multiply by the bottom, keeping signs.</strong></p>
         ${sum('x − 4 = −6 → x = −2')}`,
        `<p><strong>A negative bottom number: multiply by it, negative and all.</strong></p>
         ${sum('2x + 4 = 6 × (−3) = −18<br>2x = −22 → x = −11')}`,
        `<p><strong>Letter subtracted on top.</strong></p>
         ${sum('6 = 1 − 5s → 5 = −5s → s = −1')}
         ${ans('-2, -11, -1')}`
      )}
      ${tip('Check a negative answer with brackets: (−2 − 4)/3 = −6/3 = −2 ✓.')}`,

    // Y8 7C Q7, Q8, Q9: fraction equations from words
    'y8-7c-words': `
      <p class="hp-tag">Worked example: (a) <b>5 is added to n, then the result is divided by 3, giving 8.</b> (b) <b>The average of x and 6 is −3.</b> (c) <b>A $90 bill: Jo pays one-fifth of the money in her wallet, leaving $74 for the others.</b></p>
      ${steps(
        `<p><strong>(a) "Then divided" puts the whole sum on top.</strong></p>
         ${sum('(n + 5)/3 = 8 → n + 5 = 24 → n = 19')}`,
        `<p><strong>(b) Average: add the two, divide by 2.</strong></p>
         ${sum('(x + 6)/2 = −3 → x + 6 = −6 → x = −12')}`,
        `<p><strong>(c) Use w for the money in the wallet.</strong> Jo pays w/5.</p>
         ${sum('90 − w/5 = 74 → w/5 = 16 → w = 80')}
         ${ans('19, -12, 80')}`
      )}
      ${tip('If asked to write the equation, type all of it with a slash for the fraction, like 90-w/5=74.')}`,

    // Y8 7C Q11: dividing first
    'y8-7c-dividefirst': `
      <p class="hp-tag">Worked example: solve <b>6(x/5) = 18</b> by dividing first, then <b>48q/7 = 96</b></p>
      ${steps(
        `<p><strong>Divide both sides by 6.</strong></p>
         ${sum('x/5 = 3 → x = 15')}`,
        `<p><strong>Same answer the long way:</strong> 6x/5 = 18 → 6x = 90 → x = 15 ✓</p>`,
        `<p><strong>Big numbers? Divide by the big number first.</strong> 96 ÷ 48 = 2.</p>
         ${sum('q/7 = 2 → q = 14')}
         ${ans('15, 14')}`
      )}
      ${tip('Dividing first keeps the numbers small. Look for a number that goes exactly into both sides.')}`,

    // Y8 7C Q12: the letter on the bottom
    'y8-7c-bottom': `
      <p class="hp-tag">Worked example: solve <b>45/x = 9</b>, <b>35/x − 2 = 3</b> and <b>−40/x = 8</b></p>
      ${steps(
        `<p><strong>Multiply both sides by x</strong> to bring it up from the bottom.</p>
         ${sum('45 = 9x → x = 5')}`,
        `<p><strong>Get the fraction on its own first.</strong></p>
         ${sum('35/x = 5 → 35 = 5x → x = 7')}`,
        `<p><strong>Signs work as usual.</strong></p>
         ${sum('−40 = 8x → x = −5')}
         ${ans('5, 7, -5')}`
      )}
      ${tip('Check by putting the answer back: 45 ÷ 5 = 9 ✓.')}`,

    // Y8 7C Q14: adding fractions first
    'y8-7c-combine': `
      <p class="hp-tag">Worked example: solve <b>x/2 + x/5 = 21</b> and <b>x/3 − x/5 = 6</b></p>
      ${steps(
        `<p><strong>Use a common denominator.</strong> For 2 and 5 it is 10.</p>
         ${sum('5x/10 + 2x/10 = 7x/10')}`,
        `<p><strong>Solve as before.</strong></p>
         ${sum('7x/10 = 21 → 7x = 210 → x = 30')}`,
        `<p><strong>Subtracting: same idea, denominator 15.</strong></p>
         ${sum('5x/15 − 3x/15 = 2x/15 = 6 → 2x = 90 → x = 45')}
         ${ans('30, 45')}`
      )}
      ${tip('Combine the fractions into one, then clear the denominator and solve.')}`,

    // =====================================================================
    // 7D Equations with the pronumeral on both sides
    // =====================================================================
    // Y8 7D Q1, Q2, Q3, Q4, Q10: letters on both sides
    'y8-7d-collect': `
      <p class="hp-tag">Worked example: solve <b>7x + 3 = 4x + 24</b> and <b>9 − 2x = 3x + 24</b></p>
      ${steps(
        `<p><strong>Take the smaller letter term from both sides.</strong> Here that is 4x.</p>
         ${sum('7x − 4x + 3 = 24<br>3x + 3 = 24')}`,
        `<p><strong>Now it is a two-step equation.</strong></p>
         ${sum('3x = 21 → x = 7')}
         <p>Check: 7 × 7 + 3 = 52 and 4 × 7 + 24 = 52 ✓</p>`,
        `<p><strong>A negative letter term: add it to both sides.</strong></p>
         ${sum('9 − 2x + 2x = 3x + 2x + 24<br>9 = 5x + 24 → −15 = 5x → x = −3')}
         ${ans('7, -3')}`
      )}
      ${tip('Moving the smaller letter term keeps the letter positive. Moving the other one also works, as long as you do it to both sides.')}`,

    // Y8 7D Q5: improper fraction answers
    'y8-7d-fraction': `
      <p class="hp-tag">Worked example: solve <b>5x + 1 = 2x + 8</b> and <b>4 − x = 9 + 3x</b></p>
      ${steps(
        `<p><strong>Letters to one side, numbers to the other.</strong></p>
         ${sum('3x + 1 = 8 → 3x = 7 → x = 7/3')}`,
        `<p><strong>Add x to both sides.</strong></p>
         ${sum('4 = 9 + 4x → −5 = 4x → x = −5/4')}
         ${ans('7/3, -5/4')}`
      )}
      ${tip('Leave it as an improper fraction like 7/3, not a mixed numeral or a rounded decimal.')}`,

    // Y8 7D Q6, Q9: equations from words
    'y8-7d-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">(a) Doubling n and adding 19 gives the same result as multiplying n by 6 and subtracting 9. (b) Ana buys 6 pens and a <span class="hp-hl">$1.80</span> ruler. Ben buys 2 pens and a <span class="hp-hl">$7.40</span> folder. They pay the same.</p>
      ${steps(
        `<p><strong>"The same as" is the = sign.</strong></p>
         ${sum('(a) 2n + 19 = 6n − 9 → 28 = 4n → n = 7')}`,
        `<p><strong>(b) Each total is pens plus the extra item.</strong> Let p be the cost of one pen.</p>
         ${sum('6p + 1.8 = 2p + 7.4<br>4p = 5.6 → p = 1.40')}`,
        `<p><strong>How many pens for $10?</strong> 10 ÷ 1.40 = 7.14..., so 7 pens. Round down: you cannot buy part of a pen.</p>
         ${ans('7, 6p+1.8=2p+7.4, 1.40, 7')}`
      )}
      ${tip('Type the whole equation in full, like 6p+1.8=2p+7.4. Type a price with two decimal places.')}`,

    // Y8 7D Q7, Q8, Q11, Q13: shapes with equal sides or angles
    'y8-7d-shapes': `
      <p class="hp-tag">Worked example: this shape is a rectangle. Find x and y, then the area and perimeter.</p>
      ${rect('3x + 2', 'x + 16', '2y + 1', 'y + 9')}
      ${steps(
        `<p><strong>Opposite sides are equal.</strong> Top = bottom.</p>
         ${sum('3x + 2 = x + 16 → 2x = 14 → x = 7')}
         <p>So the top is 3 × 7 + 2 = 23.</p>`,
        `<p><strong>Left = right.</strong></p>
         ${sum('2y + 1 = y + 9 → y = 8')}
         <p>So the side is 2 × 8 + 1 = 17.</p>
         ${ans('7, 8')}`,
        `<p><strong>Use the real lengths.</strong> Area 23 × 17 = 391. Perimeter 23 + 23 + 17 + 17 = 80.</p>`
      )}
      <p><strong>Angles?</strong> Vertically opposite angles are equal, so (5a − 10)° = (2a + 35)° gives 3a = 45 and a = 15. Each angle of an equilateral triangle is 60°.</p>
      ${tip('Type x then y, separated by a comma. Check by putting x into both sides: they must give the same length.')}`,

    // Y8 7D Q12: no solutions
    'y8-7d-none': `
      <p class="hp-tag">Worked example: try to solve <b>3x + 4 = 3x + 9</b></p>
      ${steps(
        `<p><strong>Take 3x from both sides.</strong></p>
         ${sum('4 = 9')}`,
        `<p><strong>That is never true</strong>, whatever x is. The letters have vanished and left something false.</p>
         ${ans('No solutions')}`
      )}
      <p>Compare 3x + 4 = 2x + 9: taking 2x from both sides leaves x + 4 = 9, so x = 5. One solution.</p>
      ${tip('The giveaway: the same letter term on both sides, with different numbers added.')}`,

    // =====================================================================
    // 7E Equations with brackets
    // =====================================================================
    // Y8 7E Q1, Q2, Q11: expand, or divide first
    'y8-7e-expand': `
      <p class="hp-tag">Worked example: solve <b>3(2x + 5) = 57</b> two ways.</p>
      ${steps(
        `<p><strong>Expand the bracket.</strong> Multiply 3 by each term inside.</p>
         ${sum('6x + 15 = 57')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('6x = 42 → x = 7')}`,
        `<p><strong>Or divide both sides by 3 first.</strong></p>
         ${sum('2x + 5 = 19 → 2x = 14 → x = 7')}
         ${ans('7')}`
      )}
      ${tip('Expanding always works. Dividing first is quicker, but only when the bracket is the whole side and the number outside goes evenly into the other side.')}`,

    // Y8 7E Q3: a negative outside the bracket
    'y8-7e-negative': `
      <p class="hp-tag">Worked example: solve <b>−2(3x − 4) = 50</b></p>
      ${steps(
        `<p><strong>Multiply −2 by each term inside.</strong></p>
         ${sum('−2 × 3x = −6x &nbsp; −2 × (−4) = +8<br>−6x + 8 = 50')}`,
        `<p><strong>Solve.</strong> Divide by −6 at the end.</p>
         ${sum('−6x = 42 → x = −7')}`,
        `<p><strong>Check.</strong></p>
         ${sum('−2(3 × (−7) − 4) = −2 × (−25) = 50 ✓')}
         ${ans('-7')}`
      )}
      ${tip('A negative times a negative is positive, so −2 × (−4) is +8.')}`,

    // Y8 7E Q4: expand, then collect like terms
    'y8-7e-collect': `
      <p class="hp-tag">Worked example: solve <b>2(3x + 5) + 4x = 60</b></p>
      ${steps(
        `<p><strong>Expand.</strong></p>
         ${sum('6x + 10 + 4x = 60')}`,
        `<p><strong>Collect like terms.</strong> 6x + 4x = 10x.</p>
         ${sum('10x + 10 = 60')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('10x = 50 → x = 5')}
         ${ans('5')}`
      )}
      ${tip('Collect like terms before you start undoing. Letters go with letters, numbers with numbers.')}`,

    // Y8 7E Q5, Q6, Q15: brackets on both sides
    'y8-7e-both': `
      <p class="hp-tag">Worked example: solve <b>3(2x + 4) = 2(x + 16)</b></p>
      ${steps(
        `<p><strong>Expand both sides.</strong></p>
         ${sum('6x + 12 = 2x + 32')}`,
        `<p><strong>Letters to one side, numbers to the other.</strong></p>
         ${sum('4x + 12 = 32 → 4x = 20 → x = 5')}`,
        `<p><strong>Check.</strong> 3 × (10 + 4) = 42 and 2 × (5 + 16) = 42 ✓</p>
         ${ans('5')}`
      )}
      <p><strong>Minus in front of a bracket?</strong> It changes every sign inside: −3(x − 2) = −3x + 6.</p>
      ${tip('Expand everything first, then solve like 7D. Some answers are fractions: type them like -3/4.')}`,

    // Y8 7E Q7, Q8, Q9, Q12, Q13: bracket equations from words
    'y8-7e-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Double Sam's age <span class="hp-hl">5 years ago</span> is the same as his age <span class="hp-hl">3 years from now</span>. Let s be his age now.</p>
      ${steps(
        `<p><strong>Build each side.</strong> 5 years ago he was s − 5, and doubling it needs brackets. In 3 years he will be s + 3.</p>
         ${sum('2(s − 5) = s + 3')}`,
        `<p><strong>Expand and solve.</strong></p>
         ${sum('2s − 10 = s + 3 → s = 13')}`,
        `<p><strong>Does it make sense?</strong> 2 × 8 = 16 and 13 + 3 = 16 ✓. An answer like −4 years, or half a person, means the statement cannot be true.</p>
         ${ans('2(s-5)=s+3, 13')}`
      )}
      <p><strong>Two pay rates?</strong> 4 hours at $w, then 3 hours at $(w + 6), earns 4w + 3(w + 6).</p>
      ${tip('Put brackets round anything that is "then doubled" or "then tripled". Type the equation in full, like 2(s-5)=s+3.')}`,

    // Y8 7E Q10: rectangles with equal areas
    'y8-7e-rect': `
      <p class="hp-tag">Worked example: rectangles A and B have the same area. Find x.</p>
      ${fig({ kind: 'diagram', unit: 30, alt: 'Rectangle A is 6 high and x + 1 wide. Rectangle B is 4 high and x + 5 wide.', items: [
        { poly: [[0, 0], [3, 0], [3, 3], [0, 3]] }, { label: 'A', at: [1.5, 1.5] }, { label: 'x + 1', at: [1.5, 3.45] }, { label: '6', at: [-0.5, 1.5] },
        { poly: [[5, 0], [9, 0], [9, 2], [5, 2]] }, { label: 'B', at: [7, 1] }, { label: 'x + 5', at: [7, 2.45] }, { label: '4', at: [4.5, 1] }] })}
      ${steps(
        `<p><strong>Write each area as side × side.</strong></p>
         ${sum('Area A = 6(x + 1) &nbsp; Area B = 4(x + 5)')}`,
        `<p><strong>Set them equal and solve.</strong></p>
         ${sum('6(x + 1) = 4(x + 5)<br>6x + 6 = 4x + 20 → 2x = 14 → x = 7')}
         ${ans('7')}`,
        `<p><strong>Check and use it.</strong> A is 6 × 8 = 48 and B is 4 × 12 = 48 ✓. Put x = 7 into every side before finding a perimeter.</p>`
      )}
      ${tip('A diagram that is not drawn to scale can look wrong. Trust the algebra.')}`,

    // Y8 7E Q14: the "forgot to expand" mistake
    'y8-7e-mistake': `
      <p class="hp-tag">Worked example: how many solutions does <b>2(n + 5) = 2n + 5</b> have?</p>
      ${steps(
        `<p><strong>Expand properly.</strong> The 2 multiplies the 5 too.</p>
         ${sum('2n + 10 = 2n + 5')}`,
        `<p><strong>Take 2n from both sides.</strong> 10 = 5 is never true.</p>
         ${ans('No solutions')}`,
        `<p><strong>When are two expressions equal?</strong> For 4(x + 2) and 2x + 8: 4x + 8 = 2x + 8, so 2x = 0 and x = 0.</p>`
      )}
      ${tip('2(n + 5) is not 2n + 5. Multiply the number outside by every term inside.')}`,

    // =====================================================================
    // 7F Solving simple quadratic equations
    // =====================================================================
    // Y8 7F Q1, Q4, Q9, Q10: x² = a number
    'y8-7f-square': `
      <p class="hp-tag">Worked example: solve <b>x² = 121</b></p>
      ${steps(
        `<p><strong>Which numbers square to 121?</strong></p>
         ${sum('11 × 11 = 121 &nbsp; (−11) × (−11) = 121')}`,
        `<p><strong>Both count.</strong></p>
         ${ans('11, -11')}`,
        `<p><strong>How many solutions?</strong> It depends on the number on the right.</p>
         ${chips(['positive: 2 solutions', 'add'], ['zero: 1 solution (just 0)'], ['negative: no solutions', 'take'])}`
      )}
      <p><strong>A condition?</strong> If x² = 121 and x &lt; 0, keep only −11. <strong>Not a perfect square?</strong> x² = 21 has exact solutions x = ±√21.</p>
      ${tip('Type both solutions separated by a comma, like 11, -11. No number squared is negative, which is why a negative right side has no solutions.')}`,

    // Y8 7F Q2: rounding the square roots
    'y8-7f-round': `
      <p class="hp-tag">Worked example: solve <b>x² = 11</b>, correct to two decimal places.</p>
      ${steps(
        `<p><strong>Take the square root, both signs.</strong></p>
         ${sum('x = √11 or x = −√11')}`,
        `<p><strong>Use a calculator, then round.</strong> √11 = 3.3166... The third decimal is 6, so round up.</p>
         ${sum('√11 ≈ 3.32')}
         ${ans('3.32, -3.32')}`
      )}
      ${tip('Round only at the end. Type both answers with two decimal places, separated by a comma.')}`,

    // Y8 7F Q3, Q7, Q12: get x² on its own first
    'y8-7f-coeff': `
      <p class="hp-tag">Worked example: solve <b>−3x² = −768</b> and <b>2x² − 3 = 719</b></p>
      ${steps(
        `<p><strong>Divide by the number in front of x².</strong></p>
         ${sum('x² = −768 ÷ (−3) = 256 → x = ±16')}`,
        `<p><strong>More than one step: undo + and − first, then ×.</strong></p>
         ${sum('2x² = 722 → x² = 361 → x = ±19')}
         ${ans('16, -16 and 19, -19')}`,
        `<p><strong>x² taken away?</strong> 121 − x² = 0 means x² = 121, so x = ±11. If you end with x² = 0, there is only one answer, so type just 0.</p>`
      )}
      ${tip('Get x² alone, then take the square root. Do not forget the negative solution.')}`,

    // Y8 7F Q5, Q6: squares with a known area
    'y8-7f-area': `
      <p class="hp-tag">Worked example: a square tile has area <b>0.36 m²</b>. Find its perimeter.</p>
      ${steps(
        `<p><strong>Side² = area.</strong> 0.6 × 0.6 = 0.36, so the side is 0.6 m.</p>
         <p>−0.6 also squares to 0.36, but a length cannot be negative.</p>`,
        `<p><strong>Perimeter = 4 sides.</strong></p>
         ${sum('4 × 0.6 = 2.4')}
         ${ans('2.4')}`
      )}
      <p>A square of area 121 cm² has side 11 cm and perimeter 44 cm.</p>
      ${tip('For lengths, use only the positive square root.')}`,

    // Y8 7F Q11: testing a² + b² = c²
    'y8-7f-triad': `
      <p class="hp-tag">Worked example: does each triad satisfy <b>a² + b² = c²</b>? (a) <b>(11, 60, 61)</b> (b) <b>(11, 30, 32)</b> (c) <b>(−11, 60, −61)</b></p>
      ${steps(
        `<p><strong>Square, add the first two, compare with the third.</strong></p>
         ${sum('(a) 121 + 3600 = 3721 and 61² = 3721 ✓')}`,
        `${sum('(b) 121 + 900 = 1021 but 32² = 1024 ✗')}`,
        `<p><strong>(c) Negatives square to the same positives as in (a).</strong></p>
         ${ans('Yes, No, Yes')}`
      )}
      ${tip('A negative squared is positive, so the signs never matter here. For cubes, try the same idea with small numbers: cube, add, compare.')}`,

    // =====================================================================
    // 7G Formulas and relationships
    // =====================================================================
    // Y8 7G Q1 to Q9: substituting into a formula
    'y8-7g-formula': `
      <p class="hp-tag">Worked example: the rule is <b>T = 4n + 7</b>. (a) Find T when n = 9. (b) Find n when T = 63. (c) For <b>d = st</b>, find s when d = 26 and t = 4.</p>
      ${steps(
        `<p><strong>Subject unknown: substitute and work it out.</strong></p>
         ${sum('(a) T = 4 × 9 + 7 = 43')}`,
        `<p><strong>Another letter unknown: substitute, then solve the equation.</strong></p>
         ${sum('(b) 63 = 4n + 7 → 56 = 4n → n = 14')}`,
        `<p><strong>Fractions are fine.</strong></p>
         ${sum('(c) 26 = 4s → s = 26/4 = 13/2')}
         ${ans('43, 14, 13/2')}`
      )}
      <p><strong>Two letters?</strong> In 3x + 4y = 36 with x = 8: 24 + 4y = 36, so y = 3.</p>
      ${tip('If asked for the equation itself, type all of it, like 63=4n+7. For "one decimal place", round only at the end.')}`,

    // Y8 7G Q10: the trapezium formula
    'y8-7g-trapezium': `
      <p class="hp-tag">Worked example: use <b>A = ½(a + b)h</b>. (a) Find the area. (b) Another trapezium has A = 50, a = 6 and h = 5. Find b.</p>
      ${fig({ kind: 'diagram', unit: 30, alt: 'A trapezium with parallel sides 8 and 12 and height 7', items: [
        { poly: [[0, 0], [6, 0], [4.5, 3], [1.5, 3]] }, { seg: [1.5, 0, 1.5, 3], dash: true },
        { label: '8', at: [3, 3.45] }, { label: '12', at: [3, -0.5] }, { label: '7', at: [1.85, 1.5] }] })}
      ${steps(
        `<p><strong>(a) Add the parallel sides, halve, times the height.</strong></p>
         ${sum('½ × (8 + 12) × 7 = ½ × 20 × 7 = 70')}`,
        `<p><strong>(b) Substitute what you know.</strong></p>
         ${sum('50 = ½(6 + b) × 5')}`,
        `<p><strong>Undo in reverse order.</strong> ÷ 5, then × 2, then − 6.</p>
         ${sum('10 = ½(6 + b) → 20 = 6 + b → b = 14')}
         ${ans('70, 14')}`
      )}
      ${tip('The height is the straight-across distance between the parallel sides, not the slanted side.')}`,

    // Y8 7G Q11, Q13: which rule fits the table?
    'y8-7g-rule': `
      <p class="hp-tag">Worked example: which rule fits both rows of the table? <b>y = x</b>, <b>y = x/2 + 3</b> or <b>y = 2x − 6</b></p>
      ${fig({ kind: 'table', rows: [['x', '6', '10'], ['y', '6', '8']] })}
      ${steps(
        `<p><strong>Test each rule on the first column.</strong> All three give 6 when x = 6.</p>`,
        `<p><strong>Now the second column, x = 10.</strong></p>
         ${sum('y = x: 10 ✗<br>y = x/2 + 3: 5 + 3 = 8 ✓<br>y = 2x − 6: 14 ✗')}
         ${ans('y = x/2 + 3')}`,
        `<p><strong>Use the rule that fits.</strong> When x = 30: 15 + 3 = 18.</p>`
      )}
      ${tip('A rule must work for every column. One column that fails rules it out. With three letters, substitute all of them each time.')}`,

    // Y8 7G Q12, Q14: largest values and equal letters
    'y8-7g-equal': `
      <p class="hp-tag">Worked example: the rule is <b>H = 80 − 3p</b>. (a) If p is between 2 and 6, what is the largest H? (b) If p and H are equal, what value do they have?</p>
      ${steps(
        `<p><strong>(a) H goes down as p goes up</strong>, because of the − 3p. So the largest H comes from the smallest p.</p>
         ${sum('80 − 3 × 2 = 74')}`,
        `<p><strong>(b) Equal means replace H with p.</strong></p>
         ${sum('p = 80 − 3p → 4p = 80 → p = 20')}`,
        `<p><strong>Check.</strong> 80 − 60 = 20 ✓</p>
         ${ans('74, 20')}`
      )}
      ${tip('When told two letters are both "x" (or one is a multiple of x), swap each letter for that expression and solve the equation.')}`,

    // Y8 7G Q15: comparing two cost formulas
    'y8-7g-plans': `
      <p class="hp-tag">Worked example: a phone plan costs <b>C = 30t + 6c + 100</b> cents, for t minutes and c calls. (a) Find the cost in dollars of 10 calls lasting 25 minutes. (b) A bill of $11.20 had 15 calls. How many minutes?</p>
      ${steps(
        `<p><strong>(a) Substitute both letters.</strong></p>
         ${sum('30 × 25 + 6 × 10 + 100 = 750 + 60 + 100 = 910 cents')}
         <p>910 cents is $9.10.</p>`,
        `<p><strong>(b) Change dollars to cents first:</strong> $11.20 is 1120 cents.</p>
         ${sum('1120 = 30t + 90 + 100<br>930 = 30t → t = 31')}`,
        `<p><strong>Two plans costing the same?</strong> Set the two formulas equal, put in the letter you know, and solve for the other.</p>
         ${ans('9.10, 31')}`
      )}
      ${tip('Cents ÷ 100 = dollars. Type money with two decimal places, like 9.10. An average call length is total minutes ÷ number of calls.')}`,

    // =====================================================================
    // 7H Applications of equations
    // =====================================================================
    // Y8 7H Q1, Q2, Q3, Q5: costs and charges
    'y8-7h-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A plumber charges a <span class="hp-hl">$70</span> call-out fee plus <span class="hp-hl">$40</span> per hour. One job cost $210. Let h be the length of the job in hours.</p>
      ${steps(
        `<p><strong>Write the equation.</strong> The fee is paid once; the rate is paid for every hour.</p>
         ${sum('70 + 40h = 210')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('40h = 140 → h = 140/40 = 7/2')}`,
        `<p><strong>Answer the question asked.</strong> 7/2 hours is 3 hours 30 minutes, which is 210 minutes.</p>
         ${ans('70+40h=210, 7/2, 210')}`
      )}
      <p><strong>Simpler:</strong> 4 pies cost $22, so 4p = 22 and p = 5.5. One pie costs $5.50.</p>
      ${tip('Type the whole equation, like 4p=22. When the question asks for a cost, type dollars and cents: 5.50.')}`,

    // Y8 7H Q4, Q7, Q9, Q11: perimeters and angles
    'y8-7h-shape': `
      <p class="hp-tag">Worked example: (a) A rectangle is 15 cm long with perimeter 52 cm. Find its width. (b) A pool is 3 m wider than it is long. Its perimeter is 46 m. Find its length and area.</p>
      ${steps(
        `<p><strong>(a) Perimeter adds all four sides.</strong></p>
         ${sum('2w + 30 = 52 → 2w = 22 → w = 11')}`,
        `<p><strong>(b) Let l be the length. The width is l + 3.</strong></p>
         ${sum('2l + 2(l + 3) = 46<br>4l + 6 = 46 → 4l = 40 → l = 10')}
         <p>The width is 13, so the area is 10 × 13 = 130 m².</p>
         ${ans('11, 10, 130')}`,
        `<p><strong>Angles in a quadrilateral add to 360°.</strong> Angles x, 2x, 3x and 90°: 6x + 90 = 360, so 6x = 270 and x = 45.</p>`
      )}
      ${tip('A square with perimeter 26 has side 26/4 = 13/2. Type fractions like 13/2.')}`,

    // Y8 7H Q6, Q8, Q10, Q15: number puzzles
    'y8-7h-number': `
      <p class="hp-tag">Worked example: (a) <b>A number times 4, plus 10, equals the number times 6.</b> (b) <b>Two sisters' ages add to 41. One is 5 years older.</b> (c) <b>Three consecutive whole numbers add to 171.</b></p>
      ${steps(
        `${sum('(a) 4n + 10 = 6n → 10 = 2n → n = 5')}`,
        `<p><strong>(b) Let the younger be x.</strong> The older is x + 5.</p>
         ${sum('x + x + 5 = 41 → 2x = 36 → x = 18')}`,
        `<p><strong>(c) Call the smallest n.</strong> The numbers are n, n + 1, n + 2.</p>
         ${sum('3n + 3 = 171 → 3n = 168 → n = 56')}
         ${ans('5, 18, 56')}`
      )}
      <p><strong>Averages:</strong> the average of a number and 5 times it is (n + 5n)/2 = 3n. If 3 numbers average 7, their total is 21.</p>
      ${tip('The average of consecutive numbers is the middle one: here 57. Fraction answers are fine, like 2/3.')}`,

    // Y8 7H Q12: averages and a formula
    'y8-7h-average': `
      <p class="hp-tag">Worked example: the average of x and 9 is (a) 20, (b) −4, (c) R. Find x.</p>
      ${steps(
        `<p><strong>(a) Add, divide by 2, set equal.</strong></p>
         ${sum('(x + 9)/2 = 20 → x + 9 = 40 → x = 31')}`,
        `${sum('(b) x + 9 = −8 → x = −17')}`,
        `<p><strong>(c) Same steps with a letter.</strong></p>
         ${sum('x + 9 = 2R → x = 2R − 9')}
         ${ans('31, -17, x=2R-9')}`
      )}
      ${tip('For a formula, start with x =, like x=2R-9.')}`,

    // Y8 7H Q14: sensible answers
    'y8-7h-sensible': `
      <p class="hp-tag">Worked example: equations P: <b>3x = 12</b>, Q: <b>7 + x = 3</b>, R: <b>2x = 9</b>. Which could give (a) a number of people? (b) the length of a pencil?</p>
      ${steps(
        `<p><strong>Solve each one.</strong></p>
         ${sum('P: x = 4 &nbsp; Q: x = −4 &nbsp; R: x = 4.5')}`,
        `<p><strong>(a) People: whole and not negative.</strong> Only P.</p>`,
        `<p><strong>(b) Length: positive, decimals allowed.</strong> P and R.</p>
         ${ans('P, then P and R')}`
      )}
      ${tip('Ask two questions: can the amount be negative? Can it be a fraction?')}`,

    // =====================================================================
    // 7I Inequalities
    // =====================================================================
    // Y8 7I Q1, Q2, Q8: reading a number line
    'y8-7i-read': `
      <p class="hp-tag">Worked example: write each inequality using x.</p>
      ${nl(-3, 5, null, false, 2, true, 'Filled circle at 2, arrow to the left')}
      ${nl(-3, 5, -1, false, null, false, 'Open circle at −1, arrow to the right')}
      ${steps(
        `<p><strong>Read the circle.</strong> Filled means the number is included (≤ or ≥). Open means it is not (&lt; or &gt;).</p>`,
        `<p><strong>Read the arrow.</strong> Left means smaller (less than). Right means bigger (greater than).</p>
         ${ans('x&lt;=2, x&gt;-1')}`,
        `<p><strong>Number first?</strong> Swap the sides and turn the symbol round: 7 &gt; x is the same as x &lt; 7.</p>`
      )}
      ${tip('Type ≤ as &lt;= and ≥ as &gt;=, like x&lt;=2. The pointy end of the symbol points at the smaller side.')}`,

    // Y8 7I Q3, Q4: between two numbers
    'y8-7i-between': `
      <p class="hp-tag">Worked example: <b>−1 ≤ x &lt; 4</b>. Which of 5, −1, 0.5, 4, 3.9, −2 make it true?</p>
      ${nl(-3, 6, -1, true, 4, false, 'Filled circle at −1, open circle at 4, joined')}
      ${steps(
        `<p><strong>Read it as "x is between −1 and 4".</strong> ≤ by −1: filled circle. &lt; by 4: open circle.</p>`,
        `<p><strong>Test each number.</strong> −1 is allowed (equal). 4 is not. Decimals in between count.</p>
         ${chips(['5 ✗', 'take'], ['−1 ✓', 'add'], ['0.5 ✓', 'add'], ['4 ✗', 'take'], ['3.9 ✓', 'add'], ['−2 ✗', 'take'])}
         ${ans('-1, 0.5, 3.9')}`
      )}
      ${tip('Type the numbers that work in the order given, separated by commas.')}`,

    // Y8 7I Q5, Q6: inequalities from words
    'y8-7i-words': `
      ${chips(['more than: &gt;'], ['less than, under: &lt;'], ['at least: ≥'], ['at most: ≤'], ['between ... inclusive: ≤ x ≤'])}
      <p class="hp-tag">Worked example: (a) <b>Mia is at least 12 but younger than 15.</b> (b) <b>Ali's age is 10 to 16 inclusive and Bo's is 13 to 20 inclusive. They are the same age, x.</b></p>
      ${steps(
        `<p><strong>(a) "At least 12" includes 12. "Younger than 15" does not include 15.</strong></p>
         ${sum('12 ≤ x &lt; 15')}`,
        `<p><strong>(b) Both must be true, so keep the overlap.</strong> The bigger bottom number and the smaller top number.</p>
         ${sum('10 to 16 and 13 to 20 → 13 ≤ x ≤ 16')}
         ${ans('12 ≤ x &lt; 15, 13 ≤ x ≤ 16')}`
      )}
      ${tip('"Inclusive" means the end numbers count, so use ≤.')}`,

    // Y8 7I Q7: a table of ranges
    'y8-7i-table': `
      <p class="hp-tag">Worked example: race medals use these times (seconds).</p>
      ${fig({ kind: 'table', rows: [['Medal', 'Time t'], ['Gold', 't < 50'], ['Silver', '50 ≤ t < 60'], ['Bronze', '60 ≤ t < 75'], ['None', 't ≥ 75']] })}
      ${steps(
        `<p><strong>Boundary values go where the ≤ is.</strong> A time of 60 is Bronze, not Silver.</p>`,
        `<p><strong>Ruby got Silver. With 4 seconds less she would get Gold.</strong> So t − 4 &lt; 50, which means t &lt; 54. Silver also needs t ≥ 50.</p>
         ${sum('50 ≤ t &lt; 54')}`,
        `<p><strong>Halving a range:</strong> half of a Bronze time (60 to 75) is 30 to 37.5, which is Gold.</p>
         ${ans('Bronze, 50 ≤ t &lt; 54, Gold')}`
      )}
      ${tip('Work out the smallest and largest values first, then see which rows they land in.')}`,

    // Y8 7I Q9, Q10: combining two inequalities
    'y8-7i-combine': `
      <p class="hp-tag">Worked example: both must be true. (a) <b>x &gt; 5 and x ≥ 2</b> (b) <b>1 &lt; x &lt; 7 and 5 ≤ x &lt; 10</b> (c) how many solutions do <b>x &gt; 7 and x &lt; 2</b> have?</p>
      ${steps(
        `<p><strong>(a) Every number above 5 is also at least 2.</strong> The tighter one wins.</p>
         ${sum('x &gt; 5')}`,
        `<p><strong>(b) Keep only the overlap.</strong> From 5 (included) up to 7 (not included).</p>
         ${nl(0, 10, 5, true, 7, false, 'Filled circle at 5, open circle at 7, joined')}
         ${sum('5 ≤ x &lt; 7')}`,
        `<p><strong>(c) No number is both above 7 and below 2.</strong> 0 solutions. A stretch like 3 ≤ x &lt; 4 has infinitely many, because decimals count.</p>
         ${ans('x&gt;5, 5 ≤ x &lt; 7, 0')}`
      )}
      ${tip('Sketch both on one number line and keep the part covered twice.')}`,

    // Y8 7I Q11, Q12: largest values and "must be true"
    'y8-7i-limits': `
      <p class="hp-tag">Worked example: <b>0 ≤ p ≤ 4</b> and <b>0 ≤ q ≤ 4</b>. (a) Largest value of p + 2q? (b) Largest value of p − q? (c) Must p − q ≥ 0 be true?</p>
      ${steps(
        `<p><strong>(a) Make both parts as big as possible.</strong></p>
         ${sum('4 + 2 × 4 = 12')}`,
        `<p><strong>(b) Big p, small q.</strong> You are taking q away, so make it 0.</p>
         ${sum('4 − 0 = 4')}`,
        `<p><strong>(c) Look for one example that fails.</strong> p = 0, q = 4 gives −4.</p>
         ${ans('12, 4, Not always true')}`
      )}
      ${tip('To make an expression big, make the parts you add big and the parts you subtract small.')}`,

    // =====================================================================
    // 7J Solving inequalities
    // =====================================================================
    // Y8 7J Q1, Q2: solving like an equation
    'y8-7j-solve': `
      <p class="hp-tag">Worked example: solve <b>4x − 7 &gt; 21</b> and <b>x + 9 ≤ 2</b></p>
      ${steps(
        `<p><strong>Add 7 to both sides.</strong></p>
         ${sum('4x &gt; 28')}`,
        `<p><strong>Divide by 4.</strong> Dividing by a positive number keeps the sign.</p>
         ${sum('x &gt; 7')}
         <p>Check with x = 8: 32 − 7 = 25, and 25 &gt; 21 ✓</p>`,
        `<p><strong>One step.</strong> Take 9 from both sides.</p>
         ${sum('x ≤ −7')}
         ${ans('x&gt;7, x&lt;=-7')}`
      )}
      ${tip('Solve exactly like an equation, keeping the inequality sign. Type it like x&gt;7 or x&lt;=-7, using the letter in the question.')}`,

    // Y8 7J Q3: inequalities with fractions
    'y8-7j-fraction': `
      <p class="hp-tag">Worked example: solve <b>(x + 4)/3 ≥ 6</b> and <b>(2x − 1)/5 &lt; 7</b></p>
      ${steps(
        `<p><strong>Multiply both sides by the bottom number.</strong></p>
         ${sum('x + 4 ≥ 18 → x ≥ 14')}`,
        `<p><strong>Same again, then two more steps.</strong></p>
         ${sum('2x − 1 &lt; 35 → 2x &lt; 36 → x &lt; 18')}
         ${ans('x&gt;=14, x&lt;18')}`
      )}
      ${tip('Multiplying by a positive number never flips the sign.')}`,

    // Y8 7J Q4, Q12: negative letter terms and flipping the sign
    'y8-7j-negative': `
      <p class="hp-tag">Worked example: solve <b>34 − 4x &gt; 6</b></p>
      ${steps(
        `<p><strong>Take 34 from both sides.</strong></p>
         ${sum('−4x &gt; −28')}`,
        `<p><strong>Divide by −4 and turn the sign round.</strong></p>
         ${sum('x &lt; 7')}
         <p>Why? 2 &lt; 3, but −2 &gt; −3. Multiplying or dividing by a negative swaps the order.</p>`,
        `<p><strong>Check both sides of 7.</strong> x = 6: 34 − 24 = 10 &gt; 6 ✓. x = 8: 34 − 32 = 2, not &gt; 6 ✗.</p>
         ${ans('x&lt;7')}`
      )}
      <p><strong>Avoid dividing by a negative:</strong> add 4x to both sides instead. 34 &gt; 6 + 4x → 28 &gt; 4x → 7 &gt; x, which is x &lt; 7.</p>
      ${tip('Flip the sign only when you multiply or divide by a negative. Adding or subtracting never flips it.')}`,

    // Y8 7J Q5: solve, then match a number line
    'y8-7j-match': `
      <p class="hp-tag">Worked example: solve <b>2(x − 1) ≥ 8</b>, then choose the number line.</p>
      ${steps(
        `<p><strong>Solve.</strong> Divide by 2, then add 1.</p>
         ${sum('x − 1 ≥ 4 → x ≥ 5')}`,
        `<p><strong>Draw it.</strong> ≥ means a filled circle at 5, arrow to the right.</p>
         ${nl(1, 9, 5, true, null, false, 'Filled circle at 5, arrow to the right')}`
      )}
      ${tip('Solve first, then match. Filled circle for ≤ or ≥, open circle for &lt; or &gt;. With x on the left, &gt; and ≥ point right.')}`,

    // Y8 7J Q6, Q7, Q8: inequalities from stories
    'y8-7j-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ben buys 5 pies and a <span class="hp-hl">$4</span> drink. His total is <span class="hp-hl">less than $39</span>. Let p be the cost of one pie.</p>
      ${steps(
        `<p><strong>Write the inequality.</strong> "Less than" is &lt;.</p>
         ${sum('5p + 4 &lt; 39')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('5p &lt; 35 → p &lt; 7')}`,
        `<p><strong>Answer the real question.</strong> If prices are multiples of 5 cents, the most a pie can cost is $6.95.</p>
         ${ans('5p + 4 &lt; 39, p&lt;7, 6.95')}`
      )}
      <p><strong>Whole numbers only?</strong> 4g + 3 ≤ 41 gives 4g ≤ 38, so g ≤ 9.5. The greatest whole number is 9.</p>
      ${tip('A decimal or fraction is fine in an inequality answer, like g&lt;=9.5. Use the letter the question uses.')}`,

    // Y8 7J Q9, Q10, Q11: positive, negative and several conditions
    'y8-7j-conditions': `
      <p class="hp-tag">Worked example: (a) For which x is <b>5x − 35</b> positive? (b) <b>3a + 9</b> is negative and <b>10 − 2a</b> is positive. What can a be?</p>
      ${steps(
        `<p><strong>Positive means &gt; 0.</strong></p>
         ${sum('5x − 35 &gt; 0 → 5x &gt; 35 → x &gt; 7')}`,
        `<p><strong>Negative means &lt; 0. Solve each condition.</strong></p>
         ${sum('3a + 9 &lt; 0 → a &lt; −3<br>10 − 2a &gt; 0 → 10 &gt; 2a → a &lt; 5')}`,
        `<p><strong>Both must hold.</strong> Anything below −3 is also below 5.</p>
         ${ans('x&gt;7, a&lt;-3')}`
      )}
      ${tip('With several clues, solve each one, then keep the values that pass all of them. A clue is not needed if the others already force it to be true.')}`,

    // Y8 7J Q13: letters on both sides
    'y8-7j-both': `
      <p class="hp-tag">Worked example: solve <b>7x − 5 ≤ 3x + 23</b> and <b>2(3x + 1) &gt; 4x + 12</b></p>
      ${steps(
        `<p><strong>Take the smaller letter term from both sides.</strong></p>
         ${sum('4x − 5 ≤ 23 → 4x ≤ 28 → x ≤ 7')}`,
        `<p><strong>Expand first, then the same.</strong></p>
         ${sum('6x + 2 &gt; 4x + 12 → 2x &gt; 10 → x &gt; 5')}
         ${ans('x&lt;=7, x&gt;5')}`
      )}
      ${tip('Moving the smaller letter term means you divide by a positive number, so the sign never needs flipping.')}`,
  });
})();
