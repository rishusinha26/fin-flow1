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
    // Check if API key is available
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY || 
                  process.env.REACT_APP_OPENAI_API_KEY || 
                  null;
    this.useRealAI = !!this.apiKey;
  }

  async getFinancialAdvice(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    if (this.useRealAI && this.apiKey) {
      return this.getRealAIResponse(userMessage, context);
    } else {
      return this.getLocalAIResponse(userMessage, context);
    }
  }

  private async getRealAIResponse(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    try {
      // Try Gemini first, then fallback to OpenAI
      if (process.env.REACT_APP_GEMINI_API_KEY) {
        return await this.callGeminiAPI(userMessage, context);
      } else if (process.env.REACT_APP_OPENAI_API_KEY) {
        return await this.callOpenAIAPI(userMessage, context);
      }
    } catch (error) {
      console.error('AI API call failed, falling back to local AI:', error);
    }
    
    return this.getLocalAIResponse(userMessage, context);
  }

  private async callGeminiAPI(userMessage: string, context: FinancialContext): Promise<AIResponse> {
    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
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

    const data = await response.json();
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
    
    if (message.includes('budget') || message.includes('spending') || message.includes('expense')) {
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
    
    if (provider === 'gemini') {
      process.env.REACT_APP_GEMINI_API_KEY = apiKey;
    } else {
      process.env.REACT_APP_OPENAI_API_KEY = apiKey;
    }
  }

  // Method to check if real AI is available
  isRealAIAvailable(): boolean {
    return this.useRealAI;
  }
}

export const aiService = new AIService(); 