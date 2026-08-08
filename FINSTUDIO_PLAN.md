# FinStudio — transformation audit and plan

Response to the master transformation brief. Section 52 of that brief asks for
an audit before implementation and section 50 sets the priority order; this
document does both, grounded in the actual repository rather than assumptions.

---

## 1. What exists today

A **buildless static site**: `index.html` + 16 plain `<script>` tags, no
framework, no dependencies, no build step. ~6,500 lines.

| Layer | File | State |
|---|---|---|
| Spreadsheet engine | `js/engine.js` (452 ln) | Real recursive-descent parser. Cell refs, `$` anchors, ranges, 7 functions, cycle detection, en-IN formats. **Keep.** |
| Router + renderers | `js/app.js` (~880 ln) | Hash routing, 12 block renderers, `localStorage` progress. **Keep, refactor.** |
| Curriculum | `js/lessons/*.js` (38 lessons) | Data objects, not markup. Ports cleanly. **Keep.** |
| Quizzes / Reference | `js/quizzes.js`, `js/reference.js` | 9 module quizzes, 4 reference pages. **Keep, extend.** |
| Tests | `tests/*.test.html` | 371 assertions incl. solve-every-sandbox + mutation tests. **Keep — this is the safety net for everything below.** |

**Already satisfying the brief:** learn-by-doing sandboxes · `mustFormula`
(rejects a correct number where the formula is the lesson) · per-option MCQ
explanations that teach · "where this number goes" on every lesson · Indian
context throughout · WCAG AA contrast · full keyboard grid · reduced-motion.

**Now also satisfying it (this commit):** Excel-grade sandbox — Tab/Shift+Tab,
Enter/Shift+Enter, F2, Delete, Ctrl+C/X/V with reference shifting in both axes,
Ctrl+D/R fill, Ctrl+Z/Y undo, and a discoverable shortcut legend.

---

## 2. Gaps against the brief, ranked by leverage

| # | Gap | Brief §§ | Cost | Impact |
|---|---|---|---|---|
| 1 | **No glossary** — no way to look a term up without leaving the lesson | 15, 34 | M | Very high |
| 2 | **No standalone calculators** — sandboxes teach, but nothing lets you just *compute* | 13, 14 | M | Very high |
| 3 | **No search** | 34 | M | Very high |
| 4 | **Lesson template missing 7 of 16 sections** — no prerequisites, learning objectives, "in one sentence", common mistakes, "if you remember only 3 things", analyst challenge, related concepts | 11, 43, 44 | L | High |
| 5 | **No difficulty badges or prerequisite gating** | 17, 18 | S | High |
| 6 | **No learning paths / career paths** | 20, 21 | M | High |
| 7 | **Hash routing → one indexable URL**; no canonical, Schema.org, sitemap | 33 | L | High (SEO is the whole distribution model) |
| 8 | **Entire curriculum loads to read one lesson** (~400 KB, 16 blocking scripts) | 32 | L | High, and worsens with every lesson |
| 9 | **No knowledge graph / "what next"** | 16, 46 | S | Medium |
| 10 | **Curriculum breadth** — §22 lists ~18 domains; 4 are covered | 22 | XL | Medium (depth already strong) |
| 11 | No design tokens for spacing; ad-hoc rem values | 8, 38, 39 | S | Medium |

---

## 3. Two conflicts in the brief that need a decision

**① Palette vs. identity.** §9 specifies `#FFFFFF` background with slate text
and a blue/green accent. §37 says *"if the existing template already works,
KEEP IT"* and §1 says preserve the visual identity. The current ledger-paper
palette (`#FBF9F3`) is the site's identity and its contrast already passes AA.

*Recommendation:* keep ledger paper as the surface, adopt §9's **structural**
guidance — spacing scale, tokens, alignment, the semantic colour roles
(positive/negative/warning/info) — and adopt §9's rule that colour is never the
sole carrier of meaning. That satisfies the intent without discarding what
makes FinStudio recognisable. Say the word if you'd rather go literal-white.

**② Typography.** §6 asks for Inter and 16–18px body. Current: Public Sans at
16px with Fraunces headings, line-height 1.65 — already inside the target
range. Fraunces *is* the identity.

*Recommendation:* raise body to 17px, keep Public Sans (it is as legible as
Inter and already loaded), keep Fraunces for headings only. Full switch to
Inter is a one-line change if you want it.

---

## 4. Delivery order

Following §50, each step reusable before the next begins.

**Phase A — foundations (small, high leverage)**
1. Spacing/radius/shadow tokens; alignment audit ✔ *(sidebar done)*
2. Lesson-header component: difficulty · time · prerequisites · progress
3. Extend the lesson schema with the missing sections (§11) — additive, so
   existing lessons keep working while they are filled in

**Phase B — the three big absences**
4. **Glossary** — ~120 terms, each with plain-English line, formula, related
   concepts, difficulty; clickable inline without leaving the page (§15)
5. **Calculators** — one reusable component meeting §13 in full (inputs,
   units, visible formula, expandable working, large result, *interpretation*,
   reset, example values). First set: TVM, NPV/IRR, EMI, CAGR, WACC, DCF
6. **Search** across lessons, formulas, glossary, calculators (§34)

**Phase C — structure**
7. Learning paths + career paths (§20, §21), knowledge graph (§16), "what
   next" (§46), prerequisite gating (§17)
8. Homepage rebuilt around the five entry points (§35)

**Phase D — scale**
9. Real URLs, Schema.org, sitemap, per-page meta (§33) — needs the React
   migration already scaffolded in `src/`
10. Code splitting (§32); then curriculum expansion by domain (§22)

---

## 5. What is deliberately *not* being done

- **A ground-up redesign.** §1 and §37 forbid it, and the existing template
  works.
- **Rewriting all 38 lessons at once.** §50 forbids it. They will gain the new
  sections via the extended schema, module by module.
- **A heavy spreadsheet library.** The engine already parses, detects cycles
  and passes 151 assertions — and no third-party engine can express
  `mustFormula`, which is the mechanism that makes this a learning platform
  rather than a calculator with quizzes. (HyperFormula is also GPLv3, which
  would relicense the project; see `PROJECT_ANALYSIS.md`.)
- **Real-company financials (§24).** Licensing and accuracy risk. The two
  fictional companies — Bombay Bean Coffee Co. and Chaiwala Cloud — are
  internally consistent and verified by `company.js`'s `verify()`, which real
  data would not be. Revisit only with a licensed source.

---

## 6. Quality bar (§51) — current standing

| Test | Status |
|---|---|
| Beginner | ✅ Lesson 1 assumes nothing |
| Student | ✅ Capstones match exam-style work |
| Analyst | ⚠️ Needs the glossary and search to be a quick reference |
| Builder | ✅ 192 cells the learner fills in |
| Modeler | ✅ 3-statement linked model + DCF |
| Accessibility | ✅ AA contrast, keyboard grid, reduced motion |
| Mobile | ✅ No page overflow at 375px; sheets scroll internally |
| Performance | ❌ Whole curriculum loads per lesson — Phase D |
| Visual | ✅ Sidebar/sheet alignment audited |
| Consistency | ⚠️ Will hold once the extended template is applied to all lessons |
