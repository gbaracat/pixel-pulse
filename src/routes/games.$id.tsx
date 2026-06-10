import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Play, ArrowLeft, X, VideoOff } from "lucide-react";
import { getGame, games } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { GameActions } from "@/components/GameActions";
import { useEnrichedGame } from "@/hooks/use-enriched-games";
import { useTrailer, toEmbedUrl } from "@/hooks/use-trailer";
import { useGameReviews, useMyReview, useGameRatingAvg } from "@/hooks/use-reviews";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewCard } from "@/components/ReviewCard";
import { SteamOwnedBadge } from "@/components/SteamOwnedBadge";

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
  const enriched = useEnrichedGame(game.id);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Always prefer real RAWG data; only fall back if enrichment hasn't loaded yet.
  const cover = enriched?.cover || game.cover;
  const banner = enriched?.background_image || enriched?.cover || game.cover;
  const community = useGameRatingAvg(game.id);
  const rating = community?.avg ?? enriched?.rating ?? game.rating;
  const year = enriched?.year ?? game.year;
  const genres = enriched?.genres?.length ? enriched.genres : [game.genre];
  const platforms = enriched?.platforms?.length ? enriched.platforms : game.platforms;
  const description = enriched?.description || game.description;
  const screenshots = enriched?.screenshots ?? [];
  const { data: trailerData, isLoading: trailerLoading } = useTrailer(game.title);
  const trailer = toEmbedUrl(trailerData?.link);
  const hasTrailer = !!trailer;

  const similar = games.filter((g) => g.id !== game.id && g.genre === game.genre).slice(0, 4);
  const fallback = games.filter((g) => g.id !== game.id).slice(0, 4);
  const related = similar.length ? similar : fallback;

  return (
    <div className="pb-16">
      {/* Banner */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden scanlines">
        <img src={banner} alt={game.title} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 h-full flex flex-col justify-end pb-12 pt-24">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan mb-6">
            <ArrowLeft className="size-3" /> Voltar
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-4">
            <div className="font-display text-xs text-neon-cyan">
              {genres.join(" · ").toUpperCase()} · {year}
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-glow-pink leading-tight">{game.title}</h1>
            <p className="text-base sm:text-lg text-muted-foreground line-clamp-4">{description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 text-neon-cyan font-display">
                <Star className="size-4 fill-current" />
                {rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="size-4" /> {game.hours}h médio
              </span>
              <span className="px-2 py-0.5 rounded bg-secondary text-xs uppercase font-display">{game.difficulty}</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {hasTrailer ? (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold glow-pink hover:scale-105 transition"
                >
                  <Play className="size-4 fill-current" /> Ver Trailer
                </button>
              ) : (
                <div
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-secondary/60 border border-border text-muted-foreground text-sm font-display"
                  title="Sem trailer cadastrado na planilha"
                >
                  <VideoOff className="size-4" />
                  {trailerLoading ? "Carregando trailer..." : "Trailer indisponível"}
                </div>
              )}
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <GameActions gameId={game.id} />
              <SteamOwnedBadge gameId={game.id} />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 mt-8">
        {/* Descrição completa */}
        {description && (
          <section className="space-y-3">
            <h3 className="font-display text-sm text-glow-purple">Sobre o jogo</h3>
            <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{description}</p>
          </section>
        )}

        {/* Screenshots reais */}
        {screenshots.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-display text-sm text-glow-purple">Screenshots</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {screenshots.map((src) => (
                <button
                  key={src}
                  onClick={() => setLightbox(src)}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-border hover:border-neon-pink/60 transition"
                >
                  <img src={src} alt={`${game.title} screenshot`} loading="lazy" className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-500" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Info grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard label="Plataformas" value={platforms.join(" · ")} />
          <InfoCard label="Tempo médio" value={`${game.hours} horas`} />
          <InfoCard label="Nota da comunidade" value={`${rating.toFixed(1)} / 10`} accent />
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

        <CommunityReviews gameId={game.id} />

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

      {/* ============= TRAILER MODAL ============= */}
      <AnimatePresence>
        {trailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setTrailerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setTrailerOpen(false)}
                className="absolute -top-12 right-0 size-10 grid place-items-center rounded-full bg-card border border-border hover:border-neon-pink hover:text-neon-pink transition"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-neon-pink/40 glow-pink bg-black">
                {trailer ? (
                  /\.(mp4|webm|ogg)(\?|$)/i.test(trailer) ? (
                    <video
                      src={trailer}
                      controls
                      autoPlay
                      poster={cover}
                      className="size-full object-contain bg-black"
                    >
                      Seu navegador não suporta vídeo HTML5.
                    </video>
                  ) : (
                    <iframe
                      src={trailer}
                      title={`${game.title} trailer`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="size-full"
                    />
                  )
                ) : (
                  <div className="size-full grid place-items-center text-center px-6">
                    <div className="space-y-3">
                      <VideoOff className="size-10 mx-auto text-neon-pink" />
                      <div className="font-display text-sm text-neon-pink">TRAILER INDISPONÍVEL</div>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Não há trailer oficial cadastrado para <strong>{game.title}</strong> na nossa base de dados.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center text-xs text-muted-foreground font-display tracking-widest">
                {game.title.toUpperCase()} · TRAILER OFICIAL
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============= SCREENSHOT LIGHTBOX ============= */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md grid place-items-center p-4 cursor-zoom-out"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox} alt="" className="max-h-[90vh] max-w-[95vw] rounded-xl border border-neon-cyan/40" />
          </motion.div>
        )}
      </AnimatePresence>
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

function CommunityReviews({ gameId }: { gameId: string }) {
  const { data, isLoading } = useGameReviews(gameId);
  const my = useMyReview(gameId);
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-sm text-glow-purple">Reviews da comunidade</h3>
        {data && data.length > 0 && (
          <span className="text-xs text-muted-foreground font-display">{data.length} REVIEW{data.length === 1 ? "" : "S"}</span>
        )}
      </div>
      <ReviewForm gameId={gameId} existing={my} />
      {isLoading && <div className="text-sm text-muted-foreground">Carregando reviews…</div>}
      {data && data.length === 0 && (
        <div className="text-sm text-muted-foreground italic">Seja o primeiro a publicar uma review.</div>
      )}
      <div className="space-y-3">
        {data?.filter((r) => r.id !== my?.id).map((r) => (
          <ReviewCard key={r.id} review={r} gameId={gameId} />
        ))}
      </div>
    </section>
  );
}
