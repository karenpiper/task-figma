import { useState, useEffect, useCallback, useMemo } from 'react';

// API base URL for Next.js API routes
const API_BASE = '/api';

export interface Task {
  id: number;
  title: string;
  priority: string;
  project?: string;
  column_id: string;
  category_id?: string | null;
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

export const useTasksNew = () => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTask = await response.json();
      
      // Optimistic update
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === taskData.column_id) {
            if (taskData.category_id) {
              // Add to category
              return {
                ...column,
                categories: column.categories.map(cat => {
                  if (cat.id === taskData.category_id) {
                    return {
                      ...cat,
                      tasks: [newTask, ...cat.tasks],
                      count: cat.count + 1
                    };
                  }
                  return cat;
                }),
                count: column.count + 1
              };
            } else {
              // Add to direct column tasks
              return {
                ...column,
                tasks: [newTask, ...column.tasks],
                count: column.count + 1
              };
            }
          }
          return column;
        });
      });

      return newTask;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Move task between columns/categories - NEW IMPLEMENTATION
  const moveTask = useCallback(async (taskId: string, targetColumnId: string, targetCategoryId?: string) => {
    try {
      console.log('🚨 NEW CODE VERSION - useTasksNew hook loaded! 🚨');
      console.log(`🚀 Moving task ${taskId} to column ${targetColumnId}, category ${targetCategoryId || 'none'}`);
      
      // NEW IMPLEMENTATION: Local state update only
      const numericTaskId = parseInt(taskId, 10);
      let foundTask: Task | undefined;
      let sourceColumnId: string | undefined;
      let sourceCategoryId: string | undefined;
      
      // Search for the task in current state
      for (const col of columns) {
        // Check direct column tasks
        foundTask = col.tasks.find((task: Task) => task.id === numericTaskId);
        if (foundTask) {
          sourceColumnId = col.id;
          sourceCategoryId = undefined;
          break;
        }
        
        // Check category tasks
        for (const cat of col.categories) {
          foundTask = cat.tasks.find((task: Task) => task.id === numericTaskId);
          if (foundTask) {
            sourceColumnId = col.id;
            sourceCategoryId = cat.id;
            break;
          }
        }
        if (foundTask) break;
      }
      
      if (!foundTask) {
        console.warn(`⚠️ Task ${taskId} not found, attempting refresh...`);
        await fetchBoard();
        setTimeout(() => {
          console.log(`🔄 Retrying move after refresh...`);
          moveTask(taskId, targetColumnId, targetCategoryId);
        }, 500);
        return;
      }
      
      console.log(`📦 Found task "${foundTask.title}" in column "${sourceColumnId}"${sourceCategoryId ? `, category "${sourceCategoryId}"` : ''}`);
      
      // Update local state immediately
      setColumns((prevColumns: Column[]) => {
        return prevColumns.map((column: Column) => {
          if (column.id === sourceColumnId) {
            // Remove task from source
            if (sourceCategoryId) {
              // Remove from category
              return {
                ...column,
                categories: column.categories.map((cat: Category) => {
                  if (cat.id === sourceCategoryId) {
                    return {
                      ...cat,
                      tasks: cat.tasks.filter((t: Task) => t.id !== numericTaskId),
                      count: cat.count - 1
                    };
                  }
                  return cat;
                }),
                count: column.count - 1
              };
            } else {
              // Remove from direct column tasks
              return {
                ...column,
                tasks: column.tasks.filter((t: Task) => t.id !== numericTaskId),
                count: column.count - 1
              };
            }
          } else if (column.id === targetColumnId) {
            // Add task to target
            const updatedTask = { ...foundTask!, column_id: targetColumnId, category_id: targetCategoryId || null };
            
            if (targetCategoryId) {
              // Add to category
              return {
                ...column,
                categories: column.categories.map((cat: Category) => {
                  if (cat.id === targetCategoryId) {
                    return {
                      ...cat,
                      tasks: [updatedTask, ...cat.tasks],
                      count: cat.count + 1
                    };
                  }
                  return cat;
                }),
                count: column.count + 1
              };
            } else {
              // Add to direct column tasks
              return {
                ...column,
                tasks: [updatedTask, ...column.tasks],
                count: column.count + 1
              };
            }
          }
          return column;
        });
      });
      
      console.log('✅ Task moved successfully in local state');
      
      // Try to sync with API in background (but don't fail if it doesn't work)
      try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            column_id: targetColumnId,
            category_id: targetCategoryId
          }),
        });
        
        if (response.ok) {
          console.log('✅ API sync successful');
        } else {
          console.log('⚠️ API sync failed, but local state is updated');
        }
      } catch (error) {
        console.log('⚠️ API sync failed, but local state is updated');
      }
      
    } catch (error) {
      console.error('❌ Error moving task:', error);
      throw error;
    }
  }, [columns, API_BASE, fetchBoard]);

  // Create new category
  const createCategory = useCallback(async (categoryData: { name: string; column_id: string; order_index?: number }) => {
    try {
      setOperationLoading(true);
      
      // Validate required fields
      if (!categoryData.name || !categoryData.column_id) {
        throw new Error('Category name and column_id are required');
      }
      
      // Check if category already exists
      const existingCategory = columns
        .find(col => col.id === categoryData.column_id)
        ?.categories.find(cat => cat.name.toLowerCase() === categoryData.name.toLowerCase());
      
      if (existingCategory) {
        throw new Error('Category with this name already exists in this column');
      }
      
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCategory = await response.json();
      
      // Optimistic update
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === categoryData.column_id) {
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
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [columns, API_BASE]);

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optimistic update
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          const category = column.categories.find(cat => cat.id === categoryId);
          if (category) {
            return {
              ...column,
              categories: column.categories.filter(cat => cat.id !== categoryId),
              count: column.count - category.count
            };
          }
          return column;
        });
      });

      // Don't return anything - void return type
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [API_BASE]);

  // Create team member
  const createTeamMember = useCallback(async (memberData: Partial<TeamMember>) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newMember = await response.json();
      
      // Optimistic update
      setTeamMembers(prev => [...prev, newMember]);

      return newMember;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Update team member
  const updateTeamMember = useCallback(async (id: number, updates: Partial<TeamMember>) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedMember = await response.json();
      
      // Optimistic update
      setTeamMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...updatedMember } : member
      ));

      return updatedMember;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [API_BASE]);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: number) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/team-members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optimistic update
      setTeamMembers(prev => prev.filter(member => member.id !== id));

      return true;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [API_BASE]);

  // Memoize tasks array to prevent unnecessary re-renders
  const tasks = useMemo(() => {
    const allTasks: Task[] = [];
    columns.forEach(column => {
      // Add direct column tasks
      allTasks.push(...column.tasks);
      // Add category tasks
      column.categories.forEach(category => {
        allTasks.push(...category.tasks);
      });
    });
    return allTasks;
  }, [columns]);

  // Initialize data
  useEffect(() => {
    console.log('🔍 useTasksNew hook initialized - using Next.js API routes');
    fetchBoard();
    fetchTeamMembers();
  }, [fetchBoard, fetchTeamMembers]);

  return {
    columns,
    teamMembers,
    loading,
    operationLoading,
    error,
    fetchBoard,
    fetchTeamMembers,
    createTask,
    moveTask,
    createCategory,
    deleteCategory,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    tasks
  };
}; 