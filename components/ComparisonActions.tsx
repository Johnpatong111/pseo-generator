"use client";

import { useState } from "react";

interface ComparisonActionsProps {
  title: string;
  summary: string;
  labels: {
    copy: string;
    copied: string;
    copyError: string;
    shareX: string;
    shareLinkedIn: string;
  };
}

export default function ComparisonActions({
  title,
  summary,
  labels,
}: ComparisonActionsProps) {
  const [copyStatus, setCopyStatus] = useState("");

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(
        `${title}\n\n${summary}\n\n${window.location.href}`,
      );
      setCopyStatus(labels.copied);
    } catch {
      setCopyStatus(labels.copyError);
    }
  }

  function shareOnX() {
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    const shareText = `${title} — ${summary}`;
    shareUrl.searchParams.set(
      "text",
      shareText.length > 200 ? `${shareText.slice(0, 197)}...` : shareText,
    );
    shareUrl.searchParams.set("url", window.location.href);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  }

  function shareOnLinkedIn() {
    const shareUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
    shareUrl.searchParams.set("url", window.location.href);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copySummary}
        className="rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
      >
        {labels.copy}
      </button>
      <button
        type="button"
        onClick={shareOnX}
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {labels.shareX}
      </button>
      <button
        type="button"
        onClick={shareOnLinkedIn}
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {labels.shareLinkedIn}
      </button>
      <span aria-live="polite" className="text-sm text-slate-600 dark:text-slate-300">
        {copyStatus}
      </span>
    </div>
  );
}
