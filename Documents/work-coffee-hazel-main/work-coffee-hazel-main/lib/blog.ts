import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const blogDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  title: string
  date: string
  excerpt: string
  author: string
  coverImage: string
  translationKey: string
  slug: string
  contentHtml?: string
}

// Pobieranie wszystkich postów dla danego języka (bez filtrowania dat, wszystko publikowane od razu)
export function getScheduledPosts(lang: string = 'pl'): BlogPost[] {
  const langDir = path.join(blogDirectory, lang)
  if (!fs.existsSync(langDir)) return []

  const fileNames = fs.readdirSync(langDir)

  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(langDir, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      const slug = fileName.replace(/\.mdx?$/, '')

      return {
        title: data.title,
        date: data.date || '',
        excerpt: data.excerpt,
        author: data.author,
        coverImage: data.coverImage,
        translationKey: data.translationKey,
        slug: data.slugs?.[lang] || slug, // Pobiera slug z frontmattera lub używa nazwy pliku
      } as BlogPost
    })

  // Sortowanie od najnowszego (jeśli brak daty, wrzuca na koniec)
  return allPosts.sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

// Pobieranie konkretnego artykułu po jego slugu i języku
export async function getPostBySlug(lang: string, slug: string) {
  const langDir = path.join(blogDirectory, lang)
  if (!fs.existsSync(langDir)) return null

  const fileNames = fs.readdirSync(langDir)

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) continue

    const fullPath = path.join(langDir, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const fileSlug = data.slugs?.[lang] || fileName.replace(/\.mdx?$/, '')

    if (fileSlug === slug) {
      const processedContent = await remark().use(html).process(content)
      const contentHtml = processedContent.toString()

      return {
        ...data,
        slug: fileSlug,
        contentHtml,
      }
    }
  }

  return null
}