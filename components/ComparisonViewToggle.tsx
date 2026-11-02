"use client";

import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import ComparisonMatcher from "./ComparisonMatcher";
import type { ComparisonCriterion } from "../lib/comparisons";

interface ComparisonViewToggleProps {
  quickContent: QuickContent;
  deepContent: ReactNode;
  labels: {
    navigation: string;
    quick: string;
    deep: string;
  };
}

type ViewMode = "quick" | "deep";

interface QuickContent {
  summary: string;
  toolA: string;
  toolB: string;
  criteria: ComparisonCriterion[];
  matcherCriteria: Pick<ComparisonCriterion, "category" | "winner">[];
  decisionA?: string;
  decisionB?: string;
  labels: {
    quickVerdict: string;
    details: string;
    decision: string;
    chooseIf: string;
    criterion: string;
    advantage: string;
    tie: string;
  };
  matcherLabels: ComponentProps<typeof ComparisonMatcher>["labels"];
}

export default function ComparisonViewToggle({
  quickContent,
  deepContent,
  labels,
}: ComparisonViewToggleProps) {
  const [activeView, setActiveView] = useState<ViewMode>("deep");

  return (
    <section className="mb-10">
      <div
        role="tablist"
        aria-label={labels.navigation}
        className="mb-6 flex w-full max-w-full rounded-xl border border-slate-200 bg-slate-100 p-1 sm:inline-flex sm:w-auto dark:border-slate-800 dark:bg-slate-900"
      >
        {(["quick", "deep"] as const).map((view) => (
          <button
            key={view}
            id={`comparison-view-${view}-tab`}
            type="button"
            role="tab"
            aria-selected={activeView === view}
            aria-controls={`comparison-view-${view}-panel`}
            onClick={() => setActiveView(view)}
            className={`min-h-11 min-w-0 flex-1 whitespace-nowrap rounded-lg px-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-none sm:px-4 sm:text-sm ${
              activeView === view
                ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {labels[view]}
          </button>
        ))}
      </div>

      <div
        id="comparison-view-quick-panel"
        role="tabpanel"
        aria-labelledby="comparison-view-quick-tab"
        hidden={activeView !== "quick"}
      >
        {activeView === "quick" && (
          <div className="space-y-8">
            <section
              aria-labelledby="quick-summary-heading"
              className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-8"
            >
              <h2
                id="quick-summary-heading"
                className="text-xl font-semibold text-slate-900 dark:text-white"
              >
                {quickContent.labels.quickVerdict}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200">
                {quickContent.summary}
              </p>
            </section>

            <section aria-labelledby="quick-key-criteria-heading">
              <h2
                id="quick-key-criteria-heading"
                className="mb-4 text-xl font-semibold text-slate-900 dark:text-white"
              >
                {quickContent.labels.details}
              </h2>
              <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900">
                    <tr>
                      <th scope="col" className="p-3 font-semibold sm:p-4">
                        {quickContent.labels.criterion}
                      </th>
                      <th scope="col" className="p-3 font-semibold sm:p-4">
                        {quickContent.toolA}
                      </th>
                      <th scope="col" className="p-3 font-semibold sm:p-4">
                        {quickContent.toolB}
                      </th>
                      <th scope="col" className="p-3 font-semibold sm:p-4">
                        {quickContent.labels.advantage}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickContent.criteria.map((criterion) => (
                      <tr
                        key={criterion.category}
                        className="border-t border-slate-200 align-top dark:border-slate-800"
                      >
                        <th scope="row" className="p-3 font-medium sm:p-4">
                          {criterion.category}
                        </th>
                        <td className="p-3 leading-6 text-slate-600 sm:p-4 dark:text-slate-300">
                          {criterion.toolA}
                        </td>
                        <td className="p-3 leading-6 text-slate-600 sm:p-4 dark:text-slate-300">
                          {criterion.toolB}
                        </td>
                        <td className="p-3 font-medium text-indigo-700 sm:p-4 dark:text-indigo-300">
                          {criterion.winner === "tie"
                            ? quickContent.labels.tie
                            : criterion.winner === "toolA"
                              ? quickContent.toolA
                              : quickContent.toolB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="quick-decision-heading" className="scroll-mt-24">
              <h2
                id="quick-decision-heading"
                className="mb-5 text-xl font-semibold text-slate-900 dark:text-white"
              >
                {quickContent.labels.decision}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  { name: quickContent.toolA, recommendation: quickContent.decisionA },
                  { name: quickContent.toolB, recommendation: quickContent.decisionB },
                ].map(({ name, recommendation }) => (
                  <article
                    key={name}
                    className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {quickContent.labels.chooseIf} {name}
                    </h3>
                    {recommendation && (
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {recommendation}
                      </p>
                    )}
                  </article>
                ))}
              </div>
              <div className="mt-6">
                <ComparisonMatcher
                  toolA={quickContent.toolA}
                  toolB={quickContent.toolB}
                  criteria={quickContent.matcherCriteria}
                  labels={quickContent.matcherLabels}
                />
              </div>
            </section>
          </div>
        )}
      </div>
      <div
        id="comparison-view-deep-panel"
        role="tabpanel"
        aria-labelledby="comparison-view-deep-tab"
        hidden={activeView !== "deep"}
      >
        {activeView === "deep" && deepContent}
      </div>
    </section>
  );
}
