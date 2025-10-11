import React, { useState } from 'react';

// Clean, simple component structure
function App() {
  const [currentView, setCurrentView] = useState('board');

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <MainContent currentView={currentView} />
      </div>
    </div>
  );
}

// Header Component
function Header() {
  return (
    <header className="app-header">
      <h1 className="app-title">Karenban</h1>
      <button className="new-task-btn">
        <span>+</span>
        New task
      </button>
    </header>
  );
}

// Sidebar Component
function Sidebar({ currentView, onViewChange }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">K</div>
        <div className="logo-text">Karenban</div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <button className="section-header">
            <span>CREATE NEW WEBSITE</span>
            <span className="section-arrow">▶</span>
          </button>
          <div className="section-items">
            <button 
              className={`nav-item ${currentView === 'board' ? 'active' : ''}`}
              onClick={() => onViewChange('board')}
            >
              <span>☁️</span>
              <span>Today</span>
              <span className="item-count">12</span>
            </button>
            <button className="nav-item">
              <span>📅</span>
              <span>Calendar</span>
              <span className="item-count">87</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}

// Main Content Component
function MainContent({ currentView }) {
  return (
    <main className="app-main">
      <div className="content-header">
        <h2 className="content-title">TODAY</h2>
        <div className="content-subtitle">
          <span>🔄</span>
          <span>17 tasks, updated 20 sec ago</span>
        </div>
      </div>
      
      <div className="nav-tabs">
        <button className={`nav-tab ${currentView === 'board' ? 'active' : ''}`}>
          📋 Board
        </button>
        <button className={`nav-tab ${currentView === 'week' ? 'active' : ''}`}>
          📅 This Week
        </button>
        <button className={`nav-tab ${currentView === 'all-tasks' ? 'active' : ''}`}>
          📝 All Tasks
        </button>
        <button className={`nav-tab ${currentView === 'coach' ? 'active' : ''}`}>
          🎯 Coach
        </button>
      </div>
      
      <div className="content-area">
        {currentView === 'board' && <BoardView />}
        {currentView === 'week' && <WeekView />}
        {currentView === 'all-tasks' && <AllTasksView />}
        {currentView === 'coach' && <CoachView />}
      </div>
    </main>
  );
}

// View Components
function BoardView() {
  return (
    <div className="board-view">
      <div className="columns-container">
        <div className="column">
          <div className="column-header">
            <h3 className="column-title">Concept</h3>
            <span className="column-meta">3 tasks, 2 hours</span>
          </div>
          <div className="column-tasks">
            <TaskCard 
              title="Define Goals and Objectives"
              description="Clearly outline the purpose of the website, its target audience."
              status="progress"
              priority="urgent"
              time="30 min"
              comments="2"
            />
          </div>
        </div>
        
        <div className="column">
          <div className="column-header">
            <h3 className="column-title">Wireframe</h3>
            <span className="column-meta">2 tasks, 1.5 hours</span>
          </div>
          <div className="column-tasks">
            <TaskCard 
              title="Create Wireframes"
              description="Design the basic layout and structure of the website."
              status="review"
              priority="high"
              time="90 min"
              comments="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekView() {
  return <div className="week-view">This Week View - Coming Soon</div>;
}

function AllTasksView() {
  return <div className="all-tasks-view">All Tasks View - Coming Soon</div>;
}

function CoachView() {
  return <div className="coach-view">Coach View - Coming Soon</div>;
}

// Task Card Component
function TaskCard({ title, description, status, priority, time, comments }) {
  return (
    <div className="task-card">
      <h4 className="task-title">{title}</h4>
      <p className="task-description">{description}</p>
      <div className="task-meta">
        <span className={`status-badge status-${status}`}>
          {status.toUpperCase()}
        </span>
        <span className={`priority priority-${priority}`}>
          🚩 {priority}
        </span>
        <span className="time-estimate">
          🕐 {time}
        </span>
        <span className="comments">
          💬 {comments}
        </span>
      </div>
    </div>
  );
}

export default App;