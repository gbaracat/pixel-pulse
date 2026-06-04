import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export function useFollowCounts(userId: string | undefined) {
  return useQuery({
    queryKey: ["follow_counts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [followers, following] = await Promise.all([
        supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", userId!),
        supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", userId!),
      ]);
      return { followers: followers.count ?? 0, following: following.count ?? 0 };
    },
  });
}

export function useIsFollowing(targetUserId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is_following", user?.id, targetUserId],
    enabled: !!user && !!targetUserId && user.id !== targetUserId,
    queryFn: async () => {
      const { data } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user!.id)
        .eq("following_id", targetUserId!)
        .maybeSingle();
      return !!data;
    },
  });
}

export function useToggleFollow(targetUserId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (on: boolean) => {
      if (!user) throw new Error("not-auth");
      if (user.id === targetUserId) throw new Error("self");
      if (on) {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: targetUserId });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .delete()
          .match({ follower_id: user.id, following_id: targetUserId });
        if (error) throw error;
      }
    },
    onSuccess: (_d, on) => {
      qc.invalidateQueries({ queryKey: ["is_following", user?.id, targetUserId] });
      qc.invalidateQueries({ queryKey: ["follow_counts", targetUserId] });
      qc.invalidateQueries({ queryKey: ["follow_counts", user?.id] });
      qc.invalidateQueries({ queryKey: ["following_ids", user?.id] });
      qc.invalidateQueries({ queryKey: ["feed"] });
      toast.success(on ? "Seguindo" : "Deixou de seguir");
    },
    onError: (e: Error) => {
      if (e.message === "not-auth") toast.error("Faça login para seguir usuários");
      else if (e.message !== "self") toast.error(e.message);
    },
  });
}

export function useFollowingIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["following_ids", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.following_id);
    },
  });
}
