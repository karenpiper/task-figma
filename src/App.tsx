import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ThisWeek } from './components/ThisWeek';
import { AllTasksView } from './components/AllTasksView';
import CoachPage from './components/CoachPage';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'board' | 'week' | 'all-tasks' | 'coach'>('board');
  
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

  // General celebration trigger for sidebar
  const triggerCelebration = useCallback(() => {
    setShowParticles(true);
  }, []);

  // Task completion celebration with taskId (for TaskColumn)
  const handleTaskComplete = useCallback((taskId: number): Promise<void> => {
    setShowParticles(true);
    return Promise.resolve();
  }, []);

  // Task completion celebration without taskId (for TaskCard in ThisWeek)
  const handleTaskCompleteSimple = useCallback((): void => {
    setShowParticles(true);
  }, []);

  // Task completion celebration without taskId (for TaskCard in TaskCategory)
  const handleTaskCompleteSimpleCategory = useCallback((): void => {
    setShowParticles(true);
  }, []);

  // Task completion celebration with taskId for ThisWeek (needs to be converted to Promise)
  const handleTaskCompleteForWeek = useCallback((taskId: number): Promise<void> => {
    setShowParticles(true);
    return Promise.resolve();
  }, []);

  const toggleStats = useCallback(() => {
    setIsStatsCollapsed(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="bg-blue-600 text-white text-center py-2 font-medium text-sm">
          ✨ KARENBAN - CLEAN DESIGN DEPLOYED! ✨
        </div>
        <div className="h-screen bg-gray-50 flex">
            {/* Left sidebar with celebration trigger */}
            <Sidebar 
              onCelebrate={triggerCelebration}
              teamMembers={teamMembers}
              createTeamMember={createTeamMember}
              updateTeamMember={updateTeamMember}
              deleteTeamMember={deleteTeamMember}
              tasks={tasks}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />
            

            
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header section */}
              <Header 
                onToggleParticles={() => setShowParticles(!showParticles)}
                onToggleStats={() => setIsStatsCollapsed(!isStatsCollapsed)}
                isStatsCollapsed={isStatsCollapsed}
              />
              
              {/* Clean Navigation Tabs */}
              <div className="px-6 pt-4">
                <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button
                    onClick={() => setCurrentView('board')}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      currentView === 'board'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    📋 Board
                  </button>
                  <button
                    onClick={() => setCurrentView('week')}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      currentView === 'week'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    📅 This Week
                  </button>
                  <button
                    onClick={() => setCurrentView('all-tasks')}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      currentView === 'all-tasks'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    📝 All Tasks
                  </button>
                  <button
                    onClick={() => setCurrentView('coach')}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      currentView === 'coach'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    🎯 Coach
                  </button>
                </div>
              </div>

              {/* Main content area with clean design */}
              <div className="flex-1 flex gap-6 p-6 overflow-hidden min-h-0 bg-white">
                {/* Dynamic content based on current view */}
                <div className="flex-1 min-w-0">
                  {currentView === 'board' ? (
                    <KanbanBoard 
                      onTaskComplete={handleTaskComplete}
                      onTaskCompleteSimple={handleTaskCompleteSimpleCategory}
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
                  ) : currentView === 'week' ? (
                    <ThisWeek
                      teamMembers={teamMembers}
                      onCreateTask={createTask}
                      onMoveTask={moveTask}
                      onDeleteCategory={deleteCategory}
                      createTeamMember={createTeamMember}
                      onTaskComplete={handleTaskCompleteForWeek}
                    />
                  ) : currentView === 'coach' ? (
                    <CoachPage />
                  ) : (
                    <AllTasksView
                      tasks={tasks}
                      teamMembers={teamMembers}
                      onCreateTask={createTask}
                      onMoveTask={moveTask}
                      onTaskComplete={handleTaskComplete}
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
                        <FocusZone 
                          totalTasks={tasks.length}
                          completedTasks={tasks.filter(task => task.column_id === 'completed').length}
                          pendingTasks={tasks.filter(task => task.column_id !== 'completed').length}
                        />
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
    </>
  );
}