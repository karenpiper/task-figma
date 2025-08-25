import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, Award, Crown } from 'lucide-react';
import { Badge } from './ui/badge';

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
        <Badge variant="secondary" className="text-xs">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                achievement.unlocked
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full transition-all duration-300 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${achievement.gradient} text-white`
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm transition-colors duration-300 ${
                    achievement.unlocked ? achievement.color : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {achievement.description}
                  </p>
                  
                  {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            achievement.unlocked
                              ? `bg-gradient-to-r ${achievement.gradient}`
                              : 'bg-gray-300'
                          }`}
                          style={{
                            width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Celebration Modal */}
      {showCelebration && celebratedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center transform transition-all duration-300 scale-100">
            <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${celebratedAchievement.gradient} flex items-center justify-center mb-4`}>
              <celebratedAchievement.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Achievement Unlocked!
            </h3>
            <p className="text-gray-600 mb-4">
              {celebratedAchievement.title}
            </p>
            <p className="text-sm text-gray-500">
              {celebratedAchievement.description}
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}