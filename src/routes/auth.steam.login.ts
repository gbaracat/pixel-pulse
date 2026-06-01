import { createFileRoute } from "@tanstack/react-router";
import { buildSteamOpenIdRedirect } from "@/lib/steam.server";

export const Route = createFileRoute("/auth/steam/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const realm = `${url.protocol}//${url.host}`;
        const returnTo = `${realm}/auth/steam/return`;
        const redirectUrl = buildSteamOpenIdRedirect(returnTo, realm);
        return new Response(null, {
          status: 302,
          headers: { Location: redirectUrl },
        });
      },
    },
  },
});
