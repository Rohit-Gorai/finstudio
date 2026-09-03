# Bug fixed — every topic now shows its own lesson

Upload the 22 files to the repo ROOT. The fix is in **`app.js`**;
`concepts-l0.js` and `concepts-l1.js` also changed.

## What was actually wrong

You were on `#/topic/6-transaction-valuation-comparable-companies`. That is not
my authored lesson — it is a generated route.

`js/researched-topic-pages.js` intercepts every `#/topic/...` hash and renders
its own templated page: the same two questions on every topic with only the
name substituted ("Why should **Comparable companies** be interpreted with its
underlying assumptions?" / "Why should **Trading multiples** be…"). The
authored lesson existed and was simply never reached.

The links come from the **Curriculum page** (`roadmap-ui.js`), which points at
`#/topic/<slug>` rather than at the lesson. The left sidebar was already
linking correctly to `#/c-comparable-companies` — which is why the bug appears
from the curriculum page and not from the rail.

## The fix

`app.js` now resolves `#/topic/<slug>` to the authored lesson and redirects,
using the same slug-matching rules that script uses internally. Old links,
bookmarks and the curriculum page all land on the real lesson.

Verified on your two exact URLs:

    #/topic/6-transaction-valuation-comparable-companies
      → #/c-comparable-companies  "Why use the median rather than the mean peer multiple?"
    #/topic/6-transaction-valuation-trading-multiples
      → #/c-trading-multiples     "Trading multiples price:"

Then across **all 227 topic routes: 0 fail to reach their own lesson.**

## A second problem the check surfaced

Testing uniqueness found **8 quiz questions shared between different topics** —
generic stems from the Level 0/1 source documents such as "Which statement is
true?", which appeared in five lessons. The options differed, but the question
did not stand alone, so it read as if the quiz had not changed.

The importer now prefixes repeated or very short stems with the topic name:

    "Which statement is true?"
      → "Revenue recognition: which statement is true?"

**Shared questions across 484 authored quiz questions: now 0.**

## New regression test

`tests/topic-routes.mjs` walks all 227 topic routes and checks each reaches its
own lesson with a distinct quiz. This bug cannot return silently.

    node tests/topic-routes.mjs .
    topic routes tested       : 227
    not reaching their lesson : 0
    shared between topics     : 0
    TOPIC ROUTE TEST: PASS

## Also in this bundle

Level 0's live Bombay Bean spreadsheets (`sheets-l0.js`), the type-scale
normalisation and the alignment fixes from the previous batch — none of which
are uploaded yet.

## Still outstanding

72 lessons in Levels 1-10 end in a calculator rather than a spreadsheet, and
still use the other fictional companies rather than the café.
