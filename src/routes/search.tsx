import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Gamepad2, Users, Loader2 } from "lucide-react";
import { z } from "zod";
import { games } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { useUserSearch } from "@/hooks/use-user-search";

const searchSchema = z.object({
  q: z.string().optional().default(""),
  tab: z.enum(["games", "users"]).optional().default("games"),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Buscar — Pixel Store" },
      { name: "description", content: "Busque jogos, gêneros, tags e usuários da comunidade Pixel Store." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const navigate = useNavigate({ from: "/search" });
  const { q: urlQ, tab } = Route.useSearch();
  const [query, setQuery] = useState(urlQ);

  const setTab = (t: "games" | "users") => navigate({ search: { q: urlQ, tab: t } });
  const commit = (value: string) =>
    navigate({ search: { q: value, tab }, replace: true });

  const trimmed = urlQ.trim().toLowerCase();
  const gameResults = useMemo(() => {
    if (!trimmed) return [];
    return games.filter((g) =>
      `${g.title} ${g.genre} ${g.tags.join(" ")} ${g.platforms.join(" ")}`
        .toLowerCase()
        .includes(trimmed),
    );
  }, [trimmed]);

  const { data: users, isLoading: usersLoading } = useUserSearch(urlQ);

  return (
    <div className="pt-24 pb-16 mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
      <div className="space-y-2">
        <div className="font-display text-xs text-neon-cyan">BUSCAR</div>
        <h1 className="font-display text-3xl sm:text-4xl text-glow-pink">Encontre tudo</h1>
        <p className="text-sm text-muted-foreground">Jogos, gêneros, tags e gamers da comunidade.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); commit(query); }}
        className="flex items-center gap-2 px-4 h-12 rounded-full bg-secondary/60 border border-border focus-within:border-neon-pink focus-within:glow-pink transition"
      >
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por jogo, gênero, tag ou usuário..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <button type="submit" className="font-display text-[11px] text-neon-cyan hover:text-glow-pink">
          BUSCAR
        </button>
      </form>

      <div className="flex gap-1 border-b border-border">
        <TabButton active={tab === "games"} onClick={() => setTab("games")} icon={<Gamepad2 className="size-3.5" />}>
          Jogos {trimmed && `(${gameResults.length})`}
        </TabButton>
        <TabButton active={tab === "users"} onClick={() => setTab("users")} icon={<Users className="size-3.5" />}>
          Usuários {trimmed && users && `(${users.length})`}
        </TabButton>
      </div>

      {!trimmed ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Digite algo para começar a busca.
        </div>
      ) : tab === "games" ? (
        gameResults.length === 0 ? (
          <Empty>Nenhum jogo combina com "{urlQ}".</Empty>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gameResults.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        )
      ) : usersLoading ? (
        <div className="grid place-items-center py-16"><Loader2 className="size-6 animate-spin text-neon-pink" /></div>
      ) : !users || users.length === 0 ? (
        <Empty>Nenhum usuário encontrado para "{urlQ}".</Empty>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {users.map((u) => {
            const name = u.display_name || u.username || "Player";
            const slug = u.username || u.id;
            return (
              <li key={u.id}>
                <Link
                  to="/u/$username"
                  params={{ username: slug }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-neon-cyan/50 transition"
                >
                  <div className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center text-xs font-display text-background shrink-0">
                    {u.avatar_url ? <img src={u.avatar_url} alt={name} className="size-full object-cover" /> : name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{name}</div>
                    {u.username && <div className="text-xs text-muted-foreground truncate">@{u.username}</div>}
                    {u.bio && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{u.bio}</p>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 h-10 font-display text-[11px] uppercase tracking-wider border-b-2 transition ${
        active ? "text-neon-pink border-neon-pink text-glow-pink" : "text-muted-foreground border-transparent hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{children}</div>;
}
