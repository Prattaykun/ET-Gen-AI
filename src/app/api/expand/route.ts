import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const apiKey = process.env.GROQ_API_KEY;
const groq = createOpenAI({
    apiKey: apiKey || '',
    baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
    try {
        const { title, content, category, userContext } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ summary: "AI Configuration error." }, { status: 500 });
        }

        const systemPrompt = `You are a senior financial analyst and news editor for The Economic Times.
Your task is to take a short news snippet and expand it into a comprehensive, high-fidelity "Deep Dive" report.

STRUCTURE YOUR RESPONSE IN THESE SECTIONS:
1. **EXECUTIVE OVERVIEW**: A sophisticated 2-paragraph summary of the situation.
2. **THE STRATEGIC IMPACT**: Detailed analysis of how this affects the industry and markets.
3. **PERSONAL ANALYSIS & ADVICE**: If user profile is provided, explain exactly what the user should do. Be specific.
4. **KEY DATA POINTS**: A bulleted list of 3-4 critical facts/figures.
5. **RELEVANT LINKS & RESOURCES**: Provide 2-3 contextual (simulated) links to related ET sections or government portals (e.g., [ET Markets](https://economictimes.indiatimes.com/markets), [Ministry of Finance](https://finmin.nic.in)).

${userContext ? `
USER PROFILE FOR PERSONALIZATION:
- Profession: ${userContext.profession}
- Location: ${userContext.location}
- Investment Goals: ${userContext.investment_goals}
- Interests: ${userContext.professional_interest}
` : ''}

ARTICLE TO EXPAND:
Title: ${title}
Category: ${category}
Short Content: ${content}

Guidelines:
- Maintain a premium, authoritative, and professional tone.
- Use sophisticated vocabulary suitable for a business daily.
- Format with clean, bold Markdown.
- Ensure the advice is actionable.`;

        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            messages: [{ role: 'system', content: systemPrompt }],
            temperature: 0.3,
        });

        return NextResponse.json({ expansion: text });
    } catch (error: any) {
        console.error('[API Expand] Error:', error);
        return NextResponse.json({ error: 'Expansion failed' }, { status: 500 });
    }
}
