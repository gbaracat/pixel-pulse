import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, Gamepad2, LogOut } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { games } from "@/data/games";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const initials = (user?.user_metadata?.full_name || user?.email || "P1")
    .toString()
    .slice(0, 2)
    .toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return games
      .filter((g) => `${g.title} ${g.genre} ${g.tags.join(" ")}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate({ to: "/search", search: { q, tab: "games" } });
    setQuery("");
    setOpen(false);
  };



  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="size-8 rounded-md grid place-items-center bg-gradient-to-br from-neon-purple to-neon-pink glow-purple">
            <Gamepad2 className="size-4 text-background" />
          </div>
          <span className="font-display text-xs sm:text-sm text-glow-pink">
            <span>PIXEL</span>
            <span className="text-neon-cyan">STORE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Home</Link>
          <Link to="/discover" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Descobrir</Link>
          <Link to="/feed" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Feed</Link>
          {user && (
            <Link to="/lists" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Listas</Link>
          )}
          <Link to="/retro" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Retrô</Link>
          {user && (
            <Link to="/profile" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Minha Lista</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div ref={searchRef} className="hidden sm:block relative">
            <div className={`flex items-center gap-2 px-3 h-9 rounded-full bg-secondary/60 border w-56 transition ${open && query ? "border-neon-pink glow-pink" : "border-border/60"}`}>
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); if (e.key === "Escape") setOpen(false); }}
                placeholder="Buscar jogo, gênero..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/60"
              />
            </div>
            {open && query && (
              <div className="absolute top-11 right-0 w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl z-50">
                {results.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">Nenhum jogo encontrado.</div>
                ) : (
                  <ul className="py-2">
                    {results.map((g) => (
                      <li key={g.id}>
                        <button
                          onClick={() => { navigate({ to: "/games/$id", params: { id: g.id } }); setQuery(""); setOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/60 transition text-left"
                        >
                          <img src={g.cover} alt="" className="size-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{g.title}</div>
                            <div className="text-[11px] text-muted-foreground">{g.genre} · {g.year}</div>
                          </div>
                          <div className="text-xs font-display text-neon-cyan">{g.rating}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={submitSearch}
                  className="w-full px-4 py-2.5 border-t border-border text-xs font-display text-neon-pink hover:bg-secondary/60 transition text-center"
                >
                  Ver todos os resultados de "{query}" →
                </button>
              </div>
            )}

          </div>


          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="size-9 rounded-full overflow-hidden grid place-items-center bg-gradient-to-br from-neon-pink to-neon-purple glow-pink ring-2 ring-transparent hover:ring-neon-cyan transition">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="size-full object-cover" />
                ) : (
                  <span className="text-[10px] font-display text-background">{initials}</span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-display text-xs text-neon-cyan">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <User className="size-4 mr-2" /> Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-neon-pink">
                  <LogOut className="size-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-display text-[11px] glow-pink hover:opacity-90 transition"
            >
              ENTRAR
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
