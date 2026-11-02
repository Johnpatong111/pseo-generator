import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComparisonSearch from "../../components/ComparisonSearch";
import StackWizard from "../../components/StackWizard";
import {
  getComparisons,
  isLocale,
  LOCALES,
  type Locale,
} from "../../lib/comparisons";
import { BRAND_DESCRIPTION } from "../../lib/locales";
import { absoluteSiteUrl } from "../../lib/site-url";

const copy = {
  pl: {
    title: "Porównaj technologie backendowe i bazy danych",
    description:
      "Sprawdź szczegółowe porównania baz danych, frameworków i platform backendowych. Wybierz technologie dopasowane do swojego projektu.",
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
    title: "Compare backend technologies and databases",
    description:
      "Explore detailed comparisons of databases, frameworks, and backend platforms. Find the technologies that fit your project.",
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
    title: "Compara tecnologías backend y bases de datos",
    description:
      "Descubre comparativas detalladas de bases de datos, frameworks y plataformas backend. Encuentra las tecnologías adecuadas para tu proyecto.",
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
    title: "Technologien für Backend und Datenbanken vergleichen",
    description:
      "Entdecke detaillierte Vergleiche von Datenbanken, Frameworks und Backend-Plattformen. Finde die passende Technologie für dein Projekt.",
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
    title: "Comparez les technologies backend et les bases de données",
    description:
      "Découvrez des comparatifs détaillés de bases de données, frameworks et plateformes backend. Trouvez les technologies adaptées à votre projet.",
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
    title: copy[locale].title,
    description: BRAND_DESCRIPTION[locale],
    alternates: {
      canonical: absoluteSiteUrl(`/${locale}`),
      languages: {
        ...Object.fromEntries(
          LOCALES.map((option) => [option, absoluteSiteUrl(`/${option}`)]),
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
  const comparisons = getComparisons(locale);

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

        <ComparisonSearch comparisons={comparisons} locale={locale} text={text} />
      </section>
    </main>
  );
}
