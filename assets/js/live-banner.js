(function () {
  // Pas deze selectors aan als jouw HTML andere classes/ids gebruikt
  const banner = document.querySelector(".live-banner");
  if (!banner) return;

  // We injecteren tekst in bestaande elementen (maak ze aan in je HTML of laat dit script ze toevoegen)
  let left = banner.querySelector(".live-left");
  let mid = banner.querySelector(".live-text");
  let right = banner.querySelector(".live-cta");

  // Als je HTML nog geen specifieke blokken heeft, maken we ze aan (non-breaking)
  if (!left) {
    left = document.createElement("div");
    left.className = "live-left";
    left.innerHTML = `<span class="live-label"><span class="live-dot"></span> Live</span>`;
    banner.prepend(left);
  }

  if (!mid) {
    mid = document.createElement("div");
    mid.className = "live-text";
    banner.appendChild(mid);
  }

  if (!right) {
    right = document.createElement("a");
    right.className = "live-cta";
    right.href = "sportief-resultaten.html";
    right.textContent = "Alle live resultaten";
    banner.appendChild(right);
  }

  function formatMatch(m) {
    const min = (typeof m.minute === "number") ? `${m.minute}'` : "";
    const score = m.score || "-";
    return `${m.home} ${score} ${m.away}${min ? " · " + min : ""}`;
  }

  function flatten(data) {
    const out = [];
    (data.leagues || []).forEach(l => {
      (l.matches || []).forEach(m => out.push({ league: l.name, ...m }));
    });
    return out;
  }

  async function load() {
    try {
      const res = await fetch("data/live-scores.json", { cache: "no-store" });
      if (!res.ok) throw new Error("live-scores.json not reachable");
      const data = await res.json();

      const matches = flatten(data).filter(m => (m.status || "").toUpperCase() === "LIVE");

      if (!matches.length) {
        mid.textContent = "Momenteel geen live wedstrijden in de geselecteerde competities.";
        return;
      }

      // Rotatie (1 regel tegelijk)
      let i = 0;
      const render = () => {
        const m = matches[i % matches.length];
        mid.textContent = `${m.league}: ${formatMatch(m)}`;
        i++;
      };

      render();
      setInterval(render, 6000);
    } catch (e) {
      mid.textContent = "Live resultaten konden niet geladen worden.";
      // console voor debug
      console.warn(e);
    }
  }

  load();
})();
