
-- 1) Tighten activities INSERT policy
DROP POLICY IF EXISTS "users insert own activities" ON public.activities;

CREATE POLICY "users insert own activities"
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND type IN ('status','favorite','review','list','follow','comment','like')
  AND (
    review_id IS NULL
    OR EXISTS (SELECT 1 FROM public.reviews r WHERE r.id = review_id AND r.user_id = auth.uid())
  )
  AND (
    list_id IS NULL
    OR EXISTS (SELECT 1 FROM public.user_lists l WHERE l.id = list_id AND l.user_id = auth.uid())
  )
);

-- 2) Add FK on review_likes.review_id -> reviews(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'review_likes_review_id_fkey'
  ) THEN
    -- Clean orphans first so the FK can be added
    DELETE FROM public.review_likes rl
    WHERE NOT EXISTS (SELECT 1 FROM public.reviews r WHERE r.id = rl.review_id);

    ALTER TABLE public.review_likes
      ADD CONSTRAINT review_likes_review_id_fkey
      FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Also add FK on review_likes.user_id and activities references for integrity
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_likes_user_id_fkey') THEN
    ALTER TABLE public.review_likes
      ADD CONSTRAINT review_likes_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
