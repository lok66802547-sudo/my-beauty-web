(function () {
  "use strict";

  var BRAND_SELECTOR = "[data-ec-global-brand]";
  var HEADER_SELECTOR = "header, [role='banner']";
  var CANDIDATES = [
    ".nav-brand",
    ".booking-nav-brand",
    ".payment-nav-brand",
    ".site-header .brand",
    "header .brand",
    "header a[href='/index.html']",
    "header a[href='/']",
    "header a[href='#top']",
    "[role='banner'] a[href='#top']"
  ].join(",");
  var HEADER_CANDIDATES = [
    "a.nav-brand",
    "a.booking-nav-brand",
    "a.payment-nav-brand",
    "a.brand",
    "a[href='/index.html']",
    "a[href='/']",
    "a[href='#top']"
  ].join(",");

  function brandMarkup(link) {
    link.setAttribute("data-ec-global-brand", "true");
    link.setAttribute("aria-label", "EC Beauty 首頁");
    link.classList.add("ec-global-brand");
    link.innerHTML = "";

    var image = document.createElement("img");
    image.className = "ec-global-brand__logo";
    image.src = "/logo.png";
    image.alt = "";
    image.width = 161;
    image.height = 268;
    image.decoding = "async";

    var name = document.createElement("span");
    name.className = "ec-global-brand__name";
    name.textContent = "EC Beauty";

    link.appendChild(image);
    link.appendChild(name);
    return link;
  }

  function installBrand() {
    if (!document.body) return;

    var generated = document.querySelector(".ec-global-header--generated");
    var realHeader = Array.prototype.find.call(
      document.querySelectorAll(HEADER_SELECTOR),
      function (item) { return !item.classList.contains("ec-global-header--generated"); }
    );
    if (generated && realHeader) {
      var realTarget = realHeader.querySelector(HEADER_CANDIDATES);
      if (!realTarget) {
        realTarget = document.createElement("a");
        realTarget.href = "/index.html";
        realHeader.insertBefore(realTarget, realHeader.firstChild);
      }
      brandMarkup(realTarget);
      generated.remove();
      return;
    }

    if (document.querySelector(BRAND_SELECTOR)) return;

    var existing = document.querySelector(CANDIDATES);
    if (existing && existing.tagName === "A") {
      brandMarkup(existing);
      return;
    }

    var header = realHeader || document.querySelector(HEADER_SELECTOR);
    var link = brandMarkup(document.createElement("a"));
    link.href = "/index.html";
    if (header) {
      header.insertBefore(link, header.firstChild);
      return;
    }

    generated = document.createElement("header");
    generated.className = "ec-global-header--generated";
    generated.setAttribute("aria-label", "EC Beauty 品牌導覽");
    generated.appendChild(link);
    document.body.insertBefore(generated, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installBrand, { once: true });
  } else {
    installBrand();
  }

  var observer = new MutationObserver(installBrand);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}());
