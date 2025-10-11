import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Debt {
  id: string;
  name: string;
  type: 'credit_card' | 'personal_loan' | 'home_loan' | 'car_loan' | 'student_loan' | 'other';
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  payoffStrategy: 'snowball' | 'avalanche' | 'custom';
  createdAt: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  principal: number;
  interest: number;
}

interface DebtContextType {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'payments'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addPayment: (debtId: string, payment: Omit<Payment, 'id'>) => void;
  totalDebt: number;
  totalMonthlyPayment: number;
  debtFreeDate: Date | null;
  calculatePayoffPlan: (strategy: 'snowball' | 'avalanche') => any[];
}

const DebtContext = createContext<DebtContextType | undefined>(undefined);

export function DebtProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`debts_${user.uid}`);
      if (stored) {
        setDebts(JSON.parse(stored));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && debts.length > 0) {
      localStorage.setItem(`debts_${user.uid}`, JSON.stringify(debts));
    }
  }, [debts, user]);

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt' | 'payments'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      payments: [],
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, ...updates } : debt
    ));
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const addPayment = (debtId: string, payment: Omit<Payment, 'id'>) => {
    setDebts(debts.map(debt => {
      if (debt.id === debtId) {
        const newPayment: Payment = {
          ...payment,
          id: Date.now().toString(),
        };
        const newRemainingAmount = debt.remainingAmount - payment.principal;
        return {
          ...debt,
          remainingAmount: Math.max(0, newRemainingAmount),
          payments: [...debt.payments, newPayment],
        };
      }
      return debt;
    }));
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const totalMonthlyPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const calculatePayoffPlan = (strategy: 'snowball' | 'avalanche') => {
    const sortedDebts = [...debts].sort((a, b) => {
      if (strategy === 'snowball') {
        return a.remainingAmount - b.remainingAmount;
      } else {
        return b.interestRate - a.interestRate;
      }
    });
    return sortedDebts;
  };

  // Calculate debt-free date (simplified)
  const debtFreeDate = totalMonthlyPayment > 0 && totalDebt > 0
    ? new Date(Date.now() + (totalDebt / totalMonthlyPayment) * 30 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        updateDebt,
        deleteDebt,
        addPayment,
        totalDebt,
        totalMonthlyPayment,
        debtFreeDate,
        calculatePayoffPlan,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
}

export function useDebt() {
  const context = useContext(DebtContext);
  if (!context) {
    throw new Error('useDebt must be used within DebtProvider');
  }
  return context;
}
