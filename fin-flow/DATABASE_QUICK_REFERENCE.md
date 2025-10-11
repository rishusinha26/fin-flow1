# 🚀 Realtime Database Quick Reference

## ⚡ Setup (3 Steps)

### 1. Enable in Firebase Console
```
Firebase Console → Realtime Database → Create Database → Test Mode
```

### 2. Add to .env
```env
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

### 3. Restart Server
```bash
npm run dev
```

---

## 💻 Usage

### Import Hook
```typescript
import { useRealtimeIncomes } from '@/hooks/useRealtimeDatabase';
```

### Use in Component
```typescript
function MyComponent() {
  const { incomes, addIncome, loading } = useRealtimeIncomes();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{incomes.length} incomes</div>;
}
```

---

## 🎯 Available Hooks

| Hook | Purpose |
|------|---------|
| `useRealtimeIncomes()` | Income management |
| `useRealtimeExpenses()` | Expense tracking |
| `useRealtimeInvestments()` | Investment portfolio |
| `useRealtimeGoals()` | Goal tracking |

---

## 📝 Common Operations

### Add Data
```typescript
await addIncome({ name: 'Salary', amount: 50000, frequency: 'monthly' });
```

### Update Data
```typescript
await modifyIncome(incomeId, { amount: 55000 });
```

### Delete Data
```typescript
await removeIncome(incomeId);
```

---

## 🔒 Security Rules (Production)

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
```

---

## 📚 Full Documentation

See `REALTIME_DATABASE_GUIDE.md` for complete details!
