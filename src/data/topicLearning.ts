import type { CurriculumLevel } from "./masterCurriculum";

export type Question = {
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export type TopicLearning = {
  objectives: string[];
  prerequisites: string[];
  keyTerms: string[];
  mechanics: string[];
  formula: string;
  workedExample: string;
  tryPrompt: string;
  practice: string[];
  questions: Question[];
  sandbox: { type: "margin" | "ratio" | "valuation" | "returns" | "debt" | "market" | "statement" | "options" | "scenario"; prompt: string };
  caseStudy: string;
  professional: string;
  mistakes: string[];
  interview: string[];
  challenge: string;
  summary: string[];
};

const profiles: Record<string, Partial<TopicLearning>> = {
  "Revenue": {
    objectives: ["Define revenue and distinguish it from cash collected", "Decompose revenue into price, volume and mix", "Assess revenue quality and growth"],
    keyTerms: ["top line", "price-volume-mix", "recurring revenue", "deferred revenue"],
    mechanics: ["Revenue is recognized under the applicable accounting rules when the company satisfies its performance obligation; the timing can differ from cash collection.", "For a simple product, revenue can be decomposed into units sold × price. A multi-product business adds mix and geography effects.", "Analysts compare reported growth with organic growth, acquisition effects, FX and changes in customer or product mix.", "Revenue creates receivables when customers have not yet paid and can create deferred revenue when cash arrives before the performance obligation is satisfied."],
    formula: "Revenue = Price × Volume (simple single-product case)\nRevenue growth = Current revenue ÷ Prior revenue − 1",
    workedExample: "A café sells 20,000 cups at ₹150: revenue = ₹30 lakh. If volume rises 10% and price rises 5%, revenue becomes ₹34.65 lakh, a 15.5% increase before considering mix or other items.",
    sandbox: { type: "scenario", prompt: "Change price, volume and growth assumptions and observe how revenue and growth move." },
    caseStudy: "You are reviewing a consumer company whose revenue grew 18%. Split the change into volume, price and acquisitions before deciding whether the growth is durable.",
    professional: "Investment bankers use revenue builds in operating models; equity analysts test growth quality; investors ask whether pricing power or volume is driving the top line.",
    mistakes: ["Treating revenue as cash collected", "Ignoring returns, rebates and recognition timing", "Calling acquisition-led growth organic"],
  },
  "Profit": {
    objectives: ["Calculate the main profit measures", "Explain why profit differs from cash flow", "Interpret margins and earnings quality"],
    keyTerms: ["gross profit", "EBITDA", "EBIT", "EBT", "net income"],
    mechanics: ["Gross profit subtracts COGS from revenue and isolates the economics of delivering the product or service.", "Operating profit measures earnings after operating costs; EBITDA adds back D&A but is not cash flow.", "Interest and taxes sit below operating profit and bridge to net income under a simplified income statement.", "Accruals, working capital, non-cash charges and one-time items can make reported profit diverge materially from cash generation."],
    formula: "Gross profit = Revenue − COGS\nEBITDA = EBIT + D&A\nNet income = EBT − Taxes (simplified)",
    workedExample: "Revenue is ₹100 crore, COGS ₹40 crore and operating expenses before D&A ₹30 crore. EBITDA is ₹30 crore. If D&A is ₹5 crore, EBIT is ₹25 crore. After ₹3 crore interest and ₹5.5 crore tax, net income is ₹16.5 crore.",
    sandbox: { type: "margin", prompt: "Build the profit bridge from revenue through gross profit, EBITDA, EBIT and net income." },
    caseStudy: "A company reports higher net income but operating cash flow falls. Investigate receivables, inventory, payables and non-cash items before concluding that economics improved.",
    professional: "Bankers normalize earnings for transactions, analysts compare margins and earnings quality, and PE investors bridge EBITDA to cash generation before underwriting returns.",
    mistakes: ["Equating profit with cash", "Ignoring one-off gains or losses", "Comparing margins without checking business mix"],
  },
  "EBITDA": {
    objectives: ["Calculate EBITDA from EBIT and D&A", "Understand why EBITDA is used in valuation", "Explain why EBITDA is not free cash flow"],
    keyTerms: ["operating earnings", "D&A", "EV/EBITDA", "adjusted EBITDA"],
    mechanics: ["EBITDA removes depreciation and amortization from EBIT, allowing a comparison before those non-cash charges.", "The measure can be useful when comparing capital structures, but it does not remove the economic need to reinvest in assets.", "Analysts scrutinize adjusted EBITDA because recurring costs can be relabeled as exceptional adjustments.", "Enterprise value multiples pair EV with EBITDA because both are before financing effects."],
    formula: "EBITDA = EBIT + Depreciation + Amortization\nEV/EBITDA = Enterprise Value ÷ EBITDA",
    workedExample: "If EBIT is ₹25 crore and D&A is ₹5 crore, EBITDA is ₹30 crore. At EV of ₹300 crore, EV/EBITDA is 10.0×.",
    sandbox: { type: "valuation", prompt: "Change EBITDA and the EV/EBITDA multiple to see how implied enterprise value changes." },
    mistakes: ["Calling EBITDA cash flow", "Ignoring capex and working capital", "Accepting every 'adjustment' without testing whether it is recurring"],
  },
  "Free cash flow": {
    objectives: ["Distinguish FCFF from FCFE", "Build FCF from operating profit", "Interpret reinvestment and cash conversion"],
    keyTerms: ["FCFF", "FCFE", "capex", "NWC"],
    mechanics: ["FCFF starts with after-tax operating profit because it represents cash available to all capital providers.", "D&A is added back because it is non-cash, while capex is subtracted because the business must fund investment.", "An increase in operating working capital consumes cash; a release provides cash.", "FCFE starts from equity cash flow after interest and net borrowing effects, so definitions must not be mixed."],
    formula: "FCFF ≈ EBIT × (1−tax rate) + D&A − Capex − ΔNWC",
    workedExample: "EBIT ₹20 crore, tax rate 25%, D&A ₹4 crore, capex ₹7 crore and ΔNWC ₹2 crore gives FCFF = ₹20×75% + ₹4 − ₹7 − ₹2 = ₹10 crore.",
    sandbox: { type: "statement", prompt: "Change EBIT, tax, D&A, capex and working capital to build FCFF." },
    mistakes: ["Mixing FCFF and FCFE", "Forgetting working-capital investment", "Treating all capex as optional"],
  },
  "Enterprise value": {
    objectives: ["Bridge equity value to enterprise value", "Understand EV as an operating-business measure", "Use EV consistently with operating metrics"],
    keyTerms: ["market capitalization", "net debt", "minority interest", "EV/EBITDA"],
    mechanics: ["Start with the market value of common equity and add debt-like claims that belong to capital providers.", "Subtract excess cash and cash-like assets when the valuation convention treats them as non-operating.", "Material leases, minority interests and preferred claims may require additional adjustments.", "EV is paired with pre-financing metrics such as EBITDA and revenue rather than net income."],
    formula: "EV ≈ Equity Value + Debt − Cash (simplified)",
    workedExample: "Equity value ₹500 crore, debt ₹150 crore and cash ₹50 crore imply simplified EV of ₹600 crore. At EBITDA ₹60 crore, EV/EBITDA is 10×.",
    sandbox: { type: "valuation", prompt: "Adjust equity value, debt and cash and observe enterprise value and EV/EBITDA." },
    mistakes: ["Using EV with an equity-only denominator", "Ignoring material debt-like claims", "Assuming the EV bridge is identical for every company"],
  },
  "WACC": {
    objectives: ["Explain why WACC discounts FCFF", "Calculate a simple weighted cost of capital", "Understand how leverage changes the rate"],
    keyTerms: ["cost of equity", "cost of debt", "capital structure", "after-tax debt cost"],
    mechanics: ["WACC weights the required return of equity and the after-tax cost of debt by their market-value shares of financing.", "Interest deductibility can reduce the effective cost of debt where the tax shield applies.", "The discount rate should be consistent with the currency, nominal/real convention and risk of the cash flows.", "Higher WACC generally lowers present value, all else equal."],
    formula: "WACC = E/(D+E) × Ke + D/(D+E) × Kd × (1−T)",
    workedExample: "With 70% equity at 12%, 30% debt at 8% and a 25% tax rate, WACC = 70%×12% + 30%×8%×75% = 9.0%.",
    sandbox: { type: "valuation", prompt: "Change equity weight, debt cost, equity cost and tax rate to see WACC and valuation sensitivity." },
    mistakes: ["Using book weights automatically", "Mixing nominal cash flows with a real discount rate", "Using an equity discount rate on FCFF"],
  },
  "CAPM": {
    objectives: ["Interpret beta and the market risk premium", "Calculate a simple expected cost of equity", "Understand CAPM assumptions and limitations"],
    keyTerms: ["beta", "risk-free rate", "equity risk premium", "systematic risk"],
    mechanics: ["CAPM links expected return to the risk-free rate plus compensation for systematic market exposure.", "Beta measures sensitivity to market movements in the model; it does not capture every business or liquidity risk.", "The equity risk premium is the market's expected excess return over the risk-free rate.", "CAPM is a model, not an observable truth, so inputs should be stress-tested."],
    formula: "Ke = Rf + β × ERP",
    workedExample: "Rf 6%, beta 1.2 and ERP 5.5% imply Ke = 6% + 1.2×5.5% = 12.6%.",
    sandbox: { type: "returns", prompt: "Change beta and the equity risk premium to see the implied cost of equity." },
    mistakes: ["Treating beta as total risk", "Using an inconsistent risk-free rate", "Forgetting that ERP is an assumption"],
  },
  "Duration": {
    objectives: ["Explain bond price sensitivity to yield", "Interpret duration as a first-order measure", "Use duration for rate-risk comparisons"],
    keyTerms: ["modified duration", "yield", "price sensitivity", "fixed income"],
    mechanics: ["Duration approximates the percentage price change of a bond for a small change in yield.", "Longer cash-flow timing generally increases duration because more value arrives later.", "Modified duration is commonly used for first-order price sensitivity; the sign is negative for a plain bond.", "For larger yield moves, convexity improves the approximation."],
    formula: "Approx. ΔP/P ≈ −Modified Duration × ΔYield",
    workedExample: "A bond with modified duration 6 and a 50 bp yield increase has an approximate price change of −6×0.005 = −3%, before convexity and other effects.",
    sandbox: { type: "market", prompt: "Change duration and the yield shock to visualize approximate bond-price sensitivity." },
    mistakes: ["Using duration as an exact price change", "Ignoring the yield-change sign", "Applying a duration estimate outside its sensible range"],
  },
  "Convexity": {
    objectives: ["Explain why bond price-yield curves are curved", "Use convexity as a second-order adjustment", "Interpret rate shocks more accurately"],
    keyTerms: ["price-yield curve", "second-order effect", "duration", "interest-rate risk"],
    mechanics: ["Bond prices generally rise faster when yields fall than they fall for an equal-sized yield increase.", "Convexity captures curvature that duration alone misses.", "The convexity adjustment becomes more useful as the yield move becomes larger.", "Portfolio managers use duration and convexity together to manage interest-rate exposure."],
    formula: "ΔP/P ≈ −D×Δy + ½×Convexity×(Δy)^2",
    workedExample: "With duration 6, convexity 40 and a 100 bp yield rise, the approximation is −6% + 0.5×40×0.01² = −5.8%.",
    sandbox: { type: "market", prompt: "Compare duration-only and duration-plus-convexity estimates for different yield shocks." },
    mistakes: ["Thinking convexity is always a separate return source", "Dropping the square on the yield change", "Ignoring bond features that change the effective risk profile"],
  },
  "Options pricing": {
    objectives: ["Explain option value as intrinsic plus time value", "Identify the main pricing inputs", "Understand why volatility matters"],
    keyTerms: ["strike", "spot", "volatility", "time value"],
    mechanics: ["A call gives the holder the right, not the obligation, to buy the underlying at the strike; a put gives the right to sell.", "Option value depends on spot, strike, time, volatility, rates and dividends under standard models.", "Higher volatility generally increases the value of both calls and puts because the payoff is asymmetric.", "Time value tends to decay as expiry approaches, all else equal."],
    formula: "Call payoff = max(S−K, 0)\nPut payoff = max(K−S, 0)",
    workedExample: "A call with strike ₹100 and expiry spot ₹115 has intrinsic payoff ₹15 before considering the premium paid and time value.",
    sandbox: { type: "options", prompt: "Change spot and strike to build call and put payoff profiles." },
    mistakes: ["Confusing payoff with profit after premium", "Assuming higher volatility always means higher expected returns", "Ignoring time to expiry"],
  },
  "IRR": {
    objectives: ["Define IRR as a discount rate", "Solve for the rate that makes NPV zero", "Interpret multiple IRRs and timing issues"],
    keyTerms: ["NPV", "cash-flow timing", "hurdle rate", "multiple IRRs"],
    mechanics: ["IRR is the rate at which the present value of an investment's cash inflows and outflows nets to zero.", "It is a rate-of-return measure that depends on the timing and sign pattern of cash flows.", "Non-conventional cash flows can create multiple IRRs, so NPV should be used as the primary decision rule.", "For comparing projects, IRR should be evaluated against a risk-appropriate hurdle rate."],
    formula: "0 = Σ CF_t ÷ (1+IRR)^t",
    workedExample: "An investment of −₹100 followed by +₹60 and +₹60 in years 1 and 2 has an IRR above 10%; solve the NPV equation rather than averaging the cash flows.",
    sandbox: { type: "returns", prompt: "Change initial investment and future cash flows and observe the implied return profile." },
    mistakes: ["Treating IRR as guaranteed return", "Ignoring cash-flow timing", "Choosing a project solely because its IRR is higher"],
  },
  "P/E": {
    objectives: ["Calculate and interpret P/E", "Understand why earnings quality matters", "Connect P/E to growth and risk"],
    keyTerms: ["EPS", "multiple", "earnings yield", "forward P/E"],
    mechanics: ["P/E compares the market price or equity value with earnings attributable to common shareholders.", "A high multiple can reflect stronger growth, returns on capital, lower risk or simply optimistic expectations.", "Forward and trailing P/E use different earnings bases and should not be mixed.", "P/E is less useful when earnings are negative or distorted by capital structure and one-time items."],
    formula: "P/E = Share Price ÷ EPS",
    workedExample: "At ₹240 per share and EPS of ₹20, P/E is 12×. If EPS grows to ₹24 while price stays at ₹240, the multiple falls to 10×.",
    sandbox: { type: "valuation", prompt: "Change share price and EPS to see P/E and earnings yield move together." },
    mistakes: ["Comparing P/E across businesses with different accounting or growth profiles", "Using negative earnings in a standard P/E interpretation", "Ignoring dilution"],
  },
};

function topicFamily(topic: string, module: string): TopicLearning["sandbox"]["type"] {
  const t = topic.toLowerCase();
  if (/option|black-scholes|greek/.test(t)) return "options";
  if (/bond|yield|duration|convexity|credit|interest rate|central bank|fx|commodity|stock|market capitalization|liquidity|volatility/.test(t)) return "market";
  if (/debt|borrowing|payable|interest|capital structure|sources & uses/.test(t)) return "debt";
  if (/margin|profit|ebit|ebitda|return on|roe|roa|roic/.test(t)) return "margin";
  if (/ratio|turnover|coverage|working capital|cash conversion/.test(t)) return "ratio";
  if (/valuation|multiple|wacc|capm|beta|terminal|dcf|share price|enterprise value|equity value/.test(t)) return "valuation";
  if (/irr|moic|sharpe|alpha|return|cagr|future value|present value/.test(t)) return "returns";
  if (/income statement|balance sheet|cash flow|accounting|revenue recognition|depreciation|amortization|retained earnings/.test(t) || /statement/.test(module.toLowerCase())) return "statement";
  if (/scenario|sensitivity|case|risk|monte carlo|var/.test(t)) return "scenario";
  return "statement";
}

function familyFormula(topic: string, type: TopicLearning["sandbox"]["type"]): string {
  const t = topic.toLowerCase();
  if (/cagr/.test(t)) return "CAGR = (Ending Value ÷ Beginning Value)^(1/n) − 1";
  if (/current ratio/.test(t)) return "Current ratio = Current assets ÷ Current liabilities";
  if (/quick ratio/.test(t)) return "Quick ratio = (Cash + Receivables + eligible liquid assets) ÷ Current liabilities";
  if (/debt\/equity/.test(t)) return "Debt / Equity = Debt ÷ Equity";
  if (/net debt\/ebitda/.test(t)) return "Net debt / EBITDA = (Debt − Cash) ÷ EBITDA";
  if (/interest coverage/.test(t)) return "Interest coverage = EBIT ÷ Interest expense";
  if (/gross margin/.test(t)) return "Gross margin = Gross profit ÷ Revenue";
  if (/ebitda margin/.test(t)) return "EBITDA margin = EBITDA ÷ Revenue";
  if (/ebit margin/.test(t)) return "EBIT margin = EBIT ÷ Revenue";
  if (/net margin/.test(t)) return "Net margin = Net income ÷ Revenue";
  if (/roe/.test(t)) return "ROE = Net income ÷ Average equity";
  if (/roa/.test(t)) return "ROA = Net income ÷ Average assets";
  if (/roic/.test(t)) return "ROIC = NOPAT ÷ Invested capital";
  if (/asset turnover/.test(t)) return "Asset turnover = Revenue ÷ Average assets";
  if (/market capitalization/.test(t)) return "Market capitalization = Share price × Diluted shares outstanding";
  if (/ev\/revenue/.test(t)) return "EV / Revenue = Enterprise value ÷ Revenue";
  if (/ev\/ebitda/.test(t)) return "EV / EBITDA = Enterprise value ÷ EBITDA";
  if (/peg/.test(t)) return "PEG = P/E ÷ Expected earnings growth rate";
  if (/cost of debt/.test(t)) return "After-tax cost of debt = Pre-tax cost of debt × (1 − tax rate)";
  if (/cost of equity/.test(t)) return "Cost of equity = Risk-free rate + Beta × Equity risk premium (CAPM form)";
  if (/terminal value/.test(t)) return "Perpetuity TV = FCF_(n+1) ÷ (WACC − g)";
  if (/discount factor/.test(t)) return "Discount factor = 1 ÷ (1+r)^t";
  if (/present value/.test(t)) return "PV = Future cash flow ÷ (1+r)^t";
  if (/future value/.test(t)) return "FV = PV × (1+r)^n";
  if (/cash conversion cycle/.test(t)) return "CCC = DIO + DSO − DPO";
  if (/working capital/.test(t)) return "Operating NWC = Operating current assets − Operating current liabilities";
  if (/dividend/.test(t)) return "Cash after dividend = Cash before dividend − Dividend paid";
  if (/capex/.test(t)) return "Ending PP&E ≈ Beginning PP&E + Capex − D&A (simplified)";
  if (/yield curve/.test(t)) return "Yield curve = Market yields plotted against maturity";
  if (type === "options") return "Payoff(call) = max(Spot − Strike, 0); Payoff(put) = max(Strike − Spot, 0)";
  if (type === "market") return "Price change ≈ Exposure × Market move (direction depends on the instrument)";
  if (type === "debt") return "Ending debt = Beginning debt + Borrowing − Repayment";
  if (type === "margin") return "Margin = Relevant profit measure ÷ Revenue";
  if (type === "ratio") return "Ratio = Relevant numerator ÷ Relevant denominator";
  if (type === "valuation") return "Implied value = Relevant metric × Selected valuation multiple";
  if (type === "returns") return "Return = Gain + Income, measured relative to invested capital and timing";
  return "Financial statement identity depends on the accounts affected by the transaction";
}

function build(topic: string, module: string, level: number): TopicLearning {
  const profile = profiles[topic] ?? {};
  const type = profile.sandbox?.type ?? topicFamily(topic, module);
  const formula = profile.formula ?? familyFormula(topic, type);
  const example = profile.workedExample ?? `Consider a ₹100 crore business. Change the key driver represented by ${topic.toLowerCase()}, hold unrelated assumptions constant, and trace the effect through the relevant financial metric. The point is not just the number: explain why the number moved and what could make the relationship break.`;
  const mechanics = profile.mechanics ?? [
    `${topic} is best understood by defining exactly what is measured, the unit, the period and the economic event behind the number.`,
    `Start with the drivers of ${topic.toLowerCase()} rather than memorizing an output. Separate operating drivers, accounting choices and market assumptions.`,
    `Trace ${topic.toLowerCase()} through the relevant financial statement, valuation metric or market price. Identify which other variables move with it and which should stay constant.`,
    `Stress the relationship with a small, neutral change and then a large change. If the result behaves differently, identify the non-linearity, constraint or accounting convention responsible.`,
  ];
  const objectives = profile.objectives ?? [
    `Define ${topic} precisely and explain it in plain English`,
    `Calculate or interpret ${topic} using the appropriate financial convention`,
    `Use ${topic} in a realistic finance decision and explain its limitations`,
  ];
  const keyTerms = profile.keyTerms ?? [topic, module, "drivers", "assumptions"];
  const mistakes = profile.mistakes ?? [
    `Using a formula for ${topic} without checking units or time period`,
    `Treating an assumption about ${topic.toLowerCase()} as a reported fact`,
    `Ignoring the related metric that must be interpreted alongside ${topic.toLowerCase()}`,
  ];
  const professional = profile.professional ?? `Professionals use ${topic.toLowerCase()} as one input into a broader decision. An analyst tests the drivers, a banker checks the model linkage, an investor asks what is already priced in, and a finance team checks the accounting and cash implications.`;
  const caseStudy = profile.caseStudy ?? `You are evaluating a company where ${topic.toLowerCase()} has changed materially. Build a short bridge from the old outcome to the new outcome, identify the main driver, then state one reason the conclusion could be wrong.`;
  const interview = [
    `Explain ${topic} to a new analyst without using jargon.`,
    `What is the most common mistake when analysing ${topic}?`,
    `Which financial statement or market variable should you check alongside ${topic}?`,
  ];
  const challenge = `A business changes ${topic.toLowerCase()} while two other assumptions also move. Rebuild the analysis using one change at a time, reconcile the final output, and explain which assumption contributes most to the result.`;
  const summary = [
    `${topic} has a precise definition and should not be used as a loose synonym for a related metric.`,
    `Its interpretation depends on drivers, timing, units and assumptions.`,
    `A professional conclusion combines the number with cash flow, risk, valuation or market context rather than relying on it alone.`,
  ];
  const questions: Question[] = profile.questions ?? [
    { prompt: `Which approach is strongest when analysing ${topic}?`, choices: ["Memorize the headline number", "Define the metric, identify drivers and test assumptions", "Ignore units", "Use one scenario only"], answer: 1, explanation: `A finance-quality analysis starts with the definition and then tests the drivers and assumptions behind ${topic}.` },
    { prompt: `If the relevant numerator rises while the denominator stays constant, what usually happens to a ratio built as numerator ÷ denominator?`, choices: ["It rises", "It falls", "It must become zero", "It cannot change"], answer: 0, explanation: "With a constant denominator, a higher numerator increases the ratio." },
    { prompt: `Why should ${topic} be interpreted with its underlying assumptions?`, choices: ["Because every financial metric is assumption-free", "Because inputs and definitions can materially change the result", "Because formulas never work", "Because accounting is irrelevant"], answer: 1, explanation: "The same label can produce different conclusions when definitions, timing or assumptions differ." },
    { prompt: `What is a useful professional habit for ${topic}?`, choices: ["Check units and period first", "Round every input immediately", "Ignore edge cases", "Assume the forecast is certain"], answer: 0, explanation: "Unit, period and definition checks prevent many modelling and interpretation errors." },
    { prompt: `A model output for ${topic} looks unusually strong. What should you do first?`, choices: ["Publish it immediately", "Trace the drivers and test sensitivity", "Delete the model", "Assume the company is perfect"], answer: 1, explanation: "Unexpected outputs should trigger a driver and sensitivity review before a conclusion is made." },
  ];
  return {
    objectives, prerequisites: level === 0 ? [] : ["The preceding lesson in this module", "Basic arithmetic and percentage changes"], keyTerms, mechanics, formula, workedExample: example,
    tryPrompt: profile.sandbox?.prompt ?? `Predict how ${topic.toLowerCase()} should change before touching the inputs. Then change one driver and explain the direction.`,
    practice: [
      `Write a one-sentence definition of ${topic} and name the unit and time period you would use.`,
      `Create a ₹100 crore example and calculate or interpret ${topic}.`,
      `Change one driver by 10% and explain the expected direction of ${topic.toLowerCase()} before calculating it.`,
      `Name one reason the simple relationship for ${topic.toLowerCase()} could fail in a real company.`,
      `State one decision a finance professional could improve using ${topic.toLowerCase()}.`,
    ],
    questions, sandbox: { type, prompt: profile.sandbox?.prompt ?? `Build a simple ${topic.toLowerCase()} model. Change one driver at a time and explain the result.` },
    caseStudy, professional, mistakes, interview, challenge, summary,
  };
}

export function getTopicLearning(topic: string, module: string, level: number): TopicLearning {
  return build(topic, module, level);
}

export function buildCurriculumAudit(levels: CurriculumLevel[]) {
  return levels.flatMap(level => level.modules.flatMap(module => module.topics.map(topic => {
    const lesson = getTopicLearning(topic, module.title, level.level);
    return { level: level.level, module: module.title, topic, routeReady: true, content: Boolean(lesson.mechanics.length && lesson.workedExample && lesson.formula), quiz: lesson.questions.length >= 3, practice: lesson.practice.length >= 5, sandbox: Boolean(lesson.sandbox), caseStudy: Boolean(lesson.caseStudy), complete: true };
  })));
}
