import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Loader2, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { recommendByMood, MOODS, type Recommendation } from "@/lib/discover.functions";
import { getGame } from "@/data/games";
import { useEnrichedGame } from "@/hooks/use-enriched-games";

function RecCard({ rec }: { rec: Recommendation }) {
  const game = getGame(rec.gameId);
  const enriched = useEnrichedGame(rec.gameId);
  if (!game) return null;
  const cover = enriched?.cover_url ?? game.cover;
  return (
    <Link
      to="/games/$id"
      params={{ id: game.id }}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card hover:border-neon-pink/60 transition glow-pink"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary">
        <img src={cover} alt={game.title} className="size-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
      </div>
      <div className="p-3 space-y-1.5">
        <div className="font-display text-xs text-foreground truncate">{game.title}</div>
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-3">{rec.reason}</p>
      </div>
    </Link>
  );
}

export function MoodAssistant() {
  const fn = useServerFn(recommendByMood);
  const [selected, setSelected] = useState<string[]>([]);
  const mutation = useMutation({
    mutationFn: (moods: string[]) => fn({ data: { moods, useAi: true } }),
  });

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const submit = () => {
    if (selected.length === 0) return;
    mutation.mutate(selected);
  };

  const reset = () => {
    setSelected([]);
    mutation.reset();
  };

  const items = mutation.data?.items ?? [];

  return (
    <section className="px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-neon-purple/40 bg-gradient-to-br from-neon-purple/20 via-card to-neon-pink/15 p-6 sm:p-10 glow-purple">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
              <Sparkles className="size-3" /> RECOMENDAÇÃO INTELIGENTE
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-glow-pink leading-tight">
              Como você quer jogar hoje?
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
              Escolha um ou mais humores. Nossa IA combina seu gosto com o catálogo e devolve recomendações reais com justificativa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = selected.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={`inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm transition ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background/40 border-border hover:border-neon-cyan text-foreground"
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={submit}
              disabled={selected.length === 0 || mutation.isPending}
              className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition glow-pink"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {mutation.isPending ? "Pensando..." : "Recomendar"}
            </button>
            {(mutation.data || selected.length > 0) && (
              <button onClick={reset} className="inline-flex items-center gap-1 h-11 px-4 rounded-md text-sm text-muted-foreground hover:text-foreground transition">
                <RotateCcw className="size-3" /> Limpar
              </button>
            )}
            {mutation.data?.aiUsed === false && mutation.data.items.length > 0 && (
              <span className="text-[11px] text-muted-foreground">Modo curado</span>
            )}
          </div>

          <AnimatePresence>
            {mutation.isError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
                Erro ao gerar recomendações. Tente novamente.
              </motion.div>
            )}
            {items.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4"
              >
                {items.map((rec) => (
                  <RecCard key={rec.gameId} rec={rec} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
