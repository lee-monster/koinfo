// One-time script: Seed Seoul (Seongsu/Euljiro) spots into Notion TravelKo DB
// Run via: https://koinfo.kr/api/seed-seoul?key=seoul2025
const { Client } = require('@notionhq/client');

const SPOTS = [
  // === SEONGSU-DONG CAFES (5) ===
  {
    name: "Cafe Onion Seongsu",
    name_ko: "카페 어니언 성수",
    name_id: "Cafe Onion Seongsu",
    name_mn: "Кафе Онион Сонсу",
    desc: "TikTok-viral cafe in a converted shoe factory. Famous for its pandoro bread and industrial-chic interior. One of Seoul's most Instagrammable cafes.",
    desc_ko: "구두 공장을 개조한 성수동 대표 카페. 판도로 빵과 인더스트리얼 인테리어로 해외 SNS에서도 유명합니다.",
    desc_id: "Kafe viral TikTok di bekas pabrik sepatu. Terkenal dengan roti pandoro dan interior industrial-chic. Salah satu kafe paling Instagrammable di Seoul.",
    desc_mn: "Гутлын үйлдвэрийг шинэчилсэн TikTok-д алдартай кафе. Пандоро талх, аж үйлдвэрийн загварын дотоод засал нь Инстаграмд хамгийн их зургаа авахуулдаг газруудын нэг.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5446, lng: 127.0557,
    address: "서울특별시 성동구 아차산로11길 8", featured: true
  },
  {
    name: "Nudake Seongsu",
    name_ko: "누데이크 성수",
    name_id: "Nudake Seongsu",
    name_mn: "Нудэйк Сонсу",
    desc: "Gentle Monster's dessert brand cafe with avant-garde art installations. Their signature Peak cake is a social media sensation. A must-visit for design lovers.",
    desc_ko: "젠틀몬스터의 디저트 브랜드 카페. 전위적인 아트 설치물과 시그니처 피크 케이크로 SNS에서 화제인 디자인 카페입니다.",
    desc_id: "Kafe brand dessert Gentle Monster dengan instalasi seni avant-garde. Kue Peak signature mereka sangat viral di media sosial. Wajib dikunjungi pecinta desain.",
    desc_mn: "Жентл Монстер-ийн амттаны брэнд кафе. Авангард урлагийн суурилуулалт, Пийк бялуу нь сошиал медиад хамгийн их цацагдсан.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5449, lng: 127.0563,
    address: "서울특별시 성동구 아차산로11길 7", featured: true
  },
  {
    name: "Mesh Coffee",
    name_ko: "메쉬커피",
    name_id: "Mesh Coffee",
    name_mn: "Мэш Кофе",
    desc: "Minimalist specialty coffee roastery in Seongsu. Known for single-origin pour-over and sleek Scandinavian-inspired design. A favorite among coffee enthusiasts.",
    desc_ko: "성수동 미니멀리스트 스페셜티 커피 로스터리. 싱글 오리진 핸드드립과 북유럽 감성 인테리어로 커피 매니아들의 성지입니다.",
    desc_id: "Roastery kopi spesialti minimalis di Seongsu. Terkenal dengan pour-over single-origin dan desain Skandinavia yang elegan.",
    desc_mn: "Сонсу дахь минималист тусгай кофены шарлагын газар. Нэг гарал үүслийн хэнддрип кофе, хойд Европын загварын дотоод засалаар алдартай.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5441, lng: 127.0519,
    address: "서울특별시 성동구 서울숲2길 16-4"
  },
  {
    name: "LCDC Seoul",
    name_ko: "LCDC 서울",
    name_id: "LCDC Seoul",
    name_mn: "LCDC Сөүл",
    desc: "Multi-brand concept store and cafe in a beautifully renovated warehouse. Features rotating art exhibitions, curated lifestyle goods, and excellent coffee.",
    desc_ko: "아름답게 리노베이션된 창고 건물의 멀티 브랜드 컨셉 스토어 겸 카페. 회전 전시, 큐레이션 라이프스타일 굿즈, 훌륭한 커피를 제공합니다.",
    desc_id: "Toko konsep multi-brand dan kafe di gudang yang direnovasi indah. Menampilkan pameran seni bergilir, barang gaya hidup kurasi, dan kopi lezat.",
    desc_mn: "Үзэсгэлэнтэй шинэчилсэн агуулахан дахь олон брэндийн концепт дэлгүүр ба кафе. Ээлжит урлагийн үзэсгэлэн, амьдралын хэв маягийн бараа, маш сайхан кофетой.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5473, lng: 127.0554,
    address: "서울특별시 성동구 연무장길 8"
  },
  {
    name: "Daelim Changgo",
    name_ko: "대림창고",
    name_id: "Daelim Changgo (Gudang Daelim)",
    name_mn: "Дэлим Чанго (Дэлим агуулах)",
    desc: "Pioneer of Seongsu's cafe scene, set in a 1970s rice warehouse. The raw concrete and exposed steel beams create a unique gallery-cafe atmosphere.",
    desc_ko: "1970년대 정미소를 개조한 성수동 카페 문화의 선구자. 노출 콘크리트와 철골 구조가 독특한 갤러리 카페 분위기를 만듭니다.",
    desc_id: "Pelopor kafe Seongsu, menempati gudang beras tahun 1970-an. Beton mentah dan balok baja menciptakan suasana kafe-galeri yang unik.",
    desc_mn: "1970-аад оны будааны агуулахыг шинэчилсэн Сонсугийн кафе соёлын анхдагч. Нүцгэн бетон, ган дамнуурга нь өвөрмөц галерей-кафе уур амьсгал бүрдүүлдэг.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5440, lng: 127.0566,
    address: "서울특별시 성동구 성수이로 78"
  },

  // === SEONGSU-DONG FOOD (4) ===
  {
    name: "Tteuran",
    name_ko: "뜨란",
    name_id: "Tteuran",
    name_mn: "Ттыран",
    desc: "Vietnamese-Korean fusion restaurant viral on Korean food blogs. Signature banh mi and pho with Korean twists, set in a photogenic Seongsu alley space.",
    desc_ko: "한국 푸드 블로그에서 화제인 베트남-한국 퓨전 레스토랑. 한국식으로 재해석한 반미와 쌀국수가 시그니처인 성수동 포토제닉 맛집입니다.",
    desc_id: "Restoran fusion Vietnam-Korea yang viral di blog makanan Korea. Banh mi dan pho signature dengan sentuhan Korea, di gang fotogenik Seongsu.",
    desc_mn: "Солонгосын хоолны блогт алдартай Вьетнам-Солонгос фьюжн ресторан. Солонгос маягаар хийсэн бань ми, фо нь Сонсугийн гэрэл зургийн сайхан гудамжинд байрладаг.",
    category: "food", region: "Seongsu-dong", lat: 37.5448, lng: 127.0586,
    address: "서울특별시 성동구 서울숲4길 18"
  },
  {
    name: "Seongsu Handmade Burger",
    name_ko: "성수 수제버거",
    name_id: "Seongsu Handmade Burger",
    name_mn: "Сонсу гар хийцийн бургер",
    desc: "Craft burger joint in Seongsu with locally sourced beef and housemade buns. The smash burger and truffle fries have made this a foreigner favorite.",
    desc_ko: "국내산 소고기와 자체 제작 번을 사용하는 성수 수제버거. 스매쉬 버거와 트러플 감자튀김이 외국인들에게 특히 인기입니다.",
    desc_id: "Restoran burger craft di Seongsu dengan daging sapi lokal dan roti buatan sendiri. Smash burger dan truffle fries menjadikannya favorit turis asing.",
    desc_mn: "Дотоодын үхрийн мах, өөрсдийн хийсэн талхаар бүтээсэн Сонсу дахь гар бургерийн газар. Смэш бургер, трюфель шарсан төмстэй.",
    category: "food", region: "Seongsu-dong", lat: 37.5435, lng: 127.0560,
    address: "서울특별시 성동구 아차산로9길 12"
  },
  {
    name: "Sobok Chicken",
    name_ko: "소복치킨",
    name_id: "Sobok Chicken",
    name_mn: "Собок Чикэн",
    desc: "Retro-themed Korean fried chicken spot in Seongsu. Crispy double-fried chicken with creative sauces in a nostalgic 80s Korean decor. Great with Korean craft beer.",
    desc_ko: "성수동 레트로 감성 치킨집. 바삭한 이중 튀김 치킨과 창의적인 소스를 80년대 한국 인테리어에서 즐기는 곳. 수제 맥주와 함께 추천합니다.",
    desc_id: "Ayam goreng Korea bertema retro di Seongsu. Ayam double-fry renyah dengan saus kreatif dalam dekorasi Korea 80-an. Cocok dengan bir craft Korea.",
    desc_mn: "Сонсу дахь ретро загварын Солонгос шарсан тахианы газар. Давхар шарсан шарсан тахиа, 80-аад оны Солонгос дотоод засалтай. Гар урлалын шартай хамт.",
    category: "food", region: "Seongsu-dong", lat: 37.5462, lng: 127.0544,
    address: "서울특별시 성동구 왕십리로 115"
  },
  {
    name: "Yukjeon Sikdang",
    name_ko: "육전식당",
    name_id: "Yukjeon Sikdang",
    name_mn: "Юкжон Шикданг",
    desc: "Popular Korean meat pancake (yukjeon) restaurant in Seongsu. The savory beef pancakes paired with makgeolli are a hit among TikTok food tourists.",
    desc_ko: "성수동 인기 육전 맛집. 고소한 육전과 막걸리 조합이 틱톡 푸드 관광객들에게 큰 인기를 끌고 있습니다.",
    desc_id: "Restoran pancake daging Korea populer di Seongsu. Pancake daging sapi gurih dipadu makgeolli sangat populer di kalangan food tourist TikTok.",
    desc_mn: "Сонсу дахь алдартай Солонгос махан бин (юкжон) ресторан. Амттай үхрийн бин, макголли хослол нь TikTok хоолны жуулчдын дунд алдартай.",
    category: "food", region: "Seongsu-dong", lat: 37.5453, lng: 127.0538,
    address: "서울특별시 성동구 성수이로 10길 14"
  },

  // === EULJIRO CAFES (3) ===
  {
    name: "Cafe Onion Anguk",
    name_ko: "카페 어니언 안국",
    name_id: "Cafe Onion Anguk",
    name_mn: "Кафе Онион Ангук",
    desc: "Cafe Onion's hanok (traditional Korean house) branch near Bukchon. Stunning blend of old Korean architecture and modern cafe culture. TikTok famous for the courtyard views.",
    desc_ko: "북촌 근처 한옥을 개조한 카페 어니언 안국점. 전통 한국 건축과 현대 카페 문화의 절묘한 조화. 마당 뷰가 틱톡에서 화제입니다.",
    desc_id: "Cabang hanok (rumah tradisional Korea) Cafe Onion dekat Bukchon. Perpaduan menakjubkan arsitektur Korea kuno dan budaya kafe modern. Viral di TikTok.",
    desc_mn: "Бүкчон ойролцоох ханок (уламжлалт Солонгос байшин)-д байрлах Кафе Онион салбар. Эртний Солонгос барилгын урлаг, орчин үеийн кафе соёлын гайхалтай хослол.",
    category: "cafe", region: "Euljiro", lat: 37.5796, lng: 126.9851,
    address: "서울특별시 종로구 계동길 5", featured: true
  },
  {
    name: "Coffee Hanyakbang",
    name_ko: "커피한약방",
    name_id: "Coffee Hanyakbang",
    name_mn: "Кофе Ханякбанг",
    desc: "Hidden gem cafe in an old Korean medicine pharmacy in Euljiro. The vintage apothecary interior with herbal coffee blends creates a uniquely Korean cafe experience.",
    desc_ko: "을지로 옛 한약방을 개조한 숨은 명소 카페. 빈티지 약장 인테리어와 한방 블렌드 커피로 독특한 한국적 카페 경험을 제공합니다.",
    desc_id: "Kafe tersembunyi di apotek obat Korea lama di Euljiro. Interior apotek vintage dengan kopi herbal menciptakan pengalaman kafe unik khas Korea.",
    desc_mn: "Ыүлжиро дахь хуучин Солонгос уламжлалт эмийн сан дахь нууц кафе. Эртний эмийн сангийн дотоод засал, ургамлын кофе хослол нь онцгой Солонгос кафе туршлага.",
    category: "cafe", region: "Euljiro", lat: 37.5660, lng: 126.9920,
    address: "서울특별시 중구 을지로13길 17"
  },
  {
    name: "Neutral Colors",
    name_ko: "뉴트럴 컬러스",
    name_id: "Neutral Colors",
    name_mn: "Нютрал Колорс",
    desc: "Ultra-minimalist cafe-gallery in Euljiro known for its stark white interior and specialty espresso. A design-lover's paradise frequently featured on Instagram.",
    desc_ko: "을지로의 울트라 미니멀리스트 카페 갤러리. 순백 인테리어와 스페셜티 에스프레소로 인스타그램에서 자주 소개되는 디자인 성지입니다.",
    desc_id: "Kafe-galeri ultra-minimalis di Euljiro terkenal dengan interior putih bersih dan espresso spesialti. Surga pecinta desain yang sering tampil di Instagram.",
    desc_mn: "Ыүлжиро дахь ультра минималист кафе-галерей. Цагаан дотоод засал, тусгай эспрессо нь Инстаграмд байнга гарч буй дизайны диваажин.",
    category: "cafe", region: "Euljiro", lat: 37.5665, lng: 126.9918,
    address: "서울특별시 중구 을지로14길 8"
  },

  // === EULJIRO FOOD (4) ===
  {
    name: "Euljiro Nogari Alley",
    name_ko: "을지로 노가리 골목",
    name_id: "Euljiro Nogari Alley (Gang Ikan Kering)",
    name_mn: "Ыүлжиро Ногари гудамж (Хатаасан загасны гудамж)",
    desc: "Iconic alley of open-air bars serving dried pollack (nogari) and cheap beer since the 1980s. A raw, authentic Korean drinking culture experience loved by adventurous tourists.",
    desc_ko: "1980년대부터 이어진 노천 노가리 골목. 마른 안주와 저렴한 맥주로 한국 서민 음주 문화를 체험할 수 있는 을지로 대표 명소입니다.",
    desc_id: "Gang ikonik dengan bar terbuka yang menyajikan ikan kering (nogari) dan bir murah sejak 1980-an. Pengalaman budaya minum Korea otentik yang disukai turis petualang.",
    desc_mn: "1980-аад оноос хойш хатаасан загас (ногари), хямд шар айрагтай задгай бааруудын алдарт гудамж. Адал явдалд дуртай жуулчдын дуртай Солонгос уух соёлын газар.",
    category: "food", region: "Euljiro", lat: 37.5665, lng: 126.9910,
    address: "서울특별시 중구 을지로3가", featured: true
  },
  {
    name: "Jangsu Jokbal",
    name_ko: "장수족발",
    name_id: "Jangsu Jokbal (Kaki Babi)",
    name_mn: "Жансу Жокбал (Гахайн туурай)",
    desc: "Legendary late-night pig's feet restaurant in Jangchung-dong, open since 1978. The tender, marinated jokbal is a must-try Korean late-night food experience.",
    desc_ko: "1978년부터 영업한 장충동 족발 골목의 전설적인 맛집. 부드럽고 양념이 밴 족발은 한국 야식 문화의 대표 메뉴입니다.",
    desc_id: "Restoran kaki babi legendaris di Jangchung-dong, buka sejak 1978. Jokbal empuk bermarinasi ini wajib dicoba untuk pengalaman makanan malam Korea.",
    desc_mn: "1978 оноос хойш ажиллаж буй Жанчундон дахь алдарт гахайн туурайн ресторан. Зөөлөн, нөлөөлөгдсөн жокбал нь Солонгосын шөнийн хоолны дурсамж.",
    category: "food", region: "Euljiro", lat: 37.5610, lng: 127.0020,
    address: "서울특별시 중구 장충단로 174"
  },
  {
    name: "Gwangjang Market Mayak Gimbap",
    name_ko: "광장시장 마약김밥",
    name_id: "Gwangjang Market Mayak Gimbap",
    name_mn: "Гванжан зах Маяк Гимбап",
    desc: "Tiny addictive gimbap rolls at Korea's oldest traditional market. Netflix Street Food featured. The bite-sized 'drug gimbap' with mustard sauce is iconic K-food.",
    desc_ko: "한국 최고(最古) 전통시장의 중독성 있는 꼬마 김밥. 넷플릭스 스트릿 푸드에 소개된 겨자 소스 마약김밥은 K-푸드의 아이콘입니다.",
    desc_id: "Gimbap mini yang adiktif di pasar tradisional tertua Korea. Ditampilkan di Netflix Street Food. 'Drug gimbap' seukuran gigitan dengan saus mustard sangat ikonik.",
    desc_mn: "Солонгосын хамгийн эртний уламжлалт зах дахь донтуулам жижиг гимбап. Netflix Street Food-д гарсан. Гичний сүмстэй 'маяк гимбап' нь K-хоолны бэлгэдэл.",
    category: "food", region: "Euljiro", lat: 37.5700, lng: 126.9996,
    address: "서울특별시 종로구 종로 88 광장시장", featured: true
  },
  {
    name: "Tosokchon Samgyetang",
    name_ko: "토속촌 삼계탕",
    name_id: "Tosokchon Samgyetang (Sup Ayam Ginseng)",
    name_mn: "Тосокчон Самгетан (Жинсэнтэй тахианы шөл)",
    desc: "Seoul's most famous ginseng chicken soup restaurant near Gyeongbokgung Palace. A traditional Korean health food experience loved by international visitors for decades.",
    desc_ko: "경복궁 근처 서울에서 가장 유명한 삼계탕집. 수십 년간 외국인 관광객들이 사랑해온 한국 전통 보양식 대표 맛집입니다.",
    desc_id: "Restoran sup ayam ginseng paling terkenal di Seoul dekat Istana Gyeongbokgung. Pengalaman makanan sehat tradisional Korea yang dicintai pengunjung internasional.",
    desc_mn: "Гёнбокгүн ордны ойролцоох Сөүлийн хамгийн алдарт жинсэнтэй тахианы шөлний ресторан. Олон арван жилийн турш олон улсын жуулчдын хайрласан уламжлалт эрүүл хоол.",
    category: "food", region: "Euljiro", lat: 37.5782, lng: 126.9717,
    address: "서울특별시 종로구 자하문로5길 5"
  },

  // === SEONGSU ATTRACTIONS (2) ===
  {
    name: "Seoul Forest",
    name_ko: "서울숲",
    name_id: "Seoul Forest",
    name_mn: "Сөүл ой",
    desc: "Beautiful urban park near Seongsu with deer garden, art installations, and seasonal flower gardens. Perfect for a peaceful walk between cafe-hopping in Seongsu-dong.",
    desc_ko: "성수 근처 아름다운 도심 공원. 사슴 방사장, 아트 설치물, 계절별 꽃정원이 있어 성수동 카페 투어 사이 산책하기 완벽합니다.",
    desc_id: "Taman kota indah dekat Seongsu dengan taman rusa, instalasi seni, dan taman bunga musiman. Sempurna untuk jalan santai di antara cafe-hopping Seongsu.",
    desc_mn: "Сонсу ойролцоох үзэсгэлэнтэй хотын цэцэрлэгт хүрээлэн. Буга мал, урлагийн суурилуулалт, улирлын цэцгийн цэцэрлэгтэй. Кафе аялалын завсарлагаанд тохиромжтой.",
    category: "nature", region: "Seongsu-dong", lat: 37.5443, lng: 127.0374,
    address: "서울특별시 성동구 뚝섬로 273"
  },
  {
    name: "Seongsu Street Art & Mural Alley",
    name_ko: "성수동 벽화거리",
    name_id: "Seongsu Street Art & Mural Alley",
    name_mn: "Сонсу гудамжны урлаг ба ханын зургийн гудамж",
    desc: "Colorful mural alleys and street art throughout Seongsu-dong, turning old factory walls into open-air galleries. Popular photo spots for social media content creators.",
    desc_ko: "성수동 곳곳의 형형색색 벽화 골목과 스트릿 아트. 오래된 공장 벽이 야외 갤러리로 변신한 SNS 콘텐츠 크리에이터들의 인기 촬영 명소입니다.",
    desc_id: "Gang mural berwarna-warni dan seni jalanan di seluruh Seongsu-dong, mengubah dinding pabrik lama menjadi galeri terbuka. Spot foto populer untuk kreator konten.",
    desc_mn: "Сонсу даяар өнгөлөг ханын зургийн гудамж. Хуучин үйлдвэрийн ханыг задгай галерей болгон хувиргасан сошиал медиа контент бүтээгчдийн дуртай зургийн газар.",
    category: "attraction", region: "Seongsu-dong", lat: 37.5450, lng: 127.0560,
    address: "서울특별시 성동구 성수이로 일대"
  },
];

module.exports = async function handler(req, res) {
  var key = req.query.key;
  if (key !== 'seoul2025') {
    return res.status(403).json({ error: 'Invalid key' });
  }

  var notion = new Client({ auth: process.env.NOTION_TOKEN_TRAVEL });
  var dbId = process.env.NOTION_DB_TRAVEL;

  if (!notion || !dbId) {
    return res.status(500).json({ error: 'Missing Notion config' });
  }

  var results = [];

  for (var i = 0; i < SPOTS.length; i++) {
    var spot = SPOTS[i];
    try {
      var properties = {
        Name: { title: [{ text: { content: spot.name } }] },
        Name_ko: { rich_text: [{ text: { content: spot.name_ko } }] },
        Name_id: { rich_text: [{ text: { content: spot.name_id } }] },
        Name_mn: { rich_text: [{ text: { content: spot.name_mn } }] },
        Description: { rich_text: [{ text: { content: spot.desc } }] },
        Description_ko: { rich_text: [{ text: { content: spot.desc_ko } }] },
        Description_id: { rich_text: [{ text: { content: spot.desc_id } }] },
        Description_mn: { rich_text: [{ text: { content: spot.desc_mn } }] },
        Category: { select: { name: spot.category } },
        Region: { select: { name: spot.region } },
        Latitude: { number: spot.lat },
        Longitude: { number: spot.lng },
        Address: { rich_text: [{ text: { content: spot.address } }] },
        Published: { checkbox: true },
        Featured: { checkbox: spot.featured || false },
      };

      await notion.pages.create({ parent: { database_id: dbId }, properties: properties });
      results.push({ name: spot.name, status: 'ok' });
    } catch (err) {
      results.push({ name: spot.name, status: 'error', detail: err.message });
    }
  }

  var ok = results.filter(function(r) { return r.status === 'ok'; }).length;
  var fail = results.filter(function(r) { return r.status === 'error'; }).length;

  return res.status(200).json({
    summary: ok + ' added, ' + fail + ' failed',
    results: results
  });
};
