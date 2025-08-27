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

  // Simple, stable fetch function
  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      console.log(`🔄 Fetching board data at ${new Date().toISOString()} (timestamp: ${timestamp})`);
      
      const response = await fetch(`${API_BASE}/board?t=${timestamp}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Debug: Check follow-up column
      const followUpColumn = data.find((col: any) => col.id === 'follow-up');
      if (followUpColumn) {
        console.log(`🔍 Follow-up column found with ${followUpColumn.categories?.length || 0} categories`);
      }
      
      // Simple state update - no functional updates that could cause conflicts
      setColumns(data);
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
      
      // For now, just refresh the board data
      // TODO: Implement proper move logic
      await fetchBoard();
      
    } catch (err) {
      console.error('Error moving task:', err);
      throw err;
    }
  }, [fetchBoard]);

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
      
      // Update team members state
      setTeamMembers(prev => [...prev, newMember]);
      
      // Refresh board data to show new team member in follow-up column
      console.log('🔄 Refreshing board data after team member creation...');
      await fetchBoard();

      return newMember;
    } catch (err) {
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, [fetchBoard]);

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
      await fetchBoard();

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
      await fetchBoard();

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
    console.log('🔍 useTasksNew hook initialized - using Next.js API routes');
    fetchBoard();
    fetchTeamMembers();
  }, []); // No dependencies - run only once

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