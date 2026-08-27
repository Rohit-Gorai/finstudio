# Level 0 is finished. Here is what that means and what it cost.

## The headline

**Level 0 — Finance Foundations — is 100% covered. 22 of 22 topics.**

Every one of those topics has a lesson carrying: three explanation levels, a
worked example, why-it-matters, common mistakes, real-world career context,
four practice tiers, a **sandbox exercise on the real spreadsheet engine**, a
debugging or reasoning challenge, and end-of-lesson takeaways.

```
  L0  ██████████ 100%   22/22  Finance Foundations
  L1  ░░░░░░░░░░   5%    1/21  Accounting Foundations
  L2  ██░░░░░░░░  18%    6/33  Financial Statements
  L3  █░░░░░░░░░  11%    2/18  Financial Analysis
  L4  █░░░░░░░░░  10%    3/29  Financial Modeling
  L5  ███░░░░░░░  25%    7/28  Valuation
  L6–L10                 0/76

  TOTAL ██░░░░░░░░ 18%   41/227 topics
```

That counter is produced by `tests/coverage.test.mjs`, which reads the roadmap
the site actually publishes and checks it against the authored lessons. It is
not a claim; it is a build output.

## Your two requirements, made enforceable

**"A practice problem for each topic without any fail."** The coverage gate
refuses to count a topic as covered unless its lesson has all four practice
tiers *and* a sandbox exercise with checks. A lesson that is explanation-only
does not register, however good the prose is.

**"That one can practice it in our Excel-level sandbox."** Every sandbox is
verified two ways on every run:

```
Sandboxes verified solvable: 26
Guarded cells tested: 132
Hardcoding the right answer passed anyway: 0
Blanking a cell left every check passing: 0
```

The first line means each sandbox is solved with its intended formulas and all
checks pass — no exercise ships that cannot actually be completed. The rest is
mutation testing: for all 132 answer cells, typing the *correct number* instead
of the formula is rejected, and blanking any cell breaks at least one check.
There are no holes.

## What the content actually is

Roughly **40,000 words** across 26 lessons, 3,000 lines for Level 0 alone.

Written for someone who has never opened a financial statement — a tea stall, a
salary, a savings account — before the café's lakhs arrive in Level 1. The
sandboxes build real things:

- **Bank or cart?** — return on capital versus a safe rate
- **Break-even** — contribution per cup, fixed costs, the volume needed to survive
- **From profit to cash** — the bridge that explains why a profitable year drained ₹1,00,000
- **Simple against compound** — the ^ operator, and a ₹3,72,750 gap after 20 years
- **Nominal against real** — savings that double in rupees while buying 264 fewer cups
- **Should Anil buy the cart?** — discount factors, present values, NPV, and the rate at which the decision flips
- **What is the café really earning?** — economic profit after charging for capital and forgone salary

Two design choices worth flagging. Anchored references (`$B$2`) are introduced
in Level 0, in the interest and time-value sandboxes, because that is the skill
the DCF lesson in Level 5 tests — three of the Level 0 challenges are debugging
problems about a reference that drifted when filled. And every sandbox
"success" line ends by telling the learner which input to change, so the sheet
is used as a model rather than a worksheet.

## The honest arithmetic on the rest

186 topics remain. At the depth above — and these took real time to write and
verify — that is **550–1,100 hours** of authoring. There is no architecture
that shortcuts it, and I would rather say so than deliver 227 thin topics that
technically satisfy a counter.

What is now true that was not before: the work is **additive and gated**. Each
new lesson lights up the roadmap, the search index, the prerequisite graph and
the progress rollup with no code change, and cannot ship broken because the
coverage and hardcode gates run on every commit.

## Suggested order for the rest

1. **Level 1, Accounting Foundations (21 topics).** It is the direct
   continuation and the existing 38 v1 lessons already cover much of the
   ground — the porter lifts them mechanically, leaving only the authored
   sections.
2. **Level 3, Financial Analysis (18).** Mostly ratios, which are the fastest
   topics to write well and the most sandbox-friendly.
3. **Level 2, Financial Statements (33).** Largest, but 6 are already done.
4. Levels 4–5 next; 6–10 last, since they presume everything above.

## One thing still blocking all of it

None of this is wired into the live site. `js/learn/`, `js/sheets/` and these
lessons are not referenced by `index.html`, and the last upload flattened
several of them to the repo root. Until that commit happens, the coverage
number is real and invisible.
