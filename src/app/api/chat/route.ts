import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are a credit card recommendation assistant. Your task is to:
1. Extract spending data from user messages
2. Ask relevant follow-up questions to gather more information
3. Provide recommendations based on the user's needs

For travel-related requests, ask about:
- Domestic vs international travel frequency
- Preferred airlines and hotel chains
- Average annual spend on flights and hotels
- Lounge access preferences
- Travel insurance needs

When extracting spending data:
- Look for amounts in the format "X lac" and convert to rupees (1 lac = 100,000)
- Look for amounts with currency symbols (₹, Rs, etc.)
- Look for amounts with words like "thousand", "lakh", "crore"
- Update the spending_data object with the extracted values

Always include relevant follow-up questions to gather more information, but avoid repeating questions that have already been answered.`

interface SpendingData {
  monthly: {
    amazon_spends: number;
    flipkart_spends: number;
    grocery_spends_online: number;
    online_food_ordering: number;
    other_online_spends: number;
    other_offline_spends: number;
    dining_or_going_out: number;
    fuel: number;
    school_fees: number;
    rent: number;
    mobile_phone_bills: number;
    electricity_bills: number;
    water_bills: number;
    ott_channels: number;
  };
  annual: {
    hotels_annual: number;
    flights_annual: number;
    insurance_health_annual: number;
    insurance_car_or_bike_annual: number;
    large_electronics_purchase_like_mobile_tv_etc: number;
  };
  quarterly: {
    domestic_lounge_usage_quarterly: number;
    international_lounge_usage_quarterly: number;
    railway_lounge_usage_quarterly: number;
    movie_usage: number;
    movie_mov: number;
    dining_usage: number;
    dining_mov: number;
    online_food_ordering_mov: number;
    online_food_ordering_usage: number;
  };
}

// Helper function to check if we have sufficient data
function hasSufficientData(spendingData: SpendingData, context: string[]): boolean {
  // Check if any spending data is provided
  const hasSpendingData = Object.values(spendingData.monthly).some(value => value > 0) ||
                         Object.values(spendingData.annual).some(value => value > 0) ||
                         Object.values(spendingData.quarterly).some(value => value > 0)

  // Check if user has stated their primary requirement
  const contextText = context.join(' ').toLowerCase()
  const hasPrimaryRequirement = 
    contextText.includes('travel') ||
    contextText.includes('reward') ||
    contextText.includes('cashback') ||
    contextText.includes('student') ||
    contextText.includes('business') ||
    contextText.includes('fuel') ||
    contextText.includes('dining')

  return hasSpendingData && hasPrimaryRequirement
}

// Helper function to generate final confirmation question
function generateConfirmationQuestion(spendingData: SpendingData, context: string[]): string {
  const categories = []
  const spends = []

  // Check for primary category
  const contextText = context.join(' ').toLowerCase()
  if (contextText.includes('travel')) categories.push('travel')
  if (contextText.includes('reward')) categories.push('rewards')
  if (contextText.includes('cashback')) categories.push('cashback')
  if (contextText.includes('student')) categories.push('student')
  if (contextText.includes('business')) categories.push('business')
  if (contextText.includes('fuel')) categories.push('fuel')
  if (contextText.includes('dining')) categories.push('dining')

  // Check for significant spends
  if (spendingData.monthly.amazon_spends > 0) spends.push(`Amazon (₹${spendingData.monthly.amazon_spends}/month)`)
  if (spendingData.monthly.flipkart_spends > 0) spends.push(`Flipkart (₹${spendingData.monthly.flipkart_spends}/month)`)
  if (spendingData.monthly.dining_or_going_out > 0) spends.push(`Dining (₹${spendingData.monthly.dining_or_going_out}/month)`)
  if (spendingData.monthly.fuel > 0) spends.push(`Fuel (₹${spendingData.monthly.fuel}/month)`)
  if (spendingData.annual.flights_annual > 0) spends.push(`Flights (₹${spendingData.annual.flights_annual}/year)`)
  if (spendingData.annual.hotels_annual > 0) spends.push(`Hotels (₹${spendingData.annual.hotels_annual}/year)`)

  return `Based on our conversation, I'll look for a card that is best for:
${categories.map(c => `- ${c}`).join('\n')}
${spends.length > 0 ? `\nAnd optimized for your spends on:\n${spends.map(s => `- ${s}`).join('\n')}` : ''}

Would you like to modify anything before I proceed with the recommendations?`
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are CardGenius, an AI assistant that extracts spending amounts from user input. Extract numeric values and categorize them into appropriate spending categories."
        },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
    })

    const aiResponse = completion.choices[0].message.content
    
    // Parse the response to extract spending data
    let spendingData: SpendingData | undefined
    try {
      // Attempt to parse spending data from AI response
      const parsedResponse = JSON.parse(aiResponse)
      spendingData = parsedResponse.spending_data as SpendingData
      
      // If we have valid spending data, call CardGenius API
      if (spendingData && 
          (Object.values(spendingData.monthly).some(val => val > 0) ||
           Object.values(spendingData.annual).some(val => val > 0) ||
           Object.values(spendingData.quarterly).some(val => val > 0))) {
        const cardGeniusResponse = await fetch('https://bk-prod-external.bankkaro.com/cg/api/pro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...spendingData,
            new_monthly_cat_1: 0,
            new_monthly_cat_2: 0,
            new_monthly_cat_3: 0,
            new_cat_1: 0,
            new_cat_2: 0,
            new_cat_3: 0,
            selected_card_id: null
          }),
        })

        if (!cardGeniusResponse.ok) {
          throw new Error('Failed to get card recommendations')
        }

        const recommendations = await cardGeniusResponse.json()
        return NextResponse.json({
          message: aiResponse,
          recommendations,
          spending_data: spendingData
        })
      }
    } catch (e) {
      console.error('Failed to process spending data:', e)
    }

    // If no spending data or processing failed, return just the AI response
    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 