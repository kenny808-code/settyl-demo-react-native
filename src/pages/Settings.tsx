import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon, Trash2, Plus, Tag } from 'lucide-react';
import { Category } from '@/types/expense';
import { storageUtils } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';

const EMOJI_OPTIONS = ['🍕', '🚗', '🛍️', '📄', '📦', '🎬', '💊', '🎓', '🏠', '✈️', '🎵', '💅', '🏃‍♂️', '📱', '🍺', '☕', '🎉', '🔧'];

const Settings = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📦');

  useEffect(() => {
    setCategories(storageUtils.getCategories());
  }, []);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === newCategoryName.toLowerCase()
    );

    if (existingCategory) {
      toast({
        title: "Category Exists",
        description: "A category with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName,
      icon: selectedEmoji,
      color: 'hsl(240 5% 64.9%)',
    };

    storageUtils.addCategory(newCategory);
    setCategories(storageUtils.getCategories());
    
    toast({
      title: "Category Added",
      description: `"${newCategoryName}" category has been created.`,
    });

    setNewCategoryName('');
    setSelectedEmoji('📦');
    setIsAddCategoryOpen(false);
  };

  const handleClearAllData = () => {
    storageUtils.clearAllData();
    setCategories(storageUtils.getCategories()); // Reset to defaults
    
    toast({
      title: "Data Cleared",
      description: "All expenses and custom categories have been deleted.",
      variant: "destructive",
    });
  };

  const isDefaultCategory = (categoryId: string) => {
    const defaultIds = ['food', 'transport', 'shopping', 'bills', 'other'];
    return defaultIds.includes(categoryId);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your categories and data</p>
      </div>

      {/* Categories Management */}
      <Card className="bg-gradient-card border-0 shadow-finance-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Categories
          </CardTitle>
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a custom category for your expenses.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Entertainment, Healthcare"
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choose Icon</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_OPTIONS.map(emoji => (
                      <Button
                        key={emoji}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`text-xl h-10 ${
                          selectedEmoji === emoji 
                            ? 'bg-primary/20 border-primary' 
                            : 'bg-background/50 border-border/50'
                        }`}
                        onClick={() => setSelectedEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedEmoji}</span>
                    <span className="font-medium">{newCategoryName || 'Category Name'}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                {!isDefaultCategory(category.id) && (
                  <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                    Custom
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gradient-card border-0 shadow-finance-card">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete all your expenses and custom categories. This action cannot be undone.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your expenses 
                  and custom categories from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, clear all data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="bg-gradient-card border-0 shadow-finance-card">
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Finance Tracker</strong> helps you keep track of your daily expenses
              with beautiful category breakdown and intelligent summaries.
            </p>
            <p>
              All your data is stored locally on your device and never leaves your browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;