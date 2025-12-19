// assets/js/live-banner.js
(() => {
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  const textEl = banner.querySelector(".live-text");
  if (!textEl) return;

  /* ----------------------------
     Sub-elementen
  ---------------------------- */

  // Updated-timestamp
  const updatedEl =
    banner.querySelector(".live-updated") ||
    (() => {
      const el = document.createElement("div");
      el.className = "live-updated";
      textEl.appendChild(el);
      return el;
    })();

  // Hoofdtekst (boven de ticker)
  let mainTextEl = textEl.querySelector(".live-text-main");
  if (!mainTextEl) {
    mainTextEl = document.createElement("span");
    mainTextEl.className = "live-text-main";
    textEl.insertBefore(mainTextEl, updatedEl);
  }

  /* ----------------------------
     Competities (vast, schaalbaar)
  ---------------------------- */

  const competitions = [
    { key: "BE1", label: "Jupiler Pro League" },
    { key: "BE2", label: "Challenger Pro League" },
    { key: "NL1", label: "Eredivisie" },
    { key: "NL2", label: "Keuken Kampioen Divisie" }
  ];

  /* ----------------------------
     Helpers
  ---------------------------- */

  function formatTime(d) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function setMainText(str) {
    mainTextEl.textContent = str;
  }

  function setUpdated(d) {
    updatedEl.textContent = d
      ? `Laatst bijgewerkt: ${formatTime(d)}`
      : "";
  }

  /* ----------------------------
     Fallback (geen live data)
     👉 HIER pas je de tekst aan
  ---------------------------- */

  function renderFallback() {
    const labelLine = competitions.map(c => c.label).join(" · ");
    setMainText(
      `Momenteel geen live wedstrijden (${labelLine}).`
    );
    banner.classList.remove("is-marquee");
  }

  /* ======================================================
     STAP 3A — DEMO DATA (werkt NU, geen API nodig)
     Later vervangen door echte API (Stap 3B)
  ====================================================== */

  async function fetchFreeLiveLines() {
    // DEMO — altijd zichtbaar, ideaal om layout te testen
    return [
      "🇧🇪 JPL · Club Brugge 2–1 Anderlecht (72’)",
      "🇳🇱 Eredivisie · Ajax 1–0 PSV (55’)",
      "🇧🇪 CPL · Beerschot 0–0 Zulte Waregem (33’)",
      "🇳🇱 KKD · Willem II 2–2 ADO Den Haag (81’)"
    ];
  }

  /* ----------------------------
     Marquee / bewegende banner
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

    tickerWrap.innerHTML = `
      <div class="marquee-track">
        ${joined}
      </div>
    `;

    return true;
  }

  /* ----------------------------
     Refresh-cyclus
  ---------------------------- */

  async function refresh() {
    try {
      setMainText("Live wedstrijden");
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
  setInterval(refresh, 60 * 1000); // elke minuut verversen
})();
