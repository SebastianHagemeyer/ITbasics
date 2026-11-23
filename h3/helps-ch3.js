/* H3 "How do I work this out?" panels for Chapter 3 (3A to 3L).
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 3A to 3F. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 3A Introduction to fractions
    // =====================================================================
    // 3A Q1, Q2, Q8: what fraction of a picture is shaded
    '3a-shaded': `
      <p class="hp-tag">Worked example: what fraction of this pizza is shaded?</p>
      ${fig({ kind: 'pie', parts: 11, shaded: [0, 1, 4, 7] })}
      ${steps(
        `<p><strong>Count all the equal pieces.</strong> There are 11. That is the <b>denominator</b>, the bottom number.</p>`,
        `<p><strong>Count the shaded pieces.</strong> There are 4. That is the <b>numerator</b>, the top number. The shaded pieces do not have to sit next to each other.</p>`,
        `<p><strong>Write the top number over the bottom number.</strong> Type it with a slash.</p>
         ${ans('4/11')}`
      )}
      ${tip('A grid works the same way. Count every small square for the bottom number, then count the shaded squares for the top.')}`,

    // 3A Q3, Q6: reading fractions on a number line
    '3a-numberline': `
      <p class="hp-tag">Worked example: what fractions are at A and B?</p>
      ${fig({ kind: 'numberline', min: 0, max: 3, divisions: 6, points: { A: 13 / 6, B: 9 / 6 } })}
      ${steps(
        `<p><strong>Count the gaps between 0 and 1.</strong> There are 6 equal gaps, so each step is one-sixth. The denominator is 6.</p>`,
        `<p><strong>Count the steps from 0 to each dot.</strong> Keep counting past 1 and 2. Do not start again at each whole number.</p>
         ${sum('A: 13 steps from 0, so 13/6<br>B: 9 steps from 0, so 9/6')}`,
        `<p><strong>Write them in letter order</strong>, separated by a comma.</p>
         ${ans('13/6, 9/6')}`
      )}
      ${tip('Each whole number is a full set of steps. 1 is 6/6, 2 is 12/6 and 3 is 18/6, so you can count on from a whole number to save time.')}`,

    // 3A Q4, Q11: which picture shows the fraction
    '3a-same': `
      <p class="hp-tag">Worked example: three of these show <b>2/5</b>. Which one does not?</p>
      ${fig({ kind: 'bar', parts: 5, shaded: [1, 3], caption: 'A' }, { kind: 'grid', rows: 2, cols: 5, shaded: [0, 3, 6, 9], caption: 'B' }, { kind: 'grid', rows: 3, cols: 5, shaded: [0, 2, 5, 6, 8, 11, 12, 14], caption: 'C' }, { kind: 'bar', parts: 10, shaded: [0, 1, 5, 6], caption: 'D' })}
      ${steps(
        `<p><strong>Write a fraction for each picture.</strong> Count all the equal parts, then the shaded parts.</p>
         ${sum('A: 2/5 &nbsp; B: 4/10 &nbsp; C: 8/15 &nbsp; D: 4/10')}`,
        `<p><strong>Check each one against 2/5.</strong> Ten parts means every fifth is cut into 2, so 2 fifths is 4 tenths. B and D match. In C, 15 parts means every fifth is 3 squares, so 2/5 would be 6 squares, not 8.</p>
         ${ans('C')}`
      )}
      ${tip('The shaded parts can be spread out. Only the counts matter: how many parts are shaded, out of how many equal parts.')}`,

    // 3A Q5: fraction sequences
    '3a-sequence': `
      <p class="hp-tag">Worked example: write the next three fractions in <b>3/11, 5/11, 7/11, 9/11, ...</b></p>
      ${steps(
        `<p><strong>Look at what changes.</strong> The bottom number stays 11. The top number goes up by 2 each time.</p>
         ${flow(['', '3/11'], ['+ 2/11', '5/11'], ['+ 2/11', '7/11'], ['+ 2/11', '9/11'])}`,
        `<p><strong>Keep the pattern going</strong>, even past 1.</p>
         ${sum('9 + 2 = 11, then 13, then 15')}
         ${ans('11/11, 13/11, 15/11')}`
      )}
      ${tip('Keep the same bottom number all the way. Write 11/11, not 1. If the tops get smaller, take away each time.')}`,

    // 3A Q7, Q10: the fraction line means divide; fractions worth whole numbers
    '3a-value': `
      <p class="hp-tag">Worked example: what is <b>15/5</b> worth?</p>
      ${steps(
        `<p><strong>The line in a fraction means divide.</strong> 15/5 means 15 ÷ 5.</p>
         ${sum('15 ÷ 5 = 3')}
         ${ans('3')}`,
        `<p><strong>Going backwards: find ? in ?/8 = 3.</strong> ? ÷ 8 must make 3, so multiply instead.</p>
         ${sum('8 × 3 = 24, so 24/8 = 3')}`
      )}
      ${tip('When the top and bottom are the same, the fraction is worth exactly 1. For example, 8/8 = 8 ÷ 8 = 1.')}`,

    // 3A Q9: fraction of a total in a story
    '3a-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Mila spends <span class="hp-hl">7</span> hours of a <span class="hp-kw">day</span> at school. What fraction of the day is that?</p>
      ${steps(
        `<p><strong>Find the whole amount.</strong> That goes on the bottom. A day has 24 hours.</p>`,
        `<p><strong>Find the part.</strong> That goes on top. Mila spends 7 hours at school.</p>`,
        `<p><strong>Write part over whole.</strong></p>
         ${ans('7/24')}`
      )}
      ${tip('Watch for totals hidden in words. A day is 24 hours, a fortnight is 14 days and an hour is 60 minutes.')}`,

    // 3A Q12: the cordial puzzle
    '3a-cordial': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A <span class="hp-hl">360</span> mL glass of juice is <span class="hp-hl">3</span> parts water to <span class="hp-hl">1</span> part syrup. Tom drinks <span class="hp-hl">80</span> mL, then tops it up with 80 mL of water. What fraction is syrup now?</p>
      ${steps(
        `<p><strong>Add up the parts.</strong> 3 + 1 = 4 parts, so syrup is 1/4 of the glass.</p>
         ${sum('1/4 of 360 mL = 360 ÷ 4 = 90 mL of syrup')}`,
        `<p><strong>Find the syrup Tom drinks.</strong> A quarter of every sip is syrup.</p>
         ${sum('80 ÷ 4 = 20 mL drunk<br>90 − 20 = 70 mL of syrup left')}`,
        `<p><strong>Water adds no syrup.</strong> The glass is full again, so it is 70 mL of syrup out of 360 mL.</p>
         ${ans('70/360')}`
      )}
      ${tip('Topping up with water adds no syrup. Topping up with syrup adds all of the top-up to the syrup.')}`,

    // =====================================================================
    // 3B Equivalent fractions and simplified fractions
    // =====================================================================
    // 3B Q1 to Q4: missing numbers in equivalent fractions
    '3b-equiv': `
      <p class="hp-tag">Worked example: <b>2/9 = ?/81</b></p>
      ${steps(
        `<p><strong>Look at the pair you know both of.</strong> Here it is the bottoms: what turns 9 into 81?</p>
         ${sum('9 × 9 = 81')}`,
        `<p><strong>Do the same to the other number.</strong> Whatever you do to the bottom, do to the top.</p>
         ${sum('2 × 9 = 18, so 2/9 = 18/81')}
         ${ans('18')}`
      )}
      <p><strong>Going down works the same way.</strong> For 48/54 = ?/9: 54 ÷ 6 = 9, so divide the top by 6 too. 48 ÷ 6 = 8, so the answer is 8.</p>
      ${tip('The missing number can be on the top or the bottom. For 9/11 = 54/?, the tops go 9 × 6 = 54, so the bottom is 11 × 6 = 66.')}`,

    // 3B Q5, Q7, Q9: simplest form
    '3b-simplify': `
      <p class="hp-tag">Worked example: write <b>45/72</b> in simplest form.</p>
      ${steps(
        `<p><strong>Find the highest common factor (HCF).</strong> That is the biggest number that divides into both. Both 45 and 72 are in the 9 times table.</p>`,
        `<p><strong>Divide the top and the bottom by it.</strong></p>
         ${sum('45 ÷ 9 = 5<br>72 ÷ 9 = 8')}`,
        `<p><strong>Check nothing else divides both.</strong> 5 and 8 share no factor except 1, so you are done.</p>
         ${ans('5/8')}`
      )}
      <p>In a story, write <strong>part over total</strong> first, then simplify. In a list, test each fraction: if its top and bottom share a factor, it is the one that is not simplest.</p>
      ${tip('You do not have to find the HCF straight away. Divide by any number that goes into both, and keep going until nothing does. If the bottom becomes 1, type the whole number: 84/12 = 7.')}`,

    // 3B Q6: are two fractions equivalent?
    '3b-same': `
      <p class="hp-tag">Worked example: are <b>4/18</b> and <b>12/54</b> equivalent?</p>
      ${steps(
        `<p><strong>Simplify the first fraction.</strong> 2 goes into both.</p>
         ${sum('4/18 = 2/9')}`,
        `<p><strong>Simplify the second fraction.</strong> 6 goes into both.</p>
         ${sum('12/54 = 2/9')}`,
        `<p><strong>Compare.</strong> Both simplify to 2/9, so they are equal.</p>
         ${ans('=')}`
      )}
      ${tip('If the two fractions simplify to different answers, they are not equivalent, so choose ≠.')}`,

    // 3B Q8, Q10, Q11: a fraction of an amount
    '3b-of-amount': `
      <p class="hp-tag">Worked example: a <b>60</b>-litre tank is <b>5/6</b> full. How many litres are in it?</p>
      ${steps(
        `<p><strong>Divide by the bottom number</strong> to find one part.</p>
         ${sum('1/6 of 60 = 60 ÷ 6 = 10')}`,
        `<p><strong>Multiply by the top number</strong> to get the parts you want.</p>
         ${sum('5/6 of 60 = 5 × 10 = 50')}
         ${ans('50')}`
      )}
      ${fig({ kind: 'bar', parts: 6, shaded: 5, alt: 'A bar in 6 equal parts with 5 shaded' })}
      ${tip('To find what is left over, take your answer away from the whole. Here 60 − 50 = 10 litres of the tank is empty.')}`,

    // 3B Q12: working back from a simplified fraction
    '3b-reverse': `
      <p class="hp-tag">Worked example: a fraction simplifies to <b>2/9</b>. Its denominator was <b>81</b>. What was its numerator?</p>
      ${steps(
        `<p><strong>Find what the bottom was multiplied by.</strong></p>
         ${sum('81 ÷ 9 = 9')}`,
        `<p><strong>Multiply the top by the same number.</strong></p>
         ${sum('2 × 9 = 18, so the fraction was 18/81')}
         ${ans('18')}`
      )}
      <p><strong>If you know the top and bottom add to 66:</strong> 2/9 has 2 + 9 = 11 parts. 66 ÷ 11 = 6, so multiply both by 6 to get 12/54. Check: 12 + 54 = 66.</p>
      ${tip('Always check by simplifying your answer. It should come back to the fraction in the question.')}`,

    // 3B Q13: note lengths in music
    '3b-music': `
      <p>Write each note as a fraction of one bar of 4/4 time.</p>
      ${chips(['whole note = 1'], ['half note = 1/2'], ['quarter note = 1/4'], ['eighth note = 1/8'], ['sixteenth note = 1/16'])}
      <p class="hp-tag">Worked example: a bar starts with one eighth note. How many sixteenth notes fill the rest of the bar?</p>
      ${steps(
        `<p><strong>Change everything to the smallest note.</strong> One eighth is the same as two sixteenths.</p>
         ${sum('1/8 = 2/16')}
         ${fig({ kind: 'bar', parts: 16, shaded: 2, alt: 'A bar in 16 parts with 2 shaded' })}`,
        `<p><strong>Find what is left of the bar.</strong> A whole bar is 16/16.</p>
         ${sum('16/16 − 2/16 = 14/16, so 14 sixteenth notes')}
         ${ans('14')}`
      )}
      ${tip('To give the leftover part as a fraction in simplest form, simplify it: 14/16 = 7/8 of the bar.')}`,

    // =====================================================================
    // 3C Mixed numerals and improper fractions
    // =====================================================================
    // 3C Q1, Q2: mixed numeral to improper fraction
    '3c-to-improper': `
      <p class="hp-tag">Worked example: write <b>4 2/7</b> as an improper fraction.</p>
      ${fig({ kind: 'bar', parts: 7, shaded: 7 }, { kind: 'bar', parts: 7, shaded: 7 }, { kind: 'bar', parts: 7, shaded: 7 }, { kind: 'bar', parts: 7, shaded: 7 }, { kind: 'bar', parts: 7, shaded: 2 })}
      ${steps(
        `<p><strong>Change the wholes into sevenths.</strong> Each whole is 7 sevenths.</p>
         ${sum('4 × 7 = 28 sevenths')}`,
        `<p><strong>Add the extra sevenths.</strong></p>
         ${sum('28 + 2 = 30 sevenths')}`,
        `<p><strong>Keep the same bottom number.</strong></p>
         ${ans('30/7')}`
      )}
      ${tip('Quick way: whole number × bottom, plus top, all over the bottom. Type the answer with a slash, like 30/7.')}`,

    // 3C Q3, Q6: improper fraction to mixed numeral
    '3c-to-mixed': `
      <p class="hp-tag">Worked example: write <b>22/7</b> as a mixed numeral.</p>
      ${steps(
        `<p><strong>Divide the top by the bottom.</strong> How many whole groups of 7 fit in 22?</p>
         ${sum('22 ÷ 7 = 3 remainder 1')}`,
        `<p><strong>The answer is the whole number.</strong> The remainder is the top of the fraction, over the same bottom.</p>
         ${fig({ kind: 'numberline', min: 0, max: 4, divisions: 7, points: { '22/7': 22 / 7 } })}
         ${ans('3 1/7')}`
      )}
      ${tip('Type a mixed numeral with a space: 3 1/7. It also tells you where the number sits: 3 1/7 is between 3 and 4, so for those questions type 3, 4.')}`,

    // 3C Q4: improper fraction to mixed numeral in simplest form
    '3c-mixed-simplest': `
      <p class="hp-tag">Worked example: write <b>34/8</b> as a mixed numeral in simplest form.</p>
      ${steps(
        `<p><strong>Divide the top by the bottom.</strong></p>
         ${sum('34 ÷ 8 = 4 remainder 2, so 34/8 = 4 2/8')}`,
        `<p><strong>Simplify the fraction part.</strong> 2 goes into both 2 and 8.</p>
         ${sum('2/8 = 1/4')}
         ${ans('4 1/4')}`
      )}
      ${tip('You can simplify first instead: 34/8 = 17/4, and 17 ÷ 4 = 4 remainder 1. You get 4 1/4 either way.')}`,

    // 3C Q5: matching numbers to letters on a number line
    '3c-numberline': `
      <p class="hp-tag">Worked example: find <b>9/7</b>, <b>2 3/7</b> and <b>4/7</b> on this number line.</p>
      ${fig({ kind: 'numberline', min: 0, max: 3, divisions: 7, points: { A: 17 / 7, B: 4 / 7, C: 9 / 7 } })}
      ${steps(
        `<p><strong>Count the gaps in one whole.</strong> There are 7, so each step is one-seventh.</p>`,
        `<p><strong>Change improper fractions to mixed numerals.</strong> Then find the whole number and count on.</p>
         ${sum('9/7 = 1 2/7: 2 steps past 1 → C<br>2 3/7: 3 steps past 2 → A<br>4/7: 4 steps past 0 → B')}`,
        `<p><strong>Write the letters in the same order as the list.</strong></p>
         ${ans('C, A, B')}`
      )}
      ${tip('A fraction like 14/7 is a whole number: 14 ÷ 7 = 2, so it sits right on the 2.')}`,

    // 3C Q7: pizza slices as mixed numerals
    '3c-pizza': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story"><span class="hp-hl">3</span> pizzas are each cut into <span class="hp-hl">8</span> slices. Mia eats 4 slices, Leo eats 6 and Jo eats 5. How many pizzas do they eat, and how many are left?</p>
      ${steps(
        `<p><strong>Count the slices eaten.</strong> Each slice is 1/8 of a pizza.</p>
         ${sum('4 + 6 + 5 = 15 slices = 15/8 pizzas')}`,
        `<p><strong>Change to a mixed numeral.</strong></p>
         ${sum('15 ÷ 8 = 1 remainder 7, so 1 7/8 pizzas eaten')}`,
        `<p><strong>Find what is left.</strong> There were 3 × 8 = 24 slices.</p>
         ${sum('24 − 15 = 9 slices = 9/8 = 1 1/8 pizzas left')}
         ${ans('1 7/8 eaten, 1 1/8 left')}`
      )}
      ${tip('Type a mixed numeral with a space, like 1 7/8. Check: 1 7/8 + 1 1/8 = 3 whole pizzas.')}`,

    // 3C Q8: shaded circles as improper fractions and mixed numerals
    '3c-picture': `
      <p class="hp-tag">Worked example: each circle is one whole. Write the shaded amount two ways.</p>
      ${fig({ kind: 'pie', parts: 5, shaded: 5 }, { kind: 'pie', parts: 5, shaded: 5 }, { kind: 'pie', parts: 5, shaded: 2 })}
      ${steps(
        `<p><strong>Improper fraction: count every shaded piece.</strong> Each piece is one-fifth.</p>
         ${sum('5 + 5 + 2 = 12 fifths = 12/5')}`,
        `<p><strong>Mixed numeral: count the full circles, then the extra pieces.</strong> 2 full circles and 2 more fifths.</p>
         ${ans('2 2/5')}`
      )}
      ${tip('Both answers are the same amount. Type the improper one as 12/5 and the mixed one with a space, as 2 2/5.')}`,

    // 3C Q9: sandwich pieces with letters
    '3c-algebra': `
      <p class="hp-tag">Worked example: Zac has <b>5</b> sandwiches cut into quarters. He eats all but one quarter. How many quarters does he eat?</p>
      ${steps(
        `<p><strong>Find all the pieces.</strong> Each sandwich makes 4 quarters.</p>
         ${sum('5 × 4 = 20 quarters')}`,
        `<p><strong>Take away the one he leaves.</strong></p>
         ${sum('20 − 1 = 19')}
         ${ans('19')}`
      )}
      <p><strong>With a letter:</strong> if Zac has <b>k</b> sandwiches cut into quarters, there are 4 × k pieces. Eating all but one is 4k − 1.</p>
      ${tip('Write the number in front of the letter: 4 × k is 4k. Two letters multiplied sit side by side, so a × b is ab. Type 4k-1.')}`,

    // 3C Q10: mixed numerals with a given numerator
    '3c-numerator': `
      <p class="hp-tag">Worked example: a mixed numeral in simplest form lies between <b>3</b> and <b>4</b>. As an improper fraction, its numerator is <b>23</b>. What could it be?</p>
      ${steps(
        `<p><strong>Try different bottom numbers.</strong> Divide 23 by each one and keep the answers that start with 3.</p>
         ${chips(['23/5 = 4 3/5 ✗'], ['23/6 = 3 5/6 ✓', 'add'], ['23/7 = 3 2/7 ✓', 'add'], ['23/8 = 2 7/8 ✗'])}`,
        `<p><strong>Check each one is in simplest form.</strong> 5/6 and 2/7 cannot be simplified, so both count.</p>
         ${ans('3 5/6, 3 2/7')}`
      )}
      ${tip('Bottom numbers that are too small give an answer over 4, and ones that are too big give an answer under 3. Stop testing once you pass the range.')}`,

    // 3C Q11: mixed numerals made from three digits
    '3c-digits': `
      <p class="hp-tag">Worked example: make three mixed numerals from the digits <b>2, 3, 9</b>, then find the difference between the largest and smallest.</p>
      ${steps(
        `<p><strong>Give each digit a turn as the whole number.</strong> The other two make a fraction less than 1, so the smaller one goes on top.</p>
         ${chips(['2 3/9'], ['3 2/9'], ['9 2/3'])}`,
        `<p><strong>Pick the largest and smallest.</strong> The whole number decides: 9 2/3 is largest and 2 3/9 is smallest.</p>`,
        `<p><strong>Take away the whole numbers, then the fractions.</strong> Change the thirds into ninths first.</p>
         ${sum('9 − 2 = 7<br>2/3 − 3/9 = 6/9 − 3/9 = 3/9 = 1/3<br>7 + 1/3 = 7 1/3')}
         ${ans('7 1/3')}`
      )}
      ${tip('If the fraction you are taking away is the bigger one, change both mixed numerals to improper fractions with the same bottom number, take away, then change back. Keep a fraction like 2 3/9 as it is when you list them.')}`,

    // =====================================================================
    // 3D Ordering fractions
    // =====================================================================
    // 3D Q1, Q2, Q8, Q9: comparing without a common denominator
    '3d-quick': `
      <p class="hp-tag">Worked example: <b>3/7 □ 3/11</b></p>
      ${fig({ kind: 'bar', parts: 7, shaded: 3, caption: '3/7' }, { kind: 'bar', parts: 11, shaded: 3, caption: '3/11' })}
      ${steps(
        `<p><strong>The tops are the same</strong>, so compare the sizes of the pieces. Cutting a whole into 7 makes bigger pieces than cutting it into 11.</p>`,
        `<p><strong>Three big pieces beat three small pieces.</strong></p>
         ${ans('&gt;')}`
      )}
      <p><strong>Same bottom number?</strong> The pieces are the same size, so just compare the tops: 6/13 &lt; 9/13. <strong>Mixed numerals?</strong> Compare the whole numbers first: 4 1/5 is bigger than 3 7/8.</p>
      ${tip('Sharing a pie between more people gives everyone a smaller piece.')}`,

    // 3D Q3, Q4: comparing with a common denominator
    '3d-compare': `
      <p class="hp-tag">Worked example: <b>4/7 □ 3/5</b></p>
      ${steps(
        `<p><strong>Find a common denominator.</strong> A number both 7 and 5 go into: 7 × 5 = 35. If one bottom number goes into the other, just use the bigger one.</p>`,
        `<p><strong>Rewrite both fractions as thirty-fifths.</strong></p>
         ${sum('4/7 = 20/35 (× 5 top and bottom)<br>3/5 = 21/35 (× 7 top and bottom)')}`,
        `<p><strong>Now compare the tops.</strong> 20 is less than 21.</p>
         ${ans('&lt;')}`
      )}
      ${tip('With mixed numerals, compare the whole numbers first, and only look at the fractions if they match. Change an improper fraction to a mixed numeral first, for example 11/5 = 2 1/5.')}`,

    // 3D Q5, Q6, Q7, Q10: putting fractions in order
    '3d-order': `
      <p class="hp-tag">Worked example: write <b>3/7, 5/14, 1/2</b> in ascending order.</p>
      ${steps(
        `<p><strong>Pick a common denominator.</strong> 7 and 2 both go into 14.</p>
         ${sum('3/7 = 6/14<br>5/14 stays 5/14<br>1/2 = 7/14')}`,
        `<p><strong>Sort by the tops</strong>, smallest first: 5, 6, 7.</p>`,
        `<p><strong>Write the original fractions in that order.</strong></p>
         ${ans('5/14, 3/7, 1/2')}`
      )}
      <p><strong>Mixed numerals in the list?</strong> Change everything to mixed numerals and sort by whole number first. Only compare the fractions when the whole numbers match.</p>
      ${tip('Ascending means smallest first. Descending means largest first. In a race, the fastest runner has the smallest time.')}`,

    // 3D Q11: patterns with a common denominator
    '3d-pattern': `
      <p class="hp-tag">Worked example: write the next two fractions in <b>3/14, 2/7, 5/14, ___, ___</b></p>
      ${steps(
        `<p><strong>Give them all the lowest common denominator.</strong> 7 goes into 14.</p>
         ${sum('3/14, 4/14, 5/14')}`,
        `<p><strong>Spot the pattern.</strong> The tops go up by 1 each time.</p>
         ${sum('6/14, then 7/14')}`,
        `<p><strong>Simplify the answers.</strong></p>
         ${sum('6/14 = 3/7 &nbsp; 7/14 = 1/2')}
         ${ans('3/7, 1/2')}`
      )}
      ${tip('Some patterns go down instead of up. Check whether the tops are getting bigger or smaller.')}`,

    // 3D Q12, Q13: a fraction between two fractions
    '3d-between': `
      <p class="hp-tag">Worked example: find a fraction between <b>5/7</b> and <b>6/7</b>.</p>
      ${steps(
        `<p><strong>No room with sevenths?</strong> 5/7 and 6/7 sit right next to each other, so make the pieces smaller.</p>`,
        `<p><strong>Double the top and bottom of both.</strong></p>
         ${sum('5/7 = 10/14<br>6/7 = 12/14')}
         ${fig({ kind: 'numberline', min: 0, max: 1, divisions: 14, points: { '5/7': 10 / 14, '?': 11 / 14, '6/7': 12 / 14 } })}`,
        `<p><strong>Pick the one in the gap.</strong></p>
         ${ans('11/14')}`
      )}
      ${tip('If the question gives you a denominator, change both ends into it. Between 5/7 and 1 with denominator 14 means between 10/14 and 14/14, so 11/14, 12/14 or 13/14 all work.')}`,

    // 3D Q14: fractions strictly between two numbers
    '3d-whole': `
      <p class="hp-tag">Worked example: which whole numbers can ? be, so that <b>?/6</b> lies between <b>2</b> and <b>3</b>?</p>
      ${steps(
        `<p><strong>Change both ends into sixths.</strong></p>
         ${sum('2 = 12/6<br>3 = 18/6')}`,
        `<p><strong>List the tops in between.</strong> Strictly between means 12 and 18 themselves do not count.</p>
         ${ans('13, 14, 15, 16, 17')}`
      )}
      ${tip('A mixed numeral works too. For ?/9 between 1 and 1 1/3: 1 = 9/9 and 1 1/3 = 12/9, so ? can be 10 or 11.')}`,

    // 3D Q15: shaded designs
    '3d-shady': `
      <p class="hp-tag">Worked example: what fraction of this rectangle is shaded?</p>
      ${fig({ kind: 'grid', rows: 3, cols: 6, shaded: [0, 1, 2, 6, 7, 12, 13, 14, 15, 16] })}
      ${steps(
        `<p><strong>Count all the squares.</strong> 3 rows of 6 makes 18.</p>`,
        `<p><strong>Count the shaded squares.</strong> There are 10.</p>
         ${sum('10/18')}`,
        `<p><strong>Simplify.</strong> 2 goes into both.</p>
         ${sum('10/18 = 5/9')}
         ${ans('5/9')}`
      )}
      ${tip('Count the white squares as well. Shaded plus white should make the total.')}`,

    // =====================================================================
    // 3E Adding fractions
    // =====================================================================
    // 3E Q1: same denominator
    '3e-same': `
      <p class="hp-tag">Worked example: <b>3/14 + 5/14</b></p>
      ${fig({ kind: 'bar', parts: 14, shaded: 8, alt: 'A bar in 14 parts with 8 shaded' })}
      ${steps(
        `<p><strong>The bottoms are the same</strong>, so the pieces are the same size. Add the tops and keep the bottom.</p>
         ${sum('3/14 + 5/14 = 8/14')}`,
        `<p><strong>Simplify if you can.</strong> 2 goes into 8 and 14.</p>
         ${sum('8/14 = 4/7')}
         ${ans('4/7')}`
      )}
      ${tip('Never add the bottom numbers. 3 pieces plus 5 pieces is 8 pieces, and they are still fourteenths.')}`,

    // 3E Q2: same denominator, answer more than 1
    '3e-same-mixed': `
      <p class="hp-tag">Worked example: <b>4/5 + 4/5 + 3/5</b> as a mixed numeral.</p>
      ${steps(
        `<p><strong>Add the tops and keep the bottom.</strong></p>
         ${sum('4 + 4 + 3 = 11, so 11/5')}`,
        `<p><strong>Change to a mixed numeral.</strong> Every 5 fifths make a whole.</p>
         ${sum('11 ÷ 5 = 2 remainder 1, so 2 1/5')}
         ${fig({ kind: 'pie', parts: 5, shaded: 5 }, { kind: 'pie', parts: 5, shaded: 5 }, { kind: 'pie', parts: 5, shaded: 1 })}
         ${ans('2 1/5')}`
      )}
      ${tip('Type a mixed numeral with a space, like 2 1/5. Simplify the fraction part if you can.')}`,

    // 3E Q3, Q4: different denominators
    '3e-diff': `
      <p class="hp-tag">Worked example: <b>1/2 + 2/7</b></p>
      ${steps(
        `<p><strong>Find a common denominator.</strong> 2 and 7 both go into 14.</p>`,
        `<p><strong>Rewrite both fractions as fourteenths.</strong></p>
         ${sum('1/2 = 7/14 &nbsp; 2/7 = 4/14')}
         ${fig({ kind: 'bar', parts: 14, shaded: 7, caption: '1/2 = 7/14' }, { kind: 'bar', parts: 14, shaded: 4, caption: '2/7 = 4/14' })}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('7/14 + 4/14 = 11/14')}
         ${ans('11/14')}`
      )}
      <p><strong>More than 1?</strong> Change it to a mixed numeral at the end: 2/3 + 4/7 = 14/21 + 12/21 = 26/21 = 1 5/21.</p>
      ${tip('Multiplying the two bottoms always gives a common denominator. If a smaller number works, use it, so there is less to simplify.')}`,

    // 3E Q5: mixed numerals, same denominator
    '3e-mixed-same': `
      <p class="hp-tag">Worked example: <b>1 5/12 + 4 11/12</b></p>
      ${steps(
        `<p><strong>Add the whole numbers.</strong></p>
         ${sum('1 + 4 = 5')}`,
        `<p><strong>Add the fractions.</strong> If you get more than 1, turn it into a mixed numeral.</p>
         ${sum('5/12 + 11/12 = 16/12 = 1 4/12')}`,
        `<p><strong>Put them together and simplify.</strong></p>
         ${sum('5 + 1 4/12 = 6 4/12 = 6 1/3')}
         ${ans('6 1/3')}`
      )}
      ${tip('Type a mixed numeral with a space, like 6 1/3. Always check if the fraction part simplifies.')}`,

    // 3E Q6, Q9: mixed numerals, different denominators
    '3e-mixed-diff': `
      <p class="hp-tag">Worked example: <b>5 4/7 + 4 1/2</b></p>
      ${steps(
        `<p><strong>Add the whole numbers.</strong></p>
         ${sum('5 + 4 = 9')}`,
        `<p><strong>Add the fractions with a common denominator.</strong></p>
         ${sum('4/7 + 1/2 = 8/14 + 7/14 = 15/14 = 1 1/14')}`,
        `<p><strong>Put them together.</strong></p>
         ${sum('9 + 1 1/14 = 10 1/14')}
         ${ans('10 1/14')}`
      )}
      <p><strong>Three mixed numerals?</strong> Add all the whole numbers, then all the fractions, then put them together.</p>
      ${tip('You can also change to improper fractions first: 39/7 + 9/2 = 78/14 + 63/14 = 141/14 = 10 1/14.')}`,

    // 3E Q7: mixed practice, simplest form
    '3e-simplest': `
      <p class="hp-tag">Worked example: <b>9/14 + 1/2</b>, in simplest form.</p>
      ${steps(
        `<p><strong>Does one bottom go into the other?</strong> 2 goes into 14, so change only the 1/2.</p>
         ${sum('1/2 = 7/14')}`,
        `<p><strong>Add the tops.</strong></p>
         ${sum('9/14 + 7/14 = 16/14')}`,
        `<p><strong>Change to a mixed numeral, then simplify.</strong></p>
         ${sum('16/14 = 1 2/14 = 1 1/7')}
         ${ans('1 1/7')}`
      )}
      ${tip('Answers less than 1 stay as a fraction. Answers more than 1 become a mixed numeral. Both need simplifying.')}`,

    // 3E Q8, Q10, Q11: fraction word problems
    '3e-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">In a class of <span class="hp-hl">42</span>, <span class="hp-hl">1/3</span> of the students walk to school and <span class="hp-hl">1/7</span> ride a bike. <span class="hp-kw">The rest</span> come by car. What fraction come by car, and how many students is that?</p>
      ${steps(
        `<p><strong>Add the fractions you know.</strong></p>
         ${sum('1/3 + 1/7 = 7/21 + 3/21 = 10/21')}`,
        `<p><strong>The whole class is 1, which is 21/21.</strong> Take away to find the rest.</p>
         ${sum('21/21 − 10/21 = 11/21 come by car')}`,
        `<p><strong>Find that fraction of 42.</strong> Divide by the bottom, multiply by the top.</p>
         ${sum('42 ÷ 21 = 2, and 2 × 11 = 22')}
         ${ans('22')}`
      )}
      ${tip('Read what the question asks for: a fraction, or a number of things. They can ask for both, one after the other.')}`,

    // 3E Q12: adding from a table, then ordering
    '3e-table': `
      <p class="hp-tag">Worked example: how much of a book did each student read? List the totals from least to most.</p>
      ${fig({ kind: 'table', rows: [['Student', 'Ben', 'Cara', 'Dev'], ['First night', '1/7', '2/7', '1/2'], ['Second night', '1/2', '3/14', '3/14']] })}
      ${steps(
        `<p><strong>Add each column, using fourteenths.</strong></p>
         ${sum('Ben: 2/14 + 7/14 = 9/14<br>Cara: 4/14 + 3/14 = 7/14<br>Dev: 7/14 + 3/14 = 10/14')}`,
        `<p><strong>Compare the tops</strong>, since the bottoms are all 14: 7, 9, 10.</p>`,
        `<p><strong>Simplify and list them.</strong></p>
         ${ans('1/2, 9/14, 5/7')}`
      )}
      ${tip('Keep every total over the same bottom number until you have finished comparing. Simplify at the very end.')}`,

    // 3E Q13: fill the boxes
    '3e-boxes': `
      <p class="hp-tag">Worked example: <b>1/□ + 1/□ = 13/40</b></p>
      ${steps(
        `<p><strong>See what adding two unit fractions does.</strong> With 1 on top, the new bottom is the two bottoms multiplied, and the new top is the two bottoms added.</p>
         ${sum('1/a + 1/b = (b + a)/(a × b)')}`,
        `<p><strong>Find two numbers that multiply to 40 and add to 13.</strong></p>
         ${chips(['2 and 20 ✗'], ['4 and 10 ✗'], ['5 and 8 ✓', 'add'])}`,
        `<p><strong>Check.</strong></p>
         ${sum('1/5 + 1/8 = 8/40 + 5/40 = 13/40 ✓')}
         ${ans('5, 8')}`
      )}
      ${tip('When the tops are not 1, try a number in one box, work out what the other box needs, and check it with a common denominator.')}`,

    // 3E Q14: biggest and smallest sums from digits
    '3e-digits': `
      <p class="hp-tag">Worked example: use the digits <b>1, 2, 3, 4</b> once each in <b>□/□ + □/□</b> to make the largest answer.</p>
      ${steps(
        `<p><strong>Big numbers on top, small numbers on the bottom.</strong> Put 3 and 4 on top, and 1 and 2 underneath.</p>`,
        `<p><strong>Try both ways of pairing them.</strong></p>
         ${sum('4/1 + 3/2 = 4 + 1 1/2 = 5 1/2<br>3/1 + 4/2 = 3 + 2 = 5')}`,
        `<p><strong>Pick the bigger one.</strong></p>
         ${ans('5 1/2')}`
      )}
      ${tip('For the smallest answer, do the opposite: small numbers on top, big numbers on the bottom. Then test every pairing, because the best one is not always obvious.')}`,

    // =====================================================================
    // 3F Subtracting fractions
    // =====================================================================
    // 3F Q1, Q2: same denominator
    '3f-same': `
      <p class="hp-tag">Worked example: <b>13/16 − 5/16</b></p>
      ${steps(
        `<p><strong>The bottoms are the same</strong>, so take away the tops and keep the bottom.</p>
         ${sum('13/16 − 5/16 = 8/16')}
         ${fig({ kind: 'bar', parts: 16, shaded: 8, alt: 'A bar in 16 parts with 8 shaded' })}`,
        `<p><strong>Simplify if you can.</strong> 8 goes into 8 and 16.</p>
         ${sum('8/16 = 1/2')}
         ${ans('1/2')}`
      )}
      ${tip('Taking a fraction away from itself leaves nothing, so the answer is 0.')}`,

    // 3F Q3, Q4: different denominators
    '3f-diff': `
      <p class="hp-tag">Worked example: <b>5/7 − 1/2</b></p>
      ${steps(
        `<p><strong>Find a common denominator.</strong> 7 and 2 both go into 14.</p>
         ${sum('5/7 = 10/14 &nbsp; 1/2 = 7/14')}`,
        `<p><strong>Take away the tops.</strong></p>
         ${sum('10/14 − 7/14 = 3/14')}
         ${ans('3/14')}`
      )}
      <p><strong>Does one bottom go into the other?</strong> Then change just one fraction: 11/14 − 2/7 = 11/14 − 4/14 = 7/14, which simplifies to 1/2.</p>
      ${tip('Always check the answer at the end. If the top and bottom share a factor, simplify.')}`,

    // 3F Q5: mixed numerals, no borrowing
    '3f-mixed': `
      <p class="hp-tag">Worked example: <b>9 6/7 − 4 1/2</b></p>
      ${steps(
        `<p><strong>Take away the whole numbers.</strong></p>
         ${sum('9 − 4 = 5')}`,
        `<p><strong>Take away the fractions with a common denominator.</strong></p>
         ${sum('6/7 − 1/2 = 12/14 − 7/14 = 5/14')}`,
        `<p><strong>Put them together.</strong></p>
         ${ans('5 5/14')}`
      )}
      ${tip('This only works when the first fraction part is bigger. If it is smaller, you need to borrow a whole first. Type the answer with a space, like 5 5/14.')}`,

    // 3F Q6, Q14: mixed numerals with borrowing
    '3f-borrow': `
      <p class="hp-tag">Worked example: <b>8 1/7 − 5 3/7</b></p>
      ${steps(
        `<p><strong>Check the fractions.</strong> 1/7 is smaller than 3/7, so you cannot take away yet.</p>`,
        `<p><strong>Borrow a whole.</strong> Take 1 from the 8 and turn it into 7/7.</p>
         ${sum('8 1/7 = 7 + 7/7 + 1/7 = 7 8/7')}`,
        `<p><strong>Now take away.</strong></p>
         ${sum('7 8/7 − 5 3/7 = 2 5/7')}
         ${ans('2 5/7')}`
      )}
      ${tip('Or change both to improper fractions: 57/7 − 38/7 = 19/7 = 2 5/7. With different denominators, make them the same before you check whether to borrow.')}`,

    // 3F Q7 to Q11: subtraction word problems
    '3f-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ana eats <span class="hp-hl">1/6</span> of a pizza and Ben eats <span class="hp-hl">4/9</span> of it. What fraction of the pizza is <span class="hp-kw">left</span>?</p>
      ${steps(
        `<p><strong>Add what is eaten</strong>, using a common denominator.</p>
         ${sum('1/6 + 4/9 = 3/18 + 8/18 = 11/18')}`,
        `<p><strong>The whole pizza is 1, which is 18/18.</strong> Take away what was eaten.</p>
         ${sum('18/18 − 11/18 = 7/18')}
         ${ans('7/18')}`
      )}
      <p>Given numbers of squares or pieces? Write the part over the total first, then simplify.</p>
      ${tip('For money, change the fraction of a dollar into cents. 1/5 of a dollar is 20 cents, so 4 1/5 dollars is $4.20. Type it as 4.20.')}`,

    // 3F Q12: fill the boxes
    '3f-boxes': `
      <p class="hp-tag">Worked example: <b>1/□ − 1/□ = 1/72</b></p>
      ${steps(
        `<p><strong>Look at the answer's bottom number.</strong> Two unit fractions next to each other, like 1/8 and 1/9, have a difference of 1 over the two bottoms multiplied.</p>`,
        `<p><strong>Find two numbers next to each other that multiply to 72.</strong></p>
         ${sum('8 × 9 = 72')}`,
        `<p><strong>Check.</strong> The bigger fraction has the smaller bottom, so it goes first.</p>
         ${sum('1/8 − 1/9 = 9/72 − 8/72 = 1/72 ✓')}
         ${ans('8, 9')}`
      )}
      ${tip('For the other puzzles, try a number in one box, work out what the other box needs, then check the whole statement.')}`,

    // 3F Q13: age puzzle
    '3f-ages': `
      <p class="hp-tag">Worked example: Kim is <b>1/4</b> of her dad's age. Her dad is in his thirties. In <b>4</b> years, Kim will be <b>1/3</b> of his age. How old are they?</p>
      ${steps(
        `<p><strong>List the ages that fit the first clue.</strong> Dad's age must be in the 4 times table.</p>
         ${chips(['Dad 32, Kim 8'], ['Dad 36, Kim 9'])}`,
        `<p><strong>Test the second clue.</strong> Add 4 years to both.</p>
         ${chips(['36 and 12: 12 is 1/3 of 36 ✓', 'add'], ['40 and 13 ✗', 'take'])}
         ${ans('Dad 32, Kim 8')}`,
        `<p><strong>The gap never changes.</strong> Dad is always 24 years older. Kim is half his age when she is 24 and he is 48, which is 16 years from now.</p>`
      )}
      ${tip('Write the ages in a table, one row per year. The gap between them stays the same every year.')}`
  });
})();

/* Help panels for 3G to 3L. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 3G Multiplying fractions
    // =====================================================================
    // 3G Q1: multiply tops, multiply bottoms
    '3g-multiply': `
      <p class="hp-tag">Worked example: <b>5/7 × 5/8</b></p>
      ${steps(
        `<p><strong>Multiply the numerators</strong> (the tops).</p>
         ${sum('5 × 5 = 25')}`,
        `<p><strong>Multiply the denominators</strong> (the bottoms).</p>
         ${sum('7 × 8 = 56')}`,
        `<p><strong>Write the new fraction and check it will not simplify.</strong> 25 and 56 share no common factor, so it is done.</p>
         ${ans('25/56')}`
      )}
      <p>As a picture: shade 5 of the 8 columns and 5 of the 7 rows. The overlap is 25 of the 56 squares.</p>
      ${fig({ kind: 'grid', rows: 7, cols: 8, shaded: [0, 1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36], alt: 'A 7 by 8 grid with a 5 by 5 block shaded' })}
      ${tip('You do not need a common denominator to multiply. That is only for adding and taking away.')}`,

    // 3G Q2, Q3: cancel common factors first
    '3g-cancel': `
      <p class="hp-tag">Worked example: <b>12/13 × 13/22</b></p>
      ${steps(
        `<p><strong>Look for a top and a bottom that share a factor.</strong> They can be in different fractions. The two 13s cancel to 1. 12 and 22 share 2.</p>
         ${sum('13 ÷ 13 = 1 and 13 ÷ 13 = 1<br>12 ÷ 2 = 6 and 22 ÷ 2 = 11')}`,
        `<p><strong>Multiply what is left.</strong></p>
         ${sum('6/1 × 1/11 = 6/11')}
         ${ans('6/11')}`
      )}
      ${tip('"Of" means ×, so 12/13 of 13/22 is the same question. Cancelling first keeps the numbers small, and the answer comes out already simplified.')}`,

    // 3G Q4: a fraction of a whole number
    '3g-of-whole': `
      <p class="hp-tag">Worked example: <b>2/3 of 45</b></p>
      ${steps(
        `<p><strong>Divide by the denominator</strong> to find one third.</p>
         ${sum('45 ÷ 3 = 15')}
         ${fig({ kind: 'bar', parts: 3, shaded: 2, caption: '45 in 3 parts: 15 each' })}`,
        `<p><strong>Multiply by the numerator</strong> to get two thirds.</p>
         ${sum('15 × 2 = 30')}
         ${ans('30')}`
      )}
      ${tip('2/3 × 45 means the same as 2/3 of 45. Dividing first keeps the numbers small.')}`,

    // 3G Q5: improper fractions, answer as a mixed numeral
    '3g-improper': `
      <p class="hp-tag">Worked example: <b>7/4 × 14/11</b></p>
      ${steps(
        `<p><strong>Cancel first.</strong> 14 and 4 share a factor of 2.</p>
         ${sum('7/4 × 14/11 = 7/2 × 7/11')}`,
        `<p><strong>Multiply the tops and the bottoms.</strong></p>
         ${sum('7 × 7 = 49<br>2 × 11 = 22')}`,
        `<p><strong>Change to a mixed numeral.</strong> How many 22s in 49? Two 22s make 44, with 5 left over.</p>
         ${sum('49/22 = 2 5/22')}
         ${ans('2 5/22')}`
      )}
      ${tip('Type a mixed numeral with a space: 2 5/22. If the bottom divides in exactly, the answer is a whole number, so just type that.')}`,

    // 3G Q6: mixed numerals
    '3g-mixed': `
      <p class="hp-tag">Worked example: <b>1 5/6 × 1 7/8</b></p>
      ${steps(
        `<p><strong>Change each mixed numeral to an improper fraction.</strong> Whole number × bottom, plus top.</p>
         ${sum('1 5/6 = 11/6 &nbsp;(1 × 6 + 5 = 11)<br>1 7/8 = 15/8 &nbsp;(1 × 8 + 7 = 15)')}`,
        `<p><strong>Cancel, then multiply.</strong> 15 and 6 share 3.</p>
         ${sum('11/6 × 15/8 = 11/2 × 5/8 = 55/16')}`,
        `<p><strong>Change back to a mixed numeral.</strong> Three 16s make 48, with 7 left over.</p>
         ${sum('55/16 = 3 7/16')}
         ${ans('3 7/16')}`
      )}
      ${tip('Do not just multiply the whole numbers and multiply the fractions. Here 1 × 1 = 1, but the real answer is more than 3.')}`,

    // 3G Q7 to Q10: word problems
    '3g-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A netball team played <span class="hp-hl">18</span> games and won <span class="hp-hl">5/6</span> of them. There were no draws. How many games did they <span class="hp-kw">lose</span>?</p>
      ${steps(
        `<p><strong>Find the fraction you need.</strong> Won and lost make one whole.</p>
         ${sum('1 − 5/6 = 1/6 lost')}`,
        `<p><strong>"Of" means multiply.</strong> Find 1/6 of 18.</p>
         ${sum('18 ÷ 6 = 3')}
         ${ans('3')}`
      )}
      ${chips(['of → ×', 'add'], ['the rest → 1 take away the fraction', 'take'], ['double, triple, 6 batches → × the whole number', 'add'])}
      ${tip('For a recipe, multiply the mixed numeral: 2 batches of 1 4/9 cups is 13/9 × 2 = 26/9 = 2 8/9 cups.')}`,

    // 3G Q11, Q12: is the statement right?
    '3g-check': `
      <p class="hp-tag">Worked example: is <b>1/3 + 1/7 = 2/10</b> correct?</p>
      ${steps(
        `<p><strong>Work out the real answer yourself.</strong> Adding needs a common denominator: 21.</p>
         ${sum('1/3 + 1/7 = 7/21 + 3/21 = 10/21')}`,
        `<p><strong>Compare.</strong> 2/10 comes from adding the tops and adding the bottoms, which is a common mistake.</p>
         ${ans('Incorrect')}`
      )}
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Sum</span><span role="columnheader">How</span><span role="columnheader">Answer</span></div>
        <div class="hp-tr" role="row"><span role="cell">1/3 + 1/7</span><span role="cell">common denominator</span><span role="cell">10/21</span></div>
        <div class="hp-tr" role="row"><span role="cell">1/3 − 1/7</span><span role="cell">common denominator</span><span role="cell">4/21</span></div>
        <div class="hp-tr" role="row"><span role="cell">1/3 × 1/7</span><span role="cell">tops × tops, bottoms × bottoms</span><span role="cell">1/21</span></div>
      </div>
      ${tip('For an "always" question, try a few examples, like 1/3 × 1/7 = 1/21 and 4/5 × 5/6 = 2/3, and look at what kind of number you get each time.')}`,

    // 3G Q13: missing fraction
    '3g-missing': `
      <p class="hp-tag">Worked example: <b>5/8 × □ = 1/2</b></p>
      ${steps(
        `<p><strong>Make the numerators match.</strong> Rename 1/2 so its top is 5, like 5/8.</p>
         ${sum('1/2 = 5/10')}`,
        `<p><strong>Ask what turns eighths into tenths.</strong> Put the 8 on top and the 10 underneath, so the 8s cancel.</p>
         ${sum('5/8 × 8/10 = 5/10')}`,
        `<p><strong>Simplify the box, then check.</strong></p>
         ${sum('8/10 = 4/5<br>Check: 5/8 × 4/5 = 4/8 = 1/2 ✓')}
         ${ans('4/5')}`
      )}
      ${tip('Always check by multiplying. If the box comes first, like □ × 5/8, it works the same way, because order does not matter when you multiply.')}`,

    // =====================================================================
    // 3H Dividing fractions
    // =====================================================================
    // 3H Q1, Q2, Q3: reciprocals
    '3h-reciprocal': `
      <p>The <strong>reciprocal</strong> of a fraction is the fraction flipped upside down.</p>
      <p class="hp-tag">Worked example: find the reciprocal of <b>3 2/7</b>.</p>
      ${steps(
        `<p><strong>Make it a single fraction first.</strong> Whole number × bottom, plus top.</p>
         ${sum('3 × 7 + 2 = 23, so 3 2/7 = 23/7')}`,
        `<p><strong>Flip it upside down.</strong></p>
         ${sum('23/7 → 7/23')}
         ${ans('7/23')}`
      )}
      <p><strong>Other kinds work the same way.</strong> A whole number is a fraction over 1.</p>
      ${chips(['4/11 → 11/4'], ['8 = 8/1 → 1/8'])}
      ${tip('A number times its reciprocal always makes 1: 23/7 × 7/23 = 1. Leave reciprocals like 11/4 as improper fractions.')}`,

    // 3H Q4, Q5: fraction or mixed numeral ÷ whole number
    '3h-div-whole': `
      <p class="hp-tag">Worked example: <b>2 4/7 ÷ 6</b></p>
      ${steps(
        `<p><strong>Change a mixed numeral to an improper fraction.</strong> Skip this if it is already a fraction.</p>
         ${sum('2 4/7 = 18/7')}`,
        `<p><strong>Dividing by 6 is the same as multiplying by 1/6</strong>, its reciprocal.</p>
         ${sum('18/7 ÷ 6 = 18/7 × 1/6')}`,
        `<p><strong>Cancel and multiply.</strong> 18 and 6 share 6.</p>
         ${sum('3/7 × 1/1 = 3/7')}
         ${ans('3/7')}`
      )}
      ${tip('Dividing by 6 means sharing into 6 equal parts, so the answer gets smaller. A plain fraction: 6/7 ÷ 4 = 6/7 × 1/4 = 6/28 = 3/14.')}`,

    // 3H Q6: whole number ÷ fraction
    '3h-whole-div': `
      <p class="hp-tag">Worked example: <b>3 ÷ 1/4</b></p>
      ${steps(
        `<p><strong>Ask "how many quarters fit into 3?"</strong> Each whole holds 4 quarters.</p>
         ${fig({ kind: 'bar', parts: 4, shaded: 4, caption: '1 whole' }, { kind: 'bar', parts: 4, shaded: 4, caption: '1 whole' }, { kind: 'bar', parts: 4, shaded: 4, caption: '1 whole' })}`,
        `<p><strong>Count them, or flip and multiply.</strong> Dividing by 1/4 is the same as multiplying by 4.</p>
         ${sum('3 ÷ 1/4 = 3 × 4/1 = 12')}
         ${ans('12')}`
      )}
      <p><strong>Any fraction works the same way:</strong> 10 ÷ 2/5 = 10 × 5/2 = 50/2 = 25.</p>
      ${tip('Dividing by a fraction smaller than 1 gives a bigger answer. If it is not a whole number, write a mixed numeral, like 4 1/2.')}`,

    // 3H Q7: fraction ÷ fraction, including mixed numerals
    '3h-div-frac': `
      <p class="hp-tag">Worked example: <b>3 1/2 ÷ 1 2/5</b></p>
      ${steps(
        `<p><strong>Change mixed numerals to improper fractions.</strong></p>
         ${sum('3 1/2 = 7/2 and 1 2/5 = 7/5')}`,
        `<p><strong>Keep the first, change ÷ to ×, flip the second.</strong></p>
         ${sum('7/2 ÷ 7/5 = 7/2 × 5/7')}`,
        `<p><strong>Cancel, multiply, and change to a mixed numeral.</strong> The 7s cancel.</p>
         ${sum('1/2 × 5/1 = 5/2 = 2 1/2')}
         ${ans('2 1/2')}`
      )}
      <p><strong>Two plain fractions?</strong> Start at step 2: 4/5 ÷ 2/7 = 4/5 × 7/2 = 14/5 = 2 4/5.</p>
      ${tip('Only flip the second number, the one you are dividing by. Type mixed numerals with a space, like 2 1/2.')}`,

    // 3H Q8: a mix of every kind
    '3h-mixed': `
      <p>Every division works the same way: <strong>keep, change, flip</strong>.</p>
      ${chips(['Keep the first number'], ['Change ÷ to ×'], ['Flip the second number'])}
      <p class="hp-tag">Worked example: <b>7/12 ÷ 1/8</b></p>
      ${steps(
        `<p><strong>Keep, change, flip.</strong></p>
         ${sum('7/12 ÷ 1/8 = 7/12 × 8/1')}`,
        `<p><strong>Cancel and simplify.</strong> 8 and 12 share 4.</p>
         ${sum('7/3 × 2/1 = 14/3 = 4 2/3')}
         ${ans('4 2/3')}`
      )}
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Question</span><span role="columnheader">Keep, change, flip</span><span role="columnheader">Answer</span></div>
        <div class="hp-tr" role="row"><span role="cell">3/10 ÷ 4</span><span role="cell">3/10 × 1/4</span><span role="cell">3/40</span></div>
        <div class="hp-tr" role="row"><span role="cell">14 ÷ 2/7</span><span role="cell">14 × 7/2</span><span role="cell">49</span></div>
        <div class="hp-tr" role="row"><span role="cell">1 5/7 ÷ 2 2/7</span><span role="cell">12/7 × 7/16</span><span role="cell">3/4</span></div>
      </div>
      ${tip('A whole number flips to 1 over it, so 4 becomes 1/4. Change mixed numerals to improper fractions before you flip.')}`,

    // 3H Q9 to Q13: word problems
    '3h-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A plank is <span class="hp-hl">4 2/3</span> metres long. How many pieces <span class="hp-hl">7/12</span> of a metre long can be <span class="hp-kw">cut from</span> it?</p>
      ${steps(
        `<p><strong>Decide the sum.</strong> "How many pieces fit?" means divide by the size of one piece.</p>
         ${sum('4 2/3 ÷ 7/12')}`,
        `<p><strong>Improper fraction, then keep, change, flip.</strong></p>
         ${sum('14/3 ÷ 7/12 = 14/3 × 12/7')}`,
        `<p><strong>Cancel and multiply.</strong> 14 and 7 share 7. 12 and 3 share 3.</p>
         ${sum('2/1 × 4/1 = 8')}
         ${ans('8')}`
      )}
      ${chips(['shared between 4, cut into 4 → ÷ 4', 'add'], ['how many fit, how many in → ÷ the fraction', 'add'], ['only whole ones count → drop the leftover part', 'take'])}
      ${tip('If you get something like 7 2/3 plots, only 7 are complete. Then read the question again: is there another step, like taking some away?')}`,

    // 3H Q15: which expression has the same value?
    '3h-same': `
      <p class="hp-tag">Worked example: which has the same value as <b>1/6 of 30</b>? &nbsp;6 × 5, &nbsp;10 ÷ 2 &nbsp;or&nbsp; 30 ÷ 3</p>
      ${steps(
        `<p><strong>Work out the question.</strong> 1/6 of 30 means 30 ÷ 6.</p>
         ${sum('30 ÷ 6 = 5')}`,
        `<p><strong>Work out every option</strong> and find the one that matches.</p>
         ${chips(['6 × 5 = 30'], ['10 ÷ 2 = 5', 'add'], ['30 ÷ 3 = 10'])}
         ${ans('10 ÷ 2')}`
      )}
      ${tip('Dividing by a unit fraction is multiplying: 5 ÷ 1/2 = 5 × 2 = 10. Multiplying by a unit fraction is dividing: 1/6 × 30 = 30 ÷ 6.')}`,

    // 3H Q16: same speed, different time
    '3h-speed': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A cyclist rides <span class="hp-hl">40</span> km in <span class="hp-hl">2 1/2</span> hours. At the <span class="hp-kw">same speed</span>, how far will she ride in <span class="hp-hl">4</span> hours?</p>
      ${steps(
        `<p><strong>Find the distance for 1 hour.</strong> Divide the distance by the time.</p>
         ${sum('40 ÷ 2 1/2 = 40 ÷ 5/2 = 40 × 2/5 = 16 km')}`,
        `<p><strong>Multiply by the new time.</strong></p>
         ${sum('16 × 4 = 64 km')}
         ${ans('64')}`
      )}
      ${tip('Finding the amount for 1 hour first works for any time. Type just the number, without the km.')}`,

    // =====================================================================
    // 3I Fractions and percentages
    // =====================================================================
    // 3I Q1, Q2: percentage to fraction
    '3i-pc-to-frac': `
      <p class="hp-tag">Worked example: write <b>48%</b> as a fraction.</p>
      ${steps(
        `<p><strong>Per cent means "out of 100".</strong> Put the number over 100.</p>
         ${fig({ kind: 'grid', rows: 10, cols: 10, shaded: 48, caption: '48 out of 100' })}
         ${sum('48% = 48/100')}`,
        `<p><strong>Simplify.</strong> 48 and 100 can both be divided by 4.</p>
         ${sum('48/100 = 12/25')}
         ${ans('12/25')}`
      )}
      ${tip('If the top and 100 share no factor, like 29/100, the fraction is already in simplest form.')}`,

    // 3I Q3: percentage over 100% to a mixed numeral
    '3i-pc-to-mixed': `
      <p class="hp-tag">Worked example: write <b>285%</b> as a mixed numeral.</p>
      ${steps(
        `<p><strong>Every 100% is one whole.</strong> 285% is 2 wholes and 85% more.</p>
         ${sum('285% = 2 85/100')}`,
        `<p><strong>Simplify the fraction part.</strong> 85 and 100 can both be divided by 5.</p>
         ${sum('85/100 = 17/20')}
         ${ans('2 17/20')}`
      )}
      ${tip('Type a mixed numeral with a space between the whole number and the fraction: 2 17/20.')}`,

    // 3I Q4: fraction to percentage with a denominator of 100
    '3i-frac-to-pc': `
      <p class="hp-tag">Worked example: write <b>4/5</b> as a percentage.</p>
      ${steps(
        `<p><strong>Make the denominator 100.</strong> 5 × 20 = 100, so multiply the top and the bottom by 20.</p>
         ${sum('4/5 = 80/100')}`,
        `<p><strong>Out of 100 is a percentage.</strong></p>
         ${ans('80%')}`
      )}
      <p><strong>Top bigger than the bottom?</strong> Same method, and the answer is more than 100%: 7/4 = 175/100 = 175%.</p>
      ${tip('If the denominator does not go into 100, simplify first: 21/6 = 7/2 = 350/100 = 350%. Type the % sign.')}`,

    // 3I Q5: fraction to percentage by multiplying by 100%
    '3i-times-100': `
      <p class="hp-tag">Worked example: write <b>1/6</b> as a percentage.</p>
      ${steps(
        `<p><strong>Multiply by 100%.</strong></p>
         ${sum('1/6 × 100% = 100/6 %')}`,
        `<p><strong>Divide the top by the bottom.</strong> Write the remainder as a fraction and simplify it.</p>
         ${bus('6', ['1', '0', '0'], ['0', '1', '6'], ['', '1', '4'], 'r 4')}
         ${sum('100/6 = 16 4/6 = 16 2/3')}
         ${ans('16 2/3%')}`
      )}
      ${tip('Type the % sign. A half can go either way: 37 1/2% or 37.5%. For a mixed numeral, make it improper first: 1 1/8 = 9/8, and 9/8 × 100% = 112.5%.')}`,

    // 3I Q6, Q7, Q8, Q10: scores, slices and "the rest"
    '3i-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Sam got <span class="hp-hl">34</span> out of <span class="hp-hl">40</span> on a quiz. What percentage did he get <span class="hp-kw">right</span>, and what percentage <span class="hp-kw">wrong</span>?</p>
      ${steps(
        `<p><strong>Write "out of" as a fraction</strong> and simplify.</p>
         ${sum('34/40 = 17/20')}`,
        `<p><strong>Make it out of 100.</strong> 20 × 5 = 100.</p>
         ${sum('17/20 = 85/100 = 85%')}`,
        `<p><strong>The rest is 100% take away that.</strong></p>
         ${sum('100% − 85% = 15%')}
         ${ans('85% right, 15% wrong')}`
      )}
      ${tip('If the bottom will not turn into 100, multiply by 100% instead: 3/40 × 100% = 300/40 % = 7.5%.')}`,

    // 3I Q9: smallest and largest season percentage
    '3i-season': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A team has won <span class="hp-hl">38</span> of its <span class="hp-hl">44</span> games and has <span class="hp-hl">6</span> left to play. What are the <span class="hp-kw">smallest</span> and <span class="hp-kw">largest</span> percentages of games it could win this season?</p>
      ${steps(
        `<p><strong>Find the number of games in the whole season.</strong></p>
         ${sum('44 + 6 = 50 games')}`,
        `<p><strong>Smallest: it loses all 6.</strong> The wins stay at 38.</p>
         ${sum('38/50 = 76/100 = 76%')}`,
        `<p><strong>Largest: it wins all 6.</strong></p>
         ${sum('38 + 6 = 44 wins<br>44/50 = 88/100 = 88%')}
         ${ans('76% and 88%')}`
      )}
      ${tip('Always divide by the games in the whole season, not just the games played so far.')}`,

    // 3I Q11: counting percentages that give one denominator
    '3i-count': `
      <p class="hp-tag">Worked example: how many whole-number percentages from 1% to 99% simplify to a fraction with a denominator of <b>25</b>?</p>
      ${steps(
        `<p><strong>Find which percentages can become 25ths.</strong> 100 ÷ 25 = 4, so the percentage must be a multiple of 4.</p>
         ${chips(['4%'], ['8%'], ['12%'], ['16%'], ['...'], ['96%'])}
         ${sum('96 ÷ 4 = 24, so there are 24 of them')}`,
        `<p><strong>Cross out any that simplify further.</strong> If the top of the 25ths fraction is a multiple of 5, it simplifies again, for example 20% = 5/25 = 1/5.</p>
         ${chips(['20% ✗', 'take'], ['40% ✗', 'take'], ['60% ✗', 'take'], ['80% ✗', 'take'])}`,
        `<p><strong>Count what is left.</strong></p>
         ${sum('24 − 4 = 20')}
         ${ans('20')}`
      )}
      ${tip('Test a couple by hand to be sure: 8% = 8/100 = 2/25 ✓, but 20% = 20/100 = 1/5 ✗.')}`,

    // 3I Q12: a percentage with a fraction in it
    '3i-frac-pc': `
      <p class="hp-tag">Worked example: write <b>2 1/2%</b> as a fraction.</p>
      ${steps(
        `<p><strong>Change the mixed numeral to an improper fraction.</strong></p>
         ${sum('2 1/2 = 5/2')}`,
        `<p><strong>Per cent means divide by 100.</strong> Dividing by 100 is the same as multiplying by 1/100.</p>
         ${sum('5/2 × 1/100 = 5/200')}`,
        `<p><strong>Simplify.</strong> 5 and 200 share 5.</p>
         ${sum('5/200 = 1/40')}
         ${ans('1/40')}`
      )}
      ${tip('Check it the other way: 1/40 × 100% = 100/40 % = 2 1/2%.')}`,

    // 3I Q13: a fraction between two percentages
    '3i-between': `
      <p class="hp-tag">Worked example: which fraction sits between <b>30%</b> and <b>35%</b>? &nbsp;1/5, &nbsp;1/3 &nbsp;or&nbsp; 3/8</p>
      ${steps(
        `<p><strong>Change every option to a percentage.</strong> Multiply by 100%.</p>
         ${sum('1/5 = 20%<br>1/3 = 100/3 % = 33 1/3%<br>3/8 = 300/8 % = 37.5%')}`,
        `<p><strong>Find the one inside the range.</strong> 33 1/3% is more than 30% and less than 35%.</p>
         ${chips(['20%: too small', 'take'], ['33 1/3%: fits', 'add'], ['37.5%: too big', 'take'])}
         ${ans('1/3')}`
      )}
      ${tip('Putting everything in the same form, all percentages or all fractions, makes them easy to compare.')}`,

    // =====================================================================
    // 3J Finding a percentage of a number
    // =====================================================================
    // 3J Q1, Q2, Q4: build from 50%, 10%, 5%, 25% and 1%
    '3j-build': `
      <p>Some percentages are quick to find. Build the rest from them.</p>
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Percentage</span><span role="columnheader">How</span><span role="columnheader">Of 260</span></div>
        <div class="hp-tr" role="row"><span role="cell">50%</span><span role="cell">halve it</span><span role="cell">130</span></div>
        <div class="hp-tr" role="row"><span role="cell">10%</span><span role="cell">÷ 10</span><span role="cell">26</span></div>
        <div class="hp-tr" role="row"><span role="cell">5%</span><span role="cell">halve the 10%</span><span role="cell">13</span></div>
        <div class="hp-tr" role="row"><span role="cell">25%</span><span role="cell">halve, then halve again</span><span role="cell">65</span></div>
        <div class="hp-tr" role="row"><span role="cell">1%</span><span role="cell">÷ 100</span><span role="cell">2.6</span></div>
      </div>
      <p class="hp-tag">Worked example: <b>35% of 260</b></p>
      ${steps(
        `<p><strong>Split the percentage into easy parts.</strong></p>
         ${sum('35% = 30% + 5%')}`,
        `<p><strong>Find each part.</strong></p>
         ${sum('30% = 3 × 26 = 78<br>5% = 26 ÷ 2 = 13')}`,
        `<p><strong>Add them.</strong></p>
         ${sum('78 + 13 = 91')}
         ${ans('91')}`
      )}
      ${tip('Taking away works too: 9% is 10% − 1%, and 75% is 100% − 25%. For 4%, find 1% and multiply by 4.')}`,

    // 3J Q3: percentages over 100%
    '3j-over-100': `
      <p class="hp-tag">Worked example: <b>175% of 24</b></p>
      ${steps(
        `<p><strong>Split it into 100% and the rest.</strong> 100% is the whole amount.</p>
         ${fig({ kind: 'bar', parts: 4, shaded: 4, caption: '100% = 24' }, { kind: 'bar', parts: 4, shaded: 3, caption: '75% = 18' })}
         ${sum('175% = 100% + 75%')}`,
        `<p><strong>Find each part, then add.</strong> 25% is 24 ÷ 4 = 6, so 75% is 3 × 6.</p>
         ${sum('100% of 24 = 24<br>75% of 24 = 3 × 6 = 18<br>24 + 18 = 42')}
         ${ans('42')}`
      )}
      ${tip('200% is double and 300% is triple. So 250% of 26 is 2 × 26 plus half of 26: 52 + 13 = 65.')}`,

    // 3J Q5, Q6: amounts with units, and decimal answers
    '3j-units': `
      <p class="hp-tag">Worked example: <b>15% of 340 metres</b></p>
      ${steps(
        `<p><strong>Find 10%, then halve it for 5%.</strong></p>
         ${sum('10% = 340 ÷ 10 = 34<br>5% = 34 ÷ 2 = 17')}`,
        `<p><strong>Add them</strong>, and keep the same unit.</p>
         ${sum('15% = 34 + 17 = 51 metres')}
         ${ans('51')}`
      )}
      <p><strong>Answers can be decimals.</strong> 25% of 30 litres is 30 ÷ 4 = 7.5 litres.</p>
      ${tip('Type just the number, like 51 or 7.5. A test score works the same way: 80% of a test out of 30 is 3 × 8 = 24 marks.')}`,

    // 3J Q7, Q11: discounts and pay rises
    '3j-discount': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A bike costs <span class="hp-hl">$140</span>. It has a <span class="hp-hl">20%</span> <span class="hp-kw">discount</span>. What is the sale price?</p>
      ${steps(
        `<p><strong>Find the discount.</strong> 10% of 140 is 14, so 20% is double that.</p>
         ${sum('20% of 140 = 2 × 14 = 28')}`,
        `<p><strong>A discount comes off the price.</strong></p>
         ${sum('140 − 28 = 112')}
         ${ans('112')}`
      )}
      ${chips(['discount, % off, sale → take away', 'take'], ['pay rise, increase → add on', 'add'])}
      ${tip('A rise works the other way: a 5% rise on $620 is 620 + 31 = $651. Money can have cents, so an answer like 42.50 is fine.')}`,

    // 3J Q8, Q9, Q10, Q12: percentage of a group or a time
    '3j-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A school has <span class="hp-hl">1200</span> students. <span class="hp-hl">30%</span> walk, <span class="hp-hl">45%</span> catch the bus and <span class="hp-kw">the rest</span> come by car. How many come by car?</p>
      ${steps(
        `<p><strong>Find the percentage for "the rest".</strong> All the groups together make 100%.</p>
         ${sum('100% − 30% − 45% = 25%')}
         ${fig({ kind: 'bar', parts: 20, shaded: [15, 16, 17, 18, 19], caption: 'Each strip is 5%. The car group is shaded.' })}`,
        `<p><strong>Find that percentage of the total.</strong> 25% is a quarter.</p>
         ${sum('1200 ÷ 4 = 300')}
         ${ans('300')}`
      )}
      ${tip('Change units first if you need to. For 15% of 2 hours, use 120 minutes: 10% is 12 and 5% is 6, so 18 minutes.')}`,

    // 3J Q13, Q17: work back to the whole amount
    '3j-reverse': `
      <p class="hp-tag">Worked example: <b>15%</b> of a walking trail is <b>33 km</b>. How long is the whole trail?</p>
      ${steps(
        `<p><strong>Get down to an easy percentage.</strong> 15% is 3 lots of 5%.</p>
         ${sum('5% = 33 ÷ 3 = 11 km')}`,
        `<p><strong>Build up to 100%.</strong> There are 20 lots of 5% in 100%.</p>
         ${sum('100% = 11 × 20 = 220 km')}
         ${ans('220')}`
      )}
      ${tip('From there you can find any other percentage. If 30% is 51, then 10% is 17 and 5% is 8.5.')}`,

    // 3J Q14, Q15, Q16: percentages of percentages, and hidden percentages
    '3j-combine': `
      <p class="hp-tag">Worked example: <b>20% of (50% of 700)</b></p>
      ${steps(
        `<p><strong>Brackets first.</strong></p>
         ${sum('50% of 700 = 350')}`,
        `<p><strong>Now find the outside percentage of that answer.</strong></p>
         ${sum('10% of 350 = 35<br>20% of 350 = 2 × 35 = 70')}
         ${ans('70')}`
      )}
      <p><strong>Comparing two?</strong> Work both out. For example, 25% of 12 = 3 and 12% of 25 = 3.</p>
      ${tip('Divisions can hide percentages: ÷ 10 finds 10% and ÷ 4 finds 25%, so 200 ÷ 4 × 3 finds 75% of 200.')}`,

    // 3J Q18: the jigsaw puzzles
    '3j-puzzle': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Sam does a <span class="hp-hl">500</span>-piece puzzle in <span class="hp-hl">4</span> weeks. Each week he does <span class="hp-hl">40</span> <span class="hp-kw">fewer</span> pieces than the week before. How many does he do each week, and what percentage is that?</p>
      ${steps(
        `<p><strong>Add up how far each week falls short of week 1.</strong></p>
         ${sum('week 2: 40 less, week 3: 80 less, week 4: 120 less<br>40 + 80 + 120 = 240')}`,
        `<p><strong>Put the shortfall back and share by 4.</strong> If every week matched week 1, he would do 240 more pieces.</p>
         ${sum('(500 + 240) ÷ 4 = 740 ÷ 4 = 185')}
         ${chips(['185'], ['145'], ['105'], ['65'])}`,
        `<p><strong>Turn each week into a percentage of 500.</strong> Out of 500, so divide by 5 to get out of 100.</p>
         ${sum('185/500 = 37/100 = 37%')}
         ${ans('37%, 29%, 21%, 13%')}`
      )}
      ${tip('Check the weeks add up to the total: 185 + 145 + 105 + 65 = 500. A running total adds on each week: 185, 330, 435, 500. Type lists in order, with commas.')}`,

    // =====================================================================
    // 3K Introduction to ratios
    // =====================================================================
    // 3K Q1, Q2, Q3: writing a ratio
    '3k-write': `
      <p class="hp-tag">Worked example: a fruit bowl holds 6 bananas, 7 pears and 2 plums.</p>
      ${chips(['6 bananas'], ['7 pears'], ['2 plums'])}
      ${steps(
        `<p><strong>Follow the order in the question.</strong> The first thing named goes first.</p>
         ${sum('pears to bananas = 7 : 6')}`,
        `<p><strong>Three things? Use two colons</strong>, still in the order asked.</p>
         ${sum('bananas to pears to plums = 6 : 7 : 2')}
         ${ans('6:7:2')}`
      )}
      ${tip('Order matters: 7:6 and 6:7 are different ratios. Type a ratio with a colon, like 7:6.')}`,

    // 3K Q4, Q5, Q6: simplifying ratios
    '3k-simplify': `
      <p class="hp-tag">Worked example: simplify <b>36 : 27</b></p>
      ${steps(
        `<p><strong>Find the highest common factor</strong> of the numbers. 9 goes into both.</p>`,
        `<p><strong>Divide every part by it.</strong></p>
         ${sum('36 ÷ 9 = 4 and 27 ÷ 9 = 3')}
         ${ans('4:3')}`
      )}
      <p><strong>Three parts work the same way.</strong> In 26 : 39 : 13 every part divides by 13, so it simplifies to 2 : 3 : 1.</p>
      ${tip('Cannot spot the biggest factor? Divide by a small one and keep going: 36 : 27 → 12 : 9 → 4 : 3. If the units match, like 35 cm to 50 cm, drop them: 35 : 50 = 7 : 10.')}`,

    // 3K Q7: shaded to white squares
    '3k-shaded': `
      <p class="hp-tag">Worked example: shaded squares to white squares</p>
      ${fig({ kind: 'grid', rows: 3, cols: 6, shaded: [0, 2, 4, 7, 9, 11, 12, 15], alt: 'A 3 by 6 grid with 8 squares shaded' })}
      ${steps(
        `<p><strong>Count each kind.</strong></p>
         ${sum('shaded: 8<br>white: 18 − 8 = 10')}`,
        `<p><strong>Write them in the order asked, then simplify.</strong> Both divide by 2.</p>
         ${sum('8 : 10 = 4 : 5')}
         ${ans('4:5')}`
      )}
      ${tip('Shaded to white is not shaded to total. 8 : 18 would be wrong here.')}`,

    // 3K Q8: missing number in equal ratios
    '3k-missing': `
      <p class="hp-tag">Worked example: <b>6 : 11 = □ : 44</b></p>
      ${steps(
        `<p><strong>Find the pair you know on both sides.</strong> 11 became 44. What was it multiplied by?</p>
         ${sum('44 ÷ 11 = 4')}`,
        `<p><strong>Do the same to the other part.</strong></p>
         ${sum('6 : 11<br>↓ × 4 &nbsp;&nbsp;↓ × 4<br>24 : 44')}
         ${ans('24')}`
      )}
      ${tip('It can go the other way too. If the numbers get smaller, divide both parts by the same number.')}`,

    // 3K Q9, Q10, Q11: ratios with fractions and mixed numerals
    '3k-fractions': `
      <p class="hp-tag">Worked example: simplify <b>5/8 : 1/6</b></p>
      ${steps(
        `<p><strong>Give the fractions a common denominator.</strong> 24 is a multiple of both 8 and 6.</p>
         ${sum('5/8 = 15/24 and 1/6 = 4/24')}`,
        `<p><strong>Same denominator? Just use the numerators.</strong></p>
         ${sum('15/24 : 4/24 = 15 : 4')}
         ${ans('15:4')}`
      )}
      <p><strong>Mixed numerals?</strong> Change them to improper fractions first: 1 1/4 : 3 = 5/4 : 12/4 = 5 : 12.</p>
      ${tip('A simplified ratio has whole numbers only. If you get 1 : 1/4, multiply both parts by 4 to get 4 : 1.')}`,

    // 3K Q12: mixing paint
    '3k-paint': `
      <p class="hp-tag">Worked example: pink paint mixes red and white in the ratio <b>2 : 5</b>.</p>
      ${steps(
        `<p><strong>Scaling up: how much white goes with 8 litres of red?</strong> 2 became 8, so multiply both parts by 4.</p>
         ${sum('2 : 5 = 8 : 20')}
         ${ans('20')}`,
        `<p><strong>Comparing: is 3 : 7 more red or more white?</strong> Write red as a fraction of white for both, with a common denominator.</p>
         ${sum('2 : 5 → 2/5 = 14/35<br>3 : 7 → 3/7 = 15/35')}`,
        `<p><strong>The bigger fraction has more red for each litre of white.</strong> 15/35 is bigger.</p>
         ${ans('More red')}`
      )}
      ${tip('Another way: make the second parts match. 2 : 5 = 14 : 35 and 3 : 7 = 15 : 35. With the same white, 15 red is more than 14 red.')}`,

    // 3K Q13: change to the same units first
    '3k-units': `
      <p class="hp-tag">Worked example: write <b>25 cm to 2 m</b> as a ratio in simplest form.</p>
      ${steps(
        `<p><strong>Change to the same unit.</strong> The smaller unit is usually easiest.</p>
         ${sum('2 m = 200 cm')}`,
        `<p><strong>Write the ratio and simplify.</strong> Both divide by 25.</p>
         ${sum('25 : 200 = 1 : 8')}
         ${ans('1:8')}`
      )}
      ${chips(['1 cm = 10 mm'], ['1 m = 100 cm'], ['$1 = 100 cents'], ['1 kg = 1000 g'], ['1 hour = 60 min'], ['1 day = 24 hours'])}
      ${tip('Once the units match, leave them out of the ratio.')}`,

    // 3K Q14: n : n squared
    '3k-n': `
      <p class="hp-tag">Worked example: <b>n : n² = 1 : 8</b>. What is n?</p>
      ${steps(
        `<p><strong>Try some numbers</strong> and look for a pattern.</p>
         ${chips(['n = 2: 2 : 4 = 1 : 2'], ['n = 3: 3 : 9 = 1 : 3'], ['n = 4: 4 : 16 = 1 : 4'])}`,
        `<p><strong>Spot the rule.</strong> n² is n × n, so dividing both parts by n always leaves 1 : n. That means 1 : n = 1 : 8.</p>
         ${sum('Check: 8 : 64 = 1 : 8 ✓')}
         ${ans('8')}`
      )}
      ${tip('n² means n × n, not n × 2.')}`,

    // 3K Q15: colour mixing
    '3k-colours': `
      <p>Colour mixing is ratio mixing. When one of the things you mix is already a mixture, split it into its parts.</p>
      <p class="hp-tag">Worked example: a drink mix is lemon juice and water in the ratio 1 : 1. You stir 2 cups of lemon juice into 1 cup of the drink mix. What is the ratio of lemon juice to water now?</p>
      ${steps(
        `<p><strong>Split the mixture into its parts.</strong> 1 cup of a 1 : 1 mix is half lemon juice and half water.</p>
         ${sum('1 cup of mix = 1/2 cup lemon + 1/2 cup water')}`,
        `<p><strong>Add up each ingredient.</strong></p>
         ${sum('lemon: 2 + 1/2 = 2 1/2<br>water: 1/2')}`,
        `<p><strong>Write the ratio with whole numbers.</strong> Multiply both parts by 2.</p>
         ${sum('2 1/2 : 1/2 = 5 : 1')}
         ${ans('5:1')}`
      )}
      ${tip('For the colour names, picture mixing the paints or look at a colour wheel. A tertiary colour is named with its primary colour first, like yellow orange.')}`,

    // =====================================================================
    // 3L Solving problems with ratios
    // =====================================================================
    // 3L Q1, Q2, Q3: ratios and fractions
    '3l-fraction': `
      <p class="hp-tag">Worked example: juice and water are mixed in the ratio <b>2 : 7</b>. What fraction of the drink is juice?</p>
      ${steps(
        `<p><strong>Add the parts to get the total.</strong></p>
         ${fig({ kind: 'bar', parts: 9, shaded: 2, caption: '2 parts juice, 7 parts water' })}
         ${sum('2 + 7 = 9 parts')}`,
        `<p><strong>Each fraction is its part over the total.</strong></p>
         ${sum('juice = 2/9 &nbsp; water = 7/9')}
         ${ans('2/9')}`
      )}
      <p><strong>Going backwards:</strong> if 5/9 of the games were won, then 4/9 were lost, so won to lost is 5 : 4.</p>
      ${tip('Know one amount? Scale the ratio. With 2 : 7 and 10 litres of juice, multiply by 5: 10 : 35, so 35 litres of water.')}`,

    // 3L Q4, Q5, Q6: divide an amount in a ratio
    '3l-divide': `
      <p class="hp-tag">Worked example: divide <b>$56</b> in the ratio <b>3 : 4</b>.</p>
      ${steps(
        `<p><strong>Count the parts.</strong></p>
         ${sum('3 + 4 = 7 parts')}
         ${fig({ kind: 'bar', parts: 7, shaded: 3, caption: '3 parts and 4 parts' })}`,
        `<p><strong>Find one part.</strong></p>
         ${sum('56 ÷ 7 = 8')}`,
        `<p><strong>Multiply each number in the ratio by one part.</strong></p>
         ${sum('3 × 8 = 24<br>4 × 8 = 32')}
         ${ans('24, 32')}`
      )}
      ${tip('Check the shares add back to the total: 24 + 32 = 56. Type both amounts in order, with a comma.')}`,

    // 3L Q7, Q10: know one part or the total
    '3l-one-part': `
      <p class="hp-tag">Worked example: cordial and water are mixed in the ratio <b>2 : 9</b>.</p>
      ${steps(
        `<p><strong>You know one part.</strong> With 8 litres of cordial, how much water? 2 became 8, so multiply everything by 4.</p>
         ${sum('cordial : water : total = 2 : 9 : 11<br>× 4 → 8 : 36 : 44')}
         ${ans('36')}`,
        `<p><strong>You know the total.</strong> To make 33 litres of drink, how much cordial? Find one part first.</p>
         ${sum('2 + 9 = 11 parts<br>33 ÷ 11 = 3 litres in each part<br>cordial = 2 × 3 = 6 litres')}
         ${ans('6')}`
      )}
      ${tip('Ask yourself: do I know one part, or the total? Adding the total to the end of the ratio makes both kinds easy to scale.')}`,

    // 3L Q8, Q9, Q11: three-part ratios
    '3l-three': `
      <p class="hp-tag">Worked example: share <b>$132</b> in the ratio <b>2 : 3 : 6</b>.</p>
      ${steps(
        `<p><strong>Count all the parts.</strong></p>
         ${sum('2 + 3 + 6 = 11 parts')}
         ${fig({ kind: 'bar', parts: 11, shaded: [0, 1, 5, 6, 7, 8, 9, 10], caption: '2 parts, 3 parts, 6 parts' })}`,
        `<p><strong>Find one part.</strong></p>
         ${sum('132 ÷ 11 = 12')}`,
        `<p><strong>Multiply each number in the ratio by 12.</strong></p>
         ${sum('2 × 12 = 24<br>3 × 12 = 36<br>6 × 12 = 72')}
         ${ans('24, 36, 72')}`
      )}
      ${tip('If a question asks for only one share, just work out that one. For the angles in a triangle, the total is 180°, even when the question does not say so.')}`,

    // 3L Q12, Q13: leftovers
    '3l-leftover': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Mia splits <span class="hp-hl">50</span> stickers into two piles in the ratio <span class="hp-hl">3 : 4</span>, using as many as she can. How many are <span class="hp-kw">left over</span>?</p>
      ${steps(
        `<p><strong>Count the parts.</strong> Each round of sharing uses 3 + 4 = 7 stickers.</p>`,
        `<p><strong>Divide and look at the remainder.</strong></p>
         ${sum('50 ÷ 7 = 7 r 1')}
         ${sum('7 × 7 = 49 used: 21 and 28')}
         ${ans('1')}`
      )}
      ${tip('An amount splits with nothing left over only when the total number of parts divides into it exactly.')}`,

    // 3L Q14: smallest number to add to reach a ratio
    '3l-adjust': `
      <p class="hp-tag">Worked example: a fruit box needs apples, bananas and cherries in the ratio <b>2 : 3 : 1</b>. It has 3 apples, 7 bananas and 2 cherries. What is the smallest number of extra fruit to add?</p>
      ${steps(
        `<p><strong>List equal ratios</strong> by multiplying every part by 2, 3, 4 and so on.</p>
         ${chips(['2 : 3 : 1'], ['4 : 6 : 2'], ['6 : 9 : 3'])}`,
        `<p><strong>Pick the first one where every part is at least what you have</strong> (3, 7, 2). You can only add fruit, not take it away.</p>
         ${chips(['4 : 6 : 2 ✗ (6 is less than 7)', 'take'], ['6 : 9 : 3 ✓', 'add'])}`,
        `<p><strong>Add up the extras.</strong></p>
         ${sum('(6 − 3) + (9 − 7) + (3 − 2) = 3 + 2 + 1 = 6')}
         ${ans('6')}`
      )}
      ${tip('Check every part, not just the first one.')}`,

    // 3L Q15: the ratio changes
    '3l-change': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A shelter has <span class="hp-hl">36</span> cats and dogs in the ratio <span class="hp-hl">5 : 4</span>. Some cats are adopted, and now the ratio of cats to dogs is <span class="hp-hl">1 : 2</span>. How many cats were adopted?</p>
      ${steps(
        `<p><strong>Find the starting numbers.</strong></p>
         ${sum('5 + 4 = 9 parts, 36 ÷ 9 = 4<br>cats: 5 × 4 = 20 &nbsp; dogs: 4 × 4 = 16')}`,
        `<p><strong>Use the group that did not change.</strong> There are still 16 dogs. In 1 : 2 the dogs are 2 parts, so one part is 16 ÷ 2 = 8.</p>
         ${sum('cats now: 1 × 8 = 8')}`,
        `<p><strong>Find the difference.</strong></p>
         ${sum('20 − 8 = 12')}
         ${ans('12')}`
      )}
      ${tip('Work out the size of the group that stays the same first, then use the new ratio.')}`,

    // 3L Q16: slopes
    '3l-slope': `
      <p class="hp-tag">Worked example: a ramp rises <b>24 m</b> over a horizontal distance of <b>90 m</b>.</p>
      ${steps(
        `<p><strong>Write vertical : horizontal and simplify.</strong> Both divide by 6.</p>
         ${sum('24 : 90 = 4 : 15')}
         ${ans('4:15')}`,
        `<p><strong>Finding a missing distance?</strong> Scale the ratio. A slope of 2 : 7 with 10 m vertical: 2 became 10, so × 5.</p>
         ${sum('2 : 7 = 10 : 35, so 35 m horizontal')}`
      )}
      ${tip('Fractions or mixed numerals in a slope? Multiply both parts by the denominator to clear them: 2 1/2 : 7 1/2 = 5 : 15 = 1 : 3.')}`
  });
})();
