const { Client } = require('@notionhq/client');

// One-time bulk import script for TravelKo spots
// DELETE THIS FILE AFTER USE

const SPOTS = [
  // === SEOUL - Attractions ===
  {
    name: 'Gyeongbokgung Palace', name_ko: '경복궁', name_id: 'Istana Gyeongbokgung', name_mn: 'Гёнбоккүн ордон',
    desc: 'The largest of the Five Grand Palaces built during the Joseon Dynasty. A must-visit for its stunning architecture and the changing of the guard ceremony.',
    desc_ko: '조선시대 5대 궁궐 중 가장 큰 궁궐. 수문장 교대식과 한복 체험이 인기.',
    desc_id: 'Istana terbesar dari Lima Istana Besar yang dibangun pada masa Dinasti Joseon. Wajib dikunjungi untuk arsitektur dan upacara pergantian penjaga.',
    desc_mn: 'Жусон гүрний үед баригдсан таван том ордны хамгийн том нь. Харуулын ёслол, ханбок туршлага алдартай.',
    category: 'attraction', region: 'Seoul', lat: 37.5796, lng: 126.9770,
    address: '161 Sajik-ro, Jongno-gu, Seoul', rating: 4.7, featured: true,
    tags: ['palace', 'history', 'hanbok', 'UNESCO']
  },
  {
    name: 'Bukchon Hanok Village', name_ko: '북촌한옥마을', name_id: 'Desa Hanok Bukchon', name_mn: 'Букчон Ханок тосгон',
    desc: 'Traditional Korean village with hundreds of hanok (traditional houses) dating back to the Joseon Dynasty. Walk through narrow alleys for a glimpse of old Seoul.',
    desc_ko: '조선시대 한옥이 밀집한 전통마을. 좁은 골목길을 걸으며 서울의 옛 모습을 만날 수 있다.',
    desc_id: 'Desa tradisional Korea dengan ratusan hanok dari era Dinasti Joseon. Berjalan melalui gang-gang sempit untuk melihat Seoul kuno.',
    desc_mn: 'Жусон гүрний үеийн ханок бүхий уламжлалт тосгон. Нарийн гудамжаар алхаж хуучин Сөүлийг мэдрээрэй.',
    category: 'attraction', region: 'Seoul', lat: 37.5826, lng: 126.9831,
    address: '37 Gyedong-gil, Jongno-gu, Seoul', rating: 4.5, featured: true,
    tags: ['hanok', 'traditional', 'village', 'photo-spot']
  },
  {
    name: 'N Seoul Tower', name_ko: 'N서울타워', name_id: 'Menara N Seoul', name_mn: 'N Сөүл цамхаг',
    desc: 'Iconic tower on Namsan Mountain offering panoramic views of Seoul. Especially beautiful at night with city lights. Love locks are a popular attraction.',
    desc_ko: '남산 위 서울의 상징적 타워. 야경이 특히 아름답고 사랑의 자물쇠가 유명.',
    desc_id: 'Menara ikonik di Gunung Namsan dengan pemandangan panorama Seoul. Sangat indah di malam hari.',
    desc_mn: 'Намсан ууланд байрлах Сөүлийн бэлгэдэл цамхаг. Шөнийн үзэмж онцгой үзэсгэлэнтэй.',
    category: 'attraction', region: 'Seoul', lat: 37.5512, lng: 126.9882,
    address: '105 Namsangongwon-gil, Yongsan-gu, Seoul', rating: 4.5, featured: true,
    tags: ['tower', 'night-view', 'landmark', 'love-locks']
  },
  {
    name: 'Changdeokgung Palace', name_ko: '창덕궁', name_id: 'Istana Changdeokgung', name_mn: 'Чандоккүн ордон',
    desc: 'UNESCO World Heritage palace known for its Secret Garden (Huwon). The garden features a beautiful lotus pond and traditional pavilions.',
    desc_ko: 'UNESCO 세계문화유산. 후원(비밀의 정원)의 연못과 정자가 아름답다.',
    desc_id: 'Istana Warisan Dunia UNESCO yang terkenal dengan Taman Rahasianya. Memiliki kolam teratai dan paviliun tradisional.',
    desc_mn: 'ЮНЕСКО-гийн дэлхийн өвд бүртгэгдсэн ордон. Нууц цэцэрлэгийн цөөрөм, асар үзэсгэлэнтэй.',
    category: 'attraction', region: 'Seoul', lat: 37.5794, lng: 126.9910,
    address: '99 Yulgok-ro, Jongno-gu, Seoul', rating: 4.6, featured: false,
    tags: ['palace', 'UNESCO', 'garden', 'history']
  },
  {
    name: 'Dongdaemun Design Plaza (DDP)', name_ko: '동대문디자인플라자', name_id: 'Dongdaemun Design Plaza', name_mn: 'Дондэмүн Дизайн Плаза',
    desc: 'Futuristic landmark designed by Zaha Hadid. Hosts exhibitions, fashion shows, and the famous LED rose garden at night.',
    desc_ko: '자하 하디드가 설계한 미래적 건축물. 전시, 패션쇼, LED 장미정원이 유명.',
    desc_id: 'Landmark futuristik dirancang oleh Zaha Hadid. Menyelenggarakan pameran dan taman mawar LED di malam hari.',
    desc_mn: 'Заха Хадидын зохион бүтээсэн ирээдүйн барилга. Үзэсгэлэн, LED сарнайн цэцэрлэг алдартай.',
    category: 'attraction', region: 'Seoul', lat: 37.5673, lng: 127.0095,
    address: '281 Eulji-ro, Jung-gu, Seoul', rating: 4.3, featured: false,
    tags: ['architecture', 'design', 'night-view', 'exhibition']
  },
  {
    name: 'Lotte World Tower & Seoul Sky', name_ko: '롯데월드타워 서울스카이', name_id: 'Lotte World Tower & Seoul Sky', name_mn: 'Лоттэ Ворлд Тауэр',
    desc: 'The tallest building in Korea (555m). Seoul Sky observation deck on 117-123F offers breathtaking views. Glass floor experience available.',
    desc_ko: '한국 최고층 빌딩(555m). 117~123층 전망대 서울스카이에서 360도 서울 조망.',
    desc_id: 'Gedung tertinggi di Korea (555m). Dek observasi Seoul Sky di lantai 117-123 menawarkan pemandangan menakjubkan.',
    desc_mn: 'Солонгосын хамгийн өндөр барилга (555м). 117-123 давхрын тагнуулын талбайгаас Сөүлийг бүхэлд нь харна.',
    category: 'attraction', region: 'Seoul', lat: 37.5126, lng: 127.1025,
    address: '300 Olympic-ro, Songpa-gu, Seoul', rating: 4.5, featured: false,
    tags: ['skyscraper', 'observation', 'landmark']
  },
  {
    name: 'War Memorial of Korea', name_ko: '전쟁기념관', name_id: 'Memorial Perang Korea', name_mn: 'Солонгосын дайны дурсгалын газар',
    desc: 'Comprehensive museum about Korean military history, especially the Korean War. Impressive outdoor exhibits of tanks, planes, and missiles. Free admission.',
    desc_ko: '한국 전쟁사를 총망라한 박물관. 야외 전시물과 무료 입장이 매력적.',
    desc_id: 'Museum komprehensif tentang sejarah militer Korea. Pameran luar ruangan yang mengesankan. Masuk gratis.',
    desc_mn: 'Солонгосын цэргийн түүхийн иж бүрэн музей. Гадаа тэнк, онгоц үзүүлэн. Үнэгүй.',
    category: 'attraction', region: 'Seoul', lat: 37.5349, lng: 126.9770,
    address: '29 Itaewon-ro, Yongsan-gu, Seoul', rating: 4.6, featured: false,
    tags: ['museum', 'history', 'free', 'Korean-War']
  },
  {
    name: 'National Museum of Korea', name_ko: '국립중앙박물관', name_id: 'Museum Nasional Korea', name_mn: 'Солонгосын үндэсний музей',
    desc: 'One of the largest museums in Asia with over 310,000 artifacts. Covers Korean history from prehistoric to modern era. Free admission for permanent exhibition.',
    desc_ko: '아시아 최대 규모 박물관. 선사시대부터 현대까지 한국 역사 총망라. 상설전시 무료.',
    desc_id: 'Salah satu museum terbesar di Asia dengan lebih dari 310.000 artefak. Masuk gratis untuk pameran tetap.',
    desc_mn: 'Ази тивийн хамгийн том музейн нэг. 310,000 гаруй олдвортой. Байнгын үзэсгэлэн үнэгүй.',
    category: 'attraction', region: 'Seoul', lat: 37.5239, lng: 126.9804,
    address: '137 Seobinggo-ro, Yongsan-gu, Seoul', rating: 4.7, featured: false,
    tags: ['museum', 'history', 'free', 'art']
  },

  // === SEOUL - Shopping & Entertainment ===
  {
    name: 'Myeongdong', name_ko: '명동', name_id: 'Myeongdong', name_mn: 'Мёндон',
    desc: 'Seoul\'s premier shopping district famous for K-beauty brands, street food, and fashion. Every major Korean cosmetics brand has a flagship store here.',
    desc_ko: 'K-뷰티, 스트리트푸드, 패션의 메카. 한국 화장품 브랜드 플래그십이 총집합.',
    desc_id: 'Distrik belanja utama Seoul yang terkenal dengan merek K-beauty, jajanan jalanan, dan mode.',
    desc_mn: 'K-beauty, гудамжны хоол, загварын төв. Солонгосын гоо сайхны бүх брэнд энд байдаг.',
    category: 'shopping', region: 'Seoul', lat: 37.5636, lng: 126.9869,
    address: 'Myeongdong-gil, Jung-gu, Seoul', rating: 4.3, featured: true,
    tags: ['shopping', 'K-beauty', 'street-food', 'fashion']
  },
  {
    name: 'Hongdae Street', name_ko: '홍대거리', name_id: 'Jalan Hongdae', name_mn: 'Хондэ гудамж',
    desc: 'Trendy youth district near Hongik University. Known for indie music, street performances, unique cafes, vintage shops, and vibrant nightlife.',
    desc_ko: '홍익대 앞 젊음의 거리. 인디음악, 버스킹, 독특한 카페, 빈티지샵, 클럽이 가득.',
    desc_id: 'Distrik pemuda trendi dekat Universitas Hongik. Terkenal dengan musik indie, pertunjukan jalanan, dan kehidupan malam.',
    desc_mn: 'Хонгик их сургуулийн ойролцоох залуучуудын дүүрэг. Инди хөгжим, гудамжны тоглолт, шөнийн амьдрал.',
    category: 'nightlife', region: 'Seoul', lat: 37.5563, lng: 126.9236,
    address: 'Hongdae, Mapo-gu, Seoul', rating: 4.4, featured: true,
    tags: ['nightlife', 'music', 'youth', 'shopping', 'clubs']
  },
  {
    name: 'Insadong', name_ko: '인사동', name_id: 'Insadong', name_mn: 'Инсадон',
    desc: 'Traditional culture street with antique shops, art galleries, tea houses, and Korean craft stores. Great place for souvenirs and traditional Korean tea.',
    desc_ko: '전통문화의 거리. 골동품, 갤러리, 찻집, 공예품 가게가 모여 있는 관광 명소.',
    desc_id: 'Jalan budaya tradisional dengan toko antik, galeri seni, dan kedai teh Korea.',
    desc_mn: 'Уламжлалт соёлын гудамж. Эртний эдлэл, галерей, цайны газар, гар урлалын дэлгүүр.',
    category: 'shopping', region: 'Seoul', lat: 37.5741, lng: 126.9858,
    address: 'Insadong-gil, Jongno-gu, Seoul', rating: 4.3, featured: false,
    tags: ['traditional', 'art', 'tea', 'souvenirs']
  },
  {
    name: 'COEX Starfield Library', name_ko: '별마당 도서관', name_id: 'Perpustakaan Starfield COEX', name_mn: 'Старфилд номын сан',
    desc: 'Stunning open library inside COEX Mall with towering bookshelves reaching 13 meters high. A popular Instagram photo spot.',
    desc_ko: '코엑스몰 내 13m 높이 서가가 인상적인 개방형 도서관. 인스타그램 인기 명소.',
    desc_id: 'Perpustakaan terbuka yang menakjubkan di dalam COEX Mall dengan rak buku setinggi 13 meter.',
    desc_mn: 'COEX дотор 13м өндөр номын тавиуртай нээлттэй номын сан. Инстаграм зураг авах алдартай газар.',
    category: 'attraction', region: 'Seoul', lat: 37.5116, lng: 127.0595,
    address: '513 Yeongdong-daero, Gangnam-gu, Seoul', rating: 4.4, featured: false,
    tags: ['library', 'photo-spot', 'mall', 'free']
  },

  // === SEOUL - Food ===
  {
    name: 'Gwangjang Market', name_ko: '광장시장', name_id: 'Pasar Gwangjang', name_mn: 'Гванжан зах',
    desc: 'Seoul\'s oldest traditional market, famous for bindaetteok (mung bean pancakes), mayak gimbap, and yukhoe (Korean beef tartare). Featured on Netflix.',
    desc_ko: '서울 최초의 상설시장. 빈대떡, 마약김밥, 육회가 유명. 넷플릭스 출연 명소.',
    desc_id: 'Pasar tradisional tertua di Seoul, terkenal dengan bindaetteok, mayak gimbap, dan yukhoe. Tampil di Netflix.',
    desc_mn: 'Сөүлийн хамгийн эртний зах. Биндэтток, маяк гимбаб, юкхө алдартай. Netflix-д гарсан.',
    category: 'food', region: 'Seoul', lat: 37.5701, lng: 126.9995,
    address: '88 Changgyeonggung-ro, Jongno-gu, Seoul', rating: 4.6, featured: true,
    tags: ['market', 'street-food', 'traditional', 'Netflix']
  },
  {
    name: 'Noryangjin Fish Market', name_ko: '노량진수산시장', name_id: 'Pasar Ikan Noryangjin', name_mn: 'Норянжин загасны зах',
    desc: 'Massive wholesale fish market where you can buy fresh seafood and have it prepared on the spot. Great for sashimi and live seafood experience.',
    desc_ko: '신선한 해산물을 구매해 바로 조리해 먹을 수 있는 대형 수산시장.',
    desc_id: 'Pasar ikan besar tempat Anda bisa membeli makanan laut segar dan langsung diolah di tempat.',
    desc_mn: 'Шинэхэн далайн хоол худалдаж аваад тэр дороо хийлгэж идэх том загасны зах.',
    category: 'food', region: 'Seoul', lat: 37.5135, lng: 126.9408,
    address: '674 Nodeul-ro, Dongjak-gu, Seoul', rating: 4.3, featured: false,
    tags: ['seafood', 'market', 'sashimi', 'fresh']
  },
  {
    name: 'Tongin Market Dosirak Cafe', name_ko: '통인시장 도시락카페', name_id: 'Kafe Dosirak Pasar Tongin', name_mn: 'Тонгин зах Досирак кафе',
    desc: 'Unique market experience where you buy old Korean coins and use them to pick dishes from different vendors to build your own lunchbox.',
    desc_ko: '엽전으로 시장 반찬을 골라 나만의 도시락을 만드는 독특한 체험.',
    desc_id: 'Pengalaman pasar unik di mana Anda membeli koin Korea kuno untuk memilih hidangan dari berbagai pedagang.',
    desc_mn: 'Хуучин зоос ашиглан янз бүрийн хоолоос сонгож өөрийн үдийн хоол бэлдэх өвөрмөц туршлага.',
    category: 'food', region: 'Seoul', lat: 37.5794, lng: 126.9688,
    address: '18 Jahamun-ro 15-gil, Jongno-gu, Seoul', rating: 4.2, featured: false,
    tags: ['market', 'lunchbox', 'experience', 'traditional']
  },
  {
    name: 'Korean BBQ Alley (Mapo)', name_ko: '마포 갈매기살 골목', name_id: 'Gang BBQ Korea (Mapo)', name_mn: 'Солонгос BBQ гудамж (Мапо)',
    desc: 'Famous alley near Mapo Station packed with Korean BBQ restaurants. Known for galmaegi-sal (skirt meat) and samgyeopsal (pork belly). Authentic local experience.',
    desc_ko: '마포역 근처 갈매기살, 삼겹살 맛집 골목. 현지인도 즐겨찾는 정통 고깃집 거리.',
    desc_id: 'Gang terkenal dekat Stasiun Mapo yang penuh dengan restoran BBQ Korea. Pengalaman lokal autentik.',
    desc_mn: 'Мапо станцын ойролцоох Солонгос BBQ-ийн алдартай гудамж. Галмэги-саль, самгёпсаль.',
    category: 'food', region: 'Seoul', lat: 37.5397, lng: 126.9459,
    address: 'Mapo-gu, Seoul', rating: 4.5, featured: false,
    tags: ['BBQ', 'meat', 'local', 'pork-belly']
  },
  {
    name: 'Jongno Pojangmacha Alley', name_ko: '종로 포장마차 골목', name_id: 'Gang Pojangmacha Jongno', name_mn: 'Жонно Пожанмача гудамж',
    desc: 'Street food tent alley in Jongno. Late-night drinking and eating culture at outdoor tents serving tteokbokki, sundae, and soju.',
    desc_ko: '종로의 야외 포장마차 골목. 떡볶이, 순대, 소주로 서울의 밤문화를 체험.',
    desc_id: 'Gang tenda makanan jalanan di Jongno. Budaya makan malam dengan tteokbokki, sundae, dan soju.',
    desc_mn: 'Жонногийн гудамжны хоолны майхан. Ттокбокки, сундэ, сожугаар Сөүлийн шөнийн соёлыг мэдрэх.',
    category: 'food', region: 'Seoul', lat: 37.5704, lng: 126.9920,
    address: 'Jongno 3-ga, Jongno-gu, Seoul', rating: 4.1, featured: false,
    tags: ['street-food', 'night', 'pojangmacha', 'soju']
  },

  // === SEOUL - Cafes ===
  {
    name: 'Cafe Onion Seongsu', name_ko: '카페 어니언 성수', name_id: 'Cafe Onion Seongsu', name_mn: 'Кафе Онион Сонсу',
    desc: 'Iconic cafe in a converted factory in Seongsu-dong. Industrial aesthetic, excellent pastries, and the signature pandoro bread. Always packed with visitors.',
    desc_ko: '성수동 폐공장을 개조한 감성 카페. 판도로 빵이 시그니처. 항상 사람이 많다.',
    desc_id: 'Kafe ikonik di pabrik yang diubah di Seongsu-dong. Estetika industrial dan roti pandoro yang terkenal.',
    desc_mn: 'Сонсу-дон дахь хуучин үйлдвэрийг кафе болгосон. Пандоро талх алдартай.',
    category: 'cafe', region: 'Seoul', lat: 37.5447, lng: 127.0560,
    address: '8 Achasan-ro 9-gil, Seongdong-gu, Seoul', rating: 4.4, featured: true,
    tags: ['cafe', 'bakery', 'industrial', 'Seongsu']
  },
  {
    name: 'Cafe Dior Seongsu', name_ko: '디올 성수', name_id: 'Cafe Dior Seongsu', name_mn: 'Кафе Диор Сонсу',
    desc: 'Luxury brand pop-up cafe by Dior in Seongsu. Beautifully designed space serving coffee and exclusive desserts. Reservation recommended.',
    desc_ko: '디올의 성수 팝업 카페. 아름다운 공간에서 커피와 디저트를 즐기는 럭셔리 체험.',
    desc_id: 'Kafe pop-up merek mewah oleh Dior di Seongsu. Ruang berdesain indah dengan kopi dan dessert eksklusif.',
    desc_mn: 'Dior-ийн Сонсу дахь тансаг кафе. Үзэсгэлэнтэй орчинд кофе, дессерт.',
    category: 'cafe', region: 'Seoul', lat: 37.5440, lng: 127.0570,
    address: 'Seongsu-dong, Seongdong-gu, Seoul', rating: 4.3, featured: false,
    tags: ['cafe', 'luxury', 'Dior', 'Seongsu']
  },

  // === SEOUL - Nature ===
  {
    name: 'Bukhansan National Park', name_ko: '북한산국립공원', name_id: 'Taman Nasional Bukhansan', name_mn: 'Бүхансан үндэсний цэцэрлэгт хүрээлэн',
    desc: 'Granite peak mountain park right in Seoul. Multiple hiking trails for all levels. Baegundae peak (836m) offers amazing city views.',
    desc_ko: '서울 도심 속 화강암 산악 국립공원. 백운대(836m) 정상에서 서울 전경 조망.',
    desc_id: 'Taman gunung granit tepat di Seoul. Berbagai jalur pendakian untuk semua level.',
    desc_mn: 'Сөүл хотын дотор байрлах гранитан уулын цэцэрлэгт хүрээлэн. Бэгундэ оргил (836м).',
    category: 'nature', region: 'Seoul', lat: 37.6608, lng: 126.9933,
    address: 'Bukhansan-ro, Gangbuk-gu, Seoul', rating: 4.7, featured: false,
    tags: ['hiking', 'mountain', 'nature', 'national-park']
  },
  {
    name: 'Han River Yeouido Park', name_ko: '여의도 한강공원', name_id: 'Taman Sungai Han Yeouido', name_mn: 'Ёидо Хан голын цэцэрлэгт хүрээлэн',
    desc: 'Popular riverside park for picnics, cycling, and chicken & beer by the river. Rent a bike, order delivery chicken, and enjoy the view.',
    desc_ko: '치맥과 피크닉의 성지. 자전거 대여, 배달 치킨, 한강 야경을 한번에 즐기는 곳.',
    desc_id: 'Taman tepi sungai yang populer untuk piknik, bersepeda, dan ayam goreng & bir di tepi sungai.',
    desc_mn: 'Пикник, дугуйгаар зугаалах, голын дэргэд тахианы мах, шар айраг уух алдартай газар.',
    category: 'nature', region: 'Seoul', lat: 37.5284, lng: 126.9340,
    address: 'Yeouido-dong, Yeongdeungpo-gu, Seoul', rating: 4.5, featured: false,
    tags: ['river', 'picnic', 'cycling', 'chicken-beer']
  },
  {
    name: 'Cheonggyecheon Stream', name_ko: '청계천', name_id: 'Sungai Cheonggyecheon', name_mn: 'Чонгечон гол',
    desc: 'Restored urban stream running through downtown Seoul. A peaceful 10.9km walk with public art and seasonal illuminations.',
    desc_ko: '서울 도심을 가로지르는 10.9km 복원 하천. 산책, 공공미술, 계절 조명이 매력적.',
    desc_id: 'Sungai kota yang direstorasi sepanjang 10,9km melalui pusat kota Seoul. Seni publik dan iluminasi musiman.',
    desc_mn: 'Сөүлийн төв хотоор урсах сэргээсэн гол. 10.9км зугаалга, урлагийн бүтээл, улирлын гэрэлтүүлэг.',
    category: 'nature', region: 'Seoul', lat: 37.5696, lng: 126.9784,
    address: 'Cheonggyecheon-ro, Jongno-gu, Seoul', rating: 4.3, featured: false,
    tags: ['stream', 'walk', 'art', 'downtown']
  },

  // === BUSAN ===
  {
    name: 'Haeundae Beach', name_ko: '해운대 해수욕장', name_id: 'Pantai Haeundae', name_mn: 'Хэундэ далайн эрэг',
    desc: 'Korea\'s most famous beach. White sand, vibrant atmosphere, seafood restaurants, and the annual sand festival. A must-visit in summer.',
    desc_ko: '대한민국 대표 해변. 하얀 모래사장, 해산물 맛집, 모래축제로 유명.',
    desc_id: 'Pantai paling terkenal di Korea. Pasir putih, suasana hidup, restoran makanan laut.',
    desc_mn: 'Солонгосын хамгийн алдартай далайн эрэг. Цагаан элс, далайн хоол, элсний наадам.',
    category: 'nature', region: 'Busan', lat: 35.1587, lng: 129.1604,
    address: '264 Haeundaehaebyeon-ro, Haeundae-gu, Busan', rating: 4.5, featured: true,
    tags: ['beach', 'summer', 'seafood', 'festival']
  },
  {
    name: 'Gamcheon Culture Village', name_ko: '감천문화마을', name_id: 'Desa Budaya Gamcheon', name_mn: 'Гамчон соёлын тосгон',
    desc: 'Colorful hillside village called the "Machu Picchu of Busan". Pastel houses, street art, and narrow alleys make it a photographer\'s paradise.',
    desc_ko: '부산의 마추픽추. 파스텔톤 집들, 벽화, 골목길이 어우러진 포토존 천국.',
    desc_id: 'Desa bukit berwarna-warni yang disebut "Machu Picchu Busan". Rumah pastel dan seni jalanan.',
    desc_mn: '"Бусаны Мачу Пикчу" гэж нэрлэгддэг өнгөлөг хадан дээрх тосгон. Хананы зураг, нарийн гудамж.',
    category: 'attraction', region: 'Busan', lat: 35.0975, lng: 129.0107,
    address: '203 Gamnae 2-ro, Saha-gu, Busan', rating: 4.4, featured: true,
    tags: ['village', 'colorful', 'street-art', 'photo-spot']
  },
  {
    name: 'Jagalchi Fish Market', name_ko: '자갈치시장', name_id: 'Pasar Ikan Jagalchi', name_mn: 'Жагалчи загасны зах',
    desc: 'Korea\'s largest seafood market. Buy fresh fish and shellfish from vendors and eat on the spot at the upper-floor restaurants.',
    desc_ko: '국내 최대 수산시장. 신선한 해산물을 구매해 윗층 식당에서 바로 맛볼 수 있다.',
    desc_id: 'Pasar makanan laut terbesar di Korea. Beli ikan segar dan makan di restoran lantai atas.',
    desc_mn: 'Солонгосын хамгийн том далайн хоолны зах. Шинэхэн загас худалдаж дээд давхрын зоогийн газарт идэх боломжтой.',
    category: 'food', region: 'Busan', lat: 35.0968, lng: 129.0306,
    address: '52 Jagalchihaean-ro, Jung-gu, Busan', rating: 4.4, featured: false,
    tags: ['seafood', 'market', 'fresh', 'sashimi']
  },
  {
    name: 'Haedong Yonggungsa Temple', name_ko: '해동 용궁사', name_id: 'Kuil Haedong Yonggungsa', name_mn: 'Хэдон Ёнгунса сүм',
    desc: 'Unique seaside Buddhist temple perched on a cliff overlooking the East Sea. One of the few temples in Korea situated by the ocean.',
    desc_ko: '동해 절벽 위에 자리한 해안 사찰. 바다를 배경으로 한 사찰은 한국에서도 희귀.',
    desc_id: 'Kuil Buddha tepi laut yang unik di atas tebing menghadap Laut Timur.',
    desc_mn: 'Зүүн тэнгисийн хадан дээр байрлах далайн эргийн Буддын сүм.',
    category: 'attraction', region: 'Busan', lat: 35.1884, lng: 129.2233,
    address: '86 Yonggung-gil, Gijang-gun, Busan', rating: 4.6, featured: false,
    tags: ['temple', 'ocean', 'Buddhist', 'cliff']
  },
  {
    name: 'Gwangalli Beach & Diamond Bridge', name_ko: '광안리 해수욕장 & 광안대교', name_id: 'Pantai Gwangalli & Jembatan Berlian', name_mn: 'Гванганли далайн эрэг & Алмазан гүүр',
    desc: 'Beautiful beach with a stunning view of Gwangandaegyo Bridge lit up at night. Popular spot for cafes, bars, and night views.',
    desc_ko: '광안대교 야경이 아름다운 해변. 카페, 바, 야경 명소로 인기.',
    desc_id: 'Pantai indah dengan pemandangan Jembatan Gwangandaegyo yang menyala di malam hari.',
    desc_mn: 'Шөнийн гэрлээр гэрэлтсэн Гванан гүүрний үзэмж бүхий үзэсгэлэнтэй далайн эрэг.',
    category: 'nature', region: 'Busan', lat: 35.1532, lng: 129.1186,
    address: 'Gwangalli Beach, Suyeong-gu, Busan', rating: 4.5, featured: false,
    tags: ['beach', 'night-view', 'bridge', 'cafes']
  },
  {
    name: 'Taejongdae', name_ko: '태종대', name_id: 'Taejongdae', name_mn: 'Тэжондэ',
    desc: 'Natural park on a cliff with stunning views of the open sea and Oryukdo Islands. Take the Danubi train for a scenic tour.',
    desc_ko: '절벽 위 자연공원. 다누비 열차를 타고 오륙도와 바다 절경을 감상.',
    desc_id: 'Taman alam di tebing dengan pemandangan laut terbuka yang menakjubkan. Naik kereta Danubi untuk tur.',
    desc_mn: 'Хадан дээрх байгалийн цэцэрлэгт хүрээлэн. Данүби галт тэрэгээр тойрч далай, арлыг харна.',
    category: 'nature', region: 'Busan', lat: 35.0516, lng: 129.0850,
    address: '24 Jeonmang-ro, Yeongdo-gu, Busan', rating: 4.5, featured: false,
    tags: ['cliff', 'ocean', 'nature', 'scenic']
  },
  {
    name: 'BIFF Square & Gukje Market', name_ko: 'BIFF광장 & 국제시장', name_id: 'BIFF Square & Pasar Gukje', name_mn: 'BIFF талбай & Гүкже зах',
    desc: 'Busan\'s cultural and market hub. BIFF Square for street food (hotteok, ssiat hotteok) and Gukje Market for local shopping.',
    desc_ko: 'BIFF광장의 씨앗호떡, 국제시장의 쇼핑이 유명한 부산 대표 시장 거리.',
    desc_id: 'Pusat budaya dan pasar Busan. BIFF Square untuk jajanan jalanan dan Pasar Gukje untuk belanja.',
    desc_mn: 'Бусаны соёл, захын төв. BIFF талбайн гудамжны хоол, Гүкже захын дэлгүүр.',
    category: 'food', region: 'Busan', lat: 35.1008, lng: 129.0290,
    address: 'BIFF Square, Jung-gu, Busan', rating: 4.3, featured: false,
    tags: ['market', 'street-food', 'hotteok', 'shopping']
  },

  // === JEJU ===
  {
    name: 'Seongsan Ilchulbong', name_ko: '성산일출봉', name_id: 'Seongsan Ilchulbong', name_mn: 'Сонсан Ильчулбон',
    desc: 'UNESCO World Heritage volcanic crater rising from the sea. Famous for its sunrise views. The hike to the top takes about 30 minutes.',
    desc_ko: 'UNESCO 세계자연유산. 바다에서 솟아오른 화산 분화구. 일출 명소. 정상까지 약 30분.',
    desc_id: 'Kawah vulkanik Warisan Dunia UNESCO yang menjulang dari laut. Terkenal untuk pemandangan matahari terbit.',
    desc_mn: 'ЮНЕСКО-гийн дэлхийн байгалийн өв. Далайгаас дээш сүндэрлэсэн галт уулын тогоо. Нарны мандалт алдартай.',
    category: 'nature', region: 'Jeju', lat: 33.4590, lng: 126.9425,
    address: '284-12 Ilchul-ro, Seogwipo-si, Jeju', rating: 4.7, featured: true,
    tags: ['UNESCO', 'volcano', 'sunrise', 'hiking']
  },
  {
    name: 'Hallasan National Park', name_ko: '한라산국립공원', name_id: 'Taman Nasional Hallasan', name_mn: 'Халласан үндэсний цэцэрлэгт хүрээлэн',
    desc: 'South Korea\'s highest mountain (1,947m). Multiple hiking trails through different ecosystems. Baengnokdam crater lake at the summit.',
    desc_ko: '한국 최고봉(1,947m). 다양한 등산로와 정상의 백록담 분화구 호수가 절경.',
    desc_id: 'Gunung tertinggi di Korea Selatan (1.947m). Danau kawah Baengnokdam di puncak.',
    desc_mn: 'Өмнөд Солонгосын хамгийн өндөр уул (1,947м). Оргил дээрх Бэнноктам тогооны нуур.',
    category: 'nature', region: 'Jeju', lat: 33.3617, lng: 126.5292,
    address: '2070-61 1100-ro, Jeju-si, Jeju', rating: 4.8, featured: true,
    tags: ['mountain', 'hiking', 'national-park', 'crater-lake']
  },
  {
    name: 'Udo Island', name_ko: '우도', name_id: 'Pulau Udo', name_mn: 'Удо арал',
    desc: 'Small island off Jeju\'s coast with turquoise waters and white coral sand. Famous for peanut ice cream and scenic bike rides.',
    desc_ko: '제주 동쪽의 작은 섬. 에메랄드빛 바다, 백사장, 땅콩 아이스크림, 자전거 투어.',
    desc_id: 'Pulau kecil di lepas pantai Jeju dengan air pirus dan pasir karang putih. Terkenal dengan es krim kacang.',
    desc_mn: 'Жежүгийн эрэг дэх жижиг арал. Ногоон далай, цагаан шуурхай элс, самрын зайрмаг алдартай.',
    category: 'nature', region: 'Jeju', lat: 33.5055, lng: 126.9535,
    address: 'Udo-myeon, Jeju-si, Jeju', rating: 4.6, featured: false,
    tags: ['island', 'beach', 'cycling', 'peanut-ice-cream']
  },
  {
    name: 'Hyeopjae Beach', name_ko: '협재 해수욕장', name_id: 'Pantai Hyeopjae', name_mn: 'Хёпже далайн эрэг',
    desc: 'One of Jeju\'s most beautiful beaches with crystal-clear emerald water and white sand. Biyangdo Island visible in the distance.',
    desc_ko: '제주 최고의 에메랄드빛 해변. 비양도를 배경으로 한 아름다운 풍경.',
    desc_id: 'Salah satu pantai terindah di Jeju dengan air zamrud jernih dan pasir putih.',
    desc_mn: 'Жежүгийн хамгийн үзэсгэлэнтэй далайн эрэг. Эмералд ногоон ус, цагаан элс.',
    category: 'nature', region: 'Jeju', lat: 33.3939, lng: 126.2397,
    address: '329-10 Hyeopjae-ri, Hallim-eup, Jeju-si, Jeju', rating: 4.6, featured: false,
    tags: ['beach', 'emerald', 'sand', 'scenic']
  },
  {
    name: 'Osulloc Tea Museum', name_ko: '오설록 티뮤지엄', name_id: 'Museum Teh Osulloc', name_mn: 'Осүллок цайны музей',
    desc: 'Green tea museum surrounded by beautiful tea fields. Free admission. Try the green tea ice cream and browse the tea shop.',
    desc_ko: '아름다운 녹차밭 속 티 뮤지엄. 무료 입장. 녹차 아이스크림과 차 쇼핑이 인기.',
    desc_id: 'Museum teh hijau dikelilingi ladang teh indah. Masuk gratis. Coba es krim teh hijau.',
    desc_mn: 'Үзэсгэлэнтэй цайны талбайн дунд байрлах ногоон цайны музей. Үнэгүй. Ногоон цайны зайрмаг.',
    category: 'cafe', region: 'Jeju', lat: 33.3061, lng: 126.2893,
    address: '15 Sinhwayeoksa-ro, Andeok-myeon, Seogwipo-si, Jeju', rating: 4.4, featured: false,
    tags: ['tea', 'museum', 'free', 'green-tea']
  },
  {
    name: 'Manjanggul Cave', name_ko: '만장굴', name_id: 'Gua Manjanggul', name_mn: 'Манжангүль агуй',
    desc: 'UNESCO World Heritage lava tube cave, one of the longest in the world. The 1km walking course features impressive lava formations.',
    desc_ko: 'UNESCO 세계자연유산. 세계 최장급 용암동굴. 1km 관람코스에서 용암 지형 감상.',
    desc_id: 'Gua tabung lava Warisan Dunia UNESCO, salah satu yang terpanjang di dunia.',
    desc_mn: 'ЮНЕСКО-гийн дэлхийн өв. Дэлхийн хамгийн урт лавын хоолойн агуйн нэг.',
    category: 'nature', region: 'Jeju', lat: 33.5282, lng: 126.7717,
    address: '182 Manjanggul-gil, Gujwa-eup, Jeju-si, Jeju', rating: 4.4, featured: false,
    tags: ['UNESCO', 'cave', 'lava-tube', 'geology']
  },
  {
    name: 'Jeongbang Waterfall', name_ko: '정방폭포', name_id: 'Air Terjun Jeongbang', name_mn: 'Жонбан хүрхрээ',
    desc: 'The only waterfall in Asia that falls directly into the ocean. 23m high cascade with a dramatic cliff backdrop.',
    desc_ko: '아시아에서 유일하게 바다로 직접 떨어지는 폭포. 23m 높이의 절벽 폭포.',
    desc_id: 'Satu-satunya air terjun di Asia yang jatuh langsung ke laut. Tinggi 23m.',
    desc_mn: 'Ази тивд далайд шууд унадаг цорын ганц хүрхрээ. 23м өндөр.',
    category: 'nature', region: 'Jeju', lat: 33.2447, lng: 126.5714,
    address: '37 Chilsimni-ro 214beon-gil, Seogwipo-si, Jeju', rating: 4.3, featured: false,
    tags: ['waterfall', 'ocean', 'nature', 'cliff']
  },

  // === INCHEON ===
  {
    name: 'Incheon Chinatown', name_ko: '인천 차이나타운', name_id: 'Chinatown Incheon', name_mn: 'Инчон Хятадын хороолол',
    desc: 'Korea\'s only official Chinatown. Famous for jajangmyeon (black bean noodles), the dish that originated here. Colorful streets and Chinese-Korean fusion food.',
    desc_ko: '한국 유일의 공식 차이나타운. 자장면 발상지. 중화요리와 이국적 거리.',
    desc_id: 'Satu-satunya Chinatown resmi di Korea. Terkenal dengan jajangmyeon yang berasal dari sini.',
    desc_mn: 'Солонгосын цорын ганц албан ёсны Хятадын хороолол. Жажанмён энд үүссэн.',
    category: 'food', region: 'Incheon', lat: 37.4751, lng: 126.6173,
    address: 'Chinatown-ro, Jung-gu, Incheon', rating: 4.2, featured: false,
    tags: ['Chinatown', 'jajangmyeon', 'Chinese-Korean', 'food-street']
  },
  {
    name: 'Songdo Central Park', name_ko: '송도센트럴파크', name_id: 'Songdo Central Park', name_mn: 'Сондо Төв цэцэрлэгт хүрээлэн',
    desc: 'Futuristic park in Songdo International City with seawater canal. Rent a kayak or take a water taxi surrounded by modern skyscrapers.',
    desc_ko: '송도국제도시의 해수 공원. 카약, 수상택시를 타며 현대적 스카이라인을 감상.',
    desc_id: 'Taman futuristik di Kota Internasional Songdo dengan kanal air laut. Sewa kayak dikelilingi gedung pencakar langit.',
    desc_mn: 'Сондо олон улсын хотод байрлах далайн усны суваг бүхий цэцэрлэгт хүрээлэн.',
    category: 'nature', region: 'Incheon', lat: 37.3917, lng: 126.6608,
    address: '196 Technopark-ro, Yeonsu-gu, Incheon', rating: 4.2, featured: false,
    tags: ['park', 'kayak', 'modern', 'waterfront']
  },
  {
    name: 'Wolmido Island', name_ko: '월미도', name_id: 'Pulau Wolmido', name_mn: 'Вольмидо арал',
    desc: 'Island connected to Incheon with an amusement park, seafood restaurants, and a cultural street. Ride the Disco Pang Pang for a fun time.',
    desc_ko: '놀이공원, 해산물 맛집, 문화의 거리가 있는 인천의 대표 관광지.',
    desc_id: 'Pulau yang terhubung dengan Incheon dengan taman hiburan dan restoran makanan laut.',
    desc_mn: 'Инчонтой холбогдсон арал. Зугаа цэнгэлийн хүрээлэн, далайн хоолны газрууд.',
    category: 'attraction', region: 'Incheon', lat: 37.4756, lng: 126.5980,
    address: 'Wolmi-ro, Jung-gu, Incheon', rating: 4.0, featured: false,
    tags: ['island', 'amusement-park', 'seafood']
  },

  // === GYEONGGI ===
  {
    name: 'DMZ & JSA (Panmunjom)', name_ko: 'DMZ & JSA (판문점)', name_id: 'DMZ & JSA (Panmunjom)', name_mn: 'DMZ & JSA (Панмунжом)',
    desc: 'The Demilitarized Zone between North and South Korea. Join an official tour to visit the JSA, Dora Observatory, and the 3rd Infiltration Tunnel.',
    desc_ko: '남북한 비무장지대. 공식 투어로 JSA, 도라전망대, 제3땅굴을 방문.',
    desc_id: 'Zona Demiliterisasi antara Korea Utara dan Selatan. Ikuti tur resmi untuk mengunjungi JSA.',
    desc_mn: 'Хойд, Өмнөд Солонгосын цэргийн бус бүс. JSA, Дора цамхаг, 3-р нууц хонгилоор аялна.',
    category: 'attraction', region: 'Gyeonggi', lat: 37.9562, lng: 126.6772,
    address: 'Panmunjom, Paju-si, Gyeonggi-do', rating: 4.7, featured: true,
    tags: ['DMZ', 'history', 'tour', 'border']
  },
  {
    name: 'Everland', name_ko: '에버랜드', name_id: 'Everland', name_mn: 'Эверлэнд',
    desc: 'Korea\'s largest theme park with thrilling rides, a zoo, and seasonal festivals. T Express wooden roller coaster is a highlight.',
    desc_ko: '한국 최대 테마파크. T익스프레스 롤러코스터, 동물원, 계절 축제가 인기.',
    desc_id: 'Taman hiburan terbesar Korea dengan wahana seru, kebun binatang, dan festival musiman.',
    desc_mn: 'Солонгосын хамгийн том зугаа цэнгэлийн хүрээлэн. T Express аттракцион, амьтны хүрээлэн.',
    category: 'attraction', region: 'Gyeonggi', lat: 37.2564, lng: 127.2017,
    address: '199 Everland-ro, Pogok-eup, Cheoin-gu, Yongin-si, Gyeonggi-do', rating: 4.4, featured: false,
    tags: ['theme-park', 'rides', 'zoo', 'family']
  },
  {
    name: 'Suwon Hwaseong Fortress', name_ko: '수원화성', name_id: 'Benteng Hwaseong Suwon', name_mn: 'Сувон Хвасон бэхлэлт',
    desc: 'UNESCO World Heritage fortress built in the 18th century. Walk the 5.7km fortress wall for panoramic views. Traditional archery experience available.',
    desc_ko: 'UNESCO 세계문화유산. 5.7km 성곽 둘레길과 전통 활쏘기 체험이 인기.',
    desc_id: 'Benteng Warisan Dunia UNESCO abad ke-18. Jalan di dinding benteng sepanjang 5,7km.',
    desc_mn: '18-р зууны ЮНЕСКО-гийн дэлхийн өв. 5.7км хэрмийн замаар алхах, уламжлалт сур харваа.',
    category: 'attraction', region: 'Gyeonggi', lat: 37.2879, lng: 127.0134,
    address: '320-2 Yeonghwa-dong, Paldal-gu, Suwon-si, Gyeonggi-do', rating: 4.5, featured: false,
    tags: ['UNESCO', 'fortress', 'history', 'archery']
  },
  {
    name: 'Korean Folk Village', name_ko: '한국민속촌', name_id: 'Desa Rakyat Korea', name_mn: 'Солонгосын ардын тосгон',
    desc: 'Living museum recreating traditional Korean village life. Watch folk performances, try traditional crafts, and enjoy seasonal festivals.',
    desc_ko: '전통 한국 마을을 재현한 야외 박물관. 민속공연, 전통체험, 계절 축제.',
    desc_id: 'Museum hidup yang menciptakan kembali kehidupan desa tradisional Korea.',
    desc_mn: 'Солонгосын уламжлалт тосгоны амьдралыг сэргээсэн амьд музей.',
    category: 'attraction', region: 'Gyeonggi', lat: 37.2588, lng: 127.1184,
    address: '90 Minsokchon-ro, Giheung-gu, Yongin-si, Gyeonggi-do', rating: 4.3, featured: false,
    tags: ['traditional', 'museum', 'folk', 'experience']
  },

  // === OTHER REGIONS ===
  {
    name: 'Nami Island', name_ko: '남이섬', name_id: 'Pulau Nami', name_mn: 'Нами арал',
    desc: 'Famous from K-drama "Winter Sonata". Beautiful tree-lined paths that change with seasons. Take the zipline or ferry to reach the island.',
    desc_ko: '드라마 "겨울연가" 촬영지. 계절마다 달라지는 나무길이 아름다운 섬. 짚라인도 인기.',
    desc_id: 'Terkenal dari K-drama "Winter Sonata". Jalanan berjajar pohon yang berubah setiap musim.',
    desc_mn: '"Өвлийн сонат" драмын зураг авалтын газар. Улирал бүр өөрчлөгддөг модон замтай үзэсгэлэнтэй арал.',
    category: 'nature', region: 'Other', lat: 37.7910, lng: 127.5256,
    address: '1 Namisum-gil, Namsan-myeon, Chuncheon-si, Gangwon-do', rating: 4.5, featured: true,
    tags: ['island', 'K-drama', 'seasonal', 'nature']
  },
  {
    name: 'Gyeongju Historic Areas', name_ko: '경주 역사유적지구', name_id: 'Area Bersejarah Gyeongju', name_mn: 'Гёнжү түүхийн дурсгалт газар',
    desc: 'UNESCO World Heritage site, the "museum without walls". Ancient capital of the Silla Kingdom with royal tombs, Bulguksa Temple, and Cheomseongdae.',
    desc_ko: '벽 없는 박물관. 신라 천년 수도. 불국사, 첨성대, 왕릉 등 UNESCO 유산 다수.',
    desc_id: 'Situs Warisan Dunia UNESCO, "museum tanpa dinding". Ibukota kuno Kerajaan Silla.',
    desc_mn: '"Хананы музей" ЮНЕСКО-гийн дэлхийн өв. Шилла хаант улсын эртний нийслэл.',
    category: 'attraction', region: 'Other', lat: 35.8346, lng: 129.2191,
    address: 'Gyeongju-si, Gyeongsangbuk-do', rating: 4.7, featured: true,
    tags: ['UNESCO', 'history', 'Silla', 'ancient']
  },
  {
    name: 'Jeonju Hanok Village', name_ko: '전주한옥마을', name_id: 'Desa Hanok Jeonju', name_mn: 'Жоnju Ханок тосгон',
    desc: 'Over 700 traditional hanok houses. Famous for bibimbap, choco pie, and hanbok rental. A top destination for Korean food and culture.',
    desc_ko: '700여 채 한옥이 모인 전통마을. 전주비빔밥, 초코파이, 한복체험이 유명.',
    desc_id: 'Lebih dari 700 rumah hanok tradisional. Terkenal dengan bibimbap dan penyewaan hanbok.',
    desc_mn: '700 гаруй ханок бүхий уламжлалт тосгон. Бибимбаб, ханбок түрээс алдартай.',
    category: 'attraction', region: 'Other', lat: 35.8151, lng: 127.1520,
    address: '99 Girin-daero, Wansan-gu, Jeonju-si, Jeollabuk-do', rating: 4.5, featured: false,
    tags: ['hanok', 'bibimbap', 'hanbok', 'traditional']
  },
  {
    name: 'Boseong Green Tea Fields', name_ko: '보성 녹차밭', name_id: 'Ladang Teh Hijau Boseong', name_mn: 'Босон ногоон цайны талбай',
    desc: 'Stunning terraced green tea plantations in the south. The Daehan Dawon plantation is the most famous. Green tea foot bath and ice cream available.',
    desc_ko: '남도의 아름다운 계단식 녹차밭. 대한다원이 대표적. 녹차 족욕, 아이스크림 인기.',
    desc_id: 'Perkebunan teh hijau berteras yang menakjubkan di selatan. Pemandian kaki teh hijau dan es krim tersedia.',
    desc_mn: 'Өмнөд бүсийн гайхалтай шатлалт ногоон цайны талбай. Ногоон цайны хөлний бассейн, зайрмаг.',
    category: 'nature', region: 'Other', lat: 34.7697, lng: 127.0803,
    address: '763-67 Nokcha-ro, Boseong-eup, Boseong-gun, Jeollanam-do', rating: 4.5, featured: false,
    tags: ['tea', 'green-tea', 'plantation', 'scenic']
  },
  {
    name: 'Sokcho & Seoraksan', name_ko: '속초 & 설악산', name_id: 'Sokcho & Seoraksan', name_mn: 'Сокчо & Сорагсан',
    desc: 'Gateway to Seoraksan National Park. Take the cable car for stunning mountain views. Sokcho offers fresh seafood markets and Abai Village.',
    desc_ko: '설악산 국립공원의 관문. 케이블카로 설악산 절경 감상. 속초 수산시장, 아바이마을 유명.',
    desc_id: 'Gerbang ke Taman Nasional Seoraksan. Naik kereta gantung untuk pemandangan gunung. Pasar makanan laut Sokcho.',
    desc_mn: 'Сорагсан үндэсний цэцэрлэгт хүрээлэнгийн үүд. Кабель карт суугаад уулын үзэмж харна.',
    category: 'nature', region: 'Other', lat: 38.1694, lng: 128.5619,
    address: 'Seorak-dong, Sokcho-si, Gangwon-do', rating: 4.7, featured: false,
    tags: ['mountain', 'national-park', 'cable-car', 'seafood']
  },
  {
    name: 'Yeosu Night Sea', name_ko: '여수 밤바다', name_id: 'Laut Malam Yeosu', name_mn: 'Ёсү шөнийн далай',
    desc: 'Famous from the hit song "Yeosu Night Sea" by Busker Busker. Enjoy the romantic harbor night view, cable car over the ocean, and fresh seafood.',
    desc_ko: '버스커버스커의 "여수 밤바다"로 유명. 항구 야경, 해상 케이블카, 해산물 맛집.',
    desc_id: 'Terkenal dari lagu hit "Yeosu Night Sea". Pemandangan pelabuhan romantis dan kereta gantung di atas laut.',
    desc_mn: '"Ёсү шөнийн далай" дуугаараа алдартай. Боомтын шөнийн үзэмж, далайн дээгүүр кабель кар.',
    category: 'nature', region: 'Other', lat: 34.7397, lng: 127.7406,
    address: 'Yeosu-si, Jeollanam-do', rating: 4.5, featured: false,
    tags: ['night-view', 'cable-car', 'harbor', 'seafood']
  },
  {
    name: 'Andong Hahoe Village', name_ko: '안동 하회마을', name_id: 'Desa Hahoe Andong', name_mn: 'Андон Хахөэ тосгон',
    desc: 'UNESCO World Heritage village preserving 600 years of Joseon-era tradition. Famous for mask dance performance and traditional clan houses.',
    desc_ko: 'UNESCO 세계문화유산. 600년 전통의 조선시대 마을. 하회별신굿탈놀이가 유명.',
    desc_id: 'Desa Warisan Dunia UNESCO yang melestarikan 600 tahun tradisi era Joseon. Tarian topeng terkenal.',
    desc_mn: 'ЮНЕСКО-гийн дэлхийн өв. 600 жилийн Жусон гүрний уламжлалыг хадгалсан тосгон. Багт бүжиг алдартай.',
    category: 'attraction', region: 'Other', lat: 36.5397, lng: 128.5168,
    address: '40 Hahoe-ri, Pungcheon-myeon, Andong-si, Gyeongsangbuk-do', rating: 4.5, featured: false,
    tags: ['UNESCO', 'traditional', 'mask-dance', 'village']
  },
];

module.exports = async function handler(req, res) {
  // Simple auth check
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

    // Rate limit: Notion API allows ~3 requests/sec
    await new Promise(function(resolve) { setTimeout(resolve, 350); });
  }

  res.status(200).json({
    total: SPOTS.length,
    success,
    failed,
    results
  });
};
