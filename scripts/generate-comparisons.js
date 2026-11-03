const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { loadEnvConfig } = require("@next/env");
const OpenAI = require("openai");
const { categories, comparisonSlugs } = require("./topics");
const { createCodeExamples } = require("../lib/snippet-catalog.cjs");
const {
  getComparisonSeoDescription,
  getComparisonSeoTitle,
} = require("../lib/seo.cjs");

const projectRoot = path.resolve(__dirname, "..");
loadEnvConfig(projectRoot);

const dataDirectory = path.join(projectRoot, "data");
const currentYear = new Date().getFullYear();
const deepDiveRequirements = {
  pl: `Napisz unikalny wstęp (180–500 znaków) opisujący konkretną różnicę, synergię lub konflikt architektoniczny między narzędziami, oparty na ich rzeczywistych cechach. Dodaj "decisionFramework" z osobną rekomendacją dla każdego narzędzia (80–400 znaków): wskaż profil projektu, wymaganie lub kompromis, dla którego ta opcja jest lepsza. Uwzględnij w kryteriach macierzy parametry takie jak wydajność, koszt, łatwość integracji, licencja i środowisko uruchomieniowe tylko wtedy, gdy mają zastosowanie; nie zgaduj nieznanych wartości ani nie powtarzaj generycznych treści.`,
  en: `Write a unique introduction (180–500 characters) explaining a concrete difference, synergy, or architectural trade-off between these tools, grounded in their actual characteristics. Add "decisionFramework" with a separate recommendation for each tool (80–400 characters): identify the project profile, requirement, or trade-off for which that option is preferable. Include matrix criteria such as performance, cost, integration effort, license, and runtime only where applicable; do not guess unknown values or repeat generic copy.`,
  es: `Escribe una introducción única (180–500 caracteres) que explique una diferencia, sinergia o conflicto arquitectónico concreto entre estas herramientas, basándose en sus características reales. Añade "decisionFramework" con una recomendación independiente para cada herramienta (80–400 caracteres): indica el perfil de proyecto, requisito o compromiso para el que conviene más esa opción. Incluye criterios como rendimiento, coste, facilidad de integración, licencia y entorno de ejecución solo cuando sean pertinentes; no inventes datos desconocidos ni repitas texto genérico.`,
  de: `Verfasse eine individuelle Einleitung (180–500 Zeichen), die einen konkreten Unterschied, eine Synergie oder einen Architekturkonflikt zwischen den Tools anhand ihrer tatsächlichen Eigenschaften erklärt. Ergänze "decisionFramework" mit einer eigenen Empfehlung für jedes Tool (80–400 Zeichen): Nenne Projektprofil, Anforderung oder Kompromiss, für den diese Option besser geeignet ist. Berücksichtige Kriterien wie Leistung, Kosten, Integrationsaufwand, Lizenz und Laufzeitumgebung nur, wenn sie zutreffen; erfinde keine unbekannten Werte und wiederhole keine allgemeinen Textbausteine.`,
  fr: `Rédigez une introduction unique (180–500 caractères) qui explique une différence, une synergie ou un conflit architectural concret entre ces outils, à partir de leurs caractéristiques réelles. Ajoutez "decisionFramework" avec une recommandation distincte pour chaque outil (80–400 caractères) : précisez le profil de projet, l’exigence ou le compromis pour lequel cette option est préférable. Incluez des critères comme les performances, le coût, la facilité d’intégration, la licence et l’environnement d’exécution uniquement lorsqu’ils sont pertinents ; n’inventez aucune valeur inconnue et évitez les formulations génériques.`,
};
const technicalMatrixRequirements = {
  pl: `W tabeli kryteriów uwzględnij co najmniej sześć odrębnych, praktycznych wymiarów technicznych. Wybierz adekwatne do narzędzi aspekty, takie jak wydajność i jej zależności, koszty/licencja, integracja i wdrożenie, runtime/architektura, skalowanie, bezpieczeństwo lub kompatybilność. Nie wymuszaj niepasujących wierszy i nie wymyślaj liczb; odróżniaj fakty od zależnych od kontekstu ocen.`,
  en: `Include at least six distinct, practical technical dimensions in the comparison matrix. Select dimensions relevant to these tools, such as performance and its dependencies, cost/license, integration and deployment, runtime/architecture, scaling, security, or compatibility. Do not force irrelevant rows or invent figures; distinguish documented facts from context-dependent assessments.`,
  es: `Incluye al menos seis dimensiones técnicas distintas y útiles en la matriz. Elige las pertinentes para estas herramientas, como rendimiento y sus dependencias, coste/licencia, integración y despliegue, entorno de ejecución/arquitectura, escalabilidad, seguridad o compatibilidad. No fuerces criterios irrelevantes ni inventes cifras; distingue los hechos documentados de las valoraciones dependientes del contexto.`,
  de: `Berücksichtige in der Vergleichsmatrix mindestens sechs unterschiedliche, praxisrelevante technische Dimensionen. Wähle passend zu den Tools etwa Leistung und ihre Einflussfaktoren, Kosten/Lizenz, Integration und Bereitstellung, Laufzeit/Architektur, Skalierung, Sicherheit oder Kompatibilität. Erzwinge keine irrelevanten Kriterien und erfinde keine Zahlen; unterscheide belegte Fakten von kontextabhängigen Einschätzungen.`,
  fr: `Incluez au moins six dimensions techniques distinctes et utiles dans la matrice. Choisissez celles qui correspondent aux outils, par exemple les performances et leurs facteurs, le coût/la licence, l’intégration et le déploiement, l’environnement d’exécution/l’architecture, la montée en charge, la sécurité ou la compatibilité. N’imposez pas de critères non pertinents et n’inventez aucun chiffre ; distinguez les faits documentés des évaluations dépendantes du contexte.`,
};
const locales = {
  pl: {
    requirements:
      'Użyj wyłącznie naturalnego polskiego (pl-PL), poprawnej polskiej składni, interpunkcji i specjalistycznej terminologii. Nie używaj angielskich zdań, nagłówków ani tekstów zastępczych. Każda odpowiedź FAQ musi być naturalna po polsku.',
    verdict: "Zwięzła, wyważona rekomendacja wskazująca, komu i dlaczego opłaca się wybrać każdą z opcji.",
    criterionExample: "Szczegółowa ocena kryterium.",
    toolAExample: "Szczegółowy opis narzędzia.",
    toolBExample: "Szczegółowy opis drugiego narzędzia.",
    questionExample: "Które narzędzie lepiej pasuje do tego projektu?",
    answerExample: "Rzetelna odpowiedź z kontekstem i praktyczną wskazówką.",
    comparisonMinimum:
      "W każdym kryterium opisz obie strony konkretnie, w co najmniej dwóch pełnych zdaniach.",
    faqMinimum:
      "Zwróć 6–8 niepowtarzających się pytań FAQ z wyczerpującymi, samodzielnymi odpowiedziami po polsku. Każda odpowiedź powinna mieć przynajmniej dwa pełne zdania i pomóc czytelnikowi podjąć decyzję.",
    verdictMinimum: 'Napisz podsumowanie z jasnymi rekomendacjami dla obu rozwiązań i istotnymi ograniczeniami; "verdict" powinno mieć 60–600 znaków.',
    descriptionMinimum: "Użyj naturalnego, poprawnego po polsku opisu meta.",
    qualityRequirements:
      'Uwzględnij co najmniej sześć różnych kryteriów, które rzeczywiście pasują do porównywanych narzędzi. Każde kryterium omów w co najmniej dwóch pełnych zdaniach dla obu narzędzi, a pole "winner" ustaw na "toolA", "toolB" lub "tie" zgodnie z uzasadnioną oceną. Zachowaj rzetelność E-E-A-T: nie wymyślaj własnych testów, osobistego doświadczenia, źródeł, benchmarków, gwarancji ani niezweryfikowanych cen; zaznaczaj zależność od wersji, planu, konfiguracji i obciążenia. Sprawdź twierdzenia o dostępności funkcji, bezpieczeństwie i kompatybilności. Opis meta ma mieć od 100 do 200 znaków. Zachowaj podany slug i nazwy narzędzi. Nie dodawaj pól i nie zostawiaj pustych wartości.',
  },
  en: {
    requirements:
      "Write exclusively in natural, idiomatic English (en-US). Use correct English grammar, punctuation, and technical terminology. Do not include Polish or Spanish sentences, headings, or placeholder text. Write every FAQ answer naturally in English.",
    verdict: "A concise, balanced recommendation explaining who should choose each option and why.",
    criterionExample: "Detailed evaluation of this criterion.",
    toolAExample: "A detailed description of the tool.",
    toolBExample: "A detailed description of the other tool.",
    questionExample: "Which tool is better suited to this project?",
    answerExample: "A reliable answer with context and practical guidance.",
    comparisonMinimum:
      "Explain both options specifically in every criterion using at least two complete English sentences.",
    faqMinimum:
      "Write 6–8 distinct FAQ questions with thorough, self-contained answers in English. Each answer must contain at least two complete sentences and help readers make a decision.",
    verdictMinimum:
      'Write a conclusion with clear recommendations for both options and relevant limitations. Keep "verdict" between 60 and 600 characters.',
    descriptionMinimum: "Write a natural, grammatically correct English meta description.",
    qualityRequirements:
      'Include at least six distinct criteria that genuinely apply to the compared tools. Describe both tools in at least two complete sentences for each criterion, and set "winner" to "toolA", "toolB", or "tie" based on a reasoned assessment. Follow E-E-A-T principles: do not invent first-hand tests, personal experience, sources, benchmarks, guarantees, or unverified prices; qualify claims that depend on version, plan, configuration, or workload. Verify claims about feature availability, security, and compatibility. Keep the meta description between 100 and 200 characters. Preserve the supplied slug and tool names. Do not add fields or leave values empty.',
  },
  es: {
    requirements:
      "Escribe exclusivamente en español natural y fluido (es-ES), con gramática, puntuación y terminología técnica correctas. No incluyas frases, encabezados ni textos de relleno en polaco o inglés. Redacta todas las respuestas frecuentes en español natural.",
    verdict: "Una recomendación breve y equilibrada que explique a quién le conviene cada opción y por qué.",
    criterionExample: "Análisis detallado de este criterio.",
    toolAExample: "Descripción detallada de la herramienta.",
    toolBExample: "Descripción detallada de la otra herramienta.",
    questionExample: "¿Qué herramienta se adapta mejor a este proyecto?",
    answerExample: "Una respuesta fiable con contexto y consejos prácticos.",
    comparisonMinimum:
      "Describe ambas opciones de forma concreta en cada criterio, con al menos dos frases completas en español.",
    faqMinimum:
      "Redacta entre 6 y 8 preguntas frecuentes distintas, con respuestas completas y autónomas en español. Cada respuesta debe incluir al menos dos frases completas y ayudar a tomar una decisión.",
    verdictMinimum:
      'Escribe una conclusión con recomendaciones claras para ambas opciones y sus limitaciones relevantes. Mantén "verdict" entre 60 y 600 caracteres.',
    descriptionMinimum: "Escribe una descripción meta natural y correcta en español.",
    qualityRequirements:
      'Incluye al menos seis criterios distintos que sean pertinentes para las herramientas comparadas. Describe ambas opciones en al menos dos frases completas por criterio y asigna "winner" a "toolA", "toolB" o "tie" según una evaluación justificada. Aplica los principios E-E-A-T: no inventes pruebas propias, experiencia personal, fuentes, benchmarks, garantías ni precios sin verificar; matiza las afirmaciones que dependan de la versión, el plan, la configuración o la carga de trabajo. Verifica las afirmaciones sobre funciones, seguridad y compatibilidad. Mantén la descripción meta entre 100 y 200 caracteres. Conserva exactamente el slug y los nombres proporcionados. No añadas campos ni dejes valores vacíos.',
  },
  de: {
    requirements:
      "Schreibe ausschließlich in natürlichem, idiomatischem Deutsch (de-DE) mit korrekter Grammatik, Zeichensetzung und technischer Terminologie. Verwende keine polnischen, englischen oder spanischen Sätze, Überschriften oder Platzhalter. Verfasse alle FAQ-Antworten auf natürlichem Deutsch.",
    verdict: "Eine knappe, ausgewogene Empfehlung, die erklärt, für wen sich welche Option eignet und warum.",
    criterionExample: "Detaillierte Bewertung dieses Kriteriums.",
    toolAExample: "Eine ausführliche Beschreibung des Tools.",
    toolBExample: "Eine ausführliche Beschreibung des anderen Tools.",
    questionExample: "Welches Tool eignet sich besser für dieses Projekt?",
    answerExample: "Eine fundierte Antwort mit Kontext und praktischer Orientierung.",
    comparisonMinimum:
      "Beschreibe bei jedem Kriterium beide Optionen konkret mit mindestens zwei vollständigen deutschen Sätzen.",
    faqMinimum:
      "Erstelle 6–8 unterschiedliche FAQ-Fragen mit ausführlichen, eigenständigen Antworten auf Deutsch. Jede Antwort muss mindestens zwei vollständige Sätze umfassen und bei der Entscheidung helfen.",
    verdictMinimum:
      'Formuliere ein Fazit mit klaren Empfehlungen für beide Optionen und relevanten Einschränkungen. "verdict" muss 60 bis 600 Zeichen lang sein.',
    descriptionMinimum: "Verfasse eine natürliche, grammatikalisch korrekte deutsche Meta-Beschreibung.",
    qualityRequirements:
      'Nenne mindestens sechs unterschiedliche Kriterien, die tatsächlich zu den verglichenen Tools passen. Beschreibe beide Tools für jedes Kriterium mit mindestens zwei vollständigen Sätzen und setze "winner" anhand einer begründeten Bewertung auf "toolA", "toolB" oder "tie". Beachte E-E-A-T: Erfinde keine eigenen Tests, persönliche Erfahrungen, Quellen, Benchmarks, Garantien oder ungeprüften Preise. Kennzeichne Aussagen, die von Version, Tarif, Konfiguration oder Arbeitslast abhängen. Achte auf die Richtigkeit von Aussagen zu Funktionen, Sicherheit und Kompatibilität. Die Meta-Beschreibung muss 100–200 Zeichen umfassen. Übernimm den vorgegebenen Slug und die Tool-Namen exakt. Füge keine Felder hinzu und lasse keine Werte leer.',
  },
  fr: {
    requirements:
      "Rédige exclusivement en français naturel et idiomatique (fr-FR), avec une grammaire, une ponctuation et une terminologie technique correctes. N’inclus aucune phrase, aucun titre ni texte provisoire en polonais, anglais ou espagnol. Rédige toutes les réponses FAQ dans un français naturel.",
    verdict: "Une recommandation concise et équilibrée qui explique à qui convient chaque option et pourquoi.",
    criterionExample: "Évaluation détaillée de ce critère.",
    toolAExample: "Description détaillée de l’outil.",
    toolBExample: "Description détaillée de l’autre outil.",
    questionExample: "Quel outil convient le mieux à ce projet ?",
    answerExample: "Une réponse fiable, contextualisée et accompagnée de conseils pratiques.",
    comparisonMinimum:
      "Décris concrètement les deux options pour chaque critère, avec au moins deux phrases complètes en français.",
    faqMinimum:
      "Rédige 6 à 8 questions FAQ différentes avec des réponses détaillées et autonomes en français. Chaque réponse doit contenir au moins deux phrases complètes et aider à prendre une décision.",
    verdictMinimum:
      'Rédige une conclusion avec des recommandations claires pour les deux options et leurs limites pertinentes. Le champ "verdict" doit contenir entre 60 et 600 caractères.',
    descriptionMinimum: "Rédige une méta-description naturelle et correcte en français.",
    qualityRequirements:
      'Inclue au moins six critères distincts et réellement pertinents pour les outils comparés. Décris les deux outils avec au moins deux phrases complètes par critère et définis "winner" sur "toolA", "toolB" ou "tie" selon une évaluation argumentée. Respecte E-E-A-T : n’invente ni tests personnels, ni expérience, ni sources, benchmarks, garanties ou tarifs non vérifiés. Nuance les affirmations dépendant de la version, de l’offre, de la configuration ou de la charge. Vérifie les affirmations sur les fonctionnalités, la sécurité et la compatibilité. La méta-description doit compter entre 100 et 200 caractères. Conserve exactement le slug et les noms des outils fournis. N’ajoute aucun champ et ne laisse aucune valeur vide.',
  },
};

const knownToolNames = {
  'actix-web': 'Actix Web', angular: 'Angular', anthropic: 'Anthropic', astro: 'Astro',
  clickhouse: 'ClickHouse', inngest: 'Inngest', nx: 'Nx',
  temporal: 'Temporal', turborepo: 'Turborepo',
  autogen: 'AutoGen', aws: 'AWS', azure: 'Microsoft Azure', bootstrap: 'Bootstrap', bun: 'Bun',
  cassandra: 'Apache Cassandra', 'chakra-ui': 'Chakra UI', chroma: 'Chroma', cloudflare: 'Cloudflare',
  crewai: 'CrewAI', 'css-modules': 'CSS Modules', deno: 'Deno', drizzle: 'Drizzle ORM', duckdb: 'DuckDB',
  express: 'Express', fastapi: 'FastAPI', fastify: 'Fastify', firebase: 'Firebase', gatsby: 'Gatsby',
  'go-gin': 'Gin', gcp: 'Google Cloud', graphql: 'GraphQL', hono: 'Hono', javascript: 'JavaScript',
  kubernetes: 'Kubernetes', langchain: 'LangChain', llama: 'Llama', llamaindex: 'LlamaIndex', mantine: 'Mantine',
  memcached: 'Memcached', mistral: 'Mistral', mongodb: 'MongoDB', mongoose: 'Mongoose', mysql: 'MySQL',
  nestjs: 'NestJS', netlify: 'Netlify', nextjs: 'Next.js', node: 'Node.js', nomad: 'Nomad', nuxt: 'Nuxt',
  ollama: 'Ollama', openai: 'OpenAI', openfga: 'OpenFGA', pinecone: 'Pinecone', podman: 'Podman',
  postgresql: 'PostgreSQL', prisma: 'Prisma', pulumi: 'Pulumi', python: 'Python', qdrant: 'Qdrant',
  qwik: 'Qwik', react: 'React', redis: 'Redis', remix: 'Remix', scylladb: 'ScyllaDB', shadcn: 'shadcn/ui',
  solidjs: 'SolidJS', sqlite: 'SQLite', 'styled-components': 'styled-components', svelte: 'Svelte',
  supabase: 'Supabase', tailwind: 'Tailwind CSS', terraform: 'Terraform', typeorm: 'TypeORM', vercel: 'Vercel',
  vllm: 'vLLM', vite: 'Vite', vue: 'Vue', weaviate: 'Weaviate', webpack: 'Webpack',
  'claude-3-5-sonnet': 'Claude 3.5 Sonnet', 'claude-3-7-sonnet': 'Claude 3.7 Sonnet',
  'claude-fable-5-1': 'Claude Fable 5.1', 'claude-opus-5-5': 'Claude Opus 5.5',
  'command-r-plus': 'Command R+', 'deepseek-r1': 'DeepSeek R1', 'deepseek-v3': 'DeepSeek V3',
  'gemini-2-5-flash': 'Gemini 2.5 Flash', 'gemini-2-5-pro': 'Gemini 2.5 Pro',
  'gemma-3': 'Gemma 3', 'gpt-4-1': 'GPT-4.1', 'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o mini', 'llama-3-3': 'Llama 3.3',
  'mistral-large': 'Mistral Large', 'mistral-small': 'Mistral Small',
  'openai-o1': 'OpenAI o1', 'openai-o3': 'OpenAI o3', 'phi-4': 'Phi-4',
  'fable-5-1': 'Claude Fable 5.1', 'astra-db': 'Astra DB',
  'qwen-2-5': 'Qwen 2.5', 'qwen-qwq': 'Qwen QwQ', qwen3: 'Qwen3',
};

const aiModelComparisonSlugs = new Set(categories["AI Models & LLMs"]);
const fableComparisonSlugs = new Set([
  "claude-fable-5-1-vs-claude-opus-5-5",
  "claude-fable-5-1-vs-openai-o3",
  "claude-fable-5-1-vs-deepseek-r1",
  "fable-5-1-vs-autogen",
  "fable-5-1-vs-crewai",
]);
const astraDbComparisonSlugs = new Set([
  "astra-db-vs-pinecone",
  "astra-db-vs-qdrant",
]);
const verifiedFacts = {
  pl: {
    fableCategory: "Zweryfikowane parametry Claude Fable 5.1",
    fable:
      "Dokumentacja Anthropic podaje okno kontekstowe 1 mln tokenów, maksymalnie 128 tys. tokenów wyjściowych oraz ceny API: 10 USD za milion tokenów wejściowych i 50 USD za milion tokenów wyjściowych. Odczyt z prompt cache kosztuje 0,25 USD za milion tokenów, czyli o 97,5% mniej niż bazowa cena wejścia; sprawdź aktualny cennik przed wdrożeniem.",
    opus:
      "Dokumentacja Anthropic podaje dla Claude Opus 5.5 okno kontekstowe 1 mln tokenów, maksymalnie 128 tys. tokenów wyjściowych oraz ceny API: 4 USD za milion tokenów wejściowych i 20 USD za milion tokenów wyjściowych. Odczyt z prompt cache kosztuje 0,20 USD za milion tokenów; ceny mogą się zmienić.",
    otherModel:
      "Limity kontekstu, maksymalny wynik i ceny tej opcji zależą od modelu, dostawcy oraz warunków usługi. Nie przenoś parametrów Claude na drugą opcję; przed wdrożeniem sprawdź jej aktualną oficjalną dokumentację.",
    framework:
      "AutoGen i CrewAI są frameworkami do orkiestracji agentów, a nie porównywalnymi modelami językowymi. Nie mają własnych limitów kontekstu ani stawek API za token; te parametry zależą od podłączonego modelu i dostawcy.",
    astraCategory: "Architektura Cassandra i wyszukiwanie wektorowe",
    astra:
      "Astra DB to zarządzana baza oparta na Apache Cassandra z natywną obsługą wyszukiwania wektorowego, użyteczną jako warstwa pobierania danych w architekturze RAG. Sama baza nie stanowi kompletnego potoku RAG — potrzebne są również aplikacja, model i konfiguracja pobierania.",
    vectorDatabase:
      "Pinecone i Qdrant to wyspecjalizowane bazy wektorowe, a nie bazy o modelu danych Cassandra. Porównuj funkcje indeksowania, filtrowania, wdrożenia i integracji dla konkretnej wersji oraz oferty.",
  },
  en: {
    fableCategory: "Verified Claude Fable 5.1 specifications and pricing",
    fable:
      "Anthropic documents a 1M-token context window, up to 128K output tokens, and API rates of $10 per million input tokens and $50 per million output tokens for Claude Fable 5.1. Prompt-cache reads cost $0.25 per million tokens, 97.5% below the base input rate; verify current pricing before deployment.",
    opus:
      "Anthropic documents a 1M-token context window, up to 128K output tokens, and API rates of $4 per million input tokens and $20 per million output tokens for Claude Opus 5.5. Prompt-cache reads cost $0.20 per million tokens; prices may change.",
    otherModel:
      "Context limits, maximum output, and pricing for this option depend on its model, provider, and service terms. Do not transfer Claude specifications to it; check the provider's current official documentation before deployment.",
    framework:
      "AutoGen and CrewAI are agent orchestration frameworks, not comparable language models. They do not have their own model context limits or per-token API rates; those depend on the connected model and provider.",
    astraCategory: "Cassandra architecture and vector search",
    astra:
      "Astra DB is a managed database built on Apache Cassandra with native vector-search support, which can serve as the retrieval layer in a RAG architecture. The database alone is not a complete RAG pipeline; an application, model, and retrieval configuration are also required.",
    vectorDatabase:
      "Pinecone and Qdrant are purpose-built vector databases, not databases with the Cassandra data model. Compare indexing, filtering, deployment, and integrations for the specific version and plan.",
  },
  es: {
    fableCategory: "Especificaciones y precios verificados de Claude Fable 5.1",
    fable:
      "La documentación de Anthropic indica para Claude Fable 5.1 una ventana de contexto de 1 millón de tokens, hasta 128.000 tokens de salida y tarifas API de 10 USD por millón de tokens de entrada y 50 USD por millón de salida. Las lecturas de caché de prompts cuestan 0,25 USD por millón, un 97,5 % menos que la tarifa base de entrada; verifica los precios vigentes antes del despliegue.",
    opus:
      "La documentación de Anthropic indica para Claude Opus 5.5 una ventana de contexto de 1 millón de tokens, hasta 128.000 tokens de salida y tarifas API de 4 USD por millón de tokens de entrada y 20 USD por millón de salida. Las lecturas de caché de prompts cuestan 0,20 USD por millón; los precios pueden cambiar.",
    otherModel:
      "Los límites de contexto, la salida máxima y los precios de esta opción dependen del modelo, el proveedor y las condiciones del servicio. No atribuyas las especificaciones de Claude a la otra opción; consulta su documentación oficial vigente antes del despliegue.",
    framework:
      "AutoGen y CrewAI son frameworks de orquestación de agentes, no modelos de lenguaje comparables. No tienen límites de contexto ni tarifas API por token propios; esos parámetros dependen del modelo y proveedor conectados.",
    astraCategory: "Arquitectura Cassandra y búsqueda vectorial",
    astra:
      "Astra DB es una base de datos gestionada basada en Apache Cassandra con búsqueda vectorial nativa, que puede actuar como capa de recuperación en una arquitectura RAG. La base de datos por sí sola no es un flujo RAG completo: también hacen falta una aplicación, un modelo y una configuración de recuperación.",
    vectorDatabase:
      "Pinecone y Qdrant son bases de datos vectoriales especializadas, no bases con el modelo de datos de Cassandra. Compara indexación, filtros, despliegue e integraciones para la versión y el plan concretos.",
  },
  de: {
    fableCategory: "Verifizierte Spezifikationen und Preise von Claude Fable 5.1",
    fable:
      "Laut Anthropic-Dokumentation bietet Claude Fable 5.1 ein Kontextfenster von 1 Mio. Tokens, bis zu 128.000 Ausgabe-Tokens und API-Preise von 10 USD je 1 Mio. Eingabe-Tokens sowie 50 USD je 1 Mio. Ausgabe-Tokens. Prompt-Cache-Lesezugriffe kosten 0,25 USD je 1 Mio. Tokens und liegen damit 97,5 % unter dem Basispreis für Eingaben; vor dem Einsatz aktuelle Preise prüfen.",
    opus:
      "Laut Anthropic-Dokumentation bietet Claude Opus 5.5 ein Kontextfenster von 1 Mio. Tokens, bis zu 128.000 Ausgabe-Tokens und API-Preise von 4 USD je 1 Mio. Eingabe-Tokens sowie 20 USD je 1 Mio. Ausgabe-Tokens. Prompt-Cache-Lesezugriffe kosten 0,20 USD je 1 Mio. Tokens; Preise können sich ändern.",
    otherModel:
      "Kontextlimits, maximale Ausgabe und Preise dieser Option hängen von Modell, Anbieter und Vertragsbedingungen ab. Claude-Spezifikationen dürfen nicht übertragen werden; vor dem Einsatz die aktuelle offizielle Dokumentation prüfen.",
    framework:
      "AutoGen und CrewAI sind Frameworks zur Agenten-Orchestrierung und keine vergleichbaren Sprachmodelle. Sie haben keine eigenen Kontextlimits oder API-Tokenpreise; diese hängen vom angebundenen Modell und Anbieter ab.",
    astraCategory: "Cassandra-Architektur und Vektorsuche",
    astra:
      "Astra DB ist eine verwaltete, auf Apache Cassandra basierende Datenbank mit nativer Vektorsuche und kann als Retrieval-Schicht einer RAG-Architektur dienen. Die Datenbank allein bildet keine vollständige RAG-Pipeline; Anwendung, Modell und Retrieval-Konfiguration sind zusätzlich erforderlich.",
    vectorDatabase:
      "Pinecone und Qdrant sind spezialisierte Vektordatenbanken und keine Datenbanken mit Cassandra-Datenmodell. Vergleiche Indizierung, Filterung, Bereitstellung und Integrationen für die jeweilige Version und den Tarif.",
  },
  fr: {
    fableCategory: "Spécifications et tarifs vérifiés de Claude Fable 5.1",
    fable:
      "La documentation d’Anthropic indique pour Claude Fable 5.1 une fenêtre de contexte de 1 million de jetons, jusqu’à 128 000 jetons en sortie et des tarifs API de 10 USD par million de jetons en entrée et 50 USD en sortie. Les lectures du cache de prompts coûtent 0,25 USD par million, soit 97,5 % de moins que le tarif d’entrée de base ; vérifiez les tarifs en vigueur avant le déploiement.",
    opus:
      "La documentation d’Anthropic indique pour Claude Opus 5.5 une fenêtre de contexte de 1 million de jetons, jusqu’à 128 000 jetons en sortie et des tarifs API de 4 USD par million de jetons en entrée et 20 USD en sortie. Les lectures du cache de prompts coûtent 0,20 USD par million ; les tarifs peuvent évoluer.",
    otherModel:
      "Les limites de contexte, la sortie maximale et les tarifs de cette option dépendent du modèle, du fournisseur et des conditions du service. N’attribuez pas les spécifications de Claude à l’autre option ; consultez sa documentation officielle actuelle avant le déploiement.",
    framework:
      "AutoGen et CrewAI sont des frameworks d’orchestration d’agents, pas des modèles de langage comparables. Ils n’ont ni limites de contexte ni tarifs API par jeton propres ; ces paramètres dépendent du modèle et du fournisseur utilisés.",
    astraCategory: "Architecture Cassandra et recherche vectorielle",
    astra:
      "Astra DB est une base de données gérée reposant sur Apache Cassandra avec une recherche vectorielle native, utilisable comme couche de récupération dans une architecture RAG. La base seule ne constitue pas un pipeline RAG complet : une application, un modèle et une configuration de récupération sont également nécessaires.",
    vectorDatabase:
      "Pinecone et Qdrant sont des bases vectorielles spécialisées, et non des bases utilisant le modèle de données Cassandra. Comparez l’indexation, le filtrage, le déploiement et les intégrations selon la version et l’offre concernées.",
  },
};

function printUsage() {
  console.log(
    [
      "Usage:",
      "  npm run generate -- <slug> [<slug> ...] [--lang pl|en|es|de|fr|all] [--force]",
      "",
      "A slug must follow the format tool-a-vs-tool-b.",
      "Example:",
      "  npm run generate -- redis-vs-memcached react-vs-vue --lang en,es",
      "  npm run generate -- postgresql-vs-mysql --lang all",
      "",
      "Set DEEPSEEK_API_KEY or OPENAI_API_KEY in the environment or .env.local.",
      "DEEPSEEK_API_KEY takes precedence if both keys are set.",
    ].join("\n"),
  );
}

function getToolName(slugPart) {
  if (knownToolNames[slugPart]) {
    return knownToolNames[slugPart];
  }

  return slugPart
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseSlugs(args) {
  const suppliedSlugs = args.flatMap((arg) => arg.split(",")).filter(Boolean);
  const slugs = suppliedSlugs.length > 0 ? suppliedSlugs : comparisonSlugs;
  const uniqueSlugs = [...new Set(slugs)];

  for (const slug of uniqueSlugs) {
    const parts = slug.split("-vs-");
    if (
      parts.length !== 2 ||
      parts.some((part) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))
    ) {
      throw new Error(
        `Invalid comparison slug "${slug}". Use the format tool-a-vs-tool-b.`,
      );
    }
  }

  return uniqueSlugs;
}

function parseOptions(args) {
  const slugs = [];
  let localeArgument = "pl";
  let force = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--force") {
      force = true;
    } else if (argument === "--lang" || argument === "--locale") {
      localeArgument = args[index + 1];
      if (!localeArgument || localeArgument.startsWith("--")) {
        throw new Error(`Expected a language after ${argument}. Use pl, en, es, de, fr, or all.`);
      }
      index += 1;
    } else if (argument.startsWith("--lang=") || argument.startsWith("--locale=")) {
      localeArgument = argument.slice(argument.indexOf("=") + 1);
    } else if (argument.startsWith("--")) {
      throw new Error(`Unknown option "${argument}".`);
    } else {
      slugs.push(argument);
    }
  }

  const selectedLocales =
    localeArgument === "all"
      ? Object.keys(locales)
      : [...new Set(localeArgument.split(",").filter(Boolean))];

  if (
    selectedLocales.length === 0 ||
    selectedLocales.some((locale) => !Object.hasOwn(locales, locale))
  ) {
    throw new Error(
      `Invalid language "${localeArgument}". Choose pl, en, es, de, fr, or all.`,
    );
  }

  return {
    slugs: parseSlugs(slugs),
    locales: selectedLocales,
    force,
  };
}

function getApiClient() {
  const deepSeekKey = process.env.DEEPSEEK_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!deepSeekKey && !openAiKey) {
    throw new Error(
      "No API key configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY in the environment.",
    );
  }

  if (deepSeekKey) {
    return {
      client: new OpenAI({
        apiKey: deepSeekKey,
        baseURL: "https://api.deepseek.com",
        maxRetries: 2,
        timeout: 90_000,
      }),
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    };
  }

  return {
    client: new OpenAI({
      apiKey: openAiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
      maxRetries: 2,
      timeout: 90_000,
    }),
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  };
}

function getComparisonTitle(slug, toolA, toolB, locale) {
  return getComparisonSeoTitle(toolA, toolB, locale);
}

function getCategoryId(slug) {
  const categoryName = Object.entries(categories).find(([, slugs]) =>
    slugs.includes(slug),
  )?.[0];
  if (!categoryName) {
    const databaseTools = new Set([
      "appwrite", "cassandra", "cockroachdb", "duckdb", "firebase",
      "firestore", "memcached", "mongodb", "mongoose", "mysql",
      "postgresql", "prisma", "redis", "scylladb", "sqlite",
      "supabase", "typeorm",
    ]);
    if (slug.split("-").some((technology) => databaseTools.has(technology))) {
      return "databases";
    }
  }
  return categoryName?.includes("AI")
    ? "ai-models"
    : categoryName === "Frontend & Meta-frameworks"
      ? "frontend"
      : categoryName === "Backend & Runtimes"
        ? "backend"
        : categoryName === "Databases & ORMs"
          ? "databases"
          : categoryName === "DevOps & Cloud"
            ? "devops"
            : categoryName === "CSS & UI"
              ? "css"
              : "general";
}

function getMetaDescription(slug, toolA, toolB, locale) {
  return getComparisonSeoDescription(toolA, toolB, getCategoryId(slug), locale);
}

function buildPrompt(slug, toolA, toolB, locale) {
 const language = locales[locale];
 const title = getComparisonTitle(slug, toolA, toolB, locale);
 const nicheRequirements = {
   "clickhouse-vs-duckdb": `

Focus this niche comparison on an identical analytical workload: daily revenue aggregation over a bounded order-date range. Explain ClickHouse as a server-based columnar OLAP system and DuckDB as an embedded analytical engine; do not imply one is universally faster. Discuss deployment topology, data locality, concurrency, scaling, ingestion, and operational cost drivers without inventing cold-start times, memory usage, throughput, or prices. Include explicit comparison criteria whose category labels begin with "Performance", "Cost / pricing", and "Deployment / integration" so the page's priority calculator uses evidence aligned with the verdict. The verdict must be a technically grounded recommendation, not a claim of hands-on testing.`,
   "temporal-vs-inngest": `

Focus this niche comparison on a recoverable order-processing workflow with inventory reservation, idempotent payment capture, retries, and fulfillment. Contrast Temporal's workflow-history/replay and worker model with Inngest's event-triggered persisted steps; qualify features by current product version and hosting plan. Explain latency and scaling trade-offs qualitatively; never invent cold-start, memory, throughput, or pricing numbers. Include explicit comparison criteria whose category labels begin with "Performance", "Cost / pricing", and "Deployment / integration" so the priority calculator uses evidence aligned with the verdict. Do not claim original testing or sign the content as a real person.`,
   "turborepo-vs-nx": `

Focus this niche comparison on an affected CI build for a monorepo application and its dependency graph. Contrast Turborepo's task pipeline, package filters, and cache model with Nx's project graph, affected targets, and task execution. Explain that cache hit rates and wall-clock improvements depend on correct inputs, remote-cache setup, runner capacity, and repository shape; do not invent timings, memory figures, or plan prices. Include explicit comparison criteria whose category labels begin with "Performance", "Cost / pricing", and "Deployment / integration" so the priority calculator uses evidence aligned with the verdict. Vary the explanation around these tools' distinct workflows; do not claim original testing.`,
 }[slug] ?? "";
 const aiModelRequirements = aiModelComparisonSlugs.has(slug)
   ? `

This is an AI model comparison. Include distinct, decision-useful criteria covering context window, benchmark performance (consider MMLU and HumanEval only when comparable, published results are known), API pricing per 1M input/output tokens, latency, model access and open/closed availability, and practical use cases. Adapt the criteria when a dimension does not apply to one of the compared models.
Treat model specifications, benchmark scores, and prices as version- and date-sensitive. Do not invent numeric scores, prices, context limits, or latency figures. State the model/version and relevant benchmark or pricing assumptions when known; otherwise say the value needs verification against the provider's current official documentation and compare the dimension qualitatively. Do not present qualitative assessments as measured results.`
   : "";
 const fableRequirements = fableComparisonSlugs.has(slug)
   ? `

This comparison includes Claude Fable 5.1. Use these verified Anthropic specifications, checked against the official model and pricing documentation: https://platform.claude.com/docs/en/models/fable-5-1/overview and https://platform.claude.com/docs/en/about-claude/pricing. Claude Fable 5.1 has a 1M-token context window, 128K maximum output, and base API pricing of $10 per million input tokens and $50 per million output tokens. Prompt-cache reads cost $0.25 per million tokens, which is 97.5% below the base input price (do not describe this as 75% cheaper). For Claude Opus 5.5, use $4/$20 per million input/output tokens and a $0.20 per million cache-read price only when that model is part of the comparison. Treat these values as current documented prices, clearly distinguish input from output and cache-read pricing, and note that prices and availability may change. Never transfer Fable's limits or prices to other models.`
   : "";
 const astraDbRequirements = astraDbComparisonSlugs.has(slug)
   ? `

This comparison includes DataStax Astra DB. Explain it as a managed database built on Apache Cassandra with vector-search capabilities that can support retrieval-augmented generation (RAG) architectures. Compare its Cassandra data model, vector indexing/query capabilities, operational model, integrations, and workload fit with the other option. Distinguish database/platform capabilities from a complete RAG application, avoid implying that every vector feature or integration is available on every tier/version, and do not invent benchmark or price figures.`
   : "";

 return `Write an accurate, useful, SEO-optimized comparison of ${toolA} vs ${toolB} for ${currentYear}.
All claims must be factual, current, qualified where version-dependent, and never invented. Do not claim original testing or measured benchmarks unless supplied with a cited, reproducible source.

Return only valid JSON, without Markdown, using exactly this schema:
{
 "slug": "${slug}",
 "meta": {
   "title": "${title}",
   "description": "..."
 },
 "toolA": { "name": "${toolA}" },
 "toolB": { "name": "${toolB}" },
 "verdict": "${language.verdict}",
 "introduction": "...",
 "heroSubtitle": "...",
 "quickVerdict": "...",
 "tradeoffs": [
   { "category": "...", "toolA": "...", "toolB": "..." }
 ],
 "decisionFramework": {
   "toolA": "...",
   "toolB": "..."
 },
 "comparison": [
   {
     "category": "${language.criterionExample}",
     "toolA": "${language.toolAExample}",
     "toolB": "${language.toolBExample}",
     "winner": "toolA"
   }
 ],
 "faq": [
   { "q": "${language.questionExample}", "a": "${language.answerExample}" }
 ]
}

${language.requirements}
${language.qualityRequirements}
${language.faqMinimum}
${language.verdictMinimum}
${language.descriptionMinimum}
${deepDiveRequirements[locale]}
${technicalMatrixRequirements[locale]}
${nicheRequirements}
${aiModelRequirements}
${fableRequirements}
${astraDbRequirements}

Write heroSubtitle as one precise sentence describing the architectural problem, quickVerdict as a distinct actionable choice rule for each tool, and 4–6 tradeoffs grounded in the comparison. Do not copy the same sentence between these fields or the introduction. Source-code examples are supplied from a reviewed, category-specific native-language catalog after content validation; do not generate code, greetings, or translated UI copy.`;
}

function applyVerifiedFacts(slug, comparison, locale) {
  const facts = verifiedFacts[locale];
  const criteria = (comparison.comparison ?? []).filter(
    (criterion) =>
      criterion.category !== facts.fableCategory &&
      criterion.category !== facts.astraCategory,
  );

  if (fableComparisonSlugs.has(slug)) {
    const toolB =
      slug === "claude-fable-5-1-vs-claude-opus-5-5"
        ? facts.opus
        : slug === "fable-5-1-vs-autogen" || slug === "fable-5-1-vs-crewai"
          ? facts.framework
          : facts.otherModel;
    criteria.push({
      category: facts.fableCategory,
      toolA: facts.fable,
      toolB,
      winner: "tie",
    });
  }

  if (astraDbComparisonSlugs.has(slug)) {
    criteria.push({
      category: facts.astraCategory,
      toolA: facts.astra,
      toolB: facts.vectorDatabase,
      winner: "tie",
    });
  }

  return { ...comparison, comparison: criteria };
}

function requireString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid generated comparison: "${field}" must be a non-empty string.`);
  }

  return value.trim();
}

function validateComparison(value, slug, toolA, toolB, locale) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The API response must be a JSON object.");
  }

  if (value.slug !== slug) {
    throw new Error(`The API returned slug "${value.slug}" instead of "${slug}".`);
  }

  if (
    !value.meta ||
    typeof value.meta !== "object" ||
    Array.isArray(value.meta) ||
    !value.toolA ||
    typeof value.toolA !== "object" ||
    Array.isArray(value.toolA) ||
    !value.toolB ||
    typeof value.toolB !== "object" ||
    Array.isArray(value.toolB)
  ) {
    throw new Error("The generated comparison is missing its meta or tool objects.");
  }

  if (value.toolA.name !== toolA || value.toolB.name !== toolB) {
    throw new Error(`The API response must compare "${toolA}" against "${toolB}".`);
  }

  const title = getComparisonTitle(slug, toolA, toolB, locale);
  if (requireString(value.meta.title, "meta.title") !== title) {
    throw new Error("The generated title must use the requested localized title template.");
  }
  requireString(value.meta.description, "meta.description");
  const description = getMetaDescription(slug, toolA, toolB, locale);
  if (description.length < 100 || description.length > 155) {
    throw new Error(
      `The meta description must be 100–155 characters (received ${description.length}).`,
    );
  }

  const verdict = requireString(value.verdict, "verdict");
  if (verdict.length < 60 || verdict.length > 600) {
    throw new Error("The verdict must be between 60 and 600 characters.");
  }

  const introduction = requireString(value.introduction, "introduction");
  if (introduction.length < 180 || introduction.length > 800) {
    throw new Error("The introduction must be between 180 and 800 characters.");
  }

  const heroSubtitle = requireString(value.heroSubtitle, "heroSubtitle");
  if (heroSubtitle.length < 60 || heroSubtitle.length > 300) {
    throw new Error("The hero subtitle must be between 60 and 300 characters.");
  }
  const quickVerdict = requireString(value.quickVerdict, "quickVerdict");
  if (quickVerdict.length < 80 || quickVerdict.length > 500) {
    throw new Error("The quick verdict must be between 80 and 500 characters.");
  }
  const normalizeCopy = (text) => text.replace(/\s+/gu, " ").trim().toLowerCase();
  if (
    normalizeCopy(heroSubtitle) === normalizeCopy(introduction) ||
    normalizeCopy(quickVerdict) === normalizeCopy(verdict) ||
    normalizeCopy(heroSubtitle) === normalizeCopy(quickVerdict)
  ) {
    throw new Error("Hero subtitle, introduction, and quick verdict must be distinct.");
  }

  if (
    !value.decisionFramework ||
    typeof value.decisionFramework !== "object" ||
    Array.isArray(value.decisionFramework)
  ) {
    throw new Error("The generated comparison must contain a decisionFramework object.");
  }

  const decisionFramework = {
    toolA: requireString(
      value.decisionFramework.toolA,
      "decisionFramework.toolA",
    ),
    toolB: requireString(
      value.decisionFramework.toolB,
      "decisionFramework.toolB",
    ),
  };
  for (const [tool, recommendation] of Object.entries(decisionFramework)) {
    if (recommendation.length < 80 || recommendation.length > 500) {
      throw new Error(
        `The ${tool} decision recommendation must be between 80 and 500 characters.`,
      );
    }
  }

  if (!Array.isArray(value.comparison) || value.comparison.length < 6) {
    throw new Error("The generated comparison must contain at least 6 criteria.");
  }

  const seenCategories = new Set();
  const comparison = value.comparison.map((criterion, index) => {
    if (!criterion || typeof criterion !== "object" || Array.isArray(criterion)) {
      throw new Error(`Invalid comparison criterion at index ${index}.`);
    }

    const winner = criterion.winner;
    if (winner !== "toolA" && winner !== "toolB" && winner !== "tie") {
      throw new Error(`Invalid winner for comparison criterion at index ${index}.`);
    }

    const toolADescription = requireString(criterion.toolA, `comparison[${index}].toolA`);
    const toolBDescription = requireString(criterion.toolB, `comparison[${index}].toolB`);
    if (toolADescription.length < 60 || toolBDescription.length < 60) {
      throw new Error(`Comparison criterion ${index + 1} must describe both tools in detail.`);
    }

    const category = requireString(criterion.category, `comparison[${index}].category`);
    if (seenCategories.has(category.toLowerCase())) {
      throw new Error(`Duplicate comparison category "${category}".`);
    }
    seenCategories.add(category.toLowerCase());

    return {
      category,
      toolA: toolADescription,
      toolB: toolBDescription,
      winner,
    };
  });

  if (!Array.isArray(value.tradeoffs) || value.tradeoffs.length < 4 || value.tradeoffs.length > 8) {
    throw new Error("The generated comparison must contain 4–8 tradeoffs.");
  }
  const seenTradeoffs = new Set();
  const tradeoffs = value.tradeoffs.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Invalid trade-off at index ${index}.`);
    }

    const category = requireString(item.category, `tradeoffs[${index}].category`);
    if (seenTradeoffs.has(category.toLowerCase())) {
      throw new Error(`Duplicate trade-off category "${category}".`);
    }
    seenTradeoffs.add(category.toLowerCase());
    const toolADescription = requireString(item.toolA, `tradeoffs[${index}].toolA`);
    const toolBDescription = requireString(item.toolB, `tradeoffs[${index}].toolB`);
    if (toolADescription.length < 45 || toolBDescription.length < 45) {
      throw new Error(`Trade-off ${index + 1} must explain both tools.`);
    }
    return { category, toolA: toolADescription, toolB: toolBDescription };
  });

  if (!Array.isArray(value.faq) || value.faq.length < 5 || value.faq.length > 8) {
    throw new Error("The generated comparison must contain 5–8 FAQ entries.");
  }

  const seenQuestions = new Set();
  const faq = value.faq.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`Invalid FAQ entry at index ${index}.`);
    }

    const answer = requireString(entry.a, `faq[${index}].a`);
    if (answer.length < 80) {
      throw new Error(`FAQ answer ${index + 1} must contain at least 80 characters.`);
    }

    const question = requireString(entry.q, `faq[${index}].q`);
    if (seenQuestions.has(question.toLowerCase())) {
      throw new Error(`Duplicate FAQ question "${question}".`);
    }
    seenQuestions.add(question.toLowerCase());

    return {
      q: question,
      a: answer,
    };
  });

  const categoryId = getCategoryId(slug);
  const codeExamples = createCodeExamples(slug, categoryId, locale);

  return {
    slug,
    meta: { title, description },
    toolA: { name: toolA },
    toolB: { name: toolB },
    verdict,
    introduction,
    heroSubtitle,
    quickVerdict,
    decisionFramework,
    comparison,
    tradeoffs,
    codeExamples,
    faq,
  };
}

async function generateComparison(
  client,
  model,
  slug,
  locale,
  force,
  toolNames = {},
) {
  const [toolASlug, toolBSlug] = slug.split("-vs-");
  const toolA = toolNames.toolA || getToolName(toolASlug);
  const toolB = toolNames.toolB || getToolName(toolBSlug);
  const localeDirectory = path.join(dataDirectory, locale);
  const filePath = path.join(localeDirectory, `${slug}.json`);
  const reversedSlug = `${toolBSlug}-vs-${toolASlug}`;
  const existingPaths = [
    filePath,
    path.join(localeDirectory, `${reversedSlug}.json`),
  ];

  if (!force && existingPaths.some((existingPath) => existsSync(existingPath))) {
    console.log(
      `Pomijam istniejące lub odwrócone porównanie (bez --force): data/${locale}/${slug}.json`,
    );
    return false;
  }

  console.log(`Generuję ${toolA} vs ${toolB} [${locale}]...`);
  let comparison;
  let previousContent;
  const prompt = buildPrompt(slug, toolA, toolB, locale);

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const messages = [{ role: "user", content: prompt }];
    if (previousContent) {
      messages.push(
        { role: "assistant", content: previousContent.raw },
        {
          role: "user",
          content:
            "Poprzedni JSON nie spełnił wymagań: " +
            previousContent.error +
            " Popraw odpowiedź, zachowaj wszystkie wymagania i zwróć wyłącznie kompletny, poprawny JSON.",
        },
      );
    }

    const response = await client.chat.completions.create({
      model,
      messages,
      response_format: { type: "json_object" },
    });
    const content = response.choices[0]?.message?.content;

    if (typeof content !== "string" || content.trim().length === 0) {
      throw new Error(`The API returned an empty response for "${slug}".`);
    }

    try {
      comparison = validateComparison(
        JSON.parse(content),
        slug,
        toolA,
        toolB,
        locale,
      );
      break;
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown comparison validation error.";
      if (attempt === 2) {
        throw new Error(`Invalid API response for "${slug}" after 2 attempts: ${reason}`);
      }

      previousContent = { raw: content, error: reason };
      console.warn(`Odpowiedź ${slug} nie spełnia schematu; ponawiam próbę.`);
    }
  }

  comparison = applyVerifiedFacts(slug, comparison, locale);
  const output = `${JSON.stringify(comparison, null, 2)}\n`;

  try {
    mkdirSync(localeDirectory, { recursive: true });
    writeFileSync(filePath, output, {
      encoding: "utf8",
      flag: force ? "w" : "wx",
    });
  } catch (error) {
    if (!force && error && error.code === "EEXIST") {
      console.log(`Pomijam istniejący plik: data/${locale}/${slug}.json`);
      return false;
    }

    throw error;
  }

  console.log(
    `Zapisano data/${locale}/${slug}.json (${comparison.comparison.length} kryteriów, ${comparison.faq.length} pytań FAQ).`,
  );
  return true;
}

function createToolSlug(name) {
  const normalized = name.trim().toLocaleLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\.net$/, "dotnet")
    .replace(/^c\+\+$/, "cpp")
    .replace(/^c#$/, "csharp")
    .replace(/^node\.js$/, "nodejs")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized || normalized.length > 50) {
    throw new Error("Technology name cannot be converted into a valid comparison slug.");
  }

  return normalized;
}

class InvalidComparisonInputError extends Error {}

async function generateUserComparison(toolAName, toolBName, locale) {
  if (!Object.hasOwn(locales, locale)) {
    throw new InvalidComparisonInputError(`Unsupported locale "${locale}".`);
  }

  const toolA = toolAName.trim().replace(/\s+/g, " ");
  const toolB = toolBName.trim().replace(/\s+/g, " ");
  if (
    toolA.length === 0 ||
    toolB.length === 0 ||
    toolA.length > 50 ||
    toolB.length > 50 ||
    !/^[\p{L}\p{N} .+#/_-]+$/u.test(toolA) ||
    !/^[\p{L}\p{N} .+#/_-]+$/u.test(toolB)
  ) {
    throw new InvalidComparisonInputError(
      "Technology names contain unsupported characters or lengths.",
    );
  }

  const toolASlug = createToolSlug(toolA);
  const toolBSlug = createToolSlug(toolB);
  if (toolASlug === toolBSlug) {
    throw new InvalidComparisonInputError("Choose two different technologies.");
  }

  const slug = `${toolASlug}-vs-${toolBSlug}`;
  const reversedSlug = `${toolBSlug}-vs-${toolASlug}`;
  const localeDirectory = path.join(dataDirectory, locale);
  const existingSlugs = [slug, reversedSlug];
  const existingSlug = existingSlugs.find((candidate) => {
    const localizedPath = path.join(localeDirectory, `${candidate}.json`);
    const legacyPath = path.join(dataDirectory, `${candidate}.json`);
    return (
      existsSync(localizedPath) ||
      (locale === "pl" && existsSync(legacyPath))
    );
  });

  if (existingSlug) {
    return existingSlug;
  }

  const { client, model } = getApiClient();
  await generateComparison(client, model, slug, locale, false, {
    toolA: toolA,
    toolB: toolB,
  });

  return (
    existingSlugs.find((candidate) =>
      existsSync(path.join(localeDirectory, `${candidate}.json`)),
    ) ?? slug
  );
}

async function main(args = process.argv.slice(2)) {
  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  const { slugs, locales: selectedLocales, force } = parseOptions(args);
  const { client, model } = getApiClient();
  const failures = [];
  let generatedCount = 0;
  const jobs = slugs.flatMap((slug) =>
    selectedLocales.map((locale) => ({ slug, locale })),
  );
  let nextJob = 0;

  async function processJobs() {
    while (nextJob < jobs.length) {
      const job = jobs[nextJob];
      nextJob += 1;
      try {
        if (
          await generateComparison(
            client,
            model,
            job.slug,
            job.locale,
            force,
          )
        ) {
          generatedCount += 1;
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown generation error.";
        failures.push(`${job.slug} [${job.locale}]: ${reason}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(4, jobs.length) }, () => processJobs()),
  );

  console.log(`Gotowe. Wygenerowano ${generatedCount} nowych plików JSON.`);
  if (failures.length > 0) {
    throw new Error(
      `Nie udało się wygenerować ${failures.length} porównań:\n${failures.join("\n")}`,
    );
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Generowanie porównań nie powiodło się: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  applyVerifiedFacts,
  getCategoryId,
  getComparisonTitle,
  getMetaDescription,
  generateUserComparison,
  InvalidComparisonInputError,
  main,
};
