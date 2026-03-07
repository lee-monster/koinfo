// News module - fetches and renders news from Notion via API
// Uses SITE from site-config.js and currentLang from main.js
(function () {
  const API_BASE = '/api/news';

  const categoryColors = {
    '정책변경': { bg: '#FEF2F2', color: '#DC2626' },
    '시험일정': { bg: '#E8F8E8', color: '#22C55E' },
    '커뮤니티': { bg: '#F3E8FD', color: '#8B5CF6' },
    '긴급공지': { bg: '#FDE8E8', color: '#EF4444' },
  };

  function getCategoryLabel(category) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : SITE.lang;
    const t = typeof translations !== 'undefined' ? translations[lang] : null;
    if (t) {
      const map = {
        '정책변경': 'news.filterPolicy',
        '시험일정': 'news.filterExam',
        '커뮤니티': 'news.filterCommunity',
        '긴급공지': 'news.filterUrgent',
      };
      if (map[category] && t[map[category]]) return t[map[category]];
    }
    return category;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const lang = typeof currentLang !== 'undefined' ? currentLang : SITE.lang;
    if (lang === 'ko') {
      return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
    }
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  }

  function getField(item, field) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : SITE.lang;
    return lang === 'ko' ? item[field + 'Ko'] : item[field + 'Native'];
  }

  function sourceHtml(item) {
    if (!item.source) return '';
    var lang = typeof currentLang !== 'undefined' ? currentLang : SITE.lang;
    var t = typeof translations !== 'undefined' ? translations[lang] : null;
    var label = (t && t['news.sourceLabel']) || (lang === 'ko' ? '출처' : 'Source');
    if (item.sourceUrl) {
      return '<div class="news-source"><span>' + label + ':</span> <a href="' + item.sourceUrl + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + item.source + '</a></div>';
    }
    return '<div class="news-source"><span>' + label + ':</span> ' + item.source + '</div>';
  }

  function createNewsCard(item) {
    const cat = categoryColors[item.category] || { bg: '#F3F4F6', color: '#4B5563' };
    const isUrgent = item.importance === '긴급';

    const card = document.createElement('div');
    card.className = 'news-card' + (isUrgent ? ' news-urgent' : '');

    card.innerHTML =
      '<div class="news-card-header">' +
        '<span class="news-category-tag" style="background:' + cat.bg + ';color:' + cat.color + '">' +
          getCategoryLabel(item.category) +
        '</span>' +
        '<span class="news-date">' + formatDate(item.date) + '</span>' +
      '</div>' +
      '<h3 class="news-card-title">' +
        '<span>' + getField(item, 'title') + '</span>' +
        '<span class="news-card-arrow">&#9662;</span>' +
      '</h3>' +
      '<div class="news-card-content">' + getField(item, 'content') + sourceHtml(item) + '</div>';

    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      card.classList.toggle('news-card-open');
    });

    return card;
  }

  function createUrgentBanner(item) {
    const banner = document.createElement('div');
    banner.className = 'news-urgent-banner';
    banner.innerHTML =
      '<span class="news-urgent-icon">!</span>' +
      '<div class="news-urgent-text">' +
        '<strong>' + getField(item, 'title') + '</strong>' +
        '<div class="news-banner-detail">' + getField(item, 'content') + sourceHtml(item) + '</div>' +
      '</div>';
    banner.style.cursor = 'pointer';
    banner.addEventListener('click', function () {
      banner.classList.toggle('news-banner-open');
    });
    return banner;
  }

  function createRelatedNewsBanner(item) {
    const cat = categoryColors[item.category] || { bg: '#F3F4F6', color: '#4B5563' };
    const banner = document.createElement('div');
    banner.className = 'news-related-banner' + (item.importance === '긴급' ? ' news-related-urgent' : '');
    banner.innerHTML =
      '<div class="news-related-content">' +
        '<span class="news-category-tag" style="background:' + cat.bg + ';color:' + cat.color + '">' +
          getCategoryLabel(item.category) +
        '</span>' +
        '<span class="news-related-title">' + getField(item, 'title') + '</span>' +
        '<span class="news-date">' + formatDate(item.date) + '</span>' +
      '</div>' +
      '<div class="news-banner-detail">' + getField(item, 'content') + sourceHtml(item) + '</div>';
    banner.style.cursor = 'pointer';
    banner.addEventListener('click', function () {
      banner.classList.toggle('news-banner-open');
    });
    return banner;
  }

  async function fetchNews(params) {
    params.site = SITE_KEY;
    const query = new URLSearchParams(params).toString();
    const url = API_BASE + (query ? '?' + query : '');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.error('Failed to fetch news:', e);
      return { items: [], hasMore: false, total: 0 };
    }
  }

  async function renderHomeNews() {
    const container = document.getElementById('home-news-list');
    if (!container) return;

    const data = await fetchNews({ limit: 5 });
    if (!data.items.length) {
      container.closest('.news-section').style.display = 'none';
      return;
    }

    container.innerHTML = '';
    const urgentItems = data.items.filter(function (i) { return i.importance === '긴급'; });
    const normalItems = data.items.filter(function (i) { return i.importance !== '긴급'; });

    urgentItems.forEach(function (item) {
      container.appendChild(createUrgentBanner(item));
    });

    var displayed = normalItems.slice(0, 5 - urgentItems.length);
    displayed.forEach(function (item) {
      container.appendChild(createNewsCard(item));
    });
  }

  async function renderRelatedNews(pageName) {
    var container = document.getElementById('related-news');
    if (!container) return;

    var data = await fetchNews({ page: pageName, limit: 2 });
    if (!data.items.length) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = '';
    data.items.forEach(function (item) {
      container.appendChild(createRelatedNewsBanner(item));
    });
  }

  async function renderFullNews() {
    var container = document.getElementById('full-news-list');
    if (!container) return;

    var activeFilter = '';
    var filterBtns = document.querySelectorAll('.news-filter-btn');

    async function loadNews(category) {
      var params = { limit: 20 };
      if (category) params.category = category;
      var data = await fetchNews(params);

      container.innerHTML = '';
      if (!data.items.length) {
        var lang = typeof currentLang !== 'undefined' ? currentLang : SITE.lang;
        container.innerHTML = '<p class="news-empty">' +
          (lang === 'ko' ? SITE.emptyNews.ko : SITE.emptyNews.native) + '</p>';
        return;
      }
      data.items.forEach(function (item) {
        container.appendChild(createNewsCard(item));
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-category') || '';
        loadNews(activeFilter);
      });
    });

    loadNews('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('home-news-list')) renderHomeNews();
    if (document.getElementById('full-news-list')) renderFullNews();
    var relatedEl = document.getElementById('related-news');
    if (relatedEl) {
      var pageName = relatedEl.getAttribute('data-page');
      if (pageName) renderRelatedNews(pageName);
    }
  });

  // Re-render on language change
  var origSetLang = typeof setLanguage !== 'undefined' ? setLanguage : null;
  if (origSetLang) {
    window.setLanguage = function (lang) {
      origSetLang(lang);
      if (document.getElementById('home-news-list')) renderHomeNews();
      if (document.getElementById('full-news-list')) renderFullNews();
      var relatedEl = document.getElementById('related-news');
      if (relatedEl) {
        var pageName = relatedEl.getAttribute('data-page');
        if (pageName) renderRelatedNews(pageName);
      }
    };
  }
})();
