export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-display text-xs text-glow-purple"><span>PIXEL</span><span className="text-neon-cyan">STORE</span> <span>© 2026</span></div>
        <div className="text-xs text-muted-foreground font-mono-pixel text-base">
          INSERT COIN TO CONTINUE...
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <a className="hover:text-neon-pink" href="#">Sobre</a>
          <a className="hover:text-neon-pink" href="#">Imprensa</a>
          <a className="hover:text-neon-pink" href="#">Contato</a>
        </div>
      </div>
    </footer>
  );
}
