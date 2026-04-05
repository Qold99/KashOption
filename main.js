/**
 * Global UX: WhatsApp FAB (delayed), in-page anchors, prefers-reduced-motion respect.
 * Avoid scroll listeners that force scrollTo — they cause jank on some mobile browsers.
 */
(function () {
  var WA_DELAY_MS = 20000;

  function initWaFab() {
    var root = document.getElementById("wa-fab");
    if (!root) return;

    var btn = root.querySelector(".wa-fab__btn");
    var panel = root.querySelector(".wa-fab__panel");

    function openPanel() {
      if (!panel) return;
      panel.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }

    function closePanel() {
      if (!panel) return;
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    setTimeout(function () {
      root.classList.add("is-ready");
    }, WA_DELAY_MS);

    if (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (panel && panel.classList.contains("is-open")) closePanel();
        else openPanel();
      });
    }

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });
  }

  function initAnchorScroll() {
    var reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        if (history.replaceState) {
          history.replaceState(null, "", id);
        }
      });
    });
  }

  initWaFab();
  initAnchorScroll();
})();
