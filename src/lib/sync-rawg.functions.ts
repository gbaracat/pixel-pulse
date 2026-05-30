import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rawgSearch, rawgDetails } from "./rawg.server";
import { games } from "@/data/games";

/**
 * Sync all known games from RAWG into the DB.
 * No input — uses the curated catalog from src/data/games.ts.
 * Skips entries we already have a cover for (incremental).
 */
export const syncAllGames = createServerFn({ method: "POST" })
  .inputValidator((input: { force?: boolean } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const force = data?.force ?? false;

    // Skip already-synced unless force
    let alreadyDone = new Set<string>();
    if (!force) {
      const { data: existing } = await supabaseAdmin
        .from("games")
        .select("slug, cover");
      alreadyDone = new Set(
        (existing ?? []).filter((g) => g.cover).map((g) => g.slug)
      );
    }

    const targets = games.filter((g) => !alreadyDone.has(g.id));
    const results: { slug: string; ok: boolean; reason?: string }[] = [];

    for (const item of targets) {
      try {
        const found = await rawgSearch(item.title);
        if (!found?.id) {
          results.push({ slug: item.id, ok: false, reason: "not_found" });
          continue;
        }
        const detail = await rawgDetails(found.id);
        if (!detail) {
          results.push({ slug: item.id, ok: false, reason: "no_detail" });
          continue;
        }

        const row = {
          slug: item.id,
          rawg_id: detail.id,
          title: item.title,
          description: detail.description_raw?.slice(0, 2000) ?? item.description,
          cover: detail.background_image ?? null,
          background_image: detail.background_image_additional ?? detail.background_image ?? null,
          screenshots: (detail.short_screenshots ?? []).map((s) => s.image),
          rating: detail.rating && detail.rating > 0 ? detail.rating * 2 : item.rating,
          year: detail.released ? new Date(detail.released).getFullYear() : item.year,
          playtime: detail.playtime ?? item.hours,
          genres: (detail.genres ?? []).map((g) => g.name),
          platforms: (detail.platforms ?? []).map((p) => p.platform.name),
          tags: (detail.tags ?? [])
            .filter((t) => !t.language || t.language === "eng")
            .slice(0, 15)
            .map((t) => t.name),
          trailer_url: detail.clip?.clip ?? null,
          era: item.era,
          mood: item.mood,
          difficulty: item.difficulty,
        };

        const { error } = await supabaseAdmin
          .from("games")
          .upsert(row, { onConflict: "slug" });

        if (error) {
          console.error(`[sync] ${item.id}:`, error.message);
          results.push({ slug: item.id, ok: false, reason: error.message });
        } else {
          results.push({ slug: item.id, ok: true });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown";
        console.error(`[sync] ${item.id}:`, msg);
        results.push({ slug: item.id, ok: false, reason: msg });
      }
    }

    return {
      total: targets.length,
      ok: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok),
      skipped: games.length - targets.length,
    };
  });
