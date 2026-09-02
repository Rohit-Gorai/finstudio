# Batch 1 — Level 4 (Financial Modeling) written

Upload all 14 files to the repo ROOT. New this batch: `concepts-l4.js`.
`index.html`, `curriculum-map.js` and `learning-graph.js` must go with it.

    index.html  app.js  site.css  curriculum-map.js  learning-graph.js
    concepts-l0.js  concepts-l1.js  concepts-l2.js  concepts-l3.js
    concepts-l4.js  ← new
    capstone.js  topic-lessons.js  master-topic-lab.js  researched-topic-pages.js

## How the placeholders were generated

`topic-lessons.js` walks `LS.curriculumMap` and, for any topic with
`written: false`, builds a lesson from a template — one generic example, one
practice item, one MCQ and the same "opportunity" sandbox on every topic. It
only fills unwritten topics, so marking a topic `written: true` in
`curriculum-map.js` removes its placeholder automatically. No placeholder file
needed editing; the 25 new lessons simply displace them.

## Implemented — 25 lessons

    Model architecture   architecture · assumptions · historical periods
                         formatting · best practices
    Operating schedules  revenue build · cost build · headcount · working capital
                         capex · depreciation · debt · interest · tax · retained earnings
    Integrated modeling  scenario analysis · sensitivity analysis · circularity
    Build a real model   revenue · gross profit · EBITDA · EBIT · net income
                         cash flow · balance sheet

Each carries the loop from your brief: intuition → accurate explanation →
worked example with figures → 2 practice questions with full answers → 1 check
with an explained answer → connection to the rest of finance. Depth scales as
instructed — circularity, the debt schedule, working capital and the cash flow
statement run long; model formatting is short.

Twelve reuse existing calculators (revenue-growth, operating-leverage,
receivables-cash, ppe-rollforward, depreciation, leverage-returns, retained,
profit-bridge, profit-to-cash, balance). No new UI, no new components.

The lessons build one café-chain model end to end, so the revenue build, cost
build, capex, debt and statements all use the same company and tie together.

Level 4 lessons also gained prerequisites and a "Building an integrated model"
chain in `learning-graph.js`.

## One standard change, flagged

The audit previously required 3 MCQs per lesson — the Level 0-3 format. Your
brief specifies the shorter loop, so the completion standard is now: a worked
example, **2+ practice items with answers**, and **1+ explained check**. It is
enforced on every authored lesson including Levels 0-3, which still exceed it.

## Verified

    curriculum audit PASS — Levels 0-4 complete (124 of 227 topics)
    scripts 50 · duplicates 0 · missing 0 · execution failures 0
    L4 sample: invalid nesting 0 · empty paragraphs 0 · prev+next 6/6
    learning graph: 0 dangling references · 0 cycles
    unlinked topics in rail: 0

## Remaining placeholders: 103

    Level 5  Valuation                  27
    Level 6  Investment Banking         14
    Level 7  Private Equity / LBO       12
    Level 8  Equity Research & Investing 17
    Level 9  Markets                    17
    Level 10 Advanced Finance           16

## Next batch

**Level 5 — Valuation (27 topics).** It is the next incomplete level and sits
first in your priority order after the modelling foundation this batch laid:
enterprise value, equity value, the multiples, then DCF, WACC, CAPM, beta,
terminal value and discount factors. DCF and WACC get the deep treatment.
