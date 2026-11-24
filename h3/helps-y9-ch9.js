/* H3 help panels for Year 9 Chapter 9. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 9A to 9L. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers (specs for figures.js) ----
  // Two-circle Venn diagram: circle names, then the numbers for left only, both, right only, outside.
  const venn = (A, B, p, q, r, s) => ({ kind: 'diagram', unit: 30, items: [
    { poly: [[-5, -3], [5, -3], [5, 3.2], [-5, 3.2]] },
    { circle: [-1.2, -0.2, 2.2] }, { circle: [1.2, -0.2, 2.2] },
    { label: A, at: [-1.9, 2.55] }, { label: B, at: [1.9, 2.55] },
    { label: p, at: [-2.2, -0.2] }, { label: q, at: [0, -0.2] }, { label: r, at: [2.2, -0.2] }, { label: s, at: [4.2, -2.5] }] });
  // Tree diagram: stages = [['H', 'T'], ['1', '2', '3']], or stages[k] can be a function of the path
  // so far (choosing without putting back). o.prob(path) labels the branch that ends at path.
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

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 9A Review of probability
    // =====================================================================
    // Y9 9A Q1, Q2: spinners with equal sections
    'y9-9a-spinner': `
      <p class="hp-tag">Worked example: this spinner has five equal sections.</p>
      ${fig({ kind: 'spinner', labels: ['3', '6', '3', '1', '3'] })}
      ${steps(
        `<p><strong>Sample space: each different outcome, written once.</strong> The 3 is on three sections, but you only list it once.</p>
         ${ans('1, 3, 6')}`,
        `<p><strong>Pr = sections that fit ÷ total sections.</strong> Count sections, not numbers: 3 covers 3 of the 5.</p>
         ${sum('Pr(3) = 3/5<br>Pr(not a 3) = 1 − 3/5 = 2/5<br>Pr(1 or 6) = (1 + 1)/5 = 2/5')}`,
        `<p><strong>"At least 3" means 3 or more,</strong> so count every section showing 3 or 6.</p>
         ${sum('Pr(at least 3) = 4/5')}
         ${ans('3/5, 2/5, 2/5, 4/5')}`
      )}
      ${tip('Type a list with commas, like 1, 3, 6, and a probability as a fraction, like 2/5. If every section fits, the answer is 1; if none does, it is 0.')}`,

    // Y9 9A Q3, Q4, Q5, Q7: choosing one object or person at random
    'y9-9a-count': `
      <p class="hp-tag">Worked example: a marble is chosen at random from a bag of 7 green, 3 yellow and 5 blue marbles.</p>
      ${steps(
        `<p><strong>Find the total first.</strong> Every marble is one equally likely outcome.</p>
         ${sum('7 + 3 + 5 = 15 marbles')}`,
        `<p><strong>Pr = number that fit ÷ total, then simplify.</strong></p>
         ${sum('Pr(blue) = 5/15 = 1/3<br>Pr(not blue) = (7 + 3)/15 = 10/15 = 2/3')}
         <p>Check: 1/3 + 2/3 = 1, since "blue" and "not blue" cover everything.</p>`,
        `<p><strong>The extremes.</strong> A bag with no blue marbles gives Pr(blue) = 0. A bag of only blue marbles gives Pr(blue) = 1.</p>
         ${ans('1/3, 2/3')}`
      )}
      <p><strong>People work the same way.</strong> Choosing one of 5 names, each name is 1/5. "Neither Ana nor Bo" leaves the other 3 names: 3/5.</p>
      ${tip('Type a probability as a fraction in simplest form, like 1/3. Type 0 or 1 as a plain number.')}`,

    // Y9 9A Q6, Q10, Q11: a letter from a word
    'y9-9a-letters': `
      <p class="hp-tag">Worked example: a letter is chosen at random from the word <b>BANANA</b>.</p>
      ${steps(
        `<p><strong>Every letter counts, repeats included.</strong> BANANA has 6 letters: B once, A three times, N twice.</p>
         ${chips(['B: 1'], ['A: 3'], ['N: 2'])}`,
        `<p><strong>Pr = copies that fit ÷ 6.</strong></p>
         ${sum('Pr(N) = 2/6 = 1/3<br>Pr(A or N) = (3 + 2)/6 = 5/6<br>Pr(vowel) = 3/6 = 1/2')}`,
        `<p><strong>Describing letters:</strong> "a letter from A to M" is B or A here, so 4 of the 6 letters.</p>
         ${sum('Pr(A to M) = 4/6 = 2/3')}
         ${ans('1/3, 5/6, 1/2, 2/3')}`
      )}
      ${tip('Do not count only the different letters: BANANA has 3 different letters but 6 letters to choose from. A letter that is not in the word, like Z, has probability 0.')}`,

    // Y9 9A Q8, Q12, Q13: numbers, dice and words like "at least"
    'y9-9a-numbers': `
      <p class="hp-tag">Worked example: a number is chosen at random from 1 to 20.</p>
      ${steps(
        `<p><strong>List the numbers that fit, then count.</strong></p>
         ${sum('Multiple of 4: {4, 8, 12, 16, 20} → 5/20 = 1/4<br>Prime: {2, 3, 5, 7, 11, 13, 17, 19} → 8/20 = 2/5')}`,
        `<p><strong>Read the words carefully.</strong> "At least" and "no more than" include the number; "more than" does not.</p>
         ${sum('At least 15: {15, ..., 20} → 6/20 = 3/10<br>More than 15: {16, ..., 20} → 5/20 = 1/4<br>No more than 3: {1, 2, 3} → 3/20')}`,
        `<p><strong>"Or" means either one (or both). "And" means both at once.</strong> Count a number in both lists only once.</p>
         ${sum('Divisible by 3 or 4: 3, 4, 6, 8, 9, 12, 15, 16, 18, 20 → 10/20 = 1/2<br>Divisible by 3 and 4: just 12 → 1/20')}
         ${ans('1/4, 2/5, 3/10, 1/4, 3/20, 1/2, 1/20')}`
      )}
      ${tip('1 is not a prime number, and 1 is a square number (1 × 1). "Less than or equal to" is the same as "no more than".')}`,

    // Y9 9A Q9: a standard deck of cards
    'y9-9a-cards': `
      <p class="hp-tag">Worked example: a card is drawn at random from a standard deck of 52.</p>
      ${steps(
        `<p><strong>Know the deck.</strong> 4 suits of 13 cards. Hearts and diamonds are red; spades and clubs are black. Each suit has one J, Q and K (the picture cards).</p>`,
        `<p><strong>Count the cards that fit, then divide by 52.</strong></p>
         ${sum('A red picture card: 2 suits × 3 = 6 → 6/52 = 3/26<br>A heart: 13/52 = 1/4<br>Not a club: 39/52 = 3/4')}`,
        `<p><strong>"Or": do not count a card twice.</strong> A 5 or a heart: 13 hearts plus the 3 other 5s (the 5 of hearts is already counted).</p>
         ${sum('13 + 3 = 16 → 16/52 = 4/13')}
         ${ans('3/26, 1/4, 3/4, 4/13')}`
      )}
      ${tip('"Any card except ..." is the complement: count the cards left out, take them from 52, then simplify.')}`,

    // Y9 9A Q14: a random moment in some music
    'y9-9a-time': `
      <p class="hp-tag">Worked example: a playlist starts at a random moment. Which song is it in?</p>
      ${fig({ kind: 'table', rows: [['Song', '1', '2', '3', '4', '5'], ['Length (minutes)', '2', '4', '3', '5', '6']] })}
      ${steps(
        `<p><strong>The total time is the sample space.</strong></p>
         ${sum('2 + 4 + 3 + 5 + 6 = 20 minutes')}`,
        `<p><strong>Pr = that song's minutes ÷ total minutes.</strong> A longer song is more likely.</p>
         ${sum('Pr(song 2) = 4/20 = 1/5')}`,
        `<p><strong>Several songs: add their minutes first.</strong></p>
         ${sum('Pr(song 4 or 5) = (5 + 6)/20 = 11/20<br>Pr(a song of 3 minutes or less) = (2 + 3)/20 = 1/4')}
         ${ans('20, 1/5, 11/20, 1/4')}`
      )}
      ${tip('This is not "1 song out of 5": the songs are different lengths, so they are not equally likely.')}`,

    // =====================================================================
    // 9B Venn diagrams and two-way tables
    // =====================================================================
    // Y9 9B Q1, Q2, Q7, Q9, Q10: Venn diagrams from words
    'y9-9b-venn-words': `
      <p class="hp-tag">Worked example: of 30 students, 18 like rock, 13 like pop and 5 like neither.</p>
      ${steps(
        `<p><strong>Find how many are inside the circles,</strong> then the overlap. Adding the circles counts the overlap twice.</p>
         ${sum('Inside: 30 − 5 = 25<br>Both: 18 + 13 − 25 = 6')}`,
        `<p><strong>Fill from the middle out.</strong> "Only" is the circle minus the overlap.</p>
         ${sum('Rock only: 18 − 6 = 12<br>Pop only: 13 − 6 = 7')}
         ${fig(venn('Rock', 'Pop', '12', '6', '7', '5'))}
         ${ans('12, 6, 7, 5')}`,
        `<p><strong>Read off what is asked.</strong></p>
         ${sum('Rock or pop (or both): 12 + 6 + 7 = 25<br>Not pop: 30 − 13 = 17<br>Pr(both) = 6/30 = 1/5<br>Pr(rock only) = 12/30 = 2/5')}`
      )}
      ${tip('Type the regions in the order asked (P, Q, R, S here is left only, both, right only, outside), separated by commas. Check they add to the total. If nobody is outside, the total is just the three inside regions.')}`,

    // Y9 9B Q3: probability from a Venn diagram
    'y9-9b-venn-prob': `
      <p class="hp-tag">Worked example: find each probability from the Venn diagram.</p>
      ${fig(venn('A', 'B', '7', '3', '6', '8'))}
      ${steps(
        `<p><strong>Total first: add all four numbers,</strong> including the one outside the circles.</p>
         ${sum('7 + 3 + 6 + 8 = 24')}`,
        `<p><strong>Add the regions that fit, then divide by 24.</strong></p>
         ${sum('Pr(A) = (7 + 3)/24 = 10/24 = 5/12<br>Pr(A only) = 7/24<br>Pr(not B) = (7 + 8)/24 = 15/24 = 5/8')}`,
        `<p><strong>"And" is the overlap. "Or" is everything inside the circles.</strong></p>
         ${sum('Pr(A and B) = 3/24 = 1/8<br>Pr(A or B) = (7 + 3 + 6)/24 = 16/24 = 2/3<br>Pr(neither) = 8/24 = 1/3')}
         ${ans('5/12, 7/24, 5/8, 1/8, 2/3, 1/3')}`
      )}
      ${tip('"Not B" includes the outside region. Check: Pr(A or B) + Pr(neither) = 1. Type fractions in simplest form, like 5/12.')}`,

    // Y9 9B Q4, Q5, Q8, Q13, Q14: completing a two-way table
    'y9-9b-table': `
      <p class="hp-tag">Worked example: of 50 phones, 26 have a case, 21 have a screen protector and 8 have both.</p>
      ${steps(
        `<p><strong>Draw the table and put in what you know.</strong> "Both" goes in the Case and Protector cell. The totals go at the ends.</p>`,
        `<p><strong>Fill any line with only one gap, again and again.</strong></p>
         ${sum('Case, no protector: 26 − 8 = 18<br>No case, protector: 21 − 8 = 13<br>No case total: 50 − 26 = 24<br>No protector total: 50 − 21 = 29<br>Neither: 24 − 13 = 11 (check: 29 − 18 = 11 ✓)')}
         ${fig({ kind: 'table', rows: [['', 'Protector', 'No protector', 'Total'], ['Case', '8', '18', '26'], ['No case', '13', '11', '24'], ['Total', '21', '29', '50']] })}`,
        `<p><strong>Probabilities: cells ÷ grand total.</strong></p>
         ${sum('Pr(protector) = 21/50<br>Pr(only a protector) = 13/50<br>Pr(case or protector) = 1 − 11/50 = 39/50')}
         ${ans('No case row: 13, 11, 24')}`
      )}
      ${tip('Type a row of the table left to right, with commas. Check that every cell makes sense as a count of people: a whole number, 0 or more.')}`,

    // Y9 9B Q6: two-way table to Venn diagram
    'y9-9b-convert': `
      <p class="hp-tag">Worked example: complete the table, then move it onto a Venn diagram.</p>
      ${fig({ kind: 'table', rows: [['', 'A', 'Not A', 'Total'], ['B', '5', '', '9'], ['Not B', '', '3', ''], ['Total', '12', '', '19']] })}
      ${steps(
        `<p><strong>Complete the table first.</strong></p>
         ${sum('B, not A: 9 − 5 = 4<br>A, not B: 12 − 5 = 7<br>Not B total: 7 + 3 = 10 (check: 9 + 10 = 19 ✓)')}`,
        `<p><strong>Each inside cell is one Venn region.</strong></p>
         ${chips(['A and B → overlap: 5'], ['A, not B → A only: 7'], ['B, not A → B only: 4'], ['Not A, not B → outside: 3'])}`,
        `<p><strong>Draw it.</strong> The totals do not go on the diagram; they are the circles added up.</p>
         ${fig(venn('A', 'B', '7', '5', '4', '3'))}
         ${ans('7, 5, 4, 3')}`
      )}
      ${tip('A only (left circle, outside the overlap) is the cell in the A column and the Not B row. Type the regions in the order P, Q, R, S.')}`,

    // Y9 9B Q11, Q12, Q15: Venn diagrams with letters, and finding the overlap
    'y9-9b-algebra': `
      <p class="hp-tag">Worked example: the regions hold a, b, c and d people.</p>
      ${fig(venn('A', 'B', 'a', 'b', 'c', 'd'))}
      ${steps(
        `<p><strong>Totals are regions added.</strong></p>
         ${sum('n(A) = a + b, n(B) = b + c<br>Not A = c + d<br>Everyone = a + b + c + d')}`,
        `<p><strong>Going the other way, subtract.</strong> Say 40 people, 20 in A, 15 in B and 6 in both.</p>
         ${sum('A only = 20 − 6 = 14, B only = 15 − 6 = 9<br>Neither = 40 − 14 − 6 − 9 = 11')}
         <p>That is the same as 40 − 20 − 15 + 6: take away both circles, then add back the overlap you took away twice. With letters, do the same steps.</p>`,
        `<p><strong>Nobody outside?</strong> 30 people, 19 in A and 17 in B. The two circles add to more than 30 because the overlap is counted twice.</p>
         ${sum('19 + 17 = 36, so overlap = 36 − 30 = 6')}
         ${ans('a+b, 11, 6')}`
      )}
      ${tip('Type expressions with no spaces, like a+b or T-a. Use exactly the letters the question gives you, with capitals where it uses them.')}`,

    // =====================================================================
    // 9C Using set notation
    // =====================================================================
    // Y9 9C Q1, Q2, Q5, Q6, Q13: listing sets, intersection, union, complement
    'y9-9c-list': `
      <p class="hp-tag">Worked example: Ω = {1, 2, ..., 15}, A = multiples of 3, B = factors of 30.</p>
      ${steps(
        `<p><strong>List each set from its rule.</strong></p>
         ${sum('A = {3, 6, 9, 12, 15}<br>B = {1, 2, 3, 5, 6, 10, 15}')}`,
        `<p><strong>∩ (intersection) is in both. ∪ (union) is in either. ′ (complement) is not in it.</strong></p>
         ${sum('A ∩ B = {3, 6, 15}<br>A ∪ B = {1, 2, 3, 5, 6, 9, 10, 12, 15}<br>A′ = {1, 2, 4, 5, 7, 8, 10, 11, 13, 14}<br>B only = A′ ∩ B = {1, 2, 5, 10}')}`,
        `<p><strong>n( ) counts the elements; Pr = n ÷ n(Ω).</strong> For the Venn diagram, count each region.</p>
         ${sum('n(A) = 5, Pr(A) = 5/15 = 1/3<br>Pr(A ∩ B) = 3/15 = 1/5<br>Regions: A only 2, both 3, B only 4, neither 15 − 9 = 6')}
         ${ans('{3, 6, 15}; 1/3, 1/5; 2, 3, 4, 6')}`
      )}
      ${tip('Type a set as its elements in order with commas, like 3, 6, 15 (no curly brackets). A set with nothing in it has 0 elements and probability 0.')}`,

    // Y9 9C Q3, Q8, Q9, Q11: reading the symbols
    'y9-9c-symbols': `
      <p class="hp-tag">Worked example: Ω = {2, 4, 6, 8, 10, 12}, A = {4, 8, 12}, B = {6, 12}.</p>
      ${steps(
        `<p><strong>Learn the symbols.</strong></p>
         ${chips(['8 ∈ A: 8 is an element of A ✓', 'add'], ['6 ∈ A ✗ (6 is not in A)', 'take'], ['A ⊂ Ω: every element of A is in Ω ✓', 'add'], ['∅: the empty set, { }'])}`,
        `<p><strong>Count and test.</strong></p>
         ${sum('n(B) = 2, so n(B′) = 6 − 2 = 4<br>A ∩ B = {12}, which is not ∅<br>Pr(B′) = 4/6 = 2/3')}`,
        `<p><strong>Naming a region:</strong> for each set, write the set if the region is inside it, or its complement if outside, and join them with ∩.</p>
         ${flow(['Inside A, outside B', 'A ∩ B′ (A only)'], ['Inside A or B', 'A ∪ B'])}
         ${ans('True, False, True; 4; 2/3')}`
      )}
      <p><strong>In a two-way table</strong> each inside cell is its row set ∩ its column set, and the totals are n(A), n(B) and so on.</p>
      ${tip('∩ looks like a bridge between two sets: "and". ∪ looks like a cup that holds both: "or".')}`,

    // Y9 9C Q4: probabilities from a diagram, in set notation
    'y9-9c-diagram': `
      <p class="hp-tag">Worked example: find Pr(A ∩ B), Pr(A ∪ B) and Pr(A′).</p>
      ${fig(venn('A', 'B', '8', '5', '10', '7'))}
      ${steps(
        `<p><strong>Total of all four regions:</strong></p>
         ${sum('8 + 5 + 10 + 7 = 30')}`,
        `<p><strong>Translate, then add regions.</strong> ∩ is the overlap; ∪ is all of both circles; A′ is everything outside A.</p>
         ${sum('Pr(A ∩ B) = 5/30 = 1/6<br>Pr(A ∪ B) = (8 + 5 + 10)/30 = 23/30<br>Pr(A′) = (10 + 7)/30 = 17/30')}`,
        `<p><strong>A two-way table?</strong> Fill the missing cells first. Then A ∩ B is the A and B cell, and A′ is the A′ column total.</p>
         ${ans('1/6, 23/30, 17/30')}`
      )}
      ${tip('A′ includes the B only region and the outside region. Type answers as fractions in simplest form, like 1/6.')}`,

    // Y9 9C Q7, Q10: the overlap from n(A), n(B) and n(A ∪ B)
    'y9-9c-formula': `
      <p class="hp-tag">Worked example: each of 50 people owns a cat or a dog (or both). A = cat owners, B = dog owners, n(A) = 32 and n(B) = 27.</p>
      ${steps(
        `<p><strong>Use n(A ∪ B) = n(A) + n(B) − n(A ∩ B).</strong> Everyone is in A ∪ B, so n(A ∪ B) = 50.</p>
         ${sum('50 = 32 + 27 − n(A ∩ B)<br>n(A ∩ B) = 59 − 50 = 9')}`,
        `<p><strong>Then the other regions.</strong></p>
         ${sum('n(A only) = 32 − 9 = 23<br>Pr(A ∪ B) = 50/50 = 1<br>Pr(A′) = (50 − 32)/50 = 18/50 = 9/25')}`,
        `<p><strong>Why subtract?</strong> n(A) + n(B) counts the people in the overlap twice, once in each circle.</p>
         ${ans('9, 23, 1, 9/25')}`
      )}
      ${tip('Check: A only + both + B only = 23 + 9 + 18 = 50, everyone ✓. Type a fraction in simplest form, like 9/25.')}`,

    // =====================================================================
    // 9D Using arrays for two-step experiments
    // =====================================================================
    // Y9 9D Q1, Q2, Q6: an array of outcomes for two separate steps
    'y9-9d-array': `
      <p class="hp-tag">Worked example: one counter is taken from bag X (red, red, blue) and one from bag Y (red, blue, blue, blue).</p>
      ${fig({ kind: 'table', rows: [['X \\ Y', 'R', 'B', 'B', 'B'], ['R', '(R, R)', '(R, B)', '(R, B)', '(R, B)'], ['R', '(R, R)', '(R, B)', '(R, B)', '(R, B)'], ['B', '(B, R)', '(B, B)', '(B, B)', '(B, B)']] })}
      ${steps(
        `<p><strong>Give every counter its own row or column,</strong> even repeated colours. Then every cell is equally likely: 3 × 4 = 12 outcomes.</p>`,
        `<p><strong>Count the cells that fit.</strong></p>
         ${sum('Pr(R, B) = 6/12 = 1/2<br>Same colour: (R, R) 2 cells + (B, B) 3 cells → 5/12')}`,
        `<p><strong>"Exactly one red" counts both orders.</strong></p>
         ${sum('(R, B) 6 cells + (B, R) 1 cell = 7/12')}
         ${ans('12, 1/2, 5/12, 7/12')}`
      )}
      <p><strong>Doubles</strong> sit on the diagonal of a square table. Two 8-sided dice have 8 doubles out of 64, so Pr(double) = 1/8.</p>
      ${tip('Type an outcome as a bracketed pair in the order given, like (3, 1). (3, 1) and (1, 3) are different outcomes.')}`,

    // Y9 9D Q5, Q7, Q11, Q12: tables of totals
    'y9-9d-totals': `
      <p class="hp-tag">Worked example: a spinner (1, 2, 3) is spun and a 4-sided die (1 to 4) is rolled. The numbers are added.</p>
      ${fig({ kind: 'table', rows: [['+', '1', '2', '3', '4'], ['1', '2', '3', '4', '5'], ['2', '3', '4', '5', '6'], ['3', '4', '5', '6', '7']] })}
      ${steps(
        `<p><strong>Fill each cell with the total.</strong> 3 × 4 = 12 cells, all equally likely.</p>`,
        `<p><strong>Count the cells for an event.</strong></p>
         ${sum('Pr(total 7) = 1/12<br>Pr(4 or 5) = (3 + 3)/12 = 1/2<br>Pr(at most 3) = 3/12 = 1/4')}`,
        `<p><strong>Most likely: the total in the most cells.</strong> 4 and 5 both appear 3 times.</p>
         ${ans('1/12, 1/2, 1/4; 4, 5')}`
      )}
      <p><strong>Too big to draw?</strong> Count pairs instead. A spinner from 1 to 10 spun twice: a total of 11 comes from (1, 10), (2, 9), ..., (10, 1), which is 10 pairs out of 10 × 10 = 100, so 1/10.</p>
      ${tip('A total that never appears, like 8 here, has probability 0. If two totals tie for most likely, type both with a comma.')}`,

    // Y9 9D Q3, Q4, Q8, Q9, Q10, Q13: without replacement
    'y9-9d-without': `
      <p class="hp-tag">Worked example: two digits are chosen from {2, 4, 6, 8} without replacement.</p>
      ${fig({ kind: 'table', rows: [['2nd \\ 1st', '2', '4', '6', '8'], ['2', '×', '(4, 2)', '(6, 2)', '(8, 2)'], ['4', '(2, 4)', '×', '(6, 4)', '(8, 4)'], ['6', '(2, 6)', '(4, 6)', '×', '(8, 6)'], ['8', '(2, 8)', '(4, 8)', '(6, 8)', '×']] })}
      ${steps(
        `<p><strong>Cross out the diagonal:</strong> the same card cannot be picked twice. 4 × 3 = 12 outcomes.</p>`,
        `<p><strong>Count the cells.</strong></p>
         ${sum('Pr(6, 2) = 1/12<br>Contains an 8: 3 in the 8 column + 3 in the 8 row = 6/12 = 1/2<br>Both at least 6: (6, 8), (8, 6) → 2/12 = 1/6')}`,
        `<p><strong>Counting without a table.</strong> Choosing 2 letters from PEPPER (6 cards):</p>
         ${sum('With replacement: 6 × 6 = 36<br>Without replacement: 6 × 5 = 30<br>Same letter twice, without: P then P 3 × 2 = 6, E then E 2 × 1 = 2 → 8')}
         ${ans('12, 1/12, 1/2, 1/6; 30, 8')}`
      )}
      ${tip('Repeated letters are separate cards, so two Ps can both be chosen even without replacement. With replacement, Pr(red then white) from 5 different counters is 1/5 × 1/5 = 1/25; without, 1/5 × 1/4 = 1/20.')}`,

    // =====================================================================
    // 9E Using tree diagrams
    // =====================================================================
    // Y9 9E Q1, Q2, Q6, Q11: equally likely branches
    'y9-9e-tree': `
      <p class="hp-tag">Worked example: Jo picks a shirt at random from red, blue, blue, then a cap from white or black.</p>
      ${fig(tree([['R', 'B', 'B'], ['W', 'K']], { heads: ['Shirt', 'Cap'] }))}
      ${steps(
        `<p><strong>One set of branches per stage.</strong> Both blue shirts get their own branch, so all 3 × 2 = 6 paths are equally likely. (K is black.)</p>`,
        `<p><strong>Count the paths that fit.</strong></p>
         ${sum('Pr(blue shirt, white cap) = BW, BW → 2/6 = 1/3<br>Pr(red shirt or black cap) = RW, RK, BK, BK → 4/6 = 2/3')}`,
        `<p><strong>More stages just multiply.</strong> Add a bag with 4 choices and there are 6 × 4 = 24 paths.</p>
         ${ans('6, 1/3, 2/3')}`
      )}
      ${tip('Type an outcome as its letters together in order, like BW. "At least one" is often quickest as 1 − Pr(none).')}`,

    // Y9 9E Q3, Q4, Q10: without replacement, with probabilities on the branches
    'y9-9e-without': `
      <p class="hp-tag">Worked example: a bag has 3 green and 2 yellow counters. Two are taken without putting the first back.</p>
      ${fig(tree([['G', 'Y'], ['G', 'Y']], { heads: ['1st', '2nd'], gap: 1.2, w: 3.4, prob: (p) => ({ G: '3/5', Y: '2/5', GG: '2/4', GY: '2/4', YG: '3/4', YY: '1/4' })[p.join('')] }))}
      ${steps(
        `<p><strong>The second branches change.</strong> After a green is taken, 4 counters are left and only 2 are green.</p>`,
        `<p><strong>Multiply along a path.</strong></p>
         ${sum('Pr(GG) = 3/5 × 2/4 = 6/20 = 3/10')}`,
        `<p><strong>Add the paths that fit.</strong> One of each is GY or YG.</p>
         ${sum('3/5 × 2/4 + 2/5 × 3/4 = 6/20 + 6/20 = 12/20 = 3/5')}
         <p>With replacement the branches stay 3/5 and 2/5: Pr(GG) = 3/5 × 3/5 = 9/25, which is different.</p>
         ${ans('3/10, 3/5')}`
      )}
      <p><strong>Choosing 2 different people from 5</strong> without replacement: 5 first branches, then 4 from each, so 5 × 4 = 20 equally likely outcomes.</p>
      ${tip('The probabilities on each set of branches add to 1. Check: all four path results add to 1 too.')}`,

    // Y9 9E Q5, Q7, Q8, Q9: the same experiment repeated
    'y9-9e-repeat': `
      <p class="hp-tag">Worked example: a coin is tossed 3 times. Then a spinner with Pr(win) = 1/3 is spun 3 times.</p>
      ${steps(
        `<p><strong>Each toss doubles the outcomes:</strong> 2 × 2 × 2 = 8, all equally likely.</p>
         ${chips(['HHH'], ['HHT'], ['HTH'], ['THH'], ['HTT'], ['THT'], ['TTH'], ['TTT'])}
         ${sum('Exactly 2 heads: 3/8<br>At least one head: 1 − 1/8 = 7/8')}`,
        `<p><strong>Unequal chances: multiply along each path.</strong> Lose is 2/3. Exactly one win happens 3 ways (WLL, LWL, LLW), each with the same chance.</p>
         ${sum('1/3 × 2/3 × 2/3 = 4/27<br>3 × 4/27 = 12/27 = 4/9')}`,
        `<p><strong>The rest the same way.</strong></p>
         ${sum('No wins: 2/3 × 2/3 × 2/3 = 8/27<br>All 3 wins: 1/27<br>Exactly 2 wins: 3 × 2/27 = 6/27 = 2/9')}
         ${ans('8, 3/8, 7/8, 4/9')}`
      )}
      <p><strong>Counting the ways:</strong> Pascal's triangle row 1, 3, 3, 1 gives the number of ways to get 0, 1, 2 or 3 heads (or wins).</p>
      ${tip('Check that your answers for 0, 1, 2 and 3 wins add to 1: 8/27 + 12/27 + 6/27 + 1/27 = 1.')}`,

    // =====================================================================
    // 9F Using relative frequencies to estimate probabilities
    // =====================================================================
    // Y9 9F Q1, Q2, Q3, Q5, Q9, Q10, Q11: experimental probability and expected number
    'y9-9f-expected': `
      <p class="hp-tag">Worked example: a counter is drawn and put back 160 times, and 48 are blue.</p>
      ${steps(
        `<p><strong>Experimental probability = times it happened ÷ trials.</strong></p>
         ${sum('Pr(blue) ≈ 48/160 = 3/10')}`,
        `<p><strong>Expected number = probability × number of trials.</strong></p>
         ${sum('In 700 draws: 3/10 × 700 = 210 blues')}`,
        `<p><strong>When the probability is known, use it.</strong> A fair die rolled 240 times: Pr(1 or 2) = 2/6.</p>
         ${sum('2/6 × 240 = 80 times')}
         ${ans('3/10, 210, 80')}`
      )}
      <p><strong>Fair or biased?</strong> Compare the results with what a fair coin or die would give. The more trials there are, the more you can trust the comparison.</p>
      ${tip('A fraction or a decimal is fine for a probability, like 3/10 or 0.3. Expected numbers are estimates, not promises.')}`,

    // Y9 9F Q4, Q6, Q7, Q8: results in a frequency table
    'y9-9f-table': `
      <p class="hp-tag">Worked example: a spinner with regions A, B and C (not the same size) was spun 60 times.</p>
      ${fig({ kind: 'table', rows: [['Region', 'A', 'B', 'C'], ['Frequency', '31', '19', '10']] })}
      ${steps(
        `<p><strong>Trials = the total of the frequencies</strong> (31 + 19 + 10 = 60). Then frequency ÷ 60.</p>
         ${sum('Pr(A) = 31/60<br>Pr(B or C) = (19 + 10)/60 = 29/60')}`,
        `<p><strong>Expected number in more spins.</strong> In 240 spins:</p>
         ${sum('31/60 × 240 = 124 times on A')}`,
        `<p><strong>Guessing the real sizes:</strong> 31/60 ≈ 0.52, 19/60 ≈ 0.32, 10/60 ≈ 0.17. Those are close to 1/2, 1/3 and 1/6.</p>
         ${ans('31/60, 29/60, 124; 1/2, 1/3, 1/6')}`
      )}
      ${tip('More trials give a better estimate, so trust the result from the most trials. Cards with letters work the same way: a letter that comes up about 2/3 of the time is probably on 2 of 3 cards.')}`,

    // Y9 9F Q12: darts and areas
    'y9-9f-area': `
      <p class="hp-tag">Worked example: 80 darts hit a 50 cm by 30 cm board at random. How many land in the shaded triangle?</p>
      ${fig({ kind: 'diagram', unit: 5, items: [{ poly: [[0, 0], [50, 0], [50, 30], [0, 30]] }, { poly: [[15, 8], [35, 8], [22, 23]], fill: true }, { seg: [22, 8, 22, 23], dash: true }, { dim: [15, 8, 35, 8], label: '20 cm', off: -4 }, { dim: [35, 8, 35, 23], label: '15 cm', off: -4 }, { dim: [0, 0, 50, 0], label: '50 cm', off: -4 }, { dim: [50, 0, 50, 30], label: '30 cm', off: -5 }] })}
      ${steps(
        `<p><strong>Find both areas.</strong></p>
         ${sum('Board: 50 × 30 = 1500 cm²<br>Triangle: ½ × 20 × 15 = 150 cm²')}`,
        `<p><strong>Pr = target area ÷ board area.</strong></p>
         ${sum('150/1500 = 1/10')}`,
        `<p><strong>Expected darts = Pr × darts thrown.</strong></p>
         ${sum('1/10 × 80 = 8 darts')}
         ${ans('8')}`
      )}
      <p><strong>Shapes with a hole:</strong> shaded area = whole shape − the hole. For circles, π cancels: a circle of radius 3 inside one of radius 5 takes up 9π/25π = 9/25 of it.</p>
      ${tip('Keep the units the same for both areas. Type just the number of darts.')}`,

    // Y9 9F Q13, Q14: estimating what is in a bag
    'y9-9f-bag': `
      <p class="hp-tag">Worked example: a bag holds 12 counters. One is drawn and put back 60 times: red 25, blue 20, white 15.</p>
      ${steps(
        `<p><strong>Find each experimental probability.</strong></p>
         ${sum('Red 25/60, blue 20/60, white 15/60')}`,
        `<p><strong>Multiply each by the number of counters in the bag.</strong></p>
         ${sum('Red: 25/60 × 12 = 5<br>Blue: 20/60 × 12 = 4<br>White: 15/60 × 12 = 3')}`,
        `<p><strong>Check they add to the bag's total.</strong> 5 + 4 + 3 = 12 ✓</p>
         ${ans('5, 4, 3')}`
      )}
      ${tip('Round each estimate to a whole number of counters, and type them in the order the question lists the colours.')}`,

    // =====================================================================
    // 9G Data and sampling
    // =====================================================================
    // Y9 9G Q1, Q2, Q3, Q7, Q10: types of data
    'y9-9g-types': `
      <p class="hp-tag">Worked example: classify each type of data.</p>
      ${steps(
        `<p><strong>Numbers or words?</strong> Numbers you can do maths with are <b>numerical</b>. Groups or labels are <b>categorical</b>.</p>`,
        `<p><strong>Numerical: counted or measured?</strong></p>
         ${flow(['Counted, only certain values', 'discrete: goals in a match'], ['Measured, any value in a range', 'continuous: height of a sunflower'])}`,
        `<p><strong>Categorical: is there a natural order?</strong></p>
         ${flow(['Has an order', 'ordinal: film rating G, PG, M'], ['No order', 'nominal: favourite sport'])}
         ${ans('Numerical discrete, numerical continuous, categorical ordinal, categorical nominal')}`
      )}
      ${tip('Ask: can a value fall between two others? If it can only take set steps, like whole numbers, it is discrete. Lengths, masses and times are continuous.')}`,

    // Y9 9G Q4, Q5, Q8, Q11, Q12: sampling methods and bias
    'y9-9g-methods': `
      <p class="hp-tag">Worked example: a council wants to know what residents think of a new skate park.</p>
      ${steps(
        `<p><strong>Name the method by how people are picked.</strong></p>
         ${chips(['Names drawn at random from the full list: simple random'], ['Every 20th person through the library door: systematic'], ['Sorted into age groups, then some from each group at random: stratified'])}`,
        `<p><strong>Look for bias.</strong> A sample is biased if some people are much more likely to be in it, or less likely to answer honestly.</p>
         ${chips(['Asking only at the skate park', 'take'], ['An online poll anyone can answer', 'take'])}`,
        `<p><strong>Fix it:</strong> choose at random from the whole group you want to know about, and let people answer privately.</p>
         ${ans('simple random, systematic, stratified')}`
      )}
      ${tip('Stratified means each group gets its fair share of the sample, chosen at random inside the group. Systematic means every nth one from a list or a line.')}`,

    // Y9 9G Q6, Q9: stratified sample sizes
    'y9-9g-stratified': `
      <p class="hp-tag">Worked example: Year 7 has 90 students and Year 8 has 60. A stratified sample of 20 is chosen.</p>
      ${steps(
        `<p><strong>Find the whole population.</strong></p>
         ${sum('90 + 60 = 150 students')}`,
        `<p><strong>Each group gets its share of the sample.</strong></p>
         ${sum('Year 7: 90/150 × 20 = 12<br>Year 8: 60/150 × 20 = 8')}`,
        `<p><strong>Check they add to the sample size.</strong> 12 + 8 = 20 ✓</p>
         ${ans('12, 8')}`
      )}
      ${tip('Simplify the fraction first if it helps: 90/150 = 3/5, and 3/5 of 20 is 12.')}`,

    // =====================================================================
    // 9H Mean, median and mode
    // =====================================================================
    // Y9 9H Q1, Q2, Q4: mean, median and mode
    'y9-9h-centre': `
      <p class="hp-tag">Worked example: find the mean, median and mode of <b>6, −2, 9, 4, −2, 11, 4, 2</b>.</p>
      ${steps(
        `<p><strong>Mean = total ÷ how many.</strong></p>
         ${sum('6 + (−2) + 9 + 4 + (−2) + 11 + 4 + 2 = 32<br>32 ÷ 8 = 4')}`,
        `<p><strong>Median: sort, then find the middle.</strong> 8 values, so halfway between the 4th and 5th.</p>
         ${sum('−2, −2, 2, ' + now('4, 4') + ', 6, 9, 11 → (4 + 4) ÷ 2 = 4')}`,
        `<p><strong>Mode: the most common value.</strong> −2 and 4 both appear twice, so there are two modes (bi-modal).</p>
         ${ans('mean 4, median 4, modes -2, 4')}`
      )}
      ${tip('Several modes: type them all with commas, like -2, 4. If no value repeats, type none. Round a mean only at the end, for example 12.833 to 12.83.')}`,

    // Y9 9H Q3, Q9: the effect of an outlier
    'y9-9h-outlier': `
      <p class="hp-tag">Worked example: <b>12, 15, 14, 13, 16, 62</b>.</p>
      ${steps(
        `<p><strong>Spot the outlier:</strong> 62 is far from the others.</p>`,
        `<p><strong>Mean and median with it.</strong></p>
         ${sum('Mean: 132 ÷ 6 = 22<br>Median: 12, 13, ' + now('14, 15') + ', 16, 62 → 14.5')}`,
        `<p><strong>And without it.</strong></p>
         ${sum('Mean: 70 ÷ 5 = 14 (it changes by 8)<br>Median: 12, 13, ' + now('14') + ', 15, 16 → 14 (it changes by 0.5)')}
         ${ans('62; mean 22, median 14.5')}`
      )}
      ${tip('An outlier drags the mean a long way but barely moves the median, so the median is the better "typical" value. Negative outliers pull the mean down. Type large money values as digits only.')}`,

    // Y9 9H Q5, Q6, Q7, Q13: the score needed for a target mean
    'y9-9h-target': `
      <p class="hp-tag">Worked example: Ari's scores are <b>14, 17, 12, 15</b>. What does he need in a fifth game for a mean of 16?</p>
      ${steps(
        `<p><strong>Total needed = mean × number of values.</strong></p>
         ${sum('16 × 5 = 80')}`,
        `<p><strong>Subtract what he already has.</strong></p>
         ${sum('14 + 17 + 12 + 15 = 58<br>80 − 58 = 22')}`,
        `<p><strong>As a rule</strong>, with k for the fifth score and M for the mean:</p>
         ${sum('M = (58 + k)/5, so k = 5M − 58')}
         ${ans('22')}`
      )}
      ${tip('"At least" a mean: the score you find is the lowest that works. Type a rule with brackets, like M=(58+k)/5. If the score needed is above the maximum possible, the target cannot be reached.')}`,

    // Y9 9H Q8: building a set with a given mean, median and mode
    'y9-9h-build': `
      <p class="hp-tag">Worked example: find five numbers with mean 7, median 6 and mode 10.</p>
      ${steps(
        `<p><strong>Place the median and mode.</strong> The median is the 3rd number. The mode needs two 10s, which go at the top.</p>
         ${sum('?, ?, 6, 10, 10')}`,
        `<p><strong>Use the mean for the total.</strong></p>
         ${sum('Total = 5 × 7 = 35<br>Missing two = 35 − 6 − 10 − 10 = 9')}`,
        `<p><strong>Choose two different numbers below 6 that add to 9:</strong> 4 and 5.</p>
         ${sum('4, 5, 6, 10, 10 ✓')}
         ${ans('4, 5, 6, 10, 10')}`
      )}
      ${tip('When choosing from options, test each one: sort it, then check the median, the mode and the mean.')}`,

    // Y9 9H Q11, Q12: centre from a dot plot, and moving the median
    'y9-9h-dotplot': `
      <p class="hp-tag">Worked example: the number of pets in some households.</p>
      ${fig({ kind: 'dotplot', min: 0, max: 4, values: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4], xlabel: 'Number of pets' })}
      ${steps(
        `<p><strong>Count the dots:</strong> 2 + 8 + 4 + 4 + 2 = 20 households.</p>`,
        `<p><strong>Mean: value × dots, add, divide.</strong></p>
         ${sum('0 × 2 + 1 × 8 + 2 × 4 + 3 × 4 + 4 × 2 = 36<br>36 ÷ 20 = 1.8')}`,
        `<p><strong>Median: halfway between the 10th and 11th dots.</strong> Counting from the left, dots 3 to 10 are on 1 and dot 11 is on 2. The mode is the tallest stack, 1.</p>
         ${sum('(1 + 2) ÷ 2 = 1.5')}
         ${ans('20, 1.8, 1.5, 1')}`
      )}
      <p><strong>Moving the median:</strong> in 1, 4, 4, 4, 4, 7, 9 the median is 4. Each value added above shifts the middle half a place right. It takes 3 big values before the middle passes the last 4.</p>
      ${tip('One extra value far away moves the median at most half a step, but it can move the mean a lot.')}`,

    // =====================================================================
    // 9I Stem-and-leaf plots
    // =====================================================================
    // Y9 9I Q1, Q2, Q5: drawing an ordered stem-and-leaf plot
    'y9-9i-build': `
      <p class="hp-tag">Worked example: <b>17, 24, 31, 26, 38, 22, 45, 29, 33, 26, 21, 52, 28, 26, 36</b>.</p>
      ${steps(
        `<p><strong>Stems are the tens, leaves are the ones.</strong> Write the leaves in order and space them evenly.</p>
         ${fig({ kind: 'stemleaf', rows: [['1', '7'], ['2', '1 2 4 6 6 6 8 9'], ['3', '1 3 6 8'], ['4', '5'], ['5', '2']], key: '3 | 1 means 31' })}`,
        `<p><strong>Median and mode.</strong> 15 values, so the median is the 8th: count leaves from the top. The mode is the most repeated leaf.</p>
         ${sum('8th value = 28, mode = 26<br>Less than 25: 17, 21, 22, 24 → 4 values')}`,
        `<p><strong>Shape:</strong> the leaves bunch near the top and trail off to the bigger values, so it is positively skewed.</p>
         ${ans('median 28, mode 26, positively skewed')}`
      )}
      ${tip('For decimals, the stem is the whole number and the leaf is the tenths: 3 | 4 means 3.4. A tail towards the big numbers is positive skew; towards the small numbers, negative skew.')}`,

    // Y9 9I Q6, Q8: reading a stem-and-leaf plot
    'y9-9i-read': `
      <p class="hp-tag">Worked example: Mia's times, in seconds, for 10 runs.</p>
      ${fig({ kind: 'stemleaf', rows: [['11', '5 8'], ['12', '0 3 3 6 9'], ['13', '2 4 7']], key: '12 | 3 means 12.3 seconds' })}
      ${steps(
        `<p><strong>Median:</strong> 10 values, so halfway between the 5th and 6th.</p>
         ${sum('(12.3 + 12.6) ÷ 2 = 12.45')}`,
        `<p><strong>Fastest to slowest:</strong> the first and last leaves.</p>
         ${sum('13.7 − 11.5 = 2.2 seconds')}`,
        `<p><strong>Adding a value:</strong> a run of 11.9 makes 11 values, so the median becomes the 6th: 12.3. It changes by 12.45 − 12.3 = 0.15.</p>
         ${ans('12.45, 2.2, 0.15')}`
      )}
      <p><strong>Unknown digits:</strong> in an ordered plot the leaves never go down along a row. In the row <b>5 | 1 k 4 8</b>, k must be from 1 to 4.</p>
      ${tip('Type several possible values with commas, like 1, 2, 3, 4.')}`,

    // Y9 9I Q3, Q4, Q7, Q9, Q11: back-to-back stem-and-leaf plots
    'y9-9i-backtoback': `
      <p class="hp-tag">Worked example: quiz scores for two classes, 8 students each.</p>
      ${fig({ kind: 'stemleaf', rows: [['1', '8'], ['2', '4 6'], ['3', '1 3 5 7'], ['4', '2']], back: [['', '9 5 2'], ['', '8 3 3 1'], ['', '4'], ['', '']], backLabel: 'Class X', leafLabel: 'Class Y', key: '3 | 1 means 31' })}
      ${steps(
        `<p><strong>Read the left side from the stem outwards.</strong> Class X is 12, 15, 19, 21, 23, 23, 28, 34. Class Y is 18, 24, 26, 31, 33, 35, 37, 42.</p>`,
        `<p><strong>Compare medians</strong> (halfway between the 4th and 5th of each).</p>
         ${sum('X: (21 + 23) ÷ 2 = 22<br>Y: (31 + 33) ÷ 2 = 32, so Class Y scored higher')}`,
        `<p><strong>Percentages and combining.</strong> Y above 30: 5 of 8 = 62.5%. All 16 together: the median is halfway between the 8th and 9th, 24 and 26.</p>
         ${sum('5/8 × 100 = 62.5%<br>Combined median: (24 + 26) ÷ 2 = 25')}
         ${ans('22, 32, 62.5, 25')}`
      )}
      ${tip('A split stem like 2 and 2* holds leaves 0 to 4 and 5 to 9. Type a percentage as a number, like 62.5.')}`,

    // Y9 9I Q12: mean against median for a skewed plot
    'y9-9i-skew': `
      <p class="hp-tag">Worked example: find the mean and median, and compare them.</p>
      ${fig({ kind: 'stemleaf', rows: [['1', '8'], ['2', '4 9'], ['3', '3 5 7'], ['4', '1 2 6 6 8']], key: '3 | 5 means 35' })}
      ${steps(
        `<p><strong>Mean: add all 11 values.</strong></p>
         ${sum('18 + 24 + 29 + 33 + 35 + 37 + 41 + 42 + 46 + 46 + 48 = 399<br>399 ÷ 11 = 36.27 (2 decimal places)')}`,
        `<p><strong>Median: the 6th value,</strong> which is 37.</p>`,
        `<p><strong>The tail drags the mean.</strong> The tail points to the small numbers (negatively skewed), so the mean sits below the median.</p>
         ${ans('36.27, 37')}`
      )}
      ${tip('Count the leaves before you divide, so you know how many values there are. Round the mean only at the very end.')}`,

    // =====================================================================
    // 9J Grouping data into classes
    // =====================================================================
    // Y9 9J Q1, Q2, Q3, Q7, Q11: frequency and percentage frequency tables
    'y9-9j-freq': `
      <p class="hp-tag">Worked example: group these 20 values into the classes 0-, 10-, 20- and 30-.<br><b>12, 27, 5, 31, 18, 22, 9, 14, 35, 26, 11, 3, 29, 17, 24, 38, 15, 21, 8, 19</b></p>
      ${steps(
        `<p><strong>Tally each value into its class.</strong> 10- means 10 up to (not including) 20.</p>`,
        `<p><strong>Percentage frequency = frequency ÷ total × 100.</strong></p>
         ${fig({ kind: 'table', rows: [['Class', '0-', '10-', '20-', '30-'], ['Frequency', '4', '7', '6', '3'], ['Percentage frequency', '20', '35', '30', '15']] })}
         ${sum('7 ÷ 20 × 100 = 35')}`,
        `<p><strong>Questions about ranges: add whole classes.</strong></p>
         ${sum('Fewer than 20: 4 + 7 = 11 values, which is 55%')}
         ${ans('4, 7, 6, 3 and 20, 35, 30, 15')}`
      )}
      ${tip('Check the frequencies add to the total and the percentages add to 100. Round percentages only when asked, for example 5 out of 70 is 7.14%.')}`,

    // Y9 9J Q4, Q6, Q9, Q10: reading histograms
    'y9-9j-histogram': `
      <p class="hp-tag">Worked example: a percentage frequency histogram of fish lengths.</p>
      ${fig({ kind: 'columns', histogram: true, cats: ['', '', '', '', ''], values: [15, 30, 25, 20, 10], edges: ['0', '4', '8', '12', '16', '20'], ymax: 35, step: 5, xlabel: 'Length (cm)', ylabel: '% Frequency' })}
      ${steps(
        `<p><strong>Each column is one class.</strong> The 8 to 12 cm column is 25% of the fish.</p>`,
        `<p><strong>Add columns for a range.</strong></p>
         ${sum('Less than 8 cm: 15 + 30 = 45%<br>At least 12 cm: 20 + 10 = 30%')}`,
        `<p><strong>Back to a count:</strong> percentage of the total. If 80 fish were measured:</p>
         ${sum('8 to 12 cm: 25% of 80 = 20 fish')}
         ${ans('45, 30, 20')}`
      )}
      <p><strong>Shape:</strong> a hump in the middle with matching sides is symmetrical; a long tail on one side is skewed.</p>
      ${tip('Read the class edges under the joins: the column from 8 to 12 holds values from 8 up to 12. Type a percentage as a number, like 45.')}`,

    // Y9 9J Q5: missing values in a frequency table
    'y9-9j-unknowns': `
      <p class="hp-tag">Worked example: find a to f.</p>
      ${fig({ kind: 'table', rows: [['Class', 'Frequency', 'Percentage frequency'], ['0-', 'a', '15'], ['5-', '14', 'b'], ['10-', 'c', '30'], ['15-19', 'd', 'e'], ['Total', '40', 'f']] })}
      ${steps(
        `<p><strong>Percentage to frequency: percentage of the total.</strong></p>
         ${sum('a = 15% of 40 = 6<br>c = 30% of 40 = 12')}`,
        `<p><strong>Frequency to percentage: ÷ total × 100.</strong></p>
         ${sum('b = 14 ÷ 40 × 100 = 35')}`,
        `<p><strong>The last row from the total.</strong></p>
         ${sum('d = 40 − 6 − 14 − 12 = 8<br>e = 8 ÷ 40 × 100 = 20<br>f = 100')}
         ${ans('6, 35, 12, 8, 20, 100')}`
      )}
      ${tip('The percentage column always totals 100. Check: 15 + 35 + 30 + 20 = 100.')}`,

    // =====================================================================
    // 9K Measures of spread: range and interquartile range
    // =====================================================================
    // Y9 9K Q1, Q2: quartiles with an odd number of values
    'y9-9k-odd': `
      <p class="hp-tag">Worked example: <b>15, 8, 22, 4, 17, 11, 9, 26, 13, 6, 19</b>.</p>
      ${steps(
        `<p><strong>Sort, then find the median.</strong> 11 values, so the 6th.</p>
         ${sum('4, 6, 8, 9, 11, ' + now('13') + ', 15, 17, 19, 22, 26 → Q2 = 13<br>Range = 26 − 4 = 22')}`,
        `<p><strong>Leave the median out. Each quartile is the middle of its half.</strong></p>
         ${sum('Lower half 4, 6, ' + now('8') + ', 9, 11 → Q1 = 8<br>Upper half 15, 17, ' + now('19') + ', 22, 26 → Q3 = 19')}`,
        `<p><strong>IQR = Q3 − Q1.</strong></p>
         ${sum('19 − 8 = 11')}
         ${ans('range 22, Q1 8, Q2 13, Q3 19, IQR 11')}`
      )}
      ${tip('If each half has an even number of values, its quartile is halfway between its two middle values. Type a sorted list with commas.')}`,

    // Y9 9K Q3, Q4, Q5, Q11: quartiles with an even number of values
    'y9-9k-even': `
      <p class="hp-tag">Worked example: <b>34, 27, 45, 21, 38, 30, 52, 25, 41, 36, 29, 48</b>.</p>
      ${steps(
        `<p><strong>Sort and split into two halves of 6.</strong> The median is halfway between the middle two.</p>
         ${sum('21, 25, 27, 29, 30, 34 | 36, 38, 41, 45, 48, 52<br>Q2 = (34 + 36) ÷ 2 = 35')}`,
        `<p><strong>Quartiles: the median of each half.</strong></p>
         ${sum('Q1 = (27 + 29) ÷ 2 = 28<br>Q3 = (41 + 45) ÷ 2 = 43')}`,
        `<p><strong>Spread.</strong></p>
         ${sum('IQR = 43 − 28 = 15<br>Range = 52 − 21 = 31')}
         ${ans('Q1 28, Q2 35, Q3 43, IQR 15, range 31')}`
      )}
      ${tip('The IQR is the spread of the middle 50% of the data. A smaller IQR means more consistent values. Q1 sits a quarter of the way up the sorted list, and Q3 three quarters of the way up.')}`,

    // Y9 9K Q6, Q7: IQR from a frequency table or stem-and-leaf plot
    'y9-9k-table': `
      <p class="hp-tag">Worked example: goals scored by a team in 20 games.</p>
      ${fig({ kind: 'table', rows: [['Goals', '0', '1', '2', '3', '4'], ['Frequency', '4', '5', '6', '3', '2']] })}
      ${steps(
        `<p><strong>Running totals tell you where each value sits.</strong></p>
         ${sum('0: values 1-4, 1: values 5-9, 2: values 10-15, 3: values 16-18, 4: values 19-20')}`,
        `<p><strong>Median: halfway between the 10th and 11th,</strong> both 2. Each half has 10 values.</p>
         ${sum('Q1: 5th and 6th values, both 1 → Q1 = 1<br>Q3: 15th and 16th, 2 and 3 → Q3 = 2.5')}`,
        `<p><strong>Subtract.</strong></p>
         ${sum('IQR = 2.5 − 1 = 1.5')}
         ${ans('median 2, IQR 1.5')}`
      )}
      ${tip('A stem-and-leaf plot is already sorted: count leaves to find the positions. A frequency of 0 means that value is not in the list.')}`,

    // Y9 9K Q8, Q9, Q10: reasoning about range and IQR
    'y9-9k-reason': `
      <p class="hp-tag">Worked example: what happens to <b>2, 3, 5, 6, 8, 9</b> if the 2 is mistyped as −30?</p>
      ${steps(
        `<p><strong>Work out the measures before.</strong></p>
         ${sum('Range = 9 − 2 = 7, Q1 = 3, median 5.5, Q3 = 8, IQR = 5')}`,
        `<p><strong>And after.</strong> Only the bottom value changed, and it stays at the bottom.</p>
         ${sum('Range = 9 − (−30) = 39; Q1, median and Q3 do not move')}`,
        `<p><strong>To test a "could it ever?" question, build a small example</strong> and see if it works, or find the rule that blocks it.</p>
         ${ans('Range changes; quartiles do not')}`
      )}
      ${tip('The range uses only the two extreme values. The quartiles use the middle of the sorted list, so one extreme value cannot reach them.')}`,

    // =====================================================================
    // 9L Box plots
    // =====================================================================
    // Y9 9L Q1, Q2: reading a box plot
    'y9-9l-read': `
      <p class="hp-tag">Worked example: the time 60 students took to get to school.</p>
      ${fig({ kind: 'boxplot', min: 4, max: 30, step: 2, xlabel: 'Time (minutes)', plots: [{ five: [6, 10, 14, 20, 28] }] })}
      ${steps(
        `<p><strong>Read the five numbers:</strong> whisker end, box start, middle line, box end, whisker end.</p>
         ${sum('Min 6, Q1 10, median 14, Q3 20, max 28')}`,
        `<p><strong>Spread.</strong></p>
         ${sum('Range = 28 − 6 = 22<br>IQR = 20 − 10 = 10')}`,
        `<p><strong>Each section holds 25% of the data.</strong> 25% took less than 10 minutes, 50% more than 14, and 75% less than 20.</p>
         ${sum('Less than 10 minutes: 25% of 60 = 15 students')}
         ${ans('22, 10, 15')}`
      )}
      ${tip('A long section does not hold more data: every section holds a quarter. It just means those values are more spread out.')}`,

    // Y9 9L Q3, Q4, Q11: five-number summary, outliers, drawing the plot
    'y9-9l-build': `
      <p class="hp-tag">Worked example: <b>13, 8, 35, 11, 4, 16, 10, 19, 7, 14, 11, 17</b>.</p>
      ${steps(
        `<p><strong>Sort and find the five numbers.</strong> 12 values, so halves of 6.</p>
         ${sum('4, 7, 8, 10, 11, 11 | 13, 14, 16, 17, 19, 35<br>Q2 = (11 + 13) ÷ 2 = 12<br>Q1 = (8 + 10) ÷ 2 = 9, Q3 = (16 + 17) ÷ 2 = 16.5')}`,
        `<p><strong>Test for outliers.</strong> A common test: more than 1.5 × IQR beyond the box.</p>
         ${sum('IQR = 16.5 − 9 = 7.5<br>16.5 + 1.5 × 7.5 = 27.75, and 35 is beyond it')}`,
        `<p><strong>Draw it.</strong> The whisker stops at the highest value that is not an outlier (19), and 35 is a cross.</p>
         ${fig({ kind: 'boxplot', min: 0, max: 40, step: 5, plots: [{ five: [4, 9, 12, 16.5, 19], outliers: [35] }] })}
         ${ans('4, 9, 12, 16.5, 35')}`
      )}
      ${tip('With an odd number of values, leave the median out of both halves. Between Q1 and Q3 lies 50% of the data.')}`,

    // Y9 9L Q5, Q6, Q7: comparing parallel box plots
    'y9-9l-compare': `
      <p class="hp-tag">Worked example: minutes spent on homework by two classes.</p>
      ${fig({ kind: 'boxplot', min: 0, max: 35, step: 5, xlabel: 'Minutes', plots: [{ label: 'Class A', five: [10, 14, 18, 22, 28] }, { label: 'Class B', five: [6, 12, 15, 25, 30] }] })}
      ${steps(
        `<p><strong>Compare the centres.</strong> Medians: A 18, B 15, so Class A typically spent longer.</p>`,
        `<p><strong>Compare the spreads.</strong></p>
         ${sum('A: IQR 22 − 14 = 8, range 28 − 10 = 18<br>B: IQR 25 − 12 = 13, range 30 − 6 = 24')}
         <p>Class A has the smaller IQR and range, so it is more consistent.</p>`,
        `<p><strong>Percentages come from the five numbers.</strong> More than 14 minutes in A: from Q1 up, 75%. Less than 15 in B: below the median, 50%.</p>
         ${ans('A higher median, A more consistent; 75, 50')}`
      )}
      ${tip('Compare like with like: median with median, IQR with IQR. Read each value straight down to the scale.')}`,

    // Y9 9L Q8, Q9, Q10: properties of box plots
    'y9-9l-property': `
      <p class="hp-tag">Worked example: draw the box plot of <b>3, 5, 5, 5, 8, 10</b>.</p>
      ${steps(
        `<p><strong>Find the five numbers.</strong></p>
         ${sum('3, 5, 5 | 5, 8, 10<br>Median = (5 + 5) ÷ 2 = 5, Q1 = 5, Q3 = 8')}`,
        `<p><strong>Look at the picture.</strong> The median line sits on the left edge of the box, because the median equals Q1.</p>
         ${fig({ kind: 'boxplot', min: 2, max: 11, step: 1, plots: [{ five: [3, 5, 5, 8, 10] }] })}`,
        `<p><strong>To test a property, work out the five numbers for each option</strong> and check which pair is equal.</p>
         ${ans('min 3, Q1 5, median 5, Q3 8, max 10')}`
      )}
      ${tip('The mean is not shown on a box plot. Work it out separately if a question asks about it.')}`
  });
})();
