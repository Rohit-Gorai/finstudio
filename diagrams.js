/* Diagrams for the concepts that are structural rather than numerical.
   Plain inline SVG using the existing CSS custom properties, so they inherit
   the site's palette and need no images, libraries or build step. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  var S = 'font-family="var(--font-sans)"';
  function box(x, y, w, h, label, sub, fill) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="6" fill="' + (fill || "var(--paper-2)") + '" stroke="var(--line)"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + (sub ? 22 : h / 2 + 5)) + '" ' + S +
      ' font-size="13" font-weight="600" fill="var(--ink)" text-anchor="middle">' + label + "</text>" +
      (sub ? '<text x="' + (x + w / 2) + '" y="' + (y + 40) + '" ' + S +
        ' font-size="11" fill="var(--ink-faint)" text-anchor="middle">' + sub + "</text>" : "");
  }
  function arrow(x1, y1, x2, y2, label) {
    var mid = '<text x="' + ((x1 + x2) / 2) + '" y="' + ((y1 + y2) / 2 - 6) + '" ' + S +
      ' font-size="11" fill="var(--ink-faint)" text-anchor="middle">' + (label || "") + "</text>";
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#fs-arrow)"/>' + (label ? mid : "");
  }
  function svg(viewBox, inner, title) {
    return '<svg viewBox="' + viewBox + '" role="img" aria-label="' + title +
      '" style="width:100%;height:auto"><defs><marker id="fs-arrow" viewBox="0 0 10 10" refX="9" refY="5" ' +
      'markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-faint)"/>' +
      "</marker></defs>" + inner + "</svg>";
  }

  var diagrams = {
    /* How the three statements lock together. */
    "c-revenue-cascade-through-the-three-statements": {
      caption: "One sale, three statements: revenue is earned, a receivable is created, and cash arrives later.",
      svg: svg("0 0 640 210",
        box(20, 20, 170, 56, "Income statement", "Revenue when delivered") +
        box(235, 20, 170, 56, "Balance sheet", "Receivable created") +
        box(450, 20, 170, 56, "Cash flow", "Cash when collected") +
        arrow(190, 48, 233, 48) + arrow(405, 48, 448, 48) +
        box(235, 130, 170, 56, "Retained earnings", "Net profit lands in equity") +
        arrow(105, 78, 235, 128, "profit") +
        arrow(535, 78, 405, 128, "cash tie"),
        "Flow between the income statement, balance sheet and cash flow statement"),
    },

    /* Where cash gets trapped in operations. */
    "c-cash-conversion-cycle": {
      caption: "Cash leaves when you pay suppliers and returns when customers pay. The gap is the cycle.",
      svg: svg("0 0 640 170",
        box(20, 30, 140, 52, "Pay supplier", "day 0") +
        box(190, 30, 140, 52, "Hold stock", "days inventory") +
        box(360, 30, 140, 52, "Sell on credit", "days receivable") +
        box(20, 105, 480, 40, "Supplier credit funds part of it (days payable)", "", "var(--green-soft)") +
        arrow(160, 56, 188, 56) + arrow(330, 56, 358, 56) +
        arrow(500, 56, 560, 56, "cash back"),
        "The cash conversion cycle from paying suppliers to collecting from customers"),
    },

    /* What a DCF actually adds up. */
    "c-enterprise-value-dcf-output": {
      caption: "A DCF is the discounted forecast years plus the discounted terminal value — nothing more.",
      svg: svg("0 0 640 200",
        box(20, 20, 110, 50, "FCF yr 1-5", "forecast") +
        box(20, 100, 110, 50, "Terminal value", "years 6+") +
        box(200, 20, 130, 50, "÷ (1+WACC)^t", "discount") +
        box(200, 100, 130, 50, "× yr-5 factor", "discount") +
        arrow(130, 45, 198, 45) + arrow(130, 125, 198, 125) +
        box(400, 60, 110, 50, "Enterprise value", "") +
        arrow(330, 45, 398, 78) + arrow(330, 125, 398, 92) +
        box(400, 140, 220, 44, "− net debt = equity value ÷ shares", "", "var(--green-soft)") +
        arrow(455, 110, 455, 138),
        "How a discounted cash flow valuation is assembled"),
    },

    /* Why profit is not cash. */
    "c-cash": {
      caption: "Profit becomes cash only after the balance sheet takes its share.",
      svg: svg("0 0 640 150",
        box(20, 45, 120, 50, "Net profit", "") +
        box(180, 45, 130, 50, "− working capital", "stock, unpaid bills") +
        box(350, 45, 110, 50, "− capex", "assets bought") +
        box(500, 45, 120, 50, "Free cash flow", "", "var(--green-soft)") +
        arrow(140, 70, 178, 70) + arrow(310, 70, 348, 70) + arrow(460, 70, 498, 70),
        "The bridge from reported profit to free cash flow"),
    },

    /* Where the discount rate comes from. */
    "c-wacc": {
      caption: "WACC blends what lenders and shareholders each require, weighted by how much they funded.",
      svg: svg("0 0 640 180",
        box(20, 20, 150, 50, "Risk-free rate", "government bond") +
        box(20, 95, 150, 50, "Beta × ERP", "equity risk") +
        box(220, 55, 140, 50, "Cost of equity", "CAPM") +
        arrow(170, 45, 218, 70) + arrow(170, 120, 218, 90) +
        box(220, 130, 140, 40, "Cost of debt × (1−t)", "") +
        box(430, 80, 130, 50, "WACC", "weighted blend", "var(--green-soft)") +
        arrow(360, 80, 428, 100) + arrow(360, 150, 428, 120),
        "How the weighted average cost of capital is built"),
    },
  };

  LS.diagrams = {
    /** Returns {svg, caption} for a lesson, or null. */
    forLesson: function (id) { return diagrams[id] || null; },
  };
})();
