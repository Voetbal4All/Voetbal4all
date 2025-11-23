(function () {
  const regioData = {
    vlaanderen: [
      "Antwerpen",
      "Limburg",
      "Oost-Vlaanderen",
      "West-Vlaanderen",
      "Vlaams-Brabant",
    ],
    nederland: [
      "Groningen",
      "Friesland",
      "Drenthe",
      "Overijssel",
      "Flevoland",
      "Gelderland",
      "Utrecht",
      "Noord-Holland",
      "Zuid-Holland",
      "Zeeland",
      "Noord-Brabant",
      "Limburg",
    ],
  };

  function fillRegioSelect(select, land, allLabel) {
    if (!select) return;
    select.innerHTML = "";
    const base = document.createElement("option");
    base.value = "";
    base.textContent = allLabel || "Alle regio's";
    select.appendChild(base);
    if (!land || !regioData[land]) return;
    regioData[land].forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.toLowerCase().replace(/\s+/g, "-");
      opt.textContent = r;
      select.appendChild(opt);
    });
  }

  function bindLandRegio(landId, regioId, allLabel) {
    const landEl = document.getElementById(landId);
    const regioEl = document.getElementById(regioId);
    if (!landEl || !regioEl) return;

    landEl.addEventListener("change", () => {
      let val = landEl.value;
      if (val === "beide") val = "";
      fillRegioSelect(regioEl, val, allLabel);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Zoekfilters
    bindLandRegio("vac-zoek-land", "vac-zoek-regio", "Alle regio's");
    bindLandRegio("tr-zoek-land", "tr-zoek-regio", "Alle regio's");
    bindLandRegio("sp-zoek-land", "sp-zoek-regio", "Alle regio's");
    bindLandRegio("ev-zoek-land", "ev-zoek-regio", "Alle regio's");

    // Invulformulieren
    bindLandRegio("vac-land", "vac-regio", "Kies een regio");
    bindLandRegio("tr-land", "tr-regio", "Kies een regio");
    bindLandRegio("sp-land", "sp-regio", "Kies een regio");
    bindLandRegio("ev-land", "ev-regio", "Kies een regio");
  });
})();
