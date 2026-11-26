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
    if (/^-?\d+(\.\d+)?$/.test(s.trim())) return parseFloat(s);
    return s;
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
  function create(host, opts) {
    var cols = opts.cols || 6, rows = opts.rows || 5;
    var data = {};
    Object.keys(opts.data || {}).forEach(function (k) { data[k] = opts.data[k]; });
    var toggles = {}; (opts.toggles || []).forEach(function (r) { toggles[r] = true; });
    var editable = {}; (opts.editable || []).forEach(function (r) { editable[r] = true; });
    var selected = opts.select || "A1";
    var hunting = false;

    host.classList.add("xl");
    host.innerHTML = "";

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

    host.appendChild(bar);
    host.appendChild(scroller);

    var tds = {};
    var colHeads = [], rowHeads = [];
    var thead = document.createElement("tr");
    var corner = document.createElement("th");
    corner.className = "xl-corner";
    thead.appendChild(corner);
    for (var c = 1; c <= cols; c++) {
      var th = document.createElement("th");
      th.className = "xl-colhead";
      th.textContent = colName(c);
      var w = opts.widths && opts.widths[colName(c)];
      if (w) th.style.width = w;
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
        var ref = colName(c2) + r;
        var td = document.createElement("td");
        td.dataset.ref = ref;
        if (toggles[ref]) td.classList.add("xl-toggle");
        if (editable[ref]) td.classList.add("xl-editable");
        tds[ref] = td;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    function raw(ref) { return data[ref]; }
    function value(ref) { return evaluate(data[ref] == null ? "" : String(data[ref]), raw); }

    function render() {
      Object.keys(tds).forEach(function (ref) {
        var td = tds[ref], v = value(ref);
        td.textContent = show(v);
        td.classList.toggle("xl-num", typeof v === "number");
        td.classList.toggle("xl-err", Boolean(isErr(v)));
        td.classList.toggle("xl-on", Boolean(toggles[ref]) && v === 1);
        td.classList.toggle("xl-sel", ref === selected);
        td.title = isErr(v) ? v.why : "";
      });
      var s = splitRef(selected);
      colHeads.forEach(function (h, i) { if (h) h.classList.toggle("xl-headsel", s && i === s.col); });
      rowHeads.forEach(function (h, i) { if (h) h.classList.toggle("xl-headsel", s && i === s.row); });
      nameBox.textContent = selected;
      if (document.activeElement !== input) input.value = data[selected] == null ? "" : String(data[selected]);
      input.readOnly = !editable[selected];
      bar.classList.toggle("xl-bar-edit", Boolean(editable[selected]));
    }

    function select(ref, fromClick) {
      if (!tds[ref]) return;
      selected = ref;
      if (fromClick && toggles[ref] && !hunting) {
        data[ref] = value(ref) === 1 ? 0 : 1;
        if (opts.onChange) opts.onChange(ref, data[ref]);
      }
      render();
      if (opts.onSelect) opts.onSelect(ref, Boolean(fromClick));
    }

    table.addEventListener("click", function (e) {
      var td = e.target.closest("td[data-ref]");
      if (!td) return;
      select(td.dataset.ref, true);
      if (editable[td.dataset.ref]) { input.focus(); input.select(); }
    });

    table.addEventListener("keydown", function (e) {
      var s = splitRef(selected), moved = null;
      if (e.key === "ArrowRight") moved = [s.col + 1, s.row];
      else if (e.key === "ArrowLeft") moved = [s.col - 1, s.row];
      else if (e.key === "ArrowDown") moved = [s.col, s.row + 1];
      else if (e.key === "ArrowUp") moved = [s.col, s.row - 1];
      if (moved) {
        e.preventDefault();
        if (moved[0] >= 1 && moved[0] <= cols && moved[1] >= 1 && moved[1] <= rows) select(colName(moved[0]) + moved[1]);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (editable[selected]) { input.focus(); input.select(); }
        else select(selected, true);
      }
    });

    function commit() {
      if (!editable[selected]) return;
      var v = input.value.trim();
      data[selected] = v;
      render();
      if (opts.onChange) opts.onChange(selected, v);
    }
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); commit(); }
      if (e.key === "Escape") { input.value = data[selected] == null ? "" : String(data[selected]); input.blur(); }
    });
    input.addEventListener("blur", function () { if (editable[selected]) commit(); });

    render();

    return {
      el: host,
      raw: raw,
      value: value,
      get: function (ref) { return data[ref]; },
      set: function (ref, v) { data[ref] = v; render(); },
      select: function (ref) { select(ref); },
      selected: function () { return selected; },
      hunt: function (on) { hunting = Boolean(on); host.classList.toggle("xl-hunting", hunting); },
      focusFormula: function () { input.focus(); input.select(); },
      render: render
    };
  }

  window.XLSheet = { create: create, evaluate: evaluate, refsIn: refsIn, show: show, isErr: isErr, colName: colName };
})();
