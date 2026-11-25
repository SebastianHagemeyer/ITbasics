/* H3 "How do I work this out?" panels for Chapter 9.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 9A to 9H. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 9A Introduction to equations
    // =====================================================================
    // 9A Q1, Q2: is it an equation?
    '9a-what': `
      <p class="hp-tag">Worked example: which of these are equations?</p>
      ${chips(['6 + y = 13'], ['9 × 2'], ['10 = 3 + 3'])}
      ${steps(
        `<p><strong>Look for an equals sign.</strong> An equation says that two things are equal, so it must have an = sign with something on each side.</p>
         ${chips(['6 + y = 13 ✓', 'add'], ['9 × 2 ✗', 'take'], ['10 = 3 + 3 ✓', 'add'])}`,
        `<p><strong>Do not worry if it is false.</strong> 10 = 3 + 3 is not true, but it still claims two things are equal, so it is still an equation. A false equation is still an equation.</p>
         ${ans('Yes, No, Yes')}`
      )}
      ${tip('No equals sign means it is an expression, not an equation. Letters do not matter either way: 9 × 2 and 9 × w are both expressions.')}`,

    // 9A Q3: is the equation true or false?
    '9a-true': `
      <p class="hp-tag">Worked example: are these true or false? <b>7 × 4 = 30 − 2</b> and <b>8(7 − 5) = 17</b></p>
      ${steps(
        `<p><strong>Work out each side on its own.</strong></p>
         ${sum('Left: 7 × 4 = 28<br>Right: 30 − 2 = 28')}
         <p>Both sides are 28, so the equation is <b>true</b>.</p>`,
        `<p><strong>Use the order of operations.</strong> Brackets first, then ×.</p>
         ${sum(`Left: 8 × ${now('(7 − 5)')} = 8 × 2 = 16<br>Right: 17`)}
         <p>16 is not 17, so this one is <b>false</b>.</p>
         ${ans('True, False')}`
      )}
      ${tip('A number touching a bracket means multiply: 8(7 − 5) means 8 × (7 − 5).')}`,

    // 9A Q4, Q5, Q6: substituting to test an equation
    '9a-sub': `
      <p class="hp-tag">Worked example: if <b>p = 8</b>, is <b>3p − 4 = 2p + 4</b> true or false?</p>
      ${steps(
        `<p><strong>Put 8 in place of every p.</strong> 3p means 3 × p.</p>
         ${sum('Left: 3 × 8 − 4<br>Right: 2 × 8 + 4')}`,
        `<p><strong>Work out each side.</strong> Multiply before you add or take away.</p>
         ${sum('Left: 24 − 4 = 20<br>Right: 16 + 4 = 20')}`,
        `<p><strong>Compare.</strong> Both sides are 20, so it is true.</p>
         ${ans('True')}`
      )}
      ${tip('With two letters, swap each letter for its own number. If m = 10 and n = 3, then m − n is 10 − 3 = 7.')}`,

    // 9A Q7, Q8: writing an equation from words or a story
    '9a-write': `
      ${chips(['sum, more than → +'], ['less than, difference → −'], ['product, times, doubled → ×'], ['one-quarter of → ÷ 4'], ['is, the result is → =', 'add'])}
      <p class="hp-tag">Worked example: <b>When w is multiplied by 5 and then 2 is added, the result is 47.</b></p>
      ${steps(
        `<p><strong>Build the left side in order.</strong> First w is multiplied by 5, which is 5w. Then 2 is added.</p>
         ${sum('5w + 2')}`,
        `<p><strong>"The result is" becomes the = sign.</strong></p>
         ${sum('5w + 2 = 47')}
         ${ans('5w + 2 = 47')}`
      )}
      <p><strong>A story works the same way.</strong> Pens cost $p each. Three pens and a $6 folder cost $27, so 3p + 6 = 27. One-quarter of y is 6 is written y/4 = 6.</p>
      ${tip('Type the equation itself, like 5w+2=47. Do not solve it and type w = 9: that is the answer to a different question. In a few years, every person gets older, so add the years once for each person.')}`,

    // 9A Q9, Q10, Q11: finding values that make an equation true
    '9a-find': `
      <p class="hp-tag">Worked example: find two values of <b>k</b> that make <b>k × (10 − k) = 21</b> true.</p>
      ${steps(
        `<p><strong>Try whole numbers in order</strong> and work out the left side each time.</p>
         ${sum('k = 1: 1 × 9 = 9<br>k = 2: 2 × 8 = 16<br>k = 3: 3 × 7 = 21 ✓')}`,
        `<p><strong>Keep going</strong>, because there may be more than one answer.</p>
         ${sum('k = 7: 7 × 3 = 21 ✓')}
         ${ans('3, 7')}`
      )}
      <p><strong>Counting pairs:</strong> for x + y = 5 with whole numbers from 1 to 6, list them in order of x: (1, 4), (2, 3), (3, 2), (4, 1). That is 4 pairs.</p>
      ${tip('For a single value, read the equation as a question. 21 = n + 13 asks "what plus 13 makes 21?", so n = 8. Type just the number, or n = 8.')}`,

    // 9A Q14: always, never or sometimes true
    '9a-always': `
      <p class="hp-tag">Worked example: is each equation always true (A), never true (N) or sometimes true (S)?</p>
      ${chips(['4m − m = 3m'], ['c + 5 = c + 8'], ['x × x = 16'])}
      ${steps(
        `<p><strong>Simplify each side if you can.</strong> 4m − m is 3m, so both sides are the same whatever m is. That is <b>always</b> true.</p>`,
        `<p><strong>Ask if the sides could ever match.</strong> c + 5 is always 3 less than c + 8, so the two sides can never be equal. That is <b>never</b> true.</p>`,
        `<p><strong>Try a few values.</strong> x × x = 16 works for x = 4 but not for x = 1. Works for some values only, so it is <b>sometimes</b> true.</p>
         ${ans('A, N, S')}`
      )}
      ${tip('A number times itself is never negative: 3 × 3 and (−3) × (−3) are both 9.')}`,

    // 9A Q15, Q16: arranging symbols to make equations
    '9a-symbols': `
      <p class="hp-tag">Worked example: rearrange <b>4, 7, 28, ÷, =</b> to make a true equation.</p>
      ${steps(
        `<p><strong>Think about the operation.</strong> Dividing makes numbers smaller, so the biggest number, 28, should be the one being divided.</p>
         ${sum('28 ÷ 4 = 7 ✓')}`,
        `<p><strong>With two operations, put one on each side</strong> and work out both sides to check. For 2, 6, 10, 13, ÷, −:</p>
         ${sum('6 ÷ 2 = 13 − 10<br>3 = 3 ✓')}
         ${ans('28 ÷ 4 = 7')}`
      )}
      <p><strong>Counting arrangements:</strong> be organised. Start with one number in the first spot, list every way to finish, then move on to the next number. The equals sign can go near the start too, like 7 = 28 ÷ 4.</p>
      ${tip('For "Is it possible?" questions, one example that works is enough to say Yes.')}`,

    // =====================================================================
    // 9B Solving equations by inspection
    // =====================================================================
    // 9B Q1, Q2: the missing number in a box
    '9b-missing': `
      <p class="hp-tag">Worked example: <b>□ × 9 = 63</b></p>
      ${steps(
        `<p><strong>Read it as a question.</strong> "What number times 9 makes 63?"</p>`,
        `<p><strong>Use your tables, or the opposite operation.</strong> The opposite of × is ÷.</p>
         ${sum('63 ÷ 9 = 7')}`,
        `<p><strong>Check by putting it back.</strong></p>
         ${sum('7 × 9 = 63 ✓')}
         ${ans('7')}`
      )}
      <p><strong>Take-aways:</strong> 50 − □ = 32 asks "what do I take from 50 to leave 32?" The gap is 50 − 32 = 18.</p>
      ${tip('The box can be on either side of the = sign. 30 = □ + 8 means the same as □ + 8 = 30.')}`,

    // 9B Q3: one-step equations by inspection
    '9b-inspect': `
      <p class="hp-tag">Worked example: solve <b>h − 8 = 17</b> and <b>42 ÷ m = 6</b> by inspection.</p>
      ${steps(
        `<p><strong>Say it in words.</strong> h − 8 = 17 asks "what number, take away 8, leaves 17?" Count back up: 17 + 8 = 25.</p>
         ${sum('h = 25')}`,
        `<p><strong>Same idea for the second.</strong> "42 divided by what gives 6?" Six 7s make 42.</p>
         ${sum('m = 7')}`,
        `<p><strong>Check both.</strong></p>
         ${sum('25 − 8 = 17 ✓<br>42 ÷ 7 = 6 ✓')}
         ${ans('h = 25, m = 7')}`
      )}
      ${tip('Type just the number, like 25, or h = 25. Both are marked right.')}`,

    // 9B Q4, Q5: two-step equations by inspection (trying values, or undoing)
    '9b-guess': `
      <p class="hp-tag">Worked example: solve <b>6w + 5 = 47</b> by inspection.</p>
      ${steps(
        `<p><strong>Try a value for w</strong> and work out the left side. Is it too big or too small?</p>
         ${sum('w = 5: 6 × 5 + 5 = 35, too small<br>w = 8: 6 × 8 + 5 = 53, too large')}`,
        `<p><strong>Try a value in between.</strong> The answer is between 5 and 8.</p>
         ${sum('w = 7: 6 × 7 + 5 = 47 ✓')}
         ${ans('7')}`,
        `<p><strong>Another way: undo the operations.</strong> w was multiplied by 6, then 5 was added. Start at 47 and undo them in reverse order.</p>
         ${flow(['Start', '47'], ['− 5', '42'], ['÷ 6', 'w = 7'])}`
      )}
      <p><strong>Letter on both sides?</strong> Keep trying values until both sides match. For 22 − x = x + 4, try x = 8: 14 and 12, not equal. Try x = 9: 13 and 13 ✓.</p>
      ${tip('Brackets work the same way. For 2(k + 6) = 26, try k = 5: 2 × 11 = 22, too small. Try k = 7: 2 × 13 = 26 ✓.')}`,

    // 9B Q6, Q7, Q8, Q9, Q10, Q11: words and stories
    '9b-words': `
      ${chips(['doubled → 2x'], ['6 less than a number → x − 6'], ['half of a number → x/2'], ['three times as old → 3y'])}
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Sam swims <span class="hp-hl">l</span> laps of a <span class="hp-hl">25</span> m pool and swims <span class="hp-hl">175</span> m altogether. Write an equation and solve it.</p>
      ${steps(
        `<p><strong>Turn the story into an equation.</strong> Each lap is 25 m, so l laps is 25 × l.</p>
         ${sum('25l = 175')}`,
        `<p><strong>Solve by inspection.</strong> 25 times what is 175? Four 25s make 100, three more make 175, so 7.</p>
         ${sum('l = 7')}
         ${ans('25l = 175, l = 7')}`
      )}
      <p><strong>Ages:</strong> "In 9 years' time Ava will be 23" gives a + 9 = 23, so a = 14.</p>
      ${tip('When it says "write an equation", type the equation itself, like 25l=175, not l = 7. When it asks for the value, type just the number, or l = 7.')}`,

    // 9B Q12, Q13: numbers in a row
    '9b-consec': `
      <p class="hp-tag">Worked example: two whole numbers in a row add to 61. Solve <b>x + (x + 1) = 61</b>.</p>
      ${steps(
        `<p><strong>Simplify the left side.</strong> Two x's and a 1.</p>
         ${sum('x + (x + 1) = 2x + 1')}`,
        `<p><strong>Solve 2x + 1 = 61 by inspection.</strong> Half of 61 is about 30, so try values near there.</p>
         ${sum('x = 29: 2 × 29 + 1 = 59, too small<br>x = 30: 2 × 30 + 1 = 61 ✓')}`,
        `<p><strong>Find both numbers and check.</strong> The next number is 31.</p>
         ${sum('30 + 31 = 61 ✓')}
         ${ans('30, 31')}`
      )}
      ${tip('Three numbers in a row are x, x + 1 and x + 2, which add to 3x + 3. Type a list with commas, smallest first.')}`,

    // 9B Q14: two pronumerals, one value given
    '9b-two': `
      <p class="hp-tag">Worked example: find <b>y</b> when <b>5x + y = 27</b> and <b>x = 4</b>.</p>
      ${steps(
        `<p><strong>Put in the value you know.</strong> 5x means 5 × 4.</p>
         ${sum('5 × 4 + y = 27<br>20 + y = 27')}`,
        `<p><strong>Now only one letter is left.</strong> 20 plus what makes 27?</p>
         ${sum('y = 7')}`,
        `<p><strong>Check.</strong></p>
         ${sum('20 + 7 = 27 ✓')}
         ${ans('7')}`
      )}
      ${tip('If x appears twice, put the same number in both places.')}`,

    // =====================================================================
    // 9C Equivalent equations
    // =====================================================================
    // 9C Q1, Q2: doing an operation to both sides
    '9c-apply': `
      <p class="hp-tag">Worked example: apply <b>[+ 3]</b> to <b>8 + x = 14</b>.</p>
      ${steps(
        `<p><strong>Do it to both sides.</strong> An equation is like balanced scales: add the same to each side and it stays balanced.</p>
         ${sum('8 + x + 3 = 14 + 3')}`,
        `<p><strong>Simplify each side.</strong></p>
         ${sum('x + 11 = 17')}
         ${ans('17')}`
      )}
      <p><strong>Multiplying or dividing:</strong> do it to every part. [× 7] turns 5x = 2 into 35x = 14. [÷ 5] turns 30 = 10b into 6 = 2b.</p>
      ${tip('A number in front of the letter gets multiplied or divided too. Adding or subtracting only changes the plain numbers.')}`,

    // 9C Q3, Q5, Q7: which operation was used, matching, simplest step
    '9c-which': `
      <p class="hp-tag">Worked example: which operation turns <b>4x + 9 = 25</b> into <b>4x = 16</b>?</p>
      ${steps(
        `<p><strong>Spot what changed.</strong> The + 9 has gone, and 25 has become 16.</p>`,
        `<p><strong>Name the operation and check it on the other side.</strong> Taking away 9 removes the + 9.</p>
         ${sum('25 − 9 = 16 ✓')}
         ${ans('Subtract 9 from both sides')}`
      )}
      <p><strong>For × and ÷, look at the numbers.</strong> 14x = 35 becomes 2x = 5: 14 ÷ 7 = 2 and 35 ÷ 7 = 5, so both sides were divided by 7.</p>
      <p><strong>To match equations,</strong> do something to both sides of one and see which equation in the list you land on. m + 2 = 9, add 8, gives m + 10 = 17.</p>
      ${tip('To simplify, undo the last thing done to the letter: take away an added number first, or divide when a number multiplies a whole bracket.')}`,

    // 9C Q4, Q6, Q10: two operations in a row
    '9c-chain': `
      <p class="hp-tag">Worked example: start with <b>x = 8</b>. Build an equivalent equation with left side <b>3x − 4</b>.</p>
      ${steps(
        `<p><strong>Work out which steps build 3x − 4.</strong> First multiply x by 3, then subtract 4.</p>`,
        `<p><strong>Do each step to both sides.</strong></p>
         ${flow(['Start', 'x = 8'], ['× 3 both sides', '3x = 24'], ['− 4 both sides', '3x − 4 = 20'])}
         ${ans('20')}`
      )}
      <p><strong>Add first, multiply after?</strong> Keep a bracket. x = 8, add 1: x + 1 = 9. Then × 10: 10(x + 1) = 90.</p>
      ${tip('To go backwards, undo the steps in reverse order: + 4, then ÷ 3 takes 3x − 4 = 20 back to x = 8.')}`,

    // 9C Q8: showing two equations are equivalent
    '9c-show': `
      <p class="hp-tag">Worked example: show that <b>2x + 5 = 19</b> and <b>4x − 6 = 22</b> are equivalent.</p>
      ${steps(
        `<p><strong>Solve the first one.</strong></p>
         ${flow(['Start', '2x + 5 = 19'], ['− 5', '2x = 14'], ['÷ 2', 'x = 7'])}`,
        `<p><strong>Solve the second one.</strong></p>
         ${flow(['Start', '4x − 6 = 22'], ['+ 6', '4x = 28'], ['÷ 4', 'x = 7'])}`,
        `<p><strong>Same simple equation, so they are equivalent.</strong> You can even walk from one to the other: 2x + 5 = 19 → x = 7 → (× 4) 4x = 28 → (− 6) 4x − 6 = 22.</p>
         ${ans('x = 7')}`
      )}
      ${tip('When there are several boxes, fill them in order from left to right.')}`,

    // 9C Q9, Q11: reasoning about equivalence
    '9c-reason': `
      <p class="hp-tag">Worked example: multiply both sides of <b>x + 2 = 5</b> by zero.</p>
      ${steps(
        `<p><strong>Anything times 0 is 0.</strong></p>
         ${sum('0 × (x + 2) = 0 × 5<br>0 = 0')}`,
        `<p><strong>All the information about x is gone.</strong> 0 = 0 is true for every x, but x + 2 = 5 is only true for x = 3. They are not equivalent, which is why × 0 is not allowed.</p>
         ${ans('0 = 0')}`
      )}
      <p><strong>Equivalent means "has exactly the same solutions".</strong> Think of each equation by its solution, like x = 3 or x = 4, when you test a statement.</p>
      ${tip('To show a statement is false, one example where it fails is enough. Simple equations like x = 1 and x = 2 make good test cases.')}`,

    // =====================================================================
    // 9D Solving equations algebraically
    // =====================================================================
    // 9D Q1, Q2: one-step equations
    '9d-one': `
      ${chips(['+ is undone by −'], ['− is undone by +'], ['× is undone by ÷'], ['÷ is undone by ×'])}
      <p class="hp-tag">Worked example: solve <b>y − 13 = 29</b>.</p>
      ${steps(
        `<p><strong>What has been done to y?</strong> 13 was taken away. Undo it by adding 13 to both sides.</p>
         ${flow(['Start', 'y − 13 = 29'], ['+ 13 both sides', 'y = 42'])}`,
        `<p><strong>Check by substituting.</strong></p>
         ${sum('42 − 13 = 29 ✓')}
         ${ans('42')}`
      )}
      <p><strong>Same idea for × and ÷.</strong> 7k = 84: divide both sides by 7, so k = 12. q/3 = 11: multiply both sides by 3, so q = 33.</p>
      ${tip('Type just the number, like 42, or y = 42. If the letter is on the right, like 29 = y − 13, it works exactly the same way.')}`,

    // 9D Q3, Q4, Q5, Q12: two-step equations
    '9d-two': `
      <p class="hp-tag">Worked example: solve <b>4x − 9 = 31</b>.</p>
      ${steps(
        `<p><strong>Undo the + or − first.</strong> 9 was taken away, so add 9 to both sides.</p>
         ${flow(['Start', '4x − 9 = 31'], ['+ 9 both sides', '4x = 40'], ['÷ 4 both sides', 'x = 10'])}`,
        `<p><strong>Then undo the × or ÷.</strong> 4x means 4 × x, so divide both sides by 4.</p>
         ${ans('10')}`,
        `<p><strong>Check in the original.</strong></p>
         ${sum('4 × 10 − 9 = 40 − 9 = 31 ✓')}`
      )}
      <p><strong>Brackets: divide first.</strong> 2(x + 7) = 30 → ÷ 2 → x + 7 = 15 → − 7 → x = 8.<br><strong>Fractions:</strong> x/8 + 3 = 14 → − 3 → x/8 = 11 → × 8 → x = 88.</p>
      ${tip('Undo in the reverse order to how the equation was built, like unwrapping a present. Longer equations just take more steps.')}`,

    // 9D Q6: answers that are fractions
    '9d-frac': `
      <p class="hp-tag">Worked example: solve <b>7x + 2 = 12</b>, giving the answer as a fraction.</p>
      ${steps(
        `<p><strong>Undo the + 2.</strong></p>
         ${flow(['Start', '7x + 2 = 12'], ['− 2 both sides', '7x = 10'])}`,
        `<p><strong>Divide by 7.</strong> 10 ÷ 7 does not come out exactly, so leave it as a fraction: the number on top, the divisor underneath.</p>
         ${flow(['Now', '7x = 10'], ['÷ 7 both sides', 'x = 10/7'])}
         ${ans('10/7')}`
      )}
      ${tip('Type the fraction with a slash, like 10/7. A top-heavy fraction is fine. If there are brackets, deal with them first, as usual.')}`,

    // 9D Q7: negative solutions
    '9d-neg': `
      <p class="hp-tag">Worked example: solve <b>5x + 33 = 3</b>.</p>
      ${steps(
        `<p><strong>Take 33 from both sides.</strong> 3 − 33 goes below zero.</p>
         ${flow(['Start', '5x + 33 = 3'], ['− 33 both sides', '5x = −30'])}`,
        `<p><strong>Divide by 5.</strong> A negative divided by a positive is negative.</p>
         ${flow(['Now', '5x = −30'], ['÷ 5 both sides', 'x = −6'])}
         ${ans('−6')}`,
        `<p><strong>Check.</strong></p>
         ${sum('5 × (−6) + 33 = −30 + 33 = 3 ✓')}`
      )}
      ${tip('Type a negative answer with the minus key, like -6. If the letter has a minus in front, like −3x = 12, divide by −3 to get x = −4.')}`,

    // 9D Q8, Q9, Q10: write an equation, then solve it
    '9d-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ella is paid <span class="hp-hl">$12</span> an hour plus a <span class="hp-hl">$25</span> bonus each week. One week she earned <span class="hp-hl">$157</span>. How many hours, <span class="hp-hl">n</span>, did she work?</p>
      ${steps(
        `<p><strong>Write the equation.</strong> n hours at $12 is 12n, plus the bonus.</p>
         ${sum('12n + 25 = 157')}`,
        `<p><strong>Solve it.</strong></p>
         ${flow(['Start', '12n + 25 = 157'], ['− 25', '12n = 132'], ['÷ 12', 'n = 11'])}
         ${ans('11')}`
      )}
      ${tip('For "write an equation" or "write an expression", type exactly that, like 12n+25=157. An expression has no = sign. For money, 2.50 or 2.5 are both fine.')}`,

    // 9D Q11: unknown lengths from area or perimeter
    '9d-shape': `
      <p class="hp-tag">Worked example: this rectangle has a perimeter of 32. Find x.</p>
      ${fig({ kind: 'rect', cols: [['9', 3]], rows: [['x', 2]], cells: [['perimeter = 32']] })}
      ${steps(
        `<p><strong>Write the equation.</strong> The perimeter goes all the way round: two 9s and two x's.</p>
         ${sum('2x + 18 = 32')}`,
        `<p><strong>Solve it.</strong></p>
         ${flow(['Start', '2x + 18 = 32'], ['− 18', '2x = 14'], ['÷ 2', 'x = 7'])}
         ${ans('7')}`
      )}
      <p><strong>Area</strong> is length × width. A rectangle with area 52 and one side 4 gives 4w = 52, so w = 13.</p>
      ${tip('A square has four equal sides, so its perimeter is 4 × the side.')}`,

    // 9D Q14: are two equations equivalent?
    '9d-equiv': `
      <p class="hp-tag">Worked example: are <b>2x + 9 = 25</b> and <b>3x = 24</b> equivalent?</p>
      ${steps(
        `<p><strong>Solve the first.</strong></p>
         ${flow(['Start', '2x + 9 = 25'], ['− 9', '2x = 16'], ['÷ 2', 'x = 8'])}`,
        `<p><strong>Solve the second.</strong></p>
         ${flow(['Start', '3x = 24'], ['÷ 3', 'x = 8'])}`,
        `<p><strong>Same solution, so yes.</strong> Equivalent equations have exactly the same solutions.</p>
         ${ans('Yes, both give x = 8')}`
      )}
      ${tip('You can also go from x = 8 to 3x = 24 by multiplying both sides by 3. Each box in a chain is the result after that arrow.')}`,

    // 9D Q15: spotting mistakes in working
    '9d-mistakes': `
      <p class="hp-tag">Worked example: the correct way to solve <b>2x + 10 = 30</b>.</p>
      ${flow(['Start', '2x + 10 = 30'], ['− 10 both sides', '2x = 20'], ['÷ 2 both sides', 'x = 10'])}
      ${steps(
        `<p><strong>Mistake 1: dividing only some terms.</strong> ÷ 2 first must halve every term: x + 5 = 15, not x + 10 = 15.</p>`,
        `<p><strong>Mistake 2: subtracting the number in front.</strong> 2x means 2 × x. Taking away 2 does not undo it; dividing by 2 does.</p>`,
        `<p><strong>Mistake 3: doing different things to each side.</strong> If you take 10 from one side, you must take 10 from the other, not add it.</p>
         ${ans('x = 10')}`
      )}
      ${tip('Check each arrow: was the same thing done to every term, on both sides? Substituting the answer back in shows which ones are wrong.')}`,

    // 9D Q16: pronumerals on both sides
    '9d-both': `
      <p class="hp-tag">Worked example: solve <b>5x + 1 = 2x + 25</b>.</p>
      ${steps(
        `<p><strong>Get the letters on one side.</strong> Take the smaller letter term, 2x, from both sides.</p>
         ${flow(['Start', '5x + 1 = 2x + 25'], ['− 2x both sides', '3x + 1 = 25'])}`,
        `<p><strong>Now solve as usual.</strong></p>
         ${flow(['Now', '3x + 1 = 25'], ['− 1', '3x = 24'], ['÷ 3', 'x = 8'])}
         ${ans('8')}`,
        `<p><strong>Check both sides.</strong></p>
         ${sum('Left: 5 × 8 + 1 = 41<br>Right: 2 × 8 + 25 = 41 ✓')}`
      )}
      ${tip('5x − 2x = 3x, just like 5 apples take away 2 apples is 3 apples.')}`,

    // =====================================================================
    // 9E Equations with fractions
    // =====================================================================
    // 9E Q1, Q2: a letter divided by a number
    '9e-divide': `
      <p class="hp-tag">Worked example: solve <b>x/4 = 13</b> and <b>3x/8 = 6</b>.</p>
      ${steps(
        `<p><strong>Undo ÷ by multiplying.</strong> x/4 means x ÷ 4, so multiply both sides by 4.</p>
         ${flow(['Start', 'x/4 = 13'], ['× 4 both sides', 'x = 52'])}`,
        `<p><strong>With a number on top, multiply first, then divide.</strong></p>
         ${flow(['Start', '3x/8 = 6'], ['× 8 both sides', '3x = 48'], ['÷ 3 both sides', 'x = 16'])}
         ${ans('52, 16')}`,
        `<p><strong>Check.</strong></p>
         ${sum('3 × 16 = 48, and 48 ÷ 8 = 6 ✓')}`
      )}
      ${tip('Type just the number, like 16, or x = 16.')}`,

    // 9E Q3, Q4, Q8, Q10: two-step equations with fractions
    '9e-twostep': `
      <p class="hp-tag">Worked example 1: the whole top is divided. Solve <b>(x + 2)/7 = 5</b>.</p>
      ${flow(['Start', '(x + 2)/7 = 5'], ['× 7 both sides', 'x + 2 = 35'], ['− 2 both sides', 'x = 33'])}
      <p class="hp-tag">Worked example 2: a number is added outside. Solve <b>2x/5 + 6 = 14</b>.</p>
      ${steps(
        `<p><strong>Undo the + 6 first</strong>, because it is outside the fraction.</p>
         ${sum('2x/5 = 8')}`,
        `<p><strong>Then × 5, then ÷ 2.</strong></p>
         ${flow(['Now', '2x/5 = 8'], ['× 5', '2x = 40'], ['÷ 2', 'x = 20'])}
         ${ans('20')}`,
        `<p><strong>Check.</strong></p>
         ${sum('2 × 20 = 40, 40 ÷ 5 = 8, 8 + 6 = 14 ✓')}`
      )}
      <p><strong>Negative answers are fine.</strong> x/3 + 10 = 8 gives x/3 = −2, so x = −6. Type it as -6.</p>
      ${tip('The fraction line acts like brackets. If the + is on top, multiply first; if it is outside the fraction, take it away first. 1/7 × (x + 2) means the same as (x + 2)/7.')}`,

    // 9E Q5, Q6, Q7: word problems with fractions
    '9e-words': `
      <p class="hp-tag">Worked example: a number, <b>n</b>, is divided by 3 and then 4 is subtracted. The result is 5.</p>
      ${steps(
        `<p><strong>Build the equation in the order of the words.</strong></p>
         ${sum('n/3 − 4 = 5')}`,
        `<p><strong>Solve: undo the − 4, then the ÷ 3.</strong></p>
         ${flow(['Start', 'n/3 − 4 = 5'], ['+ 4', 'n/3 = 9'], ['× 3', 'n = 27'])}
         ${ans('27')}`
      )}
      <p><strong>Sharing means dividing.</strong> Five friends split a bill of $b evenly and each pays $12.60, so b/5 = 12.6 and b = 63.</p>
      ${tip('When asked to write an equation or expression, type it, like b/5=12.6. If something is "divided by 3" after a sum, put brackets round the sum: (x + 4)/3.')}`,

    // 9E Q9, Q11, Q12: fraction answers and changing the right-hand side
    '9e-fracans': `
      <p class="hp-tag">Worked example: solve <b>(3x + 2)/4 = 3</b>, giving a fraction.</p>
      ${steps(
        `<p><strong>Multiply both sides by 4.</strong></p>
         ${sum('3x + 2 = 12')}`,
        `<p><strong>Subtract 2, then divide by 3.</strong> 10 ÷ 3 does not divide exactly, so leave it as a fraction.</p>
         ${flow(['Now', '3x + 2 = 12'], ['− 2', '3x = 10'], ['÷ 3', 'x = 10/3'])}
         ${ans('10/3')}`
      )}
      <p><strong>Any equation like 7x = 3 has the solution 3/7:</strong> the number on the right goes on top. To make a chosen solution work, substitute it into the left side: with x = 10, (3x + 2)/4 = 32/4 = 8.</p>
      ${tip('Type fractions with a slash, like 10/3. A negative fraction like −1/3 is typed -1/3.')}`,

    // =====================================================================
    // 9F Equations with brackets
    // =====================================================================
    // 9F Q1, Q2: expanding brackets
    '9f-expand': `
      <p class="hp-tag">Worked example: expand <b>8(x + 6)</b> and <b>11(2y − 3)</b>.</p>
      ${steps(
        `<p><strong>Multiply the outside number by every term inside.</strong></p>
         ${area('8', [['x', '8 × x = 8x', 2], ['+ 6', '8 × 6 = 48', 1]])}
         ${sum('8(x + 6) = 8x + 48')}`,
        `<p><strong>Keep the sign in front of each term.</strong></p>
         ${sum('11 × 2y = 22y<br>11 × (−3) = −33')}
         ${ans('8x + 48, 22y − 33')}`
      )}
      ${tip('Type expressions without spaces if you like: 8x+48. Do not forget the second term: 8(x + 6) is not 8x + 6.')}`,

    // 9F Q3: collecting like terms
    '9f-collect': `
      <p class="hp-tag">Worked example: simplify <b>7y + 2 − 3y + 9</b>.</p>
      ${steps(
        `<p><strong>Sort the terms into y-terms and plain numbers.</strong> Each sign belongs to the term after it.</p>
         ${chips(['+7y', 'add'], ['−3y', 'add'], ['+2', 'take'], ['+9', 'take'])}`,
        `<p><strong>Combine each group.</strong></p>
         ${sum('7y − 3y = 4y<br>2 + 9 = 11')}
         ${ans('4y + 11')}`
      )}
      ${tip('A letter on its own counts as 1 of it: y means 1y. Put the letter term first in your answer.')}`,

    // 9F Q4, Q5, Q7, Q9: solving by expanding brackets
    '9f-solve': `
      <p class="hp-tag">Worked example: solve <b>4(x + 9) = 64</b> by expanding first.</p>
      ${steps(
        `<p><strong>Expand the brackets.</strong></p>
         ${sum('4x + 36 = 64')}`,
        `<p><strong>Solve as usual.</strong></p>
         ${flow(['Start', '4x + 36 = 64'], ['− 36', '4x = 28'], ['÷ 4', 'x = 7'])}
         ${ans('7')}`,
        `<p><strong>Check in the original.</strong></p>
         ${sum('4 × (7 + 9) = 4 × 16 = 64 ✓')}`
      )}
      <p><strong>A number in front of x inside?</strong> 7(2x − 1) = 49 expands to 14x − 7 = 49, so 14x = 56 and x = 4.<br><strong>A negative outside?</strong> −2(x − 7) = −2x + 14, because a negative times a negative is positive.</p>
      ${tip('Negative answers are typed with the minus key, like -4.')}`,

    // 9F Q6, Q13: expand, collect like terms, then solve
    '9f-collect-solve': `
      <p class="hp-tag">Worked example: solve <b>7(x + 2) + 3x = 64</b>.</p>
      ${steps(
        `<p><strong>Expand the brackets.</strong></p>
         ${sum('7x + 14 + 3x = 64')}`,
        `<p><strong>Collect like terms.</strong> 7x + 3x = 10x.</p>
         ${sum('10x + 14 = 64')}`,
        `<p><strong>Solve.</strong></p>
         ${flow(['Now', '10x + 14 = 64'], ['− 14', '10x = 50'], ['÷ 10', 'x = 5'])}
         ${ans('5')}`
      )}
      ${tip('With two sets of brackets, expand both, then collect all the x-terms together and all the numbers together. Check by substituting: 7 × 7 + 15 = 64 ✓.')}`,

    // 9F Q8: worded problems with brackets
    '9f-words': `
      <p class="hp-tag">Worked example: <b>7 is added to n and then this is doubled, giving 30.</b></p>
      ${steps(
        `<p><strong>"Then this" means the whole thing so far</strong>, so it goes in brackets.</p>
         ${sum('2(n + 7) = 30')}`,
        `<p><strong>Expand, then solve.</strong></p>
         ${flow(['Start', '2n + 14 = 30'], ['− 14', '2n = 16'], ['÷ 2', 'n = 8'])}
         ${ans('8')}`
      )}
      ${tip('Check with the words: 8 add 7 is 15, and doubled is 30 ✓. Type just the value, like 8.')}`,

    // 9F Q10, Q11: equations with no solution or every solution
    '9f-nosol': `
      <p class="hp-tag">Worked example: simplify the left side of <b>7(x + 2) − 7x = 15</b>.</p>
      ${steps(
        `<p><strong>Expand and collect.</strong></p>
         ${sum('7x + 14 − 7x = 14')}
         ${ans('14')}`,
        `<p><strong>The x's have cancelled out.</strong> The equation now says 14 = 15, which is never true. No value of x can fix it, so there is <b>no solution</b>.</p>`
      )}
      <p><strong>If the sides match instead,</strong> like 7(x + 2) − 7x = 14, it says 14 = 14. That is true for every value of x. Try x = 0 and x = 3 to see the left side stays the same.</p>
      ${tip('When the left side simplifies to just a number, type that number.')}`,

    // =====================================================================
    // 9G Using formulas
    // =====================================================================
    // 9G Q1, Q2, Q3, Q4, Q5: using a rule both ways
    '9g-rule': `
      <p class="hp-tag">Worked example: the rule is <b>p = 5n − 3</b>.</p>
      ${steps(
        `<p><strong>Find p when n = 6: substitute.</strong></p>
         ${sum('p = 5 × 6 − 3 = 30 − 3 = 27')}`,
        `<p><strong>Find n when p = 37: substitute, then solve.</strong></p>
         ${flow(['Start', '37 = 5n − 3'], ['+ 3', '40 = 5n'], ['÷ 5', 'n = 8'])}
         ${ans('27, 8')}`
      )}
      <p><strong>Two letters?</strong> Put in every value you know, then solve for the one left. If W = 4r + s, W = 30 and s = 2, then 30 = 4r + 2, so 4r = 28 and r = 7.</p>
      ${tip('Type just the number, like 8, or n = 8. Check by putting it back: 5 × 8 − 3 = 37 ✓.')}`,

    // 9G Q6, Q7: area and perimeter formulas
    '9g-shape': `
      <p class="hp-tag">Worked example: a rectangle has area 56 and length 8. Find its width.</p>
      ${fig({ kind: 'rect', cols: [['l = 8', 2]], rows: [['w', 1]], cells: [['A = 56']] })}
      ${steps(
        `<p><strong>Put the numbers into A = l × w.</strong></p>
         ${sum('56 = 8 × w')}`,
        `<p><strong>Solve.</strong> Divide both sides by 8.</p>
         ${sum('w = 7')}
         ${ans('7')}`
      )}
      <p><strong>Perimeter:</strong> P = 2(w + l). With P = 30 and l = 9: 2(w + 9) = 30, ÷ 2 gives w + 9 = 15, so w = 6. Its area is then 9 × 6 = 54.</p>
      ${tip('If the length and width come out the same, the rectangle is a square.')}`,

    // 9G Q8, Q9, Q10, Q13: formulas from science and everyday life
    '9g-science': `
      <p class="hp-tag">Worked example: speed is <b>s = d/t</b> (distance ÷ time). Find d when s = 9 and t = 7.</p>
      ${steps(
        `<p><strong>Substitute what you know.</strong></p>
         ${sum('9 = d/7')}`,
        `<p><strong>Solve.</strong> Undo ÷ 7 by multiplying by 7.</p>
         ${sum('d = 63')}
         ${ans('63')}`,
        `<p><strong>A formula with a fraction and a + works the same way.</strong> If T = 5w/3 + 20 and T = 45:</p>
         ${flow(['Start', '45 = 5w/3 + 20'], ['− 20', '25 = 5w/3'], ['× 3', '75 = 5w'], ['÷ 5', 'w = 15'])}`
      )}
      ${tip('For a difference between two values, work out both, then subtract. Round only at the very end, if the question asks.')}`,

    // 9G Q11: rearranging a formula
    '9g-rearrange': `
      <p class="hp-tag">Worked example: rearrange <b>T = 3m − 4n</b> to make m by itself.</p>
      ${steps(
        `<p><strong>Undo the − 4n.</strong> Add 4n to both sides.</p>
         ${sum('T + 4n = 3m')}`,
        `<p><strong>Undo the 3 × m.</strong> Divide both sides by 3. The whole left side is divided, so it needs brackets.</p>
         ${sum('m = (T + 4n)/3')}
         ${ans('m=(T+4n)/3')}`,
        `<p><strong>Test with numbers.</strong> m = 9, n = 2 gives T = 27 − 8 = 19. Then (19 + 8)/3 = 9 ✓.</p>`
      )}
      ${tip('Type the whole formula, starting with the letter and =. If there is a fraction, multiply it away; if there are brackets, expand them first.')}`,

    // 9G Q12: does a rule fit a table?
    '9g-table': `
      <p class="hp-tag">Worked example: does each rule fit every column of this table?</p>
      ${fig({ kind: 'table', rows: [['n', '2', '6'], ['C', '11', '23']] })}
      ${steps(
        `<p><strong>Test C = 3n + 5 on every column.</strong></p>
         ${sum('n = 2: 3 × 2 + 5 = 11 ✓<br>n = 6: 3 × 6 + 5 = 23 ✓')}
         <p>It works every time, so <b>Yes</b>.</p>`,
        `<p><strong>Test C = n + 9.</strong></p>
         ${sum('n = 2: 2 + 9 = 11 ✓<br>n = 6: 6 + 9 = 15 ✗')}
         <p>One miss is enough, so <b>No</b>.</p>
         ${ans('Yes, No')}`
      )}
      ${tip('A rule has to work for every column, not just the first one. Check them all.')}`,

    // =====================================================================
    // 9H Using equations to solve problems
    // =====================================================================
    // 9H Q2, Q3, Q4: write an equation from a story and solve it
    '9h-steps': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Mei pays <span class="hp-hl">$14</span> per lesson plus a <span class="hp-hl">$30</span> joining fee. She paid <span class="hp-hl">$212</span> altogether. How many lessons did she have?</p>
      ${steps(
        `<p><strong>Choose a letter for the unknown.</strong> Let n be the number of lessons.</p>`,
        `<p><strong>Write the equation.</strong> n lessons at $14 is 14n, plus the fee.</p>
         ${sum('14n + 30 = 212')}`,
        `<p><strong>Solve, then answer the question.</strong></p>
         ${flow(['Start', '14n + 30 = 212'], ['− 30', '14n = 182'], ['÷ 14', 'n = 13'])}
         ${ans('13 lessons')}`
      )}
      ${tip('For "write an equation", type the equation itself, like 14n+30=212. For money answers, 1.50 or 1.5 are both fine. Leave out the $ sign and spaces in big numbers.')}`,

    // 9H Q1, Q6, Q8, Q9: related amounts and number puzzles
    '9h-relate': `
      <p class="hp-tag">Worked example: Ivy is 4 years older than her brother. Their ages add to 34. How old is her brother?</p>
      ${steps(
        `<p><strong>Let the letter be the smaller amount</strong> and build the other one from it.</p>
         ${chips(['brother: b'], ['Ivy: b + 4'])}`,
        `<p><strong>Write the equation and simplify.</strong></p>
         ${sum('b + (b + 4) = 34<br>2b + 4 = 34')}`,
        `<p><strong>Solve.</strong></p>
         ${flow(['Start', '2b + 4 = 34'], ['− 4', '2b = 30'], ['÷ 2', 'b = 15'])}
         ${ans('15')}`
      )}
      <p><strong>Doubling each time:</strong> x, then 2x, then 4x. <strong>Number puzzles:</strong> "the result is doubled" puts brackets round everything so far.</p>
      ${tip('Answers can be decimals: 1 1/2 hours is typed 1.5. Next year means add 1: age a now, a + 1 next year.')}`,

    // 9H Q5, Q7, Q12, Q13: perimeter, area and rectangle sides
    '9h-shape': `
      <p class="hp-tag">Worked example: a four-sided shape has sides <b>x</b>, <b>2x</b>, <b>6</b> and <b>11</b>. Its perimeter is 41. Find x.</p>
      ${steps(
        `<p><strong>Add up all the sides</strong> and set them equal to the perimeter.</p>
         ${sum('x + 2x + 6 + 11 = 41<br>3x + 17 = 41')}`,
        `<p><strong>Solve.</strong></p>
         ${flow(['Start', '3x + 17 = 41'], ['− 17', '3x = 24'], ['÷ 3', 'x = 8'])}
         ${ans('8')}`
      )}
      <p><strong>Rectangles:</strong> opposite sides are equal. If the top is 3x − 1 and the bottom is 20, then 3x − 1 = 20, so x = 7. Area is length × width, so a paddock 15 m long with width w has area 15w.</p>
      ${tip('If the perimeter and area are equal, write each as an expression and put an = between them.')}`,

    // 9H Q10, Q11, Q17: angles in a triangle
    '9h-angles': `
      <p class="hp-tag">Worked example: a triangle has angles <b>2x°</b>, <b>3x°</b> and <b>80°</b>. Find x.</p>
      ${steps(
        `<p><strong>The angles in a triangle add to 180°.</strong></p>
         ${sum('2x + 3x + 80 = 180<br>5x + 80 = 180')}`,
        `<p><strong>Solve.</strong></p>
         ${flow(['Start', '5x + 80 = 180'], ['− 80', '5x = 100'], ['÷ 5', 'x = 20'])}
         ${ans('20')}`,
        `<p><strong>Check.</strong> The angles are 40°, 60° and 80°.</p>
         ${sum('40 + 60 + 80 = 180 ✓')}`
      )}
      ${tip('A right angle is 90°. Every angle in a real triangle must be more than 0°, so a negative angle means the triangle cannot exist.')}`,

    // 9H Q14, Q15: does the solution make sense?
    '9h-sense': `
      <p class="hp-tag">Worked example: solve <b>4n + 26 = 6</b>. Could n be a number of people?</p>
      ${steps(
        `<p><strong>Solve first.</strong></p>
         ${flow(['Start', '4n + 26 = 6'], ['− 26', '4n = −20'], ['÷ 4', 'n = −5'])}`,
        `<p><strong>Ask if the answer fits the story.</strong> You cannot have −5 people, so <b>no</b>. A temperature of −5 °C is fine, though.</p>
         ${ans('−5, No')}`
      )}
      <p><strong>Whole numbers only?</strong> Stickers cost 30 cents each. 0.30p = 2.40 gives p = 8, a whole number, so yes. 0.30p = 2.50 gives 8.33..., so no.</p>
      ${tip('Type a negative answer with the minus key, like -5.')}`,
  });
})();
