import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/contexts/GamificationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AchievementsPage() {
  const { achievements, streak, financialScore, level, xp } = useGamification();

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Achievements & Progress</h1>
            <p className="text-white/90 mt-1">
              Track your financial journey milestones
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Level</p>
                <h3 className="text-4xl font-bold text-purple-900">{level}</h3>
                <Progress value={xpProgress} className="mt-2 h-2" />
                <p className="text-xs text-purple-600 mt-1">{xpProgress}/100 XP</p>
              </div>
              <Star className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Current Streak</p>
                <h3 className="text-4xl font-bold text-orange-900">{streak.current}</h3>
                <p className="text-xs text-orange-600 mt-1">days</p>
              </div>
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Financial Score</p>
                <h3 className="text-4xl font-bold text-blue-900">{financialScore}</h3>
                <p className="text-xs text-blue-600 mt-1">out of 100</p>
              </div>
              <Target className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Achievements</p>
                <h3 className="text-4xl font-bold text-green-900">{unlockedAchievements.length}/{achievements.length}</h3>
              </div>
              <Award className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <Tabs defaultValue="unlocked">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unlocked">
                Unlocked ({unlockedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="locked">
                Locked ({lockedAchievements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlocked" className="mt-6">
              {unlockedAchievements.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-500">Start using Zen-Fi to unlock achievements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <div className="text-5xl mb-3">{achievement.icon}</div>
                          <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Trophy className="w-4 h-4" />
                            <span>
                              Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="locked" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-6 bg-gray-50 border-gray-200 hover:shadow-lg transition-shadow relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-center opacity-60">
                        <div className="text-5xl mb-3 grayscale">{achievement.icon}</div>
                        <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        <div className="space-y-2">
                          <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {achievement.progress} / {achievement.target}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Streak Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🔥 Streak Information</h3>
              <p className="text-gray-600">Keep tracking your finances daily to maintain your streak!</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Current Streak: {streak.current} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold">Longest Streak: {streak.longest} days</span>
                </div>
              </div>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
        </Card>
      </motion.div>

      {/* Financial Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Financial Health Score Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Savings Rate</span>
                <span className="text-gray-600">30 points</span>
              </div>
              <Progress value={70} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Budget Adherence</span>
                <span className="text-gray-600">25 points</span>
              </div>
              <Progress value={60} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Debt Management</span>
                <span className="text-gray-600">25 points</span>
              </div>
              <Progress value={80} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Emergency Fund</span>
                <span className="text-gray-600">20 points</span>
              </div>
              <Progress value={50} className="h-3" />
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Increase your savings rate to 30% and build a 6-month emergency fund to improve your score!
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
