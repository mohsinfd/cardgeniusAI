import { CardRecommendation as CardGeniusCardRecommendation } from './cardgenius';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  spending_data?: Record<string, number>;
  follow_up_question?: string;
  recommendations?: CardGeniusCardRecommendation[];
} 