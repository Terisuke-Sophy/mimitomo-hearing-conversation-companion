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

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 開発用：すべてのアクセスを許可（本番環境では削除してください）
CREATE POLICY "Enable all access for development" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON profile_items FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON reminders FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON memories FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON chat_messages FOR ALL USING (true);

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
