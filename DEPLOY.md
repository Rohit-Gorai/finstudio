# It's wired. Level 0 is live-able.

## What to do

Unzip `finstudio-site.zip` over your repo (or copy the `finstudio-wired/`
folder's contents), commit, push. Then visit `#/learn/0010-what-is-finance`.

**Do this with `git`, not the GitHub web uploader.** Three of these files have
been flattened to the repo root twice now, and the paths below are the whole
point of this commit.

## What changed

**Files moved to where they belong.** `ebitda.js`, `curriculum.js`,
`practice.js`, `port.js`, `2240-dcf.js` were sitting at the repo root, deployed
but loaded by nothing. They are now `js/learn/…` and `js/sheets/…` and are in
`index.html`.

**Phase 0 finally ran.** Removed the stale root duplicates (`app.js`,
`engine.js`, `company.js`, the nine `m*.js`, the seven `.tsx` files). Restored
`.gitignore` from the file named `download`. Moved `deploy.yml` into
`.github/workflows/`.

**Two new files do the work that was missing:**

- `js/learn/grid.js` — the spreadsheet UI. Non-virtualized, as recommended:
  every sandbox is under 25 rows, so virtualization would have solved a problem
  none of them have while adding the selection-during-scroll bugs that make
  grids hard. Cell selection, a formula bar that shows the **formula** rather
  than the value, arrow/Tab/Enter/F2/Delete/Ctrl-Z keyboard handling, live
  recalculation through the dependency graph, per-cell guidance with the
  formula pattern behind a click, autosave to localStorage, and checks that
  read what you typed.
- `js/learn/render.js` — the lesson page. Renders the full loop (Learn · See ·
  Practice · Build · Watch out · Apply · Master · takeaways) plus an
  interactive widget for every question type: numeric, formula, MCQ,
  multi-select, drag-to-match, ordering, scenario, free-text interpretation and
  cell debugging. Grading is delegated to `practice.js`, so the browser and the
  test suite score identically.

Plus `css/learn.css`, the `#/learn/<id>` route, and the curriculum graph and
progress store wired into `app.js`.

**Level 0 is now in the syllabus.** It appears above Level 1 in the sidebar,
with tick marks for lessons visited. Before this commit the 22 lessons existed
but were reachable only by typing a URL.

## Verified in a real browser, not asserted

`17 passed, 0 failed`. The test drives Chromium against the actual page:

- The lesson renders with all seven loop sections
- Typing **the correct number** `1560000` into the gross-profit cell is
  **rejected**, with "you haven't built the calculation"
- Typing the eight real formulas passes every check and shows the success line
- Net profit computes to ₹1,80,000
- Changing revenue afterwards recalculates it — it is a live model
- The work survives a page reload
- A numeric practice question grades correctly, and the hint ladder opens
- Zero horizontal overflow at 390px
- The 38 v1 lessons still render
- Zero console errors

Also still green: coverage 22/22 on Level 0, 26 sandboxes verified solvable,
132 guarded cells with **no** hardcoding holes.

## One real bug the browser test caught

The lessons end by telling the learner to change a driver — "now change the
rent in B7 and watch how many more cups the café has to sell". The sandbox
refused, because only the answer cells were editable. The copy promised
something the UI blocked.

Fixed with **Explore mode**: a toolbar toggle that unlocks every cell, and
which switches on automatically the moment all checks pass, with a note saying
so. Build it correctly, then break it on purpose — which was always the point.

## What is still not done

- Levels 1–10: 186 topics unwritten. The coverage gate keeps that number honest.
- The roadmap page still lists Level 0 topics as "lessons to build" — it reads
  `master-curriculum.js`, which doesn't yet know the lessons exist. Small job,
  worth doing next so the roadmap and reality agree.
- No fill handle, no copy/paste, no multi-cell selection in the grid. The
  engine supports all three; the UI doesn't expose them yet. No current lesson
  needs them.
