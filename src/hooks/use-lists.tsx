import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export type UserList = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  items_count?: number;
};

export type UserListItem = {
  list_id: string;
  game_id: string;
  position: number;
  added_at: string;
};

export function useMyLists() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_lists", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<UserList[]> => {
      const { data, error } = await supabase
        .from("user_lists")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return [];
      const ids = data.map((l) => l.id);
      const { data: items } = await supabase
        .from("user_list_items")
        .select("list_id")
        .in("list_id", ids);
      const counts = new Map<string, number>();
      (items ?? []).forEach((i) => counts.set(i.list_id, (counts.get(i.list_id) ?? 0) + 1));
      return data.map((l) => ({ ...l, items_count: counts.get(l.id) ?? 0 }));
    },
  });
}

export function usePublicList(listId: string) {
  return useQuery({
    queryKey: ["user_list", listId],
    queryFn: async () => {
      const { data: list, error } = await supabase
        .from("user_lists")
        .select("*")
        .eq("id", listId)
        .maybeSingle();
      if (error) throw error;
      if (!list) return null;
      const { data: items } = await supabase
        .from("user_list_items")
        .select("*")
        .eq("list_id", listId)
        .order("position", { ascending: true });
      const { data: owner } = await supabase
        .from("profiles")
        .select("id,display_name,username,avatar_url")
        .eq("id", list.user_id)
        .maybeSingle();
      return { list: list as UserList, items: (items ?? []) as UserListItem[], owner };
    },
  });
}

export function useCreateList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; description?: string; is_public?: boolean }) => {
      if (!user) throw new Error("not-auth");
      const { data, error } = await supabase
        .from("user_lists")
        .insert({
          user_id: user.id,
          title: input.title.trim(),
          description: input.description?.trim() || null,
          is_public: input.is_public ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user_lists", user?.id] });
      toast.success("Lista criada");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string; title?: string; description?: string | null; is_public?: boolean }) => {
      const { error } = await supabase.from("user_lists").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["user_lists", user?.id] });
      qc.invalidateQueries({ queryKey: ["user_list", vars.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_lists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user_lists", user?.id] });
      toast.success("Lista removida");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleListItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ listId, gameId, on }: { listId: string; gameId: string; on: boolean }) => {
      if (on) {
        const { error } = await supabase
          .from("user_list_items")
          .insert({ list_id: listId, game_id: gameId, position: 0 });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("user_list_items")
          .delete()
          .match({ list_id: listId, game_id: gameId });
        if (error) throw error;
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["user_list", vars.listId] });
      qc.invalidateQueries({ queryKey: ["user_lists"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
