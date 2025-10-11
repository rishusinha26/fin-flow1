
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useExpenses } from '@/contexts/ExpenseContext';

const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];

interface ExpenseTrackerProps {
  onAddExpense?: (amount: number, category: string, description: string) => void;
}

const ExpenseTracker = ({ onAddExpense }: ExpenseTrackerProps) => {
  const { expenses, addExpense, deleteExpense, totalExpenses } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleAddExpense = () => {
    if (!amount || !category || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to add an expense.",
        variant: "destructive"
      });
      return;
    }

    const newAmount = parseFloat(amount);
    const newExpense = {
      amount: newAmount,
      category,
      description,
      date: new Date().toISOString().split('T')[0]
    };

    addExpense(newExpense);
    
    if (onAddExpense) {
      onAddExpense(newAmount, category, description);
    }
    
    setAmount('');
    setCategory('');
    setDescription('');
    
    toast({
      title: "Expense Added!",
      description: `₹${amount} expense for ${category} has been recorded.`
    });
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed from your records."
    });
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📊 Expense Tracker
      </h2>

      {/* Add Expense Form */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white"
          />
          <Button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold text-gray-700">
          Total Expenses This Month: <span className="text-green-600">₹{totalExpenses.toFixed(2)}</span>
        </p>
      </div>

      {/* Expenses List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {expenses.map(expense => (
          <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {expense.category}
                </span>
                <span className="font-semibold text-gray-800">₹{expense.amount.toFixed(2)}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{expense.description}</p>
              <p className="text-gray-500 text-xs">{expense.date}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteExpense(expense.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ExpenseTracker;
