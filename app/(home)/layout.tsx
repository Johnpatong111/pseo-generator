import type { Metadata } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "../../lib/locales";
import { SITE_URL } from "../../lib/site-url";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — ${BRAND_TAGLINE.en}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION.en,
  metadataBase: SITE_URL,
  verification: {
    google: "lym6T1Z2Y7UtjQHUfUw2h55uj4kV-x5QdHIkh7-ykV8",
  },
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
