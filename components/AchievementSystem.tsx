import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, Award, Crown } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Complete tasks for 7 days straight',
      icon: Zap,
      color: 'text-orange-500',
      gradient: 'from-orange-400 to-red-500',
      unlocked: true,
      progress: 7,
      maxProgress: 7
    },
    {
      id: 'focus_champion',
      title: 'Focus Champion',
      description: 'Spend 50 hours in focus mode',
      icon: Target,
      color: 'text-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      unlocked: true,
      progress: 50,
      maxProgress: 50
    },
    {
      id: 'task_crusher',
      title: 'Task Crusher',
      description: 'Complete 100 tasks',
      icon: Trophy,
      color: 'text-green-500',
      gradient: 'from-green-400 to-emerald-500',
      unlocked: false,
      progress: 87,
      maxProgress: 100
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Start work before 7 AM for 5 days',
      icon: Star,
      color: 'text-yellow-500',
      gradient: 'from-yellow-400 to-orange-500',
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete a week with 100% task completion',
      icon: Award,
      color: 'text-purple-500',
      gradient: 'from-purple-400 to-pink-500',
      unlocked: false,
      progress: 5,
      maxProgress: 7
    },
    {
      id: 'legend',
      title: 'Productivity Legend',
      description: 'Maintain 30-day streak',
      icon: Crown,
      color: 'text-violet-500',
      gradient: 'from-violet-400 to-purple-500',
      unlocked: false,
      progress: 12,
      maxProgress: 30
    }
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedAchievement, setCelebratedAchievement] = useState<Achievement | null>(null);

  const celebrateAchievement = (achievement: Achievement) => {
    setCelebratedAchievement(achievement);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">Achievements</h3>
        <Badge className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white">
          {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 rounded-2xl border transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-white/40 backdrop-blur-xl border-white/50 shadow-lg cursor-pointer hover:scale-105'
                : 'bg-white/20 backdrop-blur-md border-white/30 shadow-md'
            }`}
            onClick={() => achievement.unlocked && celebrateAchievement(achievement)}
            whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
            whileTap={{ scale: achievement.unlocked ? 0.98 : 1 }}
          >
            {/* Glow effect for unlocked achievements */}
            {achievement.unlocked && (
              <div className={`absolute inset-0 bg-gradient-to-r ${achievement.gradient} opacity-10 rounded-2xl blur-sm`}></div>
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center shadow-lg ${
                  !achievement.unlocked && 'grayscale opacity-50'
                }`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                {achievement.unlocked && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
              </div>

              <h4 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                {achievement.title}
              </h4>
              <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                {achievement.description}
              </p>

              {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={achievement.unlocked ? 'text-slate-600' : 'text-slate-400'}>
                      Progress
                    </span>
                    <span className={achievement.unlocked ? achievement.color : 'text-slate-400'}>
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${achievement.gradient} transition-all duration-500`}
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebratedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 text-center shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${celebratedAchievement.gradient} flex items-center justify-center shadow-lg`}
              >
                <celebratedAchievement.icon className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">Achievement Unlocked!</h3>
              <h4 className="text-xl font-semibold text-slate-700 mb-3">{celebratedAchievement.title}</h4>
              <p className="text-slate-600 mb-6">{celebratedAchievement.description}</p>

              <div className="flex justify-center">
                <Badge className={`bg-gradient-to-r ${celebratedAchievement.gradient} text-white text-lg px-6 py-2`}>
                  +500 XP
                </Badge>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}