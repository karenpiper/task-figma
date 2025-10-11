import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, AlertTriangle, Eye, Home, BarChart3, Users, Settings, UserPlus, Filter, ChevronDown, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TeamManagement } from './TeamManagement';
import { OneOnOneMode } from './OneOnOneMode';
import { TeamMember, Task } from '../hooks/useTasksNew';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SidebarProps {
  onCelebrate?: () => void;
  teamMembers: TeamMember[];
  createTeamMember: (memberData: Partial<TeamMember>) => Promise<any>;
  updateTeamMember: (id: number, updates: Partial<TeamMember>) => Promise<any>;
  deleteTeamMember: (id: number) => Promise<any>;
  tasks: Task[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ 
  onCelebrate, 
  teamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  tasks,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [activeView, setActiveView] = useState<'main' | 'team' | '1on1'>('main');
  const [selectedPerson, setSelectedPerson] = useState<string>('all');

  const viewItems = [
    { icon: Eye, label: 'Today', active: activeView === 'main', onClick: () => setActiveView('main') },
    { icon: Calendar, label: 'My calendar', active: false, onClick: () => setActiveView('main') },
    { icon: BarChart3, label: 'Analytics', active: false, onClick: () => setActiveView('main') },
    { icon: Users, label: 'Team', active: activeView === 'team', onClick: () => setActiveView('team') },
  ];

  // Mock data for demonstration - in real app this would come from the database
  const todayStats = {
    total: 24,
    completed: 8,
    pending: 16,
    overdue: 3
  };

  const weekStats = {
    total: 67,
    completed: 23,
    pending: 44,
    progress: 34
  };

  const personStats = {
    total: 156,
    assigned: 89,
    unassigned: 67
  };

  if (activeView === '1on1') {
    return (
      <OneOnOneMode
        teamMembers={teamMembers}
        tasks={tasks}
        onClose={() => setActiveView('main')}
      />
    );
  }

  if (activeView === 'team') {
    return (
      <div className={`${isCollapsed ? 'w-16' : 'w-80'} relative transition-all duration-300 ease-in-out`}>
        {/* Beautiful glass background */}
        <div className="absolute inset-0 bg-gray-50 border-r border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30"></div>
        </div>
        
        {/* Collapse/Expand Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-all duration-200 hover:scale-110"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}
        
        <div className="relative z-10 h-full flex flex-col text-gray-900">
          {/* Header */}
          <div className={`${isCollapsed ? 'p-4' : 'p-8'} border-b border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                  <div>
                    <h2 className="text-xl font-medium">Team Management</h2>
                    <p className="text-gray-500 text-sm">Manage team members</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={() => setActiveView('main')}
                  className="w-8 h-8 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 transition-all duration-200 border border-gray-200"
                >
                  <Home className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
          
          {/* Team Management Content */}
          {!isCollapsed && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-lg">
                <TeamManagement
                  teamMembers={teamMembers}
                  onCreateMember={createTeamMember}
                  onUpdateMember={updateTeamMember}
                  onDeleteMember={deleteTeamMember}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} relative transition-all duration-300 ease-in-out`}>
      {/* Beautiful glass background */}
      <div className="absolute inset-0 bg-gray-50 border-r border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30"></div>
      </div>
      
      {/* Collapse/Expand Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-all duration-200 hover:scale-110"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      )}
      
      <div className="relative z-10 h-full flex flex-col text-gray-900">
        {/* Header */}
        <div className={`${isCollapsed ? 'p-4' : 'p-8'} border-b border-gray-200`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-medium">Task Manager</h2>
                <p className="text-gray-500 text-sm">Friday Aug 22</p>
              </div>
            )}
          </div>
          
          {/* Quick stats */}
          {!isCollapsed && (
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 hover:bg-white/90 transition-all duration-200 cursor-pointer shadow-sm"
                onClick={onCelebrate}
              >
                <div className="text-2xl font-medium hover:text-blue-600 transition-colors">{todayStats.total}</div>
                <div className="text-xs text-gray-500">Total Tasks</div>
              </div>
              <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm">
                <div className="text-2xl font-medium">{todayStats.overdue}</div>
                <div className="text-xs text-gray-500">Overdue</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Navigation */}
        {!isCollapsed && (
          <nav className="flex-1 p-6">
            <div className="space-y-2 mb-8">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-4 font-medium">OVERVIEW</h3>
              
              {/* Today Section */}
              <div className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/60 shadow-sm cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Today</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-white/80 text-gray-700 border border-white/60 backdrop-blur-sm font-medium"
                >
                  {todayStats.pending}
                </Badge>
              </div>

              {/* This Week Section */}
              <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-white/60 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center group-hover:bg-white/80 transition-all duration-200">
                    <BarChart3 className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </div>
                  <span className="font-medium">This Week</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-white/60 text-gray-600 border border-white/40 backdrop-blur-sm font-medium"
                >
                  {weekStats.pending}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-4 font-medium">VIEWS</h3>
              <div className="space-y-2">
                {viewItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={item.onClick}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                      item.active 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/60 shadow-sm' 
                        : 'hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-white/60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center group-hover:bg-white/80 transition-all duration-200">
                      <item.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1:1 Meeting Button */}
            <div className="mt-6">
              <Button 
                onClick={() => setActiveView('1on1')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 border-0 shadow-lg"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start 1:1 Meeting
              </Button>
            </div>
          </nav>
        )}
        
        {/* Bottom section */}
        <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-t border-gray-200`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 hover:bg-white/90 transition-all duration-200 cursor-pointer shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Settings</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}