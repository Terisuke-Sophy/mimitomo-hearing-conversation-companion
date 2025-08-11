# みみとも - 高齢者の話し相手AIアシスタント

高齢者の孤独感軽減と日常生活支援を目的とした、包括的なAIアシスタントプラットフォームです。

## 機能

- **みみとも（補聴器モード）**: リアルタイム音声認識による文字起こし
- **おはなし・質問モード**: AIアシスタント「ひなた」との対話機能
- **予定管理**: 音声入力による予定追加・管理
- **思い出アルバム**: 写真ギャラリー表示・管理
- **プロフィール管理**: 個人情報の管理

## 技術スタック

- **フロントエンド**: React 19.1.1 + TypeScript
- **ビルドツール**: Vite 6.2.0
- **AIサービス**: Google Gemini 2.5 Flash
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage
- **音声認識**: Web Speech API
- **音声合成**: Speech Synthesis API

## セットアップ

### 前提条件
- Node.js
- Google Gemini API キー
- Supabase プロジェクト

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local` ファイルを作成し、以下の内容を設定してください：

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Supabase設定
プロジェクトは既にSupabaseに接続されています：

- **プロジェクトURL**: `https://gdrcbryqmzxlegbegpbl.supabase.co`
- **匿名キー**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmNicnlxbXp4bGVnYmVncGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzQ1NDksImV4cCI6MjA3MDQ1MDU0OX0.nmU5ZmmP8z7pHW4hcxxa2GGHnAzOnueBBvTyI7u-F20`

### 4. アプリケーションの起動
```bash
npm run dev
```

## データベース構造

### users テーブル
- `id` (UUID, 主キー)
- `display_name` (TEXT)
- `gender` (TEXT)
- `dob` (DATE)
- `created_at` (TIMESTAMP)

### profile_items テーブル
- `id` (UUID, 主キー)
- `user_id` (UUID, users.idへの外部キー)
- `category` (TEXT)
- `name` (TEXT)
- `details` (TEXT)
- `created_at` (TIMESTAMP)

### reminders テーブル
- `id` (UUID, 主キー)
- `user_id` (UUID, users.idへの外部キー)
- `title` (TEXT)
- `time` (TEXT)
- `is_completed` (BOOLEAN)
- `color` (TEXT)
- `created_at` (TIMESTAMP)

### memories テーブル
- `id` (UUID, 主キー)
- `user_id` (UUID, users.idへの外部キー)
- `image_url` (TEXT)
- `caption` (TEXT)
- `created_at` (TIMESTAMP)

## セキュリティ

- Row Level Security (RLS) が有効化されています
- 各ユーザーは自分のデータのみアクセス可能
- Supabase Storage バケットも適切に保護されています

## 開発

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。