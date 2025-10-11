import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ThisWeek } from './components/ThisWeek';
import { AllTasksView } from './components/AllTasksView';
import CoachPage from './components/CoachPage';
import { Header } from './components/Header';
import { ParticleSystem } from './components/ParticleSystem';
import { useTasksNew } from './hooks/useTasksNew';

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

  // Task completion celebration with taskId
  const handleTaskComplete = useCallback((taskId: number): Promise<void> => {
    setShowParticles(true);
    return Promise.resolve();
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
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen">
        {/* Modern Glass Deployment Indicator */}
        <div className="glass-panel-strong text-center py-3 font-semibold text-sm text-modern-bold">
          ✨ KARENBAN - MODERN GLASS DESIGN ✨
        </div>
        
        {/* Main container with glass design */}
        <div className="flex h-full p-4 gap-4">
        {/* Left sidebar */}
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
          
          {/* Modern Glass Navigation Tabs */}
          <div className="px-6 pt-4">
            <div className="nav-glass flex space-x-1">
              <button
                onClick={() => setCurrentView('board')}
                className={`nav-item ${currentView === 'board' ? 'nav-item-active' : ''}`}
              >
                📋 Board
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`nav-item ${currentView === 'week' ? 'nav-item-active' : ''}`}
              >
                📅 This Week
              </button>
              <button
                onClick={() => setCurrentView('all-tasks')}
                className={`nav-item ${currentView === 'all-tasks' ? 'nav-item-active' : ''}`}
              >
                📝 All Tasks
              </button>
              <button
                onClick={() => setCurrentView('coach')}
                className={`nav-item ${currentView === 'coach' ? 'nav-item-active' : ''}`}
              >
                🎯 Coach
              </button>
            </div>
          </div>

          {/* Main content area with glass design */}
          <div className="flex-1 flex gap-6 p-6 overflow-hidden min-h-0">
            {/* Dynamic content based on current view */}
            <div className="flex-1 min-w-0 glass-panel p-6">
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
                  onTaskComplete={handleTaskCompleteForWeek}
                  onDeleteCategory={deleteCategory}
                  createTeamMember={createTeamMember}
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