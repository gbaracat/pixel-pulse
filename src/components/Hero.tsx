import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Sparkles, Star, ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-arcade.jpg";
import { getGame } from "@/data/games";
import { useEnrichedGames } from "@/hooks/use-enriched-games";

// Curated list of iconic retro classics for the rotating hero
const HERO_SLUGS = [
  "super-mario-bros",
  "super-mario-world",
  "sonic-the-hedgehog",
  "sonic-2",
  "zelda-link-to-the-past",
  "chrono-trigger",
  "castlevania-symphony-of-the-night",
  "mega-man-x",
  "street-fighter-ii",
  "mortal-kombat",
  "donkey-kong-country",
  "contra",
  "metal-slug",
  "pac-man",
  "space-invaders",
  "final-fantasy-vi",
  "pokemon-red-blue",
  "earthbound",
];

export function Hero() {
  const { data: enriched } = useEnrichedGames();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = HERO_SLUGS.map((id) => {
    const g = getGame(id);
    if (!g) return null;
    const e = enriched?.[id];
    return {
      id,
      title: g.title,
      year: e?.year ?? g.year,
      rating: e?.rating ?? g.rating,
      platform: e?.platforms?.[0] ?? g.platforms[0] ?? "Arcade",
      genre: e?.genres?.[0] ?? g.genre,
      description: (e?.description?.slice(0, 220) ?? g.description) + (e?.description && e.description.length > 220 ? "…" : ""),
      cover: e?.cover ?? g.cover,
      background: e?.background_image ?? e?.cover ?? hero,
    };
  }).filter(Boolean) as Array<{
    id: string; title: string; year: number; rating: number;
    platform: string; genre: string; description: string;
    cover: string; background: string;
  }>;

  const total = slides.length;

  useEffect(() => {
    if (paused || total === 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 7000);
    return () => clearInterval(t);
  }, [paused, total]);

  if (total === 0) {
    return (
      <section className="relative min-h-[60vh] grid place-items-center">
        <div className="text-muted-foreground font-display text-sm animate-pulse">Carregando clássicos…</div>
      </section>
    );
  }

  const slide = slides[index];
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section
      className="relative min-h-[92vh] sm:min-h-[88vh] w-full overflow-hidden scanlines crt-flicker"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background art — cross-fades per slide */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`bg-${slide.id}`}
          src={slide.background}
          alt=""
          aria-hidden
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 size-full object-cover"
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-25" />
      {/* CRT scanlines stronger on hero */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,oklch(0_0_0/0.55)_3px,oklch(0_0_0/0.55)_4px)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        {/* LEFT: copy */}
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink text-xs font-display">
            <Sparkles className="size-3" /> ARCADE · 8-BIT · 16-BIT · ETERNOS
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-[11px] font-display tracking-widest uppercase text-neon-cyan">
                <span className="px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/40">{slide.platform}</span>
                <span>{slide.year}</span>
                <span className="flex items-center gap-1 text-neon-pink">
                  <Star className="size-3 fill-current" /> {slide.rating.toFixed(1)}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.05] text-glow-purple">
                {slide.title}
                <span className="block text-neon-pink text-glow-pink text-xl sm:text-2xl mt-3">
                  Uma viagem pelos clássicos.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl line-clamp-4">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/games/$id"
                  params={{ id: slide.id }}
                  className="group inline-flex items-center gap-2 px-6 h-12 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold glow-purple hover:glow-pink transition"
                >
                  <Play className="size-4 fill-current" /> Ver Detalhes
                </Link>
                <Link
                  to="/categories/$slug"
                  params={{ slug: "most-played-history" }}
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-secondary/70 backdrop-blur border border-border hover:border-neon-cyan hover:text-neon-cyan transition"
                >
                  <Gamepad2 className="size-4" /> Explorar Clássicos
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex items-center gap-2 pt-4">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="size-8 grid place-items-center rounded-full border border-border/70 hover:border-neon-cyan hover:text-neon-cyan transition"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para ${s.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-neon-pink shadow-[0_0_10px_oklch(0.72_0.28_350/0.7)]" : "w-3 bg-border/60 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Próximo"
              className="size-8 grid place-items-center rounded-full border border-border/70 hover:border-neon-cyan hover:text-neon-cyan transition"
            >
              <ChevronRight className="size-4" />
            </button>
            <span className="ml-3 text-[10px] font-display text-muted-foreground tracking-widest">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* RIGHT: cover art "cartridge" */}
        <div className="hidden lg:block relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`cover-${slide.id}`}
              initial={{ opacity: 0, x: 40, rotate: 4 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              exit={{ opacity: 0, x: -40, rotate: -6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mx-auto w-[300px] xl:w-[360px]"
            >
              {/* Neon frame */}
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-neon-purple via-neon-pink to-neon-cyan opacity-70 blur-xl" />
              <Link to="/games/$id" params={{ id: slide.id }} className="relative block">
                <div className="relative overflow-hidden rounded-xl border-2 border-neon-pink/60 aspect-[3/4] bg-card shadow-[0_0_40px_oklch(0.72_0.28_350/0.45)]">
                  <img
                    src={slide.cover}
                    alt={slide.title}
                    className="absolute inset-0 size-full object-cover"
                  />
                  {/* scanlines on cover */}
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,oklch(0_0_0/0.6)_3px,oklch(0_0_0/0.6)_4px)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <div className="text-[10px] font-display text-neon-cyan tracking-widest">{slide.genre.toUpperCase()}</div>
                    <div className="font-display text-base text-glow-pink">{slide.title}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
