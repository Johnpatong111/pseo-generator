import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getPostBySlug(slug: string, lang: string = 'pl') {
  let fullPath = path.join(postsDirectory, lang, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.mdx`)
  }

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  
  try {
    const { data, content } = matter(fileContents)
    return {
      slug,
      lang,
      meta: data,
      content,
    }
  } catch (error) {
    console.error(`\n\n--- BŁĄD PARSOWANIA W PLIKU: ${fullPath} ---\n`, error)
    throw error
  }
}

export function getAllPosts() {
  const languages = ['pl', 'en', 'es']
  const allPosts: Array<{ slug: string; lang: string; meta: any; content: string }> = []

  languages.forEach((lang) => {
    const langDir = path.join(postsDirectory, lang)
    if (fs.existsSync(langDir)) {
      const fileNames = fs.readdirSync(langDir)
      fileNames.forEach((fileName) => {
        if (fileName.endsWith('.mdx')) {
          const slug = fileName.replace(/\.mdx$/, '')
          const post = getPostBySlug(slug, lang)
          if (post) {
            allPosts.push(post)
          }
        }
      })
    }
  })

  return allPosts
}