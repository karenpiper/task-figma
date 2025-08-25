const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema setup
const setupDatabase = async () => {
  try {
    // Create tables if they don't exist
    const { error: columnsError } = await supabase.rpc('create_tables_if_not_exist');
    
    if (columnsError) {
      console.log('Tables already exist or error creating them');
    }
    
    // Insert default columns
    const defaultColumns = [
      { id: 'uncategorized', title: 'Uncategorized', color: 'from-slate-400 to-slate-500', order_index: 0 },
      { id: 'today', title: 'Today', color: 'from-blue-400 to-indigo-500', order_index: 1 },
      { id: 'follow-up', title: 'Follow-Up', color: 'from-red-400 to-red-500', order_index: 2 },
      { id: 'later', title: 'Later', color: 'from-purple-400 to-purple-500', order_index: 3 },
      { id: 'completed', title: 'Completed', color: 'from-emerald-400 to-green-500', order_index: 4 }
    ];

    for (const column of defaultColumns) {
      const { error } = await supabase
        .from('columns')
        .upsert(column, { onConflict: 'id' });
      
      if (error) {
        console.log(`Column ${column.id} already exists or error:`, error.message);
      }
    }

    // Insert default categories
    const defaultCategories = [
      { id: 'today_standing', name: 'STANDING', column_id: 'today', order_index: 0, is_default: true },
      { id: 'today_comms', name: 'COMMS', column_id: 'today', order_index: 1, is_default: true },
      { id: 'today_big_tasks', name: 'BIG TASKS', column_id: 'today', order_index: 2, is_default: true },
      { id: 'today_done', name: 'DONE', column_id: 'today', order_index: 3, is_default: true },
      { id: 'follow-up_people', name: 'People', column_id: 'follow-up', order_index: 0, is_default: true }
    ];

    for (const category of defaultCategories) {
      const { error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'id' });
      
      if (error) {
        console.log(`Category ${category.id} already exists or error:`, error.message);
      }
    }

    console.log('Database setup completed');
  } catch (error) {
    console.error('Database setup error:', error);
  }
};

module.exports = { supabase, setupDatabase }; 