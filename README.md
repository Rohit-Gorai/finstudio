# LedgerSchool

**Learn finance by building it.** A free, text-only, W3Schools-style site that teaches
accounting, the three financial statements, ratios and financial modeling by making you
implement every concept immediately in a live in-browser spreadsheet — with formula
support, automatic answer checking, and a balance sheet that has to tie.

No videos. No sign-up. No backend. One HTML file, some CSS, and a dependency-free
JavaScript spreadsheet engine.

![LedgerSchool's balance-sheet capstone: a spreadsheet with a tie meter reading "It ties ✓ ₹0"](docs/screenshot.png)

---

## What's in it

**38 lessons across nine modules** — about three hours of reading and building, with
35 spreadsheet sandboxes and 192 cells you fill in yourself. Numbered like a chart of
accounts:

| Module | Title | Lessons |
|---|---|---|
| 1000 | Foundations | The five buckets, the accounting equation, double entry, the three statements |
| 1100 | Assets | PP&E, depreciation, inventory, receivables, cash & classification |
| 1200 | Liabilities | Payables & accruals, borrowings, assembling the right-hand side |
| 1300 | Equity & the balance sheet | Share capital, retained earnings, **★ balance-sheet capstone** |
| 1400 | The income statement | Revenue, COGS, opex & EBITDA, depreciation, interest & tax, **★ P&L capstone** |
| 1500 | The cash flow statement | Profit ≠ cash, CFO, CFI, CFF, **★ cash flow capstone** |
| 1600 | Ratios | Margins, liquidity, leverage, returns & DuPont |
| 2100 | Linking the statements | The three bridges, **★ linked model**, find the broken link |
| 2200 | Modeling & valuation | Drivers, projecting the P&L, free cash flow, DCF, **★ value the café** |

Plus **end-of-module quizzes** (five questions each, scored out of five) and a
**Reference** section: every statement line defined in two sentences, and a
one-page formula sheet.

### One company, all the way through

Every number in the course belongs to **Bombay Bean Coffee Co.**, a Mumbai café.
Its figures are defined once in `js/lessons/company.js` and derived from there, so the
course reconciles end to end:

- The P&L capstone's profit after tax (₹1,80,000) is the exact figure the balance-sheet
  capstone already used inside retained earnings.
- The cash flow capstone's closing cash (₹1,00,000) is the exact cash line on that
  balance sheet.
- The balance sheet ties at ₹19,50,000 — and the linked model in module 2100 keeps
  tying across three projected years.

`company.js` carries a `verify()` self-audit that proves all of this; the test suite runs it.

### What makes the sandboxes different

The engine can tell the difference between knowing the answer and knowing the formula.
Where the point of a lesson is the calculation, the cell is flagged `mf` (must-formula)
and typing the right number is rejected:

> ✗ B4 has the right value, but type it as a formula (start with =) — that's the point of the exercise.

Checks can also demand a particular construction (`mustUse: "SUM"`), compare against a
tolerance, or run arbitrary logic (`custom`) for things like "the sheet ties".

---

## Running it locally

There is no build step.

```bash
git clone https://github.com/Rohit-Gorai/finschool.git
cd finschool
open index.html          # or just double-click it — file:// works
```

If you'd rather serve it:

```bash
npx serve .              # or: python3 -m http.server
```

### Tests

Two zero-dependency test pages. Open them in a browser — no runner, no npm install:

| File | What it covers |
|---|---|
| `tests/engine.test.html` | 151 assertions: parsing, en-IN formatting, operators, ranges, functions, cycle detection, checks, reference shifting |
| `tests/lessons.test.html` | 220 assertions: solves **every** sandbox with the intended formulas and requires all checks to pass, mutation-tests each cell, audits MCQs, quizzes, reference links and lesson metadata |

The page title shows `PASS 220/220` or `FAIL`, so both can be driven from CI with a
headless browser if you ever want that.

---

## Adding a lesson

Two edits, and no renderer changes.

**1. Write the lesson object** in the relevant `js/lessons/mXX00.js`:

```js
LS.lessons["1160-prepaid"] = {
  id: "1160-prepaid",           // must start with the code
  code: "1160",
  minutes: 4,
  title: "Prepaid expenses",
  short: "Prepaid",             // sidebar label
  desc: "…",                    // meta description, used for SEO
  lede: "…",                    // the one-paragraph opener
  body: [ /* blocks — see below */ ]
};
```

**2. Add the id** to that module's `lessons` array in `js/lessons/manifest.js`. Done —
routing, the sidebar, progress tracking, prev/next and SEO all pick it up.

### Block types

| `t` | Renders |
|---|---|
| `p`, `h2`, `h3` | Prose and headings (`h` takes HTML) |
| `def` | Definition card — `{ term, h }` |
| `formula` | Dark formula block — `{ title, lines: [], note }` |
| `example` | "Real-life example · Bombay Bean Coffee Co." card |
| `where` | The "where this number goes" box — **required in every lesson** |
| `note` | Amber caveat box, for simplifications you're flagging |
| `table` | Static table — `{ head, rows, numCols }` |
| `svg` | Inline SVG diagram — `{ h, caption }` |
| `sheet` | A live spreadsheet — see below |
| `mcq` | Multiple choice — `{ q, opts, correct, why: [] }`, one explanation **per option** |
| `classify` | Sort items into buckets — `{ buckets, items: [{text, bucket, why, whyNot}] }` |
| `compare` | Two mini statements side by side, for A-vs-B judgement questions |

### Writing a sandbox

```js
{
  t: "sheet",
  sheet: {
    id: "s1",
    title: "Compute Priya's equity",
    hint: "Click the empty cell and type a formula, starting with = .",
    grid: [
      ["Everything the café owns", 1840000],                       // label, locked number
      ["Everything the café owes", 720000],
      ["Priya's equity", { input: true, mf: true, fmt: "inr", ph: "=…" }]
    ],
    checks: [
      { cell: "B3", expect: 1120000, message: "B3: equity = assets − liabilities",
        mustFormula: true }
    ],
    tie: { a: "B10", le: "B17" },      // optional; or { pairs: [{a, le, label}, …] }
    success: "Equity is ₹11,20,000 — and you never had to count it."
  }
}
```

**Grid cells:** a string is a row label, a bare number is a locked figure, and an object
is a configured cell — `{ v, input, mf, fmt, ph, year }`. `fmt` is one of
`inr | pct | x | days | plain`.

**Checks:** `{ cell, expect, tol, message, mustFormula, mustUse }` or
`{ custom: sheet => true | "why it failed", message }`.

**Then add your solution** to `SOLUTIONS` in `tests/lessons.test.html`. The suite fails
if a sandbox has no solution — which is deliberate: it's what guarantees every exercise
is actually solvable, and it caught two real errors during the build.

### House style

- Short sentences, second person, one concept per page.
- Always end the theory with *where this number goes* — which statement, which line.
- Never let a sandbox accept a hardcoded number where the formula is the lesson.
- Every MCQ explanation teaches the why, including for the wrong answers.
- Numbers are Indian format (₹, en-IN grouping); the concepts are globally standard.
- If a treatment is a simplification, flag it in a `note` block rather than glossing over it.

---

## Project layout

```
index.html              the shell — everything else is routed into it
404.html                for GitHub Pages
favicon.svg             ledger-green ▦
css/site.css            the whole design system
js/engine.js            the spreadsheet: parser, evaluator, formats, checks (~450 lines)
js/app.js               hash router, sidebar, progress, block renderers
js/quizzes.js           end-of-module quizzes
js/reference.js         the reference pages and formula sheet
js/sharecard.js         canvas-drawn "the balance sheet ties" PNG
js/lessons/company.js   Bombay Bean Coffee Co. — the single source of truth
js/lessons/manifest.js  module → lesson ordering
js/lessons/m*.js        the lessons themselves
tests/*.test.html       open in a browser
```

### The engine

Dependency-free, ~450 lines. A tokenizer and recursive-descent parser handle
`+ - * / ^ %`, comparisons, parentheses, cell references (`B2`, `$B$2`), ranges
(`B2:B5`) and the functions `SUM`, `AVERAGE`, `MIN`, `MAX`, `ROUND`, `IF`, `ABS`.
Cycles are detected and reported as `#CYCLE!` rather than hanging.

Two deliberate decisions worth knowing:

- **Inside a formula, a comma is always an argument separator**, exactly as in Excel —
  so `1,50,000` typed into a cell parses with Indian grouping, but inside a formula you
  write `150000`. Allowing both broke `ROUND(x, 2)`.
- **`ROUND` rounds half away from zero** (`ROUND(-2.5, 0)` is `-3`), matching Excel
  rather than JavaScript's `Math.round`.

---

## Accessibility

- Every colour pair in the palette clears **WCAG AA 4.5:1**, including the small
  metadata text and the example-card tag.
- Full keyboard support in the spreadsheet: arrows move between editable cells, Enter
  commits and drops down, Esc restores the cell. Every cell input carries an
  `aria-label` naming its address and row.
- `prefers-reduced-motion` is respected, headings are properly nested, there's a skip
  link, and the tie meter and check results are `aria-live` regions.
- Mobile: the sidebar collapses behind a toggle and sheets scroll horizontally inside
  their own container, so the page body never does.

## Deploying

See [deploy.md](deploy.md). Short version: Settings → Pages → deploy from `main` → `/ (root)`.

## Roadmap

- Module 2300: working capital and the cash conversion cycle in depth
- Module 2400: comparable-company valuation, to sit alongside the DCF
- A second company (a services business with no inventory) for contrast exercises
- Print/PDF stylesheet for the reference pages
- Optional dark theme

## Contributing

Corrections to the finance are especially welcome — if a treatment is wrong or a number
doesn't reconcile, please [open an issue](https://github.com/Rohit-Gorai/finschool/issues).
Run both test pages before opening a PR.

## Licence

[MIT](LICENSE). The course content is free to use, fork and teach from.

*Not investment, accounting or tax advice.*
