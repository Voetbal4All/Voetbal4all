// assets/js/live-banner.js
(() => {
  function init() {
    const banner = document.querySelector(".live-banner");
    if (!banner) return;

    const textEl = banner.querySelector(".live-text");
    const labelEl = banner.querySelector(".live-label");
    if (!textEl || !labelEl) return;

    /* ----------------------------
       1) LIVE RESULTATEN terug op 2 regels (zonder HTML te wijzigen)
    ---------------------------- */
    if (!labelEl.dataset.stacked) {
      const dot = labelEl.querySelector(".live-dot");
      // haal alle tekst (zonder dot) op
      const rawText = Array.from(labelEl.childNodes)
        .filter(n => !(n.nodeType === 1 && n.classList && n.classList.contains("live-dot")))
        .map(n => n.textContent || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      // reset label en bouw opnieuw op: DOT + (tekstwrap)
      labelEl.innerHTML = "";
      
      // DOT opnieuw aanmaken zodat hij altijd links staat
      const newDot = document.createElement("span");
      newDot.className = "live-dot";
      labelEl.appendChild(newDot);

      const parts = rawText ? rawText.split(" ") : ["Live", "resultaten"];
      const first = (parts[0] || "Live").toUpperCase();
      const second = (parts.slice(1).join(" ") || "resultaten").toUpperCase();

      const wrap = document.createElement("div");
      wrap.className = "live-label-text";
      wrap.innerHTML = `<div class="live-label-top">${first}</div><div class="live-label-bottom">${second}</div>`;
      labelEl.appendChild(wrap);

      labelEl.dataset.stacked = "1";
    }

    /* ----------------------------
       2) Update-element: onder LIVE RESULTATEN, maar NIET als anchor gebruiken
    ---------------------------- */
    let updatedEl = labelEl.querySelector(".live-updated");
    if (!updatedEl) {
      updatedEl = document.createElement("div");
      updatedEl.className = "live-updated";
      labelEl.appendChild(updatedEl);
    }

    function formatTime(d) {
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }

    function setUpdated(d) {
      updatedEl.textContent = d ? `Laatst Bijgewerkt: ${formatTime(d)}` : "";
    }

    /* ----------------------------
       3) Zorg dat ticker altijd bestaat in .live-text
    ---------------------------- */
    // hoofdtekst leeg houden (zoals je wenst)
    let mainTextEl = textEl.querySelector(".live-text-main");
    if (!mainTextEl) {
      mainTextEl = document.createElement("span");
      mainTextEl.className = "live-text-main";
      textEl.prepend(mainTextEl);
    }
    mainTextEl.textContent = "";

    // ticker wrapper
    let tickerWrap = textEl.querySelector(".live-text-ticker");
    if (!tickerWrap) {
      tickerWrap = document.createElement("div");
      tickerWrap.className = "live-text-ticker";
      textEl.appendChild(tickerWrap);
    }

    /* ----------------------------
       4) Verwijder CTA knop (Bekijk live) zodat geen 404
    ---------------------------- */
    const oldCta = banner.querySelector(".live-cta");
    if (oldCta) oldCta.remove();

    /* ----------------------------
       5) Socials rechts: "Volg ons op:" + 2 iconen naast elkaar, geen duplicaten
    ---------------------------- */
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

    const iconsWrap = socials.querySelector(".live-socials-icons");

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

    function addSocial(href, label, svg, cls) {
      const a = document.createElement("a");
      a.className = `live-social ${cls}`;
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", label);
      a.innerHTML = svg;
      iconsWrap.appendChild(a);
    }

    addSocial("https://www.facebook.com/voetbal4all", "Voetbal4All op Facebook", ICON_FB, "is-facebook");
    addSocial("https://www.instagram.com/voetbal4all", "Voetbal4All op Instagram", ICON_IG, "is-instagram");

    /* ----------------------------
       6) Demo data + marquee render (met extra spacing)
    ---------------------------- */
    async function fetchFreeLiveLines() {
      return [
        "🇧🇪 Club Brugge 2–1 Anderlecht (72’)",
        "🇳🇱 Ajax 1–0 PSV (55’)",
        "🇧🇪 Beerschot 0–0 Zulte Waregem (33’)",
        "🇳🇱 Willem II 2–2 ADO Den Haag (81’)"
      ];
    }

    function renderFallback() {
      const competitions = [
        "Jupiler Pro League",
        "Challenger Pro League",
        "Eredivisie",
        "Keuken Kampioen Divisie"
      ];
      mainTextEl.textContent = `Momenteel geen live wedstrijden (${competitions.join(" · ")}).`;
      tickerWrap.innerHTML = "";
      banner.classList.remove("is-marquee");
    }

    function renderMarquee(lines) {
      if (!Array.isArray(lines) || !lines.length) return false;

      banner.classList.add("is-marquee");
      mainTextEl.textContent = "";

      const SEP = " \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 • \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ";
      const joined = lines.join(SEP);

      tickerWrap.innerHTML = `<div class="marquee-track"></div>`;
      const track = tickerWrap.querySelector(".marquee-track");
      track.textContent = joined;

      // herstart animatie obv echte breedtes (start buiten rechts, eind buiten links)
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
