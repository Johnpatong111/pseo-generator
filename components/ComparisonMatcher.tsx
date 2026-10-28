"use client";

import { useMemo, useState } from "react";
import type { ComparisonCriterion } from "../lib/comparisons";

type Priority = "performance" | "usability" | "scalability";

interface ComparisonMatcherProps {
  toolA: string;
  toolB: string;
  criteria: ComparisonCriterion[];
  labels: {
    title: string;
    description: string;
    performance: string;
    usability: string;
    scalability: string;
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
    /performance|rendimiento|wydajno|leistung|latency|latenz|latence|throughput|debit|speed|velocidad|schnelligkeit|benchmark|response time|opóźn|opcion|latência/i,
  usability:
    /learning curve|developer experience|ease of use|usability|facilidad|curva de aprendizaje|experiencia de desarrollo|łatwość|krzywa uczenia|ergonom|simplicity|simplicidad|einstieg|benutzerfreund|courbe d’apprentissage|facilité d’utilisation/i,
  scalability:
    /scalability|scalable|scaling|scale|escalabilidad|escalable|skalierbarkeit|skalier|évolutivité|mise à l’échelle|skala|skalowal|high availability|availability|distribution|concurrency|deployment|infrastructure|infraestructura|bereitstellung|déploiement|wdrożen|dostępność/i,
};

const priorities: Priority[] = ["performance", "usability", "scalability"];

export default function ComparisonMatcher({
  toolA,
  toolB,
  criteria,
  labels,
}: ComparisonMatcherProps) {
  const [weights, setWeights] = useState<Record<Priority, number>>({
    performance: 50,
    usability: 50,
    scalability: 50,
  });

  const result = useMemo(() => {
    const evidence: Record<Priority, ComparisonCriterion[]> = {
      performance: criteria.filter((criterion) =>
        priorityPatterns.performance.test(criterion.category),
      ),
      usability: criteria.filter((criterion) =>
        priorityPatterns.usability.test(criterion.category),
      ),
      scalability: criteria.filter((criterion) =>
        priorityPatterns.scalability.test(criterion.category),
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
      aria-labelledby="comparison-matcher-title"
      className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-8"
    >
      <div className="mb-6">
        <h2
          id="comparison-matcher-title"
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
              className="h-2 w-full cursor-pointer accent-indigo-600"
            />
            {criteria.every(
              (criterion) =>
                !priorityPatterns[priority].test(criterion.category),
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
        className="mt-6 rounded-xl border border-white/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
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
                  <span className="font-medium text-slate-700 dark:text-slate-200">
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
