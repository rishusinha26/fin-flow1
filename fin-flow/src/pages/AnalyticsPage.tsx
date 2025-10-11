import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, PieChart, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useIncome } from '@/contexts/IncomeContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export function AnalyticsPage() {
  const { totalMonthlyIncome } = useIncome();
  const { expenses, totalExpenses, expensesByCategory } = useExpenses();
  const [timeRange, setTimeRange] = useState('30');

  // Calculate trends
  const monthlySavings = totalMonthlyIncome - totalExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (monthlySavings / totalMonthlyIncome) * 100 : 0;

  // Spending by category data
  const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Monthly trend data (simulated - in real app, would come from historical data)
  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      income: totalMonthlyIncome * (0.9 + Math.random() * 0.2),
      expenses: totalExpenses * (0.8 + Math.random() * 0.4),
      savings: monthlySavings * (0.7 + Math.random() * 0.6),
    }));
  }, [totalMonthlyIncome, totalExpenses, monthlySavings]);

  // Daily spending trend (last 30 days)
  const dailySpendingData = useMemo(() => {
    const days = parseInt(timeRange);
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        amount: Math.random() * 2000 + 500,
      };
    });
  }, [timeRange]);

  // Category comparison
  const categoryComparison = useMemo(() => {
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      current: amount,
      average: amount * (0.8 + Math.random() * 0.4),
    }));
  }, [expensesByCategory]);

  // Cash flow forecast (next 6 months)
  const cashFlowForecast = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let balance = monthlySavings * 3; // Starting balance
    return months.map((month) => {
      balance += monthlySavings * (0.9 + Math.random() * 0.2);
      return {
        month,
        balance: Math.max(0, balance),
        projected: balance * 1.1,
      };
    });
  }, [monthlySavings]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-white/90 mt-1">
              Deep insights into your financial patterns and trends
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Savings Rate</p>
                <h3 className="text-3xl font-bold text-green-900">{savingsRate.toFixed(1)}%</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div>
              <p className="text-sm text-blue-600 font-medium">Avg Daily Spending</p>
              <h3 className="text-3xl font-bold text-blue-900">₹{(totalExpenses / 30).toFixed(0)}</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Categories</p>
              <h3 className="text-3xl font-bold text-purple-900">{Object.keys(expensesByCategory).length}</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div>
              <p className="text-sm text-orange-600 font-medium">Transactions</p>
              <h3 className="text-3xl font-bold text-orange-900">{expenses.length}</h3>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <Tabs defaultValue="trends">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Income vs Expenses Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Daily Spending Pattern</h3>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySpendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Spending by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
                  <div className="space-y-3">
                    {categoryData.map((cat, index) => (
                      <div key={cat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <span className="font-bold text-indigo-600">₹{cat.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">6-Month Cash Flow Forecast</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashFlowForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="projected" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Projected Savings (6mo)</p>
                  <p className="text-2xl font-bold text-blue-900">₹{(monthlySavings * 6).toLocaleString()}</p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                  <p className="text-sm text-green-600 font-medium">Best Case Scenario</p>
                  <p className="text-2xl font-bold text-green-900">₹{(monthlySavings * 6 * 1.2).toLocaleString()}</p>
                </Card>
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">Conservative Estimate</p>
                  <p className="text-2xl font-bold text-orange-900">₹{(monthlySavings * 6 * 0.8).toLocaleString()}</p>
                </Card>
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Current vs Average Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#6366f1" name="Current Month" />
                    <Bar dataKey="average" fill="#8b5cf6" name="3-Month Average" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryComparison.map((cat) => {
                  const diff = cat.current - cat.average;
                  const percentDiff = (diff / cat.average) * 100;
                  const isHigher = diff > 0;

                  return (
                    <Card key={cat.category} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{cat.category}</p>
                          <p className="text-sm text-gray-600">
                            Current: ₹{cat.current.toLocaleString()} | Avg: ₹{cat.average.toLocaleString()}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 ${isHigher ? 'text-red-600' : 'text-green-600'}`}>
                          {isHigher ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-bold">{Math.abs(percentDiff).toFixed(0)}%</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
