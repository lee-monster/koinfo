const { Client } = require('@notionhq/client');

// Bulk import: Seongsu-dong spots popular with foreign tourists
// DELETE THIS FILE AFTER USE

const SPOTS = [
  // === SEONGSU - Cafes ===
  {
    name: 'Daelim Changgo', name_ko: '대림창고', name_id: 'Daelim Changgo', name_mn: 'Дэлим Чанго',
    desc: 'One of the original Seongsu cafes, converted from a 1970s rice warehouse. Features industrial decor, art exhibitions, and a spacious courtyard. A pioneer of Seongsu cafe culture.',
    desc_ko: '1970년대 쌀 창고를 개조한 성수동 원조 카페. 인더스트리얼 인테리어, 전시, 넓은 마당이 매력적.',
    desc_id: 'Salah satu kafe asli Seongsu, bekas gudang beras tahun 1970-an. Dekorasi industrial, pameran seni, dan halaman yang luas.',
    desc_mn: '1970-аад оны будааны агуулахыг кафе болгон өөрчилсөн Сонсүгийн анхны кафе. Урлагийн үзэсгэлэн, өргөн хашаатай.',
    category: 'cafe', region: 'Seoul', lat: 37.5441, lng: 127.0555,
    address: '78 Seongsuil-ro 4-gil, Seongdong-gu, Seoul', rating: 4.3, featured: false,
    tags: ['cafe', 'warehouse', 'art', 'Seongsu']
  },
  {
    name: 'Zagmachi', name_ko: '자그마치', name_id: 'Zagmachi', name_mn: 'Загмачи',
    desc: 'Creative space combining cafe, workshop, and event venue in a renovated warehouse. Known for specialty coffee and community events. A Seongsu cultural landmark.',
    desc_ko: '카페, 워크숍, 이벤트를 결합한 복합문화공간. 스페셜티 커피와 커뮤니티 이벤트로 유명한 성수 문화 랜드마크.',
    desc_id: 'Ruang kreatif yang menggabungkan kafe, workshop, dan tempat acara di gudang renovasi. Terkenal dengan kopi spesialti.',
    desc_mn: 'Кафе, семинар, арга хэмжээний газрыг нэгтгэсэн бүтээлч орон зай. Тусгай кофе, олон нийтийн арга хэмжээгээр алдартай.',
    category: 'cafe', region: 'Seoul', lat: 37.5443, lng: 127.0548,
    address: '12-2 Seongsuil-ro 4-gil, Seongdong-gu, Seoul', rating: 4.2, featured: false,
    tags: ['cafe', 'creative-space', 'workshop', 'Seongsu']
  },
  {
    name: 'Center Coffee Seongsu', name_ko: '센터커피 성수', name_id: 'Center Coffee Seongsu', name_mn: 'Сентер Кофе Сонсу',
    desc: 'Specialty coffee roaster with industrial-style interior. Famous for single-origin pour-over and seasonal drinks. A must-visit for coffee lovers in Seongsu.',
    desc_ko: '인더스트리얼 스타일의 스페셜티 커피 로스터리. 싱글 오리진 핸드드립과 시즌 메뉴가 인기. 커피 매니아 필수 방문지.',
    desc_id: 'Pemanggang kopi spesialti dengan interior bergaya industrial. Terkenal dengan pour-over single-origin.',
    desc_mn: 'Аж үйлдвэрийн загварын тусгай кофены шарагч. Нэг гарал үүслийн кофе, улирлын ундаагаар алдартай.',
    category: 'cafe', region: 'Seoul', lat: 37.5435, lng: 127.0558,
    address: '35 Seongsuil-ro 4-gil, Seongdong-gu, Seoul', rating: 4.4, featured: false,
    tags: ['cafe', 'specialty-coffee', 'roastery', 'Seongsu']
  },
  {
    name: 'Nudake Seongsu', name_ko: '누데이크 성수', name_id: 'Nudake Seongsu', name_mn: 'Нүдэйк Сонсу',
    desc: 'Dessert brand by Gentle Monster known for sculptural art cakes. The "Nude Cake" is the signature item. Futuristic gallery-like space with rotating installations.',
    desc_ko: '젠틀몬스터의 디저트 브랜드. 조각 같은 아트 케이크가 시그니처. 미래적 갤러리 분위기의 공간.',
    desc_id: 'Merek dessert oleh Gentle Monster terkenal dengan kue seni skultural. Ruang galeri futuristik dengan instalasi berputar.',
    desc_mn: 'Gentle Monster-ийн дессертийн брэнд. Урлагийн бялуу онцлог. Ирээдүйн галерей маягийн орон зай.',
    category: 'cafe', region: 'Seoul', lat: 37.5451, lng: 127.0561,
    address: '51 Achasan-ro 11-gil, Seongdong-gu, Seoul', rating: 4.3, featured: true,
    tags: ['cafe', 'dessert', 'Gentle-Monster', 'art', 'Seongsu']
  },
  {
    name: 'Mellower Coffee Seongsu', name_ko: '멜로워커피 성수', name_id: 'Mellower Coffee Seongsu', name_mn: 'Мелловер Кофе Сонсу',
    desc: 'Shanghai-born specialty coffee brand. Beautifully designed minimalist space with high-quality espresso and signature latte art.',
    desc_ko: '상하이에서 온 스페셜티 커피 브랜드. 미니멀한 디자인 공간에서 즐기는 고퀄리티 에스프레소와 라떼 아트.',
    desc_id: 'Merek kopi spesialti asal Shanghai. Ruang minimalis berdesain indah dengan espresso berkualitas tinggi.',
    desc_mn: 'Шанхайгаас ирсэн тусгай кофены брэнд. Минималист загварын орон зайд өндөр чанарын эспрессо.',
    category: 'cafe', region: 'Seoul', lat: 37.5449, lng: 127.0572,
    address: '5 Yeonmujang-gil, Seongdong-gu, Seoul', rating: 4.2, featured: false,
    tags: ['cafe', 'specialty-coffee', 'minimalist', 'Seongsu']
  },

  // === SEONGSU - Food ===
  {
    name: 'Seongsu Gopchang Alley', name_ko: '성수 곱창골목', name_id: 'Gang Gopchang Seongsu', name_mn: 'Сонсү Гопчан гудамж',
    desc: 'A cluster of gopchang (grilled intestines) restaurants that has been a Seongsu landmark for decades. Authentic Korean BBQ experience at affordable prices.',
    desc_ko: '수십 년 된 성수동의 명물 곱창골목. 저렴하고 맛있는 곱창구이를 즐길 수 있는 곳.',
    desc_id: 'Kumpulan restoran gopchang (usus panggang) yang sudah menjadi landmark Seongsu selama puluhan tahun. BBQ Korea autentik dengan harga terjangkau.',
    desc_mn: 'Арван жилийн турш Сонсүгийн нэрт газар байсан гопчан (шарсан гэдэс) зоогийн газрууд. Хямд үнэтэй жинхэнэ Солонгос BBQ.',
    category: 'food', region: 'Seoul', lat: 37.5440, lng: 127.0550,
    address: 'Seongsu-dong 2-ga, Seongdong-gu, Seoul', rating: 4.3, featured: false,
    tags: ['BBQ', 'gopchang', 'local', 'Seongsu']
  },
  {
    name: 'Downtowner Seongsu', name_ko: '다운타우너 성수', name_id: 'Downtowner Seongsu', name_mn: 'Даунтаунер Сонсу',
    desc: 'Trendy smash burger restaurant that originated in Seongsu. Famous for juicy burgers, truffle fries, and a hip atmosphere. Very popular with locals and tourists alike.',
    desc_ko: '성수에서 시작한 트렌디 스매쉬 버거 맛집. 육즙 가득한 버거와 트러플 감자튀김이 인기. 외국인에게도 인기 만점.',
    desc_id: 'Restoran burger smash trendi yang berasal dari Seongsu. Terkenal dengan burger juicy dan kentang goreng truffle.',
    desc_mn: 'Сонсүгээс үүсэлтэй трэнди бургер зоогийн газар. Шүүслэг бургер, трюфель шарсан төмстэй.',
    category: 'food', region: 'Seoul', lat: 37.5444, lng: 127.0563,
    address: '11 Seongsuil-ro 6-gil, Seongdong-gu, Seoul', rating: 4.4, featured: false,
    tags: ['burger', 'trendy', 'western-food', 'Seongsu']
  },

  // === SEONGSU - Shopping ===
  {
    name: 'Seongsu Handmade Shoe Street', name_ko: '성수 수제화 거리', name_id: 'Jalan Sepatu Buatan Tangan Seongsu', name_mn: 'Сонсү гар урлалын гутлын гудамж',
    desc: 'Historic shoemaking district with artisan workshops. Watch craftsmen hand-make leather shoes and order custom pairs at reasonable prices. Seongsu\'s original identity.',
    desc_ko: '성수동의 원래 정체성인 수제화 거리. 장인이 직접 만드는 가죽 구두를 합리적 가격에 맞춤 주문 가능.',
    desc_id: 'Distrik pembuatan sepatu bersejarah dengan bengkel pengrajin. Pesan sepatu kulit custom dengan harga terjangkau.',
    desc_mn: 'Урчуудын гар урлалын гутлын түүхэн дүүрэг. Арьсан гутлыг захиалгаар хийлгэх боломжтой.',
    category: 'shopping', region: 'Seoul', lat: 37.5440, lng: 127.0545,
    address: 'Seongsu-dong 1-ga, Seongdong-gu, Seoul', rating: 4.1, featured: false,
    tags: ['shoes', 'handmade', 'artisan', 'Seongsu']
  },
  {
    name: 'AMORE Seongsu', name_ko: '아모레 성수', name_id: 'AMORE Seongsu', name_mn: 'АМОРЕ Сонсу',
    desc: 'Amorepacific\'s flagship beauty space. Personalized beauty consultations, exclusive K-beauty products, and brand experiences across multiple floors.',
    desc_ko: '아모레퍼시픽의 플래그십 뷰티 공간. 퍼스널 뷰티 상담, 한정판 K-뷰티 제품, 다층 브랜드 체험.',
    desc_id: 'Ruang kecantikan unggulan Amorepacific. Konsultasi kecantikan personal dan produk K-beauty eksklusif.',
    desc_mn: 'Amorepacific-ийн флагшип гоо сайхны орон зай. Хувийн зөвлөгөө, K-beauty бүтээгдэхүүн.',
    category: 'shopping', region: 'Seoul', lat: 37.5444, lng: 127.0567,
    address: '13 Achasan-ro 11-gil, Seongdong-gu, Seoul', rating: 4.3, featured: true,
    tags: ['K-beauty', 'cosmetics', 'flagship', 'Seongsu']
  },
  {
    name: 'LCDC Seoul', name_ko: '엘씨디씨 서울', name_id: 'LCDC Seoul', name_mn: 'LCDC Сөүл',
    desc: 'Curated multi-brand select shop featuring emerging Korean fashion designers, lifestyle goods, and a cafe. A showcase of Korean indie brands.',
    desc_ko: '신진 한국 패션 디자이너와 라이프스타일 제품을 큐레이션한 편집숍. 한국 인디 브랜드의 쇼케이스.',
    desc_id: 'Toko pilihan multi-brand yang menampilkan desainer mode Korea, barang gaya hidup, dan kafe.',
    desc_mn: 'Шинэ Солонгос загвар зохион бүтээгч, амьдралын хэв маягийн бүтээгдэхүүнтэй олон брэндийн дэлгүүр.',
    category: 'shopping', region: 'Seoul', lat: 37.5438, lng: 127.0553,
    address: '49 Seongsuil-ro 4-gil, Seongdong-gu, Seoul', rating: 4.2, featured: false,
    tags: ['fashion', 'indie-brands', 'select-shop', 'Seongsu']
  },
  {
    name: 'Yeonmujang-gil Pop-up Street', name_ko: '연무장길 팝업거리', name_id: 'Jalan Pop-up Yeonmujang', name_mn: 'Ёнмужан гудамжны поп-ап',
    desc: 'The main street of trendy Seongsu, constantly rotating with brand pop-ups from Samsung, Nike, Musinsa, and more. Something new every week.',
    desc_ko: '삼성, 나이키, 무신사 등 대형 브랜드 팝업이 매주 바뀌는 성수의 메인 스트리트. 매번 새로운 경험.',
    desc_id: 'Jalan utama Seongsu yang trendi, selalu berganti dengan pop-up dari Samsung, Nike, Musinsa. Sesuatu yang baru setiap minggu.',
    desc_mn: 'Samsung, Nike, Musinsa зэрэг том брэндийн поп-ап байнга солигддог Сонсүгийн гол гудамж.',
    category: 'shopping', region: 'Seoul', lat: 37.5450, lng: 127.0568,
    address: 'Yeonmujang-gil, Seongdong-gu, Seoul', rating: 4.4, featured: true,
    tags: ['pop-up', 'brands', 'trendy', 'Seongsu']
  },

  // === SEONGSU - Attractions ===
  {
    name: 'Seoul Forest', name_ko: '서울숲', name_id: 'Hutan Seoul', name_mn: 'Сөүл ой',
    desc: 'Massive urban park with deer feeding area, butterfly garden, and scenic trails. Perfect for picnics and cycling. Seoul\'s answer to Central Park.',
    desc_ko: '사슴 먹이주기, 나비정원, 산책로가 있는 대형 도시공원. 피크닉과 자전거 타기에 최적. 성수동의 허파.',
    desc_id: 'Taman kota besar dengan area memberi makan rusa, taman kupu-kupu, dan jalur pemandangan. Sempurna untuk piknik.',
    desc_mn: 'Буга тэжээх газар, эрвээхэйн цэцэрлэг, зугаалгын замтай том хотын цэцэрлэгт хүрээлэн. Пикникд тохиромжтой.',
    category: 'nature', region: 'Seoul', lat: 37.5444, lng: 127.0375,
    address: '273 Ttukseom-ro, Seongdong-gu, Seoul', rating: 4.6, featured: true,
    tags: ['park', 'deer', 'picnic', 'cycling', 'Seongsu']
  },
  {
    name: 'Under Stand Avenue', name_ko: '언더스탠드에비뉴', name_id: 'Under Stand Avenue', name_mn: 'Андер Стэнд Авеню',
    desc: 'Unique shopping and cultural complex built from 116 upcycled shipping containers near Seoul Forest. Indie shops, restaurants, galleries, and events.',
    desc_ko: '116개 재활용 컨테이너로 만든 복합문화공간. 인디 숍, 레스토랑, 갤러리, 이벤트 공간이 모인 서울숲 랜드마크.',
    desc_id: 'Kompleks belanja dan budaya unik dari 116 kontainer daur ulang di dekat Seoul Forest. Toko indie, restoran, dan galeri.',
    desc_mn: '116 дахин боловсруулсан чингэлэгээр хийсэн соёлын цогцолбор. Инди дэлгүүр, зоогийн газар, галерей.',
    category: 'attraction', region: 'Seoul', lat: 37.5456, lng: 127.0408,
    address: '63 Wangsimni-ro, Seongdong-gu, Seoul', rating: 4.2, featured: false,
    tags: ['container', 'upcycled', 'culture', 'Seongsu']
  },
  {
    name: 'Ttukseom Hangang Park', name_ko: '뚝섬한강공원', name_id: 'Taman Hangang Ttukseom', name_mn: 'Тукsom Ханган цэцэрлэгт хүрээлэн',
    desc: 'Han River park near Seongsu with water sports, outdoor swimming pool (summer), and the famous caterpillar light art. Great for sunset views and riverside picnics.',
    desc_ko: '수상스포츠, 야외수영장(여름), 자벌레 조형물이 있는 한강공원. 일몰과 한강 피크닉의 명소.',
    desc_id: 'Taman Sungai Han dekat Seongsu dengan olahraga air, kolam renang outdoor (musim panas), dan instalasi seni cahaya.',
    desc_mn: 'Сонсүгийн ойролцоох Хан голын цэцэрлэгт хүрээлэн. Усан спорт, зуны усан бассейн, нар жаргалтын үзэмж.',
    category: 'nature', region: 'Seoul', lat: 37.5313, lng: 127.0660,
    address: '139 Gangbyeon-bukro, Seongdong-gu, Seoul', rating: 4.4, featured: false,
    tags: ['Han-River', 'park', 'sunset', 'picnic', 'Seongsu']
  },
  {
    name: 'S-Factory', name_ko: '에스팩토리', name_id: 'S-Factory', name_mn: 'С-Фэктори',
    desc: 'Cultural complex in a renovated auto parts factory. Houses galleries, performance spaces, and creative studios. Hosts concerts, art exhibitions, and markets.',
    desc_ko: '자동차 부품 공장을 리모델링한 복합문화공간. 갤러리, 공연장, 크리에이티브 스튜디오. 콘서트와 전시가 열린다.',
    desc_id: 'Kompleks budaya di pabrik suku cadang mobil yang direnovasi. Galeri, ruang pertunjukan, dan studio kreatif.',
    desc_mn: 'Автомашины сэлбэг хэрэгслийн үйлдвэрийг шинэчлэн засварласан соёлын цогцолбор. Галерей, тоглолтын газар.',
    category: 'attraction', region: 'Seoul', lat: 37.5452, lng: 127.0540,
    address: '60 Yeonmujang 5-gil, Seongdong-gu, Seoul', rating: 4.1, featured: false,
    tags: ['culture', 'gallery', 'concert', 'factory', 'Seongsu']
  },
];

module.exports = async function handler(req, res) {
  const secret = req.query.secret;
  if (secret !== process.env.BULK_IMPORT_SECRET && secret !== 'koinfo2025') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const dbId = process.env.NOTION_DB_TRAVEL;
  if (!process.env.NOTION_TOKEN_TRAVEL || !dbId) {
    return res.status(503).json({ error: 'Travel DB not configured' });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN_TRAVEL });
  const results = [];
  let success = 0;
  let failed = 0;

  for (const spot of SPOTS) {
    try {
      const properties = {
        Name: { title: [{ text: { content: spot.name } }] },
        Category: { select: { name: spot.category } },
        Region: { select: { name: spot.region } },
        Published: { checkbox: true },
        Featured: { checkbox: spot.featured || false },
        Latitude: { number: spot.lat },
        Longitude: { number: spot.lng },
        Description: { rich_text: [{ text: { content: spot.desc } }] },
      };

      if (spot.name_ko) properties.Name_ko = { rich_text: [{ text: { content: spot.name_ko } }] };
      if (spot.name_id) properties.Name_id = { rich_text: [{ text: { content: spot.name_id } }] };
      if (spot.name_mn) properties.Name_mn = { rich_text: [{ text: { content: spot.name_mn } }] };
      if (spot.desc_ko) properties.Description_ko = { rich_text: [{ text: { content: spot.desc_ko } }] };
      if (spot.desc_id) properties.Description_id = { rich_text: [{ text: { content: spot.desc_id } }] };
      if (spot.desc_mn) properties.Description_mn = { rich_text: [{ text: { content: spot.desc_mn } }] };
      if (spot.address) properties.Address = { rich_text: [{ text: { content: spot.address } }] };
      if (spot.rating) properties.Rating = { number: spot.rating };
      if (spot.tags && spot.tags.length > 0) {
        properties.Tags = { multi_select: spot.tags.map(function(t) { return { name: t }; }) };
      }

      properties.SubmittedBy = { rich_text: [{ text: { content: 'TravelKo Team' } }] };

      await notion.pages.create({ parent: { database_id: dbId }, properties });
      success++;
      results.push({ name: spot.name, status: 'ok' });
    } catch (err) {
      failed++;
      results.push({ name: spot.name, status: 'error', message: err.message });
    }

    await new Promise(function(resolve) { setTimeout(resolve, 350); });
  }

  res.status(200).json({
    total: SPOTS.length,
    success,
    failed,
    results
  });
};
