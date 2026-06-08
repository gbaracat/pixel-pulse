import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { DECADES } from "@/lib/decades";

const ACCENT_GRADIENT: Record<string, string> = {
  pink: "from-neon-pink/30 via-card to-neon-purple/20 border-neon-pink/40 hover:border-neon-pink",
  purple: "from-neon-purple/30 via-card to-neon-cyan/20 border-neon-purple/40 hover:border-neon-purple",
  cyan: "from-neon-cyan/30 via-card to-neon-pink/15 border-neon-cyan/40 hover:border-neon-cyan",
  green: "from-emerald-500/30 via-card to-neon-cyan/15 border-emerald-500/40 hover:border-emerald-400",
};

const ACCENT_TEXT: Record<string, string> = {
  pink: "text-neon-pink",
  purple: "text-neon-purple",
  cyan: "text-neon-cyan",
  green: "text-emerald-400",
};

export function TimelineDecades() {
  return (
    <section className="px-4 sm:px-6 space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-display text-xs text-neon-cyan">
            <Calendar className="size-3" /> LINHA DO TEMPO DOS GAMES
          </div>
          <h2 className="font-display text-xl sm:text-2xl text-glow-pink">
            Escolha uma década e mergulhe na história
          </h2>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DECADES.map((d, i) => (
          <motion.div
            key={d.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              to="/decade/$slug"
              params={{ slug: d.slug }}
              className={`group relative block overflow-hidden rounded-2xl border bg-gradient-to-br ${ACCENT_GRADIENT[d.accent]} p-5 sm:p-6 transition h-full`}
            >
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
              <div className="absolute -right-6 -bottom-8 text-[120px] sm:text-[150px] font-display leading-none select-none opacity-[0.07] text-foreground">
                {d.range[0].toString().slice(-2)}
              </div>
              <div className="relative space-y-3">
                <div className={`font-display text-[10px] tracking-widest ${ACCENT_TEXT[d.accent]}`}>
                  {d.range[0]} — {d.range[1]}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-glow-pink">{d.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{d.tagline}</p>
                <div className={`inline-flex items-center gap-1 text-[11px] pt-1 ${ACCENT_TEXT[d.accent]} group-hover:translate-x-1 transition`}>
                  Explorar <ArrowRight className="size-3" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
