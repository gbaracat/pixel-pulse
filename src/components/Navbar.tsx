import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, Gamepad2, LogOut } from "lucide-react";
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
  const initials = (user?.user_metadata?.full_name || user?.email || "P1")
    .toString()
    .slice(0, 2)
    .toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

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
          {user && (
            <Link to="/profile" activeProps={{ className: "text-foreground text-glow-purple" }} className="hover:text-foreground transition">Minha Lista</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-full bg-secondary/60 border border-border/60 w-56">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Buscar jogo, gênero..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/60"
            />
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
