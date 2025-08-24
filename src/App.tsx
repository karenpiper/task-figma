import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { Header } from './components/Header';
import { FocusZone } from './components/FocusZone';
import { AchievementSystem } from './components/AchievementSystem';
import { ParticleSystem } from './components/ParticleSystem';
import { AmbientLighting } from './components/AmbientLighting';

export default function App() {
  const [showParticles, setShowParticles] = useState(false);

  const triggerCelebration = () => {
    setShowParticles(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Main container with full viewport height and overflow control */}
      <div className="h-screen relative overflow-hidden bg-background">
        {/* Dynamic ambient lighting layer */}
        <AmbientLighting />
        
        {/* Glass morphism container with proper backdrop blur and transparency */}
        <div className="relative z-10 h-full backdrop-blur-sm bg-white/10 flex">
          {/* Left sidebar with celebration trigger */}
          <Sidebar onCelebrate={triggerCelebration} />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header section */}
            <Header />
            
            {/* Main content grid with proper spacing */}
            <div className="flex-1 flex gap-6 p-6 overflow-hidden min-h-0">
              {/* Kanban board - main content area */}
              <div className="flex-1 min-w-0">
                <KanbanBoard onTaskComplete={triggerCelebration} />
              </div>
              
              {/* Right sidebar with focus zone and achievements */}
              <div className="w-96 flex-shrink-0 space-y-6 overflow-y-auto">
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