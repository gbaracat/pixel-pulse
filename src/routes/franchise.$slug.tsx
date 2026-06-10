import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { getFranchise, FRANCHISES } from "@/lib/franchises";
import { getGame } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { useEnrichedGame } from "@/hooks/use-enriched-games";

export const Route = createFileRoute("/franchise/$slug")({
  loader: ({ params }) => {
    const franchise = getFranchise(params.slug);
    if (!franchise) throw notFound();
    return { franchise };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.franchise.name} — Pixel Store` },
          { name: "description", content: loaderData.franchise.description },
          { property: "og:title", content: loaderData.franchise.name },
          { property: "og:description", content: loaderData.franchise.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="pt-32 text-center px-4 space-y-3">
      <div className="font-display text-neon-pink">FRANQUIA NÃO ENCONTRADA</div>
      <Link to="/" className="text-neon-cyan underline">Voltar à home</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="pt-32 text-center px-4">
      <div className="font-display text-neon-pink">ERROR</div>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 px-4 h-10 rounded-md bg-secondary">Tentar novamente</button>
    </div>
  ),
  component: FranchisePage,
});

const accentMap = {
  pink: { text: "text-glow-pink", border: "border-neon-pink/50", glow: "glow-pink", chip: "bg-neon-pink/10 text-neon-pink" },
  cyan: { text: "text-glow-cyan", border: "border-neon-cyan/50", glow: "glow-cyan", chip: "bg-neon-cyan/10 text-neon-cyan" },
  purple: { text: "text-glow-purple", border: "border-neon-purple/50", glow: "glow-purple", chip: "bg-neon-purple/10 text-neon-purple" },
};

function FranchisePage() {
  const loaderData = Route.useLoaderData() as { franchise: import("@/lib/franchises").Franchise };
  const franchise = loaderData.franchise;
  const accent = accentMap[franchise.accent];

  const games = franchise.gameIds
    .map((id: string) => getGame(id))
    .filter((g): g is NonNullable<ReturnType<typeof getGame>> => Boolean(g))
    .sort((a, b) => a.year - b.year);

  const others = FRANCHISES.filter((f) => f.slug !== franchise.slug).slice(0, 4);

  return (
    <div className="pb-16">
      <section className={`relative pt-28 pb-12 border-b ${accent.border} bg-gradient-to-br from-card via-background to-card overflow-hidden`}>
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 space-y-4">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan">
            <ArrowLeft className="size-3" /> Voltar
          </Link>
          <div className="font-display text-xs text-muted-foreground tracking-widest">FRANQUIA · {games.length} JOGO{games.length === 1 ? "" : "S"}</div>
          <h1 className={`font-display text-4xl sm:text-6xl ${accent.text} leading-tight`}>{franchise.name}</h1>
          <p className="text-lg text-foreground/90 italic">{franchise.tagline}</p>
          <p className="text-muted-foreground max-w-2xl">{franchise.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-12 space-y-12">
        <section className="space-y-6">
          <h2 className={`font-display text-sm ${accent.text} inline-flex items-center gap-2`}>
            <Calendar className="size-4" /> LINHA DO TEMPO
          </h2>
          <ol className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
            {games.map((g: NonNullable<ReturnType<typeof getGame>>) => (
              <TimelineItem key={g.id} gameId={g.id} year={g.year} title={g.title} accentChip={accent.chip} />
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-sm text-glow-purple">Todos os jogos da franquia</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {games.map((g: NonNullable<ReturnType<typeof getGame>>) => (
              <div key={g.id} className="[&>a]:!w-full">
                <GameCard game={g} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-8 border-t border-border">
          <h3 className="font-display text-sm text-glow-purple">Outras franquias</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {others.map((f) => (
              <Link
                key={f.slug}
                to="/franchise/$slug"
                params={{ slug: f.slug }}
                className="rounded-xl border border-border bg-card p-4 hover:border-neon-pink/50 transition space-y-1"
              >
                <div className="font-display text-sm">{f.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{f.tagline}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TimelineItem({ gameId, year, title, accentChip }: { gameId: string; year: number; title: string; accentChip: string }) {
  const game = getGame(gameId)!;
  const enriched = useEnrichedGame(gameId);
  const cover = enriched?.cover ?? game.cover;
  const desc = enriched?.description ?? game.description;

  return (
    <li className="relative pl-12">
      <span className={`absolute left-0 top-2 size-10 rounded-full ${accentChip} grid place-items-center font-display text-[10px]`}>
        {String(year).slice(2)}
      </span>
      <Link
        to="/games/$id"
        params={{ id: gameId }}
        className="block rounded-xl border border-border bg-card hover:border-neon-cyan/50 transition overflow-hidden"
      >
        <div className="flex gap-4">
          <img src={cover} alt={title} className="w-24 sm:w-32 h-full object-cover" />
          <div className="flex-1 min-w-0 p-4 space-y-1">
            <div className="text-xs text-muted-foreground">{year}</div>
            <div className="font-display text-base">{title}</div>
            <p className="text-sm text-muted-foreground line-clamp-2">{desc}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
