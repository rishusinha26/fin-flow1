import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Calendar, DollarSign, TrendingUp, Bell, Trash2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const subscriptionCategories = [
  'Entertainment', 'Software', 'Fitness', 'Education', 'Music', 'Cloud Storage', 
  'News', 'Gaming', 'Productivity', 'Other'
];

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export function SubscriptionsPage() {
  const { subscriptions, addSubscription, deleteSubscription, totalMonthlySubscriptions, totalYearlySubscriptions, upcomingRenewals } = useSubscriptions();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as const,
    category: 'Entertainment',
    nextBillingDate: '',
    autoRenew: true,
    reminderDays: 3,
  });

  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount || !newSubscription.nextBillingDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addSubscription({
      ...newSubscription,
      amount: parseFloat(newSubscription.amount),
    });

    setNewSubscription({
      name: '',
      amount: '',
      frequency: 'monthly',
      category: 'Entertainment',
      nextBillingDate: '',
      autoRenew: true,
      reminderDays: 3,
    });
    setShowAddDialog(false);

    toast({
      title: 'Subscription Added',
      description: `${newSubscription.name} has been added to your subscriptions`
    });
  };

  const getDaysUntilRenewal = (date: string) => {
    const nextDate = new Date(date);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Subscription Tracker</h1>
              <p className="text-white/90 mt-1">
                Manage and optimize your recurring expenses
              </p>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Subscription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Subscription Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Netflix"
                    value={newSubscription.name}
                    onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 199"
                    value={newSubscription.amount}
                    onChange={(e) => setNewSubscription({ ...newSubscription, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Billing Frequency *</Label>
                  <Select
                    value={newSubscription.frequency}
                    onValueChange={(value: any) => setNewSubscription({ ...newSubscription, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newSubscription.category}
                    onValueChange={(value) => setNewSubscription({ ...newSubscription, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nextBillingDate">Next Billing Date *</Label>
                  <Input
                    id="nextBillingDate"
                    type="date"
                    value={newSubscription.nextBillingDate}
                    onChange={(e) => setNewSubscription({ ...newSubscription, nextBillingDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="reminderDays">Reminder (days before)</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    value={newSubscription.reminderDays}
                    onChange={(e) => setNewSubscription({ ...newSubscription, reminderDays: parseInt(e.target.value) })}
                  />
                </div>
                <Button onClick={handleAddSubscription} className="w-full">
                  Add Subscription
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                <p className="text-sm text-blue-600 font-medium">Monthly Cost</p>
                <h3 className="text-3xl font-bold text-blue-900">₹{totalMonthlySubscriptions.toFixed(0)}</h3>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Yearly Cost</p>
                <h3 className="text-3xl font-bold text-purple-900">₹{totalYearlySubscriptions.toFixed(0)}</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Active Subscriptions</p>
                <h3 className="text-3xl font-bold text-orange-900">{subscriptions.length}</h3>
              </div>
              <CreditCard className="w-10 h-10 text-orange-600" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Renewals */}
      {upcomingRenewals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-orange-900">Upcoming Renewals</h2>
            </div>
            <div className="space-y-2">
              {upcomingRenewals.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-semibold">{sub.name}</p>
                    <p className="text-sm text-gray-600">₹{sub.amount} - {getDaysUntilRenewal(sub.nextBillingDate)} days</p>
                  </div>
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Subscriptions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">All Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Subscriptions Yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your recurring expenses</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Subscription
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{sub.name}</h3>
                      <p className="text-sm text-gray-600">{sub.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSubscription(sub.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">₹{sub.amount}</span>
                      <span className="text-sm text-gray-600 capitalize">{sub.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Next: {new Date(sub.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full ${
                        getDaysUntilRenewal(sub.nextBillingDate) <= 3 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {getDaysUntilRenewal(sub.nextBillingDate)} days left
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
