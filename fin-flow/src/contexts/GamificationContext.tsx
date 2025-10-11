import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: 'savings' | 'budget' | 'goals' | 'streak' | 'special';
}

export interface Streak {
  current: number;
  longest: number;
  lastActivity: string;
}

interface GamificationContextType {
  achievements: Achievement[];
  streak: Streak;
  financialScore: number;
  level: number;
  xp: number;
  unlockAchievement: (id: string) => void;
  updateStreak: () => void;
  addXP: (amount: number) => void;
  calculateFinancialScore: (data: any) => number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  {
    id: 'first_expense',
    title: 'First Step',
    description: 'Track your first expense',
    icon: '🎯',
    progress: 0,
    target: 1,
    category: 'special',
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Track expenses for 7 days straight',
    icon: '🔥',
    progress: 0,
    target: 7,
    category: 'streak',
  },
  {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Track expenses for 30 days straight',
    icon: '⭐',
    progress: 0,
    target: 30,
    category: 'streak',
  },
  {
    id: 'first_goal',
    title: 'Goal Setter',
    description: 'Create your first financial goal',
    icon: '🎯',
    progress: 0,
    target: 1,
    category: 'goals',
  },
  {
    id: 'goal_achieved',
    title: 'Goal Crusher',
    description: 'Complete your first financial goal',
    icon: '🏆',
    progress: 0,
    target: 1,
    category: 'goals',
  },
  {
    id: 'budget_set',
    title: 'Budget Boss',
    description: 'Set your first budget',
    icon: '💰',
    progress: 0,
    target: 1,
    category: 'budget',
  },
  {
    id: 'under_budget',
    title: 'Savings Star',
    description: 'Stay under budget for a month',
    icon: '💎',
    progress: 0,
    target: 1,
    category: 'budget',
  },
  {
    id: 'save_10k',
    title: 'Savings Starter',
    description: 'Save ₹10,000',
    icon: '💵',
    progress: 0,
    target: 10000,
    category: 'savings',
  },
  {
    id: 'save_100k',
    title: 'Savings Pro',
    description: 'Save ₹1,00,000',
    icon: '💰',
    progress: 0,
    target: 100000,
    category: 'savings',
  },
];

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, lastActivity: '' });
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [financialScore, setFinancialScore] = useState(0);

  useEffect(() => {
    if (user) {
      const storedAchievements = localStorage.getItem(`achievements_${user.uid}`);
      const storedStreak = localStorage.getItem(`streak_${user.uid}`);
      const storedXP = localStorage.getItem(`xp_${user.uid}`);
      
      if (storedAchievements) setAchievements(JSON.parse(storedAchievements));
      if (storedStreak) setStreak(JSON.parse(storedStreak));
      if (storedXP) setXP(parseInt(storedXP));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`achievements_${user.uid}`, JSON.stringify(achievements));
      localStorage.setItem(`streak_${user.uid}`, JSON.stringify(streak));
      localStorage.setItem(`xp_${user.uid}`, xp.toString());
    }
  }, [achievements, streak, xp, user]);

  useEffect(() => {
    // Calculate level from XP (100 XP per level)
    setLevel(Math.floor(xp / 100) + 1);
  }, [xp]);

  const unlockAchievement = (id: string) => {
    setAchievements(achievements.map(achievement => {
      if (achievement.id === id && !achievement.unlockedAt) {
        addXP(50); // Award XP for unlocking achievement
        return {
          ...achievement,
          unlockedAt: new Date().toISOString(),
          progress: achievement.target,
        };
      }
      return achievement;
    }));
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = new Date(streak.lastActivity).toDateString();
    
    if (lastActivity === today) {
      return; // Already tracked today
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastActivity === yesterday) {
      // Continue streak
      const newCurrent = streak.current + 1;
      setStreak({
        current: newCurrent,
        longest: Math.max(newCurrent, streak.longest),
        lastActivity: new Date().toISOString(),
      });
      addXP(10); // Daily XP
    } else {
      // Streak broken
      setStreak({
        current: 1,
        longest: streak.longest,
        lastActivity: new Date().toISOString(),
      });
    }
  };

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const calculateFinancialScore = (data: {
    savingsRate?: number;
    budgetAdherence?: number;
    debtToIncome?: number;
    emergencyFund?: number;
  }) => {
    let score = 0;
    
    // Savings rate (0-30 points)
    if (data.savingsRate) {
      score += Math.min(30, (data.savingsRate / 30) * 30);
    }
    
    // Budget adherence (0-25 points)
    if (data.budgetAdherence) {
      score += Math.min(25, data.budgetAdherence * 25);
    }
    
    // Debt to income ratio (0-25 points)
    if (data.debtToIncome !== undefined) {
      score += Math.max(0, 25 - (data.debtToIncome * 25));
    }
    
    // Emergency fund (0-20 points)
    if (data.emergencyFund) {
      score += Math.min(20, (data.emergencyFund / 6) * 20);
    }
    
    setFinancialScore(Math.round(score));
    return Math.round(score);
  };

  return (
    <GamificationContext.Provider
      value={{
        achievements,
        streak,
        financialScore,
        level,
        xp,
        unlockAchievement,
        updateStreak,
        addXP,
        calculateFinancialScore,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
}
