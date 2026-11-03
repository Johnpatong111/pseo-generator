const HAS_ELLIPSIS = /(?:\.{3}|…)/u;
const ELLIPSIS_PATTERN = /(?:\.{3}|…)+/gu;
const TRAILING_ELLIPSIS = /(?:\.{3}|…)+["'”’)\]]?\s*$/u;
const SENTENCE_BOUNDARY = /[.!?](?=\s|$)/gu;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function lastSentenceBoundary(value: string): number {
  let lastBoundary = -1;
  for (const match of value.matchAll(SENTENCE_BOUNDARY)) {
    lastBoundary = (match.index ?? 0) + 1;
  }
  return lastBoundary;
}

/**
 * Removes incomplete fragments introduced by aggressive truncation. Text is
 * split on ellipses and only sentences that finish naturally are kept, so
 * cards and verdicts never display a dangling clause.
 */
export function completeSentence(value: string): string {
  const normalized = normalizeWhitespace(value);
  if (!HAS_ELLIPSIS.test(normalized)) {
    return normalized;
  }

  if (TRAILING_ELLIPSIS.test(normalized)) {
    const withoutEllipsis = normalized
      .replace(TRAILING_ELLIPSIS, "")
      .replace(/[\s,;:\-]+$/u, "")
      .trim();
    const boundary = lastSentenceBoundary(withoutEllipsis);
    return boundary > 0
      ? withoutEllipsis.slice(0, boundary).trim()
      : `${withoutEllipsis}.`;
  }

  const segments = normalized
    .split(ELLIPSIS_PATTERN)
    .map((segment) => segment.replace(/[\s,;:\-]+$/u, "").trim())
    .filter(Boolean);

  const completed = segments
    .map((segment, index) => {
      if (/[.!?]$/u.test(segment)) {
        return segment;
      }

      const boundary = lastSentenceBoundary(segment);
      if (boundary > 0) {
        return segment.slice(0, boundary).trim();
      }

      return index === segments.length - 1 ? `${segment}.` : "";
    })
    .filter(Boolean);

  const result = normalizeWhitespace(completed.join(" "));
  if (result) {
    return result;
  }

  return normalized.replace(ELLIPSIS_PATTERN, ".").replace(/\.{2,}/gu, ".");
}

