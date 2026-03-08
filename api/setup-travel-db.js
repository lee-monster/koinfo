// One-time setup script: Creates TravelKo Notion database with all properties and sample data
// Run via: https://your-domain/api/setup-travel-db?confirm=yes
// After setup, delete this file or remove from deployment

const { Client } = require('@notionhq/client');

module.exports = async function handler(req, res) {
  if (req.query.confirm !== 'yes') {
    return res.status(200).json({
      message: 'Add ?confirm=yes to run setup. This will create a TravelKo database in your Notion workspace.',
    });
  }

  const token = process.env.NOTION_TOKEN_TRAVEL;
  const parentPageId = process.env.NOTION_PAGE_TRAVEL; // Parent page ID to create DB under

  if (!token) {
    return res.status(400).json({ error: 'NOTION_TOKEN_TRAVEL not set' });
  }
  if (!parentPageId) {
    return res.status(400).json({ error: 'NOTION_PAGE_TRAVEL not set. Set it to your TravelKo page ID (31dcc0552bd980ecbf34d746eb0771ef)' });
  }

  const notion = new Client({ auth: token });

  try {
    // Step 1: Create database
    const db = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId },
      title: [{ type: 'text', text: { content: 'TravelKo Spots' } }],
      properties: {
        Name: { title: {} },
        Category: {
          select: {
            options: [
              { name: 'food', color: 'red' },
              { name: 'attraction', color: 'blue' },
              { name: 'cafe', color: 'yellow' },
              { name: 'nature', color: 'green' },
              { name: 'shopping', color: 'purple' },
              { name: 'nightlife', color: 'pink' },
            ],
          },
        },
        Region: {
          select: {
            options: [
              { name: 'Seoul', color: 'blue' },
              { name: 'Busan', color: 'orange' },
              { name: 'Jeju', color: 'green' },
              { name: 'Incheon', color: 'gray' },
              { name: 'Gyeonggi', color: 'brown' },
              { name: 'Other', color: 'default' },
            ],
          },
        },
        Description: { rich_text: {} },
        Latitude: { number: {} },
        Longitude: { number: {} },
        Address: { rich_text: {} },
        CoverImage: { url: {} },
        Instagram: { rich_text: {} },
        Rating: { number: {} },
        Featured: { checkbox: {} },
        Published: { checkbox: {} },
        SubmittedBy: { rich_text: {} },
        Tags: {
          multi_select: {
            options: [
              { name: 'hidden-gem', color: 'green' },
              { name: 'family', color: 'blue' },
              { name: 'date-spot', color: 'pink' },
              { name: 'solo-travel', color: 'purple' },
              { name: 'budget', color: 'yellow' },
              { name: 'luxury', color: 'orange' },
              { name: 'instagram', color: 'red' },
            ],
          },
        },
        Photos: { files: {} },
        NaverMapLink: { url: {} },
        Name_ko: { rich_text: {} },
        Name_id: { rich_text: {} },
        Name_mn: { rich_text: {} },
        Description_ko: { rich_text: {} },
        Description_id: { rich_text: {} },
        Description_mn: { rich_text: {} },
      },
    });

    const dbId = db.id;

    // Step 2: Insert sample data
    const samples = [
      {
        Name: 'Gyeongbokgung Palace', Name_ko: '경복궁', Name_id: 'Istana Gyeongbokgung', Name_mn: 'Кёнбоккүн ордон',
        Category: 'attraction', Region: 'Seoul',
        Description: 'The largest of the Five Grand Palaces built during the Joseon dynasty. A must-visit historical landmark in the heart of Seoul.',
        Description_ko: '조선 시대에 건축된 5대 궁궐 중 가장 큰 궁궐. 서울 중심부의 필수 방문 역사 명소입니다.',
        Description_id: 'Istana terbesar dari Lima Istana Besar yang dibangun pada era Dinasti Joseon.',
        Description_mn: 'Жосон гүрний үед баригдсан таван том ордны хамгийн том нь.',
        Latitude: 37.5796, Longitude: 126.977, Address: '161 Sajik-ro, Jongno-gu, Seoul',
        Rating: 4.8, Featured: true, Published: true,
        Tags: ['family', 'solo-travel', 'instagram'], Instagram: '@gyeongbokgung #경복궁 #seoul',
      },
      {
        Name: 'Myeongdong Shopping Street', Name_ko: '명동', Name_id: 'Jalan Belanja Myeongdong', Name_mn: 'Мёндон худалдааны гудамж',
        Category: 'shopping', Region: 'Seoul',
        Description: "Korea's busiest shopping district with cosmetics shops, street food, and fashion stores.",
        Description_ko: '화장품 가게, 길거리 음식, 패션 매장이 가득한 한국 최대의 쇼핑 거리.',
        Description_id: 'Distrik belanja tersibuk di Korea dengan toko kosmetik dan jajanan kaki lima.',
        Description_mn: 'Солонгосын хамгийн завгүй худалдааны дүүрэг.',
        Latitude: 37.5636, Longitude: 126.9869, Address: 'Myeongdong-gil, Jung-gu, Seoul',
        Rating: 4.3, Featured: true, Published: true,
        Tags: ['budget', 'instagram'], Instagram: '#myeongdong #명동 #kbeauty',
      },
      {
        Name: 'Namsan Seoul Tower', Name_ko: '남산서울타워', Name_id: 'Menara Namsan Seoul', Name_mn: 'Намсан Сөүл цамхаг',
        Category: 'attraction', Region: 'Seoul',
        Description: 'Iconic observation tower on Namsan Mountain. Famous for love locks and panoramic city views.',
        Description_ko: '남산 위의 상징적인 전망 타워. 사랑의 자물쇠와 파노라마 도시 전경으로 유명.',
        Description_id: 'Menara observasi ikonik di Gunung Namsan dengan pemandangan kota panoramik.',
        Description_mn: 'Намсан уулан дээрх алдартай ажиглалтын цамхаг.',
        Latitude: 37.5512, Longitude: 126.9882, Address: '105 Namsangongwon-gil, Yongsan-gu, Seoul',
        Rating: 4.5, Featured: false, Published: true,
        Tags: ['date-spot', 'instagram'], Instagram: '#namsantower #남산타워 #seoulview',
      },
      {
        Name: 'Gwangjang Market', Name_ko: '광장시장', Name_id: 'Pasar Gwangjang', Name_mn: 'Гванжан зах',
        Category: 'food', Region: 'Seoul',
        Description: "One of Korea's oldest traditional markets. Famous for bindaetteok, mayak gimbap, and authentic Korean street food.",
        Description_ko: '한국에서 가장 오래된 전통 시장. 빈대떡, 마약김밥, 길거리 음식으로 유명.',
        Description_id: 'Salah satu pasar tradisional tertua di Korea dengan makanan kaki lima autentik.',
        Description_mn: 'Солонгосын хамгийн эртний уламжлалт зах.',
        Latitude: 37.57, Longitude: 126.9993, Address: '88 Changgyeonggung-ro, Jongno-gu, Seoul',
        Rating: 4.6, Featured: true, Published: true,
        Tags: ['budget', 'solo-travel', 'hidden-gem'], Instagram: '#gwangjangmarket #광장시장 #koreanfood',
      },
      {
        Name: 'Haeundae Beach', Name_ko: '해운대 해수욕장', Name_id: 'Pantai Haeundae', Name_mn: 'Хэүндэ далайн эрэг',
        Category: 'nature', Region: 'Busan',
        Description: "Korea's most famous beach with beautiful coastline and nearby seafood restaurants.",
        Description_ko: '아름다운 해안선과 인근 해산물 맛집이 있는 한국 최고의 해변.',
        Description_id: 'Pantai paling terkenal di Korea dengan garis pantai indah dan restoran seafood.',
        Description_mn: 'Солонгосын хамгийн алдартай далайн эрэг.',
        Latitude: 35.1587, Longitude: 129.1604, Address: 'Haeundae Beach, Haeundae-gu, Busan',
        Rating: 4.4, Featured: false, Published: true,
        Tags: ['family', 'date-spot', 'instagram'], Instagram: '#haeundae #해운대 #busanbeach',
      },
    ];

    const created = [];
    for (const s of samples) {
      const props = {
        Name: { title: [{ text: { content: s.Name } }] },
        Category: { select: { name: s.Category } },
        Region: { select: { name: s.Region } },
        Description: { rich_text: [{ text: { content: s.Description } }] },
        Description_ko: { rich_text: [{ text: { content: s.Description_ko } }] },
        Description_id: { rich_text: [{ text: { content: s.Description_id } }] },
        Description_mn: { rich_text: [{ text: { content: s.Description_mn } }] },
        Name_ko: { rich_text: [{ text: { content: s.Name_ko } }] },
        Name_id: { rich_text: [{ text: { content: s.Name_id } }] },
        Name_mn: { rich_text: [{ text: { content: s.Name_mn } }] },
        Latitude: { number: s.Latitude },
        Longitude: { number: s.Longitude },
        Address: { rich_text: [{ text: { content: s.Address } }] },
        Rating: { number: s.Rating },
        Featured: { checkbox: s.Featured },
        Published: { checkbox: s.Published },
        Tags: { multi_select: s.Tags.map(t => ({ name: t })) },
        Instagram: { rich_text: [{ text: { content: s.Instagram } }] },
      };

      const page = await notion.pages.create({
        parent: { database_id: dbId },
        properties: props,
      });
      created.push(page.id);
    }

    res.status(200).json({
      success: true,
      database_id: dbId,
      message: 'Database created! Update NOTION_DB_TRAVEL in Vercel to: ' + dbId,
      samples_created: created.length,
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: error.message });
  }
};
