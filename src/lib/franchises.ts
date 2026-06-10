// Franquias curadas — pagina /franchise/$slug
// Cada franquia define a ordem cronológica dos seus jogos presentes no catálogo.
export type Franchise = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gameIds: string[]; // ordem cronológica
  accent: "pink" | "cyan" | "purple";
};

export const FRANCHISES: Franchise[] = [
  {
    slug: "mario",
    name: "Super Mario",
    tagline: "O encanador que salvou os videogames.",
    description: "De 1985 ao infinito, Mario é a face da Nintendo e o referencial de design de platformer mais influente da história.",
    gameIds: ["super-mario-bros", "super-mario-world"],
    accent: "pink",
  },
  {
    slug: "sonic",
    name: "Sonic the Hedgehog",
    tagline: "Velocidade azul como atitude.",
    description: "A resposta da Sega ao Mario. Sonic definiu o platformer de alta velocidade nos anos 90 e a guerra de consoles 16-bit.",
    gameIds: ["sonic-the-hedgehog", "sonic-2", "sonic-3-knuckles"],
    accent: "cyan",
  },
  {
    slug: "zelda",
    name: "The Legend of Zelda",
    tagline: "Coragem, sabedoria e poder.",
    description: "Da masmorra original ao mundo aberto. A franquia que ensinou o mundo a explorar.",
    gameIds: ["zelda-link-to-the-past"],
    accent: "cyan",
  },
  {
    slug: "pokemon",
    name: "Pokémon",
    tagline: "Gotta catch 'em all.",
    description: "O fenômeno que começou em dois cartuchos Game Boy em 1996 e virou a maior franquia de mídia da história.",
    gameIds: ["pokemon-red-blue", "pokemon-yellow"],
    accent: "pink",
  },
  {
    slug: "final-fantasy",
    name: "Final Fantasy",
    tagline: "JRPG como ópera espacial.",
    description: "Da Square (depois Square Enix), reinventou o JRPG a cada numeração e moldou a narrativa de games.",
    gameIds: ["final-fantasy-vi"],
    accent: "purple",
  },
  {
    slug: "castlevania",
    name: "Castlevania",
    tagline: "Caça ao Drácula desde 1986.",
    description: "Da Konami, criou o gótico nos videogames e — com Symphony of the Night — co-fundou o gênero Metroidvania.",
    gameIds: ["castlevania-symphony-of-the-night"],
    accent: "purple",
  },
  {
    slug: "mega-man",
    name: "Mega Man",
    tagline: "Robôs, bosses e level design cirúrgico.",
    description: "A Capcom definiu o action platformer com escolha de fases, robot masters e dificuldade absoluta.",
    gameIds: ["mega-man-x", "mega-man-x4"],
    accent: "cyan",
  },
  {
    slug: "street-fighter",
    name: "Street Fighter",
    tagline: "O jogo que criou o gênero de luta.",
    description: "Hadouken, Shoryuken e o eterno Ryu vs Ken. Street Fighter II é a pedra fundamental dos fighting games.",
    gameIds: ["street-fighter-ii"],
    accent: "pink",
  },
  {
    slug: "metal-slug",
    name: "Metal Slug",
    tagline: "O auge do pixel art em movimento.",
    description: "A SNK levou o run-and-gun a um nível de animação e detalhe que poucos jogos 2D igualaram.",
    gameIds: ["metal-slug", "metal-slug-x"],
    accent: "cyan",
  },
];

export const getFranchise = (slug: string) => FRANCHISES.find((f) => f.slug === slug);
