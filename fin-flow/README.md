# 💰 Zen-Fi - Your Personal Finance Manager

<div align="center">

[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**A comprehensive personal finance management application with 15+ features including subscription tracking, debt management, gamification, analytics, and more!**

[Quick Start](#-quick-start) • [Features](#-features) • [New in v3.0](#-whats-new-in-v30) • [Documentation](#-documentation)

</div>

---
## ✨ Features

### 🔐 **Secure Authentication**
- Email/Password authentication with Firebase
- Google OAuth sign-in
- Protected routes with automatic session management
- User profile with avatar support

### 📊 **Financial Management**
- **Income Tracking**: Multiple income sources with frequency options
- **Expense Management**: Categorized expense tracking with charts
- **Investment Portfolio**: Track and manage investments
- **Tax Optimization**: Calculate and optimize tax savings
- **Budget Monitoring**: Real-time budget vs actual spending
- **Goal Tracking**: Set and monitor financial goals

### 🤖 **AI-Powered Features**
- Financial chatbot with Google Gemini/OpenAI integration
- Personalized financial insights
- Smart investment suggestions
- Automated financial tips

### 🎨 **Modern UI/UX**
- Glassmorphic design with gradient backgrounds
- Smooth animations with Framer Motion
- Responsive layout for all devices
- Professional Inter font typography
- **Dark mode** with theme toggle
- Floating action button for quick expense entry
- Smart notification center

### 📈 **Data Visualization**
- Interactive spending charts
- Investment performance graphs
- Budget progress indicators
- Real-time market data display

### 🔧 **Additional Tools**
- PDF export for financial reports
- **CSV import** for bank statements
- Market data integration
- Comprehensive financial calculators

### 🎮 **NEW: Gamification System**
- **Level & XP System**: Progress through levels by using the app
- **Achievements**: Unlock 9+ badges for financial milestones
- **Streak Tracking**: Daily activity streaks with rewards
- **Financial Score**: 0-100 score based on financial health

### 💳 **NEW: Subscription Tracker**
- Track all recurring subscriptions
- Multiple billing frequencies (weekly, monthly, quarterly, yearly)
- Renewal reminders and notifications
- Total cost calculations (monthly & yearly)

### 📊 **NEW: Debt Management**
- Track multiple debts (credit cards, loans, etc.)
- **Snowball vs Avalanche** payoff strategies
- Payment history and progress tracking
- Debt-free date projections

### 📈 **NEW: Advanced Analytics**
- Income vs Expenses trends
- Daily spending patterns
- 6-month cash flow forecasting
- Category-wise spending analysis
- Anomaly detection

### 📚 **NEW: Financial Education**
- Built-in financial literacy articles
- Quick tips and best practices
- FAQ section
- Learning paths (Beginner → Advanced)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd zen-fi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Or use the [Quick Start Guide](./QUICK_START.md) for a 5-minute setup

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:8080
   ```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.1** - Build tool
- **React Router DOM 6.26.2** - Routing

### UI & Styling
- **TailwindCSS 3.4.11** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Headless UI primitives
- **Framer Motion 12.23.22** - Animations
- **Lucide React** - Icon library

### Backend & Services
- **Firebase 12.4.0** - Authentication & backend
- **React Firebase Hooks 5.1.1** - Firebase integration
- **Firestore** - Database (optional)
- **Firebase Storage** - File storage (optional)

### Data & Forms
- **React Hook Form 7.53.0** - Form handling
- **Zod 3.23.8** - Schema validation
- **Recharts 2.12.7** - Data visualization
- **date-fns 3.6.0** - Date utilities

### Additional
- **jsPDF 3.0.1** - PDF generation
- **MongoDB/Mongoose** - Database support (prepared)

---

## 📁 Project Structure

```
zen-fi/
├── src/
│   ├── config/              # Firebase configuration
│   ├── services/            # Business logic services
│   ├── contexts/            # React Context providers
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components (shadcn/ui)
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── .env.example            # Environment variables template
├── FIREBASE_SETUP.md       # Firebase setup guide
├── QUICK_START.md          # Quick start guide
├── UPGRADE_SUMMARY.md      # Upgrade details
└── PROJECT_STRUCTURE.md    # Detailed structure docs
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

---

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Detailed Firebase configuration
- **[Upgrade Summary](./UPGRADE_SUMMARY.md)** - Latest features and changes
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Code organization
- **[AI Integration](./AI_INTEGRATION_GUIDE.md)** - AI chatbot setup

---

## 🎯 Key Features Explained

### Authentication Flow
```
User visits app → Redirected to /auth → Login/Signup → Firebase Auth → Dashboard
```

### Protected Routes
All main routes are protected and require authentication:
- `/dashboard` - Main financial dashboard
- `/investments` - Investment portfolio
- `/tax` - Tax planning tools

### State Management
- **AuthContext**: Firebase authentication state
- **IncomeContext**: Income sources and calculations
- **ExpenseContext**: Expense tracking and analytics

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1) to Purple (#9333ea)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Background**: Gray gradients

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300-900

### Components
- Glassmorphic cards with backdrop blur
- Smooth gradient transitions
- Animated interactions
- Responsive layouts

---

## 🔒 Security

- Environment variables for sensitive data
- Firebase security rules
- Protected API routes
- Secure authentication flow
- No hardcoded credentials

---

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

---

## 🚦 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Environment Variables

Required variables (see `.env.example`):
```env
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Backend services
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Data visualization

---

## 📞 Support

For issues and questions:
- Check the [documentation](#-documentation)
- Review [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Open an issue on GitHub

---

## 🎉 What's New in v3.0

### 🚀 Major Features Added

#### 1. **Subscription Tracker** (`/subscriptions`)
- Track Netflix, Spotify, and all recurring subscriptions
- Automatic cost calculations (monthly & yearly)
- Renewal reminders with customizable alerts
- Support for weekly, monthly, quarterly, and yearly billing

#### 2. **Debt Management** (`/debt`)
- Track credit cards, loans, and all debts
- Choose between Snowball or Avalanche payoff strategies
- Payment history tracking
- Debt-free date projections
- Interest rate monitoring

#### 3. **Advanced Analytics** (`/analytics`)
- Income vs Expenses trend charts
- Daily spending patterns
- 6-month cash flow forecasting
- Category-wise spending analysis
- Current vs average comparisons
- Anomaly detection

#### 4. **Gamification System** (`/achievements`)
- Level & XP progression system
- 9+ unlockable achievements
- Daily streak tracking
- Financial health score (0-100)
- Visual progress indicators

[⬆ Back to Top](#-zen-fi---your-personal-finance-manager)

</div>
#   z e n - f i  
 #   f i n - f l o w 1  
 #   f i n - f l o w 1  
 