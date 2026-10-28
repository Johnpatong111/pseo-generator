import type { MetadataRoute } from "next";
import { getComparisons, LOCALES } from "../lib/comparisons";
import { CATEGORY_IDS } from "../lib/taxonomy";
import { SITE_URL } from "../lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...LOCALES.flatMap((locale) => [
      {
        url: new URL(`/${locale}`, SITE_URL).toString(),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      {
        url: new URL(`/${locale}/matrix`, SITE_URL).toString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      ...CATEGORY_IDS.map((category) => ({
        url: new URL(`/${locale}/category/${category}`, SITE_URL).toString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...getComparisons(locale).map(({ slug }) => ({
        url: new URL(`/${locale}/compare/${slug}`, SITE_URL).toString(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ]),
  ];
}
