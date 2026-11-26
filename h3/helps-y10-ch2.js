/* H3 help panels for Year 10 Chapter 2. Loaded with bank-y10.js (see YEAR_FILES in h3.js).
 * Panels use the shared helpers in helps.js; panel ids start "y10-". */
/* Help panels for Year 10 2A to 2N. */
(function () {
  const { steps, sum, ans, tip, now, flow, chips, chart, algo, d, bus, area, line, fig } = window.H3HelpKit;

  // ---- drawing helpers for this chapter (every measurement is the panel's own; pictures are not to scale) ----
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const cs = (deg) => Math.cos(deg * Math.PI / 180), sn = (deg) => Math.sin(deg * Math.PI / 180), tn = (deg) => Math.tan(deg * Math.PI / 180);
  const D = (items, alt, unit) => fig(Object.assign({ kind: 'diagram', items, alt }, unit ? { unit } : {}));
  const dir = (P, Q) => Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / Math.PI;
  // An angle mark at V between the rays V to P and V to Q: the smaller angle, or the reflex one when big is true.
  const ang = (V, P, Q, label, r, big) => {
    let a1 = dir(V, P), a2 = dir(V, Q);
    const sw = ((a2 - a1) % 360 + 360) % 360;
    if ((sw > 180) !== !!big) [a1, a2] = [a2, a1];
    const it = { angle: [r3(V[0]), r3(V[1]), r3(a1), r3(a2)] };
    if (label) it.label = label;
    if (r) it.r = r;
    return it;
  };
  const rt = (V, P, Q) => Object.assign(ang(V, P, Q), { right: true, r: 0.3 });
  const S = (P, Q, o) => Object.assign({ seg: [r3(P[0]), r3(P[1]), r3(Q[0]), r3(Q[1])] }, o || {});
  const Pt = (p, name, pos) => ({ point: [r3(p[0]), r3(p[1])], name, pos: pos || 'n' });
  const L = (text, at, anchor) => ({ label: text, at: [r3(at[0]), r3(at[1])], anchor: anchor || 'middle' });
  const poly = (pts, fill) => ({ poly: pts.map(p => [r3(p[0]), r3(p[1])]), fill: fill !== false });
  const tk = (P, Q, n) => ({ tick: [r3(P[0]), r3(P[1]), r3(Q[0]), r3(Q[1])], n: n || 1 });
  const pr = (P, Q, n) => ({ par: [r3(P[0]), r3(P[1]), r3(Q[0]), r3(Q[1])], n: n || 1 });
  const on = (deg, R = 2, c = [0, 0]) => [r3(c[0] + R * cs(deg)), r3(c[1] + R * sn(deg))];
  const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  const add = (P, Q, k = 1) => [P[0] + k * Q[0], P[1] + k * Q[1]];
  // The compass position for a label at p, pushed away from the point c.
  const away = (p, c) => {
    const dx = p[0] - c[0], dy = p[1] - c[1];
    const v = dy > 0.4 * Math.abs(dx) ? 'n' : dy < -0.4 * Math.abs(dx) ? 's' : '';
    const h = dx > 0.4 * Math.abs(dy) ? 'e' : dx < -0.4 * Math.abs(dy) ? 'w' : '';
    return (v + h) || 'n';
  };
  // A side label just off the middle of P to Q, on the side away from the point c.
  const side = (P, Q, text, c, off = 0.28) => {
    const m = mid(P, Q); let nx = P[1] - Q[1], ny = Q[0] - P[0]; const h = Math.hypot(nx, ny); nx /= h; ny /= h;
    if (nx * (m[0] - c[0]) + ny * (m[1] - c[1]) < 0) { nx = -nx; ny = -ny; }
    return L(text, [m[0] + nx * off, m[1] + ny * off - 0.05], nx > 0.3 ? 'start' : nx < -0.3 ? 'end' : 'middle');
  };
  // The apex of a triangle on a base of length len from (0, 0), with base angles a (left) and b (right).
  const apex = (len, a, b) => { const x = len * tn(b) / (tn(a) + tn(b)); return [x, x * tn(a)]; };
  // Where the segments AB and CD cross.
  const cross = (A, B, C, Dd) => {
    const d1 = [B[0] - A[0], B[1] - A[1]], d2 = [Dd[0] - C[0], Dd[1] - C[1]];
    const t = ((C[0] - A[0]) * d2[1] - (C[1] - A[1]) * d2[0]) / (d1[0] * d2[1] - d1[1] * d2[0]);
    return [A[0] + t * d1[0], A[1] + t * d1[1]];
  };
  // The two points where a line from P in direction deg cuts the circle of radius R at the origin (nearer first).
  const hits = (P, deg, R = 2) => {
    const u = [cs(deg), sn(deg)], b = P[0] * u[0] + P[1] * u[1], c = P[0] * P[0] + P[1] * P[1] - R * R, s = Math.sqrt(b * b - c);
    return [add(P, u, -b - s), add(P, u, -b + s)];
  };
  // A network: V = { A: [x, y] }, E = ['AB', ['BC', '7'], ['AD', '', 0.5]] (optional weight and a bend for a curved edge).
  const net = (V, E, alt, unit = 44) => {
    const ks = Object.keys(V), c = [ks.reduce((s, k) => s + V[k][0], 0) / ks.length, ks.reduce((s, k) => s + V[k][1], 0) / ks.length];
    const items = [];
    for (const e of E) {
      const [ab, w, bend] = Array.isArray(e) ? e : [e];
      const p = V[ab[0]], q = V[ab[1]];
      if (bend) {
        const m = mid(p, q); let nx = p[1] - q[1], ny = q[0] - p[0]; const h = Math.hypot(nx, ny);
        const k = [m[0] + nx / h * bend, m[1] + ny / h * bend];
        const ctl = [m[0] + 2 * nx / h * bend, m[1] + 2 * ny / h * bend];   // a curve through k (quadratic, sampled)
        items.push({ poly: Array.from({ length: 13 }, (_, i) => { const t = i / 12, u = 1 - t; return [r3(u * u * p[0] + 2 * t * u * ctl[0] + t * t * q[0]), r3(u * u * p[1] + 2 * t * u * ctl[1] + t * t * q[1])]; }), open: true });
        if (w) items.push(L(w, [k[0] + nx / h * 0.25, k[1] + ny / h * 0.25]));
      } else {
        items.push(S(p, q));
        if (w) items.push(side(p, q, w, c, 0.24));
      }
    }
    for (const k of ks) items.push(Pt(V[k], k, away(V[k], c)));
    return D(items, alt, unit);
  };
  const O = [0, 0];
  const circ = (extra, alt, unit = 40, centre = true, opos = 'n') => D([{ circle: [0, 0, 2] }, ...extra, ...(centre ? [Pt(O, 'O', opos)] : [])], alt, unit);

  Object.assign(window.H3_HELPS, {
    // =====================================================================
    // Year 10 2A Review of geometry
    // =====================================================================
    // method: Example 1, 2A (isosceles triangle angle sum; exterior angle theorem)
    // y10-2A Q1: angles in triangles
    'y10-2a-triangle': `
      <p class="hp-tag">Worked example: find x in each triangle, giving reasons.</p>
      ${(() => {
        const A = [0, 0], B = [4, 0], C = [2, 2 * tn(28)];
        const P = [0, 0], Q = [3.4, 0], R = apex(3.4, 61, 46), E = [5, 0];
        return fig(
          { kind: 'diagram', unit: 40, alt: 'An isosceles triangle with apex angle 124 degrees and base angle x', items: [poly([A, B, C]), tk(A, C), tk(B, C), ang(C, A, B, '124°', 0.45), ang(A, B, C, 'x°', 0.7)] },
          { kind: 'diagram', unit: 40, alt: 'A triangle with interior angle 61 degrees, interior angle x and exterior angle 134 degrees', items: [poly([P, Q, R]), S(Q, E), ang(P, Q, R, '61°', 0.6), ang(R, P, Q, 'x°', 0.45), ang(Q, E, R, '134°', 0.45)] }
        );
      })()}
      ${steps(
        `<p><strong>Isosceles triangle: the two base angles are equal,</strong> so both are x°. The angle sum is 180°.</p>
         ${sum('x + x + 124 = 180 (angle sum, isosceles triangle)<br>2x + 124 = 180<br>2x = 56<br>x = 28')}`,
        `<p><strong>Exterior angle:</strong> it equals the sum of the two opposite interior angles.</p>
         ${sum('x + 61 = 134 (exterior angle theorem)<br>x = 73')}
         ${ans('28 and 73')}`
      )}
      ${tip('The exterior angle equals the two interior angles <b>furthest</b> from it added together, not the one next to it (that one makes 180° with it).')}`,

    // method: Example 2a, 2A (angle sum S = (n - 2) × 180°, then solve)
    // y10-2A Q2: a missing angle in a polygon
    'y10-2a-polygon': `
      <p class="hp-tag">Worked example: find x in this pentagon.</p>
      ${(() => {
        const V = [90, 162, 234, 306, 18].map(a => on(a, 1.9)), lab = ['(2x + 20)°', '108°', '124°', '96°', '102°'];
        return D([poly(V), ...V.map((p, i) => ang(p, V[(i + 4) % 5], V[(i + 1) % 5], lab[i], 0.5))], 'A pentagon with angles 2x + 20, 108, 124, 96 and 102 degrees', 44);
      })()}
      ${steps(
        `<p><strong>Find the angle sum.</strong> A pentagon has 5 sides, so n = 5.</p>
         ${sum('S = (n − 2) × 180°<br>&nbsp;&nbsp;= (5 − 2) × 180°<br>&nbsp;&nbsp;= 540°')}`,
        `<p><strong>All the angles add to 540°.</strong> Collect the numbers, then solve.</p>
         ${sum('2x + 20 + 108 + 124 + 96 + 102 = 540<br>2x + 450 = 540<br>2x = 90<br>x = 45')}
         ${ans('45')}`
      )}
      <p><strong>Right-angle squares</strong> count as 90°. <strong>An angle drawn outside the shape</strong> sits on a straight line with the inside angle next to it, so the two add to 180°: find the inside angle first.</p>
      ${tip('Quadrilateral 360°, pentagon 540°, hexagon 720°. Check your x by putting it back in: every angle should be a sensible size.')}`,

    // method: Example 2b, 2A (S = (n - 2) × 180°, then divide by n for a regular polygon)
    // y10-2A Q3, Q6, Q7: angles of regular polygons
    'y10-2a-regular': `
      <p class="hp-tag">Worked example: find one interior angle and one exterior angle of a regular decagon (10 sides).</p>
      ${steps(
        `<p><strong>Angle sum first,</strong> with n = 10.</p>
         ${sum('S = (10 − 2) × 180° = 1440°')}`,
        `<p><strong>Regular means all the angles are equal,</strong> so share the sum between the 10 angles.</p>
         ${sum('one interior angle = 1440 ÷ 10 = 144°')}`,
        `<p><strong>An exterior angle is supplementary to the interior angle</strong> (they add to 180°).</p>
         ${sum('exterior angle = 180 − 144 = 36°')}
         ${ans('144 and 36')}`
      )}
      <p><strong>Going backwards:</strong> each interior angle is 162°. How many sides? Put the angle into the rule and solve for n.</p>
      ${sum('(n − 2) × 180 ÷ n = 162<br>(n − 2) × 180 = 162n<br>180n − 360 = 162n<br>18n = 360<br>n = 20')}
      ${tip('Names to know: pentagon 5, hexagon 6, heptagon 7, octagon 8, nonagon 9, decagon 10, dodecagon 12. Type a decimal angle like 172.8 as it is.')}`,

    // method: Example 3a, 2A (vertically opposite, then co-interior angles)
    // y10-2A Q4, Q8: angles in parallel lines
    'y10-2a-parallel': `
      <p class="hp-tag">Worked example: find a, giving reasons.</p>
      ${(() => {
        const P = [1.2, 0], Q = [1.2 + 2 / tn(57), 2];
        return D([
          S([-0.6, 0], [4.4, 0]), S([-0.6, 2], [4.4, 2]), pr([2.8, 0], [3.4, 0]), pr([2.8, 2], [3.4, 2]),
          S(add(P, [cs(57), sn(57)], -1.1), add(Q, [cs(57), sn(57)], 0.9)),
          ang(P, [-0.6, 0], add(P, [cs(57), sn(57)], -1), '57°', 0.55),
          ang(Q, P, [4.4, 2], 'a°', 0.5)
        ], 'Two parallel lines cut by a transversal, with a 57 degree angle at the lower line and angle a at the upper line', 44);
      })()}
      ${steps(
        `<p><strong>Move the known angle to a useful spot.</strong> The 57° angle is vertically opposite the angle just above the lower line, on the right of the crossing line, so that angle is 57° too.</p>`,
        `<p><strong>Use the parallel lines.</strong> That 57° angle and a° are between the parallel lines on the same side of the transversal: they are co-interior, so they add to 180°.</p>
         ${sum('a + 57 = 180 (co-interior angles in ∥ lines)<br>a = 123')}
         ${ans('123')}`
      )}
      ${chips(['alternate: equal'], ['corresponding: equal'], ['co-interior: add to 180°'], ['vertically opposite: equal'])}
      <p><strong>Angles given as letters:</strong> if y = 4x and the two angles are co-interior, then x + 4x = 180, so 5x = 180, x = 36 and y = 144. <strong>A triangle between the lines:</strong> move angles across with alternate angles, then use the angle sum and any equal sides.</p>
      ${tip('Write the reason beside every step. Saying "alternate" or "co-interior" out loud helps you check the angle really is in that position.')}`,

    // method: Example 3b, 2A (construct a third parallel line through the bend)
    // y10-2A Q5: a bend between two parallel lines
    'y10-2a-third-line': `
      <p class="hp-tag">Worked example: AB ∥ DE. Find a, the angle at C.</p>
      ${(() => {
        const A = [0, 3], B = [4, 3], C = add(B, [cs(207), sn(207)], 2.4), Dd = add(C, [cs(-28), sn(-28)], 2.2), E = [6.2, Dd[1]], F = [C[0] + 2.6, C[1]];
        return D([
          S(A, B, { arrow: 'end' }), S(B, C), S(C, Dd), S(Dd, E, { arrow: 'end' }), S(C, F, { dash: true }),
          Pt(A, 'A', 'w'), Pt(B, 'B', 'ne'), Pt(C, 'C', 'w'), Pt(Dd, 'D', 's'), Pt(E, 'E', 'e'), Pt(F, 'F', 'e'),
          ang(B, A, C, '27°', 0.7), ang(Dd, C, E, '152°', 0.3), ang(C, B, Dd, 'a°', 0.45)
        ], 'A bent line from B down to C and on to D, between parallel lines AB and DE, with 27 degrees at B and 152 degrees at D', 64);
      })()}
      ${steps(
        `<p><strong>Draw a third parallel line CF through the bend.</strong> It splits a into two parts.</p>`,
        `<p><strong>Top part:</strong> ∠ABC and ∠BCF are alternate angles.</p>
         ${sum('∠BCF = 27° (alternate angles in ∥ lines)')}`,
        `<p><strong>Bottom part:</strong> ∠FCD and ∠CDE are co-interior. Then add the two parts.</p>
         ${sum('∠FCD = 180° − 152° = 28° (co-interior angles in ∥ lines)<br>a = 27 + 28 = 55')}
         ${ans('55')}`
      )}
      <p><strong>A reflex angle at the bend?</strong> Find the angle on the other side of the point first: a reflex angle of 290° leaves 360 − 290 = 70°. <strong>A right angle at a bend</strong> is 90° split into two parts the same way.</p>
      ${tip('Through every bend, draw a line parallel to the given ones. Then each part of the angle is alternate or co-interior with an angle you know.')}`,

    // method: no worked example in the book for chained problems; Key ideas 2A (angles on a line, isosceles, exterior angle)
    // y10-2A Q9, Q16, Q17: several steps in a row
    'y10-2a-multi': `
      <p class="hp-tag">Worked example 1: A, O and D lie on a straight line. ∠AOB = 38° and ∠BOC = ∠COD. Find ∠COD.</p>
      ${steps(
        `<p><strong>Angles on a straight line add to 180°.</strong> Take off the angle you know.</p>
         ${sum('∠BOC + ∠COD = 180 − 38 = 142°')}`,
        `<p><strong>The two angles are equal,</strong> so halve it.</p>
         ${sum('∠COD = 142 ÷ 2 = 71°')}
         ${ans('71')}`
      )}
      <p class="hp-tag">Worked example 2: in triangle KLM, N is on KM with NK = NL, and ∠K = 29°. Find ∠LNM.</p>
      ${steps(
        `<p><strong>NK = NL makes triangle KNL isosceles,</strong> so its base angles are equal: ∠NLK = 29°.</p>`,
        `<p><strong>∠LNM is an exterior angle of triangle KNL,</strong> so it equals the two opposite interior angles added.</p>
         ${sum('∠LNM = 29 + 29 = 58°')}
         ${ans('58')}`
      )}
      ${tip('Mark every angle you find on the diagram as you go. Look for equal sides (isosceles), three equal sides (equilateral, all 60°), and straight lines. Joining two points can create these triangles.')}`,

    // method: Key ideas 2A (polygon angle sum rule, exterior angle theorem); rearranging as in Year 9 algebra
    // y10-2A Q10, Q11, Q12: writing angle rules with letters
    'y10-2a-letters': `
      <p class="hp-tag">Worked example: an isosceles triangle has apex angle a° and base angles b°.</p>
      ${steps(
        `<p><strong>Write b in terms of a.</strong> Use the angle sum, exactly as with numbers.</p>
         ${sum('a + b + b = 180<br>2b = 180 − a<br>b = (180 − a)/2')}`,
        `<p><strong>Now make a the subject of that rule.</strong> Undo each step, doing the same thing to both sides.</p>
         ${sum('b = (180 − a)/2<br>2b = 180 − a &nbsp;&nbsp;(× 2)<br>a = 180 − 2b &nbsp;&nbsp;(+ a, − 2b)')}
         ${ans('180 − 2b')}`
      )}
      <p><strong>More letters:</strong> a quadrilateral with angles p°, q° and r° has fourth angle 360 − p − q − r. <strong>Proofs:</strong> if some angles together fill a straight line or a co-interior pair, their sum is 180.</p>
      ${tip('Type expressions with ordinary keys: 180-2b, (180-a)/2, 360/n. Use brackets around a whole top or bottom of a fraction.')}`,

    // method: Example 3b, 2A (extra parallel lines) and Key ideas 2A (regular polygons)
    // y10-2A Q15: harder angle puzzles
    'y10-2a-enrich': `
      <p class="hp-tag">Worked example 1: a regular decagon (10 sides) has centre O. Find the angle at O between the lines to two corners that are three sides apart.</p>
      ${steps(
        `<p><strong>Join O to every corner.</strong> The 10 angles at O are equal and make a full revolution.</p>
         ${sum('one angle = 360 ÷ 10 = 36°')}`,
        `<p><strong>Three sides apart means three of those angles.</strong></p>
         ${sum('3 × 36 = 108°')}
         ${ans('108')}`
      )}
      <p class="hp-tag">Worked example 2: a zigzag between two parallel lines.</p>
      <p>Draw a line parallel to the given lines through <b>every</b> bend. Each bend then splits into an alternate or co-interior pair. If a bend is marked with a reflex angle, use 360° minus it first, such as 360 − 290 = 70°.</p>
      ${tip('Work from one parallel line to the other, one bend at a time, writing each new angle on the diagram.')}`,

    // =====================================================================
    // Year 10 2B Congruent triangles
    // =====================================================================
    // method: Example 4, 2B (list S, A, S pairs, then name the test)
    // y10-2B Q1, Q7, Q8: which congruence test?
    'y10-2b-tests': `
      <p class="hp-tag">Worked example: prove that these two triangles are congruent.</p>
      ${(() => {
        const A = [0, 0], B = [2.6, 0], C = [3.4 * cs(48), 3.4 * sn(48)], dx = 4.2;
        const T = (p) => [p[0] + dx, p[1]], Dd = T(A), E = T(B), F = T(C);
        return D([
          poly([A, B, C]), poly([Dd, E, F]),
          Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(C, 'C', 'n'), Pt(Dd, 'D', 'sw'), Pt(E, 'E', 'se'), Pt(F, 'F', 'n'),
          side(A, B, '6', [1, 1]), side(A, C, '9', [2, 0]), side(Dd, E, '6', [5.2, 1]), side(Dd, F, '9', [6.2, 0]),
          ang(A, B, C, '48°', 0.55), ang(Dd, E, F, '48°', 0.55)
        ], 'Triangles ABC and DEF, each with sides 6 and 9 and the angle of 48 degrees between them', 40);
      })()}
      ${steps(
        `<p><strong>List the matching pairs</strong> and write S or A beside each.</p>
         ${sum('AB = DE = 6 (given) &nbsp;S<br>∠BAC = ∠EDF = 48° (given) &nbsp;A<br>AC = DF = 9 (given) &nbsp;S')}`,
        `<p><strong>Read the pattern.</strong> The angle is between the two sides, so it is SAS.</p>
         ${sum('∴ ΔABC ≡ ΔDEF (SAS)')}
         ${ans('SAS')}`
      )}
      ${chips(['SSS: three pairs of sides'], ['SAS: two sides and the angle between them'], ['AAS: two angles and a matching side'], ['RHS: right angle, hypotenuse, one other side'])}
      <p><strong>In proofs</strong> the pairs often come from the diagram: two radii of a circle are equal (S), a side shared by both triangles is common (S), and vertically opposite angles are equal (A).</p>
      ${tip('SAS only works when the angle sits between the two sides. A right angle with the hypotenuse marked is RHS.')}`,

    // method: Key ideas, 2B (write vertices in matching order) with Example 4
    // y10-2B Q3: the test and the congruence statement
    'y10-2b-statement': `
      <p class="hp-tag">Worked example: ABCD is a kite with AB = AD and CB = CD. Choose the test for ΔABC and ΔADC, then complete ΔABC ≡ Δ___.</p>
      ${(() => {
        const A = [0, 2.6], B = [-1.3, 1.4], C = [0, -1], Dd = [1.3, 1.4];
        return D([poly([A, B, C, Dd]), S(A, C), tk(A, B), tk(A, Dd), tk(B, C, 2), tk(Dd, C, 2),
          Pt(A, 'A', 'n'), Pt(B, 'B', 'w'), Pt(C, 'C', 's'), Pt(Dd, 'D', 'e')], 'A kite ABCD with diagonal AC; AB equals AD and CB equals CD', 46);
      })()}
      ${steps(
        `<p><strong>List the pairs.</strong></p>
         ${sum('AB = AD (given) &nbsp;S<br>CB = CD (given) &nbsp;S<br>AC is common &nbsp;S<br>∴ SSS')}`,
        `<p><strong>Match the corners.</strong> A matches A (both ends of the common side are shared), B matches D (the corner between the single-tick and double-tick sides), and C matches C.</p>
         ${sum('A → A, &nbsp;B → D, &nbsp;C → C')}
         ${ans('ΔABC ≡ ΔADC, so type ADC')}`
      )}
      ${tip('Write the second triangle in the same order as the first: the first letter matches the first letter, and so on. Equal marks (ticks, arcs) tell you which corners match.')}`,

    // method: Example 5, 2B (prove congruent, then corresponding sides and angles are equal)
    // y10-2B Q2, Q4, Q5, Q6: using congruent triangles to find sides and angles
    'y10-2b-use': `
      <p class="hp-tag">Worked example: ∠A = ∠C = 90° and AB = CB. AD = 5.3 cm. Prove ΔABD ≡ ΔCBD, then find CD.</p>
      ${(() => {
        const B = [0, 0], Dd = [4, 0], A = [1, 1.732], C = [1, -1.732];
        return D([poly([A, B, C, Dd]), S(B, Dd), rt(A, B, Dd), rt(C, B, Dd), tk(A, B), tk(C, B),
          Pt(A, 'A', 'n'), Pt(B, 'B', 'w'), Pt(C, 'C', 's'), Pt(Dd, 'D', 'e'), side(A, Dd, '5.3 cm', [1.5, 0])], 'Two right-angled triangles ABD and CBD sharing the side BD, with AB equal to CB and AD equal to 5.3 cm', 44);
      })()}
      ${steps(
        `<p><strong>Prove the triangles congruent.</strong></p>
         ${sum('∠A = ∠C = 90° (given) &nbsp;R<br>BD is common &nbsp;H<br>AB = CB (given) &nbsp;S<br>∴ ΔABD ≡ ΔCBD (RHS)')}`,
        `<p><strong>Matching sides in congruent triangles are equal.</strong> AD matches CD.</p>
         ${sum('CD = AD = 5.3 cm')}
         ${ans('5.3')}`
      )}
      <p><strong>Angles work the same way:</strong> ∠ABD matches ∠CBD, so they are equal. Name an angle with three letters, the corner in the middle.</p>
      ${tip('A pronumeral on one triangle equals the matching side on the other. Find the match from the congruence statement or the equal marks, not from where the side sits on the page.')}`,

    // =====================================================================
    // Year 10 2C Using congruence to investigate quadrilaterals
    // =====================================================================
    // method: Example 6b, 2C (choose two triangles, prove congruent, use matching parts)
    // y10-2C Q1, Q2, Q3, Q4, Q5: proving properties of quadrilaterals
    'y10-2c-prove': `
      <p class="hp-tag">Worked example: prove that a rectangle ABCD has diagonals of equal length. If AC = 11.6 cm, find BD.</p>
      ${(() => {
        const A = [0, 0], B = [4, 0], C = [4, 2.4], Dd = [0, 2.4];
        return D([poly([A, B, C, Dd]), S(A, C), S(B, Dd), rt(A, B, Dd), rt(B, A, C),
          Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(C, 'C', 'ne'), Pt(Dd, 'D', 'nw')], 'Rectangle ABCD with diagonals AC and BD', 44);
      })()}
      ${steps(
        `<p><strong>Pick two triangles that each hold one diagonal:</strong> ΔABC and ΔBAD.</p>`,
        `<p><strong>List the pairs, with reasons.</strong></p>
         ${sum('AB is common &nbsp;S<br>∠ABC = ∠BAD = 90° (rectangle) &nbsp;A<br>BC = AD (opposite sides of a parallelogram) &nbsp;S<br>∴ ΔABC ≡ ΔBAD (SAS)')}`,
        `<p><strong>Use the matching parts.</strong> AC and BD are matching sides.</p>
         ${sum('BD = AC = 11.6 cm')}
         ${ans('11.6')}`
      )}
      <p><strong>Halves:</strong> the diagonals of a parallelogram bisect each other, so from a corner to the middle is half a diagonal: 11.6 ÷ 2 = 5.8 cm.</p>
      ${chips(['parallel sides + diagonal: alternate angles'], ['diagonals crossing: vertically opposite angles'], ['shared side: common'])}
      ${tip('Angle reasons in these proofs are nearly always alternate angles (from parallel sides) or vertically opposite angles (where the diagonals cross).')}`,

    // method: Example 7b, 2C (diagonals bisect at right angles: four triangles congruent by SAS)
    // y10-2C Q6, Q7, Q10: rhombus sides and angles
    'y10-2c-rhombus': `
      <p class="hp-tag">Worked example: the diagonals of ABCD bisect each other at right angles at E. AE = 20 cm and BE = 21 cm. Find the length of each side.</p>
      ${(() => {
        const A = [-2.5, 0], B = [0, 2.6], C = [2.5, 0], Dd = [0, -2.6], E = [0, 0];
        return D([poly([A, B, C, Dd]), S(A, C), S(B, Dd), rt(E, C, B), side(A, E, '20', [0, -1]), side(E, B, '21', [-1, 0]),
          Pt(A, 'A', 'w'), Pt(B, 'B', 'n'), Pt(C, 'C', 'e'), Pt(Dd, 'D', 's'), Pt(E, 'E', 'se')], 'Quadrilateral ABCD with diagonals meeting at right angles at E; AE is 20 and BE is 21', 40);
      })()}
      ${steps(
        `<p><strong>The four small triangles are congruent (SAS):</strong> each has two half-diagonals with a 90° angle between them. So all four sides are equal and ABCD is a rhombus.</p>`,
        `<p><strong>Find one side with Pythagoras</strong> in ΔABE.</p>
         ${sum('AB² = AE² + BE²<br>AB² = 20² + 21² = 400 + 441 = 841<br>AB = √841 = 29')}
         ${ans('29')}`
      )}
      <p><strong>Angles:</strong> in ΔABE the angle at E is 90°. If ∠ABE = 27°, then ∠BAE = 180 − 90 − 27 = 63°.</p>
      ${tip('In a rhombus the diagonals always cross at 90°, and they cut the corner angles in half.')}`,

    // method: Example 7b, 2C (test for a type of quadrilateral) and Key ideas 2C
    // y10-2C Q8, Q9: which quadrilateral is it?
    'y10-2c-types': `
      <p class="hp-tag">Worked example: the diagonals of a quadrilateral bisect each other at right angles. What type of quadrilateral must it be?</p>
      ${steps(
        `<p><strong>Use the congruent triangles.</strong> The four triangles at the centre are congruent by SAS, so all four sides are equal.</p>`,
        `<p><strong>Four equal sides</strong> make a rhombus.</p>
         ${ans('Rhombus')}`
      )}
      ${fig({ kind: 'table', rows: [['The diagonals...', 'Then it is a...'], ['bisect each other', 'parallelogram'], ['bisect each other and are equal', 'rectangle'], ['bisect each other at right angles', 'rhombus'], ['are equal and bisect each other at right angles', 'square']] })}
      <p><strong>Co-interior angles:</strong> neighbouring angles of a parallelogram are co-interior, so they add to 180°. If ∠A = 72°, then ∠B = 180 − 72 = 108°.</p>
      ${tip('A rectangle, rhombus and square are all special parallelograms, so every parallelogram fact works for them too.')}`,

    // =====================================================================
    // Year 10 2D Similar figures
    // =====================================================================
    // method: Example 8, 2D (similarity statement, scale factor, multiply; for the other shape, multiply y by the scale factor and solve)
    // y10-2D Q1, Q2, Q3: scale factor and missing sides
    'y10-2d-scale': `
      <p class="hp-tag">Worked example: ABCD and EFGH are similar. Find the scale factor, then x and y.</p>
      ${(() => {
        const sm = [[0, 0], [2, 0], [1.7, 1.2], [0, 1.6]], k = 1.5, dx = 3.9, big = sm.map(p => [p[0] * k + dx, p[1] * k]);
        const cS = [0.9, 0.7], cB = [0.9 * k + dx, 0.7 * k];
        return D([poly(sm), poly(big),
          ...['A', 'B', 'C', 'D'].map((n, i) => Pt(sm[i], n, ['sw', 'se', 'ne', 'nw'][i])), ...['E', 'F', 'G', 'H'].map((n, i) => Pt(big[i], n, ['sw', 'se', 'ne', 'nw'][i])),
          side(sm[0], sm[1], '4 cm', cS), side(sm[3], sm[0], '3.4 cm', cS), side(sm[2], sm[3], 'y cm', cS),
          side(big[0], big[1], '6 cm', cB), side(big[3], big[0], 'x cm', cB), side(big[2], big[3], '8.4 cm', cB)], 'Two similar quadrilaterals ABCD and EFGH', 40);
      })()}
      ${steps(
        `<p><strong>Similarity statement:</strong> match the corners in order, ABCD ||| EFGH. Matching sides make equal ratios, such as EH/AD = FG/BC.</p>`,
        `<p><strong>Scale factor = image length ÷ original length,</strong> using a pair of matching sides that are both known.</p>
         ${sum('scale factor = EF/AB = 6/4 = 1.5')}`,
        `<p><strong>Big side from a small side: multiply.</strong> EH matches AD.</p>
         ${sum('x = 3.4 × 1.5 = 5.1')}`,
        `<p><strong>Small side from a big side:</strong> y times the scale factor gives HG. Solve.</p>
         ${sum('y × 1.5 = 8.4<br>y = 8.4 ÷ 1.5 = 5.6')}
         ${ans('1.5, x = 5.1, y = 5.6')}`
      )}
      ${tip('If a question asks for the scale factor as a fraction, simplify it, like 14/8 = 7/4, and type it with a slash: 7/4.')}`,

    // method: Example 8, 2D (find the scale factor from a matching pair, then multiply or divide)
    // y10-2D Q4, Q5, Q6, Q7, Q8: similar triangles and shadows
    'y10-2d-find': `
      <p class="hp-tag">Worked example: the two triangles are similar. Find x.</p>
      ${(() => {
        const a = [[0, 0], [1.5, 0], [0, 1]], k = 2.4, dx = 2.9, b = a.map(p => [p[0] * k / 1.6 + dx, p[1] * k / 1.6]);
        return D([poly(a), poly(b), rt(a[0], a[1], a[2]), rt(b[0], b[1], b[2]),
          side(a[0], a[1], '4.5', [0.5, 0.4]), side(a[0], a[2], '3', [0.5, 0.4]),
          side(b[0], b[1], 'x', [dx + 0.6, 0.5]), side(b[0], b[2], '7.2', [dx + 0.6, 0.5])], 'Two similar right-angled triangles: the small one has sides 3 and 4.5, the large one has matching sides 7.2 and x', 40);
      })()}
      ${steps(
        `<p><strong>Find a matching pair you know both of.</strong> 7.2 matches 3.</p>
         ${sum('scale factor = 7.2 ÷ 3 = 2.4')}`,
        `<p><strong>x matches 4.5,</strong> and x is on the big triangle, so multiply.</p>
         ${sum('x = 4.5 × 2.4 = 10.8')}
         ${ans('10.8')}`
      )}
      <p><strong>Shadows:</strong> a 9 m tree casts a 12 m shadow. At the same time a person casts a 2.2 m shadow. The sun's rays make similar right-angled triangles. Going from the tree to the person:</p>
      ${sum('scale factor = 2.2 ÷ 12 = 0.18333...<br>height = 9 × 0.18333... = 1.65 m')}
      ${tip('Match sides that sit opposite equal angles. In nested triangles the big side is the whole length, so add the two parts first. Round only at the end.')}`,

    // method: Key ideas, 2D (similar: matching angles equal and matching sides in the same ratio)
    // y10-2D Q9, Q10: are all of these similar?
    'y10-2d-tf': `
      <p class="hp-tag">Worked example: true or false?</p>
      ${steps(
        `<p><strong>"All regular hexagons are similar."</strong> Every regular hexagon has all angles 120°, and all its sides are equal, so any two have every pair of sides in the same ratio.</p>
         ${ans('True')}`,
        `<p><strong>"All right-angled triangles are similar."</strong> One could have angles 90°, 60°, 30° and another 90°, 45°, 45°. The angles do not match, so they are not similar.</p>
         ${ans('False')}`
      )}
      <p><strong>Checking two triangles:</strong> one has angles 55° and 81°. Its third angle is 180 − 55 − 81 = 44°. If another triangle has angles 44° and 55°, its third is 81° too, so all three pairs match: similar.</p>
      ${tip('To say "always similar", the shape must have no freedom: every angle fixed and every side fixed in proportion. One different example is enough to say false.')}`,

    // method: Key ideas, 2D (scale factor = image length ÷ original length), applied to areas and volumes
    // y10-2D Q11: area and volume scale factors
    'y10-2d-cube': `
      <p class="hp-tag">Worked example: a cube with side 4 cm is enlarged to a cube with side 6 cm.</p>
      ${steps(
        `<p><strong>Length scale factor:</strong></p>
         ${sum('6/4 = 3/2')}`,
        `<p><strong>Areas of one face:</strong> 4 × 4 = 16 cm² and 6 × 6 = 36 cm².</p>
         ${sum('area scale factor = 36/16 = 9/4')}`,
        `<p><strong>Volumes:</strong> 4 × 4 × 4 = 64 cm³ and 6 × 6 × 6 = 216 cm³.</p>
         ${sum('volume scale factor = 216/64 = 27/8')}
         ${ans('3/2, 9/4, 27/8')}`
      )}
      <p><strong>Spot the pattern:</strong> 9/4 = 3²/2² and 27/8 = 3³/2³. Areas use the length scale factor squared, volumes use it cubed.</p>
      ${tip('Type fractions with a slash, like 9/4, and powers with ^, like 3^2/2^2.')}`,

    // =====================================================================
    // Year 10 2E Proving and applying similar triangles
    // =====================================================================
    // method: Example 9, 2E (ratios of matching sides, or matching angles, then name the test)
    // y10-2E Q1, Q3, Q9: which similarity test?
    'y10-2e-tests': `
      <p class="hp-tag">Worked example: prove that the two triangles are similar.</p>
      ${(() => {
        const A = [0, 0], B = [1.6, 0], C = [2.1 * cs(64), 2.1 * sn(64)], k = 3, dx = 2.6;
        const T = (p) => [p[0] * k * 0.6 + dx, p[1] * k * 0.6], Dd = T(A), E = T(B), F = T(C);
        return D([poly([A, B, C]), poly([Dd, E, F]),
          Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(C, 'C', 'n'), Pt(Dd, 'D', 'sw'), Pt(E, 'E', 'se'), Pt(F, 'F', 'n'),
          side(A, B, '2.1', [1, 1]), side(A, C, '2.8', [1.5, 0]), side(Dd, E, '6.3', [dx + 2, 2]), side(Dd, F, '8.4', [dx + 3, 0]),
          ang(A, B, C, '64°', 0.45), ang(Dd, E, F, '64°', 0.5)], 'Triangles ABC and DEF: AB 2.1, AC 2.8 and DE 6.3, DF 8.4, with 64 degrees between the sides in both', 40);
      })()}
      ${steps(
        `<p><strong>Ratios of matching sides.</strong></p>
         ${sum('DF/AC = 8.4/2.8 = 3 &nbsp;S<br>DE/AB = 6.3/2.1 = 3 &nbsp;S')}`,
        `<p><strong>The angle between those sides matches.</strong></p>
         ${sum('∠BAC = ∠EDF = 64° &nbsp;A<br>∴ ΔABC ||| ΔDEF (SAS)')}
         ${ans('SAS')}`
      )}
      <p><strong>Angles only:</strong> if two triangles both have angles of 48° and 77°, the third angles are both 180 − 48 − 77 = 55°, so the test is <b>AAA</b>. Equal angles often come from parallel lines (alternate or corresponding), from crossing lines (vertically opposite), or from an angle both triangles share (common).</p>
      ${chips(['SSS: all three ratios equal'], ['SAS: two ratios equal + the angle between'], ['AAA: angles match'], ['RHS: right angle, hypotenuse ratio = side ratio'])}
      ${tip('Divide big by small for each matching pair. If the ratios are all the same number, the sides are in proportion.')}`,

    // method: Example 8, 2D and Example 10b, 2E (scale factor from matching sides, then multiply)
    // y10-2E Q2, Q10: finding sides in similar triangles
    'y10-2e-scale': `
      <p class="hp-tag">Worked example: two similar triangles have matching sides 6 and 9. The side 5.2 on the small triangle matches x on the big one. Find x.</p>
      ${steps(
        `<p><strong>Scale factor first,</strong> from the pair you know.</p>
         ${sum('scale factor = 9 ÷ 6 = 1.5')}`,
        `<p><strong>Multiply to go from small to big.</strong></p>
         ${sum('x = 5.2 × 1.5 = 7.8')}
         ${ans('7.8')}`
      )}
      <p><strong>Parallel lines inside a triangle:</strong> AD ∥ BC, OD = 2 and DC = 3. Triangles OAD and OBC are similar (AAA, corresponding angles).</p>
      ${(() => {
        const Oo = [0, 3], B = [-1.5, 0], C = [2, 0], A = add(Oo, [B[0] - Oo[0], B[1] - Oo[1]], 0.4), Dd = add(Oo, [C[0] - Oo[0], C[1] - Oo[1]], 0.4);
        return D([poly([Oo, B, C]), S(A, Dd), pr(A, Dd), pr(B, C), Pt(Oo, 'O', 'n'), Pt(A, 'A', 'w'), Pt(Dd, 'D', 'e'), Pt(B, 'B', 'sw'), Pt(C, 'C', 'se'),
          side(Oo, Dd, '2', [0, 0]), side(Dd, C, '3', [0, 0]), side(Oo, A, '1.8', [0, 0])], 'Triangle OBC with AD parallel to BC; OD is 2, DC is 3 and OA is 1.8', 40);
      })()}
      ${sum('OC = 2 + 3 = 5<br>OC/OD = 5/2 = 2.5, so OB is 2.5 times OA<br>if OA = 1.8, OB = 1.8 × 2.5 = 4.5')}
      ${tip('The whole side of the big triangle is the sum of the two parts. Never compare a part with the other part.')}`,

    // method: Example 10, 2E (prove AAA, then equate ratios of matching sides and solve)
    // y10-2E Q4, Q5, Q6, Q7, Q8: similar triangle problems
    'y10-2e-problems': `
      <p class="hp-tag">Worked example: a cone has radius 6 cm and height 15 cm. Water fills it to a depth of 10 cm. Find the radius DE of the water surface.</p>
      ${(() => {
        const A = [0, 0], B = [0, 5], C = [3, 5], Dd = [0, 10 / 3], E = [2, 10 / 3];
        return D([poly([[-3, 5], C, A]), S(A, B, { dash: true }), S(Dd, E), S(B, C), S([-2, 10 / 3], Dd, { dash: true }),
          Pt(A, 'A', 's'), Pt(B, 'B', 'n'), Pt(C, 'C', 'ne'), Pt(Dd, 'D', 'w'), Pt(E, 'E', 'e'),
          L('6', [1.5, 5.3]), L('10', [-0.25, 1.6], 'end'), L('15', [3.4, 2.4], 'start'), { dim: [3.2, 0, 3.2, 5], off: 0 }], 'A cone with its point at the bottom: radius BC 6, height AB 15, water depth AD 10 and water radius DE', 40);
      })()}
      ${steps(
        `<p><strong>Prove the triangles are similar.</strong></p>
         ${sum('∠DAE is common &nbsp;A<br>∠ADE = ∠ABC (corresponding angles, DE ∥ BC) &nbsp;A<br>∴ ΔADE ||| ΔABC (AAA)')}`,
        `<p><strong>Ratios of matching sides are equal.</strong></p>
         ${sum('DE/BC = AD/AB<br>DE/6 = 10/15')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('DE = 6 × 10 ÷ 15 = 4')}
         ${ans('4')}`
      )}
      ${tip('Shadows, rivers and ramps work the same way: find two triangles with matching angles (the sun\'s rays are parallel; parallel lines give corresponding or alternate angles), then match the sides.')}`,

    // method: Example 9b, 2E (AAA) and the rule given in the question, then a square root
    // y10-2E Q11: right-angled triangles with an altitude
    'y10-2e-right': `
      <p class="hp-tag">Worked example: ΔABD has a right angle at A, and AC is perpendicular to BD. BD = 10, CB = 3.6 and CD = 6.4. Use AB² = CB × BD and AD² = CD × BD.</p>
      ${(() => {
        const B = [0, 0], Dd = [5, 0], C = [1.8, 0], A = [1.8, 2.4];
        return D([poly([A, B, Dd]), S(A, C), rt(A, B, Dd), rt(C, Dd, A), Pt(A, 'A', 'n'), Pt(B, 'B', 'sw'), Pt(C, 'C', 's'), Pt(Dd, 'D', 'se'),
          L('3.6', [0.9, -0.35]), L('6.4', [3.4, -0.35])], 'Right-angled triangle ABD with the altitude AC to the hypotenuse BD; CB is 3.6 and CD is 6.4', 50);
      })()}
      ${steps(
        `<p><strong>Substitute, then square root.</strong></p>
         ${sum('AB² = 3.6 × 10 = 36<br>AB = √36 = 6')}`,
        `<p><strong>Same again for AD.</strong></p>
         ${sum('AD² = 6.4 × 10 = 64<br>AD = √64 = 8')}
         ${ans('6 and 8')}`
      )}
      <p><strong>Why the rule works:</strong> ΔABD and ΔCBA share ∠B and both have a right angle, so they are similar by AAA.</p>
      ${tip('Check with Pythagoras: 6² + 8² = 36 + 64 = 100 = 10².')}`,

    // =====================================================================
    // Year 10 2F Circle terminology and chord properties
    // =====================================================================
    // method: Example 11, 2F (state the chord theorem, halve the chord and the angle)
    // y10-2F Q1, Q2, Q3, Q4: using the chord theorems
    'y10-2f-chords': `
      <p class="hp-tag">Worked example: OM ⊥ AB, AB = 18 cm and ∠AOB = 132°. Find AM and ∠AOM.</p>
      ${(() => {
        const A = on(204), B = on(336), M = mid(A, B);
        return circ([S(A, B), S(O, A), S(O, B), S(O, M), rt(M, B, O), ang(O, A, B, '132°', 0.22), Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(M, 'M', 's')], 'A circle with centre O, chord AB, and OM perpendicular to AB; angle AOB is 132 degrees', 64, true);
      })()}
      ${steps(
        `<p><strong>Name the theorem.</strong> Chord theorem 3: the perpendicular from the centre bisects the chord and the angle at the centre.</p>`,
        `<p><strong>Halve both.</strong></p>
         ${sum('AM = 18 ÷ 2 = 9 cm<br>∠AOM = 132 ÷ 2 = 66°')}
         ${ans('9 and 66')}`
      )}
      <p><strong>Equal chords:</strong> if AB = CD and OE = 4.8 cm is the distance from O to AB, then the distance OF to CD is also 4.8 cm (chord theorem 2).</p>
      ${chips(['1: equal chords, equal angles at the centre'], ['2: equal chords, equal distances from the centre'], ['3: perpendicular from the centre bisects the chord'], ['4: perpendicular bisectors of chords meet at the centre'])}
      ${tip('Each theorem also works backwards: equal angles at the centre mean equal chords, and a radius through the midpoint of a chord meets it at 90°.')}`,

    // method: no worked example in 2F; Key ideas 2A (isosceles triangle, angle sum) with radii as the equal sides
    // y10-2F Q5: angles in triangles made by radii
    'y10-2f-angles': `
      <p class="hp-tag">Worked example: O is the centre. ∠OAB = 34°. Find ∠AOB.</p>
      ${(() => {
        const A = on(214), B = on(326);
        return circ([poly([O, A, B]), ang(A, B, O, '34°', 0.6), ang(O, A, B, 'a°', 0.4), Pt(A, 'A', 'sw'), Pt(B, 'B', 'se')], 'A circle with centre O and triangle OAB made by two radii and a chord; angle OAB is 34 degrees', 44, true);
      })()}
      ${steps(
        `<p><strong>OA and OB are both radii,</strong> so triangle OAB is isosceles and ∠OBA = 34° too.</p>`,
        `<p><strong>Angle sum.</strong></p>
         ${sum('a = 180 − 2 × 34 = 112')}
         ${ans('112')}`
      )}
      <p><strong>Given a reflex angle at the centre?</strong> If reflex ∠AOB = 224°, the angle inside the triangle is 360 − 224 = 136°, and each base angle is (180 − 136) ÷ 2 = 22°.</p>
      ${tip('A radius meeting a chord at its midpoint makes a right angle. A chord as long as the radius makes a triangle with three equal sides. A regular polygon: share 360° between its sides at the centre.')}`,

    // method: no worked example in 2F; chord theorem 3 then Pythagoras written as a² + b² = c² (Year 9 method)
    // y10-2F Q6, Q7: lengths with Pythagoras
    'y10-2f-pythag': `
      <p class="hp-tag">Worked example: the radius is 13 cm and chord AB is 24 cm. Find the distance OM from the centre to the chord.</p>
      ${(() => {
        const A = on(218), B = on(322), M = mid(A, B);
        return circ([S(A, B), S(O, A), S(O, M), rt(M, B, O), side(O, A, '13', [1, -0.5]), Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(M, 'M', 's')], 'A circle with centre O, radius 13 to A, chord AB of 24 and OM perpendicular to AB', 44, true);
      })()}
      ${steps(
        `<p><strong>The perpendicular bisects the chord</strong> (chord theorem 3).</p>
         ${sum('AM = 24 ÷ 2 = 12')}`,
        `<p><strong>Pythagoras in ΔOAM.</strong> OA is the hypotenuse.</p>
         ${sum('OM² + AM² = OA²<br>OM² + 12² = 13²<br>OM² + 144 = 169<br>OM² = 25<br>OM = 5')}
         ${ans('5')}`
      )}
      <p><strong>Two circles with a common chord:</strong> radii 3 and 7, common chord 4, so half the chord is 2. Find each centre's distance to the chord, then add:</p>
      ${sum('√(3² − 2²) = √5 &nbsp;&nbsp; √(7² − 2²) = √45 = 3√5<br>total = √5 + 3√5 = 4√5')}
      ${tip('Type a surd like 4sqrt5. Simplify each surd before adding, so like surds can be collected.')}`,

    // method: Example 12, 2F (prove a chord theorem with congruent triangles: list R, H, S)
    // y10-2F Q8, Q9, Q10, Q11: proving the chord theorems
    'y10-2f-proofs': `
      <p class="hp-tag">Worked example: prove that the perpendicular from the centre to a chord bisects the chord.</p>
      ${(() => {
        const A = on(214), B = on(326), M = mid(A, B);
        return circ([S(A, B), S(O, A), S(O, B), S(O, M), rt(M, B, O), Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(M, 'M', 's')], 'A circle with centre O, chord AB, radii OA and OB, and OM perpendicular to AB', 44, true);
      })()}
      ${steps(
        `<p><strong>Use the two triangles made by the radii.</strong></p>
         ${sum('∠OMA = ∠OMB = 90° (given) &nbsp;R<br>OA = OB (both radii) &nbsp;H<br>OM is common &nbsp;S<br>∴ ΔOMA ≡ ΔOMB (RHS)')}`,
        `<p><strong>Matching sides are equal,</strong> so AM = BM: the chord is bisected.</p>
         ${ans('RHS')}`
      )}
      ${tip('Radii give equal sides for free. A shared side is common. Equal angles at the centre sit between two radii, and equal chords are a third pair of sides. Pick the test that fits what you are told.')}`,

    // =====================================================================
    // Year 10 2G Angle properties of circles: Theorems 1 and 2
    // =====================================================================
    // method: Example 13a, 2G (angle at the centre = 2 × angle at the circumference)
    // y10-2G Q1, Q4, Q7a: angle at the centre
    'y10-2g-centre': `
      <p class="hp-tag">Worked example: O is the centre. Find a.</p>
      ${(() => {
        const A = on(218), B = on(322), C = on(95);
        return circ([S(O, A), S(O, B), S(C, A), S(C, B), ang(O, A, B, '104°', 0.45), ang(C, A, B, 'a°', 0.55), Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(C, 'C', 'n')], 'A circle with centre O; angle AOB at the centre is 104 degrees and angle ACB at the circumference is a', 44, true);
      })()}
      ${steps(
        `<p><strong>Both angles stand on the same arc AB.</strong> Circle theorem 1: the angle at the centre is twice the angle at the circumference.</p>
         ${sum('2a = 104')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('a = 52')}
         ${ans('52')}`
      )}
      <p><strong>Reflex angle at the centre:</strong> if the point on the circle is on the small (minor) arc, the angle at the centre it uses is the reflex one. A reflex centre angle of 244° gives an angle at the circumference of 244 ÷ 2 = 122°.</p>
      ${tip('Check the arms: both angles must end at the same two points A and B. Then centre = 2 × circumference, or circumference = centre ÷ 2.')}`,

    // method: Example 13b, 2G (angle in a semicircle is 90°, then angle sum)
    // y10-2G Q2, Q3, Q7b, Q7c: angle in a semicircle
    'y10-2g-semicircle': `
      <p class="hp-tag">Worked example: AC is a diameter. Find a.</p>
      ${(() => {
        const A = on(180), C = on(0), B = on(76);
        return circ([S(A, C), S(A, B), S(B, C), rt(B, A, C), ang(C, A, B, '52°', 0.55), ang(A, B, C, 'a°', 0.6), Pt(A, 'A', 'w'), Pt(B, 'B', 'n'), Pt(C, 'C', 'e')], 'A circle with diameter AC and point B on the circle; angle ACB is 52 degrees and angle BAC is a', 44, true);
      })()}
      ${steps(
        `<p><strong>AC is a diameter,</strong> so ∠ABC is an angle in a semicircle (circle theorem 2).</p>
         ${sum('∠ABC = 90°')}`,
        `<p><strong>Angle sum of triangle ABC.</strong></p>
         ${sum('a + 90 + 52 = 180<br>a = 38')}
         ${ans('38')}`
      )}
      ${tip('Look for a line through O from one side of the circle to the other. Any triangle drawn on it with its third corner on the circle has a right angle at that corner.')}`,

    // method: Example 14, 2G (isosceles triangle with radii, then circle theorem 1)
    // y10-2G Q5, Q6: combining circle theorems with other facts
    'y10-2g-combine': `
      <p class="hp-tag">Worked example: O is the centre and ∠OAB = 35°. Find ∠ACB.</p>
      ${(() => {
        const A = on(215), B = on(325), C = on(100);
        return circ([poly([O, A, B]), S(C, A), S(C, B), ang(A, B, O, '35°', 0.6), ang(C, A, B, '', 0.5), Pt(A, 'A', 'sw'), Pt(B, 'B', 'se'), Pt(C, 'C', 'n')], 'A circle with centre O, triangle OAB with angle OAB 35 degrees, and point C on the circle', 44, true);
      })()}
      ${steps(
        `<p><strong>ΔAOB is isosceles</strong> (OA and OB are radii), so ∠OBA = 35° too.</p>
         ${sum('∠AOB = 180° − 2 × 35° = 110°')}`,
        `<p><strong>Circle theorem 1:</strong> the angle at the circumference is half the angle at the centre on the same arc.</p>
         ${sum('∠ACB = 110° ÷ 2 = 55°')}
         ${ans('55')}`
      )}
      ${tip('Radii make isosceles triangles. Diameters make right angles. Go one fact at a time and write each new angle on the diagram.')}`,

    // method: Key ideas, 2G (circle theorem 1 with letters, including the reflex case)
    // y10-2G Q8, Q9, Q10: reasoning with letters
    'y10-2g-letters': `
      <p class="hp-tag">Worked example: the angle at the centre on arc AB is y° (less than 180°).</p>
      ${steps(
        `<p><strong>A point C on the major arc:</strong> the angle at C stands on the same arc, so it is half the centre angle.</p>
         ${sum('∠ACB = y/2')}`,
        `<p><strong>A point P on the minor arc</strong> uses the reflex angle at the centre.</p>
         ${sum('reflex ∠AOB = 360 − y<br>∠APB = (360 − y)/2 = 180 − y/2')}
         ${ans('y/2 and 180 − y/2')}`
      )}
      <p><strong>Acute or obtuse?</strong> Try some numbers in the expressions: y = 100 gives 50 and 130, and y = 160 gives 80 and 100. Then use the letters to decide whether that happens for every possible y.</p>
      <p><strong>Proofs with radii:</strong> each radius drawn to the circle makes an isosceles triangle, so mark its two equal base angles with the same letter and use the angle sum.</p>
      ${tip('Type expressions with letters and numbers, like 3a+b or 180-y/2. Simplify by collecting like terms.')}`,

    // =====================================================================
    // Year 10 2H Angle properties of circles: Theorems 3 and 4
    // =====================================================================
    // method: Example 15a, 2H (angles at the circumference on the same arc are equal)
    // y10-2H Q1: angles on the same arc
    'y10-2h-same-arc': `
      <p class="hp-tag">Worked example: find a.</p>
      ${(() => {
        const A = on(205), B = on(335), C = on(65), Dd = on(125);
        return circ([S(A, C), S(B, C), S(A, Dd), S(B, Dd), ang(C, A, B, '44°', 0.6), ang(Dd, A, B, 'a°', 0.6)], 'A circle with points A and B low down and points C and D near the top; angle ACB is 44 degrees and angle ADB is a', 44, false);
      })()}
      ${steps(
        `<p><strong>Find the arc each angle stands on.</strong> The arms of both angles end at the same two points, so both are subtended by the same arc.</p>`,
        `<p><strong>Circle theorem 3:</strong> angles at the circumference on the same arc are equal.</p>
         ${sum('a = 44')}
         ${ans('44')}`
      )}
      ${tip('Trace each angle\'s two arms out to the circle. If they land on the same pair of points, the angles are equal, even when the lines cross in the middle.')}`,

    // method: Example 15b, 2H (opposite angles of a cyclic quadrilateral add to 180°)
    // y10-2H Q2, Q5, Q7: cyclic quadrilaterals
    'y10-2h-cyclic': `
      <p class="hp-tag">Worked example: find a and b.</p>
      ${(() => {
        const P = [on(100), on(200), on(290), on(20)], c = [0, 0];
        return circ([poly(P), ang(P[0], P[3], P[1], '118°', 0.45), ang(P[2], P[1], P[3], 'a°', 0.45), ang(P[1], P[0], P[2], '107°', 0.45), ang(P[3], P[2], P[0], 'b°', 0.45)], 'A cyclic quadrilateral with angles 118 degrees, 107 degrees, a and b; a is opposite 118 and b is opposite 107', 44, false);
      })()}
      ${steps(
        `<p><strong>All four corners are on the circle,</strong> so it is a cyclic quadrilateral. Circle theorem 4: opposite angles add to 180°.</p>`,
        `<p><strong>Pair each unknown with the angle opposite it.</strong></p>
         ${sum('a + 118 = 180, so a = 62<br>b + 107 = 180, so b = 73')}
         ${ans('a = 62, b = 73')}`
      )}
      <p><strong>A side extended:</strong> the exterior angle makes 180° with the interior angle beside it. If the exterior angle is 79°, that interior angle is 101°, and the opposite interior angle is 180 − 101 = 79°. So the exterior angle equals the opposite interior angle.</p>
      <p><strong>Parallel sides too?</strong> Co-interior angles between them add to 180° as well.</p>
      ${tip('Opposite means across the shape, not next to each other. Check all four angles add to 360°.')}`,

    // method: Example 15a, 2H (theorem 3) then the angle sum of a triangle (Key ideas 2A)
    // y10-2H Q3, Q4: same-arc angles inside triangles
    'y10-2h-combine': `
      <p class="hp-tag">Worked example: chords AC and BD cross at P. ∠BAC = 35° and ∠DPC = 100°. Find x = ∠DCA.</p>
      ${(() => {
        const A = on(150), B = on(220), C = on(320), Dd = on(40), Pp = cross(A, C, B, Dd);
        return circ([S(A, C), S(B, Dd), S(A, B), S(Dd, C), ang(A, B, C, '35°', 0.6), ang(Pp, Dd, C, '100°', 0.35), ang(C, Dd, A, 'x°', 0.55),
          Pt(A, 'A', 'nw'), Pt(B, 'B', 'sw'), Pt(C, 'C', 'se'), Pt(Dd, 'D', 'ne'), Pt(Pp, 'P', 's')], 'Chords AC and BD crossing at P inside a circle, with angle BAC 35 degrees, angle DPC 100 degrees and angle DCA x', 44, false);
      })()}
      ${steps(
        `<p><strong>Circle theorem 3:</strong> ∠BAC and ∠BDC both stand on arc BC.</p>
         ${sum('∠BDC = 35°')}`,
        `<p><strong>Angle sum of ΔPDC.</strong></p>
         ${sum('x = 180 − 100 − 35 = 45')}
         ${ans('45')}`
      )}
      ${tip('Where two chords cross, vertically opposite angles are equal too. Mark every equal angle you find before you use the angle sum.')}`,

    // method: Key ideas, 2H (theorems 3 and 4 with letters); the sine rule step uses the formula given in the question
    // y10-2H Q6, Q8: reasoning and the enrichment formula
    'y10-2h-reason': `
      <p class="hp-tag">Worked example 1: ABCD is a cyclic quadrilateral with ∠ABC = m°.</p>
      ${steps(
        `<p><strong>The opposite angle:</strong> theorem 4.</p>
         ${sum('∠ADC = 180 − m')}`,
        `<p><strong>The exterior angle at D</strong> makes 180° with ∠ADC.</p>
         ${sum('180 − (180 − m) = m')}
         ${ans('180 − m and m')}`
      )}
      <p class="hp-tag">Worked example 2: use sin P = a/(2r) with a = 12 cm and ∠P = 50°. Find r to two decimal places.</p>
      ${sum('2r = a ÷ sin P = 12 ÷ sin 50° = 15.665...<br>r = 7.832... ≈ 7.83')}
      ${tip('An angle that stands on a diameter is 90°. Angles on the same arc are equal, so one angle can be swapped for another to use a rule.')}`,

    // =====================================================================
    // Year 10 2I Theorems involving circles and tangents
    // =====================================================================
    // method: Example 16a, 2I (tangent ⊥ radius, then angle sum)
    // y10-2I Q1, Q6: tangent and radius
    'y10-2i-radius': `
      <p class="hp-tag">Worked example: AB is a tangent at A and O is the centre. Find a.</p>
      ${(() => {
        const A = [0, -2], B = [2 / tn(52), -2];
        return circ([S([-1.6, -2], [B[0] + 0.8, -2]), S(O, A), S(O, B), rt(A, B, O), ang(B, O, A, '52°', 0.55), ang(O, A, B, 'a°', 0.45), Pt(A, 'A', 's'), Pt(B, 'B', 's')], 'A circle with centre O, tangent AB at A, angle OBA 52 degrees and angle AOB a', 44, true);
      })()}
      ${steps(
        `<p><strong>A tangent is perpendicular to the radius at the point of contact.</strong></p>
         ${sum('∠OAB = 90°')}`,
        `<p><strong>Angle sum of the triangle.</strong></p>
         ${sum('a + 90 + 52 = 180<br>a = 38')}
         ${ans('38')}`
      )}
      ${tip('Draw the radius to the point of contact if it is not there. Two radii in the same triangle make it isosceles as well.')}`,

    // method: Example 16b, 2I (two right angles, revolution, quadrilateral angle sum) and Key ideas (equal tangents)
    // y10-2I Q2, Q5, Q7b, Q8, Q9, Q12, Q13: two tangents from one point
    'y10-2i-tangents': `
      <p class="hp-tag">Worked example: PA and PB are tangents and the reflex angle AOB is 230°. Find a.</p>
      ${(() => {
        const A = on(65), B = on(-65), P = [2 / cs(65), 0];
        return circ([S(O, A), S(O, B), S(A, P), S(B, P), rt(A, O, P), rt(B, O, P), ang(O, A, B, '230°', 0.4, true), ang(P, A, B, 'a°', 0.6), Pt(A, 'A', 'n'), Pt(B, 'B', 's'), Pt(P, 'P', 'e')], 'Tangents PA and PB to a circle with centre O; reflex angle AOB is 230 degrees and angle APB is a', 36, true, 'e');
      })()}
      ${steps(
        `<p><strong>Right angles where the radii meet the tangents.</strong></p>
         ${sum('∠PAO = ∠PBO = 90°')}`,
        `<p><strong>The angle inside the quadrilateral at O:</strong> angles in a revolution add to 360°.</p>
         ${sum('obtuse ∠AOB = 360° − 230° = 130°')}`,
        `<p><strong>Angles in a quadrilateral add to 360°.</strong></p>
         ${sum('a + 90 + 90 + 130 = 360<br>a = 50')}
         ${ans('50')}`
      )}
      <p><strong>Equal tangents:</strong> two tangents from the same point are equal, so if PA = 9.7 cm then PB = 9.7 cm. That makes ΔPAB isosceles: with 36° at P, each base angle is (180 − 36) ÷ 2 = 72°. A circle inside a triangle works the same way: from each corner, the two tangent lengths are equal.</p>
      ${tip('A tangent length runs from the outside point to the point of contact. When several tangents are involved, chain the equal pieces together one corner at a time.')}`,

    // method: Example 17, 2I (alternate segment theorem)
    // y10-2I Q3, Q4, Q7a, Q10: the alternate segment theorem
    'y10-2i-alt-seg': `
      <p class="hp-tag">Worked example: XY is a tangent at P. ∠BAP = 44° and ∠ABP = 77°. Find ∠BPX, ∠APY and ∠APB.</p>
      ${(() => {
        const P = on(270), A = on(116), B = on(358), X = [2.6, -2], Y = [-2.6, -2];
        return circ([S(X, Y), poly([A, B, P]), ang(A, B, P, '44°', 0.6), ang(B, P, A, '77°', 0.55), ang(P, X, B, '', 0.5), ang(P, A, Y, '', 0.6),
          Pt(A, 'A', 'nw'), Pt(B, 'B', 'e'), Pt(P, 'P', 's'), Pt(X, 'X', 'e'), Pt(Y, 'Y', 'w')], 'A circle with tangent XY at P and triangle ABP inside; angle BAP 44 degrees and angle ABP 77 degrees', 44, false);
      })()}
      ${steps(
        `<p><strong>Alternate segment theorem:</strong> the angle between the tangent and a chord equals the angle in the other (alternate) segment.</p>
         ${sum('∠BPX = ∠BAP = 44°<br>∠APY = ∠ABP = 77°')}`,
        `<p><strong>The angle in the middle:</strong> angles on the straight line XY add to 180°.</p>
         ${sum('∠APB = 180 − 44 − 77 = 59')}
         ${ans('44, 77, 59')}`
      )}
      ${tip('The chord PB and the tangent make an angle. The matching angle is at the far corner A, the corner not on that chord.')}`,

    // =====================================================================
    // Year 10 2J Intersecting chords, secants and tangents
    // =====================================================================
    // method: Example 18a, 2J (equate the products of the parts of each chord)
    // y10-2J Q1: intersecting chords
    'y10-2j-chords': `
      <p class="hp-tag">Worked example: find x.</p>
      ${(() => {
        const A = on(150), C = on(330), B = on(215), Dd = on(25), Pp = cross(A, C, B, Dd);
        return circ([S(A, C), S(B, Dd), Pt(Pp, '', 'n'), side(A, Pp, '2', [0, -3]), side(Pp, C, '9', [0, 3]), side(B, Pp, 'x', [0, 3]), side(Pp, Dd, '5', [0, -3])], 'Two chords crossing inside a circle: one is cut into 2 and 9, the other into x and 5', 44, false);
      })()}
      ${steps(
        `<p><strong>Multiply the two parts of each chord and set them equal.</strong></p>
         ${sum('x × 5 = 2 × 9')}`,
        `<p><strong>Solve.</strong></p>
         ${sum('5x = 18<br>x = 18/5 = 3.6')}
         ${ans('3.6')}`
      )}
      ${tip('Each product uses the two pieces of one chord, from the crossing point out to the circle.')}`,

    // method: Example 18b, 2J (outside part × whole secant for each secant, then solve)
    // y10-2J Q2, Q8: two secants from a point
    'y10-2j-secants': `
      <p class="hp-tag">Worked example: find x.</p>
      ${(() => {
        const P = [5.2, 0], h1 = hits(P, 168), h2 = hits(P, 196);
        return circ([S(P, h1[1]), S(P, h2[1]), Pt(P, 'P', 'e'), side(P, h1[0], '4', [5, -3], 0.25), side(h1[0], h1[1], 'x', [0, -3], 0.25), side(P, h2[0], '6', [5, 3], 0.25), side(h2[0], h2[1], '8', [0, 3], 0.25)], 'Two secants from P: one has outside part 4 and inside part x, the other has outside part 6 and inside part 8', 40, false);
      })()}
      ${steps(
        `<p><strong>For each secant: outside part × whole length.</strong> The whole length of the second secant is 6 + 8 = 14.</p>
         ${sum('4 × (x + 4) = 6 × 14')}`,
        `<p><strong>Expand and solve.</strong></p>
         ${sum('4x + 16 = 84<br>4x = 68<br>x = 17')}
         ${ans('17')}`
      )}
      ${tip('Do not multiply the two pieces of a secant together. It is always the outside piece times the whole line.')}`,

    // method: Example 18c, 2J (square the tangent, equate with outside part × whole secant)
    // y10-2J Q3, Q4, Q7: a tangent and a secant
    'y10-2j-tangent': `
      <p class="hp-tag">Worked example: the tangent from P is 10 cm. The secant from P has outside part 4 cm and inside part x cm. Find x.</p>
      ${(() => {
        const P = [4.6, 0], T = on(Math.acos(2 / 4.6) * 180 / Math.PI), h = hits(P, 192);
        return circ([S(P, T), S(P, h[1]), Pt(P, 'P', 'e'), side(P, T, '10', [0, 0], 0.25), side(P, h[0], '4', [4, 3], 0.25), side(h[0], h[1], 'x', [0, 3], 0.25)], 'From P, a tangent of 10 and a secant with outside part 4 and inside part x', 40, false);
      })()}
      ${steps(
        `<p><strong>Tangent squared = outside part × whole secant.</strong></p>
         ${sum('4 × (x + 4) = 10²')}`,
        `<p><strong>Expand and solve.</strong></p>
         ${sum('4x + 16 = 100<br>4x = 84<br>x = 21')}
         ${ans('21')}`
      )}
      <p><strong>The tangent is the unknown?</strong> Outside part 2 and inside part 12 give x² = 2 × 14 = 28, so x = √28 = 2√7 (type 2sqrt7).</p>
      ${tip('Two tangents from the same point to two circles that share a secant line are equal, because both squared equal the same product.')}`,

    // method: Example 18, 2J (write the product rule, then solve the equation it gives)
    // y10-2J Q5, Q6: harder equations from the rules
    'y10-2j-equation': `
      <p class="hp-tag">Worked example: a secant from P has outside part x and inside part 5. Another has outside part 6 and inside part 8. Find x.</p>
      ${steps(
        `<p><strong>Write the rule.</strong> The whole first secant is x + 5.</p>
         ${sum('x(x + 5) = 6 × 14<br>x² + 5x = 84<br>x² + 5x − 84 = 0')}`,
        `<p><strong>Factorise and solve.</strong> A length must be positive.</p>
         ${sum('(x + 12)(x − 7) = 0<br>x = −12 or x = 7')}
         ${ans('7')}`
      )}
      <p><strong>Exact answers:</strong> 3x = 2 × 7 gives x = 14/3 (type the fraction). A tangent of length x + 1 with outside part 4 and whole secant 12 gives (x + 1)² = 48, so x + 1 = √48 = 4√3 and x = 4√3 − 1 (type 4sqrt3-1).</p>
      ${tip('Write the rule first with the expressions in brackets, then expand. Leave surds exact when the question says exact.')}`,

    // method: Key ideas 2J and 2E (similar triangles, AAA) and Pythagoras for the touching circles
    // y10-2J Q9, Q11, Q12: why the rules work
    'y10-2j-reason': `
      <p class="hp-tag">Worked example 1: why does the secant rule work? Secants PAB and PDC are drawn from P.</p>
      ${steps(
        `<p><strong>Find two similar triangles:</strong> ΔPAD and ΔPCB. ∠P is common, and ∠PDA = ∠PBC because ABCD is a cyclic quadrilateral (an exterior angle equals the opposite interior angle). So they are similar by AAA.</p>`,
        `<p><strong>Ratios of matching sides,</strong> then cross multiply.</p>
         ${sum('PA/PC = PD/PB<br>PA × PB = PD × PC')}`
      )}
      <p class="hp-tag">Worked example 2: two wheels of radius 9 and 4 touch each other on flat ground. Find the horizontal distance d between their centres.</p>
      ${sum('distance between centres = 9 + 4 = 13<br>difference in heights = 9 − 4 = 5<br>d² + 5² = 13²<br>d² = 169 − 25 = 144<br>d = 12')}
      ${ans('12')}
      ${tip('Angles in the same segment and the alternate segment theorem give the equal angles in these proofs. Check a letters rule with numbers: here 2 × √(9 × 4) = 12 too.')}`,

    // =====================================================================
    // Year 10 2K Introduction to networks
    // =====================================================================
    // method: Example 19, 2K (count vertices and edges, degree = edges at a vertex, add the degrees)
    // y10-2K Q1, Q2, Q3, Q4, Q6, Q10: vertices, edges and degrees
    'y10-2k-degree': `
      <p class="hp-tag">Worked example: for this graph, find the number of vertices and edges, each degree, the sum of degrees, and the odd and even vertices.</p>
      ${net({ A: [0, 1.6], B: [2, 2.4], C: [4, 1.6], D: [1.6, 0], E: [3.6, -0.4] }, ['AB', 'AD', 'BC', 'BD', 'CD', 'CE', 'DE'], 'A graph with vertices A to E and edges AB, AD, BC, BD, CD, CE and DE')}
      ${steps(
        `<p><strong>Count.</strong> Vertices: A, B, C, D, E, so 5. Edges: AB, AD, BC, BD, CD, CE, DE, so 7.</p>`,
        `<p><strong>Degree = the number of edges at a vertex.</strong></p>
         ${sum('A: 2 &nbsp; B: 3 &nbsp; C: 3 &nbsp; D: 4 &nbsp; E: 2<br>sum of degrees = 2 + 3 + 3 + 4 + 2 = 14')}`,
        `<p><strong>Odd or even degree.</strong></p>
         ${sum('odd: B, C &nbsp;&nbsp; even: A, D, E')}
         ${ans('5, 7, sum 14; odd B, C; even A, D, E')}`
      )}
      <p><strong>A check:</strong> each edge has two ends, so the sum of degrees is always twice the number of edges: 2 × 7 = 14.</p>
      ${tip('Type lists of letters with commas, like B, C. Tick each edge as you count it so none is missed or counted twice.')}`,

    // method: Example 20, 2K (list every walk without repeating a vertex or edge)
    // y10-2K Q5, Q8, Q13: counting walks
    'y10-2k-walks': `
      <p class="hp-tag">Worked example: without visiting a vertex more than once or using an edge more than once, how many walks go from A to D?</p>
      ${net({ A: [0, 1], B: [1.8, 2], C: [1.8, 0], D: [3.6, 2], E: [3.6, 0] }, ['AB', 'AC', 'BC', 'BD', 'CE', 'DE'], 'A graph with edges AB, AC, BC, BD, CE and DE')}
      ${steps(
        `<p><strong>Start with each first move from A,</strong> and follow every choice until you reach D or get stuck.</p>
         ${sum('Through B first: A - B - D, &nbsp;A - B - C - E - D<br>Through C first: A - C - E - D, &nbsp;A - C - B - D')}`,
        `<p><strong>Count the list.</strong></p>
         ${ans('4')}`
      )}
      <p><strong>Tours that come back to the start:</strong> list them the same way, then cross out any that are the same loop in reverse, because a tour and its reverse count once.</p>
      ${tip('Work in order (all walks starting A - B, then all starting A - C) so you cannot miss one.')}`,

    // method: no worked example in the book (2K); plainest method: draw the graph and trace it, counting edges in and out
    // y10-2K Q7, Q9, Q11: can you use every edge once?
    'y10-2k-trace': `
      <p class="hp-tag">Worked example: an island I in a lake is joined to the west shore W by 2 bridges and to the east shore E by 2 bridges. Each bridge must be crossed exactly once.</p>
      ${net({ W: [0, 0], I: [2.4, 0], E: [4.8, 0] }, [['WI', '', 0.5], ['WI', '', -0.5], ['IE', '', 0.5], ['IE', '', -0.5]], 'Three vertices W, I and E, with two edges between W and I and two edges between I and E')}
      ${steps(
        `<p><strong>Make a graph:</strong> each piece of land is a vertex and each bridge is an edge.</p>`,
        `<p><strong>Try to trace it.</strong> Start and finish on the island:</p>
         ${sum('I - W - I - E - I &nbsp;uses all 4 bridges once')}
         ${ans('Yes')}`,
        `<p><strong>Start on W and finish on I?</strong> Leave W on one bridge. The only way to use W's other bridge is to come back in on it, and then you are stuck on W with no bridge left to leave by. So you must finish on W.</p>
         ${ans('No')}`
      )}
      ${tip('Every time you pass through a vertex you use one edge in and one edge out. Use that to see where a walk can start and finish.')}`,

    // method: no worked example in the book (2K); plainest method: remove edges that are part of a loop until no loop is left
    // y10-2K Q12: removing edges but staying connected
    'y10-2k-remove': `
      <p class="hp-tag">Worked example: how many edges can be removed so that every vertex is still connected to the graph?</p>
      ${net({ A: [0, 0], B: [2.4, 0], C: [3.2, 1.8], D: [1.2, 3], E: [-0.8, 1.8] }, ['AB', 'BC', 'CD', 'DE', 'EA', 'AC', 'AD', 'BD'], 'A pentagon ABCDE with extra edges AC, AD and BD')}
      ${steps(
        `<p><strong>An edge can go if it is part of a loop:</strong> the vertices it joins stay connected the other way round the loop. Remove one at a time, such as AC, then AD, then BD, then CD.</p>`,
        `<p><strong>Stop when there are no loops left.</strong> A, B, C, D, E are still joined by AB, BC, DE and EA. That is 4 edges, one fewer than the 5 vertices.</p>
         ${sum('8 − 4 = 4 edges removed')}
         ${ans('4')}`
      )}
      ${tip('With no loops, a connected graph always has one fewer edge than it has vertices. So removed = edges − (vertices − 1).')}`,

    // =====================================================================
    // Year 10 2L Isomorphic and planar graphs
    // =====================================================================
    // method: Example 21, 2L (same vertices, edges and connections)
    // y10-2L Q1, Q5, Q6: isomorphic graphs
    'y10-2l-iso': `
      <p class="hp-tag">Worked example: are these two graphs isomorphic?</p>
      ${net({ A: [0, 0], B: [2, 0], C: [2, 2], D: [0, 2], E: [1, 3] }, ['AB', 'BC', 'CD', 'DA', 'CE', 'DE'], 'Graph 1: a square ABCD with a roof point E joined to C and D')}
      ${net({ E: [1.2, 0], C: [0, 1.2], D: [2.4, 1.2], B: [0, 2.8], A: [2.4, 2.8] }, ['AB', 'BC', 'CD', 'DA', 'CE', 'DE'], 'Graph 2: E at the bottom joined to C and D, C joined to B and D, D joined to A, and A joined to B')}
      ${steps(
        `<p><strong>Count vertices and edges.</strong> Both have 5 vertices and 6 edges.</p>`,
        `<p><strong>Compare the degrees.</strong> Both: A 2, B 2, C 3, D 3, E 2.</p>`,
        `<p><strong>Check the connections.</strong> In both, E is joined to C and D, C is joined to B and D, and A is joined to B and D. Everything matches, so Graph 2 is just Graph 1 turned upside down.</p>
         ${ans('Yes')}`
      )}
      ${tip('If the number of vertices, the number of edges or the list of degrees is different, stop: the graphs are not isomorphic.')}`,

    // method: Example 22, 2L (try to redraw with no edges crossing)
    // y10-2L Q2, Q7: planar or non-planar?
    'y10-2l-planar': `
      <p class="hp-tag">Worked example: is this graph planar?</p>
      ${net({ A: [0, 0], B: [2.2, 0], C: [2.8, 1.8], D: [1.1, 3], E: [-0.6, 1.8] }, ['AB', 'BC', 'CD', 'DE', 'EA', 'AC', 'BD'], 'A pentagon ABCDE with diagonals AC and BD crossing inside it')}
      ${steps(
        `<p><strong>Find the crossing.</strong> AC and BD cross, and the crossing is not a vertex.</p>`,
        `<p><strong>Redraw one edge another way.</strong> Take AC round the outside of the pentagon, past B, instead of through the middle. Every vertex and connection stays the same, and now nothing crosses.</p>
         ${net({ A: [0, 0], B: [2.2, 0], C: [2.8, 1.8], D: [1.1, 3], E: [-0.6, 1.8] }, ['AB', 'BC', 'CD', 'DE', 'EA', ['AC', '', -2.4], 'BD'], 'The same graph redrawn with AC curving around the outside past B, so no edges cross')}
         ${ans('Planar')}`
      )}
      ${tip('Planar means it CAN be drawn without crossings, not that it already is. Try moving a vertex or sending an edge around the outside before you decide it is non-planar.')}`,

    // method: Example 23, 2L (count v, e, f including the outside face, then v - e + f = 2)
    // y10-2L Q3, Q4, Q8, Q9, Q10, Q11: Euler's formula
    'y10-2l-euler': `
      <p class="hp-tag">Worked example: count v, e and f for this planar graph and check Euler's formula.</p>
      ${net({ A: [0, 0], B: [2, 0], C: [2, 2], D: [0, 2], E: [1, 3.2] }, ['AB', 'BC', 'CD', 'DA', 'AC', 'DE', 'CE', ['AE', '', 1.4]], 'A square ABCD with diagonal AC, a roof point E joined to C and D, and a curved edge from A round to E')}
      ${steps(
        `<p><strong>Count.</strong> Faces are the regions, and the outside counts too.</p>
         ${sum('v = 5 &nbsp; e = 8 &nbsp; f = 5 (ABC, ACD, CDE, ADE, outside)')}`,
        `<p><strong>Substitute into v − e + f.</strong></p>
         ${sum('5 − 8 + 5 = 2 ✓')}
         ${ans('2')}`
      )}
      <p><strong>Finding a missing number:</strong> v = 6 and f = 7. Then 6 − e + 7 = 2, so 13 − e = 2 and e = 11.</p>
      <p><strong>Solids:</strong> count the corners (v), edges (e) and flat faces (f). A pentagonal prism has v = 10, e = 15, f = 7, and 10 − 15 + 7 = 2.</p>
      ${tip('Mark each face with a dot as you count it, and do not forget the outside face.')}`,

    // method: the rule given in the question, with fractions added using a common denominator
    // y10-2L Q12: the Platonic solid rule
    'y10-2l-platonic': `
      <p class="hp-tag">Worked example: an icosahedron has 20 triangular faces, 30 edges, and 5 edges meet at each vertex. Check 1/n + 1/d = 1/2 + 1/e.</p>
      ${steps(
        `<p><strong>Read off the values.</strong> Each face has n = 3 sides, d = 5 edges meet at each vertex, and e = 30.</p>`,
        `<p><strong>Left side:</strong></p>
         ${sum('1/3 + 1/5 = 5/15 + 3/15 = 8/15')}`,
        `<p><strong>Right side:</strong></p>
         ${sum('1/2 + 1/30 = 15/30 + 1/30 = 16/30 = 8/15 ✓')}
         ${ans('8/15')}`
      )}
      ${tip('The rule needs every face to be the same regular shape, so that n has a single value. Type fractions like 8/15.')}`,

    // =====================================================================
    // Year 10 2M Trails, paths and Eulerian circuits
    // =====================================================================
    // method: Example 24, 2M (check repeated edges and vertices, and whether it ends where it started)
    // y10-2M Q1, Q2, Q10: walks, trails, paths, circuits and cycles
    'y10-2m-walks': `
      <p class="hp-tag">Worked example: name each walk in this graph.</p>
      ${net({ A: [0, 0], B: [2.2, 0], C: [2.8, 1.8], D: [1.1, 3], E: [-0.6, 1.8] }, ['AB', 'BC', 'CA', 'CD', 'DE', 'EA', 'AD'], 'A graph with edges AB, BC, CA, CD, DE, EA and AD')}
      ${steps(
        `<p><strong>A - B - C - A - E:</strong> no edge repeats, so it is a trail. A is visited twice, so it is not a path.</p>
         ${ans('Trail')}`,
        `<p><strong>A - B - C - A - D - E - A:</strong> no edge repeats and it ends where it began, so it is a circuit. A is visited in the middle too, so it is not a cycle.</p>
         ${ans('Circuit, not a cycle')}`,
        `<p><strong>C - D - E - A - C:</strong> no edge or vertex repeats (apart from finishing at the start), so it is a cycle.</p>
         ${ans('Cycle')}`
      )}
      ${chips(['walk: any route'], ['trail: no repeated edges'], ['path: no repeated vertices or edges'], ['circuit: a trail back to the start'], ['cycle: a path back to the start'])}
      ${tip('Write down each edge as a pair (AB, BC, ...) and look for a repeat, then look for a repeated letter.')}`,

    // method: Example 25, 2M (count the vertices of odd degree: 0 or 2 means an Eulerian trail)
    // y10-2M Q3, Q4, Q8, Q9, Q11, Q12: Eulerian trails and circuits
    'y10-2m-euler': `
      <p class="hp-tag">Worked example: does this graph have an Eulerian trail? If so, are the trails circuits?</p>
      ${net({ A: [0, 0], B: [2.2, 0], C: [2.8, 1.8], D: [1.1, 3], E: [-0.6, 1.8] }, ['AB', 'BC', 'CA', 'CD', 'DE', 'EA', 'AD'], 'A graph with edges AB, BC, CA, CD, DE, EA and AD')}
      ${steps(
        `<p><strong>Find each degree.</strong></p>
         ${sum('A: 4 &nbsp; B: 2 &nbsp; C: 3 &nbsp; D: 3 &nbsp; E: 2')}`,
        `<p><strong>Count the odd vertices.</strong> Two (C and D), so an Eulerian trail exists. It must start at one odd vertex and end at the other, so it is not a circuit.</p>
         ${sum('C - A - B - C - D - A - E - D')}
         ${ans('Eulerian trails, but they are not circuits')}`
      )}
      ${fig({ kind: 'table', rows: [['Odd vertices', 'Eulerian trail?'], ['0', 'yes, and every one is a circuit'], ['2', 'yes, from one odd vertex to the other'], ['4 or more', 'no']] })}
      <p><strong>Making a circuit possible:</strong> an extra edge between two odd vertices makes both of them even.</p>
      ${tip('Check your trail uses every edge exactly once by ticking edges off as you go.')}`,

    // method: no worked example in the book (2M); plainest method: list the routes branch by branch
    // y10-2M Q5, Q6, Q7: counting trails and routes
    'y10-2m-count': `
      <p class="hp-tag">Worked example: triangle ABC has an extra edge CD. How many Eulerian trails start at D?</p>
      ${net({ A: [0, 0], B: [2, 0], C: [1, 1.7], D: [2.6, 2.6] }, ['AB', 'BC', 'CA', 'CD'], 'A triangle ABC with an extra edge from C to D')}
      ${steps(
        `<p><strong>Degrees:</strong> A 2, B 2, C 3, D 1. The odd vertices are C and D, so a trail starting at D ends at C.</p>`,
        `<p><strong>Branch at every choice.</strong> From D the only edge goes to C. At C there are two choices.</p>
         ${sum('D - C - A - B - C<br>D - C - B - A - C')}
         ${ans('2')}`
      )}
      <p><strong>Routes that visit every vertex once:</strong> list them the same way, branching at each choice, and cross out a route that is just another one in reverse if the question says so.</p>
      ${tip('Draw a little tree: one branch for each edge you could take next. Each finished branch is one trail.')}`,

    // =====================================================================
    // Year 10 2N Shortest path problems
    // =====================================================================
    // method: Example 26, 2N (add the distances along the route in order)
    // y10-2N Q1, Q2, Q3, Q8: the length of a route
    'y10-2n-distance': `
      <p class="hp-tag">Worked example: distances are in kilometres.</p>
      ${net({ A: [0, 1], B: [2, 2.4], C: [4.4, 2], D: [2, 0], E: [5.4, 0] }, [['AB', '5'], ['BC', '7'], ['AD', '4'], ['DC', '6'], ['BD', '3'], ['CE', '4'], ['DE', '12']], 'A weighted graph: AB 5, BC 7, AD 4, DC 6, BD 3, CE 4, DE 12', 50)}
      ${steps(
        `<p><strong>From A to C via D:</strong> add the two edges used.</p>
         ${sum('4 + 6 = 10 km')}`,
        `<p><strong>The path A - B - D - E:</strong> add every edge in order.</p>
         ${sum('5 + 3 + 12 = 20 km')}
         ${ans('10 and 20')}`
      )}
      ${tip('Point to each edge as you add it, so you use the right number between each pair of letters.')}`,

    // method: Example 27, 2N (list the possible routes and their lengths, then pick the smallest)
    // y10-2N Q4, Q5, Q6, Q7, Q9: shortest paths
    'y10-2n-shortest': `
      <p class="hp-tag">Worked example: find the shortest distance from A to E. Distances are in kilometres.</p>
      ${net({ A: [0, 1], B: [2, 2.4], C: [4.4, 2], D: [2, 0], E: [5.4, 0] }, [['AB', '5'], ['BC', '7'], ['AD', '4'], ['DC', '6'], ['BD', '3'], ['CE', '4'], ['DE', '12']], 'A weighted graph: AB 5, BC 7, AD 4, DC 6, BD 3, CE 4, DE 12', 50)}
      ${steps(
        `<p><strong>List sensible routes and add each one.</strong></p>
         ${sum('A - D - E: 4 + 12 = 16<br>A - B - C - E: 5 + 7 + 4 = 16<br>A - D - C - E: 4 + 6 + 4 = 14<br>A - B - D - E: 5 + 3 + 12 = 20<br>A - D - B - C - E: 4 + 3 + 7 + 4 = 18')}`,
        `<p><strong>Pick the smallest.</strong></p>
         ${ans('14 (A - D - C - E)')}`
      )}
      <p><strong>A route that must pass a certain point:</strong> only list routes through that point, and check whether a detour reaches it more cheaply.</p>
      ${tip('The route with the fewest edges is not always the shortest. A long single edge (like DE = 12) can lose to two or three short ones.')}`,

    // method: Key ideas 2M (Eulerian trail uses every edge once) and Example 26, 2N (add the distances)
    // y10-2N Q10, Q11: Eulerian trails and Hamiltonian circuits
    'y10-2n-check': `
      <p class="hp-tag">Worked example: using the same graph, decide what each walk is and find its length.</p>
      ${net({ A: [0, 1], B: [2, 2.4], C: [4.4, 2], D: [2, 0], E: [5.4, 0] }, [['AB', '5'], ['BC', '7'], ['AD', '4'], ['DC', '6'], ['BD', '3'], ['CE', '4'], ['DE', '12']], 'A weighted graph: AB 5, BC 7, AD 4, DC 6, BD 3, CE 4, DE 12', 50)}
      ${steps(
        `<p><strong>A - B - C - E - D - A:</strong> visits every vertex exactly once and returns to A, so it is a Hamiltonian circuit.</p>
         ${sum('5 + 7 + 4 + 12 + 4 = 32 km')}`,
        `<p><strong>A - B - D - A:</strong> returns to A but misses C and E, so it is not a Hamiltonian circuit.</p>`,
        `<p><strong>An Eulerian trail</strong> must use all 7 edges exactly once. A walk that misses an edge, or uses one twice, is not one. Because it uses every edge once, its length is the total of all the edges.</p>
         ${ans('Hamiltonian circuit, 32 km')}`
      )}
      ${tip('Hamiltonian: every vertex once. Eulerian: every edge once. Write the edges of the walk as pairs, then add their lengths.')}`
  });
})();
