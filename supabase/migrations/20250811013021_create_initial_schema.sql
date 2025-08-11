-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile_items table
CREATE TABLE profile_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT 'bg-yellow-300',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memories table
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  caption TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Profile items table policies
CREATE POLICY "Users can view own profile items" ON profile_items
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile items" ON profile_items
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile items" ON profile_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own profile items" ON profile_items
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Reminders table policies
CREATE POLICY "Users can view own reminders" ON reminders
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Memories table policies
CREATE POLICY "Users can view own memories" ON memories
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own memories" ON memories
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own memories" ON memories
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own memories" ON memories
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create storage bucket for memories images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memories', 'memories', true);

-- Storage policies for memories bucket
CREATE POLICY "Users can view own memories images" ON storage.objects
  FOR SELECT USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own memories images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own memories images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own memories images" ON storage.objects
  FOR DELETE USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);
