import React, { useState, useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Category, Task } from '../hooks/useTasksNew';

interface TaskCategoryProps {
  columnId: string;
  category: Category;
  onTaskComplete?: () => void;
  onCreateTask: (taskData: Partial<Task>, columnId?: string, categoryId?: string) => Promise<any>;
  onMoveTask?: (taskId: number, newColumnId: string, newCategoryId?: string) => Promise<void>;
  onDeleteCategory?: (categoryId: string) => Promise<void>;
  teamMembers: Array<{ id: number; name: string; avatar: string; color: string }>;
  availableColumns?: Array<{ id: string; title: string; categories?: Array<{ id: string; name: string }> }>;
}

export function TaskCategory({ 
  columnId, 
  category, 
  onTaskComplete, 
  onCreateTask, 
  onMoveTask,
  onDeleteCategory,
  teamMembers = [],
  availableColumns
}: TaskCategoryProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    priority: 'medium',
    project: '',
    column_id: columnId,
    category_id: category.id
  });

  // Memoize the drop handler to prevent recreation on every render
  const handleDrop = useCallback(async (item: any, monitor: any) => {
    // Prevent drop if this is a nested drop (already handled by parent)
    if (monitor.didDrop()) {
      return;
    }
    
    console.log('🎯 TaskCategory drop event:', {
      taskId: item.id,
      taskTitle: item.title,
      targetCategory: category.id,
      targetCategoryName: category.name,
      targetColumn: category.column_id,
      hasOnMoveTask: !!onMoveTask
    });
    
    // Move task to this category if onMoveTask is provided
    if (onMoveTask && item.id) {
      try {
        console.log(`🚀 Attempting to move task ${item.id} to category ${category.id} in column ${category.column_id}`);
        await onMoveTask(item.id, category.column_id, category.id);
        console.log(`✅ Task ${item.id} moved successfully to category ${category.id}`);
      } catch (error) {
        console.error('❌ Failed to move task:', error);
      }
    } else {
      console.warn('⚠️ onMoveTask not provided or item.id missing:', { onMoveTask: !!onMoveTask, itemId: item.id });
    }
  }, [category.id, category.name, category.column_id, onMoveTask]);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'TASK',
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Cast the dropRef to the correct type for React
  const dropRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (dropRef) {
      (dropRef as any)(node);
    }
  }, [dropRef]);

  // Memoize callback functions to prevent recreation
  const handleCreateTask = useCallback(async (taskData: { 
    title: string; 
    detail?: string; 
    priority: string; 
    project?: string; 
    client?: string; 
    dueDate?: string; 
    notes?: string; 
  }) => {
    try {
      await onCreateTask({
        ...taskData,
        due_date: taskData.dueDate, // Map dueDate to due_date for API
        column_id: columnId,
        category_id: category.id
      }, columnId, category.id);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }, [onCreateTask, columnId, category.id]);

  const getCategoryConfig = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'standing':
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
      case 'people':
        return {
          color: 'from-red-400 to-red-500',
          bg: 'bg-red-50/60',
          text: 'text-red-700',
          icon: '👥'
        };
      default:
        // For custom categories (team member names)
        return {
          color: 'from-orange-400 to-orange-500',
          bg: 'bg-orange-50/60',
          text: 'text-orange-700',
          icon: '👤'
        };
    }
  };

  const config = getCategoryConfig(category.name);
  const isCustomCategory = !category.is_default;

  return (
    <div 
      ref={dropRefCallback}
      className={`mb-4 transition-all duration-200 ${
        isOver ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getCategoryConfig(category.name).color.split(' ')[0]}`}></div>
          <h4 className="font-medium text-slate-700 text-sm">{category.name}</h4>
          <Badge variant="secondary" className="text-xs">
            {category.tasks.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Add Task button for categories */}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 rounded-md hover:bg-slate-100/40 text-slate-600 hover:text-slate-800"
            onClick={() => setIsCreatingTask(true)}
          >
            <Plus className="w-3 h-3" />
          </Button>

          
          {/* Delete category button (only for manual categories, not for today column) */}
          {onDeleteCategory && !category.id.startsWith('follow-up_') && !columnId.includes('today') && (
            <Button
              onClick={() => onDeleteCategory(category.id)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 rounded-md hover:bg-red-100/40 text-red-600"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Category Container */}
      <div className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
        isOver 
          ? 'bg-white/40 border-green-300/60 shadow-lg' 
          : 'bg-white/20 border-white/30'
      }`}>
        {/* Drop zone indicator */}
        {isOver && (
          <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse mb-2"></div>
        )}

        {/* Tasks Container */}
        <div className="space-y-3">
          {category.tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              title={task.title}
              description={task.detail || ''}
              status={task.priority || 'TO DO'}
              statusColor={task.priority === 'urgent' ? 'orange' : task.priority === 'high' ? 'purple' : 'gray'}
              userIcon={task.team_member_id ? `User ${task.team_member_id}` : 'Normal'}
              time="30 min"
              comments={0}
            />
          ))}
        </div>
      </div>
      
      {/* Add Task Dialog */}
      <AddTaskDialog
        isOpen={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
        onSubmit={handleCreateTask}
        columnId={columnId}
        categoryId={category.id}
      />
    </div>
  );
} 