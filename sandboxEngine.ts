/**
 * Sandbox engine.
 *
 * Each sandbox "kind" is a small financial calculator: named numeric inputs in,
 * labelled results out. Lessons declare which kind they use and the default
 * values that suit their example, so the UI component stays generic while the
 * numbers stay topic-specific. All arithmetic lives here so it can be unit
 * tested without rendering anything.
 */

export type SandboxOutput = { label: string; value: string; note?: string };

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");
const pct = (n: number, dp = 1) => `${n.toFixed(dp)}%`;

type Compute = (v: Record<string, number>) => SandboxOutput[];

export const sandboxKinds: Record<string, Compute> = {
  /** FV = P × (1+r)^n */
  "future-value": ({ principal = 0, rate = 0, years = 0 }) => {
    const fv = principal * Math.pow(1 + rate / 100, years);
    return [
      { label: "Future value", value: inr(fv) },
      { label: "Total growth", value: inr(fv - principal), note: `${inr(principal)} growing at ${pct(rate)} a year for ${years} year(s).` },
    ];
  },

  /** PV = CF ÷ (1+r)^t */
  "present-value": ({ amount = 0, rate = 0, years = 0 }) => {
    const pv = amount / Math.pow(1 + rate / 100, years);
    return [
      { label: "Present value", value: inr(pv) },
      { label: "Discount applied", value: inr(amount - pv), note: `What ${inr(amount)} arriving in ${years} year(s) is worth today at ${pct(rate)}.` },
    ];
  },

  /** Simple P(1+rn) vs compound P(1+r)^n, and the gap between them. */
  "simple-vs-compound": ({ principal = 0, rate = 0, years = 0 }) => {
    const simple = principal * (1 + (rate / 100) * years);
    const compound = principal * Math.pow(1 + rate / 100, years);
    return [
      { label: "Simple interest total", value: inr(simple) },
      { label: "Compound interest total", value: inr(compound) },
      { label: "Extra from compounding", value: inr(compound - simple), note: "The gap is interest earned on interest. Stretch the years and watch it widen." },
    ];
  },

  /** Nominal growth vs purchasing power after inflation. */
  "inflation-real": ({ amount = 0, nominalRate = 0, inflation = 0, years = 0 }) => {
    const nominal = amount * Math.pow(1 + nominalRate / 100, years);
    const real = amount * Math.pow((1 + nominalRate / 100) / (1 + inflation / 100), years);
    const realRate = ((1 + nominalRate / 100) / (1 + inflation / 100) - 1) * 100;
    return [
      { label: "Balance in rupees", value: inr(nominal) },
      { label: "In today's purchasing power", value: inr(real) },
      { label: "Real return per year", value: pct(realRate, 2), note: realRate < 0 ? "Your balance grows while your buying power falls." : "Growth after inflation — the figure that says whether you are better off." },
    ];
  },

  /** Revenue = price × volume, this year and next. */
  "revenue-growth": ({ price = 0, volume = 0, priceGrowth = 0, volumeGrowth = 0 }) => {
    const now = price * volume;
    const next = price * (1 + priceGrowth / 100) * volume * (1 + volumeGrowth / 100);
    return [
      { label: "Revenue this year", value: inr(now) },
      { label: "Revenue next year", value: inr(next) },
      { label: "Growth", value: pct(now ? (next / now - 1) * 100 : 0), note: "Price and volume growth multiply — the total is more than their sum." },
    ];
  },

  /** Fixed costs amplify profit swings relative to revenue swings. */
  "operating-leverage": ({ price = 0, variableCost = 0, units = 0, fixedCosts = 0, volumeChange = 0 }) => {
    const profitAt = (u: number) => (price - variableCost) * u - fixedCosts;
    const before = profitAt(units);
    const after = profitAt(units * (1 + volumeChange / 100));
    const profitSwing = before !== 0 ? ((after - before) / Math.abs(before)) * 100 : 0;
    return [
      { label: "Profit now", value: inr(before) },
      { label: `Profit after ${pct(volumeChange, 0)} volume change`, value: inr(after) },
      { label: "Profit swing", value: pct(profitSwing, 0), note: "Compare this with the volume change — fixed costs amplify it in both directions." },
    ];
  },

  /** Revenue down to net profit, one subtraction at a time. */
  "profit-bridge": ({ revenue = 0, cogs = 0, opex = 0, interest = 0, taxRate = 0 }) => {
    const gross = revenue - cogs;
    const operating = gross - opex;
    const pbt = operating - interest;
    const tax = Math.max(pbt, 0) * (taxRate / 100);
    const net = pbt - tax;
    return [
      { label: "Gross profit", value: inr(gross) },
      { label: "Operating profit", value: inr(operating) },
      { label: "Profit before tax", value: inr(pbt) },
      { label: "Net profit", value: inr(net), note: revenue ? `Net margin ${pct((net / revenue) * 100)}.` : undefined },
    ];
  },

  /** Profit adjusted for cash trapped in receivables and inventory. */
  "profit-to-cash": ({ profit = 0, receivablesIncrease = 0, inventoryIncrease = 0, payablesIncrease = 0 }) => {
    const cash = profit - receivablesIncrease - inventoryIncrease + payablesIncrease;
    return [
      { label: "Reported profit", value: inr(profit) },
      { label: "Cash effect", value: inr(cash), note: "Unpaid invoices and unsold stock absorb cash; supplier credit releases it." },
      { label: "Gap", value: inr(profit - cash) },
    ];
  },

  /** Total return = (sell − buy + income) ÷ buy. */
  "holding-return": ({ buyPrice = 0, sellPrice = 0, income = 0 }) => {
    const gain = sellPrice - buyPrice + income;
    return [
      { label: "Total gain", value: inr(gain) },
      { label: "Total return", value: pct(buyPrice ? (gain / buyPrice) * 100 : 0), note: "Income counts. Leaving it out understates the result." },
    ];
  },

  /** Compare a chosen option against the best alternative. */
  "opportunity": ({ amount = 0, chosenReturn = 0, alternativeReturn = 0 }) => {
    const chosen = amount * (chosenReturn / 100);
    const alt = amount * (alternativeReturn / 100);
    return [
      { label: "Chosen option earns", value: inr(chosen) },
      { label: "Best alternative earns", value: inr(alt) },
      { label: "Opportunity cost of choosing", value: inr(alt - chosen), note: alt > chosen ? "Positive means the alternative was better — the choice has a hidden cost." : "Zero or negative means the chosen option beats the alternative." },
    ];
  },

  /** Probability-weighted outcome of a risky bet. */
  "risk-outcomes": ({ amount = 0, goodChance = 0, goodReturn = 0, badReturn = 0 }) => {
    const p = Math.min(Math.max(goodChance, 0), 100) / 100;
    const expected = p * (goodReturn / 100) + (1 - p) * (badReturn / 100);
    return [
      { label: "Good year ends at", value: inr(amount * (1 + goodReturn / 100)) },
      { label: "Bad year ends at", value: inr(amount * (1 + badReturn / 100)) },
      { label: "Expected return", value: pct(expected * 100), note: "An average of outcomes, not a promise — you never actually receive the average." },
    ];
  },

  /** Owner return with and without borrowing. */
  "leverage-returns": ({ operatingProfit = 0, debt = 0, interestRate = 0, equity = 0 }) => {
    const interest = debt * (interestRate / 100);
    const ownerProfit = operatingProfit - interest;
    const totalCapital = debt + equity;
    const unlevered = totalCapital ? (operatingProfit / totalCapital) * 100 : 0;
    const levered = equity ? (ownerProfit / equity) * 100 : 0;
    return [
      { label: "Interest owed", value: inr(interest), note: "Owed in full whatever the year looks like." },
      { label: "Left for owners", value: inr(ownerProfit) },
      { label: "Owner return with debt", value: pct(levered) },
      { label: "Return if all-equity", value: pct(unlevered), note: "Cut operating profit and watch the levered return fall much faster." },
    ];
  },

  /** Equity as the residual: A − L. */
  "balance": ({ assets = 0, liabilities = 0 }) => [
    { label: "Equity", value: inr(assets - liabilities), note: "Found by subtraction — the owners keep whatever is left." },
  ],

  /** Operating working capital from its three main parts. */
  "working-capital": ({ inventory = 0, receivables = 0, payables = 0 }) => [
    { label: "Operating working capital", value: inr(inventory + receivables - payables), note: "Cash locked into running the business. Grow the first two and it rises — consuming cash." },
  ],

  /** Cash tied up in receivables at different collection speeds. */
  "receivables-cash": ({ revenue = 0, dsoNow = 0, dsoNew = 0 }) => {
    const now = (dsoNow / 365) * revenue;
    const later = (dsoNew / 365) * revenue;
    return [
      { label: `Cash tied up at ${dsoNow} days`, value: inr(now) },
      { label: `Cash tied up at ${dsoNew} days`, value: inr(later) },
      { label: later > now ? "Extra cash consumed" : "Cash released", value: inr(Math.abs(later - now)), note: "Every extra day of collection time is your money financing customers." },
    ];
  },

  /** Cash released or consumed by paying suppliers slower or faster. */
  "payables-cash": ({ cogs = 0, dpoNow = 0, dpoNew = 0 }) => {
    const now = (dpoNow / 365) * cogs;
    const later = (dpoNew / 365) * cogs;
    return [
      { label: `Supplier credit at ${dpoNow} days`, value: inr(now) },
      { label: `Supplier credit at ${dpoNew} days`, value: inr(later) },
      { label: later > now ? "One-off cash released" : "Cash given up", value: inr(Math.abs(later - now)), note: "A real benefit, but it happens once — it is not recurring cash flow." },
    ];
  },

  /** Buy stock, sell part of it at a markup. */
  "sell-through": ({ stockBought = 0, percentSold = 0, markup = 0 }) => {
    const share = Math.min(Math.max(percentSold, 0), 100) / 100;
    const cogs = stockBought * share;
    const revenue = cogs * (1 + markup / 100);
    return [
      { label: "Revenue", value: inr(revenue) },
      { label: "Cost of goods sold", value: inr(cogs) },
      { label: "Gross profit", value: inr(revenue - cogs) },
      { label: "Stock still on the shelf", value: inr(stockBought - cogs), note: "Cash already spent, profit untouched — and at risk if it must be discounted." },
    ];
  },

  /** A cost paid once, spread over the months it covers. */
  "spread-cost": ({ totalCost = 0, monthsCovered = 0, monthsElapsed = 0 }) => {
    const months = Math.max(monthsCovered, 1);
    const elapsed = Math.min(Math.max(monthsElapsed, 0), months);
    const monthly = totalCost / months;
    return [
      { label: "Expense per month", value: inr(monthly) },
      { label: "Expensed so far", value: inr(monthly * elapsed) },
      { label: "Still a prepaid asset", value: inr(totalCost - monthly * elapsed), note: "Cash left once; the expense arrives month by month." },
    ];
  },

  /** Advance collections earned only as delivery happens. */
  "deferred-revenue": ({ contractValue = 0, monthsTotal = 0, monthsDelivered = 0 }) => {
    const months = Math.max(monthsTotal, 1);
    const delivered = Math.min(Math.max(monthsDelivered, 0), months);
    const recognised = (contractValue / months) * delivered;
    return [
      { label: "Revenue earned so far", value: inr(recognised) },
      { label: "Still owed to the customer", value: inr(contractValue - recognised), note: "Cash in the bank, but a liability until the service is delivered." },
    ];
  },

  /** Revenue recognised when delivered, not when collected. */
  "accrual-timing": ({ workDelivered = 0, cashCollected = 0 }) => {
    const receivable = Math.max(workDelivered - cashCollected, 0);
    const deferred = Math.max(cashCollected - workDelivered, 0);
    return [
      { label: "Revenue recognised", value: inr(workDelivered), note: "Follows delivery, not payment." },
      { label: "Receivable created", value: inr(receivable) },
      { label: "Deferred revenue created", value: inr(deferred), note: deferred > 0 ? "Collected ahead of delivery — a liability until earned." : undefined },
    ];
  },

  /** Straight-line depreciation and the value still on the books. */
  "depreciation": ({ cost = 0, residual = 0, usefulLife = 0, yearsElapsed = 0 }) => {
    const life = Math.max(usefulLife, 1);
    const annual = (cost - residual) / life;
    const elapsed = Math.min(Math.max(yearsElapsed, 0), life);
    return [
      { label: "Annual charge", value: inr(annual) },
      { label: `Accumulated after ${elapsed} year(s)`, value: inr(annual * elapsed) },
      { label: "Net book value", value: inr(cost - annual * elapsed), note: "Original cost minus everything charged so far — not a market price." },
    ];
  },

  /** Opening + capex − depreciation, with a shrinking-base warning. */
  "ppe-rollforward": ({ opening = 0, capex = 0, depreciationCharge = 0 }) => {
    const closing = opening + capex - depreciationCharge;
    return [
      { label: "Closing PP&E", value: inr(closing) },
      { label: "Change in asset base", value: inr(closing - opening), note: closing < opening ? "Spending below depreciation — the asset base is being run down." : "The asset base grew this period." },
    ];
  },

  /** Purchase premium over identifiable net assets. */
  "goodwill": ({ purchasePrice = 0, assetsAcquired = 0, liabilitiesAcquired = 0 }) => {
    const identifiable = assetsAcquired - liabilitiesAcquired;
    return [
      { label: "Identifiable net assets", value: inr(identifiable) },
      { label: "Goodwill", value: inr(purchasePrice - identifiable), note: "The premium paid for expectations — reputation, relationships, synergies." },
    ];
  },

  /** Opening + profit − dividends. */
  "retained": ({ opening = 0, netProfit = 0, dividends = 0 }) => [
    { label: "Closing retained earnings", value: inr(opening + netProfit - dividends), note: "Accumulated profit kept in the business — not a cash balance." },
  ],
};

export function computeSandbox(kind: string, values: Record<string, number>): SandboxOutput[] {
  const fn = sandboxKinds[kind];
  return fn ? fn(values) : [];
}
