import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Plus, Brain } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MarketData } from './MarketData';

interface Investment {
  id: string;
  type: string;
  name: string;
  amount: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  startDate: string;
}

interface Transaction {
  id: string;
  investmentId: string;
  type: 'buy' | 'sell' | 'dividend' | 'interest' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
}

interface InvestmentTrackerProps {
  // Removed dialog props - now standalone component
}

const mockInvestments: Investment[] = [
  {
    id: '1',
    type: 'Stocks',
    name: 'Index Fund',
    amount: 5000,
    currentValue: 5600,
    returns: 600,
    returnsPercentage: 12,
    startDate: '2024-01-01'
  },
  {
    id: '2',
    type: 'Mutual Funds',
    name: 'Growth Fund',
    amount: 3000,
    currentValue: 3300,
    returns: 300,
    returnsPercentage: 10,
    startDate: '2024-02-15'
  },
  {
    id: '3',
    type: 'Real Estate',
    name: 'REIT Fund',
    amount: 2000,
    currentValue: 2100,
    returns: 100,
    returnsPercentage: 5,
    startDate: '2024-03-01'
  }
];

const portfolioData = [
  { name: 'Stocks', value: 5600 },
  { name: 'Mutual Funds', value: 3300 },
  { name: 'Real Estate', value: 2100 }
];

const performanceData = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 10500 },
  { month: 'Mar', value: 11000 },
  { month: 'Apr', value: 11200 },
  { month: 'May', value: 11800 }
];

export function InvestmentTracker({}: InvestmentTrackerProps) {
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('5');
  const [showFutureTips, setShowFutureTips] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingInvestment, setEditingInvestment] = useState<string | null>(null);
  const [newInvestment, setNewInvestment] = useState<Partial<Investment>>({
    type: '',
    name: '',
    amount: 0,
    currentValue: 0,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    investmentId: '',
    type: 'buy',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvestment;
  const totalReturnsPercentage = ((totalReturns / totalInvestment) * 100).toFixed(2);

  const portfolioData = investments.map(inv => ({
    name: inv.type,
    value: inv.currentValue
  }));

  // Generate dynamic performance data based on current portfolio
  const generatePerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseValue = totalInvestment;
    const currentValue = totalCurrentValue;
    const growthRate = (currentValue - baseValue) / baseValue;
    
    return months.map((month, index) => {
      const monthGrowth = (growthRate / 6) * (index + 1);
      return {
        month,
        value: Math.round(baseValue * (1 + monthGrowth))
      };
    });
  };

  const dynamicPerformanceData = generatePerformanceData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const riskProfiles = {
    conservative: {
      description: "Low-risk tolerance, focus on capital preservation",
      allocation: {
        equity: 20,
        debt: 50,
        gold: 20,
        cash: 10
      },
      recommendations: [
        "Large-cap mutual funds for equity exposure",
        "Government bonds and high-rated corporate bonds",
        "Gold ETFs for stability",
        "Keep emergency fund in high-yield savings"
      ]
    },
    moderate: {
      description: "Balanced approach to risk and returns",
      allocation: {
        equity: 50,
        debt: 30,
        gold: 10,
        cash: 10
      },
      recommendations: [
        "Mix of large and mid-cap funds",
        "Balance between government and corporate bonds",
        "Small allocation to international funds",
        "Consider REITs for diversification"
      ]
    },
    aggressive: {
      description: "High-risk tolerance, focus on growth",
      allocation: {
        equity: 70,
        debt: 15,
        gold: 5,
        cash: 10
      },
      recommendations: [
        "Mid and small-cap funds for higher growth",
        "Include sectoral and thematic funds",
        "Consider crypto allocation (1-5%)",
        "High-yield corporate bonds"
      ]
    }
  };

  const updateInvestment = (id: string, field: keyof Investment, value: any) => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === id) {
        const updated = { ...inv, [field]: value };
        // Recalculate returns when currentValue changes
        if (field === 'currentValue') {
          updated.returns = updated.currentValue - updated.amount;
          updated.returnsPercentage = ((updated.returns / updated.amount) * 100);
        }
        return updated;
      }
      return inv;
    }));
  };

  const addInvestment = () => {
    if (newInvestment.name && newInvestment.type && newInvestment.amount && newInvestment.currentValue) {
      const investment: Investment = {
        id: Date.now().toString(),
        type: newInvestment.type,
        name: newInvestment.name,
        amount: newInvestment.amount,
        currentValue: newInvestment.currentValue,
        returns: newInvestment.currentValue - newInvestment.amount,
        returnsPercentage: ((newInvestment.currentValue - newInvestment.amount) / newInvestment.amount) * 100,
        startDate: newInvestment.startDate || new Date().toISOString().split('T')[0]
      };
      setInvestments(prev => [...prev, investment]);
      setNewInvestment({
        type: '',
        name: '',
        amount: 0,
        currentValue: 0,
        startDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const addTransaction = () => {
    if (newTransaction.investmentId && newTransaction.amount && newTransaction.description) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        investmentId: newTransaction.investmentId,
        type: newTransaction.type || 'buy',
        amount: newTransaction.amount,
        date: newTransaction.date || new Date().toISOString().split('T')[0],
        description: newTransaction.description
      };
      setTransactions(prev => [...prev, transaction]);
      setNewTransaction({
        investmentId: '',
        type: 'buy',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setShowTransactionDialog(false);
    }
  };

  const getInvestmentName = (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId);
    return investment ? investment.name : 'Unknown Investment';
  };

  const getPersonalizedAdvice = () => {
    const amount = Number(investmentAmount);
    const profile = riskProfiles[riskProfile as keyof typeof riskProfiles];
    const years = Number(timeHorizon);
    
    const monthlyInvestment = Math.round(amount * 0.1 / 12); // 10% of total amount monthly
    const emergencyFund = Math.round(amount * 0.2); // 20% for emergency
    
    return {
      summary: `Based on your ${riskProfile} risk profile and ₹${amount.toLocaleString()} investment amount:`,
      emergency: `Maintain ₹${emergencyFund.toLocaleString()} as emergency fund`,
      monthly: `Consider SIP of ₹${monthlyInvestment.toLocaleString()} monthly`,
      allocation: profile.allocation,
      recommendations: profile.recommendations,
      timeBasedTips: years <= 3 ? [
        "Focus on debt and liquid funds",
        "Avoid long-duration funds",
        "Consider arbitrage funds for tax efficiency"
      ] : years <= 7 ? [
        "Start increasing equity exposure",
        "Look at balanced advantage funds",
        "Consider international diversification"
      ] : [
        "Maximum equity exposure as per risk profile",
        "Can look at small-cap funds",
        "Consider property investment"
      ]
    };
  };

  const advice = getPersonalizedAdvice();

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
                <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Current Value</h3>
                <p className="text-2xl font-bold">₹{totalCurrentValue.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
                <p className="text-2xl font-bold text-green-600">₹{totalReturns.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Returns %</h3>
                <p className="text-2xl font-bold text-green-600">+{totalReturnsPercentage}%</p>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Investment Distribution</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Dynamic Performance Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicPerformanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={() => setShowFutureTips(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                🔮 Get Future Investment Tips
              </Button>
            </div>

            {/* Quick Price Updates */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-lg font-semibold mb-4">Quick Price Updates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{investment.name}</span>
                      <span className="text-xs text-gray-500">{investment.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={investment.currentValue}
                        onChange={(e) => updateInvestment(investment.id, 'currentValue', Number(e.target.value))}
                        className="text-sm h-8"
                      />
                      <span className="text-xs text-gray-500">₹</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${investment.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {investment.returns >= 0 ? '+' : ''}{investment.returnsPercentage.toFixed(2)}%
                      </span>
                      <span className="text-xs text-gray-500">
                        ₹{investment.returns.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Investments</h3>
              <Button onClick={() => setNewInvestment({ type: '', name: '', amount: 0, currentValue: 0, startDate: new Date().toISOString().split('T')[0] })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Investment
              </Button>
            </div>

            {/* Add New Investment Form */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="font-semibold mb-3">Add New Investment</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Select value={newInvestment.type} onValueChange={(value) => setNewInvestment(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stocks">Stocks</SelectItem>
                    <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Bonds">Bonds</SelectItem>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Investment Name"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Amount (₹)"
                  value={newInvestment.amount || ''}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, amount: Number(e.target.value) }))}
                />
                <Input
                  type="number"
                  placeholder="Current Value (₹)"
                  value={newInvestment.currentValue || ''}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, currentValue: Number(e.target.value) }))}
                />
                <Button onClick={addInvestment} className="bg-green-600 hover:bg-green-700">
                  Add
                </Button>
              </div>
            </Card>

            <div className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      {editingInvestment === investment.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <Input
                              value={investment.name}
                              onChange={(e) => updateInvestment(investment.id, 'name', e.target.value)}
                              className="text-sm"
                            />
                            <Select value={investment.type} onValueChange={(value) => updateInvestment(investment.id, 'type', value)}>
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Stocks">Stocks</SelectItem>
                                <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                                <SelectItem value="Real Estate">Real Estate</SelectItem>
                                <SelectItem value="Bonds">Bonds</SelectItem>
                                <SelectItem value="Crypto">Crypto</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={investment.amount}
                              onChange={(e) => updateInvestment(investment.id, 'amount', Number(e.target.value))}
                              className="text-sm"
                            />
                            <Input
                              type="number"
                              value={investment.currentValue}
                              onChange={(e) => updateInvestment(investment.id, 'currentValue', Number(e.target.value))}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => setEditingInvestment(null)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingInvestment(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold">{investment.name}</h4>
                          <p className="text-sm text-gray-500">{investment.type}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{investment.currentValue.toLocaleString()}</p>
                      <p className={`text-sm ${investment.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {investment.returns >= 0 ? '+' : ''}{investment.returnsPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <Progress value={investment.returnsPercentage} className="h-2" />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Started: {investment.startDate}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingInvestment(investment.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteInvestment(investment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <MarketData />
          </TabsContent>

          <TabsContent value="advisor" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Investment Amount (₹)</label>
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter total amount to invest"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Risk Profile</label>
                  <Select value={riskProfile} onValueChange={setRiskProfile}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your risk profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Investment Horizon (Years)</label>
                  <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Short Term (≤ 3 years)</SelectItem>
                      <SelectItem value="5">Medium Term (4-7 years)</SelectItem>
                      <SelectItem value="10">Long Term (&gt; 7 years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Recommended Allocation</h3>
                <div className="space-y-3">
                  {Object.entries(advice.allocation).map(([type, percentage]) => (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{type}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-800">AI Investment Advice</h3>
                  <p className="text-sm text-purple-700 mt-1">{advice.summary}</p>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-purple-800">{advice.emergency}</p>
                    <p className="text-sm font-medium text-purple-800">{advice.monthly}</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Investment Recommendations</h3>
                <div className="space-y-2">
                  {advice.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Time-based Strategy</h3>
                <div className="space-y-2">
                  {advice.timeBasedTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button onClick={() => setShowTransactionDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
            <Card className="p-4">
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No transactions yet. Add your first transaction to get started.</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{getInvestmentName(transaction.investmentId)}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'buy' || transaction.type === 'dividend' || transaction.type === 'interest' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'buy' || transaction.type === 'dividend' || transaction.type === 'interest' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Future Tips Popup */}
        <Dialog open={showFutureTips} onOpenChange={setShowFutureTips}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🔮 Future Investment Insights
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Quick Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">🚀 Emerging Trends</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• ESG Investing (10-15% allocation)</li>
                    <li>• Digital Assets (1-2% for high risk)</li>
                    <li>• International diversification</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">📈 Strategies</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Dollar-cost averaging</li>
                    <li>• Value investing opportunities</li>
                    <li>• Sector rotation tactics</li>
                  </ul>
                </div>
              </div>

              {/* Tax Optimization */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">💰 Tax Optimization</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                    <p className="text-xs text-green-700 font-medium">ELSS Funds</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                    <p className="text-xs text-blue-700 font-medium">Tax-Loss Harvesting</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                    <p className="text-xs text-purple-700 font-medium">LTCG Planning</p>
                  </div>
                </div>
              </div>

              {/* Goal-Based Planning */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-3">🎯 Goal-Based Planning</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">ST</div>
                    <p className="text-xs text-orange-700 font-medium">Short-term</p>
                    <p className="text-xs text-gray-600">Liquid funds</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">MT</div>
                    <p className="text-xs text-blue-700 font-medium">Medium-term</p>
                    <p className="text-xs text-gray-600">Balanced funds</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">LT</div>
                    <p className="text-xs text-green-700 font-medium">Long-term</p>
                    <p className="text-xs text-gray-600">Equity focus</p>
                  </div>
                </div>
              </div>

              {/* Market Predictions */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">🔮 Market Predictions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-lg font-bold text-green-600 mb-1">2024-2025</div>
                    <p className="text-xs text-gray-600">Tech & Healthcare recovery</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-lg font-bold text-blue-600 mb-1">2025-2027</div>
                    <p className="text-xs text-gray-600">Renewable energy growth</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-lg font-bold text-purple-600 mb-1">2027-2030</div>
                    <p className="text-xs text-gray-600">AI & automation boom</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction Dialog */}
        <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Investment</label>
                <Select value={newTransaction.investmentId} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, investmentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment" />
                  </SelectTrigger>
                  <SelectContent>
                    {investments.map((investment) => (
                      <SelectItem key={investment.id} value={investment.id}>
                        {investment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Transaction Type</label>
                <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value as Transaction['type'] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="dividend">Dividend</SelectItem>
                    <SelectItem value="interest">Interest</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  value={newTransaction.amount || ''}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Monthly SIP, Dividend payout"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowTransactionDialog(false)}>Cancel</Button>
                <Button onClick={addTransaction} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  } 