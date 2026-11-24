/* H3 help panels for Year 8 Chapter 8. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 8A to 8K. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers (specs for figures.js) ----
  // Two-circle Venn diagram: circle names, then the numbers for left only, both, right only, outside.
  const venn = (A, B, p, q, r, s) => ({ kind: 'diagram', unit: 30, items: [
    { poly: [[-5, -3], [5, -3], [5, 3.2], [-5, 3.2]] },
    { circle: [-1.2, -0.2, 2.2] }, { circle: [1.2, -0.2, 2.2] },
    { label: A, at: [-1.9, 2.55] }, { label: B, at: [1.9, 2.55] },
    { label: p, at: [-2.2, -0.2] }, { label: q, at: [0, -0.2] }, { label: r, at: [2.2, -0.2] }, { label: s, at: [4.2, -2.5] }] });
  // Tally marks: rows of [label, count]; a bundle of five is four strokes with one across.
  const tally = (rows, head) => {
    const items = [{ label: head[0], at: [0, 1.15], anchor: 'start' }, { label: head[1], at: [4.2, 1.15], anchor: 'start' }];
    rows.forEach(([lab, n], r) => {
      const y = -r * 1.15; let x = 4.3;
      items.push({ label: lab, at: [0, y + 0.15], anchor: 'start' });
      for (let g = 0; g < Math.floor(n / 5); g++) {
        for (let k = 0; k < 4; k++) items.push({ seg: [x + k * 0.28, y - 0.1, x + k * 0.28, y + 0.65] });
        items.push({ seg: [x - 0.15, y + 0.05, x + 0.99, y + 0.5] }); x += 1.49;
      }
      for (let k = 0; k < n % 5; k++) items.push({ seg: [x + k * 0.28, y - 0.1, x + k * 0.28, y + 0.65] });
    });
    return { kind: 'diagram', unit: 30, items };
  };
  // Divided bar on a scale: parts of [label, length]; the running totals are marked underneath.
  const hbar = (parts, unitName) => {
    const items = [{ label: '0', at: [0, -0.9] }, { seg: [0, 0, 0, -0.3], thin: true }]; let x = 0;
    parts.forEach(([lab, w]) => {
      items.push({ poly: [[x, 0], [x + w, 0], [x + w, 2], [x, 2]] }, { label: lab, at: [x + w / 2, 0.85] });
      x += w; items.push({ seg: [x, 0, x, -0.3], thin: true }, { label: String(x), at: [x, -0.9] });
    });
    items.push({ label: unitName, at: [x / 2, -1.9] });
    return { kind: 'diagram', unit: 20, items };
  };
  // Frequency graph with no numbers on the scale: [value, height in blocks].
  const blocks = (cols) => {
    const top = Math.max(...cols.map(c => c[1])) + 1;
    const items = [{ seg: [0, 0, cols.length + 0.6, 0], arrow: 'end' }, { seg: [0, 0, 0, top], arrow: 'end' }];
    cols.forEach(([v, h], i) => items.push({ poly: [[0.3 + i, 0], [1.3 + i, 0], [1.3 + i, h], [0.3 + i, h]], fill: true }, { label: v, at: [0.8 + i, -0.6] }));
    return { kind: 'diagram', unit: 28, items };
  };
  // Tree diagram: stages = [['H', 'T'], ['1', '2', '3']] (every node branches the same way), or
  // stages[k] can be a function of the path so far, for choosing without putting back.
  const tree = (stages, o = {}) => {
    const items = [], gap = o.gap || 1;
    const kidsOf = (k, path) => (typeof stages[k] === 'function' ? stages[k](path) : stages[k]);
    const count = (k, path) => (k === stages.length ? 1 : kidsOf(k, path).reduce((a, lab) => a + count(k + 1, path.concat(lab)), 0));
    let leaf = count(0, []) - 1;
    const top = leaf * gap;
    const sub = (k, path) => {
      const kids = kidsOf(k, path).map((lab, i) => {
        const p = path.concat(lab);
        return [lab, i, k + 1 === stages.length ? (leaf-- * gap) : sub(k + 1, p), p];
      });
      const y = (kids[0][2] + kids[kids.length - 1][2]) / 2;
      const xa = k === 0 ? 0.15 : 3 * k + 0.42, xb = 3 * (k + 1) - 0.42;
      kids.forEach(([lab, i, cy, p]) => {
        items.push({ seg: [xa, y, xb, cy] }, { label: lab, at: [3 * (k + 1), cy] });
        if (o.probs) items.push({ label: o.probs[k][i], at: [(xa + xb) / 2 - 0.25, (y + cy) / 2 + 0.3] });
        if (k + 1 === stages.length && o.outcomes !== false) items.push({ label: p.join(o.join || ''), at: [3 * (k + 1) + 2.1, cy] });
      });
      return y;
    };
    sub(0, []);
    (o.heads || []).forEach((h, k) => items.push({ label: h, at: [3 * (k + 1), top + gap + 0.2] }));
    if (o.outcomes !== false) items.push({ label: 'Outcome', at: [3 * stages.length + 2.1, top + gap + 0.2] });
    return { kind: 'diagram', unit: o.unit || 30, items };
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 8A Interpreting graphs and tables
    // =====================================================================
    // Y8 8A Q1, Q2: reading a column graph
    'y8-8a-columns': `
      <p class="hp-tag">Worked example: the graph shows how many laps four friends swam.</p>
      ${fig({ kind: 'columns', cats: ['Tia', 'Sam', 'Kit', 'Raj'], values: [12, 18, 9, 15], ymax: 20, step: 2, xlabel: 'Swimmer', ylabel: 'Laps', title: 'Laps swum' })}
      ${steps(
        `<p><strong>Read a column.</strong> Go from the top of the column straight across to the scale. Sam swam 18 laps. Kit's column stops halfway between 8 and 10, so Kit swam 9.</p>`,
        `<p><strong>For a difference, read both columns, then subtract.</strong></p>
         ${sum('Sam − Kit = 18 − 9 = 9 laps')}`,
        `<p><strong>Most and least</strong> are just the tallest and shortest columns.</p>
         ${ans('18, 9 laps more, most: Sam, least: Kit')}`
      )}
      ${tip('Check the scale first: here each gridline is 2 laps, not 1. Type just the number, with no units.')}`,

    // Y8 8A Q3, Q11: reading a table
    'y8-8a-table': `
      <p class="hp-tag">Worked example: a school library counted the books borrowed each term.</p>
      ${fig({ kind: 'table', rows: [['Term', '1', '2', '3', '4'], ['Fiction', '42', '38', '35', '40'], ['Comics', '25', '29', '33', '36'], ['Non-fiction', '18', '22', '20', '15']] })}
      ${steps(
        `<p><strong>Read one cell:</strong> find the row, then the column. Comics in Term 3: 33.</p>`,
        `<p><strong>Totals: add down a column for one term, or across a row for one type.</strong></p>
         ${sum('Term 2: 38 + 29 + 22 = 89<br>Comics all year: 25 + 29 + 33 + 36 = 123')}`,
        `<p><strong>Trends: read along a row.</strong> Comics went up every term. Fiction fell, then rose. Non-fiction rose, then fell.</p>
         ${ans('33, 89, 123')}`
      )}
      ${tip('"Most popular" or "pleases the most" means the biggest number in the row or column the question is about. A total row adds up the column above it.')}`,

    // Y8 8A Q4, Q8, Q9: reading a line graph
    'y8-8a-line': `
      <p class="hp-tag">Worked example: the graph shows the temperature of a cup of cocoa as it cools.</p>
      ${fig({ kind: 'linegraph', xs: ['0', '2', '4', '6', '8', '10'], ys: [80, 62, 50, 42, 37, 34], ymin: 30, ymax: 90, step: 10, xlabel: 'Time (minutes)', ylabel: 'Temperature (°C)', title: 'A cooling cup of cocoa' })}
      ${steps(
        `<p><strong>Read a point:</strong> go up from the time, then across to the scale. At 4 minutes it is 50°C.</p>`,
        `<p><strong>Change: end value minus start value.</strong></p>
         ${sum('80 − 34 = 46, so it cooled by 46°C')}
         <p>When did it first reach 42°C? Find 42 on the scale and go across to the line: 6 minutes.</p>`,
        `<p><strong>Linear or non-linear?</strong> The points do not sit on one straight line. The graph curves and flattens out.</p>
         ${ans('Non-linear')}`
      )}
      <p><strong>Two graphs?</strong> Where they meet, the two values are equal. A value below 0 on the scale means below the starting level, such as under the water.</p>
      ${tip('Type a time the way the axis shows it, for example 10 a.m. or 3 p.m.')}`,

    // Y8 8A Q6: continuing a linear trend
    'y8-8a-trend': `
      <p class="hp-tag">Worked example: the height of a burning candle is measured every hour.</p>
      ${fig({ kind: 'table', rows: [['Hour', '0', '1', '2', '3', '4'], ['Height (cm)', '18.0', '17.4', '16.8', '16.2', '15.6']] })}
      ${steps(
        `<p><strong>Find the change each step.</strong> Every hour the height drops by 0.6 cm. The change is the same each time, so the graph is a straight line (linear).</p>`,
        `<p><strong>Change over several steps:</strong> subtract the two values.</p>
         ${sum('First 3 hours: 18.0 − 16.2 = 1.8 cm')}`,
        `<p><strong>Continue the trend.</strong> Hour 4 is 15.6 cm. Hour 6 is 2 more steps, each taking off 0.6.</p>
         ${sum('15.6 − 0.6 − 0.6 = 14.4 cm')}
         ${ans('1.8, 14.4')}`
      )}
      ${tip('Count the extra steps carefully: from hour 4 to hour 6 is 2 steps, not 6. Type only the number, such as 14.4.')}`,

    // Y8 8A Q5, Q7: sector graphs and divided bar graphs
    'y8-8a-sector': `
      <p class="hp-tag">Worked example: how the students in one class get to school.</p>
      ${fig({ kind: 'sector', parts: [['Bus (40%)', 40], ['Walk (30%)', 30], ['Car (20%)', 20], ['Bike (10%)', 10]] })}
      ${steps(
        `<p><strong>Largest and smallest:</strong> the biggest and smallest sectors. Bus is the largest, Bike the smallest.</p>`,
        `<p><strong>A part gives you the whole.</strong> 12 students walk, and Walk is 30%.</p>
         ${sum('30% is 12 students<br>10% is 12 ÷ 3 = 4 students<br>100% is 4 × 10 = 40 students')}`,
        `<p><strong>Divided bar on a scale:</strong> each part runs from one mark to the next. Kai's day:</p>
         ${fig(hbar([['Sleep', 9], ['School', 7], ['Gym', 2], ['Other', 6]], 'Hours'))}
         ${sum('Gym: 18 − 16 = 2 hours<br>Fraction of the day: 2/24 = 1/12')}
         ${ans('Bus, Bike, 40 students, 1/12')}`
      )}
      ${tip('When a question says simplest form, type 1/12, not 2/24. A whole sector graph is 100%, and a whole day is 24 hours.')}`,

    // Y8 8A Q10: which graph supports which claim
    'y8-8a-persuade': `
      <p class="hp-tag">Worked example: three graphs were made about a new bike path.</p>
      ${chips(['Graph 1: how many people say they would use it'], ['Graph 2: its cost next to other projects'], ['Graph 3: accidents on the road now'])}
      ${steps(
        `<p><strong>Work out what each graph measures.</strong> Read its title and axis labels, not just the shape of the bars.</p>`,
        `<p><strong>Match each claim to the graph whose data backs it up.</strong></p>
         ${flow(['Claim', 'the path will be popular'], ['Use', 'Graph 1'])}
         ${flow(['Claim', 'the road is dangerous now'], ['Use', 'Graph 3'])}`,
        `<p><strong>Watch for tricks.</strong> A scale that does not start at 0 makes small differences look huge. A big "Other" column can hide the thing you care about.</p>
         ${ans('Popular: Graph 1, Dangerous: Graph 3, Cheap: Graph 2')}`
      )}
      ${tip('A graph can be accurate and still be chosen to push one side. Ask who made it, and what it leaves out.')}`,

    // Y8 8A Q13: using rates from a table
    'y8-8a-water': `
      <p class="hp-tag">Worked example: a meal uses 300 g of potato, 60 g of cheese and 120 g of chicken. How much water was used to produce them? What is the water efficiency of potato?</p>
      ${fig({ kind: 'table', rows: [['Food', 'Footprint (L/kg)'], ['potato', '290'], ['cheese', '5000'], ['chicken', '4300']] })}
      ${steps(
        `<p><strong>The rate is per kilogram, so change grams to kilograms</strong> (divide by 1000): 0.3 kg, 0.06 kg and 0.12 kg.</p>`,
        `<p><strong>Multiply each mass by its footprint, then add.</strong></p>
         ${sum('0.3 × 290 = 87<br>0.06 × 5000 = 300<br>0.12 × 4300 = 516<br>87 + 300 + 516 = 903 L')}`,
        `<p><strong>Efficiency turns the rate upside down:</strong> how much food 1 kL (1000 L) makes.</p>
         ${sum('1000 ÷ 290 = 3.448... kg, which is 3448 g')}
         ${ans('903 L, 3448 g per kL')}`
      )}
      ${tip('Round only at the very end. A big footprint means a small efficiency.')}`,

    // Y8 8A Q14: counting points in a band, then a sector angle
    'y8-8a-months': `
      <p class="hp-tag">Worked example: hours of sunshine on 10 days. A "good" day has from 6 to 9 hours.</p>
      ${fig({ kind: 'linegraph', xs: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], ys: [5, 7, 8.5, 10, 9, 6, 4.5, 7.5, 11, 8], ymin: 2, ymax: 12, step: 1, xlabel: 'Day', ylabel: 'Sunshine (hours)' })}
      ${steps(
        `<p><strong>Picture lines across at 6 and at 9.</strong> Count the points below 6: days 1 and 7, so 2 days.</p>`,
        `<p><strong>Count the band, then above it.</strong> From 6 to 9: days 2, 3, 5, 6, 8 and 10, so 6 days. Above 9: days 4 and 9, so 2 days. Check: 2 + 6 + 2 = 10 ✓</p>`,
        `<p><strong>As a sector angle:</strong> fraction of the whole × 360°.</p>
         ${sum('6/10 × 360 = 216°')}
         ${ans('2, 6, 2, 216')}`
      )}
      ${tip('A point exactly on 6 or 9 counts as inside the band here. Type an angle as a number only, such as 216.')}`,

    // =====================================================================
    // 8B Frequency tables and tallies
    // =====================================================================
    // Y8 8B Q1, Q2: tallies into frequencies
    'y8-8b-tally': `
      <p class="hp-tag">Worked example: the tally shows how long some students slept last night.</p>
      ${fig(tally([['5-6 h', 4], ['7-8 h', 12], ['9-10 h', 8], ['11+ h', 1]], ['Sleep', 'Tally']))}
      ${steps(
        `<p><strong>Each bundle of four strokes with one across is 5.</strong> Count the bundles in fives, then add the single strokes.</p>
         ${sum('7-8 h: 5 + 5 + 2 = 12')}
         <p>Frequencies, top to bottom: 4, 12, 8, 1.</p>`,
        `<p><strong>Total surveyed: add every frequency.</strong></p>
         ${sum('4 + 12 + 8 + 1 = 25')}`,
        `<p><strong>"At least 9" means 9 or more</strong>, so add the bottom two rows: 8 + 1 = 9. "Less than 7" is just the 5-6 row: 4.</p>
         ${ans('4, 12, 8, 1')}`
      )}
      ${tip('Type frequencies in row order, separated by commas. Shots that missed = shots − goals. If a question is per day but the table is per week, convert first: 1 hour a day is 7 hours a week.')}`,

    // Y8 8B Q3, Q4, Q6: building a frequency table from a list
    'y8-8b-build': `
      <p class="hp-tag">Worked example: the number of siblings of 16 students is <b>1, 0, 2, 1, 3, 1, 0, 2, 1, 4, 2, 1, 0, 1, 2, 3</b>.</p>
      ${steps(
        `<p><strong>Write every possible value in order,</strong> from the smallest to the largest, even any that nobody has.</p>`,
        `<p><strong>Go through the list once,</strong> crossing off each value as you tally it.</p>
         ${fig({ kind: 'table', rows: [['Siblings', '0', '1', '2', '3', '4'], ['Frequency', '3', '6', '4', '2', '1']] })}`,
        `<p><strong>Check: the frequencies add to the number of values.</strong></p>
         ${sum('3 + 6 + 4 + 2 + 1 = 16 ✓')}
         ${ans('3, 6, 4, 2, 1')}`
      )}
      <p><strong>Grouped data:</strong> put each value in its interval. 47 goes in 40-49, and 50 starts the next one. <strong>Matching a list to a column:</strong> the list 8, 8, 9 has two 8s and one 9.</p>
      ${tip('Type the frequencies in the order of the table, separated by commas.')}`,

    // Y8 8B Q5, Q7: reading a frequency table, totals and the mean
    'y8-8b-read': `
      <p class="hp-tag">Worked example: some students were asked how many pets they have.</p>
      ${fig({ kind: 'table', rows: [['Pets', '0', '1', '2', '3', '4'], ['Frequency', '4', '7', '5', '3', '1']] })}
      ${steps(
        `<p><strong>Number of people: add the frequencies.</strong></p>
         ${sum('4 + 7 + 5 + 3 + 1 = 20 students')}`,
        `<p><strong>Total pets: each value × its frequency, then add.</strong> The 7 students with 1 pet have 7 pets between them.</p>
         ${sum('0 × 4 + 1 × 7 + 2 × 5 + 3 × 3 + 4 × 1<br>= 0 + 7 + 10 + 9 + 4 = 30 pets')}`,
        `<p><strong>Mean = total ÷ number of people.</strong></p>
         ${sum('30 ÷ 20 = 1.5')}
         ${ans('20 students, 30 pets, mean 1.5')}`
      )}
      <p><strong>Several columns of frequencies?</strong> Add down one column for one group, or across one row for one value over every group.</p>
      ${tip('Divide by the number of people, not by the number of columns. Round to one decimal place when asked, like 1.5.')}`,

    // Y8 8B Q8, Q9: regrouping intervals; stem-and-leaf to a table
    'y8-8b-regroup': `
      <p class="hp-tag">Worked example: regroup this table into the intervals 0-7, 8-15 and 16-19.</p>
      ${fig({ kind: 'table', rows: [['Score', '0-3', '4-7', '8-11', '12-15', '16-19'], ['Frequency', '2', '3', '6', '4', '5']] })}
      ${steps(
        `<p><strong>Join neighbouring intervals and add their frequencies.</strong></p>
         ${sum('0-7: 2 + 3 = 5<br>8-15: 6 + 4 = 10<br>16-19: stays 5')}`,
        `<p><strong>You can only join whole intervals.</strong> To split one (say 8-11 into 8-9 and 10-11) you need extra facts, which the question will give you.</p>`,
        `<p><strong>Stem-and-leaf to a table:</strong> each stem is one interval of width 10. Count its leaves.</p>
         ${fig({ kind: 'stemleaf', rows: [['4', '2 5 8'], ['5', '0 1 1 6 9'], ['6', '3 7']], key: '5 | 1 means 51' })}
         ${sum('40-49: 3, 50-59: 5, 60-69: 2')}
         ${ans('5, 10, 5 and 3, 5, 2')}`
      )}
      ${tip('However you regroup, the frequencies still add to the same total. Once data is in a table you cannot get the exact values back.')}`,

    // Y8 8B Q10: the most common value must appear at least ...
    'y8-8b-pigeon': `
      <p class="hp-tag">Worked example: a player plays 10 games and scores 0, 1, 2 or 3 goals in each. What is the smallest number of times her most common score could appear?</p>
      ${steps(
        `<p><strong>Count the possible scores:</strong> 0, 1, 2 and 3, so 4 scores.</p>`,
        `<p><strong>Spread the games as evenly as you can.</strong> 8 games can use each score twice. The last 2 games must repeat a score a third time.</p>
         ${chips(['0: 3 games'], ['1: 3 games'], ['2: 2 games'], ['3: 2 games'])}`,
        `<p><strong>So some score appears at least 3 times,</strong> and 3 is possible.</p>
         ${ans('3')}`
      )}
      ${tip('A different score in every game is only possible if there are at least as many possible scores as games. With 4 possible scores, 5 games already forces a repeat.')}`,

    // Y8 8B Q11: how many orders match a frequency table
    'y8-8b-arrange': `
      <p class="hp-tag">Worked example: Leo practised guitar on 4 nights, Monday to Thursday.</p>
      ${fig({ kind: 'table', rows: [['Hours', '1', '2'], ['Frequency', '1', '3']] })}
      ${steps(
        `<p><strong>"Never less than the night before" means smallest first:</strong> 1, 2, 2, 2. So Wednesday, the third night, was 2 hours.</p>`,
        `<p><strong>Count every order.</strong> Only the 1 is different, and it can go on any of the 4 nights.</p>
         ${chips(['1222'], ['2122'], ['2212'], ['2221'])}`,
        `<p><strong>Five nights of 1, 1, 2, 2, 2?</strong> List where the two 1s go: Mon and Tue, Mon and Wed, ... Fri is never first. That gives 10 orders.</p>
         ${ans('2 hours, 4 ways, 10 ways')}`
      )}
      ${tip('List in a fixed order (move the first 1 along, then the second) so you never miss or repeat one. If one night is already known, only arrange the others.')}`,

    // =====================================================================
    // 8C Graphs of frequency tables
    // =====================================================================
    // Y8 8C Q1, Q2, Q7, Q12: dot plots
    'y8-8c-dotplot': `
      <p class="hp-tag">Worked example: draw this frequency table as a dot plot.</p>
      ${fig({ kind: 'table', rows: [['Number', '1', '2', '3', '4', '9'], ['Frequency', '2', '5', '3', '1', '1']] }, { kind: 'dotplot', min: 1, max: 9, values: [1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 9] })}
      ${steps(
        `<p><strong>Draw a number line that covers every value,</strong> then stack one dot for each count. The value 2 gets 5 dots.</p>`,
        `<p><strong>Mode: the tallest stack</strong>, which is 2. <strong>Outlier: a value far from the rest</strong>, which is 9.</p>`,
        `<p><strong>Dot plot back to a table:</strong> count the dots above each number. Numbers with no dots (5, 6, 7 and 8) get a frequency of 0.</p>
         ${ans('mode 2, outlier 9')}`
      )}
      ${tip('Dot plots suit small data sets. For hundreds of values, a frequency graph is much easier to read.')}`,

    // Y8 8C Q3, Q4, Q5, Q6: frequency graphs
    'y8-8c-freqgraph': `
      <p class="hp-tag">Worked example: books read in a month by some Year 8 students.</p>
      ${fig({ kind: 'table', rows: [['Books', '0', '1', '2', '3', '4'], ['Frequency', '3', '7', '5', '2', '1']] }, { kind: 'columns', cats: ['0', '1', '2', '3', '4'], values: [3, 7, 5, 2, 1], ymax: 8, step: 1, xlabel: 'Books', ylabel: 'Frequency' })}
      ${steps(
        `<p><strong>Each value gets one column, and its height is the frequency.</strong> Keep the values in order along the bottom.</p>`,
        `<p><strong>Reading a graph back into a table:</strong> go from the top of each column across to the scale. Grouped data works the same, with intervals such as 0-9 under the columns.</p>`,
        `<p><strong>Starting from a list?</strong> Make the frequency table first. The value with the biggest frequency has the tallest column (and the most dots in a dot plot).</p>
         ${ans('3, 7, 5, 2, 1')}`
      )}
      ${tip('Matching a graph to a table? Check every column, not just the first few. Wrong graphs often swap two columns near the end.')}`,

    // Y8 8C Q8, Q9, Q10, Q13: interpreting and comparing frequency graphs
    'y8-8c-compare': `
      <p class="hp-tag">Worked example: how many emails Kim and Lou got each day for 10 days.</p>
      ${fig({ kind: 'columns', cats: ['0', '1', '2', '3', '4'], values: [0, 3, 4, 2, 1], ymax: 5, step: 1, xlabel: 'Emails', ylabel: 'Days', caption: 'Kim' }, { kind: 'columns', cats: ['0', '1', '2', '3', '4'], values: [2, 4, 3, 1, 0], ymax: 5, step: 1, xlabel: 'Emails', ylabel: 'Days', caption: 'Lou' })}
      ${steps(
        `<p><strong>Number of days: add the column heights.</strong></p>
         ${sum('Kim: 0 + 3 + 4 + 2 + 1 = 10 days')}`,
        `<p><strong>Total emails: value × frequency, then add.</strong></p>
         ${sum('1 × 3 + 2 × 4 + 3 × 2 + 4 × 1 = 3 + 8 + 6 + 4 = 21')}`,
        `<p><strong>Compare.</strong> Kim's columns sit further right, so she usually gets more. Her record is 4 in a day (the highest value with a column). Her 0 column is empty, so she got an email every day.</p>
         ${ans('10 days, 21 emails, Kim gets more')}`
      )}
      ${tip('A frequency graph shows how often each value happened, not when, so it cannot show improvement over time. A few strange values far from the rest usually have a reason, such as being absent.')}`,

    // Y8 8C Q11: every value moves by the same amount
    'y8-8c-shift': `
      <p class="hp-tag">Worked example: the ages of a group of children.</p>
      ${fig({ kind: 'columns', cats: ['10', '11', '12', '13', '14'], values: [2, 4, 7, 3, 1], ymax: 8, step: 1, xlabel: 'Age', ylabel: 'Frequency' })}
      ${steps(
        `<p><strong>In 5 years everyone is 5 years older.</strong> Every age goes up by 5, and the frequencies stay the same.</p>`,
        `<p><strong>Move each column.</strong> The tallest column, 12, moves to 12 + 5 = 17. The column for 16 holds the people who are 11 now: 4 people.</p>`,
        `<p><strong>Going back in time, subtract.</strong> 5 years ago the youngest, 10, was 10 − 5 = 5.</p>
         ${ans('17, 4, 5')}`
      )}
      ${tip('The shape of the graph does not change at all. It just slides along the axis.')}`,

    // Y8 8C Q14: which graph is which
    'y8-8c-match': `
      <p class="hp-tag">Worked example: a kindergarten class's ages (years), heights (cm) and weights (kg) were graphed, but the labels fell off.</p>
      ${fig({ kind: 'columns', cats: ['2', '3', '4', '5'], values: [3, 6, 7, 4], ymax: 8, step: 2, title: 'Graph X' }, { kind: 'columns', cats: ['90', '100', '110', '120'], values: [2, 6, 8, 4], ymax: 8, step: 2, title: 'Graph Y' }, { kind: 'columns', cats: ['12', '15', '18', '21'], values: [4, 7, 6, 3], ymax: 8, step: 2, title: 'Graph Z' })}
      ${steps(
        `<p><strong>Read the numbers along the bottom first.</strong> The heights of the columns matter less.</p>`,
        `<p><strong>Ask which values make sense.</strong> Small children are 2 to 5 years old, about 90 to 120 cm tall and about 12 to 21 kg.</p>`,
        `<p><strong>Think about the spread.</strong> One class has a narrow spread. A mixed crowd, like a shopping centre, has a very wide spread, from babies to grandparents.</p>
         ${ans('Age: X, Height: Y, Weight: Z')}`
      )}
      ${tip('Rough guide: primary students are about 110 to 150 cm and 20 to 45 kg; adults are about 150 to 190 cm and 50 to 100 kg.')}`,

    // =====================================================================
    // 8D Measures of centre
    // =====================================================================
    // Y8 8D Q1, Q2, Q3, Q8: mean and mode
    'y8-8d-mean-mode': `
      <p class="hp-tag">Worked example: find the mean and mode of <b>8, 3, 11, 3, 6, 5</b>. Then the mean of <b>−5, 2, −1, 0, −6</b>.</p>
      ${steps(
        `<p><strong>Mean: add them all, then divide by how many there are.</strong></p>
         ${sum('8 + 3 + 11 + 3 + 6 + 5 = 36<br>36 ÷ 6 = 6')}`,
        `<p><strong>Mode: the value that appears most often.</strong> 3 appears twice, so the mode is 3.</p>`,
        `<p><strong>Negatives work the same way.</strong> The 0 still counts as one of the values.</p>
         ${sum('−5 + 2 + (−1) + 0 + (−6) = −10<br>−10 ÷ 5 = −2')}
         ${ans('mean 6, mode 3; mean -2')}`
      )}
      ${tip('Type a negative answer with a minus sign, like -2. Decimal data works the same: round the mean only at the end, for example to 2 decimal places.')}`,

    // Y8 8D Q4, Q5, Q6: median
    'y8-8d-median': `
      <p class="hp-tag">Worked example: find the median of <b>14, 5, 10, 16, 7</b>, of <b>3, 8, 4, 11, 6, 13</b>, and of <b>−3, 5, −8, 1, 4</b>.</p>
      ${steps(
        `<p><strong>Sort first. An odd count has one middle value.</strong></p>
         ${sum('5, 7, ' + now('10') + ', 14, 16 → median 10')}`,
        `<p><strong>An even count has two middle values. Take halfway between them.</strong></p>
         ${sum('3, 4, ' + now('6, 8') + ', 11, 13 → (6 + 8) ÷ 2 = 7')}`,
        `<p><strong>Negatives sort below zero.</strong> The most negative comes first.</p>
         ${sum('−8, −3, ' + now('1') + ', 4, 5 → median 1')}
         ${ans('10, 7, 1')}`
      )}
      ${tip('The middle position is (n + 1) ÷ 2. For 9 values that is the 5th; for 10 values it is halfway between the 5th and 6th.')}`,

    // Y8 8D Q7: stem-and-leaf plot
    'y8-8d-stemleaf': `
      <p class="hp-tag">Worked example: the times (minutes) some students took to walk home.</p>
      ${fig({ kind: 'stemleaf', rows: [['1', '5 8'], ['2', '0 3 3 7'], ['3', '1 5']], key: '2 | 3 means 23 minutes' })}
      ${steps(
        `<p><strong>Write it out as a list.</strong> The stem is the tens and each leaf is the ones. A stem-and-leaf plot is already in order.</p>
         ${sum('15, 18, 20, 23, 23, 27, 31, 35')}`,
        `<p><strong>Median and mode.</strong> 8 values, so the median is halfway between the 4th and 5th: both are 23. The mode is also 23.</p>`,
        `<p><strong>Mean: add the list and divide by 8.</strong></p>
         ${sum('15 + 18 + 20 + 23 + 23 + 27 + 31 + 35 = 192<br>192 ÷ 8 = 24')}
         ${ans('median 23, mean 24, mode 23')}`
      )}
      ${tip('Type a list with commas, smallest first, like 15, 18, 20.')}`,

    // Y8 8D Q9, Q10: centre from a frequency table or graph
    'y8-8d-freq': `
      <p class="hp-tag">Worked example: a gymnast's scores over 10 weeks.</p>
      ${fig({ kind: 'table', rows: [['Score', '4', '5', '6', '7', '8'], ['Frequency', '1', '3', '4', '0', '2']] })}
      ${steps(
        `<p><strong>How many values?</strong> Add the frequencies: 1 + 3 + 4 + 0 + 2 = 10.</p>`,
        `<p><strong>Mean: value × frequency, add, then divide.</strong></p>
         ${sum('4 × 1 + 5 × 3 + 6 × 4 + 7 × 0 + 8 × 2<br>= 4 + 15 + 24 + 0 + 16 = 59<br>59 ÷ 10 = 5.9')}`,
        `<p><strong>Median: keep a running total.</strong> 10 values, so find the 5th and 6th. Running totals: 1, then 4, then 8. Both the 5th and 6th are in the 6 column. The mode is the biggest frequency, also 6.</p>
         ${ans('mean 5.9, median 6, mode 6')}`
      )}
      ${tip('Divide by the number of values, not the number of columns. Round to 2 decimal places when asked, like 12.47.')}`,

    // Y8 8D Q11: finding a missing number
    'y8-8d-missing': `
      <p class="hp-tag">Worked example: find the missing number ? in each set.</p>
      ${steps(
        `<p><strong>Mean of 5, 12, ?, 9 is 8.</strong> Work out what the total must be.</p>
         ${sum('Total = 4 × 8 = 32<br>Known: 5 + 12 + 9 = 26<br>? = 32 − 26 = 6')}`,
        `<p><strong>Median of 3, 15, 7, ?, 20 is 10.</strong> With 5 values the median is one of them. 3 and 7 are below 10, and 15 and 20 are above, so ? must be 10.</p>`,
        `<p><strong>Median of 4, 9, ?, 16, 2, 30 is 12.</strong> Sorted, the known values are 2, 4, 9, 16, 30. The middle two must average 12. Try ? between 9 and 16:</p>
         ${sum('(9 + ?) ÷ 2 = 12, so ? = 15<br>Check: 2, 4, 9, 15, 16, 30 ✓')}
         ${ans('6, 10, 15')}`
      )}
      ${tip('A missing mode is the easiest: the missing number must make that value the most common. A missing number can be negative if the total needs it.')}`,

    // Y8 8D Q12, Q14: the effect of an outlier
    'y8-8d-outlier': `
      <p class="hp-tag">Worked example: how far Ella ran each day.</p>
      ${fig({ kind: 'table', rows: [['Day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ['Distance (km)', '4', '7', '5', '4', '10']] })}
      ${steps(
        `<p><strong>Find all three.</strong></p>
         ${sum('Mean: (4 + 7 + 5 + 4 + 10) ÷ 5 = 30 ÷ 5 = 6<br>Median: 4, 4, 5, 7, 10 → 5<br>Mode: 4')}`,
        `<p><strong>Now make Friday 25 km, an outlier.</strong></p>
         ${sum('Mean: (4 + 7 + 5 + 4 + 25) ÷ 5 = 45 ÷ 5 = 9<br>Median: 4, 4, 5, 7, 25 → still 5<br>Mode: still 4')}`,
        `<p><strong>One extreme value drags the mean a long way,</strong> but the median and mode hardly move.</p>
         ${ans('Only the mean changes')}`
      )}
      ${tip('With one huge value, the median is the better "typical" value. Type big money answers as digits only, like 1250000.')}`,

    // Y8 8D Q13: changing every value
    'y8-8d-transform': `
      <p class="hp-tag">Worked example: the set <b>1, 3, 3, 5, 8</b>.</p>
      ${steps(
        `<p><strong>Start with the mean and median.</strong></p>
         ${sum('(1 + 3 + 3 + 5 + 8) ÷ 5 = 20 ÷ 5 = 4, median 3')}`,
        `<p><strong>Multiply or add, and the mean does the same.</strong> Every value × 3 makes the mean 4 × 3 = 12. Every value + 10 makes the mean 4 + 10 = 14.</p>`,
        `<p><strong>Squaring is different: square every value first.</strong></p>
         ${sum('1, 9, 9, 25, 64<br>1 + 9 + 9 + 25 + 64 = 108<br>108 ÷ 5 = 21.6 (not 4² = 16)')}
         <p>The median is the middle of the new list, 9, which is 3².</p>
         ${ans('4, 12, 14, 21.6, median 9')}`
      )}
      ${tip('Adding or multiplying shifts or stretches the whole set, so the mean follows. For squares you must work every value out again.')}`,

    // Y8 8D Q15: median from a graph with no numbers on the scale
    'y8-8d-noscale': `
      <p class="hp-tag">Worked example: find the median. The graph is to scale, but the frequencies are missing.</p>
      ${fig(blocks([['10', 3], ['11', 1], ['12', 2]]))}
      ${steps(
        `<p><strong>Measure in blocks.</strong> The columns are 3, 1 and 2 blocks tall, so 6 blocks altogether. (Each block could be 1 person or 10; the median comes out the same.)</p>`,
        `<p><strong>Find the middle.</strong> 6 values, so halfway between the 3rd and 4th. The first 3 are 10, and the 4th is 11.</p>`,
        `<p><strong>Halfway between them:</strong></p>
         ${sum('(10 + 11) ÷ 2 = 10.5')}
         ${ans('10.5')}`
      )}
      ${tip('If the middle lands inside one column, the median is simply the value of that column.')}`,

    // Y8 8D Q16: is this data set possible?
    'y8-8d-possible': `
      <p class="hp-tag">Worked example: is each set possible? (a) <b>Four items with mean 5, median 4 and mode 3.</b> (b) <b>Five different items with mode 2.</b></p>
      ${steps(
        `<p><strong>Try to build one.</strong> For (a), the mode needs two 3s: 3, 3, ?, ?. The median is halfway between the 2nd and 3rd items, so the 3rd item is 5.</p>
         ${sum('Total = 4 × 5 = 20<br>Last item = 20 − 3 − 3 − 5 = 9<br>3, 3, 5, 9 ✓')}`,
        `<p><strong>If it will not build, find the rule that blocks it.</strong> For (b), a mode needs a value that repeats, and all five are different.</p>
         ${ans('(a) Possible (b) Not possible')}`
      )}
      ${tip('Start with the mode and median, since they fix actual values. Use the mean last, to find the total.')}`,

    // Y8 8D Q17: lowest and highest possible mean from grades
    'y8-8d-grades': `
      <p class="hp-tag">Worked example: a student's grades are A, C and B. Her final mark is the mean of her marks.</p>
      ${fig({ kind: 'table', rows: [['Mark', '80-100', '65-79', '50-64', '0-49'], ['Grade', 'A', 'B', 'C', 'D']] })}
      ${steps(
        `<p><strong>Lowest: use the bottom of each band.</strong></p>
         ${sum('(80 + 50 + 65) ÷ 3 = 195 ÷ 3 = 65')}`,
        `<p><strong>Highest: use the top of each band.</strong></p>
         ${sum('(100 + 64 + 79) ÷ 3 = 243 ÷ 3 = 81')}`,
        `<p><strong>Final grade:</strong> anywhere from 65 to 81, so it could be B or A.</p>
         ${ans('65, 81, A or B')}`
      )}
      ${tip('Use the band edges exactly: the top of B here is 79, not 80. A final mark outside the lowest-to-highest range is impossible.')}`,

    // =====================================================================
    // 8E Measures of spread
    // =====================================================================
    // Y8 8E Q1, Q2: range
    'y8-8e-range': `
      <p class="hp-tag">Worked example: find the range of <b>9, 4, 17, 7, 13, 6</b> and of <b>3.6, −2.4, 5.1, −0.8</b>.</p>
      ${steps(
        `<p><strong>Range = highest − lowest.</strong></p>
         ${sum('17 − 4 = 13')}`,
        `<p><strong>With negatives, the lowest is the most negative.</strong> Subtracting a negative means adding.</p>
         ${sum('5.1 − (−2.4) = 5.1 + 2.4 = 7.5')}
         ${ans('13, 7.5')}`
      )}
      ${tip('A range can never be negative. You do not need to sort the whole list, just spot the biggest and smallest.')}`,

    // Y8 8E Q3, Q5: interquartile range (even number of values)
    'y8-8e-iqr': `
      <p class="hp-tag">Worked example: find the IQR of <b>15, 4, 22, 9, 27, 6, 20, 13</b>.</p>
      ${steps(
        `<p><strong>Sort, then cut the list into two halves.</strong></p>
         ${sum('4, 6, 9, 13 &nbsp;|&nbsp; 15, 20, 22, 27')}`,
        `<p><strong>Each quartile is the median of its half.</strong></p>
         ${sum('Lower quartile Q1 = (6 + 9) ÷ 2 = 7.5<br>Upper quartile Q3 = (20 + 22) ÷ 2 = 21')}`,
        `<p><strong>IQR = Q3 − Q1.</strong></p>
         ${sum('21 − 7.5 = 13.5')}
         ${ans('13.5')}`
      )}
      ${tip('With 6 values each half has 3, so each quartile is just the middle value of its half. Negatives and decimals work the same way.')}`,

    // Y8 8E Q4, Q8: IQR with an odd number of values
    'y8-8e-iqr-odd': `
      <p class="hp-tag">Worked example: find the IQR of <b>2, 6, 8, 10, 13, 17, 21</b>.</p>
      ${steps(
        `<p><strong>Find the median and leave it out.</strong> 7 values, so the median is the 4th: 10.</p>
         ${sum('2, 6, 8, ' + now('10') + ', 13, 17, 21')}`,
        `<p><strong>Quartiles from each half.</strong> Lower half 2, 6, 8, so Q1 = 6. Upper half 13, 17, 21, so Q3 = 17.</p>`,
        `<p><strong>Subtract.</strong></p>
         ${sum('IQR = 17 − 6 = 11')}
         ${ans('11')}`
      )}
      <p><strong>9 values?</strong> Leave out the 5th. Each half has 4 values, so each quartile is halfway between two of them.</p>
      ${tip('Data read from a table (like a week of readings) is usually not in order. Sort it first.')}`,

    // Y8 8E Q6, Q7, Q13: comparing ranges
    'y8-8e-compare': `
      <p class="hp-tag">Worked example: Ana's scores are <b>6, 9, 7, 8, 10</b> and Ben's are <b>2, 12, 5, 11, 9</b>.</p>
      ${steps(
        `<p><strong>Find each range.</strong></p>
         ${sum('Ana: 10 − 6 = 4<br>Ben: 12 − 2 = 10')}`,
        `<p><strong>A smaller range means more consistent.</strong> Ana's scores are closer together.</p>`,
        `<p><strong>A new score raises Ana's range by 3.</strong> It must be 3 past one end: 10 + 3 = 13 or 6 − 3 = 3. Use the context to decide which makes sense.</p>
         ${ans('4, 10, Ana is more consistent')}`
      )}
      <p><strong>Changing every value:</strong> adding 3 to each slides the data along, so the range stays the same. Tripling each value triples the range.</p>
      ${tip('Only the largest and smallest values affect the range.')}`,

    // Y8 8E Q9, Q15: range and IQR from a frequency table
    'y8-8e-freq': `
      <p class="hp-tag">Worked example: find the range and IQR.</p>
      ${fig({ kind: 'table', rows: [['Number', '3', '4', '5', '6', '7', '8'], ['Frequency', '2', '1', '3', '0', '2', '1']] })}
      ${steps(
        `<p><strong>Write the data as a list.</strong> The frequency says how many times to write each number.</p>
         ${sum('3, 3, 4, 5, 5, 5, 7, 7, 8 (9 values)<br>Range = 8 − 3 = 5')}`,
        `<p><strong>Leave out the median, the 5th value (5).</strong></p>
         ${sum('Lower half 3, 3, 4, 5 → Q1 = (3 + 4) ÷ 2 = 3.5<br>Upper half 5, 7, 7, 8 → Q3 = 7')}`,
        `<p><strong>Subtract.</strong></p>
         ${sum('IQR = 7 − 3.5 = 3.5')}
         ${ans('range 5, IQR 3.5')}`
      )}
      ${tip('A frequency of 0 means that number is not in the list. Doubling every number doubles both the range and the IQR.')}`,

    // Y8 8E Q11, Q12, Q14: range or IQR when there is an outlier
    'y8-8e-outlier': `
      <p class="hp-tag">Worked example: the set <b>2, 4, 5, 5, 7, 9, 9, 10</b>.</p>
      ${steps(
        `<p><strong>Range and IQR.</strong></p>
         ${sum('Range = 10 − 2 = 8<br>Q1 = (4 + 5) ÷ 2 = 4.5, Q3 = (9 + 9) ÷ 2 = 9<br>IQR = 9 − 4.5 = 4.5')}`,
        `<p><strong>Change the 10 to 50.</strong> The range becomes 50 − 2 = 48. The halves are still 2, 4, 5, 5 and 7, 9, 9, 50, so the IQR is still 4.5.</p>`,
        `<p><strong>Why?</strong> The IQR only uses the middle half of the sorted data, so one extreme value cannot reach it.</p>
         ${ans('8 and 4.5, then 48 and 4.5')}`
      )}
      ${tip('The IQR measures the spread of the middle 50% of the values. The range uses the two most extreme values.')}`,

    // =====================================================================
    // 8F Surveying and sampling
    // =====================================================================
    // Y8 8F Q1, Q3, Q4: proportions from a sample
    'y8-8f-proportion': `
      <p class="hp-tag">Worked example: 50 phones are chosen at random and 8 have a cracked screen.</p>
      ${steps(
        `<p><strong>Proportion = number with the feature ÷ sample size.</strong></p>
         ${sum('8/50 = 4/25')}`,
        `<p><strong>Scale up to the population.</strong> In 1200 phones you would expect:</p>
         ${sum('4/25 × 1200 = 192 phones')}`,
        `<p><strong>From a table:</strong> 25 people were asked how many coffees they drink a day.</p>
         ${fig({ kind: 'table', rows: [['Coffees', '0', '1', '2', '3', '4'], ['Frequency', '10', '8', '4', '2', '1']] })}
         ${sum('Pr(2 or more) = (4 + 2 + 1)/25 = 7/25<br>In a group of 500: 7/25 × 500 = 140')}
         <p>The data piles up on the left with a tail to the right, so it is positively skewed.</p>
         ${ans('4/25, 192, 140')}`
      )}
      ${tip('Type a proportion as a fraction with a slash, like 4/25. A sample taken at a place linked to the topic (such as a sports survey at a training ground) is likely to be biased.')}`,

    // Y8 8F Q2: shapes of distributions
    'y8-8f-shape': `
      <p class="hp-tag">Worked example: name the shape of each graph.</p>
      ${fig({ kind: 'columns', cats: [' ', ' ', ' ', ' ', ' '], values: [2, 4, 7, 4, 2], ymax: 8, step: 2, caption: 'Symmetric' }, { kind: 'columns', cats: [' ', ' ', ' ', ' ', ' ', ' '], values: [6, 8, 5, 3, 2, 1], ymax: 8, step: 2, caption: 'Positively skewed' }, { kind: 'columns', cats: [' ', ' ', ' ', ' ', ' ', ' '], values: [1, 2, 3, 5, 8, 6], ymax: 8, step: 2, caption: 'Negatively skewed' }, { kind: 'columns', cats: [' ', ' ', ' ', ' ', ' ', ' ', ' '], values: [2, 6, 3, 1, 4, 7, 2], ymax: 8, step: 2, caption: 'Bi-modal' })}
      ${steps(
        `<p><strong>Find the peak, or peaks.</strong> Two separate peaks means <b>bi-modal</b>.</p>`,
        `<p><strong>Look for the tail</strong>, the long, low end. A tail to the right (towards bigger values) is <b>positively skewed</b>. A tail to the left is <b>negatively skewed</b>.</p>`,
        `<p><strong>One peak in the middle, matching on both sides?</strong> That is <b>symmetric</b>.</p>
         ${ans('Symmetric, positively skewed, negatively skewed, bi-modal')}`
      )}
      ${tip('Name the skew after the tail, not the peak. A peak on the left means the tail is on the right: positively skewed.')}`,

    // Y8 8F Q5, Q7: samples, populations and sampling methods
    'y8-8f-sample': `
      <p class="hp-tag">Worked example: a factory makes 5000 bottles a day and has 4 shifts of workers.</p>
      ${steps(
        `<p><strong>Population: every one of the things you want to know about. Sample: just some of them.</strong> Testing 40 bottles is a sample. Checking every bottle is the population.</p>`,
        `<p><strong>Name the way a sample of 40 workers is chosen.</strong></p>
         ${chips(['40 names drawn at random from the full list: simple random'], ['10 drawn at random from each shift: stratified'], ['the first 40 into the canteen: convenience'])}
         ${ans('Sample; simple random, stratified, convenience')}`
      )}
      ${tip('Stratified means each group gets its fair share, chosen at random inside the group. Convenience is quick, but often biased.')}`,

    // Y8 8F Q6: choosing good survey questions
    'y8-8f-questions': `
      <p class="hp-tag">Worked example: Ari wants to know if screen time is linked to test results. Which questions belong in the survey?</p>
      ${steps(
        `<p><strong>Keep questions about exactly what is being studied, with an answer you can measure.</strong></p>
         ${chips(['How many hours of screens do you have on a school night?', 'add'], ['What was your last maths test mark (%)?', 'add'])}`,
        `<p><strong>Drop vague or opinion questions.</strong> "A lot" means different things to different people.</p>
         ${chips(['Do you like screens?', 'take'], ['Are you smart?', 'take'], ['Are you on your phone a lot?', 'take'])}`,
        `<p><strong>Drop questions about something else, or a one-off day.</strong></p>
         ${chips(['What is your favourite app?', 'take'], ['How long were you online on New Year\'s Eve?', 'take'])}`
      )}
      ${tip('A good survey question is relevant, clear, and has an answer you can measure, usually a number.')}`,

    // Y8 8F Q9, Q11, Q12: bias from where and when a survey is run
    'y8-8f-bias': `
      <p class="hp-tag">Worked example: a survey to find how often people exercise each week.</p>
      ${steps(
        `<p><strong>Picture who would be at each place and time.</strong> At a gym at 6 a.m., most people exercise a lot, so the answers come out too high.</p>`,
        `<p><strong>Other places push the other way.</strong> At an all-day gaming tournament, the answers would come out too low.</p>`,
        `<p><strong>Least bias: choose people at random from the whole population,</strong> such as names drawn from a full list.</p>
         ${ans('Gym: too high; least bias: chosen at random from everyone')}`
      )}
      ${tip('Ask: are the people here unusual for this topic? If yes, the sample is biased. The time matters too: late-night shoppers are not typical shoppers.')}`,

    // Y8 8F Q10: outliers, shape and choosing measures
    'y8-8f-outlier': `
      <p class="hp-tag">Worked example: a machine checks the volume of juice in some bottles.</p>
      ${fig({ kind: 'table', rows: [['Volume (mL)', '248', '249', '250', '251', '252', '520'], ['Frequency', '2', '5', '9', '5', '2', '1']] })}
      ${steps(
        `<p><strong>Outlier:</strong> 520 is far from all the others. It is probably a measuring error.</p>`,
        `<p><strong>Shape without it:</strong> 2, 5, 9, 5, 2 is a mirror image, so it is symmetric.</p>`,
        `<p><strong>Choose measures the outlier cannot spoil.</strong> For spread, the IQR (the range would use 520). For the centre, the median (520 pulls the mean up).</p>
         ${ans('520; symmetric; IQR and median')}`
      )}
      ${tip('The range and the mean use every value, so one bad reading spoils them. The IQR and the median depend only on the middle of the data.')}`,

    // Y8 8F Q13: largest and smallest possible sample mean
    'y8-8f-extremes': `
      <p class="hp-tag">Worked example: a census of 50 households counted their cars. A sample of 5 households is chosen.</p>
      ${fig({ kind: 'table', rows: [['Cars', '0', '1', '2', '3', '4'], ['Households', '3', '18', '15', '10', '4']] })}
      ${steps(
        `<p><strong>Largest possible mean: take the biggest values you are allowed.</strong> Only 4 households have 4 cars, so the 5th must have 3.</p>
         ${sum('(4 + 4 + 4 + 4 + 3) ÷ 5 = 19 ÷ 5 = 3.8')}`,
        `<p><strong>Smallest possible mean: take the smallest.</strong> Only 3 households have 0 cars.</p>
         ${sum('(0 + 0 + 0 + 1 + 1) ÷ 5 = 2 ÷ 5 = 0.4')}`,
        `<p><strong>So a sample mean of 4 is impossible,</strong> but a sample mean of 2 is possible.</p>
         ${ans('3.8, 0.4')}`
      )}
      ${tip('The frequency tells you how many of each value there are to choose from. When the top value runs out, move to the next one down.')}`,

    // Y8 8F Q14: people who do not reply
    'y8-8f-nonresponse': `
      <p class="hp-tag">Worked example: 800 surveys are posted and 200 come back: 120 say yes and 80 say no.</p>
      ${steps(
        `<p><strong>Percentage of the replies:</strong></p>
         ${sum('120 ÷ 200 = 0.6 = 60%')}`,
        `<p><strong>If all 600 non-replies would have said yes:</strong></p>
         ${sum('(120 + 600) ÷ 800 = 720 ÷ 800 = 90%')}`,
        `<p><strong>If they would all have said no:</strong></p>
         ${sum('120 ÷ 800 = 15%')}
         ${ans('60, 90, 15')}`
      )}
      ${tip('The truth could be anywhere from 15% to 90%, so you cannot be sure what most people think. Type a percentage as a number, like 60.')}`,

    // =====================================================================
    // 8G Probability
    // =====================================================================
    // Y8 8G Q1, Q2: sample space, events and complements
    'y8-8g-sample': `
      <p class="hp-tag">Worked example: the letters of <b>PLANET</b> are on 6 cards and one is drawn at random.</p>
      ${steps(
        `<p><strong>Sample space: every possible outcome, once.</strong> All 6 are equally likely.</p>
         ${ans('P, L, A, N, E, T')}`,
        `<p><strong>Pr(event) = favourable outcomes ÷ total outcomes.</strong></p>
         ${sum('Pr(L) = 1/6<br>V = vowel = {A, E}, so Pr(V) = 2/6 = 1/3')}`,
        `<p><strong>The complement V′ (not V) is everything else.</strong></p>
         ${sum('V′ = {P, L, N, T}, so Pr(V′) = 4/6 = 2/3')}
         <p>Check: 1/3 + 2/3 = 1. A letter that is not on any card, like Z, has probability 0.</p>`
      )}
      ${tip('Type lists with commas: P, L, A, N, E, T. Type a probability as a fraction with a slash, like 1/3; simplest form is neatest.')}`,

    // Y8 8G Q3, Q7: at least, at most, multiples and factors
    'y8-8g-atleast': `
      <p class="hp-tag">Worked example: cards numbered 1 to 10; one is chosen at random.</p>
      ${steps(
        `<p><strong>"At least 7" means 7 or more. "At most 3" means 3 or less.</strong></p>
         ${sum('At least 7: {7, 8, 9, 10} → 4/10 = 2/5<br>At most 3: {1, 2, 3} → 3/10')}`,
        `<p><strong>List the outcomes that fit, then count.</strong></p>
         ${sum('Multiple of 3: {3, 6, 9} → 3/10<br>Factor of 20: {1, 2, 4, 5, 10} → 5/10 = 1/2')}`,
        `<p><strong>Naming a set:</strong> {1, 2, 3, 4} is "at most 4", and {8, 9, 10} is "at least 8".</p>
         ${ans('2/5, 3/10, 3/10, 1/2')}`
      )}
      ${tip('"At least" and "at most" include the number itself. "Greater than 7" would not include 7.')}`,

    // Y8 8G Q4, Q10: complements
    'y8-8g-complement': `
      <p class="hp-tag">Worked example: use Pr(A′) = 1 − Pr(A).</p>
      ${steps(
        `<p><strong>Fractions:</strong> if Pr(A) = 3/11, then</p>
         ${sum('Pr(A′) = 1 − 3/11 = 8/11')}`,
        `<p><strong>Decimals, both ways round.</strong></p>
         ${sum('Pr(B) = 0.27, so Pr(B′) = 1 − 0.27 = 0.73<br>Pr(C′) = 0.4, so Pr(C) = 0.6')}`,
        `<p><strong>Three colours.</strong> Pr(red) = 0.5 and Pr(not yellow) = 0.7, so Pr(yellow) = 0.3. All three add to 1, so Pr(blue) = 0.2. As tenths that is 5, 3 and 2, so the bag could hold just 10 marbles.</p>
         ${ans('8/11, 0.73, 0.6, 10 marbles')}`
      )}
      ${tip('Answer in the form the question uses: a fraction like 8/11 when it gives fractions, a decimal like 0.73 when it gives decimals.')}`,

    // Y8 8G Q14: twice (or three times) as likely
    'y8-8g-compare': `
      <p class="hp-tag">Worked example: Pr(Ana scores) = 0.25 and Pr(Dan scores) = 0.8.</p>
      ${steps(
        `<p><strong>"Three times as likely to score" multiplies the scoring chance.</strong></p>
         ${sum('Ben: 3 × 0.25 = 0.75')}`,
        `<p><strong>"Twice as likely to miss" doubles the missing chance.</strong> Find the miss chance first.</p>
         ${sum('Dan misses: 1 − 0.8 = 0.2<br>Cara misses: 2 × 0.2 = 0.4<br>Cara scores: 1 − 0.4 = 0.6')}`,
        `<p><strong>With a letter, Pr(scores) = p.</strong> Three times as likely to score: 3p. Three times as likely to miss: misses 3(1 − p), so</p>
         ${sum('scores = 1 − 3(1 − p) = 3p − 2')}
         ${ans('0.75, 0.6, 3p, 3p-2')}`
      )}
      ${tip('Type an expression without spaces or ×, like 3p-2. Pass and fail (or score and miss) are complements, so they add to 1.')}`,

    // Y8 8G Q5, Q6, Q8, Q9: counting sections or objects
    'y8-8g-count': `
      <p class="hp-tag">Worked example: this spinner has 10 equal sections.</p>
      ${fig({ kind: 'spinner', labels: ['R', 'R', 'B', 'Y', 'R', 'G', 'B', 'R', 'Y', 'R'] })}
      ${steps(
        `<p><strong>Count each kind and the total.</strong> R: 5, B: 2, Y: 2, G: 1, out of 10.</p>`,
        `<p><strong>Pr = how many fit ÷ total.</strong></p>
         ${sum('Pr(R) = 5/10 = 1/2<br>Pr(B or Y) = (2 + 2)/10 = 2/5<br>Pr(G′) = 9/10')}`,
        `<p><strong>Equally likely events have the same count.</strong> B and Y each have 2 sections.</p>
         ${ans('1/2, 2/5, 9/10')}`
      )}
      ${tip('If a question says "answer as a fraction", type a fraction like 2/5, not 0.4. Marbles in a bag work the same way: count each colour and the total.')}`,

    // Y8 8G Q11: what is guaranteed for a weighted die
    'y8-8g-weighted': `
      <p class="hp-tag">Worked example: a weighted 4-sided die (1 to 4). Which statements must be true?</p>
      ${chips(['Pr(at least 3) = Pr(3) + Pr(4)', 'add'], ['Pr(at most 4) = 1', 'add'], ['Pr(2) = 1/4', 'take'], ['Pr(1) = Pr(4)', 'take'])}
      ${steps(
        `<p><strong>Weighted means the chances are unknown.</strong> Anything that needs equal chances, like 1/4 each, is not guaranteed.</p>`,
        `<p><strong>Statements that only list outcomes are always true.</strong> "At least 3" is just 3 or 4. Every roll is at most 4.</p>`,
        `<p><strong>Check complements by listing.</strong> "At most 1" is {1} and "at least 2" is {2, 3, 4}: every outcome once, so they add to 1. "At most 2" and "at least 2" both contain 2, so together they make 1 + Pr(2).</p>
         ${ans('Green: always true. Amber: not guaranteed.')}`
      )}
      ${tip('Write out which numbers each event contains. If the events overlap or leave a gap, they do not add to exactly 1.')}`,

    // Y8 8G Q12, Q15: working backwards from probabilities
    'y8-8g-backwards': `
      <p class="hp-tag">Worked example: 10 counters are red, blue or yellow. Pr(red or blue) = 7/10 and Pr(red or yellow) = 1/2.</p>
      ${steps(
        `<p><strong>Turn each probability into a count out of 10.</strong> 7 counters are red or blue, so the other 3 are yellow.</p>`,
        `<p><strong>Use the second fact.</strong> 1/2 = 5/10, so 5 are red or yellow and the other 5 are blue. Then red = 10 − 3 − 5 = 2.</p>`,
        `<p><strong>Removing marbles:</strong> a bag has 6 red, 4 blue and 2 green. 3 are removed, and now Pr(green) = 0 and Pr(red) = 2/3. Both greens went, plus 1 more. 9 are left and 2/3 of 9 is 6, so all the reds are still there: the third was blue.</p>
         ${ans('red 2, blue 5, yellow 3; removed 0, 1, 2')}`
      )}
      ${tip('Type the counts in the order the question asks, separated by commas. After removing, use the new total on the bottom.')}`,

    // Y8 8G Q13: adding one of each colour again and again
    'y8-8g-adding': `
      <p class="hp-tag">Worked example: a bucket holds 1 red ball and 5 blue balls.</p>
      ${steps(
        `<p><strong>Start, then add one of each.</strong></p>
         ${sum('Pr(red) = 1/6<br>2 red, 6 blue: Pr(red) = 2/8 = 1/4')}`,
        `<p><strong>Blue is always 4 more than red.</strong> When is Pr(red) = 3/8? Then red : blue = 3 : 5, and the difference of 2 parts is 4 balls. So 1 part is 2 balls: 6 red and 10 blue.</p>
         ${sum('6 + 10 = 16 balls; check 6/16 = 3/8 ✓')}`,
        `<p><strong>In the long run</strong> the difference of 4 is tiny next to the totals, so red and blue become almost equal. Pr(red) gets closer and closer to 1/2.</p>
         ${ans('1/4, 16 balls, 1/2')}`
      )}
      ${tip('A table works too: add one of each on every row and watch the fraction.')}`,

    // =====================================================================
    // 8H Two-step experiments
    // =====================================================================
    // Y8 8H Q1, Q2, Q3: table of outcomes
    'y8-8h-table': `
      <p class="hp-tag">Worked example: a letter is chosen from <b>SUN</b>, then a 4-sided die (1 to 4) is rolled.</p>
      ${fig({ kind: 'table', rows: [['', '1', '2', '3', '4'], ['S', 'S1', 'S2', 'S3', 'S4'], ['U', 'U1', 'U2', 'U3', 'U4'], ['N', 'N1', 'N2', 'N3', 'N4']] })}
      ${steps(
        `<p><strong>One experiment down the side, the other across the top.</strong> Each cell is one outcome.</p>`,
        `<p><strong>Count the cells:</strong> 3 × 4 = 12, all equally likely.</p>
         ${sum('Pr(U3) = 1/12')}`,
        `<p><strong>For an event, count the cells that fit.</strong> A consonant and an even number: S2, S4, N2, N4.</p>
         ${sum('4/12 = 1/3')}
         ${ans('12, 1/12, 1/3')}`
      )}
      ${tip('Type an outcome the way the table writes it, side label first, like U3. "One shows A and the other shows B" counts both ways round.')}`,

    // Y8 8H Q4, Q6: repeated letters or colours
    'y8-8h-repeats': `
      <p class="hp-tag">Worked example: a letter is chosen from <b>SEE</b> and another from <b>BOB</b>.</p>
      ${fig({ kind: 'table', rows: [['', 'B', 'O', 'B'], ['S', 'SB', 'SO', 'SB'], ['E', 'EB', 'EO', 'EB'], ['E', 'EB', 'EO', 'EB']] })}
      ${steps(
        `<p><strong>Every repeated letter gets its own row or column,</strong> so every cell is equally likely: 3 × 3 = 9 outcomes.</p>`,
        `<p><strong>Count matching cells.</strong> EB appears 4 times.</p>
         ${sum('Pr(EB) = 4/9')}`,
        `<p><strong>Two vowels:</strong> EO appears twice, so 2/9. <strong>The same letter twice:</strong> no cell, so 0.</p>
         ${ans('4/9, 2/9, 0')}`
      )}
      ${tip('Never merge repeats: SEE has two Es, so E is twice as likely as S. Marbles of the same colour work the same way.')}`,

    // Y8 8H Q5, Q7: tables of totals or products
    'y8-8h-totals': `
      <p class="hp-tag">Worked example: two 4-sided dice (1 to 4) are rolled and the numbers are added.</p>
      ${fig({ kind: 'table', rows: [['+', '1', '2', '3', '4'], ['1', '2', '3', '4', '5'], ['2', '3', '4', '5', '6'], ['3', '4', '5', '6', '7'], ['4', '5', '6', '7', '8']] })}
      ${steps(
        `<p><strong>Fill each cell with the total</strong> (or the product, if the game multiplies). There are 16 cells.</p>`,
        `<p><strong>Count the cells for an event.</strong> A total of 6 appears 3 times.</p>
         ${sum('Pr(6) = 3/16<br>Pr(not 6) = 1 − 3/16 = 13/16')}`,
        `<p><strong>Most likely: the value in the most cells,</strong> 5 (4 cells). Least likely: 2 and 8 (1 cell each).</p>
         ${ans('3/16, 13/16, 5; 2 and 8')}`
      )}
      ${tip('For "more than" or "or less", count every cell that fits. Type two answers with a comma, like 2, 8.')}`,

    // Y8 8H Q8, Q10, Q11: multiplying for separate experiments
    'y8-8h-multiply': `
      <p class="hp-tag">Worked example: separate experiments, done together.</p>
      ${steps(
        `<p><strong>Number of outcomes: multiply.</strong> Experiments with 5 and 9 outcomes give 5 × 9 = 45 combined outcomes.</p>`,
        `<p><strong>Probability of both: multiply.</strong> A deck has 12 picture cards (J, Q, K in 4 suits).</p>
         ${sum('One deck: Pr(picture) = 12/52 = 3/13<br>Two decks: 3/13 × 3/13 = 9/169')}`,
        `<p><strong>Unequal chances:</strong> a spinner has Pr(X) = 3/4 and Pr(Y) = 1/4. It is spun twice.</p>
         ${sum('Pr(X then X) = 3/4 × 3/4 = 9/16<br>X and Y in either order: 3/16 + 3/16 = 3/8<br>At least one Y: 1 − 9/16 = 7/16')}
         ${ans('45, 9/169, 3/8, 7/16')}`
      )}
      ${tip('"Then" fixes the order: one product. "In either order" means add both orders.')}`,

    // Y8 8H Q9: "not" and "or" with two dice
    'y8-8h-complement': `
      <p class="hp-tag">Worked example: two dice are rolled and the numbers multiplied. Pr(product is 6) = 1/9 and Pr(product is 12) = 1/9.</p>
      ${steps(
        `<p><strong>"Not" is the complement.</strong></p>
         ${sum('Pr(not 6) = 1 − 1/9 = 8/9')}`,
        `<p><strong>"Or": the product cannot be 6 and 12 at once, so add.</strong></p>
         ${sum('Pr(6 or 12) = 1/9 + 1/9 = 2/9')}`,
        `<p><strong>Neither: the complement of "or".</strong></p>
         ${sum('1 − 2/9 = 7/9')}
         ${ans('8/9, 2/9, 7/9')}`
      )}
      ${tip('Only add for "or" when the events cannot happen together. If the fractions have different bottoms, change both to 36ths first.')}`,

    // =====================================================================
    // 8I Tree diagrams
    // =====================================================================
    // Y8 8I Q1, Q2, Q3: tree diagrams
    'y8-8i-tree': `
      <p class="hp-tag">Worked example: a spinner with three equal sections (R, G, B) is spun, then a coin is tossed.</p>
      ${fig(tree([['R', 'G', 'B'], ['H', 'T']], { heads: ['Spinner', 'Coin'] }))}
      ${steps(
        `<p><strong>Branch for each stage.</strong> 3 branches for the spinner, then 2 from each for the coin: 3 × 2 = 6 outcomes, all equally likely.</p>`,
        `<p><strong>Read outcomes along the paths.</strong></p>
         ${sum('Pr(G then H) = 1/6<br>Heads and not red: GH, BH → 2/6 = 1/3')}`,
        `<p><strong>The same thing twice?</strong> For a coin tossed twice, one head and one tail "in either order" is HT and TH: 2/4 = 1/2. At least one head = 1 − Pr(TT) = 1 − 1/4 = 3/4.</p>
         ${ans('6, 1/6, 1/3')}`
      )}
      ${tip('"At least one" is quickest as 1 − Pr(none). Type probabilities as fractions, like 1/6.')}`,

    // Y8 8I Q4, Q6: choosing without putting back
    'y8-8i-without': `
      <p class="hp-tag">Worked example: two letters are chosen from <b>STAR</b>, one after the other, without putting the first back.</p>
      ${fig(tree([['S', 'T', 'A', 'R'], (p) => ['S', 'T', 'A', 'R'].filter(x => x !== p[0])], { heads: ['1st', '2nd'], gap: 0.8, unit: 28 }))}
      ${steps(
        `<p><strong>The second branches leave out the letter just chosen.</strong> 4 × 3 = 12 outcomes.</p>`,
        `<p><strong>Two consonants:</strong> S, T and R are consonants, so 3 choices then 2 choices.</p>
         ${sum('3 × 2 = 6 outcomes → 6/12 = 1/2')}`,
        `<p><strong>A is chosen:</strong> A first (3 outcomes) or A second (3 outcomes), so 6/12 = 1/2. <strong>The same letter twice:</strong> impossible, so 0.</p>
         ${ans('12, 1/2, 1/2, 0')}`
      )}
      ${tip('Repeated letters on separate cards (like the two Ts in TOOT) each get their own branch.')}`,

    // Y8 8I Q5: a three-stage game
    'y8-8i-game': `
      <p class="hp-tag">Worked example: spin a wheel ($2 or $5), roll a 4-sided die (1 to 4), then toss a coin. Heads: win the prize × the die. Tails: win nothing.</p>
      ${steps(
        `<p><strong>Count the outcomes:</strong> 2 × 4 × 2 = 16, all equally likely.</p>`,
        `<p><strong>Make a table of winnings for heads.</strong></p>
         ${fig({ kind: 'table', rows: [['×', '1', '2', '3', '4'], ['$2', '$2', '$4', '$6', '$8'], ['$5', '$5', '$10', '$15', '$20']] })}
         ${sum('Win $10: only $5, 2, heads → 1/16')}`,
        `<p><strong>Count every outcome that fits.</strong> $8 or more: $8, $10, $15, $20 with heads, so 4/16 = 1/4. Less than $5: all 8 tails outcomes, plus $2 and $4 with heads, so 10/16 = 5/8.</p>
         ${ans('16, 1/16, 1/4, 5/8')}`
      )}
      ${tip('Tails outcomes win $0, so count them in any "less than" question. Type money answers as a number only, like 15.')}`,

    // Y8 8I Q7, Q8, Q10, Q12: tossing many coins
    'y8-8i-coins': `
      <p class="hp-tag">Worked example: 4 coins are tossed.</p>
      ${steps(
        `<p><strong>Each coin doubles the outcomes.</strong> 1 coin: 2, 2 coins: 4, 3 coins: 8, 4 coins: 16.</p>`,
        `<p><strong>Any one exact sequence has the same chance.</strong> HHHH and HTHH are each 1/16: equally likely.</p>`,
        `<p><strong>"Exactly 2 heads" can happen in several ways.</strong> List them:</p>
         ${chips(['HHTT'], ['HTHT'], ['HTTH'], ['THHT'], ['THTH'], ['TTHH'])}
         ${sum('6/16 = 3/8')}
         ${ans('16, 1/16, 3/8')}`
      )}
      <p><strong>Pascal's triangle counts the ways.</strong> Each number is the sum of the two above it. The row for 4 coins gives the number of ways to get 0, 1, 2, 3 or 4 heads.</p>
      ${fig({ kind: 'table', rows: [['1 coin', '1', '1'], ['2 coins', '1', '2', '1'], ['3 coins', '1', '3', '3', '1'], ['4 coins', '1', '4', '6', '4', '1']] })}
      ${tip('Impossible (5 heads from 4 coins) has probability 0; certain (at most 4 heads) has probability 1.')}`,

    // Y8 8I Q11: counting ordered choices
    'y8-8i-arrange': `
      <p class="hp-tag">Worked example: the 5 letters of <b>PLUMB</b> are on cards.</p>
      ${steps(
        `<p><strong>Order matters: multiply the choices left at each step.</strong> Choosing 2 cards in order:</p>
         ${sum('5 × 4 = 20 outcomes')}`,
        `<p><strong>All 5 cards in order:</strong></p>
         ${sum('5 × 4 × 3 × 2 × 1 = 120')}`,
        `<p><strong>Choosing 4 to keep is the same as choosing 1 to leave out</strong>, so there are 5 equally likely ways. All consonants happens only if U is left out: 1/5. At least one vowel: 1 − 1/5 = 4/5.</p>
         ${ans('20, 120, 1/5, 4/5')}`
      )}
      ${tip('After each card is chosen there is one fewer left, so the numbers you multiply go down by 1 each time.')}`,

    // =====================================================================
    // 8J Venn diagrams and two-way tables
    // =====================================================================
    // Y8 8J Q1, Q2, Q12: Venn diagrams from words; inclusive and exclusive "or"
    'y8-8j-venn': `
      <p class="hp-tag">Worked example: of 40 students, 11 play both soccer and tennis, 14 play only soccer and 9 play only tennis.</p>
      ${fig(venn('Soccer', 'Tennis', '14', '11', '9', '6'))}
      ${steps(
        `<p><strong>Fill from the middle out.</strong> "Both" goes in the overlap. "Only" goes in the part of a circle outside the overlap.</p>`,
        `<p><strong>Neither = total − everyone inside the circles.</strong></p>
         ${sum('40 − 14 − 11 − 9 = 6')}`,
        `<p><strong>Read off what is asked.</strong></p>
         ${sum('Soccer: 14 + 11 = 25<br>Inclusive or (one or both): 14 + 11 + 9 = 34<br>Exclusive or (one but not both): 14 + 9 = 23')}
         ${ans('6; 14, 11, 9, 6; 25, 34, 23')}`
      )}
      ${tip('Type Venn regions in the order asked, with commas: left only, both, right only, outside. Inclusive "or" is never smaller than exclusive "or".')}`,

    // Y8 8J Q3, Q5: Venn diagram and two-way table
    'y8-8j-convert': `
      <p class="hp-tag">Worked example: turn this Venn diagram of 25 people into a two-way table.</p>
      ${fig(venn('Cat', 'Dog', '7', '5', '10', '3'))}
      ${steps(
        `<p><strong>Each region is one inside cell.</strong> Overlap → Cat and Dog: 5. Cat only → Cat, No dog: 7. Dog only → No cat, Dog: 10. Outside → No cat, No dog: 3.</p>`,
        `<p><strong>Add across and down for the totals.</strong></p>
         ${fig({ kind: 'table', rows: [['', 'Dog', 'No dog', 'Total'], ['Cat', '5', '7', '12'], ['No cat', '10', '3', '13'], ['Total', '15', '10', '25']] })}`,
        `<p><strong>"Given" shrinks the total.</strong> A dog owner is chosen: what is the chance they own a cat? Only look in the Dog column.</p>
         ${sum('5/15 = 1/3')}
         ${ans('Total row: 15, 10, 25; 1/3')}`
      )}
      ${tip('The bottom-right corner is everyone. Changing one Venn number changes its cell and the totals in its row and column.')}`,

    // Y8 8J Q4, Q9, Q11: probability from a two-way table
    'y8-8j-table-prob': `
      <p class="hp-tag">Worked example: 50 students were asked if they play an instrument.</p>
      ${fig({ kind: 'table', rows: [['', 'Year 9', 'Year 10', 'Total'], ['Instrument', '12', '8', '20'], ['No instrument', '13', '17', '30'], ['Total', '25', '25', '50']] })}
      ${steps(
        `<p><strong>One cell: cell ÷ grand total.</strong></p>
         ${sum('Pr(Year 10 and instrument) = 8/50 = 4/25')}`,
        `<p><strong>A whole row or column: its total ÷ grand total.</strong></p>
         ${sum('Pr(no instrument) = 30/50 = 3/5')}`,
        `<p><strong>"Given": divide by that row or column's total.</strong> An instrument player is chosen. Pr(Year 9)?</p>
         ${sum('12/20 = 3/5')}
         ${ans('4/25, 3/5, 3/5')}`
      )}
      <p><strong>Starting from words?</strong> Draw the empty table, put in each number you are told, then fill the rest by subtracting from the totals.</p>
      ${tip('Type fractions like 4/25. Always check the bottom: the whole group, or only the "given" group?')}`,

    // Y8 8J Q6, Q7: probability from a Venn diagram
    'y8-8j-venn-prob': `
      <p class="hp-tag">Worked example: people at a café were asked if they like tea and coffee.</p>
      ${fig(venn('Tea', 'Coffee', '13', '7', '15', '5'))}
      ${steps(
        `<p><strong>Find the total,</strong> including the people outside both circles.</p>
         ${sum('13 + 7 + 15 + 5 = 40')}`,
        `<p><strong>Add the regions that fit, then divide by 40.</strong></p>
         ${sum('Pr(tea) = (13 + 7)/40 = 1/2<br>Pr(neither) = 5/40 = 1/8<br>Pr(just one) = (13 + 15)/40 = 7/10')}`,
        `<p><strong>"Tea, given coffee": only look inside the coffee circle.</strong> 7 + 15 = 22 people, and 7 of them like tea.</p>
         ${sum('7/22')}
         ${ans('1/2, 1/8, 7/10, 7/22')}`
      )}
      <p><strong>Mutually exclusive</strong> events cannot both happen: the circles do not overlap, and Pr(A and B) = 0.</p>
      ${tip('Pr(not A) = 1 − Pr(A). Type fractions in simplest form, like 7/10.')}`,

    // Y8 8J Q8, Q10, Q13: completing a two-way table
    'y8-8j-complete': `
      <p class="hp-tag">Worked example: complete the table.</p>
      ${fig({ kind: 'table', rows: [['', 'B', 'Not B', 'Total'], ['A', '18', '?', '30'], ['Not A', '?', '?', '?'], ['Total', '26', '?', '70']] })}
      ${steps(
        `<p><strong>Every row and every column adds to its total.</strong> Look for a line with only one gap.</p>
         ${sum('A, not B: 30 − 18 = 12')}`,
        `<p><strong>Fill the totals.</strong></p>
         ${sum('Not A total: 70 − 30 = 40<br>Not B total: 70 − 26 = 44<br>Not A, B: 26 − 18 = 8')}`,
        `<p><strong>The last cell, then check it the other way.</strong></p>
         ${sum('Not A, not B: 40 − 8 = 32<br>Check: 44 − 12 = 32 ✓')}
         ${ans('12, 8, 32, 40, 44')}`
      )}
      ${tip('Type missing numbers row by row, left to right. If A and B are mutually exclusive, the A-and-B cell is 0.')}`,

    // Y8 8J Q15: Venn diagrams with letters
    'y8-8j-algebra': `
      <p class="hp-tag">Worked example: the regions hold w, x, y and z people.</p>
      ${fig(venn('A', 'B', 'w', 'x', 'y', 'z'))}
      ${steps(
        `<p><strong>The total is every region added:</strong> w + x + y + z.</p>`,
        `<p><strong>Pr = the regions that fit ÷ the total.</strong></p>
         ${sum('Pr(A and B) = x/(w+x+y+z)<br>Pr(B) = (x+y)/(w+x+y+z)<br>Pr(A′) = (y+z)/(w+x+y+z)')}`,
        `<p><strong>No overlap (mutually exclusive)?</strong> There is no middle region, so "A or B" is just the two circles added.</p>
         ${ans('(x+y)/(w+x+y+z)')}`
      )}
      ${tip('Put brackets round a top or bottom that has a + sign: (x+y)/(w+x+y+z). Without them, the marker reads x + y/w + x + ...')}`,

    // =====================================================================
    // 8K Experimental probability
    // =====================================================================
    // Y8 8K Q1, Q2, Q3, Q6: experimental probability from results
    'y8-8k-experimental': `
      <p class="hp-tag">Worked example: a spinner was spun many times and the results recorded.</p>
      ${fig({ kind: 'table', rows: [['Colour', 'Red', 'Blue', 'Green'], ['Frequency', '19', '14', '17']] })}
      ${steps(
        `<p><strong>Number of trials: add the frequencies.</strong></p>
         ${sum('19 + 14 + 17 = 50')}`,
        `<p><strong>Experimental probability = frequency ÷ trials.</strong></p>
         ${sum('Pr(red) = 19/50<br>Pr(blue or green) = (14 + 17)/50 = 31/50')}`,
        `<p><strong>Expected number = probability × number of trials.</strong> In 250 spins:</p>
         ${sum('19/50 × 250 = 95 reds')}
         ${ans('19/50, 31/50, 95')}`
      )}
      ${tip('Starting from a tally or a list? Count each result first. Type probabilities as fractions, like 19/50.')}`,

    // Y8 8K Q4, Q5: expected number
    'y8-8k-expected': `
      <p class="hp-tag">Worked example: a spinner has 5 equal sections, 3 blue and 2 red. It is spun 60 times.</p>
      ${steps(
        `<p><strong>Find the probability.</strong> Pr(blue) = 3/5.</p>`,
        `<p><strong>Expected number = probability × trials.</strong></p>
         ${sum('Blue: 3/5 × 60 = 36<br>Red: 2/5 × 60 = 24')}`,
        `<p><strong>Expected is a best guess, not a promise.</strong> 40 blues could happen. Even 60 blues is possible, just very unlikely.</p>
         ${ans('36, 24')}`
      )}
      ${tip('Possible and likely are different. Any count from 0 up to the number of trials is possible.')}`,

    // Y8 8K Q7, Q8, Q10: running a simulation
    'y8-8k-simulate': `
      <p class="hp-tag">Worked example: a goalie saves 1 in 3 penalties. Simulate 10 penalties with a die.</p>
      ${steps(
        `<p><strong>Pick a device with the same chance.</strong> Rolling 1 or 2 is 2 out of 6 = 1/3, so 1 or 2 means a save.</p>`,
        `<p><strong>Run it and count.</strong> Rolls: 4, ${now('1')}, 6, ${now('2')}, 5, 3, 3, ${now('1')}, 6, 5.</p>
         ${sum('3 saves in 10 → experimental Pr = 3/10')}`,
        `<p><strong>Compare with the real chance.</strong> In 30 penalties, 1/3 × 30 = 10 saves are expected.</p>
         ${ans('3/10, 10')}`
      )}
      <p><strong>Several tries per turn?</strong> Read each run in order and stop where the rules say stop, such as after the first hit. Each turn is one trial.</p>
      ${tip('Experimental probability = successes ÷ trials. Type it as a fraction, like 3/10.')}`,

    // Y8 8K Q11, Q12: choosing a device to simulate a probability
    'y8-8k-design': `
      <p class="hp-tag">Worked example: which devices can simulate these probabilities?</p>
      ${steps(
        `<p><strong>A die has 6 equal outcomes,</strong> so it can copy a spinner when every section is a whole number of sixths.</p>
         ${sum('Sections 1/2, 1/3, 1/6 → rolls 1-3, 4-5, 6 ✓<br>A section of 1/4 → 6 does not split into quarters ✗')}`,
        `<p><strong>Count the combined outcomes.</strong> Two coins: 4. A coin and a die: 12. Two dice: 36.</p>`,
        `<p><strong>Write the probability over that total, then find an event with that many outcomes.</strong> 1/9 with two dice is 4/36: "the dice add to 5" works, with (1, 4), (2, 3), (3, 2), (4, 1).</p>
         ${ans('Yes, No, add to 5')}`
      )}
      ${tip('A spinner can be copied by a die only if its sections can be made from sixths, even when the sections are different sizes.')}`,

    // Y8 8K Q9: estimating what is in a bag
    'y8-8k-estimate': `
      <p class="hp-tag">Worked example: a marble is drawn and put back 50 times: red 20, white 30.</p>
      ${steps(
        `<p><strong>Experimental probability:</strong> Pr(red) = 20/50 = 2/5, and red : white = 2 : 3.</p>`,
        `<p><strong>If there are 15 marbles:</strong></p>
         ${sum('red ≈ 2/5 × 15 = 6')}`,
        `<p><strong>Working backwards with the ratio.</strong> If there are 12 white, that is 3 parts, so 1 part is 4 and the total is 5 parts = 20. If there are 8 red, that is 2 parts, so 1 part is 4 and there are 12 white.</p>
         ${ans('6, 20, 12')}`
      )}
      ${tip('The answer is a best estimate, so it should be a whole number of marbles.')}`,

    // Y8 8K Q13: experimental against theoretical probability
    'y8-8k-compare': `
      <p class="hp-tag">Worked example: 3 coins were tossed 16 times and the heads counted.</p>
      ${fig({ kind: 'table', rows: [['Number of heads', '0', '1', '2', '3'], ['Frequency', '0', '7', '6', '3']] })}
      ${steps(
        `<p><strong>Experimental:</strong> Pr(3 heads) = 3/16.</p>`,
        `<p><strong>Theoretical:</strong> 3 coins have 8 outcomes, and only HHH has 3 heads, so Pr(3 heads) = 1/8.</p>`,
        `<p><strong>Experimental 0 is not the same as impossible.</strong> No one saw 0 heads, but TTT has a theoretical probability of 1/8. A theoretical 0, like 4 heads from 3 coins, can never turn up in any experiment.</p>
         ${ans('3/16, 1/8')}`
      )}
      ${tip('Turn tails into heads: with 3 coins, "2 tails" means 1 head.')}`,

    // Y8 8K Q14: area and darts
    'y8-8k-area': `
      <p class="hp-tag">Worked example: darts hit a 24 cm by 10 cm board at random. A red square of side 4 cm is inside.</p>
      ${fig({ kind: 'diagram', unit: 12, items: [{ poly: [[0, 0], [24, 0], [24, 10], [0, 10]] }, { poly: [[15, 3], [19, 3], [19, 7], [15, 7]], fill: true }, { label: 'Red', at: [17, 5] }, { label: 'Blue', at: [6, 5] }, { dim: [19, 3, 19, 7], label: '4 cm', off: -0.8 }, { dim: [0, 0, 24, 0], label: '24 cm', off: -0.8 }, { dim: [24, 0, 24, 10], label: '10 cm', off: -1.2 }] })}
      ${steps(
        `<p><strong>Find the areas.</strong></p>
         ${sum('Red: 4 × 4 = 16 cm²<br>Board: 24 × 10 = 240 cm²')}`,
        `<p><strong>Pr(red) = red area ÷ total area.</strong></p>
         ${sum('16/240 = 1/15<br>60 darts: 1/15 × 60 = 4 red, so 56 blue')}`,
        `<p><strong>Backwards:</strong> 180 of 450 darts land on an island drawn on a 35 cm by 20 cm map. With a scale of 1 : 200 000, 1 cm is 2 km, so 1 cm² is 4 km².</p>
         ${sum('Island ≈ 180/450 × 700 = 280 cm²<br>Real area ≈ 280 × 4 = 1120 km²')}
         ${ans('1/15, 4, 280 cm², 1120 km²')}`
      )}
      ${tip('A triangle\'s area is ½ × base × height. For areas, square the length scale: 1 cm to 2 km means 1 cm² to 4 km².')}`
  });
})();
