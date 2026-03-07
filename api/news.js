const { Client } = require('@notionhq/client');

// Site-specific Notion configs
const SITE_CONFIGS = {
  indo: {
    token: process.env.NOTION_TOKEN_INDO,
    dbId: process.env.NOTION_DB_INDO,
    titleNative: '제목 (id)',
    contentNative: '내용 (id)',
  },
  mong: {
    token: process.env.NOTION_TOKEN_MONG,
    dbId: process.env.NOTION_DB_MONG,
    titleNative: '제목 (mn)',
    contentNative: '내용 (mn)',
  },
  malay: {
    token: process.env.NOTION_TOKEN_MALAY,
    dbId: process.env.NOTION_DB_MALAY,
    titleNative: '제목 (ms)',
    contentNative: '내용 (ms)',
  },
};

function getPlainText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map(t => t.plain_text || '').join('');
}

function formatPage(page, siteConfig) {
  const props = page.properties;
  return {
    id: page.id,
    titleNative: getPlainText(props[siteConfig.titleNative]?.title || props[siteConfig.titleNative]?.rich_text),
    titleKo: getPlainText(props['제목 (ko)']?.rich_text),
    category: props['카테고리']?.select?.name || '',
    contentNative: getPlainText(props[siteConfig.contentNative]?.rich_text),
    contentKo: getPlainText(props['내용 (ko)']?.rich_text),
    page: props['관련 페이지']?.select?.name || '',
    date: props['게시일']?.date?.start || '',
    importance: props['중요도']?.select?.name || '일반',
    source: getPlainText(props['출처']?.rich_text),
    sourceUrl: props['출처 링크']?.url || '',
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, page, limit, site } = req.query;
    const siteKey = site && SITE_CONFIGS[site] ? site : 'indo';
    const siteConfig = SITE_CONFIGS[siteKey];

    if (!siteConfig.token || !siteConfig.dbId) {
      return res.status(200).json({ items: [], hasMore: false, total: 0 });
    }

    const notion = new Client({ auth: siteConfig.token });
    const pageSize = Math.min(parseInt(limit) || 10, 50);

    const filter = {
      and: [
        { property: '공개 여부', checkbox: { equals: true } },
      ],
    };

    if (category) {
      filter.and.push({
        property: '카테고리',
        select: { equals: category },
      });
    }

    if (page) {
      filter.and.push({
        property: '관련 페이지',
        select: { equals: page },
      });
    }

    const response = await notion.databases.query({
      database_id: siteConfig.dbId,
      filter,
      sorts: [
        { property: '중요도', direction: 'ascending' },
        { property: '게시일', direction: 'descending' },
      ],
      page_size: pageSize,
    });

    const items = response.results.map(p => formatPage(p, siteConfig));

    res.status(200).json({
      items,
      hasMore: response.has_more,
      total: items.length,
    });
  } catch (error) {
    console.error('Notion API error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};
