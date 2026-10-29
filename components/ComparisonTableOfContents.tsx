"use client";

import {
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

export interface TableOfContentsSection {
  id: string;
  label: string;
}

interface ComparisonTableOfContentsProps {
  title: string;
  sections: TableOfContentsSection[];
}

export default function ComparisonTableOfContents({
  title,
  sections,
}: ComparisonTableOfContentsProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const visibleSections = sections
          .map(({ id }) => document.getElementById(id))
          .filter(
            (element): element is HTMLElement =>
              element instanceof HTMLElement && element.getClientRects().length > 0,
          );
        const currentSection = visibleSections.reduce<HTMLElement | undefined>(
          (active, element) =>
            element.getBoundingClientRect().top <= 160 ? element : active,
          undefined,
        );
        setActiveId(currentSection?.id ?? visibleSections[0]?.id ?? "");
      });
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    const deepPanel = document.getElementById("comparison-view-deep-panel");
    const panelObserver = new MutationObserver(updateActiveSection);
    if (deepPanel) {
      panelObserver.observe(deepPanel, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      panelObserver.disconnect();
    };
  }, [sections]);

  function navigateToSection(
    event: ReactMouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", `#${id}`);
    setActiveId(id);
  }

  return (
    <nav
      aria-label={title}
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <ol className="space-y-2.5">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(event) => navigateToSection(event, id)}
              aria-current={activeId === id ? "location" : undefined}
              className={`block rounded-md text-sm leading-5 underline-offset-4 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                activeId === id
                  ? "font-semibold text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-300"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
