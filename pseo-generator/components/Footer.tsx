import Link from "next/link";
import { CATEGORY_IDS, categoryCopy } from "../lib/taxonomy";
import { BRAND_NAME, BRAND_TAGLINE, type Locale } from "../lib/locales";

const footerText = {
  pl: { label: "Kategorie", matrix: "Macierz porównań", copyright: "Przykłady kodu i wiedza architektoniczna dla programistów." },
  en: { label: "Explore categories", matrix: "Compare matrix", copyright: "Code examples and architecture insight for developers." },
  es: { label: "Explorar categorías", matrix: "Matriz comparativa", copyright: "Código y arquitectura para desarrolladores." },
  de: { label: "Kategorien entdecken", matrix: "Vergleichsmatrix", copyright: "Codebeispiele und Architekturwissen für Entwickler." },
  fr: { label: "Explorer les catégories", matrix: "Matrice comparative", copyright: "Exemples de code et connaissances en architecture pour les développeurs." },
} as const;

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {BRAND_NAME}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {BRAND_TAGLINE[locale]}
        </p>
        <h3 className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">
          {footerText[locale].label}
        </h3>
        <nav aria-label={footerText[locale].label} className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
          <Link
            href={`/${locale}/matrix`}
            className="text-sm text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
          >
            {footerText[locale].matrix}
          </Link>
          {CATEGORY_IDS.map((category) => (
            <Link
              key={category}
              href={`/${locale}/category/${category}`}
              className="text-sm text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
            >
              {categoryCopy[locale][category].name}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {BRAND_NAME}. {footerText[locale].copyright}
        </p>
      </div>
    </footer>
  );
}
