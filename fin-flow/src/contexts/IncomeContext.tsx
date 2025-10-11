import React, { createContext, useContext, ReactNode } from 'react';
import { useRealtimeIncomes } from '@/hooks/useRealtimeDatabase';

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
}

interface IncomeContextType {
  incomeSources: IncomeSource[];
  addIncomeSource: (income: Omit<IncomeSource, 'id'>) => Promise<void>;
  updateIncomeSource: (id: string, updates: Partial<IncomeSource>) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;
  totalMonthlyIncome: number;
  totalYearlyIncome: number;
  loading: boolean;
  error: string | null;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
};

interface IncomeProviderProps {
  children: ReactNode;
}

export const IncomeProvider: React.FC<IncomeProviderProps> = ({ children }) => {
  const {
    incomes,
    loading,
    error,
    addIncome,
    modifyIncome,
    removeIncome,
    totalMonthlyIncome
  } = useRealtimeIncomes();

  const addIncomeSource = async (income: Omit<IncomeSource, 'id'>) => {
    await addIncome(income);
  };

  const updateIncomeSource = async (id: string, updates: Partial<IncomeSource>) => {
    await modifyIncome(id, updates);
  };

  const deleteIncomeSource = async (id: string) => {
    await removeIncome(id);
  };

  const totalYearlyIncome = totalMonthlyIncome * 12;

  const value: IncomeContextType = {
    incomeSources: incomes,
    addIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
    totalMonthlyIncome,
    totalYearlyIncome,
    loading,
    error
  };

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
};