import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Gamepad2, Heart, LogOut, Loader2, Camera, Trash2, Save, X, Pencil, Image as ImageIcon, Plus, ListIcon, Star, Lock, Globe } from "lucide-react";
import { games } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { useAuth } from "@/hooks/use-auth";
import { useGameLists, type ListStatus } from "@/hooks/use-game-lists";
import { useProfile, useUpdateProfile, useUploadAvatar, useRemoveAvatar } from "@/hooks/use-profile";
import { useUploadBanner, useRemoveBanner } from "@/hooks/use-banner";
import { useMyLists, useCreateList, useDeleteList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SteamProfileSection } from "@/components/SteamProfileSection";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Meu Perfil — Pixel Store" },
      { name: "description", content: "Sua biblioteca, listas e estatísticas gamer." },
    ],
  }),
  component: ProfilePage,
});

const tabs: { id: ListStatus; label: string }[] = [
  { id: "playing", label: "Jogando" },
  { id: "completed", label: "Zerados" },
  { id: "wishlist", label: "Wishlist" },
  { id: "favorite", label: "Favoritos" },
  { id: "abandoned", label: "Abandonados" },
];

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<"library" | "lists">("library");
  const [tab, setTab] = useState<ListStatus>("playing");
  const { data: lists, isLoading } = useGameLists();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const uploadBanner = useUploadBanner();
  const removeBanner = useRemoveBanner();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [pendingBanner, setPendingBanner] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [favPickerOpen, setFavPickerOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  if (loading || !user) {
    return (
      <div className="pt-32 grid place-items-center">
        <Loader2 className="size-6 animate-spin text-neon-pink" />
      </div>
    );
  }

  const byStatus = (s: ListStatus) =>
    (lists ?? []).filter((r) => r.status === s).map((r) => games.find((g) => g.id === r.game_id)).filter(Boolean);

  const name = profile?.display_name || (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Player";
  const avatarUrl = preview || profile?.avatar_url || (user.user_metadata?.avatar_url as string | undefined) || null;
  const bannerUrl = bannerPreview || profile?.banner_url || null;
  const favoriteIds = profile?.favorite_game_ids ?? [];
  const favoriteGames = favoriteIds.map((id) => games.find((g) => g.id === id)).filter(Boolean);

  const completedCount = byStatus("completed").length;
  const favoritesCount = byStatus("favorite").length;
  const playingCount = byStatus("playing").length;
  const totalHours = byStatus("completed").reduce((a, g) => a + (g?.hours ?? 0), 0);

  const createdAt = profile?.created_at ? new Date(profile.created_at) : user.created_at ? new Date(user.created_at) : null;

  const onPickFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) return;
    setPendingFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const onPickBanner = (f: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return;
    setPendingBanner(f);
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const onSave = async () => {
    if (pendingFile) {
      await uploadAvatar.mutateAsync(pendingFile);
      setPendingFile(null);
      setPreview(null);
    }
    if (pendingBanner) {
      await uploadBanner.mutateAsync(pendingBanner);
      setPendingBanner(null);
      setBannerPreview(null);
    }
    await updateProfile.mutateAsync({
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    });
    setEditing(false);
  };

  const onCancel = () => {
    setDisplayName(profile?.display_name ?? "");
    setBio(profile?.bio ?? "");
    setPreview(null);
    setPendingFile(null);
    setBannerPreview(null);
    setPendingBanner(null);
    setEditing(false);
  };

  const toggleFavorite = (gameId: string) => {
    const current = profile?.favorite_game_ids ?? [];
    const exists = current.includes(gameId);
    let next: string[];
    if (exists) next = current.filter((id) => id !== gameId);
    else {
      if (current.length >= 4) return;
      next = [...current, gameId];
    }
    updateProfile.mutate({ favorite_game_ids: next });
  };

  const saving = updateProfile.isPending || uploadAvatar.isPending || uploadBanner.isPending;

  return (
    <div className="pb-16">
      {/* ===== Banner ===== */}
      <section className="relative h-[280px] sm:h-[340px] w-full overflow-hidden bg-gradient-to-br from-neon-purple/30 via-background to-neon-pink/20">
        {bannerUrl ? (
          <img src={bannerUrl} alt="Banner" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid-bg opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {editing && (
          <div className="absolute top-24 right-4 flex gap-2 z-10">
            <button
              onClick={() => bannerRef.current?.click()}
              className="px-3 h-9 rounded-md bg-card/90 border border-border hover:border-neon-cyan text-xs font-display inline-flex items-center gap-1.5"
            >
              <ImageIcon className="size-3.5" /> TROCAR BANNER
            </button>
            {(profile?.banner_url || bannerPreview) && (
              <button
                onClick={() => {
                  if (bannerPreview) { setBannerPreview(null); setPendingBanner(null); }
                  else removeBanner.mutate();
                }}
                className="size-9 grid place-items-center rounded-md bg-destructive/90 text-destructive-foreground"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <input
              ref={bannerRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => onPickBanner(e.target.files?.[0] ?? null)}
            />
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-20 relative z-10 space-y-10">
        {/* ===== Header (avatar + info + actions) ===== */}
        <section className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative shrink-0">
            <div className="size-32 sm:size-40 rounded-2xl overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center glow-purple border-4 border-background">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="size-full object-cover" />
              ) : (
                <span className="font-display text-4xl text-background">{name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            {editing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="size-9 rounded-full bg-neon-cyan text-background grid place-items-center hover:scale-110 transition shadow-lg"
                >
                  <Camera className="size-4" />
                </button>
                {(profile?.avatar_url || preview) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (preview) { setPreview(null); setPendingFile(null); }
                      else removeAvatar.mutate();
                    }}
                    className="size-9 rounded-full bg-destructive text-destructive-foreground grid place-items-center hover:scale-110 transition shadow-lg"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                />
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-3 pb-2">
            <div className="font-display text-xs text-neon-cyan">PLAYER ONE</div>
            {editing ? (
              <div className="space-y-3 max-w-xl">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                  <Input
                    value={displayName}
                    maxLength={50}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background/50 border-border focus-visible:ring-neon-pink"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bio</Label>
                  <Textarea
                    value={bio}
                    maxLength={300}
                    rows={3}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-background/50 border-border focus-visible:ring-neon-pink resize-none"
                  />
                  <div className="text-[10px] text-muted-foreground mt-1">{bio.length}/300</div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-3xl sm:text-4xl text-glow-pink">{name}</h1>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                {profile?.bio && <p className="text-foreground/90 text-sm max-w-2xl">{profile.bio}</p>}
                {createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Membro desde {createdAt.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {editing ? (
              <>
                <Button onClick={onSave} disabled={saving} className="bg-neon-pink text-background hover:bg-neon-pink/90">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Salvar
                </Button>
                <Button onClick={onCancel} variant="outline" disabled={saving}>
                  <X className="size-4" /> Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditing(true)} variant="outline" className="border-neon-cyan/40 hover:border-neon-cyan hover:text-neon-cyan">
                  <Pencil className="size-4" /> Editar perfil
                </Button>
                <Button onClick={() => signOut()} variant="ghost" className="hover:text-neon-pink">
                  <LogOut className="size-4" /> Sair
                </Button>
              </>
            )}
          </div>
        </section>

        {/* ===== Stats ===== */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat icon={<Clock className="size-5" />} label="Horas (zerados)" value={`${totalHours}h`} />
          <Stat icon={<Trophy className="size-5" />} label="Concluídos" value={String(completedCount)} />
          <Stat icon={<Gamepad2 className="size-5" />} label="Jogando" value={String(playingCount)} accent />
          <Stat icon={<Heart className="size-5" />} label="Favoritos" value={String(favoritesCount)} />
        </section>

        {/* ===== Favoritos (4 slots) ===== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm text-glow-purple inline-flex items-center gap-2">
              <Star className="size-4 text-neon-cyan" /> JOGOS FAVORITOS
            </h3>
            <button
              onClick={() => setFavPickerOpen((v) => !v)}
              className="text-xs font-display text-neon-cyan hover:text-glow-cyan"
            >
              {favPickerOpen ? "FECHAR" : "EDITAR"}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => {
              const g = favoriteGames[i];
              if (g) {
                return (
                  <div key={i} className="relative group">
                    <Link to="/games/$id" params={{ id: g.id }}>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-neon-cyan/40 hover:border-neon-cyan transition">
                        <img src={g.cover} alt={g.title} className="size-full object-cover group-hover:scale-105 transition" />
                      </div>
                    </Link>
                    <div className="mt-2 text-xs truncate font-display">{g.title}</div>
                  </div>
                );
              }
              return (
                <div key={i} className="aspect-[3/4] rounded-lg border border-dashed border-border grid place-items-center text-muted-foreground/60">
                  <Star className="size-6" />
                </div>
              );
            })}
          </div>
          {favPickerOpen && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="text-xs text-muted-foreground">Escolha até 4 jogos favoritos:</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-72 overflow-y-auto">
                {games.map((g) => {
                  const on = favoriteIds.includes(g.id);
                  const disabled = !on && favoriteIds.length >= 4;
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleFavorite(g.id)}
                      disabled={disabled}
                      className={`relative aspect-[3/4] rounded-md overflow-hidden border transition ${
                        on ? "border-neon-cyan glow-pink" : "border-border hover:border-neon-pink"
                      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                      title={g.title}
                    >
                      <img src={g.cover} alt={g.title} className="size-full object-cover" />
                      {on && (
                        <div className="absolute inset-0 bg-neon-cyan/30 grid place-items-center">
                          <Star className="size-5 fill-neon-cyan text-neon-cyan" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <SteamProfileSection />

        {/* ===== Section switcher: Biblioteca / Listas ===== */}
        <section className="space-y-4">
          <div className="flex gap-1 border-b border-border">
            <button
              onClick={() => setSection("library")}
              className={`px-4 h-10 font-display text-[11px] uppercase tracking-wider border-b-2 transition ${
                section === "library" ? "text-neon-pink border-neon-pink text-glow-pink" : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              Biblioteca
            </button>
            <button
              onClick={() => setSection("lists")}
              className={`px-4 h-10 font-display text-[11px] uppercase tracking-wider border-b-2 transition ${
                section === "lists" ? "text-neon-pink border-neon-pink text-glow-pink" : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              Minhas Listas
            </button>
          </div>

          {section === "library" ? (
            <>
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {tabs.map((t) => {
                  const count = byStatus(t.id).length;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`px-3 h-9 font-display text-[10px] uppercase tracking-wider whitespace-nowrap rounded-md transition ${
                        tab === t.id ? "bg-neon-pink/20 text-neon-pink" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label} <span className="opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>

              {isLoading || profileLoading ? (
                <div className="grid place-items-center py-16"><Loader2 className="size-5 animate-spin text-neon-pink" /></div>
              ) : byStatus(tab).length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border border-dashed border-border rounded-xl">
                  <div className="font-display text-neon-pink">LISTA VAZIA</div>
                  <p className="text-muted-foreground text-sm mt-2">Adicione jogos pelos cards ou pela página do jogo.</p>
                  <Link to="/discover" className="inline-block mt-4 text-neon-cyan hover:underline">Explorar jogos →</Link>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {byStatus(tab).map((g) => g ? <div key={g.id} className="[&>a]:!w-full"><GameCard game={g} /></div> : null)}
                </div>
              )}
            </>
          ) : (
            <ListsPanel />
          )}
        </section>
      </div>
    </div>
  );
}

function ListsPanel() {
  const { data: lists, isLoading } = useMyLists();
  const create = useCreateList();
  const del = useDeleteList();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [pub, setPub] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Crie listas temáticas (ex: "Melhores RPGs de 2024", "Meu top 10 indies").</p>
        <Button onClick={() => setOpen((v) => !v)} variant="outline" className="border-neon-cyan/40">
          <Plus className="size-4" /> Nova lista
        </Button>
      </div>

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            create.mutate(
              { title, description: desc, is_public: pub },
              {
                onSuccess: () => {
                  setTitle(""); setDesc(""); setPub(true); setOpen(false);
                },
              },
            );
          }}
          className="rounded-xl border border-border bg-card p-4 space-y-3"
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da lista" maxLength={120} />
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição (opcional)" rows={2} maxLength={2000} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} />
            Lista pública (visível para outros usuários)
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={create.isPending || !title.trim()} className="bg-neon-pink text-background">
              Criar
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid place-items-center py-12"><Loader2 className="size-5 animate-spin text-neon-pink" /></div>
      ) : !lists || lists.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <ListIcon className="size-8 mx-auto text-muted-foreground mb-2" />
          <div className="font-display text-sm text-muted-foreground">Você ainda não criou listas.</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((l) => (
            <div key={l.id} className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-neon-cyan/40 transition">
              <div className="flex items-start justify-between gap-2">
                <Link to="/lists/$id" params={{ id: l.id }} className="font-display text-base text-glow-pink line-clamp-1 hover:underline">
                  {l.title}
                </Link>
                <button onClick={() => del.mutate(l.id)} className="text-muted-foreground hover:text-neon-pink shrink-0">
                  <Trash2 className="size-4" />
                </button>
              </div>
              {l.description && <p className="text-xs text-muted-foreground line-clamp-2">{l.description}</p>}
              <div className="flex items-center gap-3 text-[10px] font-display text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  {l.is_public ? <Globe className="size-3" /> : <Lock className="size-3" />}
                  {l.is_public ? "PÚBLICA" : "PRIVADA"}
                </span>
                <span>{l.items_count ?? 0} JOGOS</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-border bg-card"}`}>
      <div className={`size-9 rounded-md grid place-items-center mb-3 ${accent ? "bg-neon-cyan/20 text-neon-cyan" : "bg-secondary text-neon-pink"}`}>
        {icon}
      </div>
      <div className="font-display text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold ${accent ? "text-neon-cyan text-glow-cyan" : ""}`}>{value}</div>
    </div>
  );
}
