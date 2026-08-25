/* FinStudio app: hash router, sidebar, progress store, lesson renderer.
   Adding a lesson = one object in a module file + one manifest entry;
   nothing in this file changes per lesson. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});
  var fmt = LS.fmt;

  /* ================= progress store (localStorage, degrades to memory) ================= */
  var store = (function () {
    var KEY = "finstudio-progress-v1";
    var mem = null;
    function load() {
      if (mem) return mem;
      try { mem = JSON.parse(localStorage.getItem(KEY) || "{}"); }
      catch (e) { mem = {}; }
      return mem;
    }
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* memory-only */ }
    }
    return {
      lesson: function (id) {
        var all = load();
        if (!all[id]) all[id] = { items: {}, sheets: {} };
        if (!all[id].items) all[id].items = {};
        if (!all[id].sheets) all[id].sheets = {};
        return all[id];
      },
      markItem: function (lessonId, itemId) {
        this.lesson(lessonId).items[itemId] = true;
        save();
      },
      saveCell: function (lessonId, sheetId, addr, raw) {
        var l = this.lesson(lessonId);
        if (!l.sheets[sheetId]) l.sheets[sheetId] = {};
        l.sheets[sheetId][addr] = raw;
        save();
      },
      clearSheet: function (lessonId, sheetId) {
        var l = this.lesson(lessonId);
        delete l.sheets[sheetId];
        save();
      },
      quiz: function (code, score) {
        var l = this.lesson("quiz-" + code);
        if (score != null) { l.items.score = score; save(); }
        return l.items.score;
      },
      isDone: function (lessonId) {
        var lesson = LS.lessons[lessonId];
        if (!lesson) return false;
        var need = requiredItems(lesson);
        if (!need.length) return false;
        var have = this.lesson(lessonId).items;
        return need.every(function (id) { return have[id]; });
      }
    };
  })();
  LS.store = store;

  // Have all this lesson's sandboxes been solved? The share card hangs off
  // this rather than off whole-lesson completion: the card celebrates the
  // sheet tying, not the MCQ underneath it.
  function sheetsDone(lesson) {
    var ids = [];
    (lesson.body || []).forEach(function (b, i) {
      if (b.t === "sheet") ids.push(b.sheet.id || "sheet" + i);
    });
    if (!ids.length) return false;
    var have = store.lesson(lesson.id).items;
    return ids.every(function (x) { return have[x]; });
  }

  function requiredItems(lesson) {
    var ids = [];
    (lesson.body || []).forEach(function (b, i) {
      if (b.t === "sheet") ids.push(b.sheet.id || "sheet" + i);
      if (b.t === "mcq") ids.push("mcq" + i);
      if (b.t === "classify") ids.push("classify" + i);
    });
    return ids;
  }

  /* ================= tiny DOM helpers ================= */
  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ================= manifest access ================= */
  function allLessonIdsInOrder() {
    var out = [];
    LS.manifest.levels.forEach(function (lv) {
      lv.modules.forEach(function (mc) {
        out = out.concat(LS.manifest.modules[mc].lessons);
      });
    });
    return out;
  }
  function moduleOf(lessonId) {
    var found = null;
    Object.keys(LS.manifest.modules).forEach(function (mc) {
      if (LS.manifest.modules[mc].lessons.indexOf(lessonId) >= 0) found = mc;
    });
    return found;
  }
  function moduleProgress(code) {
    var m = LS.manifest.modules[code];
    var done = m.lessons.filter(function (id) { return store.isDone(id); }).length;
    return { done: done, total: m.lessons.length };
  }
  function moduleMinutes(code) {
    return LS.manifest.modules[code].lessons.reduce(function (a, id) {
      return a + ((LS.lessons[id] && LS.lessons[id].minutes) || 4);
    }, 0);
  }

  /* ================= sidebar ================= */
  function buildSidebar() {
    var nav = document.getElementById("sidebar");
    nav.innerHTML = "";
    var hash = currentRoute();
    LS.manifest.levels.forEach(function (lv) {
      nav.appendChild(el("div", "side-level", esc(lv.title)));
      lv.modules.forEach(function (mc) {
        var m = LS.manifest.modules[mc];
        var wrap = el("div", "side-module");
        var prog = moduleProgress(mc);
        var head = el("a", "side-module-head");
        head.href = "#/module/" + mc;
        head.innerHTML = '<span class="side-module-title">' + esc(m.title) + '</span>' +
          '<span class="side-progress">' + prog.done + "/" + prog.total + "</span>";
        wrap.appendChild(head);
        var ul = el("ul", "side-lessons");
        m.lessons.forEach(function (id) {
          var lesson = LS.lessons[id];
          if (!lesson) return;
          var li = el("li");
          var a = el("a");
          a.href = "#/" + id;
          if (hash.kind === "lesson" && hash.id === id) a.className = "active";
          a.innerHTML = '<span class="side-lesson-title">' + esc(lesson.short || lesson.title) + '</span>' +
            (store.isDone(id) ? '<span class="side-done" aria-label="completed">✓</span>' : "");
          li.appendChild(a);
          ul.appendChild(li);
        });
        if (LS.quizzes && LS.quizzes[mc]) {
          var qli = el("li", "side-quiz-link");
          var qa = el("a");
          qa.href = "#/quiz/" + mc;
          if (hash.kind === "quiz" && hash.id === mc) qa.className = "active";
          var sc = store.quiz(mc);
          qa.innerHTML = '<span class="side-lesson-title">Module quiz</span>' +
            (sc != null ? '<span class="side-done">' + sc + "/5</span>" : "");
          qli.appendChild(qa);
          ul.appendChild(qli);
        }
        wrap.appendChild(ul);
        nav.appendChild(wrap);
      });
    });
    if (LS.reference) {
      nav.appendChild(el("div", "side-level", "Reference"));
      var rwrap = el("div", "side-module");
      var rul = el("ul", "side-lessons");
      Object.keys(LS.reference).forEach(function (rid) {
        var li = el("li"), a = el("a");
        a.href = "#/ref/" + rid;
        if (hash.kind === "ref" && hash.id === rid) a.className = "active";
        a.innerHTML = '<span class="side-lesson-title">' + esc(LS.reference[rid].title) + "</span>";
        li.appendChild(a);
        rul.appendChild(li);
      });
      if (LS.glossary) {
        var gli = el("li"), ga = el("a");
        ga.href = "#/glossary";
        if (hash.kind === "glossary") ga.className = "active";
        ga.innerHTML = '<span class="side-lesson-title">Glossary</span>' +
          '<span class="side-done" style="font-family:var(--font-mono);font-size:.72rem;color:var(--ink-faint)">' + LS.glossary.length + "</span>";
        gli.appendChild(ga);
        rul.appendChild(gli);
      }
      rwrap.appendChild(rul);
      nav.appendChild(rwrap);
    }
  }

  /* ================= block renderers ================= */
  var blockRenderers = {
    p: function (b) { return el("p", null, b.h); },
    h2: function (b) { return el("h2", null, esc(b.text)); },
    h3: function (b) { return el("h3", null, esc(b.text)); },
    def: function (b) {
      var d = el("div", "def-card");
      d.appendChild(el("p", "def-term", esc(b.term)));
      d.appendChild(el("p", null, b.h));
      return d;
    },
    formula: function (b) {
      var d = el("div", "formula-block");
      if (b.title) d.appendChild(el("div", "fx-title", esc(b.title)));
      (b.lines || []).forEach(function (line) { d.appendChild(el("div", "fx-line", line)); });
      if (b.note) d.appendChild(el("div", "fx-note", b.note));
      return d;
    },
    example: function (b) {
      var d = el("div", "example-card");
      d.appendChild(el("div", "ex-tag", "Real-life example · " + LS.C.name));
      d.appendChild(el("div", null, b.h));
      return d;
    },
    where: function (b) {
      var d = el("div", "where-box");
      d.appendChild(el("span", "where-tag", "Where this number goes"));
      d.appendChild(el("p", null, b.h));
      return d;
    },
    note: function (b) { return el("div", "note-box", "<p>" + b.h + "</p>"); },
    svg: function (b) {
      var d = el("figure", "table-wrap");
      d.style.margin = "1.4rem 0";
      d.innerHTML = b.h + (b.caption ? '<figcaption class="sheet-msg" style="margin-top:.4rem">' + b.caption + "</figcaption>" : "");
      return d;
    },
    table: function (b) {
      var wrap = el("div", "table-wrap");
      var t = el("table", "ls-table");
      if (b.head) {
        var tr = el("tr");
        b.head.forEach(function (h, i) {
          tr.appendChild(el("th", (b.numCols || []).indexOf(i) >= 0 ? "num" : null, h));
        });
        var thead = el("thead"); thead.appendChild(tr); t.appendChild(thead);
      }
      var tbody = el("tbody");
      (b.rows || []).forEach(function (row) {
        var tr = el("tr", row.total ? "total" : null);
        (row.cells || row).forEach(function (cdef, i) {
          tr.appendChild(el("td", (b.numCols || []).indexOf(i) >= 0 ? "num" : null, cdef));
        });
        tbody.appendChild(tr);
      });
      t.appendChild(tbody);
      wrap.appendChild(t);
      return wrap;
    },
    sheet: function (b, ctx, idx) { return renderSheet(b.sheet, ctx, b.sheet.id || "sheet" + idx); },
    mcq: function (b, ctx, idx) { return renderMCQ(b, ctx, "mcq" + idx); },
    classify: function (b, ctx, idx) { return renderClassify(b, ctx, "classify" + idx); },
    compare: function (b) {
      var grid = el("div", "compare-grid");
      [b.left, b.right].forEach(function (side) {
        var card = el("div", "compare-card");
        card.appendChild(el("h4", null, esc(side.title)));
        var t = el("table"), tb = el("tbody");
        side.rows.forEach(function (r) {
          var tr = el("tr", r[2] === "total" ? "total" : null);
          tr.appendChild(el("td", null, r[0]));
          tr.appendChild(el("td", "num", r[1]));
          tb.appendChild(tr);
        });
        t.appendChild(tb); card.appendChild(t); grid.appendChild(card);
      });
      return grid;
    }
  };

  /* ================= MCQ ================= */
  function renderMCQ(b, ctx, itemId) {
    var wrap = el("div", "mcq-block");
    wrap.appendChild(el("div", "mcq-tag", b.tag || "Check yourself"));
    wrap.appendChild(el("p", "mcq-q", b.q));
    var ul = el("ul", "mcq-opts");
    var explainBox = el("div");
    var answered = ctx && store.lesson(ctx.lessonId).items[itemId];
    b.opts.forEach(function (opt, i) {
      var li = el("li");
      var btn = el("button", null, esc(opt));
      btn.type = "button";
      btn.addEventListener("click", function () {
        var right = i === b.correct;
        Array.prototype.forEach.call(ul.querySelectorAll("button"), function (x) {
          x.classList.remove("picked-wrong");
        });
        explainBox.innerHTML = "";
        var why = (b.why && b.why[i]) || (right ? b.explain : null);
        var msg = el("div", "mcq-explain" + (right ? "" : " wrong"));
        msg.innerHTML = "<p><strong>" + (right ? "Correct." : "Not quite.") + "</strong> " + (why || (right ? "" : "Think about it once more and try again.")) + "</p>";
        explainBox.appendChild(msg);
        if (right) {
          btn.classList.add("picked-right");
          Array.prototype.forEach.call(ul.querySelectorAll("button"), function (x) { x.disabled = true; });
          if (ctx) { store.markItem(ctx.lessonId, itemId); buildSidebar(); }
          if (ctx && ctx.onItemDone) ctx.onItemDone();
        } else {
          btn.classList.add("picked-wrong");
        }
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    wrap.appendChild(explainBox);
    if (answered) {
      var btns = ul.querySelectorAll("button");
      if (btns[b.correct]) btns[b.correct].classList.add("picked-right");
    }
    return wrap;
  }

  /* ================= classification exercise ================= */
  function renderClassify(b, ctx, itemId) {
    var wrap = el("div", "classify-block");
    wrap.appendChild(el("div", "mcq-tag", b.tag || "Classify"));
    if (b.intro) wrap.appendChild(el("p", "mcq-q", b.intro));
    var doneCount = 0, total = b.items.length;
    var alreadyDone = ctx && store.lesson(ctx.lessonId).items[itemId];
    b.items.forEach(function (item) {
      var row = el("div", "classify-item");
      row.appendChild(el("span", "classify-text", item.text));
      var btns = el("div", "classify-btns");
      var fb = el("p", "classify-feedback", "");
      var solved = false;
      b.buckets.forEach(function (bucket) {
        var btn = el("button", null, esc(bucket));
        btn.type = "button";
        btn.addEventListener("click", function () {
          if (solved) return;
          if (bucket === item.bucket) {
            solved = true;
            Array.prototype.forEach.call(btns.querySelectorAll("button"), function (x) {
              x.classList.remove("picked-wrong");
              if (x === btn) x.classList.add("picked-right");
              x.disabled = true;
            });
            fb.innerHTML = item.why || "";
            doneCount++;
            if (doneCount === total && ctx) {
              store.markItem(ctx.lessonId, itemId);
              buildSidebar();
              if (ctx.onItemDone) ctx.onItemDone();
            }
          } else {
            btn.classList.add("picked-wrong");
            fb.innerHTML = item.whyNot && item.whyNot[bucket] ? item.whyNot[bucket] : "Not that one — read the definition again.";
          }
        });
        btns.appendChild(btn);
      });
      if (alreadyDone) {
        Array.prototype.forEach.call(btns.querySelectorAll("button"), function (x) {
          if (x.textContent === item.bucket) x.classList.add("picked-right");
          x.disabled = true;
        });
        solved = true;
      }
      row.appendChild(btns);
      row.appendChild(fb);
      wrap.appendChild(row);
    });
    return wrap;
  }

  /* ================= spreadsheet interaction =================
     Behaves the way Excel and Google Sheets do, because that is what a
     learner's muscle memory expects. */
  var clipboard = { raw: "", from: null };

  LS.sheetKeys = function (e, api) {
    var input = api.input, sheet = api.sheet, inputs = api.inputs;
    var here = LS.cellAddr.parseAddr(input.dataset.addr);
    if (!here) return;
    var mod = e.ctrlKey || e.metaKey;

    function seek(dc, dr) {
      for (var i = 1; i <= 60; i++) {
        var c = here.c + dc * i, r = here.r + dr * i;
        if (c < 1 || r < 1) return null;
        if (c > sheet.cols + 2 && dc > 0) return null;
        if (r > sheet.rows + 2 && dr > 0) return null;
        var a = LS.cellAddr.addr(c, r);
        if (inputs[a]) return a;
      }
      return null;
    }
    function go(dc, dr) {
      var a = seek(dc, dr);
      if (!a) return false;
      api.commit(input); inputs[a].focus(); return true;
    }
    function setCell(addr, raw) {
      if (!inputs[addr]) return false;
      api.pushUndo();
      sheet.setRaw(addr, raw); api.save(addr, raw);
      inputs[addr].value = raw; api.refresh(); return true;
    }

    var k = e.key;
    if (mod && (k === "c" || k === "C")) {
      api.commit(input);
      clipboard = { raw: sheet.raw(input.dataset.addr), from: input.dataset.addr };
      api.say("Copied " + input.dataset.addr); e.preventDefault(); return;
    }
    if (mod && (k === "x" || k === "X")) {
      api.commit(input);
      clipboard = { raw: sheet.raw(input.dataset.addr), from: input.dataset.addr };
      setCell(input.dataset.addr, ""); api.say("Cut " + input.dataset.addr);
      e.preventDefault(); return;
    }
    if (mod && (k === "v" || k === "V")) {
      e.preventDefault();
      if (!clipboard.from) { api.say("Nothing copied yet — press Ctrl+C on a cell first."); return; }
      var src = LS.cellAddr.parseAddr(clipboard.from);
      var raw = LS.shiftFormula(clipboard.raw, here.c - src.c);
      raw = LS.shiftRows(raw, here.r - src.r);
      setCell(input.dataset.addr, raw);
      api.say("Pasted into " + input.dataset.addr + (raw ? ": " + raw : ""));
      return;
    }
    if (mod && (k === "d" || k === "D")) {
      e.preventDefault();
      var above = LS.cellAddr.addr(here.c, here.r - 1);
      if (!sheet.cell(above)) { api.say("Nothing above to fill from."); return; }
      var f = LS.shiftRows(sheet.raw(above), 1);
      setCell(input.dataset.addr, f); api.say("Filled down from " + above); return;
    }
    if (mod && (k === "r" || k === "R")) {
      e.preventDefault();
      var left = LS.cellAddr.addr(here.c - 1, here.r);
      if (!sheet.cell(left)) { api.say("Nothing to the left to fill from."); return; }
      var f2 = LS.shiftFormula(sheet.raw(left), 1);
      setCell(input.dataset.addr, f2); api.say("Filled right from " + left); return;
    }
    if (mod && (k === "z" || k === "Z")) { e.preventDefault(); api.undo(); return; }
    if (mod && (k === "y" || k === "Y")) { e.preventDefault(); api.redo(); return; }
    if ((k === "Delete" || k === "Backspace") && input.value === "") {
      e.preventDefault(); setCell(input.dataset.addr, ""); return;
    }
    if (k === "Tab") { e.preventDefault(); go(e.shiftKey ? -1 : 1, 0); return; }
    if (k === "Enter") {
      e.preventDefault();
      if (!go(0, e.shiftKey ? -1 : 1)) { api.commit(input); input.blur(); }
      return;
    }
    if (k === "Escape") {
      e.preventDefault();
      input.value = sheet.raw(input.dataset.addr); input.select(); return;
    }
    if (k === "F2") {
      e.preventDefault();
      var v = input.value; input.setSelectionRange(v.length, v.length); return;
    }
    var atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    var atEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
    var whole = input.selectionStart === 0 && input.selectionEnd === input.value.length;
    if (k === "ArrowDown") { e.preventDefault(); go(0, 1); }
    else if (k === "ArrowUp") { e.preventDefault(); go(0, -1); }
    else if (k === "ArrowRight" && (whole || atEnd || !input.value)) { e.preventDefault(); go(1, 0); }
    else if (k === "ArrowLeft" && (whole || atStart || !input.value)) { e.preventDefault(); go(-1, 0); }
  };

  // "Copy formula right" — the button that teaches what fill-right does.
  LS.copyRight = function (sheet, from, inputs) {
    var raw = sheet.raw(from);
    if (!raw || raw.charAt(0) !== "=") return null;
    var here = LS.cellAddr.parseAddr(from);
    var to = LS.cellAddr.addr(here.c + 1, here.r);
    if (!inputs[to]) return { addr: to, raw: raw, note: to + " isn't an editable cell — nothing to copy into." , skipped: true };
    var shifted = LS.shiftFormula(raw, 1);
    sheet.setRaw(to, shifted);
    inputs[to].value = shifted;
    return { addr: to, raw: shifted, note: from + " " + raw + "  →  " + to + " " + shifted + " (every column letter moved one across)" };
  };

  /* ================= the spreadsheet ================= */
  function renderSheet(cfg, ctx, itemId) {
    var sheet = new LS.Sheet(cfg);
    // restore saved work
    if (ctx) {
      var saved = store.lesson(ctx.lessonId).sheets[itemId] || {};
      Object.keys(saved).forEach(function (a) { sheet.setRaw(a, saved[a]); });
    }

    var block = el("section", "sheet-block");
    var head = el("div", "sheet-head");
    head.appendChild(el("span", "sheet-tag", "Build it"));
    head.appendChild(el("span", "sheet-title", esc(cfg.title || "Sandbox")));
    block.appendChild(head);
    if (cfg.hint) block.appendChild(el("p", "sheet-hint", cfg.hint));

    var fbar = el("div", "formula-bar");
    var fbAddr = el("span", "fb-addr", "—");
    var fbRaw = el("span", null, "");
    fbar.appendChild(fbAddr); fbar.appendChild(fbRaw);
    block.appendChild(fbar);

    var scroll = el("div", "sheet-scroll");
    var table = el("table", "sheet");
    table.setAttribute("role", "grid");
    var inputs = {}; // addr -> input element
    var selected = null;
    var undoStack = [], redoStack = [];
    function snapshot() { var s = {}; Object.keys(inputs).forEach(function (a) { s[a] = sheet.raw(a); }); return s; }
    function restore(s) {
      Object.keys(s).forEach(function (a) {
        sheet.setRaw(a, s[a]);
        if (ctx) store.saveCell(ctx.lessonId, itemId, a, s[a]);
        if (inputs[a]) inputs[a].value = s[a];
      });
      refreshDisplays();
    }
    function pushUndo() { undoStack.push(snapshot()); if (undoStack.length > 50) undoStack.shift(); redoStack = []; }

    // header row: corner + A B C ...
    var thr = el("tr");
    thr.appendChild(el("th", null, ""));
    for (var c = 1; c <= sheet.cols; c++) thr.appendChild(el("th", null, LS.cellAddr.numToCol(c)));
    var thead = el("thead"); thead.appendChild(thr); table.appendChild(thead);

    var tbody = el("tbody");
    for (var r = 1; r <= sheet.rows; r++) {
      var tr = el("tr");
      tr.appendChild(el("td", "rowhead", String(r)));
      for (var c2 = 1; c2 <= sheet.cols; c2++) {
        var a = LS.cellAddr.addr(c2, r);
        var cell = sheet.cell(a);
        var td = el("td");
        if (!cell) { td.className = "label-cell"; td.appendChild(el("span", "cell-static", "")); }
        else if (cell.ro) {
          if (cell.year) td.className = "year-cell";
          else if (cell.label) td.className = "label-cell";
          else td.className = "num-cell";
          td.appendChild(el("span", "cell-static", displayOf(sheet, a)));
        } else {
          var input = document.createElement("input");
          input.className = "cell-input";
          input.type = "text";
          input.autocomplete = "off";
          input.spellcheck = false;
          input.setAttribute("aria-label", "Cell " + a + rowContext(sheet, r));
          if (cell.ph) input.placeholder = cell.ph;
          input.dataset.addr = a;
          input.value = displayOf(sheet, a);
          bindCellEvents(input, td);
          inputs[a] = input;
          td.appendChild(input);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    scroll.appendChild(table);
    block.appendChild(scroll);

    function rowContext(sheet, r) {
      var lbl = sheet.value("A" + r);
      return typeof lbl === "string" && lbl ? ", " + lbl : "";
    }
    function displayOf(sheet, a) {
      var v = sheet.value(a);
      if (v == null) return "";
      if (v && v.err) return v.err;
      var cell = sheet.cell(a);
      return fmt.cell(v, cell && cell.fmt);
    }
    function refreshDisplays() {
      Object.keys(inputs).forEach(function (a) {
        var input = inputs[a];
        if (document.activeElement === input) return;
        input.value = displayOf(sheet, a);
        var v = sheet.value(a);
        input.classList.toggle("cell-error", !!(v && v.err));
      });
      updateTie();
    }
    function commit(input) {
      var a = input.dataset.addr;
      var raw = input.value.trim();
      // if the user re-focused and saw the formatted value, don't treat re-blur as an edit
      if (raw === displayOf(sheet, a) && !input.dataset.dirty) return;
      pushUndo();
      sheet.setRaw(a, raw);
      if (ctx) store.saveCell(ctx.lessonId, itemId, a, raw);
      delete input.dataset.dirty;
      refreshDisplays();
      fbRaw.textContent = sheet.raw(a);
    }
    function bindCellEvents(input, td) {
      input.addEventListener("focus", function () {
        selected = input.dataset.addr;
        // Swap the pretty display for the editable raw text — but only if the
        // box still shows the display. Anything else means an edit is already
        // in flight and must not be clobbered.
        if (input.value === displayOf(sheet, selected)) {
          input.value = sheet.raw(selected);
          // Select it, so typing replaces the cell like a spreadsheet does.
          // A mouse click collapses this to a caret on mouseup, which is what
          // someone editing an existing formula wants.
          input.select();
        }
        fbAddr.textContent = selected;
        fbRaw.textContent = sheet.raw(selected);
        Array.prototype.forEach.call(tbody.querySelectorAll("td.cell-selected"), function (x) { x.classList.remove("cell-selected"); });
        td.classList.add("cell-selected");
      });
      input.addEventListener("input", function () { input.dataset.dirty = "1"; fbRaw.textContent = input.value; });
      input.addEventListener("blur", function () { commit(input); input.value = displayOf(sheet, input.dataset.addr); });
      input.addEventListener("keydown", function (e) {
        if (!LS.sheetKeys) return;
        LS.sheetKeys(e, {
          input: input, sheet: sheet, inputs: inputs, commit: commit,
          refresh: refreshDisplays,
          save: function (a, raw) { if (ctx) store.saveCell(ctx.lessonId, itemId, a, raw); },
          say: function (t) { msg.textContent = t; },
          pushUndo: pushUndo,
          undo: function () {
            if (!undoStack.length) { msg.textContent = "Nothing to undo."; return; }
            redoStack.push(snapshot()); restore(undoStack.pop()); msg.textContent = "Undone.";
          },
          redo: function () {
            if (!redoStack.length) { msg.textContent = "Nothing to redo."; return; }
            undoStack.push(snapshot()); restore(redoStack.pop()); msg.textContent = "Redone.";
          }
        });
      });
    }

    /* tie meter — one pair, or one row per projected year */
    var tieBox = null;
    function tiePairs() {
      if (!cfg.tie) return [];
      return cfg.tie.pairs || [{ a: cfg.tie.a, le: cfg.tie.le, label: null }];
    }
    function updateTie() {
      if (!cfg.tie || !tieBox) return;
      var pairs = tiePairs(), multi = !!cfg.tie.pairs;
      tieBox.innerHTML = "";
      var tiedCount = 0, live = 0;
      pairs.forEach(function (pr) {
        var A = sheet.value(pr.a), L = sheet.value(pr.le);
        var an = typeof A === "number" ? A : null, ln = typeof L === "number" ? L : null;
        var diff = (an != null && ln != null) ? an - ln : null;
        if (an != null && ln != null) live++;
        if (diff === 0 && an !== 0) tiedCount++;
        if (multi) {
          var row = el("div", "tie-row");
          row.appendChild(el("span", null, esc(pr.label || pr.a)));
          row.appendChild(el("span", null, diff == null ? "—" : (diff === 0 ? "ties ✓" : fmt.inr(diff) + " out")));
          tieBox.appendChild(row);
        } else {
          var r1 = el("div", "tie-row");
          r1.appendChild(el("span", null, esc(cfg.tie.aLabel || "Total assets")));
          r1.appendChild(el("span", null, an != null ? fmt.inr(an) : "—"));
          var r2 = el("div", "tie-row");
          r2.appendChild(el("span", null, esc(cfg.tie.leLabel || "Total liabilities + equity")));
          r2.appendChild(el("span", null, ln != null ? fmt.inr(ln) : "—"));
          tieBox.appendChild(r1); tieBox.appendChild(r2);
          var v1 = el("div", "tie-verdict");
          v1.appendChild(el("span", null, diff === 0 && an !== 0 ? "It ties ✓" : "Difference A − (L+E)"));
          v1.appendChild(el("span", "tie-badge", diff == null ? "—" : fmt.inr(diff)));
          tieBox.appendChild(v1);
        }
      });
      var allTied = tiedCount === pairs.length;
      if (multi) {
        var v = el("div", "tie-verdict");
        v.appendChild(el("span", null, allTied ? "Every year ties ✓" : "Years tying"));
        v.appendChild(el("span", "tie-badge", tiedCount + " / " + pairs.length));
        tieBox.appendChild(v);
      }
      tieBox.className = "tie-meter " + (allTied ? "tied" : "untied");
    }
    if (cfg.tie) {
      tieBox = el("div", "tie-meter untied");
      tieBox.setAttribute("aria-live", "polite");
      block.appendChild(tieBox);
      updateTie();
    }

    /* toolbar: check + copy-right + reset */
    var bar = el("div", "sheet-toolbar");
    var checkBtn = el("button", "btn btn-primary", "Check my sheet");
    checkBtn.type = "button";
    var resetBtn = el("button", "btn btn-ghost btn-small", "Reset");
    resetBtn.type = "button";
    var msg = el("span", "sheet-msg", "");
    bar.appendChild(checkBtn);
    // only worth offering where there is a column to copy into
    if (LS.copyRight && sheet.cols > 2) {
      var cpBtn = el("button", "btn btn-ghost btn-small", "Copy formula right →");
      cpBtn.type = "button";
      cpBtn.title = "Rewrites the selected cell's formula into the next column — what fill-right does in Excel";
      cpBtn.addEventListener("click", function () {
        if (!selected) { msg.textContent = "Select a formula cell first."; return; }
        var out = LS.copyRight(sheet, selected, inputs);
        if (out && !out.skipped && ctx) store.saveCell(ctx.lessonId, itemId, out.addr, out.raw);
        msg.textContent = out ? out.note : "Select a cell containing a formula, then copy it right.";
        refreshDisplays();
      });
      bar.appendChild(cpBtn);
    }
    bar.appendChild(resetBtn);
    bar.appendChild(msg);
    block.appendChild(bar);

    var legend = el("div", "sheet-shortcuts");
    legend.innerHTML = [
      "<span><kbd>Tab</kbd> next cell</span>", "<span><kbd>Enter</kbd> down</span>",
      "<span><kbd>F2</kbd> edit</span>", "<span><kbd>Ctrl</kbd>+<kbd>D</kbd> fill down</span>",
      "<span><kbd>Ctrl</kbd>+<kbd>R</kbd> fill right</span>",
      "<span><kbd>Ctrl</kbd>+<kbd>C</kbd>/<kbd>V</kbd> copy &amp; paste</span>",
      "<span><kbd>Ctrl</kbd>+<kbd>Z</kbd> undo</span>"
    ].join("");
    block.appendChild(legend);

    var results = el("ul", "check-results");
    results.setAttribute("aria-live", "polite");
    block.appendChild(results);

    checkBtn.addEventListener("click", function () {
      // commit any in-progress edit first
      if (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("cell-input")) {
        commit(document.activeElement);
      }
      var out = sheet.runChecks(cfg.checks || []);
      results.innerHTML = "";
      var allOk = out.length > 0;
      out.forEach(function (r) {
        var li = el("li", r.ok ? "ok" : "bad");
        li.appendChild(el("span", "ck-icon", r.ok ? "✓" : "✗"));
        li.appendChild(el("span", null, r.message + (!r.ok && r.detail ? " — " + esc(r.detail) : "")));
        results.appendChild(li);
        if (!r.ok) allOk = false;
        // colour the checked cell
        if (r.ok !== undefined && cfgCellOf(r, cfg)) {
          var inp = inputs[cfgCellOf(r, cfg)];
          if (inp) { inp.parentElement.classList.toggle("cell-ok", r.ok); inp.parentElement.classList.toggle("cell-bad", !r.ok); }
        }
      });
      if (allOk) {
        var li = el("li", "ok");
        li.appendChild(el("span", "ck-icon", "★"));
        li.appendChild(el("span", null, cfg.success || "All checks pass. On to the next lesson."));
        results.appendChild(li);
        if (ctx) { store.markItem(ctx.lessonId, itemId); buildSidebar(); if (ctx.onItemDone) ctx.onItemDone(); }
      }
    });
    function cfgCellOf(r, cfg) {
      var found = null;
      (cfg.checks || []).forEach(function (ck) { if (ck.message === r.message && ck.cell) found = ck.cell; });
      return found;
    }

    resetBtn.addEventListener("click", function () {
      if (ctx) store.clearSheet(ctx.lessonId, itemId);
      var fresh = renderSheet(cfg, ctx, itemId);
      block.parentNode.replaceChild(fresh, block);
    });

    refreshDisplays();
    return block;
  }

  /* ================= motion & chrome =================
     One observer per render. Everything here is a no-op when the visitor
     asks for reduced motion — the content is already in its final position,
     the class just removes the transform. */
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealObserver = null;
  function revealOnScroll(root) {
    var items = root.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (n) { n.classList.add("in"); });
      return;
    }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    Array.prototype.forEach.call(items, function (n) { revealObserver.observe(n); });
  }

  // hairline under the nav, but only once the page has actually moved
  (function () {
    var bar = document.getElementById("topbar");
    if (!bar) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        bar.classList.toggle("scrolled", window.scrollY > 8);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  // nav links that point at a section of the homepage rather than a route
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-scroll]") : null;
    if (!a) return;
    var id = a.getAttribute("data-scroll");
    e.preventDefault();
    function go() {
      var target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
    if (location.hash && location.hash !== "#/" && location.hash !== "#") {
      pendingScroll = id;
      location.hash = "#/";
    } else { go(); }
  });
  var pendingScroll = null;

  /* ================= views ================= */
  var content = document.getElementById("main");

  function setMeta(title, desc) {
    document.title = title;
    var m = document.querySelector('meta[name="description"]');
    if (m && desc) m.setAttribute("content", desc);
  }

  /* ---------- homepage: the live DCF in the hero ----------
     Real arithmetic, not a mock. It runs company.js's own dcf() — the same
     function the 2240 lesson checks against — so the number a visitor drags
     to is the number they would build themselves in module 2200. */
  function heroDemo() {
    if (!LS.C || !LS.C.dcfFn) return null;
    var TG = 0.04;                    // terminal growth, held fixed here
    var wrap = el("section", "demo");
    wrap.innerHTML =
      '<div class="demo-bar">' +
        '<span class="demo-addr">B14</span>' +
        '<span class="demo-fx">fx</span>' +
        '<span class="demo-formula">=SUM(<b>C10:F10</b>)-B12</span>' +
      '</div>' +
      '<div class="demo-body">' +
        '<div class="demo-model">' +
          '<p class="demo-label">Discounted cash flow · ' + esc(LS.C.name) + '</p>' +
          '<table class="demo-rows"><tbody>' +
            '<tr><td>PV of FY26 free cash flow</td><td data-pv="0"></td></tr>' +
            '<tr><td>PV of FY27 free cash flow</td><td data-pv="1"></td></tr>' +
            '<tr><td>PV of FY28 free cash flow</td><td data-pv="2"></td></tr>' +
            '<tr><td>PV of terminal value</td><td data-pvtv></td></tr>' +
            '<tr class="demo-total"><td>Enterprise value</td><td data-ev></td></tr>' +
            '<tr><td>Less: net debt</td><td data-nd></td></tr>' +
          '</tbody></table>' +
          '<div class="demo-slider">' +
            '<div class="demo-slider-head"><label for="demoWacc">Cost of capital (WACC)</label><b data-wacc>12.0%</b></div>' +
            '<input class="demo-range" id="demoWacc" type="range" min="9" max="15" step="0.5" value="12" ' +
              'aria-label="Cost of capital, per cent">' +
            '<p class="demo-hint">Terminal growth held at 4%. Drag it — every figure recalculates.</p>' +
          '</div>' +
        '</div>' +
        '<div class="demo-out">' +
          '<p class="demo-label">Equity value</p>' +
          '<p class="demo-big" data-eq aria-live="polite"></p>' +
          '<p class="demo-cap" data-cap></p>' +
          '<div class="demo-bars">' +
            '<div class="demo-bar-row"><div class="t"><span>Next three years</span><span data-share3></span></div>' +
              '<div class="demo-track"><div class="demo-fill" data-fill3 style="width:0%"></div></div></div>' +
            '<div class="demo-bar-row"><div class="t"><span>Everything after that</span><span data-sharetv></span></div>' +
              '<div class="demo-track"><div class="demo-fill tv" data-filltv style="width:0%"></div></div></div>' +
          '</div>' +
          '<p class="demo-foot">Most of a young company\'s value sits beyond the forecast. ' +
            '<a href="#/2240-dcf">Build this yourself in 2240 &rarr;</a></p>' +
        '</div>' +
      '</div>';

    var q = function (sel) { return wrap.querySelector(sel); };
    var range = q("#demoWacc");
    function paint() {
      var w = parseFloat(range.value) / 100;
      var d = LS.C.dcfFn(w, TG);
      for (var i = 0; i < 3; i++) wrap.querySelector('[data-pv="' + i + '"]').textContent = fmt.inr(d.pv[i]);
      q("[data-pvtv]").textContent = fmt.inr(d.pvTV);
      q("[data-ev]").textContent = fmt.inr(d.ev);
      q("[data-nd]").textContent = fmt.inr(-d.netDebt);
      q("[data-eq]").textContent = fmt.inr(d.equity);
      q("[data-wacc]").textContent = (Math.round(w * 1000) / 10).toFixed(1) + "%";
      q("[data-cap]").textContent = "What the café is worth to its owners at a " +
        (Math.round(w * 1000) / 10).toFixed(1) + "% cost of capital.";
      var near = d.pv[0] + d.pv[1] + d.pv[2];
      var p3 = Math.round(near / d.ev * 100);
      q("[data-share3]").textContent = p3 + "%";
      q("[data-sharetv]").textContent = (100 - p3) + "%";
      q("[data-fill3]").style.width = p3 + "%";
      q("[data-filltv]").style.width = (100 - p3) + "%";
    }
    range.addEventListener("input", paint);
    paint();
    return wrap;
  }

  function renderHome() {
    setMeta("FinStudio — Learn finance by building it",
      "Free, text-only finance school. Learn accounting, the three statements, ratios and modeling by building every number in a live spreadsheet.");

    var lesson1 = LS.manifest.modules[LS.manifest.levels[0].modules[0]].lessons[0];
    var totalLessons = allLessonIdsInOrder().length;
    var totalMin = Object.keys(LS.manifest.modules).reduce(function (a, mc) { return a + moduleMinutes(mc); }, 0);
    // counted from the curriculum itself, never hardcoded for marketing
    var sheetCount = 0, cellCount = 0;
    allLessonIdsInOrder().forEach(function (id) {
      var l = LS.lessons[id];
      if (!l) return;
      (l.body || []).forEach(function (b) {
        if (b.t !== "sheet" || !b.sheet || !b.sheet.grid) return;
        sheetCount++;
        b.sheet.grid.forEach(function (row) {
          row.forEach(function (def) {
            if (def && typeof def === "object" && def.input) cellCount++;
          });
        });
      });
    });

    var page = el("div", "page page-home");

    /* ---- hero ---- */
    var hero = el("section", "hero wrap");
    hero.innerHTML =
      '<p class="eyebrow">No videos · No sign-up · No account</p>' +
      "<h1>Learn finance by building it.</h1>" +
      '<p class="hero-lede">Every lesson ends in a live spreadsheet where <em>you</em> type the formula. Follow one Mumbai café from its first invoice to a full valuation model — and make the balance sheet tie.</p>' +
      '<div class="hero-cta">' +
        '<a class="btn btn-primary" href="#/' + lesson1 + '">Start learning</a>' +
        '<a class="btn btn-ghost" href="#/" data-scroll="curriculum">Explore the curriculum <span class="ar">&rarr;</span></a>' +
      '</div>';
    var demo = heroDemo();
    if (demo) hero.appendChild(demo);
    page.appendChild(hero);

    /* ---- 01 · the formula, not the answer ---- */
    var s1 = el("section", "story wrap reveal");
    s1.innerHTML =
      '<div class="story-grid">' +
        '<div class="story-copy">' +
          '<span class="story-num">01 — Build</span>' +
          "<h2>You type the formula, not the answer.</h2>" +
          "<p>The sandbox reads what you typed, not just what it evaluates to. Where the point of the lesson is the formula, a hardcoded number is marked wrong — even when the number is right. That one rule is the difference between recognising finance and being able to do it.</p>" +
          '<div class="story-stat">' +
            "<div><b>" + (cellCount || 192) + '</b><span>cells you fill in yourself</span></div>' +
            "<div><b>" + (sheetCount || 35) + '</b><span>spreadsheet sandboxes</span></div>' +
          "</div>" +
        "</div>" +
        '<div class="panel">' +
          '<div class="panel-mini-head"><span>Working capital</span><span>B12</span></div>' +
          "<table><tbody>" +
            "<tr><td>Receivables</td><td>" + fmt.inr(LS.C.fy25.bs.receivables) + "</td></tr>" +
            "<tr><td>Inventory</td><td>" + fmt.inr(LS.C.fy25.bs.inventory) + "</td></tr>" +
            "<tr><td>Less: payables</td><td>" + fmt.inr(-LS.C.fy25.bs.payables) + "</td></tr>" +
            '<tr class="proved"><td>Working capital</td><td>' +
              fmt.inr(LS.C.fy25.bs.receivables + LS.C.fy25.bs.inventory - LS.C.fy25.bs.payables) + "</td></tr>" +
          "</tbody></table>" +
          '<p class="panel-caption">You typed <span class="typed-cell">=B9+B10-B11</span> — accepted. The same figure typed as a number is not.</p>' +
        "</div>" +
      "</div>";
    page.appendChild(s1);

    /* ---- 02 · one company ---- */
    var s2 = el("section", "story wrap reveal");
    s2.innerHTML =
      '<div class="story-grid flip">' +
        '<div class="story-copy">' +
          '<span class="story-num">02 — Connect</span>' +
          "<h2>One café. Every number, all the way through.</h2>" +
          "<p>" + esc(LS.C.name) + " runs through all " + totalLessons +
            " lessons. The profit you compute in the income statement capstone is the exact figure sitting inside retained earnings on the balance sheet; the closing cash you build in the cash flow statement is that balance sheet's cash line. Nothing is invented per lesson, so every connection is one you can trace.</p>" +
        "</div>" +
        '<div class="panel">' +
          '<div class="panel-mini-head"><span>FY25 · Income statement</span><span>&#8377;</span></div>' +
          "<table><tbody>" +
            "<tr><td>Revenue</td><td>" + fmt.inr(LS.C.fy25.pl.revenue) + "</td></tr>" +
            "<tr><td>Gross profit</td><td>" + fmt.inr(LS.C.fy25.pl.grossProfit) + "</td></tr>" +
            "<tr><td>EBITDA</td><td>" + fmt.inr(LS.C.fy25.pl.ebitda) + "</td></tr>" +
            "<tr><td>EBIT</td><td>" + fmt.inr(LS.C.fy25.pl.ebit) + "</td></tr>" +
            '<tr class="proved hl"><td>Profit after tax</td><td>' + fmt.inr(LS.C.fy25.pl.pat) + "</td></tr>" +
          "</tbody></table>" +
          '<p class="panel-caption">This exact figure reappears in retained earnings, in the cash flow statement, and in the valuation.</p>' +
        "</div>" +
      "</div>";
    page.appendChild(s2);

    /* ---- 03 · the dark band ---- */
    var band = el("section", "band reveal");
    band.innerHTML =
      '<div class="wrap">' +
        '<span class="story-num" style="color:rgba(245,245,247,.5)">03 — Prove</span>' +
        "<h2>It has to tie.</h2>" +
        "<p>A balance sheet that does not balance is not nearly right, it is wrong. Every capstone carries a live tie meter that watches both sides and refuses to congratulate you until the difference is zero.</p>" +
        '<div class="band-proof">' +
          "<span><i>Assets</i> <b>" + fmt.inr(LS.C.fy25.bs.totalAssets) + "</b></span>" +
          '<span class="eq">=</span>' +
          "<span><i>Liabilities + equity</i> <b>" + fmt.inr(LS.C.fy25.bs.totalLE) + "</b></span>" +
          '<span class="verdict">&#10003; Difference &#8377;0</span>' +
        "</div>" +
      "</div>";
    page.appendChild(band);

    /* ---- 04 · experiment ---- */
    var s4 = el("section", "story wrap reveal");
    s4.innerHTML =
      '<div class="story-grid">' +
        '<div class="story-copy">' +
          '<span class="story-num">04 — Experiment</span>' +
          "<h2>Change one assumption. Watch it move.</h2>" +
          "<p>The sheets are live models, not screenshots. Push receivable days from 30 to 60 and you can watch the cash drain out of a profitable business — which is the only way that lesson ever really lands.</p>" +
        "</div>" +
        '<div class="panel">' +
          '<div class="panel-mini-head"><span>Receivable days</span><span>30 &rarr; 60</span></div>' +
          "<table><tbody>" +
            '<tr><td>Revenue</td><td class="txt">no change</td></tr>' +
            '<tr><td>Profit</td><td class="txt">no change</td></tr>' +
            '<tr class="hl"><td>Receivables</td><td class="txt">&uarr; higher</td></tr>' +
            '<tr class="hl"><td>Working capital</td><td class="txt">&uarr; higher</td></tr>' +
            '<tr class="proved"><td>Cash</td><td class="txt">&darr; lower</td></tr>' +
          "</tbody></table>" +
          '<p class="panel-caption">Profitable and out of cash. Module 1500 makes you build the year that proves it.</p>' +
        "</div>" +
      "</div>";
    page.appendChild(s4);

    /* ---- curriculum ---- */
    var curr = el("section", "wrap reveal");
    curr.id = "curriculum";
    curr.innerHTML =
      '<span class="story-num">The curriculum</span>' +
      '<h2 class="sec-h">Numbered like a chart of accounts.</h2>' +
      '<p class="sec-p">Work top to bottom. Every number you meet later is one you built earlier — ' +
        totalLessons + " lessons, about " + Math.max(1, Math.round(totalMin / 60)) + " hours of reading and building.</p>";
    var rows = el("div", "curriculum");
    LS.manifest.levels.forEach(function (lv) {
      lv.modules.forEach(function (mc) {
        var m = LS.manifest.modules[mc];
        var prog = moduleProgress(mc);
        var pct = prog.total ? Math.round(prog.done / prog.total * 100) : 0;
        var a = el("a", "curr-row");
        a.href = "#/module/" + mc;
        a.innerHTML =
          '<span class="curr-code">' + mc + "</span>" +
          '<span class="curr-body"><span class="curr-title">' + esc(m.title) + "</span>" +
            '<span class="curr-blurb">' + esc(m.blurb) + "</span>" +
            (pct ? '<span class="curr-progress"><i style="width:' + pct + '%"></i></span>' : "") +
          "</span>" +
          '<span class="curr-meta">' +
            (prog.done ? '<span class="done">' + prog.done + "/" + prog.total + " done</span>" : prog.total + " lessons") +
            " &middot; " + moduleMinutes(mc) + " min</span>" +
          '<span class="curr-arrow" aria-hidden="true">&rarr;</span>';
        rows.appendChild(a);
      });
    });
    curr.appendChild(rows);
    page.appendChild(curr);

    /* ---- reference ---- */
    if (LS.reference) {
      var refs = el("section", "wrap reveal refs-section");
      refs.innerHTML =
        '<span class="story-num">Reference</span>' +
        '<h2 class="sec-h sec-h-sm">Look it up without leaving.</h2>' +
        '<p class="sec-p">Every statement line defined in two sentences, every formula in the course on one page, and a glossary that opens in place inside a lesson.</p>';
      var refGrid = el("div", "ref-grid");
      Object.keys(LS.reference).forEach(function (rid) {
        var r = LS.reference[rid];
        var a = el("a", "ref-card");
        a.href = "#/ref/" + rid;
        a.innerHTML = "<h3>" + esc(r.title) + "</h3><p>" + esc(r.lede) + "</p>";
        refGrid.appendChild(a);
      });
      if (LS.glossary) {
        var ga2 = el("a", "ref-card");
        ga2.href = "#/glossary";
        ga2.innerHTML = "<h3>Finance glossary</h3><p>Every term the course uses — " + LS.glossary.length +
          " of them — each explained in one plain sentence before the technical definition.</p>";
        refGrid.appendChild(ga2);
      }
      refs.appendChild(refGrid);
      page.appendChild(refs);
    }

    /* ---- closer ---- */
    var closer = el("section", "closer wrap reveal");
    closer.innerHTML =
      "<h2>Start where everyone starts: five buckets.</h2>" +
      "<p>Three to eight minutes a lesson. Progress is saved in your browser — nothing is sent anywhere, and there is no account to make.</p>" +
      '<div class="hero-cta"><a class="btn btn-primary" href="#/' + lesson1 + '">Start learning</a>' +
      '<a class="btn btn-outline" href="#/glossary">Browse the glossary</a></div>';
    page.appendChild(closer);

    content.innerHTML = "";
    content.appendChild(page);
    revealOnScroll(page);
  }

  function renderModule(code) {
    var m = LS.manifest.modules[code];
    if (!m) return renderHome();
    setMeta(m.title + " · FinStudio", m.blurb);
    var page = el("div", "page");
    page.appendChild(el("p", "lesson-kicker", "Course module"));
    page.appendChild(el("h1", null, esc(m.title)));
    page.appendChild(el("p", "lesson-lede", esc(m.blurb)));
    var prog = moduleProgress(code);
    var track = el("div", "progress-track");
    track.appendChild(el("div", "progress-fill")).style.width = (prog.total ? Math.round(prog.done / prog.total * 100) : 0) + "%";
    page.appendChild(track);
    page.appendChild(el("p", "sheet-msg", prog.done + " of " + prog.total + " lessons done · about " + moduleMinutes(code) + " minutes of reading & building"));
    var ul = el("ul", "lesson-list");
    m.lessons.forEach(function (id) {
      var lesson = LS.lessons[id];
      var li = el("li"), a = el("a");
      a.href = "#/" + id;
      a.innerHTML = '<span class="ll-code">' + esc(String(id).split("-")[0]) + "</span>" +
        "<span>" + esc(lesson.title) + "</span>" +
        (store.isDone(id) ? '<span class="ll-done">\u2713</span>' : "") +
        '<span class="ll-min">' + (lesson.minutes || 4) + " min</span>";
      li.appendChild(a);
      ul.appendChild(li);
    });
    page.appendChild(ul);
    if (LS.quizzes && LS.quizzes[code]) {
      var qa = el("a", "btn btn-ghost", "Take the module quiz →");
      qa.href = "#/quiz/" + code;
      page.appendChild(qa);
    }
    content.innerHTML = "";
    content.appendChild(page);
  }

  function renderLesson(id) {
    var lesson = LS.lessons[id];
    if (!lesson) return renderHome();
    setMeta(lesson.title + " · FinStudio", lesson.desc || lesson.lede || "");
    var ctx = { lessonId: id, onItemDone: null };
    var page = el("div", "page");
    var mc = moduleOf(id);
    page.appendChild(el("p", "lesson-kicker",
      '<a href="#/module/' + mc + '">' + esc(LS.manifest.modules[mc].title) + "</a>" +
      ' <span class="kicker-min">· ' + (lesson.minutes || 4) + " min</span>"));
    page.appendChild(el("h1", null, esc(lesson.title)));
    if (lesson.lede) page.appendChild(el("p", "lesson-lede", lesson.lede));

    (lesson.body || []).forEach(function (b, i) {
      var fn = blockRenderers[b.t];
      if (fn) page.appendChild(fn(b, ctx, i));
    });

    // share card — appears as soon as the capstone's checks all pass
    if (LS.shareCard && lesson.share) {
      var card = LS.shareCard(lesson, sheetsDone(lesson));
      page.appendChild(card);
      ctx.onItemDone = function () {
        var fresh = LS.shareCard(lesson, sheetsDone(lesson));
        if (card.parentNode) card.parentNode.replaceChild(fresh, card);
        card = fresh;
      };
    }

    // prev/next
    var order = allLessonIdsInOrder();
    var at = order.indexOf(id);
    var nav = el("div", "lesson-nav");
    var prev = el("span"), next = el("span");
    if (at > 0) {
      var p = LS.lessons[order[at - 1]];
      prev.innerHTML = '<a href="#/' + order[at - 1] + '"><span class="nav-label">← Previous</span>' + esc(p.short || p.title) + "</a>";
    }
    if (at >= 0 && at < order.length - 1) {
      var n = LS.lessons[order[at + 1]];
      next.innerHTML = '<a href="#/' + order[at + 1] + '" style="text-align:right;display:block"><span class="nav-label">Next →</span>' + esc(n.short || n.title) + "</a>";
    }
    nav.appendChild(prev); nav.appendChild(next);
    page.appendChild(nav);

    content.innerHTML = "";
    content.appendChild(page);
    if (LS.autoLinkGlossary) LS.autoLinkGlossary(page);
  }

  /* ================= router ================= */
  function currentRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    if (!h) return { kind: "home" };
    var parts = h.split("/");
    if (parts[0] === "module" && parts[1]) return { kind: "module", id: parts[1] };
    if (parts[0] === "quiz" && parts[1]) return { kind: "quiz", id: parts[1] };
    if (parts[0] === "ref" && parts[1]) return { kind: "ref", id: parts[1] };
    if (parts[0] === "glossary") return { kind: "glossary" };
    return { kind: "lesson", id: parts[0] };
  }

  function route() {
    var r = currentRoute();
    var known = r.kind === "lesson" ? !!LS.lessons[r.id] : true;
    // the shell keys its layout off this: the homepage drops the syllabus rail
    // and goes full-bleed, every other route keeps it
    document.body.dataset.route = known ? r.kind : "home";
    if (r.kind === "module") renderModule(r.id);
    else if (r.kind === "quiz" && LS.renderQuiz) LS.renderQuiz(r.id, content);
    else if (r.kind === "ref" && LS.renderRef) LS.renderRef(r.id, content);
    else if (r.kind === "glossary" && LS.renderGlossary) LS.renderGlossary(content);
    else if (r.kind === "lesson" && LS.lessons[r.id]) renderLesson(r.id);
    else renderHome();
    buildSidebar();
    closeNav();
    content.focus({ preventScroll: true });
    if (pendingScroll) {
      var target = document.getElementById(pendingScroll);
      pendingScroll = null;
      if (target) { target.scrollIntoView({ behavior: "auto", block: "start" }); return; }
    }
    window.scrollTo(0, 0);
  }

  /* mobile nav */
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("sidebarScrim");
  var toggle = document.getElementById("navToggle");
  function closeNav() {
    sidebar.classList.remove("open");
    scrim.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = sidebar.classList.toggle("open");
    scrim.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      var first = sidebar.querySelector("a");
      if (first) first.focus();
    }
  });
  scrim.addEventListener("click", closeNav);
  // Escape closes the mobile syllabus and returns focus to the toggle, so
  // keyboard users aren't stranded inside it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      closeNav();
      toggle.focus();
    }
  });

  window.addEventListener("hashchange", route);
  // expose bits the LX layer (quizzes/reference/share) reuses
  LS.ui = { el: el, esc: esc, renderMCQ: renderMCQ, buildSidebar: buildSidebar, setMeta: setMeta, moduleProgress: moduleProgress };
  route();
})();
