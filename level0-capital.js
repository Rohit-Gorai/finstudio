/* ============================================================================
   LEVEL 0 · Finance Foundations — part 2 of 3
   Topics: assets · liabilities · equity · debt · interest · risk · return
   ========================================================================= */
(function (root, factory) {
  var list = factory();
  if (typeof module === "object" && module.exports) module.exports = list;
  else {
    root.FinLessons = root.FinLessons || {};
    list.forEach(function (l) { root.FinLessons[l.id] = l; });
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var INR = { type: "currency", currency: "inr" }, PCT = { type: "pct", dp: 1 }, NUM = { type: "number" };
  function f(cells, fmt) { var o = {}; cells.forEach(function (c) { o[c] = fmt; }); return o; }

  return [

  /* ==================================================================== */
  {
    id: "0090-assets",
    title: "Assets",
    covers: ["Assets"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["assets", "current", "non-current", "resources", "balance sheet"],
    summary: "The things a business controls that will bring it money later — and the order in which they turn back into cash.",
    prerequisites: ["0040-companies-and-capital"], relatedTopics: ["0100-liabilities", "0110-equity"],

    explanation: {
      short: "An asset is a resource the business controls, from a past event, expected to produce future economic benefit. In practice: things it owns that will earn or become cash.",
      beginner: "The espresso machine is an asset — it makes coffee that makes money. The beans on the shelf are an asset. The ₹2,00,000 an office customer owes is an asset. So is the cash itself. All of them are stores of future money in different forms.",
      intermediate: "Assets are split by how soon they turn into cash. Current assets — cash, receivables, inventory — are expected to convert within a year. Non-current assets — property, equipment, long leases — are held to be used rather than sold. That split is what makes liquidity ratios possible.",
      advanced: "Control matters more than legal ownership: a leased machine you direct the use of is your asset with a matching lease liability under Ind AS 116. And note what fails the definition — a brilliant team, a loyal customer base, a brand you built yourself. They produce future benefit but cannot be recognised, which is one reason book value and market value diverge so widely for service businesses."
    },

    formula: {
      display: "Total assets = Current assets + Non-current assets",
      variables: [
        { symbol: "Current", meaning: "Expected to become cash within twelve months" },
        { symbol: "Non-current", meaning: "Held for use over more than a year" }
      ]
    },

    example: {
      company: "Bombay Bean Coffee Co., 31 March 2025",
      rows: [["Cash", 100000], ["Trade receivables", 200000], ["Inventory", 150000],
             ["Security deposit", 100000], ["PP&E, net", 1400000], ["TOTAL ASSETS", 1950000]],
      walkthrough: "₹4,50,000 of it is current — cash, money owed by customers, and beans on the shelf. The remaining ₹15,00,000 is the deposit with the landlord and the fit-out and equipment. The café is asset-heavy in the way most physical retail is: most of its value is locked into things it uses rather than things it can quickly sell."
    },

    whyItMatters: "Assets are the left-hand side of every balance sheet you will ever read, and the denominator of return on assets — the ratio that asks whether a business is using what it owns productively.",

    commonMistakes: [
      { mistake: "Counting an asset at what you could sell it for.", why: "Most assets sit at cost less depreciation, not market value. A ten-year-old fit-out on the books at ₹2,00,000 might fetch nothing." },
      { mistake: "Treating your team or brand as an asset on the balance sheet.", why: "Real sources of value, but internally generated intangibles cannot be recognised. This is why a software company's book value looks absurdly small." },
      { mistake: "Assuming more assets is better.", why: "Assets must be funded. Idle assets earn nothing and still cost capital." }
    ],

    realWorld: [
      { field: "Credit", use: "Lenders take security over specific assets and want to know what they would realise." },
      { field: "Equity research", use: "Return on assets separates efficient operators from asset hoarders." },
      { field: "Private equity", use: "Asset-heavy businesses can borrow more; asset-light ones must borrow against cash flow." }
    ],

    practice: [
      { id: "a1", tier: "beginner", type: "match",
        prompt: "Current asset or non-current?",
        pairs: [
          { left: "Cash at bank", right: "Current" }, { left: "Espresso machine", right: "Non-current" },
          { left: "Coffee beans in stock", right: "Current" }, { left: "Shop fit-out", right: "Non-current" },
          { left: "Money owed by an office client", right: "Current" }, { left: "Five-year security deposit", right: "Non-current" }
        ] },
      { id: "a2", tier: "practical", type: "numeric",
        prompt: "Cash ₹1,00,000, receivables ₹2,00,000, inventory ₹1,50,000. What are total current assets, in ₹?",
        expect: 450000, tol: 1,
        hints: ["Add everything expected to become cash within a year.", "1,00,000 + 2,00,000 + 1,50,000."],
        solution: "₹4,50,000." },
      { id: "a3", tier: "application", type: "mcq",
        prompt: "The café's barista is its best employee and brings in regular customers. Is she an asset on the balance sheet?",
        options: [
          { text: "Yes — she produces future economic benefit", correct: false, why: "She does produce future benefit, but that is only one part of the test." },
          { text: "No — the business does not control her and she was not acquired", correct: true, why: "Right. She can resign tomorrow, so there is no control, and no past transaction gave rise to a measurable cost. Real value, unrecognisable asset." },
          { text: "Yes, at the value of her annual salary", correct: false, why: "Salary is a cost of employing her, not a measure of an asset." },
          { text: "Only if she signs a long contract", correct: false, why: "Even then, employment contracts do not create a balance sheet asset." }
        ] },
      { id: "a4", tier: "challenge", type: "interpretation",
        prompt: "A software company reports total assets of ₹50 Cr but trades at ₹2,000 Cr. Explain the gap without saying the market is wrong.",
        keywords: [["intangible", "brand", "software", "code", "team", "internally generated", "not recognised", "cannot be recognised"], ["future", "cash flow", "earnings", "value", "market"]],
        hints: ["What does a software company own that a factory does not?", "Which of those things is allowed onto a balance sheet?"],
        solution: "Its value is in internally generated intangibles — the codebase, the brand, the customer relationships, the team — none of which accounting permits it to recognise. The balance sheet records the cost of what was bought; the market prices the cash it expects to be produced. For asset-light businesses those two numbers have almost nothing to do with each other."
      } ],

    sandbox: {
      title: "Total the café's assets",
      instructions: "Split the assets into current and non-current, total each, then total everything and work out what share is current.",
      sheets: [{
        name: "Assets",
        cells: {
          A1: "CURRENT ASSETS", B1: "₹",
          A2: "Cash at bank", B2: "100000",
          A3: "Trade receivables", B3: "200000",
          A4: "Inventory", B4: "150000",
          A5: "Total current assets", B5: "",
          A7: "NON-CURRENT ASSETS",
          A8: "Security deposit", B8: "100000",
          A9: "PP&E, net", B9: "1400000",
          A10: "Total non-current assets", B10: "",
          A12: "TOTAL ASSETS", B12: "",
          A13: "Current assets as a share of the total", B13: ""
        },
        editable: ["B5", "B10", "B12", "B13"],
        formats: Object.assign(f(["B2", "B3", "B4", "B5", "B8", "B9", "B10", "B12"], INR), { B13: PCT })
      }],
      checks: [
        { cell: "B5", sheet: "Assets", expect: 450000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Current assets via SUM" },
        { cell: "B10", sheet: "Assets", expect: 1500000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Non-current assets via SUM" },
        { cell: "B12", sheet: "Assets", expect: 1950000, tol: 1, mustFormula: true, mustReference: ["B5", "B10"], label: "Total assets" },
        { cell: "B13", sheet: "Assets", expect: 0.2308, tol: 0.002, mustFormula: true, mustReference: ["B5", "B12"], label: "Current share" }
      ],
      solution: { Assets: { B5: "=SUM(B2:B4)", B10: "=SUM(B8:B9)", B12: "=B5+B10", B13: "=B5/B12" } },
      cellHints: { B12: { whatGoesHere: "Total assets", hint: "Add the two subtotals, not all seven lines — otherwise you count them twice.", pattern: "=current + non-current" } },
      success: "₹19,50,000, of which only 23% is current. This is a business with its money locked in equipment — remember that when Level 3 asks whether it can pay its bills."
    },

    challenge: {
      id: "a-c1", type: "debug",
      prompt: "A version of this sheet totals ₹39,00,000 instead of ₹19,50,000 — exactly double. B5 and B10 are both correct. Which cell is wrong?",
      brokenCell: "B12",
      nearMiss: ["B13"],
      nearMissWhy: "B13 is wrong too, but only because it divides by a total that is already wrong.",
      hints: ["Exactly double is a strong clue.", "What if the total added the subtotals AND the lines inside them?", "=SUM(B2:B10) would count everything twice."],
      solution: "B12 reads =SUM(B2:B10), which adds the five individual assets and then the two subtotals as well. Double-counting a subtotal is the most common spreadsheet error in finance, and 'exactly double' or 'exactly one line too big' is usually how you spot it."
    },

    takeaways: [
      "An asset is a controlled resource expected to produce future benefit",
      "Current assets convert to cash within a year; non-current are held for use",
      "Book value is cost less depreciation, not what you would get for it",
      "Some of the most valuable things a business has cannot be recognised at all"
    ]
  },

  /* ==================================================================== */
  {
    id: "0100-liabilities",
    title: "Liabilities",
    covers: ["Liabilities"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["liabilities", "payables", "debt", "obligations", "current"],
    summary: "What the business owes to everyone who is not its owner — and when they can demand it.",
    prerequisites: ["0090-assets"], relatedTopics: ["0110-equity", "0120-debt"],

    explanation: {
      short: "A liability is a present obligation arising from a past event that will require an outflow of resources. Plainly: money the business must pay somebody, because of something it already did.",
      beginner: "The café took ₹1,20,000 of beans on 30-day credit — it owes the supplier. It owes the staff last month's salaries. It owes the bank ₹5,50,000. Each is a claim on the business by someone outside it, and each has a date attached.",
      intermediate: "Current liabilities are due within a year; non-current after. The distinction is about timing pressure, not size. A ₹50 lakh loan due in five years is far less threatening than ₹8 lakh of payables due next week, and the current/non-current split is what makes that visible.",
      advanced: "Not all obligations are equally certain. Provisions are liabilities of uncertain timing or amount; contingent liabilities — a lawsuit that might be lost — are disclosed but not recognised until probable and measurable. Deferred revenue is the counter-intuitive one: cash received for undelivered service is a liability, because you owe the service."
    },

    example: {
      company: "Bombay Bean Coffee Co., 31 March 2025",
      rows: [["Trade payables", 120000], ["Salaries payable", 30000], ["Term loan", 550000], ["TOTAL LIABILITIES", 700000]],
      walkthrough: "₹1,50,000 is due within the year — suppliers and staff. The ₹5,50,000 term loan runs longer. Against ₹4,50,000 of current assets, the ₹1,50,000 of current liabilities is comfortable. Note that the supplier credit is effectively an interest-free loan the café is receiving simply by paying in 30 days rather than on delivery."
    },

    whyItMatters: "Liabilities are what force a business to keep cash available. Every insolvency is ultimately a liability falling due with nothing there to meet it — profitability is not what saves you at that moment.",

    commonMistakes: [
      { mistake: "Treating all liabilities as bad.", why: "Supplier credit is free financing. A liability is only dangerous relative to your ability to meet it when it falls due." },
      { mistake: "Recording a customer's advance as revenue.", why: "It is deferred revenue — a liability. You owe them the goods." },
      { mistake: "Ignoring the current/non-current split.", why: "Total liabilities tell you the size of the claims; the split tells you when they bite." }
    ],

    realWorld: [
      { field: "Credit analysis", use: "Maturity profile — what falls due when — is the core of any refinancing risk assessment." },
      { field: "Working capital management", use: "Stretching payables is one of the three levers on the cash conversion cycle." },
      { field: "Audit", use: "Unrecorded liabilities are a standard search procedure, because omitting them flatters everything." }
    ],

    practice: [
      { id: "l1", tier: "beginner", type: "match",
        prompt: "Current liability or non-current?",
        pairs: [
          { left: "Supplier invoice due in 30 days", right: "Current" },
          { left: "Five-year bank term loan", right: "Non-current" },
          { left: "Last month's unpaid salaries", right: "Current" },
          { left: "Loan instalment due next month", right: "Current" }
        ] },
      { id: "l2", tier: "practical", type: "numeric",
        prompt: "Payables ₹1,20,000, salaries payable ₹30,000, term loan ₹5,50,000. What are total liabilities, in ₹?",
        expect: 700000, tol: 1,
        hints: ["Everything owed to anyone who is not the owner.", "1,20,000 + 30,000 + 5,50,000."],
        solution: "₹7,00,000." },
      { id: "l3", tier: "application", type: "mcq",
        prompt: "A customer pays ₹50,000 in advance for coffee to be delivered next month. What does the café record?",
        options: [
          { text: "₹50,000 of revenue", correct: false, why: "Nothing has been delivered. Cash arriving is not the test for revenue." },
          { text: "₹50,000 of cash and ₹50,000 of liability", correct: true, why: "Correct. Cash goes up and so does deferred revenue — the café owes a month of coffee. It becomes revenue as the coffee is delivered." },
          { text: "₹50,000 of cash and ₹50,000 of equity", correct: false, why: "Nothing was earned and no owner put money in. The customer is a creditor, not an owner." },
          { text: "Nothing until delivery", correct: false, why: "The cash is real and must be recorded — along with the obligation that came with it." }
        ] },
      { id: "l4", tier: "challenge", type: "scenario",
        prompt: "The café negotiates 60-day supplier terms instead of 30. Over the following months:",
        rows: [
          { label: "Trade payables", answer: "up" },
          { label: "Cash held", answer: "up" },
          { label: "Total liabilities", answer: "up" },
          { label: "Profit", answer: "none" },
          { label: "Interest cost", answer: "none" }
        ],
        hints: ["Paying later means holding money longer.", "Does the cost of the beans change?", "Is supplier credit charged interest?"],
        solution: "Payables and cash both rise — the supplier is now funding more of the business. Total liabilities rise, but profit is untouched because the beans cost the same, and there is no interest on trade credit. This is free financing, and it is why working capital management is a real lever rather than an accounting detail."
      } ],

    sandbox: {
      title: "The café's obligations",
      instructions: "Total the current and non-current liabilities, then the whole lot, then check the current ones against the ₹4,50,000 of current assets.",
      sheets: [{
        name: "Liabilities",
        cells: {
          A1: "CURRENT LIABILITIES", B1: "₹",
          A2: "Trade payables", B2: "120000",
          A3: "Salaries payable", B3: "30000",
          A4: "Total current liabilities", B4: "",
          A6: "NON-CURRENT LIABILITIES",
          A7: "Term loan", B7: "550000",
          A8: "Total non-current liabilities", B8: "",
          A10: "TOTAL LIABILITIES", B10: "",
          A12: "Current assets (from the last lesson)", B12: "450000",
          A13: "Cover: current assets ÷ current liabilities", B13: "",
          A14: "Spare cash after paying everything due this year", B14: ""
        },
        editable: ["B4", "B8", "B10", "B13", "B14"],
        formats: Object.assign(f(["B2", "B3", "B4", "B7", "B8", "B10", "B12", "B14"], INR), { B13: { type: "x", dp: 1 } })
      }],
      checks: [
        { cell: "B4", sheet: "Liabilities", expect: 150000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Current liabilities via SUM" },
        { cell: "B10", sheet: "Liabilities", expect: 700000, tol: 1, mustFormula: true, mustReference: ["B4", "B8"], label: "Total liabilities" },
        { cell: "B13", sheet: "Liabilities", expect: 3, tol: 0.05, mustFormula: true, mustReference: ["B12", "B4"], label: "Cover" },
        { cell: "B14", sheet: "Liabilities", expect: 300000, tol: 1, mustFormula: true, mustReference: ["B12", "B4"], label: "Spare" }
      ],
      solution: { Liabilities: { B4: "=SUM(B2:B3)", B8: "=B7", B10: "=B4+B8", B13: "=B12/B4", B14: "=B12-B4" } },
      cellHints: { B13: { whatGoesHere: "Cover", hint: "How many times the current assets would cover what is due this year.", pattern: "=current assets ÷ current liabilities" } },
      success: "3.0x cover and ₹3,00,000 spare. You have just computed the current ratio — Level 3 gives it a name and a warning about reading it alone."
    },

    challenge: {
      id: "l-c1", type: "numeric",
      prompt: "Suppliers tighten terms and demand payment in 10 days instead of 30, so payables fall to ₹40,000 — and the café had to pay ₹80,000 of cash out to get there. What is the cover ratio now?",
      expect: 5.29, tol: 0.2,
      hints: ["Both sides move: liabilities fall, and so does cash.", "New current liabilities = 40,000 + 30,000 = 70,000.", "New current assets = 4,50,000 − 80,000 = 3,70,000."],
      solution: "Current liabilities fall to ₹70,000. But paying suppliers ₹80,000 sooner also drains cash, so current assets fall to ₹3,70,000: the cover is ₹3,70,000 ÷ ₹70,000 = 5.3x. The ratio improved while the cash position got worse — which is exactly why a liquidity ratio is never read without the balance sheet behind it."
    },

    takeaways: [
      "A liability is a present obligation from a past event",
      "Current versus non-current is about timing pressure, not size",
      "Money received before delivery is a liability, not revenue",
      "Supplier credit is genuine, interest-free financing"
    ]
  },

  /* ==================================================================== */
  {
    id: "0110-equity",
    title: "Equity",
    covers: ["Equity"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["equity", "ownership", "retained earnings", "share capital", "net worth"],
    summary: "What is left for the owners once everyone else has been paid — the residual, and the reason the balance sheet balances.",
    prerequisites: ["0090-assets", "0100-liabilities"], relatedTopics: ["0120-debt"],

    explanation: {
      short: "Equity is assets minus liabilities. It is not money set aside; it is the arithmetic leftover that belongs to the owners.",
      beginner: "The café owns ₹19,50,000 of things and owes ₹7,00,000. If it sold everything at book value and paid everyone, ₹12,50,000 would be left for Priya. That is equity. It is a residual — you cannot point at it in the shop.",
      intermediate: "It has two main sources. Share capital is what owners paid in. Retained earnings is profit the business made and did not distribute. That second component is the bridge between the income statement and the balance sheet: this year's profit, less dividends, becomes this year's addition to equity.",
      advanced: "Because equity is the residual, it absorbs all volatility. A 10% fall in asset values with liabilities fixed does not reduce equity by 10% — in the café's case it wipes out ₹1,95,000, or 15.6% of the equity. That amplification is financial leverage, and it is the same mechanism whether it works for you or against you."
    },

    formula: {
      display: "Equity = Assets − Liabilities",
      alternate: "Closing equity = Opening equity + Profit − Dividends + New capital",
      variables: [
        { symbol: "Share capital", meaning: "What owners put in" },
        { symbol: "Retained earnings", meaning: "Profit kept in the business rather than paid out" }
      ]
    },

    example: {
      company: "Bombay Bean Coffee Co., 31 March 2025",
      rows: [["Total assets", 1950000], ["Total liabilities", -700000], ["EQUITY", 1250000],
             ["  of which share capital", 1000000], ["  of which retained earnings", 250000]],
      walkthrough: "Priya put in ₹10,00,000. The business has since retained ₹2,50,000 of profit — opening ₹1,20,000 plus this year's ₹1,80,000 less a ₹50,000 dividend. Total equity ₹12,50,000, which is exactly ₹19,50,000 of assets less ₹7,00,000 of liabilities. It has to be, because that is what the word means."
    },

    whyItMatters: "Equity is what you own when you buy a share, what gets wiped out first in a failure, and the denominator of return on equity — the ratio owners actually care about.",

    commonMistakes: [
      { mistake: "Thinking equity is cash.", why: "The café has ₹12,50,000 of equity and ₹1,00,000 of cash. Equity is a claim, not a pile of money." },
      { mistake: "Confusing book equity with market value.", why: "Book equity is a historical-cost residual. Market value is what people will pay for the future. They rarely match." },
      { mistake: "Forgetting dividends in retained earnings.", why: "Retained earnings is profit *retained*. Anything paid out is not." }
    ],

    realWorld: [
      { field: "Investing", use: "Price-to-book compares what the market pays to what the accounts say the residual is worth." },
      { field: "Banking", use: "Regulatory capital is essentially a rule about how thick the equity cushion must be." },
      { field: "Startups", use: "Every funding round divides this residual differently between founders and investors." }
    ],

    practice: [
      { id: "e1", tier: "beginner", type: "numeric",
        prompt: "Assets ₹19,50,000, liabilities ₹7,00,000. What is equity, in ₹?",
        expect: 1250000, tol: 1,
        hints: ["Equity is what is left over.", "19,50,000 − 7,00,000."],
        solution: "₹12,50,000." },
      { id: "e2", tier: "practical", type: "numeric",
        prompt: "Opening retained earnings ₹1,20,000, profit ₹1,80,000, dividend ₹50,000. What is closing retained earnings, in ₹?",
        expect: 250000, tol: 1,
        hints: ["Profit adds; dividends take away.", "1,20,000 + 1,80,000 − 50,000."],
        solution: "₹2,50,000." },
      { id: "e3", tier: "application", type: "scenario",
        prompt: "The café pays a ₹50,000 dividend. Immediately:",
        rows: [
          { label: "Cash", answer: "down" }, { label: "Retained earnings", answer: "down" },
          { label: "Total assets", answer: "down" }, { label: "Total liabilities", answer: "none" },
          { label: "Profit for the year", answer: "none" }
        ],
        hints: ["A dividend is a distribution of profit, not a cost of earning it.", "Both sides of the balance sheet shrink."],
        solution: "Cash and retained earnings both fall ₹50,000, so assets and equity shrink together and the sheet still balances. Profit is untouched — a dividend is never an expense, which is why it appears in the equity roll-forward and not the income statement." },
      { id: "e4", tier: "challenge", type: "interpretation",
        prompt: "The café's assets fall 10% in value while liabilities stay at ₹7,00,000. Equity falls by far more than 10%. Explain why, and name the effect.",
        keywords: [["leverage", "gearing", "geared", "amplif", "magnif", "residual"], ["liabilit", "debt", "fixed", "unchanged", "does not fall"]],
        hints: ["Work out the new equity: assets ₹17,55,000 less ₹7,00,000.", "Compare the percentage fall in assets with the percentage fall in equity.", "Equity absorbs the whole loss because liabilities do not move."],
        solution: "Assets fall ₹1,95,000 to ₹17,55,000; liabilities are unchanged, so equity falls from ₹12,50,000 to ₹10,55,000 — a drop of 15.6% from a 10% asset fall. Equity is the residual, so it absorbs the entire movement. That amplification is financial leverage, and the more debt in the structure the more violent it becomes."
      } ],

    sandbox: {
      title: "Build the café's equity two ways",
      instructions: "Compute equity as the residual in B4, then build it up from its components in B10 — and check the two agree.",
      sheets: [{
        name: "Equity",
        cells: {
          A1: "AS A RESIDUAL", B1: "₹",
          A2: "Total assets", B2: "1950000",
          A3: "Total liabilities", B3: "-700000",
          A4: "Equity", B4: "",
          A6: "FROM ITS COMPONENTS",
          A7: "Share capital", B7: "1000000",
          A8: "Opening retained earnings", B8: "120000",
          A9: "Profit for the year", B9: "180000",
          A10: "Dividend paid", B10: "-50000",
          A11: "Equity", B11: "",
          A13: "Check: the two must agree", B13: ""
        },
        editable: ["B4", "B11", "B13"],
        formats: f(["B2", "B3", "B4", "B7", "B8", "B9", "B10", "B11", "B13"], INR)
      }],
      checks: [
        { cell: "B4", sheet: "Equity", expect: 1250000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Equity as a residual" },
        { cell: "B11", sheet: "Equity", expect: 1250000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Equity from components via SUM" },
        { cell: "B13", sheet: "Equity", expect: 0, tol: 0.5, mustFormula: true, mustReference: ["B4", "B11"], label: "The check must be zero" }
      ],
      solution: { Equity: { B4: "=B2+B3", B11: "=SUM(B7:B10)", B13: "=B4-B11" } },
      cellHints: { B13: { whatGoesHere: "The check", hint: "Two routes to the same number. The difference should be nothing.", pattern: "=residual − components" } },
      success: "₹12,50,000 both ways, difference zero. When two independent routes agree, you have evidence rather than an answer — this is the habit the balance sheet capstone is built on."
    },

    challenge: {
      id: "e-c1", type: "numeric",
      prompt: "Assets fall 10% to ₹17,55,000 with liabilities unchanged at ₹7,00,000. By what percentage does equity fall?",
      expect: 0.156, tol: 0.005,
      hints: ["New equity first.", "17,55,000 − 7,00,000 = 10,55,000.", "(12,50,000 − 10,55,000) ÷ 12,50,000."],
      solution: "Equity falls to ₹10,55,000, a drop of ₹1,95,000 or 15.6%. A 10% asset move became a 15.6% equity move because liabilities are fixed. Multiply the debt and you multiply the effect — that is the entire mechanism behind an LBO, and behind most financial distress."
    },

    takeaways: [
      "Equity is the residual: assets less liabilities",
      "It comes from capital put in and profit kept in",
      "Dividends reduce equity but are never an expense",
      "Because it is the residual, equity absorbs all volatility — that is leverage"
    ]
  },

  /* ==================================================================== */
  {
    id: "0120-debt",
    title: "Debt",
    covers: ["Debt"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["debt", "loan", "principal", "interest", "amortisation", "leverage"],
    summary: "Borrowed money: a promise of fixed amounts on fixed dates, ranking ahead of the owner and indifferent to how business is going.",
    prerequisites: ["0110-equity"], relatedTopics: ["0130-interest"],

    explanation: {
      short: "Debt is capital supplied under a contract. The lender gets interest and principal back on a schedule, gets paid before owners, and gets no share of the upside.",
      beginner: "Priya borrowed ₹6,00,000 from the bank. Every month the café pays some interest — the fee for using the money — and some principal, which reduces what is still owed. By March 2025 the balance is down to ₹5,50,000. The bank does not care whether the café had a good year; the payment is the payment.",
      intermediate: "Two components behave completely differently. Interest is a cost and appears on the income statement, reducing profit and therefore tax. Principal repayment is a return of capital: it never touches the income statement, only cash and the balance sheet. Confusing them is one of the most common errors in early modelling.",
      advanced: "Debt is cheaper than equity for two reasons: the lender bears less risk, and interest is tax-deductible, so the effective cost is the rate times (1 − tax rate). Against that sits financial distress — fixed obligations that must be met from variable cash flows. The optimal capital structure is where the tax shield stops being worth the added fragility."
    },

    formula: {
      display: "Closing debt = Opening debt + New borrowing − Repayments",
      alternate: "After-tax cost of debt = Interest rate × (1 − tax rate)",
      note: "Interest is an expense. Principal repayment is not."
    },

    example: {
      company: "Bombay Bean Coffee Co.",
      walkthrough: "₹6,00,000 borrowed at 10%. During FY25 the café paid ₹60,000 of interest and repaid ₹50,000 of principal, leaving ₹5,50,000 outstanding. The ₹60,000 reduced profit and saved ₹15,000 of tax at 25%, so the real cost of the borrowing was ₹45,000 — an effective rate of 7.5%, not 10%."
    },

    whyItMatters: "Debt is the cheapest capital available and the fastest route to insolvency. Every leveraged buyout, every mortgage and every corporate default is an argument about where the line between those two facts sits.",

    commonMistakes: [
      { mistake: "Treating principal repayment as an expense.", why: "It reduces cash and reduces the loan. It never reaches the income statement. Only interest is a cost." },
      { mistake: "Comparing debt at its headline rate with equity.", why: "Interest is deductible, so 10% debt at a 25% tax rate really costs 7.5%. That gap is the tax shield." },
      { mistake: "Thinking low debt is automatically prudent.", why: "Equity is more expensive. A business with no debt may be leaving returns on the table — the question is always whether the cash flows are stable enough to carry it." }
    ],

    realWorld: [
      { field: "Private equity", use: "The entire model is buying with debt so that equity returns are amplified." },
      { field: "Credit", use: "Covenants cap debt as a multiple of EBITDA precisely because cash flow, not assets, services debt." },
      { field: "Corporate finance", use: "The debt-versus-equity decision is one of the three questions corporate finance exists to answer." }
    ],

    practice: [
      { id: "d1", tier: "beginner", type: "numeric",
        prompt: "Opening loan ₹6,00,000, repaid ₹50,000 during the year. What is the closing balance, in ₹?",
        expect: 550000, tol: 1,
        hints: ["Repayment reduces what is owed.", "6,00,000 − 50,000."],
        solution: "₹5,50,000." },
      { id: "d2", tier: "practical", type: "numeric",
        prompt: "Interest of ₹60,000 at a 25% tax rate. What is the after-tax cost of that interest, in ₹?",
        expect: 45000, tol: 1,
        hints: ["Interest reduces taxable profit, so it saves tax.", "The saving is 25% of the interest.", "60,000 × (1 − 0.25)."],
        solution: "₹60,000 × 0.75 = ₹45,000. The government funds ₹15,000 of the interest bill." },
      { id: "d3", tier: "application", type: "scenario",
        prompt: "The café repays ₹50,000 of principal. In that month:",
        rows: [
          { label: "Cash", answer: "down" }, { label: "Loan outstanding", answer: "down" },
          { label: "Profit", answer: "none" }, { label: "Equity", answer: "none" },
          { label: "Total assets", answer: "down" }
        ],
        hints: ["Principal repayment is a balance sheet event.", "Does anything appear on the income statement?"],
        solution: "Cash and the loan both fall ₹50,000 — assets and liabilities shrink together, equity unchanged, and the sheet still balances. Nothing reaches the income statement, so profit is untouched. Only the interest portion of a payment is ever an expense." },
      { id: "d4", tier: "challenge", type: "interpretation",
        prompt: "Two identical cafés earn ₹3,00,000 of operating profit. One is all-equity funded with ₹16,00,000; the other has ₹10,00,000 equity and ₹6,00,000 of 10% debt. Which gives the owner a better return, and what is the catch?",
        keywords: [["leverage", "higher return", "roe", "better", "amplif", "more"], ["risk", "fixed", "must pay", "downturn", "fragile", "distress", "bad year"]],
        hints: [
          "Work out profit to the owner in each case, then divide by the equity they put in.",
          "The geared café pays ₹60,000 interest, leaving ₹2,40,000 on ₹10,00,000 of equity.",
          "Now imagine operating profit falls to ₹60,000."
        ],
        solution: "All-equity: ₹3,00,000 on ₹16,00,000 = 18.8%. Geared: ₹2,40,000 on ₹10,00,000 = 24%. Leverage improves the owner's return whenever the business earns more than the interest rate. The catch is that ₹60,000 of interest is due regardless — if operating profit falls to ₹60,000 the geared café earns nothing for its owner while the ungeared one still earns 3.75%. Leverage magnifies both directions."
      } ],

    sandbox: {
      title: "The loan schedule",
      instructions: "Build one year of the loan: interest for the year, closing balance, and the true after-tax cost of the borrowing.",
      sheets: [{
        name: "Debt",
        cells: {
          A1: "THE LOAN", B1: "₹",
          A2: "Opening balance", B2: "600000",
          A3: "Interest rate", B3: "0.10",
          A4: "Tax rate", B4: "0.25",
          A6: "Interest for the year", B6: "",
          A7: "Principal repaid", B7: "-50000",
          A8: "Closing balance", B8: "",
          A10: "Tax saved by the interest", B10: "",
          A11: "After-tax cost of the interest", B11: "",
          A12: "Effective interest rate", B12: "",
          A14: "Total cash paid to the bank this year", B14: ""
        },
        editable: ["B6", "B8", "B10", "B11", "B12", "B14"],
        formats: Object.assign(f(["B2", "B6", "B7", "B8", "B10", "B11", "B14"], INR), { B3: PCT, B4: PCT, B12: PCT })
      }],
      checks: [
        { cell: "B6", sheet: "Debt", expect: 60000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Interest for the year" },
        { cell: "B8", sheet: "Debt", expect: 550000, tol: 1, mustFormula: true, mustReference: ["B2", "B7"], label: "Closing balance" },
        { cell: "B10", sheet: "Debt", expect: 15000, tol: 1, mustFormula: true, mustReference: ["B6", "B4"], label: "Tax saved" },
        { cell: "B11", sheet: "Debt", expect: 45000, tol: 1, mustFormula: true, mustReference: ["B6", "B10"], label: "After-tax cost" },
        { cell: "B12", sheet: "Debt", expect: 0.075, tol: 0.002, mustFormula: true, mustReference: ["B11", "B2"], label: "Effective rate" },
        { cell: "B14", sheet: "Debt", expect: 110000, tol: 1, mustFormula: true, mustReference: ["B6", "B7"], label: "Cash to the bank" }
      ],
      solution: {
        Debt: { B6: "=B2*B3", B8: "=B2+B7", B10: "=B6*B4", B11: "=B6-B10", B12: "=B11/B2", B14: "=B6-B7" }
      },
      cellHints: {
        B8: { whatGoesHere: "Closing balance", hint: "The repayment is stored negative, so add it.", pattern: "=opening + repayment" },
        B14: { whatGoesHere: "Cash to the bank", hint: "Interest plus principal — the repayment is negative, so subtract it.", pattern: "=interest − repayment" }
      },
      success: "10% on paper, 7.5% after tax, and ₹1,10,000 of cash out the door of which only ₹60,000 was ever a cost. That distinction is what the debt schedule in Level 4 is built on."
    },

    challenge: {
      id: "d-c1", type: "numeric",
      prompt: "Two identical cafés earn ₹3,00,000 operating profit. Café A: ₹16,00,000 all equity. Café B: ₹10,00,000 equity and ₹6,00,000 of 10% debt. What is B's return on equity, as a percentage? Ignore tax.",
      expect: 0.24, tol: 0.005,
      hints: ["B pays interest first.", "3,00,000 − 60,000 = 2,40,000 for the owner.", "2,40,000 ÷ 10,00,000."],
      solution: "24%, against A's 18.8%. The business is identical; only the funding differs. Leverage lifted the owner's return by 5.2 points — and would have destroyed it entirely had operating profit fallen below ₹60,000."
    },

    takeaways: [
      "Debt is a contract: fixed amounts, fixed dates, paid before owners",
      "Interest is an expense; principal repayment is not",
      "Tax deductibility makes debt cheaper than its headline rate",
      "Leverage lifts owner returns when things go well and destroys them when they do not"
    ]
  },

  /* ==================================================================== */
  {
    id: "0130-interest",
    title: "Interest",
    covers: ["Interest"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["interest", "simple", "compound", "rate", "principal"],
    summary: "The price of using someone else's money for a period of time — and what happens when it starts earning interest of its own.",
    prerequisites: ["0120-debt"], relatedTopics: ["0170-compounding", "0160-time-value"],

    explanation: {
      short: "Interest is rent on money. Simple interest is charged only on the original amount; compound interest is charged on the amount plus all interest already added.",
      beginner: "Borrow ₹1,00,000 at 10% and after a year you owe ₹1,10,000. Leave it another year. Under simple interest you owe ₹1,20,000 — another ₹10,000. Under compound interest you owe ₹1,21,000, because the second year's interest is charged on ₹1,10,000, not ₹1,00,000. That extra ₹1,000 is interest on interest, and over long periods it dominates everything else.",
      intermediate: "The rate is always for a period, and the period must match. A 12% annual rate applied monthly is 1% a month. Compounding monthly rather than annually raises the effective annual rate above the stated one — 12% nominal compounded monthly is 12.68% effective.",
      advanced: "Interest rates carry structure: a real rate for deferring consumption, expected inflation, and premiums for credit and liquidity risk. A central bank policy rate moves the short end; expectations and term premia shape the rest of the curve. Every discount rate you will apply in valuation is built from these pieces."
    },

    formula: {
      display: "Simple interest = Principal × Rate × Periods",
      alternate: "Compound: Amount = Principal × (1 + Rate)^Periods",
      variables: [
        { symbol: "Principal", meaning: "The amount borrowed or invested" },
        { symbol: "Rate", meaning: "Per period, matching the periods counted" }
      ]
    },

    visualization: {
      type: "line", title: "Simple against compound", interactive: true,
      controls: [
        { label: "Principal", key: "p", min: 10000, max: 500000, step: 10000, value: 100000, fmt: "inr" },
        { label: "Rate", key: "r", min: 0.02, max: 0.20, step: 0.01, value: 0.10, fmt: "pct" },
        { label: "Years", key: "n", min: 1, max: 30, step: 1, value: 10 }
      ],
      series: [{ label: "Simple", derive: "p*(1+r*t)" }, { label: "Compound", derive: "p*(1+r)^t" }]
    },

    example: {
      company: "₹1,00,000 at 10%",
      rows: [["After 1 year — simple", 110000], ["After 1 year — compound", 110000],
             ["After 5 years — simple", 150000], ["After 5 years — compound", 161051],
             ["After 20 years — simple", 300000], ["After 20 years — compound", 672750]],
      walkthrough: "Identical after one year. After five, compounding is ₹11,051 ahead. After twenty, it is more than double the simple result. Nothing about the rate changed — only how many times the interest was allowed to earn interest."
    },

    whyItMatters: "Interest is the mechanism behind every loan you will take, every deposit you hold, and — inverted — the discounting that underpins all of valuation. Present value is just this formula run backwards.",

    commonMistakes: [
      { mistake: "Mismatching the rate and the period.", why: "A 12% annual rate is not 12% a month. Divide by twelve before applying it monthly." },
      { mistake: "Assuming a stated rate is the effective rate.", why: "12% compounded monthly is 12.68% a year. Loan comparisons must be made on the effective rate." },
      { mistake: "Underestimating long horizons.", why: "Human intuition about compounding is linear and badly wrong. Twenty years at 10% multiplies money by 6.7x, not 3x." }
    ],

    realWorld: [
      { field: "Personal finance", use: "The difference between a credit card at 36% and a home loan at 9% is entirely this arithmetic." },
      { field: "Corporate finance", use: "The interest expense line, and the coverage ratios lenders write into covenants." },
      { field: "Valuation", use: "Discounting is compounding run in reverse — the same formula, divided instead of multiplied." }
    ],

    practice: [
      { id: "i1", tier: "beginner", type: "numeric",
        prompt: "₹1,00,000 at 10% simple interest for 3 years. What is the total interest, in ₹?",
        expect: 30000, tol: 1,
        hints: ["Simple interest charges only on the original amount.", "1,00,000 × 0.10 × 3."],
        solution: "₹30,000 — ₹10,000 a year, three times." },
      { id: "i2", tier: "practical", type: "numeric",
        prompt: "₹1,00,000 at 10% compounded annually for 3 years. What is the final amount, in ₹?",
        expect: 133100, tol: 5,
        hints: ["Each year multiplies by 1.10.", "1,00,000 × 1.10 × 1.10 × 1.10.", "1,00,000 × 1.1^3."],
        solution: "₹1,33,100 — ₹3,100 more than simple interest, and the gap widens every year." },
      { id: "i3", tier: "application", type: "numeric",
        prompt: "A card charges 3% a month. What is the effective annual rate, as a percentage?",
        expect: 0.4258, tol: 0.01,
        hints: ["Twelve months of compounding, not twelve times 3%.", "1.03 raised to the power of 12, less 1."],
        solution: "1.03^12 − 1 = 42.6%, not the 36% the '3% a month' suggests. This gap is exactly why effective rates are legally required in lending disclosures." },
      { id: "i4", tier: "challenge", type: "interpretation",
        prompt: "Two loans: 12% compounded annually, or 11.8% compounded monthly. Which costs more, and why is the answer not obvious?",
        keywords: [["monthly", "compound", "more often", "frequency", "effective"], ["11.8", "12.46", "higher", "more", "second", "monthly one"]],
        hints: ["Convert both to an effective annual rate before comparing.", "Monthly rate is 11.8% ÷ 12 = 0.9833%.", "1.009833^12 − 1."],
        solution: "The 11.8% monthly loan is effectively 1.009833^12 − 1 = 12.46%, more expensive than the 12% annual. The lower headline rate costs more because it compounds twelve times instead of once. Comparing stated rates with different compounding frequencies is meaningless — always convert to effective first."
      } ],

    sandbox: {
      title: "Simple against compound",
      instructions: "Build both interest calculations for the same principal and rate, then find the gap. Column C is compound — use the power operator ^.",
      sheets: [{
        name: "Interest",
        cells: {
          A1: "Principal", B1: "100000",
          A2: "Annual rate", B2: "0.10",
          A4: "Years", B4: "Simple", C4: "Compound", D4: "Gap",
          A5: "1", B5: "", C5: "", D5: "",
          A6: "5", B6: "", C6: "", D6: "",
          A7: "10", B7: "", C7: "", D7: "",
          A8: "20", B8: "", C8: "", D8: "",
          A10: "Effective rate if compounded monthly", B10: ""
        },
        editable: ["B5", "C5", "D5", "B6", "C6", "D6", "B7", "C7", "D7", "B8", "C8", "D8", "B10"],
        formats: Object.assign(
          f(["B1", "B5", "C5", "D5", "B6", "C6", "D6", "B7", "C7", "D7", "B8", "C8", "D8"], INR),
          { B2: PCT, B10: PCT })
      }],
      checks: [
        { cell: "B5", sheet: "Interest", expect: 110000, tol: 5, mustFormula: true, mustReference: ["B1", "B2"], label: "Simple, 1 year" },
        { cell: "C8", sheet: "Interest", expect: 672750, tol: 500, mustFormula: true, mustReference: ["B1", "B2"], label: "Compound, 20 years" },
        { cell: "B8", sheet: "Interest", expect: 300000, tol: 5, mustFormula: true, label: "Simple, 20 years" },
        { cell: "D8", sheet: "Interest", expect: 372750, tol: 500, mustFormula: true, mustReference: ["B8", "C8"], label: "The 20-year gap" },
        { cell: "B10", sheet: "Interest", expect: 0.1047, tol: 0.002, mustFormula: true, mustReference: ["B2"], label: "Effective monthly-compounded rate" }
      ],
      solution: {
        Interest: {
          B5: "=$B$1*(1+$B$2*A5)", C5: "=$B$1*(1+$B$2)^A5", D5: "=C5-B5",
          B6: "=$B$1*(1+$B$2*A6)", C6: "=$B$1*(1+$B$2)^A6", D6: "=C6-B6",
          B7: "=$B$1*(1+$B$2*A7)", C7: "=$B$1*(1+$B$2)^A7", D7: "=C7-B7",
          B8: "=$B$1*(1+$B$2*A8)", C8: "=$B$1*(1+$B$2)^A8", D8: "=C8-B8",
          B10: "=(1+$B$2/12)^12-1"
        }
      },
      cellHints: {
        B5: { whatGoesHere: "Simple interest total", hint: "Anchor the principal and rate so you can fill the column down.", pattern: "=$B$1*(1+$B$2*years)" },
        C5: { whatGoesHere: "Compound total", hint: "The ^ operator raises to a power.", pattern: "=$B$1*(1+$B$2)^years" },
        B10: { whatGoesHere: "Effective rate", hint: "Twelve months of a twelfth of the rate.", pattern: "=(1+rate/12)^12-1" }
      },
      success: "Identical at one year, ₹3,72,750 apart at twenty. And a 10% rate compounded monthly is really 10.47%. Both facts come from the same ^ in the formula."
    },

    challenge: {
      id: "i-c1", type: "numeric",
      prompt: "Roughly how many years does it take to double your money at 9% compound interest?",
      expect: 8, tol: 0.6,
      hints: [
        "You are solving 1.09^n = 2.",
        "There is a well-known shortcut for this involving the number 72.",
        "72 ÷ 9."
      ],
      solution: "About 8 years. The Rule of 72 — divide 72 by the percentage rate — approximates the doubling time and is accurate within a few months for rates between about 5% and 15%. The exact answer is ln(2) ÷ ln(1.09) = 8.04 years."
    },

    takeaways: [
      "Interest is rent on money, always quoted per period",
      "Compound interest earns interest on interest; over long horizons that is everything",
      "The stated rate and the effective rate differ whenever compounding is more frequent than annual",
      "Discounting in valuation is this formula run backwards"
    ]
  },

  /* ==================================================================== */
  {
    id: "0140-risk",
    title: "Risk",
    covers: ["Risk"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["risk", "uncertainty", "expected value", "probability", "downside"],
    summary: "Not the chance of a bad outcome, but the fact that several outcomes are possible — and how to put a number on that.",
    prerequisites: ["0010-what-is-finance"], relatedTopics: ["0150-return", "0220-risk-vs-reward"],

    explanation: {
      short: "Risk is the dispersion of possible outcomes around what you expect. More spread means more risk, whether the spread is upward or downward.",
      beginner: "If the café will definitely make ₹3,00,000, there is no risk — just a number. If it might make ₹1,00,000 in a bad year, ₹3,00,000 in a normal one and ₹5,00,000 in a good one, that spread is the risk. It exists even though one of those outcomes is very pleasant.",
      intermediate: "Expected value weights each outcome by its probability. It tells you the average result across many repetitions, which is useful — but a single business only gets one draw, so the spread matters as much as the average. A 20% chance of ruin is not offset by an attractive expected value if ruin ends the game.",
      advanced: "Finance usually measures risk as the standard deviation of returns, which treats upside and downside symmetrically — a real limitation. Practitioners supplement it with downside measures, drawdown and stress scenarios. And the distinction between risk (outcomes with knowable probabilities) and uncertainty (probabilities you cannot know) is where most model failures actually live."
    },

    formula: {
      display: "Expected value = Σ (Probability × Outcome)",
      note: "Every probability must be between 0 and 1, and they must sum to exactly 1."
    },

    example: {
      company: "The café's year ahead",
      rows: [["Bad year — 20% chance", 100000], ["Normal year — 60% chance", 300000], ["Good year — 20% chance", 500000],
             ["Expected profit", 300000]],
      walkthrough: "(0.2 × 1,00,000) + (0.6 × 3,00,000) + (0.2 × 5,00,000) = ₹3,00,000. The expected profit equals the normal case here, but the café will actually experience one of the three, and the ₹1,00,000 outcome may not cover its ₹60,000 interest bill plus its living costs. The average is not the experience."
    },

    whyItMatters: "Every discount rate, every credit spread and every insurance premium is a price attached to risk. Learning to state outcomes and probabilities explicitly is what turns a hunch into an analysis.",

    commonMistakes: [
      { mistake: "Treating risk as the same thing as loss.", why: "Risk is dispersion. An investment that might return 10% or 40% is risky, and both outcomes are good." },
      { mistake: "Acting on expected value alone.", why: "Expected value assumes many repetitions. A business gets one year at a time, and outcomes that end the business cannot be averaged away." },
      { mistake: "Assigning probabilities that do not sum to 1.", why: "A trivial error that quietly corrupts every scenario model built on it." }
    ],

    realWorld: [
      { field: "Credit", use: "Expected loss is probability of default × loss given default × exposure — this formula, in a suit." },
      { field: "Corporate finance", use: "Bull, base and bear cases are exactly this, and the spread between them is the analysis." },
      { field: "Insurance", use: "The entire industry prices dispersion and takes a margin for absorbing it." }
    ],

    practice: [
      { id: "r1", tier: "beginner", type: "numeric",
        prompt: "20% chance of ₹1,00,000, 60% of ₹3,00,000, 20% of ₹5,00,000. What is expected profit, in ₹?",
        expect: 300000, tol: 100,
        hints: ["Multiply each outcome by its probability, then add.", "(0.2×1,00,000)+(0.6×3,00,000)+(0.2×5,00,000)."],
        solution: "₹20,000 + ₹1,80,000 + ₹1,00,000 = ₹3,00,000." },
      { id: "r2", tier: "practical", type: "mcq",
        prompt: "Investment A always returns exactly 8%. Investment B returns 4% or 12%, equally likely. Which is riskier?",
        options: [
          { text: "A, because 8% is low", correct: false, why: "A low return is not a risky one. A has no dispersion at all." },
          { text: "B, because its outcome varies", correct: true, why: "Both have an expected return of 8%, but B's outcome is spread across a range. Dispersion is risk, even though one of B's outcomes is better than A's." },
          { text: "Neither — same expected return", correct: false, why: "Same expected return, very different distributions. The average hides the thing that matters." },
          { text: "B, because 4% is a loss", correct: false, why: "4% is a positive return. B is riskier because of the spread, not because either outcome is bad." }
        ] },
      { id: "r3", tier: "application", type: "scenario",
        prompt: "The café takes on ₹6,00,000 of debt. In each of its three possible years, what happens to the owner's outcome?",
        rows: [
          { label: "Good year, owner's profit", answer: "up" },
          { label: "Normal year, owner's profit", answer: "up" },
          { label: "Bad year, owner's profit", answer: "down" },
          { label: "Spread of outcomes", answer: "up" }
        ],
        hints: [
          "Interest is fixed; it does not shrink in a bad year.",
          "In the good and normal years the business earns more than the interest costs.",
          "What does a fixed cost do to the range of possible results?"
        ],
        solution: "Debt lifts the owner's return whenever the business out-earns the interest — good and normal years — and worsens it when it does not. Either way the range of outcomes widens. Leverage does not create returns; it stretches the distribution, which is precisely why it is a risk decision rather than a financing detail." },
      { id: "r4", tier: "challenge", type: "interpretation",
        prompt: "A venture has a 90% chance of returning 5% and a 10% chance of losing everything. Its expected return is negative. Explain why some investors take bets like this anyway.",
        keywords: [["portfolio", "diversif", "many", "spread", "several", "across"], ["one", "single", "individual", "each", "small"]],
        hints: ["What changes if you make this bet a hundred times instead of once?", "What if each bet is small relative to the total?"],
        solution: "They do not make it once. Across many small independent bets, the realised outcome converges toward the expected value, and the ruinous single outcome cannot end the portfolio because no one bet is large enough. This is why position sizing and diversification are risk tools rather than mere caution — they change what the same bet means."
      } ],

    sandbox: {
      title: "Put a number on the café's risk",
      instructions: "Weight each outcome by its probability to get expected profit. Then check the probabilities sum to 1, and measure the spread between best and worst.",
      sheets: [{
        name: "Risk",
        cells: {
          A1: "SCENARIO", B1: "Probability", C1: "Profit", D1: "Weighted",
          A2: "Bad year", B2: "0.20", C2: "100000", D2: "",
          A3: "Normal year", B3: "0.60", C3: "300000", D3: "",
          A4: "Good year", B4: "0.20", C4: "500000", D4: "",
          A5: "Check: probabilities", B5: "",
          A6: "EXPECTED PROFIT", D6: "",
          A8: "Spread (best − worst)", B8: "",
          A9: "Spread as a share of expected profit", B9: "",
          A11: "Interest the café must pay whatever happens", B11: "60000",
          A12: "Profit left in a bad year after interest", B12: ""
        },
        editable: ["D2", "D3", "D4", "B5", "D6", "B8", "B9", "B12"],
        formats: Object.assign(
          f(["C2", "C3", "C4", "D2", "D3", "D4", "D6", "B8", "B11", "B12"], INR),
          { B2: PCT, B3: PCT, B4: PCT, B5: PCT, B9: PCT })
      }],
      checks: [
        { cell: "D2", sheet: "Risk", expect: 20000, tol: 1, mustFormula: true, mustReference: ["B2", "C2"], label: "Bad year weighted" },
        { cell: "B5", sheet: "Risk", expect: 1, tol: 0.001, mustFormula: true, mustUse: ["SUM"], label: "Probabilities must sum to 1" },
        { cell: "D6", sheet: "Risk", expect: 300000, tol: 100, mustFormula: true, mustUse: ["SUM"], label: "Expected profit via SUM" },
        { cell: "B8", sheet: "Risk", expect: 400000, tol: 1, mustFormula: true, mustReference: ["C2", "C4"], label: "Spread" },
        { cell: "B9", sheet: "Risk", expect: 1.333, tol: 0.01, mustFormula: true, mustReference: ["B8", "D6"], label: "Spread relative to expectation" },
        { cell: "B12", sheet: "Risk", expect: 40000, tol: 1, mustFormula: true, mustReference: ["C2", "B11"], label: "Bad year after interest" }
      ],
      solution: {
        Risk: {
          D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", B5: "=SUM(B2:B4)",
          D6: "=SUM(D2:D4)", B8: "=C4-C2", B9: "=B8/D6", B12: "=C2-B11"
        }
      },
      cellHints: {
        B5: { whatGoesHere: "Probability check", hint: "If this is not exactly 1, every number below it is wrong.", pattern: "=SUM(probabilities)" },
        B9: { whatGoesHere: "Relative spread", hint: "A spread of ₹4,00,000 means something different on ₹3,00,000 than on ₹30,00,000.", pattern: "=spread ÷ expected" }
      },
      success: "Expected profit ₹3,00,000 — but the outcomes range across ₹4,00,000, which is 133% of the expectation. And in a bad year only ₹40,000 is left after interest. The average was never the thing to worry about."
    },

    challenge: {
      id: "r-c1", type: "numeric",
      prompt: "In the bad year the café earns ₹1,00,000 and owes ₹60,000 of interest. If it borrowed twice as much, interest would be ₹1,20,000. What is the bad-year result then, in ₹?",
      expect: -20000, tol: 100,
      hints: ["Interest doubles; the business result does not change.", "1,00,000 − 1,20,000.", "The answer is negative."],
      solution: "−₹20,000. The same café, the same bad year, now loss-making purely because of the financing decision. Doubling the debt did not change the business at all — it changed which outcomes the business can survive, which is the only thing risk analysis is really asking."
    },

    takeaways: [
      "Risk is dispersion of outcomes, not the chance of loss",
      "Expected value weights outcomes by probability — and probabilities must sum to 1",
      "One business gets one draw, so the spread matters as much as the average",
      "Leverage widens the distribution rather than shifting it"
    ]
  },

  /* ==================================================================== */
  {
    id: "0150-return",
    title: "Return",
    covers: ["Return"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["return", "yield", "cagr", "total return", "annualised"],
    summary: "What you got back, expressed as a percentage of what you put in — and why the time period is half the number.",
    prerequisites: ["0130-interest"], relatedTopics: ["0140-risk", "0220-risk-vs-reward"],

    explanation: {
      short: "Return is gain divided by what you invested. Total return includes both the change in value and any income received along the way.",
      beginner: "Put in ₹1,00,000, end with ₹1,15,000, and you made ₹15,000 — a 15% return. If you also collected ₹5,000 of dividends, your total return is ₹20,000, or 20%. Both parts count; ignoring income understates what actually happened.",
      intermediate: "A return without a period attached is meaningless. 50% over ten years is poor; 50% over one year is exceptional. Annualising via CAGR — the constant rate that would produce the same result — makes different holding periods comparable.",
      advanced: "Money-weighted and time-weighted returns answer different questions: the first measures what an investor earned given when they added money, the second measures the manager's decisions independent of flows. And arithmetic averages of periodic returns overstate compounded outcomes — +50% then −50% averages zero and leaves you down 25%."
    },

    formula: {
      display: "Return = (Ending value − Beginning value + Income) ÷ Beginning value",
      alternate: "CAGR = (Ending ÷ Beginning)^(1 ÷ Years) − 1",
      variables: [{ symbol: "CAGR", meaning: "The constant annual rate that would produce the same final result" }]
    },

    example: {
      company: "Priya's investment",
      walkthrough: "₹1,20,000 in, ₹1,38,000 out a year later, plus ₹4,000 of dividends. Total return ₹22,000 on ₹1,20,000 = 18.3%. Held for three years instead, ending at ₹1,80,000, the total gain is 50% — but the CAGR is 14.5% a year, which is the number to compare against anything else."
    },

    whyItMatters: "Return is the numerator of every investment decision and the output of every valuation. Being sloppy about the period or ignoring income is how people convince themselves of results they did not achieve.",

    commonMistakes: [
      { mistake: "Quoting a return without the period.", why: "Meaningless. Always annualise before comparing." },
      { mistake: "Averaging percentage returns arithmetically.", why: "+50% then −50% averages to 0% and leaves you 25% poorer. Compounded returns need geometric averaging." },
      { mistake: "Forgetting income.", why: "Dividends, interest and rent are return. Price change alone is only part of the story." }
    ],

    realWorld: [
      { field: "Asset management", use: "Every fund factsheet is an argument about return, period and benchmark." },
      { field: "Private equity", use: "IRR and MOIC are return measures built for irregular cash flows." },
      { field: "Corporate finance", use: "ROIC against cost of capital is the test for whether a company creates value at all." }
    ],

    practice: [
      { id: "rt1", tier: "beginner", type: "numeric",
        prompt: "₹1,20,000 invested, worth ₹1,38,000 a year later. What is the return, as a percentage?",
        expect: 0.15, tol: 0.003,
        hints: ["Gain first, then divide by what you started with.", "18,000 ÷ 1,20,000."],
        solution: "15%." },
      { id: "rt2", tier: "practical", type: "numeric",
        prompt: "Same investment, plus ₹4,000 of dividends received. What is the total return, as a percentage?",
        expect: 0.1833, tol: 0.004,
        hints: ["Income counts as return.", "(18,000 + 4,000) ÷ 1,20,000."],
        solution: "₹22,000 ÷ ₹1,20,000 = 18.3%." },
      { id: "rt3", tier: "application", type: "numeric",
        prompt: "₹1,20,000 grows to ₹1,80,000 over three years. What is the CAGR, as a percentage?",
        expect: 0.1447, tol: 0.005,
        hints: ["Not 50% ÷ 3 — compounding is not linear.", "Find the ratio 1,80,000 ÷ 1,20,000 = 1.5.", "1.5^(1/3) − 1."],
        solution: "1.5^(1÷3) − 1 = 14.5% a year. Dividing 50% by three gives 16.7%, which is wrong and always too high." },
      { id: "rt4", tier: "challenge", type: "interpretation",
        prompt: "A fund reports an average annual return of 0% over two years: +50% then −50%. An investor who put in ₹1,00,000 has ₹75,000. Explain.",
        keywords: [["geometric", "compound", "multiply", "sequence", "arithmetic average", "misleading"], ["50", "150", "75", "half", "smaller base"]],
        hints: ["Work through it: ₹1,00,000 × 1.5, then × 0.5.", "The 50% loss applies to a bigger number than the 50% gain did.", "Arithmetic averages of returns are not what you experience."],
        solution: "₹1,00,000 × 1.5 = ₹1,50,000, then × 0.5 = ₹75,000. The loss applies to a larger base than the gain did, so the arithmetic average of 0% never happens to anyone. The geometric average — the CAGR — is −13.4%, and that is the honest number."
      } ],

    sandbox: {
      title: "Measure the return properly",
      instructions: "Build the simple return, the total return including income, and then the annualised CAGR over three years using the power operator.",
      sheets: [{
        name: "Return",
        cells: {
          A1: "ONE YEAR", B1: "₹",
          A2: "Amount invested", B2: "120000",
          A3: "Value one year later", B3: "138000",
          A4: "Dividends received", B4: "4000",
          A5: "Gain in value", B5: "",
          A6: "Total gain including income", B6: "",
          A7: "Simple return", B7: "",
          A8: "Total return", B8: "",
          A10: "THREE YEARS",
          A11: "Value after three years", B11: "180000",
          A12: "Total gain over the period", B12: "",
          A13: "CAGR", B13: "",
          A14: "Wrong way: total gain ÷ 3", B14: ""
        },
        editable: ["B5", "B6", "B7", "B8", "B12", "B13", "B14"],
        formats: Object.assign(f(["B2", "B3", "B4", "B5", "B6", "B11"], INR),
          { B7: PCT, B8: PCT, B12: PCT, B13: PCT, B14: PCT })
      }],
      checks: [
        { cell: "B5", sheet: "Return", expect: 18000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Gain in value" },
        { cell: "B6", sheet: "Return", expect: 22000, tol: 1, mustFormula: true, mustReference: ["B5", "B4"], label: "Total gain" },
        { cell: "B7", sheet: "Return", expect: 0.15, tol: 0.002, mustFormula: true, mustReference: ["B5", "B2"], label: "Simple return" },
        { cell: "B8", sheet: "Return", expect: 0.1833, tol: 0.003, mustFormula: true, mustReference: ["B6", "B2"], label: "Total return" },
        { cell: "B12", sheet: "Return", expect: 0.5, tol: 0.003, mustFormula: true, mustReference: ["B11", "B2"], label: "Three-year gain" },
        { cell: "B13", sheet: "Return", expect: 0.1447, tol: 0.004, mustFormula: true, mustReference: ["B11", "B2"], label: "CAGR" }
      ],
      solution: {
        Return: {
          B5: "=B3-B2", B6: "=B5+B4", B7: "=B5/B2", B8: "=B6/B2",
          B12: "=B11/B2-1", B13: "=(B11/B2)^(1/3)-1", B14: "=B12/3"
        }
      },
      cellHints: {
        B13: { whatGoesHere: "CAGR", hint: "The ratio of end to start, raised to one over the number of years, less 1.", pattern: "=(end/start)^(1/years)-1" },
        B14: { whatGoesHere: "The wrong way", hint: "Deliberately wrong — build it to see how far off it is.", pattern: "=total gain ÷ 3" }
      },
      success: "14.5% CAGR against 16.7% from the naive division. Two percentage points a year, from a shortcut that looks harmless — and over long horizons that error compounds into a very different number."
    },

    challenge: {
      id: "rt-c1", type: "numeric",
      prompt: "An investment gains 50% in year one and loses 50% in year two. What is the CAGR over the two years, as a percentage? Answer as a negative decimal.",
      expect: -0.1340, tol: 0.005,
      hints: [
        "Work out where ₹100 ends up: ×1.5 then ×0.5.",
        "It ends at 75, so the ratio is 0.75 over two years.",
        "0.75^(1/2) − 1."
      ],
      solution: "0.75^0.5 − 1 = −13.4% a year. The arithmetic average of +50% and −50% is zero, which never happened to anybody. Whenever returns compound, the geometric average is the only honest summary."
    },

    takeaways: [
      "Return is gain over what you put in, and income counts",
      "A return without a time period attached means nothing",
      "CAGR annualises so different holding periods can be compared",
      "Arithmetic averages of returns overstate what you actually experienced"
    ]
  }

  ];
});
