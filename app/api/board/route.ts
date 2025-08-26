import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Get all columns
    const { data: columns, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .order('order_index');
    
    if (columnsError) throw columnsError;
    
    // Get team members for automatic category generation
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (teamMembersError) throw teamMembersError;
    
    // Get categories and tasks for each column
    const boardData = await Promise.all(columns.map(async (column) => {
      // Special handling for follow-up column - auto-generate team member categories
      if (column.id === 'follow-up') {
        // Generate team member categories automatically
        const teamMemberCategories = teamMembers.map((member, index) => ({
          id: `follow-up_${member.id}`,
          name: member.name,
          column_id: column.id,
          order_index: index,
          is_default: false,
          tasks: [],
          count: 0
        }));
        
        // Get tasks for each team member category
        const categoriesWithTasks = await Promise.all(teamMemberCategories.map(async (category) => {
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
      }
      // Handle today column with existing categories
      else if (column.id === 'today') {
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
    
    return NextResponse.json(boardData);
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch board' },
      { status: 500 }
    );
  }
} 