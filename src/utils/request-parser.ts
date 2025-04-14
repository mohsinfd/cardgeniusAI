interface SpendingData {
  monthly: {
    rent?: number
    amazon_spends?: number
    flipkart_spends?: number
    [key: string]: number | undefined
  }
}

interface OfferPreferences {
  preferred_merchants: string[]
  offer_types: string[]
  expected_value?: string
  follow_up_questions?: string[]
}

interface ParseResponse {
  spending_data: SpendingData
  offer_preferences: OfferPreferences
}

export async function parseUserRequest(userInput: string): Promise<ParseResponse> {
  try {
    const response = await fetch('/api/parse-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    })

    if (!response.ok) {
      throw new Error('Failed to parse user request')
    }

    return await response.json()
  } catch (error) {
    console.error('Error parsing user request:', error)
    throw error
  }
} 