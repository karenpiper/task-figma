import React from 'react';
import { useDrag } from 'react-dnd';
import { MoreHorizontal, AlertCircle, Clock, CheckCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

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

  const getStatusConfig = (status: string) => {
    if (status === 'DONE') 
      return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50/80' };
    if (status.includes('BIG TASKS')) 
      return { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50/80' };
    if (status.includes('STANDING TASKS')) 
      return { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50/80' };
    return { icon: Calendar, color: 'text-slate-500', bg: 'bg-slate-50/80' };
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  return (
    <div
      ref={drag}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-move ${
        isDragging 
          ? 'opacity-50 rotate-3 scale-110 z-50' 
          : 'hover:scale-[1.02] hover:shadow-2xl'
      }`}
    >
      {/* Glass card background */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl"></div>
      
      {/* Priority accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityConfig.color}`}></div>
      
      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-2 leading-tight">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
            )}
          </div>
          <div className="flex gap-1">
            {task.status !== 'DONE' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-xl hover:bg-green-500/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete?.();
                }}
              >
                <CheckCircle className="w-3 h-3 text-green-600" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-xl hover:bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Status indicator */}
        {task.status && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} backdrop-blur-sm border border-white/40 mb-4`}>
            <statusConfig.icon className={`w-3 h-3 ${statusConfig.color}`} />
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              {task.status}
            </span>
          </div>
        )}
        
        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.labels.map((label, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-blue-50/80 text-blue-700 border-blue-200/60 backdrop-blur-sm hover:bg-blue-100/80 transition-colors duration-200"
              >
                {label}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/30">
          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, index) => (
                <Avatar key={index} className="w-7 h-7 border-2 border-white shadow-sm">
                  <AvatarFallback className={`text-xs text-white ${assignee.color} font-medium`}>
                    {assignee.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          ) : (
            <div></div>
          )}
          
          {/* Priority badge */}
          <Badge 
            variant="outline" 
            className={`text-xs border backdrop-blur-sm ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border} font-medium`}
          >
            {task.priority}
          </Badge>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
  );
}