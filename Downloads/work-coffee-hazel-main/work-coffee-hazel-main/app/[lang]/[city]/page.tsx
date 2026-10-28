import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import CoffeeMap from '@/components/CoffeeMapClient'
import { WorkCoffeeApp } from '@/components/work-coffee-app'
import { places } from '@/lib/places'

type PageProps = {
  params: Promise<{ lang: string; city: string }>
}

const validCities = ['alicante', 'orihuela-costa']

const cityNames: Record<string, 'Alicante' | 'Orihuela Costa'> = {
  'alicante': 'Alicante',
  'orihuela-costa': 'Orihuela Costa',
}

const titles: Record<string, Record<string, string>> = {
  'alicante': {
    pl: 'Kawiarnia w Alicante – Najlepsze miejsce na kawę | good-mood-coffee.com',
    en: 'Café in Alicante – Best Place for Coffee | good-mood-coffee.com',
    es: 'Cafetería en Alicante – El mejor lugar para tomar café | good-mood-coffee.com',
  },
  'orihuela-costa': {
    pl: 'Kawiarnia w Orihuela Costa – Najlepsze miejsce na kawę | good-mood-coffee.com',
    en: 'Café in Orihuela Costa – Best Place for Coffee | good-mood-coffee.com',
    es: 'Cafetería en Orihuela Costa – El mejor lugar para tomar café | good-mood-coffee.com',
  },
}

const descriptions: Record<string, Record<string, string>> = {
  'alicante': {
    pl: 'Odkryj najlepsze kawiarnie w Alicante do pracy zdalnej, spotkań i pysznej kawy specialty.',
    en: 'Discover the best cafés in Alicante for remote work, meetings, and specialty coffee.',
    es: 'Descubre las mejores cafeterías en Alicante para trabajar con portátil y disfrutar de buen café.',
  },
  'orihuela-costa': {
    pl: 'Znajdź idealną kawiarnię na Orihuela Costa do pracy z laptopem i relaksu nad morzem.',
    en: 'Find the ideal café in Orihuela Costa for remote work and relaxing by the sea.',
    es: 'Encuentra la cafetería ideal en Orihuela Costa para trabajar y relajarte junto al mar.',
  },
}

export async function generateStaticParams() {
  const languages = ['pl', 'en', 'es']
  const params: { lang: string; city: string }[] = []

  for (const lang of languages) {
    for (const city of validCities) {
      params.push({ lang, city })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city } = await params
  const normalizedCity = city ? city.toLowerCase() : ''

  if (!validCities.includes(normalizedCity)) return {}

  const domain = 'https://good-mood-coffee.com'
  const currentTitle = titles[normalizedCity]?.[lang] || titles[normalizedCity]?.pl
  const currentDesc = descriptions[normalizedCity]?.[lang] || descriptions[normalizedCity]?.pl

  return {
    title: currentTitle,
    description: currentDesc,
    alternates: {
      canonical: `${domain}/${lang}/${normalizedCity}`,
    },
  }
}

export default async function CityPage({ params }: PageProps) {
  const resolvedParams = await params
  const lang = resolvedParams?.lang || 'pl'
  const city = resolvedParams?.city || ''

  const normalizedCity = city.toLowerCase()

  if (normalizedCity === 'torrevieja') {
    redirect(`/${lang}`)
  }

  if (!validCities.includes(normalizedCity)) {
    notFound()
  }

  const initialCity = cityNames[normalizedCity]

  // Filtrowanie kawiarni dla wybranego miasta
  const cityPlaces = places.filter(p => p.city === initialCity)

  // Formatowanie danych dla komponentu mapy
  const mapCafes = cityPlaces.map(p => ({
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    area: p.area,
    slug: p.slug,
    lang,
  }))

  // Współrzędne środka mapy w zależności od miasta
  const mapCenter: [number, number] = initialCity === 'Alicante' ? [38.3452, -0.4810] : [37.9150, -0.7250]

  return (
    <main className="min-h-screen bg-[#171614] text-[#f5f0e8] px-4 py-8 max-w-7xl mx-auto">
      {/* Interaktywna mapa nad głównym widokiem */}
      <div className="mb-8">
        <CoffeeMap cafes={mapCafes} center={mapCenter} zoom={13} />
      </div>

      <WorkCoffeeApp initialCity={initialCity} lang={lang as 'pl' | 'en' | 'es'} />
    </main>
  )
}