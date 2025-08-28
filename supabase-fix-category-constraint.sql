-- Fix the foreign key constraint issue for team member categories
-- Team member categories like 'follow-up_24' are generated dynamically and don't exist in the categories table
-- This script removes the foreign key constraint to allow any category_id value

-- Drop the existing foreign key constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_category_id_fkey;

-- Verify the constraint is removed
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='tasks';

-- The tasks table should now allow any category_id value without foreign key validation
-- This enables team member categories like 'follow-up_24', 'follow-up_25', etc. to work properly 