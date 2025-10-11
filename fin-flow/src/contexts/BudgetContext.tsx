import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useExpenses } from './ExpenseContext';

export interface BudgetLimit {
  id: string;
  category: string;
  monthlyLimit: number;
  alertAt75: boolean;
  alertAt90: boolean;
  rolloverUnused: boolean;
  createdAt: string;
}

interface BudgetContextType {
  budgetLimits: BudgetLimit[];
  addBudgetLimit: (limit: Omit<BudgetLimit, 'id' | 'createdAt'>) => void;
  updateBudgetLimit: (id: string, updates: Partial<BudgetLimit>) => void;
  deleteBudgetLimit: (id: string) => void;
  getCategoryBudget: (category: string) => BudgetLimit | undefined;
  getCategorySpending: (category: string) => number;
  getCategoryProgress: (category: string) => number;
  isOverBudget: (category: string) => boolean;
  getBudgetAlerts: () => { category: string; percentage: number; message: string }[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { expensesByCategory } = useExpenses();
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`budget_limits_${user.uid}`);
      if (stored) {
        setBudgetLimits(JSON.parse(stored));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && budgetLimits.length > 0) {
      localStorage.setItem(`budget_limits_${user.uid}`, JSON.stringify(budgetLimits));
    }
  }, [budgetLimits, user]);

  const addBudgetLimit = (limit: Omit<BudgetLimit, 'id' | 'createdAt'>) => {
    const newLimit: BudgetLimit = {
      ...limit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBudgetLimits([...budgetLimits, newLimit]);
  };

  const updateBudgetLimit = (id: string, updates: Partial<BudgetLimit>) => {
    setBudgetLimits(budgetLimits.map(limit =>
      limit.id === id ? { ...limit, ...updates } : limit
    ));
  };

  const deleteBudgetLimit = (id: string) => {
    setBudgetLimits(budgetLimits.filter(limit => limit.id !== id));
  };

  const getCategoryBudget = (category: string) => {
    return budgetLimits.find(limit => limit.category === category);
  };

  const getCategorySpending = (category: string) => {
    return expensesByCategory[category] || 0;
  };

  const getCategoryProgress = (category: string) => {
    const budget = getCategoryBudget(category);
    if (!budget) return 0;
    const spending = getCategorySpending(category);
    return (spending / budget.monthlyLimit) * 100;
  };

  const isOverBudget = (category: string) => {
    return getCategoryProgress(category) > 100;
  };

  const getBudgetAlerts = () => {
    const alerts: { category: string; percentage: number; message: string }[] = [];

    budgetLimits.forEach(budget => {
      const progress = getCategoryProgress(budget.category);
      
      if (progress >= 100) {
        alerts.push({
          category: budget.category,
          percentage: progress,
          message: `You've exceeded your ${budget.category} budget!`,
        });
      } else if (progress >= 90 && budget.alertAt90) {
        alerts.push({
          category: budget.category,
          percentage: progress,
          message: `You've used 90% of your ${budget.category} budget`,
        });
      } else if (progress >= 75 && budget.alertAt75) {
        alerts.push({
          category: budget.category,
          percentage: progress,
          message: `You've used 75% of your ${budget.category} budget`,
        });
      }
    });

    return alerts;
  };

  return (
    <BudgetContext.Provider
      value={{
        budgetLimits,
        addBudgetLimit,
        updateBudgetLimit,
        deleteBudgetLimit,
        getCategoryBudget,
        getCategorySpending,
        getCategoryProgress,
        isOverBudget,
        getBudgetAlerts,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
}
