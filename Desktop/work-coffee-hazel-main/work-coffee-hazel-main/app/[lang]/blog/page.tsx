import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/posts'

type PageProps = {
  params: Promise<{ lang: string }>
}

export const dynamic = 'force-dynamic'

// 1. ZOPTYMALIZOWANE METATAGI I SŁOWA KLUCZOWE
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const domain = 'https://good-mood-coffee.com'

  const metaData = {
    pl: {
      title: 'Blog o Kawiarniach i Pracy Zdalnej | Work & Coffee',
      description: 'Przewodnik po najlepszych kawiarniach do pracy z laptopem, spotkań i odpoczynku w Torrevieja, Alicante i na Costa Blanca.',
      keywords: ['kawiarnia torrevieja', 'kawiarnia alicante', 'praca zdalna costa blanca', 'kawiarnia do pracy z laptopem', 'specialty coffee alicante', 'gdzie na kawe torrevieja'],
    },
    en: {
      title: 'Coffee & Remote Work Blog | Work & Coffee',
      description: 'Discover the best cafes for remote work, laptop friendly spots, and specialty coffee in Torrevieja, Alicante, and Costa Blanca.',
      keywords: ['cafes in torrevieja', 'cafes in alicante', 'laptop friendly cafes costa blanca', 'remote work alicante', 'best coffee torrevieja'],
    },
    es: {
      title: 'Blog de Cafeterías y Trabajo Remoto | Work & Coffee',
      description: 'Guía de las mejores cafeterías para trabajar con portátil, reuniones y café de especialidad en Torrevieja, Alicante y Costa Blanca.',
      keywords: ['cafeterias en torrevieja', 'cafeterias en alicante', 'trabajar con portatil alicante', 'cafe de especialidad torrevieja'],
    },
  }[lang] || {
    title: 'Coffee & Remote Work Blog | Work & Coffee',
    description: 'Discover the best cafes for remote work in Torrevieja & Alicante.',
    keywords: ['cafes torrevieja', 'cafes alicante'],
  }

  return {
    title: metaData.title,
    description: metaData.description,
    keywords: metaData.keywords,
    alternates: {
      canonical: `${domain}/${lang}/blog`,
      languages: {
        'pl-PL': `${domain}/pl/blog`,
        'en-US': `${domain}/en/blog`,
        'es-ES': `${domain}/es/blog`,
        'x-default': `${domain}/en/blog`,
      },
    },
    openGraph: {
      title: metaData.title,
      description: metaData.description,
      url: `${domain}/${lang}/blog`,
      siteName: 'Work & Coffee',
      locale: lang === 'pl' ? 'pl_PL' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  }
}

export default async function BlogListPage({ params }: PageProps) {
  const { lang } = await params
  
  const allPosts = getAllPosts()
  const posts = allPosts.filter((post) => post.lang === lang)

  const backLabels = {
    pl: '← Wróć do kawiarni w Torrevieja i Alicante',
    en: '← Back to cafes in Torrevieja & Alicante',
    es: '← Volver a cafeterías en Torrevieja y Alicante',
  }[lang] || '← Back to cafes'

  return (
    <main className="min-h-screen bg-[#171614] text-[#f5f0e8] px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm text-[#8c877e] hover:text-[#c98d54] transition-colors"
          >
            {backLabels}
          </Link>
        </div>

        <header className="space-y-4">
          <div className="flex items-center gap-2 text-[#c98d54] text-xs font-semibold tracking-widest uppercase">
            <span className="w-8 h-[1px] bg-[#c98d54]"></span>
            <span>Baza wiedzy & poradniki</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Blog Work <span className="text-[#c98d54]">&</span> Coffee.
          </h1>
          <p className="text-[#9d978e] max-w-2xl text-lg">
            Odkryj przydatne wskazówki dotyczące pracy zdalnej, najlepszych kawiarni do pracy oraz stylu życia na Costa Blanca.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-[#211f1c] border border-[#302d29] rounded-2xl overflow-hidden flex flex-col hover:border-[#c98d54]/50 transition-all duration-300 group"
            >
              {post.meta.coverImage && (
                <div className="relative h-48 w-full bg-[#2a2723] overflow-hidden">
                  <Image
                    src={post.meta.coverImage}
                    alt={post.meta.title || 'Blog post cover'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-xs text-[#8c877e]">
                    {post.meta.date && <time>{post.meta.date}</time>}
                  </div>

                  <h2 className="text-xl font-bold text-white group-hover:text-[#c98d54] transition-colors leading-snug">
                    <Link href={`/${lang}/blog/${post.slug}`}>
                      {post.meta.title}
                    </Link>
                  </h2>

                  {post.meta.excerpt && (
                    <p className="text-sm text-[#9d978e] line-clamp-3 leading-relaxed">
                      {post.meta.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#302d29]">
                  <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-[#c98d54] hover:underline gap-1"
                  >
                    Czytaj więcej &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  )
}