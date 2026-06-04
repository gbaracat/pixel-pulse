import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Star, ListIcon, UserPlus, UserMinus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useFollowCounts, useIsFollowing, useToggleFollow } from "@/hooks/use-follows";
import { games } from "@/data/games";

export const Route = createFileRoute("/u/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — Pixel Store` },
      { name: "description", content: `Perfil de ${params.username} na Pixel Store.` },
    ],
  }),
  component: PublicProfilePage,
  errorComponent: ({ error }) => (
    <div className="pt-32 text-center text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="pt-32 text-center text-sm text-muted-foreground">Usuário não encontrado.</div>
  ),
});

function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public_profile", username],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id,display_name,username,avatar_url,banner_url,bio,favorite_game_ids,created_at")
        .eq("username", username)
        .maybeSingle();
      if (error) throw error;
      if (!profile) throw notFound();

      const [reviewsR, listsR] = await Promise.all([
        supabase
          .from("reviews")
          .select("id,game_id,rating,body,created_at")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("user_lists")
          .select("id,title,description,created_at")
          .eq("user_id", profile.id)
          .eq("is_public", true)
          .order("updated_at", { ascending: false })
          .limit(10),
      ]);

      return { profile, reviews: reviewsR.data ?? [], lists: listsR.data ?? [] };
    },
  });
}

function PublicProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const { data, isLoading } = usePublicProfile(username);
  const counts = useFollowCounts(data?.profile.id);
  const isFollowing = useIsFollowing(data?.profile.id);
  const toggleFollow = useToggleFollow(data?.profile.id ?? "");

  if (isLoading) {
    return (
      <div className="pt-32 grid place-items-center">
        <Loader2 className="size-6 animate-spin text-neon-pink" />
      </div>
    );
  }
  if (!data) return null;

  const { profile, reviews, lists } = data;
  const name = profile.display_name || profile.username || "Player";
  const isSelf = user?.id === profile.id;
  const favoriteGames = (profile.favorite_game_ids ?? [])
    .map((id) => games.find((g) => g.id === id))
    .filter(Boolean) as typeof games;

  return (
    <div className="pb-16">
      <section className="relative h-[260px] w-full overflow-hidden bg-gradient-to-br from-neon-purple/30 via-background to-neon-pink/20">
        {profile.banner_url ? (
          <img src={profile.banner_url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid-bg opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-20 relative z-10 space-y-10">
        <section className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="size-32 rounded-2xl overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center border-4 border-background glow-purple shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={name} className="size-full object-cover" />
            ) : (
              <span className="font-display text-4xl text-background">{name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="font-display text-xs text-neon-cyan">PLAYER</div>
            <h1 className="font-display text-3xl text-glow-pink">{name}</h1>
            {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
            {profile.bio && <p className="text-sm text-foreground/90 max-w-2xl">{profile.bio}</p>}
            <div className="flex items-center gap-4 pt-1 text-sm">
              <span><b className="font-display text-neon-cyan">{counts.data?.followers ?? 0}</b> <span className="text-muted-foreground">seguidores</span></span>
              <span><b className="font-display text-neon-cyan">{counts.data?.following ?? 0}</b> <span className="text-muted-foreground">seguindo</span></span>
            </div>
          </div>
          <div className="shrink-0">
            {isSelf ? (
              <Link to="/profile" className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-neon-cyan/40 text-neon-cyan text-sm font-display hover:border-neon-cyan">
                EDITAR PERFIL
              </Link>
            ) : user ? (
              <button
                onClick={() => toggleFollow.mutate(!isFollowing.data)}
                disabled={toggleFollow.isPending}
                className={`inline-flex items-center gap-2 px-5 h-10 rounded-md font-display text-xs uppercase tracking-wider transition ${
                  isFollowing.data
                    ? "border border-border hover:border-destructive hover:text-destructive"
                    : "bg-gradient-to-r from-neon-purple to-neon-pink text-background glow-pink"
                }`}
              >
                {isFollowing.data ? <><UserMinus className="size-4" /> Seguindo</> : <><UserPlus className="size-4" /> Seguir</>}
              </button>
            ) : (
              <Link to="/login" className="inline-flex items-center gap-2 px-5 h-10 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-display text-xs">
                <UserPlus className="size-4" /> SEGUIR
              </Link>
            )}
          </div>
        </section>

        {favoriteGames.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-display text-sm text-glow-purple inline-flex items-center gap-2">
              <Star className="size-4 text-neon-cyan" /> JOGOS FAVORITOS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {favoriteGames.map((g) => (
                <Link key={g.id} to="/games/$id" params={{ id: g.id }} className="group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-neon-cyan/30 hover:border-neon-cyan transition">
                    <img src={g.cover} alt={g.title} className="size-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="mt-2 text-xs truncate font-display">{g.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="font-display text-sm text-glow-purple">REVIEWS RECENTES</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma review ainda.</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => {
                const g = games.find((x) => x.id === r.game_id);
                return (
                  <li key={r.id} className="rounded-xl border border-border bg-card p-4 flex gap-3">
                    {g && (
                      <Link to="/games/$id" params={{ id: g.id }} className="shrink-0">
                        <img src={g.cover} alt={g.title} className="w-14 h-18 object-cover rounded-md" />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        {g && (
                          <Link to="/games/$id" params={{ id: g.id }} className="font-semibold text-sm hover:text-neon-cyan truncate">
                            {g.title}
                          </Link>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-display text-neon-cyan">
                          <Star className="size-3 fill-neon-cyan" /> {Number(r.rating)}/10
                        </span>
                      </div>
                      {r.body && <p className="text-sm text-foreground/90 line-clamp-3">{r.body}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="font-display text-sm text-glow-purple inline-flex items-center gap-2">
            <ListIcon className="size-4 text-neon-cyan" /> LISTAS PÚBLICAS
          </h3>
          {lists.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma lista pública.</p>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-3">
              {lists.map((l) => (
                <li key={l.id}>
                  <Link to="/lists/$id" params={{ id: l.id }} className="block rounded-xl border border-border bg-card p-4 hover:border-neon-cyan/40 transition">
                    <div className="font-semibold truncate">{l.title}</div>
                    {l.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{l.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
