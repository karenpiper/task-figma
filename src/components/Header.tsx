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
    <div className="relative border-b border-white/20 bg-white/10 backdrop-blur-xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
      
      <div className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-medium bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
              Task Board
            </h1>
            <p className="text-slate-600/80 mt-1 font-medium">Focus on now and later</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Glass toggle switches */}
            <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Auto-move completed</span>
                <div className="relative w-10 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-inner">
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5 shadow-md transition-transform duration-200"></div>
                </div>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Show overdue alerts</span>
                <div className="relative w-10 h-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-inner">
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5 shadow-md transition-transform duration-200"></div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200"
                onClick={onToggleParticles}
                title="Toggle particles"
              >
                <Bell className="w-4 h-4 text-slate-700" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200"
                onClick={onToggleStats}
                title={isStatsCollapsed ? "Expand stats" : "Collapse stats"}
              >
                <Settings className="w-4 h-4 text-slate-700" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Glass search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <Input 
              placeholder="Search tasks, descriptions, or tags..."
              className="pl-12 h-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl focus:bg-white/40 focus:border-white/60 transition-all duration-200 placeholder:text-slate-500 text-slate-700 shadow-lg"
            />
          </div>
          
          {/* Glass filter buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 px-6 bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl hover:bg-white/35 transition-all duration-200 text-slate-700 font-medium shadow-lg"
            >
              <Filter className="w-4 h-4 mr-2" />
              All Priority
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 px-6 bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl hover:bg-white/35 transition-all duration-200 text-slate-700 font-medium shadow-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              All Assignees
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 px-6 bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl hover:bg-white/35 transition-all duration-200 text-slate-700 font-medium shadow-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              This Week
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}