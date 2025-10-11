import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ThisWeek } from './components/ThisWeek';
import { AllTasksView } from './components/AllTasksView';
import CoachPage from './components/CoachPage';
import { Header } from './components/Header';
import { FocusZone } from './components/FocusZone';
import { AchievementSystem } from './components/AchievementSystem';
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
    <div className="h-screen bg-gray-50">
      {/* Clean Deployment Indicator */}
      <div className="bg-blue-600 text-white text-center py-2 font-medium text-sm">
        ✨ KARENBAN - CLEAN DESIGN DEPLOYED! ✨
      </div>
      
      {/* Main container with clean design */}
      <div className="flex h-full">
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
                  tasks={tasks}
                  teamMembers={teamMembers}
                  createTask={createTask}
                  moveTask={moveTask}
                  createCategory={createCategory}
                  deleteCategory={deleteCategory}
                />
              ) : currentView === 'week' ? (
                <ThisWeek 
                  tasks={tasks}
                  teamMembers={teamMembers}
                  onCreateTask={createTask}
                  onMoveTask={moveTask}
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
          </div>
        </div>
      </div>

      {/* Achievement system - absolutely positioned overlay */}
      <AchievementSystem 
        trigger={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />

      {/* Focus zone for keyboard navigation */}
      <FocusZone />

      {/* Particle celebration system - absolutely positioned overlay */}
      <ParticleSystem 
        trigger={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />
    </div>
  );
}