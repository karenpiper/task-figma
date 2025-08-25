-- Create tables for the Kanban board application

-- Columns table
CREATE TABLE IF NOT EXISTS columns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  column_id TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  FOREIGN KEY (column_id) REFERENCES columns (id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  project TEXT,
  column_id TEXT NOT NULL DEFAULT 'uncategorized',
  category_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (column_id) REFERENCES columns (id),
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  color TEXT DEFAULT 'bg-blue-500',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default columns
INSERT INTO columns (id, title, color, order_index) VALUES
  ('uncategorized', 'Uncategorized', 'from-slate-400 to-slate-500', 0),
  ('today', 'Today', 'from-blue-400 to-indigo-500', 1),
  ('follow-up', 'Follow-Up', 'from-red-400 to-red-500', 2),
  ('later', 'Later', 'from-purple-400 to-purple-500', 3),
  ('completed', 'Completed', 'from-emerald-400 to-green-500', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert default categories
INSERT INTO categories (id, name, column_id, order_index, is_default) VALUES
  ('today_standing', 'STANDING', 'today', 0, true),
  ('today_comms', 'COMMS', 'today', 1, true),
  ('today_big_tasks', 'BIG TASKS', 'today', 2, true),
  ('today_done', 'DONE', 'today', 3, true),
  ('follow-up_people', 'People', 'follow-up', 0, true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_column_id ON categories(column_id);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (you can customize these later)
CREATE POLICY "Allow public read access" ON columns FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON team_members FOR SELECT USING (true);

-- Create policies for public write access (you can customize these later)
CREATE POLICY "Allow public insert" ON columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON team_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON columns FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON team_members FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON columns FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON categories FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON tasks FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON team_members FOR DELETE USING (true); 