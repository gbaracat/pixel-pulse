import { Heart, Bookmark, Trophy, Gamepad2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useGameLists, useToggleListStatus, type ListStatus } from "@/hooks/use-game-lists";
import { cn } from "@/lib/utils";

type Variant = "icons" | "full";

const config: { status: ListStatus; icon: React.ComponentType<{ className?: string }>; label: string; activeClass: string }[] = [
  { status: "favorite", icon: Heart, label: "Favoritar", activeClass: "text-neon-pink border-neon-pink bg-neon-pink/10" },
  { status: "wishlist", icon: Bookmark, label: "Wishlist", activeClass: "text-neon-cyan border-neon-cyan bg-neon-cyan/10" },
  { status: "playing", icon: Gamepad2, label: "Jogando", activeClass: "text-neon-purple border-neon-purple bg-neon-purple/10" },
  { status: "completed", icon: Trophy, label: "Zerado", activeClass: "text-yellow-400 border-yellow-400/60 bg-yellow-400/10" },
];

export function GameActions({ gameId, variant = "full" }: { gameId: string; variant?: Variant }) {
  const { user } = useAuth();
  const { data: lists } = useGameLists();
  const toggle = useToggleListStatus();
  const navigate = useNavigate();

  const has = (s: ListStatus) => !!lists?.some((r) => r.game_id === gameId && r.status === s);

  const handleClick = (e: React.MouseEvent, status: ListStatus) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    toggle.mutate({ gameId, status, on: !has(status) });
  };

  if (variant === "icons") {
    return (
      <div className="flex gap-1">
        {config.slice(0, 2).map(({ status, icon: Icon, activeClass }) => {
          const active = has(status);
          return (
            <button
              key={status}
              onClick={(e) => handleClick(e, status)}
              className={cn(
                "size-8 grid place-items-center rounded-md border border-border/60 bg-background/80 backdrop-blur hover:scale-110 transition",
                active && activeClass
              )}
              aria-label={status}
            >
              <Icon className={cn("size-3.5", active && "fill-current")} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {config.map(({ status, icon: Icon, label, activeClass }) => {
        const active = has(status);
        return (
          <button
            key={status}
            onClick={(e) => handleClick(e, status)}
            disabled={toggle.isPending}
            className={cn(
              "inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border bg-secondary/80 hover:border-neon-cyan transition text-sm",
              active && activeClass
            )}
          >
            <Icon className={cn("size-4", active && "fill-current")} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
