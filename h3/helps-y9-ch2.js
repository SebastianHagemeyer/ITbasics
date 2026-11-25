/* H3 help panels for Year 9 Chapter 2. Loaded with bank-y9.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y9-". */
/* Help panels for Year 9 2A to 2K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  const q = (v) => Math.round(v * 1000) / 1000;

  // Number line with a ray or a segment, drawn the same way as the question figures.
  // a or b = null means the line runs off that end with an arrow. Closed = filled circle (included).
  const nl = (min, max, a, aClosed, b, bClosed, alt) => {
    const items = [{ seg: [min - 0.6, 0, max + 0.6, 0], thin: true }];
    for (let v = min; v <= max; v++) items.push({ seg: [v, -0.14, v, 0.14], thin: true }, { label: String(v).replace('-', '−'), at: [v, -0.62] });
    items.push({ label: 'x', at: [max + 1, 0.05] });
    const x0 = a == null ? min - 0.5 : a, x1 = b == null ? max + 0.5 : b, o = 0.0361;
    const main = { seg: [x0, 0, x1, 0] };
    if (a == null) main.arrow = 'start'; else if (b == null) main.arrow = 'end';
    items.push({ seg: [x0, -o, x1, -o] }, main, { seg: [x0, o, x1, o] });
    const dot = (v, closed) => closed ? [0.1806, 0.15, 0.1194, 0.0889, 0.0583, 0.0278].map(r => ({ circle: [v, 0, r] })) : [{ circle: [v, 0, 0.1806], fill: true }];
    if (a != null) items.push(...dot(a, aClosed));
    if (b != null) items.push(...dot(b, bClosed));
    return fig({ kind: 'diagram', unit: 36, items, alt: alt || 'A number line' });
  };

  // Straight lines y = mx + c on small axes, clipped to the box, with an optional crossing point.
  const graph = (xr, yr, ls, pt, alt) => {
    const [x0, x1] = xr, [y0, y1] = yr;
    const items = [{ seg: [x0, 0, x1, 0], thin: true, arrow: 'end' }, { seg: [0, y0, 0, y1], thin: true, arrow: 'end' },
      { label: 'x', at: [x1 + 0.45, 0] }, { label: 'y', at: [0, y1 + 0.5] }];
    for (const l of ls) {
      let xa = x0, xb = x1;
      if (l.m !== 0) {
        const xs = [(y0 - l.c) / l.m, (y1 - l.c) / l.m].sort((u, v) => u - v);
        xa = Math.max(x0, xs[0]); xb = Math.min(x1, xs[1]);
      }
      items.push({ seg: [q(xa), q(l.m * xa + l.c), q(xb), q(l.m * xb + l.c)] }, { label: l.label, at: l.at, anchor: 'start' });
    }
    if (pt) items.push({ point: pt, name: '(' + pt.join(', ').replace(/-/g, '−') + ')', pos: 'ne' });
    return fig({ kind: 'diagram', unit: 24, items, alt });
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 2A Algebraic expressions
    // =====================================================================
    // Y9 2A Q1, Q7: expressions from a story
    'y9-2a-story': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">At a school fair, sausages cost <span class="hp-hl">$5</span> each and drinks cost <span class="hp-hl">$2</span> each. Write the cost of (a) s sausages, (b) s sausages and d drinks. (c) <span class="hp-hl">450 mL</span> of lemonade is shared equally among g glasses. How much goes in each glass?</p>
      ${steps(
        `<p><strong>Cost = number × price.</strong> Write the number before the letter, with no × sign.</p>
         ${sum('(a) 5s')}`,
        `<p><strong>Two kinds of item: one term for each, then add.</strong></p>
         ${sum('(b) 5s + 2d')}`,
        `<p><strong>Sharing equally means dividing.</strong> The amount goes on top and the number of shares goes underneath.</p>
         ${sum('(c) 450/g')}
         ${ans('5s, 5s+2d, 450/g')}`
      )}
      <p><strong>Only the total is known?</strong> If ten identical pens cost $P, one pen costs P/10. Then m pens cost m lots of that: Pm/10.</p>
      ${tip('Type division with /, like 450/g. Check with a real number: 4 sausages and 3 drinks cost 5 × 4 + 2 × 3 = $26.')}`,

    // Y9 2A Q2, Q9, Q10: turning words into algebra
    'y9-2a-words': `
      ${chips(['sum, more than → +'], ['difference, less than → −'], ['product, times → ×'], ['quotient, divided by → ÷'], ['reciprocal of y → 1/y'])}
      <p class="hp-tag">Worked example: write (a) <b>6 more than the product of 4 and m</b>, (b) <b>the sum of m and n, divided by 5</b>, (c) <b>the square of the difference between a and b</b>, (d) <b>the square root of the product of 3 and k</b>.</p>
      ${steps(
        `<p><strong>Build it in the order the words give it.</strong> The product of 4 and m is 4m; then add 6.</p>
         ${sum('(a) 4m + 6')}`,
        `<p><strong>"The sum ... divided by" means the whole sum is divided.</strong> Keep it together in brackets.</p>
         ${sum('(b) (m + n)/5')}`,
        `<p><strong>Do the inside job first, then the outside one.</strong> The difference is a − b; then square all of it. Compare "the difference between the squares", which is a² − b²: a different expression.</p>
         ${sum('(c) (a − b)² &nbsp;&nbsp; (d) √(3k)')}
         ${ans('4m+6, (m+n)/5, (a-b)^2, sqrt(3k)')}`
      )}
      <p><strong>Same or different?</strong> "Twice the difference of p and q" is 2(p − q) = 2p − 2q. "The difference of 2p and q" is 2p − q. Write both, then expand: they do not match, so they are different.</p>
      ${tip('Type powers with ^ and roots with sqrt( ), like sqrt(3k). Put brackets round anything that is squared, rooted or divided as a group. To type an equation, include the = sign.')}`,

    // Y9 2A Q3, Q4: substituting negatives and fractions
    'y9-2a-sub': `
      <p class="hp-tag">Worked example: if <b>p = −4</b>, <b>q = 3</b> and <b>r = −1/2</b>, evaluate <b>pq + 5</b>, <b>(q − p)/2</b> and <b>r² + q</b>.</p>
      ${steps(
        `<p><strong>Put the × back, and put negatives in brackets.</strong></p>
         ${sum(`${now('(−4) × 3')} + 5 = −12 + 5 = −7`)}`,
        `<p><strong>Work out the top first.</strong> Taking away a negative is adding.</p>
         ${sum('(3 − (−4))/2 = (3 + 4)/2 = 7/2')}`,
        `<p><strong>Square the whole fraction, sign and all.</strong> A negative squared is positive.</p>
         ${sum('(−1/2)² = 1/4, &nbsp; 1/4 + 3 = 13/4')}
         ${ans('-7, 7/2, 13/4')}`
      )}
      ${tip('(−4)² is 16 but (−4)³ is −64: an even power of a negative is positive, an odd power is negative. Give an exact fraction like 13/4, not a rounded decimal.')}`,

    // Y9 2A Q5, Q8: expressions for shapes
    'y9-2a-shapes': `
      <p class="hp-tag">Worked example: a garden bed is <b>9 m</b> long and <b>5 m</b> wide. Its length is decreased by <b>p</b> m and its width is increased by <b>q</b> m.</p>
      ${fig({ kind: 'rect', cols: [['9 − p', 3]], rows: [['5 + q', 2]] })}
      ${steps(
        `<p><strong>Area before the change.</strong></p>
         ${sum('9 × 5 = 45 m²')}`,
        `<p><strong>Each new side.</strong> Decreased by p: take it away. Increased by q: add it.</p>
         ${sum('length 9 − p, &nbsp; width 5 + q')}`,
        `<p><strong>New area = new length × new width.</strong> Each side has two terms, so each needs brackets.</p>
         ${sum('(9 − p)(5 + q)')}
         ${ans('45, 9-p, 5+q, (9-p)(5+q)')}`
      )}
      <p><strong>Letters for sides.</strong> A square with side t: perimeter 4t, area t². A right-angled triangle with shorter sides 6 and h and longest side k: perimeter 6 + h + k, area ½ × 6 × h = 3h.</p>
      ${tip('Type two brackets side by side with no × sign: (9-p)(5+q). Type t² as t^2.')}`,

    // Y9 2A Q6: using a formula, forwards and backwards
    'y9-2a-formula': `
      <p class="hp-tag">Worked example: use <b>A = ½(a + b)h</b> for a trapezium with <b>a = 5</b>, <b>b = 11</b>, <b>h = 3</b>.</p>
      ${fig({ kind: 'diagram', unit: 34, alt: 'A trapezium with parallel sides 5 and 11 and height 3', items: [
        { poly: [[0, 0], [5.5, 0], [4.2, 1.6], [1.7, 1.6]], fill: true }, { seg: [1.7, 1.6, 1.7, 0], dash: true },
        { label: '11', at: [2.75, -0.45] }, { label: '5', at: [2.95, 1.95] }, { label: '3', at: [1.45, 0.8], anchor: 'end' }] })}
      ${steps(
        `<p><strong>Brackets first, then halve, then multiply by h.</strong></p>
         ${sum('½ × (5 + 11) × 3 = ½ × 16 × 3 = 24')}`,
        `<p><strong>Working backwards.</strong> Another trapezium has h = 4 and area 14. Put in what you know.</p>
         ${sum('½(a + b) × 4 = 14 → 2(a + b) = 14 → a + b = 7')}`,
        `<p><strong>List the whole-number pairs.</strong> a and b are both positive, so a can be 1 to 6 (then b is 6 down to 1).</p>
         ${ans('24, then a = 1, 2, 3, 4, 5, 6')}`
      )}
      ${tip('Type a list with commas: 1, 2, 3, 4, 5, 6. Zero is not positive, so a = 0 and a = 7 do not count.')}`,

    // Y9 2A Q11: a rule given in words
    'y9-2a-rule': `
      <p class="hp-tag">Worked example: in a group of n people, everyone shakes hands once with everyone else. The number of handshakes is <b>half the product of n and one less than n</b>.</p>
      ${steps(
        `<p><strong>Build the rule from the inside out.</strong> One less than n is (n − 1). The product with n is n(n − 1). Half of that:</p>
         ${sum('n(n − 1)/2')}`,
        `<p><strong>Substitute n = 6.</strong></p>
         ${sum('6 × 5 ÷ 2 = 15')}`,
        `<p><strong>Substitute n = 10.</strong></p>
         ${sum('10 × 9 ÷ 2 = 45')}
         ${ans('n(n-1)/2, 15, 45')}`
      )}
      <p><strong>Another way to say it:</strong> half of the difference between the square of n and n, which is (n² − n)/2. Expanding n(n − 1) gives n² − n, so the two rules agree.</p>
      ${tip('Test a rule with a tiny case you can count. Two people shake hands once: 2 × 1 ÷ 2 = 1 ✓.')}`,

    // =====================================================================
    // 2B Simplifying algebraic expressions
    // =====================================================================
    // Y9 2B Q1, Q2: multiplying terms
    'y9-2b-multiply': `
      <p class="hp-tag">Worked example: simplify <b>−6a × 7b</b>, <b>3pq × (−4q)</b> and <b>−2xy × (−8x)</b></p>
      ${steps(
        `<p><strong>Sign first.</strong> One negative gives a negative answer; two negatives give a positive answer. Then multiply the numbers and write the letters in alphabetical order.</p>
         ${sum('−6a × 7b = −42ab')}`,
        `<p><strong>The same letter twice becomes a square.</strong> q × q = q².</p>
         ${sum('3pq × (−4q) = −12pq²')}`,
        `<p><strong>Two negatives:</strong> the answer is positive. x × x = x², and y comes along.</p>
         ${sum('−2xy × (−8x) = 16x²y')}
         ${ans('-42ab, -12pq^2, 16x^2y')}`
      )}
      ${tip('Type powers with ^ and letters in alphabetical order: 16x^2y, not 16yx^2.')}`,

    // Y9 2B Q3, Q4, Q15: dividing and cancelling
    'y9-2b-divide': `
      <p class="hp-tag">Worked example: simplify <b>10xy/(15x)</b>, <b>−8 ÷ (6k)</b> and <b>12a³b/(8ab³)</b></p>
      ${steps(
        `<p><strong>Cancel the numbers by their HCF, then cancel letters on top and bottom.</strong> 10 and 15 share 5. The x cancels.</p>
         ${sum('10xy/(15x) = 2y/3')}`,
        `<p><strong>Write a ÷ as a fraction first.</strong> Then cancel by 2.</p>
         ${sum('−8 ÷ (6k) = −8/(6k) = −4/(3k)')}`,
        `<p><strong>Powers: write them out as factors, then cancel.</strong> Remember a³ = a × a × a. The HCF of 12 and 8 is 4, one a cancels and one b cancels.</p>
         ${sum('12a³b/(8ab³) = (12 × a × a × a × b)/(8 × a × b × b × b)<br>= (3 × a × a)/(2 × b × b) = 3a²/(2b²)')}
         ${ans('2y/3, -4/(3k), 3a^2/(2b^2)')}`
      )}
      ${tip('Put the bottom in brackets when it has more than one factor: -4/(3k). A letter that cancels completely leaves 1, so nothing extra is written. A pattern to notice: the power left over is the bigger power take away the smaller one.')}`,

    // Y9 2B Q5: multiplying and dividing together
    'y9-2b-mixed': `
      <p class="hp-tag">Worked example: simplify <b>6a × 4ab ÷ (8b)</b> and <b>5 ÷ (2x) × y</b></p>
      ${steps(
        `<p><strong>Write it as one fraction.</strong> Everything multiplied goes on top; the term straight after ÷ goes on the bottom.</p>
         ${sum('(6a × 4ab)/(8b) = 24a²b/(8b)')}`,
        `<p><strong>Cancel.</strong> 24 ÷ 8 = 3, and the b cancels.</p>
         ${sum('3a²')}`,
        `<p><strong>Only the divisor goes underneath.</strong> The y is multiplied, so it goes on top.</p>
         ${sum('5 ÷ (2x) × y = 5y/(2x)')}
         ${ans('3a^2, 5y/(2x)')}`
      )}
      ${tip('Type a bottom with a number and a letter in brackets: 5y/(2x). Without brackets, 5y/2x means 5y/2 × x.')}`,

    // Y9 2B Q6, Q7, Q8: collecting like terms
    'y9-2b-collect': `
      <p class="hp-tag">Worked example: simplify <b>5pq − 2p + 3qp + 9p − 4</b>, then <b>6a²b − 2ab² + a²b + 5b²a</b></p>
      ${steps(
        `<p><strong>Group like terms.</strong> Each term keeps the sign in front of it. pq and qp are the same.</p>
         ${chips(['5pq', 'add'], ['3qp', 'add'], ['−2p'], ['9p'], ['−4', 'take'])}`,
        `<p><strong>Combine each group.</strong></p>
         ${sum('pq: 5 + 3 = 8 &nbsp; p: −2 + 9 = 7 &nbsp; number: −4')}
         ${ans('8pq+7p-4')}`,
        `<p><strong>Powers must match too.</strong> a²b and ab² are different. b²a is the same as ab².</p>
         ${sum('a²b: 6 + 1 = 7 &nbsp; ab²: −2 + 5 = 3')}
         ${ans('7a^2b+3ab^2')}`
      )}
      ${tip('Type x² as x^2. A term with coefficient 1 is written without the 1: a²b, not 1a²b. The order of the terms in your answer does not matter.')}`,

    // Y9 2B Q9, Q10, Q11, Q14: expressions in simplest form from a situation
    'y9-2b-story': `
      <p class="hp-tag">Worked example: (a) a tank holds s spiders (8 legs) and b beetles (6 legs). (b) A rectangle's length is three times its width w. (c) A route totals 5a + 4b km, and b = a − 3.</p>
      ${steps(
        `<p><strong>Count for one, then multiply.</strong> Legs: 8 for each spider, 6 for each beetle.</p>
         ${sum('(a) heads s + b, &nbsp; legs 8s + 6b')}`,
        `<p><strong>Write the sides, then collect.</strong> The length is 3w.</p>
         ${sum('(b) perimeter w + 3w + w + 3w = 8w<br>&nbsp;&nbsp;&nbsp;&nbsp;area 3w × w = 3w²')}`,
        `<p><strong>Swap a letter for what it equals</strong>, in brackets, then collect.</p>
         ${sum('(c) 5a + 4(a − 3) = 5a + 4a − 12 = 9a − 12')}
         ${ans('8s+6b, 8w, 3w^2, 9a-12')}`
      )}
      ${tip('"Simplest form" means collect like terms. A right-angled triangle\'s area is half of the two shorter sides multiplied together. Going there and back means every road twice.')}`,

    // Y9 2B Q12: a new mean
    'y9-2b-mean': `
      <p class="hp-tag">Worked example: the mean score of <b>30</b> students is <b>m</b>. One more student, who scored <b>75</b>, joins the list. Write the new mean.</p>
      ${steps(
        `<p><strong>Total = mean × number of scores.</strong></p>
         ${sum('old total = 30m')}`,
        `<p><strong>Add the new score; count one more student.</strong></p>
         ${sum('new total = 30m + 75, &nbsp; new count = 31')}`,
        `<p><strong>New mean = new total ÷ new count.</strong></p>
         ${sum('(30m + 75)/31')}
         ${ans('(30m+75)/31')}`
      )}
      ${tip('Type the top in brackets: (30m+75)/31. Check: if m is 75, the new mean should still be 75, and (2250 + 75)/31 = 75 ✓.')}`,

    // Y9 2B Q13: always true or not?
    'y9-2b-laws': `
      <p class="hp-tag">Worked example: always true? (a) <b>a + (b + c) = (a + b) + c</b> (b) <b>a − (b − c) = (a − b) − c</b> (c) <b>(ab)² = a²b²</b></p>
      ${steps(
        `<p><strong>Test with numbers that are all different</strong>, say a = 5, b = 3, c = 1.</p>
         ${sum('(b) 5 − (3 − 1) = 3 &nbsp; but &nbsp; (5 − 3) − 1 = 1')}
         <p>One case that fails proves it is <b>false</b>.</p>`,
        `<p><strong>When tests keep matching, look for a reason.</strong> (ab)² = ab × ab = a × a × b × b = a²b², so (c) is true for all numbers.</p>`,
        `<p><strong>Adding in any grouping gives the same total</strong>, so (a) is true.</p>
         ${ans('(a) True, (b) False, (c) True')}`
      )}
      ${tip('Avoid testing with 0, 1 or two equal numbers: they can make a false statement look true.')}`,

    // =====================================================================
    // 2C Expanding algebraic expressions
    // =====================================================================
    // Y9 2C Q1, Q2, Q3, Q10: the distributive law
    'y9-2c-expand': `
      <p class="hp-tag">Worked example: expand <b>7(x − 6)</b>, <b>−9(4 − x)</b> and <b>−2y(3y − 5x)</b></p>
      ${steps(
        `<p><strong>Multiply the outside by every term inside.</strong></p>
         ${sum(`${now('7')} × x = 7x, &nbsp; ${now('7')} × (−6) = −42 &nbsp; → &nbsp; 7x − 42`)}`,
        `<p><strong>A negative outside flips every sign inside.</strong></p>
         ${sum('−9 × 4 = −36, &nbsp; −9 × (−x) = +9x &nbsp; → &nbsp; 9x − 36')}`,
        `<p><strong>A letter outside: multiply letters too.</strong> y × y = y².</p>
         ${sum('−2y × 3y = −6y², &nbsp; −2y × (−5x) = +10xy')}
         ${ans('7x-42, 9x-36, -6y^2+10xy')}`
      )}
      ${tip('Common slips: 4(x + 2) is 4x + 8, not 4x + 2 (the 2 gets multiplied too), and x × x is x², not 2x. Type x^2 for x squared.')}`,

    // Y9 2C Q4, Q5: expand, then collect like terms
    'y9-2c-collect': `
      <p class="hp-tag">Worked example: simplify <b>7 − 3(x − 5)</b> and <b>2(3x + 5) − 4(x − 2)</b></p>
      ${steps(
        `<p><strong>The number in front of the bracket includes its sign.</strong> Here it is −3, so −3 × (−5) = +15.</p>
         ${sum('7 − 3x + 15 = 22 − 3x')}`,
        `<p><strong>Two brackets: expand each one.</strong> The second is multiplied by −4.</p>
         ${sum('2(3x + 5) = 6x + 10<br>−4(x − 2) = −4x + 8')}`,
        `<p><strong>Collect the x terms and the numbers.</strong></p>
         ${sum('6x − 4x = 2x, &nbsp; 10 + 8 = 18')}
         ${ans('22-3x, 2x+18')}`
      )}
      ${tip('A minus with no number in front of a bracket means −1: 10 − (x + 6) = 10 − x − 6 = 4 − x.')}`,

    // Y9 2C Q6, Q7: areas in expanded form
    'y9-2c-area': `
      <p class="hp-tag">Worked example: find the area of this shape in expanded form. All corners are 90°.</p>
      ${fig({ kind: 'diagram', unit: 26, alt: 'An L-shape: a rectangle x + 8 by x with a 3 by 2 corner cut out', items: [
        { poly: [[0, 0], [10, 0], [10, 3], [7, 3], [7, 5], [0, 5]], fill: true },
        { label: 'x + 8', at: [5, -0.55] }, { label: 'x', at: [-0.3, 2.5], anchor: 'end' },
        { label: '3', at: [8.5, 3.45] }, { label: '2', at: [7.25, 4], anchor: 'start' }] })}
      ${steps(
        `<p><strong>Fill in the corner, then take it away.</strong> The full rectangle is x + 8 by x, and the missing corner is 3 by 2.</p>
         ${sum('x(x + 8) − 3 × 2')}`,
        `<p><strong>Expand and simplify.</strong></p>
         ${sum('x² + 8x − 6')}
         ${ans('x^2+8x-6')}`,
        `<p><strong>One rectangle?</strong> A rectangle with width x and length 3 less than twice the width has area x(2x − 3) = 2x² − 3x.</p>`
      )}
      ${tip('Either split the shape into rectangles and add, or fill it in and subtract. Find any missing side first: opposite sides of a right-angled shape add to the same total.')}`,

    // Y9 2C Q8, Q9, Q12: pay or tax above a threshold
    'y9-2c-threshold': `
      <p class="hp-tag">Worked example: (a) Jo earns <b>$20</b> for every sale above her target of <b>15</b> a month. (b) A tax is <b>40 cents</b> for every dollar above <b>$25 000</b>.</p>
      ${steps(
        `<p><strong>Only the part above the threshold counts.</strong> With n sales, that part is n − 15.</p>
         ${sum('(a) 20(n − 15) = 20n − 300')}`,
        `<p><strong>Cents per dollar is a decimal.</strong> 40 cents is $0.40. On an income of $x:</p>
         ${sum('(b) 0.4(x − 25000) = 0.4x − 10000')}`,
        `<p><strong>Tax tables: earlier tax plus the new rate on the part above.</strong> Below: c is the tax on the first $40 000, which is 20% of $30 000 = $6000. On $50 000, tax = 6000 + 0.3 × 10 000 = $9000.</p>
         ${fig({ kind: 'table', rows: [['Income', 'Tax'], ['$0 to $10 000', '$0'], ['$10 001 to $40 000', '20% of income above $10 000'], ['over $40 000', 'c + 30% of income above $40 000']] })}
         ${sum('over $40 000: 6000 + 0.3(x − 40000) = 0.3x − 6000')}
         ${ans('20n-300, 0.4x-10000, 9000, 0.3x-6000')}`
      )}
      ${tip('Type big numbers with no spaces or commas, and decimals like 0.4x. "In expanded form" means no brackets left.')}`,

    // Y9 2C Q11: the distributive law for mental arithmetic
    'y9-2c-mental': `
      <p class="hp-tag">Worked example: work out <b>9 × 47</b>, <b>5 × 304</b> and <b>3 × 998</b> in your head.</p>
      ${steps(
        `<p><strong>Just below a round number: go up, then take off.</strong></p>
         ${sum('9 × (50 − 3) = 450 − 27 = 423')}`,
        `<p><strong>Just above a round number: split and add.</strong></p>
         ${sum('5 × (300 + 4) = 1500 + 20 = 1520')}`,
        `<p><strong>Close to 1000 works the same way.</strong></p>
         ${sum('3 × (1000 − 2) = 3000 − 6 = 2994')}
         ${ans('423, 1520, 2994')}`
      )}
      ${tip('Pick the nearest round number, so one part is easy and the other part is small.')}`,

    // =====================================================================
    // 2D Solving linear equations with pronumerals on one side
    // =====================================================================
    // Y9 2D Q1, Q2: two-step equations
    'y9-2d-two-step': `
      <p class="hp-tag">Worked example: solve <b>7x − 5 = 16</b>, <b>8 − 5x = 23</b> and <b>6x + 7 = 2</b></p>
      ${steps(
        `<p><strong>Undo the adding or subtracting first, then the multiplying.</strong> Do the same to both sides.</p>
         ${sum('7x − 5 = 16 → 7x = 21 → x = 3')}
         <p>Check: 7 × 3 − 5 = 16 ✓</p>`,
        `<p><strong>A negative x term: keep its sign.</strong> Take 8 from both sides, then divide by −5.</p>
         ${sum('8 − 5x = 23 → −5x = 15 → x = −3')}`,
        `<p><strong>Not every answer is whole.</strong></p>
         ${sum('6x + 7 = 2 → 6x = −5 → x = −5/6')}
         ${ans('3, -3, -5/6')}`
      )}
      ${tip('Type a fraction answer exactly, like -5/6, and just the number, not x = . Substitute your answer back in to check.')}`,

    // Y9 2D Q3, Q4: the letter on top of a fraction
    'y9-2d-fraction': `
      <p class="hp-tag">Worked example: solve <b>m/4 + 9 = 7</b>, <b>4x/7 − 3 = 5</b> and <b>5x/6 = 2/3</b></p>
      ${steps(
        `<p><strong>Get the fraction on its own, then multiply by its bottom.</strong></p>
         ${sum('m/4 = −2 → m = −8')}`,
        `<p><strong>A number on top: multiply by the bottom, then divide by the top number.</strong></p>
         ${sum('4x/7 = 8 → 4x = 56 → x = 14')}`,
        `<p><strong>Fractions on both sides:</strong> multiply both sides by 6. 6 × 2/3 = 4.</p>
         ${sum('5x = 4 → x = 4/5')}
         ${ans('-8, 14, 4/5')}`
      )}
      <p><strong>A minus in front?</strong> 7 − x/2 = 9 → −x/2 = 2 → x = −4.</p>
      ${tip('Type fraction answers like 4/5. Check by substituting: −8/4 + 9 = −2 + 9 = 7 ✓.')}`,

    // Y9 2D Q5: a whole expression over a number
    'y9-2d-bracket-top': `
      <p class="hp-tag">Worked example: solve <b>(3x + 1)/4 = −5</b> and <b>(9 − 2x)/5 = 3</b></p>
      ${steps(
        `<p><strong>The whole top is divided, so multiply by the bottom first.</strong></p>
         ${sum('3x + 1 = −20')}`,
        `<p><strong>Now it is a two-step equation.</strong></p>
         ${sum('3x = −21 → x = −7')}
         <p>Check: (−21 + 1)/4 = −20/4 = −5 ✓</p>`,
        `<p><strong>Second one:</strong> multiply by 5, take 9 from both sides, divide by −2.</p>
         ${sum('9 − 2x = 15 → −2x = 6 → x = −3')}
         ${ans('-7, -3')}`
      )}
      ${tip('Do not split the fraction or subtract inside it first. Clear the bottom, then solve the line that is left.')}`,

    // Y9 2D Q6, Q7, Q8: equations from words
    'y9-2d-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">(a) I think of a number, multiply it by <span class="hp-hl">6</span> and subtract <span class="hp-hl">4</span>. The result is <span class="hp-hl">44</span>. (b) Ava adds <span class="hp-hl">4</span> marbles to her collection, then shares them all equally between herself and two friends. Each gets <span class="hp-hl">6</span>. How many did she have at the start?</p>
      ${steps(
        `<p><strong>Write the steps in order, then "the result is" becomes =.</strong></p>
         ${sum('(a) 6x − 4 = 44 → 6x = 48 → x = 8')}`,
        `<p><strong>Group what is shared, in brackets.</strong> Herself and two friends is 3 people.</p>
         ${sum('(b) (x + 4)/3 = 6 → x + 4 = 18 → x = 14')}`,
        `<p><strong>Check in the story.</strong> 14 + 4 = 18 marbles, and 18 shared by 3 is 6 each ✓.</p>
         ${ans('8, 14')}`
      )}
      <p><strong>Longer stories.</strong> Lena's savings went up by $60. She spent half of the new amount on a bike and $40 on a game, leaving $100: (x + 60)/2 − 40 = 100 → (x + 60)/2 = 140 → x + 60 = 280 → x = 220.</p>
      ${tip('Type just the value of x. Read the question again to see which amount it wants.')}`,

    // Y9 2D Q9: finding the error
    'y9-2d-errors': `
      <p class="hp-tag">Worked example: each working has a mistake. Find it and solve correctly.</p>
      ${steps(
        `<p><strong>5x + 4 = 24, then x + 4 = 24/5 ✗.</strong> Only the 5x was divided by 5. Take off 4 first.</p>
         ${sum('5x = 20 → x = 4')}`,
        `<p><strong>x/3 − 2 = 4, then x − 2 = 12 ✗.</strong> Only x/3 was multiplied by 3. Add 2 first.</p>
         ${sum('x/3 = 6 → x = 18')}`,
        `<p><strong>8 − x = 3, then x = −5 ✗.</strong> Taking 8 from both sides gives −x, not x.</p>
         ${sum('−x = −5 → x = 5')}
         ${ans('4, 18, 5')}`
      )}
      ${tip('Undo + and − before × and ÷. Whatever you do, do it to the whole of each side. Check by substituting into the first line.')}`,

    // Y9 2D Q10: dividing first
    'y9-2d-divide-first': `
      <p class="hp-tag">Worked example: solve <b>7(x + 2) = 35</b> and <b>−2(3x − 1) = 14</b> by dividing first.</p>
      ${steps(
        `<p><strong>Divide both sides by the number outside the bracket.</strong> The bracket disappears.</p>
         ${sum('x + 2 = 5 → x = 3')}`,
        `<p><strong>A negative outside: divide by the negative.</strong> 14 ÷ (−2) = −7.</p>
         ${sum('3x − 1 = −7 → 3x = −6 → x = −2')}`,
        `<p><strong>When it does not divide exactly</strong>, such as 3(x − 4) = 5, dividing gives x − 4 = 5/3, so x = 17/3. Expanding gives 3x − 12 = 5, so 3x = 17 and x = 17/3 again.</p>
         ${ans('3, -2, 17/3')}`
      )}
      ${tip('Both ways always give the same answer. Compare them: which way brought in fractions early, and which did not?')}`,

    // Y9 2D Q11: changing the subject
    'y9-2d-subject': `
      <p class="hp-tag">Worked example: make <b>p</b> the subject of <b>5p + q = r</b>, <b>m(p − q) = n</b> and <b>(2p + q)/r = s</b></p>
      ${steps(
        `<p><strong>Treat the other letters like numbers.</strong> Take q from both sides, then divide by 5.</p>
         ${sum('5p = r − q → p = (r − q)/5')}`,
        `<p><strong>Divide by what is outside the bracket</strong>, then add q.</p>
         ${sum('p − q = n/m → p = n/m + q')}`,
        `<p><strong>Clear the bottom first</strong>, then undo + q, then ÷ 2.</p>
         ${sum('2p + q = rs → 2p = rs − q → p = (rs − q)/2')}
         ${ans('p=(r-q)/5, p=n/m+q, p=(rs-q)/2')}`
      )}
      ${tip('Start the answer with p = . Put brackets round a top or bottom with more than one term: (r-q)/5.')}`,

    // =====================================================================
    // 2E Brackets and pronumerals on both sides
    // =====================================================================
    // Y9 2E Q1, Q2: expand, then solve
    'y9-2e-expand': `
      <p class="hp-tag">Worked example: solve <b>6(x − 2) = 11</b>, then <b>2(x + 4) + 3x = 23</b></p>
      ${steps(
        `<p><strong>Expand the bracket.</strong></p>
         ${sum('6x − 12 = 11')}`,
        `<p><strong>Solve as usual.</strong> The answer is not whole, so leave it as a fraction.</p>
         ${sum('6x = 23 → x = 23/6')}`,
        `<p><strong>Extra terms outside: expand, then collect like terms before solving.</strong></p>
         ${sum('2x + 8 + 3x = 23 → 5x + 8 = 23 → 5x = 15 → x = 3')}
         ${ans('23/6, 3')}`
      )}
      ${tip('Type a fraction answer like 23/6. Watch the signs inside: 5(4 − x) = 20 − 5x.')}`,

    // Y9 2E Q3, Q4: pronumerals on both sides
    'y9-2e-both': `
      <p class="hp-tag">Worked example: solve <b>7x − 3 = 4x + 9</b> and <b>5(x − 1) = 2(x + 4)</b></p>
      ${steps(
        `<p><strong>Take the smaller x term from both sides.</strong> Then it is a two-step equation.</p>
         ${sum('7x − 3 = 4x + 9 → 3x − 3 = 9 → 3x = 12 → x = 4')}`,
        `<p><strong>Brackets: expand both sides first.</strong></p>
         ${sum('5x − 5 = 2x + 8 → 3x − 5 = 8 → 3x = 13 → x = 13/3')}`,
        `<p><strong>Check a fraction answer.</strong></p>
         ${sum('5(13/3 − 1) = 5 × 10/3 = 50/3<br>2(13/3 + 4) = 2 × 25/3 = 50/3 ✓')}
         ${ans('4, 13/3')}`
      )}
      ${tip('Moving the smaller x term leaves a positive x term, which means fewer negatives to deal with.')}`,

    // Y9 2E Q5, Q6, Q7: equations from words
    'y9-2e-words': `
      <p class="hp-tag">Worked example: (a) <b>the product of 6 and 2 more than a number is 30</b>. (b) <b>7 more than 3 lots of a number is equal to 5 lots of the number</b>. (c) <b>Ben's score is doubled, 5 is taken away, and the result is tripled to give 33.</b></p>
      ${steps(
        `<p><strong>"2 more than a number" is one group, so it gets brackets.</strong></p>
         ${sum('(a) 6(x + 2) = 30 → x + 2 = 5 → x = 3')}`,
        `<p><strong>"Is equal to" puts x on both sides.</strong></p>
         ${sum('(b) 3x + 7 = 5x → 7 = 2x → x = 7/2')}`,
        `<p><strong>A chain of steps: each new step wraps the last.</strong></p>
         ${sum('(c) 3(2x − 5) = 33 → 2x − 5 = 11 → 2x = 16 → x = 8')}
         ${ans('3, 7/2, 8')}`
      )}
      ${tip('When two people end up with the same amount, write an expression for each and set them equal.')}`,

    // Y9 2E Q8, Q9, Q10: comparing methods
    'y9-2e-methods': `
      <p class="hp-tag">Worked example: solve each equation two ways.</p>
      ${steps(
        `<p><strong>5(x + 1) = 30.</strong></p>
         ${sum('Divide first: x + 1 = 6 → x = 5<br>Expand first: 5x + 5 = 30 → 5x = 25 → x = 5')}`,
        `<p><strong>5(x + 1) = 8.</strong></p>
         ${sum('Divide first: x + 1 = 8/5 → x = 3/5<br>Expand first: 5x + 5 = 8 → 5x = 3 → x = 3/5')}`,
        `<p><strong>3x + 4 = 7x − 8.</strong></p>
         ${sum('Take 3x: 4 = 4x − 8 → 12 = 4x → x = 3<br>Take 7x: −4x + 4 = −8 → −4x = −12 → x = 3')}
         ${ans('5, 3/5, 3')}`
      )}
      ${tip('Both ways must give the same answer. Notice which way brought in fractions or negatives along the way.')}`,

    // Y9 2E Q11: literal equations
    'y9-2e-literal': `
      <p class="hp-tag">Worked example: solve for x: <b>px − 3 = qx + r</b>, then <b>m(x − 2) = x + 4</b></p>
      ${steps(
        `<p><strong>All x terms on one side, everything else on the other.</strong></p>
         ${sum('px − qx = r + 3')}`,
        `<p><strong>Factorise out x, then divide by the bracket.</strong></p>
         ${sum('x(p − q) = r + 3 → x = (r + 3)/(p − q)')}`,
        `<p><strong>Brackets: expand first.</strong></p>
         ${sum('mx − 2m = x + 4 → mx − x = 2m + 4<br>x(m − 1) = 2m + 4 → x = (2m + 4)/(m − 1)')}
         ${ans('x=(r+3)/(p-q), x=(2m+4)/(m-1)')}`
      )}
      ${tip('Type x = and put brackets round a top or bottom with more than one term. A lone x has coefficient 1, so mx − x = x(m − 1).')}`,

    // =====================================================================
    // 2F Solving word problems
    // =====================================================================
    // Y9 2F Q1: writing an equation
    'y9-2f-write': `
      <p class="hp-tag">Worked example: write an equation. (a) <b>Seven more than a number is three less than twice the number.</b> (b) <b>Three is taken from a number and the result is multiplied by 4. The result is 28.</b></p>
      ${steps(
        `<p><strong>Each side of "is" becomes an expression.</strong> Seven more than x is x + 7. Three less than twice x is 2x − 3.</p>
         ${sum('(a) x + 7 = 2x − 3')}`,
        `<p><strong>"The result is then multiplied" means brackets</strong>, so the whole result is multiplied.</p>
         ${sum('(b) 4(x − 3) = 28')}
         ${ans('x+7=2x-3, 4(x-3)=28')}`
      )}
      ${tip('Type the whole equation, with the = sign. "Less than" turns the order round: three less than 2x is 2x − 3, not 3 − 2x.')}`,

    // Y9 2F Q2, Q6, Q8: one amount in terms of another, with a total
    'y9-2f-sum-diff': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Leo and Mia have <span class="hp-hl">52</span> stickers between them. Mia has <span class="hp-hl">8</span> more than Leo. Let l be Leo's number.</p>
      ${steps(
        `<p><strong>Write the other amount with the same letter.</strong></p>
         ${sum('Mia: l + 8')}`,
        `<p><strong>Add them and set equal to the total.</strong></p>
         ${sum('l + (l + 8) = 52 → 2l + 8 = 52 → 2l = 44 → l = 22')}`,
        `<p><strong>Answer every part.</strong> Mia has 22 + 8 = 30. Check: 22 + 30 = 52 ✓.</p>
         ${ans('l+8, l+(l+8)=52, 22, 30')}`
      )}
      <p><strong>Three people?</strong> Kim earns $20 more than Jay, and Lu earns $10 less than twice Jay's wage. Together they earn $410: j + (j + 20) + (2j − 10) = 410 → 4j + 10 = 410 → j = 100, so Kim earns $120 and Lu $190.</p>
      ${tip('Let the letter stand for the person everyone else is compared with.')}`,

    // Y9 2F Q3, Q16: perimeters
    'y9-2f-shape': `
      <p class="hp-tag">Worked example: a rectangle is <b>3 times</b> as long as it is wide, and its perimeter is <b>96 cm</b>. Let w cm be the width.</p>
      ${steps(
        `<p><strong>Write the length using w.</strong></p>
         ${sum('length = 3w')}`,
        `<p><strong>Perimeter = two widths + two lengths.</strong></p>
         ${sum('2w + 2(3w) = 96 → 8w = 96 → w = 12')}`,
        `<p><strong>Then the length.</strong></p>
         ${sum('3 × 12 = 36')}
         ${ans('3w, 2w+2(3w)=96, 12, 36')}`
      )}
      <p><strong>Two shapes, same perimeter.</strong> A square with side x + 2 and an equilateral triangle with side x + 6:</p>
      ${fig({ kind: 'diagram', unit: 30, alt: 'A square with sides x + 2 and an equilateral triangle with sides x + 6', items: [
        { poly: [[0, 0], [3, 0], [3, 3], [0, 3]], fill: true },
        { tick: [0, 0, 3, 0] }, { tick: [3, 0, 3, 3] }, { tick: [3, 3, 0, 3] }, { tick: [0, 3, 0, 0] },
        { label: 'x + 2', at: [1.5, 3.5] },
        { poly: [[5, 0], [9, 0], [7, 3.464]], fill: true },
        { tick: [5, 0, 9, 0], n: 2 }, { tick: [9, 0, 7, 3.464], n: 2 }, { tick: [7, 3.464, 5, 0], n: 2 },
        { label: 'x + 6', at: [8.4, 2.1], anchor: 'start' }] })}
      ${sum('4(x + 2) = 3(x + 6) → 4x + 8 = 3x + 18 → x = 10')}
      ${tip('Sides with the same marks are equal. Find x first, then put it back in to get the actual lengths: here 12 and 16.')}`,

    // Y9 2F Q4, Q14, Q18: fees, rates and profit
    'y9-2f-fee': `
      <p class="hp-tag">Worked example: (a) a hall costs <b>$60</b> to book plus <b>$45</b> per hour. The bill was <b>$330</b>. (b) When do two hire deals cost the same? (c) How many toys give a set profit?</p>
      ${steps(
        `<p><strong>Fee once, rate every hour.</strong></p>
         ${sum('(a) 45h + 60 = 330 → 45h = 270 → h = 6 hours')}`,
        `<p><strong>Equal costs: set the two expressions equal.</strong> Deal A: $5 plus $3 an hour. Deal B: $9 plus $2 an hour.</p>
         ${sum('(b) 5 + 3h = 9 + 2h → h = 4 hours')}`,
        `<p><strong>Profit = revenue − total cost.</strong> Toys sell for $25, cost $10 each to make, plus $3000 to set up. A profit of $4500:</p>
         ${sum('(c) 25x − (10x + 3000) = 4500<br>15x − 3000 = 4500 → 15x = 7500 → x = 500')}
         ${ans('6, 4, 500')}`
      )}
      ${tip('Put the whole cost in brackets when you subtract it. If a group hires several items, multiply the whole cost of one by how many: 3(5 + 3h).')}`,

    // Y9 2F Q5, Q7, Q9: "times as many" problems
    'y9-2f-times': `
      <p class="hp-tag">Worked example: (a) a bag has <b>five times</b> as many red beads as blue, and <b>28 more</b> red than blue. (b) Sam cycled a distance, ran twice as far, then took a bus for the last 6 km: 30 km in all. (c) Point P is on the road from A to B, 4 times as far from B as from A, and AB is 60 km.</p>
      ${steps(
        `<p><strong>Two facts about the same amounts give one equation.</strong> Blue b, red 5b.</p>
         ${sum('(a) 5b = b + 28 → 4b = 28 → b = 7, red 35')}`,
        `<p><strong>Add the parts to make the total.</strong></p>
         ${sum('(b) x + 2x + 6 = 30 → 3x = 24 → x = 8; ran 16 km')}`,
        `<p><strong>Draw the line.</strong></p>
         ${fig({ kind: 'diagram', unit: 40, alt: 'A road from A to B with P one fifth of the way along', items: [
           { seg: [0, 0, 7.5, 0] }, { point: [0, 0], name: 'A', pos: 'w' }, { point: [1.5, 0], name: 'P', pos: 's' }, { point: [7.5, 0], name: 'B', pos: 'e' },
           { label: 'x', at: [0.75, 0.4] }, { label: '4x', at: [4.5, 0.4] }] })}
         ${sum('(c) x + 4x = 60 → x = 12 km')}
         ${ans('7, 35; 8, 16; 12')}`
      )}
      ${tip('Let the letter be the smallest amount, so the others are multiples of it with no fractions.')}`,

    // Y9 2F Q10, Q12: ages then and now
    'y9-2f-ages': `
      <p class="hp-tag">Worked example: (a) in 3 years' time, Tia's age doubled will be her mum's age now, 40. (b) Six years ago, a dad was four times as old as his son. The dad is 42 now.</p>
      ${steps(
        `<p><strong>Future age: add the years first, then double.</strong></p>
         ${sum('(a) 2(x + 3) = 40 → x + 3 = 20 → x = 17')}`,
        `<p><strong>Past ages: take the years off everyone.</strong></p>
         ${fig({ kind: 'table', rows: [['', 'Now', '6 years ago'], ['Son', 's', 's − 6'], ['Dad', '42', '36']] })}`,
        `<p><strong>Use the "then" column for the equation.</strong></p>
         ${sum('(b) 36 = 4(s − 6) → s − 6 = 9 → s = 15')}
         ${ans('17, 15')}`
      )}
      ${tip('Change every age by the same number of years. Check: 6 years ago the son was 9 and the dad 36, and 36 = 4 × 9 ✓.')}`,

    // Y9 2F Q13: two kinds of item with a fixed total
    'y9-2f-two-types': `
      <p class="hp-tag">Worked example: a class buys <b>20</b> tickets. Adult tickets cost <b>$15</b> and child tickets <b>$8</b>. The total was <b>$216</b>. Let a be the number of adult tickets.</p>
      ${steps(
        `<p><strong>The rest are child tickets: 20 − a.</strong> Cost of each kind, then add.</p>
         ${sum('15a + 8(20 − a) = 216')}`,
        `<p><strong>Expand and solve.</strong></p>
         ${sum('15a + 160 − 8a = 216 → 7a = 56 → a = 8')}`,
        `<p><strong>Child tickets: 20 − 8 = 12.</strong> Check: 8 × 15 + 12 × 8 = 216 ✓.</p>
         ${ans('8, 12')}`
      )}
      ${tip('One letter is enough: the second amount is "total minus the first".')}`,

    // Y9 2F Q11, Q19, Q20, Q21: fractions of an amount, and chains of changes
    'y9-2f-fractions': `
      <p class="hp-tag">Worked example: a relay has three legs. The second is half the first, the third is a quarter of the first, and the total is <b>70 km</b>.</p>
      ${steps(
        `<p><strong>Write every part using the first leg, x.</strong></p>
         ${sum('x + x/2 + x/4 = 70')}`,
        `<p><strong>Multiply every term by the LCD, 4, to clear the fractions.</strong></p>
         ${sum('4x + 2x + x = 280 → 7x = 280 → x = 40')}
         ${ans('40, 20, 10')}`,
        `<p><strong>Two chains that end equal.</strong> Two jars start with n lollies. Jar A: add 8, then triple. Jar B: multiply by 5, then take away 6. They end the same:</p>
         ${sum('3(n + 8) = 5n − 6 → 3n + 24 = 5n − 6 → 30 = 2n → n = 15')}`
      )}
      ${tip('Build each chain one step at a time, wrapping the last step in brackets. Type ordered answers in the order asked, with commas. Round only at the very end.')}`,

    // Y9 2F Q15: catching up
    'y9-2f-catch-up': `
      <p class="hp-tag">Worked example: car A leaves at <b>9:00 am</b> at <b>45 km/h</b>. Car B leaves the same place at <b>10:00 am</b> at <b>60 km/h</b> on the same road. When does B catch A?</p>
      ${steps(
        `<p><strong>Let t be the hours after 9:00 am.</strong> B has been driving 1 hour less. Distance = speed × time.</p>
         ${sum('A: 45t &nbsp; B: 60(t − 1)')}`,
        `<p><strong>Catching up means equal distances.</strong></p>
         ${sum('45t = 60t − 60 → 60 = 15t → t = 4')}`,
        `<p><strong>Turn it into a clock time.</strong> 4 hours after 9:00 am is 1:00 pm. Check: 45 × 4 = 180 and 60 × 3 = 180 ✓.</p>
         ${ans('1:00 pm')}`
      )}
      ${tip('Type a time like 1:00 pm. Measure every time from the same starting moment.')}`,

    // Y9 2F Q17: consecutive numbers
    'y9-2f-consecutive': `
      <p class="hp-tag">Worked example: find three consecutive integers that add to <b>84</b>, then three consecutive multiples of 5 that add to <b>75</b>.</p>
      ${steps(
        `<p><strong>Consecutive integers go up by 1.</strong></p>
         ${sum('x + (x + 1) + (x + 2) = 84 → 3x + 3 = 84 → x = 27')}
         ${ans('27, 28, 29')}`,
        `<p><strong>Other patterns go up by their step.</strong> Even numbers: x, x + 2, x + 4. Odd numbers also go up by 2. Multiples of 5: x, x + 5, x + 10.</p>`,
        `<p><strong>Same method.</strong></p>
         ${sum('x + (x + 5) + (x + 10) = 75 → 3x + 15 = 75 → x = 20')}
         ${ans('20, 25, 30')}`
      )}
      ${tip('Type the numbers from smallest to largest, separated by commas.')}`,

    // =====================================================================
    // 2G Solving linear inequalities
    // =====================================================================
    // Y9 2G Q1: inequalities on a number line
    'y9-2g-numberline': `
      ${chips(['< or > : open circle (not included)'], ['≤ or ≥ : closed circle (included)'])}
      <p class="hp-tag">Worked example: show <b>x > −1</b> and <b>−3 < x ≤ 2</b> on number lines.</p>
      ${steps(
        `<p><strong>x > −1:</strong> −1 itself is not included, so an open circle. Bigger numbers are to the right, so the arrow goes right.</p>
         ${nl(-3, 3, -1, false, null, false, 'Open circle at −1 with an arrow to the right')}`,
        `<p><strong>−3 < x ≤ 2:</strong> x is between −3 and 2. Open at −3, closed at 2, joined by a line.</p>
         ${nl(-4, 3, -3, false, 2, true, 'Open circle at −3, closed circle at 2, joined')}
         ${ans('open at −3, closed at 2, joined')}`
      )}
      ${tip('Read x first: x > −1 says "x is bigger than −1". A double inequality has two ends and no arrow.')}`,

    // Y9 2G Q2, Q3, Q12, Q13: solving, and reversing the sign
    'y9-2g-solve': `
      <p class="hp-tag">Worked example: solve <b>3x − 5 ≥ 10</b> and <b>7 − 2x < 15</b></p>
      ${steps(
        `<p><strong>Solve it like an equation.</strong></p>
         ${sum('3x ≥ 15 → x ≥ 5')}`,
        `<p><strong>Multiplying or dividing by a negative reverses the sign.</strong></p>
         ${sum(`7 − 2x < 15 → −2x < 8 → ${now('÷ (−2)')} → x > −4`)}
         <p>Check with x = 0: 7 < 15 ✓.</p>`,
        `<p><strong>Or avoid the negative.</strong> Add 2x to both sides instead.</p>
         ${sum('7 < 15 + 2x → −8 < 2x → −4 < x, so x > −4')}
         ${ans('x>=5, x>-4')}`
      )}
      ${tip('Type >= for ≥ and <= for ≤, with x on the left. Swapping the sides reverses the sign: 6 > x is the same as x < 6.')}`,

    // Y9 2G Q4, Q5, Q6, Q14: fractions, brackets and both sides
    'y9-2g-harder': `
      <p class="hp-tag">Worked example: solve <b>(2x − 1)/3 ≥ 5</b>, <b>−3(x − 2) < 12</b> and <b>2x + 9 > 5x − 3</b></p>
      ${steps(
        `<p><strong>Clear the bottom, then solve.</strong> 3 is positive, so the sign stays.</p>
         ${sum('2x − 1 ≥ 15 → 2x ≥ 16 → x ≥ 8')}`,
        `<p><strong>Expand the brackets first.</strong> Then divide by −3, and reverse the sign.</p>
         ${sum('−3x + 6 < 12 → −3x < 6 → x > −2')}`,
        `<p><strong>Both sides: take the smaller x term away.</strong></p>
         ${sum('9 > 3x − 3 → 12 > 3x → 4 > x, so x < 4')}
         ${ans('x>=8, x>-2, x<4')}`
      )}
      <p><strong>All at once:</strong> (x − 1)/2 ≤ x + 3 → x − 1 ≤ 2x + 6 → −7 ≤ x, so x ≥ −7.</p>
      ${tip('A fraction is fine in the answer, like x > 7/3. Only reverse the sign when you multiply or divide by a negative.')}`,

    // Y9 2G Q7, Q8, Q10, Q11: inequalities from a story
    'y9-2g-words': `
      <p class="hp-tag">Worked example: (a) Ben is x and his sister is 3 years older; their ages add to less than 30. (b) A bed is 4 m wide and (2x − 3) m long, with area less than 36 m². (c) Hire A: $50 plus 30c per km. Hire B: $80 plus 20c per km.</p>
      ${steps(
        `<p><strong>Write it, solve it, then think about whole numbers.</strong></p>
         ${sum('(a) x + (x + 3) < 30 → 2x < 27 → x < 13.5')}
         <p>Ages are whole years, so the oldest Ben can be is 13.</p>`,
        `<p><strong>A length must also be positive.</strong></p>
         ${sum('(b) 4(2x − 3) < 36 → 2x − 3 < 9 → x < 6<br>&nbsp;&nbsp;&nbsp;&nbsp;2x − 3 > 0 → x > 1.5')}`,
        `<p><strong>Cents into dollars, then compare.</strong> A is cheaper when:</p>
         ${sum('(c) 50 + 0.3k < 80 + 0.2k → 0.1k < 30 → k < 300')}
         ${ans('13; 2, 3, 4, 5; 299')}`
      )}
      ${tip('"Less than" never includes the end value, so k < 300 gives a greatest whole number of 299. Type a list with commas.')}`,

    // Y9 2G Q9: two inequalities together
    'y9-2g-both': `
      <p class="hp-tag">Worked example: how many integers satisfy both <b>2x + 1 ≤ 9</b> and <b>3 − x < 5</b>?</p>
      ${steps(
        `<p><strong>Solve each one.</strong></p>
         ${sum('2x ≤ 8 → x ≤ 4<br>−x < 2 → x > −2')}`,
        `<p><strong>Put both on one number line.</strong> The overlap is −2 < x ≤ 4.</p>
         ${nl(-3, 5, -2, false, 4, true, 'Open circle at −2, closed circle at 4, joined')}`,
        `<p><strong>Count the integers.</strong> −1, 0, 1, 2, 3, 4 (not −2, the circle is open).</p>
         ${ans('6')}`
      )}
      ${tip('Check the two ends carefully. If the two regions do not overlap, the answer is 0.')}`,

    // Y9 2G Q15: inequalities with letters
    'y9-2g-literal': `
      <p class="hp-tag">Worked example: p, q and r are positive. Solve <b>q − px > r</b> and <b>(x + q)/p ≤ r</b> for x.</p>
      ${steps(
        `<p><strong>Move the term without x.</strong></p>
         ${sum('−px > r − q')}`,
        `<p><strong>Divide by −p.</strong> p is positive, so −p is negative: reverse the sign.</p>
         ${sum('x < (r − q)/(−p) = (q − r)/p')}`,
        `<p><strong>Second one:</strong> multiply by p (positive, so no reversal), then take q.</p>
         ${sum('x + q ≤ pr → x ≤ pr − q')}
         ${ans('x < (q − r)/p, x ≤ pr − q')}`
      )}
      ${tip('The sign of the letter decides whether to reverse. Dividing by a positive letter keeps the sign; dividing by minus a positive letter reverses it.')}`,

    // =====================================================================
    // 2H Using formulas
    // =====================================================================
    // Y9 2H Q1: substituting into a formula
    'y9-2h-evaluate': `
      <p class="hp-tag">Worked example: evaluate <b>F = ma</b> (m = 6.5, a = 4), <b>M = (a + b + c)/3</b> (a = 14, b = −5, c = 6) and <b>h = √(3d/2)</b> (d = 20)</p>
      ${steps(
        `<p><strong>Replace each letter, then calculate.</strong></p>
         ${sum('F = 6.5 × 4 = 26')}`,
        `<p><strong>Work out the top first.</strong></p>
         ${sum('M = (14 − 5 + 6)/3 = 15/3 = 5')}`,
        `<p><strong>Inside the square root first, then the root.</strong> Round at the end.</p>
         ${sum('h = √(3 × 20 ÷ 2) = √30 = 5.477... ≈ 5.48')}
         ${ans('26, 5, 5.48')}`
      )}
      ${tip('Use the π button rather than 3.14. Keep the full calculator value and round only the final answer to two decimal places.')}`,

    // Y9 2H Q2: substitute, then solve
    'y9-2h-solve': `
      <p class="hp-tag">Worked example: (a) <b>V = lwh</b>, V = 96, l = 8, w = 3. Find h. (b) <b>A = ½bh</b>, A = 35, b = 10. Find h. (c) <b>A = πr²</b>, A = 60. Find r.</p>
      ${steps(
        `<p><strong>Substitute what you know, then solve the equation that is left.</strong></p>
         ${sum('(a) 96 = 8 × 3 × h = 24h → h = 4')}`,
        `<p><strong>Simplify the known part first.</strong> ½ × 10 = 5.</p>
         ${sum('(b) 35 = 5h → h = 7')}`,
        `<p><strong>A square: divide, then take the square root.</strong> r is a length, so take the positive root.</p>
         ${sum('(c) r² = 60/π = 19.098... → r = 4.370... ≈ 4.37')}
         ${ans('4, 7, 4.37')}`
      )}
      ${tip('Do not round in the middle. Type the answer to the decimal places asked.')}`,

    // Y9 2H Q3: changing the subject
    'y9-2h-subject': `
      <p class="hp-tag">Worked example: make the letter in brackets the subject. (a) <b>P = 2l + 2w</b> [w] (b) <b>V = πr²h</b> [h] (c) <b>E = mc²</b> [c], c > 0</p>
      ${steps(
        `<p><strong>Undo in reverse order.</strong> Take away 2l, then divide by 2.</p>
         ${sum('(a) P − 2l = 2w → w = (P − 2l)/2')}`,
        `<p><strong>Divide by everything multiplying h.</strong></p>
         ${sum('(b) h = V/(πr²)')}`,
        `<p><strong>A square: get it alone, then square root.</strong></p>
         ${sum('(c) c² = E/m → c = √(E/m)')}
         ${ans('w=(P-2l)/2, h=V/(pi*r^2), c=sqrt(E/m)')}`
      )}
      ${tip('Start with the new subject and =. Type π as pi and √ as sqrt( ), with brackets round a bottom of more than one factor: V/(pi*r^2).')}`,

    // Y9 2H Q4, Q5, Q6, Q7: a formula in context
    'y9-2h-context': `
      <p class="hp-tag">Worked example: a taxi fare is <b>C = 4 + 2.5d</b> dollars for d km.</p>
      ${steps(
        `<p><strong>Forwards: substitute.</strong> A 12 km trip:</p>
         ${sum(`C = 4 + ${now('2.5 × 12')} = 4 + 30 = 34`)}`,
        `<p><strong>Rearrange to make d the subject.</strong></p>
         ${sum('C − 4 = 2.5d → d = (C − 4)/2.5')}`,
        `<p><strong>Backwards: how far for $49?</strong></p>
         ${sum('d = (49 − 4)/2.5 = 45/2.5 = 18')}
         ${ans('34, d=(C-4)/2.5, 18')}`
      )}
      <p><strong>Watch the units.</strong> If t is in seconds and you are given 4 minutes, use t = 240. If the answer is in seconds but asked "to the nearest minute", divide by 60 at the end. In V = 900 − 0.5t the amount goes down, because t has a negative coefficient.</p>
      ${tip('Read what each letter stands for, and its units, before you substitute.')}`,

    // Y9 2H Q8: writing a formula
    'y9-2h-write': `
      <p class="hp-tag">Worked example: write a formula, with the first letter as the subject.</p>
      ${steps(
        `<p><strong>Units:</strong> c cents given d dollars. There are 100 cents in a dollar.</p>
         ${sum('c = 100d')}`,
        `<p><strong>Percentages as multipliers.</strong> 20% off the marked price $M means you pay 80%. 5% more than $P is 105%.</p>
         ${sum('S = 0.8M &nbsp;&nbsp; V = 1.05P')}`,
        `<p><strong>Fee plus rate; start amount minus rate.</strong> $50 upfront plus $18 per hour. Distance left in a 42 km race at 10 km/h.</p>
         ${sum('C = 50 + 18t &nbsp;&nbsp; d = 42 − 10t')}
         ${ans('c=100d, S=0.8M, V=1.05P, C=50+18t, d=42-10t')}`
      )}
      ${tip('Test your formula with an easy number: 2 dollars should give c = 200 cents ✓.')}`,

    // Y9 2H Q9: a formula from a diagram
    'y9-2h-diagram': `
      <p class="hp-tag">Worked example: write a formula for x.</p>
      ${fig({ kind: 'diagram', unit: 40, alt: 'A straight line with angles x, y and 40 degrees', items: [
        { seg: [-3, 0, 3, 0] }, { seg: [0, 0, 0.855, 2.349] }, { seg: [0, 0, -1.915, 1.607] },
        { angle: [0, 0, 0, 70], label: 'x°' }, { angle: [0, 0, 70, 140], label: 'y°' }, { angle: [0, 0, 140, 180], label: '40°' }] })}
      ${steps(
        `<p><strong>Angles on a straight line add to 180°.</strong></p>
         ${sum('x + y + 40 = 180 → x = 140 − y')}`,
        `<p><strong>Regular shapes: all sides equal.</strong> A regular hexagon with perimeter P has side s:</p>
         ${sum('s = P/6')}`,
        `<p><strong>Isosceles triangle</strong> with base angles x° each and top angle y°:</p>
         ${sum('2x + y = 180 → x = (180 − y)/2')}
         ${ans('x=140-y, s=P/6, x=(180-y)/2')}`
      )}
      ${tip('Write the angle or length fact as an equation first, then make the letter the subject. Type it starting with x = .')}`,

    // Y9 2H Q10: formulas with many letters
    'y9-2h-many': `
      <p class="hp-tag">Worked example: in Australian football, the score is <b>T = 6g + b</b> (g goals, b behinds).</p>
      ${steps(
        `<p><strong>12 goals and 9 behinds.</strong></p>
         ${sum('6 × 12 + 9 = 72 + 9 = 81')}`,
        `<p><strong>Backwards:</strong> a total of 70 with 10 behinds.</p>
         ${sum('70 = 6g + 10 → 6g = 60 → g = 10')}`,
        `<p><strong>Long formulas: one part at a time.</strong> R = (a + b/2) − c/d with a = 20, b = 8, c = 6, d = 4:</p>
         ${sum('a + b/2 = 24, &nbsp; c/d = 1.5, &nbsp; R = 24 − 1.5 = 22.5')}
         ${ans('81, 10, 22.5')}`
      )}
      ${tip('List each letter with its value before you start, so none gets missed or swapped.')}`,

    // =====================================================================
    // 2I Simultaneous equations using substitution
    // =====================================================================
    // Y9 2I Q1, Q2, Q3: substitution
    'y9-2i-substitute': `
      <p class="hp-tag">Worked example: solve <b>2x + y = 11</b> and <b>y = x + 2</b></p>
      ${steps(
        `<p><strong>Replace y with what it equals, in brackets.</strong></p>
         ${sum('2x + (x + 2) = 11 → 3x + 2 = 11 → 3x = 9 → x = 3')}`,
        `<p><strong>Put x back into the simpler equation.</strong></p>
         ${sum('y = 3 + 2 = 5')}
         <p>Check in the other one: 2 × 3 + 5 = 11 ✓</p>
         ${ans('(3,5)')}`,
        `<p><strong>x as the subject works the same way.</strong> x + 2y = 7 and x = y + 1:</p>
         ${sum('(y + 1) + 2y = 7 → 3y = 6 → y = 2, x = 3')}
         ${ans('(3,2)')}`
      )}
      ${tip('Type the solution as a point with x first: (3, 5). Always check in both equations.')}`,

    // Y9 2I Q7: why the brackets matter
    'y9-2i-brackets': `
      <p class="hp-tag">Worked example: solve <b>y = 3x − 4</b> and <b>2x − y = 3</b></p>
      ${steps(
        `<p><strong>The wrong way:</strong> 2x − 3x − 4 = 3. The minus only reached the 3x.</p>`,
        `<p><strong>The right way: the minus applies to the whole of y.</strong></p>
         ${sum('2x − (3x − 4) = 3 → 2x − 3x + 4 = 3 → −x = −1 → x = 1')}`,
        `<p><strong>Find y.</strong></p>
         ${sum('y = 3 × 1 − 4 = −1')}
         ${ans('(1,-1)')}`
      )}
      ${tip('Always write brackets when you substitute an expression. Then expand carefully: −(3x − 4) = −3x + 4.')}`,

    // Y9 2I Q4, Q5, Q6: word problems
    'y9-2i-words': `
      <p class="hp-tag">Worked example: two numbers add to <b>70</b>, and the larger is <b>16</b> more than the smaller.</p>
      ${steps(
        `<p><strong>One letter for each unknown, one equation for each fact.</strong></p>
         ${sum('x + y = 70 &nbsp; and &nbsp; y = x + 16')}`,
        `<p><strong>Substitute and solve.</strong></p>
         ${sum('x + (x + 16) = 70 → 2x = 54 → x = 27, y = 43')}
         ${ans('27, 43')}`,
        `<p><strong>Rectangles.</strong> Perimeter 44 cm; length 4 more than three times the width: l = 3w + 4 and 2l + 2w = 44.</p>
         ${sum('2(3w + 4) + 2w = 44 → 8w + 8 = 44 → w = 4.5, l = 17.5')}`
      )}
      ${tip('"5 less than twice" is 2x − 5. Answer the question asked, and type a list with commas.')}`,

    // Y9 2I Q8: both equations with y as the subject
    'y9-2i-equal': `
      <p class="hp-tag">Worked example: solve <b>y = 2x + 7</b> and <b>y = 1 − x</b></p>
      ${steps(
        `<p><strong>Both equal y, so they equal each other.</strong></p>
         ${sum('2x + 7 = 1 − x → 3x = −6 → x = −2')}`,
        `<p><strong>Find y from either equation.</strong></p>
         ${sum('y = 1 − (−2) = 3')}
         ${ans('(-2,3)')}`,
        `<p><strong>On a graph, the solution is where the lines cross.</strong></p>
         ${graph([-5, 3], [-2, 9], [{ m: 2, c: 7, label: 'y = 2x + 7', at: [1.2, 8.2] }, { m: -1, c: 1, label: 'y = 1 − x', at: [-4.9, 6.9] }], [-2, 3], 'Two lines crossing at (−2, 3)')}`
      )}
      ${tip('Fractions? Multiply both sides by the LCD first. y = x/2 + 3 and y = (x + 9)/3 give 3x + 18 = 2x + 18, so x = 0 and y = 3.')}`,

    // Y9 2I Q9: letters as coefficients
    'y9-2i-literal': `
      <p class="hp-tag">Worked example: solve <b>px + y = q</b> and <b>y = 2x</b> for x and y.</p>
      ${steps(
        `<p><strong>Substitute.</strong></p>
         ${sum('px + 2x = q')}`,
        `<p><strong>Factorise out x, then divide.</strong></p>
         ${sum('x(p + 2) = q → x = q/(p + 2)')}`,
        `<p><strong>Find y.</strong></p>
         ${sum('y = 2x = 2q/(p + 2)')}
         ${ans('x=q/(p+2), y=2q/(p+2)')}`
      )}
      ${tip('Type x = ... or just the expression, with brackets round a bottom of more than one term: q/(p+2).')}`,

    // =====================================================================
    // 2J Simultaneous equations using elimination
    // =====================================================================
    // Y9 2J Q1: adding the equations
    'y9-2j-add': `
      <p class="hp-tag">Worked example: solve <b>2x + y = 9</b> [1] and <b>5x − y = 12</b> [2]</p>
      ${steps(
        `<p><strong>The y terms have opposite signs, so add.</strong> They cancel.</p>
         ${sum('[1] + [2]: 7x = 21 → x = 3')}`,
        `<p><strong>Substitute into [1].</strong></p>
         ${sum('6 + y = 9 → y = 3')}`,
        `<p><strong>Check in [2].</strong> 15 − 3 = 12 ✓</p>
         ${ans('(3,3)')}`
      )}
      ${tip('Type the point with x first: (3, 3). Add every term, both sides.')}`,

    // Y9 2J Q2, Q9: subtracting the equations
    'y9-2j-subtract': `
      <p class="hp-tag">Worked example: solve <b>5x + 2y = 19</b> [1] and <b>2x + 2y = 10</b> [2]</p>
      ${steps(
        `<p><strong>The y terms match (same sign), so subtract.</strong></p>
         ${sum('[1] − [2]: 3x = 9 → x = 3')}`,
        `<p><strong>Substitute into [2].</strong></p>
         ${sum('6 + 2y = 10 → y = 2')}
         ${ans('(3,2)')}`,
        `<p><strong>Either order works.</strong> [2] − [1] gives −3x = −9, so x = 3 again, just with more negatives.</p>`
      )}
      ${tip('Subtract every term, signs and all: 3y − (−5y) = 8y, and −2y − (−2y) = 0.')}`,

    // Y9 2J Q3, Q4, Q10: multiplying first
    'y9-2j-multiply': `
      <p class="hp-tag">Worked example: solve <b>2x + 3y = 13</b> [1] and <b>x − y = 4</b> [2], then <b>4x + 3y = 7</b> and <b>3x − 2y = 18</b></p>
      ${steps(
        `<p><strong>Multiply one equation so a pair of terms matches.</strong> [2] × 3 gives −3y, which cancels with +3y.</p>
         ${sum('3x − 3y = 12<br>add [1]: 5x = 25 → x = 5, then y = 1')}
         ${ans('(5,1)')}`,
        `<p><strong>Sometimes both need multiplying.</strong> Make the y terms 6y and −6y.</p>
         ${sum('× 2: 8x + 6y = 14<br>× 3: 9x − 6y = 54<br>add: 17x = 68 → x = 4')}`,
        `<p><strong>Find y.</strong></p>
         ${sum('16 + 3y = 7 → 3y = −9 → y = −3')}
         ${ans('(4,-3)')}`
      )}
      ${tip('Substitution works too: rearrange first, like x − y = 4 → x = y + 4, then substitute. Choose whichever is less work.')}`,

    // Y9 2J Q5, Q6, Q7, Q8: word problems
    'y9-2j-words': `
      <p class="hp-tag">Worked example: (a) two numbers add to <b>60</b> and differ by <b>14</b>. (b) Two complementary angles differ by <b>24°</b>. (c) A shop sells 25 cakes and buns on Monday; on Tuesday it sells twice as many cakes and three times as many buns, 60 in all.</p>
      ${steps(
        `<p><strong>Sum and difference: add the equations.</strong></p>
         ${sum('(a) x + y = 60, x − y = 14 → 2x = 74 → x = 37, y = 23')}`,
        `<p><strong>Complementary angles add to 90°.</strong></p>
         ${sum('(b) x + y = 90, x − y = 24 → 2x = 114 → x = 57, y = 33')}`,
        `<p><strong>Multiply to match, then subtract.</strong></p>
         ${sum('(c) c + b = 25 → × 2: 2c + 2b = 50<br>&nbsp;&nbsp;&nbsp;&nbsp;2c + 3b = 60 → subtract: b = 10, c = 15')}
         ${ans('37, 23; 57, 33; 15, 10')}`
      )}
      ${tip('Perimeter facts halve nicely: 2l + 2w = P becomes l + w = P/2. Type lists with commas.')}`,

    // Y9 2J Q11: no solution
    'y9-2j-none': `
      <p class="hp-tag">Worked example: solve <b>2x + 3y = 5</b> and <b>2x + 3y = 9</b></p>
      ${steps(
        `<p><strong>Subtract.</strong></p>
         ${sum('0 = 4')}
         <p>That can never be true, so there is no solution.</p>`,
        `<p><strong>The graphs are parallel lines</strong>: same steepness, different starting points, so they never meet.</p>
         ${graph([-1, 6], [-2, 4], [{ m: -2 / 3, c: 5 / 3, label: '2x + 3y = 5', at: [2.4, -2.5] }, { m: -2 / 3, c: 3, label: '2x + 3y = 9', at: [4.3, 1.1] }], null, 'Two parallel lines')}
         ${ans('None')}`,
        `<p><strong>Hidden parallels.</strong> y = 3x + 1 and 6x − 2y = 7. Substitute the first into the second:</p>
         ${sum('6x − 2(3x + 1) = 7<br>6x − 6x − 2 = 7<br>−2 = 7')}
         <p>The x terms vanish and what is left is false, so again there is no solution. The two lines are parallel.</p>`
      )}
      ${tip('If the working ends in something false like 0 = 4, there are no solutions. If it ends in 0 = 0, the equations are the same line.')}`,

    // Y9 2J Q12: elimination with letters
    'y9-2j-literal': `
      <p class="hp-tag">Worked example: solve <b>2x + py = q</b> [1] and <b>x + py = r</b> [2] for x and y.</p>
      ${steps(
        `<p><strong>The py terms match, so subtract.</strong></p>
         ${sum('[1] − [2]: x = q − r')}`,
        `<p><strong>Substitute into [2].</strong></p>
         ${sum('(q − r) + py = r → py = 2r − q')}`,
        `<p><strong>Divide by p.</strong></p>
         ${sum('y = (2r − q)/p')}
         ${ans('x=q-r, y=(2r-q)/p')}`
      )}
      ${tip('Treat the letters like numbers. Put brackets round a top with more than one term: (2r-q)/p.')}`,

    // =====================================================================
    // 2K Applications of simultaneous equations
    // =====================================================================
    // Y9 2K Q1, Q2, Q6: a total and a difference or multiple
    'y9-2k-total-diff': `
      <p class="hp-tag">Worked example: a court's length is <b>8 m</b> more than its width, and its perimeter is <b>64 m</b>.</p>
      ${steps(
        `<p><strong>One equation for each fact.</strong></p>
         ${sum('l = w + 8 &nbsp; and &nbsp; 2l + 2w = 64')}`,
        `<p><strong>Substitute and solve.</strong></p>
         ${sum('2(w + 8) + 2w = 64 → 4w + 16 = 64 → w = 12, l = 20')}
         ${ans('l=w+8, 2l+2w=64, 20, 12')}`,
        `<p><strong>"Times as many".</strong> 30 students choose soccer or netball, and twice as many choose soccer: s + n = 30 and s = 2n, so 3n = 30, n = 10 and s = 20.</p>`
      )}
      ${tip('Type equations with the = sign, like l=w+8. Check the answers fit both facts.')}`,

    // Y9 2K Q3, Q4, Q5: two purchases
    'y9-2k-purchases': `
      <p class="hp-tag">Worked example: 3 pies and 2 drinks cost <b>$20</b>. 1 pie and 4 drinks cost <b>$15</b>.</p>
      ${steps(
        `<p><strong>One equation per purchase.</strong></p>
         ${sum('3p + 2d = 20 [1] &nbsp; p + 4d = 15 [2]')}`,
        `<p><strong>Match the p terms, then subtract.</strong> [2] × 3:</p>
         ${sum('3p + 12d = 45<br>minus [1]: 10d = 25 → d = 2.5')}`,
        `<p><strong>Back into [2].</strong></p>
         ${sum('p + 10 = 15 → p = 5')}
         ${ans('3p+2d=20, p+4d=15, 5, 2.50')}`
      )}
      ${tip('Money can be typed as 2.50 or 2.5. In an equation, write the decimal without the trailing zero: 21.5, not 21.50.')}`,

    // Y9 2K Q7, Q8, Q11: how many, and how much they are worth
    'y9-2k-count-value': `
      <p class="hp-tag">Worked example: a jar has <b>40</b> coins, all 20c or $1, worth <b>$16</b> in total.</p>
      ${steps(
        `<p><strong>A count equation and a value equation</strong> (in cents, so no decimals).</p>
         ${sum('x + y = 40 [1] &nbsp; 20x + 100y = 1600 [2]')}`,
        `<p><strong>[1] × 20, then subtract from [2].</strong></p>
         ${sum('20x + 20y = 800 → 80y = 800 → y = 10')}`,
        `<p><strong>Then x = 30.</strong> Check: 30 × 20c = $6 and 10 × $1 = $10, total $16 ✓.</p>
         ${ans('30, 10')}`
      )}
      ${tip('Use the same units in every term. Tickets work the same way: number of tickets in one equation, money collected in the other.')}`,

    // Y9 2K Q9, Q10: ages or amounts after a change
    'y9-2k-later': `
      <p class="hp-tag">Worked example: a mum is <b>36</b> years older than her daughter. In <b>3</b> years she will be <b>5</b> times as old.</p>
      ${steps(
        `<p><strong>Now, and later.</strong> Add 3 to both ages for "later".</p>
         ${sum('m = d + 36 &nbsp; and &nbsp; m + 3 = 5(d + 3)')}`,
        `<p><strong>Substitute.</strong></p>
         ${sum('d + 39 = 5d + 15 → 24 = 4d → d = 6')}`,
        `<p><strong>Then m = 42.</strong> Check: in 3 years, 45 and 9, and 45 = 5 × 9 ✓.</p>
         ${ans('42 (daughter 6)')}`
      )}
      <p><strong>Money changes too.</strong> Ava has twice as much as Bo. If Bo is given $60, he has three times as much as Ava: a = 2b and b + 60 = 3a, so b + 60 = 6b, b = 12 and a = 24.</p>
      ${tip('Only change the amounts the story changes. Answer for the person the question asks about.')}`,

    // Y9 2K Q12, Q13: distance, speed and time
    'y9-2k-speed': `
      <p class="hp-tag">Worked example: (a) a walker at <b>5 km/h</b> has a <b>2 hour</b> head start on a cyclist at <b>15 km/h</b>. (b) 2 h running and 1 h cycling covers 40 km; 1 h running and 3 h cycling covers 70 km.</p>
      ${steps(
        `<p><strong>Catching up: equal distances.</strong> The walker has been going t + 2 hours.</p>
         ${sum('(a) 5(t + 2) = 15t → 10 = 10t → t = 1 hour')}`,
        `<p><strong>Distance = speed × time for each trip.</strong> Running r km/h, cycling c km/h.</p>
         ${sum('(b) 2r + c = 40 [1] &nbsp; r + 3c = 70 [2]')}`,
        `<p><strong>[2] × 2, then subtract [1].</strong></p>
         ${sum('2r + 6c = 140 → 5c = 100 → c = 20, r = 10')}
         ${ans('1 hour; 10 km/h, 20 km/h')}`
      )}
      ${tip('Write the time each person travels before writing the distances.')}`,

    // Y9 2K Q14, Q15, Q16: digit problems
    'y9-2k-digits': `
      <p class="hp-tag">Worked example: the digits of a two-digit number add to <b>9</b>. Swapping the digits gives a number <b>45</b> more. Find the number.</p>
      ${steps(
        `<p><strong>Tens digit t and ones digit u: the number is 10t + u.</strong> Swapped, it is 10u + t.</p>
         ${sum('t + u = 9 &nbsp; and &nbsp; 10u + t = 10t + u + 45')}`,
        `<p><strong>Simplify the second.</strong></p>
         ${sum('9u − 9t = 45 → u − t = 5')}`,
        `<p><strong>Add the two equations.</strong></p>
         ${sum('2u = 14 → u = 7, t = 2')}
         ${ans('27')}`
      )}
      <p><strong>Only the difference known?</strong> With just u − t = 5 (and no 0 digit), the numbers are 16, 27, 38 and 49. Check: 72 − 27 = 45 ✓.</p>
      ${tip('Remember 63 means 6 tens and 3 ones, so it is 10 × 6 + 3. Swapping digits always changes a number by a multiple of 9.')}`
  });
})();
