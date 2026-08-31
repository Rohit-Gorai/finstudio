/* Module 1400 — The income statement */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr, P = LS.fmt.pct;
  var p = C.fy25.pl, p24 = C.fy24.pl;

  LS.lessons["1410-revenue"] = {
    id: "1410-revenue", code: "1410", minutes: 4,
    title: "Revenue: recognized ≠ collected",
    short: "Revenue",
    desc: "When a sale becomes revenue, why cash timing is irrelevant to it, and how the café's ₹24,00,000 splits between counter and catering.",
    lede: "Revenue is the top line, and the most misread number in finance. It does not mean \"money received\". It means \"value delivered\". Get this one distinction right and half of the cash flow module becomes obvious.",
    body: [
      { t: "def", term: "Revenue", h: "The value of goods or services <strong>delivered</strong> to customers during the period, whether or not they've paid. Also called turnover, sales, or the top line — it's the first line of the income statement." },
      { t: "def", term: "Revenue recognition", h: "Revenue is recorded when the business has <strong>done its job</strong> — handed over the coffee, finished the catering. Cash arriving earlier (an advance) or later (credit) doesn't change <em>when</em> revenue is recognized, only which balance-sheet line holds the difference." },
      { t: "formula", title: "Three timings, one revenue", lines: [
        "Cash sale:      deliver &amp; collect together → revenue, cash ↑",
        "Credit sale:    deliver now, collect later  → revenue, <b>receivable ↑</b>",
        "Advance:        collect now, deliver later  → <b>no revenue yet</b>, liability ↑"
      ], note: "Only the middle case creates a receivable; only the last delays revenue. The delivery date, not the bank statement, drives the top line." },
      { t: "example", h: "<p>FY25 revenue of <strong>" + R(p.revenue) + "</strong> comes from two streams: the counter (walk-in coffee, paid instantly) and corporate catering (invoiced on 30-day terms — the " + R(600000) + " you met in the “Receivables” lesson). Both are revenue the moment the coffee is handed over.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "FY25 revenue, and how much of it was actually collected",
          hint: "Total revenue in B4 with SUM. Then in B7: cash collected = counter sales (all cash) + catering collections. You worked out catering collections in the “Receivables” lesson using the roll-forward — opening receivables + invoices − closing.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Counter sales (cash)", p.revenue - 600000],
            ["Catering sales (invoiced)", 600000],
            ["Total revenue", { input: true, mf: true, fmt: "inr", ph: "=SUM(B2:B3)" }],
            ["Opening receivables", C.fy24.bs.receivables],
            ["Closing receivables", C.fy25.bs.receivables],
            ["Cash actually collected", { input: true, mf: true, fmt: "inr", ph: "=…" }],
            ["Revenue not yet in the bank", { input: true, mf: true, fmt: "inr", ph: "=B4-B7" }]
          ],
          checks: [
            { cell: "B4", expect: 2400000, message: "B4: total revenue via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B7", expect: 2360000, message: "B7: cash collected = counter + (opening AR + catering invoices − closing AR)", mustFormula: true },
            { cell: "B8", expect: 40000, message: "B8: the gap between revenue and cash", mustFormula: true }
          ],
          success: "Revenue " + R(p.revenue) + ", cash collected " + R(2360000) + ". The " + R(40000) + " gap is exactly the growth in receivables — and exactly what the cash flow statement will subtract in the “CFO (indirect)” lesson."
        }
      },
      { t: "where", h: "Revenue is the first line of the <strong>income statement</strong>. Anything invoiced but uncollected sits in receivables on the <strong>balance sheet</strong>. The change in receivables is a working-capital adjustment on the <strong>cash flow statement</strong>." },
      { t: "mcq", q: "On 20 March, Nimbus Tech pays the café ₹90,000 upfront for an April conference. How much FY25 revenue (year ends 31 March) does this create?", opts: ["₹90,000 — the cash is in the bank", "₹90,000 — the contract is signed", "Nothing — the coffee hasn't been served", "₹7,500 — one month's worth"], correct: 2, why: ["Cash in the bank is not the test. If it were, any company could inflate this year's revenue by asking customers to prepay.", "Signing isn't delivering either. A contract creates an obligation, not revenue.", "The café has done nothing yet, so it has earned nothing. The ₹90,000 sits as a liability (deferred revenue) — the café owes coffee or a refund. It becomes FY26 revenue in April, when the conference is served. Cash up, revenue flat: the exact opposite of a credit sale, where revenue is up and cash is flat.", "Time-apportioning suits a rental or subscription that's delivered continuously. A one-day conference is delivered on the day it happens — all in April."] }
    ]
  };

  LS.lessons["1420-cogs"] = {
    id: "1420-cogs", code: "1420", minutes: 4,
    title: "COGS and gross profit",
    short: "COGS & gross profit",
    desc: "Direct costs, gross profit and gross margin — the first profit line, and what it tells you about pricing power.",
    lede: "Subtract the cost of the beans from the price of the coffee and you have gross profit — the money left to pay for everything else. It's the first and most diagnostic subtotal on the income statement.",
    body: [
      { t: "def", term: "Cost of goods sold (COGS)", h: "The <strong>direct</strong> cost of what was sold — beans, milk, cups, pastry. It moves up and down with sales volume. Rent doesn't; rent is an operating expense (next lesson)." },
      { t: "def", term: "Gross profit & gross margin", h: "<strong>Gross profit</strong> = revenue − COGS: what's left after paying for the product itself. <strong>Gross margin</strong> is that as a percentage of revenue — the cleanest single read on pricing power." },
      { t: "formula", title: "The first subtotal", lines: [
        "Gross profit = Revenue − COGS",
        "Gross margin % = Gross profit ÷ Revenue",
        "Café FY25: " + R(p.revenue) + " − " + R(p.cogs) + " = <b>" + R(p.grossProfit) + "</b> (" + P(C.ratios.gmPct) + ")"
      ], note: "The direct/indirect line can be judgment. A barista's wage is arguably direct, but because staffing is fixed week to week the café — like most cafés — reports it as an operating expense. Be consistent, and read others' definitions before comparing." },
      { t: "example", h: "<p>The café consumed " + R(p.cogs) + " of beans, milk and pastry (see “Inventory”) to deliver " + R(p.revenue) + " of coffee. A 65% gross margin is normal for a café: the physical inputs of a latte are cheap; the rent and the barista are what actually cost money.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Gross profit and margin, FY24 vs FY25",
          hint: "Two columns — FY24 and FY25. Build B4 first, then use the 'Copy formula right →' button to push it into C4: that's exactly what fill-right does in Excel. Do the same for the margin row (format it as a percentage by dividing — the cell is already set to show %).",
          grid: [
            ["", { v: "FY24", year: true }, { v: "FY25", year: true }],
            ["Revenue", p24.revenue, p.revenue],
            ["Cost of goods sold", p24.cogs, p.cogs],
            ["Gross profit", { input: true, mf: true, fmt: "inr", ph: "=B2-B3" }, { input: true, mf: true, fmt: "inr" }],
            ["Gross margin", { input: true, mf: true, fmt: "pct", ph: "=B4/B2" }, { input: true, mf: true, fmt: "pct" }]
          ],
          checks: [
            { cell: "B4", expect: 1300000, message: "B4: FY24 gross profit", mustFormula: true },
            { cell: "C4", expect: 1560000, message: "C4: FY25 gross profit", mustFormula: true },
            { cell: "B5", expect: 0.65, message: "B5: FY24 gross margin", mustFormula: true, tol: 0.001 },
            { cell: "C5", expect: 0.65, message: "C5: FY25 gross margin", mustFormula: true, tol: 0.001 }
          ],
          success: "Gross profit grew from " + R(1300000) + " to " + R(1560000) + " — but margin held at exactly 65%. Growth came from selling more coffee, not from charging more per cup."
        }
      },
      { t: "where", h: "Gross profit is the first subtotal on the <strong>income statement</strong>. It has no balance-sheet line of its own — but the inventory it consumed came off the <strong>balance sheet</strong>, and the margin it reveals is the first ratio you'll compute in the “Margins” lesson." },
      { t: "mcq", q: "The café's gross margin falls from 65% to 58% while revenue grows. The most likely cause is…", opts: ["Rent went up", "Bean prices rose and the café didn't raise cup prices", "It bought a second espresso machine", "It repaid part of the loan"], correct: 1, why: ["Rent is an operating expense, below the gross profit line — it can't touch gross margin. That's precisely why the subtotal is useful: it isolates product economics from overheads.", "Gross margin only moves when the relationship between selling price and direct cost changes. Costlier beans absorbed rather than passed on is the textbook cause — and a warning sign, because it means the café lacks the pricing power to defend its margin.", "A machine is capex; it reaches the P&L as depreciation, far below gross profit.", "Loan repayments never touch the income statement at all (see “Borrowings”), let alone gross margin."] }
    ]
  };

  LS.lessons["1430-opex-ebitda"] = {
    id: "1430-opex-ebitda", code: "1430", minutes: 5,
    title: "Operating expenses & EBITDA",
    short: "Opex & EBITDA",
    desc: "Build revenue down to EBITDA, and understand what that much-quoted acronym does and doesn't measure.",
    lede: "Below gross profit sit the costs of simply being open: rent, salaries, power, marketing. Subtract them and you reach EBITDA — the number investors quote most and misunderstand most.",
    body: [
      { t: "def", term: "Operating expenses (opex)", h: "The costs of running the business that aren't direct product costs — rent, salaries, utilities, marketing. Largely <strong>fixed</strong>: the rent is the same whether you sell 100 cups or 1,000. Fixed costs are why growth improves margins." },
      { t: "def", term: "EBITDA", h: "<strong>E</strong>arnings <strong>B</strong>efore <strong>I</strong>nterest, <strong>T</strong>ax, <strong>D</strong>epreciation and <strong>A</strong>mortisation. Profit from operating the business, before financing choices (interest), government (tax) and past investment decisions (depreciation)." },
      { t: "formula", title: "Down to EBITDA", lines: [
        "Revenue − COGS = Gross profit",
        "Gross profit − Operating expenses = <b>EBITDA</b>",
        "Café FY25: " + R(p.grossProfit) + " − " + R(p.opex) + " = <b>" + R(p.ebitda) + "</b>"
      ], note: "EBITDA is popular because it compares two businesses' operations without their debt or tax situations getting in the way. Its danger: it ignores that machines wear out and must be replaced. EBITDA is not cash flow — the “The cash flow statement” module shows why." },
      { t: "example", h: "<p>The café's FY25 overheads: rent " + R(p.rent) + " (unchanged — a five-year lease), salaries " + R(p.salaries) + " (up, a third barista was hired), utilities " + R(p.utilities) + ", and marketing " + R(p.marketing) + ". Total " + R(p.opex) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Revenue → EBITDA, FY25",
          hint: "Four formulas: gross profit (B4), total opex (B9, use SUM over the four cost rows), EBITDA (B10), and the EBITDA margin (B11).",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Revenue", p.revenue],
            ["Cost of goods sold", -p.cogs],
            ["Gross profit", { input: true, mf: true, fmt: "inr", ph: "=B2+B3" }],
            ["Rent", -p.rent],
            ["Salaries & wages", -p.salaries],
            ["Utilities", -p.utilities],
            ["Marketing", -p.marketing],
            ["Total operating expenses", { input: true, mf: true, fmt: "inr", ph: "=SUM(B5:B8)" }],
            ["EBITDA", { input: true, mf: true, fmt: "inr", ph: "=B4+B9" }],
            ["EBITDA margin", { input: true, mf: true, fmt: "pct", ph: "=B10/B2" }]
          ],
          checks: [
            { cell: "B4", expect: 1560000, message: "B4: gross profit", mustFormula: true },
            { cell: "B9", expect: -1020000, message: "B9: total operating expenses via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B10", expect: 540000, message: "B10: EBITDA", mustFormula: true },
            { cell: "B11", expect: 0.225, message: "B11: EBITDA margin", mustFormula: true, tol: 0.001 }
          ],
          success: "EBITDA " + R(p.ebitda) + ", a " + P(C.ratios.ebitdaPct) + " margin. Costs are entered as negatives here so every subtotal is a straight SUM — a modeling convention worth adopting."
        }
      },
      { t: "note", h: "<strong>Sign convention:</strong> this sheet enters costs as negative numbers and adds them. Real published statements print costs as positives and subtract. Both are fine — but inside a model, all-negative-costs-and-SUM means fewer sign errors. Pick one and never mix." },
      { t: "where", h: "EBITDA is a subtotal on the <strong>income statement</strong> (though Indian statutory formats don't print it as a named line — analysts compute it). It's the starting point for valuation multiples and the closest P&L line to operating cash flow, which the “The cash flow statement” module builds properly." },
      { t: "mcq", q: "Two cafés both report EBITDA of ₹5,00,000. Café A owns its equipment outright; Café B leases everything and has a large loan. Which is more profitable?", opts: ["They're identical — EBITDA says so", "Café A, almost certainly", "Café B, almost certainly", "EBITDA alone can't tell you"], correct: 3, why: ["Identical EBITDA is exactly where the number stops being informative. It was designed to strip out the differences that matter here.", "A is a reasonable guess — no interest, and owned assets — but you're inferring below-EBITDA facts EBITDA deliberately excludes. You'd need the full P&L to say.", "B's lease costs sit in opex (so already inside EBITDA), but its interest doesn't. Guessing B is riskier still.", "That's the honest answer, and the lesson. EBITDA excludes interest (B pays a lot, A none) and depreciation (A's owned machines wear out; B's don't appear). Same EBITDA, potentially very different profit after tax — which is why this module keeps going down to PAT."] }
    ]
  };

  LS.lessons["1440-depreciation-pl"] = {
    id: "1440-depreciation-pl", code: "1440", minutes: 4,
    title: "Depreciation on the P&L",
    short: "Depreciation & EBIT",
    desc: "Take the depreciation schedule from the “Depreciation” lesson onto the income statement to reach EBIT — operating profit.",
    lede: "Now the van schedule you built in the “Depreciation” lesson comes back. Subtract depreciation from EBITDA and you get EBIT — the last line before financing and government take their cuts.",
    body: [
      { t: "def", term: "EBIT (operating profit)", h: "<strong>E</strong>arnings <strong>B</strong>efore <strong>I</strong>nterest and <strong>T</strong>ax. EBITDA minus depreciation — profit after recognising that assets wear out, but before how the business is financed. Also called operating profit." },
      { t: "formula", title: "EBITDA to EBIT", lines: [
        "EBIT = EBITDA − Depreciation &amp; amortisation",
        "Café FY25: " + R(p.ebitda) + " − " + R(p.dep) + " = <b>" + R(p.ebit) + "</b>"
      ], note: "Amortisation is the same idea applied to intangible assets (software, a licence). The café has none, so its D&A is pure depreciation." },
      { t: "example", h: "<p>FY25 depreciation comes straight from the asset register: the fit-out (" + R(60000) + "), the original machine (" + R(60000) + "), the van (" + R(80000) + " — your the “Depreciation” lesson schedule), plus a first full year on the " + R(240000) + " of FY25 additions over 6 years (" + R(40000) + "). Total " + R(p.dep) + ", up from " + R(p24.dep) + " in FY24 because of that new equipment.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The FY25 depreciation charge, and EBIT",
          hint: "Each asset's annual charge is cost ÷ life — build all four with formulas (B2/C2 style). Total them in D6, then take EBITDA down to EBIT in D9.",
          grid: [
            ["Asset", "Cost", "Life (years)", "Annual depreciation"],
            ["Café fit-out & furniture", 600000, { v: 10, fmt: "plain" }, { input: true, mf: true, fmt: "inr", ph: "=B2/C2" }],
            ["Espresso machine & kitchen", 600000, { v: 10, fmt: "plain" }, { input: true, mf: true, fmt: "inr" }],
            ["Delivery van", 400000, { v: 5, fmt: "plain" }, { input: true, mf: true, fmt: "inr" }],
            ["FY25 additions", 240000, { v: 6, fmt: "plain" }, { input: true, mf: true, fmt: "inr" }],
            ["Total FY25 depreciation", null, null, { input: true, mf: true, fmt: "inr", ph: "=SUM(D2:D5)" }],
            [null, null, null, null],
            ["EBITDA (from the “Opex & EBITDA” lesson)", null, null, p.ebitda],
            ["EBIT", null, null, { input: true, mf: true, fmt: "inr", ph: "=D8-D6" }]
          ],
          checks: [
            { cell: "D2", expect: 60000, message: "D2: fit-out depreciation (cost ÷ life)", mustFormula: true },
            { cell: "D3", expect: 60000, message: "D3: espresso machine depreciation", mustFormula: true },
            { cell: "D4", expect: 80000, message: "D4: van depreciation — matches your 1120 schedule", mustFormula: true },
            { cell: "D5", expect: 40000, message: "D5: FY25 additions depreciation", mustFormula: true },
            { cell: "D6", expect: 240000, message: "D6: total depreciation via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "D9", expect: 300000, message: "D9: EBIT = EBITDA − depreciation", mustFormula: true }
          ],
          success: "Depreciation " + R(p.dep) + " → EBIT " + R(p.ebit) + ". Every rupee of that charge was traced to a specific asset — that's how a real schedule is built, and it's why your balance sheet's accumulated depreciation will tie."
        }
      },
      { t: "where", h: "The charge is an expense on the <strong>income statement</strong>. The same number increases accumulated depreciation on the <strong>balance sheet</strong> (reducing net PP&E), and gets added back on the <strong>cash flow statement</strong> because no cash moved. One number, three statements — that's bridge #2 of the “Linking the three statements” module." },
      { t: "mcq", q: "The café's EBITDA is ₹5,40,000 and EBIT is ₹3,00,000. A friend says \"so it really made ₹5,40,000, the depreciation is just an accounting entry.\" What's wrong with that?", opts: ["Nothing — depreciation isn't cash", "The equipment genuinely wears out and will need replacing with real cash", "Depreciation is a tax, not an expense", "EBITDA is always the wrong number to use"], correct: 1, why: ["It's true that no cash moved this year — but that's a statement about timing, not about whether the cost is real.", "The van really does lose a fifth of its life every year, and in FY29 the café will write a real cheque to replace it. Depreciation is the honest annual cost of that; ignoring it flatters any asset-heavy business. Note the café's steady-state capex (₹2,40,000/yr) happens to equal its depreciation — which is what you'd expect for a business just maintaining itself.", "Depreciation is an expense; it reduces taxable profit but is not itself a tax.", "EBITDA is useful for comparing operations across different financing structures — it's just not profit, and not cash."] }
    ]
  };

  LS.lessons["1450-interest-tax"] = {
    id: "1450-interest-tax", code: "1450", minutes: 4,
    title: "Interest, tax and profit after tax",
    short: "Interest, tax & PAT",
    desc: "The last three steps of the income statement: interest expense, profit before tax, tax, and the bottom line.",
    lede: "Two claimants remain: the bank wants interest, the government wants tax. What survives both is profit after tax — the number that flows into retained earnings and belongs to the owner.",
    body: [
      { t: "def", term: "Profit before tax (PBT)", h: "EBIT minus interest expense. The profit the business actually generated after paying for the money it borrowed — and the base the tax is calculated on." },
      { t: "def", term: "Profit after tax (PAT)", h: "PBT minus tax. The bottom line, also called net profit or net income. The <strong>only</strong> profit number that belongs to the owner — and the one that flows into retained earnings on the balance sheet." },
      { t: "formula", title: "The bottom of the statement", lines: [
        "EBIT − Interest = Profit before tax",
        "Tax = Tax rate × Profit before tax",
        "<b>Profit after tax</b> = Profit before tax − Tax",
        "Café FY25: " + R(p.ebit) + " − " + R(p.interest) + " = " + R(p.pbt) + "; tax @25% = " + R(p.tax) + "; <b>PAT = " + R(p.pat) + "</b>"
      ], note: "We apply a flat 25% to book profit. Real tax is computed on taxable income, which differs from book profit (depreciation rates alone differ) and creates deferred tax — a genuine complication we deliberately skip. Flag it, don't fake it." },
      { t: "example", h: "<p>Interest is " + R(p.interest) + " — 10% of the " + R(C.fy24.bs.loan) + " loan balance the café opened FY25 with (see “Borrowings”). Tax at 25% of " + R(p.pbt) + " is " + R(p.tax) + ". What's left is <strong>" + R(p.pat) + "</strong> — and you should recognise that number: it's exactly the PAT you rolled into retained earnings back in the “Retained earnings” lesson.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "EBIT down to PAT, FY25",
          hint: "Build B4 (PBT), B6 (tax — multiply PBT by the rate in B5) and B7 (PAT). Every one a formula.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["EBIT", p.ebit],
            ["Interest expense", -p.interest],
            ["Profit before tax", { input: true, mf: true, fmt: "inr", ph: "=B2+B3" }],
            ["Tax rate", { v: 0.25, fmt: "pct" }],
            ["Tax expense", { input: true, mf: true, fmt: "inr", ph: "=-B4*B5" }],
            ["PROFIT AFTER TAX", { input: true, mf: true, fmt: "inr", ph: "=B4+B6" }]
          ],
          checks: [
            { cell: "B4", expect: 240000, message: "B4: profit before tax", mustFormula: true },
            { cell: "B6", expect: -60000, message: "B6: tax at 25% of PBT (as a negative, matching the sign convention)", mustFormula: true },
            { cell: "B7", expect: 180000, message: "B7: profit after tax", mustFormula: true }
          ],
          success: "PAT " + R(p.pat) + " — the same " + R(p.pat) + " you put into retained earnings in the “Retained earnings” lesson, now derived rather than given. The course is starting to close its loops."
        }
      },
      { t: "where", h: "PAT is the <strong>income statement's</strong> final line. It flows into retained earnings on the <strong>balance sheet</strong> (bridge #1), and it's the starting line of the <strong>cash flow statement</strong> (see “CFO (indirect)”). No other number appears on all three statements so directly." },
      { t: "mcq", q: "The café is considering repaying its whole ₹5,50,000 loan next year. Ignoring everything else, what happens to the P&L?", opts: ["PAT falls by ₹5,50,000", "PAT rises because ₹55,000 of interest disappears — partly offset by more tax", "No change — repayment isn't a P&L item, and neither is interest", "PAT rises by exactly ₹55,000"], correct: 1, why: ["Repaying principal never hits the P&L (see “Borrowings”) — it's a balance sheet and cash flow event only.", "The repayment itself is invisible to the P&L, but the interest it eliminates is not: ₹55,000 less expense → PBT up ₹55,000 → tax up ₹13,750 at 25% → PAT up ₹41,250. Interest saved is never fully kept, because the taxman takes a share of any profit increase. This is the mirror image of the 'tax shield' on debt.", "The repayment isn't, but interest very much is an expense.", "Close, but it forgets tax. A pre-tax saving of ₹55,000 is worth ₹41,250 after 25% tax."] }
    ]
  };

  LS.lessons["1460-pl-capstone"] = {
    id: "1460-pl-capstone", code: "1460", minutes: 6,
    title: "Capstone: the full income statement",
    short: "★ The income statement",
    desc: "Assemble Bombay Bean's complete FY25 income statement from revenue to PAT — which must land on exactly ₹1,80,000.",
    lede: "Every line you've built in this module, in one statement. There's a hard target: profit after tax must come out at exactly ₹1,80,000, because that's the number already sitting inside the balance sheet you tied in the “Capstone: build the balance sheet” lesson. If it doesn't match, the two statements disagree — and one of them is wrong.",
    body: [
      { t: "p", h: "This is how professionals check themselves. You built the balance sheet first and it tied, using a PAT you were <em>given</em>. Now you're deriving that PAT independently from revenue and costs. If the two agree, both are almost certainly right. If they don't, you've found a real error." },
      { t: "formula", title: "The whole statement", lines: [
        "Revenue − COGS               = Gross profit",
        "Gross profit − Opex          = EBITDA",
        "EBITDA − Depreciation        = EBIT",
        "EBIT − Interest              = Profit before tax",
        "PBT − Tax                    = <b>Profit after tax</b>"
      ], note: "Costs are entered negative and every subtotal is a SUM — the convention from the “Opex & EBITDA” lesson." },
      { t: "example", h: "<p>Bombay Bean Coffee Co., year ended 31 March 2025. All the inputs are ones you've derived: revenue " + R(p.revenue) + " (1410), COGS " + R(p.cogs) + " (1420/1130), the four operating costs (1430), depreciation " + R(p.dep) + " (1440), interest " + R(p.interest) + " (1450/1220), tax at 25%.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Bombay Bean Coffee Co. — Income statement for the year ended 31 March 2025",
          hint: "Six formulas: gross profit (B5), total opex (B10), EBITDA (B11), EBIT (B13), PBT (B15), tax (B17) and PAT (B18). Use SUM over ranges wherever you're totalling.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Revenue", p.revenue],
            ["Cost of goods sold", -p.cogs],
            [null, null],
            ["GROSS PROFIT", { input: true, mf: true, fmt: "inr", ph: "=B2+B3" }],
            ["Rent", -p.rent],
            ["Salaries & wages", -p.salaries],
            ["Utilities", -p.utilities],
            ["Marketing", -p.marketing],
            ["Total operating expenses", { input: true, mf: true, fmt: "inr", ph: "=SUM(B6:B9)" }],
            ["EBITDA", { input: true, mf: true, fmt: "inr", ph: "=B5+B10" }],
            ["Depreciation", -p.dep],
            ["EBIT", { input: true, mf: true, fmt: "inr", ph: "=B11+B12" }],
            ["Interest expense", -p.interest],
            ["PROFIT BEFORE TAX", { input: true, mf: true, fmt: "inr", ph: "=B13+B14" }],
            ["Tax rate", { v: 0.25, fmt: "pct" }],
            ["Tax expense", { input: true, mf: true, fmt: "inr", ph: "=-B15*B16" }],
            ["PROFIT AFTER TAX", { input: true, mf: true, fmt: "inr", ph: "=B15+B17" }],
            [null, null],
            ["Check: PAT margin", { input: true, mf: true, fmt: "pct", ph: "=B18/B2" }]
          ],
          checks: [
            { cell: "B5", expect: 1560000, message: "B5: gross profit", mustFormula: true },
            { cell: "B10", expect: -1020000, message: "B10: total operating expenses via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B11", expect: 540000, message: "B11: EBITDA", mustFormula: true },
            { cell: "B13", expect: 300000, message: "B13: EBIT", mustFormula: true },
            { cell: "B15", expect: 240000, message: "B15: profit before tax", mustFormula: true },
            { cell: "B17", expect: -60000, message: "B17: tax expense at 25%", mustFormula: true },
            { cell: "B18", expect: 180000, message: "B18: PROFIT AFTER TAX — must be exactly ₹1,80,000", mustFormula: true, tol: 0 },
            { cell: "B20", expect: 0.075, message: "B20: PAT margin", mustFormula: true, tol: 0.001 },
            {
              custom: function (s) {
                var pat = s.value("B18");
                return pat === 180000 ? true : "Until PAT is exactly " + R(180000) + ", this statement contradicts the balance sheet you tied in the “Capstone: build the balance sheet” lesson.";
              },
              message: "PAT agrees with the retained earnings used in the “Retained earnings” lesson/1330"
            }
          ],
          success: "PAT " + R(p.pat) + ", a " + P(C.ratios.patPct) + " net margin — derived independently and matching the balance sheet exactly. Two statements built from opposite directions now agree."
        }
      },
      { t: "note", h: "Look at how the margins narrow down the statement: 65% gross → 22.5% EBITDA → 12.5% EBIT → 7.5% PAT. Of every ₹100 a customer spends, ₹7.50 ends up as the owner's profit. That funnel is the single most useful picture of a business's economics, and the “Margins” lesson turns it into ratios." },
      { t: "where", h: "This statement explains one line of the <strong>balance sheet</strong>: the " + R(p.pat) + " that grew retained earnings. It explains nothing about cash — the café earned " + R(p.pat) + " but its bank balance rose only " + R(C.fy25.cf.net) + ". Module 1500 explains that gap, and it's the last big idea in accounting." },
      { t: "mcq", q: "The café earned " + R(p.pat) + " of profit but its cash only rose " + R(C.fy25.cf.net) + ". Which of these best explains a gap like that?", opts: ["The profit calculation must be wrong", "Profit includes non-cash charges and ignores cash spent on assets, stock, and loan repayment", "The tax was paid twice", "Depreciation removed cash from the bank"], correct: 1, why: ["Both numbers are right — they measure different things. Learning to hold both in your head at once is the point of the “The cash flow statement” module.", "Several things drive a wedge: depreciation (₹2,40,000 of expense with no cash outflow, pushing cash <em>above</em> profit), and capex, higher inventory and receivables, loan repayment and the dividend (all real cash out that profit never sees). Netting to +₹40,000 of cash on ₹1,80,000 of profit is entirely normal for a growing business.", "Nothing was paid twice — the tax expense is a single 25% charge.", "Depreciation is precisely the expense that removes <em>no</em> cash. It's the biggest reason cash flow usually exceeds profit, not the reverse."] }
    ]
  };
})();
