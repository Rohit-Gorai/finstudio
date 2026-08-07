/* End-of-module quizzes: five questions each, scored out of five,
   with the same teaching explanations the lessons use. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  var C = LS.C, R = LS.fmt.inr;

  LS.quizzes = {
    "1000": {
      title: "Foundations",
      questions: [
        { q: "A café buys a coffee grinder for cash. Which two things change?", opts: ["An asset rises and an asset falls", "An asset rises and a liability rises", "An expense rises and equity rises", "Nothing changes until it's used"], correct: 0, why: ["Cash (an asset) becomes a grinder (an asset). The equation doesn't move at all — value changed shape, not amount.", "Nothing was borrowed — the café paid cash.", "Buying an asset isn't an expense, and equity only moves when value is earned or consumed.", "The transaction is recorded the moment it happens; the grinder is on the books immediately."] },
        { q: "Assets are ₹8,00,000 and equity is ₹5,00,000. What are liabilities?", opts: ["₹13,00,000", "₹3,00,000", "₹5,00,000", "Not enough information"], correct: 1, why: ["That's assets plus equity — but equity is part of the claims side, not another asset.", "Rearranging assets = liabilities + equity gives liabilities = 8,00,000 − 5,00,000 = ₹3,00,000.", "That's the equity figure repeated.", "The accounting equation fully determines the third number from any two."] },
        { q: "Money a customer owes the café for a delivered catering order is…", opts: ["A liability, because it's unpaid", "An asset, because it's a right to receive cash", "Revenue only, with no balance sheet effect", "Equity"], correct: 1, why: ["It's unpaid <em>to</em> the café, not <em>by</em> it. Direction matters.", "A trade receivable — the café controls a legal right to future cash, which is exactly what an asset is.", "Revenue is recognised, but the unpaid amount must also sit on the balance sheet. Every entry has two sides.", "Equity is the owner's residual claim, not a specific customer debt."] },
        { q: "Which statement answers \"did the business make a profit this year?\"", opts: ["Balance sheet", "Income statement", "Cash flow statement", "All three equally"], correct: 1, why: ["The balance sheet is a snapshot of what's owned and owed at one instant — it shows accumulated profit inside equity, but not this year's performance.", "Revenue minus expenses over a period is precisely what the income statement reports.", "That one answers where the cash went, which is a different question — and often a very different answer.", "Each answers a distinct question; conflating them is the mistake this course spends module 1000 preventing."] },
        { q: "The café pays ₹30,000 of rent for the month just ended. The effect on equity is…", opts: ["No change — cash just moved", "Equity falls ₹30,000", "Equity rises ₹30,000", "Equity falls only if the café is loss-making"], correct: 1, why: ["Cash fell and nothing was received in exchange that the café still owns — that consumption has to land somewhere, and it lands in equity.", "Rent is an expense: value consumed. Expenses reduce profit, and profit belongs to the owner, so equity falls by the same ₹30,000 the assets did. The equation stays balanced.", "Expenses never increase equity.", "Every expense reduces equity regardless of whether the business is overall profitable."] }
      ]
    },
    "1100": {
      title: "Assets",
      questions: [
        { q: "The café repaints its shopfront for ₹40,000. This is…", opts: ["Capex — it improves the property", "An expense — it maintains what already exists", "Inventory", "A liability"], correct: 1, why: ["Repainting restores the shop to its existing condition rather than extending its life or capacity, so it isn't capitalised.", "Maintenance keeps an asset doing what it already did — expensed in the period. Had the café instead built an extension, that added capacity would be capex.", "Inventory is goods held for sale; paint on a wall isn't for sale.", "It's a cost, not an obligation — assuming it's been paid."] },
        { q: "A machine costs ₹6,00,000 with a 10-year life and no residual value. Annual straight-line depreciation is…", opts: ["₹60,000", "₹6,00,000", "₹10,000", "It depends on the machine's resale value"], correct: 0, why: ["Cost ÷ life = 6,00,000 ÷ 10 = ₹60,000 every year, charged against the original cost, not the falling book value.", "That's the whole cost, which would wrongly expense a 10-year asset in a single year.", "That would be a 60-year life.", "Resale value and book value drift apart immediately — accounting allocates cost, it doesn't appraise."] },
        { q: "Opening inventory ₹1,00,000, purchases ₹5,00,000, closing inventory ₹1,50,000. COGS is…", opts: ["₹5,50,000", "₹4,50,000", "₹5,00,000", "₹6,50,000"], correct: 1, why: ["That would mean consuming more than was available plus held — check the direction of the closing adjustment.", "COGS = opening + purchases − closing = 1,00,000 + 5,00,000 − 1,50,000 = ₹4,50,000. Stock grew ₹50,000, so ₹50,000 of what was bought is still on the shelf, not yet an expense.", "That's just purchases — it ignores the ₹50,000 that went into stock rather than into sales.", "That adds closing inventory instead of subtracting it."] },
        { q: "The café delivers a ₹50,000 order on 28 March, payable 30 April. Its 31 March balance sheet shows…", opts: ["₹50,000 more cash", "₹50,000 in trade receivables", "Nothing — no cash has moved", "₹50,000 as a liability"], correct: 1, why: ["No cash arrives until April — the bank balance is untouched at year end.", "Delivered means revenue is recognised; unpaid means the amount sits as a receivable. It converts to cash in April, which is FY26's cash flow, not FY26's revenue.", "Accrual accounting records what's earned, not what's collected — otherwise any business could hide sales by delaying invoices.", "The customer owes the café, so it's the café's asset."] },
        { q: "A refundable lease deposit repayable when the lease ends in six years is…", opts: ["A current asset — it's basically cash", "A non-current asset", "An expense", "A liability"], correct: 1, why: ["It feels like cash, but the café can't touch it for six years. Classification follows expected timing, not the nature of the item.", "Expected to convert to cash beyond twelve months, so it sits with the non-current assets near PP&E.", "It's fully refundable, so nothing has been consumed — the café still owns the money.", "The landlord owes it back to the café, making it the café's asset."] }
      ]
    },
    "1200": {
      title: "Liabilities",
      questions: [
        { q: "The café receives ₹80,000 of beans on 45-day credit. At that moment…", opts: ["An expense of ₹80,000 is recorded", "Inventory and trade payables both rise ₹80,000", "Cash falls ₹80,000", "Nothing is recorded until payment"], correct: 1, why: ["No expense yet — the beans are an asset until they're brewed and sold.", "An asset arrives and an obligation arrives with it. The expense comes later (when consumed), the cash movement later still (day 45). Three events, three dates.", "Cash is untouched for 45 days — that's what credit terms mean.", "The obligation exists the moment goods change hands; waiting would let a business hide its debts."] },
        { q: "March salaries of ₹30,000 will be paid on 5 April. In the 31 March statements they are…", opts: ["Ignored — not yet paid", "An expense in March and a liability at 31 March", "An expense in April only", "An asset"], correct: 1, why: ["The work was done in March; ignoring it would understate March's costs and overstate its profit.", "Matching puts the cost in the period the work was done, and because the cash hasn't left, the unpaid amount sits as an accrued liability at year end.", "Recording it in April would push a March cost into the wrong year.", "The café owes money — that's an obligation, not something it owns."] },
        { q: "The café pays the bank ₹1,10,000: ₹60,000 interest and ₹50,000 principal. The income statement shows…", opts: ["₹1,10,000", "₹60,000", "₹50,000", "Nothing"], correct: 1, why: ["Only part of the payment is a cost of doing business.", "Interest is the price of using the bank's money for the year — an expense. The ₹50,000 principal repayment just returns borrowed money: assets down, liabilities down, equity untouched.", "That's the principal, which is precisely the part that is <em>not</em> an expense.", "Interest genuinely is an expense — a service fully consumed each year."] },
        { q: "Interest at 10% on an opening loan balance of ₹5,50,000 is…", opts: ["₹55,000", "₹50,000", "₹5,500", "It depends on the repayment date"], correct: 0, why: ["10% × ₹5,50,000 = ₹55,000, using this course's convention of charging on the opening balance.", "That's the principal repayment figure, not the interest.", "That would be a 1% rate.", "Real loans do charge on the reducing balance, but the simplification here — and it is a simplification — is a flat charge on the opening balance."] },
        { q: "Why is share capital shown with liabilities rather than assets?", opts: ["To force the sheet to balance", "Because both sides list claims on the assets, ranked by seniority", "Because owners can demand it back like a loan", "It's an arbitrary convention"], correct: 1, why: ["The sheet balances by arithmetic — equity is defined as the residual, not forced into place.", "The left side lists what the business has; the right lists who has a claim on it. Creditors claim fixed amounts first, the owner claims whatever remains, last. That ranking is exactly why lenders and owners analyse a business differently.", "Equity has no due date and no fixed amount — that's what separates it from a loan.", "The layout encodes real seniority of claims, which is information, not convention."] }
      ]
    },
    "1300": {
      title: "Equity & the balance sheet",
      questions: [
        { q: "Opening retained earnings ₹1,20,000, PAT ₹1,80,000, dividend ₹50,000. Closing retained earnings are…", opts: ["₹3,00,000", "₹2,50,000", "₹1,80,000", "₹3,50,000"], correct: 1, why: ["That forgets the dividend — a very common slip, and one that leaves a balance sheet out by exactly the dividend.", "1,20,000 + 1,80,000 − 50,000 = ₹2,50,000. Opening plus what was earned, minus what was paid out.", "That's just this year's profit, ignoring everything accumulated before.", "That adds the dividend instead of subtracting it."] },
        { q: "After two profitable years the café's share capital is unchanged. Why?", opts: ["An error", "Profits go to retained earnings, not share capital", "It's only revalued every five years", "Priya took the profits as salary"], correct: 1, why: ["This is by design — the two equity lines answer different questions.", "Share capital records what owners paid in; retained earnings records what the business earned and kept. Keeping them apart lets a reader split equity into money invested versus money self-generated.", "Indian books are kept at historical cost; there's no periodic revaluation of share capital.", "Whether profits are distributed or retained, share capital is untouched either way."] },
        { q: "Retained earnings are ₹2,50,000 but cash is ₹1,00,000. This means…", opts: ["₹1,50,000 is missing", "Retained profit was reinvested into other assets", "The accounts are wrong", "A dividend is overdue"], correct: 1, why: ["Nothing is missing — the money was deliberately put to work.", "Retained earnings is a claim, not a pile of cash. The profit became equipment, inventory and receivables, and repaid debt. Large retained earnings with modest cash is entirely normal.", "The two numbers measure different things and have no reason to match.", "Dividends are a choice, and retained earnings exceeding cash says nothing about whether one is due."] },
        { q: "Gross PP&E is ₹18,40,000 and accumulated depreciation ₹4,40,000. Net PP&E is…", opts: ["₹22,80,000", "₹14,00,000", "₹18,40,000", "₹4,40,000"], correct: 1, why: ["Depreciation is subtracted from cost, not added to it.", "18,40,000 − 4,40,000 = ₹14,00,000, the unallocated portion of the original cost still sitting on the balance sheet.", "That's the gross figure before any depreciation is recognised.", "That's the accumulated depreciation itself."] },
        { q: "A balance sheet is out by exactly the year's profit after tax. The likely cause is…", opts: ["Depreciation was missed", "Retained earnings was never rolled forward", "An asset was double counted", "The cash balance is wrong"], correct: 1, why: ["A missing depreciation charge would leave a gap the size of depreciation, not of PAT.", "A gap equal to PAT is the classic signature: the profit's assets all arrived, but the matching claim in equity was never recorded. Read the size of the gap before hunting through formulas.", "Possible in principle, but only if the duplicated asset happened to equal PAT exactly.", "Also possible, but again only by coincidence — the gap's size points straight at the retained earnings bridge."] }
      ]
    },
    "1400": {
      title: "The income statement",
      questions: [
        { q: "A customer prepays ₹90,000 in March for an April event. March revenue is…", opts: ["₹90,000", "Nothing", "₹7,500", "Half of it"], correct: 1, why: ["Cash received isn't the test — otherwise any company could inflate revenue by asking customers to prepay.", "Nothing has been delivered, so nothing has been earned. The ₹90,000 sits as a liability (deferred revenue) until the event happens in April.", "Time-apportioning suits something delivered continuously, like a subscription. A one-day event is delivered on the day.", "There's no basis for splitting it — delivery is a single future date."] },
        { q: "Revenue ₹24,00,000 and COGS ₹8,40,000. Gross margin is…", opts: ["35%", "65%", "165%", "₹15,60,000"], correct: 1, why: ["35% is the COGS ratio — the share consumed by direct costs, not the share retained.", "Gross profit is ₹15,60,000, and ₹15,60,000 ÷ ₹24,00,000 = 65%.", "A margin above 100% would mean the product costs nothing and then some.", "That's gross profit in rupees; a margin is expressed as a percentage of revenue."] },
        { q: "Which is excluded from EBITDA?", opts: ["Rent", "Barista salaries", "Depreciation", "Marketing"], correct: 2, why: ["Rent is an operating expense, deducted before EBITDA.", "Salaries are operating costs, also deducted before EBITDA.", "The D in EBITDA stands for depreciation — it's added back precisely so operations can be compared without past investment decisions getting in the way. Interest and tax are the other exclusions.", "Marketing is an operating expense too."] },
        { q: "EBIT ₹3,00,000, interest ₹60,000, tax rate 25%. PAT is…", opts: ["₹2,40,000", "₹1,80,000", "₹2,25,000", "₹1,20,000"], correct: 1, why: ["That's profit before tax — the taxman hasn't been paid yet.", "PBT = 3,00,000 − 60,000 = ₹2,40,000; tax at 25% is ₹60,000; PAT = ₹1,80,000.", "That applies the tax to EBIT rather than to profit after interest — interest is deductible before tax.", "That deducts too much; check the tax base."] },
        { q: "A business repays debt, eliminating ₹55,000 of annual interest. With a 25% tax rate, PAT rises by…", opts: ["₹55,000", "₹41,250", "₹13,750", "Nothing — repayment isn't a P&L item"], correct: 1, why: ["A pre-tax saving is never fully kept — profit rising means tax rising too.", "PBT rises ₹55,000, tax rises ₹13,750, so PAT rises ₹41,250. This is the mirror image of the tax shield that makes debt cheaper than it looks.", "That's the extra tax, not the gain.", "The repayment itself isn't, but the interest it eliminates very much is an expense."] }
      ]
    },
    "1500": {
      title: "The cash flow statement",
      questions: [
        { q: "Which adjustment is ADDED back to profit when computing cash from operations?", opts: ["An increase in receivables", "Depreciation", "An increase in inventory", "A dividend paid"], correct: 1, why: ["Receivables rising means revenue recognised without cash arriving — subtracted.", "Depreciation is an expense that removed no cash, so it's added back. It's usually the largest single reconciling item.", "Stock rising means cash spent that isn't yet an expense — subtracted.", "Dividends are a financing outflow, not an operating adjustment."] },
        { q: "Inventory falls from ₹1,50,000 to ₹1,10,000. The effect on CFO is…", opts: ["−₹40,000", "+₹40,000", "None", "−₹1,10,000"], correct: 1, why: ["That's backwards — running stock down releases cash rather than consuming it.", "An asset falling releases cash: the café sold goods it had already paid for without fully replacing them. Assets up consume cash, assets down release it.", "The change in every working-capital balance is exactly what the indirect method adjusts for.", "The adjustment is the change, not the closing balance."] },
        { q: "Buying equipment for ₹2,40,000 appears in…", opts: ["Operating", "Investing", "Financing", "It doesn't appear — it's not an expense"], correct: 1, why: ["Operating covers the day-to-day business of selling coffee, not the purchase of long-lived assets.", "Cash spent on long-term assets is investing. The asset then reaches the income statement gradually, as depreciation.", "Financing covers dealings with lenders and owners, not with equipment suppliers.", "It isn't an expense, but it's very much a cash movement — which is exactly why this statement exists."] },
        { q: "CFO ₹3,80,000, CFI −₹2,40,000, CFF −₹1,00,000, opening cash ₹60,000. Closing cash is…", opts: ["₹40,000", "₹1,00,000", "₹7,80,000", "₹60,000"], correct: 1, why: ["₹40,000 is the net change, not the closing balance — it still has to be added to what was already there.", "3,80,000 − 2,40,000 − 1,00,000 = ₹40,000 net change; plus ₹60,000 opening = ₹1,00,000. This must equal the balance sheet's cash line.", "That adds the outflows instead of subtracting them.", "That's the opening balance, unchanged."] },
        { q: "A business shows CFO +₹5,00,000, CFI −₹8,00,000, CFF +₹4,00,000. This describes…", opts: ["A failing business", "A business investing beyond its operating cash, funded by raising money", "A business returning cash to shareholders", "An arithmetic error"], correct: 1, why: ["Negative CFI is a sign of investment, not distress. The question is whether the funding is sustainable.", "It generated ₹5,00,000, spent ₹8,00,000 on assets, and covered the shortfall by borrowing or issuing shares — the classic expansion profile. Legitimate, but dependent on funders continuing to say yes.", "Positive CFF means money coming <em>in</em> from funders, not going out.", "The three sections net to a ₹1,00,000 rise in cash; there's no reason for them to sum to zero."] }
      ]
    },
    "1600": {
      title: "Ratios",
      questions: [
        { q: "Gross margin falls from 65% to 58% while revenue grows. The likeliest cause is…", opts: ["Rent increased", "Input costs rose and weren't passed on in prices", "New equipment was bought", "Debt was repaid"], correct: 1, why: ["Rent sits below the gross profit line — it cannot affect gross margin. That's exactly why the subtotal is useful.", "Gross margin moves only when the relationship between selling price and direct cost changes. Absorbing higher input costs is the textbook cause, and a signal of weak pricing power.", "Equipment is capex, reaching the P&L as depreciation, far below gross profit.", "Debt repayment never touches the income statement at all."] },
        { q: "Two businesses both have a current ratio of 1.5x. What most affects which is safer?", opts: ["Which has more total assets", "How much of the current assets is inventory rather than cash", "Which is more profitable", "Which is larger"], correct: 1, why: ["Total assets includes long-term items that can't pay next month's bills.", "The quick ratio strips out inventory, because stock has to be sold before it becomes cash — and in a bad month it may not sell. Identical current ratios can hide completely different risk.", "Profit matters greatly, but liquidity is about timing of cash, and profitable businesses do run out of money.", "Size gives some resilience but says little about whether near-term bills can be paid."] },
        { q: "Interest coverage is EBIT ÷ interest. A coverage of 1.25x means…", opts: ["Comfortable headroom", "Operating profit barely exceeds the interest bill", "The business is loss-making", "Debt is 1.25x equity"], correct: 1, why: ["A 25% cushion is thin — one bad quarter and the payment can't be made.", "EBIT covers interest only 1.25 times, leaving very little room. Lenders write coverage covenants precisely because this flow measure predicts distress sooner than any balance-sheet ratio.", "Coverage above 1x means EBIT exceeds interest; the business is profitable at that level, if narrowly.", "That's debt-to-equity, a different (and stock-based) ratio."] },
        { q: "PAT ₹1,80,000 and equity ₹12,50,000. ROE is…", opts: ["14.4%", "6.9%", "144%", "7.5%"], correct: 0, why: ["1,80,000 ÷ 12,50,000 = 14.4% — the return on the owner's money after lenders and tax.", "That inverts the fraction.", "That's off by a factor of ten.", "7.5% is the PAT margin (profit over revenue), a different denominator entirely."] },
        { q: "Two businesses both earn 18% ROE. One does it on a 12% margin with low leverage, the other on a 3% margin with 3x leverage. Which is more robust?", opts: ["The leveraged one — leverage boosts returns", "The high-margin one", "They're identical", "Impossible to say"], correct: 1, why: ["Leverage magnifies losses exactly as it magnifies gains — it raises the return and the risk together.", "A 12% margin absorbs a bad year; a 3% margin amplified 3x can swing sharply negative on a small setback. Same ROE, opposite risk profiles — which is exactly what DuPont exists to reveal.", "The ROE is the same; the quality of it is not.", "DuPont makes it very answerable — that's its whole purpose."] }
      ]
    },
    "2100": {
      title: "Linking the statements",
      questions: [
        { q: "Which is NOT one of the three bridges between the statements?", opts: ["PAT into retained earnings", "Depreciation reducing PP&E", "Closing cash into the balance sheet", "Revenue into trade receivables"], correct: 3, why: ["That's bridge 1 — the income statement's bottom line entering equity.", "That's bridge 2 — one number appearing on all three statements.", "That's bridge 3 — the cash flow statement's final line being the balance sheet's cash.", "Revenue does drive receivables, but that's a working-capital relationship inside one period's modelling, not one of the three structural bridges that make the statements interlock."] },
        { q: "You increase depreciation by ₹10,000 in a linked model (ignore tax). Cash…", opts: ["falls ₹10,000", "rises ₹10,000", "doesn't move", "falls ₹7,500"], correct: 2, why: ["Depreciation removes no cash — that's its defining feature.", "Cash doesn't rise either; the two effects cancel exactly.", "PAT falls ₹10,000 but the cash flow statement adds back ₹10,000 more depreciation, so CFO is unchanged. Meanwhile PP&E and retained earnings both fall ₹10,000, and the sheet still ties. This self-correcting behaviour is the sign of a correctly linked model.", "There's no tax effect to consider — the question says to ignore tax."] },
        { q: "A model is out by exactly the dividend paid. Check first…", opts: ["The depreciation schedule", "The retained earnings roll-forward", "The capex line", "The revenue forecast"], correct: 1, why: ["A depreciation error would leave a gap the size of depreciation.", "The dividend appears in only one balance-sheet formula — retained earnings — and it's easy to forget because it never appears on the income statement. Gap size names the culprit before you read a formula.", "Capex errors leave a gap the size of capex.", "A revenue error would flow through PAT and produce a differently-sized gap."] },
        { q: "A model is out by exactly twice the capex figure. That usually means…", opts: ["Capex was omitted", "A sign was flipped", "Capex was recorded in two places", "Depreciation equals capex"], correct: 1, why: ["Omitting it leaves a gap of one times capex, not two.", "Adding an amount where you should subtract it moves the total by twice that amount — the sum you wrongly added plus the sum you failed to subtract. A doubled gap is the signature of a sign error.", "Possible, but a flipped sign is far more common and produces exactly this pattern.", "That relationship affects net PP&E but wouldn't create a gap at all."] },
        { q: "Why does each year's closing cash depend on the previous year's closing cash?", opts: ["To save typing", "Because cash is a stock and the statement measures only the change", "Because spreadsheets require it", "It doesn't — each year stands alone"], correct: 1, why: ["Convenient, but the reason is conceptual.", "Cash persists; the cash flow statement measures a flow, the change during the period. Closing = opening + change is the only way to connect a stock to a flow — the same distinction lesson 1040 introduced.", "The spreadsheet doesn't care; the accounting does.", "Computing cash afresh each year would mean re-deriving every transaction since the business opened."] }
      ]
    },
    "2200": {
      title: "Modeling & valuation",
      questions: [
        { q: "Modelling receivables as flat while revenue grows 15% a year implicitly assumes…", opts: ["Nothing — it's neutral", "Customers pay progressively faster each year", "Revenue will stop growing", "Bad debts are rising"], correct: 1, why: ["It's the opposite of neutral: a frozen balance against rising sales is a strong hidden assumption.", "Flat receivables on rising revenue means DSO falling year after year — you've assumed the business gets better at collecting, which flatters cash flow. Holding the days constant keeps the assumption neutral, which is why working capital is modelled in days.", "The assumption concerns collection speed, not future growth.", "Rising bad debts would push receivables up, not hold them flat."] },
        { q: "FCFF is built from EBIT × (1 − tax) rather than PAT because…", opts: ["It's simpler to compute", "It measures the business before financing, so value doesn't change with the debt mix", "PAT excludes depreciation", "Tax rules require it"], correct: 1, why: ["It's actually more work — you deliberately recompute tax as if there were no debt.", "PAT is struck after interest, so a borrower would look less valuable purely for having borrowed. FCFF values the business itself; debt is handled separately by subtracting net debt from enterprise value.", "PAT is after depreciation, which is why the add-back is its own line in the build.", "This is a valuation convention, not a tax rule."] },
        { q: "EBIT ₹4,32,000, tax 25%, depreciation ₹2,40,000, capex ₹2,40,000, working capital up ₹34,500. FCFF is…", opts: ["₹3,24,000", "₹2,89,500", "₹3,58,500", "₹4,32,000"], correct: 1, why: ["That's NOPAT, before the depreciation, capex and working-capital adjustments.", "NOPAT ₹3,24,000, plus depreciation ₹2,40,000, minus capex ₹2,40,000 (they cancel), minus ₹34,500 of working capital = ₹2,89,500.", "That adds the working-capital movement instead of subtracting it — growth ties cash up.", "That's EBIT before tax and before any of the cash adjustments."] },
        { q: "In a terminal value using Gordon growth, the growth rate g must be…", opts: ["Higher than the WACC", "Below the WACC, and no higher than long-run economic growth", "Equal to the forecast-period growth rate", "Zero"], correct: 1, why: ["If g exceeded the WACC the formula would return a negative or infinite value — it breaks down entirely.", "The denominator (WACC − g) requires g < WACC, and economic sense requires g to be modest: a business growing faster than the economy forever would eventually become the economy. 3–5% is the usual range.", "Forecast-period growth is usually much higher — it reflects a specific growth phase that can't continue indefinitely.", "Zero is permissible but unnecessarily conservative; modest perpetual growth is standard."] },
        { q: "Most of a DCF's value typically comes from the terminal value. This means…", opts: ["The forecast years don't matter", "The answer is highly sensitive to assumptions about the distant future", "The model is wrong", "You should use a shorter forecast"], correct: 1, why: ["They matter — they set the base the terminal value is calculated from.", "When most of the value rests on one formula and one long-run growth assumption, small changes in that assumption move the answer a lot. This is why a DCF should be presented as a range with its assumptions stated, never as a single confident figure.", "It's a structural feature of the method, not an error.", "A shorter forecast would increase the terminal value's share, not reduce it."] }
      ]
    }
  };

  /* ---------------- renderer ---------------- */
  LS.renderQuiz = function (code, content) {
    var quiz = LS.quizzes[code];
    var ui = LS.ui, el = ui.el, esc = ui.esc;
    if (!quiz) { location.hash = "#/"; return; }
    ui.setMeta("Quiz · " + code + " " + quiz.title + " · LedgerSchool",
      "Five questions on module " + code + ", " + quiz.title + ", with explanations for every option.");

    var page = el("div", "page");
    page.appendChild(el("p", "lesson-kicker",
      '<a href="#/module/' + code + '" style="text-decoration:none">' + code + " · " + esc(quiz.title) + "</a>"));
    page.appendChild(el("h1", null, "Module quiz"));
    page.appendChild(el("p", "lesson-lede",
      "Five questions. Pick an answer to see why it's right or wrong — you can change your mind, but your first pick is what's scored."));

    var answers = {}, firstPick = {};
    var scoreBox = el("p", "quiz-score", "Answered 0 of 5");
    scoreBox.setAttribute("aria-live", "polite");
    page.appendChild(scoreBox);

    function refreshScore() {
      var answered = Object.keys(firstPick).length;
      var right = Object.keys(firstPick).filter(function (k) { return firstPick[k]; }).length;
      if (answered < quiz.questions.length) {
        scoreBox.textContent = "Answered " + answered + " of " + quiz.questions.length;
      } else {
        scoreBox.textContent = "Score: " + right + " / " + quiz.questions.length + " — " +
          (right === 5 ? "every one right." :
           right >= 4 ? "solid." :
           right >= 3 ? "worth a re-read of the ones you missed." :
                        "go back through the module; the explanations above show where it went sideways.");
        LS.store.quiz(code, right);
        ui.buildSidebar();
      }
    }

    quiz.questions.forEach(function (q, qi) {
      var wrap = el("div", "mcq-block");
      wrap.appendChild(el("div", "mcq-tag", "Question " + (qi + 1) + " of " + quiz.questions.length));
      wrap.appendChild(el("p", "mcq-q", q.q));
      var ul = el("ul", "mcq-opts");
      var explain = el("div");
      q.opts.forEach(function (opt, i) {
        var li = el("li");
        var btn = el("button", null, esc(opt));
        btn.type = "button";
        btn.addEventListener("click", function () {
          var right = i === q.correct;
          if (!(qi in firstPick)) firstPick[qi] = right;
          answers[qi] = i;
          Array.prototype.forEach.call(ul.querySelectorAll("button"), function (x) {
            x.classList.remove("picked-wrong", "picked-right");
          });
          btn.classList.add(right ? "picked-right" : "picked-wrong");
          explain.innerHTML = "";
          var box = el("div", "mcq-explain" + (right ? "" : " wrong"));
          box.innerHTML = "<p><strong>" + (right ? "Correct." : "Not quite.") + "</strong> " + q.why[i] + "</p>";
          if (!right) {
            box.innerHTML += "<p><strong>The answer is “" + esc(q.opts[q.correct]) + "”:</strong> " + q.why[q.correct] + "</p>";
          }
          explain.appendChild(box);
          refreshScore();
        });
        li.appendChild(btn);
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
      wrap.appendChild(explain);
      page.appendChild(wrap);
    });

    var back = el("a", "btn btn-ghost", "← Back to module " + code);
    back.href = "#/module/" + code;
    page.appendChild(back);

    content.innerHTML = "";
    content.appendChild(page);
  };
})();
