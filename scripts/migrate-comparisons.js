const { readdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { getCategoryId, getComparisonTitle, getMetaDescription } = require("./generate-comparisons");
const { createCodeExamples } = require("../lib/snippet-catalog.cjs");

const root = path.resolve(__dirname, "..");
const dataRoot = path.join(root, "data");
const LOCALES = ["en", "es", "de", "fr", "pl"];
const angles = {
  pl: {
    frontend: "renderowaniu interfejsu i pobieraniu danych",
    backend: "modelu runtime'u i obsłudze żądań",
    databases: "modelowaniu danych i sposobie dostępu do nich",
    "ai-models": "pobieraniu kontekstu i integracji z modelami",
    devops: "wdrażaniu i odpowiedzialności operacyjnej",
    css: "zarządzaniu stylami i komponowaniu interfejsu",
    general: "architekturze i integracji",
  },
  en: {
    frontend: "interface rendering and data loading",
    backend: "runtime behavior and request handling",
    databases: "data modeling and access patterns",
    "ai-models": "context retrieval and model integration",
    devops: "deployment and operational ownership",
    css: "style management and interface composition",
    general: "architecture and integration",
  },
  es: {
    frontend: "el renderizado de la interfaz y la carga de datos",
    backend: "el runtime y la gestión de solicitudes",
    databases: "el modelado de datos y los patrones de acceso",
    "ai-models": "la recuperación de contexto y la integración de modelos",
    devops: "el despliegue y la responsabilidad operativa",
    css: "la gestión de estilos y la composición de interfaces",
    general: "la arquitectura y la integración",
  },
  de: {
    frontend: "Rendering der Oberfläche und Datenladen",
    backend: "Laufzeitverhalten und Anfrageverarbeitung",
    databases: "Datenmodellierung und Zugriffsmuster",
    "ai-models": "Kontextabruf und Modellintegration",
    devops: "Bereitstellung und Betriebsverantwortung",
    css: "Style-Verwaltung und Oberflächenkomposition",
    general: "Architektur und Integration",
  },
  fr: {
    frontend: "le rendu de l’interface et le chargement des données",
    backend: "l’environnement d’exécution et le traitement des requêtes",
    databases: "la modélisation des données et les modes d’accès",
    "ai-models": "la récupération du contexte et l’intégration des modèles",
    devops: "le déploiement et la responsabilité opérationnelle",
    css: "la gestion des styles et la composition des interfaces",
    general: "l’architecture et l’intégration",
  },
};

function getHeroSubtitle(locale, category, toolA, toolB) {
  const topic = angles[locale][category] ?? angles[locale].general;
  const templates = {
    pl: `Wybór między ${toolA} a ${toolB} zmienia sposób podejścia do ${topic}, dlatego kluczowe są wymagania dotyczące danych, zespołu i wdrożenia.`,
    en: `Choosing between ${toolA} and ${toolB} changes how a project handles ${topic}, so data requirements, team skills, and deployment constraints matter.`,
    es: `Elegir entre ${toolA} y ${toolB} cambia cómo se aborda ${topic}; por eso importan los requisitos de datos, el equipo y el despliegue.`,
    de: `Die Wahl zwischen ${toolA} und ${toolB} verändert den Umgang mit ${topic}; daher sind Datenanforderungen, Teamkenntnisse und Bereitstellung wichtig.`,
    fr: `Choisir entre ${toolA} et ${toolB} modifie la manière de gérer ${topic} ; les besoins en données, les compétences de l’équipe et le déploiement sont donc déterminants.`,
  };
  return templates[locale];
}

function getQuickVerdict(comparison, locale) {
  const toolAReason = comparison.decisionFramework.toolA.replace(/[.!?]\s*$/u, "");
  const toolBReason = comparison.decisionFramework.toolB.replace(/[.!?]\s*$/u, "");

  const templates = {
    pl: `${comparison.toolA.name} będzie lepszy, gdy ${toolAReason}. ${comparison.toolB.name} sprawdzi się, gdy ${toolBReason}.`,
    en: `${comparison.toolA.name} is the better fit when ${toolAReason}. ${comparison.toolB.name} is a stronger fit when ${toolBReason}.`,
    es: `${comparison.toolA.name} encaja mejor cuando ${toolAReason}. ${comparison.toolB.name} es preferible cuando ${toolBReason}.`,
    de: `${comparison.toolA.name} passt besser, wenn ${toolAReason}. ${comparison.toolB.name} ist geeigneter, wenn ${toolBReason}.`,
    fr: `${comparison.toolA.name} convient mieux lorsque ${toolAReason}. ${comparison.toolB.name} est préférable lorsque ${toolBReason}.`,
  };
  return templates[locale];
}

function getSentence(value, limit = 140) {
  const sentence = value.trim().split(/(?<=[.!?])\s+/u)[0];
  if (!sentence) throw new Error("Cannot derive editorial content from empty text.");
  if (sentence.length <= limit) return sentence;
  const shortened = sentence.slice(0, limit - 1);
  return `${shortened.slice(0, shortened.lastIndexOf(" "))}…`;
}

function getCriterionLabel(value) {
  return getSentence(value, 80).replace(/[.!?…]\s*$/u, "");
}

function getDecisionFramework(comparison, locale) {
  const rows = comparison.comparison;
  const toolARow = rows.find((row) => row.winner === "toolA") ?? rows[0];
  const toolBRow = rows.find((row) => row.winner === "toolB") ?? rows[1] ?? rows[0];
  const templates = {
    pl: (row, tool) => `projekt stawia na kryterium „${getCriterionLabel(row.category)}”: ${getSentence(row[tool], 100)}`,
    en: (row, tool) => `your project prioritizes ${getCriterionLabel(row.category).toLowerCase()}: ${getSentence(row[tool], 100)}`,
    es: (row, tool) => `tu proyecto prioriza ${getCriterionLabel(row.category).toLowerCase()}: ${getSentence(row[tool], 100)}`,
    de: (row, tool) => `dein Projekt priorisiert ${getCriterionLabel(row.category)}: ${getSentence(row[tool], 100)}`,
    fr: (row, tool) => `votre projet privilégie ${getCriterionLabel(row.category).toLowerCase()} : ${getSentence(row[tool], 100)}`,
  };
  return {
    toolA: templates[locale](toolARow, "toolA"),
    toolB: templates[locale](toolBRow, "toolB"),
  };
}

function getIntroduction(comparison, locale) {
  const [first, second] = comparison.comparison;
  const toolAReason = getSentence(first.toolA, 120);
  const toolBReason = getSentence(first.toolB, 120);
  const nextDifference = getSentence(second.toolA, 120);
  const templates = {
    pl: `${comparison.toolA.name} i ${comparison.toolB.name} odpowiadają na podobną potrzebę, ale różnią się w obszarze ${getCriterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} Kolejną istotną różnicę pokazuje kryterium „${getCriterionLabel(second.category)}”: ${nextDifference} Wybór zależy od obciążenia, istniejącej architektury i ograniczeń konkretnego wdrożenia.`,
    en: `${comparison.toolA.name} and ${comparison.toolB.name} address a related need, but differ in ${getCriterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} The ${getCriterionLabel(second.category).toLowerCase()} criterion adds another practical distinction: ${nextDifference} The right choice depends on workload, existing architecture, and deployment constraints.`,
    es: `${comparison.toolA.name} y ${comparison.toolB.name} responden a una necesidad similar, pero difieren en ${getCriterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} El criterio de ${getCriterionLabel(second.category).toLowerCase()} añade otra diferencia práctica: ${nextDifference} La elección depende de la carga, la arquitectura existente y las restricciones del despliegue.`,
    de: `${comparison.toolA.name} und ${comparison.toolB.name} lösen ein ähnliches Problem, unterscheiden sich jedoch bei ${getCriterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} Das Kriterium ${getCriterionLabel(second.category).toLowerCase()} zeigt einen weiteren praktischen Unterschied: ${nextDifference} Die passende Wahl hängt von Arbeitslast, bestehender Architektur und Bereitstellungsvorgaben ab.`,
    fr: `${comparison.toolA.name} et ${comparison.toolB.name} répondent à un besoin proche, mais diffèrent sur ${getCriterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name} : ${toolAReason} ${comparison.toolB.name} : ${toolBReason} Le critère « ${getCriterionLabel(second.category)} » met en évidence une autre différence pratique : ${nextDifference} Le choix dépend de la charge, de l’architecture existante et des contraintes de déploiement.`,
  };
  return templates[locale];
}

function distinctiveDetail(value) {
  const sentences = value.trim().split(/(?<=[.!?])\s+/u).filter(Boolean);
  const candidate = sentences.length > 1 ? sentences.at(-1) : sentences[0];
  if (!candidate) {
    throw new Error("Cannot derive a trade-off from empty comparison text.");
  }
  return candidate.length >= 45 ? candidate : value.trim().slice(0, 360);
}

function migrateFile(locale, fileName, directory = path.join(dataRoot, locale)) {
  const filePath = path.join(directory, fileName);
  const comparison = JSON.parse(readFileSync(filePath, "utf8"));
  const slug = fileName.slice(0, -".json".length);
  if (comparison.slug !== slug) {
    throw new Error(`Slug mismatch in ${filePath}`);
  }

  const category = getCategoryId(slug);
  const existingCriteria = Array.isArray(comparison.comparison)
    ? comparison.comparison
    : [];
  if (existingCriteria.length < 4) {
    throw new Error(`Expected at least four comparison criteria in ${filePath}`);
  }

  const comparisonWithFramework = {
    ...comparison,
    decisionFramework: getDecisionFramework(
      { ...comparison, comparison: existingCriteria },
      locale,
    ),
  };
  const migrated = {
    ...comparison,
    meta: {
      title: getComparisonTitle(
        slug,
        comparison.toolA.name,
        comparison.toolB.name,
        locale,
      ),
      description: getMetaDescription(
        slug,
        comparison.toolA.name,
        comparison.toolB.name,
        locale,
      ),
    },
    heroSubtitle: getHeroSubtitle(
      locale,
      category,
      comparison.toolA.name,
      comparison.toolB.name,
    ),
    introduction: getIntroduction(
      { ...comparison, comparison: existingCriteria },
      locale,
    ),
    decisionFramework: comparisonWithFramework.decisionFramework,
    quickVerdict: getQuickVerdict(comparisonWithFramework, locale),
    tradeoffs: existingCriteria.slice(0, 6).map((criterion) => ({
      category: getCriterionLabel(criterion.category),
      toolA: distinctiveDetail(criterion.toolA),
      toolB: distinctiveDetail(criterion.toolB),
    })),
    codeExamples: createCodeExamples(slug, category, locale),
  };
  if (
    migrated.introduction.length < 180 ||
    migrated.introduction.length > 800 ||
    migrated.quickVerdict.length < 80 ||
    migrated.quickVerdict.length > 500
  ) {
    throw new Error(
      `Generated editorial fields are outside their limits in ${filePath}: introduction=${migrated.introduction.length}, quickVerdict=${migrated.quickVerdict.length}`,
    );
  }

  return { locale, slug, filePath, content: `${JSON.stringify(migrated, null, 2)}\n` };
}

function main() {
  let migratedCount = 0;
  const migrations = [];
  for (const locale of LOCALES) {
    const localeDirectory = path.join(dataRoot, locale);
    const files = readdirSync(localeDirectory)
      .filter((name) => name.endsWith(".json"))
      .sort();
    const seenSlugs = new Set();
    for (const fileName of files) {
      const slug = fileName.slice(0, -".json".length);
      if (seenSlugs.has(slug)) {
        throw new Error(`Duplicate slug "${slug}" in locale ${locale}.`);
      }
      seenSlugs.add(slug);
      migrations.push(migrateFile(locale, fileName));
      migratedCount += 1;
    }
  }
  for (const migration of migrations) {
    writeFileSync(migration.filePath, migration.content, "utf8");
  }
  console.log(`Migrated ${migratedCount} localized comparison files.`);
}

main();
