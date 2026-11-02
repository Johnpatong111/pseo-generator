import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
        SnippetsLibrary
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Practical technology comparisons for developers.
      </p>
      <Link
        href="/en"
        className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
      >
        Explore comparisons
      </Link>
    </main>
  );
}
