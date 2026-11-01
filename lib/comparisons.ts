import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createCodeExamples, scenarios } from "./snippet-catalog.cjs";
import { getComparisonCategories } from "./taxonomy";
import { LOCALES, type Locale } from "./locales";

export { LOCALES };
export type { Locale };

export type ComparisonWinner = "toolA" | "toolB" | "tie";

export interface ComparisonCriterion {
  category: string;
  toolA: string;
  toolB: string;
  winner: ComparisonWinner;
}

export interface ComparisonFaq {
  q: string;
  a: string;
}

export interface ComparisonCodeExamples {
  scenario: string;
  tech1Snippet: string;
  tech2Snippet: string;
}

export interface ComparisonTradeoff {
  category: string;
  toolA: string;
  toolB: string;
}

export interface ComparisonDecisionFramework {
  toolA: string;
  toolB: string;
}

export interface Comparison {
  slug: string;
  locale: Locale;
  meta: {
    title: string;
    description: string;
  };
  toolA: {
    name: string;
  };
  toolB: {
    name: string;
  };
  verdict: string;
  introduction?: string;
  heroSubtitle: string;
  quickVerdict: string;
  decisionFramework?: ComparisonDecisionFramework;
  comparison?: ComparisonCriterion[];
  tradeoffs: ComparisonTradeoff[];
  codeExamples?: ComparisonCodeExamples;
  faq: ComparisonFaq[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, field: string, fileName: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`Expected "${field}" to be a non-empty string in ${fileName}.`);
  }

  return value;
}

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

function parseComparison(value: unknown, fileName: string, locale: Locale): Comparison {
  if (!isRecord(value) || !isRecord(value.meta) || !isRecord(value.toolA) || !isRecord(value.toolB)) {
    throw new TypeError(`Invalid comparison data in ${fileName}.`);
  }

  if (!Array.isArray(value.faq)) {
    throw new TypeError(`Expected "faq" to be an array in ${fileName}.`);
  }

  const faq = value.faq.map((item, index) => {
    if (!isRecord(item)) {
      throw new TypeError(`Invalid FAQ entry ${index} in ${fileName}.`);
    }

    return {
      q: requireString(item.q, `faq[${index}].q`, fileName),
      a: requireString(item.a, `faq[${index}].a`, fileName),
    };
  });

  let tradeoffs: ComparisonTradeoff[] | undefined;
  if (value.tradeoffs !== undefined) {
    if (!Array.isArray(value.tradeoffs)) {
      throw new TypeError(`Expected "tradeoffs" to be an array in ${fileName}.`);
    }

    tradeoffs = value.tradeoffs.map((item, index) => {
      if (!isRecord(item)) {
        throw new TypeError(`Invalid trade-off ${index} in ${fileName}.`);
      }

      return {
        category: requireString(item.category, `tradeoffs[${index}].category`, fileName),
        toolA: requireString(item.toolA, `tradeoffs[${index}].toolA`, fileName),
        toolB: requireString(item.toolB, `tradeoffs[${index}].toolB`, fileName),
      };
    });
  }

  let comparison: ComparisonCriterion[] | undefined;
  if (value.comparison !== undefined) {
    if (!Array.isArray(value.comparison)) {
      throw new TypeError(`Expected "comparison" to be an array in ${fileName}.`);
    }

    comparison = value.comparison.map((item, index) => {
      if (
        !isRecord(item) ||
        (item.winner !== "toolA" && item.winner !== "toolB" && item.winner !== "tie")
      ) {
        throw new TypeError(`Invalid comparison criterion ${index} in ${fileName}.`);
      }

      return {
        category: requireString(item.category, `comparison[${index}].category`, fileName),
        toolA: requireString(item.toolA, `comparison[${index}].toolA`, fileName),
        toolB: requireString(item.toolB, `comparison[${index}].toolB`, fileName),
        winner: item.winner,
      };
    });
  }

  let codeExamples: ComparisonCodeExamples | undefined;
  if (value.codeExamples !== undefined) {
    if (!isRecord(value.codeExamples)) {
      throw new TypeError(`Expected "codeExamples" to be an object in ${fileName}.`);
    }

    codeExamples = {
      scenario:
        value.codeExamples.scenario === undefined
          ? scenarios[locale]
          : requireString(value.codeExamples.scenario, "codeExamples.scenario", fileName),
      tech1Snippet: requireString(
        value.codeExamples.tech1Snippet,
        "codeExamples.tech1Snippet",
        fileName,
      ),
      tech2Snippet: requireString(
        value.codeExamples.tech2Snippet,
        "codeExamples.tech2Snippet",
        fileName,
      ),
    };
  }

  let decisionFramework: ComparisonDecisionFramework | undefined;
  if (value.decisionFramework !== undefined) {
    if (!isRecord(value.decisionFramework)) {
      throw new TypeError(`Expected "decisionFramework" to be an object in ${fileName}.`);
    }

    decisionFramework = {
      toolA: requireString(
        value.decisionFramework.toolA,
        "decisionFramework.toolA",
        fileName,
      ),
      toolB: requireString(
        value.decisionFramework.toolB,
        "decisionFramework.toolB",
        fileName,
      ),
    };
  }

  return {
    slug: requireString(value.slug, "slug", fileName),
    locale,
    meta: {
      title: requireString(value.meta.title, "meta.title", fileName),
      description: requireString(value.meta.description, "meta.description", fileName),
    },
    toolA: {
      name: requireString(value.toolA.name, "toolA.name", fileName),
    },
    toolB: {
      name: requireString(value.toolB.name, "toolB.name", fileName),
    },
    verdict: requireString(value.verdict, "verdict", fileName),
    introduction:
      value.introduction === undefined
        ? undefined
        : requireString(value.introduction, "introduction", fileName),
    heroSubtitle:
      value.heroSubtitle === undefined
        ? requireString(value.introduction ?? value.meta.description, "heroSubtitle", fileName)
        : requireString(value.heroSubtitle, "heroSubtitle", fileName),
    quickVerdict:
      value.quickVerdict === undefined
        ? requireString(value.verdict, "quickVerdict", fileName)
        : requireString(value.quickVerdict, "quickVerdict", fileName),
    decisionFramework,
    comparison,
    tradeoffs:
      tradeoffs ??
      (comparison ?? []).map(({ category, toolA, toolB }) => ({
        category,
        toolA: toolA.split(/(?<=[.!?])\s+/u)[0],
        toolB: toolB.split(/(?<=[.!?])\s+/u)[0],
      })),
    codeExamples,
    faq,
  };
}

function readComparisons(directory: string, locale: Locale): Comparison[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .map((fileName) => {
      const comparison = parseComparison(
        JSON.parse(readFileSync(join(directory, fileName), "utf8")) as unknown,
        fileName,
        locale,
      );

      if (comparison.slug !== fileName.slice(0, -".json".length)) {
        throw new TypeError(`Comparison slug does not match filename ${fileName}.`);
      }

      return comparison;
    });
}

export function getComparisons(locale: Locale = "en"): Comparison[] {
  return readComparisons(join(process.cwd(), "data", locale), locale).sort(
    (left, right) => left.slug.localeCompare(right.slug),
  );
}

export function getLocalizedComparisons(locale: Locale): Comparison[] {
  return readComparisons(join(process.cwd(), "data", locale), locale).sort(
    (left, right) => left.slug.localeCompare(right.slug),
  );
}

export function getComparisonBySlug(
  slug: string,
  locale: Locale = "en",
): Comparison | undefined {
  return getComparisons(locale).find((comparison) => comparison.slug === slug);
}

export function isIndexableComparison(comparison: Comparison): boolean {
  return (
    comparison.meta.title.trim().length > 20 &&
    comparison.meta.description.trim().length >= 100 &&
    comparison.heroSubtitle.trim().length >= 60 &&
    comparison.quickVerdict.trim().length >= 80 &&
    (comparison.comparison?.length ?? 0) >= 6 &&
    comparison.tradeoffs.length >= 4 &&
    comparison.faq.length >= 5
  );
}

export function getComparisonCodeExamples(
  comparison: Comparison,
): ComparisonCodeExamples {
  if (comparison.codeExamples) {
    return comparison.codeExamples;
  }

  const category = getComparisonCategories(comparison.slug)[0] ?? "general";
  return {
    scenario: scenarios[comparison.locale],
    ...createCodeExamples(comparison.slug, category),
  };
}
