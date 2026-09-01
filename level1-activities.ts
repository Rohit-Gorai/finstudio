import type { TopicActivities } from "./types";

/** Level 1 activities, keyed by lesson id. Topic-specific throughout. */
export const level1Activities: Record<string, TopicActivities> = {
  "accounting-equation": {
    practice: [
      { question: "You invest ₹10,00,000, then the business borrows ₹5,00,000, then buys an oven for ₹4,00,000 cash. State assets, liabilities and equity after each step.", solution: "After investing: A 10L = L 0 + E 10L. After borrowing: A 15L = L 5L + E 10L. After the oven: assets are ₹11L cash + ₹4L equipment = 15L — composition changed, totals did not." },
      { question: "Assets ₹120 crore, equity ₹45 crore. Liabilities?", solution: "L = A − E = ₹75 crore. The equation can always be solved for its third member." },
      { question: "A firm buys ₹2,00,000 of inventory on supplier credit. Which sides of the equation move, and does profit change?", solution: "Assets +₹2,00,000 (inventory) and liabilities +₹2,00,000 (payable). Equity and profit are untouched — nothing has been sold yet." },
    ],
    quiz: [
      { question: "The accounting equation states…", choices: ["Revenue = Costs + Profit", "Assets = Liabilities + Equity", "Cash = Profit", "Debits = Assets"], answer: 1, explanation: "Everything the business has was funded by lenders or owners — true by construction, not by enforcement." },
      { question: "Buying equipment for cash…", choices: ["Increases total assets", "Decreases equity", "Leaves totals unchanged — one asset swaps for another", "Creates profit"], answer: 2, explanation: "Cash down, equipment up, same total. Beginners often expect a profit effect; there is none." },
      { question: "If liabilities rise ₹5 crore with no change in equity, assets must…", choices: ["Fall ₹5 crore", "Rise ₹5 crore", "Stay fixed", "Double"], answer: 1, explanation: "The equation must keep holding — borrowed money arrives as an asset (usually cash)." },
    ],
    sandbox: {
      kind: "balance", title: "Equation sandbox",
      prompt: "Change either side and note that equity is forced — it is computed, never chosen.",
      fields: [
        { key: "assets", label: "Assets", defaultValue: 1500000, unit: "₹" },
        { key: "liabilities", label: "Liabilities", defaultValue: 500000, unit: "₹" },
      ],
    },
  },

  "double-entry-accounting": {
    practice: [
      { question: "Record both sides: a bakery buys ₹20,000 of flour with cash; then a second batch on 30-day credit.", solution: "Cash purchase: inventory +20,000, cash −20,000. Credit purchase: inventory +20,000, payable +20,000. Neither touches profit." },
      { question: "Bread costing ₹2,000 sells for ₹5,000 cash. Record every movement.", solution: "Cash +5,000; inventory −2,000; equity +3,000 through profit. Profit appears because what was received exceeds what was given up." },
      { question: "Why does repaying a ₹20,000 supplier invoice create no expense?", solution: "The expense (or asset) was recorded when the goods arrived. Payment merely settles the liability: cash −20,000, payable −20,000." },
    ],
    quiz: [
      { question: "Double-entry requires every transaction to…", choices: ["Be approved twice", "Record what was received and what was given up, in equal amounts", "Involve cash", "Create profit"], answer: 1, explanation: "Two sides, equal amounts — which is what keeps the accounting equation intact automatically." },
      { question: "Which event creates profit?", choices: ["Buying stock with cash", "Borrowing money", "Selling goods for more than they cost", "Repaying a loan"], answer: 2, explanation: "Only receiving more value than is given up creates profit. The others rearrange the balance sheet." },
      { question: "The right starting point for any entry is…", choices: ["The debit/credit rule table", "The real-world event and its two sides", "The tax code", "The bank statement"], answer: 1, explanation: "Identify what happened economically first; the bookkeeping labels then follow naturally." },
    ],
  },

  "debits-and-credits": {
    practice: [
      { question: "Write the entries: a sale of ₹50,000 for cash, then ₹8,000 rent paid.", solution: "Sale: debit cash 50,000; credit revenue 50,000. Rent: debit rent expense 8,000; credit cash 8,000." },
      { question: "In those two entries, cash was debited once and credited once. What does that tell you about 'debit = increase'?", solution: "Debits increase assets (cash rose on the sale) and credits decrease them (cash fell for rent). The effect depends on the account type, not the word." },
      { question: "Your bank SMS says your account was 'credited ₹10,000'. Translate into whose books that language belongs to.", solution: "The bank's. Your deposit is the bank's liability; crediting it records that the bank owes you more. In your own books, your cash would be debited." },
    ],
    quiz: [
      { question: "Debit and credit fundamentally mean…", choices: ["Bad and good", "Decrease and increase", "The left and right side of an entry", "Cash out and cash in"], answer: 2, explanation: "They are positional labels. Their effect depends entirely on the account family involved." },
      { question: "A debit increases…", choices: ["Liabilities and revenue", "Assets and expenses", "Equity only", "Everything"], answer: 1, explanation: "Assets and expenses grow with debits; liabilities, equity and revenue grow with credits." },
      { question: "In every journal entry…", choices: ["Debits exceed credits", "Total debits equal total credits", "Only one account moves", "Cash must appear"], answer: 1, explanation: "Equality of debits and credits is the mechanical guarantee behind the trial balance." },
    ],
  },

  "chart-of-accounts": {
    practice: [
      { question: "Assign each to its family: Coffee sales · Bank loan · Espresso machine · Ingredient costs · Owner capital.", solution: "Revenue · Liability · Asset · Expense · Equity — the five families every account belongs to." },
      { question: "A café books coffee and food sales into one 'Sales' account. What question becomes unanswerable, and what is the fix?", solution: "Which line is growing. Split into separate revenue accounts (e.g. 4000 Coffee, 4100 Food) so reports carry the distinction." },
      { question: "Why is a 200-account chart sometimes worse than a 40-account one?", solution: "Detail nobody maintains gets used inconsistently, corrupting every report built on it. Capture the distinctions someone will act on — no more." },
    ],
    quiz: [
      { question: "The chart of accounts is best described as…", choices: ["A payment schedule", "The filing system every transaction is sorted into", "A tax form", "The audit report"], answer: 1, explanation: "Financial statements are the chart's accounts totalled and arranged — the filing design caps the analysis." },
      { question: "The five account families are…", choices: ["Cash, bank, card, loan, tax", "Assets, liabilities, equity, revenue, expenses", "Sales, costs, profit, dividends, reserves", "Current, fixed, tangible, intangible, other"], answer: 1, explanation: "Three balance-sheet families and two income-statement families cover everything." },
      { question: "Recording detail 'just in case', with no one to act on it, tends to…", choices: ["Improve accuracy", "Cause inconsistent use and unreliable reports", "Reduce audit fees", "Speed up closing"], answer: 1, explanation: "Account design should follow the decisions it must support." },
    ],
  },

  "accrual-accounting": {
    practice: [
      { question: "A consultant finishes ₹4,00,000 of work in December, paid in February. What do December and February each show under accrual accounting?", solution: "December: revenue ₹4,00,000 and a receivable ₹4,00,000. February: cash +4,00,000, receivable cleared — no new revenue." },
      { question: "She also pays ₹1,20,000 in December for insurance covering January–December next year. December's expense?", solution: "Nil. The payment creates a ₹1,20,000 prepaid asset, released at ₹10,000/month across the covered year." },
      { question: "Combine both: what are December's profit and December's cash movement?", solution: "Profit +₹4,00,000 (revenue, no matching expense yet); cash −₹1,20,000. Both correct — they answer different questions." },
    ],
    quiz: [
      { question: "Accrual accounting records revenue when…", choices: ["Cash arrives", "The contract is signed", "The promised goods or services are delivered", "The invoice is printed"], answer: 2, explanation: "Delivery is the earning event. Cash timing is tracked separately, via receivables and deferred revenue." },
      { question: "Cash received before delivering the service is recorded as…", choices: ["Revenue", "A liability (deferred revenue)", "Equity", "A prepaid expense"], answer: 1, explanation: "The business owes the customer performance; until delivered, the money is an obligation, not an achievement." },
      { question: "The main reason reported profit differs from cash flow is…", choices: ["Arithmetic errors", "Accrual timing of revenue and costs", "Currency movements", "Auditor adjustments"], answer: 1, explanation: "Accruals deliberately separate activity from payment timing — the divergence is the design, not a flaw." },
    ],
    sandbox: {
      kind: "accrual-timing", title: "Delivery vs collection sandbox",
      prompt: "Set collections above delivery, then below. Watch which balance-sheet item each gap creates.",
      fields: [
        { key: "workDelivered", label: "Work delivered this month", defaultValue: 400000, unit: "₹" },
        { key: "cashCollected", label: "Cash collected this month", defaultValue: 150000, unit: "₹" },
      ],
    },
  },

  "cash-accounting": {
    practice: [
      { question: "Using cash accounting, restate the consultant's December (₹4,00,000 of work paid in February; ₹1,20,000 insurance paid in December).", solution: "Revenue nil, expense ₹1,20,000 — a ₹1,20,000 loss in the month all the work was done. February then shows a ₹4,00,000 profit for a month of no work." },
      { question: "Name one genuine advantage and one genuine weakness of the cash basis.", solution: "Advantage: simplicity, and it matches the bank statement exactly. Weakness: reported results follow payment dates, not activity, so periods can be badly misstated." },
      { question: "Why can you not directly compare a cash-basis sole trader's 'profit' with a listed company's net profit?", solution: "They measure different things: one is net cash movement, the other accrual earnings. The comparison mixes two definitions of the same word." },
    ],
    quiz: [
      { question: "Under cash accounting, revenue is recorded when…", choices: ["Goods are delivered", "Payment is received", "The order is placed", "The year ends"], answer: 1, explanation: "Money in is revenue on arrival; money out is expense on departure. Nothing else exists — no receivables, payables or prepayments." },
      { question: "Cash accounting can misstate a period because…", choices: ["It uses estimates heavily", "Payment dates, not activity, drive the numbers", "It requires complex judgement", "It double-counts revenue"], answer: 1, explanation: "A month of hard work paid late looks like a loss; a lazy month collecting old invoices looks brilliant." },
      { question: "Published accounts of listed companies are almost always prepared on…", choices: ["The cash basis", "The accrual basis", "A hybrid chosen yearly", "No fixed basis"], answer: 1, explanation: "Accounting standards require accrual accounting for general-purpose financial statements." },
    ],
  },

  "revenue-recognition": {
    practice: [
      { question: "A software firm collects ₹1,20,000 on 1 January for a 12-month subscription. Show the position at 1 January and at 30 June.", solution: "1 Jan: cash +1,20,000, deferred revenue 1,20,000, revenue nil. 30 Jun: revenue recognised ₹60,000 (6 × ₹10,000); deferred revenue ₹60,000 remains." },
      { question: "A contract bundles a ₹80,000 machine (delivered day one) with ₹40,000 of two-year servicing. How is ₹1,20,000 of revenue recognised?", solution: "Split by obligation: ₹80,000 on delivery of the machine; ₹40,000 spread over 24 months of service ≈ ₹1,667/month." },
      { question: "A sales team books full contract value as revenue on signature. What does this do to current-period profit, and to future periods?", solution: "It pulls future revenue forward, inflating today's profit and hollowing out later periods — the classic shape of aggressive recognition." },
    ],
    quiz: [
      { question: "The general trigger for recognising revenue is…", choices: ["Signing the contract", "Receiving cash", "Transferring control of the promised goods or services", "Issuing the invoice"], answer: 2, explanation: "Neither signatures nor cash mean the business has performed. Delivery of the promise does." },
      { question: "A gym collects a ₹24,000 annual fee upfront. After 3 months it has earned…", choices: ["₹24,000", "₹6,000", "₹18,000", "Nothing until year-end"], answer: 1, explanation: "3/12 × 24,000 = ₹6,000 recognised; ₹18,000 remains a liability owed in service." },
      { question: "Deferred revenue would have to be repaid if…", choices: ["Profits fall", "The service is never delivered", "The customer complains", "Interest rates rise"], answer: 1, explanation: "It is a real obligation: money held for performance not yet rendered." },
    ],
    sandbox: {
      kind: "deferred-revenue", title: "Subscription sandbox",
      prompt: "Slide months delivered from 0 to 12 and watch cash held turn into revenue earned.",
      fields: [
        { key: "contractValue", label: "Collected upfront", defaultValue: 120000, unit: "₹" },
        { key: "monthsTotal", label: "Months in contract", defaultValue: 12 },
        { key: "monthsDelivered", label: "Months delivered", defaultValue: 6 },
      ],
    },
  },

  "expenses": {
    practice: [
      { question: "December events: ₹50,000 electricity used (billed January); ₹60,000 paid for Jan–Mar cleaning; ₹80,000 December salaries paid; a ₹6,00,000 van bought (5-year life). Compute December's expense.", solution: "Electricity 50,000 (accrued) + salaries 80,000 + van depreciation 6,00,000÷5÷12 = 10,000 → ₹1,40,000. The cleaning is prepaid; the van is capitalised." },
      { question: "December's cash outflow for the same events?", solution: "60,000 + 80,000 + 6,00,000 = ₹7,40,000. Expense ₹1.4L vs cash ₹7.4L — paying and expensing are different events." },
      { question: "A firm capitalises routine repairs as assets. What does this do to this year's profit, and why is it misleading?", solution: "Profit is flattered because a current cost is parked on the balance sheet and expensed slowly. Repairs have no multi-year benefit, so the treatment misstates performance." },
    ],
    quiz: [
      { question: "A cost paid now but consumed next year is recorded now as…", choices: ["An expense", "A prepaid asset", "A liability", "Revenue"], answer: 1, explanation: "The benefit is still owed to you; it becomes expense as it is consumed." },
      { question: "A cost consumed now but invoiced next month is…", choices: ["Ignored until the invoice", "Expensed now, with an accrued liability", "Capitalised", "Netted against revenue"], answer: 1, explanation: "Matching puts the cost in the period it was incurred; the accrual records the amount owed." },
      { question: "A ₹6,00,000 van with a 5-year life is bought. This year's expense from the purchase is…", choices: ["₹6,00,000", "₹1,20,000", "₹0 forever", "₹3,00,000"], answer: 1, explanation: "Capitalise, then depreciate: 6,00,000 ÷ 5 = ₹1,20,000 per year." },
    ],
    sandbox: {
      kind: "spread-cost", title: "Prepaid spreading sandbox",
      prompt: "Pay once, expense monthly. Watch the prepaid asset drain to zero as months elapse.",
      fields: [
        { key: "totalCost", label: "Paid upfront", defaultValue: 240000, unit: "₹" },
        { key: "monthsCovered", label: "Months covered", defaultValue: 12 },
        { key: "monthsElapsed", label: "Months elapsed", defaultValue: 3 },
      ],
    },
  },

  "accounts-receivable": {
    practice: [
      { question: "Annual revenue ₹36,50,000; year-end receivables ₹6,00,000. Compute DSO.", solution: "(6,00,000 ÷ 36,50,000) × 365 = 60 days." },
      { question: "Next year revenue is ₹50,00,000 and DSO slips to 90 days. How much extra cash is tied up in receivables?", solution: "New receivables = 90/365 × 50,00,000 = ₹12,32,877; increase ≈ ₹6,32,877 that must be funded." },
      { question: "A customer owing ₹3,00,000 goes bankrupt. Trace the effect through the statements.", solution: "The receivable is written off: assets fall ₹3,00,000 and a bad-debt expense cuts profit by the same. No cash moves — the cash never arrived." },
    ],
    quiz: [
      { question: "A receivable represents…", choices: ["Cash in the bank", "Revenue recognised but not yet collected", "A supplier debt", "Future orders"], answer: 1, explanation: "Delivery happened, payment has not — your money is financing the customer meanwhile." },
      { question: "Receivables ₹8,00,000 against annual revenue ₹48,66,667. DSO is about…", choices: ["30 days", "60 days", "90 days", "120 days"], answer: 1, explanation: "(8,00,000 ÷ 48,66,667) × 365 ≈ 60 days." },
      { question: "Revenue rising while DSO also rises suggests…", choices: ["Improving cash collection", "Growth partly bought with looser credit terms — worth investigating", "Falling sales", "Nothing at all"], answer: 1, explanation: "Extending credit inflates sales today and cash risk tomorrow. The combination is a standard red flag." },
    ],
    sandbox: {
      kind: "receivables-cash", title: "Collection speed sandbox",
      prompt: "Move DSO from 60 to 90 days and see how much cash growth quietly demands.",
      fields: [
        { key: "revenue", label: "Annual revenue", defaultValue: 5000000, unit: "₹" },
        { key: "dsoNow", label: "Current DSO", defaultValue: 60, unit: "days" },
        { key: "dsoNew", label: "New DSO", defaultValue: 90, unit: "days" },
      ],
    },
  },

  "accounts-payable": {
    practice: [
      { question: "Annual COGS ₹73,00,000; payables ₹12,00,000. Compute DPO.", solution: "(12,00,000 ÷ 73,00,000) × 365 = 60 days." },
      { question: "Terms improve to 75 days. How much one-off cash is released?", solution: "New payables = 75/365 × 73,00,000 = ₹15,00,000 → ₹3,00,000 released. It does not repeat next year." },
      { question: "A supplier offers 2% off for paying in 10 days instead of 40. Roughly what annual rate do you 'earn' by paying early?", solution: "2% for giving up 30 days ≈ 2% × 365/30 ≈ 24% annualised. Skipping the discount is expensive borrowing." },
    ],
    quiz: [
      { question: "Accounts payable is…", choices: ["Money customers owe you", "Money you owe suppliers for goods already received", "A bank loan", "An expense account"], answer: 1, explanation: "The mirror of receivables: delivery received, payment pending — free short-term funding meanwhile." },
      { question: "An increase in payables over a period is…", choices: ["A use of cash", "A source of cash", "Cash-neutral", "Always a bad sign"], answer: 1, explanation: "Holding suppliers' money longer means cash stays with you — a one-off release, not recurring flow." },
      { question: "A sharply rising DPO can mean…", choices: ["Only deliberate strategy", "Only distress", "Either negotiated terms or genuine cash trouble — context decides", "Nothing"], answer: 2, explanation: "The number alone is ambiguous; supplier relationships and liquidity elsewhere tell you which story it is." },
    ],
    sandbox: {
      kind: "payables-cash", title: "Supplier credit sandbox",
      prompt: "Stretch DPO and see the cash released — then remember it happens exactly once.",
      fields: [
        { key: "cogs", label: "Annual cost of goods", defaultValue: 7300000, unit: "₹" },
        { key: "dpoNow", label: "Current DPO", defaultValue: 60, unit: "days" },
        { key: "dpoNew", label: "New DPO", defaultValue: 75, unit: "days" },
      ],
    },
  },

  "inventory": {
    practice: [
      { question: "A retailer buys ₹10,00,000 of stock in March. What are the profit and cash effects that month?", solution: "Cash −₹10,00,000; profit unchanged. Buying stock converts one asset into another — the cost waits in inventory." },
      { question: "By June, 75% has sold for ₹18,00,000. Compute COGS and gross profit.", solution: "COGS = 75% × 10,00,000 = ₹7,50,000; gross profit = 18,00,000 − 7,50,000 = ₹10,50,000." },
      { question: "Season ends; the remaining ₹2,50,000 of stock must clear at half price. Effect on profit?", solution: "A write-down of ₹1,25,000 hits profit now. Inventory is only worth book value if someone will pay it." },
    ],
    quiz: [
      { question: "Buying inventory with cash…", choices: ["Creates an expense immediately", "Reduces cash with no profit effect", "Increases profit", "Creates a liability"], answer: 1, explanation: "Cost sits in the inventory asset until the item sells; only then does it become cost of goods sold." },
      { question: "Inventory ₹15,00,000; annual COGS ₹73,00,000. Days inventory outstanding is about…", choices: ["25 days", "50 days", "75 days", "100 days"], answer: 2, explanation: "(15,00,000 ÷ 73,00,000) × 365 ≈ 75 days on the shelf before selling." },
      { question: "Inventory climbing while sales stay flat usually signals…", choices: ["Efficient buying", "Demand falling short of purchases — discounting or write-downs ahead", "Strong pricing power", "Better margins"], answer: 1, explanation: "Stock piling up unsold is one of the earliest visible warnings in a product business." },
    ],
    sandbox: {
      kind: "sell-through", title: "Stock sandbox",
      prompt: "Lower the percentage sold and watch profit hold while cash stays trapped on the shelf.",
      fields: [
        { key: "stockBought", label: "Stock purchased", defaultValue: 1000000, unit: "₹" },
        { key: "percentSold", label: "Sold by period end", defaultValue: 75, unit: "%" },
        { key: "markup", label: "Markup on cost", defaultValue: 140, unit: "%" },
      ],
    },
  },

  "prepaid-expenses": {
    practice: [
      { question: "₹2,40,000 paid on 1 April for 12 months of insurance. What sits on the balance sheet at 30 June, and how much expense has been recognised?", solution: "Monthly ₹20,000. Expense to date ₹60,000; prepaid asset remaining ₹1,80,000." },
      { question: "Why would judging April by its cash outflow misread the month?", solution: "April shows ₹2,40,000 leaving for a benefit spread over a year. Expense of ₹20,000 is the fair monthly burden; cash timing exaggerates it twelvefold." },
      { question: "The bookkeeper forgets to release the prepayment after June. What goes wrong in later months?", solution: "Expenses are understated and profit overstated each month, while a stale asset lingers — until a correction lumps the error into one period." },
    ],
    quiz: [
      { question: "A prepaid expense is an asset because…", choices: ["It earns interest", "The benefit is still owed to the business", "It can be sold", "Accounting rules are arbitrary"], answer: 1, explanation: "You have paid; the counterparty still owes you cover, rent or service — a future benefit." },
      { question: "₹1,20,000 paid for a 12-month licence: the monthly expense is…", choices: ["₹1,20,000", "₹10,000", "₹12,000", "Nil"], answer: 1, explanation: "1,20,000 ÷ 12 = ₹10,000 flows from asset to expense each month." },
      { question: "After the covered period ends, the prepaid balance should be…", choices: ["Its original amount", "Zero", "Negative", "Reclassified as revenue"], answer: 1, explanation: "Fully consumed benefit means fully released asset." },
    ],
    sandbox: {
      kind: "spread-cost", title: "Prepayment sandbox",
      prompt: "Advance the elapsed months and watch the asset convert into expense on schedule.",
      fields: [
        { key: "totalCost", label: "Paid in advance", defaultValue: 240000, unit: "₹" },
        { key: "monthsCovered", label: "Months of cover", defaultValue: 12 },
        { key: "monthsElapsed", label: "Months used", defaultValue: 3 },
      ],
    },
  },

  "deferred-revenue": {
    practice: [
      { question: "A gym sells 500 annual memberships at ₹24,000 on 1 January, all cash upfront. State the 1 January position.", solution: "Cash +₹1,20,00,000; deferred revenue liability ₹1,20,00,000; revenue nil — everything is still owed in service." },
      { question: "Revenue recognised by 30 June, and the remaining obligation?", solution: "₹10,00,000/month × 6 = ₹60,00,000 recognised; ₹60,00,000 still deferred." },
      { question: "Why can a growing deferred-revenue balance be good news?", solution: "It means customers are paying ahead faster than service is delivered — commitment plus interest-free funding. The liability label describes mechanics, not distress." },
    ],
    quiz: [
      { question: "Cash collected before delivery appears as…", choices: ["Revenue", "Deferred revenue, a liability", "Equity", "A receivable"], answer: 1, explanation: "Until performance happens, the business owes the customer — money held is not money earned." },
      { question: "A ₹36,000 three-year service plan collected upfront recognises per year…", choices: ["₹36,000", "₹12,000", "₹18,000", "Nothing"], answer: 1, explanation: "Delivery is even across three years: ₹12,000 of the liability converts to revenue annually." },
      { question: "If the provider shut down halfway through prepaid contracts, deferred revenue balances would…", choices: ["Become profit", "Generally be refundable to customers", "Convert to equity", "Vanish"], answer: 1, explanation: "The balance measures undelivered obligation — which is why it is a liability in the first place." },
    ],
    sandbox: {
      kind: "deferred-revenue", title: "Advance collections sandbox",
      prompt: "Watch the liability shrink month by month as delivery converts it into revenue.",
      fields: [
        { key: "contractValue", label: "Cash collected upfront", defaultValue: 12000000, unit: "₹" },
        { key: "monthsTotal", label: "Service period (months)", defaultValue: 12 },
        { key: "monthsDelivered", label: "Months delivered", defaultValue: 6 },
      ],
    },
  },

  "accrued-expenses": {
    practice: [
      { question: "Year-end 31 March: staff earned ₹15,00,000 in March (paid 5 April); March electricity of ₹2,40,000 billed in April. Record the year-end accruals and their profit effect.", solution: "Accrue both: expenses +₹17,40,000 and accrued liabilities +₹17,40,000. March profit falls ₹17.4 lakh though no cash moved." },
      { question: "In April both are paid. What happens in April's accounts?", solution: "Cash −₹17,40,000 and liabilities −₹17,40,000. No April expense — the cost already belonged to March." },
      { question: "How do accrued expenses differ from accounts payable?", solution: "Payables rest on received invoices; accruals record costs incurred before any invoice exists, so they usually involve estimation." },
    ],
    quiz: [
      { question: "An accrued expense is…", choices: ["A cost paid in advance", "A cost incurred but not yet invoiced or paid", "A bad debt", "A capitalised cost"], answer: 1, explanation: "Consumption came first; the paperwork and payment follow later." },
      { question: "Failing to accrue March's ₹2,40,000 electricity bill would…", choices: ["Understate March profit", "Overstate March profit by ₹2,40,000", "Have no effect", "Reduce cash"], answer: 1, explanation: "A cost belonging to March would be missing from March — profit looks better than it was." },
      { question: "When the accrued invoice is finally paid…", choices: ["A second expense is recorded", "Cash and the liability both fall, with no new expense", "Revenue rises", "Equity rises"], answer: 1, explanation: "The expense already happened at accrual; payment merely settles the obligation." },
    ],
  },

  "working-capital": {
    practice: [
      { question: "Start of year: inventory ₹20L, receivables ₹15L, payables ₹12L. End: ₹28L, ₹21L, ₹16L. Compute working capital at both dates and the cash effect.", solution: "Start: 23L. End: 33L. The ₹10L increase consumed ₹10 lakh of cash during a growth year." },
      { question: "That year's profit was ₹8L. Did operations generate or consume cash overall?", solution: "Roughly 8L − 10L = −₹2L: profitable trading, negative cash — the standard growth squeeze." },
      { question: "Name one lever on each component that reduces working capital, and one risk of each.", solution: "Hold less stock (stock-out risk), collect faster (customer friction), pay slower (supplier strain). Efficiency and relationships trade off." },
    ],
    quiz: [
      { question: "Operating working capital is…", choices: ["Cash in hand", "Inventory + receivables − payables", "Equity − debt", "Fixed assets"], answer: 1, explanation: "It is the net cash locked into running day-to-day operations." },
      { question: "When working capital increases over a period, cash is…", choices: ["Released", "Consumed", "Unaffected", "Doubled"], answer: 1, explanation: "More stock and unpaid invoices means more of your cash sitting inside operations." },
      { question: "Fast profitable growth most commonly strains cash because…", choices: ["Taxes rise", "Working capital scales up ahead of collections", "Depreciation accelerates", "Interest rates rise"], answer: 1, explanation: "You buy stock and extend credit before the profits are collected — growth funds itself only later." },
    ],
    sandbox: {
      kind: "working-capital", title: "Working capital sandbox",
      prompt: "Scale inventory and receivables up 40% as if revenue grew — the rise you see is cash the growth demands.",
      fields: [
        { key: "inventory", label: "Inventory", defaultValue: 2800000, unit: "₹" },
        { key: "receivables", label: "Receivables", defaultValue: 2100000, unit: "₹" },
        { key: "payables", label: "Payables", defaultValue: 1600000, unit: "₹" },
      ],
    },
  },

  "depreciation": {
    practice: [
      { question: "A van costs ₹12,00,000, lasts 6 years, residual ₹1,20,000. Compute the annual charge and the net book value after 3 years.", solution: "Annual = (12,00,000 − 1,20,000) ÷ 6 = ₹1,80,000. After 3 years: NBV = 12,00,000 − 5,40,000 = ₹6,60,000." },
      { question: "In which year did cash leave, and how much expense hits each of years 2–6?", solution: "All ₹12,00,000 of cash left in year 1. Years 2–6 each carry ₹1,80,000 of expense with zero cash outflow — the core profit-vs-cash wedge." },
      { question: "Management stretches the assumed life from 6 to 10 years. Effect on annual profit, and the risk?", solution: "The charge drops to ₹1,08,000, lifting profit ₹72,000/year. If the van truly wears out in 6, later years absorb the truth via losses or write-offs — estimates are levers." },
    ],
    quiz: [
      { question: "Depreciation exists to…", choices: ["Save cash for replacement", "Spread an asset's cost over the years it is used", "Track market value", "Reduce tax only"], answer: 1, explanation: "It matches the cost of a long-lived asset to the periods that benefit from it. No cash is set aside anywhere." },
      { question: "Cost ₹5,00,000, residual ₹50,000, life 5 years. The straight-line annual charge is…", choices: ["₹1,00,000", "₹90,000", "₹1,10,000", "₹50,000"], answer: 1, explanation: "(5,00,000 − 50,000) ÷ 5 = ₹90,000." },
      { question: "Net book value equals…", choices: ["Resale price", "Original cost minus accumulated depreciation", "Replacement cost", "Insured value"], answer: 1, explanation: "It is an accounting remainder, not an appraisal — the market may pay far more or less." },
    ],
    sandbox: {
      kind: "depreciation", title: "Depreciation sandbox",
      prompt: "Stretch the useful life and watch the annual charge fall — then ask who is checking that estimate.",
      fields: [
        { key: "cost", label: "Asset cost", defaultValue: 1200000, unit: "₹" },
        { key: "residual", label: "Residual value", defaultValue: 120000, unit: "₹" },
        { key: "usefulLife", label: "Useful life (years)", defaultValue: 6 },
        { key: "yearsElapsed", label: "Years elapsed", defaultValue: 3 },
      ],
    },
  },

  "amortization": {
    practice: [
      { question: "A 10-year patent licence costs ₹50,00,000. Annual amortisation, and carrying value after year 5?", solution: "₹5,00,000 per year; carrying value ₹25,00,000 after five." },
      { question: "When did the cash leave, and what does each later year's income statement show?", solution: "₹50 lakh left in year 1. Years 2–10 each show ₹5,00,000 of amortisation with no cash movement." },
      { question: "A loan officer says 'this loan amortises over 15 years'. Is that the same use of the word?", solution: "No — loan amortisation means scheduled principal repayment. Asset amortisation spreads a cost. Same word, two meanings; context decides." },
    ],
    quiz: [
      { question: "Amortisation applies to…", choices: ["Buildings and vehicles", "Intangible assets like licences and patents", "Inventory", "Cash"], answer: 1, explanation: "It is depreciation's twin for assets without physical form." },
      { question: "A ₹30,00,000 software licence with a 6-year life is amortised annually at…", choices: ["₹6,00,000", "₹5,00,000", "₹3,00,000", "₹30,00,000"], answer: 1, explanation: "30,00,000 ÷ 6 = ₹5,00,000 per year." },
      { question: "An intangible with an indefinite useful life is…", choices: ["Amortised over 10 years by default", "Tested periodically for impairment instead of amortised", "Expensed immediately", "Ignored"], answer: 1, explanation: "No foreseeable end to usefulness means no sensible life to spread over; impairment testing polices the value instead." },
    ],
    sandbox: {
      kind: "depreciation", title: "Amortisation sandbox",
      prompt: "Set residual to zero (typical for licences) and step through the years of the charge.",
      fields: [
        { key: "cost", label: "Licence cost", defaultValue: 5000000, unit: "₹" },
        { key: "residual", label: "Residual value", defaultValue: 0, unit: "₹" },
        { key: "usefulLife", label: "Useful life (years)", defaultValue: 10 },
        { key: "yearsElapsed", label: "Years elapsed", defaultValue: 5 },
      ],
    },
  },

  "ppe": {
    practice: [
      { question: "Opening PP&E ₹80 crore; capex ₹12 crore; depreciation ₹15 crore. Closing balance, and what it implies?", solution: "80 + 12 − 15 = ₹77 crore. Spending below depreciation: the productive base shrank ₹3 crore this year." },
      { question: "If that pattern repeats for five years, roughly where does the base end up, and what is the business quietly doing?", solution: "Around ₹65 crore. It is consuming its own capacity — profit looks fine while future output erodes." },
      { question: "Two firms each earn ₹20 crore. One needs ₹200 crore of PP&E, the other ₹20 crore. Why does the difference matter to an investor?", solution: "The first must keep reinvesting heavily just to stand still, leaving less free cash. Capital intensity determines how much of profit ever reaches owners." },
    ],
    quiz: [
      { question: "PP&E consists of assets…", choices: ["Held for resale", "Used to operate the business over many years", "Owned by suppliers", "That never lose value"], answer: 1, explanation: "Land, buildings, machinery, vehicles — the physical platform for producing goods and services." },
      { question: "Closing PP&E equals…", choices: ["Opening + depreciation − capex", "Opening + capex − depreciation", "Opening × growth rate", "Capex alone"], answer: 1, explanation: "New investment adds; the period's depreciation subtracts." },
      { question: "Capex persistently below depreciation most likely means…", choices: ["Excellent efficiency", "The asset base is being run down", "Assets are appreciating", "Nothing"], answer: 1, explanation: "Equipment is wearing out faster than it is replaced — fine briefly, corrosive if sustained." },
    ],
    sandbox: {
      kind: "ppe-rollforward", title: "Asset base sandbox",
      prompt: "Set capex below the depreciation charge and watch the warning appear.",
      fields: [
        { key: "opening", label: "Opening PP&E", defaultValue: 800000000, unit: "₹" },
        { key: "capex", label: "Capital expenditure", defaultValue: 120000000, unit: "₹" },
        { key: "depreciationCharge", label: "Depreciation", defaultValue: 150000000, unit: "₹" },
      ],
    },
  },

  "goodwill": {
    practice: [
      { question: "Company A pays ₹500 crore for Company B, whose identifiable assets are worth ₹420 crore and liabilities ₹150 crore. Compute goodwill.", solution: "Identifiable net assets = 270 crore; goodwill = 500 − 270 = ₹230 crore." },
      { question: "Two years on, B is judged worth ₹350 crore in total. What happens, and is cash involved?", solution: "Goodwill is impaired — written down through a large non-cash loss. The cash left at purchase; the write-down is the public admission the price was too high." },
      { question: "Why does a famous 50-year-old brand built in-house show ₹0 of goodwill on its own balance sheet?", solution: "Internally generated goodwill is not recognised — only a purchase creates it. The brand's value is real but invisible in the accounts." },
    ],
    quiz: [
      { question: "Goodwill arises only when…", choices: ["A brand becomes popular", "One business buys another for more than its identifiable net assets", "Profits are strong", "Auditors permit it"], answer: 1, explanation: "It is a purchase residual: price paid minus identifiable net assets at fair value." },
      { question: "Price ₹800 crore; identifiable assets ₹700 crore; liabilities ₹250 crore. Goodwill is…", choices: ["₹100 crore", "₹350 crore", "₹550 crore", "₹250 crore"], answer: 1, explanation: "Net assets = 450; goodwill = 800 − 450 = ₹350 crore." },
      { question: "A goodwill impairment is best read as…", choices: ["A cash outflow today", "A non-cash admission that the acquisition price was not justified", "A tax refund", "Routine depreciation"], answer: 1, explanation: "No cash moves at impairment, but the signal about a past capital-allocation decision is very real." },
    ],
    sandbox: {
      kind: "goodwill", title: "Acquisition premium sandbox",
      prompt: "Raise the purchase price and watch the part of it that rests purely on expectations.",
      fields: [
        { key: "purchasePrice", label: "Price paid", defaultValue: 5000000000, unit: "₹" },
        { key: "assetsAcquired", label: "Identifiable assets", defaultValue: 4200000000, unit: "₹" },
        { key: "liabilitiesAcquired", label: "Liabilities assumed", defaultValue: 1500000000, unit: "₹" },
      ],
    },
  },

  "intangible-assets": {
    practice: [
      { question: "Two companies own economically identical ₹1,000 crore brands — one built over 40 years, one just purchased. What does each balance sheet show, and why?", solution: "Built: ₹0 (internal brand spending was expensed as incurred). Purchased: ₹1,000 crore (acquired intangibles are recognised at cost). Same asset, opposite visibility." },
      { question: "Why is a price-to-book comparison between a software firm and a steel maker close to meaningless?", solution: "The software firm's main assets (code, brand, users) are largely unrecognised; the steel maker's plant is on the books. The 'book' being compared measures different fractions of real value." },
      { question: "Research spending versus qualifying development spending — how do the treatments differ?", solution: "Research is expensed as incurred; development may be capitalised only when strict criteria (technical feasibility, intention, probable benefit) are demonstrably met." },
    ],
    quiz: [
      { question: "Which appears on the balance sheet?", choices: ["A brand built through decades of own advertising", "A brand acquired in a takeover", "Employee loyalty", "Founder reputation"], answer: 1, explanation: "Acquisition creates a measurable cost to recognise; internal generation does not." },
      { question: "For brand-heavy and software businesses, book value tends to…", choices: ["Overstate real value", "Understate it, because key intangibles go unrecognised", "Match market value", "Equal liquidation value"], answer: 1, explanation: "The most valuable assets are precisely the ones accounting leaves off." },
      { question: "A purchased intangible with a 10-year contractual life is usually…", choices: ["Never touched", "Amortised over the 10 years", "Impaired immediately", "Revalued upward yearly"], answer: 1, explanation: "A defined benefit period gives a defined life to spread cost over." },
    ],
  },

  "retained-earnings": {
    practice: [
      { question: "Opening retained earnings ₹45 crore; profit ₹12 crore; dividend ₹4 crore. Closing balance?", solution: "45 + 12 − 4 = ₹53 crore." },
      { question: "The next year brings a ₹6 crore loss and no dividend. Balance now?", solution: "53 − 6 = ₹47 crore. Losses subtract exactly as profits add." },
      { question: "A firm shows ₹500 crore of retained earnings and ₹8 crore of cash. Reconcile the apparent contradiction.", solution: "No contradiction: retained earnings track profits kept over the firm's life, long since reinvested in stock, equipment and receivables. It is history, not a bank balance." },
    ],
    quiz: [
      { question: "Retained earnings grow when the company…", choices: ["Borrows", "Earns profit and keeps it", "Pays dividends", "Issues shares"], answer: 1, explanation: "The roll-forward is opening + profit − dividends; only kept profit adds." },
      { question: "Dividends appear…", choices: ["On the income statement as an expense", "As a reduction of retained earnings, never as an expense", "As revenue to the company", "Nowhere"], answer: 1, explanation: "A dividend is a distribution of profit to owners, not a cost of earning it." },
      { question: "The link carrying the income statement's result onto the balance sheet is…", choices: ["Cash", "Retained earnings", "Payables", "Goodwill"], answer: 1, explanation: "Net profit flows into retained earnings inside equity — the joint that ties the statements together." },
    ],
    sandbox: {
      kind: "retained", title: "Retention sandbox",
      prompt: "Pay out more than you earn and watch the balance fall — retained earnings are a running total, not a vault.",
      fields: [
        { key: "opening", label: "Opening retained earnings", defaultValue: 450000000, unit: "₹" },
        { key: "netProfit", label: "Profit for the year", defaultValue: 120000000, unit: "₹" },
        { key: "dividends", label: "Dividends paid", defaultValue: 40000000, unit: "₹" },
      ],
    },
  },
};
