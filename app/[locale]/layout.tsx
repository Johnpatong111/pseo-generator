import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import type { SearchCategory, SearchComparison } from "../../components/CommandMenu";
import { getComparisons, isLocale, LOCALES, type Locale } from "../../lib/comparisons";
import { INDEXABLE_LOCALES, isIndexableLocale } from "../../lib/indexing";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "../../lib/locales";
import { absoluteSiteUrl, canonicalSiteUrl, SITE_URL } from "../../lib/site-url";
import { CATEGORY_IDS, categoryCopy } from "../../lib/taxonomy";
import "../globals.css";

const comparisonsByLocale: Record<Locale, ReturnType<typeof getComparisons>> =
  Object.fromEntries(
    LOCALES.map((option) => [option, getComparisons(option)]),
  ) as Record<Locale, ReturnType<typeof getComparisons>>;
const comparisonSlugsByLocale = Object.fromEntries(
  LOCALES.map((option) => [
    option,
    comparisonsByLocale[option].map(({ slug }) => slug),
  ]),
) as Record<Locale, string[]>;
const searchComparisons: SearchComparison[] = INDEXABLE_LOCALES.flatMap((option) =>
  comparisonsByLocale[option].map(({ slug, toolA, toolB }) => ({
    slug,
    label: `${toolA.name} vs ${toolB.name}`,
    locale: option,
  })),
);
const searchCategories: SearchCategory[] = INDEXABLE_LOCALES.flatMap((option) =>
  CATEGORY_IDS.map((id) => ({
    id,
    label: categoryCopy[option][id].name,
    locale: option,
  })),
);

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return {
    title: {
      default: `${BRAND_NAME} — ${BRAND_TAGLINE[locale]}`,
      template: `%s | ${BRAND_NAME}`,
    },
    description: BRAND_DESCRIPTION[locale],
    metadataBase: SITE_URL,
    robots: isIndexableLocale(locale)
      ? { index: true, follow: true }
      : { index: false, follow: true },
    verification: {
      google: "lym6T1Z2Y7UtjQHUfUw2h55uj4kV-x5QdHIkh7-ykV8",
    },
    alternates: {
      canonical: canonicalSiteUrl(`/${locale}`),
      languages: {
        ...Object.fromEntries(
          INDEXABLE_LOCALES.map((option) => [
            option,
            canonicalSiteUrl(`/${option}`),
          ]),
        ),
        "x-default": absoluteSiteUrl("/en"),
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        <Header
          locale={locale}
          comparisonSlugsByLocale={comparisonSlugsByLocale}
          searchComparisons={searchComparisons}
          searchCategories={searchCategories}
        />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
