const { readdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { getCategoryId } = require("./generate-comparisons");
const {
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  getComparisonMeta,
} = require("../lib/seo.cjs");

const dataDirectory = path.resolve(__dirname, "..", "data");
const locales = ["en", "es", "de", "fr", "pl"];

const technologyCategories = {
  frontend: new Set([
    "angular", "astro", "gatsby", "nextjs", "nuxt", "qwik", "react",
    "remix", "solidjs", "svelte", "vite", "vue", "webpack",
  ]),
  backend: new Set([
    "actix-web", "bun", "deno", "express", "fastapi", "fastify", "go-gin",
    "graphql", "hono", "nestjs", "node", "nodejs", "python", "rest",
    "temporal",
  ]),
  databases: new Set([
    "appwrite", "astra-db", "cassandra", "clickhouse", "cockroachdb",
    "duckdb", "firebase", "firestore", "memcached", "mongodb", "mongoose",
    "mysql", "postgresql", "prisma", "redis", "scylladb", "sqlite",
    "supabase", "typeorm",
  ]),
  "ai-models": new Set([
    "anthropic", "autogen", "chroma", "claude", "command-r-plus", "crewai",
    "deepseek", "gemini", "gemma", "gpt", "langchain", "llama", "llamaindex",
    "mistral", "ollama", "openai", "phi", "pinecone", "qdrant", "qwen",
    "vllm", "weaviate",
  ]),
  devops: new Set([
    "aws", "azure", "cloudflare", "docker", "gcp", "kubernetes", "netlify",
    "nomad", "openfga", "podman", "pulumi", "terraform", "turborepo",
    "vercel",
  ]),
  css: new Set([
    "bootstrap", "chakra-ui", "css-modules", "mantine", "shadcn",
    "styled-components", "tailwind", "tailwindcss",
  ]),
};

const categoryPriority = [
  "frontend",
  "backend",
  "databases",
  "ai-models",
  "devops",
  "css",
];

function inferCategory(slug) {
  const technologies = slug.split("-vs-");
  const matched = categoryPriority.filter((category) =>
    technologies.some(
      (technology) =>
        technologyCategories[category].has(technology) ||
        [...technologyCategories[category]].some((key) =>
          technology.startsWith(key),
        ),
    ),
  );
  return matched[0] ?? "general";
}

function resolveCategory(slug) {
  const category = getCategoryId(slug);
  return category === "general" ? inferCategory(slug) : category;
}

function normalizeMeta(comparison, slug, locale, fileName) {
  const toolA = comparison.toolA?.name;
  const toolB = comparison.toolB?.name;
  if (typeof toolA !== "string" || typeof toolB !== "string") {
    throw new Error(`Missing tool names in ${fileName}.`);
  }

  const meta = getComparisonMeta(toolA, toolB, resolveCategory(slug), locale);
  if (meta.title.length > SEO_TITLE_MAX) {
    throw new Error(`Title exceeds ${SEO_TITLE_MAX} characters in ${fileName}.`);
  }
  if (meta.description.length > SEO_DESCRIPTION_MAX) {
    throw new Error(
      `Description exceeds ${SEO_DESCRIPTION_MAX} characters in ${fileName}.`,
    );
  }
  if (meta.description.length < 100) {
    throw new Error(`Description is shorter than 100 characters in ${fileName}.`);
  }

  return { ...comparison, meta: { title: meta.title, description: meta.description } };
}

function main() {
  let updated = 0;
  let unchanged = 0;
  const directories = [
    ...locales.map((locale) => ({
      directory: path.join(dataDirectory, locale),
      locale,
    })),
    { directory: dataDirectory, locale: "pl" },
  ];

  for (const { directory, locale } of directories) {
    for (const fileName of readdirSync(directory).filter((name) => name.endsWith(".json"))) {
      const filePath = path.join(directory, fileName);
      const slug = fileName.slice(0, -".json".length);
      const comparison = JSON.parse(readFileSync(filePath, "utf8"));
      if (comparison.slug !== slug) {
        throw new Error(`Slug mismatch in ${filePath}.`);
      }

      const normalized = normalizeMeta(comparison, slug, locale, filePath);
      const content = `${JSON.stringify(normalized, null, 2)}\n`;
      const previous = readFileSync(filePath, "utf8");
      if (content === previous) {
        unchanged += 1;
        continue;
      }

      writeFileSync(filePath, content, "utf8");
      updated += 1;
    }
  }

  console.log(
    `[seo] Updated metadata in ${updated} comparison files; ${unchanged} already compliant.`,
  );
}

main();
