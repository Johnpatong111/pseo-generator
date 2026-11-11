import type { Locale } from "./locales";

export const BRAND_NAME: string;
export const CURRENT_YEAR: number;
export const SEO_DESCRIPTION_MAX: number;
export const SEO_TITLE_MAX: number;

export function getComparisonSeoTitle(
  toolA: string,
  toolB: string,
  locale?: Locale,
): string;

export function getComparisonDocumentTitle(
  toolA: string,
  toolB: string,
  locale?: Locale,
): string;

export function getComparisonSeoDescription(
  toolA: string,
  toolB: string,
  category?: string,
  locale?: Locale,
): string;

export function getComparisonMeta(
  toolA: string,
  toolB: string,
  category?: string,
  locale?: Locale,
  slug?: string,
): {
  title: string;
  documentTitle: string;
  description: string;
};

export function truncateAtWord(text: string, maxLength: number): string;
