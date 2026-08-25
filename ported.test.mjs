/* Ported-lesson tests. Run: node tests/ported.test.mjs
   Every sandbox in the three ported lessons is solved here with the intended
   formulas and asserted to pass — the same forcing function as the v1 suite.
   Then each is mutation-tested: hardcode the answer, and the check must fail. */
await import("../js/sheets/engine.js");
await import("../js/learn/practice.js");
await import("../js/learn/curriculum.js");
await import("../js/learn/port.js");
await import("../js/learn/lessons/ebitda.js");
await import("../js/learn/lessons/1620-liquidity.js");
await import("../js/learn/lessons/1330-balance-sheet.js");
await import("../js/learn/lessons/2240-dcf.js");

const S = globalThis.FinSheets;
const P = globalThis.FinPractice;
const C = globalThis.FinCurriculum;
const Port = globalThis.FinPort;
const L = globalThis.FinLessons;

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

/* The intended solution for every sandbox. A lesson whose sandbox is not
   listed here fails the suite on purpose — same rule as the v1 harness. */
const SOLUTIONS = {
  "ebitda": { "P&L": { B4: "=B2+B3", B6: "=B4+B5", B7: "=B6/B2" } },
  "1620-liquidity": {
    "Liquidity": { B5: "=SUM(B2:B4)", B8: "=SUM(B6:B7)", B10: "=B5/B8", B11: "=(B5-B2)/B8" }
  },
  "1330-balance-sheet": {
    "Balance sheet": { B5: "=B3+B4", B10: "=SUM(B5:B9)", B13: "=120000+180000-50000", B17: "=SUM(B12:B16)" }
  },
  "2240-dcf": {
    "DCF": {
      C7: "=1/(1+$B$2)^C5", D7: "=1/(1+$B$2)^D5", E7: "=1/(1+$B$2)^E5",
      C8: "=C6*C7", D8: "=D6*D7", E8: "=E6*E7",
      B10: "=SUM(C8:E8)", B11: "=E6*(1+B3)/(B2-B3)", B12: "=B11*E7",
      B13: "=B10+B12", B15: "=B13+B14"
    }
  }
};

function build(lesson) {
  return Port.buildWorkbook(lesson.sandbox, S);
}
function solve(lesson, wb) {
  const sol = SOLUTIONS[lesson.id];
  Object.entries(sol).forEach(([sheet, cells]) =>
    Object.entries(cells).forEach(([a, f]) => wb.setRaw(sheet, a, f)));
  return wb;
}

const LESSONS = ["ebitda", "1620-liquidity", "1330-balance-sheet", "2240-dcf"].map((id) => L[id]);

/* ------------------------------------------------------------- validity */
group("The ported lessons validate");
{
  const cur = new C.Curriculum(LESSONS);
  cur.validateAll().forEach((v) => ok(`${v.id} validates`, v.ok, JSON.stringify(v.problems)));
  ok("no prerequisite cycles", cur.findCycles().length === 0, JSON.stringify(cur.findCycles()));

  // EBITDA and the balance sheet legitimately still lack prerequisites: theirs
  // are lessons that have not been ported yet (revenue, COGS, opex; modules
  // 1100-1300). That is a real gap and the report is right to keep flagging it
  // rather than being silenced — so the assertion is that prerequisites are the
  // ONLY thing outstanding.
  const PENDING_PREREQS = ["ebitda", "1330-balance-sheet"];
  LESSONS.forEach((l) => {
    const g = Port.gaps(l);
    const fields = g.missing.map((m) => m.field);
    if (PENDING_PREREQS.includes(l.id)) {
      ok(`${l.id}: prerequisites are the only outstanding gap`,
        fields.length === 1 && fields[0] === "prerequisites", JSON.stringify(fields));
    } else {
      ok(`${l.id} has no remaining gaps against the brief`, g.complete, JSON.stringify(fields));
    }
  });
  ok("the gap report still flags them rather than being silenced",
    Port.gaps(L["ebitda"]).complete === false);
}

/* ------------------------------------------------- sandboxes are solvable */
group("Every sandbox is solvable with the intended formulas");
{
  LESSONS.forEach((l) => {
    ok(`${l.id} has a solution on file`, !!SOLUTIONS[l.id]);
    if (!SOLUTIONS[l.id]) return;
    const wb = solve(l, build(l));
    const results = wb.runChecks(l.sandbox.checks);
    const bad = results.filter((r) => !r.ok);
    ok(`${l.id}: all ${results.length} checks pass`, bad.length === 0,
      bad.map((b) => `${b.label}: ${b.why}`).join(" | "));
  });
}

/* ---------------------------------------------- mutation: blank each cell */
group("Mutation: blanking any answer cell must fail a check");
{
  LESSONS.forEach((l) => {
    const sol = SOLUTIONS[l.id];
    Object.entries(sol).forEach(([sheet, cells]) => {
      Object.keys(cells).forEach((addr) => {
        const wb = solve(l, build(l));
        wb.setRaw(sheet, addr, "");
        const bad = wb.runChecks(l.sandbox.checks).filter((r) => !r.ok);
        ok(`${l.id} ${addr} blanked → a check fails`, bad.length > 0);
      });
    });
  });
}

/* ------------------------------- mutation: hardcode the correct answer */
group("Mutation: the right number, typed in, must still fail (§17)");
{
  LESSONS.forEach((l) => {
    const sol = SOLUTIONS[l.id];
    Object.entries(sol).forEach(([sheet, cells]) => {
      Object.keys(cells).forEach((addr) => {
        const wb = solve(l, build(l));
        const correctValue = wb.value(sheet, addr);
        if (typeof correctValue !== "number") return;
        wb.setRaw(sheet, addr, String(correctValue));      // right answer, no formula
        const checkForCell = l.sandbox.checks.filter((c) => c.cell === addr && c.mustFormula);
        if (!checkForCell.length) return;
        const bad = wb.runChecks(checkForCell).filter((r) => !r.ok);
        ok(`${l.id} ${addr} hardcoded → rejected`, bad.length > 0,
          `value ${correctValue} accepted without a formula`);
      });
    });
  });
}

/* ------------------------------------------- the numbers are the real ones */
group("The figures tie to the rest of the curriculum");
{
  const bs = solve(L["1330-balance-sheet"], build(L["1330-balance-sheet"]));
  eq("balance sheet total assets", bs.value("Balance sheet", "B10"), 1950000);
  eq("balance sheet ties", bs.value("Balance sheet", "B10") - bs.value("Balance sheet", "B17"), 0);
  eq("retained earnings rolls forward", bs.value("Balance sheet", "B13"), 250000);

  const liq = solve(L["1620-liquidity"], build(L["1620-liquidity"]));
  eq("current ratio", liq.value("Liquidity", "B10"), 3, 0.001);
  eq("quick ratio", liq.value("Liquidity", "B11"), 2, 0.001);
  ok("liquidity's current assets match the balance sheet's",
    liq.value("Liquidity", "B5") ===
    bs.value("Balance sheet", "B7") + bs.value("Balance sheet", "B8") + bs.value("Balance sheet", "B9"));

  const dcf = solve(L["2240-dcf"], build(L["2240-dcf"]));
  eq("enterprise value", dcf.value("DCF", "B13"), 5915993, 4000);
  eq("equity value", dcf.value("DCF", "B15"), 5465993, 4000);
  const tvShare = dcf.value("DCF", "B12") / dcf.value("DCF", "B13");
  ok("the terminal value carries most of the value, as the lesson claims",
    tvShare > 0.82 && tvShare < 0.86, String(tvShare));
}

/* --------------------------------- the DCF sandbox is a live model */
group("The sandboxes are live models, not static answers");
{
  const dcf = solve(L["2240-dcf"], build(L["2240-dcf"]));
  const ev12 = dcf.value("DCF", "B13");
  dcf.setRaw("DCF", "B2", "0.14");
  const ev14 = dcf.value("DCF", "B13");
  ok("raising WACC lowers enterprise value", ev14 < ev12, `${ev12} → ${ev14}`);
  dcf.setRaw("DCF", "B2", "0.12");
  dcf.setRaw("DCF", "B3", "0.06");
  ok("raising terminal growth raises it", dcf.value("DCF", "B13") > ev12);

  // the §41 anchor lesson: fill the discount factor across without the $
  const broken = build(L["2240-dcf"]);
  broken.setRaw("DCF", "C7", "=1/(1+B2)^C5");
  broken.fill("DCF", "C7", "C7:E7");
  eq("without the anchor, the reference drifts", broken.raw("DCF", "E7"), "=1/(1+D2)^E5");
  ok("and the fill produces a wrong factor", Math.abs(broken.value("DCF", "E7") - 0.7118) > 0.01,
    String(broken.value("DCF", "E7")));

  const anchored = build(L["2240-dcf"]);
  anchored.setRaw("DCF", "C7", "=1/(1+$B$2)^C5");
  anchored.fill("DCF", "C7", "C7:E7");
  eq("with the anchor, it holds", anchored.raw("DCF", "E7"), "=1/(1+$B$2)^E5");
  eq("and the factor is right", anchored.value("DCF", "E7"), 0.7118, 0.001);
}

/* --------------------------------------------- practice questions grade */
group("Every practice question in every lesson can be answered");
{
  const ctx = { sheets: S };
  LESSONS.forEach((l) => {
    (l.practice || []).forEach((q) => {
      let answer;
      switch (q.type) {
        case "numeric": answer = String(q.expect); break;
        case "mcq": answer = q.options.findIndex((o) => o.correct); break;
        case "match": answer = Object.fromEntries(q.pairs.map((p) => [p.left, p.right])); break;
        case "scenario": answer = Object.fromEntries(q.rows.map((r) => [r.label, r.answer])); break;
        case "order": answer = q.sequence; break;
        case "formula": answer = [].concat(q.accept)[0]; break;
        case "interpretation":
          answer = (q.keywords || []).map((g) => [].concat(g)[0]).join(" and also ") + " explains it";
          break;
        default: answer = null;
      }
      if (answer === null) return;
      const r = P.grade(q, answer, ctx);
      ok(`${l.id}/${q.id} (${q.type}) accepts its own intended answer`, r.ok,
        `${JSON.stringify(answer)} → ${r.feedback}`);
    });

    // §11 — all four tiers, in every lesson
    const tiers = new Set((l.practice || []).map((q) => q.tier));
    ok(`${l.id} covers all four practice tiers`,
      ["beginner", "practical", "application", "challenge"].every((t) => tiers.has(t)),
      JSON.stringify([...tiers]));

    // the challenge is a debug question and must identify its own broken cell
    if (l.challenge) {
      const r = P.grade(l.challenge, l.challenge.brokenCell, ctx);
      ok(`${l.id} challenge accepts its own answer`, r.ok, r.feedback);
      if (l.challenge.nearMiss) {
        const nm = P.grade(l.challenge, [].concat(l.challenge.nearMiss)[0], ctx);
        ok(`${l.id} challenge gives partial credit for the downstream symptom`, nm.partial, nm.feedback);
      }
    }
  });
}

/* --------------------------------------------------- graph across lessons */
group("The three ported lessons form a graph");
{
  const cur = new C.Curriculum(LESSONS);
  const order = cur.learningOrder();
  ok("the balance sheet precedes liquidity",
    order.indexOf("1330-balance-sheet") < order.indexOf("1620-liquidity"), JSON.stringify(order));
  ok("the balance sheet precedes the DCF",
    order.indexOf("1330-balance-sheet") < order.indexOf("2240-dcf"), JSON.stringify(order));

  const prog = new C.Progress();
  ok("the DCF is not ready cold", !cur.readiness("2240-dcf", prog).ready);
  prog.record("1330-balance-sheet", { concept: 1, practice: 1, modeling: 1 });
  ok("and is ready once its prerequisite is done", cur.readiness("2240-dcf", prog).ready);

  const rec = cur.recommend(new C.Progress());
  ok("a cold learner is sent somewhere with no prerequisites",
    cur.readiness(rec.lesson.id, new C.Progress()).ready, rec.lesson.id);

  const hits = cur.search("quick ratio");
  eq("search finds liquidity", hits[0].id, "1620-liquidity");
  ok("search finds the DCF by tag", cur.search("terminal value")[0].id === "2240-dcf");
}

/* ------------------------------------------------------------- report */
console.log("\n" + "─".repeat(58));
if (fail === 0) console.log(`\x1b[32mAll ${pass} assertions passed.\x1b[0m`);
else {
  console.log(`\x1b[31m${fail} of ${pass + fail} assertions FAILED.\x1b[0m`);
  fails.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
