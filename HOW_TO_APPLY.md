# Level 0 & 1 — alignment and readability pass

Upload these four to the repo **root**, replacing what's there:

    app.js   site.css   concepts-l0.js   concepts-l1.js

No template, layout or colour changes. Same components, same design language —
the fixes are structural markup plus four small additive CSS rules.

## What I found reading Level 0 and 1 as a student

**1. Bullet lists were broken markup — the main alignment bug.**
Your source documents separate every bullet with a blank line, so each bullet
became its own paragraph *and* its own one-item `<ul>` wrapped inside a `<p>`.
That's invalid HTML: the browser closes the paragraph early, so bullets got
paragraph spacing, inconsistent indents and ragged left edges.
"What is finance?" alone had **33** of these. Now: **0** across all 43 lessons,
rendered as real lists (180 of them) that align with the body text.

**2. Case studies read as a ragged column of fragments.**
"Daily Sales:" / "800 cups" / "Selling Price:" / "₹20 per cup" each sat on its
own line. They're now paired into aligned label-value rows with the figures in a
right-aligned mono column, so the numbers line up and scan vertically. On phones
they stack instead of squeezing.

**3. Step headings looked like body text.**
"Step 1: Someone Has Capital" was a bold paragraph, visually identical to prose,
so the how-it-works sections had no scannable structure. They're now real `h3`
headings — **191** of them — using the heading styles already in your template.

**4. Stray blank gaps.**
"What to remember" and revealed practice solutions wrapped a list inside a `<p>`,
leaving empty paragraphs behind — visible as uneven vertical gaps. Fixed at the
renderer: block content is no longer wrapped in a paragraph.

**5. The lede repeated the first sentence.**
Every lesson opened with a summary line and then immediately restated it word for
word under "What is this?". The lede now uses the document's own "In simple
terms" line where there is one, and is dropped where it would duplicate.
**0 duplicates** remain.

## Two things in your repo I did not change, but you should know

**`research-overrides-l01.js` replaces two of your lessons.** It loads after
`concepts-l0.js`/`concepts-l1.js` and overwrites **Personal finance vs corporate
finance vs investing** and **Accounting equation** (its title renders as
"Accounting equation & financial statements"). Those two are the only Level 0/1
topics with no case study, and they read differently from the other 41. Delete
that script tag from `index.html` if you want the document versions back — I
left the choice to you.

**Three scripts have syntax errors and never run** — they fail to parse in the
browser too, so whatever they provide is silently dead:
`js/topic-lessons.js`, `js/master-topic-lab.js`, `js/researched-topic-pages.js`.
Also `research-overrides-l01.js` and `research-overrides-l45.js` are each listed
**twice** in `index.html`.

I made `app.js` render a table or list that arrives inside a text block as a
`div` instead, so even the overridden lessons no longer produce invalid nesting.

## Verified across all 43 Level 0 + 1 lessons

    invalid nesting     0   (was 33 on one page alone)
    empty paragraphs    0
    invalid quiz answers 0
    duplicate ledes     0
    missing practice    0
    missing quiz        0
    missing case study  2   (both are the overridden lessons above)

Curriculum audit still passes: 11 levels, 227 topics, 72 clickable.

## Regenerating after a document edit

    node scripts/import-level-doc.mjs 0 <level0.md> <sandboxes.json> <baseline.js>
    node scripts/import-level-doc.mjs 1 <level1.md> <sandboxes.json> <baseline.js>
