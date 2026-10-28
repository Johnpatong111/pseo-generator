import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getComparisons, isLocale, LOCALES, type Locale } from "../../lib/comparisons";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "../../lib/locales";
import { absoluteSiteUrl, SITE_URL } from "../../lib/site-url";
import "../globals.css";

const comparisonSlugsByLocale: Record<Locale, string[]> = {
  pl: getComparisons("pl").map(({ slug }) => slug),
  en: getComparisons("en").map(({ slug }) => slug),
  es: getComparisons("es").map(({ slug }) => slug),
  de: getComparisons("de").map(({ slug }) => slug),
  fr: getComparisons("fr").map(({ slug }) => slug),
};

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
    verification: {
      google: "lym6T1Z2Y7UtjQHUfUw2h55uj4kV-x5QdHIkh7-ykV8",
    },
    alternates: {
      languages: {
        ...Object.fromEntries(
          LOCALES.map((option) => [option, absoluteSiteUrl(`/${option}`)]),
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
        <Header locale={locale} comparisonSlugsByLocale={comparisonSlugsByLocale} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
