import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Plus, MoreHorizontal, Users, X } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  labels: string[];
  assignees?: Array<{
    name: string;
    avatar: string;
    color: string;
  }>;
}

interface TaskCategoryProps {
  columnId: string;
  categoryName: string;
  tasks: Task[];
  onTaskComplete?: () => void;
  onDropTask?: (taskId: string, categoryName: string) => void;
  canAddPeople?: boolean;
  onDeleteCategory?: (categoryName: string) => void;
  isCustomCategory?: boolean;
}

export function TaskCategory({ 
  columnId, 
  categoryName, 
  tasks, 
  onTaskComplete, 
  onDropTask,
  canAddPeople = false,
  onDeleteCategory,
  isCustomCategory = false
}: TaskCategoryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: any) => {
      console.log('Dropped task:', item.id, 'into category:', categoryName, 'in column:', columnId);
      onDropTask?.(item.id, categoryName);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getCategoryConfig = (category: string) => {
    switch (category.toLowerCase()) {
      case 'standing tasks':
        return {
          color: 'from-blue-400 to-blue-500',
          bg: 'bg-blue-50/60',
          text: 'text-blue-700',
          icon: '📋'
        };
      case 'comms':
        return {
          color: 'from-green-400 to-emerald-500',
          bg: 'bg-green-50/60',
          text: 'text-green-700',
          icon: '💬'
        };
      case 'big tasks':
        return {
          color: 'from-purple-400 to-purple-500',
          bg: 'bg-purple-50/60',
          text: 'text-purple-700',
          icon: '🎯'
        };
      case 'done':
        return {
          color: 'from-emerald-400 to-green-500',
          bg: 'bg-emerald-50/60',
          text: 'text-emerald-700',
          icon: '✅'
        };
      default:
        // For people names in blocked column
        return {
          color: 'from-red-400 to-red-500',
          bg: 'bg-red-50/60',
          text: 'text-red-700',
          icon: canAddPeople ? '👤' : '📁'
        };
    }
  };

  const config = getCategoryConfig(categoryName);

  return (
    <div 
      ref={drop}
      className={`mb-4 transition-all duration-300 ${
        isOver ? 'bg-white/40 backdrop-blur-md rounded-2xl border border-white/60' : ''
      }`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3 group">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 hover:bg-white/20 backdrop-blur-sm rounded-xl p-2 transition-all duration-200 flex-1"
        >
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
            <span className="text-sm">{config.icon}</span>
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-slate-800 text-sm">{categoryName}</h4>
            <p className="text-xs text-slate-600">{tasks.length} tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${config.bg} ${config.text} border-0 font-medium text-xs`}
            >
              {tasks.length}
            </Badge>
            <div className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isCustomCategory && onDeleteCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-xl hover:bg-red-100/60 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(categoryName);
              }}
            >
              <X className="w-3 h-3 text-red-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-xl hover:bg-white/30 backdrop-blur-sm"
          >
            <MoreHorizontal className="w-3 h-3 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      {!isCollapsed && (
        <div className="space-y-3 ml-2 pl-4 border-l-2 border-white/30">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onComplete={onTaskComplete} />
          ))}
          
          {/* Add task button */}
          <div className="group">
            <Button 
              variant="ghost" 
              className="w-full h-10 border-2 border-dashed border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-slate-600 hover:text-slate-700 transition-all duration-300 rounded-xl group-hover:scale-[1.01] text-sm"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add task
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}