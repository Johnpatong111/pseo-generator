"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "../lib/locales";

interface SearchComparison {
  slug: string;
  toolA: { name: string };
  toolB: { name: string };
  verdict: string;
}

interface ComparisonSearchProps {
  comparisons: SearchComparison[];
  locale: Locale;
  text: {
    cardLabel: string;
    link: string;
    empty: string;
    noResults: string;
    searchLabel: string;
    searchPlaceholder: string;
    resultCountLabel: string;
    notFound: string;
  };
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function suggestTechnologies(query: string): [string, string] {
  const parts = query
    .trim()
    .split(/\s+(?:vs\.?|versus)\s+|\s+\/\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return [parts[0], parts[1]];
  }

  return [parts[0] ?? "", ""];
}

export default function ComparisonSearch({
  comparisons,
  locale,
  text,
}: ComparisonSearchProps) {
  const [query, setQuery] = useState("");
  const filteredComparisons = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());
    if (!normalizedQuery) {
      return comparisons;
    }

    const [suggestedToolA, suggestedToolB] = suggestTechnologies(query);
    if (suggestedToolB) {
      const normalizedToolA = normalizeSearchText(suggestedToolA);
      const normalizedToolB = normalizeSearchText(suggestedToolB);

      return comparisons.filter(({ toolA, toolB }) => {
        const existingToolA = normalizeSearchText(toolA.name);
        const existingToolB = normalizeSearchText(toolB.name);
        return (
          (existingToolA.includes(normalizedToolA) &&
            existingToolB.includes(normalizedToolB)) ||
          (existingToolA.includes(normalizedToolB) &&
            existingToolB.includes(normalizedToolA))
        );
      });
    }

    return comparisons.filter(({ toolA, toolB }) =>
      normalizeSearchText(`${toolA.name} ${toolB.name}`).includes(normalizedQuery),
    );
  }, [comparisons, query]);

  const [suggestedToolA, suggestedToolB] = suggestTechnologies(query);

  return (
    <>
      <label
        htmlFor="comparison-search"
        className="sr-only"
      >
        {text.searchLabel}
      </label>
      <input
        id="comparison-search"
        type="search"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={text.searchPlaceholder}
        className="mb-5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
      />
      <p aria-live="polite" className="sr-only">
        {text.resultCountLabel} {filteredComparisons.length}.
      </p>

      {filteredComparisons.length > 0 ? (
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {filteredComparisons.map((comparison) => (
            <li key={comparison.slug} className="min-w-0">
              <Link
                href={`/${locale}/compare/${comparison.slug}`}
                hrefLang={locale}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500 dark:focus-visible:outline-indigo-400"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {text.cardLabel}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                  {comparison.toolA.name} vs {comparison.toolB.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {comparison.verdict}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {text.link}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">
            {query ? text.noResults : text.empty}
          </p>
          {query.trim() && (
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
              <p className="font-semibold text-slate-900 dark:text-white">
                {text.notFound}{" "}
                <span className="text-indigo-700 dark:text-indigo-300">
                  {suggestedToolB
                    ? `${suggestedToolA} vs ${suggestedToolB}`
                    : query.trim()}
                </span>
                .
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
