# Topic isolation — root cause, fix, and verification

## Root cause

Two separate mechanisms, both confirmed by inspection rather than guessed:

**1. The `/topic/` route was answered by a generator, not by your lessons.**
`researched-topic-pages.js` listens on `hashchange`, intercepts any
`#/topic/<slug>` hash, and renders its own page built from a template — the
same questions for every topic with the name substituted ("What is a useful
professional habit for **Revenue**?" / "…for **Assets**?"). It did this whether
or not an authored lesson existed. The authored lessons were present and
correct the whole time; that route never reached them.

**2. The curriculum page links to those routes.**
`roadmap-ui.js` builds links as `#/topic/<level>-<module>-<title>`. The left
sidebar already linked correctly to `#/c-revenue`, which is why the bug appears
when navigating from the curriculum page and not from the rail.

This is not a React app and there is no shared quiz object, no `currentTopic`
global, and no stale `useState`. I checked: the authored lessons are separate
objects, and **0 of them are overwritten** by the `research-overrides-*` files.
The data model was already isolated. The routing was not.

## Changes made

**Source fix — `researched-topic-pages.js`:** its `route()` now returns early
when an authored lesson exists for that topic, so the generator can never
answer a route that has real content. This is the actual fix, not a redirect.

**Canonical URLs — `app.js`:** `#/topic/<slug>` resolves to the authored lesson
id and redirects, using the same slug-matching rules that file uses internally.
Old links, bookmarks and the curriculum page all land on the real lesson, and
the URL uniquely determines the content rendered.

**Quiz stems — the Level 0/1 importer:** 8 questions were shared across topics
because your source documents reuse generic stems ("Which statement is true?").
Repeated or very short stems are now prefixed with the topic name.

## Topic coverage

    topics discovered            : 227
    with authored lessons        : 227
    reaching their own lesson    : 227  (0 failures)
    showing templated content    : 0
    heading matches its lesson   : 227  (0 failures)
    authored quiz questions      : 484
    shared between topics        : 0

## Quiz isolation

Each lesson is a separate object under its own stable id (`c-<slug>`, or the
café lesson id where one is mapped). Quiz state is per-question component state
created fresh on each render, and the page is rebuilt on every hash change, so
no answer, score or index survives a topic change. Progress in `localStorage`
is already keyed per lesson id.

## Tests

`tests/topic-routes.mjs` — walks all 227 topic routes and asserts each reaches
its own lesson, shows no template markers, and renders the right heading. It
also checks quiz-question uniqueness across every authored lesson.

    node tests/topic-routes.mjs .
    topic routes tested        : 227
    not reaching their lesson  : 0
    showing templated content  : 0
    wrong heading for the topic: 0
    shared between topics      : 0
    TOPIC ROUTE TEST: PASS

Also passing: curriculum audit (227/227), learning graph (0 dangling, 0 cycles),
58 scripts with 0 execution failures, 0 invalid nesting, 0 empty paragraphs.

Your three screenshotted URLs, verified individually:

    /topic/0-finance-basics-personal-finance-vs-corporate-finance-vs-investing
      → Personal finance vs corporate finance vs investing
    /topic/0-finance-basics-revenue  → Revenue  ("Revenue: revenue is…")
    /topic/0-finance-basics-assets   → Assets   ("Assets: an asset is…")

## Remaining issues — stated, not hidden

- **The curriculum page still emits `#/topic/…` links.** They now resolve
  correctly via the redirect, but the cleaner fix is to change `roadmap-ui.js`
  to link straight to the lesson id. That file lives in `js/` and I have not
  modified it, to avoid a second copy fighting the one in your repo.
- **`research-overrides-l23.js` and `research-overrides-l45.js` still load.**
  They do not overwrite any authored lesson today (verified: 0 of 199), but
  they exist to fill topics that are now all authored, so they are dead weight
  and could be removed.
- 72 lessons in Levels 1-10 still end in a calculator rather than a Bombay Bean
  spreadsheet.
