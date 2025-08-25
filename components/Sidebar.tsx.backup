import React from 'react';
import { Calendar, CheckCircle, Clock, XCircle, AlertTriangle, Eye, Home, BarChart3, Users, Settings } from 'lucide-react';
import { Badge } from './ui/badge';

interface SidebarProps {
  onCelebrate?: () => void;
}

export function Sidebar({ onCelebrate }: SidebarProps) {
  const navigationItems = [
    { icon: CheckCircle, label: 'T+1 Complete', count: null, active: false },
    { icon: Calendar, label: 'T+day', count: null, active: false },
    { icon: Clock, label: '8 Unassigned', count: 8, active: false },
    { icon: XCircle, label: '8 Blocked', count: 8, active: false },
    { icon: AlertTriangle, label: '3 Overdue', count: 3, active: false },
  ];

  const viewItems = [
    { icon: Eye, label: 'Today', active: true },
    { icon: Calendar, label: 'My calendar', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Users, label: 'Team', active: false },
  ];

  return (
    <div className="w-80 relative">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/85 to-slate-900/90 backdrop-blur-xl border-r border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col text-white">
        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Task Manager</h2>
              <p className="text-slate-300 text-sm">Friday Aug 22</p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer"
              onClick={onCelebrate}
            >
              <div className="text-2xl font-medium hover:text-blue-300 transition-colors">24</div>
              <div className="text-xs text-slate-300">Total Tasks</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-medium">8</div>
              <div className="text-xs text-slate-300">Due Today</div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2 mb-8">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-medium">STATUS</h3>
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                  item.active 
                    ? 'bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm border border-white/20 shadow-xl' 
                    : 'hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                    <item.icon className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/15 text-white border border-white/20 backdrop-blur-sm font-medium"
                  >
                    {item.count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-medium">VIEWS</h3>
            <div className="space-y-2">
              {viewItems.map((item, index) => (
                <div
                  key={index}
                  className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm border border-white/20 shadow-xl' 
                      : 'hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                    <item.icon className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>
        
        {/* Bottom section */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}