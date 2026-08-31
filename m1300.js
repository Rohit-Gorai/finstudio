/* Module 1300 — Equity & the balance sheet (capstone: the sheet must tie) */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr;

  LS.lessons["1310-share-capital"] = {
    id: "1310-share-capital", code: "1310", minutes: 3,
    title: "Share capital",
    short: "Share capital",
    desc: "The owner's paid-in stake: shares, face value, and why share capital stays frozen while the business grows.",
    lede: "Equity has two components with very different personalities. Share capital is the money owners put in — it barely ever moves. Retained earnings is the money the business made and kept — it moves every single year. This lesson: the frozen half.",
    body: [
      { t: "def", term: "Share capital", h: "The amount owners have <strong>paid into</strong> the company in exchange for shares. It records historical contribution, not current value — a company worth crores can have tiny share capital." },
      { t: "def", term: "Shares & face value", h: "Ownership is divided into identical units — shares — each with a nominal <strong>face value</strong> (₹10 is common in India). Shares make ownership divisible: bring in a partner by issuing more, no renegotiation of everything." },
      { t: "formula", title: "Share capital", lines: ["Share capital = Number of shares × Face value per share"], note: "If investors pay more than face value, the excess is recorded separately as securities premium — not needed for our café, where Priya paid exactly face value." },
      { t: "example", h: "<p>Bombay Bean Coffee Co. issued <strong>1,00,000 shares of ₹10 each</strong> to Priya on day one, all fully paid: share capital " + R(C.fy25.bs.capital) + ". Two profitable years later it is <em>still</em> " + R(C.fy25.bs.capital) + " — profits grow retained earnings (next lesson), never share capital.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The café's share capital",
          hint: "Multiply shares by face value. (Cell references, not retyped numbers.)",
          grid: [
            ["", { v: "Since 1 Apr 2023", year: true }],
            ["Shares issued", { v: 100000, fmt: "plain" }],
            ["Face value per share", { v: 10, fmt: "plain" }],
            ["Share capital", { input: true, mf: true, fmt: "inr", ph: "=B2*B3" }]
          ],
          checks: [
            { cell: "B4", expect: 1000000, message: "B4: shares × face value", mustFormula: true }
          ],
          success: "Share capital " + R(1000000) + " — set on day one, untouched since. All the action in equity happens in the other component."
        }
      },
      { t: "where", h: "Share capital is the first line of <strong>equity on the balance sheet</strong>. It changes only when shares are actually issued or bought back — not when profits are earned, not when the share price moves." },
      { t: "mcq", q: "After two profitable years, the café's share capital is still exactly " + R(1000000) + ". Why?", opts: ["An accounting error nobody caught", "Profits are recorded in retained earnings, not share capital", "It's adjusted for inflation only every five years", "Priya withdrew her profits as salary"], correct: 1, why: ["No error — this is by design. Each equity line answers a different question.", "Share capital answers \"what did owners pay in?\" Retained earnings answers \"what has the business earned and kept?\" Keeping them separate lets a reader instantly split a company's equity into money invested vs money self-generated — a fast quality signal about the business.", "Indian books are kept at historical cost; no inflation indexing of share capital.", "Whether profits are paid out or kept, share capital is untouched — payouts come from retained earnings."] }
    ]
  };

  LS.lessons["1320-retained-earnings"] = {
    id: "1320-retained-earnings", code: "1320", minutes: 4,
    title: "Retained earnings",
    short: "Retained earnings",
    desc: "The equity line that moves: opening + profit after tax − dividends, and why retained earnings is not a pile of cash.",
    lede: "Here is the single most important link in all of financial statements: this year's profit doesn't vanish when the year ends — it lands in equity, in a line called retained earnings. Master this roll-forward and the three statements start snapping together.",
    body: [
      { t: "def", term: "Retained earnings", h: "All the profit the business has ever made, <strong>minus</strong> all it has ever paid out to owners as dividends. It accumulates year after year — the business's earned savings, in claim form." },
      { t: "formula", title: "The retained earnings bridge", lines: ["Closing RE = Opening RE + <b>Profit after tax</b> − Dividends"], note: "This is bridge #1 of the three-statement link (the “Linking the three statements” module): the income statement's bottom line flows into the balance sheet through this exact formula." },
      { t: "example", h: "<p>The café entered FY25 with " + R(C.fy24.bs.retained) + " of retained earnings (its FY24 profit, nothing paid out). In FY25 it earned <strong>profit after tax of " + R(C.fy25.pl.pat) + "</strong> — a number you will personally assemble, line by line, in the P&L capstone (1460) — and paid Priya her first dividend of " + R(C.fy25.dividend) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Roll retained earnings forward through FY25",
          hint: "Closing = opening + PAT − dividend. Reference the cells above.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Opening retained earnings", C.fy24.bs.retained],
            ["Profit after tax (FY25)", C.fy25.pl.pat],
            ["Dividend paid to Priya", C.fy25.dividend],
            ["Closing retained earnings", { input: true, mf: true, fmt: "inr", ph: "=…" }]
          ],
          checks: [
            { cell: "B5", expect: 250000, message: "B5: closing RE = opening + PAT − dividend", mustFormula: true }
          ],
          success: "Closing retained earnings " + R(250000) + ". Remember the ingredients — " + R(C.fy25.pl.pat) + " of PAT especially. The capstone balance sheet will not tie without this exact roll-forward."
        }
      },
      { t: "where", h: "Retained earnings is the second line of <strong>equity on the balance sheet</strong>. Its yearly increase is explained by the <strong>income statement</strong> (PAT) and the dividend, which is a financing outflow on the <strong>cash flow statement</strong> — one line touching all three statements." },
      { t: "mcq", q: "The café's retained earnings are " + R(250000) + ", but its cash is only " + R(100000) + ". Is something wrong?", opts: ["Yes — retained earnings should equal cash", "No — retained earnings is a claim; the matching value is spread across many assets", "Yes — someone has taken the missing " + R(150000), "No — but only because of a timing difference that will fix itself"], correct: 1, why: ["This is the most common misreading of a balance sheet. Retained earnings lives on the claims side — it doesn't point at any particular asset.", "Retained profit was reinvested: some became the second espresso machine, some sits in inventory and receivables, some repaid the loan. Retained earnings says \"the owner's claim grew " + R(250000) + " through profits\"; it never promised that growth would stay in the bank. Companies with enormous retained earnings and thin cash are completely normal.", "Nothing is missing — the profit was deliberately put to work in assets that earn more than a bank account.", "It's not a timing quirk that reverses; reinvestment is permanent strategy. The claim and the cash simply measure different things."] }
    ]
  };

  LS.lessons["1330-balance-sheet"] = {
    id: "1330-balance-sheet", code: "1330", minutes: 6,
    title: "Capstone: build the balance sheet",
    short: "★ The balance sheet",
    desc: "Assemble Bombay Bean's full FY25 balance sheet and make it tie: total assets = total liabilities + equity = ₹19,50,000.",
    lede: "Everything you've built — PP&E, inventory, receivables, cash, payables, the loan, share capital, retained earnings — assembles into one statement now. The tie meter at the bottom is watching: assets must equal liabilities plus equity, to the rupee.",
    share: true,
    body: [
      { t: "p", h: "A balance sheet that ties isn't a formality — it's proof that every transaction was recorded with both its sides. Yours will tie at <strong>" + R(1950000) + "</strong> if each piece you built in modules 1100–1300 is wired in correctly. If it doesn't tie, the <em>size</em> of the difference is your first debugging clue." },
      { t: "formula", title: "What you're assembling", lines: ["Total assets = PP&E (net) + deposit + inventory + receivables + cash", "Total equity & liabilities = share capital + retained earnings", "&nbsp;&nbsp;+ term loan + payables + salaries payable", "<b>Tie:</b> Total assets − Total equity & liabilities = 0"], note: "Presented assets-first here for building intuition. India's statutory Schedule III format lists Equity & Liabilities first — same numbers, opposite order; see the Reference section." },
      { t: "example", h: "<p>It's 31 March 2025, closing time. Gross PP&E stands at " + R(C.fy25.bs.ppeGross) + " (the " + R(1600000) + " day-one register plus the FY25 " + R(240000) + " addition), and accumulated depreciation is " + R(C.fy25.bs.accDep) + " (two years' charges: " + R(200000) + " + " + R(240000) + "). The rest you know: every line below is one you've already computed somewhere in this course.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Bombay Bean Coffee Co. — Balance sheet as at 31 March 2025",
          hint: "Five formulas to write: net PP&E (B5), total assets (B10, use SUM), retained earnings (B13 — the 1320 roll-forward: opening " + R(120000) + " + PAT " + R(180000) + " − dividend " + R(50000) + "), total equity & liabilities (B17, use SUM). Watch the tie meter as you go.",
          grid: [
            ["", { v: "31 Mar 2025", year: true }],
            ["ASSETS", null],
            ["Gross PP&E (at cost)", C.fy25.bs.ppeGross],
            ["Less: accumulated depreciation", -C.fy25.bs.accDep],
            ["PP&E, net", { input: true, mf: true, fmt: "inr", ph: "=B3+B4" }],
            ["Security deposit", C.fy25.bs.deposit],
            ["Inventory", C.fy25.bs.inventory],
            ["Trade receivables", C.fy25.bs.receivables],
            ["Cash at bank", C.fy25.bs.cash],
            ["TOTAL ASSETS", { input: true, mf: true, fmt: "inr", ph: "=SUM(B5:B9)" }],
            ["EQUITY & LIABILITIES", null],
            ["Share capital", C.fy25.bs.capital],
            ["Retained earnings", { input: true, mf: true, fmt: "inr", ph: "=opening+PAT−dividend" }],
            ["Term loan", C.fy25.bs.loan],
            ["Trade payables", C.fy25.bs.payables],
            ["Salaries payable", C.fy25.bs.accrued],
            ["TOTAL EQUITY & LIABILITIES", { input: true, mf: true, fmt: "inr", ph: "=SUM(B12:B16)" }]
          ],
          checks: [
            { cell: "B5", expect: 1400000, message: "B5: net PP&E = gross − accumulated depreciation", mustFormula: true },
            { cell: "B10", expect: 1950000, message: "B10: total assets via SUM(B5:B9)", mustFormula: true, mustUse: "SUM", mustUseLabel: "SUM over B5:B9" },
            { cell: "B13", expect: 250000, message: "B13: retained earnings via the roll-forward", mustFormula: true },
            { cell: "B17", expect: 1950000, message: "B17: total equity & liabilities via SUM(B12:B16)", mustFormula: true, mustUse: "SUM", mustUseLabel: "SUM over B12:B16" },
            {
              custom: function (s) {
                var a = s.value("B10"), l = s.value("B17");
                return (typeof a === "number" && typeof l === "number" && a === l && a === 1950000) ? true : "The two totals must both equal " + R(1950000) + ".";
              },
              message: "The sheet ties: total assets = total equity & liabilities"
            }
          ],
          tie: { a: "B10", le: "B17", aLabel: "Total assets", leLabel: "Total equity & liabilities" },
          success: "TOTAL ASSETS = TOTAL EQUITY & LIABILITIES = " + R(1950000) + ". Your balance sheet ties. That green zero is the sound of every lesson so far agreeing with every other."
        }
      },
      { t: "where", h: "This statement <em>is</em> the destination — but two of its numbers arrived unexplained: PAT of " + R(180000) + " inside retained earnings, and cash of " + R(100000) + ". The next two modules build the statements that explain them: the income statement (1400) and the cash flow statement (1500)." },
      { t: "mcq", q: "Your first attempt doesn't tie: assets exceed equity & liabilities by exactly " + R(180000) + ". What did you most likely forget?", opts: ["Depreciation on the PP&E line", "Adding FY25 profit into retained earnings", "The security deposit", "The salaries payable"], correct: 1, why: ["Missing depreciation would make assets too <em>high</em> by " + R(440000) + " — the wrong amount. In tie-debugging, the size of the gap identifies the suspect.", "A gap of exactly PAT (" + R(180000) + ") is the classic signature of an unrolled retained earnings line: the profit's assets all arrived (cash, receivables, machines…) but the matching claim never got recorded. Professional modelers memorise this diagnostic — gap = PAT means check the RE bridge first. You'll use it again in the “Find the broken link” lesson.", "The deposit is " + R(100000) + " — the wrong size, and forgetting an asset would make assets too <em>low</em>.", "That's " + R(30000) + ", and missing a liability would push the gap the same direction but the wrong amount."] }
    ]
  };
})();
