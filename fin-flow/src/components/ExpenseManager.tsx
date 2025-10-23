import { useState, useEffect } from 'react';
import { financeService, ExpenseRecord } from '../services/financeService';
import { Plus, Trash2, TrendingDown, CreditCard, Calendar, RefreshCw, PieChart } from 'lucide-react';

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<ExpenseRecord[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyProjected, setMonthlyProjected] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    isRecurring: false,
    frequency: 'monthly'
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    const data = await financeService.getExpenses();
    setExpenses(data.expenses);
    setRecurringExpenses(data.recurringExpenses);
    setTotalExpenses(data.totalExpenses);
    setMonthlyProjected(data.monthlyProjected);
    setCategoryBreakdown(data.categoryBreakdown);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await financeService.addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      isRecurring: formData.isRecurring,
      frequency: formData.frequency
    });

    if (result.success) {
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        isRecurring: false,
        frequency: 'monthly'
      });
      setShowAddForm(false);
      loadExpenses();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const result = await financeService.deleteExpense(expenseId);
      if (result.success) {
        loadExpenses();
      }
    }
  };

  const categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Bills', 'Other'];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      Housing: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      Healthcare: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      Education: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      Shopping: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      Bills: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[category] || colors.Other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingDown className="text-red-600" />
            Expense Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <p className="text-3xl font-bold mt-1">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <CreditCard size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Monthly Projected</p>
              <p className="text-3xl font-bold mt-1">₹{monthlyProjected.toLocaleString()}</p>
            </div>
            <RefreshCw size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold mt-1">{expenses.length + recurringExpenses.length}</p>
            </div>
            <TrendingDown size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart size={20} className="text-purple-600" />
            Category Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div
                  key={category}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className={`inline-block px-2 py-1 text-xs rounded mb-2 ${getCategoryColor(category)}`}>
                    {category}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {((amount / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Grocery Shopping, Netflix"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="one-time">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
                Recurring Expense (e.g., subscriptions, rent)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recurring Expenses Section */}
      {recurringExpenses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw size={20} className="text-orange-600" />
            Recurring Expenses
          </h2>
          <div className="space-y-3">
            {recurringExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{expense.description}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {expense.frequency}
                    </span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-red-600">
                    ₹{expense.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-time Expenses Section */}
      {expenses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard size={20} className="text-red-600" />
            One-time Expenses
          </h2>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{expense.description}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-red-600">
                    ₹{expense.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {expenses.length === 0 && recurringExpenses.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <TrendingDown size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Expense Records Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your expenses to better manage your finances
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Add Your First Expense
          </button>
        </div>
      )}
    </div>
  );
}
