import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getSteamLibrary, unlinkSteamAccount } from "@/lib/steam.functions";
import { useAuth } from "./use-auth";

export function useSteamLibrary() {
  const { user } = useAuth();
  const fn = useServerFn(getSteamLibrary);
  return useQuery({
    queryKey: ["steam-library", user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    queryFn: () => fn(),
  });
}

export function useUnlinkSteam() {
  const qc = useQueryClient();
  const fn = useServerFn(unlinkSteamAccount);
  return useMutation({
    mutationFn: () => fn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["steam-library"] });
      toast.success("Steam desvinculado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
