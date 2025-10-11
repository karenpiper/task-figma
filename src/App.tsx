import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
    <div className="h-screen" style={{ backgroundColor: '#f5f5f5' }}>
        {/* Header - Exact Match */}
        <div className="header-reference">
          <h1 className="header-title">Karenban</h1>
          <button className="btn-new-task">
            <span>+</span>
            New task
          </button>
        </div>
        
        {/* Main Layout - Exact Match */}
        <div className="flex h-full">
          {/* Sidebar - Exact Match */}
          <div className="sidebar-reference">
            <div className="sidebar-logo">
              <div className="logo-icon">K</div>
              <div className="logo-text">Karenban</div>
            </div>
            
            {/* Navigation Sections */}
            <div className="sidebar-section">
              <button className="section-header">
                <span>CREATE NEW WEBSITE</span>
                <span className="section-arrow">▶</span>
              </button>
              <div className="section-items">
                <button className={`nav-item-reference ${currentView === 'board' ? 'active' : ''}`} onClick={() => setCurrentView('board')}>
                  <div className="nav-item-left">
                    <span>☁️</span>
                    <span>Today</span>
                  </div>
                  <span className="nav-item-count">12</span>
                </button>
                <button className="nav-item-reference">
                  <div className="nav-item-left">
                    <span>📅</span>
                    <span>Calendar</span>
                  </div>
                  <span className="nav-item-count">87</span>
                </button>
                <button className="nav-item-reference">
                  <div className="nav-item-left">
                    <span>👤</span>
                    <span>View</span>
                  </div>
                  <span>+</span>
                </button>
              </div>
            </div>
            
            <div className="sidebar-section">
              <button className="section-header">
                <span>DESIGN NEW APP</span>
                <span className="section-arrow">▶</span>
              </button>
              <div className="section-items">
                <button className="nav-item-reference">
                  <div className="nav-item-left">
                    <span>☁️</span>
                    <span>Today</span>
                  </div>
                  <span className="nav-item-count">5</span>
                </button>
                <button className="nav-item-reference">
                  <div className="nav-item-left">
                    <span>📅</span>
                    <span>Calendar</span>
                  </div>
                  <span className="nav-item-count">198</span>
                </button>
              </div>
            </div>
            
            <div className="sidebar-section">
              <button className="section-header">
                <span>BUILD A SYSTEM</span>
                <span className="section-arrow">▶</span>
              </button>
              <div className="section-items">
                <button className="nav-item-reference">
                  <div className="nav-item-left">
                    <span>☁️</span>
                    <span>Today</span>
                  </div>
                  <span className="nav-item-count">10</span>
                </button>
                <button className="nav-item-reference">
                  <div className="nav-item-left">
                    <span>📅</span>
                    <span>Calendar</span>
                  </div>
                  <span className="nav-item-count">398</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content - Exact Match */}
          <div className="main-content">
            {/* Content Header */}
            <div className="content-header">
              <h1 className="content-title">TODAY</h1>
              <div className="content-subtitle">
                <span className="refresh-icon">🔄</span>
                <span>17 tasks, updated 20 sec ago</span>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="nav-tabs-reference">
              <button
                onClick={() => setCurrentView('board')}
                className={`nav-tab-reference ${currentView === 'board' ? 'active' : ''}`}
              >
                📋 Board
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`nav-tab-reference ${currentView === 'week' ? 'active' : ''}`}
              >
                📅 This Week
              </button>
              <button
                onClick={() => setCurrentView('all-tasks')}
                className={`nav-tab-reference ${currentView === 'all-tasks' ? 'active' : ''}`}
              >
                📝 All Tasks
              </button>
              <button
                onClick={() => setCurrentView('coach')}
                className={`nav-tab-reference ${currentView === 'coach' ? 'active' : ''}`}
              >
                🎯 Coach
              </button>
            </div>

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

        {/* Particle celebration system - absolutely positioned overlay */}
        <ParticleSystem 
          trigger={showParticles} 
          onComplete={() => setShowParticles(false)} 
        />
      </div>
    </div>
  );
}