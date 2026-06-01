import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { linkSteamAccount } from "@/lib/steam.functions";

export const Route = createFileRoute("/auth/steam/return")({
  component: SteamReturnPage,
});

function SteamReturnPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const link = useServerFn(linkSteamAccount);
  const qc = useQueryClient();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Validando resposta do Steam...");
  const ran = useRef(false);

  useEffect(() => {
    if (loading || ran.current) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    ran.current = true;

    const search = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    search.forEach((v, k) => {
      if (k.startsWith("openid.")) params[k] = v;
    });

    if (!params["openid.claimed_id"]) {
      setStatus("error");
      setMessage("Resposta inválida do Steam.");
      return;
    }

    link({ data: { params } })
      .then((res) => {
        setStatus("ok");
        setMessage(`Conectado como ${res.persona}`);
        qc.invalidateQueries({ queryKey: ["profile"] });
        qc.invalidateQueries({ queryKey: ["steam-library"] });
        toast.success("Steam conectado!");
        setTimeout(() => navigate({ to: "/profile" }), 1200);
      })
      .catch((e: Error) => {
        setStatus("error");
        setMessage(e.message || "Falha ao conectar Steam");
        toast.error(e.message);
      });
  }, [loading, user, link, navigate, qc]);

  return (
    <div className="min-h-screen pt-32 grid place-items-center px-4">
      <div className="max-w-md w-full text-center space-y-4 rounded-2xl border border-border bg-card/70 backdrop-blur p-8">
        {status === "working" && <Loader2 className="size-10 mx-auto animate-spin text-neon-cyan" />}
        {status === "ok" && <CheckCircle2 className="size-10 mx-auto text-neon-cyan" />}
        {status === "error" && <XCircle className="size-10 mx-auto text-neon-pink" />}
        <h1 className="font-display text-xl text-glow-pink">Vinculando Steam</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        {status === "error" && (
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="text-neon-cyan text-sm hover:underline"
          >
            Voltar para o perfil
          </button>
        )}
      </div>
    </div>
  );
}
