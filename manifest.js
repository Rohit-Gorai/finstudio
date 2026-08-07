/* The lessons manifest. Adding a lesson = one object in a module file
   + one id in the right module's list below. Nothing else changes. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  LS.manifest = {
    levels: [
      {
        title: "Level 1 · Accounts & statements",
        modules: ["1000", "1100", "1200", "1300", "1400", "1500"]
      },
      {
        title: "Level 2 · Analysis & modeling",
        modules: ["1600", "2100", "2200"]
      }
    ],
    modules: {
      "1000": {
        title: "Foundations",
        blurb: "The five buckets, the accounting equation, double entry, and the map of the three statements.",
        lessons: ["1010-five-buckets", "1020-accounting-equation", "1030-two-sides", "1040-three-statements"]
      },
      "1100": {
        title: "Assets",
        blurb: "PP&E, depreciation, inventory, receivables and cash — everything the café owns, built line by line.",
        lessons: ["1110-ppe", "1120-depreciation", "1130-inventory", "1140-receivables", "1150-cash-deposit"]
      },
      "1200": {
        title: "Liabilities",
        blurb: "Supplier credit, accruals and the bank loan — what the café owes, and why interest ≠ principal.",
        lessons: ["1210-payables", "1220-borrowings", "1230-right-hand-side"]
      },
      "1300": {
        title: "Equity & the balance sheet",
        blurb: "Share capital, retained earnings, and the capstone: a full balance sheet that must tie at ₹19,50,000.",
        lessons: ["1310-share-capital", "1320-retained-earnings", "1330-balance-sheet"]
      },
      "1400": {
        title: "The income statement",
        blurb: "Revenue down to profit after tax, one line at a time — ending in a P&L whose bottom line must match the balance sheet.",
        lessons: ["1410-revenue", "1420-cogs", "1430-opex-ebitda", "1440-depreciation-pl", "1450-interest-tax", "1460-pl-capstone"]
      },
      "1500": {
        title: "The cash flow statement",
        blurb: "Why profit isn't cash, the indirect method, and a closing cash balance that must equal the balance sheet's ₹1,00,000.",
        lessons: ["1510-profit-not-cash", "1520-cfo", "1530-cfi", "1540-cff", "1550-cf-capstone"]
      },
      "1600": {
        title: "Reading statements: ratios",
        blurb: "Margins, liquidity, leverage and returns — plus side-by-side comparisons where you judge which business is healthier.",
        lessons: ["1610-margins", "1620-liquidity", "1630-leverage", "1640-returns"]
      },
      "2100": {
        title: "Linking the three statements",
        blurb: "The three bridges, a three-year linked model that ties in every year, and the classic find-the-broken-link debugging drill.",
        lessons: ["2110-three-bridges", "2120-linked-model", "2130-broken-link"]
      },
      "2200": {
        title: "Modeling & valuation",
        blurb: "Drivers, a projected P&L, free cash flow, a DCF with terminal value, and a capstone that values the café.",
        lessons: ["2210-drivers", "2220-project-pl", "2230-fcff", "2240-dcf", "2250-valuation-capstone"]
      }
    }
  };

  // sanity: warn (in console only) about manifest ids with no lesson object
  Object.keys(LS.manifest.modules).forEach(function (mc) {
    LS.manifest.modules[mc].lessons.forEach(function (id) {
      if (!LS.lessons[id]) console.warn("Manifest lists missing lesson:", id);
    });
  });
})();
