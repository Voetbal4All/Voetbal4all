// assets/js/live-banner.js
(() => {
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  const textEl = banner.querySelector(".live-text");
  if (!textEl) return;

  /* ----------------------------
     Sub-elementen (bestaan of worden aangemaakt)
  ---------------------------- */

  // Timestamp (bestaat al in je HTML, maar we maken 'm aan indien niet)
  const updatedEl =
    banner.querySelector(".live-updated") ||
    (() => {
      const el = document.createElement("div");
      el.className = "live-updated";
      textEl.appendChild(el);
      return el;
    })();

  // Hoofdtekst (we houden die leeg; jij hebt al "Live resultaten" links)
  let mainTextEl = textEl.querySelector(".live-text-main");
  if (!mainTextEl) {
    mainTextEl = document.createElement("span");
    mainTextEl.className = "live-text-main";
    // boven de ticker, maar boven updatedEl
    textEl.insertBefore(mainTextEl, updatedEl);
  }
  mainTextEl.textContent = ""; // verwijdert "Live wedstrijden"

  // Ticker wrapper (wordt gevuld met marquee track)
  let tickerWrap = textEl.querySelector(".live-text-ticker");
  if (!tickerWrap) {
    tickerWrap = document.createElement("div");
    tickerWrap.className = "live-text-ticker";
    textEl.insertBefore(tickerWrap, updatedEl);
  }

  /* ----------------------------
     Socials rechts: vervang oude "Bekijk live" CTA door iconen
     - groen zoals je knop
     - onder elkaar verdeeld over hoogte
  ---------------------------- */

  // Verwijder oude CTA als die bestaat
  const oldCta = banner.querySelector(".live-cta");
  if (oldCta) oldCta.remove();

  // Maak socials container
  let socials = banner.querySelector(".live-socials");
  if (!socials) {
    socials = document.createElement("div");
    socials.className = "live-socials";
    banner.appendChild(socials);
  }

  // SVG icons (inline, geen externe libs nodig)
  const ICON_FB = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.06z"/>
    </svg>
  `;

  const ICON_IG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4z"/>
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
      <path d="M17.5 6.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/>
    </svg>
  `;

  function ensureSocialButton({ cls, href, label, svg }) {
    let a = socials.querySelector(`.${cls}`);
    if (!a) {
      a = document.createElement("a");
      a.className = `live-social ${cls}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", label);
      socials.appendChild(a);
    }
    a.href = href;
    a.innerHTML = svg;
    return a;
  }

  // Zet jouw juiste links (zoals in footer)
  ensureSocialButton({
    cls: "is-facebook",
    href: "https://www.facebook.com/voetbal4all",
    label: "Voetbal4All op Facebook",
    svg: ICON_FB
  });

  ensureSocialButton({
    cls: "is-instagram",
    href: "https://www.instagram.com/voetbal4all",
    label: "Voetbal4All op Instagram",
    svg: ICON_IG
  });

  /* ----------------------------
     Competities (voor fallback tekst)
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
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function setUpdated(d) {
    updatedEl.textContent = d ? `Laatst bijgewerkt: ${formatTime(d)}` : "";
  }

  function renderFallback() {
    // tekst wanneer geen live wedstrijden of geen bron
    mainTextEl.textContent = `Momenteel geen live wedstrijden (${competitions.join(" · ")}).`;

    // ticker leegmaken
    tickerWrap.innerHTML = "";
    banner.classList.remove("is-marquee");
  }

  /* ======================================================
     STAP 3A — DEMO DATA (nu)
     Later vervangen door live API (Stap 3B)
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
     Pixel-perfect marquee (geen “te vroege reset”)
     - reset pas wanneer laatste karakter links uit beeld is
     - start pas wanneer eerste karakter volledig rechts buiten beeld staat
  ---------------------------- */

  function renderMarquee(lines) {
    if (!Array.isArray(lines) || !lines.length) return false;

    banner.classList.add("is-marquee");
    mainTextEl.textContent = ""; // hou bovenlijn leeg

    const joined = lines.join("   •   ");

    // Maak track (we gebruiken een eigen class die we morgen in CSS gaan stijlen)
    tickerWrap.innerHTML = `<div class="live-marquee-track"></div>`;
    const track = tickerWrap.querySelector(".live-marquee-track");
    track.textContent = joined;

    // Meten NA render
    requestAnimationFrame(() => {
      const containerW = tickerWrap.clientWidth || 0;
      const textW = track.scrollWidth || 0;

      // Als er niet gemeten kan worden, laat standaard gedrag
      if (!containerW || !textW) return;

      // Start: tekst volledig rechts buiten beeld
      // End: tekst volledig links buiten beeld
      const startX = containerW;
      const endX = -textW;

      // Snelheid: px per seconde (rustig / professioneel)
      // Pas aan naar smaak (lager = trager)
      const pxPerSec = 70;

      const distance = startX - endX; // totale afstand in px
      const durationSec = Math.max(12, distance / pxPerSec); // minimum 12s

      // Zet CSS variabelen op element (werkt zodra CSS dit gebruikt)
      track.style.setProperty("--live-marquee-start", `${startX}px`);
      track.style.setProperty("--live-marquee-end", `${endX}px`);
      track.style.setProperty("--live-marquee-duration", `${durationSec}s`);

      // Forceer herstart van animatie zodat hij vanaf helemaal rechts begint
      track.style.animation = "none";
      void track.offsetHeight; // reflow
      track.style.animation = ""; // terug naar CSS default (met vars)
    });

    return true;
  }

  /* ----------------------------
     Refresh-cyclus
  ---------------------------- */

  async function refresh() {
    try {
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

  // Ververs data (niet de animatie) elke minuut
  // Opmerking: de animatie loopt zelf continu.
  setInterval(refresh, 60 * 1000);
})();
