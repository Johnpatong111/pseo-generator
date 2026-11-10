import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/products"],
        disallow: [
          // No API routes are part of the static export; keep bots away from them.
          "/api/",
          // Query-string URLs are duplicates of the clean canonical URLs.
          "/*?",
        ],
      },
    ],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL.origin,
  };
}
