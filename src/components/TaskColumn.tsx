import React, { useState, useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { MoreHorizontal, Plus, Users, UserPlus } from 'lucide-react';
import { TaskCategory } from './TaskCategory';
import { AddTaskDialog } from './AddTaskDialog';
import { AddPersonDialog } from './AddPersonDialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Category, Column, TeamMember, Task } from '../hooks/useTasksNew';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  column: Column;
  onTaskComplete?: (taskId: number) => Promise<void>;
  onTaskCompleteSimple?: () => void;
  onCreateTask: (taskData: Partial<Task>, columnId?: string, categoryId?: string) => Promise<any>;
  onMoveTask?: (taskId: number, newColumnId: string, newCategoryId?: string) => Promise<void>;
  onCreateCategory?: (categoryData: { name: string; column_id: string; order_index?: number }) => Promise<any>;
  onDeleteCategory?: (categoryId: string) => Promise<void>;
  teamMembers: TeamMember[];
  createTeamMember: (memberData: { name: string; is_strategy_team: boolean }) => Promise<any>;
  availableColumns?: Array<{ id: string; title: string; categories?: Array<{ id: string; name: string }> }>;
}

export function TaskColumn({ 
  column, 
  onTaskComplete, 
  onTaskCompleteSimple, 
  onCreateTask, 
  onMoveTask,
  onCreateCategory,
  onDeleteCategory,
  teamMembers = [],
  createTeamMember,
  availableColumns
}: TaskColumnProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    priority: 'medium',
    project: '',
    column_id: column.id,
    category_id: undefined
  });

  // Memoize the drop handler to prevent recreation on every render
  const handleDrop = useCallback(async (item: any, monitor: any) => {
    // Prevent drop if this is a nested drop (already handled by category)
    if (monitor.didDrop()) {
      console.log('🔄 Drop already handled by child component, skipping column drop');
      return;
    }
    
    console.log('🎯 TaskColumn drop event:', {
      taskId: item.id,
      taskTitle: item.title,
      targetColumn: column.id,
      targetColumnTitle: column.title,
      hasOnMoveTask: !!onMoveTask,
      hasCategories: column.categories.length > 0,
      categories: column.categories.map(cat => ({ id: cat.id, name: cat.name }))
    });
    
    // Handle task completion if moving to completed column
    if (column.id === 'completed' && onTaskComplete && item.id) {
      console.log('✅ Task completed, triggering celebration');
      onTaskComplete(item.id);
    }
    
    // Move task to this column if onMoveTask is provided
    if (onMoveTask && item.id) {
      try {
        console.log(`🚀 Attempting to move task ${item.id} to column ${column.id}`);
        
        // For columns with categories, determine the target category
        let targetCategoryId: string | undefined = undefined;
        
        if (column.categories.length > 0) {
          // For follow-up column, use the first category (first team member)
          if (column.id === 'follow-up') {
            targetCategoryId = column.categories[0]?.id;
            console.log(`🎯 Follow-up column: Using first category: ${column.categories[0]?.name} (${targetCategoryId})`);
          } else {
            // Find the first available category (usually the default one)
            const defaultCategory = column.categories.find(cat => cat.is_default) || column.categories[0];
            if (defaultCategory) {
              targetCategoryId = defaultCategory.id;
              console.log(`🎯 Auto-selecting category: ${defaultCategory.name} (${defaultCategory.id})`);
            }
          }
        }
        
        if (targetCategoryId) {
          console.log(`🎯 Final target category: ${targetCategoryId}`);
          await onMoveTask(item.id, column.id, targetCategoryId);
          console.log(`✅ Task ${item.id} moved successfully to column ${column.id} in category ${targetCategoryId}`);
        } else {
          console.log(`🎯 No target category, moving to column only`);
          await onMoveTask(item.id, column.id);
          console.log(`✅ Task ${item.id} moved successfully to column ${column.id}`);
        }
      } catch (error) {
        console.error('❌ Failed to move task:', error);
      }
    } else {
      console.warn('⚠️ onMoveTask not provided or item.id missing:', { onMoveTask: !!onMoveTask, itemId: item.id });
    }
  }, [column.id, column.title, column.categories, onMoveTask, onTaskComplete]);

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
        column_id: column.id,
        category_id: undefined
      }, column.id, undefined);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }, [column.id, onCreateTask]);

  const handleCreatePerson = useCallback(async (personData: { name: string; is_strategy_team: boolean }) => {
    try {
      await createTeamMember(personData);
      setIsAddingPerson(false);
    } catch (error) {
      console.error('Error creating person:', error);
    }
  }, [createTeamMember]);

  // Memoize computed values
  const totalTasks = useMemo(() => column.tasks.length, [column.tasks.length]);
  const isFollowUpColumn = useMemo(() => column.id === 'follow-up', [column.id]);
  const isDayColumn = useMemo(() => column.id === 'today', [column.id]);
  // Only show categories for day columns and follow-up
  const shouldShowCategories = useMemo(() => isDayColumn || column.id === 'follow-up', [isDayColumn, column.id]);

  // Debug logging for follow-up column
  if (isFollowUpColumn) {
    console.log(`🔍 TaskColumn Debug - Follow-up column:`, {
      columnId: column.id,
      title: column.title,
      categoriesCount: column.categories?.length || 0,
      categories: column.categories?.map(cat => ({ id: cat.id, name: cat.name, tasksCount: cat.tasks?.length || 0 })),
      shouldShowCategories,
      totalTasks
    });
  }

  // Get column color based on column ID
  const getColumnColor = useCallback((columnId: string) => {
    switch (columnId) {
      case 'uncategorized':
        return 'bg-slate-400';
      case 'today':
        return 'bg-blue-500';
      case 'follow-up':
        return 'bg-orange-500';
      case 'later':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-slate-400';
    }
  }, []);

  // Allow task creation in team member categories (like follow-up_1) but not manual categories
  const shouldAllowTaskCreation = useMemo(() => {
    if (isDayColumn) return true; // Always allow in day columns
    if (column.id === 'follow-up') return true; // Allow in follow-up column for team member categories
    return false; // Don't allow in other columns
  }, [isDayColumn, column.id]);

  return (
    <div 
      ref={dropRefCallback}
      className={`w-80 flex-shrink-0 transition-all duration-200 ${
        isOver ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* Column Header - Beautiful Site Recreation Style */}
      <div className={`mb-6 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-200 ${
        isOver 
          ? 'bg-white/90 border-blue-300/60 shadow-lg' 
          : 'bg-white/80 border-white/60'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{column.title}</h3>
            <p className="text-xs text-gray-500">
              {column.count} tasks, {Math.floor(column.count * 0.8)} hours
            </p>
          </div>
          
          {/* Add Task button for uncategorized, later, and today columns */}
          {(!shouldShowCategories || column.id === 'today') && (
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setIsCreatingTask(true)}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
          
          {/* Add Person button for follow-up column */}
          {isFollowUpColumn && (
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setIsAddingPerson(true)}
            >
              <UserPlus className="w-5 h-5" />
            </button>
          )}
          
          {/* No buttons for columns with categories - tasks must be added to specific categories */}
        </div>
        
        {/* Drop zone indicator */}
        {isOver && (
          <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse mb-2"></div>
        )}
      </div>
      
      {/* Categories container */}
      <div className="p-4 min-h-[400px] max-h-[700px] overflow-y-auto">
        {/* Check if this is a day column that should show categories */}
        {shouldShowCategories ? (
          <>
            {/* Render categories for day columns */}
            {column.categories.map((category) => (
              <TaskCategory
                key={category.id}
                columnId={column.id}
                category={category}
                onTaskComplete={onTaskCompleteSimple}
                onCreateTask={onCreateTask}
                onMoveTask={onMoveTask}
                onDeleteCategory={onDeleteCategory}
                teamMembers={teamMembers}
                availableColumns={availableColumns}
              />
            ))}
            
            {/* Add category button for day columns */}
            {column.categories.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-slate-500" />
                </div>
                <h4 className="font-medium text-slate-600 mb-2">No Categories</h4>
                <p className="text-sm text-slate-500">Categories will appear here</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* For non-day columns, show tasks directly with consistent spacing */}
            <div className="space-y-3">
              {column.tasks.map((task) => (
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
            
            {/* Show message if no tasks exist in non-day columns */}
            {column.tasks.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-slate-500" />
                </div>
                <h4 className="font-medium text-slate-600 mb-2">No Tasks</h4>
                <p className="text-sm text-slate-500">Tasks will appear here</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Dialogs */}
      <AddTaskDialog
        isOpen={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
        onSubmit={handleCreateTask}
        columnId={column.id}
        categoryId={undefined}
      />
      
      <AddPersonDialog
        isOpen={isAddingPerson}
        onClose={() => setIsAddingPerson(false)}
        onSubmit={handleCreatePerson}
      />
    </div>
  );
}