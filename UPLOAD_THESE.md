# Upload these 8 files to the repo ROOT

I checked your repo (commit `e1bdb84`). `concepts-l0.js` and `concepts-l1.js` are
already live and identical to mine, so they are **not** in this list — you don't
need to touch them.

    index.html                 ← must go up (it loads concepts-l2.js)
    app.js
    site.css
    curriculum-map.js
    concepts-l2.js             ← new: Level 2 lessons
    topic-lessons.js           ← repaired
    master-topic-lab.js        ← repaired
    researched-topic-pages.js  ← repaired

All eight go in the root, replacing what's there. No subfolders.

**One safety note I verified:** your live `index.html` had changed since I last
saw it, so I re-checked mine against the current one. The only differences are
my intended changes — the three repaired scripts now load from the root, the
duplicate tags are gone, `research-overrides-l01.js` is removed, and
`concepts-l2.js` is added. Nothing else the live site loads gets dropped.

## Validated against your current repo

    script tags 46 · duplicates 0 · missing files 0 · execution failures 0
    all 227 topics reachable · sidebar Levels 0-10 · 35 progress counters
    "Accounting equation" title correct · both overridden lessons restored
    Levels 0-2: invalid nesting 0 · empty paragraphs 0 · missing quizzes 0
    header: visible → hides scrolling down → returns scrolling up → visible at top

## Where the content actually stands

**95 lessons are human-written:**

    Level 0   22 topics   authored from your document
    Level 1   21 topics   authored from your document
    Level 2   33 topics   14 authored by me + 19 café spreadsheet lessons
    Levels 3-5  10 topics  café spreadsheet lessons mapped to their topics
    ------------------------------------------------------------------
                95 topics with real teaching content

The other **132 topics have auto-generated placeholder pages**. They are
reachable and structurally complete, but the prose is templated — the same
shape for every topic. They are honest scaffolding, not teaching.

## What would actually make it the best beginner finance site

Not more code. The code is in good shape now. It needs content and evidence:

1. **Author Levels 3-10 properly** — 132 topics, the way Levels 0-2 were done.
   That is the single biggest gap by a wide margin. Level 3 (Financial Analysis,
   13 topics remaining) is the natural next batch, and the pipeline is built:
   send me a document like the Level 0/1 ones and it's one command.
2. **Real browser testing.** Everything I validate runs in a headless DOM that
   computes no layout. Pixel alignment, mobile, and how it actually feels to
   read need a human on a phone and a laptop.
3. **Put it in front of five beginners** and watch where they stop. No amount of
   structural polish substitutes for that.
4. **A visible learning path** — where to start, what to do next, roughly how
   long. Beginners abandon curricula that don't tell them where they are.

Points 2 and 3 are yours; 1 and 4 I can do whenever you want.
