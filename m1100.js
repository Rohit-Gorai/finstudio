/* Module 1100 — Assets */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr;

  LS.lessons["1110-ppe"] = {
    id: "1110-ppe", code: "1110", minutes: 4,
    title: "Property, plant & equipment",
    short: "PP&E",
    desc: "Fixed assets and the capex-vs-expense test: when spending creates an asset and when it's just a cost.",
    lede: "Some spending vanishes into the month (rent). Some spending buys years of usefulness (an espresso machine). Accounting treats them completely differently, and the dividing line is the most useful test you'll learn this module.",
    body: [
      { t: "def", term: "Property, plant & equipment (PP&E)", h: "Long-lived physical assets a business uses to operate — machines, vehicles, furniture, shop fit-out. Bought once, used for years. Also called fixed assets or capital assets." },
      { t: "def", term: "Capital expenditure (capex)", h: "Spending that <strong>creates or improves</strong> a long-lived asset. It lands on the balance sheet as PP&E, not on the income statement as an expense. The test: <em>will this spending still be producing benefit beyond this year?</em>" },
      { t: "formula", title: "The capex test", lines: ["Benefit lasts beyond the year → <b>capitalise</b> (balance sheet, PP&E)", "Benefit consumed within the year → <b>expense</b> (income statement)"], note: "Repairs that merely maintain an asset are expenses. Improvements that extend its life or capacity are capex." },
      { t: "example", h: "<p>The café's opening shopping list, 1 April 2023:</p>" +
          '<div class="table-wrap"><table class="ls-table"><thead><tr><th>Asset</th><th class="num">Cost</th><th class="num">Useful life</th></tr></thead><tbody>' +
          "<tr><td>Café fit-out &amp; furniture</td><td class='num'>" + R(600000) + "</td><td class='num'>10 years</td></tr>" +
          "<tr><td>Espresso machine &amp; kitchen</td><td class='num'>" + R(600000) + "</td><td class='num'>10 years</td></tr>" +
          "<tr><td>Delivery van</td><td class='num'>" + R(400000) + "</td><td class='num'>5 years</td></tr>" +
          "</tbody></table></div><p>In FY25 the café adds a second machine and a scooter for " + R(240000) + " (6-year life). Keep this register in mind — it feeds the depreciation lesson next, and the balance sheet after that.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Total the opening gross block",
          hint: "\"Gross block\" is the total original cost of PP&E before any depreciation. Add the three day-one assets with a SUM over the range B2:B4.",
          grid: [
            ["Asset", "Cost"],
            ["Café fit-out & furniture", 600000],
            ["Espresso machine & kitchen", 600000],
            ["Delivery van", 400000],
            ["Gross block, 1 Apr 2023", { input: true, mf: true, fmt: "inr", ph: "=SUM(…)" }]
          ],
          checks: [
            { cell: "B5", expect: 1600000, message: "B5: gross block via SUM over the range B2:B4", mustFormula: true, mustUse: "SUM", mustUseLabel: "SUM with a range like B2:B4" }
          ],
          success: "Gross block " + R(1600000) + ". Ranges (B2:B4) beat typing B2+B3+B4 — add a row later and SUM keeps working."
        }
      },
      { t: "where", h: "PP&E sits near the top of the <strong>balance sheet</strong> as a non-current asset — at cost, minus all depreciation charged so far (next lesson). The cash spent on it appears in the <strong>cash flow statement</strong> under investing." },
      { t: "mcq", q: "Which of these is capex for the café?", opts: ["Replacing the van's worn tyres", "Monthly deep-clean of the machine", "Buying the second espresso machine", "Baristas' training weekend"], correct: 2, why: ["Tyres keep the van doing what it already did — maintenance, an expense. If instead the café fitted a refrigeration unit that let the van deliver cold brew, that would extend capability: capex.", "Cleaning maintains the current asset. Expense.", "A new machine will produce lattes for six years — benefit far beyond this year, so its cost becomes an asset and reaches the P&L only slowly, as depreciation.", "Training has lasting benefit in a loose sense, but accounting is conservative: you can't own an employee's skills (they can resign). Staff costs are expensed."] }
    ]
  };

  LS.lessons["1120-depreciation"] = {
    id: "1120-depreciation", code: "1120", minutes: 5,
    title: "Depreciation: the van schedule",
    short: "Depreciation",
    desc: "Straight-line depreciation with a hands-on 5-year schedule for the café's delivery van.",
    lede: "The van cost ₹4,00,000 but it won't die this year — it'll fade over five. Depreciation spreads the cost over the years that benefit, and it's the first expense you'll meet that consumes zero cash.",
    body: [
      { t: "def", term: "Depreciation", h: "Allocating the cost of a long-lived asset over its useful life, so each year's P&L carries a fair share of the asset it used up. It is an <strong>expense without a cash payment</strong> — the cash left when the asset was bought." },
      { t: "def", term: "Net book value (NBV)", h: "Cost minus accumulated depreciation — what remains on the balance sheet. Not the resale price; just the unallocated cost." },
      { t: "formula", title: "Straight-line depreciation", lines: ["Annual depreciation = (Cost − Residual value) ÷ Useful life", "Van: (" + R(400000) + " − 0) ÷ 5 = <b>" + R(80000) + " per year</b>"], note: "We assume zero residual (scrap) value throughout this course, and a full year's charge in the year of purchase — simple and common for small businesses." },
      { t: "example", h: "<p>The van, bought 1 April 2023 for " + R(400000) + ", life 5 years. Each year the P&L charges " + R(80000) + " and the van's book value steps down by the same amount, hitting zero at the end of FY28. This schedule reappears in lesson 1440 when you build the P&L, so build it well.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The van schedule, FY24–FY28",
          hint: "Straight-line depreciation is always the ORIGINAL cost ÷ life — never the opening book value ÷ life — which is why the charge is the same every year. Anchor the cost as $B$2 so it stays put as you work down the years. Closing = opening − depreciation, and next year's opening links to this year's closing (type =D2, not the number — links are the whole point). FY26–FY27 are done for you; finish FY28.",
          grid: [
            ["Year", "Opening value", "Depreciation", "Closing value"],
            ["FY24", 400000, { input: true, mf: true, fmt: "inr", ph: "=$B$2/5" }, { input: true, mf: true, fmt: "inr", ph: "=…" }],
            ["FY25", { input: true, mf: true, fmt: "inr", ph: "=D2" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["FY26", 240000, 80000, 160000],
            ["FY27", 160000, 80000, 80000],
            ["FY28", 80000, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr", ph: "should hit 0" }]
          ],
          checks: [
            { cell: "C2", expect: 80000, message: "C2: FY24 depreciation — original cost ÷ 5", mustFormula: true },
            { cell: "D2", expect: 320000, message: "D2: FY24 closing = opening − depreciation", mustFormula: true },
            { cell: "B3", expect: 320000, message: "B3: FY25 opening links to FY24 closing (=D2)", mustFormula: true, mustUse: "D2", mustUseLabel: "a link to D2" },
            { cell: "C3", expect: 80000, message: "C3: FY25 depreciation — the same charge again, off the original cost", mustFormula: true },
            { cell: "D3", expect: 240000, message: "D3: FY25 closing", mustFormula: true },
            { cell: "C6", expect: 80000, message: "C6: FY28 depreciation", mustFormula: true },
            { cell: "D6", expect: 0, message: "D6: FY28 closing value — fully depreciated", mustFormula: true, tol: 0 }
          ],
          success: "The van glides from " + R(400000) + " to zero over five years, " + R(80000) + " at a time. That yearly " + R(80000) + " is a real expense on the P&L — but not one rupee of cash moves."
        }
      },
      { t: "where", h: "The annual charge is an <strong>expense on the income statement</strong> (lesson 1440). The running total — accumulated depreciation — is subtracted from PP&E's cost on the <strong>balance sheet</strong>, giving net book value. And because no cash moves, the <strong>cash flow statement</strong> adds it right back (lesson 1520)." },
      { t: "mcq", q: "Depreciation is best described as…", opts: ["Cash set aside each year to replace the van", "The fall in the van's market resale price", "This year's share of a cost paid long ago", "A tax trick to reduce profit"], correct: 2, why: ["Nothing is set aside — no cash moves at all. (Well-run businesses do plan for replacement capex, but that's a management decision, not what depreciation records.)", "Book value and market value drift apart immediately — a one-day-old van resells below cost but is barely depreciated. Accounting allocates cost; it doesn't appraise.", "Exactly. The cash left in year one; depreciation is the matching principle spreading that old cost across the five years the van actually serves. Expense recognition follows benefit, not cash.", "It does reduce taxable profit, and tax codes set their own allowed rates — but the concept exists to match cost to benefit, not to game tax."] }
    ]
  };

  LS.lessons["1130-inventory"] = {
    id: "1130-inventory", code: "1130", minutes: 4,
    title: "Inventory",
    short: "Inventory",
    desc: "Stock on the balance sheet, and the opening + purchases − closing identity that produces cost of goods sold.",
    lede: "Beans in the storeroom aren't an expense — they're an asset waiting to become one. The moment they're brewed and sold, they turn into the P&L's biggest cost line: cost of goods sold.",
    body: [
      { t: "def", term: "Inventory", h: "Goods held for sale or for making things to sell — the café's beans, milk, cups and pastry stock. A <strong>current asset</strong>: it should turn into revenue within the year." },
      { t: "def", term: "Cost of goods sold (COGS)", h: "The cost of the inventory that was actually <strong>consumed</strong> making the period's sales. Not what you bought — what you used. The gap between the two is sitting in the storeroom." },
      { t: "formula", title: "The inventory identity", lines: ["COGS = Opening inventory + Purchases − Closing inventory", "…rearranged to find what the café bought:", "<b>Purchases</b> = COGS + Closing − Opening"], note: "This identity is how businesses that don't track every bean still compute COGS exactly: count the storeroom twice a year and the arithmetic does the rest." },
      { t: "example", h: "<p>FY25: the café started with " + R(C.fy24.bs.inventory) + " of stock, ended with " + R(C.fy25.bs.inventory) + ", and consumed " + R(C.fy25.pl.cogs) + " of beans, milk and pastry making the year's coffee. How much did it buy from suppliers during the year? Don't guess — derive it.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Find FY25 purchases",
          hint: "Rearrange the identity: purchases = COGS + closing − opening. Build B5 from the three cells above it.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Opening inventory (1 Apr 2024)", C.fy24.bs.inventory],
            ["Closing inventory (31 Mar 2025)", C.fy25.bs.inventory],
            ["Cost of goods sold", C.fy25.pl.cogs],
            ["Purchases from suppliers", { input: true, mf: true, fmt: "inr", ph: "=…" }]
          ],
          checks: [
            { cell: "B5", expect: 870000, message: "B5: purchases = COGS + closing − opening", mustFormula: true }
          ],
          success: "The café bought " + R(870000) + " of stock — " + R(30000) + " more than it consumed, which is exactly why the storeroom grew from " + R(120000) + " to " + R(150000) + "."
        }
      },
      { t: "where", h: "Closing inventory is a <strong>current asset on the balance sheet</strong>. COGS is the first cost on the <strong>income statement</strong>, right under revenue (lesson 1420). And the ₹30,000 build-up of stock? Cash spent that isn't yet an expense — the cash flow statement will subtract it in lesson 1520." },
      { t: "mcq", q: "The café buys ₹50,000 of beans with cash and shelves them. The immediate effect on profit is…", opts: ["Profit falls ₹50,000", "Profit rises ₹50,000", "No effect on profit", "Depends on the coffee price"], correct: 2, why: ["Buying stock is not an expense — nothing has been consumed yet. Profit falls only when the beans are used to make sales.", "Buying inputs never raises profit by itself.", "Cash (asset) becomes inventory (asset) — a pure swap, invisible to the P&L. Only when brewed and sold do the beans become COGS and hit profit. This timing gap between buying and expensing is a defining theme of the cash flow module.", "Selling prices affect revenue later; the purchase itself is profit-neutral today."] }
    ]
  };

  LS.lessons["1140-receivables"] = {
    id: "1140-receivables", code: "1140", minutes: 4,
    title: "Trade receivables",
    short: "Receivables",
    desc: "Selling on credit: why revenue is recognized before cash arrives, and how to roll a receivables balance forward.",
    lede: "The café's catering clients don't pay at the till — they pay 30 days after the invoice. The sale is real today; the cash is real next month. Receivables are the gap, and that gap is an asset.",
    body: [
      { t: "def", term: "Trade receivables", h: "Amounts customers owe for goods or services already delivered. Also called accounts receivable or debtors. A <strong>current asset</strong> — it's a legal right to near-term cash." },
      { t: "def", term: "Recognized ≠ collected", h: "Revenue is <strong>recognized</strong> when the coffee is delivered — that's when it's earned. It's <strong>collected</strong> when cash arrives. Between the two moments, the amount lives in receivables. (Accountants call this accrual accounting.)" },
      { t: "formula", title: "Rolling receivables forward", lines: ["Closing AR = Opening AR + Credit sales − Cash collected", "…so cash collected = Opening + Credit sales − Closing"], note: "Every balance-sheet line rolls forward like this: opening + what came in − what went out = closing. You'll use this pattern constantly." },
      { t: "example", h: "<p>The café's corporate catering arm invoiced " + R(600000) + " to offices like Nimbus Tech during FY25, all on 30-day terms. Receivables started the year at " + R(C.fy24.bs.receivables) + " and ended at " + R(C.fy25.bs.receivables) + ". How much catering cash actually landed in the bank?</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Cash collected from catering clients, FY25",
          hint: "Use the roll-forward: collected = opening + invoices − closing.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Opening receivables", C.fy24.bs.receivables],
            ["Credit invoices raised", 600000],
            ["Closing receivables", C.fy25.bs.receivables],
            ["Cash collected", { input: true, mf: true, fmt: "inr", ph: "=…" }]
          ],
          checks: [
            { cell: "B5", expect: 560000, message: "B5: cash collected via the roll-forward", mustFormula: true }
          ],
          success: "Collected " + R(560000) + " against " + R(600000) + " invoiced. Revenue says +6,00,000; the bank says +5,60,000. Both are right — they're answering different questions."
        }
      },
      { t: "where", h: "Closing receivables are a <strong>current asset on the balance sheet</strong>. The invoiced amount is inside <strong>revenue on the income statement</strong> (lesson 1410). The ₹40,000 gap between them is precisely what the <strong>cash flow statement</strong> subtracts from profit in lesson 1520." },
      { t: "mcq", q: "On 25 March the café delivers a ₹40,000 catering order, payable 30 April. In the FY25 statements (year ends 31 March), this order appears in…", opts: ["Revenue only", "Revenue and receivables", "Cash only", "Nowhere until the cash arrives"], correct: 1, why: ["Revenue, yes — but the unpaid ₹40,000 must sit somewhere on the balance sheet too. Every entry has two sides.", "Delivered before year-end → recognized in FY25 revenue. Unpaid at year-end → sitting in receivables on the 31 March balance sheet. When cash arrives in April, receivables fall and cash rises — FY26's cash flow, not FY26's revenue.", "No cash has moved by 31 March, so it can't be in cash.", "Accrual accounting recognizes what's <em>earned</em>, not what's collected — otherwise statements could be gamed by simply delaying invoices."] }
    ]
  };

  LS.lessons["1150-cash-deposit"] = {
    id: "1150-cash-deposit", code: "1150", minutes: 4,
    title: "Cash, the deposit & current vs non-current",
    short: "Cash & classification",
    desc: "Cash as the ultimate asset, security deposits, and sorting the asset side into current and non-current.",
    lede: "Every asset you've met is a machine for eventually producing cash. Cash itself needs no introduction — but where each asset sits on the balance sheet depends on how fast it becomes cash. That's the current / non-current split.",
    body: [
      { t: "def", term: "Cash & bank balances", h: "Money available now — the till float and the current account. The most liquid asset there is, so it anchors one end of the balance sheet's sorting order." },
      { t: "def", term: "Current vs non-current", h: "An asset is <strong>current</strong> if it's expected to become cash (or be consumed) <strong>within 12 months</strong> — inventory, receivables, cash itself. Everything slower is <strong>non-current</strong> — PP&E, and long-term deposits." },
      { t: "example", h: "<p>When Priya signed the café's lease she paid the landlord a " + R(C.fy25.bs.deposit) + " refundable <strong>security deposit</strong>. It's the café's money — an asset — but it only comes back when the lease ends, years away. So it's a non-current asset, sitting near PP&E, far from cash. At 31 March 2025 the café's cash is " + R(C.fy25.bs.cash) + " — modest for a business this size, and module 1500 will explain exactly why that's the number.</p>" },
      {
        t: "classify",
        tag: "Sort the asset side",
        intro: "Current or non-current, as at 31 March 2025?",
        buckets: ["Current asset", "Non-current asset"],
        items: [
          { text: "Inventory, " + R(C.fy25.bs.inventory), bucket: "Current asset", why: "Beans become lattes become cash well within a year." },
          { text: "The delivery van (book value " + R(240000) + ")", bucket: "Non-current asset", why: "It produces benefit over five years — you use it, you don't sell it." },
          { text: "Trade receivables, " + R(C.fy25.bs.receivables), bucket: "Current asset", why: "30-day terms — cash next month." },
          { text: "The lease security deposit, " + R(C.fy25.bs.deposit), bucket: "Non-current asset", why: "Refundable only when the lease ends — years out, so non-current even though it's 'just money'.", whyNot: { "Current asset": "It feels like cash, but the café can't touch it until the lease ends years from now. Expected conversion beyond 12 months → non-current." } },
          { text: "Cash at bank, " + R(C.fy25.bs.cash), bucket: "Current asset", why: "It already is cash — maximally current." }
        ]
      },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Total current assets, 31 Mar 2025",
          hint: "Sum the three current assets with a range.",
          grid: [
            ["", { v: "31 Mar 2025", year: true }],
            ["Inventory", C.fy25.bs.inventory],
            ["Trade receivables", C.fy25.bs.receivables],
            ["Cash at bank", C.fy25.bs.cash],
            ["Total current assets", { input: true, mf: true, fmt: "inr", ph: "=SUM(…)" }]
          ],
          checks: [
            { cell: "B5", expect: 450000, message: "B5: total current assets via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" }
          ],
          success: "Current assets " + R(450000) + ". Hold onto this number — it's the top half of the current ratio in lesson 1620."
        }
      },
      { t: "where", h: "The <strong>balance sheet</strong> groups assets by these labels: non-current first (PP&E, deposit), then current in order of liquidity. You now know every asset line on the café's balance sheet — module 1200 builds the other side." },
      { t: "mcq", q: "Why do lenders care so much about the current/non-current split?", opts: ["Non-current assets are worth more", "It shows whether near-term cash coming in can cover near-term bills going out", "Tax rates differ between the two", "It's purely a presentation convention"], correct: 1, why: ["Value isn't the point — timing is. A café rich in vans can still miss payroll on Friday.", "A business dies when it can't pay this month's bills, regardless of how many machines it owns. Matching assets-turning-into-cash against liabilities-coming-due within the same 12 months is the core of liquidity analysis — lesson 1620 turns it into ratios.", "The split has real cash-timing meaning beyond any tax treatment.", "It changes decisions — banks lend or refuse on it — so it's much more than presentation."] }
    ]
  };
})();
