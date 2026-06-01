import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, Clock, Trophy, Lock, Link2Off, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useSteamLibrary, useUnlinkSteam } from "@/hooks/use-steam";
import { Button } from "@/components/ui/button";

const SteamIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.6 2 2.2 6.2 2 11.5l5.4 2.2c.5-.3 1-.5 1.6-.5h.2l2.4-3.5v-.1c0-2.1 1.7-3.8 3.8-3.8s3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8h-.1l-3.4 2.5v.2c0 1.6-1.3 3-3 3-1.5 0-2.7-1.1-3-2.5L2.4 14.9C3.6 19 7.4 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm-2.6 15.2l-1.2-.5c.2.5.6.9 1.1 1.1.7.3 1.5.3 2.2 0 .3-.1.6-.4.9-.6.2-.3.4-.6.5-.9.1-.4.1-.7 0-1.1-.1-.4-.2-.7-.5-.9-.2-.3-.5-.5-.9-.6-.4-.1-.7-.1-1.1 0l1.2.5c.9.4 1.4 1.5 1 2.4-.4 1-1.4 1.4-2.4 1zm9.7-7c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5zm-4.4 0c0-1.1.9-1.9 1.9-1.9s1.9.9 1.9 1.9-.9 1.9-1.9 1.9-1.9-.9-1.9-1.9z" />
  </svg>
);

function formatHours(minutes: number) {
  const h = Math.round(minutes / 60);
  return `${h}h`;
}

export function SteamProfileSection() {
  const { data: profile } = useProfile();
  const { data: library, isLoading } = useSteamLibrary();
  const unlink = useUnlinkSteam();

  const linked = !!profile?.steam_id;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-[#1b2838] to-[#66c0f4] grid place-items-center text-background">
            <SteamIcon className="size-5 text-white" />
          </div>
          <div>
            <div className="font-display text-xs text-neon-cyan">STEAM CONNECT</div>
            <h2 className="font-display text-lg text-glow-pink">Perfil Steam</h2>
          </div>
        </div>

        {linked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => unlink.mutate()}
            disabled={unlink.isPending}
            className="border-border hover:border-neon-pink hover:text-neon-pink"
          >
            <Link2Off className="size-3.5" /> Desvincular
          </Button>
        ) : (
          <a
            href="/auth/steam/login"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-[#1b2838] hover:bg-[#2a475e] text-white font-display text-[11px] transition"
          >
            <SteamIcon className="size-4" /> CONECTAR STEAM
          </a>
        )}
      </header>

      {!linked && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/30">
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Conecte sua conta Steam para exibir biblioteca, horas jogadas e jogos recentes diretamente no seu perfil.
          </p>
        </div>
      )}

      {linked && (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row items-center gap-4 border-b border-border bg-gradient-to-r from-[#1b2838]/30 to-transparent">
            {profile?.steam_avatar_url && (
              <img
                src={profile.steam_avatar_url}
                alt={profile.steam_persona_name ?? "Steam"}
                className="size-16 rounded-lg ring-2 ring-[#66c0f4]/40"
              />
            )}
            <div className="flex-1 text-center sm:text-left">
              <div className="font-display text-base">{profile?.steam_persona_name}</div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                SteamID: {profile?.steam_id}
              </div>
              {profile?.steam_profile_url && (
                <a
                  href={profile.steam_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-neon-cyan hover:underline mt-1"
                >
                  Abrir perfil no Steam <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="grid place-items-center py-10">
                <Loader2 className="size-5 animate-spin text-neon-cyan" />
              </div>
            ) : library?.linked && library.isPublic ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <MiniStat icon={<Gamepad2 className="size-4" />} label="Jogos" value={String(library.totalGames)} />
                  <MiniStat icon={<Clock className="size-4" />} label="Horas totais" value={formatHours(library.totalMinutes)} />
                  <MiniStat icon={<Trophy className="size-4" />} label="Recentes" value={String(library.recent.length)} />
                </div>

                {library.recent.length > 0 && (
                  <SteamGameRow title="Jogados recentemente" games={library.recent} showRecent />
                )}

                {library.topPlayed.length > 0 && (
                  <SteamGameRow title="Mais jogados" games={library.topPlayed} />
                )}

                {library.all.length > 0 && (
                  <details className="rounded-lg border border-border">
                    <summary className="cursor-pointer px-4 py-3 font-display text-xs uppercase text-muted-foreground hover:text-foreground">
                      Biblioteca completa ({library.all.length} jogos)
                    </summary>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
                      {[...library.all]
                        .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes)
                        .map((g) => (
                          <SteamGameCard key={g.appid} game={g} />
                        ))}
                    </div>
                  </details>
                )}
              </div>
            ) : library?.linked && library.isPublic === false ? (
              <div className="text-center py-8 space-y-2">
                <Lock className="size-8 mx-auto text-muted-foreground" />
                <div className="font-display text-sm">Perfil Steam privado</div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Para exibir biblioteca, horas jogadas e estatísticas, altere a visibilidade do seu perfil Steam para Público.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3 flex items-center gap-3">
      <div className="size-8 rounded-md bg-[#66c0f4]/20 text-[#66c0f4] grid place-items-center">{icon}</div>
      <div>
        <div className="text-[10px] uppercase font-display text-muted-foreground">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

type SteamGame = {
  appid: number;
  name: string;
  playtimeMinutes: number;
  playtime2wMinutes: number;
  header: string;
};

function SteamGameRow({ title, games, showRecent }: { title: string; games: SteamGame[]; showRecent?: boolean }) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {games.map((g) => (
          <SteamGameCard key={g.appid} game={g} showRecent={showRecent} />
        ))}
      </div>
    </div>
  );
}

function SteamGameCard({ game, showRecent }: { game: SteamGame; showRecent?: boolean }) {
  return (
    <a
      href={`https://store.steampowered.com/app/${game.appid}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-lg border border-border overflow-hidden bg-secondary/30 hover:border-neon-cyan/60 transition"
    >
      <div className="aspect-[460/215] bg-background overflow-hidden">
        <img
          src={game.header}
          alt={game.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition"
          onError={(e) => ((e.currentTarget.style.opacity = "0.2"))}
        />
      </div>
      <div className="p-2.5">
        <div className="text-xs font-medium truncate">{game.name}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {formatHours(game.playtimeMinutes)} totais
          {showRecent && game.playtime2wMinutes > 0 && (
            <span className="text-neon-cyan"> · {formatHours(game.playtime2wMinutes)} nas últimas 2 sem.</span>
          )}
        </div>
      </div>
    </a>
  );
}
