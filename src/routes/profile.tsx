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
  const [tab, setTab] = useState<ListStatus>("playing");
  const { data: lists, isLoading } = useGameLists();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const completedCount = byStatus("completed").length;
  const favoritesCount = byStatus("favorite").length;
  const playingCount = byStatus("playing").length;
  const totalHours = byStatus("completed").reduce((a, g) => a + (g?.hours ?? 0), 0);

  const createdAt = profile?.created_at ? new Date(profile.created_at) : user.created_at ? new Date(user.created_at) : null;

  const onPickFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) {
      setPreview(null);
      setPendingFile(null);
      return;
    }
    setPendingFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const onSave = async () => {
    if (pendingFile) {
      await uploadAvatar.mutateAsync(pendingFile);
      setPendingFile(null);
      setPreview(null);
    }
    await updateProfile.mutateAsync({ display_name: displayName.trim() || null as any, bio: bio.trim() || null as any });
    setEditing(false);
  };

  const onCancel = () => {
    setDisplayName(profile?.display_name ?? "");
    setBio(profile?.bio ?? "");
    setPreview(null);
    setPendingFile(null);
    setEditing(false);
  };

  const saving = updateProfile.isPending || uploadAvatar.isPending;

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
      <section className="relative rounded-2xl overflow-hidden border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-background to-neon-pink/20" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="size-28 sm:size-32 rounded-2xl overflow-hidden bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center glow-purple">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="size-full object-cover" />
              ) : (
                <span className="font-display text-3xl text-background">{name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            {editing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="size-9 rounded-full bg-neon-cyan text-background grid place-items-center hover:scale-110 transition shadow-lg"
                  title="Trocar foto"
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
                    title="Remover foto"
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

          <div className="flex-1 w-full text-center md:text-left space-y-3">
            <div className="font-display text-xs text-neon-cyan">PLAYER ONE</div>
            {editing ? (
              <div className="space-y-3 max-w-xl mx-auto md:mx-0">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                  <Input
                    value={displayName}
                    maxLength={50}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background/50 border-border focus-visible:ring-neon-pink"
                    placeholder="Seu nome de exibição"
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
                    placeholder="Conte algo sobre você, seus jogos favoritos…"
                  />
                  <div className="text-[10px] text-muted-foreground mt-1">{bio.length}/300</div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl sm:text-3xl text-glow-pink">{name}</h1>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                {profile?.bio && <p className="text-foreground/90 text-sm max-w-xl">{profile.bio}</p>}
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
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={<Clock className="size-5" />} label="Horas (zerados)" value={`${totalHours}h`} />
        <Stat icon={<Trophy className="size-5" />} label="Concluídos" value={String(completedCount)} />
        <Stat icon={<Gamepad2 className="size-5" />} label="Jogando" value={String(playingCount)} accent />
        <Stat icon={<Heart className="size-5" />} label="Favoritos" value={String(favoritesCount)} />
      </section>

      <SteamProfileSection />

      <section className="space-y-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border">
          {tabs.map((t) => {
            const count = byStatus(t.id).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 h-10 font-display text-[11px] uppercase tracking-wider whitespace-nowrap transition border-b-2 ${
                  tab === t.id
                    ? "text-neon-pink border-neon-pink text-glow-pink"
                    : "text-muted-foreground border-transparent hover:text-foreground"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-border rounded-xl"
          >
            <div className="font-display text-neon-pink">LISTA VAZIA</div>
            <p className="text-muted-foreground text-sm mt-2">
              Adicione jogos a esta lista pelos cards ou pela página do jogo.
            </p>
            <Link to="/discover" className="inline-block mt-4 text-neon-cyan hover:underline">Explorar jogos →</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {byStatus(tab).map((g) =>
              g ? (
                <div key={g.id} className="[&>a]:!w-full">
                  <GameCard game={g} />
                </div>
              ) : null
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
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
