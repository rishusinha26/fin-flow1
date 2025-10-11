import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Calculator, Award, Receipt, Plus, Edit, QrCode, Target, MessageCircle, Send, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIncome, IncomeSource } from '@/contexts/IncomeContext';
import { simpleAIService, FinancialContext, AIResponse } from '@/services/simpleAIService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Custom Rupee icon component
const RupeeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12"/>
    <path d="M6 8h12"/>
    <path d="M6 13l8.5 8"/>
    <path d="M15 13c-2.5 0-5-1.5-5-4"/>
  </svg>
);

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'savings' | 'investment' | 'purchase' | 'travel' | 'education' | 'other';
  priority: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

const FinancialTools = () => {
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [showSimulatorDialog, setShowSimulatorDialog] = useState(false);
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const [showInvestmentDialog, setShowInvestmentDialog] = useState(false);
  const [showScanPayDialog, setShowScanPayDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showChatbotDialog, setShowChatbotDialog] = useState(false);
  // const [showAISettingsDialog, setShowAISettingsDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentType, setInvestmentType] = useState('mutual_funds');
  const [scanPayAmount, setScanPayAmount] = useState('');
  const [scanPayDescription, setScanPayDescription] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  // const [isAILoading, setIsAILoading] = useState(false);
  // const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>('gemini');
  // const [apiKey, setApiKey] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hello! I\'m your financial assistant. How can I help you today? You can ask me about budgeting, investments, savings tips, or any financial questions.',
      timestamp: new Date()
    }
  ]);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 25000,
      targetDate: '2024-12-31',
      category: 'savings',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 50000,
      currentAmount: 15000,
      targetDate: '2024-06-30',
      category: 'travel',
      priority: 'medium'
    }
  ]);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: new Date().toISOString().split('T')[0],
    category: 'savings',
    priority: 'medium'
  });
  const [newIncome, setNewIncome] = useState<Partial<IncomeSource>>({
    name: '',
    amount: 0,
    type: 'salary',
    frequency: 'monthly'
  });
  const [simulatorData, setSimulatorData] = useState({
    currentAge: '',
    retirementAge: '',
    monthlyInvestment: '',
    expectedReturn: ''
  });
  const [futureProjection, setFutureProjection] = useState<any>(null);
  const { toast } = useToast();
  const { expenses, totalExpenses, addExpense } = useExpenses();
  const { incomeSources, totalMonthlyIncome, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useIncome();

  // Calculate savings and savings rate
  const totalSavings = totalMonthlyIncome - totalExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (totalSavings / totalMonthlyIncome) * 100 : 0;

  const handleAddIncomeSource = () => {
    if (newIncome.name && newIncome.amount) {
      addIncomeSource({
        name: newIncome.name,
        amount: newIncome.amount,
        type: newIncome.type || 'salary',
        frequency: newIncome.frequency || 'monthly'
      });
      setNewIncome({
        name: '',
        amount: 0,
        type: 'salary',
        frequency: 'monthly'
      });
      setShowIncomeDialog(false);
    }
  };

  const handleAddInvestment = () => {
    if (investmentAmount && parseFloat(investmentAmount) > 0) {
      const amount = parseFloat(investmentAmount);
      addIncomeSource({
        name: `${investmentType.replace('_', ' ').toUpperCase()} Investment`,
        amount: amount,
        type: 'investment',
        frequency: 'monthly'
      });
      setInvestmentAmount('');
      setInvestmentType('mutual_funds');
      setShowInvestmentDialog(false);
      toast({
        title: "Investment Added!",
        description: `₹${amount.toLocaleString()} investment has been added to your income sources.`
      });
    }
  };

  const handleScanPay = () => {
    if (scanPayAmount && parseFloat(scanPayAmount) > 0) {
      const amount = parseFloat(scanPayAmount);
      addExpense({
        description: scanPayDescription || 'Scan to Pay Transaction',
        amount: amount,
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      });
      setScanPayAmount('');
      setScanPayDescription('');
      setShowScanPayDialog(false);
      toast({
        title: "Payment Successful!",
        description: `₹${amount.toLocaleString()} has been paid via scan to pay.`
      });
    }
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetAmount > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.currentAmount || 0,
        targetDate: newGoal.targetDate || new Date().toISOString().split('T')[0],
        category: newGoal.category || 'savings',
        priority: newGoal.priority || 'medium'
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: new Date().toISOString().split('T')[0],
        category: 'savings',
        priority: 'medium'
      });
      setShowGoalDialog(false);
      toast({
        title: "Goal Added!",
        description: `New goal "${goal.name}" has been created.`
      });
    }
  };

  const updateGoal = (id: string, field: keyof Goal, value: any) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleChatMessage = async () => {
    if (chatMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        message: chatMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMessage]);
      
      try {
        // Prepare financial context
        const financialContext: FinancialContext = {
          monthlyIncome: totalMonthlyIncome,
          monthlyExpenses: totalExpenses,
          savingsRate: ((totalMonthlyIncome - totalExpenses) / totalMonthlyIncome) * 100,
          expenses: expenses.map(exp => ({
            category: exp.category,
            amount: exp.amount
          })),
          goals: goals.map(goal => ({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            targetDate: goal.targetDate,
            category: goal.category,
            priority: goal.priority
          })),
          investments: incomeSources.filter(source => source.type === 'investment').map(source => ({
            name: source.name,
            amount: source.amount,
            type: source.type
          }))
        };

        // Get AI response
        const aiResponse: AIResponse = await simpleAIService.getFinancialAdvice(chatMessage, financialContext);
        
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: aiResponse.message,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('AI service error:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
      
      setChatMessage('');
    }
  };

  const handleAISettings = () => {
    toast({
      title: "AI Service",
      description: "Your AI Assistant is now powered by intelligent financial analysis! Ask about budgeting, investments, savings, taxes, and more."
    });
  };

  const generatePDFStatement = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const monthlyIncome = totalMonthlyIncome;
    const savings = totalSavings;
    const savingsRate = (savings / monthlyIncome) * 100;
    let currentY = margin;

    // Helper function for centered text
    const addCenteredText = (text: string, yPos: number, fontSize = 12) => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, yPos);
    };

    // Helper function for section headers
    const addSectionHeader = (text: string, yPos: number) => {
      doc.setFillColor(0, 51, 102);
      doc.rect(margin, yPos - 6, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(text, margin + 2, yPos);
      doc.setTextColor(0, 0, 0);
      return yPos + 10;
    };

    // Header with logo/branding
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    addCenteredText('Financial Health Report', 17);

    // Report Info
    currentY = 40;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, currentY);
    doc.text(`Report ID: FIN-${Date.now().toString().slice(-6)}`, pageWidth - margin - 60, currentY);

    // Executive Summary
    currentY = addSectionHeader('Executive Summary', currentY + 15);
    const score = calculateFinancialScore();
    doc.setFontSize(11);
    [
      `Financial Health Score: ${score.score}/100 (Grade ${score.grade})`,
      `Monthly Income: ₹${monthlyIncome.toLocaleString()}`,
      `Total Expenses: ₹${totalExpenses.toLocaleString()}`,
      `Savings Rate: ${savingsRate.toFixed(1)}%`
    ].forEach(text => {
      doc.text('•', margin, currentY + 5);
      doc.text(text, margin + 5, currentY + 5);
      currentY += 7;
    });

    // Expense Analysis
    currentY = addSectionHeader('Expense Analysis', currentY + 10);
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    // Create expense table
    const tableHeaders = ['Category', 'Amount (₹)', '% of Total'];
    const tableData = Object.entries(expensesByCategory).map(([category, amount]) => [
      category,
      amount.toLocaleString(),
      `${((amount / totalExpenses) * 100).toFixed(1)}%`
    ]);

    // Table styling
    const colWidths = [70, 50, 40];
    const startX = margin;
    const rowHeight = 8;

    // Draw table header
    doc.setFillColor(240, 240, 240);
    doc.rect(startX, currentY, pageWidth - 2 * margin, rowHeight, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    tableHeaders.forEach((header, i) => {
      let x = startX;
      for (let j = 0; j < i; j++) x += colWidths[j];
      doc.text(header, x + 2, currentY + 6);
    });
    currentY += rowHeight;

    // Draw table rows
    tableData.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(startX, currentY, pageWidth - 2 * margin, rowHeight, 'F');
      }
      row.forEach((cell, j) => {
        let x = startX;
        for (let k = 0; k < j; k++) x += colWidths[k];
        doc.text(cell, x + 2, currentY + 6);
      });
      currentY += rowHeight;
    });

    // Investment Recommendations
    currentY = addSectionHeader('Investment Recommendations', currentY + 15);
    doc.setFontSize(11);
    [
      'Maximize tax savings through Section 80C investments',
      'Consider increasing emergency fund to 6 months of expenses',
      'Review and rebalance investment portfolio quarterly',
      'Set up systematic investment plans (SIPs) for regular investing'
    ].forEach(text => {
      doc.text('•', margin, currentY + 5);
      doc.text(text, margin + 5, currentY + 5);
      currentY += 7;
    });

    // Risk Analysis
    currentY = addSectionHeader('Risk Analysis & Alerts', currentY + 10);
    doc.setFontSize(11);
    const riskItems = [
      expenses.some(e => e.amount > totalExpenses * 0.4)
        ? '⚠ High concentration in certain expense categories'
        : '✓ Well-distributed expense pattern',
      totalExpenses > 40000
        ? '⚠ Monthly expenses above recommended threshold'
        : '✓ Monthly expenses within recommended range',
      savings < 10000
        ? '⚠ Low monthly savings - consider reducing discretionary expenses'
        : '✓ Healthy monthly savings'
    ];
    riskItems.forEach(text => {
      doc.text(text, margin, currentY + 5);
      currentY += 7;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const footerText = 'This report is auto-generated and for informational purposes only. Consult a financial advisor for professional advice.';
    addCenteredText(footerText, pageHeight - 10, 8);

    // Save PDF
    doc.save(`financial-health-report-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Financial Health Report Generated!",
      description: "Your comprehensive financial report has been downloaded in PDF format."
    });
  };

  const calculateFinancialScore = () => {
    const savingsRate = Math.min((totalMonthlyIncome - totalExpenses) / totalMonthlyIncome, 1);
    const investmentDiversification = 0.75;
    const debtToIncomeRatio = 0.1;
    const emergencyFund = 0.8;

    const score = Math.round(
      (savingsRate * 25) + 
      (investmentDiversification * 20) + 
      ((1 - debtToIncomeRatio) * 25) + 
      (emergencyFund * 20) + 
      10
    );

    return {
      score,
      grade: score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D',
      factors: {
        'Savings Rate': Math.round(savingsRate * 100),
        'Investment Diversification': Math.round(investmentDiversification * 100),
        'Debt Management': Math.round((1 - debtToIncomeRatio) * 100),
        'Emergency Fund': Math.round(emergencyFund * 100)
      }
    };
  };

  const runSimulator = () => {
    const { currentAge, retirementAge, monthlyInvestment, expectedReturn } = simulatorData;
    
    if (!currentAge || !retirementAge || !monthlyInvestment || !expectedReturn) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to run the simulation.",
        variant: "destructive"
      });
      return;
    }

    const years = parseInt(retirementAge) - parseInt(currentAge);
    const monthlyAmount = parseFloat(monthlyInvestment);
    const annualReturn = parseFloat(expectedReturn) / 100;
    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;

    const futureValue = monthlyAmount * (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn);
    const totalInvested = monthlyAmount * totalMonths;
    const returns = futureValue - totalInvested;

    setFutureProjection({
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      returns: Math.round(returns),
      years,
      monthlyRetirement: Math.round(futureValue * 0.04 / 12)
    });
  };

  const financialScore = calculateFinancialScore();

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🛠️ Financial Tools
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Financial Score */}
        <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              variant="outline"
            >
              <Award className="w-6 h-6" />
              <span className="text-sm font-medium">Financial Score</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Financial Health Score</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">{financialScore.score}</div>
                <div className="text-2xl font-semibold text-gray-700">Grade: {financialScore.grade}</div>
              </div>
              <div className="space-y-3">
                {Object.entries(financialScore.factors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{factor}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Future Simulator */}
        <Dialog open={showSimulatorDialog} onOpenChange={setShowSimulatorDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              variant="outline"
            >
              <Calculator className="w-6 h-6" />
              <span className="text-sm font-medium">Future Simulator</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Financial Future Simulator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Current Age</label>
                  <Input
                    type="number"
                    value={simulatorData.currentAge}
                    onChange={(e) => setSimulatorData({...simulatorData, currentAge: e.target.value})}
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Retirement Age</label>
                  <Input
                    type="number"
                    value={simulatorData.retirementAge}
                    onChange={(e) => setSimulatorData({...simulatorData, retirementAge: e.target.value})}
                    placeholder="60"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Monthly Investment (₹)</label>
                <Input
                  type="number"
                  value={simulatorData.monthlyInvestment}
                  onChange={(e) => setSimulatorData({...simulatorData, monthlyInvestment: e.target.value})}
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Annual Return (%)</label>
                <Select value={simulatorData.expectedReturn} onValueChange={(value) => setSimulatorData({...simulatorData, expectedReturn: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8% (Conservative)</SelectItem>
                    <SelectItem value="10">10% (Moderate)</SelectItem>
                    <SelectItem value="12">12% (Aggressive)</SelectItem>
                    <SelectItem value="15">15% (High Risk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={runSimulator} className="w-full">
                Calculate Future Value
              </Button>
              
              {futureProjection && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Projection Results:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span className="font-medium">{futureProjection.years} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Invested:</span>
                      <span className="font-medium">₹{futureProjection.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Returns Generated:</span>
                      <span className="font-medium text-green-600">₹{futureProjection.returns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Future Value:</span>
                      <span className="text-green-600">₹{futureProjection.futureValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Monthly Retirement Income (4% rule):</span>
                      <span>₹{futureProjection.monthlyRetirement.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Scan to Pay */}
        <Dialog open={showScanPayDialog} onOpenChange={setShowScanPayDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              variant="outline"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm font-medium">Scan to Pay</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan to Pay</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <QrCode className="w-24 h-24 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Scan QR code to pay</p>
              </div>
              <div>
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  value={scanPayAmount}
                  onChange={(e) => setScanPayAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={scanPayDescription}
                  onChange={(e) => setScanPayDescription(e.target.value)}
                  placeholder="e.g., Grocery payment"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowScanPayDialog(false)}>Cancel</Button>
                <Button onClick={handleScanPay} className="bg-green-600 hover:bg-green-700">
                  Pay Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Goal Tracker */}
        <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
              variant="outline"
            >
              <Target className="w-6 h-6" />
              <span className="text-sm font-medium">Goal Tracker</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Financial Goals</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Goal Name</label>
                  <Input
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target Amount (₹)</label>
                  <Input
                    type="number"
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                    placeholder="100000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Current Amount (₹)</label>
                  <Input
                    type="number"
                    value={newGoal.currentAmount || ''}
                    onChange={(e) => setNewGoal({...newGoal, currentAmount: Number(e.target.value)})}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target Date</label>
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value as Goal['category']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as Goal['priority']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowGoalDialog(false)}>Cancel</Button>
                <Button onClick={handleAddGoal} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Financial Chatbot */}
        <Dialog open={showChatbotDialog} onOpenChange={setShowChatbotDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
              variant="outline"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">AI Assistant</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Financial AI Assistant
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAISettings}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg max-w-xs ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 border'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask me about finances..."
                  onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                />
                <Button 
                  onClick={handleChatMessage} 
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                💡 <strong>Note:</strong> AI service is now powered by intelligent financial analysis!
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Settings Dialog - Temporarily Disabled */}
        {/* 
        <Dialog open={showAISettingsDialog} onOpenChange={setShowAISettingsDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>AI Service Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">AI Provider</label>
                <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'gemini' | 'openai')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI GPT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter ${aiProvider.toUpperCase()} API key`}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Google Gemini:</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>Get API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                  <li>Free tier: 15 requests/minute</li>
                </ul>
                <p className="mt-2"><strong>OpenAI GPT:</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>Get API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></li>
                  <li>Paid service with usage-based pricing</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAISettingsDialog(false)}>Cancel</Button>
                <Button onClick={handleAISettings} className="bg-indigo-600 hover:bg-indigo-700">
                  Save Configuration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        */}

        {/* Income Sources */}
        <div className="col-span-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <RupeeIcon className="w-6 h-6" /> Income Sources
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomeSources.map(source => (
                  <tr key={source.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {source.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{source.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNewIncome(source);
                          setEditingIncome(source.id);
                          setShowIncomeDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteIncomeSource(source.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.093 48.455 48.455 0 01-3.478-.397m-12 .562c.34-.059.679-.114 1.02-.172m-.172 3.183c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.093 48.455 48.455 0 01-3.478-.397" />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goals Display */}
        <div className="col-span-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" /> Financial Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{goal.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>₹{goal.currentAmount.toLocaleString()}</span>
                      <span>₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Target date passed'}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Income Sources Dialog */}
        <Dialog open={showIncomeDialog} onOpenChange={setShowIncomeDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200"
              variant="outline"
            >
              <RupeeIcon />
              <span className="text-sm font-medium">Manage Income Sources</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingIncome ? 'Edit Income Source' : 'Add New Income Source'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newIncome.name}
                  onChange={(e) => setNewIncome({...newIncome, name: e.target.value})}
                  placeholder="e.g., Primary Salary, Freelance Income"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({...newIncome, amount: parseFloat(e.target.value) || 0})}
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newIncome.type} onValueChange={(value) => setNewIncome({...newIncome, type: value as IncomeSource['type']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Frequency</label>
                <Select value={newIncome.frequency} onValueChange={(value) => setNewIncome({...newIncome, frequency: value as IncomeSource['frequency']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowIncomeDialog(false)}>Cancel</Button>
                <Button onClick={handleAddIncomeSource}>
                  {editingIncome ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {editingIncome ? 'Update' : 'Add'} Income
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Investment Amount Dialog */}
        <Dialog open={showInvestmentDialog} onOpenChange={setShowInvestmentDialog}>
          <DialogTrigger asChild>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              variant="outline"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm font-medium">Add Investment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Investment Amount</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Investment Type</label>
                <Select value={investmentType} onValueChange={setInvestmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="fixed_deposits">Fixed Deposits</SelectItem>
                    <SelectItem value="ppf">PPF</SelectItem>
                    <SelectItem value="elss">ELSS</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Investment Amount (₹)</label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInvestmentDialog(false)}>Cancel</Button>
                <Button onClick={handleAddInvestment} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Investment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Download Statement */}
        <Button
          className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          variant="outline"
          onClick={generatePDFStatement}
        >
          <Download className="w-6 h-6" />
          <span className="text-sm font-medium">Download PDF Report</span>
        </Button>
      </div>
    </Card>
  );
};

export default FinancialTools;
