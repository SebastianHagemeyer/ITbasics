/* xlsheet.js
 *
 * A small pretend spreadsheet for the Pre-VET Excel modules: a grid with
 * lettered columns and numbered rows, a Name Box and a formula bar, and a
 * formula engine that really calculates. It is not Excel and does not try to
 * be. It covers what Year 10 meets first: numbers, text, cell references,
 * + - * / ^, brackets, ranges, and SUM, AVERAGE, MIN, MAX, COUNT, PRODUCT and
 * SUMPRODUCT. It shows the same error codes Excel would (#NAME?, #DIV/0!,
 * #VALUE!, #REF!) so the error-detective activities feel real.
 *
 *   var sheet = XLSheet.create(el, {
 *     cols: 7, rows: 5,
 *     data: { A1: "First number", B1: 16, G5: "=B1*B2" },
 *     widths: { A: "11rem" },        // optional, per column
 *     toggles: ["B2", "C2"],         // click flips 0 and 1
 *     editable: ["G5"],              // formula bar can type into these
 *     onSelect: function (ref) {},
 *     onChange: function (ref, raw) {}
 *   });
 *   sheet.value("G5");               // the calculated value
 *   sheet.set("B2", 1);
 *
 * More options for the Excel lessons:
 *     editable: true                 // every cell can be typed in
 *     ribbon: true                   // Home tab: Undo, Bold, Centre, Merge & Center,
 *                                    // Wrap Text, All Borders, Fill (or a list of those)
 *     fill: true                     // fill handle + Ctrl+D / Ctrl+R, refs shift like Excel
 *     narrow: { A: "4rem" }          // too-narrow column: text cut off, numbers #####;
 *                                    // double-click its header to auto-fit
 *     format: { "A3:E3": { b: 1, fill: "blue" } }, merges: ["A1:E1"]
 *     storeKey: "..."                // keep the student's sheet in localStorage
 *     onUpdate: function () {}       // after any change at all (data, format, undo)
 *   Typing works like Excel: click a cell and type, Enter goes down, Tab goes
 *   across, Delete clears, F2 or double-click edits, Ctrl+Z undoes.
 *
 *   XLSheet.evaluate("=B1*B2", getRaw) // evaluate against any lookup
 *   XLSheet.refsIn("=B1*B2")           // ["B1", "B2"]
 *
 * Errors are thrown internally as { xl: "#NAME?", why: "..." } and come back
 * from value() as that object, so a page can show the code and a plain
 * English reason side by side.
 */
(function () {
  "use strict";

  var FUNCS = {
    SUM: function (a) { return nums(a).reduce(function (s, n) { return s + n; }, 0); },
    AVERAGE: function (a) {
      var n = nums(a);
      if (!n.length) throw err("#DIV/0!", "AVERAGE has no numbers to average.");
      return FUNCS.SUM(a) / n.length;
    },
    MIN: function (a) { var n = nums(a); return n.length ? Math.min.apply(null, n) : 0; },
    MAX: function (a) { var n = nums(a); return n.length ? Math.max.apply(null, n) : 0; },
    COUNT: function (a) { return nums(a).length; },
    PRODUCT: function (a) { return nums(a).reduce(function (s, n) { return s * n; }, 1); },
    SUMPRODUCT: function (a, groups) {
      if (groups.length < 1) throw err("#VALUE!", "SUMPRODUCT needs at least one range.");
      var len = groups[0].length;
      groups.forEach(function (g) {
        if (g.length !== len) throw err("#VALUE!", "SUMPRODUCT needs ranges that are the same size.");
      });
      var total = 0;
      for (var i = 0; i < len; i++) {
        var p = 1;
        groups.forEach(function (g) { p *= (typeof g[i] === "number" ? g[i] : 0); });
        total += p;
      }
      return total;
    }
  };

  function err(code, why) { return { xl: code, why: why }; }
  function isErr(v) { return v && typeof v === "object" && v.xl; }
  function nums(list) { return list.filter(function (v) { return typeof v === "number"; }); }

  function colNum(letters) {
    var n = 0;
    for (var i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n;
  }
  function colName(n) {
    var s = "";
    while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function splitRef(ref) {
    var m = /^([A-Z]+)(\d+)$/.exec(ref);
    return m ? { col: colNum(m[1]), row: parseInt(m[2], 10) } : null;
  }

  // ---- tokeniser ---------------------------------------------------------
  function tokenise(src) {
    if (src.indexOf("#REF!") !== -1) throw err("#REF!", "The formula points at a cell that doesn't exist.");
    var out = [], i = 0;
    while (i < src.length) {
      var c = src[i];
      if (c === " ") { i++; continue; }
      var num = /^\d+(\.\d+)?|^\.\d+/.exec(src.slice(i));
      if (num) { out.push({ t: "num", v: parseFloat(num[0]) }); i += num[0].length; continue; }
      var word = /^\$?[A-Za-z]+\$?\d*/.exec(src.slice(i));
      if (word) {
        var w = word[0].replace(/\$/g, "").toUpperCase();
        if (/^[A-Z]{1,3}\d+$/.test(w)) out.push({ t: "ref", v: w });
        else out.push({ t: "name", v: w });
        i += word[0].length;
        continue;
      }
      if ("+-*/^(),:".indexOf(c) !== -1) { out.push({ t: c }); i++; continue; }
      if (c === "×") throw err("#NAME?", "Excel's times sign is * (Shift + 8), not ×.");
      throw err("#NAME?", "Excel doesn't know what \"" + c + "\" means in a formula.");
    }
    return out;
  }

  // ---- parser + evaluator (recursive descent) -----------------------------
  function evaluate(formula, getRaw, seen) {
    var src = String(formula).trim();
    if (src[0] !== "=") return literal(src);
    seen = seen || {};
    var toks = tokenise(src.slice(1));
    var p = 0;

    function peek() { return toks[p]; }
    function take(t) {
      var k = toks[p];
      if (!k || k.t !== t) throw err("#NAME?", t === ")" ? "A bracket was opened but never closed." : "Something is missing near the end of the formula.");
      p++;
      return k;
    }

    function cellValue(ref) {
      if (seen[ref]) throw err("#REF!", "This formula ends up using its own answer (a circular reference).");
      var raw = getRaw(ref);
      if (raw === undefined || raw === null || raw === "") return 0;
      if (typeof raw === "number") return raw;
      var s = String(raw);
      if (s[0] === "=") {
        var next = Object.assign({}, seen); next[ref] = true;
        var v = evaluate(s, getRaw, next);
        if (isErr(v)) throw v;
        return v;
      }
      return literal(s);
    }

    function range(a, b) {
      var A = splitRef(a), B = splitRef(b), list = [];
      for (var r = Math.min(A.row, B.row); r <= Math.max(A.row, B.row); r++) {
        for (var c = Math.min(A.col, B.col); c <= Math.max(A.col, B.col); c++) {
          list.push(cellValue(colName(c) + r));
        }
      }
      return list;
    }

    function arith(v) {
      if (typeof v === "number") return v;
      throw err("#VALUE!", "You can't do maths with text. Check the cells your formula points at.");
    }

    function expr() {
      var v = term();
      while (peek() && (peek().t === "+" || peek().t === "-")) {
        var op = toks[p++].t, r = term();
        v = op === "+" ? arith(v) + arith(r) : arith(v) - arith(r);
      }
      return v;
    }
    function term() {
      var v = power();
      while (peek() && (peek().t === "*" || peek().t === "/")) {
        var op = toks[p++].t, r = power();
        if (op === "/" && arith(r) === 0) throw err("#DIV/0!", "You divided by zero (or by an empty cell).");
        v = op === "*" ? arith(v) * arith(r) : arith(v) / arith(r);
      }
      return v;
    }
    function power() {
      var v = unary();
      while (peek() && peek().t === "^") { p++; v = Math.pow(arith(v), arith(unary())); }
      return v;
    }
    function unary() {
      if (peek() && peek().t === "-") { p++; return -arith(unary()); }
      if (peek() && peek().t === "+") { p++; return arith(unary()); }
      return primary();
    }
    function primary() {
      var k = peek();
      if (!k) throw err("#NAME?", "The formula stops too early. Is something missing after the last sign?");
      if (k.t === "num") { p++; return k.v; }
      if (k.t === "ref") {
        p++;
        if (peek() && peek().t === ":") throw err("#VALUE!", "A range like B1:F1 only works inside a function, such as =SUM(B1:F1).");
        return cellValue(k.v);
      }
      if (k.t === "(") { p++; var v = expr(); take(")"); return v; }
      if (k.t === "name") {
        p++;
        var fn = FUNCS[k.v];
        if (!peek() || peek().t !== "(") {
          throw err("#NAME?", "\"" + k.v + "\" isn't a cell or a number. Cell references are a letter then a number, like B4.");
        }
        if (!fn) throw err("#NAME?", "Excel has no function called " + k.v + ". Check the spelling.");
        take("(");
        var flat = [], groups = [];
        if (peek() && peek().t !== ")") {
          do {
            var g;
            if (peek() && peek().t === "ref" && toks[p + 1] && toks[p + 1].t === ":") {
              var a = toks[p].v; p += 2;
              var b = take("ref").v;
              g = range(a, b);
            } else {
              g = [expr()];
            }
            groups.push(g);
            flat = flat.concat(g);
          } while (peek() && peek().t === "," && ++p);
        }
        take(")");
        return fn(flat, groups);
      }
      throw err("#NAME?", "There's a \"" + k.t + "\" where Excel expected a number or a cell.");
    }

    try {
      var result = expr();
      if (p < toks.length) {
        throw err("#NAME?", toks[p].t === ")" ? "There's a closing bracket with no opening one." : "There's something extra Excel can't read. Is a + or * missing?");
      }
      return typeof result === "number" ? Math.round(result * 1e10) / 1e10 : result;
    } catch (e) {
      if (isErr(e)) return e;
      throw e;
    }
  }

  // A cell typed without "=" is a number if it looks like one, else text.
  function literal(s) {
    if (s[0] === "'") return s.slice(1);          // Excel: a leading ' forces text
    if (/^-?\d+(\.\d+)?$/.test(s.trim())) return parseFloat(s);
    return s;
  }

  // Copy a formula to a cell dr rows down and dc columns across, the way the
  // fill handle does: relative references move, $-locked parts stay put.
  function shiftFormula(f, dr, dc) {
    var s = String(f);
    if (s.trim()[0] !== "=") return s;
    return s.replace(/(^|[^A-Za-z0-9_$])(\$?)([A-Za-z]{1,3})(\$?)(\d+)(?![A-Za-z0-9_(])/g,
      function (m, pre, d1, col, d2, row) {
        var c = colNum(col.toUpperCase()), r = parseInt(row, 10);
        if (!d1) c += dc;
        if (!d2) r += dr;
        if (c < 1 || r < 1) return pre + "#REF!";
        return pre + d1 + colName(c) + d2 + r;
      });
  }

  function refsIn(formula) {
    var s = String(formula || "");
    if (s.trim()[0] !== "=") return [];
    try {
      var out = [], toks = tokenise(s.trim().slice(1));
      for (var i = 0; i < toks.length; i++) {
        if (toks[i].t !== "ref") continue;
        if (toks[i + 1] && toks[i + 1].t === ":" && toks[i + 2] && toks[i + 2].t === "ref") {
          var A = splitRef(toks[i].v), B = splitRef(toks[i + 2].v);
          for (var r = Math.min(A.row, B.row); r <= Math.max(A.row, B.row); r++) {
            for (var c = Math.min(A.col, B.col); c <= Math.max(A.col, B.col); c++) out.push(colName(c) + r);
          }
          i += 2;
        } else out.push(toks[i].v);
      }
      return out;
    } catch (e) { return []; }
  }

  function show(v) {
    if (isErr(v)) return v.xl;
    if (typeof v === "number") return String(v);
    return v == null ? "" : String(v);
  }

  // ---- the grid ----------------------------------------------------------
  //
  // State is { data, fmt, merges, narrow }:
  //   data    ref -> what was typed (a number, text, or "=formula")
  //   fmt     ref -> { b: bold, c: centred, w: wrap, bd: all borders, fill: "blue" }
  //   merges  [{ c1, r1, c2, r2 }]
  //   narrow  column letter -> CSS width, for a column that is "too narrow"
  //           (text is cut off, numbers show #####). Double-clicking the
  //           column's header (or the line on its right) auto-fits it.
  var FILL_NAMES = { blue: "Light blue", yellow: "Light yellow", green: "Light green", none: "No fill" };

  function rc(c, r) { return colName(c) + r; }
  function rectOf(s) {
    var p = String(s).toUpperCase().split(":"), a = splitRef(p[0]), b = splitRef(p[1] || p[0]);
    return { c1: Math.min(a.col, b.col), r1: Math.min(a.row, b.row), c2: Math.max(a.col, b.col), r2: Math.max(a.row, b.row) };
  }
  function rectName(r) { return r.c1 === r.c2 && r.r1 === r.r2 ? rc(r.c1, r.r1) : rc(r.c1, r.r1) + ":" + rc(r.c2, r.r2); }
  function eachRef(r, fn) { for (var y = r.r1; y <= r.r2; y++) for (var x = r.c1; x <= r.c2; x++) fn(rc(x, y), x, y); }
  function overlaps(a, b) { return a.c1 <= b.c2 && b.c1 <= a.c2 && a.r1 <= b.r2 && b.r1 <= a.r2; }
  function inRect(r, c, y) { return c >= r.c1 && c <= r.c2 && y >= r.r1 && y <= r.r2; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function create(host, opts) {
    opts = opts || {};
    var cols = opts.cols || 6, rows = opts.rows || 5;
    var allEdit = opts.editable === true;
    var editable = {};
    if (Array.isArray(opts.editable)) opts.editable.forEach(function (r) { editable[r] = true; });
    var toggles = {}; (opts.toggles || []).forEach(function (r) { toggles[r] = true; });
    function isEditable(ref) { return allEdit || Boolean(editable[ref]); }

    var init = { data: {}, fmt: {}, merges: [], narrow: {} };
    Object.keys(opts.data || {}).forEach(function (k) { init.data[k] = opts.data[k]; });
    Object.keys(opts.format || {}).forEach(function (k) {
      eachRef(rectOf(k), function (ref) { init.fmt[ref] = Object.assign({}, init.fmt[ref], opts.format[k]); });
    });
    (opts.merges || []).forEach(function (m) { init.merges.push(rectOf(m)); });
    Object.keys(opts.narrow || {}).forEach(function (k) { init.narrow[k] = opts.narrow[k]; });

    var storeKey = opts.storeKey ? "xlsheet-" + opts.storeKey : null;
    var st = clone(init);
    if (storeKey) {
      try {
        var saved = JSON.parse(localStorage.getItem(storeKey) || "null");
        if (saved && saved.data) st = saved;
      } catch (e) { /* private browsing: start fresh */ }
    }

    var start = splitRef(opts.select || "A1");
    var anchor = { c: start.col, r: start.row }, focus = { c: start.col, r: start.row };
    var hunting = false, editing = false, editRef = null, dragging = false, fillDrag = null, fillPreview = null;
    var history = [];

    host.classList.add("xl");
    host.innerHTML = "";

    // ---- ribbon (optional) ----
    var ribbon = null, toolBtns = {};
    var tools = opts.ribbon === true ? ["undo", "bold", "center", "merge", "wrap", "borders", "fill"]
              : (Array.isArray(opts.ribbon) ? opts.ribbon : []);
    if (tools.length) {
      ribbon = document.createElement("div");
      ribbon.className = "xl-ribbon";
      ribbon.setAttribute("role", "toolbar");
      ribbon.setAttribute("aria-label", "Home tab");
      var LABELS = {
        undo: ["↶ Undo", "Undo (Ctrl + Z)"], bold: ["B", "Bold (Ctrl + B)"], center: ["≡ Centre", "Centre"],
        merge: ["⇔ Merge & Center", "Merge & Center (click again to split)"], wrap: ["↵ Wrap Text", "Wrap Text"],
        borders: ["⊞ All Borders", "All Borders"]
      };
      tools.forEach(function (t) {
        if (t === "fill") {
          var grp = document.createElement("span");
          grp.className = "xl-fillgrp";
          var lab = document.createElement("span");
          lab.className = "xl-filllab";
          lab.textContent = "Fill:";
          grp.appendChild(lab);
          ["blue", "yellow", "green", "none"].forEach(function (f) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "xl-tool xl-swatch xl-swatch-" + f;
            b.dataset.fill = f;
            b.title = "Fill Colour: " + FILL_NAMES[f];
            b.setAttribute("aria-label", "Fill Colour: " + FILL_NAMES[f]);
            if (f === "none") b.textContent = "∅";
            grp.appendChild(b);
          });
          ribbon.appendChild(grp);
          return;
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "xl-tool xl-tool-" + t;
        btn.dataset.tool = t;
        btn.textContent = LABELS[t][0];
        btn.title = LABELS[t][1];
        if (t !== "undo") btn.setAttribute("aria-pressed", "false");
        toolBtns[t] = btn;
        ribbon.appendChild(btn);
      });
      host.appendChild(ribbon);
    }

    var bar = document.createElement("div");
    bar.className = "xl-bar";
    var nameBox = document.createElement("span");
    nameBox.className = "xl-name";
    nameBox.title = "Name Box: the cell reference of the selected cell";
    var fx = document.createElement("span");
    fx.className = "xl-fx";
    fx.textContent = "fx";
    fx.setAttribute("aria-hidden", "true");
    var input = document.createElement("input");
    input.className = "xl-formula";
    input.type = "text";
    input.spellcheck = false;
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Formula bar");
    bar.appendChild(nameBox); bar.appendChild(fx); bar.appendChild(input);

    var scroller = document.createElement("div");
    scroller.className = "xl-scroll";
    var table = document.createElement("table");
    table.className = "xl-grid";
    table.tabIndex = 0;
    table.setAttribute("aria-label", opts.label || "Spreadsheet");
    scroller.appendChild(table);

    var notice = document.createElement("p");
    notice.className = "xl-notice";
    notice.setAttribute("aria-live", "polite");
    notice.hidden = true;

    host.appendChild(bar);
    host.appendChild(scroller);
    host.appendChild(notice);

    var tds = {}, divs = {}, colHeads = [], rowHeads = [];
    var thead = document.createElement("tr");
    var corner = document.createElement("th");
    corner.className = "xl-corner";
    thead.appendChild(corner);
    for (var c = 1; c <= cols; c++) {
      var th = document.createElement("th");
      th.className = "xl-colhead";
      th.dataset.col = colName(c);
      th.textContent = colName(c);
      var w = opts.widths && opts.widths[colName(c)];
      if (w) th.style.width = w;
      var grip = document.createElement("span");
      grip.className = "xl-resizer";
      grip.title = "Double-click to fit the column to its contents";
      th.appendChild(grip);
      colHeads[c] = th;
      thead.appendChild(th);
    }
    table.appendChild(thead);
    for (var r = 1; r <= rows; r++) {
      var tr = document.createElement("tr");
      var rh = document.createElement("th");
      rh.className = "xl-rowhead";
      rh.textContent = r;
      rowHeads[r] = rh;
      tr.appendChild(rh);
      for (var c2 = 1; c2 <= cols; c2++) {
        var ref = rc(c2, r);
        var td = document.createElement("td");
        td.dataset.ref = ref;
        if (toggles[ref]) td.classList.add("xl-toggle");
        if (isEditable(ref)) td.classList.add("xl-editable");
        var div = document.createElement("div");
        div.className = "xl-c";
        td.appendChild(div);
        tds[ref] = td; divs[ref] = div;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    // ---- reading state ----
    function raw(ref) { return st.data[ref]; }
    function value(ref) { return evaluate(st.data[ref] == null ? "" : String(st.data[ref]), raw); }
    function mergeAt(c, y) {
      for (var i = 0; i < st.merges.length; i++) if (inRect(st.merges[i], c, y)) return st.merges[i];
      return null;
    }
    function anchorRef() { return rc(anchor.c, anchor.r); }
    function selRect() {
      var R = { c1: Math.min(anchor.c, focus.c), r1: Math.min(anchor.r, focus.r),
                c2: Math.max(anchor.c, focus.c), r2: Math.max(anchor.r, focus.r) };
      // Grow to cover any merged block it touches, as Excel does.
      var grew = true;
      while (grew) {
        grew = false;
        st.merges.forEach(function (m) {
          if (overlaps(m, R) && (m.c1 < R.c1 || m.r1 < R.r1 || m.c2 > R.c2 || m.r2 > R.r2)) {
            R = { c1: Math.min(R.c1, m.c1), r1: Math.min(R.r1, m.r1), c2: Math.max(R.c2, m.c2), r2: Math.max(R.r2, m.r2) };
            grew = true;
          }
        });
      }
      return R;
    }
    function isMulti(R) {
      var m = mergeAt(R.c1, R.r1);
      if (m && m.c1 === R.c1 && m.r1 === R.r1 && m.c2 === R.c2 && m.r2 === R.r2) return false;
      return R.c1 !== R.c2 || R.r1 !== R.r2;
    }

    // ---- drawing ----
    function render() {
      Object.keys(tds).forEach(function (ref) {
        tds[ref].style.display = ""; tds[ref].colSpan = 1; tds[ref].rowSpan = 1;
      });
      st.merges.forEach(function (m) {
        var tl = rc(m.c1, m.r1);
        tds[tl].colSpan = m.c2 - m.c1 + 1;
        tds[tl].rowSpan = m.r2 - m.r1 + 1;
        eachRef(m, function (ref) { if (ref !== tl) tds[ref].style.display = "none"; });
      });
      var R = selRect(), multi = isMulti(R), act = anchorRef();
      var clipped = [];
      Object.keys(tds).forEach(function (ref) {
        var td = tds[ref], div = divs[ref], v = value(ref), f = st.fmt[ref] || {};
        var p = splitRef(ref), col = colName(p.col), m = mergeAt(p.col, p.row);
        var wide = m && m.c2 > m.c1;
        div.textContent = show(v);
        td.className = "";
        if (toggles[ref]) td.classList.add("xl-toggle");
        if (isEditable(ref)) td.classList.add("xl-editable");
        if (typeof v === "number") td.classList.add("xl-num");
        if (isErr(v)) td.classList.add("xl-err");
        if (toggles[ref] && v === 1) td.classList.add("xl-on");
        if (ref === act) td.classList.add("xl-sel");
        if (multi && inRect(R, p.col, p.row)) td.classList.add("xl-inrange");
        if (fillPreview && inRect(fillPreview, p.col, p.row)) td.classList.add("xl-filltarget");
        if (f.b) td.classList.add("xl-bold");
        if (f.c) td.classList.add("xl-center");
        if (f.w) td.classList.add("xl-wrap");
        if (f.bd) td.classList.add("xl-bd");
        if (f.fill && f.fill !== "none") td.classList.add("xl-fill-" + f.fill);
        if (opts.marks && opts.marks[ref]) td.classList.add(opts.marks[ref]);
        if (st.narrow[col] && !wide) {
          div.style.width = st.narrow[col];
          div.classList.add("xl-clip");
          if (typeof v === "number" && !f.w) clipped.push(ref);
        } else {
          div.style.width = "";
          div.classList.remove("xl-clip");
        }
        td.title = isErr(v) ? v.why : "";
      });
      // A number that doesn't fit shows ##### (text is just cut off).
      clipped.forEach(function (ref) {
        var div = divs[ref];
        if (div.clientWidth && div.scrollWidth > div.clientWidth + 1) {
          div.textContent = new Array(Math.max(4, Math.floor(div.clientWidth / 9)) + 1).join("#");
          tds[ref].classList.add("xl-hash");
        }
      });
      colHeads.forEach(function (h, i) {
        if (!h) return;
        var nw = st.narrow[colName(i)];
        h.style.width = nw || (opts.widths && opts.widths[colName(i)]) || "";
        h.style.minWidth = nw || "";
        h.classList.toggle("xl-headsel", i >= R.c1 && i <= R.c2);
      });
      rowHeads.forEach(function (h, i) { if (h) h.classList.toggle("xl-headsel", i >= R.r1 && i <= R.r2); });
      nameBox.textContent = multi ? rectName(R) : act;
      if (!editing) input.value = raw(act) == null ? "" : String(raw(act));
      input.readOnly = !isEditable(act);
      bar.classList.toggle("xl-bar-edit", isEditable(act));

      var old = table.querySelector(".xl-handle");
      if (old) old.remove();
      if (opts.fill && !multi && isEditable(act) && !hunting) {
        var hd = document.createElement("span");
        hd.className = "xl-handle";
        hd.title = "Fill handle: drag to copy this cell";
        tds[act].appendChild(hd);
      }
      if (ribbon) {
        ["bold", "center", "wrap", "borders"].forEach(function (t) {
          if (!toolBtns[t]) return;
          var key = { bold: "b", center: "c", wrap: "w", borders: "bd" }[t], all = true;
          eachRef(R, function (ref) { if (!(st.fmt[ref] || {})[key]) all = false; });
          toolBtns[t].setAttribute("aria-pressed", all ? "true" : "false");
        });
        if (toolBtns.merge) {
          var mm = mergeAt(R.c1, R.r1);
          toolBtns.merge.setAttribute("aria-pressed",
            mm && mm.c1 === R.c1 && mm.r1 === R.r1 && mm.c2 === R.c2 && mm.r2 === R.r2 ? "true" : "false");
        }
      }
    }

    var noticeTimer = null;
    function say(msg) {
      notice.textContent = msg;
      notice.hidden = false;
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(function () { notice.hidden = true; }, 6000);
      if (opts.onNotice) opts.onNotice(msg);
    }

    // ---- changing state ----
    function pushHistory() {
      history.push(JSON.stringify(st));
      if (history.length > 60) history.shift();
    }
    function changed(dataRefs) {
      if (storeKey) { try { localStorage.setItem(storeKey, JSON.stringify(st)); } catch (e) { /* full or private */ } }
      render();
      if (opts.onChange) (dataRefs || []).forEach(function (ref) { opts.onChange(ref, st.data[ref]); });
      if (opts.onUpdate) opts.onUpdate();
    }
    function undo() {
      if (!history.length) { say("Nothing to undo."); return; }
      st = JSON.parse(history.pop());
      changed(Object.keys(tds).filter(function (ref) { return isEditable(ref); }));
    }
    function setRaw(ref, v) {
      if (v === "" || v == null) delete st.data[ref];
      else st.data[ref] = v;
    }

    function select(c, y, extend, activated) {
      c = Math.max(1, Math.min(cols, c));
      y = Math.max(1, Math.min(rows, y));
      if (extend) { focus = { c: c, r: y }; }
      else {
        var m = mergeAt(c, y);
        if (m) { c = m.c1; y = m.r1; }
        anchor = { c: c, r: y }; focus = { c: c, r: y };
      }
      render();
      if (opts.onSelect) opts.onSelect(rc(c, y), Boolean(activated));
    }
    function move(dc, dr, extend) {
      var from = extend ? focus : anchor, m = mergeAt(from.c, from.r);
      var c = from.c + dc, y = from.r + dr;
      if (m && !extend) {
        if (dc > 0) c = m.c2 + 1; if (dc < 0) c = m.c1 - 1;
        if (dr > 0) y = m.r2 + 1; if (dr < 0) y = m.r1 - 1;
        if (!dc) c = m.c1; if (!dr) y = m.r1;
      }
      select(c, y, extend, false);
    }
    function activate(ref, flip) {
      if (flip && toggles[ref] && !hunting) {
        pushHistory();
        st.data[ref] = value(ref) === 1 ? 0 : 1;
        changed([ref]);
      }
      if (opts.onSelect) opts.onSelect(ref, true);
    }

    function startEdit(initial) {
      var act = anchorRef();
      if (!isEditable(act)) return;
      editing = true; editRef = act;
      input.readOnly = false;
      if (initial != null) input.value = initial;
      input.focus();
      var n = input.value.length;
      try { input.setSelectionRange(initial != null ? n : 0, n); } catch (e) { /* fine */ }
    }
    function commit() {
      if (!editing) return false;
      editing = false;
      var ref = editRef, v = input.value.replace(/\s+$/, "");
      var before = raw(ref) == null ? "" : String(raw(ref));
      if (v === before) return false;
      pushHistory();
      setRaw(ref, v);
      changed([ref]);
      return true;
    }

    function toggleFmt(key) {
      var R = selRect(), all = true;
      eachRef(R, function (ref) { if (!(st.fmt[ref] || {})[key]) all = false; });
      pushHistory();
      eachRef(R, function (ref) {
        var f = Object.assign({}, st.fmt[ref]);
        if (all) delete f[key]; else f[key] = 1;
        st.fmt[ref] = f;
      });
      changed([]);
    }
    function setFill(color) {
      var R = selRect();
      pushHistory();
      eachRef(R, function (ref) {
        var f = Object.assign({}, st.fmt[ref]);
        if (color === "none") delete f.fill; else f.fill = color;
        st.fmt[ref] = f;
      });
      changed([]);
    }
    function mergeToggle() {
      var R = selRect();
      var hit = st.merges.filter(function (m) { return overlaps(m, R); });
      if (hit.length) {
        pushHistory();
        st.merges = st.merges.filter(function (m) { return hit.indexOf(m) === -1; });
        say("Split: the merged cell is back to separate cells.");
        changed([]);
        return;
      }
      if (R.c1 === R.c2 && R.r1 === R.r2) { say("Select two or more cells first (click and drag), then Merge & Center."); return; }
      pushHistory();
      var tl = rc(R.c1, R.r1), lost = [];
      eachRef(R, function (ref) {
        if (ref !== tl && st.data[ref] != null && st.data[ref] !== "") { lost.push(ref); delete st.data[ref]; }
      });
      st.merges.push(R);
      st.fmt[tl] = Object.assign({}, st.fmt[tl], { c: 1 });
      anchor = { c: R.c1, r: R.r1 }; focus = { c: R.c1, r: R.r1 };
      if (lost.length) {
        say("Merging keeps only the top-left value, so " + lost.join(", ") + (lost.length === 1 ? " lost its value." : " lost theirs.") +
          " Ctrl + Z brings " + (lost.length === 1 ? "it" : "them") + " back.");
      }
      changed(lost);
    }

    function fillInto(srcC, srcR, targets) {
      var src = raw(rc(srcC, srcR)), done = [];
      targets.forEach(function (t) {
        var ref = rc(t.c, t.r);
        if (!isEditable(ref) || (t.c === srcC && t.r === srcR)) return;
        var v = src == null ? "" : (String(src).trim()[0] === "=" ? shiftFormula(String(src), t.r - srcR, t.c - srcC) : src);
        setRaw(ref, v);
        done.push(ref);
      });
      return done;
    }
    function fillDir(down) {
      var R = selRect(), done = [];
      pushHistory();
      if (down) {
        var src = R.r1 === R.r2 ? R.r1 - 1 : R.r1;
        if (src < 1) { history.pop(); return; }
        for (var x = R.c1; x <= R.c2; x++) {
          var t = [];
          for (var y = src + 1; y <= R.r2; y++) t.push({ c: x, r: y });
          done = done.concat(fillInto(x, src, t));
        }
      } else {
        var srcc = R.c1 === R.c2 ? R.c1 - 1 : R.c1;
        if (srcc < 1) { history.pop(); return; }
        for (var yy = R.r1; yy <= R.r2; yy++) {
          var t2 = [];
          for (var xx = srcc + 1; xx <= R.c2; xx++) t2.push({ c: xx, r: yy });
          done = done.concat(fillInto(srcc, yy, t2));
        }
      }
      if (!done.length) { history.pop(); return; }
      changed(done);
    }

    function autofit(col) {
      if (!st.narrow[col]) return;
      pushHistory();
      delete st.narrow[col];
      changed([]);
      if (opts.onAutofit) opts.onAutofit(col);
    }

    // ---- events ----
    function cellFromEvent(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var td = el && el.closest ? el.closest("td[data-ref]") : null;
      if (!td || !table.contains(td)) return null;
      var p = splitRef(td.dataset.ref);
      return { c: p.col, r: p.row };
    }

    table.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      if (e.target.classList.contains("xl-handle")) {
        e.preventDefault(); e.stopPropagation();
        fillDrag = { c: anchor.c, r: anchor.r };
        fillPreview = { c1: anchor.c, r1: anchor.r, c2: anchor.c, r2: anchor.r };
        return;
      }
      var td = e.target.closest("td[data-ref]");
      if (!td) return;
      if (editing) commit();
      var p = splitRef(td.dataset.ref);
      if (e.shiftKey) select(p.col, p.row, true, false);
      else select(p.col, p.row, false, false);
      dragging = e.pointerType === "mouse";
      table.focus({ preventScroll: true });
      e.preventDefault();
    });
    document.addEventListener("pointermove", function (e) {
      if (fillDrag) {
        var cell = cellFromEvent(e);
        if (!cell) return;
        var dr = cell.r - fillDrag.r, dc = cell.c - fillDrag.c;
        fillPreview = Math.abs(dr) >= Math.abs(dc)
          ? { c1: fillDrag.c, c2: fillDrag.c, r1: Math.min(fillDrag.r, cell.r), r2: Math.max(fillDrag.r, cell.r) }
          : { r1: fillDrag.r, r2: fillDrag.r, c1: Math.min(fillDrag.c, cell.c), c2: Math.max(fillDrag.c, cell.c) };
        render();
        return;
      }
      if (!dragging) return;
      var cell2 = cellFromEvent(e);
      if (cell2 && (cell2.c !== focus.c || cell2.r !== focus.r)) { focus = cell2; render(); }
    });
    document.addEventListener("pointerup", function () {
      dragging = false;
      if (!fillDrag) return;
      var P = fillPreview, src = fillDrag;
      fillDrag = null; fillPreview = null;
      var targets = [];
      eachRef(P, function (ref, x, y) { targets.push({ c: x, r: y }); });
      pushHistory();
      var done = fillInto(src.c, src.r, targets);
      if (!done.length) { history.pop(); render(); return; }
      anchor = { c: P.c1, r: P.r1 }; focus = { c: P.c2, r: P.r2 };
      changed(done);
      table.focus({ preventScroll: true });
    });
    table.addEventListener("click", function (e) {
      var td = e.target.closest("td[data-ref]");
      if (!td || e.shiftKey) return;
      activate(td.dataset.ref, true);
      if (opts.clickToEdit && isEditable(td.dataset.ref)) startEdit(null);
    });
    table.addEventListener("dblclick", function (e) {
      var th = e.target.closest("th.xl-colhead");
      if (th) { autofit(th.dataset.col); return; }
      var td = e.target.closest("td[data-ref]");
      if (td && isEditable(td.dataset.ref)) startEdit(null);
    });

    table.addEventListener("keydown", function (e) {
      var act = anchorRef();
      if (e.ctrlKey || e.metaKey) {
        var k = e.key.toLowerCase();
        if (k === "z") { e.preventDefault(); undo(); }
        else if (k === "b" && toolBtns.bold) { e.preventDefault(); toggleFmt("b"); }
        else if (k === "d" && opts.fill) { e.preventDefault(); fillDir(true); }
        else if (k === "r" && opts.fill) { e.preventDefault(); fillDir(false); }
        return;
      }
      var arrows = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
      if (arrows[e.key]) { e.preventDefault(); move(arrows[e.key][0], arrows[e.key][1], e.shiftKey); return; }
      if (e.key === "Tab") { e.preventDefault(); move(e.shiftKey ? -1 : 1, 0, false); return; }
      if (e.key === "Enter") {
        e.preventDefault();
        if (isEditable(act) && !opts.clickToEdit) move(0, e.shiftKey ? -1 : 1, false);
        else if (isEditable(act)) startEdit(null);
        else activate(act, true);
        return;
      }
      if (e.key === "F2") { e.preventDefault(); startEdit(null); return; }
      if (e.key === " " && !isEditable(act)) { e.preventDefault(); activate(act, true); return; }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        var R = selRect(), gone = [];
        eachRef(R, function (ref) { if (isEditable(ref) && raw(ref) != null) gone.push(ref); });
        if (!gone.length) return;
        pushHistory();
        gone.forEach(function (ref) { delete st.data[ref]; });
        changed(gone);
        return;
      }
      if (e.key.length === 1 && !e.altKey && isEditable(act)) { e.preventDefault(); startEdit(e.key); }
    });

    input.addEventListener("focus", function () {
      if (isEditable(anchorRef()) && !editing) { editing = true; editRef = anchorRef(); }
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
        if (!opts.clickToEdit) move(0, e.shiftKey ? -1 : 1, false);
        table.focus({ preventScroll: true });
      } else if (e.key === "Tab") {
        e.preventDefault();
        commit();
        move(e.shiftKey ? -1 : 1, 0, false);
        table.focus({ preventScroll: true });
      } else if (e.key === "Escape") {
        editing = false;
        input.value = raw(anchorRef()) == null ? "" : String(raw(anchorRef()));
        table.focus({ preventScroll: true });
      }
    });
    input.addEventListener("blur", function () { commit(); });

    if (ribbon) {
      ribbon.addEventListener("mousedown", function (e) { e.preventDefault(); });
      ribbon.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        if (editing) commit();
        if (b.dataset.fill) setFill(b.dataset.fill);
        else if (b.dataset.tool === "undo") undo();
        else if (b.dataset.tool === "bold") toggleFmt("b");
        else if (b.dataset.tool === "center") toggleFmt("c");
        else if (b.dataset.tool === "wrap") toggleFmt("w");
        else if (b.dataset.tool === "borders") toggleFmt("bd");
        else if (b.dataset.tool === "merge") mergeToggle();
        table.focus({ preventScroll: true });
      });
    }

    // Measure again once the sheet becomes visible (a collapsed lesson step
    // has no width, so ##### can't be worked out until it opens).
    if (window.ResizeObserver) {
      var lastW = -1;
      new ResizeObserver(function () {
        var wNow = host.clientWidth;
        if (wNow !== lastW) { lastW = wNow; render(); }
      }).observe(host);
    }

    render();

    return {
      el: host,
      raw: raw,
      value: value,
      get: function (ref) { return st.data[ref]; },
      set: function (ref, v) { setRaw(ref, v); render(); },
      fmt: function (ref) { return Object.assign({}, st.fmt[ref]); },
      merges: function () { return st.merges.map(function (m) { return Object.assign({ name: rectName(m) }, m); }); },
      mergeAt: function (ref) { var p = splitRef(ref); return mergeAt(p.col, p.row); },
      isNarrow: function (col) { return Boolean(st.narrow[col]); },
      select: function (ref) { var p = splitRef(ref); select(p.col, p.row, false, false); },
      selected: function () { return anchorRef(); },
      hunt: function (on) { hunting = Boolean(on); host.classList.toggle("xl-hunting", hunting); render(); },
      focusFormula: function () { startEdit(null); },
      focus: function () { table.focus({ preventScroll: true }); },
      undo: undo,
      reset: function () {
        pushHistory();
        st = clone(init);
        changed(Object.keys(tds).filter(function (ref) { return isEditable(ref); }));
      },
      say: say,
      setMarks: function (m) { opts.marks = m || {}; render(); },
      render: render
    };
  }

  window.XLSheet = {
    create: create, evaluate: evaluate, refsIn: refsIn, show: show, isErr: isErr,
    colName: colName, splitRef: splitRef, shiftFormula: shiftFormula, rectOf: rectOf
  };
})();
