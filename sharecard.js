/* The share card: a canvas-drawn PNG the learner can download once the
   balance sheet capstone ties. Drawn entirely in code — no image assets,
   no network, nothing to host. */
(function () {
  "use strict";
  var LS = (window.LS = window.LS || {});

  var PAPER = "#FBF9F3", INK = "#182530", GREEN = "#1E6B4E", LINE = "#DCD3BE";

  function draw(canvas, opts) {
    var W = 1200, H = 630;
    canvas.width = W; canvas.height = H;
    var g = canvas.getContext("2d");

    // paper with ledger rules
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    g.strokeStyle = "#EFE9DA"; g.lineWidth = 1;
    for (var y = 90; y < H; y += 34) {
      g.beginPath(); g.moveTo(60, y + 0.5); g.lineTo(W - 60, y + 0.5); g.stroke();
    }
    // green spine
    g.fillStyle = GREEN; g.fillRect(0, 0, 14, H);

    // brand
    g.fillStyle = INK;
    g.font = "600 30px Georgia, 'Times New Roman', serif";
    g.fillText("LedgerSchool", 64, 84);
    g.fillStyle = "#8A959D";
    g.font = "18px system-ui, -apple-system, sans-serif";
    g.fillText("learn finance by building it", 254, 84);

    // headline
    g.fillStyle = INK;
    g.font = "700 62px Georgia, 'Times New Roman', serif";
    g.fillText("I made the balance", 64, 210);
    g.fillText("sheet tie", 64, 282);
    // green check
    g.strokeStyle = GREEN; g.lineWidth = 11; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(325, 268); g.lineTo(355, 297); g.lineTo(415, 228); g.stroke();

    // the ledger box
    var bx = 64, by = 330, bw = W - 128, bh = 210;
    g.fillStyle = "#FFFFFF"; g.fillRect(bx, by, bw, bh);
    g.strokeStyle = LINE; g.lineWidth = 2; g.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);

    g.font = "600 22px 'IBM Plex Mono', ui-monospace, monospace";
    g.fillStyle = "#51606B";
    g.fillText("Bombay Bean Coffee Co. · as at 31 March 2025", bx + 28, by + 44);

    var rows = [
      ["Total assets", opts.total],
      ["Total equity & liabilities", opts.total]
    ];
    g.font = "26px 'IBM Plex Mono', ui-monospace, monospace";
    rows.forEach(function (r, i) {
      var ry = by + 92 + i * 40;
      g.fillStyle = INK;
      g.fillText(r[0], bx + 28, ry);
      var w = g.measureText(r[1]).width;
      g.fillText(r[1], bx + bw - 28 - w, ry);
    });

    // the zero that makes the whole thing worth sharing
    g.strokeStyle = INK; g.lineWidth = 2;
    g.beginPath(); g.moveTo(bx + bw - 300, by + 156); g.lineTo(bx + bw - 28, by + 156); g.stroke();

    g.fillStyle = GREEN;
    g.font = "700 30px 'IBM Plex Mono', ui-monospace, monospace";
    var diff = "difference  " + opts.diff;
    var dw = g.measureText(diff).width;
    g.fillText(diff, bx + bw - 28 - dw, by + 192);

    // footer
    g.fillStyle = "#8A959D";
    g.font = "20px system-ui, -apple-system, sans-serif";
    g.fillText("Free · no sign-up · no videos", 64, H - 42);
    return canvas;
  }

  /* Called by the lesson renderer for any lesson with share:true.
     `done` is true once every sandbox in the lesson passes its checks. */
  LS.shareCard = function (lesson, done) {
    var ui = LS.ui, el = ui.el;
    var wrap = el("div", "share-box");

    var heading = el("h2", null, "Your share card");
    wrap.appendChild(heading);
    var blurb = el("p", null, done
      ? "You tied the balance sheet. Here's a card to prove it — download it, keep it, post it."
      : "Get every check on the capstone above to pass, then come back: a downloadable card appears here.");
    wrap.appendChild(blurb);

    if (!done) return wrap;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label",
      "Share card reading: I made the balance sheet tie. Bombay Bean Coffee Co. as at 31 March 2025, total assets and total equity and liabilities both " +
      LS.fmt.inr(LS.C.fy25.bs.totalAssets) + ", difference zero.");
    draw(canvas, { total: LS.fmt.inr(LS.C.fy25.bs.totalAssets), diff: LS.fmt.inr(0) });
    wrap.appendChild(canvas);

    var bar = el("p");
    var btn = el("button", "btn btn-primary", "Download the PNG");
    btn.type = "button";
    btn.addEventListener("click", function () {
      try {
        var a = document.createElement("a");
        a.download = "ledgerschool-balance-sheet-ties.png";
        a.href = canvas.toDataURL("image/png");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        btn.textContent = "Right-click the card and choose “Save image as…”";
      }
    });
    bar.appendChild(btn);
    wrap.appendChild(bar);
    return wrap;
  };
})();
