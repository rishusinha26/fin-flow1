// Simple AI Service for Financial Advice
// This provides intelligent responses without external API dependencies

export interface FinancialContext {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  expenses: Array<{
    category: string;
    amount: number;
  }>;
  goals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    priority: string;
  }>;
  investments: Array<{
    name: string;
    amount: number;
    type: string;
  }>;
}

export interface AIResponse {
  message: string;
  suggestions: string[];
  calculations?: Record<string, number>;
  nextSteps?: string[];
}

class SimpleAIService {
  async getFinancialAdvice(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    const message = userMessage.toLowerCase();
    
    if (message.includes('budget') || message.includes('spending') || message.includes('expense')) {
      return this.getBudgetAdvice(context);
    } 
    else if (message.includes('save') || message.includes('saving')) {
      return this.getSavingsAdvice(context);
    } 
    else if (message.includes('invest') || message.includes('investment') || message.includes('mutual fund')) {
      return this.getInvestmentAdvice(context);
    } 
    else if (message.includes('emergency') || message.includes('fund') || message.includes('safety')) {
      return this.getEmergencyFundAdvice(context);
    } 
    else if (message.includes('debt') || message.includes('loan') || message.includes('credit')) {
      return this.getDebtAdvice(context);
    } 
    else if (message.includes('tax') || message.includes('taxation') || message.includes('80c')) {
      return this.getTaxAdvice(context);
    } 
    else if (message.includes('goal') || message.includes('target') || message.includes('planning')) {
      return this.getGoalAdvice(context);
    }
    else if (message.includes('retirement') || message.includes('pension') || message.includes('old age')) {
      return this.getRetirementAdvice(context);
    }
    else if (message.includes('insurance') || message.includes('cover') || message.includes('protection')) {
      return this.getInsuranceAdvice(context);
    }
    else {
      return this.getGeneralAdvice(context);
    }
  }

  private getBudgetAdvice(context: FinancialContext): AIResponse {
    const topExpenseCategory = context.expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const highestCategory = Object.entries(topExpenseCategory).sort(([,a], [,b]) => b - a)[0];
    
    return {
      message: `📊 **Budget Analysis**: Your monthly spending is ₹${context.monthlyExpenses.toLocaleString()}. 
        
🔍 **Top Expense**: ${highestCategory?.[0]} (₹${highestCategory?.[1].toLocaleString()})
💰 **Savings Rate**: ${context.savingsRate.toFixed(1)}%

💡 **Recommendations**:
• Track daily expenses for better awareness
• Set spending limits for ${highestCategory?.[0]} category
• Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings
• Use automatic transfers to savings account`,
      suggestions: [
        'Track daily expenses for better awareness',
        'Set spending limits for top expense category',
        'Follow 50/30/20 budgeting rule',
        'Automate savings transfers'
      ],
      calculations: {
        savingsRate: context.savingsRate,
        topExpenseAmount: highestCategory?.[1] || 0
      },
      nextSteps: [
        'Download expense tracking app',
        'Set up automatic savings transfer',
        'Review spending categories monthly'
      ]
    };
  }

  private getSavingsAdvice(context: FinancialContext): AIResponse {
    const monthlySavings = context.monthlyIncome - context.monthlyExpenses;
    
    return {
      message: `💰 **Savings Analysis**: Your current savings rate is ${context.savingsRate.toFixed(1)}%.

📈 **Monthly Savings**: ₹${monthlySavings.toLocaleString()}
🎯 **Target**: Aim for 20-30% savings rate

💡 **Smart Saving Strategies**:
• Set up SIPs starting with ₹${Math.max(1000, Math.round(monthlySavings * 0.1)).toLocaleString()} monthly
• Create emergency fund: ₹${(context.monthlyExpenses * 6).toLocaleString()} (6 months expenses)
• Use high-yield savings accounts (4-7% returns)
• Automate savings transfers on payday
• Cut discretionary expenses by 10-15%`,
      suggestions: [
        'Set up automatic savings transfers',
        'Create emergency fund',
        'Use high-yield savings accounts',
        'Reduce discretionary spending'
      ],
      calculations: {
        monthlySavings,
        emergencyFundTarget: context.monthlyExpenses * 6,
        suggestedSIP: Math.max(1000, Math.round(monthlySavings * 0.1))
      },
      nextSteps: [
        'Open high-yield savings account',
        'Set up automatic monthly transfers',
        'Review and cut unnecessary expenses'
      ]
    };
  }

  private getInvestmentAdvice(context: FinancialContext): AIResponse {
    const investableAmount = Math.round((context.monthlyIncome - context.monthlyExpenses) * 0.3);
    
    return {
      message: `📈 **Investment Recommendations**:

💰 **Suggested Monthly Investment**: ₹${investableAmount.toLocaleString()}

🎯 **Portfolio Allocation**:
• **ELSS Funds**: 40% (₹${Math.round(investableAmount * 0.4).toLocaleString()}) - Tax benefits
• **Index Funds**: 30% (₹${Math.round(investableAmount * 0.3).toLocaleString()}) - Low cost
• **Debt Funds**: 20% (₹${Math.round(investableAmount * 0.2).toLocaleString()}) - Stability
• **Gold ETFs**: 10% (₹${Math.round(investableAmount * 0.1).toLocaleString()}) - Diversification

💡 **Smart Tips**:
• Start with SIPs of ₹500-1000 per fund
• Consider NPS for additional tax benefits
• Rebalance portfolio quarterly
• Focus on long-term (5+ years) investments`,
      suggestions: [
        'Start ELSS SIP for tax benefits',
        'Invest in index funds for low cost',
        'Add debt funds for stability',
        'Include gold ETFs for diversification'
      ],
      calculations: {
        monthlyInvestment: investableAmount,
        elssAmount: Math.round(investableAmount * 0.4),
        indexAmount: Math.round(investableAmount * 0.3),
        debtAmount: Math.round(investableAmount * 0.2),
        goldAmount: Math.round(investableAmount * 0.1)
      },
      nextSteps: [
        'Open demat account',
        'Start ELSS mutual fund SIP',
        'Set up automatic investment schedule'
      ]
    };
  }

  private getEmergencyFundAdvice(context: FinancialContext): AIResponse {
    const emergencyFundNeeded = context.monthlyExpenses * 6;
    const currentEmergencyFund = context.goals.find(g => g.name.toLowerCase().includes('emergency'))?.currentAmount || 0;
    const shortfall = emergencyFundNeeded - currentEmergencyFund;
    
    return {
      message: `🛡️ **Emergency Fund Analysis**:

🎯 **Target**: ₹${emergencyFundNeeded.toLocaleString()} (6 months expenses)
💰 **Current**: ₹${currentEmergencyFund.toLocaleString()}
📊 **Shortfall**: ₹${shortfall.toLocaleString()}

💡 **Building Strategy**:
• Save ₹${Math.round(shortfall / 12).toLocaleString()} monthly for 1 year
• Keep in liquid funds or high-yield savings
• Don't invest emergency fund in volatile assets
• Review and adjust every 6 months
• Consider health insurance for medical emergencies`,
      suggestions: [
        'Save monthly for emergency fund',
        'Keep in liquid funds',
        'Don\'t invest in volatile assets',
        'Review every 6 months'
      ],
      calculations: {
        emergencyFundNeeded,
        currentEmergencyFund,
        shortfall,
        monthlySavingsNeeded: Math.round(shortfall / 12)
      },
      nextSteps: [
        'Open liquid fund account',
        'Set up monthly emergency fund contribution',
        'Review health insurance coverage'
      ]
    };
  }

  private getDebtAdvice(context: FinancialContext): AIResponse {
    return {
      message: `💳 **Debt Management Strategy**:

🚨 **Priority Order**:
1. High-interest credit cards (18-36% APR)
2. Personal loans (12-24% APR)
3. Car loans (8-12% APR)
4. Home loans (7-9% APR)

💡 **Smart Debt Tips**:
• Pay more than minimum on high-interest debt
• Consider debt consolidation for multiple loans
• Use balance transfer cards for 0% APR periods
• Avoid new debt while paying existing ones
• Build emergency fund to prevent new debt

📊 **Debt-to-Income Ratio**: Keep below 40%`,
      suggestions: [
        'Pay high-interest debt first',
        'Consider debt consolidation',
        'Use balance transfer cards',
        'Build emergency fund'
      ],
      nextSteps: [
        'List all debts with interest rates',
        'Create debt repayment plan',
        'Consider debt consolidation options'
      ]
    };
  }

  private getTaxAdvice(context: FinancialContext): AIResponse {
    const taxSavings = 150000 * 0.3; // Assuming 30% tax bracket
    
    return {
      message: `🏛️ **Tax Optimization Strategy**:

💰 **Potential Tax Savings**: ₹${taxSavings.toLocaleString()}

📋 **Section 80C (₹1.5L limit)**:
• ELSS Mutual Funds: ₹50,000
• PPF: ₹50,000
• EPF: ₹50,000
• Life Insurance: ₹25,000
• Children's Education: ₹25,000

🏥 **Additional Deductions**:
• Health Insurance (80D): ₹25,000
• Home Loan Interest: ₹2L
• NPS: ₹50,000

💡 **Smart Tax Tips**:
• Start ELSS SIPs early in financial year
• Use NPS for additional ₹50K deduction
• Claim HRA if living in rented house
• File returns before due date`,
      suggestions: [
        'Start ELSS SIPs early',
        'Use NPS for additional deduction',
        'Claim HRA if applicable',
        'File returns on time'
      ],
      calculations: {
        potentialTaxSavings: taxSavings,
        section80CLimit: 150000,
        npsDeduction: 50000
      },
      nextSteps: [
        'Start ELSS mutual fund SIP',
        'Open NPS account',
        'Review HRA claims',
        'Plan tax-saving investments'
      ]
    };
  }

  private getGoalAdvice(context: FinancialContext): AIResponse {
    const activeGoals = context.goals.length;
    const completedGoals = context.goals.filter(g => g.currentAmount >= g.targetAmount).length;
    
    return {
      message: `🎯 **Goal Planning Analysis**:

📊 **Current Goals**: ${activeGoals} active, ${completedGoals} completed

💡 **Goal Setting Framework**:
• **Short-term** (1-3 years): Emergency fund, vacation
• **Medium-term** (3-7 years): Down payment, education
• **Long-term** (7+ years): Retirement, wealth building

📈 **Smart Goal Strategies**:
• Use SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound)
• Break large goals into smaller milestones
• Automate contributions to goal accounts
• Review and adjust goals quarterly
• Consider inflation in target amounts

💰 **Goal Funding**: Allocate 20% of savings to goals`,
      suggestions: [
        'Use SMART goal framework',
        'Break goals into milestones',
        'Automate goal contributions',
        'Review goals quarterly'
      ],
      nextSteps: [
        'Review current goals',
        'Set up goal-specific accounts',
        'Automate monthly contributions',
        'Track goal progress'
      ]
    };
  }

  private getRetirementAdvice(context: FinancialContext): AIResponse {
    const retirementAge = 60;
    const currentAge = 30; // Assuming average user age
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRetirementNeed = context.monthlyExpenses * 0.7; // 70% of current expenses
    const totalRetirementNeed = monthlyRetirementNeed * 12 * 25; // 25 years post-retirement
    
    return {
      message: `🌅 **Retirement Planning**:

⏰ **Time Horizon**: ${yearsToRetirement} years to retirement
💰 **Monthly Need**: ₹${monthlyRetirementNeed.toLocaleString()}
🎯 **Total Corpus**: ₹${totalRetirementNeed.toLocaleString()}

📈 **Investment Strategy**:
• **NPS**: ₹50,000 annually (tax benefits)
• **EPF**: Continue employer contributions
• **Mutual Funds**: ₹${Math.round(totalRetirementNeed / (yearsToRetirement * 12 * 1.1)).toLocaleString()} monthly SIP
• **Gold**: 5-10% allocation for stability

💡 **Retirement Tips**:
• Start early to benefit from compounding
• Increase SIP amount by 10% annually
• Consider international diversification
• Plan for healthcare costs
• Create passive income streams`,
      suggestions: [
        'Start retirement planning early',
        'Increase SIP amount annually',
        'Consider international diversification',
        'Plan for healthcare costs'
      ],
      calculations: {
        yearsToRetirement,
        monthlyRetirementNeed,
        totalRetirementNeed,
        monthlySIP: Math.round(totalRetirementNeed / (yearsToRetirement * 12 * 1.1))
      },
      nextSteps: [
        'Open NPS account',
        'Start retirement mutual fund SIP',
        'Review EPF contributions',
        'Plan healthcare insurance'
      ]
    };
  }

  private getInsuranceAdvice(context: FinancialContext): AIResponse {
    const lifeInsuranceNeed = context.monthlyIncome * 12 * 10; // 10 years income
    const healthInsuranceNeed = context.monthlyExpenses * 12 * 2; // 2 years expenses
    
    return {
      message: `🛡️ **Insurance Planning**:

💼 **Life Insurance Need**: ₹${lifeInsuranceNeed.toLocaleString()}
🏥 **Health Insurance Need**: ₹${healthInsuranceNeed.toLocaleString()}

📋 **Insurance Portfolio**:
• **Term Life**: ₹${lifeInsuranceNeed.toLocaleString()} (30-40 years term)
• **Health Insurance**: ₹${healthInsuranceNeed.toLocaleString()} (family floater)
• **Critical Illness**: ₹25L-50L
• **Disability**: ₹${(context.monthlyIncome * 12).toLocaleString()}

💡 **Insurance Tips**:
• Buy term insurance, not endowment
• Get family floater health insurance
• Consider riders for critical illness
• Review coverage every 3-5 years
• Don't mix insurance with investment`,
      suggestions: [
        'Buy term life insurance',
        'Get family floater health insurance',
        'Consider critical illness riders',
        'Review coverage regularly'
      ],
      calculations: {
        lifeInsuranceNeed,
        healthInsuranceNeed,
        disabilityCoverage: context.monthlyIncome * 12
      },
      nextSteps: [
        'Compare term life insurance quotes',
        'Research health insurance plans',
        'Consider critical illness coverage',
        'Review existing policies'
      ]
    };
  }

  private getGeneralAdvice(context: FinancialContext): AIResponse {
    return {
      message: `🤖 **Financial AI Assistant** at your service!

I can help you with:
📊 **Budgeting & Spending Analysis**
💰 **Savings Strategies & Emergency Funds**
📈 **Investment Planning & Portfolio Allocation**
💳 **Debt Management & Credit Optimization**
🏛️ **Tax Planning & Deductions**
🎯 **Goal Setting & Financial Planning**
🌅 **Retirement Planning**
🛡️ **Insurance & Protection**

💡 **Ask me anything** about your finances for personalized advice!

**Current Financial Snapshot**:
• Monthly Income: ₹${context.monthlyIncome.toLocaleString()}
• Monthly Expenses: ₹${context.monthlyExpenses.toLocaleString()}
• Savings Rate: ${context.savingsRate.toFixed(1)}%`,
      suggestions: [
        'Ask about budgeting strategies',
        'Get investment recommendations',
        'Plan for emergency fund',
        'Optimize tax savings'
      ],
      nextSteps: [
        'Set up financial goals',
        'Start tracking expenses',
        'Create emergency fund'
      ]
    };
  }
}

export const simpleAIService = new SimpleAIService(); 