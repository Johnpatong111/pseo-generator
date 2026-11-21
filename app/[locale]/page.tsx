import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComparisonSearch from "../../components/ComparisonSearch";
import StackWizard from "../../components/StackWizard";
import {
  getComparisons,
  isIndexableComparison,
  isLocale,
  type Locale,
} from "../../lib/comparisons";
import { INDEXABLE_LOCALES } from "../../lib/indexing";
import { absoluteSiteUrl, canonicalSiteUrl } from "../../lib/site-url";

const copy = {
  pl: {
    title: "SnippetsLibrary — przykłady kodu i porównania technologii",
    description:
      "Przykłady kodu, wzorce architektury i porównania frameworków, baz danych oraz modeli AI. Wybierz technologię dopasowaną do projektu.",
    eyebrow: "Praktyczne porównania dla developerów",
    heading: "Wybierz technologie odpowiednie dla swojego projektu",
    intro: "Porównaj funkcje, wydajność, ekosystem i typowe zastosowania popularnych narzędzi.",
    listings: "Wszystkie porównania",
    cardLabel: "Porównanie technologii",
    link: "Zobacz porównanie",
    empty: "Porównania wkrótce pojawią się w tym języku.",
    count: "porównań",
    searchLabel: "Wyszukaj porównanie",
    searchPlaceholder: "Wpisz nazwę technologii, np. PostgreSQL lub React…",
    noResults: "Nie znaleziono porównań dla tej nazwy technologii.",
    resultCountLabel: "Liczba pasujących porównań:",
    notFound: "Nie znaleziono porównania:",
  },
  en: {
    title: "SnippetsLibrary — code snippets & tech comparisons",
    description:
      "Copy practical code snippets and compare backend frameworks, databases, and AI tools: performance, trade-offs, and code examples for developers.",
    eyebrow: "Practical comparisons for developers",
    heading: "Choose the right technologies for your project",
    intro: "Compare the features, performance, ecosystems, and use cases of popular tools.",
    listings: "All comparisons",
    cardLabel: "Technology comparison",
    link: "View comparison",
    empty: "Comparisons in this language will be available soon.",
    count: "comparisons",
    searchLabel: "Search comparisons",
    searchPlaceholder: "Search for a technology, such as PostgreSQL or React…",
    noResults: "No comparisons match that technology.",
    resultCountLabel: "Matching comparisons:",
    notFound: "No comparison found:",
  },
  es: {
    title: "SnippetsLibrary — fragmentos de código y comparativas",
    description:
      "Ejemplos de código, patrones de arquitectura y comparativas de frameworks, bases de datos y modelos de IA. Elige la tecnología para tu proyecto.",
    eyebrow: "Comparativas prácticas para desarrolladores",
    heading: "Elige las tecnologías adecuadas para tu proyecto",
    intro: "Compara las funciones, el rendimiento, los ecosistemas y los usos habituales de herramientas populares.",
    listings: "Todas las comparativas",
    cardLabel: "Comparativa de tecnologías",
    link: "Ver comparativa",
    empty: "Próximamente habrá comparativas disponibles en este idioma.",
    count: "comparativas",
    searchLabel: "Buscar comparativas",
    searchPlaceholder: "Busca una tecnología, por ejemplo PostgreSQL o React…",
    noResults: "No hay comparativas para esa tecnología.",
    resultCountLabel: "Comparativas coincidentes:",
    notFound: "No se encontró la comparativa:",
  },
  de: {
    title: "SnippetsLibrary — Codebeispiele und Technologievergleiche",
    description:
      "Codebeispiele, Architekturmuster und Vergleiche von Frameworks, Datenbanken und KI-Modellen. Finde die passende Technologie für dein Projekt.",
    eyebrow: "Praxisnahe Vergleiche für Entwickler",
    heading: "Finde die passenden Technologien für dein Projekt",
    intro: "Vergleiche Funktionen, Leistung, Ökosysteme und typische Einsatzbereiche beliebter Tools.",
    listings: "Alle Vergleiche",
    cardLabel: "Technologievergleich",
    link: "Vergleich ansehen",
    empty: "Vergleiche in dieser Sprache folgen in Kürze.",
    count: "Vergleiche",
    searchLabel: "Vergleiche suchen",
    searchPlaceholder: "Technologie suchen, zum Beispiel PostgreSQL oder React…",
    noResults: "Keine Vergleiche für diese Technologie gefunden.",
    resultCountLabel: "Passende Vergleiche:",
    notFound: "Kein Vergleich gefunden:",
  },
  fr: {
    title: "SnippetsLibrary — exemples de code et comparatifs",
    description:
      "Exemples de code, modèles d’architecture et comparatifs de frameworks, bases de données et modèles d’IA. Choisissez la technologie adaptée à votre projet.",
    eyebrow: "Des comparatifs pratiques pour les développeurs",
    heading: "Choisissez les technologies adaptées à votre projet",
    intro: "Comparez les fonctionnalités, performances, écosystèmes et cas d’usage d’outils populaires.",
    listings: "Tous les comparatifs",
    cardLabel: "Comparatif de technologies",
    link: "Voir le comparatif",
    empty: "Les comparatifs dans cette langue seront bientôt disponibles.",
    count: "comparatifs",
    searchLabel: "Rechercher des comparatifs",
    searchPlaceholder: "Recherchez une technologie, par exemple PostgreSQL ou React…",
    noResults: "Aucun comparatif ne correspond à cette technologie.",
    resultCountLabel: "Comparatifs correspondants :",
    notFound: "Aucun comparatif trouvé :",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    intro: string;
    listings: string;
    cardLabel: string;
    link: string;
    empty: string;
    count: string;
    searchLabel: string;
    searchPlaceholder: string;
    noResults: string;
    resultCountLabel: string;
    notFound: string;
  }
>;

function getCardSummary(verdict: string): string {
  const first = verdict.trim().split(/(?<=[.!?])\s+/u)[0] ?? verdict.trim();
  if (first.length <= 220) return first;

  const window = first.slice(0, 221);
  const boundaries = [", ", "; ", " — ", " - "]
    .map((delimiter) => window.lastIndexOf(delimiter))
    .filter((index) => index > 0);
  const boundary = boundaries.length
    ? Math.max(...boundaries)
    : window.lastIndexOf(" ");

  if (boundary <= 0) return `${first.slice(0, 220).trim()}.`;
  return `${first.slice(0, boundary).replace(/[\s,;:\-]+$/u, "")}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return {
    title: { absolute: copy[locale].title },
    description: copy[locale].description,
    alternates: {
      canonical: canonicalSiteUrl(`/${locale}`),
      languages: {
        ...Object.fromEntries(
          INDEXABLE_LOCALES.map((option) => [
            option,
            canonicalSiteUrl(`/${option}`),
          ]),
        ),
        "x-default": absoluteSiteUrl("/en"),
      },
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const text = copy[locale];
  const comparisons = getComparisons(locale).filter(isIndexableComparison);
  const cardComparisons = comparisons.map(({ slug, toolA, toolB, verdict }) => ({
    slug,
    toolA,
    toolB,
    verdict: getCardSummary(verdict),
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-24">
      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-16">
        <p className="mb-4 text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
          {text.eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          {text.heading}
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
          {text.intro}
        </p>
      </header>

      <StackWizard
        locale={locale}
        comparisons={comparisons.map(({ slug, toolA, toolB }) => ({
          slug,
          toolA,
          toolB,
        }))}
      />

      <section aria-labelledby="comparisons-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2
            id="comparisons-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            {text.listings}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {comparisons.length} {text.count}
          </p>
        </div>

        <ComparisonSearch
          comparisons={cardComparisons}
          locale={locale}
          text={text}
        />
      </section>
    </main>
  );
}
