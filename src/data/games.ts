import hero from "@/assets/hero-arcade.jpg";
import modTacticalFps from "@/assets/mod-tactical-fps.jpg";
import modHeroShooter from "@/assets/mod-hero-shooter.jpg";
import modBattleRoyale from "@/assets/mod-battle-royale.jpg";
import modMoba from "@/assets/mod-moba.jpg";
import modSandbox from "@/assets/mod-sandbox.jpg";
import modOpenWorld from "@/assets/mod-open-world.jpg";
import modSouls from "@/assets/mod-souls.jpg";
import modSports from "@/assets/mod-sports.jpg";
import modAnimeRpg from "@/assets/mod-anime-rpg.jpg";
import modScifi from "@/assets/mod-scifi.jpg";

export type Era = "retro" | "modern";

export type Game = {
  id: string;
  title: string;
  cover: string;
  rating: number;
  genre: string;
  year: number;
  hours: number;
  difficulty: "easy" | "medium" | "hard";
  era: Era;
  mood: ("relaxar" | "competitivo" | "história" | "desafio")[];
  tags: string[];
  platforms: string[];
  description: string;
};

// All entries below are REAL, commercially released games.
// Cover/rating/year/screenshots are enriched live from RAWG (see useEnrichedGame).
// The local `cover` is only a temporary fallback until enrichment lands.
export const games: Game[] = [
  // ============= CLÁSSICOS REAIS (enriquecidos via RAWG) =============
  { id: "super-mario-bros", title: "Super Mario Bros.", cover: hero, rating: 9.5, genre: "Platformer", year: 1985, hours: 8, difficulty: "medium", era: "retro", mood: ["competitivo", "desafio"], tags: ["Mario", "Platformer", "Nintendo", "Clássico"], platforms: ["NES"], description: "O jogo que salvou a indústria após o crash de 1983. Salte sobre Goombas, derrote Bowser e resgate a Princesa Peach." },
  { id: "super-mario-world", title: "Super Mario World", cover: hero, rating: 9.6, genre: "Platformer", year: 1990, hours: 12, difficulty: "medium", era: "retro", mood: ["história", "desafio"], tags: ["Mario", "Yoshi", "SNES", "Platformer"], platforms: ["SNES"], description: "Mario chega ao SNES com Yoshi, novas habilidades e o lendário Dinosaur Land." },
  { id: "super-metroid", title: "Super Metroid", cover: hero, rating: 9.7, genre: "Metroidvania", year: 1994, hours: 12, difficulty: "hard", era: "retro", mood: ["história", "desafio"], tags: ["Metroid", "Nintendo", "Exploração"], platforms: ["SNES"], description: "Samus Aran retorna ao planeta Zebes em um dos jogos que definiu o gênero Metroidvania." },
  { id: "sonic-the-hedgehog", title: "Sonic the Hedgehog", cover: hero, rating: 9.0, genre: "Platformer", year: 1991, hours: 6, difficulty: "medium", era: "retro", mood: ["competitivo"], tags: ["Sonic", "Sega", "Velocidade"], platforms: ["Genesis"], description: "A resposta da Sega ao Mario: o ouriço azul mais rápido do mundo enfrenta o Dr. Robotnik." },
  { id: "sonic-2", title: "Sonic the Hedgehog 2", cover: hero, rating: 9.2, genre: "Platformer", year: 1992, hours: 8, difficulty: "medium", era: "retro", mood: ["competitivo"], tags: ["Sonic", "Tails", "Sega", "Co-op"], platforms: ["Genesis"], description: "Sonic e Tails correm em alta velocidade pelas zonas mais icônicas da história dos games." },
  { id: "zelda-link-to-the-past", title: "The Legend of Zelda: A Link to the Past", cover: hero, rating: 9.7, genre: "Action RPG", year: 1991, hours: 30, difficulty: "medium", era: "retro", mood: ["história", "desafio"], tags: ["Zelda", "Aventura", "Nintendo"], platforms: ["SNES"], description: "Link viaja entre o Mundo da Luz e o Mundo das Trevas em uma das maiores aventuras já criadas." },
  { id: "chrono-trigger", title: "Chrono Trigger", cover: hero, rating: 9.8, genre: "JRPG", year: 1995, hours: 40, difficulty: "medium", era: "retro", mood: ["história"], tags: ["JRPG", "Square", "Tempo"], platforms: ["SNES"], description: "Viaje pelo tempo para salvar o mundo no JRPG mais cultuado da era 16-bit." },
  { id: "secret-of-mana", title: "Secret of Mana", cover: hero, rating: 9.0, genre: "Action RPG", year: 1993, hours: 25, difficulty: "medium", era: "retro", mood: ["história"], tags: ["Square", "RPG", "Co-op"], platforms: ["SNES"], description: "Um action RPG com co-op de três jogadores e trilha sonora inesquecível de Hiroki Kikuta." },
  { id: "castlevania-symphony-of-the-night", title: "Castlevania: Symphony of the Night", cover: hero, rating: 9.6, genre: "Metroidvania", year: 1997, hours: 25, difficulty: "hard", era: "retro", mood: ["desafio", "história"], tags: ["Castlevania", "Metroidvania", "Gótico"], platforms: ["PS1"], description: "Alucard explora o castelo de Drácula no jogo que definiu o gênero Metroidvania moderno." },
  { id: "mega-man-x", title: "Mega Man X", cover: hero, rating: 9.4, genre: "Action Platformer", year: 1993, hours: 10, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["Mega Man", "Capcom", "Action"], platforms: ["SNES"], description: "X enfrenta os Mavericks de Sigma em um dos maiores action-platformers já feitos." },
  { id: "street-fighter-ii", title: "Street Fighter II", cover: hero, rating: 9.3, genre: "Fighting", year: 1991, hours: 15, difficulty: "hard", era: "retro", mood: ["competitivo"], tags: ["Luta", "Capcom", "Arcade", "Versus"], platforms: ["Arcade", "SNES"], description: "O jogo que criou o gênero de luta moderno. Hadouken, Shoryuken e a eterna rivalidade Ryu vs Ken." },
  { id: "mortal-kombat", title: "Mortal Kombat", cover: hero, rating: 9.0, genre: "Fighting", year: 1992, hours: 12, difficulty: "hard", era: "retro", mood: ["competitivo"], tags: ["Luta", "Fatality", "Arcade"], platforms: ["Arcade", "Genesis"], description: "Finish him! O jogo de luta mais polêmico e influente da história, com fatalities sangrentos." },
  { id: "donkey-kong-country", title: "Donkey Kong Country", cover: hero, rating: 9.2, genre: "Platformer", year: 1994, hours: 14, difficulty: "medium", era: "retro", mood: ["competitivo"], tags: ["Donkey Kong", "Rare", "Nintendo"], platforms: ["SNES"], description: "Gráficos pré-renderizados revolucionários e trilha sonora inesquecível na selva do DK." },
  { id: "contra", title: "Contra", cover: hero, rating: 9.0, genre: "Run and Gun", year: 1987, hours: 4, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["Konami", "Arcade", "Co-op"], platforms: ["NES", "Arcade"], description: "Up Up Down Down Left Right Left Right B A. O run and gun que definiu uma geração." },
  { id: "metal-slug", title: "Metal Slug", cover: hero, rating: 9.1, genre: "Run and Gun", year: 1996, hours: 6, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["SNK", "Pixel Art", "Arcade", "Co-op"], platforms: ["Neo Geo", "Arcade"], description: "Pixel art absurdamente detalhada e ação frenética. O auge da arte 2D em arcades." },
  { id: "pac-man", title: "Pac-Man", cover: hero, rating: 8.8, genre: "Arcade", year: 1980, hours: 3, difficulty: "easy", era: "retro", mood: ["relaxar", "competitivo"], tags: ["Namco", "Arcade", "Ícone"], platforms: ["Arcade"], description: "Waka waka waka. O jogo que transformou videogames em fenômeno cultural mundial." },
  { id: "space-invaders", title: "Space Invaders", cover: hero, rating: 8.7, genre: "Shoot 'em up", year: 1978, hours: 2, difficulty: "medium", era: "retro", mood: ["competitivo", "desafio"], tags: ["Taito", "Arcade", "Ícone"], platforms: ["Arcade"], description: "O alvorecer dos videogames. Defenda a Terra das hordas de alienígenas pixelados." },
  { id: "final-fantasy-vi", title: "Final Fantasy VI", cover: hero, rating: 9.7, genre: "JRPG", year: 1994, hours: 50, difficulty: "medium", era: "retro", mood: ["história"], tags: ["Final Fantasy", "Square", "JRPG"], platforms: ["SNES"], description: "Considerado por muitos o melhor JRPG já feito. Kefka, Terra e uma ópera espacial 16-bit inesquecível." },
  { id: "pokemon-red-blue", title: "Pokémon Red/Blue", cover: hero, rating: 9.4, genre: "JRPG", year: 1996, hours: 35, difficulty: "easy", era: "retro", mood: ["história", "relaxar"], tags: ["Pokémon", "Game Boy", "Nintendo"], platforms: ["Game Boy"], description: "Gotta catch 'em all. O início de um dos maiores fenômenos da cultura pop mundial." },
  { id: "earthbound", title: "EarthBound", cover: hero, rating: 9.3, genre: "JRPG", year: 1994, hours: 30, difficulty: "medium", era: "retro", mood: ["história", "relaxar"], tags: ["JRPG", "Cult", "SNES"], platforms: ["SNES"], description: "Um RPG surreal e bem-humorado sobre crianças salvando o mundo de uma ameaça cósmica." },

  // ============= MODERNOS / AAA / COMPETITIVOS (REAIS) =============
  { id: "valorant", title: "Valorant", cover: modTacticalFps, rating: 9.1, genre: "FPS Tático", year: 2020, hours: 500, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Competitivo", "Multiplayer", "Esports", "5v5"], platforms: ["PC"], description: "Shooter tático 5v5 onde precisão e agentes únicos definem cada round." },
  { id: "cs2", title: "Counter-Strike 2", cover: modTacticalFps, rating: 9.3, genre: "FPS Tático", year: 2023, hours: 800, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Competitivo", "Multiplayer", "Esports"], platforms: ["PC"], description: "O retorno do rei dos shooters táticos. Físicas de fumaça refeitas e a mesma adrenalina." },
  { id: "rainbow-six-siege", title: "Rainbow Six Siege", cover: modTacticalFps, rating: 8.9, genre: "FPS Tático", year: 2015, hours: 300, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Tático", "Multiplayer", "Destrutível"], platforms: ["PC", "PS5", "Xbox"], description: "Operadores únicos, paredes destrutíveis e estratégia de equipe a cada segundo." },
  { id: "fortnite", title: "Fortnite", cover: modBattleRoyale, rating: 8.7, genre: "Battle Royale", year: 2017, hours: 600, difficulty: "medium", era: "modern", mood: ["competitivo", "relaxar"], tags: ["Battle Royale", "Multiplayer", "Build", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch", "Mobile"], description: "100 jogadores, uma ilha, construção em tempo real." },
  { id: "warzone", title: "Call of Duty: Warzone", cover: modBattleRoyale, rating: 8.4, genre: "Battle Royale", year: 2020, hours: 250, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Battle Royale", "Multiplayer", "F2P"], platforms: ["PC", "PS5", "Xbox"], description: "Quedas verticais, gulag tenso e o gunplay clássico da franquia COD em escala massiva." },
  { id: "apex-legends", title: "Apex Legends", cover: modBattleRoyale, rating: 8.8, genre: "Battle Royale", year: 2019, hours: 200, difficulty: "hard", era: "modern", mood: ["competitivo"], tags: ["FPS", "Battle Royale", "Hero Shooter", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "Mobilidade insana, lendas com habilidades únicas e o melhor sistema de ping já feito." },
  { id: "overwatch-2", title: "Overwatch 2", cover: modHeroShooter, rating: 8.0, genre: "Hero Shooter", year: 2022, hours: 150, difficulty: "medium", era: "modern", mood: ["competitivo"], tags: ["Hero Shooter", "Multiplayer", "Equipe", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "Heróis com personalidade e combate 5v5 onde composição importa tanto quanto mira." },
  { id: "marvel-rivals", title: "Marvel Rivals", cover: modHeroShooter, rating: 8.9, genre: "Hero Shooter", year: 2024, hours: 100, difficulty: "medium", era: "modern", mood: ["competitivo"], tags: ["Hero Shooter", "Marvel", "Multiplayer", "F2P", "6v6"], platforms: ["PC", "PS5", "Xbox"], description: "Seus heróis Marvel favoritos em batalhas 6v6 com destruição ambiental." },
  { id: "league-of-legends", title: "League of Legends", cover: modMoba, rating: 8.5, genre: "MOBA", year: 2009, hours: 1000, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["MOBA", "Multiplayer", "Esports", "Estratégia"], platforms: ["PC"], description: "O MOBA que define o gênero. 160+ campeões e a maior cena competitiva do mundo." },
  { id: "minecraft", title: "Minecraft", cover: modSandbox, rating: 9.4, genre: "Sandbox", year: 2011, hours: 400, difficulty: "easy", era: "modern", mood: ["relaxar", "história"], tags: ["Sandbox", "Survival", "Criativo", "Multiplayer"], platforms: ["PC", "PS5", "Xbox", "Switch", "Mobile"], description: "Mine, construa, explore. Um universo infinito de blocos." },
  { id: "gta-v", title: "Grand Theft Auto V", cover: modOpenWorld, rating: 9.6, genre: "Open World", year: 2013, hours: 100, difficulty: "medium", era: "modern", mood: ["história", "relaxar"], tags: ["Open World", "Action", "Crime", "Multiplayer"], platforms: ["PC", "PS5", "Xbox"], description: "Los Santos viva e respirável. Três protagonistas e um modo online infinito." },
  { id: "elden-ring", title: "Elden Ring", cover: modSouls, rating: 9.7, genre: "Souls-like", year: 2022, hours: 120, difficulty: "hard", era: "modern", mood: ["desafio", "história"], tags: ["Souls", "Open World", "RPG", "Singleplayer"], platforms: ["PC", "PS5", "Xbox"], description: "Um mundo aberto sombrio e majestoso de FromSoftware e George R. R. Martin." },
  { id: "destiny-2", title: "Destiny 2", cover: modScifi, rating: 8.5, genre: "FPS / Looter", year: 2017, hours: 500, difficulty: "medium", era: "modern", mood: ["competitivo", "história"], tags: ["FPS", "MMO", "Looter", "Coop", "F2P"], platforms: ["PC", "PS5", "Xbox"], description: "Gunplay sensacional, raids épicas e expansões que reescrevem o universo." },
  { id: "rocket-league", title: "Rocket League", cover: modSports, rating: 9.2, genre: "Sports", year: 2015, hours: 200, difficulty: "medium", era: "modern", mood: ["competitivo", "relaxar"], tags: ["Sports", "Carros", "Multiplayer", "Esports", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "Futebol com carros foguete. Simples de aprender, impossível de dominar." },
  { id: "ea-fc", title: "EA Sports FC 24", cover: modSports, rating: 8.0, genre: "Sports", year: 2023, hours: 200, difficulty: "medium", era: "modern", mood: ["competitivo", "relaxar"], tags: ["Sports", "Futebol", "Multiplayer", "Manager"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "O futebol mais realista do mundo dos games. Ultimate Team e clubes do planeta inteiro." },
];

export const getGame = (id: string) => games.find((g) => g.id === id);

// ============= CATEGORIES =============
export type Category = {
  slug: string;
  title: string;
  subtitle?: string;
  ids: string[];
};

export const categories: Category[] = [
  // ---------- HOME (RETRÔ) ----------
  {
    slug: "most-played-history",
    title: "Jogos Mais Jogados da História",
    subtitle: "Ícones que definiram gerações inteiras",
    ids: ["super-mario-bros", "pac-man", "street-fighter-ii", "super-mario-world", "pokemon-red-blue", "sonic-the-hedgehog", "zelda-link-to-the-past", "mortal-kombat"],
  },
  {
    slug: "arcade-classics",
    title: "Clássicos dos Arcades",
    subtitle: "Direto das fichas de R$ 1,00",
    ids: ["pac-man", "space-invaders", "street-fighter-ii", "mortal-kombat", "metal-slug", "contra"],
  },
  {
    slug: "snes-legends",
    title: "Lendas do Super Nintendo",
    subtitle: "A era de ouro 16-bit da Nintendo",
    ids: ["super-mario-world", "zelda-link-to-the-past", "chrono-trigger", "mega-man-x", "donkey-kong-country", "final-fantasy-vi", "earthbound", "super-metroid", "secret-of-mana"],
  },
  {
    slug: "genesis-legends",
    title: "Lendas do Mega Drive",
    subtitle: "Sega does what Nintendon't",
    ids: ["sonic-the-hedgehog", "sonic-2", "mortal-kombat", "street-fighter-ii"],
  },
  {
    slug: "ps1-best",
    title: "Melhores Jogos de PS1",
    subtitle: "O salto para a era 3D",
    ids: ["castlevania-symphony-of-the-night"],
  },
  {
    slug: "rpgs-eternal",
    title: "RPGs que Marcaram Gerações",
    subtitle: "Histórias que ficaram para sempre",
    ids: ["chrono-trigger", "final-fantasy-vi", "earthbound", "pokemon-red-blue", "zelda-link-to-the-past", "secret-of-mana"],
  },
  {
    slug: "revolutionary",
    title: "Jogos que Revolucionaram a Indústria",
    subtitle: "Quando tudo mudou",
    ids: ["super-mario-bros", "pac-man", "space-invaders", "street-fighter-ii", "sonic-the-hedgehog", "zelda-link-to-the-past", "final-fantasy-vi"],
  },
  {
    slug: "nintendo-classics",
    title: "Clássicos da Nintendo",
    subtitle: "Quando uma empresa virou cultura",
    ids: ["super-mario-bros", "super-mario-world", "zelda-link-to-the-past", "donkey-kong-country", "pokemon-red-blue", "earthbound", "super-metroid"],
  },
  {
    slug: "sega-classics",
    title: "Clássicos da Sega",
    subtitle: "Atitude azul em alta velocidade",
    ids: ["sonic-the-hedgehog", "sonic-2"],
  },
  {
    slug: "pixel-art-classic",
    title: "Pixel Art Clássica",
    subtitle: "O auge da arte 2D",
    ids: ["metal-slug", "castlevania-symphony-of-the-night", "chrono-trigger", "final-fantasy-vi", "super-metroid"],
  },
  {
    slug: "most-influential",
    title: "Jogos Mais Influentes da História",
    subtitle: "O DNA de tudo que veio depois",
    ids: ["super-mario-bros", "pac-man", "space-invaders", "street-fighter-ii", "zelda-link-to-the-past", "sonic-the-hedgehog", "final-fantasy-vi", "castlevania-symphony-of-the-night"],
  },

  // ---------- DESCOBRIR (MODERNO) ----------
  {
    slug: "trending",
    title: "Em Alta Agora",
    subtitle: "Os jogos mais quentes do momento",
    ids: ["valorant", "elden-ring", "marvel-rivals", "fortnite", "cs2", "minecraft", "gta-v"],
  },
  {
    slug: "competitive",
    title: "Competitivos",
    subtitle: "Para quem joga para vencer",
    ids: ["valorant", "cs2", "league-of-legends", "rocket-league", "rainbow-six-siege", "apex-legends", "overwatch-2", "ea-fc", "marvel-rivals"],
  },
  {
    slug: "multiplayer",
    title: "Multiplayer Online",
    subtitle: "Melhor com amigos (ou rivais)",
    ids: ["fortnite", "minecraft", "warzone", "rocket-league", "destiny-2", "ea-fc", "marvel-rivals", "overwatch-2"],
  },
  {
    slug: "modern-aaa",
    title: "AAA Modernos",
    subtitle: "Produções que definiram a geração",
    ids: ["elden-ring", "gta-v", "destiny-2", "valorant", "cs2"],
  },
  {
    slug: "battle-royale",
    title: "Battle Royale",
    subtitle: "Último de pé leva tudo",
    ids: ["fortnite", "warzone", "apex-legends"],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

// Home só com categorias retrô
export const retroCategories = categories.filter((c) =>
  ["most-played-history", "arcade-classics", "snes-legends", "genesis-legends", "ps1-best", "rpgs-eternal", "revolutionary", "nintendo-classics", "sega-classics", "pixel-art-classic", "most-influential"].includes(c.slug)
);

// Descobrir só com categorias modernas
export const modernCategories = categories.filter((c) =>
  ["trending", "competitive", "multiplayer", "modern-aaa", "battle-royale"].includes(c.slug)
);

// Backwards-compat
export const rows = retroCategories.map((c) => ({ slug: c.slug, title: c.title, ids: c.ids }));
