/* H3 help panels for Year 8 Chapter 1. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 1A to 1H. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // Factor tree picture. A node is a string (a prime, circled) or [label, left, right].
  const tree = (t, label) => {
    const W = 44, H = 52, R = 15, P = 22;
    const leaves = n => Array.isArray(n) ? leaves(n[1]) + leaves(n[2]) : 1;
    const depth = n => Array.isArray(n) ? 1 + Math.max(depth(n[1]), depth(n[2])) : 0;
    const w = leaves(t) * W, h = depth(t) * H + P * 2;
    let lines = '', marks = '';
    const txt = (x, y, s) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" fill="currentColor" style="font:700 15px var(--f-mono)">${s}</text>`;
    const place = (n, x0, y) => {
      if (!Array.isArray(n)) {
        const x = x0 + W / 2;
        marks += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" style="stroke:var(--h3-green);stroke-width:2"/>` + txt(x, y, n);
        return x;
      }
      const lw = leaves(n[1]) * W;
      const a = place(n[1], x0, y + H), b = place(n[2], x0 + lw, y + H);
      const x = (a + b) / 2;
      const end = (c) => Array.isArray(c) ? 11 : R + 2;
      lines += `<line x1="${x}" y1="${y + 11}" x2="${a}" y2="${y + H - end(n[1])}"/><line x1="${x}" y1="${y + 11}" x2="${b}" y2="${y + H - end(n[2])}"/>`;
      marks += txt(x, y, n[0]);
      return x;
    };
    place(t, 0, P);
    return `<div class="qfig hp-fig" style="color:var(--ink)"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="max-width:100%;height:auto" role="img" aria-label="${label}">
      <g stroke="currentColor" stroke-opacity=".55" stroke-width="1.5">${lines}</g>${marks}</svg></div>`;
  };

  // A 3 by 3 grid with a label in each cell (rows top to bottom).
  const grid3 = (rows, alt) => {
    const items = [];
    for (let i = 0; i <= 3; i++) { items.push({ seg: [0, i * 1.2, 3.6, i * 1.2] }); items.push({ seg: [i * 1.2, 0, i * 1.2, 3.6] }); }
    rows.forEach((r, ri) => r.forEach((c, ci) => items.push({ label: c, at: [0.6 + ci * 1.2, 3 - ri * 1.2] })));
    return fig({ kind: 'diagram', unit: 40, items, alt });
  };

  // A magic triangle: three corners and three middles, each a label in a circle.
  const tri = (corners, middles, alt) => {
    const P = [[0, 0], [4, 0], [2, 3.464]];
    const M = [[2, 0], [3, 1.732], [1, 1.732]];
    const items = [{ poly: P }];
    P.forEach((p, i) => { items.push({ circle: [p[0], p[1], 0.45], fill: true }); items.push({ label: corners[i], at: [p[0], p[1] - 0.12] }); });
    M.forEach((p, i) => { items.push({ circle: [p[0], p[1], 0.45], fill: true }); items.push({ label: middles[i], at: [p[0], p[1] - 0.12] }); });
    return fig({ kind: 'diagram', unit: 40, items, alt });
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 8 1A Adding and subtracting positive integers
    // =====================================================================
    // y8-1A Q1, Q2: mental strategies
    'y8-1a-mental': `
      <p class="hp-tag">Worked example: <b>346 − 28</b></p>
      ${steps(
        `<p><strong>Round the awkward number to a tens number.</strong> 28 is 2 less than 30, so take away 30.</p>
         ${sum('346 − 30 = 316')}`,
        `<p><strong>Fix it up.</strong> You took away 2 too many, so give 2 back.</p>
         ${sum('316 + 2 = 318')}
         ${ans('318')}`
      )}
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">If you see</span><span role="columnheader">Try</span><span role="columnheader">Example</span></div>
        <div class="hp-tr" role="row"><span role="cell">No carrying needed</span><span role="cell">Split into places</span><span role="cell">423 + 254 = 600 + 70 + 7 = 677</span></div>
        <div class="hp-tr" role="row"><span role="cell">Close to a tens number</span><span role="cell">Round, then fix</span><span role="cell">346 − 28 = 316 + 2 = 318</span></div>
        <div class="hp-tr" role="row"><span role="cell">Two nearly equal numbers</span><span role="cell">Near doubles</span><span role="cell">160 + 161 = 320 + 1 = 321</span></div>
      </div>
      ${tip('When adding, round up and then take back. When taking away, round up and then give back.')}`,

    // y8-1A Q3: column addition and subtraction
    'y8-1a-column': `
      <p class="hp-tag">Worked example: <b>6042 − 375</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '5', '9', '13', '12'] },
        { cells: ['', '~6', '~0', '~4', '~2'] },
        { cells: d('− 375') },
        { kind: 'res', cells: d(' 5667') }
      ])}
      ${steps(
        `<p><strong>Line up the ones.</strong> Ones: 2 − 5 does not work, so trade 1 ten. The 4 tens become 3, and the 2 ones become 12.</p>
         ${sum('12 − 5 = 7')}`,
        `<p><strong>Tens:</strong> 3 − 7 does not work, and there are 0 hundreds to trade. Go to the thousands: 6 thousands become 5, the hundreds become 10, then give 1 hundred to the tens. That leaves 9 hundreds and 13 tens.</p>
         ${sum('13 − 7 = 6')}`,
        `<p><strong>Hundreds and thousands:</strong></p>
         ${sum('9 − 3 = 6<br>5 − 0 = 5')}
         ${ans('5667')}`
      )}
      ${tip('For addition, add each whole column and carry, even with three or four numbers. Check a subtraction by adding: 5667 + 375 = 6042.')}`,

    // y8-1A Q4, Q5: estimating by rounding first
    'y8-1a-estimate': `
      <p class="hp-tag">Worked example: estimate <b>2649 + 1381</b> by rounding each number to the nearest 100.</p>
      ${steps(
        `<p><strong>Round each number first.</strong> Look at the tens digit: 5 or more rounds up.</p>
         ${sum('2649 → 2600 (4 rounds down)<br>1381 → 1400 (8 rounds up)')}`,
        `<p><strong>Work out the easy sum.</strong></p>
         ${sum('2600 + 1400 = 4000')}
         ${ans('4000')}`
      )}
      <p><strong>Money works the same way.</strong> $6.96 + $3.08 rounds to $7 + $3, so about $10. $8.04 − $2.97 rounds to $8 − $3, so about $5.</p>
      ${tip('Round first, then calculate. Do not work out the exact answer and round that. Type just the number, with no $ sign.')}`,

    // y8-1A Q6: start and end readings
    'y8-1a-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A bus odometer reads <span class="hp-hl">52 817</span> km at the start of the day and <span class="hp-hl">53 456</span> km at the end. How far did the bus <span class="hp-kw">travel</span>?</p>
      ${steps(
        `<p><strong>The distance is the difference</strong>, so take the start reading from the end reading.</p>
         ${sum('53 456 − 52 817')}`,
        `<p><strong>Use the column method.</strong></p>
         ${sum('53 456 − 52 817 = 639')}
         ${ans('639')}`
      )}
      ${tip('Check by adding: 52 817 + 639 = 53 456. Type the answer without a space or units.')}`,

    // y8-1A Q7, Q9: two numbers from their sum and difference
    'y8-1a-sum-diff': `
      <p class="hp-tag">Worked example: two numbers add to <b>64</b> and their difference is <b>10</b>. What is the larger number?</p>
      ${steps(
        `<p><strong>Add the sum and the difference.</strong> That makes two lots of the larger number.</p>
         ${sum('64 + 10 = 74')}`,
        `<p><strong>Halve it.</strong></p>
         ${sum('74 ÷ 2 = 37')}
         ${ans('37')}`,
        `<p><strong>The smaller number is the rest of the sum.</strong></p>
         ${sum('64 − 37 = 27<br>Check: 37 − 27 = 10 ✓')}`
      )}
      <p><strong>"More than" stories.</strong> Sam has 8 more marbles than Jo, and together they have 50. Take off Sam's extra 8 first: 50 − 8 = 42. Now they have equal shares, so Jo has 42 ÷ 2 = 21 and Sam has 29.</p>
      ${tip('Read which person or number the question asks for: the larger or the smaller.')}`,

    // y8-1A Q8: missing digits
    'y8-1a-missing': `
      <p class="hp-tag">Worked example: find the missing digits in <b>5□6 + □4□ = 821</b>.</p>
      ${algo([
        { cells: d(' 5□6') },
        { cells: d('+□4□') },
        { kind: 'res', cells: d(' 821') }
      ])}
      ${steps(
        `<p><strong>Start with the ones.</strong> 6 + □ ends in 1. Only 6 + 5 = 11 works, so the digit is 5 and you carry 1.</p>`,
        `<p><strong>Tens:</strong> □ + 4 + 1 (the carry) ends in 2. 7 + 4 + 1 = 12, so the digit is 7. Carry 1 again.</p>`,
        `<p><strong>Hundreds:</strong> 5 + □ + 1 = 8, so the digit is 2. Now read the boxes row by row, top row first, left to right.</p>
         ${sum('576 + 245 = 821 ✓')}
         ${ans('7, 2, 5')}`
      )}
      ${tip('Do not forget the carries. For a subtraction, it can help to turn it round: the answer plus the bottom number gives the top number.')}`,

    // y8-1A Q10: long sums that cancel or pair up
    'y8-1a-pattern': `
      <p class="hp-tag">Worked example: <b>40 − 39 + 38 − 37 + ... + 2 − 1</b></p>
      ${steps(
        `<p><strong>Look for pairs that make the same answer.</strong> Bracket the terms two at a time.</p>
         ${sum('(40 − 39) + (38 − 37) + ... + (2 − 1)')}`,
        `<p><strong>Each pair makes 1.</strong> There are 40 numbers, so there are 20 pairs.</p>
         ${sum('20 × 1 = 20')}
         ${ans('20')}`
      )}
      ${tip('Numbers that are added and then taken away cancel out: 4 + 9 + 6 − 9 − 4 = 6. Cross off each cancelling pair and see what is left.')}`,

    // y8-1A Q11: puzzles that cannot be solved
    'y8-1a-impossible': `
      <p class="hp-tag">Worked example: why can <b>□□ + □□ = 205</b> not be solved?</p>
      ${steps(
        `<p><strong>Try to make the answer as big as possible.</strong> Put 9 in every box.</p>
         ${sum('99 + 99 = 198')}`,
        `<p><strong>Compare.</strong> Even the biggest possible sum is less than 205, so no digits can work.</p>
         ${ans('The biggest possible sum is less than 205')}`
      )}
      ${tip('For a difference, make it as big as possible with the biggest top number and the smallest bottom number. If that is still too small, the puzzle cannot work.')}`,

    // y8-1A Q12: letters in addition and subtraction
    'y8-1a-letters': `
      <p class="hp-tag">Worked example: what goes in the box? <b>p − q + r = r + □ − q</b></p>
      ${steps(
        `<p><strong>Each letter keeps the sign in front of it.</strong> On the left: p is added, q is taken away, r is added.</p>
         ${chips(['+ p', 'add'], ['− q', 'take'], ['+ r', 'add'])}`,
        `<p><strong>You can move terms around</strong>, as long as each keeps its sign. The right side already has + r and − q. The missing one is + p.</p>
         ${ans('p')}`
      )}
      ${tip('Check with numbers. Try p = 6, q = 2, r = 5: 6 − 2 + 5 = 9 and 5 + 6 − 2 = 9 ✓.')}`,

    // y8-1A Q13: counting the combinations that work
    'y8-1a-combos': `
      <p class="hp-tag">Worked example: how many ways can you fill <b>3□4 + 2□□ = 589</b>?</p>
      ${steps(
        `<p><strong>Ones:</strong> 4 + □ ends in 9. It cannot be 19 (a digit is at most 9), so the box is 5, with no carry.</p>`,
        `<p><strong>Hundreds:</strong> 3 + 2 = 5, which matches the answer. So the tens must not carry either: the two tens boxes add to exactly 8.</p>`,
        `<p><strong>List the tens pairs and count them.</strong></p>
         ${chips(['0 + 8'], ['1 + 7'], ['2 + 6'], ['3 + 5'], ['4 + 4'], ['5 + 3'], ['6 + 2'], ['7 + 1'], ['8 + 0'])}
         ${ans('9')}`
      )}
      ${tip('Count the pairs with a list so you do not miss any. Swapping the two digits (2 + 5 and 5 + 2) gives a different combination.')}`,

    // y8-1A Q14: magic triangles
    'y8-1a-magic': `
      <p class="hp-tag">Worked example: put the digits <b>1 to 6</b> in the circles so that each side adds to <b>10</b>. Which digits go in the corners?</p>
      ${tri(['1', '3', '5'], ['6', '2', '4'], 'A magic triangle with 1, 3 and 5 in the corners and 6, 2 and 4 in the middles of the sides')}
      ${steps(
        `<p><strong>Add up all three sides.</strong> Every digit is used once, but each corner sits on two sides, so the corners are counted twice.</p>
         ${sum('3 sides × 10 = 30<br>1 + 2 + 3 + 4 + 5 + 6 = 21')}`,
        `<p><strong>The extra is the corners.</strong></p>
         ${sum('30 − 21 = 9, so the corners add to 9')}`,
        `<p><strong>Try corner sets that add to 9</strong> and fill in the middles. 1, 3 and 5 works: 1 + 6 + 3, 3 + 2 + 5 and 5 + 4 + 1 all make 10.</p>
         ${ans('1, 3, 5')}`
      )}
      ${tip('The same idea works with more circles: the three sides always add to the total of all the numbers, plus the corners once more.')}`,

    // =====================================================================
    // Year 8 1B Multiplying and dividing positive integers
    // =====================================================================
    // y8-1B Q1, Q2, Q3, Q6: mental strategies
    'y8-1b-mental': `
      <p class="hp-tag">Worked example: <b>9 × 29</b></p>
      ${steps(
        `<p><strong>Round to a tens number.</strong> 29 is 1 less than 30.</p>
         ${sum('9 × 30 = 270')}`,
        `<p><strong>Fix it up.</strong> You multiplied 1 too many lots of 9, so take one 9 away.</p>
         ${sum('270 − 9 = 261')}
         ${ans('261')}`
      )}
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">If you see</span><span role="columnheader">Try</span><span role="columnheader">Example</span></div>
        <div class="hp-tr" role="row"><span role="cell">A 5 and an even number</span><span role="cell">Double and halve</span><span role="cell">5 × 64 = 10 × 32 = 320</span></div>
        <div class="hp-tr" role="row"><span role="cell">Just over a tens number</span><span role="cell">Split and add</span><span role="cell">3 × 92 = 270 + 6 = 276</span></div>
        <div class="hp-tr" role="row"><span role="cell">Dividing by 4 or 8</span><span role="cell">Halve, then halve again</span><span role="cell">852 ÷ 4 = 426 ÷ 2 = 213</span></div>
        <div class="hp-tr" role="row"><span role="cell">Easy parts</span><span role="cell">Split and divide</span><span role="cell">515 ÷ 5 = 100 + 3 = 103</span></div>
      </div>
      ${tip('With three numbers, look for a pair that makes 10 or 100 first: 2 × 5 = 10.')}`,

    // y8-1B Q4: the multiplication algorithm
    'y8-1b-algo': `
      <p class="hp-tag">Worked example: <b>247 × 36</b></p>
      ${algo([
        { cells: d('  247') },
        { cells: d('×  36') },
        { kind: 'res', cells: d(' 1482'), note: '247 × 6' },
        { cells: d('+7410'), note: '247 × 30' },
        { kind: 'res', cells: d(' 8892') }
      ])}
      ${steps(
        `<p><strong>Multiply by the ones digit.</strong></p>
         ${sum('247 × 6 = 1482')}`,
        `<p><strong>Multiply by the tens digit.</strong> Put a 0 in the ones place first, because you are really multiplying by 30.</p>
         ${sum('247 × 30 = 7410')}`,
        `<p><strong>Add the rows.</strong></p>
         ${sum('1482 + 7410 = 8892')}
         ${ans('8892')}`
      )}
      ${tip('A three-digit multiplier needs a third row starting with two zeros. A 0 digit in the multiplier gives a row of zeros, so you can skip it.')}`,

    // y8-1B Q5: short division with a remainder
    'y8-1b-division': `
      <p class="hp-tag">Worked example: <b>893 ÷ 15</b></p>
      ${steps(
        `<p><strong>Write out some multiples of 15</strong> to help.</p>
         ${chips(['15'], ['30'], ['45'], ['60'], ['75'], ['90'], ['105'], ['120'], ['135'])}`,
        `<p><strong>Divide digit by digit.</strong> 8 ÷ 15 = 0 r 8. Carry the 8 to make 89. 89 ÷ 15 = 5 r 14, because 5 × 15 = 75. Carry the 14 to make 143. 143 ÷ 15 = 9 r 8, because 9 × 15 = 135.</p>
         ${bus('15', ['8', '9', '3'], ['0', '5', '9'], ['', '8', '14'], 'r 8')}`,
        `<p><strong>The last leftover is the remainder.</strong> Type the quotient, then r, then the remainder.</p>
         ${ans('59 r 8')}`
      )}
      ${tip('Check: 59 × 15 + 8 = 885 + 8 = 893 ✓. If it divides exactly, type r 0.')}`,

    // y8-1B Q7: estimating with money
    'y8-1b-estimate': `
      <p class="hp-tag">Worked example: estimate the cost of <b>7 packets at $5.95</b> each.</p>
      ${steps(
        `<p><strong>Round the amount to the nearest dollar.</strong></p>
         ${sum('$5.95 → $6')}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('7 × $6 = $42')}
         ${ans('42')}`
      )}
      <p><strong>Sharing works the same way.</strong> $47.85 shared into 6 parts: round to $48, then $48 ÷ 6 = $8.</p>
      ${tip('Type just the number, with no $ sign.')}`,

    // y8-1B Q8, Q9, Q11: word problems
    'y8-1b-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A ferry carries <span class="hp-hl">16</span> cars on <span class="hp-kw">each</span> trip. How many trips are <span class="hp-kw">needed</span> to move <span class="hp-hl">230</span> cars?</p>
      ${steps(
        `<p><strong>Groups of the same size: divide.</strong></p>
         ${sum('230 ÷ 16 = 14 r 6')}`,
        `<p><strong>Decide what the remainder means.</strong> 6 cars are still waiting, so the ferry needs one more trip.</p>
         ${ans('15')}`
      )}
      ${chips(['Everyone needs a place → round up', 'add'], ['Rate per hour → total ÷ hours', 'add'], ['Boxes left → take away, then × per box', 'take'])}
      ${tip('A rate like "per hour" is a division: $405 for 27 hours is 405 ÷ 27 = $15 per hour.')}`,

    // y8-1B Q10: comparing two ways to pay
    'y8-1b-compare': `
      <p class="hp-tag">Worked example: Option A is <b>9 payments of $85</b>. Option B is <b>$790</b> up front. Which is cheaper, and by how much?</p>
      ${steps(
        `<p><strong>Find the total for the payment plan.</strong></p>
         ${sum('9 × $85 = $765')}`,
        `<p><strong>Compare.</strong> $765 is less than $790, so Option A is cheaper.</p>`,
        `<p><strong>"How much cheaper" is the difference.</strong></p>
         ${sum('$790 − $765 = $25')}
         ${ans('Option A, 25')}`
      )}
      ${tip('Payment plans often cost more, but not always. Always work out both totals before you choose.')}`,

    // y8-1B Q12: missing digits in multiplication and division
    'y8-1b-missing': `
      <p class="hp-tag">Worked example: <b>□6□ ÷ 12 = 47</b> with remainder <b>5</b>. Find the missing digits.</p>
      ${steps(
        `<p><strong>Undo the division.</strong> The number is the quotient times the divisor, plus the remainder.</p>
         ${sum('47 × 12 = 564')}`,
        `<p><strong>Add the remainder.</strong></p>
         ${sum('564 + 5 = 569')}`,
        `<p><strong>Read off the missing digits</strong>, left to right.</p>
         ${ans('5, 9')}`
      )}
      ${tip('For a multiplication puzzle, start with the ones column and work left, and check every row with the digits you found.')}`,

    // y8-1B Q13: simplifying with letters
    'y8-1b-letters': `
      <p>These rules work for every number except dividing by 0, so they work for letters too.</p>
      ${chips(['a ÷ a = 1'], ['a ÷ 1 = a'], ['0 ÷ a = 0'])}
      <p class="hp-tag">Worked example: simplify <b>m ÷ m × 9</b></p>
      ${steps(
        `<p><strong>Work left to right.</strong> m ÷ m is 1.</p>
         ${sum(`${now('m ÷ m')} × 9 = 1 × 9`)}`,
        `<p><strong>Finish it off.</strong></p>
         ${ans('9')}`
      )}
      ${tip('Not sure? Try a number. If m = 4: 4 ÷ 4 × 9 = 1 × 9 = 9 ✓.')}`,

    // y8-1B Q14: dividing by two factors in turn
    'y8-1b-factors': `
      <p class="hp-tag">Worked example: <b>432 ÷ 12</b></p>
      ${steps(
        `<p><strong>Split the divisor into two factors.</strong></p>
         ${sum('12 = 4 × 3')}`,
        `<p><strong>Divide by one factor, then the other.</strong></p>
         ${flow(['Start', '432'], ['÷ 4', '108'], ['÷ 3', '36'])}
         ${ans('36')}`
      )}
      ${tip('Dividing by 4 is halving twice. Pick factors that are easy to divide by.')}`,

    // y8-1B Q15: using the distributive law
    'y8-1b-distrib': `
      <p class="hp-tag">Worked example: <b>(47 × 6) + (53 × 6)</b></p>
      ${steps(
        `<p><strong>Find the number in both parts.</strong> Both are "something times 6".</p>
         ${sum(`(47 × ${now('6')}) + (53 × ${now('6')})`)}`,
        `<p><strong>Join the other numbers first.</strong> 47 sixes and 53 sixes make 100 sixes.</p>
         ${sum('(47 + 53) × 6 = 100 × 6 = 600')}
         ${ans('600')}`
      )}
      ${tip('Taking away works too: (76 × 11) − (66 × 11) = 10 × 11 = 110.')}`,

    // y8-1B Q16: greatest number of tickets
    'y8-1b-tickets': `
      <p class="hp-tag">Worked example: Ava spends exactly <b>$50</b> on tickets at <b>$4</b> and <b>$7</b>. What is the greatest number of tickets she could buy?</p>
      ${steps(
        `<p><strong>Try each number of $7 tickets.</strong> The money left must divide by 4.</p>
         <div class="hp-table" role="table">
           <div class="hp-tr hp-th" role="row"><span role="columnheader">$7 tickets</span><span role="columnheader">Money left</span><span role="columnheader">$4 tickets</span></div>
           <div class="hp-tr" role="row"><span role="cell">0, 1</span><span role="cell">50, 43</span><span role="cell">✗</span></div>
           <div class="hp-tr" role="row"><span role="cell">2</span><span role="cell">36</span><span role="cell">9 ✓</span></div>
           <div class="hp-tr" role="row"><span role="cell">3, 4, 5</span><span role="cell">29, 22, 15</span><span role="cell">✗</span></div>
           <div class="hp-tr" role="row"><span role="cell">6</span><span role="cell">8</span><span role="cell">2 ✓</span></div>
         </div>`,
        `<p><strong>Count the tickets for each way that works.</strong> 2 + 9 = 11 and 6 + 2 = 8.</p>
         ${ans('11')}`
      )}
      ${tip('More of the cheaper ticket means more tickets in total.')}`,

    // =====================================================================
    // Year 8 1C Number properties
    // =====================================================================
    // y8-1C Q1: lowest common multiple
    'y8-1c-lcm': `
      <p class="hp-tag">Worked example: find the LCM of <b>8</b> and <b>10</b>.</p>
      ${steps(
        `<p><strong>List some multiples of each number.</strong> Keep going until a number turns up in both lists.</p>
         ${sum('Multiples of 8: 8, 16, 24, 32, 40, 48, ...<br>Multiples of 10: 10, 20, 30, 40, 50, ...')}`,
        `<p><strong>Choose the smallest number that is in both lists.</strong></p>
         ${ans('40')}`
      )}
      ${tip('LCM means the lowest common multiple: the smallest number that is in both times tables. 80 is in both lists too, but 40 is the lowest.')}`,

    // y8-1C Q2: highest common factor
    'y8-1c-hcf': `
      <p class="hp-tag">Worked example: find the HCF of <b>20</b> and <b>32</b>.</p>
      ${steps(
        `<p><strong>List the factors of each number</strong> in pairs.</p>
         ${sum('20: 1, 2, 4, 5, 10, 20<br>32: 1, 2, 4, 8, 16, 32')}`,
        `<p><strong>Find the biggest factor in both lists.</strong></p>
         ${ans('4')}`
      )}
      ${tip('Two different primes share only the factor 1, so their HCF is 1.')}`,

    // y8-1C Q3, Q5: squares and cubes
    'y8-1c-powers': `
      <p class="hp-tag">Worked example: <b>13²</b> and <b>6³</b></p>
      ${steps(
        `<p><strong>A square is a number times itself.</strong></p>
         ${sum('13² = 13 × 13 = 169')}`,
        `<p><strong>A cube uses the number three times.</strong> Multiply two of them first.</p>
         ${sum('6³ = 6 × 6 × 6 = 36 × 6 = 216')}
         ${ans('169 and 216')}`,
        `<p><strong>Tens numbers work the same way.</strong> Write out the multiplication and work it through.</p>
         ${sum('70² = 70 × 70 = 4900<br>50³ = 50 × 50 × 50 = 2500 × 50 = 125 000')}`
      )}
      ${tip('6³ is not 6 × 3. The small 3 says how many 6s to multiply.')}`,

    // y8-1C Q4, Q6: square roots and cube roots
    'y8-1c-roots': `
      <p class="hp-tag">Worked example: <b>√49</b> and <b>∛216</b></p>
      ${steps(
        `<p><strong>A square root asks: what times itself makes this?</strong></p>
         ${sum('7 × 7 = 49, so √49 = 7')}`,
        `<p><strong>A cube root asks: what used three times makes this?</strong></p>
         ${sum('6 × 6 × 6 = 216, so ∛216 = 6')}
         ${ans('7 and 6')}`
      )}
      ${tip('Tens numbers work the same way. √2500 = 50, since 50 × 50 = 2500. ∛125 000 = 50, since 50 × 50 × 50 = 125 000.')}`,

    // y8-1C Q7: LCM and HCF of three numbers
    'y8-1c-three': `
      <p class="hp-tag">Worked example: find the LCM of <b>4, 5 and 10</b>.</p>
      ${steps(
        `<p><strong>List some multiples of each number</strong> until one number is in all three lists.</p>
         ${sum('Multiples of 4: 4, 8, 12, 16, 20, ...<br>Multiples of 5: 5, 10, 15, 20, ...<br>Multiples of 10: 10, 20, ...')}`,
        `<p><strong>Choose the smallest number that is in all three lists.</strong></p>
         ${ans('20')}`
      )}
      <p><strong>HCF of three numbers.</strong> List the factors of each number and choose the largest one that is in all three lists.</p>
      ${sum('Factors of 16: 1, 2, 4, 8, 16<br>Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24<br>Factors of 40: 1, 2, 4, 5, 8, 10, 20, 40<br>HCF = 8')}
      ${tip('Read carefully: LCM is a multiple (bigger than or equal to the numbers), HCF is a factor (smaller than or equal to them).')}`,

    // y8-1C Q8: equal groups
    'y8-1c-groups': `
      <p class="hp-tag">Worked example: <b>30</b> students split into equal groups, at least 2 groups and at least 2 in each. One way is 2 groups of 15. How many other ways are there?</p>
      ${steps(
        `<p><strong>The number of groups must be a factor of 30.</strong> List them.</p>
         ${sum('1, 2, 3, 5, 6, 10, 15, 30')}`,
        `<p><strong>Cross out the ones that break the rules.</strong> 1 group is not allowed, and 30 groups would have 1 student each.</p>
         ${chips(['2 groups of 15'], ['3 of 10'], ['5 of 6'], ['6 of 5'], ['10 of 3'], ['15 of 2'])}`,
        `<p><strong>That is 6 ways.</strong> Leave out the one given in the question.</p>
         ${ans('5')}`
      )}
      ${tip('3 groups of 10 and 10 groups of 3 are different ways, so count both.')}`,

    // y8-1C Q9, Q10: LCM word problems
    'y8-1c-lcm-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Bus A leaves the station every <span class="hp-hl">10</span> minutes and bus B every <span class="hp-hl">15</span> minutes. They leave <span class="hp-kw">together</span> at 9 am. How many minutes until they next leave <span class="hp-kw">together</span>?</p>
      ${steps(
        `<p><strong>Things that repeat and line up again: find the LCM.</strong></p>
         ${sum('Bus B: 15, 30, 45, ...<br>Bus A: 10, 20, 30, ...')}`,
        `<p><strong>The first time in both lists is the answer.</strong></p>
         ${ans('30')}`
      )}
      ${tip('Three things work the same way. For lights every 3, 5 and 10 seconds, list the multiples of each: 3, 6, 9, ..., 30 and 5, 10, 15, ..., 30 and 10, 20, 30. The first number in all three lists is 30.')}`,

    // y8-1C Q11: counting primes
    'y8-1c-primes': `
      <p class="hp-tag">Worked example: how many prime numbers are there between <b>60</b> and <b>100</b>?</p>
      ${steps(
        `<p><strong>A prime has exactly two factors</strong>, 1 and itself. 1 is not prime.</p>`,
        `<p><strong>Cross out multiples.</strong> Cross out the even numbers, the numbers ending in 5, then the multiples of 3 and of 7 (like 63, 77 and 91). Since 10 × 10 = 100, no other primes need testing.</p>
         ${chips(['61'], ['67'], ['71'], ['73'], ['79'], ['83'], ['89'], ['97'])}`,
        `<p><strong>Count what is left.</strong></p>
         ${ans('8')}`
      )}
      ${tip('Watch for numbers that look prime but are not, like 87 = 3 × 29 and 91 = 7 × 13.')}`,

    // y8-1C Q12: counting squares in a grid
    'y8-1c-grid': `
      <p class="hp-tag">Worked example: how many squares of any size are in a <b>3 by 3</b> grid?</p>
      ${grid3([['', '', ''], ['', '', ''], ['', '', '']], 'A 3 by 3 grid of small squares')}
      ${steps(
        `<p><strong>Count each size on its own.</strong> A 1 by 1 square fits 3 across and 3 down. A 2 by 2 square fits 2 across and 2 down. A 3 by 3 fits once.</p>
         ${sum('1 by 1: 3 × 3 = 9<br>2 by 2: 2 × 2 = 4<br>3 by 3: 1 × 1 = 1')}`,
        `<p><strong>Add them up.</strong></p>
         ${sum('9 + 4 + 1 = 14')}
         ${ans('14')}`
      )}
      ${tip('The bigger squares overlap each other. Slide one square along a row to count how many positions it has.')}`,

    // y8-1C Q15: always true?
    'y8-1c-always': `
      <p class="hp-tag">Worked example: <b>p</b> and <b>q</b> are different whole numbers. Is "the HCF of p and q is smaller than both p and q" always true?</p>
      ${steps(
        `<p><strong>Try some numbers.</strong> p = 6 and q = 10 have HCF 2, which is smaller than both. So far so good.</p>`,
        `<p><strong>Hunt for a case that breaks it.</strong> Try one number inside the other: p = 5, q = 15. The HCF is 5, which is not smaller than 5.</p>
         ${ans('Not always true')}`
      )}
      ${tip('One example that breaks a rule is enough to say "not always true". To say "always true", you need a reason that works for every number.')}`,

    // y8-1C Q16: Goldbach's conjecture
    'y8-1c-goldbach': `
      <p class="hp-tag">Worked example: in how many ways can <b>26</b> be written as the sum of two primes?</p>
      ${steps(
        `<p><strong>Go through the primes up to half of 26</strong> (13), and check what is left.</p>
         ${sum('26 − 3 = 23 ✓ prime<br>26 − 5 = 21 ✗<br>26 − 7 = 19 ✓ prime<br>26 − 11 = 15 ✗<br>26 − 13 = 13 ✓ prime')}`,
        `<p><strong>Count the pairs.</strong> 3 + 23, 7 + 19 and 13 + 13.</p>
         ${ans('3')}`
      )}
      ${tip('For an odd number, one of the two primes must be 2 (odd + odd is even). So just check whether the number minus 2 is prime: 19 = 2 + 17 works, but 17 − 2 = 15 is not prime, so 17 cannot be done.')}`,

    // y8-1C Q17: twin primes
    'y8-1c-twins': `
      <p class="hp-tag">Worked example: how many pairs of twin primes are there between <b>200</b> and <b>250</b>?</p>
      ${steps(
        `<p><strong>List the primes in the range.</strong> Test each odd number with 3, 7, 11 and 13 (anything ending in 5 is out).</p>
         ${chips(['211'], ['223'], ['227'], ['229'], ['233'], ['239'], ['241'])}`,
        `<p><strong>Find the pairs that are 2 apart.</strong></p>
         ${chips(['227 and 229', 'add'], ['239 and 241', 'add'])}
         ${ans('2')}`
      )}
      ${tip('You only need to test primes whose square is not bigger than the number. Up to 250, that is 2, 3, 5, 7, 11 and 13, since the next prime, 17, has 17 × 17 = 289.')}`,

    // =====================================================================
    // Year 8 1D Divisibility and prime factorisation
    // =====================================================================
    // y8-1D Q1, Q2, Q11: factor trees and prime factor form
    'y8-1d-tree': `
      <p class="hp-tag">Worked example: write <b>360</b> in prime factor form.</p>
      ${steps(
        `<p><strong>Split it into any two factors, and keep splitting</strong> until every branch ends in a prime (circled).</p>
         ${tree(['360', ['10', '2', '5'], ['36', ['6', '2', '3'], ['6', '2', '3']]], 'Factor tree: 360 splits into 10 and 36; 10 into 2 and 5; 36 into 6 and 6; each 6 into 2 and 3')}`,
        `<p><strong>Collect the primes, smallest first.</strong></p>
         ${sum('360 = 2 × 2 × 2 × 3 × 3 × 5')}`,
        `<p><strong>Use powers for repeated primes.</strong> Type a power with ^ and times with x.</p>
         ${sum('360 = 2³ × 3² × 5')}
         ${ans('2^3 x 3^2 x 5')}`
      )}
      ${tip('Any first split works, and you always end with the same primes. Powers can go above 3: four 2s is 2^4.')}`,

    // y8-1D Q3: how many different primes
    'y8-1d-count': `
      <p class="hp-tag">Worked example: how many different primes make up <b>140</b>?</p>
      ${steps(
        `<p><strong>Find the prime factor form.</strong></p>
         ${tree(['140', ['10', '2', '5'], ['14', '2', '7']], 'Factor tree: 140 splits into 10 and 14; 10 into 2 and 5; 14 into 2 and 7')}
         ${sum('140 = 2² × 5 × 7')}`,
        `<p><strong>Count each different prime once.</strong> 2, 5 and 7.</p>
         ${ans('3')}`
      )}
      ${tip('2² counts as one prime, not two. Count the bases, not the powers.')}`,

    // y8-1D Q4: divisibility tests
    'y8-1d-tests': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Divisible by</span><span role="columnheader">Test</span></div>
        <div class="hp-tr" role="row"><span role="cell">2</span><span role="cell">Last digit is even</span></div>
        <div class="hp-tr" role="row"><span role="cell">3</span><span role="cell">Digit sum divides by 3</span></div>
        <div class="hp-tr" role="row"><span role="cell">4</span><span role="cell">Last two digits divide by 4</span></div>
        <div class="hp-tr" role="row"><span role="cell">5</span><span role="cell">Ends in 0 or 5</span></div>
        <div class="hp-tr" role="row"><span role="cell">6</span><span role="cell">Passes the tests for 2 and 3</span></div>
        <div class="hp-tr" role="row"><span role="cell">8</span><span role="cell">Last three digits divide by 8</span></div>
        <div class="hp-tr" role="row"><span role="cell">9</span><span role="cell">Digit sum divides by 9</span></div>
      </div>
      <p class="hp-tag">Worked example: <b>312</b></p>
      ${steps(
        `<p><strong>Do the quick ones.</strong> It ends in 2, so it divides by 2 but not 5. The digit sum is 3 + 1 + 2 = 6, so it divides by 3 but not 9. It passes 2 and 3, so it divides by 6.</p>`,
        `<p><strong>Then 4 and 8.</strong> 12 ÷ 4 = 3 ✓. 312 ÷ 8 = 39 ✓.</p>
         ${ans('2, 3, 4, 6, 8')}`
      )}
      ${tip('List the numbers with commas. If none of the tests work, type none.')}`,

    // y8-1D Q5: highest common prime factor
    'y8-1d-common-prime': `
      <p class="hp-tag">Worked example: find the highest common prime factor of <b>66</b> and <b>110</b>.</p>
      ${steps(
        `<p><strong>Write each number as a product of primes.</strong></p>
         ${sum('66 = 2 × 3 × 11<br>110 = 2 × 5 × 11')}`,
        `<p><strong>Find the primes in both lists</strong>, and pick the biggest.</p>
         ${chips(['2', 'add'], ['11', 'add'])}
         ${ans('11')}`
      )}
      ${tip('This is a prime, so it is not always the same as the HCF. Here the HCF is 2 × 11 = 22, but the highest common prime is 11.')}`,

    // y8-1D Q6: LCM and HCF from prime factors
    'y8-1d-lcm-hcf': `
      <p class="hp-tag">Worked example: find the LCM and HCF of <b>40</b> and <b>50</b>.</p>
      ${steps(
        `<p><strong>Write both in prime factor form.</strong></p>
         ${sum('40 = 2³ × 5<br>50 = 2 × 5²')}`,
        `<p><strong>HCF: the primes in both, using the smaller power.</strong></p>
         ${sum('HCF = 2 × 5 = 10')}`,
        `<p><strong>LCM: every prime that appears, using the bigger power.</strong> Type the LCM first, then the HCF.</p>
         ${sum('LCM = 2³ × 5² = 200')}
         ${ans('200, 10')}`
      )}
      ${tip('Check: LCM × HCF = the two numbers multiplied. 200 × 10 = 2000 and 40 × 50 = 2000 ✓.')}`,

    // y8-1D Q7, Q8: LCM or HCF word problems
    'y8-1d-word': `
      <p>First decide which one the story needs.</p>
      ${chips(['Repeats until they line up again → LCM', 'add'], ['Largest equal group, no one left over → HCF', 'take'])}
      <p class="hp-tag">Worked example: two clubs of <b>80</b> and <b>112</b> players are split into teams of the same size, with no one left over. What is the largest team size?</p>
      ${steps(
        `<p><strong>The team size must go into both numbers</strong>, and be as big as possible. That is the HCF.</p>
         ${sum('80 = 2⁴ × 5<br>112 = 2⁴ × 7')}`,
        `<p><strong>Take the primes in both, with the smaller power.</strong></p>
         ${sum('HCF = 2⁴ = 16')}
         ${ans('16')}`
      )}
      ${tip('For visits every 16 days and every 20 days, find the LCM: 16 = 2⁴ and 20 = 2² × 5, so 2⁴ × 5 = 80 days.')}`,

    // y8-1D Q9: true or false divisibility statements
    'y8-1d-truefalse': `
      <p class="hp-tag">Worked example: are these true or false? <b>All numbers divisible by 8 are divisible by 4.</b> <b>All numbers divisible by 4 are divisible by 8.</b></p>
      ${steps(
        `<p><strong>The first one:</strong> 8 = 4 × 2, so any multiple of 8 is also a multiple of 4.</p>
         ${ans('True')}`,
        `<p><strong>The second one:</strong> look for a number that breaks it. 12 divides by 4, but 12 ÷ 8 is not a whole number.</p>
         ${ans('False')}`
      )}
      ${tip('If the first number is a multiple of the second, the statement is true. Turning it round usually makes it false.')}`,

    // y8-1D Q10: divisible by two primes
    'y8-1d-two-primes': `
      <p class="hp-tag">Worked example: a number is divisible by <b>39</b> if it is divisible by which two primes?</p>
      ${steps(
        `<p><strong>Write the number as a product of primes.</strong></p>
         ${sum('39 = 3 × 13')}`,
        `<p><strong>Those are the two primes.</strong> Type them with a comma, smallest first.</p>
         ${ans('3, 13')}`
      )}
      ${tip('This works when the two primes are different, like 6 = 2 × 3 in the question. It would not work for 4 = 2 × 2: 6 divides by 2, but not by 4.')}`,

    // y8-1D Q12: dividing by 11 and the test for 11
    'y8-1d-eleven': `
      <p class="hp-tag">Worked example: <b>748 ÷ 11</b></p>
      ${steps(
        `<p><strong>Use short division.</strong> 7 ÷ 11 = 0 r 7. 74 ÷ 11 = 6 r 8, because 6 × 11 = 66. 88 ÷ 11 = 8.</p>
         ${bus('11', ['7', '4', '8'], ['0', '6', '8'], ['', '7', '8'])}
         ${ans('68')}`,
        `<p><strong>The alternate digit sums.</strong> For 4092, add the 1st and 3rd digits, then the 2nd and 4th digits, then subtract.</p>
         ${sum('4 + 9 = 13<br>0 + 2 = 2<br>13 − 2 = 11')}`
      )}
      ${tip('4092 ÷ 11 = 372, and its difference is 11. Try a few: whenever a number divides by 11, the difference comes out as 0 or a multiple of 11.')}`,

    // =====================================================================
    // Year 8 1E Negative integers
    // =====================================================================
    // y8-1E Q1, Q2: a negative number add a positive number
    'y8-1e-add': `
      <p class="hp-tag">Worked example: <b>−14 + 9</b></p>
      ${fig({ kind: 'numberline', min: -15, max: 1, divisions: 1, points: { Start: -14, End: -5 } })}
      ${steps(
        `<p><strong>Start at −14. Adding a positive number moves right.</strong> Jump 9 to the right.</p>`,
        `<p><strong>You do not reach 0</strong>, so the answer is still negative. It is 14 − 9 = 5 to the left of 0.</p>
         ${ans('-5')}`,
        `<p><strong>If the jump passes 0, split it.</strong> For −7 + 15, it takes 7 to reach 0, then 8 more.</p>
         ${sum('−7 + 15 = 8')}`
      )}
      ${tip('If the jump stops before 0, the answer is negative. If it passes 0, the answer is positive. Type a negative answer with the minus key: -5.')}`,

    // y8-1E Q3: subtracting a positive number
    'y8-1e-subtract': `
      <p class="hp-tag">Worked example: <b>7 − 12</b></p>
      ${fig({ kind: 'numberline', min: -6, max: 8, divisions: 1, points: { Start: 7, End: -5 } })}
      ${steps(
        `<p><strong>Start at 7. Subtracting moves left.</strong> 7 steps take you to 0, and 5 more are left.</p>
         ${sum('7 − 7 = 0<br>0 − 5 = −5')}
         ${ans('-5')}`,
        `<p><strong>Already below zero?</strong> Keep moving left, so add the sizes and keep the minus.</p>
         ${sum('−8 − 9 = −17')}`
      )}
      ${tip('Big numbers work the same way. For 145 − 230, the first 145 steps left take you to 0, and 230 − 145 = 85 steps are still to go, so you finish at −85. Type it as -85.')}`,

    // y8-1E Q4: matching a number line
    'y8-1e-numberline': `
      <p class="hp-tag">Worked example: the jumps start at <b>−2</b>. There are <b>3</b> jumps of 1 to the <b>left</b>. Which calculation matches?</p>
      ${fig({ kind: 'numberline', min: -6, max: 1, divisions: 1, points: { Start: -2, End: -5 } })}
      ${steps(
        `<p><strong>The dot is where you start.</strong> That is the first number.</p>`,
        `<p><strong>Count the jumps and their direction.</strong> Right means add, left means subtract. 3 jumps left is − 3.</p>`,
        `<p><strong>The end of the last jump is the answer.</strong></p>
         ${ans('−2 − 3 = −5')}`
      )}
      ${tip('Check the answer too: start at the dot, do the calculation, and see if you land where the last arrow points.')}`,

    // y8-1E Q5: missing numbers
    'y8-1e-missing': `
      <p class="hp-tag">Worked example: <b>−6 + □ = 2</b></p>
      ${steps(
        `<p><strong>Ask how far, and which way, it is from −6 to 2.</strong></p>
         ${sum('−6 to 0: 6 right<br>0 to 2: 2 right')}`,
        `<p><strong>8 steps right means add 8.</strong></p>
         ${ans('8')}`,
        `<p><strong>Box at the front?</strong> For □ − 7 = −10, undo the take-away by adding 7.</p>
         ${sum('−10 + 7 = −3<br>Check: −3 − 7 = −10 ✓')}`
      )}
      ${tip('Always check by putting your answer in the box.')}`,

    // y8-1E Q6: several steps, left to right
    'y8-1e-left-right': `
      <p class="hp-tag">Worked example: <b>−4 + 11 − 15 + 6</b></p>
      ${steps(
        `<p><strong>Work from left to right</strong>, one step at a time.</p>
         ${flow(['Start', '−4'], ['+ 11', '7'], ['− 15', '−8'], ['+ 6', '−2'])}`,
        `<p><strong>The last number is the answer.</strong></p>
         ${ans('-2')}`
      )}
      ${tip('Never start from the right-hand end. Each sign belongs to the number just after it.')}`,

    // y8-1E Q7, Q9, Q10: word problems
    'y8-1e-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A lift starts at level <span class="hp-hl">2</span>. It goes <span class="hp-kw">down</span> <span class="hp-hl">5</span> levels, <span class="hp-kw">up</span> <span class="hp-hl">9</span>, then <span class="hp-kw">down</span> <span class="hp-hl">8</span>. Ground is 0. Where does it finish?</p>
      ${steps(
        `<p><strong>Up means add, down means subtract.</strong></p>
         ${chips(['up, rises, pays back → add', 'add'], ['down, falls, borrows → subtract', 'take'])}`,
        `<p><strong>Keep a running total.</strong></p>
         ${flow(['Start', '2'], ['− 5', '−3'], ['+ 9', '6'], ['− 8', '−2'])}
         ${ans('-2')}`
      )}
      <p><strong>Working backwards.</strong> If a temperature rose 10 °C to reach −4 °C, undo the rise: −4 − 10 = −14 °C.</p>
      ${tip('For money owed, add each new loan and take away each repayment: borrow $30, repay $20, borrow $15 means you owe 30 − 20 + 15 = $25.')}`,

    // y8-1E Q8: choosing + and − signs
    'y8-1e-signs': `
      <p class="hp-tag">Worked example: choose the signs. <b>4 □ 7 □ 5 = −8</b></p>
      ${steps(
        `<p><strong>Try each choice, left to right.</strong></p>
         ${sum('4 + 7 + 5 = 16<br>4 + 7 − 5 = 6<br>4 − 7 + 5 = 2<br>4 − 7 − 5 = −8 ✓')}`,
        `<p><strong>Pick the one that works.</strong></p>
         ${ans('4 − 7 − 5 = −8')}`
      )}
      ${tip('A small or negative answer usually needs some − signs.')}`,

    // y8-1E Q12, Q13: always true?
    'y8-1e-always': `
      <p class="hp-tag">Worked example: <b>a</b> is a positive integer. Is each statement always true? <b>−a − 3 is negative.</b> <b>a − 3 is negative.</b></p>
      ${steps(
        `<p><strong>−a − 3:</strong> −a is below zero, and taking away 3 moves further left. It can never reach 0.</p>
         ${ans('Always true')}`,
        `<p><strong>a − 3:</strong> try a big value. If a = 5, then 5 − 3 = 2, which is positive.</p>
         ${ans('Not always true')}`
      )}
      ${tip('Try small and big numbers. Also remember 0: it is neither positive nor negative, and it is the only number equal to its own opposite.')}`,

    // y8-1E Q14: a long alternating sum
    'y8-1e-pattern': `
      <p class="hp-tag">Worked example: <b>2 − 3 + 4 − 5 + ... + 18 − 19</b></p>
      ${steps(
        `<p><strong>Group the numbers in pairs.</strong></p>
         ${sum('(2 − 3) + (4 − 5) + ... + (18 − 19)')}`,
        `<p><strong>Each pair makes −1.</strong> The numbers 2 to 19 are 18 numbers, so there are 9 pairs.</p>
         ${sum('9 × (−1) = −9')}
         ${ans('-9')}`
      )}
      ${tip('Count the pairs carefully: the number of pairs is half the number of terms.')}`,

    // y8-1E Q15: a pair of integers from two equations
    'y8-1e-pair': `
      <p class="hp-tag">Worked example: find <b>(a, b)</b> if <b>a + b = 5</b> and <b>a − b = −9</b>.</p>
      ${steps(
        `<p><strong>Guess a pair that fits the first equation</strong>, a + b = 5, and test it in the second. Keep a table of your tries.</p>
         <div class="hp-table" role="table">
           <div class="hp-tr hp-th" role="row"><span role="columnheader">a</span><span role="columnheader">b</span><span role="columnheader">a + b</span><span role="columnheader">a − b</span></div>
           <div class="hp-tr" role="row"><span role="cell">0</span><span role="cell">5</span><span role="cell">5</span><span role="cell">−5 ✗</span></div>
           <div class="hp-tr" role="row"><span role="cell">−1</span><span role="cell">6</span><span role="cell">5</span><span role="cell">−7 ✗</span></div>
           <div class="hp-tr" role="row"><span role="cell">−2</span><span role="cell">7</span><span role="cell">5</span><span role="cell">−9 ✓</span></div>
         </div>`,
        `<p><strong>Use each try to improve the next.</strong> a − b came out −5, but it needs to be −9, which is smaller. Making a smaller and b bigger (still adding to 5) brings it down by 2 each time.</p>`,
        `<p><strong>Both equations work for a = −2 and b = 7.</strong> Type it as a point.</p>
         ${ans('(-2, 7)')}`
      )}
      ${tip('With 2b in an equation, do the same: guess a pair that fits one equation, then test it in the other. Check your final pair in both equations.')}`,

    // =====================================================================
    // Year 8 1F Adding and subtracting negative integers
    // =====================================================================
    // y8-1F Q1, Q2: adding a negative number
    'y8-1f-add-neg': `
      <p class="hp-tag">Worked example: <b>8 + (−13)</b></p>
      ${steps(
        `<p><strong>Adding a negative is the same as subtracting.</strong></p>
         ${sum('8 + (−13) = 8 − 13')}`,
        `<p><strong>Work it out on the number line.</strong> 8 steps left to 0, then 5 more.</p>
         ${sum('8 − 13 = −5')}
         ${ans('-5')}`,
        `<p><strong>Two negatives?</strong> You are going further left, so add the sizes and keep the minus.</p>
         ${sum('−7 + (−11) = −7 − 11 = −18')}`
      )}
      ${tip('Think of money: adding a debt of $13 makes you poorer, just like spending $13.')}`,

    // y8-1F Q3, Q4: subtracting a negative number
    'y8-1f-sub-neg': `
      <p class="hp-tag">Worked example: <b>4 − (−9)</b></p>
      ${steps(
        `<p><strong>Subtracting a negative is the same as adding.</strong> The two minus signs make a plus.</p>
         ${sum('4 − (−9) = 4 + 9')}`,
        `<p><strong>Work it out.</strong></p>
         ${sum('4 + 9 = 13')}
         ${ans('13')}`,
        `<p><strong>Starting below zero works the same way.</strong></p>
         ${sum('−15 − (−6) = −15 + 6 = −9')}`
      )}
      ${tip('Taking away a debt makes you richer. Change "− (−" into "+" first, then work it out.')}`,

    // y8-1F Q5: missing numbers
    'y8-1f-missing': `
      <p class="hp-tag">Worked example: <b>□ + (−5) = −12</b></p>
      ${steps(
        `<p><strong>Rewrite it.</strong> Adding −5 is taking away 5, so □ − 5 = −12.</p>`,
        `<p><strong>Undo it by adding 5.</strong></p>
         ${sum('−12 + 5 = −7')}
         ${ans('-7')}`,
        `<p><strong>Missing number after a minus?</strong> For 2 − □ = 10, the answer went up, so you must have taken away a negative. It went up by 8, so □ = −8.</p>
         ${sum('Check: 2 − (−8) = 2 + 8 = 10 ✓')}`
      )}
      ${tip('Always check by putting your answer back in the box.')}`,

    // y8-1F Q6: magic triangle with negative integers
    'y8-1f-magic-tri': `
      <p class="hp-tag">Worked example: place the integers <b>−2 to 3</b> in the circles so that each side adds to <b>1</b>. Which three go in the corners?</p>
      ${tri(['−2', '0', '2'], ['3', '−1', '1'], 'A magic triangle with −2, 0 and 2 in the corners and 3, −1 and 1 in the middles of the sides')}
      ${steps(
        `<p><strong>Add all six numbers.</strong></p>
         ${sum('−2 + (−1) + 0 + 1 + 2 + 3 = 3')}`,
        `<p><strong>The three sides together count each corner twice.</strong></p>
         ${sum('3 sides × 1 = 3, and 3 − 3 = 0, so the corners add to 0')}`,
        `<p><strong>Try sets that add to 0.</strong> −2, 0 and 2 works: −2 + 3 + 0, 0 + (−1) + 2 and 2 + 1 + (−2) all make 1.</p>
         ${ans('-2, 0, 2')}`
      )}
      ${tip('Small side totals need the most negative numbers in the corners. Large totals need the biggest ones there.')}`,

    // y8-1F Q7: magic squares with negative integers
    'y8-1f-magic-sq': `
      <p class="hp-tag">Worked example: complete the magic square. Find B, C and D.</p>
      ${grid3([['−6', '−1', '−2'], ['B', '−3', 'C'], ['−4', 'D', '0']], 'A 3 by 3 magic square with B, C and D missing')}
      ${steps(
        `<p><strong>Find a full line to get the magic sum.</strong> The top row is complete.</p>
         ${sum('−6 + (−1) + (−2) = −9')}`,
        `<p><strong>Find a line with only one gap.</strong> The middle column: −1 + (−3) + D = −9, so D = −5.</p>`,
        `<p><strong>Keep going.</strong> Left column: −6 + B + (−4) = −9, so B = 1. Right column: −2 + C + 0 = −9, so C = −7.</p>
         ${ans('1, -7, -5')}`
      )}
      ${tip('Check a diagonal at the end: −6 + (−3) + 0 = −9 ✓. Type the values in the order asked, with commas.')}`,

    // y8-1F Q8: bank balance with debts
    'y8-1f-bank': `
      <p class="hp-tag">Worked example: a balance starts at <b>$135</b>. Then <b>$170</b> is spent, <b>$80</b> of debt is added, and <b>$45</b> of debt is repaid.</p>
      ${steps(
        `<p><strong>Turn each event into a number.</strong></p>
         ${chips(['spent → − 170', 'take'], ['debt added → + (−80)', 'take'], ['debt repaid → − (−45)', 'add'])}`,
        `<p><strong>Keep a running total.</strong></p>
         ${flow(['Start', '135'], ['− 170', '−35'], ['+ (−80)', '−115'], ['− (−45)', '−70'])}`,
        `<p><strong>The balance is below zero</strong>, so the account owes money.</p>
         ${ans('-70')}`
      )}
      ${tip('Removing a debt is subtracting a negative, so the balance goes up.')}`,

    // y8-1F Q9, Q10: two integers from their sum and difference
    'y8-1f-pairs': `
      <p class="hp-tag">Worked example: find negative integers <b>a</b> and <b>b</b> with <b>a + b = −14</b> and <b>a − b = 4</b>.</p>
      ${steps(
        `<p><strong>Add the sum and the difference.</strong> That makes two lots of a.</p>
         ${sum('−14 + 4 = −10, so 2a = −10 and a = −5')}`,
        `<p><strong>Use the sum to find b.</strong></p>
         ${sum('−5 + b = −14, so b = −9')}`,
        `<p><strong>Check:</strong> −5 − (−9) = 4 ✓. Type it as a point.</p>
         ${ans('(-5, -9)')}`
      )}
      ${tip('Same trick for "the sum is 4 and the difference is 10": (4 + 10) ÷ 2 = 7, and 4 − 7 = −3. So the integers are 7 and −3.')}`,

    // y8-1F Q11: spot the mistake
    'y8-1f-mistake': `
      <p class="hp-tag">Worked example: find the mistake. <b>8 − (−5) = 8 − 5 = 3</b></p>
      ${steps(
        `<p><strong>Check each step.</strong> Subtracting a negative should become adding, but here the minus stayed.</p>`,
        `<p><strong>Do it correctly.</strong></p>
         ${sum('8 − (−5) = 8 + 5 = 13')}
         ${ans('13')}`
      )}
      ${tip('Common slips: losing a minus sign, or turning + (−) into + instead of −.')}`,

    // y8-1F Q12: subtraction facts from an addition fact
    'y8-1f-facts': `
      <p class="hp-tag">Worked example: from <b>9 + (−5) = 4</b>, find <b>4 − 9</b> and <b>4 − (−5)</b>.</p>
      ${steps(
        `<p><strong>The total is 4.</strong> Taking one part away from the total leaves the other part.</p>
         ${flow(['Add', '9 + (−5) = 4'], ['Take away', '4 − 9 = −5'], ['Take away', '4 − (−5) = 9'])}`,
        `<p><strong>Check the second one</strong>: 4 − (−5) = 4 + 5 = 9 ✓.</p>
         ${ans('-5, 9')}`
      )}
      ${tip('It works with negatives exactly as it does with positives.')}`,

    // y8-1F Q13, Q14: letters standing for negative numbers
    'y8-1f-letters': `
      <p class="hp-tag">Worked example: <b>a</b> is a negative integer. Is <b>a − 5</b> always less than 0? Is <b>a − (−5)</b>?</p>
      ${steps(
        `<p><strong>a − 5:</strong> a is already below 0, and taking away 5 moves further left.</p>
         ${ans('Yes')}`,
        `<p><strong>a − (−5) is a + 5</strong>, which moves right. Try a = −3: −3 + 5 = 2, which is not below 0.</p>
         ${ans('No')}`
      )}
      ${tip('Try a few negative values, like −1 and −10. If the question says a < b, pick numbers that obey that, such as a = −7 and b = −2.')}`,

    // y8-1F Q15, Q16: rules linking x and y
    'y8-1f-rule': `
      <p class="hp-tag">Worked example: the rule is <b>y = 3 − x</b>.</p>
      ${fig({ kind: 'table', rows: [['x', '-2', '-1', '0', '1'], ['y', '5', '4', '3', '2']] })}
      ${steps(
        `<p><strong>Put each x into the rule.</strong> Use brackets for negatives.</p>
         ${sum('x = −2: y = 3 − (−2) = 5<br>x = 1: y = 3 − 1 = 2')}`,
        `<p><strong>Going backwards:</strong> find x when y = 20.</p>
         ${sum('20 = 3 − x, so x = 3 − 20 = −17')}
         ${ans('-17')}`
      )}
      ${tip('If the rule looks like x − y = 2, rearrange it first: y = x − 2. Then fill in the table.')}`,

    // =====================================================================
    // Year 8 1G Multiplying and dividing negative integers
    // =====================================================================
    // y8-1G Q1, Q2: multiplying
    'y8-1g-multiply': `
      ${chips(['same signs → positive', 'add'], ['different signs → negative', 'take'])}
      <p class="hp-tag">Worked example: <b>−11 × 6</b> and <b>−8 × (−4)</b></p>
      ${steps(
        `<p><strong>Multiply the numbers as if they were positive.</strong></p>
         ${sum('11 × 6 = 66<br>8 × 4 = 32')}`,
        `<p><strong>Then decide the sign.</strong> −11 × 6 has different signs, so it is negative. −8 × (−4) has the same signs, so it is positive.</p>
         ${ans('-66 and 32')}`
      )}
      ${tip('Work out the size and the sign separately. Type a negative answer with the minus key.')}`,

    // y8-1G Q3: dividing
    'y8-1g-divide': `
      ${chips(['same signs → positive', 'add'], ['different signs → negative', 'take'])}
      <p class="hp-tag">Worked example: <b>−72 ÷ 9</b> and <b>−81 ÷ (−9)</b></p>
      ${steps(
        `<p><strong>Divide the sizes.</strong></p>
         ${sum('72 ÷ 9 = 8<br>81 ÷ 9 = 9')}`,
        `<p><strong>Use the same sign rules as for ×.</strong> −72 ÷ 9 has different signs, so it is negative. −81 ÷ (−9) has the same signs, so it is positive.</p>
         ${ans('-8 and 9')}`
      )}
      ${tip('Check with a multiplication: −8 × 9 = −72 ✓.')}`,

    // y8-1G Q4: missing numbers
    'y8-1g-missing': `
      <p class="hp-tag">Worked example: <b>□ × (−11) = 44</b></p>
      ${steps(
        `<p><strong>Find the size first.</strong> 44 ÷ 11 = 4.</p>`,
        `<p><strong>Then the sign.</strong> The answer is positive, so both numbers have the same sign. −11 is negative, so □ is negative.</p>
         ${ans('-4')}`,
        `<p><strong>Division works the same way.</strong> For □ ÷ (−4) = 8, undo it: 8 × (−4) = −32.</p>
         ${sum('Check: −32 ÷ (−4) = 8 ✓')}`
      )}
      ${tip('Always check by putting your answer back in the box.')}`,

    // y8-1G Q5: chains of × and ÷
    'y8-1g-chain': `
      <p class="hp-tag">Worked example: <b>−5 × 6 ÷ (−10)</b></p>
      ${steps(
        `<p><strong>Work from left to right.</strong></p>
         ${sum(`${now('−5 × 6')} ÷ (−10)`)}
         ${sum('−30 ÷ (−10)')}`,
        `<p><strong>Keep going.</strong> Same signs give a positive.</p>
         ${sum('−30 ÷ (−10) = 3')}
         ${ans('3')}`
      )}
      ${tip('Quick check on the sign: count the negatives. An even number of negatives gives a positive answer, an odd number gives a negative one.')}`,

    // y8-1G Q6: choosing × and ÷ signs
    'y8-1g-signs': `
      <p class="hp-tag">Worked example: choose the signs. <b>8 □ (−4) □ 2 = −1</b></p>
      ${steps(
        `<p><strong>Try each choice, left to right.</strong></p>
         ${sum('8 × (−4) × 2 = −64<br>8 × (−4) ÷ 2 = −16<br>8 ÷ (−4) × 2 = −4<br>8 ÷ (−4) ÷ 2 = −1 ✓')}`,
        `<p><strong>Pick the one that works.</strong></p>
         ${ans('8 ÷ (−4) ÷ 2 = −1')}`
      )}
      ${tip('A small answer usually needs ÷ signs. A big answer needs × signs.')}`,

    // y8-1G Q7, Q8: averages with negative numbers
    'y8-1g-average': `
      <p class="hp-tag">Worked example: find the average of <b>−8, −3 and 2</b>.</p>
      ${steps(
        `<p><strong>Add the numbers.</strong></p>
         ${sum('−8 + (−3) + 2 = −9')}`,
        `<p><strong>Divide by how many numbers there are.</strong></p>
         ${sum('−9 ÷ 3 = −3')}
         ${ans('-3')}`
      )}
      <p><strong>Working backwards.</strong> If two numbers average −4, their total is 2 × (−4) = −8. If three numbers average −2, their total is 3 × (−2) = −6. So the third number is −6 − (−8) = 2.</p>
      ${tip('Average × how many = total. Use that whenever a number is missing.')}`,

    // y8-1G Q9, Q10: two numbers from their product and sum
    'y8-1g-product-sum': `
      <p class="hp-tag">Worked example: the product of two numbers is <b>−24</b> and their sum is <b>−2</b>. What are they?</p>
      ${steps(
        `<p><strong>A negative product means one number is negative and one is positive.</strong> List factor pairs of 24.</p>
         ${chips(['1, 24'], ['2, 12'], ['3, 8'], ['4, 6'])}`,
        `<p><strong>Make one negative so they add to −2.</strong> The bigger one must be negative, since the sum is negative.</p>
         ${sum('−6 + 4 = −2 ✓<br>−6 × 4 = −24 ✓')}
         ${ans('-6, 4')}`
      )}
      ${tip('For a quotient and a difference, try pairs. If the quotient is −2 and the difference is 9, the first number is −2 times the second: 6 and −3 work, since 6 ÷ (−3) = −2 and 6 − (−3) = 9.')}`,

    // y8-1G Q12: squares and cubes of negative numbers
    'y8-1g-powers': `
      <p class="hp-tag">Worked example: <b>(−7)²</b> and <b>(−4)³</b></p>
      ${steps(
        `<p><strong>Write out the multiplication.</strong></p>
         ${sum('(−7)² = −7 × (−7) = 49')}`,
        `<p><strong>A cube has one more negative.</strong></p>
         ${sum('(−4)³ = −4 × (−4) × (−4) = 16 × (−4) = −64')}
         ${ans('49 and -64')}`
      )}
      ${tip('Two negatives make a positive, so a square is never negative. Three negatives leave one over, so the cube of a negative is negative.')}`,

    // y8-1G Q13: powers of −1
    'y8-1g-minus-one': `
      <p class="hp-tag">Worked example: <b>(−1)⁶</b> and <b>(−1)⁹</b></p>
      ${steps(
        `<p><strong>Pair up the −1s.</strong> Each pair gives (−1) × (−1) = 1.</p>
         ${sum('(−1)⁶ = three pairs = 1 × 1 × 1<br>(−1)⁹ = four pairs and one −1 left over')}`,
        `<p><strong>Even powers give 1, odd powers give −1.</strong> 6 is even, 9 is odd.</p>
         ${ans('1 and -1')}`
      )}
      ${tip('For a huge power, you only need to know whether it is even or odd.')}`,

    // y8-1G Q14, Q15: roots of negative numbers
    'y8-1g-roots': `
      <p class="hp-tag">Worked example: is <b>√−49</b> a real number? What is <b>∛−1000</b>?</p>
      ${steps(
        `<p><strong>Square root:</strong> 7 × 7 = 49 and (−7) × (−7) = 49. No real number times itself gives a negative.</p>
         ${ans('No')}`,
        `<p><strong>Cube root:</strong> three negatives give a negative, so try a negative number.</p>
         ${sum('−10 × (−10) × (−10) = −1000')}
         ${ans('-10')}`
      )}
      ${tip('You can find the cube root of any number. The cube root of a negative number is negative.')}`,

    // y8-1G Q16: finding a rule from a table
    'y8-1g-rule': `
      <p class="hp-tag">Worked example: find the rule for this table.</p>
      ${fig({ kind: 'table', rows: [['x', '-2', '-1', '0', '1', '2'], ['y', '10', '7', '4', '1', '-2']] })}
      ${steps(
        `<p><strong>See how y changes when x goes up by 1.</strong> Each time, y goes down by 3. So the rule starts with −3x.</p>`,
        `<p><strong>Find y when x = 0.</strong> That is the number on the end.</p>
         ${sum('x = 0 gives y = 4')}`,
        `<p><strong>Put it together and check a value.</strong> x = −2: −3 × (−2) + 4 = 10 ✓.</p>
         ${ans('y = -3x + 4')}`
      )}
      ${tip('If the y values go down and then up again, and match on both sides of x = 0, try x squared: y = x^2 + 2 gives 6, 3, 2, 3, 6.')}`,

    // =====================================================================
    // Year 8 1H Order of operations and substitution
    // =====================================================================
    // y8-1H Q1, Q2: order of operations without brackets
    'y8-1h-order': `
      <ol class="hp-ladder">
        <li><b>Brackets</b> first</li>
        <li><b>Powers and roots</b> next</li>
        <li><b>× and ÷</b> next, left to right</li>
        <li><b>+ and −</b> last, left to right</li>
      </ol>
      <p class="hp-tag">Worked example: <b>−6 + 7 × (−4) − 14 ÷ (−2)</b></p>
      ${steps(
        `<p><strong>Do × and ÷ first.</strong></p>
         ${sum(`−6 + ${now('7 × (−4)')} − ${now('14 ÷ (−2)')}`)}
         ${sum('−6 + (−28) − (−7)')}`,
        `<p><strong>Tidy the signs, then work left to right.</strong></p>
         ${sum('−6 − 28 + 7 = −27')}
         ${ans('-27')}`
      )}
      ${tip('Write each step on a new line. Most mistakes are lost minus signs.')}`,

    // y8-1H Q3, Q14: brackets, including brackets inside brackets
    'y8-1h-brackets': `
      <p class="hp-tag">Worked example: <b>(−9 + 4) × (1 − (−3))</b></p>
      ${steps(
        `<p><strong>Work out each bracket first.</strong></p>
         ${sum(`${now('(−9 + 4)')} × ${now('(1 − (−3))')}`)}
         ${sum('−5 × 4')}`,
        `<p><strong>Then multiply.</strong></p>
         ${sum('−5 × 4 = −20')}
         ${ans('-20')}`
      )}
      <p><strong>Brackets inside brackets?</strong> Start with the innermost pair and work outwards.</p>
      ${sum(`(7 − ${now('(9 − (−1))')}) × (−5) = (7 − 10) × (−5) = −3 × (−5) = 15`)}
      ${tip('Inside a bracket, the normal order still applies: × and ÷ before + and −.')}`,

    // y8-1H Q4, Q9: powers and roots in a calculation
    'y8-1h-powers': `
      <p class="hp-tag">Worked example: <b>20 − 2 × (−6)² ÷ 8</b></p>
      ${steps(
        `<p><strong>Powers before × and ÷.</strong></p>
         ${sum(`20 − 2 × ${now('(−6)²')} ÷ 8 = 20 − 2 × 36 ÷ 8`)}`,
        `<p><strong>Then × and ÷, left to right.</strong></p>
         ${sum('20 − 72 ÷ 8 = 20 − 9')}`,
        `<p><strong>Then − last.</strong></p>
         ${sum('20 − 9 = 11')}
         ${ans('11')}`
      )}
      ${tip('Roots count as powers: √49 + ∛−1000 = 7 + (−10) = −3. Watch the brackets: (−6)² = 36, but −6² means −(6²) = −36.')}`,

    // y8-1H Q5, Q6, Q8: substituting negative values
    'y8-1h-sub': `
      <p class="hp-tag">Worked example: evaluate <b>3x − 2y</b> when <b>x = −6</b> and <b>y = 7</b>.</p>
      ${steps(
        `<p><strong>Replace each letter with its value in brackets.</strong> A number next to a letter means multiply.</p>
         ${sum('3x − 2y = 3 × (−6) − 2 × 7')}`,
        `<p><strong>Use order of operations.</strong></p>
         ${sum('−18 − 14 = −32')}
         ${ans('-32')}`
      )}
      ${tip('Two letters side by side also multiply: xy = −6 × 7 = −42. Keep the brackets around negatives so you do not lose a sign.')}`,

    // y8-1H Q7: substituting into powers
    'y8-1h-sub-powers': `
      <p class="hp-tag">Worked example: evaluate <b>x² + y</b> and <b>x³</b> when <b>x = −6</b> and <b>y = 5</b>.</p>
      ${steps(
        `<p><strong>Put negatives in brackets before squaring.</strong></p>
         ${sum('x² + y = (−6)² + 5 = 36 + 5 = 41')}`,
        `<p><strong>A cube of a negative stays negative.</strong></p>
         ${sum('x³ = (−6)³ = 36 × (−6) = −216')}
         ${ans('41 and -216')}`
      )}
      ${tip('Do the powers first, then the + and −. The power belongs only to the letter it sits on.')}`,

    // y8-1H Q10: a temperature story
    'y8-1h-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A cool room is at <span class="hp-hl">6 °C</span>. It <span class="hp-kw">drops</span> by <span class="hp-hl">4 °C</span> per hour for <span class="hp-hl">8</span> hours, then <span class="hp-kw">rises</span> by <span class="hp-hl">5 °C</span> per hour for <span class="hp-hl">3</span> hours. What is the temperature now?</p>
      ${steps(
        `<p><strong>Write one calculation.</strong> A drop is a negative change.</p>
         ${sum('6 + 8 × (−4) + 3 × 5')}`,
        `<p><strong>× first, then + and −.</strong></p>
         ${sum('6 − 32 + 15 = −11')}
         ${ans('-11')}`
      )}
      ${tip('Check the times. 8 pm to 10 am is 14 hours, for example.')}`,

    // y8-1H Q11, Q15: inserting brackets
    'y8-1h-insert': `
      <p class="hp-tag">Worked example: where do the brackets go? <b>−4 + 6 × 2 = 4</b></p>
      ${steps(
        `<p><strong>Work it out with no brackets.</strong></p>
         ${sum('−4 + 12 = 8 ✗')}`,
        `<p><strong>Try brackets in a new place.</strong> Brackets around the + make it happen first.</p>
         ${sum('(−4 + 6) × 2 = 2 × 2 = 4 ✓')}
         ${ans('(−4 + 6) × 2 = 4')}`
      )}
      ${tip('Brackets that change the answer usually go around a + or − so it happens before a × or ÷. Sometimes you need two sets.')}`,

    // y8-1H Q12: always true laws
    'y8-1h-laws': `
      <p class="hp-tag">Worked example: is <b>a − b = b − a</b> always true?</p>
      ${steps(
        `<p><strong>Try numbers.</strong> a = 9 and b = 4.</p>
         ${sum('9 − 4 = 5<br>4 − 9 = −5')}`,
        `<p><strong>The answers are different</strong>, so one example is enough.</p>
         ${ans('Not always true')}`
      )}
      ${chips(['Order does not matter for + and ×', 'add'], ['Order matters for − and ÷', 'take'])}
      ${tip('A minus in front of a bracket changes every sign inside: −(a − b) = −a + b. Test with numbers, including negative ones.')}`,

    // y8-1H Q13: fractions as division
    'y8-1h-fraction': `
      <p class="hp-tag">Worked example: evaluate <b>(x − y)/z</b> when <b>x = 10</b>, <b>y = −4</b> and <b>z = −7</b>.</p>
      ${steps(
        `<p><strong>The fraction line acts like brackets.</strong> Work out the top first.</p>
         ${sum('x − y = 10 − (−4) = 14')}`,
        `<p><strong>Then divide by the bottom.</strong></p>
         ${sum('14 ÷ (−7) = −2')}
         ${ans('-2')}`
      )}
      ${tip('If the bottom has working too, finish the top and the bottom before you divide.')}`,

    // y8-1H Q16: how many different answers
    'y8-1h-count': `
      <p class="hp-tag">Worked example: one set of brackets is put into <b>9 + 2 × 8 − 3</b>. How many different answers are possible?</p>
      ${steps(
        `<p><strong>List every place the brackets could go</strong>, around two or more numbers next to each other.</p>
         ${sum('No brackets: 9 + 16 − 3 = 22<br>(9 + 2) × 8 − 3 = 85<br>9 + (2 × 8) − 3 = 22<br>9 + 2 × (8 − 3) = 19<br>(9 + 2 × 8) − 3 = 22<br>9 + (2 × 8 − 3) = 22')}`,
        `<p><strong>Count the different answers.</strong> 22, 85 and 19.</p>
         ${ans('3')}`
      )}
      ${tip('Brackets around the whole thing, or around something already done first, give the same answer as no brackets. Count each answer once.')}`
  });
})();
