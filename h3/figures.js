/* H3 figures: pictures for questions, drawn from a small spec in bank.js so
 * the bank stays data, not hand-made SVG. A question can carry "figure" (shown
 * above its own prompt) or "stemFigure" (shown once with the group's stem).
 * Either can be one spec or an array of specs.
 *
 *   { "kind": "plane", "x": [0, 6], "y": [0, 6], "points": { "A": [2, 3] },
 *     "path": [[0, 1], [1, 3], [2, 5]], "closed": false }
 *       Cartesian plane, 1 unit grid. path is optional (a joined line).
 *   { "kind": "sticks", "stages": [ [[x1, y1, x2, y2], ...], ... ],
 *     "labels": ["1 square", "2 squares"] }
 *       Matchstick pattern, one drawing per stage, in grid units (y goes up).
 *   { "kind": "dots", "stages": [ [[x, y], ...], ... ], "labels": [...] }
 *       Dot pattern, one drawing per stage.
 *   { "kind": "table", "rows": [["input", 1, 2, 3], ["output", "?", 5, "?"]] }
 *       A table; the first cell of each row is its heading. "?" cells are
 *       shown as gaps for the student to fill.
 *
 * Colours come from classes styled in h3.css, so both themes work. */
(function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function plane(f) {
    const [x0, x1] = f.x || [0, 6], [y0, y1] = f.y || [0, 6];
    const U = 30, pad = 26;
    const W = (x1 - x0) * U + pad * 2, Hh = (y1 - y0) * U + pad * 2;
    const X = (x) => pad + (x - x0) * U, Y = (y) => pad + (y1 - y) * U;
    const step = (x1 - x0 > 12 || y1 - y0 > 12) ? 2 : 1;
    let g = '';
    for (let x = x0; x <= x1; x++) g += `<line class="fg-grid" x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}"/>`;
    for (let y = y0; y <= y1; y++) g += `<line class="fg-grid" x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}"/>`;
    const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
    g += `<line class="fg-axis" x1="${X(x0)}" y1="${Y(ax)}" x2="${X(x1) + 10}" y2="${Y(ax)}"/>`;
    g += `<line class="fg-axis" x1="${X(ay)}" y1="${Y(y0)}" x2="${X(ay)}" y2="${Y(y1) - 10}"/>`;
    g += `<text class="fg-label" x="${X(x1) + 14}" y="${Y(ax) + 4}">x</text><text class="fg-label" x="${X(ay) - 4}" y="${Y(y1) - 14}">y</text>`;
    // Where the axes cross at (0, 0), that corner gets an O instead of two zeros.
    const origin = ax === 0 && ay === 0;
    for (let x = x0; x <= x1; x += step) if (!(origin && x === 0)) g += `<text class="fg-tick" x="${X(x)}" y="${Y(ax) + 16}" text-anchor="middle">${x}</text>`;
    for (let y = y0; y <= y1; y += step) if (!(origin && y === 0)) g += `<text class="fg-tick" x="${X(ay) - 7}" y="${Y(y) + 4}" text-anchor="end">${y}</text>`;
    if (origin) g += `<text class="fg-tick" x="${X(0) - 7}" y="${Y(0) + 16}" text-anchor="end">O</text>`;
    if (f.path && f.path.length) {
      const pts = f.path.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ');
      g += f.closed ? `<polygon class="fg-path" points="${pts}"/>` : `<polyline class="fg-path" points="${pts}"/>`;
    }
    for (const [name, [x, y]] of Object.entries(f.points || {})) {
      g += `<circle class="fg-pt" cx="${X(x)}" cy="${Y(y)}" r="4.5"/><text class="fg-ptl" x="${X(x) + 7}" y="${Y(y) - 7}">${esc(name)}</text>`;
    }
    return `<svg class="fig fig-plane" viewBox="0 0 ${W + 12} ${Hh}" width="${W + 12}" role="img" aria-label="${esc(f.alt || 'A Cartesian plane with labelled points')}">${g}</svg>`;
  }

  // One small drawing per stage, side by side, sharing one scale.
  function stages(f, drawOne, boundsOf) {
    const U = f.unit || 22, pad = 8;
    const all = f.stages.map(boundsOf);
    const maxH = Math.max(...all.map(b => b.y1 - b.y0));
    return `<div class="fig fig-stages" role="img" aria-label="${esc(f.alt || 'A pattern shown in stages')}">${f.stages.map((st, i) => {
      const b = all[i];
      const W = (b.x1 - b.x0) * U + pad * 2, Hh = maxH * U + pad * 2;
      const X = (x) => pad + (x - b.x0) * U, Y = (y) => pad + (maxH - (y - b.y0)) * U;
      return `<figure class="fig-stage"><svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" aria-hidden="true">${drawOne(st, X, Y)}</svg>
        <figcaption>${esc((f.labels && f.labels[i]) || 'Shape ' + (i + 1))}</figcaption></figure>`;
    }).join('')}</div>`;
  }

  const sticks = (f) => stages(f,
    (segs, X, Y) => segs.map(([a, b, c, d]) => `<line class="fg-stick" x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}"/><circle class="fg-tip" cx="${X(c)}" cy="${Y(d)}" r="2.6"/>`).join(''),
    (segs) => ({ x0: Math.min(...segs.flatMap(s => [s[0], s[2]])), x1: Math.max(...segs.flatMap(s => [s[0], s[2]])), y0: Math.min(...segs.flatMap(s => [s[1], s[3]])), y1: Math.max(...segs.flatMap(s => [s[1], s[3]])) }));

  const dots = (f) => stages(f,
    (pts, X, Y) => pts.map(([x, y]) => `<circle class="fg-dot" cx="${X(x)}" cy="${Y(y)}" r="5"/>`).join(''),
    (pts) => ({ x0: Math.min(...pts.map(p => p[0])), x1: Math.max(...pts.map(p => p[0])), y0: Math.min(...pts.map(p => p[1])), y1: Math.max(...pts.map(p => p[1])) }));

  function table(f) {
    return `<div class="fig fig-table-wrap"><table class="fig-table">${(f.rows || []).map(r =>
      `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map(c => String(c) === '?' ? '<td class="gap">?</td>' : `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  }

  const KINDS = { plane, sticks, dots, table };
  window.H3Figure = function (spec) {
    try { return KINDS[spec && spec.kind] ? KINDS[spec.kind](spec) : ''; }
    catch (e) { return ''; }
  };
})();
