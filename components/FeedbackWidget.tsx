"use client";

import { useEffect, useId, useState } from "react";

interface FeedbackWidgetProps {
  storageKey: string;
  labels: {
    question: string;
    helpful: string;
    notHelpful: string;
    thankYou: string;
    storageWarning: string;
  };
}

type FeedbackVote = "helpful" | "not-helpful";

export default function FeedbackWidget({
  storageKey,
  labels,
}: FeedbackWidgetProps) {
  const widgetId = useId();
  const [vote, setVote] = useState<FeedbackVote | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    try {
      const savedVote = window.localStorage.getItem(storageKey);
      if (savedVote === "helpful" || savedVote === "not-helpful") {
        setVote(savedVote);
      }
    } catch {
      setStorageWarning(true);
    }
  }, [storageKey]);

  function submitVote(selectedVote: FeedbackVote) {
    if (vote) return;

    try {
      window.localStorage.setItem(storageKey, selectedVote);
    } catch {
      setStorageWarning(true);
    }
    setVote(selectedVote);
  }

  return (
    <section
      aria-labelledby={`${widgetId}-question`}
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      {vote ? (
        <div aria-live="polite">
          <p className="font-semibold text-slate-900 dark:text-white">
            {labels.thankYou}
          </p>
          {storageWarning && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {labels.storageWarning}
            </p>
          )}
        </div>
      ) : (
        <>
          <h2
            id={`${widgetId}-question`}
            className="font-semibold text-slate-900 dark:text-white"
          >
            {labels.question}
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitVote("helpful")}
              aria-label={labels.helpful}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
            >
              <span aria-hidden="true">👍</span>
              {labels.helpful}
            </button>
            <button
              type="button"
              onClick={() => submitVote("not-helpful")}
              aria-label={labels.notHelpful}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
            >
              <span aria-hidden="true">👎</span>
              {labels.notHelpful}
            </button>
          </div>
          {storageWarning && (
            <p
              role="status"
              className="mt-3 text-sm text-slate-500 dark:text-slate-400"
            >
              {labels.storageWarning}
            </p>
          )}
        </>
      )}
    </section>
  );
}
