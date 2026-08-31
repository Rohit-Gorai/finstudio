/* Learning-architecture tests. Run: node tests/learn.test.mjs */
await import("../js/sheets/engine.js");
await import("../js/learn/practice.js");
await import("../js/learn/curriculum.js");
await import("../js/learn/lessons/ebitda.js");

const S = globalThis.FinSheets;
const P = globalThis.FinPractice;
const C = globalThis.FinCurriculum;
const EBITDA = globalThis.FinLessons.ebitda;

let pass = 0, fail = 0;
const fails = [];
function ok(name, cond, detail) {
  if (cond) { pass++; return; }
  fail++; fails.push(name + (detail ? "  →  " + detail : ""));
}
function eq(name, got, want, tol = 1e-9) {
  if (typeof want === "number" && typeof got === "number") ok(name, Math.abs(got - want) <= tol, `got ${got}, want ${want}`);
  else ok(name, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}
function group(t) { console.log("\n\x1b[1m" + t + "\x1b[0m"); }
const q = (id) => EBITDA.practice.find((x) => x.id === id);
const ctx = { sheets: S };

/* ------------------------------------------------------------- numeric */
group("Numeric answers");
{
  const p1 = q("ebitda-p1");
  ok("plain number", P.grade(p1, "30", ctx).ok);
  ok("with a currency symbol", P.grade(p1, "₹30", ctx).ok);
  ok("with grouping", P.grade(p1, "30.00", ctx).ok);
  ok("wrong answer fails", !P.grade(p1, "60", ctx).ok);
  ok("empty fails politely", P.grade(p1, "", ctx).feedback.includes("number"));

  const p2 = q("ebitda-p2");
  ok("percent accepted", P.grade(p2, "30%", ctx).ok);
  ok("decimal accepted", P.grade(p2, "0.30", ctx).ok);
  const scale = P.grade(p2, "30", ctx);
  ok("30 typed for 30% earns partial credit", scale.partial, JSON.stringify(scale));
  ok("and says what went wrong", /percentage|scale/i.test(scale.feedback), scale.feedback);

  const signed = P.grade({ type: "numeric", expect: -50, tol: 0.01 }, "50", ctx);
  ok("sign errors get partial credit", signed.partial && /sign/i.test(signed.feedback));
}

/* ------------------------------------------------------------- formula */
group("Formula answers (§17 partial credit)");
{
  const fq = {
    type: "formula", prompt: "Write EBITDA.",
    accept: ["=B4+B5"], mustReference: ["B4", "B5"], expectValue: 540000
  };
  ok("the right formula passes", P.grade(fq, "=B4+B5", ctx).ok);
  ok("whitespace and case are forgiven", P.grade(fq, " = b4 + b5 ", ctx).ok);

  const hard = P.grade(fq, "540000", ctx);
  ok("§17: right number, no formula → partial", hard.partial, JSON.stringify(hard));
  eq("§17: half credit", hard.score, 0.5);
  ok("§17: and it explains why", /output.*calculation|updates/i.test(hard.feedback), hard.feedback);

  const wrongRefs = P.grade(fq, "=1560000-1020000", ctx);
  ok("formula that hardcodes its inputs is caught", !wrongRefs.ok);
  ok("and names the cell it should read", wrongRefs.feedback.includes("B4"), wrongRefs.feedback);

  const needsSum = { type: "formula", mustUse: ["SUM"], accept: ["=SUM(B2:B5)"] };
  ok("mustUse enforced", !P.grade(needsSum, "=B2+B3+B4+B5", ctx).ok);
  ok("mustUse satisfied", P.grade(needsSum, "=SUM(B2:B5)", ctx).ok);
}

/* ----------------------------------------------------------------- mcq */
group("Multiple choice, multi-select, match, order");
{
  const p3 = q("ebitda-p3");
  const right = P.grade(p3, 2, ctx);
  ok("correct option passes", right.ok);
  ok("and explains why it's right", right.feedback.includes("D in EBITDA"), right.feedback);
  const wrong = P.grade(p3, 0, ctx);
  ok("wrong option fails", !wrong.ok);
  ok("but still teaches", wrong.feedback.length > 20, wrong.feedback);
  ok("answering by text works", P.grade(p3, "Depreciation", ctx).ok);

  const multi = {
    type: "multi",
    options: [
      { text: "Interest", correct: true }, { text: "Tax", correct: true },
      { text: "Rent", correct: false }, { text: "Depreciation", correct: true }
    ]
  };
  ok("all correct passes", P.grade(multi, [0, 1, 3], ctx).ok);
  const missed = P.grade(multi, [0, 1], ctx);
  ok("a missing pick is partial", missed.partial, JSON.stringify(missed));
  ok("an extra wrong pick is partial", P.grade(multi, [0, 1, 2, 3], ctx).partial);
  ok("all wrong fails", !P.grade(multi, [2], ctx).ok);

  const match = {
    type: "match",
    pairs: [
      { left: "Inventory", right: "Balance sheet" },
      { left: "Revenue", right: "Income statement" },
      { left: "Capex", right: "Cash flow statement" }
    ]
  };
  ok("all matched passes", P.grade(match, {
    Inventory: "Balance sheet", Revenue: "Income statement", Capex: "Cash flow statement"
  }, ctx).ok);
  const half = P.grade(match, {
    Inventory: "Balance sheet", Revenue: "Income statement", Capex: "Balance sheet"
  }, ctx);
  eq("two of three scores 2/3", Math.round(half.score * 100) / 100, 0.67, 0.01);

  const order = { type: "order", sequence: ["Revenue", "Gross profit", "EBITDA", "EBIT", "Net income"] };
  ok("right order passes", P.grade(order, ["Revenue", "Gross profit", "EBITDA", "EBIT", "Net income"], ctx).ok);
  const swapped = P.grade(order, ["Revenue", "Gross profit", "EBIT", "EBITDA", "Net income"], ctx);
  ok("one swap is partial, not zero", swapped.partial, JSON.stringify(swapped));
}

/* ------------------------------------------------------------ scenario */
group("Scenario and interpretation");
{
  const p4 = q("ebitda-p4");
  const allRight = P.grade(p4, {
    Revenue: "up", "Gross profit": "up", "Operating expenses": "none",
    EBITDA: "up", "EBITDA margin": "up"
  }, ctx);
  ok("every line right passes", allRight.ok, JSON.stringify(allRight));

  const oneWrong = P.grade(p4, {
    Revenue: "up", "Gross profit": "up", "Operating expenses": "up",
    EBITDA: "up", "EBITDA margin": "up"
  }, ctx);
  ok("one wrong line is partial", oneWrong.partial);
  ok("and names the line to revisit", oneWrong.wrongRows.includes("Operating expenses"));
  eq("scored per line", oneWrong.score, 0.8, 0.001);

  const p5 = q("ebitda-p5");
  ok("a full explanation passes",
    P.grade(p5, "The cash is tied up in working capital — receivables grew and nothing was collected.", ctx).ok);
  const halfAnswer = P.grade(p5, "Their receivables went up a lot that year.", ctx);
  ok("a partial explanation gets partial credit", halfAnswer.partial || halfAnswer.ok, JSON.stringify(halfAnswer));
  ok("an off-target answer fails", !P.grade(p5, "Because their share price fell sharply.", ctx).ok);
  ok("a one-word answer is refused", /say a little more/i.test(P.grade(p5, "cash", ctx).feedback));
}

/* --------------------------------------------------------------- debug */
group("Model debugging");
{
  const c = EBITDA.challenge;
  ok("the broken cell passes", P.grade(c, "B6", ctx).ok);
  ok("case and $ are forgiven", P.grade(c, "$b$6", ctx).ok);
  const near = P.grade(c, "B7", ctx);
  ok("the downstream symptom is a near miss", near.partial, JSON.stringify(near));
  ok("and points upstream", /upstream/i.test(near.feedback), near.feedback);
  ok("an innocent cell fails", !P.grade(c, "B2", ctx).ok);
}

/* ------------------------------------------------- sandbox integration */
group("Sandbox questions run through the real engine");
{
  const wb = new S.Workbook({ sheets: ["P&L"] });
  Object.entries(EBITDA.sandbox.sheets[0].cells).forEach(([a, v]) => wb.setRaw("P&L", a, v));
  const sq = { type: "sheet", checks: EBITDA.sandbox.checks };

  const empty = P.grade(sq, wb, ctx);
  ok("an empty sandbox scores zero", empty.score === 0, JSON.stringify(empty));

  wb.setRaw("P&L", "B4", "=B2+B3");
  const partial = P.grade(sq, wb, ctx);
  ok("one of three checks passing is partial", partial.partial, JSON.stringify(partial));
  eq("scored per check", partial.score, 1 / 3, 0.001);

  // the whole point: right number, typed in, still fails
  wb.setRaw("P&L", "B6", "540000");
  const hardcoded = P.grade(sq, wb, ctx);
  ok("a hardcoded EBITDA does not pass", hardcoded.score < 1);
  ok("and says the formula is the point", /formula/i.test(hardcoded.feedback), hardcoded.feedback);

  wb.setRaw("P&L", "B6", "=B4+B5");
  wb.setRaw("P&L", "B7", "=B6/B2");
  const solved = P.grade(sq, wb, ctx);
  ok("the built model passes", solved.ok, JSON.stringify(solved));

  // and it is a live model, not a static answer
  wb.setRaw("P&L", "B2", "3000000");
  eq("changing revenue moves EBITDA", wb.value("P&L", "B6"), 3000000 - 840000 - 1020000);
}

/* ----------------------------------------------------- hints & attempts */
group("Progressive hints (§34)");
{
  const a = new P.Attempt(q("ebitda-p6"));
  const first = a.submit("80", ctx);
  ok("a wrong first try does not solve", !first.ok);
  eq("three hints are available", first.hintsLeft, 3);

  const h1 = a.nextHint();
  eq("hint 1 arrives first", h1.n, 1);
  ok("and does not give the answer", !h1.text.includes("110"), h1.text);
  const h2 = a.nextHint();
  eq("hint 2 second", h2.n, 2);
  a.nextHint();
  const sol = a.nextHint();
  eq("the solution comes only after the ladder", sol.kind, "solution");
  ok("and it is the worked answer", sol.text.includes("110"));
  ok("the ladder is exhausted", a.nextHint() === null);

  const solved = a.submit("110", ctx);
  ok("solving still registers", solved.ok);
  ok("but hints cost credit", solved.credit < 1, String(solved.credit));

  const cold = new P.Attempt(q("ebitda-p6"));
  eq("solving cold is full credit", cold.submit("110", ctx).credit, 1);
}

/* ----------------------------------------------------------- mastery */
group("Three mastery tracks (§18)");
{
  eq("mcq is concept work", P.trackOf({ type: "mcq" }), "concept");
  eq("interpretation is concept work", P.trackOf({ type: "interpretation" }), "concept");
  eq("numeric is practice", P.trackOf({ type: "numeric" }), "practice");
  eq("scenario is practice", P.trackOf({ type: "scenario" }), "practice");
  eq("sandbox is modelling", P.trackOf({ type: "sheet" }), "modeling");
  eq("debugging is modelling", P.trackOf({ type: "debug" }), "modeling");

  const attempts = [
    { q: { type: "mcq" }, credit: 1 },
    { q: { type: "numeric" }, credit: 0.5 },
    { q: { type: "sheet" }, credit: 0 }
  ];
  const m = P.masteryOf(attempts);
  eq("concept mastery", m.concept, 1);
  eq("practice mastery", m.practice, 0.5);
  eq("modelling mastery", m.modeling, 0);
  ok("a track never attempted reports null, not zero",
    P.masteryOf([{ q: { type: "mcq" }, credit: 1 }]).modeling === null);
}

/* --------------------------------------------------------- the lesson */
group("The reference lesson validates");
{
  const cur = new C.Curriculum([EBITDA]);
  const v = cur.validateAll()[0];
  ok("EBITDA passes validation", v.ok, JSON.stringify(v.problems));

  ok("§11: four practice tiers present",
    ["beginner", "practical", "application", "challenge"]
      .every((t) => EBITDA.practice.some((p) => p.tier === t)),
    JSON.stringify(EBITDA.practice.map((p) => p.tier)));
  ok("§8: has a visualization", !!EBITDA.visualization);
  ok("§8: has a sandbox exercise", !!EBITDA.sandbox);
  ok("§33: has 'why it matters'", !!EBITDA.whyItMatters);
  ok("§34: has common mistakes", (EBITDA.commonMistakes || []).length >= 2);
  ok("§35: has real-world uses", (EBITDA.realWorld || []).length >= 3);
  ok("§36: has end-of-lesson takeaways", (EBITDA.takeaways || []).length >= 3);
  ok("the one-line blurb survives alongside them", typeof EBITDA.summary === "string" && EBITDA.summary.length > 20);
  ok("§42: has three difficulty levels of explanation",
    ["beginner", "intermediate", "advanced"].every((k) => EBITDA.explanation[k]));

  const noPractice = { id: "x", title: "X", level: "statements" };
  const v2 = C.validate(noPractice, { x: noPractice });
  ok("§11 is enforced: a lesson with no practice is invalid", !v2.ok);
  ok("and says so plainly", v2.problems.some((p) => /practice/.test(p)), JSON.stringify(v2.problems));
}

/* ---------------------------------------------- graph, progress, paths */
group("Curriculum graph, progress and paths");
{
  const L = (id, level, prereqs, title) => ({
    id, title: title || id, level, prerequisites: prereqs || [],
    estimatedTime: 5, practice: [{ type: "mcq", prompt: "?", options: [{ text: "a", correct: true }] }]
  });
  const cur = new C.Curriculum([
    L("money", "foundations", [], "What is money"),
    L("tvm", "foundations", ["money"], "Time value of money"),
    L("equation", "accounting", ["money"], "The accounting equation"),
    L("is", "statements", ["equation"], "Income statement"),
    L("fcf", "statements", ["is"], "Free cash flow"),
    L("wacc", "valuation", ["tvm"], "WACC"),
    L("dcf", "valuation", ["tvm", "fcf", "wacc"], "DCF")
  ]);

  ok("no cycles in a sane curriculum", cur.findCycles().length === 0);
  const order = cur.learningOrder();
  ok("prerequisites always precede their lesson",
    order.indexOf("tvm") < order.indexOf("dcf") &&
    order.indexOf("fcf") < order.indexOf("dcf") &&
    order.indexOf("wacc") < order.indexOf("dcf"), JSON.stringify(order));
  eq("§41: DCF's full upstream chain", cur.prerequisiteChain("dcf").sort(),
    ["equation", "fcf", "is", "money", "tvm", "wacc"]);
  eq("what a lesson unlocks", cur.unlocks("tvm").sort(), ["dcf", "wacc"]);

  const cyc = new C.Curriculum([L("a", "foundations", ["b"]), L("b", "foundations", ["a"])]);
  ok("a prerequisite cycle is caught", cyc.findCycles().length > 0);

  // progress
  const prog = new C.Progress();
  const r0 = cur.readiness("dcf", prog);
  ok("§41: DCF is not ready at the start", !r0.ready);
  eq("and lists three prerequisites", r0.prerequisites.length, 3);
  ok("§41: but is never blocked", r0.blocking === false);

  ["money", "tvm", "fcf", "wacc", "equation", "is"].forEach((id) =>
    prog.record(id, { concept: 1 }));
  ok("DCF is ready once its chain is done", cur.readiness("dcf", prog).ready);

  const summary = prog.levelSummary(cur);
  const foundations = summary.find((s) => s.key === "foundations");
  eq("§18: foundations complete", foundations.pct, 1);
  const val = summary.find((s) => s.key === "valuation");
  ok("§18: valuation partially done", val.pct > 0 && val.pct < 1, JSON.stringify(val));

  // recommendation
  const fresh = new C.Progress();
  const rec1 = cur.recommend(fresh);
  eq("§6: a new learner starts at the beginning", rec1.lesson.id, "money");
  eq("and it is flagged as next, not resume", rec1.reason, "next");

  fresh.markSeen("money");
  const rec2 = cur.recommend(fresh);
  eq("§6: an unfinished lesson is resumed", rec2.lesson.id, "money");
  eq("and flagged as such", rec2.reason, "resume");

  fresh.record("money", { concept: 1 });
  const rec3 = cur.recommend(fresh);
  ok("§6: once finished, it moves on", rec3.lesson.id !== "money", rec3.lesson.id);

  // paths
  const paths = cur.paths();
  ok("§46: paths are offered", paths.length >= 5);
  const ibPath = cur.pathLessons("investment-banking");
  ok("§46: the IB path pulls in prerequisites from other levels",
    ibPath.includes("money"), JSON.stringify(ibPath));
  ok("§46: and is in dependency order",
    ibPath.indexOf("equation") < ibPath.indexOf("is"), JSON.stringify(ibPath));

  eq("§48: a beginner is routed to foundations",
    C.pathFor({ experience: "beginner", goal: "" }), "foundations");
  eq("§48: a stated goal wins",
    C.pathFor({ experience: "beginner", goal: "Investment banking" }), "investment-banking");

  const recPath = cur.recommend(new C.Progress(), { path: "investing" });
  ok("§46: recommendation respects the chosen path", !!recPath.lesson);

  // search
  const hits = cur.search("dcf");
  eq("§20: search finds the lesson", hits[0].id, "dcf");
  ok("§20: and offers learn + practice, not just the article",
    hits[0].learn && hits[0].practice, JSON.stringify(hits[0]));
  ok("search matches partial words", cur.search("account").length > 0);
  eq("empty query returns nothing", cur.search("").length, 0);
}

/* ------------------------------------------------------------- report */
console.log("\n" + "─".repeat(58));
if (fail === 0) console.log(`\x1b[32mAll ${pass} assertions passed.\x1b[0m`);
else {
  console.log(`\x1b[31m${fail} of ${pass + fail} assertions FAILED.\x1b[0m`);
  fails.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
