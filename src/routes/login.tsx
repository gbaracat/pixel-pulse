import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Pixel Store" },
      { name: "description", content: "Acesse sua conta para favoritar e organizar seus jogos." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta, Player.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error(result.error.message);
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center px-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-neon-purple/10 to-neon-pink/10" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
      <motion.div
        className="absolute -top-40 -right-40 size-96 rounded-full bg-neon-pink/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 size-96 rounded-full bg-neon-cyan/20 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative w-full max-w-md rounded-2xl border border-neon-purple/40 bg-card/80 backdrop-blur-xl p-8 shadow-[0_0_60px_oklch(0.55_0.25_300/0.3)]"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-md grid place-items-center bg-gradient-to-br from-neon-purple to-neon-pink glow-purple">
            <Gamepad2 className="size-5 text-background" />
          </div>
          <span className="font-display text-sm text-glow-pink">
            <span>PIXEL</span>
            <span className="text-neon-cyan">STORE</span>
          </span>
        </Link>

        <div className="space-y-1 mb-6">
          <div className="font-display text-xs text-neon-cyan">{mode === "signin" ? "PLAYER LOGIN" : "NEW PLAYER"}</div>
          <h1 className="font-display text-2xl text-glow-pink">
            {mode === "signin" ? "Insira sua ficha" : "Crie seu save"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin" ? "Continue de onde parou." : "Comece sua jornada agora."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@arcade.com"
              className="w-full h-12 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border focus:border-neon-pink focus:glow-pink outline-none transition"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border focus:border-neon-pink focus:glow-pink outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-background font-display text-sm glow-pink hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === "signin" ? "ENTRAR" : "CRIAR CONTA"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-display text-muted-foreground">OU</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full h-12 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-neon-cyan transition inline-flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"/></svg>
          Continuar com Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-6 text-sm text-muted-foreground hover:text-neon-cyan transition"
        >
          {mode === "signin" ? "Não tem conta? " : "Já tem conta? "}
          <span className="text-neon-pink underline-offset-4 hover:underline">
            {mode === "signin" ? "Criar agora" : "Entrar"}
          </span>
        </button>
      </motion.div>
    </div>
  );
}
