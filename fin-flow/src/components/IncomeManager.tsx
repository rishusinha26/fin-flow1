import { useState, useEffect } from 'react';
import { financeService, IncomeRecord } from '../services/financeService';
import { Plus, Trash2, TrendingUp, DollarSign, Calendar, RefreshCw } from 'lucide-react';

export default function IncomeManager() {
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [recurringIncomes, setRecurringIncomes] = useState<IncomeRecord[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyProjected, setMonthlyProjected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    category: 'Employment',
    isRecurring: false,
    frequency: 'monthly'
  });

  useEffect(() => {
    loadIncome();
  }, []);

  const loadIncome = async () => {
    setLoading(true);
    const data = await financeService.getIncome();
    setIncomes(data.income);
    setRecurringIncomes(data.recurringIncome);
    setTotalIncome(data.totalIncome);
    setMonthlyProjected(data.monthlyProjected);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await financeService.addIncome({
      source: formData.source,
      amount: parseFloat(formData.amount),
      category: formData.category,
      isRecurring: formData.isRecurring,
      frequency: formData.frequency
    });

    if (result.success) {
      setFormData({
        source: '',
        amount: '',
        category: 'Employment',
        isRecurring: false,
        frequency: 'monthly'
      });
      setShowAddForm(false);
      loadIncome();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleDelete = async (incomeId: string) => {
    if (confirm('Are you sure you want to delete this income?')) {
      const result = await financeService.deleteIncome(incomeId);
      if (result.success) {
        loadIncome();
      }
    }
  };

  const categories = ['Employment', 'Freelancing', 'Business', 'Investment', 'Rental', 'Other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Income Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your income sources and earnings
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Income</p>
              <p className="text-3xl font-bold mt-1">₹{totalIncome.toLocaleString()}</p>
            </div>
            <DollarSign size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Monthly Projected</p>
              <p className="text-3xl font-bold mt-1">₹{monthlyProjected.toLocaleString()}</p>
            </div>
            <RefreshCw size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Income Sources</p>
              <p className="text-3xl font-bold mt-1">{incomes.length + recurringIncomes.length}</p>
            </div>
            <TrendingUp size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Add Income Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Income</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Income Source *
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., Monthly Salary, Freelance Project"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
                Recurring Income (e.g., monthly salary)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add Income
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

      {/* Recurring Income Section */}
      {recurringIncomes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw size={20} className="text-blue-600" />
            Recurring Income
          </h2>
          <div className="space-y-3">
            {recurringIncomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{income.source}</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      {income.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {income.frequency}
                    </span>
                    <span>{new Date(income.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-green-600">
                    ₹{income.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(income.id)}
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

      {/* One-time Income Section */}
      {incomes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            One-time Income
          </h2>
          <div className="space-y-3">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{income.source}</h3>
                    <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {income.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{new Date(income.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-green-600">
                    ₹{income.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(income.id)}
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
      {incomes.length === 0 && recurringIncomes.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Income Records Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your income by adding your first income source
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Add Your First Income
          </button>
        </div>
      )}
    </div>
  );
}
