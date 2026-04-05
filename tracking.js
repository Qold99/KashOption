/**
 * Order tracking via published Google Sheet (CSV).
 *
 * Setup:
 * 1. Create a Sheet with header row, e.g.:
 *    order_id,phone,status,eta,rider,dispatch_time,delivered,sameday_cutoff
 * 2. File → Share → Publish to web → CSV (or use export URL).
 * 3. Paste the CSV URL into MRKASH_TRACKING_SHEET_URL below.
 *
 * Rows match on order_id OR phone (digits compared loosely).
 */
(function () {
  /* eslint-disable no-unused-vars */
  var MRKASH_TRACKING_SHEET_URL = "";

  function normalizePhone(s) {
    return String(s || "").replace(/\D/g, "");
  }

  function parseCsv(text) {
    var rows = [];
    var row = [];
    var cur = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur);
        if (row.some(function (cell) {
          return cell.length > 0;
        })) {
          rows.push(row);
        }
        row = [];
        cur = "";
      } else if (c === "," && !inQuotes) {
        row.push(cur);
        cur = "";
      } else {
        cur += c;
      }
    }
    row.push(cur);
    if (row.some(function (cell) {
      return cell.length > 0;
    })) {
      rows.push(row);
    }
    return rows;
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) {
      return String(h).trim().toLowerCase().replace(/\s+/g, "_");
    });
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        obj[headers[c]] = rows[r][c] != null ? String(rows[r][c]).trim() : "";
      }
      out.push(obj);
    }
    return out;
  }

  function findRow(data, query) {
    var q = String(query).trim();
    var qDigits = normalizePhone(q);
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var oid = String(row.order_id || row.id || "").trim();
      var phone = normalizePhone(row.phone || row.mobile || "");
      if (oid && oid.toLowerCase() === q.toLowerCase()) return row;
      if (qDigits.length >= 6 && phone && phone.slice(-9) === qDigits.slice(-9)) return row;
      if (qDigits.length >= 6 && phone && phone.indexOf(qDigits) !== -1) return row;
    }
    return null;
  }

  function parseWhen(s) {
    if (!s) return null;
    var t = Date.parse(s);
    return isNaN(t) ? null : new Date(t);
  }

  function formatCountdown(target) {
    if (!target) return "";
    var now = new Date();
    var ms = target - now;
    if (ms <= 0) return "Same-day window closed for today.";
    var h = Math.floor(ms / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return "Same-day cutoff in " + h + "h " + m + "m";
    return "Same-day cutoff in " + m + "m";
  }

  function setSteps(container, statusKey) {
    if (!container) return;
    var order = ["received", "fitment", "dispatched", "delivered"];
    var key = String(statusKey || "").toLowerCase();
    var idx = 0;
    if (key.indexOf("deliver") !== -1) idx = 3;
    else if (key.indexOf("dispatch") !== -1 || key.indexOf("rider") !== -1) idx = 2;
    else if (key.indexOf("fit") !== -1 || key.indexOf("confirm") !== -1) idx = 1;

    var labels = [
      { id: "received", text: "Order received &amp; queued" },
      { id: "fitment", text: "OEM fitment verified" },
      { id: "dispatched", text: "Dispatched with rider" },
      { id: "delivered", text: "Delivered &amp; signed" },
    ];

    container.innerHTML = labels
      .map(function (step, i) {
        var cls = "timeline-step";
        if (i < idx) cls += " is-done";
        if (i === idx) cls += " is-active";
        return (
          '<div class="' +
          cls +
          '" data-step="' +
          step.id +
          '">' +
          '<span class="timeline-dot" aria-hidden="true"></span>' +
          "<div><p>" +
          step.text +
          "</p></div></div>"
        );
      })
      .join("");
  }

  function renderResult(mount, row, err) {
    var statusEl = document.getElementById("track-status");
    var metaEl = document.getElementById("track-meta");
    var timelineEl = document.getElementById("track-timeline");
    var countdownEl = document.getElementById("track-countdown");
    var errEl = document.getElementById("track-error");

    if (errEl) {
      errEl.textContent = err || "";
      errEl.style.display = err ? "block" : "none";
    }

    if (!mount) return;
    mount.hidden = false;

    if (err || !row) {
      if (statusEl) statusEl.textContent = err ? "Check details below" : "No match found";
      if (metaEl) metaEl.innerHTML = "";
      if (timelineEl) timelineEl.innerHTML = "";
      if (countdownEl) countdownEl.style.display = "none";
      return;
    }

    if (statusEl) statusEl.textContent = "Status: " + (row.status || "In progress");

    if (metaEl) {
      metaEl.innerHTML =
        '<div class="meta-pill"><strong>ETA</strong>' +
        (row.eta || "—") +
        "</div>" +
        '<div class="meta-pill"><strong>Rider</strong>' +
        (row.rider || "Assigned at dispatch") +
        "</div>" +
        '<div class="meta-pill"><strong>Dispatch</strong>' +
        (row.dispatch_time || "—") +
        "</div>" +
        '<div class="meta-pill"><strong>Delivered</strong>' +
        (row.delivered || "—") +
        "</div>";
    }

    setSteps(timelineEl, row.status);

    if (countdownEl) {
      var cutoff = row.sameday_cutoff || row.same_day_cutoff || row.cutoff;
      var t = parseWhen(cutoff);
      if (t) {
        countdownEl.style.display = "inline-flex";
        countdownEl.textContent = formatCountdown(t);
      } else {
        countdownEl.style.display = "none";
      }
    }
  }

  function runLookup(inputId, resultId) {
    var input = document.getElementById(inputId);
    var result = document.getElementById(resultId);
    var q = input ? input.value : "";
    if (!q || String(q).trim().length < 3) {
      renderResult(result, null, "Enter an order ID or registered phone number.");
      return;
    }

    var statusEl = document.getElementById("track-status");
    var metaEl = document.getElementById("track-meta");
    var timelineEl = document.getElementById("track-timeline");
    var countdownEl = document.getElementById("track-countdown");
    var errEl = document.getElementById("track-error");

    if (errEl) {
      errEl.textContent = "";
      errEl.style.display = "none";
    }
    if (result) result.hidden = false;
    if (statusEl) statusEl.textContent = "Fetching dispatch…";
    if (metaEl)
      metaEl.innerHTML =
        '<div class="skeleton" style="height:3.25rem"></div><div class="skeleton" style="height:3.25rem"></div>';
    if (timelineEl) timelineEl.innerHTML = '<div class="skeleton" style="height:7rem"></div>';
    if (countdownEl) countdownEl.style.display = "none";

    var url = MRKASH_TRACKING_SHEET_URL;
    if (!url) {
      /* Demo mode for Pages preview — replace URL for production */
      setTimeout(function () {
        renderResult(
          result,
          {
            status: "Out for delivery",
            eta: "Today · 4:30–6:00 PM",
            rider: "Rider team (SMS link sent)",
            dispatch_time: new Date().toLocaleString(),
            delivered: "Pending",
            sameday_cutoff: new Date(Date.now() + 90 * 60000).toISOString(),
          },
          ""
        );
      }, 600);
      return;
    }

    fetch(url, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("Network error");
        return r.text();
      })
      .then(function (text) {
        var rows = rowsToObjects(parseCsv(text));
        var row = findRow(rows, q);
        if (!row) renderResult(result, null, "");
        else renderResult(result, row, "");
      })
      .catch(function () {
        renderResult(result, null, "Could not load tracking data. Try again shortly.");
      });
  }

  window.MRKASH_TRACKING = {
    lookup: runLookup,
    setSheetUrl: function (u) {
      MRKASH_TRACKING_SHEET_URL = u;
    },
  };
})();
