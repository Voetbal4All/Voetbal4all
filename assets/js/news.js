(function() {
  function createNewsCard(item, options) {
    options = options || {};
    var article = document.createElement('article');
    article.className = 'news-card';

    if (!options.hideImage) {
      var imgBlock = document.createElement('div');
      imgBlock.className = 'news-image';
      imgBlock.style.height = options.imageHeight || '150px';
      imgBlock.style.borderRadius = '10px';
      imgBlock.style.background = '#d1d5db';
      imgBlock.style.marginBottom = '0.6rem';
      imgBlock.style.display = 'flex';
      imgBlock.style.alignItems = 'center';
      imgBlock.style.justifyContent = 'center';
      imgBlock.style.fontSize = '0.8rem';
      imgBlock.style.color = '#4b5563';
      imgBlock.textContent = 'AFBEELDING (AI – ' + (item.competitionLabel || '') + ')';
      article.appendChild(imgBlock);
    }

    var h3 = document.createElement('h3');
    h3.textContent = item.title || 'Voetbalkop';
    article.appendChild(h3);

    var meta = document.createElement('p');
    meta.className = 'news-meta';
    var comp = item.competitionLabel || '';
    var gender = item.gender === 'dames' ? 'Dames' : 'Heren';
    meta.textContent = (comp ? comp + ' • ' : '') + gender + ' • nieuws';
    article.appendChild(meta);

    var teaser = document.createElement('p');
    teaser.className = 'news-teaser';
    teaser.textContent = item.teaser || '';
    article.appendChild(teaser);

    return article;
  }

  function renderHomeNews(news) {
    var topContainer = document.getElementById('home-news-top');
    var bottomContainer = document.getElementById('home-news-bottom');
    if (!topContainer && !bottomContainer) return;

    var firstFour = news.slice(0, 4);
    var nextSix = news.slice(4, 10);

    if (topContainer) {
      topContainer.innerHTML = '';
      var header = document.createElement('div');
      header.className = 'news-section-header';
      var h2 = document.createElement('h2');
      h2.textContent = 'Voetbalkoppen';
      header.appendChild(h2);
      var p = document.createElement('p');
      p.className = 'section-intro';
      p.textContent = 'Automatisch nieuws uit verschillende competities in Vlaanderen en Nederland (voorbeelddata).';
      header.appendChild(p);
      topContainer.appendChild(header);

      firstFour.forEach(function(item) {
        topContainer.appendChild(createNewsCard(item, { imageHeight: '140px' }));
      });

      var more = document.createElement('p');
      more.style.marginTop = '0.75rem';
      var link = document.createElement('a');
      link.href = 'nieuws.html';
      link.className = 'btn-secondary';
      link.textContent = 'Meer nieuws bekijken';
      more.appendChild(link);
      topContainer.appendChild(more);
    }

    if (bottomContainer) {
      bottomContainer.innerHTML = '';
      nextSix.forEach(function(item) {
        bottomContainer.appendChild(createNewsCard(item, { imageHeight: '160px' }));
      });
    }
  }

  function renderNewsPage(news) {
    var listContainer = document.getElementById('nieuws-lijst');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (!news.length) {
      var empty = document.createElement('p');
      empty.textContent = 'Er zijn momenteel nog geen nieuwsartikels beschikbaar.';
      listContainer.appendChild(empty);
      return;
    }

    news.forEach(function(item) {
      listContainer.appendChild(createNewsCard(item));
    });
  }

  function loadNewsAndRender() {
    fetch('data/news.json', { cache: 'no-store' })
      .then(function(resp) { return resp.json(); })
      .then(function(data) {
        var news = Array.isArray(data) ? data : [];
        renderHomeNews(news);
        renderNewsPage(news);
      })
      .catch(function(err) {
        console.error('Kon news.json niet laden:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNewsAndRender);
  } else {
    loadNewsAndRender();
  }
})();
