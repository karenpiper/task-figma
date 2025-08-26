import { useState, useEffect, useCallback } from 'react';

// API base URL for Next.js API routes
const API_BASE = '/api';

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

export const useTasks = () => {
  console.log('🔍 useTasks hook loaded - using Next.js API routes');
  
  const [columns, setColumns] = useState<Column[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch board data
  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/board`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setColumns(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch board');
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const newTask = await response.json();
      
      // Update local state optimistically
      setColumns((prevColumns: Column[]) => {
        return prevColumns.map((column: Column) => {
          if (column.id === newTask.column_id) {
            if (newTask.category_id) {
              // Add to category
              const updatedCategories = column.categories.map((category: Category) => {
                if (category.id === newTask.category_id) {
                  return {
                    ...category,
                    tasks: [newTask as Task, ...category.tasks],
                    count: category.tasks.length + 1
                  };
                }
                return category;
              });
              return { ...column, categories: updatedCategories, count: column.count + 1 };
            } else {
              // Add directly to column
              return {
                ...column,
                tasks: [newTask as Task, ...column.tasks],
                count: column.count + 1
              };
            }
          }
          return column;
        });
      });
      
      return newTask;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Move task to different column/category
  const moveTask = useCallback(async (taskId: number, columnId: string, categoryId?: string) => {
    try {
      setOperationLoading(true);
      console.log(`🚀 Moving task ${taskId} to column ${columnId}, category ${categoryId || 'none'}`);
      
      // Validate inputs
      if (!taskId || !columnId) {
        throw new Error('Task ID and Column ID are required');
      }
      
      // Optimistic update - move task immediately in UI
      setColumns((prevColumns: Column[]) => {
        console.log('📊 Updating columns state for optimistic update');
        
        const updatedColumns = prevColumns.map((column: Column) => {
          // Remove task from all columns/categories first
          const updatedCategories = column.categories.map((category: Category) => ({
            ...category,
            tasks: category.tasks.filter((t: Task) => t.id !== taskId)
          }));
          
          return {
            ...column,
            categories: updatedCategories,
            tasks: column.tasks.filter((t: Task) => t.id !== taskId)
          };
        });

        // Add task to destination
        return updatedColumns.map((column: Column) => {
          if (column.id === columnId) {
            if (categoryId) {
              // Add to specific category
              const updatedCategories = column.categories.map((category: Category) => {
                if (category.id === categoryId) {
                  // Find the task in the original data
                  const task = prevColumns
                    .flatMap((col: Column) => [...col.tasks, ...col.categories.flatMap((cat: Category) => cat.tasks)])
                    .find((t: Task) => t.id === taskId);
                  
                  if (task) {
                    console.log(`✅ Adding task to category ${category.name}`);
                    return {
                      ...category,
                      tasks: [task, ...category.tasks]
                    };
                  }
                }
                return category;
              });
              return { ...column, categories: updatedCategories };
            } else {
              // Add directly to column
              const task = prevColumns
                .flatMap((col: Column) => [...col.tasks, ...col.categories.flatMap((cat: Category) => cat.tasks)])
                .find((t: Task) => t.id === taskId);
              
              if (task) {
                console.log(`✅ Adding task directly to column ${column.title}`);
                return {
                  ...column,
                  tasks: [task, ...column.tasks]
                };
              }
            }
          }
          return column;
        });
      });

      // Now do the actual API call
      console.log('🌐 Making API call to move task...');
      const response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column_id: columnId,
          category_id: categoryId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to move task`);
      }

      const result = await response.json();
      console.log('✅ Task moved successfully via API:', result);
      
    } catch (err) {
      console.error('❌ Error moving task:', err);
      
      // If there's an error, revert to the correct state
      console.log('🔄 Reverting state due to error...');
      await fetchBoard();
      
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

  // Create new category
  const createCategory = useCallback(async (categoryData: { name: string; column_id: string; order_index?: number }) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      const newCategory = await response.json();
      
      // Update local state optimistically
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === newCategory.column_id) {
            return {
              ...column,
              categories: [...column.categories, { ...newCategory, tasks: [], count: 0 }]
            };
          }
          return column;
        });
      });
      
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      // Update local state optimistically
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          return {
            ...column,
            categories: column.categories.filter(cat => cat.id !== categoryId)
          };
        });
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Create new team member
  const createTeamMember = useCallback(async (memberData: Partial<TeamMember>) => {
    try {
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create team member');
      }

      const newMember = await response.json();
      setTeamMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      console.error('Error creating team member:', err);
      throw err;
    }
  }, []);

  // Update team member
  const updateTeamMember = useCallback(async (id: number, updates: Partial<TeamMember>) => {
    try {
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update team member');
      }

      const updatedMember = await response.json();
      setTeamMembers(prev => prev.map(member => member.id === id ? updatedMember : member));
      return updatedMember;
    } catch (err) {
      console.error('Error updating team member:', err);
      throw err;
    }
  }, []);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete team member');
      }

      setTeamMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Error deleting team member:', err);
      throw err;
    }
  }, []);

  // Get all tasks (computed getter)
  const getTasks = () => {
    return columns.flatMap(column => [
      ...column.tasks,
      ...column.categories.flatMap(category => category.tasks)
    ]);
  };

  useEffect(() => {
    fetchBoard();
    fetchTeamMembers();
  }, [fetchBoard, fetchTeamMembers]);

  return {
    columns,
    teamMembers,
    loading,
    operationLoading,
    error,
    createTask,
    moveTask,
    createCategory,
    deleteCategory,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    tasks: getTasks(),
    refetch: fetchBoard,
  };
}; 