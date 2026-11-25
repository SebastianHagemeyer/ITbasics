/* H3 help panels for Year 8 Chapter 10. Loaded with bank-y8.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y8-". */
/* Help panels for Year 8 10A to 10I. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- drawing helpers for this chapter (every picture uses the panel's own numbers) ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const D = (items, alt, unit) => fig(Object.assign({ kind: 'diagram', items, alt }, unit ? { unit } : {}));
  // Square grid from (x0, y0) to (x1, y1). With axes: true it also draws numbered x and y axes.
  const G = (x0, x1, y0, y1, items, o = {}) => {
    const it = [];
    for (let x = x0; x <= x1; x++) it.push({ seg: [x, y0, x, y1], thin: true });
    for (let y = y0; y <= y1; y++) it.push({ seg: [x0, y, x1, y], thin: true });
    if (o.axes) {
      it.push({ seg: [x0 - 0.4, 0, x1 + 0.4, 0], arrow: 'both' }, { seg: [0, y0 - 0.4, 0, y1 + 0.4], arrow: 'both' });
      it.push({ label: 'x', at: [x1 + 0.75, 0] }, { label: 'y', at: [0, y1 + 0.75] });
      for (let x = x0; x <= x1; x++) if (x) it.push({ label: String(x).replace('-', '−'), at: [x, -0.55] });
      // the y-axis skips −1 when the x-axis has a −1 label right beside it
      for (let y = y0; y <= y1; y++) if (y && !(y === -1 && x0 <= -1)) it.push({ label: String(y).replace('-', '−'), at: [-0.45, y], anchor: 'end' });
    }
    return fig({ kind: 'diagram', unit: o.unit || 24, items: it.concat(items), alt: o.alt || 'A grid' });
  };
  // A polygon with its vertex names pushed away from the middle and side labels outside each side.
  // sides[i] labels the side from pts[i] to pts[i + 1].
  const POSN = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
  const shape = (pts, names, sides, o = {}) => {
    const n = pts.length, cx = pts.reduce((a, p) => a + p[0], 0) / n, cy = pts.reduce((a, p) => a + p[1], 0) / n;
    const it = [{ poly: pts, fill: !!o.fill }];
    pts.forEach((p, i) => {
      if (!names || !names[i]) return;
      const k = ((Math.round(Math.atan2(p[1] - cy, p[0] - cx) / (Math.PI / 4)) % 8) + 8) % 8;
      it.push({ point: p, name: names[i], pos: POSN[k] });
    });
    (sides || []).forEach((s, i) => {
      if (!s) return;
      const p = pts[i], q = pts[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      let nx = -(q[1] - p[1]), ny = q[0] - p[0];
      const L = Math.hypot(nx, ny); nx /= L; ny /= L;
      if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      const off = o.off || 0.4;
      it.push({ label: s, at: [r3(mx + nx * off), r3(my + ny * off - 0.08)], anchor: nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle' });
    });
    return it;
  };
  // The angle at V inside the corner P V Q (always the side under 180°).
  const deg = (V, P) => Math.atan2(P[1] - V[1], P[0] - V[0]) * 180 / Math.PI;
  const ang = (V, P, Q, label, r) => {
    let a1 = deg(V, P), a2 = deg(V, Q);
    if (((a2 - a1) % 360 + 360) % 360 > 180) [a1, a2] = [a2, a1];
    const it = { angle: [V[0], V[1], r3(a1), r3(a2)] };
    if (label) it.label = label;
    if (r) it.r = r;
    return it;
  };
  const rt = (V, P, Q) => Object.assign(ang(V, P, Q), { right: true });
  const lab = (label, x, y, anchor) => (anchor ? { label, at: [x, y], anchor } : { label, at: [x, y] });
  const reg = (cx, cy, R, n, start) => Array.from({ length: n }, (_, k) => [r3(cx + R * Math.cos((start + 360 * k / n) * Math.PI / 180)), r3(cy + R * Math.sin((start + 360 * k / n) * Math.PI / 180))]);

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // 10A Reflection
    // =====================================================================
    // Y8 10A Q1, Q2, Q3: choosing the correct reflected image
    'y8-10a-choose': `
      <p class="hp-tag">Worked example: reflect the shaded triangle in the dashed mirror line.</p>
      ${G(0, 10, 0, 5, [
        { poly: [[1, 1], [3, 1], [1, 4]], fill: true },
        { poly: [[9, 1], [7, 1], [9, 4]] },
        { seg: [5, -0.3, 5, 5.3], dash: true }
      ], { unit: 24, alt: 'A triangle and its reflection in a vertical mirror line' })}
      ${steps(
        `<p><strong>Count from each corner straight to the mirror line.</strong> The bottom left corner is 4 squares from the line. The corner on its right is 2 squares from it.</p>`,
        `<p><strong>Count the same number of squares out the other side.</strong> 4 squares past the line, then 2 squares past the line, and so on for every corner.</p>`,
        `<p><strong>Join the new corners.</strong> The image is the same size, but flipped: the right angle that was on the left of the triangle is now on the right.</p>
         ${ans('The flipped triangle, the same distance away')}`
      )}
      <p><strong>Sloping mirror line?</strong> Go straight across to the line on a diagonal through the squares, then the same number of diagonal steps out the other side. A point sitting on the mirror line stays where it is.</p>
      ${G(0, 6, 0, 6, [
        { poly: [[1, 3], [1, 5], [2, 5]], fill: true },
        { poly: [[3, 1], [5, 1], [5, 2]] },
        { seg: [-0.3, -0.3, 6.3, 6.3], dash: true }
      ], { unit: 22, alt: 'A triangle reflected in a sloping mirror line' })}
      ${tip('Check the wrong choices for the usual mistakes: an image that has just slid across (not flipped), or one that is the wrong distance from the line.')}`,

    // Y8 10A Q4: finding the mirror line
    'y8-10a-line': `
      <p class="hp-tag">Worked example: the shaded triangle has been reflected to give the unshaded one. Find the equation of the mirror line.</p>
      ${G(-6, 4, -1, 4, [
        { poly: [[-5, 1], [-3, 1], [-5, 3]], fill: true },
        { poly: [[3, 1], [1, 1], [3, 3]] },
        { seg: [-1, -1.3, -1, 4.3], dash: true },
        { point: [-5, 1], name: 'A', pos: 'nw' },
        { point: [3, 1], name: 'A′', pos: 'ne' }
      ], { axes: true, unit: 24, alt: 'A triangle and its image either side of the line x = −1' })}
      ${steps(
        `<p><strong>Pick a corner and its image.</strong> A(−5, 1) matches A′(3, 1). Only the x-coordinate changes, so the mirror line is vertical: it has an equation x = something.</p>`,
        `<p><strong>The mirror is exactly halfway between them.</strong> Count the squares from A across to A′: 8 squares. Half of that is 4, so the mirror is 4 squares from each.</p>
         ${sum('4 squares right of A (x = −5) is x = −1')}
         <p>Check another corner: the corner at (−3, 1) is 2 squares from x = −1, and so is its image at (1, 1).</p>
         ${ans('x = -1')}`
      )}
      <p><strong>Choosing from lines p, q and r?</strong> Test each line: the right one is halfway between <em>every</em> corner and its image, and each corner and its image join at a right angle to it.</p>
      ${tip('A vertical line is x = a number and a horizontal line is y = a number. Type it like x=-1 or y = 4.')}`,

    // Y8 10A Q5, Q6: reflecting in the x-axis or the y-axis
    'y8-10a-axes': `
      <p class="hp-tag">Worked example: triangle PQR has P(2, 1), Q(5, 2) and R(3, 5). Reflect it in the x-axis, then in the y-axis.</p>
      ${G(-1, 6, -5, 5, [
        { poly: [[2, 1], [5, 2], [3, 5]], fill: true },
        { poly: [[2, -1], [5, -2], [3, -5]] },
        { point: [2, 1], name: 'P', pos: 'nw' }, { point: [5, 2], name: 'Q', pos: 'e' }, { point: [3, 5], name: 'R', pos: 'n' },
        { point: [2, -1], name: 'P′', pos: 'sw' }, { point: [5, -2], name: 'Q′', pos: 'e' }, { point: [3, -5], name: 'R′', pos: 's' }
      ], { axes: true, unit: 22, alt: 'Triangle PQR and its reflection in the x-axis' })}
      ${steps(
        `<p><strong>In the x-axis, a point flips up or down.</strong> It stays the same distance from the axis, so x stays the same and y changes sign.</p>
         ${sum('P(2, 1) → P′(2, −1)<br>Q(5, 2) → Q′(5, −2)<br>R(3, 5) → R′(3, −5)')}`,
        `<p><strong>In the y-axis, a point flips left or right.</strong> Now y stays the same and x changes sign.</p>
         ${sum('P(2, 1) → (−2, 1)<br>Q(5, 2) → (−5, 2)<br>R(3, 5) → (−3, 5)')}
         ${ans('(2, -1), (5, -2), (3, -5)')}`
      )}
      ${tip('Type each point in brackets with a comma, like (2, -1). Check on the grid: the image should be the same distance from the axis, on the other side.')}`,

    // Y8 10A Q8: reflecting a point in a line x = a or y = b
    'y8-10a-lines': `
      <p class="hp-tag">Worked example: reflect the point P(−1, 4) in the line x = 3, then in the line y = −2.</p>
      ${G(-2, 8, -1, 5, [
        { seg: [3, -1.3, 3, 5.3], dash: true }, lab('x = 3', 3.3, 5.6, 'start'),
        { seg: [-1, 4, 2.95, 4], arrow: 'end' }, { seg: [3.05, 4, 7, 4], arrow: 'end' },
        lab('4', 1, 4.4), lab('4', 5, 4.4),
        { point: [-1, 4], name: 'P', pos: 'sw' }, { point: [7, 4], name: 'P′', pos: 'se' }
      ], { axes: true, unit: 24, alt: 'The point P reflected in the line x = 3' })}
      ${steps(
        `<p><strong>Find the distance to the line.</strong> P has x = −1 and the line is at x = 3. The gap is 3 − (−1) = 4 squares.</p>`,
        `<p><strong>Go the same distance past the line.</strong> 3 + 4 = 7. A line x = 3 only moves the x-coordinate, so y stays 4.</p>
         ${ans('(7, 4)')}`,
        `<p><strong>Now the line y = −2.</strong> This moves only the y-coordinate. P is at y = 4, which is 4 − (−2) = 6 above the line. Go 6 below it: −2 − 6 = −8.</p>
         ${ans('(-1, -8)')}`
      )}
      ${tip('Always count to the line first, then the same number of squares past it. A quick sketch shows whether the image has landed on the other side, the same distance away.')}`,

    // Y8 10A Q12: reflecting in y = x and y = −x (and the axes)
    'y8-10a-diag': `
      <p class="hp-tag">Worked example: reflect the point P(5, −3) in the line y = x, then in the line y = −x.</p>
      ${G(-5, 5, -5, 5, [
        { seg: [-5.3, -5.3, 5.3, 5.3], dash: true }, { seg: [-5.3, 5.3, 5.3, -5.3], dash: true },
        lab('y = x', 4.2, 5.6), lab('y = −x', -4.2, 5.6),
        { seg: [5, -3, -3, 5], arrow: 'end' }, { seg: [5, -3, 3, -5], arrow: 'end' },
        { point: [5, -3], name: 'P', pos: 'e' }, { point: [1, 1], name: 'M', pos: 'se' }, { point: [-3, 5], name: 'P′', pos: 'e' }, { point: [3, -5], name: 'P″', pos: 'e' }
      ], { axes: true, unit: 21, alt: 'P reflected at right angles across the lines y = x and y = −x' })}
      ${steps(
        `<p><strong>Go from P at right angles to the mirror line.</strong> The line y = x runs diagonally, so a right angle to it is the other diagonal: each step is 1 left and 1 up. From P(5, −3) it takes 4 steps to reach the mirror, at M(1, 1).</p>`,
        `<p><strong>Go the same distance out the other side.</strong> 4 more steps of 1 left and 1 up from M.</p>
         ${sum('M(1, 1) → 4 left, 4 up → P′(−3, 5)')}`,
        `<p><strong>Same idea for y = −x.</strong> A right angle to it is a step of 1 left and 1 down. From P, 1 step reaches the mirror at (4, −4), so take 1 more step past it.</p>
         ${sum('(4, −4) → 1 left, 1 down → P″(3, −5)')}
         ${ans('(-3, 5) and (3, -5)')}`
      )}
      <p><strong>The axes, for comparison.</strong> In the y-axis only x changes sign: (−5, −3). In the x-axis only y changes sign: (5, 3).</p>
      ${tip('Reflect one vertex at a time, then join them up. Check on the grid: the line from P to its image crosses the mirror at a right angle, with the mirror exactly halfway.')}`,

    // Y8 10A Q7, Q10: lines of symmetry
    'y8-10a-symmetry': `
      <p class="hp-tag">Worked example: how many lines of symmetry do a rhombus and a regular octagon have?</p>
      ${D([
        { poly: [[0, -1.5], [1, 0], [0, 1.5], [-1, 0]] },
        { seg: [0, -1.9, 0, 1.9], dash: true }, { seg: [-1.4, 0, 1.4, 0], dash: true },
        { poly: reg(4.5, 0, 1.6, 8, 22.5) },
        ...[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map(a => ({ seg: [r3(4.5 + 1.95 * Math.cos(a * Math.PI / 180)), r3(1.95 * Math.sin(a * Math.PI / 180)), r3(4.5 - 1.95 * Math.cos(a * Math.PI / 180)), r3(-1.95 * Math.sin(a * Math.PI / 180))], dash: true })),
        lab('2 lines', 0, -2.4), lab('8 lines', 4.5, -2.4)
      ], 'A rhombus with 2 lines of symmetry and a regular octagon with 8', 34)}
      ${steps(
        `<p><strong>Imagine folding along a line.</strong> It is a line of symmetry only if the two halves land exactly on top of each other.</p>`,
        `<p><strong>Rhombus.</strong> Folding along either diagonal works. A fold joining the middles of opposite sides does not: the slanted corners miss each other.</p>
         ${ans('2')}`,
        `<p><strong>Regular octagon.</strong> Every side and angle is equal, so there are lines through opposite corners (4) and lines through the middles of opposite sides (4).</p>
         ${ans('8')}`
      )}
      ${tip('Count carefully and check each line by folding in your head. For a rule with n, count the lines for a few regular polygons (3, 4, 5 sides ...) and look for the pattern.')}`,

    // Y8 10A Q9, Q11, Q13: what a reflection keeps the same
    'y8-10a-facts': `
      <p class="hp-tag">Worked example: a right-angled triangle with sides 3 cm, 4 cm and 5 cm, and an area of 6 cm², is reflected in a line.</p>
      ${D([
        ...shape([[0.5, 0], [2, 0], [0.5, 2]], null, ['3 cm', '5 cm', '4 cm'], { fill: true, off: 0.35 }),
        rt([0.5, 0], [2, 0], [0.5, 2]),
        { seg: [2.6, -0.4, 2.6, 2.4], dash: true },
        ...shape([[4.7, 0], [3.2, 0], [4.7, 2]], null, ['3 cm', '5 cm', '4 cm'], { off: 0.35 }),
        rt([4.7, 0], [3.2, 0], [4.7, 2])
      ], 'A triangle and its mirror image with the same side lengths', 48)}
      ${steps(
        `<p><strong>A reflection only flips the shape.</strong> Every length and every angle stays the same, so the image has sides 3 cm, 4 cm and 5 cm, a right angle, and the same area.</p>
         ${ans('6 cm²')}`,
        `<p><strong>Reflect twice in the same line and you are back where you started.</strong> The point (2, 3) reflected in the y-axis goes to (−2, 3). Reflect that in the y-axis again: (2, 3). The second reflection undoes the first.</p>`,
        `<p><strong>Think about distance from the mirror.</strong> Each image point is the same distance from the mirror as the point it came from, on the other side. Ask yourself what that means for a point whose distance is 0.</p>`
      )}
      ${tip('For a chain of reflections, test it on one real point, like (2, 3), and write down where it is after each step.')}`,

    // Y8 10A Q14: reflecting through a point, and point symmetry
    'y8-10a-point': `
      <p class="hp-tag">Worked example: reflect the point A(−1, 0) through the point P(1, 2).</p>
      ${fig({ kind: 'plane', x: [-2, 4], y: [-1, 5], path: [[-1, 0], [1, 2], [3, 4]], points: { A: [-1, 0], P: [1, 2], 'A′': [3, 4] }, alt: 'A, P and the image A′ in a straight line' })}
      ${steps(
        `<p><strong>Find the move from A to P.</strong> From x = −1 to x = 1 is 2 right. From y = 0 to y = 2 is 2 up.</p>`,
        `<p><strong>Make the same move again, starting from P.</strong> 2 right and 2 up from (1, 2).</p>
         ${sum('(1 + 2, 2 + 2) = (3, 4)')}
         ${ans('(3, 4)')}`,
        `<p><strong>Point symmetry.</strong> A shape has point symmetry if doing this through its centre gives the same shape, which is the same as a half turn (180°). A regular hexagon does. A regular pentagon does not: upside down, its point is at the bottom.</p>`
      )}
      ${tip('P must be exactly halfway between A and its image. Check: the middle of (−1, 0) and (3, 4) is (1, 2). Type the point like (3, 4).')}`,

    // =====================================================================
    // 10B Translation
    // =====================================================================
    // Y8 10B Q1, Q2: the vector from a point to its image
    'y8-10b-vector': `
      <p class="hp-tag">Worked example: find the translation vector that moves P(−2, 3) to P′(3, 1).</p>
      ${G(-3, 4, -1, 4, [
        { seg: [-2, 3, 3, 3], arrow: 'end', dash: true }, { seg: [3, 3, 3, 1], arrow: 'end', dash: true },
        lab('5 right', 1.6, 3.45), lab('2 down', 3.3, 2, 'start'),
        { point: [-2, 3], name: 'P', pos: 'nw' }, { point: [3, 1], name: 'P′', pos: 'se' }
      ], { axes: true, unit: 28, alt: 'P moves 5 right and 2 down to P′' })}
      ${steps(
        `<p><strong>Across: image x minus start x.</strong></p>
         ${sum('3 − (−2) = 5 &nbsp; (5 to the right)')}`,
        `<p><strong>Up or down: image y minus start y.</strong></p>
         ${sum('1 − 3 = −2 &nbsp; (2 down)')}
         ${ans('(5, -2)')}`
      )}
      ${tip('Right and up are positive, left and down are negative. Always do image minus start, then check by counting squares. Type the vector like (5, -2).')}`,

    // Y8 10B Q3, Q4: moving a point by a vector
    'y8-10b-apply': `
      <p class="hp-tag">Worked example: the triangle is translated by the vector (5, −3). Where does the corner Q(−4, 2) end up?</p>
      ${G(-5, 4, -2, 5, [
        { poly: [[-4, 2], [-2, 2], [-4, 4]], fill: true },
        { poly: [[1, -1], [3, -1], [1, 1]] },
        { seg: [-4, 2, 1, -1], arrow: 'end', dash: true },
        { point: [-4, 2], name: 'Q', pos: 'w' }, { point: [1, -1], name: 'Q′', pos: 'sw' }
      ], { axes: true, unit: 26, alt: 'A triangle slid 5 right and 3 down' })}
      ${steps(
        `<p><strong>Add the first number of the vector to x.</strong></p>
         ${sum('−4 + 5 = 1')}`,
        `<p><strong>Add the second number to y.</strong> Adding −3 means going down 3.</p>
         ${sum('2 + (−3) = −1')}
         ${ans('(1, -1)')}`
      )}
      ${tip('Every corner moves by the same vector, so the shape slides without turning or flipping. Count the squares on the grid to check.')}`,

    // Y8 10B Q5: which vector moves the furthest
    'y8-10b-distance': `
      <p class="hp-tag">Worked example: which vector moves a shape the greatest distance: (1, −2), (−4, 0) or (2, 1)?</p>
      ${G(-5, 3, -3, 2, [
        { seg: [0, 0, 1, -2], arrow: 'end' }, { seg: [0, 0, -4, 0], arrow: 'end' }, { seg: [0, 0, 2, 1], arrow: 'end' },
        lab('(1, −2)', 1.3, -2.3, 'start'), lab('(−4, 0)', -4, 0.5), lab('(2, 1)', 2.3, 1.2, 'start')
      ], { axes: true, unit: 26, alt: 'Three vectors drawn from the origin on a grid' })}
      ${steps(
        `<p><strong>Draw each vector from the same point.</strong> You do not need to work out any distances, just compare.</p>`,
        `<p><strong>A move along one axis is just its length.</strong> (−4, 0) goes 4 to the left, so it moves 4.</p>`,
        `<p><strong>A sloping move is a short cut.</strong> Going straight from start to end is shorter than going across and then up or down. (1, −2) is shorter than 1 + 2 = 3, and (2, 1) is shorter than 2 + 1 = 3. Both are less than 4.</p>
         ${ans('(-4, 0)')}`
      )}
      <p><strong>The other way round?</strong> A sloping move is always longer than either of its parts on its own. So (6, −2) goes further than 6, and beats (0, 5).</p>
      ${tip('Ignore the signs: they only give the direction. A move along an axis is its number; a sloping move is between its bigger part and its two parts added.')}`,

    // Y8 10B Q6, Q7, Q8, Q9: combining vectors and reverse vectors
    'y8-10b-combine': `
      <p class="hp-tag">Worked example: a point starts at the origin and moves by (5, −2), then (−3, 6), then (1, 1). Find the single vector for the whole trip, and the vector that brings it home.</p>
      ${G(-1, 6, -3, 6, [
        { seg: [0, 0, 5, -2], arrow: 'end' }, { seg: [5, -2, 2, 4], arrow: 'end' }, { seg: [2, 4, 3, 5], arrow: 'end' },
        { seg: [3, 5, 0, 0], arrow: 'end', dash: true }
      ], { axes: true, unit: 22, alt: 'Three moves joined end to end, and a dashed arrow back to the start' })}
      ${steps(
        `<p><strong>Add all the across parts, then all the up parts.</strong></p>
         ${sum('across: 5 + (−3) + 1 = 3<br>up: −2 + 6 + 1 = 5')}
         ${ans('(3, 5)')}`,
        `<p><strong>To get back (the dashed arrow), reverse it.</strong> A reverse vector goes the same distance the opposite way, so change both signs.</p>
         ${ans('(-3, -5)')}`,
        `<p><strong>Letters work the same way.</strong> Collect like terms in each part.</p>
         ${sum('(2a, b) + (−a, 3b) = (2a − a, b + 3b) = (a, 4b)<br>reverse of (a, −b) is (−a, b)')}`
      )}
      ${tip('The last vector of a round trip is the reverse of all the others added together. Type letter answers like (a, 4b) or (-a, b).')}`,

    // Y8 10B Q10: overlap of a rectangle and its image
    'y8-10b-overlap': `
      <p class="hp-tag">Worked example: a rectangle 8 units wide and 5 units high is translated by (3, 2). What area do the rectangle and its image share?</p>
      ${G(0, 11, 0, 7, [
        { poly: [[3, 2], [8, 2], [8, 5], [3, 5]], fill: true },
        { poly: [[0, 0], [8, 0], [8, 5], [0, 5]] },
        { poly: [[3, 2], [11, 2], [11, 7], [3, 7]] },
        { dim: [0, 0, 8, 0], label: '8', off: -0.5 }, { dim: [0, 0, 0, 5], label: '5', off: 0.5 }
      ], { unit: 24, alt: 'Two overlapping rectangles with the shared part shaded' })}
      ${steps(
        `<p><strong>Moving 3 right cuts 3 off the width of the overlap.</strong></p>
         ${sum('8 − 3 = 5')}`,
        `<p><strong>Moving 2 up cuts 2 off the height.</strong></p>
         ${sum('5 − 2 = 3')}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('5 × 3 = 15')}
         ${ans('15 units²')}`
      )}
      <p><strong>No overlap?</strong> If the move across is at least the width (here 8 or more), nothing is shared and the area is 0. So the smallest move to the right that leaves no overlap is (8, 0).</p>
      ${tip('Sketch both rectangles on grid paper first. A negative width or height in the working means there is no overlap at all.')}`,

    // Y8 10B Q11: how far can it run? (Pythagoras and counting holes)
    'y8-10b-possum': `
      <p class="hp-tag">Worked example: an animal can run at most 2 m in one second. There is a hole at every point with whole-number coordinates. How many holes can it reach from (0, 0)?</p>
      ${G(-3, 3, -3, 3, [
        { circle: [0, 0, 2] },
        ...[[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2]].map(p => ({ point: p }))
      ], { axes: true, unit: 30, alt: 'A circle of radius 2 with the 12 reachable grid points marked' })}
      ${steps(
        `<p><strong>The distance to a hole at (a, b) comes from Pythagoras' theorem.</strong> For the move (3, −5): √(3² + 5²) = √34 ≈ 5.83 m, correct to 2 decimal places.</p>`,
        `<p><strong>A hole is close enough if a² + b² is no more than 2² = 4.</strong> Test the points row by row.</p>
         ${sum('(1, 0), (1, 1): 1 and 2 ✓ &nbsp; (2, 0): 4 ✓ &nbsp; (2, 1): 5 ✗')}`,
        `<p><strong>Count every point inside or on the circle</strong>, except the start.</p>
         ${ans('12')}`
      )}
      ${tip('Work in squares, not square roots: compare a² + b² with the square of the running distance. Count one row at a time so you do not miss any.')}`,

    // =====================================================================
    // 10C Rotation
    // =====================================================================
    // Y8 10C Q1, Q2: order of rotational symmetry
    'y8-10c-order': `
      <p class="hp-tag">Worked example: find the order of rotational symmetry of an equilateral triangle.</p>
      ${D([
        { poly: reg(0, 0, 1.6, 3, 90) },
        { point: [0, 1.6], name: 'top', pos: 'n' }, { point: [0, 0] },
        { arc: [0, 0, 0.7, 90, 210] }, lab('120°', -0.75, 0.75, 'end')
      ], 'An equilateral triangle with a turn of 120 degrees marked', 44)}
      ${steps(
        `<p><strong>Mark one corner</strong> so you can tell the turns apart.</p>`,
        `<p><strong>Turn the shape about its centre and count how many times it looks exactly the same</strong> before you are back to the start. After 120°, 240° and 360° the triangle fits on itself.</p>
         ${ans('3')}`
      )}
      <p><strong>Order 1</strong> means it only looks the same after a full turn, like a kite. That counts as no rotational symmetry.</p>
      ${tip('Trace the shape, put your pencil on the centre and turn the tracing. Count the full turn as one of the fits.')}`,

    // Y8 10C Q3, Q4, Q7: rotating a shape on a grid about a point C
    'y8-10c-grid': `
      <p class="hp-tag">Worked example: rotate the triangle 90° clockwise about C(−1, 1). Where does P(1, 2) end up?</p>
      ${G(-4, 3, -2, 3, [
        { poly: [[-1, 1], [1, 1], [1, 2]], fill: true },
        { poly: [[-1, 1], [-1, -1], [0, -1]] },
        { seg: [-1, 1, 1, 2], dash: true }, { seg: [-1, 1, 0, -1], dash: true },
        { point: [-1, 1], name: 'C', pos: 'nw' }, { point: [1, 2], name: 'P', pos: 'ne' }, { point: [0, -1], name: 'P′', pos: 'se' }
      ], { axes: true, unit: 30, alt: 'A triangle turned a quarter turn clockwise about C' })}
      ${steps(
        `<p><strong>Join C to P.</strong> From C the line goes 2 right and 1 up.</p>`,
        `<p><strong>Turn the line CP a quarter turn clockwise about C.</strong> Trace it (or use compasses so it keeps its length), hold C still and turn the tracing until CP is at right angles to where it started. Read where P lands on the grid.</p>
         ${sum('P lands on (0, −1): the line from C now points 1 right and 2 down')}
         ${ans('(0, -1)')}`,
        `<p><strong>A half turn (180°)</strong> just reverses the arm: 2 left and 1 down from C gives (−3, 0). Clockwise or anticlockwise does not matter for 180°.</p>`
      )}
      ${tip('To find the angle of a turn, follow one arm from C: a quarter turn is 90°, a half turn 180°, three quarters 270°. Turning the page is a good check.')}`,

    // Y8 10C Q5, Q6: rotating about the origin
    'y8-10c-origin': `
      <p class="hp-tag">Worked example: rotate P(−3, 4) about the origin by 180°, by 90° clockwise and by 90° anticlockwise.</p>
      ${G(-5, 5, -5, 5, [
        { seg: [0, 0, -3, 4] }, { seg: [-3, 4, 3, -4], dash: true }, { seg: [0, 0, 4, 3], dash: true }, { seg: [0, 0, -4, -3], dash: true },
        { point: [-3, 4], name: 'P', pos: 'nw' }, { point: [3, -4], name: '180°', pos: 'se' }, { point: [4, 3], name: '90° cw', pos: 'ne' }, { point: [-4, -3], name: '90° acw', pos: 'sw' }
      ], { axes: true, unit: 21, alt: 'P and its three images after rotating about the origin' })}
      ${steps(
        `<p><strong>Join O to P.</strong> From O(0, 0) to P(−3, 4) the line goes 3 left and 4 up.</p>`,
        `<p><strong>180°: draw a dashed line from P through O</strong> and go the same distance out the other side. The arm reverses: 3 right and 4 down.</p>
         ${sum('O → 3 right, 4 down → (3, −4)')}`,
        `<p><strong>90°: turn the line OP a quarter turn about O.</strong> Trace OP (or use compasses so it keeps its length), hold O still and turn the tracing a quarter turn clockwise, so OP ends up at right angles to where it started. Read where P lands on the grid. Then do the same, turning anticlockwise.</p>
         ${sum('clockwise: P lands on (4, 3), the arm now points 4 right and 3 up<br>anticlockwise: P lands on (−4, −3), the arm now points 4 left and 3 down')}
         ${ans('(3, -4), (4, 3), (-4, -3)')}`
      )}
      ${tip('270° one way is the same as 90° the other way, and 360° puts the point back where it started. Check each answer on the grid: it should be the same distance from O. Turning the page is a good check.')}`,

    // Y8 10C Q8, Q9: rotational symmetry of letters and shapes
    'y8-10c-letters': `
      <p class="hp-tag">Worked example: which of the capital letters A, D, I, O, U have rotational symmetry of order 2 or more?</p>
      ${steps(
        `<p><strong>Turn each letter upside down (a half turn).</strong> If it looks exactly the same, it has order 2 or more.</p>
         ${chips(['A: upside down, no', 'take'], ['D: no', 'take'], ['I: yes', 'add'], ['O: yes', 'add'], ['U: no', 'take'])}`,
        `<p><strong>List the ones that work.</strong></p>
         ${ans('I, O')}`
      )}
      <p><strong>Matching shapes to properties:</strong> count the turns and the fold lines separately.</p>
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Shape</span><span role="columnheader">Lines of symmetry</span><span role="columnheader">Order</span></div>
        <div class="hp-tr" role="row"><span role="cell">Rectangle</span><span role="cell">2</span><span role="cell">2</span></div>
        <div class="hp-tr" role="row"><span role="cell">Equilateral triangle</span><span role="cell">3</span><span role="cell">3</span></div>
        <div class="hp-tr" role="row"><span role="cell">Kite</span><span role="cell">1</span><span role="cell">1</span></div>
      </div>
      ${tip('A shape can turn onto itself without having any fold lines, like a propeller with curved blades. Type a list of letters with commas, like I, O.')}`,

    // Y8 10C Q10: a clockwise turn equal to an anticlockwise turn
    'y8-10c-equal': `
      <p class="hp-tag">Worked example: rotating x degrees clockwise has the same effect as rotating 2x degrees anticlockwise. Find x.</p>
      ${steps(
        `<p><strong>A clockwise turn and an anticlockwise turn end in the same place when they add to a full turn.</strong> For example, 100° clockwise lands where 260° anticlockwise does.</p>
         ${sum('x + 2x = 360')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('3x = 360<br>x = 120')}`,
        `<p><strong>Check.</strong> 120° clockwise and 240° anticlockwise: 120 + 240 = 360 ✓</p>
         ${ans('120')}`
      )}
      ${tip('Draw a circle with an arrow each way to see it. The two turns always share the full 360° between them.')}`,

    // Y8 10C Q11: the isosceles triangle A C A′
    'y8-10c-centre': `
      <p class="hp-tag">Worked example: the angle of rotation is 30°. Find x in the triangle ACA′.</p>
      ${D([
        { seg: [0, 0, 1.035, 3.864], dash: true }, { seg: [0, 0, -1.035, 3.864], dash: true }, { seg: [-1.035, 3.864, 1.035, 3.864], dash: true },
        { point: [0, 0], name: 'C', pos: 's' }, { point: [1.035, 3.864], name: 'A', pos: 'e' }, { point: [-1.035, 3.864], name: 'A′', pos: 'w' },
        ang([0, 0], [1.035, 3.864], [-1.035, 3.864], '30°', 1.3),
        ang([1.035, 3.864], [0, 0], [-1.035, 3.864], 'x°'),
        ang([-1.035, 3.864], [1.035, 3.864], [0, 0], 'x°')
      ], 'An isosceles triangle with 30 degrees at C', 44)}
      ${steps(
        `<p><strong>Why is it isosceles?</strong> A rotation keeps every point the same distance from the centre, so CA = CA′. The two base angles are equal, both x°.</p>`,
        `<p><strong>Angles in a triangle add to 180°.</strong></p>
         ${sum('2x + 30 = 180<br>2x = 150<br>x = 75')}
         ${ans('75')}`
      )}
      ${tip('Take the angle of rotation away from 180, then halve what is left.')}`,

    // =====================================================================
    // 10D Congruent figures
    // =====================================================================
    // Y8 10D Q1, Q2, Q6: matching vertices, sides and angles
    'y8-10d-match': `
      <p class="hp-tag">Worked example: triangles KLM and XYZ are congruent. Match their vertices and write the congruence statement.</p>
      ${D([
        ...shape([[0, 0], [5, 0], [-0.8, 3.919]], ['K', 'L', 'M'], ['5 cm', '7 cm', '4 cm']),
        ...shape([[11, 3.919], [6, 3.919], [11.8, 0]], ['Z', 'X', 'Y'], ['5 cm', '7 cm', '4 cm'])
      ], 'Two congruent triangles, one turned upside down', 30)}
      ${steps(
        `<p><strong>Use the side lengths.</strong> K sits between the 5 cm and 4 cm sides. In the other triangle, the vertex between 5 cm and 4 cm is Z. So K matches Z.</p>`,
        `<p><strong>Do the same for the rest.</strong> L is between 5 cm and 7 cm, like X. M is between 7 cm and 4 cm, like Y.</p>
         ${sum('K ↔ Z, &nbsp; L ↔ X, &nbsp; M ↔ Y')}`,
        `<p><strong>Write the vertices in matching order.</strong> Side KM matches ZY, and ∠L matches ∠X.</p>
         ${ans('△KLM ≡ △ZXY')}`
      )}
      ${tip('Type a vertex as one letter (X), a side as two letters in matching order (ZY), and an angle as its vertex letter (X). For the statement, type just the letters, like ZXY.')}`,

    // Y8 10D Q3, Q4: which shape looks congruent
    'y8-10d-looks': `
      <p class="hp-tag">Worked example: which shape, P, Q or R, is congruent to shape A?</p>
      ${G(0, 20, 0, 5, [
        { poly: [[1, 1], [4, 1], [1, 3]], fill: true }, lab('A', 2.5, -0.6),
        { poly: [[6, 1], [8, 1], [8, 4]] }, lab('P', 7, -0.6),
        { poly: [[10, 1], [13, 1], [10, 4]] }, lab('Q', 11.5, -0.6),
        { poly: [[14, 0], [20, 0], [14, 4]] }, lab('R', 17, -0.6)
      ], { unit: 22, alt: 'Shape A and three other right-angled triangles' })}
      ${steps(
        `<p><strong>Congruent means the same shape and the same size.</strong> It may be turned or flipped. A has a right angle with sides of 3 squares and 2 squares.</p>`,
        `<p><strong>Check each one.</strong> P has sides of 2 and 3 squares, just turned: congruent. Q has 3 and 3: a different shape. R has 6 and 4: the same shape but twice as big, so not congruent.</p>
         ${ans('P')}`
      )}
      ${tip('Compare lengths you can count or measure, not just how the shape looks. Type the single letter, like P.')}`,

    // Y8 10D Q5: counting congruent triangles in a diagram
    'y8-10d-count': `
      <p class="hp-tag">Worked example: a square with side 2 units has both diagonals drawn. How many congruent triangles are there of each area?</p>
      ${D([
        { poly: [[0, 0], [2, 0], [2, 2], [0, 2]] }, { seg: [0, 0, 2, 2] }, { seg: [2, 0, 0, 2] },
        { dim: [0, 0, 2, 0], label: '2', off: -0.5 }, { dim: [2, 0, 2, 2], label: '2', off: -0.5 }
      ], 'A square with both diagonals drawn', 60)}
      ${steps(
        `<p><strong>Start with the smallest pieces.</strong> The diagonals cut the square into 4 small triangles, each a quarter of the square.</p>
         ${sum('2 × 2 ÷ 4 = 1 unit²: 4 triangles')}`,
        `<p><strong>Join pieces to make bigger triangles.</strong> Two small triangles next to each other make half the square. Each diagonal gives 2 halves.</p>
         ${sum('2 × 2 ÷ 2 = 2 units²: 4 triangles')}
         ${ans('area 1: 4, area 2: 4')}`
      )}
      ${tip('Count one size at a time and be systematic. Bigger triangles can be made of several small pieces, so look for them too.')}`,

    // Y8 10D Q7, Q8, Q9: is a shape cut into two congruent triangles?
    'y8-10d-cut': `
      <p class="hp-tag">Worked example: an isosceles trapezium PQRS (PS = QR) is cut along the diagonal PR. Are the two triangles congruent?</p>
      ${D([
        { poly: [[0, 0], [6, 0], [4.5, 2.5], [1.5, 2.5]] }, { seg: [0, 0, 4.5, 2.5], dash: true },
        { point: [0, 0], name: 'P', pos: 'sw' }, { point: [6, 0], name: 'Q', pos: 'se' }, { point: [4.5, 2.5], name: 'R', pos: 'ne' }, { point: [1.5, 2.5], name: 'S', pos: 'nw' },
        { tick: [0, 0, 1.5, 2.5], n: 1 }, { tick: [6, 0, 4.5, 2.5], n: 1 }
      ], 'An isosceles trapezium cut along a diagonal', 40)}
      ${steps(
        `<p><strong>Name the two triangles.</strong> The cut runs from P to R, so the triangles are △PQR and △PRS.</p>`,
        `<p><strong>Pair up their sides.</strong></p>
         ${sum('PR = PR (shared)<br>QR = PS (marked equal)<br>PQ and SR: PQ is longer')}`,
        `<p><strong>Decide.</strong> One pair of sides is not equal, so the triangles are not the same size and shape: they are not congruent. If all three pairs had matched, one triangle would fit exactly on the other, so they would be congruent.</p>
         ${ans('No')}`
      )}
      ${tip('The cut line belongs to both triangles, so it is always one equal pair. Then check the other two pairs.')}`,

    // Y8 10D Q10: a transformation followed by a translation
    'y8-10d-combined': `
      <p class="hp-tag">Worked example: the shaded triangle is reflected in the x-axis, then translated to the unshaded triangle. Find the translation vector.</p>
      ${G(-5, 4, -3, 3, [
        { poly: [[1, 1], [3, 1], [1, 2]], fill: true },
        { seg: [1, -1, 3, -1], dash: true }, { seg: [3, -1, 1, -2], dash: true }, { seg: [1, -2, 1, -1], dash: true },
        { poly: [[-4, 2], [-2, 2], [-4, 1]] },
        { point: [1, 1], name: 'A', pos: 'nw' }, { point: [1, -1], name: 'A₁', pos: 'sw' }, { point: [-4, 2], name: 'A′', pos: 'nw' }
      ], { axes: true, unit: 26, alt: 'A triangle, its reflection shown dashed, and the final image' })}
      ${steps(
        `<p><strong>Do the first transformation to one corner.</strong> Reflecting A(1, 1) in the x-axis gives A₁(1, −1).</p>`,
        `<p><strong>Find the vector from A₁ to the final corner A′(−4, 2).</strong></p>
         ${sum('across: −4 − 1 = −5<br>up: 2 − (−1) = 3')}
         ${ans('(-5, 3)')}`
      )}
      ${tip('Make sure you pick the matching corner of the final shape: after a reflection the shape is flipped. Check one more corner with your vector.')}`,

    // =====================================================================
    // 10E Congruent triangles
    // =====================================================================
    // Y8 10E Q1, Q2, Q3: choosing SSS, SAS, AAS or RHS
    'y8-10e-tests': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Test</span><span role="columnheader">You need</span><span role="columnheader">Look for</span></div>
        <div class="hp-tr" role="row"><span role="cell">SSS</span><span role="cell">3 pairs of equal sides</span><span role="cell">3 sides</span></div>
        <div class="hp-tr" role="row"><span role="cell">SAS</span><span role="cell">2 sides and the angle between them</span><span role="cell">angle in the middle</span></div>
        <div class="hp-tr" role="row"><span role="cell">AAS</span><span role="cell">2 angles and a matching side</span><span role="cell">2 angles</span></div>
        <div class="hp-tr" role="row"><span role="cell">RHS</span><span role="cell">right angle, hypotenuse, 1 other side</span><span role="cell">90°</span></div>
      </div>
      <p class="hp-tag">Worked example: which test fits each triangle? (a) △DEF with DE = 8 cm, ∠D = 60°, DF = 5 cm (b) △PQR with ∠P = 90°, PQ = 9 cm, QR = 15 cm (c) △STU with ∠S = 45°, ∠T = 85°, TU = 9 cm</p>
      ${D([
        ...shape([[0, 0], [3.2, 0], [1, 1.732]], ['D', 'E', 'F'], ['8 cm', null, '5 cm']),
        ang([0, 0], [3.2, 0], [1, 1.732], '60°')
      ], 'Triangle DEF with the 60 degree angle between the two sides', 50)}
      ${steps(
        `<p><strong>(a) Two sides and an angle.</strong> Is the angle between them? Both DE and DF contain the letter D, so they meet at ∠D. Yes.</p>
         ${ans('SAS')}`,
        `<p><strong>(b) A right angle.</strong> QR is opposite the right angle at P (it has no P in it), so it is the hypotenuse.</p>
         ${ans('RHS')}`,
        `<p><strong>(c) Two angles and a side.</strong></p>
         ${ans('AAS')}`
      )}
      ${tip('Count what you are given first: three sides is SSS, two angles is AAS, a 90° with the longest side is RHS. Two sides and an angle is SAS only if the angle is between them.')}`,

    // Y8 10E Q10: spotting hidden equal parts in a proof diagram
    'y8-10e-proof': `
      <p class="hp-tag">Worked example: PR and QS cross at X. PX = RX and QX = SX. Which test shows △PXQ ≡ △RXS?</p>
      ${D([
        { seg: [0, 2.4, 4, 0] }, { seg: [0, 0, 4, 2.4] }, { seg: [0, 2.4, 0, 0] }, { seg: [4, 0, 4, 2.4] },
        { tick: [0, 2.4, 2, 1.2], n: 1 }, { tick: [2, 1.2, 4, 0], n: 1 }, { tick: [0, 0, 2, 1.2], n: 2 }, { tick: [2, 1.2, 4, 2.4], n: 2 },
        ang([2, 1.2], [0, 2.4], [0, 0]), ang([2, 1.2], [4, 0], [4, 2.4]),
        { point: [0, 2.4], name: 'P', pos: 'nw' }, { point: [0, 0], name: 'Q', pos: 'sw' }, { point: [4, 0], name: 'R', pos: 'se' }, { point: [4, 2.4], name: 'S', pos: 'ne' }, { point: [2, 1.2], name: 'X', pos: 'n' }
      ], 'Two triangles meeting at X, with two pairs of equal sides', 44)}
      ${steps(
        `<p><strong>Write down what is marked.</strong> PX = RX (one dash) and QX = SX (two dashes). That is two pairs of sides.</p>`,
        `<p><strong>Look for a fact that is not marked.</strong> Where two straight lines cross, the vertically opposite angles are equal: ∠PXQ = ∠RXS. It sits between the two pairs of sides.</p>
         ${ans('SAS')}`
      )}
      ${chips(['A shared side is a free pair of equal sides', 'add'], ['Crossing lines: vertically opposite angles', 'add'], ['Parallel arrows: alternate angles', 'add'])}
      ${tip('Before choosing a test, list every equal pair: the marked ones, plus shared sides, vertically opposite angles and alternate angles.')}`,

    // Y8 10E Q4: finding unknowns in congruent triangles
    'y8-10e-find': `
      <p class="hp-tag">Worked example: the two triangles are congruent. Find x and a.</p>
      ${D([
        { poly: [[0, 0], [3.5, 0], [1.113, 2.387]] }, lab('7 cm', 1.75, -0.45),
        ang([0, 0], [3.5, 0], [1.113, 2.387], '65°'), ang([3.5, 0], [1.113, 2.387], [0, 0], '45°'),
        { poly: [[8, 0], [4.5, 0], [6.887, 2.387]] }, lab('x cm', 6.25, -0.45),
        ang([8, 0], [6.887, 2.387], [4.5, 0], '65°'), ang([4.5, 0], [8, 0], [6.887, 2.387], '45°'), ang([6.887, 2.387], [4.5, 0], [8, 0], 'a°')
      ], 'Two congruent triangles, one flipped', 50)}
      ${steps(
        `<p><strong>Match the parts using the angles.</strong> In both triangles the bottom side runs between the 65° and the 45° angles. So x cm matches 7 cm.</p>
         ${ans('x = 7')}`,
        `<p><strong>a is the third angle.</strong> It matches the unmarked angle of the first triangle. Angles in a triangle add to 180°.</p>
         ${sum('180 − 65 − 45 = 70')}
         ${ans('a = 70')}`
      )}
      ${tip('Matching parts of congruent triangles are equal. Type just the number, like 7, not 7 cm.')}`,

    // Y8 10E Q5, Q7, Q9: deciding whether two triangles are congruent
    'y8-10e-decide': `
      <p class="hp-tag">Worked example: are these two triangles congruent?</p>
      ${D([
        { poly: [[0, 0], [3.5, 0], [3.115, 2.181]] }, lab('7 cm', 1.75, -0.45),
        ang([0, 0], [3.5, 0], [3.115, 2.181], '35°'), ang([3.5, 0], [3.115, 2.181], [0, 0], '80°'),
        { poly: [[5, 0], [8.5, 0], [7.638, 1.847]] }, lab('7 cm', 6.75, -0.45),
        ang([5, 0], [8.5, 0], [7.638, 1.847], '35°'), ang([8.5, 0], [7.638, 1.847], [5, 0], '65°')
      ], 'Two triangles, each with a 7 cm side and two angles marked', 50)}
      ${steps(
        `<p><strong>Find the missing angles first.</strong></p>
         ${sum('First: 180 − 35 − 80 = 65<br>Second: 180 − 35 − 65 = 80')}
         <p>Both triangles have angles 35°, 65° and 80°.</p>`,
        `<p><strong>Check the side is in the same place.</strong> In the first, the 7 cm side runs between 35° and 80°. In the second, it runs between 35° and 65°. They do not match, so AAS does not apply.</p>
         ${ans('Not congruent')}`
      )}
      ${tip('Only SSS, SAS, AAS and RHS prove congruence. To test other information, try to draw two different triangles that both fit it. If you can, it is not enough.')}`,

    // Y8 10E Q6: what extra fact makes the triangles congruent?
    'y8-10e-missing': `
      <p class="hp-tag">Worked example: in triangles ABC and DEF, AB = DE = 8 cm and ∠B = ∠E = 50°. Which extra fact proves they are congruent: BC = EF, or AC = DF?</p>
      ${D([
        ...shape([[4, 0], [0, 0], [1.928, 2.298]], ['A', 'B', 'C'], ['8 cm']), ang([0, 0], [4, 0], [1.928, 2.298], '50°'),
        ...shape([[10, 0], [6, 0], [7.928, 2.298]], ['D', 'E', 'F'], ['8 cm']), ang([6, 0], [10, 0], [7.928, 2.298], '50°')
      ], 'Two triangles each with an 8 cm side and a 50 degree angle', 40)}
      ${steps(
        `<p><strong>List what you have.</strong> One pair of sides (AB and DE) and one pair of angles (at B and E).</p>`,
        `<p><strong>Try each option against the tests.</strong> BC = EF gives two sides with the 50° angle between them: SAS ✓. AC = DF gives two sides, but the angle is not between them: that is not a test ✗.</p>
         ${ans('BC = EF')}`
      )}
      ${tip('Choose the fact that completes SSS, SAS, AAS or RHS. With right-angled triangles, a matching hypotenuse and one other side (RHS) is often the quickest.')}`,

    // Y8 10E Q8: Pythagoras, then congruence
    'y8-10e-pythag': `
      <p class="hp-tag">Worked example: one right-angled block has sides 7 km and 24 km around the right angle. Another has a 7 km side and a 25 km hypotenuse. Are they congruent?</p>
      ${D([
        ...shape([[0, 0], [1.05, 0], [0, 3.6]], null, ['7 km', '25 km', '24 km']), rt([0, 0], [1.05, 0], [0, 3.6]),
        ...shape([[4.05, 0], [3, 0], [4.05, 3.6]], null, ['7 km', '25 km', '? km']), rt([4.05, 0], [3, 0], [4.05, 3.6])
      ], 'Two right-angled triangles, one with a missing side', 50)}
      ${steps(
        `<p><strong>Find the missing side with Pythagoras' theorem.</strong> The hypotenuse is the longest side, so take the squares away.</p>
         ${sum('25² − 7² = 625 − 49 = 576<br>√576 = 24')}`,
        `<p><strong>Compare all three sides.</strong> Both blocks are 7 km, 24 km and 25 km, so they are congruent (SSS, or RHS).</p>
         ${ans('24 km, Yes')}`
      )}
      ${tip('Finding a shorter side: square, take away, square root. Finding the hypotenuse: square, add, square root.')}`,

    // =====================================================================
    // 10F Tessellations
    // =====================================================================
    // Y8 10F Q1, Q2, Q3, Q11: do the angles at a vertex make 360°?
    'y8-10f-vertex': `
      <p class="hp-tag">Worked example: a parallelogram has two angles of 65°. Does it tessellate? Does a regular octagon (angles 135°)?</p>
      ${D([
        { poly: [[0, 0], [2, 0], [2.634, 1.359], [0.634, 1.359]], fill: true },
        { poly: [[-2, 0], [0, 0], [0.634, 1.359], [-1.366, 1.359]] },
        { poly: [[-0.634, -1.359], [1.366, -1.359], [2, 0], [0, 0]] },
        { poly: [[-2.634, -1.359], [-0.634, -1.359], [0, 0], [-2, 0]], fill: true },
        { angle: [0, 0, 0, 65], label: '65°', r: 0.55 }, { angle: [0, 0, 65, 180], label: '115°', r: 0.45 },
        { angle: [0, 0, 180, 245], label: '65°', r: 0.55 }, { angle: [0, 0, 245, 360], label: '115°', r: 0.45 }
      ], 'Four parallelograms fitted round one point', 50)}
      ${steps(
        `<p><strong>Find the other angles.</strong> Next to each other in a parallelogram, angles add to 180°.</p>
         ${sum('180 − 65 = 115')}`,
        `<p><strong>Add the angles that meet at one point of the tiling.</strong></p>
         ${sum('65 + 115 + 65 + 115 = 360 ✓')}
         <p>Exactly 360°, so no gaps and no overlaps: it tessellates.</p>`,
        `<p><strong>Regular octagon.</strong> How many 135° angles make 360°?</p>
         ${sum('360 ÷ 135 = 2.67 (not a whole number)')}
         ${ans('Parallelogram: yes. Octagon: no')}`
      )}
      ${tip('Copies of one regular polygon fit round a point only if 360 ÷ (its angle) is a whole number, and that number is how many meet there.')}`,

    // Y8 10F Q4, Q6: naming a tessellation by its vertex
    'y8-10f-name': `
      <p class="hp-tag">Worked example: name this tessellation of triangles and squares.</p>
      ${D([
        { poly: [[-1, -1], [0, -1], [0, 0], [-1, 0]], fill: true }, { poly: [[0, -1], [1, -1], [1, 0], [0, 0]], fill: true },
        { poly: [[0, 0], [1, 0], [0.5, 0.866]] }, { poly: [[0, 0], [0.5, 0.866], [-0.5, 0.866]] }, { poly: [[0, 0], [-0.5, 0.866], [-1, 0]] },
        lab('3', 0.5, 0.25), lab('3', 0, 0.5), lab('3', -0.5, 0.25), lab('4', -0.5, -0.55), lab('4', 0.5, -0.55),
        { point: [0, 0] }
      ], 'Three triangles and two squares meeting at one vertex', 70)}
      ${steps(
        `<p><strong>Pick one vertex</strong> and go round it, writing the number of sides of each polygon that touches it.</p>
         ${sum('triangle, triangle, triangle, square, square')}`,
        `<p><strong>Start with the smallest number and go the way that keeps the list smallest.</strong> Put dots between.</p>
         ${ans('3.3.3.4.4')}`,
        `<p><strong>Check the angles add to 360°.</strong></p>
         ${sum('60 + 60 + 60 + 90 + 90 = 360 ✓')}`
      )}
      ${tip('Type the numbers with dots between, like 3.3.3.4.4. A regular tessellation uses one shape, so its name repeats one number.')}`,

    // Y8 10F Q5, Q7, Q10: how many tiles cover a rectangle?
    'y8-10f-tiles': `
      <p class="hp-tag">Worked example: how many tiles, 25 cm by 50 cm, cover a floor 4 m by 3 m?</p>
      ${steps(
        `<p><strong>Use the same units.</strong> 4 m = 400 cm and 3 m = 300 cm.</p>`,
        `<p><strong>Count how many fit along each side.</strong></p>
         ${sum('400 ÷ 25 = 16 &nbsp; and &nbsp; 300 ÷ 50 = 6')}`,
        `<p><strong>Multiply.</strong></p>
         ${sum('16 × 6 = 96')}
         ${ans('96')}`
      )}
      <p><strong>Tiles made of unit squares:</strong> divide the area of the rectangle by the area of one tile. A 6 by 4 rectangle covered by 3-square tiles needs 24 ÷ 3 = 8.</p>
      ${G(0, 6, 0, 4, [0, 3].flatMap(ox => [0, 2].flatMap(oy => [
        { poly: [[ox, oy], [ox + 2, oy], [ox + 2, oy + 1], [ox + 1, oy + 1], [ox + 1, oy + 2], [ox, oy + 2]], fill: true },
        { poly: [[ox + 2, oy], [ox + 3, oy], [ox + 3, oy + 2], [ox + 1, oy + 2], [ox + 1, oy + 1], [ox + 2, oy + 1]] }
      ])), { unit: 30, alt: 'A 6 by 4 rectangle covered by eight L-shaped tiles' })}
      <p><strong>Two kinds of tile?</strong> Take away the squares the first kind covers, then divide what is left. A 5 by 3 rectangle with three 3-square tiles: 15 − 9 = 6 squares left, so 6 ÷ 2 = 3 tiles of 2 squares.</p>
      ${tip('Always change to the same units first. 1 m = 100 cm.')}`,

    // Y8 10F Q8, Q12, Q15: interior angles and filling the gap
    'y8-10f-gap': `
      <p class="hp-tag">Worked example: find the interior angle of a regular decagon (10 sides). Can decagons tessellate on their own, or with one other regular polygon?</p>
      ${steps(
        `<p><strong>Angle sum, then share it out.</strong> A polygon with n sides has angles adding to (n − 2) × 180°.</p>
         ${sum('(10 − 2) × 180 = 1440<br>1440 ÷ 10 = 144')}`,
        `<p><strong>Try to fill 360° at a point.</strong></p>
         ${sum('two: 2 × 144 = 288, gap of 360 − 288 = 72<br>three: 3 × 144 = 432, more than 360 (overlap)')}`,
        `<p><strong>Can a regular polygon fill the gap?</strong> The smallest regular angles are 60° (triangle) and 90° (square), and polygons with more sides have bigger angles. None is 72°.</p>
         ${ans('144°. No, and no')}`
      )}
      <p><strong>One missing angle?</strong> A hexagon has angles adding to 4 × 180 = 720°. If five of them are 95°, 135°, 145°, 115° and 125°, they add to 615°, so the sixth is 720 − 615 = 105°.</p>
      ${tip('For n sides: angle sum (n − 2) × 180. For a regular polygon, divide that by n to get each angle.')}`,

    // =====================================================================
    // 10G Congruence and quadrilaterals
    // =====================================================================
    // Y8 10G Q1, Q2, Q4, Q9: step-by-step congruence proofs
    'y8-10g-proof': `
      <p class="hp-tag">Worked example: AB ∥ CD, and AD and BC cross at M, the midpoint of AD. Prove that BM = CM.</p>
      ${D([
        { seg: [0, 3, 4.5, 3] }, { seg: [1.5, 0, 6, 0] }, { seg: [0, 3, 6, 0] }, { seg: [4.5, 3, 1.5, 0] },
        { par: [0, 3, 4.5, 3], n: 1 }, { par: [1.5, 0, 6, 0], n: 1 },
        { tick: [0, 3, 3, 1.5], n: 1 }, { tick: [3, 1.5, 6, 0], n: 1 },
        ang([0, 3], [4.5, 3], [3, 1.5]), ang([6, 0], [1.5, 0], [3, 1.5]),
        { point: [0, 3], name: 'A', pos: 'nw' }, { point: [4.5, 3], name: 'B', pos: 'ne' }, { point: [1.5, 0], name: 'C', pos: 'sw' }, { point: [6, 0], name: 'D', pos: 'se' }, { point: [3, 1.5], name: 'M', pos: 'n' }
      ], 'Two triangles between parallel lines, meeting at M', 44)}
      ${steps(
        `<p><strong>Find two pairs of equal angles.</strong></p>
         ${sum('∠BAM = ∠CDM (alternate angles, AB ∥ CD)<br>∠AMB = ∠DMC (vertically opposite)')}`,
        `<p><strong>Find a matching side and choose the test.</strong> AM = DM, because M is the midpoint. Two angles and a matching side:</p>
         ${sum('△ABM ≡ △DCM (AAS)')}`,
        `<p><strong>Conclude.</strong> Matching sides of congruent triangles are equal.</p>
         ${ans('BM = CM')}`
      )}
      ${tip('Type a side as two letters, like CM, and an angle as three letters with the vertex in the middle, like DCM. Write the triangles with matching vertices in the same order.')}`,

    // Y8 10G Q3, Q12: which test, in a quadrilateral diagram
    'y8-10g-tests': `
      <p class="hp-tag">Worked example: in △ABC, AB = AC. The line AD meets BC at a right angle. Which test shows △ABD ≡ △ACD?</p>
      ${D([
        { poly: [[0, 0], [4, 0], [2, 3.4]] }, { seg: [2, 3.4, 2, 0] },
        { tick: [0, 0, 2, 3.4], n: 1 }, { tick: [4, 0, 2, 3.4], n: 1 },
        rt([2, 0], [4, 0], [2, 3.4]), rt([2, 0], [2, 3.4], [0, 0]),
        { point: [2, 3.4], name: 'A', pos: 'n' }, { point: [0, 0], name: 'B', pos: 'sw' }, { point: [4, 0], name: 'C', pos: 'se' }, { point: [2, 0], name: 'D', pos: 's' }
      ], 'An isosceles triangle split by a line at right angles to its base', 44)}
      ${steps(
        `<p><strong>List the equal parts.</strong> Both triangles have a right angle at D. AB = AC, and each is opposite the right angle, so they are the hypotenuses. AD is shared.</p>`,
        `<p><strong>Right angle, hypotenuse, side.</strong></p>
         ${ans('RHS')}`
      )}
      ${chips(['Shared side or diagonal: one equal pair', 'add'], ['Diagonals crossing: vertically opposite angles', 'add'], ['Parallel sides: alternate angles', 'add'], ['Co-interior angles add to 180°', 'add'])}
      ${tip('Read the marks first, then add the hidden facts above. Match what you have to SSS, SAS, AAS or RHS.')}`,

    // Y8 10G Q5, Q6, Q7, Q11: angles that follow from congruent triangles
    'y8-10g-angles': `
      <p class="hp-tag">Worked example: a regular pentagon is split from its centre O into 5 triangles. Find the angles at O and the other angles of each triangle.</p>
      ${D([
        { poly: reg(0, 0, 2, 5, 90) },
        ...reg(0, 0, 2, 5, 90).map(p => ({ seg: [0, 0, p[0], p[1]] })),
        { point: [0, 0], name: 'O', pos: 's' },
        ...reg(0, 0, 2, 5, 90).map((p, i, a) => ({ tick: [0, 0, p[0], p[1]], n: 1 }))
      ], 'A regular pentagon split into five triangles from its centre', 44)}
      ${steps(
        `<p><strong>Prove the triangles are congruent.</strong> Each has two sides from O to a corner (all equal) and one side of the pentagon (all equal). SSS.</p>`,
        `<p><strong>Matching angles of congruent triangles are equal.</strong> The five angles at O are equal and fill a full turn.</p>
         ${sum('360 ÷ 5 = 72')}`,
        `<p><strong>Each triangle is isosceles</strong> (two sides from O), so its two base angles are equal.</p>
         ${sum('(180 − 72) ÷ 2 = 54')}
         ${ans('72°, 54° and 54°')}`
      )}
      ${tip('Equal angles that fill a straight line share 180°. Equal angles round a point share 360°. If a diagonal splits an angle into two equal parts, the whole angle is double one part.')}`,

    // Y8 10G Q8: diagonals by Pythagoras
    'y8-10g-pythag': `
      <p class="hp-tag">Worked example: rectangle ABCD has AB = 12 cm and BC = 9 cm. Find the length of the diagonal AC.</p>
      ${D([
        ...shape([[0, 0], [4.8, 0], [4.8, 3.6], [0, 3.6]], ['A', 'B', 'C', 'D'], ['12 cm', '9 cm']),
        { seg: [0, 0, 4.8, 3.6], dash: true }, rt([4.8, 0], [0, 0], [4.8, 3.6])
      ], 'A rectangle with one diagonal drawn', 44)}
      ${steps(
        `<p><strong>The diagonal is the hypotenuse of △ABC.</strong> The right angle is at B.</p>`,
        `<p><strong>Square, add, square root.</strong></p>
         ${sum('12² + 9² = 144 + 81 = 225<br>√225 = 15')}
         ${ans('15 cm')}`,
        `<p><strong>The other diagonal, BD,</strong> is the hypotenuse of △BAD, which has sides AB and AD. Opposite sides of a rectangle are equal, so AD = BC. Work it out the same way and compare.</p>`
      )}
      ${tip('Name the right-angled triangle you are using, so you know which two sides go into Pythagoras\' theorem.')}`,

    // Y8 10G Q10: equal angles but not congruent
    'y8-10g-trap': `
      <p class="hp-tag">Worked example: AB ∥ DE, and AE and BD cross at C. AB = 3 cm and DE = 5 cm. Which angle in △CDE equals ∠BAC? Are the triangles congruent?</p>
      ${D([
        { seg: [0.2, 4, 3.2, 4] }, { seg: [0, 0, 5, 0] }, { seg: [0.2, 4, 5, 0] }, { seg: [3.2, 4, 0, 0] },
        { par: [0.2, 4, 3.2, 4], n: 1 }, { par: [0, 0, 5, 0], n: 1 },
        ang([0.2, 4], [3.2, 4], [2, 2.5]), ang([5, 0], [0, 0], [2, 2.5]),
        lab('3 cm', 1.7, 4.45), lab('5 cm', 2.5, -0.5),
        { point: [0.2, 4], name: 'A', pos: 'nw' }, { point: [3.2, 4], name: 'B', pos: 'ne' }, { point: [2, 2.5], name: 'C', pos: 'e' }, { point: [0, 0], name: 'D', pos: 'sw' }, { point: [5, 0], name: 'E', pos: 'se' }
      ], 'Two triangles between parallel lines with different sized sides', 40)}
      ${steps(
        `<p><strong>Alternate angles.</strong> ∠BAC and ∠DEC sit on opposite sides of the line AE, between the parallel lines, so they are equal.</p>
         ${ans('DEC')}`,
        `<p><strong>Same angles, but compare the sides.</strong> AB = 3 cm and the matching side DE = 5 cm. Same shape, different size.</p>
         ${ans('Not congruent')}`
      )}
      ${tip('Type an angle with three letters, vertex in the middle, like DEC. Equal angles only show the same shape. Congruent also needs equal sides.')}`,

    // =====================================================================
    // 10H Similar figures
    // =====================================================================
    // Y8 10H Q1, Q2: matching parts, scale factor and unknowns
    'y8-10h-sf': `
      <p class="hp-tag">Worked example: △KLM and △PQR are similar, with vertices in matching order. Find the scale factor, x, y and a.</p>
      ${D([
        ...shape([[0, 0], [4, 0], [5.5, 5.809]], ['K', 'L', 'M'], ['4 cm', '6 cm', 'y cm']),
        ang([5.5, 5.809], [0, 0], [4, 0], '29°', 1.2),
        ...shape([[7, 0], [16, 0], [19.375, 13.07]], ['P', 'Q', 'R'], ['9 cm', 'x cm', '18 cm']),
        ang([19.375, 13.07], [7, 0], [16, 0], 'a°', 2)
      ], 'A small triangle and a larger similar triangle', 22)}
      ${steps(
        `<p><strong>Scale factor = a big side ÷ its matching small side.</strong> PQ matches KL.</p>
         ${sum('9 ÷ 4 = 9/4 = 2.25')}`,
        `<p><strong>Small to big: multiply. Big to small: divide.</strong> QR matches LM, and PR matches KM.</p>
         ${sum('x = 6 × 2.25 = 13.5<br>y = 18 ÷ 2.25 = 8')}`,
        `<p><strong>Angles do not change.</strong> ∠R matches ∠M.</p>
         ${ans('9/4, x = 13.5, y = 8, a = 29')}`
      )}
      ${tip('Type a scale factor as a fraction like 9/4 or a decimal like 2.25. A matching side is two letters in order (QR), and a matching angle is its vertex letter (R).')}`,

    // Y8 10H Q3, Q4: are two shapes similar?
    'y8-10h-grid': `
      <p class="hp-tag">Worked example: is rectangle B similar to A? Is C?</p>
      ${G(0, 14, 0, 8, [
        { poly: [[0, 0], [2, 0], [2, 3], [0, 3]], fill: true }, lab('A', 1, -0.6),
        { poly: [[3, 0], [7, 0], [7, 6], [3, 6]] }, lab('B', 5, -0.6),
        { poly: [[8, 0], [14, 0], [14, 8], [8, 8]] }, lab('C', 11, -0.6)
      ], { unit: 22, alt: 'Three rectangles on a grid' })}
      ${steps(
        `<p><strong>Divide each side of the new shape by the matching side of A.</strong> Short side with short side, long with long.</p>
         ${sum('B: 4 ÷ 2 = 2 and 6 ÷ 3 = 2')}
         <p>Every ratio is the same, so B is similar, with scale factor 2.</p>`,
        `<p><strong>Do the same for C.</strong></p>
         ${sum('C: 6 ÷ 2 = 3 but 8 ÷ 3 = 2.67')}
         <p>The ratios are different, so C is stretched more one way.</p>
         ${ans('B: similar, scale factor 2. C: not similar')}`
      )}
      ${tip('Similar shapes need equal angles and every pair of sides in the same ratio. A square and a rhombus have all sides equal but different angles, so they are not similar.')}`,

    // Y8 10H Q5, Q6: similar shapes in word problems
    'y8-10h-words': `
      <p class="hp-tag">Worked example: two rectangular cards are similar. Matching sides are 25 cm and 40 cm, and the other side of the smaller card is 15 cm. Find the perimeter of the larger card.</p>
      ${D([
        ...shape([[0, 0], [2.5, 0], [2.5, 1.5], [0, 1.5]], null, ['25 cm', null, null, '15 cm']),
        ...shape([[3.5, 0], [7.5, 0], [7.5, 2.4], [3.5, 2.4]], null, ['40 cm', '? cm'])
      ], 'A small rectangle and a larger similar rectangle', 44)}
      ${steps(
        `<p><strong>Scale factor, from the pair you know.</strong></p>
         ${sum('40 ÷ 25 = 8/5 = 1.6')}`,
        `<p><strong>Find the other side of the larger card.</strong></p>
         ${sum('15 × 1.6 = 24')}`,
        `<p><strong>Perimeter: add all four sides.</strong></p>
         ${sum('2 × (40 + 24) = 128')}
         ${ans('128')}`
      )}
      <p><strong>Going from big to small?</strong> Divide by the scale factor. If the scale factor is 7/3 and a large side is 28 cm, the small side is 28 ÷ 7/3 = 28 × 3/7 = 12 cm.</p>
      ${tip('Write the scale factor as big ÷ small. Then big side = small side × scale factor.')}`,

    // Y8 10H Q7, Q8, Q11: scale factors from circles and areas
    'y8-10h-circles': `
      <p class="hp-tag">Worked example: one circle has circumference 6π cm. Another has area 16π cm². Find the scale factor of their diameters, small to large.</p>
      ${steps(
        `<p><strong>Circumference = π × diameter.</strong> So 6π means the diameter is 6 cm.</p>`,
        `<p><strong>Area = π × radius².</strong> 16π means radius² = 16, so the radius is 4 cm and the diameter is 8 cm.</p>`,
        `<p><strong>Large ÷ small.</strong></p>
         ${sum('8 ÷ 6 = 4/3')}
         ${ans('4/3')}`
      )}
      <p><strong>Squares from areas:</strong> areas 49 cm² and 144 cm² have sides √49 = 7 and √144 = 12, so the scale factor is 12/7.</p>
      <p><strong>Areas from a scale factor:</strong> with scale factor 3, each length is 3 times as long, so the area is 3 × 3 = 9 times as big. The area ratio is 1 : 9.</p>
      ${tip('Always compare lengths with lengths. Type fractions like 4/3 and ratios like 1:9.')}`,

    // Y8 10H Q9, Q10: are all shapes of a kind similar?
    'y8-10h-always': `
      <p class="hp-tag">Worked example: true or false? (a) All circles are similar. (b) All isosceles triangles are similar.</p>
      ${D([
        { poly: [[0, 0], [2, 0], [1, 3]] }, { tick: [0, 0, 1, 3], n: 1 }, { tick: [2, 0, 1, 3], n: 1 },
        { poly: [[3, 0], [6.4, 0], [4.7, 1]] }, { tick: [3, 0, 4.7, 1], n: 1 }, { tick: [6.4, 0, 4.7, 1], n: 1 }
      ], 'Two isosceles triangles with very different shapes', 40)}
      ${steps(
        `<p><strong>Ask: can one be stretched into a different shape?</strong> A circle is fixed by one length (its radius). Any circle is an enlargement of any other.</p>
         ${ans('(a) True')}`,
        `<p><strong>Find one pair that is not similar.</strong> A tall, thin isosceles triangle and a short, wide one have different angles. One counterexample is enough.</p>
         ${ans('(b) False')}`
      )}
      ${tip('Ask whether a shape can change its angles or its proportions and still keep its name. If it can, they are not all similar. Shapes fixed by one length, like circles and regular octagons, are.')}`,

    // Y8 10H Q12: squares joined at midpoints
    'y8-10h-squares': `
      <p class="hp-tag">Worked example: a square has sides of 10 cm. A second square joins the midpoints of its sides, and a third square joins the midpoints of the second. Find their side lengths.</p>
      ${D([
        { poly: [[-5, -5], [5, -5], [5, 5], [-5, 5]] }, { poly: [[5, 0], [0, 5], [-5, 0], [0, -5]] }, { poly: [[-2.5, -2.5], [2.5, -2.5], [2.5, 2.5], [-2.5, 2.5]] },
        lab('5', 2.5, -5.6), lab('5', 5.4, -2.5, 'start'), { dim: [-5, -5, 5, -5], label: '10 cm', off: -1.4 }
      ], 'Three squares, each joining the midpoints of the one outside it', 18)}
      ${steps(
        `<p><strong>Each corner of the outside square makes a right-angled triangle.</strong> Its two short sides are half of 10 cm, so 5 cm each.</p>`,
        `<p><strong>Pythagoras' theorem gives the second square's side.</strong></p>
         ${sum('5² + 5² = 50<br>√50 = 7.07 (2 decimal places)')}`,
        `<p><strong>The third square:</strong> its triangles have short sides √50 ÷ 2. Square and add: 50 ÷ 4 + 50 ÷ 4 = 25, and √25 = 5.</p>
         ${ans('7.07 cm, then 5 cm')}`
      )}
      ${tip('Keep the exact value (√50) for the next step and round only at the end. A scale factor is the larger side ÷ the smaller side.')}`,

    // =====================================================================
    // 10I Similar triangles
    // =====================================================================
    // Y8 10I Q1, Q4: the ratio of matching sides
    'y8-10i-ratio': `
      <p class="hp-tag">Worked example: two triangles have sides 3 m, 5 m, 6 m and 4.2 m, 7 m, 8.4 m. Show they are similar and find the scale factor.</p>
      ${D([
        ...shape([[0, 0], [6, 0], [1.667, 2.494]], null, ['6 m', '5 m', '3 m']),
        ...shape([[7.5, 0], [15.9, 0], [9.833, 3.492]], null, ['8.4 m', '7 m', '4.2 m'])
      ], 'Two similar triangles', 30)}
      ${steps(
        `<p><strong>Match shortest with shortest, middle with middle, longest with longest.</strong></p>`,
        `<p><strong>Divide each big side by its small side.</strong></p>
         ${sum('4.2 ÷ 3 = 1.4<br>7 ÷ 5 = 1.4<br>8.4 ÷ 6 = 1.4')}`,
        `<p><strong>All three are equal</strong>, so the triangles are similar (SSS).</p>
         ${ans('1.4 (or 7/5)')}`
      )}
      ${tip('Type three ratios with commas, like 1.4, 1.4, 1.4. The perimeters grow by the same scale factor, so one lap of the big triangle is 1.4 laps of the small one.')}`,

    // Y8 10I Q2, Q5: tests for similar triangles
    'y8-10i-tests': `
      <div class="hp-table" role="table">
        <div class="hp-tr hp-th" role="row"><span role="columnheader">Test</span><span role="columnheader">You need</span><span role="columnheader">Look for</span></div>
        <div class="hp-tr" role="row"><span role="cell">AAA</span><span role="cell">all three angles equal</span><span role="cell">angles only</span></div>
        <div class="hp-tr" role="row"><span role="cell">SSS</span><span role="cell">3 pairs of sides, same ratio</span><span role="cell">3 sides</span></div>
        <div class="hp-tr" role="row"><span role="cell">SAS</span><span role="cell">2 pairs of sides, same ratio, equal angle between</span><span role="cell">angle in the middle</span></div>
        <div class="hp-tr" role="row"><span role="cell">RHS</span><span role="cell">right angle, hypotenuses and one side, same ratio</span><span role="cell">90°</span></div>
      </div>
      <p class="hp-tag">Worked example: are these triangles similar?</p>
      ${D([
        { poly: [[0, 0], [4, 0], [2.515, 2.793]] }, ang([0, 0], [4, 0], [2.515, 2.793], '48°'), ang([4, 0], [2.515, 2.793], [0, 0], '62°'),
        { poly: [[6, 0], [9, 0], [7.781, 3.349]] }, ang([6, 0], [9, 0], [7.781, 3.349], '62°'), ang([9, 0], [7.781, 3.349], [6, 0], '70°')
      ], 'Two triangles with two angles marked on each', 46)}
      ${steps(
        `<p><strong>Find the third angle of each triangle.</strong></p>
         ${sum('First: 180 − 48 − 62 = 70<br>Second: 180 − 62 − 70 = 48')}`,
        `<p><strong>Compare.</strong> Both have 48°, 62° and 70°. All angles match.</p>
         ${ans('Yes, similar (AAA)')}`
      )}
      ${tip('Only angles marked? Use AAA. Only sides? Check the ratios for SSS. A right angle with a hypotenuse? Try RHS.')}`,

    // Y8 10I Q3: finding unknown sides in similar triangles
    'y8-10i-find': `
      <p class="hp-tag">Worked example: the triangles are similar. Find x and y.</p>
      ${D([
        ...shape([[0, 0], [6, 0], [4.333, 2.494]], null, ['x cm', '3 cm', '5 cm']),
        ...shape([[8, 0], [17.6, 0], [14.933, 3.991]], null, ['9.6 cm', 'y cm', '8 cm'])
      ], 'Two similar triangles with one unknown side each', 30)}
      ${steps(
        `<p><strong>Find a pair of matching sides you know both of.</strong> 5 cm matches 8 cm (the left sides).</p>
         ${sum('scale factor = 8 ÷ 5 = 1.6')}`,
        `<p><strong>Small to big: multiply.</strong> y matches 3 cm.</p>
         ${sum('y = 3 × 1.6 = 4.8')}`,
        `<p><strong>Big to small: divide.</strong> x matches 9.6 cm.</p>
         ${sum('x = 9.6 ÷ 1.6 = 6')}
         ${ans('x = 6, y = 4.8')}`
      )}
      ${tip('Check: the unknown in the big triangle should come out bigger than its partner. Type decimals like 4.8.')}`,

    // Y8 10I Q6, Q7: similar triangles in real life
    'y8-10i-world': `
      <p class="hp-tag">Worked example: a person 1.8 m tall casts a shadow 2.4 m long. At the same time a tree casts a shadow 12 m long. How tall is the tree?</p>
      ${D([
        ...shape([[0, 0], [4.2, 0], [0, 3.15]], null, ['12 m', null, '? m']), rt([0, 0], [4.2, 0], [0, 3.15]),
        ...shape([[5.6, 0], [6.44, 0], [5.6, 0.63]], null, ['2.4 m', null, '1.8 m'], { off: 0.3 }), rt([5.6, 0], [6.44, 0], [5.6, 0.63])
      ], 'A tree and a person with their shadows, making two right-angled triangles', 44)}
      ${steps(
        `<p><strong>Show the triangles are similar.</strong> Both have a right angle, and the sun's rays hit the ground at the same angle. Two angles match, so AAA.</p>`,
        `<p><strong>Scale factor from the shadows.</strong></p>
         ${sum('12 ÷ 2.4 = 5')}`,
        `<p><strong>Scale up the height.</strong></p>
         ${sum('1.8 × 5 = 9')}
         ${ans('9 m')}`
      )}
      ${tip('Look for the equal angles: right angles, vertically opposite angles where lines cross, and equal angles where a ball bounces off a wall.')}`,

    // Y8 10I Q8, Q9, Q10: reasons for similarity, and congruent or similar?
    'y8-10i-reason': `
      <p class="hp-tag">Worked example: in △PQR, ST is parallel to QR. Why is △PST similar to △PQR?</p>
      ${D([
        { poly: [[2, 3.5], [0, 0], [5, 0]] }, { seg: [1.2, 2.1, 3.2, 2.1] },
        { par: [1.2, 2.1, 3.2, 2.1], n: 1 }, { par: [0, 0, 5, 0], n: 1 },
        ang([1.2, 2.1], [3.2, 2.1], [2, 3.5]), ang([0, 0], [5, 0], [2, 3.5]),
        { point: [2, 3.5], name: 'P', pos: 'n' }, { point: [0, 0], name: 'Q', pos: 'sw' }, { point: [5, 0], name: 'R', pos: 'se' }, { point: [1.2, 2.1], name: 'S', pos: 'w' }, { point: [3.2, 2.1], name: 'T', pos: 'e' }
      ], 'A triangle with a line across it parallel to its base', 44)}
      ${steps(
        `<p><strong>Angle P is in both triangles</strong> (a common angle).</p>`,
        `<p><strong>Parallel lines give corresponding angles.</strong> ∠PST = ∠PQR. That is two pairs of equal angles.</p>
         ${ans('AAA: common angle P and corresponding angles')}`,
        `<p><strong>Congruent, similar or neither?</strong> Triangle 1 has 35° and 70° with 6 cm between them. Triangle 2 has 35° and 75° with 9 cm between them. Triangle 1's third angle is 180 − 35 − 70 = 75°, so the angles match, but the sides differ: similar, not congruent. Matching angles and an equal matching side would make them congruent.</p>`
      )}
      ${tip('Hidden equal angles: a shared (common) angle, right angles, vertically opposite angles, and alternate or corresponding angles with parallel lines.')}`,

    // Y8 10I Q11: Pythagoras, then similarity
    'y8-10i-pythag': `
      <p class="hp-tag">Worked example: △ABC has a right angle at B, AB = 5 and BC = 12. △DEF has a right angle at E, DE = 10 and DF = 26. Are they similar?</p>
      ${D([
        ...shape([[0, 0], [2.4, 0], [0, 1]], ['B', 'C', 'A'], ['12', null, '5']), rt([0, 0], [2.4, 0], [0, 1]),
        ...shape([[3.6, 0], [8.4, 0], [3.6, 2]], ['E', 'F', 'D'], [null, '26', '10']), rt([3.6, 0], [8.4, 0], [3.6, 2])
      ], 'Two right-angled triangles', 44)}
      ${steps(
        `<p><strong>Find the missing sides with Pythagoras' theorem.</strong></p>
         ${sum('AC = √(5² + 12²) = √169 = 13<br>EF = √(26² − 10²) = √576 = 24')}`,
        `<p><strong>Compare matching sides.</strong></p>
         ${sum('10 ÷ 5 = 2, &nbsp; 24 ÷ 12 = 2, &nbsp; 26 ÷ 13 = 2')}`,
        `<p><strong>Same ratio every time.</strong></p>
         ${ans('Yes, similar (SSS), ratio 2')}`
      )}
      ${tip('Match sides by size: shortest with shortest, hypotenuse with hypotenuse.')}`,

    // Y8 10I Q12: x is only part of a side
    'y8-10i-part': `
      <p class="hp-tag">Worked example: DE is parallel to BC. AD = 4 cm, DB = 2 cm and AE = 6 cm. Find x, the length EC.</p>
      ${D([
        { poly: [[0, 0], [3, 0], [2.893, 3.447]] }, { seg: [2, 0, 1.928, 2.298] },
        { par: [2, 0, 1.928, 2.298], n: 1 }, { par: [3, 0, 2.893, 3.447], n: 1 },
        lab('4 cm', 1, -0.45), lab('2 cm', 2.5, -0.45), lab('6 cm', 0.75, 1.35, 'end'), lab('x cm', 2.2, 2.95, 'end'),
        { point: [0, 0], name: 'A', pos: 'sw' }, { point: [2, 0], name: 'D', pos: 's' }, { point: [3, 0], name: 'B', pos: 'se' }, { point: [1.928, 2.298], name: 'E', pos: 'e' }, { point: [2.893, 3.447], name: 'C', pos: 'ne' }
      ], 'A small triangle inside a larger one, sharing the angle at A', 60)}
      ${steps(
        `<p><strong>Use whole sides.</strong> The small triangle is ADE and the big one is ABC. They share ∠A and have corresponding angles, so they are similar. The whole of AB is 4 + 2 = 6 cm.</p>
         ${sum('scale factor = 6 ÷ 4 = 1.5')}`,
        `<p><strong>Find the whole side AC.</strong></p>
         ${sum('AC = 6 × 1.5 = 9')}`,
        `<p><strong>x is the part of AC beyond E.</strong></p>
         ${sum('x = 9 − 6 = 3')}
         ${ans('3')}`
      )}
      ${tip('Draw the two triangles separately first, with whole side lengths on each. Only then take away to find the part.')}`
  });
})();
