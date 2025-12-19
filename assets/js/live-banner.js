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
    const labelLine = competitions.map(c => c.label).join(" · ");
    setMainText(`Live resultaten: ${labelLine} — geen live wedstrijden of bron niet beschikbaar.`);
  }

  // Plugbare datafunctie (later vervangen door API)
async function fetchFreeLiveLines() {
  // Werkt op GitHub Pages (/Voetbal4all/) én op eigen domein
  const REPO_BASE =
    (location.hostname.endsWith("github.io") || location.pathname.startsWith("/Voetbal4all/"))
      ? "/Voetbal4all"
      : "";

  const url = `${REPO_BASE}/data/live.json`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const data = await res.json();
  const items = Array.isArray(data) ? data : (data.items || []);

  const LIVE_STATUSES = new Set(["LIVE", "1H", "2H", "HT"]);

  const leagueShort = {
    BE1: "JPL",
    BE2: "CHL",
    NL1: "ED",
    NL2: "KKD"
  };

  return items
    .filter(m => LIVE_STATUSES.has(String(m.status).toUpperCase()))
    .filter(m => ["BE1", "BE2", "NL1", "NL2"].includes(m.leagueKey))
    .map(m =>
      `${leagueShort[m.leagueKey]}: ${m.home} ${m.homeGoals}–${m.awayGoals} ${m.away} (${m.minute}′)`
    );
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

      const show = lines.slice(0, 4).join(" · ");
      setMainText(show);
      setUpdated(new Date());
    } catch (e) {
      console.warn("Live banner error:", e);
      renderFallback();
      setUpdated(new Date());
    }
  }

  // Init + interval
  refresh();
  setInterval(refresh, 60 * 1000);
})();
