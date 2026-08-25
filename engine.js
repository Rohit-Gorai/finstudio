/* ============================================================================
   FinStudio spreadsheet engine (v2) — headless.
   ----------------------------------------------------------------------------
   No DOM, no framework, no dependencies. Loads as a plain <script> and also
   works under `require` so it can be tested in node.

   Deliberately separate from js/engine.js (v1), which still powers all 38
   lessons. Nothing here touches that file; the two coexist until the lesson
   layer is ported sheet by sheet.

   What this adds over v1:
     · a workbook of named sheets with cross-sheet references
     · a real dependency graph — a change recalculates only what depends on it
     · compiled formulas (parsed once, cached), not re-parsed on every read
     · reference translation on copy/fill, in both axes, honouring $ anchors
     · Excel error values, including circular-reference detection
     · ~45 functions, weighted to financial modelling
     · an operation journal for undo/redo
     · number formats including negatives in parentheses and dash-for-zero
     · a grader that inspects formulas and precedents, not just displayed values
   ========================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else { root.FinSheets = api; root.LS2 = api; }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* ========================================================================
     Errors
     ===================================================================== */
  var ERR = {
    DIV0: "#DIV/0!", VALUE: "#VALUE!", REF: "#REF!", NAME: "#NAME?",
    NA: "#N/A", NUM: "#NUM!", NULL: "#NULL!", CIRC: "#CIRC!"
  };
  function err(code, detail) { return { err: code, detail: detail || null }; }
  function isErr(v) { return !!(v && typeof v === "object" && v.err); }

  /* ========================================================================
     Addresses
     ===================================================================== */
  function colToNum(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64);
    return n;
  }
  function numToCol(n) {
    var s = "";
    while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function addr(c, r) { return numToCol(c) + r; }

  // "$B$5" -> { c, r, ca, ra } where ca/ra record whether the $ anchor is set
  var RE_A1 = /^(\$?)([A-Z]+)(\$?)(\d+)$/;
  function parseA1(a) {
    var m = RE_A1.exec(String(a).toUpperCase());
    if (!m) return null;
    return { c: colToNum(m[2]), r: parseInt(m[4], 10), ca: m[1] === "$", ra: m[3] === "$" };
  }
  function formatA1(p) {
    return (p.ca ? "$" : "") + numToCol(p.c) + (p.ra ? "$" : "") + p.r;
  }
  // Excel's rule: anchored components never move, unanchored ones shift.
  function translateA1(p, dc, dr) {
    var c = p.ca ? p.c : p.c + dc;
    var r = p.ra ? p.r : p.r + dr;
    if (c < 1 || r < 1) return null;                 // off the sheet -> #REF!
    return { c: c, r: r, ca: p.ca, ra: p.ra };
  }

  /* ========================================================================
     Dates — Excel serial, 1900 system (day 0 = 1899-12-30)
     ===================================================================== */
  var EPOCH = Date.UTC(1899, 11, 30);
  function dateToSerial(y, m, d) { return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / 86400000); }
  function serialToParts(s) {
    var dt = new Date(EPOCH + Math.floor(s) * 86400000);
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }

  /* ========================================================================
     Input parsing — what the user typed becomes a value or a formula
     ===================================================================== */
  function parseNumber(str) {
    var s = String(str).trim();
    if (!s) return null;
    var neg = false;
    if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
    s = s.replace(/[₹$€£,\s]/g, "");
    if (s.charAt(0) === "-") { neg = !neg; s = s.slice(1); }
    var pct = false;
    if (s.slice(-1) === "%") { pct = true; s = s.slice(0, -1); }
    if (s.slice(-1) === "x" || s.slice(-1) === "X") s = s.slice(0, -1);
    if (!/^\d*\.?\d+$/.test(s)) return null;
    var v = parseFloat(s);
    if (pct) v = v / 100;
    return neg ? -v : v;
  }

  /* ========================================================================
     Tokenizer
     ---------------------------------------------------------------------
     Tokens carry their source span so a formula can be rewritten (for fill,
     or for a sheet rename) without a regex ever touching a string literal.
     ===================================================================== */
  function tokenize(src) {
    var toks = [], i = 0, n = src.length;
    while (i < n) {
      var start = i, ch = src[i];
      if (ch === " " || ch === "\t") { i++; continue; }

      if (ch === '"') {                                    // string literal
        var j = i + 1, str = "";
        while (j < n) {
          if (src[j] === '"' && src[j + 1] === '"') { str += '"'; j += 2; continue; }
          if (src[j] === '"') break;
          str += src[j++];
        }
        if (j >= n) throw err(ERR.VALUE, "Unterminated string");
        toks.push({ t: "str", v: str, s: start, e: j + 1 });
        i = j + 1; continue;
      }

      if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(src[i + 1] || ""))) {
        var j2 = i, num = "";
        while (j2 < n && /[0-9.]/.test(src[j2])) { num += src[j2]; j2++; }
        toks.push({ t: "num", v: parseFloat(num), s: start, e: j2 });
        i = j2; continue;
      }

      if (ch === "'") {                                    // 'Sheet Name'!A1
        var j3 = i + 1, name = "";
        while (j3 < n && src[j3] !== "'") name += src[j3++];
        if (src[j3] !== "'" || src[j3 + 1] !== "!") throw err(ERR.REF, "Bad sheet reference");
        j3 += 2;
        var refStart = j3;
        while (j3 < n && /[A-Za-z0-9$:]/.test(src[j3])) j3++;
        toks.push({ t: "ref", sheet: name, v: src.slice(refStart, j3).toUpperCase(), s: start, e: j3, quoted: true });
        i = j3; continue;
      }

      if (/[A-Za-z$_]/.test(ch)) {
        var j4 = i, word = "";
        while (j4 < n && /[A-Za-z0-9$_.]/.test(src[j4])) { word += src[j4]; j4++; }
        // Sheet1!B2 — unquoted sheet reference
        if (src[j4] === "!" && !RE_A1.test(word.toUpperCase())) {
          j4++;
          var rs = j4;
          while (j4 < n && /[A-Za-z0-9$:]/.test(src[j4])) j4++;
          toks.push({ t: "ref", sheet: word, v: src.slice(rs, j4).toUpperCase(), s: start, e: j4 });
          i = j4; continue;
        }
        var up = word.toUpperCase();
        if (RE_A1.test(up)) toks.push({ t: "ref", v: up, s: start, e: j4 });
        else if (up === "TRUE") toks.push({ t: "bool", v: true, s: start, e: j4 });
        else if (up === "FALSE") toks.push({ t: "bool", v: false, s: start, e: j4 });
        else toks.push({ t: "name", v: up, s: start, e: j4 });
        i = j4; continue;
      }

      var two = src.substr(i, 2);
      if (two === "<=" || two === ">=" || two === "<>") { toks.push({ t: "op", v: two, s: start, e: i + 2 }); i += 2; continue; }
      if ("+-*/^%()=<>:,&".indexOf(ch) >= 0) { toks.push({ t: "op", v: ch, s: start, e: i + 1 }); i++; continue; }
      throw err(ERR.NAME, "Unexpected '" + ch + "'");
    }
    return toks;
  }

  /* ========================================================================
     Parser — precedence climbing, producing an AST
     ===================================================================== */
  function parse(toks) {
    var p = 0;
    function peek() { return toks[p]; }
    function eat(v) {
      var t = toks[p];
      if (!t || t.t !== "op" || t.v !== v) throw err(ERR.NAME, "Expected '" + v + "'");
      p++; return t;
    }
    function parseExpr() { return parseCompare(); }

    function parseCompare() {
      var l = parseConcat();
      while (peek() && peek().t === "op" && ["=", "<", ">", "<=", ">=", "<>"].indexOf(peek().v) >= 0) {
        var op = toks[p++].v;
        l = { k: "cmp", op: op, l: l, r: parseConcat() };
      }
      return l;
    }
    function parseConcat() {
      var l = parseAdd();
      while (peek() && peek().t === "op" && peek().v === "&") {
        p++; l = { k: "concat", l: l, r: parseAdd() };
      }
      return l;
    }
    function parseAdd() {
      var l = parseMul();
      while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) {
        var op = toks[p++].v;
        l = { k: "bin", op: op, l: l, r: parseMul() };
      }
      return l;
    }
    function parseMul() {
      var l = parsePow();
      while (peek() && peek().t === "op" && (peek().v === "*" || peek().v === "/")) {
        var op = toks[p++].v;
        l = { k: "bin", op: op, l: l, r: parsePow() };
      }
      return l;
    }
    function parsePow() {
      var l = parseUnary();
      if (peek() && peek().t === "op" && peek().v === "^") {
        p++; return { k: "bin", op: "^", l: l, r: parsePow() };   // right associative
      }
      return l;
    }
    function parseUnary() {
      if (peek() && peek().t === "op" && (peek().v === "-" || peek().v === "+")) {
        var op = toks[p++].v;
        var x = parseUnary();
        return op === "-" ? { k: "neg", x: x } : x;
      }
      return parsePostfix();
    }
    function parsePostfix() {
      var x = parsePrimary();
      while (peek() && peek().t === "op" && peek().v === "%") { p++; x = { k: "pct", x: x }; }
      return x;
    }
    function parsePrimary() {
      var t = peek();
      if (!t) throw err(ERR.NAME, "Unexpected end of formula");
      if (t.t === "num")  { p++; return { k: "num", v: t.v }; }
      if (t.t === "str")  { p++; return { k: "str", v: t.v }; }
      if (t.t === "bool") { p++; return { k: "bool", v: t.v }; }
      if (t.t === "ref") {
        p++;
        // a range written as two tokens: A1 : B9
        if (peek() && peek().t === "op" && peek().v === ":" && toks[p + 1] && toks[p + 1].t === "ref") {
          var b = toks[p + 1]; p += 2;
          return { k: "range", sheet: t.sheet || b.sheet || null, a: t.v, b: b.v };
        }
        // a range already inside one token: 'Sheet'!A1:B9
        if (t.v.indexOf(":") > 0) {
          var parts = t.v.split(":");
          return { k: "range", sheet: t.sheet || null, a: parts[0], b: parts[1] };
        }
        return { k: "ref", sheet: t.sheet || null, v: t.v };
      }
      if (t.t === "name") {
        p++;
        if (peek() && peek().t === "op" && peek().v === "(") {
          p++;
          var args = [];
          if (peek() && peek().t === "op" && peek().v === ")") { p++; return { k: "call", name: t.v, args: args }; }
          for (;;) {
            args.push(parseExpr());
            if (peek() && peek().t === "op" && peek().v === ",") { p++; continue; }
            eat(")"); break;
          }
          return { k: "call", name: t.v, args: args };
        }
        return { k: "namedRef", v: t.v };
      }
      if (t.t === "op" && t.v === "(") {
        p++; var e = parseExpr(); eat(")"); return e;
      }
      throw err(ERR.NAME, "Unexpected token");
    }

    var out = parseExpr();
    if (p < toks.length) throw err(ERR.NAME, "Trailing input");
    return out;
  }

  function compile(formula) {
    return parse(tokenize(formula));
  }

  /* ========================================================================
     Reference translation — the mechanic that makes fill and copy real
     ---------------------------------------------------------------------
     Rewrites the SOURCE TEXT, not the AST, so the result is a formula string
     a learner can read in the formula bar. Works off token spans, so string
     literals and function names are never touched.
     ===================================================================== */
  function translateFormula(formula, dc, dr) {
    var body = formula.charAt(0) === "=" ? formula.slice(1) : formula;
    var toks;
    try { toks = tokenize(body); } catch (e) { return formula; }
    var out = "", cursor = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.t !== "ref") continue;
      var pieces = t.v.split(":");
      var moved = [];
      for (var j = 0; j < pieces.length; j++) {
        var p = parseA1(pieces[j]);
        if (!p) { moved = null; break; }
        var m = translateA1(p, dc, dr);
        if (!m) { moved = [ERR.REF]; break; }
        moved.push(formatA1(m));
      }
      if (!moved) continue;
      var replacement = moved.join(":");
      // keep the sheet prefix exactly as the learner wrote it
      var srcText = body.slice(t.s, t.e);
      var bang = srcText.lastIndexOf("!");
      if (bang >= 0) replacement = srcText.slice(0, bang + 1) + replacement;
      out += body.slice(cursor, t.s) + replacement;
      cursor = t.e;
    }
    out += body.slice(cursor);
    return "=" + out;
  }

  // Rewrite sheet prefixes when a sheet is renamed.
  function renameSheetInFormula(formula, from, to) {
    var body = formula.charAt(0) === "=" ? formula.slice(1) : formula;
    var toks;
    try { toks = tokenize(body); } catch (e) { return formula; }
    var out = "", cursor = 0, lf = from.toLowerCase();
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.t !== "ref" || !t.sheet || t.sheet.toLowerCase() !== lf) continue;
      // keep the quoting the learner wrote — a rename shouldn't restyle their formula
      var needsQuote = /[^A-Za-z0-9_]/.test(to) || t.quoted;
      var prefix = needsQuote ? "'" + to + "'!" : to + "!";
      out += body.slice(cursor, t.s) + prefix + t.v;
      cursor = t.e;
    }
    out += body.slice(cursor);
    return "=" + out;
  }

  // Every cell a formula reads — used by the grader and by "show precedents".
  function precedentsOf(formula, defaultSheet) {
    var body = formula.charAt(0) === "=" ? formula.slice(1) : formula;
    var toks;
    try { toks = tokenize(body); } catch (e) { return []; }
    var out = [];
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.t !== "ref") continue;
      var sheet = t.sheet || defaultSheet || null;
      var pieces = t.v.split(":");
      if (pieces.length === 2) {
        var a = parseA1(pieces[0]), b = parseA1(pieces[1]);
        if (!a || !b) continue;
        for (var c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++)
          for (var r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++)
            out.push((sheet ? sheet + "!" : "") + addr(c, r));
      } else {
        var p = parseA1(pieces[0]);
        if (p) out.push((sheet ? sheet + "!" : "") + addr(p.c, p.r));
      }
    }
    return out;
  }

  /* ========================================================================
     Coercion helpers
     ===================================================================== */
  function num(v) {
    if (v == null || v === "") return 0;
    if (isErr(v)) throw v;
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    var n = parseNumber(v);
    if (n == null) throw err(ERR.VALUE, "Expected a number, got text");
    return n;
  }
  function text(v) {
    if (isErr(v)) throw v;
    if (v == null) return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    return String(v);
  }
  function bool(v) {
    if (isErr(v)) throw v;
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (v == null || v === "") return false;
    var s = String(v).toUpperCase();
    if (s === "TRUE") return true;
    if (s === "FALSE") return false;
    return !!num(v);
  }
  function flatten(args) {                    // ranges arrive as arrays
    var out = [];
    for (var i = 0; i < args.length; i++) {
      if (Array.isArray(args[i])) out = out.concat(flatten(args[i]));
      else out.push(args[i]);
    }
    return out;
  }
  function numbersIn(args) {
    return flatten(args).filter(function (v) {
      if (isErr(v)) throw v;
      return typeof v === "number";
    });
  }

  /* ========================================================================
     Criteria — the ">100" / "<>0" / "Rent" strings SUMIF & co. accept
     ===================================================================== */
  function makeMatcher(criteria) {
    if (typeof criteria === "number" || typeof criteria === "boolean") {
      return function (v) { return v === criteria; };
    }
    var s = String(criteria).trim();
    var m = /^(<=|>=|<>|<|>|=)(.*)$/.exec(s);
    if (m) {
      var op = m[1], rhsRaw = m[2].trim();
      var rhsNum = parseNumber(rhsRaw);
      return function (v) {
        if (rhsNum != null && typeof v === "number") {
          switch (op) {
            case "<": return v < rhsNum; case "<=": return v <= rhsNum;
            case ">": return v > rhsNum; case ">=": return v >= rhsNum;
            case "=": return v === rhsNum; case "<>": return v !== rhsNum;
          }
        }
        var a = String(v == null ? "" : v).toUpperCase(), b = rhsRaw.toUpperCase();
        return op === "<>" ? a !== b : op === "=" ? a === b : false;
      };
    }
    return function (v) {
      return String(v == null ? "" : v).toUpperCase() === s.toUpperCase();
    };
  }

  /* ========================================================================
     Function library
     ===================================================================== */
  function npv(rate, values) {
    var s = 0;
    for (var i = 0; i < values.length; i++) s += values[i] / Math.pow(1 + rate, i + 1);
    return s;
  }
  function solve(f, lo, hi) {                 // bisection, used as IRR's safety net
    var flo = f(lo), fhi = f(hi);
    if (isNaN(flo) || isNaN(fhi) || flo * fhi > 0) return null;
    for (var i = 0; i < 200; i++) {
      var mid = (lo + hi) / 2, fm = f(mid);
      if (Math.abs(fm) < 1e-9 || (hi - lo) < 1e-12) return mid;
      if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
    }
    return (lo + hi) / 2;
  }

  var FUNCS = {
    /* --- aggregation --- */
    SUM: function () { return numbersIn(arguments).reduce(function (a, b) { return a + b; }, 0); },
    AVERAGE: function () {
      var n = numbersIn(arguments);
      if (!n.length) return err(ERR.DIV0);
      return n.reduce(function (a, b) { return a + b; }, 0) / n.length;
    },
    MIN: function () { var n = numbersIn(arguments); return n.length ? Math.min.apply(null, n) : 0; },
    MAX: function () { var n = numbersIn(arguments); return n.length ? Math.max.apply(null, n) : 0; },
    COUNT: function () { return numbersIn(arguments).length; },
    COUNTA: function () {
      return flatten([].slice.call(arguments)).filter(function (v) { return v != null && v !== ""; }).length;
    },
    PRODUCT: function () { return numbersIn(arguments).reduce(function (a, b) { return a * b; }, 1); },

    /* --- logic --- */
    IF: function (c, a, b) { return bool(c) ? a : (arguments.length > 2 ? b : false); },
    IFS: function () {
      for (var i = 0; i + 1 < arguments.length; i += 2) if (bool(arguments[i])) return arguments[i + 1];
      return err(ERR.NA);
    },
    AND: function () { return flatten([].slice.call(arguments)).every(bool); },
    OR: function () { return flatten([].slice.call(arguments)).some(bool); },
    NOT: function (v) { return !bool(v); },
    IFERROR: function (v, alt) { return isErr(v) ? alt : v; },
    IFNA: function (v, alt) { return (isErr(v) && v.err === ERR.NA) ? alt : v; },

    /* --- maths --- */
    ABS: function (v) { return Math.abs(num(v)); },
    ROUND: function (v, d) {
      var f = Math.pow(10, num(d || 0));
      return Math.round(num(v) * f * (1 + Number.EPSILON)) / f;
    },
    ROUNDUP: function (v, d) { var f = Math.pow(10, num(d || 0)); var x = num(v); return (x < 0 ? -1 : 1) * Math.ceil(Math.abs(x) * f) / f; },
    ROUNDDOWN: function (v, d) { var f = Math.pow(10, num(d || 0)); var x = num(v); return (x < 0 ? -1 : 1) * Math.floor(Math.abs(x) * f) / f; },
    INT: function (v) { return Math.floor(num(v)); },
    MOD: function (a, b) { var d = num(b); if (d === 0) return err(ERR.DIV0); return num(a) - d * Math.floor(num(a) / d); },
    SQRT: function (v) { var x = num(v); return x < 0 ? err(ERR.NUM) : Math.sqrt(x); },
    POWER: function (a, b) { return Math.pow(num(a), num(b)); },
    CEILING: function (v, s) { var st = num(s == null ? 1 : s); return st === 0 ? 0 : Math.ceil(num(v) / st) * st; },
    FLOOR: function (v, s) { var st = num(s == null ? 1 : s); return st === 0 ? 0 : Math.floor(num(v) / st) * st; },

    /* --- conditional aggregation --- */
    SUMIF: function (range, criteria, sumRange) {
      var r = flatten([range]), s = sumRange ? flatten([sumRange]) : r, m = makeMatcher(criteria), t = 0;
      for (var i = 0; i < r.length; i++) if (m(r[i]) && typeof s[i] === "number") t += s[i];
      return t;
    },
    SUMIFS: function (sumRange) {
      var s = flatten([sumRange]), pairs = [], t = 0;
      for (var i = 1; i + 1 < arguments.length + 1 && arguments[i] !== undefined; i += 2)
        pairs.push({ r: flatten([arguments[i]]), m: makeMatcher(arguments[i + 1]) });
      for (var j = 0; j < s.length; j++) {
        var ok = pairs.every(function (p) { return p.m(p.r[j]); });
        if (ok && typeof s[j] === "number") t += s[j];
      }
      return t;
    },
    COUNTIF: function (range, criteria) {
      var r = flatten([range]), m = makeMatcher(criteria);
      return r.filter(m).length;
    },
    COUNTIFS: function () {
      var pairs = [];
      for (var i = 0; i + 1 < arguments.length; i += 2)
        pairs.push({ r: flatten([arguments[i]]), m: makeMatcher(arguments[i + 1]) });
      if (!pairs.length) return 0;
      var n = pairs[0].r.length, c = 0;
      for (var j = 0; j < n; j++) if (pairs.every(function (p) { return p.m(p.r[j]); })) c++;
      return c;
    },
    AVERAGEIF: function (range, criteria, avgRange) {
      var r = flatten([range]), s = avgRange ? flatten([avgRange]) : r, m = makeMatcher(criteria), t = 0, n = 0;
      for (var i = 0; i < r.length; i++) if (m(r[i]) && typeof s[i] === "number") { t += s[i]; n++; }
      return n ? t / n : err(ERR.DIV0);
    },

    /* --- lookup --- */
    INDEX: function (range, rowNum, colNum) {
      var grid = Array.isArray(range) ? range : [[range]];
      var is2d = Array.isArray(grid[0]);
      var rows = is2d ? grid : [grid];
      var r = num(rowNum), c = colNum == null ? 1 : num(colNum);
      if (rows.length === 1 && colNum == null && r > 1) { c = r; r = 1; }  // single row
      if (rows[0].length === 1 && colNum == null) c = 1;
      var row = rows[r - 1];
      if (!row) return err(ERR.REF);
      var v = row[c - 1];
      return v === undefined ? err(ERR.REF) : v;
    },
    MATCH: function (needle, range, type) {
      var arr = flatten([range]), t = type == null ? 1 : num(type);
      if (t === 0) {
        var m = makeMatcher(needle);
        for (var i = 0; i < arr.length; i++) if (m(arr[i])) return i + 1;
        return err(ERR.NA);
      }
      var best = -1, target = num(needle);
      for (var j = 0; j < arr.length; j++) {
        if (typeof arr[j] !== "number") continue;
        if (t === 1 && arr[j] <= target) best = j;
        if (t === -1 && arr[j] >= target) best = j;
      }
      return best < 0 ? err(ERR.NA) : best + 1;
    },
    VLOOKUP: function (needle, range, colIndex, approx) {
      var grid = Array.isArray(range) && Array.isArray(range[0]) ? range : [flatten([range])];
      var ci = num(colIndex), ap = approx == null ? true : bool(approx);
      var m = makeMatcher(needle), fallback = null;
      for (var i = 0; i < grid.length; i++) {
        var key = grid[i][0];
        if (m(key)) return grid[i][ci - 1];
        if (ap && typeof key === "number" && typeof needle === "number" && key <= needle) fallback = grid[i][ci - 1];
      }
      return ap && fallback !== null ? fallback : err(ERR.NA);
    },
    HLOOKUP: function (needle, range, rowIndex) {
      var grid = Array.isArray(range) && Array.isArray(range[0]) ? range : [flatten([range])];
      var ri = num(rowIndex), m = makeMatcher(needle);
      for (var c = 0; c < grid[0].length; c++) if (m(grid[0][c])) return grid[ri - 1][c];
      return err(ERR.NA);
    },
    XLOOKUP: function (needle, lookupRange, returnRange, ifNotFound) {
      var l = flatten([lookupRange]), r = flatten([returnRange]), m = makeMatcher(needle);
      for (var i = 0; i < l.length; i++) if (m(l[i])) return r[i];
      return ifNotFound === undefined ? err(ERR.NA) : ifNotFound;
    },

    /* --- finance --- */
    NPV: function (rate) { return npv(num(rate), numbersIn([].slice.call(arguments, 1))); },
    IRR: function (values, guess) {
      var v = numbersIn([values]);
      if (v.length < 2) return err(ERR.NUM);
      var f = function (r) {
        var s = 0;
        for (var i = 0; i < v.length; i++) s += v[i] / Math.pow(1 + r, i);
        return s;
      };
      var r0 = guess == null ? 0.1 : num(guess);
      for (var k = 0; k < 60; k++) {                      // Newton
        var fr = f(r0), d = (f(r0 + 1e-6) - fr) / 1e-6;
        if (!isFinite(d) || d === 0) break;
        var next = r0 - fr / d;
        if (!isFinite(next) || next <= -1) break;
        if (Math.abs(next - r0) < 1e-10) return next;
        r0 = next;
      }
      var b = solve(f, -0.9999, 10);
      return b == null ? err(ERR.NUM) : b;
    },
    XNPV: function (rate, values, dates) {
      var v = numbersIn([values]), d = numbersIn([dates]), r = num(rate);
      if (v.length !== d.length || !v.length) return err(ERR.NUM);
      var s = 0;
      for (var i = 0; i < v.length; i++) s += v[i] / Math.pow(1 + r, (d[i] - d[0]) / 365);
      return s;
    },
    XIRR: function (values, dates, guess) {
      var v = numbersIn([values]), d = numbersIn([dates]);
      if (v.length !== d.length || v.length < 2) return err(ERR.NUM);
      var f = function (r) {
        var s = 0;
        for (var i = 0; i < v.length; i++) s += v[i] / Math.pow(1 + r, (d[i] - d[0]) / 365);
        return s;
      };
      var r0 = guess == null ? 0.1 : num(guess);
      for (var k = 0; k < 80; k++) {
        var fr = f(r0), der = (f(r0 + 1e-7) - fr) / 1e-7;
        if (!isFinite(der) || der === 0) break;
        var nx = r0 - fr / der;
        if (!isFinite(nx) || nx <= -1) break;
        if (Math.abs(nx - r0) < 1e-11) return nx;
        r0 = nx;
      }
      var b2 = solve(f, -0.9999, 10);
      return b2 == null ? err(ERR.NUM) : b2;
    },
    PMT: function (rate, nper, pv, fv, type) {
      var r = num(rate), n = num(nper), p = num(pv), f = fv == null ? 0 : num(fv), t = type == null ? 0 : num(type);
      if (n === 0) return err(ERR.NUM);
      if (r === 0) return -(p + f) / n;
      var pow = Math.pow(1 + r, n);
      return -(p * pow + f) * r / ((pow - 1) * (1 + r * t));
    },
    PV: function (rate, nper, pmt, fv, type) {
      var r = num(rate), n = num(nper), c = num(pmt), f = fv == null ? 0 : num(fv), t = type == null ? 0 : num(type);
      if (r === 0) return -(c * n + f);
      var pow = Math.pow(1 + r, n);
      return -(c * (1 + r * t) * (pow - 1) / r + f) / pow;
    },
    FV: function (rate, nper, pmt, pv, type) {
      var r = num(rate), n = num(nper), c = num(pmt), p = pv == null ? 0 : num(pv), t = type == null ? 0 : num(type);
      if (r === 0) return -(p + c * n);
      var pow = Math.pow(1 + r, n);
      return -(p * pow + c * (1 + r * t) * (pow - 1) / r);
    },

    /* --- text --- */
    LEN: function (v) { return text(v).length; },
    LEFT: function (v, n) { return text(v).slice(0, n == null ? 1 : num(n)); },
    RIGHT: function (v, n) { var s = text(v), k = n == null ? 1 : num(n); return k <= 0 ? "" : s.slice(-k); },
    MID: function (v, start, len) { return text(v).substr(num(start) - 1, num(len)); },
    TRIM: function (v) { return text(v).trim().replace(/\s+/g, " "); },
    UPPER: function (v) { return text(v).toUpperCase(); },
    LOWER: function (v) { return text(v).toLowerCase(); },
    CONCAT: function () { return flatten([].slice.call(arguments)).map(text).join(""); },
    TEXTJOIN: function (sep, ignoreEmpty) {
      var parts = flatten([].slice.call(arguments, 2)).map(text);
      if (bool(ignoreEmpty)) parts = parts.filter(function (s) { return s !== ""; });
      return parts.join(text(sep));
    },

    /* --- dates --- */
    DATE: function (y, m, d) { return dateToSerial(num(y), num(m), num(d)); },
    YEAR: function (s) { return serialToParts(num(s)).y; },
    MONTH: function (s) { return serialToParts(num(s)).m; },
    DAY: function (s) { return serialToParts(num(s)).d; },
    EDATE: function (s, months) {
      var p = serialToParts(num(s)), m = p.m - 1 + num(months);
      var y = p.y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12;
      var last = new Date(Date.UTC(y, mm + 1, 0)).getUTCDate();
      return dateToSerial(y, mm + 1, Math.min(p.d, last));
    },
    EOMONTH: function (s, months) {
      var p = serialToParts(num(s)), m = p.m - 1 + num(months) + 1;
      var y = p.y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12;
      return dateToSerial(y, mm + 1, 0) === 0 ? dateToSerial(y, mm + 1, 1) - 1
        : Math.round((Date.UTC(y, mm, 0) - EPOCH) / 86400000);
    },
    YEARFRAC: function (a, b) { return (num(b) - num(a)) / 365; },
    TODAY: function () {
      var n = new Date();
      return dateToSerial(n.getFullYear(), n.getMonth() + 1, n.getDate());
    }
  };

  var FUNC_HELP = {
    SUM: "Adds numbers. SUM(number1, [number2], …)",
    AVERAGE: "Mean of the numbers. AVERAGE(number1, …)",
    IF: "One value if true, another if false. IF(test, if_true, [if_false])",
    IFERROR: "Falls back when a formula errors. IFERROR(value, if_error)",
    NPV: "Present value of a series, discounted from period 1. NPV(rate, value1, …)",
    IRR: "Rate at which NPV is zero. IRR(values, [guess])",
    XNPV: "NPV on actual dates. XNPV(rate, values, dates)",
    XIRR: "IRR on actual dates. XIRR(values, dates, [guess])",
    PMT: "Loan payment per period. PMT(rate, nper, pv, [fv], [type])",
    XLOOKUP: "Finds a value and returns another. XLOOKUP(needle, lookup, return, [if_missing])",
    INDEX: "Value at a position. INDEX(range, row, [col])",
    MATCH: "Position of a value. MATCH(needle, range, [type])",
    SUMIFS: "Conditional sum. SUMIFS(sum_range, range1, criteria1, …)",
    EOMONTH: "Last day of a month, offset. EOMONTH(date, months)"
  };

  /* ========================================================================
     Number formats
     ===================================================================== */
  var groupIN = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  function groupDec(v, d, locale) {
    return new Intl.NumberFormat(locale || "en-IN",
      { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  }
  var SYMBOL = { inr: "₹", usd: "$", eur: "€", gbp: "£", jpy: "¥" };

  // fmt: { type, dp, currency, parens, dashZero }
  function formatValue(v, fmt) {
    if (isErr(v)) return v.err;
    if (v == null || v === "") return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    if (typeof v === "string") return v;
    fmt = fmt || {};
    var type = fmt.type || "general";
    var dp = fmt.dp == null ? (type === "pct" || type === "x" ? 1 : 0) : fmt.dp;
    var parens = fmt.parens !== false;                  // finance default
    if (fmt.dashZero && Math.abs(v) < 1e-9) return "—";

    var neg = v < 0, a = Math.abs(v), body;
    switch (type) {
      case "pct": body = groupDec(a * 100, dp, "en-US") + "%"; break;
      case "x":   body = groupDec(a, dp, "en-US") + "x"; break;
      case "date": var p = serialToParts(v);
        return String(p.d).padStart(2, "0") + "/" + String(p.m).padStart(2, "0") + "/" + p.y;
      case "currency":
        body = (SYMBOL[fmt.currency || "inr"] || "") + groupDec(a, dp, fmt.currency === "inr" || !fmt.currency ? "en-IN" : "en-US");
        break;
      case "number": body = groupDec(a, dp, fmt.locale); break;
      default:
        body = a === Math.round(a) ? groupIN.format(a) : groupDec(a, 2);
    }
    if (!neg) return body;
    return parens ? "(" + body + ")" : "-" + body;
  }

  /* ========================================================================
     Workbook
     ===================================================================== */
  function Cell(raw) {
    this.raw = raw == null ? "" : String(raw);
    this.fmt = null; this.style = null; this.note = null;
    this.locked = false;                                 // lesson-supplied cells
  }

  function Workbook(opts) {
    opts = opts || {};
    this.sheets = [];
    this.byName = {};
    this._cache = {};        // "Sheet!A1" -> value
    this._deps = {};         // "Sheet!A1" -> { dependentKey: true }
    this._journal = [];
    this._redo = [];
    this._batch = null;
    (opts.sheets || ["Sheet1"]).forEach(this.addSheet, this);
  }

  Workbook.prototype.addSheet = function (name, at) {
    var n = String(name);
    if (this.byName[n.toLowerCase()]) throw new Error("Duplicate sheet: " + n);
    var sheet = { name: n, cells: {}, colWidths: {}, rowHeights: {}, frozen: { rows: 0, cols: 0 } };
    if (at == null) this.sheets.push(sheet); else this.sheets.splice(at, 0, sheet);
    this.byName[n.toLowerCase()] = sheet;
    return sheet;
  };

  Workbook.prototype.sheet = function (name) {
    if (name == null) return this.sheets[0];
    return this.byName[String(name).toLowerCase()] || null;
  };

  Workbook.prototype.renameSheet = function (from, to) {
    var s = this.sheet(from);
    if (!s) return false;
    if (this.byName[String(to).toLowerCase()] && s.name.toLowerCase() !== String(to).toLowerCase()) return false;
    delete this.byName[s.name.toLowerCase()];
    var old = s.name;
    s.name = String(to);
    this.byName[s.name.toLowerCase()] = s;
    // every formula pointing at the old name follows it
    this.sheets.forEach(function (sh) {
      Object.keys(sh.cells).forEach(function (a) {
        var c = sh.cells[a];
        if (c.raw.charAt(0) === "=") c.raw = renameSheetInFormula(c.raw, old, s.name);
      });
    });
    this.recalcAll();
    return true;
  };

  Workbook.prototype.removeSheet = function (name) {
    var s = this.sheet(name);
    if (!s || this.sheets.length === 1) return false;
    this.sheets.splice(this.sheets.indexOf(s), 1);
    delete this.byName[s.name.toLowerCase()];
    this.recalcAll();
    return true;
  };

  function key(sheetName, a) { return sheetName + "!" + a.toUpperCase(); }

  Workbook.prototype.cell = function (sheetName, a) {
    var s = this.sheet(sheetName);
    return s ? s.cells[a.toUpperCase()] || null : null;
  };
  Workbook.prototype.raw = function (sheetName, a) {
    var c = this.cell(sheetName, a);
    return c ? c.raw : "";
  };
  Workbook.prototype.isFormula = function (sheetName, a) {
    return this.raw(sheetName, a).charAt(0) === "=";
  };

  /* ---- writing ---- */
  Workbook.prototype.setRaw = function (sheetName, a, raw, opts) {
    var s = this.sheet(sheetName);
    if (!s) return false;
    var A = a.toUpperCase(), k = key(s.name, A);
    var before = s.cells[A] ? s.cells[A].raw : "";
    var value = raw == null ? "" : String(raw);
    if (before === value) return true;

    if (!s.cells[A]) s.cells[A] = new Cell("");
    s.cells[A].raw = value;
    if (!(opts && opts.silent)) this._record({ t: "set", sheet: s.name, a: A, before: before, after: value });
    this._invalidate(k);
    return true;
  };

  Workbook.prototype.setFormat = function (sheetName, a, fmt) {
    var s = this.sheet(sheetName);
    if (!s) return false;
    var A = a.toUpperCase();
    if (!s.cells[A]) s.cells[A] = new Cell("");
    var before = s.cells[A].fmt;
    s.cells[A].fmt = fmt;
    this._record({ t: "fmt", sheet: s.name, a: A, before: before, after: fmt });
    return true;
  };

  Workbook.prototype.setNote = function (sheetName, a, note) {
    var s = this.sheet(sheetName);
    if (!s) return false;
    var A = a.toUpperCase();
    if (!s.cells[A]) s.cells[A] = new Cell("");
    var before = s.cells[A].note;
    s.cells[A].note = note;
    this._record({ t: "note", sheet: s.name, a: A, before: before, after: note });
    return true;
  };

  /* ---- dependency-driven invalidation ----
     Drop this cell's cached value, then everything that read it, transitively.
     That is the whole recalculation story: nothing else is recomputed. */
  Workbook.prototype._invalidate = function (k) {
    var stack = [k], seen = {};
    while (stack.length) {
      var cur = stack.pop();
      if (seen[cur]) continue;
      seen[cur] = true;
      delete this._cache[cur];
      var d = this._deps[cur];
      if (d) Object.keys(d).forEach(function (x) { if (!seen[x]) stack.push(x); });
    }
  };
  Workbook.prototype.recalcAll = function () { this._cache = {}; this._deps = {}; };

  Workbook.prototype._register = function (from, to) {
    if (!this._deps[to]) this._deps[to] = {};
    this._deps[to][from] = true;
  };

  /* ---- reading ---- */
  Workbook.prototype.value = function (sheetName, a) {
    var s = this.sheet(sheetName);
    if (!s) return err(ERR.REF);
    return this._value(s.name, a.toUpperCase(), {});
  };

  Workbook.prototype._value = function (sheetName, A, visiting) {
    var k = key(sheetName, A);
    if (Object.prototype.hasOwnProperty.call(this._cache, k)) return this._cache[k];
    if (visiting[k]) return err(ERR.CIRC);

    var s = this.sheet(sheetName);
    var cell = s && s.cells[A];
    var raw = cell ? cell.raw : "";
    var out;

    if (raw === "") out = null;
    else if (raw.charAt(0) === "=") {
      visiting[k] = true;
      try {
        if (!cell._ast || cell._astSrc !== raw) { cell._ast = compile(raw.slice(1)); cell._astSrc = raw; }
        out = this._eval(cell._ast, sheetName, k, visiting);
      } catch (e) {
        out = isErr(e) ? e : err(ERR.VALUE, e && e.message);
      }
      delete visiting[k];
    } else {
      var n = parseNumber(raw);
      out = n == null ? raw : n;
    }
    // a circular result must not be cached: the cycle may be broken next edit
    if (!(isErr(out) && out.err === ERR.CIRC)) this._cache[k] = out;
    return out;
  };

  Workbook.prototype._rangeValues = function (sheetName, a, b, fromKey, visiting) {
    var pa = parseA1(a), pb = parseA1(b);
    if (!pa || !pb) throw err(ERR.REF);
    var c1 = Math.min(pa.c, pb.c), c2 = Math.max(pa.c, pb.c);
    var r1 = Math.min(pa.r, pb.r), r2 = Math.max(pa.r, pb.r);
    if ((c2 - c1 + 1) * (r2 - r1 + 1) > 250000) throw err(ERR.NUM, "Range too large");
    var grid = [];
    for (var r = r1; r <= r2; r++) {
      var row = [];
      for (var c = c1; c <= c2; c++) {
        var A = addr(c, r);
        if (fromKey) this._register(fromKey, key(sheetName, A));
        row.push(this._value(sheetName, A, visiting));
      }
      grid.push(row);
    }
    return grid;
  };

  Workbook.prototype._eval = function (node, sheetName, fromKey, visiting) {
    var self = this;
    switch (node.k) {
      case "num": case "str": case "bool": return node.v;

      case "ref": {
        var sn = node.sheet ? (this.sheet(node.sheet) ? this.sheet(node.sheet).name : null) : sheetName;
        if (!sn) return err(ERR.REF);
        var p = parseA1(node.v);
        if (!p) return err(ERR.REF);
        var A = addr(p.c, p.r);
        if (fromKey) this._register(fromKey, key(sn, A));
        var v = this._value(sn, A, visiting);
        return v == null ? 0 : v;
      }

      case "range": {
        var rsn = node.sheet ? (this.sheet(node.sheet) ? this.sheet(node.sheet).name : null) : sheetName;
        if (!rsn) return err(ERR.REF);
        return this._rangeValues(rsn, node.a, node.b, fromKey, visiting);
      }

      case "namedRef": return err(ERR.NAME, node.v);
      case "neg": { var x = this._eval(node.x, sheetName, fromKey, visiting); return isErr(x) ? x : -num(x); }
      case "pct": { var y = this._eval(node.x, sheetName, fromKey, visiting); return isErr(y) ? y : num(y) / 100; }

      case "concat": {
        var cl = this._eval(node.l, sheetName, fromKey, visiting);
        var cr = this._eval(node.r, sheetName, fromKey, visiting);
        if (isErr(cl)) return cl; if (isErr(cr)) return cr;
        return text(cl) + text(cr);
      }

      case "bin": {
        var l = this._eval(node.l, sheetName, fromKey, visiting);
        var r = this._eval(node.r, sheetName, fromKey, visiting);
        if (isErr(l)) return l; if (isErr(r)) return r;
        var a, b;
        try { a = num(Array.isArray(l) ? flatten([l])[0] : l); b = num(Array.isArray(r) ? flatten([r])[0] : r); }
        catch (e) { return isErr(e) ? e : err(ERR.VALUE); }
        switch (node.op) {
          case "+": return a + b;
          case "-": return a - b;
          case "*": return a * b;
          case "/": return b === 0 ? err(ERR.DIV0) : a / b;
          case "^": return Math.pow(a, b);
        }
        return err(ERR.VALUE);
      }

      case "cmp": {
        var cl2 = this._eval(node.l, sheetName, fromKey, visiting);
        var cr2 = this._eval(node.r, sheetName, fromKey, visiting);
        if (isErr(cl2)) return cl2; if (isErr(cr2)) return cr2;
        var av = cl2 == null ? 0 : cl2, bv = cr2 == null ? 0 : cr2;
        if (typeof av === "string" || typeof bv === "string") { av = text(av).toUpperCase(); bv = text(bv).toUpperCase(); }
        switch (node.op) {
          case "=":  return av === bv;
          case "<>": return av !== bv;
          case "<":  return av < bv;
          case "<=": return av <= bv;
          case ">":  return av > bv;
          case ">=": return av >= bv;
        }
        return err(ERR.VALUE);
      }

      case "call": {
        var fn = FUNCS[node.name];
        if (!fn) return err(ERR.NAME, node.name);
        var args = [], lazy = node.name === "IF" || node.name === "IFS" ||
                              node.name === "IFERROR" || node.name === "IFNA";
        for (var i = 0; i < node.args.length; i++) {
          var v = this._eval(node.args[i], sheetName, fromKey, visiting);
          // errors propagate, except through the functions whose job is to catch them
          if (isErr(v) && !lazy) return v;
          args.push(v);
        }
        try { return fn.apply(null, args); }
        catch (e) { return isErr(e) ? e : err(ERR.VALUE, e && e.message); }
      }
    }
    return err(ERR.VALUE);
  };

  Workbook.prototype.display = function (sheetName, a) {
    var c = this.cell(sheetName, a);
    return formatValue(this.value(sheetName, a), c && c.fmt);
  };

  /* ---- precedents & dependents, for tracing ---- */
  Workbook.prototype.precedents = function (sheetName, a) {
    var raw = this.raw(sheetName, a);
    if (raw.charAt(0) !== "=") return [];
    var s = this.sheet(sheetName);
    return precedentsOf(raw, s ? s.name : null);
  };
  Workbook.prototype.dependents = function (sheetName, a) {
    var s = this.sheet(sheetName);
    if (!s) return [];
    this.value(sheetName, a);                            // ensure graph is populated
    var k = key(s.name, a.toUpperCase());
    return Object.keys(this._deps[k] || {});
  };

  /* ========================================================================
     Copy / fill / paste — reference translation applied for real
     ===================================================================== */
  function expandRange(ref) {
    var parts = String(ref).toUpperCase().split(":");
    var a = parseA1(parts[0]), b = parseA1(parts[1] || parts[0]);
    if (!a || !b) return null;
    return {
      c1: Math.min(a.c, b.c), c2: Math.max(a.c, b.c),
      r1: Math.min(a.r, b.r), r2: Math.max(a.r, b.r)
    };
  }

  Workbook.prototype.copyRange = function (sheetName, ref) {
    var box = expandRange(ref);
    if (!box) return null;
    var s = this.sheet(sheetName), out = { rows: [], anchor: addr(box.c1, box.r1), sheet: s.name };
    for (var r = box.r1; r <= box.r2; r++) {
      var row = [];
      for (var c = box.c1; c <= box.c2; c++) {
        var cell = s.cells[addr(c, r)];
        row.push(cell ? { raw: cell.raw, fmt: cell.fmt, style: cell.style } : { raw: "", fmt: null, style: null });
      }
      out.rows.push(row);
    }
    return out;
  };

  Workbook.prototype.pasteRange = function (sheetName, targetRef, clip, mode) {
    if (!clip) return false;
    var s = this.sheet(sheetName);
    if (!s) return false;
    var t = parseA1(String(targetRef).toUpperCase().split(":")[0]);
    var src = parseA1(clip.anchor);
    if (!t || !src) return false;
    var dc = t.c - src.c, dr = t.r - src.r;
    this.begin();
    for (var i = 0; i < clip.rows.length; i++) {
      for (var j = 0; j < clip.rows[i].length; j++) {
        var cell = clip.rows[i][j];
        var A = addr(t.c + j, t.r + i);
        var raw = cell.raw;
        if (mode === "values") {
          var v = raw.charAt(0) === "=" ? this._valueOfClip(clip, i, j) : raw;
          raw = v == null ? "" : String(v);
        } else if (raw.charAt(0) === "=") {
          raw = translateFormula(raw, dc, dr);
        }
        if (mode !== "formats") this.setRaw(s.name, A, raw);
        if (mode !== "values" && cell.fmt) this.setFormat(s.name, A, cell.fmt);
      }
    }
    this.commit();
    return true;
  };
  Workbook.prototype._valueOfClip = function (clip, i, j) {
    var src = parseA1(clip.anchor);
    return this.value(clip.sheet, addr(src.c + j, src.r + i));
  };

  /* Fill: drag the handle from a source range across/down.
     Series continuation for plain numbers, reference translation for formulas. */
  Workbook.prototype.fill = function (sheetName, sourceRef, targetRef) {
    var s = this.sheet(sheetName);
    var src = expandRange(sourceRef), dst = expandRange(targetRef);
    if (!s || !src || !dst) return false;
    var vertical = dst.r2 > src.r2 || dst.r1 < src.r1;
    var srcH = src.r2 - src.r1 + 1, srcW = src.c2 - src.c1 + 1;

    // a numeric run of two or more cells defines a step
    var step = null, seed = null;
    if (vertical && srcH >= 2 && srcW === 1) {
      var a = this.value(s.name, addr(src.c1, src.r2 - 1)), b = this.value(s.name, addr(src.c1, src.r2));
      if (typeof a === "number" && typeof b === "number" &&
          this.raw(s.name, addr(src.c1, src.r2)).charAt(0) !== "=") { step = b - a; seed = b; }
    } else if (!vertical && srcW >= 2 && srcH === 1) {
      var a2 = this.value(s.name, addr(src.c2 - 1, src.r1)), b2 = this.value(s.name, addr(src.c2, src.r1));
      if (typeof a2 === "number" && typeof b2 === "number" &&
          this.raw(s.name, addr(src.c2, src.r1)).charAt(0) !== "=") { step = b2 - a2; seed = b2; }
    }

    this.begin();
    var n = 0;
    for (var r = dst.r1; r <= dst.r2; r++) {
      for (var c = dst.c1; c <= dst.c2; c++) {
        if (r >= src.r1 && r <= src.r2 && c >= src.c1 && c <= src.c2) continue;  // don't overwrite the source
        n++;
        var sr = src.r1 + ((r - src.r1) % srcH + srcH) % srcH;
        var sc = src.c1 + ((c - src.c1) % srcW + srcW) % srcW;
        var srcCell = s.cells[addr(sc, sr)];
        var raw = srcCell ? srcCell.raw : "";
        if (raw.charAt(0) === "=") {
          raw = translateFormula(raw, c - sc, r - sr);
        } else if (step != null) {
          raw = String(seed + step * n);
        }
        this.setRaw(s.name, addr(c, r), raw);
        if (srcCell && srcCell.fmt) this.setFormat(s.name, addr(c, r), srcCell.fmt);
      }
    }
    this.commit();
    return true;
  };

  /* Paste tab-separated text straight from Excel or Sheets. */
  Workbook.prototype.pasteTSV = function (sheetName, targetRef, tsv) {
    var s = this.sheet(sheetName);
    var t = parseA1(String(targetRef).toUpperCase());
    if (!s || !t) return false;
    var rows = String(tsv).replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
    this.begin();
    for (var i = 0; i < rows.length; i++) {
      var cols = rows[i].split("\t");
      for (var j = 0; j < cols.length; j++) this.setRaw(s.name, addr(t.c + j, t.r + i), cols[j]);
    }
    this.commit();
    return true;
  };

  /* ========================================================================
     Rows and columns — inserting must move every formula that points past it
     ===================================================================== */
  Workbook.prototype.insertRows = function (sheetName, at, count) {
    return this._shift(sheetName, "row", at, count == null ? 1 : count);
  };
  Workbook.prototype.deleteRows = function (sheetName, at, count) {
    return this._shift(sheetName, "row", at, -(count == null ? 1 : count));
  };
  Workbook.prototype.insertCols = function (sheetName, at, count) {
    return this._shift(sheetName, "col", at, count == null ? 1 : count);
  };
  Workbook.prototype.deleteCols = function (sheetName, at, count) {
    return this._shift(sheetName, "col", at, -(count == null ? 1 : count));
  };

  Workbook.prototype._shift = function (sheetName, axis, at, delta) {
    var s = this.sheet(sheetName);
    if (!s || delta === 0) return false;
    var isRow = axis === "row";
    var moved = {};
    var self = this;
    Object.keys(s.cells).forEach(function (A) {
      var p = parseA1(A);
      var idx = isRow ? p.r : p.c;
      var cell = s.cells[A];
      if (delta < 0 && idx >= at && idx < at - delta) return;      // deleted outright
      var ni = idx >= at ? idx + delta : idx;
      if (ni < 1) return;
      moved[isRow ? addr(p.c, ni) : addr(ni, p.r)] = cell;
    });
    s.cells = moved;
    // every formula in the workbook shifts its references past the insertion point
    this.sheets.forEach(function (sh) {
      Object.keys(sh.cells).forEach(function (A) {
        var cell = sh.cells[A];
        if (cell.raw.charAt(0) !== "=") return;
        cell.raw = shiftRefs(cell.raw, sh.name === s.name, isRow, at, delta);
        cell._ast = null;
      });
    });
    this.recalcAll();
    return true;
  };

  function shiftRefs(formula, sameSheet, isRow, at, delta) {
    var body = formula.slice(1), toks;
    try { toks = tokenize(body); } catch (e) { return formula; }
    var out = "", cursor = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.t !== "ref") continue;
      if (t.sheet ? false : !sameSheet) continue;
      var pieces = t.v.split(":"), moved = [], broke = false;
      for (var j = 0; j < pieces.length; j++) {
        var p = parseA1(pieces[j]);
        if (!p) { broke = true; break; }
        var idx = isRow ? p.r : p.c;
        if (delta < 0 && idx >= at && idx < at - delta) { moved.push(ERR.REF); broke = true; break; }
        var ni = idx >= at ? idx + delta : idx;
        if (isRow) p.r = ni; else p.c = ni;
        moved.push(formatA1(p));
      }
      var replacement = broke ? ERR.REF : moved.join(":");
      var srcText = body.slice(t.s, t.e), bang = srcText.lastIndexOf("!");
      if (bang >= 0 && !broke) replacement = srcText.slice(0, bang + 1) + replacement;
      out += body.slice(cursor, t.s) + replacement;
      cursor = t.e;
    }
    out += body.slice(cursor);
    return "=" + out;
  }

  /* ========================================================================
     Undo / redo — an operation journal, not a snapshot of the sheet
     ===================================================================== */
  Workbook.prototype.begin = function () { if (!this._batch) this._batch = []; };
  Workbook.prototype.commit = function () {
    if (this._batch && this._batch.length) { this._journal.push(this._batch); this._redo = []; }
    this._batch = null;
  };
  Workbook.prototype._record = function (op) {
    if (this._batch) { this._batch.push(op); return; }
    this._journal.push([op]);
    this._redo = [];
  };
  Workbook.prototype._apply = function (op, dir) {
    var v = dir === "undo" ? op.before : op.after;
    var s = this.sheet(op.sheet);
    if (!s) return;
    var A = op.a;
    if (!s.cells[A]) s.cells[A] = new Cell("");
    if (op.t === "set") { s.cells[A].raw = v == null ? "" : v; s.cells[A]._ast = null; this._invalidate(key(s.name, A)); }
    else if (op.t === "fmt") s.cells[A].fmt = v;
    else if (op.t === "note") s.cells[A].note = v;
  };
  Workbook.prototype.undo = function () {
    var batch = this._journal.pop();
    if (!batch) return false;
    for (var i = batch.length - 1; i >= 0; i--) this._apply(batch[i], "undo");
    this._redo.push(batch);
    return true;
  };
  Workbook.prototype.redo = function () {
    var batch = this._redo.pop();
    if (!batch) return false;
    for (var i = 0; i < batch.length; i++) this._apply(batch[i], "redo");
    this._journal.push(batch);
    return true;
  };
  Workbook.prototype.canUndo = function () { return this._journal.length > 0; };
  Workbook.prototype.canRedo = function () { return this._redo.length > 0; };

  /* ========================================================================
     Serialisation
     ===================================================================== */
  Workbook.prototype.toJSON = function () {
    return {
      v: 2,
      sheets: this.sheets.map(function (s) {
        var cells = {};
        Object.keys(s.cells).forEach(function (a) {
          var c = s.cells[a];
          if (c.raw === "" && !c.fmt && !c.note) return;
          cells[a] = { r: c.raw, f: c.fmt || undefined, n: c.note || undefined, l: c.locked || undefined };
        });
        return { name: s.name, cells: cells, frozen: s.frozen, colWidths: s.colWidths };
      })
    };
  };
  Workbook.fromJSON = function (json) {
    var wb = new Workbook({ sheets: [] });
    (json.sheets || []).forEach(function (s) {
      var sh = wb.addSheet(s.name);
      sh.frozen = s.frozen || { rows: 0, cols: 0 };
      sh.colWidths = s.colWidths || {};
      Object.keys(s.cells || {}).forEach(function (a) {
        var c = new Cell(s.cells[a].r);
        c.fmt = s.cells[a].f || null;
        c.note = s.cells[a].n || null;
        c.locked = !!s.cells[a].l;
        sh.cells[a] = c;
      });
    });
    return wb;
  };

  Workbook.prototype.toCSV = function (sheetName) {
    var s = this.sheet(sheetName);
    if (!s) return "";
    var maxC = 0, maxR = 0;
    Object.keys(s.cells).forEach(function (a) {
      var p = parseA1(a);
      if (p.c > maxC) maxC = p.c;
      if (p.r > maxR) maxR = p.r;
    });
    var lines = [];
    for (var r = 1; r <= maxR; r++) {
      var row = [];
      for (var c = 1; c <= maxC; c++) {
        var d = this.display(s.name, addr(c, r));
        row.push(/[",\n]/.test(d) ? '"' + d.replace(/"/g, '""') + '"' : d);
      }
      lines.push(row.join(","));
    }
    return lines.join("\n");
  };

  /* ========================================================================
     The grader — checks the model, not the number on screen
     ---------------------------------------------------------------------
     A learner who types 125 where the lesson wanted =B10*(1+C9) has produced
     the right figure and learned nothing. These checks can see the difference.
     ===================================================================== */
  function normalizeFormula(f) {
    return String(f).replace(/\s+/g, "").toUpperCase();
  }

  Workbook.prototype.check = function (spec) {
    var sheetName = spec.sheet || this.sheets[0].name;
    var A = String(spec.cell).toUpperCase();
    var raw = this.raw(sheetName, A);
    var v = this.value(sheetName, A);
    var label = spec.label || (sheetName + "!" + A);

    if (spec.mustFormula && raw.charAt(0) !== "=") {
      return { ok: false, label: label, why: "This cell should hold a formula, not a typed-in number. The formula is the point of the exercise." };
    }
    if (isErr(v)) {
      return { ok: false, label: label, why: "This cell is showing " + v.err + (v.detail ? " (" + v.detail + ")" : "") + "." };
    }
    if (spec.mustUse) {
      var need = [].concat(spec.mustUse), up = normalizeFormula(raw);
      for (var i = 0; i < need.length; i++) {
        if (up.indexOf(need[i].toUpperCase()) < 0) {
          return { ok: false, label: label, why: "Use " + need[i] + " here." };
        }
      }
    }
    if (spec.mustReference) {
      var want = [].concat(spec.mustReference).map(function (x) { return x.toUpperCase(); });
      var got = this.precedents(sheetName, A).map(function (p) {
        return p.indexOf("!") >= 0 ? p.split("!")[1] : p;
      });
      for (var j = 0; j < want.length; j++) {
        if (got.indexOf(want[j]) < 0) {
          return { ok: false, label: label, why: "This should read from " + want[j] + ". Right now it doesn't." };
        }
      }
    }
    if (spec.formulaLike) {
      if (normalizeFormula(raw) !== normalizeFormula(spec.formulaLike)) {
        return { ok: false, label: label, why: "Not the formula this step is after.", hint: true };
      }
    }
    if (spec.expect !== undefined) {
      var tol = spec.tol == null ? 0.5 : spec.tol;
      if (typeof spec.expect === "number") {
        if (typeof v !== "number" || Math.abs(v - spec.expect) > tol) {
          return { ok: false, label: label, why: "Expected " + formatValue(spec.expect, spec.fmt) + ", got " + formatValue(v, spec.fmt) + "." };
        }
      } else if (String(v) !== String(spec.expect)) {
        return { ok: false, label: label, why: "Expected " + spec.expect + "." };
      }
    }
    if (spec.custom) {
      var res = spec.custom(this, v, raw);
      if (res !== true) return { ok: false, label: label, why: res || "Not quite." };
    }
    return { ok: true, label: label };
  };

  Workbook.prototype.runChecks = function (specs) {
    var self = this;
    return (specs || []).map(function (s) { return self.check(s); });
  };

  /* Model integrity checks — the professional discipline layer. */
  Workbook.prototype.modelChecks = function (defs) {
    var self = this;
    return (defs || []).map(function (d) {
      var a = self.value(d.sheet || null, d.a);
      var b = self.value(d.sheet || null, d.b);
      var diff = (typeof a === "number" ? a : NaN) - (typeof b === "number" ? b : NaN);
      var tol = d.tol == null ? 0.5 : d.tol;
      return {
        label: d.label, a: a, b: b, diff: diff,
        ok: isFinite(diff) && Math.abs(diff) <= tol
      };
    });
  };

  /* ========================================================================
     Autocomplete
     ===================================================================== */
  function suggest(prefix) {
    var up = String(prefix).toUpperCase().replace(/^=/, "");
    if (!up) return [];
    return Object.keys(FUNCS)
      .filter(function (n) { return n.indexOf(up) === 0; })
      .sort()
      .slice(0, 8)
      .map(function (n) { return { name: n, help: FUNC_HELP[n] || (n + "(…)") }; });
  }

  /* ========================================================================
     Exports
     ===================================================================== */
  return {
    Workbook: Workbook, Cell: Cell,
    ERR: ERR, err: err, isErr: isErr,
    colToNum: colToNum, numToCol: numToCol, addr: addr,
    parseA1: parseA1, formatA1: formatA1, translateA1: translateA1,
    parseNumber: parseNumber, tokenize: tokenize, parse: parse, compile: compile,
    translateFormula: translateFormula, renameSheetInFormula: renameSheetInFormula,
    precedentsOf: precedentsOf, normalizeFormula: normalizeFormula,
    formatValue: formatValue, dateToSerial: dateToSerial, serialToParts: serialToParts,
    FUNCS: FUNCS, FUNC_HELP: FUNC_HELP, suggest: suggest,
    registerFunction: function (n, fn) { FUNCS[n.toUpperCase()] = fn; }
  };
});
