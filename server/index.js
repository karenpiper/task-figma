const express = require('express');
const cors = require('cors');
const { supabase, setupDatabase } = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
setupDatabase();

// API Routes

// Get all columns
app.get('/api/columns', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .order('order_index');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('column_id, order_index');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories by column
app.get('/api/columns/:columnId/categories', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('column_id', columnId)
      .order('order_index');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, column_id, order_index } = req.body;
    
    if (!name || !column_id) {
      res.status(400).json({ error: 'Name and column_id are required' });
      return;
    }

    const categoryId = `${column_id}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    const { data, error } = await supabase
      .from('categories')
      .insert({
        id: categoryId,
        name,
        column_id,
        order_index: order_index || 0
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('is_default', false);
    
    if (error) throw error;
    
    if (error) {
      res.status(404).json({ error: 'Category not found or cannot be deleted' });
      return;
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all team members
app.get('/api/team-members', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new team member
app.post('/api/team-members', async (req, res) => {
  try {
    const { name, email, avatar, color } = req.body;
    
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const { data, error } = await supabase
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
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team member
app.put('/api/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, avatar, color, is_active } = req.body;
    
    const { data, error } = await supabase
      .from('team_members')
      .update({
        name,
        email,
        avatar,
        color,
        is_active
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team member
app.delete('/api/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, priority, project, column_id, category_id } = req.body;
    
    if (!title || !priority || !column_id) {
      res.status(400).json({ error: 'Title, priority, and column_id are required' });
      return;
    }

    const { data, error } = await supabase
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

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move task to different column
app.patch('/api/tasks/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
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
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get full board data (columns with categories and tasks)
app.get('/api/board', async (req, res) => {
  try {
    // Get all columns
    const { data: columns, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .order('order_index');
    
    if (columnsError) throw columnsError;
    
    // Get categories and tasks for each column
    const boardData = await Promise.all(columns.map(async (column) => {
      // Only get categories for columns that should have them
      if (column.id === 'today' || column.id === 'follow-up') {
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('column_id', column.id)
          .order('order_index');
        
        if (categoriesError) throw categoriesError;
        
        // Get tasks for each category
        const categoriesWithTasks = await Promise.all(categories.map(async (category) => {
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('category_id', category.id)
            .order('created_at', { ascending: false });
          
          if (tasksError) throw tasksError;
          
          return {
            ...category,
            tasks: tasks || [],
            count: (tasks || []).length
          };
        }));
        
        // Also get tasks that don't have a category_id (direct column tasks)
        const { data: directTasks, error: directTasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('column_id', column.id)
          .is('category_id', null)
          .order('created_at', { ascending: false });
        
        if (directTasksError) throw directTasksError;
        
        const allTasks = [...categoriesWithTasks.flatMap(cat => cat.tasks), ...(directTasks || [])];
        return {
          ...column,
          categories: categoriesWithTasks,
          tasks: directTasks || [],
          count: allTasks.length
        };
      } else {
        // For columns without categories, just get direct tasks
        const { data: directTasks, error: directTasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('column_id', column.id)
          .is('category_id', null)
          .order('created_at', { ascending: false });
        
        if (directTasksError) throw directTasksError;
        
        return {
          ...column,
          categories: [],
          tasks: directTasks || [],
          count: (directTasks || []).length
        };
      }
    }));
    
    res.json(boardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using Supabase database');
}); 