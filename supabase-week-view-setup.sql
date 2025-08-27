-- Week View Database Setup
-- This script adds the necessary columns and categories for the week view

-- Add week view columns
INSERT INTO columns (id, title, color, order_index) VALUES
  ('day_1', 'Day 1', 'from-purple-400 to-purple-500', 3),
  ('day_2', 'Day 2', 'from-purple-400 to-purple-500', 4),
  ('day_3', 'Day 3', 'from-purple-400 to-purple-500', 5),
  ('day_4', 'Day 4', 'from-purple-400 to-purple-500', 6),
  ('day_5', 'Day 5', 'from-purple-400 to-purple-500', 7),
  ('day_6', 'Day 6', 'from-purple-400 to-purple-500', 8),
  ('future', 'Future', 'from-emerald-400 to-green-500', 9),
  ('done', 'Done', 'from-emerald-400 to-green-500', 10)
ON CONFLICT (id) DO NOTHING;

-- Add categories for each day column
INSERT INTO categories (id, name, column_id, order_index, is_default) VALUES
  -- Day 1 categories
  ('day_1_standing', 'STANDING', 'day_1', 0, true),
  ('day_1_comms', 'COMMS', 'day_1', 1, true),
  ('day_1_big_tasks', 'BIG TASKS', 'day_1', 2, true),
  ('day_1_done', 'DONE', 'day_1', 3, true),
  
  -- Day 2 categories
  ('day_2_standing', 'STANDING', 'day_2', 0, true),
  ('day_2_comms', 'COMMS', 'day_2', 1, true),
  ('day_2_big_tasks', 'BIG TASKS', 'day_2', 2, true),
  ('day_2_done', 'DONE', 'day_2', 3, true),
  
  -- Day 3 categories
  ('day_3_standing', 'STANDING', 'day_3', 0, true),
  ('day_3_comms', 'COMMS', 'day_3', 1, true),
  ('day_3_big_tasks', 'BIG TASKS', 'day_3', 2, true),
  ('day_3_done', 'DONE', 'day_3', 3, true),
  
  -- Day 4 categories
  ('day_4_standing', 'STANDING', 'day_4', 0, true),
  ('day_4_comms', 'COMMS', 'day_4', 1, true),
  ('day_4_big_tasks', 'BIG TASKS', 'day_4', 2, true),
  ('day_4_done', 'DONE', 'day_4', 3, true),
  
  -- Day 5 categories
  ('day_5_standing', 'STANDING', 'day_5', 0, true),
  ('day_5_comms', 'COMMS', 'day_5', 1, true),
  ('day_5_big_tasks', 'BIG TASKS', 'day_5', 2, true),
  ('day_5_done', 'DONE', 'day_5', 3, true),
  
  -- Day 6 categories
  ('day_6_standing', 'STANDING', 'day_6', 0, true),
  ('day_6_comms', 'COMMS', 'day_6', 1, true),
  ('day_6_big_tasks', 'BIG TASKS', 'day_6', 2, true),
  ('day_6_done', 'DONE', 'day_6', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance on week view queries
CREATE INDEX IF NOT EXISTS idx_tasks_week_columns ON tasks(column_id) WHERE column_id LIKE 'day_%';
CREATE INDEX IF NOT EXISTS idx_categories_week_columns ON categories(column_id) WHERE column_id LIKE 'day_%';

-- Update existing tasks table to support week view
-- Add any additional fields that might be needed for week planning
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS week_day INTEGER;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_week_task BOOLEAN DEFAULT false;

-- Create index for week day queries
CREATE INDEX IF NOT EXISTS idx_tasks_week_day ON tasks(week_day) WHERE week_day IS NOT NULL; 