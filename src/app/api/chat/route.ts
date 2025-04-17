import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SpendingData } from '@/types/spending'
import { CardGeniusResponse } from '@/types/cardgenius'

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

// Default spending data with all fields initialized to 0
const defaultSpendingData: SpendingData = {
  amazon_spends: 0,
  flipkart_spends: 0,
  grocery_spends_online: 0,
  online_food_ordering: 0,
  other_online_spends: 0,
  other_offline_spends: 0,
  dining_or_going_out: 0,
  fuel: 0,
  school_fees: 0,
  rent: 0,
  mobile_phone_bills: 0,
  electricity_bills: 0,
  water_bills: 0,
  ott_channels: 0,
  new_monthly_cat_1: 0,
  new_monthly_cat_2: 0,
  new_monthly_cat_3: 0,
  hotels_annual: 0,
  flights_annual: 0,
  insurance_health_annual: 0,
  insurance_car_or_bike_annual: 0,
  large_electronics_purchase_like_mobile_tv_etc: 0,
  all_pharmacy: 0,
  new_cat_1: 0,
  new_cat_2: 0,
  new_cat_3: 0,
  domestic_lounge_usage_quarterly: 0,
  international_lounge_usage_quarterly: 0,
  railway_lounge_usage_quarterly: 0,
  movie_usage: 0,
  movie_mov: 0,
  dining_usage: 0,
  dining_mov: 0
};

// Simplified system prompt
const SYSTEM_PROMPT = `You are a credit card recommendation assistant. Your task is to:
1. Extract spending amounts from user messages
2. Determine if the user has provided enough data for recommendations
3. Ask for more spending data if needed
4. Provide clear, concise responses

Rules:
- Extract spending amounts in the format: {category: amount}
- If user provides a spending amount, update the corresponding category
- If user declines to provide more spending data, set ready_for_recommendations to true
- If user only wants a card for a specific category, set ready_for_recommendations to true
- At least one spending amount is required for recommendations
- ALWAYS respond with a valid JSON object in the exact format specified below

Current spending data:
${JSON.stringify(defaultSpendingData, null, 2)}

Response format (MUST be valid JSON):
{
  "content": "your response message",
  "spending_data": {
    "category": amount
  },
  "ready_for_recommendations": boolean,
  "follow_up_question": "question to ask if more data needed"
}

IMPORTANT: Your response must be a valid JSON object with all fields present. Do not include any text outside the JSON object.`;

// Simple cache for common responses
const responseCache = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context = [], accumulatedSpending = {} } = body;

    // Create a new object with default values and update with accumulated spending data
    const spendingData: SpendingData = { ...defaultSpendingData };
    Object.keys(accumulatedSpending).forEach(key => {
      if (key in spendingData) {
        const value = accumulatedSpending[key];
        spendingData[key as keyof SpendingData] = typeof value === 'number' ? value : 0;
      }
    });

    // Check cache first
    const cacheKey = JSON.stringify({ message, context, accumulatedSpending });
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    const startTime = performance.now();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...context,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate required fields
    if (!parsedResponse.content || typeof parsedResponse.content !== 'string') {
      throw new Error('Invalid response format: missing or invalid content');
    }

    if (!parsedResponse.spending_data || typeof parsedResponse.spending_data !== 'object') {
      parsedResponse.spending_data = {};
    }

    if (typeof parsedResponse.ready_for_recommendations !== 'boolean') {
      parsedResponse.ready_for_recommendations = false;
    }

    if (!parsedResponse.follow_up_question || typeof parsedResponse.follow_up_question !== 'string') {
      parsedResponse.follow_up_question = '';
    }

    console.log('OpenAI Response:', JSON.stringify(parsedResponse, null, 2));

    const newSpendingData = parsedResponse.spending_data || {};

    // Merge new spending data with accumulated data
    const mergedSpendingData = { ...spendingData };
    Object.keys(newSpendingData).forEach(key => {
      if (key in mergedSpendingData) {
        const value = newSpendingData[key];
        mergedSpendingData[key as keyof SpendingData] = typeof value === 'number' ? value : 0;
      }
    });

    // If ready for recommendations, call the CardGenius API
    let recommendations = null;
    if (parsedResponse.ready_for_recommendations) {
      try {
        const cardResponse = await fetch('https://bk-prod-external.bankkaro.com/cg/api/pro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...mergedSpendingData,
            selected_card_id: null
          }),
        });

        if (cardResponse.ok) {
          const cardData: CardGeniusResponse = await cardResponse.json();
          if (cardData.success && cardData.savings.length > 0) {
            recommendations = cardData.savings;
          } else {
            console.error('No recommendations found in response');
          }
        } else {
          console.error('CardGenius API error:', await cardResponse.json());
        }
      } catch (error) {
        console.error('Error calling CardGenius API:', error);
      }
    }

    const transformedResponse = {
      content: parsedResponse.content,
      spending_data: mergedSpendingData,
      ready_for_recommendations: parsedResponse.ready_for_recommendations,
      follow_up_question: parsedResponse.follow_up_question,
      recommendations: recommendations
    };

    console.log('Transformed Response:', JSON.stringify(transformedResponse, null, 2));

    responseCache.set(cacheKey, transformedResponse);
    setTimeout(() => responseCache.delete(cacheKey), 5 * 60 * 1000);
    
    const endTime = performance.now();
    console.log(`API Processing Time: ${(endTime - startTime).toFixed(2)}ms`);

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 