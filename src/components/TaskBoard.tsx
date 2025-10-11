import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { MoreHorizontal, Plus, Users } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';

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
  console.log('🎯 TaskBoard component rendered');
  
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [addTaskContext, setAddTaskContext] = useState<{
    columnTitle: string;
    subCategoryTitle?: string;
  } | null>(null);

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
              id: 'task-standing-1',
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
          id: 'task-personal-1',
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
      subCategories: [
        {
          title: 'Adam',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'Brent',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'Christine',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'David',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'Emma',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'Frank',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'Grace',
          taskCount: 0,
          tasks: [],
        },
        {
          title: 'Henry',
          taskCount: 0,
          tasks: [],
        },
      ],
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
          id: 'task-completed-1',
          title: 'Fill out device contract',
          description: 'Complete device contract paperwork',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '30 min',
          comments: 0,
        },
        {
          id: 'task-completed-2',
          title: 'yes',
          description: 'Task completed',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '15 min',
          comments: 0,
        },
        {
          id: 'task-completed-3',
          title: 'complete',
          description: 'Task completed',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '20 min',
          comments: 0,
        },
        {
          id: 'task-completed-4',
          title: 'christine',
          description: 'Follow up with Christine',
          status: 'MEDIUM',
          statusColor: 'teal',
          userIcon: 'Normal',
          time: '25 min',
          comments: 0,
        },
        {
          id: 'task-completed-5',
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


  const addNewColumn = () => {
    const newColumn: Column = {
      title: 'New Column',
      taskCount: 0,
      hours: 0,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const handleAddTask = (taskData: {
    title: string;
    description: string;
    status: string;
    statusColor: string;
    userIcon: string;
    time: string;
    comments: number;
  }) => {
    console.log('🎯 handleAddTask called:', { taskData, addTaskContext });
    
    if (!addTaskContext) {
      console.log('❌ No addTaskContext found');
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
    };
    
    console.log('✅ New task created:', newTask);

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.title === addTaskContext.columnTitle);
      
      if (columnIndex !== -1) {
        const column = newColumns[columnIndex];
        
        if (addTaskContext.subCategoryTitle && column.subCategories) {
          // Add to subcategory
          const subCategoryIndex = column.subCategories.findIndex(
            sub => sub.title === addTaskContext.subCategoryTitle
          );
          
          if (subCategoryIndex !== -1) {
            column.subCategories[subCategoryIndex].tasks.push(newTask);
            column.subCategories[subCategoryIndex].taskCount = 
              column.subCategories[subCategoryIndex].tasks.length;
          }
        } else {
          // Add to column directly
          column.tasks.push(newTask);
        }
        
        // Update column task count
        column.taskCount = column.tasks.length + 
          (column.subCategories?.reduce((sum, sub) => sum + sub.taskCount, 0) || 0);
      }
      
      return newColumns;
    });
  };

  const openAddTaskDialog = (columnTitle: string, subCategoryTitle?: string) => {
    console.log('🎯 openAddTaskDialog called:', { columnTitle, subCategoryTitle });
    setAddTaskContext({ columnTitle, subCategoryTitle });
    setIsAddTaskDialogOpen(true);
    console.log('✅ Dialog should be opening now');
  };

  const moveTask = (taskId: string, fromColumnId: string, fromSubCategoryId: string | null, toColumnId: string, toSubCategoryId: string | null) => {
    console.log('🎯 moveTask called:', { taskId, fromColumnId, fromSubCategoryId, toColumnId, toSubCategoryId });
    
    setColumns(prevColumns => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns)); // Deep clone to ensure proper updates
      
      // Find the actual task data from the source first
      let taskToMove: Task | null = null;
      const sourceColumnIndex = newColumns.findIndex((col: Column) => col.title === fromColumnId);
      
      console.log('🔍 Source column index:', sourceColumnIndex);
      
      if (sourceColumnIndex !== -1) {
        const sourceColumn = newColumns[sourceColumnIndex];
        
        if (fromSubCategoryId && sourceColumn.subCategories) {
          const sourceSubCategoryIndex = sourceColumn.subCategories.findIndex((sub: SubCategory) => sub.title === fromSubCategoryId);
          console.log('🔍 Source subcategory index:', sourceSubCategoryIndex);
          
          if (sourceSubCategoryIndex !== -1) {
            const sourceSubCategory = sourceColumn.subCategories[sourceSubCategoryIndex];
            const taskIndex = sourceSubCategory.tasks.findIndex((task: Task) => task.id === taskId);
            console.log('🔍 Task index in subcategory:', taskIndex);
            
            if (taskIndex !== -1) {
              taskToMove = sourceSubCategory.tasks[taskIndex];
              sourceSubCategory.tasks.splice(taskIndex, 1);
              sourceSubCategory.taskCount = sourceSubCategory.tasks.length;
              console.log('✅ Task removed from subcategory:', taskToMove?.title);
            }
          }
        } else {
          const taskIndex = sourceColumn.tasks.findIndex((task: Task) => task.id === taskId);
          console.log('🔍 Task index in column:', taskIndex);
          
          if (taskIndex !== -1) {
            taskToMove = sourceColumn.tasks[taskIndex];
            sourceColumn.tasks.splice(taskIndex, 1);
            console.log('✅ Task removed from column:', taskToMove?.title);
          }
        }
        
        // Update source column task count
        sourceColumn.taskCount = sourceColumn.tasks.length + 
          (sourceColumn.subCategories?.reduce((sum: number, sub: SubCategory) => sum + sub.taskCount, 0) || 0);
      }
      
      // Add task to destination
      if (taskToMove) {
        console.log('🎯 Adding task to destination:', taskToMove?.title);
        const toColumnIndex = newColumns.findIndex((col: Column) => col.title === toColumnId);
        console.log('🔍 Destination column index:', toColumnIndex);
        
        if (toColumnIndex !== -1) {
          const toColumn = newColumns[toColumnIndex];
          
          if (toSubCategoryId && toColumn.subCategories) {
            const subCategoryIndex = toColumn.subCategories.findIndex((sub: SubCategory) => sub.title === toSubCategoryId);
            console.log('🔍 Destination subcategory index:', subCategoryIndex);
            
            if (subCategoryIndex !== -1) {
              toColumn.subCategories[subCategoryIndex].tasks.push(taskToMove);
              toColumn.subCategories[subCategoryIndex].taskCount = 
                toColumn.subCategories[subCategoryIndex].tasks.length;
              console.log('✅ Task added to subcategory');
            }
          } else {
            toColumn.tasks.push(taskToMove);
            console.log('✅ Task added to column');
          }
          
          // Update destination column task count
          toColumn.taskCount = toColumn.tasks.length + 
            (toColumn.subCategories?.reduce((sum: number, sub: SubCategory) => sum + sub.taskCount, 0) || 0);
        }
      } else {
        console.log('❌ No task found to move');
      }
      
      console.log('🔄 Updated columns:', newColumns.map((col: Column) => ({ title: col.title, taskCount: col.taskCount })));
      return newColumns;
    });
  };

  // DropZone component for columns and subcategories
  const DropZone = ({ columnId, subCategoryId, children }: { columnId: string; subCategoryId?: string; children: React.ReactNode }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'task',
      drop: (item: any) => {
        console.log('🎯 DROP TRIGGERED:', { 
          itemId: item.id, 
          itemColumnId: item.columnId, 
          itemSubCategoryId: item.subCategoryId,
          targetColumnId: columnId, 
          targetSubCategoryId: subCategoryId 
        });
        
        // Only move if it's actually a different location
        if (item.columnId !== columnId || item.subCategoryId !== subCategoryId) {
          console.log('✅ MOVING TASK');
          moveTask(item.id, item.columnId, item.subCategoryId, columnId, subCategoryId || null);
        } else {
          console.log('❌ SAME LOCATION');
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }), [columnId, subCategoryId]);

    return (
      <div 
        ref={drop as any}
        className={`min-h-[100px] transition-colors ${
          isOver ? 'bg-mgmt-pink/20 border-2 border-mgmt-pink/40 border-dashed rounded-lg' : ''
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      <div className="h-full overflow-x-auto overflow-y-auto">
        <div className="p-8 h-full">
          <div className="flex gap-6 min-w-max h-full">
          {columns.map((column, index) => (
            <div key={index} className="w-80 flex-shrink-0 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${
                      column.title === 'Uncategorized' ? 'bg-mgmt-beige' :
                      column.title === 'Today' ? 'bg-mgmt-green' :
                      column.title === 'Personal' ? 'bg-mgmt-purple' :
                      column.title === 'Follow-Up' ? 'bg-mgmt-yellow' :
                      column.title === 'Later' ? 'bg-mgmt-pink' :
                      column.title === 'Completed' ? 'bg-mgmt-lime' : 'bg-mgmt-beige'
                    }`}></div>
                    <h2 className="text-gray-900 font-semibold">{column.title}</h2>
                    <span className="text-sm">{
                      column.title === 'Uncategorized' ? '📋' :
                      column.title === 'Today' ? '⚡' :
                      column.title === 'Personal' ? '👤' :
                      column.title === 'Follow-Up' ? '👥' :
                      column.title === 'Later' ? '⏰' :
                      column.title === 'Completed' ? '✅' : '📋'
                    }</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {column.taskCount} tasks, {column.hours} hours
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {column.showAddPerson ? (
                    <button 
                      className="text-gray-400 hover:text-mgmt-yellow transition-colors"
                      onClick={() => {
                        console.log('🔥 USERS BUTTON CLICKED!', column.title);
                        openAddTaskDialog(column.title);
                      }}
                    >
                      <Users className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      className="text-gray-400 hover:text-mgmt-green transition-colors"
                      onClick={() => {
                        console.log('🔥 PLUS BUTTON CLICKED!', column.title);
                        openAddTaskDialog(column.title);
                      }}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <DropZone columnId={column.title}>
                <div className="space-y-3 flex-1 min-h-[200px]">
                  {column.subCategories ? (
                    // Render sub-categories for Today column
                    column.subCategories.map((subCategory, subIndex) => (
                      <div key={subIndex} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            {subCategory.title} ({subCategory.taskCount})
                          </h3>
                          <button 
                            className="text-gray-400 hover:text-mgmt-green transition-colors"
                            onClick={() => {
                              console.log('🔥 SUBCATEGORY PLUS BUTTON CLICKED!', column.title, subCategory.title);
                              openAddTaskDialog(column.title, subCategory.title);
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <DropZone columnId={column.title} subCategoryId={subCategory.title}>
                          <div className="space-y-2 min-h-[80px]">
                            {subCategory.tasks.length > 0 ? (
                              subCategory.tasks.map((task, taskIndex) => (
                                <TaskCard 
                                  key={task.id || `task-${index}-${subIndex}-${taskIndex}`}
                                  {...task} 
                                  id={task.id || `task-${index}-${subIndex}-${taskIndex}`}
                                  columnId={column.title}
                                  subCategoryId={subCategory.title}
                                />
                              ))
                            ) : (
                              <div className="flex items-center justify-center h-16 text-gray-400 text-sm">
                                Drop tasks here
                              </div>
                            )}
                          </div>
                        </DropZone>
                      </div>
                    ))
                  ) : column.tasks.length > 0 ? (
                    // Render regular tasks
                            column.tasks.map((task, taskIndex) => (
                              <TaskCard 
                                key={task.id || `task-${index}-${taskIndex}`}
                                {...task} 
                                id={task.id || `task-${index}-${taskIndex}`}
                                columnId={column.title}
                              />
                            ))
                          ) : (
                            // Empty state
                            <div className="flex items-center justify-center p-8 bg-mgmt-beige/30 rounded-lg border border-mgmt-beige/50 text-center">
                              <div>
                                <div className="w-8 h-8 bg-mgmt-pink/30 rounded-full mx-auto mb-2"></div>
                                <p className="text-sm text-gray-600">No Tasks</p>
                                <p className="text-xs text-gray-500">Tasks will appear here</p>
                              </div>
                            </div>
                          )}
                </div>
              </DropZone>
            </div>
          ))}
          
                  {/* Add Column Button */}
                  <div className="w-80 flex-shrink-0">
                    <div className="flex items-center justify-center h-32 bg-mgmt-pink/20 rounded-lg border-2 border-dashed border-mgmt-pink/40 hover:border-mgmt-pink/60 hover:bg-mgmt-pink/30 transition-all cursor-pointer" onClick={addNewColumn}>
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-mgmt-pink mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Add Column</p>
                        <p className="text-xs text-gray-500">Create a new task column</p>
                      </div>
                    </div>
                  </div>
        </div>
      </div>
    </div>

    {/* Add Task Dialog */}
    <AddTaskDialog
      isOpen={isAddTaskDialogOpen}
      onClose={() => setIsAddTaskDialogOpen(false)}
      onAddTask={handleAddTask}
      columnTitle={addTaskContext?.columnTitle}
      subCategoryTitle={addTaskContext?.subCategoryTitle}
    />
  </>
  );
}