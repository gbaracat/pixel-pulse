import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getTrailerLink } from "@/lib/trailers.functions";

export function useTrailer(title: string) {
  const fn = useServerFn(getTrailerLink);
  return useQuery({
    queryKey: ["trailer", title],
    queryFn: () => fn({ data: { title } }),
    staleTime: 5 * 60 * 1000,
    enabled: !!title,
  });
}

/** Convert a YouTube/Vimeo URL into an embeddable URL. Returns null if not embeddable. */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    // YouTube
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (host.endsWith("youtube.com") || host === "youtube-nocookie.com") {
      const id = u.searchParams.get("v") || u.pathname.split("/embed/")[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    // Vimeo
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    // Direct mp4/webm
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(u.pathname)) return url;
    return url; // fallback: trust the link
  } catch {
    return null;
  }
}
