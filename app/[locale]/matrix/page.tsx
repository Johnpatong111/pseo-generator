import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MultiCompareMatrix, {
  type MatrixAttributeId,
  type MatrixPair,
  type MatrixTechnology,
} from "../../../components/MultiCompareMatrix";
import {
  getComparisons,
  isLocale,
  LOCALES,
  type Locale,
} from "../../../lib/comparisons";
import { BRAND_NAME } from "../../../lib/locales";
import { CATEGORY_IDS, categoryCopy, getComparisonCategories } from "../../../lib/taxonomy";

interface MatrixPageProps {
  params: Promise<{ locale: string }>;
}

const pageCopy = {
  pl: {
    title: "Macierz porównawcza technologii",
    description:
      "Porównaj od 2 do 4 technologii z jednej kategorii. Zestawiaj dostępne informacje i przejdź do szczegółowych porównań 1v1.",
    intro:
      "Wybierz kategorię i technologie, aby zestawić ich dostępne informacje w jednej tabeli. Dane pochodzą z opublikowanych porównań; brakujące informacje są wyraźnie oznaczone.",
  },
  en: {
    title: "Technology comparison matrix",
    description:
      "Compare 2 to 4 technologies in one category. Review available information and explore detailed 1v1 comparisons.",
    intro:
      "Choose a category and technologies to compare available information in one table. Data comes from published comparisons; missing information is clearly labeled.",
  },
  es: {
    title: "Matriz comparativa de tecnologías",
    description:
      "Compara de 2 a 4 tecnologías de una categoría. Consulta la información disponible y accede a comparativas 1v1 detalladas.",
    intro:
      "Elige una categoría y varias tecnologías para comparar la información disponible en una sola tabla. Los datos proceden de comparativas publicadas; la información ausente se indica claramente.",
  },
  de: {
    title: "Technologie-Vergleichsmatrix",
    description:
      "Vergleiche 2 bis 4 Technologien einer Kategorie. Sieh dir verfügbare Informationen an und öffne detaillierte 1-zu-1-Vergleiche.",
    intro:
      "Wähle eine Kategorie und Technologien aus, um verfügbare Informationen in einer Tabelle zu vergleichen. Die Daten stammen aus veröffentlichten Vergleichen; fehlende Angaben werden gekennzeichnet.",
  },
  fr: {
    title: "Matrice comparative des technologies",
    description:
      "Comparez de 2 à 4 technologies d’une catégorie. Consultez les informations disponibles et découvrez les comparatifs 1v1 détaillés.",
    intro:
      "Choisissez une catégorie et des technologies pour comparer les informations disponibles dans un tableau. Les données proviennent de comparatifs publiés ; les informations manquantes sont signalées.",
  },
} satisfies Record<Locale, { title: string; description: string; intro: string }>;

const attributePatterns: Record<MatrixAttributeId, RegExp> = {
  license: /licen[cs]|open.source|lizenz/i,
  difficulty:
    /learning curve|developer experience|ease of use|usability|facilidad|curva de aprendizaje|experiencia de desarrollo|schwierigkeit|lernkurve|benutzerfreundlichkeit|courbe d’apprentissage|facilité d’utilisation|łatwość|krzywa uczenia/i,
  performance:
    /performance|rendimiento|wydajno|leistung|performances|latency|throughput|speed|benchmark/i,
  useCase:
    /use case|use cases|typical use|best for|caso de uso|casos de uso|hauptanwendung|einsatzgebiet|cas d’usage|utilisation principale|zastosowanie/i,
  typescript: /typescript|type support|type safety|typisierung|types|typage/i,
};

function createMatrixData(locale: Locale): {
  technologies: MatrixTechnology[];
  pairs: MatrixPair[];
} {
  const technologyMap = new Map<string, MatrixTechnology>();
  const pairs: MatrixPair[] = [];

  for (const comparison of getComparisons(locale)) {
    const [toolAId, toolBId] = comparison.slug.split("-vs-");
    if (!toolAId || !toolBId) {
      continue;
    }

    const categories = getComparisonCategories(comparison.slug);
    const tools = [
      { id: toolAId, name: comparison.toolA.name },
      { id: toolBId, name: comparison.toolB.name },
    ];

    for (const tool of tools) {
      const existing = technologyMap.get(tool.id);
      const technology =
        existing ??
        ({
          id: tool.id,
          name: tool.name,
          categories: [],
          attributes: {},
        } satisfies MatrixTechnology);

      technology.name = tool.name;
      technology.categories = [...new Set([...technology.categories, ...categories])];

      for (const criterion of comparison.comparison ?? []) {
        const attribute = (Object.keys(attributePatterns) as MatrixAttributeId[]).find(
          (key) => attributePatterns[key].test(criterion.category),
        );
        if (!attribute || technology.attributes[attribute]) {
          continue;
        }

        technology.attributes[attribute] =
          tool.id === toolAId ? criterion.toolA : criterion.toolB;
      }

      technologyMap.set(tool.id, technology);
    }

    pairs.push({ slug: comparison.slug, toolA: toolAId, toolB: toolBId });
  }

  return {
    technologies: [...technologyMap.values()]
      .filter((technology) => technology.categories.length > 0)
      .sort((left, right) => left.name.localeCompare(right.name)),
    pairs,
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: MatrixPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    return {};
  }

  const text = pageCopy[localeParam];
  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: `/${localeParam}/matrix`,
      languages: {
        ...Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}/matrix`])),
        "x-default": "/en/matrix",
      },
    },
    openGraph: {
      title: text.title,
      description: text.description,
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

export default async function MatrixPage({ params }: MatrixPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const { technologies, pairs } = createMatrixData(locale);
  const categoryNames = Object.fromEntries(
    CATEGORY_IDS.map((id) => [id, categoryCopy[locale][id].name]),
  ) as Record<(typeof CATEGORY_IDS)[number], string>;
  const text = pageCopy[locale];

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-6 py-12 sm:px-8 lg:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">
          {BRAND_NAME}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {text.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          {text.intro}
        </p>
      </header>
      <MultiCompareMatrix
        locale={locale}
        technologies={technologies}
        pairs={pairs}
        categoryNames={categoryNames}
      />
    </main>
  );
}
