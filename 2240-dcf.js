/* ============================================================================
   2240 · DCF — ported from v1 and hand-finished.
   ----------------------------------------------------------------------------
   Every figure below is the output of company.js's own dcf(0.12, 0.04), the
   same function the v2 engine's tests exercise. Nothing here is estimated.
   ========================================================================= */
(function (root, factory) {
  var l = factory();
  if (typeof module === "object" && module.exports) module.exports = l;
  else { root.FinLessons = root.FinLessons || {}; root.FinLessons[l.id] = l; }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return {
    id: "2240-dcf",
    title: "Discounted cash flow",
    short: "DCF",
    level: "valuation",
    difficulty: "advanced",
    estimatedTime: 8,
    covers: ["DCF","Terminal value","Discount factors","Enterprise value","Equity value"],
    tags: ["dcf", "valuation", "wacc", "terminal value", "discount factor", "present value", "gordon growth"],
    summary: "Forecast the cash a business will generate, discount it for time and risk, and add up what it is worth today.",
    prerequisites: ["1330-balance-sheet"],
    relatedTopics: ["1330-balance-sheet", "1620-liquidity"],

    explanation: {
      short: "A business is worth the cash it will produce, discounted back to what that cash is worth today. Everything else in valuation is a shortcut to this.",
      beginner: "₹100 next year is not worth ₹100 today — you could have invested it, and it might not arrive. A DCF puts a number on that: forecast the cash the business will throw off, shrink each future year's cash by how far away and how risky it is, and add up the results. That total is what the business is worth.",
      intermediate: "Free cash flow is projected explicitly for a few years, then a terminal value stands in for everything after that. Each year's cash is multiplied by a discount factor of 1/(1+WACC)^n. The sum is enterprise value — the worth of the operating business. Subtract net debt and what remains belongs to shareholders.",
      advanced: "The Gordon growth terminal value, FCF×(1+g)/(WACC−g), is extraordinarily sensitive: as g approaches WACC the denominator collapses and the value runs away. In this café's model, 84% of enterprise value sits in the terminal value — a single formula resting on one assumption about the indefinite future. A DCF is best read as a structured statement of what you must believe, not as a price."
    },

    formula: {
      display: "Discount factor = 1 ÷ (1 + WACC)^n",
      alternate: "Terminal value = Final-year FCF × (1 + g) ÷ (WACC − g)",
      variables: [
        { symbol: "FCF", meaning: "Free cash flow — cash left after running and reinvesting in the business" },
        { symbol: "WACC", meaning: "Weighted average cost of capital: the return debt and equity together demand" },
        { symbol: "n", meaning: "Years into the future" },
        { symbol: "g", meaning: "The rate cash is assumed to grow at forever, which must be below WACC" }
      ],
      note: "Enterprise value = sum of discounted forecast cash + discounted terminal value. Equity value = enterprise value − net debt."
    },

    visualization: {
      type: "discount-bars",
      title: "What each future rupee is worth today",
      caption: "Raise the WACC and watch the far bars shrink faster than the near ones.",
      interactive: true,
      controls: [
        { label: "WACC", key: "wacc", min: 0.09, max: 0.16, step: 0.005, value: 0.12, fmt: "pct" },
        { label: "Terminal growth", key: "g", min: 0.00, max: 0.06, step: 0.005, value: 0.04, fmt: "pct" }
      ],
      bars: [
        { label: "FY26", raw: 289500, year: 1 },
        { label: "FY27", raw: 402000, year: 2 },
        { label: "FY28", raw: 535582, year: 3 },
        { label: "Beyond", raw: null, terminal: true }
      ],
      readouts: [
        { label: "Enterprise value", key: "ev", fmt: "inr" },
        { label: "From the terminal value", key: "tvShare", fmt: "pct" }
      ]
    },

    example: {
      company: "Bombay Bean Coffee Co.",
      period: "Valued at 31 March 2025, WACC 12%, terminal growth 4%",
      rows: [
        ["FY26 free cash flow", 289500], ["FY27 free cash flow", 402000], ["FY28 free cash flow", 535582],
        ["PV of FY26", 258482], ["PV of FY27", 320472], ["PV of FY28", 381217],
        ["Sum of forecast PVs", 960171],
        ["Terminal value at end FY28", 6962572], ["PV of terminal value", 4955822],
        ["ENTERPRISE VALUE", 5915993],
        ["Less: net debt", -450000],
        ["EQUITY VALUE", 5465993]
      ],
      walkthrough: "Three forecast years discounted at 12% come to ₹9,60,171. The terminal value — FY28's ₹5,35,582 grown 4% and divided by (12% − 4%) — is ₹69,62,572, worth ₹49,55,822 today. Enterprise value is ₹59,15,993. Take off the ₹4,50,000 of net debt and the equity is worth about ₹54,65,993, roughly 30× FY25 profit after tax."
    },

    whyItMatters: "Every multiple you will ever use — EV/EBITDA, P/E — is a shorthand for a DCF someone else has already done in their head. Understanding the DCF is what lets you tell whether a multiple is sensible or merely conventional, and it is the only valuation method that forces you to state your assumptions out loud.",

    commonMistakes: [
      { mistake: "Setting terminal growth close to WACC.", why: "The denominator (WACC − g) collapses and the value explodes. A terminal growth rate above long-run GDP growth says the business eventually becomes the whole economy." },
      { mistake: "Forgetting to discount the terminal value.", why: "It is a value at the END of the final forecast year, not today. It must be multiplied by that year's discount factor like everything else." },
      { mistake: "Subtracting gross debt instead of net debt.", why: "Cash on the balance sheet offsets borrowings. Here it is ₹5,50,000 loan less ₹1,00,000 cash = ₹4,50,000." },
      { mistake: "Discounting the wrong cash flow with the wrong rate.", why: "FCFF is cash to all providers of capital and is discounted at WACC, giving enterprise value. FCFE is cash to shareholders and is discounted at the cost of equity. Mixing them double-counts the debt." },
      { mistake: "Treating the output as a price.", why: "Move WACC by one point and the answer moves by lakhs. A DCF produces a range and a set of beliefs, not a number." }
    ],

    realWorld: [
      { field: "Investment banking", use: "The DCF is one of the three panels in every valuation football field in every pitch book." },
      { field: "Equity research", use: "Target prices are usually a DCF with the analyst's own growth and margin assumptions." },
      { field: "Private equity", use: "The same discounting machinery drives entry and exit values in an LBO." },
      { field: "Corporate finance", use: "Capital projects are approved on NPV, which is a DCF applied to one investment rather than a whole company." }
    ],

    practice: [
      {
        id: "dcf-p1", tier: "beginner", type: "numeric",
        prompt: "At a 12% discount rate, what is the discount factor for year 1? Give it to three decimals.",
        expect: 0.893, tol: 0.002,
        hints: ["A discount factor is always 1 divided by something.", "1 ÷ (1 + 0.12) raised to the power of the year number.", "1 ÷ 1.12."],
        solution: "1 ÷ (1.12)^1 = 0.893. A rupee arriving in a year is worth 89.3 paise today."
      },
      {
        id: "dcf-p2", tier: "practical", type: "numeric",
        prompt: "FY28 free cash flow is ₹5,35,582. With terminal growth of 4% and WACC of 12%, what is the terminal value at the end of FY28, in ₹?",
        expect: 6962572, tol: 5000,
        hints: [
          "Grow the final year's cash by one more year first.",
          "Then divide by the gap between the discount rate and the growth rate.",
          "5,35,582 × 1.04 ÷ (0.12 − 0.04)."
        ],
        solution: "₹5,35,582 × 1.04 ÷ 0.08 = ₹69,62,572."
      },
      {
        id: "dcf-p3", tier: "practical", type: "formula",
        prompt: "In the sandbox, C5 holds the year number and $B$2 holds WACC. Write the FY26 discount factor formula for C7.",
        accept: ["=1/(1+$B$2)^C5"],
        mustReference: ["B2", "C5"],
        expectValue: 0.8929,
        hints: [
          "It has to be filled across three columns, so think about which reference must not move.",
          "WACC lives in one cell for all three years — anchor it.",
          "The year number changes per column, so it stays relative."
        ],
        solution: "=1/(1+$B$2)^C5 — the $B$2 anchor is what lets you fill it right without the WACC reference drifting."
      },
      {
        id: "dcf-p4", tier: "application", type: "scenario",
        prompt: "WACC rises from 12% to 14%, everything else unchanged. What happens?",
        rows: [
          { label: "Discount factors", answer: "down" },
          { label: "PV of forecast years", answer: "down" },
          { label: "Terminal value", answer: "down" },
          { label: "Enterprise value", answer: "down" },
          { label: "Free cash flow", answer: "none" }
        ],
        hints: [
          "A higher discount rate makes every future rupee worth less today.",
          "The terminal value has WACC in its denominator too — check what a bigger (WACC − g) does.",
          "Does the discount rate change how much cash the café actually generates?"
        ],
        solution: "Every discount factor falls, so all present values fall. The terminal value falls twice over: its denominator (WACC − g) widens from 0.08 to 0.10, and it is then discounted harder. Enterprise value drops sharply. Free cash flow is unchanged — WACC is about what the cash is worth, not how much of it there is."
      },
      {
        id: "dcf-p5", tier: "application", type: "mcq",
        prompt: "Of the café's ₹59,15,993 enterprise value, ₹49,55,822 comes from the terminal value. What should you conclude?",
        options: [
          { text: "The model is broken — the terminal value should be smaller", correct: false, why: "Nothing is broken. A terminal value carrying 70–85% of a DCF is entirely normal for a growing business, which is precisely what makes the method uncomfortable." },
          { text: "The valuation depends mostly on an assumption about the distant future, not the years forecast in detail", correct: true, why: "Exactly. 84% of the answer rests on one growth rate applied beyond FY28. The three years modelled line by line contribute 16%. This is the honest, uncomfortable truth about every DCF, and it is why the sensitivity table matters more than the point estimate." },
          { text: "The forecast period should be shortened", correct: false, why: "Shortening it pushes even more weight onto the terminal value. Lengthening it moves weight the other way — but requires forecasting further out, which is its own problem." },
          { text: "The café is overvalued", correct: false, why: "The split tells you where the value comes from, not whether it is right. Overvaluation is a claim about the assumptions, not about the arithmetic." }
        ]
      },
      {
        id: "dcf-p6", tier: "challenge", type: "interpretation",
        prompt: "Someone sets terminal growth at 11% against a WACC of 12%. Explain both what happens to the number and why the assumption is indefensible.",
        keywords: [
          ["denominator", "wacc - g", "wacc − g", "0.01", "1%", "small", "collapse"],
          ["gdp", "economy", "forever", "faster than", "perpetuity", "whole economy"]
        ],
        hints: [
          "Write out the denominator of the terminal value formula with those numbers.",
          "Dividing by 0.01 instead of 0.08 does what to the result?",
          "Then ask what growing 11% a year forever implies about the size of the business in a century."
        ],
        solution: "The denominator becomes 0.01, so the terminal value is eight times larger than at 4% growth, and the valuation becomes almost entirely an artefact of that one input. It is indefensible because nothing grows faster than the economy forever — a business compounding at 11% in perpetuity eventually exceeds world GDP. Terminal growth should sit at or below long-run nominal GDP growth."
      }
    ],

    sandbox: {
      title: "Discounted cash flow — value the café",
      instructions: "Build the discount factors (C7:E7) as 1/(1+WACC)^year, anchoring the WACC with $B$2 so the formula fills across. Multiply for present values (C8:E8). Then the terminal value in B11, its present value in B12, enterprise value in B13, and equity value in B15.",
      sheets: [{
        name: "DCF",
        cells: {
          A1: "ASSUMPTIONS",
          A2: "WACC (discount rate)", B2: "0.12",
          A3: "Terminal growth rate", B3: "0.04",
          C4: "FY26", D4: "FY27", E4: "FY28",
          A5: "Year number", C5: "1", D5: "2", E5: "3",
          A6: "Free cash flow", C6: "289500", D6: "402000", E6: "535582",
          A7: "Discount factor", C7: "", D7: "", E7: "",
          A8: "Present value", C8: "", D8: "", E8: "",
          A10: "Sum of present values, FY26–28", B10: "",
          A11: "Terminal value at end FY28", B11: "",
          A12: "Present value of terminal value", B12: "",
          A13: "ENTERPRISE VALUE", B13: "",
          A14: "Less: net debt (loan − cash)", B14: "-450000",
          A15: "EQUITY VALUE", B15: ""
        },
        editable: ["C7", "D7", "E7", "C8", "D8", "E8", "B10", "B11", "B12", "B13", "B15"],
        formats: {
          B2: { type: "pct", dp: 1 }, B3: { type: "pct", dp: 1 },
          C5: { type: "number" }, D5: { type: "number" }, E5: { type: "number" },
          C6: { type: "currency", currency: "inr" }, D6: { type: "currency", currency: "inr" }, E6: { type: "currency", currency: "inr" },
          C7: { type: "x", dp: 3 }, D7: { type: "x", dp: 3 }, E7: { type: "x", dp: 3 },
          C8: { type: "currency", currency: "inr" }, D8: { type: "currency", currency: "inr" }, E8: { type: "currency", currency: "inr" },
          B10: { type: "currency", currency: "inr" }, B11: { type: "currency", currency: "inr" },
          B12: { type: "currency", currency: "inr" }, B13: { type: "currency", currency: "inr" },
          B14: { type: "currency", currency: "inr" }, B15: { type: "currency", currency: "inr" }
        }
      }],
      checks: [
        { cell: "C7", sheet: "DCF", expect: 0.8929, tol: 0.002, mustFormula: true, mustReference: ["B2", "C5"], label: "FY26 discount factor" },
        { cell: "E7", sheet: "DCF", expect: 0.7118, tol: 0.002, mustFormula: true, mustReference: ["B2"], label: "FY28 discount factor — the WACC anchor held" },
        { cell: "C8", sheet: "DCF", expect: 258482, tol: 500, mustFormula: true, mustReference: ["C6", "C7"], label: "FY26 present value" },
        { cell: "E8", sheet: "DCF", expect: 381217, tol: 500, mustFormula: true, label: "FY28 present value" },
        { cell: "B10", sheet: "DCF", expect: 960171, tol: 1500, mustFormula: true, mustUse: ["SUM"], label: "Sum of the three present values" },
        { cell: "B11", sheet: "DCF", expect: 6962572, tol: 3000, mustFormula: true, mustReference: ["E6", "B2", "B3"], label: "Terminal value (Gordon growth)" },
        { cell: "B12", sheet: "DCF", expect: 4955822, tol: 3000, mustFormula: true, mustReference: ["B11", "E7"], label: "Present value of the terminal value" },
        { cell: "B13", sheet: "DCF", expect: 5915993, tol: 4000, mustFormula: true, mustReference: ["B10", "B12"], label: "ENTERPRISE VALUE" },
        { cell: "B15", sheet: "DCF", expect: 5465993, tol: 4000, mustFormula: true, mustReference: ["B13", "B14"], label: "EQUITY VALUE" }
      ],
      solution: { DCF: { C7: "=1/(1+$B$2)^C5", D7: "=1/(1+$B$2)^D5", E7: "=1/(1+$B$2)^E5", C8: "=C6*C7", D8: "=D6*D7", E8: "=E6*E7", B10: "=SUM(C8:E8)", B11: "=E6*(1+B3)/(B2-B3)", B12: "=B11*E7", B13: "=B10+B12", B15: "=B13+B14" } },
      cellHints: {
        C7: { whatGoesHere: "Discount factor", hint: "One over (1 + WACC) to the power of the year. Anchor the WACC so it fills across.", pattern: "=1/(1+$B$2)^C5" },
        C8: { whatGoesHere: "Present value", hint: "The cash flow multiplied by its discount factor.", pattern: "=C6*C7" },
        B10: { whatGoesHere: "Sum of present values", hint: "Three cells, C8 to E8.", pattern: "=SUM(C8:E8)" },
        B11: { whatGoesHere: "Terminal value", hint: "Grow FY28 cash one more year, then divide by (WACC − g).", pattern: "=E6*(1+B3)/(B2-B3)" },
        B12: { whatGoesHere: "PV of terminal value", hint: "It sits at the end of FY28, so discount it with FY28's factor.", pattern: "=B11*E7" },
        B13: { whatGoesHere: "Enterprise value", hint: "The forecast years plus the terminal value.", pattern: "=B10+B12" },
        B15: { whatGoesHere: "Equity value", hint: "Net debt is already stored negative.", pattern: "=B13+B14" }
      },
      success: "Enterprise value about ₹59,16,000, equity value about ₹54,66,000 — roughly 30× FY25 profit. Note how much of it comes from the terminal value."
    },

    challenge: {
      id: "dcf-c1", type: "debug",
      prompt: "A learner filled the discount factor across C7:E7 and every present value now looks too high, with FY28 worst. C7 alone is correct. Which cell holds the root cause?",
      brokenCell: "C7",
      nearMiss: ["E7", "E8"],
      nearMissWhy: "E7 and E8 are both wrong, but they are wrong because they inherited a formula whose WACC reference drifted. The cell that was filled from is where the fault is.",
      hints: [
        "C7 is correct on its own. So what could be wrong with it?",
        "A formula can be right where it is written and wrong the moment it is filled.",
        "If $B$2 were written B2, what would D7 and E7 be dividing by?"
      ],
      solution: "C7 was written =1/(1+B2)^C5 without the anchor. It computes correctly in place, but filling right makes D7 reference C2 and E7 reference D2 — both empty, so the rate becomes zero and the discount factors become 1. The root cause is C7 even though C7 shows the right number; this is exactly why absolute references are the first thing checked in a model review."
    },

    takeaways: [
      "Why a future rupee is worth less than one today, and how the discount factor prices that",
      "How to build discount factors that survive being filled across",
      "The Gordon growth terminal value, and why g must stay well below WACC",
      "The difference between enterprise value and equity value",
      "That most of a DCF's answer usually lives in the terminal value — and what that should do to your confidence"
    ]
  };
});
