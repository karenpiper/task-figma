import { useState, useEffect, useCallback } from 'react';

// API base URL for Vercel deployment
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
  const [columns, setColumns] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setTeamMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
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
      
      // Update local state
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === newTask.column_id) {
            if (newTask.category_id) {
              // Add to category
              const updatedCategories = column.categories.map(category => {
                if (category.id === newTask.category_id) {
                  return {
                    ...category,
                    tasks: [...category.tasks, newTask],
                    count: category.tasks.length + 1
                  };
                }
                return category;
              });
              return { ...column, categories: updatedCategories };
            } else {
              // Add directly to column
              return {
                ...column,
                tasks: [...column.tasks, newTask],
                count: column.tasks.length + 1
              };
            }
          }
          return column;
        });
      });

      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  // Move task to different column/category
  const moveTask = useCallback(async (taskId: number, columnId: string, categoryId?: string) => {
    try {
      console.log(`Moving task ${taskId} to column ${columnId}, category ${categoryId}`);
      
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
        throw new Error(errorData.error || 'Failed to move task');
      }

      // Update local state
      setColumns(prevColumns => {
        let movedTask: Task | null = null;
        let sourceColumn: Column | null = null;
        let sourceCategory: Category | null = null;

        // Find and remove task from source
        const updatedColumns = prevColumns.map(column => {
          if (column.id === columnId) {
            // This is the destination column
            return column;
          }

          // Check if task is in this column's categories
          const updatedCategories = column.categories.map(category => {
            const taskIndex = category.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              movedTask = category.tasks[taskIndex];
              sourceColumn = column;
              sourceCategory = category;
              return {
                ...category,
                tasks: category.tasks.filter(t => t.id !== taskId),
                count: category.tasks.length - 1
              };
            }
            return category;
          });

          // Check if task is directly in this column
          const taskIndex = column.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            movedTask = column.tasks[taskIndex];
            sourceColumn = column;
            return {
              ...column,
              tasks: column.tasks.filter(t => t.id !== taskId),
              count: column.tasks.length - 1
            };
          }

          return { ...column, categories: updatedCategories };
        });

        // Add task to destination
        if (movedTask && sourceColumn) {
          return updatedColumns.map(column => {
            if (column.id === columnId) {
              const updatedTask = { ...movedTask!, column_id: columnId, category_id: categoryId };
              
              if (categoryId) {
                // Add to category
                const updatedCategories = column.categories.map(category => {
                  if (category.id === categoryId) {
                    return {
                      ...category,
                      tasks: [...category.tasks, updatedTask],
                      count: category.tasks.length + 1
                    };
                  }
                  return category;
                });
                return {
                  ...column,
                  categories: updatedCategories,
                  count: column.count + 1
                };
              } else {
                // Add directly to column
                return {
                  ...column,
                  tasks: [...column.tasks, updatedTask],
                  count: column.count + 1
                };
              }
            }
            return column;
          });
        }

        return updatedColumns;
      });

      console.log('Task moved successfully');
    } catch (err) {
      console.error('Error moving task:', err);
      throw err;
    }
  }, []);

  // Create new category
  const createCategory = useCallback(async (categoryData: { name: string; column_id: string; order_index?: number }) => {
    try {
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
      
      // Update local state
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
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
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

      // Update local state
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
  const get tasks() {
    return columns.flatMap(column => [
      ...column.tasks,
      ...column.categories.flatMap(category => category.tasks)
    ]);
  }

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
    moveTask,
    createCategory,
    deleteCategory,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    tasks,
    refetch: fetchBoard,
  };
}; 