// Server-only helpers for Steam OpenID + Steam Web API.
// Never import from client code.

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const STEAM_API = "https://api.steampowered.com";

export function buildSteamOpenIdRedirect(returnTo: string, realm: string): string {
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

/**
 * Verifies an OpenID response from Steam by reposting the params with
 * mode=check_authentication. Returns the SteamID64 on success.
 */
export async function verifySteamOpenId(params: Record<string, string>): Promise<string | null> {
  const claimedId = params["openid.claimed_id"];
  if (!claimedId) {
    console.warn("[steam] verifySteamOpenId: missing openid.claimed_id");
    return null;
  }
  const match = claimedId.match(/\/id\/(\d{17})$/);
  if (!match) {
    console.warn("[steam] verifySteamOpenId: claimed_id did not match pattern", claimedId);
    return null;
  }
  const steamId = match[1];

  const body = new URLSearchParams({ ...params, "openid.mode": "check_authentication" });
  const res = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    console.error("[steam] OpenID check_authentication HTTP error", res.status);
    return null;
  }
  const text = await res.text();
  if (!/is_valid\s*:\s*true/i.test(text)) {
    console.error("[steam] OpenID check_authentication returned invalid", text);
    return null;
  }
  return steamId;
}

export interface SteamPlayer {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatarfull: string;
  communityvisibilitystate: number; // 3 = public
  realname?: string;
  loccountrycode?: string;
}

function apiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) throw new Error("STEAM_API_KEY not configured");
  return key;
}

export async function fetchPlayerSummary(steamId: string): Promise<SteamPlayer | null> {
  const url = `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey()}&steamids=${steamId}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("[steam] GetPlayerSummaries HTTP", res.status, await res.text().catch(() => ""));
    return null;
  }
  const json = (await res.json()) as { response?: { players?: SteamPlayer[] } };
  const player = json.response?.players?.[0] ?? null;
  console.log("[steam] player summary", steamId, "visibility=", player?.communityvisibilitystate);
  return player;
}

export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number; // minutes
  playtime_2weeks?: number;
  img_icon_url: string;
}

export interface OwnedGamesResult {
  games: SteamOwnedGame[];
  gameDetailsPrivate: boolean;
}

export async function fetchOwnedGames(steamId: string): Promise<OwnedGamesResult | null> {
  const url = `${STEAM_API}/IPlayerService/GetOwnedGames/v1/?key=${apiKey()}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("[steam] GetOwnedGames HTTP", res.status);
    return null;
  }
  const json = (await res.json()) as { response?: { game_count?: number; games?: SteamOwnedGame[] } };
  const response = json.response ?? {};
  // When game details are private, Steam returns an empty `response: {}` object.
  const hasGameCountKey = Object.prototype.hasOwnProperty.call(response, "game_count");
  if (!hasGameCountKey) {
    console.warn("[steam] GetOwnedGames empty response — game details likely private for", steamId);
    return { games: [], gameDetailsPrivate: true };
  }
  console.log("[steam] owned games count", response.game_count, "for", steamId);
  return { games: response.games ?? [], gameDetailsPrivate: false };
}

export async function fetchRecentGames(steamId: string): Promise<SteamOwnedGame[] | null> {
  const url = `${STEAM_API}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey()}&steamid=${steamId}&count=10`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("[steam] GetRecentlyPlayedGames HTTP", res.status);
    return null;
  }
  const json = (await res.json()) as { response?: { games?: SteamOwnedGame[] } };
  return json.response?.games ?? [];
}

export function steamGameImage(appid: number, iconHash: string): string {
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${iconHash}.jpg`;
}

export function steamHeaderImage(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
}
