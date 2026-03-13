/**
 * Affiliate Tweets API Endpoint
 *
 * Queries the Notion database containing affiliate promotional tweets.
 * Returns tweets grouped by affiliate handle with engagement metrics.
 */

export async function onRequest(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=600' // 10 minutes cache
  };

  try {
    const NOTION_API_KEY = context.env.NOTION_API_KEY;
    const DATABASE_ID = 'c51f4729ae904dea95c3cc683b273cc9';

    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured');
    }

    // Query Notion database - sort by Posted on (descending)
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'Posted on',
            direction: 'descending'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Group tweets by affiliate handle
    const affiliatesMap = new Map();

    for (const page of data.results) {
      const properties = page.properties;

      // Extract fields from database properties
      const affiliateTitle = properties['Affiliate']?.title?.[0]?.plain_text || '';
      const tweetLink = properties['Tweet link']?.url || '';
      const postedOn = properties['Posted on']?.date?.start || '';
      const likes = properties['Likes']?.number || 0;
      const replies = properties['Replies']?.number || 0;
      const reposts = properties['Reposts']?.number || 0;
      const bookmarks = properties['Bookmarks']?.number || 0;
      const insight = properties['Insight']?.rich_text?.[0]?.plain_text || '';
      const xProfileLink = properties['X profile link']?.url || '';

      // Extract handle from affiliate title (e.g., "@N30_cryptoo" → "n30_cryptoo")
      const handleMatch = affiliateTitle.match(/@?([a-zA-Z0-9_]+)/);
      if (!handleMatch) continue;

      const handle = handleMatch[1].toLowerCase();

      // Initialize affiliate entry if not exists
      if (!affiliatesMap.has(handle)) {
        affiliatesMap.set(handle, {
          handle: handle,
          profileUrl: xProfileLink || `https://x.com/${handle}`,
          tweetCount: 0,
          tweets: []
        });
      }

      const affiliate = affiliatesMap.get(handle);

      // Add tweet to affiliate's collection
      affiliate.tweets.push({
        link: tweetLink,
        postedOn: postedOn,
        likes: likes,
        replies: replies,
        reposts: reposts,
        bookmarks: bookmarks,
        insight: insight
      });

      affiliate.tweetCount = affiliate.tweets.length;
    }

    // Convert map to array
    const affiliates = Array.from(affiliatesMap.values());

    return new Response(JSON.stringify({
      success: true,
      affiliates: affiliates,
      totalTweets: data.results.length,
      retrievedAt: new Date().toISOString()
    }), { headers });

  } catch (error) {
    console.error('Error fetching affiliate tweets:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      affiliates: []
    }), {
      status: 500,
      headers
    });
  }
}
