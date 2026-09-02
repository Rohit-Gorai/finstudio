# FinStudio — connective tissue + capstone

Upload all 13 files to the repo **ROOT**. `index.html`, `app.js` and
`curriculum-map.js` must go together.

    index.html   app.js   site.css   curriculum-map.js
    concepts-l0.js  concepts-l1.js  concepts-l2.js  concepts-l3.js
    capstone.js         ← new
    learning-graph.js   ← new
    topic-lessons.js  master-topic-lab.js  researched-topic-pages.js

No template, layout, route or component was replaced. Two new data files, two
new render blocks, one new CSS section.

## What the brief asked for that was genuinely missing

Your lessons already had why-it-matters, intuition, worked examples, practice
with feedback, common-mistake callouts and quizzes — Steps 5, 7, 8, 13, 14 and
15 were largely in place. The real gaps were **connections between concepts**
and **a capstone**. That is what this adds.

### 1. "Before you start" — prerequisites (Step 4)

Every authored lesson now shows the concepts it assumes, as links, with a tick
against ones you have completed. ROIC, for instance, opens with: EBIT · Taxes ·
Equity · Debt.

70 lessons have prerequisite chains defined. Foundational lessons deliberately
have none. Verified: **0 dangling references, 0 circular prerequisites.**

### 2. "Where this fits" — concept chains (Steps 6, 16, 17)

Below each lesson, the sequence it belongs to, with the current step marked:

    How a sale becomes profit
    Revenue → Costs → Gross profit → EBITDA → EBIT → EBT → Taxes → Profit

Eight chains cover the mental maps a beginner needs: profit, profit-to-cash,
the balance sheet, time value, returns on capital, risk and debt, the three
statements, and where cash gets trapped. Every step is a link, so the learner
can jump back to anything they don't recognise.

### 3. Capstone (Step 12)

A new lesson — **"Value a company end to end"** — appears in the rail above
Café model labs. One fictional company, Bharat Kitchen Appliances, carried
through six steps in the order an analyst actually works:

    business → income statement → balance sheet → ratios → cash → valuation → decision

Each step's answer feeds the next. It ends with the question the whole
curriculum is for: *would you invest at ₹75 a share?* — with a model answer
that grades the **method**, not a single right answer.

The case is deliberately uncomfortable: the company reports ₹54 crore of profit
and produces ₹3 crore of free cash flow, and its ROIC of 13.9% barely clears a
12% cost of capital. A learner who finishes it has had to use working capital
days, ROIC, EBITDA multiples, enterprise vs equity value, and margin of safety
together.

## Also fixed

The capstone had no Previous/Next because it sits outside the 227-topic
sequence. It is now appended to the reading order, so it closes the journey.

## Validated

    scripts 49 · duplicates 0 · missing 0 · execution failures 0
    learning graph: 0 dangling references · 0 prerequisite cycles
    prerequisites, chain and current-step marker render on every sampled lesson
    capstone: 4 practice boxes · 4 case-figure blocks · working sandbox · 4 quizzes
    10 sampled lessons across Levels 0-3: invalid nesting 0 · empty paragraphs 0
    curriculum audit PASS — 11 levels, 227 topics, 99 authored/mapped

## Honest status against your brief

**Done:** beginner on-ramp (Levels 0-1), learning loop in every authored lesson,
prerequisites, concept chains, micro-quizzes with explanations, common-mistake
callouts, teaching sandboxes, Indian-context examples, capstone, "you are here"
path panel.

**Not done:** Levels 4-10 (128 topics) still have auto-generated placeholder
pages. That means the investing content of Step 10 — stocks, P/E, market cap,
diversification, index funds — and the modelling, valuation, PE/LBO and startup
finance strands are still scaffolding, not teaching. **No amount of structural
work substitutes for writing them.** Level 4 (Financial Modeling, 25 topics) is
the next batch.

Two things only you can do: check pixel alignment and mobile in a real browser,
and put the site in front of five actual beginners to see where they stop.
