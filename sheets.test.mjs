/* Engine v2 test suite. Run: node tests/sheets.test.mjs
   Covers every item the sandbox brief lists under §46, plus the §48
   "definition of done" workflow end to end. */
// package.json declares type:module, so the engine loads as ESM and its UMD
// wrapper attaches to globalThis. Same file, same global, as in the browser.
await import("../js/sheets/engine.js");
const S = globalThis.FinSheets;

let pass = 0, fail = 0;
const fails = [];
function ok(name, cond, detail) {
  if (cond) { pass++; return; }
  fail++; fails.push(name + (detail ? "  →  " + detail : ""));
}
function eq(name, got, want, tol = 1e-6) {
  if (typeof want === "number" && typeof got === "number") {
    ok(name, Math.abs(got - want) <= tol, `got ${got}, want ${want}`);
  } else {
    ok(name, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  }
}
function group(t) { console.log("\n\x1b[1m" + t + "\x1b[0m"); }

const wb0 = () => new S.Workbook({ sheets: ["Sheet1"] });
const set = (wb, pairs, sheet = "Sheet1") => {
  Object.entries(pairs).forEach(([a, v]) => wb.setRaw(sheet, a, String(v)));
};

/* ---------------------------------------------------------------- arithmetic */
group("Formula calculation");
{
  const wb = wb0();
  set(wb, { A1: 10, A2: 4 });
  set(wb, { B1: "=A1+A2", B2: "=A1-A2", B3: "=A1*A2", B4: "=A1/A2", B5: "=A1/0" });
  eq("addition", wb.value("Sheet1", "B1"), 14);
  eq("subtraction", wb.value("Sheet1", "B2"), 6);
  eq("multiplication", wb.value("Sheet1", "B3"), 40);
  eq("division", wb.value("Sheet1", "B4"), 2.5);
  eq("divide by zero", wb.value("Sheet1", "B5").err, "#DIV/0!");

  set(wb, { C1: "=2+3*4", C2: "=(2+3)*4", C3: "=2^3^2", C4: "=-3^2", C5: "=10%", C6: "=100*5%" });
  eq("precedence", wb.value("Sheet1", "C1"), 14);
  eq("parentheses", wb.value("Sheet1", "C2"), 20);
  eq("power is right-associative", wb.value("Sheet1", "C3"), 512);
  // Excel is the odd one out here: =-3^2 is 9, not -9. Unary minus binds
  // TIGHTER than ^, unlike almost every programming language. Matching Excel
  // matters more than matching intuition — a learner's formula must behave the
  // same in both places.
  eq("unary minus binds tighter than ^, as in Excel", wb.value("Sheet1", "C4"), 9);
  eq("percent literal", wb.value("Sheet1", "C5"), 0.1);
  eq("percent operator", wb.value("Sheet1", "C6"), 5);

  set(wb, { D1: '="Gross "&"margin"', D2: "=1=1", D3: "=2<>2", D4: "=3>=4" });
  eq("concatenation", wb.value("Sheet1", "D1"), "Gross margin");
  eq("equality", wb.value("Sheet1", "D2"), true);
  eq("inequality", wb.value("Sheet1", "D3"), false);
  eq("comparison", wb.value("Sheet1", "D4"), false);
}

/* --------------------------------------------------------------- references */
group("References: relative, absolute, mixed");
{
  eq("relative shifts both axes", S.translateFormula("=A1", 1, 1), "=B2");
  eq("absolute never moves", S.translateFormula("=$A$1", 3, 5), "=$A$1");
  eq("column-anchored: row moves", S.translateFormula("=$A1", 3, 5), "=$A6");
  eq("row-anchored: column moves", S.translateFormula("=A$1", 3, 5), "=D$1");
  eq("mixed inside an expression", S.translateFormula("=B5*(1+$B$2)", 1, 0), "=C5*(1+$B$2)");
  eq("ranges translate end to end", S.translateFormula("=SUM(B2:B10)", 2, 0), "=SUM(D2:D10)");
  eq("off-sheet becomes #REF!", S.translateFormula("=A1", -5, 0), "=#REF!");
  eq("string literals are untouched", S.translateFormula('=IF(A1>0,"A1 is fine","no")', 1, 0),
     '=IF(B1>0,"A1 is fine","no")');
  eq("function names are untouched", S.translateFormula("=SUM(A1:A3)", 1, 0), "=SUM(B1:B3)");
  eq("brief §9 example", S.translateFormula("=B2*(1+B3)", 1, 0), "=C2*(1+C3)");
  eq("brief §9 absolute example", S.translateFormula("=$B$2*C5", 1, 0), "=$B$2*D5");
}

/* -------------------------------------------------------------- copy & fill */
group("Copying formulas and the fill handle");
{
  const wb = wb0();
  set(wb, { B2: 100, B3: 0.1, B5: "=B2*(1+B3)" });
  set(wb, { C2: 200, C3: 0.2 });
  const clip = wb.copyRange("Sheet1", "B5");
  wb.pasteRange("Sheet1", "C5", clip);
  eq("pasted formula translated", wb.raw("Sheet1", "C5"), "=C2*(1+C3)");
  eq("pasted formula evaluates", wb.value("Sheet1", "C5"), 240);

  const wb2 = wb0();
  set(wb2, { A1: 10, A2: 20, A3: 30, B1: "=A1*2" });
  wb2.fill("Sheet1", "B1", "B1:B3");
  eq("fill down translates rows", wb2.raw("Sheet1", "B3"), "=A3*2");
  eq("fill down evaluates", wb2.value("Sheet1", "B3"), 60);

  const wb3 = wb0();
  set(wb3, { A1: 2026, A2: 2027 });
  wb3.fill("Sheet1", "A1:A2", "A1:A5");
  eq("numeric series continues", wb3.value("Sheet1", "A5"), 2030);

  const wb4 = wb0();
  set(wb4, { B1: 100, B2: "=B1", C1: 5 });
  wb4.fill("Sheet1", "B2", "B2:D2");
  eq("fill right translates columns", wb4.raw("Sheet1", "D2"), "=D1");

  const wb5 = wb0();
  set(wb5, { A1: 1, B1: 2, A2: "=A1", B2: "=B1" });
  wb5.fill("Sheet1", "A2:B2", "A2:B4");
  eq("2-D fill keeps the pattern", wb5.raw("Sheet1", "B4"), "=B3");
}

/* ------------------------------------------------------------- paste values */
group("Paste values, paste TSV");
{
  const wb = wb0();
  set(wb, { A1: 10, A2: "=A1*3" });
  const clip = wb.copyRange("Sheet1", "A2");
  wb.pasteRange("Sheet1", "C2", clip, "values");
  eq("paste values drops the formula", wb.raw("Sheet1", "C2"), "30");
  ok("paste values is not a formula", wb.raw("Sheet1", "C2").charAt(0) !== "=");

  const wb2 = wb0();
  wb2.pasteTSV("Sheet1", "A1", "Revenue\t100\t120\t140\nCosts\t60\t70\t80");
  eq("TSV label lands", wb2.value("Sheet1", "A1"), "Revenue");
  eq("TSV number lands", wb2.value("Sheet1", "D1"), 140);
  eq("TSV second row lands", wb2.value("Sheet1", "B2"), 60);
}

/* --------------------------------------------------------------- multi-sheet */
group("Cross-sheet references");
{
  const wb = new S.Workbook({ sheets: ["Assumptions", "Income Statement"] });
  wb.setRaw("Assumptions", "B4", "0.15");
  wb.setRaw("Income Statement", "B15", "1000");
  wb.setRaw("Income Statement", "B16", "='Assumptions'!B4*B15");
  eq("quoted sheet name", wb.value("Income Statement", "B16"), 150);

  wb.setRaw("Assumptions", "C1", "='Income Statement'!B15");
  eq("reference back", wb.value("Assumptions", "C1"), 1000);

  wb.setRaw("Assumptions", "C2", "='Income Statement'!$B$15*2");
  eq("absolute cross-sheet", wb.value("Assumptions", "C2"), 2000);

  wb.setRaw("Assumptions", "B4", "0.25");
  eq("cross-sheet recalc", wb.value("Income Statement", "B16"), 250);

  wb.renameSheet("Assumptions", "Drivers");
  eq("rename rewrites formulas", wb.raw("Income Statement", "B16"), "='Drivers'!B4*B15");
  eq("renamed sheet still evaluates", wb.value("Income Statement", "B16"), 250);

  const wb2 = new S.Workbook({ sheets: ["Data", "Model"] });
  wb2.setRaw("Data", "A1", "42");
  wb2.setRaw("Model", "A1", "=Data!A1+1");
  eq("unquoted sheet name", wb2.value("Model", "A1"), 43);
}

/* ------------------------------------------------------- circular references */
group("Circular references and errors");
{
  const wb = wb0();
  set(wb, { A1: "=A2", A2: "=A1" });
  eq("two-cell cycle", wb.value("Sheet1", "A1").err, "#CIRC!");

  set(wb, { B1: "=B1+1" });
  eq("self reference", wb.value("Sheet1", "B1").err, "#CIRC!");

  set(wb, { C1: "=C2", C2: "=C3", C3: "=C1" });
  eq("three-cell cycle", wb.value("Sheet1", "C1").err, "#CIRC!");

  // breaking the cycle must recover — nothing may be permanently poisoned
  wb.setRaw("Sheet1", "A2", "5");
  eq("cycle recovers once broken", wb.value("Sheet1", "A1"), 5);

  set(wb, { D1: "=NOSUCHFN(1)", D2: '="text"*2', D3: "=SUM(A1:A3)" });
  eq("unknown function", wb.value("Sheet1", "D1").err, "#NAME?");
  eq("text arithmetic", wb.value("Sheet1", "D2").err, "#VALUE!");
  ok("errors do not throw", typeof wb.value("Sheet1", "D3") === "number");

  set(wb, { E1: "=1/0", E2: "=E1+1", E3: "=IFERROR(E1,0)" });
  eq("errors propagate", wb.value("Sheet1", "E2").err, "#DIV/0!");
  eq("IFERROR catches", wb.value("Sheet1", "E3"), 0);
}

/* ------------------------------------------------------------ dependency graph */
group("Dependency graph and recalculation");
{
  const wb = wb0();
  set(wb, {
    B1: 100, B2: 0.1,
    C1: "=B1*(1+B2)", D1: "=C1*0.4", E1: "=D1-10", F1: "=E1*(1-0.25)"
  });
  eq("chain computes", wb.value("Sheet1", "F1"), (100 * 1.1 * 0.4 - 10) * 0.75);
  wb.setRaw("Sheet1", "B2", "0.2");
  eq("whole chain recalculates", wb.value("Sheet1", "F1"), (100 * 1.2 * 0.4 - 10) * 0.75);
  eq("brief §22: 10%→15%", (() => { wb.setRaw("Sheet1", "B2", "0.15"); return wb.value("Sheet1", "C1"); })(), 115);

  const deps = wb.dependents("Sheet1", "B2");
  ok("dependents are tracked", deps.includes("Sheet1!C1"), JSON.stringify(deps));
  const prec = wb.precedents("Sheet1", "C1");
  ok("precedents are traceable", prec.includes("Sheet1!B1") && prec.includes("Sheet1!B2"), JSON.stringify(prec));

  const wb2 = wb0();
  set(wb2, { A1: 1, A2: 2, A3: 3, B1: "=SUM(A1:A3)" });
  eq("range sums", wb2.value("Sheet1", "B1"), 6);
  wb2.setRaw("Sheet1", "A2", "20");
  eq("range member change invalidates", wb2.value("Sheet1", "B1"), 24);
}

/* ------------------------------------------------------------------ functions */
group("Function library");
{
  const wb = wb0();
  set(wb, { A1: 10, A2: 20, A3: 30, A4: 40, B1: "Rent", B2: "Salary", B3: "Rent", B4: "Utilities" });
  const v = (f) => { wb.setRaw("Sheet1", "Z1", f); return wb.value("Sheet1", "Z1"); };

  eq("SUM", v("=SUM(A1:A4)"), 100);
  eq("AVERAGE", v("=AVERAGE(A1:A4)"), 25);
  eq("MIN", v("=MIN(A1:A4)"), 10);
  eq("MAX", v("=MAX(A1:A4)"), 40);
  eq("COUNT", v("=COUNT(A1:A4)"), 4);
  eq("COUNTA", v("=COUNTA(B1:B4)"), 4);
  eq("IF true", v("=IF(A1>5,A1*2,0)"), 20);
  eq("IF false", v("=IF(A1>500,1,0)"), 0);
  eq("IF with percent (brief §7)", v("=IF(A4>30,A4*10%,0)"), 4);
  eq("IFS", v("=IFS(A1>100,1,A1>5,2,TRUE,3)"), 2);
  eq("AND", v("=AND(A1>5,A2>5)"), true);
  eq("OR", v("=OR(A1>500,A2>5)"), true);
  eq("NOT", v("=NOT(A1>500)"), true);
  eq("ABS", v("=ABS(0-7)"), 7);
  eq("ROUND", v("=ROUND(2.345,2)"), 2.35);
  eq("ROUNDUP", v("=ROUNDUP(2.001,2)"), 2.01);
  eq("ROUNDDOWN", v("=ROUNDDOWN(2.999,2)"), 2.99);
  eq("MOD", v("=MOD(7,3)"), 1);
  eq("SUMIF", v('=SUMIF(B1:B4,"Rent",A1:A4)'), 40);
  eq("SUMIF with operator", v('=SUMIF(A1:A4,">15")'), 90);
  eq("SUMIFS", v('=SUMIFS(A1:A4,B1:B4,"Rent")'), 40);
  eq("COUNTIF", v('=COUNTIF(B1:B4,"Rent")'), 2);
  eq("COUNTIFS", v('=COUNTIFS(B1:B4,"Rent",A1:A4,">15")'), 1);
  eq("AVERAGEIF", v('=AVERAGEIF(B1:B4,"Rent",A1:A4)'), 20);
  eq("INDEX", v("=INDEX(A1:A4,3)"), 30);
  eq("MATCH exact", v('=MATCH("Rent",B1:B4,0)'), 1);
  eq("INDEX+MATCH", v('=INDEX(A1:A4,MATCH("Utilities",B1:B4,0))'), 40);
  eq("XLOOKUP", v('=XLOOKUP("Salary",B1:B4,A1:A4)'), 20);
  eq("XLOOKUP fallback", v('=XLOOKUP("Nope",B1:B4,A1:A4,0)'), 0);
  eq("LEN", v('=LEN("EBITDA")'), 6);
  eq("LEFT", v('=LEFT("EBITDA",2)'), "EB");
  eq("RIGHT", v('=RIGHT("EBITDA",2)'), "DA");
  eq("CONCAT", v('=CONCAT("FY","26")'), "FY26");
  eq("TRIM", v('=TRIM("  a   b ")'), "a b");

  // finance
  eq("NPV", v("=NPV(0.1,100,100,100)"), 100 / 1.1 + 100 / 1.21 + 100 / 1.331);
  set(wb, { F1: -1000, F2: 400, F3: 400, F4: 400 });
  const irr = v("=IRR(F1:F4)");
  eq("IRR", irr, 0.09701, 0.0001);            // verified: NPV at 9.701% ≈ 0
  eq("PMT", v("=PMT(0.1/12,360,-1000000)"), 8775.7157, 0.01);
  eq("PV", v("=PV(0.1,3,0,-1331)"), 1000, 0.01);
  eq("FV", v("=FV(0.1,3,0,-1000)"), 1331, 0.01);

  set(wb, { G1: "=DATE(2025,3,31)", G2: "=DATE(2026,3,31)", G3: "=DATE(2027,3,31)" });
  eq("YEAR", v("=YEAR(G1)"), 2025);
  eq("MONTH", v("=MONTH(G1)"), 3);
  eq("DAY", v("=DAY(G1)"), 31);
  eq("EOMONTH", v("=DAY(EOMONTH(DATE(2025,2,10),0))"), 28);
  eq("EDATE", v("=MONTH(EDATE(DATE(2025,1,31),1))"), 2);
  set(wb, { H1: -1000, H2: 500, H3: 700 });
  // -1000 + 500/1.1 + 700/1.1^2, the dates being exactly one and two years out
  eq("XNPV", v("=XNPV(0.1,H1:H3,G1:G3)"), 33.0578, 0.001);
  const xirr = v("=XIRR(H1:H3,G1:G3)");
  // closed form: 1000x² − 500x − 700 = 0 where x = 1+r  →  r = 0.123212
  eq("XIRR solves", xirr, 0.123212, 0.0001);
}

/* ------------------------------------------------------------------ formats */
group("Number formats");
{
  const f = S.formatValue;
  eq("plain grouping (en-IN)", f(1250000, { type: "number" }), "12,50,000");
  eq("currency", f(1234, { type: "currency", currency: "inr" }), "₹1,234");
  eq("dollar", f(1234, { type: "currency", currency: "usd" }), "$1,234");
  eq("euro", f(1234, { type: "currency", currency: "eur" }), "€1,234");
  eq("percent", f(0.125, { type: "pct" }), "12.5%");
  eq("multiple", f(8.42, { type: "x" }), "8.4x");
  eq("decimals", f(1234.5, { type: "number", dp: 2 }), "1,234.50");
  eq("negative in parentheses (brief §13)", f(-1250000, { type: "number" }), "(12,50,000)");
  eq("negative with a minus when asked", f(-1250, { type: "number", parens: false }), "-1,250");
  eq("zero as a dash", f(0, { type: "number", dashZero: true }), "—");
  eq("errors show as errors", f(S.err("#DIV/0!"), {}), "#DIV/0!");
  ok("underlying value is untouched", (() => {
    const wb = wb0();
    wb.setRaw("Sheet1", "A1", "-1250000");
    wb.setFormat("Sheet1", "A1", { type: "number" });
    return wb.value("Sheet1", "A1") === -1250000 && wb.display("Sheet1", "A1") === "(12,50,000)";
  })());
}

/* -------------------------------------------------------------- undo / redo */
group("Undo and redo");
{
  const wb = wb0();
  wb.setRaw("Sheet1", "A1", "1");
  wb.setRaw("Sheet1", "A1", "2");
  wb.setRaw("Sheet1", "A1", "3");
  wb.undo();
  eq("undo one edit", wb.value("Sheet1", "A1"), 2);
  wb.undo();
  eq("undo again", wb.value("Sheet1", "A1"), 1);
  wb.redo();
  eq("redo", wb.value("Sheet1", "A1"), 2);

  const wb2 = wb0();
  set(wb2, { A1: 1, A2: 2, A3: 3, B1: "=A1*2" });
  wb2.fill("Sheet1", "B1", "B1:B3");
  eq("fill wrote B3", wb2.value("Sheet1", "B3"), 6);
  wb2.undo();
  eq("one undo reverses the whole fill", wb2.raw("Sheet1", "B3"), "");
  ok("and leaves the source alone", wb2.raw("Sheet1", "B1") === "=A1*2");
  wb2.redo();
  eq("redo restores the fill", wb2.value("Sheet1", "B3"), 6);

  const wb3 = wb0();
  wb3.setRaw("Sheet1", "A1", "5");
  wb3.setRaw("Sheet1", "B1", "=A1*2");
  wb3.setRaw("Sheet1", "A1", "10");
  eq("dependent updated", wb3.value("Sheet1", "B1"), 20);
  wb3.undo();
  eq("undo recalculates dependents too", wb3.value("Sheet1", "B1"), 10);
}

/* --------------------------------------------------- rows and columns */
group("Insert and delete rows and columns");
{
  const wb = wb0();
  set(wb, { A1: 1, A2: 2, A3: 3, B1: "=SUM(A1:A3)", C1: "=A3*2" });
  wb.insertRows("Sheet1", 2, 1);
  eq("cells below move down", wb.value("Sheet1", "A4"), 3);
  eq("range grows to cover the insert", wb.raw("Sheet1", "B1"), "=SUM(A1:A4)");
  eq("single ref follows the row", wb.raw("Sheet1", "C1"), "=A4*2");
  eq("sum still correct", wb.value("Sheet1", "B1"), 6);

  const wb2 = wb0();
  set(wb2, { A1: 1, B1: 2, C1: "=A1+B1" });
  wb2.insertCols("Sheet1", 2, 1);
  eq("cells shift right", wb2.value("Sheet1", "C1"), 2);
  eq("column refs follow", wb2.raw("Sheet1", "D1"), "=A1+C1");

  const wb3 = wb0();
  set(wb3, { A1: 1, A2: 2, A3: 3, B1: "=A2" });
  wb3.deleteRows("Sheet1", 2, 1);
  eq("deleting the referent gives #REF!", wb3.raw("Sheet1", "B1"), "=#REF!");
  ok("and does not crash", S.isErr(wb3.value("Sheet1", "B1")) || wb3.value("Sheet1", "B1") !== undefined);
}

/* --------------------------------------------------------------- persistence */
group("Serialisation");
{
  const wb = new S.Workbook({ sheets: ["Assumptions", "Model"] });
  wb.setRaw("Assumptions", "B2", "0.15");
  wb.setRaw("Model", "B2", "100");
  wb.setRaw("Model", "C2", "=B2*(1+'Assumptions'!$B$2)");
  wb.setFormat("Model", "C2", { type: "currency", currency: "inr" });
  wb.setNote("Assumptions", "B2", "Management guidance");

  const round = S.Workbook.fromJSON(JSON.parse(JSON.stringify(wb.toJSON())));
  eq("formula survives a round trip", round.raw("Model", "C2"), "=B2*(1+'Assumptions'!$B$2)");
  eq("value recomputes after reload", round.value("Model", "C2"), 115);
  eq("format survives", round.display("Model", "C2"), "₹115");
  eq("note survives", round.cell("Assumptions", "B2").note, "Management guidance");
  ok("CSV exports display values", round.toCSV("Model").includes("₹115"));
}

/* -------------------------------------------------------------- autocomplete */
group("Autocomplete");
{
  const su = (p) => S.suggest(p).map((x) => x.name);
  ok("=SU suggests SUM", su("=SU").includes("SUM"), JSON.stringify(su("=SU")));
  ok("=SU suggests SUMIF too", su("=SU").includes("SUMIF"));
  ok("=IF suggests IF", su("=IF").includes("IF"));
  ok("=XIRR suggests XIRR", su("XIRR").includes("XIRR"));
  ok("suggestions carry syntax help", (S.suggest("SUM")[0].help || "").includes("SUM("));
}

/* ============================================================================
   §48 — the definition-of-done workflow, start to finish
   ========================================================================= */
group("§48 end-to-end: build a 5-year model, then change an assumption");
{
  const wb = new S.Workbook({ sheets: ["Assumptions", "Model"] });

  // 1–3. historicals and assumptions
  wb.setRaw("Assumptions", "A1", "Revenue growth");
  wb.setRaw("Assumptions", "B1", "0.15");
  wb.setRaw("Assumptions", "A2", "Gross margin");
  wb.setRaw("Assumptions", "B2", "0.65");
  wb.setRaw("Assumptions", "A3", "Tax rate");
  wb.setRaw("Assumptions", "B3", "0.25");
  wb.setRaw("Assumptions", "A4", "WACC");
  wb.setRaw("Assumptions", "B4", "0.12");

  wb.setRaw("Model", "B4", "2024");
  wb.setRaw("Model", "B5", "2400000");          // FY24 actual revenue

  // 4–7. the learner writes one formula and fills it across five years
  wb.setRaw("Model", "C4", "=B4+1");
  wb.fill("Model", "C4", "C4:G4");
  wb.setRaw("Model", "C5", "=B5*(1+'Assumptions'!$B$1)");
  wb.fill("Model", "C5", "C5:G5");

  eq("year header fills", wb.value("Model", "G4"), 2029);
  eq("fill translated the growth formula", wb.raw("Model", "G5"), "=F5*(1+'Assumptions'!$B$1)");
  eq("the anchor held across all five columns",
     wb.raw("Model", "G5").includes("$B$1"), true);
  eq("FY25 revenue", wb.value("Model", "C5"), 2400000 * 1.15);
  eq("FY29 revenue", wb.value("Model", "G5"), 2400000 * Math.pow(1.15, 5), 1);

  // 8–10. P&L down to free cash flow
  wb.setRaw("Model", "C6", "=C5*'Assumptions'!$B$2");     // gross profit
  wb.setRaw("Model", "C7", "=C6*0.55");                    // EBITDA
  wb.setRaw("Model", "C8", "=C7*0.08");                    // D&A
  wb.setRaw("Model", "C9", "=C7-C8");                      // EBIT
  wb.setRaw("Model", "C10", "=C9*(1-'Assumptions'!$B$3)"); // NOPAT
  wb.setRaw("Model", "C11", "=C10+C8-C5*0.03");            // FCF
  ["C6", "C7", "C8", "C9", "C10", "C11"].forEach((a) => {
    wb.fill("Model", a, a[0] + a.slice(1) + ":G" + a.slice(1));
  });
  eq("EBITDA fills across", wb.raw("Model", "G7"), "=G6*0.55");
  ok("FCF computes for every year",
     ["C11", "D11", "E11", "F11", "G11"].every((a) => typeof wb.value("Model", a) === "number"));

  // 11–12. a DCF on top
  wb.setRaw("Model", "B13", "=NPV('Assumptions'!B4,C11:G11)");
  const ev0 = wb.value("Model", "B13");
  ok("enterprise value is a number", typeof ev0 === "number" && ev0 > 0, String(ev0));

  // 13–14. change one assumption; everything downstream moves
  wb.setRaw("Assumptions", "B1", "0.20");
  eq("FY29 revenue follows the new growth", wb.value("Model", "G5"), 2400000 * Math.pow(1.2, 5), 1);
  const ev1 = wb.value("Model", "B13");
  ok("valuation recalculated", ev1 > ev0, `${ev0} → ${ev1}`);

  // 15. inspect
  const prec = wb.precedents("Model", "C5");
  ok("precedents cross the sheet boundary", prec.includes("Assumptions!B1"), JSON.stringify(prec));

  // 16. fix an error
  wb.setRaw("Model", "C6", "=C5*'Assumptions'!$B$99");
  ok("a broken reference is visible", wb.value("Model", "C6") === 0 || S.isErr(wb.value("Model", "C6")));
  wb.setRaw("Model", "C6", "=C5*'Assumptions'!$B$2");
  eq("and is fixable", wb.value("Model", "C6"), wb.value("Model", "C5") * 0.65, 1);

  // 17. undo/redo across the whole session
  ok("history is deep", wb.canUndo());

  // 18–20. format, save, reload, continue
  wb.setFormat("Model", "B13", { type: "currency", currency: "inr", dashZero: true });
  const saved = JSON.stringify(wb.toJSON());
  const reopened = S.Workbook.fromJSON(JSON.parse(saved));
  eq("reopened workbook holds the same valuation", reopened.value("Model", "B13"), ev1, 1);
  eq("reopened workbook holds the formula", reopened.raw("Model", "G5"),
     "=F5*(1+'Assumptions'!$B$1)");
  reopened.setRaw("Assumptions", "B1", "0.10");
  ok("and still recalculates after reload", reopened.value("Model", "B13") < ev1);
}

/* ============================================================================
   §32 — grading the model, not the number
   ========================================================================= */
group("§32 grader: formulas, not just outputs");
{
  const wb = new S.Workbook({ sheets: ["Model"] });
  wb.setRaw("Model", "B10", "100");
  wb.setRaw("Model", "C9", "0.25");

  wb.setRaw("Model", "C10", "125");
  let r = wb.check({ cell: "C10", sheet: "Model", expect: 125, mustFormula: true });
  ok("a hardcoded right answer fails", !r.ok, JSON.stringify(r));
  ok("and the learner is told why", /formula/i.test(r.why));

  wb.setRaw("Model", "C10", "=B10*(1+C9)");
  r = wb.check({ cell: "C10", sheet: "Model", expect: 125, mustFormula: true });
  ok("the formula passes", r.ok, JSON.stringify(r));

  wb.setRaw("Model", "C10", "=B10*1.25");
  r = wb.check({ cell: "C10", sheet: "Model", expect: 125, mustFormula: true, mustReference: ["C9"] });
  ok("a formula that ignores the assumption fails", !r.ok);
  ok("and names the cell it should read", r.why.includes("C9"), r.why);

  wb.setRaw("Model", "C11", "=B10+C10");
  r = wb.check({ cell: "C11", sheet: "Model", mustUse: ["SUM"] });
  ok("mustUse enforces a function", !r.ok);

  wb.setRaw("Model", "C12", "=1/0");
  r = wb.check({ cell: "C12", sheet: "Model", expect: 1 });
  ok("an erroring cell fails with its error", !r.ok && r.why.includes("#DIV/0!"), r.why);

  const checks = wb.modelChecks([{ label: "Balance sheet ties", a: "B10", b: "B10", sheet: "Model" }]);
  ok("model check reports a tie", checks[0].ok && checks[0].diff === 0);
}

/* ------------------------------------------------------------------ scale */
group("Performance");
{
  const wb = wb0();
  const t0 = Date.now();
  wb.begin();
  for (let r = 1; r <= 2000; r++) {
    wb.setRaw("Sheet1", "A" + r, String(r));
    wb.setRaw("Sheet1", "B" + r, "=A" + r + "*2");
    wb.setRaw("Sheet1", "C" + r, "=B" + r + "+A" + r);
  }
  wb.commit();
  let sum = 0;
  for (let r = 1; r <= 2000; r++) sum += wb.value("Sheet1", "C" + r);
  const build = Date.now() - t0;
  eq("6,000 cells compute correctly", sum, 3 * (2000 * 2001) / 2);
  ok("6,000 cells build+evaluate under 2s", build < 2000, build + "ms");

  const t1 = Date.now();
  wb.setRaw("Sheet1", "A1", "999");
  const v = wb.value("Sheet1", "C1");
  const edit = Date.now() - t1;
  eq("edit propagates", v, 999 * 3);
  ok("one edit recalculates in under 20ms", edit < 20, edit + "ms");
}

/* ------------------------------------------------------------------ report */
console.log("\n" + "─".repeat(58));
if (fail === 0) {
  console.log(`\x1b[32mAll ${pass} assertions passed.\x1b[0m`);
} else {
  console.log(`\x1b[31m${fail} of ${pass + fail} assertions FAILED.\x1b[0m`);
  fails.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
