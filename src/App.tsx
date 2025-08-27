import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ThisWeek } from './components/ThisWeek';
import { Header } from './components/Header';
import { FocusZone } from './components/FocusZone';
import { AchievementSystem } from './components/AchievementSystem';
import { ParticleSystem } from './components/ParticleSystem';
import { AmbientLighting } from './components/AmbientLighting';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasksNew } from './hooks/useTasksNew';

// Stable DndProvider wrapper to prevent React errors
function StableDndProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-screen bg-background" />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  );
}

export default function App() {
  console.log('🚨 FORCE DEPLOYMENT - NEW APP CODE VERSION LOADED! 🚨');
  
  const [showParticles, setShowParticles] = useState(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'board' | 'week'>('board');
  
  // Lift useTasksNew hook to App level to avoid multiple instances
  const { 
    columns, 
    teamMembers, 
    loading, 
    error, 
    createTask, 
    moveTask, 
    createCategory, 
    deleteCategory,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    tasks
  } = useTasksNew();

  const triggerCelebration = useCallback((taskId: number): Promise<void> => {
    setShowParticles(true);
    return Promise.resolve();
  }, []);

  const toggleStats = useCallback(() => {
    setIsStatsCollapsed(prev => !prev);
  }, []);

  return (
    <StableDndProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* FORCE DEPLOYMENT INDICATOR */}
        <div className="bg-red-600 text-white text-center py-2 font-bold text-lg">
          🚨 NEW CODE VERSION DEPLOYED - useTasksNew HOOK LOADED! 🚨
        </div>
        
        {/* Main container with full viewport height and overflow control */}
        <div className="h-screen relative overflow-hidden bg-background">
          {/* Dynamic ambient lighting layer */}
          <AmbientLighting />
          
          {/* Glass morphism container with proper backdrop blur and transparency */}
          <div className="relative z-10 h-full backdrop-blur-sm bg-white/10 flex">
            {/* Left sidebar with celebration trigger */}
            <Sidebar 
              onCelebrate={triggerCelebration}
              teamMembers={teamMembers}
              createTeamMember={createTeamMember}
              updateTeamMember={updateTeamMember}
              deleteTeamMember={deleteTeamMember}
              tasks={tasks}
            />
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header section */}
              <Header 
                onToggleParticles={() => setShowParticles(!showParticles)}
                onToggleStats={() => setIsStatsCollapsed(!isStatsCollapsed)}
                isStatsCollapsed={isStatsCollapsed}
              />
              
              {/* Navigation Tabs */}
              <div className="px-6 pt-4">
                <div className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-xl p-1 border border-white/30">
                  <button
                    onClick={() => setCurrentView('board')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentView === 'board'
                        ? 'bg-white/80 text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    Main Board
                  </button>
                  <button
                    onClick={() => setCurrentView('week')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentView === 'week'
                        ? 'bg-white/80 text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    This Week
                  </button>
                </div>
              </div>

              {/* Main content grid with proper spacing */}
              <div className="flex-1 flex gap-6 p-6 overflow-hidden min-h-0">
                {/* Dynamic content based on current view */}
                <div className="flex-1 min-w-0">
                  {currentView === 'board' ? (
                    <KanbanBoard 
                      onTaskComplete={triggerCelebration}
                      columns={columns}
                      teamMembers={teamMembers}
                      loading={loading}
                      error={error}
                      createTask={createTask}
                      moveTask={moveTask}
                      createCategory={createCategory}
                      deleteCategory={deleteCategory}
                      createTeamMember={createTeamMember}
                    />
                  ) : (
                    <ThisWeek
                      teamMembers={teamMembers}
                      onCreateTask={createTask}
                      onMoveTask={moveTask}
                      onDeleteCategory={deleteCategory}
                      createTeamMember={createTeamMember}
                    />
                  )}
                </div>
                
                {/* Right sidebar with focus zone and achievements */}
                <div className={`relative transition-all duration-300 ease-in-out ${
                  isStatsCollapsed ? 'w-16' : 'w-96'
                } flex-shrink-0`}>
                  
                  {/* Collapse/Expand Toggle Button */}
                  <button
                    onClick={toggleStats}
                    className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm border border-white/40 rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-all duration-200 hover:scale-110"
                    aria-label={isStatsCollapsed ? "Expand stats" : "Collapse stats"}
                  >
                    {isStatsCollapsed ? (
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  {/* Stats Content */}
                  <div className={`h-full transition-all duration-300 ease-in-out ${
                    isStatsCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}>
                    <div className="space-y-6 overflow-y-auto h-full">
                      {/* Focus tracking and daily progress */}
                      <div className="glass-panel">
                        <FocusZone />
                      </div>
                      
                      {/* Achievement system and gamification */}
                      <div className="glass-panel">
                        <AchievementSystem />
                      </div>
                    </div>
                  </div>

                  {/* Collapsed State Indicator */}
                  {isStatsCollapsed && (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Particle celebration system - absolutely positioned overlay */}
          <ParticleSystem 
            trigger={showParticles} 
            onComplete={() => setShowParticles(false)} 
          />
        </div>
      </div>
    </StableDndProvider>
  );
}