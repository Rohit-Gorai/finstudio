# FinStudio — apply this update, then fix the deployment

## ⚠️ Read this first: why nothing you upload has changed the site

`https://rohit-gorai.github.io/finstudio/` is **not serving the React app**.
It is serving the old vanilla-JS site that lives in the repo root
(`index.html` + `js/lessons/*.js`). That legacy app has exactly two levels in
its left pane ("Level 1 · Accounts & statements", "Level 2 · Analysis &
modeling") with numeric routes like `#/1010-five-buckets` — which is precisely
the pane you pasted.

So the left pane was never "reduced to 2 levels" by any change. The React app —
with all 11 levels (0–10) and 227 topics — has simply never been published.

GitHub Pages is set to **deploy from a branch** (serving the repo root), while
the repo also has a working Actions workflow that builds the React app. Until
that setting changes, no code change of any kind can affect the live site.

### The one setting to change

GitHub → your repo → **Settings** → **Pages** → **Build and deployment** →
**Source: GitHub Actions** (instead of "Deploy from a branch"). Then push, or
run the "Build and deploy to Pages" workflow manually.

**Trade-off, stated plainly:** the React app replaces the legacy site. The old
café lessons (`1010-five-buckets` … `2250-valuation-capstone` — 9 modules of
interactive lessons) are not part of the React app. Their URLs redirect rather
than 404, but that authored content is not carried over. If you want to keep
it, say so before switching and I'll port those lessons across first.

## Apply the code

Extract this zip over the repo root — it places files into `src/app/…`,
`src/data/lessons/…`, `tests/…`, `docs/…` and overwrites `app.html`. Do **not**
upload the files individually into the root; that is what happened last time
and is why the root now holds stray copies.

Delete these 15 stray files from the repo root (misplaced copies from the last
upload; the build ignores them but they will confuse every future change):
CurriculumPage.tsx, LessonNotFound.tsx, LessonPage.tsx, LevelLandingPage.tsx,
ModulePage.tsx, RootLayout.tsx, TopicRedirect.tsx, curriculum-audit.mjs,
curriculum.test.ts, level0.ts, level1.ts, registry.ts, router.tsx,
routing.test.ts, types.ts
(Keep root `app.html` — it is the Vite entry. `LESSON_INVENTORY.csv` → `docs/`.)

## What this update contains

**Left pane (this round)**
- All 11 levels (0–10), every module, all 227 topics — the full structure from
  your curriculum document, in the existing rail design.
- Module titles are now links to their module pages, with `done/total`
  progress, as in the original pane.
- Reference block restored at the foot of the rail: Full curriculum, Formula
  sheet, Glossary.
- Tests now fail if any level, module or topic disappears from the pane, and
  every module link is rendered and checked for resolution.

**Previous round (included here, since it never shipped)**
- 43 fully authored lessons (Levels 0–1) with concept, why, how, example,
  formula, key terms, takeaways, mistakes.
- Topic-specific Practice (3 exercises + worked solutions) and Quiz (3 MCQs
  with explanations and try-again) on those 43 topics.
- Interactive sandboxes on 34 topics — editable inputs, live calculation,
  reset — from a unit-tested engine of 24 calculator kinds.
- Previous/Next across all 227 topics including level boundaries.
- Typography fixed: loads Fraunces / Public Sans / IBM Plex Mono, the families
  `theme.css` declares (it was loading Inter / JetBrains Mono, so every
  declared font silently fell back).

Verified locally: `tsc -b` clean, 42/42 tests, production build emits
`dist/index.html` + `dist/404.html`.
