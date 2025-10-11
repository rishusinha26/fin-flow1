import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FinancialTips = () => {
  const tips = [
    {
      title: "Automate Your Savings",
      content: "Set up automatic transfers to your savings account every payday. Even $50/month adds up to $600/year!",
      icon: "🏦"
    },
    {
      title: "Review Subscriptions",
      content: "Cancel unused subscriptions. The average person pays $273/month for subscriptions they don't use regularly.",
      icon: "📱"
    },
    {
      title: "Cook at Home",
      content: "Cooking at home can save you $2,000+ per year compared to eating out frequently.",
      icon: "🍳"
    },
    {
      title: "Emergency Fund",
      content: "Build an emergency fund with 3-6 months of expenses. Start with just $500 for small emergencies.",
      icon: "🛡️"
    },
    {
      title: "Pay Off High-Interest Debt",
      content: "Focus on paying off credit card debt first. A $5,000 balance at 18% APR costs $900/year in interest.",
      icon: "💳"
    },
    {
      title: "Buy Generic Brands",
      content: "Generic brands can save you 20-40% on groceries without sacrificing quality.",
      icon: "🛒"
    }
  ];

  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        💡 Financial Tips
      </h2>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <div className="text-center mb-4">
          <span className="text-4xl mb-2 block">{tips[currentTip].icon}</span>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {tips[currentTip].title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {tips[currentTip].content}
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" size="sm" onClick={prevTip}>
            ← Previous
          </Button>
          <span className="text-xs text-gray-500">
            {currentTip + 1} of {tips.length}
          </span>
          <Button variant="outline" size="sm" onClick={nextTip}>
            Next →
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1">
        {tips.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-colors ${
              index === currentTip ? 'bg-purple-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default FinancialTips;
