import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export type ListStatus = "favorite" | "playing" | "completed" | "wishlist" | "abandoned";

export function useGameLists() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["game_lists", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_lists")
        .select("game_id, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useToggleListStatus() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ gameId, status, on }: { gameId: string; status: ListStatus; on: boolean }) => {
      if (!user) throw new Error("not-auth");
      if (on) {
        const { error } = await supabase.from("game_lists").insert({ user_id: user.id, game_id: gameId, status });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase.from("game_lists").delete().match({ user_id: user.id, game_id: gameId, status });
        if (error) throw error;
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["game_lists", user?.id] });
      const labels: Record<ListStatus, string> = {
        favorite: "Favoritos",
        playing: "Jogando",
        completed: "Zerados",
        wishlist: "Wishlist",
        abandoned: "Abandonados",
      };
      toast.success(vars.on ? `Adicionado a ${labels[vars.status]}` : `Removido de ${labels[vars.status]}`);
    },
    onError: (e: Error) => {
      if (e.message === "not-auth") toast.error("Faça login para salvar jogos");
      else toast.error(e.message);
    },
  });
}

export function useHasStatus(gameId: string, status: ListStatus) {
  const { data } = useGameLists();
  return !!data?.some((r) => r.game_id === gameId && r.status === status);
}
