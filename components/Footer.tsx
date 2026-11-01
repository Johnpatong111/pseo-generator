import Link from "next/link";
import { CATEGORY_IDS, categoryCopy } from "../lib/taxonomy";
import { BRAND_NAME, BRAND_TAGLINE, type Locale } from "../lib/locales";

const footerText = {
  pl: { label: "Kategorie", information: "Informacje", matrix: "Macierz porównań", methodology: "Metodyka", privacy: "Prywatność", disclaimer: "Zastrzeżenia", copyright: "Przykłady kodu i wiedza architektoniczna dla programistów." },
  en: { label: "Explore categories", information: "Information", matrix: "Compare matrix", methodology: "Methodology", privacy: "Privacy", disclaimer: "Disclaimer", copyright: "Code examples and architecture insight for developers." },
  es: { label: "Explorar categorías", information: "Información", matrix: "Matriz comparativa", methodology: "Metodología", privacy: "Privacidad", disclaimer: "Aviso legal", copyright: "Código y arquitectura para desarrolladores." },
  de: { label: "Kategorien entdecken", information: "Informationen", matrix: "Vergleichsmatrix", methodology: "Methodik", privacy: "Datenschutz", disclaimer: "Haftungsausschluss", copyright: "Codebeispiele und Architekturwissen für Entwickler." },
  fr: { label: "Explorer les catégories", information: "Informations", matrix: "Matrice comparative", methodology: "Méthodologie", privacy: "Confidentialité", disclaimer: "Avertissement", copyright: "Exemples de code et connaissances en architecture pour les développeurs." },
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
        <nav aria-label={footerText[locale].information} className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          {([
            ["methodology", footerText[locale].methodology],
            ["privacy", footerText[locale].privacy],
            ["disclaimer", footerText[locale].disclaimer],
          ] as const).map(([path, label]) => (
            <Link
              key={path}
              href={`/${locale}/${path}`}
              className="text-sm text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
            >
              {label}
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
