export async function onRequestGet(context) {
    const NOTION_API_KEY = context.env.NOTION_API_KEY;
    const PAGE_ID = context.env.X_PROFILES_PAGE_ID;

    try {
        const response = await fetch(`https://api.notion.com/v1/blocks/${PAGE_ID}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const profiles = [];

        data.results.forEach(block => {
            // Look for paragraph/list items with X/Twitter links
            if (block.type === 'paragraph' || block.type === 'bulleted_list_item') {
                const richText = block[block.type].rich_text;
                richText.forEach(text => {
                    if (text.href && (text.href.includes('x.com') || text.href.includes('twitter.com'))) {
                        const handle = text.plain_text.startsWith('@') ? text.plain_text : `@${text.plain_text}`;
                        profiles.push({
                            name: text.plain_text.replace('@', ''),
                            handle: handle,
                            url: text.href,
                            avatar: text.plain_text[0].toUpperCase()
                        });
                    }
                });
            }
        });

        return new Response(JSON.stringify(profiles), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=600'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({error: error.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
