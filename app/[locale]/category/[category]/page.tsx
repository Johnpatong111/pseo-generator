import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getComparisons,
  isLocale,
  LOCALES,
  type Locale,
} from "../../../../lib/comparisons";
import {
  CATEGORY_IDS,
  categoryCopy,
  getComparisonCategories,
  type CategoryId,
} from "../../../../lib/taxonomy";
import { absoluteSiteUrl } from "../../../../lib/site-url";

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

const pageCopy = {
  pl: {
    all: "Wszystkie kategorie",
    count: "porównań",
    empty: "W tej kategorii nie ma jeszcze porównań.",
    label: "Porównanie technologii",
    view: "Zobacz porównanie",
  },
  en: {
    all: "All categories",
    count: "comparisons",
    empty: "There are no comparisons in this category yet.",
    label: "Technology comparison",
    view: "View comparison",
  },
  es: {
    all: "Todas las categorías",
    count: "comparativas",
    empty: "Todavía no hay comparativas en esta categoría.",
    label: "Comparativa de tecnología",
    view: "Ver comparativa",
  },
  de: {
    all: "Alle Kategorien",
    count: "Vergleiche",
    empty: "In dieser Kategorie gibt es noch keine Vergleiche.",
    label: "Technologievergleich",
    view: "Vergleich ansehen",
  },
  fr: {
    all: "Toutes les catégories",
    count: "comparatifs",
    empty: "Il n’y a pas encore de comparatifs dans cette catégorie.",
    label: "Comparatif de technologies",
    view: "Voir le comparatif",
  },
} as const;

function isCategory(value: string): value is CategoryId {
  return CATEGORY_IDS.some((category) => category === value);
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CATEGORY_IDS.map((category) => ({ locale, category })),
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale: localeParam, category: categoryParam } = await params;
  if (!isLocale(localeParam) || !isCategory(categoryParam)) {
    return {};
  }

  const category = categoryCopy[localeParam][categoryParam];
  return {
    title: `${category.name} — ${category.description.split(".")[0]}`,
    description: category.description,
    alternates: {
      canonical: absoluteSiteUrl(
        `/${localeParam}/category/${categoryParam}`,
      ),
      languages: {
        ...Object.fromEntries(
          LOCALES.map((locale) => [
            locale,
            absoluteSiteUrl(`/${locale}/category/${categoryParam}`),
          ]),
        ),
        "x-default": absoluteSiteUrl(`/en/category/${categoryParam}`),
      },
    },
    openGraph: {
      title: category.name,
      description: category.description,
      type: "website",
      locale: {
        pl: "pl_PL",
        en: "en_US",
        es: "es_ES",
        de: "de_DE",
        fr: "fr_FR",
      }[localeParam],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: localeParam, category: categoryParam } = await params;
  if (!isLocale(localeParam) || !isCategory(categoryParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const category = categoryCopy[locale][categoryParam];
  const text = pageCopy[locale];
  const comparisons = getComparisons(locale).filter((comparison) =>
    getComparisonCategories(comparison.slug).includes(categoryParam),
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
      <nav aria-label={text.all} className="mb-8">
        <Link
          href={`/${locale}`}
          className="text-sm font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
        >
          ← {text.all}
        </Link>
      </nav>
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {category.summary}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          {category.name}
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
          {category.description}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <span className="text-indigo-600 dark:text-indigo-400">{comparisons.length}</span>
          {text.count}
        </p>
      </header>

      {comparisons.length > 0 ? (
        <section aria-label={category.name}>
          <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {comparisons.map((comparison) => (
              <li key={comparison.slug} className="min-w-0">
                <Link
                  href={`/${locale}/compare/${comparison.slug}`}
                  hrefLang={locale}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {text.label}
                  </span>
                  <h2 className="mt-3 break-words text-lg font-semibold tracking-tight text-slate-900 group-hover:text-indigo-700 sm:text-xl dark:text-white dark:group-hover:text-indigo-300">
                    {comparison.toolA.name} vs {comparison.toolB.name}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {comparison.verdict}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {text.view}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {text.empty}
        </p>
      )}
    </main>
  );
}
