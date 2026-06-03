import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function useUploadBanner() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("not-auth");
      if (!ALLOWED.includes(file.type)) throw new Error("Use JPG, PNG ou WEBP");
      if (file.size > MAX_BYTES) throw new Error("Imagem muito grande (máx 5MB)");
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${user.id}/banner-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error } = await supabase
        .from("profiles")
        .update({ banner_url: pub.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      return pub.publicUrl;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Banner atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemoveBanner() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("not-auth");
      const { data: list } = await supabase.storage.from("avatars").list(user.id);
      const banners = (list ?? []).filter((f) => f.name.startsWith("banner-"));
      if (banners.length) {
        await supabase.storage.from("avatars").remove(banners.map((f) => `${user.id}/${f.name}`));
      }
      const { error } = await supabase
        .from("profiles")
        .update({ banner_url: null, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Banner removido");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
