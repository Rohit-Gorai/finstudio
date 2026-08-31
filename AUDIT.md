# FinStudio — site audit and fixes

Measured against the live repo at commit `003d056`, driving Chromium across
ten routes at desktop and mobile.

---

## 1. The site is currently broken. This is the whole story.

**26 requests fail on every single page.** `index.html` asks for twelve scripts
and one stylesheet that do not exist in the repo:

```
MISSING  js/sheets/engine.js          MISSING  js/learn/grid.js
MISSING  js/learn/practice.js         MISSING  js/learn/render.js
MISSING  js/learn/curriculum.js       MISSING  js/learn/lessons/  (7 files)
MISSING  css/learn.css
```

The last upload flattened the folders again — `grid.js`, `render.js`,
`practice.js`, `curriculum.js`, `level0-*.js`, `ebitda.js` and `2240-dcf.js`
are all sitting at the **repo root** while `index.html` points at `js/learn/`.
Two files (`1620-liquidity.js`, `1330-balance-sheet.js`) never arrived at all.

Consequences on the live site right now:

- `#/learn/anything` silently renders the homepage
- All 22 Level 0 lessons are unreachable
- The spreadsheet sandbox does not exist
- The mobile header fix from the previous session was never deployed either

**This is the third time folder structure has been lost to the web uploader.**
`deploy.sh` in this folder does it with `git` instead. That is the single
highest-value change you can make to your workflow.

---

## 2. Every topic lab printed the same sentence three times

Measured across eight labs: **6 paragraphs, 4 unique** — every one.

`advanced-topics.js` used `topic.example` as the page lede, as the body of
"What is X?", **and** as the body of "Example". One sentence doing triple duty,
which is why the labs read as filler even though the underlying calculators are
genuinely good.

**Fixed.** The duplicated sections are gone; measured after: 0 of 5 labs
duplicate anything.

---

## 3. The "See It" chart was decoration pretending to be a visualization

The bars were five hardcoded inline heights — `30% 55% 80% 65% 95%` — identical
on all 38 labs and unaffected by any input. A learner changing the yield on a
bond watched a chart that could not respond.

**Fixed.** It now sweeps the first driver from half to double its value, runs
the topic's real `calc()` at each point, and plots the results, anchored to the
default-input result so both shape and level move.

Verified on the bonds lab:

```
start        bars 32,43,54,76,98   price  92.42
yield 10→4   bars 38,52,66,94,100  price 117.81
face 100→200 bars 66,94,100,100,100 price 235.61
```

My first attempt normalised each sweep to its own min/max, which made the chart
mathematically invariant for any model linear in the swept driver — it looked
alive and wasn't. Worth knowing, because that is the easy version of this bug.

---

## 4. A correction to something I told you

I initially reported that "184 of 227 topics get a fake sandbox computing
`start × (1 + driverA% + driverB%)`". **That was wrong** and I want to correct
it explicitly rather than quietly.

That code is in `js/master-topic-lab.js`, which **is not loaded by
`index.html`** — it is dead code. The 184 unwritten topics were not showing a
fake calculator; they were plain unclickable text. The real duplication problem
was in `advanced-topics.js`, which is what item 2 fixes.

I have repaired `master-topic-lab.js` anyway and wired it in, because it now
does something useful: route a roadmap topic to its authored lesson.

---

## 5. The curriculum matrix claimed everything was finished

`#/curriculum/matrix` rendered "Yes / Yes / Yes" for Exists, Lesson and
Practice on all 227 rows. A quality-control page asserting completeness that
did not exist.

**Fixed.** It now reports what is true:

> 43 of 227 roadmap topics have a written lesson. 41 have a calculator only,
> and 143 have not been written yet.

---

## 6. The roadmap told you nothing about what was ready

Every module carried the same badge — "Roadmap · lessons to build" — whether it
had 15 finished lessons or none, and topics were unclickable text.

**Fixed.** Topics now link to their authored lesson where one exists, and
badges read the real state: `✓ All 15 written`, `3 of 11 written`,
`Planned · not written yet`. Level 0 shows all 22 topics as links.

---

## 7. An unwritten topic now says so

Instead of a dead link or a generic calculator, a topic that has not been
written shows an honest placeholder that names the level it is planned for and
lists what *is* ready to read. No fake interactivity.

---

## Smaller fixes applied

- Restored the mobile header correction that never deployed (header 100px → 75px,
  CTA no longer wrapping onto three lines, primary button no longer underlined)
- Reading measure capped at 68ch — the curriculum page was running to 120
  characters a line
- Touch targets raised to 44px on coarse pointers

## After all fixes

```
pages checked: 10 | broken requests: 0 | js errors: 0
mobile home / curriculum / lesson — overflow 0, header 75px
```

---

## What I did not fix, and would do next

1. **143 topics still unwritten.** No shortcut. The coverage gate keeps the
   number honest; Level 1 (Accounting, 21 topics) is the natural next block and
   your existing 38 v1 lessons cover much of it already.
2. **The 41 calculator-only labs have no explanation.** They have a formula, a
   working model and no prose — one line each. They need the Level 0 treatment:
   why it matters, common mistakes, practice tiers.
3. **The sidebar shows all 11 levels at once**, which is a long scroll. It
   should collapse to the current level.
4. **No search.** Typing "EBITDA" should find the lesson, the glossary entry and
   the practice problem. The curriculum engine already indexes this; the UI
   doesn't exist.
