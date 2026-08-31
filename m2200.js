/* Module 2200 — Intro to modeling & valuation */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr, P = LS.fmt.pct;
  var rd = Math.round;
  var y25 = C.fy25, y26 = C.fy26, y27 = C.fy27, y28 = C.fy28, d = C.drivers, dcf = C.dcfBase;

  LS.lessons["2210-drivers"] = {
    id: "2210-drivers", code: "2210", minutes: 5,
    title: "Drivers and assumptions",
    short: "Drivers",
    desc: "Separate assumptions from calculations: growth %, margin %, and DSO/DIO/DPO as input cells that everything else references.",
    lede: "A model is not a forecast typed into a grid. It's a small machine: a handful of assumptions at the top, and every other cell computed from them. Change one input and the whole model responds. Here's how to build that discipline in.",
    body: [
      { t: "def", term: "Driver", h: "An assumption the model is <strong>driven by</strong> — revenue growth, gross margin, days of receivables. Drivers live in their own clearly-marked input cells. Everything else is a formula. If you find yourself typing a number into a calculation, you've just broken your model." },
      { t: "def", term: "DSO, DIO, DPO", h: "Working capital expressed in <strong>days</strong> rather than rupees, so it scales automatically as the business grows. <strong>DSO</strong>: days customers take to pay. <strong>DIO</strong>: days of stock held. <strong>DPO</strong>: days you take to pay suppliers." },
      { t: "formula", title: "Turning balances into days (and back)", lines: [
        "DSO = Receivables ÷ Revenue × 365      → forecast: Receivables = Revenue × DSO ÷ 365",
        "DIO = Inventory   ÷ COGS    × 365      → forecast: Inventory   = COGS × DIO ÷ 365",
        "DPO = Payables    ÷ COGS    × 365      → forecast: Payables    = COGS × DPO ÷ 365"
      ], note: "Compute the days from history, assume they hold, then let revenue growth carry working capital along with it. That's how a projected balance sheet stays realistic instead of frozen." },
      { t: "example", h: "<p>From the café's FY25 statements: receivables " + R(y25.bs.receivables) + " on revenue of " + R(y25.pl.revenue) + " is " + C.ratios.dso.toFixed(1) + " days — consistent with the 30-day catering terms from the “Receivables” lesson. Inventory of " + R(y25.bs.inventory) + " against COGS of " + R(y25.pl.cogs) + " is " + C.ratios.dio.toFixed(1) + " days of stock, and the café takes " + C.ratios.dpo.toFixed(1) + " days to pay its roaster.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Derive the café's working-capital drivers from FY25",
          hint: "Build the three day-counts in B7:B9 from the actuals above. Then prove they work in reverse: B12 forecasts FY26 receivables from FY26 revenue and your DSO — and it should land on " + R(230000) + ".",
          grid: [
            ["FY25 ACTUALS", { v: "FY25", year: true }],
            ["Revenue", y25.pl.revenue],
            ["Cost of goods sold", y25.pl.cogs],
            ["Trade receivables", y25.bs.receivables],
            ["Inventory", y25.bs.inventory],
            ["Trade payables", y25.bs.payables],
            ["DSO (days)", { input: true, mf: true, fmt: "days", ph: "=B4/B2*365" }],
            ["DIO (days)", { input: true, mf: true, fmt: "days", ph: "=B5/B3*365" }],
            ["DPO (days)", { input: true, mf: true, fmt: "days", ph: "=B6/B3*365" }],
            [null, null],
            ["FY26 revenue (15% growth)", { input: true, mf: true, fmt: "inr", ph: "=B2*1.15" }],
            ["FY26 receivables, from DSO", { input: true, mf: true, fmt: "inr", ph: "=B11*B7/365" }]
          ],
          checks: [
            { cell: "B7", expect: 30.42, message: "B7: DSO", mustFormula: true, tol: 0.1 },
            { cell: "B8", expect: 65.18, message: "B8: DIO", mustFormula: true, tol: 0.1 },
            { cell: "B9", expect: 52.14, message: "B9: DPO", mustFormula: true, tol: 0.1 },
            { cell: "B11", expect: 2760000, message: "B11: FY26 revenue grown 15%", mustFormula: true },
            { cell: "B12", expect: 230000, message: "B12: FY26 receivables driven by DSO", mustFormula: true, tol: 100 }
          ],
          success: "Receivables of " + R(230000) + " — produced by a driver, not typed. Now if you change growth to 20%, receivables follow automatically. That's the difference between a model and a table."
        }
      },
      { t: "note", h: "<strong>The cash conversion cycle:</strong> DIO + DSO − DPO = " + (C.ratios.dio + C.ratios.dso - C.ratios.dpo).toFixed(0) + " days for the café. That's how long a rupee is tied up between paying for beans and collecting from customers. Shorter is better; negative (which supermarkets achieve) means suppliers fund your entire working capital." },
      { t: "where", h: "Drivers sit in a clearly-labelled assumptions block at the top of a model. From there they feed the projected <strong>income statement</strong> (growth, margin) and the projected <strong>balance sheet</strong> (the day-counts) — and through both, the projected <strong>cash flow statement</strong>." },
      { t: "mcq", q: "Your model forecasts receivables as a flat ₹2,00,000 for all three years while revenue grows 15% a year. What's wrong?", opts: ["Nothing — receivables are hard to predict", "It implicitly assumes customers pay faster every year, which needs justification", "Receivables should always grow faster than revenue", "It will make the balance sheet fail to tie"], correct: 1, why: ["They're uncertain, but a frozen balance with growing revenue isn't a neutral assumption — it's a strong and probably unintended one.", "Flat receivables on rising revenue means DSO falling from 30 days to 26 to 23 — you've silently assumed the café gets better at collecting every year. That flatters cash flow. Holding the <em>days</em> constant instead keeps the assumption neutral, which is exactly why professionals model working capital in days.", "There's no such rule. Growing in line with revenue (constant DSO) is the neutral default.", "The sheet will still tie — a linked model always ties. It'll just tie around a hidden and unjustified assumption, which is far more dangerous than an obvious error."] }
    ]
  };

  LS.lessons["2220-project-pl"] = {
    id: "2220-project-pl", code: "2220", minutes: 6,
    title: "Projecting the P&L three years",
    short: "Projecting the P&L",
    desc: "Drive a three-year income statement from four assumptions, using copy-right to build FY27 and FY28 from FY26.",
    lede: "Four assumptions produce three years of income statement. Build the first projected column properly and the other two are one button-press each — which is exactly how it works in a real modeling job.",
    body: [
      { t: "formula", title: "The projection logic", lines: [
        "Revenue     = prior year revenue × (1 + growth)",
        "COGS        = revenue × (1 − gross margin)",
        "Opex        = prior year opex × (1 + cost inflation)",
        "Depreciation, interest: from the schedules you already built",
        "Tax         = profit before tax × tax rate"
      ], note: "Notice that every line references either a driver or a prior-year cell. No number is typed twice — a rule worth being fanatical about." },
      { t: "example", h: "<p>The café's assumptions: revenue grows " + P(d.growth) + " a year (a second location's worth of catering), gross margin holds at " + P(d.gm) + ", operating costs inflate " + P(d.opexGrowth) + ", depreciation stays " + R(d.dep) + " (capex keeps replacing it), and interest falls as the loan is repaid — " + R(y26.pl.interest) + ", " + R(y27.pl.interest) + ", " + R(y28.pl.interest) + " at 10% of each year's opening balance.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Projected income statement, FY26–FY28",
          hint: "Build the whole FY26 column (C5:C15) referencing the drivers in B2:B4 and the FY25 actuals in column B — then select each cell and press 'Copy formula right →' twice to fill FY27 and FY28. Lock the driver references with $ (e.g. $B$2) so they don't shift when you copy.",
          grid: [
            ["DRIVERS", null, null, null, null],
            ["Revenue growth", { v: d.growth, fmt: "pct" }, null, null, null],
            ["Gross margin", { v: d.gm, fmt: "pct" }, null, null, null],
            ["Opex inflation", { v: d.opexGrowth, fmt: "pct" }, null, null, null],
            ["", { v: "FY25 actual", year: true }, { v: "FY26", year: true }, { v: "FY27", year: true }, { v: "FY28", year: true }],
            ["Revenue", y25.pl.revenue, { input: true, mf: true, fmt: "inr", ph: "=B6*(1+$B$2)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Cost of goods sold", -y25.pl.cogs, { input: true, mf: true, fmt: "inr", ph: "=-C6*(1-$B$3)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Gross profit", y25.pl.grossProfit, { input: true, mf: true, fmt: "inr", ph: "=SUM(C6:C7)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Operating expenses", -y25.pl.opex, { input: true, mf: true, fmt: "inr", ph: "=B9*(1+$B$4)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["EBITDA", y25.pl.ebitda, { input: true, mf: true, fmt: "inr", ph: "=SUM(C8:C9)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Depreciation", -y25.pl.dep, -d.dep, -d.dep, -d.dep],
            ["EBIT", y25.pl.ebit, { input: true, mf: true, fmt: "inr", ph: "=SUM(C10:C11)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Interest expense", -y25.pl.interest, -y26.pl.interest, -y27.pl.interest, -y28.pl.interest],
            ["Profit before tax", y25.pl.pbt, { input: true, mf: true, fmt: "inr", ph: "=SUM(C12:C13)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["PROFIT AFTER TAX", y25.pl.pat, { input: true, mf: true, fmt: "inr", ph: "=C14*0.75" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }]
          ],
          checks: [
            { cell: "C6", expect: 2760000, message: "C6: FY26 revenue", mustFormula: true },
            { cell: "C8", expect: 1794000, message: "C8: FY26 gross profit", mustFormula: true },
            { cell: "C10", expect: 672000, message: "C10: FY26 EBITDA", mustFormula: true },
            { cell: "C12", expect: 432000, message: "C12: FY26 EBIT", mustFormula: true },
            { cell: "C15", expect: 282750, message: "C15: FY26 profit after tax", mustFormula: true, tol: 5 },
            { cell: "D6", expect: 3174000, message: "D6: FY27 revenue", mustFormula: true },
            { cell: "D15", expect: 404175, message: "D15: FY27 profit after tax", mustFormula: true, tol: 5 },
            { cell: "E6", expect: 3650100, message: "E6: FY28 revenue", mustFormula: true },
            { cell: "E12", expect: 774945, message: "E12: FY28 EBIT", mustFormula: true, tol: 5 },
            { cell: "E15", expect: 547459, message: "E15: FY28 profit after tax", mustFormula: true, tol: 5 }
          ],
          success: "Three projected years from four assumptions. PAT roughly triples, from " + R(y25.pl.pat) + " to " + R(rd(y28.pl.pat)) + " — mostly operating leverage, since revenue grows 15% while costs grow 10%."
        }
      },
      { t: "note", h: "<strong>Why the $ signs matter:</strong> when you copy a formula right, relative references shift (C6 becomes D6 — what you want for last year's revenue) but $B$2 stays anchored on the growth driver. Mixing these up is the most common cause of a model that works in the first column and quietly falls apart in the third. The 'Copy formula right' button in this sheet respects $ exactly as Excel does — try it both ways and watch." },
      { t: "where", h: "This projected <strong>income statement</strong> feeds everything downstream: PAT drives retained earnings, EBIT drives the free cash flow you'll build next, and both flow into the valuation in the “DCF & terminal value” lesson." },
      { t: "mcq", q: "Revenue grows 15% a year and operating costs 10%. What happens to EBITDA margin over three years?", opts: ["It stays flat — both are growing", "It rises, because revenue outgrows the costs it doesn't control", "It falls, because costs compound", "It depends on the tax rate"], correct: 1, why: ["Both grow, but at different rates — and the gap compounds in the business's favour.", "This is operating leverage. Gross margin is fixed at 65% by assumption, so gross profit grows at the full 15%, while opex grows at only 10%. EBITDA margin climbs from " + P(y25.pl.ebitda / y25.pl.revenue) + " in FY25 to " + P(y28.pl.ebitda / y28.pl.revenue) + " by FY28. It's also the assumption to challenge hardest — it says the café can grow 15% a year without proportionally more staff, which may not survive contact with reality.", "Costs do compound, but more slowly than revenue does. Compounding at 10% loses to compounding at 15%.", "Tax sits well below EBITDA — it can't affect that margin at all."] }
    ]
  };

  LS.lessons["2230-fcff"] = {
    id: "2230-fcff", code: "2230", minutes: 6,
    title: "Free cash flow to the firm",
    short: "Free cash flow",
    desc: "The cash a business generates for all its funders: EBIT after tax, plus depreciation, minus capex and working capital.",
    lede: "Valuation doesn't use profit. It uses free cash flow — the cash actually available to hand to lenders and owners after the business has paid for everything it needs to keep running.",
    body: [
      { t: "def", term: "Free cash flow to the firm (FCFF)", h: "Cash generated by operations, after tax and after the investment needed to sustain them, but <strong>before</strong> any payments to lenders or owners. It belongs to <em>all</em> providers of capital — which is why it's discounted at a blended cost of capital." },
      { t: "formula", title: "Building FCFF", lines: [
        "EBIT × (1 − tax rate)      <i>= NOPAT, operating profit after a clean tax charge</i>",
        "+ Depreciation             <i>add back — it never cost cash</i>",
        "− Capital expenditure      <i>real cash the business must spend to survive</i>",
        "− Increase in working capital",
        "= <b>Free cash flow to the firm</b>"
      ], note: "Interest is deliberately absent. FCFF is measured <em>before</em> financing, so it doesn't change if the café repays its loan — that keeps the valuation about the business, not its funding mix. The tax is computed on EBIT, not on PBT, for the same reason." },
      { t: "example", h: "<p>FY26: EBIT of " + R(y26.pl.ebit) + " taxed at 25% gives NOPAT of " + R(rd(y26.pl.ebit * 0.75)) + ". Add back " + R(d.dep) + " of depreciation, subtract " + R(d.capex) + " of capex (they cancel), then subtract the " + R(rd(y26.dNWC)) + " that growth ties up in extra stock and receivables. FCFF: " + R(rd(y26.fcff)) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Free cash flow to the firm, FY26–FY28",
          hint: "Build the FY26 column (C3 down to C8), then copy each formula right into FY27 and FY28. Working capital increases are already entered as negatives.",
          grid: [
            ["", { v: "FY26", year: true }, { v: "FY27", year: true }, { v: "FY28", year: true }],
            ["EBIT", y26.pl.ebit, rd(y27.pl.ebit), rd(y28.pl.ebit)],
            ["Tax rate", { v: C.taxRate, fmt: "pct" }, { v: C.taxRate, fmt: "pct" }, { v: C.taxRate, fmt: "pct" }],
            ["NOPAT = EBIT × (1 − tax)", { input: true, mf: true, fmt: "inr", ph: "=B2*(1-B3)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Add: depreciation", d.dep, d.dep, d.dep],
            ["Less: capital expenditure", -d.capex, -d.capex, -d.capex],
            ["Less: increase in working capital", -rd(y26.dNWC), -rd(y27.dNWC), -rd(y28.dNWC)],
            ["FREE CASH FLOW TO THE FIRM", { input: true, mf: true, fmt: "inr", ph: "=SUM(B4:B7)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }]
          ],
          checks: [
            { cell: "B4", expect: 324000, message: "B4: FY26 NOPAT", mustFormula: true },
            { cell: "B8", expect: 289500, message: "B8: FY26 free cash flow", mustFormula: true, tol: 2 },
            { cell: "C4", expect: 441675, message: "C4: FY27 NOPAT", mustFormula: true, tol: 2 },
            { cell: "C8", expect: 402000, message: "C8: FY27 free cash flow", mustFormula: true, tol: 2 },
            { cell: "D4", expect: 581209, message: "D4: FY28 NOPAT", mustFormula: true, tol: 2 },
            { cell: "D8", expect: 535582, message: "D8: FY28 free cash flow", mustFormula: true, tol: 2 }
          ],
          success: "FCFF of " + R(rd(y26.fcff)) + ", " + R(rd(y27.fcff)) + " and " + R(rd(y28.fcff)) + ". These three numbers are the entire input to the valuation in the next lesson — everything else you've learned exists to produce them credibly."
        }
      },
      { t: "note", h: "Notice how much smaller FCFF is than EBITDA (" + R(rd(y26.pl.ebitda)) + " in FY26). The difference is tax, the capex needed to stand still, and the working capital growth consumes. This is the concrete answer to why EBITDA is not cash flow — a point the “Opex & EBITDA” lesson made in words and this sheet makes in rupees." },
      { t: "where", h: "FCFF is not a line on any published statement — you build it from the <strong>income statement</strong> (EBIT, tax rate), the <strong>cash flow statement</strong> (depreciation, capex) and the <strong>balance sheet</strong> (working capital). It's the payoff for having built all three." },
      { t: "mcq", q: "Why does FCFF use EBIT × (1 − tax) rather than the actual profit after tax?", opts: ["It's an approximation that's easier to compute", "To measure the business before financing, so the valuation doesn't change with the debt mix", "Because PAT includes depreciation", "Tax authorities require it"], correct: 1, why: ["It's actually more work, not less — you're deliberately recomputing tax as if the company had no debt.", "PAT is struck after interest, so it's smaller for an indebted company. If valuation used PAT, the café would appear less valuable simply for having borrowed — which is nonsense, since the loan didn't change how much coffee it sells. FCFF measures the business itself; the debt is dealt with separately, by subtracting net debt at the end (next lesson).", "PAT is after depreciation, which is why the add-back is a separate line in the build.", "This is a valuation convention, not a tax rule — real tax is computed on actual profit after interest."] }
    ]
  };

  LS.lessons["2240-dcf"] = {
    id: "2240-dcf", code: "2240", minutes: 7,
    title: "Discounting and a one-cell DCF",
    short: "DCF & terminal value",
    desc: "Present value, the discount rate, Gordon-growth terminal value, and two hardwired scenarios showing how sensitive it all is.",
    lede: "A rupee next year is worth less than a rupee today. Discounting puts a number on that, and a discounted cash flow model is nothing more than doing it to every future year — plus one big assumption about the years after your forecast ends.",
    body: [
      { t: "def", term: "Present value", h: "What a future cash flow is worth today, given that money can earn a return in the meantime. Divide by (1 + rate) once for each year of waiting." },
      { t: "def", term: "Discount rate (WACC)", h: "The blended annual return the business's funders require — the <strong>w</strong>eighted <strong>a</strong>verage <strong>c</strong>ost of <strong>c</strong>apital. Since FCFF belongs to lenders and owners together, it's discounted at their blended required return. We use 12% for the café: higher than the 10% loan rate, because equity is riskier than debt." },
      { t: "def", term: "Terminal value", h: "The value of every year <em>after</em> the forecast period. You can't forecast forever, so you assume cash flows grow steadily at a modest rate g and collapse the infinite series into a single number." },
      { t: "formula", title: "The three pieces", lines: [
        "Present value  = Cash flow ÷ (1 + WACC)^year",
        "Terminal value = Final year FCFF × (1 + g) ÷ (WACC − g)",
        "<b>Enterprise value</b> = Σ present values + present value of terminal value",
        "<b>Equity value</b>     = Enterprise value − Net debt"
      ], note: "The terminal growth rate g must be below the WACC (or the formula explodes) and shouldn't exceed long-run economic growth — a business growing faster than the economy forever would eventually become the economy. 3–5% is the usual range." },
      { t: "example", h: "<p>Valuing the café on 31 March 2025, using the FCFFs you built: " + R(rd(dcf.fcff[0])) + ", " + R(rd(dcf.fcff[1])) + ", " + R(rd(dcf.fcff[2])) + ". WACC 12%, terminal growth 4%. Net debt is the " + R(y25.bs.loan) + " loan less the " + R(y25.bs.cash) + " of cash — " + R(dcf.netDebt) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Discounted cash flow — value the café",
          hint: "Build the discount factors (C6:E6) as 1/(1+WACC)^year — anchor the WACC with $B$2. Multiply to get present values (C7:E7). Then terminal value in B10, its present value in B11, enterprise value in B12, and equity value in B14.",
          grid: [
            ["ASSUMPTIONS", null, null, null, null],
            ["WACC (discount rate)", { v: 0.12, fmt: "pct" }, null, null, null],
            ["Terminal growth rate", { v: 0.04, fmt: "pct" }, null, null, null],
            ["", null, { v: "FY26", year: true }, { v: "FY27", year: true }, { v: "FY28", year: true }],
            ["Year number", null, { v: 1, fmt: "plain" }, { v: 2, fmt: "plain" }, { v: 3, fmt: "plain" }],
            ["Free cash flow", null, rd(dcf.fcff[0]), rd(dcf.fcff[1]), rd(dcf.fcff[2])],
            ["Discount factor", null, { input: true, mf: true, fmt: "x", ph: "=1/(1+$B$2)^C5" }, { input: true, mf: true, fmt: "x" }, { input: true, mf: true, fmt: "x" }],
            ["Present value", null, { input: true, mf: true, fmt: "inr", ph: "=C6*C7" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            [null, null, null, null, null],
            ["Sum of present values, FY26–28", { input: true, mf: true, fmt: "inr", ph: "=SUM(C8:E8)" }, null, null, null],
            ["Terminal value at end FY28", { input: true, mf: true, fmt: "inr", ph: "=E6*(1+B3)/(B2-B3)" }, null, null, null],
            ["Present value of terminal value", { input: true, mf: true, fmt: "inr", ph: "=B11*E7" }, null, null, null],
            ["ENTERPRISE VALUE", { input: true, mf: true, fmt: "inr", ph: "=B10+B12" }, null, null, null],
            ["Less: net debt (loan − cash)", -dcf.netDebt, null, null, null],
            ["EQUITY VALUE", { input: true, mf: true, fmt: "inr", ph: "=B13+B14" }, null, null, null]
          ],
          checks: [
            { cell: "C7", expect: 0.8929, message: "C7: FY26 discount factor", mustFormula: true, tol: 0.002 },
            { cell: "E7", expect: 0.7118, message: "E7: FY28 discount factor", mustFormula: true, tol: 0.002 },
            { cell: "C8", expect: 258482, message: "C8: FY26 present value", mustFormula: true, tol: 500 },
            { cell: "E8", expect: 381217, message: "E8: FY28 present value", mustFormula: true, tol: 500 },
            { cell: "B10", expect: 960171, message: "B10: sum of the three present values", mustFormula: true, tol: 1500 },
            { cell: "B11", expect: 6962572, message: "B11: terminal value (Gordon growth)", mustFormula: true, tol: 3000 },
            { cell: "B12", expect: 4955822, message: "B12: present value of the terminal value", mustFormula: true, tol: 3000 },
            { cell: "B13", expect: 5915993, message: "B13: ENTERPRISE VALUE", mustFormula: true, tol: 4000 },
            { cell: "B15", expect: 5465993, message: "B15: EQUITY VALUE", mustFormula: true, tol: 4000 }
          ],
          success: "Enterprise value about " + R(rd(dcf.ev)) + ", equity value about " + R(rd(dcf.equity)) + " — roughly " + (dcf.equity / y25.pl.pat).toFixed(0) + "× FY25 profit. Note how much of it comes from the terminal value."
        }
      },
      { t: "note", h: "<strong>Look where the value lives.</strong> Of the " + R(rd(dcf.ev)) + " enterprise value, only " + R(rd(dcf.ev - dcf.pvTV)) + " (" + P((dcf.ev - dcf.pvTV) / dcf.ev) + ") comes from the three years you carefully forecast. The other " + P(dcf.pvTV / dcf.ev) + " comes from the terminal value — a single formula resting on one assumption about the distant future. That is the honest, uncomfortable truth about every DCF." },
      {
        t: "table",
        head: ["Scenario", "WACC", "Terminal growth", "Enterprise value", "Equity value"],
        numCols: [1, 2, 3, 4],
        rows: [
          ["Base case", "12%", "4%", R(rd(dcf.ev)), R(rd(dcf.equity))],
          ["Cautious case", "13%", "3%", R(rd(C.dcfBear.ev)), R(rd(C.dcfBear.equity))],
          { cells: ["Change", "+1 pt", "−1 pt", P((C.dcfBear.ev - dcf.ev) / dcf.ev), P((C.dcfBear.equity - dcf.equity) / dcf.equity)], total: true }
        ]
      },
      { t: "p", h: "One percentage point on each assumption — well within the range of reasonable disagreement — moves the answer by about a fifth. This is why a DCF should be read as a range, and why anyone quoting a valuation to the rupee is overselling the method." },
      { t: "where", h: "The DCF sits on top of everything: the <strong>income statement</strong> gave EBIT, the <strong>cash flow statement</strong> gave depreciation and capex, the <strong>balance sheet</strong> gave working capital and net debt. Valuation is the last step, not the first — and it's only as good as the statements beneath it." },
      { t: "mcq", q: "Your DCF says the café is worth ₹54,65,993. How should you present that?", opts: ["Exactly as calculated — the model is precise", "As a range, roughly ₹43–55 lakh, with the key assumptions stated", "Round it to ₹55,00,000 and present it as fact", "Refuse to give a number — DCFs are unreliable"], correct: 1, why: ["The arithmetic is precise; the inputs are not. Precision in the output can't exceed precision in the input, and quoting seven digits implies a confidence nobody has.", "The scenario table shows a one-point change in each assumption moves equity value from ₹54.7 lakh to ₹43.2 lakh. Presenting the range, naming the assumptions that drive it, and showing how much rests on terminal value is honest and far more useful to whoever has to decide.", "Rounding hides the uncertainty rather than communicating it — the problem isn't the digits, it's the false confidence.", "A range with stated assumptions is genuinely informative. Refusing to answer just moves the guess to someone with less information."] }
    ]
  };

  LS.lessons["2250-valuation-capstone"] = {
    id: "2250-valuation-capstone", code: "2250", minutes: 8,
    title: "Capstone: value the café",
    short: "★ Value the café",
    desc: "One integrated model from revenue growth to equity value — every number built by formula, end to end.",
    lede: "The whole course in one sheet. Start from three assumptions, project the P&L, derive free cash flow, discount it, and arrive at what Bombay Bean Coffee Co. is worth. Nothing typed that can be calculated.",
    body: [
      { t: "p", h: "This is what everything was for. Priya has been offered a buyout and wants to know what her café is worth. You have her FY25 statements — which you built, line by line, and which tie. Now turn them into a number." },
      { t: "formula", title: "The chain you're about to build", lines: [
        "growth, margin, inflation  →  projected P&amp;L  →  EBIT",
        "EBIT  →  NOPAT  →  <b>free cash flow</b>  (± depreciation, capex, working capital)",
        "FCFF  →  discount  →  enterprise value  →  <b>equity value</b>"
      ], note: "Every arrow is a formula you've already written once. This time they connect end to end in a single sheet." },
      { t: "example", h: "<p>Same assumptions as the module: revenue +" + P(d.growth) + ", gross margin " + P(d.gm) + ", opex +" + P(d.opexGrowth) + ", depreciation and capex both " + R(d.dep) + ", tax " + P(C.taxRate) + ", WACC 12%, terminal growth 4%, net debt " + R(dcf.netDebt) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Bombay Bean Coffee Co. — integrated valuation model",
          hint: "Build the FY26 column top to bottom (C10 down to C21), anchoring driver references with $ so they survive copying. Then copy each formula right into FY27 and FY28. Finish with the valuation block in B23:B28. Working capital increases are given as negatives in row 18.",
          grid: [
            ["ASSUMPTIONS", null, null, null, null],
            ["Revenue growth", { v: d.growth, fmt: "pct" }, null, null, null],
            ["Gross margin", { v: d.gm, fmt: "pct" }, null, null, null],
            ["Opex inflation", { v: d.opexGrowth, fmt: "pct" }, null, null, null],
            ["Tax rate", { v: C.taxRate, fmt: "pct" }, null, null, null],
            ["WACC", { v: 0.12, fmt: "pct" }, null, null, null],
            ["Terminal growth", { v: 0.04, fmt: "pct" }, null, null, null],
            ["", { v: "FY25 actual", year: true }, { v: "FY26", year: true }, { v: "FY27", year: true }, { v: "FY28", year: true }],
            ["Year number (for discounting)", null, { v: 1, fmt: "plain" }, { v: 2, fmt: "plain" }, { v: 3, fmt: "plain" }],
            ["Revenue", y25.pl.revenue, { input: true, mf: true, fmt: "inr", ph: "=B10*(1+$B$2)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Cost of goods sold", -y25.pl.cogs, { input: true, mf: true, fmt: "inr", ph: "=-C10*(1-$B$3)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Operating expenses", -y25.pl.opex, { input: true, mf: true, fmt: "inr", ph: "=B12*(1+$B$4)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Depreciation", -y25.pl.dep, -d.dep, -d.dep, -d.dep],
            ["EBIT", y25.pl.ebit, { input: true, mf: true, fmt: "inr", ph: "=SUM(C10:C13)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["NOPAT", null, { input: true, mf: true, fmt: "inr", ph: "=C14*(1-$B$5)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Add back depreciation", null, d.dep, d.dep, d.dep],
            ["Less capex", null, -d.capex, -d.capex, -d.capex],
            ["Less increase in working capital", null, -rd(y26.dNWC), -rd(y27.dNWC), -rd(y28.dNWC)],
            ["FREE CASH FLOW", null, { input: true, mf: true, fmt: "inr", ph: "=SUM(C15:C18)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["Discount factor", null, { input: true, mf: true, fmt: "x", ph: "=1/(1+$B$6)^C9" }, { input: true, mf: true, fmt: "x" }, { input: true, mf: true, fmt: "x" }],
            ["Present value of FCF", null, { input: true, mf: true, fmt: "inr", ph: "=C19*C20" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["VALUATION", null, null, null, null],
            ["Sum of PVs, FY26–28", { input: true, mf: true, fmt: "inr", ph: "=SUM(C21:E21)" }, null, null, null],
            ["Terminal value", { input: true, mf: true, fmt: "inr", ph: "=E19*(1+B7)/(B6-B7)" }, null, null, null],
            ["PV of terminal value", { input: true, mf: true, fmt: "inr", ph: "=B24*E20" }, null, null, null],
            ["ENTERPRISE VALUE", { input: true, mf: true, fmt: "inr", ph: "=B23+B25" }, null, null, null],
            ["Less: net debt", -dcf.netDebt, null, null, null],
            ["EQUITY VALUE", { input: true, mf: true, fmt: "inr", ph: "=B26+B27" }, null, null, null]
          ],
          checks: [
            { cell: "C10", expect: 2760000, message: "C10: FY26 revenue", mustFormula: true },
            { cell: "C14", expect: 432000, message: "C14: FY26 EBIT", mustFormula: true, tol: 5 },
            { cell: "C15", expect: 324000, message: "C15: FY26 NOPAT", mustFormula: true, tol: 5 },
            { cell: "C19", expect: 289500, message: "C19: FY26 free cash flow", mustFormula: true, tol: 5 },
            { cell: "D19", expect: 402000, message: "D19: FY27 free cash flow", mustFormula: true, tol: 5 },
            { cell: "E14", expect: 774945, message: "E14: FY28 EBIT", mustFormula: true, tol: 5 },
            { cell: "E19", expect: 535582, message: "E19: FY28 free cash flow", mustFormula: true, tol: 5 },
            { cell: "E21", expect: 381217, message: "E21: FY28 present value", mustFormula: true, tol: 800 },
            { cell: "B23", expect: 960171, message: "B23: sum of present values", mustFormula: true, tol: 2000 },
            { cell: "B24", expect: 6962572, message: "B24: terminal value", mustFormula: true, tol: 4000 },
            { cell: "B26", expect: 5915993, message: "B26: ENTERPRISE VALUE", mustFormula: true, tol: 6000 },
            { cell: "B28", expect: 5465993, message: "B28: EQUITY VALUE — what Priya's café is worth", mustFormula: true, tol: 6000 }
          ],
          success: "Equity value about " + R(rd(dcf.equity)) + ". You started this course not knowing what an asset was, and you've just valued a business from its raw statements — every number built by formula, none of them typed."
        }
      },
      { t: "note", h: "<strong>Change an assumption and watch.</strong> Drop revenue growth in B2 from 15% to 8% and the equity value falls sharply — because slower growth shrinks every projected cash flow <em>and</em> the terminal value built on the last one. That responsiveness is what makes this a model. It's also the warning: a model reflects its assumptions faithfully, including the wrong ones." },
      { t: "where", h: "This is the end of the chain that started with the “The five buckets” lesson's five buckets. Assets and liabilities became a balance sheet, revenue and expenses became an income statement, the two became a cash flow statement, the three became a linked model, and the model became a valuation. Every number traceable to a café in Mumbai." },
      { t: "mcq", q: "Priya is offered ₹40,00,000 for the café. Based on your model, what's the most defensible response?", opts: ["Accept — it's a large sum", "Reject — the model says ₹54,65,993", "It's below even the cautious case of ₹43 lakh, so ask what assumptions justify the offer", "Ask for ₹70,00,000, since DCFs are conservative"], correct: 2, why: ["The size of a number in isolation tells you nothing about whether it's a fair price.", "Right direction, wrong confidence. Quoting the model to the rupee invites the buyer to attack your assumptions — and they'd be right to.", "The offer sits below even the cautious scenario (₹43.2 lakh at 13% WACC and 3% terminal growth). That doesn't prove it's too low, but it does convert a haggle into a conversation about assumptions: does the buyer expect slower growth, thinner margins, higher risk? If their reasoning is better than yours, you learn something. If it isn't, you have grounds to hold out.", "There's no reason to think this DCF is conservative — and anchoring on a number you can't justify is the fastest way to lose credibility."] }
    ]
  };
})();
