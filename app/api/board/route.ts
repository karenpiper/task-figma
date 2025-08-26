import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    
    // Get categories and tasks for each column
    const boardData = await Promise.all(columns.map(async (column) => {
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
    
    return NextResponse.json(boardData);
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch board' },
      { status: 500 }
    );
  }
} 