"use strict";

/**
 * Shared SEO rules for comparison pages.
 * Consumed by the Next.js metadata generator and the content scripts.
 */

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 155;
const BRAND_NAME = "SnippetsLibrary";
const CURRENT_YEAR = new Date().getFullYear();

const CATEGORIES = [
  "frontend",
  "backend",
  "databases",
  "ai-models",
  "devops",
  "css",
  "general",
];

const titleTemplates = {
  en: `{pair}: Which to Choose in ${CURRENT_YEAR}?`,
  pl: `{pair}: co wybrać w ${CURRENT_YEAR}?`,
  es: `{pair}: ¿cuál elegir en ${CURRENT_YEAR}?`,
  de: `{pair}: Was wählen in ${CURRENT_YEAR}?`,
  fr: `{pair} : que choisir en ${CURRENT_YEAR} ?`,
};

const descriptionConfig = {
  en: {
    audience: {
      frontend: "frontend developers",
      backend: "backend developers",
      databases: "data engineers",
      "ai-models": "AI engineers",
      devops: "platform teams",
      css: "product teams",
      general: "engineering teams",
    },
    focus: {
      frontend: ["rendering", "routing", "state management"],
      backend: ["performance", "routing", "concurrency"],
      databases: ["query performance", "data modeling", "scaling"],
      "ai-models": ["context windows", "API pricing", "latency"],
      devops: ["deployment", "scaling", "cost"],
      css: ["styling", "components", "theming", "maintenance"],
      general: ["performance", "integration"],
    },
    template: ({ pair, focus, audience }) =>
      `${pair} comparison: ${focus}, and architecture trade-offs for ${audience}.`,
    compact: ({ pair, audience }) =>
      `${pair} comparison: architecture trade-offs for ${audience}.`,
    padding: " Review code examples before choosing.",
  },
  pl: {
    audience: {
      frontend: "programistów frontendu",
      backend: "programistów backendu",
      databases: "inżynierów danych",
      "ai-models": "inżynierów AI",
      devops: "zespołów platformowych",
      css: "zespołów produktowych",
      general: "zespołów inżynierskich",
    },
    focus: {
      frontend: ["rendering", "routing", "zarządzanie stanem"],
      backend: ["wydajność", "routing", "współbieżność"],
      databases: ["wydajność zapytań", "modelowanie danych", "skalowanie"],
      "ai-models": ["okna kontekstu", "ceny API", "opóźnienia"],
      devops: ["wdrożenia", "skalowanie", "koszty"],
      css: ["stylowanie", "komponenty", "motywy", "utrzymanie"],
      general: ["wydajność", "integrację"],
    },
    template: ({ pair, focus, audience }) =>
      `Porównanie ${pair}: ${focus} i kompromisy architektoniczne dla ${audience}.`,
    compact: ({ pair, audience }) =>
      `Porównanie ${pair}: kompromisy architektoniczne dla ${audience}.`,
    padding: " Sprawdź przykłady kodu przed wyborem.",
  },

  es: {
    audience: {
      frontend: "desarrolladores frontend",
      backend: "desarrolladores backend",
      databases: "ingenieros de datos",
      "ai-models": "ingenieros de IA",
      devops: "equipos de plataforma",
      css: "equipos de producto",
      general: "equipos de ingeniería",
    },
    focus: {
      frontend: ["renderizado", "enrutamiento", "gestión de estado"],
      backend: ["rendimiento", "enrutamiento", "concurrencia"],
      databases: ["rendimiento de consultas", "modelado de datos", "escalado"],
      "ai-models": ["ventanas de contexto", "precios de API", "latencia"],
      devops: ["despliegue", "escalado", "costes"],
      css: ["estilos", "componentes", "temas", "mantenimiento"],
      general: ["rendimiento", "integración"],
    },
    template: ({ pair, focus, audience }) =>
      `Comparativa ${pair}: ${focus} y compromisos de arquitectura para ${audience}.`,
    compact: ({ pair, audience }) =>
      `Comparativa ${pair}: compromisos de arquitectura para ${audience}.`,
    padding: " Revisa ejemplos de código antes de elegir.",
  },
  de: {
    audience: {
      frontend: "Frontend-Entwickler",
      backend: "Backend-Entwickler",
      databases: "Data Engineers",
      "ai-models": "AI-Engineers",
      devops: "Plattform-Teams",
      css: "Produkt-Teams",
      general: "Engineering-Teams",
    },
    focus: {
      frontend: ["Rendering", "Routing", "Zustandsverwaltung"],
      backend: ["Leistung", "Routing", "Nebenläufigkeit"],
      databases: ["Abfrageleistung", "Datenmodellierung", "Skalierung"],
      "ai-models": ["Kontextfenster", "API-Preise", "Latenz"],
      devops: ["Bereitstellung", "Skalierung", "Kosten"],
      css: ["Styling", "Komponenten", "Theming", "Wartung"],
      general: ["Leistung", "Integration"],
    },
    template: ({ pair, focus, audience }) =>
      `Vergleich ${pair}: ${focus} und Architekturkompromisse für ${audience}.`,
    compact: ({ pair, audience }) =>
      `Vergleich ${pair}: Architekturkompromisse für ${audience}.`,
    padding: " Prüfe Codebeispiele vor der Entscheidung.",
  },
  fr: {
    audience: {
      frontend: "développeurs frontend",
      backend: "développeurs backend",
      databases: "ingénieurs données",
      "ai-models": "ingénieurs IA",
      devops: "équipes plateforme",
      css: "équipes produit",
      general: "équipes d’ingénierie",
    },
    focus: {
      frontend: ["rendu", "routage", "gestion d’état"],
      backend: ["performances", "routage", "concurrence"],
      databases: ["performances des requêtes", "modélisation", "mise à l’échelle"],
      "ai-models": ["fenêtres de contexte", "tarifs API", "latence"],
      devops: ["déploiement", "mise à l’échelle", "coûts"],
      css: ["styles", "composants", "thèmes", "maintenance"],
      general: ["performance", "intégration"],
    },
    template: ({ pair, focus, audience }) =>
      `Comparatif ${pair} : ${focus} et compromis d’architecture pour les ${audience}.`,
    compact: ({ pair, audience }) =>
      `Comparatif ${pair} : compromis d’architecture pour les ${audience}.`,
    padding: " Vérifiez les exemples de code.",
  },
};

function normalizeLocale(locale) {
  return Object.prototype.hasOwnProperty.call(titleTemplates, locale) ? locale : "en";
}

function normalizeCategory(category) {
  return CATEGORIES.includes(category) ? category : "general";
}

function truncateAtWord(text, maxLength) {
  const normalized = text.replace(/\s+/gu, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const slice = normalized.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const truncated = lastSpace > 0 ? slice.slice(0, lastSpace) : normalized.slice(0, maxLength);
  return truncated.replace(/[\s,;:.\-]+$/u, "").trim();
}

function joinFocus(parts) {
  return parts.join(", ");
}

/**
 * Builds a SERP-safe comparison title (hard limit: 60 characters) following
 * the "{TechA} vs {TechB}: Which to Choose in {year}?" pattern.
 */
function getComparisonSeoTitle(toolA, toolB, locale = "en") {
  const pair = `${toolA} vs ${toolB}`;
  const template = titleTemplates[normalizeLocale(locale)];
  const candidate = template.replace("{pair}", pair);

  if (candidate.length <= SEO_TITLE_MAX) return candidate;
  if (pair.length <= SEO_TITLE_MAX) return pair;

  return truncateAtWord(pair, SEO_TITLE_MAX);
}

/**
 * Full <title> value, appending the brand only when the result stays within
 * the 60-character SERP budget.
 */
function getComparisonDocumentTitle(toolA, toolB, locale = "en") {
  const title = getComparisonSeoTitle(toolA, toolB, locale);
  const branded = `${title} | ${BRAND_NAME}`;
  return branded.length <= SEO_TITLE_MAX ? branded : title;
}

/**
 * Builds a meta description (hard limit: 155 characters) from the real tool
 * names and comparison category. It never mentions TypeScript unless one of
 * the compared technologies is TypeScript itself.
 */
function getComparisonSeoDescription(
  toolA,
  toolB,
  category = "general",
  locale = "en",
) {
  const config = descriptionConfig[normalizeLocale(locale)];
  const categoryId = normalizeCategory(category);
  const pair = `${toolA} vs ${toolB}`;
  const audience = config.audience[categoryId];
  const focusParts = [...config.focus[categoryId]];

  const finalize = (candidate) => {
    if (candidate.length < 100) {
      const padded = `${candidate}${config.padding}`;
      if (padded.length <= SEO_DESCRIPTION_MAX) return padded;
    }
    return candidate;
  };

  while (focusParts.length > 0) {
    const focus = joinFocus(focusParts);
    const candidate = config.template({ pair, focus, audience });
    if (candidate.length <= SEO_DESCRIPTION_MAX) return finalize(candidate);
    focusParts.pop();
  }

  const compact = config.compact({ pair, audience });
  if (compact.length <= SEO_DESCRIPTION_MAX) return finalize(compact);

  const shortened = truncateAtWord(compact, SEO_DESCRIPTION_MAX - 1);
  return finalize(`${shortened.replace(/[.,;:]+$/u, "")}.`);
}

function getComparisonMeta(toolA, toolB, category, locale) {
  return {
    title: getComparisonSeoTitle(toolA, toolB, locale),
    documentTitle: getComparisonDocumentTitle(toolA, toolB, locale),
    description: getComparisonSeoDescription(toolA, toolB, category, locale),
  };
}

module.exports = {
  BRAND_NAME,
  CURRENT_YEAR,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  getComparisonDocumentTitle,
  getComparisonMeta,
  getComparisonSeoDescription,
  getComparisonSeoTitle,
  truncateAtWord,
};
