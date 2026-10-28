import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts'
import RelatedPosts from '@/components/RelatedPosts'

type PageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    lang: post.lang,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const post = getPostBySlug(slug, lang)

  if (!post) return {}

  const domain = 'https://good-mood-coffee.com/'
  const meta = post.meta

  // Domyślne wartości hreflang w przypadku braku mapowania w pliku mdx
  const slugs = meta.slugs || {
    pl: slug,
    en: slug,
    es: slug,
  }

  return {
    title: `${meta.title} | Work & Coffee`,
    description: meta.excerpt,
    alternates: {
      canonical: `${domain}/${lang}/blog/${slug}`,
      languages: {
        'pl-PL': `${domain}/pl/blog/${slugs.pl}`,
        'en-US': `${domain}/en/blog/${slugs.en}`,
        'es-ES': `${domain}/es/blog/${slugs.es}`,
        'x-default': `${domain}/en/blog/${slugs.en}`,
      },
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params
  const post = getPostBySlug(slug, lang)

  if (!post) {
    notFound()
  }

  // Pobieramy powiązane artykuły w tym samym języku
  const relatedPosts = getRelatedPosts(slug, lang, 3)

  // Etykieta przycisku powrotu w zależności od języka
  const backText = {
    pl: '← Wróć do listy artykułów',
    en: '← Back to all posts',
    es: '← Volver a todos los artículos',
  }[lang] || '← Back'

  return (
    <main className="min-h-screen bg-[#121212] text-zinc-100 px-4 py-12 md:py-16">
      <article className="max-w-3xl mx-auto space-y-8">
        
        {/* Przycisk powrotu */}
        <Link 
          href={`/${lang}/blog`} 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#C68A4C] transition-colors"
        >
          {backText}
        </Link>
        
        {/* Nagłówek artykułu */}
        <header className="space-y-4 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            {post.meta.date && <time>{post.meta.date}</time>}
            {post.meta.author && (
              <>
                <span>•</span>
                <span>Autor: {post.meta.author}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.meta.title}
          </h1>

          {post.meta.excerpt && (
            <p className="text-lg text-zinc-400 leading-relaxed">
              {post.meta.excerpt}
            </p>
          )}
        </header>

        {/* Zdjęcie wyróżniające (jeśli istnieje) */}
        {post.meta.coverImage && post.meta.coverImage !== '/placeholder.jpg' && (
          <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-800">
            <Image
              src={post.meta.coverImage}
              alt={post.meta.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Treść MDX w ciemnym stylu */}
        <div className="prose prose-invert prose-amber max-w-none 
          prose-headings:text-zinc-100 prose-p:text-zinc-300 
          prose-strong:text-white prose-li:text-zinc-300 
          prose-h3:text-[#C68A4C]">
          <MDXRemote source={post.content} />
        </div>

        {/* Sekcja powiązanych artykułów (Linkowanie wewnętrzne) */}
        <RelatedPosts posts={relatedPosts} lang={lang} />

      </article>
    </main>
  )
}