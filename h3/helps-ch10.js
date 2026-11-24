/* H3 "How do I work this out?" panels for Chapter 10.
 * Each part below adds panels to window.H3_HELPS using the shared helpers in helps.js.
 * A question picks its panel with "help" in bank.js. Same no-overlap rule as helps.js. */
/* Help panels for 10A to 10L. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;
  // ---- drawing helpers for this chapter (all measurements are the panel's own, drawn to scale) ----
  const D = (items, alt, unit) => fig(Object.assign({ kind: 'diagram', items, alt }, unit ? { unit } : {}));
  const q = (v) => Math.round(v * 1000) / 1000;
  const pt = (cx, cy, r, a) => [q(cx + r * Math.cos(a * Math.PI / 180)), q(cy + r * Math.sin(a * Math.PI / 180))];
  const arcPts = (cx, cy, r, a1, a2) => {
    const n = Math.max(6, Math.ceil(Math.abs(a2 - a1) / 5));
    return Array.from({ length: n + 1 }, (_, i) => pt(cx, cy, r, a1 + (a2 - a1) * i / n));
  };
  const gridLines = (w, h) => {
    const g = [];
    for (let x = 0; x <= w; x++) g.push({ seg: [x, 0, x, h], thin: true });
    for (let y = 0; y <= h; y++) g.push({ seg: [0, y, w, y], thin: true });
    return g;
  };
  // A rectangular prism in a simple oblique view: front face l by h, going back w.
  const box = (l, h, w, [ll, hl, wl]) => {
    const dx = q(w * 0.45), dy = q(w * 0.32);
    return [
      { poly: [[l, 0], [l, h], [l + dx, h + dy], [l + dx, dy]], fill: true },
      { poly: [[0, h], [l, h], [l + dx, h + dy], [dx, h + dy]], fill: true },
      { poly: [[0, 0], [l, 0], [l, h], [0, h]], fill: true },
      { dim: [0, 0, l, 0], label: ll, off: -0.5 },
      { dim: [l, 0, l + dx, dy], label: wl, off: -0.5 },
      { dim: [l + dx, dy, l + dx, h + dy], label: hl, off: -0.5 }
    ];
  };
  // A triangular prism lying on a rectangle: right-angled triangle (base b, height h) at the front.
  const wedge = (b, h, len, [bl, hl, ll]) => {
    const dx = q(len * 0.45), dy = q(len * 0.32);
    return [
      { poly: [[b, 0], [0, h], [dx, h + dy], [b + dx, dy]], fill: true },
      { poly: [[0, 0], [b, 0], [0, h]], fill: true },
      { seg: [dx, dy, b + dx, dy], dash: true },
      { seg: [0, 0, dx, dy], dash: true },
      { seg: [dx, h + dy, dx, dy], dash: true },
      { angle: [0, 0, 0, 90], right: true },
      { dim: [0, 0, b, 0], label: bl, off: -0.5 },
      { dim: [0, h, 0, 0], label: hl, off: -0.5 },
      { dim: [b, 0, b + dx, dy], label: ll, off: -0.5 }
    ];
  };
  // A centimetre ruler with millimetre marks, and a marked length from 0.
  const ruler = (max, mark) => {
    const it = [{ poly: [[-0.25, 0], [max + 0.25, 0], [max + 0.25, 1], [-0.25, 1]], fill: true }];
    for (let i = 0; i <= max * 10; i++) {
      const x = q(i / 10), len = i % 10 === 0 ? 0.36 : i % 5 === 0 ? 0.25 : 0.15;
      it.push({ seg: [x, 1, x, q(1 - len)] });
      if (i % 10 === 0) it.push({ label: String(i / 10), at: [x, 0.42] });
    }
    it.push({ seg: [0, 1.38, mark, 1.38], arrow: 'both' }, { seg: [0, 1.24, 0, 1.52] }, { seg: [mark, 1.24, mark, 1.52] });
    return it;
  };

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 10A Metric units of length
    // =====================================================================
    // 10A Q1, Q2: choosing a sensible unit
    '10a-units': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Unit</span><span role="columnheader">About this long</span></div>
        <div class="hp-tr" role="row"><span role="cell">1 millimetre (mm)</span><span role="cell">the thickness of a coin</span></div>
        <div class="hp-tr" role="row"><span role="cell">1 centimetre (cm)</span><span role="cell">the width of your little finger</span></div>
        <div class="hp-tr" role="row"><span role="cell">1 metre (m)</span><span role="cell">one big step</span></div>
        <div class="hp-tr" role="row"><span role="cell">1 kilometre (km)</span><span role="cell">about 12 minutes of walking</span></div>
      </div>
      <p class="hp-tag">Worked example: which unit is best for the <b>length of a car</b>?</p>
      ${steps(
        `<p><strong>Picture it against the table.</strong> A car is a few big steps long.</p>`,
        `<p><strong>Pick the unit that gives a small, sensible number.</strong> About 4 m sounds right. In mm it would be about 4000, far too many to measure. In km it would be a tiny fraction.</p>
         ${ans('m')}`
      )}
      ${tip('Tiny things (a seed, a wire) use mm. Things you hold use cm. Rooms, buildings and animals use m. Journeys use km.')}`,

    // 10A Q7, Q8: reading a ruler or a scale
    '10a-ruler': `
      <p class="hp-tag">Worked example: how long is the marked length?</p>
      ${D(ruler(4, 3.7), 'A centimetre ruler from 0 to 4 with millimetre marks. An arrow runs from 0 to the seventh small mark after 3.', 70)}
      ${steps(
        `<p><strong>Count the whole centimetres.</strong> The arrow goes past the 3.</p>`,
        `<p><strong>Count the small marks after it.</strong> Each small gap is 1 mm, which is 0.1 cm. The arrow ends 7 small gaps past the 3.</p>
         ${sum('3 cm and 7 mm = 3.7 cm')}`,
        `<p><strong>In millimetres</strong>, every whole centimetre is 10 mm.</p>
         ${sum('3 × 10 + 7 = 37 mm')}
         ${ans('3.7 cm, or 37 mm')}`
      )}
      ${tip('On any other scale, first work out what one small gap is worth. If 1 metre is split into 5 gaps, each gap is 0.2 m. Read the unit on the scale, then change it if the question asks for a different one.')}`,

    // 10A Q3, Q4: converting one step on the ladder
    '10a-convert': `
      ${flow(['start', 'km'], ['× 1000', 'm'], ['× 100', 'cm'], ['× 10', 'mm'])}
      <p>Going right (to a smaller unit) you <b>multiply</b>. Going left (to a bigger unit) you <b>divide</b>.</p>
      <p class="hp-tag">Worked example: convert <b>2.5 m</b> to cm, and <b>460 mm</b> to cm.</p>
      ${steps(
        `<p><strong>m to cm is one step right</strong>, so multiply by 100. The digits move two places left.</p>
         ${sum('2.5 × 100 = 250 cm')}`,
        `<p><strong>mm to cm is one step left</strong>, so divide by 10.</p>
         ${sum('460 ÷ 10 = 46 cm')}
         ${ans('250 and 46')}`
      )}
      ${tip('Check it makes sense: a smaller unit always gives a bigger number. 2.5 m is 250 cm, not 0.025 cm.')}`,

    // 10A Q6: converting across two or more steps
    '10a-convert-2': `
      ${flow(['start', 'km'], ['× 1000', 'm'], ['× 100', 'cm'], ['× 10', 'mm'])}
      <p class="hp-tag">Worked example: convert <b>2.6 km</b> to cm, and <b>45 000 mm</b> to m.</p>
      ${steps(
        `<p><strong>Take one step at a time.</strong> km to m, then m to cm. Both go right, so multiply.</p>
         ${sum('2.6 km × 1000 = 2600 m<br>2600 m × 100 = 260 000 cm')}`,
        `<p><strong>Going the other way, divide at each step.</strong> mm to cm, then cm to m.</p>
         ${sum('45 000 mm ÷ 10 = 4500 cm<br>4500 cm ÷ 100 = 45 m')}
         ${ans('260000 and 45')}`
      )}
      ${tip('Type big answers with no spaces or commas, like 260000. For tiny answers, keep the zeros after the decimal point, like 0.004.')}`,

    // 10A Q5, Q9, Q11: adding and subtracting lengths
    '10a-addsub': `
      <p class="hp-tag">Worked example: (a) add <b>2 m and 65 cm</b>, answer in cm. (b) Find the difference between <b>5.3 m and 80 cm</b>, in cm.</p>
      ${steps(
        `<p><strong>Change everything into the unit in brackets first.</strong></p>
         ${sum('2 m = 200 cm &nbsp;&nbsp; 5.3 m = 530 cm')}`,
        `<p><strong>Now the units match, so add or take away.</strong></p>
         ${sum('(a) 200 + 65 = 265 cm<br>(b) 530 − 80 = 450 cm')}
         ${ans('265 and 450')}`
      )}
      ${tip('Never add numbers with different units straight away: 2 m + 65 cm is not 67 of anything. If the answer is wanted in m, change at the end: 265 cm = 2.65 m.')}`,

    // 10A Q10, Q12: putting lengths in order
    '10a-order': `
      <p class="hp-tag">Worked example: put <b>0.45 m, 52 cm, 480 mm, 0.0005 km</b> in order from smallest to largest.</p>
      ${steps(
        `<p><strong>Change them all to the same unit.</strong> mm works well because it avoids decimals.</p>
         ${sum('0.45 m = 450 mm<br>52 cm = 520 mm<br>480 mm = 480 mm<br>0.0005 km = 0.5 m = 500 mm')}`,
        `<p><strong>Order the new numbers</strong>: 450, 480, 500, 520.</p>`,
        `<p><strong>Write the original measurements in that order.</strong> Type each one as it was written, with its unit, and commas between.</p>
         ${ans('0.45 m, 480 mm, 0.0005 km, 52 cm')}`
      )}
      ${tip('To find the tallest or longest of a few, use the same trick: same unit first, then compare.')}`,

    // 10A Q13, Q14, Q15, Q16, Q17: rates and costs with lengths
    '10a-rate': `
      <p class="hp-tag">Worked example: a snail crawls <b>5 cm</b> every minute. How many minutes does it take to crawl <b>3.5 m</b>?</p>
      ${steps(
        `<p><strong>Make the units match.</strong> The speed is in cm, so change the distance to cm.</p>
         ${sum('3.5 m = 350 cm')}`,
        `<p><strong>How many lots of 5 cm fit into 350 cm?</strong> Divide.</p>
         ${sum('350 ÷ 5 = 70')}
         ${ans('70')}`
      )}
      <p><strong>Costs:</strong> ribbon costs $2.50 per metre. For 40 cm, change to metres first: 40 cm = 0.4 m, so the cost is 0.4 × 2.50 = $1. Type money with no $ sign.</p>
      ${tip('If something moves 2 mm every 3 seconds, first find how many lots of 2 mm are needed, then multiply by 3 to get the seconds.')}`,

    // 10A Q18, Q20: one number to convert across several steps, and a new unit
    '10a-factor': `
      <p class="hp-tag">Worked example (with time): what do you multiply by to change <b>hours into seconds</b>?</p>
      ${flow(['start', 'hours'], ['× 60', 'minutes'], ['× 60', 'seconds'])}
      ${steps(
        `<p><strong>Write down each step on the ladder.</strong> Hours to minutes is × 60, minutes to seconds is × 60.</p>`,
        `<p><strong>Multiply the steps together</strong> to get one number for the whole trip.</p>
         ${sum('60 × 60 = 3600')}`,
        `<p><strong>Going back the other way</strong>, divide by the same number: seconds ÷ 3600 = hours.</p>
         ${ans('3600')}`
      )}
      <p><strong>A new unit:</strong> if 1 m is split into 1 000 000 micrometres, then 3 m is 3 × 1 000 000 = 3 000 000 μm. For a length in cm or mm, change it to m first, then multiply.</p>
      ${tip('Multiplying by 100 and then by 100 again is the same as multiplying by 10 000: just add up the zeros.')}`,

    // =====================================================================
    // 10B Perimeter
    // =====================================================================
    // 10B Q1, Q2, Q3, Q5: adding the sides
    '10b-perimeter': `
      <p class="hp-tag">Worked example: find the perimeter of this kite.</p>
      ${D([
        { poly: [[0, 0], [2.4, 4.949], [0, 6.749], [-2.4, 4.949]], fill: true },
        { tick: [0, 0, 2.4, 4.949], n: 2 }, { tick: [0, 0, -2.4, 4.949], n: 2 },
        { tick: [2.4, 4.949, 0, 6.749], n: 1 }, { tick: [-2.4, 4.949, 0, 6.749], n: 1 },
        { label: '5.5 cm', at: [1.6, 2.2], anchor: 'start' }, { label: '3 cm', at: [1.5, 6.2], anchor: 'start' }
      ], 'A kite. The two long sides are 5.5 cm and marked equal; the two short sides are 3 cm and marked equal.', 30)}
      ${steps(
        `<p><strong>Perimeter means the distance all the way round.</strong> Matching marks mean matching lengths, so the kite has two sides of 5.5 cm and two of 3 cm.</p>`,
        `<p><strong>Add every side, not just the ones with numbers.</strong></p>
         ${sum('5.5 + 5.5 + 3 + 3 = 17')}
         ${ans('17')}`
      )}
      ${tip('A rectangle only shows two lengths, but it has four sides: P = 2 × length + 2 × width. A square has four equal sides, so a 2.6 m square has P = 4 × 2.6 = 10.4 m.')}`,

    // 10B Q4, Q8: shapes with right angles and missing sides
    '10b-rectilinear': `
      <p class="hp-tag">Worked example: find the perimeter. All corners are right angles.</p>
      ${D([
        { poly: [[0, 0], [11, 0], [11, 4], [7, 4], [7, 6.5], [0, 6.5]], fill: true },
        { dim: [0, 0, 11, 0], label: '11 cm', off: -0.5 }, { dim: [11, 0, 11, 4], label: '4 cm', off: -0.5 },
        { dim: [7, 6.5, 0, 6.5], label: '7 cm', off: -0.5 }, { dim: [0, 6.5, 0, 0], label: '6.5 cm', off: -0.5 },
        { label: '?', at: [9, 4.45] }, { label: '?', at: [7.45, 5.25], anchor: 'start' }
      ], 'An L shape: bottom 11 cm, right side 4 cm, top 7 cm, left side 6.5 cm. Two sides are unknown.', 26)}
      ${steps(
        `<p><strong>Find each missing side from the sides opposite it.</strong> The bottom (11) is the same as the top (7) plus the short step across. The left (6.5) is the same as the right (4) plus the step up.</p>
         ${sum('across: 11 − 7 = 4<br>up: 6.5 − 4 = 2.5')}`,
        `<p><strong>Add all six sides</strong>, going round in order so none is missed.</p>
         ${sum('11 + 4 + 4 + 2.5 + 7 + 6.5 = 35')}
         ${ans('35')}`
      )}
      ${tip('Shortcut for L and staircase shapes: the perimeter is the same as the rectangle around them, here 2 × (11 + 6.5) = 35. A notch cut into a side is different: it adds its two depths.')}`,

    // 10B Q9: sides in different units
    '10b-units': `
      <p class="hp-tag">Worked example: find the perimeter in centimetres.</p>
      ${D([
        { poly: [[0, 0], [7.5, 0], [4.678, 4.368]], fill: true },
        { dim: [0, 0, 7.5, 0], label: '0.75 m', off: -0.5 },
        { label: '640 mm', at: [2.0, 2.6], anchor: 'end' }, { label: '52 cm', at: [6.4, 2.4], anchor: 'start' }
      ], 'A triangle with sides 0.75 m, 640 mm and 52 cm.', 30)}
      ${steps(
        `<p><strong>Change every side to cm first.</strong></p>
         ${sum('0.75 m = 75 cm<br>640 mm = 64 cm<br>52 cm stays 52 cm')}`,
        `<p><strong>Then add.</strong></p>
         ${sum('75 + 64 + 52 = 191')}
         ${ans('191')}`
      )}
      ${tip('1 m = 100 cm and 1 cm = 10 mm. Metres to cm: multiply by 100. mm to cm: divide by 10.')}`,

    // 10B Q6, Q10: fencing and posts
    '10b-fence': `
      <p class="hp-tag">Worked example: a rectangular garden is <b>24 m</b> long and <b>15 m</b> wide. Fencing costs <b>$25 per metre</b>. Find the cost of fencing all the way round.</p>
      ${steps(
        `<p><strong>Find the perimeter.</strong> Two lengths and two widths.</p>
         ${sum('2 × 24 + 2 × 15 = 48 + 30 = 78 m')}`,
        `<p><strong>Multiply by the cost of one metre.</strong></p>
         ${sum('78 × 25 = 1950')}
         ${ans('1950')}`
      )}
      ${tip('Posts all the way round a closed shape: there are as many gaps as posts. So 40 posts that are 2 m apart make a perimeter of 40 × 2 = 80 m.')}`,

    // 10B Q7: total length of lines on a court
    '10b-court': `
      <p class="hp-tag">Worked example: a field is marked with the solid lines shown. Find the total length of line, then change it to metres (1 foot = 0.305 m).</p>
      ${D([
        { poly: [[0, 0], [5, 0], [5, 2.4], [0, 2.4]], fill: true },
        { seg: [2.5, 0, 2.5, 2.4] }, { seg: [0, 1.2, 5, 1.2] },
        { dim: [0, 0, 5, 0], label: '50 feet', off: -0.5 }, { dim: [0, 2.4, 0, 0], label: '24 feet', off: -0.5 }
      ], 'A rectangle 50 feet by 24 feet with a line across the middle and a line along the middle.', 50)}
      ${steps(
        `<p><strong>List every line and its length.</strong> The outside is two 50s and two 24s. The line across the middle is 24. The line along the middle is 50.</p>`,
        `<p><strong>Add them all.</strong></p>
         ${sum('50 + 50 + 24 + 24 + 24 + 50 = 222 feet')}`,
        `<p><strong>Change to metres</strong> by multiplying by 0.305.</p>
         ${sum('222 × 0.305 = 67.71 m')}
         ${ans('222, then 67.71')}`
      )}
      ${tip('Use symmetry: if one half of the court has the same lines as the other, find one half and double it. Tick off each line as you add it.')}`,

    // 10B Q11, Q12: finding a missing side from the perimeter
    '10b-missing': `
      <p class="hp-tag">Worked example: a rectangle has perimeter <b>30 cm</b> and length <b>9 cm</b>. Find its width.</p>
      ${D([
        { poly: [[0, 0], [9, 0], [9, 6], [0, 6]], fill: true },
        { dim: [0, 0, 9, 0], label: '9 cm', off: -0.5 }, { dim: [9, 0, 9, 6], label: '?', off: -0.5 },
        { label: 'P = 30 cm', at: [4.5, 3] }
      ], 'A rectangle with length 9 cm and an unknown width. P = 30 cm.', 20)}
      ${steps(
        `<p><strong>Take away the sides you know.</strong> There are two lengths of 9 cm.</p>
         ${sum('30 − 9 − 9 = 12')}`,
        `<p><strong>Share what is left between the two widths.</strong></p>
         ${sum('12 ÷ 2 = 6')}
         ${ans('6')}`
      )}
      ${tip('Length + width is always half the perimeter. For P = 16 with whole numbers: 1 + 7, 2 + 6, 3 + 5, 4 + 4, so 4 different rectangles. For a square, just divide P by 4.')}`,

    // 10B Q13, Q14, Q15: algebra rules for perimeter
    '10b-rule': `
      <p class="hp-tag">Worked example: write a rule for the perimeter <b>P</b> of this shape.</p>
      ${D([
        { poly: [[0, 0], [4, 0], [4, 2.5], [2, 4.2], [0, 2.5]], fill: true },
        { tick: [0, 0, 0, 2.5], n: 1 }, { tick: [4, 0, 4, 2.5], n: 1 },
        { tick: [0, 2.5, 2, 4.2], n: 2 }, { tick: [4, 2.5, 2, 4.2], n: 2 },
        { label: 'x', at: [2, -0.45] }, { label: 'y', at: [-0.35, 1.25], anchor: 'end' }, { label: 'z', at: [0.75, 3.75], anchor: 'end' }
      ], 'A house shape: base x, two equal walls y, two equal roof sides z.', 36)}
      ${steps(
        `<p><strong>Go round the shape and write every side.</strong> Matching marks mean the same letter.</p>
         ${sum('x + y + z + z + y')}`,
        `<p><strong>Collect the same letters.</strong></p>
         ${sum('P = x + 2y + 2z')}
         ${ans('x+2y+2z')}`
      )}
      <p><strong>Working backwards:</strong> a regular pentagon with side m has P = 5m, so its side length is m = P/5.</p>
      ${tip('Type only the right-hand side, with no × signs: 2y, not 2 × y. Use / for divide and brackets round a whole top, like (P-3)/2.')}`,

    // 10B Q16: timber for picture frames
    '10b-frame': `
      <p class="hp-tag">Worked example: a square painting of side <b>35 cm</b> is framed with timber <b>5 cm</b> wide. Find the total length of timber.</p>
      ${D([
        { poly: [[0, 0], [4.5, 0], [4.5, 4.5], [0, 4.5]], fill: true },
        { poly: [[0.5, 0.5], [4, 0.5], [4, 4], [0.5, 4]] },
        { seg: [0, 0, 0.5, 0.5] }, { seg: [4.5, 0, 4, 0.5] }, { seg: [4.5, 4.5, 4, 4] }, { seg: [0, 4.5, 0.5, 4] },
        { label: '35 cm', at: [2.25, 2.25] }, { dim: [4.5, 4, 4.5, 4.5], label: '5 cm', off: -0.5 }
      ], 'A square frame. The painting inside is 35 cm wide and the timber is 5 cm wide.', 40)}
      ${steps(
        `<p><strong>Each piece is as long as the outside edge.</strong> That is the painting plus the timber width on both ends.</p>
         ${sum('35 + 5 + 5 = 45 cm')}`,
        `<p><strong>A square frame needs four pieces.</strong></p>
         ${sum('4 × 45 = 180')}
         ${ans('180')}`
      )}
      ${tip('Working backwards: if 1.6 m (160 cm) of timber 4 cm wide makes a square frame, each piece is 160 ÷ 4 = 40 cm, so the picture is 40 − 4 − 4 = 32 cm wide.')}`,

    // =====================================================================
    // 10C Circles, π and circumference
    // =====================================================================
    // 10C Q1, Q2, Q10: fractions that approximate π
    '10c-approx': `
      <p class="hp-tag">Worked example: write <b>223/71</b> as a decimal to 3 and 4 decimal places. Is it closer to π than 3.14 is?</p>
      ${steps(
        `<p><strong>Divide the top by the bottom.</strong></p>
         ${sum('223 ÷ 71 = 3.140845...')}`,
        `<p><strong>Round.</strong> Look at the next digit: 5 or more rounds up.</p>
         ${sum(`3 decimal places: 3.140${now('8')}... → 3.141<br>4 decimal places: 3.1408${now('4')}... → 3.1408`)}`,
        `<p><strong>Compare gaps from π</strong> (π = 3.14159...). The smaller gap is the better guess.</p>
         ${sum('3.14159 − 3.14085 = 0.00074<br>3.14159 − 3.14 = 0.00159')}
         ${ans('3.141, 3.1408, Yes')}`
      )}
      ${tip('To pick the closest of several fractions, turn each one into a decimal and find its gap from 3.14159. The smallest gap wins.')}`,

    // 10C Q3, Q4, Q5, Q6, Q8: circumference from a diameter or radius
    '10c-circ': `
      <p class="hp-tag">Worked example: find the circumference of each circle, to 2 decimal places.</p>
      ${fig(
        { kind: 'diagram', unit: 22, items: [{ circle: [0, 0, 3], fill: true }, { seg: [-3, 0, 3, 0] }, { point: [0, 0] }, { label: '15 cm', at: [0, 0.65] }], alt: 'A circle with diameter 15 cm' },
        { kind: 'diagram', unit: 22, items: [{ circle: [0, 0, 2.7], fill: true }, { seg: [0, 0, 2.7, 0] }, { point: [0, 0] }, { label: '4.5 cm', at: [1.2, 0.65] }], alt: 'A circle with radius 4.5 cm' }
      )}
      ${steps(
        `<p><strong>Diameter given (the line goes right across):</strong> use C = πd.</p>
         ${sum('C = π × 15 = 47.123...')}`,
        `<p><strong>Radius given (centre to edge):</strong> use C = 2πr.</p>
         ${sum('C = 2 × π × 4.5 = 28.274...')}`,
        `<p><strong>Round to 2 decimal places</strong>: look at the third decimal digit.</p>
         ${ans('47.12 and 28.27')}`
      )}
      ${tip('Use the π button unless the question gives you a value. With π = 22/7 and diameter 14: 22/7 × 14 = 44. With π = 3.14, type 3.14 in its place.')}`,

    // 10C Q7, Q11: diameter or radius from the circumference
    '10c-backwards': `
      <p class="hp-tag">Worked example: a circle has circumference <b>20 cm</b>. Find its diameter and its radius, to 2 decimal places.</p>
      ${steps(
        `<p><strong>C = πd, so undo the × π by dividing.</strong></p>
         ${sum('d = 20 ÷ π = 6.366...')}`,
        `<p><strong>The radius is half the diameter.</strong> Halve the full calculator number, not the rounded one.</p>
         ${sum('r = 6.366... ÷ 2 = 3.183...')}
         ${ans('6.37 and 3.18')}`
      )}
      ${tip('To type a rule with π in it, write pi. The rule d = C ÷ π is typed C/pi. If you divide by a whole group, put it in brackets.')}`,

    // 10C Q9: distance travelled by a turning wheel
    '10c-wheel': `
      <p class="hp-tag">Worked example: a bike wheel has diameter <b>70 cm</b>. It turns <b>500</b> times. How far does the bike go, to the nearest metre?</p>
      ${steps(
        `<p><strong>One turn moves the bike one circumference.</strong></p>
         ${sum('C = π × 70 = 219.91... cm')}`,
        `<p><strong>Multiply by the number of turns.</strong></p>
         ${sum('219.91... × 500 = 109 955.7... cm')}`,
        `<p><strong>Change to metres</strong> (÷ 100), then round.</p>
         ${sum('109 955.7... ÷ 100 = 1099.56... m')}
         ${ans('1100')}`
      )}
      ${tip('Keep the full calculator number until the very end. Rounding early can make the last answer a metre or more out.')}`,

    // 10C Q12: exact answers in terms of π
    '10c-exact': `
      <p class="hp-tag">Worked example: give the exact circumference of a circle with (a) diameter <b>15 cm</b>, (b) radius <b>8 mm</b>.</p>
      ${steps(
        `<p><strong>"Exact" means leave π as π.</strong> Do not press the π button.</p>
         ${sum('(a) C = π × 15 = 15π')}`,
        `<p><strong>With a radius, double it first.</strong></p>
         ${sum('(b) C = 2 × π × 8 = 16π')}
         ${ans('15pi and 16pi')}`
      )}
      ${tip('Type π as pi, with the number in front: 15pi. No × sign is needed.')}`,

    // 10C Q13: planets (big numbers)
    '10c-planets': `
      <p class="hp-tag">Worked example: Mars has diameter about <b>6800 km</b>. Jupiter has circumference about <b>439 300 km</b>. Find the missing measurement for each, to the nearest whole number.</p>
      ${steps(
        `<p><strong>Diameter known, so multiply by π.</strong></p>
         ${sum('Mars: C = π × 6800 = 21 362.8... km')}`,
        `<p><strong>Circumference known, so divide by π.</strong></p>
         ${sum('Jupiter: d = 439 300 ÷ π = 139 833.5... km')}`,
        `<p><strong>Round to the nearest whole number.</strong></p>
         ${ans('21363 and 139834')}`
      )}
      ${tip('Type big numbers with no spaces or commas. The space in 439 300 is only there to make it easier to read.')}`,

    // =====================================================================
    // 10D Arc length and perimeter of sectors and composite shapes
    // =====================================================================
    // 10D Q1, Q7: arc length
    '10d-arc': `
      <p class="hp-tag">Worked example: find the arc length, to 2 decimal places.</p>
      ${D([
        { poly: arcPts(0, 0, 3, 0, 80), open: true },
        { seg: [0, 0, 3, 0], dash: true }, { seg: [0, 0, ...pt(0, 0, 3, 80)], dash: true },
        { angle: [0, 0, 0, 80], label: '80°', r: 0.8 }, { label: '7 cm', at: [1.5, -0.4] }
      ], 'An arc of a circle with radius 7 cm and angle 80 degrees.', 40)}
      ${steps(
        `<p><strong>What fraction of a full circle is it?</strong> A full turn is 360°.</p>
         ${sum('80/360')}`,
        `<p><strong>Find the whole circumference.</strong></p>
         ${sum('2 × π × 7 = 43.982...')}`,
        `<p><strong>Take that fraction of it.</strong></p>
         ${sum('80/360 × 43.982... = 9.773...')}
         ${ans('9.77')}`
      )}
      ${tip('You can do it in one go on a calculator: 80 ÷ 360 × 2 × π × 7. If the angle is more than 180°, the arc is the long way round.')}`,

    // 10D Q2, Q4: perimeter of a sector or quadrant
    '10d-sector': `
      <p class="hp-tag">Worked example: find the perimeter of this sector, to 1 decimal place.</p>
      ${D([
        { poly: [[0, 0], ...arcPts(0, 0, 3, 0, 135)], fill: true },
        { angle: [0, 0, 0, 135], label: '135°', r: 0.7 }, { label: '4 m', at: [1.5, -0.4] }
      ], 'A sector with radius 4 m and angle 135 degrees.', 40)}
      ${steps(
        `<p><strong>Find the curved part (the arc).</strong></p>
         ${sum('135/360 × 2 × π × 4 = 9.424...')}`,
        `<p><strong>Add the two straight edges.</strong> Both are radii.</p>
         ${sum('9.424... + 4 + 4 = 17.424...')}
         ${ans('17.4')}`
      )}
      ${tip('A quadrant is a quarter circle (90°). Its arc is 1/4 of 2πr, and it also has two straight radii to add on.')}`,

    // 10D Q3: perimeter of a semicircle
    '10d-semi': `
      <p class="hp-tag">Worked example: a semicircle has diameter <b>9 cm</b>. Find its perimeter, to 1 decimal place.</p>
      ${D([
        { poly: arcPts(0, 0, 2.25, 0, 180), fill: true },
        { dim: [-2.25, 0, 2.25, 0], label: '9 cm', off: -0.5 }
      ], 'A semicircle with diameter 9 cm.', 40)}
      ${steps(
        `<p><strong>The curve is half a circle.</strong></p>
         ${sum('½ × π × 9 = 14.137...')}`,
        `<p><strong>Add the straight edge</strong>, which is the diameter.</p>
         ${sum('14.137... + 9 = 23.137...')}
         ${ans('23.1')}`
      )}
      ${tip('The most common slip is forgetting the straight edge. The perimeter goes all the way round, flat side too.')}`,

    // 10D Q5, Q6, Q8: perimeter of composite shapes with curves
    '10d-composite': `
      <p class="hp-tag">Worked example: find the perimeter, to 1 decimal place.</p>
      ${D([
        { poly: [[0, 0], [8.5, 0], ...arcPts(8.5, 1.8, 1.8, -90, 90).slice(1, -1), [8.5, 3.6], [0, 3.6]], fill: true },
        { seg: [8.5, 0, 8.5, 3.6], dash: true },
        { dim: [0, 0, 8.5, 0], label: '8.5 m', off: -0.5 }, { dim: [0, 3.6, 0, 0], label: '3.6 m', off: -0.5 }
      ], 'A rectangle 8.5 m by 3.6 m with a semicircle on its right-hand 3.6 m end.', 30)}
      ${steps(
        `<p><strong>Trace round the outside.</strong> The dashed line is inside the shape, so it does not count.</p>
         ${sum('straight edges: 8.5 + 3.6 + 8.5 = 20.6')}`,
        `<p><strong>The curve is a semicircle with diameter 3.6.</strong></p>
         ${sum('½ × π × 3.6 = 5.654...')}`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('20.6 + 5.654... = 26.254...')}
         ${ans('26.3')}`
      )}
      ${tip('Count the curves carefully: two semicircles on the same size make a whole circle. For "nearest centimetre" in metres, round to 2 decimal places.')}`,

    // 10D Q11: radius from the arc length
    '10d-radius': `
      <p class="hp-tag">Worked example: a sector has angle <b>60°</b> and arc length <b>12 cm</b>. Find the radius, to 1 decimal place.</p>
      ${steps(
        `<p><strong>Write the arc rule with r unknown.</strong></p>
         ${sum('60/360 × 2 × π × r = 12')}`,
        `<p><strong>Work out the number in front of r.</strong></p>
         ${sum('60/360 × 2 × π = 1.0471...')}`,
        `<p><strong>Undo the multiply by dividing.</strong></p>
         ${sum('r = 12 ÷ 1.0471... = 11.459...')}
         ${ans('11.5')}`
      )}
      ${tip('Check it: put r = 11.459 back into the arc rule and you should get 12. For a 225° sector, the fraction is 225/360.')}`,

    // 10D Q12, Q13: exact perimeters in terms of π
    '10d-exact': `
      <p class="hp-tag">Worked example: find the exact perimeter of a quadrant with radius <b>10 cm</b>.</p>
      ${D([
        { poly: [[0, 0], ...arcPts(0, 0, 3, 0, 90)], fill: true },
        { angle: [0, 0, 0, 90], right: true }, { dim: [0, 0, 3, 0], label: '10 cm', off: -0.5 }
      ], 'A quadrant with radius 10 cm.', 40)}
      ${steps(
        `<p><strong>Straight edges</strong>: two radii.</p>
         ${sum('10 + 10 = 20')}`,
        `<p><strong>The curve</strong> is a quarter of the circumference. Leave π as π.</p>
         ${sum('¼ × 2 × π × 10 = 20π/4 = 5π')}`,
        `<p><strong>Write the plain numbers and the π part side by side.</strong> They cannot be added into one number.</p>
         ${ans('20+5pi')}`
      )}
      ${tip('Collect plain numbers together and π parts together: 6 + 2π + 4 + 3π = 10 + 5π. Type it as 10+5pi.')}`,

    // =====================================================================
    // 10E Units of area and area of rectangles
    // =====================================================================
    // 10E Q1, Q2, Q14: counting squares
    '10e-count': `
      <p class="hp-tag">Worked example: find the area of the shaded shape on a centimetre grid.</p>
      ${D([
        { poly: [[0, 0], [5, 0], [5, 1], [4, 2], [1, 2], [0, 1]], fill: true }, ...gridLines(5, 3),
        { poly: [[0, 0], [5, 0], [5, 1], [4, 2], [1, 2], [0, 1]] }
      ], 'A six-sided shape on a 1 cm grid: 8 whole squares and 2 half squares.', 34)}
      ${steps(
        `<p><strong>Count the whole squares.</strong> 5 in the bottom row and 3 in the top row.</p>
         ${sum('5 + 3 = 8')}`,
        `<p><strong>Pair up the half squares.</strong> Each corner triangle is half a square, and two halves make one.</p>
         ${sum('2 halves = 1')}`,
        `<p><strong>Add them.</strong> Area is in square units.</p>
         ${sum('8 + 1 = 9 cm²')}
         ${ans('9')}`
      )}
      ${tip('A triangle that cuts a rectangle along its diagonal is exactly half of that rectangle. Find the rectangle\'s area and halve it.')}`,

    // 10E Q3, Q6, Q7: area of rectangles and squares
    '10e-rect': `
      <p class="hp-tag">Worked example: find the area of (a) a rectangle <b>9 cm</b> by <b>6.5 cm</b>, (b) a square of side <b>2.5 m</b>.</p>
      ${D([
        { poly: [[0, 0], [9, 0], [9, 6.5], [0, 6.5]], fill: true },
        { dim: [0, 0, 9, 0], label: '9 cm', off: -0.5 }, { dim: [9, 0, 9, 6.5], label: '6.5 cm', off: -0.5 }
      ], 'A rectangle 9 cm by 6.5 cm.', 18)}
      ${steps(
        `<p><strong>Area of a rectangle = length × width.</strong></p>
         ${sum('(a) 9 × 6.5 = 58.5 cm²')}`,
        `<p><strong>A square has equal sides</strong>, so multiply the side by itself.</p>
         ${sum('(b) 2.5 × 2.5 = 6.25 m²')}
         ${ans('58.5 and 6.25')}`
      )}
      ${tip('Both lengths must be in the same unit before you multiply. The answer is in square units: cm², m², km².')}`,

    // 10E Q8, Q10, Q11: area problems (tiles, cost, paint)
    '10e-problems': `
      <p class="hp-tag">Worked example: a wall is <b>6 m</b> long and <b>2.5 m</b> high. It needs <b>2 coats</b> of paint. One litre covers <b>8 m²</b>. How many whole litres must be bought?</p>
      ${steps(
        `<p><strong>Find the area of the wall.</strong></p>
         ${sum('6 × 2.5 = 15 m²')}`,
        `<p><strong>Two coats means painting it twice.</strong></p>
         ${sum('15 × 2 = 30 m²')}`,
        `<p><strong>How many litres?</strong> Divide by what one litre covers, then round <b>up</b>, because 3 litres would not be enough.</p>
         ${sum('30 ÷ 8 = 3.75 → 4')}
         ${ans('4')}`
      )}
      ${tip('Cost of carpet or turf: area × price per m². Tiles: area of one tile × the number of tiles.')}`,

    // 10E Q4, Q9, Q15, Q16: squares, side length, area and perimeter
    '10e-square': `
      <p class="hp-tag">Worked example: (a) a square has area <b>64 cm²</b>. Find its side. (b) A square has perimeter <b>40 m</b>. Find its area.</p>
      ${steps(
        `<p><strong>(a) Which number times itself gives 64?</strong> Try some: 9 × 9 = 81 is too big.</p>
         ${sum('8 × 8 = 64, so the side is 8 cm')}`,
        `<p><strong>(b) Four equal sides share the perimeter.</strong></p>
         ${sum('40 ÷ 4 = 10 m')}`,
        `<p><strong>Then square the side.</strong></p>
         ${sum('10 × 10 = 100 m²')}
         ${ans('8 and 100')}`
      )}
      ${tip('If every side of a square doubles, the area is 2 × 2 = 4 times as big. To type a squared bracket, use ^2, like (k+1)^2.')}`,

    // 10E Q5, Q12, Q17: hectares and converting area units
    '10e-units': `
      <p class="hp-tag">Worked example: a hectare is a square <b>100 m</b> by <b>100 m</b>. Find the area of a paddock <b>400 m</b> by <b>250 m</b>, in hectares.</p>
      ${steps(
        `<p><strong>One hectare in m²:</strong></p>
         ${sum('100 × 100 = 10 000 m²')}`,
        `<p><strong>Find the area in m².</strong></p>
         ${sum('400 × 250 = 100 000 m²')}`,
        `<p><strong>Change to a bigger unit by dividing.</strong></p>
         ${sum('100 000 ÷ 10 000 = 10 ha')}
         ${ans('10')}`
      )}
      ${tip('For other squared units, draw a square 1 unit long and change each side into the smaller unit first, then multiply the two sides. The number for area is the length number squared.')}`,

    // 10E Q13: missing side from the area
    '10e-missing': `
      <p class="hp-tag">Worked example: a rectangle has area <b>56 cm²</b> and one side <b>7 cm</b>. Find the other side.</p>
      ${D([
        { poly: [[0, 0], [8, 0], [8, 7], [0, 7]], fill: true },
        { dim: [0, 0, 8, 0], label: '?', off: -0.5 }, { dim: [8, 0, 8, 7], label: '7 cm', off: -0.5 },
        { label: 'A = 56 cm²', at: [4, 3.5] }
      ], 'A rectangle with area 56 square cm, one side 7 cm and the other side unknown.', 20)}
      ${steps(
        `<p><strong>Area = length × width, so 7 × ? = 56.</strong> Undo the times by dividing.</p>
         ${sum('56 ÷ 7 = 8')}`,
        `<p><strong>Check:</strong> 7 × 8 = 56. ✓</p>
         ${ans('8')}`
      )}
      ${tip('Decimals work the same way: divide the area by the side you know.')}`,

    // =====================================================================
    // 10F Area of parallelograms
    // =====================================================================
    // 10F Q1, Q2, Q3, Q4, Q6: area = base × height
    '10f-area': `
      <p class="hp-tag">Worked example: find the area of this parallelogram.</p>
      ${D([
        { poly: [[0, 0], [7.5, 0], [10.5, 4], [3, 4]], fill: true },
        { seg: [3, 4, 3, 0], dash: true }, { angle: [3, 0, 0, 90], right: true },
        { dim: [0, 0, 7.5, 0], label: '7.5 cm', off: -0.5 },
        { label: '4 cm', at: [3.2, 2], anchor: 'start' }, { label: '5 cm', at: [1.2, 2.4], anchor: 'end' }
      ], 'A parallelogram with base 7.5 cm, slanted side 5 cm and dashed height 4 cm.', 28)}
      ${steps(
        `<p><strong>Find the base and the height.</strong> The height is the dashed line that meets the base at a right angle: 4 cm. The slanted side (5 cm) is <b>not</b> the height.</p>`,
        `<p><strong>Area = base × height.</strong></p>
         ${sum('7.5 × 4 = 30 cm²')}
         ${ans('30')}`
      )}
      ${tip('Cut the triangle off one end and slide it to the other: you get a rectangle, base × height. The height can be drawn outside the shape; it still counts.')}`,

    // 10F Q5: parallelograms on a grid
    '10f-grid': `
      <p class="hp-tag">Worked example: find the area of this parallelogram on a 1 cm grid.</p>
      ${D([
        { poly: [[0, 0], [5, 0], [7, 3], [2, 3]], fill: true }, ...gridLines(7, 4),
        { poly: [[0, 0], [5, 0], [7, 3], [2, 3]] }
      ], 'A parallelogram on a 1 cm grid with a base of 5 squares and a height of 3 squares.', 30)}
      ${steps(
        `<p><strong>Count the base along a grid line.</strong> The bottom edge covers 5 squares.</p>`,
        `<p><strong>Count the height straight up</strong>, not along the slope: 3 squares.</p>
         ${sum('5 × 3 = 15 cm²')}
         ${ans('15')}`
      )}
      ${tip('If two sides go straight up and down, use one of those as the base and count the height across.')}`,

    // 10F Q7, Q8: missing base or height
    '10f-missing': `
      <p class="hp-tag">Worked example: a parallelogram has area <b>35 m²</b> and base <b>7 m</b>. Find its height.</p>
      ${steps(
        `<p><strong>Area = base × height, so 7 × height = 35.</strong></p>`,
        `<p><strong>Undo the times by dividing.</strong></p>
         ${sum('35 ÷ 7 = 5')}
         ${ans('5')}`
      )}
      ${tip('To find the base, divide the area by the height instead. Check by multiplying back: 7 × 5 = 35. ✓')}`,

    // 10F Q9, Q10, Q14: problems with parallelograms
    '10f-problems': `
      <p class="hp-tag">Worked example: a wall shaped like a parallelogram has base <b>15 m</b> and height <b>6 m</b>. One litre of paint covers <b>5 m²</b> and costs <b>$20</b>. Find the cost of painting it.</p>
      ${steps(
        `<p><strong>Area of the wall.</strong></p>
         ${sum('15 × 6 = 90 m²')}`,
        `<p><strong>Litres needed.</strong></p>
         ${sum('90 ÷ 5 = 18 L')}`,
        `<p><strong>Cost.</strong></p>
         ${sum('18 × 20 = 360')}
         ${ans('360')}`
      )}
      ${tip('For a stripe on a flag, the rest of the flag is the whole rectangle take away the stripe. Add up every face when a solid has several parallelogram and rectangle sides.')}`,

    // 10F Q11, Q12, Q13: comparing shapes and halves
    '10f-reason': `
      <p class="hp-tag">Worked example: a rectangle and a parallelogram both have sides <b>5 cm</b> and <b>3 cm</b>. The parallelogram's height is <b>2 cm</b>. Which has the larger area?</p>
      ${D([
        { poly: [[0, 0], [5, 0], [5, 3], [0, 3]], fill: true },
        { poly: [[7, 0], [12, 0], [14.236, 2], [9.236, 2]], fill: true },
        { seg: [9.236, 2, 9.236, 0], dash: true },
        { label: '5', at: [2.5, -0.45] }, { label: '3', at: [-0.3, 1.5], anchor: 'end' },
        { label: '5', at: [9.5, -0.45] }, { label: '3', at: [7.65, 1.35], anchor: 'end' }, { label: '2', at: [9.4, 1], anchor: 'start' }
      ], 'A 5 by 3 rectangle beside a parallelogram with sides 5 and 3 and height 2.', 26)}
      ${steps(
        `<p><strong>Rectangle:</strong> the 3 cm side stands straight up, so it is the height.</p>
         ${sum('5 × 3 = 15 cm²')}`,
        `<p><strong>Parallelogram:</strong> the 3 cm side leans over, so the height is less.</p>
         ${sum('5 × 2 = 10 cm²')}
         ${ans('The rectangle')}`
      )}
      ${tip('A diagonal cuts a parallelogram into two identical triangles, so each triangle is half of it. When typing letters, use * for times and / for divide, like l*w/3.')}`,

    // =====================================================================
    // 10G Area of triangles
    // =====================================================================
    // 10G Q1, Q2, Q3, Q4: area = ½ × base × height
    '10g-area': `
      <p class="hp-tag">Worked example: find the area of each triangle.</p>
      ${fig(
        { kind: 'diagram', unit: 22, alt: 'A triangle with base 10 cm and height 7 cm inside it', items: [
          { poly: [[0, 0], [10, 0], [3.5, 7]], fill: true }, { seg: [3.5, 7, 3.5, 0], dash: true }, { angle: [3.5, 0, 0, 90], right: true },
          { dim: [0, 0, 10, 0], label: '10 cm', off: -0.5 }, { label: '7 cm', at: [3.7, 3.5], anchor: 'start' }] },
        { kind: 'diagram', unit: 22, alt: 'A triangle with base 5.5 cm and height 4 cm drawn outside it', items: [
          { poly: [[0, 0], [5.5, 0], [7.5, 4]], fill: true }, { seg: [5.5, 0, 7.5, 0], dash: true }, { seg: [7.5, 4, 7.5, 0], dash: true },
          { angle: [7.5, 0, 90, 180], right: true }, { dim: [0, 0, 5.5, 0], label: '5.5 cm', off: -0.5 }, { label: '4 cm', at: [7.75, 2], anchor: 'start' }] }
      )}
      ${steps(
        `<p><strong>Find the base and the perpendicular height</strong> (the dashed line at a right angle to the base).</p>`,
        `<p><strong>A triangle is half a rectangle</strong>, so multiply base by height and halve.</p>
         ${sum('½ × 10 × 7 = 35 cm²')}`,
        `<p><strong>The height can be outside the triangle.</strong> Use the base itself (5.5), not the dashed extension.</p>
         ${sum('½ × 5.5 × 4 = 11 cm²')}
         ${ans('35 and 11')}`
      )}
      ${tip('In a right-angled triangle, the two sides that make the right angle are the base and the height. The longest side is never the height.')}`,

    // 10G Q5: triangles on a grid
    '10g-grid': `
      <p class="hp-tag">Worked example: find the area of this triangle on a 1 cm grid.</p>
      ${D([
        { poly: [[0, 0], [6, 0], [4, 3]], fill: true }, ...gridLines(6, 4),
        { poly: [[0, 0], [6, 0], [4, 3]] }, { seg: [4, 3, 4, 0], dash: true }
      ], 'A triangle on a 1 cm grid with base 6 squares and height 3 squares.', 30)}
      ${steps(
        `<p><strong>Count the base along a grid line</strong>: 6 squares. Count the height straight up to the top corner: 3 squares.</p>`,
        `<p><strong>Use ½ × base × height.</strong></p>
         ${sum('½ × 6 × 3 = 9 cm²')}
         ${ans('9')}`
      )}
      ${tip('If the grid is tilted, turn your head so a grid line is flat, and count along the lines. A side going straight up can be the base too.')}`,

    // 10G Q6, Q7, Q8, Q9, Q10: triangle area problems
    '10g-problems': `
      <p class="hp-tag">Worked example: a triangular garden bed has base <b>8 m</b> and height <b>4.5 m</b>. Turf costs <b>$15 per m²</b>. Find the cost of turfing it.</p>
      ${steps(
        `<p><strong>Area of the triangle.</strong></p>
         ${sum('½ × 8 × 4.5 = 18 m²')}`,
        `<p><strong>Multiply by the price of one square metre.</strong></p>
         ${sum('18 × 15 = 270')}
         ${ans('270')}`
      )}
      ${tip('A rectangle cut along its diagonal makes two triangles, each half the rectangle. For "the difference", find both areas and take the smaller from the larger. For several equal faces, find one and multiply.')}`,

    // 10G Q11, Q14: missing base or height
    '10g-missing': `
      <p class="hp-tag">Worked example: a triangle has area <b>21 cm²</b> and base <b>6 cm</b>. Find its height.</p>
      ${steps(
        `<p><strong>The triangle is half a rectangle</strong>, so the rectangle would be double.</p>
         ${sum('21 × 2 = 42')}`,
        `<p><strong>Base × height = 42, so divide by the base.</strong></p>
         ${sum('42 ÷ 6 = 7')}
         ${ans('7')}`
      )}
      ${tip('Check: ½ × 6 × 7 = 21. ✓ To type a formula, use letters with no × signs and / for divide, like 2A/b.')}`,

    // 10G Q12, Q13: same base and height, same area
    '10g-reason': `
      <p class="hp-tag">Worked example: three triangles share the base <b>AB = 4 cm</b>, and each top corner is on a line <b>3 cm</b> above it. Compare their areas.</p>
      ${D([
        { seg: [-2, 3, 8, 3], dash: true },
        { poly: [[0, 0], [4, 0], [-1, 3]] }, { poly: [[0, 0], [4, 0], [2, 3]], fill: true }, { poly: [[0, 0], [4, 0], [6.5, 3]] },
        { point: [0, 0], name: 'A', pos: 'sw' }, { point: [4, 0], name: 'B', pos: 'se' }
      ], 'Three triangles on the same base AB, with top corners on a dashed line parallel to AB.', 34)}
      ${steps(
        `<p><strong>Area uses only the base and the height.</strong> All three have base 4 cm. The dashed line is parallel to AB, so every top corner is 3 cm above it.</p>`,
        `<p><strong>So they all give the same answer.</strong></p>
         ${sum('½ × 4 × 3 = 6 cm²')}
         ${ans('All 6 cm²')}`
      )}
      ${tip('Leaning a triangle over does not change its area, as long as the base and height stay the same.')}`,

    // =====================================================================
    // 10H Area of composite shapes
    // =====================================================================
    // 10H Q1, Q2, Q3, Q5, Q10: adding simpler shapes
    '10h-add': `
      <p class="hp-tag">Worked example: find the area of this house shape.</p>
      ${D([
        { poly: [[0, 0], [7, 0], [7, 4], [3.5, 7], [0, 4]], fill: true },
        { seg: [0, 4, 7, 4], dash: true }, { seg: [3.5, 7, 3.5, 4], dash: true },
        { dim: [0, 0, 7, 0], label: '7 m', off: -0.5 }, { dim: [7, 0, 7, 4], label: '4 m', off: -0.5 },
        { label: '3 m', at: [3.7, 5.4], anchor: 'start' }
      ], 'A rectangle 7 m by 4 m with a triangle on top of height 3 m.', 26)}
      ${steps(
        `<p><strong>Split it into shapes you know.</strong> A rectangle at the bottom and a triangle on top.</p>`,
        `<p><strong>Find each area.</strong></p>
         ${sum('rectangle: 7 × 4 = 28<br>triangle: ½ × 7 × 3 = 10.5')}`,
        `<p><strong>Add them.</strong></p>
         ${sum('28 + 10.5 = 38.5 m²')}
         ${ans('38.5')}`
      )}
      ${tip('An L shape splits into two rectangles. A trapezium splits into a rectangle and two triangles. Mark the split with a line before you start.')}`,

    // 10H Q6, Q8: finding missing lengths first
    '10h-missing': `
      <p class="hp-tag">Worked example: find the area. Some lengths are missing.</p>
      ${D([
        { poly: [[0, 0], [11, 0], [11, 3], [4, 3], [4, 8], [0, 8]], fill: true },
        { seg: [4, 0, 4, 3], dash: true },
        { dim: [0, 0, 11, 0], label: '11 cm', off: -0.5 }, { dim: [11, 0, 11, 3], label: '3 cm', off: -0.5 },
        { dim: [4, 8, 0, 8], label: '4 cm', off: -0.5 }, { dim: [0, 8, 0, 0], label: '8 cm', off: -0.5 }
      ], 'An L shape: bottom 11 cm, right 3 cm, top 4 cm, left 8 cm, split by a dashed line.', 22)}
      ${steps(
        `<p><strong>Split it with the dashed line</strong> into a tall rectangle and a flat one.</p>`,
        `<p><strong>Find the missing length</strong> from the sides opposite.</p>
         ${sum('flat rectangle width: 11 − 4 = 7')}`,
        `<p><strong>Find each area, then add.</strong></p>
         ${sum('4 × 8 = 32<br>7 × 3 = 21<br>32 + 21 = 53 cm²')}
         ${ans('53')}`
      )}
      ${tip('For a cost, find the whole area first, then multiply by the price per m².')}`,

    // 10H Q4, Q7: taking away a hole or a corner
    '10h-subtract': `
      <p class="hp-tag">Worked example: a rectangle <b>11 cm</b> by <b>5 cm</b> has a rectangular hole <b>3 cm</b> by <b>2.5 cm</b>. Find the shaded area.</p>
      ${D([
        { poly: [[0, 0], [11, 0], [11, 5], [0, 5]], fill: true },
        { poly: [[6, 1.25], [9, 1.25], [9, 3.75], [6, 3.75]] },
        { dim: [0, 0, 11, 0], label: '11 cm', off: -0.5 }, { dim: [11, 0, 11, 5], label: '5 cm', off: -0.5 },
        { label: '3 cm', at: [7.5, 4.15] }, { label: '2.5 cm', at: [5.8, 2.5], anchor: 'end' }
      ], 'An 11 cm by 5 cm rectangle with a 3 cm by 2.5 cm hole.', 22)}
      ${steps(
        `<p><strong>Find the area of the whole outside shape.</strong></p>
         ${sum('11 × 5 = 55')}`,
        `<p><strong>Find the area of the hole.</strong></p>
         ${sum('3 × 2.5 = 7.5')}`,
        `<p><strong>Take the hole away.</strong></p>
         ${sum('55 − 7.5 = 47.5 cm²')}
         ${ans('47.5')}`
      )}
      ${tip('Several equal holes: find one, multiply by how many, then take that away. A missing corner works the same way as a hole.')}`,

    // 10H Q11: a halving pattern that goes on forever
    '10h-pattern': `
      <p class="hp-tag">Worked example: continue the pattern <b>3/5, 3/10, 3/20, ...</b> for three more numbers.</p>
      ${steps(
        `<p><strong>Find the rule.</strong> Each number is half the one before: the top stays the same and the bottom doubles.</p>`,
        `<p><strong>Keep doubling the bottom.</strong></p>
         ${sum('20 × 2 = 40, 40 × 2 = 80, 80 × 2 = 160')}
         ${ans('3/40, 3/80, 3/160')}`
      )}
      <p><strong>Adding forever:</strong> 0.9 + 0.09 + 0.009 + ... gives 0.9, 0.99, 0.999, ... Each total gets closer to 1, but never goes past it.</p>
      ${tip('Type a list of fractions with commas between, like 1/3, 1/9. Halving can always go on: there is no smallest piece.')}`,

    // =====================================================================
    // 10I Volume of rectangular prisms
    // =====================================================================
    // 10I Q1, Q2, Q3, Q4, Q5, Q6, Q10: V = l × w × h
    '10i-volume': `
      <p class="hp-tag">Worked example: find the volume of this rectangular prism.</p>
      ${D(box(7, 2.5, 4, ['7 cm', '2.5 cm', '4 cm']), 'A rectangular prism 7 cm long, 4 cm wide and 2.5 cm high.', 32)}
      ${steps(
        `<p><strong>Find the three edge lengths</strong>: length, width (going back) and height.</p>`,
        `<p><strong>Multiply them.</strong> The order does not matter.</p>
         ${sum('V = 7 × 4 × 2.5 = 70 cm³')}
         ${ans('70')}`
      )}
      ${tip('A cube has all edges equal: a 5 cm cube has V = 5 × 5 × 5 = 125 cm³. If you only know one face of a cube, find its side first, then cube it.')}`,

    // 10I Q7, Q9: solids made of more than one prism
    '10i-composite': `
      <p class="hp-tag">Worked example: find the volume of this L-shaped solid. It is 4 cm deep.</p>
      ${D([
        { poly: [[7, 0], [7, 2], [8.8, 3.28], [8.8, 1.28]], fill: true },
        { poly: [[7, 2], [3, 2], [4.8, 3.28], [8.8, 3.28]], fill: true },
        { poly: [[3, 2], [3, 5], [4.8, 6.28], [4.8, 3.28]], fill: true },
        { poly: [[3, 5], [0, 5], [1.8, 6.28], [4.8, 6.28]], fill: true },
        { poly: [[0, 0], [7, 0], [7, 2], [3, 2], [3, 5], [0, 5]], fill: true },
        { seg: [0, 2, 3, 2], dash: true },
        { dim: [0, 0, 7, 0], label: '7 cm', off: -0.5 }, { dim: [7, 0, 8.8, 1.28], label: '4 cm', off: -0.5 },
        { dim: [8.8, 1.28, 8.8, 3.28], label: '2 cm', off: -0.5 }, { dim: [0, 5, 0, 0], label: '5 cm', off: -0.5 },
        { label: '3 cm', at: [1.5, 4.4] }
      ], 'An L-shaped solid 4 cm deep: a bottom block 7 by 4 by 2 and a top block 3 by 4 by 3.', 28)}
      ${steps(
        `<p><strong>Split it into two boxes</strong> along the dashed line.</p>
         ${sum('bottom: 7 × 4 × 2 = 56')}`,
        `<p><strong>The top box</strong> is 3 wide, 4 deep and 5 − 2 = 3 high.</p>
         ${sum('top: 3 × 4 × 3 = 36')}`,
        `<p><strong>Add.</strong></p>
         ${sum('56 + 36 = 92 cm³')}
         ${ans('92')}`
      )}
      ${tip('With a hole or tunnel, find the big box and take away the hole. For a box made of thick wood, the inside is shorter by two thicknesses in every direction.')}`,

    // 10I Q8: how many small boxes fit
    '10i-packing': `
      <p class="hp-tag">Worked example: a carton is <b>60 cm</b> long, <b>40 cm</b> wide and <b>30 cm</b> high. How many boxes <b>20 cm</b> by <b>10 cm</b> by <b>10 cm</b> fit, all facing the same way?</p>
      ${steps(
        `<p><strong>Count how many fit along each edge.</strong> Line up length with length, and so on.</p>
         ${sum('60 ÷ 20 = 3<br>40 ÷ 10 = 4<br>30 ÷ 10 = 3')}`,
        `<p><strong>Multiply: rows × columns × layers.</strong></p>
         ${sum('3 × 4 × 3 = 36')}
         ${ans('36')}`
      )}
      ${tip('Counting along each edge is safest. Dividing one volume by the other only works when the boxes fit exactly with no gaps.')}`,

    // 10I Q11: half a prism cut along a diagonal
    '10i-half': `
      <p class="hp-tag">Worked example: a prism <b>7 cm</b> long, <b>2 cm</b> deep and <b>3 cm</b> high is cut in half along the diagonal of its front face. Find the volume of one half.</p>
      ${D([
        ...wedge(7, 3, 2, ['7 cm', '3 cm', '2 cm']),
        { seg: [7, 0, 7, 3], dash: true }, { seg: [0, 3, 7, 3], dash: true },
        { seg: [7, 3, 7.9, 3.64], dash: true }, { seg: [0.9, 3.64, 7.9, 3.64], dash: true }, { seg: [7.9, 3.64, 7.9, 0.64], dash: true }
      ], 'A triangular half of a rectangular prism 7 cm by 2 cm by 3 cm; dashed lines show the removed half.', 30)}
      ${steps(
        `<p><strong>Find the volume of the whole prism.</strong></p>
         ${sum('7 × 2 × 3 = 42 cm³')}`,
        `<p><strong>The cut makes two identical halves.</strong></p>
         ${sum('42 ÷ 2 = 21 cm³')}
         ${ans('21')}`
      )}
      ${tip('Read which edge is long, deep and high from the words, not just the picture. All three still get multiplied.')}`,

    // 10I Q12: finding the height from the volume
    '10i-height': `
      <p class="hp-tag">Worked example: a prism has volume <b>56 cm³</b>, length <b>7 cm</b> and width <b>2 cm</b>. Find its height.</p>
      ${steps(
        `<p><strong>Multiply the two lengths you know.</strong> That is the area of the base.</p>
         ${sum('7 × 2 = 14')}`,
        `<p><strong>14 × height = 56, so divide.</strong></p>
         ${sum('56 ÷ 14 = 4')}
         ${ans('4')}`
      )}
      ${tip('Check: 7 × 2 × 4 = 56. ✓ When typing a rule that divides by two letters multiplied together, put them in brackets, like A/(b*c).')}`,

    // 10I Q13: how many small cubes make a big one
    '10i-units': `
      <p class="hp-tag">Worked example: a cube with edges <b>3 cm</b> is cut into cubes with edges <b>1 cm</b>. How many small cubes are there?</p>
      ${steps(
        `<p><strong>Along one edge</strong>, 3 small cubes fit.</p>`,
        `<p><strong>One layer on the base</strong> is 3 rows of 3.</p>
         ${sum('3 × 3 = 9')}`,
        `<p><strong>There are 3 layers.</strong></p>
         ${sum('9 × 3 = 27')}
         ${ans('27')}`
      )}
      ${tip('Once you know how many small cubes make one big cube, multiply by that number to change into the smaller unit, and divide by it to change into the bigger one.')}`,

    // =====================================================================
    // 10J Volume of triangular prisms
    // =====================================================================
    // 10J Q1, Q2, Q3, Q4, Q5, Q6, Q7: area of triangle × length
    '10j-volume': `
      <p class="hp-tag">Worked example: find the volume of this triangular prism.</p>
      ${D(wedge(9, 4, 6, ['9 cm', '4 cm', '6 cm']), 'A triangular prism: the triangle has base 9 cm and height 4 cm, and the prism is 6 cm long.', 28)}
      ${steps(
        `<p><strong>Find the area of the triangle</strong> (the end face).</p>
         ${sum('½ × 9 × 4 = 18 cm²')}`,
        `<p><strong>Multiply by the length of the prism</strong> (the edge joining the two triangles).</p>
         ${sum('18 × 6 = 108 cm³')}
         ${ans('108')}`
      )}
      ${tip('If the lengths are in different units, change them all to the unit the answer needs first. The height of the triangle may be drawn outside it.')}`,

    // 10J Q8, Q9: solids made of rectangular and triangular prisms
    '10j-composite': `
      <p class="hp-tag">Worked example: find the volume of this shed. It is <b>4 m</b> deep.</p>
      ${D([
        { poly: [[5, 0], [5, 2.5], [6.8, 3.78], [6.8, 1.28]], fill: true },
        { poly: [[5, 2.5], [2.5, 4.5], [4.3, 5.78], [6.8, 3.78]], fill: true },
        { poly: [[0, 0], [5, 0], [5, 2.5], [2.5, 4.5], [0, 2.5]], fill: true },
        { seg: [0, 2.5, 5, 2.5], dash: true }, { seg: [2.5, 4.5, 2.5, 2.5], dash: true },
        { dim: [0, 0, 5, 0], label: '5 m', off: -0.5 }, { dim: [5, 0, 6.8, 1.28], label: '4 m', off: -0.5 },
        { dim: [0, 2.5, 0, 0], label: '2.5 m', off: -0.5 }, { label: '2 m', at: [2.7, 3.5], anchor: 'start' }
      ], 'A shed: a box 5 m wide, 2.5 m high and 4 m deep with a triangular roof 2 m high.', 30)}
      ${steps(
        `<p><strong>The bottom is a rectangular prism.</strong></p>
         ${sum('5 × 4 × 2.5 = 50')}`,
        `<p><strong>The roof is a triangular prism.</strong> Triangle area, then × the depth.</p>
         ${sum('½ × 5 × 2 = 5, then 5 × 4 = 20')}`,
        `<p><strong>Add.</strong></p>
         ${sum('50 + 20 = 70 m³')}
         ${ans('70')}`
      )}
      ${tip('For air space left in a box, find the box volume, then take away the total volume of everything inside it.')}`,

    // 10J Q10, Q11, Q12: missing measurement from the volume
    '10j-missing': `
      <p class="hp-tag">Worked example: a triangular prism has volume <b>72 cm³</b> and length <b>8 cm</b>. Its triangle has height <b>3 cm</b>. Find the triangle's base.</p>
      ${steps(
        `<p><strong>Volume = area of triangle × length, so divide by the length.</strong></p>
         ${sum('area of triangle = 72 ÷ 8 = 9 cm²')}`,
        `<p><strong>The triangle is half a rectangle</strong>, so base × height is double the area.</p>
         ${sum('9 × 2 = 18')}`,
        `<p><strong>Divide by the height.</strong></p>
         ${sum('18 ÷ 3 = 6')}
         ${ans('6')}`
      )}
      ${tip('Check by working forwards: ½ × 6 × 3 = 9, and 9 × 8 = 72. ✓')}`,

    // 10J Q13: writing and rearranging volume rules
    '10j-rules': `
      <p class="hp-tag">Worked example: a box has length <b>a</b>, width <b>c</b> and height <b>k</b>. Write a rule for its volume <b>V</b>, then a rule for <b>a</b>.</p>
      ${steps(
        `<p><strong>Write the rule in words, then letters.</strong> Volume is length × width × height.</p>
         ${sum('V = a × c × k = ack')}`,
        `<p><strong>To get a on its own, undo "× c × k" by dividing by both.</strong></p>
         ${sum('a = V/(ck)')}
         ${ans('V/(ck)')}`
      )}
      <p><strong>Using a rule:</strong> a triangular prism has V = 70, b = 7 and h = 4. The triangle's area is ½ × 7 × 4 = 14, so its length is 70 ÷ 14 = 5.</p>
      ${tip('Type letters with no × signs. A half can be typed as /2 at the end. Put brackets round everything you divide by.')}`,

    // =====================================================================
    // 10K Capacity
    // =====================================================================
    // 10K Q1, Q2, Q5, Q6: converting capacity units
    '10k-convert': `
      ${flow(['start', 'ML'], ['× 1000', 'kL'], ['× 1000', 'L'], ['× 1000', 'mL'])}
      <p>Every step is 1000. Going right (to a smaller unit) multiply; going left, divide.</p>
      <p class="hp-tag">Worked example: convert <b>3.75 L</b> to mL, <b>820 L</b> to kL, and <b>1.2 kL</b> to mL.</p>
      ${steps(
        `<p><strong>L to mL is one step right.</strong></p>
         ${sum('3.75 × 1000 = 3750 mL')}`,
        `<p><strong>L to kL is one step left.</strong></p>
         ${sum('820 ÷ 1000 = 0.82 kL')}`,
        `<p><strong>kL to mL is two steps right</strong>, so multiply twice.</p>
         ${sum('1.2 kL × 1000 = 1200 L<br>1200 L × 1000 = 1 200 000 mL')}
         ${ans('3750, 0.82 and 1200000')}`
      )}
      ${tip('Type big answers with no spaces: 1200000. A "megalitre" (ML) is a million litres.')}`,

    // 10K Q3: reading a scale on a container
    '10k-scale': `
      <p class="hp-tag">Worked example: how much water is in the jug?</p>
      ${D([
        { poly: [[0, 0], [2.4, 0], [2.4, 6.8], [0, 6.8]], fill: true },
        { poly: [[0, 9], [0, 0], [2.4, 0], [2.4, 9]], open: true },
        ...Array.from({ length: 21 }, (_, i) => ({ seg: [0, q(i * 0.4), i % 5 === 0 ? 0.6 : 0.3, q(i * 0.4)] })),
        ...[100, 200, 300, 400].map((v) => ({ label: String(v), at: [0.8, q(v / 50 - 0.12)], anchor: 'start' })),
        { label: 'mL', at: [2.9, 8.6], anchor: 'start' }
      ], 'A measuring jug marked every 100 mL with small marks every 20 mL. The water reaches 2 small marks above 300.', 26)}
      ${steps(
        `<p><strong>Find what one small gap is worth.</strong> From 300 to 400 there are 5 gaps.</p>
         ${sum('100 ÷ 5 = 20 mL per gap')}`,
        `<p><strong>Count up from the last label.</strong> The water is 2 gaps above 300.</p>
         ${sum('300 + 2 × 20 = 340')}
         ${ans('340')}`
      )}
      ${tip('Read the unit on the scale (mL, L or m³). Some scales jump in 10s, 25s or halves, so always work out the gap first.')}`,

    // 10K Q4, Q9, Q10, Q11, Q12: capacity problems and rates
    '10k-problems': `
      <p class="hp-tag">Worked example: a fish tank pump moves <b>40 mL</b> of water every minute. How many litres does it move in <b>2 hours</b>?</p>
      ${steps(
        `<p><strong>Match the time units.</strong> The rate is per minute.</p>
         ${sum('2 hours = 2 × 60 = 120 minutes')}`,
        `<p><strong>Multiply the rate by the time.</strong></p>
         ${sum('40 × 120 = 4800 mL')}`,
        `<p><strong>Change to litres.</strong></p>
         ${sum('4800 ÷ 1000 = 4.8 L')}
         ${ans('4.8')}`
      )}
      ${tip('"How long will it last?" means divide the total by the amount used each time, in the same units. A 2 L bottle fills 2000 ÷ 250 = 8 glasses of 250 mL.')}`,

    // 10K Q7, Q8: volume into capacity
    '10k-volume': `
      ${chips(['1 cm³ = 1 mL'], ['1000 cm³ = 1 L'], ['1 m³ = 1000 L'])}
      <p class="hp-tag">Worked example: find the capacity in litres of (a) a box <b>24 cm</b> by <b>15 cm</b> by <b>10 cm</b>, (b) a tank <b>2 m</b> by <b>1.5 m</b> by <b>0.8 m</b>.</p>
      ${steps(
        `<p><strong>Find the volume first.</strong></p>
         ${sum('(a) 24 × 15 × 10 = 3600 cm³<br>(b) 2 × 1.5 × 0.8 = 2.4 m³')}`,
        `<p><strong>Change to litres</strong> using the facts above.</p>
         ${sum('(a) 3600 ÷ 1000 = 3.6 L<br>(b) 2.4 × 1000 = 2400 L')}
         ${ans('3.6 and 2400')}`
      )}
      ${tip('cm³ goes with mL, m³ goes with kL. A container measured in metres holds a lot more than you might think.')}`,

    // 10K Q13, Q14: algebra rules for capacity
    '10k-rules': `
      <p class="hp-tag">Worked example: write <b>q millilitres</b> in litres, and <b>q kilolitres</b> in litres.</p>
      ${steps(
        `<p><strong>Ask: is the new unit bigger or smaller?</strong> A litre is bigger than a mL, so there are fewer of them: divide by 1000.</p>
         ${sum('q mL = q/1000 L')}`,
        `<p><strong>A litre is smaller than a kL</strong>, so there are more of them: multiply by 1000.</p>
         ${sum('q kL = 1000 × q = 1000q L')}
         ${ans('q/1000 and 1000q')}`
      )}
      ${tip('Test your rule with a real number: if q = 2, then 2 kL is 2000 L, and 1000 × 2 = 2000. ✓ Write the number in front of the letter: 1000q, not q1000.')}`,

    // 10K Q15: depth of water in a container
    '10k-depth': `
      <p class="hp-tag">Worked example: a container has a base <b>16 cm</b> by <b>5 cm</b>. <b>720 mL</b> of water is poured in. How deep is the water?</p>
      ${D([
        ...box(8, 6, 5, ['16 cm', '', '5 cm']).slice(0, 4),
        { dim: [8, 0, 10.25, 1.6], label: '5 cm', off: -0.5 },
        { seg: [0, 4.5, 8, 4.5], dash: true }, { label: 'water', at: [4, 2.2] }
      ], 'A box-shaped container 16 cm long and 5 cm wide with water partway up.', 22)}
      ${steps(
        `<p><strong>1 mL = 1 cm³</strong>, so the water is 720 cm³.</p>`,
        `<p><strong>Find the area of the base.</strong></p>
         ${sum('16 × 5 = 80 cm²')}`,
        `<p><strong>Volume = base area × depth, so divide.</strong></p>
         ${sum('720 ÷ 80 = 9 cm')}
         ${ans('9')}`
      )}
      ${tip('For extra water added later, find the depth of just the extra amount: divide it by the base area too.')}`,

    // =====================================================================
    // 10L Mass and temperature
    // =====================================================================
    // 10L Q1, Q2, Q5: converting mass units
    '10l-convert': `
      ${flow(['start', 't'], ['× 1000', 'kg'], ['× 1000', 'g'], ['× 1000', 'mg'])}
      <p class="hp-tag">Worked example: convert <b>2.45 kg</b> to g, <b>3400 kg</b> to t, and <b>3/4 kg</b> to g.</p>
      ${steps(
        `<p><strong>kg to g is a step right</strong>: multiply by 1000.</p>
         ${sum('2.45 × 1000 = 2450 g')}`,
        `<p><strong>kg to t is a step left</strong>: divide by 1000.</p>
         ${sum('3400 ÷ 1000 = 3.4 t')}`,
        `<p><strong>A fraction of a unit:</strong> 1 kg = 1000 g, so find 3/4 of 1000.</p>
         ${sum('1000 ÷ 4 = 250, then 250 × 3 = 750 g')}
         ${ans('2450, 3.4 and 750')}`
      )}
      ${tip('Two steps on the ladder means multiply or divide by 1000 twice. A tonne (t) is 1000 kg.')}`,

    // 10L Q3, Q4: reading scales and dials
    '10l-scale': `
      <p class="hp-tag">Worked example: what mass does the scale show?</p>
      ${D([
        { poly: [[-0.5, -1], [8.5, -1], [8.5, 1.6], [-0.5, 1.6]], fill: true },
        { seg: [0, 0, 8, 0] },
        ...Array.from({ length: 17 }, (_, i) => ({ seg: [q(i * 0.5), 0, q(i * 0.5), i % 4 === 0 ? 0.45 : 0.25] })),
        ...[0, 20, 40, 60, 80].map((v) => ({ label: String(v), at: [v / 10, -0.55] })),
        { seg: [5.5, 1.4, 5.5, 0.08], arrow: 'end' }, { label: 'kg', at: [-0.1, 1.15], anchor: 'start' }
      ], 'A scale from 0 to 80 kg, labelled every 20 with small marks every 5. The pointer is 3 small marks past 40.', 40)}
      ${steps(
        `<p><strong>Find what one small gap is worth.</strong> From 40 to 60 there are 4 gaps.</p>
         ${sum('20 ÷ 4 = 5 kg per gap')}`,
        `<p><strong>Count on from the last label.</strong> The pointer is 3 gaps past 40.</p>
         ${sum('40 + 3 × 5 = 55')}
         ${ans('55')}`
      )}
      ${tip('A dial works the same way, just bent into a circle. Check where 0 is, which way the numbers go, and the unit (kg, g, t or °C).')}`,

    // 10L Q7, Q8, Q11: changes in temperature
    '10l-temp': `
      <p class="hp-tag">Worked example: the temperature rose from <b>14°C</b> to <b>39°C</b>, then that night it fell to <b>16°C</b>. Find the rise and the drop.</p>
      ${steps(
        `<p><strong>A change is the difference</strong>: bigger take away smaller.</p>
         ${sum('rise: 39 − 14 = 25')}`,
        `<p><strong>Same for the drop.</strong></p>
         ${sum('drop: 39 − 16 = 23')}
         ${ans('25 and 23')}`
      )}
      ${tip('The range for a day is that day\'s highest take away its lowest. "Rose by" means add the rise to where it started. Type just the number, without °C.')}`,

    // 10L Q9, Q10: adding and ordering masses in mixed units
    '10l-mixed': `
      <p class="hp-tag">Worked example: (a) add <b>2 kg, 750 g, 0.004 t</b> in kg. (b) Order <b>1.5 kg, 900 g, 0.002 t</b> from smallest to largest.</p>
      ${steps(
        `<p><strong>(a) Change everything to kg, then add.</strong></p>
         ${sum('750 g = 0.75 kg, 0.004 t = 4 kg<br>2 + 0.75 + 4 = 6.75')}`,
        `<p><strong>(b) Change everything to the same unit</strong> (g works well), then order.</p>
         ${sum('1500 g, 900 g, 2000 g')}`,
        `<p><strong>Write the originals in that order</strong>, as they were written, with commas.</p>
         ${ans('6.75 and 900 g, 1.5 kg, 0.002 t')}`
      )}
      ${tip('mg are tiny: 1 g = 1000 mg, so 1 kg is a million mg.')}`,

    // 10L Q6, Q12, Q13, Q14: mass problems
    '10l-problems': `
      <p class="hp-tag">Worked example: a box holds <b>36</b> cans of beans, each <b>375 g</b>. Find the mass of the beans in kg.</p>
      ${steps(
        `<p><strong>Multiply to find the total in grams.</strong></p>
         ${sum('36 × 375 = 13 500 g')}`,
        `<p><strong>Change to kg.</strong></p>
         ${sum('13 500 ÷ 1000 = 13.5 kg')}
         ${ans('13.5')}`
      )}
      ${tip('"How many days will it last?": divide in the same units, e.g. 2 kg of rice at 80 g a day lasts 2000 ÷ 80 = 25 days. The largest load a truck can carry is its limit take away its own empty mass.')}`,

    // 10L Q15, Q16: the mass of water
    '10l-water': `
      ${chips(['1 mL of water weighs 1 g'], ['1 L of water weighs 1 kg'])}
      <p class="hp-tag">Worked example: a tank <b>50 cm</b> by <b>40 cm</b> by <b>30 cm</b> is full of water. Find the mass of the water in kg.</p>
      ${steps(
        `<p><strong>Find the volume.</strong></p>
         ${sum('50 × 40 × 30 = 60 000 cm³')}`,
        `<p><strong>Change to litres</strong> (1000 cm³ = 1 L).</p>
         ${sum('60 000 ÷ 1000 = 60 L')}`,
        `<p><strong>Each litre weighs 1 kg.</strong></p>
         ${ans('60')}`
      )}
      ${tip('Climb both ladders side by side: mL goes with g, L goes with kg, and the next step up in each goes together too.')}`,

    // 10L Q17: kelvins and degrees Celsius
    '10l-kelvin': `
      <p class="hp-tag">Worked example: write <b>310 K</b> in °C, and <b>25°C</b> in kelvins.</p>
      ${steps(
        `<p><strong>0°C is 273 K, and both scales go up in the same steps.</strong> So K is always 273 more than °C.</p>`,
        `<p><strong>K to °C: take away 273.</strong></p>
         ${sum('310 − 273 = 37°C')}`,
        `<p><strong>°C to K: add 273.</strong></p>
         ${sum('25 + 273 = 298 K')}
         ${ans('37 and 298')}`
      )}
      ${tip('Below freezing it still works: −50°C is −50 + 273 = 223 K.')}`,

    // 10L Q18: degrees Fahrenheit
    '10l-fahrenheit': `
      <p class="hp-tag">Worked example: convert <b>68°F</b> to °C using C = (F − 32) × 5/9.</p>
      ${steps(
        `<p><strong>Brackets first: take away 32.</strong></p>
         ${sum('68 − 32 = 36')}`,
        `<p><strong>Multiply by 5/9</strong>: divide by 9, then times 5.</p>
         ${sum('36 ÷ 9 = 4, then 4 × 5 = 20')}
         ${ans('20')}`
      )}
      ${tip('Below 32°F the answer is negative: 5°F gives 5 − 32 = −27, and −27 × 5/9 = −15, typed -15. To turn a rule around, undo each step in reverse order.')}`
  });
})();
