-- Migration script to add new fields to tasks table
-- Run this after the initial schema is set up

-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS detail TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS team_member_id INTEGER REFERENCES team_members(id);

-- Create index for due_date for better performance on date-based queries
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create index for team_member_id for better performance on team member queries
CREATE INDEX IF NOT EXISTS idx_tasks_team_member_id ON tasks(team_member_id); 