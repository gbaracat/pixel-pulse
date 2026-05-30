CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rawg_id INTEGER UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover TEXT,
  background_image TEXT,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC(3,1) DEFAULT 0,
  year INTEGER,
  playtime INTEGER DEFAULT 0,
  genres JSONB NOT NULL DEFAULT '[]'::jsonb,
  platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  trailer_url TEXT,
  era TEXT DEFAULT 'modern',
  mood JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT DEFAULT 'medium',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_games_slug ON public.games(slug);
CREATE INDEX idx_games_rating ON public.games(rating DESC);
CREATE INDEX idx_games_year ON public.games(year DESC);
CREATE INDEX idx_games_featured ON public.games(featured) WHERE featured = true;

GRANT SELECT ON public.games TO anon;
GRANT SELECT ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games are viewable by everyone"
ON public.games FOR SELECT
USING (true);

CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();