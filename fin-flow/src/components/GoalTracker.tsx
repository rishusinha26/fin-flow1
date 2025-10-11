
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2400,
      deadline: '2024-12-31',
      category: 'Safety'
    },
    {
      id: '2',
      title: 'Vacation to Europe',
      targetAmount: 3000,
      currentAmount: 850,
      deadline: '2025-06-01',
      category: 'Travel'
    },
    {
      id: '3',
      title: 'New Laptop',
      targetAmount: 1200,
      currentAmount: 400,
      deadline: '2024-08-15',
      category: 'Technology'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: ''
  });
  const { toast } = useToast();

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category || 'General'
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', targetAmount: '', deadline: '', category: '' });
    setShowAddForm(false);
    
    toast({
      title: "Goal Added!",
      description: `Your goal "${newGoal.title}" has been created.`
    });
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ));
    
    toast({
      title: "Progress Updated!",
      description: `Added $${amount} to your goal.`
    });
  };

  const getGoalStatus = (goal: Goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) return { status: "Completed", color: "text-green-600", bgColor: "bg-green-50" };
    if (daysLeft < 0) return { status: "Overdue", color: "text-red-600", bgColor: "bg-red-50" };
    if (daysLeft < 30) return { status: "Urgent", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { status: "On Track", color: "text-blue-600", bgColor: "bg-blue-50" };
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🎯 Financial Goals
        </h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Create New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Target amount ($)"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
            />
            <Input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
            />
            <Input
              placeholder="Category (optional)"
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={addGoal} size="sm">Add Goal</Button>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const status = getGoalStatus(goal);
          const remaining = goal.targetAmount - goal.currentAmount;
          
          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.category} • Due: {goal.deadline}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
                  {status.status}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress: ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                
                <Progress value={Math.min(progress, 100)} className="h-3" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    ${remaining.toFixed(2)} remaining
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, 50)}
                    >
                      +$50
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, 100)}
                    >
                      +$100
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GoalTracker;
