import { NextResponse } from 'next/server';
import { generateText } from 'ai';
// Triggering re-compile after fix
import { createOpenAI } from '@ai-sdk/openai';

// Ensure the API key is available
const apiKey = process.env.GROQ_API_KEY;

// Create a custom Groq provider
const groq = createOpenAI({
  apiKey: apiKey || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { articles, query, history = [], userContext } = body;

    console.log('[API] Processing query:', query || 'Follow-up');
    console.log('[API] History length:', history.length);

    if (!articles || articles.length === 0) {
      return NextResponse.json({ error: 'No articles provided' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ summary: "Error: GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const articlesContext = articles
      .map((a: { title: string; content: string }, index: number) => `Article ${index + 1}: ${a.title}\nContent: ${a.content}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful and expert financial news assistant for The Economic Times.
Analyze the following articles as your primary source of truth. 
Be conversational, professional, and insightful. 

${userContext ? `
USER PROFILE:
- Profession: ${userContext.profession || 'Not specified'}
- Location: ${userContext.location || 'Not specified'}
- Investment Goals: ${userContext.investment_goals || 'Not specified'}
- Interests: ${userContext.professional_interest || 'General'}

When answering, specifically address:
1. HOW THIS NEWS AFFECTS THE USER based on their profile.
2. ACTIONABLE ADVICE: How they can apply for schemes mentioned, or benefit from the trends.
` : ''}

Articles Context:
${articlesContext}

Guidelines:
1. Synthesize information from multiple articles for broad questions.
2. Provide deep detail for specific entities/trends mentioned.
3. If user profile is provided, include a section 'PERSONAL IMPACT & ADVICE'.
4. Always end your response with a section titled 'Suggested Next Questions:' followed by 3 numbered questions.
5. Format in clean Markdown.
6. Do not repeat the history in your answer.`;

    // Filter history to ensure format is strictly valid for OpenAI/Groq API (alternating roles)
    const formattedHistory = [];
    let lastRole = 'system';

    for (const msg of history) {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      if (role !== lastRole) {
        formattedHistory.push({
          role,
          content: String(msg.content).split('Suggested Next Questions:')[0].trim(),
        });
        lastRole = role;
      }
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
    ];

    const finalQuery = query || "Please provide a comprehensive summary and collective intelligence analysis of these articles, highlighting key trends, market implications, and strategic takeaways.";

    // Ensure the LAST message is ALWAYS from the USER
    if (lastRole !== 'user') {
      messages.push({ role: 'user', content: `Based on these articles, answer: ${finalQuery}` });
    } else if (query && formattedHistory.length > 0) {
      // If the last message in history was already from user, and we have a new query,
      // something might be out of sync, but we'll prioritize the new query.
      // (This usually shouldn't happen with correct frontend logic)
    }

    console.log('[API] Final messages count:', messages.length);

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: messages.map(m => ({ role: m.role, content: m.content })) as any,
      temperature: 0.2,
    });

    return NextResponse.json({ summary: text });
  } catch (error: any) {
    console.error('[API] Error:', error);
    return NextResponse.json({
      error: 'Failed to generate response',
      details: error.message
    }, { status: 500 });
  }
}
