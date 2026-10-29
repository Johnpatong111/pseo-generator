"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    generateCta: string;
    generateTitle: string;
    tech1Label: string;
    tech2Label: string;
    generate: string;
    generating: string;
    close: string;
    generateError: string;
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toolA, setToolA] = useState("");
  const [toolB, setToolB] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
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

  function openGenerationDialog() {
    const [suggestedToolA, suggestedToolB] = suggestTechnologies(query);
    setToolA(suggestedToolA);
    setToolB(suggestedToolB);
    setGenerationError("");
    setIsDialogOpen(true);
  }

  async function generateComparison(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tech1: toolA, tech2: toolB, locale }),
      });
      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("url" in result) ||
        typeof result.url !== "string"
      ) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : text.generateError;
        throw new Error(message);
      }

      router.push(result.url);
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : text.generateError,
      );
      setIsGenerating(false);
    }
  }

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
              <button
                type="button"
                onClick={openGenerationDialog}
                className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {text.generateCta}
              </button>
            </div>
          )}
        </div>
      )}

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isGenerating) {
              setIsDialogOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="generate-comparison-title"
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {text.generateCta}
                </p>
                <h2
                  id="generate-comparison-title"
                  className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
                >
                  {text.generateTitle}
                </h2>
              </div>
              <button
                type="button"
                aria-label={text.close}
                disabled={isGenerating}
                onClick={() => setIsDialogOpen(false)}
                className="min-h-11 min-w-11 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <form onSubmit={generateComparison} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="generate-tech-1"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {text.tech1Label}
                </label>
                <input
                  id="generate-tech-1"
                  required
                  maxLength={50}
                  value={toolA}
                  onChange={(event) => setToolA(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="generate-tech-2"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {text.tech2Label}
                </label>
                <input
                  id="generate-tech-2"
                  required
                  maxLength={50}
                  value={toolB}
                  onChange={(event) => setToolB(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              {generationError && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {generationError}
                </p>
              )}
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isGenerating && (
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                )}
                {isGenerating ? text.generating : text.generate}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
