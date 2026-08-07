/* Bombay Bean Coffee Co. — the single source of truth.
   Every number in every lesson derives from this file, so the whole course
   stays mutually consistent: the P&L capstone's PAT (₹1,80,000), the cash
   flow capstone's closing cash (₹1,00,000) and the balance-sheet capstone's
   total (₹19,50,000) all come from here and tie by construction.

   Story: Priya opens a café in Mumbai on 1 April 2023 with ₹10,00,000 of her
   own capital and a ₹6,00,000 bank term loan at 10%. FY24 (year ended
   31 Mar 2024) is the founding year; FY25 is the year most lessons build.

   Conventions used (kept deliberately simple, and taught as such):
   - Straight-line depreciation, zero residual value, full year in the year
     of purchase (FY25 additions are bought on day one of FY25).
   - Interest = 10% x opening loan balance for the year.
   - Flat 25% tax on profit before tax.
   - The term loan is shown as one non-current borrowing (current maturities
     are not split out — flagged in lesson 1220).                            */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  var C = {};

  C.name = "Bombay Bean Coffee Co.";
  C.taxRate = 0.25;      // flat
  C.loanRate = 0.10;     // interest on opening balance

  /* ---------- fixed asset register ---------- */
  C.assets = [
    { name: "Café fit-out & furniture", cost: 600000, life: 10, bought: "FY24" },
    { name: "Espresso machine & kitchen", cost: 600000, life: 10, bought: "FY24" },
    { name: "Delivery van", cost: 400000, life: 5, bought: "FY24" },
    { name: "Second machine & scooter", cost: 240000, life: 6, bought: "FY25" }
  ];
  C.van = { cost: 400000, life: 5, dep: 80000 }; // the van schedule, reused across lessons

  /* ---------- FY24 (founding year, ended 31 Mar 2024) ---------- */
  C.fy24 = {
    pl: {
      revenue: 2000000, cogs: 700000, grossProfit: 1300000,
      rent: 360000, salaries: 440000, utilities: 60000, marketing: 20000,
      opex: 880000, ebitda: 420000, dep: 200000, ebit: 220000,
      interest: 60000, pbt: 160000, tax: 40000, pat: 120000
    },
    bs: {
      ppeGross: 1600000, accDep: 200000, ppeNet: 1400000,
      deposit: 100000, inventory: 120000, receivables: 160000, cash: 60000,
      totalAssets: 1840000,
      capital: 1000000, retained: 120000, loan: 600000,
      payables: 100000, accrued: 20000,
      totalLE: 1840000
    },
    cf: { // founding year, opening balances all zero
      pat: 120000, dep: 200000, dAR: -160000, dInv: -120000, dAP: 100000, dAccr: 20000,
      cfo: 160000, capex: -1600000, deposit: -100000, cfi: -1700000,
      capital: 1000000, loanDrawn: 600000, cff: 1600000,
      net: 60000, openingCash: 0, closingCash: 60000
    },
    dividend: 0
  };

  /* ---------- FY25 (the year the course builds, ended 31 Mar 2025) ---------- */
  C.fy25 = {
    pl: {
      revenue: 2400000, cogs: 840000, grossProfit: 1560000,
      rent: 360000, salaries: 540000, utilities: 80000, marketing: 40000,
      opex: 1020000, ebitda: 540000, dep: 240000, ebit: 300000,
      interest: 60000, pbt: 240000, tax: 60000, pat: 180000
    },
    bs: {
      ppeGross: 1840000, accDep: 440000, ppeNet: 1400000,
      deposit: 100000, inventory: 150000, receivables: 200000, cash: 100000,
      totalAssets: 1950000,
      capital: 1000000, retained: 250000, loan: 550000,
      payables: 120000, accrued: 30000,
      totalLE: 1950000
    },
    cf: {
      pat: 180000, dep: 240000, dAR: -40000, dInv: -30000, dAP: 20000, dAccr: 10000,
      cfo: 380000, capex: -240000, cfi: -240000,
      loanRepaid: -50000, dividend: -50000, cff: -100000,
      net: 40000, openingCash: 60000, closingCash: 100000
    },
    dividend: 50000
  };

  /* ---------- projection drivers (taught in 2210) ---------- */
  C.drivers = {
    growth: 0.15,        // revenue growth per projected year
    gm: 0.65,            // gross margin held flat
    opexGrowth: 0.10,    // operating cost inflation
    dep: 240000,         // steady state: depreciation ...
    capex: 240000,       // ... equals replacement capex
    repay: 50000,        // loan principal repaid each year
    dividendPerYear: 50000,
    arPctRevenue: C.fy25.bs.receivables / C.fy25.pl.revenue,   // ~8.33%
    invPctCogs: C.fy25.bs.inventory / C.fy25.pl.cogs,          // ~17.86%
    apPctCogs: C.fy25.bs.payables / C.fy25.pl.cogs             // ~14.29%
  };

  /* ---------- FY26–FY28 projections, computed (never hand-typed) ---------- */
  function projectYear(prev, prevBS) {
    var d = C.drivers;
    var pl = {};
    pl.revenue = prev.pl.revenue * (1 + d.growth);
    pl.cogs = pl.revenue * (1 - d.gm);
    pl.grossProfit = pl.revenue - pl.cogs;
    pl.opex = prev.pl.opex * (1 + d.opexGrowth);
    pl.ebitda = pl.grossProfit - pl.opex;
    pl.dep = d.dep;
    pl.ebit = pl.ebitda - pl.dep;
    pl.interest = C.loanRate * prevBS.loan;
    pl.pbt = pl.ebit - pl.interest;
    pl.tax = pl.pbt * C.taxRate;
    pl.pat = pl.pbt - pl.tax;

    var bs = {};
    bs.ppeNet = prevBS.ppeNet + d.capex - pl.dep;
    bs.deposit = prevBS.deposit;
    bs.receivables = pl.revenue * d.arPctRevenue;
    bs.inventory = pl.cogs * d.invPctCogs;
    bs.payables = pl.cogs * d.apPctCogs;
    bs.accrued = prevBS.accrued;
    bs.capital = prevBS.capital;
    bs.retained = prevBS.retained + pl.pat - d.dividendPerYear;
    bs.loan = prevBS.loan - d.repay;

    var cf = {};
    cf.pat = pl.pat; cf.dep = pl.dep;
    cf.dAR = -(bs.receivables - prevBS.receivables);
    cf.dInv = -(bs.inventory - prevBS.inventory);
    cf.dAP = bs.payables - prevBS.payables;
    cf.dAccr = bs.accrued - prevBS.accrued;
    cf.cfo = cf.pat + cf.dep + cf.dAR + cf.dInv + cf.dAP + cf.dAccr;
    cf.capex = -d.capex; cf.cfi = cf.capex;
    cf.loanRepaid = -d.repay; cf.dividend = -d.dividendPerYear;
    cf.cff = cf.loanRepaid + cf.dividend;
    cf.net = cf.cfo + cf.cfi + cf.cff;
    cf.openingCash = prevBS.cash;
    cf.closingCash = cf.openingCash + cf.net;

    bs.cash = cf.closingCash;
    bs.totalAssets = bs.ppeNet + bs.deposit + bs.inventory + bs.receivables + bs.cash;
    bs.totalLE = bs.capital + bs.retained + bs.loan + bs.payables + bs.accrued;

    // FCFF = EBIT x (1 - tax) + dep - capex - increase in working capital
    var dNWC = -(cf.dAR + cf.dInv + cf.dAP + cf.dAccr);
    var fcff = pl.ebit * (1 - C.taxRate) + pl.dep - d.capex - dNWC;

    return { pl: pl, bs: bs, cf: cf, dNWC: dNWC, fcff: fcff };
  }

  C.fy26 = projectYear(C.fy25, C.fy25.bs);
  C.fy27 = projectYear(C.fy26, C.fy26.bs);
  C.fy28 = projectYear(C.fy27, C.fy27.bs);

  /* ---------- DCF (taught in 2240/2250) ---------- */
  function dcf(wacc, tg) {
    var f = [C.fy26.fcff, C.fy27.fcff, C.fy28.fcff];
    var pv = f.map(function (x, i) { return x / Math.pow(1 + wacc, i + 1); });
    var tv = f[2] * (1 + tg) / (wacc - tg);              // Gordon growth off FY28
    var pvTV = tv / Math.pow(1 + wacc, 3);
    var ev = pv[0] + pv[1] + pv[2] + pvTV;
    var netDebt = C.fy25.bs.loan - C.fy25.bs.cash;       // at the valuation date (31 Mar 2025)
    return { wacc: wacc, tg: tg, fcff: f, pv: pv, tv: tv, pvTV: pvTV, ev: ev, netDebt: netDebt, equity: ev - netDebt };
  }
  C.dcfBase = dcf(0.12, 0.04);
  C.dcfBear = dcf(0.13, 0.03);   // the "cautious" hardwired scenario
  C.dcfFn = dcf;

  /* ---------- ratios, FY25 (and FY24 where comparisons need them) ---------- */
  C.ratios = {
    gmPct: C.fy25.pl.grossProfit / C.fy25.pl.revenue,               // 65%
    ebitdaPct: C.fy25.pl.ebitda / C.fy25.pl.revenue,                // 22.5%
    patPct: C.fy25.pl.pat / C.fy25.pl.revenue,                      // 7.5%
    currentAssets: C.fy25.bs.inventory + C.fy25.bs.receivables + C.fy25.bs.cash, // 4,50,000
    currentLiabs: C.fy25.bs.payables + C.fy25.bs.accrued,           // 1,50,000
    current: 3.0, quick: 2.0,
    de: C.fy25.bs.loan / (C.fy25.bs.capital + C.fy25.bs.retained),  // 0.44
    intCover: C.fy25.pl.ebit / C.fy25.pl.interest,                  // 5.0
    equity: C.fy25.bs.capital + C.fy25.bs.retained,                 // 12,50,000
    roe: C.fy25.pl.pat / 1250000,                                   // 14.4%
    capEmployed: 1250000 + C.fy25.bs.loan,                          // 18,00,000
    roce: C.fy25.pl.ebit / 1800000,                                 // 16.67%
    dso: C.fy25.bs.receivables / C.fy25.pl.revenue * 365,           // ~30.4 days
    dio: C.fy25.bs.inventory / C.fy25.pl.cogs * 365,                // ~65.2 days
    dpo: C.fy25.bs.payables / C.fy25.pl.cogs * 365                  // ~52.1 days
  };

  /* ---------- self-audit, run by tests/engine.test.html ---------- */
  C.verify = function () {
    var out = [];
    function ok(name, cond) { out.push({ name: name, ok: !!cond }); }
    function near(a, b) { return Math.abs(a - b) < 0.01; }
    [C.fy24, C.fy25].forEach(function (y, i) {
      var n = i === 0 ? "FY24" : "FY25", p = y.pl, b = y.bs, c = y.cf;
      ok(n + " P&L: GP = revenue - COGS", p.grossProfit === p.revenue - p.cogs);
      ok(n + " P&L: opex adds up", p.opex === p.rent + p.salaries + p.utilities + p.marketing);
      ok(n + " P&L: EBITDA = GP - opex", p.ebitda === p.grossProfit - p.opex);
      ok(n + " P&L chain to PAT", p.pat === p.ebitda - p.dep - p.interest - p.tax);
      ok(n + " tax is 25% of PBT", p.tax === p.pbt * C.taxRate);
      ok(n + " BS assets add up", b.totalAssets === b.ppeNet + b.deposit + b.inventory + b.receivables + b.cash);
      ok(n + " BS L+E adds up", b.totalLE === b.capital + b.retained + b.loan + b.payables + b.accrued);
      ok(n + " BS ties", b.totalAssets === b.totalLE);
      ok(n + " PP&E net = gross - acc dep", b.ppeNet === b.ppeGross - b.accDep);
      ok(n + " CFO adds up", c.cfo === c.pat + c.dep + c.dAR + c.dInv + c.dAP + c.dAccr);
      ok(n + " cash closes", c.closingCash === c.openingCash + c.cfo + c.cfi + c.cff);
      ok(n + " CF closing cash = BS cash", c.closingCash === b.cash);
    });
    ok("FY25 RE rollforward", C.fy25.bs.retained === C.fy24.bs.retained + C.fy25.pl.pat - C.fy25.dividend);
    ok("FY25 PP&E rollforward", C.fy25.bs.ppeNet === C.fy24.bs.ppeNet + (-C.fy25.cf.capex) - C.fy25.pl.dep);
    ok("FY25 loan rollforward", C.fy25.bs.loan === C.fy24.bs.loan + C.fy25.cf.loanRepaid);
    ok("FY25 interest = 10% x opening loan", C.fy25.pl.interest === C.loanRate * C.fy24.bs.loan);
    ok("FY24 dep = register", C.fy24.pl.dep === 600000 / 10 + 600000 / 10 + 400000 / 5);
    ok("FY25 dep = register + addition", C.fy25.pl.dep === 200000 + 240000 / 6);
    ok("Capstone total is 19,50,000", C.fy25.bs.totalAssets === 1950000);
    ok("Capstone PAT is 1,80,000", C.fy25.pl.pat === 180000);
    ok("Capstone closing cash is 1,00,000", C.fy25.cf.closingCash === 100000);
    [C.fy26, C.fy27, C.fy28].forEach(function (y, i) {
      var n = "FY" + (26 + i);
      ok(n + " projected BS ties", near(y.bs.totalAssets, y.bs.totalLE));
      ok(n + " projected cash closes", near(y.cf.closingCash, y.cf.openingCash + y.cf.cfo + y.cf.cfi + y.cf.cff));
    });
    ok("Ratios: current ratio 3.0", near(C.ratios.currentAssets / C.ratios.currentLiabs, 3));
    ok("Ratios: interest cover 5.0", near(C.ratios.intCover, 5));
    ok("DCF: EV positive and equity < EV", C.dcfBase.ev > 0 && C.dcfBase.equity < C.dcfBase.ev);
    return out;
  };

  LS.C = C;
  LS.inr = LS.fmt ? LS.fmt.inr : function (v) { return "₹" + v; };
})();
