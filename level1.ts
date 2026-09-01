import type { Lesson } from "./types";

/**
 * Level 1 — Accounting Foundations. 21 lessons.
 *
 * Accounting is where beginners are most often lost by jargon, so every lesson
 * here leads with the business event and introduces the accounting label only
 * after the event is understood.
 */
export const level1: Lesson[] = [
  // ── Module: Accounting mechanics ────────────────────────────────────────
  {
    id: "accounting-equation",
    title: "Accounting equation",
    level: 1,
    module: "Accounting mechanics",
    order: 23,
    status: "authored",
    summary: "Everything a business owns was paid for by someone — either a lender or an owner.",
    concept:
      "The accounting equation says that everything a business has was funded by somebody, and there are only two somebodies: people it owes money to, and its owners. So the value of what it has must equal the claims against it. This is not a rule accountants invented and enforce — it is true by construction, because you cannot acquire something without a source of funding.",
    whyItMatters:
      "This equation is the skeleton of the balance sheet and the reason accounts balance at all. Once you can see it, the balance sheet stops being an intimidating table and becomes a simple statement of what a business has and who paid for it.",
    howItWorks: [
      "Assets are everything the business controls.",
      "Liabilities are claims from everyone who is not an owner.",
      "Equity is the owners' residual claim — whatever is left.",
      "Every transaction changes at least two items, and the equation still holds afterwards.",
    ],
    formula: {
      calculates: "The structural relationship every balance sheet must satisfy",
      expression: "Assets = Liabilities + Equity",
      variables: [
        { symbol: "Assets", meaning: "Everything the business controls and expects future benefit from" },
        { symbol: "Liabilities", meaning: "Everything owed to non-owners" },
        { symbol: "Equity", meaning: "The owners' residual claim" },
      ],
    },
    example: {
      setup: "You start a business, then make three moves.",
      steps: [
        "You invest ₹10,00,000 cash. Assets +₹10,00,000; Equity +₹10,00,000. Equation holds.",
        "You borrow ₹5,00,000. Assets +₹5,00,000 (cash); Liabilities +₹5,00,000. Total assets ₹15,00,000 = ₹5,00,000 + ₹10,00,000.",
        "You buy an oven for ₹4,00,000 cash. Assets −₹4,00,000 cash, +₹4,00,000 equipment. Total unchanged at ₹15,00,000.",
      ],
      meaning:
        "The third move changed the shape of the assets but not the total, and touched neither liabilities nor equity. Swapping one asset for another creates no profit — a point that trips up almost every beginner.",
    },
    keyTerms: [
      { term: "Balance sheet", definition: "The statement showing assets, liabilities and equity at one point in time." },
      { term: "Residual claim", definition: "What owners hold — whatever remains after other claims." },
      { term: "Transaction", definition: "An economic event that the accounts record." },
    ],
    takeaways: [
      "Assets always equal liabilities plus equity.",
      "Every transaction preserves the equation.",
      "Exchanging one asset for another changes composition, not total value, and creates no profit.",
    ],
    commonMistakes: [
      "Thinking every transaction affects profit.",
      "Believing accountants force the balance sheet to balance — it balances because of how it is defined.",
    ],
    prerequisites: ["assets", "liabilities", "equity"],
  },
  {
    id: "double-entry-accounting",
    title: "Double-entry accounting",
    level: 1,
    module: "Accounting mechanics",
    order: 24,
    status: "authored",
    summary: "Recording both sides of every transaction, so nothing appears from nowhere.",
    concept:
      "Every business event has two sides. If cash leaves, something must have been received. If a sale is made, something must have been given up. Double-entry accounting simply insists that you record both sides. Doing so keeps the accounting equation intact automatically and makes many errors self-revealing.",
    whyItMatters:
      "Double entry is why financial statements tie together. If you understand that each event has two sides, the connection between the income statement, balance sheet and cash flow statement becomes obvious rather than mysterious.",
    howItWorks: [
      "Identify the real-world event first, before reaching for any accounting label.",
      "Ask what the business received and what it gave up.",
      "Record both, in equal amounts.",
      "Confirm that assets still equal liabilities plus equity.",
    ],
    example: {
      setup: "Four ordinary events at a bakery.",
      steps: [
        "Buy flour for ₹20,000 cash: inventory up ₹20,000, cash down ₹20,000. Assets swap; no profit.",
        "Buy flour for ₹20,000 on 30-day credit: inventory up ₹20,000, amount owed to supplier up ₹20,000.",
        "Sell bread for ₹5,000 cash that cost ₹2,000 to make: cash up ₹5,000, inventory down ₹2,000, equity up ₹3,000 via profit.",
        "Repay ₹20,000 to the supplier: cash down ₹20,000, amount owed down ₹20,000.",
      ],
      meaning:
        "Only the third event produced profit, because only there did the business give up something worth less than what it received. The other three rearranged the balance sheet.",
    },
    keyTerms: [
      { term: "Double entry", definition: "Recording both sides of every transaction in equal amounts." },
      { term: "Journal entry", definition: "The written record of one transaction's two sides." },
      { term: "Ledger", definition: "The collection of all accounts where entries accumulate." },
    ],
    takeaways: [
      "Every transaction is recorded twice, in equal amounts.",
      "Start from the business event, not from the accounting terminology.",
      "Profit arises only when what you receive is worth more than what you give up.",
    ],
    commonMistakes: [
      "Memorising rules without understanding the underlying event.",
      "Assuming cash movement and profit are the same thing.",
    ],
    prerequisites: ["accounting-equation"],
  },
  {
    id: "debits-and-credits",
    title: "Debits and credits",
    level: 1,
    module: "Accounting mechanics",
    order: 25,
    status: "authored",
    summary: "The two labels accountants use for the two sides of an entry. Neither means good or bad.",
    concept:
      "Debit and credit are just names for the left and right side of a journal entry. That is genuinely all they are. They do not mean increase and decrease, and they do not mean good and bad. Whether a debit raises or lowers an account depends entirely on what kind of account it is.",
    whyItMatters:
      "The vocabulary confuses beginners more than the concept does, largely because a bank statement uses the words from the bank's point of view — the opposite of yours. Getting this straight early removes a persistent source of confusion.",
    howItWorks: [
      "Debits increase assets and expenses; credits decrease them.",
      "Credits increase liabilities, equity and revenue; debits decrease them.",
      "Every entry must have total debits equal to total credits.",
      "Your bank 'crediting' your account records a liability increase in the bank's books — it owes you more. The words are from the bank's perspective, not yours.",
    ],
    example: {
      setup: "A business sells ₹50,000 of goods for cash and pays ₹8,000 rent.",
      steps: [
        "Sale: debit cash ₹50,000 (an asset increases), credit revenue ₹50,000. Debits = credits.",
        "Rent: debit rent expense ₹8,000 (an expense increases), credit cash ₹8,000 (an asset decreases).",
        "Net effect on cash: +₹50,000 − ₹8,000 = +₹42,000.",
      ],
      meaning:
        "Cash was debited in one entry and credited in the other. The same account moved in both directions depending on what happened — which is why 'debit means increase' is wrong as a general rule.",
    },
    keyTerms: [
      { term: "Debit", definition: "The left side of an entry. Increases assets and expenses." },
      { term: "Credit", definition: "The right side of an entry. Increases liabilities, equity and revenue." },
      { term: "Trial balance", definition: "A check that total debits equal total credits across all accounts." },
    ],
    takeaways: [
      "Debit and credit mean left and right, nothing more.",
      "The effect depends on the account type, not on the word.",
      "Total debits must always equal total credits.",
    ],
    commonMistakes: [
      "Reading credit as good and debit as bad.",
      "Carrying bank-statement intuition into accounting — the bank writes from its own perspective.",
    ],
    prerequisites: ["double-entry-accounting"],
  },
  {
    id: "chart-of-accounts",
    title: "Chart of accounts",
    level: 1,
    module: "Accounting mechanics",
    order: 26,
    status: "authored",
    summary: "The organised list of buckets a business sorts every transaction into.",
    concept:
      "A chart of accounts is the list of categories a business uses to file its transactions — cash, inventory, salaries, sales, loans, and so on. Every transaction must land in one of them. It is essentially a filing system, and how well it is designed determines whether the resulting reports can answer useful questions.",
    whyItMatters:
      "Financial statements are just the chart of accounts totalled and arranged. If the categories are too coarse, no amount of later analysis can recover the detail. If they are too fine, nobody maintains them properly.",
    howItWorks: [
      "Accounts are grouped into five families: assets, liabilities, equity, revenue and expenses.",
      "The first three appear on the balance sheet; the last two appear on the income statement.",
      "Each account usually has a code, so related accounts sort together.",
      "Design follows the questions management needs answered — split revenue by product only if someone will act on it.",
    ],
    example: {
      setup: "A small café's chart of accounts, in outline.",
      steps: [
        "Assets: 1000 Cash · 1100 Receivables · 1200 Inventory · 1500 Equipment.",
        "Liabilities: 2000 Supplier payables · 2100 Salaries payable · 2500 Bank loan.",
        "Equity: 3000 Owner capital · 3100 Retained earnings.",
        "Revenue: 4000 Coffee sales · 4100 Food sales. Expenses: 5000 Ingredients · 5100 Salaries · 5200 Rent.",
      ],
      meaning:
        "Because coffee and food sales are separate accounts, the owner can see which line is growing. Had both been booked to one 'Sales' account, that question would be unanswerable without re-reading every receipt.",
    },
    keyTerms: [
      { term: "Account", definition: "A single category that transactions are recorded into." },
      { term: "Account code", definition: "A number that groups and orders related accounts." },
      { term: "General ledger", definition: "The complete set of accounts and their balances." },
    ],
    takeaways: [
      "The chart of accounts is the filing system behind the financial statements.",
      "Five families: assets, liabilities, equity, revenue, expenses.",
      "The detail you capture now sets a ceiling on the analysis you can do later.",
    ],
    commonMistakes: [
      "Creating so many accounts that they are used inconsistently.",
      "Lumping unrelated costs into a single 'miscellaneous' account.",
    ],
    prerequisites: ["debits-and-credits"],
  },
  {
    id: "accrual-accounting",
    title: "Accrual accounting",
    level: 1,
    module: "Accounting mechanics",
    order: 27,
    status: "authored",
    summary: "Recording activity when it happens economically, not when the cash moves.",
    concept:
      "Accrual accounting records revenue when the business delivers what it promised, and records costs in the period they relate to — regardless of when money changes hands. The goal is to show what happened in a period, rather than what happened to be paid during it.",
    whyItMatters:
      "Almost every set of published accounts you will read is prepared on this basis, and it is the single biggest reason profit and cash differ. Understanding accruals is what lets you read a profit figure without being misled by it.",
    howItWorks: [
      "Revenue is recorded when the goods or services are delivered.",
      "Costs are matched to the revenue or period they relate to.",
      "If cash arrives before delivery, the business owes the customer a service — recorded as a liability, not revenue.",
      "If delivery happens before cash arrives, the business is owed money — recorded as a receivable.",
    ],
    example: {
      setup: "In December, a consultant completes ₹4,00,000 of work, invoices it, and is paid in February. She also pays ₹1,20,000 in December for a year of insurance starting in January.",
      steps: [
        "December revenue: ₹4,00,000 is recorded, because the work was done. A ₹4,00,000 receivable is created.",
        "December cash from that work: nil.",
        "December insurance expense: nil. The ₹1,20,000 buys next year's cover, so it sits as a prepaid asset.",
        "Each month of the next year, ₹10,000 moves from the prepaid asset into expense.",
      ],
      meaning:
        "December shows ₹4,00,000 of profit and a cash outflow of ₹1,20,000. Both are correct; they answer different questions. Accruals describe activity, cash describes liquidity.",
    },
    keyTerms: [
      { term: "Accrual", definition: "Recording an economic event when it occurs rather than when cash moves." },
      { term: "Matching", definition: "Recording costs in the same period as the revenue they helped generate." },
      { term: "Prepaid expense", definition: "Cash paid in advance for a benefit not yet received." },
      { term: "Deferred revenue", definition: "Cash received in advance for something not yet delivered." },
    ],
    takeaways: [
      "Accrual accounting records economic activity, not cash timing.",
      "It is the main reason profit differs from cash flow.",
      "Cash received before delivery is a liability, not revenue.",
    ],
    commonMistakes: [
      "Reading accrual profit as cash generated.",
      "Recording revenue on receipt of a customer deposit.",
    ],
    prerequisites: ["accounting-equation", "cash"],
  },
  {
    id: "cash-accounting",
    title: "Cash accounting",
    level: 1,
    module: "Accounting mechanics",
    order: 28,
    status: "authored",
    summary: "The simpler alternative: record everything when money actually moves.",
    concept:
      "Cash accounting records revenue when payment is received and costs when payment is made. It is simple, requires no judgement about timing, and matches the bank statement exactly. Its weakness is that it can badly misrepresent a period's activity.",
    whyItMatters:
      "Very small businesses often use it, and some tax regimes permit it. More importantly, understanding it by contrast is what makes accrual accounting click.",
    howItWorks: [
      "Money in is revenue on the day it arrives.",
      "Money out is expense on the day it leaves.",
      "No receivables, payables, prepayments or deferred revenue exist.",
      "Timing of payments, rather than timing of activity, drives reported results.",
    ],
    example: {
      setup: "The same consultant from the previous lesson: ₹4,00,000 of December work paid in February, ₹1,20,000 of insurance paid in December for next year.",
      steps: [
        "Cash basis December: revenue nil, expense ₹1,20,000, result = ₹1,20,000 loss.",
        "Cash basis February: revenue ₹4,00,000, no related cost, result = ₹4,00,000 profit.",
        "Accrual basis December: revenue ₹4,00,000, insurance expense nil, result = ₹4,00,000 profit.",
      ],
      meaning:
        "Cash accounting reports a loss in the month she did all the work and a large profit in a month she did none. Nothing was recorded incorrectly — the method simply tracks payment dates rather than activity.",
    },
    keyTerms: [
      { term: "Cash basis", definition: "Recording transactions only when money moves." },
      { term: "Accrual basis", definition: "Recording transactions when the economic event occurs." },
    ],
    takeaways: [
      "Cash accounting is simpler and matches the bank statement.",
      "It can seriously misstate which period the activity belonged to.",
      "Published company accounts are almost always on the accrual basis.",
    ],
    commonMistakes: [
      "Comparing a cash-basis result with an accrual-basis result as if they were the same measure.",
      "Assuming cash accounting is more truthful because it is simpler.",
    ],
    jurisdictionNote:
      "Eligibility to use the cash basis, and any turnover thresholds, are set by local tax and accounting rules and change over time. Check the rules in force in your jurisdiction.",
    prerequisites: ["accrual-accounting"],
  },
  {
    id: "revenue-recognition",
    title: "Revenue recognition",
    level: 1,
    module: "Accounting mechanics",
    order: 29,
    status: "authored",
    summary: "The rules deciding when a sale can be recorded as revenue.",
    concept:
      "Revenue recognition answers a deceptively hard question: at what moment has the business actually earned the money? Signing a contract is not enough. Receiving cash is not enough. The general principle in modern accounting standards is that revenue is recorded when the business has done what it promised — when control of the goods or services has passed to the customer.",
    whyItMatters:
      "Revenue is the top line, so how it is recognised affects every profit figure below it. It is also the area where aggressive accounting most often appears, because pulling future revenue into the current period is a tempting way to flatter results.",
    howItWorks: [
      "Identify what the business has promised the customer.",
      "Determine when control of that promise transfers — often on delivery.",
      "If several promises exist in one contract, split the price between them and recognise each as it is delivered.",
      "Cash received before delivery is recorded as deferred revenue, a liability.",
    ],
    example: {
      setup: "A software firm sells a 12-month subscription for ₹1,20,000, collected upfront on 1 January.",
      steps: [
        "1 January: cash increases ₹1,20,000. Deferred revenue liability increases ₹1,20,000. Revenue recorded: nil.",
        "Each month, one month of service is delivered: ₹10,000 moves from deferred revenue into revenue.",
        "By 30 June, ₹60,000 has been recognised and ₹60,000 remains as a liability.",
      ],
      meaning:
        "The firm holds all the cash from day one but has earned only part of it. The deferred revenue balance is a real obligation: if it stopped providing the service, it would owe the unearned portion back.",
    },
    keyTerms: [
      { term: "Performance obligation", definition: "A distinct promise made to the customer in a contract." },
      { term: "Transfer of control", definition: "The point at which the customer obtains the benefit of what was promised." },
      { term: "Deferred revenue", definition: "Cash received for something not yet delivered — a liability." },
      { term: "Unbilled revenue", definition: "Revenue earned but not yet invoiced." },
    ],
    takeaways: [
      "Revenue is recorded on delivery of the promise, not on signature or on payment.",
      "Cash received in advance is a liability until earned.",
      "Recognition timing is a common site of aggressive accounting — worth checking.",
    ],
    commonMistakes: [
      "Recording the full contract value as revenue on signing.",
      "Treating a customer deposit as revenue.",
      "Ignoring multiple deliverables bundled into one price.",
    ],
    jurisdictionNote:
      "Specific recognition criteria come from accounting standards (such as IFRS 15 or Ind AS 115) which are amended over time. The principle above is durable; the detailed rules are not.",
    prerequisites: ["accrual-accounting", "revenue"],
  },
  {
    id: "expenses",
    title: "Expenses",
    level: 1,
    module: "Accounting mechanics",
    order: 30,
    status: "authored",
    summary: "Costs recorded against the period they belong to, whether or not they have been paid.",
    concept:
      "An expense is a cost recognised in the income statement for a particular period. The key idea is matching: a cost belongs to the period whose revenue it helped produce, or to the period it simply relates to. Paying for something and expensing it are separate events that often happen at different times.",
    whyItMatters:
      "Which period a cost lands in determines reported profit. Understanding the difference between paying, expensing and capitalising is what lets you tell a genuinely profitable year from a well-timed one.",
    howItWorks: [
      "If a cost is consumed now, expense it now.",
      "If it is paid now but consumed later, hold it as a prepaid asset and expense it as it is used.",
      "If it is consumed now but paid later, record the expense now and an accrued liability alongside it.",
      "If it buys a benefit lasting several years, capitalise it as an asset and expense a portion each year.",
    ],
    example: {
      setup: "Four December costs at a firm with a December year-end.",
      steps: [
        "₹50,000 of electricity used in December, invoice arriving in January: expense ₹50,000 in December, with a ₹50,000 accrued liability.",
        "₹60,000 paid in December for January–March office cleaning: no December expense; ₹60,000 prepaid asset.",
        "₹80,000 of salaries for December work, paid in December: expense ₹80,000.",
        "₹6,00,000 for a delivery van expected to last 5 years: not an expense. Record a ₹6,00,000 asset and expense ₹1,20,000 a year.",
      ],
      meaning:
        "December cash out was ₹1,40,000 + ₹6,00,000 = ₹7,40,000, but December expense was ₹1,30,000 + ₹1,20,000 depreciation. Paying and expensing are genuinely different events.",
    },
    keyTerms: [
      { term: "Accrued expense", definition: "A cost incurred but not yet invoiced or paid." },
      { term: "Prepaid expense", definition: "A cost paid in advance of the benefit being received." },
      { term: "Capitalise", definition: "Record a cost as an asset because its benefit lasts beyond the current period." },
      { term: "Matching principle", definition: "Recording costs in the same period as the revenue they support." },
    ],
    takeaways: [
      "Expense recognition follows consumption, not payment.",
      "Costs with multi-year benefits are capitalised and expensed gradually.",
      "The gap between cash paid and expense recorded explains much of the profit-versus-cash difference.",
    ],
    commonMistakes: [
      "Expensing everything on payment.",
      "Capitalising costs that should be expensed, which flatters current profit.",
      "Forgetting to accrue for costs incurred but not yet invoiced.",
    ],
    prerequisites: ["accrual-accounting", "costs"],
  },

  // ── Module: Working capital & operating assets ──────────────────────────
  {
    id: "accounts-receivable",
    title: "Accounts receivable",
    level: 1,
    module: "Working capital & operating assets",
    order: 31,
    status: "authored",
    summary: "Money customers owe you for goods or services already delivered.",
    concept:
      "When you deliver first and get paid later, the amount owed to you is a receivable. It is an asset because you expect cash from it, but it is not cash — and it only becomes cash if the customer actually pays. Every rupee of receivables is a rupee of your money currently financing your customer.",
    whyItMatters:
      "Receivables are the most common reason a profitable business runs short of cash. Revenue can grow beautifully while collections lag, and the gap has to be funded from somewhere.",
    howItWorks: [
      "A sale on credit creates revenue and a receivable at the same moment.",
      "When the customer pays, the receivable turns into cash. No new revenue is recorded.",
      "If a customer will not pay, the receivable must be written down — reducing profit.",
      "Days sales outstanding (DSO) measures how long collection takes on average.",
    ],
    formula: {
      calculates: "Average number of days it takes to collect from customers",
      expression: "DSO = (Receivables ÷ Revenue) × 365",
      variables: [
        { symbol: "Receivables", meaning: "Amount owed by customers at the period end" },
        { symbol: "Revenue", meaning: "Sales for the period, usually a full year" },
      ],
    },
    example: {
      setup: "A business has annual revenue of ₹36,50,000 and year-end receivables of ₹6,00,000.",
      steps: [
        "DSO = (₹6,00,000 ÷ ₹36,50,000) × 365 = 60 days.",
        "The following year revenue grows to ₹50,00,000 but DSO slips to 90 days.",
        "New receivables = (90 ÷ 365) × ₹50,00,000 = ₹12,32,877.",
        "Cash tied up rose by ₹12,32,877 − ₹6,00,000 = ₹6,32,877.",
      ],
      meaning:
        "Revenue grew 37% and the business had to find an extra ₹6.3 lakh just to fund unpaid invoices. Growth consumed cash before it produced any.",
    },
    keyTerms: [
      { term: "Receivable", definition: "Money owed by a customer for goods or services already delivered." },
      { term: "DSO", definition: "Days sales outstanding — average days taken to collect." },
      { term: "Bad debt", definition: "A receivable that will not be collected." },
      { term: "Ageing", definition: "A breakdown of receivables by how overdue they are." },
    ],
    takeaways: [
      "A receivable is revenue already recognised but cash not yet received.",
      "Rising receivables consume cash, and growth makes this worse.",
      "Rising DSO alongside rising revenue is a warning worth investigating.",
    ],
    commonMistakes: [
      "Counting receivables as cash when assessing liquidity.",
      "Watching only the receivables total instead of its size relative to revenue.",
    ],
    prerequisites: ["revenue-recognition", "cash"],
  },
  {
    id: "accounts-payable",
    title: "Accounts payable",
    level: 1,
    module: "Working capital & operating assets",
    order: 32,
    status: "authored",
    summary: "Money you owe suppliers for goods or services you have already received.",
    concept:
      "Payables are the mirror image of receivables. You have taken delivery but not yet paid, so you owe the supplier. It is a liability — and, usefully, a source of free short-term funding, because most suppliers do not charge interest for standard credit terms.",
    whyItMatters:
      "Payables are how a business funds part of its operations without borrowing. Stretching them too far damages supplier relationships and can signal cash trouble; paying too quickly wastes free financing.",
    howItWorks: [
      "Receiving goods on credit creates both an expense or asset and a payable.",
      "Paying the supplier reduces cash and reduces the payable. No new expense arises.",
      "An increase in payables over a period is a source of cash.",
      "Days payable outstanding (DPO) measures how long the business takes to pay.",
    ],
    formula: {
      calculates: "Average number of days taken to pay suppliers",
      expression: "DPO = (Payables ÷ Cost of goods sold) × 365",
      variables: [
        { symbol: "Payables", meaning: "Amount owed to suppliers at the period end" },
        { symbol: "Cost of goods sold", meaning: "Direct cost of what was sold during the period" },
      ],
    },
    example: {
      setup: "A retailer has annual cost of goods sold of ₹73,00,000 and payables of ₹12,00,000.",
      steps: [
        "DPO = (₹12,00,000 ÷ ₹73,00,000) × 365 = 60 days.",
        "It negotiates 75-day terms. New payables = (75 ÷ 365) × ₹73,00,000 = ₹15,00,000.",
        "Cash released = ₹15,00,000 − ₹12,00,000 = ₹3,00,000.",
      ],
      meaning:
        "The extra 15 days of credit freed ₹3 lakh of cash permanently, with no borrowing. This is a genuine one-off benefit — but it happens once, and it does not repeat next year.",
    },
    keyTerms: [
      { term: "Payable", definition: "Money owed to a supplier for goods or services already received." },
      { term: "DPO", definition: "Days payable outstanding — average days taken to pay suppliers." },
      { term: "Trade credit", definition: "The credit period a supplier allows before payment is due." },
      { term: "Early-payment discount", definition: "A reduction offered for paying sooner than the standard terms." },
    ],
    takeaways: [
      "Payables are interest-free short-term funding from suppliers.",
      "Increasing payables releases cash; the benefit is one-off, not recurring.",
      "Sharply rising DPO can indicate deliberate strategy or genuine cash difficulty.",
    ],
    commonMistakes: [
      "Treating a payables increase as a permanent improvement in cash generation.",
      "Ignoring the cost of a forgone early-payment discount, which can be an expensive form of credit.",
    ],
    prerequisites: ["accounts-receivable", "expenses"],
  },
  {
    id: "inventory",
    title: "Inventory",
    level: 1,
    module: "Working capital & operating assets",
    order: 33,
    status: "authored",
    summary: "Goods held for sale, and the cash sitting inside them until they sell.",
    concept:
      "Inventory is what a business holds to sell: raw materials, part-finished goods and finished products. It is an asset, but a peculiar one — it is cash you have already spent that only returns when someone buys. Until then it takes up space, risks going out of date, and earns nothing.",
    whyItMatters:
      "Inventory is often the largest single consumer of cash in a product business. It also sits at the centre of the difference between profit and cash, because buying stock uses cash without creating any expense.",
    howItWorks: [
      "Buying stock converts cash into inventory. No expense is recorded.",
      "When an item sells, its cost moves from inventory into cost of goods sold, becoming an expense.",
      "Unsold or obsolete stock must be written down, which reduces profit.",
      "Days inventory outstanding (DIO) measures how long stock sits before selling.",
    ],
    formula: {
      calculates: "Average number of days inventory is held before being sold",
      expression: "DIO = (Inventory ÷ Cost of goods sold) × 365",
      variables: [
        { symbol: "Inventory", meaning: "Value of stock held at the period end" },
        { symbol: "Cost of goods sold", meaning: "Direct cost of goods sold during the period" },
      ],
    },
    example: {
      setup: "A clothing retailer buys ₹10,00,000 of stock in March and sells three-quarters of it by June for ₹18,00,000.",
      steps: [
        "March: cash −₹10,00,000, inventory +₹10,00,000. Profit effect: nil.",
        "By June, cost of the sold portion = ₹10,00,000 × 75% = ₹7,50,000.",
        "Gross profit = ₹18,00,000 − ₹7,50,000 = ₹10,50,000.",
        "₹2,50,000 of stock remains. If the season ends and it must be cleared at half price, ₹1,25,000 is written off against profit.",
      ],
      meaning:
        "The March purchase hit cash immediately but profit not at all. The unsold quarter is a risk sitting on the balance sheet — inventory is only worth its recorded value if someone eventually buys it at that price.",
    },
    keyTerms: [
      { term: "Cost of goods sold", definition: "The cost of the inventory that was actually sold in the period." },
      { term: "DIO", definition: "Days inventory outstanding — average days stock is held." },
      { term: "Write-down", definition: "Reducing inventory's recorded value when it cannot be sold at that price." },
      { term: "Obsolescence", definition: "Stock losing value because it is out of date or unwanted." },
    ],
    takeaways: [
      "Buying inventory consumes cash without creating an expense.",
      "Cost becomes an expense only when the item sells.",
      "Rising inventory alongside flat sales is one of the clearest early warning signs in a product business.",
    ],
    commonMistakes: [
      "Assuming inventory is worth its balance-sheet value regardless of demand.",
      "Overlooking that stockpiling drains cash while leaving reported profit untouched.",
    ],
    prerequisites: ["accounts-payable", "expenses"],
  },
  {
    id: "prepaid-expenses",
    title: "Prepaid expenses",
    level: 1,
    module: "Working capital & operating assets",
    order: 34,
    status: "authored",
    summary: "Costs paid in advance that have not yet been used up.",
    concept:
      "A prepaid expense is cash paid now for a benefit you will receive later — a year of insurance, rent paid in advance, an annual software licence. Because the benefit is still to come, it is an asset. It becomes an expense gradually, as the benefit is consumed.",
    whyItMatters:
      "Prepayments are a clear, small-scale illustration of accrual accounting. They also matter in forecasting: a prepayment is cash already gone, so future periods carry the expense without any further cash outflow.",
    howItWorks: [
      "Pay in advance: cash decreases, a prepaid asset increases. No expense yet.",
      "Each period, transfer the portion consumed from the asset into expense.",
      "By the end of the covered period, the asset has reduced to nil.",
      "The cash outflow happened once; the expense is spread across the periods benefited.",
    ],
    example: {
      setup: "On 1 April a business pays ₹2,40,000 for 12 months of insurance cover running April to March.",
      steps: [
        "1 April: cash −₹2,40,000, prepaid expenses +₹2,40,000. Expense recorded: nil.",
        "Monthly expense = ₹2,40,000 ÷ 12 = ₹20,000.",
        "At 30 June, three months consumed: expense to date ₹60,000, prepaid asset remaining ₹1,80,000.",
        "At 31 March: expense ₹2,40,000 in total, prepaid asset nil.",
      ],
      meaning:
        "Cash left in a single month, but the cost was borne across twelve. Judging April's performance by cash spent would have made a normal month look disastrous.",
    },
    keyTerms: [
      { term: "Prepaid expense", definition: "Cash paid in advance for a benefit not yet received." },
      { term: "Amortisation of prepayment", definition: "Moving the consumed portion from asset to expense each period." },
    ],
    takeaways: [
      "A prepayment is an asset because the benefit is still owed to you.",
      "Cash goes out once; the expense is recognised across the periods benefited.",
      "Future periods will carry expense with no matching cash outflow.",
    ],
    commonMistakes: [
      "Expensing the whole payment in the month it is paid.",
      "Forgetting to release the prepayment, so expense is understated in later periods.",
    ],
    prerequisites: ["expenses", "accrual-accounting"],
  },
  {
    id: "deferred-revenue",
    title: "Deferred revenue",
    level: 1,
    module: "Working capital & operating assets",
    order: 35,
    status: "authored",
    summary: "Cash collected for something you have not yet delivered — a liability, not revenue.",
    concept:
      "Deferred revenue arises when a customer pays before you deliver. You hold their money but still owe them the goods or service, so it is a liability. It becomes revenue only as you deliver. Beginners find this counter-intuitive: money in the bank appearing as an obligation.",
    whyItMatters:
      "Deferred revenue is common in subscriptions, maintenance contracts and anything sold annually upfront. It funds the business at no interest cost, and a growing balance is often a genuinely positive sign — customers are committing ahead.",
    howItWorks: [
      "Cash received in advance: cash increases, deferred revenue liability increases. No revenue.",
      "As delivery occurs, the liability decreases and revenue is recognised.",
      "A growing deferred revenue balance means the business is collecting faster than it delivers.",
      "The liability is real: undelivered service generally means the money is refundable.",
    ],
    example: {
      setup: "A gym sells 500 annual memberships at ₹24,000 each on 1 January, all collected upfront.",
      steps: [
        "1 January: cash +₹1,20,00,000; deferred revenue +₹1,20,00,000. Revenue recognised: nil.",
        "Monthly revenue as service is delivered = ₹1,20,00,000 ÷ 12 = ₹10,00,000.",
        "At 30 June: revenue recognised ₹60,00,000; deferred revenue remaining ₹60,00,000.",
      ],
      meaning:
        "In January the gym holds ₹1.2 crore of cash and has earned none of it. That cash funds six months of operations interest-free — but if it closed in June it would owe roughly ₹60 lakh back.",
    },
    keyTerms: [
      { term: "Deferred revenue", definition: "Cash received for goods or services not yet delivered." },
      { term: "Unearned revenue", definition: "Another name for deferred revenue." },
      { term: "Billings", definition: "Amounts invoiced in a period, which may differ from revenue recognised." },
    ],
    takeaways: [
      "Cash received before delivery is a liability, not revenue.",
      "It provides interest-free funding and often signals customer commitment.",
      "Revenue and cash collection can diverge dramatically in subscription businesses.",
    ],
    commonMistakes: [
      "Recording upfront collections as immediate revenue.",
      "Reading a rising deferred revenue balance as a problem — it usually indicates growth.",
    ],
    prerequisites: ["revenue-recognition"],
  },
  {
    id: "accrued-expenses",
    title: "Accrued expenses",
    level: 1,
    module: "Working capital & operating assets",
    order: 36,
    status: "authored",
    summary: "Costs you have already incurred but not yet been billed for or paid.",
    concept:
      "An accrued expense is a cost the business has already used but has not yet paid or even received an invoice for — electricity consumed this month, salaries earned but paid next month, interest that has built up since the last payment date. Accrual accounting requires recording it now, along with the liability.",
    whyItMatters:
      "Without accruals, a period's costs would be understated simply because invoices arrived late. Accruals are also where estimates enter the accounts, so they are worth understanding as a place where judgement is applied.",
    howItWorks: [
      "Identify costs consumed in the period but not yet invoiced or paid.",
      "Record the expense now and an accrued liability of the same amount.",
      "When the invoice is paid, cash and the liability both reduce. No new expense arises.",
      "Where the exact amount is unknown, a reasonable estimate is used and corrected later.",
    ],
    example: {
      setup: "A company's year ends 31 March. Staff earned ₹15,00,000 in March, paid on 5 April. Electricity used in March, billed ₹2,40,000 in April.",
      steps: [
        "31 March: record ₹15,00,000 salary expense and a ₹15,00,000 accrued liability.",
        "31 March: record ₹2,40,000 electricity expense and a ₹2,40,000 accrued liability.",
        "March profit is reduced by ₹17,40,000 even though no cash moved in March.",
        "April: paying both reduces cash and the liabilities by ₹17,40,000. April expense: nil.",
      ],
      meaning:
        "Without these accruals, March would have shown ₹17.4 lakh more profit than it earned, and April would have absorbed costs belonging to March.",
    },
    keyTerms: [
      { term: "Accrued expense", definition: "A cost incurred but not yet invoiced or paid." },
      { term: "Accrued liability", definition: "The balance sheet obligation created by an accrued expense." },
      { term: "Reversal", definition: "Removing an accrual once the actual invoice is recorded." },
    ],
    takeaways: [
      "Accruals record costs in the period they were incurred, regardless of invoicing.",
      "They create a liability that is settled later with no further expense.",
      "They involve estimates, making them a normal point of judgement in accounts.",
    ],
    commonMistakes: [
      "Waiting for an invoice before recording a cost.",
      "Double-counting by recording both the accrual and the invoice as expenses.",
    ],
    prerequisites: ["expenses", "accrual-accounting"],
  },
  {
    id: "working-capital",
    title: "Working capital",
    level: 1,
    module: "Working capital & operating assets",
    order: 37,
    status: "authored",
    summary: "The cash tied up in day-to-day operations: stock and unpaid invoices, less supplier credit.",
    concept:
      "Working capital is the money locked into running the business day to day. You have cash sitting in inventory and in invoices customers have not paid, offset by invoices you have not paid your suppliers. The net figure is the amount your business must fund out of its own resources simply to operate.",
    whyItMatters:
      "Working capital is where the profit-versus-cash gap becomes concrete. A growing business needs more stock and carries more unpaid invoices, so growth itself absorbs cash. This is the mechanism behind most cash crises at otherwise healthy companies.",
    howItWorks: [
      "Add operating current assets: mainly inventory and receivables.",
      "Subtract operating current liabilities: mainly payables and accrued expenses.",
      "The result is what the business must finance itself.",
      "An increase in working capital consumes cash; a decrease releases it.",
    ],
    formula: {
      calculates: "Cash tied up in day-to-day operations",
      expression: "Operating working capital = Inventory + Receivables − Payables",
      variables: [
        { symbol: "Inventory", meaning: "Stock held for sale" },
        { symbol: "Receivables", meaning: "Amounts owed by customers" },
        { symbol: "Payables", meaning: "Amounts owed to suppliers" },
      ],
    },
    example: {
      setup: "A distributor's balances at the start and end of a year in which revenue grew 40%.",
      steps: [
        "Start: inventory ₹20,00,000 + receivables ₹15,00,000 − payables ₹12,00,000 = ₹23,00,000.",
        "End: inventory ₹28,00,000 + receivables ₹21,00,000 − payables ₹16,00,000 = ₹33,00,000.",
        "Increase in working capital = ₹33,00,000 − ₹23,00,000 = ₹10,00,000.",
      ],
      meaning:
        "Growth absorbed ₹10 lakh of cash. If the year's profit was ₹8 lakh, the business generated less cash than it earned in profit — and needed outside funding despite trading well.",
    },
    keyTerms: [
      { term: "Operating working capital", definition: "Operating current assets less operating current liabilities." },
      { term: "Working capital cycle", definition: "The time from paying for stock to collecting from customers." },
      { term: "Cash release", definition: "Cash freed when working capital falls." },
    ],
    takeaways: [
      "Working capital is cash locked into operations.",
      "Growth increases working capital and therefore consumes cash.",
      "Profitable, fast-growing companies can and do run out of money this way.",
    ],
    commonMistakes: [
      "Forgetting to fund working capital when planning growth.",
      "Reading a working-capital reduction as an efficiency gain when it is actually collapsing sales.",
    ],
    prerequisites: ["inventory", "accounts-receivable", "accounts-payable"],
  },

  // ── Module: Long-lived assets & equity ──────────────────────────────────
  {
    id: "depreciation",
    title: "Depreciation",
    level: 1,
    module: "Long-lived assets & equity",
    order: 38,
    status: "authored",
    summary: "Spreading the cost of a long-lived physical asset across the years it is used.",
    concept:
      "When a business buys something that will last several years — a machine, a vehicle, a building — charging the whole cost to the year of purchase would misrepresent that year and flatter every year afterwards. Depreciation spreads the cost across the asset's useful life instead. Cash leaves once; the expense is recognised gradually.",
    whyItMatters:
      "Depreciation is the largest non-cash expense in most asset-heavy businesses. Understanding it is what lets you reconcile profit to cash, and it is the reason measures like EBITDA exist at all.",
    howItWorks: [
      "Record the purchase as an asset, not an expense. Cash falls; the asset rises.",
      "Estimate how long it will be useful and what it might be worth at the end.",
      "Charge a portion of the cost as an expense each year over that life.",
      "The asset's recorded value falls each year by the amount charged.",
    ],
    formula: {
      calculates: "Annual depreciation charge under the straight-line method",
      expression: "Annual depreciation = (Cost − Residual value) ÷ Useful life",
      variables: [
        { symbol: "Cost", meaning: "What was paid for the asset" },
        { symbol: "Residual value", meaning: "Estimated value at the end of its useful life" },
        { symbol: "Useful life", meaning: "Number of years it is expected to be used" },
      ],
    },
    example: {
      setup: "A delivery van costs ₹12,00,000, is expected to last 6 years, and to be worth ₹1,20,000 at the end.",
      steps: [
        "Depreciable amount = ₹12,00,000 − ₹1,20,000 = ₹10,80,000.",
        "Annual depreciation = ₹10,80,000 ÷ 6 = ₹1,80,000.",
        "Year 1: expense ₹1,80,000; asset carried at ₹12,00,000 − ₹1,80,000 = ₹10,20,000.",
        "Year 3: cumulative depreciation ₹5,40,000; asset carried at ₹6,60,000.",
      ],
      meaning:
        "₹12,00,000 of cash left in year one, but only ₹1,80,000 hit profit. In years 2 to 6, profit is reduced by ₹1,80,000 annually with no cash leaving at all. This is exactly why profit and cash flow diverge.",
    },
    keyTerms: [
      { term: "Useful life", definition: "How long the asset is expected to be used — an estimate." },
      { term: "Residual value", definition: "Expected value at the end of the useful life." },
      { term: "Straight-line method", definition: "Charging an equal amount each year." },
      { term: "Net book value", definition: "Original cost less accumulated depreciation." },
      { term: "Non-cash expense", definition: "An expense that reduces profit without any cash leaving." },
    ],
    takeaways: [
      "Depreciation spreads a past cash outflow across the years of benefit.",
      "It reduces profit without reducing cash.",
      "Useful life and residual value are estimates, so depreciation involves judgement.",
    ],
    commonMistakes: [
      "Treating depreciation as money being set aside — nothing is saved.",
      "Assuming net book value reflects what the asset would sell for.",
      "Thinking depreciation can be ignored because it is non-cash — the asset will eventually need replacing with real money.",
    ],
    prerequisites: ["expenses", "assets"],
  },
  {
    id: "amortization",
    title: "Amortization",
    level: 1,
    module: "Long-lived assets & equity",
    order: 39,
    status: "authored",
    summary: "Depreciation's equivalent for intangible assets like software, patents and licences.",
    concept:
      "Amortisation is the same idea as depreciation, applied to assets you cannot touch: purchased software, patents, licences, customer contracts. The cost is spread across the period the asset is expected to be useful. The word differs only because the asset is intangible.",
    whyItMatters:
      "Intangible assets dominate the balance sheets of software, pharmaceutical and media businesses. In those companies amortisation, not depreciation, is the major non-cash charge, and it heavily affects reported profit.",
    howItWorks: [
      "Capitalise the cost of acquiring the intangible asset.",
      "Estimate the period over which it will provide benefit — often set by a legal or contractual term.",
      "Charge an equal portion as expense each year.",
      "Some intangibles with no foreseeable end to their usefulness are not amortised, and are instead tested for impairment.",
    ],
    formula: {
      calculates: "Annual amortisation charge",
      expression: "Annual amortisation = Cost ÷ Useful life",
      variables: [
        { symbol: "Cost", meaning: "Amount paid to acquire the intangible asset" },
        { symbol: "Useful life", meaning: "Years of expected benefit, often a legal or contract term" },
      ],
    },
    example: {
      setup: "A company buys a 10-year patent licence for ₹50,00,000.",
      steps: [
        "Annual amortisation = ₹50,00,000 ÷ 10 = ₹5,00,000.",
        "Year 1: expense ₹5,00,000; carrying value ₹45,00,000.",
        "Year 5: cumulative ₹25,00,000; carrying value ₹25,00,000.",
        "Cash outflow: ₹50,00,000, all in year 1.",
      ],
      meaning:
        "The full ₹50 lakh left the bank immediately, but profit absorbs it at ₹5 lakh a year for a decade. Anyone comparing this company's profit to its cash generation must account for that difference.",
    },
    keyTerms: [
      { term: "Intangible asset", definition: "A non-physical asset such as software, a patent or a licence." },
      { term: "Amortisation", definition: "Spreading an intangible asset's cost over its useful life." },
      { term: "Impairment", definition: "Writing an asset down when it is worth less than its carrying value." },
      { term: "Indefinite life", definition: "An intangible with no foreseeable end to its usefulness; tested rather than amortised." },
    ],
    takeaways: [
      "Amortisation is depreciation for intangible assets.",
      "It is a non-cash expense that reduces profit without reducing cash.",
      "Intangible-heavy businesses can show weak profit alongside strong cash generation.",
    ],
    commonMistakes: [
      "Assuming intangible assets are unimportant because they are not physical.",
      "Confusing amortisation of an asset with amortisation of a loan, which means scheduled principal repayment.",
    ],
    prerequisites: ["depreciation"],
  },
  {
    id: "ppe",
    title: "PP&E",
    level: 1,
    module: "Long-lived assets & equity",
    order: 40,
    status: "authored",
    summary: "Property, plant and equipment — the physical assets a business uses to operate.",
    concept:
      "PP&E stands for property, plant and equipment: land, buildings, machinery, vehicles, fittings. These are assets the business uses to produce goods or services rather than assets it intends to sell. They are recorded at cost and then reduced each year by depreciation.",
    whyItMatters:
      "PP&E tells you how capital-intensive a business is. A company needing ₹100 of equipment for every ₹100 of revenue is a fundamentally different investment from one needing ₹10, because it must keep spending to stay in business.",
    howItWorks: [
      "Buying PP&E is capital expenditure — cash out, asset up, no immediate expense.",
      "Depreciation reduces the asset's carrying value and reduces profit each year.",
      "The closing balance is roughly the opening balance plus new spending less depreciation.",
      "Spending consistently below depreciation means the asset base is shrinking.",
    ],
    formula: {
      calculates: "How the PP&E balance rolls forward across a period",
      expression: "Closing PP&E = Opening PP&E + Capital expenditure − Depreciation",
      variables: [
        { symbol: "Opening PP&E", meaning: "Net book value at the start of the period" },
        { symbol: "Capital expenditure", meaning: "Cash spent on new long-lived assets" },
        { symbol: "Depreciation", meaning: "The charge for the period" },
      ],
    },
    example: {
      setup: "A manufacturer opens the year with ₹80 crore of PP&E, spends ₹12 crore on new machinery and records ₹15 crore of depreciation.",
      steps: [
        "Closing PP&E = ₹80 crore + ₹12 crore − ₹15 crore = ₹77 crore.",
        "The base shrank by ₹3 crore despite ₹12 crore of spending.",
        "Repeat this for five years and the asset base falls to roughly ₹65 crore.",
      ],
      meaning:
        "Spending less than depreciation means the equipment is wearing out faster than it is being replaced. Reported profit looks fine today, but the business is quietly consuming its own capacity.",
    },
    keyTerms: [
      { term: "Capital expenditure (capex)", definition: "Cash spent acquiring or improving long-lived assets." },
      { term: "Gross PP&E", definition: "Original cost of all such assets before depreciation." },
      { term: "Net PP&E", definition: "Gross PP&E less accumulated depreciation." },
      { term: "Maintenance capex", definition: "Spending needed just to keep the existing asset base intact." },
    ],
    takeaways: [
      "PP&E is the physical asset base used to operate, not to sell.",
      "It rolls forward as opening balance plus capex less depreciation.",
      "Capex persistently below depreciation is a warning sign about future capacity.",
    ],
    commonMistakes: [
      "Treating capex as an expense in the year it is paid.",
      "Assuming net PP&E approximates market value.",
      "Reading low capex as good cost discipline without checking whether assets are being run down.",
    ],
    prerequisites: ["depreciation", "assets"],
  },
  {
    id: "goodwill",
    title: "Goodwill",
    level: 1,
    module: "Long-lived assets & equity",
    order: 41,
    status: "authored",
    summary: "The premium paid to buy a business above the value of its identifiable net assets.",
    concept:
      "Goodwill appears only when one business buys another. If the buyer pays more than the fair value of the identifiable assets less liabilities acquired, the excess is recorded as goodwill. It represents things that have value but cannot be listed separately: reputation, workforce, customer relationships, expected synergies.",
    whyItMatters:
      "Goodwill is the accounting record of what a buyer paid over identifiable value — in effect, a permanent public record of whether the price was justified. Large goodwill write-offs are usually an admission that an acquisition did not work out.",
    howItWorks: [
      "Measure the fair value of the identifiable assets and liabilities acquired.",
      "Compare that to the purchase price paid.",
      "Record the excess as goodwill on the buyer's balance sheet.",
      "Goodwill is generally not amortised; it is tested periodically and written down if the business is worth less than carried.",
    ],
    formula: {
      calculates: "The premium recorded on an acquisition",
      expression: "Goodwill = Purchase price − Fair value of identifiable net assets acquired",
      variables: [
        { symbol: "Purchase price", meaning: "Total consideration paid for the business" },
        { symbol: "Fair value of identifiable net assets", meaning: "Identifiable assets less liabilities, at fair value" },
      ],
    },
    example: {
      setup: "Company A buys Company B for ₹500 crore. B's identifiable assets are worth ₹420 crore and its liabilities ₹150 crore.",
      steps: [
        "Identifiable net assets = ₹420 crore − ₹150 crore = ₹270 crore.",
        "Goodwill = ₹500 crore − ₹270 crore = ₹230 crore.",
        "Two years later B is struggling and judged to be worth ₹350 crore in total.",
        "Goodwill is written down, producing a large non-cash loss in that year's profit.",
      ],
      meaning:
        "The ₹230 crore was paid for expectations. If those expectations fail, the write-down does not remove any cash — the cash left at purchase — but it publicly records that the price was too high.",
    },
    keyTerms: [
      { term: "Fair value", definition: "The amount an asset or liability would exchange for between willing parties." },
      { term: "Identifiable net assets", definition: "Assets and liabilities that can be recognised separately." },
      { term: "Impairment", definition: "Writing goodwill down when the acquired business is worth less than carried." },
      { term: "Synergy", definition: "Expected benefit from combining two businesses." },
    ],
    takeaways: [
      "Goodwill only arises from acquiring another business.",
      "It is the excess of price paid over identifiable net assets.",
      "An impairment is non-cash but is a meaningful admission about a past decision.",
    ],
    commonMistakes: [
      "Thinking a company can create goodwill from its own strong brand — internally generated goodwill is not recognised.",
      "Dismissing impairments as irrelevant because they are non-cash.",
    ],
    prerequisites: ["assets", "equity"],
  },
  {
    id: "intangible-assets",
    title: "Intangible assets",
    level: 1,
    module: "Long-lived assets & equity",
    order: 42,
    status: "authored",
    summary: "Assets with real value that you cannot physically touch.",
    concept:
      "Intangible assets are non-physical resources expected to produce future benefit: patents, trademarks, licences, purchased software, customer lists. They are recognised when they are identifiable and were acquired or developed under conditions the accounting rules permit. Crucially, most internally built brand value never appears on a balance sheet at all.",
    whyItMatters:
      "In modern economies much of a company's real value is intangible, yet accounting recognises only part of it. This is why market values and book values diverge most dramatically for software, consumer-brand and pharmaceutical companies.",
    howItWorks: [
      "Purchased intangibles are recorded at cost and usually amortised over their useful life.",
      "Internally generated brands and most research spending are expensed as incurred, not capitalised.",
      "Some development costs may be capitalised if strict criteria are met.",
      "Intangibles with indefinite lives are tested for impairment rather than amortised.",
    ],
    example: {
      setup: "Two consumer companies, each with a brand a valuer would price at ₹1,000 crore.",
      steps: [
        "Company X built its brand over 40 years of advertising, all expensed as incurred.",
        "Company Y acquired an identical brand for ₹1,000 crore in an acquisition.",
        "X's balance sheet shows ₹0 of brand value. Y's shows ₹1,000 crore.",
      ],
      meaning:
        "Two economically identical assets, one visible and one invisible. This is why book value is a poor guide to worth for brand-driven businesses, and why comparing them on book-value ratios can mislead.",
    },
    keyTerms: [
      { term: "Identifiable intangible", definition: "An intangible that can be separated and valued on its own." },
      { term: "Internally generated intangible", definition: "One built by the business itself, usually not recognised." },
      { term: "Useful life", definition: "The period over which an intangible is expected to provide benefit." },
      { term: "Research and development", definition: "Spending on new products; research is expensed, development sometimes capitalised." },
    ],
    takeaways: [
      "Intangibles can be a company's most valuable assets while being largely absent from its balance sheet.",
      "Acquired intangibles are recognised; internally built ones usually are not.",
      "Book value understates worth most severely for intangible-heavy businesses.",
    ],
    commonMistakes: [
      "Assuming a low book value means few valuable assets.",
      "Comparing book-value ratios across companies with very different intangible profiles.",
    ],
    jurisdictionNote:
      "Which development costs may be capitalised differs between accounting frameworks (IFRS/Ind AS versus US GAAP) and is subject to revision. Check the framework a company reports under.",
    prerequisites: ["amortization", "goodwill"],
  },
  {
    id: "retained-earnings",
    title: "Retained earnings",
    level: 1,
    module: "Long-lived assets & equity",
    order: 43,
    status: "authored",
    summary: "The running total of all profits the business has kept rather than paid out to owners.",
    concept:
      "Retained earnings is the accumulated total of every profit the business has ever made, less every loss and every dividend paid. It sits inside equity and is the link between the income statement and the balance sheet: this year's profit flows into it, increasing the owners' stake.",
    whyItMatters:
      "Retained earnings is the connection point that makes the three financial statements tie together. It is also the cheapest source of funding a business has — profit it already owns, requiring no borrowing and no new shares.",
    howItWorks: [
      "Start with the retained earnings balance from the end of last period.",
      "Add this period's net profit, or subtract the loss.",
      "Subtract any dividends declared to owners.",
      "The result is the closing balance, which appears within equity.",
    ],
    formula: {
      calculates: "How retained earnings roll forward between periods",
      expression: "Closing retained earnings = Opening retained earnings + Net profit − Dividends",
      variables: [
        { symbol: "Opening retained earnings", meaning: "Accumulated retained profit at the start" },
        { symbol: "Net profit", meaning: "Profit for the period after all costs, interest and tax" },
        { symbol: "Dividends", meaning: "Profit distributed to owners during the period" },
      ],
    },
    example: {
      setup: "A company opens the year with ₹45 crore of retained earnings, earns ₹12 crore and pays a ₹4 crore dividend.",
      steps: [
        "Closing retained earnings = ₹45 crore + ₹12 crore − ₹4 crore = ₹53 crore.",
        "Equity rises by ₹8 crore without any new investment from owners.",
        "The following year it makes a ₹6 crore loss and pays no dividend: ₹53 crore − ₹6 crore = ₹47 crore.",
      ],
      meaning:
        "A large retained earnings balance means the business has been profitable and has kept those profits. It does not mean there is cash available — that money was long ago spent on stock, equipment and receivables.",
    },
    keyTerms: [
      { term: "Retained earnings", definition: "Cumulative profits kept in the business rather than distributed." },
      { term: "Dividend", definition: "A distribution of profit to owners." },
      { term: "Accumulated deficit", definition: "A negative retained earnings balance, from cumulative losses." },
      { term: "Payout ratio", definition: "The share of profit paid out as dividends." },
    ],
    takeaways: [
      "Retained earnings accumulate profit less dividends over the company's whole life.",
      "It is the link that carries the income statement result onto the balance sheet.",
      "A large balance says nothing about available cash.",
    ],
    commonMistakes: [
      "Assuming retained earnings sit in a bank account somewhere.",
      "Forgetting that dividends reduce equity without ever appearing in the income statement.",
    ],
    prerequisites: ["equity", "profit"],
  },
];
