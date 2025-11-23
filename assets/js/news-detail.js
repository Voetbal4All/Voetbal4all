document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get("id");

  const detailContainer = document.getElementById("news-detail");
  const listContainer = document.getElementById("news-list");
  const filterCompetition = document.getElementById("newsFilterCompetition");
  const filterSearch = document.getElementById("newsFilterSearch");

  let allNews = [];

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
          ${item.competition || ""}${item.date ? " • " + item.date : ""}
        </p>
        <p class="news-teaser">${item.teaser || ""}</p>
      </article>
    `;
  }

  function renderDetail(item) {
    if (!detailContainer) return;

    if (!item) {
      detailContainer.innerHTML = `
        <article class="news-card">
          <p>Kies een voetbalkop op de homepage of in de lijst hieronder om het volledige artikel te lezen.</p>
        </article>
      `;
      return;
    }

    detailContainer.innerHTML = `
      <article class="news-card">
        ${item.image ? `
        <div class="news-image-wrap">
          <img src="assets/img/news/${item.image}" alt="${item.title}">
        </div>` : ""}
        <h1>${item.title}</h1>
        <p class="news-meta">
          ${item.competition || ""}${item.date ? " • " + item.date : ""}
        </p>
        <p class="news-full">${item.content || ""}</p>
      </article>
    `;
  }

  function applyFilters() {
    if (!listContainer) return;
    let filtered = [...allNews];

    const comp = filterCompetition ? filterCompetition.value.trim() : "";
    const search = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

    if (comp) {
      filtered = filtered.filter(n => (n.competition || "") === comp);
    }

    if (search) {
      filtered = filtered.filter(n => {
        const fields = [
          n.title || "",
          n.teaser || "",
          n.content || "",
          n.competition || ""
        ].join(" ").toLowerCase();
        return fields.includes(search);
      });
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `<p>Geen nieuwsberichten gevonden met deze filters.</p>`;
      return;
    }

    listContainer.innerHTML = filtered
      .map(renderNewsCard)
      .join("");
  }

  // Data ophalen
  fetch("data/news.json")
    .then(r => r.json())
    .then(items => {
      allNews = Array.isArray(items) ? items : [];

      // Detail (indien id in URL)
      if (idFromUrl) {
        const item = allNews.find(n => String(n.id) === String(idFromUrl));
        renderDetail(item);
      } else {
        renderDetail(null);
      }

      // Lijst renderen met standaardfilter
      applyFilters();

      // Event listeners op filters
      if (filterCompetition) {
        filterCompetition.addEventListener("change", applyFilters);
      }
      if (filterSearch) {
        filterSearch.addEventListener("input", applyFilters);
      }
    })
    .catch(err => {
      console.error("Kon news.json niet laden:", err);
      if (detailContainer) {
        detailContainer.innerHTML = `<p>Er ging iets mis bij het laden van de nieuwsartikelen.</p>`;
      }
    });
});
