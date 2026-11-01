export const LOCALES = ["en", "es", "de", "fr", "pl"] as const;
export type Locale = (typeof LOCALES)[number];

export const BRAND_NAME = "SnippetsLibrary";

export const BRAND_TAGLINE: Record<Locale, string> = {
  pl: "Przykłady kodu, architektura i porównania modeli AI",
  en: "Code snippets, architecture, and AI model comparisons",
  es: "Fragmentos de código, arquitectura y comparativas de modelos de IA",
  de: "Codebeispiele, Architektur und KI-Modellvergleiche",
  fr: "Exemples de code, architecture et comparatifs de modèles d’IA",
};

export const BRAND_DESCRIPTION: Record<Locale, string> = {
  pl: "SnippetsLibrary łączy praktyczne przykłady kodu, diagramy architektury i porównania modeli AI oraz technologii, pomagając programistom podejmować trafne decyzje.",
  en: "SnippetsLibrary brings together practical code examples, architecture diagrams, and comparisons of AI models and technologies to help developers make informed decisions.",
  es: "SnippetsLibrary reúne ejemplos prácticos de código, diagramas de arquitectura y comparativas de modelos de IA y tecnologías para ayudar a los desarrolladores a tomar decisiones informadas.",
  de: "SnippetsLibrary vereint praktische Codebeispiele, Architekturdiagramme und Vergleiche von KI-Modellen und Technologien, damit Entwickler fundierte Entscheidungen treffen können.",
  fr: "SnippetsLibrary réunit des exemples de code pratiques, des diagrammes d’architecture et des comparatifs de modèles d’IA et de technologies pour aider les développeurs à faire des choix éclairés.",
};
