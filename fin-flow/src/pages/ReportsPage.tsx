import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIncome } from '@/contexts/IncomeContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ReportsPage() {
  const { totalMonthlyIncome, totalYearlyIncome } = useIncome();
  const { expenses, totalExpenses, expensesByCategory } = useExpenses();

  // Calculate monthly savings
  const monthlySavings = totalMonthlyIncome - totalExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (monthlySavings / totalMonthlyIncome) * 100 : 0;

  // Prepare data for charts
  const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  // Monthly trend data (mock data - in real app, calculate from actual dates)
  const monthlyTrendData = [
    { month: 'Jan', income: totalMonthlyIncome * 0.9, expenses: totalExpenses * 0.8 },
    { month: 'Feb', income: totalMonthlyIncome * 0.95, expenses: totalExpenses * 0.9 },
    { month: 'Mar', income: totalMonthlyIncome, expenses: totalExpenses },
  ];

  // Income vs Expenses comparison
  const comparisonData = [
    { name: 'Income', amount: totalMonthlyIncome },
    { name: 'Expenses', amount: totalExpenses },
    { name: 'Savings', amount: monthlySavings > 0 ? monthlySavings : 0 }
  ];

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('Zen-Fi Financial Report', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Financial Summary', 14, 40);
    
    const summaryData = [
      ['Monthly Income', `₹${totalMonthlyIncome.toLocaleString()}`],
      ['Total Expenses', `₹${totalExpenses.toLocaleString()}`],
      ['Monthly Savings', `₹${monthlySavings.toLocaleString()}`],
      ['Savings Rate', `${savingsRate.toFixed(2)}%`],
      ['Yearly Income', `₹${totalYearlyIncome.toLocaleString()}`]
    ];
    
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });
    
    // Expenses by Category
    doc.setFontSize(14);
    doc.text('Expenses by Category', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const categoryTableData = Object.entries(expensesByCategory).map(([category, amount]) => [
      category,
      `₹${amount.toLocaleString()}`,
      `${((amount / totalExpenses) * 100).toFixed(1)}%`
    ]);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Category', 'Amount', 'Percentage']],
      body: categoryTableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] }
    });
    
    // Save PDF
    doc.save(`zen-fi-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-white/90 mt-1">
                Comprehensive financial insights and analysis
              </p>
            </div>
          </div>
          <Button 
            onClick={downloadPDFReport}
            className="bg-white text-indigo-600 hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-green-600 font-medium">Monthly Income</p>
            <h3 className="text-2xl font-bold text-green-900">₹{totalMonthlyIncome.toLocaleString()}</h3>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-red-600 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-900">₹{totalExpenses.toLocaleString()}</h3>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-6 bg-gradient-to-br ${monthlySavings >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className={`w-8 h-8 ${monthlySavings >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <p className={`text-sm font-medium ${monthlySavings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Monthly Savings</p>
            <h3 className={`text-2xl font-bold ${monthlySavings >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              ₹{Math.abs(monthlySavings).toLocaleString()}
            </h3>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-purple-600 font-medium">Savings Rate</p>
            <h3 className="text-2xl font-bold text-purple-900">{savingsRate.toFixed(1)}%</h3>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Expenses by Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Percentage</th>
                  <th className="text-right py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(expensesByCategory).map(([category, amount], index) => {
                  const percentage = (amount / totalExpenses) * 100;
                  return (
                    <motion.tr
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{category}</td>
                      <td className="text-right py-3 px-4">₹{amount.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{percentage.toFixed(1)}%</td>
                      <td className="text-right py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          percentage > 30 ? 'bg-red-100 text-red-700' :
                          percentage > 15 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {percentage > 30 ? 'High' : percentage > 15 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
