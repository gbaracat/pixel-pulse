import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  steam_id: string | null;
  steam_persona_name: string | null;
  steam_avatar_url: string | null;
  steam_profile_url: string | null;
  steam_visibility: number | null;
  steam_linked_at: string | null;
  banner_url: string | null;
  favorite_game_ids: string[];
  created_at: string;
  updated_at: string;
};

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: {
      display_name?: string | null;
      bio?: string | null;
      avatar_url?: string | null;
      banner_url?: string | null;
      favorite_game_ids?: string[];
    }) => {
      if (!user) throw new Error("not-auth");
      const { error } = await supabase
        .from("profiles")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Perfil atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function useUploadAvatar() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("not-auth");
      if (!ALLOWED.includes(file.type)) throw new Error("Formato inválido. Use JPG, PNG, WEBP ou GIF.");
      if (file.size > MAX_BYTES) throw new Error("Imagem muito grande (máx 3MB).");
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = pub.publicUrl;
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updErr) throw updErr;
      return url;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Foto atualizada");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemoveAvatar() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("not-auth");
      const { data: list } = await supabase.storage.from("avatars").list(user.id);
      if (list && list.length) {
        await supabase.storage.from("avatars").remove(list.map((f) => `${user.id}/${f.name}`));
      }
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Foto removida");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
