/* ============================================================================
   Reference lesson — EBITDA.
   ----------------------------------------------------------------------------
   This is the §8 template filled in for real: every section the brief asks for,
   every one of the four mandatory practice tiers (§11), a sandbox exercise, a
   "why this matters" (§33), a "common mistake" (§34), a real-world section
   (§35) and an end-of-lesson summary (§36).

   It exists to be the shape every other lesson is written against. Authoring a
   lesson is filling in this object; no rendering code changes.

   Numbers use Bombay Bean Coffee Co. (js/lessons/company.js) so this lesson
   ties to the same company as the existing 38.
   ========================================================================= */
(function (root, factory) {
  var lesson = factory();
  if (typeof module === "object" && module.exports) module.exports = lesson;
  else {
    root.FinLessons = root.FinLessons || {};
    root.FinLessons[lesson.id] = lesson;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  return {
    /* ---- identity ---- */
    id: "ebitda",
    title: "EBITDA",
    level: "statements",
    difficulty: "beginner",
    estimatedTime: 7,
    covers: ["EBITDA"],
    tags: ["ebitda", "operating profit", "margin", "income statement", "d&a"],
    summary: "Operating profit before the three things that say more about how a company is financed and taxed than about how it trades.",
    prerequisites: [],          // filled in once revenue/COGS/opex lessons are ported
    relatedTopics: [],          // ditto — the validator will flag dangling ids

    /* ---- LEARN (§2) ---- */
    explanation: {
      short: "Earnings before interest, tax, depreciation and amortisation — what the business earned from trading, before financing and accounting choices.",
      beginner: "Start at profit. Then add back four things: the interest the company pays on its debt, the tax it pays the government, and the two accounting charges that spread the cost of past purchases over time — depreciation and amortisation. What's left is roughly what the business earned from doing what it does.",
      intermediate: "EBITDA strips out the effects of capital structure (interest), jurisdiction (tax) and past investment decisions (D&A), leaving operating performance. That makes two companies with different debt loads and different asset ages more comparable than net income would.",
      advanced: "EBITDA is not a defined measure under Ind AS, IFRS or US GAAP — it is a non-GAAP construction, which is precisely why definitions vary between companies and why 'adjusted EBITDA' deserves scrutiny. Its usefulness comes from comparability; its danger comes from the same place."
    },

    formula: {
      display: "EBITDA = Revenue − COGS − Operating expenses",
      alternate: "EBITDA = EBIT + Depreciation + Amortisation",
      variables: [
        { symbol: "Revenue", meaning: "Income recognised from sales in the period" },
        { symbol: "COGS", meaning: "The direct cost of what was sold" },
        { symbol: "Operating expenses", meaning: "Rent, salaries, utilities, marketing — running costs, excluding D&A" }
      ],
      note: "The two routes must agree. If they don't, something has been double-counted — usually D&A sitting inside operating expenses."
    },

    /* ---- SEE (§12) ---- */
    visualization: {
      type: "waterfall",
      title: "From revenue down to EBITDA",
      caption: "Drag any bar; the ones below it follow.",
      interactive: true,
      series: [
        { label: "Revenue", value: 2400000, kind: "start", editable: true },
        { label: "COGS", value: -840000, kind: "down", editable: true },
        { label: "Gross profit", value: 1560000, kind: "subtotal" },
        { label: "Operating expenses", value: -1020000, kind: "down", editable: true },
        { label: "EBITDA", value: 540000, kind: "total" }
      ],
      derive: "EBITDA = Revenue - COGS - Opex"
    },

    /* ---- worked example ---- */
    example: {
      company: "Bombay Bean Coffee Co.",
      period: "FY25",
      rows: [
        ["Revenue", 2400000],
        ["Cost of goods sold", -840000],
        ["Gross profit", 1560000],
        ["Operating expenses", -1020000],
        ["EBITDA", 540000],
        ["EBITDA margin", 0.225, "pct"]
      ],
      walkthrough: "₹24,00,000 of coffee sold. ₹8,40,000 of beans, milk and cups to sell it. ₹10,20,000 of rent, salaries, utilities and marketing to keep the doors open. What's left — ₹5,40,000 — is EBITDA. Note what has not been subtracted yet: the ₹2,40,000 of depreciation on the fit-out and the van, the ₹60,000 of interest on the loan, and the ₹60,000 of tax."
    },

    /* ---- WHY IT MATTERS (§33) ---- */
    whyItMatters: "Two cafés can trade identically and report very different net income — one rents its premises, the other borrowed to buy them; one bought its equipment last year, the other five years ago. EBITDA puts them on the same footing, which is why it anchors valuation multiples and debt covenants.",

    /* ---- COMMON MISTAKE (§34) ---- */
    commonMistakes: [
      {
        mistake: "Treating EBITDA as cash flow.",
        why: "It ignores working capital, capital expenditure, interest and tax — all of which are real cash. A business can grow EBITDA every year and run out of money, and some do."
      },
      {
        mistake: "Subtracting depreciation twice.",
        why: "If D&A is already inside the operating expense line you were given, subtracting it again puts you at EBIT while you think you're at EBITDA."
      },
      {
        mistake: "Taking 'adjusted EBITDA' at face value.",
        why: "The adjustments are chosen by the company. Read what has been added back before you use the number."
      }
    ],

    /* ---- REAL WORLD (§35) ---- */
    realWorld: [
      { field: "Investment banking", use: "EV/EBITDA is the workhorse valuation multiple in most sectors." },
      { field: "Private equity", use: "Debt is sized off EBITDA — a lender will talk in turns of it, as in 4.5x." },
      { field: "Equity research", use: "EBITDA margin trends show whether operating leverage is working." },
      { field: "Corporate finance", use: "Covenants in loan agreements are usually written as ratios of EBITDA." }
    ],

    /* ---- PRACTICE (§11: beginner, practical, application, challenge) ---- */
    practice: [
      {
        id: "ebitda-p1",
        tier: "beginner",
        type: "numeric",
        prompt: "Revenue is ₹100 Cr. COGS is ₹40 Cr. Operating expenses are ₹30 Cr. What is EBITDA, in ₹ Cr?",
        expect: 30,
        tol: 0.01,
        hints: [
          "EBITDA sits below operating expenses, not above them.",
          "Take revenue, remove the cost of what you sold, then remove the cost of running the business.",
          "100 − 40 − 30."
        ],
        solution: "EBITDA = 100 − 40 − 30 = ₹30 Cr.",
        correct: "₹30 Cr. Revenue less COGS less operating expenses."
      },
      {
        id: "ebitda-p2",
        tier: "practical",
        type: "numeric",
        prompt: "Same company. What is the EBITDA margin? Answer as a percentage.",
        expect: 0.30,
        tol: 0.002,
        scaleHint: "Right number, but a margin is EBITDA ÷ revenue — express it as a percentage.",
        hints: [
          "A margin is always something divided by revenue.",
          "30 ÷ 100."
        ],
        solution: "EBITDA margin = 30 ÷ 100 = 30%."
      },
      {
        id: "ebitda-p3",
        tier: "beginner",
        type: "mcq",
        prompt: "Which of these has NOT been subtracted by the time you reach EBITDA?",
        options: [
          { text: "Cost of goods sold", correct: false, why: "COGS comes out first — it's the step from revenue to gross profit." },
          { text: "Rent", correct: false, why: "Rent is an operating expense, so it's already out." },
          { text: "Depreciation", correct: true, why: "Right — the D in EBITDA. Depreciation is still to come, between EBITDA and EBIT." },
          { text: "Salaries", correct: false, why: "Salaries are an operating expense, already subtracted." }
        ]
      },
      {
        id: "ebitda-p4",
        tier: "application",
        type: "scenario",
        prompt: "The café's revenue rises 20% while COGS stays at 35% of revenue and operating expenses are fixed. What happens to each line?",
        rows: [
          { label: "Revenue", answer: "up" },
          { label: "Gross profit", answer: "up" },
          { label: "Operating expenses", answer: "none" },
          { label: "EBITDA", answer: "up" },
          { label: "EBITDA margin", answer: "up" }
        ],
        hints: [
          "Two of these are percentages of revenue, and one is a fixed rupee amount.",
          "If costs are fixed and revenue rises, profit rises faster than revenue does.",
          "That effect has a name: operating leverage."
        ],
        solution: "Revenue, gross profit and EBITDA all rise. Operating expenses are unchanged. Because EBITDA rises faster than revenue, the margin rises too — operating leverage."
      },
      {
        id: "ebitda-p5",
        tier: "application",
        type: "interpretation",
        prompt: "A company reports EBITDA of ₹200 Cr and negative cash flow from operations. Give one reason both can be true at once.",
        keywords: [
          ["working capital", "receivable", "inventory", "payable", "debtor"],
          ["cash", "collect", "paid", "tied up"]
        ],
        hints: [
          "EBITDA is measured on the income statement. Cash is measured somewhere else.",
          "What if the sales were made but not yet collected?",
          "Think about what happens to cash when receivables and inventory both grow."
        ],
        solution: "EBITDA is an accrual measure — a sale counts when invoiced, not when paid. If receivables and inventory grow faster than payables, the cash is sitting in working capital rather than the bank."
      },
      {
        id: "ebitda-p6",
        tier: "challenge",
        type: "numeric",
        prompt: "A company reports EBIT of ₹80 Cr, depreciation of ₹25 Cr, amortisation of ₹5 Cr, interest of ₹12 Cr and tax of ₹18 Cr. What is EBITDA, in ₹ Cr?",
        expect: 110,
        tol: 0.01,
        hints: [
          "You're starting below EBITDA this time, not above it. Work upwards.",
          "Only two of the five figures given are added back to EBIT.",
          "Interest and tax sit below EBIT, so they aren't part of this."
        ],
        solution: "EBITDA = EBIT + D + A = 80 + 25 + 5 = ₹110 Cr. Interest and tax are already below EBIT and are irrelevant here — the distractors are the point of the question.",
        wrong: "Check which of those five figures actually sit between EBITDA and EBIT."
      }
    ],

    /* ---- BUILD (§13, §14) ---- */
    sandbox: {
      title: "Build the café's EBITDA",
      instructions: "Column B holds FY25. Write the two formulas — gross profit and EBITDA — so that changing revenue in B2 flows all the way down.",
      sheets: [{
        name: "P&L",
        cells: {
          A1: "Bombay Bean Coffee Co.", B1: "FY25",
          A2: "Revenue", B2: "2400000",
          A3: "Cost of goods sold", B3: "-840000",
          A4: "Gross profit", B4: "",
          A5: "Operating expenses", B5: "-1020000",
          A6: "EBITDA", B6: "",
          A7: "EBITDA margin", B7: ""
        },
        editable: ["B4", "B6", "B7"]
      }],
      checks: [
        { cell: "B4", sheet: "P&L", expect: 1560000, mustFormula: true, mustReference: ["B2", "B3"],
          label: "Gross profit" },
        { cell: "B6", sheet: "P&L", expect: 540000, mustFormula: true, mustReference: ["B4", "B5"],
          label: "EBITDA" },
        { cell: "B7", sheet: "P&L", expect: 0.225, tol: 0.001, mustFormula: true, mustReference: ["B6", "B2"],
          label: "EBITDA margin" }
      ],
      solution: { "P&L": { B4: "=B2+B3", B6: "=B4+B5", B7: "=B6/B2" } },
      // §15 — guidance attached to cells, revealed a rung at a time
      cellHints: {
        B4: {
          whatGoesHere: "Gross profit",
          hint: "Revenue plus the cost line — the cost is already negative, so you add.",
          pattern: "=Revenue + COGS"
        },
        B6: {
          whatGoesHere: "EBITDA",
          hint: "Gross profit plus operating expenses, which are also stored negative.",
          pattern: "=Gross profit + Operating expenses"
        },
        B7: {
          whatGoesHere: "EBITDA margin",
          hint: "A margin is always divided by revenue.",
          pattern: "=EBITDA / Revenue"
        }
      }
    },

    /* ---- MASTER (§2) ---- */
    challenge: {
      id: "ebitda-c1",
      type: "debug",
      prompt: "This P&L reports an EBITDA margin of 40% when the true figure is 22.5%. One cell is wrong. Which one?",
      brokenCell: "B6",
      nearMiss: ["B7"],
      nearMissWhy: "B7 is showing the wrong number, but only because it reads from a cell that's already wrong. Follow it upstream.",
      hints: [
        "The margin is computed from EBITDA, so check EBITDA before you blame the margin.",
        "40% of ₹24,00,000 is ₹9,60,000. What would have to be missing from the EBITDA line to make it that large?",
        "Operating expenses have not been subtracted."
      ],
      solution: "B6 omits operating expenses — it reads =B4 instead of =B4+B5. B7 is downstream and corrects itself once B6 is fixed."
    },

    /* ---- END OF LESSON (§36) ---- */
    takeaways: [
      "What EBITDA is, and which four charges it sits above",
      "How to compute it from revenue, and from EBIT upwards",
      "Why it makes companies with different debt and asset ages comparable",
      "Why it is not cash flow, and what that omission hides"
    ],

    sources: [
      { title: "Ind AS 1, Presentation of Financial Statements", org: "MCA", note: "EBITDA is not a line item any standard defines — this is what is." }
    ]
  };
});
