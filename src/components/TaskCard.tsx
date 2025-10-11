import React from 'react';
import { useDrag } from 'react-dnd';
import { User, Clock, MessageCircle } from 'lucide-react';
import { MGMTCard } from './MGMTCard';
import { MGMTBadge } from './MGMTBadge';

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
    item: () => {
      console.log('🎯 DRAG STARTED:', { id, title, columnId, subCategoryId });
      return { 
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
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, title, description, status, statusColor, userIcon, time, comments, hasGradient, columnId, subCategoryId]);
  const getBadgeVariant = (color: string): 'purple' | 'pink' | 'yellow' | 'green' | 'beige' | 'lime' => {
    const colorMap: Record<string, 'purple' | 'pink' | 'yellow' | 'green' | 'beige' | 'lime'> = {
      orange: 'yellow',
      purple: 'purple',
      cyan: 'lime',
      teal: 'green',
      gray: 'beige',
    };
    return colorMap[color] || 'beige';
  };

  return (
    <div 
      ref={drag as any}
      onClick={() => console.log('🖱️ TASK CARD CLICKED:', { id, title })}
      className={`cursor-move ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}`}
    >
      <MGMTCard 
        backgroundColor="#ffffff"
        size="sm"
        blob={hasGradient ? {
          color: '#c7b3e5',
          variant: 1,
          position: 'top-right'
        } : undefined}
      >
        {hasGradient && (
          <div className="w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-mgmt-pink via-mgmt-purple to-mgmt-lime" />
        )}
        
        <h3 className="text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 flex-wrap">
          <MGMTBadge variant={getBadgeVariant(statusColor)} size="sm">
            {status}
          </MGMTBadge>
          
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
      </MGMTCard>
    </div>
  );
}