
CREATE TABLE public.follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
GRANT SELECT ON public.follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows are public readable" ON public.follows FOR SELECT USING (true);
CREATE POLICY "users follow as themselves" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "users unfollow themselves" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

CREATE INDEX follows_following_idx ON public.follows(following_id);
CREATE INDEX follows_follower_idx ON public.follows(follower_id);

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('review','list_created','favorite','follow','status')),
  game_id TEXT,
  target_user_id UUID,
  review_id UUID,
  list_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon;
GRANT SELECT, INSERT, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities are public readable" ON public.activities FOR SELECT USING (true);
CREATE POLICY "users insert own activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own activities" ON public.activities FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX activities_user_created_idx ON public.activities(user_id, created_at DESC);
CREATE INDEX activities_created_idx ON public.activities(created_at DESC);
