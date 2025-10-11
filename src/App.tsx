import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Bell, SlidersHorizontal } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TaskBoard } from './components/TaskBoard';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Top Header */}
          <div className="border-b border-gray-200/50 bg-white/50 backdrop-blur-sm px-8 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-900">TODAY</h1>
                <span className="text-xl">🍃</span>
              </div>
              <p className="text-xs text-gray-500">17 tasks, updated 20 sec ago</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white/80">
                <Bell className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white/80">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl gap-2 shadow-lg">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-gray-900 text-xs">●</span>
                </div>
                New task
              </Button>
            </div>
          </div>

          {/* Task Board */}
          <div className="flex-1 overflow-hidden">
            <TaskBoard />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}