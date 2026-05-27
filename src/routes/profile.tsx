import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Gamepad2, Heart, Edit3 } from "lucide-react";
import { games } from "@/data/games";
import { GameCard } from "@/components/GameCard";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Meu Perfil — Pixel Store" },
      { name: "description", content: "Sua biblioteca, listas e estatísticas gamer." },
    ],
  }),
  component: ProfilePage,
});

const tabs = ["Jogando", "Zerados", "Wishlist", "Abandonados"] as const;
type Tab = (typeof tabs)[number];

const lists: Record<Tab, string[]> = {
  Jogando: ["bone-king", "crystal-deep"],
  Zerados: ["neon-blade", "midnight-drive", "space-spirit"],
  Wishlist: ["rain-city", "cozy-grove"],
  Abandonados: ["vs-arcade"],
};

function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Jogando");

  return (
    <div className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
      {/* Header */}
      <section className="relative rounded-2xl overflow-hidden border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-background to-neon-pink/20" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="size-28 sm:size-32 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-pink grid place-items-center glow-purple shrink-0">
            <span className="font-display text-3xl text-background">P1</span>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="font-display text-xs text-neon-cyan">PLAYER ONE</div>
            <h1 className="font-display text-2xl sm:text-3xl text-glow-pink">PixelHunter_94</h1>
            <p className="text-muted-foreground text-sm max-w-md">
              Caçador de clássicos esquecidos. Speedrunner amador. Apaixonado por 16-bit.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-secondary/80 border border-border hover:border-neon-cyan hover:text-neon-cyan transition">
            <Edit3 className="size-4" /> Editar
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={<Clock className="size-5" />} label="Horas Jogadas" value="312h" />
        <Stat icon={<Trophy className="size-5" />} label="Concluídos" value="14" />
        <Stat icon={<Gamepad2 className="size-5" />} label="Gênero Favorito" value="RPG" accent />
        <Stat icon={<Heart className="size-5" />} label="Favoritos" value="27" />
      </section>

      {/* Activity Bar Chart */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm text-glow-purple">Atividade — Últimos 12 meses</h2>
          <span className="text-xs text-muted-foreground font-mono-pixel text-base">312H TOTAL</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[12, 28, 18, 40, 22, 35, 48, 30, 55, 38, 60, 45].map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${v * 1.6}%` }}
              transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
              className="flex-1 rounded-t bg-gradient-to-t from-neon-purple to-neon-pink min-h-1"
              style={{ boxShadow: "0 0 12px oklch(0.72 0.28 350 / 0.5)" }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono-pixel text-base">
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (<span key={i}>{m}</span>))}
        </div>
      </section>

      {/* Tabs - Lists */}
      <section className="space-y-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 h-10 font-display text-[11px] uppercase tracking-wider whitespace-nowrap transition border-b-2 ${
                tab === t
                  ? "text-neon-pink border-neon-pink text-glow-pink"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {t} <span className="opacity-60">({lists[t].length})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {lists[tab].map((id) => {
            const g = games.find((x) => x.id === id);
            if (!g) return null;
            return (
              <div key={g.id} className="[&>a]:!w-full">
                <GameCard game={g} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-border bg-card"}`}>
      <div className={`size-9 rounded-md grid place-items-center mb-3 ${accent ? "bg-neon-cyan/20 text-neon-cyan" : "bg-secondary text-neon-pink"}`}>
        {icon}
      </div>
      <div className="font-display text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold ${accent ? "text-neon-cyan text-glow-cyan" : ""}`}>{value}</div>
    </div>
  );
}
