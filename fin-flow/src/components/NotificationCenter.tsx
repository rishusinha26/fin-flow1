import React, { useEffect, useState } from 'react';
import { Bell, X, AlertCircle, TrendingUp, Target, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIncome } from '@/contexts/IncomeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  title: string;
  message: string;
  icon: React.ReactNode;
  timestamp: Date;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { upcomingRenewals } = useSubscriptions();
  const { totalExpenses, expensesByCategory } = useExpenses();
  const { totalMonthlyIncome } = useIncome();

  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Budget threshold alerts
    const spendingRate = totalMonthlyIncome > 0 ? (totalExpenses / totalMonthlyIncome) * 100 : 0;
    if (spendingRate > 80) {
      newNotifications.push({
        id: 'budget-alert',
        type: 'warning',
        title: 'Budget Alert',
        message: `You've used ${spendingRate.toFixed(0)}% of your monthly income`,
        icon: <AlertCircle className="w-5 h-5" />,
        timestamp: new Date(),
      });
    }

    // Subscription renewals
    upcomingRenewals.forEach(sub => {
      newNotifications.push({
        id: `sub-${sub.id}`,
        type: 'info',
        title: 'Upcoming Renewal',
        message: `${sub.name} renews soon - ₹${sub.amount}`,
        icon: <CreditCard className="w-5 h-5" />,
        timestamp: new Date(),
      });
    });

    // Unusual spending detection
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      const avgSpending = amount * 0.7; // Simulated average
      if (amount > avgSpending * 1.5) {
        newNotifications.push({
          id: `unusual-${category}`,
          type: 'alert',
          title: 'Unusual Spending',
          message: `${category} spending is 50% higher than usual`,
          icon: <TrendingUp className="w-5 h-5" />,
          timestamp: new Date(),
        });
      }
    });

    // Savings opportunity
    if (spendingRate < 70) {
      newNotifications.push({
        id: 'savings-opp',
        type: 'success',
        title: 'Great Job!',
        message: 'You have extra savings potential this month',
        icon: <Target className="w-5 h-5" />,
        timestamp: new Date(),
      });
    }

    setNotifications(newNotifications);
  }, [upcomingRenewals, totalExpenses, totalMonthlyIncome, expensesByCategory]);

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'alert': return 'border-red-200 bg-red-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full relative"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500">
            {notifications.length}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-80 z-50"
          >
            <Card className="p-4 shadow-xl max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className={`p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">{notification.icon}</div>
                            <div>
                              <p className="font-semibold text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
