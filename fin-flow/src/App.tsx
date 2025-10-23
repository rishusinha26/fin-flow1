import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './test-env';
import { AuthProvider } from '@/contexts/AuthContext';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { IncomeProvider } from '@/contexts/IncomeContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { DebtProvider } from '@/contexts/DebtContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { RecurringTransactionProvider } from '@/contexts/RecurringTransactionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { AccountProvider } from '@/contexts/AccountContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthPage } from '@/pages/AuthPage';
import { Dashboard } from '@/pages/Dashboard';
import { InvestmentsPage } from '@/pages/InvestmentsPage';
import { TaxPlanningPage } from '@/pages/TaxPlanningPage';
import { BudgetPlannerPage } from '@/pages/BudgetPlannerPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { FinancialToolsPage } from '@/pages/FinancialToolsPage';
import { IncomeManagementPage } from '@/pages/IncomeManagementPage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { DebtManagementPage } from '@/pages/DebtManagementPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { EducationPage } from '@/pages/EducationPage';
import { RecurringTransactionsPage } from '@/pages/RecurringTransactionsPage';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { QuickAddExpense } from '@/components/QuickAddExpense';
import { Toaster } from '@/components/ui/toaster';
import FinancialChatbot from '@/components/FinancialChatbot';
import IncomeManager from '@/components/IncomeManager';
import ExpenseManager from '@/components/ExpenseManager';
import FinancialAnalytics from '@/components/FinancialAnalytics';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AccountProvider>
            <IncomeProvider>
              <ExpenseProvider>
                <BudgetProvider>
                  <GamificationProvider>
                    <RecurringTransactionProvider>
                      <SubscriptionProvider>
                        <DebtProvider>
                          <Routes>
                            {/* Public Route */}
                            <Route path="/auth" element={<AuthPage />} />

                            {/* Protected Routes */}
                            <Route
                              path="/dashboard"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <Dashboard />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/investments"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <InvestmentsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/tax"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <TaxPlanningPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/income"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <IncomeManagementPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/tools"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <FinancialToolsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/budget"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <BudgetPlannerPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/reports"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <ReportsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/goals"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <GoalsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />

                            {/* New Routes */}
                            <Route
                              path="/subscriptions"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <SubscriptionsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/debt"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <DebtManagementPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/analytics"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <AnalyticsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/achievements"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <AchievementsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/education"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <EducationPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/recurring"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <RecurringTransactionsPage />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />

                            {/* New Backend-Powered Routes */}
                            <Route
                              path="/income-manager"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <IncomeManager />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/expense-manager"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <ExpenseManager />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/financial-analytics"
                              element={
                                <ProtectedRoute>
                                  <AppLayout>
                                    <FinancialAnalytics />
                                  </AppLayout>
                                </ProtectedRoute>
                              }
                            />

                            {/* Redirect root to dashboard */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            
                            {/* Catch all - redirect to dashboard */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                          </Routes>
                          <Toaster />
                        </DebtProvider>
                      </SubscriptionProvider>
                    </RecurringTransactionProvider>
                  </GamificationProvider>
                </BudgetProvider>
              </ExpenseProvider>
            </IncomeProvider>
          </AccountProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <TopNavbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
        {children}
      </main>
      <QuickAddExpense />
      <FinancialChatbot />
    </div>
  );
}

export default App;
