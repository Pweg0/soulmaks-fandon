import fs from 'fs/promises'
import path from 'path'
import type { ScrapedContent } from './types'

export async function writeMdx(item: ScrapedContent, contentDir: string): Promise<string> {
  const dir = path.join(contentDir, item.category)
  await fs.mkdir(dir, { recursive: true })

  const frontmatter = [
    '---',
    `title: "${item.title}"`,
    `slug: "${item.slug}"`,
    `category: "${item.category}"`,
    ...(item.subcategory ? [`subcategory: "${item.subcategory}"`] : []),
    `gameVersion: "${item.gameVersion ?? 'unknown'}"`,
    `lastScrapedAt: "${new Date().toISOString().split('T')[0]}"`,
    `sourceUrl: "${item.sourceUrl}"`,
    `published: false`,
    '---',
    '',
    item.body,
  ].join('\n')

  const filePath = path.join(dir, `${item.slug}.mdx`)
  await fs.writeFile(filePath, frontmatter, 'utf-8')
  return filePath
}
