import { useState, useEffect, useCallback, useMemo } from 'react';

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
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create task`);
      }

      const newTask = await response.json();
      
      // Update local state optimistically
      setColumns((prevColumns: Column[]) => {
        return prevColumns.map((column: Column) => {
          if (column.id === newTask.column_id) {
            if (newTask.category_id) {
              // Check if this is a team member category
              const isTeamMemberCategory = newTask.category_id.startsWith('follow-up_') && 
                /^follow-up_\d+$/.test(newTask.category_id);
              
              if (isTeamMemberCategory) {
                console.log(`🎯 Creating task in team member category: ${newTask.category_id}`);
              }
              
              // Add to specific category
              return {
                ...column,
                categories: column.categories.map((cat: Category) => 
                  cat.id === newTask.category_id 
                    ? { ...cat, tasks: [newTask, ...cat.tasks], count: cat.count + 1 }
                    : cat
                )
              };
            } else {
              // Add directly to column
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
      console.error('❌ Error creating task:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Move task between columns/categories
  const moveTask = useCallback(async (taskId: string, targetColumnId: string, targetCategoryId?: string) => {
    try {
      setOperationLoading(true);
      console.log(`🚀 Moving task ${taskId} to column ${targetColumnId}, category ${targetCategoryId || 'none'}`);
      
      // Check if target column has categories
      const targetColumn = columns.find((col: Column) => col.id === targetColumnId);
      if (targetColumn && targetColumn.categories.length > 0 && !targetCategoryId) {
        // Prevent dropping tasks directly into columns with categories
        throw new Error(`Cannot drop task directly into "${targetColumn.title}" column. Please drop it into a specific category.`);
      }
      
      // Find the task to get team member info if needed
      let foundTask: Task | undefined;
      let sourceColumnId: string | undefined;
      let sourceCategoryId: string | undefined;
      
      for (const col of columns) {
        // Check direct column tasks
        foundTask = col.tasks.find((task: Task) => task.id.toString() === taskId);
        if (foundTask) {
          sourceColumnId = col.id;
          break;
        }
        
        // Check category tasks
        for (const cat of col.categories) {
          foundTask = cat.tasks.find((task: Task) => task.id.toString() === taskId);
          if (foundTask) {
            sourceColumnId = col.id;
            sourceCategoryId = cat.id;
            break;
          }
        }
        if (foundTask) break;
      }
      
      if (!foundTask) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      console.log(`🌐 Making API call to move task...`);
      
      // Prepare the request body
      const requestBody: any = {
        column_id: targetColumnId
      };
      
      if (targetCategoryId) {
        requestBody.category_id = targetCategoryId;
      }
      
      let response: Response;
      
      // Check if this is a team member category (follow-up_1, follow-up_2, etc.)
      const isTeamMemberCategory = targetCategoryId && targetCategoryId.match(/^follow-up_\d+$/);
      if (isTeamMemberCategory) {
        // Extract team member ID from category ID (e.g., "follow-up_1" -> "1")
        const teamMemberId = targetCategoryId.split('_')[1];
        const teamMember = teamMembers.find((tm: TeamMember) => tm.id.toString() === teamMemberId);
        
        if (!teamMember) {
          throw new Error(`Team member not found for category ${targetCategoryId}`);
        }
        
        console.log(`👥 Moving task to team member category: ${teamMember.name}`);
        
        // For team member categories, send team_member_id but not category_id
        response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            column_id: targetColumnId,
            // Don't set category_id for team member categories
            team_member_id: teamMemberId
          }),
        });
      } else {
        // Regular category move
        response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to move task`);
      }

      const result = await response.json();
      console.log('✅ Task moved successfully via API:', result);
      
      // Update local state optimistically
      setColumns((prevColumns: Column[]) => {
        // First, find the task in the current state
        let foundTask: Task | undefined;
        let sourceColumnId: string | undefined;
        let sourceCategoryId: string | undefined;
        
        // Convert taskId to number for comparisons with task.id
        const numericTaskId = parseInt(taskId, 10);
        
        for (const col of prevColumns) {
          // Check direct column tasks
          foundTask = col.tasks.find((task: Task) => task.id === numericTaskId);
          if (foundTask) {
            sourceColumnId = col.id;
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
        
        // If task not found, log warning and return current state
        if (!foundTask) {
          console.warn(`⚠️ Task ${taskId} not found in current state, skipping optimistic update`);
          return prevColumns;
        }
        
        console.log(`📦 Found task: "${foundTask.title}" in column "${sourceColumnId}"${sourceCategoryId ? `, category "${sourceCategoryId}"` : ''}`);
        
        // Check if this is a same-column move (source and target are the same column)
        const isSameColumnMove = sourceColumnId === targetColumnId;
        
        if (isSameColumnMove) {
          console.log(`🔄 Same-column move detected: moving within column "${sourceColumnId}"`);
          
          return prevColumns.map((column: Column) => {
            if (column.id === sourceColumnId) {
              // Handle same-column move by updating categories in one pass
              const updatedCategories = column.categories.map((cat: Category) => {
                if (cat.id === sourceCategoryId) {
                  // Remove from source category
                  return {
                    ...cat,
                    tasks: cat.tasks.filter((t: Task) => t.id !== numericTaskId),
                    count: cat.count - 1
                  };
                } else if (cat.id === targetCategoryId) {
                  // Add to target category
                  return {
                    ...cat,
                    tasks: [foundTask!, ...cat.tasks],
                    count: cat.count + 1
                  };
                }
                return cat;
              });
              
              return {
                ...column,
                categories: updatedCategories,
                // Count stays the same for same-column moves
                count: column.count
              };
            }
            return column;
          });
        } else {
          // Handle cross-column move (original logic)
          return prevColumns.map((column: Column) => {
            // Remove task from source
            if (column.id === sourceColumnId) {
              if (sourceCategoryId) {
                // Remove from category
                const updatedCategories = column.categories.map((cat: Category) => 
                  cat.id === sourceCategoryId 
                    ? { ...cat, tasks: cat.tasks.filter((t: Task) => t.id !== numericTaskId), count: cat.count - 1 }
                    : cat
                );
                
                return {
                  ...column,
                  categories: updatedCategories,
                  count: column.count - 1
                };
              } else {
                // Remove from column directly
                return {
                  ...column,
                  tasks: column.tasks.filter((t: Task) => t.id !== numericTaskId),
                  count: column.count - 1
                };
              }
            }
            
            // Add task to target column
            if (column.id === targetColumnId) {
              if (targetCategoryId) {
                // Add to specific category
                const updatedCategories = column.categories.map((cat: Category) => {
                  if (cat.id === targetCategoryId) {
                    return {
                      ...cat,
                      tasks: [foundTask!, ...cat.tasks],
                      count: cat.count + 1
                    };
                  }
                  return cat;
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
                  tasks: [foundTask!, ...column.tasks],
                  count: column.count + 1
                };
              }
            }
            
            return column;
          });
        }
      });
      
      console.log(`✅ Task ${taskId} moved successfully to column ${targetColumnId}`);
      
      if (targetCategoryId) {
        console.log(`✅ Task ${taskId} moved successfully to category ${targetCategoryId}`);
      }
      
    } catch (err) {
      console.error('❌ Error moving task:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [teamMembers]);

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
        .flatMap(col => col.categories)
        .find(cat => cat.name.toLowerCase() === categoryData.name.toLowerCase() && cat.column_id === categoryData.column_id);
      
      if (existingCategory) {
        console.log(`ℹ️ Category "${categoryData.name}" already exists, returning existing category`);
        return existingCategory;
      }
      
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryData.name,
          column_id: categoryData.column_id,
          order_index: categoryData.order_index || 0,
          is_default: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create category`);
      }

      const newCategory = await response.json();
      
      // Update local state optimistically
      setColumns((prevColumns: Column[]) => {
        return prevColumns.map((column: Column) => {
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
      console.error('❌ Error creating category:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [columns]);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      setOperationLoading(true);
      
      // Prevent deletion of auto-generated team member categories
      if (categoryId.startsWith('follow-up_') && /^follow-up_\d+$/.test(categoryId)) {
        console.log(`🛡️ Preventing deletion of auto-generated team member category: ${categoryId}`);
        return;
      }
      
      const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to delete category`);
      }
      
      // Update local state optimistically
      setColumns((prevColumns: Column[]) => {
        return prevColumns.map((column: Column) => {
          return {
            ...column,
            categories: column.categories.filter((cat: Category) => cat.id !== categoryId)
          };
        });
      });
      
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Create new team member
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
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create team member`);
      }

      const newMember = await response.json();
      
      // Update local state optimistically
      setTeamMembers((prev: TeamMember[]) => [...prev, newMember]);
      
      return newMember;
    } catch (err) {
      console.error('❌ Error creating team member:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Update team member
  const updateTeamMember = useCallback(async (id: number, updates: Partial<TeamMember>) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/team-members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to update team member`);
      }

      const updatedMember = await response.json();
      
      // Update local state optimistically
      setTeamMembers((prev: TeamMember[]) => 
        prev.map(member => member.id === id ? updatedMember : member)
      );
      
      return updatedMember;
    } catch (err) {
      console.error('❌ Error updating team member:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: number) => {
    try {
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/team-members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to delete team member`);
      }

      // Update local state optimistically
      setTeamMembers((prev: TeamMember[]) => prev.filter(member => member.id !== id));
      
    } catch (err) {
      console.error('❌ Error deleting team member:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Get all tasks (memoized to prevent unnecessary re-renders)
  const tasks = useMemo(() => {
    return columns.flatMap(column => [
      ...column.tasks,
      ...column.categories.flatMap(category => category.tasks)
    ]);
  }, [columns]);

  // Initialize data only once
  useEffect(() => {
    console.log('🔍 useTasks hook initialized - using Next.js API routes');
    fetchBoard();
    fetchTeamMembers();
  }, []); // Empty dependency array - only run once

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
    tasks,
    refetch: fetchBoard,
  };
}; 