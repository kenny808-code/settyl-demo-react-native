import { Expense } from '@/types/expense';

export const dateUtils = {
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  },

  formatAmount: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  },

  isToday: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isThisWeek: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return date >= weekStart;
  },

  isThisMonth: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  },

  groupExpensesByDate: (expenses: Expense[]): Record<string, Expense[]> => {
    const groups: Record<string, Expense[]> = {};
    
    expenses.forEach(expense => {
      const dateKey = dateUtils.formatDate(expense.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
    });

    return groups;
  },

  getTotals: (expenses: Expense[]) => {
    const today = expenses.filter(exp => dateUtils.isToday(exp.date))
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const thisWeek = expenses.filter(exp => dateUtils.isThisWeek(exp.date))
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const thisMonth = expenses.filter(exp => dateUtils.isThisMonth(exp.date))
      .reduce((sum, exp) => sum + exp.amount, 0);

    return { today, thisWeek, thisMonth };
  },

  getCategoryBreakdown: (expenses: Expense[]) => {
    const monthlyExpenses = expenses.filter(exp => dateUtils.isThisMonth(exp.date));
    const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const breakdown: Record<string, { amount: number; percentage: number; count: number }> = {};
    
    monthlyExpenses.forEach(expense => {
      if (!breakdown[expense.category]) {
        breakdown[expense.category] = { amount: 0, percentage: 0, count: 0 };
      }
      breakdown[expense.category].amount += expense.amount;
      breakdown[expense.category].count += 1;
    });

    // Calculate percentages
    Object.keys(breakdown).forEach(category => {
      breakdown[category].percentage = total > 0 
        ? (breakdown[category].amount / total) * 100 
        : 0;
    });

    return breakdown;
  },
};