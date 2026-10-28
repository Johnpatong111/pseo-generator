export const SITE_URL = new URL("https://snippetslibrary.com");

export function absoluteSiteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
