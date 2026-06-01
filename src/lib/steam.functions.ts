import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  verifySteamOpenId,
  fetchPlayerSummary,
  fetchOwnedGames,
  fetchRecentGames,
  steamHeaderImage,
} from "./steam.server";

const openIdSchema = z.object({
  params: z.record(z.string(), z.string()),
});

export const linkSteamAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => openIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const steamId = await verifySteamOpenId(data.params);
    if (!steamId) throw new Error("Falha ao verificar identidade Steam");

    const summary = await fetchPlayerSummary(steamId);
    if (!summary) throw new Error("Não foi possível carregar perfil Steam");

    const { error } = await supabase
      .from("profiles")
      .update({
        steam_id: steamId,
        steam_persona_name: summary.personaname,
        steam_avatar_url: summary.avatarfull,
        steam_profile_url: summary.profileurl,
        steam_visibility: summary.communityvisibilitystate,
        steam_linked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw new Error(error.message);
    return { steamId, persona: summary.personaname, isPublic: summary.communityvisibilitystate === 3 };
  });

export const unlinkSteamAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        steam_id: null,
        steam_persona_name: null,
        steam_avatar_url: null,
        steam_profile_url: null,
        steam_visibility: null,
        steam_linked_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getSteamLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("steam_id, steam_visibility")
      .eq("id", userId)
      .maybeSingle();

    if (!profile?.steam_id) return { linked: false as const };
    const isPublic = profile.steam_visibility === 3;

    const summary = await fetchPlayerSummary(profile.steam_id);
    // Refresh visibility in case it changed since linking
    if (summary && summary.communityvisibilitystate !== profile.steam_visibility) {
      await supabase
        .from("profiles")
        .update({ steam_visibility: summary.communityvisibilitystate })
        .eq("id", userId);
    }
    const currentlyPublic = summary ? summary.communityvisibilitystate === 3 : isPublic;

    if (!currentlyPublic) {
      return { linked: true as const, isPublic: false as const };
    }

    const [owned, recent] = await Promise.all([
      fetchOwnedGames(profile.steam_id),
      fetchRecentGames(profile.steam_id),
    ]);

    const enrich = (g: { appid: number; name: string; playtime_forever: number; img_icon_url: string; playtime_2weeks?: number }) => ({
      appid: g.appid,
      name: g.name,
      playtimeMinutes: g.playtime_forever,
      playtime2wMinutes: g.playtime_2weeks ?? 0,
      header: steamHeaderImage(g.appid),
    });

    const games = (owned ?? []).map(enrich);
    const topPlayed = [...games].sort((a, b) => b.playtimeMinutes - a.playtimeMinutes).slice(0, 8);
    const recentList = (recent ?? []).map(enrich);
    const totalMinutes = games.reduce((s, g) => s + g.playtimeMinutes, 0);

    return {
      linked: true as const,
      isPublic: true as const,
      totalGames: games.length,
      totalMinutes,
      topPlayed,
      recent: recentList,
      all: games,
    };
  });
