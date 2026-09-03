/* FinStudio learning graph.
   Two pieces of connective tissue the lessons could not carry on their own:

   1. prereq  — what a learner should understand BEFORE this lesson, so nobody
                hits a concept that silently assumes earlier knowledge.
   2. chains  — the sequence a concept belongs to, so every lesson can answer
                "where does this fit and what is it building towards?"

   Ids that don't appear here simply render without the blocks. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  /* ---- Named chains: the mental maps a beginner needs ---- */
  var chains = {
    profit: {
      label: "How a sale becomes profit",
      steps: ["c-revenue", "c-costs", "c-gross-profit", "c-ebitda", "c-ebit", "c-ebt", "c-taxes", "c-profit"],
    },
    cash: {
      label: "How profit becomes cash",
      steps: ["c-profit", "c-accrual-accounting", "c-working-capital", "c-change-in-working-capital", "c-capex", "c-cash"],
    },
    balance: {
      label: "What a business owns and owes",
      steps: ["c-assets", "c-liabilities", "c-equity", "c-accounting-equation", "c-retained-earnings"],
    },
    tvm: {
      label: "Why timing changes value",
      steps: ["c-interest", "c-compounding", "c-inflation", "c-time-value-of-money", "c-present-value", "c-future-value"],
    },
    returns: {
      label: "Measuring how well capital is used",
      steps: ["c-net-margin", "c-asset-turnover", "c-roa", "c-roic", "c-financial-leverage"],
    },
    risk: {
      label: "Risk, return and the price of money",
      steps: ["c-risk", "c-return", "c-risk-vs-reward", "c-debt", "c-interest-coverage", "c-net-debt-ebitda"],
    },
    statements: {
      label: "How the three statements lock together",
      steps: ["c-revenue-recognition", "c-accrual-accounting", "c-revenue-cascade-through-the-three-statements", "c-capstone"],
    },
    modelling: {
      label: "Building an integrated model",
      steps: ["c-model-architecture", "c-assumptions", "c-revenue-build", "c-cost-build",
              "c-working-capital-model", "c-capex-model", "c-debt-schedule", "c-cash-flow", "c-balance-sheet"],
    },
    valuation: {
      label: "Valuing a business",
      steps: ["c-market-capitalization", "c-net-debt", "c-enterprise-value", "c-ev-ebitda",
              "c-wacc", "c-discount-factors", "c-terminal-value", "c-enterprise-value-dcf-output",
              "c-equity-value-dcf-output", "c-share-price"],
    },
    discount: {
      label: "Where the discount rate comes from",
      steps: ["c-risk-free-rate", "c-equity-risk-premium", "c-beta", "c-capm",
              "c-cost-of-equity", "c-cost-of-debt", "c-wacc"],
    },
    deal: {
      label: "Analysing an acquisition",
      steps: ["c-comparable-companies", "c-precedent-transactions", "c-purchase-price",
              "c-sources-and-uses", "c-financing-mix", "c-synergies", "c-merger-models",
              "c-accretion-dilution"],
    },
    buyout: {
      label: "How a buyout makes money",
      steps: ["c-lbo-basics", "c-entry-valuation", "c-debt-financing", "c-operating-case",
              "c-debt-paydown", "c-exit-valuation", "c-moic", "c-irr"],
    },
    investing: {
      label: "Building an investment case",
      steps: ["c-business-analysis", "c-revenue-drivers", "c-unit-economics",
              "c-competitive-advantage", "c-earnings", "c-free-cash-flow-investment-case",
              "c-valuation", "c-investment-thesis", "c-build-interactive-investment-cases"],
    },
    scenarios: {
      label: "Weighing the outcomes",
      steps: ["c-risks", "c-bear-case", "c-base-case", "c-bull-case", "c-catalysts"],
    },
    workingcap: {
      label: "Where cash gets trapped in operations",
      steps: ["c-accounts-receivable", "c-inventory", "c-accounts-payable", "c-working-capital", "c-cash-conversion-cycle"],
    },
  };

  /* ---- Prerequisites. Foundational lessons deliberately have none. ---- */
  var prereq = {
    /* Level 0 */
    "c-personal-corporate-investing": ["c-what-is-finance"],
    "c-financial-markets": ["c-what-is-finance"],
    "c-companies-and-capital": ["c-what-is-finance"],
    "c-revenue": ["c-companies-and-capital"],
    "c-costs": ["c-revenue"],
    "c-profit": ["c-revenue", "c-costs"],
    "c-cash": ["c-profit"],
    "c-liabilities": ["c-assets"],
    "c-equity": ["c-assets", "c-liabilities"],
    "c-debt": ["c-liabilities", "c-interest"],
    "c-risk": ["c-return"],
    "c-return": ["c-what-is-finance"],
    "c-time-value-of-money": ["c-interest"],
    "c-compounding": ["c-interest"],
    "c-inflation": ["c-return"],
    "c-present-value": ["c-time-value-of-money"],
    "c-future-value": ["c-compounding"],
    "c-opportunity-cost": ["c-return"],
    "c-risk-vs-reward": ["c-risk", "c-return"],

    /* Level 1 */
    "c-accounting-equation": ["c-assets", "c-liabilities", "c-equity"],
    "c-double-entry-accounting": ["c-accounting-equation"],
    "c-debits-and-credits": ["c-double-entry-accounting"],
    "c-chart-of-accounts": ["c-double-entry-accounting"],
    "c-accrual-accounting": ["c-revenue", "c-cash"],
    "c-cash-accounting": ["c-accrual-accounting"],
    "c-revenue-recognition": ["c-accrual-accounting"],
    "c-expenses": ["c-accrual-accounting"],
    "c-accounts-receivable": ["c-accrual-accounting"],
    "c-accounts-payable": ["c-accrual-accounting"],
    "c-inventory": ["c-costs"],
    "c-prepaid-expenses": ["c-expenses"],
    "c-deferred-revenue": ["c-revenue-recognition"],
    "c-accrued-expenses": ["c-expenses"],
    "c-working-capital": ["c-accounts-receivable", "c-accounts-payable", "c-inventory"],
    "c-depreciation": ["c-assets", "c-expenses"],
    "c-amortization": ["c-depreciation"],
    "c-ppe": ["c-assets", "c-depreciation"],
    "c-goodwill": ["c-assets"],
    "c-intangible-assets": ["c-assets"],
    "c-retained-earnings": ["c-equity", "c-profit"],

    /* Level 2 */
    "c-gross-profit": ["c-revenue", "c-costs"],
    "c-ebitda": ["c-gross-profit", "c-depreciation"],
    "c-ebit": ["c-ebitda"],
    "c-ebt": ["c-ebit", "c-debt"],
    "c-taxes": ["c-ebt"],
    "c-intangibles": ["c-intangible-assets"],
    "c-other-liabilities": ["c-liabilities", "c-deferred-revenue"],
    "c-capex": ["c-ppe", "c-depreciation"],
    "c-change-in-working-capital": ["c-working-capital"],
    "c-debt-issuance": ["c-debt"],
    "c-debt-repayment": ["c-debt-issuance"],
    "c-dividends": ["c-retained-earnings"],
    "c-stock-issuance": ["c-equity"],
    "c-revenue-cascade-through-the-three-statements": ["c-accrual-accounting", "c-accounts-receivable", "c-retained-earnings"],

    /* Level 3 */
    "c-ebitda-margin": ["c-ebitda"],
    "c-ebit-margin": ["c-ebit"],
    "c-net-margin": ["c-profit", "c-taxes"],
    "c-roa": ["c-profit", "c-assets"],
    "c-roic": ["c-ebit", "c-taxes", "c-equity", "c-debt"],
    "c-asset-turnover": ["c-revenue", "c-assets"],
    "c-quick-ratio": ["c-inventory", "c-liabilities"],
    "c-net-debt-ebitda": ["c-debt", "c-ebitda"],
    "c-interest-coverage": ["c-ebit", "c-debt"],
    "c-working-capital-analysis": ["c-working-capital", "c-change-in-working-capital"],
    "c-cash-conversion-cycle": ["c-working-capital-analysis"],
    "c-operating-leverage": ["c-costs", "c-gross-profit"],
    "c-financial-leverage": ["c-debt", "c-equity", "c-roic"],

    /* Level 4 */
    "c-assumptions": ["c-model-architecture"],
    "c-historical-periods": ["c-model-architecture"],
    "c-model-formatting": ["c-model-architecture"],
    "c-model-best-practices": ["c-model-formatting"],
    "c-revenue-build": ["c-revenue", "c-assumptions"],
    "c-cost-build": ["c-costs", "c-operating-leverage"],
    "c-headcount-model": ["c-cost-build"],
    "c-working-capital-model": ["c-working-capital-analysis"],
    "c-capex-model": ["c-capex", "c-ppe"],
    "c-depreciation-schedule": ["c-depreciation", "c-capex-model"],
    "c-debt-schedule": ["c-debt", "c-debt-repayment"],
    "c-interest-schedule": ["c-debt-schedule"],
    "c-tax-schedule": ["c-taxes"],
    "c-retained-earnings-schedule": ["c-retained-earnings"],
    "c-scenario-analysis": ["c-assumptions"],
    "c-sensitivity-analysis": ["c-assumptions"],
    "c-circularity": ["c-interest-schedule"],
    "c-revenue-forecast": ["c-revenue-build"],
    "c-gross-profit-model": ["c-gross-profit", "c-revenue-forecast"],
    "c-ebitda-model": ["c-ebitda", "c-cost-build"],
    "c-ebit-model": ["c-ebit", "c-depreciation-schedule"],
    "c-net-income-model": ["c-ebit-model", "c-interest-schedule", "c-tax-schedule"],
    "c-cash-flow": ["c-net-income-model", "c-working-capital-model", "c-capex-model"],
    "c-balance-sheet": ["c-cash-flow", "c-retained-earnings-schedule"],

    /* Level 5 */
    "c-enterprise-value": ["c-market-capitalization", "c-net-debt"],
    "c-equity-value": ["c-enterprise-value"],
    "c-market-capitalization": ["c-equity"],
    "c-net-debt": ["c-debt", "c-cash"],
    "c-ev-revenue": ["c-enterprise-value", "c-revenue"],
    "c-ev-ebitda": ["c-enterprise-value", "c-ebitda"],
    "c-p-e": ["c-market-capitalization", "c-profit"],
    "c-peg": ["c-p-e"],
    "c-risk-free-rate": ["c-interest", "c-return"],
    "c-equity-risk-premium": ["c-risk-free-rate", "c-risk-vs-reward"],
    "c-beta": ["c-risk", "c-equity-risk-premium"],
    "c-capm": ["c-beta", "c-equity-risk-premium", "c-risk-free-rate"],
    "c-cost-of-equity": ["c-capm"],
    "c-cost-of-debt": ["c-debt", "c-taxes"],
    "c-wacc": ["c-cost-of-equity", "c-cost-of-debt"],
    "c-discount-factors": ["c-present-value", "c-wacc"],
    "c-terminal-value": ["c-discount-factors"],
    "c-perpetuity-growth": ["c-terminal-value"],
    "c-exit-multiple": ["c-terminal-value", "c-ev-ebitda"],
    "c-sensitivity-analysis-dcf": ["c-wacc", "c-terminal-value"],
    "c-revenue-growth": ["c-revenue-build"],
    "c-margin": ["c-ebitda-margin"],
    "c-wacc-dcf-input": ["c-wacc"],
    "c-terminal-growth": ["c-perpetuity-growth"],
    "c-enterprise-value-dcf-output": ["c-discount-factors", "c-terminal-value"],
    "c-equity-value-dcf-output": ["c-enterprise-value-dcf-output", "c-net-debt"],
    "c-share-price": ["c-equity-value-dcf-output"],

    /* Level 6 */
    "c-comparable-companies": ["c-ev-ebitda"],
    "c-precedent-transactions": ["c-comparable-companies"],
    "c-trading-multiples": ["c-ev-ebitda", "c-p-e"],
    "c-transaction-multiples": ["c-precedent-transactions"],
    "c-purchase-price": ["c-transaction-multiples", "c-equity-value"],
    "c-sources-and-uses": ["c-purchase-price"],
    "c-financing-mix": ["c-sources-and-uses", "c-cost-of-debt"],
    "c-goodwill-acquisition": ["c-purchase-price", "c-goodwill"],
    "c-synergies": ["c-purchase-price"],
    "c-merger-models": ["c-financing-mix", "c-synergies"],
    "c-accretion-dilution": ["c-merger-models", "c-stock-issuance"],
    "c-pro-forma-financials": ["c-merger-models", "c-goodwill-acquisition"],
    "c-debt-schedules": ["c-debt-schedule", "c-financing-mix"],
    "c-lbo-basics": ["c-financial-leverage", "c-ev-ebitda"],

    /* Level 7 */
    "c-entry-valuation": ["c-lbo-basics"],
    "c-debt-financing": ["c-entry-valuation", "c-debt-schedule"],
    "c-sources-and-uses-lbo": ["c-debt-financing"],
    "c-operating-case": ["c-cash-flow", "c-working-capital-model"],
    "c-debt-paydown": ["c-operating-case", "c-debt-financing"],
    "c-exit-valuation": ["c-debt-paydown"],
    "c-exit-multiple-lbo": ["c-exit-valuation"],
    "c-sponsor-equity": ["c-sources-and-uses-lbo"],
    "c-moic": ["c-sponsor-equity", "c-exit-valuation"],
    "c-irr": ["c-moic", "c-compounding"],
    "c-management-options": ["c-sponsor-equity"],
    "c-sensitivity-analysis-lbo": ["c-irr", "c-exit-multiple-lbo"],

    /* Level 8 */
    "c-business-analysis": ["c-revenue", "c-profit"],
    "c-revenue-drivers": ["c-business-analysis", "c-revenue-build"],
    "c-unit-economics": ["c-revenue-drivers", "c-costs"],
    "c-competitive-advantage": ["c-roic"],
    "c-tam-sam-som": ["c-revenue-drivers"],
    "c-management-analysis": ["c-roic", "c-dividends"],
    "c-earnings": ["c-profit", "c-taxes"],
    "c-guidance": ["c-earnings"],
    "c-free-cash-flow-investment-case": ["c-cash-flow", "c-capex"],
    "c-valuation": ["c-p-e", "c-ev-ebitda", "c-enterprise-value-dcf-output"],
    "c-investment-thesis": ["c-valuation", "c-competitive-advantage"],
    "c-catalysts": ["c-investment-thesis"],
    "c-risks": ["c-investment-thesis"],
    "c-bear-case": ["c-risks", "c-valuation"],
    "c-base-case": ["c-valuation", "c-guidance"],
    "c-bull-case": ["c-base-case"],
    "c-build-interactive-investment-cases": ["c-bear-case", "c-base-case", "c-bull-case", "c-catalysts"],

    /* Capstone */
    "c-capstone": ["c-revenue-cascade-through-the-three-statements", "c-roic", "c-cash-conversion-cycle", "c-net-debt-ebitda"],
  };

  /* Which chain a lesson belongs to (first match wins). */
  var chainOf = {};
  Object.keys(chains).forEach(function (key) {
    chains[key].steps.forEach(function (id) {
      if (!chainOf[id]) chainOf[id] = key;
    });
  });

  LS.learningGraph = {
    chains: chains,
    prereq: prereq,
    /** Prerequisite lessons that actually exist, as {id, title}. */
    prerequisitesFor: function (id) {
      var ids = prereq[id] || [];
      var out = [];
      ids.forEach(function (pid) {
        var l = LS.lessons && LS.lessons[pid];
        if (l) out.push({ id: pid, title: l.title });
      });
      return out;
    },
    /** The chain this lesson sits in, with the current step marked. */
    chainFor: function (id) {
      var key = chainOf[id];
      if (!key) return null;
      var chain = chains[key];
      var steps = [];
      chain.steps.forEach(function (sid) {
        var l = LS.lessons && LS.lessons[sid];
        if (l) steps.push({ id: sid, title: l.title, current: sid === id });
      });
      if (steps.length < 3) return null;
      return { label: chain.label, steps: steps };
    },
  };
})();
