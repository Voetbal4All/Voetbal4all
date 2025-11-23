
(async function() {
  async function loadNews() {
    try {
      const resp = await fetch('data/news.json', { cache: 'no-store' });
      if (!resp.ok) {
        console.warn('Kon data/news.json niet laden:', resp.status);
        return [];
      }
      const data = await resp.json();
      if (!Array.isArray(data)) {
        console.warn('news.json is geen array');
        return [];
      }
      return data;
    } catch (e) {
      console.error('Fout bij laden nieuws:', e);
      return [];
    }
  }

  function createNewsCard(item) {
    const card = document.createElement('article');
    card.className = 'news-card';

    const h3 = document.createElement('h3');
    h3.textContent = item.title || 'Nieuwsartikel';
    card.appendChild(h3);

    const meta = document.createElement('p');
    meta.className = 'news-meta';
    const comp = item.competitionLabel || 'Voetbal';
    const gender = item.gender ? (item.gender === 'dames' ? 'Dames' : 'Heren') : '';
    meta.textContent = [comp, gender].filter(Boolean).join(' · ');
    card.appendChild(meta);

    if (item.teaser) {
      const teaser = document.createElement('p');
      teaser.className = 'news-teaser';
      teaser.textContent = item.teaser;
      card.appendChild(teaser);
    }

    return card;
  }

  const news = await loadNews();
  if (!news.length) return;

  const homeTop = document.getElementById('home-news-top');
  const homeBottom = document.getElementById('home-news-bottom');
  const nieuwsLijst = document.getElementById('nieuws-lijst');

  if (homeTop) {
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'news-section-header';
    sectionHeader.innerHTML = `
      <h2>Voetbalkoppen</h2>
      <p class="section-intro">Korte voetbalnieuwsberichten uit Jupiler Pro League, Eredivisie, nationale en internationale competities.</p>
    `;
    homeTop.appendChild(sectionHeader);

    const first = news.slice(0, 4);
    first.forEach(item => {
      homeTop.appendChild(createNewsCard(item));
    });
  }

  if (homeBottom) {
    const rest = news.slice(4, 10);
    if (rest.length) {
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'news-section-header';
      sectionHeader.innerHTML = `
        <h2>Meer voetbalkoppen</h2>
        <p class="section-intro">Uitgebreidere nieuwskoppen, breder weergegeven voor extra zichtbaarheid.</p>
      `;
      homeBottom.appendChild(sectionHeader);

      rest.forEach(item => {
        homeBottom.appendChild(createNewsCard(item));
      });
    }
  }

  if (nieuwsLijst) {
    news.forEach(item => {
      nieuwsLijst.appendChild(createNewsCard(item));
    });
  }
})();
