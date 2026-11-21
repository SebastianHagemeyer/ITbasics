/* H3 "How do I work this out?" help panels, one per TYPE of question.
 *
 * A question opts in with "help": "<id>" in bank.js, so every question of the
 * same type shares one panel and the explanation is written once. h3.js shows
 * it as a fold-out under the question until the question is answered right.
 *
 * Rule for writing these: the worked example must use numbers that appear
 * nowhere in the set, and neither may the small parts inside the example (a
 * "7 = VII" step would hand over the answer to 1b). Check the set's prompts
 * AND answers before picking an example.
 *
 * This is trusted, hand-written HTML (it is inserted as-is, not escaped).
 * Classes start with hp- so they cannot clash with the rest of H3. */
(function () {
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

  window.H3_HELPS = {
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
      <div class="hp-tip"><strong>Tip</strong><span>Never write the same numeral four times in a row. If you have written IIII or XXXX, swap it for a pair.</span></div>`
  };
})();
