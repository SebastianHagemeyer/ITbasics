/* H3 "How do I work this out?" panels for Chapter 2 (2A to 2K).
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 2A to 2F. */
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

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 2A Factors and multiples
    // =====================================================================
    // 2A Q1, Q2, Q4, Q12: listing factors (and filling gaps in a factor list)
    '2a-factors': `
      <p class="hp-tag">Worked example: list all the factors of <b>56</b>.</p>
      ${steps(
        `<p><strong>Find the factor pairs.</strong> Start at 1 and work up. Each pair multiplies to make 56.</p>
         ${sum('1 × 56<br>2 × 28<br>4 × 14<br>7 × 8')}
         <p>3, 5 and 6 do not go into 56, so skip them.</p>`,
        `<p><strong>Stop when the pairs meet.</strong> After 7 × 8, the next pair would be 8 × 7, which you already have.</p>`,
        `<p><strong>Write them in order.</strong> Go down the left side of the pairs, then back up the right side.</p>
         ${chips(['1'], ['2'], ['4'], ['7'], ['8'], ['14'], ['28'], ['56'])}
         ${ans('1, 2, 4, 7, 8, 14, 28, 56')}`
      )}
      ${tip('Filling gaps? Use the pairs: the first and last factors multiply to the number, then the second and second last, and so on. Also, "56 is a multiple of 7" means the same thing as "7 is a factor of 56".')}`,

    // 2A Q3: the first six multiples
    '2a-multiples': `
      <p class="hp-tag">Worked example: write the first six multiples of <b>13</b>.</p>
      ${steps(
        `<p><strong>The multiples of 13 are the 13 times table.</strong> The first one is 13 itself.</p>`,
        `<p><strong>Start at 13 and keep adding 13.</strong></p>
         ${flow(['× 1', '13'], ['× 2', '26'], ['× 3', '39'], ['× 4', '52'], ['× 5', '65'], ['× 6', '78'])}
         ${ans('13, 26, 39, 52, 65, 78')}`
      )}
      ${tip('Check the last one by multiplying: 13 × 6 = 78. Type them in order, separated by commas.')}`,

    // 2A Q5, Q13: is it a multiple? (spot the wrong one, or pick the ones that are)
    '2a-is-multiple': `
      <p class="hp-tag">Worked example: which number is the incorrect multiple? <b>17, 34, 51, 68, 86, 102, 119</b></p>
      ${steps(
        `<p><strong>Find the jump.</strong> These are multiples of 17, so each one should be 17 more than the one before.</p>
         ${chips(['17'], ['34'], ['51'], ['68'], ['86', 'take'], ['102'], ['119'])}`,
        `<p><strong>Check every jump.</strong></p>
         ${sum('68 + 17 = 85, but the list says 86 ✗<br>85 + 17 = 102, back on track ✓')}`,
        `<p><strong>Divide to be sure.</strong> 86 ÷ 17 = 5 r 1. A remainder means it is not a multiple.</p>
         ${ans('86')}`
      )}
      ${tip('Testing a list of separate numbers? Divide each one. No remainder means it is a multiple. Type every number that passes, separated by commas.')}`,

    // 2A Q6: counting factors, and which numbers have an odd number of them
    '2a-count': `
      <p class="hp-tag">Worked example: which number from <b>61</b> to <b>70</b> has an odd number of factors?</p>
      ${steps(
        `<p><strong>Factors come in pairs.</strong> Most numbers have an even number of factors.</p>
         ${sum('66 = 1 × 66 = 2 × 33 = 3 × 22 = 6 × 11')}
         <p>4 pairs, so 66 has 8 factors.</p>`,
        `<p><strong>A square number has a pair that matches.</strong> The matching factor only counts once.</p>
         ${sum('64 = 1 × 64 = 2 × 32 = 4 × 16 = 8 × 8')}
         ${chips(['1'], ['2'], ['4'], ['8', 'add'], ['16'], ['32'], ['64'])}
         <p>That is 7 factors, an odd number.</p>
         ${ans('64')}`
      )}
      ${tip('Only square numbers have an odd number of factors. For the most factors, try numbers that are in lots of times tables. For the fewest, remember a prime has just 2 factors, then ask whether any number has fewer.')}`,

    // 2A Q7: a product of two factors, both greater than 10
    '2a-product': `
      <p class="hp-tag">Worked example: write <b>323</b> as a product of two factors, both greater than 10.</p>
      ${steps(
        `<p><strong>Try dividing by numbers just above 10.</strong> 323 is odd, so skip even numbers. It does not end in 0 or 5, so skip 15.</p>
         ${sum('323 ÷ 11 = 29 r 4 ✗<br>323 ÷ 13 = 24 r 11 ✗<br>323 ÷ 17 = 19 ✓')}`,
        `<p><strong>Check it.</strong> 17 × 19 = 323, and both numbers are bigger than 10.</p>
         ${ans('17 × 19')}`
      )}
      ${tip('Type it like 17 x 19. Try the primes first (11, 13, 17, 19, 23, 29), because they are the building blocks of every other factor.')}`,

    // 2A Q8: two things that repeat, when do they line up?
    '2a-together': `
      <p class="hp-tag">Worked example: one light flashes every <b>4</b> seconds and another every <b>10</b> seconds. They flash together at the start. When do they next flash together, and how many times has each one flashed?</p>
      ${steps(
        `<p><strong>List the multiples of each number</strong> until you find one in both lists.</p>
         ${sum('4: 4, 8, 12, 16, <b>20</b><br>10: 10, <b>20</b>')}`,
        `<p><strong>The first number in both lists is the answer.</strong> This is the lowest common multiple. They flash together after 20 seconds.</p>
         ${ans('20')}`,
        `<p><strong>Divide to count the flashes.</strong></p>
         ${sum('20 ÷ 4 = 5 flashes<br>20 ÷ 10 = 2 flashes')}`
      )}
      ${tip('Runners work the same way. The meeting time is the lowest common multiple of their lap times. Divide that time by each lap time to count the laps.')}`,

    // 2A Q9: sharing into equal bags
    '2a-share': `
      <p class="hp-tag">Worked example: Sam has <b>96</b> marbles to share equally into bags.</p>
      ${steps(
        `<p><strong>Sharing equally means divide.</strong> With 6 bags:</p>
         ${sum('96 ÷ 6 = 16, with 0 left over')}`,
        `<p><strong>Whole marbles only? Ignore the remainder.</strong> With 7 bags:</p>
         ${sum('96 ÷ 7 = 13 r 5')}
         <p>13 marbles go in each bag, and 5 are left over.</p>`,
        `<p><strong>No leftovers means the number of bags is a factor.</strong> Which numbers of bags less than 10 leave nothing over?</p>
         ${chips(['1', 'add'], ['2', 'add'], ['3', 'add'], ['4', 'add'], ['5 ✗', 'take'], ['6', 'add'], ['7 ✗', 'take'], ['8', 'add'], ['9 ✗', 'take'])}
         ${ans('1, 2, 3, 4, 6, 8')}`
      )}
      ${tip('Read carefully who gets a bag. If the question asks how many people of one kind, take away the bags that belong to everyone else.')}`,

    // 2A Q10: true or false statements
    '2a-truefalse': `
      ${chips(['factor: goes into the number exactly'], ['multiple: is in the number\'s times table'])}
      <p class="hp-tag">Worked example: true or false? "All multiples of 5 end in 5."</p>
      ${steps(
        `<p><strong>Test a few examples.</strong></p>
         ${sum('5 ends in 5 ✓<br>10 ends in 0 ✗')}`,
        `<p><strong>One example that breaks the rule is enough.</strong> 10 is a multiple of 5, but it ends in 0.</p>
         ${ans('False')}`
      )}
      ${tip('For "true", the statement must work for every number, so think about why it always works. For "false", you only need one example that breaks it.')}`,

    // 2A Q11, Q14: the smallest number with several factors, and what else must divide it
    '2a-smallest': `
      <p class="hp-tag">Worked example: a number is a multiple of <b>4</b> and a multiple of <b>14</b>. What other numbers must be factors of it?</p>
      ${steps(
        `<p><strong>Find the smallest number that is a multiple of both.</strong> Go up the 14 times table and test each one for 4.</p>
         ${sum('14 ✗<br>28 ✓ (28 ÷ 4 = 7)')}`,
        `<p><strong>Every number that works is a multiple of 28.</strong> So every factor of 28 must be a factor of it too.</p>
         ${sum('Factors of 28: 1, 2, 4, 7, 14, 28')}`,
        `<p><strong>Leave out the 4 and 14 you were given.</strong></p>
         ${ans('1, 2, 7, 28')}`
      )}
      ${tip('For a longer list, build it up one number at a time. For 2, 7 and 9: 2 and 7 give 14. 9 shares no factor with 14, so multiply: 14 × 9 = 126.')}`,

    // 2A Q15: factor sums and amicable numbers
    '2a-factor-sum': `
      <p class="hp-tag">Worked example: find the factor sum of <b>28</b>.</p>
      ${steps(
        `<p><strong>List the factors, then cross off the number itself.</strong></p>
         ${chips(['1'], ['2'], ['4'], ['7'], ['14'], ['28', 'take'])}`,
        `<p><strong>Add up the rest.</strong></p>
         ${sum('1 + 2 + 4 + 7 + 14 = 28')}
         ${ans('28')}
         <p>28 is a <b>perfect number</b>: its factor sum is itself.</p>`,
        `<p><strong>Testing for amicable numbers?</strong> Find the factor sum of each number. The factor sum of 21 is 1 + 3 + 7 = 11, but the factor sum of 11 is just 1, not 21. So 21 and 11 are not amicable.</p>`
      )}
      ${tip('Big numbers have lots of factors. Find them in pairs so you do not miss any, then add carefully.')}`,

    // =====================================================================
    // 2B Highest common factor and lowest common multiple
    // =====================================================================
    // 2B Q1, Q2, Q3, Q8: HCF
    '2b-hcf': `
      <p class="hp-tag">Worked example: find the HCF of <b>34</b> and <b>51</b>.</p>
      ${steps(
        `<p><strong>List the factors of each number.</strong></p>
         ${sum('34: 1, 2, 17, 34<br>51: 1, 3, 17, 51')}`,
        `<p><strong>Find the factors that are in both lists.</strong> These are the common factors.</p>
         ${chips(['1', 'add'], ['17', 'add'])}`,
        `<p><strong>The highest one is the HCF.</strong></p>
         ${ans('17')}`
      )}
      ${tip('For three numbers, the HCF must be in all three lists. If the only common factor is 1, the HCF is 1.')}`,

    // 2B Q4, Q5, Q7, Q14: LCM
    '2b-lcm': `
      <p class="hp-tag">Worked example: find the LCM of <b>16</b> and <b>20</b>.</p>
      ${steps(
        `<p><strong>List the multiples of each number.</strong> Start at the number and keep adding it.</p>
         ${sum('Multiples of 16: 16, 32, 48, 64, <b>80</b>, 96, ...<br>Multiples of 20: 20, 40, 60, <b>80</b>, 100, ...')}`,
        `<p><strong>Find the lowest number that is in both lists.</strong> That is the lowest common multiple.</p>
         ${ans('80')}`
      )}
      <p><strong>For a group, go two at a time.</strong> The LCM of 9 and 10 is 90. 90 is already a multiple of 15, so the LCM of 9, 10 and 15 is 90.</p>
      ${tip('If two numbers have no common factor except 1, the LCM is just their product. The LCM of 5 and 9 is 5 × 9 = 45.')}`,

    // 2B Q6: HCF first, then use it for the LCM
    '2b-hcf-lcm': `
      <p class="hp-tag">Worked example: find the HCF of <b>20</b> and <b>35</b>, then use it to find the LCM.</p>
      ${steps(
        `<p><strong>Find the HCF.</strong></p>
         ${sum('20: 1, 2, 4, <b>5</b>, 10, 20<br>35: 1, <b>5</b>, 7, 35')}
         <p>The HCF is 5.</p>`,
        `<p><strong>LCM = first number × second number ÷ HCF.</strong> Multiply the two numbers, then divide by the HCF.</p>
         ${sum('20 × 35 ÷ 5<br>= 700 ÷ 5<br>= 140')}`,
        `<p><strong>Type the HCF first, then the LCM.</strong></p>
         ${ans('5, 140')}`
      )}
      ${tip('Check the LCM: 140 ÷ 20 = 7 and 140 ÷ 35 = 4, so 140 is a multiple of both.')}`,

    // 2B Q9: HCF and LCM of big numbers
    '2b-big': `
      <p class="hp-tag">Worked example: find the HCF and LCM of <b>260</b> and <b>390</b>.</p>
      ${steps(
        `<p><strong>HCF: list the factors of each number</strong>, using factor pairs so you do not miss any.</p>
         ${sum('260: 1, 2, 4, 5, 10, 13, 20, 26, 52, 65, 130, 260<br>390: 1, 2, 3, 5, 6, 10, 13, 15, 26, 30, 39, 65, 78, 130, 195, 390')}`,
        `<p><strong>Find the highest factor in both lists.</strong> The common factors are 1, 2, 5, 10, 13, 26, 65 and 130.</p>
         ${sum('HCF = 130')}`,
        `<p><strong>LCM: list the multiples of each number</strong> until one turns up in both lists.</p>
         ${sum('Multiples of 260: 260, 520, <b>780</b>, ...<br>Multiples of 390: 390, <b>780</b>, ...')}
         ${ans('HCF 130, LCM 780')}`
      )}
      ${tip('Check the LCM with the rule: first number × second number ÷ HCF = 260 × 390 ÷ 130 = 101&nbsp;400 ÷ 130 = 780 ✓.')}`,

    // 2B Q10: three runners, when do they line up?
    '2b-word': `
      <p class="hp-tag">Worked example: three lighthouses flash every <b>3</b>, <b>7</b> and <b>14</b> seconds. They all flash at the start. When do they next all flash together? How many times has each one flashed by then?</p>
      ${steps(
        `<p><strong>All together again means the LCM.</strong> List the multiples of each number and find the lowest one in all three lists.</p>
         ${sum('14: 14, 28, <b>42</b><br>7: 7, 14, 21, 28, 35, <b>42</b><br>3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, <b>42</b>')}
         <p>They all flash together after 42 seconds.</p>`,
        `<p><strong>Divide the time by each gap</strong> to count the flashes.</p>
         ${sum('42 ÷ 3 = 14<br>42 ÷ 7 = 6<br>42 ÷ 14 = 3')}
         ${ans('42 seconds; 14, 6, 3')}`
      )}
      ${tip('Lapping: every time one runner has done one more whole lap than another, they have lapped them once. So subtract the lap counts: a runner on 11 laps has lapped a runner on 8 laps 3 times.')}`,

    // 2B Q11: find two numbers with a given HCF
    '2b-hcf-find': `
      <p class="hp-tag">Worked example: the HCF of two different numbers is <b>11</b>. One is in the 20s and the other is in the 30s. Find them.</p>
      ${steps(
        `<p><strong>Both numbers must be multiples of 11.</strong> List the ones in each range.</p>
         ${sum('20s: 22<br>30s: 33')}`,
        `<p><strong>Check the HCF really is 11, not bigger.</strong></p>
         ${sum('22: 1, 2, <b>11</b>, 22<br>33: 1, 3, <b>11</b>, 33')}
         ${ans('22, 33')}`
      )}
      ${tip('If there is more than one choice, check each pair. Throw out a pair whose HCF is too big: 16 and 32 both have 8 as a factor, but their HCF is 16.')}`,

    // 2B Q12: pairs with a given LCM
    '2b-lcm-pairs': `
      <p class="hp-tag">Worked example: how many pairs of different numbers have an LCM of <b>10</b>?</p>
      ${steps(
        `<p><strong>Both numbers must be factors of 10.</strong></p>
         ${sum('1, 2, 5, 10')}`,
        `<p><strong>Test every pair.</strong></p>
         ${chips(['1 and 2 → 2 ✗', 'take'], ['1 and 5 → 5 ✗', 'take'], ['1 and 10 → 10 ✓', 'add'], ['2 and 5 → 10 ✓', 'add'], ['2 and 10 → 10 ✓', 'add'], ['5 and 10 → 10 ✓', 'add'])}
         ${ans('4')}`
      )}
      ${tip('To find which numbers pair with one number, look down your ticks. Here 5 pairs with 2 and with 10.')}`,

    // 2B Q13: testing a rule with numbers
    '2b-test-rule': `
      <p class="hp-tag">Worked example: does the rule <b>HCF × LCM = first number × second number</b> work for 4 and 14?</p>
      ${steps(
        `<p><strong>Work out the HCF and LCM.</strong></p>
         ${sum('HCF of 4 and 14 = 2<br>LCM of 4 and 14 = 28')}`,
        `<p><strong>Work out both sides of the rule.</strong></p>
         ${sum('HCF × LCM = 2 × 28 = 56<br>4 × 14 = 56')}`,
        `<p><strong>Compare.</strong> Both sides match, so the rule works for this pair.</p>
         ${ans('Yes, for 4 and 14')}`
      )}
      ${tip('One example that works does not prove a rule always works. But one example that fails is enough to show a rule does not always work.')}`,

    // =====================================================================
    // 2C Divisibility tests
    // =====================================================================
    // 2C Q1, Q3: digit sum tests for 3 and 9
    '2c-digitsum': `
      <p class="hp-tag">Worked example: is <b>5742</b> divisible by 3? Is it divisible by 9?</p>
      ${steps(
        `<p><strong>Add the digits.</strong></p>
         ${sum('5 + 7 + 4 + 2 = 18')}`,
        `<p><strong>Test the digit sum.</strong> 18 is in the 3 times table, so 5742 is divisible by 3. 18 is also in the 9 times table, so 5742 is divisible by 9 too.</p>
         ${ans('Yes and yes')}`
      )}
      <p><strong>A number can pass one test and not the other.</strong> For 4251: 4 + 2 + 5 + 1 = 12. 12 is in the 3 times table but not the 9 times table, so 4251 is divisible by 3 but not by 9.</p>
      ${tip('Every number that passes the test for 9 also passes the test for 3, but not the other way round.')}`,

    // 2C Q2: tests for 2 and 5
    '2c-test25': `
      <p class="hp-tag">Worked example: can <b>3478</b> be divided by 2 with no remainder? By 5?</p>
      ${steps(
        `<p><strong>Only look at the last digit.</strong></p>
         ${sum(`347${now('8')}`)}`,
        `<p><strong>Use the rules.</strong></p>
         ${chips(['÷ 2: last digit 0, 2, 4, 6 or 8', 'add'], ['÷ 5: last digit 0 or 5', 'add'])}
         <p>8 is even, so 2 goes in. 8 is not 0 or 5, so 5 does not.</p>
         ${ans('÷ 2: Yes, ÷ 5: No')}`
      )}
      ${tip('The other digits do not matter at all, however long the number is.')}`,

    // 2C Q4: test for 6
    '2c-test6': `
      <p class="hp-tag">Worked example: is <b>732</b> divisible by 6?</p>
      ${steps(
        `<p><strong>6 = 2 × 3, so the number must pass both tests.</strong></p>`,
        `<p><strong>Test for 2.</strong> The last digit, 2, is even ✓</p>`,
        `<p><strong>Test for 3.</strong> 7 + 3 + 2 = 12, which is in the 3 times table ✓</p>
         ${ans('Yes')}`
      )}
      ${tip('If either test fails, the answer is no. 735 is odd, so it is not divisible by 6, even though 7 + 3 + 5 = 15 passes the test for 3.')}`,

    // 2C Q5: tests for 4 and 8
    '2c-test48': `
      <p class="hp-tag">Worked example: can <b>1924</b> be divided by 4 with no remainder? By 8?</p>
      ${steps(
        `<p><strong>Test for 4: look at the last two digits.</strong> 24 is in the 4 times table, so yes.</p>
         ${sum(`19${now('24')}`)}`,
        `<p><strong>Test for 8: look at the last three digits.</strong> 924 ÷ 8 = 115 r 4, so no.</p>
         ${sum(`1${now('924')}`)}
         ${ans('÷ 4: Yes, ÷ 8: No')}`
      )}
      ${tip('For 8, divide the last three digits by 8 with short division. Any remainder means 8 does not go in. Passing the test for 4 is not enough: 1924 passes for 4 but not for 8.')}`,

    // 2C Q6, Q7, Q9: choosing the right test (all the tests together)
    '2c-all-tests': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Divisible by</span><span role="columnheader">Test</span><span role="columnheader">Example</span></div>
        <div class="hp-tr" role="row"><span role="cell">2</span><span role="cell">Last digit even</span><span role="cell">394</span></div>
        <div class="hp-tr" role="row"><span role="cell">3</span><span role="cell">Digit sum in the 3 times table</span><span role="cell">615: 6+1+5 = 12</span></div>
        <div class="hp-tr" role="row"><span role="cell">4</span><span role="cell">Last two digits in the 4 times table</span><span role="cell">716: 16</span></div>
        <div class="hp-tr" role="row"><span role="cell">5</span><span role="cell">Last digit 0 or 5</span><span role="cell">245</span></div>
        <div class="hp-tr" role="row"><span role="cell">6</span><span role="cell">Passes the tests for 2 and 3</span><span role="cell">642</span></div>
        <div class="hp-tr" role="row"><span role="cell">8</span><span role="cell">Last three digits in the 8 times table</span><span role="cell">5120: 120</span></div>
        <div class="hp-tr" role="row"><span role="cell">9</span><span role="cell">Digit sum in the 9 times table</span><span role="cell">3708: 18</span></div>
        <div class="hp-tr" role="row"><span role="cell">10</span><span role="cell">Last digit 0</span><span role="cell">970</span></div>
      </div>
      <p class="hp-tag">Worked example: which of 2, 3, 4, 5, 6, 8, 9 and 10 divide <b>5130</b>?</p>
      ${steps(
        `<p><strong>Look at the end of the number.</strong> It ends in 0, so 2, 5 and 10 go in. The last two digits, 30, are not in the 4 times table, so 4 does not go in, and neither does 8.</p>`,
        `<p><strong>Add the digits.</strong> 5 + 1 + 3 + 0 = 9, so 3 and 9 go in. It passes the tests for 2 and 3, so 6 goes in too.</p>
         ${ans('2, 3, 5, 6, 9, 10')}`
      )}
      ${tip('If 4 fails, 8 fails too. If 3 fails, 6 and 9 fail too. For a list of numbers and one test, check each number and type all the ones that pass.')}`,

    // 2C Q8, Q10: sharing so nobody is left out
    '2c-share': `
      <p class="hp-tag">Worked example: a sports group of <b>40</b> students splits into equal teams. Which team sizes (bigger than 1, smaller than 40) leave nobody out?</p>
      ${steps(
        `<p><strong>Nobody left out means the team size divides 40 exactly.</strong> Test the small sizes with the divisibility tests.</p>
         ${chips(['2 ✓', 'add'], ['3 ✗', 'take'], ['4 ✓', 'add'], ['5 ✓', 'add'], ['6 ✗', 'take'])}
         <p>You can stop at 6, because 7 × 7 = 49 is already past 40.</p>`,
        `<p><strong>Each size that works has a partner.</strong></p>
         ${sum('2 × 20 &nbsp; 4 × 10 &nbsp; 5 × 8')}
         ${ans('2, 4, 5, 8, 10, 20')}`
      )}
      ${tip('Money that does not share equally? Count up to the next number that passes the test. $251 does not share among 3 (2 + 5 + 1 = 8), but $252 does (2 + 5 + 2 = 9). So $1 more is needed, and each person gets 252 ÷ 3 = $84.')}`,

    // 2C Q11: counting the numbers that are not divisible
    '2c-count': `
      <p class="hp-tag">Worked example: how many of the whole numbers from 1 to <b>150</b> are not divisible by 5?</p>
      ${steps(
        `<p><strong>Count the ones that are divisible.</strong> Every 5th number is a multiple of 5.</p>
         ${sum('150 ÷ 5 = 30')}`,
        `<p><strong>Take them away from the total.</strong></p>
         ${sum('150 − 30 = 120')}
         ${ans('120')}`
      )}
      ${tip('Check the idea on a small range first. From 1 to 10, two numbers (5 and 10) are divisible by 5, and the other 8 are not.')}`,

    // 2C Q12, Q13, Q14: divisible by two (or more) numbers at once
    '2c-both': `
      <p class="hp-tag">Worked example: find the largest three-digit number that is divisible by both <b>5</b> and <b>9</b>.</p>
      ${steps(
        `<p><strong>Combine the two tests into one number.</strong> 5 and 9 share no factors, so divisible by both means divisible by 5 × 9 = 45.</p>`,
        `<p><strong>Find the biggest multiple of 45 below 1000.</strong></p>
         ${sum('999 ÷ 45 = 22 r 9<br>22 × 45 = 990')}
         ${ans('990')}`
      )}
      ${tip('Only multiply when the numbers share no factor. Divisible by 6 and 8 means divisible by 24, not 48. To count how many numbers in a range work, list the multiples of the combined number.')}`,

    // 2C Q15: divisible by 15, and missing digits
    '2c-missing': `
      <p class="hp-tag">Worked example: the number <b>2□5</b> is divisible by 15. What could it be?</p>
      ${steps(
        `<p><strong>Divisible by 15 means divisible by 3 and by 5.</strong> It ends in 5, so the test for 5 already passes.</p>`,
        `<p><strong>Use the test for 3.</strong> The digit sum must be in the 3 times table.</p>
         ${sum('2 + □ + 5 = 7 + □<br>7 + □ = 9, 12 or 15, so □ = 2, 5 or 8')}
         ${ans('225, 255, 285')}`
      )}
      ${tip('With two boxes, fix the last digit first (it must be 0 or 5), then try each digit from 0 to 9 in the other box. Type every number that works, separated by commas.')}`,

    // 2C Q16: shortcuts for the digit sum
    '2c-cast': `
      <p class="hp-tag">Worked example: is <b>4 936 152</b> divisible by 3?</p>
      ${steps(
        `<p><strong>Cross out digits that are in the 3 times table.</strong> Adding them cannot change the answer.</p>
         ${chips(['4'], ['9', 'take'], ['3', 'take'], ['6', 'take'], ['1'], ['5'], ['2'])}`,
        `<p><strong>Add only the digits that are left.</strong></p>
         ${sum('4 + 1 + 5 + 2 = 12')}
         <p>12 is in the 3 times table.</p>
         ${ans('Yes')}`
      )}
      ${tip('You can also cross out any group of digits that adds to a multiple of 3. Here 4 + 5 = 9, so only 1 + 2 = 3 is left.')}`,

    // 2C Q17: finishing a divisibility rule
    '2c-rule4': `
      <p>A number is divisible by 25 if its last two digits are 00, 25, 50 or 75.</p>
      <p class="hp-tag">Worked example: finish the rule. If the second-last digit is 2 or 7, the last digit must be ...</p>
      ${steps(
        `<p><strong>List every ending that works.</strong></p>
         ${chips(['00'], ['25'], ['50'], ['75'])}`,
        `<p><strong>Sort them by the second-last digit.</strong></p>
         ${sum('second-last 0 or 5 → last digit 0<br>second-last 2 or 7 → last digit 5')}
         ${ans('5')}`
      )}
      ${tip('Do the same for 4: write out the multiples of 4 from 00 to 40, then sort them into "tens digit even" and "tens digit odd".')}`,

    // 2C Q18: test for 11
    '2c-test11': `
      <p class="hp-tag">Worked example: is <b>7381</b> divisible by 11?</p>
      ${steps(
        `<p><strong>Add the 1st and 3rd digits, then the 2nd and 4th.</strong></p>
         ${sum('7 + 8 = 15<br>3 + 1 = 4')}`,
        `<p><strong>Take the smaller sum from the larger.</strong></p>
         ${sum('15 − 4 = 11')}`,
        `<p><strong>0 or a multiple of 11 means yes.</strong> (Check: 11 × 671 = 7381.)</p>
         ${ans('Yes')}`
      )}
      ${tip('For a longer number, add every other digit: the 1st, 3rd, 5th and so on, then the 2nd, 4th, 6th. To list multiples of 11 in a range, find the first one and keep adding 11: 209, 220, 231, 242.')}`,

    // =====================================================================
    // 2D Prime numbers
    // =====================================================================
    // 2D Q1, Q2: prime or composite?
    '2d-prime': `
      <p>A <b>prime</b> number has exactly two factors: 1 and itself. A <b>composite</b> number has more than two.</p>
      <p class="hp-tag">Worked example: is <b>133</b> prime or composite?</p>
      ${steps(
        `<p><strong>Try the small primes with the divisibility tests.</strong></p>
         ${chips(['2: odd ✗', 'take'], ['3: 1 + 3 + 3 = 7 ✗', 'take'], ['5: no 0 or 5 ✗', 'take'])}`,
        `<p><strong>Try 7.</strong></p>
         ${sum('133 ÷ 7 = 19')}
         <p>7 goes in exactly, so 133 has more factors than just 1 and itself.</p>
         ${ans('Composite')}`
      )}
      ${tip('You only need to try primes whose square is not bigger than the number. For numbers under 100, that means 2, 3, 5 and 7. If none of them go in, the number is prime.')}`,

    // 2D Q3, Q6: the different prime factors of a number
    '2d-prime-factors': `
      <p class="hp-tag">Worked example: list the different prime factors of <b>78</b>.</p>
      ${steps(
        `<p><strong>Find the whole set of factors first.</strong> Use factor pairs, starting at 1.</p>
         ${sum('1 × 78<br>2 × 39<br>3 × 26<br>6 × 13')}
         ${chips(['1'], ['2'], ['3'], ['6'], ['13'], ['26'], ['39'], ['78'])}`,
        `<p><strong>Keep only the factors that are prime.</strong> 1 is not prime, and 6, 26, 39 and 78 each have more than two factors.</p>
         ${chips(['1 ✗', 'take'], ['2', 'add'], ['3', 'add'], ['6 ✗', 'take'], ['13', 'add'], ['26 ✗', 'take'], ['39 ✗', 'take'], ['78 ✗', 'take'])}
         ${ans('2, 3, 13')}`
      )}
      ${tip('Each prime goes in the list once. The factors of 12 are 1, 2, 3, 4, 6 and 12, and only 2 and 3 are prime, so 12 has two different prime factors.')}`,

    // 2D Q4: composite numbers between two numbers
    '2d-composite': `
      <p class="hp-tag">Worked example: list the composite numbers between <b>150</b> and <b>160</b>.</p>
      ${steps(
        `<p><strong>Even numbers and numbers ending in 5 are composite.</strong> Do not include 150 and 160 themselves.</p>
         ${chips(['152', 'take'], ['154', 'take'], ['155', 'take'], ['156', 'take'], ['158', 'take'])}`,
        `<p><strong>Test the rest: 151, 153, 157 and 159.</strong></p>
         ${sum('153: 1 + 5 + 3 = 9, so 3 goes in → composite<br>159: 1 + 5 + 9 = 15, so 3 goes in → composite<br>151 and 157: 3, 7 and 11 do not go in → prime')}`,
        `<p><strong>List the composites in order.</strong></p>
         ${ans('152, 153, 154, 155, 156, 158, 159')}`
      )}
      ${tip('Every even number except 2 is composite, so they are a quick win. Then check the odd numbers one at a time.')}`,

    // 2D Q5: a product of two primes
    '2d-two-primes': `
      <p class="hp-tag">Worked example: <b>623</b> is the product of two primes. Find them.</p>
      ${steps(
        `<p><strong>Try dividing by primes in order: 2, 3, 5, 7, ...</strong></p>
         ${sum('2: odd ✗<br>3: 6 + 2 + 3 = 11 ✗<br>5: no 0 or 5 ✗<br>623 ÷ 7 = 89 ✓')}`,
        `<p><strong>Check the other number is prime.</strong> 2, 3, 5 and 7 do not go into 89, so it is prime.</p>
         ${ans('7, 89')}`
      )}
      ${tip('Once one prime goes in, divide to find the other. Type the two primes separated by a comma.')}`,

    // 2D Q7, Q8: prime puzzles (twin primes, reverse primes)
    '2d-puzzle': `
      <p class="hp-tag">Worked example: find the pair of twin primes between <b>105</b> and <b>110</b>.</p>
      ${steps(
        `<p><strong>List the odd numbers in between.</strong> Primes bigger than 2 are always odd.</p>
         ${sum('107, 109')}`,
        `<p><strong>Test each one with 2, 3, 5 and 7.</strong> You can stop at 7: 11 × 11 is already more than 109.</p>
         ${sum('107: 1 + 0 + 7 = 8 ✗ &nbsp; 107 ÷ 7 = 15 r 2 ✗<br>109: 1 + 0 + 9 = 10 ✗ &nbsp; 109 ÷ 7 = 15 r 4 ✗')}
         <p>Nothing goes in, so both are prime.</p>
         ${ans('107, 109')}`
      )}
      ${tip('Reverse-number puzzle? The reverse of a prime must end in 1, 3, 7 or 9, so only check two-digit primes that start with 1, 3, 7 or 9.')}`,

    // 2D Q9: an even number as the sum of two primes
    '2d-goldbach': `
      <p class="hp-tag">Worked example: write <b>86</b> as the sum of two primes.</p>
      ${steps(
        `<p><strong>Take small primes away from 86</strong>, one at a time.</p>
         ${sum('86 − 2 = 84 ✗ (even)<br>86 − 3 = 83 ?')}`,
        `<p><strong>Check whether 83 is prime.</strong> It is odd, 8 + 3 = 11 is not in the 3 times table, it does not end in 0 or 5, and 83 ÷ 7 = 11 r 6. Nothing goes in, so 83 is prime.</p>
         ${ans('3, 83')}`
      )}
      ${tip('There is often more than one answer, and any correct pair is marked right. If your first try is not prime, move on to the next prime.')}`,

    // 2D Q10, Q11: adding primes, odd and even
    '2d-sums': `
      ${chips(['odd + odd = even'], ['even + odd = odd'], ['2 is the only even prime'])}
      <p class="hp-tag">Worked example: which two primes add up to <b>25</b>?</p>
      ${steps(
        `<p><strong>25 is odd.</strong> Two odd primes would make an even total, so one of the primes must be even.</p>`,
        `<p><strong>The only even prime is 2.</strong></p>
         ${sum('25 − 2 = 23, and 23 is prime')}
         ${ans('2, 23')}`
      )}
      ${tip('Three odd primes add up to an odd number, so three primes can make a prime. Pick one small prime, then split what is left into two more. For 29: 29 − 3 = 26 = 7 + 19.')}`,

    // =====================================================================
    // 2E Using indices
    // =====================================================================
    // 2E Q1 to Q4: writing a product using powers
    '2e-index': `
      <p class="hp-tag">Worked example: write <b>14 × 23 × 14 × 14 × 23</b> using powers.</p>
      ${steps(
        `<p><strong>Group the same numbers together.</strong> You can multiply in any order.</p>
         ${sum('14 × 14 × 14 × 23 × 23')}`,
        `<p><strong>Count each number.</strong> The count becomes the power, the small raised number.</p>
         ${sum('three 14s → 14³<br>two 23s → 23²')}
         ${ans('14³ × 23²')}`
      )}
      ${tip('Type powers with the ^ key: 14^3 x 23^2. A number that appears only once needs no power, like the 3 in 14^2 x 3.')}`,

    // 2E Q5, Q6: writing a power as a multiplication
    '2e-expand': `
      <p class="hp-tag">Worked example: write <b>16⁴ × 21²</b> as a multiplication.</p>
      ${steps(
        `<p><strong>The power tells you how many times to write the number.</strong> 16⁴ means four 16s. 21² means two 21s.</p>`,
        `<p><strong>Write them all out, joined by ×.</strong></p>
         ${ans('16 × 16 × 16 × 16 × 21 × 21')}`
      )}
      ${tip('Do not work out the value. Type it like 16x16x16x16x21x21. A power of 1 means the number just once: 21¹ = 21.')}`,

    // 2E Q7, Q8: evaluating powers (with order of operations)
    '2e-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>2 × 14² − 1⁸</b></p>
      ${steps(
        `<p><strong>Powers first.</strong></p>
         ${sum(`2 × ${now('14²')} − ${now('1⁸')}`)}
         ${sum('14² = 14 × 14 = 196<br>1⁸ = 1 × 1 × 1 × 1 × 1 × 1 × 1 × 1 = 1')}`,
        `<p><strong>Then × and ÷.</strong></p>
         ${sum(`${now('2 × 196')} − 1 = 392 − 1`)}`,
        `<p><strong>Then + and −.</strong></p>
         ${sum('392 − 1 = 391')}
         ${ans('391')}`
      )}
      ${tip('The order is brackets, then powers, then × and ÷, then + and −. 14² means 14 × 14, not 14 × 2. And 1 to any power is still 1.')}`,

    // 2E Q9: finding the missing power
    '2e-find-index': `
      <p class="hp-tag">Worked example: <b>8000 = 20<sup>□</sup></b>. Find the missing power.</p>
      ${steps(
        `<p><strong>Keep multiplying by 20</strong> and count how many 20s you use.</p>
         ${flow(['20¹', '20'], ['20²', '400'], ['20³', '8000'])}`,
        `<p><strong>Three 20s make 8000.</strong></p>
         ${ans('3')}`
      )}
      ${tip('You can also divide: 8000 ÷ 20 = 400, then 400 ÷ 20 = 20, then 20 ÷ 20 = 1. Three divisions, so the power is 3.')}`,

    // 2E Q10, Q15: comparing powers
    '2e-compare': `
      <p class="hp-tag">Worked example: which symbol, &lt;, = or &gt;, goes in <b>14³ □ 52²</b>?</p>
      ${steps(
        `<p><strong>Work out both sides.</strong></p>
         ${sum('14³ = 14 × 14 × 14 = 2744<br>52² = 52 × 52 = 2704')}`,
        `<p><strong>Compare the values.</strong> 2744 is greater than 2704.</p>
         ${ans('&gt;')}`
      )}
      <p><strong>Puzzle with a<sup>b</sup> and b<sup>a</sup>?</strong> Start with the smallest numbers. For each pair, work out both powers and look for a match.</p>
      ${tip('Same base? The bigger power wins, no working needed. Different bases? Always work them out. A big base or a big power on its own does not tell you which is bigger.')}`,

    // 2E Q13: the missing operation
    '2e-operation': `
      <p class="hp-tag">Worked example: which operation goes in the box? <b>20² □ 21² = 29²</b></p>
      ${steps(
        `<p><strong>Work out every power.</strong></p>
         ${sum('20² = 400 &nbsp; 21² = 441 &nbsp; 29² = 841')}`,
        `<p><strong>Try the operations until one works.</strong></p>
         ${sum('400 + 441 = 841 ✓')}
         ${ans('+')}`
      )}
      ${tip('Is the answer bigger than both numbers? Try + or ×. Smaller? Try − or ÷.')}`,

    // 2E Q11, Q12: sharing that multiplies each round
    '2e-growth': `
      <p class="hp-tag">Worked example: Ava sends a message to 3 friends. Every 5 minutes, each new reader sends it on to 3 new people. Counting Ava, how many people have read it within 15 minutes?</p>
      ${steps(
        `<p><strong>Each round, the new readers multiply by 3.</strong> Make a table.</p>
         <div class="hp-table" role="table">
           <div class="hp-tr hp-th" role="row"><span role="columnheader">Time</span><span role="columnheader">New readers</span><span role="columnheader">Total</span></div>
           <div class="hp-tr" role="row"><span role="cell">Start</span><span role="cell">1 (Ava)</span><span role="cell">1</span></div>
           <div class="hp-tr" role="row"><span role="cell">5 minutes</span><span role="cell">3</span><span role="cell">4</span></div>
           <div class="hp-tr" role="row"><span role="cell">10 minutes</span><span role="cell">3 × 3 = 9</span><span role="cell">13</span></div>
           <div class="hp-tr" role="row"><span role="cell">15 minutes</span><span role="cell">3 × 3 × 3 = 27</span><span role="cell">40</span></div>
         </div>`,
        `<p><strong>Add every round, including Ava.</strong></p>
         ${sum('1 + 3 + 9 + 27 = 40')}
         ${ans('40')}`
      )}
      ${tip('Only want the last round? That is one power, like 3³ = 27. For "how long until everyone", keep adding rows until the total passes the target, then count the minutes.')}`,

    // 2E Q14: powers in a sequence, and their differences
    '2e-sequence': `
      <p class="hp-tag">Worked example: write the powers of <b>20</b> that are less than 10 000. Then find the differences between them.</p>
      ${steps(
        `<p><strong>Start at 1 and keep multiplying by 20.</strong> Stop before you pass 10 000.</p>
         ${flow(['Start', '1'], ['× 20', '20'], ['× 20', '400'], ['× 20', '8000'])}
         ${ans('1, 20, 400, 8000')}`,
        `<p><strong>Take each term away from the next one.</strong></p>
         ${sum('20 − 1 = 19<br>400 − 20 = 380<br>8000 − 400 = 7600')}`,
        `<p><strong>Look for a pattern.</strong> 19 = 19 × 1, 380 = 19 × 20 and 7600 = 19 × 400. Each difference is 19 times a power of 20.</p>`
      )}
      ${tip('The next power, 160 000, is too big, so stop at 8000. Type the terms in order, separated by commas.')}`,

    // 2E Q16: factorials
    '2e-factorial': `
      <p><b>n!</b> means multiply every whole number from n down to 1.</p>
      <p class="hp-tag">Worked example: write <b>34 × 35 × 36</b> in prime factor form. How many zeros are on the end of its value?</p>
      ${steps(
        `<p><strong>Break each number into primes.</strong></p>
         ${sum('34 = 2 × 17<br>35 = 5 × 7<br>36 = 2 × 2 × 3 × 3')}`,
        `<p><strong>Collect them using powers.</strong> There are three 2s and two 3s.</p>
         ${ans('2³ × 3² × 5 × 7 × 17')}`,
        `<p><strong>Each 2 × 5 makes a 10, and each 10 adds a zero.</strong> There is only one 5, so there is one zero: 34 × 35 × 36 = 42 840.</p>`
      )}
      ${tip('Type it like 2^3 x 3^2 x 5 x 7 x 17. For a factorial, count the 5s, since there are always more 2s. Some numbers hold two 5s, like 75 = 3 × 5 × 5. Also, 9! = 9 × 8!, which helps with puzzles.')}`,

    // =====================================================================
    // 2F Prime decomposition
    // =====================================================================
    // 2F Q1, Q2, Q11: prime factor form with a factor tree
    '2f-tree': `
      <p class="hp-tag">Worked example: write <b>72</b> in prime factor form.</p>
      ${steps(
        `<p><strong>Split 72 into any two factors.</strong> Keep splitting each branch until you reach a prime. Circle the primes.</p>
         ${tree(['72', ['8', '2', ['4', '2', '2']], ['9', '3', '3']], 'Factor tree: 72 splits into 8 and 9, 8 into 2 and 4, 4 into 2 and 2, 9 into 3 and 3')}`,
        `<p><strong>Collect the circled primes</strong>, smallest first.</p>
         ${sum('2 × 2 × 2 × 3 × 3')}`,
        `<p><strong>Write repeats as powers.</strong></p>
         ${ans('2³ × 3²')}`
      )}
      ${tip('Type it like 2^3 x 3^2. Any first split works: starting with 2 × 36 gives the same primes. Check by multiplying back: 8 × 9 = 72.')}`,

    // 2F Q3: bigger numbers, starting with a power of 10
    '2f-tens': `
      <p class="hp-tag">Worked example: write <b>5700</b> in prime factor form.</p>
      ${steps(
        `<p><strong>Split off a power of 10.</strong></p>
         ${sum('5700 = 57 × 100')}`,
        `<p><strong>Break each branch into primes.</strong> 57 is 3 × 19 (its digit sum, 12, shows 3 goes in). 100 is 10 × 10, and each 10 is 2 × 5.</p>
         ${tree(['5700', ['57', '3', '19'], ['100', ['10', '2', '5'], ['10', '2', '5']]], 'Factor tree: 5700 splits into 57 and 100; 57 into 3 and 19; 100 into 10 and 10, each 10 into 2 and 5')}`,
        `<p><strong>Collect the primes and write repeats as powers.</strong> Two 2s, one 3, two 5s and one 19.</p>
         ${ans('2² × 3 × 5² × 19')}`
      )}
      ${tip('Each zero on the end gives you one 2 and one 5. Type it like 2^2 x 3 x 5^2 x 19.')}`,

    // 2F Q4, Q9, Q10: checking a prime factor form
    '2f-check': `
      <p class="hp-tag">Worked example: which is the prime factor form of <b>150</b>? &nbsp;A: 3 × 5³ &nbsp;B: 2 × 3 × 25 &nbsp;C: 5 × 3 × 5 × 2</p>
      ${steps(
        `<p><strong>Check that every factor is prime.</strong> B has 25, which is not prime (5 goes into it). B is out.</p>`,
        `<p><strong>Multiply back to check you get the number.</strong></p>
         ${sum('A: 3 × 125 = 375 ✗<br>C: 5 × 3 × 5 × 2 = 150 ✓')}
         ${ans('C')}`
      )}
      ${tip('Quick checks: a 5 in the primes means the number ends in 0 or 5, and a 2 means it is even. Order does not matter: 5 × 3 × 5 × 2 is the same as 2 × 3 × 5².')}`,

    // 2F Q5: the smallest number with certain prime factors
    '2f-smallest': `
      <p class="hp-tag">Worked example: find the smallest number that has the three smallest primes bigger than 10 as factors.</p>
      ${steps(
        `<p><strong>List the primes.</strong> 12, 14, 15 and 16 are not prime.</p>
         ${sum('11, 13, 17')}`,
        `<p><strong>Multiply them together, once each.</strong></p>
         ${sum('11 × 13 = 143<br>143 × 17 = 2431')}
         ${ans('2431')}`
      )}
      ${tip('"Smallest" means use each prime once and nothing extra, because any extra factor makes the number bigger. Remember 1 is not prime, and 2 is the only even prime.')}`,

    // 2F Q6, Q7: HCF from prime factor form
    '2f-hcf': `
      <p class="hp-tag">Worked example: use prime factor form to find the HCF of <b>72</b> and <b>120</b>.</p>
      ${steps(
        `<p><strong>Write both numbers in prime factor form</strong> (use a factor tree).</p>
         ${sum('72 = 2³ × 3²<br>120 = 2³ × 3 × 5')}`,
        `<p><strong>Take the primes they share, with the smaller power.</strong></p>
         ${chips(['2: both have 2³ → 2³', 'add'], ['3: 3² and 3 → 3', 'add'], ['5: only in 120 → leave out', 'take'])}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('2³ × 3 = 8 × 3 = 24')}
         ${ans('24')}`
      )}
      ${tip('Check: 72 ÷ 24 = 3 and 120 ÷ 24 = 5, so 24 goes into both.')}`,

    // 2F Q8: LCM from prime factor form
    '2f-lcm': `
      <p class="hp-tag">Worked example: use prime factor form to find the LCM of <b>20</b> and <b>24</b>.</p>
      ${steps(
        `<p><strong>Write both numbers in prime factor form.</strong></p>
         ${sum('20 = 2² × 5<br>24 = 2³ × 3')}`,
        `<p><strong>Take every prime that appears, with the bigger power.</strong></p>
         ${chips(['2² or 2³ → 2³', 'add'], ['3', 'add'], ['5', 'add'])}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('2³ × 3 × 5 = 8 × 15 = 120')}
         ${ans('120')}`
      )}
      ${tip('HCF: shared primes, smaller power. LCM: every prime, bigger power. Check: 120 ÷ 20 = 6 and 120 ÷ 24 = 5.')}`,

    // 2F Q12: Goldbach, an even number as the sum of two primes
    '2f-goldbach': `
      <p class="hp-tag">Worked example: write <b>92</b> as the sum of two primes.</p>
      ${steps(
        `<p><strong>Take small primes away from 92</strong>, one at a time.</p>
         ${sum('92 − 2 = 90 ✗ (even)<br>92 − 3 = 89 ?')}`,
        `<p><strong>Check whether 89 is prime.</strong> It is odd, 8 + 9 = 17 is not in the 3 times table, it does not end in 0 or 5, and 89 ÷ 7 = 12 r 5. Nothing goes in, so 89 is prime.</p>
         ${ans('3, 89')}`
      )}
      ${tip('If your first try is not prime, move on to the next prime: 5, 7, 11, and so on. Any correct pair is marked right.')}`
  });
})();

/* Help panels for 2G to 2K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 2G Squares and square roots
    // =====================================================================
    // 2G Q1, Q2: squaring a number
    '2g-square': `
      <p class="hp-tag">Worked example: <b>24²</b></p>
      ${steps(
        `<p><strong>The little ² means "times itself".</strong> It is not "times 2".</p>
         ${sum('24² = 24 × 24')}`,
        `<p><strong>Multiply.</strong> Split one 24 into 20 and 4 if that helps.</p>
         ${area('24', [['20', '24 × 20 = 480', 5], ['4', '24 × 4 = 96', 1.4]])}
         ${sum('480 + 96 = 576')}
         ${ans('576')}`
      )}
      <p><strong>Numbers ending in zeros?</strong> Square the front part, then write twice as many zeros. 24² = 576, so 240² = 57600 (one zero becomes two).</p>
      ${tip('Squaring is not doubling. 24² is 24 × 24, not 24 × 2.')}`,

    // 2G Q3, Q4: square roots
    '2g-root': `
      <p class="hp-tag">Worked example: <b>√529</b></p>
      ${steps(
        `<p><strong>Turn it into a squaring question.</strong> √ asks: which number, times itself, makes 529?</p>
         ${sum('? × ? = 529')}`,
        `<p><strong>Guess and check.</strong></p>
         ${sum('24 × 24 = 576 (too big)<br>23 × 23 = 529 ✓')}
         ${ans('23')}`
      )}
      ${flow(['Square', '23 → 529'], ['Square root', '529 → 23'])}
      <p><strong>Zeros on the end?</strong> Still ask which number, times itself, makes it. You know 23 × 23 = 529, so try 230: 230 × 230 = 52900 ✓. So √52900 = 230.</p>
      ${tip('Squaring and square-rooting undo each other. Learn the squares up to 15² by heart and most roots become instant.')}`,

    // 2G Q5, Q8: which two whole numbers a square root sits between
    '2g-between': `
      <p class="hp-tag">Worked example: <b>√550</b> is between which two whole numbers?</p>
      ${steps(
        `<p><strong>Find the square numbers either side of 550.</strong></p>
         ${sum('23² = 529 (just under 550)<br>24² = 576 (just over 550)')}
         ${chips(['529 = 23²'], ['550', 'add'], ['576 = 24²'])}`,
        `<p><strong>The square root sits between their roots.</strong></p>
         ${ans('23, 24')}`
      )}
      <p><strong>"What whole number does it start with?"</strong> √550 is between 23 and 24, so it is 23 point something. It starts with 23.</p>
      ${tip('Type the smaller number first, then a comma, then the bigger one.')}`,

    // 2G Q6: mixing squares, roots and other operations
    '2g-mixed': `
      <ol class="hp-ladder">
        <li><b>Brackets</b> first (a √ over a sum counts as brackets)</li>
        <li><b>Squares and roots</b> next</li>
        <li><b>× and ÷</b>, then <b>+ and −</b></li>
      </ol>
      <p class="hp-tag">Worked example: <b>2 × 24² − √529</b></p>
      ${steps(
        `<p><strong>Do the square and the root first.</strong></p>
         ${sum(`2 × ${now('24²')} − ${now('√529')}`)}
         ${sum('2 × 576 − 23')}`,
        `<p><strong>Then ×, then −.</strong></p>
         ${sum(`${now('2 × 576')} − 23`)}
         ${sum('1152 − 23 = 1129')}
         ${ans('1129')}`
      )}
      <p><strong>A √ over a whole sum?</strong> Finish everything under it first: √(600 − 24) = √576 = 24.</p>
      ${tip('Square before you multiply. 2 × 24² is 2 × 576, not 48².')}`,

    // 2G Q7: square patio problems
    '2g-patio': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A square courtyard is paved with <span class="hp-hl">784</span> square pavers. What is its <span class="hp-kw">perimeter</span>, in paver lengths?</p>
      ${steps(
        `<p><strong>A square has the same number of pavers along each side.</strong> So find the number that times itself makes 784.</p>
         ${sum('27 × 27 = 729 (too small)<br>28 × 28 = 784 ✓')}`,
        `<p><strong>Each side is 28 pavers long.</strong> A square has 4 sides.</p>
         ${sum('4 × 28 = 112')}
         ${ans('112')}`
      )}
      ${tip('Read what is asked. "How long is each side?" is the square root. "Perimeter" is 4 times that.')}`,

    // 2G Q9: listing the squares in a range
    '2g-list': `
      <p class="hp-tag">Worked example: list the square numbers between <b>1000</b> and <b>1200</b>.</p>
      ${steps(
        `<p><strong>Find the first square that is big enough.</strong> Make a guess and adjust.</p>
         ${sum('31² = 961 (too small)<br>32² = 1024 ✓')}`,
        `<p><strong>Square the next numbers until you go past the end.</strong></p>
         ${sum('33² = 1089 ✓<br>34² = 1156 ✓<br>35² = 1225 (too big, stop)')}
         ${ans('1024, 1089, 1156')}`
      )}
      ${tip('Type them from smallest to biggest, separated by commas.')}`,

    // 2G Q10: two squares that add to, or differ by, a number
    '2g-twosq': `
      <p class="hp-tag">Worked example: find two square numbers that add to <b>52</b>.</p>
      ${steps(
        `<p><strong>List the square numbers below 52.</strong></p>
         ${chips(['1'], ['4'], ['9'], ['16'], ['25'], ['36'], ['49'])}`,
        `<p><strong>Take each one away from 52.</strong> Is what is left also a square?</p>
         ${sum('52 − 49 = 3 ✗<br>52 − 36 = 16 ✓')}
         ${ans('16, 36')}`
      )}
      <p><strong>For a difference, add instead.</strong> Two squares with a difference of 27: add 27 to each square until you land on another square. 9 + 27 = 36, so the answer is 9, 36.</p>
      ${tip('Check your pair: 16 + 36 = 52. Type the two numbers with a comma between.')}`,

    // 2G Q11: squaring by splitting into tens and ones
    '2g-split': `
      <p class="hp-tag">Worked example: <b>81²</b></p>
      ${steps(
        `<p><strong>Split 81 into 80 + 1.</strong> A square of side 81 breaks into four pieces.</p>
         ${fig({ kind: 'table', rows: [['×', '80', '1'], ['80', '6400', '80'], ['1', '80', '1']] })}`,
        `<p><strong>Work out each piece.</strong> The two middle pieces are the same.</p>
         ${sum('80 × 80 = 6400<br>2 × 80 × 1 = 160<br>1 × 1 = 1')}`,
        `<p><strong>Add the pieces.</strong></p>
         ${sum('6400 + 160 + 1 = 6561')}
         ${ans('6561')}`
      )}
      ${tip('Do not forget the middle part. 81² is not 6400 + 1: the two strips of 80 count too.')}`,

    // 2G Q12: a² × b² = (a × b)²
    '2g-rule': `
      <p class="hp-tag">Worked example: check that <b>3² × 8² = 24²</b>.</p>
      ${steps(
        `<p><strong>Work out the left side.</strong> Squares first, then multiply.</p>
         ${sum('3² × 8² = 9 × 64 = 576')}`,
        `<p><strong>Work out the right side.</strong></p>
         ${sum('24² = 576 ✓')}`,
        `<p><strong>Match it to the rule a² × b² = (a × b)².</strong> The numbers being squared on the left are a and b.</p>
         ${sum('a = 3, b = 8, and 3 × 8 = 24')}
         ${ans('3, 8')}`
      )}
      ${tip('This rule lets you square a big number by squaring two small ones and multiplying.')}`,

    // 2G Q13: patterns in squares like 99², 999²
    '2g-pattern': `
      <p class="hp-tag">Worked example: find <b>101²</b> and <b>1001²</b>, then predict <b>10001²</b>.</p>
      ${steps(
        `<p><strong>Work out the first ones.</strong> Times by 100 (or 1000), then add one more lot.</p>
         ${sum('101 × 101 = 10100 + 101 = 10201<br>1001 × 1001 = 1001000 + 1001 = 1002001')}`,
        `<p><strong>Spot the pattern.</strong> A 1, then a 2, then a 1, with the zeros growing by one each time.</p>
         ${chips(['10201'], ['1002001'], ['100020001', 'add'])}
         ${ans('100020001')}`
      )}
      ${tip('Line the answers up under each other. Patterns are easier to see that way. Then check your prediction.')}`,

    // 2G Q14: differences between square numbers
    '2g-diff': `
      <p class="hp-tag">Worked example: the pattern n × (n + 1). What is the difference between one term and the next?</p>
      ${steps(
        `<p><strong>Make a table and fill in a difference row.</strong> Each difference is the next term take away this one.</p>
         ${fig({ kind: 'table', rows: [['n', '1', '2', '3', '4', '5'], ['n × (n + 1)', '2', '6', '12', '20', '30'], ['difference', '-', '4', '6', '8', '10']] })}`,
        `<p><strong>Look for a rule in the differences.</strong> The difference after term n is 2n + 2. Check it: after n = 3, the difference is 2 × 3 + 2 = 8 ✓.</p>`,
        `<p><strong>Use the rule instead of the big numbers.</strong> The difference between 20 × 21 and 21 × 22 is:</p>
         ${sum('2 × 20 + 2 = 42')}
         ${ans('42')}`
      )}
      ${tip('Check your rule on a pair from the table before you use it on big numbers.')}`,

    // =====================================================================
    // 2H Number patterns
    // =====================================================================
    // 2H Q1, Q2: patterns with a common difference
    '2h-diff': `
      <p class="hp-tag">Worked example: find the next three terms of <b>17, 25, 33</b>.</p>
      ${steps(
        `<p><strong>Find the gap between neighbours.</strong> Check it is the same every time.</p>
         ${sum('25 − 17 = 8<br>33 − 25 = 8')}`,
        `<p><strong>Keep adding the gap.</strong></p>
         ${flow(['Last', '33'], ['+ 8', '41'], ['+ 8', '49'], ['+ 8', '57'])}
         ${ans('41, 49, 57')}`
      )}
      <p><strong>Going down?</strong> Then the gap is taken away. 80, 71, 62 goes down by 9, so next come 53, 44, 35.</p>
      ${tip('Type the three numbers in order, separated by commas.')}`,

    // 2H Q3, Q11: common ratio (and testing for difference and ratio)
    '2h-ratio': `
      <p class="hp-tag">Worked example: find the next three terms of <b>2, 10, 50</b>.</p>
      ${steps(
        `<p><strong>The gaps are not the same</strong> (8, then 40). So divide each term by the one before it.</p>
         ${sum('10 ÷ 2 = 5<br>50 ÷ 10 = 5')}`,
        `<p><strong>Keep multiplying by that number.</strong> It is called the common ratio.</p>
         ${flow(['Last', '50'], ['× 5', '250'], ['× 5', '1250'], ['× 5', '6250'])}
         ${ans('250, 1250, 6250')}`
      )}
      <p><strong>Getting smaller?</strong> Divide instead. 5000, 1000, 200 is ÷ 5 each time, so the next term is 40.</p>
      ${tip('Two tests: take away neighbours to find a common difference, and divide neighbours to find a common ratio. Try both tests on any pattern.')}`,

    // 2H Q4: missing terms
    '2h-missing': `
      <p class="hp-tag">Worked example: <b>7, ___, 23, ___, ___, 47</b></p>
      ${steps(
        `<p><strong>Find two known terms and count the jumps between them.</strong> From 23 to 47 there are 3 jumps.</p>
         ${sum('47 − 23 = 24<br>24 ÷ 3 = 8, so each jump is + 8')}`,
        `<p><strong>Fill the gaps</strong> and check you land on the numbers you were given.</p>
         ${flow(['', '7'], ['+ 8', '15'], ['+ 8', '23'], ['+ 8', '31'], ['+ 8', '39'], ['+ 8', '47'])}
         ${ans('15, 31, 39')}`
      )}
      <p><strong>Multiplying patterns work the same way.</strong> In 5, ___, 80, 320 the jump is 320 ÷ 80 = 4, so the gap is 5 × 4 = 20.</p>
      ${tip('Type only the missing numbers, in order from left to right.')}`,

    // 2H Q5: other sequences (changing gaps, two patterns taking turns)
    '2h-other': `
      <p class="hp-tag">Worked example: find the next three terms of <b>1, 4, 10, 19</b>.</p>
      ${steps(
        `<p><strong>Write the gaps underneath.</strong> They are not the same, but they make their own pattern.</p>
         ${chips(['+ 3'], ['+ 6'], ['+ 9'])}
         <p>The gaps go up by 3 each time, so the next gaps are + 12, + 15, + 18.</p>`,
        `<p><strong>Add on the new gaps.</strong></p>
         ${flow(['Last', '19'], ['+ 12', '31'], ['+ 15', '46'], ['+ 18', '64'])}
         ${ans('31, 46, 64')}`
      )}
      <p><strong>Jumping up and down?</strong> It may be two patterns taking turns. In 2, 30, 4, 27, 6, 24 the odd places go + 2 and the even places go − 3, so next come 8, 21, 10.</p>
      ${tip('Still stuck? Check whether it is a special list, like the prime numbers.')}`,

    // 2H Q6: special number sequences
    '2h-special': `
      <p>Some sequences have names. Learn to spot them.</p>
      ${chips(['Square numbers: 1 × 1, 2 × 2, 3 × 3, ...'], ['Cube numbers: 1 × 1 × 1, 2 × 2 × 2, ...'], ['Prime numbers: exactly two factors'], ['Composite numbers: more than two factors'], ['Fibonacci: add the last two terms'])}
      <p class="hp-tag">Worked example: find the next three terms of <b>2, 2, 4, 6, 10, 16</b>.</p>
      ${steps(
        `<p><strong>Test the gaps first.</strong> 0, 2, 2, 4, 6: no common difference. But each gap matches a term, so try adding the two terms before.</p>
         ${sum('4 + 6 = 10 ✓<br>6 + 10 = 16 ✓')}`,
        `<p><strong>Keep going.</strong></p>
         ${sum('10 + 16 = 26<br>16 + 26 = 42<br>26 + 42 = 68')}
         ${ans('26, 42, 68')}`
      )}
      ${tip('For primes and composites, list the next whole numbers and test each one for factors.')}`,

    // 2H Q7: challenging patterns with two rules
    '2h-mixed': `
      <p class="hp-tag">Worked example: find the next three terms of <b>3, 6, 4, 8, 6, 12</b>.</p>
      ${steps(
        `<p><strong>Look at what happens at each step.</strong> No single rule works, so look for two rules taking turns.</p>
         ${flow(['', '3'], ['× 2', '6'], ['− 2', '4'], ['× 2', '8'], ['− 2', '6'], ['× 2', '12'])}`,
        `<p><strong>Carry on taking turns.</strong> The last step was × 2, so − 2 comes next.</p>
         ${flow(['Last', '12'], ['− 2', '10'], ['× 2', '20'], ['− 2', '18'])}
         ${ans('10, 20, 18')}`
      )}
      ${tip('Also check whether the gaps grow: + 4, + 5, + 6 means the next gap is + 7.')}`,

    // 2H Q8, Q12: adding up a sequence
    '2h-sum': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Cans are stacked with <span class="hp-hl">1</span> can in the top row, and one more in each row below. The bottom row has <span class="hp-hl">10</span> cans. How many cans are there <span class="hp-kw">altogether</span>?</p>
      ${steps(
        `<p><strong>Pair the first and last, then the second and second last.</strong> Every pair adds to the same total.</p>
         ${chips(['1 + 10 = 11'], ['2 + 9 = 11'], ['3 + 8 = 11'], ['4 + 7 = 11'], ['5 + 6 = 11'])}`,
        `<p><strong>Count the pairs and multiply.</strong> 10 numbers make 5 pairs.</p>
         ${sum('5 × 11 = 55')}
         ${ans('55')}`
      )}
      <p><strong>Works for any steady jump.</strong> 3 + 7 + 11 + 15 + 19 + 23 + 27 + 31 has 8 numbers, so 4 pairs. Each pair is 3 + 31 = 34, so the total is 4 × 34 = 136.</p>
      ${tip('Count the numbers carefully. The number of pairs is half the number of terms.')}`,

    // 2H Q9: numbered seats in rows
    '2h-seats': `
      <p class="hp-tag">Worked example: seats numbered in rows of 6.</p>
      ${fig({ kind: 'table', rows: [['Row 3', 13, 14, 15, 16, 17, 18], ['Row 2', 7, 8, 9, 10, 11, 12], ['Row 1', 1, 2, 3, 4, 5, 6]] })}
      ${steps(
        `<p><strong>Directly above means one row up</strong>, so add one row's worth. The seat above 9 is 9 + 6 = 15.</p>`,
        `<p><strong>The right end of each row is a times-table number.</strong> Row 7 ends at 6 × 7 = 42.</p>
         ${sum('Left end of row 8: 42 + 1 = 43<br>Third seat from the right in row 7: 42, 41, 40')}`,
        `<p><strong>Total seats = rows × seats in a row.</strong> For 25 rows:</p>
         ${sum('25 × 6 = 150')}
         ${ans('150')}`
      )}
      ${tip('Draw the next row or two yourself to check you have the pattern right.')}`,

    // 2H Q10: digits of a sequence run together
    '2h-digits': `
      <p class="hp-tag">Worked example: find the next four numbers in <b>7, 1, 4, 2, 1, 2, 8, 3, 5</b>.</p>
      ${steps(
        `<p><strong>Try joining digits together</strong> to see if they make bigger numbers you know.</p>
         ${chips(['7'], ['14'], ['21'], ['28'], ['35'])}
         <p>They are the multiples of 7, written one digit at a time.</p>`,
        `<p><strong>Write the next multiples, then split them into digits.</strong> Next are 42 and 49.</p>
         ${ans('4, 2, 4, 9')}`
      )}
      ${tip('Try the special sequences you know: squares, cubes, primes and times tables.')}`,

    // 2H Q13: high fives (everyone with everyone)
    '2h-handshake': `
      <p class="hp-tag">Worked example: <b>5</b> friends each shake hands once with every other friend. How many handshakes?</p>
      ${fig({ kind: 'sticks', unit: 22, stages: [[[2, 4, 0.098, 2.618], [2, 4, 0.824, 0.382], [2, 4, 3.176, 0.382], [2, 4, 3.902, 2.618], [0.098, 2.618, 0.824, 0.382], [0.098, 2.618, 3.176, 0.382], [0.098, 2.618, 3.902, 2.618], [0.824, 0.382, 3.176, 0.382], [0.824, 0.382, 3.902, 2.618], [3.176, 0.382, 3.902, 2.618]]], labels: ['5 people, one line per handshake'] })}
      ${steps(
        `<p><strong>Each person shakes hands with everyone except themselves.</strong></p>
         ${sum('5 people × 4 handshakes each = 20')}`,
        `<p><strong>Every handshake has been counted twice</strong> (once for each person in it), so halve it.</p>
         ${sum('20 ÷ 2 = 10')}
         ${ans('10')}`
      )}
      ${tip('To write a rule with a letter, do the same working with n people. Each person shakes hands with one fewer than n.')}`,

    // 2H Q14: mystery number clues
    '2h-clues': `
      <p class="hp-tag">Worked example: I have three digits. I am divisible by 10. My digits add to 9. My hundreds digit is double my tens digit.</p>
      ${steps(
        `<p><strong>Start with the clue that rules out the most.</strong> Divisible by 10 means the last digit is 0.</p>
         ${sum('_ _ 0')}`,
        `<p><strong>Try the pairs that fit the next clues.</strong> Hundreds is double tens, and they add to 9.</p>
         ${chips(['tens 1, hundreds 2: adds to 3 ✗'], ['tens 2, hundreds 4: adds to 6 ✗'], ['tens 3, hundreds 6: adds to 9 ✓', 'add'])}`,
        `<p><strong>Check every clue.</strong> 630 has three digits, ends in 0, and 6 + 3 + 0 = 9.</p>
         ${ans('630')}`
      )}
      ${tip('Make a short list of possible numbers, then cross them off one clue at a time.')}`,

    // =====================================================================
    // 2I Spatial patterns
    // =====================================================================
    // 2I Q1, Q2: counting sticks in a growing pattern
    '2i-count': `
      <p class="hp-tag">Worked example: a row of squares with a flagpole.</p>
      ${fig({ kind: 'sticks', stages: [[[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1], [1, 0, 1, 1], [0, 1, 0, 2]], [[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1], [1, 0, 1, 1], [0, 1, 0, 2], [1, 0, 2, 0], [1, 1, 2, 1], [2, 0, 2, 1]], [[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1], [1, 0, 1, 1], [0, 1, 0, 2], [1, 0, 2, 0], [1, 1, 2, 1], [2, 0, 2, 1], [2, 0, 3, 0], [2, 1, 3, 1], [3, 0, 3, 1]]], labels: ['Shape 1', 'Shape 2', 'Shape 3'] })}
      ${steps(
        `<p><strong>Count the sticks in each shape.</strong> Tick them off as you go so none are counted twice.</p>
         ${chips(['Shape 1: 5'], ['Shape 2: 8'], ['Shape 3: 11'])}`,
        `<p><strong>Find how many more each new shape needs.</strong> A new square shares a wall, so it needs only 3 sticks.</p>
         ${sum('8 − 5 = 3<br>11 − 8 = 3')}`,
        `<p><strong>Keep adding 3.</strong></p>
         ${sum('Shape 4: 11 + 3 = 14<br>Shape 5: 14 + 3 = 17')}
         ${ans('5, 8, 11, 14, 17')}`
      )}
      ${tip('Picture the next shape before you count. Only the new part is added each time.')}`,

    // 2I Q3 to Q6: table, rule and predictions
    '2i-rule': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Café tables seat 3 people along each long side and 1 at each end. Tables are pushed together end to end, so the touching ends cannot be used.</p>
      ${fig({ kind: 'sticks', unit: 12, stages: [[[0, 0, 3, 0], [0, 1, 3, 1], [0, 0, 0, 1], [3, 0, 3, 1]], [[0, 0, 6, 0], [0, 1, 6, 1], [0, 0, 0, 1], [3, 0, 3, 1], [6, 0, 6, 1]], [[0, 0, 9, 0], [0, 1, 9, 1], [0, 0, 0, 1], [3, 0, 3, 1], [6, 0, 6, 1], [9, 0, 9, 1]]], labels: ['1 table', '2 tables', '3 tables'] })}
      ${steps(
        `<p><strong>Fill in a table of values.</strong> Each extra table adds 6 seats.</p>
         ${fig({ kind: 'table', rows: [['Number of tables', 1, 2, 3, 4, 5], ['Number of people', 8, 14, 20, 26, 32]] })}`,
        `<p><strong>Write the rule.</strong> Up 6 each time, so start with 6 × n. For 1 table that gives 6, but we need 8, so add 2.</p>
         ${sum('people = 6n + 2<br>Check 3 tables: 6 × 3 + 2 = 20 ✓')}`,
        `<p><strong>Use the rule to predict.</strong> For 15 tables:</p>
         ${sum('6 × 15 + 2 = 92')}
         ${ans('92')}`
      )}
      <p><strong>Going backwards?</strong> For 62 people, undo the rule: 62 − 2 = 60, then 60 ÷ 6 = 10 tables.</p>
      ${tip('Type rules like 6n+2. If going backwards does not divide exactly, think about the story: everyone needs a seat, so round up; only so many pieces, so round down.')}`,

    // 2I Q7, Q8: choosing the rule that fits a pattern
    '2i-choose': `
      <p class="hp-tag">Worked example: which rule fits this pattern?</p>
      ${fig({ kind: 'sticks', stages: [[[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1], [1, 0, 1, 1]], [[0, 0, 1, 0], [1, 0, 2, 0], [0, 1, 1, 1], [1, 1, 2, 1], [0, 0, 0, 1], [2, 0, 2, 1]], [[0, 0, 1, 0], [1, 0, 2, 0], [2, 0, 3, 0], [0, 1, 1, 1], [1, 1, 2, 1], [2, 1, 3, 1], [0, 0, 0, 1], [3, 0, 3, 1]]], labels: ['Length 1', 'Length 2', 'Length 3'] })}
      ${chips(['Sticks = 4 × length'], ['Sticks = 2 × length + 2'], ['Sticks = length + 3'])}
      ${steps(
        `<p><strong>Count the sticks.</strong> 4, then 6, then 8.</p>`,
        `<p><strong>Test every rule on shape 1.</strong> All three give 4, so shape 1 is not enough.</p>
         ${sum('4 × 1 = 4 ✓<br>2 × 1 + 2 = 4 ✓<br>1 + 3 = 4 ✓')}`,
        `<p><strong>Test again on shape 2</strong>, which has 6 sticks.</p>
         ${sum('4 × 2 = 8 ✗<br>2 × 2 + 2 = 6 ✓<br>2 + 3 = 5 ✗')}
         ${ans('Sticks = 2 × length + 2')}`
      )}
      ${tip('Always test at least two shapes. Then check the winner on a third: 2 × 3 + 2 = 8 ✓.')}`,

    // 2I Q9, Q10: using a rule y = m × x + n
    '2i-formula': `
      <p class="hp-tag">Worked example: a pattern of kites follows the rule <b>y = 4 × x + 6</b>, where y is the number of sticks and x is the number of kites.</p>
      ${steps(
        `<p><strong>Put the number of kites in place of x.</strong></p>
         ${sum('1 kite: 4 × 1 + 6 = 10 sticks<br>15 kites: 4 × 15 + 6 = 66 sticks')}`,
        `<p><strong>For a letter, swap it in the same way.</strong> k kites need 4 × k + 6 sticks.</p>
         ${ans('4k+6')}`,
        `<p><strong>Going backwards, undo the rule in reverse.</strong> How many kites from 74 sticks?</p>
         ${sum('74 − 6 = 68<br>68 ÷ 4 = 17 kites')}`
      )}
      <p><strong>What do the numbers mean?</strong> The 4 is the extra sticks for each new kite. The 6 is added once, however many kites there are.</p>
      ${tip('Check a backwards answer by putting it into the rule: 4 × 17 + 6 = 74 ✓.')}`,

    // 2I Q11: a pattern whose gaps keep growing (circle cuts)
    '2i-cuts': `
      <p class="hp-tag">Worked example: dots arranged in triangles.</p>
      ${fig({ kind: 'dots', stages: [[[0, 0]], [[0, 0], [1, 0], [0.5, 0.866]], [[0, 0], [1, 0], [2, 0], [0.5, 0.866], [1.5, 0.866], [1, 1.732]], [[0, 0], [1, 0], [2, 0], [3, 0], [0.5, 0.866], [1.5, 0.866], [2.5, 0.866], [1, 1.732], [2, 1.732], [1.5, 2.598]]], labels: ['1 row', '2 rows', '3 rows', '4 rows'] })}
      ${steps(
        `<p><strong>Make a table with a difference row.</strong> The gaps grow by 1 each time.</p>
         ${fig({ kind: 'table', rows: [['Rows', 1, 2, 3, 4, 5, 6], ['Dots', 1, 3, 6, 10, 15, 21], ['Difference', '-', 2, 3, 4, 5, 6]] })}`,
        `<p><strong>Continue the pattern</strong> by adding the next gap each time. For 9 rows:</p>
         ${sum('21 + 7 = 28<br>28 + 8 = 36<br>36 + 9 = 45')}`,
        `<p><strong>For big numbers, use the rule.</strong> Here dots = 1/2 × rows² + 1/2 × rows. For 20 rows:</p>
         ${sum('1/2 × 400 + 1/2 × 20 = 200 + 10 = 210')}
         ${ans('210')}`
      )}
      ${tip('Do the square first, then halve it. Halving an odd number gives a .5, and the two halves join back up into a whole number.')}`,

    // =====================================================================
    // 2J Tables and rules
    // =====================================================================
    // 2J Q1, Q2, Q3, Q8: completing a table from a rule
    '2j-fill': `
      <p class="hp-tag">Worked example: <b>output = (2 × input) + 5</b></p>
      ${fig({ kind: 'table', rows: [['input', 4, 9, 15, 0], ['output', '?', '?', '?', '?']] })}
      ${steps(
        `<p><strong>Put each input through the rule</strong>, one column at a time. Brackets first.</p>
         ${flow(['input', '9'], ['× 2', '18'], ['+ 5', '23'])}`,
        `<p><strong>Do the same for every input.</strong></p>
         ${sum('2 × 4 + 5 = 13<br>2 × 15 + 5 = 35<br>2 × 0 + 5 = 5')}
         ${ans('13, 23, 35, 5')}`
      )}
      <p><strong>Input × input?</strong> Multiply the input by itself first. For output = input × input + 5 and input 11: 11 × 11 = 121, then 121 + 5 = 126.</p>
      ${tip('Keep the outputs in the same order as the inputs, left to right, separated by commas.')}`,

    // 2J Q4, Q5, Q9: finding a one-step rule
    '2j-find': `
      <p class="hp-tag">Worked example: find the rule.</p>
      ${fig({ kind: 'table', rows: [['input', 2, 5, 6, 9, 11], ['output', 14, 35, 42, 63, 77]] })}
      ${steps(
        `<p><strong>Look at the first column.</strong> 2 becomes 14. That could be + 12, or × 7.</p>`,
        `<p><strong>Test both on another column.</strong></p>
         ${sum('5 + 12 = 17 ✗<br>5 × 7 = 35 ✓')}`,
        `<p><strong>Check the rule on every column.</strong> 9 × 7 = 63 ✓ and 11 × 7 = 77 ✓.</p>
         ${ans('7n')}`
      )}
      ${tip('Type 7n for times, n+7 for plus, n-7 for minus and n/7 for divide. For x and y tables type y=7x. If the outputs grow faster and faster, try input × input and see what is left over.')}`,

    // 2J Q6, Q7: rule, missing outputs and missing inputs
    '2j-gaps': `
      <p class="hp-tag">Worked example: find the rule, then fill the gaps.</p>
      ${fig({ kind: 'table', rows: [['input', 2, 5, 10, '?', '?'], ['output', 16, 40, '?', 56, 96]] })}
      ${steps(
        `<p><strong>Find the rule from a complete column, then check another.</strong> 2 to 16 could be + 14 or × 8.</p>
         ${sum('5 + 14 = 19 ✗<br>5 × 8 = 40 ✓, so the rule is 8n')}`,
        `<p><strong>Missing output: use the rule forwards.</strong></p>
         ${sum('10 × 8 = 80')}`,
        `<p><strong>Missing input: go backwards</strong>, doing the opposite operation.</p>
         ${sum('56 ÷ 8 = 7<br>96 ÷ 8 = 12')}
         ${ans('7, 12')}`
      )}
      ${tip('Backwards, × becomes ÷ and + becomes −. Type the missing numbers in order from left to right.')}`,

    // 2J Q10: could this be the rule?
    '2j-could': `
      <p class="hp-tag">Worked example: an input of <b>5</b> gives an output of <b>13</b>. Which of these could be the rule?</p>
      ${steps(
        `<p><strong>Put 5 into each rule.</strong> Does it give 13?</p>
         ${sum('2 × input + 3: 2 × 5 + 3 = 13 ✓<br>input + 8: 5 + 8 = 13 ✓<br>3 × input − 1: 3 × 5 − 1 = 14 ✗')}`,
        `<p><strong>Every rule that gives 13 is possible.</strong></p>
         ${ans('The first two could be the rule. The third could not.')}`
      )}
      ${tip('Can you invent another rule that turns 5 into 13? And another? Think about how many you could make.')}`,

    // 2J Q11: reverse rules
    '2j-reverse': `
      <p class="hp-tag">Worked example: find the reverse of <b>output = 2 × input + 9</b>.</p>
      ${steps(
        `<p><strong>Write the rule as a chain of steps.</strong></p>
         ${flow(['input', 'n'], ['first', '× 2'], ['then', '+ 9'], ['output', ''])}`,
        `<p><strong>Go back along the chain.</strong> Undo the last step first, using the opposite operation.</p>
         ${flow(['start', 'n'], ['first', '− 9'], ['then', '÷ 2'], ['back to', 'input'])}
         ${ans('(n-9)/2')}`
      )}
      <p><strong>Check with a number.</strong> Input 5 gives 2 × 5 + 9 = 19. The reverse: 19 − 9 = 10, then 10 ÷ 2 = 5 ✓.</p>
      ${tip('Use brackets to show what is done first: (n-9)/2. A rule ending in ÷ 4 − 1 reverses to + 1 then × 4, typed 4(n+1).')}`,

    // 2J Q12: finding a two-step rule
    '2j-two': `
      <p class="hp-tag">Worked example: find the rule.</p>
      ${fig({ kind: 'table', rows: [['input', 1, 2, 3, 4, 5], ['output', 4, 11, 18, 25, 32]] })}
      ${steps(
        `<p><strong>How much does the output go up for each step of the input?</strong> Here it is 7 every time, so the rule starts with 7n.</p>`,
        `<p><strong>Compare 7n with the real output.</strong></p>
         ${sum('7 × 1 = 7, but the output is 4<br>7 − 3 = 4, so take away 3')}`,
        `<p><strong>Check another column.</strong> 7 × 4 − 3 = 25 ✓.</p>
         ${ans('7n-3')}`
      )}
      <p><strong>Inputs jumbled up?</strong> Compare two columns. If input 2 gives 11 and input 5 gives 32, the output went up 21 while the input went up 3, so 21 ÷ 3 = 7 per step.</p>
      ${tip('If the outputs grow more slowly than the inputs, try dividing first, like n/4+1.')}`,

    // =====================================================================
    // 2K The Cartesian plane and graphs
    // =====================================================================
    // 2K Q1, Q2: which letter is at these coordinates?
    '2k-read': `
      <p class="hp-tag">Worked example: which letter is at <b>(4, 2)</b>?</p>
      ${fig({ kind: 'plane', x: [0, 6], y: [0, 6], points: { V: [2, 4], W: [4, 2], X: [0, 1], Z: [6, 3] } })}
      ${steps(
        `<p><strong>Start at the origin, O.</strong> The first number tells you how far to go across, along the x-axis: 4.</p>`,
        `<p><strong>The second number tells you how far to go up:</strong> 2. You land on W.</p>
         ${ans('W')}`
      )}
      <p><strong>Order matters.</strong> (2, 4) is a different point: that is V.</p>
      ${tip('Across first, then up: along the corridor, then up the stairs. A 0 first means the point is on the y-axis, like X at (0, 1).')}`,

    // 2K Q3, Q10: writing the coordinates of a point
    '2k-coords': `
      <p class="hp-tag">Worked example: what are the coordinates of <b>T</b>?</p>
      ${fig({ kind: 'plane', x: [0, 6], y: [0, 6], points: { T: [6, 4], N: [2, 0], G: [3, 6] } })}
      ${steps(
        `<p><strong>Look straight down from T to the x-axis.</strong> That is the x-value: 6.</p>`,
        `<p><strong>Look straight across from T to the y-axis.</strong> That is the y-value: 4.</p>`,
        `<p><strong>Write them in brackets, x first.</strong></p>
         ${ans('(6, 4)')}`
      )}
      <p><strong>On an axis?</strong> N sits on the x-axis, so it has gone up 0: N is (2, 0).</p>
      ${tip('Type coordinates with brackets and a comma, like (6,4). Corners of a drawn shape are read the same way.')}`,

    // 2K Q4 to Q8, Q12: table from a rule, then plot the points
    '2k-plot': `
      <p class="hp-tag">Worked example: <b>output = 2 × input + 1</b></p>
      ${steps(
        `<p><strong>Complete the table</strong> by putting each input into the rule.</p>
         ${sum('2 × 0 + 1 = 1<br>2 × 1 + 1 = 3<br>2 × 2 + 1 = 5<br>2 × 3 + 1 = 7')}
         ${fig({ kind: 'table', rows: [['input (x)', 0, 1, 2, 3], ['output (y)', 1, 3, 5, 7]] })}`,
        `<p><strong>Each column is a point (x, y).</strong> Plot them and see if a ruler joins them all.</p>
         ${fig({ kind: 'plane', x: [0, 4], y: [0, 8], points: { '(0, 1)': [0, 1], '(1, 3)': [1, 3], '(2, 5)': [2, 5], '(3, 7)': [3, 7] }, path: [[0, 1], [1, 3], [2, 5], [3, 7]] })}
         ${ans('1, 3, 5, 7. Yes, a straight line.')}`
      )}
      ${tip('Rules that only add, take away or multiply by a number make straight lines. Rules with input × input, or a number divided by the input, make points that curve.')}`,

    // 2K Q9: points where x and y follow a simple link
    '2k-pairs': `
      <p class="hp-tag">Worked example: on a grid from 0 to 6, find every point where the y-value is <b>one more</b> than the x-value.</p>
      ${steps(
        `<p><strong>Go through the x-values in order</strong> and work out the y-value for each.</p>
         ${chips(['(0, 1)'], ['(1, 2)'], ['(2, 3)'], ['(3, 4)'], ['(4, 5)'], ['(5, 6)'])}
         <p>x = 6 would need y = 7, which is off the grid. So there are 6 points.</p>`,
        `<p><strong>Plot them to see the shape.</strong></p>
         ${fig({ kind: 'plane', x: [0, 6], y: [0, 6], points: {}, path: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] })}
         ${ans('6 points, all on a straight line')}`
      )}
      ${tip('To test a labelled point, read its two numbers and compare them. Remember the origin, (0, 0), when you count.')}`,

    // 2K Q11, Q14: the missing corner of a rectangle
    '2k-corner': `
      <p class="hp-tag">Worked example: <b>ABCD</b> is a rectangle with A(2, 4), B(6, 3) and C(7, 7). Find D.</p>
      ${fig({ kind: 'plane', x: [0, 8], y: [0, 8], points: { A: [2, 4], B: [6, 3], C: [7, 7], D: [3, 8] }, path: [[2, 4], [6, 3], [7, 7], [3, 8]], closed: true })}
      ${steps(
        `<p><strong>See how you get from B to C.</strong> Opposite sides of a rectangle match.</p>
         ${sum('B to C: 1 across, 4 up')}`,
        `<p><strong>Make the same move from A.</strong></p>
         ${sum('(2 + 1, 4 + 4) = (3, 8)')}
         ${ans('(3, 8)')}`
      )}
      <p><strong>Straight rectangle?</strong> It is quicker. With A(2, 1), B(2, 5) and C(6, 5), D takes its x from C and its y from A: D is (6, 1).</p>
      ${tip('Sketch the points on a grid first. A door that stands on the floor has two corners with a y-value of 0.')}`,

    // 2K Q13: coded messages using coordinates
    '2k-code': `
      <p class="hp-tag">Worked example: use this grid to decode <b>(1, 2), (3, 1), (2, 4)</b>.</p>
      ${fig({ kind: 'plane', x: [0, 4], y: [0, 4], points: { C: [1, 2], A: [3, 1], T: [2, 4], O: [4, 3] } })}
      ${steps(
        `<p><strong>Find each point in turn</strong>: across, then up.</p>
         ${chips(['(1, 2) → C'], ['(3, 1) → A'], ['(2, 4) → T'])}
         ${ans('CAT')}`,
        `<p><strong>To code a word, go the other way.</strong> COAT is (1, 2), (4, 3), (3, 1), (2, 4).</p>`,
        `<p><strong>Harder code: no brackets or commas, and 00 between words.</strong> Read the digits two at a time.</p>
         ${sum('CAT COAT → 123124 00 12433124')}`
      )}
      ${tip('Type codes as one long run of digits with no spaces. Type decoded words in capitals, with a space between words.')}`,

    // 2K Q15: finding the rule from a graph
    '2k-rule': `
      <p class="hp-tag">Worked example: write the rule for these points.</p>
      ${fig({ kind: 'plane', x: [0, 4], y: [0, 7], points: { A: [0, 0], B: [1, 2], C: [2, 4], D: [3, 6] } })}
      ${steps(
        `<p><strong>Read each point into a table.</strong></p>
         ${fig({ kind: 'table', rows: [['x', 0, 1, 2, 3], ['y', 0, 2, 4, 6]] })}`,
        `<p><strong>Find what turns x into y</strong>, just like a table rule. Each y is double its x. Check: 2 × 3 = 6 ✓.</p>
         ${ans('y = 2x')}`
      )}
      ${tip('Type it like y=2x. If y is smaller than x, try dividing: (4, 2) and (6, 3) fit y=x/2.')}`,

    // 2K Q16: isosceles triangle on a base
    '2k-triangle': `
      <p class="hp-tag">Worked example: A(1, 0) and B(5, 0) are the base of an isosceles triangle with an area of <b>10</b> square units. Find the third corner, C.</p>
      ${fig({ kind: 'plane', x: [0, 6], y: [0, 6], points: { A: [1, 0], B: [5, 0], C: [3, 5] }, path: [[1, 0], [5, 0], [3, 5]], closed: true })}
      ${steps(
        `<p><strong>C is the same distance from A and B</strong>, so it sits straight above the middle of the base.</p>
         ${sum('Middle: (1 + 5) ÷ 2 = 3')}`,
        `<p><strong>Use the area to find the height.</strong> Area = base × height ÷ 2. The base is 4 units long.</p>
         ${sum('4 × 5 ÷ 2 = 10 ✓, so the height is 5')}
         ${ans('(3, 5)')}`
      )}
      ${tip('Without the area clue, any point straight above the middle of the base would work.')}`,

    // 2K Q17: midpoints
    '2k-mid': `
      <p class="hp-tag">Worked example: find the midpoint M of A(1, 2) and B(7, 6).</p>
      ${fig({ kind: 'plane', x: [0, 8], y: [0, 7], points: { A: [1, 2], B: [7, 6], M: [4, 4] }, path: [[1, 2], [7, 6]] })}
      ${steps(
        `<p><strong>The x-value is halfway between the two x-values.</strong> Add them and halve.</p>
         ${sum('(1 + 7) ÷ 2 = 4')}`,
        `<p><strong>Do the same with the y-values.</strong></p>
         ${sum('(2 + 6) ÷ 2 = 4')}
         ${ans('(4, 4)')}`
      )}
      <p><strong>Know M and A, but not B?</strong> Make the same move again. A(1, 2) to M(4, 4) is 3 across and 2 up, so B is 3 across and 2 up from M: (7, 6).</p>
      ${tip('Halves are fine: (3 + 6) ÷ 2 = 4.5, typed as 4.5. Negative numbers work the same way: (−3 + 5) ÷ 2 = 1.')}`
  });
})();
