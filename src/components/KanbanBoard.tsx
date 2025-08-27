import React from 'react';
import { Plus } from 'lucide-react';
import { TaskColumn } from './TaskColumn';
import { Column, TeamMember, Task } from '../hooks/useTasksNew';

interface KanbanBoardProps {
  onTaskComplete?: (taskId: number) => Promise<void>;
  columns: Column[];
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: Partial<Task>) => Promise<any>;
  moveTask: (taskId: number, columnId: string, categoryId?: string) => Promise<void>;
  createCategory: (categoryData: { name: string; column_id: string; order_index?: number }) => Promise<any>;
  deleteCategory: (categoryId: string) => Promise<void>;
  createTeamMember: (memberData: { name: string; email?: string }) => Promise<any>;
}

export function KanbanBoard({ 
  onTaskComplete, 
  columns, 
  teamMembers, 
  loading, 
  error, 
  createTask, 
  moveTask, 
  createCategory, 
  deleteCategory,
  createTeamMember
}: KanbanBoardProps) {

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white/80 rounded-full"></div>
          </div>
          <h3 className="font-medium text-slate-600 mb-2">Loading Board</h3>
          <p className="text-sm text-slate-500">Fetching your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200/60 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="font-medium text-red-600 mb-2">Error Loading Board</h3>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Create a wrapper function that matches the expected signature
  const handleTaskComplete = React.useCallback((taskId: number): Promise<void> => {
    if (onTaskComplete) {
      return onTaskComplete(taskId);
    }
    return Promise.resolve();
  }, [onTaskComplete]);

  return (
    <div className="flex-1 p-8 overflow-x-auto">
      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10 flex gap-6 min-w-max pb-8">
        {columns.map((column) => (
          <TaskColumn 
            key={column.id} 
            column={column} 
            onTaskComplete={handleTaskComplete}
            onCreateTask={createTask}
            onMoveTask={moveTask}
            onCreateCategory={createCategory}
            onDeleteCategory={deleteCategory}
            teamMembers={teamMembers}
            createTeamMember={createTeamMember}
          />
        ))}
        
        {/* Add Column Button */}
        <div className="w-80 flex-shrink-0">
          <div className="h-full min-h-[600px] rounded-3xl border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center group cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-200">
                <Plus className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-medium text-slate-600 mb-2">Add Column</h3>
              <p className="text-sm text-slate-500">Create a new task column</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}