import React, { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from './ui/badge';
import { ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Task {
  id: number;
  title: string;
  priority: string;
  project?: string;
  column_id: string;
  category_id?: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
  onMoveTask?: (taskId: number, targetColumnId: string, targetCategoryId?: string) => Promise<void>;
  availableColumns?: Array<{ id: string; title: string; categories?: Array<{ id: string; name: string }> }>;
}

export function TaskCard({ task, onComplete, onMoveTask, availableColumns }: TaskCardProps) {
  const [isQuickMoveOpen, setIsQuickMoveOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  
  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsQuickMoveOpen(false);
      }
    };

    if (isQuickMoveOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isQuickMoveOpen]);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { id: task.id, type: 'TASK', title: task.title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Cast the dragRef to the correct type for React
  const dragRefCallback = React.useCallback((node: HTMLDivElement | null) => {
    if (dragRef) {
      (dragRef as any)(node);
    }
  }, [dragRef]);

  // Get category-based color for the top border
  const getCategoryColor = (columnId: string, categoryId?: string | null) => {
    // First check if it's a specific category within a column
    if (categoryId) {
      switch (categoryId) {
        // Standing categories
        case 'standing':
        case 'follow_up_standing':
        case 'personal_standing':
          return 'from-emerald-400 to-emerald-500';
        
        // Comms categories
        case 'comms':
        case 'follow_up_comms':
        case 'personal_comms':
          return 'from-blue-400 to-blue-500';
        
        // Big tasks categories
        case 'big_tasks':
        case 'follow_up_big_tasks':
        case 'personal_big_tasks':
          return 'from-purple-400 to-purple-500';
        
        // Done categories
        case 'done':
        case 'follow_up_done':
        case 'personal_done':
        case 'completed':
          return 'from-green-400 to-green-500';
        
        // Personal categories
        case 'personal_standing':
        case 'personal_comms':
        case 'personal_big_tasks':
        case 'personal_done':
          return 'from-indigo-400 to-indigo-500';
      }
    }
    
    // Fall back to column-based colors
    switch (columnId) {
      case 'uncategorized':
        return 'from-slate-400 to-slate-500';
      
      case 'today':
        return 'from-orange-400 to-orange-500';
      
      case 'personal':
        return 'from-indigo-400 to-indigo-500';
      
      case 'follow-up':
        return 'from-pink-400 to-pink-500';
      
      case 'later':
      case 'future':
        return 'from-violet-400 to-violet-500';
      
      case 'completed':
      case 'done':
        return 'from-green-400 to-green-500';
      
      default:
        // For dynamic date columns (Today + 1, Today + 2, etc.)
        if (columnId.includes('Today +')) {
          return 'from-amber-400 to-amber-500';
        }
        return 'from-slate-400 to-slate-500';
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'from-red-400 to-red-500',
          bg: 'bg-red-50/80',
          text: 'text-red-700',
          border: 'border-red-200/60'
        };
      case 'medium':
        return {
          color: 'from-yellow-400 to-orange-500',
          bg: 'bg-yellow-50/80',
          text: 'text-yellow-700',
          border: 'border-yellow-200/60'
        };
      case 'low':
        return {
          color: 'from-green-400 to-emerald-500',
          bg: 'bg-green-50/80',
          text: 'text-green-700',
          border: 'border-green-200/60'
        };
      default:
        return {
          color: 'from-slate-400 to-slate-500',
          bg: 'bg-slate-50/80',
          text: 'text-slate-700',
          border: 'border-slate-200/60'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const categoryColor = getCategoryColor(task.column_id, task.category_id);

  const handleQuickMove = async (targetColumnId: string, targetCategoryId?: string) => {
    if (onMoveTask) {
      try {
        await onMoveTask(task.id, targetColumnId, targetCategoryId);
        setIsQuickMoveOpen(false);
      } catch (error) {
        console.error('Quick move failed:', error);
      }
    }
  };

  return (
    <div
      ref={dragRefCallback}
      draggable
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-move ${
        isDragging 
          ? 'opacity-60 rotate-2 scale-105 z-50 shadow-2xl' 
          : 'hover:scale-[1.02] hover:shadow-lg hover:rotate-1'
      }`}
      style={{
        transform: isDragging ? 'rotate(5deg)' : undefined,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Glass card background */}
      <div className={`absolute inset-0 backdrop-blur-xl border rounded-xl ${
        isDragging 
          ? 'bg-white/80 border-blue-300/60' 
          : 'bg-white/60 border-white/40'
      }`}></div>
      
      {/* Category-based color accent (replaces priority accent) */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColor}`}></div>
      
      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Title */}
        <h4 className="font-medium text-slate-800 mb-3 leading-tight text-sm">{task.title}</h4>
        
        {/* Footer with project tag, move button, and priority indicator */}
        <div className="flex items-center justify-between">
          {task.project ? (
            <Badge 
              variant="outline" 
              className="text-xs bg-blue-50/80 text-blue-700 border-blue-200/60 backdrop-blur-sm hover:bg-blue-100/80 transition-colors duration-200"
            >
              {task.project}
            </Badge>
          ) : (
            <div className="w-16 h-5 bg-slate-100/60 rounded-md"></div>
          )}
          
          <div className="flex items-center gap-2">
                            {/* Quick Move Dropdown */}
                {onMoveTask && availableColumns && (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsQuickMoveOpen(!isQuickMoveOpen)}
                      className="p-1 rounded-md hover:bg-slate-100/60 transition-colors duration-200 group"
                    >
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-800" />
                    </button>
                    
                    {/* Portal-based Dropdown Menu */}
                    {isQuickMoveOpen && createPortal(
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-[9998] bg-transparent" 
                          onClick={() => setIsQuickMoveOpen(false)} 
                        />
                        
                        {/* Dropdown Menu - positioned relative to button */}
                        <div 
                          className="fixed w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999]"
                          style={{
                            top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().top - 200 : 0,
                            left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().right - 192 : 0,
                          }}
                        >
                          <div className="py-2">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              Quick Move
                            </div>
                            {availableColumns
                              .filter(col => col.id !== task.column_id)
                              .map(column => (
                                <div key={column.id}>
                                  <button
                                    onClick={() => handleQuickMove(column.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    {column.title}
                                  </button>
                                  {/* Show categories if they exist */}
                                  {column.categories && column.categories.length > 0 && (
                                    <div className="ml-4">
                                      {column.categories.map(category => (
                                        <button
                                          key={category.id}
                                          onClick={() => handleQuickMove(column.id, category.id)}
                                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                        >
                                          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                          {category.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </>,
                      document.body
                    )}
                  </div>
                )}
            
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
              {task.priority}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      {!isDragging && (
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
      )}
    </div>
  );
}