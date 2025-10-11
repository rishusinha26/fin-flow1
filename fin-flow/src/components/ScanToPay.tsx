import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, ScanQrCode, Wallet, CreditCard, History, Banknote, Search, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useExpenses } from '@/contexts/ExpenseContext';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  date: string;
  type: 'debit' | 'credit';
  method: 'scan' | 'transfer' | 'card';
}

interface ScanToPayProps {
  onAddExpense: (amount: number, category: string, description: string) => void;
}

const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];

const ScanToPay = ({ onAddExpense }: ScanToPayProps) => {
  const { addExpense } = useExpenses();
  const [isScanning, setIsScanning] = useState(false);
  const [amount, setAmount] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false);
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [scanAmount, setScanAmount] = useState('');
  const [scanCategory, setScanCategory] = useState('');
  const [scanDescription, setScanDescription] = useState('');
  const [balance] = useState(2847.50);
  const [transactions] = useState<Transaction[]>([
    { id: '1', amount: 45.50, category: 'Food', merchant: 'Starbucks', date: '2024-05-24', type: 'debit', method: 'scan' },
    { id: '2', amount: 1200.00, category: 'Salary', merchant: 'Company Inc', date: '2024-05-23', type: 'credit', method: 'transfer' },
    { id: '3', amount: 25.00, category: 'Transportation', merchant: 'Metro Card', date: '2024-05-22', type: 'debit', method: 'card' },
    { id: '4', amount: 89.99, category: 'Shopping', merchant: 'Amazon', date: '2024-05-21', type: 'debit', method: 'scan' },
  ]);
  const { toast } = useToast();

  const handleScanPayment = () => {
    setShowScanDialog(true);
  };

  const processScanPayment = () => {
    if (!scanAmount) {
      toast({
        title: "Enter Amount",
        description: "Please enter an amount to proceed",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setShowScanDialog(false);
    
    setTimeout(() => {
      setIsScanning(false);
      const finalCategory = scanCategory || 'Other';
      const finalDescription = scanDescription || `Payment via QR scan`;
      
      // Add to shared context
      addExpense({
        amount: parseFloat(scanAmount),
        category: finalCategory,
        description: finalDescription,
        date: new Date().toISOString().split('T')[0]
      });
      
      onAddExpense(parseFloat(scanAmount), finalCategory, finalDescription);
      
      setScanAmount('');
      setScanCategory('');
      setScanDescription('');
      
      toast({
        title: "Payment Successful!",
        description: `₹${scanAmount} paid via QR scan`,
      });
    }, 2000);
  };

  const handleManualPayment = () => {
    if (!amount) {
      toast({
        title: "Enter Amount",
        description: "Please enter an amount to proceed",
        variant: "destructive"
      });
      return;
    }
    
    // Add to shared context
    addExpense({
      amount: parseFloat(amount),
      category: 'Other',
      description: 'Manual payment',
      date: new Date().toISOString().split('T')[0]
    });
    
    onAddExpense(parseFloat(amount), 'Other', 'Manual payment');
    setAmount('');
    toast({
      title: "Payment Successful!",
      description: `₹${amount} payment processed`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border-0 rounded-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">💳 Quick Pay</h2>
          <p className="text-blue-100">Scan, Pay & Track - All in one place</p>
        </div>

        {/* Balance Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <p className="text-sm text-blue-100">Available Balance</p>
          <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleScanPayment}
            disabled={isScanning}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-20 flex flex-col items-center justify-center space-y-2"
          >
            {isScanning ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <ScanQrCode className="w-8 h-8" />
            )}
            <span className="text-sm font-medium">
              {isScanning ? 'Scanning...' : 'Scan & Pay'}
            </span>
          </Button>

          <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-20 flex flex-col items-center justify-center space-y-2">
                <QrCode className="w-8 h-8" />
                <span className="text-sm font-medium">Show QR</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Your Payment QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-8">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                Show this QR code to receive payments
              </p>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scan Payment Dialog */}
        <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan & Pay Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={scanAmount}
                  onChange={(e) => setScanAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category (Optional)</label>
                <Select value={scanCategory} onValueChange={setScanCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category or leave empty for 'Other'" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                <Input
                  placeholder="Payment description"
                  value={scanDescription}
                  onChange={(e) => setScanDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={processScanPayment} className="w-full">
                Proceed to Scan & Pay
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white h-16 flex flex-col items-center justify-center space-y-1">
                <Wallet className="w-5 h-5" />
                <span className="text-xs">Check Balance</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Account Balance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">₹{balance.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Available Balance</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month Spent:</span>
                    <span className="text-red-600">₹1,247.30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Month Received:</span>
                    <span className="text-green-600">₹4,200.00</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white h-16 flex flex-col items-center justify-center space-y-1">
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">Add Money</span>
          </Button>

          <Dialog open={showTransactionsDialog} onOpenChange={setShowTransactionsDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white h-16 flex flex-col items-center justify-center space-y-1">
                <History className="w-5 h-5" />
                <span className="text-xs">History</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.method === 'scan' ? <ScanQrCode className="w-5 h-5" /> : 
                         transaction.method === 'card' ? <CreditCard className="w-5 h-5" /> : 
                         <ArrowRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.merchant}</p>
                        <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Manual Payment Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-center">Quick Payment</h3>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Button 
              onClick={handleManualPayment}
              className="bg-white text-blue-600 hover:bg-white/90 px-6"
            >
              Pay
            </Button>
          </div>
          <div className="flex justify-center space-x-4 pt-2">
            {[100, 500, 1000, 2000].map((preset) => (
              <Button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 h-8"
              >
                ₹{preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white h-12 flex items-center justify-center space-x-2">
            <Banknote className="w-4 h-4" />
            <span className="text-sm">Bank Transfer</span>
          </Button>
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white h-12 flex items-center justify-center space-x-2">
            <Search className="w-4 h-4" />
            <span className="text-sm">Find Nearby</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScanToPay;
