import { useState, useEffect, useCallback } from 'react';

export interface Task {
  id: number;
  title: string;
  priority: string;
  project?: string;
  column_id: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  column_id: string;
  order_index: number;
  is_default: boolean;
  tasks: Task[];
  count: number;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  order_index: number;
  categories: Category[];
  tasks: Task[];
  count: number;
}

export interface TeamMember {
  id: number;
  name: string;
  email?: string;
  avatar: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

const API_BASE = 'http://localhost:3001/api';

export function useTasks() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch board data
  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/board`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch board data');
      }
      
      const data = await response.json();
      setColumns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching board:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/team-members`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await response.json();
      setTeamMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (taskData: {
    title: string;
    priority?: string;
    project?: string;
    column_id?: string;
    category_id?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      
      // Update local state
      setColumns(prevColumns => 
        prevColumns.map(column => {
          if (column.id === newTask.column_id) {
            return {
              ...column,
              categories: column.categories.map(category => {
                if (category.id === newTask.category_id) {
                  return {
                    ...category,
                    tasks: [newTask, ...category.tasks],
                    count: category.count + 1
                  };
                }
                return category;
              }),
              tasks: [newTask, ...column.tasks],
              count: column.count + 1
            };
          }
          return column;
        })
      );

      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  }, []);

  // Create new category
  const createCategory = useCallback(async (categoryData: {
    name: string;
    column_id: string;
    order_index?: number;
  }) => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const newCategory = await response.json();
      
      // Update local state
      setColumns(prevColumns => 
        prevColumns.map(column => {
          if (column.id === newCategory.column_id) {
            return {
              ...column,
              categories: [...column.categories, { ...newCategory, tasks: [], count: 0 }]
            };
          }
          return column;
        })
      );

      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Update local state
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          categories: column.categories.filter(cat => cat.id !== categoryId)
        }))
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  }, []);

  // Create new team member
  const createTeamMember = useCallback(async (memberData: {
    name: string;
    email?: string;
    avatar?: string;
    color?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error('Failed to create team member');
      }

      const newMember = await response.json();
      
      // Update local state
      setTeamMembers(prev => [...prev, newMember]);

      return newMember;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team member');
      throw err;
    }
  }, []);

  // Update team member
  const updateTeamMember = useCallback(async (memberId: number, updates: Partial<TeamMember>) => {
    try {
      const response = await fetch(`${API_BASE}/team-members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update team member');
      }

      const updatedMember = await response.json();
      
      // Update local state
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? updatedMember : member
        )
      );

      return updatedMember;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team member');
      throw err;
    }
  }, []);

  // Delete team member
  const deleteTeamMember = useCallback(async (memberId: number) => {
    try {
      const response = await fetch(`${API_BASE}/team-members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }

      // Update local state
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, is_active: false } : member
        )
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team member');
      throw err;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId: number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      
      // Update local state
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          categories: column.categories.map(category => ({
            ...category,
            tasks: category.tasks.map(task => 
              task.id === taskId ? updatedTask : task
            )
          })),
          tasks: column.tasks.map(task => 
            task.id === taskId ? updatedTask : task
          )
        }))
      );

      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  }, []);

  // Move task between columns/categories
  const moveTask = useCallback(async (taskId: number, newColumnId: string, newCategoryId?: string) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column_id: newColumnId, category_id: newCategoryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to move task');
      }

      // Update local state
      setColumns(prevColumns => {
        let taskToMove: Task | null = null;
        let sourceColumnId: string | null = null;
        let sourceCategoryId: string | null = null;

        // Find the task and remove it from source
        const updatedColumns = prevColumns.map(column => {
          if (column.id === newColumnId) return column; // Skip destination column for now
          
          const updatedCategories = column.categories.map(category => {
            const taskIndex = category.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              taskToMove = category.tasks[taskIndex];
              sourceColumnId = column.id;
              sourceCategoryId = category.id;
              return {
                ...category,
                tasks: category.tasks.filter(task => task.id !== taskId),
                count: category.count - 1
              };
            }
            return category;
          });

          return {
            ...column,
            categories: updatedCategories,
            tasks: column.tasks.filter(task => task.id !== taskId),
            count: column.tasks.filter(task => task.id !== taskId).length
          };
        });

        // Add task to destination
        if (taskToMove && sourceColumnId !== newColumnId) {
          return updatedColumns.map(column => {
            if (column.id === newColumnId) {
              const updatedCategories = column.categories.map(category => {
                if (category.id === newCategoryId) {
                  return {
                    ...category,
                    tasks: [taskToMove!, ...category.tasks],
                    count: category.count + 1
                  };
                }
                return category;
              });

              return {
                ...column,
                categories: updatedCategories,
                tasks: [taskToMove!, ...column.tasks],
                count: column.count + 1
              };
            }
            return column;
          });
        }

        return updatedColumns;
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
      throw err;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId: number) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Update local state
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          categories: column.categories.map(category => ({
            ...category,
            tasks: category.tasks.filter(task => task.id !== taskId),
            count: category.tasks.filter(task => task.id !== taskId).length
          })),
          tasks: column.tasks.filter(task => task.id !== taskId),
          count: column.tasks.filter(task => task.id !== taskId).length
        }))
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBoard();
    fetchTeamMembers();
  }, [fetchBoard, fetchTeamMembers]);

  return {
    columns,
    teamMembers,
    loading,
    error,
    createTask,
    createCategory,
    deleteCategory,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateTask,
    moveTask,
    deleteTask,
    refreshBoard: fetchBoard,
    refreshTeamMembers: fetchTeamMembers,
    // Get all tasks from all columns
    get tasks() {
      return columns.flatMap(column => column.tasks);
    }
  };
} 