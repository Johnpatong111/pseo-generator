"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  LOCALES,
  type Locale,
} from "../lib/locales";
import { CATEGORY_IDS, categoryCopy } from "../lib/taxonomy";

const localeLabels: Record<Locale, string> = {
  pl: "PL",
  en: "EN",
  es: "ES",
  de: "DE",
  fr: "FR",
};

const localeFlags: Record<Locale, string> = {
  pl: "🇵🇱",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
};

const languageLabels: Record<Locale, string> = {
  pl: "Zmień język",
  en: "Change language",
  es: "Cambiar idioma",
  de: "Sprache ändern",
  fr: "Changer de langue",
};

const categoryNavLabels: Record<Locale, string> = {
  pl: "Kategorie technologii",
  en: "Technology categories",
  es: "Categorías tecnológicas",
  de: "Technologiekategorien",
  fr: "Catégories technologiques",
};

const matrixLabels: Record<Locale, string> = {
  pl: "Macierz porównań",
  en: "Compare matrix",
  es: "Matriz comparativa",
  de: "Vergleichsmatrix",
  fr: "Matrice comparative",
};

interface HeaderProps {
  locale: Locale;
  comparisonSlugsByLocale: Record<Locale, string[]>;
}

export default function Header({ locale, comparisonSlugsByLocale }: HeaderProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const match = /^\/(pl|en|es|de|fr)\/compare\/([^/]+)\/?$/.exec(pathname);
  const comparisonSlug = match?.[2];
  const [toolA, toolB] = comparisonSlug?.split("-vs-") ?? [];
  const reversedSlug =
    toolA && toolB ? `${toolB}-vs-${toolA}` : undefined;

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 sm:px-8">
        <Link
          href={`/${locale}`}
          aria-label={`${BRAND_NAME} — ${BRAND_TAGLINE[locale]}`}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-lg font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 dark:text-white"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm"
          >
            S
          </span>
          <span className="flex flex-col">
            <span>{BRAND_NAME}</span>
            <span className="hidden max-w-52 text-[10px] font-medium leading-tight tracking-normal text-slate-500 sm:block dark:text-slate-400">
              {BRAND_TAGLINE[locale]}
            </span>
          </span>
        </Link>

        <nav
          aria-label={languageLabels[locale]}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900"
        >
          {LOCALES.map((option) => {
            const localizedSlugs = comparisonSlugsByLocale[option];
            const targetSlug = comparisonSlug
              ? localizedSlugs.includes(comparisonSlug)
                ? comparisonSlug
                : reversedSlug && localizedSlugs.includes(reversedSlug)
                  ? reversedSlug
                  : undefined
              : undefined;
            const href = targetSlug
              ? `/${option}/compare/${targetSlug}`
              : `/${option}`;

            return (
              <Link
                key={option}
                href={href}
                hrefLang={option}
                lang={option}
                aria-label={languageLabels[locale] + ": " + localeLabels[option]}
                aria-current={option === locale ? "page" : undefined}
                className={`min-w-10 rounded-lg px-2.5 py-1.5 text-center text-xs font-bold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  option === locale
                    ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <span aria-hidden="true" className="mr-1">
                  {localeFlags[option]}
                </span>
                {localeLabels[option]}
              </Link>
            );
          })}
        </nav>
      </header>
      <nav
        aria-label={categoryNavLabels[locale]}
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-3 sm:px-8"
      >
        <Link
          href={`/${locale}/matrix`}
          className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-950"
        >
          {matrixLabels[locale]}
        </Link>
        {CATEGORY_IDS.map((category) => (
          <Link
            key={category}
            href={`/${locale}/category/${category}`}
            className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
          >
            {categoryCopy[locale][category].name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
