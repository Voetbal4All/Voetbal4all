(function() {
  const regioVlaanderen = [
    "Antwerpen",
    "Limburg",
    "Oost-Vlaanderen",
    "Vlaams-Brabant",
    "West-Vlaanderen"
  ];

  const regioNederland = [
    "Drenthe",
    "Flevoland",
    "Friesland",
    "Gelderland",
    "Groningen",
    "Limburg (NL)",
    "Noord-Brabant",
    "Noord-Holland",
    "Overijssel",
    "Utrecht",
    "Zeeland",
    "Zuid-Holland"
  ];

  function vulRegioSelect(selectElement, regioLijst, includeAllOption, allLabel) {
    if (!selectElement) return;
    selectElement.innerHTML = "";
    if (includeAllOption) {
      const optAll = document.createElement("option");
      optAll.value = "";
      optAll.textContent = allLabel || "Alle regio's";
      selectElement.appendChild(optAll);
    } else {
      const optDefault = document.createElement("option");
      optDefault.value = "";
      optDefault.textContent = "Maak een keuze";
      selectElement.appendChild(optDefault);
    }
    regioLijst.forEach(function(regio) {
      const opt = document.createElement("option");
      opt.value = regio.toLowerCase().replace(/\s+/g, "-");
      opt.textContent = regio;
      selectElement.appendChild(opt);
    });
  }

  function setupLandRegioPair(landId, regioId, opts) {
    const land = document.getElementById(landId);
    const regio = document.getElementById(regioId);
    if (!land || !regio) return;
    const includeAll = opts && opts.includeAll;
    const allLabel = opts && opts.allLabel;

    function update() {
      if (!land.value) {
        regio.innerHTML = "";
        if (includeAll) {
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = allLabel || "Alle regio's";
          regio.appendChild(opt);
        } else {
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = "Maak een keuze";
          regio.appendChild(opt);
        }
        return;
      }
      if (land.value === "vlaanderen") {
        vulRegioSelect(regio, regioVlaanderen, includeAll, allLabel);
      } else if (land.value === "nederland") {
        vulRegioSelect(regio, regioNederland, includeAll, allLabel);
      } else if (land.value === "be-nl") {
        vulRegioSelect(regio, regioVlaanderen.concat(regioNederland), includeAll, allLabel);
      } else {
        regio.innerHTML = "";
      }
    }

    land.addEventListener("change", update);
    // initial fill
    update();
  }

  // Script wordt met defer geladen, dus DOM is al beschikbaar
  setupLandRegioPair("vac-search-land", "vac-search-regio", {includeAll:true, allLabel:"Alle regio's"});
  setupLandRegioPair("vac-land", "vac-regio", {includeAll:false});

  setupLandRegioPair("tr-search-land", "tr-search-regio", {includeAll:true, allLabel:"Alle regio's"});
  setupLandRegioPair("tr-land", "tr-regio", {includeAll:false});

  setupLandRegioPair("sp-search-land", "sp-search-regio", {includeAll:true, allLabel:"Alle regio's"});
  setupLandRegioPair("sp-landen", "sp-regio", {includeAll:false});

  setupLandRegioPair("ev-search-land", "ev-search-regio", {includeAll:true, allLabel:"Alle regio's"});
  setupLandRegioPair("ev-land", "ev-regio", {includeAll:false});
})();
