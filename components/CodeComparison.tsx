"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface CodeComparisonProps {
  toolA: string;
  toolB: string;
  scenario: string;
  tech1Snippet: string;
  tech2Snippet: string;
  labels: {
    title: string;
    copy: string;
    copied: string;
    copyError: string;
  };
}

const codeTokenPattern =
  /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|import|from|export|default|async|await|new|class|extends|if|else|for|of|in|while|try|catch|throw|true|false|null|undefined|def|print|package|func|public|static|void|using|namespace|type|interface|struct|fn|mut|use|mod|pub)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*(?=\s*\())/g;

function highlightCode(source: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of source.matchAll(codeTokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(source.slice(lastIndex, index));
    }

    const className =
      token.startsWith("//") || token.startsWith("#") || token.startsWith("/*")
        ? "text-emerald-400"
        : /^["'`]/.test(token)
          ? "text-amber-300"
          : /^\d/.test(token)
            ? "text-orange-300"
            : /^(?:const|let|var|function|return|import|from|export|default|async|await|new|class|extends|if|else|for|of|in|while|try|catch|throw|true|false|null|undefined|def|print|package|func|public|static|void|using|namespace|type|interface|struct|fn|mut|use|mod|pub)$/.test(
                token,
              )
              ? "text-fuchsia-300"
              : "text-sky-300";

    parts.push(
      <span key={`${index}-${token}`} className={className}>
        {token}
      </span>,
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < source.length) {
    parts.push(source.slice(lastIndex));
  }

  return parts;
}

export default function CodeComparison({
  toolA,
  toolB,
  scenario,
  tech1Snippet,
  tech2Snippet,
  labels,
}: CodeComparisonProps) {
  const [activeTab, setActiveTab] = useState<"toolA" | "toolB">("toolA");
  const [copyStatus, setCopyStatus] = useState("");
  const activeTool = activeTab === "toolA" ? toolA : toolB;
  const activeSnippet = activeTab === "toolA" ? tech1Snippet : tech2Snippet;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(activeSnippet);
      setCopyStatus(labels.copied);
    } catch {
      setCopyStatus(labels.copyError);
    }
  }

  return (
    <section
      id="code-examples"
      aria-labelledby="code-comparison-title"
      className="mb-12 scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg dark:border-slate-800"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-5">
        <h2
          id="code-comparison-title"
          className="text-lg font-semibold tracking-tight text-white"
        >
          {labels.title}
        </h2>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="size-4"
          >
            <rect
              x="7"
              y="6"
              width="9"
              height="11"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M13 6V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v9A1.5 1.5 0 0 0 4.5 15H7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {labels.copy}
        </button>
      </div>
      <p className="border-b border-slate-800 px-4 py-3 text-sm leading-6 text-slate-300 sm:px-5">
        {scenario}
      </p>

      <div
        role="tablist"
        aria-label={labels.title}
        className="flex border-b border-slate-800 px-3 sm:px-4"
      >
        {[
          { id: "toolA" as const, name: toolA },
          { id: "toolB" as const, name: toolB },
        ].map(({ id, name }) => (
          <button
            key={id}
            id={`code-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls="code-panel"
            onClick={() => {
              setActiveTab(id);
              setCopyStatus("");
            }}
            className={`min-h-11 border-b-2 px-3 py-2 text-sm font-semibold transition sm:px-4 ${
              activeTab === id
                ? "border-indigo-400 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div
        id="code-panel"
        role="tabpanel"
        aria-labelledby={`code-tab-${activeTab}`}
        className="relative min-h-48 overflow-x-auto overscroll-x-contain p-4 sm:p-6"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {activeTool}
        </p>
        <pre className="overflow-x-auto text-sm leading-6 text-slate-100">
          <code>{highlightCode(activeSnippet)}</code>
        </pre>
      </div>

      <p aria-live="polite" className="min-h-8 px-5 pb-3 text-xs text-emerald-300">
        {copyStatus}
      </p>
    </section>
  );
}
