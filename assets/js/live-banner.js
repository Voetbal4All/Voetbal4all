// assets/js/live-banner.js
(() => {
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  const textEl = banner.querySelector(".live-text");
  if (!textEl) return;

  // Rechterknop vervangen door socials (zelfde groene stijl als .live-cta)
  const cta = banner.querySelector(".live-cta");
  if (cta) {
    const wrap = document.createElement("div");
    wrap.className = "live-socials";
    wrap.style.display = "inline-flex";
    wrap.style.gap = "8px";
    wrap.style.alignItems = "center";

    const fb = document.createElement("a");
    fb.className = "live-cta";
    fb.href = "https://www.facebook.com/voetbal4all";
    fb.target = "_blank";
    fb.rel = "noopener";
    fb.textContent = "Facebook";

    const ig = document.createElement("a");
    ig.className = "live-cta";
    ig.href = "https://www.instagram.com/voetbal4all";
    ig.target = "_blank";
    ig.rel = "noopener";
    ig.textContent = "Instagram";

    wrap.appendChild(fb);
    wrap.appendChild(ig);

    cta.replaceWith(wrap);
  }

  // Timestamp
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

  const competitions = [
    "Jupiler Pro League",
    "Challenger Pro League",
    "Eredivisie",
    "Keuken Kampioen Divisie"
  ];

  function formatTime(d) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function setUpdated(d) {
    updatedEl.textContent = d ? `Laatst bijgewerkt: ${formatTime(d)}` : "";
  }

  function renderFallback() {
    mainTextEl.textContent = `Momenteel geen live wedstrijden (${competitions.join(" · ")}).`;
    setUpdated(new Date());

    const ticker = textEl.querySelector(".live-text-ticker");
    if (ticker) ticker.remove();
  }

  /* ======================================================
     DEMO data (later vervangen door echte API)
  ====================================================== */
  async function fetchFreeLiveLines() {
    return [
      "🇧🇪 Club Brugge 2–1 Anderlecht (72’)",
      "🇳🇱 Ajax 1–0 PSV (55’)",
      "🇧🇪 Beerschot 0–0 Zulte Waregem (33’)",
      "🇳🇱 Willem II 2–2 ADO Den Haag (81’)"
    ];
  }

  /* ======================================================
     Marquee zonder “te vroege reset”
     - We animeren van volledig rechts buiten beeld -> volledig links buiten beeld
     - Pas NA finish starten we opnieuw (dus pas als laatste karakter weg is)
     - Bij een refresh wachten we tot de huidige run klaar is, dan pas nieuwe tekst
  ====================================================== */

  let tickerWrap = null;
  let trackEl = null;
  let runningAnim = null;

  // Nieuwe tekst die pas bij "einde van run" mag ingaan
  let pendingJoinedText = null;

  // Snelheid: lager = trager. (px per seconde)
  const PX_PER_SEC = 55;

  function ensureTickerDom() {
    tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      // ticker tussen mainText en updated
      textEl.insertBefore(tickerWrap, updatedEl);
    }

    // Maak leeg en zet een track span (we gebruiken JS-animatie, niet CSS)
    tickerWrap.innerHTML = "";
    trackEl = document.createElement("span");
    trackEl.className = "live-marquee-track";
    trackEl.style.display = "inline-block";
    trackEl.style.whiteSpace = "nowrap";
    trackEl.style.willChange = "transform";
    trackEl.style.fontSize = "18px";
    trackEl.style.fontWeight = "700";
    trackEl.style.color = "var(--text)";

    tickerWrap.appendChild(trackEl);
  }

  function buildJoinedText(lines) {
    return lines.join("   •   ");
  }

  function startRun(joinedText) {
    if (!tickerWrap || !trackEl) ensureTickerDom();

    // Stop vorige animatie netjes
    if (runningAnim) {
      try { runningAnim.cancel(); } catch {}
      runningAnim = null;
    }

    trackEl.textContent = joinedText;

    // Belangrijk: eerst laten layouten, dan meten, dan animeren
    requestAnimationFrame(() => {
      const containerW = tickerWrap.clientWidth || 0;
      const textW = trackEl.scrollWidth || 0;

      // Als er niets te tonen valt
      if (containerW <= 0 || textW <= 0) return;

      // Start volledig rechts buiten beeld, eind volledig links buiten beeld
      const fromX = containerW;
      const toX = -textW;

      const distance = fromX - toX; // px
      const durationMs = Math.max(12000, Math.round((distance / PX_PER_SEC) * 1000));

      // Zet expliciet startpositie (geen “onmiddellijk opvullen”)
      trackEl.style.transform = `translateX(${fromX}px)`;

      runningAnim = trackEl.animate(
        [
          { transform: `translateX(${fromX}px)` },
          { transform: `translateX(${toX}px)` }
        ],
        { duration: durationMs, easing: "linear", fill: "forwards" }
      );

      runningAnim.onfinish = () => {
        // Als er een update klaar staat: gebruik die nu (exact na laatste karakter)
        if (pendingJoinedText !== null) {
          const next = pendingJoinedText;
          pendingJoinedText = null;
          startRun(next);
          return;
        }
        // Anders: dezelfde tekst opnieuw, opnieuw van rechts buiten beeld
        startRun(joinedText);
      };
    });
  }

  async function refreshData() {
    try {
      // Geen “Live wedstrijden” tekst
      mainTextEl.textContent = "";
      setUpdated(null);

      const lines = await fetchFreeLiveLines();
      if (!Array.isArray(lines) || lines.length === 0) {
        renderFallback();
        return;
      }

      const joined = buildJoinedText(lines);
      setUpdated(new Date());

      // Als de ticker nog niet draait: meteen starten
      if (!runningAnim) {
        ensureTickerDom();
        startRun(joined);
        return;
      }

      // Als hij draait: pas wisselen wanneer huidige run klaar is
      pendingJoinedText = joined;

    } catch (err) {
      console.warn("Live banner fout:", err);
      renderFallback();
    }
  }

  // Init
  ensureTickerDom();
  refreshData();

  // Data-refresh: niet elke minuut herstarten (dat veroorzaakt “te vroege reset”)
  // Je kan dit later verlagen als je echte live API hebt (bv. 60s),
  // maar met deze logica wisselt de tekst sowieso pas op het einde van de run.
  setInterval(refreshData, 5 * 60 * 1000);
})();
