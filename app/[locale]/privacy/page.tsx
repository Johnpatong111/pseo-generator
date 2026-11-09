import type { Metadata } from "next";
import { isLocale, LOCALES, type Locale } from "../../../lib/comparisons";
import { INDEXABLE_LOCALES } from "../../../lib/indexing";
import { BRAND_NAME } from "../../../lib/locales";
import { canonicalSiteUrl } from "../../../lib/site-url";

const content: Record<Locale, { title: string; description: string; body: string[] }> = {
  en: {
    title: "Privacy",
    description: "Privacy information for SnippetsLibrary visitors.",
    body: [
      "SnippetsLibrary comparison pages do not require an account or ask visitors to submit personal information. The search interface filters the comparison catalogue in the browser, and code-copy controls use the browser clipboard only after the visitor selects the copy action.",
      "Like most websites, the hosting provider may process technical request data (such as IP address, requested URL, and user-agent) to deliver and protect the service. Consult the hosting provider's current privacy information for details about its processing and retention.",
      "Links to third-party documentation and services lead to sites governed by their own privacy policies. This page should be updated if the site's data collection, analytics, or contact features change.",
    ],
  },
  pl: {
    title: "Prywatność",
    description: "Informacje o prywatności dla osób odwiedzających SnippetsLibrary.",
    body: [
      "Strony porównań SnippetsLibrary nie wymagają konta ani podawania danych osobowych. Wyszukiwarka filtruje katalog w przeglądarce, a kopiowanie kodu korzysta ze schowka dopiero po wybraniu odpowiedniej akcji.",
      "Dostawca hostingu może przetwarzać dane techniczne żądań, takie jak adres IP, żądany URL i user-agent, aby udostępniać i chronić serwis. Szczegóły przetwarzania i retencji należy sprawdzić w aktualnej polityce dostawcy hostingu.",
      "Odnośniki do zewnętrznej dokumentacji i usług prowadzą do serwisów objętych własnymi politykami prywatności. Informacje należy zaktualizować w razie wdrożenia analityki, formularzy kontaktowych lub innych funkcji zbierających dane.",
    ],
  },
  es: {
    title: "Privacidad",
    description: "Información de privacidad para quienes visitan SnippetsLibrary.",
    body: [
      "Las páginas de comparación de SnippetsLibrary no requieren una cuenta ni solicitan datos personales. La búsqueda filtra el catálogo en el navegador y la copia de código usa el portapapeles solo cuando el usuario selecciona esa acción.",
      "El proveedor de alojamiento puede procesar datos técnicos de las solicitudes, como la dirección IP, la URL solicitada y el user-agent, para ofrecer y proteger el servicio. Consulta la información de privacidad vigente del proveedor para conocer el tratamiento y la retención.",
      "Los enlaces a documentación y servicios de terceros llevan a sitios con sus propias políticas de privacidad. Esta página debe actualizarse si se incorporan analítica, formularios de contacto u otras funciones que recopilen datos.",
    ],
  },
  de: {
    title: "Datenschutz",
    description: "Datenschutzhinweise für Besucher von SnippetsLibrary.",
    body: [
      "Vergleichsseiten von SnippetsLibrary erfordern kein Konto und fragen keine persönlichen Angaben ab. Die Suche filtert den Katalog im Browser; die Kopierfunktion greift erst nach Auswahl der Aktion auf die Zwischenablage zu.",
      "Der Hosting-Anbieter kann technische Anfragedaten wie IP-Adresse, angeforderte URL und User-Agent verarbeiten, um den Dienst bereitzustellen und zu schützen. Einzelheiten zur Verarbeitung und Speicherung findest du in den aktuellen Datenschutzhinweisen des Hosting-Anbieters.",
      "Links zu Dokumentationen und Diensten Dritter führen zu Websites mit eigenen Datenschutzrichtlinien. Diese Seite ist zu aktualisieren, falls Analyse-, Kontakt- oder andere Datenerfassungsfunktionen hinzukommen.",
    ],
  },
  fr: {
    title: "Confidentialité",
    description: "Informations de confidentialité destinées aux visiteurs de SnippetsLibrary.",
    body: [
      "Les pages de comparaison SnippetsLibrary ne nécessitent pas de compte et ne demandent pas de données personnelles. La recherche filtre le catalogue dans le navigateur et la copie de code n’utilise le presse-papiers qu’après une action volontaire.",
      "L’hébergeur peut traiter des données techniques de requête, telles que l’adresse IP, l’URL demandée et le user-agent, afin de fournir et protéger le service. Consultez la politique actuelle de l’hébergeur pour connaître les modalités de traitement et de conservation.",
      "Les liens vers des documentations et services tiers mènent à des sites soumis à leurs propres politiques de confidentialité. Cette page doit être mise à jour si des outils d’analyse, formulaires ou autres fonctions de collecte sont ajoutés.",
    ],
  },
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${content[locale].title} | ${BRAND_NAME}`,
    description: content[locale].description,
    alternates: {
      canonical: canonicalSiteUrl(`/${locale}/privacy`),
      languages: Object.fromEntries(
        INDEXABLE_LOCALES.map((option) => [
          option,
          canonicalSiteUrl(`/${option}/privacy`),
        ]),
      ),
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
        {content[locale].title}
      </h1>
      <div className="mt-8 space-y-6">
        {content[locale].body.map((paragraph) => (
          <p key={paragraph} className="leading-7 text-slate-600 dark:text-slate-300">
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  );
}
