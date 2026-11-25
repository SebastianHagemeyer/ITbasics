/* H3 "How do I work this out?" panels for Chapter 4.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 4A to 4G. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 4A Introduction to algebra
    // =====================================================================
    // 4A Q1, Q2, Q3, Q4: terms, constants and coefficients
    '4a-terms': `
      <p class="hp-tag">Worked example: look at <b>8h + 5 + gh + g/3</b></p>
      ${steps(
        `<p><strong>Split it at every + and − sign.</strong> Each piece is a <b>term</b>. A fraction like g/3 counts as one term.</p>
         ${chips(['8h'], ['5'], ['gh'], ['g/3'])}
         <p>That is 4 terms. To list them, type them separated by commas: 8h, 5, gh, g/3</p>`,
        `<p><strong>Find the constant.</strong> It is the term with no letter, just a number. Here it is 5.</p>`,
        `<p><strong>Find a coefficient.</strong> It is the number in front of a letter. The coefficient of h is 8. The term gh is a different term (it has g in it too), so it does not count for h.</p>
         ${ans('4 terms, constant 5, coefficient of h is 8')}`
      )}
      ${tip('A letter on its own has coefficient 1, because gh means 1 × gh. When the question asks for two answers, type them in the order asked, with a comma between.')}`,

    // 4A Q5, Q6, Q7, Q12, Q16: words into algebra (and back)
    '4a-words': `
      ${chips(['sum, more than, added → +'], ['difference, less than, subtract → −'], ['product, lots of, times → ×'], ['divided by, a third of → ÷'])}
      <p class="hp-tag">Worked example: <b>11 is added to r, then the result is multiplied by 2.</b></p>
      ${steps(
        `<p><strong>Follow the words in order.</strong> First, 11 is added to r.</p>
         ${sum('r + 11')}`,
        `<p><strong>"The result" means everything so far.</strong> Put it in brackets before you multiply, and write the number in front with no × sign.</p>
         ${sum('2 × (r + 11) = 2(r + 11)')}
         ${ans('2(r + 11)')}`
      )}
      <p><strong>No "result"?</strong> "r is divided by 5, then 1 is taken away" is just r/5 − 1. Type it as r/5-1. Watch the order with "less than": 6 less than r is r − 6, not 6 − r.</p>
      ${tip('Use / for divide. If a whole sum is divided, put brackets round the top: (r + 11) ÷ 3 is typed (r+11)/3.')}`,

    // 4A Q8, Q9, Q10, Q11: writing an expression for a story
    '4a-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Concert tickets cost <span class="hp-hl">$t</span> each. Write expressions for (a) the cost of <span class="hp-hl">4</span> tickets, (b) the price after a <span class="hp-hl">$3</span> fee is added to each ticket, (c) the cost of 4 tickets with the fee.</p>
      ${steps(
        `<p><strong>Try it with a real number first.</strong> If a ticket cost $20, 4 tickets would be 4 × 20. So with $t it is 4 × t.</p>
         ${sum('(a) 4t')}`,
        `<p><strong>Adding to each ticket</strong> makes the new price t + 3.</p>
         ${sum('(b) t + 3')}`,
        `<p><strong>Use the new price as one lump.</strong> It needs brackets, because the whole new price is multiplied by 4.</p>
         ${sum('(c) 4(t + 3)')}
         ${ans('4t, t + 3, 4(t + 3)')}`
      )}
      ${tip('Sharing means divide. If k people share a $200 prize equally, each gets 200/k. For units, there are 7 days in a week, so w weeks is 7w days.')}`,

    // 4A Q13, Q14, Q15: true or false, and putting expressions in order
    '4a-truefalse': `
      <p class="hp-tag">Worked example: <b>w</b> is a whole number between 10 and 40.</p>
      ${steps(
        `<p><strong>"Must" means it works for every value.</strong> Is w − 12 always more than 0? Try the smallest value, 11.</p>
         ${sum('11 − 12 = −1, which is not more than 0')}
         <p>One value that fails is enough, so it is <b>false</b>.</p>`,
        `<p><strong>To put expressions in order, try a value or two.</strong> Sort w/2, 3w, w + 10, w − 4.</p>
         ${sum('w = 11: 5.5, 33, 21, 7<br>w = 39: 19.5, 117, 49, 35')}
         <p>Both values give the same order, smallest first.</p>
         ${ans('w/2, w-4, w+10, 3w')}`
      )}
      ${tip('"Could" only needs one example that works. For odd and even, try two odd numbers, like 7 and 9, and see what happens.')}`,

    // =====================================================================
    // 4B Substituting numbers into algebraic expressions
    // =====================================================================
    // 4B Q1, Q2, Q3: substituting one value
    '4b-sub-one': `
      <p class="hp-tag">Worked example: if <b>t = 7</b>, evaluate <b>5t − 8</b> and <b>20 − 2t</b>.</p>
      ${steps(
        `<p><strong>Put the number in place of the letter.</strong> 5t means 5 × t, so put the × sign back in.</p>
         ${sum('5t − 8 = 5 × 7 − 8')}`,
        `<p><strong>Multiply before you take away.</strong></p>
         ${sum(`${now('5 × 7')} − 8 = 35 − 8 = 27`)}
         ${ans('27')}`,
        `<p><strong>Same again for the second one.</strong></p>
         ${sum(`20 − ${now('2 × 7')} = 20 − 14 = 6`)}
         ${ans('6')}`
      )}
      ${tip('Never just write the digits side by side. With t = 7, 5t is 35, not 57.')}`,

    // 4B Q4: brackets and fraction lines
    '4b-order': `
      <p class="hp-tag">Worked example: if <b>a = 5</b>, evaluate <b>2(a + 3) − a</b>.</p>
      ${steps(
        `<p><strong>Substitute everywhere the letter appears.</strong></p>
         ${sum('2 × (5 + 3) − 5')}`,
        `<p><strong>Brackets first.</strong></p>
         ${sum(`2 × ${now('(5 + 3)')} − 5 = 2 × 8 − 5`)}`,
        `<p><strong>Then × and ÷, then + and −.</strong></p>
         ${sum('16 − 5 = 11')}
         ${ans('11')}`
      )}
      <p><strong>A fraction line means divide</strong>, and it acts like brackets: work out the whole top and the whole bottom first. With a = 5, (a + 9)/2 = 14/2 = 7.</p>
      ${tip('A number touching a bracket means multiply: 2(a + 3) is 2 × (a + 3).')}`,

    // 4B Q5, Q6: substituting two values
    '4b-sub-two': `
      <p class="hp-tag">Worked example: evaluate <b>6rs − s</b> when <b>r = 2</b> and <b>s = 5</b>.</p>
      ${steps(
        `<p><strong>Put the × signs back in.</strong> 6rs means 6 × r × s.</p>
         ${sum('6 × r × s − s')}`,
        `<p><strong>Swap each letter for its own number.</strong></p>
         ${sum('6 × 2 × 5 − 5')}`,
        `<p><strong>Multiply, then take away.</strong></p>
         ${sum('60 − 5 = 55')}
         ${ans('55')}`
      )}
      ${tip('If a letter is 0, every term with that letter in it is 0. For example, if s = 0 then 7s = 7 × 0 = 0.')}`,

    // 4B Q7, Q11, Q15: tables of values
    '4b-table': `
      <p class="hp-tag">Worked example: complete the table.</p>
      ${fig({ kind: 'table', rows: [['t', '1', '2', '3', '?', '5'], ['7t − 3', '?', '?', '18', '25', '?']] })}
      ${steps(
        `<p><strong>Bottom row: substitute each top number.</strong></p>
         ${sum('t = 1: 7 × 1 − 3 = 4<br>t = 2: 7 × 2 − 3 = 11<br>t = 5: 7 × 5 − 3 = 32')}`,
        `<p><strong>Top row: work backwards.</strong> Which t makes 7t − 3 = 25? Undo the steps in reverse: add 3, then divide by 7.</p>
         ${sum('25 + 3 = 28, 28 ÷ 7 = 4')}`,
        `<p><strong>Type each row's missing values left to right</strong>, separated by commas.</p>
         ${ans('bottom row: 4, 11, 32 &nbsp; top row: 4')}`
      )}
      ${tip('Check a backwards answer by putting it back in: 7 × 4 − 3 = 25. ✓')}`,

    // 4B Q8: squares, cubes and square roots
    '4b-powers': `
      <p class="hp-tag">Worked example: given <b>a = 7</b> and <b>b = 2</b>, evaluate <b>2a²</b>, <b>(a − b)²</b> and <b>√(a + b)</b>.</p>
      ${steps(
        `<p><strong>2a² means 2 × a × a.</strong> Only the a is squared. Square first, then multiply.</p>
         ${sum('2 × 7² = 2 × 49 = 98')}`,
        `<p><strong>With brackets, do the brackets first, then square.</strong></p>
         ${sum('(7 − 2)² = 5² = 25')}`,
        `<p><strong>A square root sign covers everything under it.</strong> Work that out first, then take the root.</p>
         ${sum('√(7 + 2) = √9 = 3')}
         ${ans('98, 25, 3')}`
      )}
      ${tip('(3a)² means 3a × 3a, so the 3 gets squared too. 3a² means only the a is squared. A cube, like b³, is b × b × b.')}`,

    // 4B Q9, Q10, Q12: working backwards to find the letter
    '4b-backwards': `
      <p class="hp-tag">Worked example: a number is substituted for <b>k</b> in <b>6k + 5</b> and the result is <b>47</b>. Find k.</p>
      ${steps(
        `<p><strong>Undo the last step first.</strong> 5 was added, so take it away.</p>
         ${sum('47 − 5 = 42, so 6k = 42')}`,
        `<p><strong>Undo the multiplying.</strong></p>
         ${sum('42 ÷ 6 = 7')}
         ${ans('7')}`,
        `<p><strong>Check it.</strong></p>
         ${sum('6 × 7 + 5 = 47 ✓')}`
      )}
      <p><strong>Two letters multiplied?</strong> If ab = 22 and both are whole numbers, a must be a factor of 22: 1, 2, 11, 22. If b can be a decimal and a = 4, then b = 22 ÷ 4 = 5.5.</p>
      ${tip('For a smallest or largest value, try numbers near the edge. The largest whole k with 6k + 5 under 50 is 7, because k = 7 gives 47 but k = 8 gives 53.')}`,

    // 4B Q13, Q14: spotting why a pattern always works
    '4b-pattern': `
      <p class="hp-tag">Worked example: Ben puts whole numbers into <b>3 × (w + w)</b>. Why is the answer always a multiple of 6?</p>
      ${steps(
        `<p><strong>Test a couple of values.</strong></p>
         ${sum('w = 5: 3 × 10 = 30<br>w = 11: 3 × 22 = 66')}`,
        `<p><strong>Simplify the expression.</strong> w + w = 2w, and 3 × 2w = 6w. So the answer is always 6 lots of a whole number.</p>
         ${ans('6w')}`
      )}
      <p><strong>Doubling or tripling a whole expression.</strong> If p + 2q = 25, then 3p + 6q is 3 lots of p + 2q, so it is 3 × 25 = 75. If you also know q = 10, then p = 25 − 20 = 5.</p>
      ${tip('Look at the coefficients. If every coefficient has been multiplied by the same number, the whole answer is multiplied by that number too.')}`,

    // =====================================================================
    // 4C Equivalent algebraic expressions
    // =====================================================================
    // 4C Q1, Q2, Q5, Q7, Q14: which expressions are equivalent
    '4c-equivalent': `
      <p class="hp-tag">Worked example: two of these are equivalent. Which two? <b>9w + 1</b>, <b>2w + 1 + 7w</b>, <b>9 + w</b></p>
      ${steps(
        `<p><strong>Draw a table of values.</strong> Substitute a few numbers for w into each expression.</p>
         ${fig({ kind: 'table', rows: [['', 'w = 1', 'w = 2', 'w = 3'], ['9w + 1', '10', '19', '28'], ['2w + 1 + 7w', '10', '19', '28'], ['9 + w', '10', '11', '12']] })}`,
        `<p><strong>Compare the rows.</strong> At w = 1 all three give 10, so one value is not enough. At w = 2, 9 + w gives 11, so it is not equivalent to the others. The other two rows match every time.</p>
         ${ans('9w + 1 and 2w + 1 + 7w')}`
      )}
      ${tip('Order does not matter when you add: 3 + w and w + 3 are equivalent. If two rows differ for even one value, the expressions are not equivalent.')}`,

    // 4C Q3, Q4, Q11: turning number facts into algebra
    '4c-generalise': `
      <p class="hp-tag">Worked example: generalise <b>4 × 7 − 7 = 3 × 7</b>, <b>4 × 12 − 12 = 3 × 12</b>, <b>4 × 20 − 20 = 3 × 20</b>.</p>
      ${steps(
        `<p><strong>Find the number that changes.</strong> It is 7, then 12, then 20. Everything else stays the same.</p>`,
        `<p><strong>Replace it with x.</strong></p>
         ${sum('4 × x − x = 3 × x')}`,
        `<p><strong>Write it simply.</strong> Drop the × signs and put the number in front of the letter.</p>
         ${sum('4x − x = 3x')}
         ${ans('3x')}`
      )}
      <p><strong>Two numbers change?</strong> Use a for the first one and b for the second. 10 × 4 ÷ 4 = 10 and 7 × 3 ÷ 3 = 7 become a × b ÷ b = a.</p>
      ${tip('Write letters next to each other to multiply them, in alphabetical order: a × b is typed ab. Use ^ for powers, like a^2.')}`,

    // 4C Q6, Q10, Q12: testing with a table of values
    '4c-table': `
      <p class="hp-tag">Worked example: use a table to show <b>10x + 1 − x</b> and <b>9x + 1</b> are likely to be equivalent.</p>
      ${fig({ kind: 'table', rows: [['x', '1', '3', '5'], ['10x + 1 − x', '?', '?', '?'], ['9x + 1', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Substitute into the first expression.</strong></p>
         ${sum('x = 1: 10 + 1 − 1 = 10<br>x = 3: 30 + 1 − 3 = 28<br>x = 5: 50 + 1 − 5 = 46')}`,
        `<p><strong>Substitute into the second.</strong></p>
         ${sum('x = 1: 9 + 1 = 10<br>x = 3: 27 + 1 = 28<br>x = 5: 45 + 1 = 46')}`,
        `<p><strong>Compare the rows.</strong> They match every time, so they are likely to be equivalent.</p>
         ${ans('10, 28, 46, 10, 28, 46')}`
      )}
      ${tip('One value that gives different answers proves two expressions are not equivalent. With w = 10, w + 4 = 14 but 4w = 40.')}`,

    // 4C Q8, Q9: perimeter and fewest terms
    '4c-perimeter': `
      <p class="hp-tag">Worked example: write the perimeter of this triangle in simplest form.</p>
      ${fig({ kind: 'tri', base: '5', left: '3n', right: '8n' })}
      ${steps(
        `<p><strong>Add all the sides.</strong> The perimeter is the distance all the way round.</p>
         ${sum('3n + 8n + 5')}`,
        `<p><strong>Collect the n terms.</strong> 3 lots of n plus 8 lots of n is 11 lots of n. The 5 has no letter, so it stays on its own.</p>
         ${sum('3n + 8n = 11n')}
         ${ans('11n + 5')}`
      )}
      ${tip('A rectangle has two of each side, so count each side twice. To get as few terms as possible, collect every group of matching letters, and remember a − sign belongs to the term after it.')}`,

    // 4C Q13: expressions with and without brackets
    '4c-brackets': `
      <p class="hp-tag">Worked example: write <b>5 × (2 + a)</b> without brackets.</p>
      ${steps(
        `<p><strong>Multiply each thing inside the brackets by 5.</strong></p>
         ${sum('5 × 2 = 10 and 5 × a = 5a')}
         ${ans('10 + 5a')}`,
        `<p><strong>Check with a table.</strong> Pick a value, say a = 10.</p>
         ${sum('5 × (2 + 10) = 5 × 12 = 60<br>10 + 5 × 10 = 10 + 50 = 60 ✓')}`,
        `<p><strong>Going the other way:</strong> to put 28 + 4a into brackets, find a number that goes into both parts. 28 = 4 × 7 and 4a = 4 × a.</p>
         ${sum('28 + 4a = 4(7 + a)')}`
      )}
      ${tip('Type a number touching a bracket for "times", like 4(7+a). You can check your bracket answer by multiplying it back out.')}`,

    // 4C Q15: chains of equivalent expressions
    '4c-logic': `
      <p class="hp-tag">Worked example: think about people's heights.</p>
      ${steps(
        `<p><strong>Same, same.</strong> If Amy is the same height as Ben, and Ben is the same height as Cal, then Amy and Cal must be the same height. Equivalent expressions work the same way, because each pair gives equal values for every number.</p>`,
        `<p><strong>Different, different.</strong> If Amy is not Ben's height and Ben is not Cal's height, Amy and Cal could still match. For example, A = 2x, B = 3x, C = 5x − 3x: A and B differ, B and C differ, but A and C are equivalent.</p>`
      )}
      ${tip('To show something is "not always" true, one example where it fails is enough.')}`,

    // =====================================================================
    // 4D Like terms
    // =====================================================================
    // 4D Q1, Q2: like terms or not
    '4d-like': `
      <p class="hp-tag">Worked example: are <b>4rs</b> and <b>9sr</b> like terms?</p>
      ${steps(
        `<p><strong>Ignore the numbers in front.</strong> Look only at the letters: rs and sr.</p>`,
        `<p><strong>Check the letters match exactly.</strong> rs means r × s and sr means s × r, which are the same. The order of the letters does not matter.</p>
         ${ans('Like terms')}`
      )}
      ${chips(['3gh and 10hg: like', 'add'], ['k and 9k: like', 'add'], ['6w and 6: not like', 'take'], ['2xy and 2xyz: not like', 'take'])}
      ${tip('Like terms need exactly the same letters, no more and no fewer. A number with no letter is only like other plain numbers.')}`,

    // 4D Q3, Q4: collecting like terms
    '4d-collect': `
      <p class="hp-tag">Worked example: simplify <b>10h + 11 − 3h + 8k + 4k − 2</b></p>
      ${steps(
        `<p><strong>Group the like terms.</strong> Each term takes the sign in front of it with it.</p>
         ${chips(['10h', 'add'], ['−3h', 'add'], ['8k'], ['4k'], ['11', 'take'], ['−2', 'take'])}`,
        `<p><strong>Combine each group.</strong></p>
         ${sum('h terms: 10h − 3h = 7h<br>k terms: 8k + 4k = 12k<br>numbers: 11 − 2 = 9')}`,
        `<p><strong>Write the groups together.</strong></p>
         ${ans('7h + 12k + 9')}`
      )}
      ${tip('Type it with no spaces or × signs, like 7h+12k+9. The order of the terms does not matter. If a group adds to 0, leave it out.')}`,

    // 4D Q5, Q9: like terms with two or more letters
    '4d-pairs': `
      <p class="hp-tag">Worked example: simplify <b>9xy − 2x + 6yx + 4</b></p>
      ${steps(
        `<p><strong>Find the like terms.</strong> 9xy and 6yx are like terms, because xy and yx are the same. −2x is different: it has only x.</p>
         ${chips(['9xy', 'add'], ['6yx', 'add'], ['−2x'], ['4', 'take'])}`,
        `<p><strong>Combine them.</strong> Write the letters in alphabetical order.</p>
         ${sum('9xy + 6yx = 15xy')}`,
        `<p><strong>Write it all out.</strong> −2x and 4 have nothing to join, so they stay as they are.</p>
         ${ans('15xy − 2x + 4')}`
      )}
      ${tip('Type 15xy-2x+4. A term like 1xy is written just xy.')}`,

    // 4D Q6, Q7, Q8: like terms in a story
    '4d-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ava earns <span class="hp-hl">$18</span> an hour and Ben earns <span class="hp-hl">$21</span> an hour. They each work <span class="hp-hl">h</span> hours. Write expressions for what each earns, their total, and how much more Ben earns.</p>
      ${steps(
        `<p><strong>Each person:</strong> pay per hour times hours.</p>
         ${sum('Ava: 18h &nbsp; Ben: 21h')}`,
        `<p><strong>Total: add the like terms.</strong></p>
         ${sum('18h + 21h = 39h')}`,
        `<p><strong>How much more: take away.</strong></p>
         ${sum('21h − 18h = 3h')}
         ${ans('18h, 21h, 39h, 3h')}`
      )}
      ${tip('Once it is simplified, you can substitute. If h = 10, the total is 39 × 10 = $390.')}`,

    // 4D Q10, Q11: checking with substitution
    '4d-check': `
      <p class="hp-tag">Worked example: show that <b>7k + 3k</b> is equivalent to <b>10k</b>.</p>
      ${fig({ kind: 'table', rows: [['k', '1', '2', '3', '4'], ['7k + 3k', '?', '?', '?', '?'], ['10k', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Fill in each row.</strong></p>
         ${sum('7k + 3k: 10, 20, 30, 40<br>10k: 10, 20, 30, 40')}`,
        `<p><strong>The rows match</strong>, so they are equivalent. Type the top row, then the bottom row.</p>
         ${ans('10, 20, 30, 40, 10, 20, 30, 40')}`
      )}
      <p><strong>Not equivalent?</strong> Substitute and show the answers differ. With k = 5 and j = 1, 2k + 3j = 10 + 3 = 13 but 5jk = 5 × 1 × 5 = 25.</p>
      ${tip('You cannot add unlike terms. 2k + 3j stays as it is; it is not 5jk.')}`,

    // 4D Q12: using like terms to make a calculation easy
    '4d-generalise': `
      <p class="hp-tag">Worked example: work out <b>37 × 15 − 35 × 15</b> the easy way.</p>
      ${steps(
        `<p><strong>Write it with a letter</strong> for the number that repeats.</p>
         ${sum('37 × x − 35 × x = 37x − 35x')}`,
        `<p><strong>Collect like terms.</strong> 37 lots of x take away 35 lots of x leaves 2 lots of x.</p>
         ${sum('37x − 35x = 2x')}`,
        `<p><strong>Put the number back in.</strong></p>
         ${sum('2 × 15 = 30')}
         ${ans('30')}`
      )}
      ${tip('This saves a lot of work: 37 × 15 = 555 and 35 × 15 = 525, and 555 − 525 is still 30.')}`,

    // 4D Q13: counting equivalent expressions
    '4d-count': `
      <p class="hp-tag">Worked example: how many expressions of exactly three terms added together are equivalent to <b>3a + b</b>? (Whole-number coefficients above 0; a different order counts as different.)</p>
      ${steps(
        `<p><strong>Work out which terms can split.</strong> 3a can split into a + 2a or 2a + a. b cannot split, because its coefficient is 1.</p>`,
        `<p><strong>List them in order.</strong> b can go first, second or third.</p>
         ${sum('b + a + 2a, &nbsp; b + 2a + a<br>a + b + 2a, &nbsp; 2a + b + a<br>a + 2a + b, &nbsp; 2a + a + b')}
         ${ans('6')}`
      )}
      ${tip('Be systematic. Decide which term splits and how, then list every position, so you do not miss any or count one twice.')}`,

    // =====================================================================
    // 4E Multiplying and dividing expressions
    // =====================================================================
    // 4E Q1: writing without × signs
    '4e-no-signs': `
      <p class="hp-tag">Worked example: write <b>8 × t × 2 × s</b> without × signs.</p>
      ${steps(
        `<p><strong>Multiply the numbers.</strong></p>
         ${sum('8 × 2 = 16')}`,
        `<p><strong>Write the letters after the number</strong>, in alphabetical order.</p>
         ${sum('t and s → st')}
         ${ans('16st')}`
      )}
      ${tip('You can multiply in any order, so move the numbers to the front. Type it with no spaces or × signs: 16st.')}`,

    // 4E Q2, Q10, Q12: multiplying terms
    '4e-multiply': `
      <p class="hp-tag">Worked example: simplify <b>4a × 7bc</b></p>
      ${steps(
        `<p><strong>Write out every part.</strong></p>
         ${sum('4 × a × 7 × b × c')}`,
        `<p><strong>Numbers first, then the letters in alphabetical order.</strong></p>
         ${sum(`${now('4 × 7')} × a × b × c = 28abc`)}
         ${ans('28abc')}`
      )}
      <p><strong>Then substitute?</strong> Simplify first. With a = 2, b = 1 and c = 3: 28 × 2 × 1 × 3 = 28 × 6 = 168.</p>
      ${tip('Adding the same term again is multiplying: 9h + 9h is 2 × 9h = 18h.')}`,

    // 4E Q3, Q14: a letter times itself (powers)
    '4e-powers': `
      <p class="hp-tag">Worked example: simplify <b>2t × 9t</b></p>
      ${steps(
        `<p><strong>Multiply the numbers.</strong></p>
         ${sum('2 × 9 = 18')}`,
        `<p><strong>Multiply the letters.</strong> t × t is t squared, written t².</p>
         ${sum('2t × 9t = 18t²')}
         ${ans('18t^2')}`
      )}
      <p><strong>More of the same letter?</strong> Count how many times each letter appears. 2 × p × p × q × q × q = 2p²q³, typed 2p^2q^3. And p² × p is p × p × p, which is p³.</p>
      ${tip('Type powers with the ^ key: t^2. Do not type t2 or 2t, they mean something else.')}`,

    // 4E Q4: writing without ÷ signs
    '4e-divide': `
      <p class="hp-tag">Worked example: write <b>(2k − 1) ÷ (3 + t)</b> without a division sign.</p>
      ${steps(
        `<p><strong>The first part goes on top, the second part on the bottom.</strong> A fraction line means divide.</p>
         ${sum('w ÷ 9 = w/9 (w on top, 9 on the bottom)')}`,
        `<p><strong>Keep whole groups together.</strong> All of 2k − 1 goes on top and all of 3 + t goes underneath.</p>
         ${ans('(2k-1)/(3+t)')}`
      )}
      ${tip('When you type a fraction on one line, put brackets round any top or bottom with a + or − in it. Without them, 2k-1/3+t means something different.')}`,

    // 4E Q5, Q9: dividing terms and missing terms
    '4e-cancel': `
      <p class="hp-tag">Worked example: simplify <b>14ab/21b</b></p>
      ${steps(
        `<p><strong>Divide the numbers by their HCF.</strong> 7 goes into 14 and 21.</p>
         ${sum('14/21 = 2/3')}`,
        `<p><strong>Cancel any letter that is on the top and the bottom.</strong> b ÷ b = 1, so the b disappears. The a stays on top.</p>
         ${sum('14ab/21b = 2a/3')}
         ${ans('2a/3')}`
      )}
      <p><strong>Missing term?</strong> For 35ab ÷ ? = 5b, the number must turn 35 into 5 (35 ÷ 7 = 5) and the a must cancel, so ? = 7a. For 2k × ? = 18kq, 18 ÷ 2 = 9 and q is missing, so ? = 9q.</p>
      ${tip('If the bottom becomes 1, just write the top: 14k/2 = 7k. If only numbers are left, type a number or fraction, like 1/4.')}`,

    // 4E Q6, Q11: area of a rectangle
    '4e-area': `
      <p class="hp-tag">Worked example: find the area of this rectangle.</p>
      ${fig({ kind: 'rect', cols: [['5t', 2]], rows: [['9k', 1]] })}
      ${steps(
        `<p><strong>Area = length × width.</strong></p>
         ${sum('5t × 9k')}`,
        `<p><strong>Multiply the numbers, then the letters.</strong></p>
         ${sum('5 × 9 = 45, and t × k = kt')}
         ${ans('45kt')}`
      )}
      <p><strong>Sides made bigger?</strong> A rectangle 7 by k has area 7k. Make both sides 5 times longer: 35 by 5k, so the area is 175k. 175k ÷ 7k = 25, so the area is 25 times bigger (5 × 5).</p>
      ${tip('Write the letters in alphabetical order. 45kt and 45tk are equal, but kt is the usual way.')}`,

    // 4E Q7, Q8: multiplying and dividing in a story
    '4e-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A bag of oranges weighs <span class="hp-hl">g</span> kg. Write the weight of (a) <span class="hp-hl">5</span> bags, (b) <span class="hp-hl">m</span> bags, (c) twice as many bags as that.</p>
      ${steps(
        `<p><strong>Weight of one bag × number of bags.</strong></p>
         ${sum('(a) 5 × g = 5g<br>(b) m × g = gm')}`,
        `<p><strong>Twice as many bags is 2m bags.</strong></p>
         ${sum('(c) 2m × g = 2gm')}
         ${ans('5g, gm, 2gm')}`
      )}
      <p><strong>Sharing means divide.</strong> If 4 friends share a bill of $P equally, each pays P ÷ 4, typed P/4.</p>
      ${tip('Try it with numbers first. If a bag weighed 3 kg, 5 bags would be 5 × 3. Then put the letter where the 3 was.')}`,

    // 4E Q13: multiply first, then collect like terms
    '4e-mixed': `
      <p class="hp-tag">Worked example: simplify <b>7a × 8b − 9b × 6a</b></p>
      ${steps(
        `<p><strong>Do each multiplication first.</strong> × comes before −.</p>
         ${sum(`${now('7a × 8b')} = 56ab<br>${now('9b × 6a')} = 54ab`)}`,
        `<p><strong>Now they are like terms</strong> (ab and ba match), so take away.</p>
         ${sum('56ab − 54ab = 2ab')}
         ${ans('2ab')}`
      )}
      ${tip('If the two terms are equal, they cancel out and the answer is 0.')}`,

    // =====================================================================
    // 4F Expanding brackets
    // =====================================================================
    // 4F Q1, Q10: area of a split rectangle
    '4f-rect': `
      <p class="hp-tag">Worked example: write the area of this rectangle with and without brackets.</p>
      ${fig({ kind: 'rect', cols: [['k', 2], ['7', 1]], rows: [['5', 1]], cells: [['5k', '35']] })}
      ${steps(
        `<p><strong>With brackets: the whole length times the width.</strong> The whole length is k + 7.</p>
         ${sum('5(k + 7)')}`,
        `<p><strong>Without brackets: add the two parts.</strong></p>
         ${sum('5 × k = 5k and 5 × 7 = 35')}
         ${ans('5(k + 7) = 5k + 35')}`
      )}
      <p><strong>Two brackets?</strong> Split the rectangle both ways and find all four parts. For (a + 2)(b + 8):</p>
      ${fig({ kind: 'rect', cols: [['b', 2], ['8', 1]], rows: [['a', 2], ['2', 1]], cells: [['ab', '8a'], ['2b', '16']] })}
      ${sum('ab + 8a + 2b + 16')}
      ${tip('Type a number touching a bracket for "times", like 5(k+7).')}`,

    // 4F Q2, Q3, Q4: the distributive law
    '4f-expand': `
      <p class="hp-tag">Worked example: expand <b>7(8r − 5)</b></p>
      ${steps(
        `<p><strong>Multiply the number outside by the first term inside.</strong></p>
         ${sum(`${now('7')}(${now('8r')} − 5): 7 × 8r = 56r`)}`,
        `<p><strong>Multiply it by the second term too.</strong> Keep the sign in front of it.</p>
         ${sum(`${now('7')}(8r − ${now('5')}): 7 × 5 = 35, and it is still a take away`)}`,
        `<p><strong>Write both parts.</strong></p>
         ${ans('56r − 35')}`
      )}
      ${tip('The number outside multiplies everything inside, not just the first term. When the letter comes second, the order stays: 9(6 − t) = 54 − 9t.')}`,

    // 4F Q5: a letter outside the brackets
    '4f-letter': `
      <p class="hp-tag">Worked example: expand <b>2t(8a − b)</b></p>
      ${steps(
        `<p><strong>Multiply 2t by the first term.</strong> Numbers, then letters in alphabetical order.</p>
         ${sum('2t × 8a = 16at')}`,
        `<p><strong>Multiply 2t by the second term</strong>, keeping the − sign.</p>
         ${sum('2t × b = 2bt')}`,
        `<p><strong>Write both parts.</strong></p>
         ${ans('16at − 2bt')}`
      )}
      ${tip('A letter on its own outside still multiplies everything: p(q + 7) = pq + 7p. Type it as pq+7p.')}`,

    // 4F Q6, Q7, Q9: write with brackets, then expand
    '4f-words': `
      <p class="hp-tag">Worked example: a number, <b>n</b>, has <b>9</b> added to it and the result is multiplied by <b>6</b>.</p>
      ${steps(
        `<p><strong>Write the first step.</strong></p>
         ${sum('n + 9')}`,
        `<p><strong>"The result" goes in brackets</strong>, then multiply.</p>
         ${sum('6(n + 9)')}`,
        `<p><strong>Expand.</strong></p>
         ${sum('6 × n = 6n and 6 × 9 = 54')}
         ${ans('6n + 54')}`
      )}
      ${tip('Groups work the same way. If s students and t teachers each get 5 badges, that is 5(s + t) = 5s + 5t badges.')}`,

    // 4F Q8, Q12: missing numbers in brackets
    '4f-missing': `
      <p class="hp-tag">Worked example: <b>2(□x + 28y) = 16x + 56y</b>. What goes in the box?</p>
      ${steps(
        `<p><strong>Match the x terms.</strong> 2 times the box makes 16.</p>
         ${sum('2 × □ = 16, so □ = 8')}`,
        `<p><strong>Check the other term.</strong></p>
         ${sum('2 × 28y = 56y ✓')}
         ${ans('8')}`
      )}
      <p><strong>How many ways?</strong> The number outside must go into both 16 and 56. Their common factors are 1, 2, 4 and 8, so there are 4 ways with whole numbers: 1(16x + 56y), 2(8x + 28y), 4(4x + 14y), 8(2x + 7y).</p>
      ${tip('If fractions are allowed, any number can go outside. For example, 32(0.5x + 1.75y) also works.')}`,

    // 4F Q11: multiplying by 99
    '4f-99': `
      <p class="hp-tag">Worked example: work out <b>46 × 99</b></p>
      ${steps(
        `<p><strong>99 is 100 − 1</strong>, so 99n = 100n − n.</p>
         ${sum('46 × 99 = 46 × 100 − 46')}`,
        `<p><strong>Multiply by 100, then take away the number once.</strong></p>
         ${sum('4600 − 46 = 4554')}
         ${ans('4554')}`
      )}
      ${tip('The same trick works for 101: 101n = 100n + n, so 46 × 101 = 4600 + 46 = 4646.')}`,

    // =====================================================================
    // 4G Applying algebra
    // =====================================================================
    // 4G Q1, Q2, Q5: substituting into a formula
    '4g-formula': `
      <p class="hp-tag">Worked example: a cyclist rides at <b>24</b> km/h, so in <b>t</b> hours she rides <b>24t</b> km. How far does she ride in 45 minutes?</p>
      ${steps(
        `<p><strong>Get the units to match.</strong> t is in hours, so change 45 minutes into hours.</p>
         ${sum('45 minutes = 45/60 = 0.75 hours')}`,
        `<p><strong>Substitute and work it out.</strong></p>
         ${sum('24 × 0.75 = 18')}
         ${ans('18')}`
      )}
      <p><strong>Perimeter formulas work the same way.</strong> A regular pentagon with side s has perimeter 5s. If s = 11 cm, the perimeter is 5 × 11 = 55 cm.</p>
      ${tip('Write the expression first, then swap each letter for its number. 30 minutes is 0.5 hours and 15 minutes is 0.25 hours.')}`,

    // 4G Q3, Q4, Q7, Q12, Q13: writing an expression from words
    '4g-write': `
      <p class="hp-tag">Worked example: pens cost <b>$p</b> each. Write the cost of (a) 9 pens, (b) 3 boxes of 10 pens, (c) n pens.</p>
      ${steps(
        `<p><strong>Cost = number of items × price.</strong></p>
         ${sum('(a) 9 × p = 9p')}`,
        `<p><strong>Work out how many items first.</strong> 3 boxes of 10 is 30 pens.</p>
         ${sum('(b) 30 × p = 30p')}`,
        `<p><strong>A letter for the number works the same way.</strong></p>
         ${sum('(c) n × p = np')}
         ${ans('9p, 30p, np')}`
      )}
      ${tip('If a price changes, change the letter. If the pen price triples, each pen costs 3p, so n pens cost 3np.')}`,

    // 4G Q6, Q8, Q9, Q10, Q14: a fixed fee plus a rate
    '4g-fee': `
      <p class="hp-tag">Worked example: a plumber charges a <b>$60</b> call-out fee plus <b>$80</b> per hour.</p>
      ${steps(
        `<p><strong>The fee is paid once. The rate is paid for every hour.</strong></p>
         ${sum('cost = 60 + 80h')}`,
        `<p><strong>Substitute the number of hours.</strong> For 3 hours:</p>
         ${sum(`60 + ${now('80 × 3')} = 60 + 240 = 300`)}
         ${ans('$300')}`
      )}
      ${fig({ kind: 'table', rows: [['Hours', '1', '2', '3'], ['Cost ($)', '140', '220', '300']] })}
      <p><strong>Working backwards:</strong> how many hours for $460? Take off the fee, then divide by the rate: 460 − 60 = 400, 400 ÷ 80 = 5 hours. The average cost per hour for a 2-hour job is 220 ÷ 2 = $110.</p>
      ${tip('Cents to dollars: divide by 100. So 430 cents is $4.30, and a cost of 30 + 20t cents is 0.3 + 0.2t dollars.')}`,

    // 4G Q11: points for two kinds of score
    '4g-score': `
      <p class="hp-tag">Worked example: in Aussie Rules a goal is worth 6 points and a behind is worth 1. A team kicks <b>g</b> goals and <b>b</b> behinds, so it scores <b>6g + b</b>.</p>
      ${steps(
        `<p><strong>Substitute.</strong> 4 goals and 7 behinds:</p>
         ${sum('6 × 4 + 7 = 24 + 7 = 31')}`,
        `<p><strong>Find every way to make a score.</strong> For 13 points, try g = 0, 1, 2, ... and see what b has to be.</p>
         ${sum('g = 0, b = 13<br>g = 1, b = 7<br>g = 2, b = 1<br>g = 3 is 18, too many')}
         ${ans('3 ways')}`
      )}
      ${tip('Count up one letter at a time so you do not miss a pair. Read the question carefully: "how many other pairs" means leave out the one it already gave you.')}`,

    // 4G Q15: comparing two plans
    '4g-plans': `
      <p class="hp-tag">Worked example: Plan A costs <b>30</b> cents plus <b>40</b> cents a minute. Plan B costs <b>80</b> cents plus <b>30</b> cents a minute.</p>
      ${fig({ kind: 'table', rows: [['Plan', 'A', 'B'], ['Connection fee', '30 cents', '80 cents'], ['Cost per minute', '40 cents', '30 cents']] })}
      ${steps(
        `<p><strong>Write an expression for each plan.</strong></p>
         ${sum('A: 30 + 40t &nbsp; B: 80 + 30t')}`,
        `<p><strong>Make a table of costs.</strong> Substitute t = 1, 2, 3, ... into each expression.</p>
         ${fig({ kind: 'table', rows: [['Minutes', '1', '2', '3', '4', '5'], ['Plan A (cents)', '70', '110', '150', '190', '230'], ['Plan B (cents)', '110', '140', '170', '200', '230']] })}`,
        `<p><strong>Read the table.</strong> For 2 minutes, A costs 110 cents and B costs 140 cents, so A is cheaper. The two rows are equal at 5 minutes: both cost 230 cents.</p>
         ${ans('5')}`
      )}
      ${tip('Keep adding columns until the rows meet. After that, the plan with the smaller cost per minute is cheaper.')}`,
  });
})();
