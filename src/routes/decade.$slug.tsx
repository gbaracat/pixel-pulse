import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Gamepad2, Lightbulb } from "lucide-react";
import { GameRow } from "@/components/GameRow";
import { DECADES, getDecade, type Decade } from "@/lib/decades";
import { getGame, games } from "@/data/games";

export const Route = createFileRoute("/decade/$slug")({
  head: ({ params }) => {
    const d = getDecade(params.slug);
    if (!d) return { meta: [{ title: "Década não encontrada — Pixel Store" }] };
    return {
      meta: [
        { title: `${d.label} — Linha do Tempo dos Games · Pixel Store` },
        { name: "description", content: `Jogos marcantes, consoles e curiosidades reais de ${d.label} (${d.range[0]}-${d.range[1]}). ${d.tagline}.` },
        { property: "og:title", content: `${d.label} — Os jogos que marcaram a década` },
        { property: "og:description", content: d.description },
      ],
    };
  },
  loader: ({ params }) => {
    const d = getDecade(params.slug);
    if (!d) throw notFound();
    return { decade: d };
  },
  errorComponent: ({ error, reset }) => (
    <div className="px-6 py-20 text-center space-y-4">
      <h1 className="font-display text-xl text-glow-pink">Erro ao carregar década</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="text-sm text-neon-cyan hover:underline">Tentar novamente</button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="px-6 py-20 text-center space-y-4">
      <h1 className="font-display text-xl text-glow-pink">Década não encontrada</h1>
      <Link to="/retro" className="text-sm text-neon-cyan hover:underline">Voltar ao hub Retrô</Link>
    </div>
  ),
  component: DecadePage,
});

function DecadePage() {
  const { decade } = Route.useLoaderData() as { decade: ReturnType<typeof getDecade> & {} };

  // Curated highlights + any other games in the year range we may have missed.
  const highlightSet = new Set(decade.highlightGameIds);
  const highlights = decade.highlightGameIds.map((id) => getGame(id)!).filter(Boolean);
  const otherInRange = games.filter(
    (g) => g.year >= decade.range[0] && g.year <= decade.range[1] && !highlightSet.has(g.id),
  );

  const nextDecade = DECADES[DECADES.findIndex((d) => d.slug === decade.slug) + 1];
  const prevDecade = DECADES[DECADES.findIndex((d) => d.slug === decade.slug) - 1];

  return (
    <div className="pb-20">
      {/* Hero da década */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -right-20 -bottom-32 text-[280px] sm:text-[400px] font-display leading-none select-none opacity-[0.06] text-foreground pointer-events-none">
          {decade.range[0].toString().slice(-2)}
        </div>
        <div className="relative px-4 sm:px-6 py-12 sm:py-20 max-w-5xl mx-auto space-y-5">
          <Link to="/retro" className="inline-flex items-center gap-2 text-xs text-neon-cyan hover:underline">
            <ArrowLeft className="size-3" /> Linha do Tempo
          </Link>
          <div className="inline-flex items-center gap-2 font-display text-[10px] text-neon-cyan tracking-widest">
            <Calendar className="size-3" /> {decade.range[0]} — {decade.range[1]}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-6xl text-glow-pink"
          >
            {decade.label}
          </motion.h1>
          <p className="font-display text-base sm:text-xl text-neon-purple">{decade.tagline}</p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">{decade.description}</p>
        </div>
      </header>

      <div className="space-y-14 pt-14">
        {/* Jogos marcantes */}
        {highlights.length > 0 && (
          <GameRow slug={`decade-${decade.slug}-highlights`} title={`Jogos marcantes — ${decade.label}`} games={highlights} />
        )}

        {/* Consoles da época */}
        <section className="px-4 sm:px-6 space-y-5">
          <header className="space-y-1">
            <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
              <Gamepad2 className="size-3" /> CONSOLES DA ÉPOCA
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-glow-pink">O hardware que definiu {decade.label}</h2>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decade.consoles.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="rounded-xl border border-neon-cyan/30 bg-gradient-to-br from-card via-card to-neon-cyan/5 p-5 hover:border-neon-pink/60 transition"
              >
                <div className="font-display text-[10px] text-neon-cyan tracking-widest">{c.year}</div>
                <h3 className="font-display text-sm text-glow-purple mt-1">{c.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{c.note}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Curiosidades */}
        <section className="px-4 sm:px-6 space-y-5">
          <header className="space-y-1">
            <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
              <Lightbulb className="size-3" /> CURIOSIDADES DA DÉCADA
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-glow-pink">O que você (talvez) não sabia</h2>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {decade.curiosities.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="relative overflow-hidden rounded-xl border border-neon-purple/30 bg-gradient-to-br from-card via-card to-neon-purple/10 p-5 hover:border-neon-cyan/60 transition"
              >
                <div className="absolute -right-4 -top-4 text-[80px] font-display text-neon-pink/10 leading-none select-none">?</div>
                <div className="relative space-y-2">
                  <div className="font-display text-[10px] text-neon-pink tracking-widest">{d.title.toUpperCase()}</div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{d.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Outros jogos da época que existem no catálogo */}
        {otherInRange.length > 0 && (
          <GameRow slug={`decade-${decade.slug}-more`} title={`Mais jogos de ${decade.label} no catálogo`} games={otherInRange} />
        )}

        {/* Navegação entre décadas */}
        <section className="px-4 sm:px-6 pt-8 border-t border-border">
          <div className="grid sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {prevDecade ? (
              <Link
                to="/decade/$slug"
                params={{ slug: prevDecade.slug }}
                className="group rounded-xl border border-border bg-card p-5 hover:border-neon-cyan/60 transition flex items-center gap-3"
              >
                <ArrowLeft className="size-4 text-neon-cyan group-hover:-translate-x-1 transition" />
                <div>
                  <div className="text-[10px] font-display text-muted-foreground tracking-widest">DÉCADA ANTERIOR</div>
                  <div className="font-display text-base text-glow-pink">{prevDecade.label}</div>
                </div>
              </Link>
            ) : <div />}
            {nextDecade ? (
              <Link
                to="/decade/$slug"
                params={{ slug: nextDecade.slug }}
                className="group rounded-xl border border-border bg-card p-5 hover:border-neon-cyan/60 transition flex items-center gap-3 sm:justify-end sm:text-right"
              >
                <div className="sm:order-1">
                  <div className="text-[10px] font-display text-muted-foreground tracking-widest">PRÓXIMA DÉCADA</div>
                  <div className="font-display text-base text-glow-pink">{nextDecade.label}</div>
                </div>
                <ArrowRight className="size-4 text-neon-cyan group-hover:translate-x-1 transition" />
              </Link>
            ) : <div />}
          </div>
        </section>
      </div>
    </div>
  );
}
