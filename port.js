/* ============================================================================
   v1 → v2 lesson porter
   ----------------------------------------------------------------------------
   The 38 existing lessons are already data, which is the only reason this is
   possible at all. This lifts what they hold — prose blocks, formulas, worked
   examples, MCQs and sandboxes — into the v2 schema, converts their sheet
   grids into v2 workbooks, and then reports honestly on what each ported
   lesson still LACKS: the sections v1 never had (three explanation levels,
   why-it-matters, common mistakes, real-world, summary, the four practice
   tiers).

   It does not invent content. A gap is reported as a gap. Filling gaps is
   authoring work and this file will not pretend otherwise.

   Headless. window.FinPort in the browser, globalThis under node.
   ========================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FinPort = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function moduleOf(code) {
    var c = String(code || "");
    return c.length >= 4 ? c.slice(0, 2) + "00" : c;
  }

  function stripTags(html) {
    return String(html == null ? "" : html)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Which v2 level does a v1 module code belong to? */
  var LEVEL_OF_MODULE = {
    "1000": "accounting", "1100": "accounting", "1200": "accounting", "1300": "statements",
    "1400": "statements", "1500": "statements", "1600": "analysis",
    "2100": "modeling", "2200": "valuation"
  };

  /* ----------------------------------------------------------------------
     v1 sheet grid  →  v2 workbook cells
     v1 grids are row-major arrays; a cell is a string label, a number, or
     { v, input, fmt, mf, ph, year }. v2 wants an address map plus a list of
     which addresses the learner fills in.
     ------------------------------------------------------------------- */
  function numToCol(n) {
    var s = "";
    while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }

  function portSheet(v1sheet, sheetName) {
    var cells = {}, editable = [], formats = {}, placeholders = {};
    var grid = v1sheet.grid || [];
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var def = grid[r][c];
        if (def == null) continue;
        var a = numToCol(c + 1) + (r + 1);
        if (typeof def === "string") { cells[a] = def; }
        else if (typeof def === "number") { cells[a] = String(def); formats[a] = { type: "currency", currency: "inr" }; }
        else {
          cells[a] = def.v != null ? String(def.v) : "";
          if (def.input) {
            editable.push(a);
            if (def.ph) placeholders[a] = def.ph;
          }
          if (def.fmt === "inr") formats[a] = { type: "currency", currency: "inr" };
          else if (def.fmt === "pct") formats[a] = { type: "pct", dp: 1 };
          else if (def.fmt === "x") formats[a] = { type: "x", dp: 1 };
          else if (def.fmt === "days") formats[a] = { type: "number", dp: 1 };
          else if (typeof def.v === "number") formats[a] = { type: "currency", currency: "inr" };
        }
      }
    }
    return {
      name: sheetName || "Sheet1",
      cells: cells, editable: editable, formats: formats, placeholders: placeholders
    };
  }

  function portChecks(v1checks, sheetName) {
    return (v1checks || []).map(function (c) {
      var spec = { cell: c.cell, sheet: sheetName, label: stripTags(c.message || c.cell) };
      if (c.expect !== undefined) spec.expect = c.expect;
      if (c.tol !== undefined) spec.tol = c.tol;
      if (c.mustFormula) spec.mustFormula = true;
      if (c.mustUse) spec.mustUse = [].concat(c.mustUse);
      // v1's `custom` closures take a v1 Sheet; they cannot be carried across
      // and are reported as a gap rather than silently dropped.
      if (c.custom) spec._customDropped = true;
      return spec;
    });
  }

  /* ----------------------------------------------------------------------
     v1 mcq  →  v2 practice question
     v1 stores parallel arrays (opts / why / correct index). v2 wants one
     object per option so a wrong pick can explain itself.
     ------------------------------------------------------------------- */
  function portMCQ(block, idx) {
    return {
      id: "q" + (idx + 1),
      tier: "beginner",
      type: "mcq",
      prompt: stripTags(block.q),
      options: (block.opts || []).map(function (text, i) {
        return {
          text: stripTags(text),
          correct: i === block.correct,
          why: stripTags((block.why || [])[i] || "")
        };
      })
    };
  }

  function portClassify(block, idx) {
    // v1 classify = "put each item in the right bucket" → v2 match
    return {
      id: "q" + (idx + 1),
      tier: "beginner",
      type: "match",
      prompt: stripTags(block.q || block.tag || "Place each item."),
      pairs: (block.items || []).map(function (it) {
        return { left: stripTags(it.text || it.label), right: stripTags(it.answer || it.correct) };
      })
    };
  }

  /* ---------------------------------------------------------------- port */
  function port(v1, opts) {
    opts = opts || {};
    var body = v1.body || [];
    var out = {
      id: v1.id,
      title: v1.title,
      short: v1.short,
      // a lesson code is 1620; its module is 1600
      level: opts.level || LEVEL_OF_MODULE[moduleOf(v1.code)] || "statements",
      difficulty: opts.difficulty || null,
      estimatedTime: v1.minutes || null,
      summary: stripTags(v1.desc || ""),
      tags: opts.tags || [],
      prerequisites: opts.prerequisites || [],
      relatedTopics: opts.relatedTopics || [],
      explanation: { short: stripTags(v1.lede || v1.desc || "") },
      practice: [],
      _ported: { from: "v1", code: v1.code }
    };

    var defs = [], formulas = [], examples = [], notes = [], sheets = [];
    body.forEach(function (b, i) {
      switch (b.t) {
        case "def":
          defs.push({ term: stripTags(b.term), text: stripTags(b.h) });
          break;
        case "formula":
          formulas.push({
            title: stripTags(b.title || ""),
            lines: (b.lines || []).map(stripTags),
            note: stripTags(b.note || "")
          });
          break;
        case "example":
          examples.push({ tag: stripTags(b.tag || ""), text: stripTags(b.h || "") });
          break;
        case "where":
          // v1's "where this number goes" is the seed of §35's real-world section
          notes.push({ kind: "where", text: stripTags(b.h) });
          break;
        case "note":
          notes.push({ kind: "note", text: stripTags(b.h) });
          break;
        case "mcq":
          out.practice.push(portMCQ(b, out.practice.length));
          break;
        case "classify":
          out.practice.push(portClassify(b, out.practice.length));
          break;
        case "sheet":
          sheets.push(b.sheet);
          break;
      }
    });

    if (defs.length) out.definitions = defs;
    if (formulas.length) {
      out.formula = {
        display: formulas[0].lines[0] || "",
        lines: formulas[0].lines,
        note: formulas[0].note
      };
      if (formulas.length > 1) out.additionalFormulas = formulas.slice(1);
    }
    if (examples.length) {
      out.example = { walkthrough: examples.map(function (e) { return e.text; }).join(" ") };
    }
    if (notes.length) out.notes = notes;

    if (sheets.length) {
      var s0 = sheets[0];
      var name = opts.sheetName || "Sheet1";
      var ported = portSheet(s0, name);
      out.sandbox = {
        title: stripTags(s0.title || out.title),
        instructions: stripTags(s0.hint || ""),
        sheets: [ported],
        checks: portChecks(s0.checks, name),
        success: stripTags(s0.success || ""),
        cellHints: (function () {
          var h = {};
          Object.keys(ported.placeholders).forEach(function (a) {
            h[a] = { pattern: ported.placeholders[a] };
          });
          return h;
        })()
      };
      if (sheets.length > 1) out._ported.extraSheets = sheets.length - 1;
    }

    return out;
  }

  /* ----------------------------------------------------------------------
     Gap report — what a ported lesson still needs before it meets the brief
     ------------------------------------------------------------------- */
  var REQUIRED = [
    { key: "explanation.beginner", why: "§42 beginner explanation", test: function (l) { return l.explanation && l.explanation.beginner; } },
    { key: "explanation.intermediate", why: "§42 intermediate explanation", test: function (l) { return l.explanation && l.explanation.intermediate; } },
    { key: "explanation.advanced", why: "§42 advanced explanation", test: function (l) { return l.explanation && l.explanation.advanced; } },
    { key: "visualization", why: "§12 interactive visualization", test: function (l) { return !!l.visualization; } },
    { key: "whyItMatters", why: "§33", test: function (l) { return !!l.whyItMatters; } },
    { key: "commonMistakes", why: "§34", test: function (l) { return (l.commonMistakes || []).length > 0; } },
    { key: "realWorld", why: "§35", test: function (l) { return (l.realWorld || []).length > 0; } },
    { key: "takeaways", why: "§36 end-of-lesson summary", test: function (l) { return Array.isArray(l.takeaways) && l.takeaways.length > 0; } },
    { key: "challenge", why: "§2 MASTER step", test: function (l) { return !!l.challenge; } },
    { key: "prerequisites", why: "§41 prerequisite graph", test: function (l) { return (l.prerequisites || []).length > 0; } }
  ];
  var TIERS = ["beginner", "practical", "application", "challenge"];

  function gaps(lesson) {
    var missing = REQUIRED.filter(function (r) { return !r.test(lesson); })
      .map(function (r) { return { field: r.key, why: r.why }; });

    var tiersPresent = {};
    (lesson.practice || []).forEach(function (q) { if (q.tier) tiersPresent[q.tier] = true; });
    var tiersMissing = TIERS.filter(function (t) { return !tiersPresent[t]; });
    if (tiersMissing.length) {
      missing.push({ field: "practice tiers", why: "§11 requires all four; missing " + tiersMissing.join(", ") });
    }

    // §10: variety. A lesson whose practice is all one type is thin.
    var types = {};
    (lesson.practice || []).forEach(function (q) { types[q.type] = true; });
    if (Object.keys(types).length < 2) {
      missing.push({ field: "practice variety", why: "§10 — every question here is the same type" });
    }
    if ((lesson.sandbox || {}).checks && lesson.sandbox.checks.some(function (c) { return c._customDropped; })) {
      missing.push({ field: "sandbox check", why: "a v1 custom check could not be carried across; rewrite it as a v2 spec" });
    }
    return { id: lesson.id, complete: missing.length === 0, missing: missing };
  }

  function reportAll(v1lessons, opts) {
    var rows = Object.keys(v1lessons).map(function (id) {
      var ported = port(v1lessons[id], opts && opts[id]);
      return gaps(ported);
    });
    var tally = {};
    rows.forEach(function (r) {
      r.missing.forEach(function (m) { tally[m.field] = (tally[m.field] || 0) + 1; });
    });
    return {
      total: rows.length,
      complete: rows.filter(function (r) { return r.complete; }).length,
      byField: tally,
      lessons: rows
    };
  }

  /* Build a live v2 workbook from a ported sandbox, ready to be checked. */
  function buildWorkbook(sandbox, Sheets) {
    var S = Sheets || (typeof globalThis !== "undefined" && globalThis.FinSheets);
    if (!S) throw new Error("Sheet engine not loaded");
    var wb = new S.Workbook({ sheets: sandbox.sheets.map(function (s) { return s.name; }) });
    sandbox.sheets.forEach(function (s) {
      Object.keys(s.cells).forEach(function (a) { wb.setRaw(s.name, a, s.cells[a]); });
      Object.keys(s.formats || {}).forEach(function (a) { wb.setFormat(s.name, a, s.formats[a]); });
      (s.editable || []).forEach(function (a) { wb.setRaw(s.name, a, ""); });
    });
    wb._journal = [];   // the starting state is not something to undo into
    return wb;
  }

  return {
    port: port, gaps: gaps, reportAll: reportAll,
    portSheet: portSheet, portChecks: portChecks, portMCQ: portMCQ,
    buildWorkbook: buildWorkbook, stripTags: stripTags, moduleOf: moduleOf,
    LEVEL_OF_MODULE: LEVEL_OF_MODULE, REQUIRED: REQUIRED, TIERS: TIERS
  };
});
