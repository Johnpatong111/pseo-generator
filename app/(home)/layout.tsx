import type { Metadata } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "../../lib/locales";
import { SITE_URL } from "../../lib/site-url";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — ${BRAND_TAGLINE.pl}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION.pl,
  metadataBase: SITE_URL,
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
