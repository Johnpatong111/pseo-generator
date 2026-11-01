import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, LOCALES, type Locale } from "../../../lib/comparisons";
import { BRAND_NAME } from "../../../lib/locales";
import { absoluteSiteUrl } from "../../../lib/site-url";

const copy = {
  en: {
    home: "Home",
    title: "Methodology",
    description: "How SnippetsLibrary structures technology comparisons, code examples, and technical recommendations.",
    intro: "SnippetsLibrary is a developer reference designed to make architectural trade-offs easier to inspect. Comparison pages combine structured editorial content, practical examples, and links to primary documentation where available.",
    sections: [
      ["Research and limitations", "Product capabilities, versions, plans, and prices change. Content should distinguish stable architectural characteristics from details that require checking against current vendor documentation. We do not present generated summaries as independent benchmark results or claim first-hand testing where none is documented."],
      ["Comparison framework", "Criteria are selected for the technologies being compared rather than treated as universal scores. A recommendation is conditional on workload, team experience, deployment constraints, and operating costs; there is no single winner for every project."],
      ["Code examples", "Examples use English identifiers and comments regardless of page language. They illustrate the same task on both sides of a comparison and may rely on project-specific clients, schemas, or environment configuration. Review and adapt them to your own security and production requirements before use."],
      ["Corrections", "Technology details can become outdated. Verify version-sensitive behavior with official documentation before making implementation or purchasing decisions."],
    ],
  },
  pl: {
    home: "Strona główna",
    title: "Metodyka",
    description: "Jak SnippetsLibrary przygotowuje porównania technologii, przykłady kodu i rekomendacje techniczne.",
    intro: "SnippetsLibrary to źródło wiedzy dla programistów, które ułatwia analizę kompromisów architektonicznych. Strony łączą uporządkowane treści, praktyczne przykłady i odnośniki do dokumentacji źródłowej, gdy są dostępne.",
    sections: [
      ["Źródła i ograniczenia", "Możliwości produktów, wersje, plany i ceny ulegają zmianom. Treść powinna odróżniać stabilne cechy architektury od szczegółów wymagających weryfikacji w aktualnej dokumentacji dostawcy. Nie przedstawiamy podsumowań generowanych jako niezależnych wyników benchmarków ani nie deklarujemy testów własnych bez ich udokumentowania."],
      ["Ramy porównania", "Kryteria dobierane są do porównywanych technologii, a nie traktowane jako uniwersalny system punktacji. Rekomendacja zależy od obciążenia, doświadczenia zespołu, ograniczeń wdrożeniowych i kosztów utrzymania."],
      ["Przykłady kodu", "Przykłady używają angielskich nazw i komentarzy niezależnie od języka strony. Po obu stronach porównania ilustrują to samo zadanie i mogą wymagać klienta, schematu lub konfiguracji właściwej dla projektu. Przed użyciem sprawdź je i dostosuj do wymagań bezpieczeństwa oraz środowiska produkcyjnego."],
      ["Aktualizacje", "Szczegóły technologii mogą się dezaktualizować. Przed decyzją o implementacji lub zakupie sprawdź zachowanie zależne od wersji w oficjalnej dokumentacji."],
    ],
  },
  es: {
    home: "Inicio",
    title: "Metodología",
    description: "Cómo SnippetsLibrary estructura comparativas tecnológicas, ejemplos de código y recomendaciones técnicas.",
    intro: "SnippetsLibrary es un recurso para desarrolladores que facilita el análisis de decisiones arquitectónicas. Las páginas combinan contenido estructurado, ejemplos prácticos y enlaces a documentación primaria cuando está disponible.",
    sections: [
      ["Fuentes y límites", "Las funciones, versiones, planes y precios cambian. El contenido debe distinguir las características arquitectónicas estables de los detalles que requieren comprobarse en la documentación vigente del proveedor. No presentamos resúmenes generados como benchmarks independientes ni afirmamos pruebas propias que no estén documentadas."],
      ["Marco comparativo", "Los criterios se eligen según las tecnologías comparadas, no como una puntuación universal. La recomendación depende de la carga de trabajo, la experiencia del equipo, las restricciones de despliegue y los costes operativos."],
      ["Ejemplos de código", "Los ejemplos utilizan identificadores y comentarios en inglés, independientemente del idioma de la página. Ambos lados ilustran la misma tarea y pueden depender de clientes, esquemas o configuración específicos del proyecto. Revísalos y adáptalos a tus requisitos de seguridad y producción antes de usarlos."],
      ["Actualizaciones", "Los detalles técnicos pueden quedar obsoletos. Comprueba el comportamiento dependiente de la versión en la documentación oficial antes de tomar decisiones."],
    ],
  },
  de: {
    home: "Startseite",
    title: "Methodik",
    description: "Wie SnippetsLibrary Technologievergleiche, Codebeispiele und technische Empfehlungen strukturiert.",
    intro: "SnippetsLibrary ist eine Entwicklerreferenz, die architektonische Abwägungen nachvollziehbar macht. Vergleichsseiten verbinden strukturierte Inhalte, praktische Beispiele und – sofern verfügbar – Links zur Primärdokumentation.",
    sections: [
      ["Recherche und Grenzen", "Produktfunktionen, Versionen, Tarife und Preise ändern sich. Inhalte sollten stabile Architektureigenschaften von Details unterscheiden, die anhand aktueller Anbieterunterlagen geprüft werden müssen. Generierte Zusammenfassungen werden nicht als unabhängige Benchmark-Ergebnisse oder undokumentierte eigene Tests dargestellt."],
      ["Vergleichsrahmen", "Kriterien werden passend zu den verglichenen Technologien gewählt und nicht als universelle Punktzahl behandelt. Eine Empfehlung hängt von Arbeitslast, Team-Erfahrung, Bereitstellungsvorgaben und Betriebskosten ab."],
      ["Codebeispiele", "Beispiele verwenden unabhängig von der Seitensprache englische Bezeichner und Kommentare. Beide Seiten zeigen dieselbe Aufgabe und können projektspezifische Clients, Schemas oder Konfiguration benötigen. Vor der Verwendung sollten sie geprüft und an Sicherheits- und Produktionsanforderungen angepasst werden."],
      ["Aktualisierungen", "Technische Details können veralten. Prüfe versionsabhängiges Verhalten vor Implementierungs- oder Kaufentscheidungen in der offiziellen Dokumentation."],
    ],
  },
  fr: {
    home: "Accueil",
    title: "Méthodologie",
    description: "Comment SnippetsLibrary structure les comparatifs technologiques, les exemples de code et les recommandations.",
    intro: "SnippetsLibrary est une ressource destinée aux développeurs pour faciliter l’analyse des compromis architecturaux. Les pages associent contenu structuré, exemples pratiques et liens vers la documentation primaire lorsqu’elle est disponible.",
    sections: [
      ["Sources et limites", "Les fonctionnalités, versions, offres et tarifs évoluent. Le contenu doit distinguer les caractéristiques architecturales stables des détails à vérifier dans la documentation actuelle du fournisseur. Les synthèses générées ne sont pas présentées comme des benchmarks indépendants et aucun test personnel non documenté n’est revendiqué."],
      ["Cadre de comparaison", "Les critères sont choisis selon les technologies étudiées et ne constituent pas une note universelle. Une recommandation dépend de la charge, de l’expérience de l’équipe, des contraintes de déploiement et des coûts d’exploitation."],
      ["Exemples de code", "Les exemples utilisent des identifiants et commentaires en anglais, quelle que soit la langue de la page. Les deux options illustrent la même tâche et peuvent nécessiter des clients, schémas ou configurations propres au projet. Vérifiez-les et adaptez-les aux exigences de sécurité et de production avant utilisation."],
      ["Mises à jour", "Les détails techniques peuvent devenir obsolètes. Vérifiez les comportements dépendants de la version dans la documentation officielle avant toute décision."],
    ],
  },
} satisfies Record<Locale, {
  home: string;
  title: string;
  description: string;
  intro: string;
  sections: [string, string][];
}>;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const locale = value as Locale;
  return {
    title: `${copy[locale].title} | ${BRAND_NAME}`,
    description: copy[locale].description,
    alternates: {
      canonical: absoluteSiteUrl(`/${locale}/methodology`),
      languages: Object.fromEntries(
        LOCALES.map((option) => [option, absoluteSiteUrl(`/${option}/methodology`)]),
      ),
    },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) return null;
  const content = copy[value];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <nav aria-label={content.home} className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        <Link href={`/${value}`}>{content.home}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{content.title}</span>
      </nav>
      <article>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          {content.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{content.intro}</p>
        <div className="mt-10 space-y-8">
          {content.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{heading}</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
