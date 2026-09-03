/* Level 7 — Private Equity / LBO. 12 lessons.
   One buyout runs through the whole level: Meridian Packaging, ₹100 crore of
   EBITDA, bought at 8x and held five years. Each lesson advances the same deal. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  LS.lessons = LS.lessons || {};

  function h2(t) { return { t: "h2", text: t }; }
  function p(h) { return { t: "p", h: h }; }
  function list(i) { return { t: "list", items: i }; }
  function def(term, h) { return { t: "def", term: term, h: h }; }
  function note(i) { return { t: "note", h: "<ul>" + i.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" }; }
  function practice(i) { return { t: "practice", items: i }; }
  function sandbox(kind, title, prompt, fields) { return { t: "sandbox", kind: kind, title: title, prompt: prompt, fields: fields }; }
  function formula(title, lines) { return { t: "formula", title: title, lines: lines }; }
  function mcq(q, o, c, w) { return { t: "mcq", q: q, opts: o, correct: c, why: w }; }
  function fig(title, intro, rows, meaning) {
    var h = '<p class="case-title"><strong>' + title + "</strong></p>";
    intro.forEach(function (x) { h += "<p>" + x + "</p>"; });
    h += '<div class="case-figures">';
    rows.forEach(function (r) { h += '<div class="case-row"><span class="case-label">' + r[0] + '</span><span class="case-value">' + r[1] + "</span></div>"; });
    h += '</div><p class="case-meaning"><strong>What it means.</strong></p>';
    meaning.forEach(function (x) { h += "<p>" + x + "</p>"; });
    return { t: "example", h: h };
  }
  function L(id, title, lede, body) {
    LS.lessons[id] = { id: id, title: title, short: title, desc: lede, lede: lede, minutes: 7, body: body };
  }
  var W = "Not quite — re-read the explanation above.";

  /* ============ LBO CONSTRUCTION ============ */

  L("c-entry-valuation", "Entry valuation",
    "The price you pay sets the ceiling on everything you can earn.",
    [
      h2("What is this?"),
      p("Entry valuation is the enterprise value at which a sponsor buys the business, normally expressed as a multiple of current EBITDA. Buying at 8× ₹100 crore of EBITDA means an entry enterprise value of ₹800 crore."),
      h2("Why does it matter?"),
      p("It is the one variable in a buyout the sponsor fully controls, and it constrains every return that follows. Pay one turn more and, at the same exit, the entire return falls — often by a fifth or more."),
      p("This is why price discipline dominates private equity. Operational improvement is uncertain and slow; overpaying is immediate and permanent."),
      h2("How does it work?"),
      formula("Entry valuation", [
        "<b>Entry EV = Entry multiple × EBITDA at entry</b>",
        "<b>Sponsor equity = Entry EV − Debt raised + fees</b>",
        "The entry multiple comes from comps and precedent transactions",
      ]),
      fig("Real-Life Case Study: one turn of entry price",
        ["Meridian Packaging, ₹100 crore of EBITDA, exit assumed at 8× after five years."],
        [["Entry at 8.0x — EV", "₹800 crore"], ["Entry at 8.0x — sponsor equity", "₹280 crore"],
         ["Entry at 9.0x — EV", "₹900 crore"], ["Entry at 9.0x — sponsor equity", "₹380 crore"],
         ["Exit equity in both cases", "₹658 crore"], ["Multiple of money", "2.35x vs 1.73x"]],
        ["The same business, same operating plan, same exit — and the return falls from 2.35× to 1.73× because ₹100 crore more was paid at entry.",
         "In IRR terms that is roughly 18.7% against 11.6%. One turn of entry multiple can be the difference between a fund's best deal and one that barely beats a bond."]),
      h2("Key terms"),
      def("Entry multiple", "The EV/EBITDA at which the business is acquired."),
      def("Sponsor equity", "The cash the private equity fund contributes, after debt and fees."),
      h2("Practice"),
      practice([
        { q: "EBITDA ₹80 crore, entry multiple 7.5×, debt raised ₹420 crore, fees ₹20 crore. Compute entry EV and sponsor equity.", a: "Entry EV = 80 × 7.5 = ₹600 crore. Sponsor equity = 600 − 420 + 20 = ₹200 crore." },
        { q: "Why is entry price the most controllable driver of buyout returns?", a: "The sponsor decides it at the moment of purchase. Operating improvements depend on execution over years, and the exit multiple depends on market conditions at sale — neither is within their control the way the entry price is." },
      ]),
      h2("Connection"),
      p("Entry valuation sets the sponsor equity that MOIC and IRR are measured against."),
      mcq("Paying one extra turn of EBITDA at entry, with the exit unchanged:",
        ["Has no effect on returns", "Reduces the return, because more equity buys the same exit value", "Increases the return", "Only affects the lenders"], 1,
        [W, "Correct. The exit proceeds are fixed by the exit assumptions, so a larger entry equity cheque divides into the same result.", W, W]),
    ]);

  L("c-debt-financing", "Debt financing",
    "How much lenders will provide, in what layers, and at what cost.",
    [
      h2("What is this?"),
      p("Buyout debt is layered. <strong>Senior debt</strong> ranks first, is secured, and is cheapest. <strong>Subordinated or mezzanine debt</strong> ranks behind it, costs more, and is used to stretch the total leverage further."),
      h2("Why does it matter?"),
      p("Leverage is the engine of the return, so how much debt is available largely determines whether a deal is possible at all. Lenders cap it at a multiple of EBITDA they are comfortable the business can service."),
      p("More debt raises the return if things go well and destroys the equity if they do not. The equity is the first loss position — a business worth less than its debt at exit returns nothing to the sponsor."),
      h2("How does it work?"),
      list([
        "Lenders size total debt at a multiple of EBITDA — for a stable business, perhaps 4-5×.",
        "Senior debt takes the first, largest and cheapest layer, usually amortising.",
        "Mezzanine sits behind it at a higher rate, often with no amortisation.",
        "Test serviceability: interest coverage and free cash flow after interest must comfortably clear the covenants.",
      ]),
      fig("Real-Life Case Study: the capital structure",
        ["Meridian Packaging at an ₹800 crore entry EV, ₹100 crore of EBITDA."],
        [["Senior debt (3.2x EBITDA)", "₹320 crore at 9%"], ["Mezzanine (2.0x EBITDA)", "₹200 crore at 14%"],
         ["Total debt", "₹520 crore (5.2x)"], ["Sponsor equity", "₹280 crore"],
         ["Blended interest cost", "₹46.8 crore"], ["Interest coverage on EBIT ₹72 cr", "1.5x"]],
        ["Debt funds 65% of the purchase, and interest consumes ₹46.8 crore of a ₹100 crore EBITDA before any tax or capex.",
         "Coverage of 1.5× is thin by any standard outside private equity. It works only because the business is stable and cash-generative — the same structure on a cyclical company would breach in the first downturn."]),
      h2("Key terms"),
      def("Senior debt", "First-ranking secured debt, cheapest and usually amortising."),
      def("Mezzanine", "Subordinated debt ranking behind senior, at a higher rate."),
      def("Leverage multiple", "Total debt divided by EBITDA at entry."),
      h2("Practice"),
      practice([
        { q: "EBITDA ₹90 crore. Senior at 3.0× costs 9%; mezzanine at 1.5× costs 14%. Compute total debt and annual interest.", a: "Senior = ₹270 crore, mezzanine = ₹135 crore, total ₹405 crore (4.5×). Interest = 24.3 + 18.9 = ₹43.2 crore." },
        { q: "Why can a stable utility-like business carry more leverage than a cyclical manufacturer?", a: "Lenders size debt against the cash available to service it in a bad year. Stable cash flows mean the bad year is not much worse than the good one; a cyclical business can see EBITDA halve, so the same leverage would breach covenants and risk default." },
      ]),
      h2("Connection"),
      p("This debt is what the paydown lesson repays, and its size determines the sponsor equity in the sources and uses table."),
      sandbox("leverage-returns", "Leverage sandbox",
        "Raise debt and watch the owner return climb — then cut operating profit 40% and watch it collapse.", [
        { key: "operatingProfit", label: "Operating profit (EBIT)", value: 720000000, unit: "₹" },
        { key: "debt", label: "Total debt", value: 5200000000, unit: "₹" },
        { key: "interestRate", label: "Blended interest rate", value: 9, unit: "%" },
        { key: "equity", label: "Sponsor equity", value: 2800000000, unit: "₹" },
      ]),
      mcq("In a buyout, the sponsor's equity is:",
        ["Repaid before the lenders", "The first loss position — paid only after all debt", "Guaranteed by the lenders", "Interest-bearing"], 1,
        [W, "Correct. Equity absorbs losses first, which is why heavy leverage can produce a total loss even when the business survives.", W, W]),
    ]);

  L("c-sources-and-uses-lbo", "Sources & Uses",
    "The funding table for a buyout, and where the sponsor's cheque is actually determined.",
    [
      h2("What is this?"),
      p("As in any transaction, uses list what must be paid and sources list where the money comes from. In a buyout the sponsor's equity is the plug: whatever the debt and other sources do not cover."),
      h2("Why does it matter?"),
      p("The equity cheque is the denominator of every return calculation. Fees, refinancing and working capital top-ups all increase it, and each rupee added reduces the multiple of money on exit."),
      h2("How does it work?"),
      list([
        "<strong>Uses:</strong> purchase of equity, refinancing existing debt, transaction fees, financing fees.",
        "<strong>Sources:</strong> senior debt, mezzanine, management rollover, and sponsor equity as the balancing figure.",
        "Compute sponsor equity last: total uses less all other sources.",
      ]),
      fig("Real-Life Case Study: the Meridian funding table",
        ["An ₹800 crore enterprise value, with the seller's debt refinanced."],
        [["Use — purchase of equity", "₹560 crore"], ["Use — refinance existing debt", "₹240 crore"],
         ["Use — transaction and financing fees", "₹40 crore"], ["Total uses", "₹840 crore"],
         ["Source — senior debt", "₹320 crore"], ["Source — mezzanine", "₹200 crore"],
         ["Source — management rollover", "₹40 crore"], ["Source — sponsor equity", "₹280 crore"]],
        ["The sponsor writes a ₹280 crore cheque — everything the ₹560 crore of other sources does not cover.",
         "The ₹40 crore of fees increased that cheque by ₹40 crore and bought no earning assets. On a 2.35× outcome, those fees cost the fund roughly ₹94 crore of exit proceeds."]),
      h2("Key terms"),
      def("Plug", "The balancing figure — in a buyout, the sponsor's equity."),
      def("Management rollover", "Existing managers reinvesting their sale proceeds, aligning them with the sponsor."),
      h2("Practice"),
      practice([
        { q: "Uses: equity ₹450 crore, refinancing ₹180 crore, fees ₹30 crore. Sources: senior ₹300 crore, mezzanine ₹120 crore, rollover ₹25 crore. Compute sponsor equity.", a: "Total uses = ₹660 crore. Other sources = ₹445 crore. Sponsor equity = ₹215 crore." },
        { q: "Why do sponsors want management to roll over equity rather than cash out entirely?", a: "Alignment. Managers with their own money in the deal experience the same outcome as the fund, which matters greatly when the sponsor depends on them to run the business day to day for five years." },
      ]),
      h2("Connection"),
      p("The sponsor equity computed here is the entry cheque that MOIC and IRR measure the exit against."),
      mcq("In an LBO sources and uses table, sponsor equity is:",
        ["Fixed before the analysis", "The balancing figure after all other sources", "Equal to the fees", "Provided by lenders"], 1,
        [W, "Correct. Debt capacity and other sources are determined first; the fund contributes whatever remains.", W, W]),
    ]);

  L("c-operating-case", "Operating case",
    "The five-year plan for the business — and the cash it must produce.",
    [
      h2("What is this?"),
      p("The operating case is the forecast of the acquired business over the holding period: revenue, margins, working capital and capex, producing the free cash flow available to repay debt."),
      h2("Why does it matter?"),
      p("In a buyout, cash flow is not just a result — it is the mechanism of the return. Every rupee of free cash repays debt, which transfers value from lenders to the sponsor's equity."),
      p("That makes cash conversion more important than growth. A business growing 15% while consuming all its cash in working capital repays no debt and produces a poor buyout return."),
      h2("How does it work?"),
      list([
        "Forecast revenue and margin conservatively — lenders and investment committees discount hockey sticks.",
        "Model working capital in days, as in Level 4; growth consumes cash.",
        "Subtract capex, split into maintenance and growth.",
        "The result, after interest and tax, is cash available for debt repayment.",
      ]),
      fig("Real-Life Case Study: Meridian's five-year case",
        ["Modest growth, small margin improvement, disciplined working capital."],
        [["EBITDA year 1", "₹100 crore"], ["EBITDA year 5", "₹116 crore"], ["Average annual capex", "₹22 crore"],
         ["Average annual interest", "₹42 crore"], ["Average annual tax", "₹8 crore"],
         ["Average cash for debt repayment", "₹50 crore"], ["Total debt repaid over 5 years", "₹250 crore"]],
        ["The plan assumes only 3% annual EBITDA growth, and still repays half the debt from operating cash.",
         "That is the shape of a good buyout case: unspectacular operations, relentless cash conversion. A plan promising 15% growth would look better and be far less likely to survive an investment committee."]),
      h2("Key terms"),
      def("Operating case", "The base-case forecast for the business over the holding period."),
      def("Cash available for debt service", "Free cash flow after interest, tax and capex — what repays principal."),
      h2("Practice"),
      practice([
        { q: "EBITDA ₹100 crore, capex ₹22 crore, interest ₹42 crore, tax ₹8 crore, working capital increase ₹6 crore. Compute cash available to repay debt.", a: "100 − 22 − 42 − 8 − 6 = ₹22 crore in that year." },
        { q: "Why do sponsors prefer stable cash conversion over rapid growth?", a: "Growth consumes working capital and capex, reducing the cash available to repay debt. Since debt paydown drives the return, a slower-growing business that converts EBITDA to cash efficiently often produces a better outcome than a faster-growing one that does not." },
      ]),
      h2("Connection"),
      p("The cash this case produces is exactly what the debt paydown lesson applies to the loan balances."),
      sandbox("profit-to-cash", "Cash conversion sandbox",
        "Raise the working capital increase and watch the cash available for debt repayment disappear.", [
        { key: "profit", label: "Profit after interest and tax", value: 500000000, unit: "₹" },
        { key: "receivablesIncrease", label: "Increase in receivables", value: 40000000, unit: "₹" },
        { key: "inventoryIncrease", label: "Increase in inventory", value: 20000000, unit: "₹" },
        { key: "payablesIncrease", label: "Increase in payables", value: 10000000, unit: "₹" },
      ]),
      mcq("In an LBO, free cash flow matters most because it:",
        ["Increases EBITDA", "Repays debt, transferring value from lenders to the sponsor's equity", "Raises the exit multiple", "Reduces the entry price"], 1,
        [W, "Correct. Debt paydown is the primary return engine, and only cash — not profit — repays debt.", W, W]),
    ]);

  L("c-debt-paydown", "Debt paydown",
    "Every rupee of debt repaid is a rupee added to the sponsor's equity.",
    [
      h2("What is this?"),
      p("Debt paydown is the reduction of acquisition debt using the company's own free cash flow over the holding period. It is the most reliable of the three return drivers in a buyout."),
      h2("Why does it matter?"),
      p("At exit, the sponsor receives enterprise value less remaining debt. If enterprise value does not change at all, but debt has fallen ₹250 crore, the equity is worth ₹250 crore more. The business created that value in cash and it accrued entirely to the owner."),
      h2("How does it work?"),
      formula("The paydown mechanic", [
        "<b>Cash sweep = Free cash flow after interest, tax and capex</b>",
        "<b>Closing debt = Opening debt − Repayment</b>",
        "<b>Exit equity = Exit EV − Debt at exit</b>",
      ]),
      p("Most buyout facilities include a <strong>cash sweep</strong>: surplus cash must be used to repay debt rather than accumulate or be distributed. Lenders require it, and it happens to be exactly what maximises the sponsor's return."),
      fig("Real-Life Case Study: five years of deleveraging",
        ["Meridian's debt balance and leverage over the hold."],
        [["Entry debt", "₹520 crore (5.2x)"], ["End year 1", "₹478 crore (4.6x)"], ["End year 2", "₹428 crore (4.1x)"],
         ["End year 3", "₹370 crore (3.4x)"], ["End year 4", "₹318 crore (2.8x)"], ["End year 5", "₹270 crore (2.3x)"],
         ["Total repaid", "₹250 crore"]],
        ["Leverage more than halves without a single rupee of new equity — the business repaid it.",
         "At exit that ₹250 crore is straight equity value. If the exit multiple is unchanged, this alone takes the sponsor from ₹280 crore to over ₹530 crore before any growth in EBITDA is counted."]),
      h2("Key terms"),
      def("Cash sweep", "A requirement to apply surplus cash to debt repayment."),
      def("Deleveraging", "The fall in debt relative to EBITDA over the holding period."),
      h2("Practice"),
      practice([
        { q: "Entry debt ₹520 crore, ₹250 crore repaid over the hold, exit EV ₹928 crore. Compute exit equity and compare with a no-paydown case.", a: "Debt at exit = ₹270 crore. Exit equity = 928 − 270 = ₹658 crore. With no paydown: 928 − 520 = ₹408 crore. The paydown added ₹250 crore of equity value." },
        { q: "Why do lenders insist on a cash sweep?", a: "It reduces their exposure fastest, lowering default risk. It also happens to maximise the sponsor's equity value, which is why this is one of the few genuinely aligned terms in a buyout structure." },
      ]),
      h2("Connection"),
      p("The debt remaining at exit is subtracted from exit enterprise value to produce the sponsor's proceeds."),
      mcq("If enterprise value at exit equals entry EV but debt has fallen ₹200 crore, the sponsor's equity:",
        ["Is unchanged", "Is ₹200 crore higher", "Is ₹200 crore lower", "Depends on the tax rate"], 1,
        [W, "Correct. Equity is EV less debt, so repaying debt with the company's cash transfers that value directly to the owner.", W, W]),
    ]);

  L("c-exit-valuation", "Exit valuation",
    "What the business is worth when the sponsor sells — and how much of it is luck.",
    [
      h2("What is this?"),
      p("Exit valuation is the enterprise value achieved on sale, normally exit multiple times EBITDA at exit. The sponsor receives that value less whatever debt remains."),
      h2("Why does it matter?"),
      p("It completes the return calculation, and it is the driver the sponsor controls least. EBITDA at exit reflects five years of work; the multiple reflects market conditions on the day, which nobody controls."),
      p("This is why disciplined funds underwrite deals assuming <strong>no multiple expansion</strong> — exit at the entry multiple. Any uplift is treated as upside, not as part of the case."),
      h2("How does it work?"),
      formula("Exit valuation", [
        "<b>Exit EV = Exit multiple × EBITDA at exit</b>",
        "<b>Exit equity = Exit EV − Debt at exit</b>",
        "Routes: sale to a strategic buyer, to another fund, or an IPO",
      ]),
      fig("Real-Life Case Study: three exit scenarios",
        ["Meridian at exit: EBITDA ₹116 crore, debt ₹270 crore, entry multiple was 8.0×."],
        [["Exit at 7.0x — EV", "₹812 crore"], ["Exit at 7.0x — equity", "₹542 crore"],
         ["Exit at 8.0x — EV", "₹928 crore"], ["Exit at 8.0x — equity", "₹658 crore"],
         ["Exit at 9.0x — EV", "₹1,044 crore"], ["Exit at 9.0x — equity", "₹774 crore"]],
        ["One turn of exit multiple moves the sponsor's proceeds by ₹116 crore — over 40% of the original equity cheque.",
         "The deal returns 1.94×, 2.35× or 2.76× depending on a market condition five years away. Underwriting at the entry multiple keeps the case honest; assuming expansion is how funds talk themselves into overpaying."]),
      h2("Key terms"),
      def("Multiple expansion", "Exiting at a higher multiple than entry — upside, not a plan."),
      def("Exit routes", "Sale to a strategic buyer, a secondary sale to another fund, or an IPO."),
      h2("Practice"),
      practice([
        { q: "EBITDA at exit ₹120 crore, exit multiple 7.5×, debt at exit ₹240 crore. Compute exit EV and equity.", a: "Exit EV = 120 × 7.5 = ₹900 crore. Exit equity = 900 − 240 = ₹660 crore." },
        { q: "Why do disciplined sponsors underwrite at the entry multiple rather than a higher exit multiple?", a: "The exit multiple depends on market conditions years away that nobody can forecast. Building expansion into the base case makes almost any price look defensible, which is how funds justify overpaying at entry." },
      ]),
      h2("Connection"),
      p("Exit equity divided by entry equity is the MOIC computed in the next module."),
      mcq("Assuming multiple expansion in a buyout base case is dangerous because:",
        ["It is illegal", "It depends on market conditions years away that nobody controls", "It reduces leverage", "Lenders forbid it"], 1,
        [W, "Correct. It lets a fund justify a higher entry price using an assumption it cannot influence or predict.", W, W]),
    ]);

  L("c-exit-multiple-lbo", "Exit multiple",
    "The assumption that quietly decides whether a buyout worked.",
    [
      h2("What is this?"),
      p("The exit multiple is the EV/EBITDA at which the sponsor assumes the business is sold. Together with EBITDA at exit, it determines the enterprise value the return is calculated from."),
      h2("Why does it matter?"),
      p("Because it multiplies a large number, it moves returns more than any operating assumption. A model can show a 22% IRR or a 12% IRR on identical operations depending purely on whether the exit multiple is 9× or 7×."),
      h2("How does it work?"),
      list([
        "Base case: exit at the entry multiple. Neutral, defensible, and the standard.",
        "Downside: exit one to two turns below entry, reflecting a weaker market.",
        "Upside: exit above entry only where there is a concrete reason — a larger, more diversified or faster-growing business than the one bought.",
        "Always present returns across a multiple range rather than at a point.",
      ]),
      fig("Real-Life Case Study: returns across exit multiples",
        ["Meridian: ₹280 crore entry equity, ₹116 crore exit EBITDA, ₹270 crore debt at exit, five-year hold."],
        [["Exit 6.5x — MOIC", "1.52x (8.7% IRR)"], ["Exit 7.0x — MOIC", "1.94x (14.2% IRR)"],
         ["Exit 8.0x — MOIC", "2.35x (18.7% IRR)"], ["Exit 9.0x — MOIC", "2.76x (22.5% IRR)"],
         ["Typical fund target", "20%+ IRR"]],
        ["The deal clears a 20% IRR hurdle only if it exits above the multiple it was bought at.",
         "Presented as a single 22.5% IRR at a 9× exit, this looks like a strong deal. Presented across the range, it is a deal that needs the market's help — a materially different proposition."]),
      h2("Key terms"),
      def("Entry-equals-exit", "The convention of assuming no multiple change, isolating operational and paydown returns."),
      h2("Practice"),
      practice([
        { q: "Entry equity ₹200 crore. Exit EBITDA ₹90 crore, debt at exit ₹180 crore. Compute MOIC at 7× and at 9×.", a: "At 7×: EV ₹630 crore, equity ₹450 crore, MOIC 2.25×. At 9×: EV ₹810 crore, equity ₹630 crore, MOIC 3.15×." },
        { q: "A deal only clears the fund's hurdle if it exits above its entry multiple. What does that tell the investment committee?", a: "That the return depends on market conditions rather than on anything the fund can do. The operational plan and paydown alone do not deliver the target return, so the case rests on an assumption outside their control — usually a reason to decline or to bid less." },
      ]),
      h2("Connection"),
      p("This assumption is the main axis of the LBO sensitivity analysis that closes this level."),
      mcq("A buyout that only meets its return target with multiple expansion is:",
        ["A strong deal", "Dependent on market conditions the sponsor cannot control", "Risk-free", "Guaranteed to work"], 1,
        [W, "Correct. The operational plan and debt paydown alone do not deliver the target, so the case rests on the market being kind years later.", W, W]),
    ]);

  L("c-sponsor-equity", "Sponsor equity",
    "The fund's own cheque — the last money in and the first money at risk.",
    [
      h2("What is this?"),
      p("Sponsor equity is the cash the private equity fund contributes to the buyout: total uses less debt, rollover and any other sources. It is the denominator of every return the fund reports."),
      h2("Why does it matter?"),
      p("It ranks behind every lender. If the business is worth less than its debt at exit, the equity is worth nothing — not reduced, nothing. That asymmetry is why sponsors care so much about downside cases."),
      p("It is also why fee discipline matters. Fees increase the cheque without buying assets, so they reduce the multiple of money directly."),
      h2("How does it work?"),
      formula("Sponsor equity and its return", [
        "<b>Sponsor equity = Total uses − Debt − Rollover − Other sources</b>",
        "<b>MOIC = Exit equity proceeds ÷ Sponsor equity</b>",
        "Equity is the residual claim at exit, after all debt is repaid",
      ]),
      fig("Real-Life Case Study: where the equity ends up",
        ["Meridian: ₹280 crore in, five years, exit at 8×."],
        [["Sponsor equity at entry", "₹280 crore"], ["Exit enterprise value", "₹928 crore"],
         ["Less: debt at exit", "−₹270 crore"], ["Exit equity proceeds", "₹658 crore"],
         ["Multiple of money", "2.35x"], ["If exit EV fell to ₹300 crore", "₹30 crore — a 0.11x"]],
        ["The upside case returns 2.35×; a bad outcome where enterprise value falls below ₹270 crore returns nothing at all.",
         "That is the shape of a levered equity position: capped effort, uncapped downside to zero. Funds manage it through diversification across many deals, which an individual co-investor in one deal does not have."]),
      h2("Key terms"),
      def("Sponsor equity", "The fund's cash contribution, ranking behind all debt."),
      def("First loss position", "The claim that absorbs losses before any other — equity in a buyout."),
      h2("Practice"),
      practice([
        { q: "Exit EV ₹700 crore, debt at exit ₹300 crore, sponsor equity at entry ₹250 crore. Compute proceeds and MOIC.", a: "Proceeds = 700 − 300 = ₹400 crore. MOIC = 400 ÷ 250 = 1.6×." },
        { q: "At what exit enterprise value does the sponsor lose everything, if debt at exit is ₹270 crore?", a: "At or below ₹270 crore. Lenders are repaid first, so anything at or under the debt balance leaves nothing for equity — the fund's entire ₹280 crore is gone while the business itself continues operating." },
      ]),
      h2("Connection"),
      p("This is the entry figure that MOIC and IRR, in the next two lessons, measure the exit against."),
      mcq("Sponsor equity in a buyout is:",
        ["Senior to the debt", "The first loss position, paid only after all debt", "Guaranteed a minimum return", "Provided by management"], 1,
        [W, "Correct. Equity absorbs losses first, which is why an over-levered deal can wipe it out entirely while the business survives.", W, W]),
    ]);

  /* ============ SPONSOR RETURNS ============ */

  L("c-moic", "MOIC",
    "How many times the money came back — the simplest measure of a buyout.",
    [
      h2("What is this?"),
      p("MOIC — multiple of invested capital, also called multiple of money or cash-on-cash — is exit proceeds divided by the equity invested. Turning ₹280 crore into ₹658 crore is a 2.35× MOIC."),
      h2("Why does it matter?"),
      p("It is intuitive and cannot be manipulated by timing. Investors understand 'we returned 2.4 times your money' immediately."),
      p("Its blind spot is time. A 2.0× over three years and a 2.0× over nine years are the same MOIC and completely different investments — which is exactly what IRR exists to capture."),
      h2("How does it work?"),
      formula("Multiple of invested capital", [
        "<b>MOIC = Total exit proceeds ÷ Total equity invested</b>",
        "Include any interim dividends in proceeds",
        "MOIC ignores how long the money was invested",
      ]),
      fig("Real-Life Case Study: MOIC decomposed",
        ["Meridian, ₹280 crore in and ₹658 crore out. Where did the ₹378 crore of gain come from?"],
        [["Debt paydown", "₹250 crore"], ["EBITDA growth (₹16 cr at 8x)", "₹128 crore"],
         ["Multiple expansion", "₹0"], ["Total gain", "₹378 crore"],
         ["MOIC", "2.35x"], ["Share from paydown", "66%"]],
        ["Two-thirds of the return came from repaying debt with the company's own cash, not from improving the business.",
         "That decomposition is worth doing on every deal. A return built on paydown is repeatable; one built on multiple expansion was largely a market gift."]),
      h2("Key terms"),
      def("MOIC", "Exit proceeds divided by equity invested."),
      def("Return decomposition", "Splitting the gain into paydown, earnings growth and multiple change."),
      h2("Practice"),
      practice([
        { q: "₹200 crore invested, ₹520 crore returned, plus a ₹30 crore dividend during the hold. Compute MOIC.", a: "Total proceeds = 520 + 30 = ₹550 crore. MOIC = 550 ÷ 200 = 2.75×." },
        { q: "Two deals both return 2.0×, one over three years and one over eight. Why does MOIC alone mislead here?", a: "It ignores time entirely. The three-year deal compounds at about 26% a year and the eight-year one at about 9%. The fund can reinvest the first deal's proceeds twice more in the time the second is still running." },
      ]),
      h2("Connection"),
      p("IRR next adds the time dimension MOIC deliberately omits."),
      mcq("MOIC's main limitation is that it ignores:",
        ["Debt", "How long the capital was invested", "Fees", "Exit multiples"], 1,
        [W, "Correct. The same multiple over three years and over nine years represents very different annual compounding.", W, W]),
    ]);

  L("c-irr", "IRR",
    "The annual compound rate the investment actually earned.",
    [
      h2("What is this?"),
      p("Internal rate of return is the annual compounding rate that turns the money invested into the money returned over the actual holding period. A 2.35× over five years is roughly an 18.7% IRR."),
      h2("Why does it matter?"),
      p("It makes investments of different lengths comparable, and it is the number funds are judged and paid on — carried interest usually depends on clearing a hurdle IRR."),
      p("That creates a real incentive worth understanding: because IRR rewards speed, an early exit or an early dividend raises it substantially even when the total money returned is smaller."),
      h2("How does it work?"),
      formula("IRR for a single entry and exit", [
        "<b>IRR = (MOIC)^(1 ÷ years) − 1</b>",
        "Example: 2.35^(1/5) − 1 = 18.7%",
        "With interim cash flows, IRR is solved numerically rather than by formula",
      ]),
      fig("Real-Life Case Study: time changes everything",
        ["The same 2.35× MOIC, achieved over different holding periods."],
        [["Exit after 3 years", "IRR 33.0%"], ["Exit after 4 years", "IRR 23.8%"], ["Exit after 5 years", "IRR 18.7%"],
         ["Exit after 7 years", "IRR 12.9%"], ["Fund hurdle", "8%"], ["Typical target", "20-25%"]],
        ["Identical money returned, and the IRR ranges from 33% to 12.9% purely on timing.",
         "This is why sponsors push for early exits and early dividend recapitalisations. It is also why sophisticated investors look at MOIC and IRR together — one can be flattered by timing, the other by patience."]),
      h2("Key terms"),
      def("IRR", "The annual compound rate of return over the actual holding period."),
      def("Hurdle rate", "The IRR a fund must clear before it earns carried interest."),
      def("Dividend recapitalisation", "Borrowing to pay the sponsor a dividend mid-hold, raising IRR by returning cash sooner."),
      h2("Practice"),
      practice([
        { q: "MOIC 2.0× over four years. Compute the IRR.", a: "2.0^(1/4) − 1 = 1.189 − 1 = 18.9%." },
        { q: "A sponsor can exit now at 2.1× after three years, or hold two more years for 2.8×. Compare the IRRs and say what else matters.", a: "Now: 2.1^(1/3) − 1 = 28.0%. Later: 2.8^(1/5) − 1 = 22.8%. The early exit gives the higher IRR despite less total money. What else matters: whether the fund can redeploy the proceeds at a similar rate, and the risk carried over the two extra years." },
      ]),
      h2("Connection"),
      p("IRR and MOIC together are what the LBO sensitivity analysis reports across entry and exit assumptions."),
      sandbox("future-value", "IRR sandbox",
        "Set the invested amount and a rate, and vary the years to see how compounding turns a rate into a multiple.", [
        { key: "principal", label: "Equity invested", value: 2800000000, unit: "₹" },
        { key: "rate", label: "Annual return (IRR)", value: 18.7, unit: "%" },
        { key: "years", label: "Holding period", value: 5 },
      ]),
      mcq("Why do sponsors favour early exits and dividend recapitalisations?",
        ["They reduce risk to zero", "Returning cash sooner raises IRR even if total proceeds are lower", "Lenders require them", "They increase MOIC"], 1,
        [W, "Correct. IRR is time-weighted, so earlier cash compounds at a higher implied rate — which is why MOIC should always be read alongside it.", W, W]),
    ]);

  L("c-management-options", "Management options",
    "The slice of equity that aligns the people running the business with the fund.",
    [
      h2("What is this?"),
      p("A management option pool — typically 8-12% of equity — is set aside for the executives running the acquired company. Options usually vest over the holding period and pay out only above a performance threshold."),
      h2("Why does it matter?"),
      p("The sponsor does not run the business day to day; management does. Options give them a direct financial stake in the exit outcome, which is the most effective alignment mechanism available."),
      p("They also dilute the fund. A 10% pool means the sponsor receives 90% of the equity gain, which must be modelled — funds that ignore it overstate their own returns."),
      h2("How does it work?"),
      list([
        "Pool sized as a percentage of fully diluted equity, often 8-12%.",
        "Vesting over the hold, so managers who leave early forfeit unvested options.",
        "A strike or hurdle: options pay only above a threshold, so management earn only if the sponsor does.",
        "Modelled as dilution to sponsor proceeds at exit.",
      ]),
      fig("Real-Life Case Study: the effect on the fund's return",
        ["Meridian exits with ₹658 crore of equity value and a 10% management pool above a 1.5× hurdle."],
        [["Exit equity value", "₹658 crore"], ["Sponsor entry equity", "₹280 crore"],
         ["Value above the 1.5x hurdle", "₹238 crore"], ["Management share (10%)", "₹23.8 crore"],
         ["Sponsor proceeds", "₹634.2 crore"], ["MOIC before / after options", "2.35x / 2.27x"]],
        ["The pool costs the fund about 0.08× of MOIC, or roughly 1 percentage point of IRR.",
         "That is a modest price for having the operators financially committed to the same outcome. It becomes expensive only if the pool is large or the hurdle is set so low that management earn well from a mediocre result."]),
      h2("Key terms"),
      def("Option pool", "Equity reserved for management, diluting the sponsor at exit."),
      def("Vesting", "The schedule over which options are earned, tying management to the hold."),
      def("Hurdle", "The return level above which management options pay out."),
      h2("Practice"),
      practice([
        { q: "Exit equity ₹500 crore, entry equity ₹200 crore, 10% pool above a 1.5× hurdle. Compute management's share and sponsor MOIC after options.", a: "Hurdle value = 1.5 × 200 = ₹300 crore. Value above hurdle = ₹200 crore. Management take 10% = ₹20 crore. Sponsor gets ₹480 crore, MOIC = 2.40× against 2.50× before options." },
        { q: "Why set a hurdle rather than granting a flat percentage of equity?", a: "A flat percentage pays management even in a mediocre outcome, including one where the fund barely returns its capital. A hurdle means they participate only in value created above a threshold, aligning them with the fund's own definition of success." },
      ]),
      h2("Connection"),
      p("Option dilution reduces the sponsor proceeds used in MOIC and IRR, and appears in the returns sensitivity table."),
      mcq("A management option pool with a hurdle means executives earn:",
        ["Regardless of outcome", "Only on value created above a set return threshold", "Before the lenders", "A fixed salary bonus"], 1,
        [W, "Correct. The hurdle ensures management participate only when the sponsor has achieved a minimum return.", W, W]),
    ]);

  L("c-sensitivity-analysis-lbo", "Sensitivity analysis",
    "Show the return across entry and exit assumptions, not at a single flattering point.",
    [
      h2("What is this?"),
      p("LBO sensitivity analysis tabulates MOIC and IRR across ranges of the assumptions that drive them — usually entry multiple against exit multiple, and sometimes leverage or EBITDA growth."),
      h2("Why does it matter?"),
      p("A single headline IRR is nearly meaningless in a buyout, because two assumptions the sponsor cannot fully control move it enormously. The grid shows whether the deal works across plausible worlds or only in one corner."),
      p("It is also the honest way to present a deal to an investment committee: here is the range, here is the downside, here is what has to be true."),
      h2("How does it work?"),
      list([
        "Entry multiple down the side, exit multiple across the top — the two dominant drivers.",
        "Fill with IRR, and a second grid with MOIC.",
        "Mark the fund's hurdle so it is obvious which cells clear it.",
        "Run a downside operating case as well: EBITDA flat or falling, not just multiple changes.",
      ]),
      fig("Real-Life Case Study: the returns grid",
        ["Meridian: IRR across entry and exit multiples, five-year hold. Fund hurdle 20%."],
        [["Entry 7.5x / Exit 7.0x", "17.9%"], ["Entry 7.5x / Exit 8.0x", "22.3%"], ["Entry 7.5x / Exit 9.0x", "26.1%"],
         ["Entry 8.0x / Exit 7.0x", "14.2%"], ["Entry 8.0x / Exit 8.0x", "18.7%"], ["Entry 8.0x / Exit 9.0x", "22.5%"],
         ["Cells clearing 20%", "3 of 6"]],
        ["At an 8.0× entry, the deal clears the hurdle only if it exits at 9.0× — above what was paid.",
         "At 7.5× entry it clears at a flat exit multiple. That single observation is the whole negotiation: the difference between a deal that needs the market's help and one that does not is half a turn of entry price."]),
      h2("Key terms"),
      def("Returns grid", "A table of MOIC or IRR across entry and exit assumptions."),
      def("Downside case", "An operating scenario with flat or falling EBITDA, testing survival rather than upside."),
      h2("Practice"),
      practice([
        { q: "A grid shows the deal clearing a 20% hurdle only at exit multiples above entry. What should the committee conclude?", a: "That the price is too high. The operating plan and debt paydown alone do not deliver the target return, so the case depends on multiple expansion the fund cannot control. The response is to bid less, not to assume a friendlier market." },
        { q: "Why run a downside operating case as well as a multiple sensitivity?", a: "Multiple sensitivity tests the return; the downside operating case tests survival. Flat or falling EBITDA against fixed interest is what breaches covenants and wipes out equity — a risk no exit-multiple grid reveals." },
      ]),
      h2("Connection"),
      p("This closes the LBO: entry price, financing, operating case, paydown and exit, all expressed as a range of outcomes rather than one number."),
      mcq("The two axes of a standard LBO returns grid are:",
        ["Revenue and costs", "Entry multiple and exit multiple", "Tax rate and interest rate", "Headcount and capex"], 1,
        [W, "Correct. They dominate the return, and one of them is entirely outside the sponsor's control at exit.", W, W]),
    ]);
})();
