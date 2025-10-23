const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const connectDB = require('./config/database');
const Income = require('./models/Income');
const Expense = require('./models/Expense');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Gemini AI configured');
} else {
  console.log('⚠️  Warning: GEMINI_API_KEY not found in .env file');
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Financial Flow Backend API',
    status: 'running',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat (POST)',
      income: {
        getAll: '/api/income/:userId (GET)',
        add: '/api/income/:userId (POST)',
        delete: '/api/income/:userId/:incomeId (DELETE)'
      },
      expenses: {
        getAll: '/api/expenses/:userId (GET)',
        add: '/api/expenses/:userId (POST)',
        delete: '/api/expenses/:userId/:expenseId (DELETE)'
      },
      analytics: {
        summary: '/api/analytics/:userId/summary (GET)',
        insights: '/api/analytics/:userId/insights (GET)'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    api_configured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ==================== INCOME ENDPOINTS ====================

// Get all income records
app.get('/api/income/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all income for user
    const allIncome = await Income.find({ userId }).sort({ createdAt: -1 });
    
    // Separate recurring and one-time
    const income = allIncome.filter(item => !item.isRecurring);
    const recurringIncome = allIncome.filter(item => item.isRecurring);
    
    // Calculate totals
    const totalIncome = allIncome.reduce((sum, item) => sum + item.amount, 0);
    const recurringTotal = recurringIncome.reduce((sum, item) => sum + item.amount, 0);
    
    res.json({
      success: true,
      income,
      recurringIncome,
      totalIncome,
      recurringTotal,
      monthlyProjected: recurringTotal
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add income record
app.post('/api/income/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { source, amount, category, date, isRecurring, frequency } = req.body;
    
    if (!source || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid income data' });
    }
    
    const incomeRecord = new Income({
      userId,
      source,
      amount: parseFloat(amount),
      category: category || 'Other',
      date: date || new Date(),
      isRecurring: isRecurring || false,
      frequency: frequency || 'monthly'
    });
    
    await incomeRecord.save();
    
    res.json({
      success: true,
      message: 'Income added successfully',
      income: incomeRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete income record
app.delete('/api/income/:userId/:incomeId', async (req, res) => {
  try {
    const { userId, incomeId } = req.params;
    
    await Income.findOneAndDelete({ _id: incomeId, userId });
    
    res.json({
      success: true,
      message: 'Income deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== EXPENSE ENDPOINTS ====================

// Get all expense records
app.get('/api/expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all expenses for user
    const allExpenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    
    // Separate recurring and one-time
    const expenses = allExpenses.filter(item => !item.isRecurring);
    const recurringExpenses = allExpenses.filter(item => item.isRecurring);
    
    // Calculate totals
    const totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    const recurringTotal = recurringExpenses.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate category breakdown
    const categoryBreakdown = {};
    allExpenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });
    
    res.json({
      success: true,
      expenses,
      recurringExpenses,
      totalExpenses,
      recurringTotal,
      monthlyProjected: recurringTotal,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add expense record
app.post('/api/expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, amount, category, date, isRecurring, frequency } = req.body;
    
    if (!description || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid expense data' });
    }
    
    const expenseRecord = new Expense({
      userId,
      description,
      amount: parseFloat(amount),
      category: category || 'Other',
      date: date || new Date(),
      isRecurring: isRecurring || false,
      frequency: frequency || 'monthly'
    });
    
    await expenseRecord.save();
    
    res.json({
      success: true,
      message: 'Expense added successfully',
      expense: expenseRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete expense record
app.delete('/api/expenses/:userId/:expenseId', async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    
    await Expense.findOneAndDelete({ _id: expenseId, userId });
    
    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Get financial summary
app.get('/api/analytics/:userId/summary', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all income and expenses
    const allIncome = await Income.find({ userId });
    const allExpenses = await Expense.find({ userId });
    
    // Separate recurring and one-time
    const income = allIncome.filter(item => !item.isRecurring);
    const recurringIncome = allIncome.filter(item => item.isRecurring);
    const expenses = allExpenses.filter(item => !item.isRecurring);
    const recurringExpenses = allExpenses.filter(item => item.isRecurring);
    
    // Calculate totals
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalRecurringIncome = recurringIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalRecurringExpenses = recurringExpenses.reduce((sum, item) => sum + item.amount, 0);
    
    const monthlyIncome = totalRecurringIncome;
    const monthlyExpenses = totalRecurringExpenses;
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
    
    res.json({
      success: true,
      summary: {
        totalIncome: totalIncome + totalRecurringIncome,
        totalExpenses: totalExpenses + totalRecurringExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        savingsRate: savingsRate.toFixed(2),
        netWorth: (totalIncome + totalRecurringIncome) - (totalExpenses + totalRecurringExpenses)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get spending insights
app.get('/api/analytics/:userId/insights', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all expenses
    const allExpenses = await Expense.find({ userId });
    const totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    
    // Category analysis
    const categoryTotals = {};
    allExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const topCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : '0'
      }));
    
    // Generate insights
    const insights = [];
    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      insights.push(`Your highest spending is on ${topCategory.category} (${topCategory.percentage}% of total)`);
    }
    
    const recurringExpenses = allExpenses.filter(item => item.isRecurring);
    const recurringTotal = recurringExpenses.reduce((sum, item) => sum + item.amount, 0);
    if (recurringTotal > 0) {
      insights.push(`You have ₹${recurringTotal.toLocaleString()} in recurring monthly expenses`);
    }
    
    res.json({
      success: true,
      insights: {
        topCategories,
        totalExpenses,
        insights,
        expenseCount: allExpenses.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat endpoint for AI interactions
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to .env file'
      });
    }

    // Build prompt with financial context
    const prompt = `You are a professional financial advisor specializing in personal finance. 

User's Question: "${message}"

Financial Context:
- Monthly Income: ₹${context?.monthlyIncome || 0}
- Monthly Expenses: ₹${context?.monthlyExpenses || 0}
- Savings Rate: ${context?.savingsRate || 0}%

Please provide:
1. A comprehensive, personalized response
2. Specific actionable recommendations
3. Practical next steps

Format your response with clear sections and use emojis where appropriate. Focus on Indian financial context.`;

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    // Parse suggestions from response
    const suggestions = [];
    const lines = aiMessage.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        suggestions.push(line.trim().replace(/^[•\-*]\s*/, ''));
      }
    }

    res.json({
      success: true,
      message: aiMessage,
      suggestions: suggestions.slice(0, 4), // Top 4 suggestions
      nextSteps: suggestions.slice(0, 3), // Top 3 as next steps
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your request'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      chat: '/api/chat (POST)'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Financial Flow Backend Server');
  console.log('========================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log('========================================\n');
});
