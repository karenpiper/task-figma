import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all categories
        const { data: categories, error: getError } = await supabase
          .from('categories')
          .select('*')
          .order('column_id, order_index');
        
        if (getError) throw getError;
        res.json(categories);
        break;

      case 'POST':
        // Create new category
        const { name, column_id, order_index } = req.body;
        
        if (!name || !column_id) {
          res.status(400).json({ error: 'Name and column_id are required' });
          return;
        }

        const categoryId = `${column_id}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
        
        const { data: newCategory, error: createError } = await supabase
          .from('categories')
          .insert({
            id: categoryId,
            name,
            column_id,
            order_index: order_index || 0
          })
          .select()
          .single();

        if (createError) throw createError;
        res.status(201).json(newCategory);
        break;

      case 'DELETE':
        // Delete category
        const { id } = req.body;
        
        if (!id) {
          res.status(400).json({ error: 'Category ID is required' });
          return;
        }

        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
          .eq('is_default', false);

        if (deleteError) throw deleteError;
        res.json({ message: 'Category deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 