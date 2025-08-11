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

## 🚀 クイックスタート（初心者向け）

### 最も簡単な方法（5分で開始）

1. **Node.jsをインストール**
   - [Node.js公式サイト](https://nodejs.org/) からダウンロード

2. **プロジェクトをクローン**
   ```bash
   git clone <repository-url>
   cd mimitomo---hearing-&-conversation-companion
   ```

3. **依存関係をインストール**
   ```bash
   npm install
   ```

4. **環境変数を設定**
   ```bash
   # .env.local ファイルを作成
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
   ```

5. **アプリケーションを起動**
   ```bash
   npm run dev
   ```

6. **ブラウザでアクセス**
   - `http://localhost:5173` にアクセス
   - 既に設定済みのリモートデータベースを使用

### 必要なもの
- Node.js
- Google Gemini API キー（[取得方法](https://makersuite.google.com/app/apikey)）

## セットアップ

### 前提条件
- Node.js (v16以上)
- Google Gemini API キー
- Docker Desktop (ローカル開発用)
- Supabase CLI (ローカル開発用)

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local` ファイルを作成し、以下の内容を設定してください：

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Docker Desktopのインストールと起動

#### macOS
1. [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/) をダウンロード
2. インストール後、Docker Desktopを起動
3. ターミナルで以下を実行してDockerが正常に動作することを確認：
```bash
docker --version
docker ps
```

#### Windows
1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) をダウンロード
2. WSL2の設定が必要な場合があります
3. インストール後、Docker Desktopを起動

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# ユーザーをdockerグループに追加（再ログインが必要）
sudo usermod -aG docker $USER
```

### 4. Supabase CLIのインストール

#### macOS
```bash
brew install supabase/tap/supabase
```

#### Windows
```bash
# Chocolateyを使用
choco install supabase

# または、GitHubから直接ダウンロード
# https://github.com/supabase/cli/releases
```

#### Linux
```bash
# スクリプトを使用したインストール
curl -fsSL https://supabase.com/install.sh | sh
```

インストール後、以下を実行してCLIが正常に動作することを確認：
```bash
supabase --version
```

### 5. ローカル開発環境の起動

#### オプションA: リモートSupabaseを使用（推奨・初心者向け）
```bash
npm run dev
```
- 既に設定済みのリモートSupabaseを使用
- データベースは本番環境と同じ構造
- 追加のセットアップ不要

#### オプションB: ローカルSupabaseを使用（上級者向け）

##### 5-1. Docker Desktopの確認
```bash
# Dockerが起動していることを確認
docker ps
```

##### 5-2. ローカルSupabaseの起動
```bash
# 初回起動時は時間がかかります（5-10分程度）
npm run supabase:start
```

初回起動時の出力例：
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
         DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

##### 5-3. データベースのセットアップ
```bash
# マイグレーションを実行してテーブルを作成
npm run supabase:reset
```

##### 5-4. アプリケーションの起動
```bash
# 別のターミナルでアプリケーションを起動
npm run dev
```

##### 5-5. Supabase Studioでデータベースを確認
```bash
npm run supabase:studio
```
ブラウザで `http://localhost:54323` にアクセスしてデータベースを管理できます。

### 6. トラブルシューティング

#### Docker関連のエラー
```bash
# Dockerの状態確認
docker info

# Dockerコンテナの確認
docker ps -a

# Supabaseの状態確認
npm run supabase:status
```

#### ポートが使用中のエラー
```bash
# 使用中のポートを確認
lsof -i :54321
lsof -i :54322
lsof -i :54323

# 必要に応じてプロセスを終了
kill -9 <PID>
```

#### データベース接続エラー
```bash
# Supabaseを再起動
npm run supabase:stop
npm run supabase:start

# データベースをリセット
npm run supabase:reset
```

## 開発用コマンド

### Supabase関連
```bash
# ローカルSupabaseの起動
npm run supabase:start

# ローカルSupabaseの停止
npm run supabase:stop

# ローカルSupabaseの状態確認
npm run supabase:status

# データベースのリセット（マイグレーション再実行）
npm run supabase:reset

# Supabase Studioの起動
npm run supabase:studio
```

### アプリケーション関連
```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションビルドのプレビュー
npm run preview
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

## マイグレーション

データベーススキーマの変更は `supabase/migrations/` ディレクトリ内のSQLファイルで管理されています。

### 新しいマイグレーションの作成
```bash
supabase migration new migration_name
```

### マイグレーションの適用
```bash
# ローカル環境
supabase db reset

# リモート環境
supabase db push
```

## よくある質問（FAQ）

### Q: ローカルSupabaseとリモートSupabaseの違いは？
A: 
- **ローカルSupabase**: 完全にローカルな環境。インターネット接続不要。データベースの変更を自由にテスト可能。
- **リモートSupabase**: クラウド上の環境。チーム開発時に便利。本番環境と同じ構造。

### Q: Dockerが起動しない場合は？
A: 
1. Docker Desktopがインストールされているか確認
2. Docker Desktopを起動
3. システムの再起動を試す
4. Dockerの権限設定を確認

### Q: ポートが使用中エラーが出る場合は？
A: 
1. 他のアプリケーションが同じポートを使用していないか確認
2. `lsof -i :54321` で使用中のプロセスを確認
3. 必要に応じてプロセスを終了

### Q: データベースが空の場合は？
A: 
1. `npm run supabase:reset` を実行
2. Supabase Studioでデータを確認
3. マイグレーションファイルが正しく実行されているか確認

### Q: Google Gemini APIキーの取得方法は？
A: 
1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたキーをコピーして `.env.local` に設定

### Q: 音声認識が動作しない場合は？
A: 
1. HTTPS環境でアクセスしているか確認（ローカル開発では不要）
2. ブラウザが音声認識に対応しているか確認
3. マイクの権限が許可されているか確認
4. Chrome、Firefox、Safariの最新版を使用

## プロジェクト構造

```
mimitomo---hearing-&-conversation-companion/
├── components/                    # Reactコンポーネント
│   ├── BottomNav.tsx             # ボトムナビゲーション
│   ├── Conversation.tsx          # AI対話画面
│   ├── HearingAid.tsx            # 補聴器モード画面
│   ├── Memories.tsx              # 思い出アルバム画面
│   ├── Profile.tsx               # プロフィール管理画面
│   ├── Reminders.tsx             # 予定管理画面
│   └── icons.tsx                 # アイコンコンポーネント
├── services/                     # 外部サービス連携
│   ├── geminiService.ts          # Google Gemini AI連携
│   └── supabaseClient.ts         # Supabaseデータベース連携
├── supabase/                     # Supabase設定
│   ├── migrations/               # データベースマイグレーション
│   │   ├── 20250811013021_create_initial_schema.sql
│   │   └── 20250811013044_insert_sample_data.sql
│   └── config.toml               # Supabase設定ファイル
├── App.tsx                       # メインアプリケーション
├── types.ts                      # TypeScript型定義
├── index.tsx                     # アプリケーションエントリーポイント
├── package.json                  # 依存関係とスクリプト
├── .env.local                    # 環境変数（Git管理外）
├── .env.example                  # 環境変数サンプル
└── README.md                     # プロジェクトドキュメント
```

### 主要ファイルの説明

#### フロントエンド
- **App.tsx**: アプリケーションのメインコンポーネント。画面の切り替えを管理
- **components/**: 各機能画面のコンポーネント
- **types.ts**: アプリケーション全体で使用する型定義

#### バックエンド連携
- **services/geminiService.ts**: AI対話機能の実装
- **services/supabaseClient.ts**: データベース接続と操作

#### データベース
- **supabase/migrations/**: データベーススキーマの変更履歴
- **supabase/config.toml**: ローカル開発環境の設定

#### 設定ファイル
- **.env.local**: 環境変数（APIキーなど）
- **package.json**: 依存関係と開発用スクリプト

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。