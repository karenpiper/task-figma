import React, { useState, useEffect } from 'react';
import { Target, Zap, Trophy, Star, Sparkles } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface FocusZoneProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export function FocusZone({ totalTasks, completedTasks, pendingTasks }: FocusZoneProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
  const [streak, setStreak] = useState(12);

  const inspirationalQuotes = [
    { text: "Focus on progress, not perfection.", author: "Today's Mantra" },
    { text: "Every small step is a victory.", author: "Your Journey" },
    { text: "The magic happens outside your comfort zone.", author: "Growth Mindset" },
    { text: "Consistency beats perfection every time.", author: "Daily Wisdom" },
    { text: "You're closer than you think.", author: "Keep Going" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDailyProgress(totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
  }, [totalTasks, completedTasks]);

  return (
    <div className="relative">
      {/* Breathing animation background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-3xl animate-pulse blur-sm"></div>
      
      <div className="relative bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Focus Zone</h3>
              <p className="text-sm text-slate-600">Your daily inspiration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              {streak} day streak
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 shadow-lg">
              <Trophy className="w-3 h-3 mr-1" />
              Level 8
            </Badge>
          </div>
        </div>

        {/* Daily Progress Ring */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200/40 to-slate-300/40"></div>
            
            {/* Progress circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - dailyProgress / 100)}`}
                className="transition-all duration-1000 ease-out drop-shadow-lg"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {dailyProgress}%
              </div>
              <div className="text-xs text-slate-600 font-medium">Complete</div>
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-2 -left-2 text-blue-400 animate-bounce delay-500">
              <Star className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="text-center mb-6">
          <div className="relative overflow-hidden h-16 flex items-center justify-center">
            <div 
              className="transition-all duration-1000 ease-in-out"
              key={currentQuote}
              style={{
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              <p className="text-lg font-medium text-slate-800 mb-1">
                "{inspirationalQuotes[currentQuote].text}"
              </p>
              <p className="text-sm text-slate-600 font-medium">
                — {inspirationalQuotes[currentQuote].author}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40">
            <div className="text-xl font-bold text-emerald-600">{completedTasks}</div>
            <div className="text-xs text-slate-600 font-medium">Completed</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40">
            <div className="text-xl font-bold text-blue-600">{pendingTasks}</div>
            <div className="text-xs text-slate-600 font-medium">In Progress</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40">
            <div className="text-xl font-bold text-purple-600">{totalTasks}</div>
            <div className="text-xs text-slate-600 font-medium">Total Tasks</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}