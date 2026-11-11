import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getComparisons,
  isLocale,
  type Comparison,
} from "../../../../lib/comparisons";
import { canonicalSiteUrl, absoluteSiteUrl } from "../../../../lib/site-url";

interface AlternativesPageProps {
  params: Promise<{ locale: string; tool: string }>;
}

const pageCopy = {
  title: "Hono Alternatives: Bun, Express, Deno & Fastify",
  description:
    "Compare Hono alternatives across Node.js, Bun, Deno, and edge runtimes: performance, middleware, ecosystem, and migration trade-offs.",
  h1: "Hono alternatives for every runtime",
  intro:
    "Hono is a lightweight web framework designed for multiple JavaScript runtimes. If you need a larger middleware ecosystem, different performance characteristics, or a runtime-first toolkit, the right alternative depends on how your API is deployed.",
  introSecondary:
    "These comparisons use the same evaluation criteria so you can compare Hono with Express, Fastify, Bun, Deno, NestJS, and FastAPI without switching context.",
  comparisonsHeading: "Hono compared with other frameworks and runtimes",
  comparisonLabel: "Read comparison",
  faqHeading: "Hono alternatives: common questions",
  faq: [
    {
      q: "What is the best alternative to Hono?",
      a: "There is no universal best alternative. Express suits teams that need mature Node.js middleware, Fastify emphasizes performance and schema-based validation, and Bun and Deno are runtimes that can also host Hono. Choose based on deployment target, middleware needs, and team experience.",
    },
    {
      q: "Is Fastify a good alternative to Hono?",
      a: "Fastify is a strong option when you are standardized on Node.js and want a large plugin ecosystem with built-in schema validation. Hono is lighter and runs across more runtimes. Review the performance and plugin trade-offs in the Fastify vs Hono comparison.",
    },
    {
      q: "Should I migrate from Hono to Express?",
      a: "Migrate only if Express middleware, tooling, or team familiarity outweighs Hono's portability. Compare routing, middleware, and request handling in the Express vs Hono comparison before planning a migration.",
    },
    {
      q: "Which Hono alternative works on edge runtimes?",
      a: "Runtime support varies by framework. Hono itself targets multiple runtimes, while Express and NestJS are Node.js-first and Fastify is primarily Node.js-focused. Compare Deno and Bun options when edge or non-Node deployment is a requirement.",
    },
  ],
} as const;

const pathFor = (locale: string, tool: string) => `/${locale}/alternatives/${tool}`;

export function generateStaticParams() {
  return [{ locale: "en", tool: "hono" }];
}

export const dynamicParams = false;

function getAlternativeComparisons(): Comparison[] {
  return getComparisons("en")
    .filter((comparison) =>
      [comparison.toolA.name, comparison.toolB.name].some((name) =>
        /hono/iu.test(name),
      ),
    )
    .sort((left, right) =>
      `${left.toolA.name} vs ${left.toolB.name}`.localeCompare(
        `${right.toolA.name} vs ${right.toolB.name}`,
      ),
    );
}

function getSummary(verdict: string): string {
  const first = verdict.trim().split(/(?<=[.!?])\s+/u)[0] ?? verdict.trim();
  return first.length <= 220 ? first : `${first.slice(0, 217).trim()}.`;
}

export async function generateMetadata({
  params,
}: AlternativesPageProps): Promise<Metadata> {
  const { locale, tool } = await params;
  if (!isLocale(locale) || locale !== "en" || tool !== "hono") {
    return {};
  }

  const canonical = canonicalSiteUrl(pathFor(locale, tool));
  return {
    title: { absolute: pageCopy.title },
    description: pageCopy.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: pageCopy.title,
      description: pageCopy.description,
      url: canonical,
      siteName: "SnippetsLibrary",
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: pageCopy.title,
      description: pageCopy.description,
    },
  };
}

export default async function HonoAlternativesPage({
  params,
}: AlternativesPageProps) {
  const { locale, tool } = await params;
  if (!isLocale(locale) || locale !== "en" || tool !== "hono") {
    notFound();
  }

  const comparisons = getAlternativeComparisons();
  const pageUrl = canonicalSiteUrl(pathFor(locale, tool));
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: pageCopy.title,
        description: pageCopy.description,
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          name: "SnippetsLibrary",
          url: absoluteSiteUrl("/en"),
        },
        hasPart: comparisons.map((comparison) => ({
          "@type": "Article",
          name: `${comparison.toolA.name} vs ${comparison.toolB.name}`,
          url: canonicalSiteUrl(`/en/compare/${comparison.slug}`),
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        inLanguage: "en",
        mainEntity: pageCopy.faq.map((entry) => ({
          "@type": "Question",
          name: entry.q,
          acceptedAnswer: { "@type": "Answer", text: entry.a },
        })),
      },
    ],
  }).replace(/</gu, "\\u003c");

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600 dark:text-slate-300">
        <Link href="/en" className="underline-offset-4 hover:text-indigo-700 hover:underline dark:hover:text-indigo-300">
          Home
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page" className="font-medium text-slate-900 dark:text-white">
          Hono alternatives
        </span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Developer guide
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          {pageCopy.h1}
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
          {pageCopy.intro}
        </p>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          {pageCopy.introSecondary}
        </p>
      </header>

      <section aria-labelledby="alternatives-heading">
        <h2 id="alternatives-heading" className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {pageCopy.comparisonsHeading}
        </h2>
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
          {comparisons.map((comparison) => (
            <li key={comparison.slug} className="min-w-0">
              <Link
                href={`/en/compare/${comparison.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {comparison.toolA.name} vs {comparison.toolB.name}
                </span>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {getSummary(comparison.verdict)}
                </p>
                <span className="mt-4 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  {pageCopy.comparisonLabel} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="alternatives-faq" className="mt-12">
        <h2 id="alternatives-faq" className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {pageCopy.faqHeading}
        </h2>
        <div className="space-y-3">
          {pageCopy.faq.map((entry) => (
            <details
              key={entry.q}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-slate-900 dark:text-white">
                {entry.q}
              </summary>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                {entry.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
