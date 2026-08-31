/* ============================================================================
   1620 · Liquidity — ported from v1 and hand-finished.
   ----------------------------------------------------------------------------
   The mechanical port (js/learn/port.js) carried the definitions, the formula,
   the worked example, one MCQ and the whole sandbox across. Everything below
   marked "authored" is new writing that v1 never had.
   ========================================================================= */
(function (root, factory) {
  var l = factory();
  if (typeof module === "object" && module.exports) module.exports = l;
  else { root.FinLessons = root.FinLessons || {}; root.FinLessons[l.id] = l; }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return {
    id: "1620-liquidity",
    title: "Liquidity: current & quick ratios",
    short: "Liquidity",
    level: "analysis",
    difficulty: "beginner",
    estimatedTime: 5,
    covers: ["Current ratio","Quick ratio"],
    tags: ["liquidity", "current ratio", "quick ratio", "acid test", "working capital", "solvency"],
    summary: "Can the business pay its bills over the next twelve months? Two ratios, and why the gap between them is the interesting part.",
    prerequisites: ["1330-balance-sheet"],
    relatedTopics: ["1330-balance-sheet"],

    /* --- authored: §42 three levels --- */
    explanation: {
      short: "Profit is about the year. Liquidity is about next Friday. These two ratios ask a blunt question: if the bills came due, could the business pay them?",
      beginner: "Some of what a company owns can be turned into cash quickly — money in the bank, money customers owe. Some of what it owes has to be paid soon. Liquidity ratios put the first group over the second. Above 1 means there's more coming than going out; below 1 means there isn't.",
      intermediate: "The current ratio takes all current assets over all current liabilities. The quick ratio removes inventory, because stock has to be sold before it becomes cash and in a bad month it may not sell at all. The gap between the two ratios tells you how much of a company's apparent liquidity depends on shifting product.",
      advanced: "Neither ratio is directional on its own. A current ratio of 5 can mean a fortress balance sheet or capital sitting idle in uncollected receivables; a ratio of 1.1 is comfortable for a supermarket that collects in cash and pays suppliers in 60 days. Read them against the cash conversion cycle and against the sector, never in isolation."
    },

    formula: {
      display: "Current ratio = Current assets ÷ Current liabilities",
      alternate: "Quick ratio = (Current assets − Inventory) ÷ Current liabilities",
      variables: [
        { symbol: "Current assets", meaning: "Cash, receivables and inventory — what becomes cash within a year" },
        { symbol: "Current liabilities", meaning: "Payables and accruals — what must be paid within a year" },
        { symbol: "Inventory", meaning: "Stock, removed in the quick ratio because it has to be sold first" }
      ],
      note: "Café FY25: ₹4,50,000 ÷ ₹1,50,000 = 3.0x current; 2.0x quick."
    },

    /* --- authored: §12 --- */
    visualization: {
      type: "stacked-bars",
      title: "What stands behind each rupee owed",
      caption: "Drag the inventory block and watch the two ratios separate.",
      interactive: true,
      left: {
        label: "Current assets", stack: [
          { label: "Cash", value: 100000 },
          { label: "Receivables", value: 200000 },
          { label: "Inventory", value: 150000, highlight: true }
        ]
      },
      right: {
        label: "Current liabilities", stack: [
          { label: "Payables", value: 120000 },
          { label: "Salaries payable", value: 30000 }
        ]
      },
      readouts: [
        { label: "Current ratio", derive: "(cash + receivables + inventory) / liabilities", fmt: "x" },
        { label: "Quick ratio", derive: "(cash + receivables) / liabilities", fmt: "x" }
      ]
    },

    definitions: [
      { term: "Current ratio", text: "Current assets ÷ current liabilities. How many rupees of near-term assets stand behind each rupee of near-term debt. Below 1 means near-term obligations exceed near-term resources." },
      { term: "Quick ratio (acid test)", text: "The same, but excluding inventory — because stock has to be sold before it becomes cash, and in a bad month it may not sell at all. The harsher, more honest test." }
    ],

    example: {
      company: "Bombay Bean Coffee Co.",
      period: "FY25",
      rows: [
        ["Inventory", 150000], ["Trade receivables", 200000], ["Cash", 100000],
        ["Total current assets", 450000],
        ["Trade payables", -120000], ["Salaries payable", -30000],
        ["Total current liabilities", -150000],
        ["Current ratio", 3.0, "x"], ["Quick ratio", 2.0, "x"]
      ],
      walkthrough: "₹4,50,000 of near-term assets against ₹1,50,000 of near-term bills gives a current ratio of 3.0x. Strip out the ₹1,50,000 of beans and cups and the quick ratio is still 2.0x — the café could settle every current liability twice over without selling a single bean."
    },

    /* --- authored: §33 --- */
    whyItMatters: "Companies do not usually fail because they stopped being profitable. They fail because on a particular Tuesday there was a payment due and no cash to make it. Liquidity is the ratio that sees that coming, and it is the first thing a lender looks at.",

    /* --- authored: §34 --- */
    commonMistakes: [
      { mistake: "Assuming higher is better.", why: "A current ratio of 5 often means receivables nobody is chasing or cash earning nothing. Working capital that sits still is capital doing no work." },
      { mistake: "Reading the current ratio without the quick ratio.", why: "Two businesses at 1.5x can be in completely different positions — one holds cash, the other holds stock it may not shift. The gap between the two ratios is the whole signal." },
      { mistake: "Comparing across sectors.", why: "A supermarket collects at the till and pays suppliers in 60 days; it can run below 1.0x safely and often does. A manufacturer at 1.0x is in trouble." }
    ],

    /* --- authored: §35 --- */
    realWorld: [
      { field: "Credit & lending", use: "Covenants are frequently written as a minimum current ratio the borrower must maintain." },
      { field: "Equity research", use: "A quick ratio deteriorating quarter on quarter is an early warning that receivables or stock are building." },
      { field: "Corporate finance", use: "Treasury teams watch it to decide when to draw on a working-capital facility." },
      { field: "Investing", use: "It is the fastest screen for whether a cheap-looking company is cheap because it is about to run out of cash." }
    ],

    /* --- practice: one MCQ ported, the rest authored to fill §11's four tiers --- */
    practice: [
      {
        id: "liq-p1", tier: "beginner", type: "numeric",
        prompt: "Current assets are ₹4,50,000 and current liabilities are ₹1,50,000. What is the current ratio? Answer as a multiple, e.g. 2.5x.",
        expect: 3, tol: 0.01,
        hints: ["A ratio is one number divided by another.", "Assets on top, liabilities underneath.", "4,50,000 ÷ 1,50,000."],
        solution: "4,50,000 ÷ 1,50,000 = 3.0x."
      },
      {
        id: "liq-p2", tier: "practical", type: "numeric",
        prompt: "Of those current assets, ₹1,50,000 is inventory. What is the quick ratio?",
        expect: 2, tol: 0.01,
        hints: ["The quick ratio removes one thing from the top line.", "Inventory has to be sold before it is cash.", "(4,50,000 − 1,50,000) ÷ 1,50,000."],
        solution: "(4,50,000 − 1,50,000) ÷ 1,50,000 = 2.0x."
      },
      {
        /* ported from v1 — the four option explanations are the original ones */
        id: "liq-p3", tier: "application", type: "mcq",
        prompt: "Both cafés show a current ratio of exactly 1.5x. Which one would you lend to? Brew Lane holds ₹6,00,000 inventory, ₹1,00,000 receivables, ₹50,000 cash. Third Wave holds ₹1,00,000 inventory, ₹2,00,000 receivables, ₹3,00,000 cash. Both owe ₹5,00,000.",
        options: [
          { text: "Brew Lane — it has more current assets in total", correct: false, why: "Brew Lane's assets are larger but the wrong kind: ₹6,00,000 of it is beans and pastry. If sales slow, that stock doesn't convert — and it has only ₹50,000 of cash to bridge the gap." },
          { text: "Third Wave — its liquidity doesn't depend on selling stock", correct: true, why: "Identical current ratios, completely different risk. Third Wave's quick ratio of 1.0x means it could settle every current liability without selling a single bean. Brew Lane's 0.3x means it is utterly dependent on moving inventory. This is exactly the blind spot the quick ratio was invented to expose." },
          { text: "Neither — 1.5x is too low", correct: false, why: "1.5x is perfectly normal for a café. The number itself isn't the problem; what sits inside it is." },
          { text: "They're equally safe; the ratio says so", correct: false, why: "This is the trap. One ratio, two very different businesses — which is why nobody reads the current ratio alone." }
        ]
      },
      {
        id: "liq-p4", tier: "application", type: "scenario",
        prompt: "The café buys ₹50,000 of extra beans on 30 days' credit. What happens to each figure, immediately?",
        rows: [
          { label: "Inventory", answer: "up" },
          { label: "Trade payables", answer: "up" },
          { label: "Current ratio", answer: "down" },
          { label: "Quick ratio", answer: "down" }
        ],
        hints: [
          "Both sides of the balance sheet move by the same ₹50,000.",
          "The current ratio is above 1, so adding an equal amount to both top and bottom pulls it toward 1.",
          "The quick ratio excludes inventory — so only the bottom half moves."
        ],
        solution: "Inventory and payables both rise ₹50,000. The current ratio falls (5,00,000 ÷ 2,00,000 = 2.5x, down from 3.0x) because adding equally to a ratio above 1 drags it toward 1. The quick ratio falls harder (3,00,000 ÷ 2,00,000 = 1.5x, down from 2.0x) because the asset added was the one it ignores."
      },
      {
        id: "liq-p5", tier: "challenge", type: "interpretation",
        prompt: "A retailer reports a current ratio of 0.9x and has done for a decade, profitably. Why is that not a crisis?",
        keywords: [
          ["cash", "till", "collect", "immediately", "point of sale"],
          ["supplier", "payable", "credit", "pay later", "60 days", "terms"]
        ],
        hints: [
          "Think about when a supermarket receives money from a customer.",
          "Now think about when it pays the supplier of what that customer bought.",
          "It is being financed by its suppliers, and that is by design."
        ],
        solution: "Retailers collect cash at the till instantly but pay suppliers on 30–60 day terms. They carry almost no receivables and large payables, so the ratio sits below 1 permanently — the negative working capital is a feature, not distress. Cash arrives before the bill for it does."
      }
    ],

    /* --- ported verbatim from v1: same grid, same checks --- */
    sandbox: {
      title: "The café's liquidity, 31 March 2025",
      instructions: "Total the current assets (B5) and current liabilities (B8) with SUM, then build both ratios. The ratio cells display as multiples.",
      sheets: [{
        name: "Liquidity",
        cells: {
          B1: "31 Mar 2025",
          A2: "Inventory", B2: "150000",
          A3: "Trade receivables", B3: "200000",
          A4: "Cash", B4: "100000",
          A5: "Total current assets", B5: "",
          A6: "Trade payables", B6: "120000",
          A7: "Salaries payable", B7: "30000",
          A8: "Total current liabilities", B8: "",
          A10: "Current ratio", B10: "",
          A11: "Quick ratio", B11: ""
        },
        editable: ["B5", "B8", "B10", "B11"],
        formats: {
          B2: { type: "currency", currency: "inr" }, B3: { type: "currency", currency: "inr" },
          B4: { type: "currency", currency: "inr" }, B5: { type: "currency", currency: "inr" },
          B6: { type: "currency", currency: "inr" }, B7: { type: "currency", currency: "inr" },
          B8: { type: "currency", currency: "inr" },
          B10: { type: "x", dp: 1 }, B11: { type: "x", dp: 1 }
        }
      }],
      checks: [
        { cell: "B5", sheet: "Liquidity", expect: 450000, mustFormula: true, mustUse: ["SUM"], label: "Total current assets via SUM" },
        { cell: "B8", sheet: "Liquidity", expect: 150000, mustFormula: true, mustUse: ["SUM"], label: "Total current liabilities via SUM" },
        { cell: "B10", sheet: "Liquidity", expect: 3, tol: 0.01, mustFormula: true, mustReference: ["B5", "B8"], label: "Current ratio" },
        { cell: "B11", sheet: "Liquidity", expect: 2, tol: 0.01, mustFormula: true, mustReference: ["B8"], label: "Quick ratio — exclude inventory" }
      ],
      solution: { Liquidity: { B5: "=SUM(B2:B4)", B8: "=SUM(B6:B7)", B10: "=B5/B8", B11: "=(B5-B2)/B8" } },
      cellHints: {
        B5: { whatGoesHere: "Total current assets", hint: "Three cells above it.", pattern: "=SUM(B2:B4)" },
        B8: { whatGoesHere: "Total current liabilities", hint: "Two cells above it.", pattern: "=SUM(B6:B7)" },
        B10: { whatGoesHere: "Current ratio", hint: "Assets over liabilities.", pattern: "=B5/B8" },
        B11: { whatGoesHere: "Quick ratio", hint: "The same, but take inventory out of the top first.", pattern: "=(B5-B2)/B8" }
      },
      success: "Current ratio 3.0x, quick ratio 2.0x. Even ignoring every bean in the storeroom, the café has ₹2 of quick assets for every ₹1 due."
    },

    /* --- authored: §2 MASTER --- */
    challenge: {
      id: "liq-c1", type: "debug",
      prompt: "A model reports a quick ratio HIGHER than its current ratio. One cell is wrong. Given B5 is total current assets, B2 inventory and B8 total current liabilities, which cell holds the error?",
      brokenCell: "B11",
      nearMiss: ["B10"],
      nearMissWhy: "B10 is the current ratio and it is behaving correctly. The impossible number is the quick one.",
      hints: [
        "The quick ratio removes an asset, so it can never exceed the current ratio.",
        "If removing inventory made the ratio go up, what was actually done to inventory?",
        "Check whether B11 adds inventory instead of subtracting it."
      ],
      solution: "B11 reads =(B5+B2)/B8 instead of =(B5-B2)/B8. The quick ratio is mathematically incapable of exceeding the current ratio, so that result alone identifies the bug before you even open the cell."
    },

    /* --- authored: §36 --- */
    takeaways: [
      "What the current and quick ratios measure, and over what horizon",
      "Why the gap between them matters more than either number alone",
      "That higher is not automatically better",
      "Why a retailer can sit below 1.0x safely and a manufacturer cannot"
    ]
  };
});
