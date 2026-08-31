/* ============================================================================
   FinStudio sandbox grid — the UI layer over js/sheets/engine.js
   ----------------------------------------------------------------------------
   Deliberately not virtualized. Every lesson sandbox is under 25 rows, so
   virtualization would solve a problem none of them have while adding the
   selection-during-scroll bugs that make grids hard. When a lesson needs 5,000
   rows, that is the moment to add it.

   What it does: cell selection, a real formula bar showing the FORMULA rather
   than the value, keyboard navigation in the Excel idiom, live recalculation
   through the dependency graph, per-cell guidance, progressive hints, and
   checks that read what you typed.
   ========================================================================= */
(function () {
  "use strict";
  var S = window.FinSheets;
  if (!S) return;

  var LS = window.LS = window.LS || {};

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function colLabel(n) { return S.numToCol(n); }

  /* ----------------------------------------------------------------------
     Build a workbook from a lesson sandbox spec
     ------------------------------------------------------------------- */
  function buildWorkbook(sandbox) {
    var wb = new S.Workbook({ sheets: sandbox.sheets.map(function (s) { return s.name; }) });
    sandbox.sheets.forEach(function (s) {
      Object.keys(s.cells).forEach(function (a) { wb.setRaw(s.name, a, s.cells[a]); });
      Object.keys(s.formats || {}).forEach(function (a) { wb.setFormat(s.name, a, s.formats[a]); });
      (s.editable || []).forEach(function (a) { wb.setRaw(s.name, a, ""); });
    });
    wb._journal = [];
    return wb;
  }

  /* ----------------------------------------------------------------------
     Sandbox component
     ------------------------------------------------------------------- */
  function Sandbox(lesson, host) {
    this.lesson = lesson;
    this.spec = lesson.sandbox;
    this.host = host;
    this.sheetIndex = 0;
    this.explore = false;
    this.sel = null;
    this.editing = false;
    this.hintsUsed = {};
    this.storeKey = "finstudio:v2:sandbox:" + lesson.id;
    this.wb = buildWorkbook(this.spec);
    this.restore();
    this.render();
  }

  Sandbox.prototype.sheetName = function () { return this.spec.sheets[this.sheetIndex].name; };
  Sandbox.prototype.editableSet = function () {
    var s = this.spec.sheets[this.sheetIndex];
    var set = {};
    (s.editable || []).forEach(function (a) { set[a] = true; });
    // Explore mode opens the whole sheet, including the assumptions. The lessons
    // end by telling the learner to change a driver and watch it flow; without
    // this the sandbox refuses the very thing the lesson just asked for.
    if (this.explore) {
      var ext = this.extent();
      for (var c = 1; c <= ext.cols; c++)
        for (var r = 1; r <= ext.rows; r++) set[S.addr(c, r)] = true;
    }
    return set;
  };

  /* ---- persistence: a learner's work survives a refresh ---- */
  Sandbox.prototype.save = function () {
    try {
      var out = {};
      var self = this;
      this.spec.sheets.forEach(function (s) {
        out[s.name] = {};
        (s.editable || []).forEach(function (a) { out[s.name][a] = self.wb.raw(s.name, a); });
      });
      localStorage.setItem(this.storeKey, JSON.stringify(out));
    } catch (e) { /* storage unavailable — the sandbox still works */ }
  };
  Sandbox.prototype.restore = function () {
    try {
      var raw = localStorage.getItem(this.storeKey);
      if (!raw) return;
      var data = JSON.parse(raw), self = this;
      Object.keys(data).forEach(function (sheet) {
        Object.keys(data[sheet]).forEach(function (a) {
          if (data[sheet][a]) self.wb.setRaw(sheet, a, data[sheet][a]);
        });
      });
    } catch (e) { /* ignore corrupt state */ }
  };

  /* ---- geometry ---- */
  Sandbox.prototype.extent = function () {
    var s = this.spec.sheets[this.sheetIndex];
    var maxC = 1, maxR = 1;
    Object.keys(s.cells).concat(s.editable || []).forEach(function (a) {
      var p = S.parseA1(a);
      if (!p) return;
      if (p.c > maxC) maxC = p.c;
      if (p.r > maxR) maxR = p.r;
    });
    return { cols: maxC, rows: maxR };
  };

  Sandbox.prototype.render = function () {
    var self = this;
    this.host.innerHTML = "";
    var wrap = el("div", "sbx");

    /* head */
    var head = el("div", "sbx-head");
    head.appendChild(el("span", "sbx-tag", "Build it"));
    head.appendChild(el("span", "sbx-title", this.spec.title || this.lesson.title));
    wrap.appendChild(head);
    if (this.spec.instructions) wrap.appendChild(el("p", "sbx-hint", this.spec.instructions));
    if (this.explore) wrap.appendChild(el("p", "sbx-explore-note",
      "Explore mode — every cell is editable. Checks still apply."));

    /* sheet tabs, when there is more than one */
    if (this.spec.sheets.length > 1) {
      var tabs = el("div", "sbx-tabs");
      this.spec.sheets.forEach(function (s, i) {
        var t = el("button", "sbx-tab" + (i === self.sheetIndex ? " active" : ""), s.name);
        t.type = "button";
        t.onclick = function () { self.sheetIndex = i; self.sel = null; self.render(); };
        tabs.appendChild(t);
      });
      wrap.appendChild(tabs);
    }

    /* formula bar — shows the formula, not the value */
    var bar = el("div", "sbx-fbar");
    this.addrBox = el("span", "sbx-addr", this.sel || "—");
    var fx = el("span", "sbx-fx", "fx");
    this.input = el("input", "sbx-finput");
    this.input.type = "text";
    this.input.setAttribute("aria-label", "Formula bar");
    this.input.disabled = true;
    bar.appendChild(this.addrBox); bar.appendChild(fx); bar.appendChild(this.input);
    wrap.appendChild(bar);

    this.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { self.commit(self.input.value); self.move(0, 1); e.preventDefault(); }
      else if (e.key === "Escape") { self.syncBar(); self.focusGrid(); }
    });
    this.input.addEventListener("blur", function () {
      if (self.sel && self.input.value !== self.wb.raw(self.sheetName(), self.sel)) self.commit(self.input.value);
    });

    /* grid */
    var scroll = el("div", "sbx-scroll");
    this.table = el("table", "sbx-grid");
    this.table.tabIndex = 0;
    scroll.appendChild(this.table);
    wrap.appendChild(scroll);
    this.paint();

    this.table.addEventListener("keydown", function (e) { self.onKey(e); });

    /* per-cell guidance */
    this.guide = el("div", "sbx-guide");
    wrap.appendChild(this.guide);

    /* toolbar */
    var tb = el("div", "sbx-tools");
    var check = el("button", "btn btn-primary btn-small", "Check my work");
    check.type = "button";
    check.onclick = function () { self.check(); };
    var reset = el("button", "btn btn-ghost btn-small", "Reset");
    reset.type = "button";
    reset.onclick = function () {
      if (!window.confirm("Clear everything you have typed in this sandbox?")) return;
      try { localStorage.removeItem(self.storeKey); } catch (err) {}
      self.wb = buildWorkbook(self.spec);
      self.sel = null; self.render();
    };
    var undo = el("button", "btn btn-ghost btn-small", "Undo");
    undo.type = "button";
    undo.onclick = function () { self.wb.undo(); self.save(); self.paint(); self.syncBar(); };
    var explore = el("button", "btn btn-ghost btn-small",
      this.explore ? "Back to the exercise" : "Explore freely");
    explore.type = "button";
    explore.title = "Unlock every cell so you can change the assumptions and watch the model move";
    explore.onclick = function () {
      self.explore = !self.explore;
      self.render();
    };
    tb.appendChild(check); tb.appendChild(undo); tb.appendChild(explore); tb.appendChild(reset);
    wrap.appendChild(tb);

    this.results = el("div", "sbx-results");
    this.results.setAttribute("aria-live", "polite");
    wrap.appendChild(this.results);
    if (this.lastResults) this.paintResults(this.lastResults);

    this.host.appendChild(wrap);
  };

  Sandbox.prototype.paint = function () {
    var self = this, ext = this.extent(), sheet = this.sheetName(), editable = this.editableSet();
    this.table.innerHTML = "";

    var thead = el("thead"), hr = el("tr");
    hr.appendChild(el("th", "sbx-corner", ""));
    for (var c = 1; c <= ext.cols; c++) hr.appendChild(el("th", null, colLabel(c)));
    thead.appendChild(hr); this.table.appendChild(thead);

    var tb = el("tbody");
    for (var r = 1; r <= ext.rows; r++) {
      var tr = el("tr");
      tr.appendChild(el("th", "sbx-rowhead", String(r)));
      for (var c2 = 1; c2 <= ext.cols; c2++) {
        var a = S.addr(c2, r);
        var td = el("td");
        td.dataset.addr = a;
        var isEdit = !!editable[a];
        var value = this.wb.value(sheet, a);
        var display = this.wb.display(sheet, a);
        if (isEdit) {
          td.className = "sbx-edit";
          if (display === "") {
            var ph = (this.spec.cellHints || {})[a];
            td.appendChild(el("span", "sbx-ph", ph && ph.pattern ? ph.pattern : "?"));
          } else {
            td.appendChild(el("span", "sbx-val", display));
          }
          if (S.isErr(value)) td.classList.add("sbx-err");
        } else if (typeof value === "number") {
          td.className = "sbx-num";
          td.appendChild(el("span", null, display));
        } else {
          td.className = "sbx-label";
          td.appendChild(el("span", null, display));
        }
        if (a === this.sel) td.classList.add("sbx-sel");
        (function (addr) {
          td.onclick = function () { self.select(addr); };
          td.ondblclick = function () { self.select(addr); self.input.focus(); self.input.select(); };
        })(a);
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
    this.table.appendChild(tb);
    this.renderTie();
  };

  /* the tie meter, when a lesson declares one */
  Sandbox.prototype.renderTie = function () {
    if (!this.spec.tie || !this.tieHost) return;
    var t = this.spec.tie, sheet = t.sheet || this.sheetName();
    var a = this.wb.value(sheet, t.a), b = this.wb.value(sheet, t.le);
    var ok = typeof a === "number" && typeof b === "number" && Math.abs(a - b) < 0.5;
    this.tieHost.className = "sbx-tie " + (ok ? "tied" : "untied");
    this.tieHost.innerHTML =
      '<div class="tie-row"><span>' + (t.aLabel || "A") + "</span><span>" + this.wb.display(sheet, t.a) + "</span></div>" +
      '<div class="tie-row"><span>' + (t.leLabel || "L+E") + "</span><span>" + this.wb.display(sheet, t.le) + "</span></div>" +
      '<div class="tie-verdict">' + (ok ? "✓ It ties" : "Difference " +
        S.formatValue((typeof a === "number" ? a : 0) - (typeof b === "number" ? b : 0), { type: "currency", currency: "inr" })) + "</div>";
  };

  Sandbox.prototype.select = function (a) {
    this.sel = a;
    var editable = this.editableSet();
    this.input.disabled = !editable[a];
    this.syncBar();
    this.paint();
    this.showGuide(a);
    this.focusGrid();
  };
  Sandbox.prototype.focusGrid = function () { this.table.focus({ preventScroll: true }); };
  Sandbox.prototype.syncBar = function () {
    this.addrBox.textContent = this.sel || "—";
    this.input.value = this.sel ? this.wb.raw(this.sheetName(), this.sel) : "";
  };

  Sandbox.prototype.showGuide = function (a) {
    var h = (this.spec.cellHints || {})[a];
    this.guide.innerHTML = "";
    if (!h) return;
    var box = el("div", "sbx-guide-box");
    if (h.whatGoesHere) box.appendChild(el("div", "sbx-guide-what", h.whatGoesHere));
    if (h.hint) box.appendChild(el("p", "sbx-guide-hint", h.hint));
    // the formula pattern is the last rung, never the first
    if (h.pattern) {
      var self = this;
      var btn = el("button", "sbx-guide-more", "Show the formula pattern");
      btn.type = "button";
      btn.onclick = function () {
        btn.replaceWith(el("code", "sbx-guide-pattern", h.pattern));
        self.hintsUsed[a] = true;
      };
      if (this.hintsUsed[a]) box.appendChild(el("code", "sbx-guide-pattern", h.pattern));
      else box.appendChild(btn);
    }
    this.guide.appendChild(box);
  };

  Sandbox.prototype.commit = function (text) {
    if (!this.sel) return;
    var editable = this.editableSet();
    if (!editable[this.sel]) return;
    this.wb.setRaw(this.sheetName(), this.sel, text);
    this.save();
    this.paint();
  };

  Sandbox.prototype.move = function (dc, dr) {
    if (!this.sel) return;
    var p = S.parseA1(this.sel), ext = this.extent();
    var c = Math.min(Math.max(1, p.c + dc), ext.cols);
    var r = Math.min(Math.max(1, p.r + dr), ext.rows);
    this.select(S.addr(c, r));
  };

  Sandbox.prototype.onKey = function (e) {
    var k = e.key;
    if (!this.sel && k.indexOf("Arrow") === 0) { this.select("A1"); e.preventDefault(); return; }
    if (k === "ArrowUp") { this.move(0, -1); e.preventDefault(); }
    else if (k === "ArrowDown") { this.move(0, 1); e.preventDefault(); }
    else if (k === "ArrowLeft") { this.move(-1, 0); e.preventDefault(); }
    else if (k === "ArrowRight") { this.move(1, 0); e.preventDefault(); }
    else if (k === "Enter" || k === "F2") {
      if (!this.input.disabled) { this.input.focus(); this.input.select(); }
      e.preventDefault();
    }
    else if (k === "Tab") { this.move(e.shiftKey ? -1 : 1, 0); e.preventDefault(); }
    else if (k === "Delete" || k === "Backspace") { this.commit(""); this.syncBar(); e.preventDefault(); }
    else if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === "z") {
      this.wb.undo(); this.save(); this.paint(); this.syncBar(); e.preventDefault();
    }
    else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !this.input.disabled) {
      // typing replaces the cell, exactly as a spreadsheet does
      this.input.value = k; this.input.focus();
      e.preventDefault();
    }
  };

  Sandbox.prototype.check = function () {
    var res = this.wb.runChecks(this.spec.checks || []);
    this.lastResults = res;
    var passed = res.filter(function (r) { return r.ok; }).length;
    var firstPass = passed === res.length && !this.explore;
    if (firstPass) this.explore = true;   // built and correct — now let them break it
    if (firstPass) this.render();          // re-render so the toolbar label matches
    else this.paintResults(res);
  };

  Sandbox.prototype.paintResults = function (res) {
    var passed = res.filter(function (r) { return r.ok; }).length;
    this.results.innerHTML = "";
    var head = el("div", "sbx-score", passed + " of " + res.length + " checks passing");
    head.classList.add(passed === res.length ? "all-ok" : "partial");
    this.results.appendChild(head);
    res.forEach(function (r) {
      var row = el("div", "sbx-check " + (r.ok ? "ok" : "bad"));
      row.appendChild(el("span", "sbx-ck-icon", r.ok ? "\u2713" : "\u2717"));
      var body = el("div");
      body.appendChild(el("span", "sbx-ck-label", r.label || ""));
      if (!r.ok && r.why) body.appendChild(el("p", "sbx-ck-why", r.why));
      row.appendChild(body);
      this.results.appendChild(row);
    }, this);
    if (passed === res.length) {
      if (this.spec.success) this.results.appendChild(el("p", "sbx-success", this.spec.success));
      if (LS.store && LS.store.markDone) LS.store.markDone(this.lesson.id);
      this.results.appendChild(el("p", "sbx-explore-note",
        "Every cell is now unlocked. Change an assumption and watch it flow through."));
    }
  };

  LS.Sandbox = Sandbox;
  LS.buildWorkbook = buildWorkbook;
})();
