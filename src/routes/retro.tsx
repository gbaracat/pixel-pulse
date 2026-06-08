import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  ArrowRight,
  Gamepad2,
  Users,
  History,
  KeyRound,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { GameRow } from "@/components/GameRow";
import { TimelineDecades } from "@/components/TimelineDecades";
import { retroCategories, getGame } from "@/data/games";
import { useEnrichedGames } from "@/hooks/use-enriched-games";

export const Route = createFileRoute("/retro")({
  head: () => ({
    meta: [
      { title: "Retrô — Pixel Store · Um museu dos clássicos" },
      { name: "description", content: "Consoles clássicos, arcades, franquias eternas, jogos retrô, curiosidades e a história dos videogames em um só lugar." },
      { property: "og:title", content: "Pixel Store Retrô — A história dos videogames" },
      { property: "og:description", content: "Do Atari ao Dreamcast. Pac-Man, Mario, Sonic, Zelda, Chrono Trigger e os jogos que mudaram a indústria." },
    ],
  }),
  component: RetroHub,
});

// =================================================================
// Conteúdo histórico baseado em fatos públicos e amplamente
// documentados sobre a história dos videogames.
// =================================================================

const HISTORY = [
  { year: "1980", title: "O nascimento do Pac-Man", body: "Toru Iwatani criou Pac-Man na Namco inspirado em uma pizza com uma fatia removida. O objetivo era atrair mulheres aos arcades, então dominados por jogos de tiro espacial.", slug: "pac-man" },
  { year: "1985", title: "Super Mario Bros. salva a indústria", body: "Após o crash dos videogames de 1983, o lançamento de Super Mario Bros. no NES (1985) reacendeu o mercado e definiu o template do platformer moderno.", slug: "super-mario-bros" },
  { year: "1986", title: "Zelda inventa o save", body: "The Legend of Zelda foi um dos primeiros jogos de console com bateria interna no cartucho para salvar progresso — algo revolucionário em uma era de senhas.", slug: "zelda-link-to-the-past" },
  { year: "1991", title: "A origem do Sonic", body: "Naoto Ohshima desenhou Sonic para a Sega como uma mascote rápida o suficiente para humilhar Mario. A cor azul veio do logo da própria Sega.", slug: "sonic-the-hedgehog" },
  { year: "1991", title: "Street Fighter II cria os e-sports", body: "Street Fighter II popularizou o conceito de combate 1v1 com personagens distintos e movimentos especiais, fundando a base da cena competitiva de jogos de luta.", slug: "street-fighter-ii" },
  { year: "1994", title: "O impacto de Final Fantasy VI", body: "Com 14 personagens jogáveis e uma ópera espacial 16-bit conduzida por Nobuo Uematsu, FFVI provou que JRPGs podiam contar histórias adultas e cinematográficas.", slug: "final-fantasy-vi" },
  { year: "1995", title: "Chrono Trigger e o Dream Team", body: "Reuniu Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest) e Akira Toriyama (Dragon Ball). Múltiplos finais e combate sem tela separada redefiniram o gênero.", slug: "chrono-trigger" },
  { year: "1997", title: "Symphony of the Night funda o Metroidvania", body: "Castlevania: Symphony of the Night combinou exploração não-linear (do Metroid) com progressão de RPG, dando nome a um gênero inteiro: Metroidvania.", slug: "castlevania-symphony-of-the-night" },
];

const DID_YOU_KNOW = [
  { game: "Super Mario", fact: "O bigode do Mario existe porque, nos sprites do NES, era impossível desenhar uma boca legível. O bigode resolveu o problema." },
  { game: "Sonic", fact: "Sonic ganhou 'attitude' porque a Sega pesquisou o que crianças americanas achavam 'cool' no início dos anos 90 — e impaciência ganhou." },
  { game: "Zelda", fact: "Shigeru Miyamoto se inspirou nas explorações em cavernas no Japão durante a infância para criar a sensação de descoberta de Zelda." },
  { game: "Pokémon", fact: "Satoshi Tajiri criou Pokémon inspirado no hobby de coletar insetos na infância — daí o sistema de capturar criaturas." },
  { game: "Castlevania", fact: "O título japonês de Symphony of the Night é 'Akumajō Dracula X: Gekka no Yasōkyoku' — 'Noturno ao Luar'." },
  { game: "Chrono Trigger", fact: "O jogo tem 13 finais diferentes dependendo de quando e como você derrota o vilão Lavos." },
  { game: "Mega Man X", fact: "A capsula do Dr. Light que ensina o dash em Mega Man X é considerada um dos melhores tutoriais 'invisíveis' do design de jogos." },
  { game: "Mortal Kombat", fact: "Os personagens originais foram filmados em vídeo real com atores de carne e osso — uma técnica chamada digitalização para a época." },
  { game: "Donkey Kong", fact: "Donkey Kong (1981) foi o primeiro papel de Mario, então chamado 'Jumpman'. Ele era carpinteiro, não encanador." },
  { game: "Pac-Man", fact: "Os quatro fantasmas têm personalidades distintas: Blinky persegue, Pinky embosca, Inky é imprevisível e Clyde foge." },
  { game: "Street Fighter II", fact: "O famoso 'combo' foi descoberto por acaso pelos próprios programadores da Capcom — não era uma feature planejada." },
  { game: "Super Metroid", fact: "Foi o primeiro jogo a popularizar a 'sequence break': pular regiões inteiras com técnicas avançadas. Speedrunners exploram isso até hoje." },
  { game: "EarthBound", fact: "A caixa original americana vinha com um guia ilustrado de 96 páginas — em parte para combater pirataria via fotocópia." },
  { game: "Metal Slug", fact: "Cada sprite tem dezenas de quadros de animação desenhados à mão pixel a pixel — um dos auges absolutos da arte 2D." },
  { game: "Pokémon Red/Blue", fact: "O bug 'MissingNo.' surgiu de uma região da memória acessada por uma sequência de eventos não prevista. Virou lenda urbana mundial." },
  { game: "Mario Kart", fact: "A 'casca azul' (Spiny Shell) só aparece quando alguém está perdendo muito — é o sistema de catch-up mais polêmico dos games." },
];

const CONSOLES = [
  { name: "Atari 2600", year: "1977", body: "Popularizou os cartuchos intercambiáveis. Sofreu com o crash de 1983 após o desastre de E.T. the Extra-Terrestrial." },
  { name: "NES / Nintendinho", year: "1983 (JP)", body: "Reergueu a indústria após o crash. Vendeu cerca de 62 milhões de unidades e definiu o que é um console doméstico." },
  { name: "Sega Mega Drive / Genesis", year: "1988", body: "16-bit, atitude e o slogan 'Genesis does what Nintendon't'. Casa do Sonic e da maior rivalidade da história dos consoles." },
  { name: "Super Nintendo (SNES)", year: "1990", body: "16-bit com Mode 7, chip Super FX e a maior biblioteca de RPGs clássicos já lançada em um único console." },
  { name: "Sony PlayStation", year: "1994", body: "Trouxe CDs, polígonos 3D e um marketing focado em adolescentes/adultos. Mudou para sempre quem joga videogame." },
  { name: "Nintendo 64", year: "1996", body: "Analógico, rumble e 4 controles de fábrica. Mario 64 e Ocarina of Time inventaram o 3D moderno." },
  { name: "Sega Dreamcast", year: "1998", body: "Online de fábrica via modem, VMU com tela e jogos visionários. Falha comercial mas culto absoluto até hoje." },
  { name: "Game Boy", year: "1989", body: "Tela monocromática verde, bateria infinita e Tetris no bolso. 118 milhões de unidades vendidas — o portátil que definiu o gênero." },
];

const CHARACTERS = [
  { name: "Mario", debut: "Donkey Kong (1981)", note: "Encanador italiano da Nintendo, mascote global e o personagem mais reconhecido dos videogames." },
  { name: "Link", debut: "The Legend of Zelda (1986)", note: "Herói silencioso de Hyrule. Nunca foi 'Zelda' — Zelda é a princesa." },
  { name: "Sonic", debut: "Sonic the Hedgehog (1991)", note: "O ouriço azul da Sega criado para superar Mario em velocidade e atitude." },
  { name: "Samus Aran", debut: "Metroid (1986)", note: "Caçadora de recompensas intergaláctica. A grande revelação do final do Metroid original foi descobrir que ela era mulher." },
  { name: "Mega Man", debut: "Mega Man (1987)", note: "Robô azul que copia poderes dos chefes derrotados — sistema de design copiado por inúmeros jogos depois." },
  { name: "Pikachu", debut: "Pokémon Red/Green (1996)", note: "Originalmente apenas mais um dos 151 Pokémon. Virou mascote após o sucesso do anime." },
  { name: "Ryu", debut: "Street Fighter (1987)", note: "Lutador japonês em eterna busca do combate perfeito. Hadouken virou meme cultural global." },
  { name: "Pac-Man", debut: "Pac-Man (1980)", note: "A primeira mascote de videogame a virar fenômeno cultural fora dos arcades — desenho animado, cereal, música pop." },
];

const TIMELINE = [
  { year: "1972", event: "Pong (Atari) populariza videogames como produto comercial." },
  { year: "1978", event: "Space Invaders causa uma 'crise nacional' de moedas de 100 ienes no Japão." },
  { year: "1980", event: "Pac-Man se torna fenômeno cultural mundial." },
  { year: "1983", event: "Crash dos videogames nos EUA. Quebra de várias publishers e da Atari." },
  { year: "1985", event: "NES chega aos EUA com Super Mario Bros. e reanima a indústria." },
  { year: "1989", event: "Game Boy + Tetris lançam o mercado portátil massivo." },
  { year: "1994", event: "PlayStation lança no Japão, leva polígonos 3D ao mainstream." },
  { year: "1996", event: "Pokémon Red/Green inaugura o maior multimedia franchise da história." },
  { year: "1997", event: "Final Fantasy VII traz JRPGs cinematográficos ao ocidente em massa." },
  { year: "2000", event: "PS2 sai e se torna o console mais vendido de todos os tempos (155M+)." },
];

const SECRETS = [
  { title: "Konami Code", body: "↑ ↑ ↓ ↓ ← → ← → B A — código criado por Kazuhisa Hashimoto em 1986 para Gradius. Aparece em mais de 300 jogos até hoje." },
  { title: "Minus World — Mario Bros.", body: "Em SMB no NES, é possível entrar em um nível 'World -1' (Mundo Menos Um) explorando um bug no warp pipe do World 1-2." },
  { title: "Sonic & Knuckles Lock-On", body: "O cartucho de Sonic & Knuckles tinha um slot em cima para encaixar Sonic 2 ou 3 e desbloquear novos modos — engenharia de hardware brilhante." },
  { title: "Mew sob o caminhão", body: "Lenda de Pokémon Red/Blue dizia que havia um Mew embaixo do caminhão em Vermilion City. Era mentira — mas movimentou o boca a boca global." },
  { title: "Sheng Long", body: "Uma piada de 1º de abril da revista EGM dizia que Sheng Long, o mestre de Ryu, era um personagem secreto. Anos de busca por nada." },
  { title: "Animal Crossing — Mr. Resetti", body: "Se você desligar o console sem salvar, uma toupeira aparece para gritar com você. Comportamento punitivo virou comédia cult." },
];

function RetroHub() {
  const { data: enriched } = useEnrichedGames();

  return (
    <div>
      <Hero />

      <div className="space-y-14 -mt-16 relative z-10 pb-20">
        {/* ============= CATEGORIAS RETRÔ ============= */}
        {retroCategories.map((r) => {
          const list = r.ids.map((id) => getGame(id)!).filter(Boolean);
          if (list.length === 0) return null;
          return <GameRow key={r.slug} slug={r.slug} title={r.title} games={list} />;
        })}

        {/* ============= HISTÓRIA DOS VIDEOGAMES ============= */}
        <Section
          icon={<BookOpen className="size-3" />}
          tag="JOGOS QUE MUDARAM A INDÚSTRIA"
          title="Marcos que mudaram tudo"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HISTORY.map((h, i) => {
              const e = enriched?.[h.slug];
              const cover = e?.cover;
              return (
                <motion.div
                  key={h.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Link
                    to="/games/$id"
                    params={{ id: h.slug }}
                    className="group relative block overflow-hidden rounded-xl border border-border/60 bg-card hover:border-neon-pink/60 hover:glow-pink transition h-full"
                  >
                    {cover && (
                      <div className="relative h-40 overflow-hidden">
                        <img src={cover} alt={h.title} loading="lazy" className="absolute inset-0 size-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur text-[10px] font-display text-neon-cyan tracking-widest">
                          {h.year}
                        </div>
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      {!cover && <div className="text-[10px] font-display text-neon-cyan tracking-widest">{h.year}</div>}
                      <h3 className="font-display text-sm text-glow-purple group-hover:text-glow-pink transition">{h.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{h.body}</p>
                      <div className="inline-flex items-center gap-1 text-[11px] text-neon-cyan pt-1">Ver jogo <ArrowRight className="size-3" /></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* ============= LINHA DO TEMPO ============= */}
        <Section icon={<History className="size-3" />} tag="LINHA DO TEMPO DOS GAMES" title="Da Pong ao PS2">
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-pink via-neon-purple to-neon-cyan" />
            <div className="space-y-6">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-8 ${i % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"}`}
                >
                  <div className={`sm:text-right ${i % 2 === 0 ? "" : "sm:text-left"}`}>
                    <div className="font-display text-2xl text-glow-pink">{t.year}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{t.event}</div>
                  <div className="absolute left-2.5 sm:left-1/2 sm:-translate-x-1/2 top-2 size-3 rounded-full bg-neon-pink glow-pink ring-4 ring-background" />
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ============= HISTÓRIA DOS CONSOLES ============= */}
        <Section icon={<Gamepad2 className="size-3" />} tag="HISTÓRIA DOS CONSOLES" title="Os gigantes que moldaram a indústria">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONSOLES.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-xl border border-neon-cyan/30 bg-gradient-to-br from-card via-card to-neon-cyan/5 p-5 hover:border-neon-pink/60 transition"
              >
                <div className="font-display text-[10px] text-neon-cyan tracking-widest">{c.year}</div>
                <h3 className="font-display text-sm text-glow-purple mt-1">{c.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ============= PERSONAGENS ICÔNICOS ============= */}
        <Section icon={<Users className="size-3" />} tag="PERSONAGENS ICÔNICOS DOS 80/90" title="Os rostos que viraram lendas">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHARACTERS.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="rounded-xl border border-neon-purple/30 bg-card p-5 hover:border-neon-pink/60 transition"
              >
                <div className="font-display text-base text-glow-pink">{c.name}</div>
                <div className="text-[10px] font-display text-neon-cyan mt-1 tracking-widest">ESTREIA · {c.debut.toUpperCase()}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-3">{c.note}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ============= VOCÊ SABIA? ============= */}
        <Section icon={<Lightbulb className="size-3" />} tag="VOCÊ SABIA?" title="Curiosidades dos clássicos">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DID_YOU_KNOW.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="relative overflow-hidden rounded-xl border border-neon-purple/30 bg-gradient-to-br from-card via-card to-neon-purple/10 p-5 hover:border-neon-cyan/60 transition"
              >
                <div className="absolute -right-4 -top-4 text-[80px] font-display text-neon-pink/10 leading-none select-none">?</div>
                <div className="relative space-y-2">
                  <div className="font-display text-[10px] text-neon-pink tracking-widest">{d.game.toUpperCase()}</div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{d.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ============= SEGREDOS DOS RETRÔS ============= */}
        <Section icon={<KeyRound className="size-3" />} tag="SEGREDOS DOS JOGOS RETRÔ" title="Bugs, easter eggs e lendas urbanas">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECRETS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="rounded-xl border border-neon-cyan/30 bg-card p-5 hover:border-neon-pink/60 transition"
              >
                <div className="font-display text-sm text-glow-cyan">{s.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  tag,
  title,
  children,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 sm:px-6 space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 text-xs font-display text-neon-cyan">
          {icon} {tag}
        </div>
        <h2 className="font-display text-xl sm:text-2xl text-glow-pink">{title}</h2>
      </div>
      {children}
    </section>
  );
}
