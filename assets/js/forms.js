
(function() {
  const regioData = {
    vlaanderen: [
      'Antwerpen',
      'Limburg',
      'Oost-Vlaanderen',
      'West-Vlaanderen',
      'Vlaams-Brabant'
    ],
    nederland: [
      'Groningen',
      'Friesland',
      'Drenthe',
      'Overijssel',
      'Flevoland',
      'Gelderland',
      'Utrecht',
      'Noord-Holland',
      'Zuid-Holland',
      'Zeeland',
      'Noord-Brabant',
      'Limburg'
    ]
  };

  function fillRegioSelect(select, land) {
    if (!select) return;
    select.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = '';
    optAll.textContent = land ? 'Alle regio\'s' : 'Alle regio\'s';
    if (!land) {
      select.appendChild(optAll);
      return;
    }
    const regioList = regioData[land] || [];
    if (!regioList.length) {
      select.appendChild(optAll);
      return;
    }
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Alle regio\'s';
    select.appendChild(placeholder);
    regioList.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.toLowerCase().replace(/\s+/g, '-');
      opt.textContent = r;
      select.appendChild(opt);
    });
  }

  function bindLandRegio(landId, regioId) {
    const landEl = document.getElementById(landId);
    const regioEl = document.getElementById(regioId);
    if (!landEl || !regioEl) return;
    landEl.addEventListener('change', () => {
      const val = landEl.value === 'beide' ? '' : landEl.value;
      fillRegioSelect(regioEl, val);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Zoekfilters
    bindLandRegio('vac-zoek-land', 'vac-zoek-regio');
    bindLandRegio('tr-zoek-land', 'tr-zoek-regio');
    bindLandRegio('sp-zoek-land', 'sp-zoek-regio');
    bindLandRegio('ev-zoek-land', 'ev-zoek-regio');
    bindLandRegio('res-land', 'res-regio'); // res-regio bestaat nog niet, maar kan later toegevoegd worden

    // Invulformulieren
    bindLandRegio('vac-land', 'vac-regio');
    bindLandRegio('tr-land', 'tr-regio');
    bindLandRegio('sp-land', 'sp-regio');
    bindLandRegio('ev-land', 'ev-regio');
  });
})();
