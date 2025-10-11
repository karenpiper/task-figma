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

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: string;
    statusColor: string;
    userIcon: string;
    time: string;
    comments: number;
  }) => {
    try {
      // Format the task data to match the API expectations
      const formattedTaskData = {
        title: taskData.title,
        description: taskData.description,
        column_id: 'uncategorized', // Default to uncategorized column
        priority: taskData.status.toLowerCase(),
        status: taskData.status,
        estimated_time: taskData.time,
        team_member_id: null
      };
      
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
    <div className="h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-4 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">All Tasks</h1>
          <p className="text-lg text-white/80 drop-shadow-md">
            Overview and management of all tasks across the board
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-200"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white transition-all duration-200"
            >
              <option value="all" className="bg-slate-800 text-white">All Priorities</option>
              <option value="high" className="bg-slate-800 text-white">High Priority</option>
              <option value="medium" className="bg-slate-800 text-white">Medium Priority</option>
              <option value="low" className="bg-slate-800 text-white">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white transition-all duration-200"
            >
              <option value="all" className="bg-slate-800 text-white">All Status</option>
              <option value="pending" className="bg-slate-800 text-white">Pending</option>
              <option value="completed" className="bg-slate-800 text-white">Completed</option>
            </select>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setIsCreatingTask(true)}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task Counts */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{filteredTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Pending</p>
                <p className="text-2xl font-bold text-white">{groupedTasks.pending.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Completed</p>
                <p className="text-2xl font-bold text-white">{groupedTasks.completed.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="px-6 flex-1 overflow-y-auto">
        {/* Pending Tasks */}
        {groupedTasks.pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 drop-shadow-md">Pending Tasks ({groupedTasks.pending.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTasks.pending.map((task) => (
                <div key={task.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-white text-sm line-clamp-2">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.detail && (
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{task.detail}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {task.project && (
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <Tag className="w-3 h-3" />
                        <span>{task.project}</span>
                      </div>
                    )}
                    
                    {task.client && (
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <User className="w-3 h-3" />
                        <span>{task.client}</span>
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center gap-2 text-xs text-white/70">
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
            <h2 className="text-xl font-semibold text-white mb-4 drop-shadow-md">Completed Tasks ({groupedTasks.completed.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTasks.completed.map((task) => (
                <div key={task.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 opacity-75">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-white text-sm line-clamp-2">{task.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      Completed
                    </span>
                  </div>
                  
                  {task.detail && (
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{task.detail}</p>
                  )}
                  
                  <div className="text-xs text-white/70">
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
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
            <p className="text-white/70">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog isOpen={isCreatingTask} onClose={() => setIsCreatingTask(false)} title="Add New Task">
        <AddTaskDialog
          isOpen={isCreatingTask}
          onClose={() => setIsCreatingTask(false)}
          onAddTask={handleCreateTask}
          columnTitle="Uncategorized"
        />
      </Dialog>
    </div>
  );
} 