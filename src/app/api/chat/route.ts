import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Debug logging
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('- API Key length:', process.env.OPENAI_API_KEY?.length);
console.log('- API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));
console.log('- API Key first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// Initialize OpenAI client with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000 // 10 second timeout
})

// Simplified system prompt
const SYSTEM_PROMPT = `You are a helpful AI assistant for CardGenius, a credit card recommendation system. Your task is to extract spending amounts from user messages and ask follow-up questions.

Rules:
- Extract numeric values from text
- Map to spending categories (amazon_spends, flipkart_spends, etc.)
- Default unspecified fields to 0
- Ask for clarification if amounts are ambiguous
- Be friendly and professional
- Always respond in valid JSON format

Response format (JSON):
{
  "message": "string",
  "spending_data": { "category": number },
  "follow_up_question": "string or null"
}`;

// Simple cache for common responses
const responseCache = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context = [] } = body;

    // Check cache first
    const cacheKey = JSON.stringify({ message, context });
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    const startTime = performance.now();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...context,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: false,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(response);

    const transformedResponse = {
      message: parsedResponse.message,
      spending_data: Object.entries(parsedResponse.spending_data || {}).reduce((acc, [key, value]) => {
        const mappedKey = key.toLowerCase().replace(/\s+/g, '_');
        acc[mappedKey] = typeof value === 'number' ? value : null;
        return acc;
      }, {} as Record<string, number | null>),
      follow_up_question: parsedResponse.follow_up_question
    };

    responseCache.set(cacheKey, transformedResponse);
    setTimeout(() => responseCache.delete(cacheKey), 5 * 60 * 1000);
    
    const endTime = performance.now();
    console.log(`API Processing Time: ${(endTime - startTime).toFixed(2)}ms`);

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 