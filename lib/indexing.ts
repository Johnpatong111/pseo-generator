import type { Locale } from "./locales";

/**
 * Languages that are allowed to appear in sitemap.xml, hreflang and indexable
 * metadata. Add a locale here when its translated content is ready for search.
 */
export const INDEXABLE_LOCALES = ["en", "es", "de", "fr", "pl"] as const;

export type IndexableLocale = (typeof INDEXABLE_LOCALES)[number];

/**
 * Kuratorowany rdzeń porównań. Tylko te strony mogą być indeksowane.
 * Reszta (wygenerowane kombinacje bez realnego popytu) dostaje noindex
 * i nie trafia do sitemapy — inaczej Google indeksuje setki thin pages
 * i pokazuje je na losowe zapytania typu "parcel vs hono".
 */
export const CURATED_COMPARISON_SLUGS = new Set<string>([
  // Frontend / UI
  "react-vs-vue",
  "nextjs-vs-nuxt",
  "astro-vs-nextjs",
  "astro-vs-gatsby",
  "tailwind-vs-bootstrap",
  "bootstrap-vs-mantine",
  "bootstrap-vs-chakra-ui",
  "bootstrap-vs-shadcn",
  "chakra-ui-vs-mantine",
  "chakra-ui-vs-styled-components",
  "chakra-ui-vs-css-modules",
  "mantine-vs-styled-components",
  "tailwind-vs-mantine",
  "tailwind-vs-shadcn",
  "tailwind-vs-css-modules",
  // Backend / runtime
  "bun-vs-node",
  "bun-vs-deno",
  "bun-vs-hono",
  "deno-vs-hono",
  "node-vs-express",
  "node-vs-fastify",
  "express-vs-hono",
  "fastify-vs-express",
  "fastify-vs-hono",
  "nestjs-vs-hono",
  "go-gin-vs-fastapi",
  "go-gin-vs-nestjs",
  "actix-web-vs-fastapi",
  "actix-web-vs-go-gin",
  "hono-vs-fastapi",
  "react-vs-solidjs",
  "shadcn-vs-chakra-ui",
  "vite-vs-webpack",
  // Databases
  "postgresql-vs-mongodb",
  "postgresql-vs-redis",
  "postgresql-vs-sqlite",
  "postgresql-vs-cassandra",
  "mongodb-vs-redis",
  "mysql-vs-sqlite",
  "redis-vs-memcached",
  "cassandra-vs-scylladb",
  "prisma-vs-mongoose",
  // Cloud / DevOps
  "aws-vs-azure",
  "aws-vs-gcp",
  "azure-vs-cloudflare",
  "cloudflare-vs-aws",
  "vercel-vs-netlify",
  "docker-vs-kubernetes",
  "docker-vs-podman",
  "podman-vs-kubernetes",
  "terraform-vs-pulumi",
  "pulumi-vs-kubernetes",
  "vllm-vs-mistral",
  // AI / data
  "langchain-vs-llamaindex",
  "autogen-vs-crewai",
  "openai-vs-anthropic",
  "claude-3-5-sonnet-vs-gpt-4o",
  "claude-3-7-sonnet-vs-gpt-4-1",
  "claude-3-5-sonnet-vs-claude-3-7-sonnet",
  "chroma-vs-qdrant",
  "astra-db-vs-qdrant",
  "openfga-vs-aws",
]);

export function isCuratedComparison(slug: string): boolean {
  return CURATED_COMPARISON_SLUGS.has(slug);
}


export function isIndexableLocale(locale: Locale): locale is IndexableLocale {
  return (INDEXABLE_LOCALES as readonly Locale[]).includes(locale);
}

export function getCanonicalLocale(locale: Locale): IndexableLocale {
  return isIndexableLocale(locale) ? locale : "en";
}
