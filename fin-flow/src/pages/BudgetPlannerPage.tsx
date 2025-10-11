import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useIncome } from '@/contexts/IncomeContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useToast } from '@/hooks/use-toast';

interface BudgetCategory {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  color: string;
}

export function BudgetPlannerPage() {
  const { totalMonthlyIncome } = useIncome();
  const { expenses, totalExpenses } = useExpenses();
  const { toast } = useToast();

  const [budgets, setBudgets] = useState<BudgetCategory[]>([
    { id: '1', category: 'Food', budgetAmount: 10000, spentAmount: 0, color: 'bg-green-500' },
    { id: '2', category: 'Transportation', budgetAmount: 5000, spentAmount: 0, color: 'bg-blue-500' },
    { id: '3', category: 'Entertainment', budgetAmount: 3000, spentAmount: 0, color: 'bg-purple-500' },
    { id: '4', category: 'Utilities', budgetAmount: 4000, spentAmount: 0, color: 'bg-yellow-500' },
    { id: '5', category: 'Shopping', budgetAmount: 5000, spentAmount: 0, color: 'bg-pink-500' },
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');

  // Calculate spent amounts from expenses
  React.useEffect(() => {
    setBudgets(prev => prev.map(budget => {
      const spent = expenses
        .filter(exp => exp.category === budget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { ...budget, spentAmount: spent };
    }));
  }, [expenses]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remaining = totalBudget - totalSpent;
  const remainingIncome = totalMonthlyIncome - totalBudget;

  const addBudgetCategory = () => {
    if (!newCategory || !newBudget) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both category and budget amount',
        variant: 'destructive'
      });
      return;
    }

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-cyan-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setBudgets(prev => [...prev, {
      id: Date.now().toString(),
      category: newCategory,
      budgetAmount: parseFloat(newBudget),
      spentAmount: 0,
      color: randomColor
    }]);

    setNewCategory('');
    setNewBudget('');

    toast({
      title: 'Budget Added',
      description: `Budget for ${newCategory} has been created`
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Budget Planner</h1>
            <p className="text-white/90 mt-1">
              Plan and track your monthly budget effectively
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Monthly Income</p>
                <h3 className="text-2xl font-bold text-blue-900">₹{totalMonthlyIncome.toLocaleString()}</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Budget</p>
                <h3 className="text-2xl font-bold text-purple-900">₹{totalBudget.toLocaleString()}</h3>
              </div>
              <Wallet className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Spent</p>
                <h3 className="text-2xl font-bold text-red-900">₹{totalSpent.toLocaleString()}</h3>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`p-6 bg-gradient-to-br ${remainingIncome >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${remainingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>Remaining</p>
                <h3 className={`text-2xl font-bold ${remainingIncome >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  ₹{Math.abs(remainingIncome).toLocaleString()}
                </h3>
              </div>
              {remainingIncome >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add New Budget Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Add Budget Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                placeholder="e.g., Healthcare"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget Amount (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 5000"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addBudgetCategory} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Budget Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Budget by Category</h2>
          <div className="space-y-6">
            {budgets.map((budget, index) => {
              const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
              const isOverBudget = percentage > 100;

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`}></div>
                      <span className="font-semibold">{budget.category}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                        ₹{budget.spentAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-500"> / ₹{budget.budgetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm">
                    <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {isOverBudget ? 'Over budget!' : `₹${(budget.budgetAmount - budget.spentAmount).toLocaleString()} left`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
