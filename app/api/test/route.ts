import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Try server-side variables first, fallback to client-side for production
// If all else fails, use hardcoded values to ensure production works
const supabaseUrl = process.env.SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   'https://lgryrpcvbojfaljwlcpi.supabase.co';

const supabaseKey = process.env.SUPABASE_ANON_KEY || 
                   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('🔍 Test API route: Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('columns')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Test 1 failed:', testError);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: testError.message,
        code: testError.code 
      }, { status: 500 });
    }
    
    console.log('✅ Test 1 passed: Basic connection works');
    
    // Test 2: Get columns count
    const { count: columnsCount, error: countError } = await supabase
      .from('columns')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Test 2 failed:', countError);
      return NextResponse.json({ 
        error: 'Count query failed', 
        details: countError.message,
        code: countError.code 
      }, { status: 500 });
    }
    
    console.log('✅ Test 2 passed: Count query works');
    
    return NextResponse.json({ 
      success: true, 
      message: 'All tests passed',
      columnsCount: columnsCount,
      supabaseUrl: supabaseUrl ? 'Set' : 'Not set',
      supabaseKey: supabaseKey ? 'Set' : 'Not set'
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} // FORCE DEPLOYMENT - Tue Aug 26 14:56:28 PDT 2025
