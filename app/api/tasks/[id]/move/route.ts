import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FORCE HARDCODED CREDENTIALS - IMMEDIATE FIX
const supabaseUrl = 'https://lgryrpcvbojfaljwlcpi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleTaskMove(request, { params });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleTaskMove(request, { params });
}

async function handleTaskMove(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 Move API: Processing move for task ${params.id}`);
    const { column_id, category_id, team_member_id } = await request.json();
    const taskId = parseInt(params.id);
    
    console.log(`📋 Move request: column_id=${column_id}, category_id=${category_id}, team_member_id=${team_member_id}`);
    
    if (!column_id) {
      return NextResponse.json({ error: 'Column ID is required' }, { status: 400 });
    }

    const updateData: any = { column_id };
    
    // Always set category_id if provided - this ensures tasks persist their position
    if (category_id !== undefined) {
      updateData.category_id = category_id;
      console.log(`📝 Setting category_id: ${category_id}`);
    }
    
    if (team_member_id) {
      console.log(`📝 Team member reference: ${team_member_id} (not stored in DB)`);
    }

    console.log(`🔄 Updating task ${taskId} with data:`, updateData);
    console.log(`🔍 Task ID type: ${typeof taskId}, value: ${taskId}`);
    console.log(`🔍 Column ID: ${column_id}, Category ID: ${category_id}`);

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('✅ Task moved successfully:', updatedTask);
    return NextResponse.json(updatedTask);
    
  } catch (error) {
    console.error('❌ Error moving task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to move task' },
      { status: 500 }
    );
  }
} 