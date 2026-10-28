import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateBanner from "../../../../components/AffiliateBanner";
import ArchitectureDiagram from "../../../../components/ArchitectureDiagram";
import CodeComparison from "../../../../components/CodeComparison";
import ComparisonActions from "../../../../components/ComparisonActions";
import {
  getComparisonCodeExamples,
  getComparisonBySlug,
  getComparisons,
  getLocalizedComparisons,
  isLocale,
  LOCALES,
  type Comparison,
  type ComparisonCriterion,
  type Locale,
} from "../../../../lib/comparisons";
import {
  categoryCopy,
  getComparisonCategories,
  type CategoryId,
} from "../../../../lib/taxonomy";
import { absoluteSiteUrl } from "../../../../lib/site-url";

interface ComparisonPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const copy = {
  pl: {
    category: "Porównanie technologii",
    details: "Macierz parametrów technicznych",
    advantage: "Przewaga",
    tie: "Podobny poziom",
    decision: "Kiedy wybrać które rozwiązanie?",
    chooseIf: "Wybierz, jeśli…",
    noClearAdvantage:
      "Dostępne kryteria nie wskazują jednoznacznego zwycięzcy. Rozważ te konkretne różnice w kontekście swojego projektu:",
    context: "Kontekst techniczny i kompromisy",
    evidenceBasedContext:
      "Poniższe różnice wynikają bezpośrednio z opisanych kryteriów porównania.",
    overallFit: "Dopasowanie do projektu (na podstawie podsumowania)",
    codeExamples: "Przykłady kodu",
    copyCode: "Kopiuj kod",
    copiedCode: "Kod skopiowany.",
    copyCodeError: "Nie udało się skopiować kodu.",
    faq: "Często zadawane pytania",
    winner: "przewaga",
    home: "Strona główna",
    comparison: "Porównania",
    breadcrumb: "Okruszki nawigacyjne",
    quickVerdict: "Szybki werdykt",
    recommendation: "Najważniejsze wnioski",
    contents: "Spis treści",
    viewDetails: "Przejdź do szczegółowego porównania",
    criterion: "Kryterium",
    chartTitle: "Ocena według kryteriów",
    performance: "Wydajność",
    usability: "Łatwość użycia",
    ecosystem: "Ekosystem",
    popularity: "Popularność",
    noEvidence: "Brak bezpośrednich danych w kryteriach",
    evidenceCount: "kryteria",
    scoreMethod: "Wynik wynika z liczby zwycięstw w pasujących kryteriach; remisy liczą się po połowie.",
    related: "Powiązane porównania",
    copySummary: "Kopiuj podsumowanie",
    copied: "Podsumowanie skopiowane.",
    copyError: "Nie udało się skopiować podsumowania.",
    shareX: "Udostępnij w X",
    shareLinkedIn: "Udostępnij na LinkedIn",
  },
  en: {
    category: "Technology comparison",
    details: "Technical feature matrix",
    advantage: "Edge",
    tie: "Comparable",
    decision: "When to choose each option",
    chooseIf: "Choose this option if…",
    noClearAdvantage:
      "The available criteria do not establish a clear winner. Consider these specific differences in the context of your project:",
    context: "Technical context and trade-offs",
    evidenceBasedContext:
      "These differences are drawn directly from the comparison criteria below.",
    overallFit: "Project fit (based on the available recommendation)",
    codeExamples: "Code examples",
    copyCode: "Copy code",
    copiedCode: "Code copied.",
    copyCodeError: "Could not copy code.",
    faq: "Frequently asked questions",
    winner: "advantage",
    home: "Home",
    comparison: "Comparisons",
    breadcrumb: "Breadcrumb",
    quickVerdict: "Quick verdict",
    recommendation: "The bottom line",
    contents: "On this page",
    viewDetails: "Explore the detailed comparison",
    criterion: "Criterion",
    chartTitle: "Scores by criterion",
    performance: "Performance",
    usability: "Ease of use",
    ecosystem: "Ecosystem",
    popularity: "Popularity",
    noEvidence: "No direct evidence in the criteria",
    evidenceCount: "criteria",
    scoreMethod: "Scores reflect wins in matching criteria; ties count as half a point.",
    related: "Related comparisons",
    copySummary: "Copy summary",
    copied: "Summary copied.",
    copyError: "Could not copy the summary.",
    shareX: "Share on X",
    shareLinkedIn: "Share on LinkedIn",
  },
  es: {
    category: "Comparativa de tecnologías",
    details: "Matriz de características técnicas",
    advantage: "Ventaja",
    tie: "Nivel similar",
    decision: "Cuándo elegir cada opción",
    chooseIf: "Elige esta opción si…",
    noClearAdvantage:
      "Los criterios disponibles no señalan un ganador claro. Valora estas diferencias concretas según las necesidades de tu proyecto:",
    context: "Contexto técnico y compromisos",
    evidenceBasedContext:
      "Estas diferencias se basan directamente en los criterios de comparación siguientes.",
    overallFit: "Adecuación al proyecto (según la recomendación disponible)",
    codeExamples: "Ejemplos de código",
    copyCode: "Copiar código",
    copiedCode: "Código copiado.",
    copyCodeError: "No se pudo copiar el código.",
    faq: "Preguntas frecuentes",
    winner: "ventaja",
    home: "Inicio",
    comparison: "Comparativas",
    breadcrumb: "Ruta de navegación",
    quickVerdict: "Veredicto rápido",
    recommendation: "Conclusión",
    contents: "En esta página",
    viewDetails: "Ver la comparativa detallada",
    criterion: "Criterio",
    chartTitle: "Puntuación por criterio",
    performance: "Rendimiento",
    usability: "Facilidad de uso",
    ecosystem: "Ecosistema",
    popularity: "Popularidad",
    noEvidence: "Sin evidencia directa en los criterios",
    evidenceCount: "criterios",
    scoreMethod: "La puntuación refleja las victorias en criterios coincidentes; los empates cuentan como medio punto.",
    related: "Comparativas relacionadas",
    copySummary: "Copiar resumen",
    copied: "Resumen copiado.",
    copyError: "No se pudo copiar el resumen.",
    shareX: "Compartir en X",
    shareLinkedIn: "Compartir en LinkedIn",
  },
  de: {
    category: "Technologievergleich",
    details: "Technische Vergleichsmatrix",
    advantage: "Vorteil",
    tie: "Vergleichbar",
    decision: "Wann welche Option wählen?",
    chooseIf: "Wähle diese Option, wenn …",
    noClearAdvantage:
      "Die verfügbaren Kriterien zeigen keinen eindeutigen Sieger. Berücksichtige diese konkreten Unterschiede im Kontext deines Projekts:",
    context: "Technischer Kontext und Zielkonflikte",
    evidenceBasedContext:
      "Diese Unterschiede ergeben sich direkt aus den folgenden Vergleichskriterien.",
    overallFit: "Projekteignung (basierend auf der verfügbaren Empfehlung)",
    codeExamples: "Codebeispiele",
    copyCode: "Code kopieren",
    copiedCode: "Code kopiert.",
    copyCodeError: "Der Code konnte nicht kopiert werden.",
    faq: "Häufig gestellte Fragen",
    winner: "Vorteil",
    home: "Startseite",
    comparison: "Vergleiche",
    breadcrumb: "Brotkrumennavigation",
    quickVerdict: "Kurzfazit",
    recommendation: "Die wichtigsten Erkenntnisse",
    contents: "Auf dieser Seite",
    viewDetails: "Zum detaillierten Vergleich",
    criterion: "Kriterium",
    chartTitle: "Bewertung nach Kriterien",
    performance: "Leistung",
    usability: "Benutzerfreundlichkeit",
    ecosystem: "Ökosystem",
    popularity: "Popularität",
    noEvidence: "Keine direkten Belege in den Kriterien",
    evidenceCount: "Kriterien",
    scoreMethod: "Die Bewertung basiert auf Siegen in passenden Kriterien; ein Gleichstand zählt als halber Punkt.",
    related: "Ähnliche Vergleiche",
    copySummary: "Zusammenfassung kopieren",
    copied: "Zusammenfassung kopiert.",
    copyError: "Die Zusammenfassung konnte nicht kopiert werden.",
    shareX: "Auf X teilen",
    shareLinkedIn: "Auf LinkedIn teilen",
  },
  fr: {
    category: "Comparatif de technologies",
    details: "Matrice des caractéristiques techniques",
    advantage: "Avantage",
    tie: "Comparable",
    decision: "Quand choisir chaque solution ?",
    chooseIf: "Choisissez cette solution si…",
    noClearAdvantage:
      "Les critères disponibles ne désignent pas de gagnant évident. Évaluez ces différences concrètes selon les besoins de votre projet :",
    context: "Contexte technique et compromis",
    evidenceBasedContext:
      "Ces différences découlent directement des critères de comparaison ci-dessous.",
    overallFit: "Adéquation au projet (selon la recommandation disponible)",
    codeExamples: "Exemples de code",
    copyCode: "Copier le code",
    copiedCode: "Code copié.",
    copyCodeError: "Impossible de copier le code.",
    faq: "Questions fréquentes",
    winner: "Avantage",
    home: "Accueil",
    comparison: "Comparatifs",
    breadcrumb: "Fil d’Ariane",
    quickVerdict: "Verdict rapide",
    recommendation: "L’essentiel",
    contents: "Sur cette page",
    viewDetails: "Voir le comparatif détaillé",
    criterion: "Critère",
    chartTitle: "Notes par critère",
    performance: "Performances",
    usability: "Facilité d’utilisation",
    ecosystem: "Écosystème",
    popularity: "Popularité",
    noEvidence: "Aucun élément direct dans les critères",
    evidenceCount: "critères",
    scoreMethod: "Le score reflète les victoires dans les critères correspondants ; une égalité vaut un demi-point.",
    related: "Comparatifs associés",
    copySummary: "Copier le résumé",
    copied: "Résumé copié.",
    copyError: "Impossible de copier le résumé.",
    shareX: "Partager sur X",
    shareLinkedIn: "Partager sur LinkedIn",
  },
} satisfies Record<
  Locale,
  {
    category: string;
    details: string;
    advantage: string;
    tie: string;
    decision: string;
    chooseIf: string;
    noClearAdvantage: string;
    context: string;
    evidenceBasedContext: string;
    overallFit: string;
    codeExamples: string;
    copyCode: string;
    copiedCode: string;
    copyCodeError: string;
    faq: string;
    winner: string;
    home: string;
    comparison: string;
    breadcrumb: string;
    quickVerdict: string;
    recommendation: string;
    contents: string;
    viewDetails: string;
    criterion: string;
    chartTitle: string;
    performance: string;
    usability: string;
    ecosystem: string;
    popularity: string;
    noEvidence: string;
    evidenceCount: string;
    scoreMethod: string;
    related: string;
    copySummary: string;
    copied: string;
    copyError: string;
    shareX: string;
    shareLinkedIn: string;
  }
>;

const chartCategories = [
  {
    label: "performance",
    pattern:
      /performance|rendimiento|wydajno|prestazioni|latency|throughput|velocidad|speed|benchmark|rendering|response time/i,
  },
  {
    label: "usability",
    pattern:
      /learning curve|developer experience|ease of use|usability|facilidad|curva de aprendizaje|experiencia de desarrollo|łatwość|krzywa uczenia|ergonom|simplicity|simplicidad/i,
  },
  {
    label: "ecosystem",
    pattern:
      /ecosystem|ekosystem|ecosistema|tooling|libraries|bibliotecas|librerías|plugin|paquet|narzędzi|integrations|integraciones/i,
  },
  {
    label: "popularity",
    pattern:
      /popularity|popularidad|popularność|community|comunidad|społecz|job market|mercado laboral|hiring|adoption|adopción|adopcja/i,
  },
] as const;

function getComparisonCriteria(
  comparison: Comparison,
  locale: Locale,
): ComparisonCriterion[] {
  if (comparison.comparison && comparison.comparison.length > 0) {
    return comparison.comparison;
  }

  const sentences =
    comparison.verdict.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()) ??
    [];
  const findToolContext = (name: string) =>
    sentences.find((sentence) =>
      sentence.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    ) ?? comparison.verdict;

  return [
    {
      category: copy[locale].overallFit,
      toolA: findToolContext(comparison.toolA.name),
      toolB: findToolContext(comparison.toolB.name),
      winner: "tie",
    },
  ];
}

function getScores(comparison: Comparison) {
  const criteria = comparison.comparison ?? [];

  return chartCategories.map(({ label, pattern }) => {
    const relevantCriteria = criteria.filter((criterion) =>
      pattern.test(criterion.category),
    );

    if (relevantCriteria.length === 0) {
      return { label, toolAScore: null, toolBScore: null, evidenceCount: 0 };
    }

    const toolAPoints = relevantCriteria.reduce(
      (total, criterion) =>
        total +
        (criterion.winner === "toolA" ? 1 : criterion.winner === "tie" ? 0.5 : 0),
      0,
    );
    const toolAScore = Math.round((toolAPoints / relevantCriteria.length) * 100);

    return {
      label,
      toolAScore,
      toolBScore: 100 - toolAScore,
      evidenceCount: relevantCriteria.length,
    };
  });
}

function getDecisionCriteria(
  comparison: Comparison,
  tool: "toolA" | "toolB",
  locale: Locale,
): ComparisonCriterion[] {
  const criteria = getComparisonCriteria(comparison, locale);
  const wins = criteria.filter((criterion) => criterion.winner === tool);
  return (wins.length > 0 ? wins : criteria).slice(0, 3);
}

function getDecisionCopy(
  comparison: Comparison,
  tool: "toolA" | "toolB",
  locale: Locale,
): string | undefined {
  const savedRecommendation = comparison.decisionFramework?.[tool];
  if (savedRecommendation) {
    return savedRecommendation;
  }

  const criteria = getDecisionCriteria(comparison, tool, locale);
  if (criteria.length === 0) {
    return undefined;
  }

  const evidence = criteria
    .map((criterion) => {
      const description = criterion[tool];
      return `${criterion.category}: ${description}`;
    })
    .join(" ");

  const hasWins = criteria.some((criterion) => criterion.winner === tool);
  const name = tool === "toolA" ? comparison.toolA.name : comparison.toolB.name;
  const prefix = hasWins
    ? {
        pl: `Wybierz ${name}, jeśli opisane przewagi odpowiadają wymaganiom projektu.`,
        en: `Choose ${name} when the strengths described here match your project requirements.`,
        es: `Elige ${name} cuando las ventajas descritas coincidan con los requisitos de tu proyecto.`,
        de: `Wähle ${name}, wenn die beschriebenen Stärken zu den Anforderungen deines Projekts passen.`,
        fr: `Choisissez ${name} si les atouts décrits correspondent aux exigences de votre projet.`,
      }[locale]
    : copy[locale].noClearAdvantage;

  return `${prefix} ${evidence}`;
}

function getRelatedComparisons(comparison: Comparison, locale: Locale) {
  const tools = comparison.slug.split("-vs-");
  const categories = getComparisonCategories(comparison.slug);

  return getLocalizedComparisons(locale)
    .filter((candidate) => candidate.slug !== comparison.slug)
    .map((candidate) => ({
      comparison: candidate,
      sharedCategories: getComparisonCategories(candidate.slug).filter(
        (category) => categories.includes(category),
      ).length,
      sharedTools: candidate.slug
        .split("-vs-")
        .filter((tool) => tools.includes(tool)).length,
    }))
    .filter(({ sharedCategories }) => sharedCategories > 0)
    .sort(
      (left, right) =>
        right.sharedCategories - left.sharedCategories ||
        right.sharedTools - left.sharedTools ||
        left.comparison.slug.localeCompare(right.comparison.slug),
    )
    .slice(0, 8)
    .map(({ comparison: related }) => related);
}

const openGraphLocales = {
  pl: "pl_PL",
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  fr: "fr_FR",
} as const;

const titleFocus = {
  pl: {
    frontend: "funkcje, wydajność i ekosystem",
    backend: "API, wydajność i wdrożenie",
    databases: "modele danych, wydajność i zastosowania",
    "ai-models": "modele, kontekst i koszty API",
    devops: "wdrożenie, skalowanie i koszty",
    css: "stylowanie, komponenty i workflow",
    general: "funkcje i zastosowania",
  },
  en: {
    frontend: "features, performance & ecosystem",
    backend: "APIs, performance & deployment",
    databases: "data models, performance & use cases",
    "ai-models": "models, context & API pricing",
    devops: "deployment, scaling & costs",
    css: "styling, components & developer workflow",
    general: "features and use cases",
  },
  es: {
    frontend: "funciones, rendimiento y ecosistema",
    backend: "API, rendimiento e implementación",
    databases: "modelos de datos, rendimiento y usos",
    "ai-models": "modelos, contexto y costes de API",
    devops: "despliegue, escalabilidad y costes",
    css: "estilos, componentes y flujo de desarrollo",
    general: "funciones y casos de uso",
  },
  de: {
    frontend: "Funktionen, Leistung und Ökosystem",
    backend: "APIs, Leistung und Bereitstellung",
    databases: "Datenmodelle, Leistung und Anwendungsfälle",
    "ai-models": "Modelle, Kontext und API-Kosten",
    devops: "Bereitstellung, Skalierung und Kosten",
    css: "Styling, Komponenten und Entwickler-Workflow",
    general: "Funktionen und Anwendungsfälle",
  },
  fr: {
    frontend: "fonctionnalités, performances et écosystème",
    backend: "API, performances et déploiement",
    databases: "modèles de données, performances et usages",
    "ai-models": "modèles, contexte et tarifs API",
    devops: "déploiement, évolutivité et coûts",
    css: "styles, composants et flux de développement",
    general: "fonctionnalités et cas d’usage",
  },
} as const;

function getComparisonUrl(locale: Locale, slug: string): string {
  return `/${locale}/compare/${slug}`;
}

function getComparisonTitle(comparison: Comparison, locale: Locale): string {
  const category = getComparisonCategories(comparison.slug)[0] ?? "general";
  return `${comparison.toolA.name} vs ${comparison.toolB.name}: ${titleFocus[locale][category]}`;
}

function getLocalizedSlug(locale: Locale, slug: string): string | undefined {
  const direct = getComparisonBySlug(slug, locale);
  if (direct) {
    return direct.slug;
  }

  const [toolA, toolB] = slug.split("-vs-");
  if (!toolA || !toolB) {
    return undefined;
  }

  return getComparisonBySlug(`${toolB}-vs-${toolA}`, locale)?.slug;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getComparisons(locale).map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    return {};
  }

  const comparison = getComparisonBySlug(slug, localeParam);
  if (!comparison) {
    return {};
  }

  const title = getComparisonTitle(comparison, localeParam);
  const canonical = absoluteSiteUrl(getComparisonUrl(localeParam, slug));
  const languages = Object.fromEntries(
    LOCALES.flatMap((locale) => {
      const translatedSlug = getLocalizedSlug(locale, slug);
      return translatedSlug
        ? [[locale, absoluteSiteUrl(getComparisonUrl(locale, translatedSlug))]]
        : [];
    }),
  );
  const defaultSlug = getLocalizedSlug("en", slug);

  return {
    title,
    description: comparison.meta.description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": absoluteSiteUrl(
          defaultSlug ? getComparisonUrl("en", defaultSlug) : "/en",
        ),
      },
    },
    openGraph: {
      title,
      description: comparison.meta.description,
      url: canonical,
      type: "article",
      locale: openGraphLocales[localeParam],
    },
  };
}

function getStructuredData(
  comparison: Comparison,
  locale: Locale,
  category?: { id: CategoryId; name: string },
) {
  const pageUrl = absoluteSiteUrl(getComparisonUrl(locale, comparison.slug));
  const text = copy[locale];
  const title = getComparisonTitle(comparison, locale);
  const categories = getComparisonCategories(comparison.slug);
  const keywords = [
    comparison.toolA.name,
    comparison.toolB.name,
    ...categories,
    ...(comparison.comparison ?? []).map(({ category }) => category),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        description: comparison.meta.description,
        abstract: comparison.introduction ?? comparison.verdict,
        inLanguage: locale,
        mainEntityOfPage: pageUrl,
        about: [comparison.toolA.name, comparison.toolB.name],
        articleSection: categories,
        keywords,
        isPartOf: {
          "@type": "WebSite",
          name: "SnippetsLibrary",
          url: absoluteSiteUrl(`/${locale}`),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: text.home,
            item: absoluteSiteUrl(`/${locale}`),
          },
          ...(category
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: category.name,
                  item: absoluteSiteUrl(
                    `/${locale}/category/${category.id}`,
                  ),
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: category ? 3 : 2,
            name: `${comparison.toolA.name} vs ${comparison.toolB.name}`,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: comparison.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a,
          },
        })),
      },
    ],
  };
}

export default async function LocalizedComparisonPage({ params }: ComparisonPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const comparison = getComparisonBySlug(slug, locale);
  if (!comparison) {
    notFound();
  }

  const text = copy[locale];
  const relatedComparisons = getRelatedComparisons(comparison, locale);
  const title = getComparisonTitle(comparison, locale);
  const comparisonCriteria = getComparisonCriteria(comparison, locale);
  const codeExamples = getComparisonCodeExamples(comparison);
  const primaryCategory = getComparisonCategories(slug)[0];
  const category = primaryCategory
    ? {
        id: primaryCategory,
        name: categoryCopy[locale][primaryCategory].name,
      }
    : undefined;
  const contextCriteria = comparisonCriteria.slice(0, 2);
  const scores = getScores(comparison);
  const structuredData = JSON.stringify(
    getStructuredData(comparison, locale, category),
  ).replace(/</g, "\\u003c");

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <nav aria-label={text.breadcrumb} className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <li>
            <Link
              href={`/${locale}`}
              className="underline-offset-4 hover:text-indigo-700 hover:underline dark:hover:text-indigo-300"
            >
              {text.home}
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/${locale}/category/${category.id}`}
                  className="underline-offset-4 hover:text-indigo-700 hover:underline dark:hover:text-indigo-300"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-900 dark:text-white">
            {comparison.toolA.name} vs {comparison.toolB.name}
          </li>
        </ol>
      </nav>
      <article>
        <header className="mb-8 max-w-4xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
            {text.category}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {comparison.verdict}
          </p>
        </header>

        <section
          aria-labelledby="technical-context"
          className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <h2
            id="technical-context"
            className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            {text.context}
          </h2>
          {comparison.introduction ? (
            <p className="mt-4 max-w-5xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {comparison.introduction}
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {text.evidenceBasedContext}
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {contextCriteria.map((criterion) => (
                  <article
                    key={criterion.category}
                    className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {criterion.category}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      <strong>{comparison.toolA.name}:</strong> {criterion.toolA}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      <strong>{comparison.toolB.name}:</strong> {criterion.toolB}
                    </p>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="mb-10 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
          <section
            aria-labelledby="quick-verdict"
            className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm sm:p-8 dark:border-indigo-900 dark:from-indigo-950/60 dark:via-slate-900 dark:to-violet-950/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {text.quickVerdict}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {text.recommendation}
              </span>
            </div>
            <h2 id="quick-verdict" className="sr-only">
              {text.quickVerdict}
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-800 dark:text-slate-100">
              {comparison.verdict}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {[comparison.toolA.name, comparison.toolB.name].map((name) => (
                <span
                  key={name}
                  className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  {name}
                </span>
              ))}
              <a
                href="#comparison-details"
                className="ml-auto inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {text.viewDetails}
                <span aria-hidden="true" className="ml-2">
                  ↓
                </span>
              </a>
            </div>
            <ComparisonActions
              title={title}
              summary={comparison.verdict}
              labels={{
                copy: text.copySummary,
                copied: text.copied,
                copyError: text.copyError,
                shareX: text.shareX,
                shareLinkedIn: text.shareLinkedIn,
              }}
            />
          </section>

          <section
            aria-labelledby="score-chart"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            <h2
              id="score-chart"
              className="mb-6 text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              {text.chartTitle}
            </h2>
            <div className="space-y-5">
              {scores.map(({ label, toolAScore, toolBScore, evidenceCount }) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {text[label]}
                    </span>
                    {toolAScore === null || toolBScore === null ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {text.noEvidence}
                      </span>
                    ) : (
                      <span className="font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                        {toolAScore}–{toolBScore}{" "}
                        <span className="text-xs font-normal">
                          ({evidenceCount} {text.evidenceCount})
                        </span>
                      </span>
                    )}
                  </div>
                  <div
                    aria-label={
                      toolAScore === null || toolBScore === null
                        ? text.noEvidence
                        : `${comparison.toolA.name} ${toolAScore}%, ${comparison.toolB.name} ${toolBScore}%`
                    }
                    className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                    role="img"
                  >
                    {toolAScore !== null && toolBScore !== null && (
                      <>
                        <span
                          className="h-full bg-indigo-600 transition-[width]"
                          style={{ width: `${toolAScore}%` }}
                        />
                        <span
                          className="h-full bg-violet-400 transition-[width] dark:bg-violet-500"
                          style={{ width: `${toolBScore}%` }}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
              {[comparison.toolA, comparison.toolB].map((tool, index) => (
                <span key={tool.name} className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-2.5 rounded-full ${
                      index === 0 ? "bg-indigo-600" : "bg-violet-400 dark:bg-violet-500"
                    }`}
                  />
                  {tool.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {text.scoreMethod}
            </p>
          </section>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24">
            <nav
              aria-label={text.contents}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
                {text.contents}
              </h2>
              <ol className="space-y-2.5">
                <li>
                  <a
                    href="#technical-context"
                    className="text-sm leading-5 text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {text.context}
                  </a>
                </li>
                <li>
                  <a
                    href="#decision-framework"
                    className="text-sm leading-5 text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {text.decision}
                  </a>
                </li>
                <li>
                  <a
                    href="#comparison-details"
                    className="text-sm leading-5 text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {text.details}
                  </a>
                </li>
                {comparisonCriteria.map((criterion, index) => (
                  <li key={criterion.category}>
                    <a
                      href={`#criterion-${index + 1}`}
                      className="text-sm leading-5 text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
                    >
                      {criterion.category}
                    </a>
                  </li>
                ))}
                {codeExamples && (
                  <li>
                    <a
                      href="#code-examples"
                      className="text-sm leading-5 text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
                    >
                      {text.codeExamples}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href="#faq"
                    className="text-sm font-medium leading-5 text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
                  >
                    {text.faq}
                  </a>
                </li>
              </ol>
            </nav>
          </aside>

          <div className="min-w-0">
            {comparisonCriteria.length > 0 && (
              <section aria-labelledby="comparison-details" className="mb-12 scroll-mt-24">
                <h2
                  id="comparison-details"
                  className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
                >
                  {text.details}
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-900">
                      <tr>
                        <th scope="col" className="p-4 font-semibold">
                          {text.criterion}
                        </th>
                        <th scope="col" className="p-4 font-semibold">
                          {comparison.toolA.name}
                        </th>
                        <th scope="col" className="p-4 font-semibold">
                          {comparison.toolB.name}
                        </th>
                        <th scope="col" className="p-4 font-semibold">
                          {text.advantage}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonCriteria.map((criterion, index) => (
                        <tr
                          key={criterion.category}
                          id={`criterion-${index + 1}`}
                          className="scroll-mt-24 border-t border-slate-200 align-top dark:border-slate-800"
                        >
                          <th scope="row" className="p-4 font-medium">
                            {criterion.category}
                          </th>
                          <td className="p-4 leading-6 text-slate-600 dark:text-slate-300">
                            {criterion.toolA}
                          </td>
                          <td className="p-4 leading-6 text-slate-600 dark:text-slate-300">
                            {criterion.toolB}
                          </td>
                          <td className="p-4 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            {criterion.winner === "tie"
                              ? text.tie
                              : criterion.winner === "toolA"
                                ? comparison.toolA.name
                                : comparison.toolB.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <section
              id="decision-framework"
              aria-labelledby="decision-framework-heading"
              className="mb-12 scroll-mt-24"
            >
              <h2
                id="decision-framework-heading"
                className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
              >
                {text.decision}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {([
                  ["toolA", comparison.toolA],
                  ["toolB", comparison.toolB],
                ] as const).map(([tool, technology]) => {
                  const recommendation = getDecisionCopy(comparison, tool, locale);

                  return (
                    <article
                      key={technology.name}
                      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {text.chooseIf} {technology.name}
                      </h3>
                      {recommendation && (
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {recommendation}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <ArchitectureDiagram
              toolA={comparison.toolA.name}
              toolB={comparison.toolB.name}
              locale={locale}
            />

            {codeExamples && (
              <CodeComparison
                toolA={comparison.toolA.name}
                toolB={comparison.toolB.name}
                tech1Snippet={codeExamples.tech1Snippet}
                tech2Snippet={codeExamples.tech2Snippet}
                labels={{
                  title: text.codeExamples,
                  copy: text.copyCode,
                  copied: text.copiedCode,
                  copyError: text.copyCodeError,
                }}
              />
            )}

            <AffiliateBanner
              locale={locale}
              toolA={comparison.toolA.name}
              toolB={comparison.toolB.name}
            />

            <section aria-labelledby="faq" className="scroll-mt-24">
              <h2
                id="faq"
                className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
              >
                {text.faq}
              </h2>
              <div className="space-y-3">
                {comparison.faq.map(({ q, a }) => (
                  <details
                    key={q}
                    className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <summary className="cursor-pointer font-semibold">{q}</summary>
                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>

        {relatedComparisons.length > 0 && (
          <section
            aria-labelledby="related-comparisons"
            className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800"
          >
            <h2
              id="related-comparisons"
              className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              {text.related}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedComparisons.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={getComparisonUrl(locale, related.slug)}
                    className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
                  >
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                      {related.toolA.name} vs {related.toolB.name}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {related.meta.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
