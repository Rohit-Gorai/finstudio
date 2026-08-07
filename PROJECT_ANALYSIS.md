# FinSchool — Project Analysis

**Milestone 1 deliverable.** An audit of the repository as it stands on `main`
(commit `6483383`), written before any refactoring, to establish what exists,
what is worth keeping, and what must change to reach the FinSchool brief.

---

## 1. Current architecture

A **fully buildless static site.** No package manager, no bundler, no framework,
no CI. `index.html` loads 16 plain `<script>` tags and the app boots from global
state on `window.LS`.

```
index.html          73 lines   shell: <head>, sidebar mount, <main>, 16 script tags
css/site.css       822 lines   the entire design system (CSS custom properties)
js/engine.js       452 lines   spreadsheet: tokenizer → parser → evaluator → checks
js/app.js          856 lines   hash router, sidebar, progress store, 12 block renderers
js/quizzes.js      179 lines   9 module quizzes + renderer
js/reference.js    269 lines   4 reference pages + renderer
js/sharecard.js    122 lines   canvas-drawn completion PNG
js/lessons/
  company.js       231 lines   Bombay Bean Coffee Co. — single source of truth
  manifest.js       73 lines   level → module → lesson ordering
  m1000…m2200.js  2002 lines   38 lessons as data objects
tests/*.test.html  716 lines   371 assertions, run in-browser, no runner
```

**Total: ~6,450 lines of hand-written code.** Zero dependencies. Zero
`node_modules`.

### How it works

- **Routing** — `location.hash` parsed into `{kind, id}`; four kinds (`lesson`,
  `module`, `quiz`, `ref`). A `hashchange` listener re-renders `<main>`.
- **Content as data** — a lesson is a plain object with a `body` array of typed
  blocks (`def`, `formula`, `example`, `where`, `sheet`, `mcq`, `classify`,
  `compare`, `table`, `svg`…). `app.js` holds a `blockRenderers` map keyed by
  `t`. Adding a lesson touches exactly two files and no rendering code.
- **The spreadsheet engine** — a real recursive-descent parser (not regex
  substitution): tokenizer → `compare → add → mul → pow → unary → postfix →
  primary`. Supports cell refs, `$` anchors, ranges, 7 functions, comparison
  operators, cycle detection via a visiting set, and `#DIV/0!`/`#CYCLE!`/`#REF!`
  error propagation.
- **Answer checking** — declarative. `{cell, expect, tol, mustFormula, mustUse}`
  or `{custom: sheet => true | "why it failed"}`. `mustFormula` inspects the raw
  string, so a learner cannot pass by typing the answer where the formula is the
  lesson.
- **State** — `localStorage` behind a try/catch that degrades to an in-memory
  object. No accounts, no backend, no network calls except Google Fonts.

---

## 2. Strengths — what must survive any refactor

These are genuine assets. Rewriting the stack must not discard them.

| Asset | Why it matters |
|---|---|
| **The check system with `mustFormula`** | The pedagogical core. It distinguishes *knowing the answer* from *knowing the formula* — the single thing that separates this from a quiz site. |
| **One coherent company** | 38 lessons share one dataset. PAT ₹1,80,000 in the P&L capstone is the same figure inside the balance sheet's retained earnings; closing cash ₹1,00,000 is the same cash line. `company.js` carries a `verify()` self-audit that proves it. **This is very hard to rebuild and trivial to break.** |
| **371 passing assertions** | `lessons.test.html` solves every sandbox with the intended formulas and asserts all checks pass, then **mutation-tests** each cell (blank it → a check must fail). It caught two real finance errors during the build. |
| **Content/render separation** | Lessons are data, not markup. This is exactly the shape MDX-or-not both want, and it ports cleanly to React. |
| **The tie meter** | Live A − (L+E) feedback. Distinctive, and correct. |
| **Accessibility baseline** | Every palette pair ≥ 4.5:1, full keyboard grid navigation, `aria-live` on results, verified clean across 7 routes. |

---

## 3. Weaknesses

### 3.1 Performance — the most serious defect

**Every visitor downloads the entire curriculum to read one lesson.**

- 16 blocking script requests on first paint
- ~400 KB of JS/CSS parsed before anything renders
- All 38 lessons, 9 quizzes and 4 reference pages are in memory always
- No code splitting, no lazy loading, no minification, no compression control

This scales linearly with the curriculum. At the ~150 lessons the FinSchool
sidebar implies, the payload would exceed **1.5 MB** and Lighthouse would fall
well short of the >95 target. **This alone justifies adopting a bundler.**

### 3.2 SEO — structurally broken for a content platform

- **Hash routing means one indexable URL.** `#/1330-balance-sheet` is never sent
  to the server. Every lesson shares `/`'s canonical identity.
- `document.title` and `<meta description>` are set at runtime — crawlers that
  don't execute JS see the shell's defaults.
- **Missing entirely:** Twitter Cards, `rel=canonical`, Schema.org JSON-LD
  (`Course`, `LearningResource`, `FAQPage`), breadcrumbs, `sitemap.xml`,
  `robots.txt`, `og:image`.
- Only 4 meta tags exist site-wide.

For a platform whose whole distribution model is organic search — W3Schools
lives on it — this is the difference between working and not.

### 3.3 Scalability of authoring

- Lessons are **JS objects containing HTML strings**. A typo breaks the file
  silently; no schema validation, no type checking, no editor support.
- Every lesson lives in one of 9 monolithic module files (up to 312 lines each).
- Non-technical contributors cannot write a lesson.
- No content model for the FinSchool brief's richer structure (prerequisites,
  learning objectives, common mistakes, interview questions).

### 3.4 Technical debt

| Item | Location | Severity |
|---|---|---|
| Global `window.LS` namespace, load-order dependent | all files | Medium — reordering scripts silently breaks it |
| `app.js` is 856 lines doing routing + rendering + state + DOM | `js/app.js` | High — the main refactor target |
| Lesson HTML built by string concatenation | `app.js` renderers | Medium — XSS-safe only because content is authored, not user-supplied |
| Test solutions duplicated in `tests/lessons.test.html` | tests | Low — deliberate; it's the forcing function that guarantees solvability |
| No linting, formatting, or type checking | — | Medium |
| Sheet `id` collision risk (`sheet0`, `sheet1` fallback) | `app.js` `requiredItems` | Low |

### 3.5 Feature gaps against the FinSchool brief

Present: lessons, sandboxes, checks, MCQs, module quizzes, reference, progress.

**Absent:** search · XP/badges/streaks/certificates · lesson-level quizzes ·
prerequisites & learning objectives · common mistakes · interview questions ·
Excel-grade sandbox (drag-fill, copy/paste, formatting, charts, named ranges,
`XLOOKUP`/`INDEX`/`MATCH`/`PMT`/`NPV`/`IRR`) · model playground · AI tutor ·
the Excel and Projects curriculum tracks.

---

## 4. Accessibility

Better than typical, with real gaps at the interaction layer.

**Passing:** WCAG AA contrast on every palette pair (fixed during the build —
`--ink-faint` and `--amber` were at 2.7–3.2:1) · single `h1`, no heading jumps ·
every cell input `aria-label`led with address and row · `prefers-reduced-motion`
· skip link · `aria-live` on the tie meter and check results · Escape closes the
mobile nav and restores focus.

**Gaps:**

1. **The grid is not a real ARIA grid.** `role="grid"` is on the table but there
   are no `role="row"`/`role="gridcell"`, no `aria-rowindex`/`aria-colindex`.
   Screen readers announce cells without spatial context.
2. **Route changes are not announced.** Focus moves to `<main>` but there is no
   live-region announcement of the new lesson.
3. **No focus trap** in the mobile sidebar (Escape works; Tab can still escape).
4. **Errors are colour-coded** — `.cell-ok`/`.cell-bad` change background only;
   the ✓/✗ text carries the meaning, but the cells themselves don't.
5. **Canvas share card** has an `aria-label` but the text within is unreadable.

---

## 5. Recommended architecture

The brief specifies React + Vite + TypeScript + Tailwind + React Router + shadcn
+ MDX. That is the right call **for the reasons in §3.1–3.3**, not merely as
preference: code splitting fixes the payload, static generation fixes SEO, and
typed content models fix authoring.

### Proposed structure

```
src/
  app/          router, layout shells, providers
  components/   ui/ (shadcn) · lesson/ (block renderers) · sheet/ · quiz/
  content/
    lessons/    MDX or typed .ts per lesson — one file each, never monolithic
    company/    the dataset + verify()  ← port verbatim, it is load-bearing
  engine/       spreadsheet: parser, evaluator, formats, checks (ported + typed)
  lib/          progress, search index, xp, seo helpers
  styles/       tailwind config + design tokens
tests/          vitest (unit) + the existing solvability/mutation suite
```

### Migration order (protects the assets in §2)

1. **Port `company.js` and its `verify()` first, with tests.** Everything else
   depends on it being correct.
2. **Port the engine to TypeScript**, keeping the 151 assertions green. Add the
   FinSchool functions (`XLOOKUP`, `INDEX`, `MATCH`, `SUMIFS`, `COUNTIFS`,
   `PMT`, `NPV`, `IRR`, `XIRR`) **as additions, not a replacement**.
3. **Port the block renderers to components**, one per block type.
4. **Port lessons last**, converting objects → MDX/typed files mechanically, and
   re-run the solvability + mutation suite. It is the safety net for the whole
   migration.

### Three findings that change the plan

**① HyperFormula is GPLv3 — it would relicense this project.**
HyperFormula is dual-licensed: GPLv3, or a paid commercial licence. Importing it
into an MIT-licensed project forces the whole work to GPLv3. Given the brief also
says *"Everything free to use"*, this is a real conflict.
**Recommendation:** extend the existing engine instead. It already parses, has
cycle detection, and passes 151 tests; the missing functions are additive work,
not architecture. This also keeps the bundle small and keeps `mustFormula` — a
third-party engine has no concept of "the answer must be a formula", which is
the platform's whole pedagogical hook. *(Univer is Apache-2.0 and Luckysheet MIT,
so the UI layer is unencumbered if a richer grid is wanted later.)*

**② An AI tutor needs a server; this site has none.**
Calling an LLM from a static page means shipping an API key to the browser.
**Recommendation:** two-stage. Ship a **rules-based tutor** now — the check
system already produces diagnostic messages ("has the right value, but type it
as a formula"), and mis-formula patterns (wrong range, off-by-one row, sign
flip, hardcode) can be detected deterministically and explained. Add a real LLM
tutor later behind a serverless function, as an enhancement, not a dependency.

**③ Deployment currently has no build step, and there is no push access.**
This repo is being updated by drag-and-drop through GitHub's web UI. A Vite app
cannot be deployed that way.
**Recommendation:** add a GitHub Actions workflow that runs
`npm ci && npm run build` and publishes `dist/` to Pages. Actions already works
on this repo (the `build` job passed). This removes the need for any local
toolchain and is a prerequisite for milestone 2, not an afterthought.

---

## 6. Design system change

The brief replaces the ledger-paper identity (`#FBF9F3` paper, Fraunces, chart-of-
accounts numbering) with a clean W3Schools-like system (`#FFFFFF`, Inter,
`#2563EB`). That is a defensible, more conventional choice and it will be
implemented as specified.

Worth stating once: the ledger aesthetic and the tie meter were the product's
visual differentiators. **Recommendation:** adopt Inter, the blue palette and the
800px measure wholesale, but keep two things — the **chart-of-accounts lesson
numbering** (it is genuinely useful information architecture) and the **tie
meter's ledger styling inside the sandbox**, where a ledger look is a functional
signal rather than decoration.

---

## 7. Milestone plan

| # | Milestone | Key risk |
|---|---|---|
| 1 | **Repository analysis** ✅ *(this document)* | — |
| 2 | Toolchain + design system (Vite/TS/Tailwind/shadcn, Inter, tokens, **Pages Actions workflow**) | Deployment must keep working |
| 3 | Navigation + layout (3-column, sidebar tree, search) | — |
| 4 | Lesson engine (typed content model, 16-section template, block components) | Must not lose `mustFormula` |
| 5 | Excel sandbox (port engine to TS, add functions, fill-drag, copy/paste, formatting) | Keep 151 assertions green |
| 6 | Model playground (IS/CF/BS/3-statement/DCF/Comps/LBO) | Reuse `company.js` |
| 7 | Tutor (rules-based; LLM later behind a function) | No API key in the client |
| 8 | Quiz engine + XP/badges/streaks/certificates | — |
| 9 | SEO (static generation, Schema.org, sitemap, canonical, OG images) | Requires real URLs, not hashes |
| 10 | Production optimisation (Lighthouse >95, code splitting, images) | — |

**Content strategy:** the 38 existing lessons already cover Financial Statements,
Ratios, 3-Statement Linking and Valuation to a high standard. They map onto the
FinSchool sidebar with renumbering rather than rewriting. Per the brief, build
the engine and templates first, port these 38 as the quality benchmark, then
expand into Introduction, Excel, Projects and Interviews module by module.

---

## 8. Immediate priorities

1. **Actions-based Pages deploy** — unblocks everything; without it a built app
   cannot ship from this repo.
2. **Port and test `company.js`** — the highest-value, most fragile asset.
3. **SEO-capable routing** — real paths, not hashes. This is architectural and
   cannot be retrofitted cheaply.
4. **Code splitting** — the payload problem compounds with every lesson added.
