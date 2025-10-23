import { useState, useEffect } from 'react';
import { financeService, FinancialSummary, SpendingInsights } from '../services/financeService';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';

export default function FinancialAnalytics() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [insights, setInsights] = useState<SpendingInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const [summaryData, insightsData] = await Promise.all([
      financeService.getFinancialSummary(),
      financeService.getSpendingInsights()
    ]);
    setSummary(summaryData);
    setInsights(insightsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Financial Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add income and expenses to see your financial analytics
          </p>
        </div>
      </div>
    );
  }

  const savingsRate = parseFloat(summary.savingsRate);
  const isSavingPositive = summary.monthlySavings > 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          Financial Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive overview of your financial health
        </p>
      </div>

      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm font-medium">Total Income</p>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">₹{summary.totalIncome.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-green-100 text-sm">
            <ArrowUpRight size={16} />
            <span>Monthly: ₹{summary.monthlyIncome.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100 text-sm font-medium">Total Expenses</p>
            <TrendingDown size={20} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">₹{summary.totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-red-100 text-sm">
            <ArrowDownRight size={16} />
            <span>Monthly: ₹{summary.monthlyExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Monthly Savings */}
        <div className={`bg-gradient-to-br ${isSavingPositive ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`${isSavingPositive ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>
              Monthly Savings
            </p>
            <DollarSign size={20} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">₹{summary.monthlySavings.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            {isSavingPositive ? (
              <>
                <ArrowUpRight size={16} />
                <span>Great job saving!</span>
              </>
            ) : (
              <>
                <ArrowDownRight size={16} />
                <span>Spending more than earning</span>
              </>
            )}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm font-medium">Savings Rate</p>
            <PieChart size={20} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">{savingsRate.toFixed(1)}%</p>
          <div className="mt-2 text-sm opacity-90">
            {savingsRate >= 20 ? '🎉 Excellent!' : savingsRate >= 10 ? '👍 Good' : '⚠️ Needs improvement'}
          </div>
        </div>
      </div>

      {/* Detailed Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            Monthly Breakdown
          </h2>
          <div className="space-y-4">
            {/* Income Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</span>
                <span className="text-sm font-bold text-green-600">₹{summary.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            {/* Expenses Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expenses</span>
                <span className="text-sm font-bold text-red-600">₹{summary.monthlyExpenses.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: summary.monthlyIncome > 0 
                      ? `${Math.min((summary.monthlyExpenses / summary.monthlyIncome) * 100, 100)}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>

            {/* Savings Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Savings</span>
                <span className={`text-sm font-bold ${isSavingPositive ? 'text-blue-600' : 'text-orange-600'}`}>
                  ₹{summary.monthlySavings.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`bg-gradient-to-r ${isSavingPositive ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} h-3 rounded-full transition-all duration-500`}
                  style={{ 
                    width: summary.monthlyIncome > 0 
                      ? `${Math.min(Math.abs((summary.monthlySavings / summary.monthlyIncome) * 100), 100)}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Net Worth */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="text-purple-600" size={20} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Worth</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                ₹{summary.netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart size={20} className="text-purple-600" />
            Top Spending Categories
          </h2>
          {insights && insights.topCategories.length > 0 ? (
            <div className="space-y-3">
              {insights.topCategories.map((category, index) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹{category.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No spending data available yet
            </p>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {insights && insights.insights.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-600" />
            Financial Insights
          </h2>
          <div className="space-y-3">
            {insights.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <span className="text-2xl">💡</span>
                <p className="text-gray-700 dark:text-gray-300 flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Health Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Financial Health Score
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Savings Rate ({savingsRate.toFixed(1)}%)
              </span>
              <span className="text-sm font-bold text-blue-600">
                {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Work'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  savingsRate >= 20 ? 'bg-green-500' : savingsRate >= 10 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(savingsRate * 2, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expense Ratio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.monthlyIncome > 0 
                  ? ((summary.monthlyExpenses / summary.monthlyIncome) * 100).toFixed(1) 
                  : 0}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {insights?.expenseCount || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Categories Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {insights?.topCategories.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsRate < 20 && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-gray-900 dark:text-white mb-2">💰 Increase Savings Rate</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aim for at least 20% savings rate. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.
              </p>
            </div>
          )}
          {summary.monthlyExpenses > summary.monthlyIncome && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800">
              <p className="font-medium text-gray-900 dark:text-white mb-2">⚠️ Reduce Expenses</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're spending more than you earn. Review your expenses and cut unnecessary costs.
              </p>
            </div>
          )}
          {insights && insights.topCategories.length > 0 && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="font-medium text-gray-900 dark:text-white mb-2">📊 Review Top Category</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your highest spending is on {insights.topCategories[0].category}. Consider if this aligns with your priorities.
              </p>
            </div>
          )}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800">
            <p className="font-medium text-gray-900 dark:text-white mb-2">🎯 Set Financial Goals</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create specific savings goals to stay motivated and track your progress effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
