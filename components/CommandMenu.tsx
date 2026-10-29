"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { Locale } from "../lib/locales";
import type { CategoryId } from "../lib/taxonomy";

export interface SearchComparison {
  slug: string;
  label: string;
  locale: Locale;
}

export interface SearchCategory {
  id: CategoryId;
  label: string;
  locale: Locale;
}

interface CommandMenuProps {
  locale: Locale;
  comparisons: SearchComparison[];
  categories: SearchCategory[];
}

const copy = {
  pl: {
    open: "Szukaj porównań",
    placeholder: "Wpisz technologię lub kategorię...",
    close: "Zamknij wyszukiwarkę",
    empty: "Brak wyników. Spróbuj innej frazy.",
    category: "Kategoria",
    comparison: "Porównanie",
    hint: "Wybierz strzałkami, Enter otwiera, Esc zamyka",
  },
  en: {
    open: "Search comparisons",
    placeholder: "Search a technology or category...",
    close: "Close search",
    empty: "No matches. Try another query.",
    category: "Category",
    comparison: "Comparison",
    hint: "Use arrows to navigate, Enter to open, Esc to close",
  },
  es: {
    open: "Buscar comparativas",
    placeholder: "Busca una tecnología o categoría...",
    close: "Cerrar búsqueda",
    empty: "No hay resultados. Prueba otra búsqueda.",
    category: "Categoría",
    comparison: "Comparativa",
    hint: "Usa las flechas, Enter para abrir y Esc para cerrar",
  },
  de: {
    open: "Vergleiche suchen",
    placeholder: "Technologie oder Kategorie suchen...",
    close: "Suche schließen",
    empty: "Keine Treffer. Versuche eine andere Suche.",
    category: "Kategorie",
    comparison: "Vergleich",
    hint: "Pfeiltasten zum Navigieren, Enter zum Öffnen, Esc zum Schließen",
  },
  fr: {
    open: "Rechercher des comparatifs",
    placeholder: "Rechercher une technologie ou catégorie...",
    close: "Fermer la recherche",
    empty: "Aucun résultat. Essayez une autre recherche.",
    category: "Catégorie",
    comparison: "Comparatif",
    hint: "Flèches pour naviguer, Entrée pour ouvrir, Échap pour fermer",
  },
} as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function CommandMenu({
  locale,
  comparisons,
  categories,
}: CommandMenuProps) {
  const router = useRouter();
  const text = copy[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const categoryResults = categories
      .filter(
        ({ id, label }) =>
          !normalizedQuery ||
          normalize(`${label} ${id}`).includes(normalizedQuery),
      )
      .sort(
        (left, right) =>
          Number(right.locale === locale) - Number(left.locale === locale),
      )
      .map((category) => ({
        type: "category" as const,
        label: category.label,
        href: `/${category.locale}/category/${category.id}`,
        locale: category.locale,
        key: `category-${category.locale}-${category.id}`,
      }));
    const comparisonResults = comparisons
      .filter(
        ({ label, slug }) =>
          !normalizedQuery ||
          normalize(`${label} ${slug}`).includes(normalizedQuery),
      )
      .sort(
        (left, right) =>
          Number(right.locale === locale) - Number(left.locale === locale),
      )
      .map((comparison) => ({
        type: "comparison" as const,
        label: comparison.label,
        href: `/${comparison.locale}/compare/${comparison.slug}`,
        locale: comparison.locale,
        key: `comparison-${comparison.locale}-${comparison.slug}`,
      }));

    return [...categoryResults, ...comparisonResults].slice(
      0,
      normalizedQuery ? 40 : categories.length + 8,
    );
  }, [categories, comparisons, locale, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      } else if (event.key === "Tab" && isOpen) {
        const dialog = inputRef.current?.closest('[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'input:not([disabled]), button:not([disabled])',
        );
        if (!focusable?.length) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function navigateTo(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((index) => (index + 1) % results.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((index) => (index - 1 + results.length) % results.length);
      }
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      navigateTo(results[activeIndex].href);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`${text.open} (⌘/Ctrl+K)`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:min-w-0 sm:justify-start sm:px-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-300"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="size-4 shrink-0"
        >
          <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="hidden lg:inline">{text.open}</span>
        <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline dark:border-slate-700 dark:text-slate-400">
          ⌘ / Ctrl K
        </kbd>
      </button>

      {isOpen &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/50 px-3 py-4 backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={text.open}
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0 text-slate-400"
              >
                <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={text.placeholder}
                aria-label={text.placeholder}
                aria-controls="command-menu-results"
                aria-activedescendant={
                  results[activeIndex]?.key ?? undefined
                }
                role="combobox"
                aria-expanded="true"
                aria-autocomplete="list"
                className="h-14 min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={text.close}
                className="min-h-11 min-w-11 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800"
              >
                Esc
              </button>
            </div>

            <ul
              id="command-menu-results"
              role="listbox"
              aria-label={text.open}
              className="max-h-[calc(100dvh-12rem)] overflow-y-auto p-2 sm:max-h-[55vh]"
            >
              {results.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  {text.empty}
                </li>
              ) : (
                results.map((result, index) => (
                  <li key={result.key} role="presentation">
                    <button
                      id={result.key}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigateTo(result.href)}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-indigo-600 sm:px-4 ${
                        activeIndex === index
                          ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-300"
                      >
                        {result.type === "category" ? "#" : "↔"}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {result.label}
                      </span>
                      <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                        {result.type === "category"
                          ? text.category
                          : text.comparison}
                      </span>
                      <span className="shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        {result.locale}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {text.hint}
            </p>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
