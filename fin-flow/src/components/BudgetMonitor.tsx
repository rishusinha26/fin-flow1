
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const BudgetMonitor = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(2000);
  const [newBudget, setNewBudget] = useState('');
  const currentSpending = 1650; // This would be calculated from actual expenses
  const { toast } = useToast();

  const budgetPercentage = (currentSpending / monthlyBudget) * 100;
  const remainingBudget = monthlyBudget - currentSpending;

  const updateBudget = () => {
    if (newBudget && parseFloat(newBudget) > 0) {
      setMonthlyBudget(parseFloat(newBudget));
      setNewBudget('');
      toast({
        title: "Budget Updated!",
        description: `Your monthly budget has been set to $${newBudget}.`
      });
    }
  };

  const getBudgetAlert = () => {
    if (budgetPercentage >= 100) {
      return {
        message: "⚠️ You've exceeded your budget!",
        color: "text-red-600",
        bgColor: "bg-red-50"
      };
    } else if (budgetPercentage >= 85) {
      return {
        message: "⚠️ You're close to your budget limit!",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      };
    } else if (budgetPercentage >= 70) {
      return {
        message: "📊 You're at 70% of your budget",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      };
    }
    return {
      message: "✅ You're within budget!",
      color: "text-green-600",
      bgColor: "bg-green-50"
    };
  };

  const alert = getBudgetAlert();

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🎯 Budget Monitor
      </h2>

      {/* Budget Overview */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">${monthlyBudget.toFixed(2)}</p>
          <p className="text-gray-600">Monthly Budget</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent: ${currentSpending.toFixed(2)}</span>
            <span>Remaining: ${remainingBudget.toFixed(2)}</span>
          </div>
          <Progress 
            value={Math.min(budgetPercentage, 100)} 
            className="h-3"
          />
          <p className="text-center text-sm text-gray-600">
            {budgetPercentage.toFixed(1)}% used
          </p>
        </div>

        {/* Budget Alert */}
        <div className={`p-3 rounded-lg ${alert.bgColor}`}>
          <p className={`text-sm font-medium ${alert.color}`}>
            {alert.message}
          </p>
        </div>

        {/* Update Budget */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-3">Update Monthly Budget</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="New budget amount"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
            />
            <Button onClick={updateBudget} size="sm">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetMonitor;
