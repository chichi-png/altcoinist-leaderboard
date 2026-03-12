export async function onRequestGet(context) {
    const NOTION_API_KEY = context.env.NOTION_API_KEY;
    const PAGE_ID = context.env.KONSTANTIN_POSTS_PAGE_ID;

    try {
        const response = await fetch(`https://api.notion.com/v1/blocks/${PAGE_ID}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const posts = [];

        data.results.forEach(block => {
            // Look for bookmark blocks (Twitter links)
            if (block.type === 'bookmark' && block.bookmark.url.includes('twitter.com')) {
                posts.push({
                    url: block.bookmark.url,
                    title: block.bookmark.caption?.[0]?.plain_text || 'Twitter Post',
                    date: new Date(block.created_time).toLocaleDateString(),
                    preview: null
                });
            }
            // Look for paragraph blocks with links
            else if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
                block.paragraph.rich_text.forEach(text => {
                    if (text.href && (text.href.includes('twitter.com') || text.href.includes('x.com'))) {
                        posts.push({
                            url: text.href,
                            title: text.plain_text,
                            date: new Date(block.created_time).toLocaleDateString(),
                            preview: null
                        });
                    }
                });
            }
        });

        return new Response(JSON.stringify(posts), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({error: error.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
