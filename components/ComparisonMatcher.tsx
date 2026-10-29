"use client";

import { useId, useMemo, useState } from "react";
import type { ComparisonCriterion } from "../lib/comparisons";

type Priority = "performance" | "cost" | "deployment";

interface ComparisonMatcherProps {
  toolA: string;
  toolB: string;
  criteria: ComparisonCriterion[];
  labels: {
    title: string;
    description: string;
    performance: string;
    cost: string;
    deployment: string;
    fit: string;
    recommended: string;
    balanced: string;
    noEvidence: string;
    noPriorities: string;
    percent: string;
  };
}

const priorityPatterns: Record<Priority, RegExp> = {
  performance:
    /performance|rendimiento|wydajno|leistung|latency|latenz|latence|throughput|debit|speed|velocidad|schnelligkeit|benchmark|response time|opozn/i,
  cost:
    /cost|pricing|price|precio|coste|costo|kosten|preis|cout|tarif|koszt|cena|precios|preisgestaltung/i,
  deployment:
    /deployment|deploy|implementation|integration|setup|installation|hosting|migration|wdroz|integrac|konfigur|bereitstellung|implementierung|einrichtung|deploiement|mise en place|despliegue|implementacion|instalacion/i,
};

const priorities: Priority[] = ["performance", "cost", "deployment"];

function matchesPriority(category: string, priority: Priority): boolean {
  const heading = category
    .split(/[.!?]/, 1)[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return priorityPatterns[priority].test(heading);
}

export default function ComparisonMatcher({
  toolA,
  toolB,
  criteria,
  labels,
}: ComparisonMatcherProps) {
  const matcherId = useId();
  const [weights, setWeights] = useState<Record<Priority, number>>({
    performance: 50,
    cost: 50,
    deployment: 50,
  });

  const result = useMemo(() => {
    const evidence: Record<Priority, ComparisonCriterion[]> = {
      performance: criteria.filter((criterion) =>
        matchesPriority(criterion.category, "performance"),
      ),
      cost: criteria.filter((criterion) =>
        matchesPriority(criterion.category, "cost"),
      ),
      deployment: criteria.filter((criterion) =>
        matchesPriority(criterion.category, "deployment"),
      ),
    };

    const availablePriorities = priorities.filter(
      (priority) => evidence[priority].length > 0 && weights[priority] > 0,
    );
    const totalWeight = availablePriorities.reduce(
      (total, priority) => total + weights[priority],
      0,
    );

    if (totalWeight === 0) {
      return { toolAScore: null, toolBScore: null };
    }

    const toolAScore = Math.round(
      availablePriorities.reduce((total, priority) => {
        const criteriaForPriority = evidence[priority];
        const average =
          criteriaForPriority.reduce(
            (score, criterion) =>
              score +
              (criterion.winner === "toolA"
                ? 100
                : criterion.winner === "tie"
                  ? 50
                  : 0),
            0,
          ) / criteriaForPriority.length;
        return total + average * weights[priority];
      }, 0) / totalWeight,
    );

    return { toolAScore, toolBScore: 100 - toolAScore };
  }, [criteria, weights]);

  const recommendation =
    result.toolAScore === null || result.toolBScore === null
      ? labels.noPriorities
      : result.toolAScore === result.toolBScore
        ? labels.balanced
        : `${labels.recommended} ${
            result.toolAScore > result.toolBScore ? toolA : toolB
          }`;

  return (
    <section
      aria-labelledby={`${matcherId}-title`}
      className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-8"
    >
      <div className="mb-6">
        <h2
          id={`${matcherId}-title`}
          className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          {labels.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          {labels.description}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {priorities.map((priority) => (
          <label key={priority} className="block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <span>{labels[priority]}</span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                {weights[priority]}%
              </span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights[priority]}
              onChange={(event) =>
                setWeights((current) => ({
                  ...current,
                  [priority]: Number(event.target.value),
                }))
              }
              aria-label={labels[priority]}
              className="h-11 w-full cursor-pointer touch-pan-y accent-indigo-600"
            />
            {criteria.every(
              (criterion) =>
                !matchesPriority(criterion.category, priority),
            ) && (
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                {labels.noEvidence}
              </span>
            )}
          </label>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-6 rounded-xl border border-white/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"
      >
        <p className="font-semibold text-slate-900 dark:text-white">
          {recommendation}
        </p>
        {result.toolAScore !== null && result.toolBScore !== null && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { name: toolA, score: result.toolAScore, color: "bg-indigo-600" },
              { name: toolB, score: result.toolBScore, color: "bg-violet-500" },
            ].map(({ name, score, color }) => (
              <div key={name}>
                <div className="mb-1 flex justify-between gap-2 text-sm">
                  <span className="min-w-0 break-words font-medium text-slate-700 dark:text-slate-200">
                    {name} {labels.fit}
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {score}{labels.percent}
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`${name}: ${score}${labels.percent}`}
                  className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <span
                    className={`block h-full ${color}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
