import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { categories, getCategory, getGame, type Game } from "@/data/games";
import { GameCard } from "@/components/GameCard";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.title} — Pixel Store` },
          { name: "description", content: loaderData.category.subtitle ?? `Explore ${loaderData.category.title} no Pixel Store.` },
          { property: "og:title", content: `${loaderData.category.title} — Pixel Store` },
          { property: "og:description", content: loaderData.category.subtitle ?? "" },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="pt-32 text-center px-4">
      <div className="font-display text-neon-pink text-glow-pink">404 — CATEGORIA NÃO ENCONTRADA</div>
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
  component: CategoryPage,
});

const PAGE_SIZE = 12;

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const allGames = useMemo(
    () => category.ids.map((id) => getGame(id)!).filter(Boolean),
    [category]
  );

  const [query, setQuery] = useState("");
  const [diff, setDiff] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const genres = useMemo(() => Array.from(new Set(allGames.map((g) => g.genre))), [allGames]);

  const filtered = useMemo(() => {
    return allGames.filter((g: Game) => {
      if (diff && g.difficulty !== diff) return false;
      if (genre && g.genre !== genre) return false;
      if (query && !`${g.title} ${g.tags.join(" ")} ${g.genre}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [allGames, diff, genre, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onFilterChange = () => setPage(1);

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan">
        <ArrowLeft className="size-3" /> Voltar à home
      </Link>

      <header className="space-y-2">
        <div className="font-display text-xs text-neon-cyan">CATEGORIA</div>
        <h1 className="font-display text-3xl sm:text-5xl text-glow-pink leading-tight">{category.title}</h1>
        {category.subtitle && <p className="text-muted-foreground max-w-2xl">{category.subtitle}</p>}
        <div className="text-xs text-muted-foreground pt-2">
          {filtered.length} de {allGames.length} jogo{allGames.length === 1 ? "" : "s"}
        </div>
      </header>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3 h-11 rounded-lg bg-secondary/60 border border-border focus-within:border-neon-pink focus-within:glow-pink transition">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); onFilterChange(); }}
            placeholder="Pesquisar dentro da categoria..."
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill active={diff === null} onClick={() => { setDiff(null); onFilterChange(); }}>Toda dificuldade</FilterPill>
          {(["easy", "medium", "hard"] as const).map((d) => (
            <FilterPill key={d} active={diff === d} onClick={() => { setDiff(diff === d ? null : d); onFilterChange(); }}>
              {d === "easy" ? "Tranquilo" : d === "medium" ? "Equilibrado" : "Sem piedade"}
            </FilterPill>
          ))}
        </div>

        {genres.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <FilterPill active={genre === null} onClick={() => { setGenre(null); onFilterChange(); }}>Todos gêneros</FilterPill>
            {genres.map((gn) => (
              <FilterPill key={gn} active={genre === gn} onClick={() => { setGenre(genre === gn ? null : gn); onFilterChange(); }}>{gn}</FilterPill>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <div className="font-display text-neon-pink">GAME OVER</div>
          <p className="text-muted-foreground text-sm mt-2">Nenhum jogo combina com esses filtros.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pageItems.map((g) => (
            <motion.div key={g.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="[&>a]:!w-full">
                <GameCard game={g} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 h-9 rounded-md bg-secondary/60 border border-border text-sm disabled:opacity-40 hover:border-neon-purple transition"
          >
            ← Anterior
          </button>
          <div className="font-display text-xs text-neon-cyan px-3">
            {safePage} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 h-9 rounded-md bg-secondary/60 border border-border text-sm disabled:opacity-40 hover:border-neon-purple transition"
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Other categories */}
      <section className="pt-12 space-y-4 border-t border-border/40">
        <h2 className="font-display text-sm text-glow-purple">Outras Categorias</h2>
        <div className="flex flex-wrap gap-2">
          {categories.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="px-3 h-9 grid place-items-center rounded-full border border-border text-xs text-muted-foreground hover:border-neon-pink hover:text-neon-pink transition"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-9 rounded-full border text-xs font-medium transition ${
        active
          ? "border-neon-cyan text-neon-cyan glow-cyan bg-neon-cyan/5"
          : "border-border text-muted-foreground hover:border-neon-purple hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
