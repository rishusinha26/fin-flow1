import React from 'react';
import { motion } from 'framer-motion';
import { TaxOptimizer } from '@/components/TaxOptimizer';
import { Receipt } from 'lucide-react';

export function TaxPlanningPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Receipt className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tax Planning & Optimization</h1>
            <p className="text-white/90 mt-1">
              Maximize your tax savings with smart planning
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tax Optimizer Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <TaxOptimizer />
      </motion.div>
    </div>
  );
}
