import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFollowingIds } from "./use-follows";
import { useAuth } from "./use-auth";

export type FeedItem =
  | {
      kind: "review";
      id: string;
      created_at: string;
      user_id: string;
      game_id: string;
      rating: number;
      body: string | null;
    }
  | {
      kind: "list";
      id: string;
      created_at: string;
      user_id: string;
      title: string;
      description: string | null;
    }
  | {
      kind: "follow";
      id: string;
      created_at: string;
      user_id: string;
      target_user_id: string;
    }
  | {
      kind: "status";
      id: string;
      created_at: string;
      user_id: string;
      game_id: string;
      status: string;
    };

export type FeedProfile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export function useFeed(scope: "global" | "following") {
  const { user } = useAuth();
  const { data: followingIds } = useFollowingIds();

  return useQuery({
    queryKey: ["feed", scope, user?.id, (followingIds ?? []).join(",")],
    enabled: scope === "global" || !!user,
    queryFn: async (): Promise<{ items: FeedItem[]; profiles: Map<string, FeedProfile> }> => {
      const userFilter = scope === "following" ? (followingIds ?? []) : null;
      if (scope === "following" && (!userFilter || userFilter.length === 0)) {
        return { items: [], profiles: new Map() };
      }

      const reviewsQ = supabase
        .from("reviews")
        .select("id,created_at,user_id,game_id,rating,body")
        .order("created_at", { ascending: false })
        .limit(40);
      if (userFilter) reviewsQ.in("user_id", userFilter);

      const listsQ = supabase
        .from("user_lists")
        .select("id,created_at,user_id,title,description,is_public")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(20);
      if (userFilter) listsQ.in("user_id", userFilter);

      const followsQ = supabase
        .from("follows")
        .select("follower_id,following_id,created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (userFilter) followsQ.in("follower_id", userFilter);

      const [reviewsR, listsR, followsR] = await Promise.all([reviewsQ, listsQ, followsQ]);

      const items: FeedItem[] = [];
      (reviewsR.data ?? []).forEach((r) =>
        items.push({ kind: "review", id: r.id, created_at: r.created_at, user_id: r.user_id, game_id: r.game_id, rating: Number(r.rating), body: r.body }),
      );
      (listsR.data ?? []).forEach((l) =>
        items.push({ kind: "list", id: l.id, created_at: l.created_at, user_id: l.user_id, title: l.title, description: l.description }),
      );
      (followsR.data ?? []).forEach((f) =>
        items.push({
          kind: "follow",
          id: `${f.follower_id}-${f.following_id}`,
          created_at: f.created_at,
          user_id: f.follower_id,
          target_user_id: f.following_id,
        }),
      );

      items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      const top = items.slice(0, 50);

      const userIds = new Set<string>();
      top.forEach((i) => {
        userIds.add(i.user_id);
        if (i.kind === "follow") userIds.add(i.target_user_id);
      });

      const { data: profs } = await supabase
        .from("profiles")
        .select("id,display_name,username,avatar_url")
        .in("id", Array.from(userIds));

      const profiles = new Map<string, FeedProfile>();
      (profs ?? []).forEach((p) => profiles.set(p.id, p));

      return { items: top, profiles };
    },
  });
}
