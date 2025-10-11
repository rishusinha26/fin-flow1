import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  DollarSign,
  Calendar,
  Briefcase,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncome } from '@/contexts/IncomeContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function IncomeManagementPage() {
  const { incomeSources, totalMonthlyIncome, totalYearlyIncome, addIncomeSource, updateIncomeSource, deleteIncomeSource, loading } = useIncome();
  const { toast } = useToast();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'yearly' | 'weekly'
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        await updateIncomeSource(editingId, {
          name: formData.name,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency
        });
        toast({
          title: 'Income Updated',
          description: `${formData.name} has been updated successfully`
        });
      } else {
        await addIncomeSource({
          name: formData.name,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency
        });
        toast({
          title: 'Income Added',
          description: `${formData.name} has been added successfully`
        });
      }
      
      setFormData({ name: '', amount: '', frequency: 'monthly' });
      setEditingId(null);
      setShowAddDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save income source',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (income: any) => {
    setFormData({
      name: income.name,
      amount: income.amount.toString(),
      frequency: income.frequency
    });
    setEditingId(income.id);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteIncomeSource(id);
      toast({
        title: 'Income Deleted',
        description: `${name} has been removed`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete income source',
        variant: 'destructive'
      });
    }
  };

  const getMonthlyAmount = (amount: number, frequency: string) => {
    if (frequency === 'weekly') return amount * 4;
    if (frequency === 'yearly') return amount / 12;
    return amount;
  };

  const incomeByFrequency = {
    monthly: incomeSources.filter(i => i.frequency === 'monthly').reduce((sum, i) => sum + i.amount, 0),
    yearly: incomeSources.filter(i => i.frequency === 'yearly').reduce((sum, i) => sum + i.amount, 0),
    weekly: incomeSources.filter(i => i.frequency === 'weekly').reduce((sum, i) => sum + i.amount, 0)
  };

  const averageDailyIncome = totalMonthlyIncome / 30;
  const averageHourlyIncome = totalMonthlyIncome / (30 * 8); // Assuming 8 hour workday

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Income Management</h1>
              <p className="text-white/90 mt-1">
                Track and manage all your income sources
              </p>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => {
                  setFormData({ name: '', amount: '', frequency: 'monthly' });
                  setEditingId(null);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Income Source' : 'Add New Income Source'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Income Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Salary, Freelance, Business"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingId ? 'Update Income' : 'Add Income'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Income Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-green-600 font-medium">Monthly Income</p>
            <h3 className="text-3xl font-bold text-green-900">₹{totalMonthlyIncome.toLocaleString()}</h3>
            <p className="text-xs text-green-600 mt-1">{incomeSources.length} sources</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-blue-600 font-medium">Yearly Income</p>
            <h3 className="text-3xl font-bold text-blue-900">₹{totalYearlyIncome.toLocaleString()}</h3>
            <p className="text-xs text-blue-600 mt-1">Projected annual</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-purple-600 font-medium">Daily Income</p>
            <h3 className="text-3xl font-bold text-purple-900">₹{averageDailyIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
            <p className="text-xs text-purple-600 mt-1">Average per day</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <PieChart className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-sm text-orange-600 font-medium">Hourly Rate</p>
            <h3 className="text-3xl font-bold text-orange-900">₹{averageHourlyIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
            <p className="text-xs text-orange-600 mt-1">Per working hour</p>
          </Card>
        </motion.div>
      </div>

      {/* Income Breakdown by Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Income Breakdown by Frequency</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium mb-1">Monthly Income</p>
              <p className="text-2xl font-bold text-blue-900">₹{incomeByFrequency.monthly.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">
                {incomeSources.filter(i => i.frequency === 'monthly').length} sources
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium mb-1">Weekly Income</p>
              <p className="text-2xl font-bold text-green-900">₹{incomeByFrequency.weekly.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">
                {incomeSources.filter(i => i.frequency === 'weekly').length} sources
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium mb-1">Yearly Income</p>
              <p className="text-2xl font-bold text-purple-900">₹{incomeByFrequency.yearly.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">
                {incomeSources.filter(i => i.frequency === 'yearly').length} sources
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Income Sources List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">All Income Sources</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading income sources...</p>
            </div>
          ) : incomeSources.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Income Sources Yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first income source</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Income Source
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {incomeSources.map((income, index) => {
                const monthlyAmount = getMonthlyAmount(income.amount, income.frequency);
                const percentage = (monthlyAmount / totalMonthlyIncome) * 100;
                
                return (
                  <motion.div
                    key={income.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{income.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{income.frequency}</p>
                          </div>
                        </div>
                        <div className="ml-13">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{income.amount.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/ {income.frequency}</span>
                          </div>
                          {income.frequency !== 'monthly' && (
                            <p className="text-sm text-green-600">
                              ≈ ₹{monthlyAmount.toLocaleString()} / month
                            </p>
                          )}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{percentage.toFixed(1)}% of total income</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(income)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(income.id, income.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Income Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <h2 className="text-xl font-bold mb-4 text-indigo-900">💡 Income Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Diversification</h3>
              <p className="text-sm text-gray-600">
                {incomeSources.length === 1 ? (
                  "Consider adding multiple income sources to reduce financial risk."
                ) : incomeSources.length < 3 ? (
                  `Good start! You have ${incomeSources.length} income sources. Consider adding more for better diversification.`
                ) : (
                  `Excellent! You have ${incomeSources.length} income sources, providing good financial diversification.`
                )}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Growth Potential</h3>
              <p className="text-sm text-gray-600">
                Your current monthly income is ₹{totalMonthlyIncome.toLocaleString()}. 
                With a 10% annual increase, you could earn ₹{(totalMonthlyIncome * 1.1).toLocaleString('en-IN', { maximumFractionDigits: 0 })} per month next year.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
