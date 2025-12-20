// assets/js/live-banner.js
(() => {
  function init() {
    const banner = document.querySelector(".live-banner");
    if (!banner) return;

    const textEl = banner.querySelector(".live-text");
    if (!textEl) return;

    // ----------------------------
    // Injecteer minimale CSS (zodat het NU werkt, zonder style.css)
    // ----------------------------
    const STYLE_ID = "live-banner-runtime-css";
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        /* Zorg dat de ticker echt ruimte krijgt */
        .live-banner .live-text { flex: 1 1 auto; min-width: 0; }

        .live-text-ticker {
          position: relative;
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
          min-height: 24px;
        }

        .live-marquee-track {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          font-size: 18px;
          font-weight: 700;
          color: var(--text, #f4f6fc);
        }

        /* Socials rechts: naast elkaar + groter + groen + glow */
        .live-socials {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-left: 10px;
          flex: 0 0 auto;
        }

        .live-social {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 255, 157, 0.6);
          background: rgba(1, 10, 6, 0.85);
          color: #00ff9d;
          box-shadow: 0 0 16px rgba(0,255,157,0.35);
          transition: transform 0.45s ease, box-shadow 0.45s ease, filter 0.45s ease;
        }

        .live-social:hover {
          transform: translateY(-1px) scale(1.06);
          box-shadow: 0 0 22px rgba(0,255,157,0.6);
          filter: drop-shadow(0 0 10px rgba(0,255,157,0.55));
        }

        .live-social svg {
          width: 22px;
          height: 22px;
          fill: currentColor;
          filter: drop-shadow(0 0 8px rgba(0,255,157,0.55));
        }
      `;
      document.head.appendChild(style);
    }

    // ----------------------------
    // Timestamp
    // ----------------------------
    const updatedEl =
      banner.querySelector(".live-updated") ||
      (() => {
        const el = document.createElement("div");
        el.className = "live-updated";
        textEl.appendChild(el);
        return el;
      })();

    function formatTime(d) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }

    function setUpdated(d) {
      updatedEl.textContent = d ? `Laatst bijgewerkt: ${formatTime(d)}` : "";
    }

    // ----------------------------
    // Hoofdtekst (leeg houden)
    // ----------------------------
    let mainTextEl = textEl.querySelector(".live-text-main");
    if (!mainTextEl) {
      mainTextEl = document.createElement("span");
      mainTextEl.className = "live-text-main";
      textEl.insertBefore(mainTextEl, updatedEl);
    }
    mainTextEl.textContent = ""; // GEEN "Live wedstrijden"

    // ----------------------------
    // Ticker wrapper
    // ----------------------------
    let tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      textEl.insertBefore(tickerWrap, updatedEl);
    }

    // Verwijder oude CTA knop (Bekijk live) indien die nog bestaat
    const oldCta = banner.querySelector(".live-cta");
    if (oldCta) oldCta.remove();

    // ----------------------------
    // Socials rechts (naast elkaar)
    // ----------------------------
    let socials = banner.querySelector(".live-socials");
    if (!socials) {
      socials = document.createElement("div");
      socials.className = "live-socials";
      banner.appendChild(socials);
    } else {
      socials.innerHTML = "";
    }

    const ICON_FB = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.06z"/>
      </svg>`;

    const ICON_IG = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4z"/>
        <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
        <path d="M17.5 6.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/>
      </svg>`;

    function addSocial(href, label, svg) {
      const a = document.createElement("a");
      a.className = "live-social";
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", label);
      a.innerHTML = svg;
      socials.appendChild(a);
    }

    addSocial("https://www.facebook.com/voetbal4all", "Voetbal4All op Facebook", ICON_FB);
    addSocial("https://www.instagram.com/voetbal4all", "Voetbal4All op Instagram", ICON_IG);

    // ----------------------------
    // Fallback
    // ----------------------------
    const competitions = [
      "Jupiler Pro League",
      "Challenger Pro League",
      "Eredivisie",
      "Keuken Kampioen Divisie"
    ];

    function renderFallback() {
      mainTextEl.textContent = `Momenteel geen live wedstrijden (${competitions.join(" · ")}).`;
      tickerWrap.innerHTML = "";
      stopAnimation();
    }

    // ----------------------------
    // DEMO data (blijft voorlopig)
    // ----------------------------
    async function fetchFreeLiveLines() {
      return [
        "🇧🇪 Club Brugge 2–1 Anderlecht (72’)",
        "🇳🇱 Ajax 1–0 PSV (55’)",
        "🇧🇪 Beerschot 0–0 Zulte Waregem (33’)",
        "🇳🇱 Willem II 2–2 ADO Den Haag (81’)"
      ];
    }

    // ----------------------------
    // Marquee animatie: pas reset NA volledig uit beeld
    // ----------------------------
    let currentAnim = null;
    let currentText = "";

    function stopAnimation() {
      if (currentAnim) {
        try { currentAnim.cancel(); } catch (_) {}
        currentAnim = null;
      }
    }

    function startMarquee(text) {
      stopAnimation();

      tickerWrap.innerHTML = `<div class="live-marquee-track"></div>`;
      const track = tickerWrap.querySelector(".live-marquee-track");
      track.textContent = text;

      // Volgende frame: meten + animeren
      requestAnimationFrame(() => {
        const containerW = tickerWrap.clientWidth || 0;
        const textW = track.scrollWidth || 0;
        if (!containerW || !textW) return;

        // Start volledig rechts buiten beeld, eind volledig links buiten beeld
        const startX = containerW;
        const endX = -textW;

        // Snelheid: lager = trager
        const pxPerSec = 55;
        const distance = startX - endX;
        const durationMs = Math.max(12000, (distance / pxPerSec) * 1000);

        // Web Animations API: geen “pauze”, en we weten exact wanneer het klaar is
        currentAnim = track.animate(
          [
            { transform: `translateX(${startX}px)` },
            { transform: `translateX(${endX}px)` }
          ],
          {
            duration: durationMs,
            iterations: 1,
            easing: "linear",
            fill: "forwards"
          }
        );

        // Herstart pas wanneer effectief volledig uit beeld (finish)
        currentAnim.onfinish = () => {
          // onmiddelijk opnieuw starten vanaf volledig rechts
          startMarquee(text);
        };
      });
    }

    function renderMarquee(lines) {
      if (!Array.isArray(lines) || lines.length === 0) return false;
      mainTextEl.textContent = "";

      // Gebruik bullets, netjes
      const joined = lines.join("   •   ");
      currentText = joined;
      startMarquee(joined);
      return true;
    }

    // ----------------------------
    // Refresh: NIET elke minuut resetten.
    // Alleen hertekenen als de inhoud wijzigt.
    // ----------------------------
    async function refresh() {
      try {
        setUpdated(null);

        const lines = await fetchFreeLiveLines();
        if (!lines || !lines.length) {
          renderFallback();
          setUpdated(new Date());
          return;
        }

        const joined = lines.join("   •   ");
        if (joined !== currentText) {
          renderMarquee(lines);
        }
        setUpdated(new Date());
      } catch (err) {
        console.warn("Live banner fout:", err);
        renderFallback();
        setUpdated(new Date());
      }
    }

    // Init + periodic update (zonder animatie te onderbreken)
    refresh();
    setInterval(refresh, 60 * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
