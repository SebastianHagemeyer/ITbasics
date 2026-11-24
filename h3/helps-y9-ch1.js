/* H3 help panels for Year 9 Chapter 1. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 1A to 1M. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // The Australian resident tax table used in 1J (the same one the questions show).
  const taxTable = () => fig({ kind: 'table', rows: [
    ['Taxable income', 'Tax on income'],
    ['$0 - $18 200', 'Nil'],
    ['$18 201 - $45 000', '19c per $1 over $18 200'],
    ['$45 001 - $200 000', '$5092 + 30c per $1 over $45 000'],
    ['$200 001 and over', '$51 592 + 45c per $1 over $200 000']] });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 9 1A Integer operations
    // =====================================================================
    // y9-1A Q1: order of operations with negative numbers
    'y9-1a-order': `
      <p class="hp-tag">Worked example: <b>−9 + 30 ÷ (−5) × 2</b></p>
      ${steps(
        `<p><strong>Brackets first.</strong> Here the bracket only holds a negative number, so there is nothing to work out inside it.</p>`,
        `<p><strong>Then × and ÷, from left to right.</strong> A positive and a negative give a negative.</p>
         ${sum(`−9 + ${now('30 ÷ (−5)')} × 2<br>= −9 + ${now('(−6) × 2')}<br>= −9 + (−12)`)}`,
        `<p><strong>Then + and −, from left to right.</strong> Adding a negative is the same as subtracting.</p>
         ${sum('−9 − 12 = −21')}
         ${ans('-21')}`
      )}
      <p><strong>Signs when you multiply or divide:</strong></p>
      ${chips(['same signs → positive', 'add'], ['different signs → negative', 'take'])}
      ${tip('Write a new line for every step and only do one kind of operation at a time. Type a negative answer with the minus key, like -21.')}`,

    // y9-1A Q2, Q7: lowest common multiple
    'y9-1a-lcm': `
      <p class="hp-tag">Worked example: find the LCM of <b>12</b> and <b>20</b>.</p>
      ${steps(
        `<p><strong>List multiples of the bigger number.</strong></p>
         ${chips(['20'], ['40'], ['60'], ['80'])}`,
        `<p><strong>Stop at the first one the smaller number goes into.</strong> 20 and 40 do not divide by 12, but 60 ÷ 12 = 5 ✓.</p>
         ${ans('60')}`,
        `<p><strong>Or use prime factors.</strong> Take every prime that appears, with its highest power.</p>
         ${sum('12 = 2² × 3<br>20 = 2² × 5<br>LCM = 2² × 3 × 5 = 60')}`
      )}
      ${tip('Stories where two things repeat and meet up again (buses, lights, visits every so many days) need the LCM.')}`,

    // y9-1A Q3, Q10: highest common factor
    'y9-1a-hcf': `
      <p class="hp-tag">Worked example: find the HCF of <b>45</b> and <b>75</b>.</p>
      ${steps(
        `<p><strong>Write each number as a product of primes.</strong></p>
         ${sum('45 = 3² × 5<br>75 = 3 × 5²')}`,
        `<p><strong>Take the primes in both, with the smaller power.</strong></p>
         ${sum('HCF = 3 × 5 = 15')}
         ${ans('15')}`
      )}
      <p><strong>Listing works too.</strong> Factors of 45: 1, 3, 5, 9, 15, 45. The biggest of these that goes into 75 is 15.</p>
      ${tip('Stories about the largest equal group, with nobody left over, need the HCF. If two numbers share no prime at all, their HCF is 1.')}`,

    // y9-1A Q4, Q11: powers, roots and negative bases
    'y9-1a-powers': `
      <p class="hp-tag">Worked example: <b>(−2)³ + √81</b></p>
      ${steps(
        `<p><strong>Do the power and the root first.</strong> Three negatives multiplied give a negative.</p>
         ${sum('(−2)³ = (−2) × (−2) × (−2) = −8<br>√81 = 9, since 9 × 9 = 81')}`,
        `<p><strong>Then add.</strong></p>
         ${sum('−8 + 9 = 1')}
         ${ans('1')}`
      )}
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Write</span><span role="columnheader">Means</span><span role="columnheader">Value</span></div>
        <div class="hp-tr" role="row"><span role="cell">(−9)²</span><span role="cell">(−9) × (−9)</span><span role="cell">81</span></div>
        <div class="hp-tr" role="row"><span role="cell">−9²</span><span role="cell">−1 × 9 × 9</span><span role="cell">−81</span></div>
        <div class="hp-tr" role="row"><span role="cell">∛(−1000)</span><span role="cell">(−10) × (−10) × (−10) = −1000</span><span role="cell">−10</span></div>
      </div>
      ${tip('A negative number to an even power is positive, and to an odd power it is negative. If a² = 49 then a can be 7 or −7: type both, with a comma. For primes, try two and see: 3 and 7 share only the factor 1, and their LCM is 21.')}`,

    // y9-1A Q5: substituting negative numbers
    'y9-1a-sub': `
      <p class="hp-tag">Worked example: find <b>b² − 2ac</b> when <b>a = −3</b>, <b>b = 5</b> and <b>c = −1</b>.</p>
      ${steps(
        `<p><strong>Replace each letter with its number, in brackets.</strong></p>
         ${sum('(5)² − 2 × (−3) × (−1)')}`,
        `<p><strong>Powers first, then multiply.</strong> Two negatives multiplied make a positive, so the product 2ac comes out as positive 6.</p>
         ${sum('25 − 6')}`,
        `<p><strong>Finish off.</strong></p>
         ${sum('25 − 6 = 19')}
         ${ans('19')}`
      )}
      ${tip('Letters written side by side are multiplied: ac means a × c. Keep brackets round negatives so the square of −3 comes out as +9, not −9.')}`,

    // y9-1A Q6, Q8: where do the brackets go?
    'y9-1a-brackets': `
      <p class="hp-tag">Worked example: where do brackets go to make <b>10 − 4 × (−6) + 1 = −35</b> true?</p>
      ${steps(
        `<p><strong>Work out the version with no extra brackets first.</strong> × comes before + and −.</p>
         ${sum('10 − (−24) + 1 = 35 ✗')}`,
        `<p><strong>Try brackets round different parts</strong> and work each one out.</p>
         ${sum('(10 − 4) × (−6) + 1 = −36 + 1 = −35 ✓<br>10 − 4 × ((−6) + 1) = 10 + 20 = 30 ✗')}`,
        `<p><strong>Pick the one that gives the right answer.</strong></p>
         ${ans('(10 − 4) × (−6) + 1 = −35')}`
      )}
      ${tip('To count how many different answers are possible, try every place a pair of brackets can go, then cross out answers that repeat.')}`,

    // y9-1A Q9: two numbers from their sum and difference, or sum and product
    'y9-1a-pair': `
      <p class="hp-tag">Worked example: two numbers add to <b>5</b> and their difference is <b>13</b>. What are they?</p>
      ${steps(
        `<p><strong>Add the sum and the difference, then halve.</strong> That gives the larger number.</p>
         ${sum('(5 + 13) ÷ 2 = 18 ÷ 2 = 9')}`,
        `<p><strong>The other number is the rest of the sum.</strong></p>
         ${sum('5 − 9 = −4<br>Check: 9 − (−4) = 13 ✓')}
         ${ans('9, -4')}`
      )}
      <p><strong>Sum and product?</strong> For a sum of −1 and a product of −12, list factor pairs of −12 with one negative: 3 and −4 add to −1 ✓.</p>
      ${tip('Type the two numbers with a comma between them. A negative product means one number is negative and one is positive.')}`,

    // y9-1A Q12: true or false when a > b > 0
    'y9-1a-signs': `
      <p class="hp-tag">Worked example: <b>a</b> and <b>b</b> are positive and <b>a &gt; b</b>. True or false? <b>a ÷ (−b) &lt; 0</b> and <b>2b − a &gt; 0</b></p>
      ${steps(
        `<p><strong>Try numbers that fit the rule.</strong> Take a = 6 and b = 2.</p>
         ${sum('6 ÷ (−2) = −3, which is less than 0<br>2 × 2 − 6 = −2, which is not more than 0')}`,
        `<p><strong>Check the signs, not just one example.</strong> A positive divided by a negative is always negative, so the first is true. One example that fails is enough to make the second false.</p>
         ${ans('True, False')}`
      )}
      ${tip('Think about signs: big minus small is positive, small minus big is negative, and a negative squared is the same as the positive squared.')}`,

    // y9-1A Q13: perfect, triangular and Fibonacci-style numbers
    'y9-1a-sequences': `
      <p class="hp-tag">Worked example: is <b>12</b> a perfect number?</p>
      ${steps(
        `<p><strong>List its factors, leaving out 12 itself, and add them.</strong></p>
         ${sum('1 + 2 + 3 + 4 + 6 = 16')}`,
        `<p><strong>Compare.</strong> 16 is not 12, so 12 is not perfect.</p>
         ${ans('No')}`
      )}
      <p><strong>Triangular numbers.</strong> Row n adds n more dots, so the nth one is n × (n + 1) ÷ 2. The 8th is 8 × 9 ÷ 2 = 36.</p>
      <p><strong>Adding sequences, both ways.</strong> Start 2, 5 and add the last two each time: 2, 5, 7, 12, 19, 31. To go left of 2, ask what plus 2 makes 5 (it is 3), then what plus 3 makes 2 (it is −1).</p>
      ${tip('Type a list in order with commas between the numbers.')}`,

    // =====================================================================
    // Year 9 1B Decimal places and significant figures
    // =====================================================================
    // y9-1B Q1, Q2, Q3, Q12: rounding to decimal places
    'y9-1b-dp': `
      <p class="hp-tag">Worked example: round <b>47.3962</b> to two decimal places.</p>
      ${steps(
        `<p><strong>Count two places after the point and draw a line.</strong></p>
         ${sum('47.39 | 62')}`,
        `<p><strong>Look at the next digit only.</strong> It is 6, which is 5 or more, so round up. 39 hundredths becomes 40.</p>
         ${sum('47.39 → 47.40')}
         ${ans('47.40')}`
      )}
      <p><strong>Keep the zeros.</strong> 9.996 to two places rounds up all the way: 9.996 → 10.00. To the nearest whole number, look at the tenths: 6.49 → 6.</p>
      ${tip('Only the very next digit matters. In 2.84999 the digit after the first place is 4, so it rounds down to 2.8, even though 9s follow.')}`,

    // y9-1B Q4, Q11: dividing to get a decimal, then rounding
    'y9-1b-divide': `
      <p class="hp-tag">Worked example: write <b>5/6</b> as a decimal to three decimal places.</p>
      ${steps(
        `<p><strong>Divide the top by the bottom.</strong> Work out one more place than you need.</p>
         ${sum('5 ÷ 6 = 0.8333...')}`,
        `<p><strong>Round.</strong> The fourth digit is 3, so round down.</p>
         ${ans('0.833')}`
      )}
      <p><strong>Rounding to the nearest kilogram.</strong> 2 tonnes shared between 9 beds is 2 ÷ 9 = 0.2222... t. 1 kg is 0.001 t, so round to three places: 0.222 t.</p>
      ${tip('Nearest cent is two decimal places of a dollar. Nearest kilogram is three decimal places of a tonne. Nearest centimetre is two decimal places of a metre.')}`,

    // y9-1B Q5, Q6, Q13: significant figures
    'y9-1b-sf': `
      <p class="hp-tag">Worked example: round <b>38 652</b>, <b>0.004716</b> and <b>5.0381</b> to two significant figures.</p>
      ${steps(
        `<p><strong>Start counting at the first digit that is not 0.</strong> Zeros at the front never count.</p>
         ${sum('38 652: 3, 8 | 0.004716: 4, 7 | 5.0381: 5, 0')}`,
        `<p><strong>Round using the next digit.</strong> Then fill the places back to the decimal point with zeros.</p>
         ${sum('38 652 → 39 000 (6 rounds up)<br>0.004716 → 0.0047 (1 rounds down)<br>5.0381 → 5.0 (3 rounds down)')}
         ${ans('39000, 0.0047, 5.0')}`
      )}
      ${tip('A zero between other digits does count, so 5.0 shows two figures. If two amounts round to the same value, use more figures to keep them different.')}`,

    // y9-1B Q7, Q9, Q14: estimating with one significant figure
    'y9-1b-estimate': `
      <p class="hp-tag">Worked example: estimate <b>4.7 + 2.18 × 6.3</b> by rounding to one significant figure.</p>
      ${steps(
        `<p><strong>Round every number first.</strong></p>
         ${sum('4.7 → 5, 2.18 → 2, 6.3 → 6')}`,
        `<p><strong>Then follow the order of operations.</strong> × before +.</p>
         ${sum('5 + 2 × 6 = 5 + 12 = 17')}
         ${ans('17')}`
      )}
      <p><strong>Small numbers work the same way.</strong> 72.6 × 0.0412 → 70 × 0.04 = 2.8. A square: 0.293² → 0.3² = 0.09.</p>
      ${tip('Do not work out the exact answer and round that. Rounding to one figure gives the roughest estimate; more figures or the nearest whole number get closer to the exact value.')}`,

    // y9-1B Q8: round first, then subtract
    'y9-1b-before': `
      <p class="hp-tag">Worked example: two race times are <b>12.384 s</b> and <b>11.967 s</b>. Find the difference after first rounding both to one decimal place, and to four significant figures.</p>
      ${steps(
        `<p><strong>One decimal place.</strong></p>
         ${sum('12.384 → 12.4, 11.967 → 12.0<br>12.4 − 12.0 = 0.4')}`,
        `<p><strong>Four significant figures.</strong></p>
         ${sum('12.384 → 12.38, 11.967 → 11.97<br>12.38 − 11.97 = 0.41')}
         ${ans('0.4 and 0.41')}`
      )}
      ${tip('Round each time first, then subtract. With one significant figure both times here become 10, so the difference is 0.')}`,

    // y9-1B Q10: posts around a shape
    'y9-1b-posts': `
      <p class="hp-tag">Worked example: <b>16</b> posts and <b>150 m</b> of fencing go around a square. There is a post in each corner and the posts are evenly spaced. How far apart are the posts, to the nearest centimetre?</p>
      ${steps(
        `<p><strong>Count the gaps.</strong> On a closed shape you come back to the first post, so there are as many gaps as posts: 16 gaps.</p>`,
        `<p><strong>Share the fencing between the gaps.</strong></p>
         ${sum('150 ÷ 16 = 9.375 m')}`,
        `<p><strong>Round to the nearest centimetre</strong>: two decimal places of a metre.</p>
         ${ans('9.38')}`
      )}
      ${tip('Check the corners work: 16 posts on a square is 4 gaps per side, so every corner gets a post.')}`,

    // y9-1B Q15: repeating decimal patterns
    'y9-1b-pattern': `
      <p class="hp-tag">Worked example: what digit is in decimal place <b>20</b> of <b>1/7</b>?</p>
      ${steps(
        `<p><strong>Divide to find the repeating block.</strong></p>
         ${sum('1 ÷ 7 = 0.142857 142857 ...')}
         <p>The block 142857 has 6 digits.</p>`,
        `<p><strong>Divide the place number by the block length.</strong> The remainder tells you where in the block you land.</p>
         ${sum('20 ÷ 6 = 3 r 2')}`,
        `<p><strong>Remainder 2 means the 2nd digit of the block.</strong></p>
         ${ans('4')}`
      )}
      ${tip('A remainder of 0 means the last digit of the block. When a question asks for a decimal to a set number of places, round the last digit as usual: 1/7 to 8 places is 0.14285714.')}`,

    // =====================================================================
    // Year 9 1C Rational numbers
    // =====================================================================
    // y9-1C Q1: fractions to terminating decimals
    'y9-1c-to-dec': `
      <p class="hp-tag">Worked example: write <b>7/40</b> and <b>5 3/4</b> as decimals.</p>
      ${steps(
        `<p><strong>Divide the top by the bottom.</strong></p>
         ${sum('7 ÷ 40 = 0.175')}`,
        `<p><strong>Or make the bottom 10, 100 or 1000.</strong></p>
         ${sum('7/40 = 175/1000 = 0.175')}`,
        `<p><strong>Mixed numeral: keep the whole number</strong> and change only the fraction.</p>
         ${sum('3/4 = 0.75, so 5 3/4 = 5.75')}
         ${ans('0.175 and 5.75')}`
      )}
      ${tip('These decimals stop, so type every digit. Do not round.')}`,

    // y9-1C Q2: recurring decimals to 4 places
    'y9-1c-recurring': `
      <p class="hp-tag">Worked example: write <b>8/11</b> and <b>1 5/6</b> as decimals, correct to 4 decimal places.</p>
      ${steps(
        `<p><strong>Divide until you see the pattern.</strong></p>
         ${sum('8 ÷ 11 = 0.727272...<br>5 ÷ 6 = 0.83333...')}`,
        `<p><strong>Round to 4 places, using the 5th digit.</strong></p>
         ${sum('0.7272 | 7 → 0.7273<br>1.8333 | 3 → 1.8333')}
         ${ans('0.7273 and 1.8333')}`
      )}
      ${tip('With a pen you would put dots over the repeating digits. Here, type 4 places and round the last one.')}`,

    // y9-1C Q3: decimals to fractions
    'y9-1c-to-frac': `
      <p class="hp-tag">Worked example: write <b>0.84</b> and <b>2.875</b> as fractions in simplest form.</p>
      ${steps(
        `<p><strong>The last decimal place gives the bottom.</strong> Two places is hundredths, three is thousandths.</p>
         ${sum('0.84 = 84/100<br>2.875 = 2 875/1000')}`,
        `<p><strong>Cancel by the HCF.</strong></p>
         ${sum('84/100 = 21/25 (÷ 4)<br>875/1000 = 7/8 (÷ 125)')}
         ${ans('21/25 and 2 7/8')}`
      )}
      ${tip('Type a mixed numeral with a space: 2 7/8. If you cannot spot the HCF, keep dividing by 2 or 5 until nothing else cancels.')}`,

    // y9-1C Q4, Q5, Q8: comparing and ordering fractions
    'y9-1c-compare': `
      <p class="hp-tag">Worked example: which is larger, <b>4/9</b> or <b>3/7</b>?</p>
      ${steps(
        `<p><strong>Find the lowest common denominator.</strong> The LCM of 9 and 7 is 63.</p>`,
        `<p><strong>Rewrite both fractions over 63.</strong></p>
         ${sum('4/9 = 28/63<br>3/7 = 27/63')}`,
        `<p><strong>Compare the tops.</strong> 28 is more than 27.</p>
         ${ans('4/9')}`
      )}
      <p><strong>A decimal and a fraction?</strong> Change the fraction to a decimal. 3/7 = 0.4285..., which is smaller than 0.43.</p>
      ${tip('To put three fractions in order, rewrite all of them over one common denominator. "Descending" means largest first.')}`,

    // y9-1C Q6: one quantity as a fraction of another
    'y9-1c-quantity': `
      <p class="hp-tag">Worked example: write <b>$42 out of $70</b> as a fraction in simplest form.</p>
      ${steps(
        `<p><strong>The part goes on top, the whole on the bottom.</strong></p>
         ${sum('42/70')}`,
        `<p><strong>Cancel by the HCF.</strong> 14 goes into both.</p>
         ${sum('42/70 = 3/5')}
         ${ans('3/5')}`
      )}
      ${tip('Both amounts must be in the same unit first. Type the fraction with a slash, like 3/5.')}`,

    // y9-1C Q9: strength of a mixed drink
    'y9-1c-strength': `
      <p class="hp-tag">Worked example: <b>800 mL</b> of half-strength juice has <b>200 mL</b> of full-strength juice added. What is the strength now?</p>
      ${steps(
        `<p><strong>Find the pure juice in each part.</strong> Half-strength means half of it is juice.</p>
         ${sum('half of 800 = 400 mL juice<br>200 mL is all juice')}`,
        `<p><strong>Total juice over total drink.</strong></p>
         ${sum('juice: 400 + 200 = 600 mL<br>drink: 800 + 200 = 1000 mL')}`,
        `<p><strong>Simplify.</strong></p>
         ${sum('600/1000 = 3/5')}
         ${ans('3/5')}`
      )}
      ${tip('Check it makes sense: adding stronger juice should push the strength above 1/2 but below 1.')}`,

    // y9-1C Q7: fraction patterns
    'y9-1c-pattern': `
      <p class="hp-tag">Worked example: find the next two fractions in <b>1/6, 1/2, 5/6, ...</b></p>
      ${steps(
        `<p><strong>Rewrite them over a common denominator.</strong></p>
         ${sum('1/6, 3/6, 5/6')}`,
        `<p><strong>Find the step.</strong> Each top goes up by 2, so add 2/6 each time.</p>
         ${sum('7/6, 9/6')}`,
        `<p><strong>Simplify where you can.</strong></p>
         ${ans('7/6, 3/2')}`
      )}
      ${tip('The step can be negative: the fractions might go down. Type the two fractions with a comma between them.')}`,

    // y9-1C Q10: integers that put a fraction between two numbers
    'y9-1c-between': `
      <p class="hp-tag">Worked example: <b>x/6</b> is between <b>4</b> and <b>5</b>. Find every integer x.</p>
      ${steps(
        `<p><strong>Write the ends over the same bottom.</strong></p>
         ${sum('4 = 24/6 and 5 = 30/6')}`,
        `<p><strong>x is strictly between the tops.</strong></p>
         ${ans('25, 26, 27, 28, 29')}`
      )}
      <p><strong>Letter on the bottom?</strong> For 40/x between 3 and 6, find where it equals each end: 40 ÷ 6 = 6.67 and 40 ÷ 3 = 13.3. So x is between 6.67 and 13.3, which gives 7, 8, 9, 10, 11, 12, 13.</p>
      ${tip('Check the end values: x = 6 gives 40/6 = 6.67, too big; x = 14 gives 2.86, too small. List the answers with commas.')}`,

    // y9-1C Q11: mixed numerals with letters
    'y9-1c-letters': `
      <p class="hp-tag">Worked example: write <b>4 2/5</b> as an improper fraction.</p>
      ${steps(
        `<p><strong>Change the whole number into fifths.</strong></p>
         ${sum('4 = 4 × 5 fifths = 20/5')}`,
        `<p><strong>Add the fraction part.</strong></p>
         ${sum('(4 × 5 + 2)/5 = 22/5')}
         ${ans('22/5')}`
      )}
      ${tip('With letters, do exactly the same steps: whole number times bottom, plus top, all over the bottom. Then check your choice with numbers.')}`,

    // y9-1C Q12: reasoning about simplest form
    'y9-1c-simplest': `
      <p>A fraction is in simplest form when the top and bottom have no common factor except 1.</p>
      <p class="hp-tag">Worked example: <b>m</b> and <b>n</b> are both multiples of 3. Can <b>m/n</b> be in simplest form?</p>
      ${steps(
        `<p><strong>Try an example.</strong> 6/15: both divide by 3, so it cancels to 2/5.</p>`,
        `<p><strong>Give a reason that always works.</strong> If 3 goes into both, 3 is a common factor, so you can always cancel.</p>
         ${ans('No')}`
      )}
      ${tip('To answer "yes, it can happen", one example is enough. To answer "no, never", you need a reason that works for every number.')}`,

    // y9-1C Q13: recurring decimals to fractions
    'y9-1c-rec-to-frac': `
      <p class="hp-tag">Worked example: write <b>0.545454...</b> (54 repeating) as a fraction.</p>
      ${steps(
        `<p><strong>Call it x.</strong> Two digits repeat, so multiply by 100.</p>
         ${sum('x = 0.5454...<br>100x = 54.5454...')}`,
        `<p><strong>Subtract to kill the repeating tail.</strong></p>
         ${sum('100x − x = 54<br>99x = 54, so x = 54/99')}`,
        `<p><strong>Simplify.</strong> 9 goes into both.</p>
         ${sum('54/99 = 6/11')}
         ${ans('6/11')}`
      )}
      ${tip('Three repeating digits sit over 999: 0.162162... = 162/999 = 6/37. Keep any whole number in front: 3.5454... = 3 6/11.')}`,

    // =====================================================================
    // Year 9 1D Operations with fractions
    // =====================================================================
    // y9-1D Q1, Q2: adding and subtracting fractions
    'y9-1d-add': `
      <p class="hp-tag">Worked example: <b>5/6 − 3/8</b></p>
      ${steps(
        `<p><strong>Find the lowest common denominator.</strong> The LCM of 6 and 8 is 24.</p>`,
        `<p><strong>Rewrite both fractions over 24.</strong></p>
         ${sum('5/6 = 20/24<br>3/8 = 9/24')}`,
        `<p><strong>Subtract the tops and keep the bottom.</strong></p>
         ${sum('20/24 − 9/24 = 11/24')}
         ${ans('11/24')}`
      )}
      ${tip('Adding works the same way: 3/10 + 4/15 = 9/30 + 8/30 = 17/30. Simplify at the end, and turn a top-heavy answer into a mixed numeral like 1 2/7.')}`,

    // y9-1D Q3, Q4, Q7, Q8, Q13: adding and subtracting mixed numerals
    'y9-1d-mixed-add': `
      <p class="hp-tag">Worked example: <b>6 1/5 − 3 3/4</b></p>
      ${steps(
        `<p><strong>Use a common denominator.</strong> The LCM of 5 and 4 is 20.</p>
         ${sum('6 4/20 − 3 15/20')}`,
        `<p><strong>The fraction being taken away is bigger</strong>, so borrow 1 whole from the 6. One whole is 20/20.</p>
         ${sum('6 4/20 = 5 24/20')}`,
        `<p><strong>Subtract the wholes, then the fractions.</strong></p>
         ${sum('5 24/20 − 3 15/20 = 2 9/20')}
         ${ans('2 9/20')}`
      )}
      <p><strong>Adding:</strong> 2 5/6 + 1 3/4 = 3 + 10/12 + 9/12 = 3 19/12 = 4 7/12.</p>
      ${tip('If borrowing feels tricky, change both to improper fractions first. In stories, "left" means subtract and "altogether" means add.')}`,

    // y9-1D Q5: multiplying fractions
    'y9-1d-multiply': `
      <p class="hp-tag">Worked example: <b>2 2/5 × 1 7/8</b></p>
      ${steps(
        `<p><strong>Change mixed numerals into improper fractions.</strong></p>
         ${sum('12/5 × 15/8')}`,
        `<p><strong>Cancel across before you multiply.</strong> 4 goes into 12 and 8; 5 goes into 5 and 15.</p>
         ${sum('3/1 × 3/2')}`,
        `<p><strong>Multiply tops and bottoms.</strong></p>
         ${sum('9/2 = 4 1/2')}
         ${ans('4 1/2')}`
      )}
      ${tip('Write a whole number over 1: 8 × 5/6 = 8/1 × 5/6 = 40/6 = 6 2/3. Type mixed numerals with a space, like 6 2/3.')}`,

    // y9-1D Q6, Q11: dividing fractions
    'y9-1d-divide': `
      <p class="hp-tag">Worked example: <b>4 1/5 ÷ 2 4/5</b></p>
      ${steps(
        `<p><strong>Change to improper fractions.</strong></p>
         ${sum('21/5 ÷ 14/5')}`,
        `<p><strong>Multiply by the reciprocal</strong> (flip the second fraction).</p>
         ${sum('21/5 × 5/14 = 21/14')}`,
        `<p><strong>Simplify.</strong></p>
         ${sum('21/14 = 3/2 = 1 1/2')}
         ${ans('1 1/2')}`
      )}
      ${tip('A whole number divided by a fraction: 12 ÷ 3/5 = 12 × 5/3 = 20. In a "how many loads" story, round up: you cannot take part of a trip.')}`,

    // y9-1D Q9, Q12: a fraction of a quantity in a story
    'y9-1d-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A test lasts <span class="hp-hl">1 3/4</span> hours and <span class="hp-hl">2/7</span> of the time is for checking. How many <span class="hp-kw">minutes</span> is that?</p>
      ${steps(
        `<p><strong>Change to the unit the question wants.</strong></p>
         ${sum('1 3/4 h = 60 + 45 = 105 min')}`,
        `<p><strong>"Of" means multiply.</strong></p>
         ${sum('2/7 × 105 = 210/7 = 30')}
         ${ans('30')}`
      )}
      ${tip('"The rest" is the fraction left from 1 whole. If 2/5 of the time is spent on one job, the rest is 3/5 of it.')}`,

    // y9-1D Q10: multiplying and dividing in one line
    'y9-1d-mixed-ops': `
      <p class="hp-tag">Worked example: <b>3/7 × 7/8 ÷ 9/16</b></p>
      ${steps(
        `<p><strong>Turn the ÷ into × by the reciprocal.</strong></p>
         ${sum('3/7 × 7/8 × 16/9')}`,
        `<p><strong>Cancel everything you can.</strong> The 7s cancel, 3 goes into 9, and 8 goes into 16.</p>
         ${sum('1/1 × 1/1 × 2/3')}`,
        `<p><strong>Multiply what is left.</strong></p>
         ${ans('2/3')}`
      )}
      ${tip('Only flip the fraction straight after the ÷ sign. Change mixed numerals to improper fractions before anything else.')}`,

    // y9-1D Q14, Q15: fractions with letters and reciprocals
    'y9-1d-letters': `
      <p class="hp-tag">Worked example: simplify <b>4m/n ÷ 2m/n²</b></p>
      ${steps(
        `<p><strong>Multiply by the reciprocal</strong>, just as with numbers.</p>
         ${sum('4m/n × n²/(2m)')}`,
        `<p><strong>Cancel the numbers and the letters.</strong> 4 ÷ 2 = 2, m cancels m, and n² ÷ n = n.</p>
         ${ans('2n')}`
      )}
      <p><strong>Reciprocals.</strong> Flip the fraction: 5/9 becomes 9/5. For a mixed numeral, make it improper first: 3 2/5 = 17/5, so its reciprocal is 5/17.</p>
      ${tip('Type fractions with a slash and use brackets for a product or sum on the bottom, like x/(5y) or a/(b+c). Powers use ^, like n^2.')}`,

    // y9-1D Q16: order of operations with mixed numerals
    'y9-1d-order': `
      <p class="hp-tag">Worked example: <b>4 1/2 − 1 1/5 × 2 1/2</b></p>
      ${steps(
        `<p><strong>× comes before −.</strong> Do the multiplication with improper fractions.</p>
         ${sum('6/5 × 5/2 = 30/10 = 3')}`,
        `<p><strong>Then subtract.</strong></p>
         ${sum('4 1/2 − 3 = 1 1/2')}
         ${ans('1 1/2')}`
      )}
      <p><strong>Brackets go first.</strong> (2 2/3 − 1 1/2) ÷ 1 1/4: the bracket is 16/6 − 9/6 = 7/6, then 7/6 × 4/5 = 28/30 = 14/15.</p>
      ${tip('Write one line per step so you do not lose a fraction along the way.')}`,

    // =====================================================================
    // Year 9 1E Ratios, rates and best buys
    // =====================================================================
    // y9-1E Q1, Q14: simplifying ratios
    'y9-1e-simplify': `
      <p class="hp-tag">Worked example: simplify <b>1 1/2 : 2 1/5</b></p>
      ${steps(
        `<p><strong>Make improper fractions.</strong></p>
         ${sum('3/2 : 11/5')}`,
        `<p><strong>Multiply both sides by the common denominator</strong> to clear the fractions.</p>
         ${sum('× 10 → 15 : 22')}`,
        `<p><strong>Check for a common factor.</strong> 15 and 22 share only 1, so this is simplest form.</p>
         ${ans('15:22')}`
      )}
      <p><strong>Decimals:</strong> multiply by 10 or 100 until both are whole. 0.35 : 1.4 → 35 : 140 → 1 : 4.</p>
      ${tip('Type a ratio with a colon, like 15:22. If both numbers share a factor, divide by the HCF. Areas use length × length, so if the sides of two squares are in the ratio 3 : 5, their areas are 9 : 25.')}`,

    // y9-1E Q2: ratios with different units
    'y9-1e-units': `
      <p class="hp-tag">Worked example: write <b>40 cm : 2 m : 1.2 m</b> in simplest form.</p>
      ${steps(
        `<p><strong>Change everything to the smaller unit.</strong> 1 m = 100 cm.</p>
         ${sum('40 : 200 : 120')}`,
        `<p><strong>Divide every part by the HCF</strong>, which is 40.</p>
         ${sum('1 : 5 : 3')}
         ${ans('1:5:3')}`
      )}
      ${tip('Times work the same way: 45 min : 1.5 h = 45 : 90 = 1 : 2. Remember 1 h = 60 min, 1 day = 24 h, 1 kg = 1000 g and $1 = 100 cents.')}`,

    // y9-1E Q3, Q4, Q9, Q10, Q15: dividing in a ratio
    'y9-1e-divide': `
      <p class="hp-tag">Worked example: divide <b>$960</b> in the ratio <b>1 : 4 : 7</b>.</p>
      ${steps(
        `<p><strong>Add the parts.</strong></p>
         ${sum('1 + 4 + 7 = 12 parts')}`,
        `<p><strong>Find one part</strong> (the unitary method).</p>
         ${sum('$960 ÷ 12 = $80')}`,
        `<p><strong>Multiply for each share.</strong></p>
         ${sum('1 × 80 = 80, 4 × 80 = 320, 7 × 80 = 560')}
         ${ans('80, 320, 560')}`
      )}
      ${tip('Check the shares add back to the total: 80 + 320 + 560 = 960 ✓. For angles in a shape, the total is the angle sum. Type the shares in order with commas.')}`,

    // y9-1E Q12: one part of a ratio is known
    'y9-1e-one-part': `
      <p class="hp-tag">Worked example: concentrate and water are mixed in the ratio <b>2 : 7</b>. How much water goes with <b>18 L</b> of concentrate?</p>
      ${steps(
        `<p><strong>Match the known amount to its part.</strong> 2 parts = 18 L.</p>
         ${sum('1 part = 18 ÷ 2 = 9 L')}`,
        `<p><strong>Water is 7 parts.</strong></p>
         ${sum('7 × 9 = 63 L')}
         ${ans('63')}`
      )}
      ${tip('Do not share the 18 L between all 9 parts: the 18 L is only the concentrate.')}`,

    // y9-1E Q19: mixing two jugs
    'y9-1e-mix': `
      <p class="hp-tag">Worked example: jug A is <b>480 mL</b> of cordial and water at <b>1 : 5</b>. Jug B is <b>400 mL</b> at <b>1 : 4</b>. What is the ratio when they are mixed?</p>
      ${steps(
        `<p><strong>Split each jug into cordial and water.</strong></p>
         ${sum('A: 6 parts, 480 ÷ 6 = 80 → 80 cordial, 400 water<br>B: 5 parts, 400 ÷ 5 = 80 → 80 cordial, 320 water')}`,
        `<p><strong>Add the cordials and add the waters.</strong></p>
         ${sum('cordial: 80 + 80 = 160 mL<br>water: 400 + 320 = 720 mL')}`,
        `<p><strong>Simplify.</strong> 80 goes into both.</p>
         ${sum('160 : 720 = 2 : 9')}
         ${ans('2:9')}`
      )}
      ${tip('You cannot just add the ratios. To find the strongest mix, compare the fraction of each drink that is cordial.')}`,

    // y9-1E Q5, Q6: rates
    'y9-1e-rates': `
      <p class="hp-tag">Worked example: a tank fills with <b>84 L</b> in <b>3 1/2 hours</b>. Find the rate per hour.</p>
      ${steps(
        `<p><strong>Divide the amount by the time.</strong> Write 3 1/2 as 3.5.</p>
         ${sum('84 ÷ 3.5 = 24')}
         ${ans('24')}`,
        `<p><strong>Using a rate:</strong> distance = speed × time. At 15 km/h for 40 minutes, change 40 min to 2/3 of an hour.</p>
         ${sum('15 × 2/3 = 10 km')}`
      )}
      ${tip('Change minutes to hours before using a "per hour" rate: 10 min is 1/6 h, 45 min is 3/4 h. Type just the number, without units.')}`,

    // y9-1E Q7, Q8, Q16: best buys
    'y9-1e-best-buy': `
      <p class="hp-tag">Worked example: which is the better buy, <b>3 kg for $11.40</b> or <b>5 kg for $18.50</b>?</p>
      ${steps(
        `<p><strong>Find the cost of one unit (1 kg) for each.</strong></p>
         ${sum('$11.40 ÷ 3 = $3.80 per kg<br>$18.50 ÷ 5 = $3.70 per kg')}`,
        `<p><strong>The lower unit price is the better buy.</strong></p>
         ${ans('The 5 kg pack')}`
      )}
      <p><strong>Per 100 g:</strong> 400 g for $5.60 is $5.60 ÷ 4 = $1.40 per 100 g, and 600 g for $8.10 is $8.10 ÷ 6 = $1.35 per 100 g. The 600 g pack wins.</p>
      ${tip('Make the units match first: change kg to g, or GB to the same size, before you compare.')}`,

    // y9-1E Q11, Q13: matching a price to a unit rate
    'y9-1e-value': `
      <p class="hp-tag">Worked example: a <b>2 L</b> tub of yoghurt costs <b>$9.60</b>. A <b>750 mL</b> tub usually costs <b>$3.90</b>. How much must its price drop to be the same value per litre?</p>
      ${steps(
        `<p><strong>Find the unit price of the deal.</strong></p>
         ${sum('$9.60 ÷ 2 = $4.80 per litre')}`,
        `<p><strong>Price the other tub at that rate.</strong> 750 mL is 0.75 L.</p>
         ${sum('0.75 × $4.80 = $3.60')}`,
        `<p><strong>The drop is the difference.</strong></p>
         ${sum('$3.90 − $3.60 = $0.30')}
         ${ans('0.30')}`
      )}
      ${tip('For a box of cans, find the total volume first: number of cans × litres per can. Round money to the nearest cent only at the end.')}`,

    // y9-1E Q17, Q18: ratios with letters
    'y9-1e-letters': `
      <p class="hp-tag">Worked example: a ratio is <b>4 : 7</b>. Find the total number of parts and the fraction each part is of the total.</p>
      ${steps(
        `<p><strong>Total parts: add.</strong></p>
         ${sum('4 + 7 = 11')}`,
        `<p><strong>Each part over the total.</strong></p>
         ${sum('smaller: 4/11, larger: 7/11')}
         ${ans('11, 4/11, 7/11')}`
      )}
      <p><strong>Simplest form</strong> means the two numbers have an HCF of 1. Test claims about it with examples like 2 : 9, 4 : 15 or 3 : 5.</p>
      ${tip('With letters, do the same steps. Put a sum on the bottom in brackets, like a/(a+b).')}`,

    // =====================================================================
    // Year 9 1F Percentages and money
    // =====================================================================
    // y9-1F Q1, Q2: decimals and percentages
    'y9-1f-dec-pc': `
      <p class="hp-tag">Worked example: write <b>0.85</b> and <b>3.1</b> as percentages, and <b>6 1/2%</b> as a decimal.</p>
      ${steps(
        `<p><strong>Decimal to percentage: × 100.</strong> Move the point two places right.</p>
         ${sum('0.85 → 85%<br>3.1 → 310%')}`,
        `<p><strong>Percentage to decimal: ÷ 100.</strong> Change any fraction to a decimal first.</p>
         ${sum('6 1/2% = 6.5% → 0.065')}
         ${ans('85%, 310%, 0.065')}`
      )}
      ${tip('A number bigger than 1 is more than 100%. Include the % sign when the answer is a percentage.')}`,

    // y9-1F Q3, Q4: percentages, fractions and decimals
    'y9-1f-frac': `
      <p class="hp-tag">Worked example: write <b>45%</b> and <b>8 3/4%</b> as fractions in simplest form.</p>
      ${steps(
        `<p><strong>Put the percentage over 100 and simplify.</strong></p>
         ${sum('45% = 45/100 = 9/20')}`,
        `<p><strong>A fraction inside the percentage:</strong> use a decimal, then clear it.</p>
         ${sum('8 3/4% = 8.75/100 = 875/10 000 = 7/80')}
         ${ans('9/20 and 7/80')}`
      )}
      ${fig({ kind: 'table', rows: [['Percentage', '12.5%'], ['Fraction', '1/8'], ['Decimal', '0.125']] })}
      ${tip('All three rows are the same number. Fill a table by changing the one you are given into the other two. Over 100%? 225% = 2 1/4.')}`,

    // y9-1F Q5, Q9, Q10: one amount as a percentage of another
    'y9-1f-as-percent': `
      <p class="hp-tag">Worked example: write <b>45 cents out of $3.60</b> as a percentage.</p>
      ${steps(
        `<p><strong>Use the same units.</strong> $3.60 = 360 cents.</p>`,
        `<p><strong>Make a fraction and × 100.</strong></p>
         ${sum('45/360 × 100 = 12.5')}
         ${ans('12.5%')}`
      )}
      <p><strong>Watch the whole.</strong> Ana lost 3 kg and now weighs 57 kg. The percentage is of her original weight: 57 + 3 = 60 kg, so 3/60 × 100 = 5%.</p>
      ${tip('The amount can be bigger than the whole: $54 out of $40 is 135%. Change hours and minutes to the same unit before you divide.')}`,

    // y9-1F Q6, Q11, Q12, Q13, Q17: a percentage of an amount
    'y9-1f-of': `
      <p class="hp-tag">Worked example: find <b>15% of $360</b>.</p>
      ${steps(
        `<p><strong>Change the percentage to a decimal and multiply.</strong></p>
         ${sum('0.15 × 360 = 54')}
         ${ans('54')}`,
        `<p><strong>Use a fraction when it is easier.</strong> 62.5% = 5/8.</p>
         ${sum('62.5% of 72 = 5/8 × 72 = 45')}`
      )}
      <p><strong>Handy ones:</strong></p>
      ${chips(['12.5% = 1/8'], ['33 1/3% = 1/3'], ['37.5% = 3/8'], ['66 2/3% = 2/3'], ['87.5% = 7/8'])}
      ${tip('For "how many did not", use 100% minus the percentage. A percentage of a percentage is two steps: find the first group, then the part of it.')}`,

    // y9-1F Q7, Q8, Q14: finding the original amount
    'y9-1f-original': `
      <p class="hp-tag">Worked example: <b>6%</b> of an amount is <b>$42</b>. Find the amount.</p>
      ${steps(
        `<p><strong>Find 1%.</strong></p>
         ${sum('$42 ÷ 6 = $7')}`,
        `<p><strong>Find 100%.</strong></p>
         ${sum('$7 × 100 = $700')}
         ${ans('700')}`
      )}
      <p><strong>Over 100% works the same way.</strong> If 120% of x is $54, then 1% is $0.45 and x = $45.</p>
      ${tip('Check: 6% of $700 = $42 ✓. Type money as a number, like 700 or 700.00, with no $ sign.')}`,

    // y9-1F Q15, Q16: percentages with letters
    'y9-1f-reason': `
      <p class="hp-tag">Worked example: write an equation connecting x and y if <b>30% of x = 20% of y</b>.</p>
      ${steps(
        `<p><strong>Write the percentages as decimals.</strong></p>
         ${sum('0.3x = 0.2y')}`,
        `<p><strong>Multiply by 10 to clear decimals.</strong></p>
         ${sum('3x = 2y')}
         ${ans('3x=2y')}`
      )}
      <p><strong>Less than or more than?</strong> P% of a number is the number times P/100. Less than 100% shrinks it, more than 100% makes it bigger.</p>
      ${tip('Divide out any common factor so the equation is in simplest form. Type an inequality like P > 60 with the > or < key.')}`,

    // =====================================================================
    // Year 9 1G Percentage increase and decrease
    // =====================================================================
    // y9-1G Q1, Q2: increase or decrease by a percentage
    'y9-1g-multiplier': `
      <p class="hp-tag">Worked example: increase <b>$84</b> by <b>15%</b>, and decrease <b>250 mL</b> by <b>8%</b>.</p>
      ${steps(
        `<p><strong>Find the multiplier.</strong> An increase adds to 100%, a decrease takes away from 100%.</p>
         ${sum('100% + 15% = 115% → 1.15<br>100% − 8% = 92% → 0.92')}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('84 × 1.15 = 96.60<br>250 × 0.92 = 230')}
         ${ans('96.60 and 230')}`
      )}
      ${tip('One multiply does it all, so you do not need to find the percentage and then add or subtract. Give money to the cent.')}`,

    // y9-1G Q3 to Q7: percentage change
    'y9-1g-change': `
      <p class="hp-tag">Worked example: a price goes from <b>$40</b> to <b>$52</b>. Find the percentage increase.</p>
      ${steps(
        `<p><strong>Find the change.</strong></p>
         ${sum('52 − 40 = 12')}`,
        `<p><strong>Divide by the original amount and × 100.</strong></p>
         ${sum('12/40 × 100 = 30')}
         ${ans('30')}`
      )}
      <p><strong>A decrease, to one decimal place:</strong> 86 down to 59 is a change of 27, so 27/86 × 100 = 31.395... → 31.4%.</p>
      ${tip('Always divide by the starting value, not the new one. Type just the number, without the % sign.')}`,

    // y9-1G Q8, Q9, Q10: finding the original after a change
    'y9-1g-original': `
      <p class="hp-tag">Worked example: after a <b>12%</b> rise, a price is <b>$44.80</b>. Find the original price.</p>
      ${steps(
        `<p><strong>The new price is 112% of the old one.</strong></p>
         ${sum('original × 1.12 = 44.80')}`,
        `<p><strong>Undo the multiply by dividing.</strong></p>
         ${sum('44.80 ÷ 1.12 = 40')}
         ${ans('40.00')}`
      )}
      <p><strong>After a loss:</strong> a car that lost 35% is worth 65% of its first price. If it is now $9100, the first price was 9100 ÷ 0.65 = $14 000.</p>
      ${tip('Do not take 12% of the new price and subtract it. That gives the wrong answer, because the 12% was of the old price.')}`,

    // y9-1G Q11: percentage error
    'y9-1g-error': `
      <p class="hp-tag">Worked example: a measured mass is <b>4.6 kg</b> and the theoretical value is <b>4 kg</b>. Find the percentage error.</p>
      ${steps(
        `<p><strong>Find the size of the error.</strong></p>
         ${sum('4.6 − 4 = 0.6')}`,
        `<p><strong>Divide by the theoretical value and × 100.</strong></p>
         ${sum('0.6/4 × 100 = 15')}
         ${ans('15')}`
      )}
      ${tip('The error is always a positive size, whether the measurement was too big or too small. Divide by the theoretical (true) value.')}`,

    // y9-1G Q12, Q13: GST
    'y9-1g-gst': `
      <p class="hp-tag">Worked example: a price including <b>10% GST</b> is <b>$64.90</b>. How much GST is included?</p>
      ${steps(
        `<p><strong>The GST price is 110% of the price before GST.</strong></p>
         ${sum('before GST = 64.90 ÷ 1.1 = 59')}`,
        `<p><strong>The GST is the difference.</strong> Or, quicker: GST = total ÷ 11.</p>
         ${sum('64.90 − 59 = 5.90')}
         ${ans('5.90')}`
      )}
      ${tip('GST is not 10% of the total: 10% of $64.90 is $6.49, which is too much. A business that claims GST back pays the price before GST.')}`,

    // y9-1G Q14 to Q17: changing and changing back
    'y9-1g-back': `
      <p class="hp-tag">Worked example: a price is cut by <b>40%</b>. What percentage increase takes it back to the start?</p>
      ${steps(
        `<p><strong>Pick an easy starting price</strong>, like $100.</p>
         ${sum('100 × 0.6 = 60')}`,
        `<p><strong>Find the increase needed, as a percentage of the new price.</strong></p>
         ${sum('60 → 100 is up 40<br>40/60 × 100 = 66.67')}
         ${ans('66 2/3')}`
      )}
      ${tip('Going back always needs a different percentage, because the base has changed. After a 30% rise, the decrease needed is 30/130 × 100 = 23.08%.')}`,

    // y9-1G Q18, Q19: several changes in a row
    'y9-1g-repeated': `
      <p class="hp-tag">Worked example: <b>$250</b> is increased by <b>10%</b>, then <b>8%</b>, then <b>5%</b>.</p>
      ${steps(
        `<p><strong>Write a multiplier for each change.</strong></p>
         ${sum('1.10, 1.08, 1.05')}`,
        `<p><strong>Multiply them all onto the start.</strong></p>
         ${sum('250 × 1.10 × 1.08 × 1.05 = 311.85')}
         ${ans('311.85')}`
      )}
      <p><strong>The same change each time?</strong> Use a power. 30 kg growing 20% three times is 30 × 1.2³ = 51.84 kg. A decrease of 10% each time uses 0.9.</p>
      ${tip('Do the whole calculation in one go on the calculator, and round only the final answer.')}`,

    // =====================================================================
    // Year 9 1H Profits and discounts
    // =====================================================================
    // y9-1H Q1, Q2, Q3, Q4, Q7: profit and percentage profit
    'y9-1h-profit': `
      <p class="hp-tag">Worked example: a shop buys a lamp for <b>$240</b> and sells it for <b>$330</b>.</p>
      ${steps(
        `<p><strong>Profit is selling price minus cost price.</strong></p>
         ${sum('330 − 240 = 90')}`,
        `<p><strong>Percentage profit is profit over cost price, × 100.</strong></p>
         ${sum('90/240 × 100 = 37.5')}
         ${ans('90 and 37.5')}`
      )}
      ${tip('The percentage mark-up is found the same way. Any percentage change divides by the starting amount, even for times: a trip from 10 h down to 8 h is a 2/10 = 20% decrease.')}`,

    // y9-1H Q5, Q6: marking up
    'y9-1h-markup': `
      <p class="hp-tag">Worked example: an item costs a shop <b>$68</b> and is marked up by <b>25%</b>. Find the selling price.</p>
      ${steps(
        `<p><strong>A 25% mark-up is a multiplier of 1.25.</strong></p>`,
        `<p><strong>Multiply the cost price.</strong></p>
         ${sum('68 × 1.25 = 85')}
         ${ans('85')}`
      )}
      ${tip('Mark-ups are always a percentage of the cost price. Round money to the nearest cent at the end.')}`,

    // y9-1H Q8, Q9: discounts
    'y9-1h-discount': `
      <p class="hp-tag">Worked example: a <b>15%</b> discount is given on a <b>$86</b> item. How much is paid?</p>
      ${steps(
        `<p><strong>A 15% discount means you pay 85%.</strong></p>
         ${sum('100% − 15% = 85% → 0.85')}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('86 × 0.85 = 73.10')}
         ${ans('73.10')}`
      )}
      ${tip('If the discount is on several items together, add their prices first, then use the multiplier once.')}`,

    // y9-1H Q10, Q11, Q13: finding the price before a discount
    'y9-1h-original': `
      <p class="hp-tag">Worked example: after a <b>25%</b> discount, Sam pays <b>$210</b>. What was the original price?</p>
      ${steps(
        `<p><strong>Sam paid 75% of the original.</strong></p>
         ${sum('original × 0.75 = 210')}`,
        `<p><strong>Divide to undo it.</strong></p>
         ${sum('210 ÷ 0.75 = 280')}
         ${ans('280')}`
      )}
      ${tip('Check: 75% of $280 = $210 ✓. To find a mark-up from the cost price, first work back to the price before the discount, then compare it with the cost.')}`,

    // y9-1H Q12, Q14, Q15: mark-ups and discounts in a chain
    'y9-1h-chain': `
      <p class="hp-tag">Worked example: a <b>$300</b> item is marked up <b>50%</b>, then the marked price is discounted <b>20%</b>. How much higher than $300 is the sale price, as a percentage?</p>
      ${steps(
        `<p><strong>Apply each change in turn.</strong></p>
         ${flow(['Cost', '$300'], ['× 1.5', '$450'], ['× 0.8', '$360'])}`,
        `<p><strong>Compare with the start.</strong></p>
         ${sum('360 − 300 = 60<br>60/300 × 100 = 20')}
         ${ans('20')}`
      )}
      ${tip('A fee in dollars is added, not multiplied. Swapping the order of two percentage changes gives the same result, since multiplying works in any order.')}`,

    // y9-1H Q16, Q17: depreciation
    'y9-1h-depreciation': `
      <p class="hp-tag">Worked example: a <b>$24 000</b> boat loses <b>15%</b> of its value each year. Find its value after 2 years.</p>
      ${steps(
        `<p><strong>Each year it keeps 85% of its value.</strong></p>
         ${sum('after 1 year: 24 000 × 0.85 = 20 400')}`,
        `<p><strong>Multiply again for each year</strong>, or use a power.</p>
         ${sum('24 000 × 0.85² = 17 340')}
         ${ans('17340')}`
      )}
      <p><strong>When does it drop below $10 000?</strong> Keep multiplying by 0.85: after 5 years it is $10 648.93 and after 6 years $9051.59, so 6 whole years.</p>
      ${tip('Each year the 15% is taken from the value at the start of that year, not from the price new.')}`,

    // y9-1H Q18: deposit and discount deal
    'y9-1h-deposit': `
      <p class="hp-tag">Worked example: a <b>$50 000</b> car, deposit <b>$7500</b>. The rest is discounted by one tenth of the deposit percentage. Find the total paid.</p>
      ${steps(
        `<p><strong>Deposit as a percentage of the price.</strong></p>
         ${sum('7500/50 000 × 100 = 15%, so the discount is 1.5%')}`,
        `<p><strong>Discount the amount still owing.</strong></p>
         ${sum('50 000 − 7500 = 42 500<br>42 500 × 0.985 = 41 862.50')}`,
        `<p><strong>Add the deposit back on.</strong></p>
         ${sum('7500 + 41 862.50 = 49 362.50')}
         ${ans('49362.50')}`
      )}
      ${tip('Type the answer without spaces or a $ sign, to the cent if it is not whole.')}`,

    // =====================================================================
    // Year 9 1I Income
    // =====================================================================
    // y9-1I Q1, Q2, Q11: salary, weekly and hourly pay
    'y9-1i-salary': `
      <p class="hp-tag">Worked example: an annual salary of <b>$71 760</b> for a <b>40-hour</b> week. Find the weekly pay and the hourly rate.</p>
      ${steps(
        `<p><strong>Year to week: divide by 52.</strong></p>
         ${sum('71 760 ÷ 52 = 1380')}`,
        `<p><strong>Week to hour: divide by the hours.</strong></p>
         ${sum('1380 ÷ 40 = 34.50')}
         ${ans('1380 and 34.50')}`
      )}
      <p><strong>The other way:</strong> $31.20 an hour for 25 hours a week is 31.20 × 25 × 52 = $40 560 a year.</p>
      ${tip('To compare workers, turn everyone\'s pay into the same thing first, such as pay per week. A month is not 4 weeks: multiply by 12 and divide by 52.')}`,

    // y9-1I Q3, Q4, Q12: overtime
    'y9-1i-overtime': `
      <p class="hp-tag">Worked example: the normal rate is <b>$24</b> an hour. Find the pay for <b>7</b> normal hours, <b>4</b> hours at time and a half and <b>2</b> hours at double time.</p>
      ${steps(
        `<p><strong>Turn everything into normal hours.</strong></p>
         ${sum('7 + 4 × 1.5 + 2 × 2<br>= 7 + 6 + 4 = 17 normal hours')}`,
        `<p><strong>Multiply by the normal rate.</strong></p>
         ${sum('17 × 24 = 408')}
         ${ans('408')}`
      )}
      ${tip('Time and a half is × 1.5 and double time is × 2. Read carefully which hours are paid at which rate.')}`,

    // y9-1I Q5, Q6: finding the normal rate
    'y9-1i-rate': `
      <p class="hp-tag">Worked example: Sam earned <b>$588</b> for <b>16</b> normal hours and <b>8</b> hours at time and a half. What is his normal rate?</p>
      ${steps(
        `<p><strong>Count the normal hours the work is worth.</strong></p>
         ${sum('16 + 8 × 1.5 = 16 + 12 = 28')}`,
        `<p><strong>Share the pay between them.</strong></p>
         ${sum('588 ÷ 28 = 21')}
         ${ans('21')}`
      )}
      ${tip('Check: 16 × 21 + 8 × 31.50 = 336 + 252 = 588 ✓.')}`,

    // y9-1I Q7, Q8, Q13, Q14: retainer plus commission
    'y9-1i-commission': `
      <p class="hp-tag">Worked example: a salesperson earns <b>$550</b> a week plus <b>4.5%</b> commission. Find the pay in a week with <b>$9200</b> of sales.</p>
      ${steps(
        `<p><strong>Commission is a percentage of the sales.</strong></p>
         ${sum('0.045 × 9200 = 414')}`,
        `<p><strong>Add the retainer.</strong></p>
         ${sum('550 + 414 = 964')}
         ${ans('964')}`
      )}
      <p><strong>Finding the rate:</strong> $270 of commission on $6000 of sales is 270/6000 × 100 = 4.5%.</p>
      ${tip('Take the retainer off the total pay before finding the commission rate. A small rate like 0.06% is 0.0006 as a decimal.')}`,

    // y9-1I Q9, Q10: piecework
    'y9-1i-piecework': `
      <p class="hp-tag">Worked example: Kim is paid <b>$45</b> to deliver <b>900</b> flyers. How much is that per flyer?</p>
      ${steps(
        `<p><strong>Divide the pay by the number of items.</strong></p>
         ${sum('45 ÷ 900 = 0.05')}
         ${ans('0.05')}`,
        `<p><strong>An hourly rate from piecework:</strong> $15 per box, 18 boxes in 6 hours.</p>
         ${sum('15 × 18 = 270<br>270 ÷ 6 = 45 per hour')}`
      )}
      ${tip('Give a per-item amount in dollars, like 0.05, not 5 cents.')}`,

    // y9-1I Q17, Q18: tiered commission and comparing pay plans
    'y9-1i-plans': `
      <p class="hp-tag">Worked example: commission is <b>2%</b> on sales up to $40 000 and <b>4%</b> on the part above $40 000. Find the commission on <b>$55 000</b>.</p>
      ${steps(
        `<p><strong>Split the sales at the boundary.</strong></p>
         ${sum('first 40 000: 0.02 × 40 000 = 800<br>the rest: 55 000 − 40 000 = 15 000')}`,
        `<p><strong>Use the higher rate on the part above.</strong></p>
         ${sum('0.04 × 15 000 = 600<br>800 + 600 = 1400')}
         ${ans('1400')}`
      )}
      <p><strong>A rule above $40 000:</strong> A = 800 + 0.04(x − 40 000) = 0.04x − 800.</p>
      <p><strong>When do two plans pay the same?</strong> $300 + 2% against 6%: 300 + 0.02x = 0.06x, so 0.04x = 300 and x = 7500.</p>
      ${tip('Type a rule starting with the letter, like A = 0.04x - 800. Above the break-even point, the plan with the higher percentage pays more.')}`,

    // y9-1I Q15: leave loading
    'y9-1i-loading': `
      <p class="hp-tag">Worked example: Ana receives <b>$2585</b>, which is her normal pay plus <b>17.5%</b> leave loading. How much is the loading?</p>
      ${steps(
        `<p><strong>The total is 117.5% of the normal pay.</strong></p>
         ${sum('normal pay = 2585 ÷ 1.175 = 2200')}`,
        `<p><strong>The loading is the difference.</strong></p>
         ${sum('2585 − 2200 = 385')}
         ${ans('385')}`
      )}
      ${tip('Do not take 17.5% of the total: the loading is 17.5% of the normal pay. Check: 0.175 × 2200 = 385 ✓.')}`,

    // y9-1I Q16: whole numbers of hours at two rates
    'y9-1i-combos': `
      <p class="hp-tag">Worked example: Jo wants to earn <b>$90</b> at <b>$6</b> an hour, with some hours at time and a half (<b>$9</b>). x and y are whole numbers above 0.</p>
      ${steps(
        `<p><strong>At the normal rate only:</strong> 90 ÷ 6 = 15 hours.</p>`,
        `<p><strong>Write an equation for the mix.</strong></p>
         ${sum('6x + 9y = 90')}`,
        `<p><strong>Try values of y and keep the ones where x is a whole number above 0.</strong></p>
         ${sum('y = 2: x = 12<br>y = 4: x = 9<br>y = 6: x = 6<br>y = 8: x = 3')}
         ${ans('y: 2, 4, 6, 8')}`
      )}
      ${tip('Odd values of y leave a half hour, so they do not work. List each set of values in the same order, with commas.')}`,

    // y9-1I Q19: payslips and superannuation
    'y9-1i-payslip': `
      <p class="hp-tag">Worked example: gross pay this fortnight is <b>$1850</b>. Year to date, gross pay is <b>$27 750</b> and tax is <b>$6105</b>.</p>
      ${steps(
        `<p><strong>Superannuation is 12% of gross pay.</strong></p>
         ${sum('0.12 × 1850 = 222')}`,
        `<p><strong>Tax as a percentage of gross pay.</strong></p>
         ${sum('6105/27 750 × 100 = 22')}
         ${ans('222 and 22%')}`
      )}
      ${tip('Net pay is gross pay minus tax. 22% of gross pay means 22 cents in every dollar goes to tax.')}`,

    // =====================================================================
    // Year 9 1J The PAYG income tax system
    // =====================================================================
    // y9-1J Q1, Q5: a full tax return
    'y9-1j-return': `
      <p class="hp-tag">Worked example: Lee earned <b>$61 400</b> from work and <b>$900</b> interest, and has <b>$300</b> of deductions. His employer sent <b>$11 900</b> in tax.</p>
      ${steps(
        `<p><strong>Taxable income = all income minus deductions.</strong></p>
         ${sum('61 400 + 900 − 300 = 62 000')}`,
        `<p><strong>Tax from the table, plus the 2% Medicare levy.</strong></p>
         ${sum('5092 + 0.30 × (62 000 − 45 000)<br>= 5092 + 5100 = 10 192<br>Medicare: 0.02 × 62 000 = 1240<br>Total: 10 192 + 1240 = 11 432')}`,
        `<p><strong>Compare with what was paid.</strong> Paid more than owed means a refund.</p>
         ${sum('11 900 − 11 432 = 468 refund')}
         ${ans('468')}`
      )}
      ${tip('As a percentage of taxable income, his total tax is 11 432/62 000 × 100 = 18.4%. Type amounts without spaces or $ signs.')}`,

    // y9-1J Q2, Q3, Q4, Q12, Q13: using the tax table
    'y9-1j-table': `
      ${taxTable()}
      <p class="hp-tag">Worked example: find the tax on taxable incomes of <b>$38 000</b> and <b>$110 000</b>.</p>
      ${steps(
        `<p><strong>Find the right row.</strong> $38 000 is in the 19c row, $110 000 is in the 30c row.</p>`,
        `<p><strong>Take the amount over the row's start, times the rate.</strong></p>
         ${sum('0.19 × (38 000 − 18 200) = 0.19 × 19 800 = 3762')}`,
        `<p><strong>Add the fixed amount for higher rows.</strong></p>
         ${sum('5092 + 0.30 × (110 000 − 45 000)<br>= 5092 + 19 500 = 24 592')}
         ${ans('3762 and 24592')}`
      )}
      ${tip('Income from several jobs is added first, then taxed once. Every dollar taken off taxable income saves tax at the rate of its row.')}`,

    // y9-1J Q6, Q7, Q8: working backwards
    'y9-1j-backwards': `
      <p class="hp-tag">Worked example: a Medicare levy of <b>$1460</b> is 2% of taxable income. Find the taxable income.</p>
      ${steps(
        `<p><strong>Undo the 2%.</strong></p>
         ${sum('1460 ÷ 0.02 = 73 000')}
         ${ans('73000')}`,
        `<p><strong>From tax payable back to income.</strong> Tax of $9592 is more than $5092, so it is in the 30c row.</p>
         ${sum('9592 − 5092 = 4500<br>4500 ÷ 0.30 = 15 000<br>45 000 + 15 000 = 60 000')}`
      )}
      ${tip('To keep a set amount after tax, remember you only keep part of each extra dollar. At 30c tax, you keep 70c, so divide what you need by 0.7.')}`,

    // y9-1J Q9: other progressive tax systems
    'y9-1j-progressive': `
      ${fig({ kind: 'table', rows: [['Income', 'Tax payable'], ['$0 - $10 000', '$0'], ['$10 001 - $40 000', '10% of each $1 over $10 000'], ['$40 001 and over', '$C + 25% of each $1 over $40 000']] })}
      <p class="hp-tag">Worked example: find <b>C</b>, and the tax on <b>$52 000</b>.</p>
      ${steps(
        `<p><strong>C is the most tax paid in the row before.</strong> That row taxes 30 000 dollars at 10%.</p>
         ${sum('0.10 × (40 000 − 10 000) = 3000')}`,
        `<p><strong>Then use the top row.</strong></p>
         ${sum('3000 + 0.25 × (52 000 − 40 000)<br>= 3000 + 3000 = 6000')}
         ${ans('3000 and 6000')}`
      )}
      ${tip('Some systems tax the whole income at one rate, decided by the bracket. Then one extra dollar can move you into a higher bracket and change the tax on every dollar.')}`,

    // y9-1J Q10, Q11: tax words
    'y9-1j-terms': `
      ${chips(['Gross income: everything earned'], ['Deductions: work costs, donations'], ['Taxable income = gross − deductions', 'add'])}
      <p class="hp-tag">Worked example: an employer sent <b>$6300</b> in tax, but the worker should pay <b>$6650</b>. What happens?</p>
      ${steps(
        `<p><strong>Compare what was paid with what is owed.</strong> $6300 is less than $6650, so not enough was paid.</p>`,
        `<p><strong>The worker owes the difference.</strong> This is a tax liability.</p>
         ${sum('6650 − 6300 = 350')}
         ${ans('A liability of $350')}`
      )}
      ${tip('Paid too much: a refund comes back. Paid too little: a liability must be paid to the ATO.')}`,

    // =====================================================================
    // Year 9 1K Simple interest
    // =====================================================================
    // y9-1K Q1 to Q5, Q10: simple interest and the total
    'y9-1k-interest': `
      <p class="hp-tag">Worked example: <b>$5200</b> is invested at <b>4.5% p.a.</b> simple interest for <b>3 years</b>. Find the interest and the total.</p>
      ${steps(
        `<p><strong>Use I = Prt/100.</strong> P is the principal, r the rate per year, t the time in years.</p>
         ${sum('I = 5200 × 4.5 × 3 ÷ 100 = 702')}`,
        `<p><strong>The total is principal plus interest.</strong></p>
         ${sum('5200 + 702 = 5902')}
         ${ans('702 and 5902')}`
      )}
      ${tip('Time must be in years: 18 months = 18 ÷ 12 = 1.5 years. For equal monthly repayments, divide the total by the number of months.')}`,

    // y9-1K Q6, Q7, Q8, Q11: finding the time, principal or rate
    'y9-1k-rearrange': `
      <p class="hp-tag">Worked example: <b>$3200</b> earns <b>$672</b> simple interest at <b>6% p.a.</b> For how many years was it invested?</p>
      ${steps(
        `<p><strong>Put what you know into I = Prt/100.</strong></p>
         ${sum('672 = 3200 × 6 × t ÷ 100<br>672 = 192t')}`,
        `<p><strong>Solve for t.</strong></p>
         ${sum('t = 672 ÷ 192 = 3.5')}
         ${ans('3.5')}`
      )}
      <p><strong>Finding P:</strong> $255 interest at 3% for 5 years: 255 = P × 3 × 5 ÷ 100 = 0.15P, so P = 255 ÷ 0.15 = $1700.</p>
      ${tip('Give a time in years as a decimal, like 3.5. Round a principal to the nearest cent.')}`,

    // y9-1K Q9: comparing two choices
    'y9-1k-compare': `
      <p class="hp-tag">Worked example: <b>$5000</b> at <b>5% p.a.</b> for 3 years, or at <b>3.5% p.a.</b> for 54 months. Which earns more?</p>
      ${steps(
        `<p><strong>Change months to years.</strong></p>
         ${sum('54 ÷ 12 = 4.5 years')}`,
        `<p><strong>Work out the interest for each.</strong></p>
         ${sum('5000 × 5 × 3 ÷ 100 = 750<br>5000 × 3.5 × 4.5 ÷ 100 = 787.50')}`,
        `<p><strong>Pick the bigger total.</strong></p>
         ${ans('3.5% for 54 months')}`
      )}
      ${tip('A lower rate for a longer time can still win. Always work out both before choosing.')}`,

    // y9-1K Q12, Q13, Q14: doubling, the total rule and rearranging
    'y9-1k-formula': `
      <p class="hp-tag">Worked example: at <b>8% p.a.</b> simple interest, how long does it take to double your money?</p>
      ${steps(
        `<p><strong>Doubling means the interest equals the principal</strong>: I = P.</p>
         ${sum('P = P × 8 × t ÷ 100')}`,
        `<p><strong>Divide both sides by P.</strong></p>
         ${sum('1 = 8t ÷ 100, so t = 100 ÷ 8 = 12.5')}
         ${ans('12.5')}`
      )}
      <p><strong>The total rule:</strong> T = P(1 + rt/100). For $9000 at 5% for 4 years: 9000 × (1 + 20/100) = 9000 × 1.2 = $10 800.</p>
      <p><strong>Rearranging a rule:</strong> do the same to both sides. For A = bh/2, double both sides to get 2A = bh, then divide by b: h = 2A/b.</p>
      ${tip('Type a rearranged rule starting with the letter, and put a product on the bottom in brackets, like m = 2k/(xy).')}`,

    // y9-1K Q15: interest-only loans
    'y9-1k-interest-only': `
      <p class="hp-tag">Worked example: a <b>$360 000</b> flat is bought with an interest-only loan at <b>5% p.a.</b> It rents for <b>$1400</b> a month and costs <b>$2400</b> a year to run.</p>
      ${steps(
        `<p><strong>Interest for a year, then a month.</strong></p>
         ${sum('0.05 × 360 000 = 18 000 a year<br>18 000 ÷ 12 = 1500 a month')}`,
        `<p><strong>Rent for a year.</strong></p>
         ${sum('1400 × 12 = 16 800')}`,
        `<p><strong>Loss = costs minus income.</strong></p>
         ${sum('18 000 + 2400 − 16 800 = 3600')}
         ${ans('3600')}`
      )}
      ${tip('To cover the loss, the value must rise by 3600/360 000 × 100 = 1% of the price each year.')}`,

    // =====================================================================
    // Year 9 1L Compound interest and depreciation
    // =====================================================================
    // y9-1L Q1, Q2, Q3, Q8: compound growth
    'y9-1l-growth': `
      <p class="hp-tag">Worked example: <b>$2500</b> is invested at <b>6% p.a.</b> compounded annually for <b>3 years</b>.</p>
      ${steps(
        `<p><strong>Each year the balance is multiplied by 1.06</strong>, so the interest earns interest too.</p>
         ${fig({ kind: 'table', rows: [['Year', '1', '2', '3'], ['Balance', '$2650', '$2809', '$2977.54']] })}`,
        `<p><strong>Or do it in one step with a power.</strong></p>
         ${sum('2500 × 1.06³ = 2977.54')}
         ${ans('2977.54')}`
      )}
      ${tip('Change months to years first: 30 months is 2.5 years, 60 months is 5 years. Round to the nearest cent only at the end.')}`,

    // y9-1L Q4, Q13, Q14: total percentage increase
    'y9-1l-percent': `
      <p class="hp-tag">Worked example: find the total percentage increase at <b>7% p.a.</b> compounded annually for <b>3 years</b>.</p>
      ${steps(
        `<p><strong>The starting amount does not matter.</strong> Find the growth factor.</p>
         ${sum('1.07³ = 1.225043')}`,
        `<p><strong>Take off the 1 and change to a percentage.</strong></p>
         ${sum('1.225043 − 1 = 0.225043 → 22.5%')}
         ${ans('22.5')}`
      )}
      <p><strong>Simple against compound:</strong> 3% for 5 years is 3 × 5 = 15% simple, but 1.03⁵ = 1.159274, so 15.93% compound.</p>
      ${tip('Type just the number, without a % sign, rounded as asked.')}`,

    // y9-1L Q5, Q6, Q10: finding the starting amount
    'y9-1l-backwards': `
      <p class="hp-tag">Worked example: after <b>3 years</b> at <b>4% p.a.</b> compounded annually, a balance is <b>$25 000</b>. Find the amount first invested.</p>
      ${steps(
        `<p><strong>Write the growth as an equation.</strong></p>
         ${sum('P × 1.04³ = 25 000')}`,
        `<p><strong>Divide to undo it.</strong></p>
         ${sum('P = 25 000 ÷ 1.04³ = 22 224.91')}
         ${ans('22225')}`
      )}
      <p><strong>Shrinking backwards:</strong> a rock that lost 5% a year for 3 years and now weighs 8.2 kg weighed 8.2 ÷ 0.95³ = 9.56 kg.</p>
      ${tip('Divide by the whole power in one go, then round. Rounding part way through can put the answer out by a dollar.')}`,

    // y9-1L Q7, Q9: depreciation
    'y9-1l-depreciation': `
      <p class="hp-tag">Worked example: a <b>$2400</b> phone depreciates at <b>30% p.a.</b> Find its value after <b>3 years</b>.</p>
      ${steps(
        `<p><strong>Each year it keeps 70%.</strong> The multiplier is 0.7.</p>`,
        `<p><strong>Use a power for the years.</strong></p>
         ${sum('2400 × 0.7³ = 823.20')}
         ${ans('823')}`
      )}
      ${tip('A falling population works the same way. Round a number of people to a whole number at the end.')}`,

    // y9-1L Q11, Q12: how many years
    'y9-1l-years': `
      <p class="hp-tag">Worked example: <b>$5000</b> is invested at <b>9% p.a.</b> compounded annually. How many whole years until it reaches at least <b>$10 000</b>?</p>
      ${steps(
        `<p><strong>It needs to double</strong>, so look for 1.09ⁿ ≥ 2.</p>`,
        `<p><strong>Try values of n on a calculator.</strong></p>
         ${sum('1.09⁸ = 1.993 (not yet)<br>1.09⁹ = 2.172 ✓')}
         ${ans('9')}`
      )}
      ${tip('Find the target factor first: final amount ÷ start. Then keep trying powers until you pass it.')}`,

    // y9-1L Q15, Q16, Q17: the equivalent simple interest rate
    'y9-1l-equivalent': `
      <p class="hp-tag">Worked example: <b>$5000</b> at <b>8% p.a.</b> compounded annually for <b>3 years</b>. What simple rate gives the same interest?</p>
      ${steps(
        `<p><strong>Find the compound interest.</strong></p>
         ${sum('5000 × 1.08³ = 6298.56<br>6298.56 − 5000 = 1298.56')}`,
        `<p><strong>Use r = 100I/(Pt).</strong></p>
         ${sum('r = 100 × 1298.56 ÷ (5000 × 3) = 8.66')}
         ${ans('8.66')}`
      )}
      ${tip('The simple rate is always a bit higher, because compound interest also earns interest on the interest.')}`,

    // =====================================================================
    // Year 9 1M Using a formula for compound interest and depreciation
    // =====================================================================
    // y9-1M Q1, Q2, Q7: the compound interest formula
    'y9-1m-formula': `
      <p class="hp-tag">Worked example: <b>$4200</b> at <b>3.2% p.a.</b> compounded annually for <b>5 years</b>.</p>
      ${steps(
        `<p><strong>Use A = P(1 + r/100)ⁿ.</strong></p>
         ${sum('A = 4200 × (1 + 3.2/100)⁵ = 4200 × 1.032⁵')}`,
        `<p><strong>Work it out in one go.</strong></p>
         ${sum('A = 4916.41')}`,
        `<p><strong>Interest = final amount minus principal.</strong></p>
         ${sum('4916.41 − 4200 = 716.41')}
         ${ans('4916.41 and 716.41')}`
      )}
      ${tip('Inflation is the same formula: a price growing 2% a year is multiplied by 1.02 each year. Round to the nearest cent.')}`,

    // y9-1M Q3, Q8, Q9, Q13: compounding more often than once a year
    'y9-1m-monthly': `
      <p class="hp-tag">Worked example: <b>$5000</b> at <b>6% p.a.</b> compounded <b>quarterly</b> for <b>2 years</b>.</p>
      ${steps(
        `<p><strong>Split the rate and count the periods.</strong> Quarterly means 4 times a year.</p>
         ${sum('rate per quarter: 6 ÷ 4 = 1.5%<br>periods: 2 × 4 = 8')}`,
        `<p><strong>Use the formula with those.</strong></p>
         ${sum('5000 × 1.015⁸ = 5632.46')}
         ${ans('5632.46')}`
      )}
      ${tip('Monthly: divide the rate by 12 and multiply the years by 12. To find how much to invest now, divide the target by the growth factor instead of multiplying.')}`,

    // y9-1M Q4: depreciation with the formula
    'y9-1m-depreciation': `
      <p class="hp-tag">Worked example: a <b>$36 000</b> car depreciates at <b>20% p.a.</b> Find its value after <b>3 years</b>.</p>
      ${steps(
        `<p><strong>Use A = P(1 − r/100)ⁿ.</strong></p>
         ${sum('A = 36 000 × (1 − 0.2)³ = 36 000 × 0.8³')}`,
        `<p><strong>Work it out.</strong></p>
         ${sum('36 000 × 0.512 = 18 432')}
         ${ans('18432')}`
      )}
      ${tip('Depreciation uses a minus inside the bracket, so the multiplier is less than 1. Type the answer without spaces.')}`,

    // y9-1M Q5, Q6, Q10, Q12: comparing simple and compound interest
    'y9-1m-compare': `
      <p class="hp-tag">Worked example: <b>$900</b> at <b>4% p.a.</b> for <b>5 years</b>. Compare simple and compound interest.</p>
      ${steps(
        `<p><strong>Simple interest.</strong></p>
         ${sum('900 × 4 × 5 ÷ 100 = 180')}`,
        `<p><strong>Compound interest (annually).</strong></p>
         ${sum('900 × 1.04⁵ − 900 = 194.99')}`,
        `<p><strong>The simple rate that matches</strong>, from r = 100I/(Pt).</p>
         ${sum('100 × 194.99 ÷ (900 × 5) = 4.33')}
         ${ans('180, 194.99, 4.33')}`
      )}
      ${tip('To find the time instead, use t = 100I/(Pr). To test a claim, such as what happens when the principal or the rate changes, work out both versions and compare them.')}`,

    // y9-1M Q11: reading the working
    'y9-1m-read': `
      <p class="hp-tag">Worked example: what situations match <b>750(1.006)²⁴</b> and <b>3200(0.88)⁵</b>?</p>
      ${steps(
        `<p><strong>Above 1 is growth.</strong> 1.006 means 0.6% each period. 24 periods of 0.6% looks monthly: 0.6 × 12 = 7.2% p.a., for 24 ÷ 12 = 2 years.</p>
         ${ans('$750 at 7.2% p.a. compounded monthly for 2 years')}`,
        `<p><strong>Below 1 is depreciation.</strong> 0.88 keeps 88%, so it loses 12% each year, for 5 years.</p>
         ${ans('A $3200 item depreciating at 12% p.a. for 5 years')}`
      )}
      ${tip('The number in front is the starting amount, and the power is the number of periods.')}`,

    // y9-1M Q14: doubling time and the rule of 72
    'y9-1m-double': `
      <p class="hp-tag">Worked example: at <b>10% p.a.</b> compounded annually, how many whole years does it take to double your money?</p>
      ${steps(
        `<p><strong>Doubling means 1.1ⁿ ≥ 2.</strong> Try powers.</p>
         ${sum('1.1⁷ = 1.949<br>1.1⁸ = 2.144 ✓')}
         ${ans('8')}`,
        `<p><strong>The rule of 72 gives a quick estimate.</strong></p>
         ${sum('72 ÷ 10 = 7.2 years')}`
      )}
      <p><strong>The exact rate to double in 5 years:</strong> you need (1 + r/100)⁵ = 2, so 1 + r/100 = 2^(1/5) = 1.1487, which is about 14.9%.</p>
      ${tip('Type several values with commas, in order. On most calculators, the fifth root of 2 is 2^(1/5).')}`
  });
})();
