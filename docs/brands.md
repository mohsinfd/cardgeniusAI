# Brand Mappings for CardGenius

This document contains the mapping of various brands to their corresponding spending categories in the CardGenius system.

## Online Shopping
- Amazon: amazon_spends
- Flipkart: flipkart_spends
- Myntra: other_online_spends
- Ajio: other_online_spends
- Nykaa: other_online_spends
- FirstCry: other_online_spends
- Tata Cliq: other_online_spends

## Food & Dining
- Swiggy: online_food_ordering
- Zomato: online_food_ordering
- Domino's: dining_or_going_out
- Pizza Hut: dining_or_going_out
- McDonald's: dining_or_going_out
- KFC: dining_or_going_out
- Starbucks: dining_or_going_out

## Grocery
- BigBasket: grocery_spends_online
- Grofers: grocery_spends_online
- Dmart: other_offline_spends
- Reliance Fresh: other_offline_spends

## Travel
- MakeMyTrip: hotels_annual, flights_annual
- Goibibo: hotels_annual, flights_annual
- Yatra: hotels_annual, flights_annual
- OYO: hotels_annual
- Airbnb: hotels_annual

## Entertainment
- Netflix: ott_channels
- Amazon Prime: ott_channels
- Disney+ Hotstar: ott_channels
- Zee5: ott_channels
- BookMyShow: movie_usage, movie_mov

## Utilities
- Airtel: mobile_phone_bills
- Jio: mobile_phone_bills
- Vodafone: mobile_phone_bills
- Tata Power: electricity_bills
- BSES: electricity_bills

## Notes
- If a brand is not listed here, it should be mapped to the most appropriate category based on its primary business
- For ambiguous cases, default to other_online_spends or other_offline_spends
- This mapping will be used by the AI to correctly categorize spending data 