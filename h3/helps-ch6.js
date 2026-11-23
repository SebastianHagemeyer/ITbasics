/* H3 "How do I work this out?" panels for Chapter 6.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 6A to 6G. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  // Unlabelled dots for a figure: each needs its own key, so the keys are invisible zero-width spaces.
  const dots = (vals) => Object.fromEntries(vals.map((v, i) => ['​'.repeat(i + 1), v]));
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 6A Introduction to negative integers
    // =====================================================================
    // 6A Q1, Q2, Q3: listing the integers in a range
    '6a-list': `
      <p class="hp-tag">Worked example: list the integers greater than <b>−5</b> and less than <b>3</b>.</p>
      ${fig({ kind: 'numberline', min: -6, max: 4, divisions: 1, points: dots([-4, -3, -2, -1, 0, 1, 2]) })}
      ${steps(
        `<p><strong>Picture a number line.</strong> Negative numbers sit to the left of 0. The further left, the smaller the number.</p>`,
        `<p><strong>Find the start and the end.</strong> "Greater than −5" and "less than 3" leave out −5 and 3 themselves, so start one step right of −5 and stop one step left of 3.</p>`,
        `<p><strong>Write them from smallest to largest</strong>, with commas. Type a negative with the minus key.</p>
         ${ans('-4, -3, -2, -1, 0, 1, 2')}`
      )}
      ${tip('"From −5 to 3" would include −5 and 3. "Greater than" and "less than" do not. Do not forget 0: it is an integer too.')}`,

    // 6A Q4: < or >
    '6a-compare': `
      <p class="hp-tag">Worked example: which symbol goes in the box? <b>−6 □ −9</b></p>
      ${fig({ kind: 'numberline', min: -10, max: 1, divisions: 1, points: { '−9': -9, '−6': -6 } })}
      ${steps(
        `<p><strong>Find both numbers on a number line.</strong> −6 is to the right of −9.</p>`,
        `<p><strong>Further right means bigger.</strong> So −6 is greater than −9, even though 6 looks smaller than 9.</p>
         ${sum('−6 > −9')}
         ${ans('>')}`
      )}
      ${tip('The open mouth of the symbol faces the bigger number. Any positive number is bigger than any negative number, however big the negative looks: 1 > −1000.')}`,

    // 6A Q5: reading a temperature scale
    '6a-scale': `
      <p class="hp-tag">Worked example: what temperature does the red dot show?</p>
      ${fig({ kind: 'numberline', min: -40, max: 40, divisions: 0.05, points: dots([-30]), caption: 'Temperature (°C)' })}
      ${steps(
        `<p><strong>Work out what each gap is worth.</strong> The labels go −40, −20, 0, 20, 40, so each gap is 20 degrees.</p>`,
        `<p><strong>Find where the dot sits.</strong> It is halfway between −20 and −40. Half of 20 is 10.</p>`,
        `<p><strong>Count from −20, away from 0.</strong> 10 more degrees below −20 is −30.</p>
         ${ans('-30')}`
      )}
      ${tip('Below zero, the numbers grow in size as you go left: −30 °C is colder than −20 °C. Type the minus sign: -30.')}`,

    // 6A Q6: negative fractions and mixed numerals on a number line
    '6a-fraction': `
      <p class="hp-tag">Worked example: which number is shown by the dot?</p>
      ${fig({ kind: 'numberline', min: -4, max: -3, divisions: 6, points: dots([-3 - 5 / 6]) })}
      ${steps(
        `<p><strong>Count the gaps between the two whole numbers.</strong> There are 6, so each step is 1/6.</p>`,
        `<p><strong>Start at the whole number nearer to 0.</strong> That is −3. Count the steps from −3 towards −4: there are 5. So the dot is 5/6 further below zero than −3.</p>
         ${sum('−3 and another 5/6 below it = −3 5/6')}`,
        `<p><strong>Type a mixed numeral with the minus sign at the front</strong>, and a space before the fraction.</p>
         ${ans('-3 5/6')}`
      )}
      ${tip('Between 0 and −1 there is no whole number part. A dot 2 thirds to the left of 0 is just -2/3.')}`,

    // 6A Q7: ascending order
    '6a-order': `
      <p class="hp-tag">Worked example: put <b>−6, 8, −1, −13, 0, 4</b> in ascending order.</p>
      ${steps(
        `<p><strong>Sort them into negatives, zero and positives.</strong></p>
         ${chips(['−6, −1, −13', 'take'], ['0'], ['8, 4', 'add'])}`,
        `<p><strong>Order the negatives.</strong> The bigger a negative looks, the smaller it is, because it is further left.</p>
         ${sum('−13 < −6 < −1')}`,
        `<p><strong>Then 0, then the positives</strong>, smallest first.</p>
         ${ans('-13, -6, -1, 0, 4, 8')}`
      )}
      ${tip('Ascending means smallest first. Picture the number line and read the numbers from left to right.')}`,

    // 6A Q8: number patterns that cross zero
    '6a-pattern': `
      <p class="hp-tag">Worked example: write the next three numbers in <b>8, 3, −2, ...</b></p>
      ${steps(
        `<p><strong>Find the gap.</strong> 8 down to 3 is 5 less. 3 down to −2 is 5 less again.</p>`,
        `<p><strong>Keep going down by 5</strong>, straight past zero.</p>
         ${flow(['', '−2'], ['− 5', '−7'], ['− 5', '−12'], ['− 5', '−17'])}
         ${ans('-7, -12, -17')}`
      )}
      ${tip('If the numbers go up, add instead. −20, −14, −8 goes up by 6 each time, so the next two are −2 and 4.')}`,

    // 6A Q9: bank balance
    '6a-balance': `
      <p class="hp-tag">Worked example: find the final balance.</p>
      ${fig({ kind: 'table', rows: [['Start balance', '$40'], ['', '-$65'], ['', '$30'], ['', '-$50'], ['', '$10'], ['Final balance', '?']] })}
      ${steps(
        `<p><strong>Positive amounts are deposits</strong>, so add them. <strong>Negative amounts are withdrawals</strong>, so take them away.</p>`,
        `<p><strong>Work down the list</strong>, keeping a running total.</p>
         ${flow(['Start', '40'], ['− 65', '−25'], ['+ 30', '5'], ['− 50', '−45'], ['+ 10', '−35'])}`,
        `<p><strong>The total ends below zero</strong>, so the account is overdrawn.</p>
         ${ans('-35')}`
      )}
      ${tip('Do not type the $ sign. A balance below zero means the account owes money, so keep the minus: -35.')}`,

    // 6A Q10: heights above and below sea level
    '6a-sealevel': `
      <p class="hp-tag">Worked example: a diver is <b>25.5 m below</b> sea level. Write her height relative to sea level.</p>
      ${steps(
        `<p><strong>Sea level is 0.</strong> Above sea level is positive. Below sea level is negative.</p>`,
        `<p><strong>Below means a minus sign in front.</strong></p>
         ${ans('-25.5')}`
      )}
      ${tip('A bird 40 m above sea level is just 40. Sea level itself is 0, which is neither positive nor negative.')}`,

    // 6A Q11, Q12: the difference between two numbers, and opposites
    '6a-difference': `
      <p class="hp-tag">Worked example: find the difference between <b>−4</b> and <b>3</b>.</p>
      ${fig({ kind: 'numberline', min: -5, max: 4, divisions: 1, points: { '−4': -4, '3': 3 } })}
      ${steps(
        `<p><strong>Count from −4 up to 0.</strong> That is 4 steps.</p>`,
        `<p><strong>Count from 0 up to 3.</strong> That is 3 more steps.</p>`,
        `<p><strong>Add the two parts.</strong></p>
         ${sum('4 + 3 = 7')}
         ${ans('7')}`
      )}
      <p><strong>Opposites.</strong> 9 and −9 are each 9 steps from 0, on opposite sides, so they are 9 + 9 = 18 apart. Going backwards: if a number and its opposite are 22 apart, each one is half of 22 from 0, so the number could be 22 ÷ 2 = 11.</p>
      ${tip('If both numbers are negative, take the sizes away instead: −9 and −3 are 9 − 3 = 6 apart. A difference is a distance, so it is never negative.')}`,

    // 6A Q13: moves along a number line
    '6a-moves': `
      <p class="hp-tag">Worked example: start at 0. Make the moves <b>3, −7, 2, −1</b>. Where do you finish?</p>
      ${fig({ kind: 'numberline', min: -5, max: 4, divisions: 1, points: { Finish: -3 } })}
      ${steps(
        `<p><strong>A positive number moves right. A negative number moves left.</strong></p>`,
        `<p><strong>Keep a running total</strong>, one move at a time.</p>
         ${flow(['Start', '0'], ['+ 3', '3'], ['− 7', '−4'], ['+ 2', '−2'], ['− 1', '−3'])}
         ${ans('-3')}`
      )}
      ${tip('For a long list, add up all the right moves and all the left moves. Here 3 + 2 = 5 right and 7 + 1 = 8 left, so you finish 3 to the left of 0.')}`,

    // =====================================================================
    // 6B Adding and subtracting positive integers
    // =====================================================================
    // 6B Q1, Q2: a negative number add a positive number
    '6b-add': `
      <p class="hp-tag">Worked example: <b>−9 + 6</b></p>
      ${fig({ kind: 'numberline', min: -10, max: 1, divisions: 1, points: { Start: -9, End: -3 } })}
      ${steps(
        `<p><strong>Start at −9</strong> on the number line.</p>`,
        `<p><strong>Adding a positive number moves right.</strong> Jump 6 to the right.</p>
         ${sum('−9 + 6 = −3')}
         ${ans('-3')}`,
        `<p><strong>If the jump passes 0, split it.</strong> For −5 + 12, it takes 5 to reach 0, then 7 more.</p>
         ${sum('−5 + 12 = 7')}`
      )}
      ${tip('The answer takes the sign of the number with the bigger size. In −9 + 6, the 9 is bigger, so the answer is negative.')}`,

    // 6B Q3: subtracting a positive number
    '6b-subtract': `
      <p class="hp-tag">Worked example: <b>4 − 11</b></p>
      ${fig({ kind: 'numberline', min: -8, max: 5, divisions: 1, points: { Start: 4, End: -7 } })}
      ${steps(
        `<p><strong>Start at 4. Subtracting a positive number moves left.</strong> You need to jump 11 to the left.</p>`,
        `<p><strong>Split the jump at 0.</strong> 4 steps take you to 0, leaving 7 more.</p>
         ${sum('4 − 4 = 0<br>0 − 7 = −7')}
         ${ans('-7')}`,
        `<p><strong>Starting below zero?</strong> Keep going left, so the answer gets more negative.</p>
         ${sum('−5 − 9 = −14')}`
      )}
      ${tip('For bigger numbers like 23 − 61, swap them round: 61 − 23 = 38. You took away more than you had, so the answer is negative: -38.')}`,

    // 6B Q4: missing numbers
    '6b-missing': `
      <p class="hp-tag">Worked example: <b>−5 + □ = 3</b></p>
      ${steps(
        `<p><strong>Ask how far, and which way, it is from −5 to 3.</strong></p>
         ${sum('−5 to 0: 5 steps right<br>0 to 3: 3 steps right')}`,
        `<p><strong>That is 8 steps right altogether</strong>, so you add 8.</p>
         ${ans('8')}`,
        `<p><strong>Box at the front?</strong> For □ − 9 = −15, undo the take-away by adding 9.</p>
         ${sum('−15 + 9 = −6<br>Check: −6 − 9 = −15 ✓')}`
      )}
      ${tip('Always check by putting your answer into the box and working it out.')}`,

    // 6B Q5: several steps, left to right
    '6b-left-right': `
      <p class="hp-tag">Worked example: <b>6 − 10 + 3 − 7</b></p>
      ${steps(
        `<p><strong>Work from left to right</strong>, one step at a time.</p>
         ${flow(['Start', '6'], ['− 10', '−4'], ['+ 3', '−1'], ['− 7', '−8'])}`,
        `<p><strong>The last number is the answer.</strong></p>
         ${ans('-8')}`
      )}
      ${tip('Never start with the right-hand end. 6 − 10 + 3 is not 6 − 13.')}`,

    // 6B Q6, Q7: word problems with a start and a change
    '6b-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A freezer is at <span class="hp-hl">−18</span> °C. The power goes off and it <span class="hp-kw">warms up</span> by <span class="hp-hl">25</span> °C. Then it <span class="hp-kw">cools</span> by <span class="hp-hl">14</span> °C. What is the temperature now?</p>
      ${steps(
        `<p><strong>Look for the clue words.</strong></p>
         ${chips(['rises, warms, deposits → add', 'add'], ['falls, cools, withdraws → take away', 'take'])}`,
        `<p><strong>Start at −18 and add 25.</strong></p>
         ${sum('−18 + 25 = 7')}`,
        `<p><strong>Then take away 14.</strong></p>
         ${sum('7 − 14 = −7')}
         ${ans('-7')}`
      )}
      ${tip('"How much is still owed?" has a positive answer. Owing $250 and paying back $90 leaves $250 − $90 = $160 owed, so type 160.')}`,

    // 6B Q8, Q9: total change, and how far something moves
    '6b-change': `
      <p class="hp-tag">Worked example: water starts at <b>15 °C</b>, falls to <b>−4 °C</b>, then rises to <b>7 °C</b>. What is the total change?</p>
      ${steps(
        `<p><strong>Find each change.</strong> A fall counts as negative, a rise as positive.</p>
         ${sum('15 to −4: a fall of 15 + 4 = 19, so −19<br>−4 to 7: a rise of 4 + 7 = 11, so +11')}`,
        `<p><strong>Add up the changes.</strong></p>
         ${sum('−19 + 11 = −8')}
         ${ans('-8')}`
      )}
      <p><strong>How far did it move?</strong> From −90 m up to −35 m is 90 − 35 = 55 m. A distance is always positive.</p>
      ${tip('Check: the total change is also the end minus the start. 7 − 15 = −8.')}`,

    // 6B Q10: which calculation fits the description
    '6b-which': `
      <p class="hp-tag">Worked example: which calculation shows "a positive number subtract a positive number equals a positive number"?</p>
      ${chips(['3 − 11 = −8'], ['−11 + 3 = −8'], ['11 − 3 = 8'], ['−3 − 11 = −14'])}
      ${steps(
        `<p><strong>Check each part in order:</strong> the first number, the sign, the second number, then the answer.</p>`,
        `<p><strong>Cross off the ones that break a rule.</strong> 3 − 11 = −8 has a negative answer. −11 + 3 and −3 − 11 start with a negative number. Only one is left.</p>
         ${ans('11 − 3 = 8')}`
      )}
      ${tip('Check the calculation is correct as well as the signs.')}`,

    // 6B Q11: positive, negative or zero with letters
    '6b-signs': `
      <p class="hp-tag">Worked example: <b>p</b> and <b>q</b> are positive integers. Is <b>−p − q</b> positive, negative or zero?</p>
      ${steps(
        `<p><strong>Try some numbers.</strong> Take p = 10 and q = 6.</p>
         ${sum('−10 − 6 = −16, which is negative')}`,
        `<p><strong>Think about why.</strong> −p is already below zero, and taking away q moves further left. It can never get back to zero.</p>
         ${ans('Negative')}`
      )}
      <p><strong>Is it always true?</strong> To say no, one example that breaks it is enough. If q is positive, is q − 5 always negative? Try q = 8: 8 − 5 = 3, which is positive. So no.</p>
      ${tip('Try small and large values. If the question says which letter is bigger, make sure your numbers obey that.')}`,

    // 6B Q12: put + or − in the boxes
    '6b-boxes': `
      <p class="hp-tag">Worked example: put + or − in each box. <b>10 □ 4 □ 9 = −3</b></p>
      ${steps(
        `<p><strong>Try each choice, working left to right.</strong> Two boxes give four ways.</p>
         ${sum('10 + 4 + 9 = 23<br>10 + 4 − 9 = 5<br>10 − 4 + 9 = 15<br>10 − 4 − 9 = −3 ✓')}`,
        `<p><strong>Type the signs in order</strong>, with no spaces.</p>
         ${ans('--')}`
      )}
      ${tip('If the answer is much smaller than the first number, you will need some − signs. Letters work the same way: −x + x = 0.')}`,

    // =====================================================================
    // 6C Adding and subtracting negative integers
    // =====================================================================
    // 6C Q1, Q2: adding a negative number
    '6c-add-neg': `
      <p class="hp-tag">Worked example: <b>3 + (−8)</b></p>
      ${steps(
        `<p><strong>Adding a negative is the same as subtracting.</strong></p>
         ${sum('3 + (−8) = 3 − 8')}`,
        `<p><strong>Move 8 to the left of 3.</strong> 3 steps reach 0, then 5 more.</p>
         ${fig({ kind: 'numberline', min: -6, max: 4, divisions: 1, points: { Start: 3, End: -5 } })}
         ${ans('-5')}`,
        `<p><strong>Two negatives work the same way.</strong></p>
         ${sum('−5 + (−7) = −5 − 7 = −12')}`
      )}
      ${tip('Think of money: adding a debt of $8 makes you $8 poorer. Type the answer without brackets: -5.')}`,

    // 6C Q3: subtracting a negative number
    '6c-sub-neg': `
      <p class="hp-tag">Worked example: <b>5 − (−9)</b></p>
      ${steps(
        `<p><strong>Subtracting a negative is the same as adding.</strong> The two minus signs side by side become a plus.</p>
         ${flow(['Start', '5 − (−9)'], ['− − becomes +', '5 + 9'], ['Add', '14'])}
         ${ans('14')}`,
        `<p><strong>It works when you start below zero too.</strong></p>
         ${sum('−11 − (−4) = −11 + 4 = −7')}`
      )}
      ${tip('Taking away a debt makes you richer. Only change the two signs that sit next to each other.')}`,

    // 6C Q4: missing numbers
    '6c-missing': `
      <p class="hp-tag">Worked example: <b>5 − □ = 12</b></p>
      ${steps(
        `<p><strong>Notice the answer got bigger.</strong> Taking away only makes a number bigger when you take away a negative, so the box is negative.</p>`,
        `<p><strong>How far is it from 5 to 12?</strong> 7. So you must take away −7.</p>
         ${sum('5 − (−7) = 5 + 7 = 12 ✓')}
         ${ans('-7')}`,
        `<p><strong>Box at the front?</strong> For □ + (−5) = −1, adding −5 means taking 5, so undo it by adding 5.</p>
         ${sum('−1 + 5 = 4<br>Check: 4 + (−5) = −1 ✓')}`
      )}
      ${tip('Always check by putting your answer into the box.')}`,

    // 6C Q5: several steps, left to right
    '6c-left-right': `
      <p class="hp-tag">Worked example: <b>−6 − (−9) + (−8)</b></p>
      ${steps(
        `<p><strong>Change each pair of signs first.</strong></p>
         ${sum('− (−9) becomes + 9<br>+ (−8) becomes − 8<br>So it is −6 + 9 − 8')}`,
        `<p><strong>Work from left to right.</strong></p>
         ${flow(['Start', '−6'], ['+ 9', '3'], ['− 8', '−5'])}
         ${ans('-5')}`
      )}
      ${tip('Change one pair of signs at a time, and keep the numbers in the same order.')}`,

    // 6C Q6, Q7, Q8: word problems with depths and debts
    '6c-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A submarine starts at <span class="hp-hl">−150</span> m (150 m below sea level). It <span class="hp-kw">rises</span> <span class="hp-hl">65</span> m, then <span class="hp-kw">dives</span> <span class="hp-hl">90</span> m. Where is it now?</p>
      ${steps(
        `<p><strong>Turn the words into signs.</strong> Rising adds, diving or lowering takes away.</p>`,
        `<p><strong>Start at −150 and rise 65.</strong></p>
         ${sum('−150 + 65 = −85')}`,
        `<p><strong>Then dive 90.</strong></p>
         ${sum('−85 − 90 = −175')}
         ${ans('-175')}`
      )}
      ${tip('Debt is negative. "Debt is added" means add a negative. "Paid back" or "removed" makes the debt smaller. Type big answers with no spaces or $, like -12000.')}`,

    // 6C Q9: a profit table
    '6c-table': `
      <p class="hp-tag">Worked example: this table shows a shop's profit. Find the overall profit.</p>
      ${fig({ kind: 'table', rows: [['Month', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], ['Profit ($1000s)', '4', '-6', '2', '-3', '9']] })}
      ${steps(
        `<p><strong>A negative profit is a loss.</strong> To read one month, look under its name: October is −3, a loss of $3000.</p>`,
        `<p><strong>For the overall profit, add up every month.</strong></p>
         ${flow(['Jul', '4'], ['+ (−6)', '−2'], ['+ 2', '0'], ['+ (−3)', '−3'], ['+ 9', '6'])}
         ${ans('6')}`
      )}
      ${tip('The answer is in thousands of dollars, so type 6, not 6000.')}`,

    // 6C Q10: magic squares
    '6c-magic': `
      <p class="hp-tag">Worked example: complete this magic square.</p>
      ${fig({ kind: 'table', rows: [['Row 1', '-5', '?', '-1'], ['Row 2', '?', '-2', '?'], ['Row 3', '?', '?', '1']] })}
      ${steps(
        `<p><strong>Find a full line to get the magic sum.</strong> The diagonal −5, −2, 1 is complete.</p>
         ${sum('−5 + (−2) + 1 = −6')}`,
        `<p><strong>Fill a line with only one gap.</strong></p>
         ${sum('Row 1: −5 + ? + (−1) = −6, so ? = 0<br>Column 3: −1 + ? + 1 = −6, so ? = −6')}`,
        `<p><strong>Each new number opens up another line.</strong></p>
         ${sum('Other diagonal: −1 + (−2) + ? = −6, so ? = −3<br>Column 1: −5 + ? + (−3) = −6, so ? = 2<br>Row 3: −3 + ? + 1 = −6, so ? = −4')}
         ${ans('0, 2, -6, -3, -4')}`
      )}
      ${tip('Type the missing numbers in reading order: across Row 1, then Row 2, then Row 3. Check one more line at the end.')}`,

    // 6C Q11: words into calculations
    '6c-words': `
      <p class="hp-tag">Worked example: write <b>"−4 subtracted from 8"</b> as a calculation and work it out.</p>
      ${steps(
        `<p><strong>"Subtracted from 8" means you start at 8</strong> and take the other number away.</p>
         ${sum('8 − (−4)')}`,
        `<p><strong>Work it out.</strong> Taking away a negative means add.</p>
         ${sum('8 + 4 = 12')}
         ${ans('12')}`
      )}
      ${tip('"The sum of" means add. "The opposite of x" is written −x, so "5 add the opposite of x" is 5 + (−x).')}`,

    // 6C Q12: addition facts into subtraction facts
    '6c-facts': `
      <p class="hp-tag">Worked example: use <b>−9 + 2 = −7</b> to complete <b>−7 − (−9) = □</b>.</p>
      ${steps(
        `<p><strong>Every addition fact gives two subtraction facts.</strong> The total goes first.</p>
         ${flow(['Add', '−9 + 2 = −7'], ['Take away', '−7 − 2 = −9'], ['Take away', '−7 − (−9) = 2'])}`,
        `<p><strong>Check with the sign rule.</strong></p>
         ${sum('−7 − (−9) = −7 + 9 = 2 ✓')}
         ${ans('2')}`
      )}
      ${tip('This is why subtracting a negative is the same as adding: both give the same answer.')}`,

    // 6C Q13: strings of minus signs
    '6c-opposite': `
      <p class="hp-tag">Worked example: simplify <b>−(−(−(−(−2))))</b></p>
      ${steps(
        `<p><strong>Each minus sign flips the number</strong> to the other side of 0.</p>`,
        `<p><strong>Count the minus signs.</strong> There are 5.</p>`,
        `<p><strong>Two flips cancel out.</strong> Two pairs cancel, leaving one flip, so 2 becomes −2.</p>
         ${ans('-2')}`
      )}
      ${tip('An even number of minus signs gives a positive. An odd number gives a negative.')}`,

    // 6C Q14: is it always true?
    '6c-always': `
      <p class="hp-tag">Worked example: <b>n</b> is a negative number. Is <b>4 − n</b> always positive?</p>
      ${steps(
        `<p><strong>Try a small and a large negative.</strong></p>
         ${sum('n = −1: 4 − (−1) = 5<br>n = −20: 4 − (−20) = 24')}`,
        `<p><strong>Think about why.</strong> Taking away a negative adds its size, so the answer is always more than 4.</p>
         ${ans('Yes, always true')}`
      )}
      <p><strong>One example is enough for "no".</strong> Is n + 4 always negative? n = −2 gives 2, so no.</p>
      ${tip('Numbers like −1 and −100 are good at breaking a rule. Try both before you say "always".')}`,

    // 6C Q15: negative fractions
    '6c-fractions': `
      <p class="hp-tag">Worked example: <b>−1/5 − (−1/2)</b></p>
      ${steps(
        `<p><strong>Use the same sign rules as integers.</strong> Taking away a negative means add.</p>
         ${sum('−1/5 + 1/2')}`,
        `<p><strong>Make the denominators the same.</strong> 10 works for 5 and 2.</p>
         ${sum('−2/10 + 5/10')}`,
        `<p><strong>Work out the tops like integers.</strong> −2 + 5 = 3.</p>
         ${ans('3/10')}`
      )}
      ${tip('Type a negative mixed numeral with the minus at the front and a space before the fraction, like -1 2/7.')}`,

    // =====================================================================
    // 6D Multiplying and dividing integers
    // =====================================================================
    // 6D Q1, Q2: multiplying with negatives
    '6d-multiply': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">First number</span><span role="columnheader">Second number</span><span role="columnheader">Answer</span></div>
        <div class="hp-tr" role="row"><span role="cell">positive</span><span role="cell">positive</span><span role="cell">positive</span></div>
        <div class="hp-tr" role="row"><span role="cell">positive</span><span role="cell">negative</span><span role="cell">negative</span></div>
        <div class="hp-tr" role="row"><span role="cell">negative</span><span role="cell">positive</span><span role="cell">negative</span></div>
        <div class="hp-tr" role="row"><span role="cell">negative</span><span role="cell">negative</span><span role="cell">positive</span></div>
      </div>
      <p class="hp-tag">Worked example: <b>−7 × 9</b></p>
      ${steps(
        `<p><strong>Multiply the sizes</strong>, ignoring the signs.</p>
         ${sum('7 × 9 = 63')}`,
        `<p><strong>Decide the sign.</strong> One number is negative, so the answer is negative.</p>
         ${ans('-63')}`,
        `<p><strong>Two negatives give a positive.</strong></p>
         ${sum('−5 × (−11): 5 × 11 = 55, signs the same, so 55')}`
      )}
      ${tip('Same signs give a positive. Different signs give a negative.')}`,

    // 6D Q3, Q6: dividing with negatives, and the fraction line
    '6d-divide': `
      <p class="hp-tag">Worked example: <b>77 ÷ (−7)</b></p>
      ${steps(
        `<p><strong>Divide the sizes</strong>, ignoring the signs.</p>
         ${sum('77 ÷ 7 = 11')}`,
        `<p><strong>Decide the sign.</strong> The signs are different, so the answer is negative.</p>
         ${ans('-11')}`,
        `<p><strong>A fraction line means divide.</strong> −65/−5 means −65 ÷ (−5). Same signs, so positive.</p>
         ${sum('65 ÷ 5 = 13, so −65/−5 = 13')}`
      )}
      ${tip('Dividing uses the same sign rules as multiplying: same signs positive, different signs negative.')}`,

    // 6D Q4: several steps, left to right
    '6d-chain': `
      <p class="hp-tag">Worked example: <b>63 ÷ (−9) × (−2)</b></p>
      ${steps(
        `<p><strong>Work from left to right.</strong> Do the first step.</p>
         ${sum(now('63 ÷ (−9)') + ' × (−2) = −7 × (−2)')}`,
        `<p><strong>Then the next step.</strong> Two negatives give a positive.</p>
         ${sum('−7 × (−2) = 14')}
         ${ans('14')}`
      )}
      ${tip('Check the sign by counting the negatives. An even number of them gives a positive answer, an odd number gives a negative.')}`,

    // 6D Q9: which signs go in the boxes
    '6d-chain-signs': `
      <p class="hp-tag">Worked example: which signs go in the boxes? <b>−80 □ (−4) □ 3 = 60</b></p>
      ${steps(
        `<p><strong>Try both choices for the first box.</strong></p>
         ${sum('−80 × (−4) = 320<br>−80 ÷ (−4) = 20')}`,
        `<p><strong>Try both choices for the second box</strong> on each result, left to right.</p>
         ${sum('320 × 3 = 960, &nbsp;320 ÷ 3 is not a whole number<br>20 × 3 = 60 ✓, &nbsp;20 ÷ 3 is not a whole number')}
         ${ans('÷ then ×')}`
      )}
      ${tip('If the answer is small compared with the numbers, there is probably a ÷. Check the sign of your answer at the end too.')}`,

    // 6D Q5: missing numbers
    '6d-missing': `
      <p class="hp-tag">Worked example: <b>□ × (−8) = 40</b></p>
      ${steps(
        `<p><strong>Find the size first.</strong> What times 8 makes 40? 5.</p>`,
        `<p><strong>Then the sign.</strong> The answer 40 is positive, so the two signs must be the same. −8 is negative, so the box is negative.</p>
         ${sum('Check: −5 × (−8) = 40 ✓')}
         ${ans('-5')}`,
        `<p><strong>Dividing works the same way.</strong> For −99 ÷ □ = 11: 99 ÷ 9 = 11, and −99 and 11 have different signs, so the box is −9.</p>`
      )}
      ${tip('Size first, then sign. Always check by putting your answer into the box.')}`,

    // 6D Q7, Q12: powers of negative numbers
    '6d-squares': `
      <p class="hp-tag">Worked example: <b>(−9)²</b></p>
      ${steps(
        `<p><strong>Squared means multiply it by itself.</strong></p>
         ${sum('(−9)² = −9 × (−9)')}`,
        `<p><strong>Two negatives give a positive.</strong></p>
         ${sum('9 × 9 = 81')}
         ${ans('81')}`,
        `<p><strong>Odd powers stay negative.</strong> Pair them up as you go.</p>
         ${sum('(−3)³ = −3 × (−3) × (−3) = 9 × (−3) = −27')}`
      )}
      ${tip('A negative number to an even power is positive. To an odd power it is negative. Decimals follow the same rule: (−0.3)² = 0.09.')}`,

    // 6D Q8: integer pairs with a given product
    '6d-pairs': `
      <p class="hp-tag">Worked example: list every integer in a pair that multiplies to <b>−14</b>.</p>
      ${steps(
        `<p><strong>Find the positive pairs first.</strong></p>
         ${sum('1 × 14, &nbsp;2 × 7')}`,
        `<p><strong>For a negative answer, one number in each pair is negative.</strong> It can be either one.</p>
         ${sum('1 × (−14), −1 × 14, 2 × (−7), −2 × 7')}`,
        `<p><strong>List every integer once</strong>, smallest to largest, with commas.</p>
         ${ans('-14, -7, -2, -1, 1, 2, 7, 14')}`
      )}
      ${tip('For a positive answer, both numbers can be negative instead: 21 = 3 × 7 = −3 × (−7). So each factor still turns up with both signs.')}`,

    // 6D Q10: two numbers from a product (or quotient) and a difference
    '6d-product-diff': `
      <p class="hp-tag">Worked example: two numbers have a product of <b>−20</b> and a difference of <b>9</b>. Find both pairs.</p>
      ${steps(
        `<p><strong>List pairs that multiply to −20.</strong> One number must be negative.</p>
         ${sum('1 and −20, &nbsp;2 and −10, &nbsp;4 and −5, &nbsp;5 and −4, &nbsp;10 and −2, &nbsp;20 and −1')}`,
        `<p><strong>Test each difference</strong> (larger minus smaller).</p>
         ${sum('4 − (−5) = 9 ✓<br>5 − (−4) = 9 ✓')}
         ${ans('4, -5')} ${ans('5, -4')}`
      )}
      <p><strong>Quotients work the same way.</strong> First ÷ second = −4 with a difference of 25: 20 and −5 work, because 20 ÷ (−5) = −4 and 20 − (−5) = 25.</p>
      ${tip('The positive number minus the negative one adds their sizes, so look for two sizes that add to the difference.')}`,

    // 6D Q11: changing a number's sign
    '6d-opposite': `
      <p class="hp-tag">Worked example: what can you multiply any number by to <b>double it and change its sign</b>?</p>
      ${steps(
        `<p><strong>Try some numbers.</strong> 7 should become −14 and −5 should become 10.</p>`,
        `<p><strong>Find what works every time.</strong></p>
         ${sum('7 × (−2) = −14<br>−5 × (−2) = 10')}
         ${ans('-2')}`
      )}
      ${tip('Multiplying by a negative number always flips the sign. Dividing by a negative does too.')}`,

    // 6D Q13: multiplying terms with letters
    '6d-letters': `
      <p class="hp-tag">Worked example: simplify <b>−5a × 2b</b></p>
      ${steps(
        `<p><strong>Multiply the numbers</strong>, with their signs.</p>
         ${sum('−5 × 2 = −10')}`,
        `<p><strong>Write the letters next to each other.</strong> a × b is ab.</p>
         ${ans('-10ab')}`,
        `<p><strong>A letter on its own has a hidden 1.</strong> −a means −1 × a.</p>
         ${sum('−a × (−3b) = 3ab')}`
      )}
      ${tip('Write the number first, then the letters in alphabetical order.')}`,

    // 6D Q15: multiplying and dividing negative fractions
    '6d-fractions': `
      <p class="hp-tag">Worked example: <b>−5/14 × 7/10</b></p>
      ${steps(
        `<p><strong>Decide the sign first.</strong> One fraction is negative, so the answer is negative.</p>`,
        `<p><strong>Cancel before you multiply.</strong> 5 and 10 share 5, giving 1 and 2. 7 and 14 share 7, giving 1 and 2.</p>
         ${sum('1/2 × 1/2')}`,
        `<p><strong>Multiply tops and bottoms.</strong></p>
         ${sum('1 × 1 = 1, &nbsp;2 × 2 = 4')}
         ${ans('-1/4')}`
      )}
      <p><strong>Dividing:</strong> flip the second fraction and multiply. −3/5 ÷ (−9/10) = −3/5 × (−10/9). Same signs, so positive, and cancelling gives 2/3.</p>
      ${tip('Letters cancel just like numbers when the same one is on the top and the bottom. Improper fractions are fine, like -7/4.')}`,

    // =====================================================================
    // 6E Order of operations with integers
    // =====================================================================
    // 6E Q1, Q2, Q3: × and ÷ before + and −
    '6e-order': `
      <p class="hp-tag">Worked example: <b>9 − 4 × (−7)</b></p>
      ${steps(
        `<p><strong>Multiply and divide before you add and subtract.</strong></p>
         ${sum('9 − ' + now('4 × (−7)') + ' = 9 − (−28)')}`,
        `<p><strong>Now subtract.</strong> Taking away a negative means add.</p>
         ${sum('9 + 28 = 37')}
         ${ans('37')}`,
        `<p><strong>Two products?</strong> Do both of them first.</p>
         ${sum(now('−5 × 9') + ' + ' + now('33 ÷ (−11)') + ' = −45 + (−3) = −48')}`
      )}
      ${tip('Do × and ÷ from left to right as they come, then + and − from left to right.')}`,

    // 6E Q4: brackets first
    '6e-brackets': `
      <p class="hp-tag">Worked example: <b>−9 × (2 − 7)</b></p>
      ${steps(
        `<p><strong>Brackets first.</strong></p>
         ${sum('−9 × ' + now('(2 − 7)') + ' = −9 × (−5)')}`,
        `<p><strong>Then multiply.</strong> Two negatives give a positive.</p>
         ${sum('−9 × (−5) = 45')}
         ${ans('45')}`,
        `<p><strong>Brackets inside brackets?</strong> Start with the inside one.</p>
         ${sum('18 ÷ (2 − (−7)) = 18 ÷ 9 = 2')}`
      )}
      ${tip('The order is: brackets, then powers, then × and ÷, then + and −.')}`,

    // 6E Q5, Q6: money problems
    '6e-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A shop <span class="hp-kw">buys</span> hats for <span class="hp-hl">$9</span> each and <span class="hp-kw">sells</span> them for <span class="hp-hl">$5</span> each. It sells <span class="hp-hl">40</span> hats and pays <span class="hp-hl">$130</span> rent. What is its overall <span class="hp-kw">loss</span>?</p>
      ${steps(
        `<p><strong>Find the profit on one hat.</strong></p>
         ${sum('5 − 9 = −4, a loss of $4 per hat')}`,
        `<p><strong>Multiply by the number sold.</strong></p>
         ${sum('40 × (−4) = −160')}`,
        `<p><strong>Rent is another cost</strong>, so take it away.</p>
         ${sum('−160 − 130 = −290')}
         <p>The question asks for the loss, so type its size.</p>
         ${ans('290')}`
      )}
      ${tip('If the question asks for a balance, keep the minus sign: a balance of -50 is a debt. If it asks for the loss, type a positive number.')}`,

    // 6E Q7, Q8: where do the brackets go?
    '6e-insert': `
      <p class="hp-tag">Worked example: where do the brackets go to make <b>−11 + 5 × 7 = −42</b> true?</p>
      ${steps(
        `<p><strong>Try it with no brackets.</strong> × comes first.</p>
         ${sum('−11 + 35 = 24 ✗')}`,
        `<p><strong>Put brackets around the + part</strong>, so it happens first.</p>
         ${sum('(−11 + 5) × 7 = −6 × 7 = −42 ✓')}
         ${ans('(-11 + 5) × 7 = -42')}`
      )}
      ${tip('Brackets only change an answer when they make a + or − happen before a × or ÷. To count how many answers are possible, try brackets around each part in turn and list the different results.')}`,

    // 6E Q9: does removing the brackets change the answer?
    '6e-remove': `
      <p class="hp-tag">Worked example: if the brackets are removed, does <b>(−22 ÷ 2) + 7</b> change?</p>
      ${steps(
        `<p><strong>Ask what would be done first anyway.</strong> ÷ comes before +, so the brackets only wrap what was going to happen first.</p>
         ${sum('With or without: −11 + 7 = −4')}
         ${ans('No, it stays the same')}`,
        `<p><strong>Compare 7 × (−9 + 2).</strong> Here the brackets make the + happen first.</p>
         ${sum('With: 7 × (−7) = −49<br>Without: 7 × (−9) + 2 = −63 + 2 = −61')}
         <p>This one changes.</p>`
      )}
      ${tip('Brackets around a × or ÷ part never change anything. Brackets around a + or − part that sits next to a × or ÷ usually do.')}`,

    // 6E Q10: always true or false?
    '6e-always': `
      <p class="hp-tag">Worked example: is <b>(p ÷ q) ÷ r = p ÷ (q ÷ r)</b> always true?</p>
      ${steps(
        `<p><strong>Test it with numbers, including a negative.</strong> Take p = −99, q = 33, r = 3.</p>`,
        `<p><strong>Work out both sides.</strong></p>
         ${sum('Left: (−99 ÷ 33) ÷ 3 = −3 ÷ 3 = −1<br>Right: −99 ÷ (33 ÷ 3) = −99 ÷ 11 = −9')}`,
        `<p><strong>They are different</strong>, so it is not always true.</p>
         ${ans('False')}`
      )}
      ${tip('One example that fails is enough for "False". If several different tests, with negatives too, all agree, it is probably always true.')}`,

    // 6E Q11: positive or negative?
    '6e-sign': `
      <p class="hp-tag">Worked example: is <b>−6 × (−8) × 3 × (−1)</b> positive or negative?</p>
      ${steps(
        `<p><strong>You do not need the answer, just the sign.</strong> Count the negative numbers: −6, −8 and −1. That is 3.</p>`,
        `<p><strong>Each pair of negatives makes a positive.</strong> 3 is odd, so one negative is left over.</p>
         ${ans('Negative')}`
      )}
      ${tip('Division and powers work the same way: (−5)⁴ has four negatives, so it is positive. For a fraction, count the negatives on the top and bottom together.')}`,

    // 6E Q12, Q13: powers and the minus sign
    '6e-powers': `
      <p class="hp-tag">Worked example: <b>−6²</b> and <b>(−6)²</b></p>
      ${steps(
        `<p><strong>Powers come before the minus sign in front</strong>, unless there are brackets.</p>
         ${sum('−6² = −(6 × 6) = −36')}
         ${ans('-36')}`,
        `<p><strong>With brackets, the whole negative number is squared.</strong></p>
         ${sum('(−6)² = −6 × (−6) = 36')}`,
        `<p><strong>Powers inside brackets</strong> come before the rest of the bracket.</p>
         ${sum('(40 − 7²) × (−2) = (40 − 49) × (−2) = −9 × (−2) = 18')}`
      )}
      ${tip('On a calculator, put brackets around a negative number before you raise it to a power.')}`,

    // =====================================================================
    // 6F Substituting integers
    // =====================================================================
    // 6F Q1, Q2, Q3, Q4: substituting negative numbers
    '6f-sub': `
      <p class="hp-tag">Worked example: find <b>10 − 3x</b> when <b>x = −7</b>.</p>
      ${steps(
        `<p><strong>Swap the letter for its number, in brackets.</strong> 3x means 3 × x.</p>
         ${sum('10 − 3 × (−7)')}`,
        `<p><strong>Multiply first.</strong></p>
         ${sum('10 − ' + now('3 × (−7)') + ' = 10 − (−21)')}`,
        `<p><strong>Then subtract.</strong> Taking away a negative means add.</p>
         ${sum('10 + 21 = 31')}
         ${ans('31')}`
      )}
      <p><strong>Two letters:</strong> for 2x − y when x = −7 and y = 5, it is 2 × (−7) − 5 = −14 − 5 = −19.</p>
      ${tip('Always use brackets when you put in a negative number. They stop the minus sign getting lost.')}`,

    // 6F Q5: expressions with brackets
    '6f-brackets': `
      <p class="hp-tag">Worked example: find <b>(x + y) × xy</b> when <b>x = −7</b> and <b>y = 9</b>.</p>
      ${steps(
        `<p><strong>Swap each letter for its number.</strong> xy means x × y.</p>
         ${sum('(−7 + 9) × (−7) × 9')}`,
        `<p><strong>Brackets first.</strong></p>
         ${sum(now('(−7 + 9)') + ' = 2')}`,
        `<p><strong>Multiply from left to right.</strong></p>
         ${sum('2 × (−7) × 9 = −14 × 9 = −126')}
         ${ans('-126')}`
      )}
      ${tip('Work out every bracket before you multiply, and keep track of each minus sign.')}`,

    // 6F Q6, Q7, Q8: formulas in real life
    '6f-formula': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A lift's height above the ground is <span class="hp-hl">20 − 3t</span> metres, where t is the number of <span class="hp-kw">seconds</span> after it leaves the top floor. Find its height after <span class="hp-hl">8</span> seconds.</p>
      ${steps(
        `<p><strong>Put t = 8 into the formula.</strong></p>
         ${sum('20 − 3 × 8')}`,
        `<p><strong>Multiply first, then subtract.</strong></p>
         ${sum('20 − 24 = −4')}
         ${ans('-4')}
         <p>The lift is 4 m below the ground, down in the car park.</p>`,
        `<p><strong>A negative time means before.</strong> 1 second before it left the top floor, t = −1.</p>
         ${sum('20 − 3 × (−1) = 20 + 3 = 23 m')}`
      )}
      ${tip('Always ask if your answer makes sense in real life. A lift can go below ground, but some things, like the number of people on a bus, can never be negative.')}`,

    // 6F Q9, Q10: which expression gives the value?
    '6f-which': `
      <p class="hp-tag">Worked example: which expression equals <b>22</b> when <b>x = −11</b>?</p>
      ${chips(['x + 11'], ['−2x'], ['2x'], ['x − 11'])}
      ${steps(
        `<p><strong>Put x = −11 into every option.</strong></p>
         ${sum('x + 11 = −11 + 11 = 0<br>−2x = −2 × (−11) = 22 ✓<br>2x = 2 × (−11) = −22<br>x − 11 = −11 − 11 = −22')}`,
        `<p><strong>Pick the one that gives 22.</strong></p>
         ${ans('-2x')}`
      )}
      ${tip('Check every option, even after you find one that works, in case of a slip.')}`,

    // 6F Q12: converting temperatures with a formula
    '6f-fahrenheit': `
      <p class="hp-tag">Worked example: convert <b>41 °F</b> to °C, using °C = 5/9 × (°F − 32).</p>
      ${steps(
        `<p><strong>Brackets first.</strong></p>
         ${sum('41 − 32 = 9')}`,
        `<p><strong>Find 5/9 of it.</strong> Divide by 9, then multiply by 5.</p>
         ${sum('9 ÷ 9 = 1, &nbsp;1 × 5 = 5')}
         ${ans('5')}`,
        `<p><strong>Below 32 °F, the answer is negative.</strong> For 23 °F:</p>
         ${sum('23 − 32 = −9, &nbsp;−9 ÷ 9 = −1, &nbsp;−1 × 5 = −5')}`
      )}
      ${tip('To write a formula that goes the other way, undo each step in reverse order, using the opposite operation each time.')}`,

    // =====================================================================
    // 6G The Cartesian plane
    // =====================================================================
    // 6G Q1, Q2, Q4: reading coordinates
    '6g-read': `
      <p class="hp-tag">Worked example: write down the coordinates of J and K.</p>
      ${fig({ kind: 'plane', x: [-4, 4], y: [-4, 4], points: { J: [-4, 3], K: [2, -3], L: [-3, 0] } })}
      ${steps(
        `<p><strong>Start at the origin, O.</strong> Go across first: that is the x-coordinate. Left of O is negative.</p>`,
        `<p><strong>Then go up or down</strong> for the y-coordinate. Down is negative.</p>
         ${sum('J: 4 left, 3 up → (−4, 3)<br>K: 2 right, 3 down → (2, −3)')}`,
        `<p><strong>Type a point in brackets, x first, with a comma.</strong></p>
         ${ans('(-4, 3)')}`
      )}
      ${tip('A point on an axis has a 0. L is 3 left and not up or down at all, so L is (−3, 0).')}`,

    // 6G Q3: which letter is at a point
    '6g-find': `
      <p class="hp-tag">Worked example: which letter is at <b>(−2, −1)</b>?</p>
      ${fig({ kind: 'plane', x: [-3, 3], y: [-3, 3], points: { E: [1, -2], F: [-2, -1], G: [-1, 1] } })}
      ${steps(
        `<p><strong>x = −2:</strong> from O, go 2 to the left.</p>`,
        `<p><strong>y = −1:</strong> then go 1 down. The letter there is F.</p>
         ${ans('F')}`
      )}
      ${tip('(−2, −1) and (−1, −2) are different points. The first number always tells you how far across.')}`,

    // 6G Q5, Q6, Q14: tables of points that make a line
    '6g-pattern': `
      <p class="hp-tag">Worked example: use the rule <b>y = 4 − x</b> to fill in the table, then describe the points.</p>
      ${steps(
        `<p><strong>Put each x-value into the rule.</strong></p>
         ${sum('x = −2: 4 − (−2) = 6<br>x = −1: 4 − (−1) = 5<br>x = 0: 4 − 0 = 4, and so on')}
         ${fig({ kind: 'table', rows: [['x', '-2', '-1', '0', '1', '2'], ['y', '6', '5', '4', '3', '2']] })}`,
        `<p><strong>Plot the points (x, y).</strong> They all lie on a straight line.</p>
         ${fig({ kind: 'plane', x: [-3, 3], y: [0, 7], points: dots([[-2, 6], [-1, 5], [0, 4], [1, 3], [2, 2]]), path: [[-2, 6], [2, 2]] })}`,
        `<p><strong>Look at how y changes.</strong> Each time x goes up by 1, y goes down by 1. Type a fall as a negative number.</p>
         ${ans('-1')}`
      )}
      ${tip('When y goes up or down by the same amount every time x goes up by 1, the points always make a straight line.')}`,

    // 6G Q7: naming the shape
    '6g-shape': `
      <p class="hp-tag">Worked example: what shape do <b>A(−3, −2), B(1, −2), C(3, 2), D(−1, 2)</b> make?</p>
      ${fig({ kind: 'plane', x: [-4, 4], y: [-3, 3], points: { A: [-3, -2], B: [1, -2], C: [3, 2], D: [-1, 2] }, path: [[-3, -2], [1, -2], [3, 2], [-1, 2]], closed: true })}
      ${steps(
        `<p><strong>Plot the points and join them in order</strong>, then back to the start.</p>`,
        `<p><strong>Count squares to compare the sides.</strong> AB and DC are both flat and 4 long. AD and BC slope the same way and are the same length.</p>`,
        `<p><strong>Name it.</strong> Two pairs of parallel sides but no right angles.</p>
         ${ans('Parallelogram')}`
      )}
      ${tip('A trapezium has one pair of parallel sides. A kite has two pairs of equal sides that sit next to each other. An isosceles triangle has two equal sides.')}`,

    // 6G Q8: area of a rectangle from the origin
    '6g-area': `
      <p class="hp-tag">Worked example: a rectangle has corners at O and <b>A(−5, −3)</b>, with two sides on the axes. Find its area.</p>
      ${fig({ kind: 'plane', x: [-6, 1], y: [-4, 1], points: { A: [-5, -3] }, path: [[0, 0], [-5, 0], [-5, -3], [0, -3]], closed: true })}
      ${steps(
        `<p><strong>Find the width.</strong> From 0 across to −5 is 5 units.</p>`,
        `<p><strong>Find the height.</strong> From 0 down to −3 is 3 units.</p>`,
        `<p><strong>Multiply.</strong></p>
         ${sum('5 × 3 = 15')}
         ${ans('15')}`
      )}
      ${tip('Lengths are never negative. Use the sizes of the coordinates and ignore the signs.')}`,

    // 6G Q9: walking along grid lines
    '6g-walk': `
      <p class="hp-tag">Worked example: walk from <b>(−4, 2)</b> to <b>(−4, −3)</b>, then to <b>(5, −3)</b>, then to <b>(5, 1)</b>. Each square is 1 km. How far is that?</p>
      ${steps(
        `<p><strong>Each leg goes straight across or straight up or down</strong>, so only one coordinate changes.</p>`,
        `<p><strong>Find each leg.</strong> Crossing an axis means adding the two sizes.</p>
         ${sum('y: 2 to −3 is 2 + 3 = 5<br>x: −4 to 5 is 4 + 5 = 9<br>y: −3 to 1 is 3 + 1 = 4')}`,
        `<p><strong>Add the legs.</strong></p>
         ${sum('5 + 9 + 4 = 18')}
         ${ans('18')}`
      )}
      ${tip('If both numbers are on the same side of 0, take the sizes away instead: from −6 to −2 is 6 − 2 = 4.')}`,

    // 6G Q10, Q11: the missing coordinate of a point on a line
    '6g-line': `
      <p class="hp-tag">Worked example: <b>A(−6, 6)</b>, <b>B(−2, ?)</b> and <b>C(2, −4)</b> lie on a straight line. Find the y-coordinate of B.</p>
      ${fig({ kind: 'plane', x: [-7, 3], y: [-5, 7], points: { A: [-6, 6], B: [-2, 1], C: [2, -4] }, path: [[-6, 6], [2, -4]] })}
      ${steps(
        `<p><strong>Look at the x-coordinates.</strong> −6, −2, 2 go up in steps of 4, so B is exactly halfway between A and C.</p>`,
        `<p><strong>So y is halfway too.</strong> From 6 down to −4 is a fall of 10. Half of that is a fall of 5.</p>
         ${sum('6 − 5 = 1')}
         ${ans('1')}`
      )}
      ${tip('If B is not halfway, use the same fraction for y. If x moves a third of the way from A to C, y moves a third of the way too.')}`,

    // 6G Q12: distance from the origin
    '6g-distance': `
      <p class="hp-tag">Worked example: put <b>P(5, 5)</b>, <b>Q(−6, 0)</b> and <b>R(0, −7)</b> in order from closest to farthest from O.</p>
      ${fig({ kind: 'plane', x: [-7, 6], y: [-7, 6], points: { P: [5, 5], Q: [-6, 0], R: [0, -7] } })}
      ${steps(
        `<p><strong>Points on an axis are easy.</strong> Q is 6 from O and R is 7 from O.</p>`,
        `<p><strong>For a point off the axes, square both coordinates and add.</strong> Do the same for the others so you can compare. The smallest total is the closest.</p>
         ${sum('P: 5² + 5² = 25 + 25 = 50<br>Q: 6² = 36<br>R: 7² = 49')}`,
        `<p><strong>Order them by their totals.</strong> Type the letters with commas.</p>
         ${ans('Q, R, P')}`
      )}
      ${tip('A point can look close because its numbers are small, but going diagonally takes it further out. Squaring and adding takes care of that.')}`,

    // 6G Q13: quadrants
    '6g-quadrant': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Quadrant</span><span role="columnheader">x (across)</span><span role="columnheader">y (up)</span></div>
        <div class="hp-tr" role="row"><span role="cell">1, top right</span><span role="cell">positive</span><span role="cell">positive</span></div>
        <div class="hp-tr" role="row"><span role="cell">2, top left</span><span role="cell">negative</span><span role="cell">positive</span></div>
        <div class="hp-tr" role="row"><span role="cell">3, bottom left</span><span role="cell">negative</span><span role="cell">negative</span></div>
        <div class="hp-tr" role="row"><span role="cell">4, bottom right</span><span role="cell">positive</span><span role="cell">negative</span></div>
      </div>
      <p class="hp-tag">Worked example: which quadrant holds every point (a, b) where <b>a &gt; 0</b> and <b>b &lt; 0</b>?</p>
      ${steps(
        `<p><strong>a is the x-coordinate, b is the y-coordinate.</strong> a &gt; 0 is the right half. b &lt; 0 is the bottom half.</p>`,
        `<p><strong>Find where both are true.</strong> Right and bottom is quadrant 4.</p>
         ${ans('4')}`,
        `<p><strong>Only one condition?</strong> b &lt; 0 alone is the whole bottom half, which is quadrants 3 and 4. Type them with a comma: 3, 4.</p>`
      )}
      ${tip('For a rule like b &lt; a, test each point: is its y smaller than its x? For (−1, −5), −5 &lt; −1, so yes.')}`,
  });
})();
