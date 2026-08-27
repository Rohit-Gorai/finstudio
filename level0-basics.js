/* ============================================================================
   LEVEL 0 · Finance Foundations — part 1 of 3
   Topics: what finance is · the three finances · markets · companies & capital
           revenue · costs · profit · cash
   ----------------------------------------------------------------------------
   Every lesson here carries all four practice tiers and a sandbox exercise
   with a solution on file, so tests/coverage.test.mjs can prove it is solvable
   and that a hardcoded number fails.

   Written for someone who has never opened a financial statement. Numbers are
   small and human on purpose — a tea stall, a salary, a savings account —
   before the café's lakhs arrive in Level 1.
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

  var INR = { type: "currency", currency: "inr" };
  var PCT = { type: "pct", dp: 1 };
  var NUM = { type: "number" };

  function fmtAll(cells, fmt) {
    var o = {};
    cells.forEach(function (c) { o[c] = fmt; });
    return o;
  }

  return [

  /* ==================================================================== */
  {
    id: "0010-what-is-finance",
    title: "What is finance?",
    covers: ["What is finance?"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["finance", "money", "capital", "allocation"],
    summary: "Finance is the study of deciding what to do with money over time when you cannot be certain how things turn out.",
    prerequisites: [], relatedTopics: ["0050-revenue"],

    explanation: {
      short: "Finance is what you do with money across time, under uncertainty. Three questions: where does money come from, where should it go, and what is it worth once time and risk are accounted for.",
      beginner: "You have ₹1,000. You can spend it today, keep it for later, or hand it to someone who will use it and give you more back — you hope. Every one of those is a finance decision. Finance is not arithmetic about money; it is the set of tools for choosing between options whose payoffs arrive at different times and are not guaranteed.",
      intermediate: "Formally, finance studies the allocation of capital across time under uncertainty. It splits into three questions a business must keep answering: what to invest in (capital budgeting), how to pay for it (capital structure), and how much cash to keep on hand (working capital). Accounting records what happened; finance decides what to do next.",
      advanced: "The discipline rests on a small number of load-bearing ideas: a rupee today is worth more than a rupee later, riskier claims must promise more, and in a competitive market prices reflect what is known. Almost everything else — valuation, portfolio theory, capital structure — is those principles applied to a particular situation."
    },

    visualization: {
      type: "flow", title: "The three questions", interactive: false,
      nodes: [
        { label: "Where does money come from?", note: "Owners, lenders, or profit the business made itself" },
        { label: "Where should it go?", note: "Which projects, which assets, which people" },
        { label: "What is it worth?", note: "Adjusted for how long you wait and what might go wrong" }
      ]
    },

    example: {
      company: "A tea stall",
      walkthrough: "Anil has ₹40,000 saved. He can leave it in the bank at 6% and have ₹42,400 next year. Or he can buy a second kettle and a cart for ₹40,000, which he thinks will bring in ₹9,000 of extra profit a year for many years. The bank option is nearly certain; the cart is not. Choosing between them — weighing ₹2,400 safe against ₹9,000 uncertain — is finance. Everything in this course is a sharper version of that comparison."
    },

    whyItMatters: "Every decision that involves money arriving at a different time from when it is spent is a finance decision — a home loan, a job offer with equity, a factory, a degree. The vocabulary changes with the setting; the question does not.",

    commonMistakes: [
      { mistake: "Thinking finance is accounting.", why: "Accounting is the record of what already happened. Finance uses that record to choose what happens next. One looks backwards, the other forwards." },
      { mistake: "Comparing amounts that arrive at different times as if they were the same.", why: "₹9,000 next year and ₹9,000 today are not the same amount. Half of finance exists to handle exactly this." },
      { mistake: "Assuming higher return is simply better.", why: "Returns come attached to risk. A comparison that ignores the risk is not a comparison." }
    ],

    realWorld: [
      { field: "Corporate finance", use: "Deciding whether to build the plant, and whether to borrow for it." },
      { field: "Investing", use: "Deciding which claims on future cash are mispriced." },
      { field: "Banking", use: "Pricing the risk that a borrower does not repay." },
      { field: "Personal", use: "Rent versus buy, loan versus savings, insurance versus self-funding." }
    ],

    practice: [
      { id: "f1-p1", tier: "beginner", type: "mcq",
        prompt: "Which of these is a finance decision rather than an accounting task?",
        options: [
          { text: "Recording last month's sales in the books", correct: false, why: "That is accounting — writing down what already happened." },
          { text: "Deciding whether to borrow ₹5 lakh to buy a delivery van", correct: true, why: "Money now, benefits later, outcome uncertain. That is the shape of every finance decision." },
          { text: "Filing the annual tax return", correct: false, why: "Compliance, based on records that already exist." },
          { text: "Counting the stock in the storeroom", correct: false, why: "Measurement of what is there today." }
        ] },
      { id: "f1-p2", tier: "practical", type: "numeric",
        prompt: "Anil's ₹40,000 earns 6% for one year in the bank. How much does he have at the end, in ₹?",
        expect: 42400, tol: 1,
        hints: ["6% of 40,000 is the interest.", "Add the interest to what he started with.", "40,000 + (40,000 × 0.06)."],
        solution: "40,000 × 1.06 = ₹42,400." },
      { id: "f1-p3", tier: "application", type: "interpretation",
        prompt: "The cart earns ₹9,000 a year against the bank's ₹2,400. Why might Anil still choose the bank?",
        keywords: [["risk", "uncertain", "might not", "could fail", "no guarantee"], ["bank", "safe", "certain", "guaranteed"]],
        hints: ["The ₹9,000 is a forecast. The ₹2,400 is a contract.", "What happens to Anil if it rains for a month?"],
        solution: "The ₹9,000 is an estimate that depends on customers turning up; the ₹2,400 is close to certain. If Anil cannot survive a bad month, the safer, smaller return may be the better decision for him. Return is only half the comparison." },
      { id: "f1-p4", tier: "challenge", type: "scenario",
        prompt: "Anil buys the cart with ₹40,000 of his own savings. Immediately, before any tea is sold:",
        rows: [
          { label: "Cash he holds", answer: "down" },
          { label: "Equipment he owns", answer: "up" },
          { label: "Total value he owns", answer: "none" },
          { label: "Money he owes", answer: "none" }
        ],
        hints: ["He swapped one kind of value for another.", "Did he borrow anything?"],
        solution: "Cash falls ₹40,000, equipment rises ₹40,000. He is no better or worse off yet — he has changed the form of his wealth, not the amount. He borrowed nothing, so he owes nothing. The gain or loss comes later, from using the cart." }
    ],

    sandbox: {
      title: "Bank or cart?",
      instructions: "Work out what each option leaves Anil after one year, then the difference between them. B7 should show how much more the cart earns.",
      sheets: [{
        name: "Choice",
        cells: {
          A1: "Anil's decision", B1: "₹",
          A2: "Savings available", B2: "40000",
          A3: "Bank interest rate", B3: "0.06",
          A4: "Interest earned in the bank", B4: "",
          A5: "Extra profit from the cart", B5: "9000",
          A6: "",
          A7: "How much more the cart earns", B7: "",
          A8: "Cart earnings as a % of the money put in", B8: ""
        },
        editable: ["B4", "B7", "B8"],
        formats: Object.assign(fmtAll(["B2", "B4", "B5", "B7"], INR), { B3: PCT, B8: PCT })
      }],
      checks: [
        { cell: "B4", sheet: "Choice", expect: 2400, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Interest earned" },
        { cell: "B7", sheet: "Choice", expect: 6600, tol: 1, mustFormula: true, mustReference: ["B4", "B5"], label: "The difference" },
        { cell: "B8", sheet: "Choice", expect: 0.225, tol: 0.001, mustFormula: true, mustReference: ["B5", "B2"], label: "Cart return %" }
      ],
      solution: { Choice: { B4: "=B2*B3", B7: "=B5-B4", B8: "=B5/B2" } },
      cellHints: {
        B4: { whatGoesHere: "Interest earned", hint: "The savings multiplied by the rate.", pattern: "=savings × rate" },
        B7: { whatGoesHere: "The gap", hint: "Cart profit less bank interest.", pattern: "=cart − interest" },
        B8: { whatGoesHere: "Return on the cart", hint: "A return is always divided by what you put in.", pattern: "=profit ÷ money invested" }
      },
      success: "The cart earns ₹6,600 more — a 22.5% return against the bank's 6%. Now the only question left is whether you believe the ₹9,000."
    },

    challenge: {
      id: "f1-c1", type: "interpretation",
      prompt: "The cart returns 22.5% and the bank 6%. Nearly four times as much. Give one reason a careful person would still call this a fair trade rather than free money.",
      keywords: [["risk", "uncertain", "fail", "vary"], ["compensat", "paid for", "reward for", "in exchange", "because"]],
      hints: ["Why would anyone accept 6% if 22.5% were simply available?", "What is the extra 16.5 points paying Anil for?"],
      solution: "The extra return is payment for bearing risk. The bank's 6% is contractual; the cart's 22.5% is Anil's estimate and could be 40% or zero. In a functioning market, higher expected returns are compensation for uncertainty, not a mistake somebody left lying around."
    },

    takeaways: [
      "Finance is about money across time, under uncertainty",
      "Its three questions: where money comes from, where it goes, what it is worth",
      "Accounting looks back; finance looks forward",
      "Return without risk attached is only half a comparison"
    ]
  },

  /* ==================================================================== */
  {
    id: "0020-three-finances",
    title: "Personal, corporate and investing",
    covers: ["Personal finance vs corporate finance vs investing"],
    level: "foundations", difficulty: "beginner", estimatedTime: 4,
    tags: ["personal finance", "corporate finance", "investing"],
    summary: "Three settings, one set of tools. What changes is whose money it is and what counts as success.",
    prerequisites: ["0010-what-is-finance"], relatedTopics: ["0010-what-is-finance"],

    explanation: {
      short: "Personal finance manages a household's money. Corporate finance manages a company's. Investing puts money into other people's ventures in exchange for a claim on what they produce.",
      beginner: "The same three questions — where does money come from, where does it go, what is it worth — get asked in three places. A household asks them about a salary. A company asks them about revenue. An investor asks them about somebody else's company. The arithmetic barely changes.",
      intermediate: "The differences that matter are the objective and the constraint. A household optimises lifetime consumption subject to income and its own tolerance for risk. A company, in the textbook framing, maximises the value of the owners' claim subject to what it can finance. An investor maximises risk-adjusted return subject to what they can afford to lose.",
      advanced: "They are not independent. A household's savings become an investor's capital, which funds a company's assets, which produce the wages the household earns. The three views are the same flow of capital seen from three positions in it — which is why an analyst who understands only one tends to misread the other two."
    },

    example: {
      company: "One rupee, three views",
      walkthrough: "Priya earns ₹60,000 a month and saves ₹10,000 (personal finance). She puts it in a mutual fund (investing). The fund buys shares in a coffee company, which uses the money to open a new outlet (corporate finance). The outlet employs a barista, who now has a salary and a personal finance question of her own. Same rupee, three disciplines."
    },

    whyItMatters: "Most people learn one of the three and assume the others are alien. They are not. A founder who understands personal cash-flow discipline runs a better company; an employee who understands corporate finance reads a job offer's equity component correctly.",

    commonMistakes: [
      { mistake: "Running a business's cash like a household's.", why: "A household can cut spending to survive; a business that stops paying suppliers loses supply. The constraints differ even though the arithmetic doesn't." },
      { mistake: "Treating investing as gambling.", why: "Investing buys a claim on real cash a business produces. Gambling produces nothing. The confusion usually comes from watching prices rather than businesses." },
      { mistake: "Assuming personal and corporate money are interchangeable in a small business.", why: "Mixing them is the most common reason a small firm cannot tell whether it is profitable." }
    ],

    realWorld: [
      { field: "FP&A", use: "Corporate planning is household budgeting with more zeros and more people to convince." },
      { field: "Wealth management", use: "Personal finance done professionally, for someone else." },
      { field: "Asset management", use: "Investing done professionally, with other people's savings." }
    ],

    practice: [
      { id: "f2-p1", tier: "beginner", type: "match",
        prompt: "Which discipline does each question belong to?",
        pairs: [
          { left: "Should I take the home loan or keep renting?", right: "Personal finance" },
          { left: "Should we fund the new plant with debt or equity?", right: "Corporate finance" },
          { left: "Is this company's share worth ₹400?", right: "Investing" },
          { left: "How much emergency cash should I hold?", right: "Personal finance" },
          { left: "Should we pay a dividend or reinvest?", right: "Corporate finance" }
        ] },
      { id: "f2-p2", tier: "practical", type: "numeric",
        prompt: "Priya earns ₹60,000 a month and spends ₹50,000. What is her savings rate, as a percentage?",
        expect: 0.1667, tol: 0.005,
        hints: ["Savings is what is left over.", "A rate is always divided by the total.", "10,000 ÷ 60,000."],
        solution: "(60,000 − 50,000) ÷ 60,000 = 16.7%." },
      { id: "f2-p3", tier: "application", type: "scenario",
        prompt: "Priya's fund buys shares in the coffee company, which opens an outlet. Trace it:",
        rows: [
          { label: "Priya's cash", answer: "down" },
          { label: "Priya's investments", answer: "up" },
          { label: "The company's cash", answer: "up" },
          { label: "The company's equity", answer: "up" },
          { label: "The company's debt", answer: "none" }
        ],
        hints: ["Priya swaps one asset for another.", "The company received money in exchange for ownership, not a promise to repay."],
        solution: "Priya's cash becomes an investment — her total wealth is unchanged. The company gains cash and gains owners. Nothing was borrowed, so debt is untouched. One transaction, three balance sheets moving." },
      { id: "f2-p4", tier: "challenge", type: "interpretation",
        prompt: "A small shop owner pays her own electricity bill from the shop's till. Why does this make it hard to tell whether the shop is profitable?",
        keywords: [["mix", "mingle", "separate", "personal", "business"], ["cost", "expense", "profit", "overstate", "understate"]],
        hints: ["Whose expense is the home electricity bill?", "What does the shop's expense line look like if personal spending is inside it?"],
        solution: "Personal spending sits inside the business's costs, so the shop's profit is understated — and no one can tell by how much. Separating personal and business money is not bureaucracy; it is the precondition for knowing whether the business works at all." }
    ],

    sandbox: {
      title: "One rupee, three views",
      instructions: "Fill in the three surpluses. Each is money in less money out — the same calculation in a household, a company and a portfolio.",
      sheets: [{
        name: "Three views",
        cells: {
          A1: "PERSONAL — Priya, per month",
          A2: "Salary", B2: "60000",
          A3: "Spending", B3: "-50000",
          A4: "Monthly surplus", B4: "",
          A6: "CORPORATE — the coffee company, per month",
          A7: "Revenue", B7: "800000",
          A8: "Costs", B8: "-680000",
          A9: "Monthly surplus", B9: "",
          A11: "INVESTING — Priya's fund holding",
          A12: "Value at start of year", B12: "120000",
          A13: "Value at end of year", B13: "138000",
          A14: "Gain", B14: "",
          A15: "Return for the year", B15: ""
        },
        editable: ["B4", "B9", "B14", "B15"],
        formats: Object.assign(fmtAll(["B2", "B3", "B4", "B7", "B8", "B9", "B12", "B13", "B14"], INR), { B15: PCT })
      }],
      checks: [
        { cell: "B4", sheet: "Three views", expect: 10000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Personal surplus" },
        { cell: "B9", sheet: "Three views", expect: 120000, tol: 1, mustFormula: true, mustReference: ["B7", "B8"], label: "Company surplus" },
        { cell: "B14", sheet: "Three views", expect: 18000, tol: 1, mustFormula: true, mustReference: ["B12", "B13"], label: "Investment gain" },
        { cell: "B15", sheet: "Three views", expect: 0.15, tol: 0.001, mustFormula: true, mustReference: ["B14", "B12"], label: "Return" }
      ],
      solution: { "Three views": { B4: "=B2+B3", B9: "=B7+B8", B14: "=B13-B12", B15: "=B14/B12" } },
      cellHints: {
        B4: { whatGoesHere: "Surplus", hint: "Spending is stored negative, so add.", pattern: "=income + spending" },
        B15: { whatGoesHere: "Return", hint: "Gain over what you started with.", pattern: "=gain ÷ opening value" }
      },
      success: "₹10,000, ₹1,20,000 and 15%. Three settings, one subtraction — and in the third case, a division that turns an amount into a rate you can compare."
    },

    challenge: {
      id: "f2-c1", type: "numeric",
      prompt: "Priya saves ₹10,000 a month for a year and her fund returns 15% on the money as it goes in, averaged as half a year of growth on the total. Roughly what is her year-end balance, in ₹?",
      expect: 129000, tol: 3000,
      hints: [
        "First find how much she put in over twelve months.",
        "Money contributed monthly earns growth for about half the year on average.",
        "1,20,000 × (1 + 0.15 ÷ 2)."
      ],
      solution: "₹10,000 × 12 = ₹1,20,000 contributed. Averaging half a year of exposure: ₹1,20,000 × 1.075 ≈ ₹1,29,000. The rough method matters more than the precision — a real answer needs a monthly schedule, which is exactly what a spreadsheet is for."
    },

    takeaways: [
      "Personal, corporate and investing finance ask the same three questions",
      "What differs is the objective and the constraint, not the arithmetic",
      "Savings become capital, capital becomes assets, assets pay wages",
      "Mixing personal and business money destroys your ability to measure either"
    ]
  },

  /* ==================================================================== */
  {
    id: "0030-financial-markets",
    title: "Financial markets",
    covers: ["Financial markets"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["markets", "shares", "bonds", "primary", "secondary", "exchange"],
    summary: "The places where people with spare money meet people who need it, and where the price of that meeting gets set.",
    prerequisites: ["0020-three-finances"], relatedTopics: ["0040-companies-and-capital"],

    explanation: {
      short: "A financial market is where savings are exchanged for claims on future cash — a share, a bond, a loan. The price of the claim is what the market thinks that future cash is worth.",
      beginner: "Some people have more money than they need right now. Some need more than they have. A financial market is the meeting point. The saver hands over money and gets a piece of paper saying what they are owed or what they own; the borrower gets money and takes on an obligation.",
      intermediate: "Two distinctions do most of the work. Primary versus secondary: in a primary transaction the company itself receives the money (an IPO, a new bond); in a secondary one, investors trade with each other and the company receives nothing. Debt versus equity: a bond is a promise of fixed amounts, a share is a residual claim on whatever is left over.",
      advanced: "Markets do two jobs: they allocate capital toward its most productive use, and they aggregate dispersed information into a price. The second is why prices move on news before any cash has changed hands, and why 'the market fell on rate expectations' is a statement about revised beliefs rather than about anything physical."
    },

    example: {
      company: "The coffee company lists",
      walkthrough: "The company sells 2,00,000 new shares at ₹150 in an IPO and receives ₹3,00,00,000 — a primary transaction. The next morning Priya buys 100 of those shares from another investor at ₹162. The company receives nothing from that trade; ₹16,200 moves from Priya to the seller. Both are the stock market, and only the first put money into the business."
    },

    whyItMatters: "Nearly every number in valuation is ultimately checked against a market price. Knowing which transactions actually fund a company — and which merely reprice it — is what stops you from confusing a share price with the company's bank balance.",

    commonMistakes: [
      { mistake: "Thinking a company gets money when its share price rises.", why: "It does not. After the IPO, shares trade between investors. A rising price helps the company raise money later, and helps shareholders now, but no cash arrives." },
      { mistake: "Treating share price as company value.", why: "Value is price × number of shares, and even that is only the equity. A company with heavy debt is worth much more than its shares." },
      { mistake: "Assuming a market price is a fact.", why: "It is the price of the last trade between two people. It is information, not truth." }
    ],

    realWorld: [
      { field: "Investment banking", use: "Running the primary transactions — IPOs, bond issues, placements." },
      { field: "Equity research", use: "Arguing that the secondary price is wrong, and why." },
      { field: "Treasury", use: "Deciding when to tap markets and at what cost." }
    ],

    practice: [
      { id: "f3-p1", tier: "beginner", type: "mcq",
        prompt: "Priya buys 100 shares on the exchange from another investor. How much does the company receive?",
        options: [
          { text: "The full amount she paid", correct: false, why: "That money goes to the investor who sold, not to the company." },
          { text: "Nothing", correct: true, why: "Correct. This is a secondary transaction — ownership changes hands between investors and the company is not a party to it." },
          { text: "A commission on the trade", correct: false, why: "The broker and exchange take fees. The company does not." },
          { text: "It depends on the share price", correct: false, why: "The price affects who gets how much, but the company still receives nothing." }
        ] },
      { id: "f3-p2", tier: "practical", type: "numeric",
        prompt: "The company sells 2,00,000 new shares at ₹150 each. How much does it raise, in ₹?",
        expect: 30000000, tol: 1,
        hints: ["Shares sold multiplied by the price each.", "2,00,000 × 150."],
        solution: "2,00,000 × ₹150 = ₹3,00,00,000 (₹3 crore)." },
      { id: "f3-p3", tier: "application", type: "scenario",
        prompt: "The share price rises from ₹150 to ₹180 in the weeks after listing. What changes?",
        rows: [
          { label: "The company's cash", answer: "none" },
          { label: "The company's total market value", answer: "up" },
          { label: "Existing shareholders' wealth", answer: "up" },
          { label: "The company's debt", answer: "none" }
        ],
        hints: ["Did anyone hand the company money?", "Market value is price × shares, and price moved."],
        solution: "Nothing physical moved. The company's cash and debt are untouched. What changed is the price at which ownership trades, so market value and shareholder wealth both rise. This is the clearest illustration that market value and company cash are different things." },
      { id: "f3-p4", tier: "challenge", type: "interpretation",
        prompt: "A company's share price falls 20% on a day it announced nothing. What could be going on?",
        keywords: [["expectation", "belief", "news", "sector", "rate", "market", "outlook"], ["not", "no", "without", "even though"]],
        hints: ["A price reflects beliefs about the future, not only company announcements.", "What else changed that day — for competitors, for interest rates, for the whole market?"],
        solution: "Prices move on revised expectations, which can come from anywhere: a competitor's results implying weak demand, an interest-rate move changing what future cash is worth, or a broad market fall. The company's own operations may be identical to yesterday's. Price is a claim about the future, and the future got repriced."
      } ],

    sandbox: {
      title: "Primary and secondary",
      instructions: "Work out what the company raises, what the market thinks it is worth, and what a secondary trade delivers to the company.",
      sheets: [{
        name: "Market",
        cells: {
          A1: "THE IPO",
          A2: "New shares sold", B2: "200000",
          A3: "Price per share", B3: "150",
          A4: "Raised by the company", B4: "",
          A6: "AFTER LISTING",
          A7: "Total shares in issue", B7: "1000000",
          A8: "Price per share today", B8: "180",
          A9: "Market value of all equity", B9: "",
          A11: "A SECONDARY TRADE",
          A12: "Shares Priya buys", B12: "100",
          A13: "Price she pays each", B13: "180",
          A14: "Total she pays", B14: "",
          A15: "Of which the company receives", B15: "0"
        },
        editable: ["B4", "B9", "B14"],
        formats: Object.assign(fmtAll(["B3", "B4", "B8", "B9", "B13", "B14", "B15"], INR), { B2: NUM, B7: NUM, B12: NUM })
      }],
      checks: [
        { cell: "B4", sheet: "Market", expect: 30000000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Raised in the IPO" },
        { cell: "B9", sheet: "Market", expect: 180000000, tol: 1, mustFormula: true, mustReference: ["B7", "B8"], label: "Market value of equity" },
        { cell: "B14", sheet: "Market", expect: 18000, tol: 1, mustFormula: true, mustReference: ["B12", "B13"], label: "Priya's trade" }
      ],
      solution: { Market: { B4: "=B2*B3", B9: "=B7*B8", B14: "=B12*B13" } },
      cellHints: {
        B9: { whatGoesHere: "Market capitalisation", hint: "Every share in issue, at today's price.", pattern: "=shares × price" }
      },
      success: "₹3 crore raised once, ₹18 crore of market value today, and ₹18,000 changing hands between two investors with none of it reaching the company. B15 is zero and it is not a mistake."
    },

    challenge: {
      id: "f3-c1", type: "numeric",
      prompt: "The company has 10,00,000 shares at ₹180 and borrowings of ₹4,00,00,000 with cash of ₹50,00,000. What is the whole business worth — equity plus net debt — in ₹?",
      expect: 213500000, tol: 100,
      hints: [
        "Start with the market value of the equity.",
        "Net debt is what is owed less the cash sitting there to repay it.",
        "18,00,00,000 + (4,00,00,000 − 50,00,000)."
      ],
      solution: "Equity ₹18,00,00,000 + net debt ₹3,50,00,000 = ₹21,35,00,000. This is enterprise value, and the fact that it exceeds market capitalisation is the whole reason the distinction exists."
    },

    takeaways: [
      "Markets exchange savings for claims on future cash",
      "Primary transactions fund the company; secondary ones only reprice it",
      "A rising share price puts no cash in the company's account",
      "Price aggregates beliefs, and beliefs change without announcements"
    ]
  },

  /* ==================================================================== */
  {
    id: "0040-companies-and-capital",
    title: "Companies and capital",
    covers: ["Companies and capital"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["capital", "equity", "debt", "ownership", "funding"],
    summary: "A company is a machine for turning capital into more capital. Two kinds of people supply it, and they want very different things.",
    prerequisites: ["0030-financial-markets"], relatedTopics: ["0090-assets", "0110-equity"],

    explanation: {
      short: "Capital is money put into a business to produce more money. It arrives as equity (ownership, no promise) or debt (a promise to repay with interest), and every asset a company owns was paid for by one or the other.",
      beginner: "To open a café you need money before you earn any. That money comes from the owner's pocket or from a lender. Whichever it is, the money buys things — an espresso machine, a lease, some beans — and those things earn revenue. Capital is the fuel; the assets are the engine.",
      intermediate: "Equity holders own what is left after everyone else is paid, so their return is unlimited and unguaranteed. Lenders are promised fixed amounts and get paid first, so their return is capped and comparatively safe. That ordering — lenders before owners — determines almost everything about how the two behave.",
      advanced: "The mix of the two is capital structure, and choosing it trades off the tax deductibility and discipline of debt against the cost of financial distress. In the frictionless world of Modigliani-Miller the mix does not matter; every practical reason it does matter is a friction that theory deliberately assumed away."
    },

    example: {
      company: "Bombay Bean Coffee Co., day one",
      walkthrough: "Priya puts in ₹10,00,000 of her own money and the bank lends ₹6,00,000. The company has ₹16,00,000 of capital, all of it in the bank on day one. It spends the lot on a fit-out and equipment. Nothing has been earned yet, but the balance sheet is complete: ₹16,00,000 of assets, funded by ₹10,00,000 of equity and ₹6,00,000 of debt."
    },

    whyItMatters: "The accounting equation, three-statement modelling and every valuation method you will meet later are elaborations of one fact learned here: assets equal the capital that paid for them, and that capital came from exactly two kinds of provider.",

    commonMistakes: [
      { mistake: "Thinking capital and cash are the same.", why: "Capital is where the money came from; cash is one of the things it might currently be sitting in. On day two most of it is equipment." },
      { mistake: "Believing equity is free because there is no interest.", why: "Equity is the most expensive capital there is. Owners want more than lenders precisely because they get paid last." },
      { mistake: "Confusing a loan repayment with an expense.", why: "Repaying principal returns capital. Only the interest is a cost of using it." }
    ],

    realWorld: [
      { field: "Startups", use: "Every funding round is a decision about how much ownership to sell for how much capital." },
      { field: "Private equity", use: "The entire strategy is changing a company's capital mix and its returns to owners." },
      { field: "Credit", use: "A lender's job is checking that the assets and cash flows can support the promise." }
    ],

    practice: [
      { id: "f4-p1", tier: "beginner", type: "match",
        prompt: "Equity or debt?",
        pairs: [
          { left: "Gets paid first if the business fails", right: "Debt" },
          { left: "Owns whatever is left over", right: "Equity" },
          { left: "Return is capped at the agreed interest", right: "Debt" },
          { left: "Return is unlimited and unguaranteed", right: "Equity" },
          { left: "Must be repaid on a fixed date", right: "Debt" }
        ] },
      { id: "f4-p2", tier: "practical", type: "numeric",
        prompt: "Priya puts in ₹10,00,000 and the bank lends ₹6,00,000. What percentage of the capital is equity?",
        expect: 0.625, tol: 0.005,
        hints: ["Total capital first.", "Then equity divided by that total.", "10,00,000 ÷ 16,00,000."],
        solution: "₹10,00,000 ÷ ₹16,00,000 = 62.5%." },
      { id: "f4-p3", tier: "application", type: "scenario",
        prompt: "The company spends its entire ₹16,00,000 on equipment and a fit-out. On day two:",
        rows: [
          { label: "Cash", answer: "down" },
          { label: "Equipment", answer: "up" },
          { label: "Total assets", answer: "none" },
          { label: "Equity", answer: "none" },
          { label: "Debt", answer: "none" }
        ],
        hints: ["Spending capital does not consume it — it converts it.", "Did the funding change, or only what it is sitting in?"],
        solution: "Assets change form: cash out, equipment in. Total assets are unchanged, and neither funding side moves. Capital was not spent in the sense of lost — it was deployed." },
      { id: "f4-p4", tier: "challenge", type: "interpretation",
        prompt: "Priya could fund the whole café herself. Why might she borrow ₹6,00,000 anyway?",
        keywords: [["return", "roe", "leverage", "magnif", "amplif", "more"], ["own money", "less capital", "keep", "spare", "own funds", "her own"]],
        hints: ["If the café earns the same profit either way, what changes when less of the money is hers?", "What else could she do with the ₹6,00,000 she did not put in?"],
        solution: "Using less of her own money for the same profit raises her return on that money — that is leverage. It also keeps ₹6,00,000 free for a second outlet or an emergency. The cost is that interest must be paid whether or not the café has a good month, which is the same leverage working against her."
      } ],

    sandbox: {
      title: "Day one of the café",
      instructions: "Total the capital, split it into percentages, and confirm it equals the assets it bought.",
      sheets: [{
        name: "Capital",
        cells: {
          A1: "FUNDING", B1: "₹",
          A2: "Priya's equity", B2: "1000000",
          A3: "Bank loan", B3: "600000",
          A4: "Total capital", B4: "",
          A5: "Equity share of capital", B5: "",
          A6: "Debt share of capital", B6: "",
          A8: "WHAT IT BOUGHT",
          A9: "Fit-out", B9: "900000",
          A10: "Equipment", B10: "700000",
          A11: "Total assets", B11: "",
          A13: "Check: capital − assets", B13: ""
        },
        editable: ["B4", "B5", "B6", "B11", "B13"],
        formats: Object.assign(fmtAll(["B2", "B3", "B4", "B9", "B10", "B11", "B13"], INR), { B5: PCT, B6: PCT })
      }],
      checks: [
        { cell: "B4", sheet: "Capital", expect: 1600000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Total capital via SUM" },
        { cell: "B5", sheet: "Capital", expect: 0.625, tol: 0.001, mustFormula: true, mustReference: ["B2", "B4"], label: "Equity share" },
        { cell: "B6", sheet: "Capital", expect: 0.375, tol: 0.001, mustFormula: true, mustReference: ["B3", "B4"], label: "Debt share" },
        { cell: "B11", sheet: "Capital", expect: 1600000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Total assets via SUM" },
        { cell: "B13", sheet: "Capital", expect: 0, tol: 0.5, mustFormula: true, mustReference: ["B4", "B11"], label: "The check must be zero" }
      ],
      solution: { Capital: { B4: "=SUM(B2:B3)", B5: "=B2/B4", B6: "=B3/B4", B11: "=SUM(B9:B10)", B13: "=B4-B11" } },
      cellHints: {
        B13: { whatGoesHere: "The check", hint: "If capital paid for the assets, the difference is zero.", pattern: "=capital − assets" }
      },
      success: "₹16,00,000 either way and a check of zero. You have just built the accounting equation without being told its name."
    },

    challenge: {
      id: "f4-c1", type: "debug",
      prompt: "A version of this sheet shows total capital ₹16,00,000, total assets ₹16,00,000, but the check in B13 reads ₹16,00,000 instead of zero. Which cell is wrong?",
      brokenCell: "B13",
      nearMiss: ["B4", "B11"],
      nearMissWhy: "Both totals are showing the right figure, so neither of them is the fault. The cell that is wrong is the one whose answer is wrong.",
      hints: ["Two cells are right and one is wrong. Which is showing something impossible?", "What formula in B13 would produce 16,00,000 when both inputs are 16,00,000?", "It is adding where it should subtract, or pointing at only one of them."],
      solution: "B13 reads =B4 (or =B4+B11 with a sign error) rather than =B4-B11. When two correct inputs produce an impossible output, the fault is in the cell doing the combining — a habit worth forming now, because the balance sheet capstone in Level 2 is this same check at ten times the size."
    },

    takeaways: [
      "Capital is money put in to produce more money",
      "It arrives as equity or as debt, and they rank differently",
      "Every asset was paid for by one or the other",
      "Deploying capital changes its form, not its amount"
    ]
  },

  /* ==================================================================== */
  {
    id: "0050-revenue",
    title: "Revenue",
    covers: ["Revenue"],
    level: "foundations", difficulty: "beginner", estimatedTime: 4,
    tags: ["revenue", "sales", "top line", "price", "volume"],
    summary: "The money a business earns from doing what it does — before anything is taken away.",
    prerequisites: [], relatedTopics: ["0060-costs", "0070-profit"],

    explanation: {
      short: "Revenue is what customers owe you for goods or services you have delivered. It is the top line, and it is earned rather than received.",
      beginner: "Sell 200 cups of coffee at ₹120 each and you have earned ₹24,000 of revenue. It does not matter yet what the coffee cost you, what you pay in rent, or whether the customer has actually handed over the money — revenue counts what you sold.",
      intermediate: "Revenue is almost always price × volume, and almost every forecast you will ever build starts by separating those two. A business growing revenue 20% by selling 20% more units is in a very different position from one raising prices 20% with volumes flat.",
      advanced: "Recognition is the subtle part: revenue is recorded when control of the good or service transfers, not when cash arrives. Under Ind AS 115 and IFRS 15 that means a five-step model — identify the contract, the performance obligations, the price, allocate it, and recognise as obligations are satisfied. A year's gym membership paid up front is one cash receipt and twelve months of revenue."
    },

    formula: {
      display: "Revenue = Price × Volume",
      variables: [
        { symbol: "Price", meaning: "What each unit sells for" },
        { symbol: "Volume", meaning: "How many units were sold in the period" }
      ],
      note: "Multi-product businesses do this line by line and add up."
    },

    visualization: {
      type: "driver-split", title: "Price × volume", interactive: true,
      controls: [
        { label: "Cups per day", key: "vol", min: 100, max: 400, step: 10, value: 200 },
        { label: "Price per cup", key: "price", min: 80, max: 200, step: 5, value: 120, fmt: "inr" }
      ],
      readouts: [{ label: "Revenue per day", derive: "vol * price", fmt: "inr" },
                 { label: "Revenue per month", derive: "vol * price * 30", fmt: "inr" }]
    },

    example: {
      company: "Bombay Bean Coffee Co.",
      walkthrough: "The café sells about 200 cups a day at ₹120 and some pastries besides. Over FY25 that adds up to ₹24,00,000 of revenue. Of that, ₹2,00,000 was still sitting unpaid with corporate customers at year end — it is revenue all the same, and it appears on the balance sheet as a receivable."
    },

    whyItMatters: "Revenue is the first line of every income statement and the base of nearly every ratio you will meet — gross margin, EBITDA margin, net margin. Get it wrong and everything below it is wrong in the same direction.",

    commonMistakes: [
      { mistake: "Treating revenue as cash received.", why: "A sale on 30-day credit is revenue today and cash next month. Whole businesses have failed while reporting record revenue." },
      { mistake: "Recording a deposit as revenue.", why: "Money received before you deliver is a liability — you owe the customer a service. It becomes revenue as you deliver it." },
      { mistake: "Reporting revenue net of costs by accident.", why: "Revenue is gross. Subtracting anything makes it a different line with a different name." }
    ],

    realWorld: [
      { field: "FP&A", use: "Every budget starts with a revenue build, split by price and volume." },
      { field: "Equity research", use: "Beat-or-miss against revenue guidance is what moves prices on results day." },
      { field: "Audit", use: "Revenue recognition is the single most tested area in most audits." }
    ],

    practice: [
      { id: "f5-p1", tier: "beginner", type: "numeric",
        prompt: "200 cups a day at ₹120 each, for 30 days. What is monthly revenue, in ₹?",
        expect: 720000, tol: 1,
        hints: ["Revenue is price times volume.", "Then multiply by the number of days.", "200 × 120 × 30."],
        solution: "200 × ₹120 × 30 = ₹7,20,000." },
      { id: "f5-p2", tier: "practical", type: "numeric",
        prompt: "The café raises the price 10% to ₹132 and loses 5% of volume, so 190 cups a day. What is daily revenue now, in ₹?",
        expect: 25080, tol: 1,
        hints: ["Work out the new price and the new volume separately.", "132 × 190."],
        solution: "₹132 × 190 = ₹25,080, up from ₹24,000. The price rise more than paid for the lost cups — which is not always true, and the point of doing the arithmetic." },
      { id: "f5-p3", tier: "application", type: "mcq",
        prompt: "A gym sells a ₹12,000 annual membership on 1 April and is paid in full that day. How much revenue does it record in April?",
        options: [
          { text: "₹12,000 — the cash arrived", correct: false, why: "Cash arriving is not the test. The gym has delivered one month of a twelve-month promise." },
          { text: "₹1,000", correct: true, why: "One twelfth of the obligation has been satisfied, so one twelfth of the revenue is earned. The other ₹11,000 sits as deferred revenue — a liability, because the gym owes eleven more months." },
          { text: "Nothing until March", correct: false, why: "Service is being delivered each month, so revenue is earned each month." },
          { text: "₹6,000 — half now, half later", correct: false, why: "There is no rule that splits it in half. It follows delivery, which here is even across twelve months." }
        ] },
      { id: "f5-p4", tier: "challenge", type: "interpretation",
        prompt: "A company reports revenue up 30% and cash from operations down 10%. Give the most likely explanation.",
        keywords: [["receivable", "credit", "not collected", "unpaid", "debtor", "customers owe"], ["revenue", "sale", "grew", "growth", "recorded"]],
        hints: ["Revenue counts sales made. Cash counts money collected.", "What if the new sales were all on generous credit terms?"],
        solution: "The growth was probably sold on credit, so it sits in receivables rather than the bank. Revenue is recognised on delivery; cash arrives when customers pay. Fast growth funded by lengthening credit terms is one of the most common ways a profitable business runs out of money."
      } ],

    sandbox: {
      title: "Build the café's revenue",
      instructions: "Revenue is price × volume, line by line. Build each product's revenue, then total it, then work out what share coffee is.",
      sheets: [{
        name: "Revenue",
        cells: {
          A1: "PRODUCT", B1: "Units/day", C1: "Price", D1: "Revenue/day",
          A2: "Coffee", B2: "200", C2: "120", D2: "",
          A3: "Pastries", B3: "60", C3: "80", D3: "",
          A4: "Packaged beans", B4: "8", C4: "450", D4: "",
          A5: "Total per day", D5: "",
          A7: "Days open per year", B7: "300",
          A8: "Revenue per year", B8: "",
          A9: "Coffee as a share of revenue", B9: ""
        },
        editable: ["D2", "D3", "D4", "D5", "B8", "B9"],
        formats: Object.assign(fmtAll(["C2", "C3", "C4", "D2", "D3", "D4", "D5", "B8"], INR),
          { B2: NUM, B3: NUM, B4: NUM, B7: NUM, B9: PCT })
      }],
      checks: [
        { cell: "D2", sheet: "Revenue", expect: 24000, tol: 1, mustFormula: true, mustReference: ["B2", "C2"], label: "Coffee revenue" },
        { cell: "D4", sheet: "Revenue", expect: 3600, tol: 1, mustFormula: true, mustReference: ["B4", "C4"], label: "Bean revenue" },
        { cell: "D5", sheet: "Revenue", expect: 32400, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Total per day via SUM" },
        { cell: "B8", sheet: "Revenue", expect: 9720000, tol: 10, mustFormula: true, mustReference: ["D5", "B7"], label: "Annual revenue" },
        { cell: "B9", sheet: "Revenue", expect: 0.7407, tol: 0.002, mustFormula: true, mustReference: ["D2", "D5"], label: "Coffee share" }
      ],
      solution: { Revenue: { D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", D5: "=SUM(D2:D4)", B8: "=D5*B7", B9: "=D2/D5" } },
      cellHints: {
        D2: { whatGoesHere: "Coffee revenue per day", hint: "Units multiplied by price. Write it once, then fill it down.", pattern: "=units × price" },
        B9: { whatGoesHere: "Coffee's share", hint: "Coffee revenue over total revenue.", pattern: "=coffee ÷ total" }
      },
      success: "₹32,400 a day, ₹97,20,000 a year, and coffee is 74% of it. Now change the price of a cup in C2 and watch the annual figure move — that is a revenue model."
    },

    challenge: {
      id: "f5-c1", type: "numeric",
      prompt: "Using the sandbox figures: if coffee volume grows 15% and its price rises 5%, while pastries and beans are unchanged, what is the new total revenue per day, in ₹?",
      expect: 37380, tol: 20,
      hints: [
        "Coffee's new volume and new price both change — apply both.",
        "200 × 1.15 = 230 cups; ₹120 × 1.05 = ₹126.",
        "Then add the unchanged ₹4,800 of pastries and ₹3,600 of beans."
      ],
      solution: "Coffee: 230 × ₹126 = ₹28,980. Plus pastries ₹4,800 and beans ₹3,600 = ₹37,380. Note that coffee revenue rose 20.75%, not 20% — growth in price and volume compounds rather than adding, and forgetting this is a standard modelling error."
    },

    takeaways: [
      "Revenue is earned on delivery, not on payment",
      "Almost all revenue is price × volume, and the split matters",
      "Money received before delivery is a liability, not revenue",
      "Price and volume growth compound, they do not add"
    ]
  },

  /* ==================================================================== */
  {
    id: "0060-costs",
    title: "Costs: fixed and variable",
    covers: ["Costs"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["costs", "fixed", "variable", "cogs", "operating leverage", "break-even"],
    summary: "What the business gives up to earn its revenue — and the crucial split between costs that move with sales and costs that do not.",
    prerequisites: ["0050-revenue"], relatedTopics: ["0050-revenue", "0070-profit"],

    explanation: {
      short: "Variable costs rise and fall with how much you sell. Fixed costs arrive whether you sell anything or not. Which is which determines how a business behaves when volumes change.",
      beginner: "Every cup of coffee needs beans and milk — sell twice as many cups and you buy twice as much. That is a variable cost. The rent is ₹80,000 whether you sell one cup or a thousand. That is fixed. Both are real money; they just behave completely differently.",
      intermediate: "The split drives break-even and operating leverage. A business with mostly fixed costs makes little money until it clears its fixed base, then makes a great deal from each extra sale. A business with mostly variable costs earns a steadier but thinner margin at every level.",
      advanced: "Few costs are purely one or the other over a wide range. Rent is fixed until you need a second outlet; staff are fixed within a shift pattern and step up in blocks. Treating stepped costs as smoothly variable is what makes a forecast look reasonable and behave badly."
    },

    formula: {
      display: "Total cost = Fixed costs + (Variable cost per unit × Units)",
      alternate: "Contribution per unit = Price − Variable cost per unit",
      variables: [
        { symbol: "Fixed costs", meaning: "Unchanged by volume within the relevant range" },
        { symbol: "Variable cost per unit", meaning: "What one more sale costs you" },
        { symbol: "Contribution", meaning: "What each sale contributes toward covering the fixed costs" }
      ]
    },

    example: {
      company: "Bombay Bean Coffee Co.",
      walkthrough: "A cup sells at ₹120 and costs ₹42 in beans, milk, sugar and a cup — so each one contributes ₹78 toward the month's fixed costs of ₹1,80,000 in rent, salaries and utilities. It takes about 2,308 cups a month before the café makes a rupee of profit. Every cup after that is worth ₹78 to the bottom line."
    },

    whyItMatters: "The fixed-variable split explains why some businesses collapse in a downturn and others merely thin out, and it is the first thing a lender or investor works out about a company they do not know.",

    commonMistakes: [
      { mistake: "Assuming all costs scale with revenue in a forecast.", why: "It is the easy assumption and it hides operating leverage entirely — the most interesting thing about the business disappears from the model." },
      { mistake: "Calling every cost of goods sold variable.", why: "Factory rent and supervisor salaries often sit inside COGS and are fixed. The accounting label and the behaviour are different questions." },
      { mistake: "Ignoring that fixed costs step.", why: "One more oven, one more shift, one more outlet. Fixed costs are flat until suddenly they are not." }
    ],

    realWorld: [
      { field: "FP&A", use: "Break-even analysis before launching a product or an outlet." },
      { field: "Private equity", use: "Judging how much debt a business can carry depends on how fixed its cost base is." },
      { field: "Credit", use: "A high fixed-cost borrower is far more sensitive to a demand shock." }
    ],

    practice: [
      { id: "f6-p1", tier: "beginner", type: "match",
        prompt: "Fixed or variable, for a café?",
        pairs: [
          { left: "Coffee beans", right: "Variable" },
          { left: "Shop rent", right: "Fixed" },
          { left: "Paper cups", right: "Variable" },
          { left: "Manager's salary", right: "Fixed" },
          { left: "Milk", right: "Variable" },
          { left: "Insurance premium", right: "Fixed" }
        ] },
      { id: "f6-p2", tier: "practical", type: "numeric",
        prompt: "A cup sells for ₹120 and costs ₹42 in ingredients. What is the contribution per cup, in ₹?",
        expect: 78, tol: 0.5,
        hints: ["Contribution is what is left after the costs that vary with the sale.", "120 − 42."],
        solution: "₹120 − ₹42 = ₹78 per cup toward fixed costs." },
      { id: "f6-p3", tier: "application", type: "numeric",
        prompt: "Fixed costs are ₹1,80,000 a month and each cup contributes ₹78. How many cups must be sold to break even? Round up to a whole cup.",
        expect: 2308, tol: 1,
        hints: ["Break-even is where contribution exactly covers the fixed costs.", "How many ₹78s fit into ₹1,80,000?", "1,80,000 ÷ 78."],
        solution: "₹1,80,000 ÷ ₹78 = 2,307.7, so 2,308 cups. Below that the café loses money; above it, each cup adds ₹78 of profit." },
      { id: "f6-p4", tier: "challenge", type: "scenario",
        prompt: "Volumes fall 20%. Compare Café A (mostly fixed costs) with Café B (mostly variable costs):",
        rows: [
          { label: "Café A revenue", answer: "down" },
          { label: "Café A total costs", answer: "none" },
          { label: "Café A profit", answer: "down" },
          { label: "Café B total costs", answer: "down" },
          { label: "Café B profit", answer: "down" }
        ],
        hints: ["Both lose the same revenue. What happens to each cost base?", "Fixed costs do not care that fewer people came in."],
        solution: "Both revenues fall 20%. Café A's costs barely move, so almost the whole revenue loss lands on profit. Café B's costs fall with volume, cushioning it. Both profits fall, but A's falls far harder — that is operating leverage, and it works in both directions."
      } ],

    sandbox: {
      title: "Break-even for the café",
      instructions: "Build the contribution per cup, total the fixed costs, then find the break-even volume. B12 should show how many cups it takes to cover everything.",
      sheets: [{
        name: "Break-even",
        cells: {
          A1: "PER CUP", B1: "₹",
          A2: "Selling price", B2: "120",
          A3: "Ingredients and cup", B3: "42",
          A4: "Contribution per cup", B4: "",
          A6: "FIXED COSTS PER MONTH",
          A7: "Rent", B7: "80000",
          A8: "Salaries", B8: "85000",
          A9: "Utilities and other", B9: "15000",
          A10: "Total fixed costs", B10: "",
          A12: "Break-even cups per month", B12: "",
          A13: "Break-even cups per day (30 days)", B13: "",
          A14: "Profit if 3,000 cups are sold", B14: ""
        },
        editable: ["B4", "B10", "B12", "B13", "B14"],
        formats: Object.assign(fmtAll(["B2", "B3", "B4", "B7", "B8", "B9", "B10", "B14"], INR),
          { B12: NUM, B13: { type: "number", dp: 1 } })
      }],
      checks: [
        { cell: "B4", sheet: "Break-even", expect: 78, tol: 0.5, mustFormula: true, mustReference: ["B2", "B3"], label: "Contribution per cup" },
        { cell: "B10", sheet: "Break-even", expect: 180000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Fixed costs via SUM" },
        { cell: "B12", sheet: "Break-even", expect: 2308, tol: 1, mustFormula: true, mustReference: ["B10", "B4"], label: "Break-even volume" },
        { cell: "B13", sheet: "Break-even", expect: 76.9, tol: 0.5, mustFormula: true, mustReference: ["B12"], label: "Break-even per day" },
        { cell: "B14", sheet: "Break-even", expect: 54000, tol: 100, mustFormula: true, mustReference: ["B4", "B10"], label: "Profit at 3,000 cups" }
      ],
      solution: {
        "Break-even": {
          B4: "=B2-B3", B10: "=SUM(B7:B9)", B12: "=ROUNDUP(B10/B4,0)",
          B13: "=B12/30", B14: "=3000*B4-B10"
        }
      },
      cellHints: {
        B12: { whatGoesHere: "Break-even volume", hint: "How many contributions it takes to cover the fixed costs. Round up — you cannot sell most of a cup.", pattern: "=ROUNDUP(fixed ÷ contribution, 0)" },
        B14: { whatGoesHere: "Profit at 3,000 cups", hint: "Contribution from every cup, less the fixed costs.", pattern: "=3000 × contribution − fixed" }
      },
      success: "2,308 cups to break even — about 77 a day — and ₹54,000 of profit at 3,000. Now change the rent in B7 and watch how many more cups the café has to sell just to stand still."
    },

    challenge: {
      id: "f6-c1", type: "numeric",
      prompt: "The landlord raises rent by ₹20,000 a month. How many additional cups per month must the café sell just to stay at the same profit?",
      expect: 257, tol: 3,
      hints: [
        "The extra rent has to be covered by contribution from extra cups.",
        "Each cup still contributes ₹78.",
        "20,000 ÷ 78."
      ],
      solution: "₹20,000 ÷ ₹78 = 256.4, so 257 more cups a month — about 9 a day. This is the calculation to run before signing any lease, and it is why fixed-cost increases are far more dangerous than they look."
    },

    takeaways: [
      "Variable costs move with volume; fixed costs do not",
      "Contribution per unit is price less variable cost",
      "Break-even is fixed costs divided by contribution",
      "A fixed-heavy cost base magnifies both good and bad volume news"
    ]
  },

  /* ==================================================================== */
  {
    id: "0070-profit",
    title: "Profit",
    covers: ["Profit"],
    level: "foundations", difficulty: "beginner", estimatedTime: 5,
    tags: ["profit", "margin", "gross profit", "net profit", "bottom line"],
    summary: "What is left after costs — and why there are several answers depending on which costs you have taken off so far.",
    prerequisites: ["0050-revenue", "0060-costs"], relatedTopics: ["0080-cash"],

    explanation: {
      short: "Profit is revenue less costs. Because costs come off in layers, there are several profits — gross, operating, and net — and naming which one you mean is half the skill.",
      beginner: "Sell ₹100 of coffee. Take off ₹35 of beans and milk and you have ₹65 of gross profit. Take off ₹45 of rent, salaries and power and you have ₹20 of operating profit. Take off interest and tax and what remains is net profit, the amount that actually belongs to the owner.",
      intermediate: "Each layer answers a different question. Gross margin asks whether the product itself works. Operating margin asks whether the business around the product works. Net margin asks what survives financing and the government. A company can be excellent at one layer and hopeless at the next.",
      advanced: "Profit is an accrual measure and therefore an opinion in a way cash is not: it depends on when revenue is recognised, how assets are depreciated, and what is capitalised rather than expensed. Two honest accountants can produce different profits for the same year. This is not fraud; it is why cash flow is read alongside."
    },

    formula: {
      display: "Gross profit = Revenue − Cost of goods sold",
      alternate: "Net profit = Revenue − all costs, including interest and tax",
      variables: [
        { symbol: "Margin", meaning: "Any profit divided by revenue, expressed as a percentage" }
      ],
      note: "A margin lets you compare a corner shop with a conglomerate. An absolute profit does not."
    },

    example: {
      company: "Bombay Bean Coffee Co., FY25",
      rows: [["Revenue", 2400000], ["Cost of goods sold", -840000], ["Gross profit", 1560000],
             ["Operating expenses", -1020000], ["EBITDA", 540000], ["Depreciation", -240000],
             ["EBIT", 300000], ["Interest", -60000], ["Tax", -60000], ["Net profit", 180000]],
      walkthrough: "₹24,00,000 in, ₹1,80,000 out the bottom. The café keeps 65 paise of every rupee after ingredients, 12.5 paise after running costs and depreciation, and 7.5 paise after the bank and the government. Each of those three numbers tells you about a different part of the business."
    },

    whyItMatters: "Every valuation multiple you will meet — P/E, EV/EBITDA — is a price divided by one of these profit layers. Using the wrong layer is the fastest way to value a company incorrectly by a wide margin.",

    commonMistakes: [
      { mistake: "Saying 'profit' without saying which one.", why: "Gross and net profit differ by a factor of eight in the example above. The word alone carries almost no information." },
      { mistake: "Comparing absolute profits across companies of different sizes.", why: "₹10 crore of profit is superb for a café chain and alarming for a bank. Margins compare; amounts do not." },
      { mistake: "Assuming profit means cash in the bank.", why: "Profit is measured on delivery and includes non-cash charges like depreciation. The next lesson is entirely about this gap." }
    ],

    realWorld: [
      { field: "Equity research", use: "Margin trends are the main evidence for whether a business is improving." },
      { field: "Investment banking", use: "Every comparable-company table is built from these layers." },
      { field: "Management", use: "Falling gross margin and falling net margin call for completely different responses." }
    ],

    practice: [
      { id: "f7-p1", tier: "beginner", type: "numeric",
        prompt: "Revenue ₹500 Cr, cost of goods sold ₹300 Cr. What is gross margin, as a percentage?",
        expect: 0.40, tol: 0.005,
        hints: ["First find gross profit.", "Then divide it by revenue.", "(500 − 300) ÷ 500."],
        solution: "Gross profit ₹200 Cr ÷ revenue ₹500 Cr = 40%." },
      { id: "f7-p2", tier: "practical", type: "order",
        prompt: "Put the income statement in order, from the top line down.",
        sequence: ["Revenue", "Gross profit", "EBITDA", "EBIT", "Profit before tax", "Net profit"],
        hints: ["Start with what customers paid.", "Ingredients come off first, then running costs, then depreciation, then interest, then tax."] },
      { id: "f7-p3", tier: "application", type: "interpretation",
        prompt: "A company's gross margin is steady at 60% but its net margin has fallen from 12% to 4%. Where should you look?",
        keywords: [["operating", "opex", "overhead", "salaries", "rent", "interest", "depreciation", "tax"], ["not", "unchanged", "steady", "stable", "same"]],
        hints: ["The problem is not in the product — gross margin held.", "Which costs sit between gross profit and net profit?"],
        solution: "The product economics are intact, so the damage is below gross profit: operating expenses, depreciation, interest or tax. Rising overheads or a new debt load are the usual culprits. Splitting profit into layers is what lets you locate a problem instead of merely noticing one."
      },
      { id: "f7-p4", tier: "challenge", type: "scenario",
        prompt: "The café renegotiates its bean supply, cutting cost of goods sold by ₹1,00,000 with everything else unchanged. What happens?",
        rows: [
          { label: "Revenue", answer: "none" },
          { label: "Gross profit", answer: "up" },
          { label: "Gross margin", answer: "up" },
          { label: "Net profit", answer: "up" },
          { label: "Tax paid", answer: "up" }
        ],
        hints: ["A cost saving flows all the way down.", "If profit before tax rises, what happens to the tax on it?"],
        solution: "Revenue is untouched; every profit layer below gross improves. Tax rises because there is more profit to tax — so the ₹1,00,000 saving is worth less than ₹1,00,000 at the bottom line, roughly ₹75,000 at a 25% rate. Savings are always worth their after-tax amount."
      } ],

    sandbox: {
      title: "Build the café's profit layers",
      instructions: "Every subtotal is a formula. Build gross profit, EBITDA, EBIT and net profit, then the three margins in column C.",
      sheets: [{
        name: "Profit",
        cells: {
          A1: "FY25", B1: "₹", C1: "% of revenue",
          A2: "Revenue", B2: "2400000", C2: "",
          A3: "Cost of goods sold", B3: "-840000",
          A4: "Gross profit", B4: "", C4: "",
          A5: "Operating expenses", B5: "-1020000",
          A6: "EBITDA", B6: "", C6: "",
          A7: "Depreciation", B7: "-240000",
          A8: "EBIT", B8: "",
          A9: "Interest", B9: "-60000",
          A10: "Tax", B10: "-60000",
          A11: "Net profit", B11: "", C11: ""
        },
        editable: ["B4", "B6", "B8", "B11", "C2", "C4", "C6", "C11"],
        formats: Object.assign(fmtAll(["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11"], INR),
          { C2: PCT, C4: PCT, C6: PCT, C11: PCT })
      }],
      checks: [
        { cell: "B4", sheet: "Profit", expect: 1560000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Gross profit" },
        { cell: "B6", sheet: "Profit", expect: 540000, tol: 1, mustFormula: true, mustReference: ["B4", "B5"], label: "EBITDA" },
        { cell: "B8", sheet: "Profit", expect: 300000, tol: 1, mustFormula: true, mustReference: ["B6", "B7"], label: "EBIT" },
        { cell: "B11", sheet: "Profit", expect: 180000, tol: 1, mustFormula: true, mustReference: ["B8", "B9", "B10"], label: "Net profit" },
        { cell: "C4", sheet: "Profit", expect: 0.65, tol: 0.002, mustFormula: true, mustReference: ["B4", "B2"], label: "Gross margin" },
        { cell: "C11", sheet: "Profit", expect: 0.075, tol: 0.002, mustFormula: true, mustReference: ["B11", "B2"], label: "Net margin" }
      ],
      solution: {
        Profit: {
          B4: "=B2+B3", B6: "=B4+B5", B8: "=B6+B7", B11: "=B8+B9+B10",
          C2: "=B2/$B$2", C4: "=B4/$B$2", C6: "=B6/$B$2", C11: "=B11/$B$2"
        }
      },
      cellHints: {
        B4: { whatGoesHere: "Gross profit", hint: "Costs are stored negative, so add them.", pattern: "=revenue + COGS" },
        C4: { whatGoesHere: "Gross margin", hint: "Anchor the revenue cell with $ so the formula can be filled down the column.", pattern: "=B4/$B$2" }
      },
      success: "65% gross, 22.5% EBITDA, 7.5% net. Three numbers, three different questions about the same café — and the $ anchor in column C means you can fill it down without the revenue reference drifting."
    },

    challenge: {
      id: "f7-c1", type: "debug",
      prompt: "A learner filled the margin formula down column C and got 65%, then 100%, then 42% — nonsense below the first row. C4 alone is correct. Which cell is the root cause?",
      brokenCell: "C4",
      nearMiss: ["C6", "C11"],
      nearMissWhy: "C6 and C11 are both wrong, but they inherited the fault from the cell they were filled from.",
      hints: [
        "C4 is right where it sits but wrong the moment it is copied.",
        "What does the revenue reference become one row further down?",
        "Without a $, B2 becomes B4, then B9."
      ],
      solution: "C4 was written =B4/B2 without anchoring the denominator. Filled down, the revenue reference slides to B4, B6 and so on, so each row divides by the wrong thing. The fix is =B4/$B$2. This is the same absolute-reference discipline the DCF lesson tests in Level 5 — it is worth forming the habit here, where the numbers are small enough to spot the error."
    },

    takeaways: [
      "There is no single profit — gross, operating and net answer different questions",
      "Margins compare across companies; absolute profits do not",
      "A cost saving is worth its after-tax amount, not its full amount",
      "Profit depends on accounting judgements in a way cash does not"
    ]
  },

  /* ==================================================================== */
  {
    id: "0080-cash",
    title: "Cash, and why it isn't profit",
    covers: ["Cash"],
    level: "foundations", difficulty: "beginner", estimatedTime: 6,
    tags: ["cash", "profit", "working capital", "receivables", "liquidity", "accrual"],
    summary: "Profit is an opinion; cash is a fact. The gap between them is where most business failures live.",
    prerequisites: ["0070-profit"], relatedTopics: ["0070-profit", "0090-assets"],

    explanation: {
      short: "Cash is money actually in the bank. Profit counts sales when delivered and costs when incurred. The two differ whenever money moves at a different time from the event that caused it.",
      beginner: "You deliver ₹1,00,000 of coffee to an office in March and they pay you in May. March's profit includes it; March's bank balance does not. Meanwhile you paid for the beans in February. Profitable in March, empty-handed in March. Both statements are true, and only one of them pays the rent.",
      intermediate: "Three things drive the gap. Timing — receivables and payables shift when cash moves relative to the sale. Non-cash charges — depreciation reduces profit without any money leaving. Capital spending — buying a machine takes cash immediately but hits profit slowly over years. The cash flow statement exists to reconcile exactly these.",
      advanced: "This is why cash flow is harder to manipulate than earnings and why analysts watch the conversion of profit into operating cash. Persistent divergence — profit rising while operating cash stalls — is among the most reliable warning signs in financial analysis, because it usually means revenue is being recognised faster than it is being collected."
    },

    formula: {
      display: "Cash flow ≈ Profit + Non-cash charges − Increase in working capital − Capital spending",
      variables: [
        { symbol: "Non-cash charges", meaning: "Mainly depreciation and amortisation — costs with no payment attached" },
        { symbol: "Working capital", meaning: "Money tied up in receivables and inventory, less what suppliers are funding" }
      ],
      note: "Level 2 builds this properly as the cash flow statement. This is the shape of it."
    },

    example: {
      company: "Bombay Bean Coffee Co., FY25",
      walkthrough: "The café made ₹1,80,000 of profit. Add back ₹2,40,000 of depreciation — a real cost but no money left the bank. Take off the ₹2,00,000 now sitting in receivables with corporate customers and the extra stock on the shelves. Take off the ₹2,40,000 spent on the delivery van. The bank balance moved far less than the profit line suggests, and the cash flow statement is the document that shows exactly why."
    },

    whyItMatters: "Businesses do not fail on the day they become unprofitable. They fail on the day a payment is due and the money is not there. Profit tells you whether the model works; cash tells you whether you survive to find out.",

    commonMistakes: [
      { mistake: "Reading profit as money available to spend.", why: "Much of it may be sitting in receivables, inventory, or a machine bought in March." },
      { mistake: "Thinking depreciation costs cash each year.", why: "The cash left when the asset was bought. Depreciation spreads that past payment across the years of use." },
      { mistake: "Assuming a profitable company cannot run out of money.", why: "Fast-growing profitable companies run out of money routinely — growth consumes working capital before it produces cash." }
    ],

    realWorld: [
      { field: "Credit", use: "Lenders lend against cash flow, because interest is paid in cash, not in profit." },
      { field: "Private equity", use: "Debt is serviced from cash, so cash conversion drives how much can be borrowed." },
      { field: "Founders", use: "Runway is a cash calculation. A profitable startup can still have three months left." }
    ],

    practice: [
      { id: "f8-p1", tier: "beginner", type: "mcq",
        prompt: "The café delivers ₹1,00,000 of coffee in March, on 60-day credit. What does March show?",
        options: [
          { text: "₹1,00,000 of revenue and ₹1,00,000 of cash", correct: false, why: "The coffee was delivered, so revenue is earned — but nobody has paid yet." },
          { text: "₹1,00,000 of revenue and no cash", correct: true, why: "Revenue follows delivery; cash follows payment. The ₹1,00,000 sits as a receivable until May." },
          { text: "No revenue and no cash until May", correct: false, why: "That would be cash accounting. Under accrual accounting the sale is recorded when delivered." },
          { text: "No revenue but ₹1,00,000 of cash", correct: false, why: "Nothing has been paid, so there is no cash either." }
        ] },
      { id: "f8-p2", tier: "practical", type: "numeric",
        prompt: "Profit is ₹1,80,000 and depreciation is ₹2,40,000. Ignoring everything else, how much cash did operations generate, in ₹?",
        expect: 420000, tol: 1,
        hints: ["Depreciation reduced profit but no money left the bank.", "So it must be added back.", "1,80,000 + 2,40,000."],
        solution: "₹1,80,000 + ₹2,40,000 = ₹4,20,000. Adding back non-cash charges is always the first step of the indirect cash flow statement." },
      { id: "f8-p3", tier: "application", type: "scenario",
        prompt: "The café buys a ₹2,40,000 van for cash in FY25. In FY25 itself:",
        rows: [
          { label: "Cash", answer: "down" },
          { label: "Profit", answer: "down" },
          { label: "Total assets", answer: "none" },
          { label: "Fixed assets", answer: "up" }
        ],
        hints: ["The full ₹2,40,000 leaves the bank at once.", "But how much of the van's cost reaches the income statement in year one?", "Only that year's depreciation."],
        solution: "Cash falls by the full ₹2,40,000 immediately. Profit falls only by the first year's depreciation, not the whole price. Total assets are unchanged at the moment of purchase — cash became a van — and then decline as the van depreciates. This timing difference is exactly why capital spending sits in its own section of the cash flow statement." },
      { id: "f8-p4", tier: "challenge", type: "interpretation",
        prompt: "A company has grown profit every year for four years and has just missed a loan repayment. How?",
        keywords: [["working capital", "receivable", "inventory", "growth", "tied up", "collect"], ["cash", "capex", "capital spending", "investment", "bank"]],
        hints: ["Profit and cash are different. Which one pays a loan?", "What does fast growth do to receivables and inventory?", "What if the growth was funded by building stock and extending credit?"],
        solution: "Growth consumes cash before it produces it. Each year's larger sales meant more inventory on the shelves and more money owed by customers, and possibly heavy capital spending to add capacity. All of that is cash out while profit rises. This is the single most common way a genuinely good business fails, and it is why the cash flow statement exists as a separate statement."
      } ],

    sandbox: {
      title: "From profit to cash",
      instructions: "Start at profit and work down to the movement in cash. Add back what did not cost money; take off what cost money but was not an expense.",
      sheets: [{
        name: "Cash bridge",
        cells: {
          A1: "FY25", B1: "₹",
          A2: "Net profit", B2: "180000",
          A3: "Add back: depreciation", B3: "240000",
          A4: "Cash from profit before working capital", B4: "",
          A6: "WORKING CAPITAL",
          A7: "Increase in receivables", B7: "-200000",
          A8: "Increase in inventory", B8: "-150000",
          A9: "Increase in payables", B9: "120000",
          A10: "Cash from operations", B10: "",
          A12: "INVESTING AND FINANCING",
          A13: "Bought the van", B13: "-240000",
          A14: "Dividend paid", B14: "-50000",
          A15: "Change in cash for the year", B15: "",
          A17: "Profit less change in cash (the gap)", B17: ""
        },
        editable: ["B4", "B10", "B15", "B17"],
        formats: fmtAll(["B2", "B3", "B4", "B7", "B8", "B9", "B10", "B13", "B14", "B15", "B17"], INR)
      }],
      checks: [
        { cell: "B4", sheet: "Cash bridge", expect: 420000, tol: 1, mustFormula: true, mustReference: ["B2", "B3"], label: "Profit plus depreciation" },
        { cell: "B10", sheet: "Cash bridge", expect: 190000, tol: 1, mustFormula: true, mustUse: ["SUM"], label: "Cash from operations via SUM" },
        { cell: "B15", sheet: "Cash bridge", expect: -100000, tol: 1, mustFormula: true, mustReference: ["B10", "B13", "B14"], label: "Change in cash" },
        { cell: "B17", sheet: "Cash bridge", expect: 280000, tol: 1, mustFormula: true, mustReference: ["B2", "B15"], label: "The gap" }
      ],
      solution: {
        "Cash bridge": {
          B4: "=B2+B3", B10: "=B4+SUM(B7:B9)", B15: "=B10+B13+B14", B17: "=B2-B15"
        }
      },
      cellHints: {
        B10: { whatGoesHere: "Cash from operations", hint: "Everything above, including the three working capital lines.", pattern: "=B4 + SUM(working capital)" },
        B17: { whatGoesHere: "The gap", hint: "How far profit and cash diverged this year.", pattern: "=profit − change in cash" }
      },
      success: "Profit ₹1,80,000; cash down ₹1,00,000. A gap of ₹2,80,000 in a single year, in a business that is genuinely profitable. Change the receivables line in B7 and watch how quickly a good year turns into a cash crisis."
    },

    challenge: {
      id: "f8-c1", type: "numeric",
      prompt: "Using the sandbox: if receivables had increased by ₹5,00,000 instead of ₹2,00,000, what would the change in cash for the year have been, in ₹?",
      expect: -400000, tol: 100,
      hints: [
        "Only one line changes, by ₹3,00,000.",
        "More money owed to you means less money in the bank.",
        "The existing −₹1,00,000, worsened by another ₹3,00,000."
      ],
      solution: "Cash would fall ₹4,00,000 for the year. The profit line would be identical at ₹1,80,000 — the income statement would look like a good year while the bank balance dropped by more than twice the profit. This is the working-capital trap, and Module 1500 builds the year that proves it."
    },

    takeaways: [
      "Profit is an accrual measure; cash is a fact about the bank",
      "The gap comes from timing, non-cash charges and capital spending",
      "Depreciation is added back because the money left years ago",
      "Growth consumes cash before it produces it"
    ]
  }

  ];
});
