import React from 'react';
import { motion } from 'framer-motion';
import { InvestmentTracker } from '@/components/InvestmentTracker';
import { TrendingUp } from 'lucide-react';

export function InvestmentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-white/90 mt-1">
              Track and manage your investments in one place
            </p>
          </div>
        </div>
      </motion.div>

      {/* Investment Tracker Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <InvestmentTracker />
      </motion.div>
    </div>
  );
}
