-- 既存のポリシーをすべて削除
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can view own profile items" ON profile_items;
DROP POLICY IF EXISTS "Users can update own profile items" ON profile_items;
DROP POLICY IF EXISTS "Users can insert own profile items" ON profile_items;
DROP POLICY IF EXISTS "Users can delete own profile items" ON profile_items;
DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can insert own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can view own memories" ON memories;
DROP POLICY IF EXISTS "Users can update own memories" ON memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON memories;
DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON chat_messages;

-- 開発用ポリシーを再作成
CREATE POLICY "Enable all access for development" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON profile_items FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON reminders FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON memories FOR ALL USING (true);
CREATE POLICY "Enable all access for development" ON chat_messages FOR ALL USING (true);
