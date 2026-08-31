/* The lessons manifest. Adding a lesson = one object in a module file
   + one id in the right module's list below. Nothing else changes. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  LS.manifest = {
    levels: [
      { title: "Level 1 · Accounts & statements", modules: ["1000", "1100", "1200", "1300", "1400", "1500"] },
      { title: "Level 2 · Analysis & modeling", modules: ["1600", "2100", "2200"] }
    ],
    modules: {
      "1000": { title: "Foundations", blurb: "The five buckets, the accounting equation, double entry, and the map of the three statements.", lessons: ["1010-five-buckets", "1020-accounting-equation", "1030-two-sides", "1040-three-statements"] },
      "1100": { title: "Assets", blurb: "PP&E, depreciation, inventory, receivables and cash — everything the café owns, built line by line.", lessons: ["1110-ppe", "1120-depreciation", "1130-inventory", "1140-receivables", "1150-cash-deposit"] },
      "1200": { title: "Liabilities", blurb: "Supplier credit, accruals and the bank loan — what the café owes, and why interest ≠ principal.", lessons: ["1210-payables", "1220-borrowings", "1230-right-hand-side"] },
      "1300": { title: "Equity & the balance sheet", blurb: "Share capital, retained earnings, and the capstone: a full balance sheet that must tie at ₹19,50,000.", lessons: ["1310-share-capital", "1320-retained-earnings", "1330-balance-sheet"] },
      "1400": { title: "The income statement", blurb: "Revenue down to profit after tax, one line at a time — ending in a P&L whose bottom line must match the balance sheet.", lessons: ["1410-revenue", "1420-cogs", "1430-opex-ebitda", "1440-depreciation-pl", "1450-interest-tax", "1460-pl-capstone"] },
      "1500": { title: "The cash flow statement", blurb: "Why profit isn't cash, the indirect method, and a closing cash balance that must equal the balance sheet's ₹1,00,000.", lessons: ["1510-profit-not-cash", "1520-cfo", "1530-cfi", "1540-cff", "1550-cf-capstone"] },
      "1600": { title: "Reading statements: ratios", blurb: "Margins, liquidity, leverage and returns — plus side-by-side comparisons where you judge which business is healthier.", lessons: ["1610-margins", "1620-liquidity", "1630-leverage", "1640-returns"] },
      "2100": { title: "Linking the three statements", blurb: "The three bridges, a three-year linked model that ties in every year, and the classic find-the-broken-link debugging drill.", lessons: ["2110-three-bridges", "2120-linked-model", "2130-broken-link"] },
      "2200": { title: "Modeling & valuation", blurb: "Drivers, a projected P&L, free cash flow, a DCF with terminal value, and a capstone that values the café.", lessons: ["2210-drivers", "2220-project-pl", "2230-fcff", "2240-dcf", "2250-valuation-capstone"] }
    },

    /*
     * Full FinStudio roadmap. These are deliberately separate from `modules`:
     * only modules with authored interactive lessons enter the live lesson engine.
     * The roadmap lets learners see the complete path without creating fake links
     * or pretending a topic is finished before its exercises exist.
     */
    roadmap: [
      {
        level: 0, key: "foundations", title: "Finance foundations", blurb: "Learn the language of finance, how capital moves, and how to think about a business before opening a model.",
        modules: [
          { title: "How a business works", topics: ["Business model & value creation", "Revenue, costs and profit", "Capital allocation", "Cash versus accounting profit", "Operating and financial leverage"] },
          { title: "Time value of money", topics: ["Present value", "Future value", "Discount rates", "Compounding", "Annuities and perpetuities"] },
          { title: "The finance ecosystem", topics: ["Companies & management", "Banks & lenders", "Equity investors", "Capital markets", "Investment bankers, research analysts and private equity"] }
        ]
      },
      {
        level: 1, key: "accounting", title: "Accounting foundations", blurb: "Build the accounting system from first principles — the same line-by-line approach used in the café lessons.",
        modules: [
          { title: "Accounts & statements", topics: ["The five buckets", "Accounting equation", "Double entry", "Three financial statements"] },
          { title: "Assets", topics: ["PP&E", "Depreciation", "Inventory", "Receivables", "Cash & deposits"] },
          { title: "Liabilities & equity", topics: ["Payables & accruals", "Borrowings", "Share capital", "Retained earnings", "Balance sheet"] },
          { title: "Accounting mechanics", topics: ["Accrual accounting", "Prepayments & provisions", "Deferred revenue", "Working capital accounting", "Accounting close"] }
        ]
      },
      {
        level: 2, key: "statements", title: "Financial statements", blurb: "Read a company's P&L, balance sheet and cash flow statement — then connect every line across them.",
        modules: [
          { title: "Income statement", topics: ["Revenue recognition", "COGS & gross profit", "Operating expenses", "EBITDA & EBIT", "Interest & tax", "Profit after tax"] },
          { title: "Cash flow statement", topics: ["Profit is not cash", "CFO", "CFI", "CFF", "Indirect method", "Cash flow capstone"] },
          { title: "Statement quality", topics: ["Notes to accounts", "Accounting policies", "Non-recurring items", "Quality of earnings", "Cash conversion"] },
          { title: "Financial reporting", topics: ["Ind AS / IFRS concepts", "Segment reporting", "Related parties", "Contingencies", "Audit opinion"] }
        ]
      },
      {
        level: 3, key: "analysis", title: "Financial analysis", blurb: "Turn statements into decisions: profitability, liquidity, leverage, returns and the quality behind the headline numbers.",
        modules: [
          { title: "Ratio analysis", topics: ["Margins", "Liquidity", "Leverage", "Coverage", "Returns"] },
          { title: "Working capital analysis", topics: ["DSO", "DIO", "DPO", "Cash conversion cycle", "Working capital intensity"] },
          { title: "Business analysis", topics: ["Unit economics", "Operating leverage", "Competitive advantage", "Growth quality", "Capital intensity"] },
          { title: "Comparative analysis", topics: ["Peer benchmarking", "Trend analysis", "Common-size statements", "DuPont analysis", "Red flags"] }
        ]
      },
      {
        level: 4, key: "modeling", title: "Financial modelling", blurb: "Build robust models that flow from assumptions to statements to cash and returns.",
        modules: [
          { title: "Model architecture", topics: ["Model structure", "Historical financials", "Assumptions", "Checks & controls", "Formatting conventions"] },
          { title: "Forecasting", topics: ["Revenue drivers", "Margin drivers", "Working capital", "CapEx & depreciation", "Taxes"] },
          { title: "Three-statement modelling", topics: ["P&L forecast", "Balance sheet forecast", "Cash flow forecast", "Debt schedule", "Model checks"] },
          { title: "Scenario & sensitivity analysis", topics: ["Base / upside / downside", "Data tables", "Sensitivity matrices", "Break-even analysis", "Model debugging"] },
          { title: "Advanced modelling", topics: ["Circularity", "Revolver mechanics", "Acquisition models", "Operating cases", "Model audit"] }
        ]
      },
      {
        level: 5, key: "valuation", title: "Valuation", blurb: "Learn what a business is worth and why different valuation methods produce different answers.",
        modules: [
          { title: "DCF valuation", topics: ["FCFF", "WACC", "Terminal value", "Mid-year convention", "Sensitivity analysis"] },
          { title: "Trading comparables", topics: ["EV / EBITDA", "EV / Revenue", "P / E", "Peer selection", "Multiple normalization"] },
          { title: "Precedent transactions", topics: ["Transaction multiples", "Control premium", "Synergies", "Deal selection", "Interpretation"] },
          { title: "Other valuation methods", topics: ["Sum-of-the-parts", "Asset-based valuation", "Dividend discount model", "Residual income", "Real estate valuation"] },
          { title: "Valuation judgement", topics: ["Value drivers", "Terminal assumptions", "Scenario ranges", "Valuation bridge", "Investment conclusion"] }
        ]
      },
      {
        level: 6, key: "ib", title: "Investment banking", blurb: "Go from financial analysis to the mechanics of transactions, pitches and deal execution.",
        modules: [
          { title: "Investment banking fundamentals", topics: ["What bankers do", "Deal lifecycle", "Pitching", "Mandates", "Fees"] },
          { title: "M&A", topics: ["Strategic rationale", "Buyer universe", "Synergies", "Purchase price", "Deal mechanics"] },
          { title: "Accretion / dilution", topics: ["EPS impact", "Purchase accounting", "Funding mix", "Synergies", "Break-even analysis"] },
          { title: "Transaction execution", topics: ["Process & timeline", "Due diligence", "Indicative offers", "Definitive agreements", "Closing adjustments"] },
          { title: "Banking deliverables", topics: ["Pitchbook", "Company profile", "Valuation pages", "Transaction comps", "Board materials"] }
        ]
      },
      {
        level: 7, key: "pe", title: "Private equity & LBO", blurb: "Build an LBO from sources & uses through debt paydown, exit value and sponsor returns.",
        modules: [
          { title: "Private equity fundamentals", topics: ["Investment thesis", "Entry criteria", "Value creation", "IC process", "Portfolio management"] },
          { title: "LBO mechanics", topics: ["Sources & uses", "Entry valuation", "Debt financing", "Management rollover", "Fees"] },
          { title: "LBO model", topics: ["Operating case", "Debt schedule", "Cash sweep", "Exit assumptions", "Sponsor returns"] },
          { title: "Returns analysis", topics: ["MOIC", "IRR", "Deleveraging", "Multiple expansion", "Sensitivity tables"] },
          { title: "Advanced private equity", topics: ["Add-ons", "Recapitalizations", "Dividend recap", "Management incentive plans", "Downside cases"] }
        ]
      },
      {
        level: 8, key: "research", title: "Equity research & investing", blurb: "Build an evidence-based investment view from business quality, estimates, valuation and catalysts.",
        modules: [
          { title: "Research process", topics: ["Research question", "Industry mapping", "Company diligence", "Primary vs secondary research", "Variant perception"] },
          { title: "Forecasting & estimates", topics: ["Revenue build", "Margin forecast", "Earnings estimates", "Consensus comparison", "Estimate revisions"] },
          { title: "Investment thesis", topics: ["Bull / bear case", "Catalysts", "Risks", "Moat", "Management quality"] },
          { title: "Portfolio thinking", topics: ["Position sizing", "Expected return", "Risk / reward", "Correlation", "Portfolio construction"] },
          { title: "Writing the view", topics: ["Research note", "Initiation report", "Target price", "Investment conclusion", "Post-mortem"] }
        ]
      },
      {
        level: 9, key: "markets", title: "Markets", blurb: "Understand the instruments and market forces that move prices, yields and capital.",
        modules: [
          { title: "Equity markets", topics: ["Stocks & indices", "Market capitalization", "Primary markets", "Secondary markets", "Market structure"] },
          { title: "Fixed income", topics: ["Bonds", "Yield & price", "Duration", "Convexity", "Credit spreads"] },
          { title: "FX & commodities", topics: ["Exchange rates", "Currency drivers", "Commodity cycles", "Spot vs forward", "Hedging"] },
          { title: "Derivatives", topics: ["Forwards", "Futures", "Options", "Swaps", "Payoff diagrams"] },
          { title: "Macro & markets", topics: ["Inflation", "Interest rates", "Central banks", "Business cycles", "Liquidity & risk appetite"] }
        ]
      },
      {
        level: 10, key: "advanced", title: "Advanced finance", blurb: "Specialist finance for complex situations, capital structures and real-world decision making.",
        modules: [
          { title: "Credit & distressed finance", topics: ["Credit analysis", "Debt capacity", "Covenants", "Restructuring", "Recovery analysis"] },
          { title: "Project & infrastructure finance", topics: ["Project cash flows", "Debt sizing", "DSCR", "Waterfalls", "Infrastructure valuation"] },
          { title: "Risk management", topics: ["Market risk", "Credit risk", "Liquidity risk", "Hedging", "Stress testing"] },
          { title: "Private markets", topics: ["Venture capital", "Growth equity", "Private credit", "Fund economics", "Carried interest"] },
          { title: "Finance for startup founders", topics: ["Runway & burn", "Unit economics", "Financial forecasting", "Fundraising & dilution", "Cap tables", "Term sheets", "Investor returns", "Board reporting"] },
          { title: "Advanced corporate finance", topics: ["Capital structure", "Cost of capital", "Buybacks & dividends", "M&A strategy", "Capital allocation"] }
        ]
      }
    ]
  };

  // Sanity: warn (in console only) about manifest ids with no lesson object.
  Object.keys(LS.manifest.modules).forEach(function (mc) {
    LS.manifest.modules[mc].lessons.forEach(function (id) {
      if (!LS.lessons[id]) console.warn("Manifest lists missing lesson:", id);
    });
  });
})();
