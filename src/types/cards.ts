export interface CardRecommendation {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  rewardsRate: number;
  benefits: string[];
  eligibility: {
    minIncome: number;
    minAge: number;
    creditScore: string;
  };
  pros: string[];
  cons: string[];
  imageUrl: string;
}

export interface CardRecommendationsResponse {
  recommendations: CardRecommendation[];
  explanation: string;
  matchScore: number;
  spendingAnalysis: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface CardComparison {
  card1: CardRecommendation;
  card2: CardRecommendation;
  comparison: {
    category: string;
    winner: string;
    difference: string;
  }[];
  overallWinner: string;
  explanation: string;
} 