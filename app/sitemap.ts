import type { MetadataRoute } from "next";
import { getComparisons, isIndexableComparison, LOCALES } from "../lib/comparisons";
import { CATEGORY_IDS, getComparisonCategories } from "../lib/taxonomy";
import { SITE_URL } from "../lib/site-url";

export const dynamic = "force-static";

const trustPages = ["methodology", "privacy", "disclaimer"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...LOCALES.flatMap((locale) => {
      const comparisons = getComparisons(locale).filter(isIndexableComparison);
      const availableCategories = CATEGORY_IDS.filter((category) =>
        comparisons.some(({ slug }) =>
          getComparisonCategories(slug).includes(category),
        ),
      );

      return [
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
        ...trustPages.map((page) => ({
          url: new URL(`/${locale}/${page}`, SITE_URL).toString(),
          changeFrequency: "yearly" as const,
          priority: 0.3,
        })),
        ...availableCategories.map((category) => ({
          url: new URL(`/${locale}/category/${category}`, SITE_URL).toString(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
        ...comparisons.map(({ slug }) => ({
          url: new URL(`/${locale}/compare/${slug}`, SITE_URL).toString(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
      ];
    }),
  ];
}
