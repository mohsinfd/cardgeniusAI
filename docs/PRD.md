# CardGenius Spend Form Chatbot – Product Requirements Document (PRD)

## Project Information
- **Project Name**: CardGenius
- **Version**: 1.1
- **Date**: April 9, 2025
- **Author**: CardGenius Team

## Table of Contents
1. [Introduction](#1-introduction)
2. [Scope](#2-scope)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Flow](#5-user-flow)
6. [Testing and Quality Assurance](#6-testing-and-quality-assurance)
7. [Future Enhancements](#7-future-enhancements)
8. [Conclusion](#8-conclusion)

## 1. Introduction

### 1.1 Overview
CardGenius is an AI-powered chatbot designed to extract spending amounts from a user's free‑form text input and map them to specific spend fields. The spend form includes a mix of monthly, annual, quarterly, and count‑based fields. The chatbot operates in a conversational interface with a futuristic dark theme and neon accents, ensuring a stellar new‑age UI that "screams AI." Through iterative follow‑up prompts and dynamic placeholders, the system ensures all required spending details are captured before triggering a secure API call to retrieve credit card recommendations.

### 1.2 Objectives
- **Extraction**: Accurately parse free‑form user input to extract numeric spend values for each defined spending field.
- **Conversational Flow**: Engage users in a natural, confident, and friendly conversation that iteratively prompts for missing or ambiguous data.
- **Dynamic UI Experience**: Use dynamic placeholders, smooth animations, and humanized messages to enhance user experience.
- **Backend Integration**: Once the spend form is complete, the system will decide when to re‑call the OpenAI API and eventually trigger an internal API call to fetch credit card recommendations.
- **Fallback Handling**: Redirect queries falling outside the spending scope to the appropriate FAQ or help sections.

## 2. Scope

### 2.1 In Scope

#### Spend Data Fields
1. **Monthly Spending Fields (rupees)**:
   - amazon_spends
   - flipkart_spends
   - grocery_spends_online
   - online_food_ordering
   - other_online_spends
   - other_offline_spends
   - dining_or_going_out
   - fuel
   - school_fees
   - rent
   - mobile_phone_bills
   - electricity_bills
   - water_bills
   - ott_channels

2. **Annual Spending Fields (rupees)**:
   - hotels_annual
   - flights_annual
   - insurance_health_annual
   - insurance_car_or_bike_annual
   - large_electronics_purchase_like_mobile_tv_etc

3. **Quarterly / Count-Based Fields**:
   - domestic_lounge_usage_quarterly
   - international_lounge_usage_quarterly
   - railway_lounge_usage_quarterly
   - movie_usage
   - movie_mov
   - dining_usage
   - dining_mov
   - online_food_ordering_mov
   - online_food_ordering_usage

#### Interactive Features
- Chat input interface with dynamic, rotating placeholder text
- Follow-up prompts for missing or ambiguous values
- Visual loading states and transitions
- API Integration with predefined parameters

### 2.2 Out of Scope
- Mapping or categorizing brands beyond spending extraction
- Only numeric spends will be extracted and defaults applied

## 3. Functional Requirements

### 3.1 Spend Data Extraction
- **FR1**: Extract numeric values from free‑form text input
- **FR2**: Default unspecified fields to 0
- **FR3**: Generate follow-up prompts for missing values
- **FR4**: Handle shopping category verification
- **FR5**: Manage ambiguous brand references
- **FR6**: Process different field units correctly

### 3.2 Conversational Flow
- **FR7**: Display parsed results in chat bubbles
- **FR8**: Continue prompting until all fields are populated
- **FR9**: Handle user updates appropriately

### 3.3 Unsupported Queries
- **FR10**: Redirect non-spending queries to FAQ

### 3.4 API Integration
- **FR11**: Send structured JSON to internal API
- **FR12**: Use predefined API parameters
- **FR13**: Maintain security headers

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR1**: 2-second response time for parsing and UI updates
- **NFR2**: Smooth transitions and animations

### 4.2 UI/UX
- **NFR3**: Futuristic dark theme with neon accents
- **NFR4**: Clear chat bubble design
- **NFR5**: Dynamic placeholder updates
- **NFR6**: Humanized follow-up messages

### 4.3 Security
- **NFR7**: Privacy Mode compliance
- **NFR8**: Secure API communication

## 5. User Flow

### 5.1 Initial Interaction
- Welcome screen with animations
- Dynamic input field with rotating placeholders

### 5.2 Parsing and Loading
- Loading state with spinner
- Display of parsed results
- Follow-up questions as needed

### 5.3 Iterative Completion
- User response handling
- Real-time updates
- Field completion tracking

### 5.4 Finalization
- Summary display
- API call execution
- Results presentation

### 5.5 Error Handling
- Unsupported query responses
- API error handling
- User guidance

## 6. Testing Requirements

### 6.1 Unit Testing
- Field extraction validation
- Follow-up message testing
- Ambiguous case handling

### 6.2 Integration Testing
- Multi-turn conversation flow
- UI transition verification
- API integration testing

### 6.3 End-to-End Testing
- Complete workflow validation
- Security compliance
- Error scenario handling

## 7. Future Enhancements
- Enhanced NLP accuracy
- Dynamic rule updates
- Expanded query handling
- UI personalization
- Backend optimization

## 8. Conclusion
This PRD outlines the comprehensive requirements for CardGenius, ensuring a robust, user-friendly experience for spending analysis and card recommendations.

---

*This is a living document that will be updated as we discover new requirements and edge cases.* 