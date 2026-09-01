# One file. Drag it into the repo root. Done.

## Why the last upload didn't work

The zip was extracted flat, so these five files landed in the **repo root**
instead of their folders:

    app.js  site.css  concepts-l0.js  concepts-l1.js  curriculum-map.js

`index.html` is itself a root file, so it updated correctly — and it was asking
for `js/lessons/concepts-l0.js`, `js/app.js` and `css/site.css`, which don't
exist at those paths. The browser got 404s for them and fell back to the old
sidebar. Nothing was wrong with the files themselves; I checked all five
against my originals and they are byte-identical and intact.

## The fix

This `index.html` points at the root copies you already uploaded. **Upload only
this one file, into the repo root** (replacing the existing `index.html`).
Nothing else needs to move.

GitHub → your repo → click `index.html` → pencil icon → delete all → paste this
file's contents → Commit. Or drag this file onto the repo's root file list.

## What it also repairs

While testing I found 13 more assets your live site has been requesting and
failing to load — from the same flat-upload problem in an earlier batch:

    js/sheets/engine.js        js/learn/practice.js      js/learn/curriculum.js
    js/learn/grid.js           js/learn/render.js        css/learn.css
    js/learn/lessons/level0-basics.js, level0-capital.js, level0-tvm.js,
    ebitda.js, 1620-liquidity.js, 1330-balance-sheet.js, 2240-dcf.js

Every one has a root copy too. This `index.html` points those at the root
copies as well, so they finally load. I verified they don't touch the sidebar
or routing and share no lesson ids with the new content, so nothing conflicts.

## Verified before sending

I rebuilt your repo exactly as it stands on GitHub, applied only this file, and
booted it in a browser engine:

- scripts requested: 39 · failing to load: **0** (was 18)
- left pane: **all 11 levels, 0 through 10**
- 95 linked lessons · 184 topics shown but not yet written
- Reference block intact at the foot
- lesson pages render with Previous / Next across levels

## Tidy-up (optional, later)

The root is now cluttered with copies that belong in folders. When you want to
clean it, move each root file into its proper folder and revert this
`index.html` to the folder paths — or just leave it working as is. Don't delete
the root copies while this `index.html` is live; it loads them.
