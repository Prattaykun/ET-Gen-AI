import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (!NEWS_API_KEY) {
        return NextResponse.json({ error: 'News API key not configured' }, { status: 500 });
    }

    try {
        let url = '';

        if (query) {
            // Use everything endpoint for search
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&pageSize=10&apiKey=${NEWS_API_KEY}`;
        } else {
            // Use top-headlines for categories or general feed
            const catParam = category ? `&category=${category}` : '&category=business';
            url = `https://newsapi.org/v2/top-headlines?country=in${catParam}&pageSize=10&apiKey=${NEWS_API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(data.message || 'Failed to fetch from News API');
        }

        // Map News API articles to our internal Article type
        const articles = data.articles
            .filter((a: any) => a.title && a.content && a.title !== '[Removed]')
            .map((a: any, index: number) => ({
                id: `news-${index}-${Date.now()}`,
                title: a.title,
                content: a.description || a.content || 'Content not available.',
                category: category || 'General',
                timestamp: a.publishedAt,
                imageUrl: a.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
                url: a.url
            }));

        return NextResponse.json(articles);
    } catch (error: any) {
        console.error('[News API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
