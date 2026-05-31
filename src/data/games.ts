import g1 from "@/assets/game-1.jpg";
import g2 from "@/assets/game-2.jpg";
import g3 from "@/assets/game-3.jpg";
import g4 from "@/assets/game-4.jpg";
import g5 from "@/assets/game-5.jpg";
import g6 from "@/assets/game-6.jpg";
import g7 from "@/assets/game-7.jpg";
import g8 from "@/assets/game-8.jpg";
import g9 from "@/assets/game-9.jpg";
import g10 from "@/assets/game-10.jpg";
import g11 from "@/assets/game-11.jpg";
import g12 from "@/assets/game-12.jpg";
import g13 from "@/assets/game-13.jpg";
import g14 from "@/assets/game-14.jpg";
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

export const games: Game[] = [
  // ============= RETRÔ / PIXEL ART / INDIES =============
  { id: "neon-blade", title: "Neon Blade", cover: g1, rating: 9.2, genre: "RPG", year: 1994, hours: 38, difficulty: "medium", era: "retro", mood: ["história", "desafio"], tags: ["RPG", "Pixel", "Fantasy", "Singleplayer"], platforms: ["SNES", "PC"], description: "Uma jornada épica num reino dilacerado por luas gêmeas. Forje sua lâmina de neon e desafie deuses adormecidos." },
  { id: "midnight-drive", title: "Midnight Drive '88", cover: g2, rating: 8.6, genre: "Racing", year: 1988, hours: 14, difficulty: "easy", era: "retro", mood: ["competitivo", "relaxar"], tags: ["Arcade", "Synthwave", "Racing"], platforms: ["Arcade", "Genesis"], description: "Acelere por uma cidade noturna pulsando em rosa e ciano. Trilha sonora synthwave, traços neon e zero limites." },
  { id: "cozy-grove", title: "Cozy Grove", cover: g3, rating: 8.9, genre: "Cozy / Sim", year: 2019, hours: 25, difficulty: "easy", era: "retro", mood: ["relaxar", "história"], tags: ["Cozy", "Farm", "Indie"], platforms: ["PC", "Switch"], description: "Construa uma vida tranquila num vilarejo onde o tempo parece desacelerar a cada pôr do sol." },
  { id: "bone-king", title: "Bone King", cover: g4, rating: 9.4, genre: "Souls-like", year: 2021, hours: 42, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["Souls", "Dark", "Hard"], platforms: ["PC", "PS5"], description: "Cada morte é uma lição. Cada chefe, uma lenda. O Rei dos Ossos aguarda sob a lua vermelha." },
  { id: "space-spirit", title: "Space Spirit", cover: g5, rating: 8.1, genre: "Shoot 'em up", year: 1986, hours: 8, difficulty: "medium", era: "retro", mood: ["competitivo", "desafio"], tags: ["Arcade", "Shmup", "Retro"], platforms: ["Arcade", "NES"], description: "Pilote o último caça da humanidade contra hordas alienígenas. Reflexos importam mais que estratégia." },
  { id: "rain-city", title: "Rain City", cover: g6, rating: 9.0, genre: "Detective", year: 2022, hours: 18, difficulty: "medium", era: "retro", mood: ["história", "relaxar"], tags: ["Noir", "Mystery", "Indie"], platforms: ["PC", "Switch"], description: "Uma noir pixelada onde cada néon esconde um segredo. Caminhe pela chuva, ouça as ruas." },
  { id: "crystal-deep", title: "Crystal Deep", cover: g7, rating: 9.1, genre: "Metroidvania", year: 2020, hours: 30, difficulty: "hard", era: "retro", mood: ["desafio", "história"], tags: ["Metroidvania", "Explore", "Indie"], platforms: ["PC", "Switch", "Xbox"], description: "Cavernas vivas, cristais que cantam. Mergulhe fundo o suficiente e a escuridão sussurra de volta." },
  { id: "vs-arcade", title: "VS Arcade", cover: g8, rating: 8.4, genre: "Fighting", year: 1992, hours: 12, difficulty: "hard", era: "retro", mood: ["competitivo"], tags: ["Fighting", "Arcade", "Versus"], platforms: ["Arcade", "Genesis"], description: "Doze lutadores, infinitos combos. O ringue de néon não esquece o nome dos campeões." },
  { id: "harvest-hollow", title: "Harvest Hollow", cover: g9, rating: 9.0, genre: "Cozy / Sim", year: 2018, hours: 80, difficulty: "easy", era: "retro", mood: ["relaxar", "história"], tags: ["Farm", "Cozy", "Life Sim", "Pixel"], platforms: ["PC", "Switch", "Mobile"], description: "Herde uma fazenda esquecida e transforme campos secos em vida. Plante, pesque, namore e ouça o tempo passar." },
  { id: "infernal-rush", title: "Infernal Rush", cover: g10, rating: 9.5, genre: "Roguelike", year: 2020, hours: 55, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["Roguelike", "Action", "Mythology", "Indie"], platforms: ["PC", "Switch", "PS5"], description: "Escape do submundo a cada tentativa. Combos brutais, deuses caprichosos e uma narrativa que evolui na morte." },
  { id: "hollow-lantern", title: "Hollow Lantern", cover: g11, rating: 9.3, genre: "Metroidvania", year: 2017, hours: 45, difficulty: "hard", era: "retro", mood: ["história", "desafio"], tags: ["Metroidvania", "Atmospheric", "Indie", "Dark"], platforms: ["PC", "Switch", "Xbox"], description: "Um reino esquecido sob a terra. Cada lanterna acesa revela uma verdade — e um inimigo a mais." },
  { id: "neon-ronin", title: "Neon Ronin", cover: g12, rating: 8.8, genre: "Action", year: 2023, hours: 20, difficulty: "medium", era: "retro", mood: ["competitivo", "história"], tags: ["Cyberpunk", "Hack & Slash", "Pixel"], platforms: ["PC", "PS5", "Xbox"], description: "Um samurai cibernético cruza um deserto de outdoors mortos. Sua katana corta dados e carne." },
  { id: "abyssal-bloom", title: "Abyssal Bloom", cover: g13, rating: 8.7, genre: "Adventure", year: 2024, hours: 16, difficulty: "medium", era: "retro", mood: ["relaxar", "história"], tags: ["Underwater", "Puzzle", "Atmospheric"], platforms: ["PC", "Switch"], description: "Mergulhe em ruínas bioluminescentes e desvende a memória esquecida do oceano." },
  { id: "orbit-runner", title: "Orbit Runner", cover: g14, rating: 8.3, genre: "Platformer", year: 1991, hours: 10, difficulty: "medium", era: "retro", mood: ["competitivo", "desafio"], tags: ["Space", "Retro", "Arcade"], platforms: ["Arcade", "SNES"], description: "Salte entre estações orbitais antes do oxigênio acabar. Trilha synth e cronômetro implacável." },

  // ============= CLÁSSICOS ICÔNICOS (enriquecidos via RAWG) =============
  { id: "super-mario-bros", title: "Super Mario Bros.", cover: g1, rating: 9.5, genre: "Platformer", year: 1985, hours: 8, difficulty: "medium", era: "retro", mood: ["competitivo", "desafio"], tags: ["Mario", "Platformer", "Nintendo", "Clássico"], platforms: ["NES"], description: "O jogo que salvou os videogames. Salte sobre Goombas, derrote Bowser e resgate a Princesa." },
  { id: "super-mario-world", title: "Super Mario World", cover: g2, rating: 9.6, genre: "Platformer", year: 1990, hours: 12, difficulty: "medium", era: "retro", mood: ["história", "desafio"], tags: ["Mario", "Yoshi", "SNES", "Platformer"], platforms: ["SNES"], description: "Mario chega ao SNES com Yoshi, novas habilidades e o lendário Dinosaur Land." },
  { id: "sonic-the-hedgehog", title: "Sonic the Hedgehog", cover: g4, rating: 9.0, genre: "Platformer", year: 1991, hours: 6, difficulty: "medium", era: "retro", mood: ["competitivo"], tags: ["Sonic", "Sega", "Velocidade", "Platformer"], platforms: ["Genesis"], description: "A resposta da Sega ao Mario: o ouriço azul mais rápido do mundo enfrenta o Dr. Robotnik." },
  { id: "sonic-2", title: "Sonic the Hedgehog 2", cover: g5, rating: 9.2, genre: "Platformer", year: 1992, hours: 8, difficulty: "medium", era: "retro", mood: ["competitivo"], tags: ["Sonic", "Tails", "Sega", "Co-op"], platforms: ["Genesis"], description: "Sonic e Tails correm em alta velocidade pelas zonas mais icônicas da história dos games." },
  { id: "zelda-link-to-the-past", title: "The Legend of Zelda: A Link to the Past", cover: g6, rating: 9.7, genre: "Action RPG", year: 1991, hours: 30, difficulty: "medium", era: "retro", mood: ["história", "desafio"], tags: ["Zelda", "Aventura", "RPG", "Nintendo"], platforms: ["SNES"], description: "Link viaja entre o Mundo da Luz e o Mundo das Trevas em uma das maiores aventuras já criadas." },
  { id: "chrono-trigger", title: "Chrono Trigger", cover: g7, rating: 9.8, genre: "JRPG", year: 1995, hours: 40, difficulty: "medium", era: "retro", mood: ["história"], tags: ["JRPG", "Square", "Tempo", "Clássico"], platforms: ["SNES"], description: "Viaje pelo tempo para salvar o mundo no JRPG mais cultuado da era 16-bit." },
  { id: "castlevania-symphony-of-the-night", title: "Castlevania: Symphony of the Night", cover: g11, rating: 9.6, genre: "Metroidvania", year: 1997, hours: 25, difficulty: "hard", era: "retro", mood: ["desafio", "história"], tags: ["Castlevania", "Metroidvania", "Gótico"], platforms: ["PS1"], description: "Alucard explora o castelo de Drácula no jogo que definiu o gênero Metroidvania." },
  { id: "mega-man-x", title: "Mega Man X", cover: g14, rating: 9.4, genre: "Action Platformer", year: 1993, hours: 10, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["Mega Man", "Capcom", "Action"], platforms: ["SNES"], description: "X enfrenta os Mavericks de Sigma em um dos maiores action-platformers já feitos." },
  { id: "street-fighter-ii", title: "Street Fighter II", cover: g8, rating: 9.3, genre: "Fighting", year: 1991, hours: 15, difficulty: "hard", era: "retro", mood: ["competitivo"], tags: ["Luta", "Capcom", "Arcade", "Versus"], platforms: ["Arcade", "SNES"], description: "O jogo que criou o gênero de luta moderno. Hadouken, Shoryuken e a eterna rivalidade Ryu vs Ken." },
  { id: "mortal-kombat", title: "Mortal Kombat", cover: g8, rating: 9.0, genre: "Fighting", year: 1992, hours: 12, difficulty: "hard", era: "retro", mood: ["competitivo"], tags: ["Luta", "Fatality", "Arcade"], platforms: ["Arcade", "Genesis"], description: "Finish him! O jogo de luta mais polêmico e influente da história, com fatalities sangrentos." },
  { id: "donkey-kong-country", title: "Donkey Kong Country", cover: g3, rating: 9.2, genre: "Platformer", year: 1994, hours: 14, difficulty: "medium", era: "retro", mood: ["competitivo"], tags: ["Donkey Kong", "Rare", "Nintendo"], platforms: ["SNES"], description: "Gráficos pré-renderizados revolucionários e trilha sonora inesquecível na selva do DK." },
  { id: "contra", title: "Contra", cover: g5, rating: 9.0, genre: "Run and Gun", year: 1987, hours: 4, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["Konami", "Arcade", "Co-op"], platforms: ["NES", "Arcade"], description: "Up Up Down Down Left Right Left Right B A. O run and gun que definiu uma geração." },
  { id: "metal-slug", title: "Metal Slug", cover: g5, rating: 9.1, genre: "Run and Gun", year: 1996, hours: 6, difficulty: "hard", era: "retro", mood: ["desafio", "competitivo"], tags: ["SNK", "Pixel Art", "Arcade", "Co-op"], platforms: ["Neo Geo", "Arcade"], description: "Pixel art absurdamente detalhada e ação frenética. O auge da arte 2D em arcades." },
  { id: "pac-man", title: "Pac-Man", cover: g8, rating: 8.8, genre: "Arcade", year: 1980, hours: 3, difficulty: "easy", era: "retro", mood: ["relaxar", "competitivo"], tags: ["Namco", "Arcade", "Ícone"], platforms: ["Arcade"], description: "Waka waka waka. O jogo que transformou videogames em fenômeno cultural mundial." },
  { id: "space-invaders", title: "Space Invaders", cover: g5, rating: 8.7, genre: "Shoot 'em up", year: 1978, hours: 2, difficulty: "medium", era: "retro", mood: ["competitivo", "desafio"], tags: ["Taito", "Arcade", "Ícone"], platforms: ["Arcade"], description: "O alvorecer dos videogames. Defenda a Terra das hordas de alienígenas pixelados." },
  { id: "final-fantasy-vi", title: "Final Fantasy VI", cover: g1, rating: 9.7, genre: "JRPG", year: 1994, hours: 50, difficulty: "medium", era: "retro", mood: ["história"], tags: ["Final Fantasy", "Square", "JRPG", "Clássico"], platforms: ["SNES"], description: "Considerado por muitos o melhor JRPG já feito. Kefka, Terra e uma ópera espacial 16-bit inesquecível." },
  { id: "pokemon-red-blue", title: "Pokémon Red/Blue", cover: g9, rating: 9.4, genre: "JRPG", year: 1996, hours: 35, difficulty: "easy", era: "retro", mood: ["história", "relaxar"], tags: ["Pokémon", "Game Boy", "Nintendo"], platforms: ["Game Boy"], description: "Gotta catch 'em all. O início de um dos maiores fenômenos da cultura pop mundial." },
  { id: "earthbound", title: "EarthBound", cover: g9, rating: 9.3, genre: "JRPG", year: 1994, hours: 30, difficulty: "medium", era: "retro", mood: ["história", "relaxar"], tags: ["JRPG", "Cult", "SNES"], platforms: ["SNES"], description: "Um RPG surreal e bem-humorado sobre crianças salvando o mundo de uma ameaça cósmica." },

  // ============= MODERNOS / AAA / COMPETITIVOS =============
  { id: "valorant", title: "Valorant", cover: modTacticalFps, rating: 9.1, genre: "FPS Tático", year: 2020, hours: 500, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Competitivo", "Multiplayer", "Esports", "5v5"], platforms: ["PC"], description: "Shooter tático 5v5 onde precisão e agentes únicos definem cada round. Espalhe-se, mire na cabeça, ganhe a partida." },
  { id: "cs2", title: "Counter-Strike 2", cover: modTacticalFps, rating: 9.3, genre: "FPS Tático", year: 2023, hours: 800, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Competitivo", "Multiplayer", "Esports"], platforms: ["PC"], description: "O retorno do rei dos shooters táticos. Físicas de fumaça refeitas, mapas reconstruídos e a mesma adrenalina." },
  { id: "rainbow-six-siege", title: "Rainbow Six Siege", cover: modTacticalFps, rating: 8.9, genre: "FPS Tático", year: 2015, hours: 300, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Tático", "Multiplayer", "Destrutível"], platforms: ["PC", "PS5", "Xbox"], description: "Operadores únicos, paredes destrutíveis e estratégia de equipe a cada segundo." },
  { id: "the-finals", title: "The Finals", cover: modTacticalFps, rating: 8.6, genre: "FPS", year: 2023, hours: 80, difficulty: "medium", era: "modern", mood: ["competitivo"], tags: ["FPS", "Multiplayer", "Destrutível", "Show"], platforms: ["PC", "PS5", "Xbox"], description: "Combate 3v3v3 em arenas inteiramente destrutíveis. Quebre o cenário, vença o show." },
  { id: "fortnite", title: "Fortnite", cover: modBattleRoyale, rating: 8.7, genre: "Battle Royale", year: 2017, hours: 600, difficulty: "medium", era: "modern", mood: ["competitivo", "relaxar"], tags: ["Battle Royale", "Multiplayer", "Build", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch", "Mobile"], description: "100 jogadores, uma ilha, construção em tempo real. O fenômeno cultural que reinventa-se a cada temporada." },
  { id: "warzone", title: "Call of Duty: Warzone", cover: modBattleRoyale, rating: 8.4, genre: "Battle Royale", year: 2020, hours: 250, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["FPS", "Battle Royale", "Multiplayer", "F2P"], platforms: ["PC", "PS5", "Xbox"], description: "Quedas verticais, gulag tenso e o gunplay clássico da franquia COD em escala massiva." },
  { id: "apex-legends", title: "Apex Legends", cover: modBattleRoyale, rating: 8.8, genre: "Battle Royale", year: 2019, hours: 200, difficulty: "hard", era: "modern", mood: ["competitivo"], tags: ["FPS", "Battle Royale", "Hero Shooter", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "Mobilidade insana, lendas com habilidades únicas e o melhor sistema de ping já feito." },
  { id: "overwatch-2", title: "Overwatch 2", cover: modHeroShooter, rating: 8.0, genre: "Hero Shooter", year: 2022, hours: 150, difficulty: "medium", era: "modern", mood: ["competitivo"], tags: ["Hero Shooter", "Multiplayer", "Equipe", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "Heróis com personalidade, mapas pelo mundo todo e combate 5v5 onde composição importa tanto quanto mira." },
  { id: "marvel-rivals", title: "Marvel Rivals", cover: modHeroShooter, rating: 8.9, genre: "Hero Shooter", year: 2024, hours: 100, difficulty: "medium", era: "modern", mood: ["competitivo"], tags: ["Hero Shooter", "Marvel", "Multiplayer", "F2P", "6v6"], platforms: ["PC", "PS5", "Xbox"], description: "Seus heróis Marvel favoritos em batalhas 6v6 com destruição ambiental e sinergias de equipe explosivas." },
  { id: "league-of-legends", title: "League of Legends", cover: modMoba, rating: 8.5, genre: "MOBA", year: 2009, hours: 1000, difficulty: "hard", era: "modern", mood: ["competitivo", "desafio"], tags: ["MOBA", "Multiplayer", "Esports", "Estratégia"], platforms: ["PC"], description: "O MOBA que define o gênero. 160+ campeões, partidas de 30 minutos e a maior cena competitiva do mundo." },
  { id: "minecraft", title: "Minecraft", cover: modSandbox, rating: 9.4, genre: "Sandbox", year: 2011, hours: 400, difficulty: "easy", era: "modern", mood: ["relaxar", "história"], tags: ["Sandbox", "Survival", "Criativo", "Multiplayer"], platforms: ["PC", "PS5", "Xbox", "Switch", "Mobile"], description: "Mine, construa, explore. Um universo infinito de blocos onde sua imaginação é o único limite." },
  { id: "roblox", title: "Roblox", cover: modSandbox, rating: 8.2, genre: "Sandbox", year: 2006, hours: 300, difficulty: "easy", era: "modern", mood: ["relaxar", "competitivo"], tags: ["Sandbox", "UGC", "Multiplayer", "F2P"], platforms: ["PC", "PS5", "Xbox", "Mobile"], description: "Milhões de experiências criadas pela própria comunidade. Um universo de jogos dentro de um jogo." },
  { id: "gta-v", title: "GTA V", cover: modOpenWorld, rating: 9.6, genre: "Open World", year: 2013, hours: 100, difficulty: "medium", era: "modern", mood: ["história", "relaxar"], tags: ["Open World", "Action", "Crime", "Multiplayer"], platforms: ["PC", "PS5", "Xbox"], description: "Los Santos viva e respirável. Três protagonistas, um modo online infinito e mais conteúdo que toda uma década." },
  { id: "cyberpunk-2077", title: "Cyberpunk 2077", cover: modOpenWorld, rating: 9.0, genre: "RPG", year: 2020, hours: 80, difficulty: "medium", era: "modern", mood: ["história", "desafio"], tags: ["RPG", "Cyberpunk", "Open World", "Singleplayer"], platforms: ["PC", "PS5", "Xbox"], description: "Night City pulsa, sangra e seduz. Forge a lenda de V em uma das ambientações mais densas já criadas." },
  { id: "elden-ring", title: "Elden Ring", cover: modSouls, rating: 9.7, genre: "Souls-like", year: 2022, hours: 120, difficulty: "hard", era: "modern", mood: ["desafio", "história"], tags: ["Souls", "Open World", "RPG", "Singleplayer"], platforms: ["PC", "PS5", "Xbox"], description: "Um mundo aberto sombrio e majestoso de FromSoftware e George R. R. Martin. Torne-se o Lorde Prístino." },
  { id: "destiny-2", title: "Destiny 2", cover: modScifi, rating: 8.5, genre: "FPS / Looter", year: 2017, hours: 500, difficulty: "medium", era: "modern", mood: ["competitivo", "história"], tags: ["FPS", "MMO", "Looter", "Coop", "F2P"], platforms: ["PC", "PS5", "Xbox"], description: "Gunplay sensacional, raids épicas e expansões que reescrevem o universo. Junte-se aos Guardiões." },
  { id: "rocket-league", title: "Rocket League", cover: modSports, rating: 9.2, genre: "Sports", year: 2015, hours: 200, difficulty: "medium", era: "modern", mood: ["competitivo", "relaxar"], tags: ["Sports", "Carros", "Multiplayer", "Esports", "F2P"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "Futebol com carros foguete. Simples de aprender, impossível de dominar." },
  { id: "ea-fc", title: "EA Sports FC", cover: modSports, rating: 8.0, genre: "Sports", year: 2023, hours: 200, difficulty: "medium", era: "modern", mood: ["competitivo", "relaxar"], tags: ["Sports", "Futebol", "Multiplayer", "Manager"], platforms: ["PC", "PS5", "Xbox", "Switch"], description: "O futebol mais realista do mundo dos games. Ultimate Team, carreira e clubes do planeta inteiro." },
  { id: "genshin-impact", title: "Genshin Impact", cover: modAnimeRpg, rating: 8.8, genre: "RPG", year: 2020, hours: 400, difficulty: "easy", era: "modern", mood: ["história", "relaxar"], tags: ["RPG", "Anime", "Open World", "Gacha", "F2P"], platforms: ["PC", "PS5", "Mobile"], description: "Explore Teyvat, monte uma equipe de personagens elementais e descubra um mundo de magia e mistério." },
];

export const getGame = (id: string) => games.find((g) => g.id === id);

// ============= CATEGORIES =============
// Each category has a slug → maps to /categories/$slug
export type Category = {
  slug: string;
  title: string;
  subtitle?: string;
  ids: string[];
};

export const categories: Category[] = [
  {
    slug: "trending",
    title: "Em Alta Agora",
    subtitle: "Os jogos mais quentes do momento",
    ids: ["valorant", "elden-ring", "marvel-rivals", "fortnite", "cs2", "minecraft", "infernal-rush", "the-finals", "gta-v"],
  },
  {
    slug: "most-played",
    title: "Mais Jogados",
    subtitle: "Onde o mundo está jogando agora",
    ids: ["league-of-legends", "fortnite", "minecraft", "roblox", "cs2", "valorant", "gta-v", "warzone", "apex-legends"],
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
    ids: ["fortnite", "minecraft", "warzone", "rocket-league", "destiny-2", "the-finals", "ea-fc", "roblox", "marvel-rivals", "overwatch-2"],
  },
  {
    slug: "modern-aaa",
    title: "AAA Modernos",
    subtitle: "Produções que definiram a geração",
    ids: ["elden-ring", "gta-v", "cyberpunk-2077", "destiny-2", "valorant", "cs2"],
  },
  {
    slug: "battle-royale",
    title: "Battle Royale",
    subtitle: "Último de pé leva tudo",
    ids: ["fortnite", "warzone", "apex-legends"],
  },
  {
    slug: "retro-classics",
    title: "Retrô Clássicos",
    subtitle: "Direto dos anos 80 e 90",
    ids: ["midnight-drive", "space-spirit", "vs-arcade", "neon-blade", "orbit-runner"],
  },
  {
    slug: "pixel-indie",
    title: "Indies Pixel Art",
    subtitle: "A alma artesanal do pixel",
    ids: ["cozy-grove", "rain-city", "crystal-deep", "hollow-lantern", "abyssal-bloom", "harvest-hollow", "neon-ronin", "infernal-rush"],
  },
  {
    slug: "rpg",
    title: "RPGs & Aventuras",
    subtitle: "Mundos para se perder",
    ids: ["elden-ring", "cyberpunk-2077", "genshin-impact", "neon-blade", "crystal-deep", "rain-city", "hollow-lantern"],
  },
  {
    slug: "relax",
    title: "Para Relaxar",
    subtitle: "Sem pressão, só vibe",
    ids: ["cozy-grove", "harvest-hollow", "minecraft", "midnight-drive", "rain-city", "abyssal-bloom", "genshin-impact"],
  },
  {
    slug: "hard",
    title: "Difíceis de Verdade",
    subtitle: "Para quem quer sofrer com classe",
    ids: ["elden-ring", "bone-king", "infernal-rush", "hollow-lantern", "crystal-deep", "vs-arcade", "cs2", "rainbow-six-siege"],
  },
  {
    slug: "recommended",
    title: "Recomendados para Você",
    subtitle: "Curadoria pessoal do Pixel Engine",
    ids: ["elden-ring", "infernal-rush", "valorant", "minecraft", "rain-city", "marvel-rivals", "harvest-hollow", "fortnite"],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

// Backwards-compat: rows used by home page = first 8 categories (excluding "battle-royale" for visual variety)
export const rows = categories.filter((c) => c.slug !== "battle-royale" && c.slug !== "modern-aaa").map((c) => ({
  slug: c.slug,
  title: c.title,
  ids: c.ids,
}));
