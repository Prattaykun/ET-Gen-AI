import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Ensure the API key is available
const apiKey = process.env.GROQ_API_KEY;

// Create a custom Groq provider using the OpenAI provider setup
const groq = createOpenAI({
  apiKey: apiKey || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { articles, query } = body;

    if (!articles || articles.length === 0) {
      return NextResponse.json({ error: 'No articles provided' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ summary: "Error: GROQ_API_KEY is not configured in environment variables." }, { status: 500 });
    }

    const articlesContext = articles
      .map((a: { title: string; content: string }, index: number) => `Article ${index + 1}: ${a.title}\nContent: ${a.content}`)
      .join('\n\n');

    let prompt = `You are a helpful and expert news summarizer assistant.
Analyze the following articles and provide a comprehensive summary with key points.\n\n`;

    if (query) {
       prompt += `The user was specifically searching for: "${query}". Keep this context in mind.\n\n`;
    }

    prompt += `Here are the articles:\n\n${articlesContext}\n\n`;
    prompt += `Please format your response clearly, starting with a brief overarching summary, followed by a bulleted list of the most important key points derived from these articles. Do not hallucinate information not present in the articles.`;

    const { text } = await generateText({
      model: groq('llama3-8b-8192'),
      prompt: prompt,
      temperature: 0.3,
    });

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
