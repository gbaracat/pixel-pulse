// Curated retro decades for the Linha do Tempo dos Games section.
// All facts are historically documented and the game IDs reference real entries
// in src/data/games.ts.

export type DecadeSlug = "80s" | "90s" | "2000s" | "2010s";

export type Decade = {
  slug: DecadeSlug;
  label: string;
  range: [number, number];
  tagline: string;
  description: string;
  accent: "pink" | "purple" | "cyan" | "green";
  consoles: { name: string; year: string; note: string }[];
  curiosities: { title: string; body: string }[];
  // Curated highlight game IDs (must exist in src/data/games.ts).
  highlightGameIds: string[];
};

export const DECADES: Decade[] = [
  {
    slug: "80s",
    label: "Anos 80",
    range: [1980, 1989],
    tagline: "O nascimento da indústria",
    accent: "pink",
    description:
      "A década que tirou os videogames das fichas de arcade e levou-os para a sala de estar. Atari dominou, sofreu o crash de 1983, e a Nintendo reergueu tudo com o NES.",
    consoles: [
      { name: "Atari 2600", year: "1977", note: "Popularizou cartuchos. Caiu no crash de 1983 após o desastre de E.T." },
      { name: "Arcade Era", year: "anos 80", note: "Pac-Man, Donkey Kong, Galaga, Space Invaders — o ouro dos fliperamas." },
      { name: "NES / Famicom", year: "1983 JP / 1985 NA", note: "Salvou a indústria. Mario, Zelda, Metroid e o template do console doméstico moderno." },
      { name: "Sega Master System", year: "1985", note: "Rival técnico do NES com paleta superior. Forte no Brasil via Tec Toy." },
      { name: "Game Boy", year: "1989", note: "Tela monocromática, bateria infinita, Tetris no bolso. Definiu o portátil." },
    ],
    curiosities: [
      { title: "A pizza que virou Pac-Man", body: "Toru Iwatani criou Pac-Man inspirado em uma pizza com uma fatia removida — queria atrair mulheres aos arcades dominados por jogos de tiro espacial." },
      { title: "Crash de 1983", body: "A enxurrada de jogos ruins (e a fama do péssimo E.T. da Atari) quebrou o mercado norte-americano. A Nintendo só topou voltar com o NES posando-o como 'brinquedo'." },
      { title: "Konami Code nasce em 1986", body: "Kazuhisa Hashimoto criou ↑↑↓↓←→←→BA para se ajudar a testar Gradius. Esqueceu de remover. Apareceu em 300+ jogos depois." },
      { title: "Mario era 'Jumpman'", body: "Em Donkey Kong (1981), Mario não tinha nome — e era carpinteiro. Virou encanador (e ganhou o nome) só em Mario Bros. (1983)." },
      { title: "O bigode foi necessidade técnica", body: "Os sprites do NES eram pequenos demais para desenhar uma boca legível. O bigode resolveu — e virou marca registrada." },
    ],
    highlightGameIds: [
      "pac-man",
      "space-invaders",
      "super-mario-bros",
      "contra",
      "donkey-kong",
    ],
  },
  {
    slug: "90s",
    label: "Anos 90",
    range: [1990, 1999],
    tagline: "A era de ouro 16-bit e o salto para o 3D",
    accent: "purple",
    description:
      "A guerra Nintendo vs Sega, o nascimento dos JRPGs cinematográficos, a chegada dos polígonos 3D com o PlayStation e os RPGs que ainda hoje são referência absoluta.",
    consoles: [
      { name: "Super Nintendo (SNES)", year: "1990", note: "16-bit, Mode 7, chip Super FX e a maior biblioteca de RPGs clássicos da história." },
      { name: "Sega Mega Drive / Genesis", year: "1988 JP / 1989 NA", note: "Atitude e velocidade. 'Genesis does what Nintendon't'. Casa do Sonic." },
      { name: "Neo Geo", year: "1990", note: "Caro como um carro. Trazia a experiência arcade exata para casa. Metal Slug, KOF, Samurai Shodown." },
      { name: "Sony PlayStation", year: "1994 JP", note: "CDs, polígonos 3D e marketing adulto. Mudou para sempre quem joga videogame." },
      { name: "Nintendo 64", year: "1996", note: "Analógico, rumble, 4 controles. Mario 64 e Ocarina of Time inventaram o 3D moderno." },
      { name: "Sega Dreamcast", year: "1998", note: "Online de fábrica, VMU com tela própria. Fracasso comercial, culto eterno." },
    ],
    curiosities: [
      { title: "Sonic foi feito para humilhar Mario", body: "A Sega pediu a Naoto Ohshima uma mascote rápida o suficiente para passar voando em Mario. A cor azul veio do próprio logo da Sega." },
      { title: "O 'combo' foi um bug", body: "Os programadores de Street Fighter II descobriram que sequências encadeadas funcionavam por acidente. Decidiram não corrigir." },
      { title: "Chrono Trigger e o Dream Team", body: "Reuniu Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest) e Akira Toriyama (Dragon Ball). 13 finais possíveis." },
      { title: "Mortal Kombat tinha atores reais", body: "Os sprites originais foram filmados com atores de verdade e digitalizados — técnica revolucionária para 1992." },
      { title: "Pokémon nasceu de coletar insetos", body: "Satoshi Tajiri colecionava insetos quando criança. Pokémon (1996) é literalmente esse hobby transformado em jogo." },
      { title: "Lock-On de Sonic & Knuckles", body: "O cartucho tinha um slot no topo para encaixar Sonic 2 ou 3 e desbloquear modos novos — engenharia brilhante." },
    ],
    highlightGameIds: [
      "super-mario-world",
      "sonic-the-hedgehog",
      "street-fighter-ii",
      "zelda-link-to-the-past",
      "chrono-trigger",
      "final-fantasy-vi",
      "super-metroid",
      "pokemon-red-blue",
      "castlevania-symphony-of-the-night",
      "mega-man-x",
      "donkey-kong-country",
      "earthbound",
    ],
  },
  {
    slug: "2000s",
    label: "Anos 2000",
    range: [2000, 2009],
    tagline: "Online, HD e o console mais vendido da história",
    accent: "cyan",
    description:
      "O PlayStation 2 dominou tudo, o Xbox Live inventou o multiplayer online massivo nos consoles, a Nintendo reinventou o controle com o Wii e os jogos viraram cinema interativo.",
    consoles: [
      { name: "PlayStation 2", year: "2000", note: "O console mais vendido de todos os tempos — 155+ milhões de unidades." },
      { name: "Game Boy Advance", year: "2001", note: "Portátil 32-bit. Trouxe os clássicos do SNES para qualquer lugar." },
      { name: "Xbox", year: "2001", note: "Estreia da Microsoft no mercado. Halo virou referência absoluta do FPS de console." },
      { name: "Nintendo DS", year: "2004", note: "Touchscreen + duas telas. Vendeu 154 milhões. Pokémon, Mario Kart, Brain Age." },
      { name: "Xbox 360", year: "2005", note: "Xbox Live online robusto + achievements. Inventou o multiplayer moderno em consoles." },
      { name: "PlayStation 3", year: "2006", note: "Blu-ray, processador Cell e os primeiros mundos abertos em HD." },
      { name: "Nintendo Wii", year: "2006", note: "Controle por movimento reinventou quem joga videogame. Vovós viraram gamers." },
    ],
    curiosities: [
      { title: "GTA III mudou tudo", body: "Em 2001, GTA III virou um mundo aberto 3D real pela primeira vez. Inventou um gênero inteiro." },
      { title: "Halo definiu o FPS de console", body: "O sistema de dois tiros + recarga de escudo + dual analog vingou em Halo: Combat Evolved (2001) e virou padrão." },
      { title: "Achievements nasceram no Xbox 360", body: "A ideia de pontos por feitos no jogo veio do Xbox Live em 2005. Hoje é universal." },
      { title: "Wii Sports foi o maior cavalo de troia", body: "Foi o jogo mais vendido da geração porque vinha no console. Vovós jogaram boliche pela primeira vez." },
      { title: "World of Warcraft virou cultura", body: "Lançado em 2004, chegou a 12 milhões de assinantes ativos. Mudou para sempre o gênero MMORPG." },
    ],
    highlightGameIds: [],
  },
  {
    slug: "2010s",
    label: "Anos 2010",
    range: [2010, 2019],
    tagline: "Indies, streaming e battle royales",
    accent: "green",
    description:
      "A explosão dos indies via Steam, a era dos battle royales (PUBG, Fortnite), o renascimento do Souls-like com Dark Souls e a chegada do streaming com Twitch tornando jogar e assistir a mesma coisa.",
    consoles: [
      { name: "Nintendo 3DS", year: "2011", note: "Portátil com 3D autoestereoscópico. Pokémon, Fire Emblem e Mario." },
      { name: "PlayStation 4", year: "2013", note: "117+ milhões vendidos. The Last of Us, God of War, Bloodborne, Horizon." },
      { name: "Xbox One", year: "2013", note: "Começou tropeçando com DRM agressivo. Recuperou-se com Game Pass." },
      { name: "Nintendo Switch", year: "2017", note: "Console híbrido portátil + dock. Reinventou a Nintendo após o fiasco do Wii U." },
    ],
    curiosities: [
      { title: "Dark Souls criou um gênero", body: "FromSoftware lançou Dark Souls em 2011 com a filosofia 'morrer ensina'. Inspirou centenas de Souls-likes." },
      { title: "Minecraft virou o jogo mais vendido", body: "Comprado pela Microsoft em 2014 por 2,5 bilhões. Já vendeu 300+ milhões de cópias — recorde absoluto." },
      { title: "PUBG inventou o battle royale moderno", body: "Em 2017 popularizou o formato 100 jogadores numa ilha. Fortnite e Warzone vieram em seguida." },
      { title: "The Witcher 3 elevou o RPG", body: "CD Projekt Red mostrou em 2015 que mundo aberto + escrita madura + DLC honesto podiam coexistir." },
      { title: "Twitch comprado pela Amazon", body: "Em 2014, a Amazon comprou a Twitch por 970 milhões. Streaming virou pilar da indústria de jogos." },
    ],
    highlightGameIds: [
      "minecraft",
      "league-of-legends",
      "gta-v",
      "rocket-league",
      "rainbow-six-siege",
      "stardew-valley",
      "hollow-knight",
      "celeste",
      "undertale",
      "fortnite",
      "apex-legends",
      "red-dead-redemption-2",
    ],
  },
];

export const getDecade = (slug: string): Decade | undefined =>
  DECADES.find((d) => d.slug === slug);
