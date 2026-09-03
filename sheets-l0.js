/* Live spreadsheets for the concept lessons.
   Every sheet uses the existing café engine (LS.Sheet) and the canonical
   Bombay Bean Coffee Co. figures in LS.C, so the whole curriculum follows one
   business as the homepage promises. The learner types the formula; the
   checker verifies both the value and that a formula was actually used.

   Schema (identical to the café lessons):
     { id, title, hint, grid: [[label, valueOrCell], ...], checks: [...] }
     cell = { input:true, mf:true, fmt:"inr"|"pct"|"num", ph:"=B2+B3" }

   Batch 1: Level 0. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  function yr(label) { return ["", { v: label, year: true }]; }
  function inp(ph, fmt) { return { input: true, mf: true, fmt: fmt || "inr", ph: ph }; }
  function chk(cell, expect, message, mustUse) {
    var c = { cell: cell, expect: expect, message: message, mustFormula: true };
    if (mustUse) { c.mustUse = mustUse; c.mustUseLabel = "the " + mustUse + " function"; }
    return c;
  }

  LS.lessonSheets = {

    /* ---------------- Finance basics ---------------- */

    "c-what-is-finance": {
      id: "s-what-is-finance",
      title: "The café's first loan, FY24",
      hint: "Bombay Bean borrowed ₹6,00,000 at 10%. Compute the annual interest (B4) and what is owed after one year (B5).",
      grid: [
        yr("FY24"),
        ["Loan taken", 600000],
        ["Interest rate", { v: 0.1, fmt: "pct" }],
        ["Interest for the year", inp("=B2*B3")],
        ["Owed after one year", inp("=B2+B4")],
      ],
      checks: [
        chk("B4", 60000, "B4: interest = loan × rate"),
        chk("B5", 660000, "B5: principal plus one year of interest"),
      ],
    },

    "c-personal-corporate-investing": {
      id: "s-personal-corporate",
      title: "Repay the loan, or invest the cash?",
      hint: "Priya has ₹5,00,000 spare. Compare the interest saved by repaying (B4) with the return from investing (B6), then the difference (B7).",
      grid: [
        yr("Choice"),
        ["Cash available", 500000],
        ["Loan rate saved by repaying", { v: 0.1, fmt: "pct" }],
        ["Interest saved in a year", inp("=B2*B3")],
        ["Expected return if invested", { v: 0.08, fmt: "pct" }],
        ["Investment gain in a year", inp("=B2*B5")],
        ["Advantage of repaying", inp("=B4-B6")],
      ],
      checks: [
        chk("B4", 50000, "B4: interest saved"),
        chk("B6", 40000, "B6: expected investment gain"),
        chk("B7", 10000, "B7: repaying wins by this much — and it is certain"),
      ],
    },

    "c-financial-markets": {
      id: "s-financial-markets",
      title: "Primary versus secondary money",
      hint: "The café issues new shares for ₹4,00,000; later an investor sells ₹1,50,000 of existing shares. Compute what actually reaches the company (B4).",
      grid: [
        yr("Amount"),
        ["New shares issued by the café (primary)", 400000],
        ["Existing shares traded between investors (secondary)", 150000],
        ["Total money changing hands", inp("=B2+B3")],
        ["Cash the café actually receives", inp("=B2")],
      ],
      checks: [
        chk("B4", 550000, "B4: total transacted"),
        chk("B5", 400000, "B5: only the primary issue funds the business"),
      ],
    },

    "c-companies-and-capital": {
      id: "s-companies-capital",
      title: "Who funded Bombay Bean, FY25",
      hint: "Owners put in capital and kept profits; the bank lent the rest. Total the funding (B5) and check it equals total assets (B7).",
      grid: [
        yr("FY25"),
        ["Share capital (owner)", 1000000],
        ["Retained earnings (profits kept)", 250000],
        ["Bank loan", 550000],
        ["Payables and accruals", 150000],
        ["Total funding", inp("=SUM(B2:B5)", "inr")],
        ["Total assets", 1950000],
        ["Difference (must be zero)", inp("=B6-B7")],
      ],
      checks: [
        chk("B6", 1950000, "B6: total funding via SUM", "SUM"),
        chk("B8", 0, "B8: funding equals assets — the balance sheet ties"),
      ],
    },

    "c-revenue": {
      id: "s-revenue",
      title: "Revenue is price × cups, FY25",
      hint: "The café sold 20,000 cups at ₹120. Compute revenue (B4) and next year's revenue at 15% growth (B6).",
      grid: [
        yr("FY25"),
        ["Cups sold", { v: 20000, fmt: "num" }],
        ["Average price per cup", 120],
        ["Revenue", inp("=B2*B3")],
        ["Growth assumed for FY26", { v: 0.15, fmt: "pct" }],
        ["FY26 revenue", inp("=B4*(1+B5)")],
      ],
      checks: [
        chk("B4", 2400000, "B4: revenue = cups × price"),
        chk("B6", 2760000, "B6: FY26 revenue after 15% growth"),
      ],
    },

    "c-costs": {
      id: "s-costs",
      title: "Fixed and variable costs, FY25",
      hint: "Coffee and milk move with cups sold; rent and salaries do not. Total each group (B4, B8) and the lot (B9).",
      grid: [
        yr("FY25"),
        ["Cost of goods sold (variable)", 840000],
        ["Rent (fixed)", 360000],
        ["Salaries & wages (fixed)", 540000],
        ["Total fixed so far", inp("=B3+B4")],
        ["Utilities", 80000],
        ["Marketing", 40000],
        ["Other operating costs", inp("=B6+B7")],
        ["Total operating expenses", inp("=B5+B8")],
        ["Total costs including COGS", inp("=B2+B9")],
      ],
      checks: [
        chk("B5", 900000, "B5: rent plus salaries"),
        chk("B8", 120000, "B8: utilities plus marketing"),
        chk("B9", 1020000, "B9: total operating expenses"),
        chk("B10", 1860000, "B10: every cost the café incurred"),
      ],
    },

    "c-profit": {
      id: "s-profit",
      title: "Revenue down to profit, FY25",
      hint: "Four formulas: gross profit (B4), EBITDA (B6), profit before tax (B9) and profit after tax (B11).",
      grid: [
        yr("FY25"),
        ["Revenue", 2400000],
        ["Cost of goods sold", -840000],
        ["Gross profit", inp("=B2+B3")],
        ["Operating expenses", -1020000],
        ["EBITDA", inp("=B4+B5")],
        ["Depreciation", -240000],
        ["EBIT", inp("=B6+B7")],
        ["Interest", -60000],
        ["Profit before tax", inp("=B8+B9")],
        ["Tax at 25%", -60000],
        ["Profit after tax", inp("=B10+B11")],
      ],
      checks: [
        chk("B4", 1560000, "B4: gross profit"),
        chk("B6", 540000, "B6: EBITDA"),
        chk("B8", 300000, "B8: EBIT after depreciation"),
        chk("B10", 240000, "B10: profit before tax"),
        chk("B12", 180000, "B12: profit after tax"),
      ],
    },

    "c-cash": {
      id: "s-cash",
      title: "Profit is not cash, FY25",
      hint: "Start from profit, add back depreciation, then adjust for the balance sheet movements. Compute cash from operations (B8).",
      grid: [
        yr("FY25"),
        ["Profit after tax", 180000],
        ["Add: depreciation (no cash left)", 240000],
        ["Less: increase in receivables", -40000],
        ["Less: increase in inventory", -30000],
        ["Add: increase in payables", 20000],
        ["Add: increase in accruals", 10000],
        ["Cash from operations", inp("=SUM(B2:B7)", "inr")],
        ["Profit for comparison", 180000],
        ["Cash more than profit by", inp("=B8-B9")],
      ],
      checks: [
        chk("B8", 380000, "B8: cash from operations via SUM", "SUM"),
        chk("B10", 200000, "B10: cash exceeded profit, mostly because of depreciation"),
      ],
    },

    "c-assets": {
      id: "s-assets",
      title: "What the café owns, FY25",
      hint: "Add the current assets (B6), then everything (B8). Note how little of it is actually cash.",
      grid: [
        yr("FY25"),
        ["Cash at bank", 100000],
        ["Receivables (corporate clients)", 200000],
        ["Inventory (beans, milk, cups)", 150000],
        ["Lease deposit", 100000],
        ["Total current assets", inp("=SUM(B2:B5)", "inr")],
        ["Equipment and fit-out, net of depreciation", 1400000],
        ["Total assets", inp("=B6+B7")],
        ["Cash as a share of assets", inp("=B2/B8", "pct")],
      ],
      checks: [
        chk("B6", 550000, "B6: current assets via SUM", "SUM"),
        chk("B8", 1950000, "B8: total assets"),
        chk("B9", 0.0513, "B9: barely 5% of the assets are spendable cash"),
      ],
    },

    "c-liabilities": {
      id: "s-liabilities",
      title: "What the café owes, FY25",
      hint: "Split the obligations by when they fall due. Total the short-term ones (B4) and everything owed (B6).",
      grid: [
        yr("FY25"),
        ["Payables (coffee roaster)", 120000],
        ["Accrued salaries", 30000],
        ["Total due within a year", inp("=B2+B3")],
        ["Bank loan (long term)", 550000],
        ["Total liabilities", inp("=B4+B5")],
        ["Liabilities as a share of assets", inp("=B6/1950000", "pct")],
      ],
      checks: [
        chk("B4", 150000, "B4: current liabilities"),
        chk("B6", 700000, "B6: everything owed to outsiders"),
        chk("B7", 0.359, "B7: outsiders funded about 36% of the café"),
      ],
    },

    "c-equity": {
      id: "s-equity",
      title: "The owner's residual claim, FY25",
      hint: "Equity is what is left after outsiders are paid. Compute it two ways (B4 and B7) and check they agree (B8).",
      grid: [
        yr("FY25"),
        ["Total assets", 1950000],
        ["Total liabilities", 700000],
        ["Equity = assets − liabilities", inp("=B2-B3")],
        ["", { v: "check", year: true }],
        ["Share capital", 1000000],
        ["Retained earnings", 250000],
        ["Equity = capital + retained", inp("=B6+B7")],
        ["Difference (must be zero)", inp("=B4-B8")],
      ],
      checks: [
        chk("B4", 1250000, "B4: equity as the residual"),
        chk("B8", 1250000, "B8: equity built from its two sources"),
        chk("B9", 0, "B9: both routes give the same answer"),
      ],
    },

    "c-debt": {
      id: "s-debt",
      title: "What the loan costs, FY25",
      hint: "Compute the interest (B4), what is left for the owner (B6), and the return on the owner's own money (B8).",
      grid: [
        yr("FY25"),
        ["Bank loan outstanding", 550000],
        ["Interest rate", { v: 0.1, fmt: "pct" }],
        ["Interest", inp("=B2*B3")],
        ["EBIT (profit before interest)", 300000],
        ["Left for the owner before tax", inp("=B5-B4")],
        ["Owner's equity", 1250000],
        ["Return on owner's money", inp("=B6/B7", "pct")],
      ],
      checks: [
        chk("B4", 55000, "B4: interest owed whatever the year looked like"),
        chk("B6", 245000, "B6: what remains for the owner"),
        chk("B8", 0.196, "B8: return on the owner's capital"),
      ],
    },

    "c-interest": {
      id: "s-interest",
      title: "Simple versus compound, on the café's loan",
      hint: "Same ₹6,00,000 at 10% for three years. Compute the simple total (B5) and the compound total (B6), then the gap (B7).",
      grid: [
        yr("Three years"),
        ["Principal", 600000],
        ["Rate", { v: 0.1, fmt: "pct" }],
        ["Years", { v: 3, fmt: "num" }],
        ["Simple interest total", inp("=B2*B3*B4")],
        ["Owed under simple interest", inp("=B2+B5")],
        ["Owed under annual compounding", inp("=B2*(1+B3)^B4")],
        ["Extra cost of compounding", inp("=B7-B6")],
      ],
      checks: [
        chk("B5", 180000, "B5: simple interest"),
        chk("B6", 780000, "B6: total under simple interest"),
        chk("B7", 798600, "B7: total under compounding"),
        chk("B8", 18600, "B8: compounding cost ₹18,600 more"),
      ],
    },

    "c-risk": {
      id: "s-risk",
      title: "A good year and a bad year",
      hint: "The café's fixed costs do not move. Compute EBITDA in both cases (B5, B8) and the swing (B9).",
      grid: [
        yr("Scenario"),
        ["Revenue — good year (+20%)", 2880000],
        ["Cost of goods at 35% of revenue", inp("=-B2*0.35")],
        ["Operating expenses (fixed)", -1020000],
        ["EBITDA — good year", inp("=B2+B3+B4")],
        ["Revenue — bad year (−20%)", 1920000],
        ["Cost of goods at 35% of revenue", inp("=-B6*0.35")],
        ["EBITDA — bad year", inp("=B6+B7+B4")],
        ["Swing in EBITDA", inp("=B5-B8")],
      ],
      checks: [
        chk("B3", -1008000, "B3: variable cost follows revenue"),
        chk("B5", 852000, "B5: EBITDA in the good year"),
        chk("B8", 228000, "B8: EBITDA in the bad year"),
        chk("B9", 624000, "B9: a 40% revenue swing moved EBITDA by ₹6.24 lakh"),
      ],
    },

    "c-return": {
      id: "s-return",
      title: "The owner's return, FY25",
      hint: "Include both what was paid out and what was retained. Compute total return (B5) and the percentage (B6).",
      grid: [
        yr("FY25"),
        ["Owner's equity at the start", 1120000],
        ["Profit after tax", 180000],
        ["Dividend paid to the owner", 50000],
        ["Profit retained in the business", inp("=B3-B4")],
        ["Total return to the owner", inp("=B4+B5")],
        ["Return on opening equity", inp("=B6/B2", "pct")],
      ],
      checks: [
        chk("B5", 130000, "B5: retained profit"),
        chk("B6", 180000, "B6: the whole profit belongs to the owner, paid or retained"),
        chk("B7", 0.1607, "B7: about 16% on opening equity"),
      ],
    },

    /* ---------------- Time value & decision making ---------------- */

    "c-time-value-of-money": {
      id: "s-tvm",
      title: "Would the café rather have the cash now?",
      hint: "A customer offers ₹1,50,000 in three years instead of ₹1,20,000 today. Discount it at 10% (B4) and compare (B5).",
      grid: [
        yr("Offer"),
        ["Amount offered in three years", 150000],
        ["Discount rate", { v: 0.1, fmt: "pct" }],
        ["Years", { v: 3, fmt: "num" }],
        ["Value today", inp("=B2/(1+B3)^B4")],
        ["Cash offered today instead", 120000],
        ["Take the future amount? (positive = yes)", inp("=B5-B6")],
      ],
      checks: [
        chk("B5", 112697, "B5: present value of ₹1,50,000 in three years"),
        chk("B7", -7303, "B7: negative — the ₹1,20,000 today is worth more"),
      ],
    },

    "c-compounding": {
      id: "s-compounding",
      title: "Retained profit compounding",
      hint: "The café retains ₹1,30,000 and earns 16% on it. Compute the value after 5 years (B5) and 10 years (B6).",
      grid: [
        yr("Retained"),
        ["Amount retained", 130000],
        ["Annual return", { v: 0.16, fmt: "pct" }],
        ["Value after 1 year", inp("=B2*(1+B3)")],
        ["Value after 5 years", inp("=B2*(1+B3)^5")],
        ["Value after 10 years", inp("=B2*(1+B3)^10")],
        ["Gain in the second five years", inp("=B6-B5")],
      ],
      checks: [
        chk("B4", 150800, "B4: after one year"),
        chk("B5", 273042, "B5: after five years"),
        chk("B6", 573471, "B6: after ten years"),
        chk("B7", 300429, "B7: the second five years added more than the first"),
      ],
    },

    "c-inflation": {
      id: "s-inflation",
      title: "The café's cash, eroded",
      hint: "₹1,00,000 sits in the account earning 4% while prices rise 6%. Compute both balances (B4, B5) and the real loss (B6).",
      grid: [
        yr("One year"),
        ["Cash held", 100000],
        ["Interest earned", { v: 0.04, fmt: "pct" }],
        ["Inflation", { v: 0.06, fmt: "pct" }],
        ["Balance after a year", inp("=B2*(1+B3)")],
        ["What last year's basket now costs", inp("=B2*(1+B4)")],
        ["Purchasing power lost", inp("=B5-B6")],
      ],
      checks: [
        chk("B5", 104000, "B5: more rupees"),
        chk("B6", 106000, "B6: but the basket costs more"),
        chk("B7", -2000, "B7: ₹2,000 of purchasing power gone"),
      ],
    },

    "c-present-value": {
      id: "s-present-value",
      title: "Valuing the café's next three years",
      hint: "Discount each year's cash flow at 12%, then total them (B6).",
      grid: [
        yr("Cash flow"),
        ["Year 1 cash flow", 380000],
        ["Year 2 cash flow", 420000],
        ["Year 3 cash flow", 460000],
        ["Present value of year 1", inp("=B2/1.12")],
        ["Present value of year 2", inp("=B3/1.12^2")],
        ["Present value of year 3", inp("=B4/1.12^3")],
        ["Total present value", inp("=SUM(B5:B7)", "inr")],
      ],
      checks: [
        chk("B5", 339286, "B5: year 1 discounted"),
        chk("B6", 334822, "B6: year 2 discounted"),
        chk("B7", 327406, "B7: year 3 discounted"),
        chk("B8", 1001514, "B8: total present value via SUM", "SUM"),
      ],
    },

    "c-future-value": {
      id: "s-future-value",
      title: "Saving for the second café",
      hint: "Priya saves ₹2,00,000 today at 12%. Compute the value after 5 years (B4) and what she still needs for a ₹6,00,000 fit-out (B6).",
      grid: [
        yr("Plan"),
        ["Amount saved today", 200000],
        ["Expected return", { v: 0.12, fmt: "pct" }],
        ["Years", { v: 5, fmt: "num" }],
        ["Value in five years", inp("=B2*(1+B3)^B4")],
        ["Cost of the second café fit-out", 600000],
        ["Shortfall", inp("=B6-B5")],
      ],
      checks: [
        chk("B5", 352468, "B5: future value of the savings"),
        chk("B7", 247532, "B7: still short by this much"),
      ],
    },

    "c-opportunity-cost": {
      id: "s-opportunity-cost",
      title: "The second machine, or the delivery van?",
      hint: "The café can fund only one. Compute each option's annual gain (B3, B5) and the cost of choosing the smaller one (B6).",
      grid: [
        yr("Choice"),
        ["Cost of either option", 240000],
        ["Extra annual profit — second machine", 62000],
        ["Return on the machine", inp("=B3/B2", "pct")],
        ["Extra annual profit — delivery van", 44000],
        ["Return on the van", inp("=B5/B2", "pct")],
        ["Opportunity cost of choosing the van", inp("=B3-B5")],
      ],
      checks: [
        chk("B4", 0.2583, "B4: the machine returns about 26%"),
        chk("B6", 0.1833, "B6: the van returns about 18%"),
        chk("B7", 18000, "B7: choosing the van gives up ₹18,000 a year"),
      ],
    },

    "c-risk-vs-reward": {
      id: "s-risk-vs-reward",
      title: "What return should the café demand?",
      hint: "Start from the safe rate and add compensation for risk. Compute the required return (B4) and whether the plan clears it (B6).",
      grid: [
        yr("Hurdle"),
        ["Government bond rate (safe)", { v: 0.07, fmt: "pct" }],
        ["Extra demanded for café risk", { v: 0.06, fmt: "pct" }],
        ["Required return", inp("=B2+B3", "pct")],
        ["Expected return on the second café", { v: 0.16, fmt: "pct" }],
        ["Margin above the hurdle", inp("=B5-B4", "pct")],
      ],
      checks: [
        chk("B4", 0.13, "B4: 13% required before the risk is worth taking"),
        chk("B6", 0.03, "B6: the plan clears the hurdle by 3 points"),
      ],
    },
  };
})();
