/* Module 1600 — Reading statements: ratios */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr, P = LS.fmt.pct, X = LS.fmt.x;
  var p = C.fy25.pl, p24 = C.fy24.pl, bs = C.fy25.bs, r = C.ratios;

  LS.lessons["1610-margins"] = {
    id: "1610-margins", code: "1610", minutes: 5,
    title: "Margin ratios",
    short: "Margins",
    desc: "Gross, EBITDA and PAT margins — the profit funnel as percentages, and how to compare two businesses of different sizes.",
    lede: "Ratios exist for one reason: to make different-sized businesses comparable. A café earning ₹1,80,000 and a chain earning ₹18 crore can't be compared in rupees — but their margins can be compared directly.",
    body: [
      { t: "def", term: "Margin", h: "Any profit line divided by revenue. It answers \"out of every ₹100 a customer spends, how much is left at this point?\" — so margins can be read straight down the income statement as a funnel." },
      { t: "formula", title: "The three margins", lines: [
        "Gross margin  = Gross profit ÷ Revenue    → product economics",
        "EBITDA margin = EBITDA ÷ Revenue          → operating efficiency",
        "PAT margin    = Profit after tax ÷ Revenue → what the owner keeps"
      ], note: "Always compare like with like: gross margin to gross margin, and within the same industry. A supermarket living on 3% net margin can be far healthier than a boutique on 20%." },
      { t: "example", h: "<p>The café's funnel for FY25: " + P(r.gmPct) + " gross → " + P(r.ebitdaPct) + " EBITDA → " + P(r.patPct) + " PAT. Of every ₹100 spent at the counter, ₹65 survives the beans, ₹22.50 survives the rent and salaries, and ₹7.50 reaches Priya. The gap between the first two numbers is the cost of simply being open.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The café's margin funnel, FY24 vs FY25",
          hint: "Build the FY24 column of margins (C2:C4 style — each profit line ÷ revenue), then use 'Copy formula right →' to fill FY25. Cells are already formatted as percentages, so just divide.",
          grid: [
            ["", { v: "FY24", year: true }, { v: "FY25", year: true }],
            ["Revenue", p24.revenue, p.revenue],
            ["Gross profit", p24.grossProfit, p.grossProfit],
            ["EBITDA", p24.ebitda, p.ebitda],
            ["Profit after tax", p24.pat, p.pat],
            [null, null, null],
            ["Gross margin", { input: true, mf: true, fmt: "pct", ph: "=B3/B2" }, { input: true, mf: true, fmt: "pct" }],
            ["EBITDA margin", { input: true, mf: true, fmt: "pct" }, { input: true, mf: true, fmt: "pct" }],
            ["PAT margin", { input: true, mf: true, fmt: "pct" }, { input: true, mf: true, fmt: "pct" }]
          ],
          checks: [
            { cell: "B7", expect: 0.65, message: "B7: FY24 gross margin", mustFormula: true, tol: 0.002 },
            { cell: "C7", expect: 0.65, message: "C7: FY25 gross margin", mustFormula: true, tol: 0.002 },
            { cell: "B8", expect: 0.21, message: "B8: FY24 EBITDA margin", mustFormula: true, tol: 0.002 },
            { cell: "C8", expect: 0.225, message: "C8: FY25 EBITDA margin", mustFormula: true, tol: 0.002 },
            { cell: "B9", expect: 0.06, message: "B9: FY24 PAT margin", mustFormula: true, tol: 0.002 },
            { cell: "C9", expect: 0.075, message: "C9: FY25 PAT margin", mustFormula: true, tol: 0.002 }
          ],
          success: "Gross margin held at 65%, but EBITDA margin rose from 21% to 22.5% and PAT margin from 6% to 7.5%. Revenue grew 20% while rent stayed flat — that's operating leverage, and it's where most margin improvement comes from."
        }
      },
      {
        t: "compare",
        left: {
          title: "Café A — \"Brew Lane\"",
          rows: [["Revenue", "₹40,00,000"], ["Gross profit", "₹22,00,000"], ["EBITDA", "₹4,00,000"], ["Profit after tax", "₹1,20,000"], ["Gross margin", "55%"], ["EBITDA margin", "10%", "total"]]
        },
        right: {
          title: "Café B — \"Third Wave\"",
          rows: [["Revenue", "₹20,00,000"], ["Gross profit", "₹13,00,000"], ["EBITDA", "₹4,40,000"], ["Profit after tax", "₹2,40,000"], ["Gross margin", "65%"], ["EBITDA margin", "22%", "total"]]
        }
      },
      { t: "where", h: "Margins are computed entirely from the <strong>income statement</strong> — no other statement needed. They're the first thing any reader calculates, and the reason the P&L is presented as a funnel of subtotals rather than one big list of costs." },
      { t: "mcq", tag: "Which is healthier?", q: "Brew Lane sells twice as much coffee as Third Wave. Which business would you rather own, and why?", opts: ["Brew Lane — twice the revenue", "Third Wave — better margins at every level and more actual profit", "Brew Lane — bigger businesses are safer", "You can't compare cafés of different sizes"], correct: 1, why: ["Revenue is the least informative line on the statement. Brew Lane is bigger and yet keeps less money.", "Third Wave converts revenue to profit far better: 65% vs 55% gross (better pricing or cheaper inputs), 22% vs 10% EBITDA (much tighter overheads), and it earns ₹2,40,000 against Brew Lane's ₹1,20,000 on half the sales. Brew Lane's real problem is visible in the gap between its gross and EBITDA margins — 45 points of revenue disappearing into overheads, against Third Wave's 43… on twice the base.", "Size gives some resilience, but Brew Lane's thin 10% EBITDA margin means a small cost shock wipes out its profit entirely.", "Comparing different sizes is exactly what ratios are for — that's the whole point of this module."] }
    ]
  };

  LS.lessons["1620-liquidity"] = {
    id: "1620-liquidity", code: "1620", minutes: 5,
    title: "Liquidity: current & quick ratios",
    short: "Liquidity",
    desc: "Can the business pay its bills over the next twelve months? The current ratio, the quick ratio, and why the difference matters.",
    lede: "Profit is about the year. Liquidity is about next Friday. These two ratios ask a blunt question: if the bills came due, could the business pay them?",
    body: [
      { t: "def", term: "Current ratio", h: "Current assets ÷ current liabilities. How many rupees of near-term assets stand behind each rupee of near-term debt. Below 1 means near-term obligations exceed near-term resources." },
      { t: "def", term: "Quick ratio (acid test)", h: "The same, but <strong>excluding inventory</strong> — because stock has to be sold before it becomes cash, and in a bad month it may not sell at all. The harsher, more honest test." },
      { t: "formula", title: "Two tests of survival", lines: [
        "Current ratio = Current assets ÷ Current liabilities",
        "Quick ratio   = (Current assets − Inventory) ÷ Current liabilities",
        "Café: " + R(r.currentAssets) + " ÷ " + R(r.currentLiabs) + " = <b>" + X(3) + "</b>; quick = <b>" + X(2) + "</b>"
      ], note: "Higher isn't automatically better. A current ratio of 5 can mean cash sitting idle or customers who never pay. For most businesses 1.5–3 is comfortable; the right level depends heavily on the industry." },
      { t: "example", h: "<p>At 31 March 2025 the café holds " + R(r.currentAssets) + " of current assets (inventory " + R(bs.inventory) + ", receivables " + R(bs.receivables) + ", cash " + R(bs.cash) + " — the total you built in the “Cash & classification” lesson) against " + R(r.currentLiabs) + " of current liabilities (payables " + R(bs.payables) + " and salaries " + R(bs.accrued) + ").</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The café's liquidity, 31 March 2025",
          hint: "Total the current assets (B5) and current liabilities (B8) with SUM, then build both ratios. The ratio cells display as multiples (3x).",
          grid: [
            ["", { v: "31 Mar 2025", year: true }],
            ["Inventory", bs.inventory],
            ["Trade receivables", bs.receivables],
            ["Cash", bs.cash],
            ["Total current assets", { input: true, mf: true, fmt: "inr", ph: "=SUM(B2:B4)" }],
            ["Trade payables", bs.payables],
            ["Salaries payable", bs.accrued],
            ["Total current liabilities", { input: true, mf: true, fmt: "inr", ph: "=SUM(B6:B7)" }],
            [null, null],
            ["Current ratio", { input: true, mf: true, fmt: "x", ph: "=B5/B8" }],
            ["Quick ratio", { input: true, mf: true, fmt: "x", ph: "=(B5-B2)/B8" }]
          ],
          checks: [
            { cell: "B5", expect: 450000, message: "B5: total current assets via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B8", expect: 150000, message: "B8: total current liabilities via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B10", expect: 3, message: "B10: current ratio", mustFormula: true, tol: 0.01 },
            { cell: "B11", expect: 2, message: "B11: quick ratio — exclude inventory", mustFormula: true, tol: 0.01 }
          ],
          success: "Current ratio " + X(3) + ", quick ratio " + X(2) + ". Even ignoring every bean in the storeroom, the café has ₹2 of quick assets for every ₹1 due. It can comfortably pay its bills."
        }
      },
      {
        t: "compare",
        left: {
          title: "Café A — \"Brew Lane\"",
          rows: [["Inventory", "₹6,00,000"], ["Receivables", "₹1,00,000"], ["Cash", "₹50,000"], ["Current liabilities", "₹5,00,000"], ["Current ratio", "1.5x"], ["Quick ratio", "0.3x", "total"]]
        },
        right: {
          title: "Café B — \"Third Wave\"",
          rows: [["Inventory", "₹1,00,000"], ["Receivables", "₹2,00,000"], ["Cash", "₹3,00,000"], ["Current liabilities", "₹4,00,000"], ["Current ratio", "1.5x"], ["Quick ratio", "1.25x", "total"]]
        }
      },
      { t: "where", h: "Both ratios come entirely from the current sections of the <strong>balance sheet</strong> — which is exactly why that statement bothers to split current from non-current (see “Cash & classification”). The split exists to make this calculation possible." },
      { t: "mcq", tag: "Which is healthier?", q: "Both cafés show a current ratio of exactly 1.5x. Which one would you lend to?", opts: ["Brew Lane — it has more current assets in total", "Third Wave — its liquidity doesn't depend on selling stock", "Neither — 1.5x is too low", "They're equally safe; the ratio says so"], correct: 1, why: ["Brew Lane's assets are larger but the wrong kind: ₹6,00,000 of it is beans and pastry. If sales slow, that stock doesn't convert — and unlike Third Wave, Brew Lane has only ₹50,000 of cash to bridge the gap.", "Identical current ratios, completely different risk. Third Wave's quick ratio of 1.25x means it could settle every current liability without selling a single bean. Brew Lane's 0.3x means it's utterly dependent on moving inventory. This is exactly the blind spot the quick ratio was invented to expose — never read the current ratio alone.", "1.5x is a perfectly normal level for many businesses; the composition is what separates these two.", "The ratio is identical, which is precisely why one ratio is never enough."] }
    ]
  };

  LS.lessons["1630-leverage"] = {
    id: "1630-leverage", code: "1630", minutes: 5,
    title: "Leverage: D/E and interest coverage",
    short: "Leverage",
    desc: "How much debt is too much? Debt-to-equity measures the stock of debt; interest coverage measures the ability to service it.",
    lede: "Debt magnifies both good and bad outcomes. Two ratios tell you how much a business has taken on, and — more importantly — whether it can comfortably keep paying for it.",
    body: [
      { t: "def", term: "Debt-to-equity (D/E)", h: "Borrowings ÷ equity. How many rupees the lenders have put in for every rupee the owner has. A <strong>stock</strong> measure — a snapshot of the balance sheet." },
      { t: "def", term: "Interest coverage", h: "EBIT ÷ interest expense. How many times over the year's operating profit could pay the year's interest. A <strong>flow</strong> measure — and usually the one lenders check first, because businesses default on payments, not on ratios." },
      { t: "formula", title: "Stock and flow", lines: [
        "Debt-to-equity     = Borrowings ÷ Equity",
        "Interest coverage  = EBIT ÷ Interest expense",
        "Café: " + R(bs.loan) + " ÷ " + R(r.equity) + " = <b>" + X(r.de) + "</b>;  " + R(p.ebit) + " ÷ " + R(p.interest) + " = <b>" + X(r.intCover) + "</b>"
      ], note: "Rules of thumb: coverage below about 2x is uncomfortable, below 1x means operating profit can't even pay the interest. Acceptable D/E varies enormously — a utility with predictable cash flows carries debt a café never could." },
      { t: "example", h: "<p>The café owes the bank " + R(bs.loan) + " against Priya's equity of " + R(r.equity) + " (share capital " + R(bs.capital) + " + retained earnings " + R(bs.retained) + "). Its EBIT of " + R(p.ebit) + " covers its " + R(p.interest) + " interest bill " + X(r.intCover) + " over.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The café's leverage, FY25",
          hint: "Total equity in B4, then both ratios. Remember equity = share capital + retained earnings, not just the capital.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Share capital", bs.capital],
            ["Retained earnings", bs.retained],
            ["Total equity", { input: true, mf: true, fmt: "inr", ph: "=SUM(B2:B3)" }],
            ["Term loan (debt)", bs.loan],
            [null, null],
            ["EBIT", p.ebit],
            ["Interest expense", p.interest],
            [null, null],
            ["Debt-to-equity", { input: true, mf: true, fmt: "x", ph: "=B5/B4" }],
            ["Interest coverage", { input: true, mf: true, fmt: "x", ph: "=B7/B8" }]
          ],
          checks: [
            { cell: "B4", expect: 1250000, message: "B4: total equity via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B10", expect: 0.44, message: "B10: debt-to-equity", mustFormula: true, tol: 0.01 },
            { cell: "B11", expect: 5, message: "B11: interest coverage", mustFormula: true, tol: 0.01 }
          ],
          success: "D/E of " + X(r.de) + " and coverage of " + X(r.intCover) + ". Priya has more skin in the game than the bank, and operating profit covers interest five times over — a conservatively financed café."
        }
      },
      {
        t: "compare",
        left: {
          title: "Café A — \"Brew Lane\"",
          rows: [["Debt", "₹20,00,000"], ["Equity", "₹10,00,000"], ["EBIT", "₹4,00,000"], ["Interest", "₹2,00,000"], ["Debt-to-equity", "2.0x"], ["Interest coverage", "2.0x", "total"]]
        },
        right: {
          title: "Café B — \"Third Wave\"",
          rows: [["Debt", "₹12,00,000"], ["Equity", "₹10,00,000"], ["EBIT", "₹1,50,000"], ["Interest", "₹1,20,000"], ["Debt-to-equity", "1.2x"], ["Interest coverage", "1.25x", "total"]]
        }
      },
      { t: "where", h: "Debt-to-equity reads two lines off the <strong>balance sheet</strong>; interest coverage reads two off the <strong>income statement</strong>. Needing both statements to judge one thing — how safe the borrowing is — is why analysts never read a statement in isolation." },
      { t: "mcq", tag: "Which is healthier?", q: "Brew Lane carries far more debt (2.0x vs 1.2x). Which café is in more immediate danger?", opts: ["Brew Lane — it has the higher D/E", "Third Wave — its earnings barely cover its interest", "Both are equally safe", "Neither — debt is always fine if the business is profitable"], correct: 1, why: ["D/E is a snapshot of the balance sheet, and Brew Lane's is worse. But nobody defaults because of a balance sheet ratio — they default when they can't make a payment.", "Third Wave's EBIT of ₹1,50,000 barely exceeds its ₹1,20,000 interest bill: a 25% cushion. A modest bad quarter and it can't pay the bank. Brew Lane has twice the debt but earns 2x its interest — more borrowed, far better able to service it. Coverage (a flow) predicts distress sooner than D/E (a stock), which is why lenders write coverage covenants into loan agreements.", "Their coverage differs materially — 2.0x vs 1.25x is the difference between uncomfortable and precarious.", "Both are profitable at the EBIT level, and one of them is still one bad quarter from missing a payment."] }
    ]
  };

  LS.lessons["1640-returns"] = {
    id: "1640-returns", code: "1640", minutes: 6,
    title: "Returns: ROE, ROCE and DuPont",
    short: "Returns & DuPont",
    desc: "Is the money invested earning enough? ROE, ROCE, and the DuPont decomposition that explains where a return comes from.",
    lede: "The final question an investor asks: for every rupee put in, how much comes back each year? And then the better question — <em>why</em> is the return what it is? DuPont answers that by splitting return into three levers.",
    body: [
      { t: "def", term: "Return on equity (ROE)", h: "PAT ÷ equity. The return earned on the <strong>owner's</strong> money, after the lenders and the taxman have been paid. The headline number for a shareholder." },
      { t: "def", term: "Return on capital employed (ROCE)", h: "EBIT ÷ capital employed (equity + debt). The return on <strong>all</strong> long-term money in the business, regardless of source. Uses EBIT — before interest — because it measures the assets, not the financing." },
      { t: "formula", title: "Two returns, one business", lines: [
        "ROE  = Profit after tax ÷ Equity              → " + R(p.pat) + " ÷ " + R(r.equity) + " = <b>" + P(r.roe) + "</b>",
        "ROCE = EBIT ÷ (Equity + Debt)                 → " + R(p.ebit) + " ÷ " + R(r.capEmployed) + " = <b>" + P(r.roce) + "</b>"
      ], note: "If ROCE comfortably exceeds the interest rate on debt, borrowing more lifts ROE — the business earns more on borrowed money than it pays for it. The café earns " + P(r.roce) + " on capital and pays 10%, so its modest debt is working in Priya's favour." },
      { t: "def", term: "The DuPont decomposition", h: "ROE splits into three levers: how much profit per sale (<strong>margin</strong>), how much sales per rupee of assets (<strong>turnover</strong>), and how much of those assets are funded by others (<strong>leverage</strong>). Two businesses can reach the same ROE by completely different routes." },
      { t: "formula", title: "DuPont", lines: [
        "ROE = <b>PAT/Revenue</b> × <b>Revenue/Assets</b> × <b>Assets/Equity</b>",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = margin  ×  asset turnover  ×  leverage",
        "Café: " + P(r.patPct) + " × " + X(p.revenue / bs.totalAssets) + " × " + X(bs.totalAssets / r.equity) + " = <b>" + P(r.roe) + "</b>"
      ], note: "The middle terms cancel algebraically — it's the same ROE. The value is diagnostic: a luxury brand earns its ROE on margin, a supermarket on turnover, a bank on leverage." },
      { t: "example", h: "<p>Priya's " + R(r.equity) + " of equity earned " + R(p.pat) + " — an ROE of " + P(r.roe) + ", comfortably ahead of a fixed deposit. The whole " + R(r.capEmployed) + " of capital employed earned " + R(p.ebit) + " of EBIT, an ROCE of " + P(r.roce) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Returns and the DuPont split, FY25",
          hint: "Build ROE (B8) and ROCE (B9) first. Then the three DuPont levers in B11:B13, and multiply them in B14 — it must reproduce your ROE exactly.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Revenue", p.revenue],
            ["EBIT", p.ebit],
            ["Profit after tax", p.pat],
            ["Total assets", bs.totalAssets],
            ["Total equity", r.equity],
            ["Debt", bs.loan],
            ["ROE", { input: true, mf: true, fmt: "pct", ph: "=B4/B6" }],
            ["ROCE", { input: true, mf: true, fmt: "pct", ph: "=B3/(B6+B7)" }],
            [null, null],
            ["PAT margin", { input: true, mf: true, fmt: "pct", ph: "=B4/B2" }],
            ["Asset turnover", { input: true, mf: true, fmt: "x", ph: "=B2/B5" }],
            ["Leverage (assets/equity)", { input: true, mf: true, fmt: "x", ph: "=B5/B6" }],
            ["DuPont ROE = the three multiplied", { input: true, mf: true, fmt: "pct", ph: "=B11*B12*B13" }]
          ],
          checks: [
            { cell: "B8", expect: 0.144, message: "B8: ROE", mustFormula: true, tol: 0.002 },
            { cell: "B9", expect: 0.1667, message: "B9: ROCE — EBIT over equity plus debt", mustFormula: true, tol: 0.002 },
            { cell: "B11", expect: 0.075, message: "B11: PAT margin", mustFormula: true, tol: 0.002 },
            { cell: "B12", expect: 1.2308, message: "B12: asset turnover", mustFormula: true, tol: 0.01 },
            { cell: "B13", expect: 1.56, message: "B13: leverage", mustFormula: true, tol: 0.01 },
            { cell: "B14", expect: 0.144, message: "B14: DuPont ROE — must equal your B8", mustFormula: true, tol: 0.002 },
            {
              custom: function (s) {
                var a = s.value("B8"), b = s.value("B14");
                if (typeof a !== "number" || typeof b !== "number") return "Build both B8 and B14 first.";
                return Math.abs(a - b) < 0.001 ? true : "DuPont must reproduce ROE exactly — check your three levers.";
              },
              message: "DuPont reconciles to ROE"
            }
          ],
          success: "ROE " + P(r.roe) + ", reached with a " + P(r.patPct) + " margin, " + X(p.revenue / bs.totalAssets) + " asset turnover and " + X(bs.totalAssets / r.equity) + " leverage. Modest on all three — a solid, unlevered small business."
        }
      },
      {
        t: "compare",
        left: {
          title: "Café A — \"Brew Lane\"",
          rows: [["PAT margin", "3%"], ["Asset turnover", "2.0x"], ["Leverage", "3.0x"], ["ROE", "18%", "total"]]
        },
        right: {
          title: "Café B — \"Third Wave\"",
          rows: [["PAT margin", "12%"], ["Asset turnover", "1.0x"], ["Leverage", "1.5x"], ["ROE", "18%", "total"]]
        }
      },
      { t: "where", h: "Returns straddle both statements: the profit comes from the <strong>income statement</strong>, the capital it's measured against from the <strong>balance sheet</strong>. That pairing — a flow over a stock — is what every 'return on something' ratio does, and it's why both statements have to be right before any of them mean anything." },
      { t: "mcq", tag: "Which is healthier?", q: "Both cafés earn an 18% ROE. Which return is more robust?", opts: ["Brew Lane — high asset turnover shows efficiency", "Third Wave — its return rests on margin, not on borrowed money", "They're identical — the ROE is the same", "Brew Lane, because leverage is free money"], correct: 1, why: ["Turnover of 2.0x is genuinely efficient. But a 3% net margin means almost no cushion: a small cost increase erases the profit entirely, and the 3.0x leverage then bites hard.", "Same destination, very different roads. Third Wave earns its 18% from a fat 12% margin with modest borrowing — it can absorb a bad year. Brew Lane's 18% depends on a wafer-thin 3% margin amplified by 3x leverage; leverage magnifies losses exactly as it magnifies profits, so a small downturn could turn its ROE sharply negative. This is precisely what DuPont is for: identical ROE, opposite risk profiles.", "The ROE is the same; the quality of it is not — which is the whole reason DuPont exists.", "Leverage is not free: it carries interest and, more importantly, the obligation to pay it in bad years as well as good."] }
    ]
  };
})();
