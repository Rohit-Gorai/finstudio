# Master prompt for Claude Code — "LedgerSchool" (W3Schools for finance)

Copy everything below the line into Claude Code, run it from the repo root
(the repo already contains `index.html`, the working v1 prototype).

---

## Context

This repo contains `index.html` — a working single-file prototype of
**LedgerSchool**, a free, text-only, W3Schools-style site that teaches finance
by (a) atomizing concepts into 3–5 minute lessons and (b) making the learner
implement each concept immediately in a **live in-browser spreadsheet** with
formula support (`=B2-B3`, `SUM(A1:A5)`) and automatic answer checking.

The prototype already has: sidebar syllabus with chart-of-accounts module
numbering (1000/1100/1200/1300/2000), a formula engine with cell refs, ranges,
cycle detection and Indian-format numbers, per-cell validation with
"must be a formula, not a hardcode" enforcement, a classification exercise
type, inline MCQs, a capstone balance sheet with a live A − (L+E) tie meter,
and one company (Bombay Bean Coffee Co.) whose numbers run coherently through
every lesson and tie perfectly at the capstone (Total assets = Total L+E =
₹19,50,000). Study `index.html` fully before writing any code — reuse its
patterns, palette, and lesson-object schema rather than reinventing them.

## Your mission

Evolve this into a complete, production-quality static site I can host on
GitHub Pages, covering foundations → three statements → ratios → 3-statement
linking → intro financial modeling. Do it in the phases below, committing
after each phase with a clear message.

## Hard constraints

1. **Static only.** No backend, no build step required to deploy (a Vite build
   that outputs static files is acceptable if `docs/` or root deploys cleanly
   to GitHub Pages; prefer keeping it buildless if quality doesn't suffer).
2. **No videos anywhere.** Text, spreadsheets, diagrams (inline SVG only).
3. **Everything free to use.** No sign-up required to learn.
4. **Mobile responsive**, keyboard accessible, `prefers-reduced-motion`
   respected, and the spreadsheet must remain usable on a phone (horizontal
   scroll is fine).
5. **Finance must be correct.** Indian context (₹, en-IN digit grouping,
   Schedule III-style statement ordering is a plus) but concepts must be
   globally standard. If unsure about a treatment, flag it in a comment rather
   than guessing.
6. Keep the visual identity: ledger-paper palette (#FBF9F3 paper, #182530 ink,
   #1E6B4E ledger green, #B23A2F debit red), Fraunces display / Public Sans
   body / IBM Plex Mono for cells, chart-of-accounts codes as the structural
   device. The signature element is the spreadsheet itself and the tie meter.

## Phase 1 — Refactor for scale (no feature changes)

- Split the single file into `index.html`, `css/site.css`, `js/engine.js`
  (spreadsheet), `js/app.js` (router/renderer), `js/lessons/*.js` (one file
  per module exporting lesson objects in the existing schema).
- Add hash-based routing (`#/1110-ppe`) so every lesson is deep-linkable and
  the browser back button works. Update sidebar active states from the hash.
- Add progress persistence with `localStorage`, wrapped in a try/catch helper
  that degrades to in-memory if storage is unavailable.
- Add a `lessons manifest` so adding a lesson = adding one object + one
  manifest entry. Zero renderer changes per new lesson.
- Add basic SEO: per-lesson document.title, meta description, OpenGraph tags.

## Phase 2 — Spreadsheet engine v2

Extend `engine.js` (keep it dependency-free, < ~500 lines, unit-testable):

- Functions: `SUM`, `AVERAGE`, `MIN`, `MAX`, `ROUND`, `IF`, `ABS`.
- Percent input ("12%" → 0.12) and percent display formatting per-cell.
- Cell formatting metadata: `fmt: "inr" | "pct" | "x" | "days" | "plain"`,
  negative numbers in parentheses (already done for inr).
- Multi-column sheets with year headers (FY24 / FY25 / FY26) for projections;
  support relative fill hints in the UI ("drag-right" is out of scope — instead
  add a 'Copy formula right' button on the selected cell that re-writes
  column letters, and teach that this is what fill-right does in Excel).
- Named checks: a check can reference `{cell, expect}` or
  `{custom: sheet => boolean, message}` for things like "B7 must equal
  SUM of B2:B5 *by formula*" (inspect raw string) or "sheet ties".
- Keyboard: arrow keys move selection, Enter commits + moves down, Esc cancels.
- Write `tests/engine.test.html` — a zero-dependency test page that runs
  assertions on the engine in the browser and prints pass/fail (no npm test
  runner needed; keep it openable as a file).

## Phase 3 — Full curriculum content

Write every lesson with the existing house style: definition card → formula
block → "Real-life example · Bombay Bean Coffee Co." → sandbox with checks →
one MCQ with an explanation that teaches, not just confirms. All numbers
across lessons must stay mutually consistent with the company's story; extend
the company's numbers file (`js/lessons/company.js`) as a single source of
truth and derive lesson figures from it.

**Module 1400 — The income statement**
- 1410 Revenue and why "recognized ≠ collected"
- 1420 COGS and gross profit (link to inventory)
- 1430 Operating expenses & EBITDA (build: revenue → EBITDA sheet)
- 1440 Depreciation on the P&L (reuse the van schedule)
- 1450 Interest & tax → PAT (simple debt × rate; flat tax rate)
- 1460 Capstone: full P&L for the café, PAT must equal the ₹1,80,000 used in
  the retained-earnings lesson (work backward to set revenue/cost drivers
  consistently — adjust company.js so it's exact).

**Module 1500 — The cash flow statement**
- 1510 Profit is not cash (opening concept, small reconciliations)
- 1520 CFO indirect method: PAT + dep ± working-capital deltas (sheet)
- 1530 CFI and CFO→capex link; 1540 CFF: debt drawdown/repayment, dividends
- 1550 Capstone: derive closing cash; it must equal the ₹1,00,000 cash on the
  capstone balance sheet.

**Module 1600 — Reading statements: ratios**
- 1610 Margins (gross/EBITDA/PAT) · 1620 Liquidity (current, quick)
- 1630 Leverage (D/E, interest coverage) · 1640 Returns (ROE, ROCE, DuPont)
- Each: one sheet computing the ratio for the café + one "which company is
  healthier" A-vs-B comparison exercise (new exercise type: two mini
  statements side by side, MCQ verdict).

**Module 2100 — Link the three statements**
- 2110 The three bridges (PAT→RE, dep→PP&E, closing cash→BS) with an SVG
  diagram; 2120 build a mini linked model across FY24–FY26 columns where the
  tie meter must read 0 in every projected year; 2130 the classic
  "find the broken link" debugging exercise (pre-seed a sheet with one wrong
  formula; learner must find and fix it — validate by tie + specific cell).

**Module 2200 — Intro to modeling & valuation**
- 2210 Drivers and assumptions (growth %, margin %, DSO/DPO as inputs cell)
- 2220 Projecting the P&L 3 years · 2230 Free cash flow to firm
- 2240 A one-cell DCF: discounting, then NPV of FCFs with a terminal value
  (Gordon growth), sensitivity via two hardwired scenarios
- 2250 Capstone: "value the café" — small integrated model, checks on FCF
  rows and the final EV.

## Phase 4 — Learning-experience layer

- "Course home" per module with a progress bar and estimated minutes.
- End-of-module quiz page (5 MCQs, score out of 5, review answers).
- A global "Reference" section (W3Schools' second pillar): one page per
  statement with every line item defined in two sentences + which lesson
  teaches it; one formula-sheet page (all formulas taught, grouped, in the
  dark formula-block style).
- Optional share card: "I made the balance sheet tie ✓" — a canvas-generated
  PNG the learner can download after the 1310 capstone.
- A discreet footer: "Open source · report an error" linking to the repo's
  issues page.

## Phase 5 — Ship

- `README.md`: what it is, screenshot, local dev (just open index.html or
  `npx serve`), how to add a lesson (schema documented), roadmap.
- `LICENSE` (MIT), favicon (ledger-green ▦ glyph as SVG), 404.html for Pages.
- A `deploy.md` with the exact GitHub Pages steps (Settings → Pages →
  deploy from branch → root).
- Lighthouse pass: aim ≥95 accessibility; fix contrast/labels it flags.

## Quality bar & style guide

- Lesson prose: short sentences, second person, one concept per page, always
  end theory with "where this number goes" (which statement, which line).
- Never let a sandbox accept a hardcoded number where a formula is the lesson
  (the engine's `mustFormula` flag exists for this — use it everywhere the
  pedagogy demands it).
- Every MCQ explanation must teach the *why*, including for wrong answers
  when useful.
- No lorem ipsum anywhere, no placeholder lessons: if a lesson is listed in
  the sidebar it must be complete.
- Commit style: `feat(1500): cash flow module — CFO indirect method sheet`.

Work phase by phase. After each phase, summarize what changed, list any
finance-content judgment calls you made, and wait for my review before the
next phase.
