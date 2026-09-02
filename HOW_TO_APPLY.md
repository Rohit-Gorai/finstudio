# Level 0 rebuilt from your document

Replace **`concepts-l0.js`** in the repo root with the new one. That single file
is the whole change — nothing else moved.

If you haven't yet uploaded the five files from my last message (`app.js`,
`site.css`, `concepts-l0.js`, `concepts-l1.js`, `curriculum-map.js`), upload
those too, using this newer `concepts-l0.js`. Without `app.js` the practice
boxes and sandboxes won't render.

## I can't push to your repo

I have no GitHub credentials in this environment and no network path to push —
`git push` fails with "could not read Username for https://github.com". You'll
need to commit the file yourself. Everything else below is verified and ready.

## What came from the document

All 14 topics it covers were rebuilt from your text, keeping its structure:

What is this? · Why does it matter? · How does it work? (step by step) ·
Real-Life Case Study + What It Means · Key Terms · Practice Questions with
worked solutions · What to Remember · Common Mistakes · Check Yourself (5 MCQs,
correct answer taken from your ✅ marks) · Interview Questions

Interview questions render as a second practice block, so each has a writing
space and a reveal — useful for prep.

Totals across Level 0: **94 quiz questions, 140 practice/interview items,
84 key-term cards, 19 sandboxes.**

## Two gaps in the document you should know about

1. **Liabilities is missing.** The "Assets" section appears twice — the second
   block is a byte-for-byte duplicate of the first, so the Liabilities topic
   never got written. Its existing lesson has been kept.
2. **The whole "Time value & decision making" module is absent** — time value of
   money, compounding, inflation, present value, future value, opportunity cost,
   risk vs reward. Their existing lessons have been kept.

So all 22 Level 0 topics still have a page: 14 rebuilt from your document,
8 carried over. Send me the text for those 8 and I'll rebuild them the same way.

## Sandboxes

Your document describes sandboxes as prose ("Inputs: Fixed Costs, Variable Cost
Per Unit… Challenge: reduce cost per unit"), not as runnable specs. I kept the
19 working interactive sandboxes already built, since they compute live results.
The three topics without one are Financial markets, Assets and Liabilities,
which have nothing numeric to model.

## Verified

- 22 lessons load; 0 invalid quiz answers; 0 leftover ✅ marks in options;
  0 unconverted markdown
- Booted in a browser engine: "Revenue" renders with 8 practice/interview boxes,
  a sandbox computing ₹30,00,000 on its defaults, 5 quizzes, and
  Previous → Companies and capital, Next → Costs
- Curriculum audit passes: 11 levels, 227 topics, 72 clickable

## Regenerating

    node scripts/import-level0-doc.mjs <extracted.md> <sandboxes.json> <baseline.js>

The importer is in the zip history as `scripts/import-level0-doc.mjs`; it reads
the document, so re-running it after you edit the source rebuilds the lessons.
