import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  category: string;
  nextBillingDate: string;
  autoRenew: boolean;
  reminderDays: number;
  color?: string;
  icon?: string;
  createdAt: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  totalMonthlySubscriptions: number;
  totalYearlySubscriptions: number;
  upcomingRenewals: Subscription[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Load subscriptions from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`subscriptions_${user.uid}`);
      if (stored) {
        setSubscriptions(JSON.parse(stored));
      }
    }
  }, [user]);

  // Save subscriptions to localStorage
  useEffect(() => {
    if (user && subscriptions.length > 0) {
      localStorage.setItem(`subscriptions_${user.uid}`, JSON.stringify(subscriptions));
    }
  }, [subscriptions, user]);

  const addSubscription = (subscription: Omit<Subscription, 'id' | 'createdAt'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSubscriptions([...subscriptions, newSubscription]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  // Calculate monthly cost for different frequencies
  const getMonthlyAmount = (amount: number, frequency: string) => {
    switch (frequency) {
      case 'weekly': return amount * 4.33;
      case 'monthly': return amount;
      case 'quarterly': return amount / 3;
      case 'yearly': return amount / 12;
      default: return amount;
    }
  };

  const totalMonthlySubscriptions = subscriptions.reduce(
    (sum, sub) => sum + getMonthlyAmount(sub.amount, sub.frequency),
    0
  );

  const totalYearlySubscriptions = totalMonthlySubscriptions * 12;

  // Get subscriptions renewing in next 7 days
  const upcomingRenewals = subscriptions.filter(sub => {
    const nextDate = new Date(sub.nextBillingDate);
    const today = new Date();
    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= sub.reminderDays && diffDays >= 0;
  });

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        totalMonthlySubscriptions,
        totalYearlySubscriptions,
        upcomingRenewals,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionProvider');
  }
  return context;
}
