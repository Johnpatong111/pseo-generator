export const SITE_URL = new URL("https://snippetslibrary.com");

export function absoluteSiteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * Builds an absolute canonical URL without query strings or fragments.
 * Canonicals must never inherit tracking parameters (?ref=, ?utm_*, tokens).
 */
export function canonicalSiteUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  url.search = "";
  url.hash = "";
  return url.toString();
}
