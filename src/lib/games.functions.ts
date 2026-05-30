import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rawgSearch, rawgDetails } from "./rawg.server";

export type EnrichedGame = {
  slug: string;
  rawg_id: number | null;
  cover: string | null;
  background_image: string | null;
  screenshots: string[];
  rating: number | null;
  year: number | null;
  description: string | null;
  genres: string[];
  platforms: string[];
  trailer_url: string | null;
};

/**
 * Returns all enriched games from DB keyed by slug.
 */
export const listEnrichedGames = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, EnrichedGame>> => {
    const { data, error } = await supabaseAdmin
      .from("games")
      .select("slug, rawg_id, cover, background_image, screenshots, rating, year, description, genres, platforms, trailer_url");
    if (error) {
      console.error("[games] list failed:", error.message);
      return {};
    }
    const map: Record<string, EnrichedGame> = {};
    for (const g of data ?? []) {
      map[g.slug] = {
        slug: g.slug,
        rawg_id: g.rawg_id,
        cover: g.cover,
        background_image: g.background_image,
        screenshots: Array.isArray(g.screenshots) ? (g.screenshots as string[]) : [],
        rating: g.rating != null ? Number(g.rating) : null,
        year: g.year,
        description: g.description,
        genres: Array.isArray(g.genres) ? (g.genres as string[]) : [],
        platforms: Array.isArray(g.platforms) ? (g.platforms as string[]) : [],
        trailer_url: g.trailer_url,
      };
    }
    return map;
  }
);

/**
 * Sync a batch of games from RAWG into the DB.
 * Pass array of { slug, query } — slug is our internal id, query is the RAWG search term.
 */
export const syncGamesFromRawg = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        items: z
          .array(
            z.object({
              slug: z.string().min(1).max(100),
              query: z.string().min(1).max(200),
              title: z.string().min(1).max(200),
            })
          )
          .min(1)
          .max(60),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const results: { slug: string; ok: boolean; reason?: string }[] = [];

    for (const item of data.items) {
      try {
        const found = await rawgSearch(item.query);
        if (!found?.id) {
          results.push({ slug: item.slug, ok: false, reason: "not_found" });
          continue;
        }
        const detail = await rawgDetails(found.id);
        if (!detail) {
          results.push({ slug: item.slug, ok: false, reason: "no_detail" });
          continue;
        }

        const row = {
          slug: item.slug,
          rawg_id: detail.id,
          title: item.title,
          description: detail.description_raw?.slice(0, 2000) ?? null,
          cover: detail.background_image ?? null,
          background_image: detail.background_image_additional ?? detail.background_image ?? null,
          screenshots: (detail.short_screenshots ?? []).map((s) => s.image),
          rating: detail.rating ?? 0,
          year: detail.released ? new Date(detail.released).getFullYear() : null,
          playtime: detail.playtime ?? 0,
          genres: (detail.genres ?? []).map((g) => g.name),
          platforms: (detail.platforms ?? []).map((p) => p.platform.name),
          tags: (detail.tags ?? []).filter((t) => !t.language || t.language === "eng").slice(0, 15).map((t) => t.name),
          trailer_url: detail.clip?.clip ?? null,
        };

        const { error } = await supabaseAdmin
          .from("games")
          .upsert(row, { onConflict: "slug" });

        if (error) {
          console.error(`[sync] ${item.slug}:`, error.message);
          results.push({ slug: item.slug, ok: false, reason: error.message });
        } else {
          results.push({ slug: item.slug, ok: true });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown";
        console.error(`[sync] ${item.slug}:`, msg);
        results.push({ slug: item.slug, ok: false, reason: msg });
      }
    }

    return { results, total: data.items.length, ok: results.filter((r) => r.ok).length };
  });
