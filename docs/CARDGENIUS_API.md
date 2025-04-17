# CardGenius API Integration Documentation

## API Endpoint
```
POST https://bk-prod-external.bankkaro.com/cg/api/pro
```

## Request Format
```json
{
  "amazon_spends": 0,
  "flipkart_spends": 0,
  "grocery_spends_online": 0,
  "online_food_ordering": 0,
  "other_online_spends": 0,
  "other_offline_spends": 0,
  "dining_or_going_out": 0,
  "fuel": 0,
  "school_fees": 0,
  "rent": 0,
  "mobile_phone_bills": 0,
  "electricity_bills": 0,
  "water_bills": 0,
  "ott_channels": 0,
  "new_monthly_cat_1": 0,
  "new_monthly_cat_2": 0,
  "new_monthly_cat_3": 0,
  "hotels_annual": 0,
  "flights_annual": 0,
  "insurance_health_annual": 0,
  "insurance_car_or_bike_annual": 0,
  "large_electronics_purchase_like_mobile_tv_etc": 0,
  "all_pharmacy": 0,
  "new_cat_1": 0,
  "new_cat_2": 0,
  "new_cat_3": 0,
  "domestic_lounge_usage_quarterly": 0,
  "international_lounge_usage_quarterly": 0,
  "railway_lounge_usage_quarterly": 0,
  "movie_usage": 0,
  "movie_mov": 0,
  "dining_usage": 0,
  "dining_mov": 0,
  "selected_card_id": null
}
```

## Request Headers
```
Content-Type: application/json
```

## Response Format
```json
{
  "recommendations": [
    {
      "card_name": "string",
      "seo_card_alias": "string",
      "cg_network_url": "string | null",
      "ck_store_url": "string",
      "ck_store_url_2": "string",
      "id": number,
      "joining_fees": "string",
      "total_savings": number,
      "total_savings_yearly": number,
      "total_extra_benefits": number,
      "max_potential_savings": number,
      "category_breakdown": object,
      "spending_breakdown": object,
      "total_benefits": number,
      "total_spends": number,
      "welcomeBenefits": array,
      "food_dining_benefits": array,
      "travel_benefits": object,
      "milestone_benefits": array,
      "roi": number,
      "tags": "string",
      "bank_id": number,
      "spending_breakdown_array": array,
      "card_bg_image": "string",
      "image": "string",
      "product_usps": array
    }
  ]
}
```

## Implementation Requirements

1. **Request Handling**:
   - All spending fields must be included in the request
   - Unspecified fields should default to 0
   - `selected_card_id` should always be null
   - Values should be numbers (not strings) except for `selected_card_id`

2. **Response Handling**:
   - Transform the API response to match the frontend's expected format
   - Handle errors appropriately with proper status codes
   - Log responses for debugging purposes

3. **Error Handling**:
   - Handle network errors
   - Handle API errors (non-200 responses)
   - Handle malformed responses
   - Provide meaningful error messages

4. **Logging**:
   - Log incoming requests
   - Log outgoing requests to CardGenius API
   - Log API responses
   - Log any errors or issues

## Integration Steps

1. Update the card-recommendations API route to:
   - Use the correct endpoint
   - Include all required fields
   - Handle the response format
   - Implement proper error handling

2. Update the frontend to:
   - Send complete spending data
   - Handle the transformed response
   - Display recommendations appropriately

## Testing Requirements

1. Test with various spending patterns
2. Verify all fields are included in requests
3. Test error handling scenarios
4. Verify response transformation
5. Test with real user data

## Security Considerations

1. No authentication required for the API
2. All data is sent over HTTPS
3. No sensitive user data is included in requests

## Future Enhancements

1. Add caching for frequent requests
2. Implement rate limiting
3. Add request validation
4. Add response validation
5. Implement retry logic for failed requests 