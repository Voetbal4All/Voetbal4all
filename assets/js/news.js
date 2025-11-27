
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("news-list");
  if (!list) return;

  fetch("data/news.json")
    .then(r => r.json())
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        list.innerHTML = "<p>Momenteel geen nieuws beschikbaar.</p>";
        return;
      }
      list.innerHTML = items.map(item => {
        const flagSrc = item.land === "BE" ? "assets/img/flags/be.png"
                       : item.land === "NL" ? "assets/img/flags/nl.png"
                       : "assets/img/flags/world.png";
        const imgHtml = item.image
          ? `<img src="${item.image}" alt="${item.titel}" class="news-card-thumb">`
          : "";
        return `
          <article class="news-card">
            <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.3rem;">
              <img src="${flagSrc}" alt="${item.land}" style="width:22px;height:auto;border-radius:4px;">
              <h3 style="margin:0;font-size:0.95rem;">${item.titel}</h3>
            </div>
            ${imgHtml}
            <div class="news-meta">${item.competitie || ""} • ${item.datum || ""}</div>
            <p class="news-teaser">${item.teaser || ""}</p>
          </article>
        `;
      }).join("");
    })
    .catch(err => {
      console.error(err);
      list.innerHTML = "<p>Er ging iets mis bij het laden van nieuws.</p>";
    });
});
