import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserSearchResult = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export function useUserSearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: ["user_search", q.toLowerCase()],
    enabled: q.length >= 2,
    queryFn: async (): Promise<UserSearchResult[]> => {
      const like = `%${q}%`;
      const { data, error } = await supabase
        .from("profiles")
        .select("id,username,display_name,avatar_url,bio")
        .or(`username.ilike.${like},display_name.ilike.${like}`)
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}
