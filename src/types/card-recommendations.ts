export interface CardRecommendation {
  id: string;
  name: string;
  issuer: string;
  annual_fee: number;
  rewards_rate: number;
  benefits: string[];
  eligibility_criteria: {
    min_income: number;
    min_credit_score: number;
  };
  spending_categories: {
    category: string;
    reward_rate: number;
  }[];
}

export interface CardRecommendationsResponse {
  recommendations: CardRecommendation[];
  summary: {
    best_for: string;
    estimated_annual_rewards: number;
    estimated_annual_fee: number;
    net_benefit: number;
  };
} 