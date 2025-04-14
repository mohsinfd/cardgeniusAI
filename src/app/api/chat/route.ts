import { NextResponse } from 'next/server'
import OpenAI from 'openai'

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
    const { message, context = [], unansweredQuestions = [] } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Construct the conversation history
    const conversationHistory = context
      .filter((msg: string | null) => msg !== null)
      .map((msg: string, index: number) => ({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content: msg
      }))

    // Add the current message
    conversationHistory.push({ role: 'user', content: message })

    // Construct the system message with context about unanswered questions
    const systemMessage = unansweredQuestions.length > 0
      ? `${SYSTEM_PROMPT}\n\nThe user has not yet answered these questions: ${unansweredQuestions.join(', ')}. Please consider this when generating your response.`
      : SYSTEM_PROMPT

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        ...conversationHistory
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0].message.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Initialize spending data
    const spendingData: SpendingData = {
      monthly: {
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
        ott_channels: 0
      },
      annual: {
        hotels_annual: 0,
        flights_annual: 0,
        insurance_health_annual: 0,
        insurance_car_or_bike_annual: 0,
        large_electronics_purchase_like_mobile_tv_etc: 0
      },
      quarterly: {
        domestic_lounge_usage_quarterly: 0,
        international_lounge_usage_quarterly: 0,
        railway_lounge_usage_quarterly: 0,
        movie_usage: 0,
        movie_mov: 0,
        dining_usage: 0,
        dining_mov: 0,
        online_food_ordering_mov: 0,
        online_food_ordering_usage: 0
      }
    }

    // Extract spending data from the message
    const amountMatches = message.match(/(\d+)\s*(?:lac|lakh|thousand|k|rs|₹)/gi)
    if (amountMatches) {
      amountMatches.forEach(match => {
        const value = parseInt(match.match(/\d+/)[0])
        const unit = match.toLowerCase()
        
        // Convert to rupees
        let amount = value
        if (unit.includes('lac') || unit.includes('lakh')) {
          amount = value * 100000
        } else if (unit.includes('thousand') || unit.includes('k')) {
          amount = value * 1000
        }

        // Update relevant spending fields based on context
        const messageLower = message.toLowerCase()
        if (messageLower.includes('rent')) {
          spendingData.monthly.rent = amount
        } else if (messageLower.includes('amazon')) {
          spendingData.monthly.amazon_spends = amount
        } else if (messageLower.includes('flipkart')) {
          spendingData.monthly.flipkart_spends = amount
        } else if (messageLower.includes('dining') || messageLower.includes('restaurant')) {
          spendingData.monthly.dining_or_going_out = amount
        } else if (messageLower.includes('fuel') || messageLower.includes('petrol')) {
          spendingData.monthly.fuel = amount
        } else if (messageLower.includes('flight') || messageLower.includes('fly')) {
          spendingData.annual.flights_annual = amount
        }
      })
    }

    // Extract follow-up questions using a more robust pattern
    const followUpQuestions = response
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0 && line.includes('?'))

    // If no questions found with bullet points, try to find questions in the text
    if (followUpQuestions.length === 0) {
      const questionMatches = response.match(/[^.!?]+\?/g)
      if (questionMatches) {
        followUpQuestions.push(...questionMatches.map(q => q.trim()))
      }
    }

    // Filter out questions that have already been answered in the context
    const answeredQuestions = context.join(' ').toLowerCase()
    const filteredFollowUpQuestions = followUpQuestions.filter(question => {
      const questionKey = question.toLowerCase()
      return !answeredQuestions.includes(questionKey)
    })

    // Check if we have sufficient data to close the conversation
    const shouldCloseConversation = hasSufficientData(spendingData, context)

    // Extract categories and context text for API call
    const contextText = context.join(' ').toLowerCase()
    const categories = []
    if (contextText.includes('travel')) categories.push('travel')
    if (contextText.includes('reward')) categories.push('rewards')
    if (contextText.includes('cashback')) categories.push('cashback')
    if (contextText.includes('student')) categories.push('student')
    if (contextText.includes('business')) categories.push('business')
    if (contextText.includes('fuel')) categories.push('fuel')
    if (contextText.includes('dining')) categories.push('dining')

    // If we have sufficient data, generate final confirmation question and call CardGenius API
    let cardRecommendations = null
    if (shouldCloseConversation) {
      try {
        // Call CardGenius API with the spending data
        const cardGeniusResponse = await fetch('https://api.cardgenius.com/v1/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CARDGENIUS_API_KEY}`,
          },
          body: JSON.stringify({
            spending_data: spendingData,
            preferences: {
              primary_category: categories[0] || 'general',
              preferred_merchants: contextText.includes('amazon') ? ['amazon'] : 
                                contextText.includes('flipkart') ? ['flipkart'] : [],
              preferred_offer_types: contextText.includes('cashback') ? ['cashback'] :
                                   contextText.includes('reward') ? ['rewards'] : [],
            }
          })
        })

        if (!cardGeniusResponse.ok) {
          throw new Error('Failed to get card recommendations')
        }

        cardRecommendations = await cardGeniusResponse.json()
      } catch (error) {
        console.error('Error calling CardGenius API:', error)
        // Continue without recommendations if the API call fails
      }
    }

    // If we have sufficient data, generate final confirmation question
    const finalConfirmationQuestion = shouldCloseConversation 
      ? generateConfirmationQuestion(spendingData, context)
      : null

    // Extract confidence based on the response quality
    const confidence = response.length > 200 ? 'high' : 
                     response.length > 100 ? 'medium' : 'low'

    return NextResponse.json({
      spending_data: spendingData,
      follow_up_messages: shouldCloseConversation ? [finalConfirmationQuestion] : filteredFollowUpQuestions,
      confidence,
      should_close_conversation: shouldCloseConversation,
      final_confirmation: shouldCloseConversation,
      card_recommendations: cardRecommendations
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 