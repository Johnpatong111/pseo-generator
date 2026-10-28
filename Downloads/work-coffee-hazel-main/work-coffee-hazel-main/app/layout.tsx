import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kawiarnie Costa Blanca | Work & Coffee',
  description: 'Znajdź najlepsze kawiarnie w Torrevieja i Alicante. Sprawdź adres, godziny otwarcia, języki obsługi, charakter miejsca i dostępność Wi-Fi na Costa Blanca.',
  keywords: ['kawiarnie Torrevieja', 'kawiarnia Torrevieja', 'kawiarnie Alicante', 'kawiarnia Alicante', 'cafeterías en Torrevieja', 'cafeterías en Alicante', 'cafetería Torrevieja', 'cafetería Alicante', 'cafés en Torrevieja', 'cafés en Alicante', 'coffee shops Torrevieja', 'coffee shops Alicante', 'cafés Costa Blanca'],
  alternates: { canonical: 'https://workandcoffee.example/' },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
