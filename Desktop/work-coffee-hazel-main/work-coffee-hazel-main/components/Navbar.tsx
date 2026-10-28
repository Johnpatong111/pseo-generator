'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavbarProps = {
  lang: string
}

export default function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname()

  // Słownik nawigacji w zależności od języka
  const navLabels = {
    pl: { cafes: 'Kawiarnie', blog: 'Blog' },
    en: { cafes: 'Cafes', blog: 'Blog' },
    es: { cafes: 'Cafeterías', blog: 'Blog' },
  }[lang] || { cafes: 'Cafes', blog: 'Blog' }

  // Flagi i języki
  const languages = [
    { code: 'pl', label: 'PL', flag: '🇵🇱' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
  ]

  // Funkcja zmieniająca język w obecnej ścieżce
  const getLanguageUrl = (targetLang: string) => {
    if (!pathname) return `/${targetLang}`
    const segments = pathname.split('/')
    segments[1] = targetLang // Podmieniamy kod języka w URL
    return segments.join('/')
  }

  return (
    <nav className="w-full bg-[#121212]/90 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo / Nazwa Strony */}
        <Link href={`/${lang}`} className="text-xl font-extrabold text-white tracking-tight">
          Work <span className="text-[#C68A4C]">&</span> Coffee
        </Link>

        {/* Linki nawigacyjne i flaga */}
        <div className="flex items-center gap-6">
          <Link
            href={`/${lang}`}
            className="text-sm font-medium text-zinc-300 hover:text-[#C68A4C] transition-colors"
          >
            {navLabels.cafes}
          </Link>

          <Link
            href={`/${lang}/blog`}
            className="text-sm font-medium text-zinc-300 hover:text-[#C68A4C] transition-colors"
          >
            {navLabels.blog}
          </Link>

          {/* Przełącznik języków (Flagi) */}
          <div className="flex items-center gap-2 pl-4 border-l border-zinc-800">
            {languages.map((item) => {
              const isActive = lang === item.code
              return (
                <Link
                  key={item.code}
                  href={getLanguageUrl(item.code)}
                  title={item.label}
                  className={`text-lg px-2 py-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-zinc-800 border border-[#C68A4C]/50 scale-105'
                      : 'opacity-60 hover:opacity-100 hover:bg-zinc-800/50'
                  }`}
                >
                  <span role="img" aria-label={item.label}>
                    {item.flag}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </nav>
  )
}