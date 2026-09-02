/* FinStudio capstone.
   One fictional company carried end to end: business → statements → ratios →
   cash → valuation → decision. Uses only concepts taught in Levels 0-3, and
   asks the learner to combine them rather than recall one at a time. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};

  function h2(t) { return { t: "h2", text: t }; }
  function h3(t) { return { t: "h3", text: t }; }
  function p(h) { return { t: "p", h: h }; }
  function list(items) { return { t: "list", items: items }; }
  function def(term, h) { return { t: "def", term: term, h: h }; }
  function note(items) {
    return { t: "note", h: "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" };
  }
  function practice(items) { return { t: "practice", items: items }; }
  function sandbox(kind, title, prompt, fields) {
    return { t: "sandbox", kind: kind, title: title, prompt: prompt, fields: fields };
  }
  function formula(title, lines) { return { t: "formula", title: title, lines: lines }; }
  function mcq(q, opts, correct, why) { return { t: "mcq", q: q, opts: opts, correct: correct, why: why }; }
  function figures(title, intro, rows, meaning) {
    var html = '<p class="case-title"><strong>' + title + "</strong></p>";
    intro.forEach(function (x) { html += "<p>" + x + "</p>"; });
    html += '<div class="case-figures">';
    rows.forEach(function (r) {
      html += '<div class="case-row"><span class="case-label">' + r[0] +
        '</span><span class="case-value">' + r[1] + "</span></div>";
    });
    html += "</div>";
    if (meaning && meaning.length) {
      html += '<p class="case-meaning"><strong>What it means.</strong></p>';
      meaning.forEach(function (x) { html += "<p>" + x + "</p>"; });
    }
    return { t: "example", h: html };
  }
  var W = "Not quite — work back through the step above.";

  LS.lessons["c-capstone"] = {
    id: "c-capstone",
    title: "Capstone: value a company end to end",
    short: "Capstone",
    minutes: 25,
    desc: "Take one company from its business model through statements, ratios, cash and valuation to an investment decision.",
    lede: "Everything you have learned so far, applied to one company in one sitting — and ending with the question that actually matters.",
    body: [
      h2("What is this?"),
      p("This is not a new concept. It is the whole of Levels 0 to 3 used at once on a single company, in the order an analyst would actually work: understand the business, read the statements, compute the ratios, follow the cash, value it, and then decide."),
      p("Work through it with a pen. Each step's answer feeds the next, so skipping ahead will not work — which is the point."),

      h2("Why does it matter?"),
      p("Individually, EBITDA, working capital days and ROIC are just definitions. Their value appears only when they are used together to form a judgement about one real business."),
      p("By the end you should be able to answer, in your own words, the question every investor eventually faces: is this a good company, and is it a good investment at this price? Those are two different questions, and confusing them is the most expensive mistake a beginner makes."),

      h2("How does it work?"),
      h3("Meet the company"),
      p("<strong>Bharat Kitchen Appliances</strong> makes mixers and pressure cookers, sells through 4,000 dealers across India, and has been growing steadily. It owns two factories and carries a moderate amount of debt."),
      figures("Step 1 — The income statement (FY25)",
        ["Start where every analysis starts: what did the business sell, and what did it keep?"],
        [["Revenue", "₹800 crore"], ["Cost of goods sold", "₹480 crore"], ["Gross profit", "₹320 crore"],
         ["Operating expenses (excl. D&A)", "₹184 crore"], ["EBITDA", "₹136 crore"], ["Depreciation & amortisation", "₹36 crore"],
         ["EBIT", "₹100 crore"], ["Interest", "₹28 crore"], ["Profit before tax", "₹72 crore"],
         ["Tax at 25%", "₹18 crore"], ["Net profit", "₹54 crore"]],
        ["Gross margin 40%, EBITDA margin 17%, EBIT margin 12.5%, net margin 6.75%.",
         "The gap between the EBITDA and EBIT margins — 4.5 points, or ₹36 crore — tells you this business owns real machinery that wears out. Remember that when the valuation multiple appears later."]),

      h3("Step 2 — The balance sheet"),
      figures("Step 2 — What it owns and owes",
        ["The income statement told you about a year. The balance sheet tells you about a moment."],
        [["Cash", "₹40 crore"], ["Receivables", "₹160 crore"], ["Inventory", "₹200 crore"],
         ["Net fixed assets (PP&E)", "₹300 crore"], ["Total assets", "₹700 crore"],
         ["Payables", "₹120 crore"], ["Debt", "₹280 crore"], ["Total liabilities", "₹400 crore"],
         ["Equity (assets − liabilities)", "₹300 crore"]],
        ["Equity is the residual: ₹700 crore of assets less ₹400 crore of claims leaves ₹300 crore for the owners.",
         "Note how much is tied up in receivables and inventory — ₹360 crore against ₹800 crore of revenue. That is where this company's cash lives, and Step 4 will show what it costs."]),

      h3("Step 3 — The ratios"),
      p("Now convert the raw figures into comparable measures. Each one you have already met."),
      list([
        "<strong>Net debt / EBITDA</strong> = (280 − 40) ÷ 136 = <strong>1.8x</strong> — moderate leverage, comfortably financeable.",
        "<strong>Interest coverage</strong> = EBIT ÷ interest = 100 ÷ 28 = <strong>3.6x</strong> — operating profit could fall about 72% before interest was uncovered.",
        "<strong>ROIC</strong> = EBIT × (1 − 25%) ÷ (debt + equity − cash) = 75 ÷ 540 = <strong>13.9%</strong>.",
        "<strong>Asset turnover</strong> = 800 ÷ 700 = <strong>1.14x</strong>; <strong>ROA</strong> = 54 ÷ 700 = <strong>7.7%</strong>.",
        "<strong>Quick ratio</strong> = (40 + 160) ÷ 120 = <strong>1.67</strong> — near-term obligations are covered without selling stock.",
      ]),
      p("Read together: a decently profitable, moderately geared business earning about 14% on the capital invested in it. Whether that is good depends entirely on what that capital costs — which is Step 5."),

      h3("Step 4 — Follow the cash"),
      figures("Step 4 — From profit to free cash flow",
        ["Profit is an opinion; cash is a fact. Revenue grew 15% this year, and growth consumes working capital."],
        [["Net profit", "₹54 crore"], ["Add back: depreciation", "₹36 crore"],
         ["Less: increase in working capital", "−₹47 crore"], ["Cash flow from operations", "₹43 crore"],
         ["Less: capital expenditure", "−₹40 crore"], ["Free cash flow", "₹3 crore"],
         ["Days inventory", "152 days"], ["Days receivable", "73 days"], ["Days payable", "91 days"],
         ["Cash conversion cycle", "134 days"]],
        ["This is the single most important step in the whole case. The company reported ₹54 crore of profit and produced ₹3 crore of free cash.",
         "Nothing is wrong or fraudulent. A 134-day cash cycle means every rupee of growth locks up cash for over four months, and capex of ₹40 crore against ₹36 crore of depreciation means it is barely expanding capacity. Growth here is being funded, not self-financing."]),

      h3("Step 5 — Value it"),
      p("Two approaches, both of which you have the pieces for."),
      formula("Enterprise value and equity value", [
        "<b>Enterprise value = EBITDA × multiple</b>",
        "<b>Equity value = Enterprise value − Net debt</b>",
        "<b>Value per share = Equity value ÷ Shares outstanding</b>",
        "Net debt = debt − cash = 280 − 40 = ₹240 crore",
      ]),
      figures("Step 5 — What the business is worth",
        ["Comparable appliance makers trade at about 9× EBITDA. The company has 12 crore shares outstanding, and the market price today is ₹75."],
        [["EBITDA", "₹136 crore"], ["Multiple", "9.0x"], ["Enterprise value", "₹1,224 crore"],
         ["Less: net debt", "−₹240 crore"], ["Equity value", "₹984 crore"], ["Shares outstanding", "12 crore"],
         ["Value per share", "₹82"], ["Market price", "₹75"], ["Market capitalisation", "₹900 crore"]],
        ["On this multiple the shares look about 9% cheap — ₹82 of value against a ₹75 price.",
         "But notice what the EBITDA multiple quietly assumes: that ₹136 crore of EBITDA is worth paying for. Free cash flow was ₹3 crore. A buyer paying ₹1,224 crore for the enterprise is paying 9× a number the company cannot currently convert into cash."]),

      h2("Key terms"),
      def("Enterprise value", "What the whole operating business is worth, independent of how it is financed. EBITDA × multiple, or market cap + net debt − cash."),
      def("Equity value", "What the shareholders' portion is worth: enterprise value less net debt."),
      def("Free cash flow", "Operating cash flow less capital expenditure — the cash genuinely available to lenders and owners."),
      def("Margin of safety", "The gap between your estimate of value and the price you pay, which absorbs the errors in your estimate."),

      h2("Practice"),
      practice([
        { q: "Recompute value per share if the appropriate multiple is 7× rather than 9×, and say what price you would then need.", a: "EV = 136 × 7 = ₹952 crore. Equity value = 952 − 240 = ₹712 crore. Per share = 712 ÷ 12 = ₹59. At ₹75 the shares would be roughly 21% expensive. A two-turn change in the multiple moves the answer from cheap to expensive — which tells you the multiple assumption is doing most of the work in this valuation." },
        { q: "Management proposes reducing days inventory from 152 to 110 while holding sales flat. Estimate the cash released, and its effect on free cash flow.", a: "Daily COGS = 480 ÷ 365 ≈ ₹1.32 crore. 42 fewer days × 1.32 = roughly ₹55 crore released, once. Free cash flow in that year would jump from ₹3 crore to about ₹58 crore. Note the word once: it is a one-off unlocking of trapped cash, not a permanent improvement in earnings power." },
        { q: "The company's ROIC is 13.9%. Its lenders charge 10% and its shareholders require about 14%, giving a blended cost of capital near 12%. Should it grow, and what would change your answer?", a: "Yes, but only narrowly. ROIC of 13.9% against a 12% cost of capital is a spread of under 2 points, so each rupee reinvested creates about 2 paise of value a year. That is thin: a modest fall in margins or a rise in interest rates erases it. If ROIC dropped below 12%, growth would start destroying value and the company should return capital instead." },
        { q: "Final question. Would you invest at ₹75 a share? Write your reasoning in full — there is no single right answer, but there is a right method.", a: "A defensible answer covers four things. (1) Value: ₹82 at a 9× multiple, so a ~9% discount — thin, and entirely dependent on the multiple being right. (2) Quality: ROIC 13.9% barely clears the ~12% cost of capital, so growth adds little value. (3) Cash: free cash flow of ₹3 crore against ₹54 crore of profit is the real concern; a 134-day cash cycle means growth consumes cash and the company depends on continued funding. (4) Risk: leverage at 1.8x and coverage at 3.6x are manageable but not comfortable if earnings fall. A reasonable conclusion: this is an adequate business at a fair-to-slightly-cheap price, with no margin of safety for the working capital risk — so either wait for a lower price, or for evidence the cash cycle is shortening. Concluding the opposite is fine if your reasoning addresses the same four points." },
      ]),

      h2("Sandbox"),
      sandbox("profit-bridge", "Rebuild the income statement",
        "These are the company's actual figures. Cut revenue 10% while holding costs fixed — operating leverage will take far more than 10% off the profit.", [
        { key: "revenue", label: "Revenue", value: 8000000000, unit: "₹" },
        { key: "cogs", label: "Cost of goods sold", value: 4800000000, unit: "₹" },
        { key: "opex", label: "Operating costs incl. D&A", value: 2200000000, unit: "₹" },
        { key: "interest", label: "Interest", value: 280000000, unit: "₹" },
        { key: "taxRate", label: "Tax rate", value: 25, unit: "%" },
      ]),

      h2("What to remember"),
      note([
        "Work in order: business → statements → ratios → cash → valuation → decision.",
        "Profit and free cash flow can differ enormously; the cash cycle usually explains why.",
        "Growth creates value only when ROIC exceeds the cost of capital.",
        "A good company and a good investment are different questions — price decides the second.",
        "Every valuation rests on an assumption. Find the one doing the most work, and test it.",
      ]),

      h2("Common mistakes"),
      list([
        "<strong>Stopping at net profit.</strong> ₹54 crore of profit produced ₹3 crore of free cash here; only one of those pays you.",
        "<strong>Treating the multiple as a fact.</strong> Moving from 9× to 7× changed the conclusion completely.",
        "<strong>Confusing enterprise value with market capitalisation.</strong> The ₹240 crore of net debt is the difference.",
        "<strong>Assuming growth is good.</strong> With a spread of under 2 points, growth here creates very little.",
        "<strong>Deciding without a margin of safety.</strong> A 9% discount does not cover the error in your own estimate.",
      ]),

      mcq("The company reports ₹54 crore of net profit but only ₹3 crore of free cash flow. The main reason is:",
        ["The profit figure is wrong",
         "Working capital absorbed ₹47 crore and capex took ₹40 crore",
         "It paid too much tax",
         "Depreciation was too low"], 1,
        [W, "Correct. Growth locked ₹47 crore into receivables and inventory, and ₹40 crore went into capital spending. Both are real cash, and neither reduces reported profit by that amount.", W, W]),

      mcq("Enterprise value is ₹1,224 crore and net debt is ₹240 crore. Equity value is:",
        ["₹1,464 crore", "₹984 crore", "₹1,224 crore", "₹240 crore"], 1,
        [W, "Correct. Equity value = enterprise value − net debt = 1,224 − 240 = ₹984 crore, or ₹82 per share across 12 crore shares.", W, W]),

      mcq("ROIC is 13.9% and the cost of capital is about 12%. This means growth:",
        ["Destroys value", "Creates value, but only a little", "Is irrelevant to value", "Doubles the share price"], 1,
        [W, "Correct. The spread is under 2 points, so each rupee reinvested adds roughly 2 paise of value a year — positive, but thin enough that a small deterioration would erase it.", W, W]),

      mcq("Which single change would most improve this company's free cash flow next year?",
        ["Raising the EBITDA multiple used to value it",
         "Shortening the 134-day cash conversion cycle",
         "Issuing more shares",
         "Reporting higher net profit"], 1,
        [W, "Correct. The cash is trapped in inventory and receivables. Releasing it converts reported profit into actual cash — the valuation multiple is an outsider's opinion and changes nothing inside the business.", W, W]),
    ],
  };
})();
