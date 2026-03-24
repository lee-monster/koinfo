// Server-side OG tag injection for link preview (KakaoTalk, Facebook, Twitter, etc.)
// Crawlers don't execute JS, so OG tags must be in the raw HTML.
var fs = require('fs');
var path = require('path');

var PAGES = ['index', 'study', 'work', 'visa', 'life', 'news', 'community'];

var SITES_OG = {
  indo: {
    name: 'IndoKo',
    locale: 'id_ID',
    domain: 'indo.koinfo.kr',
    image: 'https://indo.koinfo.kr/images/og-indo.png',
    pages: {
      index:     { title: 'IndoKo - Informasi Lengkap untuk WNI di Korea', desc: 'IndoKo menyediakan informasi lengkap tentang kerja, pendidikan, visa, dan kehidupan di Korea Selatan untuk warga negara Indonesia.' },
      study:     { title: 'Pendidikan & Studi di Korea - IndoKo', desc: 'Informasi beasiswa, universitas, kursus bahasa Korea, dan program studi untuk WNI. GKS, TOPIK, dan program pertukaran pelajar.' },
      work:      { title: 'Bekerja di Korea - IndoKo', desc: 'Panduan kerja di Korea untuk WNI: EPS, visa kerja, hak pekerja, gaji minimum, dan tips mencari pekerjaan.' },
      visa:      { title: 'Visa & Hukum Korea - IndoKo', desc: 'Informasi visa Korea untuk WNI: jenis visa, perpanjangan, perubahan status, hukum imigrasi, dan konsultasi hukum.' },
      life:      { title: 'Kehidupan di Korea - IndoKo', desc: 'Panduan kehidupan sehari-hari di Korea: perumahan, transportasi, kesehatan, makanan halal, dan komunitas Indonesia.' },
      news:      { title: 'Berita Terbaru - IndoKo', desc: 'Berita terbaru tentang kebijakan imigrasi, perubahan visa, jadwal ujian, dan informasi penting untuk WNI di Korea.' },
      community: { title: 'Komunitas WNI di Korea - IndoKo', desc: 'Forum komunitas untuk warga negara Indonesia di Korea Selatan. Berbagi informasi, pertanyaan, dan pengalaman.' },
    }
  },
  mong: {
    name: 'MongKo',
    locale: 'mn_MN',
    domain: 'mong.koinfo.kr',
    image: 'https://mong.koinfo.kr/images/og-mong.png',
    pages: {
      index:     { title: 'МонгКо - Солонгост амьдрах бүрэн мэдээлэл', desc: 'МонгКо нь Солонгост амьдарч буй монголчуудад зориулсан ажил, боловсрол, виз, амьдралын мэдээллийн платформ.' },
      study:     { title: 'Боловсрол·Суралцах - МонгКо', desc: 'Солонгосын их сургууль, тэтгэлэг, TOPIK шалгалт, хэлний курс болон оюутан солилцооны хөтөлбөрийн мэдээлэл.' },
      work:      { title: 'Ажил эрхлэх - МонгКо', desc: 'Солонгост ажил хийх гарын авлага: EPS, ажлын виз, ажилчны эрх, хөдөлмөрийн хөлсний доод хэмжээ.' },
      visa:      { title: 'Виз·Хууль - МонгКо', desc: 'Солонгосын визний мэдээлэл: визний төрөл, сунгалт, оршин суух зөвшөөрөл, цагаачлалын хууль.' },
      life:      { title: 'Амьдрал - МонгКо', desc: 'Солонгос дахь амьдралын гарын авлага: орон сууц, тээвэр, эрүүл мэнд, монгол хоол, монголын коммунити.' },
      news:      { title: 'Мэдээ мэдээлэл - МонгКо', desc: 'Солонгос дахь монголчуудад зориулсан сүүлийн мэдээ: бодлогын өөрчлөлт, визний мэдээ, шалгалтын хуваарь.' },
      community: { title: 'Коммунити - МонгКо', desc: 'Солонгос дахь монголчуудын коммунити. Мэдээлэл хуваалцах, асуулт тавих, туршлагаа хуваалцах.' },
    }
  },
  viet: {
    name: 'VietKo',
    locale: 'vi_VN',
    domain: 'viet.koinfo.kr',
    image: 'https://koinfo.kr/images/og-koinfo.png',
    pages: {
      index:     { title: 'VietKo - Thông tin toàn diện cho người Việt tại Hàn Quốc', desc: 'VietKo cung cấp thông tin đầy đủ về việc làm, giáo dục, visa và đời sống tại Hàn Quốc dành cho người Việt Nam.' },
      study:     { title: 'Giáo dục & Du học tại Hàn Quốc - VietKo', desc: 'Thông tin học bổng, đại học, khóa học tiếng Hàn và chương trình du học cho người Việt. GKS, TOPIK.' },
      work:      { title: 'Việc làm tại Hàn Quốc - VietKo', desc: 'Hướng dẫn làm việc tại Hàn Quốc: EPS, visa lao động, quyền lợi người lao động, lương tối thiểu.' },
      visa:      { title: 'Visa & Pháp luật Hàn Quốc - VietKo', desc: 'Thông tin visa Hàn Quốc: các loại visa, gia hạn, thay đổi tư cách lưu trú, luật nhập cư.' },
      life:      { title: 'Đời sống tại Hàn Quốc - VietKo', desc: 'Hướng dẫn cuộc sống ở Hàn Quốc: nhà ở, giao thông, y tế, ẩm thực Việt, cộng đồng người Việt.' },
      news:      { title: 'Tin tức mới nhất - VietKo', desc: 'Tin tức mới nhất cho người Việt tại Hàn Quốc: thay đổi chính sách, thông tin visa, lịch thi.' },
      community: { title: 'Cộng đồng người Việt tại Hàn Quốc - VietKo', desc: 'Diễn đàn cộng đồng người Việt Nam tại Hàn Quốc. Chia sẻ thông tin, hỏi đáp và kinh nghiệm.' },
    }
  },
  malay: {
    name: 'MalayKo',
    locale: 'ms_MY',
    domain: 'malay.koinfo.kr',
    image: 'https://malay.koinfo.kr/images/og-malay.png',
    pages: {
      index:     { title: 'MalayKo - Maklumat Lengkap untuk Rakyat Malaysia di Korea', desc: 'MalayKo menyediakan maklumat lengkap tentang pekerjaan, pendidikan, visa dan kehidupan di Korea Selatan untuk warganegara Malaysia.' },
      study:     { title: 'Pendidikan & Pengajian di Korea - MalayKo', desc: 'Maklumat biasiswa, universiti, kursus bahasa Korea dan program pengajian untuk rakyat Malaysia. GKS, TOPIK.' },
      work:      { title: 'Bekerja di Korea - MalayKo', desc: 'Panduan bekerja di Korea untuk rakyat Malaysia: EPS, visa kerja, hak pekerja, gaji minimum dan tip mencari pekerjaan.' },
      visa:      { title: 'Visa & Undang-undang Korea - MalayKo', desc: 'Maklumat visa Korea untuk rakyat Malaysia: jenis visa, pembaharuan, pertukaran status, undang-undang imigresen.' },
      life:      { title: 'Kehidupan di Korea - MalayKo', desc: 'Panduan kehidupan harian di Korea: perumahan, pengangkutan, kesihatan, makanan halal dan komuniti Malaysia.' },
      news:      { title: 'Berita Terkini - MalayKo', desc: 'Berita terkini untuk rakyat Malaysia di Korea: perubahan dasar, maklumat visa, jadual peperiksaan.' },
      community: { title: 'Komuniti Rakyat Malaysia di Korea - MalayKo', desc: 'Forum komuniti untuk warganegara Malaysia di Korea Selatan. Berkongsi maklumat, soal jawab dan pengalaman.' },
    }
  }
};

function detectSite(host) {
  if (!host) return null;
  var keys = Object.keys(SITES_OG);
  for (var i = 0; i < keys.length; i++) {
    if (host.indexOf(keys[i] + '.') === 0) return keys[i];
  }
  return null;
}

module.exports = function handler(req, res) {
  var page = req.query.page || 'index';
  var host = req.headers.host || '';

  // Validate page
  if (PAGES.indexOf(page) === -1) {
    res.status(404).send('Not found');
    return;
  }

  var siteKey = detectSite(host);

  // If no subdomain (koinfo.kr), serve landing.html as-is
  if (!siteKey) {
    var landingPath = path.join(__dirname, '..', 'landing.html');
    try {
      var landingHtml = fs.readFileSync(landingPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
      res.send(landingHtml);
    } catch (e) {
      res.status(404).send('Page not found');
    }
    return;
  }

  var site = SITES_OG[siteKey];
  var pageOG = site.pages[page] || site.pages.index;

  // Read the HTML file
  var filename = page === 'index' ? 'index.html' : page + '.html';
  var filePath = path.join(__dirname, '..', filename);
  var html;
  try {
    html = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    res.status(404).send('Page not found');
    return;
  }

  var ogUrl = 'https://' + site.domain + '/' + (page === 'index' ? '' : page + '.html');

  // Inject OG tags into empty placeholders
  html = html
    .replace(/<title>[^<]*<\/title>/, '<title>' + pageOG.title + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + pageOG.desc + '">')
    .replace(/<meta property="og:title" content="">/, '<meta property="og:title" content="' + pageOG.title + '">')
    .replace(/<meta property="og:description" content="">/, '<meta property="og:description" content="' + pageOG.desc + '">')
    .replace(/<meta property="og:image" content="">/, '<meta property="og:image" content="' + site.image + '">')
    .replace(/<meta property="og:url" content="">/, '<meta property="og:url" content="' + ogUrl + '">')
    .replace(/<meta property="og:locale" content="">/, '<meta property="og:locale" content="' + site.locale + '">')
    .replace(/<meta name="twitter:title" content="">/, '<meta name="twitter:title" content="' + pageOG.title + '">')
    .replace(/<meta name="twitter:description" content="">/, '<meta name="twitter:description" content="' + pageOG.desc + '">')
    .replace(/<meta name="twitter:image" content="">/, '<meta name="twitter:image" content="' + site.image + '">')
    .replace(/<link rel="canonical" href="">/, '<link rel="canonical" href="' + ogUrl + '">');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.send(html);
};
