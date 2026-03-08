// KoInfo - Multi-site configuration
// Detects site from subdomain and applies theme/config

const SITES = {
  indo: {
    id: 'indo',
    name: 'IndoKo',
    nameKo: '인도코',
    lang: 'id',
    langLabel: 'Bahasa',
    flags: '🇮🇩🇰🇷',
    flagsSpaced: '🇮🇩 🇰🇷',
    faviconLetter: 'I',
    htmlLang: 'id',
    ogLocale: 'id_ID',
    domain: 'indo.koinfo.kr',
    adminPassword: 'indoko2026',
    storagePrefix: 'indoko',
    notionDbEnv: 'NOTION_DB_INDO',
    notionTokenEnv: 'NOTION_TOKEN_INDO',
    colors: {
      primary: '#DC2626',
      primaryDark: '#991B1B',
      primaryLight: '#F87171',
      primaryBg: '#FEF2F2',
      accent: '#1D4ED8',
      accentLight: '#DBEAFE',
    },
    heroSlides: 5,
    heroExtensions: ['jpg', 'jpg', 'png', 'jpg', 'jpg'],
    stats: [
      { count: 49000, i18nLabel: 'stats.residentsLabel', i18nSource: 'stats.residentsSource', rank: false },
      { count: 7500, i18nLabel: 'stats.studentsLabel', i18nSource: 'stats.studentsSource', rank: false },
      { count: 130000, i18nLabel: 'stats.epsLabel', i18nSource: 'stats.epsSource', rank: false },
      { count: 6, i18nLabel: 'stats.rankLabel', i18nSource: 'stats.rankSource', rank: true },
    ],
    suffixRank: { native: ' besar', ko: '위' },
    suffixCount: { native: ' orang', ko: '명' },
    emptyNews: { native: 'Belum ada berita.', ko: '소식이 없습니다.' },
    footerOffices: [
      { i18nName: 'footer.office.korea', i18nAddr: 'footer.office.korea.addr' },
      { i18nName: 'footer.office.origin', i18nAddr: 'footer.office.origin.addr' },
    ],
  },
  mong: {
    id: 'mong',
    name: 'MongKo',
    nameKo: '몽코',
    lang: 'mn',
    langLabel: 'Монгол',
    flags: '🇲🇳🇰🇷',
    flagsSpaced: '🇲🇳 🇰🇷',
    faviconLetter: 'M',
    htmlLang: 'mn',
    ogLocale: 'mn_MN',
    domain: 'mong.koinfo.kr',
    adminPassword: 'mongko2026',
    storagePrefix: 'mongko',
    notionDbEnv: 'NOTION_DB_MONG',
    notionTokenEnv: 'NOTION_TOKEN_MONG',
    colors: {
      primary: '#0066CC',
      primaryDark: '#004C99',
      primaryLight: '#4DA6FF',
      primaryBg: '#E8F4FD',
      accent: '#C4272F',
      accentLight: '#FDE8E8',
    },
    heroSlides: 4,
    heroExtensions: ['jpg', 'jpg', 'jpg', 'jpg'],
    stats: [
      { count: 57534, i18nLabel: 'stats.residentsLabel', i18nSource: 'stats.residentsSource', rank: false },
      { count: 15270, i18nLabel: 'stats.studentsLabel', i18nSource: 'stats.studentsSource', rank: false },
      { count: 130000, i18nLabel: 'stats.epsLabel', i18nSource: 'stats.epsSource', rank: false },
      { count: 4, i18nLabel: 'stats.rankLabel', i18nSource: 'stats.rankSource', rank: true },
    ],
    suffixRank: { native: '-р', ko: '위' },
    suffixCount: { native: ' хүн', ko: '명' },
    emptyNews: { native: 'Мэдээ байхгүй байна.', ko: '소식이 없습니다.' },
    footerOffices: [
      { i18nName: 'footer.office.korea', i18nAddr: 'footer.office.korea.addr' },
      { i18nName: 'footer.office.origin', i18nAddr: 'footer.office.origin.addr' },
    ],
  },
  travel: {
    id: 'travel',
    name: 'TravelKo',
    nameKo: '트래블코',
    lang: 'en',
    langLabel: 'English',
    flags: '✈️🇰🇷',
    flagsSpaced: '✈️ 🇰🇷',
    faviconLetter: 'T',
    htmlLang: 'en',
    ogLocale: 'en_US',
    domain: 'travel.koinfo.kr',
    adminPassword: 'travelko2026',
    storagePrefix: 'travelko',
    colors: {
      primary: '#059669',
      primaryDark: '#047857',
      primaryLight: '#34D399',
      primaryBg: '#ECFDF5',
      accent: '#F59E0B',
      accentLight: '#FFFBEB',
    },
    heroSlides: 0,
    heroExtensions: [],
    stats: [],
    suffixRank: { native: '', ko: '위' },
    suffixCount: { native: '', ko: '명' },
    emptyNews: { native: 'No news.', ko: '소식이 없습니다.' },
    footerOffices: [],
    isTravelSite: true,
    supportedLangs: ['en', 'ko', 'id', 'mn'],
    langLabels: { en: 'English', ko: '한국어', id: 'Bahasa', mn: 'Монгол' },
  },
  malay: {
    id: 'malay',
    name: 'MalayKo',
    nameKo: '말코',
    lang: 'ms',
    langLabel: 'Bahasa',
    flags: '🇲🇾🇰🇷',
    flagsSpaced: '🇲🇾 🇰🇷',
    faviconLetter: 'L',
    htmlLang: 'ms',
    ogLocale: 'ms_MY',
    domain: 'malay.koinfo.kr',
    adminPassword: 'malayko2026',
    storagePrefix: 'malayko',
    notionDbEnv: 'NOTION_DB_MALAY',
    notionTokenEnv: 'NOTION_TOKEN_MALAY',
    colors: {
      primary: '#00338D',
      primaryDark: '#002266',
      primaryLight: '#4D7AC7',
      primaryBg: '#E8EEF8',
      accent: '#FFD700',
      accentLight: '#FFF8DC',
    },
    heroSlides: 0,
    heroExtensions: [],
    stats: [
      { count: 12000, i18nLabel: 'stats.residentsLabel', i18nSource: 'stats.residentsSource', rank: false },
      { count: 3500, i18nLabel: 'stats.studentsLabel', i18nSource: 'stats.studentsSource', rank: false },
      { count: 130000, i18nLabel: 'stats.epsLabel', i18nSource: 'stats.epsSource', rank: false },
      { count: 15, i18nLabel: 'stats.rankLabel', i18nSource: 'stats.rankSource', rank: true },
    ],
    suffixRank: { native: ' besar', ko: '위' },
    suffixCount: { native: ' orang', ko: '명' },
    emptyNews: { native: 'Tiada berita.', ko: '소식이 없습니다.' },
    footerOffices: [
      { i18nName: 'footer.office.korea', i18nAddr: 'footer.office.korea.addr' },
      { i18nName: 'footer.office.origin', i18nAddr: 'footer.office.origin.addr' },
    ],
  },
};

// Detect site from hostname
function detectSite() {
  const host = window.location.hostname;
  for (const key of Object.keys(SITES)) {
    if (host.startsWith(key + '.') || host.includes(key + '.')) {
      return key;
    }
  }
  // Fallback: check URL parameter ?site=indo
  const params = new URLSearchParams(window.location.search);
  const siteParam = params.get('site');
  if (siteParam && SITES[siteParam]) return siteParam;
  // No subdomain and no param → landing page
  return 'main';
}

const SITE_KEY = detectSite();
const SITE = SITES[SITE_KEY];


// Apply CSS custom properties
(function applySiteTheme() {
  if (!SITE) return;
  const r = document.documentElement.style;
  r.setProperty('--primary', SITE.colors.primary);
  r.setProperty('--primary-dark', SITE.colors.primaryDark);
  r.setProperty('--primary-light', SITE.colors.primaryLight);
  r.setProperty('--primary-bg', SITE.colors.primaryBg);
  r.setProperty('--accent', SITE.colors.accent);
  r.setProperty('--accent-light', SITE.colors.accentLight);
})();

// Apply site-specific branding to HTML
function applySiteBranding() {
  // HTML lang
  document.documentElement.lang = SITE.htmlLang;

  // Favicon
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect width="32" height="32" rx="6" fill="' + SITE.colors.primary + '"/>' +
      '<text x="16" y="23" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="22" fill="#FFFFFF">' + SITE.faviconLetter + '</text>' +
      '</svg>'
    );
  }

  // Theme color
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = SITE.colors.primary;

  // Brand elements
  document.querySelectorAll('.nav-flag').forEach(el => { el.textContent = SITE.flags; });
  document.querySelectorAll('.brand-name').forEach(el => { el.textContent = SITE.name; });
  document.querySelectorAll('.footer-brand').forEach(el => { el.textContent = SITE.name + ' ' + SITE.nameKo; });
  document.querySelectorAll('.footer-flags').forEach(el => { el.textContent = SITE.flagsSpaced; });

  // Title
  const titleEl = document.querySelector('title');
  if (titleEl) {
    titleEl.textContent = titleEl.textContent.replace(/\{SITE\}/g, SITE.name);
  }

  // Hero slides
  const heroSlides = document.querySelectorAll('.hero-slide');
  heroSlides.forEach((slide, i) => {
    if (i < SITE.heroSlides) {
      var ext = SITE.heroExtensions[i] || 'jpg';
      slide.style.backgroundImage = "url('sites/" + SITE.id + "/images/hero_" + (i + 1) + "." + ext + "')";
    } else {
      slide.remove();
    }
  });

  // Hero dots
  const heroDots = document.querySelectorAll('.hero-dot');
  heroDots.forEach((dot, i) => {
    if (i >= SITE.heroSlides) dot.remove();
  });

  // Stats
  const statCards = document.querySelectorAll('.stat-card');
  SITE.stats.forEach((stat, i) => {
    if (statCards[i]) {
      const numEl = statCards[i].querySelector('.stat-number');
      if (numEl) {
        numEl.setAttribute('data-count', stat.count);
        if (stat.rank) numEl.classList.add('stat-rank');
      }
      const labelEl = statCards[i].querySelector('.stat-label');
      if (labelEl) labelEl.setAttribute('data-i18n', stat.i18nLabel);
      const sourceEl = statCards[i].querySelector('.stat-source');
      if (sourceEl) sourceEl.setAttribute('data-i18n', stat.i18nSource);
    }
  });
}

// SEO: Dynamic meta tag updates based on site + language + page
var SEO_PAGES = {
  index:     { titleKey: 'seo.index.title',     descKey: 'seo.index.desc' },
  study:     { titleKey: 'seo.study.title',     descKey: 'seo.study.desc' },
  work:      { titleKey: 'seo.work.title',      descKey: 'seo.work.desc' },
  visa:      { titleKey: 'seo.visa.title',      descKey: 'seo.visa.desc' },
  life:      { titleKey: 'seo.life.title',      descKey: 'seo.life.desc' },
  travel:    { titleKey: 'seo.travel.title',    descKey: 'seo.travel.desc' },
  news:      { titleKey: 'seo.news.title',      descKey: 'seo.news.desc' },
  community: { titleKey: 'seo.community.title', descKey: 'seo.community.desc' },
};

function applySiteSEO(lang) {
  if (!SITE) return;
  lang = lang || SITE.lang;

  var pageIdMeta = document.querySelector('meta[name="page-id"]');
  var pageId = pageIdMeta ? pageIdMeta.content : 'index';
  var seoPage = SEO_PAGES[pageId] || SEO_PAGES.index;

  var t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : null;
  var title = (t && t[seoPage.titleKey]) || (SITE.name + ' - KoInfo');
  var desc = (t && t[seoPage.descKey]) || '';
  var url = 'https://' + SITE.domain + '/' + (pageId === 'index' ? '' : pageId + '.html');
  var ogImage = 'https://' + SITE.domain + '/images/og-' + SITE.id + '.png';
  var locale = SITE.ogLocale || 'en_US';

  // Update document
  document.title = title;

  // Helper to set meta content
  function setMeta(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }
  function setLink(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute('href', value);
  }

  setMeta('meta[name="description"]', desc);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', desc);
  setMeta('meta[property="og:image"]', ogImage);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[property="og:locale"]', locale);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', desc);
  setMeta('meta[name="twitter:image"]', ogImage);
  setLink('link[rel="canonical"]', url);

  // Hreflang: link alternate language versions
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function(el) { el.remove(); });

  var HREFLANG_MAP = {
    indo: { lang: 'id', domain: 'indo.koinfo.kr' },
    mong: { lang: 'mn', domain: 'mong.koinfo.kr' },
  };
  var pagePath = pageId === 'index' ? '/' : '/' + pageId + '.html';

  Object.keys(HREFLANG_MAP).forEach(function(key) {
    var info = HREFLANG_MAP[key];
    var link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = info.lang;
    link.href = 'https://' + info.domain + pagePath;
    document.head.appendChild(link);

    // Korean alternate for each site
    var linkKo = document.createElement('link');
    linkKo.rel = 'alternate';
    linkKo.hreflang = info.lang + '-KR';
    linkKo.href = 'https://' + info.domain + pagePath;
    document.head.appendChild(linkKo);
  });

  // x-default
  var linkDefault = document.createElement('link');
  linkDefault.rel = 'alternate';
  linkDefault.hreflang = 'x-default';
  linkDefault.href = 'https://koinfo.kr' + pagePath;
  document.head.appendChild(linkDefault);
}
