import type { Lesson } from "./types";

/**
 * Level 0 — Finance Foundations. 22 lessons.
 *
 * This is the first thing a beginner reads, so nothing here may assume prior
 * knowledge. Every term used in a lesson is either explained in that lesson or
 * taught in a lesson listed under `prerequisites`.
 */
export const level0: Lesson[] = [
  {
    id: "what-is-finance",
    title: "What is finance?",
    level: 0,
    module: "Finance basics",
    order: 1,
    status: "authored",
    summary: "Finance is the study of how money moves between people who have it and people who can use it.",
    concept:
      "Finance is about one simple situation: some people have money they are not using right now, and other people have a use for money they do not currently have. Finance is the set of tools, contracts and institutions that move money from the first group to the second — and works out what the second group should pay for the privilege. A bank deposit, a home loan, a share of a company and a government bond are all versions of the same idea.",
    whyItMatters:
      "Almost every financial decision you will ever make is a version of this question: should money move, in which direction, and on what terms? Once you see that a savings account and a corporate acquisition are the same shape of problem, the rest of the curriculum stops being a list of unrelated topics.",
    howItWorks: [
      "Someone with spare money (a saver, an investor, a lender) wants more money later than they have now.",
      "Someone who needs money now (a borrower, a company, a government) is willing to pay for the use of it.",
      "The two sides agree terms: how much, for how long, what gets paid back, and what happens if things go wrong.",
      "The price of that agreement is set by two things — how long the money is tied up, and how likely it is that it does not come back.",
    ],
    example: {
      setup:
        "You have ₹1,00,000 sitting idle. A neighbour wants to borrow it for a year to buy equipment for her shop.",
      steps: [
        "If you keep the money, you have ₹1,00,000 in a year — and it will buy slightly less because prices rise.",
        "If you lend it at 9%, you are owed ₹1,09,000 in a year.",
        "The extra ₹9,000 is your payment for two things: waiting a year, and the chance she cannot repay.",
      ],
      meaning:
        "That ₹9,000 is not arbitrary. It is the price of time plus the price of risk. Every interest rate, every expected stock return and every valuation in this curriculum is built from those same two ingredients.",
    },
    keyTerms: [
      { term: "Capital", definition: "Money that is being put to work rather than sitting idle." },
      { term: "Lender / investor", definition: "The side supplying the money and expecting more back later." },
      { term: "Borrower / issuer", definition: "The side receiving the money now and owing something later." },
      { term: "Return", definition: "The reward for supplying money, usually expressed as a percentage per year." },
    ],
    takeaways: [
      "Finance moves money from people who have it to people who can use it.",
      "The price of that movement compensates for time and for risk.",
      "Savings accounts, loans, bonds and shares are variations on one structure, not separate subjects.",
    ],
    commonMistakes: [
      "Thinking finance is mainly about the stock market. Lending, saving and company financing are far larger.",
      "Assuming a higher promised return is simply better, without asking what risk is attached to it.",
    ],
    prerequisites: [],
  },
  {
    id: "personal-corporate-investing",
    title: "Personal finance vs corporate finance vs investing",
    level: 0,
    module: "Finance basics",
    order: 2,
    status: "authored",
    summary: "Three settings for the same decisions: yours, a company's, and an investor's.",
    concept:
      "Finance is usually taught in three settings. Personal finance is you deciding what to do with your own money — spending, saving, borrowing, insuring. Corporate finance is a company making the same decisions with shareholders' money — which projects to fund, how to pay for them, what to do with profits. Investing is choosing which of those companies, loans or assets to put money into, and at what price.",
    whyItMatters:
      "The three settings share the same maths but ask different questions, and beginners often apply the wrong one. 'Is this a good company?' is a corporate-finance question. 'Is this a good price?' is an investing question. Confusing them is how people end up buying excellent businesses at terrible prices.",
    howItWorks: [
      "Personal finance asks: given my income and goals, how much do I spend, save, borrow and insure?",
      "Corporate finance asks: which projects should this company invest in, how should it raise the money, and how much should it return to owners?",
      "Investing asks: of all the available assets, which ones am I being paid enough to own?",
      "All three use the same underlying tools — time value of money, risk and return — applied to a different decision-maker.",
    ],
    example: {
      setup: "A coffee chain is deciding whether to open a new outlet costing ₹40 lakh.",
      steps: [
        "Corporate finance question: will the outlet earn more than the 12% the company's investors require?",
        "Investing question: at today's share price, is the market already assuming the company opens 50 profitable outlets?",
        "Personal finance question: should I put ₹50,000 of my savings into this share, or clear my 14% personal loan first?",
      ],
      meaning:
        "Same company, three different correct answers. Clearing a 14% loan beats an uncertain 12% investment, which is why the personal answer can differ from the corporate one.",
    },
    keyTerms: [
      { term: "Personal finance", definition: "Managing your own money: spending, saving, borrowing, insuring." },
      { term: "Corporate finance", definition: "How a company chooses investments and pays for them." },
      { term: "Investing", definition: "Deciding which assets to buy and at what price." },
    ],
    takeaways: [
      "The same tools apply in all three settings; only the decision-maker changes.",
      "A good business and a good investment are different claims — the second depends on price.",
      "Paying off expensive debt is often the highest-certainty 'investment' available to an individual.",
    ],
    commonMistakes: [
      "Treating 'this is a great company' as a complete investment argument.",
      "Investing spare cash while carrying credit-card debt at a much higher rate.",
    ],
    prerequisites: ["what-is-finance"],
  },
  {
    id: "financial-markets",
    title: "Financial markets",
    level: 0,
    module: "Finance basics",
    order: 3,
    status: "authored",
    summary: "The places where people who want money and people who have money meet and agree a price.",
    concept:
      "A financial market is any organised place where financial claims are bought and sold. A claim is simply a promise about future money: a share promises a slice of a company's future profits, a bond promises interest and repayment. The market's job is to let people trade those promises and, in doing so, produce a price for them.",
    whyItMatters:
      "Prices are the output of a market, and every valuation technique later in this curriculum is a way of asking whether that price looks sensible. You cannot argue a stock is cheap without understanding what produced the price in the first place.",
    howItWorks: [
      "A primary market is where a claim is created and sold for the first time — a company issuing new shares, a government issuing a new bond. Money reaches the issuer here.",
      "A secondary market is where existing claims change hands between investors. The company gets nothing; ownership just moves.",
      "Buyers post the price they will pay (the bid), sellers post the price they will accept (the ask), and trades happen where the two meet.",
      "The gap between bid and ask, and how much can trade without moving the price, is what people mean by liquidity.",
    ],
    example: {
      setup: "A company sells 1 crore new shares at ₹100 each in an initial public offering.",
      steps: [
        "Primary market: the company receives ₹100 crore (before fees). New money enters the business.",
        "The next day, an investor sells 100 of those shares to someone else at ₹112.",
        "Secondary market: ₹11,200 moves between two investors. The company receives nothing from this trade.",
      ],
      meaning:
        "Only the first transaction funded the business. Most trading you see reported daily is the second kind — ownership changing hands, not money reaching companies.",
    },
    keyTerms: [
      { term: "Primary market", definition: "Where new claims are issued and money reaches the issuer." },
      { term: "Secondary market", definition: "Where existing claims are traded between investors." },
      { term: "Bid / ask", definition: "The highest price a buyer will pay and the lowest a seller will accept." },
      { term: "Liquidity", definition: "How easily you can buy or sell without moving the price much." },
    ],
    takeaways: [
      "Markets exist to trade promises about future money and to price them.",
      "Only primary-market issuance actually funds a company.",
      "A quoted price is the result of one recent trade, not a statement of what something is worth.",
    ],
    commonMistakes: [
      "Believing a company receives money when its shares trade on an exchange.",
      "Treating the last traded price as the price at which you could sell a large holding.",
    ],
    prerequisites: ["what-is-finance"],
  },
  {
    id: "companies-and-capital",
    title: "Companies and capital",
    level: 0,
    module: "Finance basics",
    order: 4,
    status: "authored",
    summary: "A company needs money to operate, and it can only get it from two places: owners or lenders.",
    concept:
      "To run a business you need money before you earn any — for premises, equipment, stock and salaries. That money is called capital, and there are only two sources. Owners put money in and receive a share of whatever is left over (equity). Lenders put money in and are owed a fixed amount back (debt). Everything about a company's financing is a choice between those two.",
    whyItMatters:
      "The split between owner money and borrowed money determines who bears risk, who gets paid first when things go wrong, and how much of the profit each side keeps. It is the single most consequential structural choice a company makes.",
    howItWorks: [
      "Owners contribute equity. They are paid last and have no guarantee, but they keep everything that remains after other claims.",
      "Lenders contribute debt. They are paid before owners and their return is fixed by contract, so their upside is capped.",
      "The company uses the combined pool to buy assets and run operations.",
      "Profits first service the debt; whatever survives belongs to the owners.",
    ],
    example: {
      setup: "Starting a bakery needs ₹50 lakh. You put in ₹30 lakh of your own money and borrow ₹20 lakh at 10%.",
      steps: [
        "Interest owed each year = ₹20,00,000 × 10% = ₹2,00,000.",
        "In a good year the bakery earns ₹8,00,000 before interest. After ₹2,00,000 interest, you keep ₹6,00,000 on your ₹30 lakh — a 20% return.",
        "In a bad year it earns ₹1,50,000. Interest of ₹2,00,000 is still owed in full, so you are ₹50,000 short and must fund the gap.",
      ],
      meaning:
        "Borrowing magnified both outcomes. The lender's ₹2,00,000 never changed; all the variability landed on you. That is what it means to be the residual owner.",
    },
    keyTerms: [
      { term: "Capital", definition: "The money a business uses to operate and grow." },
      { term: "Equity", definition: "Owner-supplied capital, paid last, with unlimited upside and downside." },
      { term: "Debt", definition: "Borrowed capital, paid before owners, with a fixed contractual return." },
      { term: "Residual claim", definition: "The right to whatever is left after everyone else is paid — what owners hold." },
    ],
    takeaways: [
      "There are only two sources of capital: owners and lenders.",
      "Lenders get paid first and get a fixed amount; owners get paid last and get whatever is left.",
      "Borrowing amplifies good years and bad years alike for the owners.",
    ],
    commonMistakes: [
      "Thinking debt is simply bad. It is cheaper than equity precisely because it is safer for the provider.",
      "Forgetting that interest is owed whether or not the business had a good year.",
    ],
    prerequisites: ["what-is-finance"],
  },
  {
    id: "revenue",
    title: "Revenue",
    level: 0,
    module: "Finance basics",
    order: 5,
    status: "authored",
    summary: "The total value of what a business sold in a period — before any costs are taken out.",
    concept:
      "Revenue is the value of everything a business sold to customers during a period. It sits at the very top of the income statement, which is why people call it the top line. Two warnings from the start: revenue is not profit, because no costs have been subtracted yet, and revenue is not cash, because customers may not have paid yet.",
    whyItMatters:
      "Revenue is the starting point of almost every financial analysis and forecast. It is also the number most easily misread — a company can grow revenue while losing money and running out of cash at the same time.",
    howItWorks: [
      "For a simple business, revenue is the number of units sold multiplied by the price per unit.",
      "Revenue is recorded when the business delivers what it promised, not necessarily when the customer pays.",
      "If the customer has not paid yet, the business records an amount owed to it, called a receivable.",
      "Growth in revenue comes from selling more units, charging more per unit, selling a different mix of products, or buying another business.",
    ],
    formula: {
      calculates: "Total sales value for a period, for a single-product business",
      expression: "Revenue = Price × Volume",
      variables: [
        { symbol: "Price", meaning: "What one unit sells for" },
        { symbol: "Volume", meaning: "How many units were sold in the period" },
      ],
    },
    example: {
      setup: "A café sells 20,000 cups of coffee in a year at ₹150 per cup.",
      steps: [
        "Revenue = 20,000 × ₹150 = ₹30,00,000 (₹30 lakh).",
        "Next year volume rises 10% to 22,000 cups and price rises 5% to ₹157.50.",
        "New revenue = 22,000 × ₹157.50 = ₹34,65,000.",
        "Growth = ₹34,65,000 ÷ ₹30,00,000 − 1 = 15.5%.",
      ],
      meaning:
        "Revenue grew 15.5%, not 15%. Price and volume growth multiply rather than add. Splitting growth into its price and volume parts tells you whether customers are buying more or simply paying more.",
    },
    keyTerms: [
      { term: "Top line", definition: "Another name for revenue, from its position at the top of the income statement." },
      { term: "Volume", definition: "The number of units sold." },
      { term: "Receivable", definition: "Money a customer owes for goods already delivered." },
      { term: "Organic growth", definition: "Growth from the existing business, excluding acquisitions." },
    ],
    takeaways: [
      "Revenue is sales value before any costs — it says nothing about profitability.",
      "Revenue is recorded on delivery, not on payment, so it is not the same as cash received.",
      "Always ask whether growth came from price, volume, mix or acquisitions.",
    ],
    commonMistakes: [
      "Treating revenue as money in the bank.",
      "Calling revenue 'income'. In accounting, income usually means profit.",
      "Presenting growth from an acquisition as if the existing business grew.",
    ],
    prerequisites: ["companies-and-capital"],
  },
  {
    id: "costs",
    title: "Costs",
    level: 0,
    module: "Finance basics",
    order: 6,
    status: "authored",
    summary: "What a business consumes to produce and sell — and how those amounts respond when sales change.",
    concept:
      "Costs are the resources a business uses up in order to earn its revenue: ingredients, wages, rent, electricity, marketing. The useful question for a beginner is not what each cost is called, but how it behaves. Some costs rise automatically when you sell more. Others stay flat whatever happens.",
    whyItMatters:
      "Cost behaviour determines whether growth makes a business more profitable or just busier. Two companies with identical revenue and identical total costs can respond in completely opposite ways to a 20% sales increase.",
    howItWorks: [
      "Variable costs move with sales volume. Sell twice as many coffees and you buy roughly twice as many beans.",
      "Fixed costs do not move with sales in the short run. Rent is the same whether you serve 50 customers or 500.",
      "Some costs are neither: they hold flat and then jump, such as hiring a second shift when the first one is full.",
      "Because fixed costs are spread over more units as sales grow, profit usually grows faster than revenue.",
    ],
    example: {
      setup: "A café charges ₹150 a cup. Ingredients and cups cost ₹50 per cup. Rent, salaries and utilities total ₹15,00,000 a year.",
      steps: [
        "At 20,000 cups: revenue ₹30,00,000, variable costs 20,000 × ₹50 = ₹10,00,000, fixed costs ₹15,00,000. Profit = ₹5,00,000.",
        "At 24,000 cups (20% more): revenue ₹36,00,000, variable costs ₹12,00,000, fixed costs still ₹15,00,000. Profit = ₹9,00,000.",
        "Revenue rose 20%. Profit rose from ₹5,00,000 to ₹9,00,000, which is 80%.",
      ],
      meaning:
        "The extra 4,000 cups brought in ₹6,00,000 of revenue but only ₹2,00,000 of extra cost, because rent did not change. This amplification is called operating leverage — and it works just as violently in reverse when sales fall.",
    },
    keyTerms: [
      { term: "Variable cost", definition: "A cost that rises and falls with the number of units sold." },
      { term: "Fixed cost", definition: "A cost that stays the same in the short run regardless of sales." },
      { term: "Contribution", definition: "Price minus variable cost per unit — what each extra sale contributes to covering fixed costs." },
      { term: "Operating leverage", definition: "The tendency of profit to move by a larger percentage than revenue, caused by fixed costs." },
    ],
    takeaways: [
      "Classify costs by how they behave, not by their name.",
      "Fixed costs make profits swing more than revenue in both directions.",
      "A business with high fixed costs is more profitable when busy and more fragile when quiet.",
    ],
    commonMistakes: [
      "Assuming every cost scales neatly with revenue when forecasting.",
      "Treating 'fixed' as permanent. Rent is fixed this year and negotiable at renewal.",
    ],
    prerequisites: ["revenue"],
  },
  {
    id: "profit",
    title: "Profit",
    level: 0,
    module: "Finance basics",
    order: 7,
    status: "authored",
    summary: "What is left from revenue after costs — an accounting measure of performance, not of cash.",
    concept:
      "Profit is what remains when you subtract costs from revenue. There is no single profit number: you get a different one depending on which costs you have subtracted so far. Subtract only the direct cost of what you sold and you get gross profit. Keep going through operating costs, then interest, then tax, and you eventually reach net profit — the amount that belongs to the owners.",
    whyItMatters:
      "Profit is the headline measure of whether a business works. But because it is calculated using accounting rules rather than bank statements, a company can report a healthy profit in a year when its cash balance fell. Knowing which profit is being quoted, and how it differs from cash, is a core skill.",
    howItWorks: [
      "Start with revenue.",
      "Subtract the direct cost of producing what you sold to get gross profit.",
      "Subtract the costs of running the business — salaries, rent, marketing — to get operating profit.",
      "Subtract interest owed to lenders, then tax owed to the government, to get net profit.",
    ],
    formula: {
      calculates: "The profit remaining for owners after every other claim",
      expression: "Net profit = Revenue − Costs − Interest − Tax",
      variables: [
        { symbol: "Revenue", meaning: "Sales value for the period" },
        { symbol: "Costs", meaning: "Everything consumed to produce and sell" },
        { symbol: "Interest", meaning: "The amount owed to lenders for the period" },
        { symbol: "Tax", meaning: "The amount owed to the government on the profit" },
      ],
    },
    example: {
      setup: "A business has revenue of ₹100 crore, direct costs of ₹40 crore, operating costs of ₹35 crore, interest of ₹3 crore and a 25% tax rate.",
      steps: [
        "Gross profit = ₹100 crore − ₹40 crore = ₹60 crore.",
        "Operating profit = ₹60 crore − ₹35 crore = ₹25 crore.",
        "Profit before tax = ₹25 crore − ₹3 crore interest = ₹22 crore.",
        "Tax = ₹22 crore × 25% = ₹5.5 crore.",
        "Net profit = ₹22 crore − ₹5.5 crore = ₹16.5 crore.",
      ],
      meaning:
        "The same company can honestly be described as making ₹60 crore, ₹25 crore or ₹16.5 crore. Whenever someone quotes a profit figure, the first question is which line they mean.",
    },
    keyTerms: [
      { term: "Gross profit", definition: "Revenue minus the direct cost of the goods or services sold." },
      { term: "Operating profit", definition: "Profit after all running costs but before interest and tax." },
      { term: "Net profit", definition: "The final profit belonging to owners, after interest and tax." },
      { term: "Margin", definition: "A profit figure expressed as a percentage of revenue." },
    ],
    takeaways: [
      "There are several profit figures; always establish which one is being quoted.",
      "Profit is calculated under accounting rules and is not the same as cash generated.",
      "Margins let you compare profitability across businesses of different sizes.",
    ],
    commonMistakes: [
      "Assuming profit equals the increase in the bank balance.",
      "Comparing one company's gross profit with another's net profit.",
      "Judging a single year's profit without checking for one-off gains or losses.",
    ],
    prerequisites: ["revenue", "costs"],
  },
  {
    id: "cash",
    title: "Cash",
    level: 0,
    module: "Finance basics",
    order: 8,
    status: "authored",
    summary: "Money actually available to spend today — the thing a business cannot survive without.",
    concept:
      "Cash is money you can spend right now: notes, and balances in bank accounts you can draw on immediately. It is deliberately narrow. A customer who owes you ₹10 lakh next month is not cash. Stock sitting in a warehouse is not cash. Only money you could pay a supplier with today counts.",
    whyItMatters:
      "Profit is an opinion formed under accounting rules; cash is a fact you can verify at the bank. Businesses do not fail because they are unprofitable — they fail because on some particular day they cannot pay someone. Profitable companies go under regularly for exactly this reason.",
    howItWorks: [
      "Cash rises when customers pay you, when you borrow, and when owners invest.",
      "Cash falls when you pay suppliers and staff, buy equipment, repay loans and pay tax.",
      "Cash timing rarely matches profit timing: you often pay for stock long before a customer pays you.",
      "The gap between profit and cash is mostly explained by that timing, plus spending on long-lived assets.",
    ],
    formula: {
      calculates: "How the cash balance changed over a period",
      expression: "Ending cash = Starting cash + Cash in − Cash out",
      variables: [
        { symbol: "Starting cash", meaning: "The balance at the beginning of the period" },
        { symbol: "Cash in", meaning: "Collections from customers, borrowing, money from owners" },
        { symbol: "Cash out", meaning: "Payments to suppliers, staff, lenders, tax and for equipment" },
      ],
    },
    example: {
      setup: "A shop reports a ₹10 lakh profit for the year, but the owner says the bank balance barely moved.",
      steps: [
        "Profit for the year: ₹10,00,000.",
        "Customers owed ₹6,00,000 more at year-end than at the start — that revenue was earned but not collected.",
        "Stock on the shelves rose by ₹3,00,000 — cash was spent on goods not yet sold.",
        "Cash effect ≈ ₹10,00,000 − ₹6,00,000 − ₹3,00,000 = ₹1,00,000.",
      ],
      meaning:
        "The ₹10 lakh profit was real, but ₹9 lakh of it is sitting in customer invoices and warehouse shelves rather than the bank. This is the single most common way a growing business runs out of money.",
    },
    keyTerms: [
      { term: "Cash equivalent", definition: "A very short-term, very safe holding that can be turned into cash almost immediately." },
      { term: "Liquidity", definition: "How easily something can be turned into spendable cash." },
      { term: "Restricted cash", definition: "Cash the business holds but is not free to spend." },
      { term: "Insolvency", definition: "Being unable to pay obligations when they fall due." },
    ],
    takeaways: [
      "Cash is spendable today; almost nothing else on the balance sheet is.",
      "Profit and cash differ mainly because of timing and spending on long-lived assets.",
      "Growing businesses consume cash even when profitable, because stock and unpaid invoices grow first.",
    ],
    commonMistakes: [
      "Assuming a large cash balance means the business is safe, without checking what it owes next month.",
      "Counting money owed by customers as cash.",
    ],
    prerequisites: ["profit"],
  },
  {
    id: "assets",
    title: "Assets",
    level: 0,
    module: "Finance basics",
    order: 9,
    status: "authored",
    summary: "The things a business controls that it expects to produce value in future.",
    concept:
      "An asset is something the business controls and expects to get future benefit from. Cash, money owed by customers, stock, machinery, buildings and software licences are all assets. They differ enormously in how quickly they can be turned into cash — which matters more than their size.",
    whyItMatters:
      "The asset side of a balance sheet tells you where a company's capital has gone. Two businesses with ₹100 crore of assets are in completely different positions if one holds cash and the other holds unsold inventory.",
    howItWorks: [
      "Assets are usually listed in order of how quickly they become cash.",
      "Current assets are expected to convert to cash within about a year: cash itself, receivables, inventory.",
      "Non-current assets are held for longer: buildings, machinery, vehicles, long-term intangibles.",
      "Assets are generally recorded at what the business paid for them, which may be nothing like what they are worth today.",
    ],
    example: {
      setup: "Two businesses each report ₹100 crore of total assets.",
      steps: [
        "Business A: ₹60 crore cash, ₹20 crore receivables, ₹20 crore equipment.",
        "Business B: ₹5 crore cash, ₹15 crore receivables, ₹80 crore of specialised machinery.",
        "Both must pay a ₹25 crore bill next month.",
      ],
      meaning:
        "A pays it easily. B cannot — you cannot settle an invoice with machinery, and selling specialised equipment quickly usually means selling it cheaply. Identical asset totals, very different situations.",
    },
    keyTerms: [
      { term: "Current asset", definition: "An asset expected to become cash within roughly a year." },
      { term: "Non-current asset", definition: "An asset held for longer than a year, such as property or equipment." },
      { term: "Book value", definition: "The amount an asset is carried at in the accounts, usually based on original cost." },
      { term: "Intangible asset", definition: "A non-physical asset such as a licence, patent or brand." },
    ],
    takeaways: [
      "Assets are resources expected to generate future benefit.",
      "How fast an asset becomes cash matters more than how large it is.",
      "Book value reflects past cost, not current market value.",
    ],
    commonMistakes: [
      "Assuming an asset could be sold for the value shown in the accounts.",
      "Treating all assets as equally available to meet a bill.",
    ],
    prerequisites: ["cash"],
  },
  {
    id: "liabilities",
    title: "Liabilities",
    level: 0,
    module: "Finance basics",
    order: 10,
    status: "authored",
    summary: "What the business owes to people other than its owners.",
    concept:
      "A liability is an obligation the business already has because of something that has already happened. It owes a supplier for goods delivered, a bank for money borrowed, staff for work performed, the government for tax on profits earned. Debt is one kind of liability, but far from the only kind.",
    whyItMatters:
      "Liabilities are claims that rank ahead of the owners. When you assess risk, the questions are always the same: how much is owed, to whom, and — crucially — when.",
    howItWorks: [
      "Current liabilities are due within about a year: supplier invoices, salaries payable, short-term borrowing.",
      "Non-current liabilities are due later: long-term loans, bonds.",
      "Some liabilities carry interest (loans) and some do not (a supplier invoice due in 30 days).",
      "Every liability has a date attached, and that timing determines whether it is a problem.",
    ],
    example: {
      setup: "A business owes ₹70 crore in total.",
      steps: [
        "Case 1: ₹10 crore of supplier invoices due next month, ₹60 crore of loans repayable in eight years.",
        "Case 2: ₹10 crore of supplier invoices due next month, ₹60 crore of loans repayable in four months.",
      ],
      meaning:
        "The total is identical. Case 1 is manageable; Case 2 is a business that needs to refinance ₹60 crore within four months or fail. Reading only the total would have told you nothing.",
    },
    keyTerms: [
      { term: "Current liability", definition: "An obligation due within roughly a year." },
      { term: "Payable", definition: "Money owed to a supplier for goods or services already received." },
      { term: "Accrued expense", definition: "A cost already incurred but not yet invoiced or paid." },
      { term: "Maturity", definition: "The date a liability must be repaid." },
    ],
    takeaways: [
      "A liability is a present obligation arising from a past event.",
      "Not all liabilities are debt, and not all liabilities charge interest.",
      "Timing matters as much as size — always look at when amounts fall due.",
    ],
    commonMistakes: [
      "Equating total liabilities with debt.",
      "Comparing two companies on total liabilities without checking maturity dates.",
    ],
    prerequisites: ["assets"],
  },
  {
    id: "equity",
    title: "Equity",
    level: 0,
    module: "Finance basics",
    order: 11,
    status: "authored",
    summary: "What the owners are left with after everything owed to others is settled.",
    concept:
      "Equity is the owners' share of a business: everything the business has, minus everything it owes. It is a residual — you find it by subtraction, not by looking it up. It comes from two sources: money the owners put in, and profits the business earned and kept rather than paying out.",
    whyItMatters:
      "Equity is the buffer that absorbs losses before lenders are affected. It is also the base against which owner returns are measured. And its accounting value is usually very different from what the business would sell for, which is a distinction beginners must get right early.",
    howItWorks: [
      "Owners contribute money, which is recorded as paid-in capital.",
      "The business earns profits. Any profit not paid out to owners is retained and added to equity.",
      "Losses reduce equity. Payments to owners (dividends) reduce it too.",
      "Equity always equals assets minus liabilities — that relationship holds by construction.",
    ],
    formula: {
      calculates: "The owners' residual claim on the business",
      expression: "Equity = Assets − Liabilities",
      variables: [
        { symbol: "Assets", meaning: "Everything the business controls" },
        { symbol: "Liabilities", meaning: "Everything the business owes to non-owners" },
      ],
    },
    example: {
      setup: "A business has ₹150 crore of assets and ₹90 crore of liabilities.",
      steps: [
        "Equity = ₹150 crore − ₹90 crore = ₹60 crore.",
        "It then makes a ₹12 crore profit and pays ₹5 crore to owners as a dividend.",
        "Equity = ₹60 crore + ₹12 crore − ₹5 crore = ₹67 crore.",
      ],
      meaning:
        "The ₹67 crore is the accounting value of the owners' stake. If the business were listed, investors might value it at ₹200 crore or ₹30 crore. Accounting equity records what was put in and kept; market value reflects what people expect it to earn.",
    },
    keyTerms: [
      { term: "Paid-in capital", definition: "Money owners contributed directly to the business." },
      { term: "Retained earnings", definition: "Accumulated profits kept in the business rather than paid out." },
      { term: "Dividend", definition: "A payment of profit from the business to its owners." },
      { term: "Book equity", definition: "The accounting value of the owners' stake, as distinct from market value." },
    ],
    takeaways: [
      "Equity is a residual: assets minus liabilities.",
      "It grows through retained profit and shrinks through losses and dividends.",
      "Book equity and market value answer different questions and are rarely equal.",
    ],
    commonMistakes: [
      "Confusing book equity with what the company is worth.",
      "Forgetting that equity absorbs losses first, before lenders are touched.",
    ],
    prerequisites: ["assets", "liabilities"],
  },
  {
    id: "debt",
    title: "Debt",
    level: 0,
    module: "Finance basics",
    order: 12,
    status: "authored",
    summary: "Borrowed money that must be repaid on agreed terms, whatever the business earns.",
    concept:
      "Debt is money borrowed under a contract: the business receives cash now and promises to pay interest and return the principal on specified dates. The promise does not depend on how the business performs. That fixed, unconditional quality is what makes debt cheaper than equity for the borrower and safer for the provider.",
    whyItMatters:
      "Debt is the main lever a business has over its own risk. Used moderately it raises owner returns; used heavily it can destroy a business that would otherwise have survived a bad year.",
    howItWorks: [
      "The lender advances the principal.",
      "The borrower pays interest at agreed intervals — a cost that appears whether or not there is profit.",
      "The principal is repaid at maturity, or in instalments along the way.",
      "Because interest is contractual, cash flow that is more than enough in good years can be badly insufficient in weak ones.",
    ],
    formula: {
      calculates: "Debt net of the cash available to repay it",
      expression: "Net debt = Total debt − Cash",
      variables: [
        { symbol: "Total debt", meaning: "All borrowings outstanding" },
        { symbol: "Cash", meaning: "Cash and cash equivalents on hand" },
      ],
    },
    example: {
      setup: "Two identical businesses each earn ₹10 crore before interest. One has no debt; the other has ₹50 crore of debt at 10% and ₹50 crore of equity.",
      steps: [
        "No-debt business: earns ₹10 crore on ₹100 crore of equity — a 10% owner return.",
        "Levered business: interest = ₹50 crore × 10% = ₹5 crore. Owners keep ₹5 crore on ₹50 crore of equity — also 10%.",
        "Now earnings fall to ₹4 crore. No-debt business: 4% return. Levered business: ₹4 crore − ₹5 crore = a ₹1 crore loss.",
        "Now earnings rise to ₹16 crore. No-debt: 16%. Levered: (₹16 − ₹5) ÷ ₹50 = 22%.",
      ],
      meaning:
        "Debt did not create value on its own. It stretched the range of outcomes for the owners in both directions. That stretch is the entire economics of borrowing.",
    },
    keyTerms: [
      { term: "Principal", definition: "The amount borrowed, which must be repaid." },
      { term: "Maturity", definition: "The date by which the principal must be repaid." },
      { term: "Net debt", definition: "Total borrowings less cash on hand." },
      { term: "Covenant", definition: "A condition in a loan agreement the borrower must keep meeting." },
      { term: "Default", definition: "Failing to meet an obligation under the loan agreement." },
    ],
    takeaways: [
      "Debt obligations are fixed and do not flex with business performance.",
      "Borrowing widens the range of owner outcomes without itself creating value.",
      "Judge debt against the cash flow available to service it, not against profit alone.",
    ],
    commonMistakes: [
      "Judging debt by its size rather than by the ability to service it.",
      "Ignoring when the principal falls due.",
      "Assuming low interest rates make any level of borrowing safe.",
    ],
    prerequisites: ["equity", "liabilities"],
  },
  {
    id: "interest",
    title: "Interest",
    level: 0,
    module: "Finance basics",
    order: 13,
    status: "authored",
    summary: "The price paid for using someone else's money for a period of time.",
    concept:
      "Interest is rent on money. If you use ₹100 of someone else's money for a year, you pay them for that year of use. The rate is quoted as a percentage per period — almost always per year unless stated otherwise. Two rates that look identical can cost very different amounts if the periods or compounding differ.",
    whyItMatters:
      "Interest is the mechanism through which time has a price. Every discount rate, loan payment and bond yield in this curriculum is built on it.",
    howItWorks: [
      "Simple interest is charged only on the original principal.",
      "Compound interest is charged on the principal plus interest already added, so the balance grows on itself.",
      "How often interest is added matters: monthly compounding costs more over a year than annual compounding at the same quoted rate.",
      "Always match the rate to the period — a 12% annual rate is 1% per month, not 12% per month.",
    ],
    formula: {
      calculates: "Interest charged on the original principal only",
      expression: "Simple interest = Principal × Rate × Time",
      variables: [
        { symbol: "Principal", meaning: "The amount borrowed or lent" },
        { symbol: "Rate", meaning: "The interest rate per period, as a decimal" },
        { symbol: "Time", meaning: "The number of periods, in the same units as the rate" },
      ],
    },
    example: {
      setup: "You borrow ₹10,00,000 at 8% per year for 3 years.",
      steps: [
        "Simple interest: ₹10,00,000 × 8% × 3 = ₹2,40,000. Total repaid: ₹12,40,000.",
        "Compound interest, added annually: Year 1 interest = ₹80,000, balance ₹10,80,000.",
        "Year 2 interest = ₹10,80,000 × 8% = ₹86,400, balance ₹11,66,400.",
        "Year 3 interest = ₹11,66,400 × 8% = ₹93,312, balance ₹12,59,712.",
      ],
      meaning:
        "Same rate, same term, ₹19,712 difference. Compounding charged you interest on interest. Over longer periods this gap becomes enormous, which is the subject of the next module.",
    },
    keyTerms: [
      { term: "Principal", definition: "The original amount borrowed or invested." },
      { term: "Simple interest", definition: "Interest calculated on the principal only." },
      { term: "Compound interest", definition: "Interest calculated on principal plus previously added interest." },
      { term: "Nominal rate", definition: "The quoted annual rate, before accounting for compounding frequency." },
      { term: "Effective rate", definition: "The true annual cost once compounding frequency is included." },
    ],
    takeaways: [
      "Interest is the price of using money over time.",
      "Compounding charges interest on interest and always costs more than simple interest over multiple periods.",
      "A quoted rate is meaningless without knowing its period and compounding frequency.",
    ],
    commonMistakes: [
      "Comparing a monthly rate with an annual rate directly.",
      "Ignoring compounding frequency when comparing two loan offers.",
    ],
    prerequisites: ["debt"],
  },
  {
    id: "risk",
    title: "Risk",
    level: 0,
    module: "Finance basics",
    order: 14,
    status: "authored",
    summary: "The possibility that the outcome differs from what you expected — including permanently losing money.",
    concept:
      "Risk is the fact that you do not know what will happen. In finance it has two distinct meanings that beginners often merge. The first is volatility: how much a value bounces around. The second is permanent loss: the chance the money simply does not come back. A price that swings and recovers is volatile. A company that goes bankrupt is a permanent loss. They are not the same thing.",
    whyItMatters:
      "Risk is what you are paid to bear. Every extra percentage point of expected return in finance exists because someone accepted a risk to earn it. If you cannot name the risk you are taking, you cannot judge whether the return compensates you for it.",
    howItWorks: [
      "Identify what could differ from expectations, and by how much.",
      "Separate risks that resolve over time from risks that destroy value permanently.",
      "Ask whether the risk can be reduced by spreading money across many holdings, or whether it affects everything at once.",
      "Compare the compensation offered against the risk actually taken.",
    ],
    example: {
      setup: "Two ways to invest ₹1,00,000 for a year.",
      steps: [
        "Option A: a government bond paying 7%. You expect ₹1,07,000 with high confidence.",
        "Option B: a share that might return 30%, might return −20%, and averages around 12%.",
        "The extra expected 5% in Option B is the payment for accepting the −20% possibility.",
      ],
      meaning:
        "Option B is not better because its expected return is higher. It is a different trade: more expected return in exchange for the real chance of ending the year with ₹80,000. Whether that trade suits you depends on when you need the money.",
    },
    keyTerms: [
      { term: "Volatility", definition: "How much a value fluctuates over time." },
      { term: "Permanent loss of capital", definition: "Money that is gone and will not recover." },
      { term: "Diversification", definition: "Spreading money across holdings so no single failure is decisive." },
      { term: "Systematic risk", definition: "Risk affecting the whole market, which diversification cannot remove." },
      { term: "Credit risk", definition: "The risk a borrower fails to pay what was promised." },
    ],
    takeaways: [
      "Volatility and permanent loss are different risks and deserve different responses.",
      "Extra expected return always exists because a risk is being borne.",
      "Diversification reduces risks specific to one holding, not risks affecting everything.",
    ],
    commonMistakes: [
      "Treating price fluctuation as the only form of risk.",
      "Assuming that because something has not gone wrong yet, it cannot.",
      "Believing a high expected return is free money rather than compensation.",
    ],
    prerequisites: ["what-is-finance"],
  },
  {
    id: "return",
    title: "Return",
    level: 0,
    module: "Finance basics",
    order: 15,
    status: "authored",
    summary: "How much you gained or lost, measured against what you put in.",
    concept:
      "Return measures the result of an investment relative to its size. A ₹5,000 gain means nothing until you know whether it came from ₹10,000 or ₹10,00,000. Expressing it as a percentage makes different investments comparable — provided you also compare the same time period.",
    whyItMatters:
      "Return is the number every investment is ultimately judged by. It is also the easiest number to present misleadingly, by choosing a flattering period, ignoring costs, or leaving out income received along the way.",
    howItWorks: [
      "Take the ending value and subtract the beginning value to get the gain or loss.",
      "Add any income received during the period, such as dividends or interest.",
      "Divide by the beginning value to express the result as a proportion.",
      "State the period. A 15% return over one year and 15% over five years are very different outcomes.",
    ],
    formula: {
      calculates: "The total percentage gain over a holding period, including income",
      expression: "Return = (Ending value − Beginning value + Income) ÷ Beginning value",
      variables: [
        { symbol: "Ending value", meaning: "What the investment is worth at the end" },
        { symbol: "Beginning value", meaning: "What you paid at the start" },
        { symbol: "Income", meaning: "Dividends, interest or other cash received during the period" },
      ],
    },
    example: {
      setup: "You buy a share for ₹500. A year later it is worth ₹540 and it paid a ₹15 dividend.",
      steps: [
        "Capital gain = ₹540 − ₹500 = ₹40.",
        "Income = ₹15.",
        "Total gain = ₹40 + ₹15 = ₹55.",
        "Return = ₹55 ÷ ₹500 = 0.11 = 11%.",
      ],
      meaning:
        "Ignoring the dividend would have given 8% and understated the result by nearly a third. Any return figure that omits income received is incomplete.",
    },
    keyTerms: [
      { term: "Capital gain", definition: "The increase in the price of an asset." },
      { term: "Income yield", definition: "Cash received during the holding period, as a percentage of the amount invested." },
      { term: "Total return", definition: "Capital gain plus income together." },
      { term: "Annualised return", definition: "A multi-period return restated as an equivalent yearly rate." },
    ],
    takeaways: [
      "Return is a gain expressed relative to the amount invested.",
      "Total return includes income, not just price change.",
      "A return figure is meaningless without its time period.",
    ],
    commonMistakes: [
      "Quoting a price gain and calling it the return.",
      "Comparing returns over different holding periods without annualising.",
      "Ignoring fees, costs and taxes, which all reduce what you actually keep.",
    ],
    prerequisites: ["risk"],
  },

  // ── Module: Time value & decision making ────────────────────────────────
  {
    id: "time-value-of-money",
    title: "Time value of money",
    level: 0,
    module: "Time value & decision making",
    order: 16,
    status: "authored",
    summary: "₹100 today is worth more than ₹100 next year, and the gap can be calculated exactly.",
    concept:
      "Money available now is worth more than the same amount later. There are three reasons: you could invest it and earn a return, prices generally rise so it buys less later, and a future promise might not be kept. This single idea — that timing changes value — is the foundation of essentially all valuation.",
    whyItMatters:
      "Financial decisions almost always compare amounts arriving at different times. Without a way to move money between dates, you simply cannot compare ₹1 crore today against ₹1.5 crore in five years. Time value of money is that tool.",
    howItWorks: [
      "Choose a rate that reflects what you could earn elsewhere at comparable risk.",
      "To move money forward in time, multiply by (1 + rate) for each period. This is compounding.",
      "To move money backward in time, divide by (1 + rate) for each period. This is discounting.",
      "Once every amount has been moved to the same date, you can compare them directly.",
    ],
    formula: {
      calculates: "The value of an amount at a different point in time",
      expression: "FV = PV × (1 + r)ⁿ   and   PV = FV ÷ (1 + r)ⁿ",
      variables: [
        { symbol: "PV", meaning: "Present value — the amount valued today" },
        { symbol: "FV", meaning: "Future value — the amount valued at a future date" },
        { symbol: "r", meaning: "The rate per period, as a decimal" },
        { symbol: "n", meaning: "The number of periods" },
      ],
    },
    example: {
      setup: "Someone offers you ₹1,50,000 in five years. You could otherwise earn 10% a year. Is it worth ₹1,00,000 today?",
      steps: [
        "Move the future amount back five years: (1.10)⁵ = 1.6105.",
        "PV = ₹1,50,000 ÷ 1.6105 = ₹93,140.",
        "₹93,140 is less than the ₹1,00,000 you would pay.",
      ],
      meaning:
        "You would be paying ₹1,00,000 for something worth ₹93,140 today, so you should decline. Equivalently: ₹1,00,000 invested at 10% grows to ₹1,61,051 in five years, comfortably more than ₹1,50,000.",
    },
    keyTerms: [
      { term: "Present value", definition: "What a future amount is worth today." },
      { term: "Future value", definition: "What a present amount grows to by a future date." },
      { term: "Discounting", definition: "Moving a future amount back to today's value." },
      { term: "Discount rate", definition: "The rate used to move money between dates." },
    ],
    takeaways: [
      "Timing changes value, and the change can be calculated precisely.",
      "Compounding moves money forward; discounting moves it back.",
      "Comparisons are only valid once all amounts sit on the same date.",
    ],
    commonMistakes: [
      "Adding up cash flows from different years without discounting them.",
      "Mixing an annual rate with monthly periods.",
      "Using the same discount rate for a safe cash flow and a risky one.",
    ],
    prerequisites: ["interest", "return"],
  },
  {
    id: "compounding",
    title: "Compounding",
    level: 0,
    module: "Time value & decision making",
    order: 17,
    status: "authored",
    summary: "Earning returns on your previous returns, which makes growth accelerate over time.",
    concept:
      "Compounding is what happens when the returns you earn start earning returns themselves. In year one you earn on your original money. In year two you earn on the original money plus year one's gain. The base keeps growing, so each year adds more than the last — growth curves upward instead of running in a straight line.",
    whyItMatters:
      "Compounding explains why small differences in rate or time produce enormous differences in outcome, and why starting early matters more than most people expect. It also works against you: it is exactly why unpaid credit-card balances become unmanageable.",
    howItWorks: [
      "Apply the rate to the current balance, not the original amount.",
      "Add the result to the balance.",
      "Repeat. Each cycle starts from a larger base than the last.",
      "The more periods you run, the more the curve pulls away from a straight line.",
    ],
    formula: {
      calculates: "What an amount grows to when returns are reinvested",
      expression: "FV = PV × (1 + r)ⁿ",
      variables: [
        { symbol: "PV", meaning: "The amount you start with" },
        { symbol: "r", meaning: "The return per period, as a decimal" },
        { symbol: "n", meaning: "The number of periods" },
      ],
    },
    example: {
      setup: "₹1,00,000 invested at 12% a year.",
      steps: [
        "After 1 year: ₹1,00,000 × 1.12 = ₹1,12,000.",
        "After 5 years: ₹1,00,000 × 1.12⁵ = ₹1,76,234.",
        "After 10 years: ₹1,00,000 × 1.12¹⁰ = ₹3,10,585.",
        "Simple interest at 12% would have given only ₹2,20,000 after 10 years.",
      ],
      meaning:
        "The first five years added ₹76,234. The next five added ₹1,34,351 — nearly twice as much, from the same rate. Nothing changed except that the base was larger. This is why time in the market matters so much.",
    },
    keyTerms: [
      { term: "Compounding period", definition: "How often returns are added to the balance." },
      { term: "CAGR", definition: "Compound annual growth rate — the constant yearly rate that links a start and end value." },
      { term: "Reinvestment", definition: "Putting returns back to work rather than withdrawing them." },
    ],
    takeaways: [
      "Compounding means earning on your earnings, so growth accelerates.",
      "Time matters more than most beginners expect, because the later years contribute most.",
      "The same mechanism makes unpaid high-interest debt grow dangerously fast.",
    ],
    commonMistakes: [
      "Assuming a 12% return doubles money in roughly 8 years by simple multiplication rather than compounding (it takes about 6).",
      "Withdrawing returns and still expecting compounded growth.",
      "Applying an average annual return to a volatile series — losses compound too, and a −50% year needs +100% to recover.",
    ],
    prerequisites: ["time-value-of-money"],
  },
  {
    id: "inflation",
    title: "Inflation",
    level: 0,
    module: "Time value & decision making",
    order: 18,
    status: "authored",
    summary: "Prices rising over time, which quietly reduces what your money can buy.",
    concept:
      "Inflation is a general rise in prices across the economy. Its practical effect is that a fixed amount of money buys less each year. Your bank balance does not shrink — its purchasing power does. This is why a return that looks positive can still leave you worse off.",
    whyItMatters:
      "Every long-term financial plan must be stated in terms of what money can buy, not how many rupees you hold. A pension that looks generous in today's rupees may be inadequate in thirty years.",
    howItWorks: [
      "Prices across a basket of goods are measured over time to produce an inflation rate.",
      "Nominal amounts are the rupee figures you actually see.",
      "Real amounts adjust those figures for the change in purchasing power.",
      "Roughly, real return ≈ nominal return − inflation. This approximation is fine at low rates.",
    ],
    formula: {
      calculates: "Return after adjusting for the loss of purchasing power",
      expression: "Real return ≈ Nominal return − Inflation rate",
      variables: [
        { symbol: "Nominal return", meaning: "The return in rupee terms, as reported" },
        { symbol: "Inflation rate", meaning: "The rate at which prices are rising" },
      ],
    },
    example: {
      setup: "You keep ₹5,00,000 in a savings account paying 4%. Inflation runs at 6%.",
      steps: [
        "After a year you have ₹5,00,000 × 1.04 = ₹5,20,000 — more rupees than before.",
        "But the goods that cost ₹5,00,000 last year now cost ₹5,00,000 × 1.06 = ₹5,30,000.",
        "Real return ≈ 4% − 6% = −2%.",
      ],
      meaning:
        "Your balance grew and your buying power fell. 'Safe' cash is not risk-free — it carries the near-certainty of losing purchasing power when inflation exceeds the interest rate.",
    },
    keyTerms: [
      { term: "Nominal", definition: "Stated in current rupees, without adjusting for inflation." },
      { term: "Real", definition: "Adjusted for inflation, so it reflects purchasing power." },
      { term: "Purchasing power", definition: "The quantity of goods a given amount of money can buy." },
      { term: "Deflation", definition: "A general fall in prices — the opposite of inflation." },
    ],
    takeaways: [
      "Inflation reduces what money buys, even when the rupee amount rises.",
      "Real return is the figure that reflects whether you are actually better off.",
      "Never mix nominal cash flows with a real rate, or the reverse, in the same calculation.",
    ],
    commonMistakes: [
      "Treating cash as risk-free when inflation exceeds the interest earned.",
      "Building a 30-year plan in today's rupees without inflating the target.",
      "Mistaking one product becoming expensive for economy-wide inflation.",
    ],
    jurisdictionNote:
      "Inflation rates, the measurement basket and the official index differ by country and are revised over time. Treat any specific rate as a current observation, not a fixed fact.",
    prerequisites: ["time-value-of-money"],
  },
  {
    id: "present-value",
    title: "Present value",
    level: 0,
    module: "Time value & decision making",
    order: 19,
    status: "authored",
    summary: "What a future amount of money is worth today.",
    concept:
      "Present value answers one question: if someone will pay me a certain amount on a future date, how much is that promise worth right now? You find it by discounting — dividing the future amount by the growth you could otherwise have achieved over that time.",
    whyItMatters:
      "Present value is the engine inside every valuation method you will meet later. Discounted cash flow analysis, bond pricing and project appraisal are all repeated applications of this one calculation.",
    howItWorks: [
      "Identify each future cash flow and the exact date it arrives.",
      "Choose a discount rate reflecting the return available elsewhere at similar risk.",
      "Divide each cash flow by (1 + r) raised to the number of periods until it arrives.",
      "Add the discounted amounts together to get the total present value.",
    ],
    formula: {
      calculates: "Today's value of a single future cash flow",
      expression: "PV = CF ÷ (1 + r)ᵗ",
      variables: [
        { symbol: "CF", meaning: "The cash flow arriving in the future" },
        { symbol: "r", meaning: "The discount rate per period" },
        { symbol: "t", meaning: "Number of periods until the cash flow arrives" },
      ],
    },
    example: {
      setup: "A project pays ₹50,000 at the end of year 1 and ₹80,000 at the end of year 2. Your discount rate is 10%.",
      steps: [
        "Year 1: ₹50,000 ÷ 1.10 = ₹45,455.",
        "Year 2: ₹80,000 ÷ (1.10)² = ₹80,000 ÷ 1.21 = ₹66,116.",
        "Total present value = ₹45,455 + ₹66,116 = ₹1,11,571.",
      ],
      meaning:
        "The project's promised cash adds up to ₹1,30,000, but it is worth ₹1,11,571 today. If it costs less than ₹1,11,571 it adds value; if it costs more, it does not.",
    },
    keyTerms: [
      { term: "Discounting", definition: "Converting a future amount into today's value." },
      { term: "Discount rate", definition: "The rate used to discount, reflecting time and risk." },
      { term: "Net present value", definition: "Total present value of inflows minus the upfront cost." },
    ],
    takeaways: [
      "Present value converts future money into today's terms so amounts can be compared.",
      "A higher discount rate produces a lower present value.",
      "Cash flows further in the future are discounted more heavily.",
    ],
    commonMistakes: [
      "Getting the number of periods wrong by one — check whether a cash flow arrives at the start or end of a year.",
      "Using one discount rate for cash flows of very different risk.",
      "Summing undiscounted cash flows and calling the total a value.",
    ],
    prerequisites: ["time-value-of-money"],
  },
  {
    id: "future-value",
    title: "Future value",
    level: 0,
    module: "Time value & decision making",
    order: 20,
    status: "authored",
    summary: "What an amount you hold today will grow to by a future date.",
    concept:
      "Future value is the mirror image of present value. Instead of asking what a future amount is worth today, you ask what today's amount becomes later. You multiply by (1 + rate) once for each period the money stays invested.",
    whyItMatters:
      "Future value is how you set and test savings goals. It converts a plan — 'I will save this much at this rate for this long' — into a number you can check against what you actually need.",
    howItWorks: [
      "Start with the amount you have today.",
      "Multiply by (1 + r) for each period the money remains invested.",
      "If you add money regularly, each contribution compounds only for the periods remaining after it arrives.",
      "Small changes in rate or in the number of years change the answer a great deal.",
    ],
    formula: {
      calculates: "What a present amount grows to by a future date",
      expression: "FV = PV × (1 + r)ⁿ",
      variables: [
        { symbol: "PV", meaning: "The amount today" },
        { symbol: "r", meaning: "The rate per period, as a decimal" },
        { symbol: "n", meaning: "The number of periods" },
      ],
    },
    example: {
      setup: "You invest ₹2,00,000 today at 9% a year and leave it for 12 years.",
      steps: [
        "Growth factor = (1.09)¹² = 2.8127.",
        "FV = ₹2,00,000 × 2.8127 = ₹5,62,540.",
        "At 11% instead: (1.11)¹² = 3.4985, so FV = ₹6,99,700.",
      ],
      meaning:
        "Two extra percentage points added ₹1,37,160 — about 68% of the original investment — without you saving a rupee more. Rate and time do the heavy lifting in long-horizon saving.",
    },
    keyTerms: [
      { term: "Growth factor", definition: "The multiple (1 + r)ⁿ by which an amount grows." },
      { term: "Horizon", definition: "How long money stays invested." },
      { term: "Regular contribution", definition: "An amount added each period, each compounding for the time remaining." },
    ],
    takeaways: [
      "Future value moves today's money forward to a future date.",
      "Small rate differences compound into large amounts over long horizons.",
      "Money added later compounds for less time and contributes proportionally less.",
    ],
    commonMistakes: [
      "Applying an annual rate to monthly contributions without converting the rate.",
      "Assuming a projected future value is a promise rather than a projection.",
      "Forgetting that inflation will reduce what that future amount buys.",
    ],
    prerequisites: ["compounding"],
  },
  {
    id: "opportunity-cost",
    title: "Opportunity cost",
    level: 0,
    module: "Time value & decision making",
    order: 21,
    status: "authored",
    summary: "The value of the best thing you gave up in order to do what you chose.",
    concept:
      "Every choice rules out other choices. Opportunity cost is the value of the best alternative you did not take. It rarely appears in accounts or on a bank statement, but it is often the most important number in a decision, because a choice can be profitable and still be the wrong one.",
    whyItMatters:
      "Opportunity cost is where discount rates come from. When you ask what rate to use in a present value calculation, you are asking what you could earn on the next-best use of that money at similar risk.",
    howItWorks: [
      "List the realistic alternatives, not just the one being proposed.",
      "Estimate the return of the best alternative at comparable risk.",
      "Judge the proposed option against that alternative, not against zero.",
      "Ignore money already spent that you cannot recover — it is the same under every option.",
    ],
    example: {
      setup: "You have ₹5,00,000. You can put it into a friend's business expecting 11%, or repay a personal loan charging 14%.",
      steps: [
        "Business: expected gain ≈ ₹5,00,000 × 11% = ₹55,000, and uncertain.",
        "Loan repayment: interest avoided = ₹5,00,000 × 14% = ₹70,000, and certain.",
        "Choosing the business costs you ₹70,000 of certain savings to chase ₹55,000 of uncertain gain.",
      ],
      meaning:
        "The business investment is 'profitable' in isolation and still the wrong decision. Repaying expensive debt is a guaranteed 14% return, and almost nothing available to an individual beats a certain 14%.",
    },
    keyTerms: [
      { term: "Opportunity cost", definition: "The value of the best alternative forgone." },
      { term: "Sunk cost", definition: "Money already spent that cannot be recovered and should not influence the decision." },
      { term: "Hurdle rate", definition: "The minimum return a project must beat, set by the best alternative." },
    ],
    takeaways: [
      "Judge every option against the best alternative, not against doing nothing.",
      "Opportunity cost is where discount rates and hurdle rates come from.",
      "Sunk costs are irrelevant to what you should do next.",
    ],
    commonMistakes: [
      "Comparing an investment to zero return instead of to the realistic alternative.",
      "Continuing a failing project because of money already spent.",
      "Ignoring non-money costs such as your own time.",
    ],
    prerequisites: ["present-value"],
  },
  {
    id: "risk-vs-reward",
    title: "Risk vs reward",
    level: 0,
    module: "Time value & decision making",
    order: 22,
    status: "authored",
    summary: "Higher expected returns exist because higher risks are being accepted — never as a free gift.",
    concept:
      "In a functioning market, you are not offered a higher expected return for nothing. If an investment promises more, it is because something about it is less certain: the borrower might not pay, the price might swing, or you might not be able to sell when you want. The trade-off is the organising principle of investing.",
    whyItMatters:
      "This idea is your best protection against both fraud and self-deception. When something offers high returns with no apparent risk, the correct response is to find the risk — not to assume it does not exist.",
    howItWorks: [
      "Start with the return on the safest available asset — typically short-term government debt.",
      "Every riskier option must offer more than this to attract money at all.",
      "The extra return above the safe rate is called the risk premium.",
      "Your job as an investor is to judge whether the premium is large enough for the risk you are taking.",
    ],
    formula: {
      calculates: "The expected return required for a risky investment",
      expression: "Expected return = Risk-free rate + Risk premium",
      variables: [
        { symbol: "Risk-free rate", meaning: "The return on the safest available asset" },
        { symbol: "Risk premium", meaning: "The extra expected return demanded for bearing the risk" },
      ],
    },
    example: {
      setup: "Government bonds yield 7%. Three options are offered to you.",
      steps: [
        "A large stable company's bond yields 8.5%. Premium = 1.5% for the chance it cannot repay.",
        "A diversified equity portfolio has expected return around 12%. Premium = 5% for price swings and uncertain profits.",
        "A scheme promises a guaranteed 24% with 'no risk'. Premium = 17% for a risk the promoter says does not exist.",
      ],
      meaning:
        "The first two premiums are explainable — you can name what you are being paid to bear. The third cannot be. A 17% premium with no identifiable risk means the risk has been hidden, not removed.",
    },
    keyTerms: [
      { term: "Risk-free rate", definition: "The return on the safest available asset, usually short-term government debt." },
      { term: "Risk premium", definition: "Extra expected return demanded for accepting risk." },
      { term: "Expected return", definition: "The probability-weighted average of possible outcomes — not a promise." },
    ],
    takeaways: [
      "Higher expected return is compensation for risk, never a free gift.",
      "If you cannot name the risk you are being paid for, you have not found it yet.",
      "'Guaranteed' and 'high return' together should always trigger scrutiny.",
    ],
    commonMistakes: [
      "Reading an expected return as a promised return.",
      "Assuming an investment that has not lost money yet is low risk.",
      "Comparing returns across options without comparing their risks.",
    ],
    prerequisites: ["risk", "return", "opportunity-cost"],
  },
];
