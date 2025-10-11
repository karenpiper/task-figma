import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { MoreHorizontal, Plus, Users } from 'lucide-react';
import { TaskCard } from './TaskCard';

interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  userIcon: string;
  time: string;
  comments: number;
  hasGradient?: boolean;
}

interface SubCategory {
  title: string;
  taskCount: number;
  tasks: Task[];
}

interface Column {
  title: string;
  taskCount: number;
  hours: number;
  tasks: Task[];
  subCategories?: SubCategory[];
  showAddPerson?: boolean;
}

export function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      title: 'Uncategorized',
      taskCount: 0,
      hours: 0,
      tasks: [],
    },
    {
      title: 'Today',
      taskCount: 1,
      hours: 1,
      tasks: [],
      subCategories: [
        {
          title: 'STANDING',
          taskCount: 1,
          tasks: [
            {
              title: 'Web Summit deck',
              description: 'Prepare presentation for Web Summit conference',
              status: 'MEDIUM',
              statusColor: 'orange',
              userIcon: 'Normal',
              time: '60 min',
              comments: 0,
            },
          ],
        },
        {
          title: 'COMMS',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'BIG TASKS',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'DONE',
          taskCount: 0,
          tasks: [],
        },
      ],
    },
    {
      title: 'Personal',
      taskCount: 1,
      hours: 1,
      tasks: [
        {
          title: 'Web Summit deck',
          description: 'Prepare presentation for Web Summit conference',
          status: 'MEDIUM',
          statusColor: 'orange',
          userIcon: 'Normal',
          time: '60 min',
          comments: 0,
        },
      ],
    },
    {
      title: 'Follow-Up',
      taskCount: 8,
      hours: 2,
      tasks: [],
      showAddPerson: true,
    },
    {
      title: 'Later',
      taskCount: 0,
      hours: 0,
      tasks: [],
    },
    {
      title: 'Completed',
      taskCount: 14,
      hours: 8,
      tasks: [
        {
          title: 'Fill out device contract',
          description: 'Complete device contract paperwork',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '30 min',
          comments: 0,
        },
        {
          title: 'yes',
          description: 'Task completed',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '15 min',
          comments: 0,
        },
        {
          title: 'complete',
          description: 'Task completed',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '20 min',
          comments: 0,
        },
        {
          title: 'christine',
          description: 'Follow up with Christine',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '25 min',
          comments: 0,
        },
        {
          title: 'test',
          description: 'Test task',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '10 min',
          comments: 0,
        },
      ],
    },
  ]);

  const teamMembers = [
    { name: 'Adam', taskCount: 0 },
    { name: 'Brent', taskCount: 0 },
    { name: 'Christine', taskCount: 0 },
    { name: 'David', taskCount: 0 },
    { name: 'Emma', taskCount: 0 },
    { name: 'Frank', taskCount: 0 },
    { name: 'Grace', taskCount: 0 },
    { name: 'Henry', taskCount: 0 },
  ];

  const addNewColumn = () => {
    const newColumn: Column = {
      title: 'New Column',
      taskCount: 0,
      hours: 0,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const moveTask = (taskId: string, fromColumnId: string, fromSubCategoryId: string | null, toColumnId: string, toSubCategoryId: string | null) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Find and remove task from source
      const fromColumnIndex = newColumns.findIndex(col => col.title === fromColumnId);
      if (fromColumnIndex !== -1) {
        if (fromSubCategoryId && newColumns[fromColumnIndex].subCategories) {
          const subCategoryIndex = newColumns[fromColumnIndex].subCategories!.findIndex(sub => sub.title === fromSubCategoryId);
          if (subCategoryIndex !== -1) {
            newColumns[fromColumnIndex].subCategories![subCategoryIndex].tasks = 
              newColumns[fromColumnIndex].subCategories![subCategoryIndex].tasks.filter(task => task.id !== taskId);
            newColumns[fromColumnIndex].subCategories![subCategoryIndex].taskCount = 
              newColumns[fromColumnIndex].subCategories![subCategoryIndex].tasks.length;
          }
        } else {
          newColumns[fromColumnIndex].tasks = newColumns[fromColumnIndex].tasks.filter(task => task.id !== taskId);
        }
        newColumns[fromColumnIndex].taskCount = newColumns[fromColumnIndex].tasks.length + 
          (newColumns[fromColumnIndex].subCategories?.reduce((sum, sub) => sum + sub.taskCount, 0) || 0);
      }
      
      // Find and add task to destination
      const toColumnIndex = newColumns.findIndex(col => col.title === toColumnId);
      if (toColumnIndex !== -1) {
        const taskToMove = { id: taskId } as Task; // We'll find the actual task data
        
        // Find the actual task data from the source
        const sourceColumn = prevColumns.find(col => col.title === fromColumnId);
        if (sourceColumn) {
          if (fromSubCategoryId && sourceColumn.subCategories) {
            const sourceSubCategory = sourceColumn.subCategories.find(sub => sub.title === fromSubCategoryId);
            if (sourceSubCategory) {
              const actualTask = sourceSubCategory.tasks.find(task => task.id === taskId);
              if (actualTask) {
                taskToMove.id = actualTask.id;
                taskToMove.title = actualTask.title;
                taskToMove.description = actualTask.description;
                taskToMove.status = actualTask.status;
                taskToMove.statusColor = actualTask.statusColor;
                taskToMove.userIcon = actualTask.userIcon;
                taskToMove.time = actualTask.time;
                taskToMove.comments = actualTask.comments;
                taskToMove.hasGradient = actualTask.hasGradient;
              }
            }
          } else {
            const actualTask = sourceColumn.tasks.find(task => task.id === taskId);
            if (actualTask) {
              Object.assign(taskToMove, actualTask);
            }
          }
        }
        
        if (toSubCategoryId && newColumns[toColumnIndex].subCategories) {
          const subCategoryIndex = newColumns[toColumnIndex].subCategories!.findIndex(sub => sub.title === toSubCategoryId);
          if (subCategoryIndex !== -1) {
            newColumns[toColumnIndex].subCategories![subCategoryIndex].tasks.push(taskToMove);
            newColumns[toColumnIndex].subCategories![subCategoryIndex].taskCount = 
              newColumns[toColumnIndex].subCategories![subCategoryIndex].tasks.length;
          }
        } else {
          newColumns[toColumnIndex].tasks.push(taskToMove);
        }
        newColumns[toColumnIndex].taskCount = newColumns[toColumnIndex].tasks.length + 
          (newColumns[toColumnIndex].subCategories?.reduce((sum, sub) => sum + sub.taskCount, 0) || 0);
      }
      
      return newColumns;
    });
  };

  // DropZone component for columns and subcategories
  const DropZone = ({ columnId, subCategoryId, children }: { columnId: string; subCategoryId?: string; children: React.ReactNode }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'task',
      drop: (item: any) => {
        if (item.columnId !== columnId || item.subCategoryId !== subCategoryId) {
          moveTask(item.id, item.columnId, item.subCategoryId, columnId, subCategoryId || null);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    return (
      <div 
        ref={drop}
        className={`min-h-[100px] transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg' : ''
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="p-8">
        <div className="flex gap-6 min-w-max">
          {columns.map((column, index) => (
            <div key={index} className="w-80 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-gray-900">{column.title}</h2>
                  <p className="text-xs text-gray-500">
                    {column.taskCount} tasks, {column.hours} hours
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {column.showAddPerson ? (
                    <button className="text-gray-400 hover:text-gray-600">
                      <Users className="w-5 h-5" />
                    </button>
                  ) : (
                    <button className="text-gray-400 hover:text-gray-600">
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <DropZone columnId={column.title}>
                <div className="space-y-3">
                  {column.subCategories ? (
                    // Render sub-categories for Today column
                    column.subCategories.map((subCategory, subIndex) => (
                      <div key={subIndex} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            {subCategory.title} ({subCategory.taskCount})
                          </h3>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <DropZone columnId={column.title} subCategoryId={subCategory.title}>
                          <div className="space-y-2">
                            {subCategory.tasks.map((task, taskIndex) => (
                              <TaskCard 
                                key={taskIndex} 
                                {...task} 
                                id={task.id || `task-${index}-${subIndex}-${taskIndex}`}
                                columnId={column.title}
                                subCategoryId={subCategory.title}
                              />
                            ))}
                          </div>
                        </DropZone>
                      </div>
                    ))
                  ) : column.title === 'Follow-Up' ? (
                    // Render team members for Follow-Up column
                    teamMembers.map((member, memberIndex) => (
                      <div key={memberIndex} className="flex items-center justify-between p-2 bg-white/80 rounded-lg border border-white/60">
                        <span className="text-sm text-gray-700">{member.name} {member.taskCount}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : column.tasks.length > 0 ? (
                    // Render regular tasks
                    column.tasks.map((task, taskIndex) => (
                      <TaskCard 
                        key={taskIndex} 
                        {...task} 
                        id={task.id || `task-${index}-${taskIndex}`}
                        columnId={column.title}
                      />
                    ))
                  ) : (
                    // Empty state
                    <div className="flex items-center justify-center p-8 bg-white/80 rounded-lg border border-white/60 text-center">
                      <div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">No Tasks</p>
                        <p className="text-xs text-gray-400">Tasks will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </DropZone>
            </div>
          ))}
          
          {/* Add Column Button */}
          <div className="w-80 flex-shrink-0">
            <div className="flex items-center justify-center h-32 bg-white/80 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer" onClick={addNewColumn}>
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Add Column</p>
                <p className="text-xs text-gray-400">Create a new task column</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}