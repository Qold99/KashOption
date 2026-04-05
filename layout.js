/**
 * Injects shared header/footer. Single source for GitHub Pages (no SSI).
 * Set <body data-page="catalog"> for active nav highlighting.
 */
(function () {
  var page = document.body.getAttribute("data-page") || "home";

  function active(hrefPage) {
    return page === hrefPage ? " is-active" : "";
  }

  var navHTML =
    '<header class="site-header" id="top">' +
    '<div class="container">' +
    '<div class="site-header__inner">' +
    '<a class="logo" href="index.html">MRKASH <span>OEM</span></a>' +
    '<nav class="nav-panel" id="nav-panel" aria-label="Primary">' +
    '<p class="nav-group__label">Shop</p>' +
    '<div class="nav-links">' +
    '<a class="nav-link' + active("home") + '" href="index.html">Home</a>' +
    '<a class="nav-link' + active("catalog") + '" href="catalog.html">Catalog</a>' +
    '<a class="nav-link' + active("oem-finder") + '" href="oem-finder.html">OEM Finder</a>' +
    '<a class="nav-link' + active("compatibility-brand") + '" href="compatibility-brand.html">By Brand</a>' +
    "</div>" +
    '<p class="nav-group__label">Plug guides</p>' +
    '<div class="nav-links">' +
    '<a class="nav-link' + active("toyota-guide") + '" href="toyota-guide.html">Toyota</a>' +
    '<a class="nav-link' + active("honda-guide") + '" href="honda-guide.html">Honda</a>' +
    '<a class="nav-link' + active("hyundai-guide") + '" href="hyundai-guide.html">Hyundai</a>' +
    '<a class="nav-link' + active("kia-guide") + '" href="kia-guide.html">Kia</a>' +
    "</div>" +
    '<p class="nav-group__label">For workshops</p>' +
    '<div class="nav-links">' +
    '<a class="nav-link' + active("wholesale") + '" href="wholesale.html">Wholesale</a>' +
    '<a class="nav-link' + active("workshop-packs") + '" href="workshop-packs.html">Supply packs</a>' +
    '<a class="nav-link' + active("taxi-fleet") + '" href="taxi-fleet.html">Taxi fleet</a>' +
    "</div>" +
    '<p class="nav-group__label">Delivery &amp; help</p>' +
    '<div class="nav-links">' +
    '<a class="nav-link' + active("same-day-delivery") + '" href="same-day-delivery.html">Same-day</a>' +
    '<a class="nav-link' + active("tracking") + '" href="tracking.html">Track order</a>' +
    '<a class="nav-link' + active("support") + '" href="support.html">Support</a>' +
    '<a class="nav-link' + active("faq") + '" href="faq.html">FAQs</a>' +
    '<a class="nav-link' + active("blog") + '" href="blog.html">Blog</a>' +
    '<a class="nav-link' + active("fitment-policy") + '" href="fitment-policy.html">Fitment policy</a>' +
    "</div>" +
    '<p class="nav-group__label">Company</p>' +
    '<div class="nav-links">' +
    '<a class="nav-link' + active("about") + '" href="about.html">Warehouse</a>' +
    '<a class="nav-link' + active("reviews") + '" href="reviews.html">Reviews</a>' +
    '<a class="nav-link' + active("contact") + '" href="contact.html">Contact</a>' +
    '<a class="nav-cta" href="contact.html#alerts">Stock alerts</a>' +
    "</div>" +
    "</nav>" +
    '<div class="nav-actions">' +
    '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-panel" aria-label="Open menu">' +
    "☰" +
    "</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</header>";

  var footerHTML =
    '<footer class="site-footer">' +
    '<div class="container">' +
    '<div class="footer-grid">' +
    '<div class="footer-brand">' +
    "<h4>MRKASH OEM</h4>" +
    "<p>Ghana’s OEM spark plug ecosystem — Denso, NGK, and chassis-matched fitment for workshops and drivers.</p>" +
    "</div>" +
    "<div>" +
    "<h4>Shop</h4>" +
    "<ul>" +
    '<li><a href="catalog.html">Spark plug catalog</a></li>' +
    '<li><a href="oem-finder.html">OEM plug finder</a></li>' +
    '<li><a href="compatibility-brand.html">Compatibility by brand</a></li>' +
    "</ul>" +
    "</div>" +
    "<div>" +
    "<h4>Guides</h4>" +
    "<ul>" +
    '<li><a href="toyota-guide.html">Toyota plug guide</a></li>' +
    '<li><a href="honda-guide.html">Honda plug guide</a></li>' +
    '<li><a href="hyundai-guide.html">Hyundai plug guide</a></li>' +
    '<li><a href="kia-guide.html">Kia plug guide</a></li>' +
    "</ul>" +
    "</div>" +
    "<div>" +
    "<h4>Business</h4>" +
    "<ul>" +
    '<li><a href="wholesale.html">Wholesale for mechanics</a></li>' +
    '<li><a href="workshop-packs.html">Workshop supply packs</a></li>' +
    '<li><a href="taxi-fleet.html">Taxi fleet supply</a></li>' +
    "</ul>" +
    "</div>" +
    "<div>" +
    "<h4>Logistics</h4>" +
    "<ul>" +
    '<li><a href="same-day-delivery.html">Same-day delivery</a></li>' +
    '<li><a href="tracking.html">Order tracking</a></li>' +
    "</ul>" +
    "</div>" +
    "<div>" +
    "<h4>Help</h4>" +
    "<ul>" +
    '<li><a href="support.html">Support center</a></li>' +
    '<li><a href="fitment-policy.html">Fitment policy</a></li>' +
    '<li><a href="faq.html">FAQs</a></li>' +
    '<li><a href="blog.html">Mechanic blog</a></li>' +
    "</ul>" +
    "</div>" +
    "<div>" +
    "<h4>Company</h4>" +
    "<ul>" +
    '<li><a href="about.html">About warehouse</a></li>' +
    '<li><a href="reviews.html">Reviews &amp; proof</a></li>' +
    '<li><a href="contact.html">Contact</a></li>' +
    "</ul>" +
    "</div>" +
    "</div>" +
    '<p style="margin:2rem 0 0;font-size:var(--f-small);color:var(--text-muted);">© MRKASH OEM · Accra · WhatsApp business support</p>' +
    "</div>" +
    "</footer>";

  var headerMount = document.getElementById("site-header");
  if (headerMount) headerMount.innerHTML = navHTML;

  var footerMount = document.getElementById("site-footer");
  if (footerMount) footerMount.innerHTML = footerHTML;

  /* Mobile nav */
  var toggle = document.getElementById("nav-toggle");
  var panel = document.getElementById("nav-panel");
  if (toggle && panel) {
    function closeNav() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    }
    function openNav() {
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
    }
    toggle.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) closeNav();
      else openNav();
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1024px)").matches) closeNav();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }
})();
