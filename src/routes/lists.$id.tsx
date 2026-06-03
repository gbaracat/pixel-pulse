import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Globe, Lock, ArrowLeft } from "lucide-react";
import { games } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { usePublicList } from "@/hooks/use-lists";

export const Route = createFileRoute("/lists/$id")({
  head: () => ({
    meta: [
      { title: "Lista — Pixel Store" },
      { name: "description", content: "Lista de jogos curada por um usuário da Pixel Store." },
    ],
  }),
  component: ListPage,
});

function ListPage() {
  const { id } = Route.useParams();
  const { data, isLoading } = usePublicList(id);

  if (isLoading) {
    return <div className="pt-32 grid place-items-center"><Loader2 className="size-6 animate-spin text-neon-pink" /></div>;
  }
  if (!data || !data.list) {
    return (
      <div className="pt-32 text-center px-4">
        <div className="font-display text-neon-pink">LISTA NÃO ENCONTRADA</div>
        <Link to="/" className="text-neon-cyan underline mt-4 inline-block">Voltar à home</Link>
      </div>
    );
  }

  const { list, items, owner } = data;
  const listGames = items.map((it) => games.find((g) => g.id === it.game_id)).filter(Boolean);
  const ownerName = owner?.display_name || owner?.username || "Usuário";

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan">
        <ArrowLeft className="size-3" /> Voltar
      </Link>

      <header className="space-y-3 border-b border-border pb-6">
        <div className="font-display text-xs text-neon-cyan inline-flex items-center gap-2">
          {list.is_public ? <Globe className="size-3" /> : <Lock className="size-3" />}
          LISTA {list.is_public ? "PÚBLICA" : "PRIVADA"}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-glow-pink">{list.title}</h1>
        {list.description && <p className="text-muted-foreground max-w-2xl whitespace-pre-line">{list.description}</p>}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {owner?.avatar_url && (
            <img src={owner.avatar_url} alt={ownerName} className="size-6 rounded-full object-cover border border-border" />
          )}
          <span>por <span className="text-foreground">{ownerName}</span></span>
          <span>·</span>
          <span>{listGames.length} jogo{listGames.length === 1 ? "" : "s"}</span>
        </div>
      </header>

      {listGames.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <div className="font-display text-muted-foreground">LISTA VAZIA</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listGames.map((g) => g ? (
            <div key={g.id} className="[&>a]:!w-full"><GameCard game={g} /></div>
          ) : null)}
        </div>
      )}
    </div>
  );
}
