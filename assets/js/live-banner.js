// assets/js/live-banner.js
(() => {
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  const textEl = banner.querySelector(".live-text");
  if (!textEl) return;

  const updatedEl =
    banner.querySelector(".live-updated") ||
    (() => {
      const el = document.createElement("div");
      el.className = "live-updated";
      textEl.appendChild(el);
      return el;
    })();

  // Zorg dat we NIET heel .live-text overschrijven (anders verdwijnt live-updated)
  let mainTextEl = textEl.querySelector(".live-text-main");
  if (!mainTextEl) {
    mainTextEl = document.createElement("span");
    mainTextEl.className = "live-text-main";
    // Zet main text voor de updatedEl
    textEl.insertBefore(mainTextEl, updatedEl);
  }

  // Competities (labels blijven identiek bij opschalen)
  const competitions = [
    { key: "BE1", label: "Jupiler Pro League" },
    { key: "BE2", label: "Challenger/Proximus League" },
    { key: "NL1", label: "Eredivisie" },
    { key: "NL2", label: "Keuken Kampioen Divisie" }
  ];

  function formatTime(d) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function setMainText(str) {
    mainTextEl.textContent = str;
  }

  function setUpdated(d) {
    updatedEl.textContent = d ? `Laatst bijgewerkt: ${formatTime(d)}` : "";
  }

function renderFallback() {
  setMainText("Momenteel geen live wedstrijden in België en Nederland beschikbaar.");
}

  // ----------------------------
  // Ticker state
  // ----------------------------
  let tickerLines = [];
  let tickerIndex = 0;
  let tickerTimer = null;

  // We tonen 1 regel tegelijk, wisselt automatisch
  function renderTicker(lines) {
    // stop vorige timer
    if (tickerTimer) {
      clearInterval(tickerTimer);
      tickerTimer = null;
    }

    tickerLines = Array.isArray(lines) ? lines.filter(Boolean) : [];
    tickerIndex = 0;

    // Geen lijnen => fallback tekst in mainText
    if (!tickerLines.length) return false;

    // Zorg dat er een ticker container bestaat in de banner
    let tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      // ticker komt onder mainTextEl, maar boven updatedEl
      textEl.insertBefore(tickerWrap, updatedEl);
    }

    // Helper om één item te tonen
    function showLine(nextText) {
      const current = tickerWrap.querySelector(".live-ticker-item.is-active");

      const next = document.createElement("div");
      next.className = "live-ticker-item";
      next.textContent = nextText;

      tickerWrap.appendChild(next);

      // force reflow zodat transitions zeker starten
      void next.offsetWidth;

      // laat huidige wegschuiven
      if (current) {
        current.classList.remove("is-active");
        current.classList.add("is-exiting");
        setTimeout(() => current.remove(), 520);
      }

      // zet nieuwe actief
      next.classList.add("is-active");
    }

    // Init: eerste item tonen
    showLine(tickerLines[tickerIndex]);

    // Als er maar 1 lijn is, geen interval nodig
    if (tickerLines.length === 1) return true;

    // Interval: om de X seconden wisselen
    tickerTimer = setInterval(() => {
      tickerIndex = (tickerIndex + 1) % tickerLines.length;
      showLine(tickerLines[tickerIndex]);
    }, 3500);

    return true;
  }
  async function refresh() {
    try {
      setMainText("Live resultaten laden…");
      setUpdated(null);

      const lines = await fetchFreeLiveLines();

      if (!Array.isArray(lines) || lines.length === 0) {
        renderFallback();
        setUpdated(new Date());
        return;
      }

      // Zet de “hoofdlijn” kort en vast (strak)
      setMainText("Live wedstrijden (ticker)");

      // Start ticker met alle lijnen
      const started = renderTicker(lines);

      if (!started) {
        renderFallback();
      }

      setUpdated(new Date());
      
    } 
    catch (e) {
      console.warn("Live banner error:", e);
      renderFallback();
      setUpdated(new Date());
    }
  }

  // Init + interval
  refresh();
  setInterval(refresh, 60 * 1000);
})();
