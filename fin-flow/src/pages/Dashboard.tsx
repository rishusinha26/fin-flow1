import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIncome } from '@/contexts/IncomeContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useGamification } from '@/contexts/GamificationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ExpenseTracker from '@/components/ExpenseTracker';
import { ImportCSV } from '@/components/ImportCSV';
import { Sparkles, TrendingUp, TrendingDown, Wallet, Target, ArrowRight, PieChart, Calendar, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom Rupee icon component
const RupeeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12"/>
    <path d="M6 8h12"/>
    <path d="M6 13l8.5 8"/>
    <path d="M15 13c-2.5 0-5-1.5-5-4"/>
  </svg>
);

export function Dashboard() {
  const { user } = useAuth();
  const { incomeSources, totalMonthlyIncome } = useIncome();
  const { totalExpenses, expenses } = useExpenses();
  const { level, streak, financialScore } = useGamification();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  
  // Calculate financial metrics
  const monthlySavings = totalMonthlyIncome - totalExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (monthlySavings / totalMonthlyIncome) * 100 : 0;
  const dailySpending = totalExpenses / 30;
  
  // Get this month's date info
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - currentDate.getDate();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-2"
              >
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl font-bold">
                  {getGreeting()}, {displayName}!
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90"
              >
                Welcome back to your financial dashboard
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-10 h-10" />
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/income')}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <Button variant="ghost" size="sm" className="text-green-600">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-green-600 font-medium">Monthly Income</p>
            <h3 className="text-3xl font-bold text-green-900">₹{totalMonthlyIncome.toLocaleString()}</h3>
            <p className="text-xs text-green-600 mt-1">{incomeSources.length} sources</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-red-600 font-medium">Monthly Expenses</p>
            <h3 className="text-3xl font-bold text-red-900">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-xs text-red-600 mt-1">{expenses.length} transactions</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`p-6 bg-gradient-to-br ${monthlySavings >= 0 ? 'from-blue-50 to-cyan-50 border-blue-200' : 'from-orange-50 to-red-50 border-orange-200'} hover:shadow-lg transition-shadow cursor-pointer`} onClick={() => navigate('/budget')}>
            <div className="flex items-center justify-between mb-2">
              <Wallet className={`w-8 h-8 ${monthlySavings >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              <Button variant="ghost" size="sm" className={monthlySavings >= 0 ? 'text-blue-600' : 'text-orange-600'}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className={`text-sm font-medium ${monthlySavings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Monthly Savings</p>
            <h3 className={`text-3xl font-bold ${monthlySavings >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              ₹{Math.abs(monthlySavings).toLocaleString()}
            </h3>
            <p className={`text-xs mt-1 ${monthlySavings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {savingsRate.toFixed(1)}% savings rate
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/goals')}>
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              <Button variant="ghost" size="sm" className="text-purple-600">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-purple-600 font-medium">Daily Spending</p>
            <h3 className="text-3xl font-bold text-purple-900">₹{dailySpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
            <p className="text-xs text-purple-600 mt-1">{daysRemaining} days left in {monthName}</p>
          </Card>
        </motion.div>
      </div>

      {/* Gamification Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Your Progress</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm">Level {level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">{streak.current} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Score: {financialScore}/100</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/achievements')}>
              View All
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/subscriptions')}>
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Subscriptions</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/debt')}>
              <Wallet className="w-5 h-5 text-red-600" />
              <span className="text-sm">Manage Debt</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/analytics')}>
              <PieChart className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/education')}>
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm">Learn</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Import CSV */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <ImportCSV />
      </motion.div>

      {/* Expense Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Expense Dashboard
          </h2>
          <ExpenseTracker />
        </Card>
      </motion.div>
    </div>
  );
}
