# Step 2 done: three lessons ported, plus the porter

## The grid decision, since it was blocking

**Build it, staged.** Reasons, in order of weight:

1. The engine is already ours and is 16 KB. Bolting a 400 KB+ grid onto it to
   get selection rectangles inverts the weight of the product.
2. `mustFormula` grading, cell-level hints and the tie meter all need the grid
   to know about *lesson state*, not just cell state. With Univer that means
   fighting a plugin API; with our own grid it is a property on a cell.
3. Your design system is authored, not adapted. Overriding a third-party
   grid's styling to match it is the kind of work that is never quite done.

The staging is the part that matters: **a plain non-virtualized grid first.**
Every sandbox in the curriculum is under 25 rows. Virtualization is a
performance answer to a problem none of the current lessons have, and building
it early means debugging selection-during-scroll before knowing whether the
API is right. Non-virtualized first, virtualize when a lesson needs it.

## What was built this round

### The porter (`js/learn/port.js`)

Converts a v1 lesson object into the v2 schema: prose blocks, formulas, worked
examples, MCQs, and — the useful part — v1 sheet grids into v2 workbooks and v1
checks into v2 check specs. It does **not** invent content. What v1 never had,
it reports as a gap.

Run across all 38 lessons, it says:

```
Ported 38 lessons. Meeting the brief in full: 0

  38/38  explanation.beginner / intermediate / advanced   §42
  38/38  visualization                                    §12
  38/38  whyItMatters                                     §33
  38/38  commonMistakes                                   §34
  38/38  realWorld                                        §35
  38/38  takeaways                                        §36
  38/38  challenge                                        §2 MASTER
  38/38  prerequisites                                    §41
  38/38  practice tiers                                   §11
  32/38  practice variety                                 §10
   6/38  sandbox check (v1 custom closure can't cross)
```

That is the honest map of the remaining work on existing content. The
mechanical half is done and free; the authored half is roughly 2–3 hours per
lesson, ~100 hours for all 38.

### Three lessons hand-finished

`1620-liquidity`, `1330-balance-sheet`, `2240-dcf` — chosen because they are a
ratio lesson, a capstone with a tie check, and the hardest modelling lesson in
the curriculum. If the schema survives those three it will survive the rest.

Each now carries everything the brief asks for: three explanation levels, an
interactive visualization spec, worked example, why-it-matters, common
mistakes, real-world uses, all four practice tiers with a mix of question
types, the sandbox, a debugging challenge, and takeaways.

The `1330` lesson is one of the six whose v1 `custom` check could not be
carried across mechanically. Its tie check is rewritten as a v2 spec that
reports the *size* of the difference — which is the debugging clue the lesson
teaches.

### Tests — 116 assertions

`node tests/ported.test.mjs`. The important ones:

- **Every sandbox is solved** with the intended formulas and all checks pass.
- **Blank any answer cell** → a check must fail. (Catches a check that isn't
  actually testing anything.)
- **Hardcode the correct answer** in any answer cell → the check must still
  fail. §17, verified per cell rather than asserted once.
- The figures tie across lessons: liquidity's current assets equal the balance
  sheet's inventory + receivables + cash, computed from both workbooks.
- The DCF sandbox is a live model — raising WACC lowers enterprise value.
- **The anchor lesson is tested as a lesson:** filling `=1/(1+B2)^C5` across
  produces `=1/(1+D2)^E5` and a wrong factor; filling `=1/(1+$B$2)^C5` produces
  `=1/(1+$B$2)^E5` and the right one. The thing 2240 teaches is demonstrated
  by the engine, not just asserted in prose.
- Every practice question accepts its own intended answer.

## Two bugs the port found

Worth naming, because they are the reason this step existed.

**A duplicate key in my own reference lesson.** `ebitda.js` had `summary`
twice — the one-line blurb near the top and the §36 takeaways array at the
bottom. The second silently overwrote the first. Had thirty lessons been
authored against that shape first, thirty would have had to be edited. The
takeaways field is now `takeaways`.

**The level lookup was wrong.** The porter mapped module codes (`1600`) but
lessons carry lesson codes (`1620`), so every ported lesson silently defaulted
to `statements`. Liquidity is `analysis`; the DCF is `valuation`.

Neither would have been visible without porting real lessons. That is exactly
what the step was for.

## Two lessons still show one gap, on purpose

`ebitda` and `1330-balance-sheet` still report `prerequisites` as missing. That
is correct: their real prerequisites are lessons that have not been ported yet
(revenue, COGS, opex; modules 1100–1300). The test asserts prerequisites are
the *only* outstanding gap rather than silencing the report — a gap report you
switch off when it is inconvenient is not a gap report.

## Suite status

| Suite | Assertions |
|---|---|
| v1 engine (`tests/engine.test.html`) | 151 ✅ |
| v1 curriculum (`tests/lessons.test.html`) | 300 ✅ |
| v2 sheet engine | 175 ✅ |
| Learning architecture | 111 ✅ |
| Ported lessons | 116 ✅ |
| **Total** | **853 ✅** |

## Next

1. **Build the grid**, non-virtualized, against these three lessons. They
   exercise every feature it needs: SUM ranges, anchored fills across columns,
   a tie meter, per-cell hints, multiple number formats.
2. **Port the remaining 35** — mechanical part is one command, authored part is
   the ~100 hours above.
3. **Author Level 0.** Still the biggest hole in the product: there is nothing
   below the accounting equation, and "a beginner can learn finance here" lives
   or dies on it.
