"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getTechnologyCategories, type CategoryId } from "../lib/taxonomy";
import type { Locale } from "../lib/locales";

interface WizardComparison {
  slug: string;
  toolA: { name: string };
  toolB: { name: string };
}

interface StackWizardProps {
  comparisons: WizardComparison[];
  locale: Locale;
}

const choices = {
  pl: {
    eyebrow: "Kreator architektury",
    title: "Znajdź idealny stack dla swojego projektu",
    description: "Odpowiedz na dwa pytania, aby znaleźć przydatne porównanie technologii.",
    step: "Krok",
    projectQuestion: "Co budujesz?",
    priorityQuestion: "Co jest najważniejsze?",
    recommendation: "Propozycja do dalszego researchu",
    recommendationDescription:
      "Na podstawie Twoich odpowiedzi wybraliśmy dostępne porównanie. To punkt wyjścia — ostateczny wybór zależy od wymagań projektu.",
    viewComparison: "Zobacz porównanie",
    restart: "Zmień odpowiedzi",
    projects: [
      { id: "saas", label: "SaaS", description: "Aplikacja webowa lub platforma subskrypcyjna" },
      { id: "ecommerce", label: "E-commerce", description: "Sklep internetowy i płatności" },
      { id: "mobile", label: "Aplikacja mobilna", description: "Aplikacja na telefon lub tablet" },
      { id: "ai", label: "Narzędzie AI", description: "Produkt wykorzystujący modele lub agentów AI" },
    ],
    priorities: [
      { id: "performance", label: "Wydajność", description: "Szybkie odpowiedzi i sprawne działanie" },
      { id: "delivery", label: "Szybkość wdrożenia", description: "Krótszy czas od pomysłu do uruchomienia" },
      { id: "cost", label: "Niskie koszty", description: "Prostszy i oszczędniejszy start" },
      { id: "scale", label: "Skalowalność", description: "Gotowość na wzrost ruchu i danych" },
    ],
  },
  en: {
    eyebrow: "Architecture wizard",
    title: "Find the right stack for your project",
    description: "Answer two questions to find a useful technology comparison.",
    step: "Step",
    projectQuestion: "What are you building?",
    priorityQuestion: "What matters most?",
    recommendation: "A starting point for your research",
    recommendationDescription:
      "Based on your answers, we picked an available comparison. Treat it as a starting point—your requirements should guide the final choice.",
    viewComparison: "View comparison",
    restart: "Change answers",
    projects: [
      { id: "saas", label: "SaaS", description: "A web app or subscription platform" },
      { id: "ecommerce", label: "E-commerce", description: "An online store and payments" },
      { id: "mobile", label: "Mobile app", description: "An app for phones or tablets" },
      { id: "ai", label: "AI tool", description: "A product using AI models or agents" },
    ],
    priorities: [
      { id: "performance", label: "Performance", description: "Fast responses and efficient operation" },
      { id: "delivery", label: "Speed to launch", description: "A shorter path from idea to launch" },
      { id: "cost", label: "Lower costs", description: "A simpler, more affordable start" },
      { id: "scale", label: "Scalability", description: "Room to grow traffic and data" },
    ],
  },
  es: {
    eyebrow: "Asistente de arquitectura",
    title: "Encuentra el stack adecuado para tu proyecto",
    description: "Responde a dos preguntas para encontrar una comparativa útil.",
    step: "Paso",
    projectQuestion: "¿Qué estás creando?",
    priorityQuestion: "¿Qué es lo más importante?",
    recommendation: "Un punto de partida para investigar",
    recommendationDescription:
      "Según tus respuestas, elegimos una comparativa disponible. Es un punto de partida; los requisitos del proyecto deben guiar la decisión final.",
    viewComparison: "Ver comparativa",
    restart: "Cambiar respuestas",
    projects: [
      { id: "saas", label: "SaaS", description: "Una aplicación web o plataforma de suscripción" },
      { id: "ecommerce", label: "Comercio electrónico", description: "Una tienda online y pagos" },
      { id: "mobile", label: "Aplicación móvil", description: "Una app para teléfonos o tabletas" },
      { id: "ai", label: "Herramienta de IA", description: "Un producto con modelos o agentes de IA" },
    ],
    priorities: [
      { id: "performance", label: "Rendimiento", description: "Respuestas rápidas y funcionamiento eficiente" },
      { id: "delivery", label: "Rapidez de lanzamiento", description: "Menos tiempo de la idea al lanzamiento" },
      { id: "cost", label: "Costes bajos", description: "Un inicio más sencillo y económico" },
      { id: "scale", label: "Escalabilidad", description: "Capacidad para crecer en tráfico y datos" },
    ],
  },
  de: {
    eyebrow: "Architektur-Assistent",
    title: "Finde den passenden Stack für dein Projekt",
    description: "Beantworte zwei Fragen und finde einen passenden Technologievergleich.",
    step: "Schritt",
    projectQuestion: "Was entwickelst du?",
    priorityQuestion: "Was ist dir am wichtigsten?",
    recommendation: "Ein Ausgangspunkt für deine Recherche",
    recommendationDescription:
      "Anhand deiner Antworten haben wir einen verfügbaren Vergleich ausgewählt. Er dient als Orientierung – die endgültige Wahl hängt von deinen Anforderungen ab.",
    viewComparison: "Vergleich ansehen",
    restart: "Antworten ändern",
    projects: [
      { id: "saas", label: "SaaS", description: "Eine Web-App oder ein Abonnementdienst" },
      { id: "ecommerce", label: "E-Commerce", description: "Ein Onlineshop mit Zahlungsabwicklung" },
      { id: "mobile", label: "Mobile App", description: "Eine App für Smartphones oder Tablets" },
      { id: "ai", label: "KI-Tool", description: "Ein Produkt mit KI-Modellen oder Agenten" },
    ],
    priorities: [
      { id: "performance", label: "Leistung", description: "Schnelle Antworten und effizienter Betrieb" },
      { id: "delivery", label: "Schneller Start", description: "Schneller von der Idee zum Launch" },
      { id: "cost", label: "Niedrige Kosten", description: "Ein einfacher und kostengünstiger Einstieg" },
      { id: "scale", label: "Skalierbarkeit", description: "Wachstum bei Traffic und Daten ermöglichen" },
    ],
  },
  fr: {
    eyebrow: "Assistant d’architecture",
    title: "Trouvez le stack adapté à votre projet",
    description: "Répondez à deux questions pour découvrir un comparatif utile.",
    step: "Étape",
    projectQuestion: "Que créez-vous ?",
    priorityQuestion: "Quelle est votre priorité ?",
    recommendation: "Un point de départ pour vos recherches",
    recommendationDescription:
      "Selon vos réponses, nous avons sélectionné un comparatif disponible. Il sert de point de départ ; vos besoins doivent guider le choix final.",
    viewComparison: "Voir le comparatif",
    restart: "Modifier les réponses",
    projects: [
      { id: "saas", label: "SaaS", description: "Une application web ou un service par abonnement" },
      { id: "ecommerce", label: "E-commerce", description: "Une boutique en ligne et ses paiements" },
      { id: "mobile", label: "Application mobile", description: "Une application pour téléphone ou tablette" },
      { id: "ai", label: "Outil d’IA", description: "Un produit utilisant des modèles ou agents d’IA" },
    ],
    priorities: [
      { id: "performance", label: "Performances", description: "Des réponses rapides et un fonctionnement efficace" },
      { id: "delivery", label: "Rapidité de lancement", description: "Réduire le délai entre l’idée et le lancement" },
      { id: "cost", label: "Coûts réduits", description: "Un démarrage simple et économique" },
      { id: "scale", label: "Évolutivité", description: "Accompagner la croissance du trafic et des données" },
    ],
  },
} as const;

type ProjectId = (typeof choices.en.projects)[number]["id"];
type PriorityId = (typeof choices.en.priorities)[number]["id"];

const projectTargets: Record<ProjectId, string[]> = {
  saas: ["nextjs", "postgresql", "supabase", "redis", "vercel", "prisma"],
  ecommerce: ["nextjs", "postgresql", "mysql", "shopify", "redis", "aws"],
  mobile: ["react", "react-native", "flutter", "firebase", "supabase", "javascript"],
  ai: ["openai", "anthropic", "langchain", "llamaindex", "pinecone", "qdrant"],
};

const priorityTargets: Record<PriorityId, string[]> = {
  performance: ["bun", "fastify", "redis", "scylladb", "vite", "vllm"],
  delivery: ["nextjs", "supabase", "firebase", "vercel", "vite", "prisma"],
  cost: ["sqlite", "postgresql", "docker", "cloudflare", "ollama"],
  scale: ["kubernetes", "postgresql", "cassandra", "scylladb", "aws", "gcp"],
};

const projectCategory: Record<ProjectId, CategoryId> = {
  saas: "backend",
  ecommerce: "backend",
  mobile: "frontend",
  ai: "ai-models",
};

function scoreComparison(
  comparison: WizardComparison,
  project: ProjectId,
  priority: PriorityId,
) {
  const [toolA, toolB] = comparison.slug.split("-vs-");
  const tools = [toolA, toolB];
  const categories = new Set(
    tools.flatMap((tool) => getTechnologyCategories(tool)),
  );
  const projectMatches = projectTargets[project].filter((tool) =>
    tools.includes(tool),
  ).length;
  const priorityMatches = priorityTargets[priority].filter((tool) =>
    tools.includes(tool),
  ).length;
  const projectCategoryMatches = categories.has(projectCategory[project]);

  return projectMatches * 5 + priorityMatches * 3 + Number(projectCategoryMatches);
}

export default function StackWizard({ comparisons, locale }: StackWizardProps) {
  const text = choices[locale];
  const [step, setStep] = useState(1);
  const [project, setProject] = useState<ProjectId | null>(null);
  const [priority, setPriority] = useState<PriorityId | null>(null);

  const recommendedComparison = useMemo(() => {
    if (!project || !priority || comparisons.length === 0) {
      return undefined;
    }

    return [...comparisons].sort(
      (left, right) =>
        scoreComparison(right, project, priority) -
          scoreComparison(left, project, priority) ||
        left.slug.localeCompare(right.slug),
    )[0];
  }, [comparisons, priority, project]);

  return (
    <section
      aria-labelledby="stack-wizard-title"
      className="mb-14 overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm sm:p-8 dark:border-indigo-900 dark:from-indigo-950/50 dark:via-slate-900 dark:to-violet-950/30"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          {text.eyebrow}
        </p>
        <h2
          id="stack-wizard-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl"
        >
          {text.title}
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {text.description}
        </p>

        <div className="mt-6 flex items-center gap-2" aria-label={`${text.step} ${step} of 3`}>
          {[1, 2, 3].map((number) => (
            <span
              key={number}
              aria-current={step === number ? "step" : undefined}
              className={`h-1.5 flex-1 rounded-full ${
                step >= number ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <fieldset className="mt-7">
            <legend className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {text.projectQuestion}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {text.projects.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setProject(option.id);
                    setStep(2);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="mt-7">
            <legend className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {text.priorityQuestion}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {text.priorities.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setPriority(option.id);
                    setStep(3);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 text-sm font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
            >
              {text.restart}
            </button>
          </fieldset>
        )}

        {step === 3 && recommendedComparison && (
          <div className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 dark:border-indigo-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              {text.recommendation}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {recommendedComparison.toolA.name} vs {recommendedComparison.toolB.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {text.recommendationDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/compare/${recommendedComparison.slug}`}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {text.viewComparison}
                <span aria-hidden="true" className="ml-2">→</span>
              </Link>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {text.restart}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
