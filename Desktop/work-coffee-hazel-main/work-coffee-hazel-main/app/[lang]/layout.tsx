import type { Metadata } from 'next'
import '../globals.css' // dostosuj ścieżkę do plików stylów CSS, jeśli jest inna

export const metadata: Metadata = {
  title: 'Work & Coffee — Kawiarnie do pracy i spotkań',
  description: 'Znajdź najlepsze kawiarnie do pracy z laptopem i spotkań na Costa Blanca.',
}

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params

  return (
    <html lang={lang}>
      <body className="bg-[#171614] text-[#f5f0e8] min-h-screen flex flex-col antialiased">
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  )
}