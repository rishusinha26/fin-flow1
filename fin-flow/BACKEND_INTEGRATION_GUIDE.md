# Backend Integration Guide - Enhanced Income & Expense Features

## 🎉 What's New

Your Financial Flow app now has a powerful backend API that makes income and expense tracking more functional!

### New Features Added:
✅ **Income Management** - Track one-time and recurring income  
✅ **Expense Management** - Track one-time and recurring expenses  
✅ **Financial Analytics** - Get insights and summaries  
✅ **Spending Insights** - See top spending categories  
✅ **Backend Storage** - Data persists during session  

**Important**: Chatbot and all existing frontend features remain unchanged! ✨

---

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd fin-flow-backend
npm start
```

You should see:
```
✅ Gemini AI configured
🚀 Financial Flow Backend Server
📡 Server running on: http://localhost:5001
```

### 2. Backend is Ready!

The backend is now running with these endpoints:
- Income management: `/api/income/:userId`
- Expense management: `/api/expenses/:userId`
- Analytics: `/api/analytics/:userId/summary`
- Insights: `/api/analytics/:userId/insights`
- Chat (existing): `/api/chat`

---

## 💻 How to Use in Frontend

### Import the Service

```typescript
import { financeService } from './services/financeService';
```

### Add Income

```typescript
const addIncome = async () => {
  const result = await financeService.addIncome({
    source: 'Salary',
    amount: 50000,
    category: 'Employment',
    isRecurring: true,
    frequency: 'monthly'
  });
  
  if (result.success) {
    console.log('Income added!', result.income);
  }
};
```

### Add Expense

```typescript
const addExpense = async () => {
  const result = await financeService.addExpense({
    description: 'Grocery Shopping',
    amount: 5000,
    category: 'Food',
    isRecurring: false
  });
  
  if (result.success) {
    console.log('Expense added!', result.expense);
  }
};
```

### Get Financial Summary

```typescript
const getSummary = async () => {
  const summary = await financeService.getFinancialSummary();
  
  console.log('Monthly Income:', summary.monthlyIncome);
  console.log('Monthly Expenses:', summary.monthlyExpenses);
  console.log('Savings Rate:', summary.savingsRate + '%');
  console.log('Net Worth:', summary.netWorth);
};
```

### Get Spending Insights

```typescript
const getInsights = async () => {
  const insights = await financeService.getSpendingInsights();
  
  console.log('Top Categories:', insights.topCategories);
  console.log('Insights:', insights.insights);
};
```

### Get All Income

```typescript
const getIncome = async () => {
  const data = await financeService.getIncome();
  
  console.log('One-time Income:', data.income);
  console.log('Recurring Income:', data.recurringIncome);
  console.log('Total:', data.totalIncome);
};
```

### Get All Expenses

```typescript
const getExpenses = async () => {
  const data = await financeService.getExpenses();
  
  console.log('One-time Expenses:', data.expenses);
  console.log('Recurring Expenses:', data.recurringExpenses);
  console.log('Category Breakdown:', data.categoryBreakdown);
};
```

### Delete Income/Expense

```typescript
// Delete income
await financeService.deleteIncome('income-id-here');

// Delete expense
await financeService.deleteExpense('expense-id-here');
```

---

## 🎨 Example: Create an Income Form Component

```typescript
import { useState } from 'react';
import { financeService } from '../services/financeService';

function AddIncomeForm() {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await financeService.addIncome({
      source,
      amount: parseFloat(amount),
      category: 'Employment',
      isRecurring,
      frequency: isRecurring ? 'monthly' : 'one-time'
    });

    if (result.success) {
      alert('Income added successfully!');
      setSource('');
      setAmount('');
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Income Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        Recurring Monthly
      </label>
      <button type="submit">Add Income</button>
    </form>
  );
}
```

---

## 📊 Example: Display Financial Summary

```typescript
import { useEffect, useState } from 'react';
import { financeService, FinancialSummary } from '../services/financeService';

function FinancialSummaryCard() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const data = await financeService.getFinancialSummary();
    setSummary(data);
  };

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="summary-card">
      <h2>Financial Summary</h2>
      <div>
        <p>Monthly Income: ₹{summary.monthlyIncome.toLocaleString()}</p>
        <p>Monthly Expenses: ₹{summary.monthlyExpenses.toLocaleString()}</p>
        <p>Monthly Savings: ₹{summary.monthlySavings.toLocaleString()}</p>
        <p>Savings Rate: {summary.savingsRate}%</p>
        <p>Net Worth: ₹{summary.netWorth.toLocaleString()}</p>
      </div>
    </div>
  );
}
```

---

## 🔑 Categories Available

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

---

## ⚙️ Configuration

### Change User ID (Optional)

By default, the service uses `'default-user'` as the user ID. To change it:

```typescript
import { financeService } from './services/financeService';

// Set custom user ID
financeService.setUserId('user-123');
```

### Change Backend URL (Optional)

Set in your `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5001
```

---

## 🛡️ Error Handling

The service handles errors gracefully:

```typescript
const result = await financeService.addIncome({
  source: 'Salary',
  amount: 50000
});

if (result.success) {
  // Success!
  console.log('Added:', result.income);
} else {
  // Error occurred
  console.error('Error:', result.error);
}
```

If backend is unavailable, methods return empty data instead of crashing:

```typescript
const data = await financeService.getIncome();
// Returns empty arrays if backend is down
console.log(data.income); // []
```

---

## 📝 Important Notes

### Data Persistence
- Data is stored **in-memory** on the backend
- Data is **lost when server restarts**
- For production, integrate a database (MongoDB, PostgreSQL, etc.)

### No Authentication
- Currently no user authentication
- All data is public to anyone with the user ID
- Add authentication before deploying to production

### Existing Features Unchanged
- ✅ Chatbot works exactly as before
- ✅ All frontend components unchanged
- ✅ Firebase integration unchanged
- ✅ UI/UX remains the same

---

## 🎯 Next Steps

### Immediate Use
1. Start the backend server
2. Import `financeService` in your components
3. Use the methods to add/get income and expenses
4. Display data in your UI

### Future Enhancements
- Add database integration
- Add user authentication
- Create UI components for income/expense forms
- Add charts and visualizations
- Add budget tracking
- Add goal tracking
- Add export functionality

---

## 🐛 Troubleshooting

### Backend not connecting?
- Check if backend is running on port 5001
- Check console for CORS errors
- Verify `VITE_BACKEND_URL` in `.env`

### Data not persisting?
- This is expected! Data is in-memory
- Restart backend = data is lost
- Add database for persistence

### Getting empty data?
- Backend might be down
- Service returns empty arrays as fallback
- Check backend console for errors

---

## 📚 Documentation

Full API documentation: `fin-flow-backend/API_DOCUMENTATION.md`

---

## ✨ Summary

You now have a fully functional backend API for income and expense management! The chatbot and all existing features continue to work without any changes. Start building your UI components to interact with these new endpoints!

**Happy Coding! 🚀**
