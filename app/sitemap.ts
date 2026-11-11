import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { getComparisons, isIndexableComparison } from "../lib/comparisons";
import { INDEXABLE_LOCALES } from "../lib/indexing";
import { CATEGORY_IDS, getComparisonCategories } from "../lib/taxonomy";
import { canonicalSiteUrl } from "../lib/site-url";

export const dynamic = "force-static";

const trustPages = ["methodology", "privacy", "disclaimer"] as const;

function lastModifiedFor(locale: string, slug: string): Date {
  try {
    return statSync(join(process.cwd(), "data", locale, `${slug}.json`)).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();
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
        lastModified: buildDate,
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      {
        url: canonicalSiteUrl(`/${locale}/matrix`),
        lastModified: buildDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      ...trustPages.map((page) => ({
        url: canonicalSiteUrl(`/${locale}/${page}`),
        lastModified: buildDate,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
      ...(locale === "en"
        ? [
            {
              url: canonicalSiteUrl("/en/alternatives/hono"),
              lastModified: buildDate,
              changeFrequency: "monthly" as const,
              priority: 0.6,
            },
          ]
        : []),
      ...availableCategories.map((category) => ({
        url: canonicalSiteUrl(`/${locale}/category/${category}`),
        lastModified: buildDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...comparisons.map(({ slug }) => ({
        url: canonicalSiteUrl(`/${locale}/compare/${slug}`),
        lastModified: lastModifiedFor(locale, slug),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  });

  // Guard against duplicate URLs if the indexable locale list grows.
  const uniqueUrls = new Map(urls.map((entry) => [entry.url, entry]));
  return [...uniqueUrls.values()];
}
