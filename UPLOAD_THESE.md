# Upload all 21 files to the repo ROOT — zero placeholders remain

    index.html   app.js   site.css   curriculum-map.js   learning-graph.js
    concepts-l0.js … concepts-l10.js   (11 files)
    capstone.js   diagrams.js
    topic-lessons.js   master-topic-lab.js   researched-topic-pages.js

New this round: `concepts-l9.js`, `concepts-l10.js`. Everything else is the
complete bundle — uploading all 21 gets you the finished site in one go.

## Level 9 — Markets, 17/17

Stocks and market cap; then fixed income built in order — bonds, yield, yield
curves, duration, convexity, credit; macro — interest rates, central banks, FX,
commodities; derivatives — the general contract, options, futures; and market
mechanics — liquidity and volatility.

Duration and convexity get the deep treatment: a 30-year bond losing 15.8% on a
one-point rate move with no default risk, and convexity explaining why the same
move gains 27% and loses 21%.

## Level 10 — Advanced Finance, 16/16

Options pricing and time decay, Black-Scholes by replication (and why expected
return does not enter it), the Greeks; portfolio theory, CAPM re-derived from
diversification, the efficient frontier, Sharpe, beta, alpha, factor investing;
risk management, VaR and its blind spot, scenario analysis, Monte Carlo; and
the curriculum closes on capital structure and cost of capital.

The final lesson deliberately ends where Level 0 started: a company growing 11%
a year for two decades while earning 8% on capital costing 11% destroyed value
every year and reported rising profit throughout.

## Two errors I caught and fixed before shipping

- The Sharpe practice answer contained a visible mid-answer self-correction.
  Rewritten: 12% return at 10% volatility, levered at the risk-free rate, gives
  17% at 20% volatility — Sharpe 0.50 both ways.
- The Alpha quiz stated a 13% market return while its explanation used 10%.
  The question now states 10% market, 7% risk-free, beta 2.0, return 13% →
  alpha zero.

## Validated

    curriculum audit PASS — 227 of 227 topics have real lessons
    coverage: {"total":227,"linked":227,"complete":true}
    unlinked topics in the rail: 0
    199 authored lessons checked against the completion standard: 0 failures
    scripts 57 · duplicates 0 · missing 0 · execution failures 0
    learning graph: 0 dangling references · 0 prerequisite cycles
    L9/L10 sample: invalid nesting 0 · empty paragraphs 0 · prev+next 8/8
    café lessons preserved: 38 (29 inside Levels 0-10, 9 in model labs)
    study tools working: search, diagrams, onboarding, spaced review, self-check

## What is genuinely done, and what is not

Done: all 227 topics, the capstone, spaced repetition, lesson search, numeric
self-check, five diagrams, onboarding, prerequisites and concept chains across
all eleven levels, header behaviour, and the three repaired scripts.

Not done, and not fixable by me: real annual reports, actual Excel modelling,
video, and any measurement of whether learners retain this. Those need
licensing decisions, a spreadsheet, and real users respectively.
