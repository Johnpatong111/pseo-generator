import Link from 'next/link';

interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
}

interface RelatedPostsProps {
  posts: PostMeta[];
  lang: string;
}

const titles = {
  pl: "Powiązane artykuły",
  en: "Related Articles",
  es: "Artículos relacionados"
};

export default function RelatedPosts({ posts, lang }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="text-2xl font-bold mb-6 text-foreground">
        {titles[lang as keyof typeof titles] || titles.en}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/${lang}/blog/${post.slug}`}
            className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300"
          >
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}