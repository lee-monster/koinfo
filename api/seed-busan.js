// One-time script: Seed Busan spots into Notion TravelKo DB
// Run via: https://koinfo.kr/api/seed-busan?key=YOUR_SECRET
const { Client } = require('@notionhq/client');

const SPOTS = [
  {
    name: "Haeundae Beach",
    name_ko: "해운대해수욕장",
    name_id: "Pantai Haeundae",
    name_mn: "Хэундэ далайн эрэг",
    desc: "Busan's most famous beach stretching 1.5km with white sand, drawing over 10 million visitors annually. A hub for water sports, festivals, and vibrant beachside nightlife.",
    desc_ko: "부산에서 가장 유명한 1.5km 길이의 백사장 해변으로, 연간 천만 명 이상이 방문합니다. 수상스포츠, 축제, 해변 야경으로 유명합니다.",
    desc_id: "Pantai paling terkenal di Busan dengan pasir putih sepanjang 1,5km yang dikunjungi lebih dari 10 juta wisatawan setiap tahun. Pusat olahraga air, festival, dan kehidupan malam tepi pantai.",
    desc_mn: "Бусаны хамгийн алдартай 1.5 км урт цагаан элсэн далайн эрэг бөгөөд жил бүр 10 сая гаруй хүн зочилдог. Усан спорт, баяр наадам, далайн эргийн шөнийн амьдралаараа алдартай.",
    category: "nature", region: "Haeundae", lat: 35.1587, lng: 129.1604,
    address: "부산광역시 해운대구 해운대해변로 264", featured: true
  },
  {
    name: "Gwangalli Beach",
    name_ko: "광안리해수욕장",
    name_id: "Pantai Gwangalli",
    name_mn: "Гванъалли далайн эрэг",
    desc: "A 1.4km sandy beach famous for stunning night views of the illuminated Gwangan Bridge. Popular for seaside bars, cafes, and live music events.",
    desc_ko: "광안대교의 화려한 야경으로 유명한 1.4km 모래사장 해변입니다. 해변가 바, 카페, 라이브 음악 이벤트로 인기 있습니다.",
    desc_id: "Pantai berpasir sepanjang 1,4km yang terkenal dengan pemandangan malam Jembatan Gwangan yang menakjubkan. Populer untuk bar tepi laut, kafe, dan acara musik live.",
    desc_mn: "Гэрэлтүүлэгтэй Гванъан гүүрний шөнийн гайхалтай үзэмжээр алдартай 1.4 км элсэн эрэг. Далайн эргийн бар, кафе, амьд хөгжмийн арга хэмжээгээр алдартай.",
    category: "nature", region: "Gwangalli", lat: 35.1532, lng: 129.1187,
    address: "부산광역시 수영구 광안해변로 219", featured: true
  },
  {
    name: "Gamcheon Culture Village",
    name_ko: "감천문화마을",
    name_id: "Desa Budaya Gamcheon",
    name_mn: "Гамчон соёлын тосгон",
    desc: "Known as the 'Machu Picchu of Busan,' this hillside village features colorful houses, winding alleys, murals, and art installations. A top Instagram spot in Busan.",
    desc_ko: "'부산의 마추픽추'로 불리는 산비탈 마을로, 알록달록한 집들과 골목, 벽화, 예술 작품이 가득합니다. 부산 최고의 인스타그램 명소입니다.",
    desc_id: "Dikenal sebagai 'Machu Picchu-nya Busan,' desa di lereng bukit ini memiliki rumah-rumah berwarna-warni, gang-gang berliku, mural, dan instalasi seni. Spot Instagram terpopuler di Busan.",
    desc_mn: "\"Бусаны Мачу Пикчу\" гэж нэрлэгддэг уулын энгэрийн тосгон бөгөөд өнгөлөг байшин, нарийн гудамж, ханын зураг, урлагийн бүтээлүүдээр дүүрэн. Бусаны хамгийн алдартай Instagram-ийн газар.",
    category: "attraction", region: "Gamcheon", lat: 35.0975, lng: 129.0108,
    address: "부산광역시 사하구 감내2로 203", featured: true
  },
  {
    name: "Haedong Yonggungsa Temple",
    name_ko: "해동용궁사",
    name_id: "Kuil Haedong Yonggungsa",
    name_mn: "Хэдон Ёнгунса сүм",
    desc: "A stunning seaside Buddhist temple perched on cliffs overlooking the East Sea. One of Korea's few ocean-side temples, offering breathtaking views especially at sunrise.",
    desc_ko: "동해를 바라보는 절벽 위에 자리한 아름다운 해변 사찰입니다. 한국에서 몇 안 되는 해변 사찰로, 특히 일출 때 장관을 이룹니다.",
    desc_id: "Kuil Buddha yang menakjubkan di tebing menghadap Laut Timur. Salah satu dari sedikit kuil tepi laut di Korea, menawarkan pemandangan luar biasa terutama saat matahari terbit.",
    desc_mn: "Зүүн тэнгисийг харсан хадан дээр байрлах гайхалтай далайн эргийн Буддын сүм. Солонгосын цөөхөн далайн эргийн сүмийн нэг бөгөөд ялангуяа нар мандахад гайхалтай үзэмжтэй.",
    category: "attraction", region: "Gijang", lat: 35.1884, lng: 129.2233,
    address: "부산광역시 기장군 기장읍 용궁길 86", featured: true
  },
  {
    name: "Jagalchi Fish Market",
    name_ko: "자갈치시장",
    name_id: "Pasar Ikan Jagalchi",
    name_mn: "Жагалчи загасны зах",
    desc: "Korea's largest seafood market where you can pick live seafood and have it prepared on the spot. An iconic Busan experience with incredible fresh sashimi and grilled fish.",
    desc_ko: "한국 최대의 수산시장으로, 살아있는 해산물을 골라 바로 조리해 먹을 수 있습니다. 신선한 회와 구이를 즐길 수 있는 부산의 상징적인 명소입니다.",
    desc_id: "Pasar makanan laut terbesar di Korea di mana Anda bisa memilih seafood hidup dan langsung dimasak di tempat. Pengalaman ikonik Busan dengan sashimi segar dan ikan bakar.",
    desc_mn: "Солонгосын хамгийн том далайн хүнсний зах бөгөөд амьд далайн хүнс сонгон газар дээр нь бэлтгүүлж болно. Шинэхэн сашими, шарсан загастай Бусаны бэлгэ тэмдэг газар.",
    category: "food", region: "Nampo-dong", lat: 35.0913, lng: 129.0307,
    address: "부산광역시 중구 자갈치해안로 52", featured: true
  },
  {
    name: "Gukje Market",
    name_ko: "국제시장",
    name_id: "Pasar Gukje",
    name_mn: "Гүкжэ зах",
    desc: "Busan's largest traditional market spanning several blocks, selling everything from street food to clothing and souvenirs. Famous for bindaetteok and hotteok.",
    desc_ko: "부산 최대의 전통시장으로 길거리 음식부터 의류, 기념품까지 다양한 상품을 판매합니다. 빈대떡과 호떡으로 유명합니다.",
    desc_id: "Pasar tradisional terbesar di Busan yang membentang beberapa blok, menjual segalanya dari jajanan kaki lima hingga pakaian dan oleh-oleh. Terkenal dengan bindaetteok dan hotteok.",
    desc_mn: "Бусаны хамгийн том уламжлалт зах бөгөөд гудамжны хоолноос хувцас, бэлэг дурсгалын зүйл хүртэл бүх зүйлийг зардаг. Биндэтток, хоттог-оор алдартай.",
    category: "shopping", region: "Nampo-dong", lat: 35.1002, lng: 129.0288,
    address: "부산광역시 중구 국제시장2길 25"
  },
  {
    name: "BIFF Square",
    name_ko: "BIFF 광장",
    name_id: "BIFF Square",
    name_mn: "BIFF талбай",
    desc: "A famous street named after the Busan International Film Festival, lined with street food stalls serving hotteok, tteokbokki, and ssiat hotteok.",
    desc_ko: "부산국제영화제의 이름을 딴 유명한 거리로, 호떡, 떡볶이, 씨앗호떡 등 다양한 길거리 음식 노점이 줄지어 있습니다.",
    desc_id: "Jalan terkenal yang dinamai Festival Film Internasional Busan, dipenuhi warung jajanan yang menjual hotteok, tteokbokki, dan ssiat hotteok.",
    desc_mn: "Бусаны олон улсын кино наадмын нэрээр нэрлэгдсэн алдартай гудамж бөгөөд хоттог, ттогбокки, ссиат хоттог зэрэг гудамжны хоолны лангуудаар дүүрэн.",
    category: "food", region: "Nampo-dong", lat: 35.0989, lng: 129.0292,
    address: "부산광역시 중구 비프광장로 36"
  },
  {
    name: "Haeundae Obok Dwaeji Gukbap",
    name_ko: "해운대 오복돼지국밥",
    name_id: "Haeundae Obok Dwaeji Gukbap",
    name_mn: "Хэундэ Обок Двэжи Гукбаб",
    desc: "A 24-hour pork soup rice restaurant near Haeundae Station, famous among locals and tourists for its rich, milky pork bone broth. A must-try Busan comfort food.",
    desc_ko: "해운대역 근처 24시간 영업하는 돼지국밥 전문점으로, 진하고 구수한 돼지 뼈 국물로 현지인과 관광객 모두에게 사랑받습니다.",
    desc_id: "Restoran sup babi 24 jam dekat Stasiun Haeundae, terkenal di kalangan lokal dan turis karena kaldu tulang babi yang kaya dan gurih. Makanan khas Busan yang wajib dicoba.",
    desc_mn: "Хэундэ станцын ойролцоох 24 цагийн гахайн шөлтэй будаа зоогийн газар. Өтгөн, тэжээллэг гахайн ясны шөлөөрөө орон нутгийн болон жуулчдын дунд алдартай.",
    category: "food", region: "Haeundae", lat: 35.1629, lng: 129.1638,
    address: "부산광역시 해운대구 구남로 15"
  },
  {
    name: "Millak Raw Fish Center",
    name_ko: "민락회센터",
    name_id: "Millak Raw Fish Center",
    name_mn: "Миллак түүхий загасны төв",
    desc: "A multi-story seafood building at the end of Gwangalli Beach where you can buy fresh sashimi downstairs and eat it with ocean views upstairs. Best enjoyed at sunset.",
    desc_ko: "광안리 해변 끝에 위치한 다층 수산물 건물로, 1층에서 신선한 회를 구매해 윗층에서 바다를 보며 즐길 수 있습니다. 일몰 때 최고입니다.",
    desc_id: "Gedung seafood bertingkat di ujung Pantai Gwangalli di mana Anda bisa membeli sashimi segar di lantai bawah dan memakannya sambil menikmati pemandangan laut di lantai atas.",
    desc_mn: "Гванъалли далайн эргийн төгсгөлд байрлах олон давхар далайн хүнсний барилга. Доод давхраас шинэхэн сашими худалдаж аваад дээд давхарт далайн үзэмжийг харан зооглох боломжтой.",
    category: "food", region: "Gwangalli", lat: 35.1536, lng: 129.1246,
    address: "부산광역시 수영구 광안해변로 312번길 60"
  },
  {
    name: "Taejongdae Resort Park",
    name_ko: "태종대유원지",
    name_id: "Taman Resor Taejongdae",
    name_mn: "Тэжондэ амралтын цэцэрлэгт хүрээлэн",
    desc: "A stunning natural park on Yeongdo Island featuring dramatic coastal cliffs, a lighthouse, and panoramic ocean views. Take the Danubi Train or walk the scenic trails.",
    desc_ko: "영도에 위치한 아름다운 자연공원으로, 해안 절벽, 등대, 탁 트인 바다 전망이 일품입니다. 다누비열차를 타거나 산책로를 걸을 수 있습니다.",
    desc_id: "Taman alam yang menakjubkan di Pulau Yeongdo dengan tebing pantai yang dramatis, mercusuar, dan pemandangan laut panoramik. Naik Kereta Danubi atau jalan kaki menikmati jalur pemandangan.",
    desc_mn: "Ёндо аралд байрлах гайхалтай байгалийн цэцэрлэгт хүрээлэн бөгөөд далайн эргийн хад, гэрэлт цамхаг, далайн өргөн үзэмжтэй. Дануби галт тэрэг унаж эсвэл явган аялах боломжтой.",
    category: "nature", region: "Yeongdo", lat: 35.0519, lng: 129.0847,
    address: "부산광역시 영도구 전망로 24"
  },
  {
    name: "Igidae Coastal Trail",
    name_ko: "이기대 해안산책로",
    name_id: "Jalur Pesisir Igidae",
    name_mn: "Игидэ эргийн зам",
    desc: "A stunning 4.7km coastal walking trail with ocean views, suspension bridges, and the Oryukdo Skywalk glass platform. One of Busan's best free outdoor experiences.",
    desc_ko: "바다 전망, 출렁다리, 오륙도 스카이워크 유리 전망대가 있는 4.7km 해안 산책로입니다. 부산 최고의 무료 야외 체험 중 하나입니다.",
    desc_id: "Jalur jalan kaki pesisir sepanjang 4,7km yang menakjubkan dengan pemandangan laut, jembatan gantung, dan platform kaca Oryukdo Skywalk. Salah satu pengalaman outdoor gratis terbaik di Busan.",
    desc_mn: "Далайн үзэмж, дүүжин гүүр, Орюкдо Скайуок шилэн тавцантай 4.7 км-ийн гайхалтай эргийн зам. Бусаны хамгийн сайн үнэгүй гадаа үйл ажиллагааны нэг.",
    category: "nature", region: "Nam-gu", lat: 35.1136, lng: 129.1213,
    address: "부산광역시 남구 이기대공원로 105-20"
  },
  {
    name: "Haeundae Blueline Park Sky Capsule",
    name_ko: "해운대 블루라인파크 스카이캡슐",
    name_id: "Sky Capsule Blueline Park Haeundae",
    name_mn: "Хэундэ Блүлайн Парк Скай Капсул",
    desc: "A colorful four-seater capsule train running 2km along the coast from Mipo to Cheongsapo. One of the most viral TikTok attractions in Korea.",
    desc_ko: "미포에서 청사포까지 해안을 따라 2km를 달리는 4인승 캡슐열차입니다. 한국에서 가장 바이럴한 틱톡 명소 중 하나입니다.",
    desc_id: "Kereta kapsul 4 penumpang berwarna-warni yang berjalan 2km di sepanjang pantai dari Mipo ke Cheongsapo. Salah satu atraksi TikTok paling viral di Korea.",
    desc_mn: "Мипо-оос Чонсапо хүртэл далайн эргийн дагуу 2 км явдаг 4 суудалтай өнгөлөг капсул галт тэрэг. Солонгос дахь хамгийн алдартай TikTok үзвэрүүдийн нэг.",
    category: "attraction", region: "Haeundae", lat: 35.1631, lng: 129.1755,
    address: "부산광역시 해운대구 달맞이길 62번길 13", featured: true
  },
  {
    name: "Waveon Coffee",
    name_ko: "웨이브온커피",
    name_id: "Waveon Coffee",
    name_mn: "Waveon Coffee",
    desc: "An award-winning architectural cafe right on the ocean in Gijang, with floor-to-ceiling windows and a rooftop terrace offering dramatic wave views.",
    desc_ko: "기장 바닷가에 위치한 건축상 수상 카페로, 통유리와 옥상 테라스에서 파도치는 바다를 감상할 수 있습니다.",
    desc_id: "Kafe berarsitektur pemenang penghargaan tepat di tepi laut Gijang, dengan jendela lantai-ke-langit-langit dan teras atap yang menawarkan pemandangan ombak yang dramatis.",
    desc_mn: "Гижан далайн эрэг дээр байрлах архитектурын шагналт кафе бөгөөд шалнаас тааз хүртэлх цонх, дээвэр дээрх террасаас давалгааны гайхалтай үзэмжтэй.",
    category: "cafe", region: "Gijang", lat: 35.2411, lng: 129.2274,
    address: "부산광역시 기장군 장안읍 해맞이로 286"
  },
  {
    name: "Edge 993",
    name_ko: "엣지993",
    name_id: "Edge 993",
    name_mn: "Edge 993",
    desc: "A rooftop cafe in Haeundae Mipo area with unblocked panoramic ocean views stretching from the Blueline Park coast to Haeundae Beach. Best sunset viewing spot.",
    desc_ko: "해운대 미포 지역의 루프탑 카페로, 블루라인파크 해안부터 해운대 해변까지 막힘 없는 파노라마 오션뷰를 자랑합니다. 최고의 일몰 감상 포인트입니다.",
    desc_id: "Kafe rooftop di area Haeundae Mipo dengan pemandangan laut panoramik tanpa halangan dari pantai Blueline Park hingga Pantai Haeundae. Tempat terbaik menikmati matahari terbenam.",
    desc_mn: "Хэундэ Мипо бүсэд байрлах дээвэр кафе бөгөөд Блүлайн Парк эргээс Хэундэ далайн эрэг хүртэл саадгүй панорам далайн үзэмжтэй. Нар жаргах шилдэг цэг.",
    category: "cafe", region: "Haeundae", lat: 35.1613, lng: 129.1764,
    address: "부산광역시 해운대구 달맞이길 62번길 78"
  },
  {
    name: "Jeonpo Cafe Street",
    name_ko: "전포카페거리",
    name_id: "Jalan Kafe Jeonpo",
    name_mn: "Жонпо кафены гудамж",
    desc: "A trendy neighborhood in Seomyeon packed with unique specialty coffee shops, bakeries, dessert cafes, and craft beer bars.",
    desc_ko: "서면의 트렌디한 거리로, 개성 있는 스페셜티 커피숍, 베이커리, 디저트 카페, 크래프트 맥주 바가 밀집해 있습니다.",
    desc_id: "Kawasan trendi di Seomyeon yang dipenuhi kedai kopi spesial unik, bakeri, kafe dessert, dan bar bir craft.",
    desc_mn: "Сөмён дахь загварлаг хороолол бөгөөд өвөрмөц кофе шоп, нарийн боов, бэлтгэсэн кафе, крафт шар айргийн бараар дүүрэн.",
    category: "cafe", region: "Seomyeon", lat: 35.1539, lng: 129.0625,
    address: "부산광역시 부산진구 동천로 92"
  },
  {
    name: "Shinsegae Centum City",
    name_ko: "신세계 센텀시티",
    name_id: "Shinsegae Centum City",
    name_mn: "Шинсэгэ Сентум Сити",
    desc: "The world's largest department store (Guinness record), featuring luxury brands, a spa, ice rink, cinema, and rooftop garden.",
    desc_ko: "기네스북에 등재된 세계 최대 백화점으로, 명품 브랜드, 스파, 아이스링크, 영화관, 옥상정원을 갖추고 있습니다.",
    desc_id: "Department store terbesar di dunia (rekor Guinness), dengan merek mewah, spa, arena ice skating, bioskop, dan taman atap.",
    desc_mn: "Дэлхийн хамгийн том их дэлгүүр (Гиннесийн рекорд) бөгөөд тансаг брэнд, спа, мөсний талбай, кино театр, дээвэр дээрх цэцэрлэгтэй.",
    category: "shopping", region: "Haeundae", lat: 35.1692, lng: 129.1318,
    address: "부산광역시 해운대구 센텀남대로 35"
  },
  {
    name: "Gwangbok-ro Fashion Street",
    name_ko: "광복로 패션거리",
    name_id: "Jalan Mode Gwangbok-ro",
    name_mn: "Гвангбок-ро загварын гудамж",
    desc: "Busan's version of Myeongdong, a bustling pedestrian shopping street with K-beauty stores, fashion boutiques, and street food vendors near Nampo-dong.",
    desc_ko: "'부산의 명동'으로 불리는 번화한 보행자 쇼핑 거리로, K-뷰티 매장, 패션 부티크, 길거리 음식 가판대가 남포동 근처에 밀집해 있습니다.",
    desc_id: "Versi Busan dari Myeongdong, jalan belanja pejalan kaki yang ramai dengan toko K-beauty, butik fashion, dan pedagang jajanan di dekat Nampo-dong.",
    desc_mn: "Бусаны Мёндон хувилбар бөгөөд K-beauty дэлгүүр, загварын бутик, гудамжны хоолны худалдаачидтай Намподонгийн ойролцоох хөл явагчдын худалдааны гудамж.",
    category: "shopping", region: "Nampo-dong", lat: 35.0987, lng: 129.0315,
    address: "부산광역시 중구 광복로 62"
  },
  {
    name: "Beomeosa Temple",
    name_ko: "범어사",
    name_id: "Kuil Beomeosa",
    name_mn: "Бомоса сүм",
    desc: "A serene 1,300-year-old Buddhist temple nestled in the forested foothills of Geumjeongsan Mountain. Known for beautiful autumn foliage and traditional architecture.",
    desc_ko: "금정산 기슭 숲속에 자리한 1,300년 역사의 고요한 사찰입니다. 아름다운 단풍과 전통 건축물로 유명합니다.",
    desc_id: "Kuil Buddha berusia 1.300 tahun yang tenang di kaki Gunung Geumjeongsan. Terkenal dengan dedaunan musim gugur yang indah dan arsitektur tradisional.",
    desc_mn: "Гымжонсан уулын ойт бэлд байрлах 1,300 жилийн түүхтэй тайван Буддын сүм. Намрын гоё навчис, уламжлалт архитектураараа алдартай.",
    category: "attraction", region: "Geumjeong", lat: 35.2836, lng: 129.0668,
    address: "부산광역시 금정구 범어사로 250"
  },
  {
    name: "Songjeong Beach",
    name_ko: "송정해수욕장",
    name_id: "Pantai Songjeong",
    name_mn: "Сонжон далайн эрэг",
    desc: "A quieter beach popular with surfers and locals. Known for its laid-back vibe, cute cafes along the shore, and the best surfing waves in Busan.",
    desc_ko: "서퍼와 현지인들에게 인기 있는 조용하고 여유로운 해변입니다. 느긋한 분위기, 해변가 카페, 부산 최고의 서핑 파도로 유명합니다.",
    desc_id: "Pantai yang lebih tenang, populer di kalangan peselancar dan warga lokal. Dikenal dengan suasana santai, kafe-kafe lucu, dan ombak surfing terbaik di Busan.",
    desc_mn: "Сёрфчид болон орон нутгийн хүмүүсийн дунд алдартай тайван далайн эрэг. Тайван уур амьсгал, эрэг дагуу кафенууд, Бусаны хамгийн сайн серфингийн давалгаагаар алдартай.",
    category: "nature", region: "Songjeong", lat: 35.1786, lng: 129.1990,
    address: "부산광역시 해운대구 송정해변로 62"
  },
  {
    name: "Busan Tower (Yongdusan Park)",
    name_ko: "부산타워 (용두산공원)",
    name_id: "Menara Busan (Taman Yongdusan)",
    name_mn: "Бусан цамхаг (Ёндусан цэцэрлэгт хүрээлэн)",
    desc: "A 120m observation tower offering 360-degree panoramic views of Busan's harbor, Yeongdo Island, and the city skyline. Beautiful at night with illuminations.",
    desc_ko: "용두산공원에 위치한 120m 전망탑으로, 부산항, 영도, 도시 스카이라인을 360도로 조망할 수 있습니다. 야간 조명이 아름답습니다.",
    desc_id: "Menara observasi 120m yang menawarkan pemandangan panoramik 360 derajat pelabuhan Busan, Pulau Yeongdo, dan cakrawala kota. Indah di malam hari.",
    desc_mn: "Бусаны боомт, Ёндо арал, хотын тэнгэрийн шугамыг 360 градусаар харуулах 120 м-ийн ажиглалтын цамхаг. Шөнийн гэрэлтүүлэг үзэсгэлэнтэй.",
    category: "attraction", region: "Nampo-dong", lat: 35.1010, lng: 129.0325,
    address: "부산광역시 중구 용두산길 37-55"
  },
  {
    name: "Songdo Cable Car",
    name_ko: "송도 해상케이블카",
    name_id: "Kereta Gantung Songdo",
    name_mn: "Сондо далайн кабель машин",
    desc: "Korea's first ocean cable car offering spectacular aerial views over Songdo Beach and the sea. Features both regular and crystal (glass-floor) cabins.",
    desc_ko: "송도 해변과 바다 위를 지나는 한국 최초의 해상 케이블카입니다. 일반 캐빈과 바닥이 투명한 크리스탈 캐빈이 있습니다.",
    desc_id: "Kereta gantung laut pertama di Korea yang menawarkan pemandangan udara spektakuler di atas Pantai Songdo dan laut. Tersedia kabin reguler dan kabin kristal (lantai kaca).",
    desc_mn: "Сондо далайн эрэг, тэнгис дээгүүр дамжин өнгөрдөг Солонгосын анхны далайн кабель машин. Энгийн болон шилэн шалтай кристалл бүхээг хоёулаа байдаг.",
    category: "attraction", region: "Songdo", lat: 35.0754, lng: 129.0168,
    address: "부산광역시 서구 송도해변로 171"
  },
  {
    name: "Choryang Milmyeon Street (Gaemijip)",
    name_ko: "초량밀면거리 (개미집)",
    name_id: "Jalan Milmyeon Choryang (Gaemijip)",
    name_mn: "Чорян Мильмён гудамж (Гэмижиб)",
    desc: "The birthplace of Busan's signature cold wheat noodles (milmyeon). Gaemijip is the most famous restaurant here, serving chewy noodles in icy broth since 1973.",
    desc_ko: "부산의 대표 음식 밀면의 발상지입니다. 개미집은 1973년부터 쫄깃한 면을 차가운 육수에 내놓는 가장 유명한 밀면 맛집입니다.",
    desc_id: "Tempat lahir mi gandum dingin khas Busan (milmyeon). Gaemijip adalah restoran paling terkenal di sini, menyajikan mi kenyal dalam kuah es sejak 1973.",
    desc_mn: "Бусаны бэлгэдэл хүйтэн улаан буудайн гоймон (мильмён)-ий төрсөн газар. Гэмижиб бол 1973 оноос хойш хүйтэн шөлтэй уян гоймон үйлчилдэг хамгийн алдартай зоогийн газар.",
    category: "food", region: "Choryang", lat: 35.1141, lng: 129.0411,
    address: "부산광역시 동구 중앙대로 259번길 37"
  },
  {
    name: "Fuzzy Navel Gwangalli",
    name_ko: "퍼지네이블 광안점",
    name_id: "Fuzzy Navel Gwangalli",
    name_mn: "Fuzzy Navel Гванъалли",
    desc: "A beloved foreigner-friendly bar on Gwangalli Beach serving cocktails, Mexican food, and craft beer. Known for its chill vibe, ocean views, and international crowd.",
    desc_ko: "광안리 해변의 외국인 친화적인 바로, 칵테일, 멕시칸 음식, 크래프트 맥주를 제공합니다. 편안한 분위기, 바다 전망, 다국적 손님으로 유명합니다.",
    desc_id: "Bar ramah turis di Pantai Gwangalli yang menyajikan koktail, makanan Meksiko, dan bir craft. Dikenal dengan suasana santai, pemandangan laut, dan pengunjung internasional.",
    desc_mn: "Гванъалли далайн эрэг дэх гадаадын жуулчдад ээлтэй бар бөгөөд коктейль, Мексикийн хоол, крафт шар айраг үйлчилдэг. Тайван уур амьсгал, далайн үзэмжтэй.",
    category: "nightlife", region: "Gwangalli", lat: 35.1538, lng: 129.1185,
    address: "부산광역시 수영구 광안해변로 177"
  },
  {
    name: "The Basement (Seomyeon)",
    name_ko: "더 베이스먼트",
    name_id: "The Basement",
    name_mn: "The Basement",
    desc: "A popular underground bar in Seomyeon known for live music, DJ nights, and a welcoming mix of locals and expats. The go-to spot for Busan's international nightlife scene.",
    desc_ko: "서면의 인기 지하 바로, 라이브 음악, DJ 나이트로 유명하며 현지인과 외국인이 어우러지는 부산 국제 나이트라이프의 중심지입니다.",
    desc_id: "Bar bawah tanah populer di Seomyeon yang dikenal dengan musik live, DJ night, dan campuran ramah antara penduduk lokal dan ekspatriat. Pusat kehidupan malam internasional Busan.",
    desc_mn: "Сөмёнд байрлах алдартай газрын доорх бар бөгөөд амьд хөгжим, DJ шөнөөрөө алдартай. Орон нутгийн болон гадаадын хүмүүс холилддог Бусаны олон улсын шөнийн амьдралын төв.",
    category: "nightlife", region: "Seomyeon", lat: 35.1555, lng: 129.0590,
    address: "부산광역시 부산진구 중앙대로 680번가길 12"
  },
  {
    name: "Lotte World Adventure Busan",
    name_ko: "롯데월드 어드벤처 부산",
    name_id: "Lotte World Adventure Busan",
    name_mn: "Лоттэ Ворлд Адвенчер Бусан",
    desc: "Busan's largest theme park with six themed zones, thrilling rides, parades, and a fairytale castle. A full-day attraction for families and groups.",
    desc_ko: "부산 최대 테마파크로, 6개 테마존, 스릴 넘치는 놀이기구, 퍼레이드, 동화 속 성이 있습니다. 가족과 그룹을 위한 종일 즐길 수 있는 명소입니다.",
    desc_id: "Taman hiburan terbesar di Busan dengan enam zona bertema, wahana seru, parade, dan istana dongeng. Atraksi seharian untuk keluarga dan rombongan.",
    desc_mn: "Бусаны хамгийн том парк бөгөөд зургаан сэдэвт бүс, аялал, парад, үлгэрийн цайз бүхий өдөржин зугаалах газар.",
    category: "attraction", region: "Gijang", lat: 35.0738, lng: 129.0650,
    address: "부산광역시 기장군 기장읍 동부산관광로 42"
  }
];

module.exports = async function handler(req, res) {
  // Simple key-based auth to prevent accidental runs
  const key = req.query.key;
  if (key !== process.env.SEED_KEY && key !== 'busan2025') {
    return res.status(403).json({ error: 'Invalid key' });
  }

  const dbId = process.env.NOTION_DB_TRAVEL;
  if (!process.env.NOTION_TOKEN_TRAVEL || !dbId) {
    return res.status(503).json({ error: 'Travel DB not configured' });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN_TRAVEL });
  const results = [];

  for (const spot of SPOTS) {
    try {
      const properties = {
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

      await notion.pages.create({ parent: { database_id: dbId }, properties });
      results.push({ name: spot.name, status: 'ok' });
    } catch (err) {
      results.push({ name: spot.name, status: 'error', detail: err.message });
    }
  }

  const ok = results.filter(r => r.status === 'ok').length;
  const fail = results.filter(r => r.status === 'error').length;

  return res.status(200).json({
    summary: ok + ' added, ' + fail + ' failed',
    results
  });
};
