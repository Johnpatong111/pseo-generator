import Link from "next/link";
import CommandMenu, {
  type SearchCategory,
  type SearchComparison,
} from "../../components/CommandMenu";
import { getComparisonBySlug, getComparisons, LOCALES } from "../../lib/comparisons";
import { CATEGORY_IDS, categoryCopy } from "../../lib/taxonomy";

const comparisons: SearchComparison[] = LOCALES.flatMap((locale) =>
  getComparisons(locale).map(({ slug, toolA, toolB }) => ({
    slug,
    label: `${toolA.name} vs ${toolB.name}`,
    locale,
  })),
);
const categories: SearchCategory[] = LOCALES.flatMap((locale) =>
  CATEGORY_IDS.map((id) => ({
    id,
    label: categoryCopy[locale][id].name,
    locale,
  })),
);
const popularSlugs = [
  "supabase-vs-firebase",
  "react-vs-vue",
  "postgresql-vs-mongodb",
  "nextjs-vs-remix",
  "tailwind-vs-bootstrap",
];
const popularComparisons = popularSlugs
  .map((slug) => getComparisonBySlug(slug, "en"))
  .filter((comparison) => comparison !== undefined);

export default function LocaleNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
        Page not found
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
        The page may have moved or the URL may be incorrect. Search the comparison library or start with a popular comparison.
      </p>
      <div className="mt-6">
        <CommandMenu locale="en" comparisons={comparisons} categories={categories} />
      </div>
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Popular comparisons
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {popularComparisons.map(({ slug, toolA, toolB }) => (
            <li key={slug}>
              <Link
                href={`/en/compare/${slug}`}
                className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
              >
                {toolA.name} vs {toolB.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Link
        href="/en"
        className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Return to SnippetsLibrary
      </Link>
    </main>
  );
}
