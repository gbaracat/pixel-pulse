import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Clock, Heart, Plus, Play, ArrowLeft } from "lucide-react";
import { getGame, games } from "@/data/games";
import { GameCard } from "@/components/GameCard";

export const Route = createFileRoute("/games/$id")({
  loader: ({ params }) => {
    const game = getGame(params.id);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.game.title} — Pixel Store` },
          { name: "description", content: loaderData.game.description },
          { property: "og:title", content: loaderData.game.title },
          { property: "og:description", content: loaderData.game.description },
          { property: "og:image", content: loaderData.game.cover },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="pt-32 text-center">
      <div className="font-display text-neon-pink text-glow-pink">404 — GAME NOT FOUND</div>
      <Link to="/" className="text-neon-cyan underline mt-4 inline-block">Voltar à home</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="pt-32 text-center px-4">
      <div className="font-display text-neon-pink">ERROR</div>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 px-4 h-10 rounded-md bg-secondary">Tentar novamente</button>
    </div>
  ),
  component: GamePage,
});

function GamePage() {
  const { game } = Route.useLoaderData();
  const similar = games.filter((g) => g.id !== game.id && g.genre === game.genre).slice(0, 4);
  const fallback = games.filter((g) => g.id !== game.id).slice(0, 4);
  const related = similar.length ? similar : fallback;

  return (
    <div className="pb-16">
      {/* Banner */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden scanlines">
        <img src={game.cover} alt={game.title} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 h-full flex flex-col justify-end pb-12 pt-24">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan mb-6">
            <ArrowLeft className="size-3" /> Voltar
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-4">
            <div className="font-display text-xs text-neon-cyan">{game.genre.toUpperCase()} · {game.year}</div>
            <h1 className="font-display text-3xl sm:text-5xl text-glow-pink leading-tight">{game.title}</h1>
            <p className="text-base sm:text-lg text-muted-foreground">{game.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 text-neon-cyan font-display"><Star className="size-4 fill-current" />{game.rating.toFixed(1)}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="size-4" /> {game.hours}h médio</span>
              <span className="px-2 py-0.5 rounded bg-secondary text-xs uppercase font-display">{game.difficulty}</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold glow-pink">
                <Play className="size-4 fill-current" /> Ver Trailer
              </button>
              <button className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-secondary/80 border border-border hover:border-neon-cyan hover:text-neon-cyan transition">
                <Plus className="size-4" /> Adicionar à Lista
              </button>
              <button className="inline-flex items-center justify-center size-11 rounded-md bg-secondary/80 border border-border hover:border-neon-pink hover:text-neon-pink transition">
                <Heart className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 mt-8">
        {/* Trailer placeholder */}
        <section className="aspect-video rounded-2xl border border-border bg-card overflow-hidden relative grid place-items-center">
          <img src={game.cover} alt="" className="absolute inset-0 size-full object-cover opacity-40 blur-sm" />
          <div className="relative z-10 text-center space-y-2">
            <div className="size-16 rounded-full grid place-items-center bg-neon-pink/20 border border-neon-pink mx-auto glow-pink">
              <Play className="size-6 text-neon-pink fill-current" />
            </div>
            <div className="font-display text-xs text-neon-cyan">PRESS START TO PLAY TRAILER</div>
          </div>
          <div className="absolute inset-0 scanlines pointer-events-none" />
        </section>

        {/* Info grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard label="Plataformas" value={game.platforms.join(" · ")} />
          <InfoCard label="Tempo médio" value={`${game.hours} horas`} />
          <InfoCard label="Nota da comunidade" value={`${game.rating} / 10`} accent />
        </div>

        <section className="space-y-3">
          <h3 className="font-display text-sm text-glow-purple">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {game.tags.map((t: string) => (
              <span key={t} className="px-3 h-8 grid place-items-center rounded-full border border-neon-purple/40 text-xs text-neon-purple bg-neon-purple/10">
                #{t}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-sm text-glow-purple">Jogos parecidos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((g) => (
              <div key={g.id} className="[&>a]:!w-full">
                <GameCard game={g} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-border bg-card"}`}>
      <div className="font-display text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${accent ? "text-neon-cyan text-glow-cyan" : ""}`}>{value}</div>
    </div>
  );
}
