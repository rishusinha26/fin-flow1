import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import FinancialTools from '@/components/FinancialTools';

export function FinancialToolsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Financial Tools</h1>
            <p className="text-white/90 mt-1">
              Powerful calculators and tools to plan your financial future
            </p>
          </div>
        </div>
      </motion.div>

      {/* Financial Tools Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FinancialTools />
      </motion.div>
    </div>
  );
}
