import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xrceskhjzveexqorvutm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyY2Vza2hqenZlZXhxb3J2dXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjAxOTEsImV4cCI6MjA3NTY5NjE5MX0.mlojCWKMyxfkEKGAwejQN17osi0k7ZEQKByrE1l1DBI';

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