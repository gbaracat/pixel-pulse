import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import hero from "@/assets/hero-arcade.jpg";
import { games } from "@/data/games";

export function Hero() {
  const featured = games[0];
  return (
    <section className="relative min-h-[92vh] sm:min-h-[88vh] w-full overflow-hidden scanlines crt-flicker">
      <img src={hero} alt="Pixel Store hero" width={1920} height={1080} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-32 sm:pt-40 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/40 text-neon-pink text-xs font-display">
            <Sparkles className="size-3" /> RETRÔ · MODERNO · COMPETITIVO
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.15] text-glow-purple">
            Do arcade dos<br />
            anos 80 ao<br />
            <span className="text-neon-pink text-glow-pink">topo do ranking.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
            Pixel art, indies, AAA e os maiores competitivos do mundo num só lugar. Recomendações pelo seu humor, estilo e ritmo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/discover"
              className="group inline-flex items-center gap-2 px-6 h-12 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold glow-purple hover:glow-pink transition"
            >
              <Play className="size-4 fill-current" /> Explorar Jogos
            </Link>
            <Link
              to="/games/$id"
              params={{ id: featured.id }}
              className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-secondary/70 backdrop-blur border border-border hover:border-neon-cyan hover:text-neon-cyan transition"
            >
              + Mais Informações
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs font-display text-muted-foreground">
            <span className="text-neon-cyan">★ {featured.rating}</span>
            <span>{featured.genre}</span>
            <span>{featured.year}</span>
            <span>{featured.hours}H</span>
          </div>
        </motion.div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
