/* Module 1200 — Liabilities */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};
  var C = LS.C, R = LS.fmt.inr;

  LS.lessons["1210-payables"] = {
    id: "1210-payables", code: "1210", minutes: 4,
    title: "Trade payables & accrued expenses",
    short: "Payables & accruals",
    desc: "Supplier credit and accrued expenses: liabilities that arise from operating, not borrowing.",
    lede: "Not all debts come from banks. The moment the roaster delivers beans you haven't paid for, or March ends with salaries payable in April, the café owes money. These operating debts are free financing — and they have their own lines.",
    body: [
      { t: "def", term: "Trade payables", h: "Amounts owed to suppliers for goods or services already received — the mirror image of trade receivables. Also called accounts payable or creditors. A <strong>current liability</strong>: typically due in 30–60 days." },
      { t: "def", term: "Accrued expenses", h: "Costs that <strong>belong to this period but haven't been billed or paid yet</strong> — March salaries paid on 5 April, or electricity used but not yet invoiced. The expense is recognized now; the cash goes later; the gap is a liability." },
      { t: "formula", title: "Same roll-forward, other side", lines: ["Closing payables = Opening + Credit purchases − Payments made"], note: "Identical mechanics to receivables in 1140 — every balance rolls forward as opening + in − out." },
      { t: "example", h: "<p>The café's roaster gives 45-day terms. At 31 March 2025 the café owes suppliers " + R(C.fy25.bs.payables) + ", and its baristas' March salaries of " + R(C.fy25.bs.accrued) + " will be paid on 5 April. Both amounts are FY25 costs on the P&L — but at year-end the cash hasn't left, so both sit on the balance sheet as current liabilities.</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "What did the café pay suppliers in FY25?",
          hint: "You found purchases (" + R(870000) + ") in lesson 1130. Roll payables forward to find the cash that actually went out: payments = opening + purchases − closing.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Opening trade payables", C.fy24.bs.payables],
            ["Purchases on credit", 870000],
            ["Closing trade payables", C.fy25.bs.payables],
            ["Cash paid to suppliers", { input: true, mf: true, fmt: "inr", ph: "=…" }]
          ],
          checks: [
            { cell: "B5", expect: 850000, message: "B5: payments = opening + purchases − closing", mustFormula: true }
          ],
          success: "Paid " + R(850000) + " against " + R(870000) + " purchased. The unpaid " + R(20000) + " is cash the café got to keep a little longer — supplier credit is a quiet, interest-free loan."
        }
      },
      { t: "where", h: "Trade payables and accrued expenses sit under <strong>current liabilities on the balance sheet</strong>. The expenses they relate to are already on the <strong>income statement</strong>. The timing gap between the two is a working-capital delta the <strong>cash flow statement</strong> adjusts for in lesson 1520." },
      { t: "mcq", q: "The café receives ₹60,000 of beans on 45-day credit. The immediate effect is…", opts: ["Expense up ₹60,000, cash down ₹60,000", "Inventory up ₹60,000, payables up ₹60,000", "Inventory up ₹60,000, cash down ₹60,000", "Nothing is recorded until payment"], correct: 1, why: ["No cash has moved, and no expense exists yet — the beans are still an asset on the shelf.", "An asset arrives (inventory ↑) and an obligation arrives with it (payables ↑). The equation grows on both sides. No expense until the beans are consumed; no cash movement until day 45. Three different events, three different dates — accrual accounting keeps them straight.", "Cash is untouched for 45 days — that's the whole point of credit terms.", "Accounting records the obligation the moment goods change hands. Waiting for payment would let a business hide its debts."] }
    ]
  };

  LS.lessons["1220-borrowings"] = {
    id: "1220-borrowings", code: "1220", minutes: 4,
    title: "Borrowings & interest",
    short: "Borrowings",
    desc: "Term loans: principal vs interest, why only interest is an expense, and computing both from the loan balance.",
    lede: "The bank gave the café ₹6,00,000 and wants two different streams back: interest (the rent on money — an expense) and principal (the money itself — never an expense). Confusing the two is the classic beginner mistake.",
    body: [
      { t: "def", term: "Borrowings", h: "Money owed to lenders on fixed terms — amount, interest rate, repayment schedule. The café's term loan is <strong>non-current</strong> (repayable over years). A working-capital overdraft would be current." },
      { t: "def", term: "Interest vs principal", h: "<strong>Interest</strong> is the cost of using the bank's money for a year — an expense on the P&L. <strong>Principal repayment</strong> just returns the borrowed money — it shrinks the liability and the cash, and the P&L never sees it." },
      { t: "formula", title: "This course's simple interest convention", lines: ["Interest expense = Rate × Opening loan balance", "FY25: 10% × " + R(C.fy24.bs.loan) + " = <b>" + R(C.fy25.pl.interest) + "</b>"], note: "Real loans charge on the reducing monthly balance; annual-opening-balance is the standard simplification in teaching models and keeps every number in this course reproducible by hand." },
      { t: "example", h: "<p>The café borrowed " + R(600000) + " at 10% on day one. FY24 was interest-only; from FY25 it also repays " + R(50000) + " of principal each year. So FY25: interest of " + R(60000) + " (an expense), principal repayment of " + R(50000) + " (not an expense), closing balance " + R(C.fy25.bs.loan) + ".</p>" },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "The FY25 loan account",
          hint: "Interest = rate × opening balance (multiply cells — B3*B2, or use 10% directly). Closing = opening − repayment. Note interest does NOT reduce the loan balance — it's paid separately.",
          grid: [
            ["", { v: "FY25", year: true }],
            ["Opening loan balance", C.fy24.bs.loan],
            ["Interest rate", { v: 0.10, fmt: "pct" }],
            ["Interest for the year", { input: true, mf: true, fmt: "inr", ph: "=B3*B2" }],
            ["Principal repaid", 50000],
            ["Closing loan balance", { input: true, mf: true, fmt: "inr", ph: "=…" }]
          ],
          checks: [
            { cell: "B4", expect: 60000, message: "B4: interest = rate × opening balance", mustFormula: true },
            { cell: "B6", expect: 550000, message: "B6: closing = opening − principal repaid", mustFormula: true }
          ],
          success: "Interest " + R(60000) + " to the P&L; balance steps down to " + R(550000) + ". Two payments to the same bank, two totally different accounting fates."
        }
      },
      { t: "note", h: "<strong>One simplification to flag:</strong> a real balance sheet would split the " + R(50000) + " due within the next year out of the loan as a <em>current</em> liability (\"current maturities of long-term debt\"). We keep the loan as a single non-current line so the model stays small — remember the refinement exists." },
      { t: "where", h: "Interest expense sits low on the <strong>income statement</strong>, after operating profit (lesson 1450). The loan balance is a liability on the <strong>balance sheet</strong>. Drawdowns and repayments of principal appear only in the <strong>cash flow statement</strong>, under financing (lesson 1540)." },
      { t: "mcq", q: "In FY25 the café pays the bank " + R(110000) + " in total (" + R(60000) + " interest + " + R(50000) + " principal). How much of that reduces FY25 profit?", opts: [R(110000), R(60000), R(50000), "Nothing — loan payments never touch profit"], correct: 1, why: ["Only part of the payment is a cost of doing business. The principal portion is returning borrowed money — the café's obligation shrinks by exactly what it pays, so nothing is consumed.", "Only the interest — the price of using the bank's money for the year — is an expense. The " + R(50000) + " principal repayment swaps cash for a smaller debt: assets down, liabilities down, equity untouched. Lenders read this split closely: a business can afford its interest and still choke on principal repayments.", "That's the principal — the part that is <em>not</em> an expense.", "Interest genuinely is an expense — money paid for a service (the use of capital) that's fully consumed each year."] }
    ]
  };

  LS.lessons["1230-right-hand-side"] = {
    id: "1230-right-hand-side", code: "1230", minutes: 4,
    title: "Assembling the right-hand side",
    short: "The right-hand side",
    desc: "Classify every claim on the café — current liabilities, non-current liabilities, equity — and total what outsiders are owed.",
    lede: "You now know every claim on the café: suppliers, employees, the bank, and Priya herself. Before building the full balance sheet, sort them — because the balance sheet is exactly this sorting, done neatly.",
    body: [
      { t: "def", term: "The right-hand side", h: "Everything the balance sheet's assets are <em>financed by</em>: liabilities (outsiders' claims, ranked by due date) and equity (the owner's residual claim, which has no due date at all)." },
      {
        t: "classify",
        tag: "Sort every claim",
        intro: "Current liability, non-current liability, or equity — as at 31 March 2025?",
        buckets: ["Current liability", "Non-current liability", "Equity"],
        items: [
          { text: "Trade payables, " + R(C.fy25.bs.payables), bucket: "Current liability", why: "Due to the roaster within 45 days." },
          { text: "March salaries payable, " + R(C.fy25.bs.accrued), bucket: "Current liability", why: "Due on 5 April — about as current as it gets." },
          { text: "Bank term loan, " + R(C.fy25.bs.loan), bucket: "Non-current liability", why: "Repayable over several years (we keep it whole; see the 1220 note about current maturities)." },
          { text: "Priya's share capital, " + R(C.fy25.bs.capital), bucket: "Equity", why: "The owner's stake — never 'due'. It's what remains after all liabilities.", whyNot: { "Non-current liability": "Tempting — it does look long-term. But the café owes Priya nothing on fixed terms; she gets whatever is left after real creditors. No due date, no fixed amount → equity, not a liability." } },
          { text: "Retained earnings, " + R(C.fy25.bs.retained), bucket: "Equity", why: "Profits kept in the business belong to the owner — equity's second component, built next lesson." }
        ]
      },
      {
        t: "sheet",
        sheet: {
          id: "s1",
          title: "Total what outsiders are owed, 31 Mar 2025",
          hint: "Sum the three liabilities — current and non-current — with a range.",
          grid: [
            ["", { v: "31 Mar 2025", year: true }],
            ["Term loan (non-current)", C.fy25.bs.loan],
            ["Trade payables (current)", C.fy25.bs.payables],
            ["Salaries payable (current)", C.fy25.bs.accrued],
            ["Total liabilities", { input: true, mf: true, fmt: "inr", ph: "=SUM(…)" }]
          ],
          checks: [
            { cell: "B5", expect: 700000, message: "B5: total liabilities via SUM", mustFormula: true, mustUse: "SUM", mustUseLabel: "the SUM function" }
          ],
          success: "Outsiders are owed " + R(700000) + ". The café's assets are " + R(C.fy25.bs.totalAssets) + " — so before even seeing the equity section, the equation already tells you Priya's total claim: " + R(1250000) + "."
        }
      },
      { t: "where", h: "On a <strong>Schedule III balance sheet</strong> (the Indian statutory format) these appear as: Equity, then Non-current liabilities, then Current liabilities — the whole right-hand side ordered from most patient money to most urgent. The capstone in 1330 assembles it." },
      { t: "mcq", q: "Why is equity listed with liabilities on the same side of the balance sheet?", opts: ["To make the sheet balance by force", "Both are claims on the assets — they differ in who claims and in what order", "Equity is just a special loan from the owner", "Historical accident"], correct: 1, why: ["The sheet balances by arithmetic, not by force — equity is <em>defined</em> as the residual.", "The left side lists what the business has; the right side lists who has a claim on it. Creditors claim fixed amounts first; the owner claims everything that's left, last. Same side, opposite personalities — and that ranking (debt before equity) is exactly why lenders and owners analyse companies so differently (module 1600).", "A loan has a fixed amount and a due date; equity has neither. The difference is fundamental, not cosmetic.", "The layout encodes real seniority of claims — it's information, not accident."] }
    ]
  };
})();
