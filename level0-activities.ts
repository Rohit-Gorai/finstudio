import type { TopicActivities } from "./types";

/**
 * Level 0 activities, keyed by lesson id. Every practice set and quiz is
 * written for its specific topic — numbers, scenarios and misconceptions are
 * the ones that belong to that lesson, never a shared template.
 */
export const level0Activities: Record<string, TopicActivities> = {
  "what-is-finance": {
    practice: [
      { question: "You lend ₹50,000 to a friend's business for one year at 12%. How much are you owed at the end, and what two things is the extra amount paying you for?", solution: "₹50,000 × 12% = ₹6,000, so you are owed ₹56,000. The ₹6,000 pays you for waiting a year and for the risk the business cannot repay." },
      { question: "Name the two sides present in every financial arrangement, and say which side a fixed-deposit holder is on.", solution: "A supplier of money and a user of money. A fixed-deposit holder supplies money — the bank uses it and pays for the privilege." },
      { question: "A government bond pays 7% and a small startup loan offers 18%. Using the time-and-risk idea, explain the 11-point gap in one sentence.", solution: "Both tie money up for time, but the startup is far more likely not to repay, so lenders demand roughly 11 extra points as payment for that risk." },
    ],
    quiz: [
      { question: "At its core, finance is about…", choices: ["Predicting stock prices", "Moving money between those who have it and those who can use it, at a price", "Avoiding all risk", "Accounting rules"], answer: 1, explanation: "Savings accounts, loans, bonds and shares are all mechanisms for moving money between suppliers and users, priced for time and risk." },
      { question: "You lend ₹1,00,000 at 9% for a year. The ₹9,000 compensates you for…", choices: ["Inflation only", "The lender's paperwork", "Waiting, plus the chance of not being repaid", "Nothing — it is a gift"], answer: 2, explanation: "Every return decomposes into a price for time and a price for risk. Here ₹9,000 covers a year of waiting and the repayment risk." },
      { question: "Which of these is NOT a supplier of capital?", choices: ["A saver with a bank deposit", "A bond buyer", "A shareholder", "A company borrowing for a new factory"], answer: 3, explanation: "The borrowing company is the user of capital. Savers, bond buyers and shareholders all supply money and expect more back later." },
    ],
    sandbox: {
      kind: "future-value", title: "Lending sandbox",
      prompt: "Set an amount and a rate and see what you would be owed. Then raise the rate and ask: what risk would justify it?",
      fields: [
        { key: "principal", label: "Amount lent", defaultValue: 100000, unit: "₹" },
        { key: "rate", label: "Rate per year", defaultValue: 9, unit: "%" },
        { key: "years", label: "Years", defaultValue: 1 },
      ],
    },
  },

  "personal-corporate-investing": {
    practice: [
      { question: "You have ₹2,00,000, a personal loan at 15%, and a mutual fund expected to return 12%. Which use of the money wins, and by how much per year?", solution: "Repaying the loan saves a certain 15% = ₹30,000 a year; the fund offers an uncertain 12% = ₹24,000. Repayment wins by ₹6,000 — and by certainty." },
      { question: "Classify each question: (a) Should Tata Motors build a new plant? (b) Is Tata Motors stock cheap at today's price? (c) Should I sell my Tata stock to fund a home deposit?", solution: "(a) corporate finance, (b) investing, (c) personal finance. Same company, three different decision-makers and tools." },
      { question: "A friend says 'It's a brilliant company, so buy the stock at any price.' Which two settings are being confused?", solution: "Corporate quality (a corporate-finance judgement) and investment attractiveness (which depends on price). A great company at too high a price is a poor investment." },
    ],
    quiz: [
      { question: "'Is this share worth ₹500?' is fundamentally a question of…", choices: ["Personal finance", "Corporate finance", "Investing", "Accounting"], answer: 2, explanation: "Investing asks whether an asset is attractive at a given price. Whether the company itself is well run is a separate question." },
      { question: "You carry a credit-card balance at 36% and have spare cash. The soundest first move is usually…", choices: ["A stock expected to return 14%", "Repaying the card", "A fixed deposit at 7%", "Keeping cash idle"], answer: 1, explanation: "Repayment is a guaranteed 36% saving. Almost no investment offers a certain return anywhere near that." },
      { question: "Corporate finance primarily decides…", choices: ["Which stocks households should buy", "Which projects a company funds and how it raises the money", "Government tax policy", "Exchange trading hours"], answer: 1, explanation: "Corporate finance is the company's own investment and funding decisions, made with shareholders' capital." },
    ],
    sandbox: {
      kind: "opportunity", title: "Invest or repay?",
      prompt: "Compare an investment's return with the loan rate you could avoid. Notice when the 'profitable' option still loses.",
      fields: [
        { key: "amount", label: "Money available", defaultValue: 500000, unit: "₹" },
        { key: "chosenReturn", label: "Investment return", defaultValue: 11, unit: "%" },
        { key: "alternativeReturn", label: "Loan rate you could repay", defaultValue: 14, unit: "%" },
      ],
    },
  },

  "financial-markets": {
    practice: [
      { question: "A company raises ₹200 crore in an IPO. Next week ₹500 crore of its shares trade on the exchange. How much of that ₹500 crore reaches the company?", solution: "Nothing. The ₹200 crore primary issue funded the company; the ₹500 crore is secondary trading — ownership changing hands between investors." },
      { question: "A share quotes bid ₹98 / ask ₹100. You buy at the ask and immediately sell at the bid. What did the round trip cost as a percentage?", solution: "You paid ₹100 and received ₹98: a ₹2 loss on ₹100 = 2%. The bid-ask spread is the cost of immediacy." },
      { question: "Why is 'the last traded price' a shaky estimate of what you would get for selling a very large holding?", solution: "The last price reflects one recent, typically small trade. A large sale must find many buyers, and pushing through the available bids moves the price down — the liquidity problem." },
    ],
    quiz: [
      { question: "In which market does a company actually receive money?", choices: ["Secondary market", "Primary market", "Both equally", "Neither"], answer: 1, explanation: "Only primary issuance — new shares or bonds sold by the issuer — funds the company. Secondary trading moves ownership between investors." },
      { question: "The bid is…", choices: ["The lowest price a seller will accept", "The highest price a buyer will pay", "Yesterday's closing price", "The IPO price"], answer: 1, explanation: "Buyers post bids; sellers post asks. Trades happen where they meet, and the gap between them is a real trading cost." },
      { question: "A liquid market is one where…", choices: ["Prices only rise", "You can trade size without moving the price much", "There are no sellers", "The government sets prices"], answer: 1, explanation: "Liquidity is the ability to buy or sell near the prevailing price. Thin markets punish large orders." },
    ],
  },

  "companies-and-capital": {
    practice: [
      { question: "A bakery needs ₹50 lakh: ₹30 lakh from you, ₹20 lakh borrowed at 10%. It earns ₹8 lakh before interest. What do you keep, and what return is that on your money?", solution: "Interest = ₹2,00,000. You keep ₹6,00,000 on ₹30,00,000 invested = 20%." },
      { question: "Same bakery earns only ₹1,50,000 before interest in a bad year. What happens?", solution: "Interest of ₹2,00,000 is still owed in full. You are ₹50,000 short and must fund the gap — the lender's claim does not flex with performance." },
      { question: "Why is debt cheaper than equity for the same business?", solution: "Lenders are paid first and their return is fixed, so they bear less risk. Less risk borne means less compensation demanded." },
    ],
    quiz: [
      { question: "The residual claim on a business belongs to…", choices: ["Suppliers", "Lenders", "Owners", "Employees"], answer: 2, explanation: "Owners get whatever remains after every other claim — unlimited upside, first in line for losses." },
      { question: "A company earns ₹10 crore before interest and owes ₹3 crore of interest. In a year it earns only ₹2 crore, the interest owed is…", choices: ["₹0", "₹2 crore", "₹3 crore", "Whatever the owners decide"], answer: 2, explanation: "Interest is contractual. It is ₹3 crore whether the year was good or terrible — that fixity is the whole nature of debt." },
      { question: "There are fundamentally how many sources of capital for a business?", choices: ["One", "Two — owners and lenders", "Four", "Unlimited"], answer: 1, explanation: "Every instrument, however exotic, is a variation on owner money (equity) or borrowed money (debt)." },
    ],
    sandbox: {
      kind: "leverage-returns", title: "Owner vs lender sandbox",
      prompt: "Cut operating profit in half and watch what happens to the owners' return while the lender's interest stays fixed.",
      fields: [
        { key: "operatingProfit", label: "Profit before interest", defaultValue: 800000, unit: "₹" },
        { key: "debt", label: "Borrowed", defaultValue: 2000000, unit: "₹" },
        { key: "interestRate", label: "Interest rate", defaultValue: 10, unit: "%" },
        { key: "equity", label: "Owner money", defaultValue: 3000000, unit: "₹" },
      ],
    },
  },

  "revenue": {
    practice: [
      { question: "A café sells 20,000 cups at ₹150. Next year volume rises 10% and price rises 5%. Calculate both years' revenue and the growth rate.", solution: "Year 1: 20,000 × ₹150 = ₹30,00,000. Year 2: 22,000 × ₹157.50 = ₹34,65,000. Growth = 15.5% — more than 10% + 5% because the effects multiply." },
      { question: "A firm reports 18% revenue growth, of which 12 points came from an acquisition. What was organic growth, and why does the split matter?", solution: "Organic growth ≈ 6%. Acquired revenue was bought, not grown; it says little about whether existing customers are buying more." },
      { question: "A software company invoices ₹40 lakh in March, collecting in May. What does March's income statement show, and what appears on the balance sheet?", solution: "March revenue of ₹40 lakh, because delivery happened. A ₹40 lakh receivable appears — revenue recognised, cash not yet received." },
    ],
    quiz: [
      { question: "A shop sells goods worth ₹5,00,000 in June; customers pay in July. June revenue is…", choices: ["₹0", "₹5,00,000", "₹2,50,000", "Whatever cash arrived"], answer: 1, explanation: "Revenue follows delivery, not payment. June also gains a ₹5,00,000 receivable." },
      { question: "Price rises 10% and volume rises 10%. Revenue rises…", choices: ["Exactly 20%", "21%", "10%", "It cannot be determined"], answer: 1, explanation: "1.10 × 1.10 = 1.21. Price and volume growth multiply rather than add." },
      { question: "Which is a warning sign about growth quality?", choices: ["Growth driven by volume", "Growth driven entirely by an acquisition presented as organic", "Growth with stable prices", "Growth in a new region"], answer: 1, explanation: "Acquired revenue is purchased. Presenting it as organic growth misstates how the underlying business is performing." },
    ],
    sandbox: {
      kind: "revenue-growth", title: "Price × volume sandbox",
      prompt: "Predict the growth rate before you look — then check why 10% + 5% gives more than 15%.",
      fields: [
        { key: "price", label: "Price per unit", defaultValue: 150, unit: "₹" },
        { key: "volume", label: "Units sold", defaultValue: 20000 },
        { key: "priceGrowth", label: "Price growth", defaultValue: 5, unit: "%" },
        { key: "volumeGrowth", label: "Volume growth", defaultValue: 10, unit: "%" },
      ],
    },
  },

  "costs": {
    practice: [
      { question: "A café: price ₹150/cup, variable cost ₹50/cup, fixed costs ₹15,00,000. Compute profit at 20,000 and at 24,000 cups, and compare the percentage changes in revenue and profit.", solution: "At 20,000: (150−50)×20,000 − 15,00,000 = ₹5,00,000. At 24,000: ₹9,00,000. Revenue rose 20%; profit rose 80% — fixed costs amplified the move." },
      { question: "Classify by behaviour: barista wages on hourly shifts, shop rent, milk, the manager's salary.", solution: "Milk: variable. Rent and manager's salary: fixed. Hourly shift wages: step-like — flat until an extra shift is added." },
      { question: "Why is a high-fixed-cost airline more dangerous in a downturn than a high-variable-cost caterer with the same margins today?", solution: "The airline's costs barely fall when demand falls, so losses appear quickly. The caterer sheds variable cost with volume, cushioning the fall — operating leverage cuts both ways." },
    ],
    quiz: [
      { question: "A cost that stays flat when sales change in the short run is…", choices: ["Variable", "Fixed", "Sunk", "Marginal"], answer: 1, explanation: "Fixed costs — rent, salaried staff — do not move with volume in the short run, which is exactly what creates operating leverage." },
      { question: "With ₹100 contribution per unit and ₹15,00,000 fixed costs, profit at 20,000 units is ₹5,00,000. Sales rise 20%. Profit becomes…", choices: ["₹6,00,000", "₹9,00,000", "₹5,00,000", "₹10,00,000"], answer: 1, explanation: "4,000 extra units × ₹100 contribution = ₹4,00,000 more profit, all of it flowing through because fixed costs did not move." },
      { question: "Operating leverage means…", choices: ["Borrowing to operate", "Profit swings by a larger percentage than revenue", "Costs equal revenue", "Fixed costs are zero"], answer: 1, explanation: "Fixed costs make each incremental sale unusually profitable — and each lost sale unusually painful." },
    ],
    sandbox: {
      kind: "operating-leverage", title: "Operating leverage sandbox",
      prompt: "Try +20% volume, then −20%. The asymmetry you feel is what fixed costs do to a business.",
      fields: [
        { key: "price", label: "Price per unit", defaultValue: 150, unit: "₹" },
        { key: "variableCost", label: "Variable cost per unit", defaultValue: 50, unit: "₹" },
        { key: "units", label: "Units sold", defaultValue: 20000 },
        { key: "fixedCosts", label: "Fixed costs", defaultValue: 1500000, unit: "₹" },
        { key: "volumeChange", label: "Volume change", defaultValue: 20, unit: "%" },
      ],
    },
  },

  "profit": {
    practice: [
      { question: "Revenue ₹100 crore, direct costs ₹40 crore, operating costs ₹35 crore, interest ₹3 crore, tax 25%. Build the bridge to net profit.", solution: "Gross ₹60 crore → operating ₹25 crore → PBT ₹22 crore → tax ₹5.5 crore → net ₹16.5 crore." },
      { question: "The same company's net margin, in one calculation.", solution: "₹16.5 crore ÷ ₹100 crore = 16.5%." },
      { question: "A firm's net profit rose 30% thanks to a one-time sale of land. Why should you not conclude the business improved 30%?", solution: "The gain is non-recurring. Strip it out and compare operating profit year over year — that is what the business itself earned." },
    ],
    quiz: [
      { question: "Gross profit is revenue minus…", choices: ["All costs", "Direct costs of goods sold", "Interest and tax", "Operating expenses"], answer: 1, explanation: "Gross profit isolates the economics of delivering the product, before running costs, interest and tax." },
      { question: "Revenue ₹50 lakh, COGS ₹20 lakh, opex ₹18 lakh, interest ₹2 lakh, tax 25%. Net profit is…", choices: ["₹12,00,000", "₹10,00,000", "₹7,50,000", "₹9,00,000"], answer: 2, explanation: "Gross ₹30L → operating ₹12L → PBT ₹10L → tax ₹2.5L → net ₹7.5L." },
      { question: "A company reports strong profit but its cash balance fell. The most likely explanation is…", choices: ["The accounts are fraudulent", "Timing: profit is accrual-based, cash is not", "Profit and cash are the same, so this is impossible", "Taxes were negative"], answer: 1, explanation: "Receivables, inventory and capex absorb cash without reducing profit in the same period. Divergence is normal, not automatically sinister." },
    ],
    sandbox: {
      kind: "profit-bridge", title: "Profit bridge sandbox",
      prompt: "Change one line at a time and watch which profit levels move. Interest touches nothing above PBT.",
      fields: [
        { key: "revenue", label: "Revenue", defaultValue: 1000000000, unit: "₹" },
        { key: "cogs", label: "Direct costs", defaultValue: 400000000, unit: "₹" },
        { key: "opex", label: "Operating costs", defaultValue: 350000000, unit: "₹" },
        { key: "interest", label: "Interest", defaultValue: 30000000, unit: "₹" },
        { key: "taxRate", label: "Tax rate", defaultValue: 25, unit: "%" },
      ],
    },
  },

  "cash": {
    practice: [
      { question: "Profit ₹10,00,000; receivables rose ₹6,00,000; inventory rose ₹3,00,000. Estimate the cash generated.", solution: "₹10,00,000 − ₹6,00,000 − ₹3,00,000 = ₹1,00,000. The other ₹9 lakh sits in invoices and stock." },
      { question: "Which of these can pay next week's salaries: ₹20 lakh bank balance, ₹30 lakh of receivables due in 60 days, ₹25 lakh of inventory?", solution: "Only the ₹20 lakh in the bank. The rest becomes cash later — if customers pay and stock sells." },
      { question: "Explain in two sentences how a profitable, growing business runs out of money.", solution: "Growth means buying more stock and carrying more unpaid invoices, both of which consume cash before the profit is collected. If funding does not keep pace, the business cannot pay someone on some particular day — which is failure." },
    ],
    quiz: [
      { question: "Which counts as cash?", choices: ["A receivable due next month", "Stock in the warehouse", "A bank balance available today", "The owner's car"], answer: 2, explanation: "Cash is deliberately narrow: money spendable today. Everything else must first be converted." },
      { question: "Businesses fail when…", choices: ["Profit margins dip", "They cannot pay an obligation on the day it falls due", "Revenue growth slows", "Depreciation rises"], answer: 1, explanation: "Insolvency is a cash event. Profitable companies fail this way regularly." },
      { question: "Start cash ₹20 crore; operations bring ₹8 crore; capex ₹5 crore; new debt ₹3 crore. Ending cash is…", choices: ["₹26 crore", "₹20 crore", "₹31 crore", "₹16 crore"], answer: 0, explanation: "20 + 8 − 5 + 3 = ₹26 crore. Ending cash = start + inflows − outflows, across operations, investment and financing." },
    ],
    sandbox: {
      kind: "profit-to-cash", title: "Profit-to-cash sandbox",
      prompt: "Grow receivables and inventory and watch cash fall away from profit. Then let payables rise and see some of it come back.",
      fields: [
        { key: "profit", label: "Reported profit", defaultValue: 1000000, unit: "₹" },
        { key: "receivablesIncrease", label: "Increase in receivables", defaultValue: 600000, unit: "₹" },
        { key: "inventoryIncrease", label: "Increase in inventory", defaultValue: 300000, unit: "₹" },
        { key: "payablesIncrease", label: "Increase in payables", defaultValue: 0, unit: "₹" },
      ],
    },
  },

  "assets": {
    practice: [
      { question: "Sort by speed of becoming cash: specialised machinery, cash, 45-day receivables, seasonal fashion inventory.", solution: "Cash → receivables (≈45 days) → seasonal inventory (must sell before season ends, discount risk) → specialised machinery (few buyers, slow, price-cut risk)." },
      { question: "Two firms each show ₹100 crore of assets. A: ₹60 crore cash + ₹40 crore equipment. B: ₹5 crore cash + ₹95 crore custom machinery. A ₹25 crore bill is due next month. Compare their positions.", solution: "A pays comfortably from cash. B cannot — machinery cannot settle invoices and cannot be sold quickly at book value. Same total, opposite situations." },
      { question: "Why might a building bought in 1995 for ₹2 crore still appear near that figure while being worth ₹20 crore?", solution: "Assets are generally carried at historical cost (less depreciation), not market value. Book value records what was paid, not what it would fetch." },
    ],
    quiz: [
      { question: "An asset is…", choices: ["Anything expensive", "A resource controlled by the business with expected future benefit", "Only physical property", "Money owed to suppliers"], answer: 1, explanation: "Control plus expected future benefit is the test — which is why receivables and licences qualify and decoration does not." },
      { question: "A current asset is one expected to become cash within roughly…", choices: ["A week", "A year", "Five years", "Its useful life"], answer: 1, explanation: "The one-year line separates current assets (cash, receivables, inventory) from non-current ones (property, equipment)." },
      { question: "Book value of an asset generally reflects…", choices: ["Today's market price", "Original cost, adjusted by rules like depreciation", "The insured value", "What a buyer offered last week"], answer: 1, explanation: "Accounts record cost-based values. Market worth can be far higher or lower — a distinction analysts must hold onto." },
    ],
  },

  "liabilities": {
    practice: [
      { question: "A firm owes ₹70 crore: ₹10 crore supplier invoices due next month and ₹60 crore of loans. Compare the risk if the loans mature in 8 years versus 4 months.", solution: "Identical totals. With 8-year maturity, next month's need is ₹10 crore — manageable. With 4-month maturity, ₹60 crore must be repaid or refinanced almost immediately — a survival question." },
      { question: "Which of these liabilities charge interest: bank loan, supplier invoice on 30-day terms, salaries payable, bonds issued?", solution: "The bank loan and bonds. Standard supplier credit and accrued salaries are obligations but typically interest-free." },
      { question: "Total liabilities ₹90 crore; debt ₹40 crore. What is the other ₹50 crore likely made of?", solution: "Non-debt obligations: supplier payables, accrued expenses, tax payable, deferred revenue — claims that arose from operating, not borrowing." },
    ],
    quiz: [
      { question: "A liability is…", choices: ["Any future plan to spend", "A present obligation from a past event", "Only bank borrowing", "The owners' stake"], answer: 1, explanation: "The event has already happened — goods received, money borrowed, work performed — so the obligation already exists." },
      { question: "Debt and liabilities relate how?", choices: ["They are identical", "Debt is one kind of liability", "Liabilities are one kind of debt", "Neither involves obligations"], answer: 1, explanation: "All debt is a liability, but payables, accruals and deferred revenue are liabilities that are not debt." },
      { question: "Two companies owe the same total. What most changes the risk picture?", choices: ["The font of the annual report", "When the amounts fall due", "The number of creditors", "The company's age"], answer: 1, explanation: "Timing decides whether an obligation is routine or existential. Always read the maturity schedule." },
    ],
  },

  "equity": {
    practice: [
      { question: "Assets ₹150 crore, liabilities ₹90 crore. Then the firm earns ₹12 crore and pays a ₹5 crore dividend. Equity before and after?", solution: "Before: ₹60 crore. After: 60 + 12 − 5 = ₹67 crore." },
      { question: "A company's book equity is ₹67 crore but the market values its shares at ₹200 crore. Are the accounts wrong?", solution: "No. Book equity records capital put in and profits kept; market value prices expected future earnings. They answer different questions." },
      { question: "A firm makes a ₹15 crore loss. Who absorbs it first, and what does that mean for lenders?", solution: "Equity absorbs it — the owners' claim falls by ₹15 crore. Lenders are untouched unless losses exhaust the equity buffer, which is why more equity means safer debt." },
    ],
    quiz: [
      { question: "Equity equals…", choices: ["Assets + liabilities", "Assets − liabilities", "Revenue − costs", "Cash in the bank"], answer: 1, explanation: "Equity is the residual: whatever remains for owners after all other claims." },
      { question: "Equity grows when the business…", choices: ["Borrows more", "Retains profit", "Pays a dividend", "Buys equipment with cash"], answer: 1, explanation: "Retained profit adds to equity. Borrowing raises liabilities; dividends reduce equity; swapping cash for equipment changes neither." },
      { question: "Book equity and market value of equity are…", choices: ["Always equal", "Different measures answering different questions", "Both set by the stock exchange", "Both equal to liquidation value"], answer: 1, explanation: "Book equity is accounting history; market value is priced expectation. Confusing them is a classic beginner error." },
    ],
    sandbox: {
      kind: "balance", title: "Residual claim sandbox",
      prompt: "Push liabilities up towards assets and watch the owners' buffer shrink towards zero.",
      fields: [
        { key: "assets", label: "Total assets", defaultValue: 1500000000, unit: "₹" },
        { key: "liabilities", label: "Total liabilities", defaultValue: 900000000, unit: "₹" },
      ],
    },
  },

  "debt": {
    practice: [
      { question: "Two firms each earn ₹10 crore before interest. One is all-equity (₹100 crore). The other has ₹50 crore debt at 10% and ₹50 crore equity. Compute owner returns for both.", solution: "All-equity: 10%. Levered: interest ₹5 crore, owners keep ₹5 crore on ₹50 crore = 10%. Identical here — the divergence appears when earnings move." },
      { question: "Repeat with earnings of ₹16 crore, then ₹4 crore.", solution: "At ₹16 crore: 16% vs (16−5)/50 = 22%. At ₹4 crore: 4% vs (4−5)/50 = −2%. Debt stretched the outcomes in both directions." },
      { question: "Debt ₹100 crore, cash ₹25 crore. Net debt, and why the netting is meaningful?", solution: "₹75 crore. Cash on hand could repay debt tomorrow, so net debt better reflects the true borrowing burden." },
    ],
    quiz: [
      { question: "What makes debt different from equity funding?", choices: ["It is always larger", "Its payments are contractual regardless of performance", "It carries voting rights", "It never has to be repaid"], answer: 1, explanation: "Interest and principal are owed on schedule whatever the year looked like. That fixity is debt's defining feature." },
      { question: "Borrowing at 10% to earn 10% on the business leaves owner returns…", choices: ["Higher", "Lower", "Unchanged", "Negative"], answer: 2, explanation: "Leverage only lifts returns when the business earns more than the borrowing cost. At equal rates it just adds risk for nothing." },
      { question: "The best single test of whether debt is safe is…", choices: ["Its absolute size", "The cash flow available to service it, and when it matures", "The lender's brand", "The interest rate alone"], answer: 1, explanation: "₹500 crore of debt can be trivial or fatal — it depends on the cash generated against it and the repayment dates." },
    ],
    sandbox: {
      kind: "leverage-returns", title: "Leverage sandbox",
      prompt: "Move profit up and down 60% and compare how gently the all-equity return moves versus the levered one.",
      fields: [
        { key: "operatingProfit", label: "Profit before interest", defaultValue: 100000000, unit: "₹" },
        { key: "debt", label: "Debt", defaultValue: 500000000, unit: "₹" },
        { key: "interestRate", label: "Interest rate", defaultValue: 10, unit: "%" },
        { key: "equity", label: "Equity", defaultValue: 500000000, unit: "₹" },
      ],
    },
  },

  "interest": {
    practice: [
      { question: "₹10,00,000 borrowed at 8% for 3 years. Total repaid under simple interest?", solution: "Interest = 10,00,000 × 8% × 3 = ₹2,40,000; total ₹12,40,000." },
      { question: "Same loan with annual compounding — work the balance year by year.", solution: "Y1: ₹10,80,000. Y2: ₹11,66,400. Y3: ₹12,59,712. Compounding cost ₹19,712 more than simple." },
      { question: "One lender quotes 12% annually; another quotes 1% monthly. Are they the same price?", solution: "No. 1% monthly compounds to (1.01)¹² − 1 = 12.68% effective per year — the monthly quote is dearer." },
    ],
    quiz: [
      { question: "Interest is best described as…", choices: ["A penalty for saving", "Rent paid for using money over time", "A tax", "Profit sharing"], answer: 1, explanation: "The borrower pays for the use of the lender's money for a period — rent on money." },
      { question: "₹5,00,000 at 10% simple interest for 2 years accrues…", choices: ["₹1,00,000", "₹1,05,000", "₹50,000", "₹1,10,000"], answer: 0, explanation: "Simple interest: 5,00,000 × 10% × 2 = ₹1,00,000. Compounding would add ₹5,000 more." },
      { question: "Two loans quote 12% a year, one compounding annually and one monthly. Which costs more?", choices: ["Annual", "Monthly", "Identical", "Depends on the amount"], answer: 1, explanation: "Monthly compounding charges interest on interest twelve times a year: effective 12.68% vs 12%." },
    ],
    sandbox: {
      kind: "simple-vs-compound", title: "Interest sandbox",
      prompt: "Set 3 years, then 15. Watch the compounding gap change from rounding error to serious money.",
      fields: [
        { key: "principal", label: "Principal", defaultValue: 1000000, unit: "₹" },
        { key: "rate", label: "Rate per year", defaultValue: 8, unit: "%" },
        { key: "years", label: "Years", defaultValue: 3 },
      ],
    },
  },

  "risk": {
    practice: [
      { question: "Stock A swung between ₹80 and ₹130 last year and sits at ₹120. Stock B moved calmly from ₹100 to ₹40 as the company failed. Which showed more volatility, and which delivered permanent loss?", solution: "A was more volatile but recovered; B was calm on the way to destroying capital. Volatility and permanent loss are different risks." },
      { question: "You own shares in one pharma company awaiting one drug approval. Which risk can diversification remove here, and which can it not?", solution: "Spreading across many companies removes the single-approval risk. It cannot remove market-wide risk — a crash that hits everything at once." },
      { question: "A scheme offers 24% 'guaranteed, risk-free' when government bonds pay 7%. What is the correct inference?", solution: "A 17-point premium exists only as payment for risk. If no risk is visible, it is hidden — often as credit or fraud risk. The claim itself is the warning." },
    ],
    quiz: [
      { question: "Volatility and permanent loss of capital are…", choices: ["The same thing", "Different risks deserving different responses", "Both impossible to measure", "Only relevant to bonds"], answer: 1, explanation: "A price that swings and recovers has cost you nothing if you could wait. Money that does not come back is a different event entirely." },
      { question: "Diversification protects mainly against…", choices: ["Market-wide crashes", "Risks specific to one holding", "Inflation", "All risk"], answer: 1, explanation: "Many holdings mean no single failure is decisive. Systematic, market-wide risk remains." },
      { question: "Higher expected returns exist because…", choices: ["Markets are generous", "Someone is bearing more risk", "Of compounding", "Regulators require them"], answer: 1, explanation: "Return is compensation. If you cannot name the risk being paid for, you have not found it yet." },
    ],
    sandbox: {
      kind: "risk-outcomes", title: "Risk sandbox",
      prompt: "Keep the expected return fixed while widening the gap between good and bad outcomes. The average hides the ride.",
      fields: [
        { key: "amount", label: "Invested", defaultValue: 100000, unit: "₹" },
        { key: "goodChance", label: "Chance of good year", defaultValue: 60, unit: "%" },
        { key: "goodReturn", label: "Good-year return", defaultValue: 30, unit: "%" },
        { key: "badReturn", label: "Bad-year return", defaultValue: -20, unit: "%" },
      ],
    },
  },

  "return": {
    practice: [
      { question: "Buy at ₹500; a year later the share is ₹540 and paid ₹15 of dividends. Total return?", solution: "(540 − 500 + 15) ÷ 500 = 11%. The price-only answer of 8% misses over a quarter of the result." },
      { question: "Fund A returned 15% over one year. Fund B returned 15% over five years. Roughly annualise B and compare.", solution: "B's annual rate ≈ 1.15^(1/5) − 1 ≈ 2.8% a year — nowhere near A. Returns without periods are meaningless." },
      { question: "Your investment shows a 12% return before a 1.5% fee and 10% tax on gains. Estimate what you keep.", solution: "After fee ≈ 10.5%; after 10% tax on that gain ≈ 9.45%. Costs and taxes compound against you every year." },
    ],
    quiz: [
      { question: "Total return includes…", choices: ["Price change only", "Income only", "Price change plus income received", "Only realised gains"], answer: 2, explanation: "Dividends and interest are part of the result. Return = (end − start + income) ÷ start." },
      { question: "Buy ₹200, sell ₹230, dividends ₹10. The return is…", choices: ["15%", "20%", "10%", "5%"], answer: 1, explanation: "(230 − 200 + 10) ÷ 200 = 40 ÷ 200 = 20%." },
      { question: "'This fund made 30%.' The essential missing fact is…", choices: ["The manager's name", "The time period", "The fund's colour scheme", "The office address"], answer: 1, explanation: "30% in one year and 30% over six years are utterly different outcomes. A return without a period is an advertisement, not a measurement." },
    ],
    sandbox: {
      kind: "holding-return", title: "Return sandbox",
      prompt: "Zero out the income field and watch a healthy return shrink — the mistake most beginners make in reverse.",
      fields: [
        { key: "buyPrice", label: "Bought at", defaultValue: 500, unit: "₹" },
        { key: "sellPrice", label: "Worth now", defaultValue: 540, unit: "₹" },
        { key: "income", label: "Income received", defaultValue: 15, unit: "₹" },
      ],
    },
  },

  "time-value-of-money": {
    practice: [
      { question: "You are offered ₹1,50,000 in five years for ₹1,00,000 today. You can earn 10% elsewhere. Decide, with the calculation.", solution: "PV = 1,50,000 ÷ 1.10⁵ = ₹93,140 < ₹1,00,000. Decline — equivalently, ₹1,00,000 at 10% grows to ₹1,61,051, beating the offer." },
      { question: "At 8%, would you rather have ₹1,00,000 now or ₹1,25,000 in three years?", solution: "₹1,00,000 → 1,00,000 × 1.08³ = ₹1,25,971. Marginally better to take the money now — and certain." },
      { question: "Why does adding up ₹50,000-a-year cash flows for 10 years and calling it 'worth ₹5,00,000' overstate the value?", solution: "Later rupees are worth less than current ones. Each year's ₹50,000 must be discounted before summing; the undiscounted total ignores time entirely." },
    ],
    quiz: [
      { question: "₹100 today beats ₹100 next year because…", choices: ["Banks are unreliable", "It can be invested, prices rise, and promises can fail", "Cash feels nicer", "Of exchange rates"], answer: 1, explanation: "Earning power, inflation and uncertainty are the three reasons timing changes value." },
      { question: "Moving a future amount back to today's value is called…", choices: ["Compounding", "Discounting", "Amortising", "Netting"], answer: 1, explanation: "Discounting divides by (1+r) per period; compounding multiplies. They are mirror operations." },
      { question: "At 10%, ₹121 arriving in two years is worth today…", choices: ["₹121", "₹110", "₹100", "₹99"], answer: 2, explanation: "121 ÷ 1.10² = 121 ÷ 1.21 = ₹100." },
    ],
    sandbox: {
      kind: "present-value", title: "Time value sandbox",
      prompt: "Raise the rate and watch the same future promise shrink in today's terms — this is the whole engine of valuation.",
      fields: [
        { key: "amount", label: "Future amount", defaultValue: 150000, unit: "₹" },
        { key: "rate", label: "Discount rate", defaultValue: 10, unit: "%" },
        { key: "years", label: "Years away", defaultValue: 5 },
      ],
    },
  },

  "compounding": {
    practice: [
      { question: "₹1,00,000 at 12% for 10 years. Compute the value after 1, 5 and 10 years, and compare the gain in the first five years with the second five.", solution: "₹1,12,000 · ₹1,76,234 · ₹3,10,585. First five years: +₹76,234. Second five: +₹1,34,351 — almost double, purely because the base grew." },
      { question: "Approximately how long does money double at 12% compounded annually?", solution: "1.12ⁿ = 2 → n ≈ 6.1 years. (The rule of 72 gives 72 ÷ 12 = 6.)" },
      { question: "A portfolio falls 50% one year and rises 50% the next. Where does it end up?", solution: "1.00 × 0.50 × 1.50 = 0.75 — down 25%. Losses compound too, and a −50% needs +100% to recover." },
    ],
    quiz: [
      { question: "Compounding means…", choices: ["Earning only on the original principal", "Earning returns on previously earned returns", "Adding fixed amounts yearly", "Reducing risk over time"], answer: 1, explanation: "Each period's gain joins the base, so the base — and each subsequent gain — keeps growing." },
      { question: "₹10,000 at 10% annual compounding after two years is…", choices: ["₹12,000", "₹12,100", "₹11,000", "₹12,500"], answer: 1, explanation: "10,000 × 1.10² = ₹12,100. The extra ₹100 over simple interest is interest on year one's interest." },
      { question: "Why does starting to invest 10 years earlier matter so much?", choices: ["Fees fall over time", "The largest gains come in the later years, and early money reaches them", "Markets only rise early", "Taxes disappear"], answer: 1, explanation: "Growth accelerates as the base builds, so the final years contribute most — and only money invested early experiences them." },
    ],
    sandbox: {
      kind: "simple-vs-compound", title: "Compounding sandbox",
      prompt: "Hold the rate fixed and stretch the years from 5 to 30. Time, not rate, is doing the heavy lifting.",
      fields: [
        { key: "principal", label: "Invested", defaultValue: 100000, unit: "₹" },
        { key: "rate", label: "Return per year", defaultValue: 12, unit: "%" },
        { key: "years", label: "Years", defaultValue: 10 },
      ],
    },
  },

  "inflation": {
    practice: [
      { question: "₹5,00,000 sits in savings at 4% while inflation runs 6%. After one year, state the balance and what it can buy relative to today.", solution: "Balance ₹5,20,000; last year's ₹5,00,000 basket now costs ₹5,30,000. Real return ≈ −2%: more rupees, less purchasing power." },
      { question: "Precisely, what is the real return when nominal is 9% and inflation is 5%?", solution: "(1.09 ÷ 1.05) − 1 = 3.81%. The subtraction shortcut (4%) is close at low rates but not exact." },
      { question: "You want the purchasing power of today's ₹50,000/month in 20 years with 5% inflation. What nominal amount is that?", solution: "50,000 × 1.05²⁰ ≈ ₹1,32,665 per month. Plans stated in today's rupees quietly shrink." },
    ],
    quiz: [
      { question: "Inflation primarily erodes…", choices: ["The number of rupees you hold", "What your rupees can buy", "Bank security", "Interest rates"], answer: 1, explanation: "Balances do not shrink; purchasing power does. That is why real, not nominal, figures measure whether you gained." },
      { question: "Nominal return 4%, inflation 6%. Approximately, your real return is…", choices: ["+2%", "0%", "−2%", "+10%"], answer: 2, explanation: "Real ≈ nominal − inflation = −2%. 'Safe' cash loses purchasing power whenever inflation outruns interest." },
      { question: "A consistent valuation must…", choices: ["Mix real cash flows with nominal rates", "Use nominal with nominal, or real with real", "Ignore inflation entirely", "Always use real terms"], answer: 1, explanation: "Mixing conventions double-counts or ignores inflation. Either frame works — mixed frames do not." },
    ],
    sandbox: {
      kind: "inflation-real", title: "Purchasing power sandbox",
      prompt: "Set the deposit rate below inflation and watch the rupee balance rise while the real value falls.",
      fields: [
        { key: "amount", label: "Amount", defaultValue: 500000, unit: "₹" },
        { key: "nominalRate", label: "Interest earned", defaultValue: 4, unit: "%" },
        { key: "inflation", label: "Inflation", defaultValue: 6, unit: "%" },
        { key: "years", label: "Years", defaultValue: 5 },
      ],
    },
  },

  "present-value": {
    practice: [
      { question: "A project pays ₹50,000 in year 1 and ₹80,000 in year 2; your rate is 10%. Value it.", solution: "50,000÷1.10 = ₹45,455; 80,000÷1.21 = ₹66,116. Total PV = ₹1,11,571." },
      { question: "The same project costs ₹1,05,000 upfront. Take it?", solution: "Yes: net present value = 1,11,571 − 1,05,000 = +₹6,571. It creates value at a 10% opportunity cost." },
      { question: "Recompute the PV at 15% and explain the direction of the change.", solution: "50,000÷1.15 + 80,000÷1.3225 = 43,478 + 60,491 = ₹1,03,969. A higher rate means future money is worth less today — now below the ₹1,05,000 cost." },
    ],
    quiz: [
      { question: "PV of ₹1,10,000 arriving in one year at 10% is…", choices: ["₹1,10,000", "₹1,00,000", "₹99,000", "₹1,21,000"], answer: 1, explanation: "1,10,000 ÷ 1.10 = ₹1,00,000." },
      { question: "When the discount rate rises, present values…", choices: ["Rise", "Fall", "Stay fixed", "Turn negative"], answer: 1, explanation: "You are dividing by a larger factor. This single mechanic is why valuations fall when required returns rise." },
      { question: "Cash flows arriving further in the future are…", choices: ["Discounted more heavily", "Discounted less", "Never discounted", "Added at face value"], answer: 0, explanation: "The divisor (1+r)ᵗ grows with t, so distant money contributes less to today's value." },
    ],
    sandbox: {
      kind: "present-value", title: "Discounting sandbox",
      prompt: "Fix the amount and push the years out. Distance does to value what the rate does.",
      fields: [
        { key: "amount", label: "Cash flow", defaultValue: 80000, unit: "₹" },
        { key: "rate", label: "Discount rate", defaultValue: 10, unit: "%" },
        { key: "years", label: "Years until it arrives", defaultValue: 2 },
      ],
    },
  },

  "future-value": {
    practice: [
      { question: "₹2,00,000 invested for 12 years at 9%. Future value?", solution: "2,00,000 × 1.09¹² = 2,00,000 × 2.8127 = ₹5,62,540." },
      { question: "Same money at 11% instead. How much extra do two percentage points deliver?", solution: "2,00,000 × 1.11¹² = ₹6,99,700 — an extra ₹1,37,160, about 68% of the original sum, from rate alone." },
      { question: "You need ₹10,00,000 in 8 years and can earn 10%. How much must you invest today?", solution: "This is FV in reverse: 10,00,000 ÷ 1.10⁸ = ₹4,66,507." },
    ],
    quiz: [
      { question: "FV of ₹50,000 at 8% for 3 years is closest to…", choices: ["₹62,000", "₹62,986", "₹58,000", "₹54,000"], answer: 1, explanation: "50,000 × 1.08³ = 50,000 × 1.2597 = ₹62,986." },
      { question: "Doubling the number of years (at the same rate)…", choices: ["Doubles the future value", "More than doubles the growth, because compounding accelerates", "Halves it", "Has no effect"], answer: 1, explanation: "Growth is exponential: (1+r)²ⁿ = ((1+r)ⁿ)². The second half of the horizon adds more than the first." },
      { question: "A projected future value of your investment plan is…", choices: ["A guarantee", "A projection that depends on the assumed rate holding", "A legal contract", "Inflation-proof"], answer: 1, explanation: "Change the assumed rate and the answer changes materially. FV outputs are only as good as their inputs." },
    ],
    sandbox: {
      kind: "future-value", title: "Goal sandbox",
      prompt: "Try to reach ₹10,00,000 by adjusting rate and years — notice which lever you actually control.",
      fields: [
        { key: "principal", label: "Invested today", defaultValue: 200000, unit: "₹" },
        { key: "rate", label: "Return per year", defaultValue: 9, unit: "%" },
        { key: "years", label: "Years", defaultValue: 12 },
      ],
    },
  },

  "opportunity-cost": {
    practice: [
      { question: "₹5,00,000 can go into a friend's venture at an expected 11% or repay your 14% loan. Compute both outcomes and decide.", solution: "Venture: ₹55,000, uncertain. Repayment: ₹70,000 saved, certain. Repay — the venture's true cost includes the ₹70,000 forgone." },
      { question: "You spent ₹3,00,000 developing a product that now needs ₹2,00,000 more, with expected sales of ₹2,50,000. What is relevant to the decision, and what is not?", solution: "Relevant: ₹2,00,000 more against ₹2,50,000 expected — proceed if the estimate is believable. Irrelevant: the sunk ₹3,00,000, which no decision can recover." },
      { question: "Your discount rate for a project 'should reflect opportunity cost'. Say what that means operationally.", solution: "It is the return available on the best alternative of similar risk. A project must beat that alternative, not merely beat zero." },
    ],
    quiz: [
      { question: "Opportunity cost is…", choices: ["The cash price of an item", "The value of the best alternative you gave up", "A bank fee", "Always zero for cash purchases"], answer: 1, explanation: "Every choice forecloses alternatives; the best forgone one is the real benchmark." },
      { question: "Money already spent that cannot be recovered is called…", choices: ["Fixed cost", "Sunk cost", "Opportunity cost", "Marginal cost"], answer: 1, explanation: "Sunk costs are identical under every option, so they should not steer the next decision — though emotionally they often do." },
      { question: "An investment returning 9% when your best comparable alternative returns 12% is…", choices: ["Profitable and correct", "Profitable but the wrong choice", "A loss-maker", "Risk-free"], answer: 1, explanation: "It earns money yet destroys ₹3 per ₹100 per year relative to the alternative. Judged against the right benchmark, it fails." },
    ],
    sandbox: {
      kind: "opportunity", title: "Best-alternative sandbox",
      prompt: "Find the point where the chosen option stops having a hidden cost. That crossover is the hurdle rate.",
      fields: [
        { key: "amount", label: "Amount", defaultValue: 500000, unit: "₹" },
        { key: "chosenReturn", label: "Chosen option's return", defaultValue: 11, unit: "%" },
        { key: "alternativeReturn", label: "Best alternative's return", defaultValue: 14, unit: "%" },
      ],
    },
  },

  "risk-vs-reward": {
    practice: [
      { question: "Government bonds pay 7%. A corporate bond pays 8.5% and a diversified equity portfolio is expected around 12%. Name each risk premium and what it pays for.", solution: "Corporate: 1.5% for default risk. Equity: 5% for uncertain profits and price swings. Each extra point maps to a nameable risk." },
      { question: "A scheme guarantees 24% with 'zero risk' while the safe rate is 7%. Apply the framework.", solution: "A 17-point premium must be payment for some risk. If none is disclosed, the risk is concealed — commonly the risk that the promoter simply keeps your money." },
      { question: "Why is an 'expected return of 12%' not a promise of 12%?", solution: "It is the probability-weighted average of many outcomes — some far better, some negative. You experience one outcome, never the average." },
    ],
    quiz: [
      { question: "The extra return above the risk-free rate is called…", choices: ["Bonus yield", "The risk premium", "Alpha", "Spread income"], answer: 1, explanation: "Every risky asset must offer a premium over the safe rate to attract money; sizing it is the investor's core judgement." },
      { question: "The healthiest response to 'high returns, no risk' is…", choices: ["Invest quickly before it closes", "Ask what risk the premium is paying for", "Assume regulators checked it", "Tell friends"], answer: 1, explanation: "Premiums are compensation, never gifts. Unfindable risk means hidden risk." },
      { question: "Safe rate 7%, an asset's risk premium 5%. Its required return is…", choices: ["7%", "5%", "12%", "35%"], answer: 2, explanation: "Required return = risk-free rate + premium = 12%. Pay a price implying less and you are underpaid for the risk." },
    ],
    sandbox: {
      kind: "risk-outcomes", title: "Premium-for-risk sandbox",
      prompt: "Make the bad-year outcome worse and ask yourself what expected return would make you take the bet.",
      fields: [
        { key: "amount", label: "Invested", defaultValue: 100000, unit: "₹" },
        { key: "goodChance", label: "Chance of good year", defaultValue: 70, unit: "%" },
        { key: "goodReturn", label: "Good-year return", defaultValue: 25, unit: "%" },
        { key: "badReturn", label: "Bad-year return", defaultValue: -15, unit: "%" },
      ],
    },
  },
};
