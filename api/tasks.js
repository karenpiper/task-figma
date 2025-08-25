import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Debug logging to help troubleshoot environment variables
console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
console.log('Supabase Key:', supabaseKey ? 'SET' : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all tasks
        const { data: tasks, error: getError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (getError) throw getError;
        res.json(tasks);
        break;

      case 'POST':
        // Create new task
        const { title, priority, project, column_id, category_id } = req.body;
        
        if (!title || !priority || !column_id) {
          res.status(400).json({ error: 'Title, priority, and column_id are required' });
          return;
        }

        const { data: newTask, error: createError } = await supabase
          .from('tasks')
          .insert({
            title,
            priority,
            project: project || null,
            column_id,
            category_id: category_id || null
          })
          .select()
          .single();

        if (createError) throw createError;
        res.status(201).json(newTask);
        break;

      case 'PUT':
        // Update task
        const { id, ...updates } = req.body;
        
        if (!id) {
          res.status(400).json({ error: 'Task ID is required' });
          return;
        }

        const { data: updatedTask, error: updateError } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        res.json(updatedTask);
        break;

      case 'DELETE':
        // Delete task
        const { id: deleteId } = req.body;
        
        if (!deleteId) {
          res.status(400).json({ error: 'Task ID is required' });
          return;
        }

        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', deleteId);

        if (deleteError) throw deleteError;
        res.json({ message: 'Task deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 