import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { games, type Game } from "@/data/games";

// 8 humores do produto. Mapeados pra critérios curados no catálogo real.
export const MOODS = [
  { id: "relaxar", label: "Quero relaxar", emoji: "🌙" },
  { id: "competitivo", label: "Quero algo competitivo", emoji: "⚔️" },
  { id: "historia", label: "Quero uma boa história", emoji: "📖" },
  { id: "amigos", label: "Quero jogar com amigos", emoji: "🎮" },
  { id: "nostalgia", label: "Quero nostalgia", emoji: "🕹️" },
  { id: "desafio", label: "Quero um desafio difícil", emoji: "🔥" },
  { id: "curto", label: "Quero algo curto", emoji: "⏱️" },
  { id: "viciante", label: "Quero algo viciante", emoji: "🌀" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

// Filtro curado por humor — base do híbrido. Retorna jogos que se encaixam.
function curatedScore(game: Game, mood: MoodId): number {
  const tags = game.tags.map((t) => t.toLowerCase()).join(" ");
  const genre = game.genre.toLowerCase();
  const moods = game.mood as string[];

  switch (mood) {
    case "relaxar":
      if (moods.includes("relaxar")) return 5;
      if (/cozy|stardew|moonlighter|terraria|minecraft|dave-the-diver|sea-of-stars/.test(game.id)) return 5;
      if (/farming|cozy|sandbox|simulation|life/.test(tags)) return 3;
      if (game.difficulty === "easy") return 1;
      return 0;
    case "competitivo":
      if (moods.includes("competitivo")) return 4;
      if (/fps|fighting|moba|battle royale|sports/.test(genre)) return 4;
      if (/competitive|multiplayer|esports|pvp/.test(tags)) return 3;
      return 0;
    case "historia":
      if (moods.includes("história")) return 4;
      if (/rpg|jrpg|adventure|story|narrative/.test(genre)) return 3;
      if (/story|narrative|cinematic|rpg/.test(tags)) return 2;
      if (game.hours >= 25) return 1;
      return 0;
    case "amigos":
      if (/multiplayer|co-?op|party|coop|online|pvp/.test(tags)) return 4;
      if (/multiplayer|fps|moba|fighting|battle royale|sports/.test(genre)) return 3;
      return 0;
    case "nostalgia":
      if (game.era === "retro") return 4;
      if (/retro|pixel|classic|clássico|arcade|nintendo|sega/.test(tags)) return 2;
      return 0;
    case "desafio":
      if (game.difficulty === "hard") return 4;
      if (moods.includes("desafio")) return 3;
      if (/souls|roguelike|metroidvania|brutal/.test(tags + " " + genre)) return 3;
      return 0;
    case "curto":
      if (game.hours <= 8) return 4;
      if (game.hours <= 15) return 2;
      return 0;
    case "viciante":
      if (/roguelike|battle royale|moba|mmo|live service|gacha|farming|loop/.test(tags + " " + genre)) return 4;
      if (/vampire-survivors|fortnite|league-of-legends|valorant|genshin|cs2|warzone|destiny|path-of-exile|diablo|stardew|minecraft|terraria|rocket-league/.test(game.id)) return 4;
      return 0;
  }
}

const InputSchema = z.object({
  moods: z.array(z.string()).min(1).max(8),
  useAi: z.boolean().optional().default(true),
});

export type Recommendation = {
  gameId: string;
  reason: string;
};

export const recommendByMood = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const validMoods = data.moods.filter((m): m is MoodId =>
      MOODS.some((mm) => mm.id === m),
    );
    if (validMoods.length === 0) {
      return { items: [] as Recommendation[], aiUsed: false };
    }

    // 1) Curado: somar scores por humor selecionado
    const scored = games
      .map((g) => {
        const score = validMoods.reduce((acc, m) => acc + curatedScore(g, m), 0);
        return { g, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || b.g.rating - a.g.rating);

    const topCurated = scored.slice(0, 24).map((s) => s.g);

    if (topCurated.length === 0) {
      return { items: [] as Recommendation[], aiUsed: false };
    }

    // 2) IA refina os top 24 → top 8 com justificativa real
    const key = process.env.LOVABLE_API_KEY;
    if (!data.useAi || !key) {
      return {
        items: topCurated.slice(0, 8).map((g) => ({
          gameId: g.id,
          reason: `${g.genre} · ${g.year} · ⭐ ${g.rating}`,
        })),
        aiUsed: false,
      };
    }

    try {
      const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
      const { generateText, Output } = await import("ai");
      const gateway = createLovableAiGatewayProvider(key);

      const moodLabels = validMoods
        .map((m) => MOODS.find((mm) => mm.id === m)?.label)
        .filter(Boolean)
        .join(", ");

      const catalog = topCurated
        .map((g) => `${g.id} | ${g.title} | ${g.genre} | ${g.year} | ${g.difficulty} | ${g.hours}h | ${g.tags.slice(0, 4).join(",")}`)
        .join("\n");

      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({
          schema: z.object({
            picks: z
              .array(
                z.object({
                  gameId: z.string(),
                  reason: z.string().max(140),
                }),
              )
              .min(1)
              .max(8),
          }),
        }),
        prompt: `Você é um curador de jogos da Pixel Store. O usuário escolheu o(s) humor(es): ${moodLabels}.

Selecione até 8 jogos do catálogo abaixo que MELHOR atendem esse humor. Priorize variedade (não 8 do mesmo gênero) e qualidade.

Para cada jogo, escreva uma justificativa curta em português (máx 140 chars), explicando por que ele encaixa NO HUMOR escolhido — não descreva o jogo, justifique a escolha. Use 2ª pessoa ("você vai...").

CATÁLOGO (id | título | gênero | ano | dificuldade | duração | tags):
${catalog}

Use APENAS ids do catálogo acima.`,
      });

      // Validar que os ids retornados estão no catálogo
      const valid = output.picks.filter((p) =>
        topCurated.some((g) => g.id === p.gameId),
      );
      if (valid.length === 0) throw new Error("IA não retornou ids válidos");

      return {
        items: valid as Recommendation[],
        aiUsed: true,
      };
    } catch (err) {
      console.error("[discover] AI fallback:", err);
      return {
        items: topCurated.slice(0, 8).map((g) => ({
          gameId: g.id,
          reason: `${g.genre} · ${g.year} · ⭐ ${g.rating}`,
        })),
        aiUsed: false,
      };
    }
  });
