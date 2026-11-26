/* H3 help panels for Year 10 Chapter 9. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 9A to 9J. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- local drawing helpers (specs for figures.js) ----
  // A graph on a grid: o.x and o.y are [from, to, step]; o.w and o.h are the drawing size in units.
  // pts = dots, lines = joined lines (2 or more points), dash = dashed reading lines,
  // bars = [[label, value], ...] for a column graph whose axis may not start at zero, names = [[text, x, y]].
  const plot = (o) => {
    const [x0, x1, xs] = o.x, [y0, y1, ys] = o.y, w = o.w || 7, h = o.h || 5;
    const X = (v) => +((v - x0) / (x1 - x0) * w).toFixed(4), Y = (v) => +((v - y0) / (y1 - y0) * h).toFixed(4);
    const items = [], r = (v) => +v.toFixed(6);
    if (!o.bars) for (let v = x0 + xs; v <= x1 + 1e-9; v += xs) items.push({ seg: [X(v), 0, X(v), h], thin: true, dash: true });
    for (let v = y0 + ys; v <= y1 + 1e-9; v += ys) items.push({ seg: [0, Y(v), w, Y(v)], thin: true, dash: true });
    items.push({ seg: [0, 0, w + 0.5, 0], arrow: 'end' }, { seg: [0, 0, 0, h + 0.5], arrow: 'end' });
    const origin = !o.bars && x0 === 0 && y0 === 0;
    if (!o.bars) for (let v = x0; v <= x1 + 1e-9; v += xs) if (!(origin && v === x0)) items.push({ label: String(r(v)), at: [X(v), -0.42] });
    for (let v = y0; v <= y1 + 1e-9; v += ys) if (!(origin && v === y0)) items.push({ label: String(r(v)), at: [-0.18, Y(v) - 0.02], anchor: 'end' });
    if (origin) items.push({ label: 'O', at: [-0.18, -0.42], anchor: 'end' });
    if (o.bars) {
      const bw = w / o.bars.length;
      o.bars.forEach(([lab, v], i) => {
        items.push({ poly: [[i * bw + 0.25 * bw, 0], [i * bw + 0.75 * bw, 0], [i * bw + 0.75 * bw, Y(v)], [i * bw + 0.25 * bw, Y(v)]], fill: true });
        items.push({ label: lab, at: [i * bw + 0.5 * bw, -0.42] });
      });
    }
    if (o.xlabel) items.push({ label: o.xlabel, at: [w / 2, -1.05] });
    if (o.ylabel) items.push({ label: o.ylabel, at: [-0.2, h + 0.85], anchor: 'start' });
    (o.lines || []).forEach(L => items.push(L.length === 2 ? { seg: [X(L[0][0]), Y(L[0][1]), X(L[1][0]), Y(L[1][1])] } : { poly: L.map(([a, b]) => [X(a), Y(b)]), open: true }));
    (o.dash || []).forEach(L => items.push({ seg: [X(L[0][0]), Y(L[0][1]), X(L[1][0]), Y(L[1][1])], dash: true }));
    (o.pts || []).forEach(([a, b]) => items.push({ point: [X(a), Y(b)] }));
    (o.names || []).forEach(([t, a, b]) => items.push({ label: t, at: [X(a), Y(b)], anchor: 'start' }));
    return fig({ kind: 'diagram', unit: o.unit || 36, items });
  };

  // Box plot outliers as dots, the way the book draws them (figures.js draws them as crosses).
  const dotOut = (html) => html.replace(/<path class="fg-axis" d="M([\d.]+),([\d.]+) L[^"]*"\/>/g,
    (m, x, y) => `<circle class="fg-pt" cx="${+x + 5}" cy="${+y + 5}" r="4.5"/>`);

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 9A Collecting representative data
    // =====================================================================
    // method: Example 1, 9A (describing types of data)
    // y10-9A Q1, Q2: categorical or numerical, then which kind
    'y10-9a-data-type': `
      <p class="hp-tag">Worked example: what type of data would each survey question generate?</p>
      ${flow(['Is the answer a number?', 'No: categorical. Yes: numerical.'], ['Categorical', 'Order? ordinal. No order? nominal.'], ['Numerical', 'Counted? discrete. Measured? continuous.'])}
      ${steps(
        `<p><strong>First decide: is the answer a word (a category) or a number?</strong></p>
         ${sum('How many goals did each team score? → a number<br>What is your favourite ice-cream flavour? → a word')}`,
        `<p><strong>Numbers: counted or measured?</strong> A count can only take whole-number values, so it is <b>discrete</b>. A measurement (time, length, mass) can take any value in a range, so it is <b>continuous</b>.</p>
         ${sum('Goals scored: numerical discrete<br>Mass of each pumpkin: numerical continuous')}`,
        `<p><strong>Words: do the categories have a natural order?</strong> Flavours have no order, so they are <b>nominal</b>. Shirt sizes (small, medium, large) can be put in order, so they are <b>ordinal</b>.</p>
         ${ans('Numerical discrete')}`
      )}
      ${tip('Ratings like poor, okay, good are words with an order: categorical ordinal. A list of options like Optus / Telstra / Other has no order: categorical nominal.')}`,

    // method: Example 2, 9A (choosing a survey sample)
    // y10-9A Q3, Q5, Q6, Q8: is the sample representative?
    'y10-9a-sample': `
      <p class="hp-tag">Worked example: a survey at a skate park asks people how Australians spend their weekends. Is the sample representative?</p>
      ${steps(
        `<p><strong>Ask: who does this sample include?</strong> Only people who are at a skate park, so mostly young people who skate.</p>`,
        `<p><strong>Ask: who does it leave out?</strong> People who never skate, older people, and people who spend weekends working, shopping or at sport. Their answers are missing, so the results lean towards skating.</p>
         ${ans('No')}`,
        `<p><strong>What makes a good sample?</strong> It is chosen at random from the whole population and is big enough. Census data (everyone) is representative. A large number of random phone calls across Australia is too.</p>`
      )}
      <p><strong>Choosing a sample:</strong> to survey a school's Year 8s, a small share of students from <b>every</b> Year 8 class beats one class, one sport team or the first students to arrive, because every kind of student gets a chance to be picked.</p>
      <p><strong>Checking a conclusion:</strong> "3 of the 4 cafes we visited had fewer customers this year, so only 1 in 4 cafes is busy." Fewer customers does not mean no customers, and 4 cafes is far too few to say anything about all cafes.</p>
      ${tip('Look for the place or method of the survey. Online, at a shop, at a station or on weekday afternoons: work out who is missing from it.')}`,

    // method: no worked example in the book; plainest method (read the vertical axis scale)
    // y10-9A Q9: misleading graphs
    'y10-9a-graphs': `
      <p class="hp-tag">Worked example: two graphs of the same votes for three class captains.</p>
      ${plot({ x: [0, 3, 1], y: [45, 53, 1], w: 5, h: 4, ylabel: 'Votes', bars: [['Ana', 52], ['Ben', 48], ['Cy', 50]] })}
      ${fig({ kind: 'columns', cats: ['Ana', 'Ben', 'Cy'], values: [52, 48, 50], ymax: 60, step: 10, ylabel: 'Votes' })}
      ${steps(
        `<p><strong>Read the vertical axis first.</strong> The top graph starts at 45, the bottom graph starts at 0.</p>`,
        `<p><strong>Compare the real numbers, not the bar heights.</strong> Ana 52, Ben 48, Cy 50: very close. In the top graph Ana's bar looks more than twice as tall as Ben's, because the bottom of every bar has been cut off.</p>`,
        `<p><strong>Match the title to the graph.</strong> "Ana wins by a mile" fits the top graph. "A close race" fits the bottom one. The top graph is the misleading one.</p>
         ${ans('The vertical axis does not start at zero')}`
      )}
      ${tip('A broken or raised vertical axis makes small differences look huge. Always check where the axis starts.')}`,

    // method: no worked example in the book; plainest method (read what the statistic measures)
    // y10-9A Q13: meaning of a statistical statement
    'y10-9a-meaning': `
      <p class="hp-tag">Worked example: "Australia is becoming more urban." What does this mean?</p>
      ${steps(
        `<p><strong>Find the statistic behind the words.</strong> "Urban" is about living in cities and towns, so the statistic is the percentage of people living in urban areas.</p>`,
        `<p><strong>"Becoming" means a trend over time.</strong> The statement says this percentage is going up from year to year.</p>
         ${ans('The percentage of people living in cities is increasing over time')}`
      )}
      ${tip('Words like "becoming", "growing" or "ageing" describe a change over time, so pick the answer that talks about a value increasing or decreasing over the years.')}`,

    // =====================================================================
    // Year 10 9B Review of data displays
    // =====================================================================
    // method: Example 3, 9B (frequency table with class intervals, percentage frequency, shape)
    // y10-9B Q1, Q2, Q8, Q14: frequency and percentage frequency tables
    'y10-9b-freq': `
      <p class="hp-tag">Worked example: put these 20 values into the classes 0-, 10-, 20- and 30-.<br><b>12, 3, 24, 15, 8, 33, 11, 5, 18, 21, 9, 14, 1, 27, 10, 7, 35, 19, 22, 16</b></p>
      ${steps(
        `<p><strong>Tally each value into its class.</strong> The class 10- holds 10 up to (but not including) 20.</p>
         ${sum('0-: 3, 8, 5, 9, 1, 7 → 6<br>10-: 12, 15, 11, 18, 14, 10, 19, 16 → 8<br>20-: 24, 21, 27, 22 → 4<br>30-: 33, 35 → 2')}`,
        `<p><strong>Percentage frequency = frequency ÷ total × 100.</strong></p>
         ${sum('8 ÷ 20 × 100 = 40')}
         ${fig({ kind: 'table', rows: [['Class interval', '0-', '10-', '20-', '30-39'], ['Frequency', '6', '8', '4', '2'], ['Percentage frequency', '30', '40', '20', '10']] })}`,
        `<p><strong>Shape:</strong> the tallest classes are on the left and the data tail off to the right, so a histogram would be positively skewed.</p>
         ${ans('6, 8, 4, 2')}`
      )}
      <p><strong>Other kinds of class:</strong> a class written 3-5 holds 3, 4 and 5. A class 2.5- holds 2.5 up to 2.9, so 2.5 goes in it but 3.0 goes in the next one. Two separate peaks make the data <b>bimodal</b>.</p>
      ${tip('Check the frequencies add to the total and the percentages add to 100. Type the values in order with commas, including any zeros, like 6, 8, 4, 2.')}`,

    // method: Example 3, 9B (percentage frequency = frequency ÷ total × 100)
    // y10-9B Q3: percentages from a categorical frequency table
    'y10-9b-category': `
      <p class="hp-tag">Worked example: 60 students chose their favourite lunch.</p>
      ${fig({ kind: 'table', rows: [['Lunch', 'Frequency', 'Percentage frequency'], ['Sandwich', '21', '35'], ['Sushi', '9', '15'], ['Pie', '12', '20'], ['Salad', '6', '10'], ['Pasta', '12', '20'], ['Total', '60', '100']] })}
      ${steps(
        `<p><strong>Divide each frequency by the total, then multiply by 100.</strong></p>
         ${sum('Sandwich: 21 ÷ 60 × 100 = 35<br>Sushi: 9 ÷ 60 × 100 = 15')}`,
        `<p><strong>The most popular choice</strong> has the biggest frequency: sandwich.</p>`,
        `<p><strong>Two categories together: add their percentages.</strong></p>
         ${sum('Pie or pasta: 20 + 20 = 40%')}
         ${ans('35, 15, 20, 10, 20')}`
      )}
      ${tip('Type a percentage as a number only, like 35. The percentage column should total 100.')}`,

    // method: Key ideas, 9B (symmetrical, positively skewed, negatively skewed) and Example 3c
    // y10-9B Q4: describing the shape of a display
    'y10-9b-shape': `
      <p class="hp-tag">Worked example: describe the shape of each display.</p>
      ${fig({ kind: 'columns', cats: [' ', ' ', ' ', ' ', ' '], values: [1, 4, 6, 4, 1], ymax: 6, step: 2, caption: 'P' }, { kind: 'columns', cats: [' ', ' ', ' ', ' ', ' '], values: [6, 5, 3, 2, 1], ymax: 6, step: 2, caption: 'Q' }, { kind: 'columns', cats: [' ', ' ', ' ', ' ', ' '], values: [1, 1, 2, 5, 6], ymax: 6, step: 2, caption: 'R' })}
      ${steps(
        `<p><strong>Find the peak, then look for the tail.</strong> The tail is the long, low side.</p>`,
        `<p><strong>Name the shape from the tail.</strong></p>
         ${sum('P: matching sides → symmetrical<br>Q: tail to the right (the big values) → positively skewed<br>R: tail to the left (the small values) → negatively skewed')}
         ${ans('Positively skewed')}`
      )}
      <p><strong>Dot plots and stem-and-leaf plots:</strong> the same rule works. On a stem-and-leaf plot, turn your head: the stems are the scale, and long rows are the tall columns.</p>
      ${tip('The tail points to the skew: a tail pointing to the high values is positive skew, pointing to the low values is negative skew.')}`,

    // method: Example 4, 9B (stem-and-leaf plot, then mode, median and mean)
    // y10-9B Q5, Q6: stem-and-leaf plots and measures of centre
    'y10-9b-stemleaf': `
      <p class="hp-tag">Worked example: 12 test scores: <b>42, 30, 49, 36, 28, 44, 52, 37, 42, 34, 45, 40</b></p>
      ${steps(
        `<p><strong>Tens are the stems, units are the leaves.</strong> Put the leaves in order and add a key.</p>
         ${fig({ kind: 'stemleaf', rows: [['2', '8'], ['3', '0 4 6 7'], ['4', '0 2 2 4 5 9'], ['5', '2']], key: '4 | 2 means 42' })}`,
        `<p><strong>Mode and median.</strong> 42 appears twice. With 12 values, the median is halfway between the 6th and 7th leaves.</p>
         ${sum('Mode = 42<br>Median = (40 + 42) ÷ 2 = 41')}`,
        `<p><strong>Mean: add every value and divide by how many.</strong></p>
         ${sum('Mean = (28 + 30 + 34 + ... + 52) ÷ 12<br>= 479 ÷ 12 = 39.9 (1 d.p.)')}
         ${ans('42, 41, 39.9')}`
      )}
      ${tip('Count the leaves first so you know where the middle is. Round the mean only at the end, to the places asked for.')}`,

    // method: no worked example in the book; plainest method (totals, counts, then compare)
    // y10-9B Q7: comparing two players from a table
    'y10-9b-compare': `
      <p class="hp-tag">Worked example: three-point shots by two basketballers over 8 games.</p>
      ${fig({ kind: 'table', rows: [['Game', '1', '2', '3', '4', '5', '6', '7', '8'], ['Ava', '2', '1', '2', '2', '1', '2', '1', '2'], ['Bec', '0', '5', '0', '0', '4', '0', '6', '0']] })}
      ${steps(
        `<p><strong>Totals: add each row.</strong></p>
         ${sum('Ava: 2 + 1 + 2 + 2 + 1 + 2 + 1 + 2 = 13<br>Bec: 5 + 4 + 6 = 15')}`,
        `<p><strong>Count the zeros.</strong> Bec scored none in games 1, 3, 4, 6 and 8: that is 5 games.</p>`,
        `<p><strong>Describe the pattern.</strong> Ava scores 1 or 2 every game: steady. Bec often scores none but sometimes scores a lot: streaky.</p>
         ${ans('13, 15, 5')}`
      )}
      ${tip('Totals tell you who scored more; the pattern of zeros and big games tells you who is more consistent.')}`,

    // method: Example 3, 9B (frequency table, percentage frequency = frequency ÷ total × 100)
    // y10-9B Q9, Q10: tallies, percentages, and percentages after a change
    'y10-9b-tally': `
      <p class="hp-tag">Worked example: a sports club's members. Each group ||||| stands for 5.</p>
      ${fig({ kind: 'table', rows: [['Sport', 'Tally', 'Frequency'], ['Tennis', '||||| ||||| ||||', '14'], ['Golf', '||||| |||||', '10'], ['Bowls', '||||| ||||', '9'], ['Croquet', '||||| ||', '7']] })}
      ${steps(
        `<p><strong>Count the tallies: 5 for each group, then the single strokes.</strong> Add them for the total.</p>
         ${sum('14 + 10 + 9 + 7 = 40 members')}`,
        `<p><strong>Percentage = frequency ÷ total × 100.</strong></p>
         ${sum('Tennis: 14 ÷ 40 × 100 = 35<br>Not tennis: 100 − 35 = 65')}`,
        `<p><strong>If the numbers change, find the new total first.</strong></p>
         ${sum('5 more join tennis: total 45<br>Golf: 10 ÷ 45 × 100 = 22.2 (1 d.p.)<br>All of bowls away: 40 − 9 = 31 present<br>Tennis: 14 ÷ 31 × 100 = 45.2 (1 d.p.)')}
         ${ans('35, 65, 22.2, 45.2')}`
      )}
      <p><strong>Several classes at once:</strong> add their frequencies first, then make one percentage.</p>
      ${tip('Type a percentage as a number, rounded only at the end, like 22.2.')}`,

    // method: Example 3, 9B (histogram with frequency and percentage frequency)
    // y10-9B Q11: percentage from a histogram
    'y10-9b-histogram': `
      <p class="hp-tag">Worked example: what percentage of these scores are in the 70 to 80 range?</p>
      ${fig({ kind: 'columns', histogram: true, cats: ['', '', '', ''], values: [2, 5, 9, 4], edges: ['50', '60', '70', '80', '90'], ymax: 10, step: 2, ylabel: 'Frequency', xlabel: 'Score' })}
      ${steps(
        `<p><strong>Read each column's height and add them for the total.</strong></p>
         ${sum('2 + 5 + 9 + 4 = 20')}`,
        `<p><strong>Find the column for the range.</strong> The column from 70 to 80 has height 9.</p>`,
        `<p><strong>Percentage = frequency ÷ total × 100.</strong></p>
         ${sum('9 ÷ 20 × 100 = 45')}
         ${ans('45')}`
      )}
      ${tip('The class edges sit under the joins between columns. Type the percentage as a number only.')}`,

    // method: no worked example in the book; plainest method (leaves in an ordered row never go down)
    // y10-9B Q13: missing digits in an ordered stem-and-leaf plot
    'y10-9b-digits': `
      <p class="hp-tag">Worked example: this plot is ordered. Find every possible value of k, m and n.</p>
      ${fig({ kind: 'stemleaf', rows: [['4', '1 3 k 7'], ['5', 'm 2 6'], ['6', '0 5 n']], key: '5 | 2 means 52' })}
      ${steps(
        `<p><strong>In an ordered row, each leaf is at least as big as the one before and no bigger than the one after.</strong></p>`,
        `<p><strong>Squeeze each letter between its neighbours.</strong></p>
         ${sum('k is between 3 and 7 → 3, 4, 5, 6, 7<br>m is first, before 2 → 0, 1, 2<br>n is last, after 5 → 5, 6, 7, 8, 9')}
         ${ans('3, 4, 5, 6, 7')}`
      )}
      ${tip('A leaf is one digit, 0 to 9. Equal leaves are allowed, so include the neighbours themselves. Type every value with commas.')}`,

    // =====================================================================
    // Year 10 9C Two-way tables
    // =====================================================================
    // method: Example 5, 9C (interpreting a two-way table)
    // y10-9C Q1, Q2: reading a Likert two-way table
    'y10-9c-read': `
      <p class="hp-tag">Worked example: 40 people were asked how strongly they agree with a 4-day school week.</p>
      ${fig({ kind: 'table', rows: [['Response', 'Under 30', '30 and over', 'Total'], ['Strongly agree', '6', '1', '7'], ['Agree', '8', '3', '11'], ['Neutral', '3', '5', '8'], ['Disagree', '2', '6', '8'], ['Strongly disagree', '1', '5', '6'], ['Total', '20', '20', '40']] })}
      ${steps(
        `<p><strong>"How many" questions: read the matching cell or total.</strong></p>
         ${sum('Under 30: 20 (column total)<br>Neutral: 8 (row total)<br>30 and over and Disagree: 6 (one cell)')}`,
        `<p><strong>"What percentage" questions: divide by the overall total and multiply by 100.</strong></p>
         ${sum('Neutral: 8 ÷ 40 × 100 = 20%<br>Under 30 and Agree: 8 ÷ 40 × 100 = 20%<br>30 and over and Strongly disagree: 5 ÷ 40 × 100 = 12.5%')}`,
        `<p><strong>Testing a claim: compare the two groups.</strong> 14 of the 20 under-30s agree or strongly agree, but only 4 of the 20 older people do.</p>
         ${ans('Yes: younger people are more in favour')}`
      )}
      ${tip('Type percentages as numbers, like 12.5. For a claim, compare the agree columns of the two groups, not single cells.')}`,

    // method: Example 6, 9C (constructing a two-way table)
    // y10-9C Q3, Q4, Q8: building a two-way table from words
    'y10-9c-build': `
      <p class="hp-tag">Worked example: 16 of the 24 people living in a house have a pet, and 4 of the 16 people living in a unit have a pet.</p>
      ${steps(
        `<p><strong>Draw the table and fill in the numbers you are given.</strong> One variable for the rows, one for the columns.</p>
         ${fig({ kind: 'table', rows: [['', 'Pet', 'No pet', 'Total'], ['House', '16', '?', '24'], ['Unit', '4', '?', '16'], ['Total', '?', '?', '?']] })}`,
        `<p><strong>Work out the gaps from the row and column totals.</strong></p>
         ${sum('House, no pet: 24 − 16 = 8<br>Unit, no pet: 16 − 4 = 12<br>Totals: 16 + 4 = 20, 8 + 12 = 20, 24 + 16 = 40')}`,
        `<p><strong>Fractions: cell or total over the overall total, then simplify.</strong></p>
         ${sum('Unit: 16/40 = 2/5<br>Unit and no pet: 12/40 = 3/10')}
         ${ans('2/5')}`
      )}
      <p><strong>Testing a claim:</strong> house owners: 16 out of 24 have a pet; unit dwellers: only 4 out of 16. So people in houses are more likely to have a pet.</p>
      ${tip('Type fractions in simplest form, like 3/10. If you are given a row total and a column total, fill those in first and the other cells follow.')}`,

    // method: Example 6c, 9C (compare proportions within each group), with Example 5b percentages
    // y10-9C Q5, Q7: percentages of the whole, and fractions of one group
    'y10-9c-within': `
      <p class="hp-tag">Worked example: favourite drinks of some Year 7 and Year 8 students.</p>
      ${fig({ kind: 'table', rows: [['Drink', 'Year 7', 'Year 8', 'Total'], ['Water', '8', '6', '14'], ['Juice', '5', '4', '9'], ['Milk', '4', '10', '14'], ['Soft drink', '3', '4', '7'], ['Total', '20', '24', '44']] })}
      ${steps(
        `<p><strong>"Of the people surveyed": divide by the overall total.</strong></p>
         ${sum('Year 7: 20 ÷ 44 × 100 = 45.5% (1 d.p.)<br>Year 8 who chose milk: 10 ÷ 44 × 100 = 22.7%')}`,
        `<p><strong>"Of the people who chose milk": that row total is the bottom of the fraction.</strong></p>
         ${sum('Milk drinkers who are Year 8: 10/14 = 5/7')}`,
        `<p><strong>"Of the Year 7s": that column total is the bottom.</strong></p>
         ${sum('Year 7s who chose water: 8 ÷ 20 × 100 = 40%')}
         ${ans('45.5, 22.7, 5/7, 40')}`
      )}
      ${tip('Read the words after "of the": they tell you which total to divide by. Round percentages to one decimal place at the end.')}`,

    // method: Example 6a, 9C (find missing values by working with the row and column totals)
    // y10-9C Q6: missing values in a two-way table
    'y10-9c-missing': `
      <p class="hp-tag">Worked example: find a, b, c, d and e.</p>
      ${fig({ kind: 'table', rows: [['', 'Microchipped', 'Not microchipped', 'Total'], ['Dogs', '11', 'a', '14'], ['Cats', '7', '5', 'b'], ['Total', 'c', 'd', 'e']] })}
      ${steps(
        `<p><strong>Find a row or column with only one gap.</strong></p>
         ${sum('a = 14 − 11 = 3<br>b = 7 + 5 = 12')}`,
        `<p><strong>Column totals next.</strong></p>
         ${sum('c = 11 + 7 = 18<br>d = 3 + 5 = 8')}`,
        `<p><strong>The overall total two ways, as a check.</strong></p>
         ${sum('e = 14 + 12 = 26<br>Check: 18 + 8 = 26 ✓')}
         ${ans('3, 12, 18, 8, 26')}`
      )}
      ${tip('Each row adds across to its total and each column adds down to its total. Always check the corner total both ways.')}`,

    // method: Key ideas, 9A and 9C (a 5-point scale gives a neutral option)
    // y10-9C Q9: why a Likert scale has an odd number of options
    'y10-9c-likert': `
      <p class="hp-tag">Worked example: compare a 5-point scale with a 4-point scale.</p>
      ${chips(['Strongly agree'], ['Agree'], ['Neutral', 'add'], ['Disagree'], ['Strongly disagree'])}
      ${chips(['Strongly agree'], ['Agree'], ['Disagree'], ['Strongly disagree'])}
      ${steps(
        `<p><strong>Look at the middle.</strong> With 5 options, the middle one is Neutral. With 4 options there is no middle.</p>`,
        `<p><strong>Think about someone with no strong view.</strong> On the 4-point scale they are forced to pick a side, which can make the results misleading.</p>
         ${ans('So there is a neutral middle option')}`
      )}
      ${tip('An odd number of options always has a middle choice.')}`,

    // method: Example 6c, 9C (compare the proportions in each group)
    // y10-9C Q10, Q12: is there a connection? Compare proportions
    'y10-9c-compare': `
      <p class="hp-tag">Worked example: do adults or teenagers read more ebooks?</p>
      ${fig({ kind: 'table', rows: [['', 'Reads ebooks', 'Does not', 'Total'], ['Adult', '10', '20', '30'], ['Teenager', '6', '12', '18'], ['Total', '16', '32', '48']] })}
      ${steps(
        `<p><strong>Find the fraction of each group, using that group's total.</strong></p>
         ${sum('Adults: 10/30 = 1/3<br>Teenagers: 6/18 = 1/3')}`,
        `<p><strong>Compare.</strong> The fractions are the same, so being an adult or a teenager makes no difference here. There is no evidence of a connection.</p>
         ${ans('1/3, 1/3')}`,
        `<p><strong>Proportions far apart mean a connection.</strong> If 14 of 20 in one row and 4 of 20 in the other did something, that is 70% against 20%: reject "no connection".</p>`
      )}
      ${tip('Use the row total for each row, never the overall total, when you compare groups. Type fractions in simplest form, like 1/3.')}`,

    // =====================================================================
    // Year 10 9D Summary statistics
    // =====================================================================
    // method: Example 7, 9D (range and IQR from the five-figure summary)
    // y10-9D Q1: range and IQR
    'y10-9d-iqr': `
      <p class="hp-tag">Worked example: find the range and the IQR of <b>4, 5, 6, 8, 10, 13, 16</b>, then of <b>21, 23, 26, 27, 30, 32, 35, 39</b>.</p>
      ${steps(
        `<p><strong>Odd number of values: the median is the middle one, and it is left out of both halves.</strong></p>
         ${sum('4, 5, 6, ' + now('8') + ', 10, 13, 16<br>Lower half 4, ' + now('5') + ', 6 → Q1 = 5<br>Upper half 10, ' + now('13') + ', 16 → Q3 = 13')}`,
        `<p><strong>Range = max − min. IQR = Q3 − Q1.</strong></p>
         ${sum('Range = 16 − 4 = 12<br>IQR = 13 − 5 = 8')}
         ${ans('12, 8')}`,
        `<p><strong>Even number of values: split into two halves of 4.</strong> Each quartile is the average of its half's two middle values.</p>
         ${sum('21, 23, 26, 27 | 30, 32, 35, 39<br>Q2 = (27 + 30) ÷ 2 = 28.5<br>Q1 = (23 + 26) ÷ 2 = 24.5, Q3 = (32 + 35) ÷ 2 = 33.5<br>IQR = 33.5 − 24.5 = 9, range = 39 − 21 = 18')}`
      )}
      ${tip('Always sort the data first. Decimal data work the same way: the median of 1.2, 1.5, 1.9, 2.4 is (1.5 + 1.9) ÷ 2 = 1.7.')}`,

    // method: Example 8, 9D (five-figure summary and outliers using the fences)
    // y10-9D Q2, Q3, Q5, Q6: five-figure summary, fences and outliers
    'y10-9d-outliers': `
      <p class="hp-tag">Worked example: <b>9, 14, 11, 3, 12, 15, 10, 13, 12, 26, 11, 14, 13</b></p>
      ${steps(
        `<p><strong>Sort, then find the min, max and median.</strong> 13 values, so the median is the 7th and it is left out of both halves.</p>
         ${sum('3, 9, 10, 11, 11, 12, ' + now('12') + ', 13, 13, 14, 14, 15, 26<br>Min = 3, max = 26, median = 12')}`,
        `<p><strong>Quartiles and IQR.</strong></p>
         ${sum('Q1 = (10 + 11) ÷ 2 = 10.5<br>Q3 = (14 + 14) ÷ 2 = 14<br>IQR = 14 − 10.5 = 3.5')}`,
        `<p><strong>Fences: anything outside them is an outlier.</strong></p>
         ${sum('Lower fence = Q1 − 1.5 × IQR = 10.5 − 1.5 × 3.5 = 5.25<br>Upper fence = Q3 + 1.5 × IQR = 14 + 1.5 × 3.5 = 19.25<br>3 < 5.25 and 26 > 19.25')}
         ${ans('3, 26')}`
      )}
      <p><strong>With an outlier, which centre is better?</strong> The median, because one extreme value drags the mean but hardly moves the median. A reason for an outlier is something unusual that day, like rain or a holiday.</p>
      ${tip('Type outliers with commas, like 3, 26. If none are outside the fences, type none.')}`,

    // method: Key ideas, 9D (an outlier significantly affects the mean but not the median)
    // y10-9D Q4: how an outlier changes the mean and median
    'y10-9d-effect': `
      <p class="hp-tag">Worked example: <b>4, 5, 5, 7, 9, 24</b>. The value 24 is an outlier.</p>
      ${steps(
        `<p><strong>Mean and median with the outlier.</strong></p>
         ${sum('Mean = 54 ÷ 6 = 9<br>Median = (5 + 7) ÷ 2 = 6')}`,
        `<p><strong>Mean and median without it.</strong></p>
         ${sum('Mean = 30 ÷ 5 = 6<br>Median = 5 (the middle of 4, 5, 5, 7, 9)')}`,
        `<p><strong>The difference each one makes.</strong></p>
         ${sum('Mean: 9 − 6 = 3<br>Median: 6 − 5 = 1')}
         ${ans('3, 1')}`
      )}
      ${tip('Take the outlier out and recount how many values there are before you divide.')}`,

    // method: Example 7, 9D (quartiles from ordered data); a stem-and-leaf plot is already ordered
    // y10-9D Q7: IQR from a stem-and-leaf plot, and adding a value
    'y10-9d-stemleaf': `
      <p class="hp-tag">Worked example: use this stem-and-leaf plot.</p>
      ${fig({ kind: 'stemleaf', rows: [['1', '2 6'], ['2', '0 3 7 9'], ['3', '1 4 8'], ['4', '5']], key: '2 | 3 means 23' })}
      ${steps(
        `<p><strong>The plot is already in order.</strong> 10 values: 12, 16, 20, 23, 27 | 29, 31, 34, 38, 45.</p>
         ${sum('Q1 = 20, Q3 = 34, IQR = 34 − 20 = 14')}`,
        `<p><strong>Outliers: check the fences.</strong></p>
         ${sum('20 − 1.5 × 14 = −1, &nbsp; 34 + 1.5 × 14 = 55<br>Every value is between them → none')}`,
        `<p><strong>Adding a value makes 11 values, so the median becomes the 6th.</strong></p>
         ${sum('Add 50: 12, 16, 20, 23, 27, ' + now('29') + ', ... → 29<br>Add 24: 12, 16, 20, 23, 24, ' + now('27') + ', ... → 27')}
         ${ans('14, none, 29, 27')}`
      )}
      ${tip('After adding a value, write it into the ordered list in the right place before counting to the middle.')}`,

    // method: no worked example in the book; plainest method (place the median, then use the range)
    // y10-9D Q8: building numbers from a median and a range
    'y10-9d-puzzle': `
      <p class="hp-tag">Worked example: three different whole numbers have a median of 10, a range of 4 and a mean of 10. Find them.</p>
      ${steps(
        `<p><strong>The median is the middle number.</strong></p>
         ${sum('?, 10, ?')}`,
        `<p><strong>The range is largest − smallest.</strong> The smallest is below 10, the largest above 10, and they are 4 apart: 7 and 11, 8 and 12, or 9 and 13.</p>`,
        `<p><strong>Use the last clue.</strong> A mean of 10 needs a total of 30, so the outer two add to 20: 8 and 12.</p>
         ${ans('8, 10, 12')}`
      )}
      ${tip('Test your answer against every clue. Type the numbers with commas, smallest first.')}`,

    // method: no worked example in the book; plainest method (apply the change to a small example)
    // y10-9D Q9, Q10: changing every value: the effect on the mean and the IQR
    'y10-9d-change': `
      <p class="hp-tag">Worked example: a data set has a mean of 11 and an IQR of 5. Every value is changed.</p>
      ${steps(
        `<p><strong>Adding the same amount to every value shifts the whole set.</strong> The centre moves, the spread does not.</p>
         ${sum('Add 7: mean 11 + 7 = 18, IQR stays 5')}`,
        `<p><strong>Multiplying or dividing every value scales everything,</strong> the centre and the gaps between values.</p>
         ${sum('Multiply by 2: mean 22, IQR 10<br>Divide by 2: mean 5.5, IQR 2.5')}
         ${ans('18, 22, 5.5')}`,
        `<p><strong>Check with a tiny set.</strong> 2, 4, 6: adding 1 gives 3, 5, 7 (gaps still 2); doubling gives 4, 8, 12 (gaps now 4).</p>`
      )}
      ${tip('Adding moves the data along the number line, so spreads (range, IQR) stay the same. Multiplying stretches it, so spreads change too.')}`,

    // =====================================================================
    // Year 10 9E Box plots
    // =====================================================================
    // method: Example 9, 9E (Q1, Q3, outliers, then draw the box plot)
    // y10-9E Q1, Q2, Q3, Q7: quartiles, outliers and the box plot
    'y10-9e-build': `
      <p class="hp-tag">Worked example: <b>15, 10, 18, 1, 13, 20, 11, 16, 14, 17, 12</b></p>
      ${steps(
        `<p><strong>Order the data and find the median, then split the data in half around it.</strong> 11 values: the 6th is the median, left out of both halves.</p>
         ${sum('1, 10, ' + now('11') + ', 12, 13, ' + now('14') + ', 15, 16, ' + now('17') + ', 18, 20<br>Q1 = 11, Q2 = 14, Q3 = 17<br>IQR = 17 − 11 = 6')}`,
        `<p><strong>Check for outliers with the fences.</strong></p>
         ${sum('1.5 × IQR = 1.5 × 6 = 9<br>Q1 − 9 = 11 − 9 = 2<br>Q3 + 9 = 17 + 9 = 26<br>1 < 2, so 1 is an outlier')}`,
        `<p><strong>Draw it.</strong> The whisker stops at the lowest value that is not an outlier (10), and 1 is marked with a dot.</p>
         ${dotOut(fig({ kind: 'boxplot', min: 0, max: 22, step: 2, plots: [{ five: [10, 11, 14, 17, 20], outliers: [1] }] }))}
         ${ans('11, 17, 1')}`
      )}
      ${tip('Type outliers with commas, or none. Two data sets for parallel box plots: do these steps for each one separately, then compare medians and IQRs.')}`,

    // method: Key ideas, 9E (parallel box plots on the same scale) and Example 7, 9D (IQR = Q3 − Q1)
    // y10-9E Q4, Q5, Q8: comparing parallel box plots
    'y10-9e-compare': `
      <p class="hp-tag">Worked example: compare these parallel box plots.</p>
      ${dotOut(fig({ kind: 'boxplot', min: 10, max: 36, step: 2, plots: [{ label: 'P', five: [12, 16, 20, 24, 30] }, { label: 'Q', five: [13, 18, 20, 22, 26], outliers: [34] }] }))}
      ${steps(
        `<p><strong>Read the five numbers of each plot.</strong> Then spot what they share: both medians are 20.</p>
         ${sum('P: 12, 16, 20, 24, 30<br>Q: 13, 18, 20, 22, 26, outlier 34')}`,
        `<p><strong>Spread: IQR = Q3 − Q1. Range uses the outlier too.</strong></p>
         ${sum('P: IQR 24 − 16 = 8, range 30 − 12 = 18<br>Q: IQR 22 − 18 = 4, range 34 − 13 = 21')}`,
        `<p><strong>Describe the main difference.</strong> Same centre, but the middle half of P is twice as spread out. Q has the wider range only because of its outlier.</p>
         ${ans('8, 4')}`
      )}
      <p><strong>Why is 34 an outlier but 30 is not?</strong> Q's upper fence is 22 + 1.5 × 4 = 28 and 34 is above it. P's upper fence is 24 + 1.5 × 8 = 36, and 30 is below it.</p>
      ${tip('Compare like with like: median with median, IQR with IQR.')}`,

    // method: no worked example in the book; plainest method (find the five numbers, then match)
    // y10-9E Q6: matching a box plot to a graph
    'y10-9e-match': `
      <p class="hp-tag">Worked example: which box plot matches this dot plot?</p>
      ${fig({ kind: 'dotplot', min: 2, max: 11, values: [3, 4, 4, 5, 5, 5, 6, 6, 7, 8, 8, 10] })}
      ${fig({ kind: 'boxplot', min: 2, max: 11, step: 1, plots: [{ label: 'A', five: [3, 4.5, 5.5, 7.5, 10] }, { label: 'B', five: [3, 5, 6, 7, 10] }] })}
      ${steps(
        `<p><strong>Find the five numbers from the dot plot.</strong> 12 dots, so two halves of 6.</p>
         ${sum('3, 4, 4, 5, 5, 5 | 6, 6, 7, 8, 8, 10<br>Q1 = (4 + 5) ÷ 2 = 4.5, Q2 = (5 + 6) ÷ 2 = 5.5, Q3 = (7 + 8) ÷ 2 = 7.5')}`,
        `<p><strong>Compare with each box plot.</strong> Both have min 3 and max 10, but only A has the box from 4.5 to 7.5.</p>
         ${ans('A')}`
      )}
      ${tip('For a histogram you cannot read exact values, so look at the shape instead: where the tall columns are, the box should be narrow and the median close by.')}`,

    // =====================================================================
    // Year 10 9F Standard deviation (10A)
    // =====================================================================
    // method: Example 10, 9F (calculating the sample standard deviation)
    // y10-9F Q1: mean and sample standard deviation
    'y10-9f-sd': `
      <p class="hp-tag">Worked example: find the mean and the sample standard deviation of <b>3, 5, 6, 9, 12</b>.</p>
      ${steps(
        `<p><strong>Find the mean.</strong></p>
         ${sum('x̄ = (3 + 5 + 6 + 9 + 12) ÷ 5 = 35 ÷ 5 = 7')}`,
        `<p><strong>Find each deviation (value − mean) and square it.</strong></p>
         ${fig({ kind: 'table', rows: [['x', '3', '5', '6', '9', '12'], ['x − x̄', '−4', '−2', '−1', '2', '5'], ['(x − x̄)²', '16', '4', '1', '4', '25']] })}`,
        `<p><strong>Add the squares, divide by n − 1, then take the square root.</strong></p>
         ${sum('s = √((16 + 4 + 1 + 4 + 25) ÷ (5 − 1))<br>= √(50 ÷ 4) = √12.5 = 3.5 (1 d.p.)')}
         ${ans('7, 3.5')}`
      )}
      ${tip('Divide by n − 1, not n, for the sample standard deviation. The deviations always add to 0, which is a good check. Round only at the very end.')}`,

    // method: Example 10, 9F (same formula; a value that appears f times gives f equal terms)
    // y10-9F Q2, Q5: standard deviation from a graph or a frequency table
    'y10-9f-table': `
      <p class="hp-tag">Worked example: find the mean and the sample standard deviation of these scores.</p>
      ${fig({ kind: 'table', rows: [['Score', '10', '11', '13'], ['Frequency', '2', '3', '1']] })}
      ${steps(
        `<p><strong>Write out the data:</strong> 10, 10, 11, 11, 11, 13. That is n = 6 values.</p>
         ${sum('x̄ = (10 + 10 + 11 + 11 + 11 + 13) ÷ 6 = 66 ÷ 6 = 11')}`,
        `<p><strong>Square each deviation.</strong> Every copy of a value has the same deviation, so it appears that many times in the sum.</p>
         ${sum('(10 − 11)² = 1 (twice), (11 − 11)² = 0 (three times), (13 − 11)² = 4 (once)<br>Sum = 1 + 1 + 0 + 0 + 0 + 4 = 6')}`,
        `<p><strong>Divide by n − 1 and take the square root.</strong></p>
         ${sum('s = √(6 ÷ 5) = √1.2 = 1.1 (1 d.p.)')}
         ${ans('11, 1.1')}`
      )}
      ${tip('From a dot plot or a stem-and-leaf plot, list every value first, then use the formula. n is the number of values, not the number of different scores.')}`,

    // method: Example 11, 9F (interpreting the standard deviation)
    // y10-9F Q3, Q4, Q7: interpreting mean and standard deviation
    'y10-9f-interpret': `
      <p class="hp-tag">Worked example: two classes' quiz scores, both with mean 6.</p>
      ${fig({ kind: 'dotplot', min: 1, max: 11, values: [4, 5, 5, 6, 6, 6, 7, 7, 8], xlabel: 'Class A' }, { kind: 'dotplot', min: 1, max: 11, values: [1, 2, 4, 5, 6, 7, 8, 10, 11], xlabel: 'Class B' })}
      ${steps(
        `<p><strong>The mean tells you the position (centre).</strong> Both sets sit around 6, so the means are equal.</p>`,
        `<p><strong>The standard deviation tells you the spread about the mean.</strong> Class A's dots bunch near 6, so its standard deviation is small. Class B's dots are spread far from 6, so its standard deviation is larger.</p>
         ${ans('Class B has the larger standard deviation')}`,
        `<p><strong>Give a practical reason</strong> from the context, for example: Class A did a short revision lesson together, so most scores were similar.</p>`
      )}
      ${tip('Mean and standard deviation measure different things. A bigger mean does not mean a bigger standard deviation, and the other way round.')}`,

    // method: Key ideas, 9F and 9D (outliers affect the mean and standard deviation, not the median or IQR)
    // y10-9F Q6, Q8: how an outlier affects each statistic
    'y10-9f-outlier': `
      <p class="hp-tag">Worked example: <b>A: 4, 7, 9, 11, 14</b> and <b>B: 4, 7, 9, 11, 30</b>.</p>
      ${steps(
        `<p><strong>Range and mean use the extreme value, so they change.</strong></p>
         ${sum('Range: A 14 − 4 = 10, B 30 − 4 = 26<br>Mean: A 45 ÷ 5 = 9, B 61 ÷ 5 = 12.2')}`,
        `<p><strong>The median is the middle value,</strong> 9 for both, so it does not change.</p>`,
        `<p><strong>The standard deviation uses every deviation,</strong> and 30 is far from the mean, so B's is much larger.</p>
         ${ans('Range and mean change; the median does not')}`
      )}
      ${tip('The IQR uses only the middle half of the data, so one outlier cannot change it. That makes it a better measure of spread when there is an outlier.')}`,

    // method: Key ideas, 9F (mean absolute deviation), using the question's definition (divide by n − 1)
    // y10-9F Q9: mean absolute deviation against standard deviation
    'y10-9f-mad': `
      <p class="hp-tag">Worked example: for <b>1, 4, 6, 7, 12</b>, find the mean absolute deviation (dividing by n − 1) and the standard deviation.</p>
      ${steps(
        `<p><strong>Mean, then each distance from it.</strong> Distances are always positive.</p>
         ${sum('x̄ = 30 ÷ 5 = 6<br>Distances: 5, 2, 0, 1, 6')}`,
        `<p><strong>Mean absolute deviation: add the distances, divide by n − 1.</strong></p>
         ${sum('(5 + 2 + 0 + 1 + 6) ÷ 4 = 14 ÷ 4 = 3.5')}`,
        `<p><strong>Standard deviation: square the distances instead.</strong></p>
         ${sum('s = √((25 + 4 + 0 + 1 + 36) ÷ 4) = √(66 ÷ 4) = √16.5 = 4.1 (1 d.p.)')}
         ${ans('3.5, 4.1')}`
      )}
      ${tip('The standard deviation is always at least as big as the mean absolute deviation. Squaring makes big distances count extra, so an extreme value widens the gap between them.')}`,

    // method: Key ideas, 9F (about 95% of data within two standard deviations of the mean)
    // y10-9F Q10: values within 1, 2 or 3 standard deviations of the mean
    'y10-9f-within': `
      <p class="hp-tag">Worked example: 40 test scores have mean x̄ = 52.4 and standard deviation s = 8.1.</p>
      ${steps(
        `<p><strong>Add and subtract s, 2s and 3s.</strong></p>
         ${sum('x̄ + s = 52.4 + 8.1 = 60.5, &nbsp; x̄ − s = 52.4 − 8.1 = 44.3<br>2s = 16.2: x̄ + 2s = 68.6, x̄ − 2s = 36.2<br>3s = 24.3: x̄ + 3s = 76.7, x̄ − 3s = 28.1')}`,
        `<p><strong>Count the values between each pair.</strong> Suppose 27 of the 40 scores are from 44.3 to 60.5.</p>
         ${sum('27 ÷ 40 × 100 = 67.5%')}
         ${ans('60.5, 44.3, 67.5')}`
      )}
      ${tip('Work out 2s and 3s first, then add and subtract them. In many data sets about 95% of the values are within two standard deviations of the mean.')}`,

    // =====================================================================
    // Year 10 9G Cumulative frequency and percentiles (10A)
    // =====================================================================
    // method: Example 12, 9G (interpreting cumulative frequency tables and curves)
    // y10-9G Q1, Q2: reading a cumulative frequency table and curve
    'y10-9g-read': `
      <p class="hp-tag">Worked example: how long 20 students waited for a bus, in minutes.</p>
      ${fig({ kind: 'table', rows: [['Time (min)', 'Freq.', 'Cum. freq.', '% cum. freq.'], ['0-', '2', '2', '10'], ['4-', '5', '7', '35'], ['8-', '8', '15', '75'], ['12-', '4', '19', '95'], ['16-20', '1', '20', '100']] })}
      ${steps(
        `<p><strong>One class: the frequency column. "Less than": the cumulative frequency column.</strong></p>
         ${sum('From 8 to less than 12: 8 students<br>Less than 12: 19 students')}`,
        `<p><strong>Percentages: use the percentage cumulative frequency column.</strong></p>
         ${sum('Less than 8: 35%<br>12 or more: 100 − 95 = 5%<br>From 4 to less than 8: 35 − 10 = 25%')}`,
        `<p><strong>Percentiles: go across from the percentage to the graph, then down.</strong></p>
         ${plot({ x: [0, 20, 4], y: [0, 100, 10], w: 7, h: 5, xlabel: 'Time (min)', ylabel: 'Percentage cumulative frequency', lines: [[[0, 0], [4, 10], [8, 35], [12, 75], [16, 95], [20, 100]]], pts: [[0, 0], [4, 10], [8, 35], [12, 75], [16, 95], [20, 100]], dash: [[[0, 50], [9.5, 50]], [[9.5, 50], [9.5, 0]]] })}
         ${sum('50th percentile (median) ≈ 9.5 min<br>25th ≈ 6.4, 75th = 12 → IQR ≈ 12 − 6.4 = 5.6 min')}
         ${ans('8, 19, 9.5')}`
      )}
      ${tip('The IQR is the 75th percentile minus the 25th percentile. Round to the place the question asks for.')}`,

    // method: Example 13, 9G (constructing a percentage cumulative frequency curve)
    // y10-9G Q3, Q4, Q6, Q7: cumulative columns, the curve and percentiles
    'y10-9g-build': `
      <p class="hp-tag">Worked example: scores for 40 students.</p>
      ${fig({ kind: 'table', rows: [['Score', 'Frequency'], ['20-', '3'], ['30-', '7'], ['40-', '12'], ['50-', '10'], ['60-', '6'], ['70-80', '2']] })}
      ${steps(
        `<p><strong>Cumulative frequency is a running total.</strong> Add each frequency to the one before.</p>
         ${sum('3, 3 + 7 = 10, 10 + 12 = 22, 22 + 10 = 32, 32 + 6 = 38, 38 + 2 = 40')}`,
        `<p><strong>Percentage cumulative frequency = cumulative frequency ÷ total × 100.</strong></p>
         ${sum('3 ÷ 40 × 100 = 7.5, then 25, 55, 80, 95, 100')}`,
        `<p><strong>Plot each percentage at the right-hand end of its class,</strong> start the curve on the axis, join with straight lines and read across and down.</p>
         ${plot({ x: [20, 80, 10], y: [0, 100, 10], w: 7, h: 5, xlabel: 'Score', ylabel: 'Percentage cumulative frequency', lines: [[[20, 0], [30, 7.5], [40, 25], [50, 55], [60, 80], [70, 95], [80, 100]]], pts: [[20, 0], [30, 7.5], [40, 25], [50, 55], [60, 80], [70, 95], [80, 100]], dash: [[[20, 50], [48.33, 50]], [[48.33, 50], [48.33, 0]]] })}
         ${sum('50th percentile ≈ 48, 80th percentile = 60<br>A score of 45 → up to the line, across ≈ 40%')}
         ${ans('3, 10, 22, 32, 38, 40')}`
      )}
      ${tip('Type the column values in order with commas. Raw data? Make the frequency table first, then do these steps.')}`,

    // method: Key ideas, 9G (cumulative frequency is the running total; % = cum. freq. ÷ total × 100)
    // y10-9G Q5: missing values in a cumulative frequency table
    'y10-9g-missing': `
      <p class="hp-tag">Worked example: find a, b, c and d.</p>
      ${fig({ kind: 'table', rows: [['Class', 'Freq.', 'Cum. freq.', '% cum. freq.'], ['0-', '2', '2', 'c'], ['10-', '5', 'a', '28'], ['20-', '8', '15', '60'], ['30-', '6', 'b', 'd'], ['40-50', '4', '25', '100']] })}
      ${steps(
        `<p><strong>A missing cumulative frequency: previous running total + this frequency.</strong></p>
         ${sum('a = 2 + 5 = 7<br>b = 15 + 6 = 21')}`,
        `<p><strong>A missing percentage: cumulative frequency ÷ total × 100.</strong> The total is the last cumulative frequency, 25.</p>
         ${sum('c = 2 ÷ 25 × 100 = 8<br>d = 21 ÷ 25 × 100 = 84')}
         ${ans('7, 21, 8, 84')}`,
        `<p><strong>A missing frequency?</strong> Subtract the running totals: a cumulative frequency of 15 after 7 means a frequency of 15 − 7 = 8.</p>`
      )}
      ${tip('Round percentages to one decimal place when they do not come out exactly.')}`,

    // method: no worked example in the book; plainest method (the biggest frequency gives the steepest rise)
    // y10-9G Q8, Q9: the shape of the percentage cumulative frequency curve
    'y10-9g-shape': `
      <p class="hp-tag">Worked example: describe the cumulative frequency curve for this table.</p>
      ${fig({ kind: 'table', rows: [['Class', '0-', '5-', '10-', '15-20'], ['Frequency', '2', '4', '11', '3']] })}
      ${steps(
        `<p><strong>Each class adds its frequency to the running total.</strong> A big frequency makes a big jump, so the curve is steepest there.</p>
         ${sum('Biggest frequency: 11, in the class 10-')}`,
        `<p><strong>Describe the whole curve from left to right.</strong> Small frequencies at first (slow rise), then the big class (steep rise), then a small class (levels off).</p>
         ${ans('10-')}`
      )}
      ${tip('Big frequencies early: the curve rises steeply at first. Big frequencies late: it stays low and rises steeply near the end.')}`,

    // method: no worked example in the book; the method the question describes (straight-line reading between points)
    // y10-9G Q11: approximating a percentile from the table
    'y10-9g-interp': `
      <p class="hp-tag">Worked example: use this table to approximate the 60th and 25th percentiles.</p>
      ${fig({ kind: 'table', rows: [['Score', '0-', '20-', '40-', '60-80'], ['% cum. freq.', '15', '45', '85', '100']] })}
      ${steps(
        `<p><strong>Each percentage belongs at the right-hand end of its class.</strong> 15% at 20, 45% at 40, 85% at 60, 100% at 80.</p>`,
        `<p><strong>60%: find the two percentages it sits between, and how far along.</strong> 60 is between 45 (at 40) and 85 (at 60).</p>
         ${sum('(60 − 45) ÷ (85 − 45) = 15/40 = 3/8 of the way<br>40 + 3/8 × 20 = 47.5')}`,
        `<p><strong>25%: same again.</strong> 25 is between 15 (at 20) and 45 (at 40).</p>
         ${sum('(25 − 15) ÷ (45 − 15) = 1/3 of the way<br>20 + 1/3 × 20 = 26.7 (1 d.p.)')}
         ${ans('47.5, 26.7')}`
      )}
      ${tip('The IQR is the 75th percentile minus the 25th percentile, each found this way.')}`,

    // =====================================================================
    // Year 10 9H Time-series data
    // =====================================================================
    // method: Example 14, 9H (plotting and interpreting a time-series plot)
    // y10-9H Q1, Q2, Q3: describing a trend, maximum and minimum, differences
    'y10-9h-trend': `
      <p class="hp-tag">Worked example: visitors to a museum each year, in thousands.</p>
      ${fig({ kind: 'table', rows: [['Year', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'], ['Visitors', '42', '45', '44', '48', '30', '35', '46', '51']] })}
      ${steps(
        `<p><strong>Plot it with time on the horizontal axis and join the points.</strong></p>
         ${fig({ kind: 'linegraph', xs: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'], ys: [42, 45, 44, 48, 30, 35, 46, 51], ymin: 25, ymax: 55, step: 5, xlabel: 'Year', ylabel: "Visitors ('000)" })}`,
        `<p><strong>Describe the overall rise and fall.</strong> Visitors rose slowly to 2018, dropped sharply in 2019, then recovered to a new high.</p>`,
        `<p><strong>Maximum, minimum and changes come straight from the table.</strong></p>
         ${sum('Maximum 51 (2022), minimum 30 (2019)<br>2015 to 2018: 48 − 42 = 6 thousand more')}
         ${ans('Generally increasing')}`
      )}
      ${tip('Describe the general trend first (increasing, decreasing, steady), then mention any big jumps. For money, keep the cents, like 0.25.')}`,

    // method: Key ideas, 9H (linear trend); no worked example for the average yearly change, so plainest method
    // y10-9H Q4: a linear trend and predictions
    'y10-9h-linear': `
      <p class="hp-tag">Worked example: a linear time-series plot shows a price of $250 in 2016 and $350 in 2021.</p>
      ${steps(
        `<p><strong>Linear means the points lie close to a straight line.</strong> The price rises by about the same amount each year.</p>`,
        `<p><strong>Average rise each year = total rise ÷ number of years.</strong></p>
         ${sum('2016 to 2021 is 5 years<br>(350 − 250) ÷ 5 = 20 per year')}`,
        `<p><strong>Continue the trend for a prediction.</strong></p>
         ${sum('2022: 350 + 20 = 370<br>2024: 350 + 3 × 20 = 410')}
         ${ans('20, 370, 410')}`
      )}
      ${tip('Count the years as gaps: 2016 to 2021 is 5 years, not 6. Predictions far into the future are less reliable.')}`,

    // method: Example 14, 9H (read and interpret the plot); two series compared
    // y10-9H Q5, Q6: comparing two time series
    'y10-9h-two': `
      <p class="hp-tag">Worked example: two drones' heights above the ground, in metres.</p>
      ${plot({ x: [1, 7, 1], y: [0, 16, 2], w: 7, h: 4.5, xlabel: 'Time (pm)', ylabel: 'Height (m)', lines: [[[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]], [[1, 14], [2, 13], [3, 12], [4, 11], [5, 10]]], pts: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 14], [2, 13], [3, 12], [4, 11], [5, 10]], dash: [[[5, 6], [7, 8]], [[5, 10], [7, 8]]], names: [['A', 5.2, 5.4], ['B', 5.2, 10.6]] })}
      ${steps(
        `<p><strong>Read each line at the same time and subtract.</strong></p>
         ${sum('At 3 pm: B 12, A 4 → difference 12 − 4 = 8 m')}`,
        `<p><strong>Describe each trend.</strong> A goes up 1 m each hour: increasing. B goes down 1 m each hour: decreasing.</p>`,
        `<p><strong>When will they be level? Extend both trends.</strong> At 5 pm the gap is 10 − 6 = 4 m, and it closes by 2 m each hour.</p>
         ${sum('6 pm: A 7, B 9<br>7 pm: A 8, B 8 ✓')}
         ${ans('7 pm')}`
      )}
      ${tip('For a prediction, continue each trend by the amount it changes each step. Read values in a table straight across a row.')}`,

    // method: no worked example in the book; plainest method (link the shape to what is happening)
    // y10-9H Q7, Q8, Q9: explaining the shape of a time series
    'y10-9h-shape': `
      <p class="hp-tag">Worked example: average monthly maximum temperature for a city.</p>
      ${fig({ kind: 'linegraph', xs: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], ys: [29, 29, 27, 23, 19, 16, 15, 17, 20, 23, 26, 28], ymin: 10, ymax: 30, step: 5, xlabel: 'Month', ylabel: 'Temp. (°C)' })}
      ${steps(
        `<p><strong>Find when it is hottest.</strong> December to February.</p>`,
        `<p><strong>Link that to a fact.</strong> Summer in December to February means the Southern Hemisphere, so this could be an Australian city.</p>
         ${ans('Southern Hemisphere')}`,
        `<p><strong>Other shapes to know.</strong> Rising faster and faster each year: compound growth, like interest on interest. Falling and levelling off: something cooling towards room temperature, which it never goes below.</p>`
      )}
      ${tip('Read the shape (steady rise, rise that gets steeper, levelling off, a yearly wave) and match it to the story in the question.')}`,

    // method: no worked example in the book; the method the question describes (average of all scores so far)
    // y10-9H Q10: a running (moving) average
    'y10-9h-moving': `
      <p class="hp-tag">Worked example: a player's scores are <b>20, 36, 13, 47, 29</b>. Find the average after each game.</p>
      ${steps(
        `<p><strong>Keep a running total of the scores.</strong></p>
         ${sum('20, 56, 69, 116, 145')}`,
        `<p><strong>Divide each running total by the number of games so far.</strong></p>
         ${sum('20 ÷ 1 = 20, 56 ÷ 2 = 28, 69 ÷ 3 = 23<br>116 ÷ 4 = 29, 145 ÷ 5 = 29')}
         ${ans('20, 28, 23, 29, 29')}`
      )}
      <p><strong>Which graph varies more?</strong> The scores jump from 13 to 47, but the average only moves between 20 and 29. Averaging smooths out the ups and downs.</p>
      ${tip('Round each average to the nearest whole number only after dividing. Type the values in order with commas.')}`,

    // =====================================================================
    // Year 10 9I Bivariate data and scatter plots
    // =====================================================================
    // method: Example 15, 9I (constructing and interpreting scatter plots)
    // y10-9I Q1, Q2, Q3, Q4: correlation and outliers
    'y10-9i-correlation': `
      <p class="hp-tag">Worked example: describe the correlation and find any outlier.</p>
      ${fig({ kind: 'table', rows: [['x', '1', '2', '3', '4', '5', '6', '7', '8'], ['y', '9.5', '8.8', '3.0', '7.4', '6.6', '5.8', '5.1', '4.3']] })}
      ${steps(
        `<p><strong>Plot each point.</strong> x across, y up.</p>
         ${plot({ x: [0, 9, 1], y: [0, 10, 1], w: 7, h: 5, pts: [[1, 9.5], [2, 8.8], [3, 3.0], [4, 7.4], [5, 6.6], [6, 5.8], [7, 5.1], [8, 4.3]], xlabel: 'x', ylabel: 'y' })}`,
        `<p><strong>Positive or negative?</strong> As x increases, y decreases: negative. <strong>Strong or weak?</strong> The points (apart from one) lie close to a clear straight line: strong.</p>`,
        `<p><strong>The outlier is the point that does not follow the trend.</strong></p>
         ${ans('(3, 3)')}`
      )}
      ${chips(['Up to the right: positive'], ['Down to the right: negative'], ['Close to a line: strong'], ['Loose cloud: weak'], ['No pattern: none'])}
      ${tip('Type a point as (x, y), like (3, 3). Ignore the outlier when you decide strong or weak.')}`,

    // method: Example 15, 9I (as x increases, y increases or decreases; the outlier defies the trend)
    // y10-9I Q5, Q6, Q7, Q8: relationships in context
    'y10-9i-context': `
      <p class="hp-tag">Worked example: daily maximum temperature and ice-creams sold at a kiosk.</p>
      ${fig({ kind: 'table', rows: [['Day', 'A', 'B', 'C', 'D', 'E', 'F'], ['Temperature (°C)', '18', '22', '25', '28', '31', '34'], ['Ice-creams sold', '40', '52', '25', '70', '80', '88']] })}
      ${steps(
        `<p><strong>Predict first.</strong> Hotter days should sell more ice-creams, so we expect a positive relationship.</p>`,
        `<p><strong>Check the data.</strong> As the temperature goes up, sales mostly go up too, so the data support the prediction.</p>`,
        `<p><strong>Find the point against the trend.</strong> Day C is hotter than B but sold far fewer (25), so it does not fit.</p>
         ${ans('C')}`
      )}
      ${tip('Put the variable that causes the change (the independent variable) on the horizontal axis. With only a handful of points, be careful about strong conclusions.')}`,

    // method: Key ideas, 9I (types of correlation); no worked example for these questions, so plainest method
    // y10-9I Q9, Q10, Q11: correlation, causation and enough data
    'y10-9i-reason': `
      <p class="hp-tag">Worked example: in summer, ice-cream sales and shark sightings both go up. Do ice-creams attract sharks?</p>
      ${steps(
        `<p><strong>A correlation only says the two variables move together.</strong> It does not say one causes the other.</p>`,
        `<p><strong>Look for a third variable.</strong> Hot weather brings more people to the beach: more ice-creams and more people to spot sharks.</p>
         ${ans('No: correlation does not mean causation')}`,
        `<p><strong>Is there enough data?</strong> Three points bunched together prove nothing. Comparing two surveys, the one whose scatter plot shows a clear pattern is the one that supports a claim.</p>`
      )}
      ${tip('Before trusting a scatter plot, ask: how many points, how spread out, and could something else explain it?')}`,

    // method: no worked example in the book; plainest method (filter the table, then sort)
    // y10-9I Q12: picking students from a table
    'y10-9i-sort': `
      <p class="hp-tag">Worked example: of the people who exercise fewer than 5 hours a week, which two have the highest resting heart rate?</p>
      ${fig({ kind: 'table', rows: [['Person', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], ['Exercise (h)', '2', '7', '4', '1', '9', '3', '6', '0'], ['Heart rate', '78', '62', '71', '84', '58', '75', '66', '80']] })}
      ${steps(
        `<p><strong>Keep only the people who match the condition.</strong> Fewer than 5 hours: A, C, D, F, H.</p>`,
        `<p><strong>Sort those by the other variable.</strong></p>
         ${sum('D 84, H 80, A 78, F 75, C 71')}
         ${ans('D, H')}`
      )}
      ${tip('Type the two letters with a comma, like D, H. Check "fewer than" against "more than" carefully: someone on exactly 5 hours is in neither group.')}`,

    // =====================================================================
    // Year 10 9J Line of best fit by eye
    // =====================================================================
    // method: Example 16, 9J (fitting a line of best fit and reading values from it)
    // y10-9J Q1, Q2: reading estimates from a line of best fit
    'y10-9j-read': `
      <p class="hp-tag">Worked example: use the line of best fit to estimate y when x = 5, and x when y = 4.</p>
      ${plot({ x: [0, 8, 1], y: [0, 6, 1], w: 7, h: 5, xlabel: 'x', ylabel: 'y', pts: [[1, 1.4], [2, 2.2], [3, 2.3], [4, 3.2], [5, 3.4], [6, 4.1], [7, 4.4]], lines: [[[0, 1], [8, 5]]], dash: [[[5, 0], [5, 3.5]], [[5, 3.5], [0, 3.5]], [[0, 4], [6, 4]], [[6, 4], [6, 0]]] })}
      ${steps(
        `<p><strong>The line balances the points:</strong> about as many above it as below.</p>`,
        `<p><strong>y from x: go up from x to the line, then across to the y-axis.</strong></p>
         ${sum('x = 5 → y ≈ 3.5')}`,
        `<p><strong>x from y: go across from y to the line, then down to the x-axis.</strong></p>
         ${sum('y = 4 → x ≈ 6')}
         ${ans('3.5, 6')}`
      )}
      ${tip('Read from the line, not from the nearest dot. If the equation is given, you can substitute into it instead: here y = 0.5x + 1, so x = 5 gives 3.5.')}`,

    // method: Example 17, 9J (finding the equation of a line of best fit, then using it)
    // y10-9J Q3, Q4, Q5, Q8, Q9: equation of a trend line and estimates from it
    'y10-9j-equation': `
      <p class="hp-tag">Worked example: a trend line passes through <b>(10, 14)</b> and <b>(50, 34)</b>. Find its equation, then use it.</p>
      ${steps(
        `<p><strong>Gradient: m = (y₂ − y₁) ÷ (x₂ − x₁).</strong></p>
         ${sum('m = (34 − 14) ÷ (50 − 10) = 20 ÷ 40 = 0.5<br>y = 0.5x + c')}`,
        `<p><strong>Substitute one point to find c.</strong></p>
         ${sum('(10, 14): 14 = 0.5(10) + c<br>14 = 5 + c, so c = 9<br>y = 0.5x + 9')}
         ${ans('y = 0.5x + 9')}`,
        `<p><strong>Estimate: substitute x, or substitute y and solve.</strong></p>
         ${sum('x = 30: y = 0.5(30) + 9 = 24<br>y = 29: 29 = 0.5x + 9 → 20 = 0.5x → x = 40')}`
      )}
      <p><strong>Check the answer makes sense.</strong> If the variables are percentages, an answer above 100 is impossible: the line has been used too far outside the data.</p>
      ${tip('Type the equation like y = 0.5x + 9. A gradient can be typed as a decimal or a fraction, like 0.5 or 1/2.')}`,

    // method: Key ideas, 9J (interpolation and extrapolation); no worked example, so plainest method
    // y10-9J Q6, Q7: when a trend line is not reliable
    'y10-9j-limits': `
      <p class="hp-tag">Worked example: is this trend line safe to use?</p>
      ${plot({ x: [0, 10, 1], y: [0, 10, 1], w: 6, h: 4.5, pts: [[1, 1.5], [2, 3.4], [3, 4.9], [4, 6.0], [5, 6.8], [6, 7.3], [7, 7.6], [8, 7.8]], lines: [[[0, 1.9], [9, 9.6]]], xlabel: 'x', ylabel: 'y' })}
      ${steps(
        `<p><strong>Interpolation</strong> means estimating inside the range of the data. It is risky if the points are very scattered (weak correlation) or if there are only a few points.</p>`,
        `<p><strong>Extrapolation</strong> means estimating outside the range. It is risky if the data cover only a small range, or if the pattern is curved.</p>`,
        `<p><strong>Here the points curve and level off,</strong> but the straight line keeps rising. Predictions beyond x = 8 would be too high.</p>
         ${ans('The data are curved, so the line overestimates')}`
      )}
      ${tip('Ask three questions: is the pattern straight, are the points close to the line, and are there enough points?')}`
  });
})();
