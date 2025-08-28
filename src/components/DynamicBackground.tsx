import React, { useState, useEffect } from 'react';

interface TimeOfDayGradient {
  from: string;
  via: string;
  to: string;
  name: string;
}

export function DynamicBackground({ children }: { children: React.ReactNode }) {
  const [currentGradient, setCurrentGradient] = useState<TimeOfDayGradient>({
    from: 'from-slate-900',
    via: 'via-purple-900',
    to: 'to-slate-900',
    name: 'default'
  });

  // Define gradients for different times of day
  const timeGradients: TimeOfDayGradient[] = [
    // Early Morning (5:00 - 7:00) - Soft dawn colors
    { from: 'from-blue-900', via: 'via-indigo-800', to: 'to-purple-900', name: 'dawn' },
    
    // Morning (7:00 - 11:00) - Bright, energetic colors
    { from: 'from-blue-500', via: 'via-cyan-400', to: 'to-blue-600', name: 'morning' },
    
    // Midday (11:00 - 14:00) - Bright, vibrant colors
    { from: 'from-cyan-400', via: 'via-blue-300', to: 'to-indigo-400', name: 'midday' },
    
    // Afternoon (14:00 - 17:00) - Warm, golden colors
    { from: 'from-orange-400', via: 'via-yellow-300', to: 'to-orange-500', name: 'afternoon' },
    
    // Early Evening (17:00 - 19:00) - Golden hour colors
    { from: 'from-orange-500', via: 'via-red-400', to: 'to-pink-500', name: 'golden-hour' },
    
    // Evening (19:00 - 21:00) - Warm, cozy colors
    { from: 'from-purple-600', via: 'via-pink-500', to: 'to-red-600', name: 'evening' },
    
    // Night (21:00 - 23:00) - Deep, calming colors
    { from: 'from-indigo-900', via: 'via-purple-800', to: 'to-slate-900', name: 'night' },
    
    // Late Night (23:00 - 5:00) - Deep, mysterious colors
    { from: 'from-slate-900', via: 'via-purple-900', to: 'to-slate-900', name: 'late-night' }
  ];

  // Calculate which gradient to use based on current time
  const getCurrentGradient = (): TimeOfDayGradient => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 7) return timeGradients[0];      // Dawn
    if (hour >= 7 && hour < 11) return timeGradients[1];     // Morning
    if (hour >= 11 && hour < 14) return timeGradients[2];    // Midday
    if (hour >= 14 && hour < 17) return timeGradients[3];    // Afternoon
    if (hour >= 17 && hour < 19) return timeGradients[4];    // Golden Hour
    if (hour >= 19 && hour < 21) return timeGradients[5];    // Evening
    if (hour >= 21 && hour < 23) return timeGradients[6];    // Night
    return timeGradients[7];                                 // Late Night
  };

  // Update gradient every minute and when component mounts
  useEffect(() => {
    const updateGradient = () => {
      const newGradient = getCurrentGradient();
      setCurrentGradient(newGradient);
    };

    // Update immediately
    updateGradient();

    // Update every minute
    const interval = setInterval(updateGradient, 60000);

    return () => clearInterval(interval);
  }, []);

  // Get the current time for display
  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get a friendly time description
  const getTimeDescription = (): string => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 7) return 'Early Morning';
    if (hour >= 7 && hour < 11) return 'Morning';
    if (hour >= 11 && hour < 14) return 'Midday';
    if (hour >= 14 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 19) return 'Golden Hour';
    if (hour >= 19 && hour < 21) return 'Evening';
    if (hour >= 21 && hour < 23) return 'Night';
    return 'Late Night';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentGradient.from} ${currentGradient.via} ${currentGradient.to} transition-all duration-1000 ease-in-out`}>
      {/* Time indicator */}
      <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>{getTimeDescription()}</span>
          <span className="text-white/70">•</span>
          <span>{getCurrentTime()}</span>
        </div>
      </div>
      
      {children}
    </div>
  );
} 