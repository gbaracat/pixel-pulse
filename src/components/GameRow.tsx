import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "./GameCard";
import type { Game } from "@/data/games";

export function GameRow({ title, games }: { title: string; games: Game[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-4 sm:px-6">
        <h2 className="font-display text-sm sm:text-base text-glow-purple">{title}</h2>
        <div className="hidden sm:flex gap-1">
          <button onClick={() => scroll(-1)} className="size-8 grid place-items-center rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 hover:glow-purple transition">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => scroll(1)} className="size-8 grid place-items-center rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 hover:glow-purple transition">
            <ChevronRight className="size-4" />
          </button>
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
