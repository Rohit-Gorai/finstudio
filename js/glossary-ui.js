/* Glossary UI: the browsable page, the in-place popover, and the auto-linker
   that turns terms inside lesson prose into openable definitions. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  var LEVEL = {
    beginner: { dot: "🟢", label: "Beginner" },
    intermediate: { dot: "🟡", label: "Intermediate" },
    advanced: { dot: "🔴", label: "Advanced" }
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ================= the popover ================= */
  var pop = null, popOpener = null;

  function closePop(refocus) {
    if (!pop) return;
    pop.remove();
    pop = null;
    if (refocus && popOpener) popOpener.focus();
    popOpener = null;
  }

  function openPop(term, anchor) {
    closePop(false);
    var t = LS.glossaryLookup(term);
    if (!t) return;
    popOpener = anchor;

    pop = document.createElement("div");
    pop.className = "gloss-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", t.term + " — definition");

    var lv = LEVEL[t.level] || LEVEL.beginner;
    var html =
      '<button class="gloss-close" type="button" aria-label="Close definition">×</button>' +
      '<p class="gloss-term">' + esc(t.term) +
      ' <span class="gloss-level" title="' + lv.label + '"><span aria-hidden="true">' + lv.dot + "</span> " + lv.label + "</span></p>" +
      '<p class="gloss-plain">' + esc(t.plain) + "</p>" +
      '<p class="gloss-def">' + esc(t.def) + "</p>";
    if (t.fx) html += '<p class="gloss-fx">' + esc(t.fx) + "</p>";
    if (t.related.length) {
      html += '<p class="gloss-related"><span>Related:</span> ' + t.related.map(function (r) {
        return '<button type="button" class="gloss-jump" data-term="' + esc(r) + '">' + esc(r) + "</button>";
      }).join(" · ") + "</p>";
    }
    if (t.lesson && LS.lessons && LS.lessons[t.lesson]) {
      html += '<p class="gloss-lesson"><a href="#/' + t.lesson + '">Learn it: ' +
        esc(LS.lessons[t.lesson].title) + "</a></p>";
    }
    pop.innerHTML = html;
    document.body.appendChild(pop);

    // position under the anchor, kept inside the viewport
    var r = anchor.getBoundingClientRect();
    var w = Math.min(340, window.innerWidth - 24);
    pop.style.width = w + "px";
    var left = Math.max(12, Math.min(r.left, window.innerWidth - w - 12));
    var top = r.bottom + window.scrollY + 6;
    pop.style.left = left + "px";
    pop.style.top = top + "px";

    pop.querySelector(".gloss-close").addEventListener("click", function () { closePop(true); });
    Array.prototype.forEach.call(pop.querySelectorAll(".gloss-jump"), function (b) {
      b.addEventListener("click", function () { openPop(b.dataset.term, anchor); });
    });
    pop.querySelector(".gloss-close").focus();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pop) closePop(true);
  });
  document.addEventListener("click", function (e) {
    if (!pop) return;
    if (pop.contains(e.target)) return;
    if (e.target.classList && e.target.classList.contains("gloss-link")) return;
    closePop(false);
  });

  /* ================= auto-linking =================
     Conservative on purpose: only inside ordinary prose, only whole words,
     only the first occurrence of each term on a page, and never inside a
     heading, formula block, spreadsheet, link or button. A false positive
     is worse than a missed link. */
  var SKIP = { A: 1, BUTTON: 1, INPUT: 1, H1: 1, H2: 1, H3: 1, H4: 1, KBD: 1, CODE: 1 };

  function autoLink(root) {
    if (!LS.glossary) return;
    var seen = {};
    var terms = [];
    LS.glossary.forEach(function (t) {
      terms.push({ name: t.term, key: t.term });
      t.also.forEach(function (a) { terms.push({ name: a, key: t.term }); });
    });
    // longest first, so "Cash flow statement" wins over "Cash flow"
    terms.sort(function (a, b) { return b.name.length - a.name.length; });

    var containers = root.querySelectorAll(
      ".def-card p, .example-card p, .where-box p, .note-box p, .page > p, .mcq-explain p"
    );

    Array.prototype.forEach.call(containers, function (node) {
      terms.forEach(function (t) {
        if (seen[t.key]) return;
        walk(node, t, function () { seen[t.key] = true; });
      });
    });
  }

  function walk(node, term, onHit) {
    var rx = new RegExp("(^|[^\\w-])(" + term.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![\\w-])", "i");
    var kids = Array.prototype.slice.call(node.childNodes);
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k.nodeType === 3) {
        var m = rx.exec(k.nodeValue);
        if (!m) continue;
        var before = k.nodeValue.slice(0, m.index + m[1].length);
        var hit = m[2];
        var after = k.nodeValue.slice(m.index + m[1].length + hit.length);
        var link = document.createElement("button");
        link.type = "button";
        link.className = "gloss-link";
        link.textContent = hit;
        link.setAttribute("aria-label", hit + " — open definition");
        link.dataset.term = term.key;
        link.addEventListener("click", function (e) {
          e.stopPropagation();
          openPop(this.dataset.term, this);
        });
        var frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(link);
        if (after) frag.appendChild(document.createTextNode(after));
        node.replaceChild(frag, k);
        onHit();
        return true;
      }
      if (k.nodeType === 1 && !SKIP[k.tagName] && !k.classList.contains("gloss-link")) {
        if (walk(k, term, onHit)) return true;
      }
    }
    return false;
  }
  LS.autoLinkGlossary = autoLink;

  /* ================= the glossary page ================= */
  LS.renderGlossary = function (content) {
    var ui = LS.ui, el = ui.el;
    ui.setMeta("Finance glossary · FinStudio",
      "Every finance term used on FinStudio, each explained in one plain sentence before the technical definition, with its formula and related concepts.");

    var page = el("div", "page");
    page.appendChild(el("p", "lesson-kicker", "Reference"));
    page.appendChild(el("h1", null, "Finance glossary"));
    page.appendChild(el("p", "lesson-lede",
      "Every term the course uses, each with a plain-English sentence first and the precise definition second. " +
      LS.glossary.length + " terms."));

    // search + level filter
    var bar = el("div", "gloss-bar");
    bar.innerHTML =
      '<label class="visually-hidden" for="glossSearch">Search the glossary</label>' +
      '<input id="glossSearch" type="search" placeholder="Search terms, e.g. EBITDA or working capital" autocomplete="off">' +
      '<span class="gloss-count" aria-live="polite"></span>';
    page.appendChild(bar);

    var listWrap = el("div");
    page.appendChild(listWrap);

    function draw(filter) {
      listWrap.innerHTML = "";
      var q = (filter || "").trim().toLowerCase();
      var groups = LS.glossaryGroups();
      var shown = 0;

      Object.keys(groups).sort().forEach(function (gname) {
        var items = groups[gname].filter(function (t) {
          if (!q) return true;
          return (t.term + " " + t.also.join(" ") + " " + t.plain + " " + t.def).toLowerCase().indexOf(q) >= 0;
        }).sort(function (a, b) { return a.term.localeCompare(b.term); });
        if (!items.length) return;
        shown += items.length;

        listWrap.appendChild(el("h2", null, gname));
        var dl = el("div", "gloss-list");
        items.forEach(function (t) {
          var lv = LEVEL[t.level] || LEVEL.beginner;
          var card = el("div", "gloss-card");
          var h =
            '<p class="gloss-term">' + esc(t.term) +
            ' <span class="gloss-level"><span aria-hidden="true">' + lv.dot + "</span> " + lv.label + "</span></p>" +
            '<p class="gloss-plain">' + esc(t.plain) + "</p>" +
            '<p class="gloss-def">' + esc(t.def) + "</p>";
          if (t.fx) h += '<p class="gloss-fx">' + esc(t.fx) + "</p>";
          if (t.also.length) h += '<p class="gloss-also">Also called: ' + t.also.map(esc).join(", ") + "</p>";
          if (t.related.length) {
            h += '<p class="gloss-related"><span>Related:</span> ' + t.related.map(function (r) {
              return '<button type="button" class="gloss-jump" data-term="' + esc(r) + '">' + esc(r) + "</button>";
            }).join(" · ") + "</p>";
          }
          if (t.lesson && LS.lessons[t.lesson]) {
            h += '<p class="gloss-lesson"><a href="#/' + t.lesson + '">Learn it: ' + esc(LS.lessons[t.lesson].title) + "</a></p>";
          }
          card.innerHTML = h;
          Array.prototype.forEach.call(card.querySelectorAll(".gloss-jump"), function (b) {
            b.addEventListener("click", function () { openPop(b.dataset.term, b); });
          });
          dl.appendChild(card);
        });
        listWrap.appendChild(dl);
      });

      if (!shown) {
        listWrap.appendChild(el("p", "note-box", "<p>No term matches “" + esc(q) + "”. Try a shorter word — the search looks inside definitions too.</p>"));
      }
      bar.querySelector(".gloss-count").textContent = shown + " of " + LS.glossary.length + " terms";
    }

    draw("");
    bar.querySelector("#glossSearch").addEventListener("input", function () { draw(this.value); });

    content.innerHTML = "";
    content.appendChild(page);
  };
})();
