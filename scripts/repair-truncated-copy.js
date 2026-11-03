"use strict";

/**
 * Rebuilds truncated introduction / quick verdict / decision framework copy
 * from the structured comparison criteria. Run with `npm run copy:repair`.
 */

const { readdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");

const dataRoot = path.resolve(__dirname, "..", "data");
const locales = ["en", "es", "de", "fr", "pl"];
const ELLIPSIS = String.fromCharCode(8230);

function firstSentence(value) {
  const sentence = value.trim().split(/(?<=[.!?])\s+/u)[0];
  if (!sentence) throw new Error("Cannot derive editorial content from empty text.");

  const cleaned = sentence.replace(new RegExp(`(?:${ELLIPSIS}|\\.\\.\\.)+\\s*$`, "u"), "");
  return /[.!?]$/u.test(cleaned) ? cleaned : `${cleaned}.`;
}

function trimToSentences(value, limit) {
  if (value.length <= limit) return value;

  const sentences = value.match(/[^.!?]+[.!?]+/gu) ?? [value];
  let result = "";
  for (const sentence of sentences) {
    const candidate = `${result} ${sentence}`.trim();
    if (candidate.length > limit) break;
    result = candidate;
  }

  return result || sentences[0].trim();
}

function criterionLabel(value) {
  const label = firstSentence(value).replace(/[.!?]\s*$/u, "");
  if (label.length <= 80) return label;

  const shortened = label.slice(0, 81);
  return shortened.slice(0, shortened.lastIndexOf(" ")).trim();
}

function getDecisionFramework(comparison, locale) {
  const rows = comparison.comparison;
  const toolARow = rows.find((row) => row.winner === "toolA") ?? rows[0];
  const toolBRow = rows.find((row) => row.winner === "toolB") ?? rows[1] ?? rows[0];
  const templates = {
    pl: (row, tool) =>
      `projekt stawia na kryterium „${criterionLabel(row.category)}”: ${firstSentence(row[tool])}`,
    en: (row, tool) =>
      `your project prioritizes ${criterionLabel(row.category).toLowerCase()}: ${firstSentence(row[tool])}`,
    es: (row, tool) =>
      `tu proyecto prioriza ${criterionLabel(row.category).toLowerCase()}: ${firstSentence(row[tool])}`,
    de: (row, tool) =>
      `dein Projekt priorisiert ${criterionLabel(row.category)}: ${firstSentence(row[tool])}`,
    fr: (row, tool) =>
      `votre projet privilégie ${criterionLabel(row.category).toLowerCase()} : ${firstSentence(row[tool])}`,
  };
  return {
    toolA: templates[locale](toolARow, "toolA"),
    toolB: templates[locale](toolBRow, "toolB"),
  };
}

function getIntroduction(comparison, locale) {
  const [first, second] = comparison.comparison;
  const toolAReason = firstSentence(first.toolA);
  const toolBReason = firstSentence(first.toolB);
  const nextDifference = firstSentence(second.toolA);
  const templates = {
    pl: `${comparison.toolA.name} i ${comparison.toolB.name} odpowiadają na podobną potrzebę, ale różnią się w obszarze ${criterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} Kolejną istotną różnicę pokazuje kryterium „${criterionLabel(second.category)}”: ${nextDifference} Wybór zależy od obciążenia, istniejącej architektury i ograniczeń konkretnego wdrożenia.`,
    en: `${comparison.toolA.name} and ${comparison.toolB.name} address a related need, but differ in ${criterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} The ${criterionLabel(second.category).toLowerCase()} criterion adds another practical distinction: ${nextDifference} The right choice depends on workload, existing architecture, and deployment constraints.`,
    es: `${comparison.toolA.name} y ${comparison.toolB.name} responden a una necesidad similar, pero difieren en ${criterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} El criterio de ${criterionLabel(second.category).toLowerCase()} añade otra diferencia práctica: ${nextDifference} La elección depende de la carga, la arquitectura existente y las restricciones del despliegue.`,
    de: `${comparison.toolA.name} und ${comparison.toolB.name} lösen ein ähnliches Problem, unterscheiden sich jedoch bei ${criterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name}: ${toolAReason} ${comparison.toolB.name}: ${toolBReason} Das Kriterium ${criterionLabel(second.category).toLowerCase()} zeigt einen weiteren praktischen Unterschied: ${nextDifference} Die passende Wahl hängt von Arbeitslast, bestehender Architektur und Bereitstellungsvorgaben ab.`,
    fr: `${comparison.toolA.name} et ${comparison.toolB.name} répondent à un besoin proche, mais diffèrent sur ${criterionLabel(first.category).toLowerCase()}. ${comparison.toolA.name} : ${toolAReason} ${comparison.toolB.name} : ${toolBReason} Le critère « ${criterionLabel(second.category)} » met en évidence une autre différence pratique : ${nextDifference} Le choix dépend de la charge, de l’architecture existante et des contraintes de déploiement.`,
  };
  return trimToSentences(templates[locale], 800);
}

function getQuickVerdict(comparison, locale, decisionFramework) {
  const toolAReason = decisionFramework.toolA.replace(/[.!?]\s*$/u, "");
  const toolBReason = decisionFramework.toolB.replace(/[.!?]\s*$/u, "");
  const templates = {
    pl: `${comparison.toolA.name} będzie lepszy, gdy ${toolAReason}. ${comparison.toolB.name} sprawdzi się, gdy ${toolBReason}.`,
    en: `${comparison.toolA.name} is the better fit when ${toolAReason}. ${comparison.toolB.name} is a stronger fit when ${toolBReason}.`,
    es: `${comparison.toolA.name} encaja mejor cuando ${toolAReason}. ${comparison.toolB.name} es preferible cuando ${toolBReason}.`,
    de: `${comparison.toolA.name} passt besser, wenn ${toolAReason}. ${comparison.toolB.name} ist geeigneter, wenn ${toolBReason}.`,
    fr: `${comparison.toolA.name} convient mieux lorsque ${toolAReason}. ${comparison.toolB.name} est préférable lorsque ${toolBReason}.`,
  };
  return templates[locale];
}

function hasEllipsis(value) {
  return typeof value === "string" && value.includes(ELLIPSIS);
}

function repairFile(filePath, locale) {
  const original = JSON.parse(readFileSync(filePath, "utf8"));
  const decisionFramework = getDecisionFramework(original, locale);
  const introduction = getIntroduction(original, locale);
  const quickVerdict = getQuickVerdict(original, locale, decisionFramework);
  const repaired = {
    ...original,
    introduction,
    quickVerdict,
    decisionFramework,
  };

  if (
    introduction.length < 180 ||
    introduction.length > 800 ||
    quickVerdict.length < 80 ||
    decisionFramework.toolA.length < 80 ||
    decisionFramework.toolA.length > 500 ||
    decisionFramework.toolB.length < 80 ||
    decisionFramework.toolB.length > 500
  ) {
    throw new Error(`Repaired copy is outside the allowed length in ${filePath}.`);
  }
  if (
    hasEllipsis(introduction) ||
    hasEllipsis(quickVerdict) ||
    hasEllipsis(decisionFramework.toolA) ||
    hasEllipsis(decisionFramework.toolB)
  ) {
    throw new Error(`Ellipsis still present after repair in ${filePath}.`);
  }

  writeFileSync(filePath, `${JSON.stringify(repaired, null, 2)}\n`, "utf8");
  return 1;
}

let repaired = 0;
for (const locale of locales) {
  for (const fileName of readdirSync(path.join(dataRoot, locale))) {
    if (!fileName.endsWith(".json")) continue;
    const filePath = path.join(dataRoot, locale, fileName);
    const comparison = JSON.parse(readFileSync(filePath, "utf8"));
    if (!Array.isArray(comparison.comparison) || comparison.comparison.length < 2) {
      continue;
    }
    repaired += repairFile(filePath, locale);
  }
}

console.log(`[copy] Repaired truncated editorial copy in ${repaired} comparison files.`);

