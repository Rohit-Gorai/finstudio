/* ============================================================================
   1330 · The balance sheet capstone — ported from v1 and hand-finished.
   ----------------------------------------------------------------------------
   This is one of the six lessons whose v1 `custom` check could not be carried
   across mechanically (the porter flags it). The tie check is rewritten below
   as a v2 spec, and the modelChecks tie meter is declared as data.
   ========================================================================= */
(function (root, factory) {
  var l = factory();
  if (typeof module === "object" && module.exports) module.exports = l;
  else { root.FinLessons = root.FinLessons || {}; root.FinLessons[l.id] = l; }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return {
    id: "1330-balance-sheet",
    title: "Capstone: build the balance sheet",
    short: "The balance sheet",
    level: "statements",
    difficulty: "intermediate",
    estimatedTime: 6,
    covers: ["Equity","Retained earnings"],
    tags: ["balance sheet", "accounting equation", "retained earnings", "capstone", "tie"],
    summary: "Everything built in modules 1100–1300 assembles into one statement, and the two sides must agree to the rupee.",
    prerequisites: [],
    relatedTopics: ["1620-liquidity"],

    explanation: {
      short: "Everything you've built — PP&E, inventory, receivables, cash, payables, the loan, share capital, retained earnings — assembles into one statement now. Assets must equal liabilities plus equity, to the rupee.",
      beginner: "A balance sheet is a photograph of what a business owns and who has a claim on it, taken on one particular day. Everything it owns had to be paid for by somebody: either a lender or the owner. That is why the two sides are equal — not by convention, but by construction.",
      intermediate: "The two sides tie because every transaction was recorded twice. Assets = Liabilities + Equity is not a rule imposed on the statement; it is what double-entry bookkeeping produces if nothing was missed. A sheet that does not balance is not nearly right — it is evidence that a transaction was recorded on one side only.",
      advanced: "India's Schedule III presentation orders the statement Equity & Liabilities first, then Assets, and splits both into current and non-current. This lesson presents assets first for building intuition; the numbers are identical and the reference section carries the statutory ordering. Retained earnings is the only line here that is not a balance you can observe — it is a roll-forward, and it is where errors hide."
    },

    formula: {
      display: "Assets = Liabilities + Equity",
      alternate: "Retained earnings = Opening retained earnings + Profit after tax − Dividends",
      variables: [
        { symbol: "Assets", meaning: "Everything the business controls that will bring it economic benefit" },
        { symbol: "Liabilities", meaning: "Claims by lenders, suppliers and employees" },
        { symbol: "Equity", meaning: "What is left for the owner — share capital plus accumulated retained profit" }
      ],
      note: "The café ties at ₹19,50,000 on both sides."
    },

    visualization: {
      type: "balance-scale",
      title: "Two sides, one total",
      caption: "Change any asset and watch the sheet stop balancing — then find what has to move on the other side.",
      interactive: true,
      left: {
        label: "Assets", stack: [
          { label: "PP&E, net", value: 1400000 },
          { label: "Security deposit", value: 100000 },
          { label: "Inventory", value: 150000 },
          { label: "Receivables", value: 200000 },
          { label: "Cash", value: 100000 }
        ]
      },
      right: {
        label: "Equity & liabilities", stack: [
          { label: "Share capital", value: 1000000 },
          { label: "Retained earnings", value: 250000 },
          { label: "Term loan", value: 550000 },
          { label: "Trade payables", value: 120000 },
          { label: "Salaries payable", value: 30000 }
        ]
      },
      readouts: [{ label: "Difference", derive: "left - right", fmt: "inr", target: 0 }]
    },

    example: {
      company: "Bombay Bean Coffee Co.",
      period: "As at 31 March 2025",
      rows: [
        ["Gross PP&E (at cost)", 1840000], ["Less: accumulated depreciation", -440000],
        ["PP&E, net", 1400000], ["Security deposit", 100000], ["Inventory", 150000],
        ["Trade receivables", 200000], ["Cash at bank", 100000], ["TOTAL ASSETS", 1950000],
        ["Share capital", 1000000], ["Retained earnings", 250000], ["Term loan", 550000],
        ["Trade payables", 120000], ["Salaries payable", 30000], ["TOTAL EQUITY & LIABILITIES", 1950000]
      ],
      walkthrough: "Gross PP&E of ₹18,40,000 is the ₹16,00,000 day-one register plus the FY25 ₹2,40,000 van addition; accumulated depreciation of ₹4,40,000 is two years' charges (₹2,00,000 + ₹2,40,000). Retained earnings is the only line that is not an observed balance: ₹1,20,000 opening, plus ₹1,80,000 profit after tax, less the ₹50,000 dividend, gives ₹2,50,000. Both totals land on ₹19,50,000."
    },

    whyItMatters: "Every other statement is explained by movement between two balance sheets. The income statement explains the change in retained earnings; the cash flow statement explains the change in cash. If you cannot build a balance sheet that ties, nothing downstream of it can be trusted — which is why a modelling interview almost always ends here.",

    commonMistakes: [
      { mistake: "Plugging the difference to make it balance.", why: "A plug hides the error rather than fixing it, and it will reappear in every forecast period. The size of the difference is usually the clue to which line is wrong." },
      { mistake: "Treating accumulated depreciation as an expense.", why: "It is a contra-asset — a running total of all depreciation ever charged, sitting against gross PP&E. The year's charge belongs on the income statement; the total belongs here." },
      { mistake: "Forgetting the dividend in retained earnings.", why: "Retained earnings is what is retained. Profit that was paid out is not." },
      { mistake: "Recording the loan at the amount originally borrowed.", why: "It is the outstanding balance, after repayments — ₹5,50,000, not the ₹6,00,000 drawn." }
    ],

    realWorld: [
      { field: "Investment banking", use: "The balance sheet check is the first thing a reviewer looks at in any three-statement model." },
      { field: "Accounting", use: "This is the trial balance made presentable; if it doesn't tie, the books don't." },
      { field: "Private equity", use: "Net debt — the number that turns enterprise value into equity value — is read straight off it." },
      { field: "Credit", use: "Gearing and covenant headroom are computed entirely from these lines." }
    ],

    practice: [
      {
        id: "bs-p1", tier: "beginner", type: "numeric",
        prompt: "Gross PP&E is ₹18,40,000 and accumulated depreciation is ₹4,40,000. What is net PP&E, in ₹?",
        expect: 1400000, tol: 1,
        hints: ["Accumulated depreciation reduces the asset.", "18,40,000 − 4,40,000."],
        solution: "₹18,40,000 − ₹4,40,000 = ₹14,00,000."
      },
      {
        id: "bs-p2", tier: "practical", type: "numeric",
        prompt: "Opening retained earnings ₹1,20,000, profit after tax ₹1,80,000, dividend paid ₹50,000. What is closing retained earnings?",
        expect: 250000, tol: 1,
        hints: [
          "Retained earnings only ever moves for two reasons.",
          "Profit adds to it; anything paid out to owners takes away.",
          "1,20,000 + 1,80,000 − 50,000."
        ],
        solution: "₹1,20,000 + ₹1,80,000 − ₹50,000 = ₹2,50,000."
      },
      {
        id: "bs-p3", tier: "beginner", type: "match",
        prompt: "Which side of the balance sheet does each line sit on?",
        pairs: [
          { left: "Trade receivables", right: "Assets" },
          { left: "Term loan", right: "Equity & liabilities" },
          { left: "Inventory", right: "Assets" },
          { left: "Retained earnings", right: "Equity & liabilities" },
          { left: "Salaries payable", right: "Equity & liabilities" },
          { left: "Security deposit", right: "Assets" }
        ],
        hints: [
          "Ask of each one: does the business own this, or owe it?",
          "Retained earnings is money the owner left in the business — it is owed to the owner."
        ]
      },
      {
        id: "bs-p4", tier: "application", type: "scenario",
        prompt: "The café buys a ₹2,00,000 espresso machine, paying cash. On the balance sheet, immediately:",
        rows: [
          { label: "Gross PP&E", answer: "up" },
          { label: "Cash", answer: "down" },
          { label: "Total assets", answer: "none" },
          { label: "Total equity & liabilities", answer: "none" },
          { label: "Retained earnings", answer: "none" }
        ],
        hints: [
          "Two asset lines move here, not one asset and one liability.",
          "Buying an asset with cash swaps one asset for another.",
          "Nothing was earned or spent as an expense, so nothing touches profit."
        ],
        solution: "PP&E rises ₹2,00,000, cash falls ₹2,00,000. Both totals are unchanged — an asset was exchanged for an asset. Nothing reached the income statement, so retained earnings is untouched. Depreciation will start affecting profit from the following period."
      },
      {
        id: "bs-p5", tier: "challenge", type: "interpretation",
        prompt: "A model's balance sheet is out by exactly ₹50,000, and the dividend that year was ₹50,000. What is almost certainly wrong, and why does the size of the difference tell you?",
        keywords: [
          ["retained earnings", "roll-forward", "rollforward", "dividend"],
          ["not subtracted", "omitted", "missing", "forgot", "left out"]
        ],
        hints: [
          "A difference that exactly matches a known figure is rarely coincidence.",
          "Which line on the balance sheet is calculated rather than observed?",
          "What happens to retained earnings if the dividend is never deducted?"
        ],
        solution: "The dividend was omitted from the retained earnings roll-forward, so equity is overstated by exactly ₹50,000. When a difference matches a known figure exactly, that figure has been counted once too often or once too few — which is why you read the size of the gap before you start hunting."
      }
    ],

    sandbox: {
      title: "Bombay Bean Coffee Co. — Balance sheet as at 31 March 2025",
      instructions: "Four formulas: net PP&E (B5), total assets (B10, use SUM), retained earnings (B13 — the roll-forward: opening ₹1,20,000 + PAT ₹1,80,000 − dividend ₹50,000), and total equity & liabilities (B17, use SUM). Watch the tie meter as you go.",
      sheets: [{
        name: "Balance sheet",
        cells: {
          B1: "31 Mar 2025",
          A2: "ASSETS",
          A3: "Gross PP&E (at cost)", B3: "1840000",
          A4: "Less: accumulated depreciation", B4: "-440000",
          A5: "PP&E, net", B5: "",
          A6: "Security deposit", B6: "100000",
          A7: "Inventory", B7: "150000",
          A8: "Trade receivables", B8: "200000",
          A9: "Cash at bank", B9: "100000",
          A10: "TOTAL ASSETS", B10: "",
          A11: "EQUITY & LIABILITIES",
          A12: "Share capital", B12: "1000000",
          A13: "Retained earnings", B13: "",
          A14: "Term loan", B14: "550000",
          A15: "Trade payables", B15: "120000",
          A16: "Salaries payable", B16: "30000",
          A17: "TOTAL EQUITY & LIABILITIES", B17: ""
        },
        editable: ["B5", "B10", "B13", "B17"],
        formats: (function () {
          var f = {};
          ["B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B12", "B13", "B14", "B15", "B16", "B17"]
            .forEach(function (a) { f[a] = { type: "currency", currency: "inr" }; });
          return f;
        })()
      }],
      checks: [
        { cell: "B5", sheet: "Balance sheet", expect: 1400000, mustFormula: true, mustReference: ["B3", "B4"], label: "Net PP&E = gross − accumulated depreciation" },
        { cell: "B10", sheet: "Balance sheet", expect: 1950000, mustFormula: true, mustUse: ["SUM"], label: "Total assets via SUM(B5:B9)" },
        { cell: "B13", sheet: "Balance sheet", expect: 250000, mustFormula: true, label: "Retained earnings via the roll-forward" },
        { cell: "B17", sheet: "Balance sheet", expect: 1950000, mustFormula: true, mustUse: ["SUM"], label: "Total equity & liabilities via SUM(B12:B16)" },
        {
          /* the v1 custom closure, rewritten as a v2 spec */
          cell: "B10", sheet: "Balance sheet", label: "The sheet ties",
          custom: function (wb, value) {
            var a = wb.value("Balance sheet", "B10");
            var le = wb.value("Balance sheet", "B17");
            if (typeof a !== "number" || typeof le !== "number") return "Both totals need to be numbers first.";
            if (a !== le) return "The two sides differ by ₹" + Math.abs(a - le).toLocaleString("en-IN") +
              ". The size of that gap is usually the clue to which line is wrong.";
            if (a !== 1950000) return "Both sides agree, but at the wrong figure — they should be ₹19,50,000.";
            return true;
          }
        }
      ],
      solution: { "Balance sheet": { B5: "=B3+B4", B10: "=SUM(B5:B9)", B13: "=120000+180000-50000", B17: "=SUM(B12:B16)" } },
      tie: { a: "B10", le: "B17", sheet: "Balance sheet", aLabel: "Total assets", leLabel: "Total equity & liabilities", target: 1950000 },
      cellHints: {
        B5: { whatGoesHere: "PP&E, net", hint: "Accumulated depreciation is already stored negative, so you add.", pattern: "=B3+B4" },
        B10: { whatGoesHere: "Total assets", hint: "Five asset lines, B5 through B9.", pattern: "=SUM(B5:B9)" },
        B13: { whatGoesHere: "Retained earnings", hint: "It is a roll-forward, not a balance you can read off anything.", pattern: "=opening + PAT − dividend" },
        B17: { whatGoesHere: "Total equity & liabilities", hint: "Five lines, B12 through B16.", pattern: "=SUM(B12:B16)" }
      },
      success: "TOTAL ASSETS ₹19,50,000. TOTAL EQUITY & LIABILITIES ₹19,50,000. It ties."
    },

    challenge: {
      id: "bs-c1", type: "debug",
      prompt: "A balance sheet is out by ₹4,40,000 — assets too high. Accumulated depreciation is ₹4,40,000. Which cell is wrong: B4 (accumulated depreciation), B5 (net PP&E), B10 (total assets) or B17 (total equity & liabilities)?",
      brokenCell: "B5",
      nearMiss: ["B10"],
      nearMissWhy: "B10 is overstated, but only because it sums a B5 that is already wrong. Fixing B10 would be plugging.",
      hints: [
        "The difference exactly equals accumulated depreciation, so depreciation has been counted once too few.",
        "Which cell is supposed to subtract it?",
        "If B5 read =B3 instead of =B3+B4, what would total assets be?"
      ],
      solution: "B5 reads =B3, ignoring accumulated depreciation, so net PP&E is stated at gross. Total assets inherit the error. The fix is =B3+B4 in B5 — never an adjustment in B10, which would hide the cause and break every forecast period built on it."
    },

    takeaways: [
      "Why the two sides tie by construction rather than by convention",
      "How to build net PP&E, total assets and total equity & liabilities",
      "That retained earnings is a roll-forward, not an observed balance",
      "Why the size of a difference tells you where to look",
      "Why plugging a balance sheet is never a fix"
    ]
  };
});
