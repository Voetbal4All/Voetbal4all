// assets/js/nav-mobile.js
(() => {
  let burger = null;
  let nav = null;

  function closeAll() {
    if (!nav || !burger) return;
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document
      .querySelectorAll(".nav-item--dropdown.is-open")
      .forEach((x) => x.classList.remove("is-open"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    burger = document.querySelector(".nav-burger");
    nav = document.querySelector(".nav-links");
    if (!burger || !nav) return;

    // Forceer start: menu dicht
    closeAll();

    // Burger togglet hoofdmenu
    burger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");

      if (!open) {
        document
          .querySelectorAll(".nav-item--dropdown.is-open")
          .forEach((x) => x.classList.remove("is-open"));
      }
    });

    // Dropdowns in burger-menu
    nav.querySelectorAll(".nav-item--dropdown > .nav-link--dropdown").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = btn.closest(".nav-item--dropdown");
        if (!item) return;

        // Sluit andere dropdowns
        nav.querySelectorAll(".nav-item--dropdown").forEach((x) => {
          if (x !== item) x.classList.remove("is-open");
        });

        // Toggle deze dropdown
        item.classList.toggle("is-open");
      });
    });

    // Klik buiten menu = sluiten
    document.addEventListener("click", closeAll);

    // Klik binnen nav mag het menu niet sluiten
    nav.addEventListener("click", (e) => e.stopPropagation());

    /* =======================
       Professional flags (ALL PAGES)
       - Replaces emoji flags (🇧🇪 🇳🇱 🌍)
       - Replaces bare BE/NL/INT fallbacks when they appear as standalone tokens
       - Uses inline SVG with global CSS hooks from style.css: .flag-icon / .flag-icon--int
       - Safe: limited to targeted containers + mutation observer; does not touch nav behavior
       ======================= */

    const FLAG_SVGS = {
      BE: (extraClass = "") => `
        <svg class="flag-icon ${extraClass}" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="6" height="12" x="0" y="0" fill="#000" />
          <rect width="6" height="12" x="6" y="0" fill="#FFD100" />
          <rect width="6" height="12" x="12" y="0" fill="#EF3340" />
        </svg>`,
      NL: (extraClass = "") => `
        <svg class="flag-icon ${extraClass}" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="18" height="4" x="0" y="0" fill="#AE1C28" />
          <rect width="18" height="4" x="0" y="4" fill="#FFFFFF" />
          <rect width="18" height="4" x="0" y="8" fill="#21468B" />
        </svg>`,
      INT: (extraClass = "") => `
        <svg class="flag-icon flag-icon--int ${extraClass}" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="18" height="12" fill="#0B1B2B" />
          <circle cx="9" cy="6" r="5.2" fill="#2B7A78" />
          <circle cx="9" cy="6" r="5.2" fill="none" stroke="#BFE3E0" stroke-width="0.7" opacity="0.65" />
          <path d="M3.8 6h10.4" stroke="#BFE3E0" stroke-width="0.8" opacity="0.8" />
          <path d="M9 0.9c1.9 1.7 1.9 8.8 0 10.2" stroke="#BFE3E0" stroke-width="0.8" opacity="0.8" fill="none" />
          <path d="M9 0.9c-1.9 1.7-1.9 8.8 0 10.2" stroke="#BFE3E0" stroke-width="0.8" opacity="0.8" fill="none" />
        </svg>`
    };

    function replaceFlagsInHTML(html) {
      if (!html || html.includes("flag-icon")) return html;

      // Emoji → SVG
      let out = html
        .replaceAll("🇧🇪", FLAG_SVGS.BE())
        .replaceAll("🇳🇱", FLAG_SVGS.NL())
        .replaceAll("🌍", FLAG_SVGS.INT());

      // Bare tokens (only when they appear as standalone words)
      // Avoid changing e.g. URLs or longer strings.
      out = out
        .replace(/(^|[^\w-])(BE)(?=([^\w-]|$))/g, (m, p1) => `${p1}<span class="flag-fallback-text">BE</span>`) // keep token readable if used
        .replace(/(^|[^\w-])(NL)(?=([^\w-]|$))/g, (m, p1) => `${p1}<span class="flag-fallback-text">NL</span>`)
        .replace(/(^|[^\w-])(INT)(?=([^\w-]|$))/g, (m, p1) => `${p1}<span class="flag-fallback-text">INT</span>`);

      return out;
    }

    function upgradeFlagContainers(root) {
      const scope = root || document;

      // Targeted containers where flags appear (avoid touching large page areas)
      const selectors = [
        ".live-banner .marquee-track",
        ".home-news__flag",
        "#article-country",
        ".meta-flag",
        ".ad-card-meta",
        ".ad-card-meta--country",
        ".country-flag"
      ];

      scope.querySelectorAll(selectors.join(",")).forEach((el) => {
        try {
          // Skip if already upgraded
          if (el.dataset && el.dataset.flagsUpgraded === "1") return;

          const html = el.innerHTML;
          const next = replaceFlagsInHTML(html);
          if (next !== html) {
            el.innerHTML = next;
          }

          if (el.dataset) el.dataset.flagsUpgraded = "1";
        } catch (_) {
          // no-op
        }
      });
    }

    // Initial pass
    upgradeFlagContainers(document);

    // Observe dynamic updates (news loads, live banner updates, etc.)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          // Upgrade only within added nodes
          m.addedNodes && m.addedNodes.forEach((n) => {
            if (n && n.nodeType === 1) upgradeFlagContainers(n);
          });
        } else if (m.type === "characterData") {
          const p = m.target && m.target.parentElement;
          if (p) upgradeFlagContainers(p);
        }
      }
    });

    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });
})();