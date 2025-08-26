import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

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
    const { column_id, category_id, team_member_id } = await request.json();
    const taskId = parseInt(params.id);
    
    if (!column_id) {
      return NextResponse.json(
        { error: 'Column ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data - only update fields that exist in the database
    const updateData: any = { column_id };
    
    // Only set category_id if it's not null (for team member categories)
    if (category_id !== undefined) {
      updateData.category_id = category_id;
    }
    
    // Note: team_member_id is not stored in the database
    // It's handled client-side for visual grouping only
    if (team_member_id) {
      console.log(`📝 Team member reference: ${team_member_id} (not stored in DB)`);
    }

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to move task' },
      { status: 500 }
    );
  }
} 