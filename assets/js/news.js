document.addEventListener("DOMContentLoaded", () => {
  const newsTop = document.getElementById("home-news-top");
  const newsBottom = document.getElementById("home-news-bottom");

  if (!newsTop && !newsBottom) {
    // Geen nieuwsvakken op deze pagina → niets doen
    return;
  }

  function renderNewsCard(item) {
    return `
      <article class="news-card">
        ${item.image ? `
        <div class="news-image-wrap">
          <img src="assets/img/news/${item.image}" alt="${item.title}">
        </div>` : ""}
        <h3>
          <a href="nieuws.html?id=${item.id}" class="news-link">
            ${item.title}
          </a>
        </h3>
        <p class="news-meta">
          ${item.competition || ""} ${item.date ? "• " + item.date : ""}
        </p>
        <p class="news-teaser">${item.teaser || ""}</p>
      </article>
    `;
  }

  function renderMoreButton() {
    return `
      <div style="text-align:center;margin-top:1rem;">
        <a href="nieuws.html" class="btn-primary">
          Meer Voetbalkoppen
        </a>
      </div>
    `;
  }

  fetch("data/news.json")
    .then(r => r.json())
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        if (newsTop) {
          newsTop.innerHTML = "<p>Momenteel geen nieuws beschikbaar.</p>";
        }
        return;
      }

      const firstFour = items.slice(0, 4);
      const nextSix = items.slice(4, 10);

      if (newsTop) {
        newsTop.innerHTML = firstFour.map(renderNewsCard).join("");
      }

      if (newsBottom) {
        newsBottom.innerHTML =
          nextSix.map(renderNewsCard).join("") + renderMoreButton();
      }
    })
    .catch(err => {
      console.error("Kon news.json niet laden:", err);
      if (newsTop) {
        newsTop.innerHTML = "<p>Kon nieuws niet laden.</p>";
      }
    });
});
