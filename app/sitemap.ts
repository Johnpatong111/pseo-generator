import type { MetadataRoute } from "next";
import { getComparisons, isIndexableComparison } from "../lib/comparisons";
import { INDEXABLE_LOCALES } from "../lib/indexing";
import { CATEGORY_IDS, getComparisonCategories } from "../lib/taxonomy";
import { canonicalSiteUrl } from "../lib/site-url";

export const dynamic = "force-static";

const trustPages = ["methodology", "privacy", "disclaimer"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = INDEXABLE_LOCALES.flatMap((locale) => {
    const comparisons = getComparisons(locale).filter(isIndexableComparison);
    const availableCategories = CATEGORY_IDS.filter((category) =>
      comparisons.some(({ slug }) =>
        getComparisonCategories(slug).includes(category),
      ),
    );

    return [
      {
        url: canonicalSiteUrl(`/${locale}`),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      {
        url: canonicalSiteUrl(`/${locale}/matrix`),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      ...trustPages.map((page) => ({
        url: canonicalSiteUrl(`/${locale}/${page}`),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
      ...availableCategories.map((category) => ({
        url: canonicalSiteUrl(`/${locale}/category/${category}`),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...comparisons.map(({ slug }) => ({
        url: canonicalSiteUrl(`/${locale}/compare/${slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  });

  // Guard against duplicate URLs if the indexable locale list grows.
  const uniqueUrls = new Map(urls.map((entry) => [entry.url, entry]));
  return [...uniqueUrls.values()];
}
