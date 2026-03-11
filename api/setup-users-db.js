// One-time setup: Create TravelKo Users database in Notion
// Run once via: GET /api/setup-users-db
// Then set the returned DB ID as NOTION_DB_USERS env var
// DELETE THIS FILE after setup

const { Client } = require('@notionhq/client');

module.exports = async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN_TRAVEL });

  // Use same parent page as travel DB
  // Find the parent from existing travel DB
  try {
    const travelDb = await notion.databases.retrieve({
      database_id: process.env.NOTION_DB_TRAVEL
    });

    const parentPageId = travelDb.parent.type === 'page_id'
      ? travelDb.parent.page_id
      : null;

    if (!parentPageId) {
      return res.status(400).json({ error: 'Cannot determine parent page. Create DB manually.' });
    }

    const db = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId },
      title: [{ type: 'text', text: { content: 'TravelKo Users' } }],
      properties: {
        Name: { title: {} },
        GoogleId: { rich_text: {} },
        Email: { rich_text: {} },
        Avatar: { url: {} },
        Bookmarks: { rich_text: {} }
      }
    });

    return res.status(200).json({
      success: true,
      databaseId: db.id,
      message: 'Users DB created! Set this ID as NOTION_DB_USERS in Vercel env vars. Then delete this file.'
    });
  } catch (err) {
    console.error('Setup error:', err);
    return res.status(500).json({ error: err.message });
  }
};
