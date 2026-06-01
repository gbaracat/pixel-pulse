ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS steam_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS steam_persona_name text,
  ADD COLUMN IF NOT EXISTS steam_avatar_url text,
  ADD COLUMN IF NOT EXISTS steam_profile_url text,
  ADD COLUMN IF NOT EXISTS steam_visibility integer,
  ADD COLUMN IF NOT EXISTS steam_linked_at timestamptz;