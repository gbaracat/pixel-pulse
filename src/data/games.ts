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

export type Game = {
  id: string;
  title: string;
  cover: string;
  rating: number;
  genre: string;
  year: number;
  hours: number;
  difficulty: "easy" | "medium" | "hard";
  mood: ("relaxar" | "competitivo" | "história" | "desafio")[];
  tags: string[];
  platforms: string[];
  description: string;
};

export const games: Game[] = [
  {
    id: "neon-blade",
    title: "Neon Blade",
    cover: g1,
    rating: 9.2,
    genre: "RPG",
    year: 1994,
    hours: 38,
    difficulty: "medium",
    mood: ["história", "desafio"],
    tags: ["RPG", "Pixel", "Fantasy", "Singleplayer"],
    platforms: ["SNES", "PC"],
    description:
      "Uma jornada épica num reino dilacerado por luas gêmeas. Forje sua lâmina de neon e desafie deuses adormecidos.",
  },
  {
    id: "midnight-drive",
    title: "Midnight Drive '88",
    cover: g2,
    rating: 8.6,
    genre: "Racing",
    year: 1988,
    hours: 14,
    difficulty: "easy",
    mood: ["competitivo", "relaxar"],
    tags: ["Arcade", "Synthwave", "Racing"],
    platforms: ["Arcade", "Genesis"],
    description:
      "Acelere por uma cidade noturna pulsando em rosa e ciano. Trilha sonora synthwave, traços neon e zero limites.",
  },
  {
    id: "cozy-grove",
    title: "Cozy Grove",
    cover: g3,
    rating: 8.9,
    genre: "Cozy / Sim",
    year: 2019,
    hours: 25,
    difficulty: "easy",
    mood: ["relaxar", "história"],
    tags: ["Cozy", "Farm", "Indie"],
    platforms: ["PC", "Switch"],
    description: "Construa uma vida tranquila num vilarejo onde o tempo parece desacelerar a cada pôr do sol.",
  },
  {
    id: "bone-king",
    title: "Bone King",
    cover: g4,
    rating: 9.4,
    genre: "Souls-like",
    year: 2021,
    hours: 42,
    difficulty: "hard",
    mood: ["desafio", "competitivo"],
    tags: ["Souls", "Dark", "Hard"],
    platforms: ["PC", "PS5"],
    description: "Cada morte é uma lição. Cada chefe, uma lenda. O Rei dos Ossos aguarda sob a lua vermelha.",
  },
  {
    id: "space-spirit",
    title: "Space Spirit",
    cover: g5,
    rating: 8.1,
    genre: "Shoot 'em up",
    year: 1986,
    hours: 8,
    difficulty: "medium",
    mood: ["competitivo", "desafio"],
    tags: ["Arcade", "Shmup", "Retro"],
    platforms: ["Arcade", "NES"],
    description: "Pilote o último caça da humanidade contra hordas alienígenas. Reflexos importam mais que estratégia.",
  },
  {
    id: "rain-city",
    title: "Rain City",
    cover: g6,
    rating: 9.0,
    genre: "Detective",
    year: 2022,
    hours: 18,
    difficulty: "medium",
    mood: ["história", "relaxar"],
    tags: ["Noir", "Mystery", "Indie"],
    platforms: ["PC", "Switch"],
    description: "Uma noir pixelada onde cada néon esconde um segredo. Caminhe pela chuva, ouça as ruas.",
  },
  {
    id: "crystal-deep",
    title: "Crystal Deep",
    cover: g7,
    rating: 9.1,
    genre: "Metroidvania",
    year: 2020,
    hours: 30,
    difficulty: "hard",
    mood: ["desafio", "história"],
    tags: ["Metroidvania", "Explore", "Indie"],
    platforms: ["PC", "Switch", "Xbox"],
    description: "Cavernas vivas, cristais que cantam. Mergulhe fundo o suficiente e a escuridão sussurra de volta.",
  },
  {
    id: "vs-arcade",
    title: "VS Arcade",
    cover: g8,
    rating: 8.4,
    genre: "Fighting",
    year: 1992,
    hours: 12,
    difficulty: "hard",
    mood: ["competitivo"],
    tags: ["Fighting", "Arcade", "Versus"],
    platforms: ["Arcade", "Genesis"],
    description: "Doze lutadores, infinitos combos. O ringue de néon não esquece o nome dos campeões.",
  },
];

export const getGame = (id: string) => games.find((g) => g.id === id);

export const rows = [
  { title: "Em Alta", ids: ["bone-king", "neon-blade", "crystal-deep", "rain-city", "midnight-drive"] },
  { title: "Retrô Clássicos", ids: ["midnight-drive", "space-spirit", "vs-arcade", "neon-blade"] },
  { title: "Indies Pixel Art", ids: ["cozy-grove", "rain-city", "crystal-deep", "bone-king"] },
  { title: "RPGs Retrô", ids: ["neon-blade", "crystal-deep", "rain-city"] },
  { title: "Para Relaxar", ids: ["cozy-grove", "midnight-drive", "rain-city"] },
  { title: "Difíceis de Verdade", ids: ["bone-king", "crystal-deep", "vs-arcade", "space-spirit"] },
  { title: "Recomendados para Você", ids: ["neon-blade", "rain-city", "cozy-grove", "bone-king", "crystal-deep"] },
];
