import type { Metadata } from "next";
import { isLocale, LOCALES, type Locale } from "../../../lib/comparisons";
import { BRAND_NAME } from "../../../lib/locales";
import { absoluteSiteUrl } from "../../../lib/site-url";

const content: Record<Locale, { title: string; description: string; body: string[] }> = {
  en: {
    title: "Disclaimer",
    description: "Important limitations and use guidance for SnippetsLibrary content.",
    body: [
      "SnippetsLibrary provides general technical information for educational purposes. It is not a substitute for official product documentation, professional security review, legal or financial advice, or testing in your own environment.",
      "Features, prices, licensing terms, model specifications, and compatibility can change and may depend on plan, region, version, or configuration. Verify material details with the relevant provider before making implementation or purchasing decisions.",
      "Code examples are starting points, not guarantees of production readiness. Review dependencies, error handling, credentials, permissions, and security controls before adapting an example to a real system.",
    ],
  },
  pl: {
    title: "Zastrzeżenia",
    description: "Ograniczenia i wskazówki dotyczące korzystania z treści SnippetsLibrary.",
    body: [
      "SnippetsLibrary udostępnia ogólne informacje techniczne w celach edukacyjnych. Nie zastępują one oficjalnej dokumentacji, profesjonalnego audytu bezpieczeństwa, porady prawnej lub finansowej ani testów we własnym środowisku.",
      "Funkcje, ceny, licencje, specyfikacje modeli i kompatybilność mogą się zmieniać i zależeć od planu, regionu, wersji lub konfiguracji. Przed decyzją wdrożeniową lub zakupową zweryfikuj istotne informacje u dostawcy.",
      "Przykłady kodu są punktem wyjścia, a nie gwarancją gotowości produkcyjnej. Przed użyciem sprawdź zależności, obsługę błędów, poświadczenia, uprawnienia i zabezpieczenia.",
    ],
  },
  es: {
    title: "Aviso legal",
    description: "Limitaciones y recomendaciones de uso del contenido de SnippetsLibrary.",
    body: [
      "SnippetsLibrary ofrece información técnica general con fines educativos. No sustituye la documentación oficial, una revisión profesional de seguridad, asesoramiento legal o financiero ni las pruebas en tu propio entorno.",
      "Las funciones, precios, licencias, especificaciones de modelos y compatibilidad pueden cambiar y depender del plan, región, versión o configuración. Verifica los datos importantes con el proveedor antes de implementar o comprar.",
      "Los ejemplos de código son puntos de partida, no garantías de preparación para producción. Revisa dependencias, errores, credenciales, permisos y controles de seguridad antes de adaptarlos.",
    ],
  },
  de: {
    title: "Haftungsausschluss",
    description: "Einschränkungen und Hinweise zur Nutzung der Inhalte von SnippetsLibrary.",
    body: [
      "SnippetsLibrary stellt allgemeine technische Informationen zu Bildungszwecken bereit. Sie ersetzen weder die offizielle Produktdokumentation noch eine professionelle Sicherheitsprüfung, Rechts- oder Finanzberatung oder Tests in der eigenen Umgebung.",
      "Funktionen, Preise, Lizenzbedingungen, Modellspezifikationen und Kompatibilität können sich ändern und von Tarif, Region, Version oder Konfiguration abhängen. Prüfe wichtige Angaben vor Implementierungs- oder Kaufentscheidungen beim Anbieter.",
      "Codebeispiele sind Ausgangspunkte und keine Garantie für Produktionsreife. Prüfe Abhängigkeiten, Fehlerbehandlung, Zugangsdaten, Berechtigungen und Sicherheitsmaßnahmen vor der Übernahme.",
    ],
  },
  fr: {
    title: "Avertissement",
    description: "Limites et conseils d’utilisation du contenu de SnippetsLibrary.",
    body: [
      "SnippetsLibrary fournit des informations techniques générales à des fins pédagogiques. Elles ne remplacent ni la documentation officielle, ni un audit de sécurité professionnel, ni un conseil juridique ou financier, ni des tests dans votre environnement.",
      "Les fonctionnalités, tarifs, licences, spécifications des modèles et compatibilités peuvent évoluer et dépendre de l’offre, de la région, de la version ou de la configuration. Vérifiez les informations importantes auprès du fournisseur avant toute décision.",
      "Les exemples de code sont des points de départ et ne garantissent pas une utilisation en production. Vérifiez les dépendances, la gestion des erreurs, les identifiants, les autorisations et les protections de sécurité avant adaptation.",
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
      canonical: absoluteSiteUrl(`/${locale}/disclaimer`),
      languages: Object.fromEntries(
        LOCALES.map((option) => [option, absoluteSiteUrl(`/${option}/disclaimer`)]),
      ),
    },
  };
}

export default async function DisclaimerPage({
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
