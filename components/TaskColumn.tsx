import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { MoreHorizontal, Plus } from 'lucide-react';
import { TaskCategory } from './TaskCategory';
import { AddPersonCategory } from './AddPersonCategory';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  labels: string[];
  category?: string;
  assignees?: Array<{
    name: string;
    avatar: string;
    color: string;
  }>;
}

interface Column {
  id: string;
  title: string;
  count: number;
  color: string;
  tasks: Task[];
  categories?: string[];
}

interface TaskColumnProps {
  column: Column;
  onTaskComplete?: () => void;
}

export function TaskColumn({ column, onTaskComplete }: TaskColumnProps) {
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: any) => {
      console.log('Dropped task:', item.id, 'into column:', column.id);
      if (column.id === 'completed' && onTaskComplete) {
        onTaskComplete();
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Default categories based on column type
  const getDefaultCategories = (columnId: string): string[] => {
    if (columnId === 'blocked') {
      return []; // Blocked column uses custom people categories
    }
    return ['Standing Tasks', 'Comms', 'Big Tasks', 'Done'];
  };

  const isBlockedColumn = column.id === 'blocked';
  const defaultCategories = getDefaultCategories(column.id);
  const allCategories = isBlockedColumn ? customCategories : defaultCategories;

  // Group tasks by category
  const getTasksByCategory = (category: string): Task[] => {
    return column.tasks.filter(task => {
      // If task has no category, put it in the first default category
      if (!task.category) {
        return category === (isBlockedColumn ? customCategories[0] : 'Standing Tasks');
      }
      return task.category === category;
    });
  };

  const handleDropTask = (taskId: string, categoryName: string) => {
    console.log('Moving task', taskId, 'to category', categoryName, 'in column', column.id);
    // This would be handled by parent component in a real app
  };

  const handleAddPerson = (personName: string) => {
    if (!customCategories.includes(personName)) {
      setCustomCategories([...customCategories, personName]);
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    setCustomCategories(customCategories.filter(cat => cat !== categoryName));
  };

  const totalTasks = column.tasks.length;

  return (
    <div 
      ref={drop}
      className={`w-80 flex-shrink-0 transition-all duration-300 ${
        isOver ? 'scale-105' : ''
      }`}
    >
      <div className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
        isOver 
          ? 'bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl' 
          : 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl'
      }`}>
        {/* Column gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${column.color}`}></div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color} shadow-lg`}></div>
              <h3 className="font-semibold text-slate-800">{column.title}</h3>
              <Badge 
                variant="secondary" 
                className="bg-white/30 text-slate-700 border border-white/40 backdrop-blur-sm font-medium"
              >
                {totalTasks}
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
        
        {/* Categories container */}
        <div className="p-4 min-h-[400px] max-h-[700px] overflow-y-auto">
          {/* Add person category for blocked column */}
          {isBlockedColumn && (
            <AddPersonCategory onAddPerson={handleAddPerson} />
          )}
          
          {/* Render categories */}
          {allCategories.map((category) => (
            <TaskCategory
              key={category}
              columnId={column.id}
              categoryName={category}
              tasks={getTasksByCategory(category)}
              onTaskComplete={onTaskComplete}
              onDropTask={handleDropTask}
              canAddPeople={isBlockedColumn}
              onDeleteCategory={isBlockedColumn ? handleDeleteCategory : undefined}
              isCustomCategory={isBlockedColumn}
            />
          ))}
          
          {/* Show message if no categories exist */}
          {allCategories.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="font-medium text-slate-600 mb-2">
                {isBlockedColumn ? 'No People Added' : 'No Categories'}
              </h4>
              <p className="text-sm text-slate-500">
                {isBlockedColumn 
                  ? 'Add people who are blocking tasks' 
                  : 'Categories will appear here'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}