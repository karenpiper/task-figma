-- Add Personal column to the board
-- This column will be positioned after 'uncategorized' and before 'today'

-- Insert the Personal column
INSERT INTO columns (id, title, color, order_index) 
VALUES ('personal', 'Personal', 'from-indigo-400 to-indigo-500', 1)
ON CONFLICT (id) DO NOTHING;

-- Update the order_index of existing columns to make room for Personal
UPDATE columns SET order_index = order_index + 1 WHERE order_index > 1;

-- Set Personal column to order_index 1 (after uncategorized which is 0)
UPDATE columns SET order_index = 1 WHERE id = 'personal';

-- Add standard categories for Personal column
INSERT INTO categories (id, name, column_id, order_index, is_default) VALUES
('personal_standing', 'STANDING', 'personal', 0, true),
('personal_comms', 'COMMS', 'personal', 1, true),
('personal_big_tasks', 'BIG TASKS', 'personal', 2, true),
('personal_done', 'DONE', 'personal', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Verify the new structure
SELECT 
  c.id, 
  c.title, 
  c.color, 
  c.order_index,
  COUNT(cat.id) as category_count
FROM columns c
LEFT JOIN categories cat ON c.id = cat.column_id
GROUP BY c.id, c.title, c.color, c.order_index
ORDER BY c.order_index; 