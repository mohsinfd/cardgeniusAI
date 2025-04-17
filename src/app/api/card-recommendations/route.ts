import { NextResponse } from 'next/server';
import { SpendingData } from '@/types/spending';

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

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const incomingSpendingData = body.spending_data || {};

    // Create a new object with default values and update with incoming data
    const spendingData: SpendingData = { ...defaultSpendingData };
    Object.keys(incomingSpendingData).forEach(key => {
      if (key in spendingData) {
        const value = incomingSpendingData[key];
        spendingData[key as keyof SpendingData] = typeof value === 'number' ? value : 0;
      }
    });

    // Log the request data for debugging
    console.log('Sending request to CardGenius API with spending data:', spendingData);

    // Make the API call to CardGenius
    const response = await fetch('https://bk-prod-external.bankkaro.com/cg/api/pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...spendingData,
        selected_card_id: null
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('CardGenius API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch card recommendations' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Received response from CardGenius API:', data);

    // Return the exact response from the API without transformation
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in card-recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 