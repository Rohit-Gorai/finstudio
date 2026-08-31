/* FinStudio spreadsheet engine.
   Dependency-free. Parses "=B2-B3" style formulas with cell refs, ranges,
   functions, cycle detection, and Indian-format numbers.
   Loaded before app.js; exposes LS.Sheet, LS.fmt, LS.cellAddr helpers. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  /* ================= number formatting ================= */
  var nfIN0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  var nfIN2 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

  function group(v, dec) {
    return (dec ? nfIN2 : nfIN0).format(v);
  }

  var fmt = {
    // ₹ with en-IN grouping; negatives in parentheses: (₹1,50,000)
    inr: function (v) {
      if (typeof v !== "number" || isNaN(v)) return "";
      var r = Math.round(v);
      if (r < 0) return "(₹" + group(-r) + ")";
      return "₹" + group(r);
    },
    pct: function (v) {
      if (typeof v !== "number" || isNaN(v)) return "";
      var p = v * 100;
      var s = (Math.round(p * 10) / 10).toFixed(1).replace(/\.0$/, "");
      return (p < 0 ? "(" + s.replace("-", "") + "%)" : s + "%");
    },
    x: function (v) {
      if (typeof v !== "number" || isNaN(v)) return "";
      return String(Math.round(v * 100) / 100) + "x";
    },
    days: function (v) {
      if (typeof v !== "number" || isNaN(v)) return "";
      return group(Math.round(v * 10) / 10, true) + " days";
    },
    plain: function (v) {
      if (typeof v !== "number" || isNaN(v)) return "";
      var neg = v < 0, a = Math.abs(v);
      var s = group(Math.round(a * 100) / 100, a !== Math.round(a));
      return neg ? "(" + s + ")" : s;
    },
    cell: function (v, kind) {
      if (v == null || v === "") return "";
      if (typeof v === "string") return v;
      return (fmt[kind] || fmt.plain)(v);
    }
  };
  LS.fmt = fmt;

  /* ================= addresses ================= */
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
  function parseAddr(a) {
    var m = /^\$?([A-Z]+)\$?(\d+)$/.exec(a.toUpperCase());
    if (!m) return null;
    return { c: colToNum(m[1]), r: parseInt(m[2], 10) };
  }
  LS.cellAddr = { colToNum: colToNum, numToCol: numToCol, addr: addr, parseAddr: parseAddr };

  /* ================= input parsing =================
     "=B2-B3" -> formula; "1,50,000" / "₹500" / "(500)" / "12%" -> number;
     anything else -> text */
  function parseNumber(str) {
    var s = str.trim();
    if (!s) return null;
    var neg = false;
    if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
    s = s.replace(/[₹,\s]/g, "");
    if (s.charAt(0) === "-") { neg = !neg; s = s.slice(1); }
    var pct = false;
    if (s.slice(-1) === "%") { pct = true; s = s.slice(0, -1); }
    if (!/^\d*\.?\d+$/.test(s)) return null;
    var v = parseFloat(s);
    if (pct) v = v / 100;
    return neg ? -v : v;
  }
  LS.parseNumber = parseNumber;

  /* ================= formula tokenizer ================= */
  function tokenize(src) {
    var toks = [], i = 0, n = src.length;
    while (i < n) {
      var ch = src[i];
      if (ch === " " || ch === "\t") { i++; continue; }
      if (/[0-9.]/.test(ch)) {
        // No digit grouping inside formulas — a comma is always an argument
        // separator here, exactly as in Excel. ("1,50,000" typed straight into
        // a cell is still parsed with grouping; see parseNumber.)
        var j = i, num = "";
        while (j < n && /[0-9.]/.test(src[j])) { num += src[j]; j++; }
        toks.push({ t: "num", v: parseFloat(num) });
        i = j; continue;
      }
      if (/[A-Za-z$]/.test(ch)) {
        var j2 = i, word = "";
        while (j2 < n && /[A-Za-z0-9$]/.test(src[j2])) { word += src[j2]; j2++; }
        var up = word.toUpperCase();
        if (/^\$?[A-Z]+\$?\d+$/.test(up)) toks.push({ t: "ref", v: up });
        else toks.push({ t: "name", v: up });
        i = j2; continue;
      }
      if (ch === "<" && src[i + 1] === "=") { toks.push({ t: "op", v: "<=" }); i += 2; continue; }
      if (ch === ">" && src[i + 1] === "=") { toks.push({ t: "op", v: ">=" }); i += 2; continue; }
      if (ch === "<" && src[i + 1] === ">") { toks.push({ t: "op", v: "<>" }); i += 2; continue; }
      if ("+-*/^%()=<>:,".indexOf(ch) >= 0) { toks.push({ t: "op", v: ch }); i++; continue; }
      throw { err: "#NAME?", detail: "Unexpected '" + ch + "'" };
    }
    return toks;
  }

  /* ================= parser (recursive descent) =================
     compare := add (("="|"<>"|"<"|">"|"<="|">=") add)?
     add     := mul (("+"|"-") mul)*
     mul     := pow (("*"|"/") pow)*
     pow     := unary ("^" unary)*
     unary   := "-" unary | postfix
     postfix := primary ("%")*
     primary := num | ref | name "(" args ")" | "(" compare ")"        */
  function parse(toks) {
    var pos = 0;
    function peek() { return toks[pos]; }
    function next() { return toks[pos++]; }
    function expectOp(v) {
      var t = next();
      if (!t || t.t !== "op" || t.v !== v) throw { err: "#NAME?", detail: "Expected '" + v + "'" };
    }
    function compare() {
      var l = add(), t = peek();
      if (t && t.t === "op" && ["=", "<>", "<", ">", "<=", ">="].indexOf(t.v) >= 0) {
        next();
        return { t: "cmp", op: t.v, l: l, r: add() };
      }
      return l;
    }
    function add() {
      var l = mul(), t;
      while ((t = peek()) && t.t === "op" && (t.v === "+" || t.v === "-")) { next(); l = { t: "bin", op: t.v, l: l, r: mul() }; }
      return l;
    }
    function mul() {
      var l = pow(), t;
      while ((t = peek()) && t.t === "op" && (t.v === "*" || t.v === "/")) { next(); l = { t: "bin", op: t.v, l: l, r: pow() }; }
      return l;
    }
    function pow() {
      var l = unary(), t;
      while ((t = peek()) && t.t === "op" && t.v === "^") { next(); l = { t: "bin", op: "^", l: l, r: unary() }; }
      return l;
    }
    function unary() {
      var t = peek();
      if (t && t.t === "op" && t.v === "-") { next(); return { t: "neg", x: unary() }; }
      if (t && t.t === "op" && t.v === "+") { next(); return unary(); }
      return postfix();
    }
    function postfix() {
      var x = primary(), t;
      while ((t = peek()) && t.t === "op" && t.v === "%") { next(); x = { t: "pct", x: x }; }
      return x;
    }
    function rangeOrExpr() {
      // a function argument may be a range like B2:B5
      var t = peek();
      if (t && t.t === "ref" && toks[pos + 1] && toks[pos + 1].t === "op" && toks[pos + 1].v === ":") {
        var a = next().v; next();
        var b = next();
        if (!b || b.t !== "ref") throw { err: "#REF!", detail: "Bad range" };
        return { t: "range", a: a, b: b.v };
      }
      return compare();
    }
    function primary() {
      var t = next();
      if (!t) throw { err: "#NAME?", detail: "Formula ended early" };
      if (t.t === "num") return { t: "num", v: t.v };
      if (t.t === "ref") return { t: "ref", v: t.v };
      if (t.t === "name") {
        expectOp("(");
        var args = [];
        if (peek() && !(peek().t === "op" && peek().v === ")")) {
          args.push(rangeOrExpr());
          while (peek() && peek().t === "op" && peek().v === ",") { next(); args.push(rangeOrExpr()); }
        }
        expectOp(")");
        return { t: "call", name: t.v, args: args };
      }
      if (t.t === "op" && t.v === "(") {
        var e = compare();
        expectOp(")");
        return e;
      }
      throw { err: "#NAME?", detail: "Unexpected token" };
    }
    var root = compare();
    if (pos < toks.length) throw { err: "#NAME?", detail: "Unexpected trailing input" };
    return root;
  }

  /* ================= functions ================= */
  function flatten(args, sheet, out) {
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (a && a.range) { for (var j = 0; j < a.range.length; j++) out.push(a.range[j]); }
      else out.push(a);
    }
    return out.filter(function (v) { return typeof v === "number"; });
  }
  var FUNCS = {
    SUM: function (vals) { return vals.reduce(function (a, b) { return a + b; }, 0); },
    AVERAGE: function (vals) {
      if (!vals.length) throw { err: "#DIV/0!" };
      return vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
    },
    MIN: function (vals) {
      if (!vals.length) throw { err: "#VALUE!" };
      return Math.min.apply(null, vals);
    },
    MAX: function (vals) {
      if (!vals.length) throw { err: "#VALUE!" };
      return Math.max.apply(null, vals);
    },
    ABS: function (vals) {
      if (!vals.length) throw { err: "#VALUE!" };
      return Math.abs(vals[0]);
    },
    ROUND: function (vals) {
      if (!vals.length) throw { err: "#VALUE!" };
      var n = vals[0], d = vals.length > 1 ? Math.round(vals[1]) : 0;
      var f = Math.pow(10, d);
      // round half away from zero, like Excel (JS Math.round is half-up)
      return (n < 0 ? -1 : 1) * Math.round(Math.abs(n) * f) / f;
    },
    // IF needs the raw args (a false branch must not be flattened away)
    IF: function (vals, args) {
      if (args.length < 2) throw { err: "#VALUE!" };
      var cond = args[0];
      if (cond && cond.range) cond = cond.range.length ? cond.range[0] : 0;
      var t = args[1], f = args.length > 2 ? args[2] : 0;
      if (t && t.range) t = t.range.length ? t.range[0] : 0;
      if (f && f.range) f = f.range.length ? f.range[0] : 0;
      return cond ? t : f;
    }
  };
  LS.registerFunction = function (name, fn) { FUNCS[name.toUpperCase()] = fn; };
  LS.hasFunction = function (name) { return !!FUNCS[name.toUpperCase()]; };
  LS.functionNames = function () { return Object.keys(FUNCS); };

  /* ================= relative-reference shifting =================
     What Excel's fill-right does: move every relative column letter n columns
     across, leaving $-anchored ones alone. Pure and unit-tested. */
  function shiftFormula(raw, n) {
    if (!raw || raw.charAt(0) !== "=") return raw;
    return raw.replace(/(\$?)([A-Za-z]+)(\$?)(\d+)/g, function (m, cAbs, letters, rAbs, digits) {
      if (cAbs) return m;                       // $B2 — column locked
      var up = letters.toUpperCase();
      if (!/^[A-Z]+$/.test(up)) return m;
      var c = colToNum(up) + n;
      if (c < 1) return "#REF!";
      return numToCol(c) + rAbs + digits;
    });
  }
  LS.shiftFormula = shiftFormula;

  /* Row-wise twin, for fill-down and for pasting into a different row.
     Same rule: $-anchored rows stay put, relative ones move. */
  function shiftRows(raw, n) {
    if (!raw || raw.charAt(0) !== "=") return raw;
    return raw.replace(/(\$?)([A-Za-z]+)(\$?)(\d+)/g, function (m, cAbs, letters, rAbs, digits) {
      if (rAbs) return m;
      if (!/^[A-Za-z]+$/.test(letters)) return m;
      var r = parseInt(digits, 10) + n;
      if (r < 1) return "#REF!";
      return cAbs + letters + r;
    });
  }
  LS.shiftRows = shiftRows;

  /* ================= Sheet ================= */
  // cfg: { cols: <int>, grid: [ [cell, ...], ... ] }
  // grid cell: string label | number | { v, input, fmt, mf, ph, year }
  function Sheet(cfg) {
    this.cols = cfg.cols || (cfg.grid[0] ? cfg.grid[0].length : 0);
    this.rows = cfg.grid.length;
    this.cells = {}; // addr -> {raw, ro, fmt, mf, label, year, ph}
    for (var r = 0; r < cfg.grid.length; r++) {
      for (var c = 0; c < cfg.grid[r].length; c++) {
        var def = cfg.grid[r][c], a = addr(c + 1, r + 1), cell;
        if (def == null) continue;
        if (typeof def === "string") cell = { raw: def, ro: true, label: true };
        else if (typeof def === "number") cell = { raw: String(def), ro: true, fmt: "inr" };
        else {
          cell = {
            raw: def.v != null ? String(def.v) : "",
            ro: !def.input,
            fmt: def.fmt || (typeof def.v === "string" ? undefined : "inr"),
            mf: !!def.mf, ph: def.ph, year: !!def.year,
            label: typeof def.v === "string" && !def.input
          };
        }
        this.cells[a] = cell;
      }
    }
    this._cache = {};
  }

  Sheet.prototype.cell = function (a) { return this.cells[a]; };
  Sheet.prototype.raw = function (a) { return this.cells[a] ? this.cells[a].raw : ""; };
  Sheet.prototype.setRaw = function (a, str) {
    var cell = this.cells[a];
    if (!cell || cell.ro) return;
    cell.raw = str;
    this._cache = {};
  };
  Sheet.prototype.isFormula = function (a) {
    return this.raw(a).trim().charAt(0) === "=";
  };

  Sheet.prototype.value = function (a) {
    a = a.replace(/\$/g, "");
    if (a in this._cache) return this._cache[a];
    var out = this._value(a, {});
    this._cache[a] = out;
    return out;
  };
  Sheet.prototype._value = function (a, visiting) {
    var cell = this.cells[a];
    if (!cell) return null; // empty/never-defined cell counts as blank
    var raw = (cell.raw || "").trim();
    if (raw === "") return null;
    if (raw.charAt(0) === "=") {
      if (visiting[a]) return { err: "#CYCLE!" };
      visiting[a] = true;
      var out;
      try {
        out = this._eval(parse(tokenize(raw.slice(1))), visiting);
        if (typeof out === "boolean") out = out ? 1 : 0;
        if (typeof out !== "number" || isNaN(out) || !isFinite(out)) out = { err: "#VALUE!" };
      } catch (e) {
        out = { err: e && e.err ? e.err : "#NAME?" };
      }
      delete visiting[a];
      return out;
    }
    var num = parseNumber(raw);
    if (num !== null) return num;
    return raw; // text label
  };
  Sheet.prototype._refValue = function (ref, visiting) {
    var a = ref.replace(/\$/g, "");
    if (!parseAddr(a)) throw { err: "#REF!" };
    var v = this._value(a, visiting);
    if (v && v.err) throw v;
    if (v == null) return 0;           // blank -> 0, like spreadsheets
    if (typeof v === "string") return 0; // text label in arithmetic -> 0
    return v;
  };
  Sheet.prototype._eval = function (node, visiting) {
    var self = this;
    switch (node.t) {
      case "num": return node.v;
      case "ref": return this._refValue(node.v, visiting);
      case "pct": return this._eval(node.x, visiting) / 100;
      case "neg": return -this._eval(node.x, visiting);
      case "bin": {
        var l = this._eval(node.l, visiting), r = this._eval(node.r, visiting);
        switch (node.op) {
          case "+": return l + r;
          case "-": return l - r;
          case "*": return l * r;
          case "/": if (r === 0) throw { err: "#DIV/0!" }; return l / r;
          case "^": return Math.pow(l, r);
        }
        throw { err: "#NAME?" };
      }
      case "cmp": {
        var a = this._eval(node.l, visiting), b = this._eval(node.r, visiting);
        switch (node.op) {
          case "=": return a === b;
          case "<>": return a !== b;
          case "<": return a < b;
          case ">": return a > b;
          case "<=": return a <= b;
          case ">=": return a >= b;
        }
        throw { err: "#NAME?" };
      }
      case "range": throw { err: "#VALUE!", detail: "Range outside a function" };
      case "call": {
        var fn = FUNCS[node.name];
        if (!fn) throw { err: "#NAME?", detail: node.name + " is not a function" };
        var args = node.args.map(function (arg) {
          if (arg.t === "range") {
            var A = parseAddr(arg.a), B = parseAddr(arg.b);
            if (!A || !B) throw { err: "#REF!" };
            var vals = [];
            for (var r = Math.min(A.r, B.r); r <= Math.max(A.r, B.r); r++)
              for (var c = Math.min(A.c, B.c); c <= Math.max(A.c, B.c); c++) {
                var v = self._value(addr(c, r), visiting);
                if (v && v.err) throw v;
                if (typeof v === "number") vals.push(v);
              }
            return { range: vals };
          }
          return self._eval(arg, visiting);
        });
        return fn(flatten(args, this, []), args);
      }
    }
    throw { err: "#NAME?" };
  };

  /* ================= checks =================
     check: { cell, expect, tol?, message, mustFormula?, mustUse? (regex/string on raw) }
          | { custom: function(sheet) -> true | "why it failed", message }   */
  Sheet.prototype.runChecks = function (checks) {
    var self = this;
    return (checks || []).map(function (ck) {
      var res = { message: ck.message || "", ok: false };
      if (ck.custom) {
        var r;
        try { r = ck.custom(self); } catch (e) { r = false; }
        res.ok = r === true;
        if (!res.ok && typeof r === "string") res.detail = r;
        return res;
      }
      var cellDef = self.cells[ck.cell] || {};
      var v = self.value(ck.cell);
      if (v == null || v === "") { res.detail = ck.cell + " is empty."; return res; }
      if (v && v.err) { res.detail = ck.cell + " shows " + v.err; return res; }
      if (typeof v !== "number") { res.detail = ck.cell + " is text, not a number."; return res; }
      var tol = ck.tol != null ? ck.tol : 1;
      if (Math.abs(v - ck.expect) > tol) {
        res.detail = ck.cell + " = " + fmt.cell(v, cellDef.fmt) + " — not the expected value.";
        return res;
      }
      if ((ck.mustFormula || cellDef.mf) && !self.isFormula(ck.cell)) {
        res.detail = ck.cell + " has the right value, but type it as a formula (start with =) — that's the point of the exercise.";
        return res;
      }
      if (ck.mustUse) {
        var raw = self.raw(ck.cell).toUpperCase().replace(/\s/g, "");
        var pat = ck.mustUse instanceof RegExp ? ck.mustUse : new RegExp(ck.mustUse.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        if (!pat.test(raw)) {
          res.detail = ck.cell + " works, but write it using " + (ck.mustUseLabel || ck.mustUse) + ".";
          return res;
        }
      }
      res.ok = true;
      return res;
    });
  };

  LS.Sheet = Sheet;
})();
