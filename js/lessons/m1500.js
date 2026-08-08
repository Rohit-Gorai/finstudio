/* Module 1500 — The cash flow statement */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr;
  var cf = C.fy25.cf, p = C.fy25.pl, bs = C.fy25.bs, bs24 = C.fy24.bs;

  LS.lessons["1510-profit-not-cash"] = {
    id: "1510-profit-not-cash", code: "1510", minutes: 4,
    title: "Profit is not cash",
    short: "Profit ≠ cash",
    desc: "The four reasons a profitable business can run out of money, with small reconciliations you build yourself.",
    lede: "Profitable businesses go bankrupt. Not occasionally — routinely. It happens when profit and cash drift apart and the owner watches only the profit. This module teaches you to watch both.",
    body: [
      { t: "def", term: "The wedge", h: "Profit and cash differ for four reasons: <strong>(1)</strong> non-cash expenses like depreciation, <strong>(2)</strong> cash tied up in working capital (stock and unpaid invoices), <strong>(3)</strong> cash spent on assets, which never appears as an expense, and <strong>(4)</strong> financing flows — loans and dividends — that profit never sees." },
      { t: "formula", title: "Four ways they diverge", lines: [
        "Depreciation      → expense, <b>no cash out</b>      → cash &gt; profit",
        "Inventory ↑       → cash out, <b>no expense yet</b>  → cash &lt; profit",
        "Receivables ↑     → revenue, <b>no cash in</b>       → cash &lt; profit",
        "Capex / repayment → cash out, <b>never an expense</b> → cash &lt; profit"
      ], note: "Read the middle column: each line is a timing mismatch between when value moves and when cash moves. That's all the cash flow statement ever fixes." },
      { t: "example", h: "<p>In FY25 the café earned " + R(p.pat) + " of profit. Its bank balance rose by " + R(cf.net) + ". A gap of " + R(p.pat - cf.net) + " — bigger than the profit itself. Every rupee of that gap has a name, and by the “Capstone: the full cash flow statement” lesson you'll have accounted for all of them.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Three quick reconciliations",
          hint: "Each row is a separate mini-scenario: start from profit and adjust to cash. Think about which direction each item pushes.",
          grid: [
            ["Scenario", "Profit", "Adjustment", "Cash effect"],
            ["Earned ₹1,00,000, of which ₹2,000 was depreciation", 100000, 2000, { input: true, mf: true, fmt: "inr", ph: "=B2+C2" }],
            ["Earned ₹1,00,000 but receivables rose ₹30,000", 100000, -30000, { input: true, mf: true, fmt: "inr" }],
            ["Earned ₹1,00,000 and spent ₹1,50,000 on a machine", 100000, -150000, { input: true, mf: true, fmt: "inr" }]
          ],
          checks: [
            { cell: "D2", expect: 102000, message: "D2: depreciation added back — cash beats profit", mustFormula: true },
            { cell: "D3", expect: 70000, message: "D3: receivables growth eats cash", mustFormula: true },
            { cell: "D4", expect: -50000, message: "D4: capex — profitable, but cash went backwards", mustFormula: true }
          ],
          success: "Row 4 is the killer: a genuinely profitable month where " + R(50000) + " left the bank. Do that four months running and a profitable business misses payroll."
        }
      },
      { t: "note", h: "This is why fast-growing businesses so often need funding. Growth means buying stock earlier and waiting for customers to pay — both consume cash <em>ahead</em> of the profit they eventually produce. Grow fast enough and you can go broke doing everything right." },
      { t: "where", h: "The <strong>cash flow statement</strong> exists solely to explain this gap. It starts at the income statement's PAT and walks, adjustment by adjustment, to the change in the balance sheet's cash line — stitching all three statements together." },
      { t: "mcq", q: "A café doubles its sales, all on 30-day credit, and stocks up on beans to cope. Profit is at a record high. What is the most likely cash position?", opts: ["Record high too — profit is cash eventually", "Worse than before, possibly badly", "Unchanged — the effects cancel", "Impossible to say without the tax rate"], correct: 1, why: ["Eventually, yes — but businesses pay rent and salaries this month, not eventually. The lag is what kills them.", "Both changes drain cash exactly when profit is booming: the sales are recognised as revenue but sit unpaid in receivables, while the extra beans were paid for upfront. This pattern — record profit, emptying bank account — is the classic overtrading failure. It's why lenders read the cash flow statement before the P&L.", "They don't cancel; they compound. Both are cash <em>outflows</em> relative to profit.", "The tax rate affects the size, not the direction. Growth funded by working capital drains cash at any tax rate."] }
    ]
  };

  LS.lessons["1520-cfo"] = {
    id: "1520-cfo", code: "1520", minutes: 6,
    title: "Cash from operations: the indirect method",
    short: "CFO (indirect)",
    desc: "Start at PAT, add back depreciation, adjust for working capital changes — and arrive at the cash the café's operations actually generated.",
    lede: "The first and most important section of the cash flow statement. It starts at the P&L's bottom line and undoes every timing difference until only cash remains. This is the method essentially every published statement uses.",
    body: [
      { t: "def", term: "Cash from operations (CFO)", h: "Cash generated by the actual business of selling coffee — before investing in assets and before dealing with lenders or owners. The healthiest number on the statement: a business that can't generate positive CFO is being funded by someone else." },
      { t: "def", term: "The indirect method", h: "Rather than listing every receipt and payment, start from profit after tax and <strong>reverse the accruals</strong>: add back non-cash expenses, then adjust for the change in each working-capital balance." },
      { t: "formula", title: "The indirect method, in signs", lines: [
        "Profit after tax",
        "+ Depreciation                    <i>(expense, no cash left)</i>",
        "− Increase in receivables         <i>(revenue, no cash came)</i>",
        "− Increase in inventory           <i>(cash out, no expense yet)</i>",
        "+ Increase in payables            <i>(expense, no cash left yet)</i>",
        "+ Increase in accrued expenses    <i>(same idea)</i>",
        "= <b>Cash from operations</b>"
      ], note: "The rule that never fails: an <b>asset</b> going up consumes cash; a <b>liability</b> going up releases cash. If you remember only one thing from this module, remember that." },
      { t: "example", h: "<p>Every input is one you already know. PAT " + R(p.pat) + " (see “Capstone: the full income statement”). Depreciation " + R(p.dep) + " (1440). Receivables rose from " + R(bs24.receivables) + " to " + R(bs.receivables) + "; inventory from " + R(bs24.inventory) + " to " + R(bs.inventory) + "; payables from " + R(bs24.payables) + " to " + R(bs.payables) + "; accrued salaries from " + R(bs24.accrued) + " to " + R(bs.accrued) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "FY25 cash from operations",
          hint: "Column D is the adjustment. For each working-capital line, compute closing − opening in column D and then think about the sign: for assets the cash effect is the negative of the change; for liabilities it's the change itself. Build D4:D7 as formulas from B and C, then total the cash column in D9.",
          grid: [
            ["", "Opening", "Closing", "Cash effect"],
            ["Profit after tax", null, null, p.pat],
            ["Add back: depreciation", null, null, { input: true, mf: true, fmt: "inr", ph: "=240000" }],
            ["Trade receivables", bs24.receivables, bs.receivables, { input: true, mf: true, fmt: "inr", ph: "=B4-C4" }],
            ["Inventory", bs24.inventory, bs.inventory, { input: true, mf: true, fmt: "inr" }],
            ["Trade payables", bs24.payables, bs.payables, { input: true, mf: true, fmt: "inr", ph: "=C6-B6" }],
            ["Accrued salaries", bs24.accrued, bs.accrued, { input: true, mf: true, fmt: "inr" }],
            [null, null, null, null],
            ["CASH FROM OPERATIONS", null, null, { input: true, mf: true, fmt: "inr", ph: "=SUM(D2:D7)" }]
          ],
          checks: [
            { cell: "D3", expect: 240000, message: "D3: depreciation added back", mustFormula: true },
            { cell: "D4", expect: -40000, message: "D4: receivables grew — a cash outflow", mustFormula: true },
            { cell: "D5", expect: -30000, message: "D5: inventory grew — a cash outflow", mustFormula: true },
            { cell: "D6", expect: 20000, message: "D6: payables grew — a cash inflow", mustFormula: true },
            { cell: "D7", expect: 10000, message: "D7: accrued salaries grew — a cash inflow", mustFormula: true },
            { cell: "D9", expect: 380000, message: "D9: cash from operations via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" }
          ],
          success: "CFO " + R(cf.cfo) + " against PAT of " + R(p.pat) + ". The operations threw off more than twice the profit — almost entirely because of the " + R(p.dep) + " depreciation add-back."
        }
      },
      { t: "note", h: "<strong>A convention worth flagging:</strong> Indian statements (AS 3 / Ind AS 7) usually start this section from <em>profit before tax</em> and show tax paid as a separate operating line. Starting from PAT, as we do, reaches the same CFO and is the common teaching and modeling shortcut. It also assumes tax expense equals tax paid — true here, since we're ignoring deferred tax." },
      { t: "where", h: "CFO is the first of three sections on the <strong>cash flow statement</strong>. Its inputs come from the <strong>income statement</strong> (PAT, depreciation) and from comparing two <strong>balance sheets</strong> (the working-capital changes). It is literally a bridge between the other two statements." },
      { t: "mcq", q: "Inventory falls from ₹1,50,000 to ₹1,10,000. What does CFO show?", opts: ["−₹40,000, because stock is lower", "+₹40,000, because the café sold stock without buying replacements", "No effect — inventory is a balance sheet item", "−₹40,000, because it's an asset"], correct: 1, why: ["The direction is backwards. Running stock down means the café stopped paying for replacements while still selling — cash comes in.", "An asset falling releases cash. The café sold ₹40,000 of beans it had already paid for in an earlier period, so this period's COGS is higher than this period's spending. Working capital freed up is a real, if one-off, source of cash — and a common way struggling businesses survive another quarter.", "It's a balance sheet item, but its <em>change</em> is exactly what the indirect method adjusts for.", "Right that it's an asset, wrong on direction: assets going <em>up</em> consume cash, so assets going <em>down</em> release it."] }
    ]
  };

  LS.lessons["1530-cfi"] = {
    id: "1530-cfi", code: "1530", minutes: 4,
    title: "Cash from investing",
    short: "CFI & capex",
    desc: "Capex on the cash flow statement, and the link between what you spend on assets and what depreciation you'll carry.",
    lede: "The section where a business spends money on its future. Short, usually negative, and the fastest way to see whether a company is growing, coasting, or quietly shrinking.",
    body: [
      { t: "def", term: "Cash from investing (CFI)", h: "Cash spent on or received from long-term assets — buying equipment, selling an old van. Negative CFI is normal and usually healthy: it means the business is investing." },
      { t: "formula", title: "Reading capex against depreciation", lines: [
        "Capex &gt; Depreciation  → the asset base is <b>growing</b>",
        "Capex ≈ Depreciation  → <b>maintaining</b> — replacing what wears out",
        "Capex &lt; Depreciation  → <b>shrinking</b> — living off existing assets"
      ], note: "A business that runs capex below depreciation for years is consuming its own capacity. It flatters cash flow now and forces a large catch-up later." },
      { t: "example", h: "<p>FY25's only investing activity was the " + R(240000) + " second machine and scooter — the FY25 additions from your depreciation schedule in the “Depreciation & EBIT” lesson. So CFI is " + R(cf.cfi) + ". Note that FY25 capex of " + R(240000) + " exactly equals FY25 depreciation of " + R(p.dep) + ": the café is holding its capacity steady, not expanding it.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "FY25 investing, and the PP&E roll-forward it drives",
          hint: "CFI in B4. Then prove capex is consistent with the balance sheet: net PP&E rolls forward as opening + capex − depreciation, and must land on " + R(bs.ppeNet) + ".",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Purchase of equipment (capex)", -240000],
            ["Proceeds from selling assets", 0],
            ["CASH FROM INVESTING", { input: true, mf: true, fmt: "inr", ph: "=SUM(B2:B3)" }],
            [null, null],
            ["Opening net PP&E (31 Mar 2024)", bs24.ppeNet],
            ["Add: capex", { input: true, mf: true, fmt: "inr", ph: "=-B2" }],
            ["Less: depreciation", -p.dep],
            ["Closing net PP&E (31 Mar 2025)", { input: true, mf: true, fmt: "inr", ph: "=SUM(B6:B8)" }]
          ],
          checks: [
            { cell: "B4", expect: -240000, message: "B4: cash from investing", mustFormula: true },
            { cell: "B7", expect: 240000, message: "B7: capex as a positive addition to PP&E", mustFormula: true },
            { cell: "B9", expect: 1400000, message: "B9: closing net PP&E — matches the balance sheet's " + R(1400000), mustFormula: true }
          ],
          success: "CFI " + R(cf.cfi) + ", and net PP&E rolls to exactly " + R(bs.ppeNet) + " — the figure you put on the balance sheet in the “Capstone: build the balance sheet” lesson. Capex and depreciation cancelled, so net PP&E didn't move at all."
        }
      },
      { t: "where", h: "CFI is the second section of the <strong>cash flow statement</strong>. The capex it reports lands in PP&E on the <strong>balance sheet</strong> and then drips onto the <strong>income statement</strong> as depreciation for years afterwards. This roll-forward is bridge #2 of the “Linking the three statements” module." },
      { t: "mcq", q: "A café reports strong CFO but its capex has been half its depreciation for three years. What should you suspect?", opts: ["Excellent capital discipline", "Cash flow is being flattered by under-investment that must be caught up later", "The depreciation rate is definitely wrong", "Nothing — CFO is what matters"], correct: 1, why: ["It can look like discipline for a year. Three years of replacing only half of what wears out is different — the equipment is aging.", "Depreciation is the annual estimate of capacity being consumed. Spending half of it means the asset base is quietly running down, and the espresso machines will need replacing all at once. Today's healthy cash flow is partly borrowed from tomorrow's balance sheet. Comparing capex to depreciation over several years is one of the fastest quality checks in analysis.", "Possible, but under-spending is the far more common explanation — and you'd check the asset ages before blaming the rate.", "CFO matters enormously, but CFO minus capex — free cash flow, the “Free cash flow” lesson — is what actually funds lenders and owners."] }
    ]
  };

  LS.lessons["1540-cff"] = {
    id: "1540-cff", code: "1540", minutes: 4,
    title: "Cash from financing",
    short: "CFF",
    desc: "Loan drawdowns and repayments, share issues and dividends — the section that shows who is funding whom.",
    lede: "The last section: money moving between the business and the people who fund it. Read it to learn whether a business is raising money or returning it.",
    body: [
      { t: "def", term: "Cash from financing (CFF)", h: "Cash from or to providers of capital: borrowing and repaying loans, issuing shares, paying dividends. Note what's <em>missing</em> — interest paid usually sits in operating, not financing, even though it goes to a lender." },
      { t: "formula", title: "What belongs in financing", lines: [
        "+ Loan drawn down            − Loan principal repaid",
        "+ Shares issued              − Dividends paid",
        "= <b>Cash from financing</b>",
        "<i>Interest paid: operating (it's a cost of running the business)</i>",
        "<i>Loan principal: financing (it's the money itself)</i>"
      ], note: "The interest-vs-principal split from the “Borrowings” lesson decides which section each payment lands in. Ind AS permits interest paid in either operating or financing for non-financial companies, provided it's applied consistently — we keep it in operating, inside PAT." },
      { t: "example", h: "<p>FY25 had two financing events: the café repaid " + R(50000) + " of loan principal (see “Borrowings”), and paid Priya her first dividend of " + R(C.fy25.dividend) + " (see “Retained earnings”). No new shares, no new borrowing. CFF is " + R(cf.cff) + " — the business returning money to its funders.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "FY25 financing, and the loan roll-forward",
          hint: "CFF in B5. Then check the repayment against the balance sheet: the loan must roll from " + R(bs24.loan) + " to " + R(bs.loan) + ".",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Fresh borrowing", 0],
            ["Loan principal repaid", -50000],
            ["Dividend paid to Priya", -C.fy25.dividend],
            ["CASH FROM FINANCING", { input: true, mf: true, fmt: "inr", ph: "=SUM(B2:B4)" }],
            [null, null],
            ["Opening loan (31 Mar 2024)", bs24.loan],
            ["Repayment", { input: true, mf: true, fmt: "inr", ph: "=B3" }],
            ["Closing loan (31 Mar 2025)", { input: true, mf: true, fmt: "inr", ph: "=B7+B8" }]
          ],
          checks: [
            { cell: "B5", expect: -100000, message: "B5: cash from financing via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B8", expect: -50000, message: "B8: the repayment, linked from B3", mustFormula: true },
            { cell: "B9", expect: 550000, message: "B9: closing loan — matches the balance sheet's " + R(550000), mustFormula: true }
          ],
          success: "CFF " + R(cf.cff) + " and the loan rolls to exactly " + R(bs.loan) + ". Note the dividend appears here — never on the income statement. Dividends are a distribution of profit, not a cost of earning it."
        }
      },
      { t: "where", h: "CFF is the third section of the <strong>cash flow statement</strong>. Loan movements roll the borrowings line on the <strong>balance sheet</strong>; the dividend reduces retained earnings there too (the '− dividends' in your the “Retained earnings” lesson roll-forward). The <strong>income statement</strong> sees none of it — only the interest." },
      { t: "mcq", q: "Which pairing is correct?", opts: ["Interest paid → financing; dividend paid → financing", "Interest paid → operating; dividend paid → financing", "Interest paid → operating; dividend paid → operating", "Both belong in investing"], correct: 1, why: ["Defensible under Ind AS, which allows interest paid in financing if applied consistently — but it isn't the convention this course (or most teaching models) uses, since interest is already inside PAT.", "Interest is a cost of running the business, already deducted in arriving at PAT, so it sits in operating. A dividend isn't a cost at all — it's profit being handed to the owner, which is a transaction with a capital provider: financing. The give-away is that interest reduces profit and dividends don't.", "A dividend can't be operating — it isn't an expense of earning revenue. It never appears on the income statement.", "Investing is only about long-term assets — buying and selling machines, not dealing with funders."] }
    ]
  };

  LS.lessons["1550-cf-capstone"] = {
    id: "1550-cf-capstone", code: "1550", minutes: 6,
    title: "Capstone: the full cash flow statement",
    short: "★ The cash flow statement",
    desc: "Combine CFO, CFI and CFF to derive closing cash — which must equal the ₹1,00,000 on the capstone balance sheet.",
    lede: "Three sections, one answer. Add them to the opening bank balance and you must land on exactly ₹1,00,000 — the cash line of the balance sheet you tied in the “Capstone: build the balance sheet” lesson. This is the third statement closing the loop.",
    body: [
      { t: "p", h: "You now have two independent proofs waiting to meet. The balance sheet said cash was " + R(bs.cash) + ". This statement derives cash from a completely different direction — profit, working capital, capex, financing. When they agree, your model is genuinely consistent." },
      { t: "formula", title: "The whole statement", lines: [
        "Cash from operations   (see “CFO (indirect)”)",
        "+ Cash from investing  (see “CFI & capex”)",
        "+ Cash from financing  (see “CFF”)",
        "= Net change in cash",
        "+ Opening cash",
        "= <b>Closing cash</b>  → must equal the balance sheet"
      ] },
      { t: "example", h: "<p>Bombay Bean Coffee Co., year ended 31 March 2025. The café opened the year with " + R(cf.openingCash) + " in the bank (the FY24 closing balance). Everything else you've built in this module.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Bombay Bean Coffee Co. — Cash flow statement for the year ended 31 March 2025",
          hint: "Build the three section subtotals (B8 operating, B12 investing, B16 financing) with SUM, then the net change (B18), then closing cash (B20). The tie meter compares your closing cash to the balance sheet's " + R(bs.cash) + ".",
          grid: [
            ["", { v: "FY25", year: true }],
            ["OPERATING ACTIVITIES", null],
            ["Profit after tax", p.pat],
            ["Add: depreciation", p.dep],
            ["Increase in receivables", cf.dAR],
            ["Increase in inventory", cf.dInv],
            ["Increase in payables & accruals", cf.dAP + cf.dAccr],
            ["Cash from operations", { input: true, mf: true, fmt: "inr", ph: "=SUM(B3:B7)" }],
            ["INVESTING ACTIVITIES", null],
            ["Purchase of equipment", cf.capex],
            ["Proceeds from asset sales", 0],
            ["Cash from investing", { input: true, mf: true, fmt: "inr", ph: "=SUM(B10:B11)" }],
            ["FINANCING ACTIVITIES", null],
            ["Loan principal repaid", cf.loanRepaid],
            ["Dividend paid", cf.dividend],
            ["Cash from financing", { input: true, mf: true, fmt: "inr", ph: "=SUM(B14:B15)" }],
            [null, null],
            ["NET CHANGE IN CASH", { input: true, mf: true, fmt: "inr", ph: "=B8+B12+B16" }],
            ["Opening cash (1 Apr 2024)", cf.openingCash],
            ["CLOSING CASH", { input: true, mf: true, fmt: "inr", ph: "=B18+B19" }],
            [null, null],
            ["Balance sheet cash (see “Capstone: build the balance sheet”)", bs.cash]
          ],
          checks: [
            { cell: "B8", expect: 380000, message: "B8: cash from operations via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B12", expect: -240000, message: "B12: cash from investing", mustFormula: true },
            { cell: "B16", expect: -100000, message: "B16: cash from financing", mustFormula: true },
            { cell: "B18", expect: 40000, message: "B18: net change in cash", mustFormula: true },
            { cell: "B20", expect: 100000, message: "B20: CLOSING CASH — must be exactly ₹1,00,000", mustFormula: true, tol: 0 },
            {
              custom: function (s) {
                var a = s.value("B20"), b = s.value("B22");
                return (a === b && a === 100000) ? true : "Closing cash must equal the balance sheet's " + R(100000) + " exactly.";
              },
              message: "Closing cash agrees with the balance sheet"
            }
          ],
          tie: { a: "B20", le: "B22", aLabel: "Closing cash (this statement)", leLabel: "Cash on the balance sheet" },
          success: "Closing cash " + R(bs.cash) + " — derived from profit and flows, matching the balance sheet exactly. All three statements now agree on the same café."
        }
      },
      { t: "note", h: "Look at the shape of the year: operations generated " + R(cf.cfo) + ", of which " + R(240000) + " went back into equipment and " + R(100000) + " to the bank and Priya. What's left, " + R(cf.net) + ", is the increase in the bank balance. That's a healthy pattern — the business funded its own investment and still returned money to its funders." },
      { t: "where", h: "This statement's closing cash <em>is</em> the <strong>balance sheet's</strong> cash line (bridge #3), and it began at the <strong>income statement's</strong> PAT (bridge #1). You've now built all three statements for the same year, from the same facts, and they agree. Module 2100 wires them together so they stay agreeing when you change an assumption." },
      { t: "mcq", q: "A business shows CFO of ₹5,00,000, CFI of −₹8,00,000 and CFF of +₹4,00,000. What story does that tell?", opts: ["It's in trouble — cash from investing is negative", "It's investing more than operations generate, funded by raising money", "It's returning money to shareholders", "The statement must be wrong — the sections should net to zero"], correct: 1, why: ["Negative CFI on its own is a sign of investment, not distress — the question is how it's being funded.", "The business generated ₹5,00,000, spent ₹8,00,000 on assets, and covered the ₹3,00,000 shortfall (plus a bit more) by borrowing or issuing shares. Cash rose ₹1,00,000 overall. That's the classic expansion profile: legitimate and common, but it only works while funders keep saying yes. Compare it with the café, which funded its own capex out of operations.", "Positive CFF means money is coming <em>in</em> from funders, not going out.", "The three sections net to the change in cash, which is ₹1,00,000 here. They have no reason to sum to zero."] }
    ]
  };
})();
