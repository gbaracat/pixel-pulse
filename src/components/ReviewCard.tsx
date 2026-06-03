import { useState } from "react";
import { Star, Heart, MessageCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  type Review,
  useToggleReviewLike,
  useReviewComments,
  useAddComment,
  useDeleteComment,
} from "@/hooks/use-reviews";

function initials(name?: string | null) {
  if (!name) return "?";
  return name.trim().slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function ReviewCard({ review, gameId }: { review: Review; gameId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const toggleLike = useToggleReviewLike(gameId);
  const name = review.profile?.display_name || review.profile?.username || "Usuário";

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start gap-3">
        {review.profile?.avatar_url ? (
          <img src={review.profile.avatar_url} alt={name} className="size-10 rounded-full object-cover border border-border" />
        ) : (
          <div className="size-10 rounded-full bg-secondary grid place-items-center text-xs font-display text-neon-cyan border border-border">
            {initials(name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">· {timeAgo(review.created_at)}</span>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <Star
                key={n}
                className={`size-3 ${n <= review.rating ? "fill-neon-cyan text-neon-cyan" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="ml-2 font-display text-xs text-neon-cyan">{Number(review.rating).toFixed(1)}</span>
          </div>
        </div>
      </div>

      {review.body && <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{review.body}</p>}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <button
          onClick={() => toggleLike.mutate({ reviewId: review.id, on: !review.liked_by_me })}
          disabled={!user}
          className={`inline-flex items-center gap-1 hover:text-neon-pink transition ${review.liked_by_me ? "text-neon-pink" : ""}`}
        >
          <Heart className={`size-4 ${review.liked_by_me ? "fill-current" : ""}`} />
          <span>{review.likes_count}</span>
        </button>
        <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1 hover:text-neon-cyan transition">
          <MessageCircle className="size-4" />
          <span>{review.comments_count}</span>
        </button>
      </div>

      {open && <CommentsThread reviewId={review.id} gameId={gameId} />}
    </div>
  );
}

function CommentsThread({ reviewId, gameId }: { reviewId: string; gameId: string }) {
  const { user } = useAuth();
  const { data, isLoading } = useReviewComments(reviewId, true);
  const add = useAddComment(reviewId, gameId);
  const del = useDeleteComment(reviewId, gameId);
  const [body, setBody] = useState("");

  return (
    <div className="border-t border-border pt-4 space-y-3">
      {isLoading && <div className="text-xs text-muted-foreground">Carregando…</div>}
      {data?.map((c) => {
        const name = c.profile?.display_name || c.profile?.username || "Usuário";
        return (
          <div key={c.id} className="flex items-start gap-2 text-sm">
            {c.profile?.avatar_url ? (
              <img src={c.profile.avatar_url} alt={name} className="size-7 rounded-full object-cover border border-border" />
            ) : (
              <div className="size-7 rounded-full bg-secondary grid place-items-center text-[10px] font-display text-neon-cyan border border-border">
                {initials(name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs">{name}</span>
                <span className="text-[10px] text-muted-foreground">· {timeAgo(c.created_at)}</span>
                {user?.id === c.user_id && (
                  <button
                    onClick={() => del.mutate(c.id)}
                    className="ml-auto text-muted-foreground hover:text-neon-pink"
                    aria-label="Excluir"
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground/85 whitespace-pre-line">{c.body}</p>
            </div>
          </div>
        );
      })}
      {user && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim()) return;
            add.mutate(body, { onSuccess: () => setBody("") });
          }}
          className="flex gap-2 pt-1"
        >
          <input
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 2000))}
            placeholder="Comentar…"
            className="flex-1 rounded-md bg-background border border-border px-3 h-9 text-sm focus:border-neon-cyan outline-none"
          />
          <button
            type="submit"
            disabled={add.isPending || !body.trim()}
            className="px-3 h-9 rounded-md bg-secondary text-xs font-display hover:bg-neon-cyan/20 disabled:opacity-40"
          >
            ENVIAR
          </button>
        </form>
      )}
    </div>
  );
}
