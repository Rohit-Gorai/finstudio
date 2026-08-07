/* Module 1000 — Foundations */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr;

  LS.lessons["1010-five-buckets"] = {
    id: "1010-five-buckets", code: "1010", minutes: 4,
    title: "The five buckets every number falls into",
    short: "The five buckets",
    desc: "Assets, liabilities, equity, revenue and expenses — the five categories all of accounting sorts into, with a hands-on classification exercise.",
    lede: "Accounting looks huge. It isn't. Every number a business records lands in one of five buckets. Learn the buckets and the rest of this course is just plumbing between them.",
    body: [
      { t: "def", term: "Asset", h: "Something the business <strong>owns or controls</strong> that will bring future benefit — cash, an espresso machine, coffee beans, money customers owe you." },
      { t: "def", term: "Liability", h: "Something the business <strong>owes</strong> to outsiders — a bank loan, unpaid supplier bills, salaries not yet paid." },
      { t: "def", term: "Equity", h: "The <strong>owner's claim</strong> on the business: what would be left for the owner if you sold every asset and settled every liability. It grows when the business earns and keeps profit." },
      { t: "def", term: "Revenue & Expenses", h: "<strong>Revenue</strong> is what the business earns by selling; <strong>expenses</strong> are what it uses up to earn it. The difference — profit — flows into equity. They live on the income statement; the first three live on the balance sheet." },
      { t: "example", h: "<p>Priya opens <strong>Bombay Bean Coffee Co.</strong> in Mumbai on 1 April 2023. On day one she puts in " + R(1000000) + " of her own money and the bank lends the café " + R(600000) + ". The café buys an espresso machine, a delivery van and a sack of arabica. Every one of those facts is about to land in a bucket — and you'll follow this same café all the way to a full valuation model.</p>" },
      {
        t: "classify",
        tag: "Sort the café's world",
        intro: "Put each item in its bucket.",
        buckets: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
        items: [
          { text: "The " + R(400000) + " delivery van", bucket: "Asset", why: "The café controls it and it delivers coffee (benefit) for years." },
          { text: "The " + R(600000) + " bank loan", bucket: "Liability", why: "Owed to an outsider — the bank — regardless of how business goes." },
          { text: "Priya's " + R(1000000) + " investment", bucket: "Equity", why: "The owner's claim. It is not owed back on a schedule like a loan — it's the residual.", whyNot: { "Liability": "Close — but the café doesn't owe Priya on fixed terms like the bank. An owner's stake is the residual claim: equity." } },
          { text: "₹180 collected for a flat white", bucket: "Revenue", why: "Earned by selling — this is the top of the income statement." },
          { text: "This month's " + R(30000) + " shop rent", bucket: "Expense", why: "Used up this month to earn revenue; nothing owned afterwards.", whyNot: { "Asset": "Rent buys the month that just passed — no future benefit remains, so nothing is owned. That makes it an expense, not an asset." } },
          { text: "Unpaid bill from the coffee-bean roaster", bucket: "Liability", why: "Beans received, money not yet paid — owed to a supplier. Accountants call it a trade payable." },
          { text: "Money a catering client owes the café", bucket: "Asset", why: "A right to receive cash — a trade receivable. Odd but true: other people's debts to you are your asset." }
        ]
      },
      { t: "where", h: "The first three buckets — assets, liabilities, equity — become the <strong>balance sheet</strong>. The last two — revenue and expenses — become the <strong>income statement</strong>, whose profit lands back in equity. Every statement in this course is one of those two lists, sorted." },
      { t: "mcq", q: "A customer pays the café ₹500 in advance for tomorrow's office coffee run. Right now, that ₹500 is best described as…", opts: ["Revenue — cash came in", "A liability — the café owes the customer coffee", "Equity — it belongs to the business", "An expense — the coffee will cost money to make"], correct: 1, why: ["Cash came in, but nothing has been <em>earned</em> yet — the coffee hasn't been delivered. Until it is, the café owes the customer either coffee or a refund. That obligation is a liability (called deferred revenue). Revenue is recognised when you deliver, not when cash arrives — a theme you'll meet again in lesson 1410.", "Cash went up (asset), and an obligation to deliver went up (liability). Accountants call it deferred or unearned revenue. When the coffee is delivered tomorrow, the liability disappears and revenue is finally recognised.", "Equity is the owner's residual claim, and nothing has been earned for the owner yet — there's an obligation outstanding first.", "Costs will come later, but the question is about the ₹500 received. Received-but-unearned money is an obligation: a liability."] }
    ]
  };

  LS.lessons["1020-accounting-equation"] = {
    id: "1020-accounting-equation", code: "1020", minutes: 4,
    title: "The accounting equation",
    short: "The accounting equation",
    desc: "Assets = Liabilities + Equity. Why it always holds, and your first live spreadsheet formula.",
    lede: "One equation runs all of accounting. Everything a business owns was paid for by someone — either outsiders (liabilities) or the owner (equity). There is no third source of money.",
    body: [
      { t: "formula", title: "The equation", lines: ["<b>Assets</b> = Liabilities + Equity", "…rearranged, the form you'll use most:", "<b>Equity</b> = Assets − Liabilities"], note: "Equity is a residual — it's whatever is left. That's why it's calculated, never counted." },
      { t: "p", h: "This isn't a rule someone imposed; it's arithmetic. Every rupee of stuff (left side) came from somewhere (right side). Later, the balance-sheet capstone will test your whole model against this equation with a live tie meter — if the two sides differ by even one rupee, something in your logic is wrong." },
      { t: "example", h: "<p>One year in — 31 March 2024 — the café owns assets worth " + R(C.fy24.bs.totalAssets) + " (machines, van, beans, cash, and money customers owe it). It owes outsiders " + R(C.fy24.bs.loan + C.fy24.bs.payables + C.fy24.bs.accrued) + " (the bank loan and unpaid bills). Priya's stake must be exactly the difference — no counting required.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Compute Priya's equity",
          hint: "Click the empty cell and type a formula, starting with = . Cell references work like Excel: B2 means column B, row 2.",
          grid: [
            ["", { v: "31 Mar 2024", year: true }],
            ["Everything the café owns (assets)", C.fy24.bs.totalAssets],
            ["Everything the café owes (liabilities)", C.fy24.bs.loan + C.fy24.bs.payables + C.fy24.bs.accrued],
            ["Priya's equity", { input: true, mf: true, fmt: "inr", ph: "=…" }]
          ],
          checks: [
            { cell: "B4", expect: 1120000, message: "B4: equity = assets − liabilities", mustFormula: true }
          ],
          success: "Equity is " + R(1120000) + " — and you never had to count it, because the equation does it for you."
        }
      },
      { t: "where", h: "This equation <em>is</em> the balance sheet: assets on one side, liabilities and equity on the other, always equal. You'll build the café's full balance sheet in lesson 1330." },
      { t: "mcq", q: "During FY25 the café's assets grow by ₹2,00,000 while its liabilities fall by ₹50,000. What happened to equity?", opts: ["Up ₹1,50,000", "Up ₹2,50,000", "Down ₹50,000", "Can't tell from this"], correct: 1, why: ["Careful with the sign on liabilities: they <em>fell</em>, which pushes equity up, not down. Equity = assets − liabilities = +2,00,000 − (−50,000) = +2,50,000.", "Equity = assets − liabilities, so ΔEquity = ΔAssets − ΔLiabilities = 2,00,000 − (−50,000) = ₹2,50,000. More stuff, fewer debts — both changes belong to the owner.", "Liabilities falling is good news for the owner — it can't push equity down.", "You can tell — that's the power of the equation. Equity is fully determined by the other two."] }
    ]
  };

  LS.lessons["1030-two-sides"] = {
    id: "1030-two-sides", code: "1030", minutes: 5,
    title: "Every transaction has two sides",
    short: "Two sides of a transaction",
    desc: "Double-entry: why every business event changes at least two things, and why the accounting equation can never break.",
    lede: "Here's the trick that makes the equation unbreakable: every event changes at least two things, and the changes always cancel out across the equation. Accountants call this double-entry bookkeeping.",
    body: [
      { t: "def", term: "Double entry", h: "Recording both sides of every transaction. Money never appears or vanishes — it always moves <em>from</em> somewhere <em>to</em> somewhere. (The traditional names for the two sides are <strong>debit</strong> and <strong>credit</strong>; we'll use plain arrows in this course, but it's the same idea.)" },
      {
        t: "classify",
        tag: "Spot both sides",
        intro: "For each event in the café's first week, pick what changed.",
        buckets: ["Asset ↑ & Equity ↑", "Asset ↑ & Liability ↑", "Asset ↑ & Asset ↓", "Asset ↓ & Equity ↓"],
        items: [
          { text: "Priya invests " + R(1000000), bucket: "Asset ↑ & Equity ↑", why: "Cash (asset) up; owner's claim (equity) up. Both sides grow by the same amount — still balanced." },
          { text: "Bank lends the café " + R(600000), bucket: "Asset ↑ & Liability ↑", why: "Cash up, loan up. The café is bigger but not richer." },
          { text: "Buy the " + R(400000) + " van, paying from the bank account", bucket: "Asset ↑ & Asset ↓", why: "Van up, cash down. One asset swapped for another — the equation doesn't move at all.", whyNot: { "Asset ↓ & Equity ↓": "Buying an asset isn't a loss — the café traded cash for a van of equal value. Equity only falls when value is used up, not when it changes shape." } },
          { text: "Pay the first month's rent, " + R(30000), bucket: "Asset ↓ & Equity ↓", why: "Cash down, and nothing owned in exchange — the month has been consumed. That consumption is an expense, and expenses eat equity." }
        ]
      },
      { t: "p", h: "Now watch the equation survive all four events at once. In the sheet below, each row shows the <em>change</em> each event causes to assets, liabilities and equity. Fill in the missing changes as plain numbers (negative numbers get a minus sign), then total each column with a formula." },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The equation can't break",
          hint: "Rows 2–5 are the four events. Fill the two missing cells, then build the three totals with =SUM(…) and prove the equation holds in B8.",
          grid: [
            ["Event", "Δ Assets", "Δ Liabilities", "Δ Equity"],
            ["Priya invests", 1000000, 0, 1000000],
            ["Bank loan", 600000, 600000, 0],
            ["Buy the van with cash", { input: true, fmt: "inr", ph: "?" }, 0, 0],
            ["Pay rent", -30000, 0, { input: true, fmt: "inr", ph: "?" }],
            ["Total change", { input: true, mf: true, fmt: "inr", ph: "=SUM(…)" }, { input: true, mf: true, fmt: "inr", ph: "=SUM(…)" }, { input: true, mf: true, fmt: "inr", ph: "=SUM(…)" }],
            ["", null, null, null],
            ["Check: ΔA − (ΔL + ΔE)", { input: true, mf: true, fmt: "inr", ph: "=B6-…" }]
          ],
          checks: [
            { cell: "B4", expect: 0, message: "B4: net asset change when cash becomes a van", tol: 0 },
            { cell: "D5", expect: -30000, message: "D5: rent's effect on equity" },
            { cell: "B6", expect: 1570000, message: "B6: total asset change, using SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "C6", expect: 600000, message: "C6: total liability change, using SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "D6", expect: 970000, message: "D6: total equity change, using SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" },
            { cell: "B8", expect: 0, message: "B8: assets minus (liabilities + equity) — the tie", mustFormula: true, tol: 0 }
          ],
          success: "ΔAssets (₹15,70,000) = ΔLiabilities (₹6,00,000) + ΔEquity (₹9,70,000). Four messy events, one unbroken equation."
        }
      },
      { t: "where", h: "Each column total is a preview of a statement: asset and liability changes land on the <strong>balance sheet</strong>, and the equity change from trading (the rent) is what the <strong>income statement</strong> will explain, line by line." },
      { t: "mcq", q: "The café pays ₹50,000 of its bank loan back. What are the two sides?", opts: ["Asset ↓ and Expense ↑", "Asset ↓ and Liability ↓", "Liability ↓ and Equity ↓", "Asset ↓ and Equity ↓"], correct: 1, why: ["Repaying principal is not an expense — the café isn't consuming anything, it's settling a debt. (The <em>interest</em> on the loan is an expense; the principal is not. Lesson 1220 makes this precise.)", "Cash down, loan down, equation intact. Nothing was earned or consumed, so the income statement never hears about it — a distinction that matters enormously in the cash flow module.", "The bank's claim falls, but the owner's claim doesn't move — no value was created or consumed.", "Equity only moves when value is earned or consumed. Swapping cash to cancel a debt is neither."] }
    ]
  };

  LS.lessons["1040-three-statements"] = {
    id: "1040-three-statements", code: "1040", minutes: 4,
    title: "The three statements, one story",
    short: "The three statements",
    desc: "Balance sheet, income statement, cash flow statement — what question each answers and how they interlock.",
    lede: "Companies tell their story in three documents. Each answers one question, and each hands a number to the next. By module 2100 you'll wire all three together; here's the map.",
    body: [
      { t: "def", term: "Balance sheet", h: "<strong>What does the business own and owe right now?</strong> A snapshot at one instant — assets on one side, liabilities and equity on the other, always equal. Dated \"as at 31 March 2025\"." },
      { t: "def", term: "Income statement (P&L)", h: "<strong>Did the business earn a profit this period?</strong> Revenue minus expenses over a stretch of time — \"for the year ended 31 March 2025\". Its bottom line, profit after tax, flows into equity on the balance sheet." },
      { t: "def", term: "Cash flow statement", h: "<strong>Where did the cash actually go?</strong> Profit is an opinion about value earned; cash is a fact. This statement reconciles the two, and its bottom line must equal the cash on the balance sheet." },
      {
        t: "svg",
        h: '<svg viewBox="0 0 640 250" role="img" aria-label="Diagram: the income statement\'s profit flows into the balance sheet\'s equity, and the cash flow statement\'s closing cash flows into the balance sheet\'s cash" style="max-width:100%;height:auto"><style>.bx{fill:#fff;stroke:#DCD3BE;rx:8}.hd{font:600 14px Fraunces,serif;fill:#182530}.tx{font:12px "Public Sans",sans-serif;fill:#51606B}.ar{stroke:#1E6B4E;stroke-width:2;fill:none;marker-end:url(#ah)}.lb{font:600 11px "IBM Plex Mono",monospace;fill:#1E6B4E}</style><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#1E6B4E"/></marker></defs>' +
          '<rect class="bx" x="10" y="30" width="180" height="90" rx="8"/><text class="hd" x="100" y="55" text-anchor="middle">Income statement</text><text class="tx" x="100" y="75" text-anchor="middle">Revenue − expenses</text><text class="tx" x="100" y="93" text-anchor="middle">= Profit after tax</text>' +
          '<rect class="bx" x="10" y="150" width="180" height="90" rx="8"/><text class="hd" x="100" y="175" text-anchor="middle">Cash flow statement</text><text class="tx" x="100" y="195" text-anchor="middle">Opening cash ± flows</text><text class="tx" x="100" y="213" text-anchor="middle">= Closing cash</text>' +
          '<rect class="bx" x="440" y="80" width="190" height="120" rx="8"/><text class="hd" x="535" y="105" text-anchor="middle">Balance sheet</text><text class="tx" x="535" y="127" text-anchor="middle">Assets (incl. cash)</text><text class="tx" x="535" y="145" text-anchor="middle">= Liabilities</text><text class="tx" x="535" y="163" text-anchor="middle">+ Equity (incl. retained</text><text class="tx" x="535" y="181" text-anchor="middle">earnings)</text>' +
          '<path class="ar" d="M195 75 C 320 75, 360 110, 435 118"/><text class="lb" x="300" y="66">PAT → retained earnings</text>' +
          '<path class="ar" d="M195 195 C 320 195, 360 145, 435 132"/><text class="lb" x="300" y="222">closing cash → cash</text></svg>',
        caption: "The two bridges you'll build by hand in module 2100 (plus a third, depreciation, that links the P&L to PP&E)."
      },
      { t: "example", h: "<p>For FY25, the café's income statement will show " + R(C.fy25.pl.pat) + " of profit after tax, its cash flow statement will end at " + R(C.fy25.cf.closingCash) + " of closing cash, and its balance sheet will carry both numbers — profit inside retained earnings, cash as the first asset a banker checks. Three statements, one café, zero contradictions.</p>" },
      {
        t: "classify",
        tag: "Which statement does it live on?",
        intro: "A line item walks into the room. Which statement is home?",
        buckets: ["Balance sheet", "Income statement", "Cash flow statement"],
        items: [
          { text: "The bank loan balance of " + R(C.fy25.bs.loan), bucket: "Balance sheet", why: "A thing owed at an instant — snapshot territory." },
          { text: "Baristas' salaries for the year", bucket: "Income statement", why: "An expense consumed over the period, matched against the revenue it helped earn." },
          { text: "Cash paid to buy the new espresso machine", bucket: "Cash flow statement", why: "A movement of cash (investing). The machine itself sits on the balance sheet; the P&L only sees it gradually, as depreciation.", whyNot: { "Income statement": "Buying a machine isn't an expense in the year of purchase — the café still owns the machine. The P&L feels it slowly as depreciation (lesson 1120); the cash leaving shows up here, on the cash flow statement." } },
          { text: "Coffee sales of " + R(C.fy25.pl.revenue), bucket: "Income statement", why: "Revenue earned over the year — the P&L's opening line." },
          { text: "Cash of " + R(C.fy25.bs.cash) + " on 31 March 2025", bucket: "Balance sheet", why: "A snapshot balance — and the number the cash flow statement must arrive at. Same rupees, two statements agreeing." }
        ]
      },
      { t: "where", h: "Each statement hands a number to the <strong>balance sheet</strong>: the income statement's profit after tax lands in retained earnings, and the cash flow statement's closing cash lands in cash. Those two crossings — plus depreciation — are the three bridges you'll wire together in module 2100." },
      { t: "mcq", q: "Why is the balance sheet dated \"as at\" a single day, while the other two say \"for the year ended\"?", opts: ["Tradition from paper ledgers", "The balance sheet is a snapshot of stocks; the other two measure flows over time", "Because the balance sheet is prepared last", "Auditors require it"], correct: 1, why: ["The phrasing is old, but it encodes something real about what's being measured.", "Assets and liabilities are <em>stocks</em> — amounts that exist at an instant, like water in a tank. Revenue, expenses and cash flows are <em>flows</em> — amounts per period, like water through a pipe. Mixing up stocks and flows is the single most common beginner error in modeling, so the statements label themselves clearly.", "Preparation order doesn't drive the dating — the nature of the measurement does.", "Auditors check the convention, but the reason is conceptual: stocks at an instant vs flows over a period."] }
    ]
  };
})();
