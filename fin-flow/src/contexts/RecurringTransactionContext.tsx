import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useExpenses } from './ExpenseContext';

export interface RecurringTransaction {
  id: string;
  type: 'income' | 'expense';
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextOccurrence: string;
  isActive: boolean;
  autoExecute: boolean;
  lastExecuted?: string;
  createdAt: string;
}

interface RecurringTransactionContextType {
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'createdAt' | 'nextOccurrence'>) => void;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void;
  deleteRecurringTransaction: (id: string) => void;
  toggleActive: (id: string) => void;
  executeTransaction: (id: string) => void;
  checkAndExecutePending: () => void;
  upcomingTransactions: RecurringTransaction[];
}

const RecurringTransactionContext = createContext<RecurringTransactionContextType | undefined>(undefined);

export function RecurringTransactionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`recurring_transactions_${user.uid}`);
      if (stored) {
        setRecurringTransactions(JSON.parse(stored));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && recurringTransactions.length > 0) {
      localStorage.setItem(`recurring_transactions_${user.uid}`, JSON.stringify(recurringTransactions));
    }
  }, [recurringTransactions, user]);

  const calculateNextOccurrence = (startDate: string, frequency: string, lastExecuted?: string): string => {
    const baseDate = lastExecuted ? new Date(lastExecuted) : new Date(startDate);
    const nextDate = new Date(baseDate);

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate.toISOString().split('T')[0];
  };

  const addRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id' | 'createdAt' | 'nextOccurrence'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      nextOccurrence: calculateNextOccurrence(transaction.startDate, transaction.frequency),
    };
    setRecurringTransactions([...recurringTransactions, newTransaction]);
  };

  const updateRecurringTransaction = (id: string, updates: Partial<RecurringTransaction>) => {
    setRecurringTransactions(recurringTransactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(recurringTransactions.filter(t => t.id !== id));
  };

  const toggleActive = (id: string) => {
    setRecurringTransactions(recurringTransactions.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const executeTransaction = (id: string) => {
    const transaction = recurringTransactions.find(t => t.id === id);
    if (!transaction) return;

    const today = new Date().toISOString().split('T')[0];

    if (transaction.type === 'expense') {
      addExpense({
        amount: transaction.amount,
        category: transaction.category,
        description: `${transaction.name} (Recurring)`,
        date: today,
      });
    }
    // Note: For income, you would need to manually add it via the Income page
    // as the IncomeContext uses Firebase and requires async operations

    // Update next occurrence
    const nextOccurrence = calculateNextOccurrence(transaction.startDate, transaction.frequency, today);
    updateRecurringTransaction(id, {
      lastExecuted: today,
      nextOccurrence,
    });
  };

  const checkAndExecutePending = () => {
    const today = new Date().toISOString().split('T')[0];
    
    recurringTransactions.forEach(transaction => {
      if (
        transaction.isActive &&
        transaction.autoExecute &&
        transaction.nextOccurrence <= today &&
        (!transaction.endDate || transaction.nextOccurrence <= transaction.endDate)
      ) {
        executeTransaction(transaction.id);
      }
    });
  };

  // Auto-check on mount and daily
  useEffect(() => {
    checkAndExecutePending();
    const interval = setInterval(checkAndExecutePending, 24 * 60 * 60 * 1000); // Daily check
    return () => clearInterval(interval);
  }, [recurringTransactions]);

  const upcomingTransactions = recurringTransactions
    .filter(t => t.isActive)
    .sort((a, b) => new Date(a.nextOccurrence).getTime() - new Date(b.nextOccurrence).getTime())
    .slice(0, 5);

  return (
    <RecurringTransactionContext.Provider
      value={{
        recurringTransactions,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        toggleActive,
        executeTransaction,
        checkAndExecutePending,
        upcomingTransactions,
      }}
    >
      {children}
    </RecurringTransactionContext.Provider>
  );
}

export function useRecurringTransactions() {
  const context = useContext(RecurringTransactionContext);
  if (!context) {
    throw new Error('useRecurringTransactions must be used within RecurringTransactionProvider');
  }
  return context;
}
