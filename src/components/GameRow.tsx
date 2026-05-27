import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { GameCard } from "./GameCard";
import type { Game } from "@/data/games";

export function GameRow({ title, games, slug }: { title: string; games: Game[]; slug?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-4 sm:px-6 gap-4">
        <div className="flex items-baseline gap-3 min-w-0">
          <h2 className="font-display text-sm sm:text-base text-glow-purple truncate">{title}</h2>
          {slug && (
            <Link
              to="/categories/$slug"
              params={{ slug }}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-display text-neon-cyan hover:text-glow-cyan transition shrink-0"
            >
              VER TODOS <ArrowRight className="size-3" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {slug && (
            <Link
              to="/categories/$slug"
              params={{ slug }}
              className="sm:hidden text-[11px] font-display text-neon-cyan"
            >
              VER TODOS →
            </Link>
          )}
          <div className="hidden sm:flex gap-1">
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="size-8 grid place-items-center rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 hover:glow-purple transition">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => scroll(1)} aria-label="Próximo" className="size-8 grid place-items-center rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 hover:glow-purple transition">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2 snap-x">
        {games.map((g) => (
          <div key={g.id} className="snap-start">
            <GameCard game={g} />
          </div>
        ))}
      </div>
    </section>
  );
}
