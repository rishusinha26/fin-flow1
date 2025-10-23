// AI Service for Financial Advice
// This service can be integrated with real AI APIs like Google Gemini, OpenAI, etc.

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

class AIService {
  private apiKey: string | null = null;
  private useRealAI: boolean = false;

  constructor() {
    // Check if API key is available (Vite uses import.meta.env)
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                  import.meta.env.VITE_OPENAI_API_KEY || 
                  null;
    this.useRealAI = !!this.apiKey;
    
    // Debug logging
    console.log('AI Service initialized');
    console.log('Gemini API Key available:', !!import.meta.env.VITE_GEMINI_API_KEY);
    console.log('Using Real AI:', this.useRealAI);
  }

  async getFinancialAdvice(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    // Try backend first (if available)
    try {
      const backendResponse = await this.callBackend(userMessage, context);
      if (backendResponse) {
        console.log('✅ Using backend API');
        return backendResponse;
      }
    } catch (error) {
      console.log('⚠️ Backend not available, trying alternatives...');
    }
    
    // Fallback to direct API if available, otherwise use local AI
    if (this.useRealAI && this.apiKey) {
      return this.getRealAIResponse(userMessage, context);
    } else {
      return this.getLocalAIResponse(userMessage, context);
    }
  }

  private async callBackend(userMessage: string, context: FinancialContext): Promise<AIResponse | null> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            monthlyIncome: context.monthlyIncome,
            monthlyExpenses: context.monthlyExpenses,
            savingsRate: context.savingsRate
          }
        })
      });

      if (!response.ok) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          message: data.message,
          suggestions: data.suggestions || [],
          calculations: {},
          nextSteps: data.nextSteps || []
        };
      }
      
      return null;
    } catch (error) {
      // Backend not running, return null to try other methods
      return null;
    }
  }

  private async getRealAIResponse(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    try {
      // Try Gemini first, then fallback to OpenAI
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        return await this.callGeminiAPI(userMessage, context);
      } else if (import.meta.env.VITE_OPENAI_API_KEY) {
        return await this.callOpenAIAPI(userMessage, context);
      }
    } catch (error) {
      console.error('AI API call failed, falling back to local AI:', error);
    }
    
    return this.getLocalAIResponse(userMessage, context);
  }

  private async callGeminiAPI(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    console.log('Calling Gemini API...');
    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error Details:', errorData);
      console.error('Status:', response.status);
      console.error('API Key (first 10 chars):', this.apiKey?.substring(0, 10));
      throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const aiMessage = data.candidates[0].content.parts[0].text;
    
    return this.parseAIResponse(aiMessage);
  }

  private async callOpenAIAPI(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional financial advisor specializing in Indian personal finance. Provide practical, actionable advice based on the user\'s financial context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    return this.parseAIResponse(aiMessage);
  }

  private buildPrompt(userMessage: string, context: FinancialContext): string {
    return `You are a professional financial advisor. The user has asked: "${userMessage}"

User's Financial Context:
- Monthly Income: ₹${context.monthlyIncome.toLocaleString()}
- Monthly Expenses: ₹${context.monthlyExpenses.toLocaleString()}
- Savings Rate: ${context.savingsRate.toFixed(1)}%

Top Expense Categories:
${context.expenses.slice(0, 3).map(exp => `- ${exp.category}: ₹${exp.amount.toLocaleString()}`).join('\n')}

Current Goals:
${context.goals.map(goal => `- ${goal.name}: ₹${goal.currentAmount.toLocaleString()}/${goal.targetAmount.toLocaleString()} (${goal.priority} priority)`).join('\n')}

Investments:
${context.investments.map(inv => `- ${inv.name}: ₹${inv.amount.toLocaleString()} (${inv.type})`).join('\n')}

Please provide:
1. A comprehensive, personalized response
2. Specific actionable recommendations
3. Calculations based on their financial data
4. Next steps they should take

Format your response with emojis and clear sections. Focus on Indian financial context, tax benefits, and local investment options.`;
  }

  private parseAIResponse(aiMessage: string): AIResponse {
    // Parse AI response and extract structured data
    const suggestions = aiMessage.match(/•\s*(.+)/g)?.map(s => s.replace('• ', '')) || [];
    const calculations: Record<string, number> = {};
    
    // Extract numbers with ₹ symbol
    const amountMatches = aiMessage.match(/₹([0-9,]+)/g);
    if (amountMatches) {
      amountMatches.forEach((match, index) => {
        const amount = parseInt(match.replace(/[₹,]/g, ''));
        calculations[`amount_${index}`] = amount;
      });
    }

    return {
      message: aiMessage,
      suggestions,
      calculations,
      nextSteps: suggestions.slice(0, 3) // First 3 suggestions as next steps
    };
  }

  private getLocalAIResponse(userMessage: string, context: FinancialContext): AIResponse {
    const message = userMessage.toLowerCase();
    
    // General finance questions
    if (message.includes('what is finance') || message.includes('define finance')) {
      return {
        message: `💰 **What is Finance?**

Finance is the management of money and includes activities like investing, borrowing, lending, budgeting, saving, and forecasting. It's about making smart decisions with your money to achieve your financial goals.

🎯 **Key Areas**:
• **Personal Finance**: Managing your income, expenses, savings, and investments
• **Corporate Finance**: How businesses manage their money
• **Public Finance**: Government spending and taxation

💡 **Why It Matters**:
Finance helps you build wealth, achieve goals, and secure your future through smart money management.`,
        suggestions: [
          'Learn about budgeting basics',
          'Understand investment options',
          'Start emergency fund planning',
          'Explore tax-saving strategies'
        ],
        nextSteps: [
          'Track your monthly expenses',
          'Set financial goals',
          'Start saving regularly'
        ]
      };
    }
    else if (message.includes('compound interest') || message.includes('compounding')) {
      return {
        message: `📈 **Compound Interest Explained**

Compound interest is "interest on interest" - you earn returns not just on your initial investment, but also on the interest you've already earned.

🔢 **Example**:
• Invest ₹10,000 at 10% annual interest
• Year 1: ₹10,000 + ₹1,000 = ₹11,000
• Year 2: ₹11,000 + ₹1,100 = ₹12,100
• Year 3: ₹12,100 + ₹1,210 = ₹13,310

💡 **The Power of Time**:
The longer you invest, the more powerful compounding becomes. Starting early is key!

🎯 **Albert Einstein** called it "the eighth wonder of the world."`,
        suggestions: [
          'Start investing early to maximize compounding',
          'Consider SIPs for regular investing',
          'Reinvest dividends for better returns',
          'Focus on long-term investments'
        ],
        nextSteps: [
          'Open investment account',
          'Start monthly SIP',
          'Set long-term financial goals'
        ]
      };
    }
    else if (message.includes('what is sip') || message.includes('sip') || message.includes('systematic investment')) {
      return {
        message: `📊 **What is SIP (Systematic Investment Plan)?**

SIP is a method of investing a fixed amount regularly (monthly/quarterly) in mutual funds. It's like a recurring deposit but for investments!

💰 **How It Works**:
• Choose a mutual fund
• Decide investment amount (e.g., ₹1,000/month)
• Set auto-debit from your bank
• Units are purchased automatically every month

🎯 **Benefits**:
• **Rupee Cost Averaging**: Buy more units when prices are low, fewer when high
• **Disciplined Investing**: Automated, no need to remember
• **Power of Compounding**: Long-term wealth creation
• **Flexibility**: Start with as low as ₹500/month
• **No Market Timing**: Invest regardless of market conditions

📈 **Example**:
₹5,000/month SIP for 10 years at 12% returns = ₹11.6 lakhs (Investment: ₹6 lakhs)

💡 **Best For**: Salaried individuals, beginners, long-term goals`,
        suggestions: [
          'Start with ₹1,000-2,000 monthly SIP',
          'Choose index funds or ELSS for tax benefits',
          'Increase SIP amount annually by 10%',
          'Continue for minimum 5 years'
        ],
        nextSteps: [
          'Open demat account or mutual fund account',
          'Complete KYC verification',
          'Set up auto-debit mandate'
        ]
      };
    }
    else if (message.includes('mutual fund') || message.includes('mutual funds')) {
      return {
        message: `🏦 **What are Mutual Funds?**

Mutual funds pool money from multiple investors to invest in stocks, bonds, or other securities. Managed by professional fund managers.

📊 **Types of Mutual Funds**:

**1. Equity Funds** 📈
• Invest in stocks
• High risk, high returns (12-15% annually)
• Best for long-term (5+ years)

**2. Debt Funds** 💰
• Invest in bonds, government securities
• Low risk, stable returns (6-8% annually)
• Best for short to medium term

**3. Hybrid Funds** ⚖️
• Mix of equity and debt
• Balanced risk-return
• Good for moderate risk-takers

**4. Index Funds** 📊
• Track market indices (Nifty 50, Sensex)
• Low expense ratio (0.1-0.5%)
• Passive management

**5. ELSS (Tax Saving)** 💸
• Equity-linked savings scheme
• Tax deduction up to ₹1.5 lakh (Section 80C)
• 3-year lock-in period

💡 **Why Invest in Mutual Funds?**:
• Professional management
• Diversification (reduces risk)
• Low minimum investment (₹500)
• High liquidity (can sell anytime)
• Tax benefits (ELSS)

🎯 **Recommended for Beginners**:
• Index Funds (Nifty 50)
• ELSS for tax saving
• Balanced Advantage Funds`,
        suggestions: [
          'Start with index funds for low cost',
          'Invest in ELSS for tax benefits',
          'Diversify across 3-4 funds',
          'Review portfolio quarterly'
        ],
        nextSteps: [
          'Open mutual fund account',
          'Complete KYC process',
          'Start SIP in 2-3 funds'
        ]
      };
    }
    else if (message.includes('tax benefit') || message.includes('tax saving') || message.includes('80c') || message.includes('tax deduction')) {
      return {
        message: `💸 **Tax Benefits & Savings in India**

Save taxes legally and build wealth simultaneously!

🎯 **Section 80C (Up to ₹1.5 Lakh Deduction)**:
• **ELSS Mutual Funds** - Best returns (12-15%)
• **PPF** - Safe, 7.1% interest, 15-year lock-in
• **EPF** - Employer contribution, 8.25% interest
• **Life Insurance** - Premium up to ₹1.5L
• **NSC** - National Savings Certificate
• **Tax Saver FD** - 5-year lock-in
• **Home Loan Principal** - Repayment amount
• **Tuition Fees** - Children's education

💰 **Section 80D (Health Insurance)**:
• Self & family: ₹25,000 deduction
• Parents (below 60): ₹25,000
• Parents (above 60): ₹50,000
• Total possible: ₹1 lakh deduction

🏠 **Section 24 (Home Loan Interest)**:
• Up to ₹2 lakh deduction on interest paid
• Additional to 80C principal deduction

📊 **Section 80CCD(1B) (NPS)**:
• Extra ₹50,000 deduction
• Over and above 80C limit
• Total tax saving: ₹2 lakh (80C + NPS)

💡 **Smart Tax Planning**:
• ELSS: ₹1.5 lakh (80C)
• NPS: ₹50,000 (80CCD1B)
• Health Insurance: ₹25,000 (80D)
• Home Loan Interest: ₹2 lakh (24)
• **Total Deduction: ₹4.25 lakh!**

🎯 **Tax Saved** (30% bracket):
₹4.25 lakh × 30% = **₹1.27 lakh saved annually!**`,
        suggestions: [
          'Invest ₹1.5L in ELSS for 80C',
          'Add ₹50K in NPS for extra deduction',
          'Take health insurance for family',
          'Plan home loan for interest benefit'
        ],
        nextSteps: [
          'Calculate your tax liability',
          'Invest in ELSS before March 31',
          'Buy health insurance'
        ]
      };
    }
    else if (message.includes('income') || message.includes('salary') || message.includes('earning')) {
      return {
        message: `💰 **Understanding Income & Income Sources**

Income is money you receive regularly from various sources. Managing it well is key to financial success!

📊 **Types of Income**:

**1. Active Income** 💼
• Salary/Wages from job
• Business profits
• Freelancing income
• Consulting fees
• Requires active work

**2. Passive Income** 🌟
• Rental income from property
• Dividend from stocks/mutual funds
• Interest from FD/bonds
• Royalties from books/patents
• Requires initial investment

**3. Portfolio Income** 📈
• Capital gains from stocks
• Mutual fund returns
• Real estate appreciation
• From investments

💡 **Income Management Tips**:

**50/30/20 Rule**:
• **50%** - Needs (rent, food, utilities)
• **30%** - Wants (entertainment, dining)
• **20%** - Savings & Investments

**Smart Income Allocation**:
• Emergency Fund: 6 months expenses
• Insurance: 10-15% of income
• Investments: 20-30% of income
• Debt Repayment: Max 40% of income

🎯 **Increase Your Income**:
• Upskill for promotions
• Start side hustle/freelancing
• Invest for passive income
• Negotiate salary annually
• Create multiple income streams

📈 **Income Tax Slabs (New Regime)**:
• Up to ₹3 lakh: 0%
• ₹3-7 lakh: 5%
• ₹7-10 lakh: 10%
• ₹10-12 lakh: 15%
• ₹12-15 lakh: 20%
• Above ₹15 lakh: 30%

💸 **Your Current Status**:
• Monthly Income: ₹${context.monthlyIncome.toLocaleString()}
• Monthly Expenses: ₹${context.monthlyExpenses.toLocaleString()}
• Savings Rate: ${context.savingsRate.toFixed(1)}%`,
        suggestions: [
          'Follow 50/30/20 budgeting rule',
          'Build emergency fund first',
          'Invest 20% of income regularly',
          'Create additional income sources'
        ],
        nextSteps: [
          'Track all income sources',
          'Set up automatic savings',
          'Start investment SIPs'
        ]
      };
    }
    else if (message.includes('budget') || message.includes('spending') || message.includes('expense')) {
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
    else if (message.includes('invest') || message.includes('investment')) {
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
    else {
      return {
        message: `🤖 **Financial AI Assistant** at your service!

I can help you with:
📊 **Budgeting & Spending Analysis**
💰 **Savings Strategies & Emergency Funds**
📈 **Investment Planning & Portfolio Allocation**
💳 **Debt Management & Credit Optimization**
🏛️ **Tax Planning & Deductions**
🎯 **Goal Setting & Financial Planning**

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

  // Method to set API key dynamically
  setAPIKey(apiKey: string, provider: 'gemini' | 'openai') {
    this.apiKey = apiKey;
    this.useRealAI = true;
    // Note: In Vite, environment variables are read-only at build time
    // For dynamic API keys, they should be stored in localStorage or state
    localStorage.setItem('api-key', apiKey);
    localStorage.setItem('api-provider', provider);
  }

  // Method to check if real AI is available
  isRealAIAvailable(): boolean {
    return this.useRealAI && !!localStorage.getItem('api-key') && !!localStorage.getItem('api-provider');
  }
}

export const aiService = new AIService(); 