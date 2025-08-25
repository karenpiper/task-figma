import React, { useEffect, useState } from 'react';

interface TimeOfDay {
  name: string;
  gradient: string;
  accent: string;
  particles: string;
}

export function AmbientLighting() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const timeThemes: Record<string, TimeOfDay> = {
    dawn: {
      name: 'Dawn',
      gradient: 'from-orange-200 via-pink-100 to-yellow-100',
      accent: 'from-orange-400/20 to-pink-500/20',
      particles: 'from-orange-300/10 to-yellow-400/10'
    },
    morning: {
      name: 'Morning',
      gradient: 'from-blue-100 via-cyan-50 to-blue-100',
      accent: 'from-blue-400/20 to-cyan-500/20',
      particles: 'from-blue-300/10 to-cyan-400/10'
    },
    afternoon: {
      name: 'Afternoon',
      gradient: 'from-violet-100 via-blue-50 to-cyan-100',
      accent: 'from-violet-400/20 to-blue-500/20',
      particles: 'from-violet-300/10 to-blue-400/10'
    },
    evening: {
      name: 'Evening',
      gradient: 'from-purple-200 via-indigo-100 to-pink-100',
      accent: 'from-purple-400/25 to-pink-500/25',
      particles: 'from-purple-300/15 to-pink-400/15'
    },
    night: {
      name: 'Night',
      gradient: 'from-slate-200 via-blue-100 to-indigo-100',
      accent: 'from-slate-400/20 to-indigo-500/20',
      particles: 'from-slate-300/10 to-indigo-400/10'
    }
  };

  const getTimeTheme = (date: Date): TimeOfDay => {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 7) return timeThemes.dawn;
    if (hour >= 7 && hour < 12) return timeThemes.morning;
    if (hour >= 12 && hour < 17) return timeThemes.afternoon;
    if (hour >= 17 && hour < 21) return timeThemes.evening;
    return timeThemes.night;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const theme = getTimeTheme(currentTime);

  return (
    <div className="absolute inset-0 transition-all duration-[2000ms] ease-in-out">
      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
      
      {/* Overlay patterns */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${theme.accent}`}></div>
      
      {/* Floating orbs */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br ${theme.particles} rounded-full blur-3xl animate-pulse`}></div>
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br ${theme.particles} rounded-full blur-3xl animate-pulse delay-1000`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br ${theme.particles} rounded-full blur-3xl opacity-50`}></div>
      
      {/* Time indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.accent.replace('/20', '/60').replace('/25', '/75')}`}></div>
            <span className="text-sm font-medium text-slate-700">{theme.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}