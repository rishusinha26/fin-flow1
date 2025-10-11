import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, TrendingUp, Calendar, DollarSign, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useRealtimeGoals } from '@/hooks/useRealtimeDatabase';
import { useToast } from '@/hooks/use-toast';

export function GoalsPage() {
  const { goals, loading, addGoal, modifyGoal, removeGoal, activeGoals, completedGoals } = useRealtimeGoals();
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await addGoal({
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline
      });

      setNewGoal({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
      setShowAddForm(false);

      toast({
        title: 'Goal Created',
        description: `Your goal "${newGoal.title}" has been added successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create goal',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, currentAmount: number, increment: number) => {
    try {
      await modifyGoal(goalId, { currentAmount: currentAmount + increment });
      toast({
        title: 'Progress Updated',
        description: `Added ₹${increment} to your goal`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Financial Goals</h1>
              <p className="text-white/90 mt-1">
                Track and achieve your financial milestones
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white text-red-600 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Goals</p>
                <h3 className="text-3xl font-bold text-blue-900">{goals.length}</h3>
              </div>
              <Target className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Active Goals</p>
                <h3 className="text-3xl font-bold text-orange-900">{activeGoals.length}</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <h3 className="text-3xl font-bold text-green-900">{completedGoals.length}</h3>
              </div>
              <Check className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="e.g., 100000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="e.g., 10000"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddGoal} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGoals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysRemaining = getDaysRemaining(goal.deadline);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{remaining.toLocaleString()} to go</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        daysRemaining < 30 ? 'bg-red-100 text-red-700' :
                        daysRemaining < 90 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {progress.toFixed(0)}%
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">₹{goal.currentAmount.toLocaleString()}</span>
                        <span className="text-gray-600">₹{goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateProgress(goal.id, goal.currentAmount, 1000)}
                        className="flex-1"
                      >
                        +₹1,000
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateProgress(goal.id, goal.currentAmount, 5000)}
                        className="flex-1"
                      >
                        +₹5,000
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateProgress(goal.id, goal.currentAmount, 10000)}
                        className="flex-1"
                      >
                        +₹10,000
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Completed Goals 🎉</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-green-900">{goal.title}</h3>
                  </div>
                  <p className="text-green-700">
                    Target: ₹{goal.targetAmount.toLocaleString()} - Achieved!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Completed on: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Goals Yet</h3>
          <p className="text-gray-500 mb-4">Start by creating your first financial goal</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </motion.div>
      )}
    </div>
  );
}
