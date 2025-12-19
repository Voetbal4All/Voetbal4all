// assets/js/live-banner.js
(() => {
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  const textEl = banner.querySelector(".live-text");
  if (!textEl) return;

  /* ----------------------------
     Sub-elementen
  ---------------------------- */

  // Timestamp
  const updatedEl =
    banner.querySelector(".live-updated") ||
    (() => {
      const el = document.createElement("div");
      el.className = "live-updated";
      textEl.appendChild(el);
      return el;
    })();

  // Hoofdtekst (boven ticker)
  let mainTextEl = textEl.querySelector(".live-text-main");
  if (!mainTextEl) {
    mainTextEl = document.createElement("span");
    mainTextEl.className = "live-text-main";
    textEl.insertBefore(mainTextEl, updatedEl);
  }

  /* ----------------------------
     Competities
  ---------------------------- */

  const competitions = [
    "Jupiler Pro League",
    "Challenger Pro League",
    "Eredivisie",
    "Keuken Kampioen Divisie"
  ];

  /* ----------------------------
     Helpers
  ---------------------------- */

  function formatTime(d) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  }

  function setUpdated(d) {
    updatedEl.textContent = d
      ? `Laatst bijgewerkt: ${formatTime(d)}`
      : "";
  }

  /* ----------------------------
     Fallback tekst
  ---------------------------- */

  function renderFallback() {
    mainTextEl.textContent =
      `Momenteel geen live wedstrijden (${competitions.join(" · ")}).`;
    banner.classList.remove("is-marquee");

    const ticker = textEl.querySelector(".live-text-ticker");
    if (ticker) ticker.remove();
  }

  /* ======================================================
     STAP 3A — DEMO DATA
  ====================================================== */

  async function fetchFreeLiveLines() {
    return [
      "🇧🇪 Club Brugge 2–1 Anderlecht (72’)",
      "🇳🇱 Ajax 1–0 PSV (55’)",
      "🇧🇪 Beerschot 0–0 Zulte Waregem (33’)",
      "🇳🇱 Willem II 2–2 ADO Den Haag (81’)"
    ];
  }

  /* ----------------------------
     CONTINUE MARQUEE RENDER
  ---------------------------- */

  function renderMarquee(lines) {
    if (!Array.isArray(lines) || !lines.length) return false;

    let tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      textEl.insertBefore(tickerWrap, updatedEl);
    }

    banner.classList.add("is-marquee");

    const joined = lines.join("   •   ");

    // BELANGRIJK: 2x dezelfde span
    tickerWrap.innerHTML = `
      <div class="marquee-track">
        <span>${joined}</span>
        <span>${joined}</span>
      </div>
    `;

    return true;
  }

  /* ----------------------------
     Refresh-cyclus
  ---------------------------- */

  async function refresh() {
    try {
      mainTextEl.textContent = ""; // geen "Live wedstrijden"
      setUpdated(null);

      const lines = await fetchFreeLiveLines();

      if (!lines || !lines.length) {
        renderFallback();
        setUpdated(new Date());
        return;
      }

      renderMarquee(lines);
      setUpdated(new Date());

    } catch (err) {
      console.warn("Live banner fout:", err);
      renderFallback();
      setUpdated(new Date());
    }
  }

  /* ----------------------------
     Init
  ---------------------------- */

  refresh();
  setInterval(refresh, 60 * 1000);
})();
