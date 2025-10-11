
import React from 'react';
import ExpenseTracker from '../components/ExpenseTracker';
import BudgetMonitor from '../components/BudgetMonitor';
import InvestmentSuggestions from '../components/InvestmentSuggestions';
import FinancialTips from '../components/FinancialTips';
import SpendingCharts from '../components/SpendingCharts';
import GoalTracker from '../components/GoalTracker';
import FinancialChatbot from '../components/FinancialChatbot';
import ScanToPay from '../components/ScanToPay';
import FinancialTools from '../components/FinancialTools';
import AIInsights from '../components/AIInsights';
import { ExpenseProvider } from '../contexts/ExpenseContext';

const Index = () => {
  const handleAddExpenseFromScan = (amount: number, category: string, description: string) => {
    console.log('Expense added from scan:', { amount, category, description });
  };

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">💰 Personal Finance Assistant</h1>
            <p className="text-gray-600 mt-2">Take control of your finances with smart tracking and insights</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <ExpenseTracker onAddExpense={handleAddExpenseFromScan} />
              <SpendingCharts />
              <GoalTracker />
              <AIInsights />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <ScanToPay onAddExpense={handleAddExpenseFromScan} />
              <FinancialTools />
              <BudgetMonitor />
              <InvestmentSuggestions />
              <FinancialTips />
            </div>
          </div>
        </main>

        {/* Floating Chatbot */}
        <FinancialChatbot />
      </div>
    </ExpenseProvider>
  );
};

export default Index;
