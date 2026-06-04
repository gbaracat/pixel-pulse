import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Star, ListIcon, UserPlus, Users, Globe } from "lucide-react";
import { useFeed, type FeedItem, type FeedProfile } from "@/hooks/use-feed";
import { useAuth } from "@/hooks/use-auth";
import { games } from "@/data/games";

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
        <p className="text-sm text-muted-foreground">Acompanhe reviews, listas e quem está seguindo quem.</p>
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
        <ul className="space-y-3">
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

function ProfileLink({ p, fallbackId }: { p: FeedProfile | undefined; fallbackId: string }) {
  const name = p?.display_name || p?.username || "Player";
  const slug = p?.username || fallbackId;
  return (
    <Link to="/u/$username" params={{ username: slug }} className="inline-flex items-center gap-2 group">
      <div className="size-7 rounded-full overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center text-[10px] font-display text-background">
        {p?.avatar_url ? <img src={p.avatar_url} alt={name} className="size-full object-cover" /> : name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-sm font-medium group-hover:text-neon-cyan transition">{name}</span>
    </Link>
  );
}

function FeedRow({ item, profiles }: { item: FeedItem; profiles: Map<string, FeedProfile> }) {
  const p = profiles.get(item.user_id);
  return (
    <li className="rounded-xl border border-border bg-card p-4 hover:border-neon-cyan/40 transition">
      <div className="flex items-center justify-between gap-2 mb-3">
        <ProfileLink p={p} fallbackId={item.user_id} />
        <span className="text-[11px] text-muted-foreground">{timeAgo(item.created_at)}</span>
      </div>
      {item.kind === "review" && <ReviewItem item={item} />}
      {item.kind === "list" && <ListItem item={item} />}
      {item.kind === "follow" && <FollowItem item={item} profiles={profiles} />}
    </li>
  );
}

function ReviewItem({ item }: { item: Extract<FeedItem, { kind: "review" }> }) {
  const game = games.find((g) => g.id === item.game_id);
  return (
    <div className="flex gap-3">
      {game && (
        <Link to="/games/$id" params={{ id: game.id }} className="shrink-0">
          <img src={game.cover} alt={game.title} className="w-16 h-20 object-cover rounded-md border border-border" />
        </Link>
      )}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="text-sm">
          Avaliou{" "}
          {game ? (
            <Link to="/games/$id" params={{ id: game.id }} className="font-semibold hover:text-neon-cyan">
              {game.title}
            </Link>
          ) : (
            <span className="font-semibold">{item.game_id}</span>
          )}
        </div>
        <div className="inline-flex items-center gap-1 text-xs font-display text-neon-cyan">
          <Star className="size-3.5 fill-neon-cyan text-neon-cyan" />
          {item.rating}/10
        </div>
        {item.body && <p className="text-sm text-foreground/90 line-clamp-3">{item.body}</p>}
      </div>
    </div>
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
      <ProfileLink p={target} fallbackId={item.target_user_id} />
    </div>
  );
}
