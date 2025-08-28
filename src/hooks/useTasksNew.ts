import { useState, useEffect, useCallback, useMemo } from 'react';

// API base URL for Next.js API routes
const API_BASE = '/api';

export interface Task {
  id: number;
  title: string;
  detail?: string;
  priority: string;
  project?: string;
  client?: string;
  due_date?: string;
  notes?: string;
  column_id: string;
  category_id?: string | null;
  team_member_id?: number | null;
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
  avatar: string;
  color: string;
  is_strategy_team: boolean;
  is_active: boolean;
  created_at: string;
}

export const useTasksNew = () => {
  // Generate unique ID for this hook instance
  const hookId = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  
  const [columns, setColumns] = useState<Column[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(`🔍 Hook instance ${hookId} initialized`);

  // Simple, stable fetch function
  const fetchBoard = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      console.log(`🔄 Fetching board data at ${new Date().toISOString()} (timestamp: ${timestamp}) - Force refresh: ${forceRefresh}`);
      
      const url = forceRefresh ? `${API_BASE}/board?refresh=true&t=${timestamp}` : `${API_BASE}/board?t=${timestamp}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Debug: Check follow-up column
      const followUpColumn = data.find((col: any) => col.id === 'follow-up');
      if (followUpColumn) {
        console.log(`🔍 Follow-up column found with ${followUpColumn.categories?.length || 0} categories`);
        console.log(`👥 Categories:`, followUpColumn.categories?.map((cat: any) => ({ id: cat.id, name: cat.name })));
      }
      
      console.log('🔄 About to set columns state with data:', {
        dataLength: data.length,
        dataStructure: data.map((col: any) => ({
          id: col.id,
          categoriesCount: col.categories?.length || 0,
          tasksCount: col.tasks?.length || 0
        }))
      });
      
      // DEBUG: Check follow-up column data specifically
      const followUpCol = data.find((col: any) => col.id === 'follow-up');
      if (followUpCol) {
        console.log('🔍 DEBUG: Follow-up column data received:', {
          id: followUpCol.id,
          categoriesCount: followUpCol.categories?.length || 0,
          categories: followUpCol.categories?.map((cat: any) => ({ id: cat.id, name: cat.name }))
        });
      }
      
      // Simple state update - no functional updates that could cause conflicts
      setColumns(data);
      
      // DEBUG: Log the data we're setting
      console.log('🔍 DEBUG: Setting columns state with data:', {
        dataLength: data.length,
        followUpColumn: data.find((col: any) => col.id === 'follow-up')?.categories?.length || 0
      });
      
      setError(null);
      console.log('✅ Board data updated successfully');
      
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
      
      // Refresh board data to show new task
      await fetchBoard();
      return newTask;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

  // Move task between columns/categories
  const moveTask = useCallback(async (taskId: number, targetColumnId: string, targetCategoryId?: string) => {
    try {
      console.log(`🚀 Moving task ${taskId} to column ${targetColumnId}, category ${targetCategoryId || 'none'}`);
      
      // Call the move API endpoint
      const response = await fetch(`${API_BASE}/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column_id: targetColumnId,
          category_id: targetCategoryId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Move API error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const updatedTask = await response.json();
      console.log('✅ Task moved successfully:', updatedTask);
      
      // Update local state optimistically
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          categories: column.categories.map(category => ({
            ...category,
            tasks: category.tasks.map(task => 
              task.id === taskId 
                ? { ...task, column_id: targetColumnId, category_id: targetCategoryId }
                : task
            )
          })),
          // Also update tasks directly in the column
          tasks: column.tasks.map(task => 
            task.id === taskId 
              ? { ...task, column_id: targetColumnId, category_id: targetCategoryId }
              : task
          )
        }))
      );
      
    } catch (err) {
      console.error('❌ Error moving task:', err);
      // Don't throw the error - just log it and let the UI handle it gracefully
      console.error('Task move failed, but continuing...');
    }
  }, []);

  // Create category
  const createCategory = useCallback(async (categoryData: Partial<Category>) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCategory = await response.json();
      
      // Refresh board data to show new category
      await fetchBoard();
      return newCategory;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

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

      // Refresh board data to remove deleted category
      await fetchBoard();
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

  // Create team member - SIMPLIFIED APPROACH
  const createTeamMember = useCallback(async (memberData: Partial<TeamMember>) => {
    try {
      console.log('🚀 createTeamMember called with:', memberData);
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
      console.log('✅ Team member created:', newMember);
      
      // Update team members state
      console.log('🔄 Updating team members state...');
      setTeamMembers(prev => {
        const newState = [...prev, newMember];
        console.log('👥 New team members state:', newState.length, 'members');
        return newState;
      });
      
      // Refresh board data to show new team member in follow-up column
      console.log('🔄 Refreshing board data after team member creation...');
      console.log('🔍 Current columns state before fetchBoard:', {
        columnsLength: columns.length,
        followUpCategories: columns.find(col => col.id === 'follow-up')?.categories?.length || 0
      });
      
      // Wait a bit for database transaction to commit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Single refresh with force refresh
      await fetchBoard(true);
      
      console.log('🔍 DEBUG: Single refresh completed with force refresh');

      return newMember;
    } catch (err) {
      console.error('❌ Error in createTeamMember:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard, columns]);

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
      
      // Update team members state
      setTeamMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...updatedMember } : member
      ));

      // Refresh board data to update follow-up column
      await fetchBoard(true); // Force refresh

      return updatedMember;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

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

      // Update team members state
      setTeamMembers(prev => prev.filter(member => member.id !== id));

      // Refresh board data to update follow-up column
      await fetchBoard(true); // Force refresh

      return true;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

  // Memoize tasks array
  const tasks = useMemo(() => {
    const allTasks: Task[] = [];
    columns.forEach(column => {
      allTasks.push(...column.tasks);
      column.categories.forEach(category => {
        allTasks.push(...category.tasks);
      });
    });
    return allTasks;
  }, [columns]);

  // Initialize data - SIMPLE, STABLE
  useEffect(() => {
    console.log(`🔍 Hook instance ${hookId} useEffect running - initializing data`);
    console.log('🔍 useTasksNew hook initialized - using Next.js API routes');
    fetchBoard();
    fetchTeamMembers();
  }, []); // No dependencies - run only once

  // Monitor columns state changes
  useEffect(() => {
    console.log(`🔍 Hook instance ${hookId} columns state changed:`, {
      columnsLength: columns.length,
      followUpCategories: columns.find(col => col.id === 'follow-up')?.categories?.length || 0
    });
  }, [columns, hookId]);

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