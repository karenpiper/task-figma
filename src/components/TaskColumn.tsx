import React, { useState, useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { MoreHorizontal, Plus, Users } from 'lucide-react';
import { TaskCategory } from './TaskCategory';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Category, Column, TeamMember } from '../hooks/useTasks';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  column: Column;
  onTaskComplete?: () => void;
  onCreateTask?: (taskData: { title: string; priority?: string; project?: string; column_id?: string; category_id?: string }) => Promise<any>;
  onMoveTask?: (taskId: number, newColumnId: string, newCategoryId?: string) => Promise<void>;
  onCreateCategory?: (categoryData: { name: string; column_id: string; order_index?: number }) => Promise<any>;
  onDeleteCategory?: (categoryId: string) => Promise<void>;
  teamMembers?: TeamMember[];
}

export function TaskColumn({ 
  column, 
  onTaskComplete, 
  onCreateTask, 
  onMoveTask,
  onCreateCategory,
  onDeleteCategory,
  teamMembers = []
}: TaskColumnProps) {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    column_id: column.id,
    order_index: column.categories.length
  });
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
      hasCategories: column.categories.length > 0
    });
    
    // Handle task completion if moving to completed column
    if (column.id === 'completed' && onTaskComplete) {
      console.log('✅ Task completed, triggering celebration');
      onTaskComplete();
    }
    
    // Move task to this column if onMoveTask is provided
    if (onMoveTask && item.id) {
      try {
        console.log(`🚀 Attempting to move task ${item.id} to column ${column.id}`);
        
        // For columns with categories, determine the target category
        let targetCategoryId: string | undefined = undefined;
        
        if (column.categories.length > 0) {
          // Find the first available category (usually the default one)
          const defaultCategory = column.categories.find(cat => cat.is_default) || column.categories[0];
          if (defaultCategory) {
            targetCategoryId = defaultCategory.id;
            console.log(`🎯 Auto-selecting category: ${defaultCategory.name} (${defaultCategory.id})`);
          }
        }
        
        await onMoveTask(item.id, column.id, targetCategoryId);
        console.log(`✅ Task ${item.id} moved successfully to column ${column.id}${targetCategoryId ? ` in category ${targetCategoryId}` : ''}`);
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
  const handleCreateCategory = useCallback(async () => {
    if (!newCategoryData.name.trim() || !onCreateCategory) return;
    
    try {
      await onCreateCategory(newCategoryData);
      setNewCategoryData({ name: '', column_id: column.id, order_index: column.categories.length });
      setIsCreatingCategory(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  }, [newCategoryData, onCreateCategory, column.id, column.categories.length]);

  const handleCreateTask = useCallback(async () => {
    if (!newTaskData.title.trim() || !onCreateTask) return;
    
    try {
      await onCreateTask(newTaskData);
      setNewTaskData({ title: '', priority: 'medium', project: '', column_id: column.id, category_id: undefined });
      setIsCreatingTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }, [newTaskData, onCreateTask, column.id]);

  // Memoize computed values
  const totalTasks = useMemo(() => column.tasks.length, [column.tasks.length]);
  const isFollowUpColumn = useMemo(() => column.id === 'follow-up', [column.id]);
  const isDayColumn = useMemo(() => column.id === 'today', [column.id]);
  const shouldShowCategories = useMemo(() => isDayColumn || column.id === 'follow-up', [isDayColumn, column.id]);
  const shouldShowAddCategoryButton = useMemo(() => isDayColumn, [isDayColumn]);

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
      {/* Column Header */}
      <div className={`mb-6 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-200 ${
        isOver 
          ? 'bg-white/40 border-blue-300/60 shadow-lg' 
          : 'bg-white/20 border-white/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-800 text-lg">{column.title}</h3>
          <Badge className="bg-slate-100/80 text-slate-700 border-slate-200/60">
            {column.count}
          </Badge>
        </div>
        
        {/* Drop zone indicator */}
        {isOver && (
          <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse mb-2"></div>
        )}
        
        {/* Column actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreatingTask(true)}
            size="sm"
            className="flex-1 bg-white/60 hover:bg-white/80 text-slate-700 border-white/40 hover:border-white/60"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          
          {/* Only show Add Category button for columns that should have it */}
          {shouldShowAddCategoryButton && (
            <Dialog open={isCreatingCategory} onOpenChange={setIsCreatingCategory}>
              <DialogTrigger asChild>
                <div className="group">
                  <Button 
                    variant="ghost" 
                    className="w-full h-10 border-2 border-dashed border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-slate-600 hover:text-slate-700 transition-all duration-300 rounded-xl group-hover:scale-[1.01] text-sm"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    {isDayColumn ? 'Add Category' : 'Add Person'}
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {isDayColumn ? 'Add New Category' : 'Add New Person'}
                  </DialogTitle>
                  <p className="text-sm text-gray-600">
                    {isDayColumn 
                      ? 'Create a new category to organize tasks in this column.'
                      : 'Add a new person to assign tasks to.'
                    }
                  </p>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
                      {isDayColumn ? 'Category Name' : 'Person Name'}
                    </Label>
                    <Input
                      id="categoryName"
                      value={newCategoryData.name}
                      onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={isDayColumn ? "Enter category name..." : "Enter person name..."}
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={handleCreateCategory}
                      disabled={!newCategoryData.name.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    >
                      {isDayColumn ? 'Create Category' : 'Add Person'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingCategory(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
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
                  onTaskComplete={onTaskComplete}
                  onCreateTask={onCreateTask}
                  onMoveTask={onMoveTask}
                  onDeleteCategory={onDeleteCategory}
                  teamMembers={teamMembers}
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
              {/* For non-day columns, show tasks directly */}
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={onTaskComplete} />
              ))}
              
              {/* Add task button for non-day columns */}
              <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full h-10 border-2 border-dashed border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-slate-600 hover:text-slate-700 transition-all duration-300 rounded-xl hover:scale-[1.01] text-sm"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Add New Task</DialogTitle>
                    <p className="text-sm text-gray-600">Create a new task in this column.</p>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taskTitle" className="text-sm font-medium text-gray-700">Task Title</Label>
                      <Input
                        id="taskTitle"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title..."
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taskPriority" className="text-sm font-medium text-gray-700">Priority</Label>
                      <Select
                        value={newTaskData.priority}
                        onValueChange={(value) => setNewTaskData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taskProject" className="text-sm font-medium text-gray-700">Project (Optional)</Label>
                      <Input
                        id="taskProject"
                        value={newTaskData.project}
                        onChange={(e) => setNewTaskData(prev => ({ ...prev, project: e.target.value }))}
                        placeholder="Enter project name..."
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={handleCreateTask}
                        disabled={!newTaskData.title.trim()}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                      >
                        Create Task
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreatingTask(false)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
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
    </div>
  );
}