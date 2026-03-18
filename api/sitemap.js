// Dynamic sitemap generator based on hostname
module.exports = function handler(req, res) {
  const host = req.headers.host || 'koinfo.kr';
  const protocol = 'https';
  const baseUrl = protocol + '://' + host;
  const now = new Date().toISOString().split('T')[0];

  var urls = [];

  if (host === 'koinfo.kr' || host === 'www.koinfo.kr') {
    // Landing page
    urls = [
      { loc: baseUrl + '/', priority: '1.0', changefreq: 'weekly' },
    ];
  } else {
    // Country sites (indo, mong, etc.)
    var pages = ['', 'study.html', 'work.html', 'visa.html', 'life.html', 'news.html', 'community.html'];
    var priorities = ['1.0', '0.8', '0.8', '0.8', '0.8', '0.7', '0.6'];

    pages.forEach(function(page, i) {
      urls.push({
        loc: baseUrl + '/' + page,
        priority: priorities[i],
        changefreq: page === '' ? 'daily' : page === 'news.html' ? 'daily' : 'weekly',
      });
    });

    // Add hreflang alternates for country sites
    var alternates = [
      { hreflang: 'id', href: 'https://indo.koinfo.kr/' },
      { hreflang: 'mn', href: 'https://mong.koinfo.kr/' },
      { hreflang: 'vi', href: 'https://viet.koinfo.kr/' },
      { hreflang: 'x-default', href: 'https://koinfo.kr/' },
    ];

    urls = urls.map(function(u) {
      u.alternates = pages.map(function(page) {
        return alternates.map(function(alt) {
          return { hreflang: alt.hreflang, href: alt.href.replace(/\/$/, '') + '/' + page };
        });
      }).flat();
      return u;
    });
  }

  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  urls.forEach(function(u) {
    xml += '  <url>\n';
    xml += '    <loc>' + u.loc + '</loc>\n';
    xml += '    <lastmod>' + now + '</lastmod>\n';
    xml += '    <changefreq>' + u.changefreq + '</changefreq>\n';
    xml += '    <priority>' + u.priority + '</priority>\n';
    if (u.alternates) {
      u.alternates.forEach(function(alt) {
        xml += '    <xhtml:link rel="alternate" hreflang="' + alt.hreflang + '" href="' + alt.href + '"/>\n';
      });
    }
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
};
