export interface SpendingData {
  amazon_spends: number | null;
  flipkart_spends: number | null;
  dining_or_going_out: number | null;
  [key: string]: number | null;
}

export interface SpendingCategory {
  key: string;
  displayName: string;
  description: string;
  icon: string;
}

export interface SpendingAnalysis {
  total: number;
  categories: {
    category: keyof SpendingData;
    amount: number;
    percentage: number;
  }[];
}

export interface SpendingUpdate {
  category: string;
  amount: number;
  timestamp: number;
}

export const SPENDING_CATEGORIES: SpendingCategory[] = [
  {
    key: 'amazon_spends',
    displayName: 'Amazon',
    description: 'Online shopping on Amazon',
    icon: '🛒'
  },
  {
    key: 'flipkart_spends',
    displayName: 'Flipkart',
    description: 'Online shopping on Flipkart',
    icon: '🛍️'
  },
  {
    key: 'dining_or_going_out',
    displayName: 'Dining',
    description: 'Restaurants and dining out',
    icon: '🍽️'
  },
  {
    key: 'fuel',
    displayName: 'Fuel',
    description: 'Petrol and diesel expenses',
    icon: '⛽'
  },
  {
    key: 'other_online',
    displayName: 'Other Online',
    description: 'Other online shopping',
    icon: '🌐'
  }
]; 