import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, DollarSign, Plus, Tag } from 'lucide-react';
import { Category, Expense } from '@/types/expense';
import { storageUtils } from '@/utils/storage';
import { dateUtils } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

const AddExpense = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    note: '',
  });

  useEffect(() => {
    setCategories(storageUtils.getCategories());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in the amount and category.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount,
      category: formData.category,
      note: formData.note || undefined,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    storageUtils.addExpense(expense);
    
    toast({
      title: "Expense Added",
      description: `Added ${dateUtils.formatAmount(amount)} expense successfully.`,
    });

    // Reset form
    setFormData({ amount: '', category: '', note: '' });
    
    // Navigate back to overview
    navigate('/');
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || 
           { name: categoryId, icon: '📦', color: 'hsl(240 5% 64.9%)' };
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Expense</h1>
          <p className="text-sm text-muted-foreground">Record a new expense</p>
        </div>
      </div>

      {/* Add Expense Form */}
      <Card className="bg-gradient-card border-0 shadow-finance-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            New Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-10 text-lg font-semibold bg-background/50 border-border/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Note <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="note"
                placeholder="Add a note about this expense..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="bg-background/50 border-border/50 min-h-[80px]"
              />
            </div>

            {/* Preview */}
            {formData.amount && formData.category && (
              <Card className="bg-gradient-accent/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryInfo(formData.category).icon}</span>
                      <div>
                        <div className="font-medium">{getCategoryInfo(formData.category).name}</div>
                        {formData.note && (
                          <div className="text-sm text-muted-foreground">{formData.note}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-finance-expense text-lg">
                        -{dateUtils.formatAmount(parseFloat(formData.amount) || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Amount Buttons */}
      <Card className="bg-gradient-card border-0 shadow-finance-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Amounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, 50].map(amount => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/50"
              >
                ${amount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpense;