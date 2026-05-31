// Server-only RAWG API helper. Never import this from client code.
const RAWG_BASE = "https://api.rawg.io/api";

export type RawgGame = {
  id: number;
  slug: string;
  name: string;
  description_raw?: string;
  background_image?: string;
  background_image_additional?: string;
  rating?: number;
  released?: string;
  playtime?: number;
  genres?: { name: string }[];
  platforms?: { platform: { name: string } }[];
  tags?: { name: string; language?: string }[];
  short_screenshots?: { image: string }[];
  clip?: { clip?: string } | null;
};

function getKey() {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY not set");
  return key;
}

export async function rawgSearch(query: string): Promise<RawgGame | null> {
  const key = getKey();
  const url = `${RAWG_BASE}/games?key=${key}&search=${encodeURIComponent(query)}&page_size=1&search_precise=true`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as { results?: RawgGame[] };
  return json.results?.[0] ?? null;
}

export async function rawgDetails(id: number): Promise<RawgGame | null> {
  const key = getKey();
  const [details, screens, movies] = await Promise.all([
    fetch(`${RAWG_BASE}/games/${id}?key=${key}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`${RAWG_BASE}/games/${id}/screenshots?key=${key}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`${RAWG_BASE}/games/${id}/movies?key=${key}`).then((r) => (r.ok ? r.json() : null)),
  ]);
  if (!details) return null;
  const firstMovie = movies?.results?.[0];
  const trailer = firstMovie?.data?.max ?? firstMovie?.data?.["480"] ?? null;
  return {
    ...details,
    short_screenshots: screens?.results?.slice(0, 8).map((s: { image: string }) => ({ image: s.image })) ?? [],
    clip: trailer ? { clip: trailer } : details.clip ?? null,
  };
}
