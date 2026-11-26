/* H3 help panels for Year 10 Chapter 8. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 8A to 8K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers (specs for figures.js) ----
  // Two-circle Venn diagram: circle names, then the numbers for left only, both, right only, outside.
  const venn = (A, B, p, q, r, s) => ({ kind: 'diagram', unit: 30, items: [
    { poly: [[-5, -3], [5, -3], [5, 3.2], [-5, 3.2]] },
    { circle: [-1.2, -0.2, 2.2] }, { circle: [1.2, -0.2, 2.2] },
    { label: A, at: [-1.9, 2.55] }, { label: B, at: [1.9, 2.55] },
    { label: p, at: [-2.2, -0.2] }, { label: q, at: [0, -0.2] }, { label: r, at: [2.2, -0.2] }, { label: s, at: [4.2, -2.5] }] });
  // Two separate circles (mutually exclusive): left number, right number, outside.
  const vennApart = (A, B, p, r, s) => ({ kind: 'diagram', unit: 30, items: [
    { poly: [[-5, -3], [5, -3], [5, 3.2], [-5, 3.2]] },
    { circle: [-2.2, -0.2, 1.8] }, { circle: [2.2, -0.2, 1.8] },
    { label: A, at: [-2.2, 2.3] }, { label: B, at: [2.2, 2.3] },
    { label: p, at: [-2.2, -0.2] }, { label: r, at: [2.2, -0.2] }, { label: s, at: [4.4, -2.5] }] });
  // One circle inside another (B is a subset of A): A only, B, outside.
  const vennInside = (A, B, p, q, s) => ({ kind: 'diagram', unit: 30, items: [
    { poly: [[-5, -3], [5, -3], [5, 3.2], [-5, 3.2]] },
    { circle: [0, -0.1, 2.6] }, { circle: [0.95, -0.5, 1.1] },
    { label: A, at: [-2.2, 2.4] }, { label: B, at: [0.95, 0.95] },
    { label: p, at: [-1.2, -0.3] }, { label: q, at: [0.95, -0.5] }, { label: s, at: [4.2, -2.5] }] });
  // Three-circle Venn diagram: names, then [X only, Y only, Z only, X&Y only, X&Z only, Y&Z only, all three, none].
  const venn3 = (X, Y, Z, n) => ({ kind: 'diagram', unit: 28, items: [
    { poly: [[-5, -4], [5, -4], [5, 3.6], [-5, 3.6]] },
    { circle: [-1.1, 0.6, 2] }, { circle: [1.1, 0.6, 2] }, { circle: [0, -1.25, 2] },
    { label: X, at: [-2.9, 2.9] }, { label: Y, at: [2.9, 2.9] }, { label: Z, at: [-2.5, -3.3] },
    { label: n[0], at: [-2, 1.1] }, { label: n[1], at: [2, 1.1] }, { label: n[2], at: [0, -2.3] },
    { label: n[3], at: [0, 1.75] }, { label: n[4], at: [-1.2, -0.75] }, { label: n[5], at: [1.2, -0.75] },
    { label: n[6], at: [0, 0] }, { label: n[7], at: [4.3, -3.4] }] });
  // Tree diagram: stages = [['H', 'T'], ['1', '2', '3']], or stages[k] can be a function of the path
  // so far. o.prob(path) labels the branch that ends at path.
  const tree = (stages, o = {}) => {
    const items = [], gap = o.gap || 1, w = o.w || 3;
    const kidsOf = (k, path) => (typeof stages[k] === 'function' ? stages[k](path) : stages[k]);
    const count = (k, path) => (k === stages.length ? 1 : kidsOf(k, path).reduce((a, lab) => a + count(k + 1, path.concat(lab)), 0));
    let leaf = count(0, []) - 1;
    const top = leaf * gap;
    const sub = (k, path) => {
      const kids = kidsOf(k, path).map((lab) => {
        const p = path.concat(lab);
        return [lab, k + 1 === stages.length ? (leaf-- * gap) : sub(k + 1, p), p];
      });
      const y = (kids[0][1] + kids[kids.length - 1][1]) / 2;
      const xa = k === 0 ? 0.15 : w * k + 0.42, xb = w * (k + 1) - 0.42;
      kids.forEach(([lab, cy, p]) => {
        items.push({ seg: [xa, y, xb, cy] }, { label: lab, at: [w * (k + 1), cy] });
        if (o.prob) items.push({ label: o.prob(p), at: [(xa + xb) / 2 - 0.1, (y + cy) / 2 + (cy >= y ? 0.42 : -0.42)] });
        if (k + 1 === stages.length && o.outcomes !== false) items.push({ label: p.join(o.join || ''), at: [w * (k + 1) + 2.1, cy] });
      });
      return y;
    };
    sub(0, []);
    (o.heads || []).forEach((h, k) => items.push({ label: h, at: [w * (k + 1), top + gap + 0.2] }));
    if (o.outcomes !== false) items.push({ label: 'Outcome', at: [w * stages.length + 2.1, top + gap + 0.2] });
    return { kind: 'diagram', unit: o.unit || 30, items };
  };
  const table = (rows) => fig({ kind: 'table', rows });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 8A Review of probability
    // =====================================================================
    // y10-8A Q1, Q2: a letter from a word
    // method: Example 1, 8A (Pr = number of favourable outcomes ÷ total number of outcomes)
    'y10-8a-letters': `
      <p class="hp-tag">Worked example: a letter is chosen at random from the word <b>PARALLEL</b>.</p>
      ${steps(
        `<p><strong>Count every letter, repeats included.</strong> PARALLEL has 8 letters, and each one is an equally likely outcome.</p>
         ${chips(['P: 1'], ['A: 2'], ['R: 1'], ['L: 3'], ['E: 1'])}`,
        `<p><strong>Pr(event) = number of favourable outcomes ÷ total number of outcomes.</strong> Simplify if you can.</p>
         ${sum('Pr(L) = 3/8<br>Pr(A) = 2/8 = 1/4')}`,
        `<p><strong>"Not" and "or": count the letters that fit.</strong></p>
         ${sum('Pr(not an L) = 5/8 &nbsp; (5 of the letters are not L)<br>Pr(an A or an L) = (2 + 3)/8 = 5/8<br>Pr(a vowel) = A, A, E → 3/8')}
         ${ans('3/8, 1/4, 5/8, 5/8, 3/8')}`
      )}
      ${tip('Type a probability as a fraction, like 3/8. "Not an L" is the same as 1 − Pr(L): 1 − 3/8 = 5/8.')}`,

    // y10-8A Q3: rolling a die with numbered faces
    // method: Example 1, 8A (count the favourable outcomes, divide by the total)
    'y10-8a-die': `
      <p class="hp-tag">Worked example: a fair 8-sided die numbered 1 to 8 is rolled once.</p>
      ${steps(
        `<p><strong>Write the sample space.</strong> {1, 2, 3, 4, 5, 6, 7, 8}: 8 equally likely outcomes.</p>`,
        `<p><strong>List the outcomes that fit each event, then count.</strong></p>
         ${sum('Odd: {1, 3, 5, 7} → 4/8 = 1/2<br>Less than 4: {1, 2, 3} → 3/8<br>Prime: {2, 3, 5, 7} → 4/8 = 1/2')}`,
        `<p><strong>"Or" and "greater than".</strong></p>
         ${sum('6 or 7: {6, 7} → 2/8 = 1/4<br>Greater than 6: {7, 8} → 2/8 = 1/4')}
         ${ans('1/2, 3/8, 1/2, 1/4, 1/4')}`
      )}
      ${tip('"Less than 4" does not include 4 itself. Remember 1 is not a prime number.')}`,

    // y10-8A Q6, Q7: counters in a box, prizes in a table
    // method: Example 1, 8A (count the favourable outcomes, divide by the total)
    'y10-8a-groups': `
      <p class="hp-tag">Worked example: a counter is chosen at random from a box of 3 red, 4 blue and 5 yellow counters.</p>
      ${steps(
        `<p><strong>Find the total.</strong> Every counter is one equally likely outcome.</p>
         ${sum('3 + 4 + 5 = 12 counters')}`,
        `<p><strong>Pr = number that fit ÷ total, then simplify.</strong></p>
         ${sum('Pr(blue) = 4/12 = 1/3<br>Pr(not yellow) = (3 + 4)/12 = 7/12')}
         <p>No green counters means Pr(green) = 0/12 = 0. A box of only blue counters gives Pr(blue) = 1.</p>`,
        `<p><strong>A table works the same way.</strong> Add the row of numbers to get the total.</p>
         ${table([['Prize', 'scooter', 'book', 'voucher'], ['Number', '2', '13', '35']])}
         ${sum('Total = 2 + 13 + 35 = 50<br>Pr(book) = 13/50<br>Pr(not a scooter) = 48/50 = 24/25')}
         ${ans('1/3, 7/12, 13/50, 24/25')}`
      )}
      ${tip('Type 0 or 1 as a plain number. Every other probability goes in as a fraction, like 7/12.')}`,

    // y10-8A Q4, Q5, Q8, Q9: experimental probability from a frequency table
    // method: Example 2, 8A (Pr = number of times observed ÷ total number of trials)
    'y10-8a-freq': `
      <p class="hp-tag">Worked example: the number of goals a team scored in each of its games.</p>
      ${table([['Number of goals', '0', '1', '2', '3'], ['Frequency', '5', '8', '4', '3']])}
      ${steps(
        `<p><strong>Total number of trials:</strong> add the frequencies.</p>
         ${sum('5 + 8 + 4 + 3 = 20 games')}`,
        `<p><strong>Pr = number of times observed ÷ total number of trials.</strong></p>
         ${sum('Pr(0 goals) = 5/20 = 1/4')}`,
        `<p><strong>Several columns fit? Add their frequencies first.</strong></p>
         ${sum('Pr(fewer than 2) = (5 + 8)/20 = 13/20<br>Pr(at least 1) = (8 + 4 + 3)/20 = 15/20 = 3/4<br>Pr(2 or 3) = (4 + 3)/20 = 7/20')}
         ${ans('1/4, 13/20, 3/4, 7/20')}`
      )}
      ${tip('"Fewer than 2" means 0 or 1. "At least 1" means 1 or more. A fraction or a decimal is fine, like 13/20 or 0.65.')}`,

    // y10-8A Q10: using an experiment to estimate what is in a bag
    // method: Key ideas 8A (experimental probability) and Building understanding Q3 (expected number = probability × number)
    'y10-8a-expected': `
      <p class="hp-tag">Worked example: a counter is drawn from a bag of blue and white counters and put back. This is done 80 times, and 24 of the counters drawn are blue.</p>
      ${steps(
        `<p><strong>The rest are the other colour.</strong></p>
         ${sum('White: 80 − 24 = 56')}`,
        `<p><strong>Experimental probability = times observed ÷ trials.</strong></p>
         ${sum('Pr(blue) ≈ 24/80 = 0.3')}`,
        `<p><strong>Expected number = probability × number of counters.</strong></p>
         ${sum('12 counters: 0.3 × 12 = 3.6 ≈ 4 blue<br>30 counters: 0.3 × 30 = 9 blue')}
         ${ans('56, 4, 9')}`
      )}
      ${tip('A bag cannot hold 3.6 counters, so round to the nearest whole number. The estimate gets better the more trials you do.')}`,

    // y10-8A Q11: a standard deck of cards
    // method: Example 1, 8A (count the favourable outcomes, divide by 52)
    'y10-8a-cards': `
      <p class="hp-tag">Worked example: a card is chosen at random from a standard deck of 52.</p>
      ${steps(
        `<p><strong>Know the deck.</strong> 4 suits of 13. Hearts and diamonds are red; clubs and spades are black. Each suit has one jack, queen and king (the picture cards) and one ace.</p>`,
        `<p><strong>Count the cards that fit, then divide by 52.</strong></p>
         ${sum('Black picture card: 2 suits × 3 = 6 → 6/52 = 3/26<br>Red ace: 2 → 2/52 = 1/26<br>Not a picture card: 52 − 12 = 40 → 40/52 = 10/13')}`,
        `<p><strong>"Or": do not count a card twice.</strong> A heart or a picture card: 13 hearts, plus the 9 picture cards that are not hearts.</p>
         ${sum('13 + 9 = 22 → 22/52 = 11/26<br>Neither: 52 − 22 = 30 → 30/52 = 15/26')}
         ${ans('3/26, 1/26, 10/13, 11/26, 15/26')}`
      )}
      ${tip('"Neither A nor B" is everything left after you count "A or B". Simplify the fraction at the end.')}`,

    // y10-8A Q12: a missing probability, and the smallest possible total
    // method: Example 1c, 8A (the probabilities of all the outcomes add to 1; "not" is 1 − Pr)
    'y10-8a-missing': `
      <p class="hp-tag">Worked example: a jar holds red, green and yellow sweets. Pr(red) = 1/6 and Pr(green) = 3/8.</p>
      ${steps(
        `<p><strong>All the probabilities add to 1.</strong> Yellow is whatever is left.</p>
         ${sum('Pr(yellow) = 1 − 1/6 − 3/8<br>= 24/24 − 4/24 − 9/24 = 11/24')}`,
        `<p><strong>Smallest number of sweets.</strong> Each colour must be a whole number of sweets, so the total must be a number that 6 and 8 both go into. The smallest is 24.</p>
         ${sum('1/6 of 24 = 4 red, 3/8 of 24 = 9 green, 11/24 of 24 = 11 yellow')}
         ${ans('11/24, 24')}`
      )}
      ${tip('Use the lowest common denominator for both parts: it gives the subtraction and the smallest total at the same time.')}`,

    // y10-8A Q13: areas on a target
    // method: Key ideas 8A (Pr = favourable ÷ total), with areas in place of counts
    'y10-8a-area': `
      <p class="hp-tag">Worked example: a target has a centre circle A of radius 4 cm and a ring B that is 4 cm wide. Every point is equally likely to be hit.</p>
      ${fig({ kind: 'diagram', unit: 11, items: [{ circle: [0, 0, 8] }, { circle: [0, 0, 4] }, { label: 'A', at: [0, -1.6] }, { label: 'B', at: [0, -6] }, { seg: [0, 0, 4, 0] }, { seg: [4, 0, 8, 0] }, { label: '4 cm', at: [2, 1.1] }, { label: '4 cm', at: [6, 1.1] }] })}
      ${steps(
        `<p><strong>Find each area with πr².</strong> The whole target has radius 4 + 4 = 8 cm. A ring is the big circle take away the small one.</p>
         ${sum('Total = π × 8² = 64π<br>A = π × 4² = 16π<br>B = 64π − 16π = 48π')}`,
        `<p><strong>Pr = area of the region ÷ total area.</strong> The π cancels.</p>
         ${sum('Pr(A) = 16π/64π = 1/4<br>Pr(B) = 48π/64π = 3/4')}`,
        `<p><strong>"Or" adds the regions:</strong> Pr(A or B) = 1/4 + 3/4 = 1, since every arrow lands somewhere on the target.</p>
         ${ans('64pi, 16pi, 48pi, 1/4, 3/4')}`
      )}
      ${tip('Type exact areas with pi, like 48pi. "Not B" is every region except B.')}`,

    // =====================================================================
    // Year 10 8B Set notation in Venn diagrams and two-way tables
    // =====================================================================
    // y10-8B Q1, Q2, Q7: listing sets, Venn regions, mutually exclusive
    // method: Example 3, 8B (listing sets)
    'y10-8b-list': `
      <p class="hp-tag">Worked example: numbers from the first 9 positive integers. A = {1, 2, 4, 5, 8} and B = {2, 3, 5, 7}.</p>
      ${steps(
        `<p><strong>Venn diagram: start with what is in both.</strong> 2 and 5 are in both. A only: 1, 4, 8. B only: 3, 7. Neither: 6, 9.</p>
         ${fig(venn('A', 'B', '3', '2', '2', '2'))}`,
        `<p><strong>∩ (intersection) is in both. ∪ (union) is in either.</strong></p>
         ${sum('A ∩ B = {2, 5}<br>A ∪ B = {1, 2, 3, 4, 5, 7, 8}')}`,
        `<p><strong>Pr = number of elements ÷ 9.</strong></p>
         ${sum('Pr(A) = 5/9<br>Pr(A ∩ B) = 2/9<br>Pr(A ∪ B) = 7/9')}
         <p>A ∩ B is not empty (A ∩ B ≠ ∅), so A and B are <b>not</b> mutually exclusive. To make them mutually exclusive, remove the shared elements 2 and 5 from A. If nothing is shared, remove nothing (0 elements).</p>
         ${ans('3, 2, 2, 2')}`
      )}
      ${tip('Type sets as elements separated by commas, like 2, 5 (no curly brackets). Type the regions W, X, Y, Z in that order: left only, both, right only, outside.')}`,

    // y10-8B Q3, Q4, Q6, Q10: a Venn diagram from a description
    // method: Example 4, 8B (intersection first, then the other regions)
    'y10-8b-venn-words': `
      <p class="hp-tag">Worked example: of 40 students, 22 play a sport (S), 15 play an instrument (I) and 6 do both.</p>
      ${steps(
        `<p><strong>Write the 6 in the intersection first.</strong> Then take it away from each circle's total.</p>
         ${sum('S only: 22 − 6 = 16<br>I only: 15 − 6 = 9<br>Neither: 40 − 16 − 6 − 9 = 9')}
         ${fig(venn('S', 'I', '16', '6', '9', '9'))}`,
        `<p><strong>Probabilities: add the regions you need, divide by 40.</strong></p>
         ${sum('Pr(I) = 15/40 = 3/8<br>Pr(I only) = 9/40<br>Pr(both) = 6/40 = 3/20<br>Pr(S ∪ I) = (16 + 6 + 9)/40 = 31/40<br>Pr(S′) = (9 + 9)/40 = 18/40 = 9/20')}
         ${ans('16, 6, 9, 9')}`,
        `<p><strong>Nobody outside the circles?</strong> 20 people each own a cat or a dog or both: 13 own a cat, 11 own a dog. 13 + 11 = 24 is 4 more than 20, because the people who own both were counted twice. So 4 own both.</p>`
      )}
      ${tip('Check that the four regions add to the total. S′ (not S) includes the outside region as well as I only.')}`,

    // y10-8B Q5: reading set notation from a Venn diagram
    // method: Example 5, 8B (Venn diagram to two-way table, then read each region)
    'y10-8b-notation': `
      <p class="hp-tag">Worked example: use the Venn diagram.</p>
      ${fig(venn('A', 'B', '6', '3', '5', '4'))}
      ${steps(
        `<p><strong>Move it into a two-way table.</strong> Each region is one inside cell; the rows and columns add up to the totals.</p>
         ${table([['', 'A', 'A′', 'Total'], ['B', '3', '5', '8'], ['B′', '6', '4', '10'], ['Total', '9', '9', '18']])}`,
        `<p><strong>Read each set.</strong> A′ ∩ B is "B only", A ∩ B′ is "A only", A′ ∩ B′ is "neither".</p>
         ${sum('n(A ∩ B) = 3, n(A′ ∩ B) = 5, n(A ∩ B′) = 6, n(A′ ∩ B′) = 4<br>n(A) = 6 + 3 = 9, n(B′) = 6 + 4 = 10<br>n(A ∪ B) = 6 + 3 + 5 = 14, n(ξ) = 18')}`,
        `<p><strong>Probabilities: divide by n(ξ) = 18.</strong></p>
         ${sum('Pr(A ∩ B) = 3/18 = 1/6<br>Pr(A′) = 9/18 = 1/2<br>Pr(A ∩ B′) = 6/18 = 1/3')}
         ${ans('3, 5, 6, 4, 9, 10, 14, 18')}`
      )}
      ${tip('ξ is the whole sample space, so n(ξ) adds all four regions, including the one outside the circles.')}`,

    // y10-8B Q9: completing a two-way table
    // method: Example 5, 8B (two-way table: the inside cells add to the row and column totals)
    'y10-8b-table': `
      <p class="hp-tag">Worked example: complete the table.</p>
      ${table([['', 'A', 'A′', 'Total'], ['B', '6', '', '11'], ['B′', '', '2', ''], ['Total', '', '', '20']])}
      ${steps(
        `<p><strong>Find a row or column with only one gap.</strong> The B row and the Total column each have one.</p>
         ${sum('n(A′ ∩ B) = 11 − 6 = 5<br>n(B′) = 20 − 11 = 9')}`,
        `<p><strong>Keep going.</strong> Now the B′ row has one gap, then the column totals.</p>
         ${sum('n(A ∩ B′) = 9 − 2 = 7<br>n(A) = 6 + 7 = 13, n(A′) = 5 + 2 = 7<br>Check: 13 + 7 = 20 ✓')}
         ${table([['', 'A', 'A′', 'Total'], ['B', '6', '5', '11'], ['B′', '7', '2', '9'], ['Total', '13', '7', '20']])}
         ${ans('5, 7, 9, 13, 7')}`
      )}
      ${tip('Type the values in the order the question asks for them, separated by commas.')}`,

    // y10-8B Q8, Q13: events described in words
    // method: Example 3, 8B (list the elements of each set, then count)
    'y10-8b-words': `
      <p class="hp-tag">Worked example: a letter is chosen at random from <b>BUTTERFLY</b>. C: the letter is in the word TRUE. D: the letter is in the word FLUTE.</p>
      ${steps(
        `<p><strong>List the 9 letters.</strong> B, U, T, T, E, R, F, L, Y. The T appears twice, so it is 2 of the 9 outcomes.</p>`,
        `<p><strong>List the letters in each event.</strong></p>
         ${sum('C: U, T, T, E, R → 5<br>D: U, T, T, E, F, L → 6<br>C and D: U, T, T, E → 4<br>C or D: U, T, T, E, R, F, L → 7<br>Neither: B, Y → 2')}`,
        `<p><strong>Divide each count by 9.</strong></p>
         ${sum('Pr(C) = 5/9, Pr(C ∩ D) = 4/9, Pr(C ∪ D) = 7/9<br>Pr(not C) = 4/9, Pr(neither) = 2/9')}
         ${ans('5/9, 4/9, 7/9, 4/9, 2/9')}`
      )}
      <p><strong>Choices work the same way.</strong> If one person is happy with 3 of 8 colours and another with 4, list each person's colours. "Both happy" is the colours on both lists; "either happy" is every colour on at least one list.</p>
      ${tip('Count repeated letters each time they appear in the word you choose from. Check: Pr(C ∪ D) + Pr(neither) = 1.')}`,

    // y10-8B Q11: mutually exclusive events with letters
    // method: Key ideas 8B (Pr(A′) = 1 − Pr(A); mutually exclusive means A ∩ B = ∅)
    'y10-8b-algebra': `
      <p class="hp-tag">Worked example: A and B are mutually exclusive, with Pr(A) = 0.3 and Pr(B) = 0.45.</p>
      ${steps(
        `<p><strong>Complement:</strong> Pr(not B) = 1 − Pr(B).</p>
         ${sum('Pr(not B) = 1 − 0.45 = 0.55')}`,
        `<p><strong>Mutually exclusive: no overlap.</strong> The circles do not touch, so "or" just adds and "and" is impossible.</p>
         ${sum('Pr(A or B) = 0.3 + 0.45 = 0.75<br>Pr(A and B) = 0')}`,
        `<p><strong>Letters work the same way.</strong> If Pr(A) = m and Pr(B) = n:</p>
         ${sum('Pr(not B) = 1 − n<br>Pr(A or B) = m + n<br>Pr(A and B) = 0')}
         ${ans('1-n, m+n, 0')}`
      )}
      ${tip('Type an expression with the letters the question uses, like 1-n or m+n.')}`,

    // y10-8B Q14, Q15: three-circle Venn diagrams
    // method: no book example (the intersection-first method of Example 4, 8B, with three circles)
    'y10-8b-three': `
      <p class="hp-tag">Worked example: of 30 people, 14 go to the gym (G), 12 swim (S) and 10 run (R). 2 do all three, 5 do G and S, 3 do G and R, and 6 do S and R.</p>
      ${steps(
        `<p><strong>Start in the very middle, then the pairs.</strong> Each pair count includes the 2 who do all three.</p>
         ${sum('G and S only: 5 − 2 = 3<br>G and R only: 3 − 2 = 1<br>S and R only: 6 − 2 = 4')}`,
        `<p><strong>Then each circle on its own, then the outside.</strong></p>
         ${sum('G only: 14 − 3 − 1 − 2 = 8<br>S only: 12 − 3 − 4 − 2 = 3<br>R only: 10 − 1 − 4 − 2 = 3<br>None: 30 − (8 + 3 + 3 + 3 + 1 + 4 + 2) = 30 − 24 = 6')}
         ${fig(venn3('G', 'S', 'R', ['8', '3', '3', '3', '1', '4', '2', '6']))}`,
        `<p><strong>Add the regions you need, divide by 30.</strong></p>
         ${sum('Pr(G) = 14/30 = 7/15<br>Pr(G only) = 8/30 = 4/15<br>Pr(G or S) = (8 + 3 + 1 + 2 + 3 + 4)/30 = 21/30 = 7/10')}
         ${ans('6, 7/15, 4/15, 7/10')}`
      )}
      <p><strong>A region you do not know?</strong> Call it x, write every region you can in terms of x, and make all eight regions add to the total. Here 24 + x = 30 gives x = 6 for the outside region.</p>
      ${tip('"G and S only" means G and S but not R: the region where just those two circles overlap.')}`,

    // =====================================================================
    // Year 10 8C The addition rule
    // =====================================================================
    // y10-8C Q1, Q8: the addition rule with a deck of cards
    // method: Example 6, 8C (applying the addition rule)
    'y10-8c-cards': `
      <p class="hp-tag">Worked example: a card is chosen from a standard deck. A: the card is black. B: the card is an ace or a king.</p>
      ${steps(
        `<p><strong>Count each set.</strong></p>
         ${sum('n(A) = 26, n(B) = 8, n(A ∩ B) = 4 &nbsp; (an ace and a king in each black suit)')}`,
        `<p><strong>Turn counts into probabilities.</strong></p>
         ${sum('Pr(A) = 26/52 = 1/2, Pr(A′) = 1 − 1/2 = 1/2<br>Pr(A ∩ B) = 4/52 = 1/13')}`,
        `<p><strong>Addition rule: Pr(A ∪ B) = Pr(A) + Pr(B) − Pr(A ∩ B).</strong> Take the overlap away once, because it was counted in both.</p>
         ${sum('Pr(A ∪ B) = 26/52 + 8/52 − 4/52 = 30/52 = 15/26')}
         <p><strong>With a "not":</strong> black or not an ace. There are 48 cards that are not aces, and 24 of them are black.</p>
         ${sum('26/52 + 48/52 − 24/52 = 50/52 = 25/26')}
         ${ans('15/26, 25/26')}`
      )}
      ${tip('Work in 52nds until the last line, then simplify. Type the answer as a fraction, like 15/26.')}`,

    // y10-8C Q2, Q3: the addition rule with a set of numbers
    // method: Example 6, 8C (count the sets, then the addition rule)
    'y10-8c-numbers': `
      <p class="hp-tag">Worked example: a number is chosen at random from {1, 2, 3, ..., 20}. A: a multiple of 3. B: a prime number.</p>
      ${steps(
        `<p><strong>List the sets.</strong></p>
         ${sum('A = {3, 6, 9, 12, 15, 18}<br>B = {2, 3, 5, 7, 11, 13, 17, 19}<br>A ∩ B = {3}')}`,
        `<p><strong>Use the addition rule.</strong></p>
         ${sum('Pr(A ∪ B) = 6/20 + 8/20 − 1/20 = 13/20')}`,
        `<p><strong>Prime and not a multiple of 3</strong> is B only: take the overlap out of B.</p>
         ${sum('8 − 1 = 7 → 7/20')}
         ${ans('1/20, 13/20, 7/20')}`
      )}
      <p><strong>A die works the same way.</strong> A 10-sided die: even or less than 4 is 5/10 + 3/10 − 1/10 = 7/10 (2 is in both).</p>
      ${tip('Type a list of elements with commas, like 3, 6, 9. Remember 1 is not prime.')}`,

    // y10-8C Q4, Q5, Q7: finding the intersection with the addition rule
    // method: Example 7, 8C (using the addition rule)
    'y10-8c-solve': `
      <p class="hp-tag">Worked example: Pr(A) = 0.55, Pr(B) = 0.3 and Pr(A ∪ B) = 0.7. Find Pr(A ∩ B) and Pr(A′ ∩ B′).</p>
      ${steps(
        `<p><strong>Write the addition rule and substitute.</strong></p>
         ${sum('Pr(A ∪ B) = Pr(A) + Pr(B) − Pr(A ∩ B)<br>0.7 = 0.55 + 0.3 − Pr(A ∩ B)<br>0.7 = 0.85 − Pr(A ∩ B)')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('Pr(A ∩ B) = 0.85 − 0.7 = 0.15')}`,
        `<p><strong>Neither is outside A ∪ B.</strong> A′ ∩ B′ = (A ∪ B)′.</p>
         ${sum('Pr(A′ ∩ B′) = 1 − 0.7 = 0.3')}
         ${ans('0.15, 0.3')}`
      )}
      <p><strong>Counts work the same way.</strong> Of 50 phones, 30 have a case, 24 have a charger and 41 have a case or a charger: 41 = 30 + 24 − n(both), so n(both) = 54 − 41 = 13, and Pr(both) = 13/50. Neither: 50 − 41 = 9, so 9/50.</p>
      ${tip('Type decimals as they come, like 0.15. A probability can never be below 0 or above 1, so check your answer is in that range.')}`,

    // y10-8C Q9: A only and B only from the addition rule
    // method: Example 7, 8C (addition rule for the intersection), then the Venn diagram regions of 8B
    'y10-8c-only': `
      <p class="hp-tag">Worked example: Pr(A ∪ B) = 0.8, Pr(A) = 0.45 and Pr(B) = 0.6. Find Pr(A ∩ B′) and Pr(A′ ∩ B).</p>
      ${steps(
        `<p><strong>Find the intersection with the addition rule.</strong></p>
         ${sum('0.8 = 0.45 + 0.6 − Pr(A ∩ B)<br>0.8 = 1.05 − Pr(A ∩ B)<br>Pr(A ∩ B) = 1.05 − 0.8 = 0.25')}`,
        `<p><strong>Fill a Venn diagram with probabilities.</strong> A only is A take away the overlap; B only is B take away the overlap.</p>
         ${sum('A ∩ B′ = 0.45 − 0.25 = 0.2<br>A′ ∩ B = 0.6 − 0.25 = 0.35<br>Outside: 1 − 0.8 = 0.2')}
         ${fig(venn('A', 'B', '0.2', '0.25', '0.35', '0.2'))}
         ${ans('0.2, 0.35')}`
      )}
      ${tip('The four regions must add to 1: 0.2 + 0.25 + 0.35 + 0.2 = 1 ✓.')}`,

    // y10-8C Q6: the addition rule with groups of people
    // method: Example 6, 8C (applying the addition rule)
    'y10-8c-table': `
      <p class="hp-tag">Worked example: a class has 16 girls and 12 boys. 8 students sing in the choir: 5 girls and 3 boys. Find the probability that a student is a boy or in the choir.</p>
      ${table([['', 'Choir', 'Not choir', 'Total'], ['Girl', '5', '11', '16'], ['Boy', '3', '9', '12'], ['Total', '8', '20', '28']])}
      ${steps(
        `<p><strong>Count each event and the overlap.</strong></p>
         ${sum('n(boy) = 12, n(choir) = 8, n(boy and choir) = 3')}`,
        `<p><strong>Addition rule.</strong> The 3 boys in the choir are in both groups, so take them away once.</p>
         ${sum('Pr(boy ∪ choir) = 12/28 + 8/28 − 3/28 = 17/28')}
         ${ans('17/28')}`
      )}
      ${tip('Check by counting: 12 boys plus the 5 girls in the choir is 17 students ✓.')}`,

    // y10-8C Q10, Q11: mutually exclusive events and impossible values
    // method: Key ideas 8C (addition rule; mutually exclusive means Pr(A ∩ B) = 0)
    'y10-8c-reason': `
      <p class="hp-tag">Worked example: when can the addition rule be shortened, and when are the numbers impossible?</p>
      ${steps(
        `<p><strong>Mutually exclusive: the overlap is empty.</strong> Then Pr(A ∩ B) = 0, so the rule becomes Pr(A ∪ B) = Pr(A) + Pr(B) − 0.</p>`,
        `<p><strong>The overlap is part of each event.</strong> Pr(A) = 0.3, Pr(B) = 0.5 and Pr(A ∩ B) = 0.4 is impossible: A ∩ B sits inside A, so it cannot be bigger than Pr(A) = 0.3.</p>`,
        `<p><strong>Solve the rule and look at the answer.</strong> Pr(A ∪ B) = 0.9, Pr(A) = 0.2, Pr(B) = 0.6.</p>
         ${sum('0.9 = 0.2 + 0.6 − Pr(A ∩ B)<br>0.9 = 0.8 − Pr(A ∩ B)<br>Pr(A ∩ B) = 0.8 − 0.9 = −0.1')}
         <p>A probability cannot be negative, so these values are impossible.</p>
         ${ans('-0.1')}`
      )}
      ${tip('Type a negative number with a minus sign, like -0.1.')}`,

    // y10-8C Q13, Q14: divisibility and the addition rule
    // method: no book example (count the multiples, then the addition rule of 8C)
    'y10-8c-divisible': `
      <p class="hp-tag">Worked example: a number is chosen at random from the first 40 positive integers.</p>
      ${steps(
        `<p><strong>Count multiples by dividing.</strong> 39 = 3 × 13 is the last multiple of 3, and 40 = 4 × 10.</p>
         ${sum('Divisible by 3: 13 numbers → 13/40<br>Divisible by 4: 10 numbers → 10/40 = 1/4')}`,
        `<p><strong>"3 and 4" means divisible by both:</strong> that is the multiples of 12.</p>
         ${sum('12, 24, 36 → 3/40')}`,
        `<p><strong>"3 or 4": use the addition rule.</strong></p>
         ${sum('13/40 + 10/40 − 3/40 = 20/40 = 1/2')}
         ${ans('13/40, 1/4, 3/40, 1/2')}`
      )}
      <p><strong>Numbers that share a factor:</strong> divisible by 6 and 9 means divisible by 18 (the smallest number both go into), not 54. In the first 40 that is 18 and 36, so 2/40 = 1/20.</p>
      ${tip('For a big range, divide and round down: in the first 100 numbers, 100 ÷ 7 = 14.28..., so there are 14 multiples of 7.')}`,

    // =====================================================================
    // Year 10 8D Conditional probability
    // =====================================================================
    // y10-8D Q1, Q10: conditional probability from a Venn diagram
    // method: Example 8, 8D (conditional probability from a Venn diagram)
    'y10-8d-venn': `
      <p class="hp-tag">Worked example: find Pr(A), Pr(A ∩ B), Pr(A | B) and Pr(B | A).</p>
      ${fig(venn('A', 'B', '6', '2', '3', '1'))}
      ${steps(
        `<p><strong>Total: add all four regions.</strong></p>
         ${sum('6 + 2 + 3 + 1 = 12<br>Pr(A) = (6 + 2)/12 = 8/12 = 2/3<br>Pr(A ∩ B) = 2/12 = 1/6')}`,
        `<p><strong>"Given B": B is the new sample space.</strong> Only look inside circle B, which holds 2 + 3 = 5 elements. 2 of them are in A.</p>
         ${sum('Pr(A | B) = n(A ∩ B)/n(B) = 2/5')}`,
        `<p><strong>"Given A": only look inside A</strong> (8 elements).</p>
         ${sum('Pr(B | A) = n(A ∩ B)/n(A) = 2/8 = 1/4')}
         ${ans('2/3, 1/6, 2/5, 1/4')}`
      )}
      <p><strong>One circle inside the other:</strong> if B (5 elements) sits inside A (15 elements in all), then every element of B is in A, so Pr(A | B) = 5/5 = 1, and Pr(B | A) = 5/15 = 1/3.</p>
      ${tip('Pr(A | B) and Pr(B | A) have the same top (the overlap) but different bottoms. The bottom is the event after the bar.')}`,

    // y10-8D Q2, Q6, Q12: conditional probability from a two-way table
    // method: Example 8, 8D, read from a two-way table as in Example 9, 8D
    'y10-8d-table': `
      <p class="hp-tag">Worked example: use the two-way table.</p>
      ${table([['', 'A', 'A′', 'Total'], ['B', '4', '6', '10'], ['B′', '5', '6', '11'], ['Total', '9', '12', '21']])}
      ${steps(
        `<p><strong>Ordinary probabilities use the grand total, 21.</strong></p>
         ${sum('Pr(A) = 9/21 = 3/7<br>Pr(A ∩ B) = 4/21')}`,
        `<p><strong>Given B: use the B row total, 10.</strong> Given A: use the A column total, 9.</p>
         ${sum('Pr(A | B) = 4/10 = 2/5<br>Pr(B | A) = 4/9')}
         ${ans('3/7, 4/21, 2/5, 4/9')}`,
        `<p><strong>Cells missing?</strong> Fill them first: each row and column adds to its total.</p>`
      )}
      <p><strong>Bigger tables:</strong> "given they are not in the middle column" means add the other columns' totals; that sum is the new bottom, and the top is the matching cells in those columns only.</p>
      ${tip('Find the word "given": the group after it gives the bottom of the fraction.')}`,

    // y10-8D Q3, Q4, Q5: conditional probability from a description
    // method: Example 9, 8D (two-way table, then conditional probability)
    'y10-8d-words': `
      <p class="hp-tag">Worked example: of 30 club members, 18 swim (A), 12 cycle (B) and 7 do both.</p>
      ${steps(
        `<p><strong>Put the information in a two-way table,</strong> then fill the other cells so the rows and columns add up.</p>
         ${table([['', 'A', 'A′', 'Total'], ['B', '7', '5', '12'], ['B′', '11', '7', '18'], ['Total', '18', '12', '30']])}
         ${sum('Neither: 30 − 11 − 7 − 5 = 7')}`,
        `<p><strong>Only swims:</strong> A and not B.</p>
         ${sum('Pr(A ∩ B′) = 11/30')}`,
        `<p><strong>Conditional: the group after "given" is the bottom.</strong></p>
         ${sum('Cycles, given they swim: Pr(B | A) = 7/18<br>Swims, given they cycle: Pr(A | B) = 7/12')}
         ${ans('7, 11/30, 7/18, 7/12')}`
      )}
      ${tip('"Knowing that", "if ... then" and "of those who" all mean conditional probability, just like "given".')}`,

    // y10-8D Q7, Q8: conditional probability with cards and numbers
    // method: Key ideas 8D (Pr(A | B) = n(A ∩ B) ÷ n(B): the sample space shrinks to B)
    'y10-8d-cards': `
      <p class="hp-tag">Worked example: shrink the sample space to the "given" group, then count inside it.</p>
      ${steps(
        `<p><strong>Cards.</strong> Given it is a picture card, there are only 12 cards to choose from.</p>
         ${sum('Pr(king | picture card) = 4/12 = 1/3<br>Pr(diamond | red card) = 13/26 = 1/2')}`,
        `<p><strong>Numbers from 1 to 20.</strong> List the given group, then count the ones that fit.</p>
         ${sum('Even: 2, 4, 6, ..., 20 (10 numbers)<br>Divisible by 3 among them: 6, 12, 18<br>Pr(divisible by 3 | even) = 3/10')}`,
        `<p><strong>Another one:</strong> the odd numbers are 1, 3, 5, ..., 19 (10 numbers), and 3, 5, 7, 11, 13, 17, 19 are prime.</p>
         ${sum('Pr(prime | odd) = 7/10')}
         ${ans('1/3, 1/2, 3/10, 7/10')}`
      )}
      ${tip('The bottom of the fraction is the size of the given group, not 52 or 20.')}`,

    // y10-8D Q9, Q11: the conditional probability rule
    // method: Key ideas 8D (Pr(A | B) = Pr(A ∩ B) ÷ Pr(B))
    'y10-8d-rule': `
      <p class="hp-tag">Worked example: use Pr(A | B) = Pr(A ∩ B) ÷ Pr(B).</p>
      ${steps(
        `<p><strong>Rearrange: multiply both sides by Pr(B).</strong></p>
         ${sum('Pr(A | B) = Pr(A ∩ B)/Pr(B)<br>Pr(A ∩ B) = Pr(A | B) × Pr(B)')}`,
        `<p><strong>Substitute.</strong> If Pr(A | B) = 0.5 and Pr(B) = 0.6:</p>
         ${sum('Pr(A ∩ B) = 0.5 × 0.6 = 0.3')}
         ${ans('0.3')}`,
        `<p><strong>Mutually exclusive events</strong> have no overlap, so Pr(A ∩ B) = 0 and the top of the fraction is 0.</p>
         ${sum('Pr(A | B) = 0 ÷ Pr(B) = 0')}`
      )}
      ${tip('Type decimals as they come, like 0.3. The same rule works the other way round: Pr(B | A) = Pr(A ∩ B) ÷ Pr(A).')}`,

    // =====================================================================
    // Year 10 8E Two-step experiments using arrays
    // =====================================================================
    // y10-8E Q1, Q2: a table of outcomes with replacement
    // method: Example 10, 8E (constructing a table with replacement)
    'y10-8e-with': `
      <p class="hp-tag">Worked example: a fair 4-sided die (1 to 4) is rolled twice.</p>
      ${table([['2nd \\ 1st', '1', '2', '3', '4'], ['1', '(1, 1)', '(2, 1)', '(3, 1)', '(4, 1)'], ['2', '(1, 2)', '(2, 2)', '(3, 2)', '(4, 2)'], ['3', '(1, 3)', '(2, 3)', '(3, 3)', '(4, 3)'], ['4', '(1, 4)', '(2, 4)', '(3, 4)', '(4, 4)']])}
      ${steps(
        `<p><strong>List the sample space in a table.</strong> The first roll goes first in each pair. There are 4 × 4 = 16 equally likely outcomes.</p>`,
        `<p><strong>Count the cells that fit.</strong></p>
         ${sum('Pr(3, 1) = 1/16<br>Pr(double) = 4/16 = 1/4 &nbsp; (the diagonal)<br>Pr(at least one 4) = 7/16 &nbsp; (the 4 row and the 4 column)')}`,
        `<p><strong>Expected number = probability × number of trials.</strong> Rolled 80 times, you would expect about 80 × 1/4 = 20 doubles.</p>
         ${ans('16, 1/16, 1/4, 7/16, 20')}`
      )}
      ${tip('Type an outcome as a bracketed pair, first result first, like (3, 1). (3, 1) and (1, 3) are different cells.')}`,

    // y10-8E Q5, Q8, Q11: tables of totals
    // method: Example 10, 8E (count cells in the table; part e for "given")
    'y10-8e-totals': `
      <p class="hp-tag">Worked example: two coins are chosen at random from a pile of 10c, 20c and 50c coins (plenty of each). The values are added.</p>
      ${table([['2nd \\ 1st', '10c', '20c', '50c'], ['10c', '20', '30', '60'], ['20c', '30', '40', '70'], ['50c', '60', '70', '100']])}
      ${steps(
        `<p><strong>Fill each cell with the total.</strong> 3 × 3 = 9 equally likely outcomes.</p>`,
        `<p><strong>Count the cells.</strong></p>
         ${sum('Pr(70c) = 2/9<br>Pr(less than 60c) = 4/9<br>Pr(at least 60c) = 1 − 4/9 = 5/9')}`,
        `<p><strong>"Given" shrinks the table.</strong> Given the total is at least 60c, only 5 cells count, and one of them is 100c.</p>
         ${sum('Pr(100c | at least 60c) = 1/5')}
         ${ans('9, 2/9, 4/9, 5/9, 1/5')}`
      )}
      ${tip('"Less than 60" does not include 60; "at least 60" does. The number of outcomes for a total is the number of cells showing it.')}`,

    // y10-8E Q3, Q4, Q10: a table of outcomes without replacement
    // method: Example 11, 8E (constructing a table without replacement)
    'y10-8e-without': `
      <p class="hp-tag">Worked example: two letters are chosen from the word <b>TOOTH</b> without replacement.</p>
      ${table([['2nd \\ 1st', 'T', 'O', 'O', 'T', 'H'], ['T', '×', '(O, T)', '(O, T)', '(T, T)', '(H, T)'], ['O', '(T, O)', '×', '(O, O)', '(T, O)', '(H, O)'], ['O', '(T, O)', '(O, O)', '×', '(T, O)', '(H, O)'], ['T', '(T, T)', '(O, T)', '(O, T)', '×', '(H, T)'], ['H', '(T, H)', '(O, H)', '(O, H)', '(T, H)', '×']])}
      ${steps(
        `<p><strong>Cross out the diagonal:</strong> the same letter card cannot be chosen twice. 5 × 4 = 20 outcomes. The two Ts and the two Os are different cards, so (T, T) and (O, O) can still happen.</p>`,
        `<p><strong>Count the cells.</strong></p>
         ${sum('Pr(T, O) = 4/20 = 1/5<br>Pr(two Ts) = 2/20 = 1/10<br>Pr(a T and an H) = 4/20 = 1/5<br>Pr(exactly one O) = 12/20 = 3/5<br>Pr(same letter) = (2 + 2)/20 = 1/5')}`,
        `<p><strong>Numbered cards:</strong> 6 cards numbered 1 to 6, two chosen without replacement, give 6 × 5 = 30 outcomes. A sum of 4 is (1, 3) or (3, 1): 2/30 = 1/15. With replacement there are 36 outcomes and (2, 2) is allowed too: 3/36 = 1/12.</p>
         ${ans('20, 1/5, 1/10, 3/5')}`
      )}
      ${tip('Count both orders: (T, O) and (O, T) are different outcomes. "A T and an H" means either order.')}`,

    // y10-8E Q6: one letter from each of two different words
    // method: Example 10, 8E (a table with every pair from the two groups)
    'y10-8e-two-words': `
      <p class="hp-tag">Worked example: a letter is chosen from the word TOE, then a letter is chosen from the word OTTER.</p>
      ${table([['2nd \\ 1st', 'T', 'O', 'E'], ['O', '(T, O)', '(O, O)', '(E, O)'], ['T', '(T, T)', '(O, T)', '(E, T)'], ['T', '(T, T)', '(O, T)', '(E, T)'], ['E', '(T, E)', '(O, E)', '(E, E)'], ['R', '(T, R)', '(O, R)', '(E, R)']])}
      ${steps(
        `<p><strong>One column for each letter of the first word, one row for each letter of the second.</strong> 3 × 5 = 15 equally likely outcomes. Nothing is crossed out, because the letters come from different words.</p>`,
        `<p><strong>A double: the two letters match.</strong> Count them.</p>
         ${sum('(T, T): 2 cells, (O, O): 1 cell, (E, E): 1 cell<br>Pr(double) = 4/15')}
         ${ans('15, 4/15')}`
      )}
      ${tip('A repeated letter (the two Ts in OTTER) gets its own row each time.')}`,

    // y10-8E Q7: counting outcomes for people, with and without repeats
    // method: Example 11, 8E (a table with or without the diagonal; count the cells)
    'y10-8e-awards': `
      <p class="hp-tag">Worked example: a class of 10 students chooses a captain and a vice-captain.</p>
      ${steps(
        `<p><strong>Imagine the table:</strong> 10 columns for captain, 10 rows for vice-captain.</p>
         ${sum('Same student can do both: 10 × 10 = 100<br>Same student cannot: 10 × 9 = 90 &nbsp; (cross out the 10 diagonal cells)')}`,
        `<p><strong>One particular student, Mia, when no one can do both.</strong> Mia's captain column has 9 cells left.</p>
         ${sum('Pr(Mia is captain) = 9/90 = 1/10<br>Neither job: 9 × 8 = 72 cells → 72/90 = 4/5')}`,
        `<p><strong>When one student can do both:</strong> "at least one job" is everything except the 9 × 9 = 81 cells without Mia.</p>
         ${sum('Pr(at least one) = 1 − 81/100 = 19/100')}
         ${ans('100, 90, 1/10, 4/5, 19/100')}`
      )}
      ${tip('"At least one" is often quickest as 1 − Pr(none).')}`,

    // y10-8E Q9: with or without replacement?
    // method: Key ideas 8E (with replacement, outcomes can repeat; without, they cannot)
    'y10-8e-replace': `
      <p class="hp-tag">Worked example: decide if each choice is with or without replacement.</p>
      ${steps(
        `<p><strong>Ask: can the same thing be chosen again?</strong> If yes, it is with replacement. If it is used up or kept, it is without.</p>`,
        `<p><strong>Without replacement:</strong> dealing two cards to a player (the first card is not put back); choosing two students to read at assembly (one person cannot be chosen twice).</p>`,
        `<p><strong>With replacement:</strong> tossing a coin twice (both tosses can be heads); picking a random song from a playlist each morning (the same song can come up again).</p>
         ${ans('Without, Without, With, With')}`
      )}
      ${tip('Rolling, spinning and tossing never use anything up, so they are always with replacement.')}`,

    // =====================================================================
    // Year 10 8F Using tree diagrams
    // =====================================================================
    // y10-8F Q1, Q12: choose a box, then a counter
    // method: Example 12, 8F (tree diagram for a multi-stage experiment)
    'y10-8f-boxes': `
      <p class="hp-tag">Worked example: bag A holds 3 red and 3 green marbles; bag B holds 1 red and 5 green. A bag is chosen at random, then one marble.</p>
      ${fig(tree([['A', 'B'], ['R', 'G']], { heads: ['Bag', 'Marble'], join: ', ', prob: (p) => (p.length === 1 ? '1/2' : p[0] === 'A' ? '1/2' : p[1] === 'R' ? '1/6' : '5/6') }))}
      <p>R is red and G is green.</p>
      ${steps(
        `<p><strong>Probabilities from each bag.</strong></p>
         ${sum('Pr(red from A) = 3/6 = 1/2<br>Pr(red from B) = 1/6')}`,
        `<p><strong>Multiply along a path</strong> for one outcome.</p>
         ${sum('Pr(B, red) = 1/2 × 1/6 = 1/12')}`,
        `<p><strong>Add the paths</strong> when more than one outcome fits.</p>
         ${sum('Pr(red) = 1/2 × 1/2 + 1/2 × 1/6<br>= 1/4 + 1/12 = 4/12 = 1/3')}
         ${ans('1/2, 1/6, 1/12, 1/3')}`
      )}
      ${tip('Three containers chosen at random? Each first branch is 1/3, and there are 3 sets of second branches.')}`,

    // y10-8F Q2, Q5: branches with different probabilities
    // method: Example 12, 8F (multiply along branches, add the paths that fit)
    'y10-8f-unequal': `
      <p class="hp-tag">Worked example: a box holds 6 novels (2 hardback, 4 paperback) and 4 comics (1 hardback, 3 paperback). A book is chosen at random. The tree shows the type, then the cover.</p>
      ${fig(tree([['N', 'C'], ['H', 'P']], { heads: ['Type', 'Cover'], join: ', ', prob: (p) => (p.length === 1 ? (p[0] === 'N' ? '3/5' : '2/5') : p[0] === 'N' ? (p[1] === 'H' ? '1/3' : '2/3') : (p[1] === 'H' ? '1/4' : '3/4')) }))}
      <p>N is a novel, C a comic, H hardback and P paperback.</p>
      ${steps(
        `<p><strong>Branch probabilities.</strong> First branch: 6 of the 10 books are novels. Second branch: 2 of the 6 novels are hardback. Branches from one point add to 1, so a missing one is 1 minus the others.</p>
         ${sum('Pr(novel) = 6/10 = 3/5, Pr(hard | novel) = 2/6 = 1/3<br>Pr(paper | comic) = 1 − 1/4 = 3/4')}`,
        `<p><strong>Multiply along a path; add the paths that fit.</strong></p>
         ${sum('Pr(novel, hard) = 3/5 × 1/3 = 1/5<br>Pr(hard) = 3/5 × 1/3 + 2/5 × 1/4 = 1/5 + 1/10 = 3/10<br>Pr(not hard) = 1 − 3/10 = 7/10')}`,
        `<p><strong>Dice:</strong> two dice, each "a 6" (1/6) or "not a 6" (5/6).</p>
         ${sum('Both 6: 1/6 × 1/6 = 1/36<br>Exactly one 6: 1/6 × 5/6 + 5/6 × 1/6 = 10/36 = 5/18<br>Not both 6: 1 − 1/36 = 35/36')}
         ${ans('1/5, 3/10, 7/10, 5/18')}`
      )}
      ${tip('Check: 2 of the 10 books are hardback novels, and 2/10 = 1/5 ✓. Type fractions in simplest form.')}`,

    // y10-8F Q3, Q4, Q6, Q7, Q9, Q10: two selections, without and with replacement
    // method: Example 13, 8F (tree diagram for selection without replacement)
    'y10-8f-without': `
      <p class="hp-tag">Worked example: a bag holds 4 blue (B) and 2 yellow (Y) marbles. 2 marbles are taken without replacement.</p>
      ${fig(tree([['B', 'Y'], ['B', 'Y']], { heads: ['1st', '2nd'], join: ', ', prob: (p) => (p.length === 1 ? (p[0] === 'B' ? '4/6' : '2/6') : p[0] === 'B' ? (p[1] === 'B' ? '3/5' : '2/5') : (p[1] === 'B' ? '4/5' : '1/5')) }))}
      ${steps(
        `<p><strong>Second branches change.</strong> After one blue there are 5 marbles left, 3 of them blue. After one yellow, 5 are left, 4 of them blue.</p>`,
        `<p><strong>Multiply along each path; add the paths that fit.</strong></p>
         ${sum('Pr(B, Y) = 4/6 × 2/5 = 8/30 = 4/15<br>Pr(B, B) = 4/6 × 3/5 = 12/30 = 2/5<br>Pr(exactly 1 blue) = 4/6 × 2/5 + 2/6 × 4/5 = 16/30 = 8/15')}`,
        `<p><strong>With replacement every branch stays out of 6.</strong></p>
         ${sum('Pr(B, Y) = 4/6 × 2/6 = 8/36 = 2/9<br>Pr(B, B) = 4/6 × 4/6 = 16/36 = 4/9<br>At least 1 yellow = 1 − Pr(B, B) = 1 − 4/9 = 5/9')}
         ${ans('4/15, 2/5, 8/15; 2/9, 4/9, 5/9')}`
      )}
      ${tip('If asked for a percentage or decimal, convert at the end: 8/15 = 0.5333... = 53.3% to one decimal place. With big numbers (hundreds of cans), use a calculator and round only the final answer.')}`,

    // y10-8F Q8: branch probabilities that depend on the day before
    // method: Example 13, 8F (second branches depend on the first; multiply along, add the paths)
    'y10-8f-weather': `
      <p class="hp-tag">Worked example: the bus is late (L) on day 1 with probability 0.2. After a late day, Pr(late) = 0.4. After an on-time day (O), Pr(late) = 0.1.</p>
      ${fig(tree([['L', 'O'], ['L', 'O']], { heads: ['Day 1', 'Day 2'], prob: (p) => (p.length === 1 ? (p[0] === 'L' ? '0.2' : '0.8') : p[0] === 'L' ? (p[1] === 'L' ? '0.4' : '0.6') : (p[1] === 'L' ? '0.1' : '0.9')) }))}
      ${steps(
        `<p><strong>Each pair of branches adds to 1.</strong> After L: 0.4 and 0.6. After O: 0.1 and 0.9.</p>`,
        `<p><strong>Multiply along, add the paths.</strong></p>
         ${sum('Pr(L, L) = 0.2 × 0.4 = 0.08<br>Exactly one late = 0.2 × 0.6 + 0.8 × 0.1 = 0.12 + 0.08 = 0.2<br>At least one on time = 1 − 0.08 = 0.92')}`,
        `<p><strong>Three days: one more set of branches.</strong></p>
         ${sum('Pr(L, L, L) = 0.2 × 0.4 × 0.4 = 0.032')}
         ${ans('0.08, 0.2, 0.92, 0.032')}`
      )}
      ${tip('Give the exact decimal, like 0.032. "At most two late" over three days is 1 − Pr(L, L, L).')}`,

    // y10-8F Q11: three selections without replacement
    // method: Example 13, 8F, with a third set of branches
    'y10-8f-three': `
      <p class="hp-tag">Worked example: a box holds 2 green (G) and 5 yellow (Y) counters. Three are taken without replacement.</p>
      ${steps(
        `<p><strong>Each draw has one fewer counter.</strong> The bottoms go 7, 6, 5.</p>
         ${sum('Pr(G, Y, Y) = 2/7 × 5/6 × 4/5 = 40/210 = 4/21')}`,
        `<p><strong>Exactly 2 green: three paths, GGY, GYG and YGG.</strong></p>
         ${sum('2/7 × 1/6 × 5/5 + 2/7 × 5/6 × 1/5 + 5/7 × 2/6 × 1/5<br>= 10/210 + 10/210 + 10/210 = 30/210 = 1/7')}
         <p>3 green is impossible (there are only 2), so its probability is 0.</p>`,
        `<p><strong>At least one green = 1 − Pr(no green).</strong></p>
         ${sum('Pr(Y, Y, Y) = 5/7 × 4/6 × 3/5 = 60/210 = 2/7<br>Pr(at least 1 G) = 1 − 2/7 = 5/7')}
         ${ans('4/21, 1/7, 5/7')}`
      )}
      ${tip('"At most 2 yellow" over three draws means not all yellow, so it is the same as "at least 1 green".')}`,

    // y10-8F Q13: sharing a prize in an unfinished game
    // method: Example 12, 8F (tree diagram: multiply along the branches, add the paths)
    'y10-8f-game': `
      <p class="hp-tag">Worked example: the first player to 10 points wins $80. Each point is equally likely to go to either player. The game stops at A 9 points, B 7 points.</p>
      ${fig({ kind: 'diagram', unit: 24, items: [
        { seg: [0, -0.5, 2.4, 0.6] }, { label: 'A wins', at: [3.6, 0.6] }, { label: '1/2', at: [1.1, 0.5] },
        { seg: [0, -0.5, 2.4, -1.6] }, { label: 'B wins', at: [3.6, -1.6] }, { label: '1/2', at: [1.1, -1.5] },
        { seg: [5, -1.6, 7.4, -0.5] }, { label: 'A wins', at: [8.6, -0.5] }, { label: '1/2', at: [6.1, -0.6] },
        { seg: [5, -1.6, 7.4, -2.7] }, { label: 'B wins', at: [8.6, -2.7] }, { label: '1/2', at: [6.1, -2.6] },
        { seg: [10, -2.7, 12.4, -1.6] }, { label: 'A wins', at: [13.6, -1.6] }, { label: '1/2', at: [11.1, -1.7] },
        { seg: [10, -2.7, 12.4, -3.8] }, { label: 'B wins', at: [13.6, -3.8] }, { label: '1/2', at: [11.1, -3.7] },
        { label: '(A 10, B 7)', at: [3.6, 1.4] }, { label: '(A 10, B 8)', at: [8.6, 0.3] }, { label: '(A 10, B 9)', at: [13.6, -0.8] }, { label: '(A 9, B 10)', at: [13.6, -4.6] }] })}
      ${steps(
        `<p><strong>Draw the ways the game could finish.</strong> A needs 1 more point; B needs 3 in a row. Stop a path as soon as someone reaches 10.</p>`,
        `<p><strong>Multiply along B's only path.</strong></p>
         ${sum('Pr(B wins) = 1/2 × 1/2 × 1/2 = 1/8')}`,
        `<p><strong>Add A's paths</strong> (or use 1 − 1/8), then share the prize in that ratio.</p>
         ${sum('Pr(A wins) = 1/2 + 1/4 + 1/8 = 7/8<br>A gets 7/8 × $80 = $70, B gets $10')}
         ${ans('7/8, 1/8, 70')}`
      )}
      ${tip('Type money as a number, like 70 or 12.5. Check: the two shares add to the whole prize.')}`,

    // =====================================================================
    // Year 10 8G Independent events
    // =====================================================================
    // y10-8G Q1, Q2, Q3, Q4, Q5: checking for independence
    // method: Example 14, 8G (checking for independent events)
    'y10-8g-check': `
      <p class="hp-tag">Worked example: of 25 cafes, 10 have outdoor seating (A), 5 have free wifi (B) and 2 have both.</p>
      ${steps(
        `<p><strong>Venn diagram: start with the 2 in both.</strong></p>
         ${sum('A only: 10 − 2 = 8, B only: 5 − 2 = 3<br>Neither: 25 − 8 − 2 − 3 = 12')}
         ${fig(venn('A', 'B', '8', '2', '3', '12'))}`,
        `<p><strong>Find Pr(A) and Pr(A | B).</strong></p>
         ${sum('Pr(A) = 10/25 = 2/5<br>Pr(A | B) = 2/5')}`,
        `<p><strong>Compare.</strong> Pr(A | B) = Pr(A), so knowing B happened does not change the chance of A: the events <b>are independent</b>.</p>
         <p>If only 1 cafe had both, Pr(A | B) = 1/5, which is not 2/5, so A and B would <b>not</b> be independent.</p>
         ${ans('8, 2, 3, 12; independent')}`
      )}
      ${tip('From a two-way table: Pr(A) uses the A total over the grand total; Pr(A | B) uses the A ∩ B cell over the B total.')}`,

    // y10-8G Q6, Q7: repeated independent trials
    // method: Key ideas 8G (with replacement, successive events are independent, so Pr(A ∩ B) = Pr(A) × Pr(B))
    'y10-8g-repeat': `
      <p class="hp-tag">Worked example: a fair coin is tossed 4 times; then a fair die is rolled 3 times.</p>
      ${steps(
        `<p><strong>Independent trials: multiply.</strong></p>
         ${sum('Pr(H, H, H, H) = 1/2 × 1/2 × 1/2 × 1/2 = 1/16<br>Pr(at least 1 tail) = 1 − 1/16 = 15/16')}`,
        `<p><strong>Every ordered result of three dice</strong> has probability 1/6 × 1/6 × 1/6 = 1/216. A sum of 3 can only be (1, 1, 1).</p>
         ${sum('Pr(sum 3) = 1/216')}`,
        `<p><strong>A sum of 7: list the groups of numbers, then count their orders.</strong></p>
         ${sum('1, 1, 5: 3 orders &nbsp; 1, 2, 4: 6 orders<br>1, 3, 3: 3 orders &nbsp; 2, 2, 3: 3 orders<br>15 outcomes → 15/216 = 5/72')}
         ${ans('1/16, 15/16, 1/216, 5/72')}`
      )}
      ${tip('Three different numbers can be ordered 6 ways; a pair plus one other number, 3 ways; three the same, 1 way.')}`,

    // y10-8G Q8: are mutually exclusive events independent?
    // method: Example 14, 8G (compare Pr(A) with Pr(A | B))
    'y10-8g-mutex': `
      <p class="hp-tag">Worked example: A and B are mutually exclusive.</p>
      ${fig(vennApart('A', 'B', '4', '6', '5'))}
      ${steps(
        `<p><strong>Find Pr(A).</strong></p>
         ${sum('Pr(A) = 4/15')}`,
        `<p><strong>Find Pr(A | B).</strong> None of the 6 elements of B are in A.</p>
         ${sum('Pr(A | B) = 0/6 = 0')}`,
        `<p><strong>Compare.</strong> 0 is not 4/15, so A and B are not independent. Knowing B happened tells you A did not.</p>
         ${ans('Not independent')}`
      )}
      ${tip('"Mutually exclusive" (no overlap) and "independent" (no effect on the chance) are different ideas. Do not mix them up.')}`,

    // y10-8G Q9: a missing number that makes events independent
    // method: Key ideas 8G (independent means Pr(A | B) = Pr(A)), solved by doing the same to both sides
    'y10-8g-find-x': `
      <p class="hp-tag">Worked example: find x so that A and B are independent.</p>
      ${fig(venn('A', 'B', '2', '4', '6', 'x'))}
      ${steps(
        `<p><strong>Pr(A | B) does not need x.</strong> B holds 4 + 6 = 10 elements, 4 of them in A.</p>
         ${sum('Pr(A | B) = 4/10 = 2/5')}`,
        `<p><strong>Pr(A) does need x.</strong> The total is 2 + 4 + 6 + x = 12 + x.</p>
         ${sum('Pr(A) = 6/(12 + x)')}`,
        `<p><strong>Set them equal and solve.</strong> Multiply both sides by 5(12 + x).</p>
         ${sum('6/(12 + x) = 2/5<br>30 = 2(12 + x)<br>15 = 12 + x<br>x = 3')}
         <p>Check: Pr(A) = 6/15 = 2/5 ✓.</p>
         ${ans('3')}`
      )}
      ${tip('If x is inside a circle instead, it appears in Pr(A | B) or in both fractions. Write both fractions with x first, then solve.')}`,

    // y10-8G Q10, Q11: the multiplication rule for independent events
    // method: Key ideas 8G (Pr(A ∩ B) = Pr(A) × Pr(B)) with the addition rule of 8C
    'y10-8g-product': `
      <p class="hp-tag">Worked example: A and B are independent, with Pr(A) = 0.6 and Pr(B) = 0.4.</p>
      ${steps(
        `<p><strong>Independent: multiply for "and".</strong></p>
         ${sum('Pr(A ∩ B) = 0.6 × 0.4 = 0.24')}`,
        `<p><strong>Addition rule for "or".</strong></p>
         ${sum('Pr(A ∪ B) = 0.6 + 0.4 − 0.24 = 0.76')}
         ${ans('0.24, 0.76')}`,
        `<p><strong>Working backwards.</strong> Pr(A ∪ B) = 0.8 and Pr(A) = 0.6. Let Pr(B) = p, so Pr(A ∩ B) = 0.6p.</p>
         ${sum('0.8 = 0.6 + p − 0.6p<br>0.8 = 0.6 + 0.4p<br>0.2 = 0.4p<br>p = 0.5')}`
      )}
      ${tip('Type decimals as they come, like 0.76. Only multiply for "and" when the events are independent.')}`,

    // =====================================================================
    // Year 10 8H Counting principles and factorial notation (10A)
    // =====================================================================
    // y10-8H Q1, Q2, Q3, Q5, Q6, Q7, Q9, Q10: addition and multiplication principles
    // method: Example 15, 8H (using the addition and multiplication principles)
    'y10-8h-principles': `
      <p class="hp-tag">Worked example: decide which principle to use, then count.</p>
      ${steps(
        `<p><strong>One item from this group OR that group: add.</strong> Choosing one piece of fruit from 6 apples or 7 pears:</p>
         ${sum('Addition principle: 6 + 7 = 13 choices')}`,
        `<p><strong>One item from this group AND one from that group: multiply.</strong> For each of 7 shirts there are 3 pairs of shorts to go with it:</p>
         ${sum('Multiplication principle: 7 × 3 = 21 outfits')}`,
        `<p><strong>More groups work the same way.</strong> One entree from 3, one main from 9 and one dessert from 2:</p>
         ${sum('3 × 9 × 2 = 54 meals')}
         ${ans('13, 21, 54')}`
      )}
      ${tip('Ask yourself: am I choosing one thing (add) or one of each (multiply)? Travelling by bus or plane or train is one choice: add.')}`,

    // y10-8H Q4: evaluating factorials
    // method: Example 16, 8H (evaluating factorials)
    'y10-8h-factorial': `
      <p class="hp-tag">Worked example: evaluate <b>9!</b>, <b>9!/6!</b>, <b>2!/0!</b> and <b>0!/2!</b></p>
      ${steps(
        `<p><strong>n! means n × (n − 1) × ... × 2 × 1.</strong></p>
         ${sum('9! = 9 × 8 × 7 × 6 × 5 × 4 × 3 × 2 × 1 = 362880')}`,
        `<p><strong>A fraction: write both in expanded form and cancel.</strong></p>
         ${sum(`9!/6! = (9 × 8 × 7 × ${now('6 × 5 × 4 × 3 × 2 × 1')}) ÷ (${now('6 × 5 × 4 × 3 × 2 × 1')})<br>= 9 × 8 × 7 = 504`)}`,
        `<p><strong>Remember 0! = 1.</strong></p>
         ${sum('2!/0! = 2 ÷ 1 = 2<br>0!/2! = 1 ÷ 2 = 1/2')}
         ${ans('362880, 504, 2, 1/2')}`
      )}
      ${tip('1! = 1 and 0! = 1 too. A factorial on the bottom that is bigger than the top gives a fraction: type it like 1/2.')}`,

    // y10-8H Q8: passwords where symbols can repeat
    // method: Key ideas 8H (multiplication principle)
    'y10-8h-passwords': `
      <p class="hp-tag">Worked example: how many codes can be made if symbols can be used more than once?</p>
      ${steps(
        `<p><strong>Each position is a separate choice: multiply.</strong> Repeats are allowed, so every position has all the symbols.</p>`,
        `<p><strong>Count.</strong></p>
         ${sum('3 digits from 0 to 9: 10 × 10 × 10 = 1000<br>3 letters from A to Z: 26 × 26 × 26 = 17576<br>6 colours chosen from red, blue, green: 3⁶ = 729')}
         ${ans('1000, 17576, 729')}`
      )}
      ${tip('Repeats allowed: (number of symbols) to the power of (number of positions). Type the whole number, with no commas or spaces.')}`,

    // y10-8H Q11, Q12: simplifying factorials by cancelling
    // method: Example 16b, 8H (expand and cancel), written short as the question shows
    'y10-8h-cancel': `
      <p class="hp-tag">Worked example: simplify <b>10!/8!</b>, <b>30!/29!</b> and <b>30!/(2! 28!) × 14!/15!</b></p>
      ${steps(
        `<p><strong>Write the bigger factorial down to the smaller one,</strong> then cancel.</p>
         ${sum('10!/8! = (10 × 9 × 8!)/8! = 10 × 9 = 90<br>30!/29! = (30 × 29!)/29! = 30')}`,
        `<p><strong>Several factorials: cancel each pair.</strong></p>
         ${sum('30!/(2! 28!) = (30 × 29 × 28!)/(2 × 28!) = (30 × 29)/2 = 435<br>14!/15! = 14!/(15 × 14!) = 1/15')}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('435 × 1/15 = 29')}
         ${ans('90, 30, 29')}`
      )}
      ${tip('Look for factors that cancel before you multiply: 30 ÷ 15 = 2 and 2 ÷ 2 = 1, which leaves just 29.')}`,

    // y10-8H Q13, Q14: factorials with letters
    // method: no book example (the cancelling of Example 16b, 8H, with letters)
    'y10-8h-algebra': `
      <p class="hp-tag">Worked example: simplify <b>5! (x + 2)! ÷ (4! (x + 1)!)</b>, then <b>n!/(n − 3)! × 1/n</b></p>
      ${steps(
        `<p><strong>Each factorial is the one below it times one more number.</strong></p>
         ${sum('5! = 5 × 4!<br>(x + 2)! = (x + 2) × (x + 1)!')}`,
        `<p><strong>Cancel.</strong></p>
         ${sum('5 × 4! × (x + 2) × (x + 1)! ÷ (4! × (x + 1)!)<br>= 5(x + 2) = 5x + 10')}
         ${ans('5x+10')}`,
        `<p><strong>Same idea going down from n.</strong></p>
         ${sum('n!/(n − 3)! = n(n − 1)(n − 2)<br>n(n − 1)(n − 2) × 1/n = (n − 1)(n − 2)')}
         ${ans('(n-1)(n-2)')}`
      )}
      ${tip('Factorise any extra expression (like n² − n = n(n − 1)) so it can cancel too. Type brackets side by side, like (n-1)(n-2).')}`,

    // =====================================================================
    // Year 10 8I Arrangements (10A)
    // =====================================================================
    // y10-8I Q1, Q2, Q3, Q4, Q5: arranging all, or some, of a group
    // method: Example 17, 8I (finding the total number of arrangements)
    'y10-8i-arrange': `
      <p class="hp-tag">Worked example: arrange 12 different objects in a row; then fill first, second and third places from 11 runners.</p>
      ${steps(
        `<p><strong>All of them: draw a box for each position.</strong> 12 choices for the first box, 11 for the next, and so on.</p>
         ${sum('12 × 11 × 10 × ... × 2 × 1 = 12! = 479001600')}`,
        `<p><strong>Only some of them: stop when the boxes run out.</strong> 3 places from 11 runners:</p>
         ${sum('11 × 10 × 9 = 990')}`,
        `<p><strong>The same thing with the rule nPr = n!/(n − r)!:</strong></p>
         ${sum('11P3 = 11!/8! = 990')}
         ${ans('479001600, 990')}`
      )}
      ${tip('Letters of a word with no repeated letters are just different objects. Type the whole number with no commas.')}`,

    // y10-8I Q6, Q7, Q12: some objects must be together
    // method: Example 18a, 8I (treat the objects that are together as one)
    'y10-8i-together': `
      <p class="hp-tag">Worked example: arrange five objects in a row if three of them must be together.</p>
      ${steps(
        `<p><strong>Tie the three together into one block.</strong> Now there are 3 things to arrange: the block and the other 2 objects.</p>
         ${sum('3! = 3 × 2 × 1 = 6')}`,
        `<p><strong>The block can be arranged inside itself.</strong> Multiply by the ways to arrange the three inside it.</p>
         ${sum('3! × 3! = 6 × 6 = 36')}
         ${ans('36')}`,
        `<p><strong>Two groups that must each stay together:</strong> 2 maps and 3 photos, maps grouped and photos grouped. Arrange the 2 groups, then inside each group.</p>
         ${sum('2! × 2! × 3! = 2 × 2 × 6 = 24')}`
      )}
      ${tip('Do not forget the last step: the objects inside the block can swap places among themselves.')}`,

    // y10-8I Q8, Q9, Q11: some objects are identical
    // method: Example 18b, 8I (divide by the arrangements of the identical objects)
    'y10-8i-identical': `
      <p class="hp-tag">Worked example: arrange seven objects in a row if two of them are identical; then the letters of ALFALFA.</p>
      ${steps(
        `<p><strong>First treat every object as different:</strong> that is 7! arrangements.</p>`,
        `<p><strong>Divide by the ways the identical ones can be arranged,</strong> because swapping them does not make a new arrangement.</p>
         ${sum('7!/2! = (7 × 6 × 5 × 4 × 3 × 2 × 1)/(2 × 1)<br>= 7 × 6 × 5 × 4 × 3 = 2520')}`,
        `<p><strong>More than one repeated item: divide by each.</strong> ALFALFA has 7 letters: A three times, L twice and F twice.</p>
         ${sum('7!/(3! × 2! × 2!) = (7 × 6 × 5 × 4 × 3!)/(3! × 2 × 2)<br>= 7 × 6 × 5 = 210')}
         ${ans('2520, 210')}`
      )}
      ${tip('Count each letter of the word carefully before you divide. A letter that appears once needs no division.')}`,

    // y10-8I Q10, Q13, Q14, Q15: making numbers from digits
    // method: Key ideas 8I (the method using boxes); restrictions go in the first box
    'y10-8i-digits': `
      <p class="hp-tag">Worked example: make three-digit numbers from the digits 2, 3, 5, 7 and 9.</p>
      ${steps(
        `<p><strong>No repeats: each box has one fewer choice.</strong></p>
         ${sum('5 × 4 × 3 = 60')}`,
        `<p><strong>Repeats allowed: every box has all 5 digits.</strong></p>
         ${sum('5 × 5 × 5 = 125')}`,
        `<p><strong>A restriction: fill that box first.</strong> Greater than 700 (no repeats): the first digit must be 7 or 9.</p>
         ${sum('2 × 4 × 3 = 24')}
         ${ans('60, 125, 24')}`
      )}
      ${tip('If numbers of different lengths are allowed, count each length on its own and add. Every four-digit number is bigger than every three-digit number.')}`,

    // =====================================================================
    // Year 10 8J Selections (10A)
    // =====================================================================
    // y10-8J Q1, Q2, Q8: evaluating nCr
    // method: Example 19, 8J (evaluating nCr)
    'y10-8j-ncr': `
      <p class="hp-tag">Worked example: evaluate <b>12C3</b>, <b>5C5</b>, <b>(10 choose 8)</b> and <b>100C98</b></p>
      ${steps(
        `<p><strong>Use nCr = n!/(r!(n − r)!).</strong></p>
         ${sum('12C3 = 12!/(3! 9!) = (12 × 11 × 10)/(3 × 2 × 1) = 220')}`,
        `<p><strong>The same rule for the bracket form.</strong></p>
         ${sum('5C5 = 5!/(5! 0!) = 1<br>(10 choose 8) = 10!/(8! 2!) = (10 × 9)/2 = 45')}`,
        `<p><strong>Big numbers: cancel the larger factorial.</strong></p>
         ${sum('100C98 = 100!/(98! 2!) = (100 × 99)/2 = 4950')}
         ${ans('220, 1, 45, 4950')}`
      )}
      ${tip('nC1 = n and nCn = 1. Choosing 98 from 100 is the same count as leaving 2 out.')}`,

    // y10-8J Q3, Q4, Q5: selections where order does not matter
    // method: Example 20, 8J (finding the number of possible selections)
    'y10-8j-select': `
      <p class="hp-tag">Worked example: how many different selections of 3 songs can be chosen from 10?</p>
      ${steps(
        `<p><strong>Order does not matter, so it is a selection: nCr.</strong></p>
         ${sum('10C3 = 10!/(3! 7!)')}`,
        `<p><strong>Cancel and work it out.</strong></p>
         ${sum('(10 × 9 × 8)/(3 × 2 × 1) = 720/6 = 120')}
         ${ans('120')}`,
        `<p><strong>Another way:</strong> arrange 3 of the 10 (10 × 9 × 8), then divide by 3! because each group of 3 was counted once for every order.</p>`
      )}
      ${tip('A team, a group or a set of toppings is a selection. First, second and third places are an arrangement.')}`,

    // y10-8J Q6, Q7, Q10, Q11, Q14: selections from two groups
    // method: Example 21, 8J (making selections from two groups)
    'y10-8j-groups': `
      <p class="hp-tag">Worked example: a group of 4 is chosen from 11 boys and 4 girls.</p>
      ${steps(
        `<p><strong>No restriction: put everyone together.</strong></p>
         ${sum('15C4 = (15 × 14 × 13 × 12)/(4 × 3 × 2 × 1) = 1365')}`,
        `<p><strong>A number from each group: multiply.</strong> 2 boys AND 2 girls.</p>
         ${sum('11C2 × 4C2 = 55 × 6 = 330')}`,
        `<p><strong>"Either ... or", and "at least": add the cases.</strong></p>
         ${sum('Either 3 boys or 3 girls (groups of 3): 11C3 + 4C3 = 165 + 4 = 169<br>At least 3 boys in 4: 11C3 × 4C1 + 11C4 = 165 × 4 + 330 = 990')}
         ${ans('1365, 330, 169, 990')}`
      )}
      ${tip('AND between groups means multiply; OR between cases means add. "At least 3" means 3 or 4 here.')}`,

    // y10-8J Q12, Q13: choosing any number of objects
    // method: no book example (the sum of nCr given in the question)
    'y10-8j-any': `
      <p class="hp-tag">Worked example: how many ways can any number of objects (including none) be chosen from a group of 5?</p>
      ${steps(
        `<p><strong>Add the selections of every size.</strong></p>
         ${sum('5C0 + 5C1 + 5C2 + 5C3 + 5C4 + 5C5<br>= 1 + 5 + 10 + 10 + 5 + 1 = 32')}`,
        `<p><strong>Spot the pattern.</strong> 32 = 2⁵. Each object is either in or out: 2 choices, 5 times. A group of 3 gives 1 + 3 + 3 + 1 = 8 = 2³.</p>`,
        `<p><strong>"At least one" leaves out the empty choice.</strong></p>
         ${sum('32 − 1 = 31')}
         ${ans('32, 31')}`
      )}
      ${tip('Type a power with ^, like 2^5. Use the same in-or-out idea for a group of any size.')}`,

    // =====================================================================
    // Year 10 8K Applications of counting in probability (10A)
    // =====================================================================
    // y10-8K Q1, Q2, Q3, Q6, Q10, Q11: probability of a particular arrangement
    // method: Example 22, 8K (finding probabilities involving arrangements)
    'y10-8k-arrange': `
      <p class="hp-tag">Worked example: nine different photos are put in a row at random.</p>
      ${steps(
        `<p><strong>Count the sample space first.</strong> One particular arrangement is 1 favourable outcome.</p>
         ${sum('All nine: 9! = 362880 → Pr = 1/362880<br>Four of the nine: 9 × 8 × 7 × 6 = 3024 → Pr = 1/3024')}`,
        `<p><strong>Repeats allowed changes the count.</strong> A 3-letter code from the letters A to E:</p>
         ${sum('No repeats: 5 × 4 × 3 = 60 → 1/60<br>Repeats allowed: 5³ = 125 → 1/125')}`,
        `<p><strong>More than one favourable outcome?</strong> Two digits from 1 to 5, no repeats, make a two-digit number: 5 × 4 = 20 numbers, and "24 or 42" is 2 of them.</p>
         ${sum('Pr(24 or 42) = 2/20 = 1/10')}
         ${ans('1/362880, 1/3024, 1/10')}`
      )}
      ${tip('Type the probability as a fraction, like 1/3024.')}`,

    // y10-8K Q4, Q5, Q9, Q13: probability with selections
    // method: Example 23, 8K (finding probabilities involving selections)
    'y10-8k-select': `
      <p class="hp-tag">Worked example: a dealer chooses 3 of her 5 cars and 3 vans at random for a display.</p>
      ${steps(
        `<p><strong>Sample space: choose 3 from 8.</strong></p>
         ${sum('8C3 = 8!/(3! 5!) = 56<br>One particular group: 1/56')}`,
        `<p><strong>Favourable outcomes: choose from each group and multiply.</strong> 2 cars and 1 van:</p>
         ${sum('5C2 × 3C1 = 10 × 3 = 30 → 30/56 = 15/28')}`,
        `<p><strong>"At least" adds cases.</strong> At least 2 cars means 2 cars or 3 cars.</p>
         ${sum('30 + 5C3 = 30 + 10 = 40 → 40/56 = 5/7')}
         ${ans('1/56, 15/28, 5/7')}`
      )}
      ${tip('"Just cars" means all 3 are cars: 5C3 = 10, so 10/56 = 5/28. "At most one van" is the same as "at least 2 cars" here.')}`,

    // y10-8K Q7, Q8: probability when objects are together or identical
    // method: Example 22, 8K, with the restrictions of Example 18, 8I
    'y10-8k-restrict': `
      <p class="hp-tag">Worked example: five children sit in a row at random. Find the probability that two particular children sit together.</p>
      ${steps(
        `<p><strong>Sample space:</strong> all the ways to sit.</p>
         ${sum('5! = 5 × 4!')}`,
        `<p><strong>Favourable: tie the two together.</strong> Arrange 4 things, then the pair inside its block.</p>
         ${sum('4! × 2!')}`,
        `<p><strong>Divide, cancelling the 4!.</strong></p>
         ${sum('Pr(together) = (4! × 2)/(5 × 4!) = 2/5')}
         ${ans('2/5')}`
      )}
      <p><strong>Identical objects:</strong> 5 bikes in a row, 3 of them identical. Total arrangements 5!/3! = 20. With the 3 identical bikes together as one block, there are 3 different things to arrange: 3! = 6. So Pr = 6/20 = 3/10.</p>
      ${tip('Use the same kind of count for the top and the bottom: if the total divides by the identical ones, the favourable count must treat them the same way.')}`,

    // y10-8K Q12: two marbles from a mixed bag
    // method: Example 23, 8K (favourable selections ÷ all selections)
    'y10-8k-marbles': `
      <p class="hp-tag">Worked example: 2 marbles are taken at random, without replacement, from a bag of 4 red, 5 blue and 3 white.</p>
      ${steps(
        `<p><strong>Sample space: choose 2 from 7.</strong></p>
         ${sum('12C2 = (12 × 11)/2 = 66')}`,
        `<p><strong>Favourable: choose both from the group that fits.</strong></p>
         ${sum('Both red: 4C2 = 6 → 6/66 = 1/11')}`,
        `<p><strong>"Red or blue" and "not white": merge the groups first.</strong> Both say the same thing here: 9 marbles.</p>
         ${sum('Each red or blue: 9C2 = 36 → 36/66 = 6/11<br>At least one white = 1 − 6/11 = 5/11')}
         ${ans('1/11, 6/11, 5/11')}`
      )}
      ${tip('A tree diagram gives the same answers: both red = 4/12 × 3/11 = 12/132 = 1/11 ✓.')}`,

    // y10-8K Q14: PINs with a restriction
    // method: no book example (the boxes of 8I with the probability rule of 8K)
    'y10-8k-pins': `
      <p class="hp-tag">Worked example: a three-digit PIN is made at random from the digits 1 to 8, with no digit used twice.</p>
      ${steps(
        `<p><strong>Sample space with boxes.</strong></p>
         ${sum('8 × 7 × 6 = 336<br>One particular PIN: 1/336')}`,
        `<p><strong>A restriction goes in the first box.</strong> Greater than 600 means the first digit is 6, 7 or 8.</p>
         ${sum('3 × 7 × 6 = 126 → 126/336 = 3/8')}`,
        `<p><strong>Two lengths allowed?</strong> Add the counts for both lengths, top and bottom. Three- or four-digit PINs from 1 to 4, greater than 300: three-digit ones start with 3 or 4 (2 × 3 × 2 = 12), and all 4 × 3 × 2 × 1 = 24 four-digit ones count.</p>
         ${sum('Total: 4 × 3 × 2 = 24 three-digit + 24 four-digit = 48<br>(12 + 24)/48 = 36/48 = 3/4')}
         ${ans('1/336, 3/8, 3/4')}`
      )}
      ${tip('Every four-digit PIN is bigger than every three-digit one, so all of them count when the limit is a three-digit number.')}`,
  });
})();
