import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listEnrichedGames, type EnrichedGame } from "@/lib/games.functions";

export function useEnrichedGames() {
  const fetchFn = useServerFn(listEnrichedGames);
  return useQuery({
    queryKey: ["rawg-enrichment"],
    queryFn: () => fetchFn(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEnrichedGame(slug: string): EnrichedGame | undefined {
  const { data } = useEnrichedGames();
  return data?.[slug];
}
