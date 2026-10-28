import type { Metadata } from 'next'
import { WorkCoffeeApp } from '@/components/work-coffee-app'

type PageProps = {
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return [{ lang: 'pl' }, { lang: 'en' }, { lang: 'es' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const domain = 'https://good-mood-coffee.com'

  const meta = {
    pl: {
      title: 'Kawiarnie Torrevieja — good-mood-coffee.com',
      description: 'Szukasz kawiarni w Torrevieja do pracy z laptopem lub spotkania? Odkryj miejsca z szybkim Wi-Fi i dobrą kawą nad Costa Blanca.',
    },
    en: {
      title: 'The Best Cafes in Torrevieja | good-mood-coffee.com',
      description: 'Looking for laptop friendly cafes in Torrevieja? Discover top spots with fast Wi-Fi and great specialty coffee.',
    },
    es: {
      title: 'Los mejores caféterias en Torrevieja | good-mood-coffee.com',
      description: '¿Buscas cafeterías en Torrevieja para trabajar con portátil? Encuentra los mejores lugares con Wi-Fi rápido y buen café.',
    },
  }[lang] || {
    title: 'Cafes in Torrevieja | good-mood-coffee.com',
    description: 'Best cafes in Torrevieja for remote work.',
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${domain}/${lang}`,
      languages: {
        'pl-PL': `${domain}/pl`,
        'en-US': `${domain}/en`,
        'es-ES': `${domain}/es`,
        'x-default': `${domain}/en`,
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params
  return <WorkCoffeeApp initialCity="Torrevieja" lang={lang as 'pl' | 'en' | 'es'} />
}