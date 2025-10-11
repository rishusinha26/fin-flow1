import React, { createContext, useContext, ReactNode } from 'react';
import { useRealtimeExpenses } from '@/hooks/useRealtimeDatabase';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const {
    expenses,
    loading,
    error,
    addExpense: addExpenseDb,
    removeExpense,
    totalExpenses,
    expensesByCategory
  } = useRealtimeExpenses();

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    await addExpenseDb(expense);
  };

  const deleteExpense = async (id: string) => {
    await removeExpense(id);
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      addExpense, 
      deleteExpense, 
      totalExpenses,
      expensesByCategory,
      loading,
      error
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
