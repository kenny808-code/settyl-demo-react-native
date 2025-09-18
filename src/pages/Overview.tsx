import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Expense, Category, SortOption, FilterOption } from '@/types/expense';
import { storageUtils } from '@/utils/storage';
import { dateUtils } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

const Overview = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  useEffect(() => {
    setExpenses(storageUtils.getExpenses());
    setCategories(storageUtils.getCategories());
  }, []);

  const filteredAndSortedExpenses = React.useMemo(() => {
    let filtered = expenses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterBy !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterBy);
    }

    // Sort expenses
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'amount-high':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-low':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }

    return filtered;
  }, [expenses, searchTerm, sortBy, filterBy]);

  const groupedExpenses = dateUtils.groupExpensesByDate(filteredAndSortedExpenses);
  const totals = dateUtils.getTotals(expenses);
  const categoryBreakdown = dateUtils.getCategoryBreakdown(expenses);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || 
           { name: categoryId, icon: '📦', color: 'hsl(240 5% 64.9%)' };
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Finance Tracker
        </h1>
        <p className="text-muted-foreground">Track your expenses and stay on budget</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-0 shadow-finance-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">
              {dateUtils.formatAmount(totals.today)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-finance-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">
              {dateUtils.formatAmount(totals.thisWeek)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-finance-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">
              {dateUtils.formatAmount(totals.thisMonth)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([categoryId, data]) => {
                  const category = getCategoryInfo(categoryId);
                  return (
                    <div key={categoryId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {data.count} transaction{data.count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-finance-expense">
                          {dateUtils.formatAmount(data.amount)}
                        </div>
                        <div className="text-sm text-primary font-medium">
                          {data.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-finance-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search expenses by note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="amount-high">Highest Amount</SelectItem>
                <SelectItem value="amount-low">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {Object.keys(groupedExpenses).length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-finance-card">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start tracking your expenses by adding your first one!'
                }
              </p>
              {(!searchTerm && filterBy === 'all') && (
                <Button 
                  onClick={() => window.location.href = '/add-expense'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add First Expense
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedExpenses).map(([date, dateExpenses]) => (
            <Card key={date} className="bg-gradient-card border-0 shadow-finance-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">{date}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dateExpenses.map((expense) => {
                  const category = getCategoryInfo(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-all duration-200 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {expense.note && (
                            <div className="text-sm text-muted-foreground">
                              {expense.note}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-finance-expense">
                          -{dateUtils.formatAmount(expense.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(expense.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Overview;