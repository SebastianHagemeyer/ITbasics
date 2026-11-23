/* H3 "How do I work this out?" panels for Chapter 8.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 8A to 8I. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 8A Collecting and classifying data
    // =====================================================================
    // 8A Q1, Q2: categorical, discrete numerical or continuous numerical
    '8a-classify': `
      <p class="hp-tag">Worked example: classify each set of data.</p>
      ${steps(
        `<p><strong>Are the answers words or numbers?</strong> Words (or labels) are <b>categorical</b> data. Numbers are <b>numerical</b> data.</p>`,
        `<p><strong>For numbers, ask: counted or measured?</strong> Counted data can only be whole steps (4 windows, never 4.7 windows), so it is <b>discrete</b>. Measured data can be any value in between (152.3 cm), so it is <b>continuous</b>.</p>
         <div class="hp-table" role="table">
           <div class="hp-tr hp-th" role="row"><span role="columnheader">Data</span><span role="columnheader">Words, counted or measured?</span><span role="columnheader">Type</span></div>
           <div class="hp-tr" role="row"><span role="cell">the breed of each dog at a park</span><span role="cell">words (kelpie, poodle)</span><span role="cell">Categorical</span></div>
           <div class="hp-tr" role="row"><span role="cell">the number of windows in each classroom</span><span role="cell">counted</span><span role="cell">Discrete numerical</span></div>
           <div class="hp-tr" role="row"><span role="cell">the heights of the sunflowers in a garden</span><span role="cell">measured</span><span role="cell">Continuous numerical</span></div>
         </div>
         ${ans('Categorical, Discrete numerical, Continuous numerical')}`
      )}
      ${tip('Lengths, masses, times and temperatures are measured, so they are continuous. "The number of ..." is counted, so it is discrete.')}`,

    // 8A Q3, Q7, Q11, Q12: observation, sample or census
    '8a-collect': `
      <p class="hp-tag">Worked example: what is the best way to collect each set of data?</p>
      ${chips(['(a) the number of people using a pedestrian crossing from 3 p.m. to 4 p.m. today'], ['(b) the hat sizes of everyone in your netball team'], ['(c) the bedtimes of all 12-year-olds in Australia'])}
      ${steps(
        `<p><strong>Can you just watch it happen?</strong> You can stand by the crossing and count, so (a) is an <b>observation</b>.</p>`,
        `<p><strong>Is the group small enough to ask everyone?</strong> A netball team is a handful of people, so ask them all. Asking every member is a <b>census</b>, so (b) is a census.</p>`,
        `<p><strong>Too many to ask?</strong> You cannot ask every 12-year-old in Australia, so ask a smaller group chosen from them. That is a <b>sample</b>.</p>
         ${ans('Observation, Census, Sample')}`
      )}
      ${tip('A census is the most accurate, but for a huge group it costs too much time and money. A sample must be big enough, and mixed enough, to stand for the whole group.')}`,

    // 8A Q4: primary or secondary source
    '8a-source': `
      <p class="hp-tag">Worked example: should you use a primary or a secondary source for (a) the minutes each student in your class spent reading last night, (b) the number of people living in Queensland?</p>
      ${steps(
        `<p><strong>Could you collect it yourself, easily?</strong> You can ask your own class, so (a) is a <b>primary source</b>: you collect the data.</p>`,
        `<p><strong>Would you need to ask millions of people?</strong> For (b), use data someone else has already published, such as government figures. That is a <b>secondary source</b>.</p>
         ${ans('Primary source, Secondary source')}`
      )}
      ${tip('A small group you can reach (your class, your family) points to primary. A whole state or country points to secondary.')}`,

    // 8A Q8: putting answers on a numbered scale
    '8a-likert': `
      <p class="hp-tag">Worked example: the answers <b>warm, freezing, hot, mild, cold</b> are put on a scale from 1 = freezing to 5 = hot. What number should <b>warm</b> get?</p>
      ${steps(
        `<p><strong>Put the words in order</strong>, starting at the 1 end.</p>
         ${flow(['1', 'freezing'], ['2', 'cold'], ['3', 'mild'], ['4', 'warm'], ['5', 'hot'])}`,
        `<p><strong>Read off the number</strong> under the word you want.</p>
         ${ans('4')}`
      )}
      ${tip('The numbers only show the order. They are labels, so answers on a scale like this are still categorical data.')}`,

    // 8A Q9: who does a survey leave out?
    '8a-bias': `
      <p class="hp-tag">Worked example: a survey about favourite sports is handed out only at a skate park. Who is most likely to be left out?</p>
      ${steps(
        `<p><strong>Who will be there to answer?</strong> Mostly people who skate.</p>`,
        `<p><strong>Who will not be there?</strong> People who never go to skate parks, such as swimmers or netballers. Their answers are missing, so the results lean towards skating.</p>
         ${ans('People who do not visit skate parks')}`
      )}
      ${tip('Ask where, when and how the survey is done, then think about who cannot be reached that way. A survey printed only in English misses people who do not read English.')}`,

    // =====================================================================
    // 8B Summarising data numerically
    // =====================================================================
    // 8B Q1: range
    '8b-range': `
      <p class="hp-tag">Worked example: find the range of <b>12, 7, 26, 10, 18</b>.</p>
      ${steps(
        `<p><strong>Find the largest and the smallest.</strong> Scan the whole list, because it is not in order. Largest 26, smallest 7.</p>`,
        `<p><strong>Take the smallest from the largest.</strong></p>
         ${sum('26 − 7 = 19')}
         ${ans('19')}`
      )}
      ${tip('The range is one number: how spread out the data is. Do not write "7 to 26".')}`,

    // 8B Q2: mean
    '8b-mean': `
      <p class="hp-tag">Worked example: find the mean of <b>7, 12, 4, 9, 3</b>.</p>
      ${steps(
        `<p><strong>Add up all the values.</strong></p>
         ${sum('7 + 12 + 4 + 9 + 3 = 35')}`,
        `<p><strong>Divide by how many values there are.</strong> There are 5.</p>
         ${sum('35 ÷ 5 = 7')}
         ${ans('7')}`
      )}
      ${tip('The mean is the "fair share": if everyone had the same amount, they would each have 7. It does not have to be one of the values.')}`,

    // 8B Q3, Q4, Q8, Q9: range, mean, median and mode of one data set
    '8b-all': `
      <p class="hp-tag">Worked example: for <b>5, 9, 3, 9, 13, 4</b>, find the range, mean (to 1 decimal place), median and mode.</p>
      ${steps(
        `<p><strong>Sort the values first.</strong> Then the range and mode are easy to see.</p>
         ${sum('3, 4, 5, 9, 9, 13<br>range = 13 − 3 = 10<br>mode = 9 (it appears most often)')}`,
        `<p><strong>Mean: add, then divide by the count.</strong></p>
         ${sum('3 + 4 + 5 + 9 + 9 + 13 = 43<br>43 ÷ 6 = 7.166... ≈ 7.2')}`,
        `<p><strong>Median: the middle of the sorted list.</strong> With 6 values there are two in the middle, 5 and 9, so go halfway between them.</p>
         ${sum('(5 + 9) ÷ 2 = 7')}
         ${ans('range 10, mean 7.2, median 7, mode 9')}`
      )}
      ${tip('To round to 1 decimal place, look at the next digit: 7.16 rounds up to 7.2. To compare two people, work out the same measure for each one, then compare.')}`,

    // 8B Q5, Q6, Q7: median (odd and even counts)
    '8b-median': `
      <p class="hp-tag">Worked example: find the median of <b>15, 8, 21, 3, 11</b>. Then find it again after 18 is added.</p>
      ${steps(
        `<p><strong>Put the values in order.</strong></p>
         ${sum('3, 8, ' + now('11') + ', 15, 21')}`,
        `<p><strong>Odd count: one value is in the middle.</strong> Cross off one from each end until one is left.</p>
         ${ans('11')}`,
        `<p><strong>Even count: two values are in the middle.</strong> Add 18 in its place, then go halfway between the middle two.</p>
         ${sum('3, 8, ' + now('11, 15') + ', 18, 21<br>(11 + 15) ÷ 2 = 13')}
         ${ans('13')}`
      )}
      ${tip('The median of an even count can be a decimal, like 12.5. Always sort first: the middle of an unsorted list means nothing.')}`,

    // 8B Q10, Q11: frequency tables
    '8b-freq': `
      <p class="hp-tag">Worked example: the table shows how many people were in each car passing a school.</p>
      ${fig({ kind: 'table', rows: [['People in the car', '1', '2', '3', '4'], ['Number of cars', '8', '6', '5', '3']] })}
      ${steps(
        `<p><strong>Count the cars:</strong> add the bottom row.</p>
         ${sum('8 + 6 + 5 + 3 = 22 cars')}`,
        `<p><strong>Total people:</strong> each value times how many times it happened.</p>
         ${sum('1 × 8 + 2 × 6 + 3 × 5 + 4 × 3<br>= 8 + 12 + 15 + 12 = 47 people')}`,
        `<p><strong>Mean = total ÷ count.</strong> The mode is the value with the biggest count.</p>
         ${sum('47 ÷ 22 = 2.136... ≈ 2.1')}
         ${ans('22 cars, mean 2.1, mode 1, range 3')}`
      )}
      ${tip('The mode is a value from the top row (1 person), not the count (8). The range uses the top row too: 4 − 1 = 3.')}`,

    // 8B Q12, Q15: working backwards from the mean
    '8b-reverse': `
      <p class="hp-tag">Worked example: two whole numbers have a mean of <b>9</b> and a range of <b>4</b>. What are they?</p>
      ${steps(
        `<p><strong>Mean × count = total.</strong></p>
         ${sum('9 × 2 = 18')}`,
        `<p><strong>Find two numbers that add to 18 and are 4 apart.</strong> Start both at 9, then move them 2 apart each way.</p>
         ${sum('7 + 11 = 18 and 11 − 7 = 4')}
         ${ans('7, 11')}`
      )}
      <p><strong>With a mode.</strong> A mode must appear at least twice. For a mode of 5 and a mean of 8 with three values: 5, 5 and one more. The total must be 3 × 8 = 24, so the last value is 24 − 10 = 14.</p>
      ${tip('Type a list smallest first, with commas: 7, 11. Check your numbers by working out the mean and range again.')}`,

    // 8B Q13: an outlier changes the mean more than the median
    '8b-outlier': `
      <p class="hp-tag">Worked example: <b>4, 5, 6, 7, 8</b>. What happens if the 8 is replaced by 98?</p>
      ${steps(
        `<p><strong>Before:</strong></p>
         ${sum('mean = 30 ÷ 5 = 6, median = 6')}`,
        `<p><strong>After:</strong> the sorted list is 4, 5, 6, 7, 98.</p>
         ${sum('mean = 120 ÷ 5 = 24, median = 6')}
         <p>The mean jumped from 6 to 24. The median did not move at all.</p>
         ${ans('The mean changes much more')}`
      )}
      ${tip('One very big or very small value (an outlier) drags the mean towards it. The median only cares about the middle, so it hardly moves.')}`,

    // 8B Q14: adding to or doubling every value
    '8b-change': `
      <p class="hp-tag">Worked example: <b>1, 4, 4, 7, 9</b>. What happens if you add 3 to every value, or double every value?</p>
      ${fig({ kind: 'table', rows: [['', 'Original', 'Add 3', 'Double'], ['Values', '1, 4, 4, 7, 9', '4, 7, 7, 10, 12', '2, 8, 8, 14, 18'], ['Mean', '5', '8', '10'], ['Median', '4', '7', '8'], ['Mode', '4', '7', '8'], ['Range', '8', '8', '16']] })}
      ${steps(
        `<p><strong>Work out all four for the original.</strong> Mean = 25 ÷ 5 = 5. Median = middle value = 4. Mode = 4. Range = 9 − 1 = 8.</p>`,
        `<p><strong>Add 3 to every value.</strong> Mean, median and mode all go up by 3. The range stays 8, because the whole set just slides up.</p>`,
        `<p><strong>Double every value.</strong> All four measures double, even the range, because the gaps double too.</p>
         ${ans('Add 3: up by 3 (range the same). Double: all double.')}`
      )}
      ${tip('If you are not sure, try it: change the values, then work the measures out again.')}`,

    // 8B Q18: mean and median of fractions
    '8b-fractions': `
      <p class="hp-tag">Worked example: find the mean and the median of <b>1/2, 1/4, 1/5, 1/10</b>.</p>
      ${steps(
        `<p><strong>Mean: add with a common denominator.</strong> 20 works for all four.</p>
         ${sum('10/20 + 5/20 + 4/20 + 2/20 = 21/20')}`,
        `<p><strong>Divide by the count, 4.</strong> Dividing by 4 multiplies the denominator by 4.</p>
         ${sum('21/20 ÷ 4 = 21/80')}`,
        `<p><strong>Median: order them.</strong> With top number 1, a bigger denominator is a smaller piece: 1/10, 1/5, 1/4, 1/2. Go halfway between the middle two.</p>
         ${sum('1/5 + 1/4 = 4/20 + 5/20 = 9/20<br>9/20 ÷ 2 = 9/40')}
         ${ans('mean 21/80, median 9/40')}`
      )}
      ${tip('Type a fraction with a slash, like 21/80.')}`,

    // =====================================================================
    // 8C Column graphs and dot plots
    // =====================================================================
    // 8C Q1, Q2, Q12: reading a dot plot
    '8c-dotplot': `
      <p class="hp-tag">Worked example: the dot plot shows how many books some students read in the holidays.</p>
      ${fig({ kind: 'dotplot', min: 0, max: 14, values: [1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 13], xlabel: 'Number of books' })}
      ${steps(
        `<p><strong>Each dot is one person.</strong> Count them: 12 people. The tallest column of dots is the mode: 3 books.</p>`,
        `<p><strong>Range and outlier.</strong> Range = 13 − 1 = 12. The dot at 13 sits far away from the rest, so it is an outlier.</p>`,
        `<p><strong>Median and mean.</strong> 12 dots, so the median is halfway between the 6th and 7th dots from the left: both are 3. For the mean, add the value of every dot, then divide by 12.</p>
         ${sum('1 + 2 + 2 + 3 + 3 + 3 + 3 + 4 + 4 + 5 + 5 + 13 = 48<br>48 ÷ 12 = 4')}
         ${ans('12 people, mode 3, range 12, median 3, outlier 13, mean 4')}`
      )}
      ${tip('A column of four dots above 3 means four people each read 3 books. It adds 3 four times to the total, not just once.')}`,

    // 8C Q3, Q4, Q5, Q6, Q8: reading a column graph
    '8c-columns': `
      <p class="hp-tag">Worked example: the graph shows how many books a library lent each day.</p>
      ${fig({ kind: 'columns', cats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [14, 8, 18, 6, 12], ymax: 20, step: 2, xlabel: 'Day', ylabel: 'Number of books', title: 'Books lent' })}
      ${steps(
        `<p><strong>Read a column.</strong> Go from the top of the column straight across to the scale. Wednesday: 18 books.</p>`,
        `<p><strong>Compare two columns:</strong> take one from the other.</p>
         ${sum('Wednesday − Thursday = 18 − 6 = 12 more')}`,
        `<p><strong>Total: add every column.</strong></p>
         ${sum('14 + 8 + 18 + 6 + 12 = 58')}
         ${ans('18, 12 more, 58 altogether')}`
      )}
      ${tip('Check what each gridline is worth before you read. If the columns go up by the same amount each time, keep that pattern going to predict the next one.')}`,

    // 8C Q7, Q11: comparing and totalling a table
    '8c-table': `
      <p class="hp-tag">Worked example: an animal shelter recorded its adoptions.</p>
      ${fig({ kind: 'table', rows: [['Year', '2016', '2017', '2018'], ['Cats adopted', '23', '31', '27'], ['Dogs adopted', '29', '26', '34']] })}
      ${steps(
        `<p><strong>Compare inside each column.</strong> In which years were more dogs than cats adopted? 2016 (29 > 23) and 2018 (34 > 27). In 2017 cats won.</p>`,
        `<p><strong>For a total in one year, add down the column.</strong></p>
         ${sum('2016: 23 + 29 = 52<br>2017: 31 + 26 = 57<br>2018: 27 + 34 = 61')}
         <p>So the most adoptions were in 2018 and the fewest in 2016.</p>
         ${ans('2016, 2018')}`
      )}
      ${tip('Type years in a list with commas. If a table gives numbers "per week", multiply by 52 to get a whole year.')}`,

    // 8C Q9: a misleading scale
    '8c-scale': `
      <p class="hp-tag">Worked example: a graph's vertical axis is labelled <b>0, 4, 8, 20, 24</b> at equally spaced gridlines. Column A reaches the first gridline and column B reaches the third.</p>
      ${chips(['0'], ['4'], ['8'], ['20'], ['24'])}
      ${steps(
        `<p><strong>Check the steps between labels.</strong> 0 to 4 is 4, 4 to 8 is 4, but 8 to 20 is 12. The steps are not equal, so the graph is misleading.</p>`,
        `<p><strong>Read the values, not the heights.</strong> B looks 3 times as tall as A, but A is 4 and B is 20.</p>
         ${sum('20 ÷ 4 = 5')}
         ${ans('B is 5 times as popular as A')}`
      )}
      ${tip('Equal gaps on an axis must stand for equal amounts. Always read the numbers on the scale.')}`,

    // 8C Q10: comparing two dot plots
    '8c-compare': `
      <p class="hp-tag">Worked example: two teams recorded their goals in each game.</p>
      ${fig({ kind: 'dotplot', min: 0, max: 9, values: [0, 2, 3, 3, 4, 5, 6, 9], xlabel: 'Goals', caption: 'Team A' }, { kind: 'dotplot', min: 0, max: 9, values: [2, 3, 3, 4, 4, 4, 5], xlabel: 'Goals', caption: 'Team B' })}
      ${steps(
        `<p><strong>Median of each.</strong> Team A has 8 dots, so go halfway between the 4th and 5th: 3 and 4 give 3.5. Team B has 7 dots, so the 4th dot: 4.</p>`,
        `<p><strong>Range of each.</strong> Team A: 9 − 0 = 9. Team B: 5 − 2 = 3.</p>`,
        `<p><strong>Compare.</strong> A bigger range means the data is more spread out.</p>
         ${ans('Team A has the greater spread')}`
      )}
      ${tip('The highest dot shows the best single result. The median shows what is typical.')}`,

    // 8C Q13: symmetrical or skewed
    '8c-shape': `
      <p class="hp-tag">Worked example: describe the shape of this dot plot, then find the mean and the median.</p>
      ${fig({ kind: 'dotplot', min: 0, max: 8, values: [1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 5, 7] })}
      ${steps(
        `<p><strong>Find the peak and the tail.</strong> The dots pile up on the left and trail off to the right, towards the bigger numbers. A tail to the right is <b>positively skewed</b>. A tail to the left is <b>negatively skewed</b>. A mirror image is <b>symmetrical</b>.</p>`,
        `<p><strong>Mean:</strong> add every dot and divide by 12.</p>
         ${sum('3 + 8 + 6 + 4 + 5 + 7 = 33<br>33 ÷ 12 = 2.75 ≈ 2.8')}`,
        `<p><strong>Median:</strong> the 6th and 7th dots are both 2.</p>
         ${ans('Positively skewed, mean 2.8, median 2')}`
      )}
      ${tip('The mean gets pulled towards the tail. In a symmetrical plot the mean and median are equal.')}`,

    // 8C Q14: counting different graphs
    '8c-count': `
      <p class="hp-tag">Worked example: a column graph shows three pets: cat, dog and fish. Counting only direction (up or across) and order, how many different graphs are there?</p>
      ${steps(
        `<p><strong>Count the orders.</strong> 3 choices for the first column, then 2 left, then 1.</p>
         ${sum('3 × 2 × 1 = 6')}`,
        `<p><strong>Each order can go up or across.</strong> That doubles it.</p>
         ${sum('6 × 2 = 12')}
         ${ans('12')}`
      )}
      ${tip('If unsure, list them: CDF, CFD, DCF, DFC, FCD, FDC. That is 6.')}`,

    // =====================================================================
    // 8D Line graphs
    // =====================================================================
    // 8D Q1, Q2, Q3: reading values from a line graph
    '8d-read': `
      <p class="hp-tag">Worked example: a sunflower is measured each week.</p>
      ${fig({ kind: 'linegraph', xs: ['Wk 0', 'Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'], ys: [10, 20, 30, 50, 60, 65], ymin: 0, ymax: 70, step: 5, xlabel: 'Week', ylabel: 'Height (cm)', title: 'Height of a sunflower' })}
      ${steps(
        `<p><strong>Read a point.</strong> Find Week 3 on the bottom, go up to the line, then across to the scale: 50 cm.</p>`,
        `<p><strong>Estimate between points.</strong> Halfway between Week 1 (20 cm) and Week 2 (30 cm), the line is at about 25 cm.</p>`,
        `<p><strong>Find the biggest change.</strong> The steepest part of the line is from Week 2 to Week 3: it rose 20 cm.</p>
         ${ans('50 cm, about 25 cm, fastest growth from Week 2 to Week 3')}`
      )}
      ${tip('Up means increasing, flat means no change, down means decreasing. The steeper the line, the faster the change.')}`,

    // 8D Q6, Q7: explaining the rises and falls
    '8d-story': `
      <p class="hp-tag">Worked example: the graph shows how many people were in a café.</p>
      ${fig({ kind: 'linegraph', xs: ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm'], ys: [4, 26, 18, 8, 10, 32, 24, 6], ymin: 0, ymax: 35, step: 5, xlabel: 'Time', ylabel: 'Number of people', title: 'People in a café' })}
      ${steps(
        `<p><strong>Look for big rises.</strong> From 7 a.m. to 8 a.m. and from 11 a.m. to 12 p.m., lots of people arrived: the breakfast and lunch rushes.</p>`,
        `<p><strong>Look for falls.</strong> After each rush, people finish and leave, so the line drops.</p>`,
        `<p><strong>Match the story.</strong> When did the lunch rush start? The big rise begins at 11 a.m.</p>
         ${ans('11 a.m.')}`
      )}
      ${tip('Ask "what would make the line go up here?" A heater switching on, rain filling a dam or customers arriving. A fall is the opposite. If the line is flat, what comes in matches what goes out.')}`,

    // 8D Q4, Q5, Q8: travel graphs
    '8d-travel': `
      <p class="hp-tag">Worked example: a cyclist's trip is shown on this travel graph.</p>
      ${fig({ kind: 'linegraph', xs: ['0', '1', '2', '3', '4', '5'], ys: [0, 15, 25, 25, 45, 50], ymin: 0, ymax: 60, step: 5, xlabel: 'Time (hours)', ylabel: 'Distance (km)', title: 'Distance travelled by a cyclist' })}
      ${steps(
        `<p><strong>Total distance:</strong> read the last point. 50 km.</p>`,
        `<p><strong>Distance in one hour:</strong> take the start of the hour from the end. In the 2nd hour (1 to 2 hours): 25 − 15 = 10 km. From 2 to 3 hours the line is flat: 0 km, so the cyclist stopped.</p>`,
        `<p><strong>Fastest hour:</strong> the steepest part. In the 4th hour (3 to 4 hours): 45 − 25 = 20 km.</p>
         ${ans('50 km in total; stopped from 2 to 3 hours; fastest in the 4th hour')}`
      )}
      ${tip('The 4th hour is from 3 to 4 hours, not from 4 to 5. To match a story to a graph, keep a running total: 15 km, then 10 more makes 25, then 0 more stays at 25.')}`,

    // 8D Q11: hemisphere and distance from the equator
    '8d-seasons': `
      <p class="hp-tag">Worked example: this graph shows the maximum temperature in a city each month.</p>
      ${fig({ kind: 'linegraph', xs: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], ys: [7, 8, 11, 15, 19, 23, 26, 25, 21, 16, 11, 8], ymin: 0, ymax: 30, step: 5, xlabel: 'Month', ylabel: 'Max. temperature (°C)' })}
      ${steps(
        `<p><strong>Find the hot months.</strong> They are in the middle of the year (June to August). In Australia that is winter, so this city has summer when we have winter: it is in the <b>Northern Hemisphere</b>.</p>`,
        `<p><strong>How big is the change?</strong> 26 − 7 = 19 degrees between summer and winter. A big swing means a place far from the equator. Near the equator it is warm all year.</p>
         ${ans('Northern Hemisphere, far from the equator')}`
      )}
      ${tip('Hottest in December to February: Southern Hemisphere (like Australia). Hottest in June to August: Northern Hemisphere.')}`,

    // =====================================================================
    // 8E Stem-and-leaf plots
    // =====================================================================
    // 8E Q1, Q2, Q13: reading a stem-and-leaf plot
    '8e-read': `
      <p class="hp-tag">Worked example: write out the values in this plot.</p>
      ${fig({ kind: 'stemleaf', rows: [['4', '1 6 9'], ['5', '2 2 5 8'], ['6', '0 3 7']], key: '5 | 2 means 52' })}
      ${steps(
        `<p><strong>Join each leaf to its stem.</strong> The stem is the tens, the leaf is the ones. Row 4 gives 41, 46, 49.</p>`,
        `<p><strong>Go row by row.</strong> The leaves are already in order, so the list comes out smallest to largest.</p>
         ${ans('41, 46, 49, 52, 52, 55, 58, 60, 63, 67')}`,
        `<p><strong>Count and find the ends.</strong> 10 leaves, so 10 values. Smallest: first leaf of the top row (41). Largest: last leaf of the bottom row (67). "In the 50s" means the 5 row: 4 values.</p>`
      )}
      ${tip('A repeated leaf is a repeated value: "5 | 2 2" means two 52s. A row has only 10 possible leaves (0 to 9), so 11 or more leaves in one row means some must repeat.')}`,

    // 8E Q3, Q7: range and median from a stem-and-leaf plot
    '8e-stats': `
      <p class="hp-tag">Worked example: find the range and the median.</p>
      ${fig({ kind: 'stemleaf', rows: [['6', '2 7'], ['7', '0 4 4 5 8'], ['8', '1 5']], key: '7 | 4 means 74' })}
      ${steps(
        `<p><strong>Range:</strong> last leaf of the bottom row minus first leaf of the top row.</p>
         ${sum('85 − 62 = 23')}`,
        `<p><strong>Median:</strong> count the leaves: 9. The middle one is the 5th. Count from the start.</p>
         ${sum('62, 67, 70, 74, ' + now('74'))}
         ${ans('range 23, median 74')}`
      )}
      ${tip('With an even count, take the two middle values and go halfway. A leaf alone at the bottom, with empty rows above it, is an outlier.')}`,

    // 8E Q4, Q5: building a row
    '8e-build': `
      <p class="hp-tag">Worked example: <b>73, 61, 78, 70, 65, 79, 71, 62, 75</b> go in a stem-and-leaf plot. Complete the row for stem 7.</p>
      ${steps(
        `<p><strong>Split each number.</strong> The leaf is the last digit; the stem is everything in front of it. 73 is 7 | 3.</p>`,
        `<p><strong>Pick out the numbers with stem 7.</strong> Cross them off as you go.</p>
         ${chips(['73'], ['78'], ['70'], ['79'], ['71'], ['75'])}`,
        `<p><strong>Write their leaves from smallest to largest</strong>, with commas.</p>
         ${ans('0, 1, 3, 5, 8, 9')}`
      )}
      ${tip('Three-digit numbers work the same way: 236 has stem 23 and leaf 6. A value that appears twice needs its leaf written twice.')}`,

    // 8E Q6, Q8, Q9: back-to-back stem-and-leaf plots
    '8e-back': `
      <p class="hp-tag">Worked example: minutes spent on homework by two classes.</p>
      ${fig({ kind: 'stemleaf', rows: [['1', '5 8'], ['2', '0 2 6'], ['3', '1']], back: [['', '7 3'], ['', '9 4 4 1'], ['', '2']], backLabel: 'Class A', leafLabel: 'Class B', key: '2 | 6 means 26 minutes' })}
      ${steps(
        `<p><strong>Right side, as usual.</strong> Class B: 15, 18, 20, 22, 26, 31.</p>`,
        `<p><strong>Left side: read from the stem outwards.</strong> The smallest leaf sits next to the stem. The leaf still goes after the stem, so a 4 on the left of stem 2 is 24. Class A: 13, 17, 21, 24, 24, 29, 32.</p>`,
        `<p><strong>Compare.</strong></p>
         ${sum('Class A: range 32 − 13 = 19, median = 4th value = 24<br>Class B: range 31 − 15 = 16, median = (20 + 22) ÷ 2 = 21')}
         ${ans('Class A has the bigger range and the bigger median')}`
      )}
      ${tip('Never read the left leaves as backwards numbers: a 4 next to stem 2 is 24, not 42.')}`,

    // 8E Q10: missing leaves
    '8e-missing': `
      <p class="hp-tag">Worked example: test scores out of 40, with two leaves missing.</p>
      ${fig({ kind: 'stemleaf', rows: [['1', '4 7'], ['2', '2 a 5 8'], ['3', '0 b 6'], ['4', '0']], key: '3 | 6 means 36' })}
      ${steps(
        `<p><strong>Count every leaf, letters too.</strong> 2 + 4 + 3 + 1 = 10 students.</p>`,
        `<p><strong>Leaves are in order</strong>, so a missing leaf must fit between its neighbours. a sits between 2 and 5, so a can be 2, 3, 4 or 5.</p>`,
        `<p><strong>Same for b:</strong> it sits between 0 and 6.</p>
         ${ans('a: 2, 3, 4, 5')}`
      )}
      ${tip('Use the story too: a score out of 40 cannot be more than 40. "Scored 20 or more" means count from the 2 row down, letters included.')}`,

    // 8E Q14: negative stems
    '8e-negative': `
      <p class="hp-tag">Worked example: temperatures (°C) at ten weather stations.</p>
      ${fig({ kind: 'stemleaf', rows: [['−1', '8 5 2'], ['−0', '6 3'], ['0', '1 4 7'], ['1', '0 5']], key: '−1 | 5 means −15' })}
      ${steps(
        `<p><strong>On a negative stem, the minus goes on the whole number.</strong> −1 | 8 is −18. −0 | 6 is −6.</p>
         ${sum('−18, −15, −12, −6, −3, 1, 4, 7, 10, 15')}`,
        `<p><strong>Read the ends.</strong> Lowest −18, highest 15. Between −5 and 5 there are 3 values: −3, 1, 4.</p>`,
        `<p><strong>Mean and median.</strong> Add the negatives and the positives separately.</p>
         ${sum('−54 + 37 = −17, and −17 ÷ 10 = −1.7<br>median = (−3 + 1) ÷ 2 = −1')}
         ${ans('lowest -18, highest 15, mean -1.7, median -1')}`
      )}
      ${tip('Type a negative with the minus key: -18. On a negative row the biggest leaf comes first, so each row still reads smallest to largest.')}`,

    // =====================================================================
    // 8F Sector graphs and divided bar graphs
    // =====================================================================
    // 8F Q1: from percentages to bar lengths and angles
    '8f-percent': `
      <p class="hp-tag">Worked example: Sam spends his money on Food 55%, Savings 40% and Games 5%. Draw a divided bar 30 cm long and a sector graph.</p>
      ${fig({ kind: 'dividedbar', parts: [['Food (55%)', 55], ['Savings (40%)', 40], ['Games (5%)', 5]] }, { kind: 'sector', parts: [['Food (198°)', 198], ['Savings (144°)', 144], ['Games (18°)', 18]] })}
      ${steps(
        `<p><strong>Bar lengths:</strong> percentage × total length.</p>
         ${sum('0.55 × 30 = 16.5 cm<br>0.40 × 30 = 12 cm<br>0.05 × 30 = 1.5 cm')}`,
        `<p><strong>Sector angles:</strong> percentage × 360°.</p>
         ${sum('0.55 × 360 = 198°<br>0.40 × 360 = 144°<br>0.05 × 360 = 18°')}`,
        `<p><strong>Check:</strong> the lengths add to 30 cm and the angles add to 360°.</p>
         ${ans('Food: 16.5 cm and 198°')}`
      )}
      ${tip('A handy start: 1% of 360° is 3.6°. Type just the number, without cm or °.')}`,

    // 8F Q2, Q3: from counts to fractions, angles and percentages
    '8f-angles': `
      <p class="hp-tag">Worked example: some students voted for their favourite sport.</p>
      ${fig({ kind: 'table', rows: [['Sport', 'Netball', 'Soccer', 'Tennis'], ['Votes', '20', '17', '8']] })}
      ${steps(
        `<p><strong>Find the total.</strong></p>
         ${sum('20 + 17 + 8 = 45')}`,
        `<p><strong>Fraction = votes ÷ total.</strong> Simplify if you can.</p>
         ${sum('Netball: 20/45 = 4/9')}`,
        `<p><strong>Angle = fraction × 360°.</strong> A quick way: 360 ÷ 45 = 8° for each vote.</p>
         ${sum('Netball: 20 × 8 = 160°<br>Soccer: 17 × 8 = 136°<br>Tennis: 8 × 8 = 64°')}
         ${ans('4/9, 160°')}`
      )}
      ${tip('Type a fraction with a slash: 4/9. For a percentage, use fraction × 100. If two groups are combined, add their votes and their totals first.')}`,

    // 8F Q4, Q5, Q6, Q7: reading sector and divided bar graphs
    '8f-read': `
      <p class="hp-tag">Worked example: 72 students said how they get to school.</p>
      ${fig({ kind: 'sector', parts: [['Bus (150°)', 150], ['Walk (110°)', 110], ['Car (100°)', 100]] })}
      ${steps(
        `<p><strong>Find the degrees for one person.</strong></p>
         ${sum('360 ÷ 72 = 5° per student')}`,
        `<p><strong>Divide each angle by that.</strong></p>
         ${sum('Bus: 150 ÷ 5 = 30<br>Walk: 110 ÷ 5 = 22<br>Car: 100 ÷ 5 = 20')}`,
        `<p><strong>Check:</strong> 30 + 22 + 20 = 72.</p>
         ${ans('Bus 30, Walk 22, Car 20')}`
      )}
      <p><strong>Divided bars use percentages.</strong> A 15% segment out of 60 people is 0.15 × 60 = 9 people. <strong>Could the total be ...?</strong> A 45° sector is 1/8 of the circle, so the total must split into eighths with no remainder: 30 people would not work.</p>
      ${tip('A bigger sector means a bigger fraction, not always more. Half of 4 hours (2) is less than a third of 9 hours (3).')}`,

    // 8F Q8: the missing fraction of a sector graph
    '8f-fractions': `
      <p class="hp-tag">Worked example: a sector graph is red, blue and green. Red is 1/4 and blue is 1/3. What fraction is green, and how many degrees?</p>
      ${steps(
        `<p><strong>Add the fractions you know.</strong></p>
         ${sum('1/4 + 1/3 = 3/12 + 4/12 = 7/12')}`,
        `<p><strong>The whole circle is 1.</strong> Green is what is left.</p>
         ${sum('1 − 7/12 = 5/12')}`,
        `<p><strong>Degrees = fraction × 360.</strong></p>
         ${sum('5/12 × 360 = 150°')}
         ${ans('5/12, 150')}`
      )}
      ${tip('All the fractions in a sector graph add to exactly 1. If they add to more than 1, the graph cannot be drawn.')}`,

    // 8F Q9: arranging the segments
    '8f-orders': `
      <p class="hp-tag">Worked example: a divided bar has four segments, W, X, Y and Z.</p>
      ${steps(
        `<p><strong>Orders in a bar:</strong> 4 choices for the first segment, 3 for the next, then 2, then 1.</p>
         ${sum('4 × 3 × 2 × 1 = 24')}`,
        `<p><strong>In a circle, turning it gives the same graph.</strong> WXYZ, XYZW, YZWX and ZWXY are one graph turned 4 ways, so divide by 4.</p>
         ${sum('24 ÷ 4 = 6')}
         ${ans('24 bars, 6 sector graphs')}`
      )}
      ${tip('With 5 segments in a row, the middle one is the 3rd from the left.')}`,

    // =====================================================================
    // 8G Describing probability
    // =====================================================================
    // 8G Q1, Q2, Q3: chance words
    '8g-words': `
      ${flow(['0', 'Impossible'], ['under 1/2', 'Unlikely'], ['1/2', 'Even chance'], ['over 1/2', 'Likely'], ['1', 'Certain'])}
      <p class="hp-tag">Worked example: a bag has 10 counters: 5 red, 3 blue and 2 yellow. One is chosen.</p>
      ${steps(
        `<p><strong>Compare with half.</strong> Half of 10 is 5. Red is 5 out of 10: <b>even chance</b>. Blue is 3 out of 10, less than half: <b>unlikely</b>. Red or blue is 8 out of 10, more than half: <b>likely</b>.</p>`,
        `<p><strong>None or all.</strong> Green is 0 out of 10: <b>impossible</b>. Red, blue or yellow is 10 out of 10: <b>certain</b>.</p>`,
        `<p><strong>Equally likely</strong> means the same chance. Choosing red (half) is equally likely to a coin landing heads (half).</p>
         ${ans('Red: even chance. Blue: unlikely. Green: impossible.')}`
      )}
      ${tip('On a 6-sided die, half is 3 numbers. "Greater than 4" is only 5 and 6, so it is unlikely.')}`,

    // 8G Q4, Q5, Q6, Q7: describing spinners
    '8g-spinner': `
      <p class="hp-tag">Worked example: describe this spinner.</p>
      ${fig({ kind: 'spinner', labels: ['Red', 'Blue', 'Red', 'Green', 'Red', 'Blue', 'Red', 'Red'] })}
      ${steps(
        `<p><strong>Count the sections of each colour.</strong> Red 5, Blue 2, Green 1, out of 8 equal sections.</p>`,
        `<p><strong>Compare with half (4 sections).</strong> Red is more than half: likely. Blue and green are less than half: unlikely. There is no yellow: impossible.</p>`,
        `<p><strong>Compare colours.</strong> Blue has twice as many sections as green, so blue is twice as likely.</p>
         ${ans('Red is likely, blue is twice as likely as green, yellow is impossible')}`
      )}
      ${tip('Only the number of sections matters, not where they are. Two blue sections apart from each other still count together.')}`,

    // 8G Q10: what fraction of a spinner
    '8g-fraction': `
      <p class="hp-tag">Worked example: what fraction of this spinner is red?</p>
      ${fig({ kind: 'spinner', labels: ['Red', 'Blue', 'Blue', 'Red', 'Blue', 'Blue', 'Blue'] })}
      ${steps(
        `<p><strong>Count all the equal sections:</strong> 7.</p>`,
        `<p><strong>Count the red ones:</strong> 2. So red is 2 out of 7.</p>
         ${ans('2/7')}`,
        `<p><strong>Place it on the chance scale.</strong> 2/7 is more than 0 but less than 1/2, so red is unlikely.</p>`
      )}
      ${tip('Type a fraction with a slash: 2/7. For a percentage, multiply by 100: 2/7 is about 29%.')}`,

    // 8G Q8: choosing without putting back
    '8g-marbles': `
      <p class="hp-tag">Worked example: a bag has 5 red, 5 yellow and 2 blue marbles. A red marble is taken out and not put back. What colour is the next marble most likely to be?</p>
      ${steps(
        `<p><strong>Before:</strong> red and yellow both have 5, so they are equally likely.</p>`,
        `<p><strong>Write the new counts.</strong> One red has gone.</p>
         ${chips(['4 red', 'take'], ['5 yellow', 'add'], ['2 blue'])}`,
        `<p><strong>The biggest count is the most likely.</strong></p>
         ${ans('Yellow')}`
      )}
      ${tip('If a blue had been taken instead, red and yellow would still both have 5, so they would still be equally likely.')}`,

    // 8G Q9: equivalent spinners and dice
    '8g-equiv': `
      <p class="hp-tag">Worked example: a 4-sided die is weighted so that a 1 has an even chance, and 2, 3 and 4 are equally likely. Make an equivalent spinner.</p>
      ${steps(
        `<p><strong>Even chance is half.</strong> The 1 takes up 1/2 of the spinner.</p>`,
        `<p><strong>Share the other half between the rest.</strong> Three numbers share it equally.</p>
         ${sum('1/2 ÷ 3 = 1/6 each for 2, 3 and 4')}`,
        `<p><strong>Smallest number of equal sections:</strong> sixths work. The 1 gets 3 sections, and 2, 3 and 4 get one each.</p>
         ${fig({ kind: 'spinner', labels: ['1', '1', '1', '2', '3', '4'] })}
         ${ans('1/6 each; 6 sections')}`
      )}
      ${tip('Equivalent means every outcome has the same chance on both. A fair 8-sided die matches a spinner with 8 equal sections.')}`,

    // =====================================================================
    // 8H Theoretical probability in single-step experiments
    // =====================================================================
    // 8H Q1, Q2, Q3: sample space and favourable outcomes
    '8h-sample': `
      <p class="hp-tag">Worked example: a letter is chosen at random from the word <b>TIGER</b>.</p>
      ${steps(
        `<p><strong>Sample space:</strong> every possible outcome, listed once.</p>
         ${ans('T, I, G, E, R')}`,
        `<p><strong>Favourable outcomes:</strong> the ones that match the event. For "a vowel", that is I and E.</p>
         ${ans('I, E')}`,
        `<p><strong>Dice work the same way.</strong> On a 6-sided die, "a number greater than 4" has the favourable outcomes 5 and 6.</p>`
      )}
      ${tip('Type lists with commas. "Greater than 4" does not include 4 itself.')}`,

    // 8H Q4, Q5, Q6, Q7, Q8, Q9, Q12: theoretical probability
    '8h-prob': `
      <p class="hp-tag">Worked example: the letters of <b>COCONUT</b> are on 7 cards. One card is drawn.</p>
      ${steps(
        `<p><strong>Count every outcome</strong>, including repeats: C, O, C, O, N, U, T is 7 cards.</p>`,
        `<p><strong>Pr(event) = favourable outcomes ÷ total outcomes.</strong></p>
         ${sum('Pr(O) = 2/7<br>Pr(C or N) = 3/7<br>Pr(not O) = 5/7<br>Pr(Z) = 0 (impossible)')}
         ${ans('2/7')}`,
        `<p><strong>Decimal or percentage?</strong> A bag of 25 marbles has 4 red. Make the denominator 100.</p>
         ${sum('Pr(red) = 4/25 = 16/100 = 0.16 = 16%')}`
      )}
      ${tip('Type a fraction with a slash (2/7), a decimal with a point (0.16), and a percentage with % (16%). A certain event has probability 1.')}`,

    // 8H Q10: prime numbers on a changed spinner
    '8h-prime': `
      <p class="hp-tag">Worked example: a spinner has 1 to 5 in equal sections. Find Pr(prime). Then add 3 to every number and find it again.</p>
      ${steps(
        `<p><strong>List the primes.</strong> 2, 3 and 5 (1 is not prime). That is 3 out of 5.</p>
         ${sum('3/5 = 0.6')}`,
        `<p><strong>Write out the new numbers first.</strong> Adding 3 gives 4, 5, 6, 7, 8. The primes are 5 and 7.</p>
         ${sum('2/5 = 0.4')}
         ${ans('0.6, then 0.4')}`
      )}
      ${tip('Primes up to 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. The only even prime is 2.')}`,

    // 8H Q11, Q14: from probabilities to numbers of counters
    '8h-counts': `
      <p class="hp-tag">Worked example: a bag of 40 counters has Pr(red) = 1/2 and Pr(blue) = 1/8. The rest are green.</p>
      ${steps(
        `<p><strong>Find each count:</strong> fraction × total.</p>
         ${sum('red: 1/2 of 40 = 20<br>blue: 1/8 of 40 = 5<br>green: 40 − 25 = 15')}
         ${ans('20, 5, 15')}`,
        `<p><strong>Probability of the rest.</strong></p>
         ${sum('Pr(green) = 15/40 = 3/8<br>check: 1 − 1/2 − 1/8 = 3/8')}`,
        `<p><strong>Smallest possible bag:</strong> the total must split into halves and eighths, so it is a multiple of both 2 and 8. The smallest is 8.</p>`
      )}
      ${tip('Change a percentage to a fraction first: 30% = 3/10. The largest multiple of 8 under 100 is 96.')}`,

    // 8H Q13: Pr(happens) + Pr(does not happen) = 1
    '8h-complement': `
      <p class="hp-tag">Worked example: Pr(rain tomorrow) = 3/10. Find Pr(no rain).</p>
      ${steps(
        `<p><strong>It either rains or it does not.</strong> So the two probabilities add to 1.</p>`,
        `<p><strong>Take it away from 1.</strong> Write 1 with the same denominator.</p>
         ${sum('1 − 3/10 = 10/10 − 3/10 = 7/10')}
         ${ans('7/10')}`
      )}
      <p><strong>Same idea with letters.</strong> From TRACTOR, Pr(vowel) = 2/7 (A and O), so Pr(consonant) = 5/7.</p>
      ${tip('Pr(happens) + Pr(does not happen) = 1, every time.')}`,

    // 8H Q15: do the probabilities add to 1?
    '8h-possible': `
      <p class="hp-tag">Worked example: a spinner has only red, green and blue. Could Pr(red) = 1/2, Pr(green) = 1/4 and Pr(blue) = 1/6?</p>
      ${steps(
        `<p><strong>Add them with a common denominator.</strong></p>
         ${sum('6/12 + 3/12 + 2/12 = 11/12')}`,
        `<p><strong>Compare with 1.</strong> The colours cover the whole spinner, so they must add to exactly 1. 11/12 is less than 1, so no.</p>
         ${ans('No, the probabilities add to less than 1')}`
      )}
      <p><strong>Decimals:</strong> 0.3 + 0.5 + 0.2 = 1, so those would work. <strong>With letters:</strong> if Pr(win) = w, then Pr(not win) = 1 − w, typed as 1-w.</p>
      ${tip('More than 1 or less than 1 both mean it is impossible.')}`,

    // =====================================================================
    // 8I Experimental probability in single-step experiments
    // =====================================================================
    // 8I Q1, Q2, Q6, Q7: experimental probability from results
    '8i-exp': `
      <p class="hp-tag">Worked example: a canteen recorded its lunch sales.</p>
      ${fig({ kind: 'table', rows: [['Lunch', 'Pie', 'Wrap', 'Sushi', 'Salad'], ['Number sold', '9', '12', '4', '5']] })}
      ${steps(
        `<p><strong>Find the total.</strong></p>
         ${sum('9 + 12 + 4 + 5 = 30')}`,
        `<p><strong>Experimental probability = times it happened ÷ total.</strong> Simplify.</p>
         ${sum('Pr(wrap) = 12/30 = 2/5<br>Pr(pie or salad) = 14/30 = 7/15')}`,
        `<p><strong>Expected number:</strong> probability × new total. In 250 sales:</p>
         ${sum('2/5 × 250 = 100 wraps')}
         ${ans('2/5')}`
      )}
      ${tip('From a list of results, tally each outcome first. Type a fraction with a slash: 2/5.')}`,

    // 8I Q3, Q4: expected results for a fair experiment
    '8i-expect': `
      <p class="hp-tag">Worked example: a fair spinner has 5 equal sections, and 1 of them is green.</p>
      ${steps(
        `<p><strong>Theoretical probability:</strong> Pr(green) = 1/5.</p>`,
        `<p><strong>Expected number = probability × number of spins.</strong> In 400 spins:</p>
         ${sum('1/5 × 400 = 80')}`,
        `<p><strong>Working backwards:</strong> in 40 spins, how many greens give an experimental probability of 0.3?</p>
         ${sum('0.3 × 40 = 12')}
         ${ans('80, 12')}`
      )}
      ${tip('Expected is a best guess, not a promise: other results are possible. More trials usually bring the experimental probability closer to the true one. With very few trials, odd results like 100% happen much more easily.')}`,

    // 8I Q5, Q10: simulations
    '8i-sim': `
      <p class="hp-tag">Worked example: a footy player kicks a goal 2 times in 3. A die simulates her kicks: 1 to 4 is a goal, 5 or 6 is a miss. The rolls are <b>3, 6, 1, 4, 5, 2, 2, 6, 1</b>.</p>
      ${steps(
        `<p><strong>Mark the rolls that mean a goal</strong> (1 to 4).</p>
         ${chips(['3', 'add'], ['6', 'take'], ['1', 'add'], ['4', 'add'], ['5', 'take'], ['2', 'add'], ['2', 'add'], ['6', 'take'], ['1', 'add'])}`,
        `<p><strong>Experimental probability:</strong> 6 goals out of 9 rolls.</p>
         ${sum('6/9 = 2/3')}`,
        `<p><strong>Theoretical probability:</strong> 4 goal numbers out of 6.</p>
         ${sum('4/6 = 2/3')}
         ${ans('2/3')}`
      )}
      ${tip('"At least 3" means 3 or more, so add up the counts for 3 and everything above it. More repeats of a simulation give more accurate results.')}`,

    // 8I Q8, Q9: what is in the bag, or on the spinner?
    '8i-bag': `
      <p class="hp-tag">Worked example: a bag holds 5 counters. One is drawn and put back, 50 times: red 31, blue 19. How many of each colour are likely in the bag?</p>
      ${steps(
        `<p><strong>Experimental probability of each.</strong></p>
         ${sum('red: 31/50 = 0.62<br>blue: 19/50 = 0.38')}`,
        `<p><strong>Multiply by the number of counters.</strong></p>
         ${sum('red: 0.62 × 5 = 3.1, about 3<br>blue: 0.38 × 5 = 1.9, about 2')}
         ${ans('3 red, 2 blue')}`
      )}
      ${tip('A colour that came up even once must be in the bag, and the counts must add to the bag size. For spinners: a colour with 0 results is probably not on it, and about a quarter of the results means about a quarter of the spinner.')}`,

    // 8I Q11: experimental versus theoretical
    '8i-theory': `
      <p class="hp-tag">Worked example: a fair coin is flipped 10 times and lands heads 7 times.</p>
      ${steps(
        `<p><strong>Experimental probability</strong> is what happened this time: 7/10.</p>`,
        `<p><strong>Theoretical probability</strong> is what should happen in the long run: 1/2. The coin is still fair. Short experiments often miss the true value.</p>
         ${ans('experimental 7/10, theoretical 1/2')}`
      )}
      ${tip('For a "must" statement, try to think of one case where it fails. One case is enough to make it false. Remember: a probability of 0 means it can never happen.')}`,

    // 8I Q12: combining several sets of results
    '8i-combine': `
      <p class="hp-tag">Worked example: a spinner is spun in 4 sets of 50.</p>
      ${fig({ kind: 'table', rows: [['Set of 50 spins', 'Red', 'Green', 'Blue'], ['First', '7', '31', '12'], ['Second', '4', '28', '18'], ['Third', '5', '30', '15'], ['Fourth', '6', '29', '15']] })}
      ${steps(
        `<p><strong>Use all the results.</strong> Add each colour down its column. There are 200 spins in total.</p>
         ${sum('red 22, green 118, blue 60')}`,
        `<p><strong>Divide by the total spins.</strong></p>
         ${sum('22 ÷ 200 = 0.11<br>118 ÷ 200 = 0.59<br>60 ÷ 200 = 0.3')}`,
        `<p><strong>Design a 10-sector spinner:</strong> multiply by 10 and round.</p>
         ${sum('1.1 → 1, 5.9 → 6, 3 → 3 (check: 1 + 6 + 3 = 10)')}
         ${ans('0.11, 0.59, 0.3; 1 red, 6 green, 3 blue')}`
      )}
      ${tip('More spins give a better estimate. The set furthest from the overall estimate is the least accurate one.')}`
  });
})();
