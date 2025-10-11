import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, TrendingDown, Calendar, DollarSign, AlertCircle, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebt } from '@/contexts/DebtContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const debtTypes = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'home_loan', label: 'Home Loan' },
  { value: 'car_loan', label: 'Car Loan' },
  { value: 'student_loan', label: 'Student Loan' },
  { value: 'other', label: 'Other' },
];

export function DebtManagementPage() {
  const { debts, addDebt, deleteDebt, addPayment, totalDebt, totalMonthlyPayment, debtFreeDate, calculatePayoffPlan } = useDebt();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [payoffStrategy, setPayoffStrategy] = useState<'snowball' | 'avalanche'>('avalanche');
  
  const [newDebt, setNewDebt] = useState({
    name: '',
    type: 'credit_card' as const,
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    payoffStrategy: 'avalanche' as const,
  });

  const [newPayment, setNewPayment] = useState({
    amount: '',
    principal: '',
    interest: '',
  });

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.totalAmount || !newDebt.remainingAmount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addDebt({
      ...newDebt,
      totalAmount: parseFloat(newDebt.totalAmount),
      remainingAmount: parseFloat(newDebt.remainingAmount),
      interestRate: parseFloat(newDebt.interestRate),
      minimumPayment: parseFloat(newDebt.minimumPayment),
    });

    setNewDebt({
      name: '',
      type: 'credit_card',
      totalAmount: '',
      remainingAmount: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: '',
      payoffStrategy: 'avalanche',
    });
    setShowAddDialog(false);

    toast({
      title: 'Debt Added',
      description: `${newDebt.name} has been added to your debt tracker`
    });
  };

  const handleAddPayment = () => {
    if (!selectedDebt || !newPayment.amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in payment amount',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(newPayment.amount);
    const principal = newPayment.principal ? parseFloat(newPayment.principal) : amount * 0.8;
    const interest = newPayment.interest ? parseFloat(newPayment.interest) : amount * 0.2;

    addPayment(selectedDebt, {
      amount,
      principal,
      interest,
      date: new Date().toISOString(),
    });

    setNewPayment({ amount: '', principal: '', interest: '' });
    setShowPaymentDialog(false);
    setSelectedDebt(null);

    toast({
      title: 'Payment Recorded',
      description: `Payment of ₹${amount} has been recorded`
    });
  };

  const sortedDebts = calculatePayoffPlan(payoffStrategy);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Debt Management</h1>
              <p className="text-white/90 mt-1">
                Track and eliminate your debts strategically
              </p>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white text-red-600 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Debt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Debt Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., HDFC Credit Card"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Debt Type *</Label>
                  <Select
                    value={newDebt.type}
                    onValueChange={(value: any) => setNewDebt({ ...newDebt, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {debtTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="totalAmount">Original Amount (₹) *</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="e.g., 100000"
                    value={newDebt.totalAmount}
                    onChange={(e) => setNewDebt({ ...newDebt, totalAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="remainingAmount">Remaining Amount (₹) *</Label>
                  <Input
                    id="remainingAmount"
                    type="number"
                    placeholder="e.g., 75000"
                    value={newDebt.remainingAmount}
                    onChange={(e) => setNewDebt({ ...newDebt, remainingAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 18.5"
                    value={newDebt.interestRate}
                    onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumPayment">Minimum Payment (₹) *</Label>
                  <Input
                    id="minimumPayment"
                    type="number"
                    placeholder="e.g., 5000"
                    value={newDebt.minimumPayment}
                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Next Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddDebt} className="w-full">
                  Add Debt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Debt</p>
                <h3 className="text-3xl font-bold text-red-900">₹{totalDebt.toLocaleString()}</h3>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
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
                <p className="text-sm text-orange-600 font-medium">Monthly Payment</p>
                <h3 className="text-3xl font-bold text-orange-900">₹{totalMonthlyPayment.toLocaleString()}</h3>
              </div>
              <DollarSign className="w-10 h-10 text-orange-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Debts</p>
                <h3 className="text-3xl font-bold text-blue-900">{debts.length}</h3>
              </div>
              <CreditCard className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Debt-Free Date</p>
                <h3 className="text-lg font-bold text-green-900">
                  {debtFreeDate ? debtFreeDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                </h3>
              </div>
              <Target className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Payoff Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Payoff Strategy</h2>
          <Tabs value={payoffStrategy} onValueChange={(v: any) => setPayoffStrategy(v)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="avalanche">Avalanche (High Interest First)</TabsTrigger>
              <TabsTrigger value="snowball">Snowball (Low Balance First)</TabsTrigger>
            </TabsList>
            <TabsContent value="avalanche" className="mt-4">
              <p className="text-sm text-gray-600">
                Pay off debts with the highest interest rates first to minimize total interest paid.
              </p>
            </TabsContent>
            <TabsContent value="snowball" className="mt-4">
              <p className="text-sm text-gray-600">
                Pay off debts with the smallest balances first for quick wins and motivation.
              </p>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Debts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">Your Debts</h2>
        {debts.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Debts Tracked</h3>
            <p className="text-gray-500 mb-4">Start tracking your debts to create a payoff plan</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Debt
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedDebts.map((debt, index) => {
              const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{debt.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{debt.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Priority #{index + 1}</p>
                        <p className="text-sm font-semibold text-red-600">{debt.interestRate}% APR</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">₹{(debt.totalAmount - debt.remainingAmount).toLocaleString()} paid</span>
                        <span className="text-gray-600">₹{debt.remainingAmount.toLocaleString()} remaining</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Min. Payment: ₹{debt.minimumPayment.toLocaleString()}</span>
                        </div>
                        <Dialog open={showPaymentDialog && selectedDebt === debt.id} onOpenChange={(open) => {
                          setShowPaymentDialog(open);
                          if (!open) setSelectedDebt(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedDebt(debt.id)}>
                              Record Payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Record Payment for {debt.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="paymentAmount">Payment Amount (₹) *</Label>
                                <Input
                                  id="paymentAmount"
                                  type="number"
                                  placeholder="e.g., 5000"
                                  value={newPayment.amount}
                                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="principal">Principal (₹)</Label>
                                <Input
                                  id="principal"
                                  type="number"
                                  placeholder="Auto-calculated if empty"
                                  value={newPayment.principal}
                                  onChange={(e) => setNewPayment({ ...newPayment, principal: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="interest">Interest (₹)</Label>
                                <Input
                                  id="interest"
                                  type="number"
                                  placeholder="Auto-calculated if empty"
                                  value={newPayment.interest}
                                  onChange={(e) => setNewPayment({ ...newPayment, interest: e.target.value })}
                                />
                              </div>
                              <Button onClick={handleAddPayment} className="w-full">
                                Record Payment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {debt.payments.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold mb-2">Recent Payments</p>
                        <div className="space-y-1">
                          {debt.payments.slice(-3).reverse().map(payment => (
                            <div key={payment.id} className="flex justify-between text-sm text-gray-600">
                              <span>{new Date(payment.date).toLocaleDateString()}</span>
                              <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
