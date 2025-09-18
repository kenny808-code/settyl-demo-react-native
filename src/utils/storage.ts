import { Expense, Category, DEFAULT_CATEGORIES } from '@/types/expense';

const EXPENSES_KEY = 'finance-tracker-expenses';
const CATEGORIES_KEY = 'finance-tracker-categories';

export const storageUtils = {
  // Expenses
  getExpenses: (): Expense[] => {
    try {
      const data = localStorage.getItem(EXPENSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Failed to save expenses:', error);
    }
  },

  addExpense: (expense: Expense): void => {
    const expenses = storageUtils.getExpenses();
    expenses.unshift(expense);
    storageUtils.saveExpenses(expenses);
  },

  // Categories
  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (data) {
        const stored = JSON.parse(data);
        // Ensure default categories are always present
        const defaultIds = DEFAULT_CATEGORIES.map(cat => cat.id);
        const defaults = DEFAULT_CATEGORIES.filter(cat => 
          !stored.some((s: Category) => s.id === cat.id)
        );
        return [...defaults, ...stored];
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories: (categories: Category[]): void => {
    try {
      // Only save custom categories (non-default ones)
      const customCategories = categories.filter(cat => 
        !DEFAULT_CATEGORIES.some(def => def.id === cat.id)
      );
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(customCategories));
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  },

  addCategory: (category: Category): void => {
    const categories = storageUtils.getCategories();
    categories.push(category);
    storageUtils.saveCategories(categories);
  },

  clearAllData: (): void => {
    try {
      localStorage.removeItem(EXPENSES_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  },
};