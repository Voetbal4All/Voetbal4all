// assets/js/live-banner.js
(() => {
  function init() {
    const banner = document.querySelector(".live-banner");
    if (!banner) return;

    const textEl = banner.querySelector(".live-text");
    if (!textEl) return;

    // Timestamp
    const updatedEl =
      banner.querySelector(".live-updated") ||
      (() => {
        const el = document.createElement("div");
        el.className = "live-updated";
        textEl.appendChild(el);
        return el;
      })();

    // Hoofdtekst (leeg houden)
    let mainTextEl = textEl.querySelector(".live-text-main");
    if (!mainTextEl) {
      mainTextEl = document.createElement("span");
      mainTextEl.className = "live-text-main";
      textEl.insertBefore(mainTextEl, updatedEl);
    }
    mainTextEl.textContent = "";

    // Ticker wrapper
    let tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      textEl.insertBefore(tickerWrap, updatedEl);
    }

    // Verwijder oude CTA knop (Bekijk live)
    const oldCta = banner.querySelector(".live-cta");
    if (oldCta) oldCta.remove();

    // -----------------------------------
    // SOCIALS (cleanup + rebuild) => NO duplicates
    // -----------------------------------
    const existingSocials = banner.querySelector(".live-socials");
    if (existingSocials) existingSocials.remove();

    const socials = document.createElement("div");
    socials.className = "live-socials";
    // Forceer groen + glow zonder CSS-wijziging vandaag
    socials.style.display = "flex";
    socials.style.flexDirection = "column";
    socials.style.alignItems = "center";
    socials.style.justifyContent = "center";
    socials.style.gap = "8px";
    socials.style.minWidth = "96px";
    socials.style.color = "#00ff9d"; // groen
    socials.style.filter = "drop-shadow(0 0 10px rgba(0,255,157,0.75))";

    const socialsLabel = document.createElement("div");
    socialsLabel.className = "live-socials-label";
    socialsLabel.textContent = "Volg ons op:";
    socialsLabel.style.fontSize = "10px";          // iets kleiner
    socialsLabel.style.textTransform = "uppercase";
    socialsLabel.style.letterSpacing = "0.12em";  // minder spacing
    socialsLabel.style.fontWeight = "600";
    socialsLabel.style.whiteSpace = "nowrap";     // 🔑 voorkomt 2 lijnen
    socialsLabel.style.lineHeight = "1";
    socialsLabel.style.color = "currentColor"; // groen
    banner.appendChild(socials);
    socials.appendChild(socialsLabel);

    // Correcte iconen
    const ICON_FB = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.06z"/>
      </svg>`;

    const ICON_IG = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="4" width="16" height="16" rx="4" ry="4"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17" cy="7" r="1"></circle>
      </svg>`;

function makeSocialButton(href, label, svg) {
  const a = document.createElement("a");
  a.className = "live-social";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", label);

  // RONDE container (BELANGRIJK)
  a.style.width = "44px";
  a.style.height = "44px";
  a.style.borderRadius = "999px";
  a.style.display = "inline-flex";
  a.style.alignItems = "center";
  a.style.justifyContent = "center";
  a.style.border = "1px solid rgba(0,255,157,0.65)";
  a.style.background = "rgba(1,10,6,0.85)";
  a.style.color = "#00ff9d";
  a.style.overflow = "hidden";          // 🔑 FIX voor Instagram
  a.style.filter = "drop-shadow(0 0 8px rgba(0,255,157,0.8))";
  a.style.transition = "transform 0.25s ease";

  a.addEventListener("mouseenter", () => (a.style.transform = "scale(1.06)"));
  a.addEventListener("mouseleave", () => (a.style.transform = "scale(1)"));

  a.innerHTML = svg;

  // SVG correct schalen + centreren
  const svgEl = a.querySelector("svg");
  if (svgEl) {
    svgEl.style.width = "26px";
    svgEl.style.height = "26px";
    svgEl.style.display = "block";
    svgEl.style.fill = "currentColor";
  }

  return a;
}

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "10px";
    row.style.alignItems = "center";
    socials.appendChild(row);

    row.appendChild(
      makeSocialButton(
        "https://www.facebook.com/voetbal4all",
        "Voetbal4All op Facebook",
        ICON_FB
      )
    );
    row.appendChild(
      makeSocialButton(
        "https://www.instagram.com/voetbal4all",
        "Voetbal4All op Instagram",
        ICON_IG
      )
    );

    // -----------------------------------
    // Helpers
    // -----------------------------------
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
      tickerWrap.innerHTML = "";
      banner.classList.remove("is-marquee");
    }

    // DEMO data
    async function fetchFreeLiveLines() {
      return [
        "🇧🇪 Club Brugge 2–1 Anderlecht (72’)",
        "🇳🇱 Ajax 1–0 PSV (55’)",
        "🇧🇪 Beerschot 0–0 Zulte Waregem (33’)",
        "🇳🇱 Willem II 2–2 ADO Den Haag (81’)"
      ];
    }

    function renderMarquee(lines) {
      if (!Array.isArray(lines) || !lines.length) return false;

      banner.classList.add("is-marquee");
      mainTextEl.textContent = "";

      // EXTRA spacing tussen scores (unicode spaces werken overal)
      const SEP = " \u00A0\u00A0\u00A0\u00A0\u00A0 • \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ";
      const joined = lines.join(SEP);

      tickerWrap.innerHTML = `<div class="marquee-track"></div>`;
      const track = tickerWrap.querySelector(".marquee-track");
      track.textContent = joined;

      requestAnimationFrame(() => {
        const containerW = tickerWrap.clientWidth || 0;
        const textW = track.scrollWidth || 0;
        if (!containerW || !textW) return;

        const startX = containerW;
        const endX = -textW;

        const pxPerSec = 70;
        const distance = startX - endX;
        const durationSec = Math.max(14, distance / pxPerSec);

        track.style.setProperty("--live-marquee-start", `${startX}px`);
        track.style.setProperty("--live-marquee-end", `${endX}px`);
        track.style.setProperty("--live-marquee-duration", `${durationSec}s`);

        track.style.animation = "none";
        void track.offsetHeight;
        track.style.animation = "";
      });

      return true;
    }

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

    refresh();
    setInterval(refresh, 60 * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
