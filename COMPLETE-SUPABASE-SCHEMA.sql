-- =====================================================
-- COMPLETE SUPABASE SCHEMA EXPORT
-- Karenban Task Management App + Coach Feature
-- =====================================================
-- 
-- This file contains the complete database schema for transferring
-- your Supabase project to a new organization.
-- 
-- Run this entire script in your new Supabase project's SQL Editor
-- to recreate the complete database structure.
--
-- =====================================================

-- =====================================================
-- 1. CORE KANBAN TABLES
-- =====================================================

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

-- Team members table (updated structure) - CREATE FIRST
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  color TEXT DEFAULT 'bg-blue-500',
  is_active BOOLEAN DEFAULT true,
  is_strategy_team BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (with all fields) - CREATE AFTER team_members
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  project TEXT,
  column_id TEXT NOT NULL DEFAULT 'uncategorized',
  category_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Additional fields added over time
  detail TEXT,
  client TEXT,
  due_date DATE,
  notes TEXT,
  team_member_id INTEGER REFERENCES team_members(id),
  -- Week view fields
  week_day INTEGER,
  is_week_task BOOLEAN DEFAULT false,
  FOREIGN KEY (column_id) REFERENCES columns (id)
);

-- =====================================================
-- 2. COACH FEATURE TABLES
-- =====================================================

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  summary TEXT NOT NULL,
  intent INT NOT NULL CHECK (intent >= 1 AND intent <= 5),
  framing INT NOT NULL CHECK (framing >= 1 AND framing <= 5),
  alignment INT NOT NULL CHECK (alignment >= 1 AND alignment <= 5),
  boundaries INT NOT NULL CHECK (boundaries >= 1 AND boundaries <= 5),
  concision INT NOT NULL CHECK (concision >= 1 AND concision <= 5),
  follow INT NOT NULL CHECK (follow >= 1 AND follow <= 5),
  tone INT NOT NULL CHECK (tone >= 1 AND tone <= 5),
  plus TEXT,
  delta TEXT
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('EXERCISE','READ','SCRIPT','TASK')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  rationale TEXT,
  pushed_to_kanban BOOLEAN DEFAULT FALSE,
  kanban_external_id TEXT
);

-- =====================================================
-- 3. DEFAULT DATA INSERTION
-- =====================================================

-- Insert default columns
INSERT INTO columns (id, title, color, order_index) VALUES
  ('uncategorized', 'Uncategorized', 'from-slate-400 to-slate-500', 0),
  ('personal', 'Personal', 'from-indigo-400 to-indigo-500', 1),
  ('today', 'Today', 'from-blue-400 to-indigo-500', 2),
  ('follow-up', 'Follow-Up', 'from-red-400 to-red-500', 3),
  ('later', 'Later', 'from-purple-400 to-purple-500', 4),
  ('completed', 'Completed', 'from-emerald-400 to-green-500', 5),
  -- Week view columns
  ('day_1', 'Day 1', 'from-purple-400 to-purple-500', 6),
  ('day_2', 'Day 2', 'from-purple-400 to-purple-500', 7),
  ('day_3', 'Day 3', 'from-purple-400 to-purple-500', 8),
  ('day_4', 'Day 4', 'from-purple-400 to-purple-500', 9),
  ('day_5', 'Day 5', 'from-purple-400 to-purple-500', 10),
  ('day_6', 'Day 6', 'from-purple-400 to-purple-500', 11),
  ('future', 'Future', 'from-emerald-400 to-green-500', 12),
  ('done', 'Done', 'from-emerald-400 to-green-500', 13)
ON CONFLICT (id) DO NOTHING;

-- Insert default categories for main columns
INSERT INTO categories (id, name, column_id, order_index, is_default) VALUES
  -- Personal column categories
  ('personal_standing', 'STANDING', 'personal', 0, true),
  ('personal_comms', 'COMMS', 'personal', 1, true),
  ('personal_big_tasks', 'BIG TASKS', 'personal', 2, true),
  ('personal_done', 'DONE', 'personal', 3, true),
  
  -- Today column categories
  ('today_standing', 'STANDING', 'today', 0, true),
  ('today_comms', 'COMMS', 'today', 1, true),
  ('today_big_tasks', 'BIG TASKS', 'today', 2, true),
  ('today_done', 'DONE', 'today', 3, true),
  
  -- Follow-up column categories
  ('follow-up_people', 'People', 'follow-up', 0, true),
  
  -- Week view categories (Day 1-6)
  ('day_1_standing', 'STANDING', 'day_1', 0, true),
  ('day_1_comms', 'COMMS', 'day_1', 1, true),
  ('day_1_big_tasks', 'BIG TASKS', 'day_1', 2, true),
  ('day_1_done', 'DONE', 'day_1', 3, true),
  
  ('day_2_standing', 'STANDING', 'day_2', 0, true),
  ('day_2_comms', 'COMMS', 'day_2', 1, true),
  ('day_2_big_tasks', 'BIG TASKS', 'day_2', 2, true),
  ('day_2_done', 'DONE', 'day_2', 3, true),
  
  ('day_3_standing', 'STANDING', 'day_3', 0, true),
  ('day_3_comms', 'COMMS', 'day_3', 1, true),
  ('day_3_big_tasks', 'BIG TASKS', 'day_3', 2, true),
  ('day_3_done', 'DONE', 'day_3', 3, true),
  
  ('day_4_standing', 'STANDING', 'day_4', 0, true),
  ('day_4_comms', 'COMMS', 'day_4', 1, true),
  ('day_4_big_tasks', 'BIG TASKS', 'day_4', 2, true),
  ('day_4_done', 'DONE', 'day_4', 3, true),
  
  ('day_5_standing', 'STANDING', 'day_5', 0, true),
  ('day_5_comms', 'COMMS', 'day_5', 1, true),
  ('day_5_big_tasks', 'BIG TASKS', 'day_5', 2, true),
  ('day_5_done', 'DONE', 'day_5', 3, true),
  
  ('day_6_standing', 'STANDING', 'day_6', 0, true),
  ('day_6_comms', 'COMMS', 'day_6', 1, true),
  ('day_6_big_tasks', 'BIG TASKS', 'day_6', 2, true),
  ('day_6_done', 'DONE', 'day_6', 3, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team_member_id ON tasks(team_member_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_categories_column_id ON categories(column_id);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_strategy_team ON team_members(is_strategy_team);

-- Week view indexes
CREATE INDEX IF NOT EXISTS idx_tasks_week_columns ON tasks(column_id) WHERE column_id LIKE 'day_%';
CREATE INDEX IF NOT EXISTS idx_categories_week_columns ON categories(column_id) WHERE column_id LIKE 'day_%';
CREATE INDEX IF NOT EXISTS idx_tasks_week_day ON tasks(week_day) WHERE week_day IS NOT NULL;

-- Coach feature indexes
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_conversation_id ON recommendations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_kind ON recommendations(kind);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS POLICIES - PUBLIC ACCESS
-- =====================================================

-- Columns policies
CREATE POLICY "Allow public read access" ON columns FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON columns FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON columns FOR DELETE USING (true);

-- Categories policies
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON categories FOR DELETE USING (true);

-- Tasks policies
CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON tasks FOR DELETE USING (true);

-- Team members policies
CREATE POLICY "Allow public read access" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON team_members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON team_members FOR DELETE USING (true);

-- Conversations policies
CREATE POLICY "Allow public read access" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON conversations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON conversations FOR DELETE USING (true);

-- Recommendations policies
CREATE POLICY "Allow public read access" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON recommendations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON recommendations FOR DELETE USING (true);

-- =====================================================
-- 7. CONSTRAINTS AND FIXES
-- =====================================================

-- Remove foreign key constraint on tasks.category_id to allow dynamic categories
-- (This allows team member categories like 'follow-up_24' to work)
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_category_id_fkey;

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Verify table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('columns', 'categories', 'tasks', 'team_members', 'conversations', 'recommendations')
ORDER BY table_name, ordinal_position;

-- Verify default data
SELECT 'Columns' as table_name, COUNT(*) as count FROM columns
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Team Members', COUNT(*) FROM team_members
UNION ALL
SELECT 'Conversations', COUNT(*) FROM conversations
UNION ALL
SELECT 'Recommendations', COUNT(*) FROM recommendations;

-- =====================================================
-- SCHEMA EXPORT COMPLETE
-- =====================================================
-- 
-- This schema includes:
-- ✅ Core Kanban tables (columns, categories, tasks, team_members)
-- ✅ Coach feature tables (conversations, recommendations)
-- ✅ All additional fields added over time
-- ✅ Week view support
-- ✅ Performance indexes
-- ✅ Row Level Security policies
-- ✅ Default data for immediate use
-- ✅ Constraint fixes for dynamic categories
--
-- Your new Supabase project is now ready to use! 🚀
-- =====================================================
