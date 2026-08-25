/* ============================================================================
   FinStudio practice engine
   ----------------------------------------------------------------------------
   Grades the ten question types the brief calls for (§10), awards partial
   credit where the learner got the number but not the method (§17), and hands
   out hints one rung at a time rather than revealing the answer (§15, §34).

   Headless: no DOM. Attaches to window.FinPractice in the browser, and to
   globalThis under node, so the same file is what the tests exercise.

   Spreadsheet questions delegate to the v2 sheet engine's check(), so a
   hardcoded number never passes a question whose point was the formula.
   ========================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FinPractice = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* ---------------------------------------------------------------- parsing */
  // "12.5%", "₹1,250", "(1,250)", "8.4x", "1.25" all become numbers.
  function toNumber(input) {
    if (typeof input === "number") return input;
    var s = String(input == null ? "" : input).trim();
    if (!s) return null;
    var neg = false;
    if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
    s = s.replace(/[₹$€£,\s]/g, "");
    if (s.charAt(0) === "-") { neg = !neg; s = s.slice(1); }
    var pct = false, mult = false;
    if (s.slice(-1) === "%") { pct = true; s = s.slice(0, -1); }
    if (/[xX]$/.test(s)) { mult = true; s = s.slice(0, -1); }
    if (!/^\d*\.?\d+$/.test(s)) return null;
    var v = parseFloat(s);
    if (pct) v = v / 100;
    return { value: neg ? -v : v, wasPercent: pct, wasMultiple: mult };
  }

  function norm(s) { return String(s == null ? "" : s).trim().toLowerCase(); }

  /* ---------------------------------------------------------------- grading */
  function result(score, feedback, extra) {
    var r = {
      ok: score >= 1,
      partial: score > 0 && score < 1,
      score: Math.max(0, Math.min(1, score)),
      feedback: feedback || ""
    };
    if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }

  var GRADERS = {

    /* --- "What is the EBITDA?" ------------------------------------------ */
    numeric: function (q, answer) {
      var parsed = toNumber(answer);
      if (parsed === null) return result(0, "Enter a number.");
      var got = parsed.value, want = q.expect;
      var tol = q.tol == null ? Math.max(Math.abs(want) * 0.005, 0.005) : q.tol;

      if (Math.abs(got - want) <= tol) return result(1, q.correct || "Correct.");

      // The single most common wrong answer in finance is the right ratio at
      // the wrong scale: 0.42 typed where 42% was wanted, or the reverse.
      if (Math.abs(got * 100 - want) <= tol || Math.abs(got / 100 - want) <= tol) {
        return result(0.5, q.scaleHint ||
          "Right figure, wrong scale — check whether the answer is a percentage or a decimal.");
      }
      if (want !== 0 && Math.abs(got + want) <= tol) {
        return result(0.5, "Right magnitude, wrong sign. Which direction does this move?");
      }
      return result(0, q.wrong || "Not quite.");
    },

    /* --- "Write the formula." ------------------------------------------- */
    formula: function (q, answer, ctx) {
      var raw = String(answer || "").trim();
      if (!raw) return result(0, "Write a formula.");
      if (raw.charAt(0) !== "=") {
        // §17: the number can be right and the model still wrong.
        var n = toNumber(raw);
        if (n !== null && q.expectValue != null &&
            Math.abs(n.value - q.expectValue) <= (q.tol == null ? 0.5 : q.tol)) {
          return result(0.5, "Correct output, but you haven't built the calculation. " +
            "Type it as a formula so it updates when the inputs change.");
        }
        return result(0, "A formula starts with = and refers to cells.");
      }
      var S = ctx && ctx.sheets;
      var flat = raw.replace(/\s+/g, "").toUpperCase();

      if (q.mustUse) {
        var need = [].concat(q.mustUse);
        for (var i = 0; i < need.length; i++) {
          if (flat.indexOf(need[i].toUpperCase()) < 0) {
            return result(0.25, "Use " + need[i] + " here.");
          }
        }
      }
      if (q.mustReference && S) {
        var want = [].concat(q.mustReference).map(function (x) { return x.toUpperCase(); });
        var got = S.precedentsOf(raw, null).map(function (p) {
          return p.indexOf("!") >= 0 ? p.split("!")[1] : p;
        });
        for (var j = 0; j < want.length; j++) {
          if (got.indexOf(want[j]) < 0) {
            return result(0.5, "This should read from " + want[j] +
              ". Right now it doesn't, so it won't update when that cell changes.");
          }
        }
      }
      if (q.accept) {
        var forms = [].concat(q.accept).map(function (f) {
          return String(f).replace(/\s+/g, "").toUpperCase();
        });
        if (forms.indexOf(flat) < 0) {
          return result(q.mustReference ? 0.75 : 0, q.wrong || "Not the formula this step is after.");
        }
      }
      return result(1, q.correct || "That's the formula.");
    },

    /* --- "Which statement is correct?" ---------------------------------- */
    mcq: function (q, answer) {
      var idx = typeof answer === "number" ? answer
        : q.options.findIndex(function (o) { return norm(o.text) === norm(answer); });
      var opt = q.options[idx];
      if (!opt) return result(0, "Pick an option.");
      // Every option explains itself — a wrong pick should teach, not just buzz.
      return result(opt.correct ? 1 : 0, opt.why || (opt.correct ? "Correct." : "Not quite."));
    },

    /* --- "Select all that apply." --------------------------------------- */
    multi: function (q, answer) {
      var picked = [].concat(answer || []).map(Number);
      var correct = [], wrongPicked = 0, missed = 0;
      q.options.forEach(function (o, i) {
        if (o.correct) correct.push(i);
      });
      correct.forEach(function (i) { if (picked.indexOf(i) < 0) missed++; });
      picked.forEach(function (i) { if (correct.indexOf(i) < 0) wrongPicked++; });
      if (!missed && !wrongPicked) return result(1, q.correct || "All of them, and nothing else.");
      var score = Math.max(0, (correct.length - missed - wrongPicked) / correct.length);
      if (score <= 0) return result(0, q.wrong || "Not quite.");
      return result(score * 0.9,
        missed && wrongPicked ? "Some right, some wrong — and one is missing."
          : missed ? "Everything you picked is right, but one is missing."
            : "One of those doesn't belong.");
    },

    /* --- Drag each account onto the statement it belongs to. ------------- */
    match: function (q, answer) {
      var got = answer || {};
      var right = 0;
      q.pairs.forEach(function (p) {
        if (norm(got[p.left]) === norm(p.right)) right++;
      });
      if (right === q.pairs.length) return result(1, q.correct || "Every one placed correctly.");
      if (right === 0) return result(0, q.wrong || "None of those are in the right place yet.");
      return result(right / q.pairs.length,
        right + " of " + q.pairs.length + " in the right place.");
    },

    /* --- Put the income statement lines in order. ----------------------- */
    order: function (q, answer) {
      var got = [].concat(answer || []).map(norm);
      var want = q.sequence.map(norm);
      if (got.length !== want.length) return result(0, "Place every line.");
      var right = 0;
      for (var i = 0; i < want.length; i++) if (got[i] === want[i]) right++;
      if (right === want.length) return result(1, q.correct || "That's the order.");
      // adjacent-pair credit: the learner may have the flow right but be offset
      var pairsRight = 0;
      for (var j = 0; j < want.length - 1; j++) {
        var a = got.indexOf(want[j]), b = got.indexOf(want[j + 1]);
        if (a >= 0 && b >= 0 && a < b) pairsRight++;
      }
      return result(Math.min(0.9, pairsRight / (want.length - 1)),
        "The sequence isn't right yet — " + pairsRight + " of " + (want.length - 1) +
        " lines follow the one they should.");
    },

    /* --- "Revenue falls 15%. What happens to each line?" ----------------- */
    scenario: function (q, answer) {
      var got = answer || {};
      var right = 0, wrongOnes = [];
      q.rows.forEach(function (row) {
        if (norm(got[row.label]) === norm(row.answer)) right++;
        else wrongOnes.push(row.label);
      });
      if (right === q.rows.length) return result(1, q.correct || "Every line moves the way you said.");
      return result(right / q.rows.length,
        right + " of " + q.rows.length + " right. Look again at " + wrongOnes.slice(0, 2).join(" and ") + ".",
        { wrongRows: wrongOnes });
    },

    /* --- "Why did ROIC fall?" — reasoning, checked on substance ---------- */
    interpretation: function (q, answer) {
      var text = norm(answer);
      if (text.length < 8) return result(0, "Say a little more — a sentence is enough.");
      var need = q.keywords || [];
      var hit = need.filter(function (group) {
        return [].concat(group).some(function (k) { return text.indexOf(norm(k)) >= 0; });
      }).length;
      if (!need.length) return result(1, q.correct || "Noted.");
      if (hit === need.length) return result(1, q.correct || "That's the reasoning.");
      if (hit === 0) return result(0, q.wrong || "That isn't the driver here.");
      return result(hit / need.length,
        "Part of it. You've got " + hit + " of the " + need.length + " things going on here.");
    },

    /* --- "Find the error in this model." -------------------------------- */
    debug: function (q, answer) {
      var got = String(answer || "").trim().toUpperCase().replace(/\$/g, "");
      var want = String(q.brokenCell).toUpperCase().replace(/\$/g, "");
      if (got === want) return result(1, q.correct || "That's the broken cell.");
      if (q.nearMiss && [].concat(q.nearMiss).map(function (c) {
        return String(c).toUpperCase();
      }).indexOf(got) >= 0) {
        return result(0.5, q.nearMissWhy ||
          "Close — that cell is wrong too, but it's wrong because of another one upstream.");
      }
      return result(0, q.wrong || "That cell is fine. Follow the number that looks wrong back to its source.");
    },

    /* --- Build it in the sandbox. --------------------------------------- */
    sheet: function (q, answer, ctx) {
      var wb = answer && answer.workbook ? answer.workbook : answer;
      if (!wb || typeof wb.check !== "function") {
        return result(0, "No workbook to check.");
      }
      var results = wb.runChecks(q.checks || []);
      var passed = results.filter(function (r) { return r.ok; }).length;
      var total = results.length || 1;
      if (passed === total) return result(1, q.correct || "The model checks out.");
      var firstFail = results.filter(function (r) { return !r.ok; })[0];
      return result(passed / total, firstFail ? firstFail.why : "Not there yet.",
        { checks: results });
    }
  };

  /* ---------------------------------------------------------------- public */
  function grade(question, answer, ctx) {
    var g = GRADERS[question.type];
    if (!g) return result(0, "Unknown question type: " + question.type);
    try {
      return g(question, answer, ctx || {});
    } catch (e) {
      return result(0, "Could not read that answer.");
    }
  }

  /* An attempt tracks hints spent, so a learner who was handed three hints
     and the worked solution does not score the same as one who got it cold. */
  function Attempt(question) {
    this.q = question;
    this.tries = 0;
    this.hintsUsed = 0;
    this.solved = false;
    this.solutionShown = false;
    this.bestScore = 0;
  }
  Attempt.prototype.submit = function (answer, ctx) {
    this.tries++;
    var r = grade(this.q, answer, ctx);
    if (r.score > this.bestScore) this.bestScore = r.score;
    if (r.ok) this.solved = true;
    r.tries = this.tries;
    r.hintsUsed = this.hintsUsed;
    r.hintsLeft = this.hintsLeft();
    // partial credit survives the hint penalty; a solved-cold answer is full marks
    r.credit = Math.max(0, r.score - this.hintsUsed * 0.15);
    return r;
  };
  Attempt.prototype.hintsLeft = function () {
    return Math.max(0, (this.q.hints || []).length - this.hintsUsed);
  };
  // §34: one rung at a time, and the worked solution only after the ladder.
  Attempt.prototype.nextHint = function () {
    var hints = this.q.hints || [];
    if (this.hintsUsed < hints.length) {
      var h = hints[this.hintsUsed];
      this.hintsUsed++;
      return { kind: "hint", n: this.hintsUsed, of: hints.length, text: h };
    }
    if (this.q.solution && !this.solutionShown) {
      this.solutionShown = true;
      this.hintsUsed++;
      return { kind: "solution", text: this.q.solution };
    }
    return null;   // the ladder is finished; there is nothing further to give
  };

  /* ---------------------------------------------------------------- mastery
     Three tracks, because knowing what EBITDA is, computing it, and building a
     forecast of it are three different competencies (§18). */
  var TRACK = {
    mcq: "concept", multi: "concept", match: "concept",
    order: "concept", interpretation: "concept",
    numeric: "practice", formula: "practice", scenario: "practice",
    sheet: "modeling", debug: "modeling"
  };
  function trackOf(question) { return TRACK[question.type] || "concept"; }

  function masteryOf(attempts) {
    var acc = {
      concept: { done: 0, total: 0 }, practice: { done: 0, total: 0 }, modeling: { done: 0, total: 0 }
    };
    (attempts || []).forEach(function (a) {
      var t = trackOf(a.q || a);
      acc[t].total++;
      acc[t].done += (a.credit != null ? a.credit : a.bestScore || 0);
    });
    var out = {};
    Object.keys(acc).forEach(function (t) {
      out[t] = acc[t].total ? acc[t].done / acc[t].total : null;
    });
    out.overall = (function () {
      var vals = Object.keys(acc).filter(function (t) { return acc[t].total; });
      if (!vals.length) return 0;
      var d = 0, n = 0;
      vals.forEach(function (t) { d += acc[t].done; n += acc[t].total; });
      return d / n;
    })();
    return out;
  }

  return {
    grade: grade, Attempt: Attempt, GRADERS: GRADERS,
    toNumber: toNumber, trackOf: trackOf, masteryOf: masteryOf,
    types: Object.keys(GRADERS)
  };
});
