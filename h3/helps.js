/* H3 "How do I work this out?" help panels, one per TYPE of question.
 *
 * A question opts in with "help": "<id>" in bank.js, so every question of the
 * same type shares one panel and the explanation is written once. h3.js shows
 * it as a fold-out under the question until the question is answered right.
 *
 * Rule for writing these: a worked example is never one of the set's
 * questions, and no step in it works out part of one (no "4 × 6" step when
 * 4 × 6 is a question). Use numbers the set does not use where you can.
 * Check the set's prompts AND answers before picking an example.
 *
 * This is trusted, hand-written HTML (it is inserted as-is, not escaped).
 * Classes start with hp- so they cannot clash with the rest of H3. */
(function () {
  // ---------- little drawing helpers ----------
  const key = `
    <div class="hp-key" aria-label="Roman numeral values">
      <span class="hp-k"><b>I</b><span>1</span></span>
      <span class="hp-k"><b>V</b><span>5</span></span>
      <span class="hp-k"><b>X</b><span>10</span></span>
      <span class="hp-k"><b>L</b><span>50</span></span>
      <span class="hp-k"><b>C</b><span>100</span></span>
      <span class="hp-k"><b>D</b><span>500</span></span>
      <span class="hp-k"><b>M</b><span>1000</span></span>
    </div>`;

  // One place-value column: heading, value, the numerals it becomes, and why.
  const col = (h, v, r, why, pair) => `
    <div class="hp-col${pair ? ' hp-pair' : ''}"><span class="hp-h">${h}</span><span class="hp-v">${v}</span>
      <span class="hp-arrow" aria-hidden="true">▼</span><span class="hp-r">${r}</span>${why ? `<span class="hp-why">${why}</span>` : ''}</div>`;
  const tile = (n, v) => `<span class="hp-t"><b>${n}</b>${v ? `<span>${v}</span>` : ''}</span>`;
  const tip = (t) => `<div class="hp-tip"><strong>Tip</strong><span>${t}</span></div>`;
  const steps = (...s) => `<ol class="hp-steps">${s.map(x => `<li><div class="hp-step">${x}</div></li>`).join('')}</ol>`;
  const sum = (t) => `<p class="hp-sum">${t}</p>`;
  const ans = (t) => `<span class="hp-answer">${t}</span>`;
  const now = (t) => `<mark class="hp-now">${t}</mark>`;
  const flow = (...boxes) => `<div class="hp-flow" aria-hidden="true">${boxes.map(([l, t]) => `<span class="hp-box"><small>${l}</small>${t}</span>`).join('<span class="hp-to">→</span>')}</div>`;
  const chips = (...c) => `<div class="hp-chips">${c.map(([t, k]) => `<span class="hp-chip${k ? ' hp-' + k : ''}">${t}</span>`).join('')}</div>`;

  // Place-value chart: column headings, one digit per column, `hot` columns lit.
  const chart = (heads, cells, hot = []) => `
    <div class="hp-chart" style="--n:${heads.length}" aria-hidden="true">
      ${heads.map((h, i) => `<span class="hp-ch-h${hot.includes(i) ? ' hp-hot' : ''}">${h}</span>`).join('')}
      ${cells.map((c, i) => `<span class="hp-ch-d${hot.includes(i) ? ' hp-hot' : ''}">${c}</span>`).join('')}
    </div>`;

  // Column working. Each row is an array of cells, one per column (the first
  // column holds the + − × sign). A cell starting with ~ is crossed out
  // (traded away). kind 'carry' = small numbers above; 'res' = ruled line
  // above. An optional note sits to the right of the row.
  const algo = (rows) => {
    const n = Math.max(...rows.map(r => r.cells.length));
    return `<div class="hp-algo" style="--n:${n}" aria-hidden="true">${rows.map(r => r.cells.map(c => {
      const x = String(c).startsWith('~');
      return `<span class="hp-a${r.kind ? ' hp-a-' + r.kind : ''}${x ? ' hp-x' : ''}">${x ? String(c).slice(1) : c}</span>`;
    }).join('') + `<span class="hp-a-note">${r.note || ''}</span>`).join('')}</div>`;
  };
  const d = (s) => s.split('').map(c => c === ' ' ? '' : c);

  // Short division "bus stop". carries[i] is the remainder carried in front of digit i.
  const bus = (divisor, digits, quotient, carries, rem) => `
    <div class="hp-bus" style="--n:${digits.length}" aria-hidden="true">
      <span></span>${quotient.map(q => `<span class="hp-bus-q">${q}</span>`).join('')}<span class="hp-bus-r">${rem || ''}</span>
      <span class="hp-bus-d">${divisor}</span>${digits.map((x, i) => `<span class="hp-bus-n">${carries[i] ? `<sup>${carries[i]}</sup>` : ''}${x}</span>`).join('')}<span></span>
    </div>`;

  // Area model for the distributive law: side length, then [label, working, weight] parts.
  const area = (side, parts) => `
    <div class="hp-area" aria-hidden="true"><span class="hp-area-side">${side}</span>
      ${parts.map(([top, inside, w]) => `<div class="hp-area-box" style="flex:${w}"><span class="hp-area-top">${top}</span><b>${inside}</b></div>`).join('')}
    </div>`;

  // Rounding number line: the two ends, the halfway mark and where the number sits (0 to 100).
  const line = (lo, mid, hi, val, pct) => `
    <div class="hp-line" aria-hidden="true">
      <div class="hp-track"><span class="hp-mid" style="left:50%"><i></i>${mid}</span><span class="hp-dot" style="left:${pct}%"><b>${val}</b></span></div>
      <div class="hp-ends"><span>${lo}</span><span>${hi}</span></div>
    </div>`;

  const H = {
    // =====================================================================
    // 1A Place value in ancient number systems
    // =====================================================================
    // 1A Q1: numbers into Roman numerals (no take-away pairs needed yet)
    'roman-write': `
      ${key}
      <p class="hp-tag">Worked example: write <b>285</b> in Roman numerals.</p>
      <ol class="hp-steps">
        <li><div class="hp-step">
          <p><strong>Split the number by place value.</strong> Hundreds, tens and ones.</p>
          <p class="hp-sum">285 = 200 + 80 + 5</p>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Turn each part into numerals</strong>, using the biggest numerals you can.</p>
          <div class="hp-cols">
            ${col('Hundreds', '200', 'CC', '100 + 100')}
            ${col('Tens', '80', 'LXXX', '50 + 10 + 10 + 10')}
            ${col('Ones', '5', 'V', '5')}
          </div>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Join them up, biggest first.</strong></p>
          <span class="hp-answer">CCLXXXV</span>
        </div></li>
      </ol>
      <div class="hp-tip"><strong>Tip</strong><span>Check by adding it back up: 100 + 100 + 50 + 10 + 10 + 10 + 5 = 285.</span></div>`,

    // 1A Q2: Roman numerals into numbers
    'roman-read': `
      ${key}
      <p class="hp-tag">Worked example: what number is <b>CLXIV</b>?</p>
      <ol class="hp-steps">
        <li><div class="hp-step">
          <p><strong>Write the value under each numeral.</strong></p>
          <div class="hp-tiles">${tile('C', 100)}${tile('L', 50)}${tile('X', 10)}${tile('I', 1)}${tile('V', 5)}</div>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Look for a small numeral in front of a bigger one.</strong> Normally the values get smaller as you read. Here <b>I</b> (1) sits in front of <b>V</b> (5), so they make a pair and you take away: 5 − 1 = 4.</p>
          <div class="hp-tiles">${tile('C', 100)}${tile('L', 50)}${tile('X', 10)}
            <span class="hp-group"><span class="hp-tiles">${tile('I')}${tile('V')}</span><em>5 − 1 = 4</em></span></div>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Add everything up.</strong></p>
          <p class="hp-sum">100 + 50 + 10 + 4 = <span class="hp-ans">164</span></p>
        </div></li>
      </ol>
      <div class="hp-tip"><strong>Tip</strong><span>Most of these have no pairs at all, so you just add. Only stop and take away when a smaller numeral comes first.</span></div>`,

    // 1A Q3: adding and taking away with Roman numerals
    'roman-calc': `
      ${key}
      <p class="hp-tag">Worked example: <b>CXI + XXI</b></p>
      <div class="hp-flow" aria-hidden="true">
        <span class="hp-box"><small>Roman</small>CXI + XXI</span><span class="hp-to">→</span>
        <span class="hp-box"><small>Numbers</small>111 + 21</span><span class="hp-to">→</span>
        <span class="hp-box"><small>Work it out</small>132</span><span class="hp-to">→</span>
        <span class="hp-box"><small>Roman</small>CXXXII</span>
      </div>
      <ol class="hp-steps">
        <li><div class="hp-step">
          <p><strong>Change each Roman numeral into a normal number.</strong></p>
          <p class="hp-sum">CXI = 100 + 10 + 1 = 111<br>XXI = 10 + 10 + 1 = 21</p>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Do the sum the normal way.</strong></p>
          <p class="hp-sum">111 + 21 = 132</p>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Change the answer back into Roman numerals.</strong></p>
          <div class="hp-cols">
            ${col('Hundreds', '100', 'C')}
            ${col('Tens', '30', 'XXX')}
            ${col('Ones', '2', 'II')}
          </div>
          <span class="hp-answer">CXXXII</span>
        </div></li>
      </ol>
      <div class="hp-tip"><strong>Tip</strong><span>Taking away works the same way: change to numbers, take away, change back.</span></div>`,

    // 1A Q4 and Q5: word problems
    'roman-word': `
      ${key}
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A Roman ship carries <span class="hp-hl">LXXXVIII</span> barrels of olive oil. <span class="hp-hl">XXXVI</span> barrels are <span class="hp-kw">unloaded</span> at the port. How many barrels are <span class="hp-kw">left</span> on the ship?</p>
      <ol class="hp-steps">
        <li><div class="hp-step">
          <p><strong>Find the Roman numerals in the story.</strong></p>
          <p class="hp-sum">LXXXVIII = 50 + 10 + 10 + 10 + 5 + 1 + 1 + 1 = 88<br>XXXVI = 10 + 10 + 10 + 5 + 1 = 36</p>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Decide: add or take away?</strong> Look for the clue words.</p>
          <div class="hp-chips">
            <span class="hp-chip hp-add">altogether → add</span><span class="hp-chip hp-add">in total → add</span>
            <span class="hp-chip hp-take">left → take away</span><span class="hp-chip hp-take">leave → take away</span><span class="hp-chip hp-take">stay → take away</span>
          </div>
          <p>"Unloaded" and "left" mean barrels went away, so take away.</p>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Work it out, then change back to Roman numerals.</strong></p>
          <p class="hp-sum">88 − 36 = 52 = 50 + 2</p>
          <span class="hp-answer">LII</span>
        </div></li>
      </ol>
      <div class="hp-tip"><strong>Tip</strong><span>Read the question twice. The first time, just find the numerals. The second time, find what happens to them.</span></div>`,

    // 1A Q6: the take-away (subtractive) rule
    'roman-rule': `
      ${key}
      <p>There are only six take-away pairs. Any time a digit is a <strong>4</strong> or a <strong>9</strong>, you need one of them.</p>
      <div class="hp-pairs">
        <div>IV<span>4</span></div><div>IX<span>9</span></div>
        <div>XL<span>40</span></div><div>XC<span>90</span></div>
        <div>CD<span>400</span></div><div>CM<span>900</span></div>
      </div>
      <p class="hp-tag">Worked example: write <b>1948</b> in Roman numerals.</p>
      <ol class="hp-steps">
        <li><div class="hp-step">
          <p><strong>Split the number by place value.</strong></p>
          <p class="hp-sum">1948 = 1000 + 900 + 40 + 8</p>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Turn each part into numerals.</strong> A 9 or a 4 uses a pair (yellow).</p>
          <div class="hp-cols">
            ${col('Thousands', '1000', 'M', '1000')}
            ${col('Hundreds', '900', 'CM', '1000 − 100', true)}
            ${col('Tens', '40', 'XL', '50 − 10', true)}
            ${col('Ones', '8', 'VIII', '5 + 1 + 1 + 1')}
          </div>
        </div></li>
        <li><div class="hp-step">
          <p><strong>Join them up, biggest first.</strong></p>
          <span class="hp-answer">MCMXLVIII</span>
        </div></li>
      </ol>
      <div class="hp-tip"><strong>Tip</strong><span>Never write the same numeral four times in a row. If you have written IIII or XXXX, swap it for a pair.</span></div>`,

    // =====================================================================
    // 1B Place value in Hindu-Arabic numbers
    // =====================================================================
    // Q1, Q2: place value of one digit
    '1b-digit': `
      <p class="hp-tag">Worked example: what is the place value of the <b>4</b> in <b>274&nbsp;518</b>?</p>
      ${steps(
        `<p><strong>Put the number in a place-value chart</strong>, one digit per column, starting from the ones on the right.</p>
         ${chart(['100&nbsp;000', '10&nbsp;000', '1000', '100', '10', '1'], ['2', '7', '4', '5', '1', '8'], [2])}`,
        `<p><strong>Read the heading above your digit.</strong> The 4 sits in the thousands column, so it is worth 4 thousands.</p>
         ${sum('4 × 1000 = 4000')}
         ${ans('4000')}`
      )}
      ${tip('The space in 274&nbsp;518 splits off the thousands, so the digit just before the space is always in the thousands column.')}`,

    // Q3, Q4: expanded form, with and without index notation
    '1b-expand': `
      <p class="hp-tag">Worked example: write <b>5092</b> in expanded form.</p>
      ${steps(
        `<p><strong>Put the number in a place-value chart.</strong></p>
         ${chart(['1000', '100', '10', '1'], ['5', '0', '9', '2'])}`,
        `<p><strong>Multiply each digit by its column</strong>, and add the parts.</p>
         ${sum('5 × 1000 + 0 × 100 + 9 × 10 + 2 × 1')}`,
        `<p><strong>Leave out any part with a 0</strong>, since it is worth nothing.</p>
         ${ans('5 × 1000 + 9 × 10 + 2 × 1')}`
      )}
      <p><strong>Index notation</strong> writes the columns as powers of 10. The power is the number of zeros.</p>
      ${chips(['10³ = 1000'], ['10² = 100'], ['10¹ = 10'])}
      ${sum('7050 = 7 × 10³ + 5 × 10¹')}
      ${tip('Type × as x or *, and powers with ^. For example: 7 x 10^3 + 5 x 10^1')}`,

    // Q5: expanded form back to a basic numeral
    '1b-numeral': `
      <p class="hp-tag">Worked example: write <b>6 × 10&nbsp;000 + 2 × 100 + 7 × 1</b> as a basic numeral.</p>
      ${steps(
        `<p><strong>Put each digit in the column it is multiplied by.</strong></p>
         ${chart(['10&nbsp;000', '1000', '100', '10', '1'], ['6', '', '2', '', '7'])}`,
        `<p><strong>Fill every empty column with a 0.</strong></p>
         ${chart(['10&nbsp;000', '1000', '100', '10', '1'], ['6', '0', '2', '0', '7'], [1, 3])}`,
        `<p><strong>Read the digits across.</strong></p>
         ${ans('60&nbsp;207')}`
      )}
      ${tip('The biggest column tells you how long the number is. 10&nbsp;000 has 4 zeros, so the number has 5 digits.')}`,

    // Q10: a number times a power of 10
    '1b-power': `
      <p class="hp-tag">Worked example: write <b>81 × 10³</b> as a basic numeral.</p>
      ${steps(
        `<p><strong>Work out the power of 10.</strong> The little 3 means three zeros.</p>
         ${sum('10³ = 1000')}`,
        `<p><strong>Multiplying by 1000 adds three zeros</strong> to the end.</p>
         ${sum('81 × 1000 = 81&nbsp;000')}
         ${ans('81&nbsp;000')}`
      )}
      ${tip('Another one: 507 × 10² = 507 × 100 = 50&nbsp;700. Two zeros for the power 2.')}`,

    // Q6: ordering numbers
    '1b-order': `
      <p class="hp-tag">Worked example: put <b>503, 53, 350, 305, 35</b> in order from smallest to largest.</p>
      ${steps(
        `<p><strong>Sort them by how many digits they have.</strong> Fewer digits means a smaller number.</p>
         ${chips(['2 digits: 53, 35'], ['3 digits: 503, 350, 305'])}`,
        `<p><strong>Inside each group, compare the first digit.</strong> If those match, compare the next digit.</p>
         ${sum('35 &lt; 53<br>305 &lt; 350 &lt; 503')}`,
        `<p><strong>Join the groups, smallest group first.</strong></p>
         ${ans('35, 53, 305, 350, 503')}`
      )}
      ${tip('Watch out for zeros. 305 and 350 have the same digits, but 305 has 0 tens and 350 has 5 tens.')}`,

    // Q7, Q8: how many numbers can be made from some digits
    '1b-count': `
      <p class="hp-tag">Worked example: how many numbers can be made from the digits <b>4</b> and <b>7</b>, using each digit once?</p>
      ${steps(
        `<p><strong>List them in order</strong>, smallest first digit first, so you do not miss any.</p>
         ${chips(['47'], ['74'])}`,
        `<p><strong>Or count the choices for each place and multiply.</strong> The first place can be either digit. The second place only has the one digit left.</p>
         ${flow(['1st place', '2 choices'], ['2nd place', '1 choice'], ['Numbers', '2 × 1 = 2'])}`,
        `<p><strong>If digits can be used again, every place gets every choice.</strong></p>
         ${chips(['44'], ['47'], ['74'], ['77'])}
         ${sum('2 × 2 = 4 numbers')}`
      )}
      ${tip('More digits means more places. Count the choices for every place, then multiply them all together.')}`,

    // Q9: letters as digits
    '1b-letters': `
      <p class="hp-tag">Worked example: write <b>ABC</b> in expanded form, where each letter is a digit.</p>
      ${steps(
        `<p><strong>Put each letter in a place-value column</strong>, just like a digit.</p>
         ${chart(['100', '10', '1'], ['A', 'B', 'C'])}`,
        `<p><strong>Multiply each letter by its column</strong> and add.</p>
         ${sum('A × 100 + B × 10 + C × 1')}
         ${ans('100A + 10B + C')}`
      )}
      ${tip('A 0 works the same as before: A0B is 100A + 0 × 10 + B, which is just 100A + B. Type it like 100a + 10b + c.')}`,

    // =====================================================================
    // 1C Adding and subtracting positive integers
    // =====================================================================
    // Q1, Q2: partitioning
    '1c-partition': `
      <p class="hp-tag">Worked example: <b>251 + 136</b></p>
      ${steps(
        `<p><strong>Split both numbers into hundreds, tens and ones.</strong> Add each place on its own.</p>
         <div class="hp-cols">${col('Hundreds', '200 + 100', '300')}${col('Tens', '50 + 30', '80')}${col('Ones', '1 + 6', '7')}</div>`,
        `<p><strong>Add the three answers together.</strong></p>
         ${sum('300 + 80 + 7 = 387')}
         ${ans('387')}`
      )}
      <p><strong>Taking away works the same way.</strong> For 587 − 254, take away each place: 500 − 200 = 300, 80 − 50 = 30 and 7 − 4 = 3, which makes 333.</p>
      ${tip('This works best when no place needs a trade, so each place takes away cleanly.')}`,

    // Q3, Q4: compensating
    '1c-compensate': `
      <p class="hp-tag">Worked example: <b>56 + 39</b></p>
      ${steps(
        `<p><strong>Round the awkward number to a tens number.</strong> 39 is 1 less than 40.</p>
         ${sum('56 + 40 = 96')}`,
        `<p><strong>Fix it up.</strong> You added 1 too many, so take 1 back.</p>
         ${sum('96 − 1 = 95')}
         ${ans('95')}`
      )}
      ${flow(['Take away', '85 − 19'], ['Round 19 to 20', '85 − 20 = 65'], ['Took 1 too many', '65 + 1 = 66'])}
      ${tip('When adding, round up and then take back. When taking away, round up and then give back.')}`,

    // Q5: doubling and halving
    '1c-double': `
      <p class="hp-tag">Worked example: <b>45 + 46</b></p>
      ${steps(
        `<p><strong>Spot numbers that are nearly the same.</strong> 46 is 45 + 1, so this is double 45, plus 1.</p>
         ${sum('45 + 45 = 90')}`,
        `<p><strong>Add on the extra.</strong></p>
         ${sum('90 + 1 = 91')}
         ${ans('91')}`
      )}
      <p><strong>Halving works for taking away.</strong> For 480 − 241: half of 480 is 240, so 480 − 240 = 240. You need to take away 1 more, so the answer is 239.</p>
      ${tip('Look for one number being close to double, or close to half, the other.')}`,

    // Q6: mixed + and −
    '1c-mixed': `
      <p class="hp-tag">Worked example: <b>32 − 9 + 15 − 7</b></p>
      ${steps(
        `<p><strong>Work from left to right</strong>, one step at a time.</p>
         ${flow(['Start', '32'], ['− 9', '23'], ['+ 15', '38'], ['− 7', '31'])}`,
        `<p><strong>The last number is the answer.</strong></p>
         ${ans('31')}`
      )}
      ${tip('If you cannot take away yet, do the adding first. 7 − 10 + 5 is the same as 7 + 5 − 10, which is 2.')}`,

    // Q7 to Q11: word problems
    '1c-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Ella has <span class="hp-hl">37</span> cards. Max has <span class="hp-hl">16</span> <span class="hp-kw">more than</span> Ella. How many cards do they have <span class="hp-kw">together</span>?</p>
      ${steps(
        `<p><strong>Look for the clue words.</strong></p>
         ${chips(['altogether, total, together → add', 'add'], ['more than → add', 'add'], ['how many more, difference → take away', 'take'], ['fewer, sold, left → take away', 'take'])}`,
        `<p><strong>Work out Max's cards first.</strong> "More than" means add.</p>
         ${sum('37 + 16 = 53')}`,
        `<p><strong>Now add both people together.</strong></p>
         ${sum('37 + 53 = 90')}
         ${ans('90')}`
      )}
      ${tip('"More than" and "fewer than" questions often take two steps. Find the second amount before you find the total.')}`,

    // Q12: letters in addition facts
    '1c-letters': `
      <p class="hp-tag">Worked example: if <b>x + y = z</b>, what goes in the box in <b>z − y = □</b>?</p>
      ${steps(
        `<p><strong>Try it with numbers first.</strong> Every addition fact comes with two take-away facts.</p>
         ${flow(['Add', '4 + 7 = 11'], ['Take away', '11 − 7 = 4'], ['Take away', '11 − 4 = 7'])}`,
        `<p><strong>Do the same with letters.</strong> z is the total, so taking y away from z leaves x.</p>
         ${sum('x + y = z, so z − y = x')}
         ${ans('x')}`
      )}
      ${tip('The total always goes first in a take-away fact.')}`,

    // 1C Q13 and 1D Q11: two numbers from their sum and difference
    'sum-diff': `
      <p class="hp-tag">Worked example: two numbers add to <b>50</b>, and their difference is <b>14</b>. What are they?</p>
      ${steps(
        `<p><strong>Add the sum and the difference.</strong> That makes two lots of the bigger number.</p>
         ${sum('50 + 14 = 64')}`,
        `<p><strong>Halve it to get the bigger number.</strong></p>
         ${sum('64 ÷ 2 = 32')}`,
        `<p><strong>Take it from the sum to get the smaller number.</strong></p>
         ${sum('50 − 32 = 18')}
         ${ans('32, 18')}`
      )}
      ${tip('Check both clues: 32 + 18 = 50 and 32 − 18 = 14.')}`,

    // =====================================================================
    // 1D Algorithms for adding and subtracting
    // =====================================================================
    // Q1 to Q4: column addition
    '1d-add': `
      <p class="hp-tag">Worked example: <b>467 + 285</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '1', '1', ''] },
        { cells: d(' 467') },
        { cells: d('+285') },
        { kind: 'res', cells: d(' 752') }
      ])}
      ${steps(
        `<p><strong>Line up the digits</strong> so ones are under ones and tens are under tens. Start with the ones.</p>
         ${sum('7 + 5 = 12. Write 2, carry the 1 ten.')}`,
        `<p><strong>Add the tens, plus the carry.</strong></p>
         ${sum('6 + 8 + 1 = 15. Write 5, carry the 1 hundred.')}`,
        `<p><strong>Add the hundreds, plus the carry.</strong></p>
         ${sum('4 + 2 + 1 = 7')}
         ${ans('752')}`
      )}
      ${tip('Adding three or more numbers works the same way: add the whole column. The carry can be 2 or more.')}`,

    // Q5, Q6: column subtraction with trading
    '1d-sub': `
      <p class="hp-tag">Worked example: <b>523 − 167</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '4', '11', '13'] },
        { cells: ['', '~5', '~2', '~3'] },
        { cells: d('−167') },
        { kind: 'res', cells: d(' 356') }
      ])}
      ${steps(
        `<p><strong>Ones:</strong> 3 − 7 does not work, so trade 1 ten for 10 ones. The 2 tens become 1 ten, and the 3 ones become 13.</p>
         ${sum('13 − 7 = 6')}`,
        `<p><strong>Tens:</strong> 1 − 6 does not work, so trade 1 hundred for 10 tens. The 5 hundreds become 4, and the 1 ten becomes 11.</p>
         ${sum('11 − 6 = 5')}`,
        `<p><strong>Hundreds:</strong></p>
         ${sum('4 − 1 = 3')}
         ${ans('356')}`
      )}
      ${tip('If the next digit is a 0, trade from further left. In 600, the 6 hundreds become 5 hundreds, 9 tens and 10 ones. Check by adding: 356 + 167 = 523.')}`,

    // Q7 to Q9: word problems
    '1d-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A stadium has <span class="hp-hl">4528</span> seats in the north stand and <span class="hp-hl">3976</span> in the south stand. How many seats are there <span class="hp-kw">altogether</span>? How many <span class="hp-kw">more</span> are in the north stand?</p>
      ${steps(
        `<p><strong>"Altogether" means add.</strong> Line up the digits and use the column method.</p>
         ${sum('4528 + 3976 = 8504')}`,
        `<p><strong>"How many more" means take away</strong>, bigger number first.</p>
         ${sum('4528 − 3976 = 552')}
         ${ans('8504 and 552')}`
      )}
      ${tip('For start and end readings, like a trip meter, take the start reading away from the end reading.')}`,

    // Q10: mixed + and −
    '1d-mixed': `
      <p class="hp-tag">Worked example: <b>63 − 17 + 25</b></p>
      ${steps(
        `<p><strong>Work from left to right</strong>, one step at a time.</p>
         ${flow(['Start', '63'], ['− 17', '46'], ['+ 25', '71'])}`,
        `<p><strong>The last number is the answer.</strong></p>
         ${ans('71')}`
      )}
      ${tip('Do not add the 17 and 25 first. The take away belongs to the 17 only.')}`,

    // =====================================================================
    // 1E Multiplying small positive integers
    // =====================================================================
    // Q1: times tables
    '1e-tables': `
      <p>Stuck on a times-table fact? Build it from one you know.</p>
      ${steps(
        `<p><strong>×8 is double ×4.</strong> For 7 × 8, do 7 × 4 and double it.</p>
         ${sum('7 × 4 = 28, and double 28 is 56')}`,
        `<p><strong>×9 is ×10 take away one lot.</strong> For 9 × 8, do 10 × 8 and take away one 8.</p>
         ${sum('80 − 8 = 72')}`,
        `<p><strong>×5 is half of ×10.</strong> For 5 × 9, do 10 × 9 and halve it.</p>
         ${sum('90 ÷ 2 = 45')}`
      )}
      ${tip('Turn it around if that is easier: 3 × 8 is the same as 8 × 3.')}`,

    // Q2: distributive law
    '1e-distrib': `
      <p class="hp-tag">Worked example: <b>7 × 34</b></p>
      ${steps(
        `<p><strong>Split 34 into tens and ones</strong>, and multiply each part by 7.</p>
         ${area('7', [['30', '7 × 30 = 210', 3], ['4', '7 × 4 = 28', 1.4]])}`,
        `<p><strong>Add the parts.</strong></p>
         ${sum('210 + 28 = 238')}
         ${ans('238')}`
      )}
      <p><strong>Close to a tens number? Take away instead.</strong> For 7 × 59, do 7 × 60 = 420, then take away one 7: 420 − 7 = 413.</p>
      ${tip('Use adding when the number is just over a tens number, like 31 or 52. Use taking away when it is just under, like 29 or 48.')}`,

    // Q3: double and halve, or factors
    '1e-double': `
      <p class="hp-tag">Worked example: <b>5 × 26</b></p>
      ${steps(
        `<p><strong>Double one number and halve the other.</strong> The answer stays the same.</p>
         ${flow(['Start', '5 × 26'], ['Double 5, halve 26', '10 × 13'], ['Easy', '130'])}`,
        `<p><strong>Multiply the easy version.</strong></p>
         ${ans('130')}`
      )}
      <p><strong>You can do it more than once.</strong> 4 × 45 becomes 2 × 90, which is 180.</p>
      ${tip('This works best when one number is 5 or 25, or when one number is even.')}`,

    // Q4: pick a strategy
    '1e-choose': `
      <p>Look at the numbers first, then pick the strategy that makes them easy.</p>
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">If you see</span><span role="columnheader">Try</span><span role="columnheader">Example</span></div>
        <div class="hp-tr" role="row"><span role="cell">Two small numbers</span><span role="cell">Times tables</span><span role="cell">7 × 8 = 56</span></div>
        <div class="hp-tr" role="row"><span role="cell">Just over a tens number</span><span role="cell">Split and add</span><span role="cell">4 × 51 = 200 + 4 = 204</span></div>
        <div class="hp-tr" role="row"><span role="cell">Just under a tens number</span><span role="cell">Round and take away</span><span role="cell">8 × 29 = 240 − 8 = 232</span></div>
        <div class="hp-tr" role="row"><span role="cell">A 5, or an even number</span><span role="cell">Double and halve</span><span role="cell">5 × 32 = 10 × 16 = 160</span></div>
      </div>
      ${tip('There is often more than one way. Any way that gets the right answer counts.')}`,

    // Q5, Q6: short multiplication
    '1e-algo': `
      <p class="hp-tag">Worked example: <b>538 × 4</b></p>
      ${algo([
        { kind: 'carry', cells: ['', '', '1', '3', ''] },
        { cells: d('  538') },
        { cells: d('×   4') },
        { kind: 'res', cells: d(' 2152') }
      ])}
      ${steps(
        `<p><strong>Ones:</strong> 8 × 4 = 32. Write 2, carry the 3 tens.</p>`,
        `<p><strong>Tens:</strong> 3 × 4 = 12, plus the carried 3 makes 15. Write 5, carry the 1.</p>`,
        `<p><strong>Hundreds:</strong> 5 × 4 = 20, plus the carried 1 makes 21. Write 21.</p>
         ${ans('2152')}`
      )}
      ${tip('Multiply first, then add the carry. Do not add the carry before you multiply.')}`,

    // Q7 to Q10: word problems
    '1e-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">Mia buys <span class="hp-hl">4</span> pies at <span class="hp-hl">$7</span> <span class="hp-kw">each</span> and <span class="hp-hl">6</span> stickers at <span class="hp-hl">50 cents</span> <span class="hp-kw">each</span>. What is the <span class="hp-kw">total</span> cost?</p>
      ${steps(
        `<p><strong>"Each" means multiply.</strong> Work out each item on its own.</p>
         ${sum('Pies: 4 × $7 = $28')}`,
        `<p><strong>Change cents to dollars.</strong> 100 cents is $1, so two 50-cent stickers make $1.</p>
         ${sum('Stickers: 6 × 50c = 300c = $3')}`,
        `<p><strong>"Total" means add the parts.</strong></p>
         ${sum('$28 + $3 = $31')}
         ${ans('31')}`
      )}
      ${tip('Packs, boxes and rows of the same size mean multiply. Then add if there is more than one kind of thing.')}`,

    // Q11: write as a single product
    '1e-single': `
      <p class="hp-tag">Worked example: write <b>9 × 60 + 9 × 4</b> as a single product.</p>
      ${steps(
        `<p><strong>Find the number in both parts.</strong> Both parts are "9 times something".</p>
         ${sum(`${now('9')} × 60 + ${now('9')} × 4`)}`,
        `<p><strong>Join the other numbers.</strong> Nine 60s plus nine 4s is nine lots of 64.</p>
         ${ans('9 × 64')}`
      )}
      <p><strong>A take away works too:</strong> 5 × 200 − 5 × 1 is 5 × 199.</p>
      ${tip('Do not work out the answer. Type it like 9 x 64.')}`,

    // 1E Q12: two numbers from their product and sum
    'prod-sum': `
      <p class="hp-tag">Worked example: two numbers multiply to <b>72</b> and add to <b>17</b>. What are they?</p>
      ${steps(
        `<p><strong>List the factor pairs of the product.</strong></p>
         ${chips(['1 × 72'], ['2 × 36'], ['3 × 24'], ['4 × 18'], ['6 × 12'], ['8 × 9'])}`,
        `<p><strong>Add each pair, and look for the sum you need.</strong></p>
         ${sum('1 + 72 = 73, 2 + 36 = 38, 3 + 24 = 27,<br>4 + 18 = 22, 6 + 12 = 18, 8 + 9 = 17')}
         ${ans('8, 9')}`
      )}
      ${tip('Start with 1 and work up, so you do not miss a pair.')}`,

    // =====================================================================
    // 1F Multiplying large positive integers
    // =====================================================================
    // Q1: × 10, 100, 1000
    '1f-10s': `
      <p class="hp-tag">Worked example: <b>46 × 1000</b></p>
      ${steps(
        `<p><strong>Count the zeros.</strong> 1000 has three zeros.</p>`,
        `<p><strong>Every digit moves three places to the left</strong>, and zeros fill the gaps.</p>
         ${chart(['10&nbsp;000', '1000', '100', '10', '1'], ['', '', '', '4', '6'])}
         ${chart(['10&nbsp;000', '1000', '100', '10', '1'], ['4', '6', '0', '0', '0'], [2, 3, 4])}
         ${ans('46&nbsp;000')}`
      )}
      ${tip('Another one: 305 × 100 = 30&nbsp;500. Two zeros for 100.')}`,

    // Q2: × a multiple of 10
    '1f-tens': `
      <p class="hp-tag">Worked example: <b>32 × 400</b></p>
      ${steps(
        `<p><strong>Split 400 into 4 × 100.</strong></p>
         ${sum('32 × 400 = 32 × 4 × 100')}`,
        `<p><strong>Multiply by the 4 first.</strong></p>
         ${sum('32 × 4 = 128')}`,
        `<p><strong>Then add the two zeros.</strong></p>
         ${sum('128 × 100 = 12&nbsp;800')}
         ${ans('12&nbsp;800')}`
      )}
      ${tip('Another one: 51 × 3000. Do 51 × 3 = 153, then add three zeros to get 153&nbsp;000.')}`,

    // Q3, Q8: long multiplication
    '1f-long': `
      <p class="hp-tag">Worked example: <b>57 × 34</b></p>
      ${algo([
        { cells: d('   57') },
        { cells: d('×  34') },
        { kind: 'res', cells: d('  228'), note: '57 × 4' },
        { cells: d('+1710'), note: '57 × 30' },
        { kind: 'res', cells: d(' 1938') }
      ])}
      ${steps(
        `<p><strong>Multiply by the ones digit.</strong></p>
         ${sum('57 × 4 = 228')}`,
        `<p><strong>Multiply by the tens digit.</strong> Write a 0 in the ones place first, because you are really multiplying by 30.</p>
         ${sum('57 × 30 = 1710')}`,
        `<p><strong>Add the two rows.</strong></p>
         ${sum('228 + 1710 = 1938')}
         ${ans('1938')}`
      )}
      ${tip('A three-digit number needs a third row for the hundreds, starting with two zeros.')}`,

    // Q4 to Q7: word problems
    '1f-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A swimming pool costs <span class="hp-hl">$45</span> <span class="hp-kw">per</span> hour to hire. A club hires it for <span class="hp-hl">26</span> hours. What is the total cost?</p>
      ${steps(
        `<p><strong>"Per" means each</strong>, so multiply the cost by the number of hours.</p>
         ${sum('45 × 26')}`,
        `<p><strong>Use long multiplication.</strong></p>
         ${sum('45 × 6 = 270<br>45 × 20 = 900<br>270 + 900 = 1170')}
         ${ans('1170')}`
      )}
      ${tip('Changing units? Multiply one step at a time. Seconds in an hour: 60 seconds in a minute, 60 minutes in an hour, so 60 × 60 = 3600.')}`,

    // Q9: simplify first
    '1f-simplify': `
      <p class="hp-tag">Worked example: <b>96 × 25 + 4 × 25</b></p>
      ${steps(
        `<p><strong>Find the number in both parts.</strong> Both parts are "something times 25".</p>
         ${sum(`96 × ${now('25')} + 4 × ${now('25')}`)}`,
        `<p><strong>Join the other numbers.</strong> 96 twenty-fives plus 4 twenty-fives is 100 twenty-fives.</p>
         ${sum('(96 + 4) × 25 = 100 × 25 = 2500')}
         ${ans('2500')}`
      )}
      ${tip('A take away works too: 52 × 15 − 2 × 15 = 50 × 15 = 750.')}`,

    // 1F Q10: two numbers from their product and difference
    'prod-diff': `
      <p class="hp-tag">Worked example: two whole numbers multiply to <b>1763</b>, and their difference is <b>2</b>. What are they?</p>
      ${steps(
        `<p><strong>The numbers are close together</strong>, so each is close to a number times itself.</p>
         ${sum('40 × 40 = 1600 (too small)<br>45 × 45 = 2025 (too big)')}`,
        `<p><strong>Try numbers in between that are 2 apart.</strong></p>
         ${sum('41 × 43 = 1763 ✓')}
         ${ans('41, 43')}`
      )}
      ${tip('Look at the last digit to rule numbers out. 1763 ends in 3, and 1 × 3 also ends in 3.')}`,

    // =====================================================================
    // 1G Dividing positive integers
    // =====================================================================
    // Q1: tables
    '1g-tables': `
      <p class="hp-tag">Worked example: <b>44 ÷ 4</b></p>
      ${steps(
        `<p><strong>Turn it into a times question.</strong> 4 times what makes 44?</p>
         ${sum('4 × 11 = 44')}`,
        `<p><strong>That missing number is the answer.</strong></p>
         ${ans('11')}`
      )}
      ${flow(['Times', '4 × 11 = 44'], ['Divide', '44 ÷ 4 = 11'], ['Divide', '44 ÷ 11 = 4'])}
      ${tip('Every times-table fact gives you two division facts for free.')}`,

    // Q2: distributive law
    '1g-distrib': `
      <p class="hp-tag">Worked example: <b>336 ÷ 3</b></p>
      ${steps(
        `<p><strong>Split the number into parts that 3 goes into easily.</strong></p>
         ${sum('336 = 300 + 36')}`,
        `<p><strong>Divide each part.</strong></p>
         ${sum('300 ÷ 3 = 100<br>36 ÷ 3 = 12')}`,
        `<p><strong>Add the answers.</strong></p>
         ${sum('100 + 12 = 112')}
         ${ans('112')}`
      )}
      ${tip('Pick parts that are easy. 300 and 36 both divide by 3 with nothing left over.')}`,

    // Q3: halve both numbers
    '1g-halve': `
      <p class="hp-tag">Worked example: <b>232 ÷ 8</b></p>
      ${steps(
        `<p><strong>Halve both numbers.</strong> The answer stays the same. Keep going until it is easy.</p>
         ${flow(['Start', '232 ÷ 8'], ['Halve both', '116 ÷ 4'], ['Halve both', '58 ÷ 2'], ['Easy', '29'])}`,
        `<p><strong>Work out the easy one.</strong></p>
         ${ans('29')}`
      )}
      ${tip('This works best when both numbers are even.')}`,

    // Q4: dividing with 0 and 1
    '1g-01': `
      <p>Three rules cover these.</p>
      ${chips(['Any number ÷ 1 = the same number', 'add'], ['0 ÷ any number = 0', 'add'], ['You cannot divide by 0', 'take'])}
      ${sum('58 ÷ 1 = 58<br>0 ÷ 25 = 0')}
      ${tip('Think of sharing. 58 lollies shared with 1 person: they get all 58. 0 lollies shared with 25 people: everyone gets 0.')}`,

    // Q5, Q6: short division
    '1g-short': `
      <p class="hp-tag">Worked example: <b>947 ÷ 4</b></p>
      ${bus('4', ['9', '4', '7'], ['2', '3', '6'], ['', '1', '2'], 'r 3')}
      ${steps(
        `<p><strong>Divide the first digit.</strong> 9 ÷ 4 = 2 remainder 1. Write 2 on top and carry the 1 to the next digit, making 14.</p>`,
        `<p><strong>Keep going.</strong> 14 ÷ 4 = 3 remainder 2. Write 3, carry the 2, making 27.</p>`,
        `<p><strong>Last digit.</strong> 27 ÷ 4 = 6 remainder 3. Nothing is left to carry to, so 3 is the remainder.</p>
         ${ans('236 r 3')}`
      )}
      ${tip('If the divisor does not go into a digit, write 0 on top and carry the whole digit. Type your answer like 236 r 3.')}`,

    // Q15: dividing by a two-digit number
    '1g-long': `
      <p class="hp-tag">Worked example: <b>745 ÷ 13</b></p>
      ${steps(
        `<p><strong>Write out the 13 times table first.</strong></p>
         ${chips(['13'], ['26'], ['39'], ['52'], ['65'], ['78'], ['91'], ['104'], ['117'])}`,
        `<p><strong>Divide digit by digit, as in short division.</strong> 7 ÷ 13 = 0 r 7. Then 74 ÷ 13 = 5 r 9, because 5 × 13 = 65. Then 95 ÷ 13 = 7 r 4, because 7 × 13 = 91.</p>
         ${bus('13', ['7', '4', '5'], ['0', '5', '7'], ['', '7', '9'], 'r 4')}
         ${ans('57 r 4')}`
      )}
      ${tip('The list of multiples does the hard work. Pick the biggest one that fits.')}`,

    // Q7 to Q13: word problems
    '1g-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story"><span class="hp-hl">58</span> students go on an excursion. Each minibus holds <span class="hp-hl">13</span> students. What is the <span class="hp-kw">minimum</span> number of minibuses needed?</p>
      ${steps(
        `<p><strong>Shared, each, per, groups of: divide.</strong></p>
         ${sum('58 ÷ 13 = 4 r 6')}`,
        `<p><strong>Decide what the remainder means.</strong> 6 students still need a seat, so you need one more bus.</p>
         ${ans('5')}`
      )}
      ${chips(['Everyone needs a place → round up', 'add'], ['Leftovers do not count → ignore the remainder', 'take'])}
      ${tip('Prices like "4 for $3": find how many groups first. 52 pens is 52 ÷ 4 = 13 groups, so 13 × $3 = $39. Fences with a post at each end need one more post than gaps.')}`,

    // Q14: remainders puzzle
    '1g-remainder': `
      <p class="hp-tag">Worked example: a number less than 30 leaves remainder 3 when divided by 4, and remainder 1 when divided by 3. What could it be?</p>
      ${steps(
        `<p><strong>List the numbers that fit the first clue.</strong> Start at 3 and keep adding 4.</p>
         ${chips(['3'], ['7'], ['11'], ['15'], ['19'], ['23'], ['27'])}`,
        `<p><strong>Test each one with the second clue.</strong> Which leave remainder 1 when divided by 3?</p>
         ${chips(['3 ✗'], ['7 ✓', 'add'], ['11 ✗'], ['15 ✗'], ['19 ✓', 'add'], ['23 ✗'], ['27 ✗'])}
         ${ans('7, 19')}`
      )}
      ${tip('There can be more than one answer. Type them all, separated by commas.')}`,

    // Q16: divide using factors
    '1g-factor': `
      <p class="hp-tag">Worked example: <b>936 ÷ 24</b></p>
      ${steps(
        `<p><strong>Split the divisor into two smaller factors.</strong></p>
         ${sum('24 = 4 × 6')}`,
        `<p><strong>Divide by one factor, then the other.</strong></p>
         ${flow(['Start', '936'], ['÷ 4', '234'], ['÷ 6', '39'])}
         ${ans('39')}`
      )}
      ${tip('Pick factors you can divide by easily, like 2, 4, 5 or 10.')}`,

    // =====================================================================
    // 1H Estimating and rounding positive integers
    // =====================================================================
    // Q1: rounding
    '1h-round': `
      <p class="hp-tag">Worked example: round <b>5374</b> to the nearest 100.</p>
      ${steps(
        `<p><strong>Find the two hundreds it sits between.</strong></p>
         ${line('5300', '5350', '5400', '5374', 74)}`,
        `<p><strong>Look at the digit just to the right</strong> of the hundreds: the tens digit, 7. 5 or more rounds up. 4 or less rounds down.</p>
         ${sum('53<b>7</b>4: 7 is 5 or more, so round up')}
         ${ans('5400')}`
      )}
      ${tip('Exactly halfway, like 5350, rounds up.')}`,

    // Q2: leading digit approximation
    '1h-lead': `
      <p class="hp-tag">Worked example: round <b>6381</b> using leading digit approximation.</p>
      ${steps(
        `<p><strong>The leading digit is the first one.</strong> Here it is the 6, in the thousands place. Round to the nearest thousand.</p>`,
        `<p><strong>Look at the next digit.</strong> It is 3, which is 4 or less, so keep the 6. Every digit after it becomes 0.</p>
         ${ans('6000')}`
      )}
      ${tip('Rounding up can add a digit. 970 has leading digit 9 and the next digit is 7, so it rounds up to 1000.')}`,

    // Q3, Q4, Q5: estimating calculations
    '1h-estimate': `
      <p>Round every number first, then work out the easy version. Use ≈ to mean "about".</p>
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Question</span><span role="columnheader">Rounded</span><span role="columnheader">Estimate</span></div>
        <div class="hp-tr" role="row"><span role="cell">476 + 236 (nearest 100)</span><span role="cell">500 + 200</span><span role="cell">≈ 700</span></div>
        <div class="hp-tr" role="row"><span role="cell">71 × 38 (nearest 10)</span><span role="cell">70 × 40</span><span role="cell">≈ 2800</span></div>
        <div class="hp-tr" role="row"><span role="cell">357 ÷ 12 (nearest 10)</span><span role="cell">360 ÷ 10</span><span role="cell">≈ 36</span></div>
        <div class="hp-tr" role="row"><span role="cell">6214 − 2870 (leading digit)</span><span role="cell">6000 − 3000</span><span role="cell">≈ 3000</span></div>
      </div>
      ${tip('Leading digit approximation rounds each number on its own, so 2870 goes to 3000 while 6214 goes to 6000.')}`,

    // Q6 to Q8: estimating in a story
    '1h-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A bus carries <span class="hp-hl">48</span> people on each trip and makes <span class="hp-hl">7</span> trips. Round 48 to the nearest 10 to estimate how many people it carries.</p>
      ${steps(
        `<p><strong>Round the number the question tells you to.</strong></p>
         ${sum('48 ≈ 50')}`,
        `<p><strong>"Each trip" means multiply.</strong> Use the rounded number.</p>
         ${sum('50 × 7 = 350')}
         ${ans('350')}`
      )}
      ${tip('The question asks for the estimate, so do not work out the exact answer.')}`,

    // Q9: will the estimate be bigger or smaller?
    '1h-direction': `
      <p class="hp-tag">Worked example: only <b>m</b> is rounded down. Will the estimate of <b>m × n</b> be smaller or larger than the true answer?</p>
      ${steps(
        `<p><strong>Make up easy numbers.</strong> Say m = 6 and n = 5.</p>
         ${sum('True answer: 6 × 5 = 30')}`,
        `<p><strong>Round the way the question says.</strong> Round m down to 4, and leave n alone.</p>
         ${sum('Estimate: 4 × 5 = 20')}`,
        `<p><strong>Compare.</strong> 20 is less than 30.</p>
         ${ans('smaller')}`
      )}
      ${tip('Do this test for every part. Take-away and divide questions can surprise you, so try them with numbers before you answer.')}`,

    // Q10: error from rounding
    '1h-error': `
      <p class="hp-tag">Worked example: find the error when <b>62 × 29</b> is estimated by rounding both numbers to the nearest 10.</p>
      ${steps(
        `<p><strong>Round and multiply.</strong></p>
         ${sum('60 × 30 = 1800')}`,
        `<p><strong>Work out the exact answer.</strong></p>
         ${sum('62 × 29 = 1798')}`,
        `<p><strong>Find the gap between them.</strong> Take the smaller from the bigger.</p>
         ${sum('1800 − 1798 = 2')}
         ${ans('2')}`
      )}
      ${tip('The error is always the difference, so it is never negative.')}`,

    // =====================================================================
    // 1I Order of operations with positive integers
    // =====================================================================
    // Q1, Q2, Q3, Q5: no brackets
    '1i-order': `
      <ol class="hp-ladder">
        <li><b>Brackets</b> first</li>
        <li><b>× and ÷</b> next, left to right</li>
        <li><b>+ and −</b> last, left to right</li>
      </ol>
      <p class="hp-tag">Worked example: <b>49 − 5 × 7 + 27 ÷ 9</b></p>
      ${steps(
        `<p><strong>Do the × and ÷ first</strong>, from left to right.</p>
         ${sum(`49 − ${now('5 × 7')} + 27 ÷ 9`)}
         ${sum(`49 − 35 + ${now('27 ÷ 9')}`)}`,
        `<p><strong>Then + and −</strong>, from left to right.</p>
         ${sum(`${now('49 − 35')} + 3`)}
         ${sum('14 + 3 = 17')}
         ${ans('17')}`
      )}
      ${tip('× and ÷ are equal partners, so do whichever comes first from the left. The same goes for + and −.')}`,

    // Q4, Q6, Q8: brackets
    '1i-brackets': `
      <p class="hp-tag">Worked example: <b>7 × (16 − 9) − 5</b></p>
      ${steps(
        `<p><strong>Brackets first.</strong></p>
         ${sum(`7 × ${now('(16 − 9)')} − 5`)}`,
        `<p><strong>Then × and ÷, then + and −.</strong></p>
         ${sum(`${now('7 × 7')} − 5`)}
         ${sum('49 − 5 = 44')}
         ${ans('44')}`
      )}
      <p><strong>Brackets inside brackets?</strong> Do the inside ones first.</p>
      ${sum(`[60 − ${now('(5 + 11)')}] ÷ 4 = ${now('[60 − 16]')} ÷ 4 = 44 ÷ 4 = 11`)}
      ${tip('Type square brackets with the [ and ] keys, or use round ones.')}`,

    // Q7: words into symbols
    '1i-words': `
      <p>Learn the maths words first.</p>
      ${chips(['sum → +'], ['difference → −'], ['product → ×'], ['quotient → ÷'], ['double → × 2'], ['triple → × 3'])}
      <p class="hp-tag">Worked example: <b>4 less than the product of 6 and 8</b></p>
      ${steps(
        `<p><strong>Find the main part.</strong> "The product of 6 and 8" is 6 × 8.</p>`,
        `<p><strong>"4 less than" means take 4 away from it.</strong> The 4 goes at the end.</p>
         ${sum('6 × 8 − 4 = 48 − 4 = 44')}
         ${ans('44')}`
      )}
      ${tip('"Double the difference of 25 and 9" needs brackets: 2 × (25 − 9) = 32. Work out the difference first, then double it.')}`,

    // Q9, Q10, Q12: worded problems
    '1i-word': `
      <p class="hp-tag">Worked example:</p>
      <p class="hp-story">A farmer packs <span class="hp-hl">15</span> boxes with <span class="hp-hl">8</span> eggs in each. <span class="hp-hl">3</span> eggs break in <span class="hp-kw">each</span> box. How many good eggs are left?</p>
      ${steps(
        `<p><strong>Write one calculation for the whole story.</strong> Each box loses 3 eggs, so each box has 8 − 3 good eggs.</p>
         ${sum('15 × (8 − 3)')}`,
        `<p><strong>Use order of operations.</strong></p>
         ${sum('15 × 5 = 75')}
         ${ans('75')}`
      )}
      ${tip('For puzzles with lots of rules, try a value, check every rule, then try the next value.')}`,

    // Q11: insert brackets
    '1i-insert': `
      <p class="hp-tag">Worked example: add brackets to make <b>2 + 7 × 5 = 45</b> true.</p>
      ${steps(
        `<p><strong>Work it out without brackets first.</strong></p>
         ${sum('2 + 7 × 5 = 2 + 35 = 37 ✗')}`,
        `<p><strong>Try brackets around a different pair.</strong></p>
         ${sum('(2 + 7) × 5 = 9 × 5 = 45 ✓')}
         ${ans('(2 + 7) × 5')}`
      )}
      ${tip('Type the whole left side with your brackets, like (2+7)x5. If one try does not work, move the brackets and try again.')}`,

    // Q13: simplify with letters
    '1i-letters': `
      <p>These rules work for every number, so they work for letters too.</p>
      ${chips(['a − a = 0'], ['a ÷ a = 1'], ['0 × a = 0'], ['1 × a = a'])}
      <p class="hp-tag">Worked example: simplify <b>p − q + q</b></p>
      ${steps(
        `<p><strong>Not sure? Try it with numbers.</strong> Say p = 5 and q = 2.</p>
         ${sum('5 − 2 + 2 = 5, which is p')}`,
        `<p><strong>Taking q away and adding it back cancels out.</strong></p>
         ${ans('p')}`
      )}
      ${tip('Test your answer with a second set of numbers to make sure.')}`
  };

  window.H3_HELPS = H;
})();
