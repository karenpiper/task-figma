const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'kanban.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Create tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      project TEXT,
      column_id TEXT NOT NULL DEFAULT 'uncategorized',
      category_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create columns table
  db.run(`
    CREATE TABLE IF NOT EXISTS columns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      color TEXT NOT NULL,
      order_index INTEGER DEFAULT 0
    )
  `);

  // Create categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      column_id TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      is_default BOOLEAN DEFAULT 0,
      FOREIGN KEY (column_id) REFERENCES columns (id)
    )
  `);

  // Create team members table
  db.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      avatar TEXT,
      color TEXT DEFAULT 'bg-blue-500',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default columns if they don't exist
  const defaultColumns = [
    { id: 'uncategorized', title: 'Uncategorized', color: 'from-slate-400 to-slate-500', order_index: 0 },
    { id: 'today', title: 'Today', color: 'from-blue-400 to-indigo-500', order_index: 1 },
    { id: 'follow-up', title: 'Follow-Up', color: 'from-red-400 to-red-500', order_index: 2 },
    { id: 'later', title: 'Later', color: 'from-purple-400 to-purple-500', order_index: 3 },
    { id: 'completed', title: 'Completed', color: 'from-emerald-400 to-green-500', order_index: 4 }
  ];

  defaultColumns.forEach(column => {
    db.run(`
      INSERT OR IGNORE INTO columns (id, title, color, order_index) 
      VALUES (?, ?, ?, ?)
    `, [column.id, column.title, column.color, column.order_index]);
  });

  // Insert default categories for each column
  const defaultCategories = [
    // Today - Day column with categories
    { id: 'today_standing', name: 'STANDING', column_id: 'today', order_index: 0, is_default: 1 },
    { id: 'today_comms', name: 'COMMS', column_id: 'today', order_index: 1, is_default: 1 },
    { id: 'today_big_tasks', name: 'BIG TASKS', column_id: 'today', order_index: 2, is_default: 1 },
    { id: 'today_done', name: 'DONE', column_id: 'today', order_index: 3, is_default: 1 },
    
    // Later - Day column with categories
    { id: 'later_standing', name: 'STANDING', column_id: 'later', order_index: 0, is_default: 1 },
    { id: 'later_comms', name: 'COMMS', column_id: 'later', order_index: 1, is_default: 1 },
    { id: 'later_big_tasks', name: 'BIG TASKS', column_id: 'later', order_index: 2, is_default: 1 },
    { id: 'later_done', name: 'DONE', column_id: 'later', order_index: 3, is_default: 1 },
    
    // Follow-Up - Only for team member assignments
    { id: 'follow-up_people', name: 'People', column_id: 'follow-up', order_index: 0, is_default: 1 }
  ];

  defaultCategories.forEach(category => {
    db.run(`
      INSERT OR IGNORE INTO categories (id, name, column_id, order_index, is_default) 
      VALUES (?, ?, ?, ?, ?)
    `, [category.id, category.name, category.column_id, category.order_index, category.is_default]);
  });

  // Insert sample team members if none exist
  db.get('SELECT COUNT(*) as count FROM team_members', (err, row) => {
    if (row.count === 0) {
      const sampleMembers = [
        { name: 'Sarah Johnson', email: 'sarah@company.com', avatar: 'SJ', color: 'bg-blue-500' },
        { name: 'Mike Chen', email: 'mike@company.com', avatar: 'MC', color: 'bg-green-500' },
        { name: 'Alex Rivera', email: 'alex@company.com', avatar: 'AR', color: 'bg-purple-500' }
      ];

      const stmt = db.prepare('INSERT INTO team_members (name, email, avatar, color) VALUES (?, ?, ?, ?)');
      sampleMembers.forEach(member => {
        stmt.run([member.name, member.email, member.avatar, member.color]);
      });
      stmt.finalize();
    }
  });

  // Insert sample tasks if none exist
  db.get('SELECT COUNT(*) as count FROM tasks', (err, row) => {
    if (row.count === 0) {
      const sampleTasks = [
        // Today column tasks with categories
        { title: 'Daily standup', priority: 'medium', project: 'Daily', column_id: 'today', category_id: 'today_standing' },
        { title: 'Code review', priority: 'high', project: 'Development', column_id: 'today', category_id: 'today_big_tasks' },
        { title: 'Email responses', priority: 'medium', project: 'Communication', column_id: 'today', category_id: 'today_comms' },
        
        // Later column tasks with categories
        { title: 'Backup system check', priority: 'low', project: 'Maintenance', column_id: 'later', category_id: 'later_standing' },
        { title: 'Monthly report', priority: 'high', project: 'Report', column_id: 'later', category_id: 'later_big_tasks' },
        
        // Follow-Up column task
        { title: 'Design system updates', priority: 'medium', project: 'Design', column_id: 'follow-up', category_id: 'follow-up_people' },
        
        // Uncategorized column task (no category)
        { title: 'Quick email check', priority: 'medium', project: 'Email', column_id: 'uncategorized', category_id: null },
        
        // Completed column task (no category)
        { title: 'Weekly planning', priority: 'medium', project: 'Planning', column_id: 'completed', category_id: null }
      ];

      const stmt = db.prepare('INSERT INTO tasks (title, priority, project, column_id, category_id) VALUES (?, ?, ?, ?, ?)');
      sampleTasks.forEach(task => {
        stmt.run([task.title, task.priority, task.project, task.column_id, task.category_id]);
      });
      stmt.finalize();
    }
  });
});

// API Routes

// Get all columns
app.get('/api/columns', (req, res) => {
  db.all('SELECT * FROM columns ORDER BY order_index', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY column_id, order_index', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get categories by column
app.get('/api/columns/:columnId/categories', (req, res) => {
  const { columnId } = req.params;
  db.all('SELECT * FROM categories WHERE column_id = ? ORDER BY order_index', [columnId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new category
app.post('/api/categories', (req, res) => {
  const { name, column_id, order_index } = req.body;
  
  if (!name || !column_id) {
    res.status(400).json({ error: 'Name and column_id are required' });
    return;
  }

  const categoryId = `${column_id}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

  db.run(
    'INSERT INTO categories (id, name, column_id, order_index) VALUES (?, ?, ?, ?)',
    [categoryId, name, column_id, order_index || 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the created category
      db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, category) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json(category);
      });
    }
  );
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM categories WHERE id = ? AND is_default = 0', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Category not found or cannot be deleted' });
      return;
    }
    
    res.json({ message: 'Category deleted successfully' });
  });
});

// Get all team members
app.get('/api/team-members', (req, res) => {
  db.all('SELECT * FROM team_members WHERE is_active = 1 ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new team member
app.post('/api/team-members', (req, res) => {
  const { name, email, avatar, color } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    'INSERT INTO team_members (name, email, avatar, color) VALUES (?, ?, ?, ?)',
    [name, email || null, avatar || name.substring(0, 2).toUpperCase(), color || 'bg-blue-500'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the created team member
      db.get('SELECT * FROM team_members WHERE id = ?', [this.lastID], (err, member) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json(member);
      });
    }
  );
});

// Update team member
app.put('/api/team-members/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, avatar, color, is_active } = req.body;
  
  db.run(
    'UPDATE team_members SET name = ?, email = ?, avatar = ?, color = ?, is_active = ? WHERE id = ?',
    [name, email, avatar, color, is_active, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Team member not found' });
        return;
      }
      
      // Get the updated team member
      db.get('SELECT * FROM team_members WHERE id = ?', [id], (err, member) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(member);
      });
    }
  );
});

// Delete team member
app.delete('/api/team-members/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE team_members SET is_active = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Team member not found' });
      return;
    }
    
    res.json({ message: 'Team member deactivated successfully' });
  });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get tasks by column
app.get('/api/columns/:columnId/tasks', (req, res) => {
  const { columnId } = req.params;
  db.all('SELECT * FROM tasks WHERE column_id = ? ORDER BY created_at DESC', [columnId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, priority, project, column_id, category_id } = req.body;
  
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  db.run(
    'INSERT INTO tasks (title, priority, project, column_id, category_id) VALUES (?, ?, ?, ?, ?)',
    [title, priority || 'medium', project || null, column_id || 'uncategorized', category_id || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the created task
      db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json(task);
      });
    }
  );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, priority, project, column_id, category_id } = req.body;
  
  db.run(
    'UPDATE tasks SET title = ?, priority = ?, project = ?, column_id = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, priority, project, column_id, category_id, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      
      // Get the updated task
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(task);
      });
    }
  );
});

// Move task to different column
app.patch('/api/tasks/:id/move', (req, res) => {
  const { id } = req.params;
  const { column_id, category_id } = req.body;
  
  if (!column_id) {
    res.status(400).json({ error: 'Column ID is required' });
    return;
  }
  
  db.run(
    'UPDATE tasks SET column_id = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [column_id, category_id || null, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      
      res.json({ message: 'Task moved successfully' });
    }
  );
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.json({ message: 'Task deleted successfully' });
  });
});

// Get full board data (columns with categories and tasks)
app.get('/api/board', (req, res) => {
  db.all('SELECT * FROM columns ORDER BY order_index', (err, columns) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Get categories and tasks for each column
    const boardData = columns.map(column => {
      return new Promise((resolve) => {
        db.all('SELECT * FROM categories WHERE column_id = ? ORDER BY order_index', [column.id], (err, categories) => {
          if (err) {
            resolve({ ...column, categories: [], tasks: [], count: 0 });
            return;
          }
          
          // Get tasks for each category
          const categoriesWithTasks = categories.map(category => {
            return new Promise((resolveCategory) => {
              db.all('SELECT * FROM tasks WHERE category_id = ? ORDER BY created_at DESC', [category.id], (err, tasks) => {
                if (err) {
                  resolveCategory({ ...category, tasks: [], count: 0 });
                  return;
                }
                resolveCategory({ ...category, tasks, count: tasks.length });
              });
            });
          });
          
          Promise.all(categoriesWithTasks).then(categoriesData => {
            const allTasks = categoriesData.flatMap(cat => cat.tasks);
            resolve({ ...column, categories: categoriesData, tasks: allTasks, count: allTasks.length });
          });
        });
      });
    });
    
    Promise.all(boardData).then(board => {
      res.json(board);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database initialized at: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 