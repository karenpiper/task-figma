import React from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from './ui/badge';
import { ArrowRight } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  priority: string;
  project?: string;
  column_id: string;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
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
      
      {/* Priority accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityConfig.color}`}></div>
      
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
            <button className="p-1 rounded-md hover:bg-slate-100/60 transition-colors duration-200 group">
              <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-800" />
            </button>
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