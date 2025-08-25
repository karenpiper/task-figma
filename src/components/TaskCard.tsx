import React from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from './ui/badge';

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
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, type: 'TASK' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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
      ref={drag}
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-move ${
        isDragging 
          ? 'opacity-50 rotate-3 scale-110 z-50' 
          : 'hover:scale-[1.02] hover:shadow-lg'
      }`}
    >
      {/* Glass card background */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl"></div>
      
      {/* Priority accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityConfig.color}`}></div>
      
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Title */}
        <h4 className="font-medium text-slate-800 mb-3 leading-tight text-sm">{task.title}</h4>
        
        {/* Footer with project tag and priority indicator */}
        <div className="flex items-center justify-between">
          {task.project ? (
            <Badge 
              variant="outline" 
              className="text-xs bg-blue-50/80 text-blue-700 border-blue-200/60 backdrop-blur-sm hover:bg-blue-100/80 transition-colors duration-200"
            >
              {task.project}
            </Badge>
          ) : (
            <div></div>
          )}
          
          {/* Priority indicator */}
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${priorityConfig.color} shadow-sm`}></div>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    </div>
  );
}