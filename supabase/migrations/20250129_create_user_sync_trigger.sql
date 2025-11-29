-- Supabase Auth (auth.users) と Public Schema (public.users) の同期トリガー

-- Step 1: public.users テーブルにsupabase_auth_idカラムを追加（既に存在する場合はスキップ）
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS supabase_auth_id UUID UNIQUE;

-- Step 2: avatar_image_url を avatar_url にリネーム（既存データ保持）
DO $$
BEGIN
  IF EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'avatar_image_url'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN avatar_image_url TO avatar_url;
  END IF;
END $$;

-- Step 3: トリガー関数の作成（auth.usersへの新規ユーザー登録時にpublic.usersへ自動挿入）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    supabase_auth_id,
    email,
    nickname,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (email)
  DO UPDATE SET
    supabase_auth_id = EXCLUDED.supabase_auth_id,
    nickname = COALESCE(EXCLUDED.nickname, public.users.nickname),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: トリガーの作成（auth.usersテーブルへのINSERT時に発火）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: 既存のauth.usersデータをpublic.usersに同期（初回マイグレーション時のみ）
INSERT INTO public.users (
  supabase_auth_id,
  email,
  nickname,
  avatar_url,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', email),
  raw_user_meta_data->>'avatar_url',
  created_at,
  updated_at
FROM auth.users
ON CONFLICT (email)
DO UPDATE SET
  supabase_auth_id = EXCLUDED.supabase_auth_id,
  nickname = COALESCE(EXCLUDED.nickname, public.users.nickname),
  avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
  updated_at = NOW();
