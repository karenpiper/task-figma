import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Bell, SlidersHorizontal, Search, Filter, Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TaskBoard } from './components/TaskBoard';
import { Button } from './components/ui/button';
import { FloatingBlobs } from './components/FloatingBlobs';

export default function App() {
  console.log('🎯 App component rendering');
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex h-screen bg-gradient-to-br from-mgmt-beige via-white to-mgmt-pink">
        <FloatingBlobs />
        
        {/* Sidebar */}
        <div className="relative z-10">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Top Header */}
          <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-gray-900">TODAY</h1>
                  <span className="text-lg">🍃</span>
                </div>
                <p className="text-sm text-gray-500">17 tasks, updated 20 sec ago</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="mgmt-input pl-10 pr-4 py-2 w-64 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-mgmt-pink/20 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-mgmt-purple/20 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              
              {/* Gradient Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mgmt-green to-mgmt-lime flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                BG
              </div>
              
              <Button className="mgmt-button bg-mgmt-green text-white hover:bg-mgmt-sage px-6 py-2 gap-2">
                <Plus className="w-4 h-4" />
                New task
              </Button>
            </div>
          </div>

          {/* Task Board */}
          <div className="flex-1 overflow-hidden">
            {console.log('🎯 About to render TaskBoard')}
            <TaskBoard />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}