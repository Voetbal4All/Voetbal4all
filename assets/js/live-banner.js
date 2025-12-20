// assets/js/live-banner.js
(() => {
  function init() {
    const banner = document.querySelector(".live-banner");
    if (!banner) return;

    const textEl = banner.querySelector(".live-text");
    if (!textEl) return;

    /* ============================
       Runtime CSS (tijdelijk)
       ============================ */
    const STYLE_ID = "live-banner-runtime-css";
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        .live-text { flex: 1 1 auto; min-width: 0; }

        .live-text-ticker {
          position: relative;
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
          min-height: 26px;
        }

        .live-marquee-track {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          font-size: 18px;
          font-weight: 700;
          color: #f4f6fc;
        }

        /* Socials */
        .live-socials {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-left: 12px;
          flex: 0 0 auto;
        }

        .live-socials-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #00ff9d;
          text-shadow: 0 0 10px rgba(0,255,157,0.6);
        }

        .live-socials-icons {
          display: inline-flex;
          gap: 10px;
        }

        .live-social {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0,255,157,0.6);
          background: rgba(1,10,6,0.85);
          color: #00ff9d;
          box-shadow: 0 0 16px rgba(0,255,157,0.35);
          transition: transform 0.45s ease, box-shadow 0.45s ease;
        }

        .live-social:hover {
          transform: translateY(-1px) scale(1.06);
          box-shadow: 0 0 22px rgba(0,255,157,0.6);
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

    /* ============================
       Timestamp
       ============================ */
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

    /* ============================
       Hoofdtekst leeg
       ============================ */
    let mainTextEl = textEl.querySelector(".live-text-main");
    if (!mainTextEl) {
      mainTextEl = document.createElement("span");
      mainTextEl.className = "live-text-main";
      textEl.insertBefore(mainTextEl, updatedEl);
    }
    mainTextEl.textContent = "";

    /* ============================
       Ticker wrapper
       ============================ */
    let tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      textEl.insertBefore(tickerWrap, updatedEl);
    }

    /* ============================
       CTA verwijderen
       ============================ */
    const oldCta = banner.querySelector(".live-cta");
    if (oldCta) oldCta.remove();

    /* ============================
       Socials rechts
       ============================ */
    let socials = banner.querySelector(".live-socials");
    if (!socials) {
      socials = document.createElement("div");
      socials.className = "live-socials";
      banner.appendChild(socials);
    }
    socials.innerHTML = `
      <div class="live-socials-label">Volg ons op:</div>
      <div class="live-socials-icons"></div>
    `;
    const socialsIcons = socials.querySelector(".live-socials-icons");

    const ICON_FB = `<svg viewBox="0 0 24 24"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.08 22 12.06z"/></svg>`;
    const ICON_IG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <!-- Buitenframe -->
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z"/>
      <!-- Camera lens -->
      <path d="M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6a2.8 2.8 0 0 0 0-5.6z"/>
      <!-- Kleine stip -->
      <path d="M17.5 6.3a1.2 1.2 0 1 1 0 2.4a1.2 1.2 0 0 1 0-2.4z"/>
    </svg>
    `;

    function addSocial(href, label, svg) {
      const a = document.createElement("a");
      a.className = "live-social";
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", label);
      a.innerHTML = svg;
      socialsIcons.appendChild(a);
    }

    addSocial("https://www.facebook.com/voetbal4all", "Facebook", ICON_FB);
    addSocial("https://www.instagram.com/voetbal4all", "Instagram", ICON_IG);

    /* ============================
       DEMO DATA
       ============================ */
    async function fetchFreeLiveLines() {
      return [
        "🇧🇪 Club Brugge 2–1 Anderlecht (72’)",
        "🇳🇱 Ajax 1–0 PSV (55’)",
        "🇧🇪 Beerschot 0–0 Zulte Waregem (33’)",
        "🇳🇱 Willem II 2–2 ADO Den Haag (81’)"
      ];
    }

    /* ============================
       Marquee (correct reset)
       ============================ */
    let currentAnim = null;
    let currentText = "";

    function startMarquee(text) {
      if (currentAnim) currentAnim.cancel();

      tickerWrap.innerHTML = `<div class="live-marquee-track"></div>`;
      const track = tickerWrap.firstElementChild;
      track.textContent = text;

      requestAnimationFrame(() => {
        const startX = tickerWrap.clientWidth;
        const endX = -track.scrollWidth;
        const pxPerSec = 55;
        const duration = Math.max(12000, ((startX - endX) / pxPerSec) * 1000);

        currentAnim = track.animate(
          [
            { transform: `translateX(${startX}px)` },
            { transform: `translateX(${endX}px)` }
          ],
          { duration, easing: "linear", fill: "forwards" }
        );

        currentAnim.onfinish = () => startMarquee(text);
      });
    }

    async function refresh() {
      const lines = await fetchFreeLiveLines();
      const joined = lines.join("        •        "); // MEER SPANNING

      if (joined !== currentText) {
        currentText = joined;
        startMarquee(joined);
      }
      setUpdated(new Date());
    }

    refresh();
    setInterval(refresh, 60000);
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
