"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CategoryId } from "../lib/taxonomy";
import type { Locale } from "../lib/locales";

export type MatrixAttributeId =
  | "license"
  | "difficulty"
  | "performance"
  | "useCase"
  | "typescript";

export interface MatrixTechnology {
  id: string;
  name: string;
  categories: CategoryId[];
  attributes: Partial<Record<MatrixAttributeId, string>>;
}

export interface MatrixPair {
  slug: string;
  toolA: string;
  toolB: string;
}

interface MultiCompareMatrixProps {
  locale: Locale;
  technologies: MatrixTechnology[];
  pairs: MatrixPair[];
  categoryNames: Record<CategoryId, string>;
}

const copy = {
  pl: {
    heading: "Wybierz kategorię i technologie",
    category: "Kategoria",
    technologyLabel: "Technologie",
    hint: "Wybierz od 2 do 4 technologii.",
    selected: "wybrane",
    criterion: "Kryterium",
    minimum: "Wybierz co najmniej 2 technologie, aby zbudować macierz.",
    maximum: "Możesz wybrać maksymalnie 4 technologie.",
    attributes: {
      license: "Licencja",
      difficulty: "Trudność nauki",
      performance: "Wydajność",
      useCase: "Główne zastosowanie",
      typescript: "Wsparcie TypeScript",
    },
    unavailable: "Brak danych w dostępnych porównaniach.",
    links: "Porównania 1v1",
    compare: "Porównaj",
    noPair: "Brak bezpośredniego porównania 1v1 dla tej pary.",
    tableCaption: "Macierz porównawcza wybranych technologii",
  },
  en: {
    heading: "Choose a category and technologies",
    category: "Category",
    technologyLabel: "Technologies",
    hint: "Select 2 to 4 technologies.",
    selected: "selected",
    criterion: "Criterion",
    minimum: "Select at least 2 technologies to build a matrix.",
    maximum: "You can select up to 4 technologies.",
    attributes: {
      license: "License",
      difficulty: "Learning curve",
      performance: "Performance",
      useCase: "Primary use case",
      typescript: "TypeScript support",
    },
    unavailable: "No data available in the existing comparisons.",
    links: "1v1 comparisons",
    compare: "Compare",
    noPair: "No direct 1v1 comparison is available for this pair.",
    tableCaption: "Comparison matrix for the selected technologies",
  },
  es: {
    heading: "Elige una categoría y las tecnologías",
    category: "Categoría",
    technologyLabel: "Tecnologías",
    hint: "Selecciona entre 2 y 4 tecnologías.",
    selected: "seleccionadas",
    criterion: "Criterio",
    minimum: "Selecciona al menos 2 tecnologías para crear una matriz.",
    maximum: "Puedes seleccionar hasta 4 tecnologías.",
    attributes: {
      license: "Licencia",
      difficulty: "Curva de aprendizaje",
      performance: "Rendimiento",
      useCase: "Uso principal",
      typescript: "Compatibilidad con TypeScript",
    },
    unavailable: "No hay datos en las comparativas disponibles.",
    links: "Comparativas 1v1",
    compare: "Comparar",
    noPair: "No hay una comparativa 1v1 directa para este par.",
    tableCaption: "Matriz comparativa de las tecnologías seleccionadas",
  },
  de: {
    heading: "Kategorie und Technologien auswählen",
    category: "Kategorie",
    technologyLabel: "Technologien",
    hint: "Wähle 2 bis 4 Technologien aus.",
    selected: "ausgewählt",
    criterion: "Kriterium",
    minimum: "Wähle mindestens 2 Technologien für eine Vergleichsmatrix aus.",
    maximum: "Du kannst bis zu 4 Technologien auswählen.",
    attributes: {
      license: "Lizenz",
      difficulty: "Lernkurve",
      performance: "Leistung",
      useCase: "Haupteinsatzgebiet",
      typescript: "TypeScript-Unterstützung",
    },
    unavailable: "In den vorhandenen Vergleichen sind keine Daten verfügbar.",
    links: "1-zu-1-Vergleiche",
    compare: "Vergleichen",
    noPair: "Für dieses Paar ist kein direkter 1-zu-1-Vergleich verfügbar.",
    tableCaption: "Vergleichsmatrix der ausgewählten Technologien",
  },
  fr: {
    heading: "Choisissez une catégorie et des technologies",
    category: "Catégorie",
    technologyLabel: "Technologies",
    hint: "Sélectionnez de 2 à 4 technologies.",
    selected: "sélectionnées",
    criterion: "Critère",
    minimum: "Sélectionnez au moins 2 technologies pour créer une matrice.",
    maximum: "Vous pouvez sélectionner jusqu’à 4 technologies.",
    attributes: {
      license: "Licence",
      difficulty: "Courbe d’apprentissage",
      performance: "Performances",
      useCase: "Cas d’usage principal",
      typescript: "Prise en charge de TypeScript",
    },
    unavailable: "Aucune donnée dans les comparatifs disponibles.",
    links: "Comparatifs 1v1",
    compare: "Comparer",
    noPair: "Aucun comparatif 1v1 direct n’est disponible pour cette paire.",
    tableCaption: "Matrice comparative des technologies sélectionnées",
  },
} as const;

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

const attributeOrder: MatrixAttributeId[] = [
  "license",
  "difficulty",
  "performance",
  "useCase",
  "typescript",
];

function pairKey(first: string, second: string) {
  return [first, second].sort().join("|");
}

export default function MultiCompareMatrix({
  locale,
  technologies,
  pairs,
  categoryNames,
}: MultiCompareMatrixProps) {
  const text = copy[locale];
  const categories = Object.keys(categoryNames) as CategoryId[];
  const [category, setCategory] = useState<CategoryId>(
    categories.find((id) =>
      technologies.some((technology) => technology.categories.includes(id)),
    ) ?? "frontend",
  );
  const categoryTechnologies = useMemo(
    () =>
      technologies
        .filter((technology) => technology.categories.includes(category))
        .sort((left, right) => left.name.localeCompare(right.name)),
    [category, technologies],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function changeCategory(nextCategory: CategoryId) {
    setCategory(nextCategory);
    setSelectedIds([]);
  }

  function toggleTechnology(id: string) {
    setSelectedIds((selected) => {
      if (selected.includes(id)) {
        return selected.filter((selectedId) => selectedId !== id);
      }
      if (selected.length >= 4) {
        return selected;
      }
      return [...selected, id];
    });
  }

  const selectedTechnologies = categoryTechnologies.filter((technology) =>
    selectedIds.includes(technology.id),
  );
  const pairLinks = useMemo(() => {
    const existingPairs = new Map(
      pairs.map((pair) => [pairKey(pair.toolA, pair.toolB), pair.slug]),
    );

    return selectedTechnologies.flatMap((technology, index) =>
      selectedTechnologies.slice(index + 1).map((other) => ({
        first: technology,
        second: other,
        slug: existingPairs.get(pairKey(technology.id, other.id)),
      })),
    );
  }, [pairs, selectedTechnologies]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          {text.criterion}
        </h2>
        <div className="mt-5 max-w-md">
          <label
            htmlFor="matrix-category"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {text.category}
          </label>
          <select
            id="matrix-category"
            value={category}
            onChange={(event) => changeCategory(event.target.value as CategoryId)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {categories.map((id) => (
              <option key={id} value={id}>
                {categoryNames[id]}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">
            {text.technologyLabel}
            <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
              ({selectedIds.length}/4 {text.selected})
            </span>
          </legend>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {text.hint}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTechnologies.map((technology) => {
              const selected = selectedIds.includes(technology.id);
              const disabled = !selected && selectedIds.length >= 4;

              return (
                <li key={technology.id}>
                  <label
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
                      selected
                        ? "border-indigo-400 bg-indigo-50 text-indigo-950 dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600"
                    } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => toggleTechnology(technology.id)}
                      className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium">{technology.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </section>

      {selectedTechnologies.length < 2 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {text.minimum}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">{text.tableCaption}</caption>
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 min-w-44 bg-slate-100 p-4 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                  >
                    {text.heading}
                  </th>
                  {selectedTechnologies.map((technology) => (
                    <th
                      key={technology.id}
                      scope="col"
                      className="min-w-56 p-4 font-semibold text-slate-900 dark:text-white"
                    >
                      {technology.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attributeOrder.map((attribute) => (
                  <tr
                    key={attribute}
                    className="border-t border-slate-200 align-top dark:border-slate-800"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white p-4 font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {text.attributes[attribute]}
                    </th>
                    {selectedTechnologies.map((technology) => (
                      <td
                        key={technology.id}
                        className="p-4 leading-6 text-slate-600 dark:text-slate-300"
                      >
                        {technology.attributes[attribute] || (
                          <span className="text-sm italic text-slate-400 dark:text-slate-500">
                            {text.unavailable}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section aria-labelledby="matrix-pair-links">
            <h2
              id="matrix-pair-links"
              className="text-xl font-semibold text-slate-950 dark:text-white"
            >
              {text.links}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pairLinks.map(({ first, second, slug }) => (
                <li key={`${first.id}-${second.id}`}>
                  {slug ? (
                    <Link
                      href={`/${locale}/compare/${slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                    >
                      <span>{first.name} vs {second.name}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                      {text.noPair}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
