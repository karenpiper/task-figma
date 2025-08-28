import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Task, TeamMember } from '../hooks/useTasksNew';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';
import { Dialog, DialogButton } from './ui/dialog';

interface AllTasksViewProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onCreateTask: (taskData: Partial<Task>, columnId?: string, categoryId?: string) => Promise<any>;
  onMoveTask: (taskId: number, newColumnId: string, newCategoryId?: string) => Promise<void>;
  onTaskComplete: (taskId: number) => Promise<void>;
}

export function AllTasksView({ 
  tasks, 
  teamMembers, 
  onCreateTask, 
  onMoveTask, 
  onTaskComplete 
}: AllTasksViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.detail && task.detail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.project && task.project.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.client && task.client.toLowerCase().includes(searchTerm.toLowerCase()));

      // Priority filter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'completed' && task.column_id === 'completed') ||
        (statusFilter === 'pending' && task.column_id !== 'completed');

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter]);

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    const groups = {
      pending: filteredTasks.filter(task => task.column_id !== 'completed'),
      completed: filteredTasks.filter(task => task.column_id === 'completed')
    };
    return groups;
  }, [filteredTasks]);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      // Format the task data to match the API expectations
      const formattedTaskData = {
        ...taskData,
        due_date: (taskData as any).dueDate, // Map dueDate to due_date
        column_id: 'uncategorized', // Default to uncategorized column
        priority: taskData.priority || 'medium'
      };
      
      // Remove the dueDate property since we've mapped it to due_date
      delete (formattedTaskData as any).dueDate;
      
      await onCreateTask(formattedTaskData);
      setIsCreatingTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (columnId: string) => {
    switch (columnId) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      case 'today': return 'bg-blue-100 text-blue-800';
      case 'uncategorized': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">All Tasks</h1>
          <p className="text-lg text-slate-600">
            Overview and management of all tasks across the board
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setIsCreatingTask(true)}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task Counts */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-800">{filteredTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-800">{groupedTasks.pending.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-800">{groupedTasks.completed.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-7xl mx-auto">
        {/* Pending Tasks */}
        {groupedTasks.pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Pending Tasks ({groupedTasks.pending.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTasks.pending.map((task) => (
                <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-slate-800 text-sm line-clamp-2">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.detail && (
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{task.detail}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {task.project && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Tag className="w-3 h-3" />
                        <span>{task.project}</span>
                      </div>
                    )}
                    
                    {task.client && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span>{task.client}</span>
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.column_id)}`}>
                      {task.column_id}
                    </span>
                    
                    <button
                      onClick={() => onTaskComplete(task.id)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {groupedTasks.completed.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Completed Tasks ({groupedTasks.completed.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTasks.completed.map((task) => (
                <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 opacity-75">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-slate-800 text-sm line-clamp-2">{task.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                  
                  {task.detail && (
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{task.detail}</p>
                  )}
                  
                  <div className="text-xs text-slate-500">
                    Completed on {new Date(task.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Tasks Message */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog isOpen={isCreatingTask} onClose={() => setIsCreatingTask(false)} title="Add New Task">
        <AddTaskDialog
          isOpen={isCreatingTask}
          onClose={() => setIsCreatingTask(false)}
          onSubmit={handleCreateTask}
          columnId="uncategorized"
        />
      </Dialog>
    </div>
  );
} 