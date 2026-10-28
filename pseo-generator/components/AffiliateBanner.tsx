import type { Locale } from "../lib/locales";

interface AffiliateBannerProps {
  locale: Locale;
  toolA: string;
  toolB: string;
}

const copy = {
  pl: {
    eyebrow: "Kolejny krok",
    title: "Planujesz wdrożenie tego stacku?",
    description: "Sprawdź opcje hostingu i infrastruktury dla {tools}.",
    cta: "Poznaj możliwości wdrożenia",
    toolJoiner: "i",
  },
  en: {
    eyebrow: "Your next step",
    title: "Planning to deploy this stack?",
    description: "Explore hosting and infrastructure options for {tools}.",
    cta: "Explore deployment options",
    toolJoiner: "and",
  },
  es: {
    eyebrow: "Siguiente paso",
    title: "¿Planeas desplegar este stack?",
    description: "Descubre opciones de alojamiento e infraestructura para {tools}.",
    cta: "Ver opciones de despliegue",
    toolJoiner: "y",
  },
  de: {
    eyebrow: "Nächster Schritt",
    title: "Planst du, diesen Stack bereitzustellen?",
    description: "Entdecke Hosting- und Infrastrukturangebote für {tools}.",
    cta: "Deployment-Optionen entdecken",
    toolJoiner: "und",
  },
  fr: {
    eyebrow: "La suite",
    title: "Vous prévoyez de déployer ce stack ?",
    description: "Découvrez les solutions d’hébergement et d’infrastructure pour {tools}.",
    cta: "Découvrir les options de déploiement",
    toolJoiner: "et",
  },
} satisfies Record<
  Locale,
  { eyebrow: string; title: string; description: string; cta: string; toolJoiner: string }
>;

export default function AffiliateBanner({
  locale,
  toolA,
  toolB,
}: AffiliateBannerProps) {
  const text = copy[locale];
  const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL;
  const destination = affiliateUrl || "https://vercel.com";

  return (
    <aside className="my-10 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 dark:border-indigo-900 dark:from-indigo-950/60 dark:to-violet-950/40">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          {text.eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {text.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {text.description.replace(
            "{tools}",
            `${toolA} ${text.toolJoiner} ${toolB}`,
          )}
        </p>
      </div>
      <a
        href={destination}
        target="_blank"
        rel={affiliateUrl ? "sponsored noopener noreferrer" : "noopener noreferrer"}
        className="mt-5 inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-0"
      >
        {text.cta}
        <span aria-hidden="true" className="ml-2">
          ↗
        </span>
      </a>
    </aside>
  );
}
