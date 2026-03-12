// POST /api/travel-planner - AI Travel Planner using GPT-5-NANO
const { getUserFromRequest, setCors } = require('./_lib/auth');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'AI planner not configured - missing OPENAI_API_KEY' });
  }

  const { spots, days, budget, style, lang } = req.body;

  if (!spots || !spots.length || !days) {
    return res.status(400).json({ error: 'Missing required fields: spots, days' });
  }

  const spotDescriptions = spots.map(function(s, i) {
    return (i + 1) + '. ' + s.name +
      (s.category ? ' [' + s.category + ']' : '') +
      (s.region ? ' - ' + s.region : '') +
      (s.address ? ' (' + s.address + ')' : '') +
      (s.description ? '\n   ' + s.description.substring(0, 150) : '');
  }).join('\n');

  const langNames = {
    en: 'English', ko: '한국어', id: 'Bahasa Indonesia',
    mn: 'Монгол хэл', ms: 'Bahasa Melayu', vi: 'Tiếng Việt'
  };
  const respondLang = langNames[lang] || 'English';

  const budgetDesc = {
    budget: 'Budget-friendly (최소 비용)',
    moderate: 'Moderate (적당한 비용)',
    luxury: 'Luxury (프리미엄 경험)'
  };

  const styleDesc = {
    relaxed: 'Relaxed (여유롭게, 하루 2-3곳)',
    balanced: 'Balanced (적당히, 하루 3-4곳)',
    packed: 'Packed (빡빡하게, 하루 5곳+)'
  };

  const systemPrompt = `You are TravelKo's AI Travel Planner — an expert on traveling in Korea.
Create a detailed, practical day-by-day travel itinerary based on the user's selected spots and preferences.

Rules:
- Organize spots logically by proximity and region to minimize travel time
- Include estimated time at each spot (e.g., "1-2 hours")
- Suggest specific meal recommendations near each area with price ranges
- Add transportation tips between spots (subway, bus, taxi with estimated cost)
- Include morning/afternoon/evening time blocks
- Match the travel pace to the user's style preference
- Give specific budget estimates in KRW (₩) for each day
- Add practical tips (best time to visit, what to wear, reservations needed, etc.)
- If spots are in different regions, plan travel days between regions
- Respond ENTIRELY in ${respondLang}
- Use markdown formatting for readability`;

  const userPrompt = `Plan a ${days}-day Korea travel itinerary.

**Budget Level:** ${budgetDesc[budget] || budget || 'Moderate'}
**Travel Style:** ${styleDesc[style] || style || 'Balanced'}

**Selected spots to include:**
${spotDescriptions}

Create a day-by-day plan that covers all these spots efficiently. Include meals, transport, and time estimates.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 4096,
        temperature: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', JSON.stringify(data));
      return res.status(502).json({
        error: 'AI service error',
        detail: data.error ? data.error.message : JSON.stringify(data)
      });
    }

    const plan = data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      plan: plan,
      usage: data.usage
    });
  } catch (err) {
    console.error('Planner error:', err);
    return res.status(500).json({ error: 'Failed to generate travel plan', detail: err.message });
  }
};

// Increase Vercel function timeout (Hobby: max 60s, Pro: max 300s)
module.exports.config = {
  maxDuration: 60
};
