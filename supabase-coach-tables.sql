-- Create tables for the Coach feature
-- These tables are idempotent - safe to run multiple times

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_conversation_id ON recommendations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_kind ON recommendations(kind);

-- Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (matching existing app pattern)
CREATE POLICY "Allow public read access" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON conversations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON conversations FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON recommendations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON recommendations FOR DELETE USING (true);
