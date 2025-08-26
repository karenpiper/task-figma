import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FORCE DEPLOYMENT - HARDCODED CREDENTIALS
const supabaseUrl = 'https://lgryrpcvbojfaljwlcpi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('🔍 Test API route: Testing Supabase connection... [FORCE DEPLOYMENT VERSION]');
    
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
        code: testError.code,
        version: 'FORCE DEPLOYMENT VERSION - ' + new Date().toISOString()
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
        code: countError.code,
        version: 'FORCE DEPLOYMENT VERSION - ' + new Date().toISOString()
      }, { status: 500 });
    }
    
    console.log('✅ Test 2 passed: Count query works');
    
    return NextResponse.json({ 
      success: true, 
      message: 'All tests passed [FORCE DEPLOYMENT VERSION]',
      columnsCount: columnsCount,
      supabaseUrl: supabaseUrl,
      supabaseKey: supabaseKey ? 'Set' : 'Not set',
      version: 'FORCE DEPLOYMENT VERSION - ' + new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      version: 'FORCE DEPLOYMENT VERSION - ' + new Date().toISOString()
    }, { status: 500 });
  }
}
