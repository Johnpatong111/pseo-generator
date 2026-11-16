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
  pl: "Praktyczne przykłady kodu, diagramy architektury i porównania modeli AI — wszystko, by podejmować trafne decyzje techniczne.",
  en: "Practical code examples, architecture diagrams, and AI model comparisons to help developers make informed technical decisions.",
  es: "Ejemplos prácticos de código, diagramas de arquitectura y comparativas de modelos de IA para decidir mejor.",
  de: "Praktische Codebeispiele, Architekturdiagramme und KI-Modellvergleiche für fundierte technische Entscheidungen.",
  fr: "Exemples de code, diagrammes d’architecture et comparatifs de modèles d’IA pour des choix techniques éclairés.",
};
