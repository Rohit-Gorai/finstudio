# FinStudio redesign — what changed and how to install

Four files change. Nothing in `js/engine.js`, `js/lessons/`, `js/quizzes.js`,
`js/reference.js`, `js/glossary.js` or `tests/` is touched, so the curriculum,
the formula engine and the check system are exactly as they were.

## Install

Drop these over the repo root, keeping the paths:

```
index.html          replaced   nav, footer, no web fonts
css/site.css        replaced   the whole design system
js/app.js           replaced   new homepage + motion + route-aware layout
favicon.svg         replaced   new mark
logo/               new        mark, mono variant, lockup, identity sheet
```

Back up the two big ones first if you want a way back:
`css/site.css` and `index.html`.

Then open `tests/lessons.test.html` and `tests/engine.test.html` in a browser.
Both must read **all assertions passed** — 300 and 151 respectively. If they do,
nothing pedagogical moved.

## Design system

| | |
|---|---|
| Surfaces | `#F5F5F7` page · `#FFFFFF` cards · `#FAFAFC` sunk · `#111113` band |
| Text | `#1D1D1F` · `#6E6E73` · `#8E8E93` |
| Accent | `#0A58E0`, used once per screen |
| Semantic | positive `#17714A` · negative `#B3261E` · warning `#8A5A00`, always paired with a word or sign, never colour alone |
| Type | system SF stack, no web fonts; `ui-monospace` with `tabular-nums` for every figure |
| Spacing | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 200 |
| Radius | 8 · 14 · 22 · 28 · pill |
| Elevation | three levels, no ad-hoc shadows |
| Motion | 150 / 260 / 620ms on `cubic-bezier(.22,1,.36,1)`, all gated on `prefers-reduced-motion` |

**The signature device is the double rule.** In accounting a figure that has been
totalled and proved carries a double underline. It is the only ornament in the
system, and it appears on total rows, the tie meter and section dividers.

## What's new in the markup

- **Nav** — sticky, translucent, blurred, hairline appears only after the page
  moves. Desktop links + pill CTA; the hamburger is mobile-only, as asked.
  An opaque fallback covers browsers without `backdrop-filter`.
- **Homepage** — a narrative: hero → 01 Build → 02 Connect → 03 Prove (full-bleed
  near-black band) → 04 Experiment → curriculum → reference → close.
  The syllabus rail is hidden on `/` and the page goes full-bleed;
  every other route keeps the rail.
- **Hero visual** — a live DCF. It calls `company.js`'s own `dcf()`, the same
  function lesson 2240 checks against, so the slider does real arithmetic on
  real figures. Nothing in the hero is mocked.
- **Curriculum** — editorial rows keyed to the chart-of-accounts numbering,
  with hover lift, arrow travel and a progress hairline. No card grid.
- **Counts are counted.** "192 cells" and "35 sandboxes" are computed from the
  lesson data at render time, not typed in. Add a lesson and they update.

## Verified

- 451 assertions pass (151 engine + 300 curriculum, incl. mutation tests)
- `company.verify()` — 42 self-audits green
- All 10 routes render, including the unknown-route fallback
- Zero horizontal overflow at 1440 / 1024 / 768 / 390
- Reviewed by screenshot at desktop, tablet and mobile; the fixes that came out
  of that review are already in these files

## Known follow-ups

- **`404.html` still uses the old styling.** It is a separate static file and was
  left alone; it needs the same treatment when you next touch it.
- **The `.v1` look is gone from `tests/*.test.html`** — the harness has its own
  inline styles and still shows the old ledger palette. Harmless, but it will
  look inconsistent if you ever share a test run.
- **No `og:image`.** Social cards will fall back to text until a PNG exists.
