import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FORCE HARDCODED CREDENTIALS - IMMEDIATE FIX
const supabaseUrl = 'https://lgryrpcvbojfaljwlcpi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('🔍 Board API: Starting fetch... [UPDATED VERSION]');
    
    // Get all columns
    const { data: columns, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .order('order_index');
    
    if (columnsError) {
      console.error('❌ Columns error:', columnsError);
      throw columnsError;
    }
    
    console.log('✅ Columns fetched:', columns?.length);
    
    // Get team members for automatic category generation
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (teamMembersError) {
      console.error('❌ Team members error:', teamMembersError);
      throw teamMembersError;
    }
    
    console.log('✅ Team members fetched:', teamMembers?.length);
    
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
        
        // Get direct column tasks
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
        
        // Get direct column tasks
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
      // Handle other columns (uncategorized, later, completed)
      else {
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('column_id', column.id)
          .order('created_at', { ascending: false });
        
        if (tasksError) throw tasksError;
        
        return {
          ...column,
          categories: [],
          tasks: tasks || [],
          count: (tasks || []).length
        };
      }
    }));
    
    // Generate team member categories for follow-up column
    const followUpColumn = boardData.columns.find(col => col.id === 'follow-up');
    if (followUpColumn && teamMembers.length > 0) {
      followUpColumn.categories = teamMembers.map((member, index) => ({
        id: `follow-up_${member.id}`,
        name: member.name,
        column_id: 'follow-up',
        order_index: index,
        is_default: false,
        tasks: tasks.filter(task => 
          task.column_id === 'follow-up' && 
          task.team_member_id === member.id
        ),
        count: tasks.filter(task => 
          task.column_id === 'follow-up' && 
          task.team_member_id === member.id
        ).length
      }));
      
      // Update follow-up column count to include all tasks
      followUpColumn.count = tasks.filter(task => task.column_id === 'follow-up').length;
    }

    console.log('✅ Board data assembled successfully [UPDATED VERSION]');
    return NextResponse.json(boardData);
    
  } catch (error) {
    console.error('❌ Board API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch board',
      details: error instanceof Error ? error.message : 'Unknown error',
      version: 'UPDATED VERSION - ' + new Date().toISOString()
    }, { status: 500 });
  }
} 