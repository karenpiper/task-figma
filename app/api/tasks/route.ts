import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lgryrpcvbojfaljwlcpi.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();
    
    if (!taskData.title || !taskData.column_id) {
      return NextResponse.json(
        { error: 'Title and column_id are required' },
        { status: 400 }
      );
    }

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create task' },
      { status: 500 }
    );
  }
} 