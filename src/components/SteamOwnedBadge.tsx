import { useSteamLibrary } from "@/hooks/use-steam";
import { getSteamAppId } from "@/lib/steam-appids";
import { useAuth } from "@/hooks/use-auth";

/**
 * Mostra um selo "Você tem na Steam" quando:
 *  - usuário logado tem Steam vinculada e biblioteca pública
 *  - jogo tem appid mapeado e ele consta na biblioteca
 */
export function SteamOwnedBadge({ gameId }: { gameId: string }) {
  const { user } = useAuth();
  const appid = getSteamAppId(gameId);
  const { data } = useSteamLibrary();

  if (!user || !appid || !data || !data.linked || !data.isPublic) return null;
  if (!("all" in data) || !data.all) return null;

  const owned = data.all.find((g) => g.appid === appid);
  if (!owned) return null;

  const hours = Math.round((owned.playtimeMinutes / 60) * 10) / 10;

  return (
    <a
      href={`https://store.steampowered.com/app/${appid}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition text-xs font-display"
      title={`Aparece na sua biblioteca Steam — ${hours}h jogadas`}
    >
      <span className="size-2 rounded-full bg-neon-cyan animate-pulse" />
      VOCÊ TEM NA STEAM
      {hours > 0 && <span className="text-foreground/70">· {hours}h</span>}
    </a>
  );
}
