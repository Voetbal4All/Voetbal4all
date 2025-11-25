
document.addEventListener("DOMContentLoaded", () => {
  const newsTop = document.getElementById("home-news-top");
  const newsBottom = document.getElementById("home-news-bottom");
  const newsList = document.getElementById("news-list");
  const filterSelect = document.getElementById("news_categorie");

  fetch("data/news.json")
    .then(r => r.json())
    .then(items => {
      if (!Array.isArray(items)) items = [];
      // Split in top (1-4) and bottom (5-10)
      const topItems = items.slice(0, 4);
      const bottomItems = items.slice(4, 10);

      if (newsTop) {
        newsTop.innerHTML = renderNewsList(topItems);
      }
      if (newsBottom) {
        newsBottom.innerHTML = `
          <div class="news-section-header">
            <h2>Meer voetbalkoppen</h2>
            <p class="section-intro">Extra artikels, achtergrond en verhalen.</p>
          </div>
          ${renderNewsList(bottomItems)}
          <a href="nieuws.html" class="btn-outline" style="margin-top:0.5rem; display:inline-flex;">
            Meer Voetbalkoppen
          </a>
        `;
      }
      if (newsList) {
        // full list
        newsList.innerHTML = renderNewsList(items);
      }

      if (filterSelect && newsList) {
        filterSelect.addEventListener("change", () => {
          const val = filterSelect.value;
          const filtered = val ? items.filter(it => it.categorie === val) : items;
          newsList.innerHTML = renderNewsList(filtered);
        });
      }
    })
    .catch(err => {
      console.error("Nieuws laden mislukte", err);
      if (newsTop) newsTop.innerHTML = "<p>Kon nieuws niet laden.</p>";
      if (newsBottom) newsBottom.innerHTML = "<p>Kon nieuws niet laden.</p>";
      if (newsList) newsList.innerHTML = "<p>Er ging iets mis bij het laden van de nieuwsartikelen.</p>";
    });

  function renderNewsList(list) {
    if (!list || list.length === 0) {
      return "<p>Momenteel geen nieuws beschikbaar.</p>";
    }
    return list.map(item => {
      const imgHtml = item.image ? `<div style="margin-bottom:0.4rem;"><img src="${item.image}" alt="" style="width:100%; border-radius:10px; object-fit:cover; max-height:160px;"></div>` : "";
      const meta = [];
      if (item.categorie) meta.push(item.categorie);
      if (item.datum) meta.push(item.datum);
      return `
        <article class="news-card">
          ${imgHtml}
          <h3>${item.titel || ""}</h3>
          <p class="news-meta">${meta.join(" • ")}</p>
          <p class="news-teaser">${item.teaser || ""}</p>
        </article>
      `;
    }).join("");
  }
});
