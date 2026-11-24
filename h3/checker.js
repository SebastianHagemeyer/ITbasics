/* H3 answer checker, carried over unchanged from the claude.ai version
 * (apart from spelling the dash characters as escapes). Exposes the global
 * Checker that h3.js calls. */
// ===== Maths answer checker =====
// Marks a student's typed answer against a question object.
// Question types: numeric, expression, list, point, choice, text.
const Checker = (() => {
  const FUNCS = { sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    ln: Math.log, log: Math.log10, abs: Math.abs, exp: Math.exp, cbrt: Math.cbrt };
  const CONSTS = { pi: Math.PI, e: Math.E };

  function clean(s) {
    return String(s ?? '')
      .replace(/[\u2212\u2013\u2014]/g, '-')
      .replace(/[×·⋅]/g, '*').replace(/÷/g, '/')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt')
      .replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/\*\*/g, '^')
      .replace(/\$/g, '')
      .trim();
  }

  // ---- tokenizer ----
  function tokenize(src) {
    const s = src.toLowerCase();
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        // scientific notation 3e5 / 3e-5 (only if followed by digit)
        if (s[j] === 'e' && /[-+]?[0-9]/.test(s.slice(j + 1, j + 3)) && !/[a-z]/.test(s[j + 1] || '')) {
          let k = j + 1; if (s[k] === '-' || s[k] === '+') k++;
          while (k < s.length && /[0-9]/.test(s[k])) k++;
          j = k;
        }
        const txt = s.slice(i, j);
        if ((txt.match(/\./g) || []).length > 1) throw new Error('bad number');
        out.push({ t: 'num', v: parseFloat(txt), raw: txt });
        i = j; continue;
      }
      if (/[a-z]/.test(c)) {
        let j = i;
        while (j < s.length && /[a-z]/.test(s[j])) j++;
        let word = s.slice(i, j);
        // split word into known functions/constants and single-letter variables
        while (word.length) {
          const f = Object.keys(FUNCS).sort((a, b) => b.length - a.length).find(k => word.startsWith(k));
          if (f) { out.push({ t: 'fn', v: f }); word = word.slice(f.length); continue; }
          if (word.startsWith('pi')) { out.push({ t: 'const', v: 'pi' }); word = word.slice(2); continue; }
          out.push({ t: 'var', v: word[0] }); word = word.slice(1);
        }
        i = j; continue;
      }
      if ('+-*/^()'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
      if (c === '[' || c === '{') { out.push({ t: 'op', v: '(' }); i++; continue; }
      if (c === ']' || c === '}') { out.push({ t: 'op', v: ')' }); i++; continue; }
      throw new Error('unexpected ' + c);
    }
    // insert implicit multiplication
    const res = [];
    for (let k = 0; k < out.length; k++) {
      const a = res[res.length - 1], b = out[k];
      const aEnds = a && (a.t === 'num' || a.t === 'var' || a.t === 'const' || (a.t === 'op' && a.v === ')'));
      const bStarts = b.t === 'num' || b.t === 'var' || b.t === 'const' || b.t === 'fn' || (b.t === 'op' && b.v === '(');
      if (a && a.t === 'num' && b.t === 'num') throw new Error('two numbers in a row');
      if (aEnds && bStarts) res.push({ t: 'op', v: '*', implicit: true });
      res.push(b);
    }
    return res;
  }

  // ---- parser (precedence climbing) -> AST ----
  function parse(src) {
    const toks = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const isOp = (v) => peek() && peek().t === 'op' && peek().v === v;
    function expr() {
      let node = term();
      while (isOp('+') || isOp('-')) { const op = toks[p++].v; node = { k: op, a: node, b: term() }; }
      return node;
    }
    function term() {
      let node = unary();
      while (isOp('*') || isOp('/')) { const op = toks[p++].v; node = { k: op, a: node, b: unary() }; }
      return node;
    }
    function unary() {
      if (isOp('-')) { p++; return { k: 'neg', a: unary() }; }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (isOp('^')) { p++; return { k: '^', a: base, b: unary() }; }
      return base;
    }
    function primary() {
      const t = toks[p++];
      if (!t) throw new Error('unexpected end');
      if (t.t === 'num') return { k: 'num', v: t.v, raw: t.raw };
      if (t.t === 'var') return { k: 'var', v: t.v };
      if (t.t === 'const') return { k: 'const', v: t.v };
      if (t.t === 'fn') {
        // sqrt2 or sqrt(2) or sqrt x
        let arg;
        if (isOp('(')) { p++; arg = expr(); if (!isOp(')')) throw new Error('missing )'); p++; }
        else arg = power();
        return { k: 'fn', f: t.v, a: arg };
      }
      if (t.t === 'op' && t.v === '(') {
        const e = expr();
        if (!isOp(')')) throw new Error('missing )');
        p++;
        return { k: 'paren', a: e };
      }
      throw new Error('unexpected ' + t.v);
    }
    const tree = expr();
    if (p < toks.length) throw new Error('unexpected ' + toks[p].v);
    return tree;
  }

  function evaluate(n, vars) {
    switch (n.k) {
      case 'num': return n.v;
      case 'var': return vars[n.v] ?? (n.v === 'e' ? Math.E : NaN);
      case 'const': return CONSTS[n.v];
      case 'paren': return evaluate(n.a, vars);
      case 'neg': return -evaluate(n.a, vars);
      case 'fn': return FUNCS[n.f](evaluate(n.a, vars));
      case '+': return evaluate(n.a, vars) + evaluate(n.b, vars);
      case '-': return evaluate(n.a, vars) - evaluate(n.b, vars);
      case '*': return evaluate(n.a, vars) * evaluate(n.b, vars);
      case '/': return evaluate(n.a, vars) / evaluate(n.b, vars);
      case '^': return Math.pow(evaluate(n.a, vars), evaluate(n.b, vars));
    }
    return NaN;
  }

  function varsOf(n, set = new Set()) {
    if (!n) return set;
    if (n.k === 'var') set.add(n.v);
    if (n.a) varsOf(n.a, set);
    if (n.b) varsOf(n.b, set);
    return set;
  }

  const strip = (n) => (n && n.k === 'paren' ? strip(n.a) : n);
  const isSum = (n) => { n = strip(n); return n && (n.k === '+' || n.k === '-'); };

  // factorised: the whole thing is a product/power (optionally negated) with a bracketed sum in it
  function isFactored(n) {
    n = strip(n);
    if (n.k === 'neg') return isFactored(n.a);
    if (n.k === '^') return isSum(n.a);
    if (n.k === '*') {
      const parts = [];
      (function collect(x) { x = strip(x); if (x.k === '*') { collect(x.a); collect(x.b); } else parts.push(x); })(n);
      return parts.some(x => isSum(x) || (x.k === '^' && isSum(x.a)));
    }
    return false;
  }
  // How many bracketed-sum factors a product has, counting (x + 1)^2 as two. Used so
  // 3(x^2 - 4) is not taken as fully factorised when the key is 3(x - 2)(x + 2).
  function sumFactors(n) {
    n = strip(n);
    if (n.k === 'neg') return sumFactors(n.a);
    if (n.k === '^') return isSum(n.a) ? (strip(n.b).k === 'num' ? Math.max(1, Math.round(strip(n.b).v)) : 1) : 0;
    if (n.k === '*') return sumFactors(n.a) + sumFactors(n.b);
    return isSum(n) ? 1 : 0;
  }
  // expanded: no product or power has a sum as an operand
  function isExpanded(n) {
    if (!n) return true;
    if (n.k === '*' || n.k === '/') { if (isSum(n.a) || (n.k === '*' && isSum(n.b))) return false; }
    if (n.k === '^' && isSum(n.a)) return false;
    if (n.k === 'neg' && isSum(n.a)) return false;
    return isExpanded(n.a) && isExpanded(n.b);
  }

  // ---- numbers ----
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  // Turn a typed answer into a number. Handles 3/4, 1 1/2, 1,000, 50%, units, 3.2 x 10^5, sqrt(2)
  function toNumber(input) {
    let s = clean(input).toLowerCase();
    if (!s) return { ok: false };
    // strip a leading "x =" style label
    s = s.replace(/^[a-z]\s*=\s*/, '');
    let percent = false;
    if (/%\s*$/.test(s)) { percent = true; s = s.replace(/%\s*$/, ''); }
    // thousands separators: 1,000 or 1 000
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d{1,3}( \d{3})+(\.\d+)?(\s*[a-z°$%]+.*)?$/.test(s)) s = s.replace(/(\d) (?=\d{3}\b)/g, '$1');
    // mixed number "1 1/2" or "-2 3/4"
    let m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) {
      const v = (+m[2] + (+m[3]) / (+m[4])) * (m[1] ? -1 : 1);
      return { ok: true, v, percent, frac: { n: +m[3] + (+m[2]) * (+m[4]), d: +m[4] }, mixed: true, plain: true,
        parts: { w: +m[2], n: +m[3], d: +m[4] } };
    }
    // a bearing "045°T" or "045 T" is the number 45
    s = s.replace(/^(\d{3}(?:\.\d+)?)\s*°?\s*t(rue)?$/, '$1');
    // scientific "3.2 x 10^5"
    s = s.replace(/(\d)\s*[x*]\s*10\s*\^\s*\(?\s*(-?\d+)\s*\)?/, '$1e$2');
    const tryParse = (str) => {
      try { const tree = parse(str); if (varsOf(tree).size) return null; const v = evaluate(tree, {}); return isFinite(v) ? { v, tree } : null; }
      catch (e) { return null; }
    };
    let r = tryParse(s);
    if (!r) {
      // strip trailing units such as "cm", "m^2", "kg", "degrees", "°"
      const u = s.replace(/\s*(°\s*[cfk]?|degrees?(\s*[cfk])?|[a-z]{1,4}(\^?[23])?|sq\.?\s*[a-z]+|per\s+[a-z]+)\s*$/, '').trim();
      if (u !== s) r = tryParse(u);
      s = u;
    }
    if (!r) return { ok: false };
    const plain = /^-?(\d+(\.\d*)?|\.\d+)(e-?\d+)?$|^-?\d+\s*\/\s*\d+$/.test(s.trim());
    let frac = null;
    const fm = s.replace(/\s/g, '').match(/^(-?)\(?(-?\d+)\)?\/\(?(-?\d+)\)?$/);
    if (fm) frac = { n: Math.abs(+fm[2]), d: Math.abs(+fm[3]) };
    return { ok: true, v: r.v, percent, frac, raw: s, plain };
  }

  // Simplest surd form ("as": "surd"): terms like 5, 3√2, -√7, √6/3 or 2√5/5, joined by
  // + or -. Every radicand is a whole number above 1 with no square factor (√12 is
  // not simplest, 2√3 is), no two terms share a radicand (2√3 + √3 is not collected)
  // and there is at most one whole-number term. Decimals and √(a fraction) fail.
  function simplestSurd(raw) {
    const s = clean(raw).toLowerCase().replace(/\s+/g, '').replace(/^[a-z]=/, '');
    if (!s || /\./.test(s)) return false;
    const terms = s.replace(/^\+/, '').match(/^-?[^+-]+|[+-][^+-]+/g);
    if (!terms || terms.join('') !== s.replace(/^\+/, '')) return false;
    const seen = new Set(); let ints = 0;
    const squareFree = (n) => { for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false; return true; };
    for (let t of terms) {
      t = t.replace(/^([+-]?)\(([^()+-]+)\)(\/\d+)$/, '$1$2$3');   // (7√3)/12 is 7√3/12
      const m = t.match(/^[+-]?(\d*)\*?(?:sqrt\(?(\d+)\)?)?(?:\/(\d+))?$/);
      if (!m || (!m[1] && !m[2])) return false;
      if (m[3] && gcd(+(m[1] || 1), +m[3]) > 1) return false;   // 14√3/24 still cancels to 7√3/12
      if (m[2] == null) { if (+m[1] === 0) return false; ints++; continue; }
      const r = +m[2];
      if (r < 2 || !squareFree(r) || seen.has(r)) return false;
      if (m[1] === '1' || m[1] === '0') return false;
      seen.add(r);
    }
    return ints <= 1;
  }

  function close(a, b, tol) {
    if (tol != null) return Math.abs(a - b) <= tol + 1e-12;
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  }

  function numericMatch(q, studentRaw, expectedRaw) {
    const st = toNumber(studentRaw);
    if (!st.ok) return { correct: false, reason: 'unreadable' };
    if (!st.plain && !q.allowExpr && q.as !== 'surd') return { correct: false, reason: 'not a number' };
    const ex = toNumber(expectedRaw);
    if (!ex.ok) return { correct: false, reason: 'bad key' };
    // A % on one side only means "this many hundredths", so 25% can match 0.25 (and a
    // bare 25 can match 25%). When both sides have %, compare them directly: otherwise
    // 0.6% would slip through as equal to 60% (0.6 against 60 / 100).
    const candidates = [st.v];
    if (st.percent && !ex.percent) candidates.push(st.v / 100);
    const targets = [ex.v];
    if (ex.percent && !st.percent) targets.push(ex.v / 100);
    let ok = false;
    for (const c of candidates) for (const t of targets) {
      if (q.dp != null) {
        const f = Math.pow(10, q.dp);
        if (close(c, Math.round(t * f) / f) || close(c, t)) ok = true;
      } else if (close(c, t, q.tolerance)) ok = true;
    }
    if (ok && q.simplest && st.frac && gcd(st.frac.n, st.frac.d) !== 1) return { correct: false, reason: 'not simplest' };
    if (ok && q.simplest && st.frac && st.frac.d === 1) return { correct: false, reason: 'not simplest' };
    // q.as asks for the answer in one particular form, for questions where
    // the form is the point ("write 7/2 as a mixed numeral"). A right value
    // in the wrong form gets a reason saying which form is wanted.
    if (ok && q.as) {
      const whole = !st.percent && Number.isInteger(st.v) &&/^-?\d+$/.test(String(st.raw ?? clean(studentRaw)).trim());
      const isFrac = !!st.frac && !st.mixed && !st.percent;
      if (q.as === 'mixed') {
        if (st.mixed) {
          const p = st.parts;
          if (p.n >= p.d || p.n === 0) return { correct: false, reason: 'not proper' };
          if (q.simplest !== false && gcd(p.n, p.d) !== 1) return { correct: false, reason: 'not simplest' };
        } else if (!whole) return { correct: false, reason: 'use mixed' };
      }
      if (q.as === 'improper' && !(isFrac || whole)) return { correct: false, reason: 'use improper' };
      if (q.as === 'fraction' && !(isFrac || whole)) return { correct: false, reason: 'use fraction' };
      if (q.as === 'decimal' && (st.frac || st.mixed || st.percent)) return { correct: false, reason: 'use decimal' };
      if (q.as === 'percent' && !st.percent) return { correct: false, reason: 'use percent' };
      if (q.as === 'surd' && !simplestSurd(studentRaw)) return { correct: false, reason: 'use surd' };
      // Scientific notation: a × 10^n with 1 <= |a| < 10 ("3.2 x 10^5", "3.2e5" is not asked for).
      if (q.as === 'scientific') {
        const m = clean(studentRaw).toLowerCase().replace(/\s+/g, '').match(/^-?(\d+(?:\.\d+)?)[x*]10\^\(?(-?\d+)\)?$/);
        if (!m || +m[1] < 1 || +m[1] >= 10) return { correct: false, reason: 'use scientific' };
      }
    }
    return { correct: ok };
  }

  // ---- expressions & equations ----
  function splitEq(s) {
    const parts = clean(s).split('=');
    if (parts.length > 2) throw new Error('too many =');
    return parts;
  }

  function sameFunction(fa, fb, vars) {
    // fa, fb evaluate(vars) -> number. Equal at random points?
    let tested = 0;
    for (let i = 0; i < 40 && tested < 8; i++) {
      const env = {};
      vars.forEach(v => { env[v] = Math.round((Math.random() * 6 - 3) * 1000) / 1000 + 0.137; });
      const a = fa(env), b = fb(env);
      if (!isFinite(a) || !isFinite(b)) continue;
      tested++;
      if (!close(a, b, 1e-7 * Math.max(1, Math.abs(a)))) return false;
    }
    return tested >= 3;
  }

  // A + or - that is not inside brackets (a leading minus sign does not count).
  function topLevelPlusMinus(src) {
    const s = clean(src).replace(/\s+/g, '');
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(' || c === '[') depth++;
      else if (c === ')' || c === ']') depth--;
      else if ((c === '+' || c === '-') && depth === 0 && i > 0 && !/[*/^(]/.test(s[i - 1])) return true;
    }
    return false;
  }

  // In a factorised answer, does any bracket still have a common factor across its
  // terms (a whole number above 1, or a letter in every term)? 2(2x+4) and 7(2cn+3n) do.
  function bracketHasCommon(src) {
    const s = clean(src).toLowerCase().replace(/\s+/g, '').replace(/\*/g, '');
    const groups = s.match(/\(([^()]+)\)/g) || [];
    return groups.some(g => {
      const terms = g.slice(1, -1).split(/(?<!\^)(?=[+-])/).map(t => t.replace(/^[+-]/, '')).filter(Boolean);
      if (terms.length < 2) return false;
      const nums = terms.map(t => { const m = t.match(/^(\d+)/); return m ? +m[1] : 1; });
      if (nums.reduce((a, b) => gcd(a, b)) > 1) return true;
      const letterSets = terms.map(t => new Set(t.replace(/\^\d+/g, '').replace(/\d/g, '').split('').filter(ch => /[a-z]/.test(ch))));
      return [...letterSets[0]].some(ch => letterSets.every(set => set.has(ch)));
    });
  }

  // Is the answer one fraction top/bottom (no + or - outside brackets) where the number
  // content of the top and of the bottom share a factor above 1? The content of 6x-15 is 3,
  // of 4(x+2) is 4, of 9 is 9. Anything it cannot read (decimals, nested brackets) is a no.
  function fractionCancels(src) {
    const s = clean(src).toLowerCase().replace(/\s+/g, '').replace(/\*/g, '').replace(/^-/, '');
    if (/\./.test(s) || topLevelPlusMinus(s)) return false;
    let depth = 0, cut = -1;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      else if (c === '/' && depth === 0) { if (cut >= 0) return false; cut = i; }
    }
    if (cut < 0) return false;
    const content = (p) => {
      let m = p.match(/^\(([^()]+)\)$/);
      if (m) {
        const nums = m[1].split(/(?<!\^)(?=[+-])/).map(t => t.replace(/^[+-]/, '')).filter(Boolean)
          .map(t => { const d = t.match(/^(\d+)/); return d ? +d[1] : 1; });
        return nums.length ? nums.reduce((a, b) => gcd(a, b)) : null;
      }
      m = p.match(/^(\d+)(.*)$/);
      if (m) {
        if (/^[a-z^0-9]*$/.test(m[2])) return +m[1];
        if (/^[a-z^0-9]*\([^()]+\)$/.test(m[2])) { const c = content(m[2].slice(m[2].indexOf('('))); return c ? +m[1] * c : null; }
        return null;
      }
      return /^[a-z^0-9]*(\([^()]+\))?$/.test(p) ? 1 : null;
    };
    const top = content(s.slice(0, cut)), bottom = content(s.slice(cut + 1));
    return !!top && !!bottom && gcd(top, bottom) > 1;
  }

  function expressionMatch(q, studentRaw, expectedRaw) {
    if (!/x/i.test(String(expectedRaw))) studentRaw = String(studentRaw).replace(/[xX]/g, '*');
    let sParts, eParts;
    try { sParts = splitEq(studentRaw); eParts = splitEq(expectedRaw); }
    catch (e) { return { correct: false, reason: 'unreadable' }; }
    if (sParts.length !== eParts.length) return { correct: false };
    let sTrees, eTrees;
    try { sTrees = sParts.map(parse); } catch (e) { return { correct: false, reason: 'unreadable' }; }
    eTrees = eParts.map(parse);
    const vars = new Set();
    [...sTrees, ...eTrees].forEach(t => varsOf(t, vars));
    if (sTrees.length === 1) {
      const ok = sameFunction(env => evaluate(sTrees[0], env), env => evaluate(eTrees[0], env), vars);
      if (!ok) return { correct: false };
      if (q.form === 'factorised' || q.form === 'factorized' || q.form === 'factored') {
        if (!isFactored(sTrees[0])) return { correct: false, reason: 'not factorised' };
        // Fully factorised: the bracket must have nothing left in common, so
        // 2(2x+4) or 7(2cn+3n) do not pass for 4(x+2) or 7n(2c+3).
        if (bracketHasCommon(String(studentRaw)) && !bracketHasCommon(String(expectedRaw))) return { correct: false, reason: 'not fully factorised' };
        if (sumFactors(sTrees[0]) < sumFactors(eTrees[0])) return { correct: false, reason: 'not fully factorised' };
      }
      if (q.form === 'expanded' && !isExpanded(sTrees[0])) return { correct: false, reason: 'not expanded' };
      if (q.form === 'simplified') {
        const count = (src) => tokenize(clean(src)).filter(t => !t.implicit && !(t.t === 'op' && t.v === '*')).length;
        if (count(String(studentRaw)) > count(String(expectedRaw))) return { correct: false, reason: 'not simplified' };
        // Being short is not enough: "5g*g" (for 5g^2) and "10y/15" (for 2y/3) are short
        // but not simplified. Within each bracket-free term, a letter written more than
        // once, or a number fraction that still cancels, means it can go further.
        const loose = (src) => {
          const s = clean(src).toLowerCase().replace(/\s+/g, '').replace(/\*/g, '');
          if (/[a-z]{3,}/.test(s.replace(/[^a-z]+/g, ' ').split(' ').filter(w => /^(sqrt|sin|cos|tan|log|ln|abs|pi)/.test(w)).join(''))) return false;
          return s.split(/(?<![\^(])[+-]/).some(term => {
            if (!term) return false;
            // a number fraction that still cancels, even with letters and a bracketed bottom: 21/(30x)
            const frb = term.match(/^-?(\d+)[a-z^0-9]*\/\((\d+)[a-z^0-9]*\)$/);
            if (frb && gcd(+frb[1], +frb[2]) > 1) return true;
            if (/[()]/.test(term)) return false;
            const letters = term.replace(/\^\d+/g, '').match(/[a-z]/g) || [];
            if (new Set(letters).size !== letters.length) return true;
            const fr = term.match(/^(\d+)[a-z^0-9]*\/(\d+)$/) || term.match(/^[a-z^0-9]*?(\d+)\/(\d+)[a-z^0-9]*$/);
            return !!fr && gcd(+fr[1], +fr[2]) > 1;
          });
        };
        if (loose(String(studentRaw)) && !loose(String(expectedRaw))) return { correct: false, reason: 'not simplified' };
        // A single fraction whose whole top and whole bottom share a number factor still
        // cancels: (6x-15)/9 for (2x-5)/3, 4(x+2)/10 for 2(x+2)/5.
        if (fractionCancels(String(studentRaw)) && !fractionCancels(String(expectedRaw))) return { correct: false, reason: 'not simplified' };
        // "Write as a single fraction": if the key has no + or - outside brackets, a
        // student answer that still has one (a/2 + b/3) is not finished.
        if (!topLevelPlusMinus(String(expectedRaw)) && topLevelPlusMinus(String(studentRaw))) return { correct: false, reason: 'not simplified' };
      }
      return { correct: true };
    }
    // equation: L-R of student must be a non-zero constant multiple of L-R of key
    const fs = env => evaluate(sTrees[0], env) - evaluate(sTrees[1], env);
    const fe = env => evaluate(eTrees[0], env) - evaluate(eTrees[1], env);
    let k = null, tested = 0;
    for (let i = 0; i < 40 && tested < 8; i++) {
      const env = {};
      vars.forEach(v => { env[v] = Math.round((Math.random() * 6 - 3) * 1000) / 1000 + 0.137; });
      const a = fs(env), b = fe(env);
      if (!isFinite(a) || !isFinite(b) || Math.abs(b) < 1e-9) continue;
      tested++;
      const r = a / b;
      if (k === null) { if (Math.abs(r) < 1e-12) return { correct: false }; k = r; }
      else if (!close(r, k, 1e-7 * Math.max(1, Math.abs(k)))) return { correct: false };
    }
    return { correct: tested >= 3 };
  }

  // compare one value as number if possible, else as expression
  // A list item that is a word (red, blue, heads) is compared as text. Comparing it as
  // algebra would let the letters come in any order, so "bleu" would pass for "blue".
  const isWord = (e) => /^[a-z]{3,}$/i.test(String(e).trim()) && /[aeiou]/i.test(String(e));
  function valueMatch(q, s, e) {
    const en = toNumber(e);
    if (en.ok) return numericMatch(q, s, e).correct;
    if (isWord(e)) return clean(String(s)).trim().toLowerCase() === clean(String(e)).trim().toLowerCase();
    return expressionMatch(q, s, e).correct;
  }

  function splitList(s) {
    return clean(s)
      .replace(/^\{|\}$/g, '')
      .split(/\s*(?:,|;|\bor\b|\band\b|&)\s*/i)
      .map(x => x.trim().replace(/^[a-z]\s*=\s*/i, ''))
      .filter(Boolean);
  }

  function listMatch(q, studentRaw, expected, ordered) {
    const exp = Array.isArray(expected) ? expected.map(String) : splitList(expected);
    let st;
    if (ordered) {
      const inner = clean(studentRaw).replace(/^\(|\)$/g, '');
      st = inner.split(q.type === 'point' ? /\s*[,;]\s*|\s+and\s+/i : /\s*[,;]\s*/).filter(Boolean);
      // A solution pair typed with its letters in any order ("y = -3, x = 2") is read
      // as x first, then y, then z.
      const lettered = st.map(p => /^\s*([a-z])\s*=/i.exec(p));
      if (q.type === 'point' && lettered.every(Boolean)) {
        const letters = lettered.map(m => m[1].toLowerCase());
        if (new Set(letters).size === letters.length) st = st.map((p, i) => [letters[i], p]).sort((a, b) => a[0].localeCompare(b[0])).map(x => x[1]);
      }
    } else st = splitList(studentRaw);
    if (st.length !== exp.length) return { correct: false, reason: st.length < exp.length ? 'missing values' : 'too many values' };
    if (ordered) return { correct: exp.every((e, i) => valueMatch(q, st[i], e)) };
    const used = new Array(st.length).fill(false);
    for (const e of exp) {
      const idx = st.findIndex((s, i) => !used[i] && valueMatch(q, s, e));
      if (idx < 0) return { correct: false };
      used[idx] = true;
    }
    return { correct: true };
  }


  // ---- chapter-specific types ----
  const timesNorm = (s) => clean(s).toLowerCase().replace(/[x×·]/g, '*').replace(/\s+/g, '');

  // expanded form: sum of digit × place value, e.g. 3 × 1000 + 4 × 10 + 7 × 1  (index: 3 × 10^3 + 4 × 10^1 + 7 × 1)
  function expandedMatch(q, raw) {
    const target = Number(q.answer);
    const terms = timesNorm(raw).replace(/^\d[\d ]*=/, '').split('+').filter(Boolean);
    if (!terms.length) return { correct: false, reason: 'unreadable' };
    let total = 0; const places = new Set();
    for (const t of terms) {
      const m = t.match(/^\(?([0-9])\*(1(?:0+)?|10\^(\d+)|\(10\^(\d+)\))\)?$/);
      if (!m) return { correct: false, reason: 'not expanded form' };
      let place;
      if (m[3] != null || m[4] != null) place = Math.pow(10, +(m[3] ?? m[4]));
      else {
        place = Number(m[2]);
        if (q.index && place >= 10) return { correct: false, reason: 'use index notation' };
      }
      if (places.has(place)) return { correct: false, reason: 'not expanded form' };
      places.add(place);
      total += Number(m[1]) * place;
    }
    return { correct: total === target };
  }

  // quotient and remainder: "17 r 3", "17 remainder 3", "17, 3", "17 and 3 remainder"
  function qrMatch(q, raw) {
    const nums = (clean(raw).replace(/(\d) (?=\d{3}\b)/g, '$1').match(/\d+/g) || []).map(Number);
    const [qq, rr] = q.answer;
    if (nums.length === 1) return { correct: rr === 0 && nums[0] === qq, reason: rr !== 0 ? 'missing remainder' : undefined };
    if (nums.length !== 2) return { correct: false, reason: 'unreadable' };
    return { correct: nums[0] === qq && nums[1] === rr };
  }

  // insert brackets: same numbers and operations in the same order, plus brackets, making the statement true
  function bracketsMatch(q, raw) {
    const base = timesNorm(q.base).replace(/÷/g, '/');
    let st = timesNorm(raw).replace(/÷/g, '/').replace(/\[/g, '(').replace(/\]/g, ')');
    st = st.replace(/=.*$/, '');
    if (st.replace(/[()]/g, '') !== base.replace(/[()]/g, '')) return { correct: false, reason: 'changed numbers' };
    let v;
    try { const t = parse(st); if (varsOf(t).size) return { correct: false, reason: 'unreadable' }; v = evaluate(t, {}); }
    catch (e) { return { correct: false, reason: 'unreadable' }; }
    return { correct: close(v, Number(q.target)) };
  }

  // single product, e.g. 4 × 32 or 47b: compare factors in any order
  function productMatch(q, raw) {
    const split = (s) => timesNorm(s).replace(/(\d)([a-z])/g, '$1*$2').replace(/([a-z])(\d)/g, '$1*$2').split('*').filter(Boolean).sort();
    const a = split(raw), b = split(q.answer);
    if (a.length !== b.length) return { correct: false, reason: a.length === 1 ? 'not a product' : undefined };
    return { correct: a.every((x, i) => x === b[i]) };
  }

  // inequalities: "x > 3", "x>=-2", "x ≤ 5/2", "3 < x" (read as x > 3), "x is greater than 3"
  // is not accepted (type the symbol). The letter, the direction and the value must all match.
  function inequalityMatch(q, raw, key) {
    const read = (src) => {
      let s = clean(String(src)).toLowerCase().trim()
        .replace(/≥|=>/g, '>=').replace(/≤|=</g, '<=').replace(/≠/g, '!=');
      const m = s.match(/^([a-z])\s*(<=|>=|<|>)\s*(.+?)$/) || s.match(/^(.+?)\s*(<=|>=|<|>)\s*([a-z])$/);
      if (!m) return null;
      m[1] = m[1].trim(); m[3] = m[3].trim();
      const flip = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
      const letterFirst = /^[a-z]$/.test(m[1]) && !/^[a-z]$/.test(m[3]);
      const letter = letterFirst ? m[1] : m[3], op = letterFirst ? m[2] : flip[m[2]], num = toNumber(letterFirst ? m[3] : m[1]);
      if (!num.ok) return null;
      return { letter, op, v: num.v };
    };
    const st = read(raw), ex = read(key);
    if (!ex) return { correct: false, reason: 'bad key' };
    if (!st) return { correct: false, reason: 'use inequality' };
    return { correct: st.letter === ex.letter && st.op === ex.op && close(st.v, ex.v) };
  }

  // ratios: "3:4", "3 : 4", "2:3:5". Order matters. Equivalent ratios pass
  // (6:8 for 3:4) unless q.simplest, which wants whole-number parts with no
  // common factor. Parts may be decimals or fractions on the way.
  function ratioMatch(q, raw, key) {
    const parts = (s) => clean(s).replace(/\s+/g, '').split(':').map(p => toNumber(p));
    const st = parts(raw), ex = parts(key);
    if (st.length < 2) return { correct: false, reason: 'use ratio' };
    if (st.some(p => !p.ok) || ex.some(p => !p.ok)) return { correct: false, reason: 'unreadable' };
    if (st.length !== ex.length) return { correct: false };
    const k = st[0].v / ex[0].v;
    if (!isFinite(k) || k <= 0) return { correct: false };
    if (!st.every((p, i) => close(p.v, ex[i].v * k))) return { correct: false };
    if (q.simplest) {
      const ints = st.map(p => p.v);
      if (!ints.every(v => Number.isInteger(v)) || st.some(p => p.frac || p.mixed)) return { correct: false, reason: 'ratio not simplest' };
      if (ints.reduce((a, b) => gcd(a, b)) !== 1) return { correct: false, reason: 'ratio not simplest' };
    }
    return { correct: true };
  }

  // index form and prime factors: "2^3 × 5", "2 x 2 x 2 x 5", "5 × 2^3", "a^3 b^2".
  // Both sides become a map of base -> total power, so the order does not
  // matter and 2 × 2 × 2 equals 2^3. With q.index, each base must be written
  // once (2^3, not 2 × 2 × 2). A bare number like 40 is not accepted: the
  // point of these questions is the form, not the value.
  function powersMatch(q, raw, key) {
    const toMap = (src) => {
      const s = timesNorm(src).replace(/\*\*/g, '^');
      if (!s || /[^0-9a-z^*]/.test(s)) return null;
      const map = {}, seen = {};
      for (const piece of s.split('*')) {
        if (!piece) return null;
        const re = /(\d+|[a-z])(?:\^(\d+))?/g;
        let m, used = '';
        while ((m = re.exec(piece))) {
          used += m[0];
          const base = m[1], pow = m[2] == null ? 1 : Number(m[2]);
          if (base === '1') continue;
          map[base] = (map[base] || 0) + pow;
          seen[base] = (seen[base] || 0) + 1;
        }
        if (used !== piece) return null;
      }
      return { map, seen };
    };
    const st = toMap(raw), ex = toMap(key);
    if (!st || !ex) return { correct: false, reason: 'unreadable' };
    const sk = Object.keys(st.map).sort(), ek = Object.keys(ex.map).sort();
    const same = sk.length === ek.length && sk.every((b, i) => b === ek[i] && st.map[b] === ex.map[b]);
    const plainNumber = sk.length === 1 && st.map[sk[0]] === 1 && /^\d+$/.test(sk[0]);
    if (!same) return { correct: false, reason: plainNumber ? 'not index form' : undefined };
    if (q.index && Object.values(st.seen).some(n => n > 1)) return { correct: false, reason: 'use powers' };
    return { correct: true };
  }

  // place value of a digit: accept 600, "6 hundreds", "hundreds", "six hundred"
  const PLACE_NAMES =['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand', 'million', 'ten million', 'hundred million'];
  const DIGIT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  function placeValueMatch(q, raw) {
    const value = Number(q.answer);
    const n = toNumber(raw);
    if (n.ok && n.plain) return { correct: n.v === value };
    const power = Math.round(Math.log10(value / Number(String(value)[0])));
    const digit = Number(String(value)[0]);
    let s = clean(raw).toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/^the /, '').replace(/ (place|column|position)$/, '');
    s = s.replace(new RegExp('^(' + digit + '|' + DIGIT_WORDS[digit] + ') '), '');
    s = s.replace(/s$/, '').replace(/^unit$/, 'one');
    return { correct: s === PLACE_NAMES[power] };
  }

  const norm = (s) => clean(s).toLowerCase().replace(/\s+/g, ' ').replace(/[.!]$/, '');

  function check(q, studentRaw) {
    const raw = String(studentRaw ?? '').trim();
    if (!raw && q.type !== 'choice') return { correct: false, reason: 'empty' };
    const keys = [q.answer, ...(q.accept || [])];
    try {
      switch (q.type) {
        case 'choice': {
          const idx = typeof q.answer === 'number' ? q.answer : 'abcdefgh'.indexOf(String(q.answer).toLowerCase());
          return { correct: Number(studentRaw) === idx };
        }
        case 'text':
          return { correct: keys.some(k => norm(k) === norm(raw)) };
        case 'list':
          return keys.reduce((r, k) => r.correct ? r : listMatch(q, raw, k, false), { correct: false });
        case 'expanded': return expandedMatch(q, raw);
        case 'qr': return qrMatch(q, raw);
        case 'brackets': return bracketsMatch(q, raw);
        case 'product': return productMatch(q, raw);
        case 'placevalue': return placeValueMatch(q, raw);
        case 'inequality': {
          let last = { correct: false };
          for (const k of keys) { last = inequalityMatch(q, raw, String(k)); if (last.correct) return last; }
          return last;
        }
        case 'ratio': {
          let last = { correct: false };
          for (const k of keys) { last = ratioMatch(q, raw, String(k)); if (last.correct) return last; }
          return last;
        }
        case 'powers': {
          let last = { correct: false };
          for (const k of keys) { last = powersMatch(q, raw, String(k)); if (last.correct) return last; }
          return last;
        }
        case 'ordered':
        case 'point':
          return keys.reduce((r, k) => r.correct ? r : listMatch(q, raw, Array.isArray(k) ? k : String(k).replace(/^\(|\)$/g, '').split(','), true), { correct: false });
        case 'expression': {
          // "Write an equation" questions: the solved form (t = 27) is equivalent to the
          // equation, but it is not what was asked. Reject a bare "letter = number" unless
          // the key itself is one.
          const solvedForm = (s) => /^\s*[a-z]\s*=\s*-?[\d.\s/]+$|^\s*-?[\d.\s/]+=\s*[a-z]\s*$/i.test(clean(String(s)));
          if (keys.some(k => String(k).includes('=')) && solvedForm(raw) && !keys.some(solvedForm)) return { correct: false, reason: 'write the equation' };
          let last = { correct: false };
          for (const k of keys) { last = expressionMatch(q, raw, String(k)); if (last.correct) return last; }
          return last;
        }
        case 'numeric':
        default: {
          let last = { correct: false };
          for (const k of keys) { last = numericMatch(q, raw, String(k)); if (last.correct) return last; }
          return last;
        }
      }
    } catch (e) {
      return { correct: false, reason: 'unreadable' };
    }
  }

  return { check, parse, toNumber };
})();
if (typeof module !== 'undefined') module.exports = Checker;

