import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Star, ListIcon, UserPlus, Users, Globe, Heart, Gamepad2, Trophy, Bookmark, XCircle } from "lucide-react";
import { useFeed, type FeedItem, type FeedProfile } from "@/hooks/use-feed";
import { useAuth } from "@/hooks/use-auth";
import { games } from "@/data/games";
import { useEnrichedGame } from "@/hooks/use-enriched-games";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed da Comunidade — Pixel Store" },
      { name: "description", content: "Reviews, listas e atividade dos gamers que você segue." },
    ],
  }),
  component: FeedPage,
});

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

function FeedPage() {
  const { user } = useAuth();
  const [scope, setScope] = useState<"global" | "following">("global");
  const { data, isLoading } = useFeed(scope);

  return (
    <div className="pt-24 pb-16 mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
      <div className="space-y-1">
        <div className="font-display text-xs text-neon-cyan">COMUNIDADE</div>
        <h1 className="font-display text-3xl sm:text-4xl text-glow-pink">Feed</h1>
        <p className="text-sm text-muted-foreground">Reviews, listas e quem está jogando o quê.</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        <TabButton active={scope === "global"} onClick={() => setScope("global")} icon={<Globe className="size-3.5" />}>
          Global
        </TabButton>
        <TabButton active={scope === "following"} onClick={() => setScope("following")} icon={<Users className="size-3.5" />}>
          Seguindo
        </TabButton>
      </div>

      {scope === "following" && !user ? (
        <EmptyState>
          <Link to="/login" className="text-neon-cyan underline">Entre</Link> para ver atualizações de quem você segue.
        </EmptyState>
      ) : isLoading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="size-6 animate-spin text-neon-pink" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState>
          {scope === "following"
            ? "Você ainda não segue ninguém. Explore o feed global para descobrir gamers."
            : "Nenhuma atividade ainda. Seja o primeiro a publicar uma review."}
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {data.items.map((item) => (
            <FeedRow key={`${item.kind}-${item.id}`} item={item} profiles={data.profiles} />
          ))}
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

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function ProfileChip({ p, fallbackId, size = "sm" }: { p: FeedProfile | undefined; fallbackId: string; size?: "sm" | "md" }) {
  const name = p?.display_name || p?.username || "Player";
  const slug = p?.username || fallbackId;
  const dim = size === "md" ? "size-9 text-xs" : "size-7 text-[10px]";
  return (
    <Link to="/u/$username" params={{ username: slug }} className="inline-flex items-center gap-2 group min-w-0">
      <div className={`${dim} rounded-full overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center font-display text-background shrink-0`}>
        {p?.avatar_url ? <img src={p.avatar_url} alt={name} className="size-full object-cover" /> : name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-sm font-medium group-hover:text-neon-cyan transition truncate">{name}</span>
    </Link>
  );
}

function FeedRow({ item, profiles }: { item: FeedItem; profiles: Map<string, FeedProfile> }) {
  const p = profiles.get(item.user_id);

  // Reviews ganham card visual grande estilo Letterboxd
  if (item.kind === "review") return <ReviewCardBig item={item} profile={p} time={timeAgo(item.created_at)} />;
  if (item.kind === "status") return <StatusCardBig item={item} profile={p} time={timeAgo(item.created_at)} />;

  return (
    <li className="rounded-xl border border-border bg-card p-4 hover:border-neon-cyan/40 transition">
      <div className="flex items-center justify-between gap-2 mb-3">
        <ProfileChip p={p} fallbackId={item.user_id} />
        <span className="text-[11px] text-muted-foreground">{timeAgo(item.created_at)}</span>
      </div>
      {item.kind === "list" && <ListItem item={item} />}
      {item.kind === "follow" && <FollowItem item={item} profiles={profiles} />}
    </li>
  );
}

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  favorite: { label: "favoritou", icon: <Heart className="size-3.5 fill-current" />, color: "text-neon-pink", bg: "bg-neon-pink/15 border-neon-pink/40" },
  playing: { label: "começou a jogar", icon: <Gamepad2 className="size-3.5" />, color: "text-neon-cyan", bg: "bg-neon-cyan/15 border-neon-cyan/40" },
  completed: { label: "zerou", icon: <Trophy className="size-3.5" />, color: "text-neon-cyan", bg: "bg-neon-cyan/15 border-neon-cyan/40" },
  wishlist: { label: "adicionou à wishlist", icon: <Bookmark className="size-3.5" />, color: "text-neon-purple", bg: "bg-neon-purple/15 border-neon-purple/40" },
  abandoned: { label: "abandonou", icon: <XCircle className="size-3.5" />, color: "text-muted-foreground", bg: "bg-muted/30 border-border" },
};

function GameCover({ gameId, className = "" }: { gameId: string; className?: string }) {
  const game = games.find((g) => g.id === gameId);
  const enriched = useEnrichedGame(gameId);
  if (!game) return null;
  const cover = enriched?.cover ?? game.cover;
  return (
    <Link to="/games/$id" params={{ id: gameId }} className={`block shrink-0 overflow-hidden rounded-lg border border-border hover:border-neon-cyan/50 transition ${className}`}>
      <img src={cover} alt={game.title} className="size-full object-cover" loading="lazy" />
    </Link>
  );
}

function ReviewCardBig({ item, profile, time }: { item: Extract<FeedItem, { kind: "review" }>; profile: FeedProfile | undefined; time: string }) {
  const game = games.find((g) => g.id === item.game_id);
  return (
    <li className="rounded-xl overflow-hidden border border-border bg-card hover:border-neon-pink/40 transition">
      <div className="flex">
        <GameCover gameId={item.game_id} className="w-28 sm:w-36 aspect-[3/4] rounded-none border-0 border-r border-border" />
        <div className="flex-1 min-w-0 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <ProfileChip p={profile} fallbackId={item.user_id} />
            <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
          </div>
          {game && (
            <Link to="/games/$id" params={{ id: game.id }} className="block">
              <div className="font-display text-base sm:text-lg text-foreground hover:text-neon-cyan transition truncate">{game.title}</div>
              <div className="text-[10px] text-muted-foreground font-display">{game.year} · {game.genre}</div>
            </Link>
          )}
          <div className="inline-flex items-center gap-1 text-sm font-display text-neon-cyan">
            <Star className="size-4 fill-neon-cyan text-neon-cyan" />
            <span className="text-glow-cyan">{item.rating}</span>
            <span className="text-muted-foreground">/10</span>
          </div>
          {item.body && <p className="text-sm text-foreground/85 line-clamp-3 italic">"{item.body}"</p>}
        </div>
      </div>
    </li>
  );
}

function StatusCardBig({ item, profile, time }: { item: Extract<FeedItem, { kind: "status" }>; profile: FeedProfile | undefined; time: string }) {
  const game = games.find((g) => g.id === item.game_id);
  const meta = STATUS_META[item.status] ?? STATUS_META.playing;
  return (
    <li className="rounded-xl overflow-hidden border border-border bg-card hover:border-neon-purple/40 transition">
      <div className="flex">
        <GameCover gameId={item.game_id} className="w-24 sm:w-28 aspect-[3/4] rounded-none border-0 border-r border-border" />
        <div className="flex-1 min-w-0 p-4 flex flex-col justify-center gap-2">
          <div className="flex items-center justify-between gap-2">
            <ProfileChip p={profile} fallbackId={item.user_id} />
            <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2 h-6 w-fit rounded-full border text-[11px] font-display ${meta.bg} ${meta.color}`}>
            {meta.icon} {meta.label.toUpperCase()}
          </div>
          {game && (
            <Link to="/games/$id" params={{ id: game.id }} className="font-display text-base hover:text-neon-cyan transition truncate">
              {game.title}
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function ListItem({ item }: { item: Extract<FeedItem, { kind: "list" }> }) {
  return (
    <Link to="/lists/$id" params={{ id: item.id }} className="block group">
      <div className="flex items-start gap-3">
        <div className="size-12 grid place-items-center rounded-md bg-neon-purple/15 border border-neon-purple/30 shrink-0">
          <ListIcon className="size-5 text-neon-purple" />
        </div>
        <div className="min-w-0">
          <div className="text-sm">Criou uma lista</div>
          <div className="font-semibold group-hover:text-neon-cyan transition truncate">{item.title}</div>
          {item.description && <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>}
        </div>
      </div>
    </Link>
  );
}

function FollowItem({ item, profiles }: { item: Extract<FeedItem, { kind: "follow" }>; profiles: Map<string, FeedProfile> }) {
  const target = profiles.get(item.target_user_id);
  return (
    <div className="flex items-center gap-2 text-sm">
      <UserPlus className="size-4 text-neon-cyan" />
      <span>Começou a seguir</span>
      <ProfileChip p={target} fallbackId={item.target_user_id} />
    </div>
  );
}
