/* H3 help panels for Year 8 Chapter 6. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 6A to 6G. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // The distance-speed-time triangle: cover the one you want.
  const dst = () => fig({ kind: 'diagram', unit: 46, alt: 'A triangle split into D on top, S and T underneath', caption: 'Cover the one you want', items: [
    { poly: [[0, 0], [4, 0], [2, 3]] },
    { seg: [0.667, 1, 3.333, 1] },
    { seg: [2, 0, 2, 1] },
    { label: 'D', at: [2, 1.75] },
    { label: 'S', at: [1.25, 0.4] },
    { label: 'T', at: [2.75, 0.4] }
  ] });

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 6A Simplifying ratios
    // =====================================================================
    // Y8 6A Q1: missing numbers in equivalent ratios
    'y8-6a-equiv': `
      <p class="hp-tag">Worked example: find the missing numbers. <b>2 : 7 = 10 : □</b> and <b>5 : 8 = □ : 32</b></p>
      ${steps(
        `<p><strong>Find what the known part was multiplied by.</strong> The first parts go from 2 to 10.</p>
         ${sum(`${now('2 × 5')} = 10`)}`,
        `<p><strong>Do the same to the other part.</strong></p>
         ${sum('7 × 5 = 35')}
         ${ans('35')}`,
        `<p><strong>Second one: look at the parts you know.</strong> The second parts go from 8 to 32, which is × 4. So the first part is 5 × 4.</p>
         ${ans('20')}`
      )}
      ${tip('Equivalent ratios work like equivalent fractions: multiply or divide every part by the same number. Type just the missing number.')}`,

    // Y8 6A Q2, Q3: simplifying two- and three-part ratios
    'y8-6a-simplify': `
      <p class="hp-tag">Worked example: simplify <b>44 : 66</b>, then <b>12 : 30 : 42</b></p>
      ${steps(
        `<p><strong>Find the highest common factor (HCF) of the parts.</strong> 44 = 2 × 22 and 66 = 3 × 22, so the HCF is 22. Divide both parts by it.</p>
         ${sum('44 ÷ 22 : 66 ÷ 22 = 2 : 3')}
         ${ans('2:3')}`,
        `<p><strong>Three parts: find a number that divides all three.</strong> 6 goes into 12, 30 and 42.</p>
         ${sum('12 ÷ 6 : 30 ÷ 6 : 42 ÷ 6 = 2 : 5 : 7')}
         ${ans('2:5:7')}`,
        `<p><strong>Big numbers? Divide in stages</strong> until nothing divides every part. For 1400 : 3500, first divide by 100, then by 7.</p>
         ${sum('1400 : 3500 = 14 : 35 = 2 : 5')}`
      )}
      ${tip('Type a ratio with colons, like 2:5:7. Order matters: 2:3 is not the same as 3:2. Simplest form means whole numbers with no common factor except 1.')}`,

    // Y8 6A Q4, Q7, Q15: ratios with fractions, mixed numerals and decimals
    'y8-6a-fractions': `
      <p class="hp-tag">Worked example: simplify <b>2/5 : 3/4</b>, then <b>1 2/3 : 3/4</b></p>
      ${steps(
        `<p><strong>Write both fractions over a common denominator.</strong> The lowest common multiple of 5 and 4 is 20.</p>
         ${sum('2/5 : 3/4 = 8/20 : 15/20')}`,
        `<p><strong>Multiply both parts by 20.</strong> The denominators disappear and only the tops are left.</p>
         ${ans('8:15')}`,
        `<p><strong>Mixed numeral? Make it improper first.</strong> 1 2/3 = 5/3. A whole number is a fraction over 1, like 2 = 2/1.</p>
         ${sum('5/3 : 3/4 = 20/12 : 9/12 = 20 : 9')}
         ${ans('20:9')}`
      )}
      <p><strong>Decimals:</strong> multiply until both parts are whole. 1.75 : 1 → × 4 → 7 : 4. A recurring decimal becomes a fraction first: 1.333... = 1 1/3 = 4/3, so 1.333... : 1 = 4/3 : 1 = 4 : 3.</p>
      ${tip('The answer must use whole numbers only, no fractions or decimals left. Type 20:9, not 5/3:3/4.')}`,

    // Y8 6A Q5, Q8, Q9, Q10: ratios from a story
    'y8-6a-words': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">In a class of <span class="hp-hl">30</span> students, <span class="hp-hl">12</span> walk to school, <span class="hp-hl">8</span> ride a bike and the rest come by car. Write the ratio of (a) walkers to bike riders, (b) bike riders to the whole class, (c) walkers to students who do not walk.</p>
      ${steps(
        `<p><strong>Work out any missing amount first.</strong></p>
         ${sum('by car: 30 − 12 − 8 = 10')}`,
        `<p><strong>Write the amounts in the order the words say</strong>, then simplify.</p>
         ${sum('(a) 12 : 8 = 3 : 2<br>(b) 8 : 30 = 4 : 15')}`,
        `<p><strong>"Do not walk" means everyone else:</strong> bike plus car, 8 + 10 = 18.</p>
         ${sum('(c) 12 : 18 = 2 : 3')}
         ${ans('3:2, 4:15, 2:3')}`
      )}
      <p><strong>Making more?</strong> Multiply every amount. Doubling a recipe of 2 eggs, 5 cups of flour and 1 cup of sugar gives 4, 10 and 2. Type a list of amounts with commas, in the order asked.</p>
      ${tip('When the question says "simplest form", divide by the HCF. When it does not, 8:30 and 4:15 are both marked right.')}`,

    // Y8 6A Q6, Q11, Q12, Q13: change to the same unit first
    'y8-6a-units': `
      <p class="hp-tag">Worked example: write as ratios in simplest form: <b>18 cm to 1.2 m</b>, and <b>$1.60 to 36 cents</b></p>
      ${chips(['1 m = 100 cm'], ['1 cm = 10 mm'], ['1 km = 1000 m'], ['1 kg = 1000 g'], ['1 L = 1000 mL'], ['1 h = 60 min'], ['1 day = 24 h'], ['$1 = 100 c'])}
      ${steps(
        `<p><strong>Change both to the same unit.</strong> The smaller unit avoids decimals: 1.2 m = 120 cm.</p>
         ${sum('18 cm : 120 cm → 18 : 120')}`,
        `<p><strong>Now simplify.</strong> The HCF of 18 and 120 is 6.</p>
         ${sum('18 ÷ 6 : 120 ÷ 6 = 3 : 20')}
         ${ans('3:20')}`,
        `<p><strong>Money works the same way.</strong> $1.60 = 160 cents.</p>
         ${sum('160 : 36 = 40 : 9 &nbsp;(÷ 4)')}
         ${ans('40:9')}`
      )}
      ${tip('The units must match before you simplify. Leave the units out of the answer: type 3:20. Using metres or centimetres gives the same simplified ratio.')}`,

    // Y8 6A Q14: ratios with letters
    'y8-6a-algebra': `
      <p class="hp-tag">Worked example: simplify <b>6x : 15y</b>, <b>8pq : 12q</b> and <b>k² : 4k</b></p>
      ${steps(
        `<p><strong>Divide the numbers by their HCF.</strong> Different letters stay where they are.</p>
         ${sum('6x : 15y = 2x : 5y &nbsp;(÷ 3)')}`,
        `<p><strong>A letter in every part is a common factor too.</strong> Divide it out.</p>
         ${sum('8pq : 12q = 2p : 3 &nbsp;(÷ 4q)')}`,
        `<p><strong>k² means k × k.</strong> Both parts have a k, so divide by k.</p>
         ${sum('k² : 4k = k : 4')}
         ${ans('2x:5y, 2p:3, k:4')}`
      )}
      ${tip('Type the letter straight after its number, with a colon between parts, like 2x:5y. If every letter cancels, you are left with plain numbers, like 5:9.')}`,

    // =====================================================================
    // 6B Solving ratio problems
    // =====================================================================
    // Y8 6B Q1, Q2, Q3, Q4, Q7, Q8, Q12, Q13: one amount is known
    'y8-6b-onepart': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Cordial and water are mixed in the ratio <span class="hp-hl">4 : 11</span>. (a) How much water goes with 20 mL of cordial? (b) How much drink does that make? (c) How much cordial goes with 33 mL of water?</p>
      ${fig({ kind: 'bar', parts: 15, shaded: 4, caption: 'cordial 4 parts : water 11 parts' })}
      ${steps(
        `<p><strong>Find the size of one part.</strong> Cordial is 4 parts, and that is 20 mL.</p>
         ${sum('1 part = 20 ÷ 4 = 5 mL')}`,
        `<p><strong>Multiply for the part you want.</strong> Water is 11 parts. The whole drink is 4 + 11 = 15 parts.</p>
         ${sum('(a) 11 × 5 = 55 mL<br>(b) 15 × 5 = 75 mL')}`,
        `<p><strong>The other way works the same.</strong> 11 parts = 33 mL, so 1 part = 3 mL.</p>
         ${sum('(c) 4 × 3 = 12 mL')}
         ${ans('55, 75, 12')}`
      )}
      <p><strong>Given a difference?</strong> If there is 42 mL more water than cordial, that gap is 11 − 4 = 7 parts. So 1 part = 6 mL: 24 mL of cordial and 66 mL of water.</p>
      ${tip('Type just the number: the unit is beside the box. Three-part ratios work the same way: find one part, then multiply.')}`,

    // Y8 6B Q5, Q6, Q9, Q10, Q11, Q14, Q15: dividing a total in a ratio
    'y8-6b-divide': `
      <p class="hp-tag">Worked example: divide <b>$104 in the ratio 5 : 3</b>, then <b>72 kg in the ratio 2 : 3 : 4</b></p>
      ${fig({ kind: 'bar', parts: 8, shaded: 5, caption: '$104 shared into 5 + 3 = 8 equal parts' })}
      ${steps(
        `<p><strong>Add the parts</strong> to find how many equal shares there are.</p>
         ${sum('5 + 3 = 8 parts')}`,
        `<p><strong>Find one part.</strong></p>
         ${sum('104 ÷ 8 = 13')}`,
        `<p><strong>Multiply each number in the ratio by one part.</strong> Check they add back to the total.</p>
         ${sum('5 × 13 = 65 and 3 × 13 = 39<br>65 + 39 = 104 ✓')}
         ${ans('65, 39')}`
      )}
      <p><strong>Three parts:</strong> 2 + 3 + 4 = 9 parts, and 72 ÷ 9 = 8, so the shares are 16, 24 and 32 kg.</p>
      ${tip('Type the amounts in the same order as the ratio, separated by commas, like 65, 39. With whole-number shares in the ratio 5 : 3, the total must be a multiple of 8.')}`,

    // Y8 6B Q16: ratios of ages
    'y8-6b-ages': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Lily is <span class="hp-hl">12</span> years older than her brother Sam. Find the ratio of Sam's age to Lily's when Sam is 3, and a year later. How old are they when the ratio is 1 : 2?</p>
      ${steps(
        `<p><strong>Write the ages, then simplify.</strong></p>
         ${sum('Sam 3, Lily 15: 3 : 15 = 1 : 5<br>A year later: 4 : 16 = 1 : 4')}`,
        `<p><strong>The age gap never changes.</strong> In the ratio 1 : 2 the gap is 2 − 1 = 1 part, so 1 part is 12 years.</p>
         ${sum('Sam 1 × 12 = 12, Lily 2 × 12 = 24')}
         ${ans('12, 24')}`,
        `<p><strong>Check with another ratio.</strong> For 1 : 4 the gap is 3 parts, so 1 part = 12 ÷ 3 = 4: Sam 4, Lily 16. That matches step 1 ✓.</p>`
      )}
      ${tip('Type both ages in the order asked, separated by a comma. Simplest form for a ratio of ages works like any other ratio: 4:16 becomes 1:4.')}`,

    // Y8 6B Q17: sharing by time worked, rounding to the cent
    'y8-6b-shares': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ana, Ben and Cy share a <span class="hp-hl">$100</span> prize in the ratio of the hours they worked: Ana <span class="hp-hl">1 1/2</span> h, Ben <span class="hp-hl">3</span> h, Cy <span class="hp-hl">4</span> h.</p>
      ${steps(
        `<p><strong>Make the ratio whole numbers.</strong> Double everything to clear the half.</p>
         ${sum('1 1/2 : 3 : 4 = 3 : 6 : 8')}
         ${ans('3:6:8')}`,
        `<p><strong>Find one part, and keep every digit</strong> on your calculator.</p>
         ${sum('3 + 6 + 8 = 17 parts<br>100 ÷ 17 = 5.88235...')}`,
        `<p><strong>Multiply, then round each share to the nearest cent.</strong></p>
         ${sum('Ana 3 × 5.88235... = 17.647... → 17.65<br>Ben 6 × 5.88235... = 35.294... → 35.29<br>Cy 8 × 5.88235... = 47.058... → 47.06')}
         ${ans('17.65, 35.29, 47.06')}`
      )}
      <p><strong>Comparing two ways of sharing?</strong> Subtract the rounded amounts, as the question asks.</p>
      ${tip('Nearest cent means 2 decimal places, typed like 35.29. Do not round the one-part value early, or the shares drift. Check the shares add to the prize.')}`,

    // =====================================================================
    // 6C Scale drawings
    // =====================================================================
    // Y8 6C Q1, Q2, Q6, Q7, Q8, Q9: drawing length to real length
    'y8-6c-actual': `
      <p class="hp-tag">Worked example: a map has a scale of <b>1 : 35 000</b>. Two schools are <b>7 cm</b> apart on the map. How far apart are they in kilometres?</p>
      ${steps(
        `<p><strong>Multiply by the scale factor.</strong> Keep the map's unit for now.</p>
         ${sum('7 × 35 000 = 245 000 cm')}`,
        `<p><strong>Convert to the unit asked.</strong></p>
         ${flow(['cm', '245 000'], ['÷ 100 → m', '2450'], ['÷ 1000 → km', '2.45'])}
         ${ans('2.45')}`,
        `<p><strong>A plan works the same way.</strong> With scale 1 : 50, a wall 9 cm long on the plan is 9 × 50 = 450 cm = 4.5 m in real life.</p>`
      )}
      ${tip('Drawing to real life: multiply. Type just the number in the unit asked. On a diagram, read each length from its label, and round only at the end if asked.')}`,

    // Y8 6C Q3, Q4, Q14: real length to drawing length
    'y8-6c-scaled': `
      <p class="hp-tag">Worked example: a drawing has a scale of <b>1 : 2000</b>. A real path is <b>90 m</b> long. How long is it on the drawing, in centimetres?</p>
      ${steps(
        `<p><strong>Change the real length into the unit asked.</strong></p>
         ${sum('90 m = 90 × 100 = 9000 cm')}`,
        `<p><strong>Divide by the scale factor.</strong></p>
         ${sum('9000 ÷ 2000 = 4.5 cm')}
         ${ans('4.5')}`,
        `<p><strong>A scale like 1 : 0.5 makes the drawing bigger.</strong> A real length of 3 mm becomes 3 ÷ 0.5 = 6 mm. Dividing by a number less than 1 gives a bigger answer.</p>`
      )}
      ${tip('Real life to drawing: divide. Convert units first, so the answer comes out in the unit the question wants.')}`,

    // Y8 6C Q5, Q10, Q11: finding the scale factor
    'y8-6c-factor': `
      <p class="hp-tag">Worked example: (a) <b>3 cm</b> on a map stands for <b>2.7 km</b>. (b) A <b>4 mm</b> insect is drawn <b>6 cm</b> long. Find each scale factor.</p>
      ${steps(
        `<p><strong>Put both lengths in the same unit.</strong></p>
         ${sum('2.7 km = 2700 m = 270 000 cm')}`,
        `<p><strong>Scale factor = real length ÷ drawing length.</strong></p>
         ${sum('270 000 ÷ 3 = 90 000, so the scale is 1 : 90 000')}
         ${ans('90000')}`,
        `<p><strong>Drawing bigger than real life?</strong> 6 cm = 60 mm. The same division gives a fraction.</p>
         ${sum('4 ÷ 60 = 1/15, so the scale factor is 1/15')}
         ${ans('1/15')}`
      )}
      <p><strong>Use the unitary method</strong> when the map length is awkward. If 2 1/2 cm stands for 30 km, then 1 cm stands for 30 ÷ 2.5 = 12 km. So 7 cm stands for 84 km, and 54 km needs 54 ÷ 12 = 4.5 cm.</p>
      ${tip('Type a fraction scale factor like 1/15. Big numbers can be typed with or without a space: 90000 or 90 000.')}`,

    // Y8 6C Q12, Q13, Q15: equivalent scales and choosing a scale
    'y8-6c-choose': `
      <p class="hp-tag">Worked example: (a) which ratio is equivalent to <b>1 : 0.05</b>? (b) Which scale draws a <b>13 m</b> whale about 20 to 30 cm long? (c) A <b>5 mm</b> seed looks <b>35 cm</b> long through a lens. Write the scale.</p>
      ${steps(
        `<p><strong>Make the parts whole.</strong> Multiply both by 20: 1 : 0.05 = 20 : 1. And 60 : 3 is also 20 : 1 (÷ 3), so they are equivalent.</p>`,
        `<p><strong>Try each scale on the real length</strong> in centimetres: 13 m = 1300 cm.</p>
         ${sum('1 : 10 → 130 cm (too big)<br>1 : 50 → 26 cm ✓<br>1 : 100 → 13 cm (too small)')}`,
        `<p><strong>Scale is drawing : real, in the same unit.</strong> 35 cm = 350 mm.</p>
         ${sum('350 : 5 = 70 : 1')}
         ${ans('20 : 1, 1 : 50, 70 : 1')}`
      )}
      ${tip('When the picture is bigger than the real thing, the first number in the scale is the bigger one, like 70 : 1.')}`,

    // =====================================================================
    // 6D Introducing rates
    // =====================================================================
    // Y8 6D Q1, Q2, Q6, Q10: writing a simplified rate
    'y8-6d-simplify': `
      <p class="hp-tag">Worked example: write as simplified rates: (a) <b>$56 for 8 kg</b>, (b) <b>20 minutes to cycle 8 km</b>, (c) <b>8 km cycled in 20 minutes</b></p>
      ${steps(
        `<p><strong>"Per" means divide by the second quantity.</strong> Dollars per kilogram:</p>
         ${sum('56 ÷ 8 = 7, so $7/kg')}`,
        `<p><strong>The order matters.</strong> Check which unit goes on the bottom.</p>
         ${sum('(b) minutes per km: 20 ÷ 8 = 2.5 min/km<br>(c) km per minute: 8 ÷ 20 = 0.4 km/min')}
         ${ans('7, 2.5, 0.4')}`,
        `<p><strong>(b) and (c) are flips of each other.</strong> 1 ÷ 2.5 = 0.4, and 1 ÷ 0.4 = 2.5.</p>`
      )}
      ${tip('The units beside the answer box tell you what to divide: km/min means km ÷ minutes. Type just the number, like 2.5.')}`,

    // Y8 6D Q3, Q4, Q5, Q7, Q9, Q13: average rate of change, then using it
    'y8-6d-average': `
      <p class="hp-tag">Worked example: a town grew from <b>4200</b> to <b>5400</b> people in <b>6 years</b>. (a) Find the average rate of growth. (b) At this rate, how many more years until it has 7400 people?</p>
      ${steps(
        `<p><strong>Find the change.</strong></p>
         ${sum('5400 − 4200 = 1200 people')}`,
        `<p><strong>Average rate = change ÷ time.</strong></p>
         ${sum('1200 ÷ 6 = 200 people/year')}
         ${ans('200')}`,
        `<p><strong>Use the rate.</strong> 7400 − 5400 = 2000 more people are needed, at 200 each year.</p>
         ${sum('2000 ÷ 200 = 10 years')}
         ${ans('10')}`
      )}
      <p><strong>Start plus growth:</strong> a 15 cm plant growing 3 cm/week is 15 + 3 × 8 = 39 cm after 8 weeks. <strong>Per day for a week:</strong> add the seven days, then divide by 7.</p>
      ${tip('A drop is still written as a positive rate: falling 10°C in 4 hours is 2.5 °C/h. Type just the number.')}`,

    // Y8 6D Q8, Q11: comparing paces
    'y8-6d-compare': `
      <p class="hp-tag">Worked example: Ben ran <b>4 km</b> in <b>22 min 12 s</b>. Jo ran <b>5 km</b> in <b>28 min 15 s</b>. Find each pace in min/km. Who was faster?</p>
      ${steps(
        `<p><strong>Change the seconds into part of a minute.</strong> Divide by 60.</p>
         ${sum('12 s = 12/60 = 0.2 min, so 22.2 min<br>15 s = 15/60 = 0.25 min, so 28.25 min')}`,
        `<p><strong>Minutes per km = minutes ÷ km.</strong></p>
         ${sum('Ben: 22.2 ÷ 4 = 5.55 min/km<br>Jo: 28.25 ÷ 5 = 5.65 min/km')}`,
        `<p><strong>Fewer minutes for each km means faster.</strong></p>
         ${ans('5.55, 5.65, Ben')}`
      )}
      ${tip('For min/km, smaller is faster. For km/h, bigger is faster. Type the pace as a decimal, like 5.55, not as minutes and seconds.')}`,

    // Y8 6D Q12: charges that change after a time
    'y8-6d-tiers': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Plan A charges <span class="hp-hl">50c/min</span> for the first 5 minutes, then <span class="hp-hl">30c/min</span> after that. Plan B charges a flat <span class="hp-hl">40c/min</span>.</p>
      ${steps(
        `<p><strong>Split the call into its price bands.</strong> An 8 minute call on Plan A:</p>
         ${sum('5 × $0.50 + 3 × $0.30 = $2.50 + $0.90 = $3.40<br>Plan B: 8 × $0.40 = $3.20')}`,
        `<p><strong>Average charge per minute = total ÷ minutes.</strong></p>
         ${sum('340c ÷ 8 = 42.5 c/min')}`,
        `<p><strong>When do they cost the same?</strong> Try a few lengths and look for the match.</p>
         ${sum('10 min: A = $2.50 + 5 × $0.30 = $4.00<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B = 10 × $0.40 = $4.00 ✓')}
         ${ans('3.40, 3.20, 42.5, 10')}`
      )}
      ${tip('Dollar answers: type 3.40 (or 3.4), the $ is shown. A cents answer is just the number of cents. The cheaper plan can change as calls get longer.')}`,


    // =====================================================================
    // 6E Solving rate problems
    // =====================================================================
    // Y8 6E Q1, Q2, Q3, Q4, Q5, Q6, Q7: using a rate
    'y8-6e-use': `
      <p class="hp-tag">Worked example: a printer prints <b>24 pages per minute</b>. (a) How many pages in 15 minutes? (b) How long for 1080 pages? (c) How many pages in 40 seconds?</p>
      ${steps(
        `<p><strong>Want the amount? Multiply the rate by the time.</strong></p>
         ${sum('(a) 24 × 15 = 360 pages')}`,
        `<p><strong>Want the time? Divide the amount by the rate.</strong></p>
         ${sum('(b) 1080 ÷ 24 = 45 minutes')}`,
        `<p><strong>Make the time units match the rate.</strong> 40 s is 40/60 = 2/3 of a minute.</p>
         ${sum('(c) 24 × 2/3 = 16 pages')}
         ${ans('360, 45, 16')}`
      )}
      ${tip('Read the rate\'s units: pages per minute needs the time in minutes. Hours to minutes: × 60. Type just the number.')}`,

    // Y8 6E Q8, Q9: rates for areas and volumes
    'y8-6e-measure': `
      <p class="hp-tag">Worked example: (a) carpet costs <b>$35 per m²</b>. How much for a room <b>6 m by 4.5 m</b>? (b) A tank is <b>2 m long, 1.5 m wide and 1 m deep</b>. It needs <b>2 kg</b> of salt for every <b>5000 L</b>.</p>
      ${steps(
        `<p><strong>Find the area first, then use the rate.</strong></p>
         ${sum('6 × 4.5 = 27 m²<br>27 × 35 = $945')}`,
        `<p><strong>Volume next, then change to litres.</strong> 1 m³ holds 1000 L.</p>
         ${sum('2 × 1.5 × 1 = 3 m³ = 3000 L')}`,
        `<p><strong>Compare with the rate's amount.</strong> 3000 L is 3000 ÷ 5000 = 0.6 of 5000 L.</p>
         ${sum('0.6 × 2 = 1.2 kg')}
         ${ans('945, 1.2')}`
      )}
      ${tip('Area = length × width. Volume = length × width × depth. Type money without the $, it is shown beside the box.')}`,

    // Y8 6E Q10: a race with a head start
    'y8-6e-race': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Two robots race <span class="hp-hl">4 km</span>. Rex travels at <span class="hp-hl">8 km/min</span> and Dot at <span class="hp-hl">6 km/min</span>. Rex gives Dot a <span class="hp-hl">12 second</span> head start. Who wins, and by how much?</p>
      ${steps(
        `<p><strong>Time = distance ÷ speed.</strong> Change to seconds (× 60).</p>
         ${sum('Rex: 4 ÷ 8 = 0.5 min = 30 s<br>Dot: 4 ÷ 6 = 2/3 min = 40 s')}`,
        `<p><strong>Add the waiting time to the one who starts late.</strong> Rex waits 12 s, so he finishes at 30 + 12 = 42 s after Dot starts.</p>`,
        `<p><strong>Compare finishing times.</strong> Dot finishes at 40 s, Rex at 42 s.</p>
         ${ans('Dot, by 2 seconds')}`
      )}
      ${tip('Put every time in the same unit as the head start before you compare.')}`,

    // Y8 6E Q11, Q14, Q15: more people, less time (and two changes at once)
    'y8-6e-inverse': `
      <p class="hp-tag">Worked example: a hut has enough food for <b>40 hikers for 9 days</b>. (a) How long would it last 30 hikers? (b) The food lasted only 8 days. How many hikers were there?</p>
      ${steps(
        `<p><strong>Find the total in "hiker-days".</strong></p>
         ${sum('40 × 9 = 360 hiker-days')}`,
        `<p><strong>More hikers means fewer days, so divide.</strong></p>
         ${sum('(a) 360 ÷ 30 = 12 days<br>(b) 360 ÷ 8 = 45 hikers')}
         ${ans('12, 45')}`,
        `<p><strong>Two things changing? Find the rate for one of each.</strong> 9 bales feed 6 cows for 1 day, so one cow eats 9 ÷ 6 = 1.5 bales a day. For 4 cows for 7 days:</p>
         ${sum('1.5 × 4 × 7 = 42 bales')}`
      )}
      <p><strong>Same-number puzzles:</strong> if 3 cooks bake 3 cakes in 3 hours, one cook bakes one cake in 3 hours. So 2 cooks baking 8 cakes make 4 each, which takes 4 × 3 = 12 hours.</p>
      ${tip('Ask: does more of this mean more or less of that? More hikers, fewer days: divide. More cows, more bales: multiply.')}`,

    // Y8 6E Q12, Q13: working together
    'y8-6e-together': `
      <p class="hp-tag">Worked example: pump A fills a pool in <b>4 hours</b>. Pump B fills it in <b>12 hours</b>. How long do they take together? What fraction does each pump fill?</p>
      ${steps(
        `<p><strong>Find the fraction of the job each does in 1 hour.</strong></p>
         ${sum('A: 1/4 of the pool per hour<br>B: 1/12 of the pool per hour')}`,
        `<p><strong>Add them</strong> using a common denominator.</p>
         ${sum('1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 per hour')}
         <p>A third each hour means the whole pool takes 3 hours.</p>`,
        `<p><strong>Each share = its rate × the time.</strong></p>
         ${sum('A: 3 × 1/4 = 3/4 &nbsp; B: 3 × 1/12 = 1/4 &nbsp; (3/4 + 1/4 = 1 ✓)')}
         ${ans('3, 3/4, 1/4')}`
      )}
      ${tip('Type fractions in simplest form, like 3/4. The shares of the job must add to 1.')}`,

    // Y8 6E Q16: best value in $/L
    'y8-6e-value': `
      <p class="hp-tag">Worked example: milk is sold in these sizes. Find each price in $/L, and the cost of 12 L using only the 2 L bottles.</p>
      ${fig({ kind: 'table', rows: [['Size', 'Price'], ['750 mL bottle', '$3.15 each'], ['2 L bottle', '$6.20 each'], ['6 × 375 mL cartons', '$7.65 per pack']] })}
      ${steps(
        `<p><strong>Change every size to litres.</strong></p>
         ${sum('750 mL = 0.75 L<br>6 × 375 mL = 2250 mL = 2.25 L')}`,
        `<p><strong>$/L = price ÷ litres.</strong></p>
         ${sum('3.15 ÷ 0.75 = 4.20<br>6.20 ÷ 2 = 3.10<br>7.65 ÷ 2.25 = 3.40')}`,
        `<p><strong>Buying an amount: count the bottles, then multiply.</strong></p>
         ${sum('12 ÷ 2 = 6 bottles, 6 × $6.20 = $37.20')}
         ${ans('4.20, 3.10, 3.40, 37.20')}`
      )}
      <p><strong>On a budget?</strong> With $30, 30 ÷ 6.20 = 4.8..., so you can afford only 4 whole bottles, which is 8 L.</p>
      ${tip('The lowest $/L is the best value. Type money to 2 decimal places, like 4.20 (4.2 is fine too).')}`,

    // =====================================================================
    // 6F Speed
    // =====================================================================
    // Y8 6F Q1, Q2: finding speed
    'y8-6f-speed': `
      <p class="hp-tag">Worked example: (a) a boat travels <b>27 km in 20 minutes</b>. Find its speed in km/h. (b) A cyclist rides <b>360 m in 48 s</b>. Find the speed in m/s.</p>
      ${dst()}
      ${steps(
        `<p><strong>Speed = distance ÷ time.</strong> For km/h, the time must be in hours: 20 min = 20/60 = 1/3 h.</p>`,
        `<p><strong>Divide, or scale up to one hour.</strong> 3 lots of 20 minutes make an hour, so the boat goes 3 times as far.</p>
         ${sum('27 ÷ 1/3 = 27 × 3 = 81 km/h')}`,
        `<p><strong>m/s needs metres and seconds</strong>, which we already have.</p>
         ${sum('(b) 360 ÷ 48 = 7.5 m/s')}
         ${ans('81, 7.5')}`
      )}
      ${tip('The unit beside the box tells you what to use: km/h needs hours, m/s needs seconds. Type just the number.')}`,

    // Y8 6F Q3, Q4, Q5: finding distance or time
    'y8-6f-dt': `
      <p class="hp-tag">Worked example: (a) a dog runs at <b>2.5 m/s</b> for <b>6 minutes</b>. How far does it go? (b) A coach travels <b>260 km</b> at <b>80 km/h</b>. How long does it take?</p>
      ${dst()}
      ${steps(
        `<p><strong>Distance = speed × time.</strong> m/s needs seconds: 6 min = 360 s.</p>
         ${sum('2.5 × 360 = 900 m')}`,
        `<p><strong>Time = distance ÷ speed.</strong></p>
         ${sum('260 ÷ 80 = 3.25 h')}`,
        `<p><strong>Decimal hours:</strong> 0.25 h is a quarter of an hour, 15 minutes. So 3.25 h is 3 h 15 min. When the box says h, type 3.25.</p>
         ${ans('900, 3.25')}`
      )}
      <p><strong>A table of journeys:</strong> each row is one trip. Cover the missing quantity on the triangle, and check each column's units.</p>
      ${tip('Units must match before you multiply or divide: m/s goes with metres and seconds, km/h with kilometres and hours.')}`,

    // Y8 6F Q6, Q10, Q12: clock times
    'y8-6f-clock': `
      <p class="hp-tag">Worked example: (a) a coach drives at <b>72 km/h</b> from <b>8:50 a.m.</b> to <b>12:05 p.m.</b> How far does it go? (b) Sara wants to finish a <b>6 km</b> run at <b>8:20 a.m.</b> She runs at <b>10 km/h</b>. When must she start?</p>
      ${steps(
        `<p><strong>Count the time in easy jumps.</strong></p>
         ${flow(['8:50 → 9:00', '10 min'], ['9:00 → 12:00', '3 h'], ['12:00 → 12:05', '5 min'])}
         ${sum('3 h 15 min = 3.25 h')}`,
        `<p><strong>Distance = speed × time.</strong></p>
         ${sum('72 × 3.25 = 234 km')}`,
        `<p><strong>Working back to a start time:</strong> 6 ÷ 10 = 0.6 h, and 0.6 × 60 = 36 minutes. Go back 36 minutes from 8:20.</p>
         ${ans('234, 7:44 am')}`
      )}
      <p><strong>Over several days:</strong> each full day is 24 h. Monday 9:00 p.m. to Wednesday 3:30 a.m. is 24 + 6.5 = 30.5 h. For moving speed, take off the time spent stopped.</p>
      ${tip('Type a time like 7:44 am (or in 24-hour time, like 0744). Minutes to hours: divide by 60, so 15 min = 0.25 h.')}`,

    // Y8 6F Q9, Q13: average speed for a whole trip
    'y8-6f-whole': `
      <p class="hp-tag">Worked example: Kim walks <b>6 km at 4 km/h</b>, then catches a bus for another <b>6 km</b>, which takes <b>30 minutes</b>. Find her average speed for the whole trip.</p>
      ${steps(
        `<p><strong>Find the time for each part.</strong></p>
         ${sum('walk: 6 ÷ 4 = 1.5 h &nbsp; bus: 30 min = 0.5 h')}`,
        `<p><strong>Total the distance and the time.</strong></p>
         ${sum('12 km in 2 h')}`,
        `<p><strong>Average speed = total distance ÷ total time.</strong></p>
         ${sum('12 ÷ 2 = 6 km/h')}
         ${ans('6')}`
      )}
      <p><strong>Not the middle of the speeds.</strong> The bus went 12 km/h, and halfway between 4 and 12 is 8. But Kim spent much longer at the slow speed, so her average is lower.</p>
      ${tip('Never average the speeds themselves. Always use total distance ÷ total time.')}`,

    // Y8 6F Q7, Q14: changing speed units and using wheels
    'y8-6f-convert': `
      <p class="hp-tag">Worked example: (a) a wheel has a circumference of <b>1.8 m</b> and turns <b>4 times a second</b>. Find the speed in km/h. (b) A drone flies at <b>25 m/s</b>. How long does it take to fly <b>2 km</b>?</p>
      ${steps(
        `<p><strong>One turn moves the bike one circumference.</strong></p>
         ${sum('4 × 1.8 = 7.2 m/s')}`,
        `<p><strong>m/s to km/h: × 3.6.</strong> An hour has 3600 s and a kilometre has 1000 m, and 3600 ÷ 1000 = 3.6.</p>
         ${sum('7.2 × 3.6 = 25.92 km/h')}`,
        `<p><strong>Time = distance ÷ speed, in matching units.</strong> 2 km = 2000 m.</p>
         ${sum('2000 ÷ 25 = 80 s')}
         ${ans('25.92, 80')}`
      )}
      <p><strong>Other units:</strong> km/s to km/h is × 3600. 1 knot is 1.852 km/h, so 10 knots is 18.52 km/h.</p>
      ${tip('m/s → km/h: × 3.6. km/h → m/s: ÷ 3.6. Type tiny times as a full decimal, like 0.002, and round only if asked.')}`,

    // Y8 6F Q8, Q11: trains in tunnels and races
    'y8-6f-puzzles': `
      <p class="hp-tag">Worked example: (a) a <b>130 m</b> train goes through a <b>520 m</b> tunnel. From when its front goes in to when its back comes out takes <b>26 s</b>. Find its speed. (b) In a <b>700 m</b> race, when Ali finishes, Bo is 140 m behind and Cy is 280 m behind. When Bo finishes, how far ahead of Cy is he?</p>
      ${steps(
        `<p><strong>Sketch it and follow one point, the front.</strong> The front crosses the tunnel, then keeps going until the back is out: one train length more.</p>
         ${sum('520 + 130 = 650 m<br>650 ÷ 26 = 25 m/s')}`,
        `<p><strong>Same time, same speeds: distances stay in proportion.</strong> While Ali ran 700 m, Bo ran 560 m and Cy ran 420 m.</p>
         ${sum('Cy : Bo = 420 : 560 = 3 : 4')}`,
        `<p><strong>Scale up to Bo's finish.</strong> Cy runs 3/4 of Bo's distance.</p>
         ${sum('700 × 3/4 = 525 m, so Bo is 700 − 525 = 175 m ahead')}
         ${ans('25, 175')}`
      )}
      ${tip('Draw where things are at the start and at the end. The gap at the finish is not the same as the gap earlier on.')}`,

    // =====================================================================
    // 6G Ratios and rates and the unitary method
    // =====================================================================
    // Y8 6G Q1, Q2, Q4: the unitary method
    'y8-6g-unitary': `
      <p class="hp-tag">Worked example: (a) <b>5 kg</b> of apples cost <b>$32.50</b>. How much do <b>8 kg</b> cost? (b) <b>200 g</b> of nuts cost <b>$2.80</b>. How much does <b>1.5 kg</b> cost?</p>
      ${steps(
        `<p><strong>Find the cost of one.</strong></p>
         ${sum('32.50 ÷ 5 = $6.50 per kg')}`,
        `<p><strong>Multiply up to the amount you want.</strong></p>
         ${sum('6.50 × 8 = $52.00')}`,
        `<p><strong>Different units? Step to a handy one.</strong> 5 lots of 200 g make 1 kg.</p>
         ${sum('1 kg: 2.80 × 5 = $14<br>1.5 kg: 14 × 1.5 = $21.00')}
         ${ans('52.00, 21.00')}`
      )}
      ${tip('Type money like 52 or 52.00, the $ is shown. Round cents to 2 decimal places. A dozen is 12.')}`,

    // Y8 6G Q3, Q5, Q14: ratio problems with the unitary method
    'y8-6g-ratio': `
      <p class="hp-tag">Worked example: (a) boys to girls in a club is <b>7 : 4</b>. There are 56 boys. How many girls? (b) A prize is shared <b>2 : 5 : 6</b>. The middle share is <b>$175</b>. Find the other shares and the total.</p>
      ${steps(
        `<p><strong>Find one part from the amount you know.</strong> 7 parts are 56 boys.</p>
         ${sum('1 part = 56 ÷ 7 = 8<br>girls = 4 × 8 = 32')}`,
        `<p><strong>(b) 5 parts are $175.</strong></p>
         ${sum('1 part = 175 ÷ 5 = 35<br>2 × 35 = 70 and 6 × 35 = 210')}`,
        `<p><strong>The total is all the parts.</strong> 2 + 5 + 6 = 13 parts.</p>
         ${sum('13 × 35 = 455 &nbsp;(check: 70 + 175 + 210 = 455 ✓)')}
         ${ans('32, 70, 210, 455')}`
      )}
      ${tip('Type a list with commas in the order asked, like 70, 210. For a shape, the perimeter is all the sides added, which is all the parts.')}`,

    // Y8 6G Q6, Q7, Q8, Q10, Q11, Q12, Q15: converting rates
    'y8-6g-convert': `
      <p class="hp-tag">Worked example: convert (a) <b>$33/h</b> to c/min, (b) <b>72 km/h</b> to m/s, (c) <b>35 mL/min</b> to L/h</p>
      ${steps(
        `<p><strong>Change the top unit and the bottom unit separately.</strong> $33 = 3300 c and 1 h = 60 min.</p>
         ${sum('3300 c per 60 min: 3300 ÷ 60 = 55 c/min')}`,
        `<p><strong>Speed:</strong> 72 km = 72 000 m and 1 h = 3600 s.</p>
         ${sum('72 000 ÷ 3600 = 20 m/s &nbsp;(shortcut: 72 ÷ 3.6)')}`,
        `<p><strong>Per hour is 60 times per minute.</strong> Then change mL to L.</p>
         ${sum('35 × 60 = 2100 mL/h = 2.1 L/h')}
         ${ans('55, 20, 2.1')}`
      )}
      <p><strong>Find the rate first if you need to.</strong> 9 cm of growth in 4 months is 9 ÷ 4 = 2.25 cm/month, which is 2.25 × 12 = 27 cm/year = 0.27 m/year.</p>
      ${tip('A bigger time on the bottom means a bigger number (per hour is more than per minute). Type just the number, rounded if asked, like 12.3 for one decimal place.')}`,

    // Y8 6G Q9: best buy in $/100 g
    'y8-6g-best': `
      <p class="hp-tag">Worked example: rice comes in <b>300 g</b> bags for <b>$5.40</b> and <b>700 g</b> bags for <b>$11.20</b>. (a) Find each price in $/100 g. (b) Find the cheapest way to buy exactly 2.1 kg.</p>
      ${steps(
        `<p><strong>Count the 100 g lots in each bag, then divide.</strong></p>
         ${sum('300 g = 3 lots: 5.40 ÷ 3 = $1.80/100 g<br>700 g = 7 lots: 11.20 ÷ 7 = $1.60/100 g')}`,
        `<p><strong>List the ways to make exactly 2100 g.</strong> Bags cannot be split.</p>
         ${sum('7 small: 7 × 5.40 = $37.80<br>3 large: 3 × 11.20 = $33.60')}`,
        `<p><strong>Pick the cheapest.</strong> Using the best-value bag usually wins, but check every way that works.</p>
         ${ans('1.80, 1.60, 33.60')}`
      )}
      ${tip('Type money to 2 decimal places, like 1.80 (1.8 is fine too). The lowest price per 100 g is the best value.')}`,

    // Y8 6G Q13: unitary method with letters
    'y8-6g-algebra': `
      <p class="hp-tag">Worked example: <b>p</b> tickets cost <b>$q</b>. Write the cost of 1 ticket, 5 tickets and m tickets.</p>
      ${steps(
        `<p><strong>One ticket: share the cost by the number of tickets.</strong></p>
         ${sum('q ÷ p = q/p')}`,
        `<p><strong>More tickets: multiply the cost of one.</strong></p>
         ${sum('5 × q/p = 5q/p &nbsp; m × q/p = mq/p')}
         ${ans('q/p, 5q/p, mq/p')}`,
        `<p><strong>Check with numbers.</strong> If 4 tickets cost $20, one costs 20/4 = $5, and 5 cost 5 × 20/4 = $25 ✓.</p>`
      )}
      ${tip('Type a fraction with /, like 5q/p. Letters can go in any order: qm/p is the same as mq/p.')}`,

    // Y8 6G Q16: driving towards each other
    'y8-6g-meet': `
      <p class="hp-tag">Worked example: two towns are <b>420 km</b> apart. Car A leaves town A at <b>50 km/h</b> and car B leaves town B at <b>70 km/h</b>, at the same time, driving towards each other.</p>
      ${steps(
        `<p><strong>Together they close the gap at both speeds added.</strong></p>
         ${sum('50 + 70 = 120 km/h')}`,
        `<p><strong>Time to meet = gap ÷ closing speed.</strong></p>
         ${sum('420 ÷ 120 = 3.5 h')}`,
        `<p><strong>Where they meet:</strong> car A has driven 50 × 3.5 = 175 km from town A. That is closer to town A, where the slower car started.</p>
         ${ans('3.5, 175')}`
      )}
      <p><strong>Driving the whole way alone:</strong> car A would take 420 ÷ 50 = 8.4 h.</p>
      ${tip('The slower car covers less ground, so they meet nearer the slower car\'s start. Type hours as a decimal, like 8.4.')}`
  });
})();
