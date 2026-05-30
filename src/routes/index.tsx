import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Hero } from "@/components/Hero";
import { GameRow } from "@/components/GameRow";
import { rows, games, getGame } from "@/data/games";
import { useEnrichedGames } from "@/hooks/use-enriched-games";
import { syncAllGames } from "@/lib/sync-rawg.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Store — Descubra jogos retrô e pixel art" },
      { name: "description", content: "Plataforma de descoberta de jogos retrô, arcades e indies pixelados. Recomendações pelo seu humor e estilo de gameplay." },
      { property: "og:title", content: "Pixel Store — Descubra jogos que marcaram gerações" },
      { property: "og:description", content: "Netflix dos gamers retrô. Encontre seu próximo clássico em pixel art." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: enriched, refetch } = useEnrichedGames();
  const syncFn = useServerFn(syncAllGames);
  const triggered = useRef(false);
  const sync = useMutation({
    mutationFn: () => syncFn({ data: {} }),
    onSuccess: (res) => {
      toast.success(`Sincronizado: ${res.ok}/${res.total} jogos da RAWG`);
      refetch();
    },
    onError: (e) => toast.error(`Falha ao sincronizar: ${e instanceof Error ? e.message : "erro"}`),
  });

  // Auto-trigger sync once if DB is empty
  useEffect(() => {
    if (triggered.current) return;
    if (enriched && Object.keys(enriched).length === 0 && !sync.isPending) {
      triggered.current = true;
      toast.info("Carregando dados reais dos jogos...");
      sync.mutate();
    }
  }, [enriched, sync]);

  return (
    <div>
      <Hero />
      <div className="space-y-12 -mt-16 relative z-10 pb-16">
        {rows.map((r) => (
          <GameRow
            key={r.slug}
            slug={r.slug}
            title={r.title}
            games={r.ids.map((id) => getGame(id)!).filter(Boolean)}
          />
        ))}

        {/* Discovery CTA strip */}
        <section className="px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-neon-purple/40 bg-gradient-to-br from-neon-purple/20 via-card to-neon-pink/15 p-8 sm:p-12 glow-purple">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative max-w-2xl space-y-4">
              <div className="font-display text-xs text-neon-cyan">POWERED BY MOOD ENGINE</div>
              <h3 className="font-display text-xl sm:text-3xl text-glow-pink leading-tight">
                Não sabe o que jogar?<br />Deixe o vibe escolher.
              </h3>
              <p className="text-muted-foreground">
                Responda 4 perguntas rápidas sobre seu humor e estilo. Devolvemos uma lista de jogos sob medida.
              </p>
              <a href="/discover" className="inline-flex items-center gap-2 px-6 h-11 rounded-md bg-foreground text-background font-semibold hover:bg-neon-cyan transition">
                Iniciar Recomendação →
              </a>
            </div>
          </div>
        </section>

        {/* All games grid */}
        <section className="px-4 sm:px-6 space-y-4">
          <h2 className="font-display text-sm sm:text-base text-glow-purple">Biblioteca Completa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {games.map((g) => (
              <div key={g.id}>
                <div className="w-full">
                  <GameRowCardWrapper id={g.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { GameCard } from "@/components/GameCard";
function GameRowCardWrapper({ id }: { id: string }) {
  const g = getGame(id);
  if (!g) return null;
  return (
    <div className="[&>a]:!w-full">
      <GameCard game={g} />
    </div>
  );
}
