// Server-only Google Sheets trailer source.
const SHEET_ID = "1zRVkmscUlYeEoseRK5IjgHMUFkw5LbM43V9bTu1005A";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

export type TrailerRow = { name: string; link: string };

let cache: { at: number; rows: TrailerRow[] } | null = null;
const TTL = 60 * 1000; // 1 min

export async function fetchTrailerRows(): Promise<TrailerRow[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.rows;

  const lovable = process.env.LOVABLE_API_KEY;
  const conn = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovable) throw new Error("LOVABLE_API_KEY not configured");
  if (!conn) throw new Error("GOOGLE_SHEETS_API_KEY not configured");

  const url = `${GATEWAY}/spreadsheets/${SHEET_ID}/values/Principal!A2:B1000`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": conn,
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sheets gateway ${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = (await res.json()) as { values?: string[][] };
  const rows: TrailerRow[] = (json.values ?? [])
    .filter((r) => r?.[0] && r?.[1])
    .map((r) => ({ name: r[0].trim(), link: r[1].trim() }));

  cache = { at: Date.now(), rows };
  return rows;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export async function findTrailer(title: string): Promise<string | null> {
  const rows = await fetchTrailerRows();
  const target = normalize(title);
  const hit = rows.find((r) => normalize(r.name) === target);
  return hit?.link ?? null;
}
