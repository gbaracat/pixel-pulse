import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ArrowRight, History, Flame, TrendingUp, Trophy, Gem, Gamepad2, Sparkles } from "lucide-react";
import { Hero } from "@/components/Hero";
import { GameRow } from "@/components/GameRow";
import { MoodAssistant } from "@/components/MoodAssistant";
import { games, getGame } from "@/data/games";
import { useEnrichedGames } from "@/hooks/use-enriched-games";
import { syncAllGames } from "@/lib/sync-rawg.functions";
import { useAuth } from "@/hooks/use-auth";
import { useGameLists } from "@/hooks/use-game-lists";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Store — Descubra o seu próximo jogo" },
      { name: "description", content: "Recomendações inteligentes, jogos em alta, indies, clássicos e biblioteca Steam. Uma plataforma para descobrir jogos." },
      { property: "og:title", content: "Pixel Store — Descubra o seu próximo jogo" },
      { property: "og:description", content: "Netflix, Steam e Letterboxd dos games. Descubra, organize e compartilhe." },
    ],
  }),
  component: Index,
});

// Hero rotativo: mistura moderno + indie + retrô icônico (toda a plataforma).
const HERO_SLUGS = [
  "elden-ring",
  "baldurs-gate-3",
  "hollow-knight",
  "zelda-link-to-the-past",
  "cyberpunk-2077",
  "stardew-valley",
  "super-mario-world",
  "marvel-rivals",
  "celeste",
  "chrono-trigger",
];

const TRENDING_IDS = ["valorant", "elden-ring", "marvel-rivals", "fortnite", "cs2", "baldurs-gate-3", "helldivers-2", "black-myth-wukong"];
const MOST_PLAYED_IDS = ["fortnite", "minecraft", "cs2", "valorant", "league-of-legends", "gta-v", "roblox", "rocket-league"];
const INDIE_IDS = ["hollow-knight", "stardew-valley", "celeste", "dead-cells", "undertale", "vampire-survivors", "dave-the-diver", "sea-of-stars"];
const RETRO_ESSENTIALS_IDS = ["super-mario-bros", "zelda-link-to-the-past", "chrono-trigger", "sonic-the-hedgehog", "super-metroid", "castlevania-symphony-of-the-night", "street-fighter-ii", "pac-man"];

function pickByGenres(targetGenres: Set<string>, excludeIds: Set<string>, limit = 10) {
  const pool = games.filter((g) => targetGenres.has(g.genre) && !excludeIds.has(g.id));
  return pool.sort((a, b) => b.rating - a.rating).slice(0, limit);
}

function Index() {
  const { user } = useAuth();
  const { data: enriched, refetch } = useEnrichedGames();
  const { data: myLists } = useGameLists();
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
    if (missing > 0) {
      triggered.current = true;
      sync.mutate(false);
    }
  }, [enriched, sync]);

  const trending = TRENDING_IDS.map((id) => getGame(id)!).filter(Boolean);
  const mostPlayed = MOST_PLAYED_IDS.map((id) => getGame(id)!).filter(Boolean);
  const indies = INDIE_IDS.map((id) => getGame(id)!).filter(Boolean);
  const retroEssentials = RETRO_ESSENTIALS_IDS.map((id) => getGame(id)!).filter(Boolean);

  // Personalização leve: se o usuário tem favoritos/jogando, recomenda jogos do mesmo gênero
  const personalized = useMemo(() => {
    if (!user || !myLists || myLists.length === 0) return null;
    const userGameIds = new Set(myLists.map((l) => l.game_id));
    const userGenres = new Set<string>();
    myLists.forEach((l) => {
      const g = getGame(l.game_id);
      if (g) userGenres.add(g.genre);
    });
    if (userGenres.size === 0) return null;
    const picks = pickByGenres(userGenres, userGameIds, 10);
    return picks.length >= 4 ? picks : null;
  }, [user, myLists]);

  // "Você pode gostar" — variedade fora dos populares (rotativo por seed do dia)
  const youMightLike = useMemo(() => {
    const excluded = new Set([...TRENDING_IDS, ...MOST_PLAYED_IDS, ...INDIE_IDS, ...RETRO_ESSENTIALS_IDS]);
    const pool = games.filter((g) => !excluded.has(g.id));
    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return [...pool].sort((a, b) => ((a.id.charCodeAt(0) + day) % 7) - ((b.id.charCodeAt(0) + day) % 7)).slice(0, 12);
  }, []);

  return (
    <div>
      <Hero
        slugs={HERO_SLUGS}
        badge="DESCOBRIR · RECOMENDAR · JOGAR"
        subtitle="Sua próxima obsessão te espera."
        ctaLink={{ to: "/discover", label: "Explorar Catálogo" }}
      />

      <div className="space-y-14 -mt-16 relative z-10 pb-20">
        {/* ============= IA EM DESTAQUE — primeira coisa após o hero ============= */}
        <MoodAssistant />

        {/* ============= EM ALTA ============= */}
        <GameRow slug="trending" title="🔥 Em Alta Agora" games={trending} />

        {/* ============= PERSONALIZADO ou FALLBACK ============= */}
        {personalized ? (
          <GameRow slug="recommended" title="✨ Recomendados Para Você" games={personalized} />
        ) : (
          <section className="px-4 sm:px-6">
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="space-y-1">
                <div className="font-display text-xs text-neon-cyan inline-flex items-center gap-2">
                  <Sparkles className="size-3" /> RECOMENDAÇÕES PERSONALIZADAS
                </div>
                <h3 className="font-display text-lg sm:text-xl">Salve jogos pra desbloquear recomendações</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Favorite ou marque como "Jogando" e a Pixel Store passa a sugerir jogos do seu estilo.
                </p>
              </div>
              <Link to="/discover" className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-foreground text-background font-semibold hover:bg-neon-cyan transition shrink-0">
                <TrendingUp className="size-4" /> Explorar
              </Link>
            </div>
          </section>
        )}

        {/* ============= MAIS JOGADOS ============= */}
        <GameRow slug="most-played" title="🏆 Mais Jogados" games={mostPlayed} />

        {/* ============= INDIES ============= */}
        <GameRow slug="indies" title="💎 Indies em Destaque" games={indies} />

        {/* ============= RETRÔ ESSENCIAIS — uma única seção pra clássicos ============= */}
        <GameRow slug="retro-essentials" title="🕹️ Retrô Essenciais" games={retroEssentials} />

        {/* ============= VOCÊ PODE GOSTAR ============= */}
        <GameRow slug="you-might-like" title="🎯 Você Pode Gostar" games={youMightLike} />

        {/* ============= CTA RETRÔ HUB ============= */}
        <section className="px-4 sm:px-6">
          <Link
            to="/retro"
            className="group relative block overflow-hidden rounded-2xl border border-neon-cyan/40 bg-gradient-to-br from-neon-cyan/15 via-card to-neon-purple/20 p-8 sm:p-12 hover:border-neon-pink/60 transition glow-purple"
          >
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative grid sm:grid-cols-[1fr_auto] items-center gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
                  <History className="size-3" /> HUB RETRÔ
                </div>
                <h3 className="font-display text-xl sm:text-3xl text-glow-pink leading-tight">
                  Curte clássicos? Entre na linha do tempo dos games.
                </h3>
                <p className="text-muted-foreground max-w-2xl">
                  80s, 90s, 2000s, 2010s — consoles, arcades, franquias eternas e os jogos que moldaram a indústria.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-foreground text-background font-semibold group-hover:bg-neon-cyan transition shrink-0">
                Entrar no Retrô <ArrowRight className="size-4" />
              </div>
            </div>
          </Link>
        </section>

        {/* ============= CTA DESCOBRIR (mantido para discovery completo) ============= */}
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
                <Gamepad2 className="size-3" /> CATÁLOGO COMPLETO
              </div>
              <h3 className="font-display text-xl sm:text-3xl text-glow-pink leading-tight">
                Filtros avançados, gêneros, plataformas.
              </h3>
              <p className="text-muted-foreground">
                A página Descobrir tem tudo: tendências, filtros por humor/dificuldade/gênero, e o motor de recomendação completo.
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
