# FinStudio learning architecture

## What's built

Three files, no dependencies, headless, tested. **110 assertions passing**
(`node tests/learn.test.mjs`). Nothing existing was touched: the 38 lessons,
451 v1 assertions and the 175 sheet-engine assertions are all still green.

| File | What it is |
|---|---|
| `js/learn/practice.js` | The practice engine. Ten question types, partial credit, progressive hints, three mastery tracks. |
| `js/learn/curriculum.js` | Schema validator, prerequisite graph, progress rollup, career paths, search, next-lesson recommendation. |
| `js/learn/lessons/ebitda.js` | One lesson authored end-to-end through the whole loop, as the shape every other lesson gets written against. |

### The practice engine (§9–§11, §17, §34)

All ten question types the brief asks for, and none of them are
multiple-choice-with-extra-steps:

`numeric` · `formula` · `mcq` · `multi` · `match` · `order` · `scenario` ·
`interpretation` · `debug` · `sheet`

Partial credit is where the teaching happens:

- Type `540000` where a formula was wanted → **0.5**, "Correct output, but you
  haven't built the calculation. Type it as a formula so it updates when the
  inputs change." That is §17, working.
- Type `=1560000-1020000` → fails, and names the cell it should have read.
- Type `30` where `30%` was wanted → **0.5**, flagged as a scale error rather
  than marked wrong.
- Get four of five scenario lines right → **0.8**, and it names the two to
  look at again.
- Point at the cell that *displays* the error rather than the cell that
  *causes* it → **0.5**, "that cell is wrong too, but it's wrong because of
  another one upstream."

Hints come one rung at a time and the worked solution only after the ladder is
exhausted (§34). Hints cost credit — solving cold scores 1.0, solving after
three hints scores 0.55 — so the progress numbers mean something.

`sheet` questions delegate to the v2 spreadsheet engine, so a hardcoded number
cannot pass a question whose point was the formula.

### The curriculum engine (§18–§20, §40–§41, §46, §48)

Lessons are data; everything else is derived from them:

- **Prerequisite graph** — full upstream chain, what a lesson unlocks,
  topological learning order, and **cycle detection** (a prerequisite loop
  makes the skill tree unrenderable and the recommender infinite; it's caught
  at author time).
- **Readiness** (§41) — lists which prerequisites are met, and is explicitly
  `blocking: false`. It warns; it never gates.
- **Progress** (§18) — three tracks, concept / practice / modelling, rolled up
  per level. A track never attempted reports `null`, not zero, so a lesson
  without a sandbox isn't held permanently incomplete.
- **Recommendation** (§6) — resume an unfinished lesson first, else the first
  ready unstarted one, else the first with gaps. Returns *why*.
- **Career paths** (§46) — six paths that automatically pull in prerequisites
  from other levels, in dependency order.
- **Search** (§20) — returns learn + practice + build for each hit, not just
  the article.
- **Validation** — §11 is enforced in code: a lesson with no practice problems
  is invalid and says so.

### The reference lesson

`ebitda.js` is the §8 template filled in properly: three difficulty levels of
explanation (§42), formula with variables, an interactive waterfall spec, a
worked example on the café's real FY25 numbers, six practice problems across
all four mandatory tiers (§11), a sandbox exercise with cell-level hints (§15),
a debugging challenge, why-it-matters (§33), three common mistakes (§34),
four real-world uses (§35) and a summary (§36).

Authoring a lesson is now filling in that object. No rendering code changes.

---

## The number you should look at before anything else

I counted the topics this brief names across its eleven levels.

**209 topics.**

Each one, per your own §8/§11/§33–36/§42, needs: three explanation levels, a
formula, an interactive visualization, a worked example, at least four practice
problems, why-it-matters, common mistakes, real-world context, and a summary.

The EBITDA lesson above took me a focused pass to write, and it is the *easy*
kind — a concept I can state precisely with numbers that already exist in your
dataset. Verified finance content at that depth runs 3–6 hours per topic once
you include checking the arithmetic and writing distractors that teach.

| At | Hours | Weeks at 35h |
|---|---|---|
| 3h/topic | 627 | ~18 |
| 4h/topic | 836 | ~24 |
| 6h/topic | 1,254 | ~36 |

**That is the product.** Not the design system, not the spreadsheet engine, not
the skill tree. Those are all real work and I've now built most of them, but
they are the container. FinStudio becomes the best place to learn finance on
the strength of 209 well-written lessons, and there is no architecture that
shortcuts writing them.

The good news is that the architecture now makes that work *additive*: every
lesson you author lights up the skill tree, the search index, the progress
rollup and the career paths without further code.

---

## What I'd actually do next, in order

You have four briefs in flight and one unanswered question that blocks two of
them. My honest sequencing:

1. **Answer the grid question** (build vs adopt, from the last session). The
   spreadsheet UI is the single biggest remaining code item and it's stalled.
2. **Port three existing lessons** onto the v2 engine and this schema —
   `1620-liquidity`, `1330-balance-sheet`, `2240-dcf`. Three is enough to find
   the schema's flaws while they're still cheap to fix.
3. **Author ten Level-0 lessons.** You have nothing below the accounting
   equation right now, and §7's Level 0 is where the "beginner can learn
   without external resources" claim lives or dies.
4. **Then** build the dashboard, skill tree and onboarding. Every one of them
   is a view over data that already works — and they'll look empty and sad
   against 38 lessons, but convincing against 60.

Building the dashboard before there is a curriculum to put in it is the
appealing mistake here. The engine renders progress fine; it just needs
something to be progress *through*.

---

## Not built

The UI for any of this. No dashboard, no skill tree, no practice widgets, no
split-screen learn-and-build layout, no onboarding flow. The engines expose
everything those need and are tested; none of it is drawn.

Also not built: the AI tutor (§16). It needs a serverless function — never an
API key in a static client — and it should come after the hint ladder has been
used by real learners, because the deterministic hints in `practice.js` already
handle the common cases and are free, instant and never wrong.
