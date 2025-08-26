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

  // Move task between columns/categories
  const moveTask = useCallback(async (taskId: number, targetColumnId: string, targetCategoryId?: string) => {
    try {
      setOperationLoading(true);
      
      console.log(`🚀 Moving task ${taskId} to column ${targetColumnId}, category ${targetCategoryId || 'none'}`);
      
      let response: Response;
      
      // Check if this is a team member category in follow-up column
      const isTeamMemberCategory = targetCategoryId && targetCategoryId.startsWith('follow-up_');
      
      // For team member categories, we need to handle them specially since they don't exist in the database
      if (isTeamMemberCategory) {
        console.log('🎯 Detected team member category, handling specially...');
        
        // Extract team member ID from category ID
        const teamMemberId = targetCategoryId.replace('follow-up_', '');
        
        // Find the team member
        const teamMember = teamMembers.find((member: TeamMember) => member.id.toString() === teamMemberId);
        if (!teamMember) {
          throw new Error(`Team member not found for category ${targetCategoryId}`);
        }
        
        console.log(`👤 Moving task to team member: ${teamMember.name}`);
        
        // Move task to follow-up column without a category (we'll handle the visual grouping in the UI)
        response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            column_id: targetColumnId,
            category_id: null, // No category_id for team member categories
            team_member_id: teamMemberId // Store team member reference
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to move task`);
        }
      } else {
        // Standard category movement
        console.log('🌐 Making API call to move task...');
        
        response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            column_id: targetColumnId,
            category_id: targetCategoryId
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to move task`);
        }
      }

      const result = await response.json();
      console.log('✅ Task moved successfully via API:', result);
      
      // Optimistic update
      setColumns((prevColumns: Column[]) => {
        console.log('📊 Updating columns state for optimistic update');
        
        // Find the task in current columns
        let foundTask: Task | null = null;
        let sourceColumn: Column | null = null;
        let sourceCategory: Category | null = null;
        
        for (const col of prevColumns) {
          // Check direct column tasks
          const directTask = col.tasks.find((t: Task) => t.id === taskId);
          if (directTask) {
            foundTask = directTask;
            sourceColumn = col;
            break;
          }
          
          // Check category tasks
          for (const cat of col.categories) {
            const categoryTask = cat.tasks.find((t: Task) => t.id === taskId);
            if (categoryTask) {
              foundTask = categoryTask;
              sourceColumn = col;
              sourceCategory = cat;
              break;
            }
          }
          if (foundTask) break;
        }
        
        if (!foundTask) {
          console.warn('⚠️ Task not found in current state, skipping optimistic update');
          return prevColumns;
        }
        
        console.log(`📦 Found task: "${foundTask.title}" in column "${sourceColumn?.title}"`);
        
        return prevColumns.map((column: Column) => {
          // Remove task from source
          if (column.id === sourceColumn?.id) {
            if (sourceCategory) {
              // Remove from category
              return {
                ...column,
                categories: column.categories.map((cat: Category) => 
                  cat.id === sourceCategory?.id 
                    ? { ...cat, tasks: cat.tasks.filter((t: Task) => t.id !== taskId) }
                    : cat
                )
              };
            } else {
              // Remove from direct column tasks
              return {
                ...column,
                tasks: column.tasks.filter((t: Task) => t.id !== taskId)
              };
            }
          }
          
          // Add task to target
          if (column.id === targetColumnId) {
            if (targetCategoryId && !targetCategoryId.startsWith('follow-up_')) {
              // Add to regular category
              console.log(`✅ Adding task to category ${targetCategoryId}`);
              return {
                ...column,
                categories: column.categories.map((cat: Category) => 
                  cat.id === targetCategoryId 
                    ? { ...cat, tasks: [...cat.tasks, foundTask!] }
                    : cat
                )
              };
            } else {
              // Add directly to column (for team member categories or no category)
              const categoryName = targetCategoryId?.startsWith('follow-up_') 
                ? `Team Member (${targetCategoryId.replace('follow-up_', '')})`
                : 'Direct Column';
              console.log(`✅ Adding task directly to column ${column.title}`);
              return {
                ...column,
                tasks: [...column.tasks, foundTask!]
              };
            }
          }
          
          return column;
        });
      });
      
      console.log(`✅ Task ${taskId} moved successfully to column ${targetColumnId}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to move task:', error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  }, [teamMembers]);

  // Create new category
  const createCategory = useCallback(async (categoryData: { name: string; column_id: string; order_index?: number }) => {
    try {
      setOperationLoading(true);
      
      console.log('🚀 Creating category with data:', JSON.stringify(categoryData, null, 2));
      
      // Validate required fields
      if (!categoryData.name || !categoryData.column_id) {
        throw new Error('Category name and column_id are required');
      }
      
      // Check if category already exists
      const existingCategory = columns
        .find((col: Column) => col.id === categoryData.column_id)
        ?.categories.find((cat: Category) => cat.name.toLowerCase() === categoryData.name.toLowerCase());
      
      if (existingCategory) {
        console.warn(`⚠️ Category "${categoryData.name}" already exists in column "${categoryData.column_id}"`);
        return existingCategory; // Return existing category instead of creating duplicate
      }
      
      const requestBody = {
        ...categoryData,
        order_index: categoryData.order_index || 0,
        is_default: false
      };
      
      console.log('📤 Sending request to API:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 API Response status:', response.status);
      console.log('📥 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ API Error Response:', JSON.stringify(errorData, null, 2));
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create category`);
      }

      const newCategory = await response.json();
      console.log('✅ Category created successfully:', JSON.stringify(newCategory, null, 2));
      
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
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        categoryData
      });
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [columns]);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      // Prevent deletion of auto-generated team member categories
      if (categoryId.startsWith('follow-up_')) {
        console.warn('⚠️ Cannot delete auto-generated team member category:', categoryId);
        return; // Silently ignore deletion attempts for team member categories
      }
      
      setOperationLoading(true);
      
      const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to delete category`);
      }

      // Update local state optimistically
      setColumns((prevColumns: Column[]) => {
        return prevColumns.map((column: Column) => ({
          ...column,
          categories: column.categories.filter((cat: Category) => cat.id !== categoryId)
        }));
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