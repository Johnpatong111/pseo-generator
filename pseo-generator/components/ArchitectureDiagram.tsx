import {
  categoryCopy,
  getTechnologyCategories,
} from "../lib/taxonomy";
import type { Locale } from "../lib/locales";

interface ArchitectureDiagramProps {
  toolA: string;
  toolB: string;
  locale: Locale;
}

const labels = {
  pl: {
    title: "Schemat ról technologii",
    note: "Schemat pokazuje ogólne obszary zastosowania, a nie kompletną architekturę wdrożeniową.",
    first: "Opcja A",
    second: "Opcja B",
    relation: "Porównanie",
  },
  en: {
    title: "Technology role diagram",
    note: "This diagram shows broad areas of use, not a complete deployment architecture.",
    first: "Option A",
    second: "Option B",
    relation: "Comparison",
  },
  es: {
    title: "Diagrama de roles tecnológicos",
    note: "El diagrama muestra áreas generales de uso, no una arquitectura completa de despliegue.",
    first: "Opción A",
    second: "Opción B",
    relation: "Comparativa",
  },
  de: {
    title: "Technologierollen im Überblick",
    note: "Das Diagramm zeigt allgemeine Einsatzbereiche, keine vollständige Bereitstellungsarchitektur.",
    first: "Option A",
    second: "Option B",
    relation: "Vergleich",
  },
  fr: {
    title: "Rôle des technologies",
    note: "Ce schéma présente les domaines d’utilisation généraux, pas une architecture complète de déploiement.",
    first: "Option A",
    second: "Option B",
    relation: "Comparatif",
  },
} as const;

const technologyAliases: Record<string, string> = {
  "actix web": "actix-web",
  "apache cassandra": "cassandra",
  "chakra ui": "chakra-ui",
  "css modules": "css-modules",
  "drizzle orm": "drizzle",
  "google cloud": "gcp",
  "microsoft azure": "azure",
  "next.js": "nextjs",
  "node.js": "node",
  "react native": "react-native",
  "shadcn/ui": "shadcn",
  "tailwind css": "tailwind",
};

export default function ArchitectureDiagram({
  toolA,
  toolB,
  locale,
}: ArchitectureDiagramProps) {
  const text = labels[locale];
  const names = categoryCopy[locale];
  const getRoles = (technology: string) => {
    const normalized = technology.toLocaleLowerCase().trim();
    const categories = getTechnologyCategories(
      technologyAliases[normalized] ?? normalized.replace(/\s+/g, "-"),
    );
    return categories.length > 0
      ? categories.map((category) => names[category].name)
      : [text.relation];
  };

  return (
    <figure className="mb-12 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
      <figcaption className="mb-6 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {text.title}
      </figcaption>
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {[{ name: toolA, label: text.first }, { name: toolB, label: text.second }].map(
          (tool, index) => (
            <div
              key={tool.label}
              className={`rounded-2xl border p-5 ${
                index === 0
                  ? "border-indigo-200 bg-indigo-50/70 dark:border-indigo-900 dark:bg-indigo-950/30"
                  : "border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/30"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {tool.label}
              </p>
              <p className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                {tool.name}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {getRoles(tool.name).map((role) => (
                  <li
                    key={role}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
        <div
          aria-hidden="true"
          className="hidden items-center gap-2 text-indigo-500 md:flex"
        >
          <span className="h-px w-5 bg-current" />
          <span className="grid size-9 place-items-center rounded-full border border-current text-sm font-bold">
            VS
          </span>
          <span className="h-px w-5 bg-current" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {text.note}
      </p>
    </figure>
  );
}
