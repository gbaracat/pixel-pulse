import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, Globe, Lock, ArrowLeft, Pencil, Trash2, X, Save } from "lucide-react";
import { games } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { usePublicList, useUpdateList, useDeleteList, useToggleListItem } from "@/hooks/use-lists";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = usePublicList(id);
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const toggleItem = useToggleListItem();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (data?.list) {
      setTitle(data.list.title);
      setDescription(data.list.description ?? "");
      setIsPublic(data.list.is_public);
    }
  }, [data?.list?.id]);

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
  const listGames = items.map((it) => games.find((g) => g.id === it.game_id)).filter(Boolean) as typeof games;
  const ownerName = owner?.display_name || owner?.username || "Usuário";
  const isOwner = !!user && user.id === list.user_id;

  const saveEdit = async () => {
    if (!title.trim()) return;
    await updateList.mutateAsync({ id: list.id, title: title.trim(), description: description.trim() || null, is_public: isPublic });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Deletar a lista "${list.title}"?`)) return;
    await deleteList.mutateAsync(list.id);
    navigate({ to: "/lists" });
  };

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
      <Link to={isOwner ? "/lists" : "/"} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan">
        <ArrowLeft className="size-3" /> Voltar
      </Link>

      <header className="space-y-3 border-b border-border pb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="font-display text-xs text-neon-cyan inline-flex items-center gap-2">
            {list.is_public ? <Globe className="size-3" /> : <Lock className="size-3" />}
            LISTA {list.is_public ? "PÚBLICA" : "PRIVADA"}
          </div>
          {isOwner && !editing && (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-xs border border-border hover:border-neon-cyan transition">
                <Pencil className="size-3" /> Editar
              </button>
              <button onClick={handleDelete} className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-xs border border-border hover:border-destructive hover:text-destructive transition">
                <Trash2 className="size-3" /> Deletar
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="w-full h-12 px-3 rounded-md bg-background border border-border outline-none focus:border-neon-pink font-display text-xl"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
              rows={3}
              maxLength={500}
              className="w-full p-3 rounded-md bg-background border border-border outline-none focus:border-neon-pink resize-none"
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-neon-pink" />
              Pública
            </label>
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={updateList.isPending} className="inline-flex items-center gap-1 h-10 px-4 rounded-md bg-foreground text-background font-semibold disabled:opacity-50">
                <Save className="size-3" /> Salvar
              </button>
              <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1 h-10 px-4 rounded-md text-sm text-muted-foreground hover:text-foreground">
                <X className="size-3" /> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl sm:text-4xl text-glow-pink">{list.title}</h1>
            {list.description && <p className="text-muted-foreground max-w-2xl whitespace-pre-line">{list.description}</p>}
          </>
        )}

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
        <div className="text-center py-20 border border-dashed border-border rounded-xl space-y-3">
          <div className="font-display text-muted-foreground">LISTA VAZIA</div>
          {isOwner && (
            <p className="text-sm text-muted-foreground">Vá em <Link to="/discover" className="text-neon-cyan underline">Descobrir</Link> e adicione jogos a esta lista.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listGames.map((g) => (
            <div key={g.id} className="relative group [&>a]:!w-full">
              <GameCard game={g} />
              {isOwner && (
                <button
                  onClick={() => toggleItem.mutate({ listId: list.id, gameId: g.id, on: false })}
                  className="absolute top-2 right-2 size-8 grid place-items-center rounded-full bg-background/80 backdrop-blur text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition"
                  aria-label="Remover da lista"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
