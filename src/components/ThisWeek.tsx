import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TaskColumn } from './TaskColumn';
import { Column, Category, Task, TeamMember } from '../hooks/useTasksNew';

interface ThisWeekProps {
  teamMembers: TeamMember[];
  onCreateTask: (taskData: { 
    title: string; 
    detail?: string; 
    project?: string; 
    client?: string; 
    dueDate?: string; 
    notes?: string; 
    priority: string; 
  }, columnId?: string, categoryId?: string) => Promise<void>;
  onMoveTask: (taskId: number, targetColumnId: string, targetCategoryId?: string) => Promise<void>;
  onTaskComplete?: (taskId: number) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  createTeamMember: (memberData: { name: string; email?: string; avatar?: string; color?: string }) => Promise<TeamMember>;
}

export function ThisWeek({ 
  teamMembers, 
  onCreateTask, 
  onMoveTask, 
  onTaskComplete, 
  onDeleteCategory,
  createTeamMember 
}: ThisWeekProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Generate week columns based on current date
  const generateWeekColumns = useCallback(() => {
    const today = new Date();
    const columns: Column[] = [
      {
        id: 'uncategorized',
        title: 'Uncategorized',
        color: 'from-slate-400 to-slate-500',
        order_index: 0,
        categories: [],
        tasks: [],
        count: 0
      },
      {
        id: 'today',
        title: `Today - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        color: 'from-blue-400 to-indigo-500',
        order_index: 1,
        categories: [
          {
            id: 'today_standing',
            name: 'STANDING',
            column_id: 'today',
            order_index: 0,
            is_default: true,
            tasks: [],
            count: 0
          },
          {
            id: 'today_comms',
            name: 'COMMS',
            column_id: 'today',
            order_index: 1,
            is_default: true,
            tasks: [],
            count: 0
          },
          {
            id: 'today_big_tasks',
            name: 'BIG TASKS',
            column_id: 'today',
            order_index: 2,
            is_default: true,
            tasks: [],
            count: 0
          },
          {
            id: 'today_done',
            name: 'DONE',
            column_id: 'today',
            order_index: 3,
            is_default: true,
            tasks: [],
            count: 0
          }
        ],
        tasks: [],
        count: 0
      },
      {
        id: 'follow-up',
        title: 'Follow-Up',
        color: 'from-red-400 to-red-500',
        order_index: 2,
        categories: [],
        tasks: [],
        count: 0
      }
    ];

    // Add dynamic date columns for the next 6 days
    for (let i = 1; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      columns.push({
        id: `day_${i}`,
        title: `${dayName} ${dateStr}`,
        color: 'from-purple-400 to-purple-500',
        order_index: 2 + i,
        categories: [
          {
            id: `day_${i}_standing`,
            name: 'STANDING',
            column_id: `day_${i}`,
            order_index: 0,
            is_default: true,
            tasks: [],
            count: 0
          },
          {
            id: `day_${i}_comms`,
            name: 'COMMS',
            column_id: `day_${i}`,
            order_index: 1,
            is_default: true,
            tasks: [],
            count: 0
          },
          {
            id: `day_${i}_big_tasks`,
            name: 'BIG TASKS',
            column_id: `day_${i}`,
            order_index: 2,
            is_default: true,
            tasks: [],
            count: 0
          },
          {
            id: `day_${i}_done`,
            name: 'DONE',
            column_id: `day_${i}`,
            order_index: 3,
            is_default: true,
            tasks: [],
            count: 0
          }
        ],
        tasks: [],
        count: 0
      });
    }

    // Add Future and Done columns
    columns.push(
      {
        id: 'future',
        title: 'Future',
        color: 'from-emerald-400 to-green-500',
        order_index: 9,
        categories: [],
        tasks: [],
        count: 0
      },
      {
        id: 'done',
        title: 'Done',
        color: 'from-emerald-400 to-green-500',
        order_index: 10,
        categories: [],
        tasks: [],
        count: 0
      }
    );

    return columns;
  }, []);

  // Fetch data and populate columns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Generate the week structure
        const weekColumns = generateWeekColumns();
        
        // Fetch data from API
        const response = await fetch('/api/board');
        if (response.ok) {
          const data = await response.json();
          
          // Merge API data with week structure
          const populatedColumns = weekColumns.map(column => {
            const apiColumn = data.find((col: any) => col.id === column.id);
            if (apiColumn) {
              return {
                ...column,
                tasks: apiColumn.tasks || [],
                categories: column.categories.map(cat => {
                  const apiCategory = apiColumn.categories?.find((c: any) => c.id === cat.id);
                  return {
                    ...cat,
                    tasks: apiCategory?.tasks || [],
                    count: apiCategory?.tasks?.length || 0
                  };
                }),
                count: (apiColumn.tasks?.length || 0) + 
                       (apiColumn.categories?.reduce((sum: number, cat: any) => sum + (cat.tasks?.length || 0), 0) || 0)
              };
            }
            return column;
          });
          
          // Don't set columns state - just use the data directly
        } else {
          // If API fails, use empty columns
          // Don't set columns state - just use the data directly
        }
      } catch (error) {
        console.error('Error fetching week data:', error);
        // Use empty columns as fallback
        // Don't set columns state - just use the data directly
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [generateWeekColumns]);

  // Handle task creation
  const handleCreateTask = useCallback(async (taskData: any, columnId?: string, categoryId?: string) => {
    try {
      await onCreateTask(taskData, columnId, categoryId);
      
      // Refresh the data
      const response = await fetch('/api/board');
      if (response.ok) {
        const data = await response.json();
        const updatedColumns = columns.map(column => {
          const apiColumn = data.find((col: any) => col.id === column.id);
          if (apiColumn) {
            return {
              ...column,
              tasks: apiColumn.tasks || [],
              categories: column.categories.map(cat => {
                const apiCategory = apiColumn.categories?.find((c: any) => c.id === cat.id);
                return {
                  ...cat,
                  tasks: apiCategory?.tasks || [],
                  count: apiCategory?.tasks?.length || 0
                };
              }),
              count: (apiColumn.tasks?.length || 0) + 
                     (apiColumn.categories?.reduce((sum: number, cat: any) => sum + (cat.tasks?.length || 0), 0) || 0)
            };
          }
          return column;
        });
        // Don't set columns state - just use the data directly
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }, [onCreateTask]);

  // Handle task movement
  const handleMoveTask = useCallback(async (taskId: number, targetColumnId: string, targetCategoryId?: string) => {
    try {
      await onMoveTask(taskId, targetColumnId, targetCategoryId);
      
      // Refresh the data
      const response = await fetch('/api/board');
      if (response.ok) {
        const data = await response.json();
        const updatedColumns = columns.map(column => {
          const apiColumn = data.find((col: any) => col.id === column.id);
          if (apiColumn) {
            return {
              ...column,
              tasks: apiColumn.tasks || [],
              categories: column.categories.map(cat => {
                const apiCategory = apiColumn.categories?.find((c: any) => c.id === cat.id);
                return {
                  ...cat,
                  tasks: apiCategory?.tasks || [],
                  count: apiCategory?.tasks?.length || 0
                };
              }),
              count: (apiColumn.tasks?.length || 0) + 
                     (apiColumn.categories?.reduce((sum: number, cat: any) => sum + (cat.tasks?.length || 0), 0) || 0)
            };
          }
          return column;
        });
        // Don't set columns state - just use the data directly
      }
    } catch (error) {
      console.error('Error moving task:', error);
    }
  }, [onMoveTask]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading This Week...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">This Week</h1>
            <p className="text-lg text-slate-600">
              Plan and organize your week ahead
            </p>
          </div>
        </div>

        {/* Week Board */}
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 overflow-x-auto pb-6">
            {generateWeekColumns().map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <TaskColumn
                  column={column}
                  teamMembers={teamMembers}
                  onCreateTask={handleCreateTask}
                  onMoveTask={handleMoveTask}
                  onTaskComplete={onTaskComplete || (() => Promise.resolve())}
                  onDeleteCategory={onDeleteCategory}
                  createTeamMember={createTeamMember}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 