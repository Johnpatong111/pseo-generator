import type { Locale } from "./locales";

/**
 * Languages that are allowed to appear in sitemap.xml, hreflang and indexable
 * metadata. Add a locale here when its translated content is ready for search.
 */
export const INDEXABLE_LOCALES = ["en", "es", "de", "fr", "pl"] as const;

export type IndexableLocale = (typeof INDEXABLE_LOCALES)[number];

export function isIndexableLocale(locale: Locale): locale is IndexableLocale {
  return (INDEXABLE_LOCALES as readonly Locale[]).includes(locale);
}

export function getCanonicalLocale(locale: Locale): IndexableLocale {
  return isIndexableLocale(locale) ? locale : "en";
}
