/* ============================================================================
   LEVEL 0 · Finance Foundations — part 3 of 3
   Topics: time value of money · compounding · inflation · present value
           future value · opportunity cost · risk vs reward
   ----------------------------------------------------------------------------
   This is the module the whole of valuation rests on. Everything in Level 5 is
   present value applied to a business.
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
  var INR = { type: "currency", currency: "inr" }, PCT = { type: "pct", dp: 1 };
  function f(cells, fmt) { var o = {}; cells.forEach(function (c) { o[c] = fmt; }); return o; }

  return [

  /* ==================================================================== */
  {
    id: "0160-time-value",
    title: "The time value of money",
    covers: ["Time value of money"],
    level: "foundations", difficulty: "beginner", estimatedTime: 6,
    tags: ["time value", "discounting", "present value", "opportunity cost"],
    summary: "A rupee today is worth more than a rupee next year. Everything in valuation is a consequence of this one sentence.",
    prerequisites: ["0130-interest"], relatedTopics: ["0190-present-value", "0200-future-value"],

    explanation: {
      short: "Money available now is worth more than the same amount later, because it can be put to work, because prices rise, and because the future payment might not arrive.",
      beginner: "Offered ₹1,00,000 today or ₹1,00,000 in a year, everybody takes today — and they are right. Today's rupee could sit in a bank earning interest, or buy something before prices rise, and it cannot fail to turn up. Those three reasons are the whole idea.",
      intermediate: "The rate that converts between the two is the discount rate. Going forward in time you multiply by (1 + r); coming back you divide. That single operation, applied to a stream of future cash, is a discounted cash flow valuation.",
      advanced: "The discount rate bundles three separable things: the real return for deferring consumption, expected inflation, and a risk premium for the specific claim. Debates about valuation are almost always debates about one of those three components rather than about the arithmetic, which is not in dispute."
    },

    formula: {
      display: "Future value = Present value × (1 + r)^n",
      alternate: "Present value = Future value ÷ (1 + r)^n",
      variables: [
        { symbol: "r", meaning: "The discount rate for one period" },
        { symbol: "n", meaning: "How many periods away the cash flow is" }
      ],
      note: "Same equation, rearranged. Multiply to go forward, divide to come back."
    },

    visualization: {
      type: "line", title: "What ₹1,00,000 received in year n is worth today", interactive: true,
      controls: [{ label: "Discount rate", key: "r", min: 0.04, max: 0.20, step: 0.01, value: 0.10, fmt: "pct" }],
      series: [{ label: "Present value", derive: "100000/(1+r)^t" }],
      caption: "Raise the rate and the far years flatten toward nothing. That is why long-dated cash flows are so sensitive to the discount rate."
    },

    example: {
      company: "Priya's choice",
      rows: [["₹1,00,000 today", 100000], ["₹1,00,000 in 1 year, at 10%", 90909],
             ["₹1,00,000 in 3 years, at 10%", 75131], ["₹1,00,000 in 10 years, at 10%", 38554]],
      walkthrough: "At a 10% discount rate, a promise of ₹1,00,000 a decade away is worth ₹38,554 today. Nothing about the promise changed — only how long you wait for it. This is why a business generating cash sooner is worth more than an identical one generating it later."
    },

    whyItMatters: "It is the foundation of every valuation method, every capital budgeting decision, every loan calculation and every pension question. Nothing in finance survives without it.",

    commonMistakes: [
      { mistake: "Adding cash flows from different years together.", why: "₹100 next year and ₹100 in five years are different amounts. They must be brought to the same date before adding." },
      { mistake: "Using one discount rate for everything.", why: "The rate should reflect the risk of that particular cash flow. A government bond and a startup do not share a discount rate." },
      { mistake: "Thinking the discount rate is just inflation.", why: "Inflation is one component. The others are the real return and the risk premium." }
    ],

    realWorld: [
      { field: "Valuation", use: "A DCF is this formula applied to a forecast, and nothing more." },
      { field: "Corporate finance", use: "NPV decides whether a project is worth doing." },
      { field: "Personal finance", use: "Lump sum or annuity, rent or buy, loan or savings — all the same comparison." }
    ],

    practice: [
      { id: "t1", tier: "beginner", type: "mcq",
        prompt: "Why is ₹1,00,000 today worth more than ₹1,00,000 in a year?",
        options: [
          { text: "Because ₹1,00,000 will be a smaller number next year", correct: false, why: "The number is identical. What changes is what it can buy and what it could have earned." },
          { text: "Because it can be invested, prices rise, and the future payment is not certain", correct: true, why: "All three reasons at once: opportunity cost, inflation, and risk. Every discount rate is built from them." },
          { text: "Because banks charge fees", correct: false, why: "Fees exist but are not the reason. The idea holds even with no bank involved." },
          { text: "It isn't — ₹1,00,000 is ₹1,00,000", correct: false, why: "The amount is the same; the value is not. That distinction is the whole lesson." }
        ] },
      { id: "t2", tier: "practical", type: "numeric",
        prompt: "What is ₹1,00,000 received in one year worth today, at a 10% discount rate? Answer in ₹.",
        expect: 90909, tol: 50,
        hints: ["Coming back in time means dividing.", "Divide by (1 + 0.10).", "1,00,000 ÷ 1.10."],
        solution: "₹1,00,000 ÷ 1.10 = ₹90,909." },
      { id: "t3", tier: "application", type: "numeric",
        prompt: "What is ₹1,00,000 received in three years worth today, at 10%? Answer in ₹.",
        expect: 75131, tol: 100,
        hints: ["Three years means three divisions.", "Divide by 1.10 three times, or by 1.10^3.", "1,00,000 ÷ 1.331."],
        solution: "₹1,00,000 ÷ 1.10³ = ₹75,131." },
      { id: "t4", tier: "challenge", type: "interpretation",
        prompt: "Two businesses each produce ₹10,00,000 of total cash over five years. One earns it evenly; the other earns nothing until year five. Which is worth more today, and why?",
        keywords: [["even", "earlier", "sooner", "first", "spread"], ["discount", "present value", "time", "wait", "less"]],
        hints: ["Both totals are identical. What differs is timing.", "What does discounting do to a cash flow five years out?"],
        solution: "The one earning evenly is worth more. Its early cash is discounted less, and it can be reinvested sooner. Identical totals, different present values — which is why 'total cash generated' is never a valuation and 'when' is half the question."
      } ],

    sandbox: {
      title: "What is a future rupee worth today?",
      instructions: "Build the discount factor for each year, then apply it to ₹1,00,000. Anchor the rate with $B$1 so the formula fills down the column.",
      sheets: [{
        name: "Time value",
        cells: {
          A1: "Discount rate", B1: "0.10",
          A2: "Amount received", B2: "100000",
          A4: "Years away", B4: "Discount factor", C4: "Value today",
          A5: "1", B5: "", C5: "",
          A6: "3", B6: "", C6: "",
          A7: "5", B7: "", C7: "",
          A8: "10", B8: "", C8: "",
          A10: "Value lost by waiting 10 years", B10: "",
          A11: "As a share of the amount", B11: ""
        },
        editable: ["B5", "C5", "B6", "C6", "B7", "C7", "B8", "C8", "B10", "B11"],
        formats: Object.assign(f(["B2", "C5", "C6", "C7", "C8", "B10"], INR),
          { B1: PCT, B11: PCT, B5: { type: "x", dp: 3 }, B6: { type: "x", dp: 3 }, B7: { type: "x", dp: 3 }, B8: { type: "x", dp: 3 } })
      }],
      checks: [
        { cell: "B5", sheet: "Time value", expect: 0.9091, tol: 0.002, mustFormula: true, mustReference: ["B1", "A5"], label: "Year 1 discount factor" },
        { cell: "B8", sheet: "Time value", expect: 0.3855, tol: 0.002, mustFormula: true, mustReference: ["B1"], label: "Year 10 factor — the anchor held" },
        { cell: "C5", sheet: "Time value", expect: 90909, tol: 100, mustFormula: true, mustReference: ["B2", "B5"], label: "Year 1 value today" },
        { cell: "C8", sheet: "Time value", expect: 38554, tol: 100, mustFormula: true, label: "Year 10 value today" },
        { cell: "B10", sheet: "Time value", expect: 61446, tol: 150, mustFormula: true, mustReference: ["B2", "C8"], label: "Value lost by waiting" },
        { cell: "B11", sheet: "Time value", expect: 0.6145, tol: 0.005, mustFormula: true, mustReference: ["B10", "B2"], label: "As a share" }
      ],
      solution: {
        "Time value": {
          B5: "=1/(1+$B$1)^A5", C5: "=$B$2*B5", B6: "=1/(1+$B$1)^A6", C6: "=$B$2*B6",
          B7: "=1/(1+$B$1)^A7", C7: "=$B$2*B7", B8: "=1/(1+$B$1)^A8", C8: "=$B$2*B8",
          B10: "=B2-C8", B11: "=B10/B2"
        }
      },
      cellHints: {
        B5: { whatGoesHere: "Discount factor", hint: "One divided by (1 + rate) to the power of the year. Anchor the rate.", pattern: "=1/(1+$B$1)^years" }
      },
      success: "A promise of ₹1,00,000 in ten years is worth ₹38,554 today — 61% of the value evaporates purely from waiting. Change the rate in B1 to 15% and watch it fall further. You have just built the engine of every DCF."
    },

    challenge: {
      id: "t-c1", type: "numeric",
      prompt: "At what discount rate is ₹1,00,000 in five years worth exactly ₹50,000 today? Answer as a percentage, to the nearest whole number.",
      expect: 0.1487, tol: 0.01,
      hints: [
        "You need (1+r)^5 = 2 — the money must halve when discounted.",
        "So (1+r) = 2^(1/5).",
        "2^0.2 = 1.1487."
      ],
      solution: "About 14.9%. This is the Rule of 72 in reverse: 72 ÷ 5 ≈ 14.4%, close to the exact answer. When someone tells you a five-year projection is worth half its face value, they are telling you their discount rate is about 15%."
    },

    takeaways: [
      "A rupee today beats a rupee later — opportunity, inflation and risk",
      "Multiply by (1+r) to go forward, divide to come back",
      "Cash flows from different years cannot be added until brought to one date",
      "Long-dated cash is extremely sensitive to the discount rate"
    ]
  },

  /* ==================================================================== */
  {
    id: "0170-compounding",
    title: "Compounding",
    covers: ["Compounding"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["compounding", "growth", "exponential", "rule of 72", "cagr"],
    summary: "Growth applied to a base that keeps growing. Slow at first, then it dominates every other consideration.",
    prerequisites: ["0130-interest"], relatedTopics: ["0200-future-value", "0180-inflation"],

    explanation: {
      short: "Compounding is growth on a base that already includes previous growth. It is multiplicative, not additive, so intuition built on straight lines fails badly.",
      beginner: "Save ₹10,000 a year at 8%. After ten years you have not saved ₹1,00,000 — you have about ₹1,56,000, because early contributions have been earning for nine years. The extra ₹56,000 is money your money made.",
      intermediate: "Two levers dominate: the rate and the number of periods, and the second matters more than people expect because it sits in the exponent. Ten years at 12% beats twenty at 6% by a wide margin — the same total 'rate-years' produce very different results.",
      advanced: "Compounding is why CAGR is the right summary of multi-period growth and arithmetic averaging is wrong; why fees quoted as 1% a year cost far more than 1% of a portfolio over decades; and why any forecast with a growth rate above the discount rate produces an infinite value if extended forever. That last fact is what constrains terminal growth in a DCF."
    },

    formula: {
      display: "Final = Initial × (1 + r)^n",
      alternate: "Rule of 72: years to double ≈ 72 ÷ rate as a percentage",
      note: "The rule of 72 is accurate to within a few months for rates between about 5% and 15%."
    },

    example: {
      company: "₹10,000 a year for thirty years at 8%",
      walkthrough: "₹3,00,000 contributed. Final balance about ₹12,23,000. More than ₹9,00,000 of it — three quarters — is growth rather than contribution. In the first decade contributions dominate; in the third, growth does. That crossover is what people underestimate."
    },

    whyItMatters: "It explains retirement saving, why debt at 36% is catastrophic, why fees matter, and why a company growing 15% a year is worth so much more than one growing 10% — the gap widens every year.",

    commonMistakes: [
      { mistake: "Thinking of growth as addition.", why: "Ten years at 10% is not +100%, it is +159%. The base moves every year." },
      { mistake: "Averaging growth rates arithmetically.", why: "Use CAGR. The arithmetic mean of percentage changes overstates the compounded result." },
      { mistake: "Underrating small rate differences.", why: "8% versus 10% over thirty years is ₹10.1 lakh versus ₹17.4 lakh on the same ₹1 lakh. Two points, a 70% difference." }
    ],

    realWorld: [
      { field: "Personal finance", use: "Starting to save at 25 rather than 35 roughly doubles the outcome at 60." },
      { field: "Valuation", use: "Terminal growth must stay below the discount rate or the formula breaks entirely." },
      { field: "Credit", use: "Revolving card debt compounds monthly, which is why balances outrun payments." }
    ],

    practice: [
      { id: "c1", tier: "beginner", type: "numeric",
        prompt: "₹1,00,000 growing at 8% a year for 10 years. What is the final amount, in ₹?",
        expect: 215892, tol: 500,
        hints: ["Multiply by 1.08 ten times.", "1,00,000 × 1.08^10."],
        solution: "₹2,15,892 — more than double, from a rate that adds only 8 points a year." },
      { id: "c2", tier: "practical", type: "numeric",
        prompt: "Roughly how many years to double your money at 8%, using the rule of 72?",
        expect: 9, tol: 0.5,
        hints: ["Divide 72 by the rate as a whole number.", "72 ÷ 8."],
        solution: "9 years. The exact answer is 9.01 years, so the shortcut is excellent here." },
      { id: "c3", tier: "application", type: "numeric",
        prompt: "₹1,00,000 at 10% for 30 years, versus at 8% for 30 years. What is the difference in the final amounts, in ₹?",
        expect: 738000, tol: 20000,
        hints: ["Compute both, then subtract.", "1,00,000 × 1.10^30 = 17,44,940.", "1,00,000 × 1.08^30 = 10,06,266."],
        solution: "About ₹7,38,000. Two percentage points became a difference larger than seven times the original investment." },
      { id: "c4", tier: "challenge", type: "interpretation",
        prompt: "A fund charges 1% a year. Over 30 years at an 8% gross return, why does that 1% cost far more than 30% of one year's fee?",
        keywords: [["compound", "growth", "each year", "base", "forgone", "lost growth"], ["1", "one percent", "7", "smaller", "less"]],
        hints: [
          "Net return becomes 7%, not 8%.",
          "Compute 1.07^30 against 1.08^30.",
          "The fee removes not just the rupee but everything that rupee would have earned."
        ],
        solution: "At 8% gross, ₹1,00,000 becomes ₹10,06,266. At 7% net it becomes ₹7,61,226 — a gap of ₹2,45,000, roughly 24% of the gross outcome, from a fee of 1% a year. Each rupee taken is also a rupee that stops compounding, so the cost grows with the horizon."
      } ],

    sandbox: {
      title: "Watch compounding take over",
      instructions: "Build a savings schedule: each year's opening balance, growth, contribution and closing balance. Then split the final total into what you put in and what growth added.",
      sheets: [{
        name: "Compounding",
        cells: {
          A1: "Annual contribution", B1: "10000",
          A2: "Growth rate", B2: "0.08",
          A4: "Year", B4: "Opening", C4: "Growth", D4: "Contribution", E4: "Closing",
          A5: "1", B5: "0", C5: "", D5: "", E5: "",
          A6: "2", B6: "", C6: "", D6: "", E6: "",
          A7: "3", B7: "", C7: "", D7: "", E7: "",
          A8: "4", B8: "", C8: "", D8: "", E8: "",
          A9: "5", B9: "", C9: "", D9: "", E9: "",
          A11: "Total contributed over 5 years", B11: "",
          A12: "Total growth over 5 years", B12: "",
          A13: "Growth as a share of the final balance", B13: ""
        },
        editable: ["C5", "D5", "E5", "B6", "C6", "D6", "E6", "B7", "C7", "D7", "E7",
                   "B8", "C8", "D8", "E8", "B9", "C9", "D9", "E9", "B11", "B12", "B13"],
        formats: Object.assign(
          f(["B1", "B5", "C5", "D5", "E5", "B6", "C6", "D6", "E6", "B7", "C7", "D7", "E7",
             "B8", "C8", "D8", "E8", "B9", "C9", "D9", "E9", "B11", "B12"], INR),
          { B2: PCT, B13: PCT })
      }],
      checks: [
        { cell: "C5", sheet: "Compounding", expect: 0, tol: 1, mustFormula: true, mustReference: ["B5", "B2"], label: "Year 1 growth (nothing to grow yet)" },
        { cell: "E5", sheet: "Compounding", expect: 10000, tol: 1, mustFormula: true, mustReference: ["B5", "C5", "D5"], label: "Year 1 closing" },
        { cell: "B6", sheet: "Compounding", expect: 10000, tol: 1, mustFormula: true, mustReference: ["E5"], label: "Year 2 opens where year 1 closed" },
        { cell: "E9", sheet: "Compounding", expect: 58666, tol: 200, mustFormula: true, label: "Year 5 closing balance" },
        { cell: "B11", sheet: "Compounding", expect: 50000, tol: 10, mustFormula: true, mustUse: ["SUM"], label: "Total contributed via SUM" },
        { cell: "B12", sheet: "Compounding", expect: 8666, tol: 200, mustFormula: true, mustUse: ["SUM"], label: "Total growth via SUM" },
        { cell: "B13", sheet: "Compounding", expect: 0.1477, tol: 0.01, mustFormula: true, mustReference: ["B12", "E9"], label: "Growth share" }
      ],
      solution: {
        Compounding: {
          C5: "=B5*$B$2", D5: "=$B$1", E5: "=B5+C5+D5",
          B6: "=E5", C6: "=B6*$B$2", D6: "=$B$1", E6: "=B6+C6+D6",
          B7: "=E6", C7: "=B7*$B$2", D7: "=$B$1", E7: "=B7+C7+D7",
          B8: "=E7", C8: "=B8*$B$2", D8: "=$B$1", E8: "=B8+C8+D8",
          B9: "=E8", C9: "=B9*$B$2", D9: "=$B$1", E9: "=B9+C9+D9",
          B11: "=SUM(D5:D9)", B12: "=SUM(C5:C9)", B13: "=B12/E9"
        }
      },
      cellHints: {
        B6: { whatGoesHere: "Opening balance", hint: "A roll-forward: this year opens where last year closed.", pattern: "=previous closing" },
        C5: { whatGoesHere: "Growth", hint: "Only the opening balance grows. Anchor the rate so the column fills.", pattern: "=opening × $rate$" }
      },
      success: "₹50,000 contributed, ₹8,666 of growth — 15% of the balance after five years. Add rows out to year thirty and that share passes 75%. The schedule you just built is the same roll-forward structure every debt and depreciation schedule uses."
    },

    challenge: {
      id: "c-c1", type: "numeric",
      prompt: "Priya starts saving ₹10,000 a year at 25; Raj starts the same at 35. Both stop at 60 and earn 8%. Priya contributed ₹3,50,000 and Raj ₹2,50,000. Roughly how many times Raj's final balance is Priya's?",
      expect: 2.3, tol: 0.4,
      hints: [
        "Priya has 35 years of contributions, Raj has 25.",
        "An annuity's future value is contribution × ((1+r)^n − 1) ÷ r.",
        "Priya: 10,000 × (1.08^35 − 1)/0.08. Raj: the same with 25."
      ],
      solution: "Priya ends around ₹17,25,000 and Raj around ₹7,31,000 — about 2.4 times as much, from contributing only 40% more. The extra ten years sat in the exponent, and that is the whole argument for starting early."
    },

    takeaways: [
      "Compounding is multiplicative — intuition built on straight lines fails",
      "Time sits in the exponent, which is why starting early dominates",
      "Small rate differences become enormous over long horizons",
      "Fees compound against you exactly as returns compound for you"
    ]
  },

  /* ==================================================================== */
  {
    id: "0180-inflation",
    title: "Inflation",
    covers: ["Inflation"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["inflation", "real", "nominal", "purchasing power", "cpi"],
    summary: "Prices rising means money falling. The number in your account can grow while what it buys shrinks.",
    prerequisites: ["0170-compounding"], relatedTopics: ["0160-time-value", "0150-return"],

    explanation: {
      short: "Inflation is a general rise in prices, which is the same thing as a fall in what each rupee buys. A return that does not beat it is a loss in real terms.",
      beginner: "A cup of coffee at ₹120 today might cost ₹126 next year at 5% inflation. If your savings earned 4%, you have more rupees and slightly fewer cups. Your bank balance grew and you got poorer.",
      intermediate: "Nominal figures are the rupees; real figures are adjusted for inflation. The quick approximation is real ≈ nominal − inflation; the exact relation is (1 + nominal) ÷ (1 + inflation) − 1, which matters once rates get large.",
      advanced: "Inflation redistributes: it favours borrowers with fixed-rate debt, who repay with cheaper rupees, and penalises fixed-income holders. Central banks target it because both high and negative inflation are destabilising. In modelling, consistency is what matters — nominal cash flows must be discounted at nominal rates, real at real, and mixing them is a common and serious error."
    },

    formula: {
      display: "Real return ≈ Nominal return − Inflation",
      alternate: "Exactly: (1 + nominal) ÷ (1 + inflation) − 1",
      note: "The approximation is fine at low rates and drifts as rates rise."
    },

    example: {
      company: "A cup of coffee",
      rows: [["Price today", 120], ["After 5 years at 5%", 153], ["After 10 years at 5%", 195], ["After 20 years at 5%", 318]],
      walkthrough: "At 5% inflation a ₹120 coffee costs ₹318 in twenty years. Equivalently, ₹120 kept under a mattress buys 38% of what it does today. Nothing was stolen; prices simply moved."
    },

    whyItMatters: "Every long-horizon financial decision — retirement, a thirty-year lease, a DCF running to a terminal value — is wrong if inflation is ignored. It is also why 'my savings account is safe' is only half true.",

    commonMistakes: [
      { mistake: "Comparing amounts across years without adjusting.", why: "A ₹50,000 salary in 2005 and 2025 are different salaries. Comparisons need a common basis." },
      { mistake: "Treating a positive nominal return as a gain.", why: "4% in a 6% inflation environment is a 2% real loss, however pleasant the statement looks." },
      { mistake: "Mixing real and nominal in one model.", why: "Real cash flows discounted at a nominal rate understate value badly. Pick one and stay in it." }
    ],

    realWorld: [
      { field: "Valuation", use: "Terminal growth is usually anchored to long-run nominal GDP, which is real growth plus inflation." },
      { field: "Personal finance", use: "Retirement targets are meaningless unless expressed in real terms." },
      { field: "Credit", use: "Unexpected inflation is good for fixed-rate borrowers and bad for lenders." }
    ],

    practice: [
      { id: "n1", tier: "beginner", type: "numeric",
        prompt: "Savings earn 4% while inflation runs at 6%. What is the approximate real return, as a percentage? Answer as a negative decimal.",
        expect: -0.02, tol: 0.004,
        hints: ["Real is roughly nominal less inflation.", "4% − 6%."],
        solution: "About −2%. More rupees, less purchasing power." },
      { id: "n2", tier: "practical", type: "numeric",
        prompt: "A ₹120 coffee at 5% inflation. What does it cost in 10 years, in ₹?",
        expect: 195, tol: 3,
        hints: ["Prices compound like anything else.", "120 × 1.05^10."],
        solution: "₹195." },
      { id: "n3", tier: "application", type: "numeric",
        prompt: "Nominal return 9%, inflation 5%. What is the exact real return, as a percentage?",
        expect: 0.0381, tol: 0.003,
        hints: ["The approximation gives 4%. The exact answer is slightly lower.", "1.09 ÷ 1.05 − 1."],
        solution: "1.09 ÷ 1.05 − 1 = 3.81%, not 4%. The gap widens as rates rise — at 20% and 15% the approximation is off by nearly a full point." },
      { id: "n4", tier: "challenge", type: "interpretation",
        prompt: "Priya has a fixed-rate home loan at 8%. Inflation unexpectedly rises to 10% and stays there. Is she better or worse off, and who bears it?",
        keywords: [["better", "gains", "benefit", "helps her", "wins"], ["lender", "bank", "cheaper rupees", "real value", "erode", "repay"]],
        hints: [
          "Her payment is fixed in rupees. What is happening to the value of a rupee?",
          "Her income probably rises with inflation; her instalment does not.",
          "If she gains, someone must be losing."
        ],
        solution: "She is better off. Her instalment is fixed in nominal rupees while wages and prices rise around it, so the real burden falls every year — she repays with cheaper money. The bank bears the loss: it receives the contracted rupees, now worth less than it expected. This transfer from lenders to fixed-rate borrowers is one of the most reliable consequences of unexpected inflation."
      } ],

    sandbox: {
      title: "Nominal against real",
      instructions: "Track a savings balance and the price of a coffee side by side, then work out how many cups the balance buys in each year. The rupees rise; watch the cups.",
      sheets: [{
        name: "Inflation",
        cells: {
          A1: "Starting savings", B1: "100000",
          A2: "Interest rate", B2: "0.04",
          A3: "Coffee price today", B3: "120",
          A4: "Inflation rate", B4: "0.06",
          A6: "Year", B6: "Savings", C6: "Coffee price", D6: "Cups affordable",
          A7: "0", B7: "100000", C7: "120", D7: "",
          A8: "5", B8: "", C8: "", D8: "",
          A9: "10", B9: "", C9: "", D9: "",
          A10: "20", B10: "", C10: "", D10: "",
          A12: "Cups lost over 20 years", B12: "",
          A13: "Real return over 20 years", B13: ""
        },
        editable: ["D7", "B8", "C8", "D8", "B9", "C9", "D9", "B10", "C10", "D10", "B12", "B13"],
        formats: Object.assign(
          f(["B1", "B7", "B8", "B9", "B10"], INR),
          { B2: PCT, B4: PCT, B13: PCT, C7: INR, C8: INR, C9: INR, C10: INR })
      }],
      checks: [
        { cell: "D7", sheet: "Inflation", expect: 833, tol: 5, mustFormula: true, mustReference: ["B7", "C7"], label: "Cups today" },
        { cell: "B10", sheet: "Inflation", expect: 219112, tol: 2000, mustFormula: true, mustReference: ["B1", "B2"], label: "Savings after 20 years" },
        { cell: "C10", sheet: "Inflation", expect: 384.86, tol: 5, mustFormula: true, mustReference: ["B3", "B4"], label: "Coffee price after 20 years" },
        { cell: "D10", sheet: "Inflation", expect: 569, tol: 8, mustFormula: true, mustReference: ["B10", "C10"], label: "Cups after 20 years" },
        { cell: "B12", sheet: "Inflation", expect: 264, tol: 10, mustFormula: true, mustReference: ["D7", "D10"], label: "Cups lost" },
        { cell: "B13", sheet: "Inflation", expect: -0.3168, tol: 0.02, mustFormula: true, mustReference: ["D10", "D7"], label: "Real return over the period" }
      ],
      solution: {
        Inflation: {
          D7: "=B7/C7",
          B8: "=$B$1*(1+$B$2)^A8", C8: "=$B$3*(1+$B$4)^A8", D8: "=B8/C8",
          B9: "=$B$1*(1+$B$2)^A9", C9: "=$B$3*(1+$B$4)^A9", D9: "=B9/C9",
          B10: "=$B$1*(1+$B$2)^A10", C10: "=$B$3*(1+$B$4)^A10", D10: "=B10/C10",
          B12: "=D7-D10", B13: "=D10/D7-1"
        }
      },
      cellHints: {
        D7: { whatGoesHere: "Cups affordable", hint: "Savings divided by the price of one cup.", pattern: "=savings ÷ price" },
        B13: { whatGoesHere: "Real return", hint: "Measured in cups, not rupees. That is what real means.", pattern: "=end cups ÷ start cups − 1" }
      },
      success: "Savings more than double in rupees — ₹1,00,000 to ₹2,19,112 — while the cups they buy fall from 833 to 569. A 119% nominal gain is a 32% real loss. This is the single most useful spreadsheet a young saver can build."
    },

    challenge: {
      id: "n-c1", type: "numeric",
      prompt: "What interest rate would have been needed to keep the 833 cups intact over 20 years, given 6% inflation? Answer as a percentage.",
      expect: 0.06, tol: 0.005,
      hints: [
        "To hold purchasing power constant, savings must grow exactly as fast as prices.",
        "What rate matches 6% inflation?",
        "The real return needs to be zero."
      ],
      solution: "6% — exactly the inflation rate, giving a real return of zero. Anything less loses ground. This is why 'beating inflation' is the minimum bar for a saver rather than an ambition, and why a savings account paying 4% in a 6% world is a slow, guaranteed loss."
    },

    takeaways: [
      "Inflation is prices rising, which is money buying less",
      "Nominal is rupees; real is purchasing power",
      "A nominal gain can be a real loss",
      "Never mix real cash flows with nominal discount rates"
    ]
  },

  /* ==================================================================== */
  {
    id: "0190-present-value",
    title: "Present value",
    covers: ["Present value"],
    level: "foundations", difficulty: "beginner", estimatedTime: 6,
    tags: ["present value", "npv", "discounting", "valuation"],
    summary: "What a future amount — or a whole stream of them — is worth today. This is the calculation valuation is made of.",
    prerequisites: ["0160-time-value"], relatedTopics: ["0200-future-value", "0210-opportunity-cost"],

    explanation: {
      short: "Present value is a future cash flow divided by (1 + r)^n. Net present value is the sum of those for every cash flow in a project, including the negative one at the start.",
      beginner: "Someone offers you ₹50,000 a year for three years. That is ₹1,50,000 in total, but not ₹1,50,000 today. Discount each payment for how long you wait, add them up, and you get what the promise is actually worth now.",
      intermediate: "NPV is the decision rule: sum the present values of all cash flows, inflows and outflows. If it is positive at your required rate, the project creates value; if negative, it does not. It is the cleanest capital budgeting rule there is because it deals in absolute value created rather than percentages.",
      advanced: "NPV's rival, IRR, is the rate at which NPV is zero — intuitive but flawed with non-conventional cash flow signs and misleading when comparing projects of different scale. Where they disagree, NPV is right, because ₹10 lakh of value created beats a higher percentage on ₹1 lakh."
    },

    formula: {
      display: "PV = Cash flow ÷ (1 + r)^n",
      alternate: "NPV = Σ PV of all cash flows, including the initial outflow",
      note: "In a spreadsheet, NPV() discounts from period 1 — an initial outflow at time zero is added separately, not included in the range."
    },

    example: {
      company: "Anil's second cart",
      rows: [["Cost today", -40000], ["Year 1 cash", 18000], ["Year 2 cash", 18000], ["Year 3 cash", 18000],
             ["PV of the three years at 12%", 43233], ["NPV", 3233]],
      walkthrough: "₹54,000 of cash arriving over three years is worth ₹43,233 today at 12%. Against a ₹40,000 cost, the NPV is ₹3,233 — positive, so the cart is worth buying at that required return. Raise the required return to 16% and the NPV turns negative."
    },

    whyItMatters: "NPV is the decision rule behind capital budgeting and the arithmetic behind DCF valuation. When Level 5 values the café, it is doing exactly this with more rows.",

    commonMistakes: [
      { mistake: "Including the year-zero outflow inside a spreadsheet NPV range.", why: "The function discounts the first value by one period. Money spent today should not be discounted at all — add it outside." },
      { mistake: "Summing undiscounted cash flows to judge a project.", why: "That is the payback method, and it ignores both timing and everything after the payback date." },
      { mistake: "Using the same discount rate for every project.", why: "The rate should reflect that project's risk, not the company's average." }
    ],

    realWorld: [
      { field: "Corporate finance", use: "Every capital approval memo turns on an NPV." },
      { field: "Valuation", use: "A DCF is an NPV where the project is an entire company." },
      { field: "Infrastructure", use: "Thirty-year concessions live or die on the discount rate chosen." }
    ],

    practice: [
      { id: "p1", tier: "beginner", type: "numeric",
        prompt: "₹50,000 received in two years, discounted at 10%. What is its present value, in ₹?",
        expect: 41322, tol: 50,
        hints: ["Divide by (1.10) twice.", "50,000 ÷ 1.21."],
        solution: "₹41,322." },
      { id: "p2", tier: "practical", type: "numeric",
        prompt: "₹18,000 a year for three years at 12%. What is the total present value, in ₹?",
        expect: 43233, tol: 150,
        hints: ["Discount each year separately, then add.", "18,000/1.12 + 18,000/1.12² + 18,000/1.12³."],
        solution: "₹16,071 + ₹14,349 + ₹12,813 = ₹43,233." },
      { id: "p3", tier: "application", type: "numeric",
        prompt: "The cart costs ₹40,000 today and returns that ₹43,233 of present value. What is the NPV, in ₹?",
        expect: 3233, tol: 150,
        hints: ["The cost is a cash flow too, at time zero.", "It is not discounted — it happens now.", "43,233 − 40,000."],
        solution: "₹3,233. Positive, so at a 12% required return the cart adds value." },
      { id: "p4", tier: "challenge", type: "interpretation",
        prompt: "At 12% the cart's NPV is +₹3,233; at 18% it is negative. The cart has not changed. What has?",
        keywords: [["required", "discount rate", "hurdle", "expectation", "risk", "alternative"], ["higher", "raised", "increase", "more"]],
        hints: ["The cash flows are identical in both cases.", "What does a higher discount rate represent?", "What is the highest rate at which it still breaks even?"],
        solution: "Only the required return changed. A higher discount rate means better alternatives elsewhere, or more perceived risk, or higher inflation — so the same cash must clear a higher bar. The rate at which NPV hits exactly zero is the IRR, about 16.6% here, and it is the honest summary of what this cart offers."
      } ],

    sandbox: {
      title: "Should Anil buy the second cart?",
      instructions: "Discount each year's cash, total the present values, then subtract the cost to get NPV. Anchor the rate so the discount factors fill across.",
      sheets: [{
        name: "NPV",
        cells: {
          A1: "Required return", B1: "0.12",
          A2: "Cost today", B2: "-40000",
          A4: "Year", B4: "1", C4: "2", D4: "3",
          A5: "Cash flow", B5: "18000", C5: "18000", D5: "18000",
          A6: "Discount factor", B6: "", C6: "", D6: "",
          A7: "Present value", B7: "", C7: "", D7: "",
          A9: "Sum of present values", B9: "",
          A10: "NET PRESENT VALUE", B10: "",
          A12: "Total undiscounted cash (for contrast)", B12: "",
          A13: "Value lost to discounting", B13: ""
        },
        editable: ["B6", "C6", "D6", "B7", "C7", "D7", "B9", "B10", "B12", "B13"],
        formats: Object.assign(
          f(["B2", "B5", "C5", "D5", "B7", "C7", "D7", "B9", "B10", "B12", "B13"], INR),
          { B1: PCT, B6: { type: "x", dp: 3 }, C6: { type: "x", dp: 3 }, D6: { type: "x", dp: 3 } })
      }],
      checks: [
        { cell: "B6", sheet: "NPV", expect: 0.8929, tol: 0.002, mustFormula: true, mustReference: ["B1", "B4"], label: "Year 1 discount factor" },
        { cell: "D6", sheet: "NPV", expect: 0.7118, tol: 0.002, mustFormula: true, mustReference: ["B1"], label: "Year 3 factor — anchor held" },
        { cell: "B7", sheet: "NPV", expect: 16071, tol: 50, mustFormula: true, mustReference: ["B5", "B6"], label: "Year 1 present value" },
        { cell: "B9", sheet: "NPV", expect: 43233, tol: 150, mustFormula: true, mustUse: ["SUM"], label: "Sum of PVs via SUM" },
        { cell: "B10", sheet: "NPV", expect: 3233, tol: 150, mustFormula: true, mustReference: ["B9", "B2"], label: "NPV" },
        { cell: "B12", sheet: "NPV", expect: 54000, tol: 10, mustFormula: true, mustUse: ["SUM"], label: "Undiscounted cash" },
        { cell: "B13", sheet: "NPV", expect: 10767, tol: 200, mustFormula: true, mustReference: ["B12", "B9"], label: "Lost to discounting" }
      ],
      solution: {
        NPV: {
          B6: "=1/(1+$B$1)^B4", C6: "=1/(1+$B$1)^C4", D6: "=1/(1+$B$1)^D4",
          B7: "=B5*B6", C7: "=C5*C6", D7: "=D5*D6",
          B9: "=SUM(B7:D7)", B10: "=B9+B2", B12: "=SUM(B5:D5)", B13: "=B12-B9"
        }
      },
      cellHints: {
        B10: { whatGoesHere: "NPV", hint: "The cost is stored negative, so add it.", pattern: "=sum of PVs + cost" },
        B13: { whatGoesHere: "Lost to discounting", hint: "The difference between counting the rupees and valuing them.", pattern: "=undiscounted − discounted" }
      },
      success: "NPV +₹3,233 — buy the cart. And note B13: ₹10,767 of the headline ₹54,000 disappeared purely because of when it arrives. Change B1 to 0.18 and watch the decision flip."
    },

    challenge: {
      id: "p-c1", type: "numeric",
      prompt: "Using the sandbox: at roughly what required return does the cart's NPV fall to zero? Answer as a percentage.",
      expect: 0.166, tol: 0.015,
      hints: [
        "Try raising B1 and watching B10 approach zero.",
        "Somewhere between 16% and 17%.",
        "This rate has a name — it is the IRR."
      ],
      solution: "About 16.6%. That is the internal rate of return: the discount rate at which the project exactly breaks even. Anil should buy the cart if his genuine alternative earns less than 16.6%, and not otherwise. Level 5 builds this properly with the IRR function."
    },

    takeaways: [
      "Present value divides a future amount by (1+r)^n",
      "NPV sums every cash flow, including the outflow today",
      "A positive NPV at your required return means the project creates value",
      "The rate at which NPV is zero is the IRR"
    ]
  },

  /* ==================================================================== */
  {
    id: "0200-future-value",
    title: "Future value",
    covers: ["Future value"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["future value", "annuity", "savings", "goal"],
    summary: "What today's money — or a regular contribution — grows into. Present value pointed forwards.",
    prerequisites: ["0170-compounding"], relatedTopics: ["0190-present-value"],

    explanation: {
      short: "Future value multiplies by (1 + r)^n. For a series of equal payments, the annuity formula does the summing for you.",
      beginner: "₹1,00,000 at 8% becomes ₹2,15,892 in ten years. If instead you add ₹10,000 every year for ten years, you end with about ₹1,56,455 — from only ₹1,00,000 of contributions, because the early ones compounded longest.",
      intermediate: "The two cases differ in when money arrives. A lump sum compounds for the whole period. An annuity's last payment compounds for nothing at all. That is why the annuity formula divides by the rate: it is summing a geometric series of differently-aged contributions.",
      advanced: "Whether payments fall at the end of each period (ordinary annuity) or the beginning (annuity due) changes the answer by exactly one period of growth — a factor of (1 + r). Spreadsheet functions take a type argument for this, and getting it wrong is a small, silent, recurring error in retirement and lease models."
    },

    formula: {
      display: "FV of a lump sum = PV × (1 + r)^n",
      alternate: "FV of an annuity = Payment × ((1 + r)^n − 1) ÷ r",
      note: "The annuity formula assumes payments at the end of each period."
    },

    example: {
      company: "Two ways to reach a goal",
      rows: [["₹1,00,000 once, 10 years at 8%", 215892], ["₹10,000 a year, 10 years at 8%", 156455],
             ["Contributed in the second case", 100000], ["Growth in the second case", 56455]],
      walkthrough: "Same ₹1,00,000 of money and the same rate, but the lump sum wins by ₹59,437 because all of it compounded for the full ten years. Timing of contributions matters as much as their size."
    },

    whyItMatters: "Every savings goal, sinking fund, lease payment and retirement calculation is a future value problem. It is also the check on whether a plan is arithmetically capable of reaching its target.",

    commonMistakes: [
      { mistake: "Multiplying the annual contribution by the years and adding interest once.", why: "Each contribution compounds for a different length of time. Only the formula or a schedule gets this right." },
      { mistake: "Mismatching payment frequency and rate.", why: "Monthly contributions need a monthly rate and a monthly period count." },
      { mistake: "Ignoring whether payments are at the start or end of the period.", why: "One extra period of growth on every payment — a consistent understatement." }
    ],

    realWorld: [
      { field: "Personal finance", use: "Answering 'how much do I need to save each month' is this formula solved for the payment." },
      { field: "Corporate finance", use: "Sinking funds for bond repayment are annuity calculations." },
      { field: "Leasing", use: "Lease liabilities under Ind AS 116 are present values of the same payment streams." }
    ],

    practice: [
      { id: "fv1", tier: "beginner", type: "numeric",
        prompt: "₹1,00,000 at 8% for 10 years. What is the future value, in ₹?",
        expect: 215892, tol: 500,
        hints: ["Multiply by 1.08 ten times.", "1,00,000 × 1.08^10."],
        solution: "₹2,15,892." },
      { id: "fv2", tier: "practical", type: "numeric",
        prompt: "₹10,000 at the end of each year for 10 years at 8%. What is the future value, in ₹?",
        expect: 156455, tol: 800,
        hints: ["Each payment compounds for a different length of time.", "Use the annuity formula.", "10,000 × (1.08^10 − 1) ÷ 0.08."],
        solution: "₹1,56,455 — of which ₹1,00,000 was contributed and ₹56,455 was growth." },
      { id: "fv3", tier: "application", type: "numeric",
        prompt: "Priya wants ₹10,00,000 in 10 years at 8%. How much must she save each year, in ₹?",
        expect: 69029, tol: 1500,
        hints: ["Run the annuity formula backwards.", "Payment = target ÷ ((1.08^10 − 1) ÷ 0.08).", "10,00,000 ÷ 15.645."],
        solution: "About ₹69,029 a year. The annuity factor of 15.645 does all the work — memorise the structure, not the number." },
      { id: "fv4", tier: "challenge", type: "interpretation",
        prompt: "A lump sum of ₹1,00,000 beats ₹10,000 a year for ten years, even though both total ₹1,00,000. Why, in one sentence — and what does this imply about when to save?",
        keywords: [["longer", "full period", "whole time", "compound", "earlier", "sooner"], ["early", "start", "front", "beginning", "as soon"]],
        hints: ["How long does the tenth contribution compound for?", "How long does the lump sum compound for?"],
        solution: "The lump sum compounds for the entire ten years, while the annuity's last payment compounds for nothing and its average contribution for about half the period. The implication is blunt: the same money saved earlier is worth substantially more, which is why increasing contributions later rarely makes up for starting late."
      } ],

    sandbox: {
      title: "Two routes to a savings goal",
      instructions: "Build the future value of a lump sum and of an annual contribution, then solve for the payment needed to hit ₹10,00,000.",
      sheets: [{
        name: "Future value",
        cells: {
          A1: "Rate", B1: "0.08",
          A2: "Years", B2: "10",
          A4: "ROUTE 1 — ONE LUMP SUM",
          A5: "Amount today", B5: "100000",
          A6: "Future value", B6: "",
          A8: "ROUTE 2 — SAVE EACH YEAR",
          A9: "Annual contribution", B9: "10000",
          A10: "Annuity factor", B10: "",
          A11: "Future value", B11: "",
          A12: "Total contributed", B12: "",
          A13: "Of which growth", B13: "",
          A15: "THE GOAL",
          A16: "Target", B16: "1000000",
          A17: "Annual saving needed", B17: ""
        },
        editable: ["B6", "B10", "B11", "B12", "B13", "B17"],
        formats: Object.assign(
          f(["B5", "B6", "B9", "B11", "B12", "B13", "B16", "B17"], INR),
          { B1: PCT, B10: { type: "x", dp: 3 } })
      }],
      checks: [
        { cell: "B6", sheet: "Future value", expect: 215892, tol: 500, mustFormula: true, mustReference: ["B5", "B1", "B2"], label: "Lump sum future value" },
        { cell: "B10", sheet: "Future value", expect: 14.487, tol: 0.05, mustFormula: true, mustReference: ["B1", "B2"], label: "Annuity factor" },
        { cell: "B11", sheet: "Future value", expect: 144866, tol: 800, mustFormula: true, mustReference: ["B9", "B10"], label: "Annuity future value" },
        { cell: "B12", sheet: "Future value", expect: 100000, tol: 10, mustFormula: true, mustReference: ["B9", "B2"], label: "Total contributed" },
        { cell: "B13", sheet: "Future value", expect: 44866, tol: 800, mustFormula: true, mustReference: ["B11", "B12"], label: "Growth" },
        { cell: "B17", sheet: "Future value", expect: 69029, tol: 1500, mustFormula: true, mustReference: ["B16", "B10"], label: "Saving needed for the goal" }
      ],
      solution: {
        "Future value": {
          B6: "=B5*(1+B1)^B2", B10: "=((1+B1)^B2-1)/B1", B11: "=B9*B10",
          B12: "=B9*B2", B13: "=B11-B12", B17: "=B16/B10"
        }
      },
      cellHints: {
        B10: { whatGoesHere: "Annuity factor", hint: "It converts one payment into the value of the whole stream.", pattern: "=((1+r)^n-1)/r" },
        B17: { whatGoesHere: "Saving needed", hint: "Run the annuity backwards — divide the target by the factor.", pattern: "=target ÷ factor" }
      },
      success: "The lump sum reaches ₹2,15,892; the same money contributed annually reaches ₹1,44,866. And ₹10,00,000 in ten years needs ₹69,029 a year. One factor, three answers."
    },

    challenge: {
      id: "fv-c1", type: "numeric",
      prompt: "If Priya can only save ₹50,000 a year at 8%, how many years does she need to reach ₹10,00,000? Answer in years, to the nearest whole year.",
      expect: 13, tol: 1,
      hints: [
        "She needs an annuity factor of 10,00,000 ÷ 50,000 = 20.",
        "Try years in the factor formula until it reaches 20.",
        "At 13 years the factor is 21.5; at 12 it is 18.98."
      ],
      solution: "About 13 years. Saving 28% less each year costs her three extra years — not five, because the extra years compound. This is the shape of every savings-goal question, and a spreadsheet solves it in seconds where algebra takes a page."
    },

    takeaways: [
      "Future value multiplies by (1+r)^n",
      "An annuity's contributions each compound for a different length of time",
      "The annuity factor converts a payment into a total, and back again",
      "The same money saved earlier is worth materially more"
    ]
  },

  /* ==================================================================== */
  {
    id: "0210-opportunity-cost",
    title: "Opportunity cost",
    covers: ["Opportunity cost"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["opportunity cost", "alternatives", "hurdle rate", "trade-off", "sunk cost"],
    summary: "The cost of a choice is the best thing you gave up to make it — not the money you spent.",
    prerequisites: ["0190-present-value"], relatedTopics: ["0220-risk-vs-reward"],

    explanation: {
      short: "Opportunity cost is the value of the best alternative forgone. It never appears in the accounts, and it is often the largest cost in the decision.",
      beginner: "Anil spends ₹40,000 on a cart. The accounts show ₹40,000. But he also gave up the ₹2,400 the bank would have paid him. The real cost of the cart is the ₹40,000 plus everything that money would otherwise have done.",
      intermediate: "This is where discount rates come from. Your required return is your opportunity cost of capital — the return available on the next best use of the money at similar risk. A project clearing that bar creates value; one that does not destroys it, even if it is profitable in the accounts.",
      advanced: "Its mirror image is the sunk cost: money already spent and unrecoverable, which should carry no weight in any forward-looking decision. Human beings are systematically bad at both — over-weighting sunk costs and under-weighting forgone alternatives — which is why decision frameworks are written down rather than felt."
    },

    formula: {
      display: "Economic profit = Accounting profit − Opportunity cost of the capital used",
      note: "A business can be profitable in the accounts and destroying value at the same time."
    },

    example: {
      company: "Priya's café, honestly assessed",
      walkthrough: "The café earns ₹1,80,000 of profit on ₹12,50,000 of Priya's equity — 14.4%. She also gave up a ₹9,00,000 salary to run it, and could have earned 11% on the equity elsewhere. Charging both: ₹1,80,000 less an opportunity cost of ₹1,37,500 on the capital leaves ₹42,500 of economic profit — before considering the salary she stopped earning. The accounts said one thing; the full comparison says another."
    },

    whyItMatters: "It is the reason a discount rate exists at all, and it converts 'are we profitable' into the sharper question 'are we doing better than the next best thing'.",

    commonMistakes: [
      { mistake: "Judging a business only by accounting profit.", why: "Accounting profit charges for hired inputs but not for the owner's capital or time." },
      { mistake: "Letting sunk costs drive decisions.", why: "Money already spent is gone. The only question is what happens from here." },
      { mistake: "Comparing against zero instead of the alternative.", why: "'Better than nothing' is a very low bar and almost never the relevant one." }
    ],

    realWorld: [
      { field: "Corporate finance", use: "The hurdle rate a project must clear is the opportunity cost of capital." },
      { field: "Equity research", use: "Economic value added measures profit after charging for capital." },
      { field: "Founders", use: "Forgone salary is often the largest real cost of a startup and never appears in its accounts." }
    ],

    practice: [
      { id: "o1", tier: "beginner", type: "mcq",
        prompt: "Anil spends ₹40,000 on a cart instead of leaving it in the bank at 6%. What is his opportunity cost for the year?",
        options: [
          { text: "₹40,000 — what he spent", correct: false, why: "That is the outlay, not the opportunity cost. The cart is still worth something." },
          { text: "₹2,400 — the interest he gave up", correct: true, why: "Correct. Opportunity cost is the value of the best alternative forgone, which here is a year's bank interest." },
          { text: "Nothing — he still owns the cart", correct: false, why: "He owns the cart, but he no longer owns the interest he would have earned." },
          { text: "₹42,400", correct: false, why: "That double-counts. The opportunity cost is only the forgone return, not the principal." }
        ] },
      { id: "o2", tier: "practical", type: "numeric",
        prompt: "The café earns ₹1,80,000 on ₹12,50,000 of equity. Priya could earn 11% elsewhere at similar risk. What is the economic profit, in ₹?",
        expect: 42500, tol: 500,
        hints: ["Charge the equity for what it could have earned.", "12,50,000 × 0.11 = 1,37,500.", "1,80,000 − 1,37,500."],
        solution: "₹42,500. Profitable in the accounts by ₹1,80,000, and creating ₹42,500 of value once the capital is charged for." },
      { id: "o3", tier: "application", type: "interpretation",
        prompt: "Priya has already spent ₹3,00,000 on a second outlet's fit-out. Completing it needs ₹5,00,000 more and it will be worth ₹6,00,000 when done. Should she finish it?",
        keywords: [["sunk", "already spent", "gone", "ignore", "irrelevant", "not recoverable"], ["5", "six", "6", "worth more", "yes", "finish", "complete"]],
        hints: [
          "The ₹3,00,000 is gone whatever she does.",
          "The forward-looking question is: spend ₹5,00,000 to get something worth ₹6,00,000?",
          "Does the ₹3,00,000 change that comparison?"
        ],
        solution: "Yes, finish it. From here, ₹5,00,000 buys something worth ₹6,00,000 — a gain of ₹1,00,000. The ₹3,00,000 already spent is sunk and irrelevant to the decision, even though the total project loses ₹2,00,000 overall. Regretting the past and deciding the future are separate operations." },
      { id: "o4", tier: "challenge", type: "scenario",
        prompt: "Priya includes her forgone ₹9,00,000 salary as a cost of the café. What happens to each measure?",
        rows: [
          { label: "Accounting profit", answer: "none" },
          { label: "Economic profit", answer: "down" },
          { label: "Cash in the business", answer: "none" },
          { label: "Her assessment of whether to continue", answer: "down" }
        ],
        hints: ["Opportunity costs never enter the accounts.", "But they do enter the decision."],
        solution: "Accounting profit and cash are untouched — no rupee moved. Economic profit falls by ₹9,00,000 and turns sharply negative, which should change how she thinks about continuing. The café pays her less than a job would, and only the opportunity-cost view makes that visible."
      } ],

    sandbox: {
      title: "What is the café really earning?",
      instructions: "Charge the business for the capital and the time it uses, and see what is left. B12 is the honest number.",
      sheets: [{
        name: "Opportunity",
        cells: {
          A1: "THE ACCOUNTS", B1: "₹",
          A2: "Profit after tax", B2: "180000",
          A4: "WHAT ISN'T IN THE ACCOUNTS",
          A5: "Priya's equity in the business", B5: "1250000",
          A6: "Return available elsewhere at similar risk", B6: "0.11",
          A7: "Opportunity cost of the capital", B7: "",
          A8: "Salary she gave up", B8: "900000",
          A10: "Economic profit after charging capital", B10: "",
          A11: "Economic profit after capital and salary", B11: "",
          A13: "Accounting return on her equity", B13: "",
          A14: "Excess over the alternative", B14: ""
        },
        editable: ["B7", "B10", "B11", "B13", "B14"],
        formats: Object.assign(
          f(["B2", "B5", "B7", "B8", "B10", "B11"], INR),
          { B6: PCT, B13: PCT, B14: PCT })
      }],
      checks: [
        { cell: "B7", sheet: "Opportunity", expect: 137500, tol: 10, mustFormula: true, mustReference: ["B5", "B6"], label: "Opportunity cost of capital" },
        { cell: "B10", sheet: "Opportunity", expect: 42500, tol: 10, mustFormula: true, mustReference: ["B2", "B7"], label: "Economic profit after capital" },
        { cell: "B11", sheet: "Opportunity", expect: -857500, tol: 100, mustFormula: true, mustReference: ["B10", "B8"], label: "After the forgone salary too" },
        { cell: "B13", sheet: "Opportunity", expect: 0.144, tol: 0.003, mustFormula: true, mustReference: ["B2", "B5"], label: "Return on equity" },
        { cell: "B14", sheet: "Opportunity", expect: 0.034, tol: 0.004, mustFormula: true, mustReference: ["B13", "B6"], label: "Excess return" }
      ],
      solution: {
        Opportunity: {
          B7: "=B5*B6", B10: "=B2-B7", B11: "=B10-B8", B13: "=B2/B5", B14: "=B13-B6"
        }
      },
      cellHints: {
        B7: { whatGoesHere: "Opportunity cost", hint: "What her equity could have earned elsewhere.", pattern: "=equity × alternative return" },
        B14: { whatGoesHere: "Excess return", hint: "How much better than the alternative, in points.", pattern: "=actual − alternative" }
      },
      success: "The accounts say ₹1,80,000 of profit. Charging for capital leaves ₹42,500 — still value-creating, at 3.4 points above the alternative. Charging for her salary too leaves −₹8,57,500. All three numbers are true; they answer different questions."
    },

    challenge: {
      id: "o-c1", type: "numeric",
      prompt: "What return would the café need on Priya's ₹12,50,000 of equity to cover both the 11% alternative and her ₹9,00,000 forgone salary? Answer as a percentage.",
      expect: 0.83, tol: 0.03,
      hints: [
        "She needs profit covering ₹1,37,500 of capital cost plus ₹9,00,000 of salary.",
        "That is ₹10,37,500 of required profit.",
        "10,37,500 ÷ 12,50,000."
      ],
      solution: "83%. The café would have to earn ₹10,37,500 on ₹12,50,000 of equity to leave Priya genuinely better off than a salaried job plus a passive investment. That is the number nobody computes before quitting, and it explains why so many small businesses feel like they are working without ever getting ahead."
    },

    takeaways: [
      "The cost of a choice is the best alternative given up",
      "Opportunity cost is where discount rates and hurdle rates come from",
      "Accounting profit does not charge for owner capital or owner time",
      "Sunk costs are irrelevant to any forward-looking decision"
    ]
  },

  /* ==================================================================== */
  {
    id: "0220-risk-vs-reward",
    title: "Risk versus reward",
    covers: ["Risk vs reward"],
    level: "foundations", difficulty: "beginner", estimatedTime: 6,
    tags: ["risk", "return", "premium", "trade-off", "risk-adjusted"],
    summary: "Higher expected returns exist because someone must be paid to bear uncertainty. The pairing is the price, not a bargain.",
    prerequisites: ["0140-risk", "0150-return"], relatedTopics: ["0140-risk", "0150-return"],

    explanation: {
      short: "In a competitive market, assets offering higher expected returns do so because they are riskier. The extra return is compensation, not a mistake.",
      beginner: "A government bond might pay 7%. A small business might return 25% — or nothing. Nobody would ever buy the bond if the business were simply better; the difference is what investors demand for accepting the chance of losing money.",
      intermediate: "The excess of an asset's expected return over the risk-free rate is its risk premium. Comparing investments therefore means comparing returns per unit of risk, not returns alone — which is what the Sharpe ratio does.",
      advanced: "Only risk that cannot be diversified away is rewarded. Firm-specific risk disappears in a portfolio, so the market pays nothing for bearing it; systematic risk remains and carries a premium. This is CAPM's central insight, and the reason concentrated bets are not compensated for the extra risk they carry."
    },

    formula: {
      display: "Risk premium = Expected return − Risk-free rate",
      alternate: "Sharpe ratio = (Return − Risk-free rate) ÷ Standard deviation of returns",
      note: "The Sharpe ratio asks how much return you got for each unit of volatility endured."
    },

    example: {
      company: "Three places to put ₹1,00,000",
      rows: [["Government bond — return 7%, spread 0%", 7000], ["Diversified equity — return 12%, spread 15%", 12000],
             ["The second cart — return 22.5%, spread 40%", 22500]],
      walkthrough: "Ranked by return the cart wins easily. Ranked by return per unit of risk it is last: the bond has no volatility at all, equity delivers 0.33 of excess return per point of spread, the cart 0.39 — closer than the headline suggests, and that is before considering that Anil cannot diversify a single cart."
    },

    whyItMatters: "It is the discipline that stops 'this returns 25%' from being an argument. Every claim about return must be paired with a claim about risk, or it is not yet an investment case.",

    commonMistakes: [
      { mistake: "Assuming a higher return means a better investment.", why: "It usually means a riskier one. The comparison must be risk-adjusted." },
      { mistake: "Believing risk and return are guaranteed to be related.", why: "Risk is necessary for high expected return, not sufficient. Plenty of risky things simply have poor expected returns." },
      { mistake: "Expecting to be paid for diversifiable risk.", why: "The market compensates only risk that cannot be spread away. Concentration is a choice you fund yourself." }
    ],

    realWorld: [
      { field: "Asset management", use: "Sharpe ratios and benchmark comparisons are risk-adjusted by construction." },
      { field: "Credit", use: "The spread over the risk-free rate is literally the price of default risk." },
      { field: "Corporate finance", use: "Higher-risk projects must clear higher hurdle rates — that is CAPM in practice." }
    ],

    practice: [
      { id: "rr1", tier: "beginner", type: "numeric",
        prompt: "Equity is expected to return 12% and the risk-free rate is 7%. What is the risk premium, as a percentage?",
        expect: 0.05, tol: 0.003,
        hints: ["The premium is the excess over risk-free.", "12% − 7%."],
        solution: "5 percentage points — the payment for accepting equity risk." },
      { id: "rr2", tier: "practical", type: "numeric",
        prompt: "Equity returns 12% with a standard deviation of 15%, risk-free is 7%. What is the Sharpe ratio?",
        expect: 0.333, tol: 0.02,
        hints: ["Excess return over volatility.", "(0.12 − 0.07) ÷ 0.15."],
        solution: "0.33 — a third of a point of excess return for each point of volatility." },
      { id: "rr3", tier: "application", type: "mcq",
        prompt: "Cart A: 22.5% return, 40% spread. Fund B: 12% return, 15% spread. Risk-free is 7%. Which is the better risk-adjusted choice for someone with all their savings at stake?",
        options: [
          { text: "The cart — the return is nearly double", correct: false, why: "Return alone is not the comparison, and the spread here is more than double too." },
          { text: "The fund — similar reward per unit of risk, and it is diversified", correct: true, why: "Sharpe ratios are close (0.39 against 0.33), but the cart is a single undiversifiable asset. For someone with everything at stake, a comparable risk-adjusted return with far less chance of total loss is clearly better." },
          { text: "The cart — risk always pays off eventually", correct: false, why: "Risk is the chance it does not pay off. 'Eventually' assumes you survive to see it." },
          { text: "Neither, both beat risk-free", correct: false, why: "Both beating risk-free is the entry requirement, not the decision." }
        ] },
      { id: "rr4", tier: "challenge", type: "interpretation",
        prompt: "A fund advertises 'equity-like returns with bond-like risk'. What should you check before believing it?",
        keywords: [["leverage", "illiquid", "hidden", "tail", "rare", "infrequent", "mark", "valuation", "smooth"], ["risk", "not", "actually", "understate", "measured"]],
        hints: [
          "If it were freely available, what would competition do to it?",
          "How might a strategy report low volatility while still being risky?",
          "Think about assets that are not priced daily."
        ],
        solution: "Ask how risk is being measured. Illiquid assets valued infrequently show artificially smooth returns; strategies that sell insurance against rare events look calm until the event happens; leverage can raise returns while reported volatility stays modest. Persistently high risk-adjusted returns usually mean risk is being mismeasured, moved somewhere unmeasured, or genuinely — and rarely — earned through skill."
      } ],

    sandbox: {
      title: "Compare three investments properly",
      instructions: "Compute the risk premium and Sharpe ratio for each option, then rank them on return and on return per unit of risk.",
      sheets: [{
        name: "Risk vs reward",
        cells: {
          A1: "Risk-free rate", B1: "0.07",
          A3: "OPTION", B3: "Expected return", C3: "Volatility", D3: "Risk premium", E3: "Sharpe",
          A4: "Government bond", B4: "0.07", C4: "0.00", D4: "", E4: "n/a",
          A5: "Diversified equity fund", B5: "0.12", C5: "0.15", D5: "", E5: "",
          A6: "The second cart", B6: "0.225", C6: "0.40", D6: "", E6: "",
          A8: "Best on raw return", B8: "",
          A9: "Best on Sharpe", B9: "",
          A11: "Extra return the cart offers over the fund", B11: "",
          A12: "Extra volatility it demands", B12: ""
        },
        editable: ["D4", "D5", "D6", "E5", "E6", "B8", "B9", "B11", "B12"],
        formats: {
          B1: PCT, B4: PCT, B5: PCT, B6: PCT, C4: PCT, C5: PCT, C6: PCT,
          D4: PCT, D5: PCT, D6: PCT, B11: PCT, B12: PCT,
          E5: { type: "x", dp: 2 }, E6: { type: "x", dp: 2 }
        }
      }],
      checks: [
        { cell: "D5", sheet: "Risk vs reward", expect: 0.05, tol: 0.002, mustFormula: true, mustReference: ["B5", "B1"], label: "Equity risk premium" },
        { cell: "D6", sheet: "Risk vs reward", expect: 0.155, tol: 0.003, mustFormula: true, mustReference: ["B6", "B1"], label: "Cart risk premium" },
        { cell: "E5", sheet: "Risk vs reward", expect: 0.333, tol: 0.02, mustFormula: true, mustReference: ["D5", "C5"], label: "Equity Sharpe" },
        { cell: "E6", sheet: "Risk vs reward", expect: 0.3875, tol: 0.02, mustFormula: true, mustReference: ["D6", "C6"], label: "Cart Sharpe" },
        { cell: "B11", sheet: "Risk vs reward", expect: 0.105, tol: 0.003, mustFormula: true, mustReference: ["B6", "B5"], label: "Extra return" },
        { cell: "B12", sheet: "Risk vs reward", expect: 0.25, tol: 0.003, mustFormula: true, mustReference: ["C6", "C5"], label: "Extra volatility" }
      ],
      solution: {
        "Risk vs reward": {
          D4: "=B4-$B$1", D5: "=B5-$B$1", D6: "=B6-$B$1",
          E5: "=D5/C5", E6: "=D6/C6",
          B8: "The cart", B9: "The cart, narrowly", B11: "=B6-B5", B12: "=C6-C5"
        }
      },
      cellHints: {
        E5: { whatGoesHere: "Sharpe ratio", hint: "Excess return divided by volatility.", pattern: "=premium ÷ volatility" },
        B12: { whatGoesHere: "Extra volatility", hint: "The price of that extra return, in points of spread.", pattern: "=cart volatility − fund volatility" }
      },
      success: "The cart offers 10.5 points more return for 25 points more volatility. Its Sharpe is barely better — 0.39 against 0.33 — and unlike the fund it cannot be diversified. The headline gap of 'nearly double the return' shrank to almost nothing once risk was priced."
    },

    challenge: {
      id: "rr-c1", type: "numeric",
      prompt: "What return would the cart need to offer to reach a Sharpe ratio of 0.60, given 40% volatility and a 7% risk-free rate? Answer as a percentage.",
      expect: 0.31, tol: 0.01,
      hints: [
        "Sharpe × volatility gives the required premium.",
        "0.60 × 0.40 = 0.24.",
        "Then add the risk-free rate."
      ],
      solution: "31%. To justify 40% volatility at a Sharpe of 0.6, the cart would need to return 31% rather than 22.5%. Turning 'is this worth the risk' into a required-return number is what separates an investment case from an opinion."
    },

    takeaways: [
      "Higher expected return is compensation for risk, not a free lunch",
      "The risk premium is the excess over the risk-free rate",
      "Compare returns per unit of risk, never returns alone",
      "Only undiversifiable risk is rewarded by the market"
    ]
  }

  ];
});
