/* Reference: a page per statement with every line item defined, plus a
   formula sheet. The lookup half of the site — you don't read it, you
   consult it. Each line names the lesson that teaches it. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  var C = LS.C, R = LS.fmt.inr;

  function line(item, def, lesson) { return { item: item, def: def, lesson: lesson }; }

  LS.reference = {
    "balance-sheet": {
      title: "Balance sheet lines",
      lede: "Every line on Bombay Bean's balance sheet, defined in two sentences, in Schedule III order (equity and liabilities first, then assets — India's statutory presentation).",
      note: "The course builds the balance sheet assets-first because that's the easier way to learn it. Published Indian statements use the order below. Same numbers, opposite sequence.",
      groups: [
        {
          heading: "Equity",
          lines: [
            line("Share capital", "The amount owners have paid into the company in exchange for shares. It records historical contribution, not current value, and changes only when shares are issued or bought back.", "1310-share-capital"),
            line("Retained earnings", "All profit the business has ever earned, less all dividends ever paid. It grows each year by profit after tax and shrinks by dividends — and it is a claim, not a pile of cash.", "1320-retained-earnings")
          ]
        },
        {
          heading: "Non-current liabilities",
          lines: [
            line("Borrowings (term loan)", "Money owed to lenders on fixed terms, repayable beyond twelve months. Only the interest on it is an expense; repaying the principal never touches the income statement.", "1220-borrowings")
          ]
        },
        {
          heading: "Current liabilities",
          lines: [
            line("Trade payables", "Amounts owed to suppliers for goods or services already received, typically due within 30–60 days. The mirror image of trade receivables, and effectively an interest-free loan from your suppliers.", "1210-payables"),
            line("Accrued expenses", "Costs that belong to this period but haven't been billed or paid yet, such as March salaries paid on 5 April. The expense is recognised now and the unpaid amount sits here until cash leaves.", "1210-payables")
          ]
        },
        {
          heading: "Non-current assets",
          lines: [
            line("Property, plant & equipment (gross)", "The total original cost of long-lived physical assets — fit-out, machines, vehicles. Recorded at what was paid, never revalued upward in this course.", "1110-ppe"),
            line("Accumulated depreciation", "The running total of all depreciation charged against those assets since purchase. Subtracted from gross PP&E, it never reduces cash.", "1120-depreciation"),
            line("Property, plant & equipment (net)", "Gross cost minus accumulated depreciation — the portion of the original cost not yet charged to the income statement. It is not an estimate of resale value.", "1120-depreciation"),
            line("Security deposit", "A refundable amount lodged with the landlord, returned only when the lease ends. It is the business's money, but non-current because it can't be accessed within twelve months.", "1150-cash-deposit")
          ]
        },
        {
          heading: "Current assets",
          lines: [
            line("Inventory", "Goods held for sale or for making things to sell — beans, milk, cups. It becomes an expense (cost of goods sold) only when consumed in making a sale.", "1130-inventory"),
            line("Trade receivables", "Amounts customers owe for goods or services already delivered. Revenue is recognised at delivery, so this line holds the gap between the sale and the cash.", "1140-receivables"),
            line("Cash & bank balances", "Money immediately available — the till float and the current account. The most liquid asset, and the figure the cash flow statement must arrive at.", "1150-cash-deposit")
          ]
        }
      ]
    },

    "income-statement": {
      title: "Income statement lines",
      lede: "Every line from revenue down to profit after tax, in the order they appear, with the subtotal each one produces.",
      note: "Indian statutory formats don't print EBITDA or EBIT as named lines — analysts compute them. Everything else below appears on a published statement.",
      groups: [
        {
          heading: "Trading",
          lines: [
            line("Revenue", "The value of goods and services delivered during the period, whether or not customers have paid. Recognised when the business has done its job, not when cash arrives.", "1410-revenue"),
            line("Cost of goods sold", "The direct cost of what was actually sold — the inventory consumed, not the inventory bought. It moves with sales volume.", "1420-cogs"),
            line("Gross profit", "Revenue minus cost of goods sold: what's left after paying for the product itself. Its margin is the cleanest single read on pricing power.", "1420-cogs")
          ]
        },
        {
          heading: "Operating",
          lines: [
            line("Operating expenses", "The costs of being open — rent, salaries, utilities, marketing. Largely fixed, which is why growing revenue improves margins.", "1430-opex-ebitda"),
            line("EBITDA", "Earnings before interest, tax, depreciation and amortisation. Operating profit before financing choices, government and past investment — useful for comparison, but it is not cash flow.", "1430-opex-ebitda"),
            line("Depreciation & amortisation", "This period's share of the cost of long-lived assets. A genuine expense that consumes no cash, because the cash left when the asset was bought.", "1440-depreciation-pl"),
            line("EBIT (operating profit)", "EBITDA minus depreciation: profit after recognising that assets wear out, but before financing and tax. The numerator of ROCE and the starting point for free cash flow.", "1440-depreciation-pl")
          ]
        },
        {
          heading: "Financing, tax and the bottom line",
          lines: [
            line("Interest expense", "The cost of using borrowed money for the period, charged at the rate on the loan balance. Only interest is an expense; principal repayment is not.", "1450-interest-tax"),
            line("Profit before tax", "EBIT minus interest expense: the profit generated after paying for borrowed money. It is the base the tax charge is computed on.", "1450-interest-tax"),
            line("Tax expense", "The charge levied on profit before tax. This course applies a flat rate to book profit; real tax is computed on taxable income, which differs and creates deferred tax.", "1450-interest-tax"),
            line("Profit after tax", "The bottom line, also called net profit. The only profit figure that belongs to the owner, and the number that flows into retained earnings.", "1460-pl-capstone")
          ]
        }
      ]
    },

    "cash-flow": {
      title: "Cash flow statement lines",
      lede: "The three sections and every line within them, using the indirect method — the one essentially every published statement uses.",
      note: "Indian statements (AS 3 / Ind AS 7) usually begin the operating section at profit before tax and show tax paid separately. This course starts at profit after tax, which reaches the same CFO and is the common modelling shortcut.",
      groups: [
        {
          heading: "Operating activities",
          lines: [
            line("Profit after tax", "The starting point of the indirect method — the income statement's bottom line, carried straight across. Every line beneath it corrects that profit figure back towards cash.", "1520-cfo"),
            line("Add: depreciation", "Added back because it reduced profit without removing cash. Usually the largest single reconciling item.", "1520-cfo"),
            line("Change in trade receivables", "Receivables rising means revenue was recognised without cash arriving, so cash is subtracted. Falling receivables release cash.", "1520-cfo"),
            line("Change in inventory", "Stock rising means cash was spent on goods not yet expensed, so cash is subtracted. Running stock down releases cash.", "1520-cfo"),
            line("Change in payables & accruals", "A liability rising means an expense was recognised without cash leaving, so cash is added. The rule throughout: assets up consume cash, liabilities up release it.", "1520-cfo"),
            line("Cash from operations", "Cash generated by the actual business, before investment and before dealing with funders. A business that can't produce positive CFO is being funded by someone else.", "1520-cfo")
          ]
        },
        {
          heading: "Investing activities",
          lines: [
            line("Purchase of equipment (capex)", "Cash spent on long-lived assets. Never an expense in the year of purchase — it reaches the income statement gradually as depreciation.", "1530-cfi"),
            line("Proceeds from asset sales", "Cash received from disposing of long-lived assets, shown as an inflow within investing. It is the actual sale price received, which will rarely equal the asset's net book value.", "1530-cfi"),
            line("Cash from investing", "Usually negative, and healthily so. Compare capex with depreciation over several years: persistently below it means the asset base is quietly running down.", "1530-cfi")
          ]
        },
        {
          heading: "Financing activities",
          lines: [
            line("Loan drawdown / repayment", "Money borrowed or principal returned. Note that interest paid sits in operating, inside profit after tax — only the principal appears here.", "1540-cff"),
            line("Dividend paid", "Profit distributed to owners. It never appears on the income statement, because it is a distribution of profit rather than a cost of earning it.", "1540-cff"),
            line("Cash from financing", "The net movement between the business and its funders. Positive means raising money, negative means returning it.", "1540-cff")
          ]
        },
        {
          heading: "The reconciliation",
          lines: [
            line("Net change in cash", "The three sections added together: how much the bank balance moved over the period. It is a flow, not a balance — it says nothing about how much cash the business actually holds.", "1550-cf-capstone"),
            line("Opening and closing cash", "Opening plus the net change gives closing cash, which must equal the cash line on the balance sheet. If it doesn't, something in the model is wrong.", "1550-cf-capstone")
          ]
        }
      ]
    },

    "formulas": {
      title: "Formula sheet",
      lede: "Every formula taught in the course, grouped, with the lesson that derives it.",
      formulaSheet: true,
      groups: [
        {
          heading: "The foundations",
          items: [
            { fx: ["Assets = Liabilities + Equity", "Equity = Assets − Liabilities"], name: "The accounting equation", lesson: "1020-accounting-equation" },
            { fx: ["Closing = Opening + Increases − Decreases"], name: "The roll-forward (every balance works this way)", lesson: "1140-receivables" }
          ]
        },
        {
          heading: "Assets",
          items: [
            { fx: ["Annual depreciation = (Cost − Residual) ÷ Useful life"], name: "Straight-line depreciation — always off the original cost, so the charge is flat", lesson: "1120-depreciation" },
            { fx: ["Net book value = Cost − Accumulated depreciation"], name: "Net book value", lesson: "1120-depreciation" },
            { fx: ["COGS = Opening inventory + Purchases − Closing inventory", "Purchases = COGS + Closing − Opening"], name: "The inventory identity", lesson: "1130-inventory" },
            { fx: ["Cash collected = Opening AR + Credit sales − Closing AR"], name: "Rolling receivables forward", lesson: "1140-receivables" }
          ]
        },
        {
          heading: "Liabilities & equity",
          items: [
            { fx: ["Payments = Opening AP + Purchases − Closing AP"], name: "Rolling payables forward", lesson: "1210-payables" },
            { fx: ["Interest expense = Rate × Opening loan balance"], name: "Interest (this course's convention)", lesson: "1220-borrowings" },
            { fx: ["Share capital = Shares issued × Face value"], name: "Share capital", lesson: "1310-share-capital" },
            { fx: ["Closing RE = Opening RE + Profit after tax − Dividends"], name: "Retained earnings — bridge 1", lesson: "1320-retained-earnings" }
          ]
        },
        {
          heading: "The income statement",
          items: [
            { fx: ["Gross profit = Revenue − COGS"], name: "Gross profit", lesson: "1420-cogs" },
            { fx: ["EBITDA = Gross profit − Operating expenses"], name: "EBITDA", lesson: "1430-opex-ebitda" },
            { fx: ["EBIT = EBITDA − Depreciation & amortisation"], name: "Operating profit", lesson: "1440-depreciation-pl" },
            { fx: ["Profit before tax = EBIT − Interest", "Profit after tax = PBT − (Tax rate × PBT)"], name: "Down to the bottom line", lesson: "1450-interest-tax" }
          ]
        },
        {
          heading: "The cash flow statement",
          items: [
            { fx: ["CFO = PAT + Depreciation ± Working capital changes"], name: "Cash from operations, indirect method", lesson: "1520-cfo" },
            { fx: ["Closing PP&E = Opening + Capex − Depreciation"], name: "PP&E roll-forward — bridge 2", lesson: "1530-cfi" },
            { fx: ["Closing cash = Opening cash + CFO + CFI + CFF"], name: "The cash bridge — bridge 3", lesson: "1550-cf-capstone" }
          ]
        },
        {
          heading: "Ratios",
          items: [
            { fx: ["Gross margin  = Gross profit ÷ Revenue", "EBITDA margin = EBITDA ÷ Revenue", "PAT margin    = Profit after tax ÷ Revenue"], name: "Margins", lesson: "1610-margins" },
            { fx: ["Current ratio = Current assets ÷ Current liabilities", "Quick ratio   = (Current assets − Inventory) ÷ Current liabilities"], name: "Liquidity", lesson: "1620-liquidity" },
            { fx: ["Debt-to-equity    = Borrowings ÷ Equity", "Interest coverage = EBIT ÷ Interest expense"], name: "Leverage", lesson: "1630-leverage" },
            { fx: ["ROE  = Profit after tax ÷ Equity", "ROCE = EBIT ÷ (Equity + Debt)"], name: "Returns", lesson: "1640-returns" },
            { fx: ["ROE = (PAT ÷ Revenue) × (Revenue ÷ Assets) × (Assets ÷ Equity)", "&nbsp;&nbsp;&nbsp; = margin × asset turnover × leverage"], name: "The DuPont decomposition", lesson: "1640-returns" }
          ]
        },
        {
          heading: "Modeling & valuation",
          items: [
            { fx: ["DSO = Receivables ÷ Revenue × 365", "DIO = Inventory ÷ COGS × 365", "DPO = Payables ÷ COGS × 365"], name: "Working capital in days", lesson: "2210-drivers" },
            { fx: ["Cash conversion cycle = DIO + DSO − DPO"], name: "How long a rupee is tied up", lesson: "2210-drivers" },
            { fx: ["FCFF = EBIT × (1 − tax) + Depreciation − Capex − ΔWorking capital"], name: "Free cash flow to the firm", lesson: "2230-fcff" },
            { fx: ["Present value = Cash flow ÷ (1 + WACC)^year"], name: "Discounting", lesson: "2240-dcf" },
            { fx: ["Terminal value = Final FCFF × (1 + g) ÷ (WACC − g)"], name: "Gordon-growth terminal value", lesson: "2240-dcf" },
            { fx: ["Enterprise value = Σ PV of FCFF + PV of terminal value", "Equity value     = Enterprise value − Net debt"], name: "From cash flows to a valuation", lesson: "2240-dcf" }
          ]
        }
      ]
    }
  };

  /* ---------------- renderer ---------------- */
  LS.renderRef = function (id, content) {
    var ref = LS.reference[id];
    var ui = LS.ui, el = ui.el, esc = ui.esc;
    if (!ref) { location.hash = "#/"; return; }
    ui.setMeta(ref.title + " · FinStudio reference", ref.lede);

    var page = el("div", "page");
    page.appendChild(el("p", "lesson-kicker", "Reference"));
    page.appendChild(el("h1", null, esc(ref.title)));
    page.appendChild(el("p", "lesson-lede", esc(ref.lede)));
    if (ref.note) page.appendChild(el("div", "note-box", "<p>" + ref.note + "</p>"));

    ref.groups.forEach(function (g) {
      page.appendChild(el("h2", null, esc(g.heading)));
      if (ref.formulaSheet) {
        g.items.forEach(function (it) {
          var block = el("div", "formula-block");
          block.appendChild(el("div", "fx-title", esc(it.name)));
          it.fx.forEach(function (f) { block.appendChild(el("div", "fx-line", f)); });
          var lesson = LS.lessons[it.lesson];
          if (lesson) {
            block.appendChild(el("div", "fx-note",
              'Taught in <a href="#/' + it.lesson + '" style="color:#8FD4B4">' + lesson.code + " " + esc(lesson.title) + "</a>"));
          }
          page.appendChild(block);
        });
      } else {
        var wrap = el("div", "table-wrap");
        var t = el("table", "ls-table");
        var thead = el("thead");
        var hr = el("tr");
        hr.appendChild(el("th", null, "Line item"));
        hr.appendChild(el("th", null, "What it is"));
        hr.appendChild(el("th", null, "Taught in"));
        thead.appendChild(hr); t.appendChild(thead);
        var tb = el("tbody");
        g.lines.forEach(function (ln) {
          var tr = el("tr");
          tr.appendChild(el("td", null, "<strong>" + esc(ln.item) + "</strong>"));
          tr.appendChild(el("td", null, esc(ln.def)));
          var lesson = LS.lessons[ln.lesson];
          tr.appendChild(el("td", null, lesson
            ? '<a href="#/' + ln.lesson + '">' + lesson.code + "</a>"
            : "—"));
          tb.appendChild(tr);
        });
        t.appendChild(tb); wrap.appendChild(t);
        page.appendChild(wrap);
      }
    });

    var others = Object.keys(LS.reference).filter(function (k) { return k !== id; });
    if (others.length) {
      page.appendChild(el("hr", "rule"));
      var nav = el("p", null, "More reference: " + others.map(function (k) {
        return '<a href="#/ref/' + k + '">' + esc(LS.reference[k].title) + "</a>";
      }).join(" · "));
      page.appendChild(nav);
    }

    content.innerHTML = "";
    content.appendChild(page);
  };
})();
