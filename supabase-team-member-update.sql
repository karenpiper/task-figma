-- Migration: Update team_members table structure
-- Remove email column and add is_strategy_team column

-- Add the new is_strategy_team column
ALTER TABLE team_members 
ADD COLUMN is_strategy_team BOOLEAN DEFAULT FALSE;

-- Remove the email column
ALTER TABLE team_members 
DROP COLUMN email;

-- Update existing records to set default strategy team status
-- You can customize this based on your needs
UPDATE team_members 
SET is_strategy_team = FALSE 
WHERE is_strategy_team IS NULL;

-- Make is_strategy_team NOT NULL after setting defaults
ALTER TABLE team_members 
ALTER COLUMN is_strategy_team SET NOT NULL;

-- Add an index for strategy team queries
CREATE INDEX IF NOT EXISTS idx_team_members_strategy_team 
ON team_members(is_strategy_team);

-- Verify the new structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'team_members' 
ORDER BY ordinal_position; 