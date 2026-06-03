import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export type Review = {
  id: string;
  user_id: string;
  game_id: string;
  rating: number;
  body: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  likes_count: number;
  comments_count: number;
  liked_by_me: boolean;
};

export function useGameReviews(gameId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reviews", gameId, user?.id ?? null],
    queryFn: async (): Promise<Review[]> => {
      const { data: rows, error } = await supabase
        .from("reviews")
        .select("id,user_id,game_id,rating,body,created_at,updated_at")
        .eq("game_id", gameId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!rows || rows.length === 0) return [];

      const ids = rows.map((r) => r.id);
      const userIds = [...new Set(rows.map((r) => r.user_id))];

      const [profilesRes, likesRes, commentsRes, myLikesRes] = await Promise.all([
        supabase.from("profiles").select("id,display_name,username,avatar_url").in("id", userIds),
        supabase.from("review_likes").select("review_id").in("review_id", ids),
        supabase.from("review_comments").select("review_id").in("review_id", ids),
        user
          ? supabase.from("review_likes").select("review_id").in("review_id", ids).eq("user_id", user.id)
          : Promise.resolve({ data: [] as { review_id: string }[], error: null }),
      ]);

      const profMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
      const likeCount = new Map<string, number>();
      (likesRes.data ?? []).forEach((l) => likeCount.set(l.review_id, (likeCount.get(l.review_id) ?? 0) + 1));
      const commentCount = new Map<string, number>();
      (commentsRes.data ?? []).forEach((c) => commentCount.set(c.review_id, (commentCount.get(c.review_id) ?? 0) + 1));
      const myLikes = new Set((myLikesRes.data ?? []).map((l) => l.review_id));

      return rows.map((r) => ({
        ...r,
        profile: profMap.get(r.user_id) ?? null,
        likes_count: likeCount.get(r.id) ?? 0,
        comments_count: commentCount.get(r.id) ?? 0,
        liked_by_me: myLikes.has(r.id),
      }));
    },
  });
}

export function useMyReview(gameId: string) {
  const { data } = useGameReviews(gameId);
  const { user } = useAuth();
  if (!user) return null;
  return data?.find((r) => r.user_id === user.id) ?? null;
}

export function useGameRatingAvg(gameId: string) {
  const { data } = useGameReviews(gameId);
  if (!data || data.length === 0) return null;
  const avg = data.reduce((s, r) => s + Number(r.rating), 0) / data.length;
  return { avg, count: data.length };
}

export function useUpsertReview(gameId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rating, body }: { rating: number; body: string }) => {
      if (!user) throw new Error("not-auth");
      const { error } = await supabase
        .from("reviews")
        .upsert(
          { user_id: user.id, game_id: gameId, rating, body: body.trim() || null },
          { onConflict: "user_id,game_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", gameId] });
      toast.success("Review publicada");
    },
    onError: (e: Error) => {
      if (e.message === "not-auth") toast.error("Faça login para escrever uma review");
      else toast.error(e.message);
    },
  });
}

export function useDeleteReview(gameId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error("not-auth");
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", gameId] });
      toast.success("Review removida");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleReviewLike(gameId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, on }: { reviewId: string; on: boolean }) => {
      if (!user) throw new Error("not-auth");
      if (on) {
        const { error } = await supabase.from("review_likes").insert({ review_id: reviewId, user_id: user.id });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase.from("review_likes").delete().match({ review_id: reviewId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews", gameId] }),
    onError: (e: Error) => {
      if (e.message === "not-auth") toast.error("Faça login para curtir");
      else toast.error(e.message);
    },
  });
}

export type ReviewComment = {
  id: string;
  review_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profile?: { display_name: string | null; username: string | null; avatar_url: string | null } | null;
};

export function useReviewComments(reviewId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["review_comments", reviewId],
    enabled,
    queryFn: async (): Promise<ReviewComment[]> => {
      const { data, error } = await supabase
        .from("review_comments")
        .select("id,review_id,user_id,body,created_at")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return [];
      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,display_name,username,avatar_url")
        .in("id", userIds);
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      return data.map((c) => ({ ...c, profile: map.get(c.user_id) ?? null }));
    },
  });
}

export function useAddComment(reviewId: string, gameId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      if (!user) throw new Error("not-auth");
      const trimmed = body.trim();
      if (!trimmed) throw new Error("Comentário vazio");
      if (trimmed.length > 2000) throw new Error("Máximo 2000 caracteres");
      const { error } = await supabase
        .from("review_comments")
        .insert({ review_id: reviewId, user_id: user.id, body: trimmed });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["review_comments", reviewId] });
      qc.invalidateQueries({ queryKey: ["reviews", gameId] });
    },
    onError: (e: Error) => {
      if (e.message === "not-auth") toast.error("Faça login para comentar");
      else toast.error(e.message);
    },
  });
}

export function useDeleteComment(reviewId: string, gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("review_comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["review_comments", reviewId] });
      qc.invalidateQueries({ queryKey: ["reviews", gameId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
