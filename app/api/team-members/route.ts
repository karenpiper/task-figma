import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Try server-side variables first, fallback to client-side for production
// If all else fails, use hardcoded values to ensure production works
const supabaseUrl = process.env.SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   'https://lgryrpcvbojfaljwlcpi.supabase.co';

const supabaseKey = process.env.SUPABASE_ANON_KEY || 
                   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return NextResponse.json(teamMembers || []);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, avatar, color } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data: newMember, error } = await supabase
      .from('team_members')
      .insert({
        name,
        email: email || null,
        avatar: avatar || name.substring(0, 2).toUpperCase(),
        color: color || 'bg-blue-500'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create team member' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const { data: updatedMember, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 