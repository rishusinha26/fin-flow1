// Finance Service for Income and Expense Management
// Connects to backend API for enhanced functionality

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export interface IncomeRecord {
  id: string;
  source: string;
  amount: number;
  category: string;
  date: string;
  isRecurring: boolean;
  frequency: string;
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isRecurring: boolean;
  frequency: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: string;
  netWorth: number;
}

export interface SpendingInsights {
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: string;
  }>;
  totalExpenses: number;
  insights: string[];
  expenseCount: number;
}

class FinanceService {
  private userId: string;

  constructor() {
    // Get user ID from localStorage or use default
    this.userId = localStorage.getItem('userId') || 'default-user';
  }

  setUserId(userId: string) {
    this.userId = userId;
    localStorage.setItem('userId', userId);
  }

  // ==================== INCOME METHODS ====================

  async getIncome(): Promise<{
    income: IncomeRecord[];
    recurringIncome: IncomeRecord[];
    totalIncome: number;
    recurringTotal: number;
    monthlyProjected: number;
  }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/income/${this.userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data;
      }
      throw new Error(data.error || 'Failed to fetch income');
    } catch (error) {
      console.error('Error fetching income:', error);
      // Return empty data if backend is unavailable
      return {
        income: [],
        recurringIncome: [],
        totalIncome: 0,
        recurringTotal: 0,
        monthlyProjected: 0
      };
    }
  }

  async addIncome(incomeData: {
    source: string;
    amount: number;
    category?: string;
    date?: string;
    isRecurring?: boolean;
    frequency?: string;
  }): Promise<{ success: boolean; income?: IncomeRecord; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/income/${this.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding income:', error);
      return { success: false, error: 'Failed to add income' };
    }
  }

  async deleteIncome(incomeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/income/${this.userId}/${incomeId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting income:', error);
      return { success: false, error: 'Failed to delete income' };
    }
  }

  // ==================== EXPENSE METHODS ====================

  async getExpenses(): Promise<{
    expenses: ExpenseRecord[];
    recurringExpenses: ExpenseRecord[];
    totalExpenses: number;
    recurringTotal: number;
    monthlyProjected: number;
    categoryBreakdown: Record<string, number>;
  }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/expenses/${this.userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data;
      }
      throw new Error(data.error || 'Failed to fetch expenses');
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return {
        expenses: [],
        recurringExpenses: [],
        totalExpenses: 0,
        recurringTotal: 0,
        monthlyProjected: 0,
        categoryBreakdown: {}
      };
    }
  }

  async addExpense(expenseData: {
    description: string;
    amount: number;
    category?: string;
    date?: string;
    isRecurring?: boolean;
    frequency?: string;
  }): Promise<{ success: boolean; expense?: ExpenseRecord; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/expenses/${this.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error: 'Failed to add expense' };
    }
  }

  async deleteExpense(expenseId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/expenses/${this.userId}/${expenseId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: 'Failed to delete expense' };
    }
  }

  // ==================== ANALYTICS METHODS ====================

  async getFinancialSummary(): Promise<FinancialSummary | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/${this.userId}/summary`);
      const data = await response.json();
      
      if (data.success) {
        return data.summary;
      }
      throw new Error(data.error || 'Failed to fetch summary');
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      return null;
    }
  }

  async getSpendingInsights(): Promise<SpendingInsights | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/${this.userId}/insights`);
      const data = await response.json();
      
      if (data.success) {
        return data.insights;
      }
      throw new Error(data.error || 'Failed to fetch insights');
    } catch (error) {
      console.error('Error fetching spending insights:', error);
      return null;
    }
  }
}

export const financeService = new FinanceService();
