import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Plus, Globe, Lock, List as ListIcon, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMyLists, useCreateList, useDeleteList } from "@/hooks/use-lists";

export const Route = createFileRoute("/lists/")({
  head: () => ({
    meta: [
      { title: "Minhas Listas — Pixel Store" },
      { name: "description", content: "Crie e gerencie suas listas de jogos: melhores RPGs, jogos curtos, indies, multiplayer e mais." },
    ],
  }),
  component: ListsIndex,
});

function ListsIndex() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: lists, isLoading } = useMyLists();
  const createList = useCreateList();
  const deleteList = useDeleteList();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  if (!user) {
    return (
      <div className="pt-32 text-center px-4 space-y-3">
        <div className="font-display text-neon-pink">FAÇA LOGIN</div>
        <p className="text-muted-foreground">Você precisa entrar para criar e gerenciar listas.</p>
        <Link to="/login" className="inline-block mt-3 px-6 h-11 leading-[44px] rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold">Entrar</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const result = await createList.mutateAsync({ title, description, is_public: isPublic });
    setTitle(""); setDescription(""); setShowForm(false);
    if (result?.id) navigate({ to: "/lists/$id", params: { id: result.id } });
  };

  return (
    <div className="pt-24 pb-16 mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <div className="font-display text-xs text-neon-cyan inline-flex items-center gap-2">
            <ListIcon className="size-3" /> SUAS COLEÇÕES
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-glow-pink">Minhas Listas</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Crie listas como "Melhores RPGs", "Jogos pra Relaxar", "Top 10 Indies". Públicas ganham URL própria pra compartilhar.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold hover:opacity-90 transition glow-pink"
        >
          <Plus className="size-4" /> Nova Lista
        </button>
      </header>

      {showForm && (
        <form onSubmit={submit} className="rounded-xl border border-neon-purple/40 bg-card p-5 space-y-4">
          <div>
            <label className="text-xs font-display text-muted-foreground">TÍTULO</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Melhores RPGs de todos os tempos"
              maxLength={120}
              className="mt-1 w-full h-11 px-3 rounded-md bg-background border border-border outline-none focus:border-neon-pink"
            />
          </div>
          <div>
            <label className="text-xs font-display text-muted-foreground">DESCRIÇÃO (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Por que esses jogos estão juntos?"
              rows={3}
              maxLength={500}
              className="mt-1 w-full p-3 rounded-md bg-background border border-border outline-none focus:border-neon-pink resize-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-neon-pink" />
            Pública (qualquer um com o link pode ver)
          </label>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="h-10 px-4 rounded-md text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
            <button type="submit" disabled={!title.trim() || createList.isPending} className="h-10 px-5 rounded-md bg-foreground text-background font-semibold disabled:opacity-50">
              {createList.isPending ? "Criando..." : "Criar Lista"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-neon-pink" /></div>
      ) : !lists || lists.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <div className="font-display text-muted-foreground mb-2">VOCÊ AINDA NÃO CRIOU NENHUMA LISTA</div>
          <p className="text-sm text-muted-foreground">Clique em "Nova Lista" pra começar.</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {lists.map((l) => (
            <li key={l.id} className="group relative rounded-xl border border-border bg-card hover:border-neon-pink/60 transition">
              <Link to="/lists/$id" params={{ id: l.id }} className="block p-5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base text-foreground line-clamp-1">{l.title}</h3>
                  {l.is_public ? <Globe className="size-3 text-neon-cyan shrink-0" /> : <Lock className="size-3 text-muted-foreground shrink-0" />}
                </div>
                {l.description && <p className="text-sm text-muted-foreground line-clamp-2">{l.description}</p>}
                <div className="text-xs text-muted-foreground pt-1">{l.items_count ?? 0} jogo{(l.items_count ?? 0) === 1 ? "" : "s"}</div>
              </Link>
              <button
                onClick={() => {
                  if (confirm(`Deletar "${l.title}"?`)) deleteList.mutate(l.id);
                }}
                className="absolute top-3 right-3 size-8 grid place-items-center rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition"
                aria-label="Deletar lista"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
