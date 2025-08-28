-- Add missing fields to tasks table
-- This migration adds the fields that the UI is trying to send but the database doesn't have

-- Add detail field for task description
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS detail TEXT;

-- Add client field for client name
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS client TEXT;

-- Add due_date field for task due date
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS due_date DATE;

-- Add notes field for notes/to-do list
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verify the new structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position; 