"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface ComparisonViewToggleProps {
  quickContent: ReactNode;
  deepContent: ReactNode;
  labels: {
    navigation: string;
    quick: string;
    deep: string;
  };
}

type ViewMode = "quick" | "deep";

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
        className="mb-6 inline-flex max-w-full rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900"
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
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
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
        {quickContent}
      </div>
      <div
        id="comparison-view-deep-panel"
        role="tabpanel"
        aria-labelledby="comparison-view-deep-tab"
        hidden={activeView !== "deep"}
      >
        {deepContent}
      </div>
    </section>
  );
}
