import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Category, Task } from '../hooks/useTasks';

interface TaskCategoryProps {
  columnId: string;
  category: Category;
  onTaskComplete?: () => void;
  onCreateTask?: (taskData: { title: string; priority?: string; project?: string; column_id?: string; category_id?: string }) => Promise<Task>;
  onMoveTask?: (taskId: number, newColumnId: string, newCategoryId?: string) => Promise<void>;
  onDeleteCategory?: (categoryId: string) => Promise<void>;
  teamMembers?: Array<{ id: number; name: string; avatar: string; color: string }>;
}

export function TaskCategory({ 
  columnId, 
  category, 
  onTaskComplete, 
  onCreateTask, 
  onMoveTask,
  onDeleteCategory,
  teamMembers = []
}: TaskCategoryProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    priority: 'medium',
    project: '',
    column_id: columnId,
    category_id: category.id
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: async (item: any) => {
      console.log('Dropped task:', item.id, 'into category:', category.name, 'in column:', columnId);
      
      // Handle task completion if moving to completed column
      if (columnId === 'completed' && onTaskComplete) {
        onTaskComplete();
      }
      
      // Move task to this category if onMoveTask is provided
      if (onMoveTask && item.id) {
        try {
          await onMoveTask(item.id, columnId, category.id);
        } catch (error) {
          console.error('Failed to move task:', error);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleCreateTask = async () => {
    if (!newTaskData.title.trim() || !onCreateTask) return;
    
    try {
      await onCreateTask(newTaskData);
      setNewTaskData({ title: '', priority: 'medium', project: '', column_id: columnId, category_id: category.id });
      setIsCreatingTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

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
      ref={drop}
      className={`mb-4 transition-all duration-300 ${
        isOver ? 'bg-white/40 backdrop-blur-md rounded-2xl border border-white/60' : ''
      }`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3 group">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
            <span className="text-sm">{config.icon}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 text-sm">{category.name}</h4>
            <p className="text-xs text-slate-600">{category.count} tasks</p>
          </div>
          <Badge 
            variant="secondary" 
            className={`${config.bg} ${config.text} border-0 font-medium text-xs`}
          >
            {category.count}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isCustomCategory && onDeleteCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-xl hover:bg-red-100/60 backdrop-blur-sm"
              onClick={() => onDeleteCategory(category.id)}
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
      <div className="space-y-3 ml-2 pl-4 border-l-2 border-white/30">
        {category.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={onTaskComplete} />
        ))}
        
        {/* Add task button */}
        <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
          <DialogTrigger asChild>
            <div className="group">
              <Button 
                variant="ghost" 
                className="w-full h-10 border-2 border-dashed border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-slate-600 hover:text-slate-700 transition-all duration-300 rounded-xl group-hover:scale-[1.01] text-sm"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add task
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">Create New Task in {category.name}</DialogTitle>
              <p className="text-sm text-gray-600">Add a new task to this category.</p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Task Title</Label>
                <Input
                  id="title"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</Label>
                <Select value={newTaskData.priority} onValueChange={(value) => setNewTaskData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project" className="text-sm font-medium text-gray-700">Project (Optional)</Label>
                <Input
                  id="project"
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
      </div>
    </div>
  );
} 