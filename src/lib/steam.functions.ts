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

const signInSchema = z.object({
  params: z.record(z.string(), z.string()),
  redirectTo: z.string().url(),
});

/**
 * Steam-only signup / sign-in.
 * Verifies Steam OpenID, finds-or-creates a Supabase auth user keyed by SteamID,
 * upserts profile with Steam info, and returns a magic action_link the client
 * navigates to in order to establish a session.
 */
export const signInWithSteam = createServerFn({ method: "POST" })
  .inputValidator((input) => signInSchema.parse(input))
  .handler(async ({ data }) => {
    const steamId = await verifySteamOpenId(data.params);
    if (!steamId) throw new Error("Falha ao verificar identidade Steam");

    const summary = await fetchPlayerSummary(steamId);
    if (!summary) throw new Error("Não foi possível carregar perfil Steam");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Find existing profile linked to this SteamID
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("steam_id", steamId)
      .maybeSingle();

    let userId = existing?.id as string | undefined;
    let email: string | null = null;

    if (!userId) {
      // 2. Create new auth user
      email = `steam_${steamId}@pixelstore.app`;
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          full_name: summary.personaname,
          avatar_url: summary.avatarfull,
          steam_id: steamId,
          provider: "steam",
        },
      });
      if (createErr || !created.user) {
        throw new Error(createErr?.message ?? "Falha ao criar usuário");
      }
      userId = created.user.id;

      // 3. Upsert profile (handle_new_user trigger may have inserted a base row)
      const personaSlug = summary.personaname
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .slice(0, 24) || `steam_${steamId.slice(-6)}`;
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: userId,
            username: personaSlug,
            display_name: summary.personaname,
            avatar_url: summary.avatarfull,
            steam_id: steamId,
            steam_persona_name: summary.personaname,
            steam_avatar_url: summary.avatarfull,
            steam_profile_url: summary.profileurl,
            steam_visibility: summary.communityvisibilitystate,
            steam_linked_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
    } else {
      // existing user – refresh Steam fields and fetch email for magic link
      await supabaseAdmin
        .from("profiles")
        .update({
          steam_persona_name: summary.personaname,
          steam_avatar_url: summary.avatarfull,
          steam_profile_url: summary.profileurl,
          steam_visibility: summary.communityvisibilitystate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(userId);
      email = userRes.user?.email ?? null;
      if (!email) throw new Error("Conta Steam sem email associado");
    }

    // 4. Generate magic link so the browser can establish a session
    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: email!,
      options: { redirectTo: data.redirectTo },
    });
    if (linkErr || !link.properties?.action_link) {
      throw new Error(linkErr?.message ?? "Falha ao gerar sessão");
    }

    return {
      actionLink: link.properties.action_link,
      persona: summary.personaname,
      isPublic: summary.communityvisibilitystate === 3,
    };
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

    if (!profile?.steam_id) {
      console.log("[steam] getSteamLibrary: no steam_id linked for user", userId);
      return { linked: false as const };
    }

    const summary = await fetchPlayerSummary(profile.steam_id);
    if (summary && summary.communityvisibilitystate !== profile.steam_visibility) {
      await supabase
        .from("profiles")
        .update({ steam_visibility: summary.communityvisibilitystate })
        .eq("id", userId);
    }
    const currentlyPublic = summary
      ? summary.communityvisibilitystate === 3
      : profile.steam_visibility === 3;

    if (!summary) {
      return {
        linked: true as const,
        isPublic: currentlyPublic,
        error: "Não foi possível carregar perfil Steam (API indisponível ou chave inválida).",
      };
    }

    if (!currentlyPublic) {
      return { linked: true as const, isPublic: false as const, gameDetailsPrivate: true as const };
    }

    const [owned, recent] = await Promise.all([
      fetchOwnedGames(profile.steam_id),
      fetchRecentGames(profile.steam_id),
    ]);

    if (!owned) {
      return {
        linked: true as const,
        isPublic: true as const,
        error: "Falha ao buscar biblioteca na Steam Web API.",
      };
    }

    if (owned.gameDetailsPrivate) {
      return {
        linked: true as const,
        isPublic: true as const,
        gameDetailsPrivate: true as const,
      };
    }

    const enrich = (g: { appid: number; name: string; playtime_forever: number; img_icon_url: string; playtime_2weeks?: number }) => ({
      appid: g.appid,
      name: g.name,
      playtimeMinutes: g.playtime_forever,
      playtime2wMinutes: g.playtime_2weeks ?? 0,
      header: steamHeaderImage(g.appid),
    });

    const games = owned.games.map(enrich);
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
