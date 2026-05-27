import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import type { Game } from "@/data/games";

export function GameCard({ game, large = false }: { game: Game; large?: boolean }) {
  return (
    <Link
      to="/games/$id"
      params={{ id: game.id }}
      className={`group relative shrink-0 ${large ? "w-72 sm:w-80" : "w-44 sm:w-52"}`}
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative overflow-hidden rounded-xl border border-border/60 bg-card aspect-[3/4]"
      >
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />

        {/* neon edge on hover */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-neon-purple/0 group-hover:ring-neon-pink/70 group-hover:shadow-[0_0_30px_oklch(0.72_0.28_350/0.5)] transition" />

        {/* scanlines */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,oklch(0_0_0/0.6)_3px,oklch(0_0_0/0.6)_4px)]" />

        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-[10px] font-display text-neon-cyan">
          <Star className="size-3 fill-current" />
          {game.rating.toFixed(1)}
        </div>

        <div className="absolute bottom-0 inset-x-0 p-3 space-y-1">
          <div className="text-[10px] font-display text-neon-pink uppercase tracking-wider">{game.genre} · {game.year}</div>
          <div className="font-semibold text-sm leading-tight line-clamp-2">{game.title}</div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" /> {game.hours}h
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
