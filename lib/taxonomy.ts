import type { Locale } from "./locales";

export const CATEGORY_IDS = [
  "frontend",
  "backend",
  "databases",
  "ai-models",
  "devops",
  "css",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const categoryCopy: Record<
  Locale,
  Record<CategoryId, { name: string; description: string; summary: string }>
> = {
  pl: {
    frontend: {
      name: "Frontend",
      description:
        "Porównania bibliotek interfejsów, frameworków frontendowych i meta-frameworków do budowy nowoczesnych aplikacji webowych.",
      summary: "Frameworki i biblioteki interfejsów webowych.",
    },
    backend: {
      name: "Backend",
      description:
        "Porównania środowisk uruchomieniowych, frameworków serwerowych i narzędzi do budowy API oraz usług backendowych.",
      summary: "Runtime'y, frameworki serwerowe i platformy API.",
    },
    databases: {
      name: "Bazy danych",
      description:
        "Porównania relacyjnych i nierelacyjnych baz danych, magazynów danych, cache oraz narzędzi ORM.",
      summary: "Bazy SQL i NoSQL, cache oraz narzędzia ORM.",
    },
    "ai-models": {
      name: "AI i LLM",
      description:
        "Porównania modeli AI, platform LLM, narzędzi agentowych i baz wektorowych. Sprawdź parametry, benchmarki, ceny API za milion tokenów, długość okna kontekstowego, opóźnienia i typowe zastosowania; wartości mogą zależeć od wersji i dostawcy.",
      summary: "Modele, agenci, benchmarki, ceny API i bazy wektorowe.",
    },
    devops: {
      name: "DevOps i Cloud",
      description:
        "Porównania narzędzi konteneryzacji, orkiestracji, infrastruktury jako kodu oraz usług chmurowych.",
      summary: "Kontenery, infrastruktura, orkiestracja i chmura.",
    },
    css: {
      name: "CSS i UI",
      description:
        "Porównania frameworków CSS, bibliotek komponentów i rozwiązań do stylowania interfejsów użytkownika.",
      summary: "Frameworki stylowania i biblioteki UI.",
    },
  },
  en: {
    frontend: {
      name: "Frontend",
      description:
        "Compare UI libraries, frontend frameworks, and meta-frameworks for building modern web applications.",
      summary: "Frameworks and libraries for web interfaces.",
    },
    backend: {
      name: "Backend",
      description:
        "Compare runtimes, server frameworks, and tools for building APIs and backend services.",
      summary: "Runtimes, server frameworks, and API platforms.",
    },
    databases: {
      name: "Databases",
      description:
        "Compare relational and non-relational databases, data stores, caches, and ORM tools.",
      summary: "SQL and NoSQL databases, caches, and ORMs.",
    },
    "ai-models": {
      name: "AI & LLMs",
      description:
        "Compare AI models, LLM platforms, agent frameworks, and vector databases. Review model capabilities, benchmarks, API pricing per million tokens, context windows, latency, and use cases; specifications can vary by version and provider.",
      summary: "Models, agents, benchmarks, API costs, and vector databases.",
    },
    devops: {
      name: "DevOps & Cloud",
      description:
        "Compare containerization, orchestration, infrastructure-as-code tools, and cloud services.",
      summary: "Containers, infrastructure, orchestration, and cloud.",
    },
    css: {
      name: "CSS & UI",
      description:
        "Compare CSS frameworks, component libraries, and styling solutions for user interfaces.",
      summary: "Styling frameworks and UI libraries.",
    },
  },
  es: {
    frontend: {
      name: "Frontend",
      description:
        "Compara bibliotecas de interfaz, frameworks frontend y meta-frameworks para crear aplicaciones web modernas.",
      summary: "Frameworks y bibliotecas para interfaces web.",
    },
    backend: {
      name: "Backend",
      description:
        "Compara runtimes, frameworks de servidor y herramientas para crear API y servicios backend.",
      summary: "Runtimes, frameworks de servidor y plataformas API.",
    },
    databases: {
      name: "Bases de datos",
      description:
        "Compara bases de datos relacionales y no relacionales, almacenes, cachés y herramientas ORM.",
      summary: "Bases SQL y NoSQL, cachés y herramientas ORM.",
    },
    "ai-models": {
      name: "IA y LLM",
      description:
        "Compara modelos de IA, plataformas LLM, frameworks de agentes y bases de datos vectoriales. Consulta capacidades, benchmarks, precios de API por millón de tokens, ventanas de contexto, latencia y usos; las especificaciones pueden variar según la versión y el proveedor.",
      summary: "Modelos, agentes, benchmarks, costes de API y bases vectoriales.",
    },
    devops: {
      name: "DevOps y Cloud",
      description:
        "Compara herramientas de contenedores, orquestación, infraestructura como código y servicios en la nube.",
      summary: "Contenedores, infraestructura, orquestación y nube.",
    },
    css: {
      name: "CSS e UI",
      description:
        "Compara frameworks CSS, bibliotecas de componentes y soluciones de estilos para interfaces de usuario.",
      summary: "Frameworks de estilos y bibliotecas UI.",
    },
  },
  de: {
    frontend: {
      name: "Frontend",
      description:
        "Vergleiche UI-Bibliotheken, Frontend-Frameworks und Meta-Frameworks für moderne Webanwendungen.",
      summary: "Frameworks und Bibliotheken für Weboberflächen.",
    },
    backend: {
      name: "Backend",
      description:
        "Vergleiche Laufzeitumgebungen, Server-Frameworks und Tools zum Erstellen von APIs und Backend-Diensten.",
      summary: "Laufzeitumgebungen, Server-Frameworks und API-Plattformen.",
    },
    databases: {
      name: "Datenbanken",
      description:
        "Vergleiche relationale und nicht relationale Datenbanken, Datenspeicher, Caches und ORM-Tools.",
      summary: "SQL- und NoSQL-Datenbanken, Caches und ORMs.",
    },
    "ai-models": {
      name: "KI & LLMs",
      description:
        "Vergleiche KI-Modelle, LLM-Plattformen, Agenten-Frameworks und Vektordatenbanken. Berücksichtige Fähigkeiten, Benchmarks, API-Preise pro Million Tokens, Kontextfenster, Latenz und Einsatzgebiete; Angaben können je nach Version und Anbieter variieren.",
      summary: "Modelle, Agenten, Benchmarks, API-Kosten und Vektordatenbanken.",
    },
    devops: {
      name: "DevOps & Cloud",
      description:
        "Vergleiche Containerisierung, Orchestrierung, Infrastructure-as-Code-Tools und Cloud-Dienste.",
      summary: "Container, Infrastruktur, Orchestrierung und Cloud.",
    },
    css: {
      name: "CSS & UI",
      description:
        "Vergleiche CSS-Frameworks, Komponentenbibliotheken und Styling-Lösungen für Benutzeroberflächen.",
      summary: "Styling-Frameworks und UI-Bibliotheken.",
    },
  },
  fr: {
    frontend: {
      name: "Frontend",
      description:
        "Comparez les bibliothèques d’interface, frameworks frontend et méta-frameworks pour créer des applications web modernes.",
      summary: "Frameworks et bibliothèques pour les interfaces web.",
    },
    backend: {
      name: "Backend",
      description:
        "Comparez les environnements d’exécution, frameworks serveur et outils de création d’API et de services backend.",
      summary: "Environnements d’exécution, frameworks serveur et plateformes API.",
    },
    databases: {
      name: "Bases de données",
      description:
        "Comparez les bases de données relationnelles et non relationnelles, les caches, les stockages et les outils ORM.",
      summary: "Bases SQL et NoSQL, caches et outils ORM.",
    },
    "ai-models": {
      name: "IA et LLM",
      description:
        "Comparez les modèles d’IA, plateformes LLM, frameworks d’agents et bases vectorielles. Examinez les capacités, benchmarks, tarifs API par million de jetons, fenêtres de contexte, latence et cas d’usage ; les spécifications varient selon la version et le fournisseur.",
      summary: "Modèles, agents, benchmarks, coûts API et bases vectorielles.",
    },
    devops: {
      name: "DevOps et Cloud",
      description:
        "Comparez les outils de conteneurisation, d’orchestration, d’infrastructure as code et les services cloud.",
      summary: "Conteneurs, infrastructure, orchestration et cloud.",
    },
    css: {
      name: "CSS et UI",
      description:
        "Comparez les frameworks CSS, bibliothèques de composants et solutions de style pour les interfaces utilisateur.",
      summary: "Frameworks de style et bibliothèques UI.",
    },
  },
};

const technologyCategories: Record<string, CategoryId[]> = {
  actix: ["backend"],
  "actix-web": ["backend"],
  angular: ["frontend"],
  anthropic: ["ai-models"],
  "claude-3-5-sonnet": ["ai-models"],
  "claude-3-7-sonnet": ["ai-models"],
  "claude-fable-5-1": ["ai-models"],
  "claude-opus-5-5": ["ai-models"],
  "command-r-plus": ["ai-models"],
  appwrite: ["backend", "databases"],
  astro: ["frontend"],
  autogen: ["ai-models"],
  aws: ["devops"],
  azure: ["devops"],
  bootstrap: ["css"],
  bun: ["backend"],
  cassandra: ["databases"],
  clickhouse: ["databases"],
  "chakra-ui": ["css"],
  chroma: ["ai-models", "databases"],
  cloudflare: ["devops"],
  crewai: ["ai-models"],
  css: ["css"],
  "css-modules": ["css"],
  deno: ["backend"],
  "deepseek-r1": ["ai-models"],
  "deepseek-v3": ["ai-models"],
  drizzle: ["databases"],
  duckdb: ["databases"],
  express: ["backend"],
  "fable-5-1": ["ai-models"],
  "gemini-2-5-flash": ["ai-models"],
  "gemini-2-5-pro": ["ai-models"],
  "gemma-3": ["ai-models"],
  fastapi: ["backend"],
  fastify: ["backend"],
  firebase: ["backend", "databases"],
  flutter: ["frontend"],
  gatsby: ["frontend"],
  "go-gin": ["backend"],
  gcp: ["devops"],
  gin: ["backend"],
  graphql: ["backend"],
  hono: ["backend"],
  javascript: ["backend", "frontend"],
  kubernetes: ["devops"],
  langchain: ["ai-models"],
  llama: ["ai-models"],
  llamaindex: ["ai-models"],
  "llama-3-3": ["ai-models"],
  mantine: ["css"],
  memcached: ["databases"],
  mistral: ["ai-models"],
  "mistral-large": ["ai-models"],
  "mistral-small": ["ai-models"],
  mongodb: ["databases"],
  mongoose: ["databases"],
  mysql: ["databases"],
  nestjs: ["backend"],
  netlify: ["devops"],
  nextjs: ["frontend", "backend"],
  node: ["backend"],
  nodejs: ["backend"],
  nomad: ["devops"],
  inngest: ["backend"],
  nx: ["devops"],
  nuxt: ["frontend", "backend"],
  ollama: ["ai-models"],
  openai: ["ai-models"],
  "openai-o1": ["ai-models"],
  "openai-o3": ["ai-models"],
  openfga: ["backend"],
  pinecone: ["ai-models", "databases"],
  podman: ["devops"],
  "phi-4": ["ai-models"],
  postgresql: ["databases"],
  prisma: ["databases"],
  pulumi: ["devops"],
  python: ["backend", "ai-models"],
  "qwen-2-5": ["ai-models"],
  "qwen-qwq": ["ai-models"],
  qwen3: ["ai-models"],
  "gpt-4-1": ["ai-models"],
  "gpt-4o": ["ai-models"],
  "gpt-4o-mini": ["ai-models"],
  "astra-db": ["ai-models", "databases"],
  qdrant: ["ai-models", "databases"],
  qwik: ["frontend"],
  react: ["frontend"],
  "react-native": ["frontend"],
  redis: ["databases"],
  remix: ["frontend", "backend"],
  scylladb: ["databases"],
  shadcn: ["css"],
  "shadcn-ui": ["css"],
  shopify: ["backend"],
  solidjs: ["frontend"],
  sqlite: ["databases"],
  "styled-components": ["css"],
  svelte: ["frontend"],
  supabase: ["backend", "databases"],
  tailwind: ["css"],
  tailwindcss: ["css"],
  temporal: ["backend"],
  terraform: ["devops"],
  typeorm: ["databases"],
  turborepo: ["devops"],
  vercel: ["devops"],
  vllm: ["ai-models"],
  vite: ["frontend"],
  vue: ["frontend"],
  weaviate: ["ai-models", "databases"],
  webpack: ["frontend"],
};

export function getTechnologyCategories(technology: string): CategoryId[] {
  return technologyCategories[technology.toLocaleLowerCase()] ?? [];
}

export function getComparisonCategories(slug: string): CategoryId[] {
  const categories = new Set(
    slug
      .split("-vs-")
      .flatMap((technology) => getTechnologyCategories(technology)),
  );

  return CATEGORY_IDS.filter((category) => categories.has(category));
}
