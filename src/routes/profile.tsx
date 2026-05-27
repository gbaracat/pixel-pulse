import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Gamepad2, Heart, LogOut, Loader2 } from "lucide-react";
import { games } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { useAuth } from "@/hooks/use-auth";
import { useGameLists, type ListStatus } from "@/hooks/use-game-lists";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Meu Perfil — Pixel Store" },
      { name: "description", content: "Sua biblioteca, listas e estatísticas gamer." },
    ],
  }),
  component: ProfilePage,
});

const tabs: { id: ListStatus; label: string }[] = [
  { id: "playing", label: "Jogando" },
  { id: "completed", label: "Zerados" },
  { id: "wishlist", label: "Wishlist" },
  { id: "favorite", label: "Favoritos" },
  { id: "abandoned", label: "Abandonados" },
];

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ListStatus>("playing");
  const { data: lists, isLoading } = useGameLists();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="pt-32 grid place-items-center">
        <Loader2 className="size-6 animate-spin text-neon-pink" />
      </div>
    );
  }

  const byStatus = (s: ListStatus) =>
    (lists ?? []).filter((r) => r.status === s).map((r) => games.find((g) => g.id === r.game_id)).filter(Boolean);

  const displayName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Player";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  const completedCount = byStatus("completed").length;
  const favoritesCount = byStatus("favorite").length;
  const playingCount = byStatus("playing").length;
  const totalHours = byStatus("completed").reduce((a, g) => a + (g?.hours ?? 0), 0);

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
      <section className="relative rounded-2xl overflow-hidden border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-background to-neon-pink/20" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="size-28 sm:size-32 rounded-2xl overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center glow-purple shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="size-full object-cover" />
            ) : (
              <span className="font-display text-3xl text-background">{displayName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="font-display text-xs text-neon-cyan">PLAYER ONE</div>
            <h1 className="font-display text-2xl sm:text-3xl text-glow-pink">{displayName}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-secondary/80 border border-border hover:border-neon-pink hover:text-neon-pink transition"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={<Clock className="size-5" />} label="Horas (zerados)" value={`${totalHours}h`} />
        <Stat icon={<Trophy className="size-5" />} label="Concluídos" value={String(completedCount)} />
        <Stat icon={<Gamepad2 className="size-5" />} label="Jogando" value={String(playingCount)} accent />
        <Stat icon={<Heart className="size-5" />} label="Favoritos" value={String(favoritesCount)} />
      </section>

      <section className="space-y-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border">
          {tabs.map((t) => {
            const count = byStatus(t.id).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 h-10 font-display text-[11px] uppercase tracking-wider whitespace-nowrap transition border-b-2 ${
                  tab === t.id
                    ? "text-neon-pink border-neon-pink text-glow-pink"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {t.label} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid place-items-center py-16"><Loader2 className="size-5 animate-spin text-neon-pink" /></div>
        ) : byStatus(tab).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-border rounded-xl"
          >
            <div className="font-display text-neon-pink">LISTA VAZIA</div>
            <p className="text-muted-foreground text-sm mt-2">
              Adicione jogos a esta lista pelos cards ou pela página do jogo.
            </p>
            <Link to="/discover" className="inline-block mt-4 text-neon-cyan hover:underline">Explorar jogos →</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {byStatus(tab).map((g) =>
              g ? (
                <div key={g.id} className="[&>a]:!w-full">
                  <GameCard game={g} />
                </div>
              ) : null
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-border bg-card"}`}>
      <div className={`size-9 rounded-md grid place-items-center mb-3 ${accent ? "bg-neon-cyan/20 text-neon-cyan" : "bg-secondary text-neon-pink"}`}>
        {icon}
      </div>
      <div className="font-display text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold ${accent ? "text-neon-cyan text-glow-cyan" : ""}`}>{value}</div>
    </div>
  );
}
