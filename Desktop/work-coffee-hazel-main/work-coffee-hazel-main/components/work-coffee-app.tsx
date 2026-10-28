'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Coffee, MapPin, Search, Star, X, ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import { places, type Place, type CityName } from '@/lib/places'
import { SeoSection } from '@/components/seo-section'
import { heroTexts } from '@/lib/seo-data'

type Locale = 'pl' | 'en' | 'es'

const copy = {
  pl: { search: 'Szukaj kawiarni', placeholder: 'Szukaj po nazwie, mieście lub dzielnicy...', add: 'Dodaj kawiarnię', blog: 'Blog', allCities: 'Wszystkie miasta', anyWifi: 'Wi-Fi — bez informacji', fast: 'Wi-Fi dostępne', veryFast: 'Wi-Fi dostępne', discover: 'Odkryj kawiarnię w swojej okolicy', recommended: 'Polecane kawiarnie', added: 'Ostatnio dodane', open: 'Otwarte', details: 'Zobacz szczegóły', filters: 'Filtry', empty: 'Nie znaleźliśmy kawiarni pasującej do filtrów.', addTitle: 'Dodaj kawiarnię', addIntro: 'Poleć miejsce, które warto odwiedzić.', name: 'Nazwa kawiarni', address: 'Adres', city: 'Miasto', amenities: 'Udogodnienia', choose: 'Wybierz...', submit: 'Dodaj miejsce', close: 'Zamknij formularz', detailsTitle: 'Szczegóły kawiarni', hours: 'Godziny otwarcia', days: 'Dni otwarcia', standout: 'Czym się wyróżnia', everyDay: 'Codziennie', weekdays: 'Poniedziałek – piątek', weekend: 'Weekend', closeDetails: 'Zamknij szczegóły', maps: 'Otwórz w Google Maps', tags: ['Szybkie Wi-Fi', 'Dużo gniazdek', 'Cicho', 'Dobra kawa'] },
  en: { search: 'Search cafés', placeholder: 'Search by name, city or neighbourhood...', add: 'Add a café', blog: 'Blog', allCities: 'All cities', anyWifi: 'Wi-Fi — no information', fast: 'Wi-Fi available', veryFast: 'Wi-Fi available', discover: 'Discover a café near you', recommended: 'Recommended cafés', added: 'Recently added', open: 'Open', details: 'View details', filters: 'Filters', empty: 'No café matches your filters.', addTitle: 'Add a café', addIntro: 'Recommend a place worth visiting.', name: 'Café name', address: 'Address', city: 'City', amenities: 'Amenities', choose: 'Choose...', submit: 'Add place', close: 'Close form', detailsTitle: 'Café details', hours: 'Opening hours', days: 'Opening days', standout: 'What makes it special', everyDay: 'Every day', weekdays: 'Monday – Friday', weekend: 'Weekend', closeDetails: 'Close details', maps: 'Open in Google Maps', tags: ['Fast Wi-Fi', 'Lots of outlets', 'Quiet', 'Great coffee'] },
  es: { search: 'Buscar cafeterías', placeholder: 'Busca por nombre, ciudad o barrio...', add: 'Añadir cafetería', blog: 'Blog', allCities: 'Todas las ciudades', anyWifi: 'Wi-Fi — sin información', fast: 'Wi-Fi disponible', veryFast: 'Wi-Fi disponible', discover: 'Descubre una cafetería cerca de ti', recommended: 'Cafeterías recomendadas', added: 'Añadidas recientemente', open: 'Abierto', details: 'Ver detalles', filters: 'Filtros', empty: 'No encontramos una cafetería con estos filtros.', addTitle: 'Añadir cafetería', addIntro: 'Recomienda un lugar que merezca la pena visitar.', name: 'Nombre de la cafetería', address: 'Dirección', city: 'Ciudad', amenities: 'Servicios', choose: 'Elige...', submit: 'Añadir lugar', close: 'Cerrar formulario', detailsTitle: 'Detalles de la cafetería', hours: 'Horario', days: 'Días de apertura', standout: 'Qué la hace especial', everyDay: 'Todos los días', weekdays: 'Lunes – viernes', weekend: 'Fin de semana', closeDetails: 'Cerrar detalles', maps: 'Abrir en Google Maps', tags: ['Wi-Fi rápido', 'Muchos enchufes', 'Tranquilo', 'Buen café'] },
} as const

function getGoogleMapsUrl(place: Place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.area},${place.city}`)}`
}

export function WorkCoffeeApp({ 
  initialCity = 'all',
  lang = 'pl'
}: { 
  initialCity?: 'all' | CityName;
  lang?: Locale;
}) {
  const router = useRouter()
  const [language, setLanguage] = useState<Locale>(lang)
  const t = copy[language]

  const [query, setQuery] = useState('')
  const [wifi, setWifi] = useState(t.anyWifi)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const filteredPlaces = useMemo(() => {
    return places.filter(
      (place) =>
        `${place.name} ${place.city} ${place.area}`.toLowerCase().includes(query.toLowerCase()) &&
        (initialCity === 'all' || place.city === initialCity) &&
        (wifi === t.anyWifi || place.wifi !== 'Unknown')
    )
  }, [query, initialCity, wifi, t])

  const handleCityChange = (selectedVal: string) => {
    if (selectedVal === 'Torrevieja' || selectedVal === 'all') {
      router.push(`/${language}`)
    } else {
      const slug = selectedVal.toLowerCase().replace(/\s+/g, '-')
      router.push(`/${language}/${slug}`)
    }
  }

  const changeLanguage = (next: Locale) => {
    setLanguage(next)
    setWifi(copy[next].anyWifi)
    
    if (initialCity !== 'all' && initialCity !== 'Torrevieja') {
      const slug = (initialCity as string).toLowerCase().replace(/\s+/g, '-')
      router.push(`/${next}/${slug}`)
    } else {
      router.push(`/${next}`)
    }
  }

  const currentSelectValue = initialCity === 'all' ? 'Torrevieja' : initialCity
  const currentHero = heroTexts[currentSelectValue]?.[language] || heroTexts.Torrevieja[language]

  return (
    <main className="min-h-screen bg-[#171614] text-[#f5f0e8]">
      {/* NAGŁÓWEK / NAV */}
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-base font-semibold transition-opacity hover:opacity-90 sm:text-lg">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[#c98d54] text-[#171614] sm:size-9">
            <Coffee size={18} />
          </span>
          Work <span className="text-[#c98d54]">&amp;</span> Coffee
        </Link>

        {/* Wyszukiwarka DESKTOP */}
        <label className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c877e]" size={17} />
          <input
            aria-label={t.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="h-11 w-full rounded-xl border border-[#3a3733] bg-[#211f1c] pl-11 pr-4 text-sm outline-none focus:border-[#c98d54]"
          />
        </label>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/${language}/blog`}
            className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#d9d2c8] transition-colors hover:bg-[#211f1c] hover:text-[#c98d54] sm:px-3 sm:py-2 sm:text-sm"
          >
            {t.blog}
          </Link>

          <select
            aria-label="Language"
            value={language}
            onChange={(e) => changeLanguage(e.target.value as Locale)}
            className="h-9 cursor-pointer rounded-xl border border-[#3a3733] bg-[#211f1c] px-2 text-xs font-semibold text-[#d9d2c8] outline-none focus:border-[#c98d54] sm:h-10 sm:px-3"
          >
            <option value="pl" className="bg-[#211f1c] text-[#f5f0e8]">PL</option>
            <option value="en" className="bg-[#211f1c] text-[#f5f0e8]">EN</option>
            <option value="es" className="bg-[#211f1c] text-[#f5f0e8]">ES</option>
          </select>
        </div>
      </nav>

      {/* DYNAMICZNY HERO SECTION */}
      <section id="top" className="relative mx-auto max-w-[1240px] px-4 pb-8 pt-8 lg:px-8 lg:pb-12 lg:pt-16">
        <div className="relative max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c98d54] sm:mb-5 sm:text-xs">
            <span className="h-px w-6 bg-[#c98d54] sm:w-8" />
            {currentHero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {currentHero.title}
            <span className="text-[#c98d54]">.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#9d978e] sm:mt-6 sm:text-base sm:leading-7">
            {currentHero.intro}
          </p>
        </div>

        {/* Mobilna wyszukiwarka */}
        <div className="mt-6 block md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c877e]" size={16} />
            <input
              aria-label={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="h-11 w-full rounded-xl border border-[#3a3733] bg-[#211f1c] pl-10 pr-4 text-sm outline-none focus:border-[#c98d54]"
            />
          </div>
        </div>

        {/* Pasek filtrów */}
        <div className="relative mt-4 grid gap-2 rounded-2xl border border-[#393531] bg-[#211f1c] p-2 sm:mt-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_auto]">
          <div className="flex items-center gap-3 rounded-xl bg-[#2a2723] px-4 py-3">
            <MapPin size={17} className="shrink-0 text-[#c98d54]" />
            <select
              aria-label={t.city}
              value={currentSelectValue}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm text-[#f5f0e8] outline-none"
            >
              <option value="Torrevieja" className="bg-[#211f1c] text-[#f5f0e8]">Torrevieja</option>
              <option value="Alicante" className="bg-[#211f1c] text-[#f5f0e8]">Alicante</option>
              <option value="Orihuela Costa" className="bg-[#211f1c] text-[#f5f0e8]">Orihuela Costa</option>
            </select>
          </div>

          <select
            aria-label={t.anyWifi}
            value={wifi}
            onChange={(e) => setWifi(e.target.value)}
            className="cursor-pointer rounded-xl bg-[#2a2723] px-4 py-3 text-sm text-[#f5f0e8] outline-none"
          >
            <option value={t.anyWifi} className="bg-[#211f1c] text-[#f5f0e8]">{t.anyWifi}</option>
            <option value={t.fast} className="bg-[#211f1c] text-[#f5f0e8]">{t.fast}</option>
          </select>

          <button aria-label={t.filters} className="hidden items-center justify-center rounded-xl border border-[#46413b] px-4 lg:flex">
            <SlidersHorizontal size={17} />
          </button>
        </div>
      </section>

      {/* KAWIARNIE GRID */}
      <section className="mx-auto max-w-[1240px] px-4 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-[#302d29] pb-5">
          <div>
            <p className="text-xs text-[#8c877e] sm:text-sm">{t.discover}</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              {t.recommended} <span className="ml-1 text-xs font-normal text-[#6f6a63] sm:text-sm">{filteredPlaces.length}</span>
            </h2>
          </div>
        </div>

        {filteredPlaces.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#8c877e]">{t.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredPlaces.map((place, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPlace(place)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#302d29] bg-[#211f1c] transition-all duration-300 hover:border-[#c98d54]/50"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[#2a2723] sm:h-52">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-[#171614]/80 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                    {t.open}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold transition-colors group-hover:text-[#c98d54] sm:text-lg">{place.name}</h3>
                      <p className="text-xs text-[#8c877e]">{place.area}, {place.city}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#c98d54]">
                      <Star size={14} fill="#c98d54" />
                      {place.rating}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4">
                    {place.tags.map((tag, i) => (
                      <span key={i} className="rounded-md bg-[#2a2723] px-2 py-0.5 text-[10px] text-[#a8a299] sm:py-1 sm:text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DYNAMICZNY SEO BLOK (MODUŁOWY) */}
      <SeoSection city={currentSelectValue} lang={language} />

      {/* MODAL / POPUP */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#393531] bg-[#211f1c] p-5 space-y-4 text-[#f5f0e8] sm:p-6">
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-[#8c877e] transition-colors hover:bg-[#2a2723] hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="pr-6 text-xl font-bold text-[#c98d54] sm:text-2xl">{selectedPlace.name}</h3>
            <p className="text-xs text-[#8c877e] sm:text-sm">{selectedPlace.area}, {selectedPlace.city}</p>
            {selectedPlace.highlight && <p className="text-xs leading-relaxed text-[#d9d2c8] sm:text-sm">{selectedPlace.highlight}</p>}
            
            <div className="pt-2">
              <a
                href={getGoogleMapsUrl(selectedPlace)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c98d54] px-4 py-2.5 text-sm font-semibold text-[#171614] transition-colors hover:bg-[#b87d46] sm:w-auto"
              >
                <ArrowUpRight size={16} /> {t.maps}
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}