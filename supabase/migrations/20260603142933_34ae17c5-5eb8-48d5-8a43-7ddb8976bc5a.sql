
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS favorite_game_ids text[] NOT NULL DEFAULT '{}';

CREATE TABLE public.user_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(title) > 0 AND length(title) <= 120),
  description text CHECK (description IS NULL OR length(description) <= 2000),
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_lists_user ON public.user_lists(user_id);

GRANT SELECT ON public.user_lists TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_lists TO authenticated;
GRANT ALL ON public.user_lists TO service_role;

ALTER TABLE public.user_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public lists viewable by everyone" ON public.user_lists
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users insert own lists" ON public.user_lists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lists" ON public.user_lists
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own lists" ON public.user_lists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_user_lists_updated_at
BEFORE UPDATE ON public.user_lists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_list_items (
  list_id uuid NOT NULL REFERENCES public.user_lists(id) ON DELETE CASCADE,
  game_id text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (list_id, game_id)
);
CREATE INDEX idx_list_items_list ON public.user_list_items(list_id);

GRANT SELECT ON public.user_list_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_list_items TO authenticated;
GRANT ALL ON public.user_list_items TO service_role;

ALTER TABLE public.user_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items viewable when list viewable" ON public.user_list_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_lists l WHERE l.id = list_id AND (l.is_public = true OR l.user_id = auth.uid()))
  );
CREATE POLICY "Owner inserts items" ON public.user_list_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_lists l WHERE l.id = list_id AND l.user_id = auth.uid())
  );
CREATE POLICY "Owner updates items" ON public.user_list_items
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_lists l WHERE l.id = list_id AND l.user_id = auth.uid())
  );
CREATE POLICY "Owner deletes items" ON public.user_list_items
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_lists l WHERE l.id = list_id AND l.user_id = auth.uid())
  );
