# 🚀 Zen-Fi Quick Setup Guide

## Prerequisites
- Node.js v16 or higher
- npm or yarn
- Firebase account (free tier works)

---

## 🔥 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd zen-fi
npm install
```

### Step 2: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Email/Password** and **Google**
4. Get your Firebase config from Project Settings

### Step 3: Environment Variables

Create `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 4: Run the App
```bash
npm run dev
```

Visit: `http://localhost:8080`

---

## 🎯 First Time User Guide

### 1. **Create Account**
- Click "Sign Up" on auth page
- Enter name, email, password
- Or use "Continue with Google"

### 2. **Set Up Income**
- Navigate to Dashboard
- Click "Manage Income" or go to `/income`
- Add your income sources
- Set frequency (monthly, yearly, etc.)

### 3. **Add Expenses**
- Use the **floating + button** (bottom-right) for quick entry
- Or import CSV from Dashboard
- Categorize your expenses

### 4. **Track Subscriptions**
- Go to `/subscriptions`
- Add Netflix, Spotify, etc.
- Set renewal reminders

### 5. **Manage Debt** (if applicable)
- Go to `/debt`
- Add credit cards, loans
- Choose payoff strategy (Snowball or Avalanche)

### 6. **Set Goals**
- Go to `/goals`
- Create savings goals
- Track progress

### 7. **View Analytics**
- Go to `/analytics`
- See spending trends
- Check forecasts

### 8. **Earn Achievements**
- Go to `/achievements`
- Track your level and XP
- Unlock badges

### 9. **Learn**
- Go to `/education`
- Read financial articles
- Check FAQ section

---

## 🎨 Customization

### Dark Mode
- Click moon/sun icon in top-right
- Theme persists across sessions

### Notifications
- Click bell icon to see alerts
- Customize reminder days in subscription settings

---

## 📊 CSV Import Format

Create a CSV file with this format:

```csv
Date,Description,Amount,Category
2024-01-15,Grocery Shopping,1500,Food
2024-01-16,Netflix Subscription,199,Entertainment
2024-01-17,Uber Ride,350,Transportation
2024-01-18,Gym Membership,1000,Fitness
```

**Supported Date Formats:**
- `YYYY-MM-DD` (2024-01-15)
- `DD/MM/YYYY` (15/01/2024)

**Tips:**
- Amount should be numbers only (commas and currency symbols are auto-removed)
- Category will default to "Other" if not specified
- Description is optional

---

## 🔧 Troubleshooting

### Issue: "Firebase not configured"
**Solution:** Check your `.env` file has all required variables

### Issue: "Cannot read expenses"
**Solution:** Clear localStorage and refresh:
```javascript
localStorage.clear()
location.reload()
```

### Issue: "Dark mode not working"
**Solution:** Check if `dark` class is on `<html>` element

### Issue: "CSV import fails"
**Solution:** 
- Verify CSV format matches example
- Check for special characters
- Ensure dates are valid

---

## 💡 Pro Tips

1. **Daily Habit:** Log expenses daily to maintain your streak 🔥
2. **CSV Import:** Export from your bank and import monthly
3. **Subscriptions:** Review quarterly to cancel unused services
4. **Debt Strategy:** Use Avalanche method to save on interest
5. **Goals:** Set realistic deadlines for better motivation
6. **Analytics:** Check weekly to spot spending patterns
7. **Achievements:** Complete achievements for XP and motivation
8. **Education:** Read one article per week

---

## 📱 Mobile Usage

Zen-Fi is fully responsive:
- Works on all screen sizes
- Touch-friendly buttons
- Swipe-friendly navigation
- Mobile-optimized forms

---

## 🔐 Data Privacy

**Important:** All data is stored locally in your browser's localStorage.

**Pros:**
- ✅ Complete privacy
- ✅ No server costs
- ✅ Fast performance
- ✅ Works offline

**Cons:**
- ❌ Not synced across devices
- ❌ Lost if you clear browser data
- ❌ No automatic backups

**Recommendation:** Export your data periodically as CSV backups.

---

## 🎓 Learning Path

### Week 1: Basics
- Set up income and expenses
- Add subscriptions
- Create first goal

### Week 2: Tracking
- Import CSV data
- Review analytics
- Check notifications daily

### Week 3: Optimization
- Set up debt payoff plan
- Review spending patterns
- Adjust budget

### Week 4: Mastery
- Achieve first milestone
- Unlock achievements
- Read education articles

---

## 🆘 Need Help?

1. Check `FEATURES_IMPLEMENTED.md` for detailed feature docs
2. Review `README.md` for technical details
3. Check browser console for errors
4. Verify Firebase configuration

---

## 🚀 Next Steps

After setup:
1. ✅ Add at least 3 income sources
2. ✅ Track expenses for 7 days
3. ✅ Set up 2-3 subscriptions
4. ✅ Create your first financial goal
5. ✅ Import historical data via CSV
6. ✅ Enable notifications
7. ✅ Try dark mode
8. ✅ Read one education article

---

## 📈 Success Metrics

Track your progress:
- **Level:** Aim for Level 5 in first month
- **Streak:** Maintain 7-day streak
- **Financial Score:** Target 70+ score
- **Savings Rate:** Aim for 20%+
- **Debt Reduction:** Track monthly decrease

---

## 🎉 You're Ready!

Start your financial journey with Zen-Fi today! 🚀

**Remember:** Consistency is key. Log in daily, track expenses, and watch your financial health improve!

---

**Happy Budgeting! 💰**
