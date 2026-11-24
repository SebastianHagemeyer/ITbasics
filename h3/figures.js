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

  // ---- fraction pictures ----
  // shaded: a count (the first n parts) or a list of part indexes (0-based).
  const isShaded = (shaded, i) => Array.isArray(shaded) ? shaded.includes(i) : i < (shaded || 0);
  const frame = (svg, caption) => `<figure class="fig fig-frac">${svg}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;

  // { "kind": "pie", "parts": 8, "shaded": 3, "caption": "A" }
  function pie(f) {
    const n = f.parts, R = 52, c = 60;
    let g = '';
    for (let i = 0; i < n; i++) {
      const a0 = -Math.PI / 2 + (2 * Math.PI * i) / n, a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / n;
      const p = (a) => `${(c + R * Math.cos(a)).toFixed(2)},${(c + R * Math.sin(a)).toFixed(2)}`;
      const cls = isShaded(f.shaded, i) ? 'fg-on' : 'fg-off';
      g += n === 1 ? `<circle class="${cls}" cx="${c}" cy="${c}" r="${R}"/>`
        : `<path class="${cls}" d="M${c},${c} L${p(a0)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z"/>`;
    }
    return frame(`<svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="${esc(f.alt || 'A circle split into ' + n + ' equal parts')}">${g}</svg>`, f.caption);
  }

  // { "kind": "bar", "parts": 5, "shaded": 2 }  (a rectangle in equal strips)
  function bar(f) {
    const n = f.parts, W = Math.min(300, Math.max(120, n * 30)), Hh = 44, w = W / n;
    let g = '';
    for (let i = 0; i < n; i++) g += `<rect class="${isShaded(f.shaded, i) ? 'fg-on' : 'fg-off'}" x="${2 + i * w}" y="2" width="${w}" height="${Hh}"/>`;
    return frame(`<svg viewBox="0 0 ${W + 4} ${Hh + 4}" width="${W + 4}" height="${Hh + 4}" role="img" aria-label="${esc(f.alt || 'A bar split into ' + n + ' equal parts')}">${g}</svg>`, f.caption);
  }

  // { "kind": "grid", "rows": 3, "cols": 4, "shaded": [0, 1, 5] }  (cells numbered across, then down)
  function grid(f) {
    const r = f.rows, cN = f.cols, S = Math.max(16, Math.min(34, Math.floor(260 / Math.max(r, cN))));
    let g = '';
    for (let y = 0; y < r; y++) for (let x = 0; x < cN; x++) {
      const i = y * cN + x;
      g += `<rect class="${isShaded(f.shaded, i) ? 'fg-on' : 'fg-off'}" x="${2 + x * S}" y="${2 + y * S}" width="${S}" height="${S}"/>`;
    }
    return frame(`<svg viewBox="0 0 ${cN * S + 4} ${r * S + 4}" width="${cN * S + 4}" height="${r * S + 4}" role="img" aria-label="${esc(f.alt || 'A grid of ' + r * cN + ' squares')}">${g}</svg>`, f.caption);
  }

  // { "kind": "numberline", "min": 0, "max": 2, "divisions": 4, "points": { "A": 0.75 } }
  // divisions = equal steps per whole unit. Whole numbers are labelled.
  function numberline(f) {
    const lo = f.min ?? 0, hi = f.max ?? 1, div = f.divisions || 1;
    const units = hi - lo, W = Math.max(240, Math.min(560, units * div * 34)), pad = 20, Hh = 64, yL = 34;
    const X = (v) => pad + ((v - lo) / units) * W;
    let g = `<line class="fg-axis" x1="${X(lo) - 8}" y1="${yL}" x2="${X(hi) + 8}" y2="${yL}"/>`;
    const steps = Math.round(units * div);
    for (let i = 0; i <= steps; i++) {
      const v = lo + i / div, whole = Math.abs(v - Math.round(v)) < 1e-9;
      g += `<line class="${whole ? 'fg-axis' : 'fg-grid-dark'}" x1="${X(v)}" y1="${yL - (whole ? 9 : 6)}" x2="${X(v)}" y2="${yL + (whole ? 9 : 6)}"/>`;
      if (whole) g += `<text class="fg-tick" x="${X(v)}" y="${yL + 24}" text-anchor="middle">${Math.round(v)}</text>`;
    }
    for (const [name, v] of Object.entries(f.points || {})) {
      g += `<circle class="fg-dotred" cx="${X(v)}" cy="${yL}" r="6"/><text class="fg-ptl" x="${X(v)}" y="${yL - 13}" text-anchor="middle">${esc(name)}</text>`;
    }
    return frame(`<svg viewBox="0 0 ${W + pad * 2} ${Hh}" width="${W + pad * 2}" role="img" aria-label="${esc(f.alt || 'A number line from ' + lo + ' to ' + hi)}">${g}</svg>`, f.caption);
  }

  // ---- labelled shapes (algebra) ----
  // { "kind": "rect", "cols": [["x", 2], ["3", 1]], "rows": [["5", 1]], "cells": [["5x", "15"]] }
  // A rectangle split into columns and rows: each is [label, relative size]. Labels sit
  // above the top edge and left of the left edge; cells (optional) label the insides.
  // A plain rectangle is one column and one row: "cols": [["3a", 1]], "rows": [["2b", 1]].
  function rect(f) {
    const cols = f.cols || [['', 1]], rows = f.rows || [['', 1]];
    const cw = cols.reduce((a, c) => a + (c[1] || 1), 0), rw = rows.reduce((a, r) => a + (r[1] || 1), 0);
    const W = Math.min(300, 70 + cw * 50), Hh = Math.min(170, 50 + rw * 40), L = 46, T = 26;
    let g = `<rect class="fg-shape" x="${L}" y="${T}" width="${W}" height="${Hh}"/>`;
    let x = L;
    cols.forEach(([lab, w], i) => {
      const cwPx = W * (w || 1) / cw;
      if (i) g += `<line class="fg-div" x1="${x}" y1="${T}" x2="${x}" y2="${T + Hh}"/>`;
      g += `<text class="fg-side" x="${x + cwPx / 2}" y="${T - 8}" text-anchor="middle">${esc(lab)}</text>`;
      let y = T;
      rows.forEach(([rl, rwt], j) => {
        const rhPx = Hh * (rwt || 1) / rw;
        if (i === 0) {
          if (j) g += `<line class="fg-div" x1="${L}" y1="${y}" x2="${L + W}" y2="${y}"/>`;
          g += `<text class="fg-side" x="${L - 8}" y="${y + rhPx / 2 + 5}" text-anchor="end">${esc(rl)}</text>`;
        }
        const cell = f.cells && f.cells[j] && f.cells[j][i];
        if (cell) g += `<text class="fg-cell" x="${x + cwPx / 2}" y="${y + rhPx / 2 + 5}" text-anchor="middle">${esc(cell)}</text>`;
        y += rhPx;
      });
      x += cwPx;
    });
    return frame(`<svg viewBox="0 0 ${L + W + 10} ${T + Hh + 8}" width="${L + W + 10}" role="img" aria-label="${esc(f.alt || 'A labelled rectangle')}">${g}</svg>`, f.caption);
  }

  // { "kind": "tri", "base": "x", "side": "y" }  an isosceles triangle, equal sides marked
  // { "kind": "tri", "base": "a", "left": "b", "right": "c" }  any three side labels
  function tri(f) {
    const W = 200, Hh = 130, L = 30, T = 14;
    const A = [L, T + Hh], B = [L + W, T + Hh], C = [L + W / 2, T];
    const left = f.left ?? f.side ?? '', right = f.right ?? f.side ?? '';
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const ml = mid(A, C), mr = mid(B, C), mb = mid(A, B);
    let g = `<polygon class="fg-shape" points="${A} ${B} ${C}"/>`;
    if (f.side != null && f.left == null) {
      // equal-side tick marks
      for (const [p, q] of [[A, C], [B, C]]) {
        const m = mid(p, q), dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy), nx = -dy / len * 6, ny = dx / len * 6;
        g += `<line class="fg-axis" x1="${m[0] - nx}" y1="${m[1] - ny}" x2="${m[0] + nx}" y2="${m[1] + ny}"/>`;
      }
    }
    g += `<text class="fg-side" x="${ml[0] - 12}" y="${ml[1]}" text-anchor="end">${esc(left)}</text>`;
    g += `<text class="fg-side" x="${mr[0] + 12}" y="${mr[1]}">${esc(right)}</text>`;
    g += `<text class="fg-side" x="${mb[0]}" y="${mb[1] + 20}" text-anchor="middle">${esc(f.base ?? '')}</text>`;
    return frame(`<svg viewBox="0 0 ${W + L * 2} ${Hh + T + 28}" width="${W + L * 2}" role="img" aria-label="${esc(f.alt || 'A labelled triangle')}">${g}</svg>`, f.caption);
  }

  // ---- geometry and measurement diagrams ----
  // { "kind": "diagram", "unit": 36, "items": [ ... ] }  coordinates in units, y up.
  // Items (any mix):
  //   { "seg": [x1, y1, x2, y2], "dash": true, "thin": true, "arrow": "end" | "start" | "both" }   (thin = grid line)
  //   { "poly": [[x, y], ...], "open": true, "fill": true }
  //   { "circle": [cx, cy, r], "fill": true }
  //   { "arc": [cx, cy, r, a1, a2] }               degrees, anticlockwise from east
  //   { "angle": [vx, vy, a1, a2], "label": "40°", "right": true, "r": 0.7 }
  //   { "point": [x, y], "name": "A", "pos": "ne" }  pos: n ne e se s sw w nw
  //   { "label": "5 cm", "at": [x, y], "anchor": "middle" }
  //   { "tick": [x1, y1, x2, y2], "n": 1 }          equal-length marks on a side
  //   { "par": [x1, y1, x2, y2], "n": 1 }           parallel-line arrow marks
  //   { "dim": [x1, y1, x2, y2], "label": "8 cm", "off": 0.5 }  dimension line
  function diagram(f) {
    const items = f.items || [];
    const xs = [], ys = [];
    const add = (x, y) => { xs.push(x); ys.push(y); };
    for (const it of items) {
      if (it.seg) { add(it.seg[0], it.seg[1]); add(it.seg[2], it.seg[3]); }
      if (it.poly) it.poly.forEach(p => add(p[0], p[1]));
      if (it.circle) { const [cx, cy, r] = it.circle; add(cx - r, cy - r); add(cx + r, cy + r); }
      if (it.arc) { const [cx, cy, r] = it.arc; add(cx - r, cy - r); add(cx + r, cy + r); }
      if (it.angle) add(it.angle[0], it.angle[1]);
      if (it.point) add(it.point[0], it.point[1]);
      if (it.at) add(it.at[0], it.at[1]);
      if (it.dim) {
        // the dimension line and its label sit off to one side, so count that space too
        const [ax, ay, bx, by] = it.dim, off = (it.off ?? 0.5), len = Math.hypot(bx - ax, by - ay) || 1;
        const nx = -(by - ay) / len, ny = (bx - ax) / len, k = off + Math.sign(off || 1) * 0.7;
        add(ax, ay); add(bx, by); add(ax + nx * k, ay + ny * k); add(bx + nx * k, by + ny * k);
      }
    }
    if (!xs.length) return '';
    let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let U = f.unit || 36;
    if ((x1 - x0) * U > 480) U = 480 / (x1 - x0);
    if ((y1 - y0) * U > 340) U = Math.min(U, 340 / (y1 - y0));
    const pad = 44, W = (x1 - x0) * U + pad * 2, Hh = (y1 - y0) * U + pad * 2;
    const X = (x) => pad + (x - x0) * U, Y = (y) => pad + (y1 - y) * U;
    const rad = (a) => a * Math.PI / 180;
    const arrowAt = (xa, ya, xb, yb) => {   // arrowhead at (xb, yb) pointing away from (xa, ya)
      const a = Math.atan2(Y(yb) - Y(ya), X(xb) - X(xa)), L = 9;
      const p = (t) => `${(X(xb) - L * Math.cos(a + t)).toFixed(1)},${(Y(yb) - L * Math.sin(a + t)).toFixed(1)}`;
      return `<polygon class="fg-head" points="${X(xb).toFixed(1)},${Y(yb).toFixed(1)} ${p(0.45)} ${p(-0.45)}"/>`;
    };
    const marksOn = ([ax, ay, bx, by], n, kind) => {
      const mx = (X(ax) + X(bx)) / 2, my = (Y(ay) + Y(by)) / 2, a = Math.atan2(Y(by) - Y(ay), X(bx) - X(ax));
      let g = '';
      for (let i = 0; i < n; i++) {
        const o = (i - (n - 1) / 2) * 6, cx = mx + o * Math.cos(a), cy = my + o * Math.sin(a);
        if (kind === 'tick') g += `<line class="fg-mark" x1="${cx - 6 * Math.sin(a)}" y1="${cy + 6 * Math.cos(a)}" x2="${cx + 6 * Math.sin(a)}" y2="${cy - 6 * Math.cos(a)}"/>`;
        else g += `<polyline class="fg-mark" fill="none" points="${cx - 6 * Math.cos(a) - 5 * Math.sin(a)},${cy - 6 * Math.sin(a) + 5 * Math.cos(a)} ${cx},${cy} ${cx - 6 * Math.cos(a) + 5 * Math.sin(a)},${cy - 6 * Math.sin(a) - 5 * Math.cos(a)}"/>`;
      }
      return g;
    };
    const POS = { n: [0, -12, 'middle'], ne: [9, -9, 'start'], e: [11, 5, 'start'], se: [9, 17, 'start'], s: [0, 20, 'middle'], sw: [-9, 17, 'end'], w: [-11, 5, 'end'], nw: [-9, -9, 'end'] };
    let g = '';
    for (const it of items) {
      if (it.poly) {
        const pts = it.poly.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ');
        g += it.open ? `<polyline class="fg-line" fill="none" points="${pts}"/>` : `<polygon class="${it.fill ? 'fg-shape' : 'fg-outline'}" points="${pts}"/>`;
      }
      if (it.circle) { const [cx, cy, r] = it.circle; g += `<circle class="${it.fill ? 'fg-shape' : 'fg-outline'}" cx="${X(cx)}" cy="${Y(cy)}" r="${r * U}"/>`; }
      if (it.arc) {
        const [cx, cy, r, a1, a2] = it.arc, R = r * U;
        const p = (a) => `${(X(cx) + R * Math.cos(rad(a))).toFixed(1)},${(Y(cy) - R * Math.sin(rad(a))).toFixed(1)}`;
        g += `<path class="fg-line" fill="none" d="M${p(a1)} A${R},${R} 0 ${((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0} 0 ${p(a2)}"/>`;
      }
      if (it.seg) {
        const [ax, ay, bx, by] = it.seg;
        g += `<line class="${it.thin ? 'fg-dimline' : 'fg-line'}${it.dash ? ' fg-dash' : ''}" x1="${X(ax)}" y1="${Y(ay)}" x2="${X(bx)}" y2="${Y(by)}"/>`;
        if (it.arrow === 'end' || it.arrow === 'both') g += arrowAt(ax, ay, bx, by);
        if (it.arrow === 'start' || it.arrow === 'both') g += arrowAt(bx, by, ax, ay);
      }
      if (it.tick) g += marksOn(it.tick, it.n || 1, 'tick');
      if (it.par) g += marksOn(it.par, it.n || 1, 'par');
      if (it.angle) {
        const [vx, vy, a1, a2] = it.angle, R = (it.r || (it.right ? 0.45 : 0.7)) * U;
        const sweep = ((a2 - a1) % 360 + 360) % 360, mid = rad(a1 + sweep / 2);
        if (it.right) {
          const u = [Math.cos(rad(a1)), -Math.sin(rad(a1))], v = [Math.cos(rad(a2)), -Math.sin(rad(a2))], s = R * 0.75;
          g += `<polyline class="fg-mark" fill="none" points="${X(vx) + u[0] * s},${Y(vy) + u[1] * s} ${X(vx) + (u[0] + v[0]) * s},${Y(vy) + (u[1] + v[1]) * s} ${X(vx) + v[0] * s},${Y(vy) + v[1] * s}"/>`;
        } else {
          const p = (a) => `${(X(vx) + R * Math.cos(rad(a))).toFixed(1)},${(Y(vy) - R * Math.sin(rad(a))).toFixed(1)}`;
          g += `<path class="fg-angle" d="M${p(a1)} A${R},${R} 0 ${sweep > 180 ? 1 : 0} 0 ${p(a1 + sweep)}"/>`;
        }
        if (it.label) {
          const LR = R + 14;
          g += `<text class="fg-alabel" x="${X(vx) + LR * Math.cos(mid)}" y="${Y(vy) - LR * Math.sin(mid) + 5}" text-anchor="middle">${esc(it.label)}</text>`;
        }
      }
      if (it.dim) {
        const [ax, ay, bx, by] = it.dim, off = (it.off ?? 0.5) * U;
        const a = Math.atan2(Y(by) - Y(ay), X(bx) - X(ax)), nx = Math.sin(a) * off, ny = -Math.cos(a) * off;
        const P = [X(ax) + nx, Y(ay) + ny], Q = [X(bx) + nx, Y(by) + ny];
        g += `<line class="fg-dimline" x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}"/>`;
        for (const [px, py] of [P, Q]) g += `<line class="fg-dimline" x1="${px - Math.sin(a) * 5}" y1="${py + Math.cos(a) * 5}" x2="${px + Math.sin(a) * 5}" y2="${py - Math.cos(a) * 5}"/>`;
        if (it.label) {
          // label beside the line, anchored away from it so a vertical label never sits on the line
          const lx = Math.sin(a) * Math.sign(off || 1) * 10, ly = -Math.cos(a) * Math.sign(off || 1) * 12;
          const anchor = lx < -3 ? 'end' : lx > 3 ? 'start' : 'middle';
          g += `<text class="fg-side" x="${(P[0] + Q[0]) / 2 + lx}" y="${(P[1] + Q[1]) / 2 + ly + 5}" text-anchor="${anchor}">${esc(it.label)}</text>`;
        }
      }
      if (it.point) {
        const [x, y] = it.point, [dx, dy, anc] = POS[it.pos || 'ne'] || POS.ne;
        g += `<circle class="fg-pt" cx="${X(x)}" cy="${Y(y)}" r="3.5"/>`;
        if (it.name) g += `<text class="fg-ptl" x="${X(x) + dx}" y="${Y(y) + dy}" text-anchor="${anc}">${esc(it.name)}</text>`;
      }
      if (it.label && it.at) g += `<text class="fg-side" x="${X(it.at[0])}" y="${Y(it.at[1]) + 5}" text-anchor="${it.anchor || 'middle'}">${esc(it.label)}</text>`;
    }
    return frame(`<svg viewBox="0 0 ${W.toFixed(0)} ${Hh.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="${esc(f.alt || 'A diagram')}">${g}</svg>`, f.caption);
  }

  // ---- statistics graphs ----
  const niceStep = (max) => { const raw = max / 5, p = Math.pow(10, Math.floor(Math.log10(raw || 1))); return [1, 2, 5, 10].map(m => m * p).find(s => s >= raw) || p * 10; };

  // { "kind": "columns", "cats": ["Mon", "Tue"], "values": [3, 5], "ymax": 10, "step": 2,
  //   "xlabel": "Day", "ylabel": "Number of students", "title": "..." }
  function columns(f) {
    const cats = f.cats || [], vals = f.values || [], n = Math.max(cats.length, vals.length);
    const step = f.step || niceStep(Math.max(...vals)), ymax = f.ymax || Math.ceil(Math.max(...vals) / step) * step;
    const L = 56, B = 54, T = f.title ? 30 : 14, cw = Math.max(34, Math.min(64, 420 / n)), W = n * cw + 20, Hh = 200;
    const Y = (v) => T + Hh - (v / ymax) * Hh;
    let g = f.title ? `<text class="fg-title" x="${L + W / 2}" y="18" text-anchor="middle">${esc(f.title)}</text>` : '';
    for (let v = 0; v <= ymax + 1e-9; v += step) {
      g += `<line class="fg-grid" x1="${L}" y1="${Y(v)}" x2="${L + W}" y2="${Y(v)}"/><text class="fg-tick" x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${+v.toFixed(6)}</text>`;
    }
    // "histogram": true joins the columns (no gaps); "edges" then labels the class
    // boundaries under the joins instead of each column's middle (one more edge than columns).
    const hist = !!f.histogram, edges = f.edges;
    vals.forEach((v, i) => {
      const x = L + 10 + i * cw;
      g += hist ? `<rect class="fg-col fg-hist" x="${x}" y="${Y(v)}" width="${cw}" height="${Y(0) - Y(v)}"/>`
        : `<rect class="fg-col" x="${x + cw * 0.15}" y="${Y(v)}" width="${cw * 0.7}" height="${Y(0) - Y(v)}"/>`;
      if (!(hist && edges)) g += `<text class="fg-tick" x="${x + cw / 2}" y="${T + Hh + 16}" text-anchor="middle">${esc(cats[i] ?? '')}</text>`;
    });
    if (hist && edges) edges.forEach((e, i) => { g += `<text class="fg-tick" x="${L + 10 + i * cw}" y="${T + Hh + 16}" text-anchor="middle">${esc(e)}</text>`; });
    g += `<line class="fg-axis" x1="${L}" y1="${T}" x2="${L}" y2="${T + Hh}"/><line class="fg-axis" x1="${L}" y1="${T + Hh}" x2="${L + W}" y2="${T + Hh}"/>`;
    if (f.xlabel) g += `<text class="fg-label" x="${L + W / 2}" y="${T + Hh + 40}" text-anchor="middle">${esc(f.xlabel)}</text>`;
    if (f.ylabel) g += `<text class="fg-label" transform="translate(14 ${T + Hh / 2}) rotate(-90)" text-anchor="middle">${esc(f.ylabel)}</text>`;
    return frame(`<svg viewBox="0 0 ${L + W + 10} ${T + Hh + B}" width="${L + W + 10}" role="img" aria-label="${esc(f.alt || 'A column graph')}">${g}</svg>`, f.caption);
  }

  // { "kind": "dotplot", "min": 0, "max": 10, "values": [2, 3, 3, 5], "xlabel": "Goals" }
  function dotplot(f) {
    const lo = f.min ?? 0, hi = f.max ?? 10, st = f.step || 1, n = Math.round((hi - lo) / st);
    const counts = {}; (f.values || []).forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    const maxC = Math.max(1, ...Object.values(counts)), gap = Math.max(26, Math.min(44, 440 / n)), L = 24, W = n * gap, D = 15;
    const Hh = maxC * D + 18, yAxis = Hh + 10;
    const X = (v) => L + ((v - lo) / st) * gap;
    let g = `<line class="fg-axis" x1="${L - 8}" y1="${yAxis}" x2="${L + W + 8}" y2="${yAxis}"/>`;
    for (let i = 0; i <= n; i++) { const v = +(lo + i * st).toFixed(6); g += `<line class="fg-axis" x1="${X(v)}" y1="${yAxis}" x2="${X(v)}" y2="${yAxis + 6}"/><text class="fg-tick" x="${X(v)}" y="${yAxis + 20}" text-anchor="middle">${v}</text>`; }
    for (const [v, c] of Object.entries(counts)) for (let k = 0; k < c; k++) g += `<circle class="fg-dot" cx="${X(+v)}" cy="${yAxis - 10 - k * D}" r="5.5"/>`;
    if (f.xlabel) g += `<text class="fg-label" x="${L + W / 2}" y="${yAxis + 42}" text-anchor="middle">${esc(f.xlabel)}</text>`;
    return frame(`<svg viewBox="0 0 ${L * 2 + W} ${yAxis + (f.xlabel ? 50 : 28)}" width="${L * 2 + W}" role="img" aria-label="${esc(f.alt || 'A dot plot')}">${g}</svg>`, f.caption);
  }

  // { "kind": "stemleaf", "rows": [["1", "2 5 7"], ["2", "0 3"]], "key": "2 | 3 means 23",
  //   "back": [["", "4 1"], ...] }  back = optional left-hand leaves for a back-to-back plot
  function stemleaf(f) {
    const back = f.back;
    const rows = (f.rows || []).map((r, i) => `<tr>${back ? `<td class="sl-back">${esc((back[i] || ['', ''])[1])}</td>` : ''}<th>${esc(r[0])}</th><td class="sl-leaf">${esc(r[1])}</td></tr>`).join('');
    const head = `<tr>${back ? `<th class="sl-h">${esc(f.backLabel || 'Leaf')}</th>` : ''}<th class="sl-h">Stem</th><th class="sl-h">${esc(f.leafLabel || 'Leaf')}</th></tr>`;
    return `<figure class="fig fig-frac"><table class="fig-stemleaf">${head}${rows}</table>${f.key ? `<figcaption>Key: ${esc(f.key)}</figcaption>` : ''}</figure>`;
  }

  // { "kind": "linegraph", "xs": ["8am", "9am"], "ys": [12, 15], "ymin": 0, "ymax": 30, "step": 5,
  //   "xlabel": "Time", "ylabel": "Temperature (°C)", "title": "..." }
  function linegraph(f) {
    const xs = f.xs || [], ys = f.ys || [], n = xs.length;
    const lo = f.ymin ?? 0, step = f.step || niceStep(Math.max(...ys) - lo), hi = f.ymax ?? (lo + Math.ceil((Math.max(...ys) - lo) / step) * step);
    const L = 56, T = f.title ? 30 : 14, gap = Math.max(36, Math.min(70, 420 / Math.max(1, n - 1))), W = (n - 1) * gap + 30, Hh = 190;
    const X = (i) => L + 15 + i * gap, Y = (v) => T + Hh - ((v - lo) / (hi - lo)) * Hh;
    let g = f.title ? `<text class="fg-title" x="${L + W / 2}" y="18" text-anchor="middle">${esc(f.title)}</text>` : '';
    for (let v = lo; v <= hi + 1e-9; v += step) g += `<line class="fg-grid" x1="${L}" y1="${Y(v)}" x2="${L + W}" y2="${Y(v)}"/><text class="fg-tick" x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${+v.toFixed(6)}</text>`;
    xs.forEach((x, i) => { g += `<text class="fg-tick" x="${X(i)}" y="${T + Hh + 16}" text-anchor="middle">${esc(x)}</text>`; });
    g += `<polyline class="fg-path" points="${ys.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}"/>`;
    ys.forEach((v, i) => { g += `<circle class="fg-pt" cx="${X(i)}" cy="${Y(v)}" r="4"/>`; });
    g += `<line class="fg-axis" x1="${L}" y1="${T}" x2="${L}" y2="${T + Hh}"/><line class="fg-axis" x1="${L}" y1="${T + Hh}" x2="${L + W}" y2="${T + Hh}"/>`;
    if (f.xlabel) g += `<text class="fg-label" x="${L + W / 2}" y="${T + Hh + 40}" text-anchor="middle">${esc(f.xlabel)}</text>`;
    if (f.ylabel) g += `<text class="fg-label" transform="translate(14 ${T + Hh / 2}) rotate(-90)" text-anchor="middle">${esc(f.ylabel)}</text>`;
    return frame(`<svg viewBox="0 0 ${L + W + 10} ${T + Hh + 54}" width="${L + W + 10}" role="img" aria-label="${esc(f.alt || 'A line graph')}">${g}</svg>`, f.caption);
  }

  // { "kind": "sector", "parts": [["Soccer", 90], ["Netball", 60]] }   (values are relative)
  // { "kind": "dividedbar", "parts": [["Soccer", 90], ["Netball", 60]] }
  // { "kind": "spinner", "labels": ["Red", "Blue", "Red", "Green"] }    equal sectors, labels inside
  function sector(f) {
    const parts = f.parts || [], tot = parts.reduce((a, p) => a + p[1], 0) || 1, R = 70, c = 80;
    let a = -90, g = '', legend = '';
    parts.forEach(([lab, v], i) => {
      const sweep = (v / tot) * 360, a1 = a + sweep;
      const p = (t) => `${(c + R * Math.cos(t * Math.PI / 180)).toFixed(1)},${(c + R * Math.sin(t * Math.PI / 180)).toFixed(1)}`;
      g += parts.length === 1 ? `<circle class="fg-c${i % 6}" cx="${c}" cy="${c}" r="${R}"/>` : `<path class="fg-c${i % 6}" d="M${c},${c} L${p(a)} A${R},${R} 0 ${sweep > 180 ? 1 : 0} 1 ${p(a1)} Z"/>`;
      legend += `<span class="fig-key"><i class="fg-c${i % 6}"></i>${esc(lab)}</span>`;
      a = a1;
    });
    return `<figure class="fig fig-frac"><svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${esc(f.alt || 'A sector graph')}">${g}</svg><figcaption class="fig-legend">${f.caption ? `<b class="fig-cap">${esc(f.caption)}</b>` : ''}${legend}</figcaption></figure>`;
  }
  function dividedbar(f) {
    const parts = f.parts || [], tot = parts.reduce((a, p) => a + p[1], 0) || 1, W = 340;
    let x = 2, g = '', legend = '';
    parts.forEach(([lab, v], i) => {
      const w = (v / tot) * W;
      g += `<rect class="fg-c${i % 6}" x="${x}" y="2" width="${w}" height="40"/>`;
      legend += `<span class="fig-key"><i class="fg-c${i % 6}"></i>${esc(lab)}</span>`;
      x += w;
    });
    return `<figure class="fig fig-frac"><svg viewBox="0 0 ${W + 4} 44" width="${W + 4}" role="img" aria-label="${esc(f.alt || 'A divided bar graph')}">${g}</svg><figcaption class="fig-legend">${f.caption ? `<b class="fig-cap">${esc(f.caption)}</b>` : ''}${legend}</figcaption></figure>`;
  }
  function spinner(f) {
    const labs = f.labels || [], n = labs.length, R = 70, c = 80;
    let g = '';
    labs.forEach((lab, i) => {
      const a0 = -90 + (360 * i) / n, a1 = -90 + (360 * (i + 1)) / n, am = (a0 + a1) / 2;
      const p = (t, r = R) => `${(c + r * Math.cos(t * Math.PI / 180)).toFixed(1)},${(c + r * Math.sin(t * Math.PI / 180)).toFixed(1)}`;
      g += n === 1 ? `<circle class="fg-off" cx="${c}" cy="${c}" r="${R}"/>` : `<path class="fg-off" d="M${c},${c} L${p(a0)} A${R},${R} 0 0 1 ${p(a1)} Z"/>`;
      const [tx, ty] = p(am, R * 0.62).split(',');
      g += `<text class="fg-spin" x="${tx}" y="${+ty + 4}" text-anchor="middle">${esc(lab)}</text>`;
    });
    g += `<line class="fg-axis" x1="${c}" y1="${c}" x2="${c + 40}" y2="${c - 30}"/><circle class="fg-pt" cx="${c}" cy="${c}" r="4"/>`;
    return frame(`<svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${esc(f.alt || 'A spinner')}">${g}</svg>`, f.caption);
  }

  // { "kind": "boxplot", "min": 0, "max": 50, "step": 5, "xlabel": "Minutes",
  //   "plots": [{ "label": "Class A", "five": [4, 12, 20, 31, 44], "outliers": [49] }] }
  // five = minimum, Q1, median, Q3, maximum (the whiskers; outliers sit beyond them as
  // crosses). Several plots share one scale, for parallel box plots.
  function boxplot(f) {
    const lo = f.min ?? 0, hi = f.max ?? 10, st = f.step || niceStep(hi - lo), plots = f.plots || [];
    const labelled = plots.some(p => p.label), L = labelled ? 86 : 20, W = 400, rowH = 46, T = 10;
    const X = (v) => L + ((v - lo) / (hi - lo)) * W;
    const yAxis = T + plots.length * rowH + 6;
    let g = '';
    plots.forEach((p, i) => {
      const [a, q1, m, q3, b] = p.five || [], cy = T + i * rowH + rowH / 2, h = 26;
      g += `<line class="fg-axis" x1="${X(a)}" y1="${cy}" x2="${X(q1)}" y2="${cy}"/><line class="fg-axis" x1="${X(q3)}" y1="${cy}" x2="${X(b)}" y2="${cy}"/>`;
      g += `<line class="fg-axis" x1="${X(a)}" y1="${cy - 8}" x2="${X(a)}" y2="${cy + 8}"/><line class="fg-axis" x1="${X(b)}" y1="${cy - 8}" x2="${X(b)}" y2="${cy + 8}"/>`;
      g += `<rect class="fg-col" x="${X(q1)}" y="${cy - h / 2}" width="${X(q3) - X(q1)}" height="${h}"/>`;
      g += `<line class="fg-axis" x1="${X(m)}" y1="${cy - h / 2}" x2="${X(m)}" y2="${cy + h / 2}"/>`;
      (p.outliers || []).forEach(o => { g += `<path class="fg-axis" d="M${X(o) - 5},${cy - 5} L${X(o) + 5},${cy + 5} M${X(o) - 5},${cy + 5} L${X(o) + 5},${cy - 5}"/>`; });
      if (p.label) g += `<text class="fg-label" x="${L - 10}" y="${cy + 4}" text-anchor="end">${esc(p.label)}</text>`;
    });
    g += `<line class="fg-axis" x1="${L - 6}" y1="${yAxis}" x2="${L + W + 6}" y2="${yAxis}"/>`;
    for (let v = lo; v <= hi + 1e-9; v += st) { const vv = +v.toFixed(6); g += `<line class="fg-axis" x1="${X(vv)}" y1="${yAxis}" x2="${X(vv)}" y2="${yAxis + 6}"/><text class="fg-tick" x="${X(vv)}" y="${yAxis + 20}" text-anchor="middle">${vv}</text>`; }
    if (f.xlabel) g += `<text class="fg-label" x="${L + W / 2}" y="${yAxis + 42}" text-anchor="middle">${esc(f.xlabel)}</text>`;
    return frame(`<svg viewBox="0 0 ${L + W + 24} ${yAxis + (f.xlabel ? 50 : 28)}" width="${L + W + 24}" role="img" aria-label="${esc(f.alt || 'A box plot')}">${g}</svg>`, f.caption);
  }

  const KINDS = { plane, sticks, dots, table, pie, bar, grid, numberline, rect, tri, diagram, columns, dotplot, stemleaf, linegraph, sector, dividedbar, spinner, boxplot };
  window.H3Figure = function (spec) {
    try { return KINDS[spec && spec.kind] ? KINDS[spec.kind](spec) : ''; }
    catch (e) { return ''; }
  };
})();
