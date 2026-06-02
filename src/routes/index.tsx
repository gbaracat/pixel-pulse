import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, History, Flame } from "lucide-react";
import { Hero } from "@/components/Hero";
import { GameRow } from "@/components/GameRow";
import { modernCategories, games, getGame } from "@/data/games";
import { useEnrichedGames } from "@/hooks/use-enriched-games";
import { syncAllGames } from "@/lib/sync-rawg.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Store — Os jogos que estão dominando agora" },
      { name: "description", content: "Lançamentos, tendências e os títulos mais jogados do momento. Valorant, Elden Ring, CS2, Fortnite, GTA V e muito mais." },
      { property: "og:title", content: "Pixel Store — Jogos modernos, lançamentos e tendências" },
      { property: "og:description", content: "Descubra os jogos que estão movimentando a comunidade gamer agora." },
    ],
  }),
  component: Index,
});

// Hero rotativo focado em modernos / lançamentos / tendências.
const MODERN_HERO_SLUGS = [
  "elden-ring",
  "baldurs-gate-3",
  "cyberpunk-2077",
  "red-dead-redemption-2",
  "gta-v",
  "valorant",
  "cs2",
  "fortnite",
  "marvel-rivals",
  "the-finals",
  "genshin-impact",
  "rocket-league",
];

// Tendências em destaque na Home.
const TRENDING_SLUGS = [
  "elden-ring",
  "baldurs-gate-3",
  "marvel-rivals",
  "the-finals",
  "cs2",
  "valorant",
];

function Index() {
  const { data: enriched, refetch } = useEnrichedGames();
  const syncFn = useServerFn(syncAllGames);
  const triggered = useRef(false);
  const sync = useMutation({
    mutationFn: (force: boolean) => syncFn({ data: { force } }),
    onSuccess: (res) => {
      toast.success(`Sincronizado: ${res.ok}/${res.total} jogos`);
      refetch();
    },
    onError: (e) => toast.error(`Falha ao sincronizar: ${e instanceof Error ? e.message : "erro"}`),
  });

  useEffect(() => {
    if (triggered.current || !enriched || sync.isPending) return;
    const missing = games.filter((g) => !enriched[g.id]).length;
    const enrichedList = Object.values(enriched);
    const withTrailer = enrichedList.filter((e) => e.trailer_url).length;
    const noTrailersAtAll = enrichedList.length > 0 && withTrailer === 0;
    if (missing > 0) {
      triggered.current = true;
      toast.info(`Carregando dados reais de ${missing} jogos...`);
      sync.mutate(false);
    } else if (noTrailersAtAll) {
      triggered.current = true;
      sync.mutate(true);
    }
  }, [enriched, sync]);

  const trending = TRENDING_SLUGS.map((id) => getGame(id)!).filter(Boolean);

  return (
    <div>
      <Hero
        slugs={MODERN_HERO_SLUGS}
        badge="LANÇAMENTOS · TENDÊNCIAS · POPULARES"
        subtitle="O que está bombando agora."
        ctaLink={{ to: "/discover", label: "Explorar Modernos" }}
      />

      <div className="space-y-14 -mt-16 relative z-10 pb-20">
        {/* ============= TRENDING ============= */}
        {trending.length > 0 && (
          <GameRow slug="trending" title="🔥 Em alta agora" games={trending} />
        )}

        {/* ============= CATEGORIAS MODERNAS ============= */}
        {modernCategories.map((r) => {
          const list = r.ids.map((id) => getGame(id)!).filter(Boolean);
          if (list.length === 0) return null;
          return <GameRow key={r.slug} slug={r.slug} title={r.title} games={list} />;
        })}

        {/* ============= CTA RETRÔ ============= */}
        <section className="px-4 sm:px-6">
          <Link
            to="/retro"
            className="group relative block overflow-hidden rounded-2xl border border-neon-cyan/40 bg-gradient-to-br from-neon-cyan/15 via-card to-neon-purple/20 p-8 sm:p-12 hover:border-neon-pink/60 transition glow-purple"
          >
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,oklch(0_0_0/0.55)_3px,oklch(0_0_0/0.55)_4px)]" />
            <div className="relative grid sm:grid-cols-[1fr_auto] items-center gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
                  <History className="size-3" /> HUB RETRÔ
                </div>
                <h3 className="font-display text-xl sm:text-3xl text-glow-pink leading-tight">
                  Uma viagem pela história dos videogames
                </h3>
                <p className="text-muted-foreground max-w-2xl">
                  Consoles clássicos, arcades, franquias eternas, curiosidades, segredos e os jogos que moldaram a indústria. Tudo num lugar só.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-foreground text-background font-semibold group-hover:bg-neon-cyan transition shrink-0">
                Entrar no Retrô <ArrowRight className="size-4" />
              </div>
            </div>
          </Link>
        </section>

        {/* ============= CTA DESCOBRIR ============= */}
        <section className="px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-neon-purple/40 bg-gradient-to-br from-neon-purple/20 via-card to-neon-pink/15 p-8 sm:p-12 glow-purple">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative max-w-2xl space-y-4"
            >
              <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
                <Sparkles className="size-3" /> RECOMENDAÇÃO INTELIGENTE
              </div>
              <h3 className="font-display text-xl sm:text-3xl text-glow-pink leading-tight">
                Não sabe o que jogar?
              </h3>
              <p className="text-muted-foreground">
                Use nosso motor de recomendação por humor, dificuldade, plataforma e gênero. Achamos o próximo jogo perfeito pra você.
              </p>
              <Link to="/discover" className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold hover:opacity-90 transition glow-pink">
                <Flame className="size-4" /> Ir para Descobrir
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
