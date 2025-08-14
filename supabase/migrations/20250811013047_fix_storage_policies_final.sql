-- 既存のStorageポリシーをすべて削除
DROP POLICY IF EXISTS "Users can view own memories images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own memories images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own memories images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own memories images" ON storage.objects;
DROP POLICY IF EXISTS "Enable all access for development - storage" ON storage.objects;

-- バケットが存在しない場合は作成
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO NOTHING;

-- 開発用：認証なしでもアクセス可能なポリシーを作成
CREATE POLICY "Enable all access for development - storage" ON storage.objects
  FOR ALL USING (bucket_id = 'memories');

-- ポリシーが正しく作成されたか確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
