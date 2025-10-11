# 🚀 Quick Start Guide - Zen-Fi

Get your Zen-Fi personal finance manager up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google account (for Firebase)

## 📦 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

#### Create Firebase Project (2 minutes)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Enter name: `zen-fi`
3. Click "Create project"

#### Enable Authentication (1 minute)
1. In Firebase Console: **Build** → **Authentication** → **Get started**
2. Enable **Email/Password** (toggle ON → Save)
3. Enable **Google** (toggle ON → Select support email → Save)

#### Get Configuration (1 minute)
1. Click the **Web icon** (`</>`) in project overview
2. Register app: `Zen-Fi Web App`
3. Copy the config object

### 3. Configure Environment Variables

Create `.env` file in project root:
```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:8080**

## 🎉 You're Ready!

### First Steps:
1. **Sign Up**: Create an account with email/password or Google
2. **Explore Dashboard**: View your personalized financial dashboard
3. **Add Income**: Set up your income sources
4. **Track Expenses**: Start logging your expenses
5. **Set Goals**: Create financial goals
6. **View Investments**: Manage your investment portfolio

## 🎨 Features to Try

### 1. Dashboard
- View total monthly income
- Track expenses by category
- See spending charts
- Get AI-powered insights

### 2. Investments
- Add investment holdings
- Track portfolio performance
- View investment suggestions
- Monitor market data

### 3. Tax Planning
- Calculate tax liability
- Optimize tax savings
- Track deductions
- Generate tax reports

### 4. Financial Tools
- Budget monitor
- Goal tracker
- Spending analytics
- AI chatbot assistant

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

## 📱 Test Accounts

For testing, you can use:
- **Email/Password**: Create any test account
- **Google Sign-In**: Use your Google account

## 🐛 Troubleshooting

### Firebase Not Working?
```bash
# 1. Check .env file exists
ls -la .env

# 2. Restart dev server
# Stop server (Ctrl+C) and run again
npm run dev
```

### Port Already in Use?
```bash
# Change port in vite.config.ts
# Or kill process on port 8080
```

### Google Sign-In Blocked?
- Allow popups for localhost in browser settings
- Check Firebase Console → Authentication → Authorized domains

## 📚 Next Steps

1. **Read Full Documentation**
   - `FIREBASE_SETUP.md` - Detailed Firebase guide
   - `UPGRADE_SUMMARY.md` - New features overview
   - `PROJECT_STRUCTURE.md` - Code organization

2. **Customize Your App**
   - Update branding in `index.html`
   - Modify theme in `tailwind.config.ts`
   - Add custom features

3. **Deploy to Production**
   - Set up Firebase Hosting
   - Configure production environment
   - Enable security rules

## 💡 Tips

- **Use Chrome DevTools**: Inspect Firebase auth state
- **Check Console**: Look for error messages
- **Firebase Console**: Monitor authentication logs
- **Hot Reload**: Changes auto-refresh in dev mode

## 🆘 Need Help?

- Check `FIREBASE_SETUP.md` for detailed setup
- Review Firebase Console for auth errors
- Verify all environment variables are set
- Ensure Firebase services are enabled

## 🎊 Enjoy Zen-Fi!

You now have a fully functional personal finance manager with:
- ✅ Secure authentication
- ✅ Beautiful modern UI
- ✅ Expense tracking
- ✅ Investment management
- ✅ Tax optimization
- ✅ AI-powered insights

Start managing your finances with ease! 💰✨
