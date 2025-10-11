
import React from 'react';
import { Card } from '@/components/ui/card';

const InvestmentSuggestions = () => {
  const extraMoney = 350; // This would be calculated: budget - expenses

  const investments = [
    {
      type: "Stocks",
      risk: "Medium-High",
      expectedReturn: "8-12%",
      description: "Invest in diversified index funds for long-term growth",
      icon: "📈"
    },
    {
      type: "Mutual Funds",
      risk: "Medium",
      expectedReturn: "6-10%",
      description: "Professionally managed funds with diversified portfolios",
      icon: "🏦"
    },
    {
      type: "Real Estate",
      risk: "Medium",
      expectedReturn: "5-8%",
      description: "REITs for real estate exposure without buying property",
      icon: "🏠"
    },
    {
      type: "Gold",
      risk: "Low-Medium",
      expectedReturn: "3-6%",
      description: "Hedge against inflation with precious metals",
      icon: "🥇"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low-Medium": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Medium-High": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        💎 Investment Suggestions
      </h2>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold text-gray-700">
          Extra Money Available: <span className="text-green-600">${extraMoney}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Consider investing your surplus for future growth
        </p>
      </div>

      <div className="space-y-4">
        {investments.map((investment, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{investment.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{investment.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.risk)}`}>
                    {investment.risk}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{investment.description}</p>
                <p className="text-sm font-medium text-blue-600">
                  Expected Return: {investment.expectedReturn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Always diversify your investments and consider consulting with a financial advisor for personalized advice.
        </p>
      </div>
    </Card>
  );
};

export default InvestmentSuggestions;
