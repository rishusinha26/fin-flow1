
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Shield, Lightbulb, Target, PiggyBank } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';

const AIInsights = () => {
  const { expenses, totalExpenses } = useExpenses();

  const generateInsights = () => {
    const monthlyIncome = 50000; // This would come from user data
    const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
    const emergencyFundTarget = totalExpenses * 6;
    const currentSavings = 15000; // This would come from user data

    const insights = [];

    // Spending pattern analysis
    const categorySpending = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];

    if (savingsRate < 20) {
      insights.push({
        type: 'alert',
        icon: AlertTriangle,
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to secure your financial future.`,
        action: 'Review your expenses and find areas to cut back.',
        priority: 'high'
      });
    }

    if (currentSavings < emergencyFundTarget) {
      insights.push({
        type: 'alert',
        icon: Shield,
        title: 'Emergency Fund Shortfall',
        message: `You need ₹${(emergencyFundTarget - currentSavings).toLocaleString()} more for a 6-month emergency fund.`,
        action: 'Set up automatic transfers to build your emergency fund.',
        priority: 'high'
      });
    }

    if (highestCategory && categorySpending[highestCategory[0]] > totalExpenses * 0.4) {
      insights.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'High Category Spending',
        message: `You're spending ₹${highestCategory[1].toFixed(2)} on ${highestCategory[0]} (${((highestCategory[1]/totalExpenses)*100).toFixed(1)}% of total expenses).`,
        action: 'Consider ways to optimize this category spending.',
        priority: 'medium'
      });
    }

    // Investment recommendations
    if (savingsRate > 20) {
      insights.push({
        type: 'opportunity',
        icon: TrendingUp,
        title: 'Investment Opportunity',
        message: 'Great savings rate! Consider diversifying into mutual funds or SIPs.',
        action: 'Start a SIP with ₹5,000/month for long-term wealth building.',
        priority: 'low'
      });
    }

    // Insurance recommendations
    insights.push({
      type: 'recommendation',
      icon: Shield,
      title: 'Insurance Coverage',
      message: 'Ensure you have adequate life and health insurance coverage.',
      action: 'Life insurance should be 10-15x your annual income. Health insurance minimum ₹10 lakhs.',
      priority: 'medium'
    });

    return insights;
  };

  const insights = generateInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';
      case 'low': return 'text-green-800';
      default: return 'text-blue-800';
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🤖 AI Financial Insights
      </h2>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getPriorityTextColor(insight.priority)} bg-white/50`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${getPriorityTextColor(insight.priority)} mb-1`}>
                    {insight.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">{insight.message}</p>
                  <p className={`text-xs ${getPriorityTextColor(insight.priority)} font-medium`}>
                    💡 {insight.action}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Quick Tips Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Quick Financial Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span>Follow the 50-30-20 rule for budgeting</span>
            </div>
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-blue-600" />
              <span>Automate your savings and investments</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span>Review insurance policies annually</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Diversify your investment portfolio</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIInsights;
