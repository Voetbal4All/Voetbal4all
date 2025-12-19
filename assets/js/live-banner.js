// assets/js/live-banner.js
(() => {
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  const textEl = banner.querySelector(".live-text");
  const ctaBtn = banner.querySelector(".live-cta");
  if (!textEl) return;

  // Competities die jij wil tonen (labels/structuur blijven hetzelfde bij opschalen)
  const competitions = [
    { key: "BE1", label: "Jupiler Pro League" },
    { key: "BE2", label: "Challenger/Proximus League" },
    { key: "NL1", label: "Eredivisie" },
    { key: "NL2", label: "Keuken Kampioen Divisie" }
  ];

  // -------------------------------------------------------
  // GRATIS modus:
  // - We tonen “LIVE” indien gratis bron live data geeft
  // - Anders tonen we een nette fallback (geen lege banner)
  // -------------------------------------------------------

  const state = {
    lines: [],
    lastUpdated: null
  };

  function setText(str) {
    textEl.textContent = str;
  }

  function formatTime(d) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function renderFallback() {
    // Subtiel en professioneel: je laat de gebruiker “in het systeem”
    const labelLine = competitions.map(c => c.label).join(" · ");
    setText(`Live resultaten: ${labelLine} — geen live wedstrijden of gratis bron beperkt.`);
  }

  // Deze functie is bewust “plugbaar”.
  // Later vervangen we enkel deze functie door API-Football/SportMonks calls.
  async function fetchFreeLiveLines() {
    // Gratis bronnen zijn inconsistent voor jouw gewenste leagues.
    // Daarom: retourneer [] => fallback, of voeg hier later een gratis endpoint toe.
    return [];
  }

  async function refresh() {
    try {
      setText("Live resultaten laden…");

      const lines = await fetchFreeLiveLines();

      if (!Array.isArray(lines) || lines.length === 0) {
        renderFallback();
        state.lastUpdated = new Date();
        return;
      }

      // Max 4 items in de banner (strak)
      const show = lines.slice(0, 4).join(" · ");
      setText(show);
      state.lastUpdated = new Date();

    } catch (e) {
      console.warn("Live banner error:", e);
      renderFallback();
      state.lastUpdated = new Date();
    }
  }

  // CTA naar jouw resultatenpagina (pas aan als je andere URL wil)
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      window.location.href = "sportief-resultaten.html";
    });
  }

  // Init + refresh interval
  refresh();
  setInterval(refresh, 60 * 1000); // elke 60s refresh (gratis modus blijft licht)
})();
