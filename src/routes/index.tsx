import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { GameRow } from "@/components/GameRow";
import { retroCategories, games, getGame } from "@/data/games";
import { useEnrichedGames } from "@/hooks/use-enriched-games";
import { syncAllGames } from "@/lib/sync-rawg.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Store — Um museu moderno dos jogos clássicos" },
      { name: "description", content: "Uma viagem pelos maiores clássicos da história dos videogames. Arcades, Super Nintendo, Mega Drive, PS1 e os jogos que mudaram a indústria." },
      { property: "og:title", content: "Pixel Store — A história dos videogames em um só lugar" },
      { property: "og:description", content: "Do arcade dos anos 80 aos RPGs 16-bit. Descubra os jogos que marcaram gerações." },
    ],
  }),
  component: Index,
});

// Curiosidades históricas REAIS, com fontes públicas e amplamente documentadas.
const HISTORY = [
  {
    year: "1980",
    title: "O nascimento do Pac-Man",
    body: "Toru Iwatani criou Pac-Man na Namco inspirado em uma pizza com uma fatia removida. O objetivo era atrair mulheres aos arcades, então dominados por jogos de tiro espacial.",
    slug: "pac-man",
  },
  {
    year: "1985",
    title: "Super Mario Bros. salva a indústria",
    body: "Após o crash dos videogames de 1983, o lançamento de Super Mario Bros. no NES (1985) reacendeu o mercado e definiu o template do platformer moderno.",
    slug: "super-mario-bros",
  },
  {
    year: "1986",
    title: "Zelda inventa o save",
    body: "The Legend of Zelda foi um dos primeiros jogos de console com bateria interna no cartucho para salvar progresso — algo revolucionário em uma era de senhas e fitas inteiras em uma sessão.",
    slug: "zelda-link-to-the-past",
  },
  {
    year: "1991",
    title: "A origem do Sonic",
    body: "Naoto Ohshima desenhou Sonic para a Sega como uma mascote rápida o suficiente para humilhar Mario. A cor azul veio do logo da própria Sega.",
    slug: "sonic-the-hedgehog",
  },
  {
    year: "1991",
    title: "Street Fighter II cria os e-sports",
    body: "Street Fighter II popularizou o conceito de combate 1v1 com personagens distintos e movimentos especiais, fundando a base da cena competitiva de jogos de luta.",
    slug: "street-fighter-ii",
  },
  {
    year: "1994",
    title: "O impacto de Final Fantasy VI",
    body: "Com 14 personagens jogáveis e uma ópera espacial 16-bit conduzida por Nobuo Uematsu, FFVI provou que JRPGs podiam contar histórias adultas e cinematográficas.",
    slug: "final-fantasy-vi",
  },
  {
    year: "1995",
    title: "Chrono Trigger e o Dream Team",
    body: "Reuniu Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest) e Akira Toriyama (Dragon Ball). Múltiplos finais e um sistema de combate sem telas separadas redefiniram o gênero.",
    slug: "chrono-trigger",
  },
  {
    year: "1997",
    title: "Symphony of the Night funda o Metroidvania",
    body: "Castlevania: Symphony of the Night combinou exploração não-linear (do Metroid) com progressão de RPG, dando nome a um gênero inteiro: Metroidvania.",
    slug: "castlevania-symphony-of-the-night",
  },
];

const DID_YOU_KNOW = [
  { game: "Super Mario", fact: "O bigode do Mario existe porque, nos sprites do NES, era impossível desenhar uma boca legível. O bigode resolveu o problema." },
  { game: "Sonic", fact: "Sonic tem uma 'attitude' porque a Sega pesquisou o que crianças americanas achavam 'cool' no início dos anos 90 — e impaciência ganhou." },
  { game: "Zelda", fact: "Shigeru Miyamoto se inspirou nas explorações que fazia em cavernas no Japão durante a infância para criar a sensação de descoberta de Zelda." },
  { game: "Pokémon", fact: "Satoshi Tajiri criou Pokémon inspirado no hobby de coletar insetos na infância — daí o sistema de capturar criaturas." },
  { game: "Castlevania", fact: "O título original de Symphony of the Night em japonês é 'Akumajō Dracula X: Gekka no Yasōkyoku' — 'Noturno ao Luar'." },
  { game: "Chrono Trigger", fact: "O jogo tem 13 finais diferentes dependendo de quando e como você derrota o vilão Lavos." },
];

function Index() {
  const { data: enriched, refetch } = useEnrichedGames();
  const syncFn = useServerFn(syncAllGames);
  const triggered = useRef(false);
  const sync = useMutation({
    mutationFn: () => syncFn({ data: {} }),
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
      toast.info(`Carregando dados reais de ${missing} jogos...`);
      sync.mutate();
    }
  }, [enriched, sync]);

  return (
    <div>
      <Hero />
      <div className="space-y-14 -mt-16 relative z-10 pb-20">
        {retroCategories.map((r) => {
          const list = r.ids.map((id) => getGame(id)!).filter(Boolean);
          if (list.length === 0) return null;
          return <GameRow key={r.slug} slug={r.slug} title={r.title} games={list} />;
        })}

        {/* ============= HISTÓRIA DOS VIDEOGAMES ============= */}
        <section className="px-4 sm:px-6 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-display text-neon-cyan">
                <BookOpen className="size-3" /> HISTÓRIA DOS VIDEOGAMES
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-glow-pink">
                Marcos que mudaram tudo
              </h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HISTORY.map((h, i) => {
              const e = enriched?.[h.slug];
              const cover = e?.cover;
              return (
                <motion.div
                  key={h.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Link
                    to="/games/$id"
                    params={{ id: h.slug }}
                    className="group relative block overflow-hidden rounded-xl border border-border/60 bg-card hover:border-neon-pink/60 hover:glow-pink transition h-full"
                  >
                    {cover && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={cover}
                          alt={h.title}
                          loading="lazy"
                          className="absolute inset-0 size-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur text-[10px] font-display text-neon-cyan tracking-widest">
                          {h.year}
                        </div>
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      {!cover && (
                        <div className="text-[10px] font-display text-neon-cyan tracking-widest">{h.year}</div>
                      )}
                      <h3 className="font-display text-sm text-glow-purple group-hover:text-glow-pink transition">
                        {h.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{h.body}</p>
                      <div className="inline-flex items-center gap-1 text-[11px] text-neon-cyan pt-1">
                        Ver jogo <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ============= VOCÊ SABIA? ============= */}
        <section className="px-4 sm:px-6 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-display text-neon-cyan">
              <Lightbulb className="size-3" /> VOCÊ SABIA?
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-glow-purple">
              Curiosidades dos clássicos
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DID_YOU_KNOW.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="relative overflow-hidden rounded-xl border border-neon-purple/30 bg-gradient-to-br from-card via-card to-neon-purple/10 p-5 hover:border-neon-cyan/60 transition"
              >
                <div className="absolute -right-4 -top-4 text-[80px] font-display text-neon-pink/10 leading-none select-none">
                  ?
                </div>
                <div className="relative space-y-2">
                  <div className="font-display text-[10px] text-neon-pink tracking-widest">
                    {d.game.toUpperCase()}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{d.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============= CTA DESCOBRIR (jogos modernos) ============= */}
        <section className="px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-neon-purple/40 bg-gradient-to-br from-neon-purple/20 via-card to-neon-pink/15 p-8 sm:p-12 glow-purple">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
                <Sparkles className="size-3" /> JOGOS MODERNOS
              </div>
              <h3 className="font-display text-xl sm:text-3xl text-glow-pink leading-tight">
                Procurando algo lançado essa década?
              </h3>
              <p className="text-muted-foreground">
                Valorant, Fortnite, Elden Ring, CS2, GTA V e mais. Use o motor de recomendação para encontrar seu próximo jogo pelo humor, dificuldade e gênero.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-foreground text-background font-semibold hover:bg-neon-cyan transition"
              >
                Ir para Descobrir <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
