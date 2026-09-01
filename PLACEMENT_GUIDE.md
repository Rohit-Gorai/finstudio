# FinStudio update — how to apply this zip

**Why this guide exists:** the previous update was uploaded flat into the repo
root via GitHub's "Add files via upload". The build only reads `src/` and
`tests/`, so none of it went live. This zip contains every file at its correct
path — extract it over the repo root and the structure lands right.

## Apply

1. Extract the zip into the repository root (it will place files into
   `src/app/…`, `src/data/lessons/…`, `tests/…`, `docs/…` and overwrite
   `app.html`). If uploading via GitHub web UI, upload each folder's files
   *inside that folder*, not at the root.
2. **Delete these 15 stray files from the repo root** (they are the misplaced
   copies from the last upload; the build ignores them but they will confuse
   every future change):
   CurriculumPage.tsx, LessonNotFound.tsx, LessonPage.tsx,
   LevelLandingPage.tsx, ModulePage.tsx, RootLayout.tsx, TopicRedirect.tsx,
   curriculum-audit.mjs, curriculum.test.ts, level0.ts, level1.ts,
   registry.ts, router.tsx, routing.test.ts, types.ts
   (Keep `app.html` at the root — it is the Vite entry point. Root
   `LESSON_INVENTORY.csv` moves to `docs/`.)
3. Commit. CI runs typecheck, 39 tests, and the production build; all pass
   locally as of this zip.

## What changed in this update

- Left curriculum pane verified and regression-tested: all 11 levels (0–10)
  and every module render; a test now fails if any level disappears.
- Previous/Next navigation covers all 227 topics and crosses level
  boundaries; tested at every boundary.
- Topic-specific Practice (3 exercises + worked solutions), Quiz (3 MCQs with
  explanations and try-again), for all 43 fully-authored lessons (Levels 0–1).
- Interactive sandboxes (editable inputs, live calculation, reset) for 34 of
  those topics via `src/data/lessons/sandboxEngine.ts` — 24 real calculator
  kinds (compound growth, discounting, leverage, working capital,
  depreciation, deferred revenue, …), unit-tested.
- Typography fixed: `app.html` now loads Fraunces, Public Sans and IBM Plex
  Mono — the families `theme.css` has declared all along — instead of the
  unused Inter/JetBrains Mono.
- Honest status everywhere: 43 authored / 45 drafts / 139 outlines. Lessons
  without written content say so; no filler is generated.
