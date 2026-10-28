const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://snippetslibrary.com";

export const SITE_URL = new URL(
  /^https?:\/\//i.test(configuredSiteUrl)
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`,
);
