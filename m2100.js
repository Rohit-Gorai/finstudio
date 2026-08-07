/* Module 2100 — Linking the three statements */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr;
  var y24 = C.fy24, y25 = C.fy25, y26 = C.fy26;

  // FY-by-FY working capital cash effect, used by the linked model
  function wc(cf) { return cf.dAR + cf.dInv + cf.dAP + cf.dAccr; }

  LS.lessons["2110-three-bridges"] = {
    id: "2110-three-bridges", code: "2110", minutes: 5,
    title: "The three bridges",
    short: "The three bridges",
    desc: "PAT → retained earnings, depreciation → PP&E, closing cash → balance sheet: the three links that turn three statements into one model.",
    lede: "You've built all three statements separately. They're not really separate — three specific numbers cross between them, and those crossings are what make a financial model a model rather than three spreadsheets.",
    body: [
      { t: "p", h: "Every linked model in every investment bank rests on these three bridges. Once they're wired, changing a single assumption ripples correctly through all three statements — and the balance sheet still ties. Break one and it doesn't." },
      {
        t: "svg",
        h: '<svg viewBox="0 0 660 330" role="img" aria-label="Diagram of the three bridges: profit after tax flows to retained earnings, depreciation flows to accumulated depreciation reducing PP and E, and closing cash flows to the cash line of the balance sheet" style="max-width:100%;height:auto">' +
          '<style>.bx{fill:#fff;stroke:#DCD3BE;stroke-width:1}.hd{font:600 14px Fraunces,Georgia,serif;fill:#182530}.tx{font:12px "Public Sans",sans-serif;fill:#51606B}.ar{stroke:#1E6B4E;stroke-width:2.2;fill:none;marker-end:url(#a2)}.lb{font:600 11px "IBM Plex Mono",monospace;fill:#1E6B4E}.num{font:600 11px "IBM Plex Mono",monospace;fill:#182530}.bn{font:700 10px "Public Sans",sans-serif;fill:#B23A2F}</style>' +
          '<defs><marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#1E6B4E"/></marker></defs>' +
          // income statement
          '<rect class="bx" x="8" y="14" width="200" height="86" rx="8"/>' +
          '<text class="hd" x="108" y="38" text-anchor="middle">Income statement</text>' +
          '<text class="tx" x="20" y="60">Revenue − costs</text>' +
          '<text class="tx" x="20" y="78">Depreciation</text><text class="num" x="196" y="78" text-anchor="end">' + R(y25.pl.dep) + '</text>' +
          '<text class="tx" x="20" y="95">Profit after tax</text><text class="num" x="196" y="95" text-anchor="end">' + R(y25.pl.pat) + '</text>' +
          // cash flow
          '<rect class="bx" x="8" y="196" width="200" height="104" rx="8"/>' +
          '<text class="hd" x="108" y="220" text-anchor="middle">Cash flow statement</text>' +
          '<text class="tx" x="20" y="242">Starts at PAT</text>' +
          '<text class="tx" x="20" y="260">Adds back depreciation</text>' +
          '<text class="tx" x="20" y="278">± investing, financing</text>' +
          '<text class="tx" x="20" y="295">Closing cash</text><text class="num" x="196" y="295" text-anchor="end">' + R(y25.bs.cash) + '</text>' +
          // balance sheet
          '<rect class="bx" x="424" y="60" width="228" height="204" rx="8"/>' +
          '<text class="hd" x="538" y="84" text-anchor="middle">Balance sheet</text>' +
          '<text class="tx" x="436" y="108">PP&amp;E, net</text><text class="num" x="640" y="108" text-anchor="end">' + R(y25.bs.ppeNet) + '</text>' +
          '<text class="tx" x="436" y="128">Inventory + receivables</text>' +
          '<text class="tx" x="436" y="148">Cash</text><text class="num" x="640" y="148" text-anchor="end">' + R(y25.bs.cash) + '</text>' +
          '<line x1="436" y1="162" x2="640" y2="162" stroke="#DCD3BE"/>' +
          '<text class="tx" x="436" y="182">Share capital</text>' +
          '<text class="tx" x="436" y="202">Retained earnings</text><text class="num" x="640" y="202" text-anchor="end">' + R(y25.bs.retained) + '</text>' +
          '<text class="tx" x="436" y="222">Loan + payables</text>' +
          '<text class="tx" x="436" y="248" style="font-weight:600">Assets = L + E ✓</text>' +
          // bridges
          '<path class="ar" d="M212 92 C 300 92, 330 190, 420 200"/>' +
          '<text class="lb" x="238" y="128">bridge 1</text><text class="tx" x="238" y="144" style="font-size:11px">PAT → retained earnings</text>' +
          '<path class="ar" d="M212 74 C 320 40, 340 70, 420 104"/>' +
          '<text class="lb" x="250" y="36">bridge 2</text><text class="tx" x="250" y="52" style="font-size:11px">depreciation → PP&amp;E</text>' +
          '<path class="ar" d="M212 288 C 330 288, 350 180, 420 152"/>' +
          '<text class="lb" x="244" y="284">bridge 3</text><text class="tx" x="244" y="300" style="font-size:11px">closing cash → cash</text>' +
          '</svg>',
        caption: "Three numbers cross between statements. Everything else is arithmetic within a single statement."
      },
      { t: "formula", title: "The three bridges, as formulas", lines: [
        "<b>1.</b> Closing retained earnings = Opening RE + PAT − Dividends",
        "<b>2.</b> Closing PP&amp;E, net       = Opening PP&amp;E + Capex − Depreciation",
        "<b>3.</b> Closing cash             = Opening cash + CFO + CFI + CFF"
      ], note: "Each is a roll-forward: opening + increases − decreases = closing. You've built all three already — in lessons 1320, 1530 and 1550. Module 2100 just puts them in one sheet." },
      { t: "example", h: "<p>Watch bridge 2 in FY25: PP&E opened at " + R(y24.bs.ppeNet) + ", the café spent " + R(240000) + " on a second machine, and charged " + R(y25.pl.dep) + " of depreciation. Closing: " + R(y25.bs.ppeNet) + " — unchanged, because capex exactly replaced what wore out. The depreciation figure appears on the P&L <em>and</em> reduces this balance <em>and</em> is added back on the cash flow statement. One number, three jobs.</p>" },
      {
        t: "classify",
        tag: "Which bridge?",
        intro: "Each number below crosses between statements. Which bridge carries it?",
        buckets: ["Bridge 1: PAT → RE", "Bridge 2: dep → PP&E", "Bridge 3: cash → cash"],
        items: [
          { text: "The " + R(y25.pl.pat) + " that grew equity", bucket: "Bridge 1: PAT → RE", why: "The income statement's bottom line landing in the balance sheet's retained earnings." },
          { text: "The " + R(y25.pl.dep) + " charge reducing net PP&E", bucket: "Bridge 2: dep → PP&E", why: "A P&L expense that also shrinks a balance sheet asset — and gets added back in the cash flow statement." },
          { text: "The " + R(y25.bs.cash) + " the cash flow statement ends on", bucket: "Bridge 3: cash → cash", why: "The cash flow statement's final line is the balance sheet's cash line. Same rupees, two statements." },
          { text: "The " + R(y25.dividend) + " dividend paid to Priya", bucket: "Bridge 1: PAT → RE", why: "It's the '− dividends' term in the retained earnings roll-forward (and a financing outflow on the cash flow statement).", whyNot: { "Bridge 3: cash → cash": "It does consume cash — but as an <em>input</em> to the cash flow statement, not the bridge itself. Its balance-sheet crossing is into retained earnings, which it reduces." } }
        ]
      },
      { t: "where", h: "These bridges are why a change anywhere ripples everywhere. Sell one more coffee and PAT rises → retained earnings rise → and cash rises by the same amount through the cash flow statement, so the balance sheet still ties. That self-correcting property is what you'll build next." },
      { t: "mcq", q: "In a linked model you increase depreciation by ₹10,000 (ignore tax). What happens to the balance sheet?", opts: ["Nothing — depreciation is non-cash", "PP&E falls ₹10,000 and retained earnings falls ₹10,000 — it still ties", "Total assets fall ₹10,000 and the sheet no longer ties", "Cash falls ₹10,000"], correct: 1, why: ["It's non-cash, but it is very much a balance sheet event — the asset really does shrink.", "Two bridges move together. Bridge 2: PP&E drops ₹10,000. Bridge 1: PAT is ₹10,000 lower, so retained earnings drop ₹10,000. Assets −10,000, equity −10,000 — the sheet still ties. Meanwhile bridge 3 shows cash unchanged, because the cash flow statement's add-back exactly offsets the lower PAT. This is the self-correcting behaviour a correctly linked model always shows.", "Assets do fall, but so does equity by the same amount — if your model breaks the tie here, bridge 1 is missing.", "Cash is the one thing that doesn't move: lower PAT, larger add-back, net zero."] }
    ]
  };

  LS.lessons["2120-linked-model"] = {
    id: "2120-linked-model", code: "2120", minutes: 8,
    title: "Build a linked three-year model",
    short: "★ The linked model",
    desc: "Wire all three bridges across FY24–FY26 so the balance sheet ties in every single year.",
    lede: "The real thing. Three years side by side, every balance-sheet line either given or rolled forward by formula. The tie meter now checks all three years at once — and it must read \"ties\" for every one of them.",
    body: [
      { t: "p", h: "Working capital and the P&L are given here so you can concentrate on the bridges. You build fourteen cells: the two FY24 totals, then for FY25 and FY26 the four rolled lines (PP&E, cash, retained earnings, loan) and the two totals. Build the FY25 column first, then use <strong>Copy formula right →</strong> to push each formula into FY26 — the column letters shift automatically, exactly as fill-right does in Excel." },
      { t: "formula", title: "The four rolled lines", lines: [
        "PP&amp;E, net       = prior year PP&amp;E + capex − depreciation",
        "Retained earnings = prior year RE + PAT − dividend",
        "Term loan         = prior year loan − repayment",
        "Cash              = prior cash + PAT + depreciation",
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ working-capital effect − capex − dividend − repayment"
      ], note: "The cash line is just CFO + CFI + CFF written out: PAT and depreciation and working capital are operating; capex is investing; dividend and repayment are financing." },
      { t: "example", h: "<p>FY24 and FY25 you know. FY26 is a projection: revenue grows 15%, margins hold, capex again matches depreciation. Its PAT of " + R(Math.round(y26.pl.pat)) + " is the awkward-looking number that a real model produces — and it must still tie.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Bombay Bean Coffee Co. — linked model, FY24 to FY26",
          hint: "Build B17 and B23 (the FY24 totals) first, then the FY25 column: C12 (PP&E), C16 (cash), C20 (retained earnings), C21 (loan), C17 and C23 (totals). Then select each and copy it right into FY26.",
          grid: [
            ["", { v: "FY24", year: true }, { v: "FY25", year: true }, { v: "FY26", year: true }],
            ["FLOWS (given)", null, null, null],
            ["Profit after tax", y24.pl.pat, y25.pl.pat, Math.round(y26.pl.pat)],
            ["Depreciation", y24.pl.dep, y25.pl.dep, Math.round(y26.pl.dep)],
            ["Capex", 1600000, 240000, 240000],
            ["Working capital cash effect", wc(y24.cf), wc(y25.cf), Math.round(wc(y26.cf))],
            ["Dividend paid", 0, y25.dividend, 50000],
            ["Loan principal repaid", 0, 50000, 50000],
            ["Loan drawn down", 600000, 0, 0],
            ["Share capital issued", 1000000, 0, 0],
            ["ASSETS", null, null, null],
            ["PP&E, net", y24.bs.ppeNet, { input: true, mf: true, fmt: "inr", ph: "=B12+C5-C4" }, { input: true, mf: true, fmt: "inr" }],
            ["Security deposit", y24.bs.deposit, y25.bs.deposit, Math.round(y26.bs.deposit)],
            ["Inventory", y24.bs.inventory, y25.bs.inventory, Math.round(y26.bs.inventory)],
            ["Trade receivables", y24.bs.receivables, y25.bs.receivables, Math.round(y26.bs.receivables)],
            ["Cash", y24.bs.cash, { input: true, mf: true, fmt: "inr", ph: "=B16+C3+C4+C6-C5-C7-C8" }, { input: true, mf: true, fmt: "inr" }],
            ["TOTAL ASSETS", { input: true, mf: true, fmt: "inr", ph: "=SUM(B12:B16)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }],
            ["EQUITY & LIABILITIES", null, null, null],
            ["Share capital", y24.bs.capital, y25.bs.capital, Math.round(y26.bs.capital)],
            ["Retained earnings", y24.bs.retained, { input: true, mf: true, fmt: "inr", ph: "=B20+C3-C7" }, { input: true, mf: true, fmt: "inr" }],
            ["Term loan", y24.bs.loan, { input: true, mf: true, fmt: "inr", ph: "=B21-C8" }, { input: true, mf: true, fmt: "inr" }],
            ["Trade payables", y24.bs.payables, y25.bs.payables, Math.round(y26.bs.payables)],
            ["Accrued expenses", y24.bs.accrued, y25.bs.accrued, Math.round(y26.bs.accrued)],
            ["TOTAL EQUITY & LIABILITIES", { input: true, mf: true, fmt: "inr", ph: "=SUM(B19:B23)" }, { input: true, mf: true, fmt: "inr" }, { input: true, mf: true, fmt: "inr" }]
          ],
          checks: [
            { cell: "B17", expect: 1840000, message: "B17: FY24 total assets", mustFormula: true },
            { cell: "B24", expect: 1840000, message: "B24: FY24 total equity & liabilities", mustFormula: true },
            { cell: "C12", expect: 1400000, message: "C12: FY25 PP&E — bridge 2", mustFormula: true },
            { cell: "C16", expect: 100000, message: "C16: FY25 cash — bridge 3", mustFormula: true },
            { cell: "C20", expect: 250000, message: "C20: FY25 retained earnings — bridge 1", mustFormula: true },
            { cell: "C21", expect: 550000, message: "C21: FY25 term loan", mustFormula: true },
            { cell: "C17", expect: 1950000, message: "C17: FY25 total assets", mustFormula: true },
            { cell: "C24", expect: 1950000, message: "C24: FY25 total equity & liabilities", mustFormula: true },
            { cell: "D12", expect: 1400000, message: "D12: FY26 PP&E", mustFormula: true },
            { cell: "D16", expect: 248250, message: "D16: FY26 cash", mustFormula: true },
            { cell: "D20", expect: 482750, message: "D20: FY26 retained earnings", mustFormula: true },
            { cell: "D21", expect: 500000, message: "D21: FY26 term loan", mustFormula: true },
            { cell: "D17", expect: 2150750, message: "D17: FY26 total assets", mustFormula: true },
            { cell: "D24", expect: 2150750, message: "D24: FY26 total equity & liabilities", mustFormula: true },
            {
              custom: function (s) {
                var yrs = [["FY24", "B17", "B24"], ["FY25", "C17", "C24"], ["FY26", "D17", "D24"]];
                var bad = yrs.filter(function (y) {
                  var a = s.value(y[1]), l = s.value(y[2]);
                  return !(typeof a === "number" && typeof l === "number" && Math.abs(a - l) < 1);
                });
                return bad.length === 0 ? true : bad.map(function (y) { return y[0]; }).join(" and ") + " does not tie yet.";
              },
              message: "All three years tie"
            }
          ],
          tie: { pairs: [{ a: "B17", le: "B24", label: "FY24" }, { a: "C17", le: "C24", label: "FY25" }, { a: "D17", le: "D24", label: "FY26" }] },
          success: "Three years, three bridges, zero difference in every one. This is a working financial model — change any flow in rows 3–10 and every year still ties."
        }
      },
      { t: "note", h: "<strong>Try it:</strong> change FY26 depreciation in D4 to " + R(300000) + " and watch. PP&E falls, retained earnings falls by the same amount, cash doesn't move — and FY26 still ties. If a model doesn't behave that way, a bridge is broken. That's the next lesson." },
      { t: "where", h: "This is the skeleton of every three-statement model in professional finance. Module 2200 adds the missing front end: instead of typing PAT for each year, you'll <em>drive</em> it from assumptions about growth and margin, and let the model compute everything downstream." },
      { t: "mcq", q: "In your model, why does FY26 cash depend on FY25 cash rather than being computed from scratch?", opts: ["Convenience — it saves typing", "Because cash is a balance that carries over; the statement only ever explains the change", "Because Excel requires it", "It doesn't — either method works identically"], correct: 1, why: ["It does save typing, but the reason is conceptual, not practical.", "Cash is a <em>stock</em> — it persists. The cash flow statement measures a <em>flow</em>, the change during the year. Closing = opening + change is the only way to connect them, which is exactly the stocks-vs-flows distinction from lesson 1040. Every balance sheet line in this model rolls forward the same way; only the flows are computed fresh each year.", "The spreadsheet doesn't care; the accounting does.", "Computing cash from scratch each year would mean re-deriving every transaction since the café opened — and it would silently lose any opening balance."] }
    ]
  };

  LS.lessons["2130-broken-link"] = {
    id: "2130-broken-link", code: "2130", minutes: 6,
    title: "Debug it: find the broken link",
    short: "Find the broken link",
    desc: "A model that doesn't tie, one wrong formula, and the diagnostic technique professionals use to find it fast.",
    lede: "Every modeler's real job is this: the balance sheet is out by some amount, and you have to find out why. There's a technique, and it beats hunting randomly every time.",
    body: [
      { t: "def", term: "The size-of-the-gap technique", h: "Don't scan formulas. <strong>Read the difference.</strong> The amount by which a balance sheet fails to tie almost always equals the number that was mishandled — so identify the gap, find the line item of that exact size, and check its formula first." },
      { t: "formula", title: "Common gaps and their usual cause", lines: [
        "Gap = PAT                → retained earnings missing the profit",
        "Gap = dividend           → retained earnings missing the dividend",
        "Gap = depreciation       → PP&amp;E or the cash add-back is wrong",
        "Gap = capex              → PP&amp;E or investing cash flow is wrong",
        "Gap = loan repayment     → the loan roll-forward or financing is wrong",
        "Gap = 2 × something      → the item was added where it should be subtracted"
      ], note: "That last one catches the most people. Getting a sign backwards moves the total by twice the amount, not once — so a gap of exactly double a line item means a flipped sign, not a missing number." },
      { t: "example", h: "<p>Below is the café's FY25 model, already built — and broken. Someone wired one of the four rolled lines wrongly. The FY24 column is correct and ties; FY25 does not. Read the gap before you read the formulas.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Broken model — FY25 does not tie",
          hint: "Look at the tie meter first and note the size of the difference. Find the flow in rows 3–8 that matches it. Then check the FY25 formula that should be using it — click a cell to see its formula in the bar above.",
          grid: [
            ["", { v: "FY24", year: true }, { v: "FY25", year: true }],
            ["FLOWS", null, null],
            ["Profit after tax", y24.pl.pat, y25.pl.pat],
            ["Depreciation", y24.pl.dep, y25.pl.dep],
            ["Capex", 1600000, 240000],
            ["Working capital cash effect", wc(y24.cf), wc(y25.cf)],
            ["Dividend paid", 0, y25.dividend],
            ["Loan principal repaid", 0, 50000],
            ["ASSETS", null, null],
            ["PP&E, net", y24.bs.ppeNet, { v: "=B10+C5-C4", input: true, mf: true, fmt: "inr" }],
            ["Security deposit", y24.bs.deposit, y25.bs.deposit],
            ["Inventory", y24.bs.inventory, y25.bs.inventory],
            ["Trade receivables", y24.bs.receivables, y25.bs.receivables],
            ["Cash", y24.bs.cash, { v: "=B14+C3+C4+C6-C5-C7-C8", input: true, mf: true, fmt: "inr" }],
            ["TOTAL ASSETS", { v: "=SUM(B10:B14)", input: true, mf: true, fmt: "inr" }, { v: "=SUM(C10:C14)", input: true, mf: true, fmt: "inr" }],
            ["EQUITY & LIABILITIES", null, null],
            ["Share capital", y24.bs.capital, y25.bs.capital],
            ["Retained earnings", y24.bs.retained, { v: "=B18+C3", input: true, mf: true, fmt: "inr" }],
            ["Term loan", y24.bs.loan, { v: "=B19-C8", input: true, mf: true, fmt: "inr" }],
            ["Trade payables", y24.bs.payables, y25.bs.payables],
            ["Accrued expenses", y24.bs.accrued, y25.bs.accrued],
            ["TOTAL EQUITY & LIABILITIES", { v: "=SUM(B17:B21)", input: true, mf: true, fmt: "inr" }, { v: "=SUM(C17:C21)", input: true, mf: true, fmt: "inr" }]
          ],
          checks: [
            { cell: "C18", expect: 250000, message: "C18: retained earnings — opening + PAT − dividend", mustFormula: true, mustUse: /C7/, mustUseLabel: "the dividend in C7" },
            { cell: "C14", expect: 100000, message: "C14: FY25 cash still correct at ₹1,00,000", mustFormula: true },
            { cell: "C10", expect: 1400000, message: "C10: FY25 PP&E still correct at ₹14,00,000", mustFormula: true },
            {
              custom: function (s) {
                var a = s.value("C15"), l = s.value("C22");
                if (typeof a !== "number" || typeof l !== "number") return "The FY25 totals aren't computing.";
                return Math.abs(a - l) < 1 ? true : "FY25 is still out by " + R(Math.abs(a - l)) + ".";
              },
              message: "FY25 now ties"
            }
          ],
          tie: { pairs: [{ a: "B15", le: "B22", label: "FY24" }, { a: "C15", le: "C22", label: "FY25" }] },
          success: "Fixed. The gap was ₹50,000 — the dividend — and retained earnings was the only line that should have used it. Gap size named the culprit before you read a single formula."
        }
      },
      { t: "note", h: "<strong>Why this happens so often in real models:</strong> the dividend is the one flow that touches retained earnings but is easy to forget, because it never appears on the income statement. Anything that bypasses the P&L — dividends, share issues, loan principal — is where broken links cluster." },
      { t: "where", h: "This is the everyday reality of working with the <strong>balance sheet</strong>: it's not just a report, it's a permanent audit of your own logic. A model that ties in every year is a model whose flows are all accounted for — which is why the tie is the first thing anyone checks." },
      { t: "mcq", q: "A model is out by exactly ₹4,80,000, and capex for the year was ₹2,40,000. What's the most likely error?", opts: ["Capex was omitted from PP&E", "Capex was added to PP&E where it should have been subtracted, or vice versa — a sign flip", "Depreciation was doubled", "Two separate errors of ₹2,40,000"], correct: 1, why: ["Omitting it entirely would leave a gap of ₹2,40,000, not double that.", "A gap of exactly twice a line item is the signature of a flipped sign. Adding ₹2,40,000 where you should subtract it moves the total by ₹4,80,000 — the ₹2,40,000 you wrongly added plus the ₹2,40,000 you failed to subtract. Check the sign before you go looking for two coincidental errors.", "Possible in principle, but only if depreciation happened to equal capex — and a sign flip is far more common than a duplicated line.", "Two independent errors of exactly the same size is a much less likely explanation than one sign flip."] }
    ]
  };
})();
