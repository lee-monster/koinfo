// One-time script: Seed spots into Notion TravelKo DB
// Run via: https://koinfo.kr/api/seed?region=busan&key=busan2025
//      or: https://koinfo.kr/api/seed?region=seoul&key=seoul2025
const { Client } = require('@notionhq/client');

const BUSAN_SPOTS = [
  // === FOOD (6) ===
  {
    name: "Choryang Milmyeon", name_ko: "초량밀면",
    name_id: "Choryang Milmyeon (Mi Dingin Busan)", name_mn: "Чорян Мильмён (Бусаны хүйтэн гоймон)",
    desc: "Busan's iconic cold wheat noodle restaurant near Busan Station, famous for bibim milmyeon and giant dumplings. A must-try local classic since the 1960s.",
    desc_ko: "부산역 근처 부산 대표 밀면 맛집. 비빔밀면과 왕만두가 유명한 1960년대부터 이어온 부산 향토 음식점입니다.",
    desc_id: "Restoran mi gandum dingin ikonik Busan dekat Stasiun Busan, terkenal dengan bibim milmyeon dan pangsit raksasa. Klasik lokal sejak tahun 1960-an.",
    desc_mn: "Бусан өртөөний ойролцоох алдарт хүйтэн гоймонгийн ресторан. Бибим мильмён, том бууз нь 1960-аад оноос хойш алдартай.",
    category: "food", region: "Busan Station", lat: 35.1170, lng: 129.0410,
    address: "부산광역시 동구 중앙대로 225"
  },
  {
    name: "Anmok Dwaeji Gukbap", name_ko: "안목 돼지국밥",
    name_id: "Anmok Dwaeji Gukbap (Sup Babi)", name_mn: "Анмок Двэжи Гукбап (Гахайн шөл)",
    desc: "Michelin Bib Gourmand pork rice soup restaurant in Gwangalli. Known for its clean, sophisticated broth that redefines traditional dwaeji-gukbap.",
    desc_ko: "미쉐린 빕 구르망 선정 광안리 돼지국밥 맛집. 잡내 없는 깔끔하고 세련된 국물로 전통 돼지국밥을 재해석한 곳입니다.",
    desc_id: "Restoran sup babi Michelin Bib Gourmand di Gwangalli. Terkenal dengan kaldunya yang bersih dan halus yang mendefinisikan ulang dwaeji-gukbap tradisional.",
    desc_mn: "Гвананлидахь Мишлэн Биб Гурман гахайн шөлний ресторан. Уламжлалт двэжи гукбапыг шинэчлэн тодорхойлсон цэвэр, нарийн шөлөөрөө алдартай.",
    category: "food", region: "Gwangalli", lat: 35.1476, lng: 129.1126,
    address: "부산광역시 수영구 광남로 22번길 3", featured: true
  },
  {
    name: "Ssangdungi Dwaeji Gukbap", name_ko: "쌍둥이 돼지국밥",
    name_id: "Ssangdungi Dwaeji Gukbap (Sup Babi Kembar)", name_mn: "Ссандунги Двэжи Гукбап (Ихэр гахайн шөл)",
    desc: "Legendary pork soup restaurant near Daeyeon Station, beloved by locals for decades. Soft pork, rich broth, and unlimited kimchi make it a top pick for foreigners.",
    desc_ko: "대연역 근처 수십 년 전통의 돼지국밥 명가. 부드러운 고기와 진한 국물, 무한리필 김치로 외국인들에게도 인기 만점입니다.",
    desc_id: "Restoran sup babi legendaris dekat Stasiun Daeyeon yang dicintai warga lokal selama puluhan tahun. Daging babi lembut, kaldu kaya, dan kimchi tak terbatas.",
    desc_mn: "Дэён станцын ойролцоох олон арван жилийн уламжлалтай алдарт гахайн шөлний газар. Зөөлөн мах, өтгөн шөл, хязгааргүй кимчи.",
    category: "food", region: "Daeyeon", lat: 35.1365, lng: 129.1010,
    address: "부산광역시 남구 유엔평화로 16"
  },
  {
    name: "Jagalchi Fish Market", name_ko: "자갈치시장",
    name_id: "Pasar Ikan Jagalchi", name_mn: "Жагалчи загасны зах",
    desc: "Korea's largest seafood market where you pick live fish and have it prepared fresh. The 2nd floor restaurants offer incredible sashimi with harbor views.",
    desc_ko: "한국 최대 수산시장. 1층에서 활어를 고르면 2층 식당에서 바로 회로 즐길 수 있는 부산의 상징적인 먹거리 명소입니다.",
    desc_id: "Pasar makanan laut terbesar di Korea, pilih ikan hidup dan langsung diolah segar. Restoran lantai 2 menawarkan sashimi luar biasa dengan pemandangan pelabuhan.",
    desc_mn: "Солонгосын хамгийн том далайн хүнсний зах. Амьд загас сонгоод шинэхэн сашими болгон бэлтгүүлж, далайн харагдах давхрын ресторанд зугаалаарай.",
    category: "food", region: "Nampo-dong", lat: 35.0965, lng: 129.0308,
    address: "부산광역시 중구 자갈치해안로 52", featured: true
  },
  {
    name: "Haeundae Wonjo Halmae Gukbap", name_ko: "해운대 원조할매국밥",
    name_id: "Haeundae Wonjo Halmae Gukbap", name_mn: "Хэундэ Вонжо Хальмэ Гукбап",
    desc: "A 60-year-old legendary gukbap restaurant in Haeundae serving hearty beef rice soup. Open from early morning, a perfect post-beach meal at under 9,000 won.",
    desc_ko: "해운대 60년 전통 소고기국밥 맛집. 이른 아침부터 영업해 해수욕 전후 든든한 한 끼로 완벽하며, 9,000원 미만의 착한 가격입니다.",
    desc_id: "Restoran gukbap legendaris berusia 60 tahun di Haeundae yang menyajikan sup nasi daging sapi. Buka dari pagi, makanan sempurna setelah pantai dengan harga di bawah 9.000 won.",
    desc_mn: "Хэундэ дахь 60 жилийн уламжлалт үхрийн шөлний газар. Өглөөний эртээс нээлттэй, далайн наадмын дараа 9,000 воноос хямд үнээр хооллох боломжтой.",
    category: "food", region: "Haeundae", lat: 35.1612, lng: 129.1635,
    address: "부산광역시 해운대구 중동1로 40"
  },
  {
    name: "Millak Raw Fish Center", name_ko: "민락회센터",
    name_id: "Pusat Ikan Mentah Millak", name_mn: "Миллак түүхий загасны төв",
    desc: "A 10-story raw fish center on Gwangalli Beach where locals buy fresh sashimi downstairs and enjoy it picnic-style at the waterside park with Diamond Bridge views.",
    desc_ko: "광안리 해변 10층 규모의 회센터. 1층에서 싱싱한 회를 사서 민락수변공원에서 광안대교를 보며 피크닉처럼 즐기는 부산 스타일의 명소입니다.",
    desc_id: "Pusat ikan mentah 10 lantai di Pantai Gwangalli tempat warga lokal membeli sashimi segar di bawah dan menikmatinya gaya piknik di taman tepi air dengan pemandangan Jembatan Diamond.",
    desc_mn: "Гвананли далайн эрэг дээрх 10 давхар түүхий загасны төв. Шинэхэн сашимиг доороос нь авч, Алмазан гүүрний харагдах усны хөвөөний цэцэрлэгт зугаалж болно.",
    category: "food", region: "Gwangalli", lat: 35.1542, lng: 129.1279,
    address: "부산광역시 수영구 민락수변로 1"
  },
  // === CAFE (4) ===
  {
    name: "WAVEON Coffee", name_ko: "웨이브온커피",
    name_id: "WAVEON Coffee", name_mn: "WAVEON Coffee",
    desc: "Award-winning architectural ocean-view cafe in Gijang by renowned architect Kwak Hee-soo. Massive glass windows offer a panoramic sea view that's gone mega-viral on Instagram.",
    desc_ko: "건축가 곽희수가 설계한 한국건축문화대상 수상 기장 오션뷰 카페. 거대한 통유리 너머 탁 트인 바다 전망이 인스타그램에서 대히트를 친 명소입니다.",
    desc_id: "Kafe pemandangan laut arsitektural pemenang penghargaan di Gijang oleh arsitek terkenal Kwak Hee-soo. Jendela kaca besar menawarkan pemandangan laut panorama yang sangat viral di Instagram.",
    desc_mn: "Алдарт архитектор Квак Хи Сү-гийн бүтээсэн шагналт далайн харагдах кафе. Том шилэн цонхоор далайн өргөн харагдах байдал нь Инстаграмд маш их алдартай болсон.",
    category: "cafe", region: "Gijang", lat: 35.3199, lng: 129.2636,
    address: "부산광역시 기장군 장안읍 해맞이로 286", featured: true
  },
  {
    name: "Edge 993", name_ko: "엣지993",
    name_id: "Edge 993", name_mn: "Edge 993",
    desc: "Stunning multi-floor oceanfront rooftop cafe in Haeundae Mipo. By day a dreamy cafe with terrace views, by night a vibrant bar. Watch the Sky Capsule trains pass by.",
    desc_ko: "해운대 미포의 다층 오션프론트 루프탑 카페. 낮에는 테라스 뷰 카페, 밤에는 바이브 넘치는 바로 변신. 스카이캡슐이 지나가는 모습도 감상할 수 있습니다.",
    desc_id: "Kafe rooftop tepi laut multi-lantai yang menakjubkan di Haeundae Mipo. Siang hari kafe bermimpi dengan pemandangan teras, malam hari bar yang semarak. Saksikan kereta Sky Capsule lewat.",
    desc_mn: "Хэундэ Мипо дахь олон давхар далайн эргийн дээврийн кафе. Өдөр нь тэрастай далайн харагдах кафе, шөнө нь цоглог баар. Скай Капсул галт тэрэг өнгөрөх харагдана.",
    category: "cafe", region: "Haeundae", lat: 35.1631, lng: 129.1755,
    address: "부산광역시 해운대구 달맞이길62번길 78"
  },
  {
    name: "Momos Coffee Roastery", name_ko: "모모스커피 영도 로스터리",
    name_id: "Momos Coffee Roastery", name_mn: "Momos Coffee Roastery",
    desc: "A massive 1800sqm repurposed dockside warehouse turned specialty coffee roastery by the 2019 World Barista Champion. Yeongdo's hippest industrial-chic cafe.",
    desc_ko: "2019 월드바리스타챔피언이 만든 영도 선착장 옆 1800㎡ 대형 창고 개조 스페셜티 커피 로스터리. 영도에서 가장 힙한 인더스트리얼 카페입니다.",
    desc_id: "Gudang dermaga seluas 1800m² yang diubah menjadi roastery kopi spesialti oleh Juara Barista Dunia 2019. Kafe industrial-chic terhip di Yeongdo.",
    desc_mn: "2019 оны Дэлхийн Бариста Аваргын бүтээсэн 1800м² талбай бүхий зогсоолын агуулахыг хувиргасан кофены ростери. Ёндогийн хамгийн хипстер кафе.",
    category: "cafe", region: "Yeongdo", lat: 35.0783, lng: 129.0440,
    address: "부산광역시 영도구 봉래나루로 160", featured: true
  },
  {
    name: "Jeonpo Cafe Street", name_ko: "전포카페거리",
    name_id: "Jalan Kafe Jeonpo", name_mn: "Жёнпо кафений гудамж",
    desc: "Featured in NY Times' Top 52 Places to Visit, this trendy street near Seomyeon is lined with specialty coffee shops, dessert cafes, and brunch spots loved by young Koreans.",
    desc_ko: "뉴욕타임스 '가볼 만한 52곳' 선정, 서면 인근 트렌디한 카페 거리. 스페셜티 커피, 디저트 카페, 브런치 맛집이 즐비한 MZ세대 핫플입니다.",
    desc_id: "Masuk NY Times Top 52 Places to Visit, jalan trendi dekat Seomyeon yang dipenuhi kedai kopi spesialti, kafe dessert, dan tempat brunch favorit anak muda Korea.",
    desc_mn: "NY Times-ийн 'Зочлох 52 газар'-д нэрлэгдсэн, Сомён ойролцоох тренди кафений гудамж. Залуу Солонгосчуудын дуртай кофены газар, десерт кафе, бранч газрууд.",
    category: "cafe", region: "Seomyeon", lat: 35.1520, lng: 129.0630,
    address: "부산광역시 부산진구 전포대로 209번길 26"
  },
  // === ATTRACTION (6) ===
  {
    name: "Gamcheon Culture Village", name_ko: "감천문화마을",
    name_id: "Desa Budaya Gamcheon", name_mn: "Гамчён соёлын тосгон",
    desc: "The 'Machu Picchu of Busan' — a hillside village of colorful houses, murals, and art installations. One of the most Instagrammed spots in all of South Korea.",
    desc_ko: "'부산의 마추픽추'로 불리는 알록달록 벽화마을. 다채로운 집들, 벽화, 예술 설치물이 어우러져 한국에서 가장 인스타그래머블한 명소 중 하나입니다.",
    desc_id: "'Machu Picchu Busan' — desa di lereng bukit dengan rumah-rumah berwarna-warni, mural, dan instalasi seni. Salah satu spot paling banyak di-Instagram di Korea Selatan.",
    desc_mn: "'Бусаны Мачу Пикчу' — өнгөлөг байшин, ханын зураг, урлагийн бүтээлүүдтэй толгодын тосгон. Өмнөд Солонгосын Инстаграмд хамгийн их гарсан газруудын нэг.",
    category: "attraction", region: "Gamcheon", lat: 35.0974, lng: 129.0106,
    address: "부산광역시 사하구 감내2로 203", featured: true
  },
  {
    name: "Haeundae Blueline Park Sky Capsule", name_ko: "해운대 블루라인파크 스카이캡슐",
    name_id: "Sky Capsule Haeundae Blueline Park", name_mn: "Хэундэ Блүлайн Парк Скай Капсул",
    desc: "Colorful capsule trains gliding along a coastal rail above turquoise waters from Mipo to Cheongsapo. The most viral Busan attraction on TikTok and Instagram Reels.",
    desc_ko: "미포에서 청사포까지 해안 레일 위를 달리는 알록달록 캡슐 열차. 에메랄드빛 바다 위를 지나는 모습이 틱톡, 인스타 릴스에서 가장 바이럴된 부산 명소입니다.",
    desc_id: "Kereta kapsul berwarna-warni yang meluncur di atas rel pantai di atas air pirus dari Mipo ke Cheongsapo. Atraksi Busan paling viral di TikTok dan Instagram Reels.",
    desc_mn: "Мипогоос Чёнсапо хүртэл эргийн төмөр зам дээгүүр гулсдаг өнгөлөг капсул галт тэрэг. TikTok, Instagram Reels дээр хамгийн их вайрал болсон Бусаны газар.",
    category: "attraction", region: "Haeundae", lat: 35.1583, lng: 129.1728,
    address: "부산광역시 해운대구 달맞이길62번길 13", featured: true
  },
  {
    name: "Haedong Yonggungsa Temple", name_ko: "해동용궁사",
    name_id: "Kuil Haedong Yonggungsa", name_mn: "Хэдон Ёнгунса сүм",
    desc: "A spectacular Buddhist temple perched on ocean cliffs in Gijang. Unlike most Korean temples in mountains, this one sits right by the crashing waves — breathtaking photo spot.",
    desc_ko: "기장 바다 절벽 위에 자리한 장엄한 사찰. 대부분의 산사와 달리 파도가 치는 해안가에 위치해 숨 막히는 포토스팟으로 유명합니다.",
    desc_id: "Kuil Buddha spektakuler di tebing laut Gijang. Berbeda dari kebanyakan kuil Korea di pegunungan, kuil ini terletak tepat di tepi ombak — spot foto yang menakjubkan.",
    desc_mn: "Гижан далайн хадан цохио дээр байрлах гайхамшигт Буддын сүм. Ихэнх Солонгос сүм уулан дээр байдаг бол энэ нь далайн давалгааны дэргэд байрлана.",
    category: "attraction", region: "Gijang", lat: 35.1884, lng: 129.2231,
    address: "부산광역시 기장군 기장읍 용궁길 86"
  },
  {
    name: "Huinnyeoul Culture Village", name_ko: "흰여울문화마을",
    name_id: "Desa Budaya Huinnyeoul", name_mn: "Хүинёуль соёлын тосгон",
    desc: "The 'Santorini of Busan' — a quiet cliffside village on Yeongdo with sea-facing cafes, art installations, and ocean panoramas. Far less crowded than Gamcheon but equally stunning.",
    desc_ko: "'부산의 산토리니'로 불리는 영도 절벽 위 조용한 마을. 바다를 향한 카페, 예술 작품, 해안 파노라마가 감천보다 한적하면서도 아름답습니다.",
    desc_id: "'Santorini Busan' — desa tebing tenang di Yeongdo dengan kafe menghadap laut, instalasi seni, dan panorama laut. Jauh lebih sepi dari Gamcheon tapi sama indahnya.",
    desc_mn: "'Бусаны Санторини' — Ёндо дахь далайн хадан дээрх тайван тосгон. Далайн харагдах кафе, урлагийн бүтээлүүд, Гамчёноос бага хүнтэй ч мөн адил гоё.",
    category: "attraction", region: "Yeongdo", lat: 35.0773, lng: 129.0464,
    address: "부산광역시 영도구 영선동4가 1044-6"
  },
  {
    name: "Busan Tower & Yongdusan Park", name_ko: "부산타워 & 용두산공원",
    name_id: "Menara Busan & Taman Yongdusan", name_mn: "Бусан цамхаг & Ёндусан цэцэрлэгт хүрээлэн",
    desc: "Iconic 120m tower atop Yongdusan Park offering 360-degree night views of Busan's harbor and bridges. Take the glass-floor elevator for extra thrills.",
    desc_ko: "용두산공원 위 120m 전망대에서 부산항과 다리의 360도 야경을 감상할 수 있는 부산의 상징. 유리 바닥 엘리베이터로 스릴도 즐겨보세요.",
    desc_id: "Menara ikonik 120m di atas Taman Yongdusan yang menawarkan pemandangan malam 360 derajat pelabuhan dan jembatan Busan. Naik lift lantai kaca untuk sensasi tambahan.",
    desc_mn: "Ёндусан цэцэрлэгт хүрээлэн дээрх 120м өндөр цамхаг. Бусаны боомт, гүүрнүүдийн 360 градусын шөнийн харагдах байдал, шилэн шалтай лифт.",
    category: "attraction", region: "Nampo-dong", lat: 35.1007, lng: 129.0260,
    address: "부산광역시 중구 용두산길 37-55"
  },
  {
    name: "Jukseong Dream Church", name_ko: "죽성성당 드림세트장",
    name_id: "Gereja Mimpi Jukseong", name_mn: "Жүксон Мөрөөдлийн Сүм",
    desc: "A hauntingly beautiful seaside church film set in Gijang, built for a K-drama. Now one of Busan's most photogenic hidden gems with crashing waves as the backdrop.",
    desc_ko: "기장 해안가에 K-드라마 촬영을 위해 세워진 아름다운 성당 세트장. 파도가 치는 바다를 배경으로 부산의 가장 포토제닉한 숨은 명소입니다.",
    desc_id: "Set film gereja tepi laut yang indah di Gijang, dibangun untuk K-drama. Kini salah satu hidden gem paling fotogenik di Busan dengan ombak sebagai latar belakang.",
    desc_mn: "K-драмын зураг авалтын зорилгоор Гижаны далайн эрэгт баригдсан гоё сүмийн декор. Далайн давалгааг ар дэвсгэр болгосон Бусаны хамгийн нууцлаг гоё газар.",
    category: "attraction", region: "Gijang", lat: 35.2412, lng: 129.2479,
    address: "부산광역시 기장군 기장읍 죽성리 134-7"
  },
  // === NATURE (5) ===
  {
    name: "Haeundae Beach", name_ko: "해운대해수욕장",
    name_id: "Pantai Haeundae", name_mn: "Хэундэ далайн эрэг",
    desc: "Korea's most famous beach — 1.5km of white sand lined with restaurants, bars, and the Marine City skyline. The ultimate Busan experience day and night.",
    desc_ko: "한국에서 가장 유명한 해수욕장. 1.5km 백사장을 따라 음식점, 바, 마린시티 스카이라인이 펼쳐지는 부산의 상징적 명소입니다.",
    desc_id: "Pantai paling terkenal di Korea — 1,5km pasir putih dengan restoran, bar, dan skyline Marine City. Pengalaman Busan terbaik siang dan malam.",
    desc_mn: "Солонгосын хамгийн алдартай далайн эрэг — 1.5 км цагаан элсэн эрэг, ресторан, баар, Марин Сити тэнгэр баганатай. Бусаны шилдэг туршлага.",
    category: "nature", region: "Haeundae", lat: 35.1587, lng: 129.1604,
    address: "부산광역시 해운대구 해운대해변로 264"
  },
  {
    name: "Gwangalli Beach & Diamond Bridge", name_ko: "광안리해수욕장 & 광안대교",
    name_id: "Pantai Gwangalli & Jembatan Diamond", name_mn: "Гвананли далайн эрэг & Алмазан гүүр",
    desc: "Busan's trendiest beach with stunning night views of the LED-lit Diamond Bridge. The beachfront is packed with cafes, bars, and the famous Millak Waterside Park.",
    desc_ko: "LED 조명으로 빛나는 광안대교 야경이 아름다운 부산의 가장 트렌디한 해변. 해변을 따라 카페, 바, 민락수변공원이 즐비합니다.",
    desc_id: "Pantai paling trendi di Busan dengan pemandangan malam Jembatan Diamond yang diterangi LED. Tepi pantai dipenuhi kafe, bar, dan Taman Tepi Air Millak yang terkenal.",
    desc_mn: "LED гэрэлтэй Алмазан гүүрний шөнийн харагдах байдалтай Бусаны хамгийн тренди далайн эрэг. Кафе, баар, Миллак усны хөвөөний цэцэрлэг.",
    category: "nature", region: "Gwangalli", lat: 35.1531, lng: 129.1187,
    address: "부산광역시 수영구 광안해변로 219"
  },
  {
    name: "Oryukdo Skywalk", name_ko: "오륙도 스카이워크",
    name_id: "Skywalk Oryukdo", name_mn: "Орюкдо Скайволк",
    desc: "A free glass-floor skywalk 37m above the sea where you can see the ocean beneath your feet. Pairs perfectly with the stunning Igidae Coastal Trail.",
    desc_ko: "바다 위 37m 높이의 무료 유리 바닥 스카이워크. 발 아래로 바다가 보이며, 이기대 해안산책로와 함께 코스로 돌기 좋습니다.",
    desc_id: "Skywalk lantai kaca gratis 37m di atas laut di mana Anda bisa melihat lautan di bawah kaki. Cocok dipadukan dengan Jalur Pantai Igidae yang menakjubkan.",
    desc_mn: "Далайн түвшнээс 37м өндөрт байрлах үнэгүй шилэн шалтай скайволк. Хөлийн доогуур далай харагдана. Игидэ эргийн зүүн замтай хослуулан алхаарай.",
    category: "nature", region: "Igidae", lat: 35.1023, lng: 129.1229,
    address: "부산광역시 남구 오륙도로 137"
  },
  {
    name: "Taejongdae Resort Park", name_ko: "태종대유원지",
    name_id: "Taman Resor Taejongdae", name_mn: "Тэжондэ амралтын цэцэрлэгт хүрээлэн",
    desc: "A dramatic clifftop nature park on Yeongdo Island with a lighthouse, observatory, and Danubi train ride through lush forests with ocean views.",
    desc_ko: "영도의 울창한 숲과 해안 절벽이 어우러진 자연공원. 등대, 전망대, 다누비 열차를 타고 바다를 감상하며 산책할 수 있습니다.",
    desc_id: "Taman alam tebing dramatis di Pulau Yeongdo dengan mercusuar, observatorium, dan kereta Danubi melewati hutan lebat dengan pemandangan laut.",
    desc_mn: "Ёндо аралын хадан цохионы байгалийн цэцэрлэгт хүрээлэн. Гэрэлт цамхаг, зурагт, Данүби галт тэрэгний аялал, ой, далайн харагдах байдал.",
    category: "nature", region: "Yeongdo", lat: 35.0517, lng: 129.0849,
    address: "부산광역시 영도구 전망로 24"
  },
  {
    name: "Dadaepo Sunset Fountain of Dreams", name_ko: "다대포 꿈의 낙조분수",
    name_id: "Air Mancur Matahari Terbenam Dadaepo", name_mn: "Дадэпо наран жаргалтын усан оргилуур",
    desc: "The world's largest floor fountain with water jets reaching 55m, synchronized with music and lights at sunset. Spectacular free show from April to October.",
    desc_ko: "55m 높이의 물줄기가 음악·조명과 어우러지는 세계 최대 바닥분수. 4~10월 일몰 시간대에 펼쳐지는 무료 분수쇼가 장관입니다.",
    desc_id: "Air mancur lantai terbesar di dunia dengan semburan air setinggi 55m yang disinkronkan dengan musik dan cahaya saat matahari terbenam. Pertunjukan gratis spektakuler April-Oktober.",
    desc_mn: "55м өндөр усны цацалттай дэлхийн хамгийн том шалны усан оргилуур. Хөгжим, гэрэлтүүлэгтэй наран жаргалтын үзүүлбэр, 4-10 сар үнэгүй.",
    category: "nature", region: "Dadaepo", lat: 35.0481, lng: 128.9694,
    address: "부산광역시 사하구 다대동 몰운대1길 14"
  },
  // === SHOPPING (3) ===
  {
    name: "Shinsegae Centum City", name_ko: "신세계 센텀시티",
    name_id: "Shinsegae Centum City", name_mn: "Шинсэгэ Сэнтэм Сити",
    desc: "The Guinness World Record holder for the world's largest department store. Features an ice rink, rooftop garden, jjimjilbang spa, cinema, and 700+ shops across 16 floors.",
    desc_ko: "기네스북 등재 세계 최대 백화점. 아이스링크, 옥상정원, 스파랜드 찜질방, 영화관 등 16개 층 700여 매장이 입점한 부산의 쇼핑 랜드마크입니다.",
    desc_id: "Pemegang Rekor Dunia Guinness untuk department store terbesar di dunia. Ada arena es, taman atap, spa jjimjilbang, bioskop, dan 700+ toko di 16 lantai.",
    desc_mn: "Дэлхийн хамгийн том дэлгүүрийн Гиннесийн рекордтой. Мөсөн тальбай, дээврийн цэцэрлэг, жжимжилбан спа, кино театр, 16 давхарт 700+ дэлгүүр.",
    category: "shopping", region: "Centum City", lat: 35.1686, lng: 129.1291,
    address: "부산광역시 해운대구 센텀남대로 35"
  },
  {
    name: "Gukje Market & BIFF Square", name_ko: "국제시장 & BIFF광장",
    name_id: "Pasar Gukje & BIFF Square", name_mn: "Гүкже зах & BIFF талбай",
    desc: "Busan's largest traditional market connected to the famous BIFF film festival street. Try hotteok (sweet pancakes), browse fashion, cosmetics, and local souvenirs.",
    desc_ko: "부산 최대 전통시장과 BIFF 영화제 거리가 연결된 명소. 씨앗호떡, 패션, 화장품, 기념품 쇼핑을 한 곳에서 즐길 수 있습니다.",
    desc_id: "Pasar tradisional terbesar Busan yang terhubung dengan jalan festival film BIFF yang terkenal. Coba hotteok (pancake manis), belanja fashion, kosmetik, dan suvenir lokal.",
    desc_mn: "Бусаны хамгийн том уламжлалт зах BIFF кино наадмын гудамжтай холбогдсон. Хотток (амттай бин), загвар, гоо сайхан, дурсгалын зүйлс.",
    category: "shopping", region: "Nampo-dong", lat: 35.1045, lng: 129.0244,
    address: "부산광역시 중구 국제시장2길 25"
  },
  {
    name: "Seomyeon Shopping District", name_ko: "서면 쇼핑거리",
    name_id: "Distrik Belanja Seomyeon", name_mn: "Сомён худалдааны дүүрэг",
    desc: "Busan's hipster hub where K-beauty shops, trendy boutiques, street food stalls, and underground shopping arcades converge. The Seomyeon 1beonga Art Street comes alive at night.",
    desc_ko: "K-뷰티 매장, 트렌디한 부티크, 길거리 음식, 지하상가가 모여있는 부산의 힙스터 허브. 서면1번가 아트스트리트는 밤에 더욱 활기를 띕니다.",
    desc_id: "Pusat hipster Busan di mana toko K-beauty, butik trendi, warung street food, dan arkade belanja bawah tanah bertemu. Jalan Seni Seomyeon 1beonga hidup di malam hari.",
    desc_mn: "K-beauty дэлгүүр, тренди бутик, гудамжны хоол, газар доорх худалдааны газрууд. Бусаны хипстер төв. Сомён 1бонга шөнө илүү амьдрана.",
    category: "shopping", region: "Seomyeon", lat: 35.1558, lng: 129.0572,
    address: "부산광역시 부산진구 신천대로 62번길 61"
  },
  // === NIGHTLIFE (2) ===
  {
    name: "Galmegi Brewing Gwangalli", name_ko: "갈매기브루잉 광안리",
    name_id: "Galmegi Brewing Gwangalli", name_mn: "Галмеги Brewing Гвананли",
    desc: "Busan's original craft brewery right on Gwangalli Beach. 20+ house-brewed beers on tap with stunning Diamond Bridge night views from the open-air terrace.",
    desc_ko: "광안리 해변의 부산 최초 크래프트 맥주 펍. 20종 이상의 자체 양조 맥주와 야외 테라스에서 바라보는 광안대교 야경이 매력적입니다.",
    desc_id: "Brewery craft asli Busan tepat di Pantai Gwangalli. 20+ bir buatan sendiri dengan pemandangan malam Jembatan Diamond yang menakjubkan dari teras terbuka.",
    desc_mn: "Гвананли далайн эрэг дээрх Бусаны анхны крафт шар айрагны газар. 20+ төрлийн өөрсдийн бүтээсэн шар айраг, Алмазан гүүрний шөнийн харагдах байдал.",
    category: "nightlife", region: "Gwangalli", lat: 35.1508, lng: 129.1172,
    address: "부산광역시 수영구 광안해변로 278"
  },
  {
    name: "Thursday Party Gwangalli", name_ko: "써스데이파티 광안리",
    name_id: "Thursday Party Gwangalli", name_mn: "Thursday Party Гвананли",
    desc: "The legendary Western-style bar that helped put Gwangalli nightlife on the map. Free entry, friendly vibes, great views of the lit-up Diamond Bridge, and reasonably priced drinks.",
    desc_ko: "광안리 나이트라이프의 전설적인 웨스턴 스타일 바. 무료입장, 프렌들리한 분위기, 조명 빛나는 광안대교 뷰, 합리적 가격의 음료가 매력입니다.",
    desc_id: "Bar gaya Barat legendaris yang membantu membuat kehidupan malam Gwangalli terkenal. Masuk gratis, suasana ramah, pemandangan Jembatan Diamond yang menyala, dan minuman dengan harga wajar.",
    desc_mn: "Гвананлигийн шөнийн амьдралыг алдартай болгосон домогт баар. Үнэгүй орох, найрсаг уур амьсгал, гэрэлтсэн Алмазан гүүрний харагдах байдал.",
    category: "nightlife", region: "Gwangalli", lat: 35.1524, lng: 129.1178,
    address: "부산광역시 수영구 광안해변로 193"
  }
];

const SEOUL_SPOTS = [
  // === SEONGSU-DONG CAFES (5) ===
  {
    name: "Cafe Onion Seongsu", name_ko: "카페 어니언 성수",
    name_id: "Cafe Onion Seongsu", name_mn: "Кафе Онион Сонсу",
    desc: "TikTok-viral cafe in a converted shoe factory. Famous for its pandoro bread and industrial-chic interior. One of Seoul's most Instagrammable cafes.",
    desc_ko: "구두 공장을 개조한 성수동 대표 카페. 판도로 빵과 인더스트리얼 인테리어로 해외 SNS에서도 유명합니다.",
    desc_id: "Kafe viral TikTok di bekas pabrik sepatu. Terkenal dengan roti pandoro dan interior industrial-chic. Salah satu kafe paling Instagrammable di Seoul.",
    desc_mn: "Гутлын үйлдвэрийг шинэчилсэн TikTok-д алдартай кафе. Пандоро талх, аж үйлдвэрийн загварын дотоод засал нь Инстаграмд хамгийн их зургаа авахуулдаг газруудын нэг.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5446, lng: 127.0557,
    address: "서울특별시 성동구 아차산로11길 8", featured: true
  },
  {
    name: "Nudake Seongsu", name_ko: "누데이크 성수",
    name_id: "Nudake Seongsu", name_mn: "Нудэйк Сонсу",
    desc: "Gentle Monster's dessert brand cafe with avant-garde art installations. Their signature Peak cake is a social media sensation. A must-visit for design lovers.",
    desc_ko: "젠틀몬스터의 디저트 브랜드 카페. 전위적인 아트 설치물과 시그니처 피크 케이크로 SNS에서 화제인 디자인 카페입니다.",
    desc_id: "Kafe brand dessert Gentle Monster dengan instalasi seni avant-garde. Kue Peak signature mereka sangat viral di media sosial. Wajib dikunjungi pecinta desain.",
    desc_mn: "Жентл Монстер-ийн амттаны брэнд кафе. Авангард урлагийн суурилуулалт, Пийк бялуу нь сошиал медиад хамгийн их цацагдсан.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5449, lng: 127.0563,
    address: "서울특별시 성동구 아차산로11길 7", featured: true
  },
  {
    name: "Mesh Coffee", name_ko: "메쉬커피",
    name_id: "Mesh Coffee", name_mn: "Мэш Кофе",
    desc: "Minimalist specialty coffee roastery in Seongsu. Known for single-origin pour-over and sleek Scandinavian-inspired design. A favorite among coffee enthusiasts.",
    desc_ko: "성수동 미니멀리스트 스페셜티 커피 로스터리. 싱글 오리진 핸드드립과 북유럽 감성 인테리어로 커피 매니아들의 성지입니다.",
    desc_id: "Roastery kopi spesialti minimalis di Seongsu. Terkenal dengan pour-over single-origin dan desain Skandinavia yang elegan.",
    desc_mn: "Сонсу дахь минималист тусгай кофены шарлагын газар. Нэг гарал үүслийн хэнддрип кофе, хойд Европын загварын дотоод засалаар алдартай.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5441, lng: 127.0519,
    address: "서울특별시 성동구 서울숲2길 16-4"
  },
  {
    name: "LCDC Seoul", name_ko: "LCDC 서울",
    name_id: "LCDC Seoul", name_mn: "LCDC Сөүл",
    desc: "Multi-brand concept store and cafe in a beautifully renovated warehouse. Features rotating art exhibitions, curated lifestyle goods, and excellent coffee.",
    desc_ko: "아름답게 리노베이션된 창고 건물의 멀티 브랜드 컨셉 스토어 겸 카페. 회전 전시, 큐레이션 라이프스타일 굿즈, 훌륭한 커피를 제공합니다.",
    desc_id: "Toko konsep multi-brand dan kafe di gudang yang direnovasi indah. Menampilkan pameran seni bergilir, barang gaya hidup kurasi, dan kopi lezat.",
    desc_mn: "Үзэсгэлэнтэй шинэчилсэн агуулахан дахь олон брэндийн концепт дэлгүүр ба кафе. Ээлжит урлагийн үзэсгэлэн, амьдралын хэв маягийн бараа, маш сайхан кофетой.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5473, lng: 127.0554,
    address: "서울특별시 성동구 연무장길 8"
  },
  {
    name: "Daelim Changgo", name_ko: "대림창고",
    name_id: "Daelim Changgo (Gudang Daelim)", name_mn: "Дэлим Чанго (Дэлим агуулах)",
    desc: "Pioneer of Seongsu's cafe scene, set in a 1970s rice warehouse. The raw concrete and exposed steel beams create a unique gallery-cafe atmosphere.",
    desc_ko: "1970년대 정미소를 개조한 성수동 카페 문화의 선구자. 노출 콘크리트와 철골 구조가 독특한 갤러리 카페 분위기를 만듭니다.",
    desc_id: "Pelopor kafe Seongsu, menempati gudang beras tahun 1970-an. Beton mentah dan balok baja menciptakan suasana kafe-galeri yang unik.",
    desc_mn: "1970-аад оны будааны агуулахыг шинэчилсэн Сонсугийн кафе соёлын анхдагч. Нүцгэн бетон, ган дамнуурга нь өвөрмөц галерей-кафе уур амьсгал бүрдүүлдэг.",
    category: "cafe", region: "Seongsu-dong", lat: 37.5440, lng: 127.0566,
    address: "서울특별시 성동구 성수이로 78"
  },
  // === SEONGSU-DONG FOOD (4) ===
  {
    name: "Tteuran", name_ko: "뜨란",
    name_id: "Tteuran", name_mn: "Ттыран",
    desc: "Vietnamese-Korean fusion restaurant viral on Korean food blogs. Signature banh mi and pho with Korean twists, set in a photogenic Seongsu alley space.",
    desc_ko: "한국 푸드 블로그에서 화제인 베트남-한국 퓨전 레스토랑. 한국식으로 재해석한 반미와 쌀국수가 시그니처인 성수동 포토제닉 맛집입니다.",
    desc_id: "Restoran fusion Vietnam-Korea yang viral di blog makanan Korea. Banh mi dan pho signature dengan sentuhan Korea, di gang fotogenik Seongsu.",
    desc_mn: "Солонгосын хоолны блогт алдартай Вьетнам-Солонгос фьюжн ресторан. Солонгос маягаар хийсэн бань ми, фо нь Сонсугийн гэрэл зургийн сайхан гудамжинд байрладаг.",
    category: "food", region: "Seongsu-dong", lat: 37.5448, lng: 127.0586,
    address: "서울특별시 성동구 서울숲4길 18"
  },
  {
    name: "Seongsu Handmade Burger", name_ko: "성수 수제버거",
    name_id: "Seongsu Handmade Burger", name_mn: "Сонсу гар хийцийн бургер",
    desc: "Craft burger joint in Seongsu with locally sourced beef and housemade buns. The smash burger and truffle fries have made this a foreigner favorite.",
    desc_ko: "국내산 소고기와 자체 제작 번을 사용하는 성수 수제버거. 스매쉬 버거와 트러플 감자튀김이 외국인들에게 특히 인기입니다.",
    desc_id: "Restoran burger craft di Seongsu dengan daging sapi lokal dan roti buatan sendiri. Smash burger dan truffle fries menjadikannya favorit turis asing.",
    desc_mn: "Дотоодын үхрийн мах, өөрсдийн хийсэн талхаар бүтээсэн Сонсу дахь гар бургерийн газар. Смэш бургер, трюфель шарсан төмстэй.",
    category: "food", region: "Seongsu-dong", lat: 37.5435, lng: 127.0560,
    address: "서울특별시 성동구 아차산로9길 12"
  },
  {
    name: "Sobok Chicken", name_ko: "소복치킨",
    name_id: "Sobok Chicken", name_mn: "Собок Чикэн",
    desc: "Retro-themed Korean fried chicken spot in Seongsu. Crispy double-fried chicken with creative sauces in a nostalgic 80s Korean decor. Great with Korean craft beer.",
    desc_ko: "성수동 레트로 감성 치킨집. 바삭한 이중 튀김 치킨과 창의적인 소스를 80년대 한국 인테리어에서 즐기는 곳. 수제 맥주와 함께 추천합니다.",
    desc_id: "Ayam goreng Korea bertema retro di Seongsu. Ayam double-fry renyah dengan saus kreatif dalam dekorasi Korea 80-an. Cocok dengan bir craft Korea.",
    desc_mn: "Сонсу дахь ретро загварын Солонгос шарсан тахианы газар. Давхар шарсан шарсан тахиа, 80-аад оны Солонгос дотоод засалтай. Гар урлалын шартай хамт.",
    category: "food", region: "Seongsu-dong", lat: 37.5462, lng: 127.0544,
    address: "서울특별시 성동구 왕십리로 115"
  },
  {
    name: "Yukjeon Sikdang", name_ko: "육전식당",
    name_id: "Yukjeon Sikdang", name_mn: "Юкжон Шикданг",
    desc: "Popular Korean meat pancake (yukjeon) restaurant in Seongsu. The savory beef pancakes paired with makgeolli are a hit among TikTok food tourists.",
    desc_ko: "성수동 인기 육전 맛집. 고소한 육전과 막걸리 조합이 틱톡 푸드 관광객들에게 큰 인기를 끌고 있습니다.",
    desc_id: "Restoran pancake daging Korea populer di Seongsu. Pancake daging sapi gurih dipadu makgeolli sangat populer di kalangan food tourist TikTok.",
    desc_mn: "Сонсу дахь алдартай Солонгос махан бин (юкжон) ресторан. Амттай үхрийн бин, макголли хослол нь TikTok хоолны жуулчдын дунд алдартай.",
    category: "food", region: "Seongsu-dong", lat: 37.5453, lng: 127.0538,
    address: "서울특별시 성동구 성수이로 10길 14"
  },
  // === EULJIRO CAFES (3) ===
  {
    name: "Cafe Onion Anguk", name_ko: "카페 어니언 안국",
    name_id: "Cafe Onion Anguk", name_mn: "Кафе Онион Ангук",
    desc: "Cafe Onion's hanok (traditional Korean house) branch near Bukchon. Stunning blend of old Korean architecture and modern cafe culture. TikTok famous for the courtyard views.",
    desc_ko: "북촌 근처 한옥을 개조한 카페 어니언 안국점. 전통 한국 건축과 현대 카페 문화의 절묘한 조화. 마당 뷰가 틱톡에서 화제입니다.",
    desc_id: "Cabang hanok (rumah tradisional Korea) Cafe Onion dekat Bukchon. Perpaduan menakjubkan arsitektur Korea kuno dan budaya kafe modern. Viral di TikTok.",
    desc_mn: "Бүкчон ойролцоох ханок (уламжлалт Солонгос байшин)-д байрлах Кафе Онион салбар. Эртний Солонгос барилгын урлаг, орчин үеийн кафе соёлын гайхалтай хослол.",
    category: "cafe", region: "Euljiro", lat: 37.5796, lng: 126.9851,
    address: "서울특별시 종로구 계동길 5", featured: true
  },
  {
    name: "Coffee Hanyakbang", name_ko: "커피한약방",
    name_id: "Coffee Hanyakbang", name_mn: "Кофе Ханякбанг",
    desc: "Hidden gem cafe in an old Korean medicine pharmacy in Euljiro. The vintage apothecary interior with herbal coffee blends creates a uniquely Korean cafe experience.",
    desc_ko: "을지로 옛 한약방을 개조한 숨은 명소 카페. 빈티지 약장 인테리어와 한방 블렌드 커피로 독특한 한국적 카페 경험을 제공합니다.",
    desc_id: "Kafe tersembunyi di apotek obat Korea lama di Euljiro. Interior apotek vintage dengan kopi herbal menciptakan pengalaman kafe unik khas Korea.",
    desc_mn: "Ыүлжиро дахь хуучин Солонгос уламжлалт эмийн сан дахь нууц кафе. Эртний эмийн сангийн дотоод засал, ургамлын кофе хослол нь онцгой Солонгос кафе туршлага.",
    category: "cafe", region: "Euljiro", lat: 37.5660, lng: 126.9920,
    address: "서울특별시 중구 을지로13길 17"
  },
  {
    name: "Neutral Colors", name_ko: "뉴트럴 컬러스",
    name_id: "Neutral Colors", name_mn: "Нютрал Колорс",
    desc: "Ultra-minimalist cafe-gallery in Euljiro known for its stark white interior and specialty espresso. A design-lover's paradise frequently featured on Instagram.",
    desc_ko: "을지로의 울트라 미니멀리스트 카페 갤러리. 순백 인테리어와 스페셜티 에스프레소로 인스타그램에서 자주 소개되는 디자인 성지입니다.",
    desc_id: "Kafe-galeri ultra-minimalis di Euljiro terkenal dengan interior putih bersih dan espresso spesialti. Surga pecinta desain yang sering tampil di Instagram.",
    desc_mn: "Ыүлжиро дахь ультра минималист кафе-галерей. Цагаан дотоод засал, тусгай эспрессо нь Инстаграмд байнга гарч буй дизайны диваажин.",
    category: "cafe", region: "Euljiro", lat: 37.5665, lng: 126.9918,
    address: "서울특별시 중구 을지로14길 8"
  },
  // === EULJIRO FOOD (4) ===
  {
    name: "Euljiro Nogari Alley", name_ko: "을지로 노가리 골목",
    name_id: "Euljiro Nogari Alley (Gang Ikan Kering)", name_mn: "Ыүлжиро Ногари гудамж (Хатаасан загасны гудамж)",
    desc: "Iconic alley of open-air bars serving dried pollack (nogari) and cheap beer since the 1980s. A raw, authentic Korean drinking culture experience loved by adventurous tourists.",
    desc_ko: "1980년대부터 이어진 노천 노가리 골목. 마른 안주와 저렴한 맥주로 한국 서민 음주 문화를 체험할 수 있는 을지로 대표 명소입니다.",
    desc_id: "Gang ikonik dengan bar terbuka yang menyajikan ikan kering (nogari) dan bir murah sejak 1980-an. Pengalaman budaya minum Korea otentik yang disukai turis petualang.",
    desc_mn: "1980-аад оноос хойш хатаасан загас (ногари), хямд шар айрагтай задгай бааруудын алдарт гудамж. Адал явдалд дуртай жуулчдын дуртай Солонгос уух соёлын газар.",
    category: "food", region: "Euljiro", lat: 37.5665, lng: 126.9910,
    address: "서울특별시 중구 을지로3가", featured: true
  },
  {
    name: "Jangsu Jokbal", name_ko: "장수족발",
    name_id: "Jangsu Jokbal (Kaki Babi)", name_mn: "Жансу Жокбал (Гахайн туурай)",
    desc: "Legendary late-night pig's feet restaurant in Jangchung-dong, open since 1978. The tender, marinated jokbal is a must-try Korean late-night food experience.",
    desc_ko: "1978년부터 영업한 장충동 족발 골목의 전설적인 맛집. 부드럽고 양념이 밴 족발은 한국 야식 문화의 대표 메뉴입니다.",
    desc_id: "Restoran kaki babi legendaris di Jangchung-dong, buka sejak 1978. Jokbal empuk bermarinasi ini wajib dicoba untuk pengalaman makanan malam Korea.",
    desc_mn: "1978 оноос хойш ажиллаж буй Жанчундон дахь алдарт гахайн туурайн ресторан. Зөөлөн, нөлөөлөгдсөн жокбал нь Солонгосын шөнийн хоолны дурсамж.",
    category: "food", region: "Euljiro", lat: 37.5610, lng: 127.0020,
    address: "서울특별시 중구 장충단로 174"
  },
  {
    name: "Gwangjang Market Mayak Gimbap", name_ko: "광장시장 마약김밥",
    name_id: "Gwangjang Market Mayak Gimbap", name_mn: "Гванжан зах Маяк Гимбап",
    desc: "Tiny addictive gimbap rolls at Korea's oldest traditional market. Netflix Street Food featured. The bite-sized 'drug gimbap' with mustard sauce is iconic K-food.",
    desc_ko: "한국 최고(最古) 전통시장의 중독성 있는 꼬마 김밥. 넷플릭스 스트릿 푸드에 소개된 겨자 소스 마약김밥은 K-푸드의 아이콘입니다.",
    desc_id: "Gimbap mini yang adiktif di pasar tradisional tertua Korea. Ditampilkan di Netflix Street Food. 'Drug gimbap' seukuran gigitan dengan saus mustard sangat ikonik.",
    desc_mn: "Солонгосын хамгийн эртний уламжлалт зах дахь донтуулам жижиг гимбап. Netflix Street Food-д гарсан. Гичний сүмстэй 'маяк гимбап' нь K-хоолны бэлгэдэл.",
    category: "food", region: "Euljiro", lat: 37.5700, lng: 126.9996,
    address: "서울특별시 종로구 종로 88 광장시장", featured: true
  },
  {
    name: "Tosokchon Samgyetang", name_ko: "토속촌 삼계탕",
    name_id: "Tosokchon Samgyetang (Sup Ayam Ginseng)", name_mn: "Тосокчон Самгетан (Жинсэнтэй тахианы шөл)",
    desc: "Seoul's most famous ginseng chicken soup restaurant near Gyeongbokgung Palace. A traditional Korean health food experience loved by international visitors for decades.",
    desc_ko: "경복궁 근처 서울에서 가장 유명한 삼계탕집. 수십 년간 외국인 관광객들이 사랑해온 한국 전통 보양식 대표 맛집입니다.",
    desc_id: "Restoran sup ayam ginseng paling terkenal di Seoul dekat Istana Gyeongbokgung. Pengalaman makanan sehat tradisional Korea yang dicintai pengunjung internasional.",
    desc_mn: "Гёнбокгүн ордны ойролцоох Сөүлийн хамгийн алдарт жинсэнтэй тахианы шөлний ресторан. Олон арван жилийн турш олон улсын жуулчдын хайрласан уламжлалт эрүүл хоол.",
    category: "food", region: "Euljiro", lat: 37.5782, lng: 126.9717,
    address: "서울특별시 종로구 자하문로5길 5"
  },
  // === SEONGSU ATTRACTIONS (2) ===
  {
    name: "Seoul Forest", name_ko: "서울숲",
    name_id: "Seoul Forest", name_mn: "Сөүл ой",
    desc: "Beautiful urban park near Seongsu with deer garden, art installations, and seasonal flower gardens. Perfect for a peaceful walk between cafe-hopping in Seongsu-dong.",
    desc_ko: "성수 근처 아름다운 도심 공원. 사슴 방사장, 아트 설치물, 계절별 꽃정원이 있어 성수동 카페 투어 사이 산책하기 완벽합니다.",
    desc_id: "Taman kota indah dekat Seongsu dengan taman rusa, instalasi seni, dan taman bunga musiman. Sempurna untuk jalan santai di antara cafe-hopping Seongsu.",
    desc_mn: "Сонсу ойролцоох үзэсгэлэнтэй хотын цэцэрлэгт хүрээлэн. Буга мал, урлагийн суурилуулалт, улирлын цэцгийн цэцэрлэгтэй. Кафе аялалын завсарлагаанд тохиромжтой.",
    category: "nature", region: "Seongsu-dong", lat: 37.5443, lng: 127.0374,
    address: "서울특별시 성동구 뚝섬로 273"
  },
  {
    name: "Seongsu Street Art & Mural Alley", name_ko: "성수동 벽화거리",
    name_id: "Seongsu Street Art & Mural Alley", name_mn: "Сонсу гудамжны урлаг ба ханын зургийн гудамж",
    desc: "Colorful mural alleys and street art throughout Seongsu-dong, turning old factory walls into open-air galleries. Popular photo spots for social media content creators.",
    desc_ko: "성수동 곳곳의 형형색색 벽화 골목과 스트릿 아트. 오래된 공장 벽이 야외 갤러리로 변신한 SNS 콘텐츠 크리에이터들의 인기 촬영 명소입니다.",
    desc_id: "Gang mural berwarna-warni dan seni jalanan di seluruh Seongsu-dong, mengubah dinding pabrik lama menjadi galeri terbuka. Spot foto populer untuk kreator konten.",
    desc_mn: "Сонсу даяар өнгөлөг ханын зургийн гудамж. Хуучин үйлдвэрийн ханыг задгай галерей болгон хувиргасан сошиал медиа контент бүтээгчдийн дуртай зургийн газар.",
    category: "attraction", region: "Seongsu-dong", lat: 37.5450, lng: 127.0560,
    address: "서울특별시 성동구 성수이로 일대"
  }
];

module.exports = async function handler(req, res) {
  var region = req.query.region;
  var key = req.query.key;

  var spots;
  if (region === 'busan' && key === 'busan2025') {
    spots = BUSAN_SPOTS;
  } else if (region === 'seoul' && key === 'seoul2025') {
    spots = SEOUL_SPOTS;
  } else {
    return res.status(403).json({ error: 'Invalid region or key. Use ?region=busan&key=busan2025 or ?region=seoul&key=seoul2025' });
  }

  var dbId = process.env.NOTION_DB_TRAVEL;
  if (!process.env.NOTION_TOKEN_TRAVEL || !dbId) {
    return res.status(503).json({ error: 'Travel DB not configured' });
  }

  var notion = new Client({ auth: process.env.NOTION_TOKEN_TRAVEL });
  var results = [];

  for (var i = 0; i < spots.length; i++) {
    var spot = spots[i];
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
    region: region,
    summary: ok + ' added, ' + fail + ' failed',
    results: results
  });
};

module.exports.config = { maxDuration: 60 };
