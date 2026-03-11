// One-time setup: Create TravelKo Users database in Notion
// Run once via: GET /api/setup-users-db
// Then set the returned DB ID as NOTION_DB_USERS env var
// DELETE THIS FILE after setup

const { Client } = require('@notionhq/client');

module.exports = async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN_TRAVEL });

  try {
    const travelDb = await notion.databases.retrieve({
      database_id: process.env.NOTION_DB_TRAVEL
    });

    let parent;
    if (travelDb.parent.type === 'page_id') {
      parent = { type: 'page_id', page_id: travelDb.parent.page_id };
    } else if (travelDb.parent.type === 'workspace') {
      // DB is at workspace root - create a page first, then DB inside it
      const page = await notion.pages.create({
        parent: { type: 'workspace', workspace: true },
        properties: {
          title: [{ type: 'text', text: { content: 'TravelKo Users' } }]
        }
      });
      parent = { type: 'page_id', page_id: page.id };
    } else if (travelDb.parent.type === 'block_id') {
      parent = { type: 'page_id', page_id: travelDb.parent.block_id };
    } else {
      return res.status(400).json({
        error: 'Unknown parent type: ' + travelDb.parent.type,
        parent: travelDb.parent
      });
    }

    const db = await notion.databases.create({
      parent: parent,
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
