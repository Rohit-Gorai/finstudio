# FinStudio — repository audit and implementation plan

Audited against `github.com/rohit-gorai/finstudio` @ `820e71e` and the live site at
`rohit-gorai.github.io/finstudio/`, on 24 August 2026. Everything below is from the
actual files, not from the two planning documents already in the repo — where I
disagree with those documents I say so.

---

## 1. Current architecture

A **buildless static site**. `index.html` loads 16 blocking `<script>` tags; every
module attaches itself to a global `window.LS`. No bundler, no framework, no
dependencies at runtime. Google Fonts is the only network call.

```
index.html            shell + 16 script tags
css/site.css   26 KB  the entire design system (CSS custom properties)
js/engine.js  466 ln  spreadsheet: tokenizer → parser → evaluator → checks
js/app.js     980 ln  hash router, sidebar, progress store, 14 block renderers
js/glossary.js 348 ln 74 terms   js/glossary-ui.js  in-place term popovers
js/quizzes.js 179 ln  9 module quizzes
js/reference.js 269   4 reference pages
js/sharecard.js       canvas-drawn completion PNG
js/lessons/           manifest.js + company.js + m1000…m2200 (38 lessons)
tests/                371 in-browser assertions, no test runner
```

**Content scale today:** 38 lessons · 9 modules · 2 levels · 35 sandboxes ·
192 learner-filled cells · 9 quizzes · 74 glossary terms · 4 reference pages.

## 2. Framework

None, deliberately. Alongside it sits a **half-built Vite + React 19 + TypeScript +
Tailwind v4 scaffold** (`src/`, `package.json`, `vite.config.ts`) that has never been
deployed and currently renders only a homepage, a style guide and a 404. The v2 entry
is `app.html` specifically so it doesn't collide with the live `index.html`.

So the repo is mid-migration, and the migration is stalled at roughly 5%.

## 3. Routing

`location.hash` → `{kind, id}`, five kinds: `home`, `module/<id>`, `quiz/<id>`,
`ref/<id>`, `glossary`, and a bare `#/<lesson-id>` fallback. A `hashchange` listener
re-renders `<main>`.

The React scaffold uses `createBrowserRouter` with real paths — the two routing models
are incompatible, which is why the flip has to be a single deliberate cutover.

## 4. Lesson system

The best thing in the repository. A lesson is a plain data object with a `body` array
of typed blocks; `app.js` holds a `blockRenderers` map keyed by `b.t`:

`p · def · formula · example · where · note · svg · table · sheet · mcq · classify · compare`

Answer checking is declarative — `{cell, expect, tol, mustFormula, mustUse}` or
`{custom: sheet => true | "why it failed"}`. **`mustFormula` is the pedagogical core:**
it inspects the raw string, so typing the right number where the formula is the lesson
fails. Adding a lesson touches two files and no rendering code.

`company.js` (Bombay Bean Coffee Co.) is one dataset threaded through all 38 lessons
with a `verify()` self-audit: PAT ₹1,80,000 appears identically in the P&L capstone and
in retained earnings; closing cash ₹1,00,000 is the balance sheet's cash line; the sheet
ties at ₹19,50,000. This is hard to rebuild and trivial to break.

## 5. Styling system

`css/site.css`, 26 KB, custom properties, no preprocessor. Ledger-paper identity:
`#FBF9F3` surface, Fraunces headings, Public Sans body, IBM Plex Mono for numbers.
Contrast passes AA. Colour tokens exist; **spacing is ad-hoc rem values** — there is no
spacing scale, which is the one real gap in the token set.

## 6. Reusable components

Worth carrying into any rewrite, in priority order:

1. **The check system** (`mustFormula` / `mustUse` / `custom`) — the differentiator
2. **`company.js` + `verify()`** — the coherence guarantee
3. **The formula engine** — recursive-descent, not regex; `$` anchors, ranges, cycle
   detection, `#DIV/0!`/`#CYCLE!`/`#REF!` propagation, en-IN formatting
4. **The block-renderer map** — content/render separation, ports to React unchanged
5. **The 371 assertions** — `lessons.test.html` solves every sandbox with the intended
   formulas, then mutation-tests each cell (blank it, a check must fail). This is the
   safety net that makes any refactor survivable
6. **The tie meter** — live `A − (L+E)`, distinctive and correct
7. **Glossary popovers** — open in place without leaving the lesson

## 7. Strengths

- The pedagogy is already right. Learn → build → check, with the formula enforced.
- Content is data, not markup — the shape every future feature needs.
- Accessibility baseline is real: AA contrast, keyboard grid, `aria-live`, reduced motion.
- Zero dependencies means zero supply-chain and zero rot.
- The tests caught two genuine finance errors during the original build.

## 8. Weaknesses

**Structural**

| # | Defect | Evidence |
|---|---|---|
| 1 | **Hash routing = one indexable URL** | I fetched `#/1620-liquidity` as a crawler would: the response contains the header, footer and copyright — **zero lesson content**. For a platform whose distribution model is organic search, this is the difference between existing and not. |
| 2 | **Whole curriculum loads to read one lesson** | 16 blocking scripts, ~400 KB. Linear in curriculum size; at 150 lessons it exceeds 1.5 MB. |
| 3 | No `sitemap.xml`, `robots.txt`, canonical, JSON-LD, `og:image` | 4 meta tags site-wide. |
| 4 | `app.js` does routing + rendering + state + DOM in 980 lines | The main refactor target. |
| 5 | Lessons are JS objects containing HTML strings | A typo fails silently; no schema, no types, non-technical authoring impossible. |

**Repo hygiene — all introduced by drag-and-drop upload, all fixable in one commit**

The entire history is a single commit, `Add files via upload`. That flattened the
directory structure, and the damage is specific:

| # | Problem | Consequence |
|---|---|---|
| 6 | **Stale duplicates of every JS file at repo root** (`app.js`, `engine.js`, `m1000.js`…, `site.css`) | Not loaded by `index.html`, and an older generation — root `app.js` has **zero** glossary references vs. 9 in `js/app.js`. ~250 KB of code that looks live and isn't. This is how you eventually edit the wrong file. |
| 7 | **`deploy.yml` sits at repo root**, not `.github/workflows/` | The Actions workflow is inert. Nothing can be built or deployed. |
| 8 | **`.gitignore` was uploaded as a file literally named `download`** | `node_modules/` is not ignored. The moment you run `npm install`, you risk committing it. |
| 9 | Root-level `.tsx` files duplicating `src/` | Same trap as #6. |
| 10 | `404.html` links point to `/` and `/#/1010-five-buckets` | Absolute paths, but the site is served from `/finstudio/`. Every 404 recovery link lands on the wrong site. |
| 11 | `vite.config.ts` base is `/finschool/`; `package.json` name is `finschool` | Repo is `finstudio`. Build would emit wrong asset URLs unless `VITE_BASE` is set. |
| 12 | Root `engine.test.html` / `lessons.test.html` reference `../js/…` | Broken from root; only the `tests/` copies work. |

**Feature gaps vs. the brief**

No search · no standalone calculators · no learning paths or "where should I start" ·
no knowledge graph / related concepts · no difficulty or prerequisite metadata ·
no formula library as a browsable object · curriculum covers 4 of the ~18 domains named
in the brief.

## 9. Recommended information architecture

The brief asks for a knowledge graph. The cheapest way there is to stop treating the
lesson as the atomic unit and make **the concept** the atom:

```
Concept  (EBITDA, Working Capital, WACC…)
  ├─ id, title, one-sentence definition
  ├─ explanations: { simple, finance, professional }   ← §4 of the brief, as data
  ├─ formula ref → Formula Library
  ├─ glossary ref → Glossary
  ├─ prerequisites: [conceptId]        ┐ these two arrays
  ├─ leadsTo:       [conceptId]        ┘ ARE the knowledge graph
  ├─ appearsIn:     [lessonId]
  ├─ sandbox:       workbookId | null
  └─ externalRefs:  [{title, source, url, type, difficulty, free, checked, note}]
```

Lessons, pathways, quizzes, calculators and search results then all become *views over
the same concept set*, rather than parallel content stores that drift apart. Related
concepts, "continue exploring", prerequisite gating and personalised paths all fall out
of `prerequisites`/`leadsTo` for free — no extra content authoring.

Three decisions that matter more than they look:

- **Keep the chart-of-accounts numbering** (`1620-liquidity`). It is genuinely good IA
  and it is already your URL space. Don't renumber; you'd break every link you've shared.
- **Route shape:** `/lesson/1620-liquidity`, `/concept/working-capital`,
  `/glossary/ebitda`, `/formula/roic`, `/lab/dcf`, `/path/analyst`. Real paths, one page
  per indexable thing.
- **`externalRefs` is data, not prose.** That is what makes §6–§8 of the brief
  (the knowledge engine, "Learn More") implementable without recreating the internet —
  and it gives you a single place to run a link-rot check.

## 10. Recommended design system

Keep the ledger-paper identity. `PROJECT_ANALYSIS.md` recommends replacing it with
white/Inter/blue; I'd push back. The ledger surface and the tie meter are the only
things about this site that a visitor could not describe as "another course site," and
the brief itself says preserve the identity and evolve it. What's actually missing is
not a new palette — it's structure:

- **Spacing scale** — 4/8/12/16/24/32/48/64/96, as tokens. This is the single biggest
  visual-quality win available and it's a day's work.
- **Type scale** — one ratio (1.25), body to 17px, `clamp()` for fluid headings.
- **Semantic colour roles** — `positive` / `negative` / `warning` / `info` / `advanced`,
  never the sole carrier of meaning: pair with an icon, a sign, or a label.
- **Elevation and radius tokens** — three levels each, no ad-hoc shadows.
- **Motion tokens** — 120/200/320ms, one easing curve, all gated on
  `prefers-reduced-motion`. The brief's §29 constraint ("motion answers *what changed*")
  is best enforced by having only three durations available to reach for.
- **A component inventory** that already exists implicitly in `site.css`: card, callout,
  formula block, sheet, tie meter, quiz option, glossary popover, sidebar item, badge.
  Name them, document them on a `/style-guide` route, and the design system exists.

## 11. The Excel sandbox — the honest sizing

This deserves its own section because the second brief is, as written, larger than
everything else combined. Its acceptance test lists 45 items including pivot tables,
charts, conditional formatting, data validation, xlsx import/export and freeze panes.
That is not a feature list; **that is Univer, LibreOffice Calc, or Handsontable** —
each of which represents many engineer-years.

Recommended: **two tiers behind one interface.**

**Tier 1 — Practice Sheet (evolve what you have).** The existing engine, extended.
Small grids, instant, ~20 KB, graded, `mustFormula` intact. This backs all 38 existing
lessons and every future graded exercise. Extend in this order: function library from 7
to ~40 finance-relevant functions (`IF/AND/OR/IFERROR/SUMIF(S)/COUNTIF(S)/XLOOKUP/INDEX/
MATCH/ROUND family/EOMONTH/PMT/PV/FV/NPV/IRR/XNPV/XIRR`), then fill-drag with reference
shifting, then number formats, then cross-sheet references.

**Tier 2 — FinStudio Excel Lab (buy, don't build).** A real workbook environment,
lazy-loaded *only* on Lab routes so it never touches a lesson's payload. Do not
hand-build pivot tables and charts.

On the library choice, two corrections to what's in `FINSTUDIO_PLAN.md`:

- The claim that "no third-party engine can express `mustFormula`" is **not right**.
  HyperFormula exposes the raw formula string via `getCellFormula`, and Univer exposes
  cell `f` values — `mustFormula` is implementable on either. Don't reject a library for
  that reason.
- The reason to be careful with **HyperFormula is licensing, and that reason is real**:
  it is dual-licensed GPLv3 or proprietary. GPLv3 would require releasing FinStudio
  under GPLv3, which directly contradicts the "all rights reserved, redistribution not
  permitted" notice in your own footer.
- **Univer** is the better-fitting candidate: Apache-2.0 core, xlsx import/export, and
  it's what several production office suites build on. **Verify before committing** which
  of charts / pivot tables / advanced tables are in the Apache-2.0 packages versus Univer
  Pro — the repo separates them and the marketing site does not. Pair with **SheetJS**
  (Apache-2.0) if you want export independent of the grid.

**The bridge that makes this safe:** define one `WorkbookAdapter` interface —
`get/setCell`, `getFormula`, `evaluate`, `serialize`, `onChange` — and write every lesson
against it. Then Tier 1 and Tier 2 are swappable, and choosing wrong costs an adapter,
not a rewrite.

**One IP flag on the curriculum.** §15 of the main brief lists 22 courses with runtimes
("Introduction to Excel — 2hr 12min"). That is a video-course catalogue, and its
structure is likely someone else's copyrighted syllabus. It also contradicts §16 of your
own brief ("do not make lessons look like videos"). Use it as a coverage checklist of
*topics*, derive your own module structure and numbering, and drop the runtimes —
they're meaningless for interactive lessons anyway.

## 12. Technical limitations to design around

- **GitHub Pages is static.** No server rendering, no secrets. Any AI tutor needs a
  serverless function elsewhere (Cloudflare Workers / Vercel) — **never an API key in
  the client**.
- **SEO on a client-rendered SPA is the core risk.** Prerender to static HTML at build
  time (one file per lesson). Otherwise you are shipping the same invisibility you have
  now with a bigger bundle.
- **You have no local toolchain and update by web upload.** A Vite app cannot ship that
  way. The Actions workflow is a prerequisite, not a nicety — and it's currently sitting
  in the wrong directory.
- **`localStorage` only.** Fine, but namespace the keys now (`finstudio:v2:progress`) so
  a future accounts migration has something to migrate.
- **Real company data (§23)** carries licensing and accuracy risk that fictional
  Bombay Bean does not, and `verify()` can't audit it. Defer until there's a licensed
  source.

## 13. Roadmap

Sequenced by leverage, not by the brief's order. Each phase ships independently and
leaves the site working.

**Phase 0 — repair (hours, do this first).** Fix items 6–12 above: delete the stale root
duplicates, move `deploy.yml` to `.github/workflows/`, restore `.gitignore`, fix the
404 links, align `finschool` → `finstudio`. Zero user-visible change, unblocks
everything.

**Phase 1 — foundations.** Spacing/type/motion tokens. Extended lesson schema
(difficulty, time, prerequisites, objectives, common mistakes, related concepts) —
additive, so all 38 lessons keep working while they're filled in. Concept layer as data.

**Phase 2 — the three absences.** Search across lessons/glossary/formulas/concepts.
Calculator component + first six (TVM, NPV/IRR, EMI, CAGR, WACC, DCF). Formula library
as a browsable route. All achievable on the current stack.

**Phase 3 — the cutover.** React + Vite + real URLs + prerendering + code splitting +
Schema.org + sitemap. Port the block renderers unchanged; port `company.js` first; keep
the 371 assertions green as the gate. This is the only irreversible phase.

**Phase 4 — structure.** Learning paths, "where should I start", knowledge-graph
navigation, prerequisite gating, rebuilt homepage.

**Phase 5 — the Lab.** Tier-2 workbook behind the adapter, Excel curriculum, pivot
tables, charts, xlsx.

**Phase 6 — deeper.** External resource system, rules-based tutor first (circular
reference, hardcoded forecast, unbalanced sheet, wrong sign are all detectable
deterministically), LLM tutor behind a function only after that.

Phases 1–2 are worth doing before Phase 3, not after: they're cheap on the current
stack, and they tell you what the content model actually needs to be before you freeze
it in TypeScript.
