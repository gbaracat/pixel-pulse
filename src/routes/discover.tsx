import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { games, modernCategories, getGame, type Game } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { GameRow } from "@/components/GameRow";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Descobrir Jogos Modernos — Pixel Store" },
      { name: "description", content: "Tendências, lançamentos e recomendações de jogos modernos: Valorant, Fortnite, Elden Ring, CS2 e mais. Encontre seu próximo jogo pelo humor." },
    ],
  }),
  component: Discover,
});

// Apenas jogos modernos nessa página — a Home é dedicada aos clássicos.
const modernGames = games.filter((g) => g.era === "modern");

const moods = [
  { id: "relaxar", label: "Quero relaxar", emoji: "🌙" },
  { id: "competitivo", label: "Quero competir", emoji: "⚔️" },
  { id: "história", label: "Uma boa história", emoji: "📖" },
  { id: "desafio", label: "Um desafio brutal", emoji: "🔥" },
] as const;

const difficulties = [
  { id: "easy", label: "Tranquilo" },
  { id: "medium", label: "Equilibrado" },
  { id: "hard", label: "Sem piedade" },
] as const;

const genres = Array.from(new Set(modernGames.map((g) => g.genre)));

function Discover() {
  const [mood, setMood] = useState<string | null>(null);
  const [diff, setDiff] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtersActive = Boolean(mood || diff || genre || query);

  const results = useMemo(() => {
    return modernGames.filter((g: Game) => {
      if (mood && !g.mood.includes(mood as Game["mood"][number])) return false;
      if (diff && g.difficulty !== diff) return false;
      if (genre && g.genre !== genre) return false;
      if (query && !`${g.title} ${g.tags.join(" ")} ${g.genre}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [mood, diff, genre, query]);

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
          <Sparkles className="size-3" /> DESCOBRIR · JOGOS MODERNOS
        </div>
        <h1 className="font-display text-2xl sm:text-4xl text-glow-pink leading-tight">
          O que está bombando agora,<br />e o que você devia jogar a seguir.
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Tendências, lançamentos e recomendações personalizadas. Combine humor, dificuldade e gênero — quanto mais filtros, mais preciso o radar.
        </p>
      </header>

      {/* Tendências e categorias modernas */}
      {!filtersActive && (
        <div className="space-y-12 -mx-4 sm:-mx-6">
          {modernCategories.map((c) => {
            const list = c.ids.map((id) => getGame(id)!).filter(Boolean);
            if (list.length === 0) return null;
            return <GameRow key={c.slug} slug={c.slug} title={c.title} games={list} />;
          })}
        </div>
      )}

      {/* Mood Engine */}
      <div className="space-y-8 pt-4 border-t border-border/50">
        <div className="space-y-1">
          <div className="font-display text-xs text-neon-cyan">MOOD ENGINE · v2.0</div>
          <h2 className="font-display text-xl sm:text-2xl text-glow-purple">
            Recomendação personalizada
          </h2>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar por nome, gênero, tag..."
          className="w-full h-12 px-4 rounded-lg bg-secondary/60 border border-border focus:border-neon-pink focus:glow-pink outline-none transition"
        />

        <Section title="Como você está se sentindo?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {moods.map((m) => (
              <Pill key={m.id} active={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)}>
                <span className="text-xl">{m.emoji}</span>
                <span className="text-sm">{m.label}</span>
              </Pill>
            ))}
          </div>
        </Section>

        <Section title="Qual o nível de dor que aguenta hoje?">
          <div className="flex flex-wrap gap-3">
            {difficulties.map((d) => (
              <Pill key={d.id} active={diff === d.id} onClick={() => setDiff(diff === d.id ? null : d.id)}>
                <span className="text-sm">{d.label}</span>
              </Pill>
            ))}
          </div>
        </Section>

        <Section title="Gênero favorito">
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(genre === g ? null : g)}
                className={`px-3 h-9 rounded-full border text-xs font-medium transition ${
                  genre === g
                    ? "border-neon-cyan text-neon-cyan glow-cyan"
                    : "border-border text-muted-foreground hover:border-neon-purple hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Section>

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-sm text-glow-purple">
              {results.length} resultado{results.length === 1 ? "" : "s"}
            </h2>
            {filtersActive && (
              <button
                onClick={() => { setMood(null); setDiff(null); setGenre(null); setQuery(""); }}
                className="text-xs text-neon-pink hover:text-glow-pink"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <div className="font-display text-neon-pink">GAME OVER</div>
              <p className="text-muted-foreground text-sm mt-2">Nenhum jogo combina com esses filtros. Ajuste e tente novamente.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {results.map((g) => (
                <motion.div key={g.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="[&>a]:!w-full">
                    <GameCard game={g} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xs sm:text-sm text-neon-pink">{title}</h2>
      {children}
    </section>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 h-14 rounded-xl border transition text-left ${
        active
          ? "border-neon-pink bg-neon-pink/10 text-foreground glow-pink"
          : "border-border bg-card/60 hover:border-neon-purple hover:bg-card"
      }`}
    >
      {children}
    </button>
  );
}
