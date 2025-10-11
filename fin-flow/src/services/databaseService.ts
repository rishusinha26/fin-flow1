import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  push,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  DataSnapshot
} from 'firebase/database';
import { realtimeDb } from '@/config/firebaseConfig';

// Types
export interface IncomeSource {
  id: string;
  userId: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  createdAt: number;
  updatedAt: number;
}

export interface Expense {
  id: string;
  userId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: number;
  updatedAt: number;
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  purchaseDate: string;
  createdAt: number;
  updatedAt: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: number;
  updatedAt: number;
}

// Database paths
const PATHS = {
  users: 'users',
  income: 'income',
  expenses: 'expenses',
  investments: 'investments',
  goals: 'goals',
  userProfile: 'userProfiles'
};

// Helper function to get user-specific path
const getUserPath = (userId: string, collection: string) => {
  return `${PATHS.users}/${userId}/${collection}`;
};

// ==================== INCOME OPERATIONS ====================

export const saveIncome = async (userId: string, income: Omit<IncomeSource, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const incomeRef = push(ref(realtimeDb, getUserPath(userId, PATHS.income)));
  const incomeData: IncomeSource = {
    ...income,
    id: incomeRef.key!,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await set(incomeRef, incomeData);
  return incomeData;
};

export const getIncomes = async (userId: string): Promise<IncomeSource[]> => {
  const incomesRef = ref(realtimeDb, getUserPath(userId, PATHS.income));
  const snapshot = await get(incomesRef);
  
  if (!snapshot.exists()) return [];
  
  const incomes: IncomeSource[] = [];
  snapshot.forEach((child) => {
    incomes.push(child.val());
  });
  
  return incomes;
};

export const updateIncome = async (userId: string, incomeId: string, updates: Partial<IncomeSource>) => {
  const incomeRef = ref(realtimeDb, `${getUserPath(userId, PATHS.income)}/${incomeId}`);
  await update(incomeRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const deleteIncome = async (userId: string, incomeId: string) => {
  const incomeRef = ref(realtimeDb, `${getUserPath(userId, PATHS.income)}/${incomeId}`);
  await remove(incomeRef);
};

export const subscribeToIncomes = (userId: string, callback: (incomes: IncomeSource[]) => void) => {
  const incomesRef = ref(realtimeDb, getUserPath(userId, PATHS.income));
  
  const unsubscribe = onValue(incomesRef, (snapshot) => {
    const incomes: IncomeSource[] = [];
    snapshot.forEach((child) => {
      incomes.push(child.val());
    });
    callback(incomes);
  });
  
  return () => off(incomesRef, 'value', unsubscribe);
};

// ==================== EXPENSE OPERATIONS ====================

export const saveExpense = async (userId: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const expenseRef = push(ref(realtimeDb, getUserPath(userId, PATHS.expenses)));
  const expenseData: Expense = {
    ...expense,
    id: expenseRef.key!,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await set(expenseRef, expenseData);
  return expenseData;
};

export const getExpenses = async (userId: string): Promise<Expense[]> => {
  const expensesRef = ref(realtimeDb, getUserPath(userId, PATHS.expenses));
  const snapshot = await get(expensesRef);
  
  if (!snapshot.exists()) return [];
  
  const expenses: Expense[] = [];
  snapshot.forEach((child) => {
    expenses.push(child.val());
  });
  
  return expenses.sort((a, b) => b.createdAt - a.createdAt);
};

export const updateExpense = async (userId: string, expenseId: string, updates: Partial<Expense>) => {
  const expenseRef = ref(realtimeDb, `${getUserPath(userId, PATHS.expenses)}/${expenseId}`);
  await update(expenseRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  const expenseRef = ref(realtimeDb, `${getUserPath(userId, PATHS.expenses)}/${expenseId}`);
  await remove(expenseRef);
};

export const subscribeToExpenses = (userId: string, callback: (expenses: Expense[]) => void) => {
  const expensesRef = ref(realtimeDb, getUserPath(userId, PATHS.expenses));
  
  const unsubscribe = onValue(expensesRef, (snapshot) => {
    const expenses: Expense[] = [];
    snapshot.forEach((child) => {
      expenses.push(child.val());
    });
    callback(expenses.sort((a, b) => b.createdAt - a.createdAt));
  });
  
  return () => off(expensesRef, 'value', unsubscribe);
};

// ==================== INVESTMENT OPERATIONS ====================

export const saveInvestment = async (userId: string, investment: Omit<Investment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const investmentRef = push(ref(realtimeDb, getUserPath(userId, PATHS.investments)));
  const investmentData: Investment = {
    ...investment,
    id: investmentRef.key!,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await set(investmentRef, investmentData);
  return investmentData;
};

export const getInvestments = async (userId: string): Promise<Investment[]> => {
  const investmentsRef = ref(realtimeDb, getUserPath(userId, PATHS.investments));
  const snapshot = await get(investmentsRef);
  
  if (!snapshot.exists()) return [];
  
  const investments: Investment[] = [];
  snapshot.forEach((child) => {
    investments.push(child.val());
  });
  
  return investments;
};

export const updateInvestment = async (userId: string, investmentId: string, updates: Partial<Investment>) => {
  const investmentRef = ref(realtimeDb, `${getUserPath(userId, PATHS.investments)}/${investmentId}`);
  await update(investmentRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const deleteInvestment = async (userId: string, investmentId: string) => {
  const investmentRef = ref(realtimeDb, `${getUserPath(userId, PATHS.investments)}/${investmentId}`);
  await remove(investmentRef);
};

export const subscribeToInvestments = (userId: string, callback: (investments: Investment[]) => void) => {
  const investmentsRef = ref(realtimeDb, getUserPath(userId, PATHS.investments));
  
  const unsubscribe = onValue(investmentsRef, (snapshot) => {
    const investments: Investment[] = [];
    snapshot.forEach((child) => {
      investments.push(child.val());
    });
    callback(investments);
  });
  
  return () => off(investmentsRef, 'value', unsubscribe);
};

// ==================== GOAL OPERATIONS ====================

export const saveGoal = async (userId: string, goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const goalRef = push(ref(realtimeDb, getUserPath(userId, PATHS.goals)));
  const goalData: Goal = {
    ...goal,
    id: goalRef.key!,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await set(goalRef, goalData);
  return goalData;
};

export const getGoals = async (userId: string): Promise<Goal[]> => {
  const goalsRef = ref(realtimeDb, getUserPath(userId, PATHS.goals));
  const snapshot = await get(goalsRef);
  
  if (!snapshot.exists()) return [];
  
  const goals: Goal[] = [];
  snapshot.forEach((child) => {
    goals.push(child.val());
  });
  
  return goals;
};

export const updateGoal = async (userId: string, goalId: string, updates: Partial<Goal>) => {
  const goalRef = ref(realtimeDb, `${getUserPath(userId, PATHS.goals)}/${goalId}`);
  await update(goalRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const goalRef = ref(realtimeDb, `${getUserPath(userId, PATHS.goals)}/${goalId}`);
  await remove(goalRef);
};

export const subscribeToGoals = (userId: string, callback: (goals: Goal[]) => void) => {
  const goalsRef = ref(realtimeDb, getUserPath(userId, PATHS.goals));
  
  const unsubscribe = onValue(goalsRef, (snapshot) => {
    const goals: Goal[] = [];
    snapshot.forEach((child) => {
      goals.push(child.val());
    });
    callback(goals);
  });
  
  return () => off(goalsRef, 'value', unsubscribe);
};

// ==================== USER PROFILE OPERATIONS ====================

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  updatedAt: number;
  preferences?: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export const saveUserProfile = async (userId: string, profile: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>) => {
  const profileRef = ref(realtimeDb, `${PATHS.userProfile}/${userId}`);
  const profileData: UserProfile = {
    ...profile,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await set(profileRef, profileData);
  return profileData;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const profileRef = ref(realtimeDb, `${PATHS.userProfile}/${userId}`);
  const snapshot = await get(profileRef);
  
  if (!snapshot.exists()) return null;
  
  return snapshot.val();
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const profileRef = ref(realtimeDb, `${PATHS.userProfile}/${userId}`);
  await update(profileRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

// ==================== UTILITY FUNCTIONS ====================

export const clearUserData = async (userId: string) => {
  const userRef = ref(realtimeDb, `${PATHS.users}/${userId}`);
  await remove(userRef);
};

export const exportUserData = async (userId: string) => {
  const [incomes, expenses, investments, goals, profile] = await Promise.all([
    getIncomes(userId),
    getExpenses(userId),
    getInvestments(userId),
    getGoals(userId),
    getUserProfile(userId)
  ]);
  
  return {
    incomes,
    expenses,
    investments,
    goals,
    profile,
    exportedAt: new Date().toISOString()
  };
};
