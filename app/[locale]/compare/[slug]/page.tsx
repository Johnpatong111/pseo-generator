import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateBanner from "../../../../components/AffiliateBanner";
import ArchitectureDiagram from "../../../../components/ArchitectureDiagram";
import CodeComparison from "../../../../components/CodeComparison";
import ComparisonMatcher from "../../../../components/ComparisonMatcher";
import ComparisonViewToggle from "../../../../components/ComparisonViewToggle";
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
  type ComparisonFaq,
  type Locale,
} from "../../../../lib/comparisons";
import { BRAND_NAME } from "../../../../lib/locales";
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
    viewNavigation: "Tryb porównania",
    quickView: "Szybkie podsumowanie",
    deepView: "Głęboka analiza",
    matcherTitle: "Kalkulator dopasowania do projektu",
    matcherDescription: "Ustaw wagi priorytetów. Wynik opiera się na kryteriach porównania dostępnych na tej stronie.",
    matcherPerformance: "Wydajność",
    matcherCost: "Koszt / cena API",
    matcherDeployment: "Łatwość wdrożenia",
    matcherFit: "dopasowanie",
    matcherRecommended: "Na podstawie wybranych wag rekomendujemy:",
    matcherBalanced: "Oba rozwiązania uzyskały taki sam wynik dla wybranych priorytetów.",
    matcherNoEvidence: "Brak bezpośrednich danych dla tego priorytetu.",
    matcherNoPriorities: "Ustaw co najmniej jeden priorytet z dostępnymi danymi, aby zobaczyć rekomendację.",
    matcherPercent: "%",
    relatedStacks: "Sprawdź powiązane stacki",
    relatedStacksDescription: "Poznaj alternatywne zestawienia narzędzi współdzielących jeden element z tym porównaniem.",
    relatedThrough: "Powiązane przez",
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
    viewNavigation: "Comparison view",
    quickView: "Quick summary",
    deepView: "Deep analysis",
    matcherTitle: "Project fit calculator",
    matcherDescription: "Set your priority weights. Scores are based on the comparison evidence available on this page.",
    matcherPerformance: "Performance",
    matcherCost: "Cost / API pricing",
    matcherDeployment: "Ease of deployment",
    matcherFit: "fit",
    matcherRecommended: "Based on your selected weights, we recommend:",
    matcherBalanced: "Both options scored equally for your selected priorities.",
    matcherNoEvidence: "No direct evidence is available for this priority.",
    matcherNoPriorities: "Set at least one priority with available evidence to see a recommendation.",
    matcherPercent: "%",
    relatedStacks: "Explore related stacks",
    relatedStacksDescription: "Discover alternative tool pairings that share one technology with this comparison.",
    relatedThrough: "Related through",
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
    viewNavigation: "Vista de la comparativa",
    quickView: "Resumen rápido",
    deepView: "Análisis en profundidad",
    matcherTitle: "Calculadora de adecuación al proyecto",
    matcherDescription: "Ajusta el peso de tus prioridades. La puntuación se basa en los criterios disponibles en esta página.",
    matcherPerformance: "Rendimiento",
    matcherCost: "Coste / precio de API",
    matcherDeployment: "Facilidad de implementación",
    matcherFit: "adecuación",
    matcherRecommended: "Según las prioridades seleccionadas, recomendamos:",
    matcherBalanced: "Ambas opciones obtuvieron la misma puntuación para tus prioridades.",
    matcherNoEvidence: "No hay datos directos para esta prioridad.",
    matcherNoPriorities: "Selecciona al menos una prioridad con datos disponibles para ver una recomendación.",
    matcherPercent: "%",
    relatedStacks: "Explora stacks relacionados",
    relatedStacksDescription: "Descubre combinaciones alternativas que comparten una tecnología con esta comparativa.",
    relatedThrough: "Relacionado por",
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
    viewNavigation: "Vergleichsansicht",
    quickView: "Kurzüberblick",
    deepView: "Detaillierte Analyse",
    matcherTitle: "Projekt-Fit-Rechner",
    matcherDescription: "Lege die Gewichtung deiner Prioritäten fest. Die Bewertung basiert auf den Vergleichskriterien dieser Seite.",
    matcherPerformance: "Leistung",
    matcherCost: "Kosten / API-Preis",
    matcherDeployment: "Einfache Bereitstellung",
    matcherFit: "Eignung",
    matcherRecommended: "Basierend auf deinen Gewichtungen empfehlen wir:",
    matcherBalanced: "Beide Optionen erzielen für deine Prioritäten das gleiche Ergebnis.",
    matcherNoEvidence: "Für diese Priorität liegen keine direkten Vergleichsdaten vor.",
    matcherNoPriorities: "Wähle mindestens eine Priorität mit vorhandenen Daten, um eine Empfehlung zu erhalten.",
    matcherPercent: "%",
    relatedStacks: "Ähnliche Technologie-Stacks entdecken",
    relatedStacksDescription: "Entdecke alternative Tool-Kombinationen, die eine Technologie mit diesem Vergleich teilen.",
    relatedThrough: "Verknüpft über",
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
    viewNavigation: "Mode de comparaison",
    quickView: "Résumé rapide",
    deepView: "Analyse approfondie",
    matcherTitle: "Calculateur d’adéquation au projet",
    matcherDescription: "Ajustez le poids de vos priorités. Le score s’appuie sur les critères de comparaison disponibles sur cette page.",
    matcherPerformance: "Performance",
    matcherCost: "Coût / tarif API",
    matcherDeployment: "Facilité de déploiement",
    matcherFit: "adéquation",
    matcherRecommended: "Selon vos priorités, nous recommandons :",
    matcherBalanced: "Les deux solutions obtiennent le même score selon vos priorités.",
    matcherNoEvidence: "Aucune donnée directe n’est disponible pour cette priorité.",
    matcherNoPriorities: "Choisissez au moins une priorité avec des données disponibles pour obtenir une recommandation.",
    matcherPercent: "%",
    relatedStacks: "Découvrir des stacks associés",
    relatedStacksDescription: "Explorez des associations alternatives qui partagent une technologie avec ce comparatif.",
    relatedThrough: "Associé via",
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
    viewNavigation: string;
    quickView: string;
    deepView: string;
    matcherTitle: string;
    matcherDescription: string;
    matcherPerformance: string;
    matcherCost: string;
    matcherDeployment: string;
    matcherFit: string;
    matcherRecommended: string;
    matcherBalanced: string;
    matcherNoEvidence: string;
    matcherNoPriorities: string;
    matcherPercent: string;
    relatedStacks: string;
    relatedStacksDescription: string;
    relatedThrough: string;
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
  const reversedSlug = `${tools[1]}-vs-${tools[0]}`;
  const categories = getComparisonCategories(comparison.slug);

  return getLocalizedComparisons(locale)
    .filter(
      (candidate) =>
        candidate.slug !== comparison.slug && candidate.slug !== reversedSlug,
    )
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

function getRelatedStackComparisons(comparison: Comparison, locale: Locale) {
  const tools = comparison.slug.split("-vs-");
  const reversedSlug = `${tools[1]}-vs-${tools[0]}`;
  const comparisons = getLocalizedComparisons(locale);
  const toolFrequency = new Map<string, number>();

  for (const candidate of comparisons) {
    for (const tool of candidate.slug.split("-vs-")) {
      toolFrequency.set(tool, (toolFrequency.get(tool) ?? 0) + 1);
    }
  }

  return comparisons
    .filter(
      (candidate) =>
        candidate.slug !== comparison.slug && candidate.slug !== reversedSlug,
    )
    .map((candidate) => {
      const [candidateA, candidateB] = candidate.slug.split("-vs-");
      const sharedTool = [candidateA, candidateB].find((tool) =>
        tools.includes(tool),
      );
      const complementaryTool =
        sharedTool === candidateA ? candidateB : candidateA;
      const sharedToolName =
        sharedTool === candidateA ? candidate.toolA.name : candidate.toolB.name;

      return {
        comparison: candidate,
        sharedTool,
        complementaryTool,
        sharedToolName,
      };
    })
    .filter(
      (
        candidate,
      ): candidate is typeof candidate & {
        sharedTool: string;
        complementaryTool: string;
        sharedToolName: string;
      } =>
        Boolean(
          candidate.sharedTool &&
            candidate.complementaryTool &&
            candidate.sharedToolName,
        ),
    )
    .sort(
      (left, right) =>
        (toolFrequency.get(right.complementaryTool) ?? 0) -
          (toolFrequency.get(left.complementaryTool) ?? 0) ||
        left.comparison.slug.localeCompare(right.comparison.slug),
    )
    .slice(0, 4)
    .map(({ comparison: related, sharedToolName }) => ({
      comparison: related,
      sharedToolName,
    }));
}

const faqTopics = {
  migration:
    /migration|migrate|migrat|migración|migrar|umstieg|migrier|migrer|umstellen|wechseln zu|wechsel von/i,
  costs:
    /cost|costs|pricing|price|precio|coste|costo|kosten|preis|coût|tarif|koszt/i,
  performance:
    /performance|rendimiento|desempeño|wydajno|opóźn|latenc|throughput|speed|leistung|latence|débit/i,
} as const;

type FaqTopic = keyof typeof faqTopics;

function getTopicFallbackFaq(
  topic: FaqTopic,
  comparison: Comparison,
  locale: Locale,
): ComparisonFaq {
  const toolA = comparison.toolA.name;
  const toolB = comparison.toolB.name;
  const criteria = comparison.comparison ?? [];
  const criterionPattern =
    topic === "costs"
      ? /cost|pricing|price|precio|coste|costo|kosten|preis|coût|tarif|koszt/i
      : /performance|rendimiento|desempeño|wydajno|opóźn|latenc|throughput|speed|leistung|latence|débit/i;
  const criterion = criteria.find(({ category }) =>
    criterionPattern.test(category),
  );
  const evidence = criterion
    ? `${toolA}: ${criterion.toolA} ${toolB}: ${criterion.toolB}`
    : undefined;

  const fallbackCopy: Record<
    Locale,
    Record<FaqTopic, { q: string; a: string }>
  > = {
    pl: {
      migration: {
        q: `Jak zaplanować migrację z ${toolA} do ${toolB}?`,
        a: `Najpierw zinwentaryzuj używane funkcje, formaty danych i integracje ${toolA}, a następnie sprawdź ich odpowiedniki w ${toolB}. Przygotuj migrację pilotażową, testy zgodności i wydajności oraz plan wycofania zmian; przed przełączeniem produkcji wykonaj kopię zapasową i zweryfikuj wyniki na rzeczywistym obciążeniu.`,
      },
      costs: {
        q: `Jak porównać całkowity koszt ${toolA} i ${toolB}?`,
        a: evidence
          ? `Dostępne kryterium kosztowe wskazuje: ${evidence} To punkt wyjścia, nie stała wycena — sprawdź aktualny cennik, licencje, hosting, transfer danych, wsparcie i koszty utrzymania dla przewidywanego obciążenia.`
          : `W danych tego porównania nie ma bezpośredniej wyceny ${toolA} i ${toolB}. Porównaj aktualne licencje lub ceny API, hosting, transfer danych, wsparcie i utrzymanie, przeliczając je dla tego samego przewidywanego obciążenia.`,
      },
      performance: {
        q: `Jak rzetelnie porównać wydajność ${toolA} i ${toolB}?`,
        a: evidence
          ? `W dostępnych kryteriach: ${evidence} Wynik w produkcji zależy jednak od konfiguracji i obciążenia; przed decyzją uruchom ten sam test z reprezentatywnymi danymi i zmierz opóźnienia oraz przepustowość.`
          : `Ta strona nie zawiera bezpośredniego pomiaru wydajności ${toolA} i ${toolB}. Porównaj je na tym samym, reprezentatywnym obciążeniu i danych, mierząc opóźnienia, przepustowość oraz zużycie zasobów.`,
      },
    },
    en: {
      migration: {
        q: `How should I plan a migration from ${toolA} to ${toolB}?`,
        a: `Inventory the ${toolA} features, data formats, and integrations you rely on, then verify their equivalents in ${toolB}. Run a pilot with compatibility and performance tests, keep a rollback plan, and take a verified backup before switching production traffic.`,
      },
      costs: {
        q: `How should I compare the total cost of ${toolA} and ${toolB}?`,
        a: evidence
          ? `The available cost criterion says: ${evidence} Treat this as a comparison point, not a fixed quote; verify current pricing, licensing, hosting, data transfer, support, and maintenance for your expected workload.`
          : `This comparison does not include a direct price quote for ${toolA} or ${toolB}. Compare current licensing or API rates, hosting, data transfer, support, and maintenance against the same expected workload.`,
      },
      performance: {
        q: `How can I fairly benchmark ${toolA} against ${toolB}?`,
        a: evidence
          ? `The available criteria report: ${evidence} Production results still depend on configuration and workload, so test both with representative data and measure latency and throughput before deciding.`
          : `This page does not provide direct performance measurements for ${toolA} and ${toolB}. Benchmark both with the same representative data and workload, measuring latency, throughput, and resource use.`,
      },
    },
    es: {
      migration: {
        q: `¿Cómo planificar una migración de ${toolA} a ${toolB}?`,
        a: `Haz un inventario de las funciones, formatos de datos e integraciones de ${toolA} y confirma sus equivalentes en ${toolB}. Prueba primero una migración piloto, valida compatibilidad y rendimiento, prepara una vuelta atrás y verifica una copia de seguridad antes de cambiar producción.`,
      },
      costs: {
        q: `¿Cómo comparar el coste total de ${toolA} y ${toolB}?`,
        a: evidence
          ? `El criterio de costes disponible indica: ${evidence} Es una referencia, no un presupuesto fijo: comprueba precios y licencias actuales, alojamiento, transferencia de datos, soporte y mantenimiento según la carga prevista.`
          : `Esta comparativa no incluye un precio directo de ${toolA} ni ${toolB}. Compara licencias o tarifas de API actuales, alojamiento, transferencia de datos, soporte y mantenimiento para la misma carga prevista.`,
      },
      performance: {
        q: `¿Cómo comparar de forma justa el rendimiento de ${toolA} y ${toolB}?`,
        a: evidence
          ? `Los criterios disponibles indican: ${evidence} El resultado real depende de la configuración y la carga; prueba ambos con datos representativos y mide latencia y capacidad antes de decidir.`
          : `Esta página no incluye mediciones directas del rendimiento de ${toolA} y ${toolB}. Evalúalos con la misma carga y datos representativos, midiendo latencia, capacidad y consumo de recursos.`,
      },
    },
    de: {
      migration: {
        q: `Wie plane ich eine Migration von ${toolA} zu ${toolB}?`,
        a: `Erfasse zunächst die genutzten Funktionen, Datenformate und Integrationen von ${toolA} und prüfe die entsprechenden Möglichkeiten in ${toolB}. Teste eine Pilotmigration auf Kompatibilität und Leistung, plane einen Rollback und erstelle vor der Produktionsumstellung ein geprüftes Backup.`,
      },
      costs: {
        q: `Wie vergleiche ich die Gesamtkosten von ${toolA} und ${toolB}?`,
        a: evidence
          ? `Das verfügbare Kostenkriterium besagt: ${evidence} Das ist ein Vergleichspunkt, kein Festpreis. Prüfe aktuelle Preise, Lizenzen, Hosting, Datentransfer, Support und Wartung für deine erwartete Auslastung.`
          : `Dieser Vergleich enthält keine direkten Preisangaben für ${toolA} oder ${toolB}. Vergleiche aktuelle Lizenz- oder API-Kosten, Hosting, Datentransfer, Support und Wartung anhand derselben erwarteten Auslastung.`,
      },
      performance: {
        q: `Wie vergleiche ich die Leistung von ${toolA} und ${toolB} fair?`,
        a: evidence
          ? `Die verfügbaren Kriterien nennen: ${evidence} Die Ergebnisse im Betrieb hängen dennoch von Konfiguration und Last ab. Teste beide mit repräsentativen Daten und miss Latenz und Durchsatz.`
          : `Diese Seite enthält keine direkten Leistungsmessungen für ${toolA} und ${toolB}. Vergleiche beide mit denselben repräsentativen Daten und derselben Last und miss Latenz, Durchsatz und Ressourcenverbrauch.`,
      },
    },
    fr: {
      migration: {
        q: `Comment planifier une migration de ${toolA} vers ${toolB} ?`,
        a: `Recensez les fonctionnalités, formats de données et intégrations utilisés avec ${toolA}, puis vérifiez leurs équivalents dans ${toolB}. Effectuez un pilote, testez la compatibilité et les performances, prévoyez un retour arrière et validez une sauvegarde avant le basculement en production.`,
      },
      costs: {
        q: `Comment comparer le coût total de ${toolA} et ${toolB} ?`,
        a: evidence
          ? `Le critère de coût disponible indique : ${evidence} Il s’agit d’un repère, pas d’un devis fixe : vérifiez les tarifs et licences actuels, l’hébergement, le transfert de données, le support et la maintenance selon la charge prévue.`
          : `Ce comparatif ne fournit pas de tarif direct pour ${toolA} ou ${toolB}. Comparez les licences ou tarifs API actuels, l’hébergement, le transfert de données, le support et la maintenance pour une même charge prévisionnelle.`,
      },
      performance: {
        q: `Comment comparer équitablement les performances de ${toolA} et ${toolB} ?`,
        a: evidence
          ? `Les critères disponibles indiquent : ${evidence} Les résultats réels dépendent toutefois de la configuration et de la charge. Testez les deux avec des données représentatives et mesurez latence et débit.`
          : `Cette page ne contient pas de mesures directes des performances de ${toolA} et ${toolB}. Testez-les avec les mêmes données et la même charge représentatives, en mesurant latence, débit et ressources utilisées.`,
      },
    },
  };

  return fallbackCopy[locale][topic];
}

function getFocusedFaq(
  comparison: Comparison,
  locale: Locale,
): ComparisonFaq[] {
  const { faq } = comparison;
  const selected = new Set<number>();
  const focused = (Object.keys(faqTopics) as FaqTopic[]).map((topic) => {
    const bestMatch = faq
      .map((item, index) => ({
        item,
        index,
        score: !selected.has(index) && faqTopics[topic].test(item.q)
          ? 3 + (faqTopics[topic].test(item.a) ? 1 : 0)
          : 0,
      }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score || left.index - right.index)[0];

    if (bestMatch) {
      selected.add(bestMatch.index);
      return bestMatch.item;
    }

    return getTopicFallbackFaq(topic, comparison, locale);
  });

  const remaining = faq.findIndex((_, index) => !selected.has(index));
  if (remaining !== -1) {
    focused.push(faq[remaining]);
  }

  return focused;
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
  const comparisonName = `${comparison.toolA.name} vs ${comparison.toolB.name}`;
  const topicSuffix = `: ${titleFocus[locale][category]}`;
  const titleLimit = 60 - ` | ${BRAND_NAME}`.length;

  return comparisonName.length + topicSuffix.length <= titleLimit
    ? `${comparisonName}${topicSuffix}`
    : comparisonName;
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
  const seoTitle = `${title} | ${BRAND_NAME}`;
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
    title: { absolute: seoTitle },
    description: comparison.meta.description,
    authors: [
      {
        name: "SnippetsLibrary Team",
        url: absoluteSiteUrl("/"),
      },
    ],
    publisher: "SnippetsLibrary Team",
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
      title: seoTitle,
      description: comparison.meta.description,
      url: canonical,
      siteName: BRAND_NAME,
      type: "article",
      locale: openGraphLocales[localeParam],
    },
    twitter: {
      card: "summary",
      title: seoTitle,
      description: comparison.meta.description,
    },
  };
}

function getStructuredData(
  comparison: Comparison,
  locale: Locale,
  category: { id: CategoryId; name: string } | undefined,
  faq: ComparisonFaq[],
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
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        inLanguage: locale,
        mainEntity: faq.map(({ q, a }) => ({
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
  const relatedStacks = getRelatedStackComparisons(comparison, locale);
  const title = getComparisonTitle(comparison, locale);
  const focusedFaq = getFocusedFaq(comparison, locale);
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
    getStructuredData(comparison, locale, category, focusedFaq),
  ).replace(/</g, "\\u003c");
  const matcherLabels = {
    title: text.matcherTitle,
    description: text.matcherDescription,
    performance: text.matcherPerformance,
    cost: text.matcherCost,
    deployment: text.matcherDeployment,
    fit: text.matcherFit,
    recommended: text.matcherRecommended,
    balanced: text.matcherBalanced,
    noEvidence: text.matcherNoEvidence,
    noPriorities: text.matcherNoPriorities,
    percent: text.matcherPercent,
  };
  const renderMatcher = () => (
    <ComparisonMatcher
      toolA={comparison.toolA.name}
      toolB={comparison.toolB.name}
      criteria={comparisonCriteria}
      labels={matcherLabels}
    />
  );
  const decisionCards = () =>
    ([
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
    });
  const quickContent = (
    <div className="space-y-8">
      <section
        aria-labelledby="quick-summary-heading"
        className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-8"
      >
        <h2
          id="quick-summary-heading"
          className="text-xl font-semibold text-slate-900 dark:text-white"
        >
          {text.quickVerdict}
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200">
          {comparison.verdict}
        </p>
      </section>

      <section aria-labelledby="quick-key-criteria-heading">
        <h2
          id="quick-key-criteria-heading"
          className="mb-4 text-xl font-semibold text-slate-900 dark:text-white"
        >
          {text.details}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
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
              {comparisonCriteria.slice(0, 4).map((criterion, index) => (
                <tr
                  key={criterion.category}
                  className="border-t border-slate-200 align-top dark:border-slate-800"
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
                  <td className="p-4 font-medium text-indigo-700 dark:text-indigo-300">
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

      <section
        aria-labelledby="quick-decision-heading"
        className="scroll-mt-24"
      >
        <h2
          id="quick-decision-heading"
          className="mb-5 text-xl font-semibold text-slate-900 dark:text-white"
        >
          {text.decision}
        </h2>
        <div className="grid gap-5 md:grid-cols-2">{decisionCards()}</div>
        <div className="mt-6">{renderMatcher()}</div>
      </section>
    </div>
  );

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
        </header>

        <ComparisonViewToggle
          labels={{
            navigation: text.viewNavigation,
            quick: text.quickView,
            deep: text.deepView,
          }}
          quickContent={quickContent}
          deepContent={
            <>
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
              <div className="grid gap-5 md:grid-cols-2">{decisionCards()}</div>
              <div className="mt-6">{renderMatcher()}</div>
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
                {focusedFaq.map(({ q, a }) => (
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

        {relatedStacks.length > 0 && (
          <section
            aria-labelledby="related-stacks-heading"
            className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800"
          >
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-900 dark:bg-indigo-950/25 sm:p-8">
              <h2
                id="related-stacks-heading"
                className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
              >
                {text.relatedStacks}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {text.relatedStacksDescription}
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedStacks.map(({ comparison: related, sharedToolName }) => (
                  <li key={related.slug}>
                    <Link
                      href={getComparisonUrl(locale, related.slug)}
                      className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
                    >
                      <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {text.relatedThrough} {sharedToolName}
                      </span>
                      <span className="mt-2 block font-semibold text-slate-900 dark:text-white">
                        {related.toolA.name} vs {related.toolB.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {relatedComparisons.length > 0 && (
          <section
            aria-labelledby="related-comparisons"
            className="mt-10 border-t border-slate-200 pt-10 dark:border-slate-800"
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
            </>
          }
        />
      </article>
    </main>
  );
}
