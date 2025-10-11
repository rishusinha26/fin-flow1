# 📁 Zen-Fi Project Structure

## Overview
This document provides a comprehensive overview of the Zen-Fi project structure, explaining the purpose of each directory and key files.

## Root Directory

```
zen-fi/
├── src/                          # Source code
├── public/                       # Static assets
├── node_modules/                 # Dependencies
├── .env                          # Environment variables (create from .env.example)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.app.json             # App-specific TypeScript config
├── tsconfig.node.json            # Node-specific TypeScript config
├── vite.config.ts                # Vite bundler configuration
├── tailwind.config.ts            # TailwindCSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
├── components.json               # shadcn/ui configuration
├── README.md                     # Project documentation
├── FIREBASE_SETUP.md             # Firebase setup guide
├── UPGRADE_SUMMARY.md            # Upgrade details
├── PROJECT_STRUCTURE.md          # This file
└── AI_INTEGRATION_GUIDE.md       # AI chatbot integration guide
```

## Source Directory (`src/`)

### Main Files
```
src/
├── main.tsx                      # Application entry point
├── App.tsx                       # Root component with routing
├── App.css                       # Global app styles
├── index.css                     # Global CSS with Tailwind directives
└── vite-env.d.ts                 # Vite type definitions
```

### Configuration (`src/config/`)
```
src/config/
└── firebaseConfig.ts             # Firebase initialization and setup
```

### Services (`src/services/`)
```
src/services/
├── authService.ts                # Firebase authentication utilities
└── aiService.ts                  # AI chatbot service (existing)
```

### Contexts (`src/contexts/`)
State management using React Context API
```
src/contexts/
├── AuthContext.tsx               # Firebase authentication state
├── ExpenseContext.tsx            # Expense tracking state
└── IncomeContext.tsx             # Income management state
```

### Pages (`src/pages/`)
Top-level route components
```
src/pages/
├── AuthPage.tsx                  # Login/Signup page (new)
├── Dashboard.tsx                 # Main dashboard (new)
├── Index.tsx                     # Legacy index page
└── NotFound.tsx                  # 404 error page
```

### Components (`src/components/`)

#### Authentication (`src/components/auth/`)
```
src/components/auth/
├── ProtectedRoute.tsx            # Route protection wrapper (new)
└── LoginPage.tsx                 # Legacy login component (deprecated)
```

#### Layout (`src/components/layout/`)
```
src/components/layout/
└── Navigation.tsx                # Sidebar navigation (updated)
```

#### UI Components (`src/components/ui/`)
shadcn/ui components and custom UI elements
```
src/components/ui/
├── accordion.tsx                 # Accordion component
├── alert-dialog.tsx              # Alert dialog component
├── avatar.tsx                    # Avatar component
├── button.tsx                    # Button component
├── card.tsx                      # Card component
├── checkbox.tsx                  # Checkbox component
├── dialog.tsx                    # Dialog/Modal component
├── dropdown-menu.tsx             # Dropdown menu component
├── input.tsx                     # Input field component
├── label.tsx                     # Label component
├── loading-screen.tsx            # Loading screen (new)
├── popover.tsx                   # Popover component
├── progress.tsx                  # Progress bar component
├── select.tsx                    # Select dropdown component
├── separator.tsx                 # Separator/Divider component
├── slider.tsx                    # Slider component
├── switch.tsx                    # Toggle switch component
├── tabs.tsx                      # Tabs component
├── toast.tsx                     # Toast notification component
├── toaster.tsx                   # Toast container
└── tooltip.tsx                   # Tooltip component
```

#### Feature Components (`src/components/`)
Business logic components
```
src/components/
├── AIInsights.tsx                # AI-powered financial insights
├── BudgetMonitor.tsx             # Budget tracking and monitoring
├── ExpenseTracker.tsx            # Expense management
├── FinancialChatbot.tsx          # AI chatbot interface
├── FinancialTips.tsx             # Financial advice tips
├── FinancialTools.tsx            # Comprehensive financial tools
├── GoalTracker.tsx               # Financial goal tracking
├── InvestmentSuggestions.tsx     # Investment recommendations
├── InvestmentTracker.tsx         # Investment portfolio management
├── MarketData.tsx                # Market data display
├── ScanToPay.tsx                 # QR code payment feature
├── SpendingCharts.tsx            # Expense visualization charts
└── TaxOptimizer.tsx              # Tax planning and optimization
```

### Hooks (`src/hooks/`)
Custom React hooks
```
src/hooks/
├── use-toast.ts                  # Toast notification hook
└── use-mobile.tsx                # Mobile detection hook
```

### Utilities (`src/lib/`)
Helper functions and utilities
```
src/lib/
└── utils.ts                      # Common utility functions
```

## Key Technologies

### Frontend Framework
- **React 18.3.1**: UI library
- **TypeScript 5.5.3**: Type safety
- **Vite 5.4.1**: Build tool and dev server

### Routing & State
- **React Router DOM 6.26.2**: Client-side routing
- **React Context API**: State management
- **React Hook Form 7.53.0**: Form handling
- **Zod 3.23.8**: Schema validation

### UI & Styling
- **TailwindCSS 3.4.11**: Utility-first CSS
- **shadcn/ui**: Component library
- **Radix UI**: Headless UI primitives
- **Framer Motion 12.23.22**: Animations
- **Lucide React 0.462.0**: Icons

### Backend & Services
- **Firebase 12.4.0**: Authentication & backend
- **React Firebase Hooks 5.1.1**: Firebase React integration

### Data Visualization
- **Recharts 2.12.7**: Charts and graphs

### Additional Features
- **jsPDF 3.0.1**: PDF generation
- **date-fns 3.6.0**: Date utilities
- **MongoDB/Mongoose**: Database (prepared for backend)

## Environment Variables

Required environment variables (see `.env.example`):
```
VITE_FIREBASE_API_KEY              # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN          # Firebase auth domain
VITE_FIREBASE_PROJECT_ID           # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET       # Firebase storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID  # Firebase messaging sender ID
VITE_FIREBASE_APP_ID               # Firebase app ID
VITE_FIREBASE_MEASUREMENT_ID       # Firebase measurement ID
```

## Scripts

Available npm scripts:
```bash
npm run dev          # Start development server (localhost:8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Routing Structure

```
/                    → Redirects to /dashboard
/auth                → Login/Signup page (public)
/dashboard           → Main dashboard (protected)
/investments         → Investment portfolio (protected)
/tax                 → Tax planning (protected)
/*                   → Redirects to /dashboard
```

## Component Hierarchy

```
App (Router + Providers)
├── AuthProvider
│   ├── IncomeProvider
│   │   ├── ExpenseProvider
│   │   │   ├── Routes
│   │   │   │   ├── /auth → AuthPage
│   │   │   │   └── /dashboard → ProtectedRoute
│   │   │   │       └── AppLayout
│   │   │   │           ├── Navigation
│   │   │   │           └── Dashboard
│   │   │   │               ├── Welcome Card
│   │   │   │               ├── Income Display
│   │   │   │               ├── ExpenseTracker
│   │   │   │               └── FinancialTools
│   │   │   └── Toaster
```

## Design Patterns

### 1. Context Pattern
Used for global state management (Auth, Income, Expense)

### 2. Protected Routes
Authentication-based route access control

### 3. Component Composition
Reusable UI components with shadcn/ui

### 4. Custom Hooks
Encapsulated logic (useAuth, useToast, useIncome, useExpenses)

### 5. Service Layer
Separated business logic (authService, aiService)

## File Naming Conventions

- **Components**: PascalCase (e.g., `AuthPage.tsx`, `ExpenseTracker.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `authService.ts`)
- **Hooks**: kebab-case with `use-` prefix (e.g., `use-toast.ts`)
- **Config**: camelCase (e.g., `firebaseConfig.ts`)
- **Types**: PascalCase interfaces/types

## Import Aliases

```typescript
@/                   # Maps to src/ directory
@/components         # Components directory
@/contexts           # Context providers
@/hooks              # Custom hooks
@/lib                # Utilities
@/services           # Service layer
@/config             # Configuration files
@/pages              # Page components
```

## Best Practices

### 1. Type Safety
- All components use TypeScript
- Strict type checking enabled
- Zod for runtime validation

### 2. Code Organization
- Feature-based component structure
- Separation of concerns
- Reusable UI components

### 3. Performance
- Lazy loading for routes (can be added)
- Optimized re-renders with Context
- Memoization where needed

### 4. Security
- Environment variables for sensitive data
- Protected routes for authenticated pages
- Firebase security rules

### 5. Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support

## Next Steps for Development

1. **Add Email Verification**: Implement email verification flow
2. **Password Reset**: Add forgot password functionality
3. **Profile Page**: Create user profile management
4. **Firestore Integration**: Persist data to Firestore
5. **Mobile Optimization**: Enhance mobile responsiveness
6. **Dark Mode**: Implement theme switching
7. **Testing**: Add unit and integration tests
8. **CI/CD**: Set up automated deployment

## Documentation

- `README.md`: General project information
- `FIREBASE_SETUP.md`: Firebase configuration guide
- `UPGRADE_SUMMARY.md`: Recent upgrade details
- `AI_INTEGRATION_GUIDE.md`: AI chatbot setup
- `PROJECT_STRUCTURE.md`: This file

---

**Last Updated**: October 2025  
**Version**: 2.0.0 (Firebase Upgrade)
