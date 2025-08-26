import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

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
  console.log('🔍 useTasks hook loaded - using direct Supabase calls');
  console.log('🔍 Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
  console.log('🔍 Supabase Key:', supabaseKey ? 'SET' : 'NOT SET');
  
  const [columns, setColumns] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch board data
  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .order('order_index');
      
      if (columnsError) throw columnsError;
      
      // Get categories and tasks for each column
      const boardData = await Promise.all(columnsData.map(async (column) => {
        // Only get categories for columns that should have them
        if (column.id === 'today' || column.id === 'follow-up') {
          const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .eq('column_id', column.id)
            .order('order_index');
          
          if (categoriesError) throw categoriesError;
          
          // Get tasks for each category
          const categoriesWithTasks = await Promise.all(categories.map(async (category) => {
            const { data: tasks, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .eq('category_id', category.id)
              .order('created_at', { ascending: false });
            
            if (tasksError) throw tasksError;
            
            return {
              ...category,
              tasks: tasks || [],
              count: (tasks || []).length
            };
          }));
          
          // Also get tasks that don't have a category_id (direct column tasks)
          const { data: directTasks, error: directTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('column_id', column.id)
            .is('category_id', null)
            .order('created_at', { ascending: false });
          
          if (directTasksError) throw directTasksError;
          
          const allTasks = [...categoriesWithTasks.flatMap(cat => cat.tasks), ...(directTasks || [])];
          return {
            ...column,
            categories: categoriesWithTasks,
            tasks: directTasks || [],
            count: allTasks.length
          };
        } else {
          // For columns without categories, just get direct tasks
          const { data: directTasks, error: directTasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('column_id', column.id)
            .is('category_id', null)
            .order('created_at', { ascending: false });
          
          if (directTasksError) throw directTasksError;
          
          return {
            ...column,
            categories: [],
            tasks: directTasks || [],
            count: (directTasks || []).length
          };
        }
      }));
      
      setColumns(boardData);
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
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  }, []);

  // Create new task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh board data
      await fetchBoard();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create task');
    }
  }, [fetchBoard]);

  // Move task to different column/category
  const moveTask = useCallback(async (taskId: number, columnId: string, categoryId?: string) => {
    try {
      console.log(`Moving task ${taskId} to column ${columnId}, category ${categoryId}`);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ column_id: columnId, category_id: categoryId })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      // Refresh board data
      await fetchBoard();

      console.log('Task moved successfully');
    } catch (err) {
      console.error('Error moving task:', err);
      throw err;
    }
  }, [fetchBoard]);

  // Create new category
  const createCategory = useCallback(async (categoryData: { name: string; column_id: string; order_index?: number }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh board data
      await fetchBoard();
      return data;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  }, [fetchBoard]);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      // Refresh board data
      await fetchBoard();
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  }, [fetchBoard]);

  // Create new team member
  const createTeamMember = useCallback(async (memberData: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(memberData)
        .select()
        .single();

      if (error) throw error;
      setTeamMembers(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating team member:', err);
      throw err;
    }
  }, []);

  // Update team member
  const updateTeamMember = useCallback(async (id: number, updates: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTeamMembers(prev => prev.map(member => member.id === id ? data : member));
      return data;
    } catch (err) {
      console.error('Error updating team member:', err);
      throw err;
    }
  }, []);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
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