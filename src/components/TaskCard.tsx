import React from 'react';
import { useDrag } from 'react-dnd';
import { User, Clock, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface TaskCardProps {
  id?: string;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  userIcon: string;
  time: string;
  comments: number;
  hasGradient?: boolean;
  columnId?: string;
  subCategoryId?: string;
}

export function TaskCard({ 
  id = 'task-' + Math.random().toString(36).substr(2, 9),
  title, 
  description, 
  status, 
  statusColor, 
  userIcon, 
  time, 
  comments,
  hasGradient,
  columnId,
  subCategoryId
}: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { 
      id, 
      title, 
      description, 
      status, 
      statusColor, 
      userIcon, 
      time, 
      comments, 
      hasGradient,
      columnId,
      subCategoryId
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, title, description, status, statusColor, userIcon, time, comments, hasGradient, columnId, subCategoryId]);
  const getBadgeClass = (color: string) => {
    const colors: Record<string, string> = {
      orange: 'bg-orange-500 text-white hover:bg-orange-600',
      purple: 'bg-purple-500 text-white hover:bg-purple-600',
      cyan: 'bg-cyan-500 text-white hover:bg-cyan-600',
      teal: 'bg-teal-400 text-white hover:bg-teal-500',
      gray: 'bg-gray-700 text-white hover:bg-gray-800',
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  return (
    <div 
      ref={drag as any}
      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all cursor-move ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      {hasGradient && (
        <div className="w-full h-32 rounded-lg mb-3 bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300" />
      )}
      
      <h3 className="text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={getBadgeClass(statusColor)}>
          {status}
        </Badge>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          <span>{userIcon}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MessageCircle className="w-3 h-3" />
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
}