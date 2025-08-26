import React, { useState, useMemo, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { Header } from './components/Header';
import { FocusZone } from './components/FocusZone';
import { AchievementSystem } from './components/AchievementSystem';
import { ParticleSystem } from './components/ParticleSystem';
import { AmbientLighting } from './components/AmbientLighting';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [showParticles, setShowParticles] = useState(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  
  // Lift useTasks hook to App level to avoid multiple instances
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
  } = useTasks();

  const triggerCelebration = useCallback(() => {
    setShowParticles(true);
  }, []);

  const toggleStats = useCallback(() => {
    setIsStatsCollapsed(!isStatsCollapsed);
  }, [isStatsCollapsed]);

  return (
    <DndProvider backend={HTML5Backend}>
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
            <Header />
            
            {/* Main content grid with proper spacing */}
            <div className="flex-1 flex gap-6 p-6 overflow-hidden min-h-0">
              {/* Kanban board - main content area */}
              <div className="flex-1 min-w-0">
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
                />
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
    </DndProvider>
  );
}