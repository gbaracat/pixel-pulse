import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUpsertReview, useDeleteReview, type Review } from "@/hooks/use-reviews";
import { Link } from "@tanstack/react-router";

export function ReviewForm({ gameId, existing }: { gameId: string; existing: Review | null }) {
  const { user } = useAuth();
  const upsert = useUpsertReview(gameId);
  const del = useDeleteReview(gameId);
  const [rating, setRating] = useState<number>(existing?.rating ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const [body, setBody] = useState(existing?.body ?? "");

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <Link to="/login" className="text-neon-cyan underline">Entre</Link> para escrever uma review.
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating <= 0) return;
    upsert.mutate({ rating, body });
  };

  const display = hover ?? rating;

  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <div className="font-display text-xs text-glow-purple mb-2">SUA NOTA</div>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => setRating(n)}
              className="p-0.5"
              aria-label={`${n}/10`}
            >
              <Star className={`size-5 transition ${n <= display ? "fill-neon-cyan text-neon-cyan" : "text-muted-foreground/40"}`} />
            </button>
          ))}
          <span className="ml-3 font-display text-sm text-neon-cyan">{display > 0 ? `${display}/10` : "—"}</span>
        </div>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value.slice(0, 4000))}
        placeholder="Escreva sua review (opcional)…"
        rows={4}
        className="w-full rounded-md bg-background border border-border p-3 text-sm focus:border-neon-pink outline-none resize-y"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={upsert.isPending || rating <= 0}
          className="px-5 h-10 rounded-md bg-gradient-to-r from-neon-purple to-neon-pink text-background font-semibold disabled:opacity-40"
        >
          {existing ? "Atualizar review" : "Publicar review"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => del.mutate(existing.id)}
            className="px-4 h-10 rounded-md border border-border text-sm hover:border-neon-pink hover:text-neon-pink"
          >
            Excluir
          </button>
        )}
      </div>
    </form>
  );
}
