# FinStudio — live-site curriculum update

## This one changes the live site directly

Earlier updates targeted the React app, which GitHub Pages never serves.
**This update edits the files the live site actually loads** (`index.html`,
`js/`, `css/` at the repo root). Upload them and the change is live on the next
Pages build — no settings change required.

## Apply

Extract this zip over the repository root. Files land in `js/lessons/`, `js/`,
`css/`, `scripts/`, `tests/` and overwrite `index.html`. Do **not** upload the
files loose into the root — the folder structure is what matters.

Also delete these 15 stray files still sitting in the repo root from the earlier
mis-upload (the build ignores them, but they confuse every future change):
CurriculumPage.tsx, LessonNotFound.tsx, LessonPage.tsx, LevelLandingPage.tsx,
ModulePage.tsx, RootLayout.tsx, TopicRedirect.tsx, curriculum-audit.mjs,
curriculum.test.ts, level0.ts, level1.ts, registry.ts, router.tsx,
routing.test.ts, types.ts

## What the left pane looks like now

Below the existing café modules (untouched), the pane now shows the complete
curriculum:

- **All 11 levels, 0 through 10** — Finance Foundations to Advanced Finance
- **All 35 modules**, each with its `done/total` progress counter
- **All 227 topics**, listed under their module
- The Reference block (balance sheet lines, income statement lines, cash flow
  lines, formula sheet, glossary) is unchanged at the foot

Topics whose concept lesson is written are links. The rest are shown in muted
text and are **not** clickable — the full learning path is visible, but no link
leads to an empty page.

## Lesson content

43 topics (all of Level 0 and Level 1) now have full lessons in the site's own
lesson format — the same renderer as the café lessons, so they get the existing
layout, glossary auto-linking and progress tracking:

What is this? · Why does it matter? · How does it work? · Formula (where one
applies) · Worked example with every arithmetic step · Key terms · Practice
(3 exercises each, with worked solutions behind a toggle) · What to remember ·
Common mistakes · 3 multiple-choice questions with per-option explanations ·
Previous / Next

Previous/Next runs continuously across all written lessons and across level
boundaries.

## Where the content comes from

`scripts/build-legacy-lessons.ts` generates the three data files from the
authored lesson data, so the React app and the live site never drift apart:

    npx vite-node scripts/build-legacy-lessons.ts

Generated (do not hand-edit): `js/lessons/concepts-l0.js`,
`js/lessons/concepts-l1.js`, `js/lessons/curriculum-map.js`.

## Checks

    node tests/legacy-curriculum-audit.mjs   # 11 levels, 227 topics, unique ids, no orphans
    node tests/legacy-dom-check.mjs          # boots the real site in jsdom, checks pane + lesson

Both pass, as do the React app's 42 tests and its production build.

## Honest status

- Levels 0 and 1: **43 / 43 topics written**
- Levels 2–10: **0 / 184 topics written** — visible in the pane, not yet linked

Level 2 (Financial Statements, 33 topics) is the natural next batch. The
per-topic Excel-style sandboxes that exist in the React app are not yet ported
to the live site's sheet engine; the café lessons' spreadsheets are untouched.
