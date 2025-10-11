import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, PieChart, Receipt, LogOut, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-4 flex flex-col shadow-lg"
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Zen-Fi
          </h2>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <Avatar className="h-10 w-10 border-2 border-indigo-200">
            <AvatarImage src={user?.photoURL || ''} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            className={`w-full justify-start transition-all duration-300 ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onNavigate('dashboard')}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant={currentPage === 'investments' ? 'default' : 'ghost'}
            className={`w-full justify-start transition-all duration-300 ${
              currentPage === 'investments'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onNavigate('investments')}
          >
            <PieChart className="mr-2 h-5 w-5" />
            Investments
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant={currentPage === 'tax' ? 'default' : 'ghost'}
            className={`w-full justify-start transition-all duration-300 ${
              currentPage === 'tax'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onNavigate('tax')}
          >
            <Receipt className="mr-2 h-5 w-5" />
            Tax Planning
          </Button>
        </motion.div>
      </nav>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          variant="ghost"
          className="mt-auto w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </motion.div>
    </motion.div>
  );
}