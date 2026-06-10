import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Filter, X } from "lucide-react";
import { games, modernCategories, getGame, type Game } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { GameRow } from "@/components/GameRow";
import { MoodAssistant } from "@/components/MoodAssistant";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Descobrir Jogos — Pixel Store" },
      { name: "description", content: "IA de recomendação, tendências e filtros avançados para descobrir seu próximo jogo." },
    ],
  }),
  component: Discover,
});

const allDifficulties = [
  { id: "easy", label: "Fácil" },
  { id: "medium", label: "Médio" },
  { id: "hard", label: "Difícil" },
] as const;

const allGenres = Array.from(new Set(games.map((g) => g.genre))).sort();
const allPlatforms = Array.from(new Set(games.flatMap((g) => g.platforms))).sort();
const years = games.map((g) => g.year);
const MIN_YEAR = Math.min(...years);
const MAX_YEAR = Math.max(...years);

function Discover() {
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [diff, setDiff] = useState<string | null>(null);
  const [yearFrom, setYearFrom] = useState<number>(MIN_YEAR);
  const [multiOnly, setMultiOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [query, setQuery] = useState("");

  const filtersActive = Boolean(
    genre || platform || diff || multiOnly || query || yearFrom > MIN_YEAR || minRating > 0,
  );

  const results = useMemo(() => {
    return games.filter((g: Game) => {
      if (genre && g.genre !== genre) return false;
      if (platform && !g.platforms.includes(platform)) return false;
      if (diff && g.difficulty !== diff) return false;
      if (g.year < yearFrom) return false;
      if (minRating && g.rating < minRating) return false;
      if (multiOnly && !/multiplayer|co-?op|pvp|online|battle royale/i.test(`${g.tags.join(" ")} ${g.genre}`)) return false;
      if (query && !`${g.title} ${g.tags.join(" ")} ${g.genre}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [genre, platform, diff, yearFrom, multiOnly, minRating, query]);

  const reset = () => {
    setGenre(null); setPlatform(null); setDiff(null);
    setYearFrom(MIN_YEAR); setMultiOnly(false); setMinRating(0); setQuery("");
  };

  return (
    <div className="pt-24 pb-16 space-y-12">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 space-y-3">
        <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
          <Sparkles className="size-3" /> DESCOBRIR
        </div>
        <h1 className="font-display text-2xl sm:text-4xl text-glow-pink leading-tight">
          O que jogar a seguir.
        </h1>
        <p className="text-muted-foreground max-w-xl">
          A IA pensa por você ou use os filtros avançados — combine gênero, plataforma, ano, dificuldade e mais.
        </p>
      </header>

      {/* 1. IA no topo */}
      <MoodAssistant />

      {/* 2. Tendências curadas */}
      <div className="space-y-12 -mx-0">
        {modernCategories.map((c) => {
          const list = c.ids.map((id) => getGame(id)!).filter(Boolean);
          if (list.length === 0) return null;
          return <GameRow key={c.slug} slug={c.slug} title={c.title} games={list} />;
        })}
      </div>

      {/* 3. Filtros avançados */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h2 className="font-display text-xl text-glow-cyan inline-flex items-center gap-2">
              <Filter className="size-4" /> Filtros avançados
            </h2>
            <p className="text-sm text-muted-foreground">Combine quantos quiser. Reset a qualquer momento.</p>
          </div>
          {filtersActive && (
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-neon-pink hover:text-glow-pink">
              <X className="size-3" /> Limpar tudo
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, tag, gênero..."
            className="w-full h-11 px-4 rounded-md bg-background border border-border focus:border-neon-cyan outline-none transition"
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <FilterGroup label="Gênero">
              <Select value={genre} onChange={setGenre} options={allGenres} />
            </FilterGroup>
            <FilterGroup label="Plataforma">
              <Select value={platform} onChange={setPlatform} options={allPlatforms} />
            </FilterGroup>
          </div>

          <FilterGroup label="Dificuldade">
            <div className="flex flex-wrap gap-2">
              {allDifficulties.map((d) => (
                <Chip key={d.id} active={diff === d.id} onClick={() => setDiff(diff === d.id ? null : d.id)}>
                  {d.label}
                </Chip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label={`Lançado a partir de ${yearFrom}`}>
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearFrom}
              onChange={(e) => setYearFrom(Number(e.target.value))}
              className="w-full accent-neon-pink"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-display">
              <span>{MIN_YEAR}</span><span>{MAX_YEAR}</span>
            </div>
          </FilterGroup>

          <FilterGroup label={`Nota mínima: ${minRating === 0 ? "qualquer" : minRating.toFixed(1)}`}>
            <input
              type="range"
              min={0}
              max={9.5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </FilterGroup>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={multiOnly} onChange={(e) => setMultiOnly(e.target.checked)} className="accent-neon-pink size-4" />
            Só multiplayer / co-op
          </label>
        </div>

        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-sm text-glow-purple">
            {results.length} resultado{results.length === 1 ? "" : "s"}
          </h3>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <div className="font-display text-neon-pink">GAME OVER</div>
            <p className="text-muted-foreground text-sm mt-2">Nenhum jogo combina com esses filtros.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((g) => (
              <motion.div key={g.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="[&>a]:!w-full">
                  <GameCard game={g} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-9 rounded-full border text-xs font-medium transition ${
        active
          ? "border-neon-pink bg-neon-pink/15 text-neon-pink glow-pink"
          : "border-border text-muted-foreground hover:border-neon-purple hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Select({ value, onChange, options }: { value: string | null; onChange: (v: string | null) => void; options: string[] }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full h-10 px-3 rounded-md bg-background border border-border focus:border-neon-cyan outline-none text-sm"
    >
      <option value="">Todos</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
