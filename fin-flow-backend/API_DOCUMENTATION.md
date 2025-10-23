# Financial Flow Backend API Documentation

## Overview
Enhanced backend API with comprehensive income and expense management features.

**Base URL**: `http://localhost:5001`  
**Version**: 2.0.0

---

## 📋 Table of Contents
1. [Income Endpoints](#income-endpoints)
2. [Expense Endpoints](#expense-endpoints)
3. [Analytics Endpoints](#analytics-endpoints)
4. [Chat Endpoint](#chat-endpoint)
5. [Usage Examples](#usage-examples)

---

## 💰 Income Endpoints

### Get All Income Records
```
GET /api/income/:userId
```

**Response:**
```json
{
  "success": true,
  "income": [
    {
      "id": "1234567890",
      "source": "Salary",
      "amount": 50000,
      "category": "Employment",
      "date": "2025-10-23T00:00:00.000Z",
      "isRecurring": true,
      "frequency": "monthly",
      "createdAt": "2025-10-23T14:00:00.000Z"
    }
  ],
  "recurringIncome": [],
  "totalIncome": 50000,
  "recurringTotal": 50000,
  "monthlyProjected": 50000
}
```

### Add Income Record
```
POST /api/income/:userId
```

**Request Body:**
```json
{
  "source": "Freelance Project",
  "amount": 15000,
  "category": "Freelancing",
  "date": "2025-10-23",
  "isRecurring": false,
  "frequency": "one-time"
}
```

### Delete Income Record
```
DELETE /api/income/:userId/:incomeId
```

---

## 💳 Expense Endpoints

### Get All Expense Records
```
GET /api/expenses/:userId
```

**Response:**
```json
{
  "success": true,
  "expenses": [],
  "recurringExpenses": [],
  "totalExpenses": 5000,
  "recurringTotal": 0,
  "monthlyProjected": 0,
  "categoryBreakdown": {
    "Food": 5000,
    "Transport": 2000
  }
}
```

### Add Expense Record
```
POST /api/expenses/:userId
```

**Request Body:**
```json
{
  "description": "Netflix Subscription",
  "amount": 649,
  "category": "Entertainment",
  "isRecurring": true,
  "frequency": "monthly"
}
```

### Delete Expense Record
```
DELETE /api/expenses/:userId/:expenseId
```

---

## 📊 Analytics Endpoints

### Get Financial Summary
```
GET /api/analytics/:userId/summary
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalIncome": 65000,
    "totalExpenses": 35000,
    "monthlyIncome": 50000,
    "monthlyExpenses": 25000,
    "monthlySavings": 25000,
    "savingsRate": "50.00",
    "netWorth": 30000
  }
}
```

### Get Spending Insights
```
GET /api/analytics/:userId/insights
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "topCategories": [
      {
        "category": "Food",
        "amount": 12000,
        "percentage": "34.3"
      }
    ],
    "totalExpenses": 35000,
    "insights": [
      "Your highest spending is on Food (34.3% of total)"
    ],
    "expenseCount": 15
  }
}
```

---

## 💬 Chat Endpoint

### Send Chat Message (AI Financial Advisor)
```
POST /api/chat
```

**Request Body:**
```json
{
  "message": "How can I save more money?",
  "context": {
    "monthlyIncome": 50000,
    "monthlyExpenses": 35000,
    "savingsRate": 30
  }
}
```

---

## 🔧 Usage Examples

### JavaScript/TypeScript Example

```typescript
import { financeService } from './services/financeService';

// Add income
await financeService.addIncome({
  source: 'Salary',
  amount: 50000,
  category: 'Employment',
  isRecurring: true,
  frequency: 'monthly'
});

// Get financial summary
const summary = await financeService.getFinancialSummary();
console.log(summary);

// Add expense
await financeService.addExpense({
  description: 'Grocery Shopping',
  amount: 5000,
  category: 'Food'
});

// Get spending insights
const insights = await financeService.getSpendingInsights();
console.log(insights);
```

### cURL Examples

```bash
# Add income
curl -X POST http://localhost:5001/api/income/user123 \
  -H "Content-Type: application/json" \
  -d '{"source":"Salary","amount":50000,"category":"Employment","isRecurring":true}'

# Get expenses
curl http://localhost:5001/api/expenses/user123

# Get financial summary
curl http://localhost:5001/api/analytics/user123/summary

# Get spending insights
curl http://localhost:5001/api/analytics/user123/insights
```

---

## 📝 Categories

### Income Categories
- Employment
- Freelancing
- Business
- Investment
- Rental
- Other

### Expense Categories
- Food
- Transport
- Housing
- Entertainment
- Healthcare
- Education
- Shopping
- Bills
- Other

### Frequency Options
- `one-time` - Single transaction
- `daily` - Daily recurring
- `weekly` - Weekly recurring
- `monthly` - Monthly recurring (default)
- `yearly` - Yearly recurring

---

## 🚀 Getting Started

1. **Start the backend server:**
   ```bash
   cd fin-flow-backend
   npm start
   ```

2. **Server will run on:** `http://localhost:5001`

3. **Test the API:**
   ```bash
   curl http://localhost:5001/
   ```

4. **Use in frontend:**
   ```typescript
   import { financeService } from './services/financeService';
   
   // The service is ready to use!
   const summary = await financeService.getFinancialSummary();
   ```

---

## ⚠️ Important Notes

- **Data Storage**: Currently using in-memory storage. Data is lost when server restarts.
- **User ID**: Default user ID is 'default-user'. Can be changed via `financeService.setUserId()`
- **No Authentication**: This is a development version. Add authentication for production.
- **CORS**: Enabled for all origins. Restrict in production.

---

## 🎯 Features Added

✅ **Income Management**
- Add one-time or recurring income
- Track multiple income sources
- Calculate monthly projections

✅ **Expense Management**
- Add one-time or recurring expenses
- Categorize expenses
- Track spending patterns

✅ **Analytics**
- Financial summary with savings rate
- Spending insights by category
- Top spending categories
- Net worth calculation

✅ **AI Chatbot** (Existing)
- Financial advice powered by Gemini AI
- Context-aware responses
- Personalized recommendations

---

## 📚 Next Steps for Production

- [ ] Add database integration (MongoDB/PostgreSQL)
- [ ] Add user authentication (JWT)
- [ ] Add data validation middleware
- [ ] Add rate limiting
- [ ] Add unit tests
- [ ] Add budget tracking
- [ ] Add goal tracking
- [ ] Add export functionality (CSV, PDF)
