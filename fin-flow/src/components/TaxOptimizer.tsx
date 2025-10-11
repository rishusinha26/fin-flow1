import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Brain, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TaxOptimizerProps {
  // Removed dialog props - now standalone component
}

interface DeductionCategory {
  name: string;
  description: string;
  maxLimit: number;
  used: number;
  sections: string[];
}

const deductionCategories: DeductionCategory[] = [
  {
    name: "80C Investments",
    description: "Tax deduction on various investments and expenses",
    maxLimit: 150000,
    used: 80000,
    sections: [
      "PPF (Public Provident Fund)",
      "ELSS Mutual Funds",
      "Life Insurance Premium",
      "EPF (Employee Provident Fund)",
      "Tax-Saving FD",
      "Children's Tuition Fees"
    ]
  },
  {
    name: "80D Health Insurance",
    description: "Deduction for health insurance premiums",
    maxLimit: 75000,
    used: 25000,
    sections: [
      "Self & Family Health Insurance",
      "Parents' Health Insurance",
      "Preventive Health Checkup"
    ]
  },
  {
    name: "80E Education Loan",
    description: "Interest paid on education loan",
    maxLimit: 0, // No limit
    used: 50000,
    sections: [
      "Higher Education Loan Interest",
      "Vocational Course Loan Interest"
    ]
  },
  {
    name: "House Rent Allowance",
    description: "Tax exemption on house rent paid",
    maxLimit: 100000,
    used: 60000,
    sections: [
      "Rent Paid",
      "HRA Received",
      "Basic Salary Component"
    ]
  }
];

const aiTips = [
  {
    category: "Investment",
    tips: [
      "Maximize your 80C limit by investing in ELSS funds for better returns with 3-year lock-in",
      "Consider PPF for long-term tax-free returns with sovereign guarantee",
      "Split investments between EPF and VPF for secure retirement planning"
    ]
  },
  {
    category: "Insurance",
    tips: [
      "Opt for term insurance instead of endowment plans for better coverage at lower cost",
      "Get family floater health insurance to optimize premium costs",
      "Include critical illness rider in health insurance for comprehensive coverage"
    ]
  },
  {
    category: "Home & Rent",
    tips: [
      "Claim both HRA and home loan benefits if living in rented house while owning one",
      "Consider home loan prepayment to save on interest while getting tax benefits",
      "Submit rent receipts regularly to HR for tax optimization"
    ]
  }
];

export function TaxOptimizer({}: TaxOptimizerProps) {
  const [income, setIncome] = useState('');
  const [regime, setRegime] = useState('old');

  const calculateTaxSavings = () => {
    const totalDeductions = deductionCategories.reduce((sum, cat) => sum + cat.used, 0);
    const potentialDeductions = deductionCategories.reduce((sum, cat) => 
      sum + (cat.maxLimit > 0 ? cat.maxLimit : cat.used), 0);
    const additionalPotential = potentialDeductions - totalDeductions;

    return {
      current: totalDeductions,
      potential: additionalPotential,
      totalPossible: potentialDeductions
    };
  };

  const taxSavings = calculateTaxSavings();

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deductions">Tax Deductions</TabsTrigger>
          <TabsTrigger value="ai-tips">AI Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Annual Income (₹)</label>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter your annual income"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tax Regime</label>
                <Select value={regime} onValueChange={setRegime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="old">Old Regime (with deductions)</SelectItem>
                    <SelectItem value="new">New Regime (without deductions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Tax Savings Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Tax Savings</span>
                    <span>₹{taxSavings.current.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(taxSavings.current / taxSavings.totalPossible) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Additional Potential</span>
                    <span className="text-green-600">+₹{taxSavings.potential.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(taxSavings.potential / taxSavings.totalPossible) * 100} 
                    className="h-2 bg-green-100"
                  />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-blue-50">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">AI Tax Insight</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Based on your income and current deductions, you could save approximately 
                  ₹{taxSavings.potential.toLocaleString()} more in taxes by optimizing your 
                  deductions. Consider maximizing your 80C investments and health insurance coverage.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          {deductionCategories.map((category) => (
            <Card key={category.name} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{category.used.toLocaleString()} / 
                    {category.maxLimit ? `₹${category.maxLimit.toLocaleString()}` : 'No Limit'}</p>
                  {category.maxLimit > 0 && (
                    <p className="text-sm text-green-600">
                      Remaining: ₹{(category.maxLimit - category.used).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              {category.maxLimit > 0 && (
                <Progress 
                  value={(category.used / category.maxLimit) * 100} 
                  className="h-2 mb-3"
                />
              )}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {category.sections.map((section) => (
                  <div key={section} className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ai-tips" className="space-y-4">
          {aiTips.map((category) => (
            <Card key={category.category} className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                {category.category} Optimization Tips
              </h3>
              <div className="space-y-3">
                {category.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-start gap-3">
              <Calculator className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-800">Personalized Recommendation</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Based on your income bracket and current investments, we recommend focusing on ELSS 
                  mutual funds for your remaining 80C limit. This can provide both tax benefits and 
                  potentially higher returns compared to traditional tax-saving instruments.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 