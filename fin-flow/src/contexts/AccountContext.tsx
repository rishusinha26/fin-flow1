import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit_card' | 'wallet' | 'investment';
  balance: number;
  currency: string;
  isDefault: boolean;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

interface AccountContextType {
  accounts: Account[];
  transfers: Transfer[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt'>) => void;
  getTotalBalance: () => number;
  getAccountBalance: (id: string) => number;
  defaultAccount: Account | undefined;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    if (user) {
      const storedAccounts = localStorage.getItem(`accounts_${user.uid}`);
      const storedTransfers = localStorage.getItem(`transfers_${user.uid}`);
      
      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      if (storedTransfers) setTransfers(JSON.parse(storedTransfers));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (accounts.length > 0) {
        localStorage.setItem(`accounts_${user.uid}`, JSON.stringify(accounts));
      }
      if (transfers.length > 0) {
        localStorage.setItem(`transfers_${user.uid}`, JSON.stringify(transfers));
      }
    }
  }, [accounts, transfers, user]);

  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(accounts.map(acc =>
      acc.id === id ? { ...acc, ...updates } : acc
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const addTransfer = (transfer: Omit<Transfer, 'id' | 'createdAt'>) => {
    const newTransfer: Transfer = {
      ...transfer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Update account balances
    setAccounts(accounts.map(acc => {
      if (acc.id === transfer.fromAccountId) {
        return { ...acc, balance: acc.balance - transfer.amount };
      }
      if (acc.id === transfer.toAccountId) {
        return { ...acc, balance: acc.balance + transfer.amount };
      }
      return acc;
    }));

    setTransfers([...transfers, newTransfer]);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  const getAccountBalance = (id: string) => {
    const account = accounts.find(acc => acc.id === id);
    return account?.balance || 0;
  };

  const defaultAccount = accounts.find(acc => acc.isDefault);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        transfers,
        addAccount,
        updateAccount,
        deleteAccount,
        addTransfer,
        getTotalBalance,
        getAccountBalance,
        defaultAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within AccountProvider');
  }
  return context;
}
