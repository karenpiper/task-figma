import React from 'react';
import { Search, Filter, Calendar, Users, Settings, Bell } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  onToggleParticles: () => void;
  onToggleStats: () => void;
  isStatsCollapsed: boolean;
}

export function Header({ onToggleParticles, onToggleStats, isStatsCollapsed }: HeaderProps) {
  return (
    <div className="relative glass-panel border-b border-white/20">
      <div className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Karenban
            </h1>
            <p className="text-slate-600 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Modern toggle switches */}
            <div className="flex items-center gap-6 px-6 py-3 glass-panel rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">Auto-move completed</span>
                <div className="relative w-12 h-6 gradient-primary rounded-full shadow-inner">
                  <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 right-0.5 shadow-lg transition-transform duration-200"></div>
                </div>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">Show overdue alerts</span>
                <div className="relative w-12 h-6 gradient-success rounded-full shadow-inner">
                  <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 right-0.5 shadow-lg transition-transform duration-200"></div>
                </div>
              </div>
            </div>
            
            {/* Modern action buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 w-12 p-0 rounded-xl glass-panel hover:scale-110 transition-all duration-200"
                onClick={onToggleParticles}
                title="Toggle particles"
              >
                <Bell className="w-5 h-5 text-slate-700" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 w-12 p-0 rounded-xl glass-panel hover:scale-110 transition-all duration-200"
                onClick={onToggleStats}
                title={isStatsCollapsed ? "Expand stats" : "Collapse stats"}
              >
                <Settings className="w-5 h-5 text-slate-700" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Modern search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <Input 
              placeholder="Search tasks, descriptions, or tags..."
              className="pl-14 h-14 input-modern text-lg placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}