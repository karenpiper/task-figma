import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { recommend, type Rubric } from "../../../../lib/coach/rules";

// Use environment variables for Supabase configuration (matching existing pattern)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xrceskhjzveexqorvutm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_NEW_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json() as Rubric & { 
      summary: string; 
      plus?: string; 
      delta?: string; 
    };
    
    const { summary, plus, delta, ...scores } = body;

    // Validate required fields
    if (!summary || !scores.intent || !scores.framing || !scores.alignment || 
        !scores.boundaries || !scores.concision || !scores.follow || !scores.tone) {
      return NextResponse.json(
        { error: 'Summary and all rubric scores are required' },
        { status: 400 }
      );
    }

    // Validate scores are between 1-5
    const scoreFields = ['intent', 'framing', 'alignment', 'boundaries', 'concision', 'follow', 'tone'];
    for (const field of scoreFields) {
      const score = scores[field as keyof Rubric];
      if (typeof score !== 'number' || score < 1 || score > 5) {
        return NextResponse.json(
          { error: `${field} must be a number between 1 and 5` },
          { status: 400 }
        );
      }
    }

    // Create conversation in database
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert([{ summary, plus, delta, ...scores }])
      .select()
      .single();

    if (convError) throw convError;

    // Generate recommendations using the rules engine
    const recs = recommend(scores);
    const created: any[] = [];

    // Process each recommendation
    for (const r of recs) {
      let externalId: string | undefined;
      
      // If this is a TASK recommendation, try to create it in the existing Kanban system
      if (r.kind === "TASK") {
        try {
          // Create the task in the existing Kanban system using Supabase directly
          const taskData = {
            title: r.title,
            detail: r.body + "\n\nFrom: Coach tab",
            priority: 'medium',
            column_id: 'today', // Default to today column
            category_id: 'today_big_tasks' // Default to big tasks category
          };
          
          // Insert directly into the tasks table
          const { data: task, error: taskError } = await supabase
            .from('tasks')
            .insert([taskData])
            .select()
            .single();
          
          if (!taskError && task) {
            externalId = task.id.toString();
          }
        } catch (error) {
          console.warn('Failed to create Kanban task:', error);
          // Continue without external ID - fail gracefully
        }
      }

      // Create recommendation in database
      const { data: rec, error: recError } = await supabase
        .from("recommendations")
        .insert([{
          conversation_id: conversation.id,
          kind: r.kind,
          title: r.title,
          body: r.body,
          rationale: r.rationale,
          pushed_to_kanban: Boolean(externalId),
          kanban_external_id: externalId
        }])
        .select()
        .single();

      if (recError) throw recError;
      created.push(rec);
    }

    return NextResponse.json({ conversation, recommendations: created });
  } catch (error: any) {
    console.error('Error in coach conversations API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process conversation' },
      { status: 500 }
    );
  }
}
