
(async function () {
  async function loadNews() {
    try {
      const resp = await fetch("data/news.json", { cache: "no-store" });
      if (!resp.ok) return [];
      const data = await resp.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Fout bij laden nieuws", e);
      return [];
    }
  }

  function createNewsCard(item) {
    const card = document.createElement("article");
    card.className = "news-card";

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "Nieuwsartikel";
    card.appendChild(h3);

    const meta = document.createElement("p");
    meta.className = "news-meta";
    const comp = item.competitionLabel || "Voetbal";
    const gender = item.gender
      ? item.gender === "dames"
        ? "Dames"
        : "Heren"
      : "";
    meta.textContent = [comp, gender].filter(Boolean).join(" · ");
    card.appendChild(meta);

    if (item.teaser) {
      const teaser = document.createElement("p");
      teaser.className = "news-teaser";
      teaser.textContent = item.teaser;
      card.appendChild(teaser);
    }

    return card;
  }

  const news = await loadNews();
  if (!news.length) return;

  const homeTop = document.getElementById("home-news-top");
  const homeBottom = document.getElementById("home-news-bottom");
  const nieuwsLijst = document.getElementById("nieuws-lijst");

  if (homeTop) {
    const header = document.createElement("div");
    header.className = "news-section-header";
    header.innerHTML =
      '<h2>Voetbalkoppen</h2><p class="section-intro">Korte voetbalnieuwsberichten uit verschillende competities.</p>';
    homeTop.appendChild(header);

    news.slice(0, 4).forEach((n) => homeTop.appendChild(createNewsCard(n)));
  }

  if (homeBottom) {
    const rest = news.slice(4, 10);
    if (rest.length) {
      const header = document.createElement("div");
      header.className = "news-section-header";
      header.innerHTML =
        '<h2>Meer voetbalkoppen</h2><p class="section-intro">Uitgebreidere koppen worden hieronder getoond.</p>';
      homeBottom.appendChild(header);
      rest.forEach((n) => homeBottom.appendChild(createNewsCard(n)));
    }
  }

  if (nieuwsLijst) {
    news.forEach((n) => nieuwsLijst.appendChild(createNewsCard(n)));
  }
})();
