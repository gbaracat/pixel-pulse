import { createServerFn } from "@tanstack/react-start";
import { findTrailer } from "./trailers.server";

export const getTrailerLink = createServerFn({ method: "GET" })
  .inputValidator((data: { title: string }) => {
    if (!data?.title || typeof data.title !== "string" || data.title.length > 200) {
      throw new Error("Invalid title");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const link = await findTrailer(data.title);
    return { link };
  });
