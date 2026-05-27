import { Link } from "@tanstack/react-router";
import { Search, User, Gamepad2 } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="size-8 rounded-md grid place-items-center bg-gradient-to-br from-neon-purple to-neon-pink glow-purple">
            <Gamepad2 className="size-4 text-background" />
          </div>
          <span className="font-display text-xs sm:text-sm text-glow-pink">PIXEL<span className="text-neon-cyan">STORE</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Home</Link>
          <Link to="/discover" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Descobrir</Link>
          <Link to="/profile" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Perfil</Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-full bg-secondary/60 border border-border/60 w-56">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Buscar jogo, gênero..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/60"
            />
          </div>
          <Link to="/profile" className="size-9 rounded-full grid place-items-center bg-gradient-to-br from-neon-pink to-neon-purple glow-pink">
            <User className="size-4 text-background" />
          </Link>
        </div>
      </div>
    </header>
  );
}
