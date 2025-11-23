document.addEventListener("DOMContentLoaded", () => {
  const newsTop = document.getElementById("home-news-top");
  const newsBottom = document.getElementById("home-news-bottom");

  // Als we op een pagina zitten zonder nieuws-blokken, niets doen
  if (!newsTop && !newsBottom) {
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
    .then(r => {
      console.log("news.json status:", r.status);
      if (!r.ok) {
        throw new Error("HTTP foutstatus " + r.status);
      }
      return r.json();
    })
    .then(items => {
      console.log("Ingelezen nieuwsitems:", items);

      if (!Array.isArray(items) || items.length === 0) {
        if (newsTop) {
          newsTop.innerHTML = "<p>Momenteel geen nieuws beschikbaar.</p>";
        }
        if (newsBottom) {
          newsBottom.innerHTML = "";
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
          nextSix.map(renderNewsCard).join("") +
          renderMoreButton();
      }
    })
    .catch(err => {
      console.error("Kon news.json niet laden:", err);
      if (newsTop) {
        newsTop.innerHTML = "<p>Kon nieuws niet laden.</p>";
      }
      if (newsBottom) {
        newsBottom.innerHTML = "";
      }
    });
});
