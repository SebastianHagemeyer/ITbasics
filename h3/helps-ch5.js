/* H3 "How do I work this out?" panels for Chapter 5.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 5A to 5I. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 5A Place value and decimals
    // =====================================================================
    // 5A Q1, Q2: the value of one digit
    '5a-digit': `
      <p class="hp-tag">Worked example: what is the value of the <b>9</b> in <b>41.0598</b>?</p>
      ${steps(
        `<p><strong>Put the number in a place-value chart.</strong> After the point the columns are tenths, hundredths, thousandths, then ten-thousandths.</p>
         ${chart(['10', '1', '', '0.1', '0.01', '0.001', '0.0001'], ['4', '1', '.', '0', '5', '9', '8'], [5])}`,
        `<p><strong>Read the heading above your digit.</strong> The 9 is in the 0.001 column, the thousandths. So it is worth 9 thousandths.</p>
         ${sum('9 × 0.001 = 9/1000')}
         ${ans('9/1000')}`
      )}
      ${tip('Type the value as a fraction, like 9/1000. A digit before the point is worth a whole number: the 1 in 41.0598 is in the ones column, so it is worth just 1.')}`,

    // 5A Q3, Q4: tenths, hundredths and thousandths as decimals
    '5a-fraction': `
      <p class="hp-tag">Worked example: write <b>63/1000</b> and <b>12 7/100</b> as decimals.</p>
      ${steps(
        `<p><strong>The denominator tells you where the last digit goes.</strong> 1000 means thousandths, so the 3 goes in the 0.001 column.</p>
         ${chart(['1', '', '0.1', '0.01', '0.001'], ['', '.', '', '6', '3'], [4])}`,
        `<p><strong>Fill every empty column with a 0.</strong></p>
         ${chart(['1', '', '0.1', '0.01', '0.001'], ['0', '.', '0', '6', '3'], [0, 2])}
         ${ans('0.063')}`,
        `<p><strong>For a mixed numeral, the whole number goes before the point.</strong> 7/100 is 7 hundredths, so the 7 goes in the second place.</p>
         ${sum('12 7/100 = 12.07')}
         ${ans('12.07')}`
      )}
      ${tip('Count the zeros: 10 means 1 decimal place, 100 means 2, 1000 means 3. The number of digits after the point matches.')}`,

    // 5A Q13: decimals with a letter for a digit
    '5a-letters': `
      <p class="hp-tag">Worked example: <b>B</b> stands for a digit. Write <b>B/10 + B/1000</b> as a decimal.</p>
      ${steps(
        `<p><strong>Treat the letter just like a digit.</strong> B/10 is B tenths, so a B goes in the first place after the point. B/1000 is B thousandths, so a B goes in the third place.</p>
         ${chart(['1', '', '0.1', '0.01', '0.001'], ['', '.', 'B', '', 'B'], [2, 4])}`,
        `<p><strong>Fill the empty columns with 0.</strong></p>
         ${chart(['1', '', '0.1', '0.01', '0.001'], ['0', '.', 'B', '0', 'B'], [0, 3])}
         ${ans('0.B0B')}`
      )}
      ${tip('Type the letter as a capital in its place, like 0.B0B. A whole B on its own (not over 10, 100 or 1000) goes before the point.')}`,

    // 5A Q5, Q6: comparing two decimals
    '5a-compare': `
      <p class="hp-tag">Worked example: which is bigger, <b>5.38</b> or <b>5.083</b>?</p>
      ${steps(
        `<p><strong>Line up the decimal points</strong> and add zeros on the end so both have the same number of places. A zero on the end does not change the value.</p>
         ${sum('5.380<br>5.083')}`,
        `<p><strong>Compare column by column from the left.</strong> The ones are both 5. In the tenths, 3 beats 0, so you can stop.</p>
         ${sum(`5.${now('3')}80 &gt; 5.${now('0')}83`)}
         ${ans('5.38 &gt; 5.083')}`
      )}
      ${tip('More digits does not mean bigger: 5.083 is longer but smaller. ≤ means "less than or equal to". For fractions, give them the same denominator first: 3/10 is the same as 30/100.')}`,

    // 5A Q8, Q9, Q10: putting decimals in order
    '5a-order': `
      <p class="hp-tag">Worked example: write <b>7.29, 7.092, 7.9, 7.209</b> in ascending order.</p>
      ${steps(
        `<p><strong>Give them all the same number of places</strong> by adding zeros.</p>
         ${sum('7.290 &nbsp; 7.092 &nbsp; 7.900 &nbsp; 7.209')}`,
        `<p><strong>Compare from the left.</strong> All have 7 ones. Tenths: 7.092 has 0 (smallest) and 7.900 has 9 (largest). The other two both have 2 tenths, so look at the hundredths: 0 is less than 9.</p>
         ${chips(['7.092'], ['7.209'], ['7.290'], ['7.900'])}`,
        `<p><strong>Write them in their original form.</strong></p>
         ${ans('7.092, 7.209, 7.29, 7.9')}`
      )}
      ${tip('Ascending means smallest first; descending means largest first. Type the list with commas. If a question asks which day, answer with the day number, not the measurement.')}`,

    // 5A Q7: distance to the closest whole number
    '5a-nearest': `
      <p class="hp-tag">Worked example: find the difference between <b>17.994</b> and the whole number closest to it.</p>
      ${steps(
        `<p><strong>Find the two whole numbers it sits between.</strong> It is past halfway, so 18 is the closest.</p>
         ${line('17', '17.5', '18', '17.994', 99)}`,
        `<p><strong>Work out the gap.</strong> Think: what do I add to 17.994 to reach 18? 6 thousandths.</p>
         ${sum('18 − 17.994 = 0.006')}
         ${ans('0.006')}`
      )}
      ${tip('If the closest whole number is below, the gap is just the part after the point: 3.18 is 0.18 away from 3.')}`,

    // =====================================================================
    // 5B Rounding decimals
    // =====================================================================
    // 5B Q1, Q2, Q3, Q4: rounding to a number of decimal places
    '5b-round': `
      <p class="hp-tag">Worked example: round <b>52.6381</b> to 2 decimal places.</p>
      ${steps(
        `<p><strong>Count 2 places after the point and draw a line.</strong> The 3 is the last digit you keep.</p>
         ${sum('52.63 | 81')}`,
        `<p><strong>Look at the next digit only.</strong> It is 8. 5 or more rounds up; 4 or less leaves it alone.</p>
         ${line('52.63', '52.635', '52.64', '52.6381', 81)}`,
        `<p><strong>Round up the 3 to a 4 and drop the rest.</strong></p>
         ${ans('52.64')}`
      )}
      ${tip('If the kept digit is a 9, rounding up rolls over: 3.97 to 1 place is 4.0. Keep that 0, it shows 1 decimal place. (0) in brackets means the nearest whole number.')}`,

    // 5B Q5: rounding up through a row of 9s
    '5b-nines': `
      <p class="hp-tag">Worked example: round <b>26.9973</b> to 2 decimal places.</p>
      ${steps(
        `<p><strong>Draw the line after 2 places.</strong> The next digit is 7, so round up.</p>
         ${sum('26.99 | 73')}`,
        `<p><strong>Rounding 26.99 up means adding one hundredth.</strong> The 9s roll over like a car's odometer: 99 hundredths become a whole one.</p>
         ${sum('26.99 + 0.01 = 27.00')}`,
        `<p><strong>Keep the zeros</strong>, so the answer still has 2 decimal places.</p>
         ${ans('27.00')}`
      )}
      ${tip('27.00 says "correct to 2 decimal places". To 0 places, write just the whole number with no point.')}`,

    // 5B Q6, Q7: nearest whole number or nearest dollar
    '5b-whole': `
      <p class="hp-tag">Worked example: round <b>57.48</b> to the nearest whole number, and <b>$126.50</b> to the nearest dollar.</p>
      ${steps(
        `<p><strong>Look only at the first digit after the point.</strong> In 57.48 it is 4, so round down. The 8 after it makes no difference.</p>
         ${line('57', '57.5', '58', '57.48', 48)}
         ${ans('57')}`,
        `<p><strong>Same for money.</strong> In $126.50 the first digit after the point is 5, so round up.</p>
         ${sum('$126.50 → $127')}
         ${ans('127')}`
      )}
      ${tip('Type just the number of dollars, with no $ sign and no point.')}`,

    // 5B Q8: estimating a shopping bill
    '5b-estimate': `
      <p class="hp-tag">Worked example: Kai buys items costing <b>$3.85, $1.20, $6.49, $0.75, $4.60</b>.</p>
      ${steps(
        `<p><strong>Round each price to the nearest dollar.</strong></p>
         ${chips(['$3.85 → $4'], ['$1.20 → $1'], ['$6.49 → $6'], ['$0.75 → $1'], ['$4.60 → $5'])}`,
        `<p><strong>Keep a running total.</strong></p>
         ${flow(['$4', '4'], ['+ $1', '5'], ['+ $6', '11'], ['+ $1', '12'], ['+ $5', '17'])}
         ${ans('17')}`,
        `<p><strong>Compare with the real bill.</strong> If the real total is $16.89, the estimate is out by:</p>
         ${sum('17 − 16.89 = 0.11')}`
      )}
      ${tip('Type money without the $ sign. A difference in cents is still written in dollars, like 0.11.')}`,

    // 5B Q9: rounding times, then comparing
    '5b-timing': `
      <p class="hp-tag">Worked example: two runners' times, correct to 2 decimal places, are <b>12.47 s</b> and <b>12.83 s</b>.</p>
      ${steps(
        `<p><strong>To the nearest second</strong>, round both first, then subtract.</p>
         ${sum('12 s and 13 s: difference 1 s')}`,
        `<p><strong>To the nearest tenth</strong>, round both to 1 place, then subtract. To 2 places, just subtract the times you have.</p>
         ${sum('12.5 and 12.8: difference 0.3 s<br>12.83 − 12.47 = 0.36 s')}`,
        `<p><strong>The quickest the first runner could have been:</strong> the smallest number that still rounds to 12.47. That is halfway between 12.46 and 12.47.</p>
         ${ans('12.465')}`
      )}
      ${tip('A rounded time hides some digits. Anything from 12.465 up to just below 12.475 rounds to 12.47.')}`,

    // 5B Q10: rounding money to the nearest cent
    '5b-money': `
      <p class="hp-tag">Worked example: Ana buys <b>25.6 L</b> of fuel at <b>158.9 cents per litre</b>.</p>
      ${steps(
        `<p><strong>Multiply, then change cents to dollars</strong> by dividing by 100.</p>
         ${sum('25.6 × 158.9 = 4067.84 cents = $40.6784')}`,
        `<p><strong>The nearest cent is 2 decimal places of a dollar.</strong> The next digit is 8, so round up.</p>
         ${sum('$40.67 | 84 → $40.68')}
         ${ans('40.68')}`,
        `<p><strong>If the price is rounded first</strong>, 158.9 cents becomes $1.59, and the total changes a little.</p>
         ${sum('25.6 × 1.59 = 40.704 → $40.70<br>40.70 − 40.68 = 0.02')}`
      )}
      ${tip('Rounding early changes the answer. Only round at the very end unless the question tells you to round first.')}`,

    // 5B Q11, Q12: how many places to work out before rounding
    '5b-check': `
      <p class="hp-tag">Worked example: work out <b>22.739 ÷ 6</b>, correct to 1 decimal place.</p>
      ${steps(
        `<p><strong>To round to 1 place, you need to know the 2nd place.</strong> So divide until you have 2 decimal places.</p>
         ${bus('6', ['2', '2', '.', '7', '3'], ['0', '3', '.', '7', '8'], ['', '2', '', '4', '5'], '...')}`,
        `<p><strong>The 2nd place is 8, so round up.</strong></p>
         ${sum('3.7 | 8 → 3.8')}
         ${ans('3.8')}`
      )}
      <p><strong>Only the very next digit decides.</strong> 2.4499 to 1 place: the next digit is 4, so it is 2.4. The 9s further along do not count.</p>
      ${tip('Always work out one more decimal place than you are rounding to.')}`,

    // =====================================================================
    // 5C Adding and subtracting decimals
    // =====================================================================
    // 5C Q1, Q2: adding decimals in columns
    '5c-add': `
      <p class="hp-tag">Worked example: <b>5.37 + 12.8 + 0.465</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '', '1', '', '1', '', ''] },
        { cells: d('  5.370') },
        { cells: d(' 12.800') },
        { cells: d('+ 0.465') },
        { kind: 'res', cells: d(' 18.635') }
      ])}
      ${steps(
        `<p><strong>Line up the decimal points</strong>, one under the other. Fill the gaps at the end with zeros so every number has 3 places.</p>`,
        `<p><strong>Add from the right, carrying as usual.</strong></p>
         ${sum('7 + 0 + 6 = 13: write 3, carry 1<br>3 + 8 + 4 + 1 = 16: write 6, carry 1')}`,
        `<p><strong>Put the point in the answer straight under the other points.</strong></p>
         ${ans('18.635')}`
      )}
      ${tip('A whole number has its point at the end: 7 is 7.0, or 7.00.')}`,

    // 5C Q3, Q4: subtracting decimals in columns
    '5c-sub': `
      <p class="hp-tag">Worked example: <b>52.4 − 17.86</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '4', '11', '', '13', '10'] },
        { cells: ['', '~5', '~2', '.', '~4', '~0'] },
        { cells: d('−17.86') },
        { kind: 'res', cells: d(' 34.54') }
      ])}
      ${steps(
        `<p><strong>Line up the points and fill the gap with a zero</strong>: 52.4 becomes 52.40.</p>`,
        `<p><strong>Subtract from the right, trading when the top digit is too small.</strong></p>
         ${sum('Hundredths: 10 − 6 = 4<br>Tenths: 13 − 8 = 5<br>Ones: 11 − 7 = 4<br>Tens: 4 − 1 = 3')}
         ${ans('34.54')}`
      )}
      ${tip('Check by adding: 34.54 + 17.86 = 52.40.')}`,

    // 5C Q5: missing digits in an addition
    '5c-missing': `
      <p class="hp-tag">Worked example: find the missing digits.</p>
      ${algo([
        { cells: ['', '3', '.', '□', '7'] },
        { cells: ['+', '□', '.', '6', '□'] },
        { kind: 'res', cells: ['', '8', '.', '2', '3'] }
      ])}
      ${steps(
        `<p><strong>Start at the right.</strong> Hundredths: 7 + □ ends in 3. Only 7 + 6 = 13 works, so □ = 6, carry 1.</p>`,
        `<p><strong>Tenths:</strong> □ + 6 + 1 (the carry) ends in 2. 5 + 6 + 1 = 12, so □ = 5, carry 1.</p>`,
        `<p><strong>Ones:</strong> 3 + □ + 1 = 8, so □ = 4. Check: 3.57 + 4.66 = 8.23.</p>
         ${ans('5, 4, 6')}`
      )}
      ${tip('Type the digits in reading order: top row left to right, then the next row, with commas.')}`,

    // 5C Q6, Q7, Q8, Q10: word problems
    '5c-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Sienna has <span class="hp-hl">$80</span>. She buys a book for <span class="hp-hl">$24.95</span> and a pen for <span class="hp-hl">$6.40</span>. How much money does she have <span class="hp-kw">left</span>?</p>
      ${chips(['total, altogether → add', 'add'], ['left, more, change, greater than → take away', 'take'])}
      ${steps(
        `<p><strong>Add what she spends.</strong></p>
         ${sum('24.95 + 6.40 = 31.35')}`,
        `<p><strong>Take that away from what she started with.</strong> Write $80 as 80.00 so the points line up.</p>
         ${sum('80.00 − 31.35 = 48.65')}
         ${ans('48.65')}`
      )}
      ${tip('"How much greater is A than B?" means A − B. Money answers have 2 decimal places, like 48.65.')}`,

    // 5C Q9: completing an addition table
    '5c-table': `
      <p class="hp-tag">Worked example: complete this addition table.</p>
      ${fig({ kind: 'table', rows: [['+', '0.5', '2.14'], ['0.09', '?', '?'], ['1.6', '?', '3.74']] })}
      ${steps(
        `<p><strong>Each cell is the row start plus the column top.</strong> In the 0.09 row:</p>
         ${sum('0.09 + 0.5 = 0.59<br>0.09 + 2.14 = 2.23')}
         ${ans('0.59, 2.23')}`,
        `<p><strong>In the 1.6 row</strong>, check the given cell, then fill the gap.</p>
         ${sum('1.6 + 2.14 = 3.74 ✓<br>1.6 + 0.5 = 2.1')}
         ${ans('2.1')}`
      )}
      ${tip('Give the missing numbers from left to right, with commas. Write 1.6 as 1.60 when you add it to a number with 2 places.')}`,

    // 5C Q11: one addition fact gives two subtraction facts
    '5c-facts': `
      <p class="hp-tag">Worked example: <b>6.25 + 1.8 = 8.05</b>. Complete <b>8.05 − 6.25 = □</b> and <b>8.05 − 1.8 = □</b>.</p>
      ${steps(
        `<p><strong>The biggest number is the whole.</strong> The other two are its parts.</p>
         ${flow(['Part', '6.25'], ['Part', '1.8'], ['Whole', '8.05'])}`,
        `<p><strong>Whole take away one part leaves the other part.</strong></p>
         ${sum('8.05 − 6.25 = 1.8<br>8.05 − 1.8 = 6.25')}
         ${ans('1.8, 6.25')}`
      )}
      ${tip('No column working needed: every number you need is already in the addition fact.')}`,

    // 5C Q12: is it possible? (yes or no)
    '5c-reason': `
      <p class="hp-tag">Worked example: can two numbers with 2 decimal places add up to a number with only 1 decimal place?</p>
      ${steps(
        `<p><strong>Try an example.</strong> Pick last digits that add to 10, so they make a whole tenth.</p>
         ${sum('0.35 + 0.15 = 0.50 = 0.5')}`,
        `<p><strong>One example that works is enough to say yes.</strong> To say no, you would need a reason it can never happen.</p>
         ${ans('Yes')}`
      )}
      ${tip('For the digits after the point to vanish, the end digits must add up to make a 10 (or a 0), so they carry.')}`,

    // 5C Q14: the reverse-and-add money trick
    '5c-trick': `
      <p class="hp-tag">Worked example: start with <b>$52.17</b>.</p>
      ${steps(
        `<p><strong>Reverse the digits</strong>, then subtract the smaller amount from the larger.</p>
         ${sum('52.17 reversed is 71.25<br>71.25 − 52.17 = 19.08')}`,
        `<p><strong>Reverse that answer and add the two.</strong> Keep the point in the same place, two digits from the end.</p>
         ${sum('19.08 reversed is 80.91<br>19.08 + 80.91 = 99.99')}
         ${ans('99.99')}`
      )}
      ${tip('Keep every digit when you reverse, zeros too: 19.08 has the digits 1, 9, 0, 8, so it becomes 80.91.')}`,

    // =====================================================================
    // 5D Multiplying and dividing by 10, 100, 1000 etc.
    // =====================================================================
    // 5D Q1, Q2: multiplying by 10, 100, 1000 ...
    '5d-times': `
      <p class="hp-tag">Worked example: <b>4.0716 × 1000</b></p>
      ${steps(
        `<p><strong>Count the zeros.</strong> 1000 has 3 zeros, so every digit moves 3 places to the left (the number gets bigger).</p>
         ${chart(['1000', '100', '10', '1', '', '0.1', '0.01', '0.001', '0.0001'], ['', '', '', '4', '.', '0', '7', '1', '6'])}
         ${chart(['1000', '100', '10', '1', '', '0.1', '0.01', '0.001', '0.0001'], ['4', '0', '7', '1', '.', '6', '', '', ''], [0, 1, 2, 3])}`,
        `<p><strong>Read the new number.</strong> It is the same as moving the point 3 places right.</p>
         ${ans('4071.6')}`
      )}
      ${tip('If you run out of digits, fill with zeros: 7.6 × 1000 = 7600. 10&nbsp;000 has 4 zeros, so it moves 4 places.')}`,

    // 5D Q3: dividing by 10, 100, 1000 ...
    '5d-divide': `
      <p class="hp-tag">Worked example: <b>58.3 ÷ 1000</b></p>
      ${steps(
        `<p><strong>Count the zeros.</strong> 1000 has 3, so every digit moves 3 places to the right (the number gets smaller).</p>
         ${chart(['10', '1', '', '0.1', '0.01', '0.001', '0.0001'], ['5', '8', '.', '3', '', '', ''])}
         ${chart(['10', '1', '', '0.1', '0.01', '0.001', '0.0001'], ['', '0', '.', '0', '5', '8', '3'], [1, 3])}`,
        `<p><strong>Read the new number.</strong> It is the same as moving the point 3 places left. Fill the gaps with zeros, and put a 0 in front of the point.</p>
         ${sum('58.3 → 0.0583')}
         ${ans('0.0583')}`
      )}
      ${tip('Check the size: dividing 58.3 by 1000 must give something much smaller, less than 1.')}`,

    // 5D Q4, Q5: a mix, including whole numbers
    '5d-mixed': `
      <p class="hp-tag">Worked example: <b>309 ÷ 100</b> and <b>72 × 1000</b></p>
      ${steps(
        `<p><strong>A whole number has a hidden point at the end.</strong> Write it in.</p>
         ${sum('309 = 309.')}`,
        `<p><strong>÷ 100 moves the point 2 places left.</strong></p>
         ${sum('309. → 3.09')}
         ${ans('3.09')}`,
        `<p><strong>× 1000 moves it 3 places right.</strong> There are no digits after the point, so each move adds a zero.</p>
         ${sum('72 × 1000 = 72&nbsp;000')}
         ${ans('72000')}`
      )}
      ${tip('× makes the number bigger, ÷ makes it smaller. Decide which way before you move anything. Big answers can be typed with no spaces.')}`,

    // 5D Q6: order of operations
    '5d-order': `
      <p class="hp-tag">Worked example: <b>4.6 × 100 − 52 ÷ 10</b></p>
      ${steps(
        `<p><strong>Do × and ÷ before + and −.</strong></p>
         ${sum(`${now('4.6 × 100')} − ${now('52 ÷ 10')} = 460 − 5.2`)}`,
        `<p><strong>Then the take-away.</strong></p>
         ${sum('460 − 5.2 = 454.8')}
         ${ans('454.8')}`
      )}
      <p><strong>Brackets come first.</strong> A number next to a bracket means multiply.</p>
      ${sum('10(0.8 + 63 ÷ 100) = 10(0.8 + 0.63) = 10 × 1.43 = 14.3')}
      ${tip('Inside the brackets, the same order applies: ÷ before +.')}`,

    // 5D Q7 to Q11: word problems
    '5d-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A pencil weighs <span class="hp-hl">0.0072 kg</span>. An empty pencil box weighs <span class="hp-hl">0.035 kg</span>. Find the total weight of <span class="hp-hl">10</span> boxes, each holding <span class="hp-hl">100</span> pencils.</p>
      ${steps(
        `<p><strong>Pencils in one box:</strong> × 100 moves the point 2 places right.</p>
         ${sum('0.0072 × 100 = 0.72 kg')}`,
        `<p><strong>Add the box.</strong></p>
         ${sum('0.72 + 0.035 = 0.755 kg')}`,
        `<p><strong>Ten full boxes.</strong></p>
         ${sum('0.755 × 10 = 7.55 kg')}
         ${ans('7.55')}`
      )}
      ${chips(['1 L = 1000 mL'], ['1 kg = 1000 g'], ['$1 = 100 cents'])}
      ${tip('To change cents to dollars, divide by 100. Money answers have 2 decimal places, so $60 is typed 60.00.')}`,

    // 5D Q12, Q13: which power of 10 was used?
    '5d-power': `
      <p class="hp-tag">Worked example: what turns <b>4.217</b> into <b>4217</b>?</p>
      ${steps(
        `<p><strong>Count how many places the point moved.</strong> 4.217 → 4217 is 3 places to the right. Right means bigger, so multiply.</p>
         ${ans('× 1000')}`,
        `<p><strong>For a chain of steps, keep track of the point.</strong> Start with 56.2, do × 1000, ÷ 100, ÷ 10, then one more step to reach 0.562.</p>
         ${flow(['Start', '56.2'], ['× 1000', '56&nbsp;200'], ['÷ 100', '562'], ['÷ 10', '56.2'], ['?', '0.562'])}`,
        `<p><strong>Compare the last two.</strong> 56.2 → 0.562 is 2 places left, so divide by 100.</p>
         ${ans('÷ 100')}`
      )}
      ${tip('One place for each zero. Left means smaller, so it is a ÷.')}`,

    // 5D Q14: standard form
    '5d-standard': `
      <p class="hp-tag">Worked example: write <b>2&nbsp;400&nbsp;000</b> in standard form.</p>
      ${steps(
        `<p><strong>Put the point after the first digit</strong> to get a number between 1 and 10: 2.4.</p>`,
        `<p><strong>Count how many places the point moved.</strong> From the end of 2&nbsp;400&nbsp;000 to after the 2 is 6 places.</p>
         ${sum('2&nbsp;400&nbsp;000 = 2.4 × 10^6')}
         ${ans('2.4×10^6')}`,
        `<p><strong>To multiply big numbers, use a calculator.</strong> For 60&nbsp;000 × 900&nbsp;000 the screen shows 5.4E10, which means 5.4 × 10^10.</p>
         ${sum('60&nbsp;000 × 900&nbsp;000 = 5.4E10 = 5.4 × 10^10')}
         <p>No calculator? Ignore the zeros and multiply 6 × 9 = 54, then put back all 4 + 5 = 9 zeros: 54&nbsp;000&nbsp;000&nbsp;000. Now write that in standard form, as in step 2.</p>`
      )}
      ${tip('Type it like 5.4x10^10. The front number must be between 1 and 10, so 54 followed by zeros becomes 5.4 × 10^ something.')}`,

    // =====================================================================
    // 5E Multiplying decimals
    // =====================================================================
    // 5E Q1, Q10: estimating by rounding to whole numbers
    '5e-estimate': `
      <p class="hp-tag">Worked example: estimate <b>8.7 × 1.9</b></p>
      ${steps(
        `<p><strong>Round each number to the nearest whole number</strong>, then multiply.</p>
         ${sum('8.7 → 9 &nbsp; 1.9 → 2<br>9 × 2 = 18')}
         ${ans('18')}`,
        `<p><strong>Is the real answer higher or lower?</strong> Both numbers were rounded up, so the estimate is too big. The real answer is lower (it is 16.53).</p>`
      )}
      ${chips(['Both rounded up → real answer lower', 'take'], ['Both rounded down → real answer higher', 'add'])}
      ${tip('If one is rounded up and one down, look at which change is bigger, or work it out.')}`,

    // 5E Q2: a decimal times a whole number
    '5e-by-whole': `
      <p class="hp-tag">Worked example: <b>5.86 × 4</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '', '3', '', '2', ''] },
        { cells: d('  5.86') },
        { cells: d('×    4') },
        { kind: 'res', cells: d(' 23.44') }
      ])}
      ${steps(
        `<p><strong>Multiply as if there were no point.</strong> Start from the right and carry.</p>
         ${sum('586 × 4 = 2344')}`,
        `<p><strong>Put the point back.</strong> 5.86 has 2 decimal places, so the answer has 2 as well.</p>
         ${ans('23.44')}`
      )}
      ${tip('Check with an estimate: 6 × 4 = 24, and 23.44 is close.')}`,

    // 5E Q3: decimal times decimal
    '5e-decimals': `
      <p class="hp-tag">Worked example: <b>3.7 × 0.26</b></p>
      ${steps(
        `<p><strong>Ignore the points and multiply the whole numbers</strong>, the usual long multiplication way.</p>
         ${algo([
           { cells: d('  37') },
           { cells: d('× 26') },
           { kind: 'res', cells: d(' 222'), note: '37 × 6' },
           { cells: d('+740'), note: '37 × 20' },
           { kind: 'res', cells: d(' 962') }
         ])}`,
        `<p><strong>Count the decimal places in the question.</strong> 3.7 has 1 and 0.26 has 2, so 3 altogether.</p>`,
        `<p><strong>Give the answer 3 decimal places.</strong></p>
         ${sum('962 → 0.962')}
         ${ans('0.962')}`
      )}
      ${tip('Short of digits? Put zeros in front: 0.2 × 0.03 is 2 × 3 = 6, with 3 places, so 0.006.')}`,

    // 5E Q4: multiplying by multiples of 10
    '5e-tens': `
      <p class="hp-tag">Worked example: <b>2.47 × 300</b></p>
      ${steps(
        `<p><strong>Split the multiple of 10.</strong></p>
         ${sum('300 = 3 × 100')}`,
        `<p><strong>Multiply by the 3 first, then by 100.</strong></p>
         ${flow(['Start', '2.47'], ['× 3', '7.41'], ['× 100', '741'])}
         ${ans('741')}`
      )}
      ${tip('× 5000 is × 5 then × 1000. Do the small multiply first, then move the point.')}`,

    // 5E Q5: multiply, then round to the nearest dollar
    '5e-money': `
      <p class="hp-tag">Worked example: <b>$5.35 × 2.6</b>, to the nearest dollar</p>
      ${steps(
        `<p><strong>Multiply without the points.</strong></p>
         ${sum('535 × 26 = 13&nbsp;910')}`,
        `<p><strong>Count decimal places: 2 + 1 = 3.</strong></p>
         ${sum('13.910 = $13.91')}`,
        `<p><strong>Round to the nearest dollar.</strong></p>
         ${line('13', '13.5', '14', '13.91', 91)}
         ${ans('14')}`
      )}
      ${tip('Get the exact amount first, then round. Type just the dollars, like 14.')}`,

    // 5E Q6, Q7, Q8, Q9, Q14: word problems
    '5e-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Rope costs <span class="hp-hl">$2.65</span> <span class="hp-kw">per</span> metre. Jai needs <span class="hp-hl">14</span> pieces, <span class="hp-kw">each</span> <span class="hp-hl">1.5 m</span> long. What does the rope cost?</p>
      ${steps(
        `<p><strong>"Each" and "per" mean multiply.</strong> First find the total length.</p>
         ${sum('14 × 1.5 = 21 m')}`,
        `<p><strong>Then the cost.</strong></p>
         ${sum('21 × 2.65 = 55.65')}
         ${ans('55.65')}`
      )}
      ${tip('Watch for hidden numbers, like the days in a month. For a shopping bill, multiply each line, then add. "Can it make the trip?" means work out how far it can go and compare.')}`,

    // 5E Q13: using a whole-number fact
    '5e-fact': `
      <p class="hp-tag">Worked example: <b>56 × 43 = 2408</b>. What is <b>5.6 × 0.43</b>?</p>
      ${steps(
        `<p><strong>The digits stay the same.</strong> Only the point moves.</p>`,
        `<p><strong>Count decimal places:</strong> 5.6 has 1 and 0.43 has 2, so the answer has 3.</p>
         ${sum('2408 → 2.408')}
         ${ans('2.408')}`
      )}
      ${tip('Check with an estimate: 6 × 0.4 = 2.4. Zeros at the end drop off: since 25 × 4 = 100, 2.5 × 0.4 = 1.00 = 1.')}`,

    // =====================================================================
    // 5F Dividing decimals
    // =====================================================================
    // 5F Q1, Q2: decimal divided by a whole number
    '5f-short': `
      <p class="hp-tag">Worked example: <b>9.276 ÷ 4</b></p>
      ${bus('4', ['9', '.', '2', '7', '6'], ['2', '.', '3', '1', '9'], ['', '', '1', '', '3'], '')}
      ${steps(
        `<p><strong>Put the point in the answer straight above the point</strong> in the number.</p>`,
        `<p><strong>Divide digit by digit</strong>, carrying remainders as usual.</p>
         ${sum('9 ÷ 4 = 2 r 1<br>12 ÷ 4 = 3<br>7 ÷ 4 = 1 r 3<br>36 ÷ 4 = 9')}
         ${ans('2.319')}`
      )}
      ${tip('If there is a remainder at the end, add a 0 and keep going: 7.3 ÷ 4 is 7.300 ÷ 4 = 1.825.')}`,

    // 5F Q3, Q4: dividing by a decimal
    '5f-by-decimal': `
      <p class="hp-tag">Worked example: <b>4.692 ÷ 0.06</b></p>
      ${steps(
        `<p><strong>Make the divisor a whole number.</strong> Move both points 2 places right (× 100). The answer does not change.</p>
         ${sum('4.692 ÷ 0.06 = 469.2 ÷ 6')}`,
        `<p><strong>Now divide by the whole number.</strong></p>
         ${bus('6', ['4', '6', '9', '.', '2'], ['0', '7', '8', '.', '2'], ['', '4', '4', '', '1'], '')}
         ${ans('78.2')}`
      )}
      ${tip('Both numbers move the same number of places, just like 12 ÷ 3 = 120 ÷ 30.')}`,

    // 5F Q5: dividing by multiples of 10
    '5f-tens': `
      <p class="hp-tag">Worked example: <b>74.4 ÷ 300</b></p>
      ${steps(
        `<p><strong>Split the divisor.</strong></p>
         ${sum('300 = 3 × 100')}`,
        `<p><strong>Divide by 3, then by 100.</strong></p>
         ${flow(['Start', '74.4'], ['÷ 3', '24.8'], ['÷ 100', '0.248'])}
         ${ans('0.248')}`
      )}
      ${tip('÷ 4000 is ÷ 4 then ÷ 1000. Dividing by 100 moves the point 2 places left.')}`,

    // 5F Q6: divide, then round to 2 decimal places
    '5f-round': `
      <p class="hp-tag">Worked example: <b>52.7 ÷ 6</b>, to 2 decimal places</p>
      ${steps(
        `<p><strong>Add zeros and divide to 3 places</strong>, one more than you need.</p>
         ${bus('6', ['5', '2', '.', '7', '0', '0'], ['0', '8', '.', '7', '8', '3'], ['', '5', '', '4', '5', '2'], 'r 2')}`,
        `<p><strong>Round to 2 places.</strong> The 3rd digit is 3, so round down.</p>
         ${sum('8.78 | 3 → 8.78')}
         ${ans('8.78')}`
      )}
      ${tip('Dividing by a decimal? Move both points first, so 9.5 ÷ 0.3 becomes 95 ÷ 3.')}`,

    // 5F Q7: order of operations
    '5f-order': `
      <p class="hp-tag">Worked example: <b>9.6 ÷ 0.3 − 2(1.45 + 2.3)</b></p>
      ${steps(
        `<p><strong>Brackets first.</strong></p>
         ${sum(`9.6 ÷ 0.3 − 2(${now('1.45 + 2.3')}) = 9.6 ÷ 0.3 − 2 × 3.75`)}`,
        `<p><strong>Then × and ÷.</strong></p>
         ${sum('9.6 ÷ 0.3 = 96 ÷ 3 = 32<br>2 × 3.75 = 7.5')}`,
        `<p><strong>Then + and −.</strong></p>
         ${sum('32 − 7.5 = 24.5')}
         ${ans('24.5')}`
      )}
      ${tip('A number next to a bracket means multiply. For (…) ÷ (…), work out both brackets before you divide.')}`,

    // 5F Q8: missing numbers in a division
    '5f-missing': `
      <p class="hp-tag">Worked examples: <b>□ ÷ 7 = 0.83</b>, then <b>9.□2 ÷ 3 = 3.14</b></p>
      ${steps(
        `<p><strong>Undo the ÷ with a ×.</strong></p>
         ${sum('□ = 0.83 × 7 = 5.81')}
         ${ans('5.81')}`,
        `<p><strong>For a missing digit, rebuild the whole number</strong> the same way, then read off the digit.</p>
         ${sum('3.14 × 3 = 9.42, so 9.□2 is 9.42')}
         ${ans('4')}`,
        `<p><strong>Missing divisor?</strong> Divide the two numbers you know: 15.6 ÷ □ = 2.6 gives □ = 15.6 ÷ 2.6 = 6.</p>`
      )}
      ${tip('Always check by multiplying: 2.6 × 6 = 15.6.')}`,

    // 5F Q9, Q12, Q13, Q14: word problems (sharing, cost per kg, speed)
    '5f-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story"><span class="hp-hl">2.4 kg</span> of apples costs <span class="hp-hl">$9.12</span>. <span class="hp-hl">600 g</span> of cherries costs <span class="hp-hl">$7.26</span>. Find the cost <span class="hp-kw">per</span> kilogram of each.</p>
      ${steps(
        `<p><strong>Cost per kg = cost ÷ kilograms.</strong></p>
         ${sum('9.12 ÷ 2.4 = 91.2 ÷ 24 = 3.8')}
         ${ans('3.80')}`,
        `<p><strong>Change grams to kilograms first.</strong> 600 g = 0.6 kg.</p>
         ${sum('7.26 ÷ 0.6 = 72.6 ÷ 6 = 12.1')}
         ${ans('12.10')}`
      )}
      ${tip('Share equally, per, each: divide. Speed is distance ÷ time. Cheaper per kilogram means better value.')}`,

    // 5F Q10, Q11: how many complete ones?
    '5f-complete': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A roll holds <span class="hp-hl">25 m</span> of ribbon. Each bow needs <span class="hp-hl">35 cm</span>. How many <span class="hp-kw">complete</span> bows can be made?</p>
      ${steps(
        `<p><strong>Use the same units.</strong> 35 cm = 0.35 m.</p>`,
        `<p><strong>Divide.</strong></p>
         ${sum('25 ÷ 0.35 = 2500 ÷ 35 = 71.4…')}`,
        `<p><strong>"Complete" means round down.</strong> The 0.4 of a bow is not a bow.</p>
         ${ans('71')}`
      )}
      ${tip('Check: 71 × 0.35 = 24.85 m fits, but 72 × 0.35 = 25.2 m is too much. Round down even if the decimal is 0.9.')}`,

    // 5F Q15: using a multiplication fact to divide
    '5f-fact': `
      <p class="hp-tag">Worked example: <b>24.3 × 1.6 = 38.88</b>. Find <b>38.88 ÷ 1.6</b>, <b>38.88 ÷ 2.43</b> and <b>3888 ÷ 16</b>.</p>
      ${steps(
        `<p><strong>Undo the ×.</strong> If 24.3 × 1.6 = 38.88, then 38.88 ÷ 1.6 = 24.3.</p>`,
        `<p><strong>The digits are always 243 or 16.</strong> Estimate to place the point.</p>
         ${sum('38.88 ÷ 2.43 ≈ 40 ÷ 2.5 = 16, so 16<br>3888 ÷ 16 ≈ 4000 ÷ 16 = 250, so 243')}`,
        `<p><strong>Write all three.</strong></p>
         ${ans('24.3, 16, 243')}`
      )}
      ${tip('Round to easy numbers for the estimate. It only has to tell you roughly how big the answer is.')}`,

    // 5F Q16: think of a number (work backwards)
    '5f-backwards': `
      <p class="hp-tag">Worked example: I multiply my number by 3, then subtract 0.8. The answer is 6.1.</p>
      ${steps(
        `<p><strong>Write the steps in order.</strong></p>
         ${flow(['Start', '?'], ['× 3', ''], ['− 0.8', '6.1'])}`,
        `<p><strong>Work backwards, doing the opposite each time.</strong></p>
         ${sum('6.1 + 0.8 = 6.9<br>6.9 ÷ 3 = 2.3')}
         ${ans('2.3')}`
      )}
      ${tip('Check: 2.3 × 3 − 0.8 = 6.1. The opposite of ÷ 0.5 is × 0.5. "A half" is 0.5.')}`,

    // =====================================================================
    // 5G Connecting decimals and fractions
    // =====================================================================
    // 5G Q1, Q2, Q3, Q13: decimal to a simplified fraction
    '5g-to-fraction': `
      <p class="hp-tag">Worked example: write <b>0.65</b> and <b>9.04</b> as fractions in simplest form.</p>
      ${steps(
        `<p><strong>The last digit tells you the denominator.</strong> 0.65 ends in the hundredths, so it is 65 hundredths.</p>
         ${sum('0.65 = 65/100')}`,
        `<p><strong>Simplify.</strong> 65 and 100 are both in the 5 times table.</p>
         ${sum('65/100 = 13/20')}
         ${ans('13/20')}`,
        `<p><strong>The whole number stays in front.</strong></p>
         ${sum('9.04 = 9 4/100 = 9 1/25')}
         ${ans('9 1/25')}`
      )}
      ${tip('Type mixed numerals with a space: 9 1/25. For thousandths, keep dividing by 2 or 5: 0.008 = 8/1000 = 1/125.')}`,

    // 5G Q4: tenths, hundredths, thousandths to decimals
    '5g-tenths': `
      <p class="hp-tag">Worked example: write <b>239/100</b>, <b>41/1000</b> and <b>7 3/1000</b> as decimals.</p>
      ${steps(
        `<p><strong>100 means 2 decimal places.</strong> The top is bigger than the bottom, so the answer is more than 1.</p>
         ${sum('239/100 = 2.39')}`,
        `<p><strong>1000 means 3 places.</strong> Fill the gaps with zeros.</p>
         ${chart(['1', '', '0.1', '0.01', '0.001'], ['0', '.', '0', '4', '1'], [4])}`,
        `<p><strong>A mixed numeral keeps its whole number.</strong></p>
         ${sum('7 3/1000 = 7.003')}
         ${ans('2.39, 0.041, 7.003')}`
      )}
      ${tip('The last digit of the top goes in the column named by the bottom.')}`,

    // 5G Q5: make the denominator 10, 100 or 1000
    '5g-equivalent': `
      <p class="hp-tag">Worked example: write <b>3/40</b> and <b>4 11/200</b> as decimals.</p>
      ${steps(
        `<p><strong>What times 40 gives 10, 100 or 1000?</strong> 40 × 25 = 1000.</p>`,
        `<p><strong>Multiply the top by the same number.</strong></p>
         ${sum('3/40 = 75/1000 = 0.075')}
         ${ans('0.075')}`,
        `<p><strong>Mixed numeral: keep the whole number.</strong> 200 × 5 = 1000.</p>
         ${sum('4 11/200 = 4 55/1000 = 4.055')}
         ${ans('4.055')}`
      )}
      ${tip('Whatever you do to the bottom, do to the top. An improper fraction works the same way; the answer is just bigger than 1.')}`,

    // 5G Q6, Q7, Q12: divide the top by the bottom
    '5g-divide': `
      <p class="hp-tag">Worked example: write <b>7/8</b> and <b>7/9</b> as decimals.</p>
      ${steps(
        `<p><strong>A fraction is a division: top ÷ bottom.</strong> Write the top with a point and some zeros.</p>
         ${bus('8', ['7', '.', '0', '0', '0'], ['0', '.', '8', '7', '5'], ['', '', '7', '6', '4'], '')}
         ${ans('0.875')}`,
        `<p><strong>Some never stop.</strong> 7 ÷ 9 gives 7s forever.</p>
         ${bus('9', ['7', '.', '0', '0', '0', '0'], ['0', '.', '7', '7', '7', '7'], ['', '', '7', '7', '7', '7'], '…')}`,
        `<p><strong>Work to 4 places, then round to 3.</strong></p>
         ${sum('0.777 | 7 → 0.778')}
         ${ans('0.778')}`
      )}
      ${tip('Type the rounded decimal. A repeating decimal is sometimes written with a dot over the digit that repeats.')}`,

    // 5G Q8, Q14: comparing fractions and decimals
    '5g-compare': `
      <p class="hp-tag">Worked example: put <b>4/7, 0.52, 5/9, 0.58</b> in order, smallest first.</p>
      ${steps(
        `<p><strong>Change each fraction to a decimal</strong> (3 places is plenty).</p>
         ${sum('4/7 = 4 ÷ 7 ≈ 0.571<br>5/9 = 5 ÷ 9 ≈ 0.556')}`,
        `<p><strong>Compare the decimals.</strong></p>
         ${chips(['0.52'], ['0.556'], ['0.571'], ['0.58'])}`,
        `<p><strong>Write them back in their original form.</strong></p>
         ${ans('0.52, 5/9, 4/7, 0.58')}`
      )}
      ${tip('Type fractions as 4/7 and mixed numerals as 3 1/4, with commas between. To check if a fraction lies between two decimals, change it to a decimal first.')}`,

    // 5G Q9, Q10: fraction problems answered with decimals
    '5g-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Lily has won <span class="hp-hl">9</span> of her <span class="hp-hl">20</span> games. Max has won <span class="hp-hl">10</span> of his <span class="hp-hl">26</span>. Who has the better record?</p>
      ${steps(
        `<p><strong>Write each as a fraction, then a decimal.</strong></p>
         ${sum('9/20 = 0.45<br>10/26 = 10 ÷ 26 ≈ 0.385')}`,
        `<p><strong>Compare.</strong> 0.45 is bigger, so Lily's record is better.</p>
         ${ans('Lily')}`,
        `<p><strong>"How many more wins?" Try each number.</strong> Max plays 4 more games, so he will have played 30.</p>
         ${sum('3 wins: 13/30 ≈ 0.433 ✗<br>4 wins: 14/30 ≈ 0.467 ✓')}`
      )}
      ${tip('Measuring one thin thing? Divide the pile: 40 tiles are 92 mm thick, so one is 92 ÷ 40 = 2.3 mm = 2 3/10 mm.')}`,

    // 5G Q11: digits in a repeating decimal
    '5g-repeat': `
      <p class="hp-tag">Worked example: which digit is in the 25th decimal place of <b>4/13</b>?</p>
      ${steps(
        `<p><strong>Divide until the digits repeat.</strong> The block 307692 repeats, 6 digits long.</p>
         ${sum('4/13 = 0.307692 307692 307692…')}`,
        `<p><strong>Find how many whole blocks fit.</strong></p>
         ${sum('25 ÷ 6 = 4 r 1')}
         <p>After 4 full blocks (24 digits), you need 1 more digit.</p>`,
        `<p><strong>The 1st digit of the block</strong> is 3.</p>
         ${ans('3')}`
      )}
      ${tip('If the remainder is 0, it is the last digit of the block.')}`,

    // 5G Q15: terminating or repeating (true or false)
    '5g-reason': `
      <p class="hp-tag">Worked example: true or false? <b>Every fraction with an odd denominator repeats forever.</b></p>
      ${steps(
        `<p><strong>"Every" means it must work for all of them.</strong> Test a few.</p>
         ${sum('1/3 = 0.333… repeats<br>1/5 = 0.2 stops')}`,
        `<p><strong>One example that fails is enough.</strong> 1/5 has an odd denominator but stops.</p>
         ${ans('False')}`
      )}
      ${tip('A fraction in simplest form stops when its denominator is built only from 2s and 5s: 7/40 = 0.175 stops, since 40 = 2 × 2 × 2 × 5.')}`,

    // =====================================================================
    // 5H Connecting decimals and percentages
    // =====================================================================
    // 5H Q1, Q2, Q3, Q4: percentage to decimal
    '5h-to-decimal': `
      <p class="hp-tag">Worked example: write <b>48%</b>, <b>5%</b>, <b>18.5%</b> and <b>412%</b> as decimals.</p>
      ${steps(
        `<p><strong>Per cent means "out of 100", so divide by 100.</strong> The point moves 2 places left.</p>
         ${sum('48% = 48 ÷ 100 = 0.48')}`,
        `<p><strong>Fill gaps with zeros.</strong></p>
         ${sum('5% = 0.05')}`,
        `<p><strong>Decimals and big percentages work the same way.</strong></p>
         ${sum('18.5% = 0.185<br>412% = 4.12')}
         ${ans('0.48, 0.05, 0.185, 4.12')}`
      )}
      ${tip('More than 100% gives a decimal bigger than 1. 100% is exactly 1.')}`,

    // 5H Q5, Q6: decimal to percentage
    '5h-to-percent': `
      <p class="hp-tag">Worked example: write <b>0.73</b>, <b>0.4</b>, <b>2.85</b> and <b>0.0062</b> as percentages.</p>
      ${steps(
        `<p><strong>Multiply by 100.</strong> The point moves 2 places right.</p>
         ${sum('0.73 = 73%')}`,
        `<p><strong>Add a zero if you run out of digits.</strong></p>
         ${sum('0.4 = 0.40 = 40%')}`,
        `<p><strong>It works for any decimal.</strong></p>
         ${sum('2.85 = 285%<br>0.0062 = 0.62%')}
         ${ans('73%, 40%, 285%, 0.62%')}`
      )}
      ${tip('Type the % sign, like 73%.')}`,

    // 5H Q7: ordering a mix of decimals and percentages
    '5h-order': `
      <p class="hp-tag">Worked example: put <b>0.5, 48%, 0.09, 9.5%, 1.2</b> in order, highest first.</p>
      ${steps(
        `<p><strong>Change the percentages to decimals.</strong></p>
         ${sum('48% = 0.48<br>9.5% = 0.095')}`,
        `<p><strong>Compare the decimals.</strong></p>
         ${chips(['1.2'], ['0.5'], ['0.48'], ['0.095'], ['0.09'])}`,
        `<p><strong>Write them in their original form.</strong></p>
         ${ans('1.2, 0.5, 48%, 9.5%, 0.09')}`
      )}
      ${tip('Keep the % sign on the values that had one when you type the list.')}`,

    // 5H Q8, Q9, Q10: word problems
    '5h-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">In a class, <span class="hp-hl">0.35</span> of the students walk to school, <span class="hp-hl">0.45</span> catch a bus and the rest come by car. What percentage come by car?</p>
      ${steps(
        `<p><strong>The whole class is 1 (or 100%).</strong> Take away the known parts.</p>
         ${sum('1 − 0.35 − 0.45 = 0.2')}`,
        `<p><strong>Change to a percentage.</strong></p>
         ${sum('0.2 = 20%')}
         ${ans('20%')}`
      )}
      <p><strong>A percentage of an amount:</strong> change it to a decimal and multiply.</p>
      ${sum('40% of 65 L = 0.4 × 65 = 26 L')}
      ${tip('"Not" means take away from 100%.')}`,

    // 5H Q11, Q12: decimals and percentages with letters for digits
    '5h-letters': `
      <p class="hp-tag">Worked example: <b>P, Q, R, S</b> are digits. Write <b>PQ.R</b> as a percentage, and <b>P%</b> and <b>PQ.RS%</b> as decimals.</p>
      ${steps(
        `<p><strong>Decimal to %: the point moves 2 places right.</strong> PQ.R has only 1 digit after the point, so add a 0.</p>
         ${sum('PQ.R = PQ.R0 → PQR0%')}
         ${ans('PQR0%')}`,
        `<p><strong>% to decimal: the point moves 2 places left.</strong> P% has its hidden point after the P.</p>
         ${sum('P% → 0.0P<br>PQ.RS% → 0.PQRS')}
         ${ans('0.0P, 0.PQRS')}`
      )}
      ${tip('Treat each letter exactly like a digit. Type capitals with no spaces, and add zeros where a place is empty.')}`,

    // 5H Q13: can it be more than 100%?
    '5h-reason': `
      <p class="hp-tag">Worked example: a puppy weighed <b>4 kg</b> at birth. Now it weighs <b>9 kg</b>. What percentage of its birth weight is that?</p>
      ${steps(
        `<p><strong>Compare the new amount with the starting amount.</strong></p>
         ${sum('9 ÷ 4 = 2.25 = 225%')}
         ${ans('225%')}`,
        `<p><strong>When can it go over 100%?</strong> When you compare an amount with a starting amount, it can grow past it. A part of a whole, like a share of a pizza, can never be more than 100% of that whole.</p>`
      )}
      ${tip('Ask: is this a part of something, or a comparison with something?')}`,

    // 5H Q14: the percentage column on a sports ladder
    '5h-ladder': `
      <p class="hp-tag">Worked example: a team has scored <b>F = 1540</b> points, with <b>A = 1400</b> points scored against it.</p>
      ${steps(
        `<p><strong>Percentage = F ÷ A × 100.</strong></p>
         ${sum('1540 ÷ 1400 × 100 = 110')}`,
        `<p><strong>After another match</strong>, add the new points to F and to A first. They score 96 and concede 120:</p>
         ${sum('F = 1636, A = 1520<br>1636 ÷ 1520 × 100 = 107.63…')}
         ${ans('107.63')}`,
        `<p><strong>Exactly 100 means F = A.</strong> A team on F = 1820 and A = 1900 is 80 points behind, so it must win a game by 80.</p>`
      )}
      ${tip('Above 100 means a team has scored more points than it has let in.')}`,

    // =====================================================================
    // 5I Expressing proportions using decimals, fractions and percentages
    // =====================================================================
    // 5I Q1: a proportion as a simplified fraction
    '5i-fraction': `
      <p class="hp-tag">Worked example: write <b>14 out of 35</b> as a fraction.</p>
      ${steps(
        `<p><strong>The part goes on top, the total on the bottom.</strong></p>
         ${sum('14/35')}`,
        `<p><strong>Simplify.</strong> 14 and 35 are both in the 7 times table.</p>
         ${sum('14/35 = 2/5')}
         ${ans('2/5')}`
      )}
      ${tip('Units like $ or goats just tell you what is being counted. Leave them out of the fraction.')}`,

    // 5I Q2, Q3: a proportion as a decimal or percentage
    '5i-dec-pct': `
      <p class="hp-tag">Worked example: write <b>23 out of 100</b> and <b>13 out of 25</b> as a decimal and a percentage.</p>
      ${steps(
        `<p><strong>Out of 100 is easy:</strong> hundredths, and the same number as a percentage.</p>
         ${sum('23/100 = 0.23 = 23%')}`,
        `<p><strong>Other totals: write the fraction, then make the bottom 100.</strong> 25 × 4 = 100, so multiply the top by 4 too.</p>
         ${sum('13/25 = 52/100 = 0.52')}`,
        `<p><strong>For the percentage, multiply by 100.</strong></p>
         ${sum('13/25 × 100 = 52, so 13/25 = 52%')}
         ${ans('0.52, 52%')}`
      )}
      ${tip('Out of 10 means tenths: one decimal place. For a total of 20 or 50, ask what you multiply by to get 100.')}`,

    // 5I Q4, Q10, Q11: fraction, decimal and percentage of a total
    '5i-all-three': `
      <p class="hp-tag">Worked example: write <b>33 out of a total of 75</b> as a fraction, a decimal and a percentage.</p>
      ${steps(
        `<p><strong>Fraction, simplified.</strong> Both are in the 3 times table.</p>
         ${sum('33/75 = 11/25')}
         ${ans('11/25')}`,
        `<p><strong>Make the bottom 100</strong> to get the decimal.</p>
         ${sum('11/25 = 44/100 = 0.44')}
         ${ans('0.44')}`,
        `<p><strong>Hundredths are per cent.</strong></p>
         ${ans('44%')}`
      )}
      ${tip('If the part is not given, find it first: total minus the other parts. "Keeps" means what is left after something is taken out.')}`,

    // 5I Q5: shaded part of a shape
    '5i-shapes': `
      <p class="hp-tag">Worked example: what proportion of this shape is shaded?</p>
      ${fig({ kind: 'grid', rows: 4, cols: 5, shaded: [0, 1, 2, 5, 6, 10, 15], alt: 'A 4 by 5 grid with 7 squares shaded' })}
      ${steps(
        `<p><strong>Count the equal parts, and the shaded ones.</strong></p>
         ${sum('7 shaded out of 20')}`,
        `<p><strong>Make the total 100.</strong></p>
         ${sum('7/20 = 35/100 = 0.35 = 35%')}
         ${ans('0.35 and 35%')}`
      )}
      ${tip('Circles and shapes made of triangles work the same way, as long as every piece is the same size.')}`,

    // 5I Q6, Q7: parts in a mixture
    '5i-parts': `
      <p class="hp-tag">Worked example: a paint is <b>9 parts blue</b> to <b>16 parts white</b>. What proportion is blue?</p>
      ${steps(
        `<p><strong>Add the parts to get the total.</strong></p>
         ${sum('9 + 16 = 25 parts')}`,
        `<p><strong>Blue out of the total</strong>, then decimal and percentage.</p>
         ${sum('9/25 = 36/100 = 0.36 = 36%')}
         ${ans('9/25, 0.36, 36%')}`
      )}
      ${tip('The trap is using 9/16. The bottom must be the whole mixture, not the other part.')}`,

    // 5I Q8, Q9: comparing with percentages
    '5i-compare': `
      <p class="hp-tag">Worked example: Sam scored <b>17/25</b>, Tia got <b>0.71</b> right and Ula scored <b>66%</b>. Who did best?</p>
      ${steps(
        `<p><strong>Change each to a percentage.</strong></p>
         ${sum('17/25 = 68/100 = 68%<br>0.71 = 71%<br>66%')}`,
        `<p><strong>Compare.</strong> 71% is the biggest.</p>
         ${ans('Tia')}`
      )}
      ${tip('Type percentages with the % sign. Once they are all in the same form, comparing is easy.')}`,

    // 5I Q12: make the units match first
    '5i-units': `
      <p class="hp-tag">Worked example: <b>90 cents out of $4</b>, as a fraction, and <b>350 g out of 2.5 kg</b>, as a percentage.</p>
      ${steps(
        `<p><strong>Change to the same units.</strong> $4 = 400 cents.</p>
         ${sum('90/400 = 9/40')}
         ${ans('9/40')}`,
        `<p><strong>Same again.</strong> 2.5 kg = 2500 g.</p>
         ${sum('350/2500 = 14/100 = 14%')}
         ${ans('14%')}`
      )}
      ${chips(['$1 = 100 c'], ['1 m = 100 cm'], ['1 km = 1000 m'], ['1 kg = 1000 g'], ['1 min = 60 s'], ['1 week = 7 days'])}
      ${tip('Change the bigger unit into the smaller one. It avoids decimals in the fraction.')}`,

    // 5I Q13, Q18: Venn diagrams
    '5i-venn': `
      <p class="hp-tag">Worked example: in a group of <b>20</b>, 11 like cats, 8 like dogs and 3 like neither. What fraction like both?</p>
      ${steps(
        `<p><strong>Find the overlap.</strong> Adding cats and dogs counts the "both" people twice.</p>
         ${sum('11 + 8 + 3 = 22<br>22 − 20 = 2 like both')}`,
        `<p><strong>Fill in the diagram from the middle out.</strong> Cats only: 11 − 2 = 9. Dogs only: 8 − 2 = 6.</p>
         ${fig({ kind: 'diagram', unit: 30, items: [{ poly: [[-4, -2.6], [4, -2.6], [4, 2.6], [-4, 2.6]] }, { circle: [-1, 0, 2] }, { circle: [1, 0, 2] }, { label: 'cats', at: [-2.2, 2.25], anchor: 'middle' }, { label: 'dogs', at: [2.2, 2.25], anchor: 'middle' }, { label: '9', at: [-2, 0], anchor: 'middle' }, { label: '2', at: [0, 0], anchor: 'middle' }, { label: '6', at: [2, 0], anchor: 'middle' }, { label: '3', at: [3.4, -2.1], anchor: 'middle' }], alt: 'A Venn diagram: cats only 9, both 2, dogs only 6, neither 3' })}`,
        `<p><strong>Write the fraction.</strong></p>
         ${sum('2/20 = 1/10')}
         ${ans('1/10')}`
      )}
      ${tip('Check the four regions add to the total: 9 + 2 + 6 + 3 = 20. With three circles, start with the middle, then the pairs, then the "only" parts.')}`,

    // 5I Q14, Q15, Q16: percentages of awkward totals
    '5i-out-of': `
      <p class="hp-tag">Worked example: Ari scored <b>51 out of 60</b>. A $2500 bike is reduced by <b>$450</b>.</p>
      ${steps(
        `<p><strong>Divide the part by the total, then × 100.</strong></p>
         ${sum('51 ÷ 60 = 0.85 = 85%')}
         ${ans('85%')}`,
        `<p><strong>A percentage reduction</strong> is the reduction out of the original price.</p>
         ${sum('450 ÷ 2500 = 0.18 = 18%')}
         ${ans('18%')}`
      )}
      ${tip('Percentages let you compare totals of different sizes fairly: the bigger percentage is the bigger proportion.')}`,

    // 5I Q17: proportions with letters
    '5i-letters': `
      <p class="hp-tag">Worked example: concrete is made from <b>x parts sand</b> to <b>4 parts gravel</b>.</p>
      ${steps(
        `<p><strong>The total is all the parts added.</strong></p>
         ${sum('x + 4 parts')}`,
        `<p><strong>Sand as a fraction of the total.</strong> Brackets keep the bottom together.</p>
         ${sum('x/(x + 4)')}
         ${ans('x/(x+4)')}`,
        `<p><strong>Gravel as a percentage:</strong> fraction × 100.</p>
         ${sum('4/(x + 4) × 100 = 400/(x + 4)')}
         ${ans('400/(x+4)')}`
      )}
      ${tip('Try a number to check: if x = 6, sand is 6/10 and gravel is 400/10 = 40%.')}`
  });
})();
