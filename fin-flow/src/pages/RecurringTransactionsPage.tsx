import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Plus, Play, Pause, Trash2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRecurringTransactions } from '@/contexts/RecurringTransactionContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Salary', 'Freelance', 'Other'];

export function RecurringTransactionsPage() {
  const { recurringTransactions, addRecurringTransaction, toggleActive, executeTransaction, deleteRecurringTransaction, upcomingTransactions } = useRecurringTransactions();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    name: '',
    amount: '',
    category: 'Bills',
    frequency: 'monthly' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    autoExecute: true,
  });

  const handleAdd = () => {
    if (!newTransaction.name || !newTransaction.amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addRecurringTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      endDate: newTransaction.endDate || undefined,
    });

    setNewTransaction({
      type: 'expense',
      name: '',
      amount: '',
      category: 'Bills',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
      autoExecute: true,
    });
    setShowAddDialog(false);

    toast({
      title: 'Recurring Transaction Added',
      description: `${newTransaction.name} will be automatically tracked`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Repeat className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Recurring Transactions</h1>
              <p className="text-white/90 mt-1">Automate your regular income and expenses</p>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Add Recurring
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Recurring Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select value={newTransaction.type} onValueChange={(value: any) => setNewTransaction({ ...newTransaction, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Name *</Label>
                  <Input
                    placeholder="e.g., Netflix Subscription"
                    value={newTransaction.name}
                    onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Amount (₹) *</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 199"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select value={newTransaction.frequency} onValueChange={(value: any) => setNewTransaction({ ...newTransaction, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newTransaction.startDate}
                    onChange={(e) => setNewTransaction({ ...newTransaction, startDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-execute</Label>
                  <Switch
                    checked={newTransaction.autoExecute}
                    onCheckedChange={(checked) => setNewTransaction({ ...newTransaction, autoExecute: checked })}
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">Add Recurring Transaction</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <p className="text-sm text-green-600 font-medium">Active Recurring</p>
          <h3 className="text-3xl font-bold text-green-900">{recurringTransactions.filter(t => t.isActive).length}</h3>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Recurring</p>
          <h3 className="text-3xl font-bold text-blue-900">{recurringTransactions.length}</h3>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Upcoming (7 days)</p>
          <h3 className="text-3xl font-bold text-purple-900">{upcomingTransactions.length}</h3>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Recurring Transactions</h2>
        {recurringTransactions.length === 0 ? (
          <Card className="p-12 text-center">
            <Repeat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recurring Transactions</h3>
            <p className="text-gray-500 mb-4">Add your first recurring transaction to automate tracking</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Recurring Transaction
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{transaction.name}</h3>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(transaction.id)}
                    >
                      {transaction.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecurringTransaction(transaction.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold text-indigo-600">₹{transaction.amount}</span>
                    <span className="text-sm text-gray-600 capitalize">{transaction.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Next: {new Date(transaction.nextOccurrence).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${transaction.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {transaction.isActive ? 'Active' : 'Paused'}
                    </span>
                    {transaction.autoExecute && (
                      <span className="text-xs text-blue-600">Auto-execute</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      executeTransaction(transaction.id);
                      toast({
                        title: 'Transaction Executed',
                        description: `${transaction.name} has been added to your ${transaction.type}s`,
                      });
                    }}
                  >
                    Execute Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
