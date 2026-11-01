export function createCodeExamples(
  slug: string,
  category: string,
  locale?: "pl" | "en" | "es" | "de" | "fr",
): {
  scenario: string;
  tech1Snippet: string;
  tech2Snippet: string;
};

export function getScenario(
  locale: "pl" | "en" | "es" | "de" | "fr",
  category: string,
  slug?: string,
): string;

export const scenarios: {
  pl: string;
  en: string;
  es: string;
  de: string;
  fr: string;
};
