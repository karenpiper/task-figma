import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;
    const { column_id, category_id } = req.body;
    
    if (!column_id) {
      res.status(400).json({ error: 'Column ID is required' });
      return;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update({
        column_id,
        category_id: category_id || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Task moved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 