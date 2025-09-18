export interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: '🍕', color: 'hsl(32.1 94.6% 43.7%)' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'hsl(221.2 83.2% 53.3%)' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'hsl(270.7 91% 65.1%)' },
  { id: 'bills', name: 'Bills', icon: '📄', color: 'hsl(0 84.2% 60.2%)' },
  { id: 'other', name: 'Other', icon: '📦', color: 'hsl(240 5% 64.9%)' },
];

export type SortOption = 'latest' | 'amount-high' | 'amount-low';
export type FilterOption = 'all' | string; // 'all' or category id