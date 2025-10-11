import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  IncomeSource,
  Expense,
  Investment,
  Goal,
  saveIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  subscribeToIncomes,
  saveExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  subscribeToExpenses,
  saveInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
  subscribeToInvestments,
  saveGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  subscribeToGoals
} from '@/services/databaseService';

// ==================== INCOME HOOK ====================

export const useRealtimeIncomes = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIncomes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToIncomes(user.uid, (updatedIncomes) => {
      setIncomes(updatedIncomes);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [user]);

  const addIncome = async (income: Omit<IncomeSource, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await saveIncome(user.uid, income);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const modifyIncome = async (incomeId: string, updates: Partial<IncomeSource>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await updateIncome(user.uid, incomeId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeIncome = async (incomeId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteIncome(user.uid, incomeId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const totalMonthlyIncome = incomes.reduce((total, income) => {
    let monthlyAmount = income.amount;
    if (income.frequency === 'yearly') monthlyAmount = income.amount / 12;
    if (income.frequency === 'weekly') monthlyAmount = income.amount * 4;
    return total + monthlyAmount;
  }, 0);

  return {
    incomes,
    loading,
    error,
    addIncome,
    modifyIncome,
    removeIncome,
    totalMonthlyIncome
  };
};

// ==================== EXPENSE HOOK ====================

export const useRealtimeExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToExpenses(user.uid, (updatedExpenses) => {
      setExpenses(updatedExpenses);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await saveExpense(user.uid, expense);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const modifyExpense = async (expenseId: string, updates: Partial<Expense>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await updateExpense(user.uid, expenseId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeExpense = async (expenseId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteExpense(user.uid, expenseId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    expenses,
    loading,
    error,
    addExpense,
    modifyExpense,
    removeExpense,
    totalExpenses,
    expensesByCategory
  };
};

// ==================== INVESTMENT HOOK ====================

export const useRealtimeInvestments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setInvestments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToInvestments(user.uid, (updatedInvestments) => {
      setInvestments(updatedInvestments);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [user]);

  const addInvestment = async (investment: Omit<Investment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await saveInvestment(user.uid, investment);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const modifyInvestment = async (investmentId: string, updates: Partial<Investment>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await updateInvestment(user.uid, investmentId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeInvestment = async (investmentId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteInvestment(user.uid, investmentId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const totalInvested = investments.reduce((total, inv) => total + inv.amount, 0);
  const totalCurrentValue = investments.reduce((total, inv) => total + inv.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return {
    investments,
    loading,
    error,
    addInvestment,
    modifyInvestment,
    removeInvestment,
    totalInvested,
    totalCurrentValue,
    totalGainLoss,
    totalGainLossPercentage
  };
};

// ==================== GOAL HOOK ====================

export const useRealtimeGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToGoals(user.uid, (updatedGoals) => {
      setGoals(updatedGoals);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [user]);

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await saveGoal(user.uid, goal);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const modifyGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await updateGoal(user.uid, goalId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeGoal = async (goalId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteGoal(user.uid, goalId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);
  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);

  return {
    goals,
    loading,
    error,
    addGoal,
    modifyGoal,
    removeGoal,
    completedGoals,
    activeGoals
  };
};
