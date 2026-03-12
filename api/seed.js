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

// === JEJU (10) ===
const JEJU_SPOTS = [
  {
    name: "Cafe Delmoondo", name_ko: "카페 델문도",
    name_id: "Cafe Delmoondo", name_mn: "Кафе Дэлмүүндо",
    desc: "Iconic oceanfront cafe on Hamdeok Beach, famous for its stunning turquoise sea views. A top Instagram spot in Jeju with open-air seating right on the sand.",
    desc_ko: "함덕해변의 아이코닉한 오션프론트 카페. 터키색 바다 전망과 모래사장 위 야외 좌석으로 인스타그램에서 가장 인기 있는 제주 카페입니다.",
    desc_id: "Kafe tepi laut ikonik di Pantai Hamdeok, terkenal dengan pemandangan laut pirus yang menakjubkan. Spot Instagram teratas di Jeju dengan tempat duduk terbuka di atas pasir.",
    desc_mn: "Хамдок далайн эргийн алдарт далайн эргийн кафе. Фирузэ өнгийн далайн үзэмж, элсэн дээрх задгай суудлаар Инстаграмд хамгийн их алдартай Жэжү кафе.",
    category: "cafe", region: "Hamdeok", lat: 33.5439, lng: 126.6690,
    address: "제주특별자치도 제주시 조천읍 조함해안로 519-10", featured: true
  },
  {
    name: "O'sulloc Tea Museum", name_ko: "오설록 티뮤지엄",
    name_id: "Museum Teh O'sulloc", name_mn: "Осүллок цайны музей",
    desc: "Korea's first tea museum surrounded by vast green tea fields. Viral on TikTok for its matcha soft serve and photogenic tea plantations. Free admission, over 700K visitors annually.",
    desc_ko: "광활한 녹차밭으로 둘러싸인 한국 최초의 차 박물관. 말차 소프트아이스크림과 포토제닉한 녹차밭으로 틱톡에서 화제. 무료입장, 연간 70만 명 방문.",
    desc_id: "Museum teh pertama di Korea yang dikelilingi ladang teh hijau luas. Viral di TikTok untuk matcha soft serve dan perkebunan teh yang fotogenik. Gratis masuk.",
    desc_mn: "Өргөн ногоон цайны талбайгаар хүрээлэгдсэн Солонгосын анхны цайны музей. Матча зайрмаг, гэрэл зургийн сайхан цайны талбайгаараа TikTok-д алдартай. Үнэгүй.",
    category: "cafe", region: "Seogwipo", lat: 33.3060, lng: 126.2901,
    address: "제주특별자치도 서귀포시 안덕면 신화역사로 15", featured: true
  },
  {
    name: "Haejigae Cafe", name_ko: "해지개",
    name_id: "Haejigae Cafe", name_mn: "Хэжигэ кафе",
    desc: "Trendy hanok-style bakery cafe on Aewol's famous cafe street, right in front of Handam Beach. Known for pistachio madeleines and breathtaking sunset views.",
    desc_ko: "애월 유명 카페거리의 한옥 스타일 베이커리 카페. 한담해변 앞에 위치해 피스타치오 마들렌과 일몰 뷰로 유명합니다.",
    desc_id: "Kafe bakeri bergaya hanok di jalan kafe terkenal Aewol, tepat di depan Pantai Handam. Terkenal dengan madeleine pistachio dan pemandangan matahari terbenam.",
    desc_mn: "Аэвольын алдарт кафений гудамж дахь ханок загварын талхны кафе. Хандам далайн эргийн өмнө байрлаж, фисташка мадлен, наран жаргалтын үзэмжээрээ алдартай.",
    category: "cafe", region: "Aewol", lat: 33.4629, lng: 126.3093,
    address: "제주특별자치도 제주시 애월읍 애월북서길 52"
  },
  {
    name: "Dombedon", name_ko: "돔베돈",
    name_id: "Dombedon (BBQ Babi Hitam Jeju)", name_mn: "Домбедон (Жэжүгийн хар гахайн барбекю)",
    desc: "Michelin-recognized Jeju black pork BBQ restaurant near Dongmun Market. Famous for traditional dombekogi with incredibly juicy grilled pork belly. A must-try for meat lovers.",
    desc_ko: "미쉐린 인정 동문시장 인근 제주 흑돼지 바비큐 맛집. 전통 돔베고기 방식의 육즙 가득한 삼겹살 구이가 고기 애호가 필수 코스입니다.",
    desc_id: "Restoran BBQ babi hitam Jeju yang diakui Michelin dekat Pasar Dongmun. Terkenal dengan dombekogi tradisional dengan perut babi panggang yang sangat juicy.",
    desc_mn: "Донмүн зах ойролцоох Мишлэн зэрэглэлийн Жэжү хар гахайн барбекю ресторан. Уламжлалт домбекоги аргаар хийсэн шүүслэг шарсан гахайн гурил.",
    category: "food", region: "Jeju City", lat: 33.5156, lng: 126.5266,
    address: "제주특별자치도 제주시 관덕로15길 25", featured: true
  },
  {
    name: "Myeongjin Jeonbok", name_ko: "명진전복",
    name_id: "Myeongjin Jeonbok (Abalone)", name_mn: "Мёнжин Жонбок (Далайн чулуу)",
    desc: "TripAdvisor #1 rated Jeju restaurant, specializing in fresh abalone from their own farm. Only four signature dishes: abalone porridge, stone pot rice, grilled, and raw abalone.",
    desc_ko: "트립어드바이저 제주 1위 맛집. 자체 양식장의 신선한 전복 요리 전문점. 전복죽, 돌솥밥, 구이, 회 4가지 시그니처 메뉴만 제공합니다.",
    desc_id: "Restoran peringkat #1 TripAdvisor di Jeju, spesialisasi abalone segar dari peternakan sendiri. Hanya empat menu: bubur abalone, nasi panci batu, panggang, dan mentah.",
    desc_mn: "TripAdvisor-ийн Жэжүгийн 1-р зэрэглэлийн ресторан. Өөрийн фермийн шинэхэн далайн чулуу мэргэшсэн. Далайн чулууны будаа, чулуун тогооны хоол, шарсан, түүхий 4 төрлийн цэс.",
    category: "food", region: "Gujwa", lat: 33.5325, lng: 126.8494,
    address: "제주특별자치도 제주시 구좌읍 해맞이해안로 1282"
  },
  {
    name: "Ollae Guksu", name_ko: "올래국수",
    name_id: "Ollae Guksu (Mi Babi Jeju)", name_mn: "Оллэ Гуксу (Жэжүгийн гахайн гоймон)",
    desc: "Famous for gogi guksu (pork noodle soup), a traditional Jeju comfort food. Went viral after being featured on Korean TV. Long queues are common — arrive early.",
    desc_ko: "제주 전통 고기국수 맛집. 한국 TV에 소개된 후 전국적으로 유명해진 곳. 줄이 길어 일찍 방문하는 것을 추천합니다.",
    desc_id: "Terkenal dengan gogi guksu (sup mi babi), makanan kenyamanan tradisional Jeju. Viral setelah tampil di TV Korea. Antrean panjang — datang lebih awal.",
    desc_mn: "Жэжүгийн уламжлалт гахайн гоймон (гоги гуксу)-аар алдартай. Солонгосын ТВ-д гарсны дараа алдаршсан. Дараалал урт — эрт ирэхийг зөвлөж байна.",
    category: "food", region: "Jeju City", lat: 33.4885, lng: 126.4894,
    address: "제주특별자치도 제주시 귀아랑길 24"
  },
  {
    name: "Arte Museum Jeju", name_ko: "아르떼뮤지엄 제주",
    name_id: "Arte Museum Jeju", name_mn: "Артэ музей Жэжү",
    desc: "Korea's largest immersive media art museum with 16 themed exhibitions. Viral on Instagram and TikTok for stunning 'Eternal Nature' light installations featuring beaches, waterfalls, and forests.",
    desc_ko: "16개 테마 전시를 갖춘 한국 최대 몰입형 미디어 아트 뮤지엄. 해변, 폭포, 숲을 표현한 '영원한 자연' 빛 설치물이 인스타그램/틱톡에서 큰 화제입니다.",
    desc_id: "Museum seni media imersif terbesar Korea dengan 16 pameran bertema. Viral di Instagram dan TikTok untuk instalasi cahaya 'Eternal Nature' yang menampilkan pantai, air terjun, dan hutan.",
    desc_mn: "16 сэдэвт үзэсгэлэнтэй Солонгосын хамгийн том гүн нөлөөт медиа урлагийн музей. Далайн эрэг, хүрхрээ, ойн 'Мөнхийн байгаль' гэрлийн суурилуулалт Instagram/TikTok-д алдартай.",
    category: "attraction", region: "Aewol", lat: 33.3974, lng: 126.3457,
    address: "제주특별자치도 제주시 애월읍 어림비로 478", featured: true
  },
  {
    name: "Dongmun Traditional Market", name_ko: "제주 동문재래시장",
    name_id: "Pasar Tradisional Dongmun", name_mn: "Донмүн уламжлалт зах",
    desc: "Jeju's largest and oldest traditional market with fresh seafood, hallabong tangerines, and street food. The night market section is especially popular with foreign tourists on TikTok.",
    desc_ko: "제주 최대·최고(最古) 전통시장. 신선한 해산물, 한라봉, 길거리 음식이 가득하며 야시장이 외국인 관광객에게 특히 인기입니다.",
    desc_id: "Pasar tradisional terbesar dan tertua di Jeju dengan seafood segar, jeruk hallabong, dan street food. Bagian pasar malam sangat populer di kalangan turis asing di TikTok.",
    desc_mn: "Жэжүгийн хамгийн том, хамгийн эртний уламжлалт зах. Шинэхэн далайн хүнс, халлабон жүрж, гудамжны хоолоор дүүрэн. Шөнийн зах нь гадаадын жуулчдад онцгой алдартай.",
    category: "attraction", region: "Jeju City", lat: 33.5116, lng: 126.5260,
    address: "제주특별자치도 제주시 관덕로14길 20"
  },
  {
    name: "Seongsan Ilchulbong", name_ko: "성산일출봉",
    name_id: "Seongsan Ilchulbong (Puncak Matahari Terbit)", name_mn: "Сонсан Ильчулбон (Нарны мандалтын оргил)",
    desc: "UNESCO World Heritage volcanic tuff cone rising dramatically from the sea. The sunrise hike to the crater rim is one of Jeju's most iconic experiences and the island's most photographed landmark.",
    desc_ko: "유네스코 세계유산으로 바다에서 솟아오른 화산 응회구. 분화구 정상까지의 일출 등반은 제주의 가장 상징적인 경험이자 섬에서 가장 많이 촬영되는 명소입니다.",
    desc_id: "Kerucut tuf vulkanik Warisan Dunia UNESCO yang menjulang dramatis dari laut. Pendakian matahari terbit ke tepi kawah adalah salah satu pengalaman paling ikonik di Jeju.",
    desc_mn: "ЮНЕСКО-гийн дэлхийн өв, далайгаас эрс тэс өндөрсөх галт уулын чулуулгийн конус. Нүхний ирмэг рүү нар мандахыг угтан авирах нь Жэжүгийн хамгийн бэлгэдэлт туршлага.",
    category: "nature", region: "Seongsan", lat: 33.4590, lng: 126.9409,
    address: "제주특별자치도 서귀포시 성산읍 성산리", featured: true
  },
  {
    name: "Saebyeol Oreum", name_ko: "새별오름",
    name_id: "Saebyeol Oreum (Bukit Bintang Pagi)", name_mn: "Сэбёль Орым (Өглөөний одны толгод)",
    desc: "A scenic volcanic cone whose name means 'Morning Star'. Famous for silver grass fields in autumn and panoramic views of Jeju's midlands. A moderate 30-minute loop trail.",
    desc_ko: "'새벽별'이라는 뜻의 아름다운 오름. 가을 억새밭과 제주 중산간 파노라마 전망으로 유명하며 약 30분이면 한 바퀴 돌 수 있는 중난이도 트레일입니다.",
    desc_id: "Kerucut vulkanik indah yang namanya berarti 'Bintang Pagi'. Terkenal dengan padang rumput perak di musim gugur dan pemandangan panorama dataran tengah Jeju. Trail loop 30 menit.",
    desc_mn: "'Өглөөний од' гэсэн утгатай үзэсгэлэнтэй галт уулын толгод. Намрын мөнгөлөг өвсний талбай, Жэжүгийн дундын газрын тойрог харагдах байдлаар алдартай. 30 минутын тойрог зам.",
    category: "nature", region: "Aewol", lat: 33.3661, lng: 126.3575,
    address: "제주특별자치도 제주시 애월읍 봉성리 산59-8"
  }
];

// === GANGWON - Gangneung & Sokcho (8) ===
const GANGWON_SPOTS = [
  {
    name: "Sundubujellato 3rd Branch", name_ko: "순두부젤라또 3호점",
    name_id: "Sundubujellato (Gelato Tahu Lembut)", name_mn: "Сундубу Желато (Тоофүгийн зайрмаг)",
    desc: "A massive oceanview cafe next to the famous Goblin K-drama filming location at Jumunjin Beach. Offers unique sundubu gelato and rooftop seating with panoramic East Sea views.",
    desc_ko: "주문진 해변 도깨비 촬영지 옆 대형 오션뷰 카페. 독특한 순두부 젤라또와 동해 파노라마 전망 루프탑 좌석이 인기입니다.",
    desc_id: "Kafe pemandangan laut besar di sebelah lokasi syuting K-drama Goblin di Pantai Jumunjin. Menawarkan gelato sundubu unik dan tempat duduk rooftop dengan panorama Laut Timur.",
    desc_mn: "Жумунжин далайн эрэг дэх Goblin К-драмын зураг авалтын газрын хажууд байрлах том далайн харагдах кафе. Сундубу желато, Зүүн тэнгисийн тойрог харагдах дээврийн суудалтай.",
    category: "cafe", region: "Gangneung", lat: 37.8791, lng: 128.8337,
    address: "강원특별자치도 강릉시 주문진읍 해안로 1603", featured: true
  },
  {
    name: "Another Blue", name_ko: "어나더블루",
    name_id: "Another Blue", name_mn: "Анадэр Блү",
    desc: "A rooftop oceanview cafe in Sokcho's Jangsahang port area. Known for specialty hand-drip coffee and handmade cakes with stunning views of the Sokcho coastline from floor-to-ceiling windows.",
    desc_ko: "속초 장사항 포구의 루프탑 오션뷰 카페. 스페셜티 핸드드립 커피와 수제 케이크, 바닥부터 천장까지 이어지는 창으로 속초 해안선 전망이 일품입니다.",
    desc_id: "Kafe rooftop pemandangan laut di area pelabuhan Jangsahang Sokcho. Terkenal dengan kopi hand-drip spesialti dan kue buatan tangan dengan pemandangan pantai Sokcho yang menakjubkan.",
    desc_mn: "Сокчогийн Жансахан боомтын бүсийн дээврийн далайн харагдах кафе. Тусгай гар дрип кофе, гар хийцийн бялуу, Сокчо эргийн үзэсгэлэнт харагдах байдал.",
    category: "cafe", region: "Sokcho", lat: 38.2210, lng: 128.5720,
    address: "강원특별자치도 속초시 장사항해안길 61"
  },
  {
    name: "Donghwa Garden", name_ko: "동화가든 본점",
    name_id: "Donghwa Garden (Sundubu Jjamppong)", name_mn: "Донхва Гардэн (Жжампон сундубу)",
    desc: "The originator of jjamppong sundubu (spicy seafood soft tofu stew) in Gangneung's famous Chodang Tofu Village. Lines form from early morning for their signature fiery broth with silky fresh tofu.",
    desc_ko: "강릉 초당 순두부마을의 짬뽕순두부 원조 맛집. 매콤한 해물 짬뽕 국물에 실크처럼 부드러운 순두부가 어우러진 시그니처 메뉴로 아침부터 줄이 길게 늘어섭니다.",
    desc_id: "Penemu jjamppong sundubu (rebusan tahu lembut seafood pedas) di Desa Tahu Chodang Gangneung. Antrean dari pagi hari untuk kuah pedas dengan tahu lembut segar.",
    desc_mn: "Ганнёнгийн алдарт Чодан тоофүгийн тосгоны жжампон сундубугийн анхдагч. Халуун далайн хүнсний шөлтэй зөөлөн шинэхэн тоофүгийн цэс. Өглөөнөөс дараалал үүснэ.",
    category: "food", region: "Gangneung", lat: 37.7943, lng: 128.8955,
    address: "강원특별자치도 강릉시 초당순두부길77번길 15", featured: true
  },
  {
    name: "Dancheon Restaurant", name_ko: "단천식당",
    name_id: "Dancheon Restaurant (Sundae Abai)", name_mn: "Данчон ресторан (Абай сундэ)",
    desc: "A 2nd-generation restaurant in Sokcho's historic Abai Village, famous for abai sundae (North Korean-style blood sausage) and ojingeo sundae (squid sausage). Reach via the iconic hand-pulled gaetbae ferry.",
    desc_ko: "속초 아바이마을 2대째 이어온 맛집. 아바이순대(이북식 순대)와 오징어순대가 유명하며, 갯배를 타고 방문하는 것도 특별한 경험입니다.",
    desc_id: "Restoran generasi ke-2 di Desa Abai bersejarah Sokcho, terkenal dengan abai sundae (sosis darah gaya Korea Utara) dan ojingeo sundae (sosis cumi). Akses via feri gaetbae yang ditarik tangan.",
    desc_mn: "Сокчогийн түүхэн Абай тосгоны 2-р үеийн ресторан. Абай сундэ (Хойд Солонгос загварын цусан зайдас), ожинго сундэ (наймаалжны зайдас)-аар алдартай. Гар татдаг гэтбэ завиар хүрнэ.",
    category: "food", region: "Sokcho", lat: 38.2007, lng: 128.5949,
    address: "강원특별자치도 속초시 아바이마을길 17", featured: true
  },
  {
    name: "Sokcho Tourist & Fishery Market", name_ko: "속초관광수산시장",
    name_id: "Pasar Wisata & Perikanan Sokcho", name_mn: "Сокчо аялал жуулчлалын загасны зах",
    desc: "Selected as one of Korea's 100 must-visit spots for 2025-2026. Vibrant market packed with fresh seafood, dakgangjeong (sweet crispy chicken), and local street food from hundreds of vendors.",
    desc_ko: "2025-2026 한국 관광 100선 선정. 신선한 해산물, 닭강정, 지역 길거리 음식이 가득한 활기찬 시장입니다.",
    desc_id: "Terpilih sebagai salah satu dari 100 tempat wajib dikunjungi Korea 2025-2026. Pasar ramai penuh seafood segar, dakgangjeong (ayam goreng manis renyah), dan street food lokal.",
    desc_mn: "2025-2026 Солонгосын заавал зочлох 100 газрын нэгээр сонгогдсон. Шинэхэн далайн хүнс, дакганжон (амттай шарсан тахиа), орон нутгийн гудамжны хоолоор дүүрэн амьд зах.",
    category: "attraction", region: "Sokcho", lat: 38.2045, lng: 128.5901,
    address: "강원특별자치도 속초시 중앙로147번길 16", featured: true
  },
  {
    name: "Abai Village & Gaetbae Ferry", name_ko: "아바이마을 & 갯배",
    name_id: "Desa Abai & Feri Gaetbae", name_mn: "Абай тосгон & Гэтбэ завь",
    desc: "Historic village formed by North Korean war refugees, known for mural paintings and traditional cuisine. The hand-pulled gaetbae ferry crossing Cheongchoho Lake is a uniquely charming experience.",
    desc_ko: "한국전쟁 실향민이 형성한 역사적 마을. 벽화와 전통 음식으로 유명하며, 청초호를 건너는 손으로 끄는 갯배 체험이 독특한 매력입니다.",
    desc_id: "Desa bersejarah yang dibentuk pengungsi perang Korea Utara, terkenal dengan mural dan masakan tradisional. Feri gaetbae yang ditarik tangan melintasi Danau Cheongchoho adalah pengalaman unik.",
    desc_mn: "Хойд Солонгосын дайны дүрвэгчдийн үүсгэсэн түүхэн тосгон. Ханын зураг, уламжлалт хоолоор алдартай. Чонгчохо нуурыг гараар татдаг гэтбэ завиар гатлах нь онцгой туршлага.",
    category: "attraction", region: "Sokcho", lat: 38.2007, lng: 128.5949,
    address: "강원특별자치도 속초시 청호동"
  },
  {
    name: "Gyeongpo Beach", name_ko: "경포해변",
    name_id: "Pantai Gyeongpo", name_mn: "Гёнпо далайн эрэг",
    desc: "The largest and most famous beach on Korea's east coast, stretching 1.8km of fine white sand. Located between Gyeongpoho Lake and the East Sea, it is the heart of Gangneung's cafe culture and coffee festival.",
    desc_ko: "한국 동해안 최대 해변으로 1.8km 고운 백사장이 펼쳐집니다. 경포호와 동해 사이에 위치해 강릉 카페 문화와 커피 축제의 중심지입니다.",
    desc_id: "Pantai terbesar dan paling terkenal di pantai timur Korea, membentang 1,8km pasir putih halus. Terletak antara Danau Gyeongpoho dan Laut Timur, jantung budaya kafe Gangneung.",
    desc_mn: "Солонгосын зүүн эргийн хамгийн том, алдарт далайн эрэг. 1.8 км нарийн цагаан элстэй. Гёнпохо нуур ба Зүүн тэнгисийн хооронд байрлах Ганнёнгийн кафе соёлын төв.",
    category: "nature", region: "Gangneung", lat: 37.8056, lng: 128.9077,
    address: "강원특별자치도 강릉시 강문동", featured: true
  },
  {
    name: "Seoraksan National Park", name_ko: "설악산 국립공원",
    name_id: "Taman Nasional Seoraksan", name_mn: "Сорак уулын үндэсний цэцэрлэгт хүрээлэн",
    desc: "Korea's most iconic mountain national park with dramatic granite peaks, pristine valleys, and ancient temples. Take the cable car for breathtaking views or hike to Ulsanbawi Rock. Best in autumn.",
    desc_ko: "극적인 화강암 봉우리, 청정 계곡, 고찰이 어우러진 한국 대표 국립공원. 케이블카로 절경을 감상하거나 울산바위까지 등산할 수 있으며 가을 단풍이 절정입니다.",
    desc_id: "Taman nasional gunung paling ikonik Korea dengan puncak granit dramatis, lembah murni, dan kuil kuno. Naik kereta gantung untuk pemandangan menakjubkan atau mendaki ke Ulsanbawi Rock. Terbaik di musim gugur.",
    desc_mn: "Хурц хадан оргил, цэвэр хөндий, эртний сүмүүдтэй Солонгосын хамгийн бэлгэдэлт уулын үндэсний цэцэрлэгт хүрээлэн. Кабель карт суугаад гайхалтай үзэмж, Ульсанбави хад руу авирах. Намар хамгийн сайхан.",
    category: "nature", region: "Sokcho", lat: 38.1197, lng: 128.4656,
    address: "강원특별자치도 속초시 설악산로 1091", featured: true
  }
];

// === JEONJU (4) ===
const JEONJU_SPOTS = [
  {
    name: "Jeonju Hanok Village", name_ko: "전주한옥마을",
    name_id: "Desa Hanok Jeonju", name_mn: "Жонжү Ханок тосгон",
    desc: "A beautifully preserved village with over 800 traditional Korean hanok houses. Offers hanbok rental, traditional crafts, and stunning photo opportunities hugely popular on Instagram and TikTok.",
    desc_ko: "800채 이상의 전통 한옥이 보존된 아름다운 마을. 한복 대여, 전통 공예 체험, SNS에서 큰 인기를 끄는 포토존이 가득합니다.",
    desc_id: "Desa indah dengan lebih dari 800 rumah hanok tradisional Korea. Menawarkan penyewaan hanbok, kerajinan tradisional, dan spot foto yang sangat populer di Instagram dan TikTok.",
    desc_mn: "800 гаруй уламжлалт ханок байшинтай үзэсгэлэнтэй тосгон. Ханбок түрээс, уламжлалт гар урлал, Instagram/TikTok-д маш алдартай зураг авахуулах цэгүүдтэй.",
    category: "attraction", region: "Jeonju", lat: 35.8151, lng: 127.1530,
    address: "전북특별자치도 전주시 완산구 기린대로 99", featured: true
  },
  {
    name: "Jeonju Hyanggyo", name_ko: "전주향교",
    name_id: "Jeonju Hyanggyo (Akademi Konfusius)", name_mn: "Жонжү Хянгё (Күнзийн академи)",
    desc: "A Joseon-era Confucian academy famous for its magnificent 600-year-old ginkgo trees creating a golden carpet in autumn. The serene grounds with traditional architecture are one of Korea's most viral photo spots.",
    desc_ko: "600년 된 은행나무가 가을에 황금 카펫을 만드는 조선시대 향교. 전통 건축과 고즈넉한 분위기가 한국에서 가장 바이럴한 포토스팟 중 하나입니다.",
    desc_id: "Akademi Konfusius era Joseon dengan pohon ginkgo berusia 600 tahun yang menciptakan karpet emas di musim gugur. Halaman tenang dengan arsitektur tradisional adalah spot foto paling viral di Korea.",
    desc_mn: "600 жилийн настай хошнуур модод намар алтан хивс бүрддэг Жосон эриний Күнзийн академи. Уламжлалт архитектуртай тайван газар нь Солонгосын хамгийн вайрал зургийн цэг.",
    category: "attraction", region: "Jeonju", lat: 35.8122, lng: 127.1572,
    address: "전북특별자치도 전주시 완산구 향교길 139"
  },
  {
    name: "Nambu Traditional Market", name_ko: "전주 남부시장",
    name_id: "Pasar Tradisional Nambu", name_mn: "Намбу уламжлалт зах",
    desc: "Operating since 1905, this vibrant market is a foodie paradise with creative street food. The night market is especially popular with young visitors, offering everything from bean sprout soup to fusion snacks.",
    desc_ko: "1905년부터 운영된 전통시장. 창의적인 길거리 음식이 가득한 미식 천국이며, 야시장은 젊은 방문객들에게 특히 인기입니다.",
    desc_id: "Beroperasi sejak 1905, pasar yang semarak ini adalah surga foodies dengan street food kreatif. Pasar malam sangat populer di kalangan pengunjung muda.",
    desc_mn: "1905 оноос ажиллаж буй энэ амьд зах нь бүтээлч гудамжны хоолтой хоолны диваажин. Шөнийн зах нь залуу зочдод онцгой алдартай.",
    category: "food", region: "Jeonju", lat: 35.8124, lng: 127.1466,
    address: "전북특별자치도 전주시 완산구 풍남문2길 63", featured: true
  },
  {
    name: "Jeondong Catholic Cathedral", name_ko: "전동성당",
    name_id: "Katedral Katolik Jeondong", name_mn: "Жондон Католик сүм",
    desc: "A stunning Romanesque-Byzantine church built in 1914, located at the entrance of Hanok Village. Its red-brick facade is one of Jeonju's most photographed landmarks and a popular K-drama filming location.",
    desc_ko: "1914년 건축된 로마네스크-비잔틴 양식의 아름다운 성당. 한옥마을 입구에 위치해 붉은 벽돌 외관이 전주의 가장 많이 촬영되는 랜드마크입니다.",
    desc_id: "Gereja Romanesque-Bizantium indah yang dibangun tahun 1914, terletak di pintu masuk Desa Hanok. Fasad bata merahnya adalah salah satu landmark paling banyak difoto di Jeonju.",
    desc_mn: "1914 онд баригдсан Романеск-Византийн загварын гоё сүм. Ханок тосгоны үүдэнд байрлах улаан тоосгон нүүр нь Жонжүгийн хамгийн олон зураг авахуулсан дурсгалт газар.",
    category: "attraction", region: "Jeonju", lat: 35.8138, lng: 127.1527,
    address: "전북특별자치도 전주시 완산구 태조로 51"
  }
];

// === GYEONGJU (4) ===
const GYEONGJU_SPOTS = [
  {
    name: "Bulguksa Temple", name_ko: "불국사",
    name_id: "Kuil Bulguksa", name_mn: "Бүлгүкса сүм",
    desc: "A UNESCO World Heritage Site and masterpiece of Silla Buddhist art dating to 774 AD. Home to six National Treasures including Dabotap and Seokgatap pagodas, set among beautiful mountain gardens.",
    desc_ko: "774년 창건된 유네스코 세계유산이자 신라 불교 예술의 걸작. 다보탑, 석가탑 등 6점의 국보를 보유한 아름다운 산중 사찰입니다.",
    desc_id: "Situs Warisan Dunia UNESCO dan mahakarya seni Buddha Silla dari tahun 774 M. Rumah enam Harta Nasional termasuk pagoda Dabotap dan Seokgatap di taman pegunungan yang indah.",
    desc_mn: "ЮНЕСКО-гийн дэлхийн өв, МЭ 774 оны Шилла Буддын урлагийн шилдэг бүтээл. Даботап, Сокгатап суварга зэрэг 6 үндэсний эрдэнэстэй уулын цэцэрлэгт хүрээлэнд байрладаг.",
    category: "attraction", region: "Gyeongju", lat: 35.7906, lng: 129.3322,
    address: "경상북도 경주시 불국로 385", featured: true
  },
  {
    name: "Daereungwon Tomb Complex", name_ko: "대릉원",
    name_id: "Kompleks Makam Daereungwon", name_mn: "Дэрёнвон булшны цогцолбор",
    desc: "A royal burial ground with 23 massive ancient Silla dynasty tombs creating an otherworldly landscape. Walk among grass-covered mounds and enter the illuminated Cheonmachong (Heavenly Horse Tomb).",
    desc_ko: "23기의 거대한 신라 왕릉이 이색적인 풍경을 만드는 왕릉 단지. 잔디 덮인 능 사이를 걸으며 천마총 내부 조명 전시를 관람할 수 있습니다.",
    desc_id: "Kompleks pemakaman kerajaan dengan 23 makam dinasti Silla kuno yang menciptakan lanskap dunia lain. Jelajahi gundukan berumput dan masuk ke Cheonmachong (Makam Kuda Surgawi) yang terang.",
    desc_mn: "23 том эртний Шилла хаант улсын булш бүхий хааны оршуулгын газар. Өвсөөр бүрхэгдсэн овоо дунд алхаж, гэрэлтсэн Чонмачон (Тэнгэрийн морины булш)-д ороорой.",
    category: "attraction", region: "Gyeongju", lat: 35.8392, lng: 129.2107,
    address: "경상북도 경주시 황남동 계림로 9", featured: true
  },
  {
    name: "Cheomseongdae Observatory", name_ko: "첨성대",
    name_id: "Observatorium Cheomseongdae", name_mn: "Чомсондэ одон орны газар",
    desc: "The oldest surviving astronomical observatory in East Asia, built during the Silla dynasty around 634 AD. Beautifully illuminated at night near Wolji Pond, making a perfect evening walking course.",
    desc_ko: "634년경 신라시대에 건축된 동아시아 최고(最古) 천문 관측 시설. 야간 조명이 아름답고 월지(안압지) 인근에 위치해 저녁 산책 코스로 완벽합니다.",
    desc_id: "Observatorium astronomi tertua yang masih berdiri di Asia Timur, dibangun pada era Silla sekitar 634 M. Diterangi indah di malam hari dekat Kolam Wolji untuk jalan malam sempurna.",
    desc_mn: "МЭ 634 онд Шилла эриний үед баригдсан Зүүн Азийн хамгийн эртний одон орны хяналтын газар. Шөнийн гэрэлтүүлэг үзэсгэлэнтэй, Вольжи нуурын ойролцоо оройн зугаалгаанд тохиромжтой.",
    category: "attraction", region: "Gyeongju", lat: 35.8348, lng: 129.2190,
    address: "경상북도 경주시 인왕동 839-1"
  },
  {
    name: "Hwangnidan-gil Street", name_ko: "황리단길",
    name_id: "Jalan Hwangnidan-gil", name_mn: "Хванниданғиль гудамж",
    desc: "Gyeongju's trendiest street with 400+ shops, cafes, and restaurants in converted hanok buildings. Known as the 'Gyeongnidan-gil of Gyeongju' — the go-to spot for Instagram-worthy food and vintage shops.",
    desc_ko: "개조된 한옥 건물에 400개 이상의 상점, 카페, 레스토랑이 있는 경주 최고의 트렌디 거리. '경주의 경리단길'로 불리며 인스타그래머블한 맛집과 빈티지숍이 가득합니다.",
    desc_id: "Jalan paling trendi Gyeongju dengan 400+ toko, kafe, dan restoran di bangunan hanok. Dijuluki 'Gyeongnidan-gil Gyeongju' untuk makanan Instagramable dan toko vintage.",
    desc_mn: "Хувиргасан ханок барилгуудад 400+ дэлгүүр, кафе, рестораны бүхий Гёнжүгийн хамгийн тренди гудамж. Instagram-д зүй зохистой хоолны газар, винтаж дэлгүүрүүдээр дүүрэн.",
    category: "cafe", region: "Gyeongju", lat: 35.8375, lng: 129.2100,
    address: "경상북도 경주시 포석로 1080", featured: true
  }
];

// === YEOSU (3) ===
const YEOSU_SPOTS = [
  {
    name: "Yeosu Maritime Cable Car", name_ko: "여수 해상케이블카",
    name_id: "Kereta Gantung Laut Yeosu", name_mn: "Ёсу далайн кабель кар",
    desc: "Korea's first ocean-crossing cable car spanning 1.5km between mainland and Dolsan Island. Choose the crystal-floor cabin for a thrilling see-through experience. The night ride over illuminated sea is breathtaking.",
    desc_ko: "본토와 돌산도를 잇는 1.5km 한국 최초 해상 케이블카. 크리스탈 바닥 캐빈으로 스릴을 만끽하세요. 야간 탑승 시 조명 빛나는 바다 위를 지나는 경험이 환상적입니다.",
    desc_id: "Kereta gantung penyeberangan laut pertama Korea sepanjang 1,5km antara daratan dan Pulau Dolsan. Pilih kabin lantai kristal untuk pengalaman melihat ke bawah yang mendebarkan. Perjalanan malam di atas laut yang diterangi sangat menakjubkan.",
    desc_mn: "Эх газар ба Долсан аралын хооронд 1.5 км урттай Солонгосын анхны далайг гатлах кабель кар. Тунгалаг шалтай бүхээгээр адал явдал мэдрэх. Шөнийн гэрэлтсэн далай дээгүүр нислэг гайхалтай.",
    category: "attraction", region: "Yeosu", lat: 34.7403, lng: 127.7529,
    address: "전라남도 여수시 돌산읍 돌산로 3600-1", featured: true
  },
  {
    name: "Odongdo Island", name_ko: "오동도",
    name_id: "Pulau Odongdo", name_mn: "Одондо арал",
    desc: "A beautiful island connected by a 768m breakwater path. Famous for camellia flowers from December to March, with scenic coastal walking trails and dramatic cliff views of the South Sea.",
    desc_ko: "768m 방파제 길로 연결된 아름다운 섬. 12~3월 동백꽃으로 유명하며, 해안 산책로와 남해의 극적인 절벽 전망이 일품입니다.",
    desc_id: "Pulau indah yang terhubung oleh jalan pemecah ombak 768m. Terkenal dengan bunga kamellia dari Desember hingga Maret, dengan jalur jalan kaki pantai dan pemandangan tebing dramatis Laut Selatan.",
    desc_mn: "768м далан замаар холбогдсон үзэсгэлэнтэй арал. 12-3 сар камели цэцгээрээ алдартай, эргийн зүүн зам, Өмнөд тэнгисийн хадны гайхалтай харагдах байдалтай.",
    category: "nature", region: "Yeosu", lat: 34.7453, lng: 127.7666,
    address: "전라남도 여수시 오동도로 222"
  },
  {
    name: "Yeosu Expo Ocean Park", name_ko: "여수엑스포 해양공원",
    name_id: "Taman Laut Expo Yeosu", name_mn: "Ёсу Экспо далайн цэцэрлэг",
    desc: "Legacy site of Expo 2012 transformed into a dynamic waterfront park. Features the Big-O water show, aquarium, and Sky Tower. The 'Yeosu Night Sea' view inspired the famous Busker Busker song.",
    desc_ko: "2012 엑스포 부지를 활용한 해양공원. 빅오 워터쇼, 아쿠아리움, 스카이타워가 있으며 '여수밤바다' 노래의 영감이 된 야경이 유명합니다.",
    desc_id: "Situs warisan Expo 2012 yang diubah menjadi taman tepi laut dinamis. Menampilkan pertunjukan air Big-O, akuarium, dan Sky Tower. Pemandangan 'Laut Malam Yeosu' menginspirasi lagu terkenal Busker Busker.",
    desc_mn: "2012 оны Экспо-ын бүсийг хувиргасан далайн эргийн цэцэрлэг. Биг-О усны шоу, аквариум, Скай Тауэр. 'Ёсу шөнийн далай' үзэмж нь алдарт Busker Busker дууг сэдэв болгосон.",
    category: "attraction", region: "Yeosu", lat: 34.7428, lng: 127.7417,
    address: "전라남도 여수시 박람회길 1", featured: true
  }
];

// === DAEGU (3) ===
const DAEGU_SPOTS = [
  {
    name: "Seomun Market", name_ko: "서문시장",
    name_id: "Pasar Seomun", name_mn: "Сомүн зах",
    desc: "Daegu's largest traditional market with 4,000+ shops and 400+ years of history. The vibrant night market with Korean street food is a must-visit for experiencing authentic local culture.",
    desc_ko: "400년 이상 역사의 대구 최대 전통시장. 4,000여 점포와 활기찬 야시장의 길거리 음식으로 한국 서민 문화를 체험할 수 있는 필수 명소입니다.",
    desc_id: "Pasar tradisional terbesar Daegu dengan 4.000+ toko dan 400+ tahun sejarah. Pasar malam yang semarak dengan street food Korea wajib dikunjungi untuk mengalami budaya lokal autentik.",
    desc_mn: "400+ жилийн түүхтэй, 4,000+ дэлгүүртэй Дэгүгийн хамгийн том уламжлалт зах. Солонгосын гудамжны хоолтой амьд шөнийн зах нь жинхэнэ орон нутгийн соёлыг мэдрэх газар.",
    category: "food", region: "Daegu", lat: 35.8694, lng: 128.5774,
    address: "대구광역시 중구 큰장로26길 45", featured: true
  },
  {
    name: "Dongseongro Cafe Alley", name_ko: "동성로 카페거리",
    name_id: "Gang Kafe Dongseongro", name_mn: "Донсонно кафе гудамж",
    desc: "Daegu is Korea's coffee capital with most cafes per capita, and this 180-meter alley is its heart. Unique independent cafes with no major chains, each with its own character. Viral on Korean social media.",
    desc_ko: "1인당 카페 수 전국 1위 대구의 중심, 180m 카페 골목. 대형 프랜차이즈 없이 개성 넘치는 독립 카페만으로 구성되어 한국 SNS에서 화제입니다.",
    desc_id: "Daegu adalah ibukota kopi Korea dengan kafe per kapita terbanyak, dan gang 180 meter ini adalah jantungnya. Kafe independen unik tanpa jaringan besar, masing-masing berkarakter sendiri.",
    desc_mn: "Дэгү бол нэг хүнд ногдох кафены тоогоор Солонгосын кофены нийслэл бөгөөд энэ 180м гудамж нь түүний зүрх. Томоохон сүлжээ байхгүй, өвөрмөц бие даасан кафенууд.",
    category: "cafe", region: "Daegu", lat: 35.8700, lng: 128.5966,
    address: "대구광역시 중구 동성로4길", featured: true
  },
  {
    name: "Suseongmot Lake", name_ko: "수성못",
    name_id: "Danau Suseongmot", name_mn: "Сүсонмот нуур",
    desc: "Scenic lakeside park surrounded by mountains, popular for paddle boats and waterside cafes. May to October features spectacular music fountain shows at night. Stunning sunset views.",
    desc_ko: "산으로 둘러싸인 호수공원. 패들보트와 수변 카페로 인기이며 5~10월 밤에는 화려한 음악분수쇼가 펼쳐집니다. 일몰 전망이 아름답습니다.",
    desc_id: "Taman danau indah dikelilingi pegunungan, populer untuk perahu dayung dan kafe tepi air. Mei-Oktober menampilkan pertunjukan air mancur musik spektakuler di malam hari.",
    desc_mn: "Уулсаар хүрээлэгдсэн нуурын цэцэрлэг. Сэлүүр завь, усны хажуугийн кафенуудаар алдартай. 5-10 сар шөнө хөгжмийн усан оргилуурын шоу. Наран жаргалтын гоё үзэмж.",
    category: "nature", region: "Daegu", lat: 35.8285, lng: 128.6263,
    address: "대구광역시 수성구 두산동"
  }
];

// === INCHEON (3) ===
const INCHEON_SPOTS = [
  {
    name: "Incheon Chinatown", name_ko: "인천 차이나타운",
    name_id: "Chinatown Incheon", name_mn: "Инчон Хятадын хороолол",
    desc: "Korea's largest and oldest Chinatown, birthplace of Jajangmyeon (black bean noodles). Colorful streets filled with Chinese restaurants, street food, and cultural landmarks across from Incheon Station.",
    desc_ko: "한국 최대·최고(最古) 차이나타운이자 자장면의 발상지. 인천역 맞은편 알록달록한 거리에 중국 음식점, 길거리 음식, 문화 명소가 가득합니다.",
    desc_id: "Chinatown terbesar dan tertua di Korea, tempat lahirnya Jajangmyeon (mi kacang hitam). Jalan-jalan berwarna penuh restoran Cina, street food, dan landmark budaya di depan Stasiun Incheon.",
    desc_mn: "Солонгосын хамгийн том, хамгийн эртний Хятадын хороолол, Жажанмён (хар шошны гоймон)-ий төрсөн нутаг. Инчон станцын чанхнаа өнгөлөг гудамжинд Хятад ресторан, хоол, соёлын газрууд.",
    category: "food", region: "Incheon", lat: 37.4752, lng: 126.6178,
    address: "인천광역시 중구 차이나타운로59번길 20", featured: true
  },
  {
    name: "Wolmido Island", name_ko: "월미도",
    name_id: "Pulau Wolmido", name_mn: "Вольмидо арал",
    desc: "A lively coastal island with seaside boardwalk, seafood restaurants, and amusement park with Ferris wheel. The Wolmi Sea Train, Korea's longest urban monorail (6.1km), offers breathtaking ocean views.",
    desc_ko: "해변 산책로, 해산물 식당, 대관람차 있는 놀이공원의 활기찬 해안 섬. 한국 최장 도시 모노레일(6.1km) 월미바다열차로 탁 트인 바다를 감상하세요.",
    desc_id: "Pulau pesisir yang ramai dengan boardwalk tepi laut, restoran seafood, dan taman hiburan dengan bianglala. Wolmi Sea Train, monorel kota terpanjang Korea (6,1km), menawarkan pemandangan laut menakjubkan.",
    desc_mn: "Далайн эргийн зүүн зам, далайн хүнсний ресторан, том дугуйтай зугаа цэнгэлийн хүрээлэнтэй. Солонгосын хамгийн урт хотын монорельс Вольми далайн галт тэрэг (6.1 км) далайн үзэмжтэй.",
    category: "attraction", region: "Incheon", lat: 37.4747, lng: 126.5978,
    address: "인천광역시 중구 월미문화로 36", featured: true
  },
  {
    name: "Songwol-dong Fairy Tale Village", name_ko: "송월동 동화마을",
    name_id: "Desa Dongeng Songwol-dong", name_mn: "Сонволь-дон үлгэрийн тосгон",
    desc: "A charming neighborhood transformed into a fairy tale wonderland with colorful murals depicting Dorothy, Little Red Riding Hood, and Korean folk tales across 11 themed roads. 5-min walk from Chinatown.",
    desc_ko: "11개 테마 거리에 도로시, 빨간 모자, 한국 민담을 그린 알록달록 벽화가 가득한 동화 마을. 차이나타운에서 도보 5분 거리입니다.",
    desc_id: "Lingkungan menawan yang diubah menjadi negeri dongeng dengan mural berwarna-warni menggambarkan Dorothy, Little Red Riding Hood, dan cerita rakyat Korea di 11 jalan bertema. 5 menit jalan kaki dari Chinatown.",
    desc_mn: "Доротий, Улаан малгайт, Солонгос ардын үлгэрүүдийн өнгөлөг ханын зурагтай 11 сэдэвт гудамжтай үлгэрийн дэлхий. Хятадын хороллоос явган 5 минут.",
    category: "attraction", region: "Incheon", lat: 37.4762, lng: 126.6155,
    address: "인천광역시 중구 동화마을길 38"
  }
];

// === SUWON (2) ===
const SUWON_SPOTS = [
  {
    name: "Hwaseong Fortress", name_ko: "수원 화성",
    name_id: "Benteng Hwaseong", name_mn: "Хвасон цайз",
    desc: "A UNESCO World Heritage Site built in 1796 by King Jeongjo. The magnificent 5.7km fortress wall offers panoramic city views, daily martial arts at Hwaseong Haenggung Palace, and a tourist train.",
    desc_ko: "1796년 정조가 축조한 유네스코 세계유산. 5.7km 성곽을 따라 도시 전경을 감상하고, 화성행궁 무예 공연과 관광열차도 즐길 수 있습니다.",
    desc_id: "Situs Warisan Dunia UNESCO yang dibangun tahun 1796 oleh Raja Jeongjo. Tembok benteng 5,7km menawarkan pemandangan kota panoramis, pertunjukan seni bela diri di Istana Hwaseong Haenggung, dan kereta wisata.",
    desc_mn: "1796 онд Жонжо хаан баригдуулсан ЮНЕСКО-гийн дэлхийн өв. 5.7 км цайзны хана хотын тойрог үзэмж, Хвасон Хэнгүн ордны тулааны урлагийн тоглолт, аялалын галт тэрэгтэй.",
    category: "attraction", region: "Suwon", lat: 37.2871, lng: 127.0119,
    address: "경기도 수원시 팔달구 정조로 910", featured: true
  },
  {
    name: "Suwon Chicken Street", name_ko: "수원 통닭거리",
    name_id: "Jalan Ayam Goreng Suwon", name_mn: "Сувон тахианы гудамж",
    desc: "A legendary 100-meter alley of fried chicken restaurants with 50+ years of tradition since 1970. Famous for whole chickens fried in traditional iron pots, offering a crispy texture you can't find elsewhere.",
    desc_ko: "1970년부터 50년 이상 전통의 통닭 골목. 가마솥에 튀기는 전통 방식의 바삭한 통닭으로 유명하며, 화성 관광 후 들르기 완벽한 먹거리 골목입니다.",
    desc_id: "Gang legendaris 100 meter penuh restoran ayam goreng dengan tradisi 50+ tahun sejak 1970. Terkenal dengan ayam utuh yang digoreng dalam panci besi tradisional dengan tekstur super renyah.",
    desc_mn: "1970 оноос хойш 50+ жилийн уламжлалтай 100м урт шарсан тахианы ресторануудын алдарт гудамж. Уламжлалт төмөр тогоонд шарсан бүтэн тахиа нь бусад газраас олдохгүй шарсан амтаар алдартай.",
    category: "food", region: "Suwon", lat: 37.2795, lng: 127.0147,
    address: "경기도 수원시 팔달구 정조로800번길 16"
  }
];

// === SEOUL EXTRA (8) - Hongdae, Hannam, Jamsil, Bukchon, Mangwon ===
const SEOUL_EXTRA_SPOTS = [
  {
    name: "943 King's Cross", name_ko: "943 킹스크로스",
    name_id: "943 King's Cross", name_mn: "943 Кингс Кросс",
    desc: "Harry Potter-themed cafe spanning 8 floors in Hongdae. Each floor has a different wizarding world theme. One of Seoul's most viral themed cafes on TikTok and Instagram.",
    desc_ko: "홍대 8층 규모의 해리포터 테마 카페. 층마다 다른 마법 세계 테마로 꾸며져 틱톡과 인스타그램에서 큰 인기를 끌고 있는 서울 핫플레이스입니다.",
    desc_id: "Kafe bertema Harry Potter berlantai 8 di Hongdae. Setiap lantai bertema dunia sihir berbeda. Salah satu kafe tematik paling viral di Seoul di TikTok dan Instagram.",
    desc_mn: "Хонгдэ дэх 8 давхар Харри Поттер загварын кафе. Давхар бүр ид шидийн өөр өөр загвартай. Сөүлийн TikTok, Instagram-д хамгийн их цацагдсан кафенуудын нэг.",
    category: "cafe", region: "Hongdae", lat: 37.5563, lng: 126.9238,
    address: "서울특별시 마포구 양화로16길 24", featured: true
  },
  {
    name: "Gyeongui Line Forest Park", name_ko: "경의선숲길 (연트럴파크)",
    name_id: "Gyeongui Line Forest Park", name_mn: "Гёнүй шугамын ойн зам",
    desc: "Converted railway turned into a 6.3km urban greenway, nicknamed 'Yeontral Park'. The Yeonnam-dong section is lined with trendy cafes, bars, and restaurants. Seoul's answer to New York's High Line.",
    desc_ko: "폐선로를 도심 녹지로 변신시킨 6.3km 공원. 연남동 구간은 트렌디한 카페, 바, 레스토랑이 즐비한 '연트럴파크'로 불리며 젊은층에게 큰 인기입니다.",
    desc_id: "Bekas jalur kereta diubah menjadi taman hijau 6,3km, dijuluki 'Yeontral Park'. Bagian Yeonnam-dong penuh kafe, bar, dan restoran trendi. Jawaban Seoul untuk High Line New York.",
    desc_mn: "Хуучин төмөр замыг 6.3 км хотын ногоон бүсэд хувиргасан. Ённам-дон хэсэг нь загварлаг кафе, баар, рестораноор дүүрэн 'Ёнтрал парк' нэрээр алдартай.",
    category: "nature", region: "Hongdae", lat: 37.5608, lng: 126.9239,
    address: "서울특별시 마포구 연남동 경의선숲길"
  },
  {
    name: "Leeum Museum of Art", name_ko: "리움미술관",
    name_id: "Museum Seni Leeum", name_mn: "Лиум урлагийн музей",
    desc: "Samsung's world-class art museum designed by three legendary architects: Mario Botta, Jean Nouvel, and Rem Koolhaas. Houses both traditional Korean art and cutting-edge contemporary works in Hannam-dong.",
    desc_ko: "마리오 보타, 장 누벨, 렘 쿨하스 3인의 건축 거장이 설계한 삼성 미술관. 한국 전통 미술과 현대 미술을 아우르는 한남동 필수 문화 명소입니다.",
    desc_id: "Museum seni kelas dunia Samsung dirancang tiga arsitek legendaris: Mario Botta, Jean Nouvel, dan Rem Koolhaas. Memamerkan seni tradisional Korea dan karya kontemporer di Hannam-dong.",
    desc_mn: "Марио Ботта, Жан Нувель, Рем Кулхаас 3 алдарт архитектор зохиосон Самсунгийн урлагийн музей. Уламжлалт Солонгос урлаг, орчин үеийн бүтээлүүдтэй Ханнам-донгийн соёлын газар.",
    category: "attraction", region: "Hannam-dong", lat: 37.5383, lng: 126.9990,
    address: "서울특별시 용산구 이태원로55길 60-16", featured: true
  },
  {
    name: "The Truffle Bakery", name_ko: "더트러플베이커리",
    name_id: "The Truffle Bakery", name_mn: "Трюфель бейкери",
    desc: "Viral bakery in Hannam-dong famous for pull-apart tissue bread and truffle-infused pastries. Opened in 2024, it quickly became one of Seoul's most talked-about bakeries on TikTok and Korean SNS.",
    desc_ko: "한남동의 바이럴 베이커리. 겹겹이 찢어 먹는 티슈 브레드와 트러플 페이스트리로 2024년 오픈 직후 틱톡과 한국 SNS에서 화제가 된 핫플레이스입니다.",
    desc_id: "Toko roti viral di Hannam-dong terkenal dengan tissue bread dan pastry truffle. Dibuka 2024, langsung menjadi salah satu toko roti paling populer di Seoul di TikTok dan SNS Korea.",
    desc_mn: "Ханнам-дон дахь вирал талхны газар. Давхарлаж татаж идэх тишью талх, трюфель жигнэмэгээрээ алдартай. 2024 онд нээгдэж TikTok, Солонгос SNS-д хурдан алдаршсан.",
    category: "food", region: "Hannam-dong", lat: 37.5348, lng: 126.9974,
    address: "서울특별시 용산구 대사관로5길 19"
  },
  {
    name: "Seokchon Lake Park", name_ko: "석촌호수공원",
    name_id: "Taman Danau Seokchon", name_mn: "Сокчон нуурын цэцэрлэг",
    desc: "Scenic lake park next to Lotte World Tower with 2.5km walking trail. Famous for cherry blossom festival in spring with 1,100 trees. Nighttime illuminations and lake reflections of Lotte Tower are Instagram gold.",
    desc_ko: "롯데월드타워 옆 2.5km 산책로의 호수 공원. 봄 벚꽃축제 시즌 1,100그루의 벚나무가 장관이며, 야간 조명과 롯데타워 호수 반영이 인스타그램에서 인기입니다.",
    desc_id: "Taman danau indah di sebelah Lotte World Tower dengan jalur 2,5km. Terkenal dengan festival sakura di musim semi (1.100 pohon). Iluminasi malam dan refleksi Lotte Tower di danau sangat Instagrammable.",
    desc_mn: "Лотте Ворлд Тауэрын хажууд 2.5 км явган замтай нуурын цэцэрлэг. Хавар 1,100 интоорын мод цэцэглэх баяраар алдартай. Шөнийн гэрэлтүүлэг, Лотте тауэрын тусгал Instagram-д алдартай.",
    category: "nature", region: "Jamsil", lat: 37.5100, lng: 127.1030,
    address: "서울특별시 송파구 잠실동 석촌호수", featured: true
  },
  {
    name: "Bukchon Hanok Village", name_ko: "북촌한옥마을",
    name_id: "Desa Hanok Bukchon", name_mn: "Бүкчон Ханок тосгон",
    desc: "Historic village of traditional hanok houses between Gyeongbokgung and Changdeokgung palaces. Bukchon-ro 11-gil is the most photographed alley. Wearing hanbok for photos is a quintessential Seoul experience.",
    desc_ko: "경복궁과 창덕궁 사이 전통 한옥이 밀집한 역사 마을. 북촌로 11길이 가장 유명한 포토스팟이며, 한복을 입고 사진 찍는 것이 서울 필수 체험입니다.",
    desc_id: "Desa bersejarah rumah hanok tradisional antara Istana Gyeongbokgung dan Changdeokgung. Bukchon-ro 11-gil adalah gang paling banyak difoto. Berfoto dengan hanbok di sini adalah pengalaman wajib Seoul.",
    desc_mn: "Гёнбокгүн, Чандокгүн ордны хооронд байрлах уламжлалт ханок тосгон. Бүкчон-ро 11-гил хамгийн алдартай зургийн газар. Ханбок өмсөж зураг авахуулах Сөүлийн гол туршлага.",
    category: "attraction", region: "Bukchon", lat: 37.5815, lng: 126.9850,
    address: "서울특별시 종로구 계동길 37", featured: true
  },
  {
    name: "Ikseon-dong Hanok Alley", name_ko: "익선동 한옥골목",
    name_id: "Gang Hanok Ikseon-dong", name_mn: "Иксон-дон Ханок гудамж",
    desc: "Trendy neighborhood of 1920s hanok converted into hip cafes, restaurants, and boutiques. Known for salt bread cafes and souffle French toast. Seoul's hottest hidden gem for cafe-hopping.",
    desc_ko: "1920년대 한옥을 힙한 카페, 레스토랑, 부티크로 개조한 트렌디 골목. 소금빵 카페, 수플레 프렌치 토스트 등으로 유명한 서울 핫플레이스입니다.",
    desc_id: "Lingkungan trendi berisi hanok 1920-an diubah menjadi kafe, restoran, dan butik hip. Terkenal dengan roti garam dan souffle French toast. Hidden gem Seoul terpanas untuk cafe-hopping.",
    desc_mn: "1920-аад оны ханокуудыг загварлаг кафе, ресторан, бутик болгон хувиргасан тренди хороолол. Давстай талх, суфле Франц тостоор алдартай Сөүлийн хамгийн дуртай нууц газар.",
    category: "attraction", region: "Ikseon-dong", lat: 37.5724, lng: 126.9920,
    address: "서울특별시 종로구 수표로28길 일대"
  },
  {
    name: "Mangwon Market", name_ko: "망원시장",
    name_id: "Pasar Mangwon", name_mn: "Мангвон зах",
    desc: "Authentic local market loved by Seoul's younger generation, less touristy than Gwangjang Market. Famous for affordable street food and tteokbokki. Perfect before a picnic at nearby Hangang Park.",
    desc_ko: "광장시장보다 덜 관광지화된 서울 MZ세대의 핫플 전통시장. 저렴한 길거리 음식과 떡볶이로 유명하며 한강공원 피크닉 전 장보기에 완벽합니다.",
    desc_id: "Pasar lokal autentik favorit generasi muda Seoul, lebih lokal dari Gwangjang Market. Terkenal dengan street food murah dan tteokbokki. Sempurna sebelum piknik di Hangang Park terdekat.",
    desc_mn: "Гванжан захаас бага жуулчинтай, Сөүлийн залуу үеийн дуртай орон нутгийн зах. Хямд гудамжны хоол, ттокбоккиор алдартай. Хан гангийн паркт пикник хийхээс өмнө тохиромжтой.",
    category: "food", region: "Mangwon-dong", lat: 37.5572, lng: 126.9058,
    address: "서울특별시 마포구 포은로8길 14"
  }
];

var ALL_REGIONS = {
  busan: BUSAN_SPOTS,
  seoul: SEOUL_SPOTS,
  jeju: JEJU_SPOTS,
  gangwon: GANGWON_SPOTS,
  jeonju: JEONJU_SPOTS,
  gyeongju: GYEONGJU_SPOTS,
  yeosu: YEOSU_SPOTS,
  daegu: DAEGU_SPOTS,
  incheon: INCHEON_SPOTS,
  suwon: SUWON_SPOTS,
  seoul2: SEOUL_EXTRA_SPOTS
};

module.exports = async function handler(req, res) {
  var region = req.query.region;
  var key = req.query.key;

  if (key !== 'seed2025') {
    return res.status(403).json({ error: 'Invalid key' });
  }

  var spots;
  if (region === 'all') {
    spots = [];
    Object.keys(ALL_REGIONS).forEach(function(k) {
      spots = spots.concat(ALL_REGIONS[k]);
    });
  } else if (ALL_REGIONS[region]) {
    spots = ALL_REGIONS[region];
  } else {
    return res.status(400).json({
      error: 'Invalid region',
      available: Object.keys(ALL_REGIONS).concat(['all'])
    });
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
