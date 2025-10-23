@echo off
echo ========================================
echo  Pushing Changes to GitHub
echo ========================================
echo.

cd /d "d:\mini project"

echo Step 1: Adding all changes...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "feat: Add MongoDB integration and new UI components - Added MongoDB models (Income, Expense) - Created database configuration - Updated all API endpoints to use MongoDB - Added IncomeManager, ExpenseManager, FinancialAnalytics components - Added financeService for API integration - Updated navigation with new routes - Added comprehensive documentation"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  Done! Check your GitHub repository:
echo  https://github.com/rishusinha26/fin-flow1
echo ========================================
pause
